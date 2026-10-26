/**
 * ============================================================================
 * 3D INVESTIGATIVE DOCUMENTARY KINETIC DECODE & DOSSIER ENGINE
 * (James Jani / Vox / Johnny Harris / Magnates Media Production Standard)
 * ============================================================================
 * Supports:
 * - Animation Styles (`state.decodeAnimStyle`):
 *   1. 'expanding-decode' (Default): Fast, dynamic center-outward expansion where
 *      the text and container expand horizontally as each character decodes & locks.
 *   2. 'expanding-clean': Fast, dynamic center-outward expanding typewriter with
 *      zero cipher symbols (clean kinetic expansion).
 *   3. 'static-dossier': Fixed-width dossier plate with placeholder slot ticks
 *      and simultaneous mechanical cipher lock-in.
 * - Container Styles (`state.decodeContainerStyle`):
 *   1. 'glow-outline' (Default): Rounded dark glass container with a glowing
 *      customizable colored outline that expands dynamically with the text.
 *   2. 'dossier-spine': Sharp architectural plate with a left vertical accent
 *      spine and keyword highlighter/redaction sweep.
 *   3. 'none': Floating kinetic text with no container box.
 * - Environments (`state.decodeEnvPreset`):
 *   1. 'darkroom-dossier': 3D angled classified dossier sheets + spotlight + grid.
 *   2. 'dark-screen': Clean dark atmospheric screen backdrop (Image 2 style).
 *   3. 'geospatial-tactical': Concentric geospatial rings + coordinate grid.
 *   4. 'minimal-obsidian': Pure minimal dark studio slate.
 * ============================================================================
 */

