"use client";

import React from "react";
import { motion } from "framer-motion";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  pathLength?: number;
}

export const BorderBeam = ({
  className,
  duration = 6,
  borderWidth = 2.5,
  colorFrom = "#DAF1DE", // Vibrant Light Emerald
  colorTo = "#8EB69B",   // Mid Emerald
  delay = 0,
  pathLength = 100,      // Length of the "snake"
}: BorderBeamProps) => {
  return (
    <div className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}>
      <svg
        className="h-full w-full overflow-visible"
        fill="none"
        strokeWidth={borderWidth}
        style={{
          filter: `drop-shadow(0 0 6px ${colorFrom})`,
        }}
      >
        <rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={`calc(100% - ${borderWidth}px)`}
          height={`calc(100% - ${borderWidth}px)`}
          rx="16" // Matches rounded-2xl (1rem = 16px)
          stroke="url(#beam-gradient)"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${pathLength} 1000`,
          }}
        />
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* The Animated Path */}
        <motion.rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={`calc(100% - ${borderWidth}px)`}
          height={`calc(100% - ${borderWidth}px)`}
          rx="16"
          stroke="url(#beam-gradient)"
          strokeLinecap="round"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [-1000, 0] }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
          style={{
            strokeDasharray: `${pathLength} 1000`,
          }}
        />
      </svg>
    </div>
  );
};
