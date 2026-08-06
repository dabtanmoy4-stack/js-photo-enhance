import React, { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { JSLogo } from './JSLogo';
import Robot from './Robot';
import { Sparkles, Cpu, ShieldCheck, Zap } from 'lucide-react';
interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
}) => {
  const logoControls = useAnimation();
  const titleControls = useAnimation();
  const progressControls = useAnimation();

  useEffect(() => {
    const startAnimation = async () => {
      await logoControls.start({
        scale: [0.6, 1.15, 1],
        rotate: [-12, 4, 0],
        opacity: [0, 1],
        transition: {
          duration: 1.2,
          ease: "easeOut",
        },
      });

      await titleControls.start({
        y: [35, 0],
        opacity: [0, 1],
        transition: {
          duration: 0.6,
        },
      });

      progressControls.start({
        width: "100%",
        transition: {
          duration: 2.2,
          ease: "easeInOut",
        },
      });

    

    startAnimation();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        transition: {
          duration: 0.45,
        },
      }}
      className="fixed inset-0 overflow-hidden bg-[#050507] text-white flex flex-col items-center justify-between p-8"
    >
      {/* Animated Aurora Background */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 8, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "linear",
        }}
        className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-3xl opacity-30
        bg-[radial-gradient(circle,#7c3aed_0%,#4f46e5_35%,transparent_75%)]"
      />

      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="absolute bottom-[-280px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full blur-3xl opacity-20
        bg-[radial-gradient(circle,#9333ea_0%,#312e81_55%,transparent_75%)]"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, -220],
            opacity: [0, 1, 0],
            scale: [0.5, 1.3, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + Math.random() * 3,
            delay: Math.random() * 4,
          }}
          className="absolute h-1.5 w-1.5 rounded-full bg-violet-400"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-20px",
          }}
        />
      ))}
      {/* ================= TOP STATUS BADGE ================= */}

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.25,
          duration: 0.6,
        }}
        className="relative z-20 pt-4"
      >
        <div className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-white/5 backdrop-blur-xl px-4 py-2 shadow-[0_0_25px_rgba(139,92,246,.25)]">
          <Cpu className="h-4 w-4 text-violet-400 animate-pulse" />

          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-violet-300">
            Material You Engine
          </span>

          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="h-2 w-2 rounded-full bg-green-400"
          />
        </div>
      </motion.div>

      {/* ================= CENTER CONTENT ================= */}

      <div className="relative z-20 flex flex-1 flex-col items-center justify-center">

        {/* Animated Rings */}

        <div className="relative">

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 16,
              ease: "linear",
            }}
            className="absolute -inset-12 rounded-full border border-violet-500/15"
          />

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "linear",
            }}
            className="absolute -inset-8 rounded-full border border-violet-400/20"
          />

          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
            }}
            className="absolute -inset-6 rounded-full bg-violet-500/20 blur-2xl"
          />
{/* AI Robot */}

<motion.div
  animate={logoControls}
  className="relative flex justify-center"
>
  <div className="rounded-full bg-black/40 p-5 backdrop-blur-2xl border border-violet-500/20 shadow-[0_0_60px_rgba(139,92,246,.35)]">

    <Robot />

  </div>

</motion.div>

        </div>
      </div>
      {/* ================= TITLE ================= */}

      <motion.div
        animate={titleControls}
        initial={{
          opacity: 0,
          y: 30,
        }}
        className="relative z-20 mt-10 text-center"
      >
        <motion.h1
          animate={{
            letterSpacing: [
              "0.02em",
              "0.08em",
              "0.02em",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="text-5xl font-black tracking-tight"
        >
          <span className="text-white">
  JS
</span>{" "}

<span className="bg-gradient-to-r from-violet-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
  AI Hub
</span>
        </motion.h1>

        <motion.h2
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
          }}
          className="mt-3 text-lg font-semibold tracking-[0.35em] uppercase text-violet-300"
        >
          AI IMAGE STUDIO
        </motion.h2>

        <motion.p
          animate={{
            opacity: [0.45, 1, 0.45],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
          }}
          className="mt-5 max-w-md text-sm leading-7 text-zinc-400"
        >
          Next Generation AI Image Enhancement
          powered by modern image processing,
          neural restoration and intelligent
          photo enhancement.
        </motion.p>

        {/* Loading Status */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          >
            <Sparkles className="h-5 w-5 text-violet-400" />
          </motion.div>

          <motion.span
            animate={{
              opacity: [0.35, 1, 0.35],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="text-sm font-medium text-zinc-300"
          >
            Initializing AI Engine...
          </motion.span>

          <motion.div
            animate={{
              scale: [1, 1.4, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
            }}
          >
            <Zap className="h-5 w-5 text-yellow-400" />
          </motion.div>
        </motion.div>
      </motion.div>
      {/* ================= PROGRESS ================= */}

      <div className="relative z-20 mt-10 w-full max-w-xs">

        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span>Loading Assets...</span>

          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
            }}
          >
            100%
          </motion.span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10 backdrop-blur-xl">

          <motion.div
            initial={{
              width: "0%",
            }}
            animate={progressControls}
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-300"
          />

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1,
        }}
        className="relative z-20 pb-4 flex flex-col items-center gap-2 text-center"
      >
        <div className="flex items-center gap-2 text-violet-300">

          <ShieldCheck className="h-4 w-4" />

          <span className="text-xs tracking-wider uppercase">
            AI Ready • Secure • Fast
          </span>

        </div>

        <p className="text-[11px] font-mono text-zinc-500">
          JS AI Hub AI STUDIO • Version 2.0.0
        </p>

      </motion.div>

    </motion.div>
  );
};
