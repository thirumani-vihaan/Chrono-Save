"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

interface LoreItem {
  q: string;
  a: string;
}

const items: LoreItem[] = [
  {
    q: "The premise",
    a: "Every campaign faces uncertainty. This tool quantifies whether your current build's projected stagnation outweighs the potential of ending the game for a fresh one. The longer you can keep playing, the more chances there are for lucky drops and new strategies — so your remaining turns matter as much as the difficulty ahead.",
  },
  {
    q: "How the model thinks",
    a: "We start from your remaining turns R = 82 − Level and a neutral 50/50 prior T = R / 2. Your projected stagnation S is dampened by an uncertainty-decay factor and weighted by your confidence to produce the Effective Stagnation Weight (ESW). A fresh start earns an End Premium (EP) for unseen synergies, raising the Dynamic End Threshold (DRT). The gap between them becomes your Continuity Index.",
  },
  {
    q: "Reading your verdict",
    a: "A high Continuity Index means your current path is robust — Keep Campaign. A middling Index sits in Equilibrium, where uncertainty narrowly favours continuing. A low Index suggests ending the game might unlock higher expected rewards. The Continuity Index runs 0–100, with bands at 30 and 70.",
  },
  {
    q: "Why an end premium?",
    a: "A brand-new build can exploit synergies you haven't discovered yet — serendipity. The End Premium scales with your remaining turns, because more turns mean more opportunities for a fresh strategy to pay off. It is a deliberate thumb on the scale in favour of bold reinvention when the runway is long.",
  },
];

function AccordionRow({ item, index }: { item: LoreItem; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-xl font-semibold italic text-zinc-100">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/12 text-zinc-300"
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-sm leading-relaxed text-zinc-400">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoreAccordion() {
  return (
    <section id="lore" className="mx-auto w-full max-w-3xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <span className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
          The Lore
        </span>
        <h2 className="mt-3 font-display text-4xl font-bold italic text-white sm:text-5xl">
          The logic behind the save
        </h2>
      </motion.div>

      <div className="glass rounded-3xl px-6 sm:px-8">
        {items.map((item, i) => (
          <AccordionRow key={item.q} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
