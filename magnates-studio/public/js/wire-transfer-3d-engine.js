/**
 * 3D Glassmorphic SWIFT Banking Wire Transfer Animation Engine
 * Replicating Investigative Documentary Standards (Magnates Media, James Jani, Vox)
 *
 * Implements:
 * 1. 3D Node & Glassmorphic Banking HUD:
 *    - Origin Account Node: Aged textured banking certificate / offshore paper card angled at 15°-25° tilt
 *      (ORIGIN / Cayman Islands Branch, SWIFT / IBAN formatting, SWIFT wire emblem, watermark)
 *    - Destination Account Node: Frosted glassmorphic banking HUD card angled at 15°-25° tilt
 *      (Destination Account #8492, Shell Corp badge, active ticking balance counter +$2,500,000.00,
 *       status pill "Balance counter alert")
 * 2. High-Velocity Particle Laser Transfer Mechanics:
 *    - Glowing 3D particle laser beam / encrypted data packet stream pulsing across tactical space
 *    - Specular shockwave / ring pulse impact on destination card upon packet arrival
 * 3. 3D Camera Rig & Atmospheric Environment:
 *    - Tactical dark grid canvas with scrolling transaction hashes / financial matrix telemetry
 *    - Smooth 3D camera tracking sweep with f/2.8 lens depth-of-field bokeh
 *    - Full interactive OrbitControls (drag to tilt/orbit in 3D, wheel to zoom)
 *    - Contextual Inspector controls for origin/destination names, amounts, SWIFT codes, and visual FX
 */
