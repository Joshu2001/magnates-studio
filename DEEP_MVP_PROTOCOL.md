# Engineering & Product Execution Protocol (DEEP-MVP)

This protocol governs every architecture, feature, refactor, and implementation task in this project. Whenever a task or feature request is initiated, analyze and execute through this lens.

---

## 1. Dual-Expert Analysis Lens

Every feature must be evaluated through two distinct specialist viewpoints before writing code:

### A. Senior Systems / Media Engine Perspective
* **Determinism & Accuracy:** Ensure clock synchronization, frame accuracy, non-destructive editing, and zero sub-frame drift.
* **Performance & Latency:** Scrubbing, preview rendering, and waveform drawing must stay under the 16.6ms (60 FPS) budget.
* **State & Data Structure:** Maintain an append-only/immutable timeline tree (e.g., EDL/OTIO concepts or composable Render DAG) decoupled from presentation.

### B. Master Video Editor (NLE Ergonomics) Perspective
* **Timeline Cadence & Flow:** Editing is muscle memory. Keyboard shortcuts, magnetic snapping, ripple edits, and scrub resistance must feel tactile and predictable.
* **Non-Destructive Guarantee:** Trimming, slicing, or moving clips never alters raw media. Transitions and effects are modular layers.
* **Preview Fidelity:** Scrubbing backwards and forwards must display the exact target frame immediately without artifacting or stalling.

---

## 2. The Raw Materials Hierarchy

Never build on top of premature abstractions or high-level UI wrappers when designing core mechanics. Always trace the feature down to its rawest materials:

| Layer | Raw Material (The Primitives) | Anti-Pattern (What to Avoid) |
| :--- | :--- | :--- |
| **Time & Sync** | Rational integer fractions (`pts = num / den`, ticks, integer frame counts). | Floating-point seconds (`12.345s`) which accumulate sub-frame drift over time. |
| **Media & Decoders** | Demuxed packets, decoded planar frame buffers (`RGBA` / `YUV`), PCM audio byte arrays, keyframe offsets (`I/P/B`). | Generic `<video>` DOM tag hacks or treating video as a simple static asset. |
| **Project State** | Track collection, Cut Decision Graph (clip source in/out, timeline in/out), transition nodes. | Hardcoded array of spliced video elements or pre-baked media files. |
| **Pipeline & Output** | Shader passes, composition blend modes, audio gain mixing buffers. | Exporting via slow canvas screen-recording hacks. |
| **Interaction** | Pixel-to-time ratio (`pxPerSecond`), snap magnetism bounds, drag delta event streams. | Unbounded layout updates or full-timeline re-renders on pointer move. |

---

## 3. Cognitive Load Guardian (Beginner-First Filter)

> **Rule:** If a proposed design introduces cognitive overload, jargon, or unnecessary friction for a beginner, call it out directly and present the simplified alternative.

* **Jargon Replacement:**
  * Avoid: *Source Track Patching (V1/A1 mapping), Drop-frame Timecode, Ripple vs. Roll vs. Slip tool toggles.*
  * Prefer: *Magnetic auto-docking, smart split (`Split` / `S`), clear hover indicators, drag-to-trim.*
* **Progressive Disclosure:** Keep the primary canvas clean. Advanced capabilities (frame rates, keyframe easing, rational timecode) stay under the hood or in optional inspection drawers.
* **Explicit Call-Out Format:**
  > 🛑 **Cognitive Load Warning:** [State why the proposed approach overwhelms a novice or adds mental friction]  
  > 💡 **Beginner-Friendly Alternative:** [State the direct-manipulation / intuitive equivalent without sacrificing technical rigor]

---

## 4. Ground-Truth Verification (Independent Proof)

Do not rely on "it looks okay in preview". Define independent, programmatic proof that confirms correctness:
* **Frame Accuracy Tests:** Verify seek-to-frame N yields PTS index N without skipped or duplicated frames.
* **Audio-Video Phase Coherence:** Test audio buffer timestamps align with visual timeline boundaries.
* **Boundary & Edge Tests:** Slicing at timestamp 0, clip boundaries, zero-length trims, out-of-order clips.
* **Performance Benchmarks:** Verify timeline zoom/pan/scrub state updates maintain 60 FPS under stress.

---

## 5. Execution Workflow For Every Implementation Task

When a task is received, structure the response and execution as follows:

```markdown
### 1. Dual Perspective (Engine & Editor)
- What critical mechanics or editor conventions must be accounted for?

### 2. Raw Materials
- What primitive data types and hardware/engine primitives drive this?

### 3. Cognitive Load Check
- Is anything too complex or steep for beginners? (Flag & simplify if needed).

### 4. Verification Strategy
- What objective test, benchmark, or invariant proves this works?

### 5. Implementation
- Clean, robust, production-grade code.
```
