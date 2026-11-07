import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { pool, initPostgres } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper: Hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// --- HEALTH CHECK ---
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const result = await pool.query('SELECT NOW()');
    if (result.rows.length) dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error: ' + err.message;
  }
  res.json({
    status: 'ok',
    database: 'PostgreSQL',
    dbConnection: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// --- AUTHENTICATION ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0]).trim();
    const passwordHash = hashPassword(password);
    const userId = 'usr-' + Date.now();

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password_hash, provider, company)
       VALUES ($1, $2, $3, $4, 'email_password', 'Verified Member')
       RETURNING id, name, email, provider, company, created_at`,
      [userId, cleanName, cleanEmail, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);

    const result = await pool.query(
      `SELECT id, name, email, password_hash, provider, company FROM users WHERE email = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    const user = result.rows[0];
    if (user.password_hash !== passwordHash) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    delete user.password_hash;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const passRes = await pool.query("SELECT value FROM admin_settings WHERE key = 'admin_pass'");
    const emailRes = await pool.query("SELECT value FROM admin_settings WHERE key = 'admin_email'");

    const correctPass = passRes.rows[0]?.value || 'Yaksh@1416';
    const correctEmail = (emailRes.rows[0]?.value || 'yakshbarot597@gmail.com').toLowerCase();

    if (cleanEmail === correctEmail && cleanPass === correctPass) {
      return res.json({ success: true, token: 'admin_session_' + Date.now() });
    }
    res.status(401).json({ error: 'Invalid admin credentials.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- REVIEWS ---
app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, customer_name AS "customerName", customer_email AS "customerEmail",
              company, rating, title, content, card_type AS "cardType",
              video_url AS "videoUrl", video_type AS "videoType", image_url AS "imageUrl",
              status, is_featured AS "isFeatured", date, created_at AS "createdAt"
       FROM reviews
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const rev = req.body;
    const reviewId = rev.id || 'rev-' + Date.now();
    const dateStr = rev.date || new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `INSERT INTO reviews (
        id, customer_name, customer_email, company, rating, title, content,
        card_type, video_url, video_type, image_url, status, is_featured, date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        reviewId,
        rev.customerName,
        rev.customerEmail || null,
        rev.company || rev.role || 'Verified Customer',
        rev.rating || 5,
        rev.title || null,
        rev.content || rev.reviewText || '',
        rev.cardType || 'Google 5-Star Review Tap Card Plan',
        rev.videoUrl || null,
        rev.videoType || null,
        rev.imageUrl || null,
        rev.status || 'approved',
        rev.isFeatured || false,
        dateStr
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id/video', async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET video_url = NULL, video_type = NULL WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id/image', async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET image_url = NULL WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/reviews/:id/feature', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE reviews SET is_featured = NOT is_featured WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INQUIRIES (CARD QUOTES & ORDERS) ---
app.get('/api/inquiries', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, customer_name AS "customerName", email, phone, company,
              card_type AS "cardType", material, font_color AS "fontColor",
              quantity, target_url AS "targetUrl", logo_attached AS "logoAttached",
              custom_notes AS "customNotes", status, date
       FROM inquiries
       ORDER BY date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries/user/:email', async (req, res) => {
  try {
    const cleanEmail = req.params.email.trim().toLowerCase();
    const result = await pool.query(
      `SELECT id, customer_name AS "customerName", email, phone, company,
              card_type AS "cardType", material, font_color AS "fontColor",
              quantity, target_url AS "targetUrl", logo_attached AS "logoAttached",
              custom_notes AS "customNotes", status, date
       FROM inquiries
       WHERE LOWER(email) = $1
       ORDER BY date DESC`,
      [cleanEmail]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const inq = req.body;
    const inquiryId = inq.id || 'inq-' + Date.now();

    const result = await pool.query(
      `INSERT INTO inquiries (
        id, customer_name, email, phone, company, card_type, material,
        font_color, quantity, target_url, logo_attached, custom_notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        inquiryId,
        inq.customerName,
        inq.email.trim().toLowerCase(),
        inq.phone || null,
        inq.company || null,
        inq.cardType,
        inq.material,
        inq.fontColor || null,
        inq.quantity || 1,
        inq.targetUrl || null,
        inq.logoAttached || false,
        inq.customNotes || null,
        inq.status || 'new'
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/inquiries/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM inquiries WHERE id = $1', [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- STATIC FRONTEND SERVING (RENDER DEPLOYMENT) ---
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to React index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
async function start() {
  await initPostgres();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 PostgreSQL Ready. Frontend served from ${distPath}`);
  });
}

start();