(function() {
  'use strict';

  const TEMPLATE_ID = 'wire-transfer';

  const DEFAULT_CONFIG = {
    // Origin Node
    originTitle: 'ORIGIN /',
    originSubtitle: 'Cayman Islands Branch',
    originIban: 'IBAN / XXXX-XXXX-XXXX-XXXX-8003',
    originSwift: 'SWIFT code  1234568',
    originBankLogo: 'SWIFT',

    // Destination Node
    destBadge: 'Shell Corp',
    destTitle: 'Destination Account',
    destAccountNum: '#8492',
    transferAmount: 2500000.00,
    destCurrencySymbol: '$',
    destPrefix: '+',
    statusAlert: 'Balance counter alert',

    // Transfer Mechanics & Beam
    beamSpeed: 1.25,
    beamGlowColor: '#7dd3fc',
    beamCoreColor: '#ffffff',
    particleCount: 160,
    impactPulseEnabled: true,
    counterSpeed: 1.0,

    // 3D Camera & Environment
    cameraTiltY: 18.0,
    cameraTiltX: 6.0,
    cameraDistance: 440,
    dofBlur: 0.85,
    tacticalGridEnabled: true,
    matrixTelemetryEnabled: true,
    vignetteIntensity: 0.75,
    styleMode: 'investigative_hud'
  };

  let wireScene = null;
  let wireCamera = null;
  let wireRenderer = null;
  let wireAnimFrame = null;
  let wireControls = null;
  let wireGroup = null;

  // Meshes
  let originCardMesh = null;
  let originCardCanvas = null;
  let originCardCtx = null;
  let originCardTexture = null;

  let destCardMesh = null;
  let destCardCanvas = null;
  let destCardCtx = null;
  let destCardTexture = null;

  let beamParticles = null;
  let beamPositions = null;
  let beamVelocities = null;
  let beamCoreMesh = null;
  let impactRingMesh = null;
  let bgGridMesh = null;

  let animClock = 0;
  let lastTimestamp = 0;
  let isManualScrub = false;
  let manualT = 0;

  // Cache for static background & stamps
  const textureCache = new Map();

  function formatCurrency(val) {
    return Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /**
   * 1. ORIGIN CARD TEXTURE GENERATION
   * Photorealistic aged archival banking card / Cayman Islands Branch with SWIFT stamp
   */
  function drawOriginCardTexture(data, t) {
    if (!originCardCanvas || !originCardCtx) {
      originCardCanvas = document.createElement('canvas');
      originCardCanvas.width = 1024;
      originCardCanvas.height = 680;
      originCardCtx = originCardCanvas.getContext('2d');
    }
    const ctx = originCardCtx;
    const w = originCardCanvas.width;
    const h = originCardCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const pad = 20;
    const x = pad;
    const y = pad;
    const cw = w - pad * 2;
    const ch = h - pad * 2;
    const r = 24;

    // Outer Card Shell - Aged Paper with Beveled Metal Rim
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + cw - r, y);
    ctx.quadraticCurveTo(x + cw, y, x + cw, y + r);
    ctx.lineTo(x + cw, y + ch - r);
    ctx.quadraticCurveTo(x + cw, y + ch, x + cw - r, y + ch);
    ctx.lineTo(x + r, y + ch);
    ctx.quadraticCurveTo(x, y + ch, x, y + ch - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    // Dark Outer Rim (frosted edge)
    ctx.fillStyle = 'rgba(28, 32, 42, 0.88)';
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.stroke();

    // Inner Archival Cream Paper Surface
    const inPad = 16;
    const ix = x + inPad;
    const iy = y + inPad;
    const icw = cw - inPad * 2;
    const ich = ch - inPad * 2;
    const ir = 16;

    ctx.beginPath();
    ctx.moveTo(ix + ir, iy);
    ctx.lineTo(ix + icw - ir, iy);
    ctx.quadraticCurveTo(ix + icw, iy, ix + icw, iy + ir);
    ctx.lineTo(ix + icw, iy + ich - ir);
    ctx.quadraticCurveTo(ix + icw, iy + ich, ix + icw - ir, iy + ich);
    ctx.lineTo(ix + ir, iy + ich);
    ctx.quadraticCurveTo(ix, iy + ich, ix, iy + ich - ir);
    ctx.lineTo(ix, iy + ir);
    ctx.quadraticCurveTo(ix, iy, ix + ir, iy);
    ctx.closePath();

    // Aged parchment gradient
    const paperGrad = ctx.createRadialGradient(ix + icw * 0.45, iy + ich * 0.4, 60, ix + icw / 2, iy + ich / 2, icw * 0.7);
    paperGrad.addColorStop(0, '#ece5ce');
    paperGrad.addColorStop(0.55, '#dfd6bb');
    paperGrad.addColorStop(0.85, '#cfc3a3');
    paperGrad.addColorStop(1, '#baa884');
    ctx.fillStyle = paperGrad;
    ctx.fill();

    // Subtle paper stains & fiber noise
    ctx.fillStyle = 'rgba(120, 90, 40, 0.04)';
    for (let i = 0; i < 28; i++) {
      const sx = ix + ((i * 97) % icw);
      const sy = iy + ((i * 131) % ich);
      ctx.beginPath();
      ctx.arc(sx, sy, 18 + (i % 24), 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner paper border rule
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = 'rgba(100, 80, 50, 0.3)';
    ctx.stroke();
    ctx.restore();

    // SWIFT / Wire Globe Emblem (Top Right)
    ctx.save();
    const stampX = ix + icw - 110;
    const stampY = iy + 105;
    ctx.translate(stampX, stampY);
    ctx.strokeStyle = 'rgba(78, 62, 42, 0.65)';
    ctx.fillStyle = 'rgba(78, 62, 42, 0.65)';
    ctx.lineWidth = 3.5;

    // Circular globe outline
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.stroke();

    // Lat/Long lines
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-52, 0); ctx.lineTo(52, 0);
    ctx.moveTo(0, -52); ctx.lineTo(0, 52);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 52, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, 52, 28, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Central SWIFT badge
    ctx.fillStyle = 'rgba(236, 229, 206, 0.95)';
    ctx.fillRect(-36, -16, 72, 32);
    ctx.strokeRect(-36, -16, 72, 32);

    ctx.font = '900 18px "Space Grotesk", sans-serif';
    ctx.fillStyle = 'rgba(60, 45, 25, 0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.originBankLogo || 'SWIFT', 0, 2);
    ctx.restore();

    // Bank Information Typography
    ctx.save();
    const tx = ix + 54;
    let ty = iy + 140;

    // Header Tag: ORIGIN /
    ctx.font = '900 32px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#1e1c18';
    ctx.textAlign = 'left';
    ctx.fillText(data.originTitle || 'ORIGIN /', tx, ty);

    // Branch title: Cayman Islands Branch
    ty += 42;
    ctx.font = '800 36px "Space Grotesk", -apple-system, sans-serif';
    ctx.fillStyle = '#1c1917';
    ctx.fillText(data.originSubtitle || 'Cayman Islands Branch', tx, ty);

    // Divider Line
    ty += 34;
    ctx.strokeStyle = 'rgba(70, 55, 35, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(ix + icw - 60, ty);
    ctx.stroke();

    // IBAN Section
    ty += 52;
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(40, 32, 20, 0.65)';
    ctx.fillText('IBAN', tx, ty);

    ty += 30;
    ctx.font = '800 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#1e1c18';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(data.originIban || 'IBAN / XXXX-XXXX-XXXX-XXXX-8003', tx, ty);

    // SWIFT code Section
    ty += 54;
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(40, 32, 20, 0.65)';
    ctx.fillText('SWIFT code', tx, ty);

    ty += 30;
    ctx.font = '800 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#1e1c18';
    ctx.fillText(data.originSwift || 'SWIFT code  1234568', tx, ty);

    // Fine security watermark stamp at bottom
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(80, 65, 40, 0.45)';
    ctx.textAlign = 'right';
    ctx.fillText('CONFIDENTIAL OFFSHORE SETTLEMENT // SEC-AUTH 0x88F9', ix + icw - 60, iy + ich - 32);

    ctx.restore();

    if (originCardTexture) {
      originCardTexture.needsUpdate = true;
    }
  }

  /**
   * 2. DESTINATION CARD TEXTURE GENERATION
   * High-tech 3D Frosted Glass Banking HUD (Shell Corp, #8492, Live ticking counter +$2,500,000.00)
   */
  function drawDestCardTexture(data, t) {
    if (!destCardCanvas || !destCardCtx) {
      destCardCanvas = document.createElement('canvas');
      destCardCanvas.width = 1024;
      destCardCanvas.height = 680;
      destCardCtx = destCardCanvas.getContext('2d');
    }
    const ctx = destCardCtx;
    const w = destCardCanvas.width;
    const h = destCardCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const pad = 20;
    const x = pad;
    const y = pad;
    const cw = w - pad * 2;
    const ch = h - pad * 2;
    const r = 28;

    // Frosted Glassmorphic Panel Outer Shape
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + cw - r, y);
    ctx.quadraticCurveTo(x + cw, y, x + cw, y + r);
    ctx.lineTo(x + cw, y + ch - r);
    ctx.quadraticCurveTo(x + cw, y + ch, x + cw - r, y + ch);
    ctx.lineTo(x + r, y + ch);
    ctx.quadraticCurveTo(x, y + ch, x, y + ch - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    // Dark Frosted Glass Gradient
    const glassGrad = ctx.createLinearGradient(x, y, x + cw, y + ch);
    glassGrad.addColorStop(0, 'rgba(30, 41, 59, 0.76)');
    glassGrad.addColorStop(0.45, 'rgba(15, 23, 42, 0.86)');
    glassGrad.addColorStop(1, 'rgba(8, 14, 26, 0.92)');
    ctx.fillStyle = glassGrad;
    ctx.fill();

    // Subtle blue specular ambient fill
    ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.fill();

    // Metallic frosted beveled edge
    const strokeGrad = ctx.createLinearGradient(x, y, x + cw, y + ch);
    const sweep = ((t * 0.4) % 1.5) - 0.25;
    const s0 = Math.max(0, sweep - 0.15);
    const s1 = Math.min(1, Math.max(0, sweep));
    const s2 = Math.min(1, sweep + 0.15);

    strokeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    if (s0 > 0 && s0 < 1) strokeGrad.addColorStop(s0, 'rgba(255, 255, 255, 0.25)');
    if (s1 > 0 && s1 < 1) strokeGrad.addColorStop(s1, 'rgba(255, 255, 255, 0.95)');
    if (s2 > 0 && s2 < 1) strokeGrad.addColorStop(s2, 'rgba(56, 189, 248, 0.7)');
    strokeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');

    ctx.lineWidth = 4;
    ctx.strokeStyle = strokeGrad;
    ctx.stroke();

    // Thick Glass Rim Shadow (Inner Refraction Illusion)
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.stroke();
    ctx.restore();

    // Top-Right Pill Badge: Shell Corp
    ctx.save();
    const badgeW = 190;
    const badgeH = 54;
    const badgeX = x + cw - badgeW - 40;
    const badgeY = y + 42;
    const badgeR = 12;

    ctx.beginPath();
    ctx.moveTo(badgeX + badgeR, badgeY);
    ctx.lineTo(badgeX + badgeW - badgeR, badgeY);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + badgeR);
    ctx.lineTo(badgeX + badgeW, badgeY + badgeH - badgeR);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - badgeR, badgeY + badgeH);
    ctx.lineTo(badgeX + badgeR, badgeY + badgeH);
    ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - badgeR);
    ctx.lineTo(badgeX, badgeY + badgeR);
    ctx.quadraticCurveTo(badgeX, badgeY, badgeX + badgeR, badgeY);
    ctx.closePath();

    ctx.fillStyle = 'rgba(51, 65, 85, 0.85)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.stroke();

    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.destBadge || 'Shell Corp', badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
    ctx.restore();

    // Destination Account Header & Subtitle
    ctx.save();
    const tx = x + 60;
    let ty = y + 150;

    ctx.font = '600 32px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(data.destTitle || 'Destination Account', tx, ty);

    ty += 48;
    ctx.font = '800 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(data.destAccountNum || '#8492', tx, ty);

    // Live Numerical Balance Counter Calculation
    // Cycle every 3.5 seconds: 0.0 -> full transferAmount with exponential rush
    const totalCycle = 3.6;
    const localT = (t % totalCycle) / totalCycle; // 0 to 1
    const targetAmt = Number(data.transferAmount !== undefined ? data.transferAmount : 2500000.00);

    let currentVal = 0;
    let isAccelerating = false;
    if (localT < 0.25) {
      // First 25% of cycle: transfer packet approaching, counter waiting at 0 or baseline
      currentVal = 0;
    } else if (localT < 0.85) {
      // Packet arrives: rapid counter surge
      const countProgress = (localT - 0.25) / 0.60;
      // Exponential burst
      currentVal = targetAmt * Math.pow(countProgress, 1.35);
      isAccelerating = true;
    } else {
      currentVal = targetAmt;
    }

    const valString = formatCurrency(currentVal);
    // Split into prefix, symbol, dollars, cents
    const parts = valString.split('.');
    const dollarsStr = parts[0];
    const centsStr = parts[1] || '00';

    // Massive Bold Numerical Typography (+$2,500,000.00)
    ty += 110;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Motion blur simulation during rapid counting
    if (isAccelerating) {
      ctx.shadowColor = 'rgba(34, 197, 94, 0.75)';
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
      ctx.shadowBlur = 8;
    }

    // 1. Red Plus Sign (Match Image 2: Red '+', Green '$', White digits, Red '.00' cents)
    ctx.font = '900 82px "Space Grotesk", "JetBrains Mono", sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
    ctx.fillText(data.destPrefix || '+', tx, ty);
    let curX = tx + ctx.measureText(data.destPrefix || '+').width + 8;

    // 2. Green Dollar Sign
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
    ctx.fillText(data.destCurrencySymbol || '$', curX, ty);
    curX += ctx.measureText(data.destCurrencySymbol || '$').width + 6;

    // 3. Bold White/Silver Main Digits
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(dollarsStr, curX, ty);
    curX += ctx.measureText(dollarsStr).width;

    // 4. Dot and Cents in Red
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
    ctx.fillText('.' + centsStr, curX, ty);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Bottom Subtitle Alert: "Balance counter alert"
    ty += 92;
    ctx.font = '600 24px "Space Grotesk", -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(data.statusAlert || 'Balance counter alert', tx, ty);

    ctx.restore();

    if (destCardTexture) {
      destCardTexture.needsUpdate = true;
    }
  }

  /**
   * 3. TACTICAL GRID & MATRIX BACKDROP GENERATION
   */
  function generateTacticalBackdropCanvas() {
    const cv = document.createElement('canvas');
    cv.width = 1200;
    cv.height = 760;
    const ctx = cv.getContext('2d');

    // Dark tactical blue-black background
    const grad = ctx.createRadialGradient(600, 380, 80, 600, 380, 700);
    grad.addColorStop(0, '#0c1322');
    grad.addColorStop(0.55, '#060a13');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 760);

    // Isometric / Tactical Perspective Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1.0;
    const step = 48;
    for (let x = 0; x <= 1200; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 760);
      ctx.stroke();
    }
    for (let y = 0; y <= 760; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Scrolling Financial Matrix Hashes & SWIFT Routing Telemetry (Top and Sides)
    ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.font = '10px "JetBrains Mono", monospace';
    const hashes = [
      'hsdoea2a97as929b53de37566f62b63268 // SWIFT_ROUTING_KEY_LIVE',
      'IBAN 1965 / transaction hashe : f4c0...5a88 Cayman Branch',
      'aah1ech2e93as5b4563720356 // OFFSHORE CAPITAL MOBILIZED',
      'HA8900% / transaction hash : 9f3a...c821 Shell Corporation',
      'hwt7eb9569a549 // EXEMPT LEDGER VERIFIED',
      '787% / routing node / Cayman Islands Branch -> Zurich SWIFT'
    ];

    for (let i = 0; i < hashes.length; i++) {
      ctx.fillText(hashes[i], 580, 52 + i * 22);
    }

    // Left sidebar faint coordinates
    const leftCoords = [
      '// transaction hashe : fac8e3685628',
      'IBAN 1965 / hash : Cayman_Isl',
      'realtsanst // transaction hashe',
      'IBAN / PP / transaction hashe',
      'amount : $2,500,000.00'
    ];
    for (let i = 0; i < leftCoords.length; i++) {
      ctx.fillText(leftCoords[i], 36, 140 + i * 26);
    }

    return cv;
  }

  /**
   * 4. INITIALIZE THREE.JS 3D SCENE
   */
  window.initWireTransfer3DScene = function(container, customData) {
    if (!container) return;
    cleanupWireTransfer3DScene();

    const data = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), customData || {});

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    wireScene = new THREE.Scene();
    wireScene.background = new THREE.Color(0x040711);
    wireScene.fog = new THREE.FogExp2(0x040711, 0.0016);

    wireCamera = new THREE.PerspectiveCamera(35, width / height, 1, 3000);
    wireCamera.position.set(0, 15, data.cameraDistance || 440);
    wireCamera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    wireRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    wireRenderer.setSize(width, height);
    wireRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    wireRenderer.shadowMap.enabled = true;
    wireRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    wireRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    wireRenderer.toneMappingExposure = 1.35;

    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.appendChild(wireRenderer.domElement);

    // 3. OrbitControls (Interactive 3D manipulation)
    if (typeof THREE.OrbitControls !== 'undefined') {
      wireControls = new THREE.OrbitControls(wireCamera, wireRenderer.domElement);
      wireControls.enableDamping = true;
      wireControls.dampingFactor = 0.06;
      wireControls.maxDistance = 850;
      wireControls.minDistance = 260;
      wireControls.maxPolarAngle = Math.PI / 1.7;
      wireControls.minPolarAngle = Math.PI / 3.2;
    }

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    wireScene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xdbeafe, 1.4);
    keyLight.position.set(120, 240, 280);
    wireScene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    blueRimLight.position.set(-250, -100, 200);
    wireScene.add(blueRimLight);

    const destSpotLight = new THREE.PointLight(0x22c55e, 1.6, 600);
    destSpotLight.position.set(180, 40, 160);
    wireScene.add(destSpotLight);

    // 5. Tactical Grid Backdrop Plane
    const bgTexture = new THREE.CanvasTexture(generateTacticalBackdropCanvas());
    bgTexture.anisotropy = wireRenderer.capabilities.getMaxAnisotropy ? wireRenderer.capabilities.getMaxAnisotropy() : 1;
    const bgGeo = new THREE.PlaneGeometry(1300, 820);
    const bgMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });
    bgGridMesh = new THREE.Mesh(bgGeo, bgMat);
    bgGridMesh.position.set(0, 0, -200);
    wireScene.add(bgGridMesh);

    // 6. 3D Node Group
    wireGroup = new THREE.Group();
    wireScene.add(wireGroup);

    // Card Dimensions (matching Image 2 aspect ratio)
    const cardWidth = 240;
    const cardHeight = 158;

    // --- NODE 1: ORIGIN CARD (Left, Cayman Islands Branch, angled 18° tilt) ---
    originCardCanvas = document.createElement('canvas');
    originCardCanvas.width = 1024;
    originCardCanvas.height = 680;
    originCardCtx = originCardCanvas.getContext('2d');
    originCardTexture = new THREE.CanvasTexture(originCardCanvas);
    originCardTexture.minFilter = THREE.LinearFilter;
    originCardTexture.magFilter = THREE.LinearFilter;
    if (wireRenderer.capabilities.getMaxAnisotropy) {
      originCardTexture.anisotropy = wireRenderer.capabilities.getMaxAnisotropy();
    }

    const originGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const originMat = new THREE.MeshStandardMaterial({
      map: originCardTexture,
      roughness: 0.28,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    originCardMesh = new THREE.Mesh(originGeo, originMat);
    originCardMesh.position.set(-170, 28, 20);
    // 3D Spatial Tilt: 15° - 25° spatial tilt
    originCardMesh.rotation.y = 0.38; // ~22 degrees
    originCardMesh.rotation.x = 0.10; // ~6 degrees
    wireGroup.add(originCardMesh);

    // --- NODE 2: DESTINATION CARD (Right, Shell Corp Frosted Glass HUD) ---
    destCardCanvas = document.createElement('canvas');
    destCardCanvas.width = 1024;
    destCardCanvas.height = 680;
    destCardCtx = destCardCanvas.getContext('2d');
    destCardTexture = new THREE.CanvasTexture(destCardCanvas);
    destCardTexture.minFilter = THREE.LinearFilter;
    destCardTexture.magFilter = THREE.LinearFilter;
    if (wireRenderer.capabilities.getMaxAnisotropy) {
      destCardTexture.anisotropy = wireRenderer.capabilities.getMaxAnisotropy();
    }

    const destGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const destMat = new THREE.MeshStandardMaterial({
      map: destCardTexture,
      transparent: true,
      roughness: 0.12,
      metalness: 0.25,
      side: THREE.DoubleSide
    });
    destCardMesh = new THREE.Mesh(destGeo, destMat);
    destCardMesh.position.set(170, -18, 50);
    destCardMesh.rotation.y = 0.35; // angled parallel in 3D perspective
    destCardMesh.rotation.x = 0.10;
    wireGroup.add(destCardMesh);

    // Initial texture render
    drawOriginCardTexture(data, 0);
    drawDestCardTexture(data, 0);

    // --- 7. PARTICLE LASER ENERGY BEAM & ENCRYPTED PACKET STREAM ---
    const pCount = data.particleCount || 160;
    const pGeo = new THREE.BufferGeometry();
    beamPositions = new Float32Array(pCount * 3);
    beamVelocities = new Float32Array(pCount);

    const startX = -130;
    const startY = 24;
    const startZ = 20;

    const endX = 135;
    const endY = -14;
    const endZ = 50;

    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      beamPositions[i * 3 + 0] = startX + (endX - startX) * u + (Math.random() - 0.5) * 8;
      beamPositions[i * 3 + 1] = startY + (endY - startY) * u + (Math.random() - 0.5) * 12;
      beamPositions[i * 3 + 2] = startZ + (endZ - startZ) * u + (Math.random() - 0.5) * 10;
      beamVelocities[i] = 0.5 + Math.random() * 0.9;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));

    // Particle Texture (glow circle)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.3, 'rgba(125, 211, 252, 0.95)');
    pGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
    pGrad.addColorStop(1, 'transparent');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 7.5,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    beamParticles = new THREE.Points(pGeo, pMat);
    wireGroup.add(beamParticles);

    // Central Glowing Laser Filament Beam
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(endX, endY, endZ)
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 2.8, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    beamCoreMesh = new THREE.Mesh(tubeGeo, tubeMat);
    wireGroup.add(beamCoreMesh);

    // Specular Shockwave / Impact Pulse Ring at Destination Card
    const ringGeo = new THREE.RingGeometry(8, 36, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    impactRingMesh = new THREE.Mesh(ringGeo, ringMat);
    impactRingMesh.position.set(endX, endY, endZ + 2);
    impactRingMesh.rotation.y = 0.35;
    wireGroup.add(impactRingMesh);

    // 8. Animation & Render Loop
    animClock = 0;
    lastTimestamp = performance.now();

    const animate = () => {
      wireAnimFrame = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock += dt;
      } else {
        animClock = manualT;
      }

      updateWirePhysicsStep(animClock, data);

      if (wireControls) {
        wireControls.update();
      }

      if (wireRenderer && wireScene && wireCamera) {
        wireRenderer.render(wireScene, wireCamera);
      }
    };

    animate();
  };

  /**
   * 5. PHYSICS STEP & FRAME UPDATE
   */
  function updateWirePhysicsStep(t, data) {
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    // Live redraw of origin & destination card textures
    drawOriginCardTexture(d, t);
    drawDestCardTexture(d, t);

    // Move particles along the vector from origin card to destination card
    if (beamParticles && beamPositions) {
      const pCount = beamPositions.length / 3;
      const startX = -130;
      const startY = 24;
      const startZ = 20;

      const endX = 135;
      const endY = -14;
      const endZ = 50;

      const spd = (d.beamSpeed || 1.25) * 320;

      for (let i = 0; i < pCount; i++) {
        // Advance progress
        let px = beamPositions[i * 3 + 0];
        let py = beamPositions[i * 3 + 1];
        let pz = beamPositions[i * 3 + 2];

        const rate = beamVelocities[i] || 1.0;
        px += ((endX - startX) / 265) * spd * rate * 0.016;
        py += ((endY - startY) / 265) * spd * rate * 0.016;
        pz += ((endZ - startZ) / 265) * spd * rate * 0.016;

        // Reset if reached destination
        if (px >= endX) {
          px = startX + (Math.random() - 0.5) * 10;
          py = startY + (Math.random() - 0.5) * 14;
          pz = startZ + (Math.random() - 0.5) * 12;
        }

        beamPositions[i * 3 + 0] = px;
        beamPositions[i * 3 + 1] = py;
        beamPositions[i * 3 + 2] = pz;
      }
      beamParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Laser Core Beam pulsing
    if (beamCoreMesh) {
      const pulse = 0.75 + Math.sin(t * 12) * 0.22;
      beamCoreMesh.material.opacity = pulse;
    }

    // Impact ring ripple
    if (impactRingMesh) {
      const cycle = (t * 1.8) % 1.0;
      impactRingMesh.scale.set(1 + cycle * 2.2, 1 + cycle * 2.2, 1);
      impactRingMesh.material.opacity = Math.max(0, (1 - cycle) * 0.75);
    }

    // Subtle 3D camera pan / drift sweep for depth-of-field
    if (!wireControls && wireCamera) {
      const camDriftX = Math.sin(t * 0.8) * 8;
      const camDriftY = Math.cos(t * 0.6) * 5;
      wireCamera.position.x = camDriftX;
      wireCamera.position.y = 15 + camDriftY;
      wireCamera.lookAt(0, 0, 0);
    }
  }

  function cleanupWireTransfer3DScene() {
    if (wireAnimFrame) {
      cancelAnimationFrame(wireAnimFrame);
      wireAnimFrame = null;
    }
    if (wireControls) {
      wireControls.dispose();
      wireControls = null;
    }
    if (wireRenderer) {
      wireRenderer.dispose();
      if (wireRenderer.domElement && wireRenderer.domElement.parentNode) {
        wireRenderer.domElement.parentNode.removeChild(wireRenderer.domElement);
      }
      wireRenderer = null;
    }
    wireScene = null;
    wireCamera = null;
    wireGroup = null;
    originCardMesh = null;
    originCardCanvas = null;
    originCardCtx = null;
    originCardTexture = null;
    destCardMesh = null;
    destCardCanvas = null;
    destCardCtx = null;
    destCardTexture = null;
    beamParticles = null;
    beamPositions = null;
    beamVelocities = null;
    beamCoreMesh = null;
    impactRingMesh = null;
    bgGridMesh = null;
  }

  window.cleanupWireTransfer3DScene = cleanupWireTransfer3DScene;

  /**
   * Mount into the customizer preview modal stage
   */
  window.tplMountWireTransfer3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #040711; overflow: hidden; cursor: grab; user-select: none;">
        <!-- High-Resolution Instant Plate Background (Guarantees zero black void) -->
        <img id="wire-transfer-plate-bg" src="/wire_transfer_cinematic_plate.png" alt="Wire Transfer Plate" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; transition: opacity 0.5s ease; opacity: 1;" />

        <!-- 3D WebGL Three.js Viewport (Overlaid seamlessly) -->
        <div id="wire-transfer-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>

        <!-- Macro Lens Telemetry & Depth-of-Field HUD Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 8.5px; font-weight: 800; color: #38bdf8; background: rgba(8,14,26,0.85); border: 1px solid rgba(56,189,248,0.4); padding: 3px 8px; border-radius: 5px; backdrop-filter: blur(6px); display: flex; align-items: center; gap: 5px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#38bdf8;box-shadow:0 0 6px #38bdf8;"></span>
            SWIFT // 3D GLASS HUD &bull; f/2.8 BOKEH
          </span>
          <span style="font-family: monospace; font-size: 8px; color: #94a3b8; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">
            DRAG TO ORBIT 3D
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#wire-transfer-3d-viewport');
    const plateImg = stage.querySelector('#wire-transfer-plate-bg');

    setTimeout(() => {
      if (viewport) {
        window.initWireTransfer3DScene(viewport, d);
        if (plateImg) {
          setTimeout(() => { plateImg.style.opacity = '0.0'; }, 100);
        }
      }
    }, 30);
  };

  /**
   * Interactive Contextual Inspector for Wire Transfer
   */
  window.tplBuildWireTransferInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">⚡</span>
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.8px;">SWIFT Wire Transfer Engine</span>
          </div>
          <span style="font-size: 9px; color: #38bdf8; font-weight: 700; background: rgba(56,189,248,0.18); border: 1px solid rgba(56,189,248,0.35); padding: 2px 6px; border-radius: 4px;">3D GLASS HUD</span>
        </div>

        <!-- Section 1: Transfer Amount & Balance -->
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <span style="font-size: 10px; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px; text-transform: uppercase;">
            💰 Transfer Amount & Balance
          </span>
          <div>
            <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">Transfer Amount (USD)</label>
            <input type="number" id="wt-inp-amount" value="${d.transferAmount}" step="10000" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #22c55e; font-weight: 700; padding: 6px 10px; border-radius: 5px; font-size: 12px; font-family: monospace;" />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">Prefix</label>
              <input type="text" id="wt-inp-prefix" value="${d.destPrefix || '+'}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #ef4444; font-weight: 900; padding: 5px 8px; border-radius: 5px; font-size: 11px; text-align: center;" />
            </div>
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">Currency</label>
              <input type="text" id="wt-inp-curr" value="${d.destCurrencySymbol || '$'}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #22c55e; font-weight: 900; padding: 5px 8px; border-radius: 5px; font-size: 11px; text-align: center;" />
            </div>
          </div>
        </div>

        <!-- Section 2: Origin Account (Cayman Islands / Offshore) -->
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <span style="font-size: 10px; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px; text-transform: uppercase;">
            🏦 Origin Node (Offshore Ledger Card)
          </span>
          <div>
            <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">Branch Name</label>
            <input type="text" id="wt-inp-orig-sub" value="${d.originSubtitle}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 5px 8px; border-radius: 5px; font-size: 11px;" />
          </div>
          <div>
            <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">IBAN</label>
            <input type="text" id="wt-inp-orig-iban" value="${d.originIban}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 5px 8px; border-radius: 5px; font-size: 10.5px; font-family: monospace;" />
          </div>
          <div>
            <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">SWIFT Code</label>
            <input type="text" id="wt-inp-orig-swift" value="${d.originSwift}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 5px 8px; border-radius: 5px; font-size: 10.5px; font-family: monospace;" />
          </div>
        </div>

        <!-- Section 3: Destination Account (Shell Corp HUD) -->
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <span style="font-size: 10px; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px; text-transform: uppercase;">
            🎯 Destination Node (Shell Corp HUD)
          </span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">Entity Badge</label>
              <input type="text" id="wt-inp-dest-badge" value="${d.destBadge}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 5px 8px; border-radius: 5px; font-size: 11px;" />
            </div>
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">Account Number</label>
              <input type="text" id="wt-inp-dest-num" value="${d.destAccountNum}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 5px 8px; border-radius: 5px; font-size: 11px; font-family: monospace;" />
            </div>
          </div>
          <div>
            <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px;">Status Alert</label>
            <input type="text" id="wt-inp-status" value="${d.statusAlert}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #94a3b8; padding: 5px 8px; border-radius: 5px; font-size: 11px;" />
          </div>
        </div>

        <!-- Section 4: Particle Laser & Optics -->
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <span style="font-size: 10px; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px; text-transform: uppercase;">
            ⚡ Particle Laser & Optics
          </span>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label style="font-size: 9.5px; color: #94a3b8;">Transfer Beam Velocity</label>
            <input type="range" id="wt-slider-speed" min="0.5" max="3.0" step="0.1" value="${d.beamSpeed}" style="width: 120px;" />
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label style="font-size: 9.5px; color: #94a3b8;">Tactical Matrix Grid</label>
            <input type="checkbox" id="wt-chk-grid" ${d.tacticalGridEnabled ? 'checked' : ''} />
          </div>
        </div>

        <!-- Reset Button -->
        <button type="button" id="btn-wt-reset" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; font-size: 10px; font-weight: 700; padding: 7px; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
          Reset to Reference Defaults
        </button>
      </div>
    `;

    // Wire up listeners
    const update = (patch) => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, patch);
        window.tplUpdateStageWithContextualData(tplId, window.tplGetContextualData(tplId));
      }
    };

    container.querySelector('#wt-inp-amount')?.addEventListener('input', (e) => {
      update({ transferAmount: parseFloat(e.target.value) || 0 });
    });
    container.querySelector('#wt-inp-prefix')?.addEventListener('input', (e) => {
      update({ destPrefix: e.target.value });
    });
    container.querySelector('#wt-inp-curr')?.addEventListener('input', (e) => {
      update({ destCurrencySymbol: e.target.value });
    });
    container.querySelector('#wt-inp-orig-sub')?.addEventListener('input', (e) => {
      update({ originSubtitle: e.target.value });
    });
    container.querySelector('#wt-inp-orig-iban')?.addEventListener('input', (e) => {
      update({ originIban: e.target.value });
    });
    container.querySelector('#wt-inp-orig-swift')?.addEventListener('input', (e) => {
      update({ originSwift: e.target.value });
    });
    container.querySelector('#wt-inp-dest-badge')?.addEventListener('input', (e) => {
      update({ destBadge: e.target.value });
    });
    container.querySelector('#wt-inp-dest-num')?.addEventListener('input', (e) => {
      update({ destAccountNum: e.target.value });
    });
    container.querySelector('#wt-inp-status')?.addEventListener('input', (e) => {
      update({ statusAlert: e.target.value });
    });
    container.querySelector('#wt-slider-speed')?.addEventListener('input', (e) => {
      update({ beamSpeed: parseFloat(e.target.value) });
    });
    container.querySelector('#wt-chk-grid')?.addEventListener('change', (e) => {
      update({ tacticalGridEnabled: e.target.checked });
    });
    container.querySelector('#btn-wt-reset')?.addEventListener('click', () => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  /**
   * Scrubber step sync for timeline / export playback
   */
  window.stepWireTransferAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const viewport = container.querySelector('#wire-transfer-3d-viewport');
    if (!viewport && !wireRenderer) {
      window.initWireTransfer3DScene(container, d);
    }
    updateWirePhysicsStep(t, d);
  };

  /**
   * Canvas Renderer for timeline and video export
   */
  window.renderWireTransferCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    if (wireRenderer && wireRenderer.domElement) {
      updateWirePhysicsStep(t, d);
      if (wireScene && wireCamera) {
        wireRenderer.render(wireScene, wireCamera);
        ctx.drawImage(wireRenderer.domElement, 0, 0, cw, ch);
        return;
      }
    }

    const refImg = textureCache.get('plate_img');
    if (refImg && refImg.complete) {
      ctx.drawImage(refImg, 0, 0, cw, ch);
    } else {
      const img = new Image();
      img.src = '/wire_transfer_cinematic_plate.png';
      img.onload = () => textureCache.set('plate_img', img);
      ctx.fillStyle = '#040711';
      ctx.fillRect(0, 0, cw, ch);
    }
  };

  window.WIRE_TRANSFER_CONFIG = DEFAULT_CONFIG;
  console.log('[Wire Transfer 3D Engine] Initialized 3D Glassmorphic SWIFT Banking Transfer Engine');
})();
