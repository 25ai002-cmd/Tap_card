import { INITIAL_SITE_CONTENT, INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_INQUIRIES } from '../data/initialData';
import { dbService } from './db';
import { api } from './api';

let memoryReviewsCache = null;

// Synchronize memory cache from PostgreSQL backend or IndexedDB on startup
if (typeof window !== 'undefined') {
  api.getReviews().then((pgReviews) => {
    if (pgReviews && pgReviews.length > 0) {
      memoryReviewsCache = pgReviews;
      window.dispatchEvent(new Event('tapnova_reviews_updated'));
    } else {
      dbService.getAllReviews().then((idbReviews) => {
        if (idbReviews && idbReviews.length > 0) {
          memoryReviewsCache = idbReviews;
          window.dispatchEvent(new Event('tapnova_reviews_updated'));
        }
      });
    }
  });
}

const KEYS = {
  SITE_CONTENT: 'tapnova_site_content',
  PRODUCTS: 'tapnova_products',
  REVIEWS: 'tapnova_reviews',
  INQUIRIES: 'tapnova_inquiries',
  CURRENT_USER: 'tapnova_user',
  REGISTERED_USERS: 'tapnova_registered_users',
  USER_SAVED_CARDS: 'tapnova_user_saved_cards',
  ADMIN_AUTH: 'tapnova_admin_auth',
  ADMIN_EMAIL: 'tapnova_admin_email',
  ADMIN_PASS: 'tapnova_admin_pass'
};

const DEFAULT_ADMIN_EMAIL = 'yakshbarot597@gmail.com';
const DEFAULT_ADMIN_PASS = 'Yaksh@1416';

