# Terminus — Campaign Cessation Oracle

> You are lingering in the late hours of a dying run. The grind is heavy, the build has stagnated, and the progress has ground to a halt. 
>
> But this game is only played once. There are no restarts. There is no fresh start. If you choose to end the campaign, the window closes forever and your journey is permanently over. Do you persist in the creeping decay, or do you sever the thread?
>
> **Terminus** is the Cessation Oracle. It weighs the projected stagnation of your current build against the permanent finality of ending the game, deciding whether you should **Keep** holding the line, wait at **Equilibrium**, or choose **End Game**.

Built with **Next.js 16 (App Router)** + **TypeScript**, a **React Three Fiber** scene of drifting greyscale busts that watch your decisions, and **Framer Motion** transitions throughout.

---

## Showcase

![Terminus Landing Page](screenshots/1-hero.png)

<p align="center">
  <img src="screenshots/2-console.png" width="49%" alt="Evaluation Console" />
  <img src="screenshots/3-lore.png" width="49%" alt="Campaign Lore" />
</p>

---

## Contents

- [Showcase](#showcase)
- [Quick start](#quick-start)
- [The Lore of Cessation](#the-lore-of-cessation)
- [The Mathematical Engine](#the-mathematical-engine)
- [Inputs for Calibration](#inputs-for-calibration)
- [Verdicts of the Oracle](#verdicts-of-the-oracle)
- [Architecture](#architecture)
- [The 3D Watchers](#the-3d-watchers)
- [Scripts](#scripts)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

> **Note (OneDrive users):** Turbopack's dev HMR can fail with a file‑lock error
> (`os error 32` / `EPERM unlink .next/...`) inside OneDrive‑synced folders. If
> you hit this, use a production build instead, which serves reliably:
>
> ```bash
> npm run build
> npm run start   # http://localhost:3000
> ```

---

## The Lore of Cessation

Every single-playthrough campaign reaches a point of friction. The oracle quantifies this dilemma:

```mermaid
flowchart LR
    subgraph Inputs
        A1[Character Level]
        A2[Projected Stagnation]
        A3[Certainty]
        A4[Advanced Context<br/>6 resilience stats + End Sensitivity]
    end

    A1 & A2 & A3 & A4 --> ENGINE[calculateCampaignMetrics]
    ENGINE --> CI[Continuity Index 0–100]
    CI --> V{Verdict}
    V -->|CI &gt; 70| KEEP[Keep Campaign]
    V -->|30 ≤ CI ≤ 70| EQ[Equilibrium]
    V -->|CI &lt; 30| END[End Game]
```

---

## The Mathematical Engine

The equations governing your finality are defined in [`src/lib/calculations.ts`](src/lib/calculations.ts). They weigh persistence against termination:

```mermaid
flowchart TD
    L[Level] --> R["R = 82 − Level<br/>(remaining turns)"]
    R --> T["T = R / 2<br/>(neutral 50/50 prior)"]
    R --> TOP["TOP = R × 0.07<br/>(Temporal Optionality Premium)"]

    S[Stagnation] --> UDF["UDF = 1 / (1 + log10(S + 1))<br/>(uncertainty decay)"]
    S --> EDI
    C[Certainty] --> EDI["EDI = S × C^1.15 × UDF<br/>(Effective Stagnation)"]
    UDF --> EDI

    M[6 context stats] --> RS["RS = avg(morale, ally, resources,<br/>stamina, versatility, rng)"]
    RS --> RB["Resilience Bonus = (RS / 100) × 10"]
    Sen[End Sensitivity] --> SB["Sensitivity Bias = (Sen / 100) × 15"]

    T --> DRT
    TOP --> DRT
    RB --> DRT
    SB --> DRT
    DRT["DRT = T + TOP − Resilience Bonus − Sensitivity Bias<br/>(Dynamic End Threshold)"]

    DRT --> D["Delta = DRT − EDI"]
    EDI --> D
    D --> CIc["CI = clamp(50 + Delta × 2, 0, 100)"]
    CIc --> VR{Verdict}
```

| Symbol | Name | Formula | Meaning in the Void |
| --- | --- | --- | --- |
| `R` | Remaining turns | `82 − Level` | The runway before natural end game occurs. |
| `T` | Neutral threshold | `R / 2` | The neutral point where persistence and letting go are equal. |
| `TOP` | Temporal Optionality Premium | `R × 0.07` | The value of holding on (longer runs allow more lucky events). |
| `UDF` | Uncertainty Decay Factor | `1 / (1 + log10(S + 1))` | Natural decay of your forecasts over extended stagnation. |
| `EDI` | Effective Stagnation Weight | `S × C^1.15 × UDF` | The felt weight of your build's decay. |
| `RS` | Resilience Score | `avg` of the 6 context stats | How well you are supported in resisting termination. |
| `DRT` | Dynamic End Threshold | `T + TOP − ResilienceBonus − SensitivityBias` | The point at which the decay becomes statistically terminal. |
| `Δ` | Delta (core metric) | `DRT − EDI` | The mathematical gap between staying and terminating. |
| `CI` | Continuity Index | `clamp(50 + Δ × 2, 0, 100)` | The overall rating of your run's survivability. |

Constants: `MAX_LEVEL = 82`, `TOP_MULTIPLIER = 0.07`, `RESILIENCE_SCALE = 10`, `SENSITIVITY_SCALE = 15`, `CERTAINTY_CAP = 0.90`.

*Note: High resilience and higher End Sensitivity both lower the Dynamic End Threshold, shifting the balance closer to the permanent finality of an End Game verdict.*

---

## Inputs for Calibration

### Core Sliders (Always Visible)

| Input | Range | Default | Impact on the Oracle |
| --- | --- | --- | --- |
| Character Level | 1–100 | 30 | Higher levels shrink the remaining turns, reducing optionality. |
| Projected Stagnation Period | 0–80 | 5 | The length of time you expect to wander in the build's desert. |
| Certainty | 0.00–0.90 | 0.50 | Dragging this above `0.90` triggers an epistemic-humility modal and snaps you back to the cap. Absolute certainty is a illusion. |

### Advanced Context (Collapsible)

| Input | Range | Default | Meaning |
| --- | --- | --- | --- |
| Morale | 0–100 | 60 | Your character's current will to keep pushing. |
| Ally Strength | 0–100 | 50 | Social, guild, or external support to sustain the run. |
| Resource Reserves | 0–100 | 50 | Gold, inventory items, and stockpiled assets. |
| Stamina / Sanity | 0–100 | 70 | Your physical and mental condition. |
| Build Versatility | 0–100 | 50 | The capacity to adapt your build without ending the run. |
| World RNG Events | 0–100 | 50 | The volatility of external lucky/unlucky incidents. |
| End Sensitivity | 0–100 | 50 | Your personal bias toward finality (Conservative $\to$ Aggressive). |

---

## Verdicts of the Oracle

| Verdict | Continuity Index | Meaning |
| --- | --- | --- |
| **Keep Campaign** | `CI > 70` | Persist. The current build remains your strongest path. Keep going. |
| **Equilibrium** | `30 ≤ CI ≤ 70` | A balanced state. Either choice can be justified. Choose carefully. |
| **End Game** | `CI < 30` | The decay has won. Stagnation exceeds your optionality. Pull the plug and accept the end. |

---

## Architecture

```mermaid
flowchart TD
    PAGE["app/page.tsx<br/>(state + useMemo metrics)"]

    PAGE --> CANVAS["three/SceneCanvas → three/Scene<br/>(drifting busts + particles)"]
    PAGE --> CP["sections/ControlPanel<br/>(core + advanced sliders)"]
    PAGE --> RD["sections/ResultsDashboard<br/>(verdict + breakdown)"]
    PAGE --> MODAL["ui/ConfidenceModal"]
    PAGE --> EXTRA["Navbar · Hero · OrbitField ·<br/>FloatingCards · LoreAccordion"]

    PAGE -. uses .-> HOOK["hooks/useSliderLogic<br/>(clamp + certainty cap)"]
    PAGE -. uses .-> CALC["lib/calculations<br/>(engine + verdict meta + colors)"]
    RD --> GAUGE["ui/GaugeMeter"]
    CP -. inputs .-> CALC
    RD -. metrics .-> CALC
```

Core Modules:
* `src/lib/calculations.ts` — The mathematical engine, types, and color interpolations.
* `src/hooks/useSliderLogic.ts` — Boundary clamps and the certainty-cap validation.
* `src/components/sections/ControlPanel.tsx` — Calibrating sliders and advanced context.
* `src/components/sections/ResultsDashboard.tsx` — Live verdicts, gauge meter, and stat card breakdown.
* `src/components/ui/GaugeMeter.tsx` — SVG circle animations driven by spring physics.
* `src/components/three/Scene.tsx` — React Three Fiber scene containing the gaze-tracking busts.

---

## The 3D Watchers

Four greyscale busts drift in the dark background. They are the silent watchers of your decision.
The bust **nearest your cursor** will snap its attention to follow your movement, tracking you with slight latency. Once your cursor leaves or goes idle, they relax back into their expressionless, infinite drift. 

```mermaid
sequenceDiagram
    participant Mouse
    participant Rig
    participant Head as Nearest Head
    Mouse->>Rig: pointermove (NDC)
    Rig->>Rig: pick nearest mask within radius
    Rig->>Head: activeIndex
    Head->>Head: snap focus up (fast), track gaze (latent)
    Mouse-->>Rig: pointerleave
    Rig->>Head: activeIndex = -1
    Head->>Head: focus decays slowly → dead drift
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local oracle console (Turbopack). |
| `npm run build` | Compile the static production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint check. |
| `npm run format` | Run Prettier code formatting. |

---

*Terminus is an in-universe cessation decision oracle; all figures represent campaign design mechanics. Head sculpture asset: Lee Perry‑Smith (Infinite‑Realities) · CC BY 3.0.*
