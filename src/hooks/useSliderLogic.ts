"use client";

import { useCallback } from "react";
import { CERTAINTY_CAP } from "@/lib/calculations";

export interface SliderLogicOptions {
  onConfidenceCap?: () => void;
}

export function useSliderLogic({ onConfidenceCap }: SliderLogicOptions = {}) {
  const clampInt = useCallback((value: number, min: number, max: number) => {
    const rounded = Math.round(Number.isFinite(value) ? value : 0);
    return Math.min(max, Math.max(min, rounded));
  }, []);

  const clampDecimal = useCallback((value: number, min: number, max: number) => {
    const normalized = Number.isFinite(value) ? value : 0;
    return Math.min(max, Math.max(min, normalized));
  }, []);

  const setConfidence = useCallback(
    (value: number) => {
      if (value > CERTAINTY_CAP) {
        onConfidenceCap?.();
        return CERTAINTY_CAP;
      }
      return clampDecimal(value, 0, CERTAINTY_CAP);
    },
    [clampDecimal, onConfidenceCap],
  );

  return {
    clampInt,
    clampDecimal,
    setConfidence,
  };
}
