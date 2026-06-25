"use client";

import { motion } from "framer-motion";
import { getContinuityColor, VERDICT_META, type CampaignMetrics } from "@/lib/calculations";
import GaugeMeter from "@/components/ui/GaugeMeter";

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div
        className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-zinc-100"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      <div className="mt-1 text-[0.7rem] leading-snug text-zinc-600">{hint}</div>
    </div>
  );
}

interface ResultsDashboardProps {
  metrics: CampaignMetrics;
  pulseKey: number;
}

export default function ResultsDashboard({
  metrics,
  pulseKey,
}: ResultsDashboardProps) {
  const meta = VERDICT_META[metrics.verdict];
  const gaugeColor = getContinuityColor(metrics.CI);
  const deltaTone = metrics.delta < 0 ? "#fb7185" : "#22d3ee";
  const bufferRatio = metrics.DRT === 0 ? 0 : (metrics.DRT - metrics.EDI) / metrics.DRT;
  const bufferFill = Math.min(100, Math.abs(bufferRatio) * 100);
  const bufferColor = bufferRatio < 0 ? "#fb7185" : gaugeColor;
  const rsFill = `${metrics.RS}%`;

  return (
    <motion.div
      key={pulseKey}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass flex flex-col gap-6 rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold italic text-white">
            Results
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
            Live verdict
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            color: meta.color,
            backgroundColor: `${meta.color}1f`,
          }}
        >
          {meta.short}
        </span>
      </div>

      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">
        <GaugeMeter value={metrics.CI} color={gaugeColor} label="Continuity Index" />

        <div className="flex-1 text-center lg:text-left">
          <motion.h3
            key={metrics.verdict}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-display text-3xl font-bold italic leading-tight"
            style={{ color: gaugeColor }}
          >
            {meta.label}
          </motion.h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {meta.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
              CI {metrics.CI.toFixed(1)}
            </span>
            <span
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                borderColor: `${gaugeColor}33`,
                color: gaugeColor,
              }}
            >
              Delta {metrics.delta >= 0 ? "+" : ""}
              {metrics.delta.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium uppercase tracking-[0.18em] text-zinc-500">
            Uncertainty Buffer
          </span>
          <span className="tabular-nums" style={{ color: bufferColor }}>
            {bufferRatio >= 0 ? "+" : ""}
            {(bufferRatio * 100).toFixed(1)}%
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            initial={false}
            animate={{ width: `${bufferFill}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{ backgroundColor: bufferColor }}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Remaining Turns (R)"
          value={metrics.R.toFixed(0)}
          hint="82 − level"
        />
        <StatCard
          label="Effective Stagnation (EDI)"
          value={metrics.EDI.toFixed(2)}
          hint="Stagnation weighted by confidence and decay"
        />
        <StatCard
          label="Dynamic Threshold (DRT)"
          value={metrics.DRT.toFixed(2)}
          hint="End-game bar after resilience and sensitivity"
        />
        <StatCard
          label="Delta (Δ)"
          value={`${metrics.delta >= 0 ? "+" : ""}${metrics.delta.toFixed(2)}`}
          hint="Threshold minus effective stagnation"
          accent={deltaTone}
        />
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
              Resilience Score (RS)
            </div>
            <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-white">
              {metrics.RS.toFixed(1)}
            </div>
          </div>
          <div className="text-right text-[0.7rem] text-zinc-500">
            <div>Resilience bonus {metrics.resilienceBonus.toFixed(2)}</div>
            <div>Sensitivity bias {metrics.sensitivityBias.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full"
            initial={false}
            animate={{ width: rsFill }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            style={{ background: "linear-gradient(90deg, #60a5fa, #22d3ee)" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.65rem] text-zinc-600">
          <span>Low support</span>
          <span>High support</span>
        </div>
      </div>
    </motion.div>
  );
}
