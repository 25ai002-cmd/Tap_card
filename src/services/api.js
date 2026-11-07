// Universal Client API Service
// Automatically communicates with PostgreSQL backend when available,
// with automatic fallback to local IndexedDB/localStorage when running standalone.

const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = {
  // Check backend & PostgreSQL connectivity
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // --- REVIEWS ---
  getReviews: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  createReview: async (reviewData) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error('Server returned ' + res.status);
      return await res.json();
    } catch (e) {
      console.warn('Backend createReview fallback:', e);
      return null;
    }
  },

  deleteReview: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  removeReviewVideo: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}/video`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  removeReviewImage: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}/image`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // --- INQUIRIES ---
  getInquiries: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  getUserInquiries: async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/inquiries/user/${encodeURIComponent(email)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  createInquiry: async (inquiryData) => {
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (!res.ok) throw new Error('Server returned ' + res.status);
      return await res.json();
    } catch (e) {
      console.warn('Backend createInquiry fallback:', e);
      return null;
    }
  },

  updateInquiryStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  deleteInquiry: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/inquiries/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // --- USER AUTHENTICATION ---
  register: async ({ name, email, password }) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  adminLogin: async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin login failed');
    return data;
  }
};
