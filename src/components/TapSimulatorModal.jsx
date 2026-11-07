import React, { useState } from 'react';
import { X, Star, ExternalLink, Download, Instagram, Linkedin, Globe, Phone, Check, Wifi, Sparkles } from 'lucide-react';

export const TapSimulatorModal = ({ isOpen, onClose }) => {
  const [activeScreen, setActiveScreen] = useState('review'); // 'review' | 'portfolio' | 'social'
  const [tapEffect, setTapEffect] = useState(false);
  const [simulatedRating, setSimulatedRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  if (!isOpen) return null;

  const triggerHapticSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext fallback
    }
  };

  const handleSimulateTap = () => {
    triggerHapticSound();
    setTapEffect(true);
    setTimeout(() => setTapEffect(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 border border-slate-200 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive Tap Experience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            What You Experience in 1 Tap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Test how the card instantly triggers Google reviews, creative portfolios, websites, and inquiry forms on your phone.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => { setActiveScreen('review'); handleSimulateTap(); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeScreen === 'review'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            ⭐ Google Review Tap
          </button>
          <button
            onClick={() => { setActiveScreen('portfolio'); handleSimulateTap(); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeScreen === 'portfolio'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            🎨 Digital Portfolio Tap
          </button>
          <button
            onClick={() => { setActiveScreen('social'); handleSimulateTap(); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeScreen === 'social'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            📱 Social & Contact vCard Tap
          </button>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Physical Tap Explanation & Trigger */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Contactless Tap</h4>
                  <p className="text-xs text-slate-500">Customer taps their phone on your card</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Instant Smart Tap Detection</h4>
                  <p className="text-xs text-slate-500">Popup appears on your phone automatically</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Immediate Action</h4>
                  <p className="text-xs text-slate-500">Submit your review, view work, or save contact details instantly</p>
                </div>
              </div>
            </div>

            {/* Tap Button with Ripple */}
            <div className="relative text-center">
              <button
                onClick={handleSimulateTap}
                className="w-full relative group glass-button-primary py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden shadow-sm"
              >
                <Wifi className="w-4 h-4 rotate-90 text-sky-200 group-hover:scale-125 transition-transform" />
                <span>Simulate Tap Again</span>
                {tapEffect && (
                  <span className="absolute inset-0 bg-white/40 animate-ping rounded-xl pointer-events-none" />
                )}
              </button>
              <p className="text-[11px] text-slate-500 mt-2">
                Simulates real contactless smart chip instant trigger
              </p>
            </div>
          </div>

          {/* Right Column: Realistic Smartphone Mockup */}
          <div className="md:col-span-7 flex justify-center">
            <div className="relative w-[300px] sm:w-[330px] h-[580px] bg-slate-900 rounded-[44px] p-3 border-4 border-slate-700 shadow-2xl flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600" />
              </div>

              {/* Tap Notification Banner Simulation */}
              {tapEffect && (
                <div className="absolute top-12 left-3 right-3 z-30 p-2.5 rounded-2xl bg-white/95 border border-sky-400 text-slate-900 shadow-xl flex items-center gap-3 animate-bounce">
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs">
                    <Wifi className="w-4 h-4 rotate-90" />
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-[11px] text-slate-900">Smart Tap Detected</p>
                    <p className="text-[10px] text-slate-500">Opening destination link...</p>
                  </div>
                </div>
              )}

              {/* PHONE SCREEN CONTENT */}
              <div className="w-full h-full bg-slate-950 rounded-[34px] overflow-y-auto pt-10 pb-4 px-3.5 text-slate-100 flex flex-col justify-between border border-white/5">
                
                {/* 1. GOOGLE REVIEW SCREEN */}
                {activeScreen === 'review' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-xs shadow-sm">
                        G
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Google Maps Review</p>
                        <p className="text-[10px] text-slate-400">Aura Studio & Wellness</p>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md mb-2">
                        AS
                      </div>
                      <h4 className="text-sm font-bold text-white">Rate Aura Studio</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Posting publicly to Google</p>
                    </div>

                    {/* Star selector */}
                    <div className="flex justify-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSimulatedRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${
                            star <= simulatedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                          }`} />
                        </button>
                      ))}
                    </div>

                    {reviewSubmitted ? (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center text-emerald-300 text-xs animate-fadeIn">
                        <Check className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                        <p className="font-semibold">Thank you for your 5-star review!</p>
                        <p className="text-[10px] text-emerald-200/70 mt-0.5">Your rating is now live on Google.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Share details of your experience (optional)..."
                          defaultValue="Incredible service, stunning atmosphere! 10/10 recommend."
                          className="w-full text-xs p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 resize-none h-16 outline-none focus:border-sky-400"
                        />
                        <button
                          onClick={() => setReviewSubmitted(true)}
                          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                        >
                          Post Review to Google
                        </button>
                      </div>
                    )}
                    <p className="text-[9px] text-slate-500 text-center pt-2">
                      Official Google Business Profile API Link
                    </p>
                  </div>
                )}

                {/* 2. PORTFOLIO SCREEN */}
                {activeScreen === 'portfolio' && (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden h-28 bg-slate-800 border border-white/10">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                        alt="Creator" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2.5 flex flex-col justify-end">
                        <h4 className="text-xs font-bold text-white">Elena Rostova</h4>
                        <p className="text-[10px] text-sky-300">Creative Visual Director & Photographer</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="h-16 rounded-lg overflow-hidden border border-white/10">
                        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80" alt="Work" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-16 rounded-lg overflow-hidden border border-white/10">
                        <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=200&q=80" alt="Work" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-16 rounded-lg overflow-hidden border border-white/10">
                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=200&q=80" alt="Work" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Watch 2026 Showreel (Video)</span>
                      </button>
                      <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10">
                        <Globe className="w-3.5 h-3.5 text-sky-400" />
                        <span>Book a Studio Session</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. SOCIAL & VCARD SCREEN */}
                {activeScreen === 'social' && (
                  <div className="space-y-3">
                    <div className="text-center pt-1">
                      <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-sky-400 to-blue-500 shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
                          alt="Marcus" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1.5">Marcus Vance</h4>
                      <p className="text-[10px] text-sky-400 font-medium">Founder & Managing Partner</p>
                      <p className="text-[9px] text-slate-400">Vance Global Ventures</p>
                    </div>

                    {/* Download vCard action */}
                    <button
                      onClick={() => setContactSaved(true)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        contactSaved 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-sky-500 hover:bg-sky-400 text-white font-bold'
                      }`}
                    >
                      {contactSaved ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                      <span>{contactSaved ? 'Added to Contacts' : 'Save Contact to Phonebook'}</span>
                    </button>

                    {/* Social Quick Links */}
                    <div className="space-y-1.5 pt-1">
                      <a href="#demo" onClick={(e) => e.preventDefault()} className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-3.5 h-3.5 text-pink-400" />
                          <span className="text-[11px] font-medium text-slate-200">Instagram Profile</span>
                        </div>
                        <span className="text-[10px] text-slate-400">@marcus.vance</span>
                      </a>

                      <a href="#demo" onClick={(e) => e.preventDefault()} className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs">
                        <div className="flex items-center gap-2">
                          <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-[11px] font-medium text-slate-200">LinkedIn Connect</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Connect</span>
                      </a>

                      <a href="#demo" onClick={(e) => e.preventDefault()} className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] font-medium text-slate-200">WhatsApp Chat</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Direct Message</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone Bottom Bar */}
                <div className="pt-2 border-t border-white/10 text-center">
                  <div className="w-20 h-1 bg-white/20 rounded-full mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
