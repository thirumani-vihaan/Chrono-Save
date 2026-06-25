"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { Environment, Float, Lightformer, useGLTF } from "@react-three/drei";
import {
  AdditiveBlending,
  BackSide,
  Camera,
  Group,
  MathUtils,
  Vector3,
  type BufferGeometry,
  type Mesh,
  type Points as ThreePoints,
} from "three";

const HEAD_URL = "/models/head.glb";
const HEAD_NORM = 0.26;
useGLTF.preload(HEAD_URL);

function hashRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

// Shared pointer state, written by window listeners (the canvas itself is
// pointer-events-none, so the built-in state.pointer never updates).
interface PointerState {
  x: number; // normalized device coords, -1..1
  y: number;
  inside: boolean;
}

// Reused scratch vectors so the per-frame gaze math allocates nothing.
const _dir = new Vector3();
const _target = new Vector3();

// Projects a normalized-device pointer onto a world-space plane at z = planeZ.
function pointerToWorld(
  px: number,
  py: number,
  camera: Camera,
  planeZ: number,
  out: Vector3,
): Vector3 {
  out.set(px, py, 0.5).unproject(camera);
  _dir.copy(out).sub(camera.position);
  const scale = (planeZ - camera.position.z) / _dir.z;
  return out.copy(camera.position).add(_dir.multiplyScalar(scale));
}

interface HeadConfig {
  position: [number, number, number];
  scale: number;
  baseYaw: number;
  roll: number;
  phase: number;
  floatSpeed: number;
  spin: number;
}

const HEADS: HeadConfig[] = [
  { position: [-3, 0, -0.6], scale: 1.05, baseYaw: 0.5, roll: 0.12, phase: 0, floatSpeed: 1, spin: 0.03 },
  { position: [3.1, -0.1, -0.9], scale: 1.2, baseYaw: -0.55, roll: -0.12, phase: 1.7, floatSpeed: 0.85, spin: -0.025 },
  { position: [-3.7, 2.9, -7.5], scale: 0.7, baseYaw: 0.3, roll: 0.05, phase: 3.1, floatSpeed: 1.2, spin: 0.05 },
  { position: [3.9, -3.2, -7], scale: 0.62, baseYaw: -0.4, roll: -0.06, phase: 4.4, floatSpeed: 1.3, spin: -0.04 },
];

