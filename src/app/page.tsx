"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SceneCanvas from "@/components/three/SceneCanvas";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import OrbitField from "@/components/sections/OrbitField";
import FloatingCards from "@/components/sections/FloatingCards";
import ControlPanel from "@/components/sections/ControlPanel";
import ResultsDashboard from "@/components/sections/ResultsDashboard";
import LoreAccordion from "@/components/sections/LoreAccordion";
import ConfidenceModal from "@/components/ui/ConfidenceModal";
import {
  DEFAULTS,
  calculateCampaignMetrics,
  getContinuityColor,
} from "@/lib/calculations";
import { useSliderLogic } from "@/hooks/useSliderLogic";

const formula = [
  { k: "R", v: "82 − L" },
  { k: "T", v: "R / 2" },
  { k: "TOP", v: "R · 0.07" },
  { k: "UDF", v: "1 / (1 + log₁₀(S + 1))" },
  { k: "EDI", v: "S · C^1.15 · UDF" },
  { k: "RS", v: "avg(6 context stats)" },
  { k: "DRT", v: "T + TOP − RB − SB" },
  { k: "Δ", v: "DRT − EDI" },
  { k: "CI", v: "clamp(50 + Δ · 2)" },
];

export default function Home() {
  const [level, setLevel] = useState(DEFAULTS.level);
  const [stagnation, setStagnation] = useState(DEFAULTS.stagnation);
  const [confidence, setConfidence] = useState(DEFAULTS.confidence);
  const [morale, setMorale] = useState(DEFAULTS.morale);
  const [ally, setAlly] = useState(DEFAULTS.ally);
  const [resources, setResources] = useState(DEFAULTS.resources);
  const [stamina, setStamina] = useState(DEFAULTS.stamina);
  const [versatility, setVersatility] = useState(DEFAULTS.versatility);
  const [rngEvents, setRngEvents] = useState(DEFAULTS.rngEvents);
  const [sensitivity, setSensitivity] = useState(DEFAULTS.sensitivity);
  const [confidenceModalOpen, setConfidenceModalOpen] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const didMount = useRef(false);

  const { clampInt, clampDecimal, setConfidence: normalizeConfidence } =
    useSliderLogic({
      onConfidenceCap: () => setConfidenceModalOpen(true),
    });

  const metrics = useMemo(
    () =>
      calculateCampaignMetrics({
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
      }),
    [
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
    ],
  );

  const sceneAccent = getContinuityColor(metrics.CI);
  useEffect(() => {
    if (didMount.current) {
      setPulseKey((value) => value + 1);
      return;
    }
    didMount.current = true;
  }, [
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
  ]);

  const handleReset = useCallback(() => {
    setLevel(DEFAULTS.level);
    setStagnation(DEFAULTS.stagnation);
    setConfidence(DEFAULTS.confidence);
    setMorale(DEFAULTS.morale);
    setAlly(DEFAULTS.ally);
    setResources(DEFAULTS.resources);
    setStamina(DEFAULTS.stamina);
    setVersatility(DEFAULTS.versatility);
    setRngEvents(DEFAULTS.rngEvents);
    setSensitivity(DEFAULTS.sensitivity);
    setConfidenceModalOpen(false);
  }, []);

  const handleEvaluate = useCallback(() => {
    setPulseKey((value) => value + 1);
  }, []);

  return (
    <main
      id="top"
      className="relative min-h-dvh overflow-x-hidden text-zinc-100"
    >
      <SceneCanvas accent={sceneAccent} />

      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(125%_95%_at_50%_-5%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      <div
        aria-hidden
        className="adaptive-dots pointer-events-none fixed inset-0 z-[2]"
      />

      <div className="relative z-10">
        <Navbar />

        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-50">
            <OrbitField />
          </div>
          <FloatingCards />
          <div className="relative z-20">
            <Hero />
          </div>
        </section>

        <section id="model" className="mx-auto max-w-4xl px-6 pb-10">
          <div className="glass flex flex-wrap items-center justify-center gap-2 rounded-3xl p-5 sm:gap-3 sm:p-6">
            {formula.map((f) => (
              <span
                key={f.k}
                className="inline-flex items-baseline gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs"
              >
                <span className="font-semibold text-cyan-300">{f.k}</span>
                <span className="font-mono text-zinc-400">{f.v}</span>
              </span>
            ))}
          </div>
        </section>

        <section id="console" className="mx-auto max-w-4xl px-6 pb-24">
          <div className="mb-8 text-center">
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
              The Console
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold italic text-white sm:text-5xl">
              Evaluate your campaign
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <ControlPanel
              level={level}
              stagnation={stagnation}
              confidence={confidence}
              morale={morale}
              ally={ally}
              resources={resources}
              stamina={stamina}
              versatility={versatility}
              rngEvents={rngEvents}
              sensitivity={sensitivity}
              onLevelChange={(value) => setLevel(clampInt(value, 1, 100))}
              onStagnationChange={(value) =>
                setStagnation(clampDecimal(Math.round(value * 2) / 2, 0, 80))
              }
              onConfidenceChange={(value) =>
                setConfidence(normalizeConfidence(value))
              }
              onMoraleChange={(value) => setMorale(clampInt(value, 0, 100))}
              onAllyChange={(value) => setAlly(clampInt(value, 0, 100))}
              onResourcesChange={(value) =>
                setResources(clampInt(value, 0, 100))
              }
              onStaminaChange={(value) => setStamina(clampInt(value, 0, 100))}
              onVersatilityChange={(value) =>
                setVersatility(clampInt(value, 0, 100))
              }
              onRngEventsChange={(value) =>
                setRngEvents(clampInt(value, 0, 100))
              }
              onSensitivityChange={(value) =>
                setSensitivity(clampInt(value, 0, 100))
              }
              onEvaluate={handleEvaluate}
              onReset={handleReset}
            />

            <ResultsDashboard metrics={metrics} pulseKey={pulseKey} />
          </div>
        </section>

        <LoreAccordion />

        <footer className="border-t border-white/8 px-6 py-10 text-center">
          <p className="text-xs text-zinc-600">
            Chrono Save · a fictional campaign decision tool. All figures are
            in-world game mechanics.
          </p>
          <p className="mt-2 text-[0.65rem] text-zinc-700">
            Head sculpture: Lee Perry-Smith (Infinite-Realities) · CC BY 3.0.
          </p>
        </footer>
      </div>

      <ConfidenceModal
        open={confidenceModalOpen}
        onClose={() => setConfidenceModalOpen(false)}
      />
    </main>
  );
}
