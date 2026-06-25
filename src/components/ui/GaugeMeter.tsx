"use client";

import { motion } from "framer-motion";

interface GaugeMeterProps {
  /** 0–100. */
  value: number;
  color: string;
  label: string;
  size?: number;
}

export default function GaugeMeter({
  value,
  color,
  label,
  size = 200,
}: GaugeMeterProps) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  // Use a 270° arc (three-quarters) for a more instrument-like gauge.
  const arc = 0.75;
  const offset = circumference * (1 - (clamped / 100) * arc);
  const rotation = 135; // start the arc at the lower-left

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - arc)}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset, stroke: color }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
          style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
        />
      </svg>

      <div className="absolute inset-0 grid place-content-center text-center">
        <motion.span
          key={Math.round(clamped)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-bold tabular-nums"
          style={{ color }}
        >
          {Math.round(clamped)}
        </motion.span>
        <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-zinc-500">
          {label}
        </span>
      </div>
    </div>
  );
}
