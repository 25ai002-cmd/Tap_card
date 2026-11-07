import React from 'react';
import { Radio, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export const Footer = ({ siteContent }) => {
  const contact = siteContent?.contact || {};
  const branding = siteContent?.branding || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative pt-16 pb-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold font-heading text-slate-900 tracking-tight">
                  Tap Card
                </span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Smart Contactless Hardware
                </p>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              {branding.footerText || "Tap Card is India's premier contactless smart networking solution. We manufacture durable, precision-engineered smart business cards and Google review tap cards for professionals, clinics, and enterprises."}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Taking Corporate & Team Inquiries</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product Collections</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#solutions" className="hover:text-sky-600 transition-colors">VIP Metal Collection</a></li>
              <li><a href="#solutions" className="hover:text-sky-600 transition-colors">Regal Matte Black & Foil</a></li>
              <li><a href="#solutions" className="hover:text-sky-600 transition-colors">Google 5-Star Review Cards</a></li>
              <li><a href="#solutions" className="hover:text-sky-600 transition-colors">Creative Portfolio Cards</a></li>
              <li><a href="#solutions" className="hover:text-sky-600 transition-colors">Eco Bamboo & Wood Series</a></li>
              <li><a href="#comparison" className="hover:text-sky-600 transition-colors">Paper vs Tap Card Comparison</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Direct Business Inquiries</h4>
            <div className="space-y-2.5 text-xs text-slate-700">
              {contact.whatsapp && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp: <strong className="text-slate-900">{contact.whatsapp}</strong></span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Email: <a href={`mailto:${contact.email}`} className="text-slate-900 hover:underline">{contact.email}</a></span>
                </div>
              )}
              {contact.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{contact.address}</span>
                </div>
              )}
              {contact.businessHours && (
                <p className="text-[11px] text-slate-500 pt-1">
                  Operating Hours: {contact.businessHours}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Tap Card Studio. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
