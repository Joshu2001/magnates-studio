/**
 * Photorealistic 3D Deal Term Sheet Signing Engine (Doc-Drama Standard)
 * Replicating top-tier documentary aesthetics (James Jani, Magnates Media, Vox)
 *
 * Major Overhaul & Granularity:
 * 1. Infinite Studio Environment:
 *    - Removed all outdoor mountain/map artifacts; full 360-degree executive dark studio.
 *    - 3 Selectable Executive Surfaces: Executive Mahogany, Dark Leather Blotter with Perimeter Gold Stitching, and Noir Slate Studio.
 *    - Focused warm key spotlight with natural penumbra and realistic ambient occlusion contact shadow.
 * 2. True-to-Life US Letter Physical Geometry:
 *    - Scaled to realistic 8.5" x 11" aspect ratio with authentic ultra-thin 24lb cotton paper sheet thickness (0.08 units).
 *    - Eliminates bulky cardboard slab appearance for genuine paper materiality.
 * 3. Deep Granular Text & Highlighting System:
 *    - Term-by-Term row builder: edit label, value, individually toggle highlight on/off, and pick custom highlighter color per line.
 *    - Editable document header, confidential banner, company name, date, and preamble.
 *    - Editable fine print clauses 2 & 3.
 *    - Editable signee name, title, and fountain pen ink color.
 *    - Granular dual rubber stamps (DEAL CLOSED & APPROVED) with custom text, individual color pickers, toggle checkboxes, and tilt angle sliders.
 * 4. Proportional Animation Engine:
 *    - All timings (highlighter sweeps, cursive signature trailing, rubber stamp impacts) are proportional to clip duration,
 *      guaranteeing all animations execute and resolve cleanly whether clip is 3.0s, 5.0s, or 10.0s.
 * 5. Full Contextual Inspector Integration:
 *    - Segmented [ ▶ Video ] [ ⬡ 3D ] switcher.
 *    - 3D Camera Tilt Pitch & Rotation Yaw sliders with instant presets (Cinematic 30°, Isometric 45°, Top-Down).
 *    - Preserved interactive floating hover HUD (scrubber, play/pause, timecode).
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'deal-term-sheet';

  // Default Doc-Drama Legal Term Sheet Configuration
  const DEFAULT_CONFIG = {
    type: 'deal-term-sheet',
    is3DMode: true,
    cameraPitch: 29,
    cameraYaw: -13,
    title: 'TERM SHEET \u00b7 SERIES A',
    confidentialBadge: 'STRICTLY CONFIDENTIAL \u00b7 FOR DISCUSSION ONLY',
    companyName: 'ACME CORP / ATLAS VENTURES',
    dateText: 'October 24, 2024 \u00b7 Wilmington, Delaware',
    preamble: 'The undersigned parties enter into this binding Term Sheet setting forth the principal terms of the Series A Preferred Stock financing in accordance with Section 4(a)(2) of the Securities Act of 1933.',
    dealTerms: [
      { id: 'term-1', label: 'Valuation:', value: '$80M pre-money', highlighted: true, color: '#facc15' },
      { id: 'term-2', label: 'Investment:', value: '$12M for 15%', highlighted: true, color: '#facc15' },
      { id: 'term-3', label: 'Board Seats:', value: '2 Investor, 3 Founder', highlighted: false, color: '#4ade80' },
      { id: 'term-4', label: 'Liquidation Pref:', value: '1x Non-Participating', highlighted: false, color: '#38bdf8' },
      { id: 'term-5', label: 'Option Pool:', value: '10% Unallocated Post-Closing', highlighted: false, color: '#f43f5e' }
    ],
    valuationText: 'Valuation: $80M pre-money',
    investmentText: 'Investment: $12M for 15%',
    boardSeatsText: 'Board seats: 2 investor, 3 founder',
    liquidationPrefText: 'Liquidation pref: 1x non-participating',
    clause2: '2. The definitive agreements shall contain customary representations, warranties and covenants. All intellectual property of the company shall be fully assigned to the corporation upon closing.',
    clause3: '3. The fountain pen ink shall constitute binding execution upon delivery to legal escrow under Delaware Law.',
    signatureLabel: 'Authorized Signature,',
    signeeName: 'Alexander Vance',
    signeeTitle: 'CEO & Managing Partner',
    inkColor: '#1e293b',
    stamp1Text: 'DEAL CLOSED',
    stamp1Color: '#b91c1c',
    stamp1Angle: -14,
    stamp2Text: 'APPROVED',
    stamp2Color: '#b91c1c',
    stamp2Angle: -16,
    showStamp1: true,
    showStamp2: true,
    paperTone: '#f5f0e1',
    highlighterColor: '#facc15',
    surfaceType: 'mahogany', // 'mahogany', 'leather', 'noir_slate'
    cameraPreset: 'macro_cinematic',
    lightWarmth: '#fff3db',
    lightIntensity: 2.4,
    duration: 5.0
  };

  /**
   * Normalizes configuration data ensuring backward compatibility
   */
  function normalizeConfig(data) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    if (!d.dealTerms || !Array.isArray(d.dealTerms) || d.dealTerms.length === 0) {
      d.dealTerms = [
        { id: 'term-1', label: 'Valuation:', value: (d.valuationText || 'Valuation: $80M pre-money').replace(/^Valuation:\s*/i, '') || '$80M pre-money', highlighted: true, color: d.highlighterColor || '#facc15' },
        { id: 'term-2', label: 'Investment:', value: (d.investmentText || 'Investment: $12M for 15%').replace(/^Investment:\s*/i, '') || '$12M for 15%', highlighted: true, color: d.highlighterColor || '#facc15' },
        { id: 'term-3', label: 'Board Seats:', value: (d.boardSeatsText || 'Board seats: 2 investor, 3 founder').replace(/^Board seats:\s*/i, '') || '2 Investor, 3 Founder', highlighted: false, color: '#4ade80' },
        { id: 'term-4', label: 'Liquidation Pref:', value: (d.liquidationPrefText || 'Liquidation pref: 1x non-participating').replace(/^Liquidation pref:\s*/i, '') || '1x Non-Participating', highlighted: false, color: '#38bdf8' }
      ];
    }
    return d;
  }

  // Three.js Scene References
  let tsScene = null;
  let tsCamera = null;
  let tsRenderer = null;
  let tsAnimFrame = null;
  let tsControls = null;
  let tsGroup = null;

  // Meshes
  let paperBoxMesh = null;
  let paperFrontMesh = null;
  let tableMesh = null;
  let contactShadowMesh = null;

  // Lighting
  let spotLight = null;
  let ambientLight = null;
  let rimLight = null;

  // Animation state
  let isManualScrub = false;
  let manualT = 0;
  let animClock = 0;
  let lastTimestamp = 0;

  // Video Mode State
  let videoAnimFrame = null;
  let videoClock = 0;
  let videoLastTimestamp = 0;

  // Texture Cache
  const textureCache = new Map();
  const surfaceCache = new Map();
  const imageAssets = new Map();

  function preloadImage(url) {
    if (!url || imageAssets.has(url)) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageAssets.set(url, img);
      surfaceCache.clear();
    };
    img.src = url;
    imageAssets.set(url, img);
  }

  preloadImage('/mahogany_desk_texture.jpg');

  /**
   * Generates procedural desk surface texture (Mahogany, Leather Blotter, or Noir Slate)
   */
  function generateDeskTexture(surfaceType) {
    const key = `surf_${surfaceType}`;
    if (surfaceCache.has(key)) return surfaceCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 1024;
    const ctx = cv.getContext('2d');

    if (surfaceType === 'leather') {
      // Executive Dark Leather Desk Mat with Warm Perimeter Stitching
      ctx.fillStyle = '#0c0f14';
      ctx.fillRect(0, 0, 1024, 1024);

      // Pebble grain noise
      const imgData = ctx.getImageData(0, 0, 1024, 1024);
      const p = imgData.data;
      for (let i = 0; i < p.length; i += 4) {
        const n = (Math.random() - 0.5) * 12;
        p[i] = Math.min(255, Math.max(0, 12 + n));
        p[i + 1] = Math.min(255, Math.max(0, 15 + n));
        p[i + 2] = Math.min(255, Math.max(0, 20 + n));
      }
      ctx.putImageData(imgData, 0, 0);

      // Amber/Gold perimeter saddle stitching
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([9, 9]);
      ctx.strokeRect(40, 40, 944, 944);
      ctx.setLineDash([]);
    } else if (surfaceType === 'noir_slate') {
      // Minimalist Studio Slate
      const g = ctx.createLinearGradient(0, 0, 1024, 1024);
      g.addColorStop(0, '#090b10');
      g.addColorStop(0.5, '#11151f');
      g.addColorStop(1, '#07080c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 1024);

      const imgData = ctx.getImageData(0, 0, 1024, 1024);
      const p = imgData.data;
      for (let i = 0; i < p.length; i += 4) {
        const n = (Math.random() - 0.5) * 14;
        p[i] = Math.min(255, Math.max(0, p[i] + n));
        p[i + 1] = Math.min(255, Math.max(0, p[i + 1] + n));
        p[i + 2] = Math.min(255, Math.max(0, p[i + 2] + n));
      }
      ctx.putImageData(imgData, 0, 0);
    } else {
      // Executive Mahogany Woodgrain
      const mahoganyImg = imageAssets.get('/mahogany_desk_texture.jpg');
      if (mahoganyImg && mahoganyImg.complete && mahoganyImg.naturalWidth > 0) {
        ctx.drawImage(mahoganyImg, 0, 0, 1024, 1024);
        ctx.fillStyle = 'rgba(10, 5, 2, 0.42)';
        ctx.fillRect(0, 0, 1024, 1024);
      } else {
        const g = ctx.createLinearGradient(0, 0, 1024, 1024);
        g.addColorStop(0, '#150804');
        g.addColorStop(0.3, '#260e06');
        g.addColorStop(0.6, '#1a0904');
        g.addColorStop(1, '#0e0502');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.fillStyle = 'rgba(217, 119, 6, 0.05)';
        for (let i = 0; i < 40; i++) {
          ctx.fillRect(0, i * 26, 1024, 10 + Math.random() * 8);
        }
      }
    }

    // Vignette falloff on desk borders
    const rad = ctx.createRadialGradient(512, 512, 200, 512, 512, 512);
    rad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 1024, 1024);

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.5, 2.8);
    surfaceCache.set(key, tex);
    return tex;
  }

  /**
   * Generates high-resolution US Letter procedural canvas texture (8.5" x 11" ratio: 1536 x 1988 px)
   * With cotton paper micro-grain, formal legal typography, individual highlighter sweeps per term,
   * fountain-pen signature ink with pressure variation, and dual rubber stamps.
   */
  function generateTermSheetTexture(rawConfig, t) {
    const data = normalizeConfig(rawConfig);
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t !== undefined ? t : (dur * 0.95)));

    // Cache key quantized to ~30fps
    const frameIndex = Math.round(ct * 30);
    const termsSummary = data.dealTerms.map(x => `${x.label}:${x.value}:${x.highlighted ? 1 : 0}:${x.color}`).join('|');
    const key = `ts_${frameIndex}_${data.title}_${data.paperTone}_${data.signeeName}_${data.stamp1Text}_${data.stamp2Text}_${data.showStamp1}_${data.showStamp2}_${termsSummary}`;

    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 1988; // 8.5 x 11 ratio
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Off-white / Ivory Cotton Paper Base Tone
    ctx.fillStyle = data.paperTone || '#f5f0e1';
    ctx.fillRect(0, 0, w, h);

    // Subtle edge aging & vignette on paper
    const paperGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.28, w * 0.5, h * 0.5, w * 0.72);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    paperGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
    paperGrad.addColorStop(1, 'rgba(120, 85, 45, 0.14)');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Cotton Paper Micro-Fiber Grain
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 8) {
      const n = (Math.random() - 0.5) * 10;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle fine legal borders
    ctx.strokeStyle = 'rgba(40, 25, 15, 0.12)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(48, 48, w - 96, h - 96);

    const marginX = 135;
    let currentY = 125;

    // 3. Top Confidentiality Banner
    ctx.fillStyle = '#64748b';
    ctx.font = '700 17px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(data.confidentialBadge || 'STRICTLY CONFIDENTIAL \u00b7 FOR DISCUSSION ONLY', w * 0.5, currentY);

    currentY += 24;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, currentY);
    ctx.lineTo(w - marginX, currentY);
    ctx.stroke();

    currentY += 50;

    // 4. Document Title
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 38px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(data.title || 'TERM SHEET \u00b7 SERIES A', w * 0.5, currentY);

    currentY += 28;

    // Company & Date Telemetry
    ctx.font = '600 20px "Courier New", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`${data.companyName || 'ACME CORP / ATLAS VENTURES'} \u2014 ${data.dateText || 'October 24, 2024'}`, w * 0.5, currentY);

    currentY += 22;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.moveTo(marginX, currentY);
    ctx.lineTo(w - marginX, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    currentY += 55;

    // 5. Legal Preamble (Paragraph)
    ctx.fillStyle = '#475569';
    ctx.font = '500 20px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';

    const preambleWords = (data.preamble || '').split(' ');
    let currentLine = '';
    const maxLineW = w - marginX * 2;

    for (let i = 0; i < preambleWords.length; i++) {
      const testLine = currentLine ? `${currentLine} ${preambleWords[i]}` : preambleWords[i];
      if (ctx.measureText(testLine).width > maxLineW && currentLine) {
        ctx.fillText(currentLine, marginX, currentY);
        currentY += 30;
        currentLine = preambleWords[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      ctx.fillText(currentLine, marginX, currentY);
      currentY += 30;
    }

    currentY += 30;

    // Section 1 Header
    ctx.fillStyle = '#1e293b';
    ctx.font = '800 22px "JetBrains Mono", monospace';
    ctx.fillText('1. PRINCIPAL FINANCING TERMS', marginX, currentY);
    currentY += 40;

    // 6. Dynamic Deal Terms with Granular Highlighter Sweeps
    // Timing: Highlighters sweep between 0.15 * dur and 0.42 * dur
    const hlStart = 0.15 * dur;
    const hlEnd = 0.42 * dur;
    const hlTerms = data.dealTerms.filter(t => t.highlighted);
    const hlCount = Math.max(1, hlTerms.length);

    let hlIndex = 0;
    data.dealTerms.forEach((term) => {
      let sweepProg = 0;
      if (term.highlighted) {
        const t0 = hlStart + (hlIndex / hlCount) * (hlEnd - hlStart);
        const t1 = t0 + (1 / hlCount) * (hlEnd - hlStart);
        sweepProg = Math.max(0, Math.min(1, (ct - t0) / Math.max(0.01, t1 - t0)));
        hlIndex++;
      }

      const fullText = `${term.label} ${term.value}`;
      ctx.font = '800 32px "JetBrains Mono", monospace';
      const labelW = ctx.measureText(`${term.label} `).width;
      const valW = ctx.measureText(term.value).width;

      // Draw highlighter sweep over the value text
      if (term.highlighted && sweepProg > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = term.color || '#facc15';

        const drawW = valW * sweepProg;
        const startX = marginX + labelW - 6;

        ctx.beginPath();
        ctx.moveTo(startX, currentY - 28);
        ctx.lineTo(startX + drawW, currentY - 28);
        ctx.lineTo(startX + drawW + 6, currentY + 10);
        ctx.lineTo(startX - 6, currentY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw Term Label & Value
      ctx.fillStyle = '#475569';
      ctx.fillText(term.label, marginX, currentY);
      ctx.fillStyle = '#0f172a';
      ctx.fillText(term.value, marginX + labelW, currentY);

      currentY += 56;
    });

    currentY += 20;

    // Section 2 Header & Clauses
    ctx.fillStyle = '#1e293b';
    ctx.font = '800 22px "JetBrains Mono", monospace';
    ctx.fillText('2. GOVERNANCE & EXECUTION COVENANTS', marginX, currentY);
    currentY += 34;

    ctx.font = '500 19px "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';

    const clause2Text = data.clause2 || '2. The definitive agreements shall contain customary representations, warranties and covenants.';
    ctx.fillText(clause2Text.slice(0, 105), marginX, currentY);
    currentY += 28;
    if (clause2Text.length > 105) {
      ctx.fillText(clause2Text.slice(105, 210), marginX + 24, currentY);
      currentY += 28;
    }

    const clause3Text = data.clause3 || '3. The fountain pen ink shall constitute binding execution upon delivery to legal escrow.';
    ctx.fillText(clause3Text.slice(0, 105), marginX, currentY);
    currentY += 28;
    if (clause3Text.length > 105) {
      ctx.fillText(clause3Text.slice(105, 210), marginX + 24, currentY);
      currentY += 28;
    }

    currentY += 50;

    // 7. Signature Line & Fountain Pen Cursive Execution
    // Timing: Signature draws between 0.45 * dur and 0.68 * dur
    const sigStart = 0.45 * dur;
    const sigEnd = 0.68 * dur;
    const sigProgress = Math.max(0, Math.min(1, (ct - sigStart) / Math.max(0.01, sigEnd - sigStart)));

    ctx.fillStyle = '#1e293b';
    ctx.font = '700 26px "Georgia", serif';
    ctx.fillText(data.signatureLabel || 'Authorized Signature,', marginX, currentY);

    // Signature formal rule
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(marginX + 280, currentY + 4);
    ctx.lineTo(marginX + 700, currentY + 4);
    ctx.stroke();

    // Fountain Pen Cursive Animation with Dynamic Pressure Trailing
    if (sigProgress > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = data.inkColor || '#1e293b';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const sigPoints = [
        { x: marginX + 290, y: currentY - 5, w: 2.2 },
        { x: marginX + 305, y: currentY - 38, w: 4.2 },
        { x: marginX + 325, y: currentY + 2, w: 3.5 },
        { x: marginX + 340, y: currentY - 26, w: 2.4 },
        { x: marginX + 358, y: currentY - 4, w: 3.8 },
        { x: marginX + 375, y: currentY - 48, w: 4.8 },
        { x: marginX + 392, y: currentY + 4, w: 3.0 },
        { x: marginX + 415, y: currentY - 18, w: 2.5 },
        { x: marginX + 435, y: currentY - 5, w: 3.6 },
        { x: marginX + 458, y: currentY - 28, w: 2.2 },
        { x: marginX + 485, y: currentY - 4, w: 3.8 },
        { x: marginX + 510, y: currentY - 44, w: 4.6 },
        { x: marginX + 530, y: currentY + 6, w: 2.8 },
        { x: marginX + 555, y: currentY - 16, w: 3.2 },
        { x: marginX + 585, y: currentY - 6, w: 2.6 },
        { x: marginX + 620, y: currentY - 32, w: 4.2 },
        { x: marginX + 655, y: currentY - 4, w: 3.4 },
        { x: marginX + 695, y: currentY - 12, w: 1.8 }
      ];

      const totalSegments = sigPoints.length - 1;
      const targetSegments = Math.floor(sigProgress * totalSegments);
      const frac = (sigProgress * totalSegments) - targetSegments;

      for (let i = 0; i < targetSegments && i < totalSegments; i++) {
        const p1 = sigPoints[i];
        const p2 = sigPoints[i + 1];
        ctx.lineWidth = p1.w;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 4, p2.x, p2.y);
        ctx.stroke();
      }

      if (targetSegments < totalSegments && frac > 0) {
        const p1 = sigPoints[targetSegments];
        const p2 = sigPoints[targetSegments + 1];
        const curX = p1.x + (p2.x - p1.x) * frac;
        const curY = p1.y + (p2.y - p1.y) * frac;
        ctx.lineWidth = p1.w;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(curX, curY);
        ctx.stroke();

        ctx.fillStyle = data.inkColor || '#1e293b';
        ctx.beginPath();
        ctx.arc(curX, curY, p1.w * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Signee sub-label & Title
    ctx.font = '600 18px "Courier New", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`${(data.signeeName || 'Alexander Vance').toUpperCase()} \u2014 ${(data.signeeTitle || 'CEO & Managing Partner').toUpperCase()}`, marginX + 280, currentY + 36);

    // 8. Granular Rubber Stamps
    // Stamp 1 slams at 0.72 * dur
    const stamp1Time = 0.72 * dur;
    const stampDur = Math.max(0.2, 0.08 * dur);

    if (data.showStamp1 !== false && ct >= stamp1Time) {
      const stampProg1 = Math.max(0, Math.min(1, (ct - stamp1Time) / stampDur));
      const scale1 = stampProg1 < 0.6
        ? (2.2 - (stampProg1 / 0.6) * 1.25)
        : (0.95 + (stampProg1 - 0.6) * 0.125);
      const alpha1 = Math.min(1, stampProg1 * 1.8);

      const radAngle1 = ((data.stamp1Angle !== undefined ? data.stamp1Angle : -14) * Math.PI) / 180;
      drawRubberStamp(ctx, {
        text: data.stamp1Text || 'DEAL CLOSED',
        x: w * 0.74,
        y: h * 0.78,
        angle: radAngle1,
        scale: scale1,
        alpha: alpha1,
        color: data.stamp1Color || '#b91c1c'
      });
    }

    // Stamp 2 slams at 0.83 * dur
    const stamp2Time = 0.83 * dur;
    if (data.showStamp2 !== false && ct >= stamp2Time) {
      const stampProg2 = Math.max(0, Math.min(1, (ct - stamp2Time) / stampDur));
      const scale2 = stampProg2 < 0.6
        ? (2.2 - (stampProg2 / 0.6) * 1.25)
        : (0.95 + (stampProg2 - 0.6) * 0.125);
      const alpha2 = Math.min(1, stampProg2 * 1.8);

      const radAngle2 = ((data.stamp2Angle !== undefined ? data.stamp2Angle : -16) * Math.PI) / 180;
      drawRubberStamp(ctx, {
        text: data.stamp2Text || 'APPROVED',
        x: w * 0.81,
        y: h * 0.86,
        angle: radAngle2,
        scale: scale2,
        alpha: alpha2,
        color: data.stamp2Color || '#b91c1c'
      });
    }

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Helper: draws a weathered rubber stamp with multiply blending and porous ink distress
   */
  function drawRubberStamp(ctx, opts) {
    const { text, x, y, angle, scale, alpha, color } = opts;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'multiply';
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.font = '900 36px "JetBrains Mono", "Impact", sans-serif';
    const textMetrics = ctx.measureText(text);
    const boxW = textMetrics.width + 48;
    const boxH = 60;

    // Distressed rubber stamp double border
    ctx.strokeStyle = color || '#b91c1c';
    ctx.lineWidth = 4;
    ctx.strokeRect(-boxW * 0.5, -boxH * 0.5, boxW, boxH);

    ctx.lineWidth = 1.5;
    ctx.strokeRect(-boxW * 0.5 + 4, -boxH * 0.5 + 4, boxW - 8, boxH - 8);

    // Weathered stamp text
    ctx.fillStyle = color || '#b91c1c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 1);

    // Stamp micro-distress / voids
    ctx.fillStyle = 'rgba(245, 240, 225, 0.45)';
    for (let i = 0; i < 30; i++) {
      const rx = (Math.random() - 0.5) * boxW;
      const ry = (Math.random() - 0.5) * boxH;
      const rw = 2 + Math.random() * 4;
      const rh = 1 + Math.random() * 3;
      ctx.fillRect(rx, ry, rw, rh);
    }

    ctx.restore();
  }

  /**
   * Builds the 3D Studio Environment:
   * Infinite Studio Desk Surface (Mahogany, Leather, or Noir Slate) with warm key spotlight
   * and soft contact shadow. Completely removed any mountain or clutter.
   */
  function buildStudioEnvironment(data) {
    const tableGeo = new THREE.PlaneGeometry(3500, 2500);
    const tableTex = generateDeskTexture(data.surfaceType || 'mahogany');

    const tableMat = new THREE.MeshStandardMaterial({
      map: tableTex,
      roughness: data.surfaceType === 'leather' ? 0.72 : (data.surfaceType === 'noir_slate' ? 0.85 : 0.58),
      metalness: data.surfaceType === 'noir_slate' ? 0.02 : 0.06
    });

    tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.receiveShadow = true;
    tableMesh.position.set(0, -1.0, 0);
    tableMesh.rotation.x = -Math.PI / 2;
    tsScene.add(tableMesh);

    // Soft Ambient Occlusion & Contact Shadow Plane beneath Paper
    const shadowCv = document.createElement('canvas');
    shadowCv.width = 512;
    shadowCv.height = 512;
    const sCtx = shadowCv.getContext('2d');
    const sGrad = sCtx.createRadialGradient(256, 256, 80, 256, 256, 250);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.38)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCv);
    const shadowGeo = new THREE.PlaneGeometry(240, 290);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.rotation.z = THREE.MathUtils.degToRad(8);
    contactShadowMesh.position.set(20, -0.6, 12);
    tsScene.add(contactShadowMesh);
  }

  /**
   * Builds the 3D Vertical US Letter Legal Term Sheet Mesh ($8.5" \times 11"$)
   * Uses authentic ultra-thin paper thickness (0.08 units) to eliminate the bulky slab appearance.
   */
  function buildTermSheetAssembly(data, t) {
    if (tsGroup && tsScene) {
      tsScene.remove(tsGroup);
      tsGroup = null;
    }

    tsGroup = new THREE.Group();

    // 8.5" x 11" Paper Geometry: width = 140, height = 181.18, thickness = 0.08
    const docWidth = 140;
    const docHeight = 181.18;
    const docThickness = 0.08;

    const paperCanvas = generateTermSheetTexture(data, t);
    const paperTex = new THREE.CanvasTexture(paperCanvas);
    paperTex.anisotropy = 8;
    paperTex.generateMipmaps = true;

    // Physical paper edge box
    const sideMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(data.paperTone || '#f5f0e1'),
      roughness: 0.9,
      metalness: 0.01
    });

    const docGeo = new THREE.BoxGeometry(docWidth, docThickness, docHeight);
    paperBoxMesh = new THREE.Mesh(docGeo, sideMat);
    paperBoxMesh.castShadow = true;
    paperBoxMesh.receiveShadow = true;
    paperBoxMesh.position.set(0, docThickness * 0.5, 0);
    tsGroup.add(paperBoxMesh);

    // Front Face Plane with Canvas Texture
    const frontMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.82,
      metalness: 0.02
    });

    const frontGeo = new THREE.PlaneGeometry(docWidth, docHeight);
    paperFrontMesh = new THREE.Mesh(frontGeo, frontMat);
    paperFrontMesh.rotation.x = -Math.PI / 2;
    paperFrontMesh.position.set(0, docThickness + 0.01, 0);
    paperFrontMesh.castShadow = true;
    paperFrontMesh.receiveShadow = true;
    tsGroup.add(paperFrontMesh);

    // Apply 3D Spatial Framing Tilt
    const pitch = (data.cameraPitch !== undefined) ? data.cameraPitch : 29;
    const yaw = (data.cameraYaw !== undefined) ? data.cameraYaw : -13;
    tsGroup.rotation.x = THREE.MathUtils.degToRad(pitch);
    tsGroup.rotation.y = THREE.MathUtils.degToRad(yaw);
    tsGroup.rotation.z = THREE.MathUtils.degToRad(4.5);
    tsGroup.position.set(16, 8, -5);

    tsScene.add(tsGroup);
  }

  /**
   * Real-time tilt / yaw adjustments from inspector sliders
   */
  window.tplSetDealTermSheetAngles = function(pitch, yaw) {
    if (tsGroup) {
      if (pitch !== undefined) tsGroup.rotation.x = THREE.MathUtils.degToRad(pitch);
      if (yaw !== undefined) tsGroup.rotation.y = THREE.MathUtils.degToRad(yaw);
    }
  };

  /**
   * Initializes the Three.js Viewport inside the target container
   */
  window.initDealTermSheet3DScene = function(container, data) {
    if (!container) return;
    cleanupDealTermSheet3DScene();

    const d = normalizeConfig(data);
    const w = container.clientWidth || 960;
    const h = container.clientHeight || 540;

    // 1. Scene
    tsScene = new THREE.Scene();
    tsScene.background = new THREE.Color('#07090e');

    // 2. Camera: Macro Telephoto Framing (occupying 55%-65% of viewport height)
    tsCamera = new THREE.PerspectiveCamera(31, w / h, 5, 3000);
    tsCamera.position.set(14, 155, 235);
    tsCamera.lookAt(18, 12, 5);

    // 3. Renderer with Soft Shadows
    tsRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    tsRenderer.setSize(w, h);
    tsRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    tsRenderer.shadowMap.enabled = true;
    tsRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(tsRenderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      tsControls = new THREE.OrbitControls(tsCamera, tsRenderer.domElement);
      tsControls.enableDamping = true;
      tsControls.dampingFactor = 0.08;
      tsControls.maxPolarAngle = Math.PI / 2 - 0.05;
      tsControls.minDistance = 120;
      tsControls.maxDistance = 450;
      tsControls.target.set(18, 12, 5);
    }

    // 5. Lighting: Executive Key Spotlight + Warm Ambient Fill
    ambientLight = new THREE.AmbientLight(new THREE.Color('#2d241c'), 0.85);
    tsScene.add(ambientLight);

    spotLight = new THREE.SpotLight(new THREE.Color(d.lightWarmth || '#fff3db'), 2.4);
    spotLight.position.set(60, 320, 180);
    spotLight.target.position.set(15, 0, 0);
    spotLight.angle = 0.78;
    spotLight.penumbra = 0.75;
    spotLight.decay = 1.4;
    spotLight.distance = 900;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0004;
    tsScene.add(spotLight);
    tsScene.add(spotLight.target);

    // Cool edge rim light
    rimLight = new THREE.DirectionalLight(new THREE.Color('#93c5fd'), 0.45);
    rimLight.position.set(-180, 80, -120);
    tsScene.add(rimLight);

    // 6. Build Assemblies
    buildStudioEnvironment(d);
    buildTermSheetAssembly(d, 0);

    // 7. Render Loop
    lastTimestamp = performance.now();
    function renderLoop(now) {
      tsAnimFrame = requestAnimationFrame(renderLoop);
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock = (animClock + delta) % (d.duration || 5.0);
        updateAnimationStep(animClock, d);
      } else {
        updateAnimationStep(manualT, d);
      }

      if (tsControls) tsControls.update();
      if (tsRenderer && tsScene && tsCamera) {
        tsRenderer.render(tsScene, tsCamera);
      }
    }
    tsAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * Updates dynamic 3D elements for timestamp t (0 <= t <= duration)
   */
  function updateAnimationStep(t, data) {
    if (!paperFrontMesh) return;
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t));

    // Update dynamic paper canvas texture
    const cv = generateTermSheetTexture(data, ct);
    if (paperFrontMesh.material && paperFrontMesh.material.map) {
      const tex = paperFrontMesh.material.map;
      if (tex.image !== cv) {
        tex.image = cv;
        tex.needsUpdate = true;
      }
    }

    // Slow cinematic camera tracking pan down to signature line
    if (!tsControls || !tsControls.state || tsControls.state === -1) {
      const panProgress = ct / dur;
      if (tsCamera) {
        const startY = 155;
        const endY = 138;
        const startZ = 235;
        const endZ = 208;
        tsCamera.position.y = startY + (endY - startY) * panProgress;
        tsCamera.position.z = startZ + (endZ - startZ) * panProgress;
        tsCamera.lookAt(18, 12 - panProgress * 8, 5 - panProgress * 6);
      }
    }
  }

  /**
   * Cleans up scene resources
   */
  function cleanupDealTermSheet3DScene() {
    if (tsAnimFrame) {
      cancelAnimationFrame(tsAnimFrame);
      tsAnimFrame = null;
    }
    if (videoAnimFrame) {
      cancelAnimationFrame(videoAnimFrame);
      videoAnimFrame = null;
    }
    if (tsControls) {
      tsControls.dispose();
      tsControls = null;
    }
    if (tsRenderer) {
      if (tsRenderer.domElement && tsRenderer.domElement.parentElement) {
        tsRenderer.domElement.parentElement.removeChild(tsRenderer.domElement);
      }
      tsRenderer.dispose();
      tsRenderer = null;
    }
    tsScene = null;
    tsCamera = null;
    paperBoxMesh = null;
    paperFrontMesh = null;
    tableMesh = null;
    contactShadowMesh = null;
  }

  /**
   * Mounts the 3D Deal Term Sheet Stage inside the Customizer Modal
   */
  window.tplMountDealTermSheet3DStage = function(stage, data) {
    if (!stage) return;
    const d = normalizeConfig(Object.assign({}, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {}));

    if (typeof window.applyModeLayout === 'function') {
      window.applyModeLayout(true);
    }

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #07090e; overflow: hidden; cursor: grab; user-select: none;">
        <!-- 3D Three.js WebGL Viewport -->
        <div id="term-sheet-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>

        <!-- Telemetry Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #facc15; background: rgba(10,12,18,0.92); border: 1px solid rgba(250,204,21,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            3D TERM SHEET RIG &bull; US LETTER 8.5"&times;11" &bull; FOUNTAIN PEN INK &bull; RUBBER STAMPS
          </span>
          <span style="font-family: monospace; font-size: 9px; color: #2effc6; background: rgba(10,12,18,0.85); border: 1px solid rgba(46,255,198,0.3); padding: 3px 6px; border-radius: 4px; font-weight: 700;">
            DRAG TO ORBIT / TILT
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#term-sheet-3d-viewport');
    function triggerInit() {
      if (typeof window.initDealTermSheet3DScene === 'function') {
        window.initDealTermSheet3DScene(viewport, d);
      }
    }
    triggerInit();
    setTimeout(triggerInit, 60);
  };

  /**
   * Mounts the Flat 2D Video Stage for Deal Term Sheet
   */
  window.tplMountDealTermSheetVideoStage = function(stage, data) {
    if (!stage) return;
    const d = normalizeConfig(Object.assign({}, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {}));
    cleanupDealTermSheet3DScene();

    if (typeof window.applyModeLayout === 'function') {
      window.applyModeLayout(false);
    }

    stage.innerHTML = `
      <div id="term-sheet-video-stage" style="position: absolute; inset: 0; background: #07090e; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <canvas id="term-sheet-video-canvas" width="1280" height="720" style="width: 100%; height: 100%; object-fit: contain;"></canvas>
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #38bdf8; background: rgba(10,12,18,0.92); border: 1px solid rgba(56,189,248,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            FLAT VIDEO MODE &bull; US LETTER 8.5"&times;11" &bull; DOC-DRAMA
          </span>
        </div>
      </div>
    `;

    const cv = stage.querySelector('#term-sheet-video-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');

    videoClock = 0;
    videoLastTimestamp = performance.now();

    function vLoop(now) {
      videoAnimFrame = requestAnimationFrame(vLoop);
      const dt = (now - videoLastTimestamp) / 1000;
      videoLastTimestamp = now;

      if (!isManualScrub) {
        videoClock = (videoClock + dt) % (d.duration || 5.0);
      } else {
        videoClock = manualT;
      }
      renderDealTermSheetDirect2D(ctx, d, videoClock, cv.width, cv.height);
    }
    videoAnimFrame = requestAnimationFrame(vLoop);
  };

  /**
   * Direct 2D Canvas Blit for Video Stage, Hover Thumbnails, and Video Export
   */
  function renderDealTermSheetDirect2D(ctx, d, t, cw, ch) {
    if (!ctx) return;
    const dur = Math.max(1, d.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t));

    // 1. Draw desk background
    const deskTex = generateDeskTexture(d.surfaceType || 'mahogany');
    if (deskTex && deskTex.image) {
      ctx.drawImage(deskTex.image, 0, 0, cw, ch);
    } else {
      ctx.fillStyle = '#110a06';
      ctx.fillRect(0, 0, cw, ch);
    }

    // 2. Draw vertical US Letter legal term sheet with realistic perspective slant & drop shadow
    const cv = generateTermSheetTexture(d, ct);

    ctx.save();
    ctx.translate(cw * 0.50, ch * 0.51);
    ctx.transform(1, -0.05, 0.18, 0.90, 0, 0);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetX = 14;
    ctx.shadowOffsetY = 24;

    const docW = cw * 0.38;
    const docH = docW * (11 / 8.5);
    ctx.drawImage(cv, -docW * 0.5, -docH * 0.5, docW, docH);
    ctx.restore();
  }

  /**
   * Stepper callback for hover preview loop & live customizer playback
   */
  window.stepDealTermSheetAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = normalizeConfig(data);

    const viewport = container.querySelector('#term-sheet-3d-viewport');
    if (viewport) {
      if (!tsRenderer) {
        window.initDealTermSheet3DScene(viewport, d);
      }
      updateAnimationStep(t, d);
    }

    const vCanvas = container.querySelector('#term-sheet-video-canvas');
    if (vCanvas) {
      const ctx = vCanvas.getContext('2d');
      renderDealTermSheetDirect2D(ctx, d, t, vCanvas.width, vCanvas.height);
    }
  };

  /**
   * Canvas Renderer for Timeline Playback and Video Export
   */
  window.renderDealTermSheetCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = normalizeConfig(clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData);

    if (tsRenderer && tsRenderer.domElement && tsScene && tsCamera) {
      updateAnimationStep(t, d);
      tsRenderer.render(tsScene, tsCamera);
      ctx.drawImage(tsRenderer.domElement, 0, 0, cw, ch);
      return;
    }

    renderDealTermSheetDirect2D(ctx, d, t, cw, ch);
  };

  /**
   * Contextual Inspector Controls Builder for Customizer
   * Fully granular control over:
   * - Mode Switcher (Video / 3D)
   * - 3D Camera Angles & Presets
   * - Desk Surface (Mahogany, Leather, Slate) & Paper Tone
   * - Header Title, Confidentiality Banner, Company, Date, Preamble
   * - Deal Key Terms: individual text, individual highlight toggle, and individual highlight color picker!
   * - Signee Name, Title, and Fountain Pen Ink Color
   * - Dual Rubber Stamps: text, individual colors, toggle, and angle sliders
   * - Clauses 2 & 3 Fine Print
   */
  window.tplBuildDealTermSheetInspector = function(container, rawData, tplId) {
    if (!container) return;
    const d = normalizeConfig(rawData);
    const is3D = d.is3DMode !== false;
    const pitch = (d.cameraPitch !== undefined) ? d.cameraPitch : 29;
    const yaw = (d.cameraYaw !== undefined) ? d.cameraYaw : -13;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 4px 0;">
        <!-- Header with Video / 3D Segmented Switcher -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10.5px; font-weight: 800; color: #facc15; text-transform: uppercase; letter-spacing: 0.6px; display: flex; align-items: center; gap: 4px;">
              <span>\ud83d\udcdc</span> Term Sheet Engine
            </span>
            <!-- Video / 3D Mode Switcher -->
            <div id="ts-mode-switcher-wrap" style="display: flex; gap: 2px; background: rgba(18,19,28,0.9); padding: 2px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12);">
              <button type="button" id="btn-ts-mode-video" style="padding: 2.5px 9px; font-size: 10px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${!is3D ? 'rgba(168,85,247,0.35)' : 'transparent'}; color: ${!is3D ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="Flat Video Playback View">\u25b6 Video</button>
              <button type="button" id="btn-ts-mode-3d" style="padding: 2.5px 9px; font-size: 10px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${is3D ? 'rgba(168,85,247,0.35)' : 'transparent'}; color: ${is3D ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="Cinematic 3D Depth & Orbit View">\u2b21 3D</button>
            </div>
          </div>
          <span style="font-size: 9px; color: ${is3D ? '#2effc6' : '#facc15'}; font-weight: 800; background: ${is3D ? 'rgba(46,255,198,0.15)' : 'rgba(250,204,21,0.15)'}; border: 1px solid ${is3D ? 'rgba(46,255,198,0.35)' : 'rgba(250,204,21,0.35)'}; padding: 2px 6px; border-radius: 4px;">
            ${is3D ? '\u2b21 3D ACTIVE' : 'DOC-DRAMA'}
          </span>
        </div>

        <!-- 3D Camera Controls (Shown when 3D Mode is Active) -->
        ${is3D ? `
        <div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.32); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 7px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">\ud83c\udfa5 3D Camera &amp; Tilt Angle</span>
            <span style="font-size: 8.5px; font-family: monospace; color: #2effc6; font-weight: 700;">DRAG CANVAS TO ORBIT</span>
          </div>

          <!-- 3D Angle Presets -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
            <button type="button" class="ts-3d-preset-btn" data-pitch="29" data-yaw="-13" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Cinematic (30\u00b0)</button>
            <button type="button" class="ts-3d-preset-btn" data-pitch="42" data-yaw="-22" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Isometric (45\u00b0)</button>
            <button type="button" class="ts-3d-preset-btn" data-pitch="5" data-yaw="0" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Top-Down</button>
          </div>

          <!-- Pitch / Tilt Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>TILT PITCH</span>
              <span id="ts-val-pitch" style="font-family: monospace; color: #2effc6; font-weight: 700;">${pitch}\u00b0</span>
            </div>
            <input type="range" id="ts-slider-pitch" min="0" max="60" value="${pitch}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
          </div>

          <!-- Yaw / Angle Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>ROTATION YAW</span>
              <span id="ts-val-yaw" style="font-family: monospace; color: #2effc6; font-weight: 700;">${yaw}\u00b0</span>
            </div>
            <input type="range" id="ts-slider-yaw" min="-45" max="45" value="${yaw}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
          </div>
        </div>
        ` : ''}

        <!-- Section 1: Key Deal Terms & Granular Highlighting (Individual Color & Toggle per line) -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #facc15; text-transform: uppercase; letter-spacing: 0.5px;">Deal Terms &amp; Highlighting</span>
            <button type="button" id="btn-ts-add-term" style="background: rgba(250,204,21,0.15); border: 1px solid rgba(250,204,21,0.35); color: #facc15; padding: 2px 7px; border-radius: 4px; font-size: 9px; font-weight: 700; cursor: pointer;">
              + Add Term
            </button>
          </div>

          <div id="ts-terms-list" style="display: flex; flex-direction: column; gap: 6px;">
            ${data.dealTerms.map((term, idx) => `
              <div class="ts-term-card" data-idx="${idx}" style="background: rgba(15,23,42,0.65); border: 1px solid ${term.highlighted ? (term.color || '#facc15') : 'rgba(255,255,255,0.08)'}; border-left: 3px solid ${term.color || '#facc15'}; border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <label style="display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 700; color: ${term.highlighted ? '#fff' : '#94a3b8'}; cursor: pointer;">
                    <input type="checkbox" class="ts-chk-hl" data-idx="${idx}" ${term.highlighted ? 'checked' : ''} style="accent-color: ${term.color || '#facc15'}; cursor: pointer;" />
                    <span>Highlight with Marker</span>
                  </label>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 8px; color: #94a3b8;">Color:</span>
                    <input type="color" class="ts-col-hl" data-idx="${idx}" value="${term.color || '#facc15'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Highlighter Color for this term" />
                    ${data.dealTerms.length > 2 ? `<button type="button" class="ts-del-term" data-idx="${idx}" style="background: none; border: none; color: #f87171; font-size: 11px; font-weight: 800; cursor: pointer;" title="Delete Term">\u2715</button>` : ''}
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 5px;">
                  <input type="text" class="ts-inp-term-label" data-idx="${idx}" value="${term.label}" placeholder="Label:" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #cbd5e1; font-size: 10px; font-weight: 600; outline: none;" />
                  <input type="text" class="ts-inp-term-val" data-idx="${idx}" value="${term.value}" placeholder="Value..." style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: ${term.highlighted ? (term.color || '#facc15') : '#fff'}; font-size: 10px; font-weight: 700; outline: none;" />
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 2: Document Header & Preamble -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 7px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Document Header &amp; Metadata</span>

          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Document Title</span>
            <input type="text" id="ts-inp-title" value="${d.title || 'TERM SHEET \u00b7 SERIES A'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Top Banner</span>
              <input type="text" id="ts-inp-badge" value="${d.confidentialBadge || 'STRICTLY CONFIDENTIAL \u00b7 FOR DISCUSSION ONLY'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 9px; padding: 5px 6px; border-radius: 6px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Parties / Company</span>
              <input type="text" id="ts-inp-company" value="${d.companyName || 'ACME CORP / ATLAS VENTURES'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 9px; padding: 5px 6px; border-radius: 6px; outline: none;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Clause 1 Preamble Text</span>
            <textarea id="ts-inp-preamble" rows="2" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 9.5px; font-family: monospace; padding: 5px 8px; border-radius: 6px; outline: none; resize: vertical;">${d.preamble || ''}</textarea>
          </div>
        </div>

        <!-- Section 3: Ink Signature Execution Block -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 7px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Fountain Pen Signature</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 8px; color: #94a3b8;">Ink:</span>
              <input type="color" id="ts-col-ink" value="${d.inkColor || '#1e293b'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Fountain Pen Ink Color" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Signee Name</span>
              <input type="text" id="ts-inp-signee" value="${d.signeeName || 'Alexander Vance'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Signee Title</span>
              <input type="text" id="ts-inp-title-sub" value="${d.signeeTitle || 'CEO & Managing Partner'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>
          </div>
        </div>

        <!-- Section 4: Dual Rubber Stamps (Individually Configurable) -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 7px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Rubber Approval Stamps</span>

          <!-- Stamp 1 -->
          <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(239,68,68,0.25); border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 700; color: #ef4444; cursor: pointer;">
                <input type="checkbox" id="ts-chk-stamp1" ${d.showStamp1 !== false ? 'checked' : ''} style="accent-color: #ef4444; cursor: pointer;" />
                <span>Stamp 1</span>
              </label>
              <input type="color" id="ts-col-stamp1" value="${d.stamp1Color || '#b91c1c'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Stamp 1 Color" />
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 5px;">
              <input type="text" id="ts-inp-stamp1" value="${d.stamp1Text || 'DEAL CLOSED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: ${d.stamp1Color || '#ef4444'}; font-weight: 800; padding: 4px 6px; border-radius: 4px; font-size: 10px; outline: none;" />
              <input type="number" id="ts-inp-stamp1-angle" value="${d.stamp1Angle !== undefined ? d.stamp1Angle : -14}" min="-45" max="45" step="1" title="Stamp 1 Rotation Angle" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 4px 6px; border-radius: 4px; font-size: 9.5px; outline: none;" />
            </div>
          </div>

          <!-- Stamp 2 -->
          <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(239,68,68,0.25); border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 700; color: #ef4444; cursor: pointer;">
                <input type="checkbox" id="ts-chk-stamp2" ${d.showStamp2 !== false ? 'checked' : ''} style="accent-color: #ef4444; cursor: pointer;" />
                <span>Stamp 2</span>
              </label>
              <input type="color" id="ts-col-stamp2" value="${d.stamp2Color || '#b91c1c'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Stamp 2 Color" />
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 5px;">
              <input type="text" id="ts-inp-stamp2" value="${d.stamp2Text || 'APPROVED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: ${d.stamp2Color || '#ef4444'}; font-weight: 800; padding: 4px 6px; border-radius: 4px; font-size: 10px; outline: none;" />
              <input type="number" id="ts-inp-stamp2-angle" value="${d.stamp2Angle !== undefined ? d.stamp2Angle : -16}" min="-45" max="45" step="1" title="Stamp 2 Rotation Angle" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 4px 6px; border-radius: 4px; font-size: 9.5px; outline: none;" />
            </div>
          </div>
        </div>

        <!-- Section 5: Fine Print Clauses -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 7px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Fine Print Clauses</span>
          <textarea id="ts-inp-clause2" rows="2" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 9px; font-family: monospace; padding: 5px 8px; border-radius: 6px; outline: none; resize: vertical;" placeholder="Clause 2 text...">${d.clause2 || ''}</textarea>
          <textarea id="ts-inp-clause3" rows="2" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 9px; font-family: monospace; padding: 5px 8px; border-radius: 6px; outline: none; resize: vertical;" placeholder="Clause 3 text...">${d.clause3 || ''}</textarea>
        </div>

        <!-- Section 6: Studio Environment & Desk Surface -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 7px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Desk Surface &amp; Paper Material</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Desk Surface</span>
              <select id="ts-sel-surface" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none; cursor: pointer;">
                <option value="mahogany" ${d.surfaceType === 'mahogany' ? 'selected' : ''}>Executive Mahogany</option>
                <option value="leather" ${d.surfaceType === 'leather' ? 'selected' : ''}>Executive Leather Blotter</option>
                <option value="noir_slate" ${d.surfaceType === 'noir_slate' ? 'selected' : ''}>Noir Slate Studio</option>
              </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Paper Tone</span>
              <select id="ts-sel-tone" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none; cursor: pointer;">
                <option value="#f5f0e1" ${d.paperTone === '#f5f0e1' ? 'selected' : ''}>Vintage Ivory Cotton</option>
                <option value="#ffffff" ${d.paperTone === '#ffffff' ? 'selected' : ''}>Crisp Legal White</option>
                <option value="#fef3c7" ${d.paperTone === '#fef3c7' ? 'selected' : ''}>Aged Amber Parchment</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Reset Button -->
        <button type="button" id="btn-ts-reset" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; margin-top: 4px;">
          Reset to Legal Term Sheet Defaults
        </button>
      </div>
    `;

    function updateData(patch) {
      if (typeof window.tplSetContextualData === 'function') {
        const cur = normalizeConfig(window.tplGetContextualData(tplId));
        const next = Object.assign({}, cur, patch);
        window.tplSetContextualData(tplId, next);
        window.tplUpdateStageWithContextualData(tplId, next);
      }
    }

    const setMode = (is3DActive) => {
      textureCache.clear();
      updateData({ is3DMode: is3DActive });
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.is3DMode = is3DActive;
        topCustomizerState.paperPreviewMode = is3DActive ? '3d' : 'video';
      }
      const pVid = document.getElementById('btn-paper-rip-mode-video');
      const p3D = document.getElementById('btn-paper-rip-mode-3d');
      if (pVid && p3D) {
        pVid.style.background = !is3DActive ? 'rgba(168,85,247,.35)' : 'transparent';
        pVid.style.color = !is3DActive ? '#fff' : '#94a3b8';
        p3D.style.background = is3DActive ? 'rgba(168,85,247,.35)' : 'transparent';
        p3D.style.color = is3DActive ? '#fff' : '#94a3b8';
      }
      if (typeof window.applyModeLayout === 'function') {
        window.applyModeLayout(is3DActive);
      }
      if (typeof renderTopTemplatePreviewStage === 'function') {
        renderTopTemplatePreviewStage();
      }
      if (typeof window.tplRenderContextualInspector === 'function') {
        window.tplRenderContextualInspector(tplId);
      }
    };

    container.querySelector('#btn-ts-mode-video')?.addEventListener('click', () => setMode(false));
    container.querySelector('#btn-ts-mode-3d')?.addEventListener('click', () => setMode(true));

    // 3D Tilt sliders
    const pitchSlider = container.querySelector('#ts-slider-pitch');
    const yawSlider = container.querySelector('#ts-slider-yaw');
    const pitchVal = container.querySelector('#ts-val-pitch');
    const yawVal = container.querySelector('#ts-val-yaw');

    pitchSlider?.addEventListener('input', (e) => {
      const p = parseInt(e.target.value, 10);
      if (pitchVal) pitchVal.textContent = `${p}\u00b0`;
      if (typeof window.tplSetDealTermSheetAngles === 'function') {
        window.tplSetDealTermSheetAngles(p, undefined);
      }
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, { cameraPitch: p });
      }
    });

    yawSlider?.addEventListener('input', (e) => {
      const y = parseInt(e.target.value, 10);
      if (yawVal) yawVal.textContent = `${y}\u00b0`;
      if (typeof window.tplSetDealTermSheetAngles === 'function') {
        window.tplSetDealTermSheetAngles(undefined, y);
      }
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, { cameraYaw: y });
      }
    });

    container.querySelectorAll('.ts-3d-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.pitch, 10);
        const y = parseInt(btn.dataset.yaw, 10);
        if (pitchSlider) pitchSlider.value = p;
        if (yawSlider) yawSlider.value = y;
        if (pitchVal) pitchVal.textContent = `${p}\u00b0`;
        if (yawVal) yawVal.textContent = `${y}\u00b0`;
        if (typeof window.tplSetDealTermSheetAngles === 'function') {
          window.tplSetDealTermSheetAngles(p, y);
        }
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(tplId, { cameraPitch: p, cameraYaw: y });
        }
      });
    });

    // Add Term button
    container.querySelector('#btn-ts-add-term')?.addEventListener('click', () => {
      textureCache.clear();
      const currentTerms = Array.from(d.dealTerms);
      currentTerms.push({
        id: `term-${Date.now()}`,
        label: `Term #${currentTerms.length + 1}:`,
        value: 'Definitive terms',
        highlighted: false,
        color: '#facc15'
      });
      updateData({ dealTerms: currentTerms });
      window.tplRenderContextualInspector(tplId);
    });

    // Wire individual term edits
    container.querySelectorAll('.ts-term-card').forEach(card => {
      const idx = parseInt(card.dataset.idx, 10);

      card.querySelector('.ts-chk-hl')?.addEventListener('change', (e) => {
        textureCache.clear();
        const currentTerms = Array.from(d.dealTerms);
        if (currentTerms[idx]) {
          currentTerms[idx].highlighted = e.target.checked;
          updateData({ dealTerms: currentTerms });
          window.tplRenderContextualInspector(tplId);
        }
      });

      card.querySelector('.ts-col-hl')?.addEventListener('input', (e) => {
        textureCache.clear();
        const currentTerms = Array.from(d.dealTerms);
        if (currentTerms[idx]) {
          currentTerms[idx].color = e.target.value;
          updateData({ dealTerms: currentTerms });
        }
      });

      card.querySelector('.ts-inp-term-label')?.addEventListener('input', (e) => {
        textureCache.clear();
        const currentTerms = Array.from(d.dealTerms);
        if (currentTerms[idx]) {
          currentTerms[idx].label = e.target.value;
          updateData({ dealTerms: currentTerms });
        }
      });

      card.querySelector('.ts-inp-term-val')?.addEventListener('input', (e) => {
        textureCache.clear();
        const currentTerms = Array.from(d.dealTerms);
        if (currentTerms[idx]) {
          currentTerms[idx].value = e.target.value;
          updateData({ dealTerms: currentTerms });
        }
      });

      card.querySelector('.ts-del-term')?.addEventListener('click', () => {
        textureCache.clear();
        const currentTerms = Array.from(d.dealTerms);
        if (currentTerms.length > 2) {
          currentTerms.splice(idx, 1);
          updateData({ dealTerms: currentTerms });
          window.tplRenderContextualInspector(tplId);
        }
      });
    });

    // Header & metadata inputs
    container.querySelector('#ts-inp-title')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ title: e.target.value });
    });

    container.querySelector('#ts-inp-badge')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ confidentialBadge: e.target.value });
    });

    container.querySelector('#ts-inp-company')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ companyName: e.target.value });
    });

    container.querySelector('#ts-inp-preamble')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ preamble: e.target.value });
    });

    // Signature inputs
    container.querySelector('#ts-inp-signee')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ signeeName: e.target.value });
    });

    container.querySelector('#ts-inp-title-sub')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ signeeTitle: e.target.value });
    });

    container.querySelector('#ts-col-ink')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ inkColor: e.target.value });
    });

    // Rubber stamp inputs
    container.querySelector('#ts-chk-stamp1')?.addEventListener('change', (e) => {
      textureCache.clear();
      updateData({ showStamp1: e.target.checked });
    });

    container.querySelector('#ts-col-stamp1')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp1Color: e.target.value });
    });

    container.querySelector('#ts-inp-stamp1')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp1Text: e.target.value });
    });

    container.querySelector('#ts-inp-stamp1-angle')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp1Angle: parseFloat(e.target.value) || -14 });
    });

    container.querySelector('#ts-chk-stamp2')?.addEventListener('change', (e) => {
      textureCache.clear();
      updateData({ showStamp2: e.target.checked });
    });

    container.querySelector('#ts-col-stamp2')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp2Color: e.target.value });
    });

    container.querySelector('#ts-inp-stamp2')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp2Text: e.target.value });
    });

    container.querySelector('#ts-inp-stamp2-angle')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp2Angle: parseFloat(e.target.value) || -16 });
    });

    // Clauses
    container.querySelector('#ts-inp-clause2')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ clause2: e.target.value });
    });

    container.querySelector('#ts-inp-clause3')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ clause3: e.target.value });
    });

    // Desk & paper selectors
    container.querySelector('#ts-sel-surface')?.addEventListener('change', (e) => {
      surfaceCache.clear();
      updateData({ surfaceType: e.target.value });
    });

    container.querySelector('#ts-sel-tone')?.addEventListener('change', (e) => {
      textureCache.clear();
      updateData({ paperTone: e.target.value });
    });

    // Reset button
    container.querySelector('#btn-ts-reset')?.addEventListener('click', () => {
      textureCache.clear();
      surfaceCache.clear();
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  // Expose configuration globally
  window.DEAL_TERM_SHEET_CONFIG = DEFAULT_CONFIG;
  console.log('[Deal Term Sheet 3D Engine] Initialized Doc-Drama Legal Term Sheet Engine (v2 Granular)');
})();
