import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle, CheckCircle2, Lock, MailCheck } from 'lucide-react';
import { storage } from '../services/storage';
import { brevoService } from '../services/brevo';

export const InquiryModal = ({ isOpen, onClose, selectedProduct, siteContent, currentUser, onRequireLogin }) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [cardType, setCardType] = useState(selectedProduct ? selectedProduct.name : 'Google 5-Star Review Tap Card Plan');
  const [material, setMaterial] = useState('Matte Velvet Black');
  const [quantity, setQuantity] = useState(10);
  const [targetUrl, setTargetUrl] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailSentViaBrevo, setEmailSentViaBrevo] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setCardType(selectedProduct.name);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      onRequireLogin('inquiry');
      return;
    }

    if (!customerName || !email) {
      alert('Please enter your name and email address.');
      return;
    }

    setSubmitting(true);

    const inquiryPayload = {
      customerName,
      email: currentUser.email || email,
      phone,
      company,
      cardType,
      material,
      quantity: Number(quantity),
      targetUrl,
      customNotes,
      date: new Date().toISOString(),
    };

    // 1. Save to local storage for Admin Dashboard
    storage.addInquiry(inquiryPayload);

    // 2. Dispatch via Brevo
    try {
      const emailResult = await brevoService.sendInquiryEmail(inquiryPayload);
      if (emailResult.success) {
        setEmailSentViaBrevo(true);
      }
    } catch (err) {
      console.warn('Brevo dispatch error:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmailSentViaBrevo(false);
      onClose();
    }, 2500);
  };

  const handleWhatsAppChat = () => {
    const rawNumber = (siteContent?.contact?.whatsapp || "+15553899270").replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello Tap Card! I would like to inquire about ${quantity}x ${cardType} (${material}). Name: ${customerName || currentUser?.name || 'Inquirer'}`
    );
    window.open(`https://wa.me/${rawNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 border border-slate-200 shadow-2xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-slate-900">Inquiry Dispatched!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              We received your inquiry. A notification has been emailed directly to our team via Brevo.
            </p>
            {emailSentViaBrevo && (
              <p className="text-xs text-sky-700 font-medium">
                ✓ Brevo transactional delivery confirmed.
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-mono">
                Official Inquiry & Quote
              </span>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mt-2">
                Order Inquiry & Pricing Request
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tell us about your project requirements and receive a personalized bulk quote.
              </p>
            </div>

            {/* User Login Warning / Status */}
            {!currentUser && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>You must be signed in to send an inquiry.</span>
                </span>
                <button
                  type="button"
                  onClick={() => onRequireLogin('inquiry')}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px]"
                >
                  Sign In
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rachel@brand.com"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  required
                  disabled={!!currentUser?.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Health Clinic"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Plan</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-white font-medium"
                >
                  <option value="Google 5-Star Review Tap Card Plan">Google 5-Star Review Tap Card Plan</option>
                  <option value="Creative Portfolio & Showcase Plan">Creative Portfolio & Showcase Plan</option>
                  <option value="Full Website with QR Code Plan">Full Website with QR Code Plan</option>
                  <option value="Lead Generation & Inquiry Form Plan">Lead Generation & Inquiry Form Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Destination Link to Program</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="e.g. Google Maps Review URL or portfolio link"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Project Details / Custom Requests</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Include custom logos, target delivery date, or special chip programming..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none h-20"
              />
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              {currentUser ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 glass-button-primary py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting via Brevo...' : 'Send Inquiry via Brevo'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequireLogin('inquiry')}
                  className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md inline-flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Send Inquiry</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="glass-button-secondary py-3 px-4 rounded-xl text-xs font-semibold text-emerald-700 hover:text-emerald-800 border-emerald-300 flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
