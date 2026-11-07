import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Layers, Package, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

export const SolutionsCatalog = ({ products, onSelectProductForCustomizer, onOpenInquire }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Card Plans' },
    { id: 'reviews', label: 'Google Review Plan' },
    { id: 'portfolio', label: 'Portfolio Showcase Plan' },
    { id: 'website', label: 'Website + QR Code Plan' },
    { id: 'inquiry', label: 'Inquiry Form Plan' }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-sky-100/30 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/90 text-sky-800 text-xs font-mono font-bold mb-3.5 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Lifetime Contactless Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Choose Your Card Plan
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            Every card includes permanent lifetime smart card access. Choose the plan engineered for your exact business use case — direct Google reviews, creative portfolios, full websites with QR codes, or interactive lead forms.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25 scale-[1.02]'
                    : 'bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 shadow-sm hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-3xl p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden group border border-slate-200/90 hover:border-sky-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200/90 text-sky-800 text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
                    {product.badge || "Verified Plan"}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                    <span>{product.lifetimeBadge || "Lifetime Smart Card"}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 group-hover:text-sky-700 transition-colors tracking-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-sky-700 font-semibold mt-1">
                  {product.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 mt-3.5 leading-relaxed font-normal">
                  {product.description}
                </p>

                {/* Plan Deliverables & Inclusions */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    <Package className="w-4 h-4 text-sky-600" />
                    <span>Included in This Plan:</span>
                  </div>
                  <div className="space-y-2">
                    {(product.includedItems || product.features || []).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Hardware Specs */}
                {product.technicalSpecs && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <span className="text-slate-400 block text-[9px] uppercase font-semibold">Chip Standard</span>
                      <span className="font-bold text-slate-800">{product.technicalSpecs.standard}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <span className="text-slate-400 block text-[9px] uppercase font-semibold">Durability</span>
                      <span className="font-bold text-slate-800">{product.technicalSpecs.durability || "100,000+ Taps"}</span>
                    </div>
                  </div>
                )}

                {/* Finishes */}
                {product.materialOptions && product.materialOptions.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-slate-200/80">
                    <p className="text-[11px] font-mono font-semibold text-slate-500 mb-2 uppercase">Available Physical Finishes:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.materialOptions.map((mat, mi) => (
                        <span key={mi} className="text-[10px] px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onSelectProductForCustomizer(product)}
                  className="glass-button-primary px-4 py-2.5 rounded-xl text-xs font-bold text-white inline-flex items-center gap-2 shadow-md"
                >
                  <span>Select Plan & Configure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenInquire(product)}
                  className="glass-button-secondary px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  Request Plan Quote
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