(function () {
  'use strict';

  const CIPHER_GLYPHS = '0123456789ABCDEF§‡ΔØ¶#%&*+=-:/?<>[]';
  const ARCHIVAL_STREAM_GLYPHS = '0123456789ABCDEF·:|-+';

  // Deterministic pseudo-random helper for repeatable per-character cipher & dust
  function hashFloat(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  // Parse hex or rgb color into {r, g, b}
  function parseColorRGB(hexOrColor, fallback) {
    const fb = fallback || { r: 245, g: 158, b: 11 };
    if (!hexOrColor || typeof hexOrColor !== 'string') return fb;
    const clean = hexOrColor.trim();
    if (clean.startsWith('#')) {
      let hex = clean.slice(1);
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length >= 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
      }
    } else if (clean.startsWith('rgb')) {
      const parts = clean.match(/\d+/g);
      if (parts && parts.length >= 3) {
        return {
          r: parseInt(parts[0], 10),
          g: parseInt(parts[1], 10),
          b: parseInt(parts[2], 10)
        };
      }
    }
    return fb;
  }

  // Optional custom image loader (only used if user explicitly uploads a custom image)
  const customImageCache = {};
  function getCustomImage(url) {
    if (
      !url ||
      url === '/tactical_desk_hd_plate.png' ||
      url === '/target_stage_cropped.png' ||
      url === '/investigative_decode_dossier_plate.svg'
    ) {
      return null;
    }
    if (!customImageCache[url]) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      customImageCache[url] = img;
    }
    const cached = customImageCache[url];
    return cached && cached.complete && cached.naturalWidth > 0 ? cached : null;
  }

  // Initialize floating darkroom dust motes
  function ensureDustMotes(state, width, height) {
    if (!state._docDustMotes || state._docDustMotes.length !== 42) {
      state._docDustMotes = [];
      for (let i = 0; i < 42; i++) {
        state._docDustMotes.push({
          x: hashFloat(i * 3.1) * width,
          y: hashFloat(i * 7.3) * height,
          z: 0.25 + hashFloat(i * 11.7) * 0.85,
          vx: (hashFloat(i * 13.9) - 0.5) * 14,
          vy: -6 - hashFloat(i * 17.3) * 14,
          radius: 0.7 + hashFloat(i * 19.1) * 2.1,
          alpha: 0.12 + hashFloat(i * 23.5) * 0.38,
          phase: hashFloat(i * 29.7) * Math.PI * 2
        });
      }
    }
  }

  // Draw an angled classified dossier sheet in 3D midground space
  function drawClassifiedDossierSheet(ctx, x, y, w, h, angleDeg, variant, accentRGB, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.globalAlpha = alpha;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (variant === 'left') {
      grad.addColorStop(0, 'rgba(34, 31, 27, 0.92)');
      grad.addColorStop(1, 'rgba(18, 17, 15, 0.92)');
    } else {
      grad.addColorStop(0, 'rgba(26, 30, 38, 0.90)');
      grad.addColorStop(1, 'rgba(14, 17, 23, 0.90)');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 3);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const pad = w * 0.08;
    const innerW = w - pad * 2;

    ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.35)`;
    ctx.fillRect(pad, pad * 1.1, innerW * 0.38, h * 0.018);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(pad, pad * 1.1 + h * 0.035, innerW, 1.2);

    if (variant === 'left') {
      let curY = pad * 1.1 + h * 0.065;
      const rows = [
        { redact: 0.62, text: 0.28, hl: false },
        { redact: 0, text: 0.88, hl: false },
        { redact: 0, text: 0.76, hl: false },
        { redact: 0.48, text: 0.36, hl: true },
        { redact: 0, text: 0.92, hl: false },
        { redact: 0.72, text: 0, hl: false }
      ];
      rows.forEach((r) => {
        if (r.redact > 0) {
          ctx.fillStyle = 'rgba(5, 6, 9, 0.92)';
          ctx.fillRect(pad, curY, innerW * r.redact, h * 0.028);
          if (r.hl) {
            ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.25)`;
            ctx.fillRect(pad + innerW * (r.redact + 0.04), curY, innerW * r.text, h * 0.028);
          } else if (r.text > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
            ctx.fillRect(pad + innerW * (r.redact + 0.04), curY + 2, innerW * r.text, h * 0.018);
          }
          curY += h * 0.046;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.fillRect(pad, curY, innerW * r.text, h * 0.016);
          curY += h * 0.032;
        }
      });

      const tableY = h * 0.46;
      const tableH = h * 0.36;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(pad, tableY, innerW, tableH);
      for (let r = 1; r <= 4; r++) {
        const ry = tableY + (tableH / 5) * r;
        ctx.beginPath();
        ctx.moveTo(pad, ry);
        ctx.lineTo(pad + innerW, ry);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(pad + innerW * 0.38, tableY);
      ctx.lineTo(pad + innerW * 0.38, tableY + tableH);
      ctx.moveTo(pad + innerW * 0.72, tableY);
      ctx.lineTo(pad + innerW * 0.72, tableY + tableH);
      ctx.stroke();
    } else {
      let curY = pad * 1.1 + h * 0.065;
      for (let i = 0; i < 4; i++) {
        if (i % 2 === 1) {
          ctx.fillStyle = 'rgba(5, 6, 9, 0.92)';
          ctx.fillRect(pad, curY, innerW * (0.55 + i * 0.1), h * 0.028);
          curY += h * 0.045;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.fillRect(pad, curY, innerW * 0.85, h * 0.016);
          curY += h * 0.032;
        }
      }

      const cx = w * 0.5;
      const cy = h * 0.62;
      const rad = Math.min(w, h) * 0.22;
      ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.22)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.beginPath();
      ctx.arc(cx, cy, rad * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - rad * 1.2, cy);
      ctx.lineTo(cx + rad * 1.2, cy);
      ctx.moveTo(cx, cy - rad * 1.2);
      ctx.lineTo(cx, cy + rad * 1.2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Core Canvas Frame Renderer (used by Customizer Stage, Card Preview & Video Export)
   */
  window.renderTacticalDeskCanvasFrame = function (ctx, width, height, state, elapsed, dt) {
    if (!ctx || !width || !height) return;

    const rawT = typeof elapsed === 'number' ? elapsed : 0;
    const is12Fps = !!state.decodePosterize12fps;
    const t = is12Fps ? Math.floor(rawT * 12) / 12 : rawT;

    const envPreset = state.decodeEnvPreset || 'darkroom-dossier';
    const animStyle = state.decodeAnimStyle || 'expanding-decode';
    const containerStyle = state.decodeContainerStyle !== undefined ? state.decodeContainerStyle : 'none';

    // Respect user-selected colors: by default, main text color matches the dominant theme color
    const accentHex = state.textColor || '#f59e0b';
    const accentRGB = parseColorRGB(accentHex, { r: 245, g: 158, b: 11 });

    const titleHex = state.titleColor || accentHex;
    const titleRGB = parseColorRGB(titleHex, accentRGB);

    const mouseTiltX = state._tacticalMouseX || 0;
    const mouseTiltY = state._tacticalMouseY || 0;
    const duration = Math.max(2, state.duration || 6);
    const loopProgress = (t % duration) / duration;
    const dollyScale = state.decodeDollyZoom !== false ? 1.0 + loopProgress * 0.065 : 1.0;

    const camWeaveX = Math.sin(t * 1.15) * (width * 0.003) + mouseTiltX * (width * 0.018);
    const camWeaveY = Math.cos(t * 0.9) * (height * 0.003) + mouseTiltY * (height * 0.018);

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // =========================================================================
    // LAYER 0: DEEP DOCUMENTARY DARKROOM / DARK SCREEN SURFACE & LIGHTING
    // =========================================================================
    const bgGrad = ctx.createRadialGradient(
      width * 0.5 + camWeaveX * 0.4,
      height * 0.45 + camWeaveY * 0.4,
      width * 0.04,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.78
    );

    if (envPreset === 'dark-screen') {
      // Clean Dark Screen background (Image 1 atmospheric dark screen)
      bgGrad.addColorStop(0, `rgba(${Math.round(accentRGB.r * 0.12 + 10)}, ${Math.round(accentRGB.g * 0.12 + 14)}, ${Math.round(accentRGB.b * 0.12 + 22)}, 1)`);
      bgGrad.addColorStop(0.55, '#070a10');
      bgGrad.addColorStop(1, '#020306');
    } else if (envPreset === 'geospatial-tactical') {
      bgGrad.addColorStop(0, '#0f1c2e');
      bgGrad.addColorStop(0.5, '#070e18');
      bgGrad.addColorStop(1, '#020408');
    } else if (envPreset === 'minimal-obsidian') {
      bgGrad.addColorStop(0, '#101115');
      bgGrad.addColorStop(0.55, '#070709');
      bgGrad.addColorStop(1, '#020203');
    } else {
      // 'darkroom-dossier'
      bgGrad.addColorStop(0, '#1e1a16');
      bgGrad.addColorStop(0.48, '#0d1016');
      bgGrad.addColorStop(1, '#040507');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Optional user-uploaded custom background plate
    const customImg = getCustomImage(state.primaryUrl);
    if (customImg) {
      ctx.save();
      ctx.globalAlpha = 0.42;
      const scale = Math.max(width / customImg.naturalWidth, height / customImg.naturalHeight) * dollyScale;
      const dw = customImg.naturalWidth * scale;
      const dh = customImg.naturalHeight * scale;
      ctx.drawImage(customImg, (width - dw) * 0.5 - camWeaveX * 0.5, (height - dh) * 0.5 - camWeaveY * 0.5, dw, dh);
      ctx.restore();
    }

    // =========================================================================
    // LAYER 1 (FAR DEPTH PLANE): COORDINATE GRID / GEOSPATIAL RINGS
    // =========================================================================
    ctx.save();
    ctx.translate(width * 0.5 - camWeaveX * 0.35, height * 0.5 - camWeaveY * 0.35);
    ctx.scale(dollyScale * 0.98, dollyScale * 0.98);
    ctx.translate(-width * 0.5, -height * 0.5);

    const gridStep = Math.max(24, Math.round(width / 32));
    ctx.strokeStyle =
      envPreset === 'geospatial-tactical'
        ? `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.065)`
        : envPreset === 'dark-screen'
          ? `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.038)`
          : 'rgba(255, 255, 255, 0.032)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let gx = 0; gx <= width; gx += gridStep) {
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
    }
    for (let gy = 0; gy <= height; gy += gridStep) {
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
    }
    ctx.stroke();

    // Grid intersection registration dots
    ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.16)`;
    for (let gx = gridStep; gx < width; gx += gridStep * 2) {
      for (let gy = gridStep; gy < height; gy += gridStep * 2) {
        ctx.fillRect(gx - 1, gy - 1, 2, 2);
      }
    }

    if (envPreset === 'geospatial-tactical') {
      const cx = width * 0.5;
      const cy = height * 0.5;
      const maxR = Math.min(width, height) * 0.44;
      ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.16)`;
      ctx.lineWidth = 1;
      [0.32, 0.62, 0.92].forEach((factor, idx) => {
        ctx.beginPath();
        if (idx === 1) ctx.setLineDash([6, 4]);
        else ctx.setLineDash([]);
        ctx.arc(cx, cy, maxR * factor, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      const azAngle = t * 0.35;
      ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.24)`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(azAngle) * maxR * 0.92, cy + Math.sin(azAngle) * maxR * 0.92);
      ctx.stroke();
    }
    ctx.restore();

    // =========================================================================
    // LAYER 1.5: ARCHIVAL TELEMETRY STREAM (Uses state.matrixRainColor directly!)
    // =========================================================================
    if (state.matrixRainEnabled !== false) {
      const colSpacing = Math.max(14, parseInt(state.matrixRainDensity, 10) || 18) * (width / 540);
      const numCols = Math.max(8, Math.floor(width / colSpacing));
      if (!state.matrixColumns || state.matrixColumns.length !== numCols) {
        state.matrixColumns = [];
        for (let i = 0; i < numCols; i++) {
          state.matrixColumns.push({
            x: i * colSpacing + colSpacing * 0.3,
            y: hashFloat(i * 19.3) * height,
            speed: (0.45 + hashFloat(i * 7.1) * 0.55) * (state.matrixRainSpeed || 1.0),
            len: 6 + Math.floor(hashFloat(i * 13.7) * 9),
            seed: i * 100
          });
        }
      }

      const streamColorHex = state.matrixRainColor || accentHex;
      const streamRGB = parseColorRGB(streamColorHex, accentRGB);
      const streamFontPx = Math.max(9, Math.round(width * 0.0145));

      ctx.save();
      ctx.font = `700 ${streamFontPx}px "JetBrains Mono", "Courier New", monospace`;
      ctx.textAlign = 'center';

      const stepDt = Math.min(0.1, dt || 0.016);
      for (let i = 0; i < state.matrixColumns.length; i++) {
        const col = state.matrixColumns[i];
        const distFromCenter = Math.abs(col.x - width * 0.5) / (width * 0.5);
        const zoneMask = distFromCenter < 0.38 ? 0.38 : 0.88;

        col.y += stepDt * 85 * col.speed * (state.matrixRainSpeed || 1.0);
        if (col.y - col.len * streamFontPx > height) {
          col.y = -streamFontPx * 2;
        }

        for (let j = 0; j < col.len; j++) {
          const cy = col.y - j * (streamFontPx * 1.15);
          if (cy < -streamFontPx || cy > height + streamFontPx) continue;
          const fade = (1 - j / col.len) * 0.34 * zoneMask;
          const gIdx = Math.floor(hashFloat(col.seed + j * 17 + Math.floor(t * 8)) * ARCHIVAL_STREAM_GLYPHS.length);
          const ch = ARCHIVAL_STREAM_GLYPHS[gIdx % ARCHIVAL_STREAM_GLYPHS.length];
          if (j === 0) {
            ctx.fillStyle = `rgba(${Math.min(255, streamRGB.r + 75)}, ${Math.min(255, streamRGB.g + 75)}, ${Math.min(255, streamRGB.b + 75)}, ${Math.min(0.75, fade * 2.2)})`;
          } else {
            ctx.fillStyle = `rgba(${streamRGB.r}, ${streamRGB.g}, ${streamRGB.b}, ${fade})`;
          }
          ctx.fillText(ch, col.x - camWeaveX * 0.4, cy);
        }
      }
      ctx.restore();
    }

    // =========================================================================
    // LAYER 2 (MIDGROUND 3D DEPTH PLANE): ANGLED CLASSIFIED DOSSIER SHEETS
    // =========================================================================
    if (envPreset === 'darkroom-dossier' && !customImg) {
      ctx.save();
      ctx.translate(width * 0.5 - camWeaveX * 0.75, height * 0.5 - camWeaveY * 0.75);
      ctx.scale(dollyScale * 1.02, dollyScale * 1.02);
      ctx.translate(-width * 0.5, -height * 0.5);

      const sheetW = width * 0.27;
      const sheetH = height * 0.64;
      drawClassifiedDossierSheet(
        ctx,
        width * 0.06,
        height * 0.14,
        sheetW,
        sheetH,
        -6.5 + Math.sin(t * 0.4) * 0.4,
        'left',
        accentRGB,
        0.52
      );
      drawClassifiedDossierSheet(
        ctx,
        width * 0.67,
        height * 0.18,
        sheetW * 0.96,
        sheetH * 0.95,
        5.4 + Math.cos(t * 0.35) * 0.4,
        'right',
        accentRGB,
        0.48
      );
      ctx.restore();
    }

    // Overhead Accent / Spotlight Cone
    const spotGrad = ctx.createRadialGradient(
      width * 0.5 - camWeaveX * 0.5,
      height * 0.44 - camWeaveY * 0.5,
      width * 0.02,
      width * 0.5,
      height * 0.48,
      width * 0.52
    );
    spotGrad.addColorStop(0, `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.15)`);
    spotGrad.addColorStop(0.55, `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.035)`);
    spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, width, height);

    // =========================================================================
    // LAYER 3 (FOREGROUND 3D FOCUS PLANE): FRAME, CONTAINER & KINETIC REVEAL
    // =========================================================================
    ctx.save();
    ctx.translate(width * 0.5 - camWeaveX * 1.15, height * 0.5 - camWeaveY * 1.15);
    ctx.scale(1.0 + (dollyScale - 1.0) * 1.25, 1.0 + (dollyScale - 1.0) * 1.25);
    ctx.translate(-width * 0.5, -height * 0.5);

    const marginX = width * 0.055;
    const marginY = height * 0.085;
    const bracketLen = Math.max(8, width * 0.018);

    if (envPreset !== 'dark-screen') {
      // Architectural Top & Bottom Framing Hairlines + Corner Registration Marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(marginX, marginY);
      ctx.lineTo(width - marginX, marginY);
      ctx.moveTo(marginX, height - marginY);
      ctx.lineTo(width - marginX, height - marginY);
      ctx.stroke();

      ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.65)`;
      ctx.lineWidth = Math.max(1.2, width * 0.0022);
      ctx.beginPath();
      ctx.moveTo(marginX, marginY + bracketLen);
      ctx.lineTo(marginX, marginY);
      ctx.lineTo(marginX + bracketLen, marginY);
      ctx.moveTo(width - marginX - bracketLen, marginY);
      ctx.lineTo(width - marginX, marginY);
      ctx.lineTo(width - marginX, marginY + bracketLen);
      ctx.moveTo(marginX, height - marginY - bracketLen);
      ctx.lineTo(marginX, height - marginY);
      ctx.lineTo(marginX + bracketLen, height - marginY);
      ctx.moveTo(width - marginX - bracketLen, height - marginY);
      ctx.lineTo(width - marginX, height - marginY);
      ctx.lineTo(width - marginX, height - marginY - bracketLen);
      ctx.stroke();
    }

    const isTextVisible = state.isTextVisible !== false && state.textVisible !== false;
    if (isTextVisible) {
      const rawTitle = (state.mainText || 'THE ILLUSION OF CHOICE').toUpperCase();
      const rawSub = (state.subText || 'EXHIBIT A · DECLASSIFIED').toUpperCase().replace(/^\[\s*|\s*\]$/g, '');

      // User-controllable size multipliers (Minimal Image 1 proportions at 1.0x default)
      const textScale = Math.max(0.45, Math.min(2.5, parseFloat(state.decodeTextScale) || 1.0));
      const boxScale = Math.max(0.45, Math.min(2.5, parseFloat(state.decodeBoxScale) || 1.0));
      const subScale = Math.max(0.45, Math.min(2.5, parseFloat(state.decodeSubScale) || 1.0));
      const showSubContainer = !!state.decodeSubContainer; // FALSE by default (no box around subtitle, only [ ... ] accolades)

      // Fast & Responsive Timing Calculation
      const typeSpeed = Math.max(0.3, parseFloat(state.matrixTypeSpeed) || 1.3);
      const cycleDur = 2.65 / typeSpeed;
      const cycleT = t % cycleDur;
      const decodeRatio = Math.min(1.0, cycleT / (cycleDur * 0.58));

      // Typography configuration (Sleek minimal monospace/sans-serif like Image 1 by default)
      const defaultFont = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";
      const chosenFont =
        (state._userChangedDecodeFont && state.mainStyle && state.mainStyle.fontFamily) ||
        state.decodeFontFamily ||
        defaultFont;
      const isItalic = !!(state.mainStyle && state.mainStyle.italic);
      const isBold = !(state.mainStyle && state.mainStyle.bold === false);
      const fontStylePrefix = `${isItalic ? 'italic ' : ''}${isBold ? '700' : '500'}`;

      // Minimal Image 1 font scale (~2.1% of canvas width at 1.0x default, adjustable via slider)
      const mainFontPx = Math.max(10, Math.min(width * 0.068, Math.round(width * 0.021 * textScale)));

      ctx.font = `${fontStylePrefix} ${mainFontPx}px ${chosenFont}`;
      if ('letterSpacing' in ctx) {
        ctx.letterSpacing = `${Math.max(1, Math.round(mainFontPx * 0.08))}px`;
      }

      const centerY = height * 0.51;
      const nChars = Math.max(1, rawTitle.length);

      // Helper to render the Subtitle / Kicker right above the main container box
      // By default: has `[ ... ]` accolades and NO container box (like Image 1).
      // Optional: if `state.decodeSubContainer` is checked on sidebar, draws a container box around it.
      const drawSubtitleKicker = (mainBoxTopY) => {
        if (!rawSub) return;
        const kickerFontSize = Math.max(7.5, Math.round(width * 0.0112 * subScale));
        const bracketedSub = `[ ${rawSub} ]`;

        ctx.save();
        if ('letterSpacing' in ctx) {
          ctx.letterSpacing = `${Math.max(1, Math.round(kickerFontSize * 0.14))}px`;
        }
        ctx.font = `600 ${kickerFontSize}px "JetBrains Mono", "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const subGap = Math.max(10, height * 0.024 * Math.sqrt(boxScale));
        const kickerY = mainBoxTopY - subGap;

        if (showSubContainer) {
          // Optional Subtitle Container Box (only when user enables it in sidebar)
          const subW = ctx.measureText(bracketedSub).width;
          const pillPadX = Math.max(8, width * 0.013 * subScale);
          const pillPadY = Math.max(3.5, height * 0.008 * subScale);
          const pillW = subW + pillPadX * 2;
          const pillH = kickerFontSize + pillPadY * 2;
          const pillX = (width - pillW) * 0.5;
          const pillY = kickerY - pillH * 0.5;

          ctx.save();
          ctx.fillStyle = 'rgba(6, 10, 18, 0.85)';
          ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.55)`;
          ctx.lineWidth = 1;
          ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.30)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, 3);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Subtle text glow matching the dominant theme color (Image 1 style)
        ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.45)`;
        ctx.shadowBlur = 6;
        ctx.fillStyle = `rgba(${Math.min(255, accentRGB.r + 25)}, ${Math.min(255, accentRGB.g + 25)}, ${Math.min(255, accentRGB.b + 25)}, 0.92)`;
        ctx.fillText(bracketedSub, width * 0.5, kickerY);
        ctx.restore();
      };

      // =======================================================================
      // MODE A & B: DYNAMIC EXPANDING REVEAL ('expanding-decode' & 'expanding-clean')
      // Container & text expand horizontally outward from center as characters appear!
      // =======================================================================
      if (animStyle === 'expanding-decode' || animStyle === 'expanding-clean') {
        const exactChars = decodeRatio * nChars;
        const lockedCount = Math.min(nChars, Math.floor(exactChars));
        const charFrac = exactChars - lockedCount;

        const lockedStr = rawTitle.slice(0, lockedCount);
        let leadingChar = '';
        if (lockedCount < nChars) {
          if (animStyle === 'expanding-clean') {
            leadingChar = rawTitle[lockedCount];
          } else {
            if (charFrac > 0.72) {
              leadingChar = rawTitle[lockedCount];
            } else {
              const gIdx = Math.floor(hashFloat(lockedCount * 29.3 + Math.floor(t * 42)) * CIPHER_GLYPHS.length);
              leadingChar = CIPHER_GLYPHS[gIdx % CIPHER_GLYPHS.length];
            }
          }
        }

        // Measure exact pixel widths for smooth 60fps horizontal container expansion
        ctx.font = `${fontStylePrefix} ${mainFontPx}px ${chosenFont}`;
        const lockedW = ctx.measureText(lockedStr).width;
        const nextCharW = lockedCount < nChars ? ctx.measureText(rawTitle[lockedCount]).width : 0;
        const smoothTextW = lockedW + nextCharW * (lockedCount < nChars ? Math.max(0.35, charFrac) : 0);

        const cursorW = Math.max(4, mainFontPx * 0.32);
        const cursorH = Math.max(2, mainFontPx * 0.14); // Sleek underscore/terminal cursor or block
        const cursorGap = Math.max(3, mainFontPx * 0.12);
        const totalContentW = smoothTextW + cursorGap + cursorW;

        // Minimal, compact container padding like Image 1 (adjustable via Container Size slider)
        const platePadX = Math.max(10, width * 0.0175 * boxScale);
        const platePadY = Math.max(6, height * 0.0185 * boxScale);
        const plateW = Math.min(width * 0.92, Math.max(mainFontPx * 2.0, totalContentW + platePadX * 2));
        const plateH = mainFontPx + platePadY * 2;
        const plateX = (width - plateW) * 0.5;
        const plateY = centerY - plateH * 0.5;

        // Draw Subtitle `[ ... ]` right above the main box (no container by default!)
        drawSubtitleKicker(plateY);

        // 1. Draw Main Container (if not 'none')
        if (containerStyle === 'glow-outline') {
          // Image 1 Style: Sleek minimal dark box with crisp glowing colored outline
          ctx.save();
          ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.38)`;
          ctx.shadowBlur = Math.max(10, width * 0.018);
          ctx.shadowOffsetY = Math.max(2, height * 0.006);

          ctx.fillStyle = 'rgba(6, 9, 15, 0.88)';
          ctx.beginPath();
          ctx.roundRect(plateX, plateY, plateW, plateH, Math.max(4, width * 0.006));
          ctx.fill();

          ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.92)`;
          ctx.lineWidth = Math.max(1.1, width * 0.0015);
          ctx.stroke();
          ctx.restore();
        } else if (containerStyle === 'dossier-spine') {
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = Math.max(12, width * 0.024);
          ctx.shadowOffsetY = Math.max(4, height * 0.012);

          ctx.fillStyle = 'rgba(11, 13, 19, 0.90)';
          ctx.beginPath();
          ctx.roundRect(plateX, plateY, plateW, plateH, 3);
          ctx.fill();
          ctx.restore();

          ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.38)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(plateX, plateY, plateW, plateH);

          // Left Vertical Accent Spine
          ctx.fillStyle = `rgb(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b})`;
          ctx.fillRect(plateX, plateY, Math.max(2.5, width * 0.0038), plateH);
        }

        // Optional Keyword Redaction / Highlighter Sweep when reveal nears completion
        if (state.decodeRedactionSweep && containerStyle !== 'none' && decodeRatio > 0.65) {
          const lastSpaceIdx = rawTitle.lastIndexOf(' ');
          const lastWord = lastSpaceIdx >= 0 ? rawTitle.slice(lastSpaceIdx + 1) : rawTitle;
          const prefixBeforeLast = lastSpaceIdx >= 0 ? rawTitle.slice(0, lastSpaceIdx + 1) : '';
          const prefixW = ctx.measureText(prefixBeforeLast).width;
          const lastWordW = ctx.measureText(lastWord).width;
          const hlProg = Math.max(0, Math.min(1, (decodeRatio - 0.65) / 0.35));

          const textStartX = width * 0.5 - totalContentW * 0.5;
          const hlX = textStartX + prefixW - 3;
          const hlH = mainFontPx * 1.18;
          const hlY = centerY - hlH * 0.5;

          ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.16)`;
          ctx.fillRect(hlX, hlY, (lastWordW + 6) * hlProg, hlH);
        }

        // 2. Draw Expanding Text + Leading Character + Terminal Cursor
        const textStartX = width * 0.5 - totalContentW * 0.5;

        ctx.save();
        ctx.font = `${fontStylePrefix} ${mainFontPx}px ${chosenFont}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Crisp text glow matching the dominant/title color
        ctx.shadowColor = `rgba(${titleRGB.r}, ${titleRGB.g}, ${titleRGB.b}, 0.42)`;
        ctx.shadowBlur = Math.max(6, mainFontPx * 0.45);
        ctx.fillStyle = titleHex;
        ctx.fillText(lockedStr, textStartX, centerY);

        // Draw leading character (either clean pop or cipher snap)
        if (lockedCount < nChars && leadingChar) {
          const leadX = textStartX + lockedW;
          if (animStyle === 'expanding-clean') {
            ctx.save();
            ctx.globalAlpha = Math.min(1, 0.35 + charFrac * 0.65);
            ctx.fillStyle = titleHex;
            ctx.fillText(leadingChar, leadX, centerY);
            ctx.restore();
          } else {
            ctx.save();
            ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.9)`;
            ctx.shadowBlur = 10;
            ctx.fillStyle =
              charFrac > 0.72
                ? titleHex
                : `rgb(${Math.min(255, accentRGB.r + 50)}, ${Math.min(255, accentRGB.g + 50)}, ${Math.min(255, accentRGB.b + 40)})`;
            ctx.fillText(leadingChar, leadX, centerY);
            ctx.restore();
          }
        }
        ctx.restore();

        // 3. Draw Glowing Terminal Underscore / Cursor right at the expanding edge (Image 1 `_` / block style)
        const cursorBlink = decodeRatio < 0.99 ? 1.0 : Math.sin(t * 8.0) > -0.15 ? 0.96 : 0.12;
        const cursorX = textStartX + smoothTextW + cursorGap;
        ctx.save();
        ctx.fillStyle = `rgba(${titleRGB.r}, ${titleRGB.g}, ${titleRGB.b}, ${cursorBlink})`;
        ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${cursorBlink * 0.85})`;
        ctx.shadowBlur = 8;
        if (decodeRatio < 0.99 && animStyle === 'expanding-decode') {
          // Active decoding block cursor while typing, settling into sleek underscore `_` like Image 1
          const actH = mainFontPx * 0.82;
          ctx.fillRect(cursorX, centerY - actH * 0.5, Math.max(3.5, mainFontPx * 0.24), actH);
        } else {
          ctx.fillRect(cursorX, centerY + mainFontPx * 0.32 - cursorH * 0.5, cursorW, cursorH);
        }
        ctx.restore();
      } else {
        // =====================================================================
        // MODE C: FIXED-SLOT DOSSIER CIPHER DECODE ('static-dossier')
        // =====================================================================
        const charAdvance = mainFontPx * 0.68;
        const totalTitleW = nChars * charAdvance;

        const platePadX = Math.max(10, width * 0.0185 * boxScale);
        const platePadY = Math.max(6, height * 0.0195 * boxScale);
        const plateW = Math.min(width * 0.88, totalTitleW + platePadX * 2.1);
        const plateH = mainFontPx + platePadY * 2;
        const plateX = (width - plateW) * 0.5;
        const plateY = centerY - plateH * 0.5;

        // Draw Subtitle `[ ... ]` right above the main box (no container by default!)
        drawSubtitleKicker(plateY);

        if (containerStyle === 'glow-outline') {
          ctx.save();
          ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.38)`;
          ctx.shadowBlur = Math.max(10, width * 0.018);
          ctx.fillStyle = 'rgba(6, 9, 15, 0.88)';
          ctx.beginPath();
          ctx.roundRect(plateX, plateY, plateW, plateH, Math.max(4, width * 0.006));
          ctx.fill();
          ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.92)`;
          ctx.lineWidth = Math.max(1.1, width * 0.0015);
          ctx.stroke();
          ctx.restore();
        } else if (containerStyle === 'dossier-spine') {
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = Math.max(12, width * 0.024);
          ctx.shadowOffsetY = Math.max(4, height * 0.012);
          ctx.fillStyle = 'rgba(11, 13, 19, 0.90)';
          ctx.beginPath();
          ctx.roundRect(plateX, plateY, plateW, plateH, 3);
          ctx.fill();
          ctx.restore();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.lineWidth = 1;
          ctx.strokeRect(plateX, plateY, plateW, plateH);

          ctx.fillStyle = `rgb(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b})`;
          ctx.fillRect(plateX, plateY, Math.max(2.5, width * 0.0038), plateH);
        }

        const lastSpaceIdx = rawTitle.lastIndexOf(' ');
        const hlStartChar = lastSpaceIdx >= 0 ? lastSpaceIdx + 1 : Math.floor(nChars * 0.55);
        const hlCharCount = Math.max(1, nChars - hlStartChar);

        const startX = width * 0.5 - totalTitleW * 0.5 + charAdvance * 0.5;
        const hlStartRatio = hlStartChar / nChars;
        const hlProgress = Math.max(0, Math.min(1, (decodeRatio - hlStartRatio * 0.85) / (1 - hlStartRatio * 0.85)));

        if (hlProgress > 0.01 && state.decodeRedactionSweep && containerStyle !== 'none') {
          const hlX = startX + hlStartChar * charAdvance - charAdvance * 0.45;
          const hlMaxW = hlCharCount * charAdvance + charAdvance * 0.35;
          const hlCurW = hlMaxW * hlProgress;
          const hlH = mainFontPx * 1.18;
          const hlY = centerY - hlH * 0.5;

          ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.18)`;
          ctx.fillRect(hlX, hlY, hlCurW, hlH);

          ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.42)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(hlX, hlY, hlCurW, hlH);
        }

        let activeCursorIndex = 0;
        for (let i = 0; i < nChars; i++) {
          const targetChar = rawTitle[i];
          const slotX = startX + i * charAdvance;

          if (targetChar === ' ') {
            if (decodeRatio >= i / nChars) activeCursorIndex = i + 1;
            continue;
          }

          const charStart = (i / nChars) * 0.78;
          const charLock = charStart + 0.22;

          if (decodeRatio >= charLock) {
            activeCursorIndex = i + 1;
            const lockAge = decodeRatio - charLock;
            const isFlash = lockAge < 0.06;

            ctx.save();
            ctx.font = `${fontStylePrefix} ${mainFontPx}px ${chosenFont}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (isFlash) {
              ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.9)`;
              ctx.shadowBlur = 10;
              ctx.fillStyle = '#ffffff';
            } else {
              ctx.shadowColor = `rgba(${titleRGB.r}, ${titleRGB.g}, ${titleRGB.b}, 0.38)`;
              ctx.shadowBlur = 6;
              ctx.fillStyle = titleHex;
            }
            ctx.fillText(targetChar, slotX, centerY);
            ctx.restore();
          } else if (decodeRatio >= charStart) {
            activeCursorIndex = i + 1;
            const localP = (decodeRatio - charStart) / (charLock - charStart);
            const glyphIndex = Math.floor(hashFloat(i * 31.7 + Math.floor(t * 28)) * CIPHER_GLYPHS.length);
            const cipherChar = CIPHER_GLYPHS[glyphIndex % CIPHER_GLYPHS.length];
            const slideY = (1 - localP) * (mainFontPx * 0.18) * (i % 2 === 0 ? -1 : 1);

            ctx.save();
            ctx.font = `700 ${Math.round(mainFontPx * 0.94)}px "JetBrains Mono", "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.75)`;
            ctx.shadowBlur = 6;
            ctx.fillStyle = `rgba(${Math.min(255, accentRGB.r + 35)}, ${Math.min(255, accentRGB.g + 40)}, ${Math.min(255, accentRGB.b + 20)}, ${0.55 + localP * 0.45})`;
            ctx.fillText(cipherChar, slotX, centerY + slideY);
            ctx.restore();
          } else {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
            ctx.fillRect(slotX - charAdvance * 0.2, centerY + mainFontPx * 0.32, charAdvance * 0.4, 1.2);
            ctx.restore();
          }
        }

        const cursorBlink = decodeRatio < 0.99 ? 1.0 : Math.sin(t * 7.5) > -0.15 ? 0.95 : 0.12;
        const cursorX = startX + Math.min(nChars, activeCursorIndex) * charAdvance - charAdvance * 0.15;
        const cursorW = Math.max(3, mainFontPx * 0.22);
        const cursorH = mainFontPx * 0.82;

        ctx.save();
        ctx.fillStyle = `rgba(${titleRGB.r}, ${titleRGB.g}, ${titleRGB.b}, ${cursorBlink})`;
        ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${cursorBlink * 0.7})`;
        ctx.shadowBlur = 6;
        ctx.fillRect(cursorX, centerY - cursorH * 0.5, cursorW, cursorH);
        ctx.restore();
      }

      if ('letterSpacing' in ctx) {
        ctx.letterSpacing = '0px';
      }
    }

    // Bottom Documentary Telemetry & Timecode Footer
    if (envPreset !== 'dark-screen') {
      const footerFontPx = Math.max(7, Math.round(width * 0.0125));
      ctx.font = `600 ${footerFontPx}px "JetBrains Mono", "Courier New", monospace`;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.58)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      const leftMeta =
        envPreset === 'geospatial-tactical'
          ? 'GEOSPATIAL RECON · LAT 40.7128° N'
          : envPreset === 'minimal-obsidian'
            ? 'CHAPTER SLATE · ANAMORPHIC 2.39:1'
            : 'SEC FILING // ARCHIVAL DOSSIER';
      ctx.fillText(leftMeta, marginX + 4, height - marginY - 6);

      const secs = Math.floor(t % 60).toString().padStart(2, '0');
      const frames = Math.floor((t % 1) * (is12Fps ? 12 : 24)).toString().padStart(2, '0');
      ctx.textAlign = 'right';
      ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.75)`;
      ctx.fillText(
        `${is12Fps ? '12.0 FPS STOP-MOTION' : '24.0 FPS CINEMA'} · TC 00:00:${secs}:${frames}`,
        width - marginX - 4,
        height - marginY - 6
      );
    }

    ctx.restore();

    // =========================================================================
    // LAYER 4 (FOREGROUND ATMOSPHERE): FLOATING DUST MOTES & VIGNETTE
    // =========================================================================
    ensureDustMotes(state, width, height);
    const stepDt = Math.min(0.1, dt || 0.016);
    ctx.save();
    for (let i = 0; i < state._docDustMotes.length; i++) {
      const m = state._docDustMotes[i];
      m.x += m.vx * stepDt * m.z;
      m.y += m.vy * stepDt * m.z;
      if (m.y < -10) m.y = height + 10;
      if (m.x < -10) m.x = width + 10;
      if (m.x > width + 10) m.x = -10;

      const twinkle = 0.65 + 0.35 * Math.sin(t * 2.2 + m.phase);
      const px = m.x - camWeaveX * (1.3 * m.z);
      const py = m.y - camWeaveY * (1.3 * m.z);

      ctx.beginPath();
      ctx.arc(px, py, m.radius * (width / 640), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(255, accentRGB.r + 60)}, ${Math.min(255, accentRGB.g + 60)}, ${Math.min(255, accentRGB.b + 60)}, ${m.alpha * twinkle * 0.75})`;
      ctx.fill();
    }
    ctx.restore();

    // Cinema Anamorphic Vignette
    const vigGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.28,
      width * 0.5,
      height * 0.5,
      width * 0.75
    );
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, 'rgba(2, 3, 5, 0.68)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  };

  /**
   * Mounts the interactive 3D Investigative Documentary stage inside the Customizer Modal
   */
  window.tplMountTacticalDecode3DStage = function (stage, state) {
    if (!stage) return;

    // Initialize defaults ONLY if undefined — never overwrite user selections
    if (!state.textColor) {
      state.textColor = '#f59e0b';
    }
    if (!state.titleColor) {
      state.titleColor = state.textColor;
    }
    if (!state.matrixRainColor) {
      state.matrixRainColor = state.textColor;
    }
    if (!state.subText || state.subText === '[ HIGH TENSION REVEAL ]') {
      state.subText = 'EXHIBIT A · DECLASSIFIED';
    }
    if (!state.decodeEnvPreset) {
      state.decodeEnvPreset = 'darkroom-dossier';
    }
    if (!state.decodeAnimStyle) {
      state.decodeAnimStyle = 'expanding-decode';
    }
    if (!state.decodeContainerStyle) {
      state.decodeContainerStyle = 'glow-outline';
    }
    if (state.decodeSubContainer === undefined) {
      state.decodeSubContainer = false;
    }
    if (!state.decodeTextScale) {
      state.decodeTextScale = 1.0;
    }
    if (!state.decodeBoxScale) {
      state.decodeBoxScale = 1.0;
    }
    if (!state.decodeSubScale) {
      state.decodeSubScale = 1.0;
    }
    if (!state.matrixTypeSpeed) {
      state.matrixTypeSpeed = 1.3;
    }

    stage.innerHTML = `
      <div id="tactical-3d-stage-root" style="position: absolute; inset: 0; background: #040507; overflow: hidden; user-select: none; cursor: grab;">
        <canvas id="tactical-3d-live-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; display: block;"></canvas>

        <!-- Bottom-Center Non-Overlapping Quick Mode Bar -->
        <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 6px; z-index: 12; pointer-events: auto; white-space: nowrap;">
          <div style="display: flex; align-items: center; gap: 3px; background: rgba(9, 11, 16, 0.88); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 6px; padding: 3px; backdrop-filter: blur(8px);">
            <button type="button" data-doc-env="darkroom-dossier" class="tactical-env-btn" style="padding: 3px 7px; font-size: 9px; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s;">
              Darkroom 3D
            </button>
            <button type="button" data-doc-env="dark-screen" class="tactical-env-btn" style="padding: 3px 7px; font-size: 9px; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s;">
              Dark Screen
            </button>
            <button type="button" data-doc-env="geospatial-tactical" class="tactical-env-btn" style="padding: 3px 7px; font-size: 9px; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s;">
              Geospatial
            </button>
            <button type="button" data-doc-env="minimal-obsidian" class="tactical-env-btn" style="padding: 3px 7px; font-size: 9px; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s;">
              Minimal Slate
            </button>
          </div>

          <button type="button" id="btn-tactical-toggle-12fps" title="Toggle 12fps Stop-Motion Chapter Cadence" style="padding: 4px 8px; font-size: 9px; font-weight: 600; border-radius: 6px; border: 1px solid rgba(255,255,255,0.14); background: rgba(9, 11, 16, 0.88); color: #cbd5e1; cursor: pointer; backdrop-filter: blur(8px);">
            12fps: Off
          </button>
        </div>
      </div>
    `;

    const rootEl = document.getElementById('tactical-3d-stage-root');
    const syncToolbarUI = () => {
      if (!rootEl) return;
      const curEnv = state.decodeEnvPreset || 'darkroom-dossier';
      rootEl.querySelectorAll('.tactical-env-btn').forEach((btn) => {
        const env = btn.getAttribute('data-doc-env');
        const active = curEnv === env;
        btn.style.background = active ? 'rgba(245, 158, 11, 0.22)' : 'transparent';
        btn.style.color = active ? '#fde68a' : '#94a3b8';
      });
      const btn12 = document.getElementById('btn-tactical-toggle-12fps');
      if (btn12) {
        const on = !!state.decodePosterize12fps;
        btn12.textContent = on ? '12fps: ON' : '12fps: Off';
        btn12.style.borderColor = on ? 'rgba(245, 158, 11, 0.55)' : 'rgba(255, 255, 255, 0.14)';
        btn12.style.color = on ? '#fde68a' : '#cbd5e1';
      }
      const envSelect = document.getElementById('tpl-modal-select-decode-env');
      if (envSelect && envSelect.value !== curEnv) {
        envSelect.value = curEnv;
      }
      document.querySelectorAll('.sidebar-decode-env-btn').forEach((b) => {
        const env = b.getAttribute('data-doc-env');
        const active = curEnv === env;
        b.style.background = active ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)';
        b.style.borderColor = active ? 'rgba(245, 158, 11, 0.55)' : 'rgba(255, 255, 255, 0.08)';
        b.style.color = active ? '#fde68a' : '#94a3b8';
      });
    };

    if (rootEl) {
      rootEl.querySelectorAll('.tactical-env-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          state.decodeEnvPreset = btn.getAttribute('data-doc-env') || 'darkroom-dossier';
          syncToolbarUI();
        });
      });

      const btn12 = document.getElementById('btn-tactical-toggle-12fps');
      if (btn12) {
        btn12.addEventListener('click', (e) => {
          e.stopPropagation();
          state.decodePosterize12fps = !state.decodePosterize12fps;
          const chk12 = document.getElementById('tpl-modal-decode-12fps');
          if (chk12) chk12.checked = !!state.decodePosterize12fps;
          syncToolbarUI();
        });
      }

      rootEl.addEventListener('mousemove', (e) => {
        const rect = rootEl.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        state._tacticalMouseX = nx;
        state._tacticalMouseY = ny;
      });
      rootEl.addEventListener('mouseleave', () => {
        state._tacticalMouseX = 0;
        state._tacticalMouseY = 0;
      });
    }

    syncToolbarUI();
    window.tplUpdateTacticalDecode3DFrame(state, 0, performance.now());
  };

  /**
   * Frame Update Entry Point called by Customizer 60fps requestAnimationFrame Loop
   */
  window.tplUpdateTacticalDecode3DFrame = function (state, elapsed, now) {
    const canvas =
      document.getElementById('tactical-3d-live-canvas') ||
      document.getElementById('customizer-live-matrix-canvas');
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cw = Math.max(320, canvas.clientWidth || 640);
    const ch = Math.max(180, canvas.clientHeight || 360);
    const targetW = Math.round(cw * dpr);
    const targetH = Math.round(ch * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext('2d');
    const dt = (now - (state._lastTacticalNow || now)) / 1000;
    state._lastTacticalNow = now;

    window.renderTacticalDeskCanvasFrame(ctx, canvas.width, canvas.height, state, elapsed, dt);
  };
})();
