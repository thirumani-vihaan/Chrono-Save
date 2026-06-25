"use client";

import * as Slider from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function InfoButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      aria-label={text}
      title={text}
      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 transition-colors hover:text-zinc-200"
    >
      <HelpCircle className="h-3.5 w-3.5" />
    </button>
  );
}

function SliderField({
  label,
  hint,
  tooltip,
  value,
  display,
  descriptor,
  min,
  max,
  step,
  onChange,
  accent = "#22d3ee",
}: {
  label: string;
  hint: string;
  tooltip?: string;
  value: number;
  display: string;
  descriptor?: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  accent?: string;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          {tooltip ? <InfoButton text={tooltip} /> : null}
        </div>
        <div className="text-right">
          <div
            className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold tabular-nums"
            style={{ color: accent }}
          >
            {display}
          </div>
          {descriptor ? (
            <div className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
              {descriptor}
            </div>
          ) : null}
        </div>
      </div>
      <p className="text-xs leading-relaxed text-zinc-500">{hint}</p>
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
      >
        <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-white/10">
          <Slider.Range
            className="absolute h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accent}55, ${accent})`,
            }}
          />
        </Slider.Track>
        <Slider.Thumb
          aria-label={label}
          className="block h-4 w-4 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.08)] outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/60"
          style={{ boxShadow: `0 0 14px ${accent}99` }}
        />
      </Slider.Root>
    </div>
  );
}

interface ControlPanelProps {
  level: number;
  stagnation: number;
  confidence: number;
  morale: number;
  ally: number;
  resources: number;
  stamina: number;
  versatility: number;
  rngEvents: number;
  sensitivity: number;
  onLevelChange: (value: number) => void;
  onStagnationChange: (value: number) => void;
  onConfidenceChange: (value: number) => void;
  onMoraleChange: (value: number) => void;
  onAllyChange: (value: number) => void;
  onResourcesChange: (value: number) => void;
  onStaminaChange: (value: number) => void;
  onVersatilityChange: (value: number) => void;
  onRngEventsChange: (value: number) => void;
  onSensitivityChange: (value: number) => void;
  onEvaluate: () => void;
  onReset: () => void;
}

const descriptorForSensitivity = (value: number) => {
  if (value < 34) return "Conservative";
  if (value < 67) return "Balanced";
  return "Aggressive";
};

export default function ControlPanel({
  level,
  stagnation,
  confidence,
  morale,
  ally,
  resources,
  stamina,
  versatility,
  rngEvents,
  sensitivity,
  onLevelChange,
  onStagnationChange,
  onConfidenceChange,
  onMoraleChange,
  onAllyChange,
  onResourcesChange,
  onStaminaChange,
  onVersatilityChange,
  onRngEventsChange,
  onSensitivityChange,
  onEvaluate,
  onReset,
}: ControlPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass flex flex-col gap-6 rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold italic text-white">
            Input panel
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
            Calibrate your campaign
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setAdvancedOpen(false);
            onReset();
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Default
        </button>
      </div>

      <div className="space-y-5">
        <SliderField
          label="Character Level"
          hint="Your current level in the campaign. Higher levels reduce the remaining runway."
          value={level}
          display={`${Math.round(level)}`}
          min={1}
          max={100}
          step={1}
          onChange={onLevelChange}
          accent="#22d3ee"
        />

        <SliderField
          label="Projected Stagnation Period"
          hint="How long the current build is expected to feel stagnant."
          value={stagnation}
          display={stagnation.toFixed(1)}
          min={0}
          max={80}
          step={0.5}
          onChange={onStagnationChange}
          accent="#a78bfa"
        />

        <SliderField
          label="Certainty"
          hint="Confidence in that projection. The epistemic cap still snaps back above 0.90."
          value={confidence}
          display={confidence.toFixed(2)}
          min={0}
          max={0.99}
          step={0.01}
          onChange={onConfidenceChange}
          accent="#22d3ee"
        />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setAdvancedOpen((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-zinc-200 transition-colors hover:bg-white/10"
        >
          <span aria-hidden className="text-sm leading-none">
            ⚙️
          </span>
          Advanced Context
          <motion.span
            animate={{ rotate: advancedOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {advancedOpen ? (
            <motion.div
              key="advanced-context"
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <SliderField
                    label="Morale"
                    tooltip="Morale affects your character's current will to continue."
                    hint="Current satisfaction with the campaign."
                    value={morale}
                    display={`${morale.toFixed(0)}`}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onMoraleChange}
                    accent="#34d399"
                  />
                  <SliderField
                    label="Ally Strength"
                    tooltip="Allies and guild support can make a stubborn run easier to sustain."
                    hint="Social and guild support."
                    value={ally}
                    display={`${ally.toFixed(0)}`}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onAllyChange}
                    accent="#60a5fa"
                  />
                  <SliderField
                    label="Resource Reserves"
                    tooltip="Resources soften the impact of bad luck and long stretches of stagnation."
                    hint="Gold, items, mana, and other reserves."
                    value={resources}
                    display={`${resources.toFixed(0)}`}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onResourcesChange}
                    accent="#f59e0b"
                  />
                  <SliderField
                    label="Stamina / Sanity"
                    tooltip="Mental and physical condition determine how long you can keep pushing."
                    hint="Physical and mental condition."
                    value={stamina}
                    display={`${stamina.toFixed(0)}`}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onStaminaChange}
                    accent="#f472b6"
                  />
                </div>

                <div className="space-y-4">
                  <SliderField
                    label="Build Versatility"
                    tooltip="Versatility keeps a current build flexible when the campaign shifts."
                    hint="Ability to pivot within the current build."
                    value={versatility}
                    display={`${versatility.toFixed(0)}`}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onVersatilityChange}
                    accent="#22d3ee"
                  />
                  <SliderField
                    label="World RNG Events"
                    tooltip="External lucky or unlucky events can dramatically alter the campaign path."
                    hint="External lucky or unlucky events."
                    value={rngEvents}
                    display={`${rngEvents.toFixed(0)}`}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onRngEventsChange}
                    accent="#c084fc"
                  />
                  <SliderField
                    label="End Sensitivity"
                    tooltip="Higher values mean your personal threshold for ending is lower."
                    hint="Personal bias toward ending."
                    value={sensitivity}
                    display={`${sensitivity.toFixed(0)}`}
                    descriptor={descriptorForSensitivity(sensitivity)}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onSensitivityChange}
                    accent="#fb7185"
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onEvaluate}
          className={cn(
            "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5",
            "text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95",
          )}
        >
          <Play className="h-4 w-4 fill-black" />
          Evaluate Campaign
        </button>
        <p className="text-center text-[0.7rem] text-zinc-600">
          Results update in real time; the button just refreshes the pulse.
        </p>
      </div>
    </motion.div>
  );
}
