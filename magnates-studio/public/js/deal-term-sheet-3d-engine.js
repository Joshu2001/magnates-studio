/**
 * Photorealistic 3D Deal Term Sheet Signing Engine (Doc-Drama Standard)
 * Replicating top-tier documentary aesthetics (James Jani, Magnates Media, Vox)
 *
 * Features:
 * 1. Material Shaders & Geometry:
 *    - Authentic vertical US Letter / A4 paper geometry (8.5" x 11" aspect ratio)
 *    - Heavy cotton paper micro-fiber grain, subtle corner curvature, and physical edge thickness
 *    - Realistic fountain-pen cursive ink trailing with pressure variation (thick downstrokes, thin upstrokes)
 *    - Dual rubber ink stamps ("DEAL CLOSED" & "APPROVED") with porous ink bleed and multiply blending
 *    - Dynamic yellow highlighter sweeps with realistic marker saturation and ink absorption
 * 2. 3D Spatial Framing & Camera:
 *    - Macro cinematic framing occupying 55%-65% of viewport height
 *    - Dynamic 28°-32° spatial pitch with subtle yaw and slow cinematic glide tracking to the signature line
 *    - Full interactive OrbitControls (drag to tilt/orbit in 3D, wheel to zoom)
 * 3. Atmospheric Environment:
 *    - Dark executive mahogany desk surface (/mahogany_desk_texture.jpg)
 *    - Angled archival vintage map (/paper_tear_stock_vintage_map.jpg) resting in the upper left corner
 *    - Directional warm overhead key spotlight with soft contact shadows and peripheral vignette falloff
 * 4. Production Integration:
 *    - Real-time customizer playback, timeline scrub synchronization, and 4K canvas video export
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'deal-term-sheet';

  // Default Doc-Drama Legal Term Sheet Configuration
  const DEFAULT_CONFIG = {
    type: 'deal-term-sheet',
    title: 'TERM SHEET \u00b7 SERIES A',
    companyName: 'ACME CORP / ATLAS VENTURES',
    preamble: '1. The undersigned parties hereby execute this binding Term Sheet setting forth the principal terms of the Series A Preferred Stock financing of the Company.',
    valuationText: 'Valuation: $80M pre-money',
    investmentText: 'Investment: $12M for 15%',
    boardSeatsText: 'Board seats: 2 investor, 3 founder',
    liquidationPrefText: 'Liquidation pref: 1x non-participating',
    clause2: '2. The fountain pen execution hereto represents definitive agreement, binding upon all corporate parties and successors. Escrow conditions shall close within thirty (30) business days under Delaware Law.',
    clause3: '3. The fountain pen ink shall constitute binding execution upon delivery.',
    signatureLabel: 'Signature,',
    signeeName: 'Alexander Vance',
    stamp1Text: 'DEAL CLOSED',
    stamp2Text: 'APPROVED',
    showStamp1: true,
    showStamp2: true,
    paperTone: '#f5f0e1',
    highlighterColor: '#facc15',
    inkColor: '#1e293b',
    stampColor: '#b91c1c',
    surfaceType: 'mahogany', // 'mahogany', 'tactical_grid', 'dark_leather'
    cameraPreset: 'macro_cinematic', // 'macro_cinematic', 'isometric_evidence', 'top_down_dossier'
    lightWarmth: '#fff3db',
    lightIntensity: 2.2,
    duration: 5.0
  };

  // Three.js Scene References
  let tsScene = null;
  let tsCamera = null;
  let tsRenderer = null;
  let tsAnimFrame = null;
  let tsControls = null;
  let tsGroup = null;

  // Meshes
  let paperMesh = null;
  let tableMesh = null;
  let mapMesh = null;
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

  // Preload desk and map textures
  preloadImage('/mahogany_desk_texture.jpg');
  preloadImage('/paper_tear_stock_vintage_map.jpg');

  /**
   * Generates high-resolution US Letter procedural canvas texture (8.5" x 11" ratio: 1536 x 1988 px)
   * With cotton paper micro-grain, formal legal typography, highlighter sweeps, signature ink, and stamps.
   */
  function generateTermSheetTexture(data, t) {
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t !== undefined ? t : (dur * 0.9)));
    // Quantize cache key to ~30fps for smooth performance during playback
    const frameIndex = Math.round(ct * 30);
    const key = `ts_tex_${frameIndex}_${data.valuationText}_${data.investmentText}_${data.stamp1Text}_${data.paperTone}`;

    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 1988; // Exactly 8.5 x 11 ratio (1536 / 8.5 * 11 = 1988)
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Off-white / Ivory Cotton Paper Base Tone
    ctx.fillStyle = data.paperTone || '#f5f0e1';
    ctx.fillRect(0, 0, w, h);

    // Subtle edge aging / vignette on paper
    const paperGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, w * 0.72);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    paperGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    paperGrad.addColorStop(1, 'rgba(120, 85, 45, 0.12)'); // Aged paper edge patina
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Cotton Paper Micro-Fiber Grain
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    // Fast pseudo-noise loop
    for (let i = 0; i < pix.length; i += 8) {
      const n = (Math.random() - 0.5) * 11;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle fine legal borders
    ctx.strokeStyle = 'rgba(40, 25, 15, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    const marginX = 140;
    let currentY = 170;

    // 3. Clause 1 & Legal Preamble (Small Formal Legal Font)
    ctx.fillStyle = '#475569';
    ctx.font = '500 21px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0.5px';

    const preambleLines = [
      'The undersigned parties enter into this binding Term Sheet for the Series A Preferred',
      'Stock Purchase Agreement in accordance with Section 4(a)(2) of the Securities Act of 1933.',
      '1. The undersigned parties hereby execute this binding Term Sheet setting forth principal terms.'
    ];
    preambleLines.forEach(line => {
      ctx.fillText(line, marginX, currentY);
      currentY += 32;
    });

    currentY += 35;

    // 4. Main Formal Document Header
    ctx.fillStyle = '#1e293b';
    ctx.font = '900 38px "JetBrains Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText(data.title || 'TERM SHEET \u00b7 SERIES A', w * 0.5, currentY);

    currentY += 22;
    // Fine dashed rule
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.moveTo(marginX, currentY);
    ctx.lineTo(w - marginX, currentY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    currentY += 80;

    // 5. Deal Key Terms with Animated Yellow Highlighter Sweeps
    // Timing: Line 1 highlights from t=0.6s to 1.3s; Line 2 highlights from t=1.1s to 1.8s
    const hlT1 = Math.max(0, Math.min(1, (ct - 0.6) / 0.7));
    const hlT2 = Math.max(0, Math.min(1, (ct - 1.1) / 0.7));

    ctx.textAlign = 'left';

    // Term 1: Valuation
    const valText = data.valuationText || 'Valuation: $80M pre-money';
    ctx.font = '800 36px "JetBrains Mono", monospace';
    const valMetrics = ctx.measureText(valText);
    const valW = valMetrics.width;

    if (hlT1 > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(250, 204, 21, 0.82)'; // Rich yellow marker
      // Chiseled marker sweep
      const drawW = valW * hlT1;
      ctx.beginPath();
      ctx.moveTo(marginX - 10, currentY - 32);
      ctx.lineTo(marginX - 10 + drawW, currentY - 32);
      ctx.lineTo(marginX - 4 + drawW, currentY + 12);
      ctx.lineTo(marginX - 14, currentY + 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#0f172a';
    ctx.fillText(valText, marginX, currentY);

    currentY += 76;

    // Term 2: Investment
    const invText = data.investmentText || 'Investment: $12M for 15%';
    const invMetrics = ctx.measureText(invText);
    const invW = invMetrics.width;

    if (hlT2 > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(250, 204, 21, 0.82)';
      const drawW = invW * hlT2;
      ctx.beginPath();
      ctx.moveTo(marginX - 10, currentY - 32);
      ctx.lineTo(marginX - 10 + drawW, currentY - 32);
      ctx.lineTo(marginX - 4 + drawW, currentY + 12);
      ctx.lineTo(marginX - 14, currentY + 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#0f172a';
    ctx.fillText(invText, marginX, currentY);

    currentY += 76;

    // Term 3: Board Seats
    ctx.fillText(data.boardSeatsText || 'Board seats: 2 investor, 3 founder', marginX, currentY);
    currentY += 76;

    // Term 4: Liquidation Preference
    ctx.fillText(data.liquidationPrefText || 'Liquidation pref: 1x non-participating', marginX, currentY);
    currentY += 95;

    // 6. Numbered Fine Print Clauses 2 & 3
    ctx.font = '500 20.5px "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';
    const bodyLines = [
      '2. The definitive agreements shall contain customary representations, warranties and covenants.',
      '   All intellectual property of the company shall be fully assigned to the corporation upon closing.',
      '   Conditions precedent to closing include satisfactory completion of legal and financial audit.',
      '   The fountain pen execution hereto represents definitive agreement, binding upon all corporate parties.',
      '3. The fountain pen ink shall constitute binding execution upon delivery to legal escrow.'
    ];
    bodyLines.forEach(line => {
      ctx.fillText(line, marginX, currentY);
      currentY += 34;
    });

    currentY += 85;

    // 7. Signature Line & Fountain Pen Cursive Execution
    // Timing: Signature draws from t=1.8s to 3.2s
    const sigProgress = Math.max(0, Math.min(1, (ct - 1.8) / 1.4));

    ctx.fillStyle = '#1e293b';
    ctx.font = '700 28px "Georgia", serif';
    ctx.fillText(data.signatureLabel || 'Signature,', marginX, currentY);

    // Signature line
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(marginX + 170, currentY + 4);
    ctx.lineTo(marginX + 620, currentY + 4);
    ctx.stroke();

    // Fountain Pen Cursive Animation with Dynamic Pressure Trailing
    if (sigProgress > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = data.inkColor || '#1e293b';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Authentic cursive stroke coordinates for "Alexander Vance / Quill Sign"
      const sigPoints = [
        { x: marginX + 180, y: currentY - 5, w: 2.2 },
        { x: marginX + 195, y: currentY - 38, w: 4.2 },
        { x: marginX + 215, y: currentY + 2, w: 3.5 },
        { x: marginX + 230, y: currentY - 26, w: 2.4 },
        { x: marginX + 248, y: currentY - 4, w: 3.8 },
        { x: marginX + 265, y: currentY - 48, w: 4.8 },
        { x: marginX + 282, y: currentY + 4, w: 3.0 },
        { x: marginX + 305, y: currentY - 18, w: 2.5 },
        { x: marginX + 325, y: currentY - 5, w: 3.6 },
        { x: marginX + 348, y: currentY - 28, w: 2.2 },
        { x: marginX + 375, y: currentY - 4, w: 3.8 },
        { x: marginX + 400, y: currentY - 44, w: 4.6 },
        { x: marginX + 420, y: currentY + 6, w: 2.8 },
        { x: marginX + 445, y: currentY - 16, w: 3.2 },
        { x: marginX + 475, y: currentY - 6, w: 2.6 },
        { x: marginX + 510, y: currentY - 32, w: 4.2 },
        { x: marginX + 545, y: currentY - 4, w: 3.4 },
        { x: marginX + 590, y: currentY - 12, w: 1.8 }
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

        // Wet ink pool bead at current pen tip
        ctx.fillStyle = data.inkColor || '#1e293b';
        ctx.beginPath();
        ctx.arc(curX, curY, p1.w * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Signee sub-label
    ctx.font = '500 18px "Courier New", monospace';
    ctx.fillStyle = 'rgba(71, 85, 105, 0.75)';
    ctx.fillText('AUTHORIZED SIGNATURE \u00b7 CEO / MANAGING PARTNER', marginX + 175, currentY + 36);

    // 8. Authentic Rubber Stamps ("DEAL CLOSED" and "APPROVED")
    // Stamp 1: DEAL CLOSED slams at t=3.2s
    if (data.showStamp1 !== false && ct >= 3.1) {
      const stampProg1 = Math.max(0, Math.min(1, (ct - 3.1) / 0.35));
      // Slam impact bounce
      const scale1 = stampProg1 < 0.6
        ? (2.2 - (stampProg1 / 0.6) * 1.25)
        : (0.95 + (stampProg1 - 0.6) * 0.125);
      const alpha1 = Math.min(1, stampProg1 * 1.8);

      drawRubberStamp(ctx, {
        text: data.stamp1Text || 'DEAL CLOSED',
        x: w * 0.74,
        y: h * 0.78,
        angle: -13 * Math.PI / 180,
        scale: scale1,
        alpha: alpha1,
        color: data.stampColor || '#b91c1c'
      });
    }

    // Stamp 2: APPROVED slams at t=3.65s (offset lower right, overlapping)
    if (data.showStamp2 !== false && ct >= 3.6) {
      const stampProg2 = Math.max(0, Math.min(1, (ct - 3.6) / 0.35));
      const scale2 = stampProg2 < 0.6
        ? (2.2 - (stampProg2 / 0.6) * 1.25)
        : (0.95 + (stampProg2 - 0.6) * 0.125);
      const alpha2 = Math.min(1, stampProg2 * 1.8);

      drawRubberStamp(ctx, {
        text: data.stamp2Text || 'APPROVED',
        x: w * 0.81,
        y: h * 0.85,
        angle: -16 * Math.PI / 180,
        scale: scale2,
        alpha: alpha2,
        color: data.stampColor || '#b91c1c'
      });
    }

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

    ctx.font = '900 36px "JetBrains Mono", "Impact", sans-serif';
    const textMetrics = ctx.measureText(text);
    const boxW = textMetrics.width + 44;
    const boxH = 58;

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
    ctx.letterSpacing = '3px';
    ctx.fillText(text, 0, 1);

    // Stamp ink voids & micro-distress (porous rubber stamp texture)
    ctx.fillStyle = 'rgba(245, 240, 225, 0.45)';
    for (let i = 0; i < 28; i++) {
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
   * - Dark Executive Mahogany Desk
   * - Archival Vintage Map sitting in the upper left
   * - Soft Contact Shadow Mesh
   * - PBR Lighting Rig with Warm Directional Key Spotlight
   */
  function buildStudioEnvironment(data) {
    // 1. Mahogany Desk Surface
    const tableGeo = new THREE.PlaneGeometry(750, 520);
    const mahoganyImg = imageAssets.get('/mahogany_desk_texture.jpg');
    let tableTex;
    if (mahoganyImg && mahoganyImg.complete) {
      tableTex = new THREE.Texture(mahoganyImg);
      tableTex.needsUpdate = true;
    } else {
      // Fallback rich mahogany procedural canvas
      const cv = document.createElement('canvas');
      cv.width = 512; cv.height = 512;
      const c = cv.getContext('2d');
      const g = c.createLinearGradient(0, 0, 512, 512);
      g.addColorStop(0, '#1c0f0a'); g.addColorStop(0.5, '#2b140b'); g.addColorStop(1, '#150a06');
      c.fillStyle = g; c.fillRect(0, 0, 512, 512);
      tableTex = new THREE.CanvasTexture(cv);
    }
    tableTex.wrapS = THREE.RepeatWrapping;
    tableTex.wrapT = THREE.RepeatWrapping;
    tableTex.repeat.set(1.5, 1.2);

    const tableMat = new THREE.MeshStandardMaterial({
      map: tableTex,
      roughness: 0.65,
      metalness: 0.08
    });

    tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.receiveShadow = true;
    tableMesh.position.set(0, -2.5, 0);
    tableMesh.rotation.x = -Math.PI / 2;
    tsScene.add(tableMesh);

    // 2. Archival Vintage Map resting on upper left of desk (Matching Image 2)
    const mapGeo = new THREE.PlaneGeometry(280, 210);
    const mapImg = imageAssets.get('/paper_tear_stock_vintage_map.jpg');
    let mapTex;
    if (mapImg && mapImg.complete) {
      mapTex = new THREE.Texture(mapImg);
      mapTex.needsUpdate = true;
    } else {
      const cv = document.createElement('canvas');
      cv.width = 256; cv.height = 256;
      const c = cv.getContext('2d');
      c.fillStyle = '#cbb892'; c.fillRect(0, 0, 256, 256);
      mapTex = new THREE.CanvasTexture(cv);
    }

    const mapMat = new THREE.MeshStandardMaterial({
      map: mapTex,
      roughness: 0.85,
      metalness: 0.02
    });

    mapMesh = new THREE.Mesh(mapGeo, mapMat);
    mapMesh.receiveShadow = true;
    mapMesh.position.set(-165, -1.8, -90);
    mapMesh.rotation.x = -Math.PI / 2;
    mapMesh.rotation.z = THREE.MathUtils.degToRad(-26); // Angled in top-left
    tsScene.add(mapMesh);

    // 3. Contact Shadow & Ambient Occlusion Plane beneath Term Sheet Paper
    const shadowCv = document.createElement('canvas');
    shadowCv.width = 512; shadowCv.height = 512;
    const sCtx = shadowCv.getContext('2d');
    const sGrad = sCtx.createRadialGradient(256, 256, 60, 256, 256, 250);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    sGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.35)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCv);
    const shadowGeo = new THREE.PlaneGeometry(230, 280);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.rotation.z = THREE.MathUtils.degToRad(8);
    contactShadowMesh.position.set(22, -1.2, 14);
    tsScene.add(contactShadowMesh);
  }

  /**
   * Builds the 3D Vertical US Letter Legal Term Sheet Mesh ($8.5" \times 11"$)
   */
  function buildTermSheetAssembly(data, t) {
    if (tsGroup && tsScene) {
      tsScene.remove(tsGroup);
      tsGroup = null;
    }

    tsGroup = new THREE.Group();

    // Vertical US Letter Document Proportions (width = 138, height = 180, thickness = 0.6)
    const docWidth = 138;
    const docHeight = 180;
    const docThickness = 0.6;

    const paperCanvas = generateTermSheetTexture(data, t);
    const paperTex = new THREE.CanvasTexture(paperCanvas);
    paperTex.anisotropy = 8;

    // Front & Back materials
    const frontMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.82,
      metalness: 0.02,
      bumpScale: 0.02
    });

    const backMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(data.paperTone || '#f5f0e1'),
      roughness: 0.85,
      metalness: 0.02
    });

    const sideMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e2d8c3'), // Physical paper border cut edge
      roughness: 0.9,
      metalness: 0.01
    });

    // Box Geometry: [right, left, top, bottom, front, back]
    const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
    const docGeo = new THREE.BoxGeometry(docWidth, docThickness, docHeight);

    paperMesh = new THREE.Mesh(docGeo, materials);
    paperMesh.castShadow = true;
    paperMesh.receiveShadow = true;
    paperMesh.position.set(0, docThickness * 0.5, 0);
    tsGroup.add(paperMesh);

    // Apply 3D Spatial Framing: 28°-32° Pitch tilt with slight yaw (matching Image 2)
    tsGroup.rotation.x = THREE.MathUtils.degToRad(29);
    tsGroup.rotation.y = THREE.MathUtils.degToRad(-13);
    tsGroup.rotation.z = THREE.MathUtils.degToRad(4.5);
    tsGroup.position.set(16, 8, -5);

    tsScene.add(tsGroup);
  }

  /**
   * Initializes the Three.js Viewport inside the target container
   */
  window.initDealTermSheet3DScene = function(container, data) {
    if (!container) return;
    cleanupDealTermSheet3DScene();

    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const w = container.clientWidth || 960;
    const h = container.clientHeight || 540;

    // 1. Scene
    tsScene = new THREE.Scene();
    tsScene.background = new THREE.Color('#080a0f');

    // 2. Camera Rig: Macro Telephoto Lens with Cinematic Framing (f/2.8 feel)
    tsCamera = new THREE.PerspectiveCamera(31, w / h, 5, 2000);
    tsCamera.position.set(14, 155, 235);
    tsCamera.lookAt(18, 12, 5);

    // 3. Renderer with PCF Soft Contact Shadows
    tsRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    tsRenderer.setSize(w, h);
    tsRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    tsRenderer.shadowMap.enabled = true;
    tsRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(tsRenderer.domElement);

    // 4. OrbitControls for interactive 3D navigation
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
    spotLight.position.set(60, 280, 160);
    spotLight.target.position.set(15, 0, 0);
    spotLight.angle = 0.75;
    spotLight.penumbra = 0.65;
    spotLight.decay = 1.4;
    spotLight.distance = 750;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0004;
    tsScene.add(spotLight);
    tsScene.add(spotLight.target);

    // Subtle cool edge rim light
    rimLight = new THREE.DirectionalLight(new THREE.Color('#93c5fd'), 0.45);
    rimLight.position.set(-180, 80, -120);
    tsScene.add(rimLight);

    // 6. Build Geometry Assemblies
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
    if (!paperMesh) return;
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t));

    // Update dynamic paper canvas texture (reflecting current highlighter & signature state)
    const cv = generateTermSheetTexture(data, ct);
    if (paperMesh.material && paperMesh.material[4]) {
      const tex = paperMesh.material[4].map;
      if (tex && tex.image !== cv) {
        tex.image = cv;
        tex.needsUpdate = true;
      }
    }

    // Slow cinematic camera pan down toward signature line (0.0s to 5.0s)
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
    paperMesh = null;
    tableMesh = null;
    mapMesh = null;
    contactShadowMesh = null;
  }

  /**
   * Mounts the 3D Deal Term Sheet Stage inside the Customizer Modal
   */
  window.tplMountDealTermSheet3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #080a0f; overflow: hidden; cursor: grab; user-select: none;">
        <!-- High-res Instant Plate Backdrop -->
        <img id="term-sheet-plate-bg" src="/mahogany_desk_texture.jpg" alt="Mahogany Desk" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.35; filter: contrast(120%) brightness(75%);" />

        <!-- 3D Three.js WebGL Viewport -->
        <div id="term-sheet-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>

        <!-- Telemetry & Camera Telemetry HUD Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #facc15; background: rgba(10,12,18,0.92); border: 1px solid rgba(250,204,21,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            3D TERM SHEET RIG &bull; US LETTER 8.5"&times;11" &bull; FOUNTAIN PEN INK &bull; RUBBER STAMPS
          </span>
          <span style="font-family: monospace; font-size: 9px; color: #94a3b8; background: rgba(10,12,18,0.75); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 4px;">
            DRAG TO ORBIT
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
   * Stepper callback for hover preview loop & live customizer playback
   */
  window.stepDealTermSheetAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    const viewport = container.querySelector('#term-sheet-3d-viewport');
    if (!viewport && !tsRenderer) {
      window.initDealTermSheet3DScene(container, d);
    }
    updateAnimationStep(t, d);
  };

  /**
   * Canvas Renderer for Timeline Playback and Video Export
   */
  window.renderDealTermSheetCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    if (tsRenderer && tsRenderer.domElement && tsScene && tsCamera) {
      updateAnimationStep(t, d);
      tsRenderer.render(tsScene, tsCamera);
      ctx.drawImage(tsRenderer.domElement, 0, 0, cw, ch);
      return;
    }

    // High-resolution standalone 2D canvas blit fallback
    const cv = generateTermSheetTexture(d, t);
    // Draw mahogany desk background
    const deskImg = imageAssets.get('/mahogany_desk_texture.jpg');
    if (deskImg && deskImg.complete) {
      ctx.drawImage(deskImg, 0, 0, cw, ch);
    } else {
      ctx.fillStyle = '#1c0f0a';
      ctx.fillRect(0, 0, cw, ch);
    }

    // Draw vintage map in top left
    const mapImg = imageAssets.get('/paper_tear_stock_vintage_map.jpg');
    if (mapImg && mapImg.complete) {
      ctx.save();
      ctx.translate(cw * 0.12, ch * 0.15);
      ctx.rotate(-26 * Math.PI / 180);
      ctx.drawImage(mapImg, -cw * 0.2, -ch * 0.2, cw * 0.4, ch * 0.35);
      ctx.restore();
    }

    // Draw 3D tilted term sheet document
    ctx.save();
    ctx.translate(cw * 0.52, ch * 0.52);
    ctx.transform(1, -0.06, 0.22, 0.88, 0, 0); // 3D perspective slant
    // Soft drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 12;
    ctx.shadowOffsetY = 24;

    const docW = cw * 0.38;
    const docH = docW * (11 / 8.5);
    ctx.drawImage(cv, -docW * 0.5, -docH * 0.5, docW, docH);
    ctx.restore();
  };

  /**
   * Contextual Inspector Controls Builder for Customizer
   */
  window.tplBuildDealTermSheetInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">📜</span>
            <span style="font-size: 11px; font-weight: 800; color: #facc15; text-transform: uppercase; letter-spacing: 0.8px;">3D Deal Term Sheet Signing</span>
          </div>
          <span style="font-size: 9px; color: #facc15; font-weight: 700; background: rgba(250,204,21,0.15); border: 1px solid rgba(250,204,21,0.35); padding: 2px 6px; border-radius: 4px;">PBR THREE.JS RIG</span>
        </div>

        <!-- Section 1: Deal Valuation & Investment (Highlighter Sweeps) -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Key Deal Terms &amp; Highlighter</span>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Line 1 (Swept with Highlighter)</span>
            <input type="text" id="ts-inp-val" value="${d.valuationText || 'Valuation: $80M pre-money'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #facc15; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Line 2 (Swept with Highlighter)</span>
            <input type="text" id="ts-inp-inv" value="${d.investmentText || 'Investment: $12M for 15%'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #facc15; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Board Seats</span>
              <input type="text" id="ts-inp-board" value="${d.boardSeatsText || 'Board seats: 2 investor, 3 founder'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 6px; font-size: 9.5px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Liquidation Pref</span>
              <input type="text" id="ts-inp-liq" value="${d.liquidationPrefText || 'Liquidation pref: 1x non-participating'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 6px; font-size: 9.5px; outline: none;" />
            </div>
          </div>
        </div>

        <!-- Section 2: Fountain Pen Execution & Approval Stamps -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Ink Signature &amp; Rubber Stamps</span>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Signee Full Name / Title</span>
            <input type="text" id="ts-inp-signee" value="${d.signeeName || 'Alexander Vance'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Rubber Stamp 1</span>
              <input type="text" id="ts-inp-stamp1" value="${d.stamp1Text || 'DEAL CLOSED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Rubber Stamp 2</span>
              <input type="text" id="ts-inp-stamp2" value="${d.stamp2Text || 'APPROVED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;" />
            </div>
          </div>
        </div>

        <!-- Section 3: Studio Environment & Macro Camera -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Environment &amp; Camera Rig</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Desk Surface</span>
              <select id="ts-sel-surface" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;">
                <option value="mahogany" ${d.surfaceType === 'mahogany' ? 'selected' : ''}>Executive Mahogany</option>
                <option value="tactical_grid" ${d.surfaceType === 'tactical_grid' ? 'selected' : ''}>Dark Slate / Tactical Grid</option>
              </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Camera Rig</span>
              <select id="ts-sel-camera" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;">
                <option value="macro_cinematic" ${d.cameraPreset === 'macro_cinematic' ? 'selected' : ''}>30&deg; Macro Cinematic (Vox/Jani)</option>
                <option value="isometric_evidence" ${d.cameraPreset === 'isometric_evidence' ? 'selected' : ''}>45&deg; Forensic Isometric</option>
                <option value="top_down_dossier" ${d.cameraPreset === 'top_down_dossier' ? 'selected' : ''}>Top-Down Surveillance Dossier</option>
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
        const cur = window.tplGetContextualData(tplId) || {};
        const next = Object.assign({}, cur, patch);
        window.tplSetContextualData(tplId, next);
        window.tplUpdateStageWithContextualData(tplId, next);
      }
    }

    container.querySelector('#ts-inp-val')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ valuationText: e.target.value });
    });

    container.querySelector('#ts-inp-inv')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ investmentText: e.target.value });
    });

    container.querySelector('#ts-inp-board')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ boardSeatsText: e.target.value });
    });

    container.querySelector('#ts-inp-liq')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ liquidationPrefText: e.target.value });
    });

    container.querySelector('#ts-inp-signee')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ signeeName: e.target.value });
    });

    container.querySelector('#ts-inp-stamp1')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp1Text: e.target.value });
    });

    container.querySelector('#ts-inp-stamp2')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stamp2Text: e.target.value });
    });

    container.querySelector('#ts-sel-surface')?.addEventListener('change', (e) => {
      updateData({ surfaceType: e.target.value });
    });

    container.querySelector('#ts-sel-camera')?.addEventListener('change', (e) => {
      updateData({ cameraPreset: e.target.value });
    });

    container.querySelector('#btn-ts-reset')?.addEventListener('click', () => {
      textureCache.clear();
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  // Expose configuration globally
  window.DEAL_TERM_SHEET_CONFIG = DEFAULT_CONFIG;
  console.log('[Deal Term Sheet 3D Engine] Initialized Doc-Drama Legal Term Sheet Engine');
})();
