import React from 'react';

interface JSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export const JSLogo: React.FC<JSLogoProps> = ({ size = 'md', showText = true, animated = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-28 h-28 text-2xl',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-black via-zinc-900 to-black p-0.5 shadow-lg shadow-emerald-950/30 border border-emerald-500/30 ${animated ? 'animate-pulse' : ''}`}>
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-emerald-500/20 blur-md opacity-70" />

        <div className={`relative ${sizeClasses} rounded-xl bg-black flex items-center justify-center overflow-hidden border border-emerald-500/40`}>
          {/* Subtle Grid overlay for Android Compose aesthetic */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#00C853 1px, transparent 1px)`,
              backgroundSize: '8px 8px'
            }}
          />

          {/* Aperture / Lens SVG Rings */}
          <svg
            className={`absolute inset-0 w-full h-full text-emerald-500/30 ${animated ? 'animate-spin-slow' : ''}`}
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="32" stroke="#00C853" strokeWidth="1" opacity="0.6" />
            <polygon points="50,15 85,50 50,85 15,50" stroke="#00C853" strokeWidth="0.8" opacity="0.3" />
          </svg>

          {/* Core JS Badge Text */}
          <div className="relative z-10 flex items-center justify-center font-extrabold tracking-tighter">
            <span className="text-white font-mono drop-shadow-[0_0_8px_rgba(0,200,83,0.8)]">J</span>
            <span className="text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(0,200,83,0.9)]">S</span>
          </div>

          {/* Tiny camera sparkle dot */}
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00C853]" />
        </div>
      </div>

{showText && (
  <div className="flex flex-col">
    <div className="flex items-center gap-1.5 font-black tracking-tight text-white leading-none">
      <span className="text-lg font-bold">JS</span>
      <span className="text-violet-400 text-lg font-semibold tracking-wide">AI</span>
    </div>

    <span className="text-[10px] uppercase font-mono tracking-widest text-violet-400/80 mt-0.5 font-bold">
      ASSISTANT
    </span>
  </div>
)}

    </div>
  );
};