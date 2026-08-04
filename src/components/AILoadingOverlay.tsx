import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Cpu, Layers, CheckCircle2 } from 'lucide-react';

interface AILoadingOverlayProps {
  progress: number; // 0 to 100
  stepMessage: string;
  modeLabel: string;
}

export const AILoadingOverlay: React.FC<AILoadingOverlayProps> = ({
  progress,
  stepMessage,
  modeLabel
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 select-none font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-violet-500/40 rounded-3xl p-6 text-center space-y-6 shadow-2xl shadow-violet-950/60 relative overflow-hidden"
      >
        {/* Top Glow Accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />

        {/* Animated AI Pulse Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-violet-500/20 border border-violet-500/50"
          />
          <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-400 text-violet-400 flex items-center justify-center shadow-lg shadow-violet-950/50 relative">
            <Cpu className="w-8 h-8 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-400 text-black flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>

        {/* Title & Mode */}
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-white">Executing AI Enhancement</h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30 text-xs font-mono font-bold">
            <Layers className="w-3.5 h-3.5" />
            {modeLabel}
          </span>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
              Processing Image Tensors
            </span>
            <span className="text-violet-400 font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
              className="h-full bg-linear-to-r from-violet-500 via-teal-400 to-violet-300 rounded-full shadow-[0_0_10px_#34d399]"
            />
          </div>
        </div>

        {/* Dynamic Status Step Log Message */}
        <div className="p-3 rounded-2xl bg-black/60 border border-zinc-800 text-xs font-mono text-violet-300 min-h-[44px] flex items-center justify-center">
          <p className="animate-pulse">{stepMessage || 'Initializing Real-ESRGAN / GFPGAN model...'}</p>
        </div>

        <p className="text-[10px] text-zinc-500 leading-relaxed">
          Running neural sub-pixel convolution & deep detail reconstruction.
        </p>
      </motion.div>
    </div>
  );
};
