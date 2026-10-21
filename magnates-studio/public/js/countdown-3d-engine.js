/**
 * James Jani Signature "The Countdown Effect" & Panic Ticker 3D Terminal Engine
 * Photorealistic 3D Financial War Room Monitor HUD
 * (James Jani / Magnates Media / Vox Documentary Standard)
 *
 * Implements:
 * 1. 3D Curved CRT Terminal Screen Environment (War Room multi-monitor ambient rig)
 * 2. Tactical Monospace T-Minus Countdown Rig ([ T-MINUS 00:06.170 ]) with RGB chromatic aberration & phosphor bloom
 * 3. Clean headline with HUD brackets ([ FTX LIQUIDITY CRASH ]) and zero text collisions
 * 4. Glowing crimson gradient volumetric area chart (#EF4444 to #450A0A) with falling candlesticks & matrix streams
 * 5. Dramatic quote card at the bottom center
 * 6. High-contrast panic ticker tape with bold red percentage badges (FTX -94.2%, FTT -94.2%)
 * 7. Composite foreground pinned case papers, screen scanlines (opacity 0.08), and corner glass specular sheen
 * 8. Full integration with standard customizer modal (#modal-top-template-customizer):
 *    - Sequence Storyboard multi-scene bar
 *    - Standard Layers panel + contextual controls
 *    - Playback bar seeking & time synchronization
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'jani-countdown-panic-suite';

  // Environmental plates & asset caching
  const assets = {
    bgPlate: null,
    fgPapers: null,
    isLoaded: false
  };

  function loadAssets() {
    if (assets.isLoaded) return;
    const bg = new Image();
    bg.crossOrigin = 'anonymous';
    bg.src = '/countdown_warroom_clean_bg.png';
    bg.onload = () => { assets.bgPlate = bg; };
    assets.bgPlate = bg;

    const fg = new Image();
    fg.crossOrigin = 'anonymous';
    fg.src = '/countdown_warroom_foreground_papers.png';
    fg.onload = () => { assets.fgPapers = fg; };
    assets.fgPapers = fg;

    assets.isLoaded = true;
  }

  if (typeof window !== 'undefined') {
    loadAssets();
  }

  // Fallback defaults
  const DEFAULT_CONFIG = {
    title: 'FTX LIQUIDITY CRASH',
    quote: '"And in less than 48 hours... $32 Billion vanished into thin air."',
    tickerText: '$FTT -94.2%  |  BTC $15,820 (-22.4%)  |  BINANCE WITHDRAWALS PAUSED  |  $ETH $1,080 (-28.9%)  |  ALAMEDA RESEARCH BANKRUPT',
    tickerEnabled: true,
    totalDuration: 10,
    displayMode: 'tminus',
    stylePreset: 'neon-red',
    vignetteIntensity: 80,
    crtEnabled: true,
    shakeEnabled: true,
    customBgImage: null,
    customBgUrl: ''
  };

  function getConfig(data) {
    const ctx = (typeof window.tplGetContextualData === 'function')
      ? window.tplGetContextualData(TEMPLATE_ID)
      : null;
    return Object.assign({}, DEFAULT_CONFIG, ctx || {}, data || {});
  }

  // Pre-generate stable candlestick and noise points
  const CHART_POINTS = [];
  for (let i = 0; i < 50; i++) {
    // Falling trajectory with realistic market volatility
    const t = i / 49;
    const trend = 0.85 - t * 0.55;
    const jitter = Math.sin(i * 1.8) * 0.08 + Math.cos(i * 3.4) * 0.04;
    CHART_POINTS.push(Math.max(0.12, Math.min(0.95, trend + jitter)));
  }

  /**
   * Main Frame Render Pipeline
   * Takes normalized canvas dimensions (native 1338x566 or responsive)
   */
  function renderCountdownCanvasFrame(ctx, w, h, data, elapsedSec, totalDur) {
    loadAssets();

    const d = getConfig(data);
    const duration = totalDur || d.totalDuration || 10;
    const remainingSec = Math.max(0, duration - (elapsedSec % duration));
    const progress = Math.max(0, Math.min(1, 1 - (remainingSec / duration)));

    // Geometry normalized to the 2.36:1 terminal war room viewport
    // Center monitor coordinates
    const xc = w * 0.523;
    const titleY = h * 0.165;
    const clockY = h * 0.278;
    const chartX0 = w * 0.165;
    const chartX1 = w * 0.865;
    const chartW = chartX1 - chartX0;
    const chartTop = h * 0.35;
    const chartBottom = h * 0.85;
    const quoteY = h * 0.887;
    const tickerY0 = h * 0.925;
    const tickerH = h * 0.065;

    // 1. Environmental Background Plate
    ctx.save();
    if (d.customBgImage && d.customBgImage.complete && d.customBgImage.naturalWidth > 0) {
      ctx.drawImage(d.customBgImage, 0, 0, w, h);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, w, h);
    } else if (assets.bgPlate && assets.bgPlate.complete && assets.bgPlate.naturalWidth > 0) {
      ctx.drawImage(assets.bgPlate, 0, 0, w, h);
    } else {
      // High-end procedural fallback
      const bgGrad = ctx.createRadialGradient(xc, h * 0.45, h * 0.1, xc, h * 0.45, w * 0.75);
      bgGrad.addColorStop(0, '#1c080b');
      bgGrad.addColorStop(0.55, '#0a0305');
      bgGrad.addColorStop(1, '#020102');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();

    // 2. Technical Coordinate Grid & Monitor Scanlines
    ctx.save();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.06)';
    ctx.lineWidth = 1;
    const stepX = w * 0.024;
    for (let x = chartX0 - stepX; x <= chartX1 + stepX; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.12);
      ctx.lineTo(x, h * 0.90);
      ctx.stroke();
    }
    const stepY = h * 0.055;
    for (let y = h * 0.14; y <= h * 0.88; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(chartX0 - stepX, y);
      ctx.lineTo(chartX1 + stepX, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Volumetric Glowing Crimson Gradient Area Chart & Candlestick Drops
    ctx.save();
    const pts = [];
    const totalPts = CHART_POINTS.length;
    for (let i = 0; i < totalPts; i++) {
      const norm = i / (totalPts - 1);
      // Drop steepens dramatically in the second half
      const dropMultiplier = norm > (1 - progress * 0.85) ? (1 + progress * 2.5) : 1;
      let val = CHART_POINTS[i] / dropMultiplier;
      // Micro tremor at the climax
      if (progress > 0.65 && norm > 0.6) {
        val += Math.sin(i * 12.5 + elapsedSec * 15) * 0.035;
      }
      const px = chartX0 + norm * chartW;
      const py = chartTop + (1 - val) * (chartBottom - chartTop);
      pts.push({ x: px, y: Math.max(chartTop, Math.min(chartBottom, py)) });
    }

    // Gradient fill under the curve
    ctx.beginPath();
    ctx.moveTo(chartX0, chartBottom);
    for (let i = 0; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.lineTo(chartX1, chartBottom);
    ctx.closePath();

    const areaGrad = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
    areaGrad.addColorStop(0, 'rgba(239, 68, 68, 0.78)');
    areaGrad.addColorStop(0.35, 'rgba(185, 28, 28, 0.45)');
    areaGrad.addColorStop(0.75, 'rgba(69, 10, 10, 0.22)');
    areaGrad.addColorStop(1, 'rgba(10, 2, 4, 0.02)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Falling digital data streams inside the area (Matrix-like glyphs)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 120, 120, 0.18)';
    const glyphFontSize = Math.max(9, Math.round(h * 0.019));
    ctx.font = `${glyphFontSize}px 'JetBrains Mono', monospace`;
    const numCols = 16;
    for (let c = 0; c < numCols; c++) {
      const colX = chartX0 + (c + 0.5) * (chartW / numCols);
      const colY = chartTop + ((elapsedSec * 50 + c * 43) % (chartBottom - chartTop));
      ctx.fillText(c % 2 === 0 ? '1' : '0', colX, colY);
    }
    ctx.restore();

    // Candlestick markers along drops
    ctx.save();
    const candleW = Math.max(3, Math.round(w * 0.005));
    for (let i = 2; i < pts.length - 2; i += 3) {
      const pt = pts[i];
      const candleH = (12 + (i % 4) * 5) * (h / 566);
      // Wick
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y - 6);
      ctx.lineTo(pt.x, pt.y + candleH + 6);
      ctx.stroke();
      // Body
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(pt.x - candleW / 2, pt.y, candleW, candleH);
    }
    ctx.restore();

    // Glowing key trigger nodes (pulsing drop circles)
    const triggerIndices = [14, 28, 42];
    triggerIndices.forEach(idx => {
      if (idx < pts.length) {
        const tp = pts[idx];
        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ring
        const rPulse = 5 + (Math.sin(elapsedSec * 6 + idx) + 1) * 3;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, rPulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });

    // Top Neon Glowing Contour Line
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      if (i === 0) ctx.moveTo(pts[i].x, pts[i].y);
      else ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = '#ff2a4b';
    ctx.lineWidth = Math.max(2, Math.round(h * 0.005));
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // end chart

    // 4. Headline & Tactical HUD Layer: [ FTX LIQUIDITY CRASH ]
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const titleFontSize = Math.max(12, Math.round(h * 0.038));
    ctx.font = `700 ${titleFontSize}px 'Chakra Petch', 'Inter', -apple-system, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
    ctx.shadowBlur = 8;
    const titleText = (d.title || 'FTX LIQUIDITY CRASH').toUpperCase();
    ctx.fillText(`[ ${titleText} ]`, xc, titleY);
    ctx.restore();

    // 5. Tactile Monospace Countdown Rig inside Dedicated HUD Box
    // Formatted strictly as [ T-MINUS 00:06.170 ] with high-density monospace
    const mins = Math.floor(remainingSec / 60);
    const secs = Math.floor(remainingSec % 60);
    const millis = Math.floor((remainingSec % 1) * 1000);
    const pad = (n, width = 2) => String(n).padStart(width, '0');

    let timeStr = '';
    if (d.displayMode === 'tminus') {
      timeStr = `T-MINUS ${pad(mins)}:${pad(secs)}.${pad(millis, 3)}`;
    } else {
      timeStr = `23:${pad(59 - mins)}:${pad(59 - secs)}`;
    }

    const boxW = Math.round(w * 0.315); // ~420px on 1338
    const boxH = Math.round(h * 0.095); // ~54px on 566
    const bx0 = xc - boxW / 2;
    const bx1 = xc + boxW / 2;
    const by0 = clockY - boxH / 2;
    const by1 = clockY + boxH / 2;

    ctx.save();
    // Translucent dark glass box
    ctx.fillStyle = 'rgba(12, 3, 5, 0.88)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bx0, by0, boxW, boxH, 6);
    } else {
      ctx.rect(bx0, by0, boxW, boxH);
    }
    ctx.fill();

    // Fine HUD border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tactical Corner L-Brackets
    const cl = Math.round(boxH * 0.22);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(bx0, by0 + cl); ctx.lineTo(bx0, by0); ctx.lineTo(bx0 + cl, by0);
    ctx.moveTo(bx1 - cl, by0); ctx.lineTo(bx1, by0); ctx.lineTo(bx1, by0 + cl);
    ctx.moveTo(bx0, by1 - cl); ctx.lineTo(bx0, by1); ctx.lineTo(bx0 + cl, by1);
    ctx.moveTo(bx1 - cl, by1); ctx.lineTo(bx1, by1); ctx.lineTo(bx1, by1 - cl);
    ctx.stroke();

    // High-Density Monospace Typography with Micro-Chromatic Aberration
    const clockFontSize = Math.max(16, Math.round(h * 0.062)); // ~35px on 566
    ctx.font = `700 ${clockFontSize}px 'JetBrains Mono', 'DIN Pro', 'Share Tech Mono', ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Red Channel Shift (+1.5px)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.fillText(timeStr, xc + 1.5, clockY);

    // Cyan Channel Shift (-1.5px)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.fillText(timeStr, xc - 1.5, clockY);

    // Core Monospace Glow Pass
    if (remainingSec < 3) {
      ctx.fillStyle = '#ff334b';
      ctx.shadowColor = 'rgba(255, 51, 75, 0.95)';
      ctx.shadowBlur = 20;
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 12;
    }
    ctx.fillText(timeStr, xc, clockY);
    ctx.restore();

    // 6. Dramatic Quote Subtitle (Bottom Center above ticker)
    if (d.quote && d.quote.trim()) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const quoteFontSize = Math.max(10, Math.round(h * 0.024));
      ctx.font = `italic 600 ${quoteFontSize}px 'Playfair Display', Georgia, serif`;
      ctx.fillStyle = 'rgba(244, 244, 245, 0.96)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 8;
      ctx.fillText(d.quote, xc, quoteY);
      ctx.restore();
    }

    // 7. High-Contrast Panic Ticker Tape at Bottom of Monitor
    if (d.tickerEnabled !== false) {
      ctx.save();
      // Clip to monitor bezel bounds
      ctx.beginPath();
      ctx.rect(chartX0, tickerY0, chartW, tickerH);
      ctx.clip();

      // Dark background bar
      ctx.fillStyle = 'rgba(8, 2, 4, 0.96)';
      ctx.fillRect(chartX0, tickerY0, chartW, tickerH);

      // Red top border line
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(chartX0, tickerY0);
      ctx.lineTo(chartX1, tickerY0);
      ctx.stroke();

      const textY = tickerY0 + tickerH / 2 + 1;
      const items = (d.tickerText || DEFAULT_CONFIG.tickerText).split(/[•|]/).map(s => s.trim()).filter(Boolean);

      const tickerFontSize = Math.max(9, Math.round(h * 0.022));
      ctx.font = `700 ${tickerFontSize}px 'JetBrains Mono', 'Share Tech Mono', monospace`;
      ctx.textBaseline = 'middle';

      // Measure items
      let totalTickerW = 0;
      const itemWidths = items.map(item => {
        const isBadge = item.includes('-') || item.includes('PAUSED') || item.includes('BANKRUPT');
        const badgeW = ctx.measureText(item).width + (isBadge ? 16 : 8);
        totalTickerW += badgeW + 16;
        return { text: item, isBadge, width: badgeW };
      });

      // Animated scrolling marquee offset
      const scrollSpeed = 45; // px per second
      const tickerOffset = -(elapsedSec * scrollSpeed) % (totalTickerW || 1);

      // Draw 2 passes for smooth infinite looping
      for (let pass = 0; pass < 2; pass++) {
        let curX = chartX0 + tickerOffset + pass * (totalTickerW + 30);
        for (let k = 0; k < itemWidths.length; k++) {
          const it = itemWidths[k];
          if (curX + it.width > chartX0 - 40 && curX < chartX1 + 40) {
            if (it.isBadge) {
              // Solid Red Pill Badge
              ctx.fillStyle = '#dc2626';
              const bH = tickerH * 0.65;
              const bY = tickerY0 + (tickerH - bH) / 2;
              ctx.beginPath();
              if (ctx.roundRect) {
                ctx.roundRect(curX, bY, it.width, bH, 4);
              } else {
                ctx.rect(curX, bY, it.width, bH);
              }
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.font = `800 ${tickerFontSize}px 'JetBrains Mono', monospace`;
              ctx.textAlign = 'center';
              ctx.fillText(it.text, curX + it.width / 2, textY);
            } else {
              ctx.fillStyle = '#fca5a5';
              ctx.font = `600 ${tickerFontSize}px 'JetBrains Mono', monospace`;
              ctx.textAlign = 'left';
              ctx.fillText(it.text, curX + 4, textY);
            }

            // Separator pipe
            ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
            ctx.textAlign = 'left';
            ctx.fillText('|', curX + it.width + 5, textY);
          }
          curX += it.width + 16;
        }
      }
      ctx.restore();
    }

    // 8. Composite Foreground Pinned Case Papers over monitor bezels
    if (assets.fgPapers && assets.fgPapers.complete && assets.fgPapers.naturalWidth > 0) {
      ctx.save();
      ctx.drawImage(assets.fgPapers, 0, 0, w, h);
      ctx.restore();
    }

    // 9. Optics: CRT Scanlines (opacity 0.08)
    if (d.crtEnabled !== false) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = h * 0.12; y < h * 0.90; y += 3) {
        ctx.fillRect(chartX0, y, chartW, 1.2);
      }
      ctx.restore();
    }

    // 10. Specular Glass Glare across top left corner
    ctx.save();
    const glareGrad = ctx.createLinearGradient(chartX0, h * 0.12, chartX0 + w * 0.18, h * 0.45);
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
    glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
    glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.beginPath();
    ctx.moveTo(chartX0, h * 0.12);
    ctx.lineTo(chartX0 + w * 0.22, h * 0.12);
    ctx.lineTo(chartX0 + w * 0.03, h * 0.45);
    ctx.lineTo(chartX0, h * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 11. Subtle Vignette
    const vigVal = (d.vignetteIntensity !== undefined ? d.vignetteIntensity : 80) / 100;
    if (vigVal > 0) {
      ctx.save();
      const vigGrad = ctx.createRadialGradient(xc, h * 0.5, w * 0.28, xc, h * 0.5, w * 0.65);
      vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vigGrad.addColorStop(1, `rgba(0,0,0,${vigVal * 0.72})`);
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  /**
   * Mounts the Countdown 3D Terminal Stage into the standard Customizer Modal (#modal-top-template-customizer)
   */
  window.tplMountCountdown3DStage = function(stage, data) {
    if (!stage) return;
    loadAssets();
    const d = getConfig(data);

    // Full 1338x566 resolution canvas that fills the stage without cropping
    stage.innerHTML = `
      <div id="countdown-3d-stage-inner" style="position: absolute; inset: 0; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <canvas id="countdown-3d-canvas" width="1338" height="566" style="width: 100%; height: 100%; object-fit: contain; display: block;"></canvas>
      </div>
    `;

    const canvas = stage.querySelector('#countdown-3d-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      renderCountdownCanvasFrame(ctx, canvas.width, canvas.height, d, 0, d.totalDuration || 10);
    }
  };

  /**
   * Stepper callback for hover preview loop & live customizer playback
   */
  window.stepCountdownAnimation = function(container, tplId, t, data) {
    if (!container) return;
    const canvas = container.querySelector('#countdown-3d-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const d = getConfig(data);
      renderCountdownCanvasFrame(ctx, canvas.width, canvas.height, d, t, d.totalDuration || 10);
    }
  };

  /**
   * Timeline Canvas Renderer
   */
  window.renderCountdownCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = getConfig(clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData);
    renderCountdownCanvasFrame(ctx, cw, ch, d, t, (clip && clip.duration) || d.totalDuration || 10);
  };

  /**
   * Contextual Inspector Controls Builder for Countdown Effect
   */
  window.tplBuildCountdownInspector = function(container, rawData, tplId) {
    if (!container) return;
    const d = getConfig(rawData);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 4px 0;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10.5px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.6px; display: flex; align-items: center; gap: 4px;">
              <span>⏱️</span> Countdown &amp; Panic Ticker
            </span>
          </div>
          <span style="font-size: 9px; color: #ef4444; font-weight: 800; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); padding: 2px 6px; border-radius: 4px;">
            3D WAR ROOM
          </span>
        </div>

        <!-- Section 1: Scenario Presets & Quick Actions -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Scenario Preset</span>
            <button type="button" id="btn-cd-trigger-climax" style="background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 2px 8px; border-radius: 4px; font-size: 9.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
              <span>⚡</span> Trigger Climax
            </button>
          </div>
          <select id="cd-select-preset" style="width: 100%; background: #07090e; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 6px 8px; color: #ffffff; font-size: 11px; outline: none; cursor: pointer;">
            <option value="ftx">FTX Collapse: T-Minus 24 Hours</option>
            <option value="theranos">Theranos Blood Fraud Climax</option>
            <option value="blackmonday">1987 Black Monday Crash</option>
            <option value="dotcom">Dot-Com Bubble Burst</option>
          </select>
        </div>

        <!-- Section 2: Text & Quotes -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Text &amp; Quotes</span>
          <div>
            <label style="font-size: 10px; color: #94a3b8; display: block; margin-bottom: 2px;">Headline Title</label>
            <input type="text" id="cd-input-title" value="${d.title || ''}" style="width: 100%; background: #07090e; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 6px 8px; color: #ffffff; font-size: 11px; outline: none;" />
          </div>
          <div>
            <label style="font-size: 10px; color: #94a3b8; display: block; margin-bottom: 2px;">Dramatic Quote</label>
            <textarea id="cd-input-quote" rows="2" style="width: 100%; background: #07090e; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 6px 8px; color: #ffffff; font-size: 11px; outline: none; resize: vertical; font-style: italic;">${d.quote || ''}</textarea>
          </div>
        </div>

        <!-- Section 3: Stock Ticker Tape -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Stock Ticker Tape</span>
            <label style="font-size: 10px; color: #a1a1aa; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="cd-check-ticker" ${d.tickerEnabled !== false ? 'checked' : ''} style="accent-color: #ef4444;" />
              <span>Enable</span>
            </label>
          </div>
          <textarea id="cd-input-ticker" rows="2" style="width: 100%; background: #07090e; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 6px 8px; color: #f87171; font-size: 10px; outline: none; resize: vertical; font-family: ui-monospace, monospace;">${d.tickerText || ''}</textarea>
        </div>

        <!-- Section 4: Backdrop Image -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Backdrop Image</span>
            <label for="cd-upload-bg-input" style="font-size: 10px; color: #ef4444; cursor: pointer; font-weight: 600;">
              + Upload
            </label>
            <input type="file" id="cd-upload-bg-input" accept="image/*" style="display: none;" />
          </div>
          <div style="display: flex; gap: 6px;">
            <input type="text" id="cd-input-bg-url" placeholder="Image URL..." value="${d.customBgUrl || ''}" style="flex: 1; background: #07090e; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 5px 8px; color: #ffffff; font-size: 10px; outline: none;" />
            <button type="button" id="btn-cd-clear-bg" style="padding: 5px 8px; font-size: 10px; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; cursor: pointer;">
              Clear
            </button>
          </div>
        </div>

        <!-- Section 5: Timer Configuration & Modes -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px;">
            <span style="color: #cbd5e1; font-weight: 700;">DURATION</span>
            <span id="cd-val-duration" style="color: #ef4444; font-weight: 700; font-family: monospace;">${d.totalDuration || 10}s</span>
          </div>
          <input type="range" id="cd-slider-duration" min="3" max="30" value="${d.totalDuration || 10}" style="width: 100%; accent-color: #ef4444; cursor: pointer;" />

          <label style="font-size: 9.5px; color: #94a3b8; margin-top: 4px; text-transform: uppercase;">Display Mode</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" class="btn-cd-mode ${d.displayMode !== 'clock' ? 'active' : ''}" data-mode="tminus" style="padding: 6px 4px; font-size: 10.5px; font-weight: 700; border-radius: 6px; background: ${d.displayMode !== 'clock' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${d.displayMode !== 'clock' ? '#ef4444' : 'rgba(255,255,255,0.08)'}; color: ${d.displayMode !== 'clock' ? '#f87171' : '#a1a1aa'}; cursor: pointer; text-align: center;">
              T-MINUS 00:00
            </button>
            <button type="button" class="btn-cd-mode ${d.displayMode === 'clock' ? 'active' : ''}" data-mode="clock" style="padding: 6px 4px; font-size: 10.5px; font-weight: 700; border-radius: 6px; background: ${d.displayMode === 'clock' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${d.displayMode === 'clock' ? '#ef4444' : 'rgba(255,255,255,0.08)'}; color: ${d.displayMode === 'clock' ? '#f87171' : '#a1a1aa'}; cursor: pointer; text-align: center;">
              24H CLOCK
            </button>
          </div>
        </div>

        <!-- Section 6: Atmospheric Overlays -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Atmospheric Overlays</span>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #a1a1aa;">
            <span>Vignette &amp; Spotlight Penumbra</span>
            <span id="cd-val-vignette" style="font-family: monospace; color: #ef4444;">${d.vignetteIntensity !== undefined ? d.vignetteIntensity : 80}%</span>
          </div>
          <input type="range" id="cd-slider-vignette" min="0" max="100" value="${d.vignetteIntensity !== undefined ? d.vignetteIntensity : 80}" style="width: 100%; accent-color: #ef4444; cursor: pointer;" />
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span style="font-size: 10.5px; color: #cbd5e1;">CRT Scanlines (Opacity 0.08)</span>
            <input type="checkbox" id="cd-check-crt" ${d.crtEnabled !== false ? 'checked' : ''} style="accent-color: #ef4444;" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10.5px; color: #cbd5e1;">Climax Screen Shake</span>
            <input type="checkbox" id="cd-check-shake" ${d.shakeEnabled !== false ? 'checked' : ''} style="accent-color: #ef4444;" />
          </div>
        </div>
      </div>
    `;

    // Wire up listeners
    const update = (patch) => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(TEMPLATE_ID, patch);
      }
      const stage = document.getElementById('tpl-modal-preview-stage');
      const curData = getConfig(patch);
      if (stage) {
        const canvas = stage.querySelector('#countdown-3d-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const elapsed = (typeof topCustomizerState !== 'undefined' && topCustomizerState.startTime)
            ? (performance.now() - topCustomizerState.startTime) / 1000
            : 0;
          renderCountdownCanvasFrame(ctx, canvas.width, canvas.height, curData, elapsed, curData.totalDuration || 10);
        }
      }
    };

    // Headline & Quote
    container.querySelector('#cd-input-title')?.addEventListener('input', (e) => {
      update({ title: e.target.value });
    });
    container.querySelector('#cd-input-quote')?.addEventListener('input', (e) => {
      update({ quote: e.target.value });
    });

    // Ticker
    container.querySelector('#cd-check-ticker')?.addEventListener('change', (e) => {
      update({ tickerEnabled: e.target.checked });
    });
    container.querySelector('#cd-input-ticker')?.addEventListener('input', (e) => {
      update({ tickerText: e.target.value });
    });

    // Duration slider
    const slDur = container.querySelector('#cd-slider-duration');
    const valDur = container.querySelector('#cd-val-duration');
    slDur?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10) || 10;
      if (valDur) valDur.textContent = `${v}s`;
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.duration = v;
      }
      update({ totalDuration: v });
    });

    // Mode buttons
    container.querySelectorAll('.btn-cd-mode').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        container.querySelectorAll('.btn-cd-mode').forEach(b => {
          const isActive = b.dataset.mode === mode;
          b.style.background = isActive ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)';
          b.style.borderColor = isActive ? '#ef4444' : 'rgba(255,255,255,0.08)';
          b.style.color = isActive ? '#f87171' : '#a1a1aa';
        });
        update({ displayMode: mode });
      });
    });

    // Scenario preset selector
    const PRESETS = {
      ftx: {
        title: 'FTX LIQUIDITY CRASH',
        duration: 10,
        tickerText: '$FTT -94.2%  |  BTC $15,820 (-22.4%)  |  BINANCE WITHDRAWALS PAUSED  |  $ETH $1,080 (-28.9%)  |  ALAMEDA RESEARCH BANKRUPT',
        quote: '"And in less than 48 hours... $32 Billion vanished into thin air."'
      },
      theranos: {
        title: 'THERANOS FRAUD CLIMAX',
        duration: 12,
        tickerText: 'SEC INVESTIGATION DEEPENS  |  EDISON DEVICE VOIDED  |  FDA INJUNCTION ISSUED  |  VALUATION $9B -> $0',
        quote: '"First they think you’re crazy, then they fight you, then you lose everything."'
      },
      blackmonday: {
        title: 'OCTOBER 19, 1987 - BLACK MONDAY',
        duration: 15,
        tickerText: 'DOW JONES -22.6%  |  S&P 500 PANIC SELLING  |  LONDON STOCK EXCHANGE CRASHES  |  PROGRAMMED SELLING OVERWHELMED',
        quote: '"The fastest single-day stock collapse in financial history."'
      },
      dotcom: {
        title: 'THE DOT-COM IMPLOSION',
        duration: 8,
        tickerText: 'NASDAQ -78%  |  PETS.COM LIQUIDATED  |  WEBVAN BANKRUPTCY  |  VENTURE CAPITAL DRY UP',
        quote: '"Euphoria turned into an unprecedented digital carnage."'
      }
    };

    container.querySelector('#cd-select-preset')?.addEventListener('change', (e) => {
      const preset = PRESETS[e.target.value];
      if (preset) {
        const inpTitle = container.querySelector('#cd-input-title');
        const inpQuote = container.querySelector('#cd-input-quote');
        const inpTicker = container.querySelector('#cd-input-ticker');
        const slDurEl = container.querySelector('#cd-slider-duration');
        const valDurEl = container.querySelector('#cd-val-duration');

        if (inpTitle) inpTitle.value = preset.title;
        if (inpQuote) inpQuote.value = preset.quote;
        if (inpTicker) inpTicker.value = preset.tickerText;
        if (slDurEl) slDurEl.value = preset.duration;
        if (valDurEl) valDurEl.textContent = `${preset.duration}s`;
        if (typeof topCustomizerState !== 'undefined') {
          topCustomizerState.duration = preset.duration;
        }

        update({
          title: preset.title,
          quote: preset.quote,
          tickerText: preset.tickerText,
          totalDuration: preset.duration
        });
      }
    });

    // Climax Trigger button
    container.querySelector('#btn-cd-trigger-climax')?.addEventListener('click', () => {
      if (typeof window.showTextTimingAlert === 'function') {
        window.showTextTimingAlert('⚡ SYSTEMIC COLLAPSE CLIMAX TRIGGERED!', 'info');
      }
      // Replay from climax (near end)
      if (typeof topCustomizerState !== 'undefined') {
        const curDur = d.totalDuration || 10;
        topCustomizerState.startTime = performance.now() - ((curDur - 2.0) * 1000);
      }
    });

    // Vignette & Overlays
    const slVig = container.querySelector('#cd-slider-vignette');
    const valVig = container.querySelector('#cd-val-vignette');
    slVig?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10) || 0;
      if (valVig) valVig.textContent = `${v}%`;
      update({ vignetteIntensity: v });
    });

    container.querySelector('#cd-check-crt')?.addEventListener('change', (e) => {
      update({ crtEnabled: e.target.checked });
    });

    container.querySelector('#cd-check-shake')?.addEventListener('change', (e) => {
      update({ shakeEnabled: e.target.checked });
    });

    // Backdrop URL & Upload
    container.querySelector('#cd-input-bg-url')?.addEventListener('change', (e) => {
      const url = e.target.value.trim();
      if (url) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => update({ customBgImage: img, customBgUrl: url });
        img.src = url;
      }
    });

    container.querySelector('#btn-cd-clear-bg')?.addEventListener('click', () => {
      const inp = container.querySelector('#cd-input-bg-url');
      if (inp) inp.value = '';
      update({ customBgImage: null, customBgUrl: '' });
    });

    container.querySelector('#cd-upload-bg-input')?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => update({ customBgImage: img, customBgUrl: 'Uploaded File' });
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  };

})();
