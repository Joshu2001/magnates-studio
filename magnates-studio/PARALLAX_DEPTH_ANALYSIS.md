# 2.5D Multi-Layer Depth Parallax Motion Suite
## Technical Post-Mortem & Architecture Specification

---

### Executive Summary

During development of the **Depth Parallax Multi-Layer** template (`tplId === 'parallax'`), two major motion bugs were observed:
1. **Negative Playback Speed Inversion:** Dragging the Playback Speed slider to negative values (e.g. `-3.0x`) caused the animation to accelerate in reverse at 3x speed rather than decelerating into ultra-slow motion.
2. **"Dancing / Orbiting" Motion Artifact:** The foreground cutout and background scene appeared to revolve in a circular dance rather than executing a clean Hitchcock/Z-axis Push-In and Pull-Out.
3. **On-Screen Selection Bounding Box Clipping:** The background selection box collapsed to a quarter-size top-left rectangle due to CSS translation insets before stage layout calculation.

This document serves as the permanent architectural reference to ensure these issues never recur.

---

### Root Cause Analysis

#### 1. Playback Speed Multiplier Math Bug
* **Symptom:** Setting speed to `-0.6x` slowed the preview down, but dragging further left to `-3.0x` caused rapid 3x speed.
* **Root Cause:**
  In `/public/js/app.js`, the timeline delta clock was calculated as:
  ```javascript
  // BUGGY IMPLEMENTATION:
  const t = (now - hoverStartTime) / 1000 * (window.tpl3DFx.speed || 1);
  ```
  The slider in `/public/js/tpl-3d-inspector.js` permitted values from `-3.0` to `+3.0`.
  In JavaScript, elapsed time rate depends on the **magnitude** of the multiplier (`|speed|`).
  - At `speed = -0.6`: `|speed| = 0.6` (animation slowed to 60%).
  - At `speed = -3.0`: `|speed| = 3.0` (animation ran at 300% speed, 3x faster!).
* **Permanent Fix:**
  1. The slider range is strictly normalized to positive values: `0.10x` to `3.00x` with step `0.05`.
  2. A defensive sanitizer function `resolveSpeedMult(raw)` was introduced in both `app.js` and `tpl-3d-inspector.js`:
     ```javascript
     function resolveSpeedMult(raw) {
       const n = Number(raw);
       if (isNaN(n) || n === 0) return 1.0;
       // Monotonically map negative numbers to smooth slow-motion:
       return n < 0 ? Math.max(0.08, 1.0 / (1.0 + Math.abs(n))) : n;
     }
     ```
     Moving the slider to the left now **always** slows down the animation, with `-3.0` mapping to `0.25x` ultra slow-mo.

---

#### 2. Circular "Dancing / Revolving" Motion Bug
* **Symptom:** Foreground subject and background mountains moved in a circular wobble rather than pushing in / pulling out along the depth axis.
* **Root Cause:**
  In `/public/js/app.js`, depth scale and horizontal displacement were calculated as:
  ```javascript
  // BUGGY IMPLEMENTATION:
  const p = 0.5 - 0.5 * Math.cos(cycleProgress * Math.PI * 2); // 0 -> 1 -> 0
  const panWave = Math.sin(cycleProgress * Math.PI * 2);        // -1 -> 0 -> 1 -> 0
  const fgPanX = panWave * 14;
  fgElement.style.transform = `translate3d(${fgPanX}px, 0, 0) scale(${fgZoom})`;
  ```
  In planar coordinate geometry, pairing `x = sin(θ)` with `scale = cos(θ)` produces a **parametric ellipse**:
  $$\frac{x^2}{A^2} + \frac{(\text{scale} - 1)^2}{B^2} = 1$$
  This 90° phase shift caused both layers to physically trace a circle in 3D perspective space—perceived by the human eye as an unsteady "dancing" sway.

* **Permanent Fix:**
  1. **Default Lateral Pan = 0px:** `topCustomizerState.spoonerPan = 0;`. Parallax depth is purely executed along the optical Z-axis.
  2. **Unidirectional Ease-Out Depth Progression:**
     Instead of a cyclic sine/cosine loop, the animation uses a calibrated power-curve easing function across the clip duration (`cycleProgress` from `0.0 -> 1.0`):
     ```javascript
     const p = 1.0 - Math.pow(1.0 - cycleProgress, 2.2);
     // Foreground pushes in toward viewer:
     const fgZoom = 1.0 + p * (maxFgZoom - 1.0);
     // Background simultaneously pulls away:
     const bgZoom = maxBgZoom - p * (maxBgZoom - 1.0);
     ```
     This produces authentic cinematic dolly-zoom compression (the classic "Vertigo effect" / Hitchcock push-pull).

---

#### 3. Bounding Box & Cutout Clipping
* **Symptom:** Cutout feet floating, head/ear edge cropped, and selection box stuck in top-left corner.
* **Root Cause:**
  - Cutout image had transparency pads and was clipped at the knees.
  - Background layer `.mtn-back` had CSS `inset: -10%`, yielding negative bounding rect offsets before layout settled.
* **Permanent Fix:**
  - Cutout asset was zoomed and anchored at `transformOrigin = 'center bottom'`, framing from thighs/torso to head so feet are never visible floating in mid-air.
  - In `tpl-stage-transform.js`, when `targetType === 'bg'`, the bounding box is deterministically clamped to the stage container:
    ```javascript
    if (targetType === 'bg') {
      left = 4; top = 4;
      width = parentRect.width - 8;
      height = parentRect.height - 8;
    }
    ```

---

### Architectural Rules for Future AI & Engineers

1. **Never combine out-of-phase `sin` and `cos` transforms on the same layer group** unless an explicit circular orbit effect is requested.
2. **Never multiply time clocks by unsanitized negative slider numbers.** Always map deceleration sliders monotonically.
3. **Expose directional toggles on-canvas.** Keep on-screen HUD toolbar toggles (`Push In` / `Pull Out`) synced with sidebar inspector state.
