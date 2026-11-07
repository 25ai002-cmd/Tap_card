import React from 'react';
import { Smartphone, Zap, Download, Wifi, CheckCircle2, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/initialData';

export const HowItWorks = ({ onOpenSimulator }) => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white/70 backdrop-blur-md border-y border-slate-200/80 relative overflow-hidden w-full max-w-full">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-100/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200/90 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Instantaneous & Frictionless
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 mt-4 tracking-tight">
            How Tap Card Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            Zero apps, zero Bluetooth pairing, zero battery required on your phone. Just a clean, instantaneous contactless connection.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div 
              key={step.step}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                    {idx === 0 && <Wifi className="w-5 h-5 rotate-90" />}
                    {idx === 1 && <Smartphone className="w-5 h-5" />}
                    {idx === 2 && <Download className="w-5 h-5" />}
                  </div>
                </div>

                <h3 className="text-lg font-bold font-heading text-slate-900 mb-2.5 group-hover:text-sky-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{step.highlight}</span>
              </div>
            </div>
          ))}

        </div>

        {/* Bottom Interactive Demo Bar */}
        <div className="mt-14 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-5 text-center sm:text-left">
          <div className="flex items-center gap-3.5 sm:gap-4 text-left">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sky-600 shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Experience the live smartphone simulation</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">Test how Google reviews, visual portfolios, and contact cards instantly open on your phone.</p>
            </div>
          </div>
          <button
            onClick={onOpenSimulator}
            className="glass-button-primary w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-white whitespace-nowrap shadow-md inline-flex items-center justify-center gap-2 shrink-0 text-center"
          >
            <span>Launch Phone Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
