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
    a: "Every direction reaches a point where the path ahead becomes unclear. This tool does not measure stagnation — it projects outcomes. By forecasting expected satisfaction, difficulty, and purpose across the visible horizon, it quantifies whether the current path is worth holding. Continuing is the default. But when projected difficulty outweighs satisfaction and purpose, the model calculates whether it is time to close that path and consider a new direction.",
  },
  {
    q: "How the model thinks",
    a: "The engine begins with three dimensions of projected outcomes — satisfaction, difficulty, and purpose — each weighted by your own confidence in that forecast. These combine into a Net Outcome Score (NES) and normalise to an Outcome Quality Index (EQI). Then your Planning Horizon determines how far ahead you can reasonably see. Beyond that horizon, the Uncertainty Cone expands: high uncertainty pulls the verdict toward Balanced, because you cannot justify closing a path you cannot see. The cone-adjusted EQI is weighed against the Dynamic Threshold to produce the Continuity Score.",
  },
  {
    q: "Reading your assessment",
    a: "A high Continuity Score means the projected outcomes ahead favour continuation — stay on your current path (the default choice). A middling Score sits in Balanced, often because the planning horizon is too short to see clearly — either continuing or reassessing can be justified. A low Score means projected difficulty has overwhelmed satisfaction and purpose across the visible horizon. There are no second chances; once the path is closed, the assessment ends forever.",
  },
  {
    q: "Why uncertainty cones?",
    a: "The further you look into the future, the less certain you can be. The Uncertainty Cone models this fundamental truth. Within your planning horizon, your forecasts carry weight. Beyond it, uncertainty expands rapidly — the cone widens, and the model cannot confidently recommend either continuation or reassessment. This prevents premature closures when you simply cannot see far enough, and prevents false hope when the visible horizon is already dark.",
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
          The logic of reassessment
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
