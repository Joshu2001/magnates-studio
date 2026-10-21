/**
 * Photorealistic 3D Environmental Projection Engine for Tension Decode & Typewriter Kinetic Text
 * (Vox / James Jani / Johnny Harris / Magnates Media Documentary Standard)
 *
 * Overhauls the flat vector canvas into an authentic photorealistic 3D environmental scene matching Image 2:
 * 1. Environmental Surface:
 *    - Dark executive mahogany desk
 *    - Tactical blueprint investigation map with coordinate grid rings and degree markers
 *    - Stacked leaked document clippings with aged deckle edges on the left
 *    - Investigation dossier on top right
 *    - Vintage brass tactical compass on bottom right
 *    - Focused warm overhead spotlight opposing the cold green code
 * 2. Projected Matrix Digital Code:
 *    - Vertical katakana & numeric streams physically projecting onto the 3D surface
 *    - Normal-map warping over stacked paper edges and compass rim
 *    - Bright white/cyan droplet heads with glowing phosphor green fading trails
 * 3. Central Tactical HUD Box & Typewriter Reveal:
 *    - Centered monospace mint green subtitle [ HIGH TENSION REVEAL ]
 *    - Sleek cyan rounded HUD pill (#00f0ff) with horizontal laser flare streaks and dark teal glass interior
 *    - Kinetic typewriter decode with cyber-glyph scrambling and solid blinking cyan block cursor ▌
 * 4. Crisp Peripheral UI:
 *    - Perfectly flat, unskewed 16:9 stage container matching studio viewport
 *    - Single-source Canvas rendering ensuring zero ghosting, zero double text, and razor-sharp clarity
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'kinetic-decode-typewriter';
  const PLATE_URL = '/tactical_desk_hd_plate.png';
  const NORMAL_URL = '/tactical_desk_normal_map.png';

  const MATRIX_GLYPHS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\uff8a\uff90\uff8b\uff70\uff73\uff7c\uff85\uff93\uff86\uff7b\uff9c\uff82\uff75\uff98\uff71\uff8e\uff83\uff8f\uff79\uff92\uff74\uff76\uff77\uff91\uff95\uff97\uff7e\uff88\uff7d\uff80\uff87\uff8d\u65e510\uff66\uff71\uff73\uff74\uff75\uff76\uff77\uff79\uff7a\uff7b\uff7c\uff7d\uff7e\uff7f\uff80\uff82\uff83\uff85\uff86\uff87\uff88\uff8a\uff8b\uff8e\uff8f\uff90\uff91\uff92\uff93\uff94\uff95\uff97\uff98\uff9c!@#$%^&*()_+-=[]{}|;:,.<>?/";
  const SCRAMBLE_GLYPHS = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Cache images & normal map buffer
  const imageCache = new Map();
  let normalMapBuffer = null;
  let normalMapWidth = 0;
  let normalMapHeight = 0;

  function loadImg(url) {
    if (!url) return null;
    let img = imageCache.get(url);
    if (!img) {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      imageCache.set(url, img);
      if (url === NORMAL_URL) {
        img.onload = () => extractNormalBuffer(img);
      }
    }
    return (img.complete && img.naturalWidth) ? img : null;
  }

  // Pre-load assets immediately
  loadImg(PLATE_URL);
  loadImg(NORMAL_URL);

  function extractNormalBuffer(img) {
    try {
      const offCanvas = document.createElement('canvas');
      const w = Math.min(img.naturalWidth || 1920, 960);
      const h = Math.min(img.naturalHeight || 687, 344);
      offCanvas.width = w;
      offCanvas.height = h;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      offCtx.drawImage(img, 0, 0, w, h);
      const idata = offCtx.getImageData(0, 0, w, h);
      normalMapBuffer = idata.data;
      normalMapWidth = w;
      normalMapHeight = h;
    } catch (e) {
      console.warn('[Tactical 3D] Could not extract normal map buffer:', e);
    }
  }

  // Sample surface normal vector (nx, ny, nz) at normalized (u, v) in [0, 1]
  function sampleSurfaceNormal(u, v) {
    if (!normalMapBuffer || !normalMapWidth || !normalMapHeight) {
      return { nx: 0, ny: 0, nz: 1, gradient: 0 };
    }
    const cu = Math.max(0, Math.min(1, u));
    const cv = Math.max(0, Math.min(1, v));
    const x = Math.floor(cu * (normalMapWidth - 1));
    const y = Math.floor(cv * (normalMapHeight - 1));
    const idx = (y * normalMapWidth + x) * 4;

    const r = normalMapBuffer[idx];
    const g = normalMapBuffer[idx + 1];
    const b = normalMapBuffer[idx + 2];

    const nx = (r - 128) / 128.0;
    const ny = (g - 128) / 128.0;
    const nz = b / 255.0;
    const gradient = Math.sqrt(nx * nx + ny * ny);

    return { nx, ny, nz, gradient };
  }

  // Volumetric floating dust particle system
  const DUST_COUNT = 20;
  const dustParticles = [];
  function initDustParticles() {
    dustParticles.length = 0;
    for (let i = 0; i < DUST_COUNT; i++) {
      dustParticles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() * 0.02 + 0.008),
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 2 + 1
      });
    }
  }
  initDustParticles();

  function updateDustParticles(dt) {
    for (let i = 0; i < dustParticles.length; i++) {
      const p = dustParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < 0) p.x += 1;
      if (p.x > 1) p.x -= 1;
      if (p.y > 1) {
        p.y = 0;
        p.x = Math.random();
      }
    }
  }

  /**
   * Helper to draw rounded rectangle paths
   */
  function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /**
   * Main High-Performance Canvas Renderer for 3D Tactical Desk Matrix Projection
   * Used for both live customizer stage, studio timeline playback, and export.
   */
  window.renderTacticalDeskCanvasFrame = function(ctx, width, height, state, elapsed, dt) {
    if (!ctx || !width || !height) return;

    const t = elapsed !== undefined ? elapsed : 0;
    dt = Math.min(0.1, dt || 0.016);
    updateDustParticles(dt);

    const plateImg = loadImg(PLATE_URL);
    loadImg(NORMAL_URL);

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // 1. Subtle Organic Macro Camera Micro-Motion (Natural documentary camera feel)
    const driftX = Math.sin(t * 0.3) * 1.2;
    const driftY = Math.cos(t * 0.25) * 0.8;

    ctx.save();
    ctx.translate(driftX, driftY);

    // 2. Base Environmental Anchor (Executive Mahogany Desk, Blueprint Map, Stacked Documents, Dossier, Brass Compass)
    if (plateImg) {
      ctx.drawImage(plateImg, 0, 0, width, height);
    } else {
      // High-quality dark blueprint gradient fallback while loading
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 10, width * 0.5, height * 0.5, width * 0.7);
      bgGrad.addColorStop(0, '#0c1f2b');
      bgGrad.addColorStop(0.5, '#07121b');
      bgGrad.addColorStop(1, '#02060a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 3. Projected 3D Matrix Digital Rain with Normal-Mapped Surface Warping
    const rainEnabled = state.matrixRainEnabled !== false;
    const baseRainColor = state.matrixRainColor || '#00ff41';
    const rainSpeed = state.matrixRainSpeed || 1.0;
    const colCount = 18; // Elegant, tasteful stream count matching Image 2
    const colWidth = width / colCount;
    const fontSize = Math.max(10, Math.round(height * 0.048));

    if (!state.matrixColumns || state.matrixColumns.length !== colCount) {
      state.matrixColumns = [];
      for (let i = 0; i < colCount; i++) {
        state.matrixColumns.push({
          y: Math.random() * -height * 0.8,
          speed: (Math.random() * 0.55 + 0.55) * rainSpeed,
          length: Math.floor(Math.random() * 8 + 6),
          baseX: (i + 0.5) * colWidth + (Math.random() - 0.5) * (colWidth * 0.4)
        });
      }
    }

    if (rainEnabled) {
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < colCount; i++) {
        const col = state.matrixColumns[i];
        const baseX = col.baseX;

        // Step drops
        col.y += fontSize * col.speed * (dt * 30);
        if (col.y > height + 80) {
          col.y = Math.random() * -100;
          col.speed = (Math.random() * 0.55 + 0.55) * rainSpeed;
        }

        // Draw trail of characters
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - (j * fontSize);
          if (charY < -15 || charY > height + 15) continue;

          const normU = Math.max(0, Math.min(1, baseX / width));
          const normV = Math.max(0, Math.min(1, charY / height));
          const normal = sampleSurfaceNormal(normU, normV);

          // Normal Map Warping across stacked paper edges and compass
          const warpX = baseX + normal.nx * 6.0;
          const warpY = charY + normal.ny * 4.0;

          const glyphIdx = Math.floor((Math.abs(Math.sin(i * 17 + j * 9 + t * 3.5)) * MATRIX_GLYPHS.length)) % MATRIX_GLYPHS.length;
          const char = MATRIX_GLYPHS[glyphIdx];

          if (j === 0) {
            // Bright leading droplet head
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f0ff';
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.95;
            ctx.fillText(char, warpX, warpY);
          } else {
            // Phosphor fading trail
            const trailAlpha = Math.max(0.06, 0.75 * (1.0 - (j / col.length)));
            ctx.shadowBlur = j < 3 ? 6 : 2;
            ctx.shadowColor = baseRainColor;
            ctx.fillStyle = (j === 1) ? '#a7f3d0' : baseRainColor;
            ctx.globalAlpha = trailAlpha;
            ctx.fillText(char, warpX, warpY);
          }
        }
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    }

    // 4. Floating Volumetric Dust Particles caught in projection light
    for (let i = 0; i < dustParticles.length; i++) {
      const p = dustParticles[i];
      const px = p.x * width;
      const py = p.y * height;
      const pAlpha = p.alpha * (0.6 + Math.sin(t * p.pulseSpeed) * 0.4);

      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.fillStyle = `rgba(220, 252, 231, ${pAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size * p.z, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Central Kinetic HUD Box & Typewriter Reveal
    const isTextShowing = state.textVisible !== false;
    if (isTextShowing) {
      renderCentralHUD(ctx, width, height, state, t);
    }

    // 6. Subtle Optical Lens Vignette
    const vigGrad = ctx.createRadialGradient(width * 0.5, height * 0.48, width * 0.35, width * 0.5, height * 0.48, width * 0.68);
    vigGrad.addColorStop(0, 'transparent');
    vigGrad.addColorStop(0.7, 'rgba(2, 5, 8, 0.25)');
    vigGrad.addColorStop(1.0, 'rgba(1, 3, 5, 0.65)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore(); // Restore camera drift
    ctx.restore(); // Restore root context
  };

  /**
   * Renders the Central Tactical Cyan HUD Box and Slam Typewriter Text
   * Pixel-perfect match to Image 2
   */
  function renderCentralHUD(ctx, width, height, state, t) {
    const targetWord = (state.mainText || 'THE ILLUSION OF CHOICE').trim();
    const subtitleText = (state.subText || '[ HIGH TENSION REVEAL ]').trim().toUpperCase();
    const hudColor = state.textColor || '#00f0ff'; // Vibrant cyan

    const typeSpeed = state.matrixTypeSpeed || 1.0;
    const progress = Math.min(1.0, (t * 0.8 * typeSpeed) % 1.25);
    const charsRevealed = Math.floor(progress * targetWord.length);

    let displayed = targetWord.substring(0, charsRevealed);
    if (charsRevealed < targetWord.length) {
      const scramIdx = Math.floor((t * 55) % SCRAMBLE_GLYPHS.length);
      displayed += SCRAMBLE_GLYPHS[scramIdx];
    }

    const centerX = width * 0.5;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // A. Subtitle above HUD box [ HIGH TENSION REVEAL ]
    // In Image 2 (696x249 coordinates): subtitle is at y = 107px (height * 0.430)
    const subY = height * 0.430;
    const subFontSize = Math.max(10, Math.round(height * 0.046));
    ctx.font = `800 ${subFontSize}px "Courier New", Courier, monospace`;
    ctx.fillStyle = '#a7f3d0';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(0, 255, 65, 0.65)';
    ctx.fillText(subtitleText, centerX, subY);

    // B. Inside the HUD Box: Typewriter text & Cyan Terminal Cursor
    // In Image 2 (696x249 coordinates): box center is at y = 133px (height * 0.534), box height is 36px (height * 0.145)
    const boxCenterY = height * 0.534;
    const mainFontSize = Math.max(13, Math.round(height * 0.068));
    ctx.font = `900 ${mainFontSize}px "Courier New", Courier, monospace`;

    const textMetrics = ctx.measureText(targetWord);
    const standardBoxW = width * 0.312; // 217px in 696px width (authentic plate box)
    const neededBoxW = textMetrics.width + 36;

    // If custom text exceeds standard plate box, dynamically draw expanded cyan glowing pill
    if (neededBoxW > standardBoxW) {
      const expBoxW = neededBoxW;
      const expBoxH = Math.round(height * 0.148);
      const expBoxX = centerX - expBoxW / 2;
      const expBoxY = boxCenterY - expBoxH / 2;
      const r = 6;

      ctx.save();
      // Translucent dark teal glass interior
      ctx.fillStyle = 'rgba(6, 30, 40, 0.88)';
      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      roundRect(ctx, expBoxX, expBoxY, expBoxW, expBoxH, r);
      ctx.fill();

      // Glowing Cyan Border
      ctx.strokeStyle = hudColor;
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 14;
      ctx.shadowColor = hudColor;
      roundRect(ctx, expBoxX, expBoxY, expBoxW, expBoxH, r);
      ctx.stroke();

      // Horizontal Laser Flare Streaks
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(expBoxX, boxCenterY);
      ctx.lineTo(expBoxX - 25, boxCenterY);
      ctx.moveTo(expBoxX + expBoxW, boxCenterY);
      ctx.lineTo(expBoxX + expBoxW + 25, boxCenterY);
      ctx.stroke();
      ctx.restore();
    }

    // Render Typewriter Text
    ctx.save();
    ctx.font = `900 ${mainFontSize}px "Courier New", Courier, monospace`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = hudColor;

    // Shift text slightly left to accommodate the terminal cursor
    const cursorW = Math.max(5, Math.round(height * 0.024));
    const cursorH = Math.max(14, Math.round(height * 0.072));
    const cursorGap = 4;
    const curDispMetrics = ctx.measureText(displayed);
    const totalContentW = curDispMetrics.width + cursorGap + cursorW;
    const startX = centerX - (totalContentW / 2);

    ctx.textAlign = 'left';
    ctx.fillText(displayed, startX, boxCenterY + 1);

    // Blinking Cyan Terminal Block Cursor ▌
    const isCursorBlink = Math.floor(t * 4.5) % 2 === 0;
    if (isCursorBlink) {
      const curX = startX + curDispMetrics.width + cursorGap;
      const curY = boxCenterY - (cursorH / 2) + 1;
      ctx.fillStyle = hudColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = hudColor;
      ctx.fillRect(curX, curY, cursorW, cursorH);
    }
    ctx.restore();

    ctx.restore();
  }

  /**
   * Mounts the 3D Tactical Environmental Stage into the Customizer Modal
   * Clean, perfectly flush and unskewed viewport matching Image 2
   */
  window.tplMountTacticalDecode3DStage = function(stage, state) {
    if (!stage) return;

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #030508; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: crosshair;">
        <canvas id="customizer-live-matrix-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; display: block;"></canvas>
      </div>
    `;

    const canvas = stage.querySelector('#customizer-live-matrix-canvas');
    if (canvas) {
      canvas.width = canvas.clientWidth || 696;
      canvas.height = canvas.clientHeight || 249;
      const ctx = canvas.getContext('2d');
      window.renderTacticalDeskCanvasFrame(ctx, canvas.width, canvas.height, state, 0, 0.016);
    }
  };

  /**
   * Live animation loop tick called on every animation frame in the customizer
   */
  window.tplUpdateTacticalDecode3DFrame = function(state, elapsed, now) {
    const canvas = document.getElementById('customizer-live-matrix-canvas');
    if (!canvas) return;

    if (!canvas._initialized || canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth || 696;
      canvas.height = canvas.clientHeight || 249;
      canvas._initialized = true;
    }

    const ctx = canvas.getContext('2d');
    const dt = (now - (state._lastTacticalNow || now)) / 1000;
    state._lastTacticalNow = now;

    // Render full photorealistic 3D environmental scene onto the canvas with zero ghosting
    window.renderTacticalDeskCanvasFrame(ctx, canvas.width, canvas.height, state, elapsed, Math.min(0.1, dt || 0.016));
  };

  console.log('[Tactical Decode 3D Engine] Initialized Clean 3D Environmental Projection Engine matching Image 2');
})();
