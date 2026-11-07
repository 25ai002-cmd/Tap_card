export const INITIAL_SITE_CONTENT = {
  hero: {
    badge: "Next-Gen Contactless Hardware",
    announcement: "Original High-Speed Chipset • Lifetime Card Validity • Zero App Required",
    title: "Precision Contactless Cards for Reviews, Portfolios & Inquiries.",
    subtitle: "Custom-manufactured contactless hardware for businesses, freelancers, and creative studios. Choose your card plan — Google reviews, creative portfolios, company websites with QR codes, or lead generation forms. One-time hardware purchase with lifetime smart tap access.",
    heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    ctaPrimary: "Configure Your Card",
    ctaSecondary: "See How It Works",
    highlights: [
      { title: "No App Required", desc: "Opens natively in standard browser on any phone." },
      { title: "Lifetime Smart Card", desc: "Permanent chip access with zero subscription lock-in." },
      { title: "Multiple Purpose Plans", desc: "Google Reviews, Portfolios, Full Websites, or Lead Capture." },
      { title: "QR Code Backup", desc: "Works seamlessly on all smartphones with instant camera scan." }
    ],
    specs: [
      { value: "LIFETIME", label: "Card Validity" },
      { value: "0.1 SEC", label: "Instant Trigger Speed" },
      { value: "100K+ TAPS", label: "Durability Rating" },
      { value: "0 APPS", label: "Native Phone Launch" }
    ]
  },
  contact: {
    whatsapp: "+1 (555) 389-9270",
    email: "inquiries@tapcard.com",
    supportEmail: "support@tapcard.com",
    address: "Tap Card Studio, Tech Park, Suite 402",
    businessHours: "Monday – Saturday: 9:00 AM – 7:00 PM",
  },
  branding: {
    name: "Tap Card",
    tagline: "Smart Contactless Business & Review Cards",
    footerText: "Tap Card is India's premier contactless smart networking solution. We manufacture durable, precision-engineered smart business cards and Google review tap cards for professionals, clinics, and enterprises.",
  }
};

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Tap The Card",
    description: "Hold your Tap Card near any smartphone. The embedded battery-free smart chip triggers within 0.1 seconds.",
    highlight: "Works through phone cases up to 3cm"
  },
  {
    step: "02",
    title: "Instant Screen Popup",
    description: "Your phone instantly opens the destination page — leave a 5-star Google review, explore the portfolio showcase, visit the website, or submit an inquiry form.",
    highlight: "100% Native Web Browser Launch"
  },
  {
    step: "03",
    title: "Instant Connection & Conversion",
    description: "Leave a 5-star Google rating in seconds, browse creative work, get in touch, or save full contact details directly to your phone.",
    highlight: "Lifetime Smart Hardware Access"
  }
];

