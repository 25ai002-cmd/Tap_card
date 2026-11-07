// IndexedDB High-Capacity Client Database Engine for Tap Card Platform
// Supports gigabytes of storage for videos, high-res photos, reviews, and inquiries without localStorage quota limits.

const DB_NAME = 'TapCardDB';
const DB_VERSION = 1;

const STORES = {
  REVIEWS: 'reviews',
  INQUIRIES: 'inquiries',
  USERS: 'users',
  MEDIA: 'media'
};

class DatabaseService {
  constructor() {
    this.dbPromise = this.initDB();
  }

  initDB() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB not supported in this environment.');
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Reviews store
        if (!db.objectStoreNames.contains(STORES.REVIEWS)) {
          const reviewStore = db.createObjectStore(STORES.REVIEWS, { keyPath: 'id' });
          reviewStore.createIndex('date', 'date', { unique: false });
          reviewStore.createIndex('status', 'status', { unique: false });
        }

        // Inquiries store
        if (!db.objectStoreNames.contains(STORES.INQUIRIES)) {
          const inquiryStore = db.createObjectStore(STORES.INQUIRIES, { keyPath: 'id' });
          inquiryStore.createIndex('email', 'email', { unique: false });
          inquiryStore.createIndex('date', 'date', { unique: false });
        }

        // Users store
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          db.createObjectStore(STORES.USERS, { keyPath: 'email' });
        }

        // Media store for large video/photo Blobs
        if (!db.objectStoreNames.contains(STORES.MEDIA)) {
          db.createObjectStore(STORES.MEDIA, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        resolve(null);
      };
    });
  }

  async getStore(storeName, mode = 'readonly') {
    const db = await this.dbPromise;
    if (!db) return null;
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // --- REVIEWS ---
  async getAllReviews() {
    try {
      const store = await this.getStore(STORES.REVIEWS, 'readonly');
      if (!store) return [];
      return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch (e) {
      console.warn('IndexedDB getAllReviews error:', e);
      return [];
    }
  }

  async putReview(review) {
    try {
      const store = await this.getStore(STORES.REVIEWS, 'readwrite');
      if (!store) return false;
      return new Promise((resolve, reject) => {
        const request = store.put(review);
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (e) {
      console.error('IndexedDB putReview error:', e);
      return false;
    }
  }

  async deleteReview(id) {
    try {
      const store = await this.getStore(STORES.REVIEWS, 'readwrite');
      if (!store) return false;
      return new Promise((resolve) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (e) {
      console.error('IndexedDB deleteReview error:', e);
      return false;
    }
  }

  // --- INQUIRIES ---
  async getAllInquiries() {
    try {
      const store = await this.getStore(STORES.INQUIRIES, 'readonly');
      if (!store) return [];
      return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async putInquiry(inquiry) {
    try {
      const store = await this.getStore(STORES.INQUIRIES, 'readwrite');
      if (!store) return false;
      return new Promise((resolve, reject) => {
        const request = store.put(inquiry);
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch {
      return false;
    }
  }

  // --- USERS ---
  async getUser(email) {
    try {
      const store = await this.getStore(STORES.USERS, 'readonly');
      if (!store) return null;
      return new Promise((resolve) => {
        const request = store.get(email.toLowerCase().trim());
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async putUser(user) {
    try {
      const store = await this.getStore(STORES.USERS, 'readwrite');
      if (!store) return false;
      return new Promise((resolve, reject) => {
        const request = store.put(user);
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch {
      return false;
    }
  }
}

export const dbService = new DatabaseService();