export const storage = {
  // --- Site Content (CMS) ---
  getSiteContent: () => {
    try {
      const data = localStorage.getItem(KEYS.SITE_CONTENT);
      if (!data) return INITIAL_SITE_CONTENT;
      const parsed = JSON.parse(data);
      if (parsed?.hero?.announcement?.includes('NFC') || parsed?.branding?.tagline?.includes('NFC')) {
        localStorage.setItem(KEYS.SITE_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
        return INITIAL_SITE_CONTENT;
      }
      return parsed;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  },

  saveSiteContent: (content) => {
    localStorage.setItem(KEYS.SITE_CONTENT, JSON.stringify(content));
    window.dispatchEvent(new Event('tapnova_content_updated'));
  },

  // --- Products Catalog (Lifetime Plans) ---
  getProducts: () => {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(data);
      // If still holding old legacy product IDs or legacy NFC badges, migrate to the new Plans
      if (Array.isArray(parsed) && (
        parsed.some(p => p.id === 'prod-1' || p.id === 'prod-2' || p.id === 'prod-3') ||
        parsed.some(p => p.lifetimeBadge === 'Lifetime NFC Card' || (p.tagline && p.tagline.includes('NFC')) || (p.description && p.description.includes('Built specifically for cash counters')))
      )) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: (products) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('tapnova_products_updated'));
  },

  addProduct: (product) => {
    const products = storage.getProducts();
    const newProduct = {
      ...product,
      id: 'prod-' + Date.now()
    };
    products.unshift(newProduct);
    storage.saveProducts(products);
    return newProduct;
  },

  updateProduct: (updated) => {
    const products = storage.getProducts();
    const index = products.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      products[index] = updated;
      storage.saveProducts(products);
    }
  },

  deleteProduct: (productId) => {
    const products = storage.getProducts().filter(p => p.id !== productId);
    storage.saveProducts(products);
  },

  // --- Customer Reviews & Video Moderation (IndexedDB + Storage) ---
  getReviews: () => {
    if (memoryReviewsCache && memoryReviewsCache.length > 0) {
      return memoryReviewsCache;
    }
    try {
      const data = localStorage.getItem(KEYS.REVIEWS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      // Clean out any dummy pre-seeded reviews & normalize content/reviewText
      const cleaned = Array.isArray(parsed) 
        ? parsed
            .filter(r => !['rev-1', 'rev-2', 'rev-3', 'rev-4'].includes(r.id))
            .map(r => ({
              ...r,
              content: r.content || r.reviewText || r.comment || "",
              reviewText: r.reviewText || r.content || r.comment || "",
              company: r.company || r.role || "Verified Customer"
            }))
        : [];
      memoryReviewsCache = cleaned;
      return cleaned;
    } catch {
      return [];
    }
  },

  saveReviews: async (reviews) => {
    memoryReviewsCache = reviews;

    // 1. High-capacity persistence: Save full reviews with large videos/photos to IndexedDB
    try {
      for (const r of reviews) {
        await dbService.putReview(r);
      }
    } catch (dbErr) {
      console.warn('IndexedDB write error:', dbErr);
    }

    // 2. Safe local metadata copy (omit giant base64 video URLs that crash localStorage)
    try {
      const safeForLocalStorage = reviews.map(r => {
        const isHugeVideo = typeof r.videoUrl === 'string' && r.videoUrl.length > 200000;
        const isHugeImage = typeof r.imageUrl === 'string' && r.imageUrl.length > 500000;
        return {
          ...r,
          videoUrl: isHugeVideo ? (r.videoType === 'url' ? r.videoUrl : '') : r.videoUrl,
          imageUrl: isHugeImage ? '' : r.imageUrl
        };
      });
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(safeForLocalStorage));
    } catch (lsErr) {
      console.warn('LocalStorage quota filled, full review & video preserved in IndexedDB.');
    }

    window.dispatchEvent(new Event('tapnova_reviews_updated'));
  },

  addReview: async (reviewData) => {
    // 1. Try PostgreSQL backend if available
    const pgReview = await api.createReview(reviewData);

    const reviews = storage.getReviews();
    const newReview = pgReview || {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
      isFeatured: false
    };
    reviews.unshift(newReview);
    await storage.saveReviews(reviews);
    return newReview;
  },

  deleteReview: async (reviewId) => {
    await api.deleteReview(reviewId);
    await dbService.deleteReview(reviewId);
    const reviews = storage.getReviews().filter(r => r.id !== reviewId);
    await storage.saveReviews(reviews);
  },

  // Authority to remove video from review while keeping review
  removeReviewVideo: async (reviewId) => {
    await api.removeReviewVideo(reviewId);
    const reviews = storage.getReviews();
    const target = reviews.find(r => r.id === reviewId);
    if (target) {
      target.videoUrl = '';
      target.videoType = '';
      await storage.saveReviews(reviews);
    }
  },

  // Authority to remove image from review
  removeReviewImage: async (reviewId) => {
    await api.removeReviewImage(reviewId);
    const reviews = storage.getReviews();
    const target = reviews.find(r => r.id === reviewId);
    if (target) {
      target.imageUrl = '';
      await storage.saveReviews(reviews);
    }
  },

  toggleFeaturedReview: (reviewId) => {
    const reviews = storage.getReviews();
    const target = reviews.find(r => r.id === reviewId);
    if (target) {
      target.isFeatured = !target.isFeatured;
      storage.saveReviews(reviews);
    }
  },

  // --- Inquiries ---
  getInquiries: () => {
    try {
      const data = localStorage.getItem(KEYS.INQUIRIES);
      return data ? JSON.parse(data) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  },

  saveInquiries: (inquiries) => {
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
    window.dispatchEvent(new Event('tapnova_inquiries_updated'));
  },

  addInquiry: async (inquiryData) => {
    // 1. Try PostgreSQL backend
    await api.createInquiry(inquiryData);

    const inquiries = storage.getInquiries();
    const newInquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      date: new Date().toISOString(),
      status: 'new'
    };
    inquiries.unshift(newInquiry);
    storage.saveInquiries(inquiries);
    return newInquiry;
  },

  updateInquiryStatus: async (inquiryId, status) => {
    await api.updateInquiryStatus(inquiryId, status);
    const inquiries = storage.getInquiries();
    const target = inquiries.find(i => i.id === inquiryId);
    if (target) {
      target.status = status;
      storage.saveInquiries(inquiries);
    }
  },

  deleteInquiry: async (inquiryId) => {
    await api.deleteInquiry(inquiryId);
    const inquiries = storage.getInquiries().filter(i => i.id !== inquiryId);
    storage.saveInquiries(inquiries);
  },

  // --- Private User Accounts & Password Authentication ---
  hashPassword: async (password) => {
    if (!password) return '';
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fb_' + Math.abs(hash).toString(16);
  },

  getRegisteredUsers: () => {
    try {
      const data = localStorage.getItem(KEYS.REGISTERED_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  registerUser: async ({ name, email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0]).trim();
    if (!cleanEmail || !password) {
      throw new Error('Please provide both email address and password.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // 1. Try PostgreSQL backend
    try {
      const pgUser = await api.register({ name: cleanName, email: cleanEmail, password });
      if (pgUser) {
        storage.setCurrentUser(pgUser);
        return pgUser;
      }
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // 2. Local fallback
    const users = storage.getRegisteredUsers();
    if (users.some(u => u.email === cleanEmail)) {
      throw new Error('An account with this email already exists. Please sign in.');
    }

    const passwordHash = await storage.hashPassword(password);
    const newUser = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      provider: 'email_password',
      company: 'Verified Member',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(users));

    const sessionUser = {
      name: newUser.name,
      email: newUser.email,
      provider: 'email_password',
      company: newUser.company,
      loggedInAt: new Date().toISOString()
    };
    storage.setCurrentUser(sessionUser);
    return sessionUser;
  },

  loginUserWithPassword: async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Please enter both your email and password.');
    }

    // 1. Try PostgreSQL backend
    try {
      const pgUser = await api.login(cleanEmail, password);
      if (pgUser) {
        storage.setCurrentUser(pgUser);
        return pgUser;
      }
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // 2. Local fallback
    const users = storage.getRegisteredUsers();
    const user = users.find(u => u.email === cleanEmail);
    if (!user) {
      throw new Error('No account found with this email. Please check your email or create an account.');
    }

    const passwordHash = await storage.hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    const sessionUser = {
      name: user.name,
      email: user.email,
      provider: 'email_password',
      company: user.company || 'Verified Member',
      loggedInAt: new Date().toISOString()
    };
    storage.setCurrentUser(sessionUser);
    return sessionUser;
  },

  // --- Private Scoped User Data ---
  getUserInquiries: (userEmail) => {
    if (!userEmail) return [];
    const target = userEmail.trim().toLowerCase();
    return storage.getInquiries().filter(i => (i.email || '').trim().toLowerCase() === target);
  },

  getUserSavedCards: (userEmail) => {
    if (!userEmail) return [];
    try {
      const data = localStorage.getItem(KEYS.USER_SAVED_CARDS);
      const all = data ? JSON.parse(data) : {};
      return all[userEmail.trim().toLowerCase()] || [];
    } catch {
      return [];
    }
  },

  saveUserSavedCard: (userEmail, cardDesign) => {
    if (!userEmail) return;
    try {
      const data = localStorage.getItem(KEYS.USER_SAVED_CARDS);
      const all = data ? JSON.parse(data) : {};
      const key = userEmail.trim().toLowerCase();
      if (!all[key]) all[key] = [];
      const newCard = {
        ...cardDesign,
        id: 'card-' + Date.now(),
        savedAt: new Date().toISOString()
      };
      all[key].unshift(newCard);
      localStorage.setItem(KEYS.USER_SAVED_CARDS, JSON.stringify(all));
      return newCard;
    } catch {
      return null;
    }
  },

  // --- Customer Authentication ---
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new Event('tapnova_user_updated'));
  },

  logoutUser: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
    window.dispatchEvent(new Event('tapnova_user_updated'));
  },

  // --- Admin Security & Access ---
  getAdminEmail: () => {
    return localStorage.getItem(KEYS.ADMIN_EMAIL) || DEFAULT_ADMIN_EMAIL;
  },

  setAdminEmail: (newEmail) => {
    localStorage.setItem(KEYS.ADMIN_EMAIL, newEmail);
  },

  getAdminPasscode: () => {
    const saved = localStorage.getItem(KEYS.ADMIN_PASS);
    if (!saved || saved === 'admin123') {
      return DEFAULT_ADMIN_PASS;
    }
    return saved;
  },

  setAdminPasscode: (newPass) => {
    localStorage.setItem(KEYS.ADMIN_PASS, newPass);
  },

  isAdminAuthenticated: () => {
    return sessionStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
  },

  authenticateAdmin: (emailOrPass, maybePass) => {
    const currentEmail = storage.getAdminEmail();
    const currentPass = storage.getAdminPasscode();

    if (maybePass !== undefined) {
      const email = (emailOrPass || '').trim().toLowerCase();
      const pass = (maybePass || '').trim();
      if (email === currentEmail.toLowerCase() && pass === currentPass) {
        sessionStorage.setItem(KEYS.ADMIN_AUTH, 'true');
        window.dispatchEvent(new Event('tapnova_admin_updated'));
        return true;
      }
      return false;
    }

    const val = (emailOrPass || '').trim();
    if (val === currentPass) {
      sessionStorage.setItem(KEYS.ADMIN_AUTH, 'true');
      window.dispatchEvent(new Event('tapnova_admin_updated'));
      return true;
    }
    return false;
  },

  logoutAdmin: () => {
    sessionStorage.removeItem(KEYS.ADMIN_AUTH);
    window.dispatchEvent(new Event('tapnova_admin_updated'));
  },

  // Reset data (reviews stay empty)
  resetToDefaults: () => {
    localStorage.setItem(KEYS.SITE_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    window.dispatchEvent(new Event('tapnova_content_updated'));
    window.dispatchEvent(new Event('tapnova_products_updated'));
    window.dispatchEvent(new Event('tapnova_reviews_updated'));
    window.dispatchEvent(new Event('tapnova_inquiries_updated'));
  }
};
