import React from "react";
import { motion } from "motion/react";

interface RobotProps {
  className?: string;
}

export const Robot: React.FC<RobotProps> = ({ className = "" }) => {
  return (
    <motion.div
      className={`relative w-72 h-72 ${className}`}
      initial={{ x: -450, opacity: 0, scale: 0.7 }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        x: { duration: 1.2, ease: "easeOut" },
        opacity: { duration: 0.6 },
        scale: { duration: 0.8 },
        y: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl bg-violet-500/25"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Head */}
      <motion.svg
        viewBox="0 0 300 300"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="robotBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </linearGradient>

          <linearGradient id="robotAccent" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <filter id="eyeGlow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Antenna */}
        <line
          x1="150"
          y1="35"
          x2="150"
          y2="15"
          stroke="#c084fc"
          strokeWidth="4"
        />

        <circle
          cx="150"
          cy="10"
          r="6"
          fill="#c084fc"
        />

        {/* Head */}
        <rect
          x="90"
          y="40"
          width="120"
          height="90"
          rx="28"
          fill="url(#robotBody)"
        />

        {/* Eyes Glow */}
        <circle
          cx="122"
          cy="82"
          r="12"
          fill="#8b5cf6"
          filter="url(#eyeGlow)"
        />

        <circle
          cx="178"
          cy="82"
          r="12"
          fill="#8b5cf6"
          filter="url(#eyeGlow)"
        />

        {/* Eyes */}
        <circle
          cx="122"
          cy="82"
          r="7"
          fill="#ffffff"
        />

        <circle
          cx="178"
          cy="82"
          r="7"
          fill="#ffffff"
        />

        {/* Smile */}
        <path
          d="M125 108 Q150 122 175 108"
          stroke="#8b5cf6"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect
          x="140"
          y="130"
          width="20"
          height="20"
          rx="5"
          fill="url(#robotAccent)"
        />

        {/* Body */}
        <rect
          x="95"
          y="150"
          width="110"
          height="90"
          rx="24"
          fill="url(#robotBody)"
        />
                {/* Chest Core */}
        <circle
          cx="150"
          cy="185"
          r="18"
          fill="url(#robotAccent)"
        />

        <circle
          cx="150"
          cy="185"
          r="8"
          fill="#ffffff"
        />

        {/* Left Arm */}
        <motion.g
          animate={{
            rotate: [-8, 15, -8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ originX: "95px", originY: "165px" }}
        >
          <rect
            x="58"
            y="160"
            width="38"
            height="16"
            rx="8"
            fill="url(#robotBody)"
          />

          <circle
            cx="54"
            cy="168"
            r="9"
            fill="url(#robotAccent)"
          />
        </motion.g>

        {/* Right Arm */}
        <motion.g
          animate={{
            rotate: [0, -28, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ originX: "205px", originY: "165px" }}
        >
          <rect
            x="205"
            y="160"
            width="38"
            height="16"
            rx="8"
            fill="url(#robotBody)"
          />

          <circle
            cx="248"
            cy="168"
            r="9"
            fill="#8b5cf6"
          />

          {/* Magic Orb */}
          <motion.circle
            cx="262"
            cy="168"
            r="10"
            fill="#c084fc"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
          />
        </motion.g>

        {/* Left Leg */}
        <rect
          x="118"
          y="240"
          width="18"
          height="42"
          rx="8"
          fill="url(#robotBody)"
        />

        {/* Right Leg */}
        <rect
          x="164"
          y="240"
          width="18"
          height="42"
          rx="8"
          fill="url(#robotBody)"
        />

        {/* Left Foot */}
        <ellipse
          cx="127"
          cy="286"
          rx="16"
          ry="8"
          fill="#8b5cf6"
        />

        {/* Right Foot */}
        <ellipse
          cx="173"
          cy="286"
          rx="16"
          ry="8"
          fill="#8b5cf6"
        />
      </motion.svg>
    </motion.div>
  );
};

export default Robot;
