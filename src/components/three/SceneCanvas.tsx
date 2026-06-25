"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

interface SceneCanvasProps {
  accent: string;
}

export default function SceneCanvas({ accent }: SceneCanvasProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Scene accent={accent} />
    </div>
  );
}
