import React from 'react';
import { SmartNfcCardMockup } from './SmartNfcCardMockup';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Utensils, 
  Shirt, 
  Stethoscope, 
  Star,
  Globe,
  Copy
} from 'lucide-react';

export const Hero = ({ siteContent, onOpenSimulator, onOpenInquire }) => {
  const hero = siteContent?.hero || {};

  return (
    <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden w-full max-w-full">
      {/* Subtle modern geometric background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,#000_70%,transparent_100%)] opacity-45 pointer-events-none -z-10" />

      {/* Ambient background glows for White Glassmorphism */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-sky-300/35 via-cyan-200/25 to-blue-300/20 blur-[140px] rounded-full pointer-events-none -z-10 overflow-hidden" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-indigo-200/20 blur-[130px] rounded-full pointer-events-none -z-10 overflow-hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          
          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            
            {/* Top Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50/90 border border-sky-200/90 text-sky-800 text-xs font-semibold shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{hero.badge || "Helping Businesses Grow • Google Reviews & Direct Website Tap"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.14]">
              {hero.title && !hero.title.includes('Helping Businesses Grow') ? (
                hero.title
              ) : (
                <>
                  Helping Businesses Grow with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700">
                    Faster Google Reviews
                  </span>{' '}
                  & Direct Website Access.
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {hero.subtitle || "People check Google reviews and visit websites before deciding where to dine, shop, or get treated. Whether you run a restaurant, fashion boutique, hospital, or clinic, our smart contactless cards help you get 5-star Google reviews faster at checkout and instantly open your official website with a single tap on any phone."}
            </p>

            {/* Industry-Specific Growth & Facilities Showcase */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Tailored for High-Traffic Businesses:</span>
                </span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Google Reviews + Direct Website on 1 Tap
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                {/* 1. Food & Restaurants */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 hover:border-amber-300 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Utensils className="w-3.5 h-3.5" />
                    </span>
                    <span>Food & Restaurants</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-amber-800">1-Tap Google Reviews</strong> on dining tables & bill counter + <span className="text-slate-600 font-medium">Directly opens your restaurant website or digital menu.</span>
                  </p>
                </div>

                {/* 2. Dressing & Fashion */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50/60 to-pink-50/40 border border-purple-200/80 hover:border-purple-300 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Shirt className="w-3.5 h-3.5" />
                    </span>
                    <span>Fashion & Dressing</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-purple-800">1-Tap Google Reviews</strong> at cash counter + <span className="text-slate-600 font-medium">Directly opens your official brand website or clothing store.</span>
                  </p>
                </div>

                {/* 3. Hospitals & Clinics */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-50/60 to-blue-50/40 border border-sky-200/80 hover:border-sky-300 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </span>
                    <span>Hospitals & Clinics</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-sky-800">1-Tap Google Reviews</strong> for patient trust + <span className="text-slate-600 font-medium">Directly opens your official hospital or clinic website.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Concrete Key Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>1-Tap 5-Star Google Reviews at Checkout</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Direct Official Website Opening (0.1s Fast)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Lifetime Smart Card, Zero Monthly Fees</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Contactless Tap + High-Contrast QR Backup</span>
              </div>
            </div>

            {/* Existing Business Card Clone Callout Banner */}
            <a 
              href="#customizer" 
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-sky-50/90 to-blue-50/90 border border-sky-200/90 hover:border-sky-400 transition-all shadow-xs group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                    Already have a simple business card?
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Upload front & back photos — we copy your entire design 1:1 and turn it into a Tap Card.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs shrink-0 group-hover:translate-x-0.5 transition-transform hidden sm:inline-flex items-center gap-1">
                <span>Upload Photos</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </a>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-3.5 pt-2">
              <a
                href="#customizer"
                className="glass-button-primary w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2 shadow-lg group"
              >
                <span>Equip Your Business</span>
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
