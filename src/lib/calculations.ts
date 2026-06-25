export const MAX_LEVEL = 82;
export const TOP_MULTIPLIER = 0.07;
export const RESILIENCE_SCALE = 10;
export const SENSITIVITY_SCALE = 15;
export const CERTAINTY_CAP = 0.9;

export interface Inputs {
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
}

export const DEFAULTS: Inputs = {
  level: 30,
  stagnation: 5,
  confidence: 0.5,
  morale: 60,
  ally: 50,
  resources: 50,
  stamina: 70,
  versatility: 50,
  rngEvents: 50,
  sensitivity: 50,
};

export type Verdict = "Keep" | "Equilibrium" | "End";

export interface CampaignMetrics {
  R: number;
  T: number;
  TOP: number;
  UDF: number;
  EDI: number;
  RS: number;
  DRT: number;
  delta: number;
  CI: number;
  verdict: Verdict;
  resilienceBonus: number;
  sensitivityBias: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const mix = (from: number, to: number, ratio: number) =>
  Math.round(from + (to - from) * ratio);

const toHex = (value: number) => value.toString(16).padStart(2, "0");

function interpolateColor(start: string, end: string, ratio: number) {
  const normalized = clamp(ratio, 0, 1);
  const from = start.replace("#", "");
  const to = end.replace("#", "");
  const r1 = Number.parseInt(from.slice(0, 2), 16);
  const g1 = Number.parseInt(from.slice(2, 4), 16);
  const b1 = Number.parseInt(from.slice(4, 6), 16);
  const r2 = Number.parseInt(to.slice(0, 2), 16);
  const g2 = Number.parseInt(to.slice(2, 4), 16);
  const b2 = Number.parseInt(to.slice(4, 6), 16);

  return `#${toHex(mix(r1, r2, normalized))}${toHex(mix(g1, g2, normalized))}${toHex(mix(b1, b2, normalized))}`;
}

export function getContinuityColor(ci: number) {
  const value = clamp(ci, 0, 100);
  if (value <= 50) {
    return interpolateColor("#fb7185", "#facc15", value / 50);
  }
  return interpolateColor("#facc15", "#22d3ee", (value - 50) / 50);
}

export const VERDICT_META: Record<
  Verdict,
  { label: string; short: string; description: string; color: string }
> = {
  Keep: {
    label: "Keep Campaign",
    short: "Keep",
    description:
      "Your current build is still the stronger expected path. The end-game buffer is comfortably intact.",
    color: "#22d3ee",
  },
  Equilibrium: {
    label: "Equilibrium — Hold Pattern",
    short: "Equilibrium",
    description:
      "The model is balanced. You are close enough to the edge that either choice can be justified.",
    color: "#facc15",
  },
  End: {
    label: "End Game Recommended",
    short: "End",
    description:
      "The projected stagnation is overtaking your available buffer. A new campaign is the safer bet.",
    color: "#fb7185",
  },
};

export function calculateCampaignMetrics(inputs: Inputs): CampaignMetrics {
  const {
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
  } = inputs;

  const safeLevel = clamp(Math.round(level), 1, 100);
  const safeStagnation = clamp(stagnation, 0, 80);
  const safeConfidence = clamp(confidence, 0, CERTAINTY_CAP);
  const safeMorale = clamp(morale, 0, 100);
  const safeAlly = clamp(ally, 0, 100);
  const safeResources = clamp(resources, 0, 100);
  const safeStamina = clamp(stamina, 0, 100);
  const safeVersatility = clamp(versatility, 0, 100);
  const safeRngEvents = clamp(rngEvents, 0, 100);
  const safeSensitivity = clamp(sensitivity, 0, 100);

  const R = MAX_LEVEL - safeLevel;
  const T = R / 2;
  const TOP = R * TOP_MULTIPLIER;
  const UDF = 1 / (1 + Math.log10(safeStagnation + 1));
  const EDI = safeStagnation * Math.pow(safeConfidence, 1.15) * UDF;
  const RS =
    (safeMorale +
      safeAlly +
      safeResources +
      safeStamina +
      safeVersatility +
      safeRngEvents) / 6;
  const resilienceBonus = (RS / 100) * RESILIENCE_SCALE;
  const sensitivityBias = (safeSensitivity / 100) * SENSITIVITY_SCALE;
  const DRT = T + TOP - resilienceBonus - sensitivityBias;
  const delta = DRT - EDI;
  const CI = clamp(50 + delta * 2, 0, 100);

  let verdict: Verdict;
  if (CI > 70) verdict = "Keep";
  else if (CI >= 30) verdict = "Equilibrium";
  else verdict = "End";

  return {
    R,
    T,
    TOP,
    UDF,
    EDI,
    RS,
    DRT,
    delta,
    CI,
    verdict,
    resilienceBonus,
    sensitivityBias,
  };
}
