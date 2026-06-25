"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown, Skull } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-14 text-center sm:pt-28"
    >
      <motion.span
        variants={item}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-zinc-300"
      >
        <Skull className="h-3.5 w-3.5 text-rose-400" />
        Cessation Decision Oracle
      </motion.span>

      <motion.h1
        variants={item}
        className="mt-7 font-display text-5xl font-bold italic leading-[1.02] tracking-tight text-balance sm:text-7xl"
      >
        <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Terminus
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400 text-balance"
      >
        Weigh the grinding, stagnant decay of your current run against the irreversible choice of ending it. There are no restarts, no second chances. Assess whether it is time to sever the thread.
      </motion.p>

      <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#console"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          Consult the Oracle
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </a>
        <a
          href="#lore"
          className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5"
        >
          Read the lore
        </a>
      </motion.div>
    </motion.section>
  );
}
