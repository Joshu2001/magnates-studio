/**
 * Photorealistic 3D Fraud Dossier Redaction Engine (True Crime / Doc-Drama Standard)
 * Replicating top-tier investigative aesthetics (James Jani, Magnates Media, Vox)
 *
 * Upgraded Features:
 * 1. Deep Granular Layer & Text Control:
 *    - Full editing of every text layer across the Hero Memo and background artifacts (Investigation, Top Secret, Contract).
 *    - Color pickers for text, warning notes, fluorescent highlighters, rubber stamps, redaction bars, and paper tone.
 * 2. Living 3D Background Motion (Like 3D Newspaper Clipping):
 *    - Continuous floating & breathing motion for layered documents.
 *    - Independent float amplitudes and speed controls.
 * 3. Cinematic Optics & Grading:
 *    - Granular background blur slider (depth of field bokeh control from razor sharp 0px to 8px).
 *    - Paper exposure, brightness, and contrast controls.
 *    - Desk surface and lighting controls.
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'scam-redaction';

  // Default True Crime / Fraud Dossier Configuration
  const DEFAULT_CONFIG = {
    type: 'scam-redaction',
    title: 'INTERNAL MEMO \u00b7 EYES ONLY',
    titleColor: '#3a2418',
    recipient: 'To: Board of Directors',
    recipientColor: '#3a2418',
    senderLabel: 'From:',
    senderRedacted: 'Alexander Vance, CFO',
    senderColor: '#3a2418',
    redactionColor: '#111111',
    showRedaction: true,
    subjectLine1: 'Re: Q3 revenue booked via',
    subjectLine2: 'side letters totaling',
    subjectColor: '#3a2418',
    highlightedAmount: '$8.4 BILLION',
    highlighterColor: '#facc15',
    showHighlighter: true,
    disclosureWarning: 'DO NOT DISCLOSE.',
    warningColor: '#ef4444',
    showWarning: true,
    stampText: 'CONFIDENTIAL',
    stampColor: '#c1121f',
    stampAngle: -14,
    showStamp: true,
    paperTone: '#fbf8ef',
    paperBrightness: 100, // 70% - 150%
    paperContrast: 105,   // 80% - 150%
    backgroundBlur: 1.5,  // 0px - 8px
    floatingMotion: true,
    floatAmplitude: 100,  // 0% - 200%
    floatSpeed: 1.0,      // 0.5x - 2.5x
    // Background documents text
    investigationHeader: 'INVESTIGATION // FILE 904',
    investigationSubject: 'SUBJECT: OFF-BALANCE SHEET LIABILITIES',
    investigationExhibit: 'EXHIBIT D-4: REVENUE COMMINGLING',
    investigationSeal: 'SUBPOENA VERIFIED',
    topSecretHeader: 'TOP SECRET',
    topSecretClassifier: 'LEVEL 4 CLASSIFIED \u00b7 OIG AUDIT',
    contractHeader: 'CONTRACT',
    contractLine1: 'WHEREAS Corporation executed side covenants;',
    contractLine2: 'NOW THEREFORE undisclosed considerations apply;',
    showContractSignature: true,
    // Environment & spatial
    surfaceType: 'mahogany', // 'mahogany', 'blueprint', 'dark_slate'
    showCoordinateGrid: true,
    spotlightIntensity: 2.2,
    volumetricDust: true,
    tiltAngleX: 29, // 25° - 35° spatial pitch
    tiltAngleY: -10, // spatial yaw
    coverageScale: 62, // 55% - 65% of viewport width
    is3DMode: false,
    duration: 5.0
  };

  window.FRAUD_DOSSIER_CONFIG = DEFAULT_CONFIG;

  // Active Inspector Tab State
  let currentInspectorTab = 'content'; // 'content', 'colors', 'motion', 'optics'

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
  let memoFrontMesh = null;
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

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function preloadImage(url) {
    if (typeof Image === 'undefined' || !url || imageAssets.has(url)) return;
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
  function generateGridOverlayTexture(w, h) {
    const key = `grid_${w}_${h}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d');

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;

    const step = 64;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    function drawCrosshair(cx, cy) {
      const len = 12;
      ctx.beginPath();
      ctx.moveTo(cx - len, cy);
      ctx.lineTo(cx + len, cy);
      ctx.moveTo(cx, cy - len);
      ctx.lineTo(cx, cy + len);
      ctx.stroke();
      ctx.strokeRect(cx - 3, cy - 3, 6, 6);
    }
    drawCrosshair(w * 0.18, h * 0.22);
    drawCrosshair(w * 0.82, h * 0.78);
    drawCrosshair(w * 0.5, h * 0.5);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.35);
    ctx.bezierCurveTo(w * 0.3, h * 0.15, w * 0.6, h * 0.5, w, h * 0.3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, h * 0.55);
    ctx.bezierCurveTo(w * 0.35, h * 0.35, w * 0.65, h * 0.7, w, h * 0.5);
    ctx.stroke();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('LAT // 40°42\'51"N  LON // 74°00\'23"W', 24, 28);
    ctx.fillText('SEC // 04  GRID 8842-X', w - 170, 28);

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Layer 1: Aged Manila "INVESTIGATION" Dossier Texture
   */
  function generateInvestigationTexture(data) {
    const d = data || DEFAULT_CONFIG;
    const header = d.investigationHeader || 'INVESTIGATION // FILE 904';
    const subj = d.investigationSubject || 'SUBJECT: OFF-BALANCE SHEET LIABILITIES';
    const exh = d.investigationExhibit || 'EXHIBIT D-4: REVENUE COMMINGLING';
    const seal = d.investigationSeal || 'SUBPOENA VERIFIED';

    const key = `invest_${header}_${subj}_${exh}_${seal}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 1365; // 8.5 x 11 aspect
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    ctx.fillStyle = '#eedcb3';
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, w * 0.75);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    grad.addColorStop(1, 'rgba(120, 80, 40, 0.28)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#eed5a0';
    ctx.fillRect(w - 220, 0, 220, 90);
    ctx.fillStyle = '#5c3a21';
    ctx.font = '900 28px "JetBrains Mono", monospace';
    ctx.fillText('FILE 904', w - 180, 55);

    ctx.save();
    ctx.translate(140, 240);
    ctx.rotate(-4 * Math.PI / 180);
    ctx.strokeStyle = '#8b261b';
    ctx.lineWidth = 6;
    ctx.strokeRect(-20, -45, 620, 75);
    ctx.fillStyle = '#8b261b';
    ctx.font = '900 36px "Georgia", serif';
    ctx.fillText(header, 0, 5);
    ctx.restore();

    ctx.fillStyle = '#3a2e22';
    ctx.font = '600 24px "Courier New", monospace';
    ctx.fillText(subj, 80, 390);
    ctx.fillText('STATUS: SUBPOENA ADMISSIBLE · SEC REGULATORY ENFORCEMENT', 80, 435);
    ctx.fillText(exh, 80, 480);
    ctx.fillText('• 14 UNDISCLOSED SIDE AGREEMENTS EXECUTED BY OFFICERS', 80, 525);
    ctx.fillText('• RESTRICTED REVENUE BOOKED PRIOR TO FISCAL CLOSE', 80, 570);

    ctx.strokeStyle = 'rgba(60, 40, 20, 0.4)';
    ctx.lineWidth = 2;
    for (let y = 640; y < 1180; y += 42) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(w - 80, y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(w - 240, h - 180);
    ctx.rotate(-8 * Math.PI / 180);
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 4;
    ctx.strokeRect(-10, -35, 230, 60);
    ctx.fillStyle = '#991b1b';
    ctx.font = '900 22px "JetBrains Mono", monospace';
    ctx.fillText(seal, 8, 2);
    ctx.restore();

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Layer 2: Weathered "TOP SECRET" Slip Texture
   */
  function generateTopSecretTexture(data) {
    const d = data || DEFAULT_CONFIG;
    const header = d.topSecretHeader || 'TOP SECRET';
    const classifier = d.topSecretClassifier || 'LEVEL 4 CLASSIFIED · OIG AUDIT';

    const key = `secret_${header}_${classifier}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 768;
    cv.height = 960;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    ctx.fillStyle = '#f4ecd8';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 8;
    ctx.strokeRect(60, 60, w - 120, 100);
    ctx.fillStyle = '#b91c1c';
    ctx.font = '900 48px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(header, w * 0.5, 128);
    ctx.restore();

    ctx.fillStyle = '#3a2e22';
    ctx.font = '600 20px "Courier New", monospace';
    ctx.fillText(classifier, 60, 220);
    ctx.fillText('DISCLOSURE SUBJECT TO TITLE 18 US CODE PENALTY', 60, 255);

    ctx.fillStyle = '#111';
    ctx.fillRect(60, 310, w - 120, 26);
    ctx.fillRect(60, 370, w * 0.72, 26);
    ctx.fillRect(60, 430, w * 0.85, 26);
    ctx.fillRect(60, 490, w * 0.55, 26);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(w - 140, h - 140, 60, 0, Math.PI * 2);
    ctx.stroke();

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Layer 3: Legal "CONTRACT" Page with Signature Texture
   */
  function generateContractTexture(data) {
    const d = data || DEFAULT_CONFIG;
    const header = d.contractHeader || 'CONTRACT';
    const line1 = d.contractLine1 || 'WHEREAS Corporation executed side covenants;';
    const line2 = d.contractLine2 || 'NOW THEREFORE undisclosed considerations apply;';

    const key = `contract_${header}_${line1}_${line2}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 1365;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    ctx.fillStyle = '#f7f4ea';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.font = '900 44px "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText(header, w * 0.5, 140);

    ctx.textAlign = 'left';
    ctx.letterSpacing = 'normal';
    ctx.font = '22px "Georgia", serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(line1, 90, 240);
    ctx.fillText(line2, 90, 285);
    ctx.fillText('AND WHEREIN all collateral indemnifications remain in force.', 90, 330);

    ctx.fillStyle = '#111';
    ctx.fillRect(90, 400, w - 180, 24);
    ctx.fillRect(90, 450, w * 0.65, 24);
    ctx.fillRect(90, 500, w * 0.82, 24);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    for (let y = 580; y < 1050; y += 45) {
      ctx.beginPath();
      ctx.moveTo(90, y);
      ctx.lineTo(w - 90, y);
      ctx.stroke();
    }

    if (d.showContractSignature !== false) {
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(120, 1160);
      ctx.bezierCurveTo(180, 1100, 240, 1220, 320, 1140);
      ctx.bezierCurveTo(390, 1120, 450, 1210, 520, 1130);
      ctx.stroke();

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 1200);
      ctx.lineTo(540, 1200);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText('AUTHORIZED SIGNATURE / ESQ.', 100, 1230);
    }

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Layer 4: Foreground Hero "INTERNAL MEMO" Texture with dynamic animation states
   */
  function generateMemoTexture(data, t) {
    const d = data || DEFAULT_CONFIG;
    const dur = Math.max(1, d.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t !== undefined ? t : (dur * 0.9)));
    const frameIndex = Math.round(ct * 24);

    const key = `memo_${frameIndex}_${d.title}_${d.highlightedAmount}_${d.stampText}_${d.paperTone}_${d.highlighterColor}_${d.stampColor}_${d.warningColor}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 1152; // 4:3 memo aspect ratio
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Off-white Cotton Paper Base Tone
    ctx.fillStyle = d.paperTone || '#fbf8ef';
    ctx.fillRect(0, 0, w, h);

    const paperGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, w * 0.72);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    paperGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    paperGrad.addColorStop(1, 'rgba(140, 100, 50, 0.14)');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // Deckle edge stroke
    ctx.strokeStyle = 'rgba(60, 40, 20, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    const marginX = 140;
    let currentY = 175;

    // Title
    ctx.fillStyle = d.titleColor || '#3a2418';
    ctx.font = '900 44px "JetBrains Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '5px';
    ctx.fillText(d.title || 'INTERNAL MEMO · EYES ONLY', w * 0.5, currentY);

    // Divider
    currentY += 40;
    ctx.strokeStyle = 'rgba(58, 36, 24, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(marginX, currentY);
    ctx.lineTo(w - marginX, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Recipient
    currentY += 75;
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0px';
    ctx.fillStyle = d.recipientColor || '#3a2418';
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillText(d.recipient || 'To: Board of Directors', marginX, currentY);

    // Sender line
    currentY += 80;
    ctx.fillStyle = d.senderColor || '#3a2418';
    ctx.fillText(d.senderLabel || 'From:', marginX, currentY);

    // Sender Redaction Bar (slams at 0.8s)
    const senderText = d.senderRedacted || 'Alexander Vance, CFO';
    const barX = marginX + 130;
    const barY = currentY - 32;
    const barWidth = 420;
    const barHeight = 42;

    if (d.showRedaction !== false) {
      if (ct < 0.8) {
        ctx.fillStyle = 'rgba(58, 36, 24, 0.65)';
        ctx.font = '600 34px "JetBrains Mono", monospace';
        ctx.fillText(senderText, barX, currentY);
      } else {
        const slamProgress = Math.min(1, Math.max(0, (ct - 0.8) / 0.3));
        const currentBarW = barWidth * slamProgress;
        ctx.fillStyle = d.redactionColor || '#111111';
        ctx.fillRect(barX, barY, currentBarW, barHeight);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(barX, barY + barHeight, currentBarW, 6);
      }
    } else {
      ctx.fillStyle = d.senderColor || '#3a2418';
      ctx.font = '600 34px "JetBrains Mono", monospace';
      ctx.fillText(senderText, barX, currentY);
    }

    // Subjects
    currentY += 85;
    ctx.fillStyle = d.subjectColor || '#3a2418';
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillText(d.subjectLine1 || 'Re: Q3 revenue booked via', marginX, currentY);

    currentY += 60;
    ctx.fillText(d.subjectLine2 || 'side letters totaling', marginX, currentY);

    // Fluorescent Highlighter Sweep (sweeps at 1.6s)
    currentY += 85;
    const amtText = d.highlightedAmount || '$8.4 BILLION';
    ctx.font = '900 48px "JetBrains Mono", monospace';
    const amtMetrics = ctx.measureText(amtText);
    const hlX = marginX;
    const hlY = currentY - 42;
    const hlW = amtMetrics.width + 36;
    const hlH = 56;

    if (d.showHighlighter !== false) {
      if (ct >= 1.6) {
        const hlProgress = Math.min(1, Math.max(0, (ct - 1.6) / 0.45));
        const curHlW = hlW * hlProgress;
        ctx.save();
        ctx.fillStyle = d.highlighterColor ? d.highlighterColor : '#facc15';
        ctx.globalAlpha = 0.85;
        ctx.fillRect(hlX, hlY, curHlW, hlH);
        ctx.restore();
      }
    }

    ctx.fillStyle = '#0f172a';
    ctx.fillText(amtText, hlX + 18, currentY);

    // Warning
    currentY += 95;
    if (d.showWarning !== false) {
      ctx.fillStyle = d.warningColor || '#ef4444';
      ctx.font = '900 38px "JetBrains Mono", monospace';
      ctx.fillText(d.disclosureWarning || 'DO NOT DISCLOSE.', marginX, currentY);
    }

    // Confidential Rubber Stamp (slams at 2.3s)
    if (d.showStamp !== false && ct >= 2.3) {
      const stampProgress = Math.min(1, Math.max(0, (ct - 2.3) / 0.35));
      const scale = 1.0 + (1.0 - stampProgress) * 0.4;
      const alpha = Math.min(1, stampProgress * 1.4);

      ctx.save();
      ctx.translate(w - 380, h - 220);
      const angle = (d.stampAngle !== undefined ? d.stampAngle : -14) * Math.PI / 180;
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      const stCol = d.stampColor || '#c1121f';
      ctx.strokeStyle = stCol;
      ctx.lineWidth = 12;
      ctx.strokeRect(-180, -65, 360, 110);
      ctx.lineWidth = 3;
      ctx.strokeRect(-168, -55, 336, 90);

      ctx.fillStyle = stCol;
      ctx.font = '900 42px "JetBrains Mono", "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText(d.stampText || 'CONFIDENTIAL', 0, 8);
      ctx.restore();
    }

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Builds the Paper Artifact Stack in 3D WebGL (Three.js)
   */
  function buildPaperArtifactStack(data, t) {
    if (!fdGroup) fdGroup = new THREE.Group();

    // 1. Layer 1 (Bottom Left): Investigation Dossier
    const investGeo = new THREE.PlaneGeometry(165, 220);
    const investCv = generateInvestigationTexture(data);
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

    // 2. Layer 2 (Top Left): Top Secret Slip
    const secretGeo = new THREE.PlaneGeometry(125, 155);
    const secretCv = generateTopSecretTexture(data);
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

    // 3. Layer 3 (Right): Legal Contract Page
    const contractGeo = new THREE.PlaneGeometry(160, 215);
    const contractCv = generateContractTexture(data);
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

    // 4. Layer 4 (Center Foreground Hero): Internal Memo
    const memoWidth = 168;
    const memoHeight = 126;
    const memoThickness = 0.8;

    const memoCv = generateMemoTexture(data, t);
    const memoTex = new THREE.CanvasTexture(memoCv);
    memoTex.anisotropy = 8;

    const memoGroup = new THREE.Group();

    const frontGeo = new THREE.PlaneGeometry(memoWidth, memoHeight);
    const frontMat = new THREE.MeshStandardMaterial({
      map: memoTex,
      roughness: 0.78,
      metalness: 0.02
    });
    memoFrontMesh = new THREE.Mesh(frontGeo, frontMat);
    memoFrontMesh.rotation.x = -Math.PI / 2;
    memoFrontMesh.position.y = memoThickness * 0.5 + 0.05;
    memoFrontMesh.castShadow = true;
    memoFrontMesh.receiveShadow = true;
    memoGroup.add(memoFrontMesh);

    const slabGeo = new THREE.BoxGeometry(memoWidth, memoThickness, memoHeight);
    const slabMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(data.paperTone || '#fbf8ef'),
      roughness: 0.85,
      metalness: 0.01
    });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.castShadow = true;
    slabMesh.receiveShadow = true;
    memoGroup.add(slabMesh);

    memoMesh = memoGroup;
    memoMesh.position.set(0, 1.8, 8);
    memoMesh.rotation.y = THREE.MathUtils.degToRad(-3);
    fdGroup.add(memoMesh);

    const pitch = data.tiltAngleX !== undefined ? data.tiltAngleX : 29;
    const yaw = data.tiltAngleY !== undefined ? data.tiltAngleY : -10;
    fdGroup.rotation.x = THREE.MathUtils.degToRad(pitch);
    fdGroup.rotation.y = THREE.MathUtils.degToRad(yaw);
    fdGroup.rotation.z = THREE.MathUtils.degToRad(3.2);
    fdGroup.position.set(6, 6, 4);

    fdScene.add(fdGroup);
  }

  /**
   * Initializes the Three.js Viewport
   */
  window.initFraudDossier3DScene = function(container, data) {
    if (!container) return;
    cleanupFraudDossier3DScene();

    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const w = container.clientWidth || 960;
    const h = container.clientHeight || 540;

    fdScene = new THREE.Scene();
    fdScene.background = new THREE.Color('#06090e');

    fdCamera = new THREE.PerspectiveCamera(34, w / h, 5, 2000);
    fdCamera.position.set(8, 175, 220);
    fdCamera.lookAt(8, 6, 4);

    fdRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    fdRenderer.setSize(w, h);
    fdRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    fdRenderer.shadowMap.enabled = true;
    fdRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(fdRenderer.domElement);

    if (typeof THREE.OrbitControls === 'function') {
      fdControls = new THREE.OrbitControls(fdCamera, fdRenderer.domElement);
      fdControls.enableDamping = true;
      fdControls.dampingFactor = 0.06;
      fdControls.target.set(8, 6, 4);
      fdControls.minDistance = 80;
      fdControls.maxDistance = 600;
      fdControls.maxPolarAngle = Math.PI / 2 - 0.05;
    }

    // Lighting
    ambientLight = new THREE.AmbientLight(0xfff3db, 0.45);
    fdScene.add(ambientLight);

    const spotInt = d.spotlightIntensity !== undefined ? d.spotlightIntensity : 2.2;
    keySpotLight = new THREE.SpotLight(0xfff5e1, spotInt);
    keySpotLight.position.set(30, 280, 70);
    keySpotLight.angle = 0.58;
    keySpotLight.penumbra = 0.65;
    keySpotLight.decay = 1.3;
    keySpotLight.castShadow = true;
    keySpotLight.shadow.mapSize.width = 2048;
    keySpotLight.shadow.mapSize.height = 2048;
    keySpotLight.shadow.camera.near = 40;
    keySpotLight.shadow.camera.far = 400;
    keySpotLight.shadow.bias = -0.0005;
    fdScene.add(keySpotLight);

    rimLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    rimLight.position.set(-150, 80, -100);
    fdScene.add(rimLight);

    // Build stack
    buildPaperArtifactStack(d, 0);

    animClock = 0;
    lastTimestamp = performance.now();

    function renderLoop(now) {
      if (!fdRenderer) return;
      const delta = Math.min(0.1, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock = (animClock + delta) % (d.duration || 5.0);
        updateAnimationStep(animClock, d);
      }

      if (fdControls) fdControls.update();
      if (fdRenderer && fdScene && fdCamera) {
        fdRenderer.render(fdScene, fdCamera);
      }
      fdAnimFrame = requestAnimationFrame(renderLoop);
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

    const cv = generateMemoTexture(data, ct);
    if (memoFrontMesh && memoFrontMesh.material && memoFrontMesh.material.map) {
      const tex = memoFrontMesh.material.map;
      if (tex.image !== cv) {
        tex.image = cv;
        tex.needsUpdate = true;
      }
    }

    // Subtle 3D floating sensation in WebGL mode too
    if (data.floatingMotion !== false && (data.floatAmplitude === undefined || data.floatAmplitude > 0)) {
      const amp = (data.floatAmplitude !== undefined ? data.floatAmplitude : 100) / 100;
      const spd = Math.max(0.2, data.floatSpeed || 1.0);
      if (investMesh) {
        investMesh.position.y = -0.6 + Math.sin(ct * 1.05 * spd) * 1.8 * amp;
        investMesh.rotation.z = THREE.MathUtils.degToRad(-16 + Math.cos(ct * 0.9 * spd) * 1.5 * amp);
      }
      if (topSecretMesh) {
        topSecretMesh.position.y = 0.4 + Math.sin(ct * 0.85 * spd + 1.2) * 1.5 * amp;
        topSecretMesh.rotation.z = THREE.MathUtils.degToRad(-9 + Math.sin(ct * 0.7 * spd + 0.5) * 1.2 * amp);
      }
      if (contractMesh) {
        contractMesh.position.y = 0.1 + Math.sin(ct * 1.15 * spd + 2.1) * 2.0 * amp;
        contractMesh.rotation.z = THREE.MathUtils.degToRad(14 + Math.cos(ct * 0.8 * spd + 1.0) * 1.4 * amp);
      }
      if (memoMesh) {
        memoMesh.position.y = 1.8 + Math.sin(ct * 0.75 * spd + 0.8) * 0.8 * amp;
      }
    }

    if (!fdControls || !fdControls.state || fdControls.state === -1) {
      const panProgress = ct / dur;
      if (fdCamera) {
        const startY = 175;
        const endY = 160;
        const startZ = 220;
        const endZ = 205;
        fdCamera.position.y = startY + (endY - startY) * panProgress;
        fdCamera.position.z = startZ + (endZ - startZ) * panProgress;
        fdCamera.lookAt(8, 6 - panProgress * 3, 4 - panProgress * 2);
      }
    }
  }

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
    memoFrontMesh = null;
    deskMesh = null;
    gridMesh = null;
    investMesh = null;
    topSecretMesh = null;
    contractMesh = null;
    contactShadowMesh = null;
    dustParticleGroup = null;
  }

  /**
   * Mounts the HTML/CSS 3D Fraud Dossier Stage inside the Customizer Modal (1:1 match with hover)
   */
  window.tplMountFraudDossierVideoStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});
    cleanupFraudDossier3DScene();

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #06090e; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <div id="fx-container-scam-redaction" style="position: absolute; inset: 0; width: 100%; height: 100%;">
          ${window.tplBuildFraudDossierHtml(d)}
        </div>
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #ef4444; background: rgba(10,12,18,0.92); border: 1px solid rgba(239,68,68,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            FRAUD DOSSIER &bull; EYES ONLY &bull; REDACTION BAR &bull; CONFIDENTIAL STAMP
          </span>
          <span style="font-family: monospace; font-size: 9px; color: #94a3b8; background: rgba(10,12,18,0.75); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 4px;">
            VIDEO PREVIEW
          </span>
        </div>
      </div>
    `;
  };

  /**
   * Mounts the 3D Fraud Dossier Stage inside the Customizer Modal
   */
  window.tplMountFraudDossier3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    if (typeof topCustomizerState !== 'undefined' && topCustomizerState.paperPreviewMode === 'video' && !d.is3DMode) {
      window.tplMountFraudDossierVideoStage(stage, d);
      return;
    }

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #06090e; overflow: hidden; cursor: grab; user-select: none;">
        <img id="fraud-dossier-plate-bg" src="/mahogany_desk_texture.jpg" alt="Mahogany Desk" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.35; filter: contrast(125%) brightness(70%);" />
        <div id="fraud-dossier-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>
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
      if (typeof window.initFraudDossier3DScene === 'function' && viewport) {
        window.initFraudDossier3DScene(viewport, d);
      }
    }
    triggerInit();
    setTimeout(triggerInit, 60);
  };

  /**
   * HTML/CSS dynamic stepping for timeline scrubbing & live playback
   */
  function stepFraudDossierHtml(root, t, data) {
    if (!root) return;
    const bar = root.querySelector('.rd-bar');
    const hl = root.querySelector('.rd-hl');
    const stamp = root.querySelector('.rd-stamp');

    if (bar && data.showRedaction !== false) {
      if (t < 0.8) {
        bar.style.transform = 'scaleX(0)';
        bar.style.opacity = '0';
        bar.style.animation = 'none';
      } else if (t >= 0.8 && t < 1.1) {
        const prog = (t - 0.8) / 0.3;
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, prog * 1.05))})`;
        bar.style.opacity = '1';
        bar.style.animation = 'none';
      } else {
        bar.style.transform = 'scaleX(1)';
        bar.style.opacity = '1';
        bar.style.animation = 'none';
      }
    }

    if (hl && data.showHighlighter !== false) {
      if (t < 1.6) {
        hl.style.background = 'transparent';
        hl.style.animation = 'none';
      } else {
        hl.style.background = data.highlighterColor ? `${data.highlighterColor}d9` : 'rgba(250, 204, 21, 0.85)';
        hl.style.mixBlendMode = 'multiply';
        hl.style.animation = 'none';
      }
    }

    if (stamp && data.showStamp !== false) {
      const targetAngle = data.stampAngle !== undefined ? data.stampAngle : -14;
      if (t < 2.3) {
        stamp.style.opacity = '0';
        stamp.style.transform = `rotate(${targetAngle}deg) scale(1.4)`;
        stamp.style.animation = 'none';
      } else if (t >= 2.3 && t < 2.7) {
        const prog = (t - 2.3) / 0.4;
        stamp.style.opacity = `${Math.min(1, prog * 1.5)}`;
        stamp.style.transform = `rotate(${targetAngle}deg) scale(${1.4 - prog * 0.4})`;
        stamp.style.animation = 'none';
      } else {
        stamp.style.opacity = '1';
        stamp.style.transform = `rotate(${targetAngle}deg) scale(1)`;
        stamp.style.animation = 'none';
      }
    }
  }

  /**
   * Triggers or resets the CSS 3D animation loop
   */
  window.tplTriggerFraudDossierAnimation = function(stage) {
    if (!stage) stage = document.getElementById('tpl-modal-preview-stage');
    if (!stage) return;
    const wrap = stage.querySelector('#fx-container-scam-redaction') || stage.querySelector('#customizer-stage-inner') || stage;
    const root = stage.querySelector('.fd-scene-root');
    if (root && wrap) {
      const fdData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(TEMPLATE_ID) : {};
      wrap.innerHTML = window.tplBuildFraudDossierHtml(fdData);
    }
  };

  /**
   * Stepper callback for hover preview loop & live customizer playback
   */
  window.stepFraudDossierAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    const viewport = container.querySelector('#fraud-dossier-3d-viewport');
    if (viewport) {
      if (!fdRenderer) {
        window.initFraudDossier3DScene(viewport, d);
      }
      updateAnimationStep(t, d);
      return;
    }

    const root = container.querySelector('.fd-scene-root');
    if (root) {
      stepFraudDossierHtml(root, t, d);
    }
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
    const deskImg = imageAssets.get('/mahogany_desk_texture.jpg');
    if (deskImg && deskImg.complete) {
      ctx.drawImage(deskImg, 0, 0, cw, ch);
    } else {
      ctx.fillStyle = '#160c08';
      ctx.fillRect(0, 0, cw, ch);
    }

    const gridCv = generateGridOverlayTexture(cw, ch);
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(gridCv, 0, 0, cw, ch);
    ctx.restore();

    const spotGrad = ctx.createRadialGradient(cw * 0.52, ch * 0.48, cw * 0.08, cw * 0.52, ch * 0.48, cw * 0.65);
    spotGrad.addColorStop(0, 'rgba(255, 245, 220, 0.22)');
    spotGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.2)');
    spotGrad.addColorStop(1, 'rgba(4, 7, 12, 0.92)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, cw, ch);

    const investCv = generateInvestigationTexture(d);
    ctx.save();
    ctx.translate(cw * 0.36, ch * 0.46);
    ctx.rotate(-16 * Math.PI / 180);
    ctx.transform(1, -0.05, 0.18, 0.9, 0, 0);
    ctx.filter = `blur(${d.backgroundBlur !== undefined ? d.backgroundBlur : 1.8}px)`;
    const invW = cw * 0.36;
    const invH = invW * (1365 / 1024);
    ctx.drawImage(investCv, -invW * 0.5, -invH * 0.5, invW, invH);
    ctx.restore();

    const contractCv = generateContractTexture(d);
    ctx.save();
    ctx.translate(cw * 0.65, ch * 0.48);
    ctx.rotate(14 * Math.PI / 180);
    ctx.transform(1, -0.05, 0.18, 0.9, 0, 0);
    ctx.filter = `blur(${d.backgroundBlur !== undefined ? (d.backgroundBlur * 0.8).toFixed(1) : 1.5}px)`;
    const conW = cw * 0.35;
    const conH = conW * (1365 / 1024);
    ctx.drawImage(contractCv, -conW * 0.5, -conH * 0.5, conW, conH);
    ctx.restore();

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
   * Generates Rich 3D CSS Markup with Living Floating Motion and Granular Controls
   */
  window.tplBuildFraudDossierHtml = function(data) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    // Desk surface
    let deskBg = "url('/mahogany_desk_texture.jpg') center/cover no-repeat";
    if (d.surfaceType === 'blueprint') {
      deskBg = 'radial-gradient(circle at 50% 50%, #0d253f 0%, #061220 100%)';
    } else if (d.surfaceType === 'dark_slate') {
      deskBg = 'radial-gradient(circle at 50% 50%, #1e2530 0%, #080a0f 100%)';
    }

    const gridDisplay = d.showCoordinateGrid !== false ? 'block' : 'none';
    const dustDisplay = d.volumetricDust !== false ? 'block' : 'none';
    const spotIntensity = d.spotlightIntensity !== undefined ? d.spotlightIntensity : 2.2;
    const spotOpacity = Math.min(1, Math.max(0.1, (spotIntensity / 2.2) * 0.95));

    const pitch = d.tiltAngleX !== undefined ? d.tiltAngleX : 29;
    const scale = d.coverageScale !== undefined ? d.coverageScale : 62;
    const maxW = Math.round(275 * (scale / 58));

    // Optical blur on background layers
    const bgBlur = d.backgroundBlur !== undefined ? d.backgroundBlur : 1.5;
    const invBlurStyle = `blur(${bgBlur}px) contrast(110%)`;
    const secBlurStyle = `blur(${Math.max(0, bgBlur * 0.55).toFixed(1)}px)`;
    const conBlurStyle = `blur(${Math.max(0, bgBlur * 0.8).toFixed(1)}px)`;

    // Living floating motion (like 3D newspaper clipping)
    const isFloating = d.floatingMotion !== false && (d.floatAmplitude === undefined || d.floatAmplitude > 0);
    const spd = Math.max(0.2, d.floatSpeed || 1.0);

    const invAnimStyle = isFloating ? `animation: fdInvestFloat ${(6.0 / spd).toFixed(2)}s ease-in-out infinite alternate;` : 'animation: none;';
    const secAnimStyle = isFloating ? `animation: fdSecretFloat ${(7.2 / spd).toFixed(2)}s ease-in-out infinite alternate 0.6s;` : 'animation: none;';
    const conAnimStyle = isFloating ? `animation: fdContractFloat ${(6.5 / spd).toFixed(2)}s ease-in-out infinite alternate 1.2s;` : 'animation: none;';
    const heroAnimStyle = isFloating ? `animation: fdHeroBreath ${(8.0 / spd).toFixed(2)}s ease-in-out infinite alternate;` : '';

    const showBar = d.showRedaction !== false;
    const showStamp = d.showStamp !== false;
    const showHl = d.showHighlighter !== false;
    const showWarn = d.showWarning !== false;

    // Escaped content
    const safeTitle = escapeHtml(d.title || 'INTERNAL MEMO · EYES ONLY');
    const safeRecipient = escapeHtml(d.recipient || 'To: Board of Directors');
    const safeSenderLabel = escapeHtml(d.senderLabel || 'From:');
    const safeSubject1 = escapeHtml(d.subjectLine1 || 'Re: Q3 revenue booked via');
    const safeSubject2 = escapeHtml(d.subjectLine2 || 'side letters totaling');
    const safeAmount = escapeHtml(d.highlightedAmount || '$8.4 BILLION');
    const safeWarning = escapeHtml(d.disclosureWarning || 'DO NOT DISCLOSE.');
    const safeStamp = escapeHtml(d.stampText || 'CONFIDENTIAL');

    const safeInvHeader = escapeHtml(d.investigationHeader || 'INVESTIGATION // FILE 904');
    const safeInvSubject = escapeHtml(d.investigationSubject || 'SUBJECT: OFF-BALANCE SHEET LIABILITIES');
    const safeInvExhibit = escapeHtml(d.investigationExhibit || 'EXHIBIT D-4: REVENUE COMMINGLING');
    const safeInvSeal = escapeHtml(d.investigationSeal || 'SUBPOENA VERIFIED');

    const safeSecHeader = escapeHtml(d.topSecretHeader || 'TOP SECRET');
    const safeSecClass = escapeHtml(d.topSecretClassifier || 'LEVEL 4 CLASSIFIED · OIG AUDIT');

    const safeConHeader = escapeHtml(d.contractHeader || 'CONTRACT');
    const safeConLine1 = escapeHtml(d.contractLine1 || 'WHEREAS Corporation executed side covenants;');
    const safeConLine2 = escapeHtml(d.contractLine2 || 'NOW THEREFORE undisclosed considerations apply;');

    const stampAngle = d.stampAngle !== undefined ? d.stampAngle : -14;

    return `
      <div class="fd-scene-root">
        <!-- 1. Dark Mahogany Desk Surface -->
        <div class="fd-desk-surface" style="background: ${deskBg};"></div>

        <!-- 2. Investigative Topographic Coordinate Lines & Crosshairs -->
        <div class="fd-grid-overlay" style="display: ${gridDisplay};">
          <div class="fd-hud-coord fd-hud-tl">LAT // 40°42'51"N &bull; LON // 74°00'23"W</div>
          <div class="fd-hud-coord fd-hud-tr">GRID REF 8842-X &bull; SECTOR 04</div>
          <svg class="fd-grid-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <pattern id="fd-fine-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.09)" stroke-width="0.8" />
                <circle cx="50" cy="50" r="1.5" fill="rgba(56, 189, 248, 0.18)" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#fd-fine-grid)" />
            <g stroke="rgba(56, 189, 248, 0.28)" stroke-width="1.2">
              <line x1="160" y1="120" x2="180" y2="120" /><line x1="170" y1="110" x2="170" y2="130" />
              <line x1="820" y1="460" x2="840" y2="460" /><line x1="830" y1="450" x2="830" y2="470" />
            </g>
            <path d="M -20 180 Q 250 80, 520 200 T 1020 160" fill="none" stroke="rgba(56, 189, 248, 0.12)" stroke-width="1.2" />
            <path d="M -20 280 Q 220 180, 500 300 T 1020 260" fill="none" stroke="rgba(56, 189, 248, 0.10)" stroke-width="1.0" />
          </svg>
        </div>

        <!-- 3. Focused Overhead Key Spotlight with Rich Vignette -->
        <div class="fd-key-spotlight" style="opacity: ${spotOpacity};"></div>

        <!-- 4. Volumetric Dust Motes -->
        <div class="fd-dust-layer" style="display: ${dustDisplay};">
          <div class="fd-mote fd-m1"></div>
          <div class="fd-mote fd-m2"></div>
          <div class="fd-mote fd-m3"></div>
          <div class="fd-mote fd-m4"></div>
          <div class="fd-mote fd-m5"></div>
        </div>

        <!-- 5. 3D Spatial Rig (25°–35° pitch tilt, 55%–65% viewport coverage) -->
        <div class="fd-stage-3d">
          <!-- Layer 1: Left Manila "INVESTIGATION" Dossier (f/2.8 DOF blur) -->
          <div class="fd-paper-layer fd-layer-investigation" style="filter: ${invBlurStyle}; ${invAnimStyle}">
            <div class="fd-invest-stamp">${safeInvHeader}</div>
            <div class="fd-invest-line">${safeInvSubject}</div>
            <div class="fd-invest-line">STATUS: SUBPOENA ADMISSIBLE</div>
            <div class="fd-invest-line">${safeInvExhibit}</div>
            <div class="fd-invest-line">&bull; SIDE LETTERS CONCEALED FROM AUDIT</div>
            <div class="fd-invest-seal">${safeInvSeal}</div>
          </div>

          <!-- Layer 2: Top-Left "TOP SECRET" Slip -->
          <div class="fd-paper-layer fd-layer-topsecret" style="filter: ${secBlurStyle}; ${secAnimStyle}">
            <div class="fd-stamp-topsecret">${safeSecHeader}</div>
            <div class="fd-secret-text">${safeSecClass}</div>
            <div class="fd-secret-bar"></div>
            <div class="fd-secret-bar" style="width: 75%;"></div>
          </div>

          <!-- Layer 3: Right "CONTRACT" Page with Signature (f/2.8 DOF blur) -->
          <div class="fd-paper-layer fd-layer-contract" style="filter: ${conBlurStyle}; ${conAnimStyle}">
            <div class="fd-contract-head">${safeConHeader}</div>
            <div class="fd-contract-line">${safeConLine1}</div>
            <div class="fd-contract-line">${safeConLine2}</div>
            <div class="fd-contract-bar"></div>
            <div class="fd-contract-bar" style="width: 60%;"></div>
            ${d.showContractSignature !== false ? `
            <div class="fd-contract-sig-wrap">
              <span class="fd-contract-sig-lbl">Signature</span>
              <svg class="fd-contract-sig" viewBox="0 0 160 40">
                <path d="M 6 24 C 28 4, 46 32, 70 18 S 112 28, 134 10 L 152 20" />
              </svg>
            </div>` : ''}
          </div>

          <!-- Layer 4: Center Foreground Hero Memo Artifact (Sharp Focus) -->
          <div class="fd-paper-layer fd-layer-hero" style="--hero-pitch: ${pitch}deg; transform: rotateX(${pitch}deg) rotateY(-10deg) rotateZ(3.2deg); width: ${scale}%; max-width: ${maxW}px; background: ${d.paperTone || '#fbf8ef'}; filter: contrast(${d.paperContrast || 105}%) brightness(${d.paperBrightness || 100}%); ${heroAnimStyle}">
            <div class="fd-hero-paper-grain"></div>
            <div class="rd-head" style="color: ${d.titleColor || '#3a2418'};">${safeTitle}</div>
            <div class="rd-divider"></div>
            <div class="rd-line" style="color: ${d.recipientColor || '#3a2418'};">${safeRecipient}</div>
            <div class="rd-line rd-from">
              <span style="color: ${d.senderColor || '#3a2418'};">${safeSenderLabel}</span>
              ${showBar ? `<span class="rd-bar" style="background: ${d.redactionColor || '#111111'};"></span>` : ''}
            </div>
            <div class="rd-line" style="color: ${d.subjectColor || '#3a2418'};">${safeSubject1}</div>
            <div class="rd-line" style="color: ${d.subjectColor || '#3a2418'};">${safeSubject2}</div>
            <div class="rd-line rd-hl-wrap">
              <span class="rd-hl" style="${showHl ? `background: ${d.highlighterColor ? d.highlighterColor + 'd9' : 'rgba(250, 204, 21, 0.85)'}; mix-blend-mode: multiply;` : 'background: transparent !important; animation: none !important;'}">${safeAmount}</span>
            </div>
            ${showWarn ? `<div class="rd-line rd-disclose" style="color: ${d.warningColor || '#ef4444'}; font-weight: 800;">${safeWarning}</div>` : ''}
            ${showStamp ? `<div class="rd-stamp" style="border-color: ${d.stampColor || '#c1121f'}; color: ${d.stampColor || '#c1121f'}; transform: rotate(${stampAngle}deg);">${safeStamp}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  };

  /**
   * Deep Granular Contextual Inspector Controls Builder for Customizer
   * Structured with 4 clean tabs:
   * 1. [ 📝 Content ] - Full editing for Memo & Background Artifacts
   * 2. [ 🎨 Colors & Redact ] - Color pickers, Highlighter hues, Redaction, Rubber Stamp
   * 3. [ 🌊 Living Motion ] - Floating background drift, speed, 3D pitch tilt
   * 4. [ 🎥 Optics & Grading ] - Background blur bokeh, exposure, brightness, contrast
   */
  window.tplBuildFraudDossierInspector = function(container, rawData, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, rawData || {});

    function updateField(key, val) {
      if (typeof window.tplSetContextualData === 'function') {
        const cur = window.tplGetContextualData(tplId) || {};
        const next = Object.assign({}, cur, { [key]: val });
        textureCache.clear();
        window.tplSetContextualData(tplId, next);
        window.tplUpdateStageWithContextualData(tplId, next);
      }
    }

    const tabs = [
      { id: 'content', label: '📝 Content' },
      { id: 'colors', label: '🎨 Colors & Redact' },
      { id: 'motion', label: '🌊 Living Motion' },
      { id: 'optics', label: '🎥 Optics & Blur' }
    ];

    const tabButtonsHtml = tabs.map(tab => {
      const active = currentInspectorTab === tab.id;
      return `
        <button type="button" class="fd-tab-btn" data-tab="${tab.id}" style="flex: 1; padding: 6px 4px; font-size: 10px; font-weight: ${active ? '700' : '600'}; border-radius: 6px; border: 1px solid ${active ? '#ef4444' : 'rgba(255,255,255,0.08)'}; background: ${active ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.03)'}; color: ${active ? '#fff' : '#94a3b8'}; cursor: pointer; transition: 0.15s; white-space: nowrap;">
          ${tab.label}
        </button>
      `;
    }).join('');

    // Tab 1: Content
    const tabContentHtml = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <!-- Hero Memo Content -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.6px;">Hero Memo Text Layers</span>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8.5px; color: #94a3b8;">Header Title</span>
            <input type="text" id="fd-inp-title" value="${escapeHtml(d.title || 'INTERNAL MEMO · EYES ONLY')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #fff; font-weight: 700; padding: 6px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Recipient Line</span>
              <input type="text" id="fd-inp-recipient" value="${escapeHtml(d.recipient || 'To: Board of Directors')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; font-family: monospace; padding: 6px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Sender Label</span>
              <input type="text" id="fd-inp-sender" value="${escapeHtml(d.senderLabel || 'From:')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; font-family: monospace; padding: 6px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8.5px; color: #94a3b8;">Redacted Name Under Bar (Slam at 0.8s)</span>
            <input type="text" id="fd-inp-redacted-name" value="${escapeHtml(d.senderRedacted || 'Alexander Vance, CFO')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #e2e8f0; font-family: monospace; padding: 6px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Subject Line 1</span>
              <input type="text" id="fd-inp-sub1" value="${escapeHtml(d.subjectLine1 || 'Re: Q3 revenue booked via')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; font-family: monospace; padding: 6px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Subject Line 2</span>
              <input type="text" id="fd-inp-sub2" value="${escapeHtml(d.subjectLine2 || 'side letters totaling')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; font-family: monospace; padding: 6px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8.5px; color: #94a3b8;">Highlighted Target Amount (Sweeps at 1.6s)</span>
            <input type="text" id="fd-inp-amount" value="${escapeHtml(d.highlightedAmount || '$8.4 BILLION')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #facc15; font-weight: 800; font-family: monospace; padding: 6px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Warning Note</span>
              <input type="text" id="fd-inp-warning" value="${escapeHtml(d.disclosureWarning || 'DO NOT DISCLOSE.')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #ef4444; font-weight: 700; padding: 6px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Rubber Stamp (Slams at 2.3s)</span>
              <input type="text" id="fd-inp-stamp" value="${escapeHtml(d.stampText || 'CONFIDENTIAL')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #ef4444; font-weight: 800; padding: 6px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>
          </div>
        </div>

        <!-- Background Artifacts Content -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.6px;">Background Paper Artifacts</span>

          <!-- Left Dossier -->
          <div style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.06);">
            <span style="font-size: 8.5px; font-weight: 700; color: #f59e0b;">Left Manila Investigation Dossier</span>
            <input type="text" id="fd-inp-inv-head" value="${escapeHtml(d.investigationHeader || 'INVESTIGATION // FILE 904')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1); color: #f59e0b; font-family: monospace; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; outline: none;" />
            <input type="text" id="fd-inp-inv-subj" value="${escapeHtml(d.investigationSubject || 'SUBJECT: OFF-BALANCE SHEET LIABILITIES')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; outline: none;" />
          </div>

          <!-- Top-Left Slip -->
          <div style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.06);">
            <span style="font-size: 8.5px; font-weight: 700; color: #ef4444;">Top-Left Classified Slip</span>
            <input type="text" id="fd-inp-sec-head" value="${escapeHtml(d.topSecretHeader || 'TOP SECRET')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-family: monospace; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; outline: none;" />
            <input type="text" id="fd-inp-sec-class" value="${escapeHtml(d.topSecretClassifier || 'LEVEL 4 CLASSIFIED · OIG AUDIT')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; outline: none;" />
          </div>

          <!-- Right Contract -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; font-weight: 700; color: #a855f7;">Right Legal Contract</span>
            <input type="text" id="fd-inp-con-head" value="${escapeHtml(d.contractHeader || 'CONTRACT')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1); color: #a855f7; font-family: monospace; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; outline: none;" />
            <input type="text" id="fd-inp-con-line1" value="${escapeHtml(d.contractLine1 || 'WHEREAS Corporation executed side covenants;')}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; outline: none;" />
          </div>
        </div>
      </div>
    `;

    // Tab 2: Colors & Redact
    const tabColorsHtml = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <!-- Fluorescent Highlighter Styling -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #facc15; text-transform: uppercase; letter-spacing: 0.6px;">Fluorescent Highlighter</span>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-hl" ${d.showHighlighter !== false ? 'checked' : ''} style="accent-color: #facc15;" /> Enable
            </label>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Marker Ink Hue</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="color" id="fd-col-hl" value="${d.highlighterColor || '#facc15'}" style="width: 28px; height: 24px; border: none; background: transparent; cursor: pointer; border-radius: 4px;" />
              <span id="fd-lbl-hl" style="font-size: 9.5px; font-family: monospace; color: #facc15;">${d.highlighterColor || '#facc15'}</span>
            </div>
          </div>

          <!-- Quick Palette Pills -->
          <div style="display: flex; align-items: center; gap: 5px; margin-top: 2px;">
            <span style="font-size: 8px; color: #64748b; text-transform: uppercase;">Presets:</span>
            <button type="button" class="fd-hl-preset" data-color="#facc15" style="width: 18px; height: 18px; border-radius: 50%; background: #facc15; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;" title="Fluo Yellow"></button>
            <button type="button" class="fd-hl-preset" data-color="#10b981" style="width: 18px; height: 18px; border-radius: 50%; background: #10b981; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;" title="Neon Green"></button>
            <button type="button" class="fd-hl-preset" data-color="#06b6d4" style="width: 18px; height: 18px; border-radius: 50%; background: #06b6d4; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;" title="Cyan Marker"></button>
            <button type="button" class="fd-hl-preset" data-color="#f97316" style="width: 18px; height: 18px; border-radius: 50%; background: #f97316; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;" title="Hot Orange"></button>
            <button type="button" class="fd-hl-preset" data-color="#f43f5e" style="width: 18px; height: 18px; border-radius: 50%; background: #f43f5e; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;" title="Neon Pink"></button>
          </div>
        </div>

        <!-- Redaction Bar & Warning -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.6px;">Redaction & Warning</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-redact" ${d.showRedaction !== false ? 'checked' : ''} style="accent-color: #ef4444;" /> Slam Redaction Bar
            </label>
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Bar Color:</span>
              <input type="color" id="fd-col-redact" value="${d.redactionColor || '#111111'}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.06);">
            <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-warn" ${d.showWarning !== false ? 'checked' : ''} style="accent-color: #ef4444;" /> Show Warning Note
            </label>
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Warning Color:</span>
              <input type="color" id="fd-col-warn" value="${d.warningColor || '#ef4444'}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" />
            </div>
          </div>
        </div>

        <!-- Rubber Stamp & Paper Tones -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #c1121f; text-transform: uppercase; letter-spacing: 0.6px;">Stamp & Paper Tones</span>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-stamp" ${d.showStamp !== false ? 'checked' : ''} style="accent-color: #c1121f;" /> Show Stamp
            </label>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Stamp Color</span>
              <input type="color" id="fd-col-stamp" value="${d.stampColor || '#c1121f'}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" />
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Paper Tone</span>
              <input type="color" id="fd-col-paper" value="${d.paperTone || '#fbf8ef'}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px; margin-top: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Stamp Angle Tilt</span>
              <span id="fd-val-stamp-angle" style="font-size: 8.5px; color: #ef4444; font-family: monospace;">${d.stampAngle !== undefined ? d.stampAngle : -14}&deg;</span>
            </div>
            <input type="range" id="fd-rng-stamp-angle" min="-30" max="30" step="1" value="${d.stampAngle !== undefined ? d.stampAngle : -14}" style="accent-color: #ef4444;" />
          </div>
        </div>
      </div>
    `;

    // Tab 3: Motion & Floating (like 3D newspaper clipping)
    const tabMotionHtml = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <!-- Living Background Motion -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">🌊</span>
              <span style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.6px;">3D Living Paper Motion</span>
            </div>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-floating" ${d.floatingMotion !== false ? 'checked' : ''} style="accent-color: #38bdf8;" /> Floating Active
            </label>
          </div>
          <span style="font-size: 8.5px; color: #64748b; line-height: 1.3;">Like 3D newspaper clippings, background artifacts gently float and drift in 3D perspective rather than sitting frozen.</span>

          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Float Drift Amplitude</span>
              <span id="fd-val-float-amp" style="font-size: 8.5px; color: #38bdf8; font-family: monospace;">${d.floatAmplitude !== undefined ? d.floatAmplitude : 100}%</span>
            </div>
            <input type="range" id="fd-rng-float-amp" min="0" max="200" step="5" value="${d.floatAmplitude !== undefined ? d.floatAmplitude : 100}" style="accent-color: #38bdf8;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Floating Speed</span>
              <span id="fd-val-float-spd" style="font-size: 8.5px; color: #38bdf8; font-family: monospace;">${(d.floatSpeed || 1.0).toFixed(1)}x</span>
            </div>
            <input type="range" id="fd-rng-float-spd" min="0.4" max="2.5" step="0.1" value="${d.floatSpeed || 1.0}" style="accent-color: #38bdf8;" />
          </div>
        </div>

        <!-- 3D Spatial Rig (Pitch & Scale) -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.6px;">3D Perspective Rig</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 8.5px; color: #cbd5e1;">Pitch Tilt (X)</span>
                <span id="fd-val-tilt" style="font-size: 8.5px; color: #ef4444; font-family: monospace;">${d.tiltAngleX || 29}&deg;</span>
              </div>
              <input type="range" id="fd-rng-tilt" min="15" max="42" step="1" value="${d.tiltAngleX || 29}" style="accent-color: #ef4444;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 8.5px; color: #cbd5e1;">Coverage Scale</span>
                <span id="fd-val-scale" style="font-size: 8.5px; color: #ef4444; font-family: monospace;">${d.coverageScale || 62}%</span>
              </div>
              <input type="range" id="fd-rng-scale" min="45" max="75" step="1" value="${d.coverageScale || 62}" style="accent-color: #ef4444;" />
            </div>
          </div>
        </div>
      </div>
    `;

    // Tab 4: Optics & Grading
    const tabOpticsHtml = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <!-- Depth of Field Blur -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.6px;">Background Depth-of-Field Blur</span>
            <span id="fd-val-blur" style="font-size: 9.5px; color: #38bdf8; font-family: monospace; font-weight: 700;">${(d.backgroundBlur !== undefined ? d.backgroundBlur : 1.5).toFixed(1)}px</span>
          </div>
          <span style="font-size: 8.5px; color: #64748b; line-height: 1.3;">Slide left to 0px for razor sharp background papers, or right for soft cinematic f/2.0 bokeh.</span>
          <input type="range" id="fd-rng-blur" min="0" max="6.0" step="0.2" value="${d.backgroundBlur !== undefined ? d.backgroundBlur : 1.5}" style="accent-color: #38bdf8;" />
        </div>

        <!-- Paper Exposure & Contrast -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.6px;">Paper Exposure & Color Grading</span>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Paper Exposure / Brightness</span>
              <span id="fd-val-bright" style="font-size: 8.5px; color: #f59e0b; font-family: monospace;">${d.paperBrightness || 100}%</span>
            </div>
            <input type="range" id="fd-rng-bright" min="70" max="150" step="2" value="${d.paperBrightness || 100}" style="accent-color: #f59e0b;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Paper Contrast</span>
              <span id="fd-val-contrast" style="font-size: 8.5px; color: #f59e0b; font-family: monospace;">${d.paperContrast || 105}%</span>
            </div>
            <input type="range" id="fd-rng-contrast" min="80" max="150" step="2" value="${d.paperContrast || 105}" style="accent-color: #f59e0b;" />
          </div>
        </div>

        <!-- Environment & Spotlight -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.6px;">Environment & Key Lighting</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Desk Surface</span>
              <select id="fd-sel-surface" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; padding: 5px 8px; border-radius: 6px; font-size: 9.5px; outline: none;">
                <option value="mahogany" ${d.surfaceType === 'mahogany' ? 'selected' : ''}>Mahogany Desk</option>
                <option value="blueprint" ${d.surfaceType === 'blueprint' ? 'selected' : ''}>Blue Grid Map</option>
                <option value="dark_slate" ${d.surfaceType === 'dark_slate' ? 'selected' : ''}>Noir Dark Slate</option>
              </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #94a3b8;">Spotlight Intensity</span>
              <input type="range" id="fd-rng-spotlight" min="0.6" max="3.5" step="0.1" value="${d.spotlightIntensity || 2.2}" style="accent-color: #ef4444;" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px;">
            <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-grid" ${d.showCoordinateGrid !== false ? 'checked' : ''} style="accent-color: #38bdf8;" /> Topo Coordinate Grid
            </label>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="fd-chk-dust" ${d.volumetricDust !== false ? 'checked' : ''} style="accent-color: #facc15;" /> Floating Dust Motes
            </label>
          </div>
        </div>
      </div>
    `;

    let activeTabBody = tabContentHtml;
    if (currentInspectorTab === 'colors') activeTabBody = tabColorsHtml;
    else if (currentInspectorTab === 'motion') activeTabBody = tabMotionHtml;
    else if (currentInspectorTab === 'optics') activeTabBody = tabOpticsHtml;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 2px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">📁</span>
            <span style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.8px;">Fraud Dossier Engine</span>
          </div>
          <span style="font-size: 9px; color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); padding: 2px 6px; border-radius: 4px;">DOC-DRAMA</span>
        </div>

        <!-- Tab Switcher Navigation -->
        <div style="display: flex; gap: 4px; background: rgba(0,0,0,0.35); padding: 3px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          ${tabButtonsHtml}
        </div>

        <!-- Active Tab Container -->
        <div id="fd-tab-body-container">
          ${activeTabBody}
        </div>

        <!-- Reset Button -->
        <div style="display: flex; justify-content: flex-end; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.06);">
          <button type="button" id="fd-btn-reset" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; font-size: 9.5px; padding: 5px 12px; border-radius: 5px; cursor: pointer;">Reset All to Default</button>
        </div>
      </div>
    `;

    // Hook tab buttons
    container.querySelectorAll('.fd-tab-btn').forEach(btn => {
      btn.onclick = () => {
        currentInspectorTab = btn.dataset.tab;
        window.tplBuildFraudDossierInspector(container, d, tplId);
      };
    });

    // Wire up events based on active tab
    if (currentInspectorTab === 'content') {
      const inpTitle = container.querySelector('#fd-inp-title');
      if (inpTitle) inpTitle.oninput = (e) => updateField('title', e.target.value);

      const inpRecipient = container.querySelector('#fd-inp-recipient');
      if (inpRecipient) inpRecipient.oninput = (e) => updateField('recipient', e.target.value);

      const inpSender = container.querySelector('#fd-inp-sender');
      if (inpSender) inpSender.oninput = (e) => updateField('senderLabel', e.target.value);

      const inpRedacted = container.querySelector('#fd-inp-redacted-name');
      if (inpRedacted) inpRedacted.oninput = (e) => updateField('senderRedacted', e.target.value);

      const inpSub1 = container.querySelector('#fd-inp-sub1');
      if (inpSub1) inpSub1.oninput = (e) => updateField('subjectLine1', e.target.value);

      const inpSub2 = container.querySelector('#fd-inp-sub2');
      if (inpSub2) inpSub2.oninput = (e) => updateField('subjectLine2', e.target.value);

      const inpAmount = container.querySelector('#fd-inp-amount');
      if (inpAmount) inpAmount.oninput = (e) => updateField('highlightedAmount', e.target.value);

      const inpWarning = container.querySelector('#fd-inp-warning');
      if (inpWarning) inpWarning.oninput = (e) => updateField('disclosureWarning', e.target.value);

      const inpStamp = container.querySelector('#fd-inp-stamp');
      if (inpStamp) inpStamp.oninput = (e) => updateField('stampText', e.target.value);

      // Background inputs
      const inpInvHead = container.querySelector('#fd-inp-inv-head');
      if (inpInvHead) inpInvHead.oninput = (e) => updateField('investigationHeader', e.target.value);

      const inpInvSubj = container.querySelector('#fd-inp-inv-subj');
      if (inpInvSubj) inpInvSubj.oninput = (e) => updateField('investigationSubject', e.target.value);

      const inpSecHead = container.querySelector('#fd-inp-sec-head');
      if (inpSecHead) inpSecHead.oninput = (e) => updateField('topSecretHeader', e.target.value);

      const inpSecClass = container.querySelector('#fd-inp-sec-class');
      if (inpSecClass) inpSecClass.oninput = (e) => updateField('topSecretClassifier', e.target.value);

      const inpConHead = container.querySelector('#fd-inp-con-head');
      if (inpConHead) inpConHead.oninput = (e) => updateField('contractHeader', e.target.value);

      const inpConLine1 = container.querySelector('#fd-inp-con-line1');
      if (inpConLine1) inpConLine1.oninput = (e) => updateField('contractLine1', e.target.value);
    } else if (currentInspectorTab === 'colors') {
      const chkHl = container.querySelector('#fd-chk-hl');
      if (chkHl) chkHl.onchange = (e) => updateField('showHighlighter', e.target.checked);

      const colHl = container.querySelector('#fd-col-hl');
      const lblHl = container.querySelector('#fd-lbl-hl');
      if (colHl) {
        colHl.oninput = (e) => {
          if (lblHl) { lblHl.textContent = e.target.value; lblHl.style.color = e.target.value; }
          updateField('highlighterColor', e.target.value);
        };
      }

      container.querySelectorAll('.fd-hl-preset').forEach(btn => {
        btn.onclick = () => {
          const c = btn.dataset.color;
          if (colHl) colHl.value = c;
          if (lblHl) { lblHl.textContent = c; lblHl.style.color = c; }
          updateField('highlighterColor', c);
        };
      });

      const chkRedact = container.querySelector('#fd-chk-redact');
      if (chkRedact) chkRedact.onchange = (e) => updateField('showRedaction', e.target.checked);

      const colRedact = container.querySelector('#fd-col-redact');
      if (colRedact) colRedact.oninput = (e) => updateField('redactionColor', e.target.value);

      const chkWarn = container.querySelector('#fd-chk-warn');
      if (chkWarn) chkWarn.onchange = (e) => updateField('showWarning', e.target.checked);

      const colWarn = container.querySelector('#fd-col-warn');
      if (colWarn) colWarn.oninput = (e) => updateField('warningColor', e.target.value);

      const chkStamp = container.querySelector('#fd-chk-stamp');
      if (chkStamp) chkStamp.onchange = (e) => updateField('showStamp', e.target.checked);

      const colStamp = container.querySelector('#fd-col-stamp');
      if (colStamp) colStamp.oninput = (e) => updateField('stampColor', e.target.value);

      const colPaper = container.querySelector('#fd-col-paper');
      if (colPaper) colPaper.oninput = (e) => updateField('paperTone', e.target.value);

      const rngStampAngle = container.querySelector('#fd-rng-stamp-angle');
      const valStampAngle = container.querySelector('#fd-val-stamp-angle');
      if (rngStampAngle) {
        rngStampAngle.oninput = (e) => {
          const v = parseInt(e.target.value);
          if (valStampAngle) valStampAngle.textContent = `${v}°`;
          updateField('stampAngle', v);
        };
      }
    } else if (currentInspectorTab === 'motion') {
      const chkFloating = container.querySelector('#fd-chk-floating');
      if (chkFloating) chkFloating.onchange = (e) => updateField('floatingMotion', e.target.checked);

      const rngFloatAmp = container.querySelector('#fd-rng-float-amp');
      const valFloatAmp = container.querySelector('#fd-val-float-amp');
      if (rngFloatAmp) {
        rngFloatAmp.oninput = (e) => {
          const v = parseInt(e.target.value);
          if (valFloatAmp) valFloatAmp.textContent = `${v}%`;
          updateField('floatAmplitude', v);
        };
      }

      const rngFloatSpd = container.querySelector('#fd-rng-float-spd');
      const valFloatSpd = container.querySelector('#fd-val-float-spd');
      if (rngFloatSpd) {
        rngFloatSpd.oninput = (e) => {
          const v = parseFloat(e.target.value);
          if (valFloatSpd) valFloatSpd.textContent = `${v.toFixed(1)}x`;
          updateField('floatSpeed', v);
        };
      }

      const rngTilt = container.querySelector('#fd-rng-tilt');
      const valTilt = container.querySelector('#fd-val-tilt');
      if (rngTilt) {
        rngTilt.oninput = (e) => {
          const v = parseInt(e.target.value);
          if (valTilt) valTilt.textContent = `${v}°`;
          updateField('tiltAngleX', v);
        };
      }

      const rngScale = container.querySelector('#fd-rng-scale');
      const valScale = container.querySelector('#fd-val-scale');
      if (rngScale) {
        rngScale.oninput = (e) => {
          const v = parseInt(e.target.value);
          if (valScale) valScale.textContent = `${v}%`;
          updateField('coverageScale', v);
        };
      }
    } else if (currentInspectorTab === 'optics') {
      const rngBlur = container.querySelector('#fd-rng-blur');
      const valBlur = container.querySelector('#fd-val-blur');
      if (rngBlur) {
        rngBlur.oninput = (e) => {
          const v = parseFloat(e.target.value);
          if (valBlur) valBlur.textContent = `${v.toFixed(1)}px`;
          updateField('backgroundBlur', v);
        };
      }

      const rngBright = container.querySelector('#fd-rng-bright');
      const valBright = container.querySelector('#fd-val-bright');
      if (rngBright) {
        rngBright.oninput = (e) => {
          const v = parseInt(e.target.value);
          if (valBright) valBright.textContent = `${v}%`;
          updateField('paperBrightness', v);
        };
      }

      const rngContrast = container.querySelector('#fd-rng-contrast');
      const valContrast = container.querySelector('#fd-val-contrast');
      if (rngContrast) {
        rngContrast.oninput = (e) => {
          const v = parseInt(e.target.value);
          if (valContrast) valContrast.textContent = `${v}%`;
          updateField('paperContrast', v);
        };
      }

      const selSurface = container.querySelector('#fd-sel-surface');
      if (selSurface) selSurface.onchange = (e) => updateField('surfaceType', e.target.value);

      const rngSpot = container.querySelector('#fd-rng-spotlight');
      if (rngSpot) rngSpot.oninput = (e) => updateField('spotlightIntensity', parseFloat(e.target.value));

      const chkGrid = container.querySelector('#fd-chk-grid');
      if (chkGrid) chkGrid.onchange = (e) => updateField('showCoordinateGrid', e.target.checked);

      const chkDust = container.querySelector('#fd-chk-dust');
      if (chkDust) chkDust.onchange = (e) => updateField('volumetricDust', e.target.checked);
    }

    const btnReset = container.querySelector('#fd-btn-reset');
    if (btnReset) {
      btnReset.onclick = () => {
        textureCache.clear();
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
          window.tplBuildFraudDossierInspector(container, DEFAULT_CONFIG, tplId);
          window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
        }
      };
    }
  };

  console.log('[Fraud Dossier Engine] Loaded Upgraded Photorealistic & Granular 3D Engine');
})();
