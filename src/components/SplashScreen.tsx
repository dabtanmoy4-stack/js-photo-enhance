import React from 'react';
import { motion } from 'motion/react';
import { JSLogo } from './JSLogo';
import { Sparkles, Cpu, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white p-8 select-none overflow-hidden"
    >
      {/* Background Jetpack Compose Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,rgba(0,200,83,0.18),rgba(0,0,0,0.95))]" />
      
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#00C853 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header info badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 pt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono"
      >
        <Cpu className="w-3.5 h-3.5 animate-pulse" />
        <span>Material 3 Compose Engine</span>
      </motion.div>

      {/* Main Center Splash Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
        {/* Pulsing ring behind JS logo */}
        <div className="relative mb-8">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-6 rounded-full bg-emerald-500/20 blur-xl"
          />

          <motion.div
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <JSLogo size="xl" showText={false} animated={true} />
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white">
              JS <span className="text-emerald-400 font-extrabold">PHOTO</span>
            </h1>
          </div>
          <p className="text-emerald-400/90 text-sm font-mono tracking-widest uppercase font-semibold">
            Enhance & Clarity Studio
          </p>
        </motion.div>

        {/* Subtitle / Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex items-center gap-2 text-xs text-zinc-400"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Initializing MVVM Architecture & Image Engine...</span>
        </motion.div>

        {/* Material 3 Linear Progress Indicator */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 180, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 h-1 bg-zinc-800 rounded-full overflow-hidden w-48"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 rounded-full"
          />
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-1.5 text-center text-xs text-zinc-500"
      >
        <div className="flex items-center gap-1.5 text-emerald-500/80 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Jetpack Compose v1.7 • Material 3</span>
        </div>
        <p className="font-mono text-[11px] text-zinc-600">
          Package: com.js.photoenhance • Build 1.0.0
        </p>
      </motion.div>
    </motion.div>
  );
};
