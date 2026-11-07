// Card Color Palettes, Luminance Calculations & Auto Font Theme Engine

export const CARD_COLOR_PRESETS = [
  { id: 'black', name: 'Matte Jet Black', hex: '#121316', finish: 'Polymer' },
  { id: 'white', name: 'Pearl Arctic White', hex: '#f8fafc', finish: 'Polymer' },
  { id: 'navy', name: 'Midnight Navy', hex: '#0f172a', finish: 'Polymer' },
  { id: 'blue', name: 'Royal Sapphire Blue', hex: '#1d4ed8', finish: 'Polymer' },
  { id: 'green', name: 'Emerald Forest Green', hex: '#064e3b', finish: 'Polymer' },
  { id: 'burgundy', name: 'Burgundy Wine Red', hex: '#831843', finish: 'Polymer' },
  { id: 'gold', name: 'Champagne Gold', hex: '#d4af37', finish: 'Electroplated Metal' },
  { id: 'silver', name: 'Anodized Silver', hex: '#cbd5e1', finish: 'Aircraft Aluminum' },
  { id: 'walnut', name: 'Nordic Walnut Wood', hex: '#3e2414', finish: 'Natural Wood' },
  { id: 'purple', name: 'Cyber Deep Purple', hex: '#581c87', finish: 'Polymer' }
];

// Calculate perceived luminance to automatically determine the optimal font and accent colors
export const getAutoFontTheme = (hexColor = '#121316') => {
  let hex = (hexColor || '#121316').replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) {
    hex = '121316';
  }

  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  // Standard perceived luminance calculation (WCAG standard)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const isLight = luminance > 145;

  if (isLight) {
    return {
      isLight: true,
      text: '#0f172a', // Deep Charcoal Slate
      subtext: '#475569', // Muted Slate
      accent: '#0284c7', // Sky Blue Accent
      border: 'rgba(15,23,42,0.15)',
      chipBorder: 'rgba(15,23,42,0.22)',
      chipBg: 'rgba(15,23,42,0.06)',
      chipText: '#0f172a',
      fontLabel: 'Charcoal Black',
      autoBadgeBg: 'bg-slate-900 text-white',
      cardBorder: 'border-slate-300/80 ring-1 ring-black/5'
    };
  } else {
    return {
      isLight: false,
      text: '#ffffff', // Crisp Pure White
      subtext: '#94a3b8', // Light Muted Slate
      accent: '#38bdf8', // Glowing Cyan/Sky
      border: 'rgba(255,255,255,0.15)',
      chipBorder: 'rgba(251,191,36,0.5)',
      chipBg: 'rgba(251,191,36,0.15)',
      chipText: '#fde047',
      fontLabel: 'Crisp White',
      autoBadgeBg: 'bg-white text-slate-900 border border-slate-200',
      cardBorder: 'border-white/15 ring-1 ring-white/10'
    };
  }
};

// Generate realistic depth gradient and drop shadow based on chosen hex color
export const getCardBackgroundStyle = (hexColor = '#121316') => {
  let hex = (hexColor || '#121316').replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) {
    hex = '121316';
  }

  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  const dr = Math.max(0, Math.floor(r * 0.72));
  const dg = Math.max(0, Math.floor(g * 0.72));
  const db = Math.max(0, Math.floor(b * 0.72));

  const lr = Math.min(255, Math.floor(r * 1.18) + 16);
  const lg = Math.min(255, Math.floor(g * 1.18) + 16);
  const lb = Math.min(255, Math.floor(b * 1.18) + 16);

  return {
    background: `linear-gradient(135deg, rgb(${lr},${lg},${lb}) 0%, rgb(${r},${g},${b}) 55%, rgb(${dr},${dg},${db}) 100%)`,
    boxShadow: `0 22px 50px -12px rgba(0,0,0,0.4), 0 0 25px rgba(${r},${g},${b},0.22)`
  };
};
