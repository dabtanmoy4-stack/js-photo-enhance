/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion, useAnimation } from "motion/react";

import {
  Cpu,
  ShieldCheck,
  Sparkles,
  Zap,
  Bot,
  BrainCircuit,
} from "lucide-react";

import Robot from "./Robot";
import { JSLogo } from "./JSLogo";

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
}) => {
  const logoControls = useAnimation();
  const titleControls = useAnimation();
  const progressControls = useAnimation();
  const robotControls = useAnimation();

  useEffect(() => {
        const startAnimation = async () => {
      await robotControls.start({
        opacity: [0, 1],
        scale: [0.65, 1.08, 1],
        rotate: [-8, 3, 0],
        transition: {
          duration: 1.3,
          ease: "easeOut",
        },
      });

      await logoControls.start({
        opacity: [0, 1],
        scale: [0.85, 1.08, 1],
        transition: {
          duration: 0.8,
          ease: "easeOut",
        },
      });

      await titleControls.start({
        opacity: [0, 1],
        y: [35, 0],
        transition: {
          duration: 0.7,
          ease: "easeOut",
        },
      });

      progressControls.start({
        width: "100%",
        transition: {
          duration: 2.5,
          ease: "easeInOut",
        },
      });

      setTimeout(() => {
        onFinish?.();
      }, 2800);
    };

    startAnimation();
  }, [
    logoControls,
    robotControls,
    titleControls,
    progressControls,
    onFinish,
  ]);

  return (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        transition: { duration: 0.45 },
      }}
      className="fixed inset-0 overflow-hidden bg-[#040308] text-white flex flex-col items-center justify-between px-8 py-6"
    >
      {/* ================= BACKGROUND ================= */}

      {/* Main Aurora */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 8, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 14,
          ease: "linear",
        }}
        className="absolute -top-56 left-1/2 h-[850px] w-[850px] -translate-x-1/2 rounded-full blur-3xl opacity-30
        bg-[radial-gradient(circle,#8b5cf6_0%,#6d28d9_30%,#312e81_60%,transparent_78%)]"
      />

      {/* Bottom Glow */}
      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="absolute bottom-[-300px] left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full blur-3xl
        bg-[radial-gradient(circle,#9333ea_0%,#4c1d95_50%,transparent_80%)]"
      />

      {/* Floating Purple Light */}
      <motion.div
        animate={{
          x: [-80, 80, -80],
          y: [0, -40, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-[120px] bg-violet-500/20"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.35)_100%)]" />

      {/* ================= FLOATING PARTICLES ================= */}

      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-10, -260],
            opacity: [0, 1, 0],
            scale: [0.4, 1.2, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 5 + Math.random() * 3,
            delay: Math.random() * 4,
          }}
          className="absolute rounded-full bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,.9)]"
          style={{
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
            left: `${Math.random() * 100}%`,
            bottom: "-20px",
          }}
        />
      ))}
            {/* ================= TOP STATUS ================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: -30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.7,
        }}
        className="relative z-20 w-full flex justify-center pt-2"
      >
        <div className="group flex items-center gap-3 rounded-full border border-violet-500/25 bg-white/5 px-5 py-2.5 backdrop-blur-2xl shadow-[0_0_35px_rgba(139,92,246,.25)]">

          {/* AI Chip */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "linear",
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
          >
            <BrainCircuit className="h-5 w-5 text-white" />
          </motion.div>

          {/* Text */}
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase tracking-[0.35em] text-violet-300">
              Artificial Intelligence
            </span>

            <span className="mt-1 text-sm font-semibold text-white">
              JS AI HUB ENGINE
            </span>
          </div>

          {/* Divider */}
          <div className="mx-1 h-8 w-px bg-white/10" />

          {/* CPU */}
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-violet-400" />

            <span className="text-xs text-zinc-300">
              Neural Core
            </span>
          </div>

          {/* Live Dot */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
            }}
            className="ml-1 h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,.9)]"
          />
        </div>
      </motion.div>

      {/* ================= CENTER AREA ================= */}

      <div className="relative z-20 flex flex-1 items-center justify-center w-full">

  {/* ROBOT SECTION */}

  <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 22,
              ease: "linear",
            }}
            className="absolute h-[430px] w-[430px] rounded-full border border-violet-500/15"
          />

          {/* Middle Ring */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "linear",
            }}
            className="absolute h-[360px] w-[360px] rounded-full border border-fuchsia-400/20"
          />

          {/* Pulse Ring */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.25, 0.65, 0.25],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
            }}
            className="absolute h-[310px] w-[310px] rounded-full bg-violet-500/20 blur-3xl"
          />

          {/* Glow */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="absolute h-[250px] w-[250px] rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-400/20 blur-[70px]"
          />

          {/* Robot Animation */}
          <motion.div
            animate={robotControls}
            className="relative z-20"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.2,
                ease: "easeInOut",
              }}
              className="rounded-[40px] border border-violet-500/30 bg-white/5 p-6 backdrop-blur-3xl shadow-[0_0_80px_rgba(139,92,246,.35)]"
            >
              {/* Premium Robot */}
              <div className="relative">

                {/* Back Light */}
                <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl" />

                {/* Robot */}
                <div className="relative z-10 flex justify-center">
                  <Robot />
                </div>

              </div>
            </motion.div>
          </motion.div>

          {/* Orbit Dot 1 */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "linear",
            }}
            className="absolute h-[360px] w-[360px]"
          >
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.9)]" />
          </motion.div>

          {/* Orbit Dot 2 */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              repeat: Infinity,
              duration: 11,
              ease: "linear",
            }}
            className="absolute h-[430px] w-[430px]"
          >
            <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,.9)]" />
                   </motion.div>

        </div>   {/* Robot Section close */}

      </div>     {/* Center Area close */}

      {/* ================= TITLE SECTION ================= */}

      <motion.div
        animate={titleControls}
        initial={{
          opacity: 0,
          y: 35,
        }}
        className="relative z-20 -mt-2 text-center"
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

          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            AI HUB
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
            delay: 0.3,
          }}
          className="mt-3 text-lg font-semibold uppercase tracking-[0.35em] text-violet-300"
        >
          NEXT GENERATION AI
        </motion.h2>

        <motion.p
          animate={{
            opacity: [0.45, 1, 0.45],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
          }}
          className="mx-auto mt-5 max-w-lg px-6 text-sm leading-7 text-zinc-400"
        >
          Experience lightning-fast AI image enhancement,
          intelligent restoration, photo upscaling,
          creative generation and smart editing
          powered by advanced neural technology.
        </motion.p>

        {/* Floating Info Cards */}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="rounded-2xl border border-violet-500/20 bg-white/5 px-5 py-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              <span className="text-sm font-medium text-white">
                AI Enhancement
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="rounded-2xl border border-cyan-500/20 bg-white/5 px-5 py-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium text-white">
                Smart Assistant
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="rounded-2xl border border-fuchsia-500/20 bg-white/5 px-5 py-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-fuchsia-400" />
              <span className="text-sm font-medium text-white">
                Secure AI
              </span>
            </div>
          </motion.div>

        </div>

      </motion.div>
            {/* ================= LOADING STATUS ================= */}

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
          delay: 0.6,
          duration: 0.7,
        }}
        className="relative z-20 mt-10 flex flex-col items-center"
      >
        {/* Loading Row */}

        <div className="flex items-center gap-4">

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
            <Sparkles className="h-6 w-6 text-violet-400" />
          </motion.div>

          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="text-base font-medium tracking-wide text-zinc-200"
          >
            Initializing AI Neural Engine...
          </motion.span>

          <motion.div
            animate={{
              scale: [1, 1.35, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
            }}
          >
            <Zap className="h-5 w-5 text-yellow-400" />
          </motion.div>

        </div>

        {/* Status Cards */}

        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="rounded-xl border border-violet-500/20 bg-white/5 px-5 py-3 backdrop-blur-xl"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                AI CORE
              </p>

              <p className="mt-1 font-semibold text-violet-300">
                Online
              </p>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 0.2,
            }}
            className="rounded-xl border border-cyan-500/20 bg-white/5 px-5 py-3 backdrop-blur-xl"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                GPU
              </p>

              <p className="mt-1 font-semibold text-cyan-300">
                Accelerated
              </p>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 0.4,
            }}
            className="rounded-xl border border-fuchsia-500/20 bg-white/5 px-5 py-3 backdrop-blur-xl"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                SECURITY
              </p>

              <p className="mt-1 font-semibold text-fuchsia-300">
                Protected
              </p>
            </div>
          </motion.div>

        </div>

      </motion.div>
            {/* ================= PROGRESS ================= */}

      <div className="relative z-20 mt-10 w-full max-w-md px-4">

        {/* Top Row */}

        <div className="mb-3 flex items-center justify-between">

          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            System Loading
          </span>

          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
            }}
            className="text-sm font-semibold text-violet-300"
          >
            100%
          </motion.span>

        </div>

        {/* Progress Bar */}

        <div className="relative h-3 overflow-hidden rounded-full border border-violet-500/20 bg-white/10 backdrop-blur-xl">

          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-md" />

          {/* Animated Fill */}
          <motion.div
            initial={{
              width: "0%",
            }}
            animate={progressControls}
            className="relative h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400"
          >

            <motion.div
              animate={{
                x: ["-100%", "300%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
              className="absolute top-0 h-full w-20 bg-white/40 blur-md"
            />

          </motion.div>

        </div>

        {/* Processing Dots */}

        <div className="mt-6 flex items-center justify-center gap-3">

          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.15,
              }}
              className="h-2.5 w-2.5 rounded-full bg-violet-400"
            />
          ))}

        </div>

        {/* Status */}

        <motion.p
          animate={{
            opacity: [0.45, 1, 0.45],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mt-5 text-center text-sm text-zinc-400"
        >
          Optimizing AI Models • Preparing Workspace • Almost Ready...
        </motion.p>

      </div>
            {/* ================= FOOTER ================= */}

      <motion.footer
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
          duration: 0.7,
        }}
        className="relative z-20 mt-10 flex flex-col items-center gap-4 pb-4"
      >

        {/* AI Ready Badge */}

        <div className="flex flex-wrap items-center justify-center gap-3">

          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-green-400" />

            <span className="text-xs font-medium uppercase tracking-wider text-green-300">
              AI READY
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 backdrop-blur-xl">
            <Cpu className="h-4 w-4 text-violet-400" />

            <span className="text-xs font-medium uppercase tracking-wider text-violet-300">
              Neural Engine
            </span>
          </div>

        </div>

        {/* Divider */}

        <div className="h-px w-72 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        {/* Footer Text */}

        <div className="space-y-2 text-center">

          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
            }}
            className="text-sm font-semibold tracking-[0.3em] uppercase text-violet-300"
          >
            MADE WITH ❤️ IN INDIA
          </motion.p>

          <p className="text-xs text-zinc-500">
            Powered by Advanced Artificial Intelligence
          </p>

          <p className="text-[11px] font-mono tracking-wider text-zinc-600">
            JS AI HUB • AI STUDIO • VERSION 3.0.0
          </p>

        </div>

      </motion.footer>
          </motion.div>
  );
};
