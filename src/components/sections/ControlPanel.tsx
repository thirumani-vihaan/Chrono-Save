"use client";

import * as Slider from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Eye, HelpCircle, Play, RotateCcw } from "lucide-react";
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

/** Paired dimension + confidence slider group */
function ExperienceGroup({
  dimensionLabel,
  dimensionHint,
  dimensionTooltip,
  dimensionValue,
  dimensionMin,
  dimensionMax,
  dimensionStep,
  onDimensionChange,
  dimensionAccent,
  confLabel,
  confHint,
  confValue,
  onConfChange,
  confAccent,
}: {
  dimensionLabel: string;
  dimensionHint: string;
  dimensionTooltip?: string;
  dimensionValue: number;
  dimensionMin: number;
  dimensionMax: number;
  dimensionStep: number;
  onDimensionChange: (value: number) => void;
  dimensionAccent: string;
  confLabel: string;
  confHint: string;
  confValue: number;
  onConfChange: (value: number) => void;
  confAccent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4 space-y-4">
      <SliderField
        label={dimensionLabel}
        hint={dimensionHint}
        tooltip={dimensionTooltip}
        value={dimensionValue}
        display={`${Math.round(dimensionValue)}`}
        min={dimensionMin}
        max={dimensionMax}
        step={dimensionStep}
        onChange={onDimensionChange}
        accent={dimensionAccent}
      />
      <SliderField
        label={confLabel}
        hint={confHint}
        value={confValue}
        display={confValue.toFixed(2)}
        min={0}
        max={0.99}
        step={0.01}
        onChange={onConfChange}
        accent={confAccent}
      />
    </div>
  );
}

interface ControlPanelProps {
  level: number;
  expectedHappiness: number;
  expectedSuffering: number;
  expectedMeaning: number;
  happinessConf: number;
  sufferingConf: number;
  meaningConf: number;
  futureVisibility: number;
  morale: number;
  ally: number;
  resources: number;
  stamina: number;
  versatility: number;
  rngEvents: number;
  sensitivity: number;
  onLevelChange: (value: number) => void;
  onExpectedHappinessChange: (value: number) => void;
  onExpectedSufferingChange: (value: number) => void;
  onExpectedMeaningChange: (value: number) => void;
  onHappinessConfChange: (value: number) => void;
  onSufferingConfChange: (value: number) => void;
  onMeaningConfChange: (value: number) => void;
  onFutureVisibilityChange: (value: number) => void;
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

const descriptorForVisibility = (value: number) => {
  if (value <= 5) return "Near-blind";
  if (value <= 15) return "Short-range";
  if (value <= 30) return "Mid-range";
  return "Far-sighted";
};

export default function ControlPanel({
  level,
  expectedHappiness,
  expectedSuffering,
  expectedMeaning,
  happinessConf,
  sufferingConf,
  meaningConf,
  futureVisibility,
  morale,
  ally,
  resources,
  stamina,
  versatility,
  rngEvents,
  sensitivity,
  onLevelChange,
  onExpectedHappinessChange,
  onExpectedSufferingChange,
  onExpectedMeaningChange,
  onHappinessConfChange,
  onSufferingConfChange,
  onMeaningConfChange,
  onFutureVisibilityChange,
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
            Project the future
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

      {/* ── Level ── */}
      <div className="space-y-5">
        <SliderField
          label="Character Level"
          hint="Your current level. Higher levels reduce the remaining planning horizon ahead."
          value={level}
          display={`${Math.round(level)}`}
          min={1}
          max={100}
          step={1}
          onChange={onLevelChange}
          accent="#22d3ee"
        />
      </div>

      {/* ── Experience Projection ── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
            Future Outcome Projection
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <ExperienceGroup
            dimensionLabel="Expected Satisfaction"
            dimensionHint="Projected well-being and fulfillment over your planning horizon."
            dimensionTooltip="How much satisfaction do you expect going forward?"
            dimensionValue={expectedHappiness}
            dimensionMin={0}
            dimensionMax={100}
            dimensionStep={1}
            onDimensionChange={onExpectedHappinessChange}
            dimensionAccent="#34d399"
            confLabel="Confidence"
            confHint="How certain is this satisfaction forecast?"
            confValue={happinessConf}
            onConfChange={onHappinessConfChange}
            confAccent="#34d399"
          />
          <ExperienceGroup
            dimensionLabel="Expected Difficulty"
            dimensionHint="Projected hardship, stress, and challenges ahead."
            dimensionTooltip="How much difficulty and challenge do you foresee?"
            dimensionValue={expectedSuffering}
            dimensionMin={0}
            dimensionMax={100}
            dimensionStep={1}
            onDimensionChange={onExpectedSufferingChange}
            dimensionAccent="#fb7185"
            confLabel="Confidence"
            confHint="How certain is this difficulty forecast?"
            confValue={sufferingConf}
            onConfChange={onSufferingConfChange}
            confAccent="#fb7185"
          />
          <ExperienceGroup
            dimensionLabel="Expected Purpose"
            dimensionHint="Projected purpose, significance, and reason to continue."
            dimensionTooltip="How much purpose do you see in the path ahead?"
            dimensionValue={expectedMeaning}
            dimensionMin={0}
            dimensionMax={100}
            dimensionStep={1}
            onDimensionChange={onExpectedMeaningChange}
            dimensionAccent="#a78bfa"
            confLabel="Confidence"
            confHint="How certain is this purpose forecast?"
            confValue={meaningConf}
            onConfChange={onMeaningConfChange}
            confAccent="#a78bfa"
          />
        </div>
      </div>

      {/* ── Future Visibility ── */}
      <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
        <SliderField
          label="Planning Horizon"
          hint="How far ahead can you reasonably plan? Short planning horizons expand the cone, pulling the verdict toward balanced."
          tooltip="A major metric — determines how much of your remaining horizon is 'visible' for forecasting."
          value={futureVisibility}
          display={`${Math.round(futureVisibility)}`}
          descriptor={descriptorForVisibility(futureVisibility)}
          min={1}
          max={50}
          step={1}
          onChange={onFutureVisibilityChange}
          accent="#fbbf24"
        />
        <div className="mt-3 flex items-center gap-2 text-[0.65rem] text-zinc-600">
          <Eye className="h-3 w-3" />
          <span>
            Horizon ratio: {((futureVisibility / Math.max(MAX_LEVEL_DISPLAY - level, 1)) * 100).toFixed(0)}% of remaining horizon
          </span>
        </div>
      </div>

      {/* ── Advanced Context ── */}
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
                    tooltip="Morale affects your current will to continue."
                    hint="Current will to persist."
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
                    tooltip="External support networks that sustain your path."
                    hint="Social and external support."
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
                    tooltip="Resources soften the impact of hardship and long stretches of difficulty."
                    hint="Accumulated reserves and assets."
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
                    label="Versatility"
                    tooltip="Versatility keeps the current path flexible when circumstances shift."
                    hint="Ability to adapt without ending."
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
                    tooltip="External lucky or unlucky events can dramatically alter the path."
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
          Evaluate Direction
        </button>
        <p className="text-center text-[0.7rem] text-zinc-600">
          Results update in real time; the button just refreshes the pulse.
        </p>
      </div>
    </motion.div>
  );
}

/** Used inline for the visibility ratio display. */
const MAX_LEVEL_DISPLAY = 82;
