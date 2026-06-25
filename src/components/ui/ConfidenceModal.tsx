"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { CERTAINTY_CAP } from "@/lib/calculations";

interface ConfidenceModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConfidenceModal({ open, onClose }: ConfidenceModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="glass fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl p-7 text-center shadow-2xl"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-yellow-400/10 ring-1 ring-yellow-400/30">
                  <ShieldAlert className="h-6 w-6 text-yellow-300" />
                </div>

                <Dialog.Title className="mt-5 font-display text-2xl font-bold italic text-white">
                  Certainty capped
                </Dialog.Title>

                <Dialog.Description className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Absolute certainty in campaign projections is impossible. Please
                  set confidence ≤ {CERTAINTY_CAP.toFixed(2)}. Your input has
                  been snapped back to the cap.
                </Dialog.Description>

                <Dialog.Close asChild>
                  <button className="mt-6 w-full rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-95">
                    Understood
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