export const COMPARISON_FEATURES = [
  {
    feature: "Contact Sharing Speed",
    paper: "Manually typing name, number & email into your phone (often lost)",
    tapCard: "1 Tap adds full contact details directly into your phonebook",
    icon: "zap"
  },
  {
    feature: "Updating Details",
    paper: "Requires throwing away old cards and paying to reprint",
    tapCard: "Update phone, email, address, or links anytime without reprinting",
    icon: "refresh"
  },
  {
    feature: "Google Reviews Boost",
    paper: "Paper flyers or verbal requests with <2% follow-through",
    tapCard: "Instant 1-tap popup directly on Google review screen at checkout",
    icon: "star"
  },
  {
    feature: "Card Validity & Renewal",
    paper: "Constantly running out, continuous reprinting bills",
    tapCard: "Lifetime smart hardware access — one-time purchase with no expiration",
    icon: "shield"
  },
  {
    feature: "Durability & Wear",
    paper: "Easily bent, torn, crumpled, water-damaged, or thrown away",
    tapCard: "Waterproof, laser-etched, scratch-resistant hardware rated for 100,000+ taps",
    icon: "leaf"
  },
  {
    feature: "Dedicated Functional Plans",
    paper: "Static printed paper with zero interactive capabilities",
    tapCard: "Choose from Google Review, Portfolio, Full Website + QR, or Lead Gen plans",
    icon: "check"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "plan-review",
    name: "Google 5-Star Review Tap Card Plan",
    tagline: "Instant 5-star Google review prompt on tap for retail, clinics, salons & restaurants",
    category: "reviews",
    badge: "Review Plan",
    lifetimeBadge: "Lifetime Smart Card",
    description: "Designed for immediate 5-star Google feedback. Simply tap your phone and the verified Google Maps review modal launches with 5 stars pre-selected, ready to submit in seconds without typing.",
    includedItems: [
      "Direct Google Place ID review link pre-programmed into chip",
      "Native phone launch — zero app installation required on your phone",
      "Lifetime card validity with permanent chip access",
      "High-contrast laser QR code backup on reverse side for all phones",
      "Includes acrylic counter display stand (optional add-on)",
      "Permanent write-locking to protect against tampering"
    ],
    technicalSpecs: {
      standard: "ISO/IEC 14443 Type A",
      chip: "High-Speed Microchip (888 Bytes)",
      readRange: "15mm – 40mm",
      durability: "100,000+ Taps Rated"
    },
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    materialOptions: ["Matte Velvet Black", "Anodized Silver Aluminum", "Nordic Walnut Wood", "Ultra-Clear Acrylic", "Brushed Gold Metal"]
  },
  {
    id: "plan-portfolio",
    name: "Creative Portfolio & Showcase Plan",
    tagline: "For photographers, visual creators, cinematographers, agencies & architects",
    category: "portfolio",
    badge: "Portfolio Plan",
    lifetimeBadge: "Lifetime Smart Card",
    description: "Designed for high-impact visual presentations. A single tap loads your high-res portfolio gallery, Behance case studies, showreels, or social hub directly on your screen.",
    includedItems: [
      "High-speed chip pre-encoded to your digital portfolio or gallery",
      "Instant full-resolution digital showcase loaded directly on your phone",
      "One-tap digital contact card (.vcf) direct phonebook save",
      "Lifetime card validity with rewritable destination URL capability",
      "Precision laser-etched custom logo and cardholder typography",
      "Waterproof, scratch-resistant luxury material finish"
    ],
    technicalSpecs: {
      standard: "ISO/IEC 14443 Type A",
      chip: "High-Speed Microchip (888 Bytes)",
      readRange: "15mm – 40mm",
      durability: "100,000+ Taps Rated"
    },
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    materialOptions: ["Matte Velvet Black", "Anodized Silver Aluminum", "Nordic Walnut Wood", "Ultra-Clear Acrylic", "Brushed Gold Metal"]
  },
  {
    id: "plan-website",
    name: "Full Website with QR Code Plan",
    tagline: "Dual smart tap + precision laser QR code for company websites & custom domains",
    category: "website",
    badge: "Website + QR Plan",
    lifetimeBadge: "Lifetime Smart Card",
    description: "Engineered for corporate executives, sales teams, and companies. Encodes your full company website or landing page into the smart card, paired with a permanent laser-etched dynamic QR code on the back for 100% smartphone compatibility.",
    includedItems: [
      "Direct encoding to your official company website or domain URL",
      "High-contrast precision laser QR code on card back for older devices",
      "Dual contactless interaction: 1-Tap or Camera QR Scan",
      "Lifetime card validity — zero subscription or renewal bills",
      "Edge-to-edge custom corporate branding with vector logo etching",
      "Free digital layout vector proof before batch manufacturing"
    ],
    technicalSpecs: {
      standard: "ISO/IEC 14443 Type A",
      chip: "High-Speed Microchip (888 Bytes)",
      readRange: "15mm – 40mm",
      durability: "100,000+ Taps Rated"
    },
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    materialOptions: ["Matte Velvet Black", "Anodized Silver Aluminum", "Nordic Walnut Wood", "Ultra-Clear Acrylic", "Brushed Gold Metal"]
  },
  {
    id: "plan-inquiry",
    name: "Lead Generation & Inquiry Form Plan",
    tagline: "Interactive client quotation, consultation booking & instant lead capture on tap",
    category: "inquiry",
    badge: "Inquiry Form Plan",
    lifetimeBadge: "Lifetime Smart Card",
    description: "Designed for rapid booking and quotation requests. A single tap launches an interactive quotation and consultation intake form on your phone screen, connecting you directly via email and WhatsApp.",
    includedItems: [
      "Pre-linked to interactive quotation & lead capture questionnaire",
      "Instant email notification via Brevo API sent straight to your inbox",
      "Direct 1-click WhatsApp chat reply for rapid lead closure",
      "Lifetime card validity with permanent hardware durability",
      "Complete company contact card (vCard) instant download",
      "Heavyweight scratch-resistant polymer or anodized metal build"
    ],
    technicalSpecs: {
      standard: "ISO/IEC 14443 Type A",
      chip: "High-Speed Microchip (888 Bytes)",
      readRange: "15mm – 40mm",
      durability: "100,000+ Taps Rated"
    },
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    materialOptions: ["Matte Velvet Black", "Anodized Silver Aluminum", "Nordic Walnut Wood", "Ultra-Clear Acrylic", "Brushed Gold Metal"]
  }
];

export const INITIAL_REVIEWS = [];

export const INITIAL_INQUIRIES = [
  {
    id: "inq-101",
    customerName: "Sophia Hernandez",
    email: "sophia@cafeneon.com",
    phone: "+1 415 892 1190",
    company: "Neon Artisan Bakery & Cafe",
    cardType: "Google 5-Star Review Tap Card Plan",
    material: "Matte Velvet Black",
    quantity: 15,
    customNotes: "Need our white neon script logo etched on front, and 2 smart cards programmed for our 2 branch locations.",
    status: "new",
    date: "2026-11-06T15:20:00Z"
  }
];
