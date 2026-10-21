/**
 * James Jani Dual-Layer Cross-Section Scroll Engine
 * 
 * Signature cinematic storytelling transition:
 * 1. Ambient Floating Dust: Procedural glowing dust particles drifting over the scene.
 * 2. Slow Zoom-Out (The Hold): Camera gently scales down from zoomed-in state, creating suspense.
 * 3. Anticipation Surge: Right before scrolling down, camera subtly pushes in/scales up and recoils upward.
 * 4. Downward Pan / Cross-Section Reveal: Seamless camera pan down across the horizontal seam,
 *    sliding the idyllic top picture away and revealing the dark underworld picture below.
 * 5. Smooth Deceleration: Soft settle onto the bottom image.
 */
(function() {
  'use strict';

  const TEMPLATE_ID = 'jani-cross-section-reveal';

  const DEFAULT_CONFIG = {
    topImageUrl: '/jani_cross_top.png',
    bottomImageUrl: '/jani_cross_bottom.png',
    topCaption: 'THE ILLUSION',
    bottomCaption: 'THE REALITY',
    showCaptions: false,
    
    // Timing (Seconds)
    duration: 6.0,
    holdDuration: 2.2,         // Phase 1: Dust floating + slow zoom out
    anticipationDuration: 0.6, // Phase 2: Micro-zoom in & rise
    scrollDuration: 2.2,       // Phase 3: Seamless scroll down
    settleDuration: 1.0,       // Phase 4: Settle hold on bottom
    
    // Zoom & Motion Calibration
    startZoom: 1.10,           // Initial zoom
    holdEndZoom: 1.02,         // Zoom after slow pull-out
    anticipationZoom: 1.08,    // Punch zoom-in during anticipation
    settleZoom: 1.00,          // Final zoom on bottom image
    anticipationYOffset: -22,  // Upward tension (pixels)
    
    // Dust Particles
    dustEnabled: true,
    dustParticleCount: 45,
    dustSpeed: 1.0,
    dustColor: 'rgba(255, 235, 190, 0.85)',
    
    // Atmosphere & Cross-Section Seam
    seamShadowIntensity: 0.65,
    underworldDarken: 0.15,
    vignetteIntensity: 0.45
  };

  let activeEngineInstance = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function computeCrossSectionState(data, t) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const totalDur = d.duration || 6.0;
    const progressTime = t % (totalDur + 0.6); // loop pacing

    const tHold = d.holdDuration;
    const tAntic = tHold + d.anticipationDuration;
    const tScroll = tAntic + d.scrollDuration;

    let currentScale = 1.0;
    let currentYPercent = 0; // 0 = viewing top scene, -50 = viewing bottom scene
    let extraYOffsetPx = 0;
    let phase = 'hold';

    if (progressTime <= tHold) {
      phase = 'hold';
      const p1 = Math.min(1, Math.max(0, progressTime / tHold));
      const easedP1 = easeOutCubic(p1);
      currentScale = d.startZoom - (d.startZoom - d.holdEndZoom) * easedP1;
      currentYPercent = 0;
      extraYOffsetPx = 0;
    } else if (progressTime <= tAntic) {
      phase = 'anticipation';
      const p2 = Math.min(1, Math.max(0, (progressTime - tHold) / d.anticipationDuration));
      const easedP2 = easeInOutCubic(p2);
      currentScale = d.holdEndZoom + (d.anticipationZoom - d.holdEndZoom) * easedP2;
      extraYOffsetPx = d.anticipationYOffset * Math.sin(easedP2 * Math.PI);
      currentYPercent = 0;
    } else if (progressTime <= tScroll) {
      phase = 'scroll';
      const p3 = Math.min(1, Math.max(0, (progressTime - tAntic) / d.scrollDuration));
      const easedP3 = easeInOutCubic(p3);
      currentScale = d.anticipationZoom - (d.anticipationZoom - d.settleZoom) * easedP3;
      currentYPercent = -50 * easedP3;
      extraYOffsetPx = 0;
    } else {
      phase = 'settle';
      currentScale = d.settleZoom;
      currentYPercent = -50;
      extraYOffsetPx = 0;
    }

    return {
      scale: currentScale,
      yPercent: currentYPercent,
      extraYOffsetPx: extraYOffsetPx,
      phase: phase
    };
  }

  function buildCrossSectionHtml(tplId, data) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const topImg = d.topImageUrl || '/jani_cross_top.png';
    const bottomImg = d.bottomImageUrl || '/jani_cross_bottom.png';

    return `
      <div id="jani-cross-viewport-${tplId}" class="jani-cross-viewport" style="position: absolute; inset: 0; background: #050608; overflow: hidden; display: flex; align-items: center; justify-content: center; user-select: none;">
        <div id="jani-cross-rig-${tplId}" class="jani-cross-rig" style="position: absolute; top: 0; left: 0; width: 100%; height: 200%; transform-origin: center 25%; will-change: transform;">
          
          <!-- Top Scene (The Illusion) -->
          <div id="jani-cross-top-${tplId}" class="jani-scene-top" style="position: absolute; top: 0; left: 0; width: 100%; height: 50%; overflow: hidden; background: #0b0f14;">
            <img src="${topImg}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>

          <!-- Bottom Scene (The Underground Reality) -->
          <div id="jani-cross-bottom-${tplId}" class="jani-scene-bottom" style="position: absolute; top: 50%; left: 0; width: 100%; height: 50%; overflow: hidden; background: #020204;">
            <img src="${bottomImg}" style="width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.92) contrast(1.08);" />
          </div>

          <!-- Cross-Section Dirt / Trench Shadow Seam -->
          <div style="position: absolute; top: 50%; left: 0; width: 100%; height: 48px; transform: translateY(-50%); background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,${d.seamShadowIntensity}) 50%, rgba(0,0,0,0) 100%); pointer-events: none; z-index: 4;"></div>
        </div>

        <!-- Dust Particle Overlay Layer -->
        <canvas id="jani-cross-dust-${tplId}" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; mix-blend-mode: screen;"></canvas>

        <!-- Cinematic Vignette -->
        <div style="position: absolute; inset: 0; pointer-events: none; z-index: 12; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${d.vignetteIntensity}) 100%);"></div>
      </div>
    `;
  }

  function applyCrossSectionStateToDOM(container, tplId, st, data) {
    if (!container) return;
    const rig = container.querySelector(`#jani-cross-rig-${tplId}`) || container.querySelector('.jani-cross-rig');
    if (rig) {
      rig.style.transform = `translate3d(0, calc(${st.yPercent.toFixed(2)}% + ${st.extraYOffsetPx.toFixed(1)}px), 0) scale(${st.scale.toFixed(4)})`;
    }

    // Update images if swapped
    const topImg = container.querySelector(`#jani-cross-top-${tplId} img`);
    if (topImg && data && data.topImageUrl && topImg.getAttribute('src') !== data.topImageUrl) {
      topImg.src = data.topImageUrl;
    }
    const bottomImg = container.querySelector(`#jani-cross-bottom-${tplId} img`);
    if (bottomImg && data && data.bottomImageUrl && bottomImg.getAttribute('src') !== data.bottomImageUrl) {
      bottomImg.src = data.bottomImageUrl;
    }
  }

  class JaniCrossSectionEngine {
    constructor(container, options = {}) {
      this.container = container;
      this.config = Object.assign({}, DEFAULT_CONFIG, options);
      this.animFrameId = null;
      this.startTime = null;
      this.particles = [];
      this.isPlaying = true;
      
      this.container.innerHTML = buildCrossSectionHtml(TEMPLATE_ID, this.config);
      this.dustCanvas = this.container.querySelector(`#jani-cross-dust-${TEMPLATE_ID}`);
      if (this.dustCanvas) {
        this.dustCtx = this.dustCanvas.getContext('2d');
      }

      this.initParticles();
      this.resizeCanvas();
      this.bindControls();
      this.startLoop();
    }

    resizeCanvas() {
      if (!this.dustCanvas) return;
      const rect = this.container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.dustCanvas.width = (rect.width || 800) * dpr;
      this.dustCanvas.height = (rect.height || 450) * dpr;
    }

    initParticles() {
      this.particles = [];
      const count = this.config.dustParticleCount;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2.2 + 0.8,
          speedX: (Math.random() - 0.45) * 0.04 * this.config.dustSpeed,
          speedY: (Math.random() - 0.5) * 0.05 * this.config.dustSpeed,
          opacity: Math.random() * 0.65 + 0.25,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.04 + 0.01
        });
      }
    }

    renderParticles(ctx, w, h) {
      if (!this.config.dustEnabled || !ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.speedX * 0.016;
        p.y += p.speedY * 0.016;
        p.pulse += p.pulseSpeed;

        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;

        const currentOpacity = Math.max(0.1, p.opacity + Math.sin(p.pulse) * 0.2);
        const px = p.x * w;
        const py = p.y * h;

        ctx.beginPath();
        const rad = p.size * (window.devicePixelRatio || 1);
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, rad * 2.5);
        gradient.addColorStop(0, `rgba(255, 240, 205, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(255, 215, 160, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 215, 160, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(px, py, rad * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    startLoop() {
      const step = (timestamp) => {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = (timestamp - this.startTime) / 1000;
        const st = computeCrossSectionState(this.config, elapsed);
        applyCrossSectionStateToDOM(this.container, TEMPLATE_ID, st, this.config);

        if (this.dustCanvas && this.dustCtx) {
          this.renderParticles(this.dustCtx, this.dustCanvas.width, this.dustCanvas.height);
        }

        if (this.isPlaying) {
          this.animFrameId = requestAnimationFrame(step);
        }
      };
      this.animFrameId = requestAnimationFrame(step);
    }

    bindControls() {
      this.resizeHandler = () => this.resizeCanvas();
      window.addEventListener('resize', this.resizeHandler);
    }

    updateConfig(newOptions) {
      Object.assign(this.config, newOptions);
      if (newOptions.dustParticleCount !== undefined) {
        this.initParticles();
      }
      applyCrossSectionStateToDOM(this.container, TEMPLATE_ID, computeCrossSectionState(this.config, 0), this.config);
    }

    destroy() {
      this.isPlaying = false;
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
      this.container.innerHTML = '';
    }
  }

  // Global Mounting Functions for Magnates Studio
  window.tplMountJaniCrossSectionStage = function(stageElement, customData = {}) {
    if (!stageElement) return null;
    if (activeEngineInstance) {
      activeEngineInstance.destroy();
      activeEngineInstance = null;
    }
    activeEngineInstance = new JaniCrossSectionEngine(stageElement, customData);
    return activeEngineInstance;
  };

  window.tplUnmountJaniCrossSectionStage = function() {
    if (activeEngineInstance) {
      activeEngineInstance.destroy();
      activeEngineInstance = null;
    }
  };

  window.tplUpdateJaniCrossSection = function(newData) {
    if (activeEngineInstance) {
      activeEngineInstance.updateConfig(newData);
    }
  };

  window.buildCrossSectionHtml = buildCrossSectionHtml;
  window.stepJaniCrossSectionAnimation = function(container, tplId, manualT, data) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const st = computeCrossSectionState(d, manualT);
    applyCrossSectionStateToDOM(container, tplId, st, d);
  };

  window.JANI_CROSS_SECTION_CONFIG = DEFAULT_CONFIG;
  window.computeCrossSectionState = computeCrossSectionState;

  console.log('[Jani Cross-Section Engine] Initialized James Jani Cross-Section Reveal Engine');
})();
