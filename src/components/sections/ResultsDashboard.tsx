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

/** SVG Possibility Cone — fan-shaped visualization of certainty vs. uncertainty */
function PossibilityCone({
  VR,
  CW,
  EQI,
  EQI_adj,
  ciColor,
}: {
  VR: number;
  CW: number;
  EQI: number;
  EQI_adj: number;
  ciColor: string;
}) {
  const width = 400;
  const height = 140;
  const originX = 20;
  const originY = height / 2;
  const endX = width - 20;
  const visibleX = originX + (endX - originX) * Math.min(VR, 1);

  // Cone spread based on experience quality — wider when uncertain
  const visibleSpread = 16 + (1 - VR) * 10;
  const fullSpread = 16 + (CW / 100) * 50;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
          Uncertainty Cone
        </div>
        <div className="flex items-center gap-3 text-[0.65rem] text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: ciColor }} />
            Within Horizon ({(VR * 100).toFixed(0)}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-zinc-600" />
            Beyond Horizon ({CW.toFixed(0)}%)
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: 140 }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={originX + (endX - originX) * frac}
            y1={10}
            x2={originX + (endX - originX) * frac}
            y2={height - 10}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}

        {/* Uncertainty cone (beyond visibility) */}
        <motion.polygon
          initial={false}
          animate={{
            points: `${visibleX},${originY - visibleSpread} ${endX},${originY - fullSpread} ${endX},${originY + fullSpread} ${visibleX},${originY + visibleSpread}`,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
          fill="rgba(113,113,122,0.12)"
          stroke="rgba(113,113,122,0.25)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Visible cone */}
        <motion.polygon
          initial={false}
          animate={{
            points: `${originX},${originY} ${visibleX},${originY - visibleSpread} ${visibleX},${originY + visibleSpread}`,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
          fill={`${ciColor}18`}
          stroke={ciColor}
          strokeWidth={1.5}
        />

        {/* Visibility horizon line */}
        <motion.line
          initial={false}
          animate={{ x1: visibleX, x2: visibleX }}
          y1={6}
          y2={height - 6}
          stroke="rgba(251,191,36,0.5)"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />

        {/* Origin dot */}
        <circle cx={originX} cy={originY} r={4} fill={ciColor} />

        {/* EQI marker in visible zone */}
        <motion.circle
          initial={false}
          animate={{
            cx: originX + (visibleX - originX) * 0.65,
            cy: originY - visibleSpread * ((EQI - 50) / 100),
          }}
          r={3}
          fill={ciColor}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />

        {/* Adjusted EQI marker (cone-corrected) */}
        <motion.circle
          initial={false}
          animate={{
            cx: visibleX + (endX - visibleX) * 0.5,
            cy: originY - fullSpread * ((EQI_adj - 50) / 100),
          }}
          r={3}
          fill="rgba(161,161,170,0.6)"
          stroke="rgba(161,161,170,0.4)"
          strokeWidth={1}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />

        {/* Center axis */}
        <line
          x1={originX}
          y1={originY}
          x2={endX}
          y2={originY}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />

        {/* Labels */}
        <text x={originX} y={height - 2} fill="rgba(161,161,170,0.5)" fontSize={9} fontFamily="var(--font-inter)">
          Now
        </text>
        <motion.text
          initial={false}
          animate={{ x: visibleX }}
          y={height - 2}
          fill="rgba(251,191,36,0.6)"
          fontSize={9}
          fontFamily="var(--font-inter)"
          textAnchor="middle"
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        >
          Horizon
        </motion.text>
        <text x={endX} y={height - 2} fill="rgba(161,161,170,0.3)" fontSize={9} fontFamily="var(--font-inter)" textAnchor="end">
          End of planning horizon
        </text>
      </svg>

      <div className="mt-2 flex justify-between text-[0.65rem] text-zinc-600">
        <span>EQI {EQI.toFixed(1)} → Adjusted {EQI_adj.toFixed(1)}</span>
        <span>Cone pulls {CW > 30 ? "strongly" : "mildly"} toward balanced</span>
      </div>
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
            Current assessment
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
        <GaugeMeter value={metrics.CI} color={gaugeColor} label="Continuity Score" />

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
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
              Net value: {metrics.netValue.toFixed(1)} (0 = null / cessation)
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
            <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs text-amber-400">
              Cone {metrics.CW.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Uncertainty Cone Visualization ── */}
      <PossibilityCone
        VR={metrics.VR}
        CW={metrics.CW}
        EQI={metrics.EQI}
        EQI_adj={metrics.EQI_adj}
        ciColor={gaugeColor}
      />

      {/* ── Stat Cards ── */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Remaining Horizon (R)"
          value={metrics.R.toFixed(0)}
          hint="82 − level"
        />
        <StatCard
          label="Outcome Quality (EQI)"
          value={metrics.EQI.toFixed(1)}
          hint="Net outcome score normalised to 0–100"
          accent={metrics.EQI >= 50 ? "#34d399" : "#fb7185"}
        />
        <StatCard
          label="Cone Width (CW)"
          value={`${metrics.CW.toFixed(1)}%`}
          hint="Uncertainty beyond the planning horizon"
          accent="#fbbf24"
        />
        <StatCard
          label="Delta (Δ)"
          value={`${metrics.delta >= 0 ? "+" : ""}${metrics.delta.toFixed(2)}`}
          hint="Threshold minus outcome-adjusted weight"
          accent={deltaTone}
        />
      </div>

      {/* ── Resilience Score ── */}
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
