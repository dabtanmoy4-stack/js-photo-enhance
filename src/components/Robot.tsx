import React from "react";
import { motion } from "motion/react";

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
        className="absolute h-[330px] w-[330px] rounded-full bg-violet-500/25 blur-[90px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* Outer Glow */}
      <motion.div
        className="absolute h-[280px] w-[280px] rounded-full border border-violet-400/20"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Robot Image */}
      <motion.img
        src="/robot.png"
        alt="JS AI Robot"
        draggable={false}
        className="relative z-20 w-[290px] select-none drop-shadow-[0_0_45px_rgba(139,92,246,.55)]"
        animate={{
          filter: [
            "brightness(1)",
            "brightness(1.12)",
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
          top: "95px",
          left: "128px",
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
          top: "95px",
          right: "128px",
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

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-violet-400"
          style={{
            left: `${20 + i * 8}%`,
            top: `${25 + (i % 3) * 18}%`,
          }}
          animate={{
            y: [0, -20, 0],
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
    </motion.div>
  );
};

export default Robot;
