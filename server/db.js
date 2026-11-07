import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
// Supports standard DATABASE_URL (Render, Supabase, Neon, Railway, Heroku)
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes('localhost') 
    ? { rejectUnauthorized: false } 
    : false,
});

/**
 * Initialize PostgreSQL Database Schema
 * Automatically creates all tables and constraints on startup.
 */
export async function initPostgres() {
  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL not detected. PostgreSQL features are running in fallback mode.');
    return false;
  }

  const client = await pool.connect();
  try {
    console.log('🔄 Connected to PostgreSQL. Initializing schema...');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT,
        provider VARCHAR(32) DEFAULT 'email_password',
        company VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // 2. Reviews Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(64) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        company VARCHAR(255),
        rating INT DEFAULT 5,
        title VARCHAR(255),
        content TEXT,
        card_type VARCHAR(255),
        video_url TEXT,
        video_type VARCHAR(32),
        image_url TEXT,
        status VARCHAR(32) DEFAULT 'approved',
        is_featured BOOLEAN DEFAULT false,
        date VARCHAR(32),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
    `);

    // 3. Inquiries Table (Card Orders & Quotes)
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(64) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        company VARCHAR(255),
        card_type VARCHAR(255),
        material VARCHAR(255),
        font_color VARCHAR(64),
        quantity INT DEFAULT 1,
        target_url TEXT,
        logo_attached BOOLEAN DEFAULT false,
        custom_notes TEXT,
        status VARCHAR(32) DEFAULT 'new',
        date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
    `);

    // 4. Products Table (Card Plans)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tagline TEXT,
        category VARCHAR(64),
        badge VARCHAR(64),
        description TEXT,
        bullet_points JSONB,
        pricing_structure JSONB,
        delivery_spec JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Site Content CMS
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. Admin Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key VARCHAR(64) PRIMARY KEY,
        value TEXT NOT NULL
      );
      INSERT INTO admin_settings (key, value)
      VALUES ('admin_pass', 'Yaksh@1416')
      ON CONFLICT (key) DO NOTHING;

      INSERT INTO admin_settings (key, value)
      VALUES ('admin_email', 'yakshbarot597@gmail.com')
      ON CONFLICT (key) DO NOTHING;
    `);

    console.log('✅ PostgreSQL Schema initialized successfully.');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL Schema initialization error:', error);
    return false;
  } finally {
    client.release();
  }
}
