"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

interface FloatCard {
  quote: string;
  who: string;
  /** Absolute positioning + drift tuning. */
  pos: string;
  dur: number;
  delay: number;
  from: string;
  to: string;
}

const cards: FloatCard[] = [
  {
    quote:
      "Ended the run at level 12. Three builds later the synergies finally clicked.",
    who: "The Wanderer",
    pos: "left-2 top-[6%] xl:left-6",
    dur: 12,
    delay: 0,
    from: "#8b8b93",
    to: "#3f3f46",
  },
  {
    quote: "The buffer said keep. I held the line and the campaign turned.",
    who: "The Vanguard",
    pos: "right-2 top-[2%] xl:right-8",
    dur: 10,
    delay: 0.6,
    from: "#a8e7f0",
    to: "#3f6f78",
  },
  {
    quote: "High certainty is a trap — the model snapped me back to 0.90.",
    who: "The Archivist",
    pos: "left-2 top-[60%] xl:left-10",
    dur: 13,
    delay: 1.1,
    from: "#c4b5fd",
    to: "#4c3f78",
  },
  {
    quote: "Continuity index read 22. A fresh start unlocked everything.",
    who: "The Strider",
    pos: "right-2 top-[64%] xl:right-6",
    dur: 11,
    delay: 0.3,
    from: "#fda4af",
    to: "#7a3f47",
  },
];

export default function FloatingCards() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden xl:block"
    >
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 + i * 0.18, ease: "easeOut" }}
          className={`absolute ${c.pos} w-64`}
        >
          <div
            className="card-drift glass rounded-3xl p-4"
            style={
              {
                ["--dur" as string]: `${c.dur}s`,
                ["--delay" as string]: `${c.delay}s`,
              } as CSSProperties
            }
          >
            <p className="text-sm leading-snug text-zinc-300">
              &ldquo;{c.quote}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <span
                className="h-7 w-7 rounded-full ring-1 ring-white/15"
                style={{
                  background: `radial-gradient(circle at 32% 28%, ${c.from}, ${c.to})`,
                }}
              />
              <span className="text-xs font-medium tracking-wide text-zinc-500">
                {c.who}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
