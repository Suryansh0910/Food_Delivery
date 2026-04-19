import { motion } from 'framer-motion';

// ─── TICKER STRIP ──────────────────────────────────────────────────────────────
// A scrolling strip of random text that can go left or right, at any angle
interface TickerProps {
  items: string[];
  direction?: 'left' | 'right';
  bg?: string;
  textColor?: string;
  speed?: number;
  rotate?: number; // degrees
  borderTop?: boolean;
  borderBottom?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TickerStrip = ({
  items,
  direction = 'left',
  bg = 'bg-black',
  textColor = 'text-white',
  speed = 20,
  rotate = 0,
  borderTop = true,
  borderBottom = true,
  size = 'md',
}: TickerProps) => {
  const sizeClasses = {
    sm: 'text-[10px] py-1.5',
    md: 'text-xs py-2',
    lg: 'text-sm py-3',
  };

  const doubled = [...items, ...items]; // duplicate so scroll is seamless

  return (
    <div
      className={`w-full overflow-hidden ${bg} ${borderTop ? 'border-t-4 border-black' : ''} ${borderBottom ? 'border-b-4 border-black' : ''}`}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, zIndex: 10, position: rotate ? 'relative' : undefined }}
    >
      <motion.div
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className={`flex gap-8 whitespace-nowrap font-black uppercase tracking-widest ${sizeClasses[size]} ${textColor} px-6`}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 shrink-0">
            {item}
            <span className="opacity-40">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ─── BRUTALIST FRAME ──────────────────────────────────────────────────────────
// A thick, decorative neo-brutalist border frame with corner accents
interface FrameProps {
  children: React.ReactNode;
  accentColor?: string;
  shadowColor?: string;
  label?: string;
  labelBg?: string;
  className?: string;
}

export const BrutalistFrame = ({
  children,
  accentColor = '#FFD700',
  shadowColor = '#000',
  label,
  labelBg = 'bg-[#FFD700]',
  className = '',
}: FrameProps) => {
  return (
    <div
      className={`relative border-4 border-black bg-white ${className}`}
      style={{ boxShadow: `8px 8px 0px ${shadowColor}` }}
    >
      {/* Corner accents */}
      <div className="absolute -top-2 -left-2 w-5 h-5 border-4 border-black" style={{ background: accentColor }} />
      <div className="absolute -top-2 -right-2 w-5 h-5 border-4 border-black" style={{ background: accentColor }} />
      <div className="absolute -bottom-2 -left-2 w-5 h-5 border-4 border-black" style={{ background: accentColor }} />
      <div className="absolute -bottom-2 -right-2 w-5 h-5 border-4 border-black" style={{ background: accentColor }} />

      {/* Optional floating label on top */}
      {label && (
        <div className={`absolute -top-5 left-6 ${labelBg} border-2 border-black px-3 py-0.5 font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_#000]`}>
          {label}
        </div>
      )}

      {children}
    </div>
  );
};

// ─── DIAGONAL STAMP ───────────────────────────────────────────────────────────
// A rotated badge/stamp to place absolutely over any element
interface StampProps {
  text: string;
  rotate?: number;
  bg?: string;
  textColor?: string;
}

export const DiagonalStamp = ({
  text,
  rotate = -12,
  bg = 'bg-[#00E59B]',
  textColor = 'text-black',
}: StampProps) => (
  <motion.div
    whileHover={{ scale: 1.1, rotate: rotate + 3 }}
    style={{ transform: `rotate(${rotate}deg)` }}
    className={`${bg} ${textColor} border-4 border-black px-4 py-2 font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_#000] cursor-default select-none`}
  >
    {text}
  </motion.div>
);

// ─── PRESET TICKER CONTENT ────────────────────────────────────────────────────
export const FOOD_TICKERS = {
  energy: ['⚡ Lightning Fast', '🔥 Always Fresh', '🛵 GPS Tracked', '💰 Best Prices', '🌶️ Spicy Good', '🍔 No Hidden Fees', '⭐ Top Chefs'],
  hype:   ['🚀 ORDER NOW', '🤤 EAT WELL', '💪 FEED THE BEAST', '🔥 ON FIRE', '😎 STAY HUNGRY', '🎯 CRAVING CRUSHED', '🏆 BEST IN CITY'],
  deals:  ['🎉 50% Off First Order', '🆓 Free Delivery on ₹299+', '⏰ 30-Min Guarantee', '💳 COD Available', '🌿 Veg Options', '🥩 Non-Veg Specials'],
  brand:  ['✦ FOODDASH', '✦ MUMBAI', '✦ PUNE', '✦ DELHI', '✦ ORDER FOOD', '✦ EAT HAPPY', '✦ DELIVER HOT'],
};
