import React, { useState } from 'react';
import { SmartNfcCardMockup } from './SmartNfcCardMockup';
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const Hero = ({ siteContent, onOpenSimulator, onOpenInquire }) => {
  const hero = siteContent?.hero || {};

  return (
    <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle modern geometric background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,#000_70%,transparent_100%)] opacity-45 pointer-events-none -z-10" />

      {/* Ambient background glows for White Glassmorphism */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-sky-300/35 via-cyan-200/25 to-blue-300/20 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-indigo-200/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          
          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.14]">
              Precision Contactless Cards for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700">
                Google Reviews, Portfolios
              </span>{' '}
              & Smart Networking.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {hero.subtitle || "Custom-manufactured contactless hardware for businesses, freelancers, and creative studios. Choose your card plan — Google reviews, creative portfolios, company websites with QR codes, or lead generation forms. One-time hardware purchase with lifetime smart tap access."}
            </p>

            {/* Concrete Key Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>One-Time Hardware, Lifetime Card Validity</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Direct destination URL (Google Maps/Site)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Waterproof, UV-etched scratch resistance</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Digital vector layout proof before production</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-3.5 pt-2">
              <a
                href="#customizer"
                className="glass-button-primary w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2 shadow-lg group"
              >
                <span>Configure Your Hardware</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenSimulator}
                className="glass-button-secondary w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-slate-900 inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap className="w-4 h-4 text-sky-600" />
                <span>Test Live Tap Demo</span>
              </button>
            </div>

            {/* Hardware Specification Grid */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(hero.specs || []).map((spec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md transition-all hover:border-sky-300 hover:shadow-md">
                  <p className="text-xs font-mono font-bold text-slate-900 tracking-tight">{spec.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono font-medium">{spec.label}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Live Interactive Hardware Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <SmartNfcCardMockup onOpenSimulator={onOpenSimulator} />
          </div>

        </div>
      </div>
    </section>
  );
};
