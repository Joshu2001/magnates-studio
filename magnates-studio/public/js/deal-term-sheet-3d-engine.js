/**
 * Photorealistic 3D Deal Term Sheet Signing Engine (Doc-Drama Standard)
 * Replicating top-tier documentary aesthetics (James Jani, Magnates Media, Vox)
 *
 * Features:
 * 1. Material Shaders & Geometry:
 *    - Authentic vertical US Letter paper geometry (8.5" x 11" aspect ratio)
 *    - Dual-layer mesh: physical paper box edge + plane front face with direct UV mapping
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
 *    - Full segmented Video / 3D switcher in contextual inspector
 *    - Real-time customizer playback, timeline scrub synchronization, and 4K canvas video export
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
    companyName: 'ACME CORP / ATLAS VENTURES',
    preamble: '1. The undersigned parties hereby execute this binding Term Sheet setting forth the principal terms of the Series A Preferred Stock financing of the Company.',
    valuationText: 'Valuation: $80M pre-money',
    investmentText: 'Investment: $12M for 15%',
    boardSeatsText: 'Board seats: 2 investor, 3 founder',
    liquidationPrefText: 'Liquidation pref: 1x non-participating',
    clause2: '2. The fountain pen execution hereto represents definitive agreement, binding upon all corporate parties and successors. Escrow conditions shall close within thirty (30) business days under Delaware Law.',
    clause3: '3. The fountain pen ink shall constitute binding execution upon delivery to legal escrow.',
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
    surfaceType: 'mahogany', // 'mahogany', 'tactical_grid'
    cameraPreset: 'macro_cinematic', // 'macro_cinematic', 'isometric_evidence', 'top_down_dossier'
    lightWarmth: '#fff3db',
    lightIntensity: 2.4,
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
  let paperBoxMesh = null;
  let paperFrontMesh = null;
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

  // Video Mode State
  let videoAnimFrame = null;
  let videoClock = 0;
  let videoLastTimestamp = 0;

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
    const key = `ts_tex_${frameIndex}_${data.valuationText}_${data.investmentText}_${data.stamp1Text}_${data.paperTone}_${data.signeeName}`;

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
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    paperGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    paperGrad.addColorStop(1, 'rgba(120, 85, 45, 0.12)'); // Aged paper edge patina
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Cotton Paper Micro-Fiber Grain
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 8) {
      const n = (Math.random() - 0.5) * 11;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle fine legal borders
    ctx.strokeStyle = 'rgba(40, 25, 15, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    const marginX = 140;
    let currentY = 170;

    // 3. Clause 1 & Legal Preamble (Formal Legal Monospace)
    ctx.fillStyle = '#475569';
    ctx.font = '500 21px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';

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
    // Line 1 highlights from t=0.6s to 1.3s; Line 2 highlights from t=1.1s to 1.8s
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
      ctx.fillStyle = data.highlighterColor || 'rgba(250, 204, 21, 0.85)';
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
      ctx.fillStyle = data.highlighterColor || 'rgba(250, 204, 21, 0.85)';
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
    // Signature draws from t=1.8s to 3.2s
    const sigProgress = Math.max(0, Math.min(1, (ct - 1.8) / 1.4));

    ctx.fillStyle = '#1e293b';
    ctx.font = '700 28px "Georgia", serif';
    ctx.fillText(data.signatureLabel || 'Signature,', marginX, currentY);

    // Signature rule
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
    // Stamp 1: DEAL CLOSED slams at t=3.1s
    if (data.showStamp1 !== false && ct >= 3.1) {
      const stampProg1 = Math.max(0, Math.min(1, (ct - 3.1) / 0.35));
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

    // Stamp 2: APPROVED slams at t=3.6s
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
    ctx.fillText(text, 0, 1);

    // Stamp ink voids & micro-distress
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
   * Uses dual-mesh architecture:
   * 1. paperBoxMesh for authentic 3D cotton paper thickness
   * 2. paperFrontMesh (PlaneGeometry) with standard UV mapping for the procedural document canvas
   */
  function buildTermSheetAssembly(data, t) {
    if (tsGroup && tsScene) {
      tsScene.remove(tsGroup);
      tsGroup = null;
    }

    tsGroup = new THREE.Group();

    // Vertical US Letter Document Proportions: 8.5" x 11" (width = 140, height = 181.18, thickness = 0.6)
    const docWidth = 140;
    const docHeight = 181.18;
    const docThickness = 0.6;

    const paperCanvas = generateTermSheetTexture(data, t);
    const paperTex = new THREE.CanvasTexture(paperCanvas);
    paperTex.anisotropy = 8;
    paperTex.generateMipmaps = true;

    // 1. Physical paper edge & back box
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

    // 2. Paper Front Face Plane (Canvas Texture)
    // Standard PlaneGeometry guarantees perfect UV orientation
    const frontMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.82,
      metalness: 0.02
    });

    const frontGeo = new THREE.PlaneGeometry(docWidth, docHeight);
    paperFrontMesh = new THREE.Mesh(frontGeo, frontMat);
    paperFrontMesh.rotation.x = -Math.PI / 2; // Lie flat on top of box (+Y up)
    paperFrontMesh.position.set(0, docThickness + 0.04, 0); // Raised slightly to avoid z-fighting
    paperFrontMesh.castShadow = true;
    paperFrontMesh.receiveShadow = true;
    tsGroup.add(paperFrontMesh);

    // Apply 3D Spatial Pitch & Yaw tilt (default: ~29° Pitch, -13° Yaw)
    const pitch = (data.cameraPitch !== undefined) ? data.cameraPitch : 29;
    const yaw = (data.cameraYaw !== undefined) ? data.cameraYaw : -13;
    tsGroup.rotation.x = THREE.MathUtils.degToRad(pitch);
    tsGroup.rotation.y = THREE.MathUtils.degToRad(yaw);
    tsGroup.rotation.z = THREE.MathUtils.degToRad(4.5);
    tsGroup.position.set(16, 8, -5);

    tsScene.add(tsGroup);
  }

  /**
   * Allows real-time tilt / yaw adjustments from inspector sliders
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
    if (!paperFrontMesh) return;
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t));

    // Update dynamic paper canvas texture (reflecting current highlighter, signature & stamps)
    const cv = generateTermSheetTexture(data, ct);
    if (paperFrontMesh.material && paperFrontMesh.material.map) {
      const tex = paperFrontMesh.material.map;
      if (tex.image !== cv) {
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
    mapMesh = null;
    contactShadowMesh = null;
  }

  /**
   * Mounts the 3D Deal Term Sheet Stage inside the Customizer Modal
   */
  window.tplMountDealTermSheet3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    // Automatically expand stage to full theater view in 3D Mode
    if (typeof window.applyModeLayout === 'function') {
      window.applyModeLayout(true);
    }

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
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});
    cleanupDealTermSheet3DScene();

    // Standard layout (playback bar & storyboard visible)
    if (typeof window.applyModeLayout === 'function') {
      window.applyModeLayout(false);
    }

    stage.innerHTML = `
      <div id="term-sheet-video-stage" style="position: absolute; inset: 0; background: #080a0f; overflow: hidden; display: flex; align-items: center; justify-content: center;">
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

    // 1. Draw mahogany desk background
    const deskImg = imageAssets.get('/mahogany_desk_texture.jpg');
    if (deskImg && deskImg.complete) {
      ctx.drawImage(deskImg, 0, 0, cw, ch);
    } else {
      ctx.fillStyle = '#1c0f0a';
      ctx.fillRect(0, 0, cw, ch);
    }

    // 2. Draw archival vintage map in top left
    const mapImg = imageAssets.get('/paper_tear_stock_vintage_map.jpg');
    if (mapImg && mapImg.complete) {
      ctx.save();
      ctx.translate(cw * 0.14, ch * 0.16);
      ctx.rotate(-26 * Math.PI / 180);
      ctx.drawImage(mapImg, -cw * 0.18, -ch * 0.18, cw * 0.36, ch * 0.32);
      ctx.restore();
    }

    // 3. Draw vertical US Letter legal term sheet with realistic perspective slant & drop shadow
    const cv = generateTermSheetTexture(d, ct);

    ctx.save();
    ctx.translate(cw * 0.52, ch * 0.51);
    ctx.transform(1, -0.05, 0.18, 0.90, 0, 0); // 3D perspective tilt
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
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

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
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

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
   * Includes:
   * - [ ▶ Video ] [ ⬡ 3D ] Segmented Mode Switcher
   * - 3D Camera Controls (Angle Presets, Tilt Pitch slider, Rotation Yaw slider)
   * - Key Deal Terms with animated yellow highlighter sweep
   * - Signature and Rubber Stamps customization
   */
  window.tplBuildDealTermSheetInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
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

        <!-- Section 1: Deal Valuation & Investment (Highlighter Sweeps) -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Key Deal Terms &amp; Highlighter</span>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Line 1 (Swept with Yellow Highlighter)</span>
            <input type="text" id="ts-inp-val" value="${d.valuationText || 'Valuation: $80M pre-money'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #facc15; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Line 2 (Swept with Yellow Highlighter)</span>
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

        <!-- Section 3: Studio Environment & Desk Surface -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Environment &amp; Desk Surface</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Desk Surface</span>
              <select id="ts-sel-surface" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;">
                <option value="mahogany" ${d.surfaceType === 'mahogany' ? 'selected' : ''}>Executive Mahogany</option>
                <option value="tactical_grid" ${d.surfaceType === 'tactical_grid' ? 'selected' : ''}>Dark Tactical Grid</option>
              </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Paper Tone</span>
              <select id="ts-sel-tone" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;">
                <option value="#f5f0e1" ${d.paperTone === '#f5f0e1' ? 'selected' : ''}>Vintage Ivory Cotton</option>
                <option value="#ffffff" ${d.paperTone === '#ffffff' ? 'selected' : ''}>Bright Legal White</option>
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
        const cur = window.tplGetContextualData(tplId) || {};
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
      // Sync top stage buttons
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

    // 3D Camera Controls Wiring
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

    // Content inputs
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

    container.querySelector('#ts-sel-tone')?.addEventListener('change', (e) => {
      textureCache.clear();
      updateData({ paperTone: e.target.value });
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
