"use client";

import type { CSSProperties } from "react";

interface Ring {
  /** width / height as % of the stage (ellipses when h < w). */
  w: number;
  h: number;
  border: number;
  opacity: number;
  dur: number;
  tilt: number;
  dir: "forward" | "reverse";
}

const rings: Ring[] = [
  { w: 96, h: 96, border: 1.4, opacity: 0.1, dur: 70, tilt: 0, dir: "forward" },
  { w: 82, h: 30, border: 2, opacity: 0.16, dur: 30, tilt: 0, dir: "forward" },
  { w: 82, h: 26, border: 1.8, opacity: 0.14, dur: 26, tilt: 64, dir: "forward" },
  { w: 82, h: 38, border: 2, opacity: 0.13, dur: 36, tilt: -24, dir: "reverse" },
  { w: 82, h: 20, border: 1.6, opacity: 0.11, dur: 22, tilt: 24, dir: "forward" },
  { w: 64, h: 64, border: 1.2, opacity: 0.09, dur: 54, tilt: 0, dir: "reverse" },
];

function ringStyle(r: Ring): CSSProperties {
  return {
    width: `${r.w}%`,
    height: `${r.h}%`,
    borderWidth: `${r.border}px`,
    borderColor: `hsl(0 0% 100% / ${r.opacity})`,
    ["--tilt" as string]: `${r.tilt}deg`,
    ["--dur" as string]: `${r.dur}s`,
  } as CSSProperties;
}

/** Decorative concentric orbit rings with a glowing orbiting star. */
export default function OrbitField() {
  return (
    <div aria-hidden className="orbit-stage">
      <div className="orbit-float">
        {rings.map((r, i) => (
          <div
            key={i}
            className={`orbit-ring orbit-ring-${r.dir}`}
            style={ringStyle(r)}
          />
        ))}

        <div className="orbit-track">
          <div className="orbit-star">
            <div className="orbit-glow-lg" />
            <div className="orbit-glow-sm" />
            <div className="orbit-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
