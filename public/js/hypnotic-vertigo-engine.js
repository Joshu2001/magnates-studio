/**
 * Hypnotic Vertigo & Dizziness Roll Engine
 * Inspired by James Jani / Magnates Media psychological thriller sequences.
 *
 * Visual Characteristics:
 * 1. Deep Centered Crop / Zoom with Slow Breathing Dolly-Zoom (Pulse scale)
 * 2. Hypnotic Roll: Slow continuous spin (or smooth pendulum tilt oscillation left-to-right)
 * 3. CRT Scanline Raster Interlacing & Phosphor Vignette
 * 4. Micro Optical Aberration (RGB Chromatic Split) & 35mm Gate Jitter
 * 5. Radial Tension Focus / Tunnel Depth Blur
 */

(function() {
  'use strict';

  const DEFAULT_IMAGE = '/hypnotic_creation_adam.png';

  const DEFAULT_CONFIG = {
    mode: 'pendulum', // 'pendulum' (sways left-right) or 'continuous' (infinite 360 spin)
    spinSpeed: 24.0, // seconds per full oscillation or 360 rotation
    maxTiltAngle: 18.0, // degrees of tilt in pendulum mode (-18deg to +18deg)
    zoomBase: 1.45, // default deep zoom-in crop
    zoomBreathing: 0.22, // amount of breathing pulse (e.g. 1.45 +/- 0.22)
    zoomSpeed: 9.0, // seconds per zoom breathing cycle
    scanlines: true,
    scanlineDensity: 3, // px per scanline bar
    chromaticAberration: true,
    chromaticIntensity: 3.5, // px shift
    vignetteIntensity: 0.85,
    hypnoticSpiralWobble: true,
    wobbleAmount: 4.0 // subtle hypnotic breathing distortion
  };

  function getHypnoticConfig(state) {
    const raw = (state && state.hypnoticConfig) || {};
    return Object.assign({}, DEFAULT_CONFIG, raw);
  }

  /**
   * Mount the HTML DOM Stage inside the Customizer Modal
   */
  window.tplMountHypnoticVertigoStage = function(stage, state) {
    if (!stage) return;

    const imgUrl = (state && (state.primaryUrl || state.imageUrl)) || DEFAULT_IMAGE;
    const cfg = getHypnoticConfig(state);

    stage.innerHTML = `
      <div id="hypnotic-vertigo-root" style="
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #020306;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        perspective: 1000px;
      ">
        <!-- Background Ambient Hypnotic Aura / Edge Vignette Glow -->
        <div id="hypnotic-aura" style="
          position: absolute;
          inset: -15%;
          background: radial-gradient(circle at center, rgba(30, 58, 138, 0.25) 0%, rgba(2, 6, 23, 0.95) 75%, #000000 100%);
          pointer-events: none;
          z-index: 1;
        "></div>

        <!-- Hypnotic Rotating Image Rig -->
        <div id="hypnotic-rotator-rig" style="
          position: absolute;
          width: 130%;
          height: 130%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          will-change: transform;
          z-index: 2;
        ">
          <!-- Chromatic Split Red Channel (Underlay) -->
          <img id="hypnotic-chroma-red" src="${imgUrl}" alt="Hypnotic Subject" style="
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            mix-blend-mode: screen;
            opacity: 0.8;
            filter: drop-shadow(-3px 0px 0px rgba(255, 0, 60, 0.75));
            pointer-events: none;
            display: ${cfg.chromaticAberration ? 'block' : 'none'};
          " />

          <!-- Chromatic Split Cyan Channel (Underlay) -->
          <img id="hypnotic-chroma-cyan" src="${imgUrl}" alt="Hypnotic Subject" style="
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            mix-blend-mode: screen;
            opacity: 0.8;
            filter: drop-shadow(3px 0px 0px rgba(0, 240, 255, 0.75));
            pointer-events: none;
            display: ${cfg.chromaticAberration ? 'block' : 'none'};
          " />

          <!-- Primary Main High-Detail Image -->
          <img id="hypnotic-main-img" src="${imgUrl}" alt="Hypnotic Subject" style="
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(1.18) saturate(1.1) brightness(0.95);
            pointer-events: none;
            z-index: 3;
          " />
        </div>

        <!-- Hypnotic Optical CRT Scanlines Overlay -->
        <div id="hypnotic-crt-scanlines" style="
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.38) 0px,
            rgba(0, 0, 0, 0.38) 1.5px,
            transparent 1.5px,
            transparent 3.5px
          );
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: multiply;
          opacity: ${cfg.scanlines ? '0.9' : '0'};
          transition: opacity 0.3s ease;
        "></div>

        <!-- Subtle Horizontal Phosphor Sweep Beam (CRT roll line) -->
        <div id="hypnotic-phosphor-beam" style="
          position: absolute;
          left: 0;
          width: 100%;
          height: 16%;
          background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%);
          pointer-events: none;
          z-index: 6;
          mix-blend-mode: overlay;
        "></div>

        <!-- Heavy Vignette Shading (James Jani Darkness & Vertigo Tunnel) -->
        <div id="hypnotic-vignette-overlay" style="
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 38%, rgba(0, 0, 0, 0.55) 70%, rgba(0, 0, 0, 0.96) 100%);
          pointer-events: none;
          z-index: 7;
        "></div>

        <!-- Subtle 35mm Analog Film Grain Texture Pass -->
        <div id="hypnotic-film-grain" style="
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0);
          background-size: 4px 4px;
          opacity: 0.25;
          pointer-events: none;
          z-index: 8;
          mix-blend-mode: overlay;
        "></div>
      </div>
    `;
  };

  /**
   * Animation update tick called on every frame by the Magnates Studio animation loop
   */
  window.tplUpdateHypnoticVertigoFrame = function(state, elapsed, now) {
    const rig = document.getElementById('hypnotic-rotator-rig');
    if (!rig) return;

    const cfg = getHypnoticConfig(state);
    const t = typeof elapsed === 'number' ? elapsed : (now ? now / 1000 : 0);

    // 1. Rotation calculation (Pendulum sway or 360 roll)
    let currentAngle = 0;
    if (cfg.mode === 'continuous') {
      // 360-degree continuous hypnotic roll
      const turns = (t / Math.max(cfg.spinSpeed, 1.0)) * 360;
      currentAngle = turns % 360;
    } else {
      // Hypnotic pendulum sway: smooth sine wave tilting from left (-angle) to right (+angle)
      const swayFreq = (Math.PI * 2) / Math.max(cfg.spinSpeed, 1.0);
      currentAngle = Math.sin(t * swayFreq) * cfg.maxTiltAngle;
    }

    // 2. Slow breathing vertigo zoom (Dolly-Zoom sensation)
    const zoomFreq = (Math.PI * 2) / Math.max(cfg.zoomSpeed, 1.0);
    // Smooth sinusoidal breathing between (zoomBase - zoomBreathing) and (zoomBase + zoomBreathing)
    const currentScale = cfg.zoomBase + (Math.sin(t * zoomFreq) * cfg.zoomBreathing);

    // 3. Hypnotic wobble (subtle orbital wobble / dizzying off-center sway)
    let wobbleX = 0;
    let wobbleY = 0;
    if (cfg.hypnoticSpiralWobble) {
      wobbleX = Math.cos(t * 1.8) * cfg.wobbleAmount;
      wobbleY = Math.sin(t * 1.5) * (cfg.wobbleAmount * 0.7);
    }

    // Apply 2.5D transform to rotator rig
    rig.style.transform = `translate(${wobbleX}px, ${wobbleY}px) scale(${currentScale.toFixed(4)}) rotate(${currentAngle.toFixed(3)}deg)`;

    // 4. Update Chromatic Split offsets dynamically based on tilt speed/force
    if (cfg.chromaticAberration) {
      const redChroma = document.getElementById('hypnotic-chroma-red');
      const cyanChroma = document.getElementById('hypnotic-chroma-cyan');
      if (redChroma && cyanChroma) {
        // Displace more as rotation reaches peak angular velocity
        const velocityFactor = Math.abs(Math.cos(t * ((Math.PI * 2) / Math.max(cfg.spinSpeed, 1.0))));
        const currentShift = cfg.chromaticIntensity * (0.6 + velocityFactor * 0.8);
        redChroma.style.filter = `drop-shadow(-${currentShift.toFixed(1)}px 0px 0px rgba(255, 0, 70, 0.7))`;
        cyanChroma.style.filter = `drop-shadow(${currentShift.toFixed(1)}px 0px 0px rgba(0, 235, 255, 0.7))`;
      }
    }

    // 5. Roll CRT phosphor line slowly downwards
    const phosphorBeam = document.getElementById('hypnotic-phosphor-beam');
    if (phosphorBeam) {
      const beamY = ((t * 22) % 115) - 15; // rolls from top to bottom
      phosphorBeam.style.top = `${beamY}%`;
    }

    // 6. Analog film grain gate weave
    const grain = document.getElementById('hypnotic-film-grain');
    if (grain) {
      const grainOffset = (Math.floor(t * 12) * 17) % 100;
      grain.style.backgroundPosition = `${grainOffset}px ${grainOffset}px`;
    }
  };

  /**
   * Helper to render the Hypnotic Vertigo template card on hover previews
   */
  window.renderHypnoticVertigoCard = function(container, state, t) {
    if (!container) return;
    const imgUrl = (state && (state.primaryUrl || state.imageUrl)) || DEFAULT_IMAGE;
    const timeVal = typeof t === 'number' ? t : 0;
    const angle = Math.sin(timeVal * 1.2) * 15;
    const scale = 1.4 + Math.sin(timeVal * 0.9) * 0.15;

    container.innerHTML = `
      <div style="position:relative; width:100%; height:100%; overflow:hidden; background:#000; display:flex; align-items:center; justify-content:center;">
        <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover; transform: scale(${scale}) rotate(${angle}deg); filter: contrast(1.15) saturate(1.1); pointer-events:none;" />
        <div style="position:absolute; inset:0; background:repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1.5px, transparent 1.5px, transparent 3.5px); pointer-events:none;"></div>
        <div style="position:absolute; inset:0; background:radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%); pointer-events:none;"></div>
      </div>
    `;
  };

  /**
   * Expose configuration helper for contextual inspector
   */
  window.getHypnoticDefaultConfig = function() {
    return Object.assign({}, DEFAULT_CONFIG);
  };

})();
