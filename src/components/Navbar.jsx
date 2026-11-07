import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, LogOut, MessageSquare, ArrowRight, Menu, X, Lock } from 'lucide-react';
import { storage } from '../services/storage';

export const Navbar = ({ onOpenAuth, onOpenAdmin, onOpenReview, onOpenInquire, onOpenUserAccount }) => {
  const [user, setUser] = useState(storage.getCurrentUser());
  const [isAdmin, setIsAdmin] = useState(storage.isAdminAuthenticated());
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);

    const handleUserUpdate = () => setUser(storage.getCurrentUser());
    const handleAdminUpdate = () => setIsAdmin(storage.isAdminAuthenticated());

    window.addEventListener('tapnova_user_updated', handleUserUpdate);
    window.addEventListener('tapnova_admin_updated', handleAdminUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('tapnova_user_updated', handleUserUpdate);
      window.removeEventListener('tapnova_admin_updated', handleAdminUpdate);
    };
  }, []);

  const handleLogout = () => {
    storage.logoutUser();
  };

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Card Plans', href: '#solutions' },
    { label: 'Card Builder', href: '#customizer' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Why Tap Card?', href: '#comparison' },
  ];

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 transition-all duration-300 pointer-events-none">
      {/* Refined compact floating capsule (max-w-5xl prevents excessive blank spacing) */}
      <div className={`max-w-5xl mx-auto rounded-full px-3.5 sm:px-4.5 transition-all duration-300 pointer-events-auto border ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-2xl border-slate-200/90 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12),0_2px_4px_rgba(0,0,0,0.04)] py-2' 
          : 'bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-[0_8px_30px_-6px_rgba(15,23,42,0.08)] py-2 sm:py-2.5'
      }`}>
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo: Tap Card */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-extrabold font-heading text-slate-900 tracking-tight">
                  Tap Card
                </span>
              </div>
              <p className="text-[9px] text-slate-400 tracking-wider uppercase font-semibold mt-0.5">Smart Cards</p>
            </div>
          </a>

          {/* Unified Central Navigation Dock (Prevents sparse text and vast voids) */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 backdrop-blur-sm p-1 rounded-full border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* User & Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Customer Review Button */}
            <button
              onClick={onOpenReview}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-100 border border-slate-200/60 transition-all hover:shadow-xs"
              title="Submit a Customer Review"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span>Review</span>
            </button>

            {/* Customer Authentication State */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-full pl-1 pr-1.5 py-1 shadow-xs">
                <button
                  type="button"
                  onClick={onOpenUserAccount}
                  className="flex items-center gap-1.5 hover:bg-slate-200/60 rounded-full pl-0.5 pr-2 py-0.5 transition-colors cursor-pointer"
                  title="View My Private Quotes & Account"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/40" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="text-left hidden md:block leading-none pr-1">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[85px]">
                      {user.name?.split(' ')[0] || user.name || 'User'}
                    </p>
                    <span className="text-[9px] text-emerald-600 font-semibold">My Account</span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('general')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-100 border border-slate-200/60 transition-all hover:shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Admin Console Pill (Only visible when authenticated) */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Inquire CTA Button */}
            <button
              onClick={onOpenInquire}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold text-white tracking-wide shadow-md shadow-sky-500/25 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-1.5"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1 pb-1 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReview();
              }}
              className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-sky-700 hover:bg-sky-50 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
