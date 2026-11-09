import React, { useState } from 'react';
import { Wifi, Sparkles, CheckCircle2, QrCode, RotateCw, Phone, Image as ImageIcon } from 'lucide-react';
import { getAutoFontTheme, getCardBackgroundStyle } from '../utils/cardColorUtils';

export const CardVisualizer = ({ 
  cardColor = "#cbd5e1",
  material = "Anodized Silver", 
  businessName = "Apex Fitness Studio", 
  purpose = "Google 5-Star Review Tap Card Plan",
  phone = "+91 98765 43210",
  logoUrl = null,
  showQr = true,
  onTap = null,
  frontImage = null,
  backImage = null,
  isClonedCard = false
}) => {
  const [flipped, setFlipped] = useState(false);

  // Automatic high-contrast font theme based on chosen card color
  const fontTheme = getAutoFontTheme(cardColor);
  const bgStyle = getCardBackgroundStyle(cardColor);

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Flip Card Container */}
      <div 
        className="w-full max-w-[390px] h-[215px] xs:h-[230px] sm:h-[245px] perspective cursor-pointer select-none group"
        onClick={() => setFlipped(!flipped)}
        title="Click to flip card"
      >
        <div 
          className={`relative w-full h-full rounded-2xl p-4 sm:p-6 transition-all duration-700 transform-style-3d border ${fontTheme.cardBorder} ${
            flipped ? 'rotate-y-180' : ''
          }`}
          style={!frontImage || flipped ? bgStyle : {}}
        >
          {/* Subtle specular sheen overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-80 z-10" />

          {/* FRONT OF CARD */}
          <div className={`absolute inset-0 p-4 sm:p-6 flex flex-col justify-between backface-hidden ${flipped ? 'hidden' : 'flex'}`}>
            {frontImage ? (
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-900">
                <img 
                  src={frontImage} 
                  alt="Existing Card Front Design" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
                {/* Subtle Contactless Chip Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-md pointer-events-none z-20">
                  <Wifi className="w-3.5 h-3.5 rotate-90 text-sky-400" />
                  <span className="text-[9px] font-mono font-bold tracking-wider">TAP CHIP</span>
                </div>
                {/* 1:1 Cloned Stamp */}
                <div className="absolute bottom-2.5 left-3 text-[9px] font-mono font-bold text-white bg-sky-900/80 border border-sky-400/40 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 pointer-events-none z-20">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  <span>1:1 Design Cloned</span>
                </div>
                {/* Flip Hint */}
                <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 pointer-events-none z-20">
                  <RotateCw className="w-2.5 h-2.5" />
                  <span>Click to Flip</span>
                </div>
              </div>
            ) : (
              <>
                {/* Top row: Minimalist Contactless Wave Icon & Optional Logo */}
                <div className="flex items-center justify-between">
                  <div 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors"
                    style={{
                      borderColor: fontTheme.chipBorder,
                      backgroundColor: fontTheme.chipBg,
                      color: fontTheme.chipText
                    }}
                  >
                    <Wifi className="w-4 h-4 rotate-90" />
                  </div>
                  
                  {/* Optional Company Logo or Minimal Brand Label */}
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-7 sm:h-8 max-w-[100px] sm:max-w-[110px] object-contain rounded drop-shadow-sm" />
                  ) : (
                    <span 
                      className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold opacity-70"
                      style={{ color: fontTheme.subtext }}
                    >
                      TAP CARD
                    </span>
                  )}
                </div>

                {/* Middle: Business / Cardholder Name & Purpose Plan */}
                <div className="my-auto py-1 sm:py-2">
                  <h3 
                    className="text-lg xs:text-xl sm:text-2xl font-extrabold font-heading tracking-tight truncate drop-shadow-xs transition-colors"
                    style={{ color: fontTheme.text }}
                  >
                    {businessName || "Your Business Name"}
                  </h3>
                  <p 
                    className="text-[11px] sm:text-xs mt-1 sm:mt-1.5 font-semibold flex items-center gap-1.5 transition-colors"
                    style={{ color: fontTheme.accent }}
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{purpose}</span>
                  </p>
                </div>

                {/* Bottom Row: Phone Number & Click to Flip */}
                <div 
                  className="flex items-center justify-between pt-2 sm:pt-3 border-t transition-colors"
                  style={{ borderColor: fontTheme.border }}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: fontTheme.accent }} />
                    <span 
                      className="text-[11px] sm:text-xs font-mono font-bold tracking-wider"
                      style={{ color: fontTheme.text }}
                    >
                      {phone || "+91 98765 43210"}
                    </span>
                  </div>

                  <div 
                    className="text-right flex items-center gap-1 text-[10px] sm:text-[11px] font-mono transition-colors"
                    style={{ color: fontTheme.accent }}
                  >
                    <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Click to Flip</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* BACK OF CARD */}
          <div className={`absolute inset-0 p-4 sm:p-6 flex flex-col justify-between backface-hidden rotate-y-180 ${!flipped ? 'hidden' : 'flex'}`}>
            {backImage ? (
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-900">
                <img 
                  src={backImage} 
                  alt="Existing Card Back Design" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
                {/* Subtle QR Backup Indicator */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-md pointer-events-none z-20">
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[9px] font-mono font-bold tracking-wider">QR SMART</span>
                </div>
                {/* Flip Hint */}
                <div className="absolute top-3 left-3 text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 pointer-events-none z-20">
                  <RotateCw className="w-2.5 h-2.5" />
                  <span>Show Front</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-end">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center border shadow-xs"
                    style={{
                      borderColor: fontTheme.chipBorder,
                      backgroundColor: fontTheme.chipBg,
                      color: fontTheme.chipText
                    }}
                  >
                    <Wifi className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>

                {/* Center: Backup QR Code & Instructions */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 my-auto">
                  {showQr && (
                    <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white text-slate-900 shadow-md border border-slate-200 ring-2 ring-black/5 shrink-0">
                      <QrCode className="w-11 h-11 sm:w-14 sm:h-14" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold" style={{ color: fontTheme.text }}>
                      Instant Phone Tap
                    </p>
                    <p className="text-[10px] sm:text-[11px] mt-0.5 font-mono font-bold" style={{ color: fontTheme.accent }}>
                      {phone || "+91 98765 43210"}
                    </p>
                    <p 
                      className="text-[9px] sm:text-[10px] mt-1 max-w-[160px] leading-relaxed font-medium"
                      style={{ color: fontTheme.subtext }}
                    >
                      Hold near any phone within 3cm to trigger instantly.
                    </p>
                  </div>
                </div>

                {/* Bottom Back: Branding */}
                <div 
                  className="flex items-center justify-center text-[10px] font-semibold pt-2.5 border-t"
                  style={{ borderColor: fontTheme.border, color: fontTheme.text }}
                >
                  <span>Tap Card Studio</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Info & Quick Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <span className="text-xs text-slate-700 flex items-center gap-1.5 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
          <span>{isClonedCard ? "100% Existing Card Cloned" : material}</span>
        </span>
        
        {!isClonedCard && (
          <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 ${fontTheme.autoBadgeBg}`}>
            <span 
              className="w-2 h-2 rounded-full border border-current"
              style={{ backgroundColor: fontTheme.text }} 
            />
            <span>Font: {fontTheme.fontLabel} (Auto)</span>
          </span>
        )}

        <button 
          onClick={() => setFlipped(!flipped)}
          className="text-xs text-sky-700 hover:text-sky-900 font-semibold inline-flex items-center gap-1 hover:underline underline-offset-4 transition-colors ml-1"
        >
          <RotateCw className="w-3 h-3" />
          <span>{flipped ? 'Show Front Side' : 'Show Back Side'}</span>
        </button>
      </div>

      {/* Simulator Tap Button if provided */}
      {onTap && (
        <button
          onClick={onTap}
          className="mt-3.5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-semibold transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Wifi className="w-4 h-4 rotate-90 text-sky-600 animate-pulse" />
          <span>Simulate Phone Tap on This Card</span>
        </button>
      )}
    </div>
  );
};
