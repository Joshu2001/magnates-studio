/**
 * Photorealistic 3D Fraud Dossier Redaction Engine (True Crime / Doc-Drama Standard)
 * Replicating top-tier investigative aesthetics (James Jani, Magnates Media, Vox)
 *
 * Upgrades:
 * 1. Material Shaders & Geometry:
 *    - Multi-layer 3D physical paper artifact stack:
 *      * Background Layer Left: Aged Manila "INVESTIGATION" Dossier with case notes & blur bokeh
 *      * Background Layer Top-Left: Weathered document clipping with "TOP SECRET" rubber ink stamp
 *      * Background Layer Right: Legal "CONTRACT" page with redaction bars & cursive fountain signature
 *      * Center Foreground Hero: Cotton micro-grain "INTERNAL MEMO" with deckle edge drop shadows
 *    - Dynamic Black Redaction Bar with high-impact slam at t=0.8s
 *    - Fluorescent Yellow Marker Highlighter sweep across "$8.4 BILLION" at t=1.6s
 *    - Distressed porous rubber ink stamp "CONFIDENTIAL" slamming at t=2.3s with multiply ink bleed
 * 2. 3D Spatial Rig & Perspective:
 *    - 25°–35° spatial pitch/tilt across X & Y axes (intimate tactile 3D perspective)
 *    - Scaled up to 55%–65% of viewport width for intimate, tactile macro framing
 *    - Interactive OrbitControls (drag to orbit/tilt, wheel to zoom)
 * 3. Atmospheric Environment & Cinematic Lighting Pass:
 *    - Dark Mahogany Desk Surface (/mahogany_desk_texture.jpg)
 *    - Overlaid with faint investigative topographic coordinate lines & crosshairs (+)
 *    - Focused Overhead Key Spotlight with warm pool of light and deep radial vignette falloff
 *    - Floating volumetric dust motes drifting through the spotlight beam
 *    - Depth of Field (f/2.8 lens emulation) keeping center memo sharp while background dossier blurs
 * 4. Production Integration:
 *    - Real-time customizer playback, timeline scrub synchronization, and 4K canvas video export
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'scam-redaction';

  // Default True Crime / Fraud Dossier Configuration
  const DEFAULT_CONFIG = {
    type: 'scam-redaction',
    title: 'INTERNAL MEMO \u00b7 EYES ONLY',
    recipient: 'To: Board of Directors',
    senderLabel: 'From:',
    senderRedacted: 'Alexander Vance, CFO',
    subjectLine1: 'Re: Q3 revenue booked via',
    subjectLine2: 'side letters totaling',
    highlightedAmount: '$8.4 BILLION',
    disclosureWarning: 'DO NOT DISCLOSE.',
    stampText: 'CONFIDENTIAL',
    showStamp: true,
    showRedaction: true,
    showHighlighter: true,
    paperTone: '#fbf8ef',
    highlighterColor: '#facc15',
    stampColor: '#c1121f',
    surfaceType: 'mahogany', // 'mahogany', 'blueprint', 'dark_slate'
    showCoordinateGrid: true,
    spotlightIntensity: 2.2,
    lightWarmth: '#fff3db',
    volumetricDust: true,
    depthOfField: true,
    tiltAngleX: 29, // 25° - 35° spatial pitch
    tiltAngleY: -10, // spatial yaw
    coverageScale: 62, // 55% - 65% of viewport width
    duration: 5.0
  };

  window.FRAUD_DOSSIER_CONFIG = DEFAULT_CONFIG;

  // Three.js Scene References
  let fdScene = null;
  let fdCamera = null;
  let fdRenderer = null;
  let fdAnimFrame = null;
  let fdControls = null;
  let fdGroup = null;

  // Meshes
  let deskMesh = null;
  let gridMesh = null;
  let investMesh = null;
  let topSecretMesh = null;
  let contractMesh = null;
  let memoMesh = null;
  let dustParticleGroup = null;
  let contactShadowMesh = null;

  // Lighting
  let keySpotLight = null;
  let ambientLight = null;
  let rimLight = null;

  // Animation state
  let isManualScrub = false;
  let manualT = 0;
  let animClock = 0;
  let lastTimestamp = 0;

  // Texture Cache
  const textureCache = new Map();
  const imageAssets = new Map();

  function preloadImage(url) {
    if (!url || imageAssets.has(url)) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => imageAssets.set(url, img);
    img.src = url;
    imageAssets.set(url, img);
  }

  // Preload textures
  preloadImage('/mahogany_desk_texture.jpg');
  preloadImage('/paper_tear_stock_vintage_map.jpg');
  preloadImage('/paper_tear_document_dossier.jpg');

  /**
   * Generates Topographic Coordinate Map Blueprint SVG Canvas
   */
  function generateGridOverlayTexture(w = 1024, h = 1024) {
    const key = `grid_overlay_${w}x${h}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    // Fine grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    const step = 64;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Coordinate crosshairs (+)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 1.4;
    const crossPoints = [
      { x: 192, y: 192 },
      { x: 512, y: 128 },
      { x: 832, y: 256 },
      { x: 192, y: 768 },
      { x: 768, y: 768 }
    ];

    crossPoints.forEach(pt => {
      ctx.beginPath();
      ctx.moveTo(pt.x - 12, pt.y);
      ctx.lineTo(pt.x + 12, pt.y);
      ctx.moveTo(pt.x, pt.y - 12);
      ctx.lineTo(pt.x, pt.y + 12);
      ctx.stroke();
    });

    // Faint topographic contour curves
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.bezierCurveTo(240, 180, 480, 320, 1024, 210);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 310);
    ctx.bezierCurveTo(200, 260, 460, 420, 1024, 330);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.bezierCurveTo(180, 380, 420, 520, 1024, 460);
    ctx.stroke();

    // Coordinate HUD labels
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('LAT // 40\u00b042\'51"N', 48, 64);
    ctx.fillText('LON // 74\u00b000\'23"W', 48, 84);
    ctx.fillText('GRID REF 8842-X', w - 190, 64);
    ctx.fillText('INDEX // 240m', w - 190, 84);

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates High-Resolution Hero Memo Paper Texture (1536 x 1152 px)
   * With cotton micro-grain, red border stamps, black redaction bar, yellow highlighter, and confidential rubber stamp.
   */
  function generateMemoTexture(data, t) {
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t !== undefined ? t : (dur * 0.9)));
    const frameIndex = Math.round(ct * 30);
    const key = `memo_tex_${frameIndex}_${data.title}_${data.highlightedAmount}_${data.stampText}_${data.paperTone}`;

    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 1152; // 4:3 memo aspect ratio
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Off-white / Ivory Cotton Paper Base Tone
    ctx.fillStyle = data.paperTone || '#fbf8ef';
    ctx.fillRect(0, 0, w, h);

    // Subtle edge aging patina / vignette on paper
    const paperGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, w * 0.72);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    paperGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    paperGrad.addColorStop(1, 'rgba(140, 100, 50, 0.14)'); // Aged paper edge patina
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Cotton Paper Micro-Fiber Grain
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 8) {
      const n = (Math.random() - 0.5) * 12;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle fine deckle border
    ctx.strokeStyle = 'rgba(60, 40, 20, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    const marginX = 140;
    let currentY = 175;

    // 3. Document Header: INTERNAL MEMO · EYES ONLY
    ctx.fillStyle = '#3a2418';
    ctx.font = '900 44px "JetBrains Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '5px';
    ctx.fillText(data.title || 'INTERNAL MEMO \u00b7 EYES ONLY', w * 0.5, currentY);

    currentY += 28;
    // Fine dashed rule
    ctx.strokeStyle = 'rgba(58, 36, 24, 0.3)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(marginX, currentY);
    ctx.lineTo(w - marginX, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    currentY += 100;
    ctx.textAlign = 'left';
    ctx.font = '700 36px "JetBrains Mono", "Courier New", monospace';
    ctx.fillStyle = '#3a2418';

    // 4. Line 1: To: Board of Directors
    ctx.fillText(data.recipient || 'To: Board of Directors', marginX, currentY);

    currentY += 90;

    // 5. Line 2: From: [BLACK REDACTION BAR SLAM]
    // Timing: Redaction bar slams down from t=0.6s to 0.9s
    const redactProg = Math.max(0, Math.min(1, (ct - 0.6) / 0.3));
    ctx.fillText(data.senderLabel || 'From:', marginX, currentY);

    const fromMetrics = ctx.measureText(data.senderLabel || 'From:');
    const barStartX = marginX + fromMetrics.width + 24;
    const barWidth = 360;
    const barHeight = 44;

    if (data.showRedaction !== false && redactProg > 0) {
      ctx.save();
      // Physical ink redaction bar slam
      const scaleX = redactProg < 0.8
        ? (redactProg / 0.8) * 1.05
        : (1.05 - (redactProg - 0.8) * 0.25);

      ctx.fillStyle = '#111114';
      ctx.beginPath();
      // Draw redaction bar with slight marker jitter / textured edges
      ctx.rect(barStartX, currentY - barHeight + 8, barWidth * scaleX, barHeight);
      ctx.fill();

      // Porous ink texture overlay on redaction bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 18; i++) {
        ctx.fillRect(barStartX + Math.random() * (barWidth * scaleX), currentY - barHeight + 10 + Math.random() * (barHeight - 6), 4, 2);
      }
      ctx.restore();
    }

    currentY += 90;

    // 6. Line 3: Re: Q3 revenue booked via
    ctx.fillText(data.subjectLine1 || 'Re: Q3 revenue booked via', marginX, currentY);

    currentY += 65;

    // 7. Line 4: side letters totaling
    ctx.fillText(data.subjectLine2 || 'side letters totaling', marginX, currentY);

    currentY += 95;

    // 8. Line 5: $8.4 BILLION (Yellow Marker Highlighter Sweep)
    // Timing: Sweeps from t=1.3s to 2.0s
    const hlProg = Math.max(0, Math.min(1, (ct - 1.3) / 0.7));
    const hlText = data.highlightedAmount || '$8.4 BILLION';
    ctx.font = '900 48px "JetBrains Mono", monospace';
    const hlMetrics = ctx.measureText(hlText);
    const hlW = hlMetrics.width + 36;

    if (data.showHighlighter !== false && hlProg > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(250, 204, 21, 0.84)'; // Luminous fluorescent marker
      const sweepW = hlW * hlProg;
      // Chiseled marker polygon
      ctx.beginPath();
      ctx.moveTo(marginX - 14, currentY - 44);
      ctx.lineTo(marginX - 14 + sweepW, currentY - 44);
      ctx.lineTo(marginX - 6 + sweepW, currentY + 16);
      ctx.lineTo(marginX - 18, currentY + 16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = '#0f172a';
    ctx.fillText(hlText, marginX, currentY);

    currentY += 95;

    // 9. Line 6: DO NOT DISCLOSE.
    ctx.font = '700 36px "JetBrains Mono", "Courier New", monospace';
    ctx.fillStyle = '#3a2418';
    ctx.fillText(data.disclosureWarning || 'DO NOT DISCLOSE.', marginX, currentY);

    // 10. Red Rubber Ink Stamp: "CONFIDENTIAL"
    // Timing: Slams down at t=2.1s with physical bounce and porous ink bleed
    if (data.showStamp !== false && ct >= 2.0) {
      const stampProg = Math.max(0, Math.min(1, (ct - 2.0) / 0.35));
      const scale = stampProg < 0.6
        ? (2.4 - (stampProg / 0.6) * 1.45)
        : (0.95 + (stampProg - 0.6) * 0.125);
      const alpha = Math.min(1, stampProg * 1.8);

      drawRubberStamp(ctx, {
        text: data.stampText || 'CONFIDENTIAL',
        x: w * 0.75,
        y: h * 0.78,
        angle: -14 * Math.PI / 180,
        scale: scale,
        alpha: alpha,
        color: data.stampColor || '#c1121f'
      });
    }

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Background Layer Left: Aged Manila "INVESTIGATION" Dossier
   */
  function generateInvestigationTexture() {
    const key = 'investigation_dossier_tex';
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 1365; // ~8.5x11
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // Manila base tone
    ctx.fillStyle = '#eedcb3';
    ctx.fillRect(0, 0, w, h);

    // Edge grunge
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, w * 0.75);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(110, 75, 30, 0.28)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Paper fibers
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 16) {
      const n = (Math.random() - 0.5) * 15;
      pix[i] += n; pix[i+1] += n; pix[i+2] += n;
    }
    ctx.putImageData(imgData, 0, 0);

    // Header stamp
    ctx.fillStyle = '#8b261b';
    ctx.font = '900 48px "Georgia", serif';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '3px';
    ctx.fillText('INVESTIGATION // FILE 904', 80, 140);

    ctx.strokeStyle = '#8b261b';
    ctx.lineWidth = 3;
    ctx.strokeRect(70, 75, 780, 95);

    // Faint case lines
    ctx.fillStyle = '#4a3b2c';
    ctx.font = '500 24px "Courier New", monospace';
    let y = 240;
    const lines = [
      'SUBJECT: OFF-BALANCE SHEET SPECIAL PURPOSE VEHICLES',
      'AGENCY: FEDERAL FORENSIC SECURITIES AUDIT',
      'STATUS: EVIDENCE ADMISSIBLE UNDER TITLE 18 USC',
      'EXHIBIT D-4: REVENUE COMMINGLING AFFIDAVIT',
      '-------------------------------------------------------',
      '1. Review of board correspondence reveals structured',
      '   transaction letters intentionally omitted from SEC',
      '   quarterly filings for the period ending September 30.',
      '2. Total unrecorded commitments exceed disclosed cash',
      '   reserves by an order of magnitude.',
      '3. Subpoenas issued for internal communications.'
    ];
    lines.forEach(l => {
      ctx.fillText(l, 80, y);
      y += 44;
    });

    // Red stamp bottom
    drawRubberStamp(ctx, {
      text: 'SUBPOENA VERIFIED',
      x: 340,
      y: 920,
      angle: -8 * Math.PI / 180,
      scale: 0.95,
      alpha: 0.85,
      color: '#991b1b'
    });

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Background Layer Top-Left: "TOP SECRET" Slip
   */
  function generateTopSecretTexture() {
    const key = 'top_secret_slip_tex';
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 768;
    cv.height = 960;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    ctx.fillStyle = '#f4ecd8';
    ctx.fillRect(0, 0, w, h);

    // Big bold TOP SECRET rubber stamp
    drawRubberStamp(ctx, {
      text: 'TOP SECRET',
      x: w * 0.5,
      y: 180,
      angle: -6 * Math.PI / 180,
      scale: 1.35,
      alpha: 0.92,
      color: '#b91c1c'
    });

    // Typed serials
    ctx.fillStyle = '#3a2e22';
    ctx.font = '600 22px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('DOCUMENT CLASSIFICATION: LEVEL 4', 70, 360);
    ctx.fillText('DEPT: INTERNAL AUDIT / OIG', 70, 410);
    ctx.fillText('WARNING: UNAUTHORIZED DISCLOSURE', 70, 460);
    ctx.fillText('SUBJECT TO CRIMINAL PENALTIES', 70, 500);

    // Black bar
    ctx.fillStyle = '#111';
    ctx.fillRect(70, 560, 480, 28);
    ctx.fillRect(70, 610, 360, 28);

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Background Layer Right: Legal "CONTRACT" Page with Signature
   */
  function generateContractTexture() {
    const key = 'contract_legal_tex';
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 1365;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // Off-white legal bond paper
    ctx.fillStyle = '#f7f4ea';
    ctx.fillRect(0, 0, w, h);

    // Subtle edge patina
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, w * 0.72);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    g.addColorStop(1, 'rgba(100, 75, 40, 0.15)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Contract Header
    ctx.fillStyle = '#1e293b';
    ctx.font = '900 48px "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('CONTRACT', w * 0.5, 140);

    // Clauses with redaction bars
    ctx.textAlign = 'left';
    ctx.font = '500 22px "Georgia", serif';
    ctx.fillStyle = '#334155';
    let y = 230;
    const paragraphs = [
      'WHEREAS, the Corporation entered into confidential side agreements',
      'providing guaranteed buyback covenants on third-party promissory notes;',
      'NOW, THEREFORE, the signatories hereto confirm that consideration',
      'was disbursed through offshore escrow facilities without board audit.'
    ];
    paragraphs.forEach(p => {
      ctx.fillText(p, 80, y);
      y += 40;
    });

    // Redaction bars
    ctx.fillStyle = '#111';
    ctx.fillRect(80, y + 20, 520, 22);
    ctx.fillRect(80, y + 54, 380, 22);
    ctx.fillRect(80, y + 88, 640, 22);

    y += 240;

    // Signature line
    ctx.fillStyle = '#1e293b';
    ctx.font = 'italic 700 32px "Georgia", serif';
    ctx.fillText('Signature', 90, y);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(90, y + 25);
    ctx.lineTo(480, y + 25);
    ctx.stroke();

    // Cursive ink signature
    ctx.save();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(110, y + 12);
    ctx.bezierCurveTo(150, y - 45, 180, y + 30, 240, y - 20);
    ctx.bezierCurveTo(280, y - 55, 320, y + 15, 390, y - 10);
    ctx.stroke();
    ctx.restore();

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Helper: draws a weathered rubber stamp with multiply blending and porous ink bleed
   */
  function drawRubberStamp(ctx, opts) {
    const { text, x, y, angle, scale, alpha, color } = opts;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'multiply';
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.font = '900 42px "JetBrains Mono", "Impact", sans-serif';
    const textMetrics = ctx.measureText(text);
    const boxW = textMetrics.width + 54;
    const boxH = 68;

    // Distressed rubber stamp double border
    ctx.strokeStyle = color || '#c1121f';
    ctx.lineWidth = 4.5;
    ctx.strokeRect(-boxW * 0.5, -boxH * 0.5, boxW, boxH);

    ctx.lineWidth = 1.8;
    ctx.strokeRect(-boxW * 0.5 + 5, -boxH * 0.5 + 5, boxW - 10, boxH - 10);

    // Weathered stamp text
    ctx.fillStyle = color || '#c1121f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '4px';
    ctx.fillText(text, 0, 1);

    // Stamp ink voids & micro-distress (porous rubber stamp texture)
    ctx.fillStyle = 'rgba(251, 248, 239, 0.45)';
    for (let i = 0; i < 32; i++) {
      const rx = (Math.random() - 0.5) * boxW;
      const ry = (Math.random() - 0.5) * boxH;
      const rw = 2 + Math.random() * 5;
      const rh = 1.5 + Math.random() * 3.5;
      ctx.fillRect(rx, ry, rw, rh);
    }

    ctx.restore();
  }

  /**
   * Builds the 3D Studio Environment:
   * - Dark Executive Mahogany Desk
   * - Coordinate Grid Overlay
   * - Soft Contact Shadow Mesh
   * - PBR Lighting Rig with Focused Overhead Spotlight
   * - Volumetric Dust Particle Group
   */
  function buildStudioEnvironment(data) {
    // 1. Mahogany Desk Surface
    const tableGeo = new THREE.PlaneGeometry(850, 600);
    const mahoganyImg = imageAssets.get('/mahogany_desk_texture.jpg');
    let tableTex;
    if (mahoganyImg && mahoganyImg.complete) {
      tableTex = new THREE.Texture(mahoganyImg);
      tableTex.needsUpdate = true;
    } else {
      const cv = document.createElement('canvas');
      cv.width = 512; cv.height = 512;
      const c = cv.getContext('2d');
      const g = c.createLinearGradient(0, 0, 512, 512);
      g.addColorStop(0, '#160c08'); g.addColorStop(0.5, '#241209'); g.addColorStop(1, '#0f0704');
      c.fillStyle = g; c.fillRect(0, 0, 512, 512);
      tableTex = new THREE.CanvasTexture(cv);
    }
    tableTex.wrapS = THREE.RepeatWrapping;
    tableTex.wrapT = THREE.RepeatWrapping;
    tableTex.repeat.set(1.6, 1.2);

    const tableMat = new THREE.MeshStandardMaterial({
      map: tableTex,
      roughness: 0.62,
      metalness: 0.08
    });

    deskMesh = new THREE.Mesh(tableGeo, tableMat);
    deskMesh.receiveShadow = true;
    deskMesh.position.set(0, -3.5, 0);
    deskMesh.rotation.x = -Math.PI / 2;
    fdScene.add(deskMesh);

    // 2. Faint Coordinate Map Grid Plane Overlaid on Desk
    if (data.showCoordinateGrid !== false) {
      const gridGeo = new THREE.PlaneGeometry(850, 600);
      const gridCv = generateGridOverlayTexture(1024, 1024);
      const gridTex = new THREE.CanvasTexture(gridCv);
      gridTex.wrapS = THREE.RepeatWrapping;
      gridTex.wrapT = THREE.RepeatWrapping;
      gridTex.repeat.set(1.2, 1.0);

      const gridMat = new THREE.MeshBasicMaterial({
        map: gridTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      });

      gridMesh = new THREE.Mesh(gridGeo, gridMat);
      gridMesh.position.set(0, -3.2, 0);
      gridMesh.rotation.x = -Math.PI / 2;
      fdScene.add(gridMesh);
    }

    // 3. Contact Shadow Plane beneath the stacked papers
    const shadowCv = document.createElement('canvas');
    shadowCv.width = 512; shadowCv.height = 512;
    const sCtx = shadowCv.getContext('2d');
    const sGrad = sCtx.createRadialGradient(256, 256, 80, 256, 256, 250);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCv);
    const shadowGeo = new THREE.PlaneGeometry(380, 300);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });

    contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.set(10, -2.5, 10);
    fdScene.add(contactShadowMesh);

    // 4. Volumetric Floating Dust Motes
    if (data.volumetricDust !== false) {
      const moteCount = 45;
      const moteGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(moteCount * 3);
      for (let i = 0; i < moteCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 280;
        positions[i + 1] = 15 + Math.random() * 140;
        positions[i + 2] = (Math.random() - 0.5) * 220;
      }
      moteGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Circular soft mote canvas
      const mCv = document.createElement('canvas');
      mCv.width = 64; mCv.height = 64;
      const mCtx = mCv.getContext('2d');
      const mGrad = mCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      mGrad.addColorStop(0, 'rgba(255, 245, 220, 0.95)');
      mGrad.addColorStop(0.3, 'rgba(255, 230, 180, 0.5)');
      mGrad.addColorStop(1, 'rgba(255, 230, 180, 0)');
      mCtx.fillStyle = mGrad;
      mCtx.fillRect(0, 0, 64, 64);

      const moteTex = new THREE.CanvasTexture(mCv);
      const moteMat = new THREE.PointsMaterial({
        size: 4.5,
        map: moteTex,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      dustParticleGroup = new THREE.Points(moteGeo, moteMat);
      fdScene.add(dustParticleGroup);
    }
  }

  /**
   * Builds the 3D Stack of Physical Paper Artifacts:
   * 1. Layer 1 (Bottom Left): "INVESTIGATION" Dossier
   * 2. Layer 2 (Top Left): "TOP SECRET" Slip
   * 3. Layer 3 (Right): "CONTRACT" Page
   * 4. Layer 4 (Center Foreground Hero): "INTERNAL MEMO"
   */
  function buildPaperArtifactStack(data, t) {
    if (fdGroup && fdScene) {
      fdScene.remove(fdGroup);
      fdGroup = null;
    }

    fdGroup = new THREE.Group();

    // 1. Layer 1 (Bottom Left): Aged Manila "INVESTIGATION" Dossier
    const investGeo = new THREE.PlaneGeometry(165, 220);
    const investCv = generateInvestigationTexture();
    const investTex = new THREE.CanvasTexture(investCv);
    investTex.anisotropy = 4;
    const investMat = new THREE.MeshStandardMaterial({
      map: investTex,
      roughness: 0.88,
      metalness: 0.01
    });
    investMesh = new THREE.Mesh(investGeo, investMat);
    investMesh.position.set(-65, -0.6, -15);
    investMesh.rotation.x = -Math.PI / 2;
    investMesh.rotation.z = THREE.MathUtils.degToRad(-16);
    investMesh.receiveShadow = true;
    fdGroup.add(investMesh);

    // 2. Layer 2 (Top Left): "TOP SECRET" Slip
    const secretGeo = new THREE.PlaneGeometry(125, 155);
    const secretCv = generateTopSecretTexture();
    const secretTex = new THREE.CanvasTexture(secretCv);
    secretTex.anisotropy = 4;
    const secretMat = new THREE.MeshStandardMaterial({
      map: secretTex,
      roughness: 0.85,
      metalness: 0.01
    });
    topSecretMesh = new THREE.Mesh(secretGeo, secretMat);
    topSecretMesh.position.set(-42, 0.4, -45);
    topSecretMesh.rotation.x = -Math.PI / 2;
    topSecretMesh.rotation.z = THREE.MathUtils.degToRad(-9);
    topSecretMesh.receiveShadow = true;
    fdGroup.add(topSecretMesh);

    // 3. Layer 3 (Right): Legal "CONTRACT" Page with Signature
    const contractGeo = new THREE.PlaneGeometry(160, 215);
    const contractCv = generateContractTexture();
    const contractTex = new THREE.CanvasTexture(contractCv);
    contractTex.anisotropy = 4;
    const contractMat = new THREE.MeshStandardMaterial({
      map: contractTex,
      roughness: 0.82,
      metalness: 0.01
    });
    contractMesh = new THREE.Mesh(contractGeo, contractMat);
    contractMesh.position.set(68, 0.1, -10);
    contractMesh.rotation.x = -Math.PI / 2;
    contractMesh.rotation.z = THREE.MathUtils.degToRad(14);
    contractMesh.receiveShadow = true;
    fdGroup.add(contractMesh);

    // 4. Layer 4 (Center Foreground Hero): "INTERNAL MEMO" (Sharp focus)
    const memoWidth = 168;
    const memoHeight = 126; // 4:3 ratio
    const memoThickness = 0.8;

    const memoCv = generateMemoTexture(data, t);
    const memoTex = new THREE.CanvasTexture(memoCv);
    memoTex.anisotropy = 8;

    const frontMat = new THREE.MeshStandardMaterial({
      map: memoTex,
      roughness: 0.78,
      metalness: 0.02
    });

    const backMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(data.paperTone || '#fbf8ef'),
      roughness: 0.85,
      metalness: 0.01
    });

    const sideMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dcd5c1'),
      roughness: 0.9,
      metalness: 0.01
    });

    const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
    const memoGeo = new THREE.BoxGeometry(memoWidth, memoThickness, memoHeight);

    memoMesh = new THREE.Mesh(memoGeo, materials);
    memoMesh.castShadow = true;
    memoMesh.receiveShadow = true;
    memoMesh.position.set(0, 1.8, 8);
    memoMesh.rotation.y = THREE.MathUtils.degToRad(-3);
    fdGroup.add(memoMesh);

    // 3D Spatial Framing: 25°-35° pitch/tilt (X-axis) and slight yaw (Y-axis)
    const pitch = data.tiltAngleX !== undefined ? data.tiltAngleX : 29;
    const yaw = data.tiltAngleY !== undefined ? data.tiltAngleY : -10;
    fdGroup.rotation.x = THREE.MathUtils.degToRad(pitch);
    fdGroup.rotation.y = THREE.MathUtils.degToRad(yaw);
    fdGroup.rotation.z = THREE.MathUtils.degToRad(3.2);
    fdGroup.position.set(6, 6, 4);

    fdScene.add(fdGroup);
  }

  /**
   * Initializes the Three.js Viewport inside the target container
   */
  window.initFraudDossier3DScene = function(container, data) {
    if (!container) return;
    cleanupFraudDossier3DScene();

    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const w = container.clientWidth || 960;
    const h = container.clientHeight || 540;

    // 1. Scene
    fdScene = new THREE.Scene();
    fdScene.background = new THREE.Color('#06090e');

    // 2. Camera Rig: Macro Telephoto Lens with Close-up Tactile Framing (f/2.8 feel)
    fdCamera = new THREE.PerspectiveCamera(32, w / h, 5, 2000);
    fdCamera.position.set(8, 160, 245);
    fdCamera.lookAt(8, 10, 8);

    // 3. Renderer with PCF Soft Contact Shadows
    fdRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    fdRenderer.setSize(w, h);
    fdRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    fdRenderer.shadowMap.enabled = true;
    fdRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(fdRenderer.domElement);

    // 4. OrbitControls for interactive 3D navigation
    if (typeof THREE.OrbitControls !== 'undefined') {
      fdControls = new THREE.OrbitControls(fdCamera, fdRenderer.domElement);
      fdControls.enableDamping = true;
      fdControls.dampingFactor = 0.08;
      fdControls.maxPolarAngle = Math.PI / 2 - 0.05;
      fdControls.minDistance = 120;
      fdControls.maxDistance = 460;
      fdControls.target.set(8, 10, 8);
    }

    // 5. Lighting: Focused Overhead Key Spotlight + Warm Ambient Fill
    ambientLight = new THREE.AmbientLight(new THREE.Color('#2a2018'), 0.85);
    fdScene.add(ambientLight);

    const spotIntensity = d.spotlightIntensity !== undefined ? d.spotlightIntensity : 2.4;
    keySpotLight = new THREE.SpotLight(new THREE.Color(d.lightWarmth || '#fff3db'), spotIntensity);
    keySpotLight.position.set(40, 300, 150);
    keySpotLight.target.position.set(8, 0, 8);
    keySpotLight.angle = 0.72;
    keySpotLight.penumbra = 0.68;
    keySpotLight.decay = 1.35;
    keySpotLight.distance = 800;
    keySpotLight.castShadow = true;
    keySpotLight.shadow.mapSize.width = 2048;
    keySpotLight.shadow.mapSize.height = 2048;
    keySpotLight.shadow.bias = -0.0004;
    fdScene.add(keySpotLight);
    fdScene.add(keySpotLight.target);

    // Subtle cool edge rim light for contrast
    rimLight = new THREE.DirectionalLight(new THREE.Color('#93c5fd'), 0.42);
    rimLight.position.set(-190, 90, -130);
    fdScene.add(rimLight);

    // 6. Build Geometry Assemblies
    buildStudioEnvironment(d);
    buildPaperArtifactStack(d, 0);

    // 7. Render Loop
    lastTimestamp = performance.now();
    function renderLoop(now) {
      fdAnimFrame = requestAnimationFrame(renderLoop);
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock = (animClock + delta) % (d.duration || 5.0);
        updateAnimationStep(animClock, d);
      } else {
        updateAnimationStep(manualT, d);
      }

      // Drift dust motes
      if (dustParticleGroup && dustParticleGroup.geometry) {
        const pos = dustParticleGroup.geometry.attributes.position.array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] -= 0.18;
          if (pos[i] < 12) pos[i] = 145;
        }
        dustParticleGroup.geometry.attributes.position.needsUpdate = true;
      }

      if (fdControls) fdControls.update();
      if (fdRenderer && fdScene && fdCamera) {
        fdRenderer.render(fdScene, fdCamera);
      }
    }
    fdAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * Updates dynamic 3D elements for timestamp t (0 <= t <= duration)
   */
  function updateAnimationStep(t, data) {
    if (!memoMesh) return;
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t));

    // Update dynamic memo texture (reflecting current redaction, highlighter & stamp state)
    const cv = generateMemoTexture(data, ct);
    if (memoMesh.material && memoMesh.material[4]) {
      const tex = memoMesh.material[4].map;
      if (tex && tex.image !== cv) {
        tex.image = cv;
        tex.needsUpdate = true;
      }
    }

    // Subtle cinematic camera glide / breathing motion
    if (!fdControls || !fdControls.state || fdControls.state === -1) {
      const panProgress = ct / dur;
      if (fdCamera) {
        const startY = 160;
        const endY = 148;
        const startZ = 245;
        const endZ = 225;
        fdCamera.position.y = startY + (endY - startY) * panProgress;
        fdCamera.position.z = startZ + (endZ - startZ) * panProgress;
        fdCamera.lookAt(8, 10 - panProgress * 4, 8 - panProgress * 3);
      }
    }
  }

  /**
   * Cleans up scene resources
   */
  function cleanupFraudDossier3DScene() {
    if (fdAnimFrame) {
      cancelAnimationFrame(fdAnimFrame);
      fdAnimFrame = null;
    }
    if (fdControls) {
      fdControls.dispose();
      fdControls = null;
    }
    if (fdRenderer) {
      if (fdRenderer.domElement && fdRenderer.domElement.parentNode) {
        fdRenderer.domElement.parentNode.removeChild(fdRenderer.domElement);
      }
      fdRenderer.dispose();
      fdRenderer = null;
    }
    fdScene = null;
    fdCamera = null;
    fdGroup = null;
    memoMesh = null;
    deskMesh = null;
    gridMesh = null;
    investMesh = null;
    topSecretMesh = null;
    contractMesh = null;
    contactShadowMesh = null;
    dustParticleGroup = null;
  }

  /**
   * Mounts the 3D Fraud Dossier Stage inside the Customizer Modal
   */
  window.tplMountFraudDossier3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #06090e; overflow: hidden; cursor: grab; user-select: none;">
        <!-- High-res Instant Plate Backdrop -->
        <img id="fraud-dossier-plate-bg" src="/mahogany_desk_texture.jpg" alt="Mahogany Desk" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.35; filter: contrast(125%) brightness(70%);" />

        <!-- 3D Three.js WebGL Viewport -->
        <div id="fraud-dossier-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>

        <!-- Telemetry & Camera Telemetry HUD Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #ef4444; background: rgba(10,12,18,0.92); border: 1px solid rgba(239,68,68,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            3D FRAUD DOSSIER RIG &bull; EYES ONLY &bull; REDACTION BAR &bull; CONFIDENTIAL STAMP
          </span>
          <span style="font-family: monospace; font-size: 9px; color: #94a3b8; background: rgba(10,12,18,0.75); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 4px;">
            DRAG TO ORBIT
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#fraud-dossier-3d-viewport');
    function triggerInit() {
      if (typeof window.initFraudDossier3DScene === 'function') {
        window.initFraudDossier3DScene(viewport, d);
      }
    }
    triggerInit();
    setTimeout(triggerInit, 60);
  };

  /**
   * Stepper callback for hover preview loop & live customizer playback
   */
  window.stepFraudDossierAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    const viewport = container.querySelector('#fraud-dossier-3d-viewport');
    if (!viewport && !fdRenderer) {
      window.initFraudDossier3DScene(container, d);
    }
    updateAnimationStep(t, d);
  };

  /**
   * Canvas Renderer for Timeline Playback and 4K Video Export
   */
  window.renderFraudDossierCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    if (fdRenderer && fdRenderer.domElement && fdScene && fdCamera) {
      updateAnimationStep(t, d);
      fdRenderer.render(fdScene, fdCamera);
      ctx.drawImage(fdRenderer.domElement, 0, 0, cw, ch);
      return;
    }

    // High-resolution standalone 2D canvas blit fallback
    // 1. Draw mahogany desk background
    const deskImg = imageAssets.get('/mahogany_desk_texture.jpg');
    if (deskImg && deskImg.complete) {
      ctx.drawImage(deskImg, 0, 0, cw, ch);
    } else {
      ctx.fillStyle = '#160c08';
      ctx.fillRect(0, 0, cw, ch);
    }

    // 2. Draw coordinate grid overlay
    const gridCv = generateGridOverlayTexture(cw, ch);
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(gridCv, 0, 0, cw, ch);
    ctx.restore();

    // 3. Draw Overhead Key Spotlight with vignette
    const spotGrad = ctx.createRadialGradient(cw * 0.52, ch * 0.48, cw * 0.08, cw * 0.52, ch * 0.48, cw * 0.65);
    spotGrad.addColorStop(0, 'rgba(255, 245, 220, 0.22)');
    spotGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.2)');
    spotGrad.addColorStop(1, 'rgba(4, 7, 12, 0.92)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, cw, ch);

    // 4. Draw Background Left: Investigation dossier
    const investCv = generateInvestigationTexture();
    ctx.save();
    ctx.translate(cw * 0.36, ch * 0.46);
    ctx.rotate(-16 * Math.PI / 180);
    ctx.transform(1, -0.05, 0.18, 0.9, 0, 0);
    ctx.filter = 'blur(1.8px)';
    const invW = cw * 0.36;
    const invH = invW * (1365 / 1024);
    ctx.drawImage(investCv, -invW * 0.5, -invH * 0.5, invW, invH);
    ctx.restore();

    // 5. Draw Background Right: Contract page
    const contractCv = generateContractTexture();
    ctx.save();
    ctx.translate(cw * 0.65, ch * 0.48);
    ctx.rotate(14 * Math.PI / 180);
    ctx.transform(1, -0.05, 0.18, 0.9, 0, 0);
    ctx.filter = 'blur(1.5px)';
    const conW = cw * 0.35;
    const conH = conW * (1365 / 1024);
    ctx.drawImage(contractCv, -conW * 0.5, -conH * 0.5, conW, conH);
    ctx.restore();

    // 6. Draw Center Hero Memo
    const memoCv = generateMemoTexture(d, t);
    ctx.save();
    ctx.translate(cw * 0.5, ch * 0.5);
    ctx.rotate(-2.5 * Math.PI / 180);
    ctx.transform(1, -0.05, 0.2, 0.88, 0, 0);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetX = 12;
    ctx.shadowOffsetY = 24;

    const docW = cw * 0.46;
    const docH = docW * (3 / 4);
    ctx.drawImage(memoCv, -docW * 0.5, -docH * 0.5, docW, docH);
    ctx.restore();
  };

  /**
   * Generates Rich 3D CSS Markup for Instant Hover & Fallback Rendering
   */
  window.tplBuildFraudDossierHtml = function(data) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    return `
      <div class="fd-scene-root">
        <!-- 1. Dark Mahogany Desk Surface -->
        <div class="fd-desk-surface"></div>

        <!-- 2. Investigative Topographic Coordinate Lines & Crosshairs -->
        <div class="fd-grid-overlay">
          <div class="fd-hud-coord fd-hud-tl">LAT // 40\u00b042'51"N &bull; LON // 74\u00b000'23"W</div>
          <div class="fd-hud-coord fd-hud-tr">GRID REF 8842-X &bull; SECTOR 04</div>
          <svg class="fd-grid-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <pattern id="fd-fine-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.09)" stroke-width="0.8" />
                <circle cx="50" cy="50" r="1.5" fill="rgba(56, 189, 248, 0.18)" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#fd-fine-grid)" />
            <!-- Crosshairs -->
            <g stroke="rgba(56, 189, 248, 0.28)" stroke-width="1.2">
              <line x1="160" y1="120" x2="180" y2="120" /><line x1="170" y1="110" x2="170" y2="130" />
              <line x1="820" y1="460" x2="840" y2="460" /><line x1="830" y1="450" x2="830" y2="470" />
            </g>
            <!-- Topographic curves -->
            <path d="M -20 180 Q 250 80, 520 200 T 1020 160" fill="none" stroke="rgba(56, 189, 248, 0.12)" stroke-width="1.2" />
            <path d="M -20 280 Q 220 180, 500 300 T 1020 260" fill="none" stroke="rgba(56, 189, 248, 0.10)" stroke-width="1.0" />
          </svg>
        </div>

        <!-- 3. Focused Overhead Key Spotlight with Rich Vignette -->
        <div class="fd-key-spotlight"></div>

        <!-- 4. Volumetric Dust Motes -->
        <div class="fd-dust-layer">
          <div class="fd-mote fd-m1"></div>
          <div class="fd-mote fd-m2"></div>
          <div class="fd-mote fd-m3"></div>
          <div class="fd-mote fd-m4"></div>
          <div class="fd-mote fd-m5"></div>
        </div>

        <!-- 5. 3D Spatial Rig (25°–35° pitch tilt, 55%–65% viewport coverage) -->
        <div class="fd-stage-3d">
          <!-- Layer 1: Left Manila "INVESTIGATION" Dossier (f/2.8 DOF blur) -->
          <div class="fd-paper-layer fd-layer-investigation">
            <div class="fd-invest-stamp">INVESTIGATION // FILE 904</div>
            <div class="fd-invest-line">SUBJECT: OFF-BALANCE SHEET LIABILITIES</div>
            <div class="fd-invest-line">STATUS: SUBPOENA ADMISSIBLE</div>
            <div class="fd-invest-line">EXHIBIT D-4: REVENUE COMMINGLING</div>
            <div class="fd-invest-line">&bull; SIDE LETTERS CONCEALED FROM AUDIT</div>
            <div class="fd-invest-seal">SUBPOENA VERIFIED</div>
          </div>

          <!-- Layer 2: Top-Left "TOP SECRET" Slip -->
          <div class="fd-paper-layer fd-layer-topsecret">
            <div class="fd-stamp-topsecret">TOP SECRET</div>
            <div class="fd-secret-text">LEVEL 4 CLASSIFIED &bull; OIG AUDIT</div>
            <div class="fd-secret-bar"></div>
            <div class="fd-secret-bar" style="width: 75%;"></div>
          </div>

          <!-- Layer 3: Right "CONTRACT" Page with Signature (f/2.8 DOF blur) -->
          <div class="fd-paper-layer fd-layer-contract">
            <div class="fd-contract-head">CONTRACT</div>
            <div class="fd-contract-line">WHEREAS Corporation executed side covenants;</div>
            <div class="fd-contract-line">NOW THEREFORE undisclosed considerations apply;</div>
            <div class="fd-contract-bar"></div>
            <div class="fd-contract-bar" style="width: 60%;"></div>
            <div class="fd-contract-sig-wrap">
              <span class="fd-contract-sig-lbl">Signature</span>
              <svg class="fd-contract-sig" viewBox="0 0 160 40">
                <path d="M 6 24 C 28 4, 46 32, 70 18 S 112 28, 134 10 L 152 20" />
              </svg>
            </div>
          </div>

          <!-- Layer 4: Center Foreground Hero Memo Artifact (Sharp Focus) -->
          <div class="fd-paper-layer fd-layer-hero">
            <div class="fd-hero-paper-grain"></div>
            <div class="rd-head">${d.title || 'INTERNAL MEMO \u00b7 EYES ONLY'}</div>
            <div class="rd-divider"></div>
            <div class="rd-line">${d.recipient || 'To: Board of Directors'}</div>
            <div class="rd-line rd-from">
              <span>${d.senderLabel || 'From:'}</span>
              <span class="rd-bar"></span>
            </div>
            <div class="rd-line">${d.subjectLine1 || 'Re: Q3 revenue booked via'}</div>
            <div class="rd-line">${d.subjectLine2 || 'side letters totaling'}</div>
            <div class="rd-line rd-hl-wrap">
              <span class="rd-hl">${d.highlightedAmount || '$8.4 BILLION'}</span>
            </div>
            <div class="rd-line rd-disclose">${d.disclosureWarning || 'DO NOT DISCLOSE.'}</div>
            <div class="rd-stamp">${d.stampText || 'CONFIDENTIAL'}</div>
          </div>
        </div>
      </div>
    `;
  };

  /**
   * Contextual Inspector Controls Builder for Customizer
   */
  window.tplBuildFraudDossierInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">📁</span>
            <span style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.8px;">Fraud Dossier 3D Rig</span>
          </div>
          <span style="font-size: 9px; color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); padding: 2px 6px; border-radius: 4px;">PBR THREE.JS RIG</span>
        </div>

        <!-- Section 1: Memo Text & Redaction -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Memo Content &amp; Redactions</span>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Header Title</span>
            <input type="text" id="fd-inp-title" value="${d.title || 'INTERNAL MEMO \u00b7 EYES ONLY'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Recipient</span>
              <input type="text" id="fd-inp-recipient" value="${d.recipient || 'To: Board of Directors'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 6px; font-size: 9.5px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Sender (Redacted at 0.8s)</span>
              <input type="text" id="fd-inp-sender" value="${d.senderLabel || 'From:'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 6px; font-size: 9.5px; outline: none;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Highlighted Amount (Sweeps at 1.6s)</span>
            <input type="text" id="fd-inp-amount" value="${d.highlightedAmount || '$8.4 BILLION'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #facc15; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Warning Note</span>
              <input type="text" id="fd-inp-warning" value="${d.disclosureWarning || 'DO NOT DISCLOSE.'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Rubber Stamp (Slams at 2.3s)</span>
              <input type="text" id="fd-inp-stamp" value="${d.stampText || 'CONFIDENTIAL'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>
          </div>
        </div>

        <!-- Section 2: Environment & Lighting Pass -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Cinematic Lighting &amp; Atmosphere</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Desk Surface</span>
              <select id="fd-sel-surface" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;">
                <option value="mahogany" ${d.surfaceType === 'mahogany' ? 'selected' : ''}>Mahogany Desk</option>
                <option value="blueprint" ${d.surfaceType === 'blueprint' ? 'selected' : ''}>Tactical Blue Grid</option>
                <option value="dark_slate" ${d.surfaceType === 'dark_slate' ? 'selected' : ''}>Dark Slate / Wood</option>
              </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Spotlight Intensity</span>
              <input type="range" id="fd-rng-spotlight" min="0.8" max="3.5" step="0.1" value="${d.spotlightIntensity || 2.4}" style="accent-color: #ef4444;" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-grid" ${d.showCoordinateGrid !== false ? 'checked' : ''} style="accent-color: #38bdf8;" />
              Topographic Coordinate Grid
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-dust" ${d.volumetricDust !== false ? 'checked' : ''} style="accent-color: #facc15;" />
              Volumetric Dust Motes
            </label>
          </div>
        </div>

        <!-- Section 3: 3D Spatial Rig (25°–35° Tilt & Macro Coverage) -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">3D Spatial Pitch &amp; Framing</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 8.5px; color: #cbd5e1;">Pitch Tilt (X-Axis)</span>
                <span id="fd-val-tilt" style="font-size: 8.5px; color: #ef4444; font-family: monospace;">${d.tiltAngleX || 29}&deg;</span>
              </div>
              <input type="range" id="fd-rng-tilt" min="20" max="40" step="1" value="${d.tiltAngleX || 29}" style="accent-color: #ef4444;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 8.5px; color: #cbd5e1;">Scale Coverage</span>
                <span id="fd-val-scale" style="font-size: 8.5px; color: #ef4444; font-family: monospace;">${d.coverageScale || 62}%</span>
              </div>
              <input type="range" id="fd-rng-scale" min="45" max="75" step="1" value="${d.coverageScale || 62}" style="accent-color: #ef4444;" />
            </div>
          </div>
        </div>

        <!-- Reset Button -->
        <div style="display: flex; justify-content: flex-end; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.06);">
          <button id="fd-btn-reset" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; font-size: 9.5px; padding: 4px 10px; border-radius: 4px; cursor: pointer;">Reset to Default</button>
        </div>
      </div>
    `;

    // Hook up live event listeners
    function updateField(key, val) {
      if (typeof window.tplSetContextualData === 'function') {
        const cur = window.tplGetContextualData(tplId) || {};
        const next = Object.assign({}, cur, { [key]: val });
        window.tplSetContextualData(tplId, next);
        window.tplUpdateStageWithContextualData(tplId, next);
      }
    }

    const inpTitle = container.querySelector('#fd-inp-title');
    if (inpTitle) inpTitle.oninput = (e) => updateField('title', e.target.value);

    const inpRecipient = container.querySelector('#fd-inp-recipient');
    if (inpRecipient) inpRecipient.oninput = (e) => updateField('recipient', e.target.value);

    const inpSender = container.querySelector('#fd-inp-sender');
    if (inpSender) inpSender.oninput = (e) => updateField('senderLabel', e.target.value);

    const inpAmount = container.querySelector('#fd-inp-amount');
    if (inpAmount) inpAmount.oninput = (e) => updateField('highlightedAmount', e.target.value);

    const inpWarning = container.querySelector('#fd-inp-warning');
    if (inpWarning) inpWarning.oninput = (e) => updateField('disclosureWarning', e.target.value);

    const inpStamp = container.querySelector('#fd-inp-stamp');
    if (inpStamp) inpStamp.oninput = (e) => updateField('stampText', e.target.value);

    const selSurface = container.querySelector('#fd-sel-surface');
    if (selSurface) selSurface.onchange = (e) => updateField('surfaceType', e.target.value);

    const rngSpot = container.querySelector('#fd-rng-spotlight');
    if (rngSpot) rngSpot.oninput = (e) => updateField('spotlightIntensity', parseFloat(e.target.value));

    const chkGrid = container.querySelector('#fd-chk-grid');
    if (chkGrid) chkGrid.onchange = (e) => updateField('showCoordinateGrid', e.target.checked);

    const chkDust = container.querySelector('#fd-chk-dust');
    if (chkDust) chkDust.onchange = (e) => updateField('volumetricDust', e.target.checked);

    const rngTilt = container.querySelector('#fd-rng-tilt');
    const valTilt = container.querySelector('#fd-val-tilt');
    if (rngTilt) rngTilt.oninput = (e) => {
      const v = parseInt(e.target.value);
      if (valTilt) valTilt.textContent = `${v}°`;
      updateField('tiltAngleX', v);
    };

    const rngScale = container.querySelector('#fd-rng-scale');
    const valScale = container.querySelector('#fd-val-scale');
    if (rngScale) rngScale.oninput = (e) => {
      const v = parseInt(e.target.value);
      if (valScale) valScale.textContent = `${v}%`;
      updateField('coverageScale', v);
    };

    const btnReset = container.querySelector('#fd-btn-reset');
    if (btnReset) btnReset.onclick = () => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    };
  };

})();
