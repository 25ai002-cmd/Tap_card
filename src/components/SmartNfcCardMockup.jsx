import React, { useState, useRef } from 'react';

// Procedural textures from the original design
const svgUrl = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const noise = (freq, a) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='190'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' seed='7'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${a} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`);
const wood = svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='500' height='320'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='0.003 0.07' numOctaves='4' seed='11'/><feColorMatrix values='0 0 0 0 0.58  0 0 0 0 0.38  0 0 0 0 0.22  2.2 0 0 0 -0.85'/></filter><rect width='100%' height='100%' fill='#3d2616'/><rect width='100%' height='100%' filter='url(#w)'/></svg>`);

const finishes = [
  { id: "black", name: "Matte Velvet Black", shortName: "Black", mat: "PVC Polymer", thk: "0.84 mm", price: "$24",
    surface: `${noise('0.9', 0.06)}, radial-gradient(120% 140% at 0% 0%, #2d2d31 0%, #121214 55%, #08080a 100%)`,
    fg: "#f3f1ec", muted: "rgba(243,241,236,.55)", edge: "rgba(255,255,255,.08)", star: "#f5c451", ring: "rgba(255,255,255,.7)", qrBg: "#f3f1ec", qrFg: "#111", glare: 0.35 },
  { id: "silver", name: "Anodized Silver Aluminum", shortName: "Aluminum", mat: "6061 Aluminum", thk: "0.80 mm", price: "$49",
    surface: `${noise('0.002 0.9', 0.22)}, linear-gradient(115deg, #c9cbcf 0%, #eef0f2 30%, #b5b8bd 55%, #e3e5e8 80%, #a9acb1 100%)`,
    fg: "#1b1c1f", muted: "rgba(27,28,31,.55)", edge: "rgba(0,0,0,.12)", star: "#b07d12", ring: "rgba(30,30,35,.55)", qrBg: "#1b1c1f", qrFg: "#e9ebee", glare: 0.8 },
  { id: "walnut", name: "Nordic Walnut Wood", shortName: "Wood", mat: "FSC Walnut", thk: "0.90 mm", price: "$39",
    surface: `linear-gradient(160deg, rgba(255,220,180,.10), rgba(0,0,0,.25)), ${wood}`,
    fg: "#f6e9d8", muted: "rgba(246,233,216,.62)", edge: "rgba(0,0,0,.25)", star: "#f2c678", ring: "rgba(255,235,210,.7)", qrBg: "#f6e9d8", qrFg: "#3a2414", glare: 0.45 },
  { id: "acrylic", name: "Ultra-Clear Acrylic", shortName: "Acrylic", mat: "Cast PMMA", thk: "1.00 mm", price: "$34",
    surface: `linear-gradient(135deg, rgba(255,255,255,.75), rgba(220,232,245,.45) 50%, rgba(255,255,255,.65))`,
    fg: "#0f2236", muted: "rgba(15,34,54,.55)", edge: "rgba(120,150,180,.45)", star: "#c98a00", ring: "rgba(44,92,255,.6)", qrBg: "#0f2236", qrFg: "#eaf2fb", glare: 0.9 },
  { id: "gold", name: "Brushed Gold Metal", shortName: "Metal", mat: "Stainless, 24K PVD", thk: "0.80 mm", price: "$79",
    surface: `${noise('0.002 0.9', 0.2)}, linear-gradient(115deg, #a77b2c 0%, #f1d58f 28%, #b8893a 55%, #f6dea0 78%, #9c7128 100%)`,
    fg: "#2b1d05", muted: "rgba(43,29,5,.6)", edge: "rgba(80,50,0,.25)", star: "#2b1d05", ring: "rgba(43,29,5,.55)", qrBg: "#2b1d05", qrFg: "#f4dc9c", glare: 0.8 },
];

const actions = {
  review: { label: "Google 5-Star Review Tap Card Plan", stars: true, url: n => `g.page/r/${n}/review`, title: "Google review" },
  portfolio: { label: "Creative Portfolio & Showcase Plan", url: n => `${n}.portfolio/showcase`, title: "Portfolio" },
  website: { label: "Full Website with QR Code Plan", url: n => `${n}.com`, title: "Website" },
  inquiry: { label: "Lead Generation & Inquiry Form Plan", url: n => `${n}.com/inquire`, title: "Inquiry Form" },
};

