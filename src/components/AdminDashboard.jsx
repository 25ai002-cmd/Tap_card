import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Trash2, VideoOff, ImageOff, Star, 
  Settings, Image, Plus, Edit3, MessageSquare, Inbox, 
  Phone, Mail, Upload, Save, RotateCcw
} from 'lucide-react';
import { storage } from '../services/storage';

export const AdminDashboard = ({ isOpen, onClose, onRefreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(storage.isAdminAuthenticated());
  const [email, setEmail] = useState('yakshbarot597@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'content' | 'inquiries' | 'products'
  
  // Data states
  const [reviews, setReviews] = useState(storage.getReviews());
  const [siteContent, setSiteContent] = useState(storage.getSiteContent());
  const [products, setProducts] = useState(storage.getProducts());
  const [inquiries, setInquiries] = useState(storage.getInquiries());
  const [statusNotice, setStatusNotice] = useState('');

  // Editing state for new/existing product
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    tagline: '',
    category: 'custom',
    badge: 'Hardware Spec',
    description: '',
    includedItems: [
      'Original NXP NTAG216 high-speed microchip',
      'Waterproof luxury scratch-resistant finish',
      'Works with all modern iPhones & Androids',
      'Zero recurring platform fees'
    ],
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    materialOptions: ['Matte Velvet Black', 'Nordic Walnut Wood']
  });

  useEffect(() => {
    const handleAdminUpdate = () => setIsAuthenticated(storage.isAdminAuthenticated());
    const handleReviewsUpdate = () => setReviews(storage.getReviews());
    const handleContentUpdate = () => setSiteContent(storage.getSiteContent());
    const handleProductsUpdate = () => setProducts(storage.getProducts());
    const handleInquiriesUpdate = () => setInquiries(storage.getInquiries());

    window.addEventListener('tapnova_admin_updated', handleAdminUpdate);
    window.addEventListener('tapnova_reviews_updated', handleReviewsUpdate);
    window.addEventListener('tapnova_content_updated', handleContentUpdate);
    window.addEventListener('tapnova_products_updated', handleProductsUpdate);
    window.addEventListener('tapnova_inquiries_updated', handleInquiriesUpdate);

    return () => {
      window.removeEventListener('tapnova_admin_updated', handleAdminUpdate);
      window.removeEventListener('tapnova_reviews_updated', handleReviewsUpdate);
      window.removeEventListener('tapnova_content_updated', handleContentUpdate);
      window.removeEventListener('tapnova_products_updated', handleProductsUpdate);
      window.removeEventListener('tapnova_inquiries_updated', handleInquiriesUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const showNotification = (msg) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (storage.authenticateAdmin(email, password)) {
      setIsAuthenticated(true);
      setErrorMsg('');
      setPassword('');
      showNotification('Admin Authenticated');
    } else {
      setErrorMsg('Invalid admin credentials. Please enter the correct email and password.');
    }
  };

  const handleLogout = () => {
    storage.logoutAdmin();
    setIsAuthenticated(false);
  };

  // --- REVIEW MODERATION ACTIONS ---
  const handleDeleteReview = async (id, customerName) => {
    if (window.confirm(`Are you sure you want to completely delete the review by "${customerName}"?`)) {
      await storage.deleteReview(id);
      showNotification(`Deleted review by ${customerName}`);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleRemoveVideo = async (id, customerName) => {
    if (window.confirm(`Remove video testimonial from "${customerName}"'s review? The text review will remain.`)) {
      await storage.removeReviewVideo(id);
      showNotification(`Video removed from review by ${customerName}`);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleRemoveImage = async (id, customerName) => {
    if (window.confirm(`Remove photo attachment from "${customerName}"'s review?`)) {
      await storage.removeReviewImage(id);
      showNotification(`Photo removed from review by ${customerName}`);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleToggleFeatured = (id) => {
    storage.toggleFeaturedReview(id);
    showNotification('Toggled featured status');
  };

  // --- CONTENT CMS ACTIONS ---
  const handleSaveSiteContent = (e) => {
    e.preventDefault();
    storage.saveSiteContent(siteContent);
    showNotification('Website content updated successfully!');
    if (onRefreshData) onRefreshData();
  };

  const handleHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteContent(prev => ({
          ...prev,
          hero: {
            ...prev.hero,
            heroImage: reader.result
          }
        }));
        showNotification('Hero image preview updated. Click Save to persist.');
      };
      reader.readAsDataURL(file);
    }
  };

  // --- PRODUCT MANAGEMENT ACTIONS (NO PRICES) ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      storage.updateProduct(editingProduct);
      setEditingProduct(null);
      showNotification('Product updated!');
    } else {
      storage.addProduct(newProductData);
      setIsAddingProduct(false);
      showNotification('New card product added to website!');
    }
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Delete product "${productName}" from website?`)) {
      storage.deleteProduct(productId);
      showNotification(`Deleted product: ${productName}`);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleProductImageUpload = (e, isEditing) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingProduct(prev => ({ ...prev, image: reader.result }));
        } else {
          setNewProductData(prev => ({ ...prev, image: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- INQUIRIES ACTIONS ---
  const handleUpdateInquiryStatus = (id, status) => {
    storage.updateInquiryStatus(id, status);
    showNotification(`Inquiry status updated to ${status}`);
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm('Delete this inquiry?')) {
      storage.deleteInquiry(id);
      showNotification('Inquiry removed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                Tap Card Admin Command Center
                {isAuthenticated && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold font-mono">
                    Owner Mode
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500">Manage inquiries, moderate customer reviews/videos & update site content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {statusNotice && (
              <span className="text-xs text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 font-medium hidden sm:inline-block">
                {statusNotice}
              </span>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm"
              >
                Lock Admin
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOT AUTHENTICATED: LOGIN SCREEN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
            <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white rounded-3xl border border-slate-200 shadow-lg text-left space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mx-auto">
                <Shield className="w-7 h-7" />
              </div>

              <div className="text-center">
                <h4 className="text-xl font-bold font-heading text-slate-900">Administrator Portal</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Secure access for business management, inquiries, site content, and review moderation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yakshbarot597@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  required
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 text-center">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full glass-button-primary py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md mt-2"
              >
                Sign In to Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED: DASHBOARD TABS */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/40">
            
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 px-6 pt-3 gap-2 bg-white shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Customer Inquiries & Proof Requests ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('moderation')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'moderation'
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Reviews & Video Moderation ({reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Website Content & Images</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Card Products Catalog ({products.length})</span>
              </button>
            </div>

            {/* TAB CONTENTS (Scrollable area) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              
              {/* TAB 1: CUSTOMER INQUIRIES & PROOF REQUESTS */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 border border-sky-200">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Inbound Hardware Inquiries & Digital Proof Requests</h4>
                      <p className="text-xs text-slate-600">Customers who configured cards or requested custom quotes.</p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {inquiries.length} Inquiries Logged
                    </span>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
                      No customer inquiries submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{inq.customerName}</span>
                              <span className="text-xs text-slate-500">({inq.company || "Individual"})</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono ${
                                inq.status === 'new' 
                                  ? 'bg-sky-50 text-sky-800 border border-sky-200' 
                                  : inq.status === 'in-progress'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}>
                                {inq.status}
                              </span>
                            </div>

                            <p className="text-xs text-sky-800 font-medium">
                              Specification: <span className="text-slate-900 font-bold">{inq.quantity}x</span> {inq.cardType} ({inq.material || "Matte Black"})
                            </p>

                            {inq.targetUrl && (
                              <p className="text-xs font-mono text-slate-500">
                                Target Link: <span className="text-slate-800">{inq.targetUrl}</span>
                              </p>
                            )}

                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                              "{inq.customNotes || "No extra instructions provided"}"
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                              <span className="flex items-center gap-1 text-slate-700">
                                <Mail className="w-3.5 h-3.5 text-sky-600" />
                                <a href={`mailto:${inq.email}`} className="hover:underline">{inq.email}</a>
                              </span>
                              {inq.phone && (
                                <span className="flex items-center gap-1 text-slate-700">
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{inq.phone}</span>
                                </span>
                              )}
                              <span>Date: {new Date(inq.date).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                            {/* Status selector */}
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 shadow-sm"
                            >
                              <option value="new">New</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>

                            {/* Direct WhatsApp Response */}
                            {inq.phone && (
                              <a
                                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${inq.customerName}, regarding your inquiry for ${inq.quantity}x ${inq.cardType} with Tap Card...`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 shadow-sm"
                              >
                                <Phone className="w-3 h-3" />
                                <span>WhatsApp Reply</span>
                              </a>
                            )}

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs border border-red-200"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: REVIEWS & VIDEO MODERATION */}
              {activeTab === 'moderation' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-sky-600" />
                        <span>Owner Authority: Review & Video Removal</span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        You have full authority to delete customer reviews or remove attached videos and photos specifically.
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      Total: {reviews.length} reviews | {reviews.filter(r => r.videoUrl).length} videos
                    </span>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                      No customer reviews submitted yet. When customers submit reviews, they will appear here for your moderation.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start justify-between gap-5"
                        >
                          {/* Review Content */}
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{rev.customerName}</span>
                              <span className="text-xs text-slate-500 font-mono">({rev.customerEmail || "No email"})</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700 font-medium">
                                {rev.cardType}
                              </span>
                              <div className="flex text-amber-400">
                                {[...Array(rev.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-400">{rev.date}</span>
                            </div>

                            <h5 className="text-xs sm:text-sm font-semibold text-slate-900">
                              "{rev.title}"
                            </h5>
                            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                              {rev.content || rev.reviewText}
                            </p>

                            {/* Media preview chips */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              {rev.videoUrl ? (
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-50 border border-sky-200">
                                  <span className="text-xs text-sky-800 font-medium">🎬 Video Attached</span>
                                  <video src={rev.videoUrl} className="w-16 h-10 object-cover rounded" muted />
                                  <button
                                    onClick={() => handleRemoveVideo(rev.id, rev.customerName)}
                                    className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 ml-2 bg-red-50 px-2 py-1 rounded border border-red-200"
                                    title="Delete video while keeping review"
                                  >
                                    <VideoOff className="w-3 h-3" />
                                    <span>Remove Video</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400">No video attached</span>
                              )}

                              {rev.imageUrl && (
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                                  <img src={rev.imageUrl} alt="Review attachment" className="w-10 h-10 object-cover rounded" />
                                  <button
                                    onClick={() => handleRemoveImage(rev.id, rev.customerName)}
                                    className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-200"
                                  >
                                    <ImageOff className="w-3 h-3" />
                                    <span>Remove Photo</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Authority Action Buttons */}
                          <div className="flex md:flex-col items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleFeatured(rev.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 w-full justify-center transition-colors ${
                                rev.isFeatured 
                                  ? 'bg-amber-50 text-amber-800 border border-amber-300' 
                                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-sm'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5" />
                              <span>{rev.isFeatured ? 'Featured' : 'Feature'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteReview(rev.id, rev.customerName)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 flex items-center gap-1.5 w-full justify-center transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Review</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: WEBSITE CONTENT & IMAGES (CMS) */}
              {activeTab === 'content' && (
                <form onSubmit={handleSaveSiteContent} className="space-y-6">
                  
                  {/* Top Bar with Save Button */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 border border-sky-200">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Live Content Editor</h4>
                      <p className="text-xs text-slate-600">Modify headlines, announcements, banners, and contact info instantly.</p>
                    </div>
                    <button
                      type="submit"
                      className="glass-button-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center gap-2 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Changes</span>
                    </button>
                  </div>

                  {/* Hero Section Headlines */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <h5 className="text-xs font-semibold text-sky-700 uppercase tracking-wider font-mono">
                      Hero Section & Announcements
                    </h5>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Hero Badge / Growth Headline
                      </label>
                      <input
                        type="text"
                        value={siteContent.hero.badge || ''}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, badge: e.target.value }
                        })}
                        placeholder="e.g. Helping Businesses Scale & Build 5-Star Trust"
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Hero Main Heading Title
                      </label>
                      <input
                        type="text"
                        value={siteContent.hero.title || ''}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, title: e.target.value }
                        })}
                        placeholder="e.g. Helping Businesses Grow with Faster Google Reviews & Smart Facilities."
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Announcement Top Banner
                      </label>
                      <input
                        type="text"
                        value={siteContent.hero.announcement}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, announcement: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Hero Main Subtitle / Pitch
                      </label>
                      <textarea
                        value={siteContent.hero.subtitle}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, subtitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none h-20"
                      />
                    </div>

                    {/* Hero Image Management */}
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Hero Banner Image (Add / Change Images)
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <img 
                            src={siteContent.hero.heroImage} 
                            alt="Hero preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                          <input
                            type="text"
                            value={siteContent.hero.heroImage}
                            onChange={(e) => setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, heroImage: e.target.value }
                            })}
                            placeholder="Paste image URL..."
                            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                          />
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-sky-700 font-medium cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New Image File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHeroImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <h5 className="text-xs font-semibold text-sky-700 uppercase tracking-wider font-mono">
                      Business & WhatsApp Contact Details
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp Number (for 1-click orders)</label>
                        <input
                          type="text"
                          value={siteContent.contact.whatsapp}
                          onChange={(e) => setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, whatsapp: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Inquiry Email</label>
                        <input
                          type="email"
                          value={siteContent.contact.email}
                          onChange={(e) => setSiteContent({
                            ...siteContent,
                            contact: { ...siteContent.contact, email: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Studio / Office Location</label>
                      <input
                        type="text"
                        value={siteContent.contact.address}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          contact: { ...siteContent.contact, address: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                </form>
              )}

              {/* TAB 4: NFC PRODUCTS CATALOG CMS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  {/* Header & Add Button */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 border border-sky-200">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Card Plans & Product Manager</h4>
                      <p className="text-xs text-slate-600">Add new cards, modify specifications, upload custom images, and update deliverables.</p>
                    </div>
                    <button
                      onClick={() => { setIsAddingProduct(!isAddingProduct); setEditingProduct(null); }}
                      className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingProduct ? 'Cancel' : 'Add New Card'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Product Form */}
                  {(isAddingProduct || editingProduct) && (
                    <form onSubmit={handleSaveProduct} className="p-6 rounded-2xl bg-white border border-sky-300 shadow-md space-y-4 animate-fadeIn">
                      <h5 className="text-sm font-bold text-sky-800">
                        {editingProduct ? `Edit Card: ${editingProduct.name}` : 'Create New Card Solution'}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Card Solution Name *</label>
                          <input
                            type="text"
                            value={editingProduct ? editingProduct.name : newProductData.name}
                            onChange={(e) => {
                              if (editingProduct) setEditingProduct({ ...editingProduct, name: e.target.value });
                              else setNewProductData({ ...newProductData, name: e.target.value });
                            }}
                            placeholder="e.g. VIP Club Metal Pass"
                            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Tagline *</label>
                          <input
                            type="text"
                            value={editingProduct ? editingProduct.tagline : newProductData.tagline}
                            onChange={(e) => {
                              if (editingProduct) setEditingProduct({ ...editingProduct, tagline: e.target.value });
                              else setNewProductData({ ...newProductData, tagline: e.target.value });
                            }}
                            placeholder="e.g. 1-Tap Access for Premium Members"
                            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                          <select
                            value={editingProduct ? editingProduct.category : newProductData.category}
                            onChange={(e) => {
                              if (editingProduct) setEditingProduct({ ...editingProduct, category: e.target.value });
                              else setNewProductData({ ...newProductData, category: e.target.value });
                            }}
                            className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-white"
                          >
                            <option value="reviews">Google Reviews</option>
                            <option value="portfolios">Creative Portfolios</option>
                            <option value="social">Social & Contact vCard</option>
                            <option value="custom">Custom Smart Tech</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Badge Tag</label>
                          <input
                            type="text"
                            value={editingProduct ? editingProduct.badge : newProductData.badge}
                            onChange={(e) => {
                              if (editingProduct) setEditingProduct({ ...editingProduct, badge: e.target.value });
                              else setNewProductData({ ...newProductData, badge: e.target.value });
                            }}
                            placeholder="e.g. Turnkey Package"
                            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                          value={editingProduct ? editingProduct.description : newProductData.description}
                          onChange={(e) => {
                            if (editingProduct) setEditingProduct({ ...editingProduct, description: e.target.value });
                            else setNewProductData({ ...newProductData, description: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none h-16"
                          required
                        />
                      </div>

                      {/* Image Upload for Product */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Product Card Image</label>
                        <div className="flex items-center gap-3">
                          <img 
                            src={editingProduct ? editingProduct.image : newProductData.image} 
                            alt="Card preview" 
                            className="w-16 h-12 rounded-lg object-cover border border-slate-200" 
                          />
                          <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs text-sky-700 font-medium cursor-pointer shadow-sm">
                            <span>Upload Image File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProductImageUpload(e, !!editingProduct)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold text-white"
                        >
                          {editingProduct ? 'Save Product Changes' : 'Publish Product to Website'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                          className="glass-button-secondary px-4 py-2 rounded-xl text-xs text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of existing products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex gap-4">
                        <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{p.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 font-mono">
                                {p.badge || 'Verified Spec'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => { setEditingProduct(p); setIsAddingProduct(false); }}
                              className="text-[11px] text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-sky-50 px-2 py-1 rounded border border-sky-200 font-medium"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-200"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="font-mono text-[11px]">ADMINISTRATOR VERIFIED</span>
              <button
                onClick={() => {
                  if (window.confirm("Reset all website data and products to original template? (Reviews will remain clean/empty)")) {
                    storage.resetToDefaults();
                    showNotification("Website reset to clean template");
                    if (onRefreshData) onRefreshData();
                  }
                }}
                className="text-[11px] text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Clean Template</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
