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
  { k: "NES", v: "(H·Hc + M·Mc − S·Sc) / Σc" },
  { k: "EQI", v: "(NES + 100) / 2" },
  { k: "VR", v: "FV / R" },
  { k: "CW", v: "(1 − VR) × 100" },
  { k: "EQI′", v: "EQI + (50 − EQI)·CW·κ" },
  { k: "CI", v: "(EQI′ − 50) · α + 50 + mods" },
];

export default function Home() {
  const [level, setLevel] = useState(DEFAULTS.level);

  /* Experience Projection */
  const [expectedHappiness, setExpectedHappiness] = useState(DEFAULTS.expectedHappiness);
  const [expectedSuffering, setExpectedSuffering] = useState(DEFAULTS.expectedSuffering);
  const [expectedMeaning, setExpectedMeaning] = useState(DEFAULTS.expectedMeaning);
  const [happinessConf, setHappinessConf] = useState(DEFAULTS.happinessConfidence);
  const [sufferingConf, setSufferingConf] = useState(DEFAULTS.sufferingConfidence);
  const [meaningConf, setMeaningConf] = useState(DEFAULTS.meaningConfidence);

  /* Visibility Horizon */
  const [futureVisibility, setFutureVisibility] = useState(DEFAULTS.futureVisibility);

  /* Resilience Context */
  const [morale, setMorale] = useState(DEFAULTS.morale);
  const [ally, setAlly] = useState(DEFAULTS.ally);
  const [resources, setResources] = useState(DEFAULTS.resources);
  const [stamina, setStamina] = useState(DEFAULTS.stamina);
  const [versatility, setVersatility] = useState(DEFAULTS.versatility);
  const [rngEvents, setRngEvents] = useState(DEFAULTS.rngEvents);
  const [sensitivity, setSensitivity] = useState(DEFAULTS.sensitivity);
  const [thresholdBias, setThresholdBias] = useState(DEFAULTS.thresholdBias);

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
        expectedHappiness,
        expectedSuffering,
        expectedMeaning,
        happinessConfidence: happinessConf,
        sufferingConfidence: sufferingConf,
        meaningConfidence: meaningConf,
        futureVisibility,
        morale,
        ally,
        resources,
        stamina,
        versatility,
        rngEvents,
        sensitivity,
        thresholdBias,
      }),
    [
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
      thresholdBias,
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
    thresholdBias,
  ]);

  const handleReset = useCallback(() => {
    setLevel(DEFAULTS.level);
    setExpectedHappiness(DEFAULTS.expectedHappiness);
    setExpectedSuffering(DEFAULTS.expectedSuffering);
    setExpectedMeaning(DEFAULTS.expectedMeaning);
    setHappinessConf(DEFAULTS.happinessConfidence);
    setSufferingConf(DEFAULTS.sufferingConfidence);
    setMeaningConf(DEFAULTS.meaningConfidence);
    setFutureVisibility(DEFAULTS.futureVisibility);
    setMorale(DEFAULTS.morale);
    setAlly(DEFAULTS.ally);
    setResources(DEFAULTS.resources);
    setStamina(DEFAULTS.stamina);
    setVersatility(DEFAULTS.versatility);
    setRngEvents(DEFAULTS.rngEvents);
    setSensitivity(DEFAULTS.sensitivity);
    setThresholdBias(DEFAULTS.thresholdBias);
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
              Consult the Model
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <ControlPanel
              level={level}
              expectedHappiness={expectedHappiness}
              expectedSuffering={expectedSuffering}
              expectedMeaning={expectedMeaning}
              happinessConf={happinessConf}
              sufferingConf={sufferingConf}
              meaningConf={meaningConf}
              futureVisibility={futureVisibility}
              morale={morale}
              ally={ally}
              resources={resources}
              stamina={stamina}
              versatility={versatility}
              rngEvents={rngEvents}
              sensitivity={sensitivity}
              onLevelChange={(value) => setLevel(clampInt(value, 1, 100))}
              onExpectedHappinessChange={(value) => setExpectedHappiness(clampInt(value, 0, 100))}
              onExpectedSufferingChange={(value) => setExpectedSuffering(clampInt(value, 0, 100))}
              onExpectedMeaningChange={(value) => setExpectedMeaning(clampInt(value, 0, 100))}
              onHappinessConfChange={(value) => setHappinessConf(normalizeConfidence(value))}
              onSufferingConfChange={(value) => setSufferingConf(normalizeConfidence(value))}
              onMeaningConfChange={(value) => setMeaningConf(normalizeConfidence(value))}
              onFutureVisibilityChange={(value) => setFutureVisibility(clampInt(value, 1, 50))}
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

      </div>

      <ConfidenceModal
        open={confidenceModalOpen}
        onClose={() => setConfidenceModalOpen(false)}
      />
    </main>
  );
}