function Particles({ count = 3200 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + hashRandom(i + 1) * 16;
      const theta = hashRandom(i + 1.37) * Math.PI * 2;
      const phi = Math.acos(2 * hashRandom(i + 2.71) - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.012;
    ref.current.rotation.x += delta * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function Head({
  index,
  config,
  accent,
  pointerRef,
  activeIndexRef,
}: {
  index: number;
  config: HeadConfig;
  accent: string;
  pointerRef: React.RefObject<PointerState>;
  activeIndexRef: React.RefObject<number>;
}) {
  const { position, scale, baseYaw, roll, phase, floatSpeed, spin } = config;
  const ref = useRef<Group>(null);
  const { nodes } = useGLTF(HEAD_URL);
  const geometry = (nodes.LeePerrySmith as Mesh).geometry as BufferGeometry;

  // Smoothed state that survives across frames.
  const focus = useRef(0); // 0 = dead drift, 1 = locked onto cursor
  const aimYaw = useRef(0); // latently-tracked yaw toward the cursor
  const aimPitch = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pointer = pointerRef.current;
    const isActive =
      !!pointer && pointer.inside && activeIndexRef.current === index;

    // --- Snap toward / slow float back ---------------------------------
    // Sharp attack when targeted, languid release when the cursor leaves.
    const focusTarget = isActive ? 1 : 0;
    const focusRate = focusTarget > focus.current ? 18 : 1.5;
    focus.current = MathUtils.damp(
      focus.current,
      focusTarget,
      focusRate,
      delta,
    );
    const f = focus.current;

    // --- Where is the cursor, in this head's depth slab? ---------------
    if (pointer && pointer.inside && f > 0.001) {
      pointerToWorld(pointer.x, pointer.y, state.camera, 3, _target);
      const dx = _target.x - position[0];
      const dy = _target.y - position[1];
      const dz = 3 - position[2];
      const gazeYaw = Math.atan2(dx, dz);
      const gazePitch = -Math.atan2(dy, dz);
      // Organic latency: the gaze lags the cursor slightly.
      aimYaw.current = MathUtils.damp(aimYaw.current, gazeYaw, 9, delta);
      aimPitch.current = MathUtils.damp(aimPitch.current, gazePitch, 9, delta);
    } else {
      // Relax the remembered aim back to a neutral forward.
      aimYaw.current = MathUtils.damp(aimYaw.current, baseYaw, 2, delta);
      aimPitch.current = MathUtils.damp(aimPitch.current, 0, 2, delta);
    }

    // --- Compose idle drift + blended gaze -----------------------------
    const idleYaw = baseYaw + t * spin + Math.sin(t * 0.25 + phase) * 0.1;
    const idlePitch = Math.sin(t * 0.18 + phase) * 0.04;
    const idleRoll = roll + Math.sin(t * 0.2 + phase) * 0.025;

    ref.current.rotation.y = idleYaw + f * (aimYaw.current - baseYaw);
    ref.current.rotation.x = idlePitch + f * aimPitch.current;
    ref.current.rotation.z = idleRoll;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.08} floatIntensity={0.85}>
      <group position={position} scale={HEAD_NORM * scale}>
        <group ref={ref}>
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color="#0c0c10"
              metalness={0.62}
              roughness={0.26}
              emissive={accent}
              emissiveIntensity={0.03}
              envMapIntensity={1.6}
            />
          </mesh>
          <mesh geometry={geometry} scale={1.035}>
            <meshBasicMaterial
              color={accent}
              transparent
              opacity={0.05}
              side={BackSide}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function Rig({ accent }: { accent: string }) {
  const group = useRef<Group>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, inside: false });
  const activeIndexRef = useRef<number>(-1);

  useEffect(() => {
    const pointer = pointerRef.current;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  useFrame((state: RootState, delta) => {
    if (!group.current) return;
    const pointer = pointerRef.current;

    const targetY = pointer.x * 0.22;
    const targetX = -pointer.y * 0.12;
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetY,
      3,
      delta,
    );
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetX,
      3,
      delta,
    );

    // Pick the mask nearest the cursor (in the screen plane) for the gaze
    // lock. Beyond a generous radius nothing is targeted, so the busts all
    // resume their dead drift.
    if (!pointer.inside) {
      activeIndexRef.current = -1;
      return;
    }
    pointerToWorld(pointer.x, pointer.y, state.camera, 0, _target);
    let nearest = -1;
    let nearestDist = 6; // max world-XY radius for a lock
    for (let i = 0; i < HEADS.length; i++) {
      const p = HEADS[i].position;
      const dx = _target.x - p[0];
      const dy = _target.y - p[1];
      const dist = Math.hypot(dx, dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    activeIndexRef.current = nearest;
  });

  return (
    <group ref={group}>
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[4, 4, 4]}
          scale={[9, 11, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[-6, 2, 1]}
          scale={[6, 9, 1]}
          color="#9fb0ff"
        />
        <Lightformer
          form="ring"
          intensity={1.4}
          position={[0, 5, -5]}
          scale={6}
          color="#ffffff"
        />
      </Environment>

      <ambientLight intensity={0.16} />
      <spotLight
        position={[4, 8, 5]}
        angle={0.7}
        penumbra={1}
        intensity={3.5}
        color="#f2f0ea"
      />
      <directionalLight position={[-5, 2, -5]} intensity={1.1} color="#8aa0d8" />
      <pointLight position={[0, -1.5, 3]} intensity={3.5} distance={26} color={accent} />

      <Particles />

      <Suspense fallback={null}>
        {HEADS.map((config, index) => (
          <Head
            key={index}
            index={index}
            config={config}
            accent={accent}
            pointerRef={pointerRef}
            activeIndexRef={activeIndexRef}
          />
        ))}
      </Suspense>
    </group>
  );
}

interface SceneProps {
  accent: string;
}

export default function Scene({ accent }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 48 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 11, 24]} />
      <Rig accent={accent} />
    </Canvas>
  );
}
