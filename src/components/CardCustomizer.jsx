import React, { useState, useEffect } from 'react';
import { CardVisualizer } from './CardVisualizer';
import { 
  Sliders, 
  CheckCircle2, 
  MessageCircle, 
  Send, 
  Upload, 
  Package, 
  Link2, 
  Lock, 
  MailCheck, 
  Palette, 
  Sparkles, 
  Phone, 
  Copy, 
  Image as ImageIcon, 
  Trash2, 
  RotateCw,
  ShieldCheck,
  Star,
  Globe
} from 'lucide-react';
import { storage } from '../services/storage';
import { brevoService } from '../services/brevo';
import { CARD_COLOR_PRESETS, getAutoFontTheme } from '../utils/cardColorUtils';

export const CardCustomizer = ({ selectedProduct, onOpenSimulator, siteContent, currentUser, onRequireLogin }) => {
  // Mode: 'clone' (Upload existing business card photos) vs 'builder' (design new from scratch)
  const [creationMode, setCreationMode] = useState('clone');

  // Existing business card uploads
  const [existingCardFront, setExistingCardFront] = useState(null);
  const [existingCardBack, setExistingCardBack] = useState(null);

  // General card specs
  const [purpose, setPurpose] = useState(selectedProduct ? selectedProduct.name : "Google 5-Star Review Tap Card Plan");
  const [cardColor, setCardColor] = useState("#cbd5e1");
  const [material, setMaterial] = useState("Anodized Silver");
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

  // Handle Logo Upload (for builder mode)
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

  // Handle Existing Business Card Front Upload
  const handleFrontCardUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExistingCardFront(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Existing Business Card Back Upload
  const handleBackCardUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExistingCardBack(reader.result);
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
      company: businessName || (creationMode === 'clone' ? "Existing Card Clone Order" : ""),
      cardType: purpose,
      cardMode: creationMode, // 'clone' or 'builder'
      material: `${material} (${cardColor})`,
      fontColor: fontTheme.fontLabel,
      quantity,
      targetUrl: targetUrl || "To be provided",
      logoAttached: !!logoPreview,
      existingCardFront: creationMode === 'clone' ? existingCardFront : null,
      existingCardBack: creationMode === 'clone' ? existingCardBack : null,
      customNotes: customNotes || (creationMode === 'clone' 
        ? "Please replicate our uploaded existing business card design 1:1 and turn it into a contactless Tap Card." 
        : "Configured via interactive hardware builder")
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
    let messageBody = '';

    if (creationMode === 'clone') {
      messageBody = 
        `Hello Tap Card! I want to turn my existing business card into a contactless Tap Card without changing my design:\n` +
        `• Design Mode: 1:1 Clone of Existing Business Card\n` +
        `• Front Card Photo: ${existingCardFront ? 'Attached & Uploaded' : 'Will send on WhatsApp'}\n` +
        `• Back Card Photo: ${existingCardBack ? 'Attached & Uploaded' : 'Will send on WhatsApp'}\n` +
        `• Application: ${purpose}\n` +
        `• Material Finish: ${material}\n` +
        `• Quantity: ${quantity} units\n` +
        `• Destination Link: ${targetUrl || 'To be provided'}\n` +
        `• Name: ${customerName || currentUser?.name || 'Inquirer'}\n` +
        `• Email: ${email || currentUser?.email || 'Not provided'}\n` +
        `Please send me digital proof and pricing details.`;
    } else {
      messageBody = 
        `Hello Tap Card! I would like to request a quote and layout proof:\n` +
        `• Application: ${purpose}\n` +
        `• Card Color: ${cardColor} (${material})\n` +
        `• Auto Font Color: ${fontTheme.fontLabel}\n` +
        `• Business / Name: ${businessName}\n` +
        `• Quantity: ${quantity} units\n` +
        `• Destination URL: ${targetUrl || 'To be provided'}\n` +
        `• Name: ${customerName || currentUser?.name || 'Inquirer'}\n` +
        `• Email: ${email || currentUser?.email || 'Not provided'}\n` +
        `Please send me details on pricing and timeline.`;
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageBody)}`, '_blank');
  };

  return (
    <section id="customizer" className="py-16 sm:py-20 relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-medium mb-3">
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Smart Card Customizer & Existing Card Cloner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 tracking-tight">
            Turn Your Business Card Into a Tap Card
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            Already have a simple business card you love? Upload front & back photos to copy your exact design, or build a new custom card from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Card Preview & Deliverables Inclusions */}
          <div className="lg:col-span-5 glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:sticky lg:top-24 border border-slate-200/90 shadow-lg">
            <CardVisualizer
              cardColor={cardColor}
              material={material}
              purpose={purpose}
              businessName={businessName}
              phone={phone}
              logoUrl={logoPreview}
              frontImage={creationMode === 'clone' ? existingCardFront : null}
              backImage={creationMode === 'clone' ? existingCardBack : null}
              isClonedCard={creationMode === 'clone' && (!!existingCardFront || !!existingCardBack)}
              onTap={onOpenSimulator}
            />

            {/* WHAT YOU GET IN THE DELIVERABLE PACKAGE */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Package className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-slate-900">
                  {creationMode === 'clone' ? "1:1 Cloned Card Deliverables:" : "What You Get in Your Order:"}
                </h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{quantity}x</strong> {creationMode === 'clone' ? '1:1 Exact Replicas of Your Existing Card' : `Custom ${material} Smart Cards`}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Integrated high-speed contactless microchips embedded invisibly</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pre-programmed directly for Google Reviews or Direct Website opening</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Durable, waterproof luxury finish rated for 100,000+ taps</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Precision laser-printed backup QR code on reverse side</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Zero monthly platform fees — one-time card hardware purchase</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Digital layout vector proof sent to you before batch production</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-center font-medium">
                ✓ 100% Design Accuracy Guarantee Before Manufacturing
              </div>
            </div>
          </div>

          {/* Right Column: Customizer Controls & Mode Selector */}
          <div className="lg:col-span-7 glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg">
            
            {/* CREATION MODE TOGGLE */}
            <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 flex flex-col sm:flex-row gap-2 mb-6">
              <button
                type="button"
                onClick={() => setCreationMode('clone')}
                className={`flex-1 py-3 px-4 rounded-xl text-left transition-all ${
                  creationMode === 'clone'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">Clone My Existing Business Card</span>
                </div>
                <p className={`text-[11px] mt-0.5 ${creationMode === 'clone' ? 'text-sky-100' : 'text-slate-500'}`}>
                  Upload front & back photos — keep design 100% unchanged!
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCreationMode('builder')}
                className={`flex-1 py-3 px-4 rounded-xl text-left transition-all ${
                  creationMode === 'builder'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">Build New Custom Digital Card</span>
                </div>
                <p className={`text-[11px] mt-0.5 ${creationMode === 'builder' ? 'text-sky-100' : 'text-slate-500'}`}>
                  Customize colors, materials, and live typography
                </p>
              </button>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">
                  {creationMode === 'clone' ? "Card Clone & Proof Request Received!" : "Inquiry & Proof Request Sent!"}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="text-sky-800 font-semibold">{customerName}</span>. Your request for <span className="text-slate-900 font-semibold">{quantity}x {material}</span> smart cards has been logged. {creationMode === 'clone' ? "Our production team will replicate your uploaded artwork and prepare your vector proof." : "Our design team will reach out with your proof."}
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
                    Configure Another Card
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
                
                {/* -------------------- MODE A: CLONE EXISTING CARD -------------------- */}
                {creationMode === 'clone' && (
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* Reassurance Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50/60 border border-sky-200/90 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          100% Exact Design Replicated — Zero Design Changes Needed
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          If you already have a physical or digital business card, upload photos of the <strong>front</strong> and <strong>back</strong> sides. We will copy your exact design, logo, and fonts onto durable luxury contactless hardware and encode your smart chip.
                        </p>
                      </div>
                    </div>

                    {/* Dual Upload Zone: Front & Back Photos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* 1. FRONT SIDE PHOTO */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                            <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                            <span>1. Front Side Photo *</span>
                          </label>
                          {existingCardFront && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                              ✓ Front Uploaded
                            </span>
                          )}
                        </div>

                        {existingCardFront ? (
                          <div className="space-y-2">
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-900">
                              <img src={existingCardFront} alt="Front preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-center text-xs font-semibold cursor-pointer transition-colors">
                                Replace Photo
                                <input type="file" accept="image/*" onChange={handleFrontCardUpload} className="hidden" />
                              </label>
                              <button
                                type="button"
                                onClick={() => setExistingCardFront(null)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                                title="Remove front photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50/80 cursor-pointer transition-colors text-center group">
                            <Upload className="w-6 h-6 text-sky-600 group-hover:scale-110 transition-transform mb-1.5" />
                            <span className="text-xs font-bold text-slate-800">Upload Front Side</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, or PDF photo</span>
                            <input type="file" accept="image/*" onChange={handleFrontCardUpload} className="hidden" />
                          </label>
                        )}
                      </div>

                      {/* 2. BACK SIDE PHOTO */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                            <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                            <span>2. Back Side Photo *</span>
                          </label>
                          {existingCardBack && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                              ✓ Back Uploaded
                            </span>
                          )}
                        </div>

                        {existingCardBack ? (
                          <div className="space-y-2">
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-900">
                              <img src={existingCardBack} alt="Back preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-center text-xs font-semibold cursor-pointer transition-colors">
                                Replace Photo
                                <input type="file" accept="image/*" onChange={handleBackCardUpload} className="hidden" />
                              </label>
                              <button
                                type="button"
                                onClick={() => setExistingCardBack(null)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                                title="Remove back photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50/80 cursor-pointer transition-colors text-center group">
                            <Upload className="w-6 h-6 text-sky-600 group-hover:scale-110 transition-transform mb-1.5" />
                            <span className="text-xs font-bold text-slate-800">Upload Back Side</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, or PDF photo</span>
                            <input type="file" accept="image/*" onChange={handleBackCardUpload} className="hidden" />
                          </label>
                        )}
                      </div>

                    </div>

                    {/* Destination Facility Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
                        3. What should happen when someone taps your card?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPurpose("Google 5-Star Review Tap Card Plan")}
                          className={`p-3 rounded-xl text-left transition-all ${
                            purpose === "Google 5-Star Review Tap Card Plan"
                              ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25 border border-sky-600'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                            <span className="text-xs font-bold">1-Tap Google 5-Star Review</span>
                          </div>
                          <p className={`text-[10px] mt-1 ${purpose === "Google 5-Star Review Tap Card Plan" ? 'text-sky-100' : 'text-slate-500'}`}>
                            Instantly opens your Google Place review modal on their phone.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPurpose("Full Website with QR Code Plan")}
                          className={`p-3 rounded-xl text-left transition-all ${
                            purpose === "Full Website with QR Code Plan"
                              ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25 border border-sky-600'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold">1-Tap Direct Website Opening</span>
                          </div>
                          <p className={`text-[10px] mt-1 ${purpose === "Full Website with QR Code Plan" ? 'text-sky-100' : 'text-slate-500'}`}>
                            Instantly loads your official company website or digital menu.
                          </p>
                        </button>
                      </div>

                      <div className="relative pt-1">
                        <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={targetUrl}
                          onChange={(e) => setTargetUrl(e.target.value)}
                          placeholder="Paste your Google review link OR official website URL here..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>

                    {/* Material Finish Selection for Cloned Card */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
                          4. Select Physical Hardware Material
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Selected: <strong className="text-slate-900">{material}</strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { name: "Anodized Silver", hex: "#cbd5e1", label: "Aluminum (Default)" },
                          { name: "Matte Jet Black", hex: "#121316", label: "Matte Black" },
                          { name: "Champagne Gold", hex: "#d4af37", label: "Gold Metal" },
                          { name: "Nordic Walnut Wood", hex: "#3e2414", label: "Walnut Wood" }
                        ].map((m) => (
                          <button
                            type="button"
                            key={m.name}
                            onClick={() => { setMaterial(m.name); setCardColor(m.hex); }}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                              material === m.name
                                ? 'bg-sky-50 border-sky-600 shadow-sm scale-[1.02]'
                                : 'bg-white hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: m.hex }} />
                            <span className="text-xs font-bold text-slate-800 truncate">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* -------------------- MODE B: BUILDER MODE -------------------- */}
                {creationMode === 'builder' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* 1. Purpose Plan */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                        1. Select Card Facility Plan
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Google 5-Star Review Tap Card Plan",
                          "Full Website with QR Code Plan",
                          "Creative Portfolio & Showcase Plan",
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

                    {/* 2. Card Color & Finish Selection */}
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

                      {/* Custom Hex Color Picker */}
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
                          placeholder="e.g. https://g.page/r/... (Google Maps Review Link) or website URL"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                        />
                      </div>
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
                          placeholder="e.g. Apex Studio"
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
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
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Quantity Requirement */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
                      {creationMode === 'clone' ? '5. Quantity Required:' : '5. Quantity Required:'} <span className="text-sky-800 font-bold">{quantity} Cards</span>
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
                      6. Your Contact Information
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
                      <label className="block text-[11px] text-slate-600 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Special Notes / Production Instructions</label>
                    <textarea
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder={creationMode === 'clone' 
                        ? "e.g., Keep exact same font and layout, place QR code in the bottom corner of the back side..." 
                        : "e.g., Font preferences, multiple location links, custom serial numbers..."}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none h-16"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {currentUser ? (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:flex-1 glass-button-primary py-3.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center justify-center gap-2 shadow-sm text-center"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span>
                        {submitting 
                          ? 'Transmitting Request...' 
                          : creationMode === 'clone'
                          ? 'Request 1:1 Vector Proof & Clone My Card'
                          : 'Submit Inquiry & Send via Brevo Email'}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRequireLogin('inquiry')}
                      className="w-full sm:flex-1 py-3.5 px-5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                    >
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Sign In with Google to Clone Your Card</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    className="w-full sm:w-auto glass-button-secondary py-3.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center justify-center gap-2 border-emerald-300 hover:border-emerald-400"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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
