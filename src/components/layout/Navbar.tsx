"use client";

import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";

const links = [
  { label: "Lore", href: "#lore" },
  { label: "The Method", href: "#model" },
  { label: "Assess", href: "#console" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 px-4 pt-4 sm:px-6"
    >
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
            <Hourglass className="h-4 w-4 text-cyan-300" />
          </span>
          <span className="text-sm font-semibold tracking-[0.2em] text-zinc-100">
            HORIZON<span className="text-zinc-500"> EXPLORER</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#console"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          Open console
        </a>
      </nav>
    </motion.header>
  );
}
