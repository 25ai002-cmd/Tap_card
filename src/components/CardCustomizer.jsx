import React, { useState, useEffect } from 'react';
import { CardVisualizer } from './CardVisualizer';
import { Sliders, CheckCircle2, MessageCircle, Send, Upload, Package, Link2, Lock, MailCheck, Palette, Sparkles, Phone } from 'lucide-react';
import { storage } from '../services/storage';
import { brevoService } from '../services/brevo';
import { CARD_COLOR_PRESETS, getAutoFontTheme } from '../utils/cardColorUtils';

export const CardCustomizer = ({ selectedProduct, onOpenSimulator, siteContent, currentUser, onRequireLogin }) => {
  const [purpose, setPurpose] = useState(selectedProduct ? selectedProduct.name : "Google 5-Star Review Tap Card Plan");
  const [cardColor, setCardColor] = useState("#121316");
  const [material, setMaterial] = useState("Matte Jet Black");
  const [businessName, setBusinessName] = useState("Apex Fitness Studio");
  const [targetUrl, setTargetUrl] = useState("https://maps.google.com/...");
  const [logoPreview, setLogoPreview] = useState(null);
  const [quantity, setQuantity] = useState(5);
  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [customNotes, setCustomNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailSentViaBrevo, setEmailSentViaBrevo] = useState(false);

  // Automatic font color theme dynamically determined by card color
  const fontTheme = getAutoFontTheme(cardColor);

  const handleSelectColorPreset = (preset) => {
    setCardColor(preset.hex);
    setMaterial(preset.name);
  };

  const handleCustomColorChange = (hex) => {
    setCardColor(hex);
    setMaterial(`Custom Color (${hex})`);
  };

  useEffect(() => {
    if (selectedProduct) {
      setPurpose(selectedProduct.name);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name || "");
      if (!email) setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Inquiry with Authentication Check & Brevo Email Dispatch
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();

    // STRICT CHECK: User must be logged in to send inquiry!
    if (!currentUser) {
      onRequireLogin('inquiry');
      return;
    }

    if (!email || !customerName) {
      alert("Please ensure your name and email are filled.");
      return;
    }

    setSubmitting(true);

    const inquiryPayload = {
      customerName,
      email: currentUser.email || email,
      phone,
      company: businessName,
      cardType: purpose,
      material: `${material} (${cardColor})`,
      fontColor: fontTheme.fontLabel,
      quantity,
      targetUrl: targetUrl || "To be provided",
      logoAttached: !!logoPreview,
      customNotes: customNotes || "Configured via interactive hardware builder"
    };

    // 1. Save to local storage for Admin Dashboard & User Private Vault
    storage.addInquiry(inquiryPayload);
    if (currentUser?.email) {
      storage.saveUserSavedCard(currentUser.email, inquiryPayload);
    }

    // 2. Dispatch live transactional email via Brevo API
    try {
      const emailResult = await brevoService.sendInquiryEmail(inquiryPayload);
      if (emailResult.success) {
        setEmailSentViaBrevo(true);
      }
    } catch (err) {
      console.warn('Brevo dispatch error:', err);
    }

    setSubmitting(false);
    setIsSubmitted(true);
  };

  // WhatsApp Direct Inquiry
  const handleWhatsAppInquiry = () => {
    const whatsappNumber = (siteContent?.contact?.whatsapp || "+15553899270").replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Tap Card! I would like to request a quote and layout proof:\n` +
      `• Application: ${purpose}\n` +
      `• Card Color: ${cardColor} (${material})\n` +
      `• Auto Font Color: ${fontTheme.fontLabel}\n` +
      `• Business / Name: ${businessName}\n` +
      `• Quantity: ${quantity} units\n` +
      `• Destination URL: ${targetUrl || 'To be provided'}\n` +
      `• Name: ${customerName || currentUser?.name || 'Inquirer'}\n` +
      `• Email: ${email || currentUser?.email || 'Not provided'}\n` +
      `Please send me details on pricing and timeline.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="customizer" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-medium mb-3">
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Custom Card Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900">
            Card Specifier & Proof Request
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Configure your physical material, input your destination link, attach your branding, and request a digital proof with turnkey delivery options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Card Preview & Deliverables Inclusions */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl sticky top-24 border border-slate-200/90 shadow-lg">
            <CardVisualizer
              cardColor={cardColor}
              material={material}
              purpose={purpose}
              businessName={businessName}
              phone={phone}
              logoUrl={logoPreview}
              onTap={onOpenSimulator}
            />

            {/* WHAT YOU GET IN THE DELIVERABLE PACKAGE */}
            <div className="mt-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Package className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-slate-900">
                  What You Get in Your Order:
                </h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{quantity}x</strong> Custom {material} Smart Cards with auto-contrast {fontTheme.fontLabel} typography</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Original high-capacity microchips</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pre-programmed directly with your destination link</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Laser-etched or UV-printed custom vector branding</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Matching high-contrast backup QR code on reverse</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Zero monthly platform fees — direct URL native routing</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Digital design layout proof sent for approval before production</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-center font-medium">
                ✓ Free Worldwide Tracked Shipping on Orders
              </div>
            </div>
          </div>

          {/* Right Column: Customizer Controls & Inquiry Form (NO PRICES) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg">
            
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">Inquiry & Proof Request Sent!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="text-sky-800 font-semibold">{customerName}</span>. Your inquiry for <span className="text-slate-900 font-semibold">{quantity}x {material}</span> cards has been logged and dispatched.
                </p>

                {emailSentViaBrevo && (
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 inline-flex items-center gap-2">
                    <MailCheck className="w-4 h-4 text-sky-600" />
                    <span>Inquiry email successfully transmitted via Brevo to our studio inbox!</span>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => { setIsSubmitted(false); setEmailSentViaBrevo(false); }}
                    className="glass-button-secondary px-5 py-2.5 rounded-xl text-xs font-medium text-slate-700"
                  >
                    Configure Another Setup
                  </button>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="glass-button-primary px-5 py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-6">
                
                {/* 1. Purpose Plan */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                    1. Select Lifetime Card Plan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Google 5-Star Review Tap Card Plan",
                      "Creative Portfolio & Showcase Plan",
                      "Full Website with QR Code Plan",
                      "Lead Generation & Inquiry Form Plan"
                    ].map((purp) => (
                      <button
                        type="button"
                        key={purp}
                        onClick={() => setPurpose(purp)}
                        className={`p-3 rounded-xl text-left text-xs font-semibold transition-all ${
                          purpose === purp
                            ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25 border border-sky-600 scale-[1.01]'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
                        }`}
                      >
                        {purp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Card Color & Finish Selection with Automatic Font Color Engine */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-sky-600" />
                      <span>2. Select Card Color & Finish</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Selected: <strong className="text-slate-800">{material}</strong>
                    </span>
                  </div>

                  {/* Preset Color Swatches */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {CARD_COLOR_PRESETS.map((preset) => {
                      const isSelected = cardColor.toLowerCase() === preset.hex.toLowerCase();
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => handleSelectColorPreset(preset)}
                          className={`p-2 rounded-xl text-left flex items-center gap-2.5 transition-all ${
                            isSelected
                              ? 'bg-sky-50/90 border-2 border-sky-600 shadow-sm scale-[1.02]'
                              : 'bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full shrink-0 border border-black/15 shadow-inner"
                            style={{ backgroundColor: preset.hex }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">{preset.name}</p>
                            <p className="text-[9px] text-slate-500 truncate">{preset.hex}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Color Picker & Automatic Font Contrast Status */}
                  <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <div className="relative">
                        <input
                          type="color"
                          value={cardColor}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                          className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shadow-xs"
                          title="Pick custom hex color"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Custom Brand Color</p>
                        <p className="text-[10px] text-slate-500 font-mono">Hex: {cardColor.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Automatic Font Color Indicator */}
                    <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Auto Font Color:</span>
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: fontTheme.text }}>
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: fontTheme.text }} 
                        />
                        {fontTheme.fontLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Destination Link to Program */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                    3. Destination Link to Encode on Chip
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="e.g. https://g.page/r/... (Google Maps Review Link) or website portfolio"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    You can also send your link later during your digital proof approval.
                  </p>
                </div>

                {/* 4. Cardholder Name, Phone & Logo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                      4. Name on Card *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Acme Dental or Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 font-mono flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      <span>Phone on Card</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                      Upload Logo / Artwork
                    </label>
                    <label className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-dashed border-slate-300 hover:border-sky-500 text-xs text-slate-700 cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-sky-600" />
                      <span className="truncate">{logoPreview ? 'Change Logo' : 'Select PNG/SVG'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 5. Quantity Requirement */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
                      5. Quantity Required: <span className="text-sky-800 font-bold">{quantity} Cards</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      Sample or volume batch
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 5, 10, 25, 50, 100, 250].map((qty) => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setQuantity(qty)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          quantity === qty
                            ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25 border border-sky-600 scale-[1.02]'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
                        }`}
                      >
                        {qty} {qty === 1 ? 'sample card' : 'cards'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Contact Details & Login Status */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
                      6. Sender Contact Information
                    </h4>
                    {currentUser ? (
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Signed in as {currentUser.email}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign-in required to submit</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Email Address (for Proof) *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        required
                        disabled={!!currentUser?.email}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Custom Notes / Special Instructions</label>
                    <textarea
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g., Font preferences, multiple location links, custom serial numbers..."
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none h-16"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {currentUser ? (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 glass-button-primary py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Transmitting via Brevo...' : 'Submit Inquiry & Send via Brevo Email'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRequireLogin('inquiry')}
                      className="flex-1 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Sign In with Google or Email to Send Inquiry</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    className="glass-button-secondary py-3.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center justify-center gap-2 border-emerald-300 hover:border-emerald-400"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