function slug(n) {
  return (n.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 2).join("-")) || "aura-studio";
}

// Procedural dynamic QR code matching the uploaded design
function renderQRCode(seedStr, qrBg) {
  const N = 21;
  let h = 2166136261;
  for (const c of seedStr) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  const inFinder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([fx, fy]) => x >= fx - 1 && x < fx + 8 && y >= fy - 1 && y < fy + 8);
  
  let rects = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!inFinder(x, y) && rnd() > 0.52) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" />);
      }
    }
  }

  const finder = (fx, fy, key) => (
    <g key={key}>
      <rect x={fx} y={fy} width="7" height="7" rx="1.4" />
      <rect x={fx + 1} y={fy + 1} width="5" height="5" rx="0.9" fill={qrBg} />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" rx="0.6" />
    </g>
  );

  return (
    <svg viewBox={`0 0 ${N} ${N}`} fill="currentColor" shapeRendering="crispEdges" className="w-full h-full block">
      {finder(0, 0, 'f1')}
      {finder(N - 7, 0, 'f2')}
      {finder(0, N - 7, 'f3')}
      {rects}
    </svg>
  );
}

export const SmartNfcCardMockup = ({ onOpenSimulator }) => {
  // Default to Anodized Silver Aluminum
  const [selectedFinish, setSelectedFinish] = useState(
    finishes.find(f => f.id === "silver") || finishes[1]
  );
  const [businessName, setBusinessName] = useState("Apex Fitness Studio");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [actionKey, setActionKey] = useState("review");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPhoneIn, setIsPhoneIn] = useState(false);
  const [isTapping, setIsTapping] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isStatusOk, setIsStatusOk] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const cardRef = useRef(null);

  const currentAction = actions[actionKey] || actions.review;
  const currentUrl = currentAction.url(slug(businessName || "your-brand"));

  // Mouse hover 3D tilt and glare
  const handlePointerMove = (e) => {
    if (e.pointerType === "touch" || !cardRef.current) return;
    const b = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width;
    const py = (e.clientY - b.top) / b.height;
    cardRef.current.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
    cardRef.current.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
    cardRef.current.style.setProperty("--gx", `${px * 100}%`);
    cardRef.current.style.setProperty("--gy", `${py * 100}%`);
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--rx", "0deg");
    cardRef.current.style.setProperty("--ry", "0deg");
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Full interactive phone tap animation exactly matching the uploaded code
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const handleSimulateTap = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setIsStatusOk(false);

    if (isFlipped) {
      setIsFlipped(false);
      await wait(500);
    }

    setStatusText("Bringing phone near card…");
    setIsPhoneIn(true);
    await wait(650);

    setIsTapping(true);
    setStatusText("Reading smart card…");
    await wait(900);

    setIsRead(true);
    setIsTapping(false);
    setIsStatusOk(true);
    setStatusText(`✓ Read in 0.18s — opened ${currentUrl}`);

    await wait(1800);
    setIsPhoneIn(false);
    setIsRead(false);
    await wait(500);

    setIsStatusOk(false);
    setStatusText("");
    setIsSimulating(false);

    // Also trigger parent callback if available
    if (onOpenSimulator) {
      onOpenSimulator();
    }
  };

  return (
    <div className="nfc-mockup-wrapper w-full max-w-[560px] mx-auto">
      <style>{`
        .nfc-mockup-panel {
          --panel: #fbfaf7;
          --ink: #17171a;
          --muted: #6d6c67;
          --line: #e4e2db;
          --accent: #2c5cff;
          --sans: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 1px 0 #fff inset, 0 20px 50px -30px rgba(20,20,30,.25);
          color: var(--ink);
        }
        .nfc-stage {
          position: relative;
          border-radius: 18px;
          padding: 34px 22px 40px;
          overflow: hidden;
          perspective: 1400px;
          background: radial-gradient(120% 80% at 50% 0%, #ffffff 0%, #ecebe5 70%);
          border: 1px solid var(--line);
        }
        .nfc-stage::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.5;
          pointer-events: none;
          background-image: radial-gradient(#c9c6bc 1px, transparent 1px);
          background-size: 16px 16px;
          mask-image: radial-gradient(70% 60% at 50% 50%, #000, transparent);
        }
        .nfc-tilt {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          aspect-ratio: 85.6 / 54;
          transform-style: preserve-3d;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.25s ease-out;
          cursor: pointer;
          outline: none;
        }
        .nfc-shadow {
          position: absolute;
          left: 8%;
          right: 8%;
          bottom: -14px;
          height: 30px;
          border-radius: 50%;
          background: rgba(20, 18, 12, 0.35);
          filter: blur(16px);
          transform: translateZ(-40px);
        }
        .nfc-flip {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(.2, .8, .2, 1);
        }
        .nfc-tilt.is-flipped .nfc-flip {
          transform: rotateY(180deg);
        }
        .nfc-face {
          position: absolute;
          inset: 0;
          border-radius: 4.2% / 6.6%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          box-shadow: 0 0 0 1px var(--edge) inset, 0 1px 0 rgba(255,255,255,.25) inset;
          padding: 6% 6.5%;
          display: flex;
          flex-direction: column;
          transition: background 0.5s, color 0.5s;
        }
        .nfc-face.back {
          transform: rotateY(180deg);
          flex-direction: row;
          gap: 6%;
          align-items: center;
        }
        .nfc-glare {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: soft-light;
          opacity: var(--glare-o, 0.7);
          background: radial-gradient(60% 80% at var(--gx, 30%) var(--gy, 20%), rgba(255,255,255,.9), transparent 60%);
        }
        .nfc-face > *:not(.nfc-glare) {
          position: relative;
        }
        .nfc-rings {
          position: absolute;
          left: 12%;
          top: 20%;
          width: 0;
          height: 0;
          pointer-events: none;
          transform: translateZ(1px);
        }
        .nfc-rings i {
          position: absolute;
          left: -30px;
          top: -30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid var(--ring);
          opacity: 0;
        }
        .nfc-tilt.is-tapping .nfc-rings i {
          animation: nfcRing 1.2s ease-out infinite;
        }
        .nfc-tilt.is-tapping .nfc-rings i:nth-child(2) {
          animation-delay: 0.4s;
        }
        .nfc-tilt.is-tapping .nfc-rings i:nth-child(3) {
          animation-delay: 0.8s;
        }
        @keyframes nfcRing {
          0% { transform: scale(0.4); opacity: 0.9; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        /* 3D Phone */
        .nfc-phone {
          position: absolute;
          width: 112px;
          aspect-ratio: 9 / 19;
          border-radius: 20px;
          background: #111;
          padding: 5px;
          z-index: 5;
          right: 6%;
          top: -6%;
          opacity: 0;
          pointer-events: none;
          transform: translate3d(60px, -120px, 0) rotate(18deg) scale(0.85);
          transition: all 0.65s cubic-bezier(.2, .8, .2, 1);
          box-shadow: 0 30px 50px -20px rgba(0,0,0,.5);
        }
        .nfc-phone .screen {
          width: 100%;
          height: 100%;
          border-radius: 17px;
          background: #f6f6f4;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          text-align: center;
        }
        .nfc-phone .notch {
          position: absolute;
          top: 9px;
          left: 50%;
          width: 34px;
          height: 9px;
          border-radius: 9px;
          background: #111;
          transform: translateX(-50%);
        }
        .nfc-phone .sc-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--accent);
          display: grid;
          place-items: center;
          color: #fff;
          transform: scale(0.6);
          opacity: 0;
          transition: 0.4s 0.1s;
        }
        .nfc-phone .sc-title {
          font-size: 10px;
          font-weight: 600;
          line-height: 1.2;
          opacity: 0;
          transition: 0.4s 0.2s;
        }
        .nfc-phone .sc-sub {
          font-size: 8px;
          color: var(--muted);
          font-family: var(--mono);
          opacity: 0;
          transition: 0.4s 0.3s;
        }
        .nfc-phone .sc-wait {
          font-size: 9px;
          color: var(--muted);
          font-family: var(--mono);
        }
        .nfc-stage.phone-in .nfc-phone {
          opacity: 1;
          pointer-events: auto;
          transform: translate3d(0, 0, 0) rotate(-8deg) scale(1);
        }
        .nfc-stage.is-read .nfc-phone .sc-icon {
          transform: scale(1);
          opacity: 1;
        }
        .nfc-stage.is-read .nfc-phone .sc-title,
        .nfc-stage.is-read .nfc-phone .sc-sub {
          opacity: 1;
        }
        .nfc-stage.is-read .nfc-phone .sc-wait {
          display: none;
        }
        .nfc-swatch {
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          padding: 10px 4px 8px;
          border-radius: 14px;
          border: 1px solid transparent;
          transition: 0.15s;
        }
        .nfc-swatch:hover {
          background: #fff;
        }
        .nfc-swatch.is-selected {
          background: #fff;
          border-color: var(--ink);
        }
        .nfc-swatch.is-selected span {
          color: var(--ink);
          font-weight: 600;
        }
        .nfc-chipc {
          width: 40px;
          height: 26px;
          border-radius: 5px;
          background-size: cover;
          box-shadow: 0 0 0 1px var(--edge) inset, 0 4px 10px -4px rgba(0,0,0,.35);
        }
        @media (max-width: 640px) {
          .nfc-mockup-panel {
            padding: 14px 12px;
            border-radius: 20px;
          }
          .nfc-stage {
            padding: 22px 10px 26px;
            border-radius: 14px;
            contain: paint;
          }
          .nfc-phone {
            width: 90px;
            border-radius: 16px;
            right: 2%;
            top: -4%;
            transform: translate3d(50px, -80px, 0) rotate(16deg) scale(0.8);
          }
          .nfc-stage.phone-in .nfc-phone {
            transform: translate3d(0, 0, 0) rotate(-6deg) scale(1);
          }
          .nfc-chipc {
            width: 32px;
            height: 20px;
          }
          .nfc-swatch {
            padding: 6px 2px 5px;
            gap: 4px;
          }
        }
      `}</style>

      <main className="nfc-mockup-panel select-none overflow-hidden max-w-full">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-xl font-bold tracking-tight text-[#17171a] font-sans">
            Smart Tap Card
          </h1>
        </header>

        {/* 3D Stage with Card & Phone */}
        <div 
          className={`nfc-stage ${isPhoneIn ? 'phone-in' : ''} ${isRead ? 'is-read' : ''}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div 
            ref={cardRef}
            className={`nfc-tilt ${isFlipped ? 'is-flipped' : ''} ${isTapping ? 'is-tapping' : ''}`}
            onClick={toggleFlip}
            role="button"
            tabIndex={0}
            style={{
              "--surface": selectedFinish.surface,
              "--fg": selectedFinish.fg,
              "--fg-muted": selectedFinish.muted,
              "--edge": selectedFinish.edge,
              "--star": selectedFinish.star,
              "--ring": selectedFinish.ring,
              "--qr-bg": selectedFinish.qrBg,
              "--qr-fg": selectedFinish.qrFg,
              "--glare-o": selectedFinish.glare
            }}
          >
            <div className="nfc-shadow" />

            <div className="nfc-flip">
              {/* Front of Card */}
              <div 
                className="nfc-face front p-4 sm:p-6 flex flex-col justify-between"
                style={{
                  background: selectedFinish.surface,
                  backgroundSize: 'cover',
                  color: selectedFinish.fg
                }}
              >
                {/* Top row: Minimalist Contactless Wave Icon & TAP CARD */}
                <div className="flex justify-between items-center">
                  <div 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors"
                    style={{
                      borderColor: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? 'rgba(0,0,0,0.2)' : 'rgba(251,191,36,0.5)',
                      backgroundColor: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? 'rgba(0,0,0,0.06)' : 'rgba(251,191,36,0.15)',
                      color: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? selectedFinish.fg : '#fde047'
                    }}
                  >
                    <svg className="w-4 h-4 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                      <line x1="12" y1="20" x2="12.01" y2="20"/>
                    </svg>
                  </div>
                  
                  <span 
                    className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase font-bold opacity-75"
                    style={{ color: selectedFinish.muted }}
                  >
                    TAP CARD
                  </span>
                </div>

                {/* Middle: Business Name & Plan */}
                <div className="my-auto py-1.5 sm:py-2">
                  <div className="text-[19px] xs:text-[23px] sm:text-[26px] font-extrabold font-heading tracking-tight leading-tight truncate">
                    {businessName || "Apex Fitness Studio"}
                  </div>

                  <div 
                    className="mt-1 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5"
                    style={{ color: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? '#0284c7' : '#38bdf8' }}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                    <span className="truncate">{currentAction.label}</span>
                  </div>
                </div>

                {/* Bottom Row: Phone Number & Click to Flip */}
                <div 
                  className="flex justify-between items-center pt-2 sm:pt-3 border-t font-mono text-[10px] sm:text-[11px] transition-colors"
                  style={{ borderColor: selectedFinish.edge }}
                >
                  <div className="flex items-center gap-1.5">
                    <svg 
                      className="w-3.5 h-3.5 shrink-0" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ color: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? '#0284c7' : '#38bdf8' }}
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span className="font-bold tracking-wider" style={{ color: selectedFinish.fg }}>
                      {phone || "+91 98765 43210"}
                    </span>
                  </div>

                  <div 
                    className="flex items-center gap-1 cursor-pointer transition-colors"
                    style={{ color: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? '#0284c7' : '#38bdf8' }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                      <path d="M3 3v5h5"/>
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                      <path d="M16 21h5v-5"/>
                    </svg>
                    <span>Click to Flip</span>
                  </div>
                </div>

                <div className="nfc-rings">
                  <i /><i /><i />
                </div>
                <div className="nfc-glare" />
              </div>

              {/* Back of Card */}
              <div 
                className="nfc-face back p-4 sm:p-6 flex flex-col justify-between"
                style={{
                  background: selectedFinish.surface,
                  backgroundSize: 'cover',
                  color: selectedFinish.fg
                }}
              >
                <div className="flex items-center justify-end">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center border shadow-xs"
                    style={{
                      borderColor: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? 'rgba(0,0,0,0.2)' : 'rgba(251,191,36,0.5)',
                      backgroundColor: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? 'rgba(0,0,0,0.06)' : 'rgba(251,191,36,0.15)',
                      color: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? selectedFinish.fg : '#fde047'
                    }}
                  >
                    <svg className="w-3.5 h-3.5 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                      <line x1="12" y1="20" x2="12.01" y2="20"/>
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-4 my-auto">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-md border border-black/10 ring-2 ring-black/5 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: selectedFinish.qrBg,
                      color: selectedFinish.qrFg
                    }}
                  >
                    {renderQRCode(businessName + currentAction.title, selectedFinish.qrBg)}
                  </div>

                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: selectedFinish.fg }}>
                      Instant Phone Tap
                    </p>
                    <p 
                      className="text-[10px] sm:text-[11px] mt-0.5 font-mono font-bold truncate"
                      style={{ color: selectedFinish.id === 'silver' || selectedFinish.id === 'acrylic' ? '#0284c7' : '#38bdf8' }}
                    >
                      {phone || "+91 98765 43210"}
                    </p>
                    <p 
                      className="text-[9px] sm:text-[10px] mt-1 max-w-[160px] leading-relaxed font-medium"
                      style={{ color: selectedFinish.muted }}
                    >
                      Hold near any phone within 3cm to trigger instantly.
                    </p>
                  </div>
                </div>

                <div 
                  className="flex items-center justify-center text-[9px] sm:text-[10px] font-semibold pt-2 border-t"
                  style={{ borderColor: selectedFinish.edge, color: selectedFinish.fg }}
                >
                  <span>Tap Card Studio</span>
                </div>

                <div className="nfc-glare" />
              </div>
            </div>
          </div>

          {/* 3D Phone Preview */}
          <div className="nfc-phone">
            <div className="notch" />
            <div className="screen">
              <span className="sc-wait">Hold near card…</span>
              <span className="sc-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </span>
              <span className="sc-title text-[#17171a]">{currentAction.title}</span>
              <span className="sc-sub">{businessName}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col xs:flex-row gap-2 mt-3.5">
          <button 
            type="button"
            onClick={toggleFlip}
            className="w-full xs:w-auto text-xs sm:text-sm font-medium rounded-xl py-2.5 px-3.5 border border-[#e4e2db] bg-white text-[#17171a] hover:border-[#cfccc2] active:scale-[0.98] inline-flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
            <span>{isFlipped ? "Show front" : "Show back"}</span>
          </button>

          <button 
            type="button"
            onClick={handleSimulateTap}
            disabled={isSimulating}
            className="w-full xs:flex-1 text-xs sm:text-sm font-medium rounded-xl py-2.5 px-3.5 bg-[#17171a] hover:bg-[#2a2a2f] text-white border border-[#17171a] active:scale-[0.98] inline-flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="2" width="12" height="20" rx="3"/>
              <path d="M11 18h2"/>
            </svg>
            <span>Simulate phone tap</span>
          </button>
        </div>

        {/* Status text */}
        {statusText && (
          <p className={`mt-2.5 font-mono text-[11px] min-h-[16px] flex items-center gap-1.5 transition-colors ${isStatusOk ? 'text-[#178a55] font-semibold' : 'text-[#6d6c67]'}`}>
            {statusText}
          </p>
        )}

        {/* Physical Finish Section */}
        <section className="mt-5 pt-4 border-t border-[#e4e2db]">
          <p className="font-mono text-[11px] tracking-wider uppercase text-[#6d6c67] flex justify-between mb-3">
            <span>Physical finish</span>
            <b className="font-sans font-medium text-[#17171a] tracking-normal capitalize text-xs">
              {selectedFinish.name}
            </b>
          </p>

          <div className="grid grid-cols-5 gap-2">
            {finishes.map((f) => {
              const isSelected = selectedFinish.id === f.id;
              return (
                <label 
                  key={f.id}
                  onClick={() => setSelectedFinish(f)}
                  className={`nfc-swatch ${isSelected ? 'is-selected' : ''}`}
                  title={f.name}
                >
                  <i 
                    className="nfc-chipc"
                    style={{
                      background: f.surface,
                      "--edge": f.edge
                    }}
                  />
                  <span className="text-[11px] text-[#6d6c67] text-center leading-tight">
                    {f.shortName}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-white border border-[#e4e2db] rounded-xl p-2.5">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#6d6c67] block">
                Material
              </span>
              <span className="text-xs font-semibold text-[#17171a] block mt-0.5">
                {selectedFinish.mat}
              </span>
            </div>
            <div className="bg-white border border-[#e4e2db] rounded-xl p-2.5">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#6d6c67] block">
                Thickness
              </span>
              <span className="text-xs font-semibold text-[#17171a] block mt-0.5">
                {selectedFinish.thk}
              </span>
            </div>
          </div>
        </section>

        {/* Personalize Section */}
        <section className="mt-5 pt-4 border-t border-[#e4e2db]">
          <p className="font-mono text-[11px] tracking-wider uppercase text-[#6d6c67] mb-3">
            <span>Personalize</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs text-[#6d6c67] mb-1.5 font-medium">
                Business name
              </label>
              <input
                type="text"
                maxLength={28}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs font-sans p-2.5 rounded-xl border border-[#e4e2db] bg-white text-[#17171a] focus:outline-2 focus:outline-[#2c5cff] focus:-outline-offset-1 focus:border-transparent transition-all shadow-sm"
                placeholder="Apex Fitness Studio"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6d6c67] mb-1.5 font-medium">
                Phone on card
              </label>
              <input
                type="text"
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-sans p-2.5 rounded-xl border border-[#e4e2db] bg-white text-[#17171a] focus:outline-2 focus:outline-[#2c5cff] focus:-outline-offset-1 focus:border-transparent transition-all shadow-sm"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6d6c67] mb-1.5 font-medium">
                Card plan
              </label>
              <select
                value={actionKey}
                onChange={(e) => setActionKey(e.target.value)}
                className="w-full text-xs font-sans p-2.5 rounded-xl border border-[#e4e2db] bg-white text-[#17171a] focus:outline-2 focus:outline-[#2c5cff] focus:-outline-offset-1 focus:border-transparent transition-all shadow-sm cursor-pointer"
              >
                <option value="review">Google Review Plan</option>
                <option value="portfolio">Portfolio Showcase Plan</option>
                <option value="website">Website + QR Plan</option>
                <option value="inquiry">Inquiry Form Plan</option>
              </select>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
