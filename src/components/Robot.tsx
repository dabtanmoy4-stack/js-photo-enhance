import React from "react";
import { motion } from "motion/react";
import robot from "./robot.png";

const Robot: React.FC = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{
        y: [0, -10, 0],
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Purple Aura */}
      <motion.div
        className="absolute h-[340px] w-[340px] rounded-full bg-violet-500/20 blur-[90px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* Rotating Ring */}
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full border border-violet-400/20"
        animate={{ rotate: 360 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Robot */}
      <motion.img
        src={robot}
        alt="JS AI Robot"
        draggable={false}
        className="relative z-20 w-[290px] select-none drop-shadow-[0_0_50px_rgba(139,92,246,.55)]"
        animate={{
          filter: [
            "brightness(1)",
            "brightness(1.08)",
            "brightness(1)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
            {/* Left Eye Glow */}
      <motion.div
        className="absolute z-30 h-3 w-3 rounded-full bg-cyan-300 blur-[1px]"
        style={{
          top: "98px",
          left: "126px",
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.8, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
      />

      {/* Right Eye Glow */}
      <motion.div
        className="absolute z-30 h-3 w-3 rounded-full bg-cyan-300 blur-[1px]"
        style={{
          top: "98px",
          right: "126px",
        }}
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1.8, 1, 1.8],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
      />

      {/* Chest Energy */}
      <motion.div
        className="absolute z-10 h-14 w-14 rounded-full bg-fuchsia-500/35 blur-xl"
        style={{
          top: "195px",
        }}
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.25, 0.8, 0.25],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-violet-400"
          style={{
            left: `${18 + i * 9}%`,
            top: `${18 + (i % 4) * 16}%`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + i * 0.2,
            delay: i * 0.15,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Bottom Glow */}
      <motion.div
        className="absolute bottom-2 h-16 w-52 rounded-full bg-violet-500/20 blur-2xl"
        animate={{
          opacity: [0.2, 0.55, 0.2],
          scaleX: [1, 1.1, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
      />
            {/* Sparkles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute z-40 text-violet-300"
          style={{
            left: `${22 + i * 18}%`,
            top: `${12 + (i % 2) * 24}%`,
            fontSize: `${12 + i * 2}px`,
          }}
          animate={{
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Breathing Light */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "0 0 35px rgba(139,92,246,.20)",
            "0 0 70px rgba(139,92,246,.45)",
            "0 0 35px rgba(139,92,246,.20)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
};

export default Robot;
