/**
 * Photorealistic 3D Environmental Projection Engine for Tension Decode & Typewriter Kinetic Text
 * (Vox / James Jani / Johnny Harris / Magnates Media Documentary Standard)
 *
 * Overhauls the flat 2D vector canvas into a close-up 3D environmental projection:
 * 1. Material Shaders & Environmental Anchor:
 *    - Photorealistic environmental texture: /tactical_desk_hd_plate.png
 *      (Dark mahogany executive desk, tactical blueprint investigation map with coordinate grid lines,
 *       stacked leaked document clippings on the left, dossier top right, vintage brass tactical compass)
 *    - Real-time Normal Mapping: /tactical_desk_normal_map.png
 *      (Matrix code streams physically warp, curve, and break over stacked paper edges, folds, fine print & compass rim)
 *    - Edge Specular Glints & Light Bleed:
 *      (High-gradient paper deckle edges catch bright phosphor green and white specular glints)
 * 2. 3D Spatial Rig & Camera:
 *    - Intimate close-up framing (55%-70% viewport width)
 *    - 25°-35° spatial tilt across X and Y axes with slow subtle macro camera pan
 *    - 3D floating cyber HUD box with glowing cyan border, corner brackets, and cyan specular reflection onto map
 * 3. Typographic Slam & Micro Screen-Shake:
 *    - Individual typewriter letters scramble through cyber glyphs and slam onto paper artifacts
 *    - Micro-shake physical impulses trigger on character resolve
 * 4. Optics & Cinematic Pass:
 *    - Warm focused overhead spotlight with rich directional ambient occlusion opposing the cold green code
 *    - Natural f/2.8 shallow depth of field (tack-sharp active typewriter line, bokeh blur on peripheral papers)
 *    - Volumetric particle drift (30 dust motes caught in the projection beam)
 *    - Analog chromatic aberration & subtle CRT scanline shimmer
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
      const h = Math.min(img.naturalHeight || 690, 345);
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

  // Screen-shake physics engine state
  let shakeEnergy = 0;
  let lastCharsCount = -1;
  let shakeImpulseX = 0;
  let shakeImpulseY = 0;

  function triggerTypingSlamImpulse() {
    shakeEnergy = 3.2; // pixels of physical impact
  }

  function updateShakePhysics(dt) {
    if (shakeEnergy > 0.05) {
      shakeImpulseX = (Math.random() - 0.5) * shakeEnergy * 1.5;
      shakeImpulseY = (Math.random() - 0.5) * shakeEnergy * 1.2;
      shakeEnergy *= Math.max(0.01, 1.0 - (dt * 12.0)); // Rapid exponential damping
    } else {
      shakeEnergy = 0;
      shakeImpulseX = 0;
      shakeImpulseY = 0;
    }
  }

  // Volumetric floating dust particle system
  const DUST_COUNT = 32;
  const dustParticles = [];
  function initDustParticles() {
    dustParticles.length = 0;
    for (let i = 0; i < DUST_COUNT; i++) {
      dustParticles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.8 + 0.2, // depth factor
        vx: (Math.random() - 0.5) * 0.025,
        vy: (Math.random() * 0.03 + 0.01),
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.5 + 0.25,
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
   * Main High-Performance Canvas Renderer for 3D Tactical Desk Matrix Projection
   * Used for both live customizer stage, studio timeline playback, and export.
   */
  window.renderTacticalDeskCanvasFrame = function(ctx, width, height, state, elapsed, dt) {
    if (!ctx || !width || !height) return;

    const t = elapsed !== undefined ? elapsed : 0;
    dt = Math.min(0.1, dt || 0.016);
    updateShakePhysics(dt);
    updateDustParticles(dt);

    const plateImg = loadImg(PLATE_URL);
    loadImg(NORMAL_URL); // Ensure normal map is loaded

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // 1. Slow Macro Camera Drift & 3D Spatial Rig Projection
    const driftX = Math.sin(t * 0.4) * 5.0 + shakeImpulseX;
    const driftY = Math.cos(t * 0.3) * 3.0 + shakeImpulseY;
    const zoomScale = 1.05 + Math.sin(t * 0.2) * 0.015;

    ctx.save();
    ctx.translate(width / 2 + driftX, height / 2 + driftY);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-width / 2, -height / 2);

    // 2. Base Environmental Anchor (Desk, Blueprint Map, Leaked Documents, Compass)
    if (plateImg) {
      ctx.drawImage(plateImg, 0, 0, width, height);
    } else {
      // Photorealistic fallback gradient with blueprint grid if image still loading
      const bgGrad = ctx.createRadialGradient(width * 0.48, height * 0.35, 10, width * 0.5, height * 0.5, width * 0.7);
      bgGrad.addColorStop(0, '#0d1821');
      bgGrad.addColorStop(0.5, '#080d14');
      bgGrad.addColorStop(1, '#030508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 3. Directed Warm Overhead Spotlight (opposing the cold green code)
    const spotX = width * 0.5 + Math.sin(t * 0.2) * 8;
    const spotY = height * 0.32;
    const spotRadius = Math.max(width, height) * 0.65;
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 20, spotX, spotY, spotRadius);
    spotGrad.addColorStop(0, 'rgba(255, 245, 220, 0.22)');
    spotGrad.addColorStop(0.35, 'rgba(255, 235, 190, 0.08)');
    spotGrad.addColorStop(0.7, 'rgba(10, 16, 26, 0.45)');
    spotGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.82)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, width, height);

    // 4. Projected 3D Matrix Digital Rain with Normal-Mapped Physics
    const rainEnabled = state.matrixRainEnabled !== false;
    const baseRainColor = state.matrixRainColor || '#00ff41';
    const rainSpeed = state.matrixRainSpeed || 1.0;
    const fontSize = Math.max(11, state.matrixRainDensity || 16);
    const colCount = Math.floor(width / fontSize);

    if (!state.matrixColumns || state.matrixColumns.length !== colCount) {
      state.matrixColumns = [];
      for (let i = 0; i < colCount; i++) {
        state.matrixColumns.push({
          y: Math.random() * -120,
          speed: (Math.random() * 0.65 + 0.65) * rainSpeed,
          length: Math.floor(Math.random() * 12 + 10)
        });
      }
    }

    if (rainEnabled) {
      // Diffuse ambient green reflection pass onto underlying desk
      const glowGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 40, width * 0.5, height * 0.5, width * 0.45);
      glowGrad.addColorStop(0, 'rgba(0, 255, 65, 0.12)');
      glowGrad.addColorStop(0.6, 'rgba(0, 255, 65, 0.03)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < colCount; i++) {
        const col = state.matrixColumns[i];
        const baseX = i * fontSize + (fontSize / 2);

        // Step drops
        col.y += fontSize * col.speed * (dt * 45);
        if (col.y > height + 100 && Math.random() > 0.93) {
          col.y = Math.random() * -80;
          col.speed = (Math.random() * 0.65 + 0.65) * rainSpeed;
        }

        // Draw trail of characters
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - (j * fontSize);
          if (charY < -20 || charY > height + 20) continue;

          const normU = baseX / width;
          const normV = charY / height;
          const normal = sampleSurfaceNormal(normU, normV);

          // Normal Map Warping: characters deflect and bend across paper edges and compass
          const warpX = baseX + normal.nx * 7.5;
          const warpY = charY + normal.ny * 5.0;

          // Pick character
          const glyphIdx = Math.floor((Math.abs(Math.sin(i * 13 + j * 7 + t * 4)) * MATRIX_GLYPHS.length)) % MATRIX_GLYPHS.length;
          const char = MATRIX_GLYPHS[glyphIdx];

          // Leading droplet head (Bright White/Cyan with intense phosphor glow)
          if (j === 0) {
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#00ff41';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(char, warpX, warpY);

            // Specular glint on paper borders / compass rim
            if (normal.gradient > 0.18) {
              ctx.shadowBlur = 22;
              ctx.shadowColor = '#38bdf8';
              ctx.fillStyle = '#f0fdf4';
              ctx.fillText(char, warpX, warpY);
            }
          } else {
            // Trailing phosphor fade
            const alpha = Math.max(0.08, 1.0 - (j / col.length));
            ctx.shadowBlur = j < 3 ? 10 : 4;
            ctx.shadowColor = baseRainColor;
            ctx.fillStyle = (j === 1) ? '#a7f3d0' : baseRainColor;
            ctx.globalAlpha = alpha * 0.9;
            ctx.fillText(char, warpX, warpY);
            ctx.globalAlpha = 1.0;
          }
        }
      }
    }

    // 5. Volumetric Dust Particles caught in projection light beam
    for (let i = 0; i < dustParticles.length; i++) {
      const p = dustParticles[i];
      const px = p.x * width;
      const py = p.y * height;
      const pAlpha = p.alpha * (0.6 + Math.sin(t * p.pulseSpeed) * 0.4);

      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fillStyle = `rgba(220, 252, 231, ${pAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size * p.z, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Central Kinetic HUD Box & Typographic Reveal
    const isTextShowing = state.textVisible !== false;
    if (isTextShowing) {
      renderCentral3DHUD(ctx, width, height, state, t);
    }

    // 7. Natural f/2.8 Spatial Lens Depth-of-Field & Vignette Pass
    renderDepthOfFieldAndVignette(ctx, width, height, t);

    ctx.restore(); // Restore camera drift transform
    ctx.restore(); // Restore global context
  };

  /**
   * Renders the 3D Floating Cyan HUD Box and Slam Typewriter Text
   * Perfectly matches Image 2
   */
  function renderCentral3DHUD(ctx, width, height, state, t) {
    const targetWord = (state.mainText || 'THE ILLUSION OF CHOICE').trim();
    const subtitleText = state.subText || '[ HIGH TENSION REVEAL ]';
    const hudColor = state.textColor || '#00f0ff'; // Vibrant cyan

    const typeSpeed = state.matrixTypeSpeed || 1.0;
    const progress = Math.min(1.0, (t * 0.8 * typeSpeed) % 1.25);
    const charsRevealed = Math.floor(progress * targetWord.length);

    // Trigger physical screen shake on character lock
    if (charsRevealed > lastCharsCount && charsRevealed <= targetWord.length) {
      if (lastCharsCount !== -1) triggerTypingSlamImpulse();
      lastCharsCount = charsRevealed;
    }

    let displayed = targetWord.substring(0, charsRevealed);
    if (charsRevealed < targetWord.length) {
      const scramIdx = Math.floor((t * 55) % SCRAMBLE_GLYPHS.length);
      displayed += SCRAMBLE_GLYPHS[scramIdx];
    }

    const centerX = width * 0.5;
    const centerY = height * 0.51;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtitle above HUD box
    ctx.font = '800 13px monospace';
    ctx.fillStyle = '#a7f3d0';
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0, 255, 65, 0.7)';
    ctx.letterSpacing = '2px';
    ctx.fillText(subtitleText, centerX, centerY - 38);

    // Measure HUD Box
    ctx.font = '900 22px monospace';
    const textW = ctx.measureText(targetWord).width;
    const boxW = Math.max(340, textW + 72);
    const boxH = 54;
    const boxX = centerX - boxW / 2;
    const boxY = centerY - boxH / 2 + 6;
    const r = 8; // rounded corner

    // Projected Cyan Light Reflection & Ambient Occlusion onto blueprint map below
    const floorGlow = ctx.createRadialGradient(centerX, centerY + 24, 10, centerX, centerY + 24, boxW * 0.55);
    floorGlow.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    floorGlow.addColorStop(0.5, 'rgba(0, 240, 255, 0.08)');
    floorGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = floorGlow;
    ctx.fillRect(boxX - 30, boxY + 20, boxW + 60, boxH + 30);

    // HUD Glass Container Background
    ctx.save();
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.fillStyle = 'rgba(5, 20, 28, 0.88)';
    roundRect(ctx, boxX, boxY, boxW, boxH, r);
    ctx.fill();
    ctx.restore();

    // Glowing Cyan Border
    ctx.save();
    ctx.strokeStyle = hudColor;
    ctx.lineWidth = 1.8;
    ctx.shadowBlur = 16;
    ctx.shadowColor = hudColor;
    roundRect(ctx, boxX, boxY, boxW, boxH, r);
    ctx.stroke();

    // Subtle Corner Brackets for Tactical Look
    const tickLen = 7;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    // Top-left bracket
    ctx.beginPath();
    ctx.moveTo(boxX - 3, boxY + tickLen);
    ctx.lineTo(boxX - 3, boxY - 3);
    ctx.lineTo(boxX + tickLen, boxY - 3);
    ctx.stroke();
    // Top-right bracket
    ctx.beginPath();
    ctx.moveTo(boxX + boxW - tickLen, boxY - 3);
    ctx.lineTo(boxX + boxW + 3, boxY - 3);
    ctx.lineTo(boxX + boxW + 3, boxY + tickLen);
    ctx.stroke();
    // Bottom-left bracket
    ctx.beginPath();
    ctx.moveTo(boxX - 3, boxY + boxH - tickLen);
    ctx.lineTo(boxX - 3, boxY + boxH + 3);
    ctx.lineTo(boxX + tickLen, boxY + boxH + 3);
    ctx.stroke();
    // Bottom-right bracket
    ctx.beginPath();
    ctx.moveTo(boxX + boxW - tickLen, boxY + boxH + 3);
    ctx.lineTo(boxX + boxW + 3, boxY + boxH + 3);
    ctx.lineTo(boxX + boxW + 3, boxY + boxH - tickLen);
    ctx.stroke();
    ctx.restore();

    // Render Decoded Typewriter Characters
    ctx.save();
    ctx.font = '900 22px monospace';
    ctx.fillStyle = hudColor;
    ctx.shadowBlur = 12;
    ctx.shadowColor = hudColor;
    ctx.textAlign = 'center';
    ctx.fillText(displayed, centerX - 10, centerY + 7);

    // Blinking Terminal Block Cursor ▌
    const isCursorBlink = Math.floor(t * 4.5) % 2 === 0;
    if (isCursorBlink) {
      const curMetrics = ctx.measureText(displayed);
      const curX = centerX - 10 + (curMetrics.width / 2) + 5;
      ctx.fillStyle = hudColor;
      ctx.shadowBlur = 14;
      ctx.shadowColor = hudColor;
      ctx.fillRect(curX, centerY - 10 + 7, 8, 20);
    }
    ctx.restore();

    ctx.restore();
  }

  // Helper for drawing rounded rectangle paths
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
   * Natural f/2.8 Spatial Lens Depth-of-Field & Vignette Pass
   */
  function renderDepthOfFieldAndVignette(ctx, width, height, t) {
    // Optical lens vignette
    const vigGrad = ctx.createRadialGradient(width * 0.5, height * 0.48, width * 0.32, width * 0.5, height * 0.48, width * 0.68);
    vigGrad.addColorStop(0, 'transparent');
    vigGrad.addColorStop(0.7, 'rgba(3, 5, 10, 0.35)');
    vigGrad.addColorStop(1.0, 'rgba(0, 2, 6, 0.75)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * Mounts the 3D Tactical Environmental Stage into the Customizer Modal
   */
  window.tplMountTacticalDecode3DStage = function(stage, state) {
    if (!stage) return;
    const prim = (state.primaryUrl && !state.primaryUrl.includes('unsplash')) ? state.primaryUrl : PLATE_URL;

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #030508; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: crosshair; perspective: 1100px;">
        <!-- 3D Spatial Rig (25°-35° spatial tilt across X and Y axes) -->
        <div id="customizer-tactical-3d-rig" style="position: absolute; inset: -5% -6%; width: 110%; height: 110%; transform: rotateX(24deg) rotateY(-3.5deg) scale(1.04); transform-style: preserve-3d; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);">
          
          <!-- Environmental Desk & Evidence Plate -->
          <img id="customizer-live-tactical-plate" src="${prim}" alt="Tactical Desk Plate" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; pointer-events: none; filter: contrast(112%) brightness(95%);" />

          <!-- High-performance Normal-Mapped Projected Canvas -->
          <canvas id="customizer-live-matrix-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none;"></canvas>

          <!-- Directed Warm Overhead Key Spotlight Overlay -->
          <div style="position: absolute; inset: 0; z-index: 3; pointer-events: none; background: radial-gradient(circle at 48% 30%, rgba(255,246,220,0.20) 0%, rgba(255,235,190,0.06) 42%, rgba(0,0,0,0.72) 100%); mix-blend-mode: soft-light;"></div>

          <!-- Central Tactical 3D HUD Rig -->
          <div id="customizer-live-tactical-hud-rig" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 4; pointer-events: none; transform: translateZ(16px); will-change: transform;">
            <span id="customizer-live-subtitle" style="font-family: monospace; font-size: 11.5px; color: #a7f3d0; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 9px; text-shadow: 0 0 10px rgba(0,255,65,0.7);">
              ${state.subText || '[ HIGH TENSION REVEAL ]'}
            </span>

            <div id="customizer-live-decode-box" style="font-family: monospace; font-size: 19px; font-weight: 900; letter-spacing: 2.2px; color: ${state.textColor || '#00f0ff'}; background: rgba(5, 20, 28, 0.88); border: 1.8px solid ${state.textColor || '#00f0ff'}; padding: 9px 24px; border-radius: 8px; box-shadow: 0 0 24px ${state.textColor || '#00f0ff'}40, inset 0 0 15px ${state.textColor || '#00f0ff'}20, 0 16px 36px rgba(0,0,0,0.92); display: inline-flex; align-items: center; gap: 6px; backdrop-filter: blur(8px); transition: box-shadow 0.2s ease;">
              <span id="customizer-live-decode-text">${state.mainText || 'THE ILLUSION OF CHOICE'}</span>
              <span id="customizer-live-cursor" style="display: inline-block; width: 8px; height: 20px; background: ${state.textColor || '#00f0ff'}; box-shadow: 0 0 10px ${state.textColor || '#00f0ff'};" class="pulse-preview-badge"></span>
            </div>
          </div>

          <!-- Lens Vignette & Depth Falloff Overlay -->
          <div style="position: absolute; inset: 0; z-index: 5; pointer-events: none; background: radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,2,6,0.65) 100%);"></div>

        </div>
      </div>
    `;

    // Ensure initial render tick
    const canvas = stage.querySelector('#customizer-live-matrix-canvas');
    if (canvas) {
      canvas.width = canvas.clientWidth || 696;
      canvas.height = canvas.clientHeight || 250;
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
      canvas.height = canvas.clientHeight || 250;
      canvas._initialized = true;
    }

    const ctx = canvas.getContext('2d');
    const dt = (now - (state._lastTacticalNow || now)) / 1000;
    state._lastTacticalNow = now;

    // Render full 3D environmental scene onto the canvas
    window.renderTacticalDeskCanvasFrame(ctx, canvas.width, canvas.height, state, elapsed, Math.min(0.1, dt || 0.016));

    // Update DOM HUD text in sync
    const targetWord = (state.mainText || 'THE ILLUSION OF CHOICE').trim();
    const typeSpeed = state.matrixTypeSpeed || 1.0;
    const progress = Math.min(1.0, (elapsed * 0.8 * typeSpeed) % 1.25);
    const charsRevealed = Math.floor(progress * targetWord.length);

    let displayed = targetWord.substring(0, charsRevealed);
    if (charsRevealed < targetWord.length) {
      const scramIdx = Math.floor((elapsed * 55) % SCRAMBLE_GLYPHS.length);
      displayed += SCRAMBLE_GLYPHS[scramIdx];
    }

    const textSpan = document.getElementById('customizer-live-decode-text');
    if (textSpan) textSpan.textContent = displayed;

    const subSpan = document.getElementById('customizer-live-subtitle');
    if (subSpan) subSpan.textContent = state.subText || '[ HIGH TENSION REVEAL ]';

    // Apply micro screen shake to HUD container
    const hudRig = document.getElementById('customizer-live-tactical-hud-rig');
    if (hudRig) {
      hudRig.style.transform = `translateZ(16px) translate3d(${shakeImpulseX.toFixed(1)}px, ${shakeImpulseY.toFixed(1)}px, 0)`;
    }
  };

  console.log('[Tactical Decode 3D Engine] Initialized 3D Environmental Projection Engine');
})();
