import React from 'react';
import { COMPARISON_FEATURES } from '../data/initialData';
import { Check, X, ArrowRight, Zap, Sparkles } from 'lucide-react';

export const ComparisonSection = ({ onOpenInquire }) => {
  return (
    <section id="comparison" className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/40 to-slate-50 border-b border-slate-200/80 relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200/90 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Modern Evolution
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 mt-4 tracking-tight">
            Why Professionals Are Replacing Paper Cards
          </h2>
          <p className="text-xs sm:text-base text-slate-600 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            See how smart tap technology eliminates constant reprinting bills, saves client contacts instantly, and drives verified customer reviews.
          </p>
        </div>

        {/* MOBILE ONLY: Native Card-Based Comparison Stack (< 768px) */}
        <div className="md:hidden space-y-3.5 w-full">
          {COMPARISON_FEATURES.map((row, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 w-full"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <h4 className="text-xs font-bold text-slate-900 font-heading tracking-tight">
                  {row.feature}
                </h4>
              </div>

              <div className="space-y-2">
                {/* Traditional Paper */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-50/50 border border-red-100 text-xs text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider block font-mono">Traditional Paper</span>
                    <span className="leading-relaxed text-slate-600 mt-0.5 block">{row.paper}</span>
                  </div>
                </div>

                {/* Tap Card Contactless */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-slate-800 font-medium shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider block font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span>Tap Card (Smart Contactless)</span>
                    </span>
                    <span className="leading-relaxed text-slate-900 mt-0.5 block font-semibold">{row.tapCard}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Callout */}
          <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3 text-center">
            <p className="text-sm font-bold text-slate-900">Ready to equip yourself or your company?</p>
            <p className="text-xs text-slate-500">We provide individual cards, executive sets, and corporate bulk packs with custom vector engraving.</p>
            <button
              onClick={onOpenInquire}
              className="glass-button-primary w-full py-3 rounded-xl text-xs font-bold text-white inline-flex items-center justify-center gap-2 shadow-md"
            >
              <span>Request Custom Proof & Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DESKTOP / TABLET ONLY: Full Side-by-Side Comparison Table (>= 768px) */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/90 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <th className="p-5 lg:p-6 w-1/4">Key Capability</th>
                  <th className="p-5 lg:p-6 w-3/8 text-slate-500 font-semibold">Traditional Paper Cards</th>
                  <th className="p-5 lg:p-6 w-3/8 bg-gradient-to-r from-sky-50 to-blue-50/60 text-sky-900 font-black border-l border-sky-200/70">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>Tap Card (Smart Contactless)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {COMPARISON_FEATURES.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-5 lg:p-6 font-bold text-slate-900 bg-slate-50/30">
                      {row.feature}
                    </td>
                    <td className="p-5 lg:p-6 text-slate-500">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5" />
                        </div>
                        <span>{row.paper}</span>
                      </div>
                    </td>
                    <td className="p-5 lg:p-6 text-slate-800 bg-sky-50/20 font-semibold border-l border-sky-100">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{row.tapCard}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Callout */}
          <div className="p-6 lg:p-8 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-slate-900">Ready to equip yourself or your company?</p>
              <p className="text-xs text-slate-500 mt-1">We provide individual cards, executive sets, and corporate bulk packs with custom vector engraving.</p>
            </div>
            <button
              onClick={onOpenInquire}
              className="glass-button-primary px-5 py-3 rounded-xl text-xs font-bold text-white inline-flex items-center gap-2 shadow-md whitespace-nowrap"
            >
              <span>Request Custom Proof & Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
