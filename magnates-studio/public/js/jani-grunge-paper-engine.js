/**
 * James Jani Signature Grunge Text & Paper Texture 3D Engine
 * 
 * Replaces synthetic 2D screen-shake with:
 * 1. 12fps (or 8fps) Stop-Motion Posterize Time Cadence
 * 2. Organic Film Gate Weave: discrete per-frame random offsets
 *    - Rotation: -0.7° to +0.7°
 *    - Scale: 100% to 102%
 *    - Position: discrete random 2px to 4px step jump per frame
 * 3. Photorealistic Tactile Manila / Kraft Folder Plate & Archival Newsprint
 * 4. SVG Paper-Fiber Displacement Mapping & Letterpress Deboss Typography
 * 5. 16mm/35mm High-Contrast Film Grain Pass (shifts at 12fps)
 * 6. Dynamic Sweeping Light Leaks & 20% Vignette Radial Mask
 * 7. Volumetric Floating Dust Motes Simulation
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'text-texturing-grunge';
  const DEFAULT_PLATE = '/jani_clean_kraft_plate_hd.png';
  const ARCHIVAL_NEWS_URL = '/paper_tear_stock_archival_news.jpg';

  // Deterministic pseudo-random hash for per-frame reproducible organic weave
  function pseudoRandom(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function getStopMotionWeave(frameIdx) {
    const r1 = pseudoRandom(frameIdx * 3.71 + 1.13);
    const r2 = pseudoRandom(frameIdx * 5.39 + 2.77);
    const r3 = pseudoRandom(frameIdx * 7.19 + 4.31);
    const r4 = pseudoRandom(frameIdx * 11.33 + 6.97);

    // Rotation: -0.7° to +0.7°
    const rot = (r1 - 0.5) * 1.4;

    // Scale: 100% to 102%
    const scale = 1.00 + r2 * 0.02;

    // Position: Random 2px to 4px step jump per frame
    const signX = r3 > 0.5 ? 1 : -1;
    const magX = 2.0 + (r3 * 4.0) % 2.0;
    const posX = signX * magX;

    const signY = r4 > 0.5 ? 1 : -1;
    const magY = 2.0 + (r4 * 4.0) % 2.0;
    const posY = signY * magY;

    // 35mm projector gate flicker: subtle ±2% micro-flicker
    const flicker = 0.98 + (pseudoRandom(frameIdx * 13.7) * 0.04);

    return { rot, scale, posX, posY, flicker };
  }

  // Generate 16mm/35mm high-contrast procedural film grain texture
  const grainCache = [];
  const GRAIN_SIZE = 256;
  function initGrainTiles() {
    if (grainCache.length > 0) return;
    for (let t = 0; t < 6; t++) {
      const c = document.createElement('canvas');
      c.width = GRAIN_SIZE;
      c.height = GRAIN_SIZE;
      const ctx = c.getContext('2d');
      const imgData = ctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        // High-contrast silver halide film grain noise
        const n = Math.random();
        const v = n > 0.82 ? Math.floor(210 + Math.random() * 45) : (n < 0.18 ? Math.floor(Math.random() * 50) : Math.floor(115 + Math.random() * 25));
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = Math.floor(18 + Math.random() * 32);
      }
      ctx.putImageData(imgData, 0, 0);
      grainCache.push(c);
    }
  }

  // Pre-generate grain tiles
  initGrainTiles();

  /**
   * Format title with smart quotes if not already enclosed
   */
  function formatTitleText(raw) {
    if (!raw) return '“POWER & GREED”';
    let trimmed = raw.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith('“') && trimmed.endsWith('”'))) {
      return trimmed;
    }
    return `“${trimmed}”`;
  }

  /**
   * Mount the HTML DOM Stage for James Jani Grunge Text & Paper Texture
   */
  window.tplMountJaniGrungePaperStage = function(stage, state) {
    if (!stage) return;

    initGrainTiles();

    const plateUrl = state.primaryUrl && !state.primaryUrl.includes('unsplash') 
      ? state.primaryUrl 
      : DEFAULT_PLATE;
    
    const mainTitleRaw = state.mainText || 'POWER & GREED';
    const mainTitleFormatted = formatTitleText(mainTitleRaw);
    const subtitle = state.subText || 'CHAPTER IV: THE MANIPULATION';

    // Warm colors matching Image 2
    let titleColor = state.titleColor || state.textColor || '#d4af37';
    if (titleColor.toLowerCase() === '#c084fc') titleColor = '#d4af37';
    let subColor = state.textColor || '#c59b4c';
    if (subColor.toLowerCase() === '#c084fc' || subColor.toLowerCase() === '#a855f7') subColor = '#c59b4c';

    const fontFam = state.fontFamily || "'Cinzel Decorative', 'Cinzel', 'Playfair Display', 'Cormorant Garamond', Georgia, serif";
    const isTextShowing = state.textVisible !== false;

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #0c0a07; overflow: hidden; display: flex; align-items: center; justify-content: center; user-select: none;">
        
        <!-- SVG Filter Definitions for Tactile Paper-Fiber Displacement -->
        <svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
          <defs>
            <filter id="jani-paper-fiber-disp" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence id="jani-fiber-turb" type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="3" seed="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation="0.25" result="softened" />
              <feMerge>
                <feMergeNode in="softened" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <!-- Outer Camera & Gate Weave Rig (Updates only at 12fps) -->
        <div id="jani-stopmotion-rig" style="position: absolute; inset: -4% -4%; width: 108%; height: 108%; transform-origin: 50% 50%; pointer-events: none; transform: translate3d(0, 0, 0) rotate(0deg) scale(1.0);">
          
          <!-- Layer 1: Photorealistic Manila / Kraft Folder Plate & Archival Newsprint -->
          <img id="jani-live-plate" src="${plateUrl}" alt="Aged Paper Backdrop" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(100%) contrast(105%);" />

          <!-- Layer 2: Tactile Letterpress Typography & Accent Rules -->
          <div id="jani-live-typography-plate" style="position: absolute; inset: 0; display: ${isTextShowing ? 'flex' : 'none'}; flex-direction: column; align-items: center; justify-content: center; z-index: 5; padding: 20px 40px; transform: translateZ(0);">
            
            <!-- Main Title with Letterpress Deboss & SVG Paper-Fiber Displacement -->
            <h2 id="jani-live-main-title" style="
              font-family: ${fontFam};
              font-size: 34px;
              font-weight: 900;
              letter-spacing: 5px;
              color: ${titleColor};
              margin: 0 0 6px 0;
              text-transform: uppercase;
              text-align: center;
              mix-blend-mode: multiply;
              opacity: 0.90;
              filter: url(#jani-paper-fiber-disp);
              text-shadow: 0 1px 1px rgba(255, 248, 220, 0.45), 0 -1px 2px rgba(35, 20, 8, 0.75), 0 2px 4px rgba(0, 0, 0, 0.40);
              line-height: 1.15;
            ">
              ${mainTitleFormatted}
            </h2>

            <!-- Subtitle Track with Flanking Delicate Accent Divider Rules -->
            <div id="jani-live-subtitle-wrap" style="display: inline-flex; align-items: center; justify-content: center; gap: 14px; margin-top: 4px; width: 100%; max-width: 520px;">
              <div id="jani-rule-left" class="jani-accent-rule-left" style="flex: 1; max-width: 90px; height: 1px; background: linear-gradient(to right, transparent, rgba(197, 155, 76, 0.85));"></div>
              <span id="jani-live-subtitle" style="
                font-family: 'Cinzel', 'Cormorant Garamond', Georgia, serif;
                font-size: 11.5px;
                font-weight: 700;
                letter-spacing: 3.5px;
                color: ${subColor};
                text-transform: uppercase;
                text-align: center;
                mix-blend-mode: multiply;
                opacity: 0.88;
                text-shadow: 0 1px 1px rgba(255, 250, 230, 0.35), 0 -1px 1px rgba(30, 18, 5, 0.6);
                white-space: nowrap;
              ">
                ${subtitle}
              </span>
              <div id="jani-rule-right" class="jani-accent-rule-right" style="flex: 1; max-width: 90px; height: 1px; background: linear-gradient(to left, transparent, rgba(197, 155, 76, 0.85));"></div>
            </div>
          </div>

          <!-- Layer 3: Warm Directional Lens Flare & Sweeping Dynamic Light Leaks -->
          <div id="jani-light-leak-top" style="position: absolute; top: -10%; left: 15%; width: 70%; height: 60%; background: radial-gradient(ellipse at 50% 10%, rgba(255, 235, 175, 0.28) 0%, rgba(245, 180, 80, 0.12) 45%, transparent 75%); mix-blend-mode: screen; pointer-events: none; z-index: 6;"></div>
          <div id="jani-light-leak-side" style="position: absolute; top: 0; right: 0; width: 45%; height: 50%; background: radial-gradient(circle at 90% 10%, rgba(255, 210, 130, 0.22) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 80%); mix-blend-mode: screen; pointer-events: none; z-index: 6;"></div>

          <!-- Layer 4: 16mm/35mm Film Grain Canvas (Refreshed at 12fps) -->
          <canvas id="jani-film-grain-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; mix-blend-mode: overlay; opacity: 0.24; pointer-events: none; z-index: 7;"></canvas>

          <!-- Layer 5: Atmospheric 20% Vignette Radial Mask -->
          <div id="jani-vignette-overlay" style="position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 48%, transparent 48%, rgba(24, 16, 8, 0.38) 78%, rgba(4, 2, 1, 0.82) 100%); pointer-events: none; z-index: 8;"></div>

        </div>

        <!-- Layer 6: Volumetric Dust Particles Canvas (Catching overhead light beam) -->
        <canvas id="customizer-dust-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; display: ${state.enableDustParticles !== false ? 'block' : 'none'};"></canvas>

      </div>
    `;

    // Ensure grain canvas size matches
    const grainCanvas = stage.querySelector('#jani-film-grain-canvas');
    if (grainCanvas) {
      grainCanvas.width = grainCanvas.clientWidth || 696;
      grainCanvas.height = grainCanvas.clientHeight || 250;
      updateFilmGrain(grainCanvas, 0);
    }
  };

  /**
   * Draw film grain pattern on grain canvas
   */
  function updateFilmGrain(canvas, frameIdx) {
    if (!canvas || grainCache.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const tile = grainCache[frameIdx % grainCache.length];
    const pattern = ctx.createPattern(tile, 'repeat');
    if (pattern) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * Live animation frame tick for James Jani Grunge Text & Paper Texture
   * Called on every animation frame by the customizer modal loop
   */
  window.tplUpdateJaniGrungePaperFrame = function(state, elapsed, now) {
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (!stage) return;

    // Posterize Time: force animation updates to 12fps (or 8fps)
    const fps = state.stopMotionFps || 12;
    const currentFrame = Math.floor(elapsed * fps);

    const rig = document.getElementById('jani-stopmotion-rig');
    const plate = document.getElementById('jani-live-plate');
    const turb = document.getElementById('jani-fiber-turb');
    const grainCanvas = document.getElementById('jani-film-grain-canvas');

    if (currentFrame !== state._lastStopMotionFrame) {
      state._lastStopMotionFrame = currentFrame;

      // James Jani Cinematic Macro Push & Atmospheric Drift (Zero Shaking)
      const macroZoom = 1.00 + (Math.sin(elapsed * 0.45) * 0.5 + 0.5) * 0.04;
      const driftX = Math.sin(elapsed * 0.3) * 0.8;
      const driftY = Math.cos(elapsed * 0.25) * 0.5;

      if (rig) {
        rig.style.transform = `translate3d(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px, 0) scale(${macroZoom.toFixed(4)})`;
      }

      // 2. 35mm projector gate flicker: subtle ±2% brightness variation
      if (plate) {
        plate.style.filter = `brightness(${(weave.flicker * 100).toFixed(1)}%) contrast(106%)`;
      }

      // 3. Shift SVG paper-fiber displacement noise seed
      if (turb) {
        turb.setAttribute('seed', ((currentFrame % 14) + 1).toString());
      }

      // 4. Update Film Grain pattern at 12fps
      if (grainCanvas) {
        if (grainCanvas.width !== grainCanvas.clientWidth || grainCanvas.height !== grainCanvas.clientHeight) {
          grainCanvas.width = grainCanvas.clientWidth || 696;
          grainCanvas.height = grainCanvas.clientHeight || 250;
        }
        updateFilmGrain(grainCanvas, currentFrame);
      }

      // 5. Dynamic light leak pulse / sweep
      const leakTop = document.getElementById('jani-light-leak-top');
      if (leakTop) {
        const sweepX = Math.sin(elapsed * 0.7) * 16;
        const opacity = 0.22 + Math.sin(elapsed * 1.1) * 0.08;
        leakTop.style.transform = `translateX(${sweepX.toFixed(1)}px)`;
        leakTop.style.opacity = opacity.toFixed(2);
      }
    }

    // Dynamic background plate update if user replaces asset
    if (plate) {
      const currentSrc = state.primaryUrl && !state.primaryUrl.includes('unsplash') 
        ? state.primaryUrl 
        : DEFAULT_PLATE;
      if (!plate.src.endsWith(currentSrc) && plate.src !== currentSrc) {
        plate.src = currentSrc;
      }
    }

    // Dynamic typography visibility toggle
    const typoPlate = document.getElementById('jani-live-typography-plate');
    if (typoPlate) {
      const isVisible = state.textVisible !== false;
      const targetDisplay = isVisible ? 'flex' : 'none';
      if (typoPlate.style.display !== targetDisplay) {
        typoPlate.style.display = targetDisplay;
      }
    }

    // Dynamic text sync from state if user types in inspector
    const titleEl = document.getElementById('jani-live-main-title');
    if (titleEl) {
      const formatted = formatTitleText(state.mainText || 'POWER & GREED');
      if (titleEl.textContent !== formatted) {
        titleEl.textContent = formatted;
      }
      let titleColor = state.titleColor || state.textColor || '#d4af37';
      if (titleColor.toLowerCase() === '#c084fc') titleColor = '#d4af37';
      if (titleEl.style.color !== titleColor) {
        titleEl.style.color = titleColor;
      }
      if (state.fontFamily && titleEl.style.fontFamily !== state.fontFamily) {
        titleEl.style.fontFamily = state.fontFamily;
      }
    }

    const subEl = document.getElementById('jani-live-subtitle');
    if (subEl) {
      const subText = state.subText || 'CHAPTER IV: THE MANIPULATION';
      if (subEl.textContent !== subText) {
        subEl.textContent = subText;
      }
      let subColor = state.textColor || '#c59b4c';
      if (subColor.toLowerCase() === '#c084fc' || subColor.toLowerCase() === '#a855f7') subColor = '#c59b4c';
      if (subEl.style.color !== subColor) {
        subEl.style.color = subColor;
        const ruleL = document.getElementById('jani-rule-left');
        const ruleR = document.getElementById('jani-rule-right');
        if (ruleL) ruleL.style.background = `linear-gradient(to right, transparent, ${subColor})`;
        if (ruleR) ruleR.style.background = `linear-gradient(to left, transparent, ${subColor})`;
      }
    }

    // Atmospheric Dust / Snow / Stars particles simulation tick
    if (state.enableDustParticles && typeof window.renderCustomizerDustSimulation === 'function') {
      window.renderCustomizerDustSimulation();
    }
  };

  /**
   * Helper to render the James Jani Chapter Card in hover cards or external previews
   */
  window.renderJaniGrungePaperCard = function(container, state, t) {
    if (!container) return;
    const plateUrl = state?.primaryUrl || DEFAULT_PLATE;
    const mainTitle = formatTitleText(state?.mainText || 'POWER & GREED');
    const subtitle = state?.subText || 'CHAPTER IV: THE MANIPULATION';
    const macroZoom = 1.00 + (Math.sin((t || 0) * 0.8) * 0.5 + 0.5) * 0.038;
    const driftX = Math.sin((t || 0) * 0.5) * 0.6;
    const driftY = Math.cos((t || 0) * 0.4) * 0.4;
    const sweepX = Math.sin((t || 0) * 1.2) * 14;

    container.innerHTML = `
      <div style="position: absolute; inset: 0; background: #0c0a07; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -4%; width: 108%; height: 108%; transform: translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0) scale(${macroZoom.toFixed(4)});">
          <img src="${plateUrl}" alt="Aged Paper" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(100%) contrast(106%);" />
          <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; padding: 12px;">
            <h3 style="font-family: 'Cinzel Decorative', 'Cinzel', Georgia, serif; font-size: 22px; font-weight: 900; letter-spacing: 4px; color: ${state?.titleColor || '#d4af37'}; margin: 0; text-transform: uppercase; mix-blend-mode: multiply; opacity: 0.90; text-shadow: 0 1px 1px rgba(255,248,220,0.4), 0 -1px 2px rgba(35,20,8,0.7);">
              ${mainTitle}
            </h3>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px;">
              <div style="width: 35px; height: 1px; background: linear-gradient(to right, transparent, rgba(197, 155, 76, 0.85));"></div>
              <span style="font-family: 'Cinzel', Georgia, serif; font-size: 8.5px; font-weight: 700; letter-spacing: 2.5px; color: ${state?.textColor || '#c59b4c'}; text-transform: uppercase; mix-blend-mode: multiply; opacity: 0.88;">
                ${subtitle}
              </span>
              <div style="width: 35px; height: 1px; background: linear-gradient(to left, transparent, rgba(197, 155, 76, 0.85));"></div>
            </div>
          </div>
          <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 48%, transparent 48%, rgba(24, 16, 8, 0.38) 78%, rgba(4, 2, 1, 0.82) 100%); pointer-events: none;"></div>
          <div style="position: absolute; top: -10%; left: 15%; width: 70%; height: 60%; background: radial-gradient(ellipse at 50% 10%, rgba(255, 235, 175, 0.25) 0%, transparent 70%); mix-blend-mode: screen; pointer-events: none; transform: translateX(${sweepX.toFixed(1)}px);"></div>
        </div>
      </div>
    `;
  };

  console.log('[James Jani Grunge Paper Engine] Initialized 12fps Stop-Motion & Displacement Engine');
})();
