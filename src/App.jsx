import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { SolutionsCatalog } from './components/SolutionsCatalog';
import { ComparisonSection } from './components/ComparisonSection';
import { CardCustomizer } from './components/CardCustomizer';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

// Modals
import { TapSimulatorModal } from './components/TapSimulatorModal';
import { ReviewModal } from './components/ReviewModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { InquiryModal } from './components/InquiryModal';
import { UserAccountModal } from './components/UserAccountModal';

import { storage } from './services/storage';

export function App() {
  // App Core State
  const [siteContent, setSiteContent] = useState(storage.getSiteContent());
  const [products, setProducts] = useState(storage.getProducts());
  const [reviews, setReviews] = useState(storage.getReviews());
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());

  // Modal Dialog States
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [authReason, setAuthReason] = useState('general'); // 'inquiry' | 'review' | 'general'
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState(null);
  const [activeVideoReview, setActiveVideoReview] = useState(null);

  // Sync state when storage events fire
  const reloadData = () => {
    setSiteContent(storage.getSiteContent());
    setProducts(storage.getProducts());
    setReviews(storage.getReviews());
    setCurrentUser(storage.getCurrentUser());
  };

  useEffect(() => {
    window.addEventListener('tapnova_content_updated', reloadData);
    window.addEventListener('tapnova_products_updated', reloadData);
    window.addEventListener('tapnova_reviews_updated', reloadData);
    window.addEventListener('tapnova_user_updated', reloadData);

    return () => {
      window.removeEventListener('tapnova_content_updated', reloadData);
      window.removeEventListener('tapnova_products_updated', reloadData);
      window.removeEventListener('tapnova_reviews_updated', reloadData);
      window.removeEventListener('tapnova_user_updated', reloadData);
    };
  }, []);

  // Stealth Admin Triggers: URL hash (#Tanvi16), query (?Tanvi16), or shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const checkAdminTrigger = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        hash === '#tanvi16' || 
        hash === '#/tanvi16' || 
        search.includes('tanvi16') || 
        path === '/tanvi16'
      ) {
        setIsAdminOpen(true);
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    const hash = window.location.hash.toLowerCase();
    if (
      hash === '#tanvi16' || 
      hash === '#/tanvi16' || 
      hash === '#admin' || 
      hash === '#/admin'
    ) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleOpenAuth = (reason = 'general') => {
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  };

  const handleOpenInquiryForProduct = (product = null) => {
    setSelectedProductForInquiry(product);
    setIsInquiryOpen(true);
  };

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      handleOpenAuth('review');
    } else {
      setIsReviewModalOpen(true);
    }
  };

  const handleSelectProductForCustomizer = (product) => {
    setSelectedProductForInquiry(product);
    const el = document.getElementById('customizer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8fafc] text-slate-800 flex flex-col relative selection:bg-sky-500 selection:text-white">
      
      {/* Background subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[850px] h-[500px] bg-gradient-to-tr from-sky-200/35 via-blue-100/25 to-transparent blur-[160px] rounded-full" />
        <div className="absolute top-1/3 -right-32 w-[650px] h-[650px] bg-gradient-to-bl from-cyan-100/30 via-sky-100/20 to-transparent blur-[160px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-100/25 via-sky-100/20 to-transparent blur-[170px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <Navbar
        onOpenAuth={() => handleOpenAuth('general')}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReview={handleOpenReviewModal}
        onOpenInquire={() => handleOpenInquiryForProduct(null)}
        onOpenUserAccount={() => setIsAccountOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 1. Hero with Interactive Glassmorphism Visualizer */}
        <Hero
          siteContent={siteContent}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onOpenInquire={() => handleOpenInquiryForProduct(null)}
        />

        {/* 2. 1Card-style How It Works: 3-step contactless process */}
        <HowItWorks
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* 3. NFC Card Product Collections (VIP Metal, Regal, Google Review, Portfolios, Eco Bamboo) */}
        <SolutionsCatalog
          products={products}
          onSelectProductForCustomizer={handleSelectProductForCustomizer}
          onOpenInquire={handleOpenInquiryForProduct}
        />

        {/* 4. Comparison Section: Paper Business Cards vs. Tap Card */}
        <ComparisonSection
          onOpenInquire={() => handleOpenInquiryForProduct(null)}
        />

        {/* 5. Interactive Card Builder & Inquiry Configurator (Gated by Auth + Brevo Email) */}
        <CardCustomizer
          selectedProduct={selectedProductForInquiry}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          siteContent={siteContent}
          currentUser={currentUser}
          onRequireLogin={(reason) => handleOpenAuth(reason)}
        />

        {/* 6. Customer Reviews, Ratings & Video Testimonials (Gated by Auth) */}
        <ReviewsSection
          reviews={reviews}
          onOpenReviewModal={handleOpenReviewModal}
          onPlayVideo={(review) => setActiveVideoReview(review)}
        />
      </main>

      {/* Footer */}
      <Footer
        siteContent={siteContent}
      />

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Interactive Tap Demo Simulator Modal */}
      <TapSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* 2. Customer Review & Video Submission Modal (REQUIRES LOGIN) */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentUser={currentUser}
        onRequireLogin={(reason) => handleOpenAuth(reason)}
      />

      {/* 3. Customer Video Testimonial Player */}
      <VideoPlayerModal
        review={activeVideoReview}
        onClose={() => setActiveVideoReview(null)}
      />

      {/* 4. Customer Login / Sign In Modal (GOOGLE + EMAIL) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        reason={authReason}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (authReason === 'review') {
            setIsReviewModalOpen(true);
          }
        }}
      />

      {/* 5. Admin Command Dashboard (Stealth CMS & Moderation) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onRefreshData={reloadData}
      />

      {/* 6. General Inquiry & Bulk Quote Modal (REQUIRES LOGIN + BREVO EMAIL) */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        selectedProduct={selectedProductForInquiry}
        siteContent={siteContent}
        currentUser={currentUser}
        onRequireLogin={(reason) => handleOpenAuth(reason)}
      />

      {/* 7. Private User Account & Orders Portal */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={currentUser}
        onLogout={() => {
          storage.logoutUser();
          setCurrentUser(null);
        }}
      />

    </div>
  );
}

export default App;
