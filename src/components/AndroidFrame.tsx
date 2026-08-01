import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  displayMode: 'device' | 'fullscreen';
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, displayMode }) => {
  const [timeStr, setTimeStr] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (displayMode === 'fullscreen') {
    return <div className="w-full min-h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-2 sm:p-6 overflow-x-hidden">
      {/* Outer Phone Shell */}
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[92vh] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-zinc-800 ring-1 ring-emerald-500/30 flex flex-col overflow-hidden">
        
        {/* Glow halo around phone */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 via-transparent to-emerald-500/5 rounded-[60px] pointer-events-none blur-2xl" />

        {/* Android Hardware Camera Punchhole / Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-24 h-5 bg-black rounded-full border border-zinc-800/80 flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-900/60" />
          </div>
        </div>

        {/* Android Top Status Bar */}
        <div className="relative z-30 flex items-center justify-between px-6 pt-2 pb-1 text-zinc-300 text-xs font-mono select-none">
          <span className="font-semibold text-white">{timeStr}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[10px] font-extrabold text-emerald-400">5G</span>
            <Wifi className="w-3.5 h-3.5 text-zinc-300" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-zinc-400">98%</span>
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Canvas */}
        <div className="relative flex-1 bg-black text-white rounded-[36px] overflow-y-auto flex flex-col border border-zinc-900 custom-scrollbar">
          {children}
        </div>

        {/* Android Bottom Gesture Navigation Pill */}
        <div className="relative z-30 pt-2 pb-1 flex justify-center items-center">
          <div className="w-32 h-1 bg-zinc-600/80 hover:bg-emerald-400 rounded-full transition-colors" />
        </div>
      </div>
    </div>
  );
};
