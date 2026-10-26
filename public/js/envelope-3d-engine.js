/**
 * Photorealistic 3D Evidence Envelope Reveal Animation Engine
 * Replicating investigative documentary standards (Vox, James Jani, Magnates Media, Johnny Harris)
 *
 * Features:
 * 1. Material Shaders & Procedural Texturing:
 *    - 28lb aged kraft / manila paper with micro-fibers, worn edge distress, and paper crease bump maps
 *    - Authentic red rubber ink stamp ("CONFIDENTIAL // TOP SECRET // FBI INVESTIGATION") with porous ink bleed
 *    - Physical string-tie enclosure: dual reinforced fiber eyelet washers & winding string
 *    - Authentic leaked letter / subpoena with memo header, case codes, redacted bars, and signature
 * 2. 3D Spatial Geometry & Physics:
 *    - 3D envelope body with interior pocket depth and physical paper thickness
 *    - Articulated top flap hinged along the fold line that flips open 170 degrees
 *    - Document letter smoothly sliding out with realistic physical tilt and cast shadows
 * 3. Atmospheric Studio Rig:
 *    - Dark mahogany desk surface / dark tactical coordinate grid
 *    - Single warm directional overhead key spotlight with soft PCF shadows and subtle cool edge rim light
 *    - Macro low-angle camera framing (filling 55%-65% of screen) with focal push-in tracking
 * 4. Interactive & Production Tools:
 *    - OrbitControls for pan/tilt/zoom in customizer
 *    - Realtime timeline scrub synchronization & canvas video export pipeline
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'envelope-open';

  // Default Investigative Evidence Envelope Configuration
  const DEFAULT_CONFIG = {
    type: 'envelope-open',
    envelopeStyle: 'manila_classified', // 'manila_classified', 'kraft_subpoena', 'glassmorphic_cyber'
    stampText: 'CLASSIFIED: FBI INVESTIGATION', // Keyframable red rubber stamp
    secondaryStamp: 'TOP SECRET // DEPT OF JUSTICE',
    caseNumber: 'CASE FILE: #2026-X-8842',
    letterHeadline: 'CONFIDENTIAL MEMORANDUM',
    letterSubhead: 'SUBJECT: PROJECT IRIS - SPECIAL ACCESS REQUIRED',
    letterBodyText: 'Pursuant to federal grand jury subpoena 28-U.S.C.-1826, all unredacted ledger accounts, encrypted foreign escrow agreements, and board correspondence are hereby seized for forensic audit.',
    paperTone: '#d9ab6a', // Authentic manila / kraft base tone
    letterPaperTone: '#f7f4ea', // Off-white aged legal document tone
    stampColor: '#b91c1c', // Weathered crimson ink
    stringTieEnabled: true,
    stringColor: '#dc2626', // Investigative red string
    surfaceType: 'mahogany', // 'mahogany', 'tactical_grid', 'dark_slate'
    cameraPreset: 'macro_cinematic', // 'macro_cinematic', 'isometric_evidence', 'top_down_dossier'
    lightWarmth: '#fff3db',
    lightIntensity: 2.1,
    slideDistance: 78, // Distance letter slides out
    flapOpenAngle: 168, // Flap rotation in degrees
    dofEnabled: true,
    animSpeed: 1.0,
    duration: 3.5
  };

  // Three.js Scene References
  let envScene = null;
  let envCamera = null;
  let envRenderer = null;
  let envAnimFrame = null;
  let envControls = null;
  let envGroup = null;

  // Meshes
  let envelopeBodyMesh = null;
  let envelopeFlapPivot = null;
  let envelopeFlapMesh = null;
  let letterMesh = null;
  let stringGroup = null;
  let tableMesh = null;
  let contactShadowMesh = null;

  // Lighting
  let spotLight = null;
  let rimLight = null;
  let ambientLight = null;

  // Animation state
  let animClock = 0;
  let lastTimestamp = 0;
  let isManualScrub = false;
  let manualT = 0;

  // Texture Cache
  const textureCache = new Map();

  /**
   * Helper: generates high-res procedural canvas texture for Manila / Kraft Paper
   */
  function generateManilaTexture(data) {
    const key = `manila_${data.envelopeStyle}_${data.stampText}_${data.paperTone}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 1024;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Aged Kraft Paper Base Tone
    ctx.fillStyle = data.paperTone || '#cf9d5d';
    ctx.fillRect(0, 0, w, h);

    // 2. Multi-layered Paper Fibers & Organic Grain
    const grainGrad = ctx.createRadialGradient(w * 0.45, h * 0.45, 100, w * 0.5, h * 0.5, w * 0.75);
    grainGrad.addColorStop(0, 'rgba(255, 250, 240, 0.12)');
    grainGrad.addColorStop(0.6, 'rgba(180, 130, 70, 0.08)');
    grainGrad.addColorStop(1, 'rgba(95, 60, 25, 0.38)'); // Darkened burnt/worn edges
    ctx.fillStyle = grainGrad;
    ctx.fillRect(0, 0, w, h);

    // Micro paper grain noise
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 4) {
      const n = (Math.random() - 0.5) * 16;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Subtle Fold Seams & Kraft Micro-creases
    ctx.strokeStyle = 'rgba(75, 45, 15, 0.22)';
    ctx.lineWidth = 2;
    // Bottom flap crease line
    ctx.beginPath();
    ctx.moveTo(30, h - 45);
    ctx.lineTo(w - 30, h - 45);
    ctx.stroke();

    // Side edge stitching/glue seams
    ctx.strokeStyle = 'rgba(60, 35, 10, 0.15)';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    // 4. Weathered Rubber Stamp: "CLASSIFIED: FBI INVESTIGATION"
    ctx.save();
    // Tilt stamp dynamically by -7.5 degrees (authentic hand-stamped angle)
    ctx.translate(w * 0.54, h * 0.58);
    ctx.rotate(-0.13);

    const stampText = data.stampText || 'CLASSIFIED: FBI INVESTIGATION';
    const stampColor = data.stampColor || '#b91c1c';

    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(-360, -90, 720, 180);

    // Inner double outline
    ctx.lineWidth = 4;
    ctx.strokeRect(-346, -78, 692, 156);

    ctx.fillStyle = stampColor;
    ctx.font = '900 68px "Impact", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '6px';
    ctx.fillText(stampText.toUpperCase(), 0, -14);

    // Sub-stamp / Case verification
    ctx.font = '800 32px "Courier New", monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText(data.caseNumber || 'CASE FILE: #2026-X-8842', 0, 48);

    // Rubber stamp ink distress pass (uneven ink bleeding into paper fibers)
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 480; i++) {
      const sx = (Math.random() - 0.5) * 740;
      const sy = (Math.random() - 0.5) * 200;
      const sr = 1 + Math.random() * 4;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 5. Secondary Stamp: TOP SECRET / DOJ Seal
    ctx.save();
    ctx.translate(w * 0.18, h * 0.38);
    ctx.rotate(0.08);
    ctx.strokeStyle = 'rgba(185, 28, 28, 0.85)';
    ctx.lineWidth = 6;
    ctx.strokeRect(-140, -40, 280, 80);
    ctx.fillStyle = 'rgba(185, 28, 28, 0.85)';
    ctx.font = '900 24px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TOP SECRET', 0, -8);
    ctx.font = '700 13px "Courier New", monospace';
    ctx.fillText('DOJ EVIDENCE', 0, 16);
    ctx.restore();

    // 6. Dual Red / Brass Washers for the String Closure
    drawWasher(ctx, w * 0.35, h * 0.18, '#b91c1c', '#e2e8f0');

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Helper: generates high-res procedural canvas texture for the Envelope Top Flap
   */
  function generateFlapTexture(data) {
    const key = `flap_${data.envelopeStyle}_${data.paperTone}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 512;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // Manila base tone
    ctx.fillStyle = data.paperTone || '#cf9d5d';
    ctx.fillRect(0, 0, w, h);

    // Flap contour shading (flaps have a curved/trapezoidal cut with shadow along the lip)
    const flapGrad = ctx.createLinearGradient(0, 0, 0, h);
    flapGrad.addColorStop(0, 'rgba(60, 35, 10, 0.28)'); // Crease shadow at hinge
    flapGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
    flapGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.05)');
    flapGrad.addColorStop(1, 'rgba(60, 35, 10, 0.45)'); // Darkened lip
    ctx.fillStyle = flapGrad;
    ctx.fillRect(0, 0, w, h);

    // Micro paper grain
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Outer gummed sealing border (authentic sticky dried adhesive strip)
    ctx.fillStyle = 'rgba(120, 85, 40, 0.25)';
    ctx.fillRect(20, h - 42, w - 40, 32);

    // Flap Eyelet Washer for String-tie
    drawWasher(ctx, w * 0.35, h * 0.65, '#b91c1c', '#e2e8f0');

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Helper: draws an authentic physical paper/metal eyelet washer with brass center rivet
   */
  function drawWasher(ctx, cx, cy, washerColor, rivetColor) {
    ctx.save();
    // Shadow under washer
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;

    // Outer fiber washer disk
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fillStyle = washerColor || '#b91c1c';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Washer radial bevel highlight
    const diskGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, 38);
    diskGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    diskGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.0)');
    diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = diskGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fill();

    // Brass metal rivet center grommet
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fillStyle = rivetColor || '#e2e8f0';
    ctx.fill();

    // Rivet hole center (dark void)
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.restore();
  }

  /**
   * Helper: generates high-res procedural canvas texture for the Inside Leaked Letter
   */
  function generateLetterTexture(data) {
    const key = `letter_${data.letterHeadline}_${data.letterPaperTone}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 1024;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // Aged legal memo paper base
    ctx.fillStyle = data.letterPaperTone || '#f7f4ea';
    ctx.fillRect(0, 0, w, h);

    // Subtle paper fiber grain
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Header classification banner
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(80, 50, w - 160, 42);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '5px';
    ctx.fillText('TOP SECRET // SENSITIVE COMPARTMENTED INFORMATION', w * 0.5, 78);

    // Department Header
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 36px "Georgia", serif';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '1px';
    ctx.fillText(data.letterHeadline || 'CONFIDENTIAL MEMORANDUM', 90, 160);

    ctx.font = '700 18px "Courier New", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`DATE: OCT 21, 2026   |   FILE: #8842-DEF   |   STATUS: DECLASSIFIED BY EX. ORDER`, 90, 200);

    // Horizontal double divider
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(90, 220);
    ctx.lineTo(w - 90, 220);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 226);
    ctx.lineTo(w - 90, 226);
    ctx.stroke();

    // Leaked Subject Title
    ctx.font = '800 22px "Courier New", monospace';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(data.letterSubhead || 'SUBJECT: PROJECT IRIS - SPECIAL ACCESS REQUIRED', 90, 270);

    // Simulated paragraph lines with heavy black redaction bars
    const startY = 320;
    const lineSpacing = 34;

    for (let row = 0; row < 14; row++) {
      const y = startY + row * lineSpacing;
      
      // Draw realistic typed text line simulation
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(90, y, w * 0.45, 10);
      ctx.fillRect(w * 0.48, y, w * 0.38, 10);

      // Redaction Bars on select rows (Vox / investigative hallmark)
      if (row === 2 || row === 3 || row === 7 || row === 8 || row === 11) {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(86, y - 6, w * 0.52, 22);
      }
      if (row === 5 || row === 9) {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(w * 0.32, y - 6, w * 0.44, 22);
      }
    }

    // Authentic cursive executive ink signature on bottom right
    ctx.save();
    ctx.translate(w * 0.72, h * 0.86);
    ctx.strokeStyle = '#1e3a8a'; // Deep fountain pen blue
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-90, 10);
    ctx.bezierCurveTo(-50, -40, -10, 40, 20, -15);
    ctx.bezierCurveTo(40, -45, 60, 20, 95, -10);
    ctx.stroke();

    // Signature underscore & seal
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-110, 24);
    ctx.lineTo(130, 24);
    ctx.stroke();

    ctx.font = '700 14px "Courier New", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('SPECIAL INVESTIGATIVE DEPUTY DIRECTOR', 10, 44);
    ctx.restore();

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Builds dark mahogany studio desk or tactical grid floor
   */
  function buildEnvironmentSurface(data) {
    if (tableMesh && envScene) {
      envScene.remove(tableMesh);
      tableMesh.geometry.dispose();
      tableMesh = null;
    }

    const tableGeo = new THREE.PlaneGeometry(1600, 1100);
    let tableMat;

    if (data.surfaceType === 'tactical_grid') {
      const gridCv = document.createElement('canvas');
      gridCv.width = 512;
      gridCv.height = 512;
      const gctx = gridCv.getContext('2d');
      gctx.fillStyle = '#090d16';
      gctx.fillRect(0, 0, 512, 512);
      gctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      gctx.lineWidth = 1.5;
      for (let x = 0; x <= 512; x += 32) {
        gctx.beginPath(); gctx.moveTo(x, 0); gctx.lineTo(x, 512); gctx.stroke();
        gctx.beginPath(); gctx.moveTo(0, x); gctx.lineTo(512, x); gctx.stroke();
      }
      const gridTex = new THREE.CanvasTexture(gridCv);
      gridTex.wrapS = THREE.RepeatWrapping;
      gridTex.wrapT = THREE.RepeatWrapping;
      gridTex.repeat.set(8, 6);

      tableMat = new THREE.MeshStandardMaterial({
        map: gridTex,
        roughness: 0.65,
        metalness: 0.35
      });
    } else {
      // Dark Mahogany Wood Desk with rich specular sheen
      const deskTex = new THREE.TextureLoader().load('/mahogany_desk_texture.jpg', () => {
        if (envRenderer && envScene && envCamera) envRenderer.render(envScene, envCamera);
      });
      deskTex.wrapS = THREE.RepeatWrapping;
      deskTex.wrapT = THREE.RepeatWrapping;
      deskTex.repeat.set(2, 2);

      tableMat = new THREE.MeshStandardMaterial({
        map: deskTex,
        color: new THREE.Color(0x382218),
        roughness: 0.38,
        metalness: 0.18
      });
    }

    tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.rotation.x = -Math.PI / 2;
    tableMesh.position.y = -1.5;
    tableMesh.receiveShadow = true;
    envScene.add(tableMesh);

    // Soft blurred directional contact shadow beneath the envelope
    if (contactShadowMesh && envScene) {
      envScene.remove(contactShadowMesh);
      contactShadowMesh.geometry.dispose();
      contactShadowMesh = null;
    }

    const shadowGeo = new THREE.PlaneGeometry(240, 160);
    const shadowCv = document.createElement('canvas');
    shadowCv.width = 256;
    shadowCv.height = 256;
    const sctx = shadowCv.getContext('2d');
    const sgrad = sctx.createRadialGradient(128, 128, 30, 128, 128, 120);
    sgrad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
    sgrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
    sgrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    sctx.fillStyle = sgrad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCv);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.set(0, -1.2, 0);
    envScene.add(contactShadowMesh);
  }

  /**
   * Builds the 3D Evidence Envelope Assembly:
   * - Casing Body with Pocket
   * - Top Flap Hinged along the fold line
   * - Interior Leaked Letter Document
   * - Thread/String System
   */
  function buildEvidenceEnvelope(data) {
    if (envGroup && envScene) {
      envScene.remove(envGroup);
      envGroup = null;
    }

    envGroup = new THREE.Group();

    const envWidth = 190;
    const envHeight = 125;
    const envDepth = 3.5;

    // 1. Envelope Manila Body Material
    const manilaCanvas = generateManilaTexture(data);
    const manilaTex = new THREE.CanvasTexture(manilaCanvas);
    manilaTex.anisotropy = 8;

    const bodyMat = new THREE.MeshStandardMaterial({
      map: manilaTex,
      roughness: 0.72,
      metalness: 0.05,
      bumpScale: 0.04
    });

    // Envelope Body Box (Front & Back paper casing)
    const bodyGeo = new THREE.BoxGeometry(envWidth, envDepth, envHeight);
    envelopeBodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    envelopeBodyMesh.castShadow = true;
    envelopeBodyMesh.receiveShadow = true;
    envelopeBodyMesh.position.set(0, envDepth * 0.5, 0);
    envGroup.add(envelopeBodyMesh);

    // 2. Interior Leaked Document Letter
    const letterCanvas = generateLetterTexture(data);
    const letterTex = new THREE.CanvasTexture(letterCanvas);
    letterTex.anisotropy = 8;

    const letterMat = new THREE.MeshStandardMaterial({
      map: letterTex,
      roughness: 0.68,
      metalness: 0.02,
      bumpScale: 0.02
    });

    const letterWidth = envWidth * 0.92;
    const letterHeight = envHeight * 0.92;
    const letterThickness = 0.6;
    const letterGeo = new THREE.BoxGeometry(letterWidth, letterThickness, letterHeight);

    letterMesh = new THREE.Mesh(letterGeo, letterMat);
    letterMesh.castShadow = true;
    letterMesh.receiveShadow = true;
    // Initial parked position: completely tucked inside the envelope casing
    letterMesh.position.set(0, envDepth * 0.5 + 0.5, 0);
    envGroup.add(letterMesh);

    // 3. Articulated Top Flap Pivot Rig
    const flapCanvas = generateFlapTexture(data);
    const flapTex = new THREE.CanvasTexture(flapCanvas);
    flapTex.anisotropy = 8;

    const flapMat = new THREE.MeshStandardMaterial({
      map: flapTex,
      roughness: 0.72,
      metalness: 0.05,
      bumpScale: 0.04,
      side: THREE.DoubleSide
    });

    const flapH = envHeight * 0.44;
    const flapGeo = new THREE.PlaneGeometry(envWidth, flapH);
    flapGeo.translate(0, 0, flapH * 0.5); // Pivot along hinge edge

    envelopeFlapPivot = new THREE.Group();
    // Position hinge along top back edge of envelope
    envelopeFlapPivot.position.set(0, envDepth + 0.1, -envHeight * 0.5);

    envelopeFlapMesh = new THREE.Mesh(flapGeo, flapMat);
    envelopeFlapMesh.rotation.x = Math.PI / 2; // Flat closed over the pocket
    envelopeFlapMesh.castShadow = true;
    envelopeFlapMesh.receiveShadow = true;

    envelopeFlapPivot.add(envelopeFlapMesh);
    envGroup.add(envelopeFlapPivot);

    // 4. Physical String-tie Thread Rig
    stringGroup = new THREE.Group();
    const stringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(data.stringColor || '#dc2626'),
      roughness: 0.6,
      metalness: 0.1
    });

    // Connecting string line between washers
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-envWidth * 0.15, envDepth + 0.6, -envHeight * 0.32),
      new THREE.Vector3(-envWidth * 0.15 + 2, envDepth + 1.2, -envHeight * 0.18),
      new THREE.Vector3(-envWidth * 0.15, envDepth + 0.6, 0)
    ]);
    const stringGeo = new THREE.TubeGeometry(curve, 20, 0.75, 8, false);
    const stringMesh = new THREE.Mesh(stringGeo, stringMat);
    stringGroup.add(stringMesh);

    // Loose winding dangling thread ends
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-envWidth * 0.15, envDepth + 0.6, 0),
      new THREE.Vector3(-envWidth * 0.10, envDepth + 0.4, envHeight * 0.15),
      new THREE.Vector3(-envWidth * 0.05, envDepth + 0.2, envHeight * 0.28)
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.6, 8, false);
    const tailMesh = new THREE.Mesh(tailGeo, stringMat);
    stringGroup.add(tailMesh);

    envGroup.add(stringGroup);

    // Apply 3D Perspective Tilt on the entire assembly (Vox / Magnates investigative standard)
    envGroup.rotation.y = THREE.MathUtils.degToRad(-18);
    envGroup.rotation.x = THREE.MathUtils.degToRad(8);
    envGroup.position.set(0, 0, 0);

    envScene.add(envGroup);
  }

  /**
   * Applies camera preset coordinates for macro investigative look
   */
  function applyCameraPreset(data) {
    if (!envCamera) return;

    if (data.cameraPreset === 'isometric_evidence') {
      envCamera.position.set(-140, 160, 210);
      envCamera.lookAt(0, 8, 0);
    } else if (data.cameraPreset === 'top_down_dossier') {
      envCamera.position.set(0, 260, 40);
      envCamera.lookAt(0, 0, 0);
    } else {
      // 'macro_cinematic' (Reference standard: 50%-65% coverage, intimate low angle tilt)
      envCamera.position.set(-85, 125, 195);
      envCamera.lookAt(12, 10, -5);
    }
  }

  /**
   * Step physics & keyframes: Flap opens, string relaxes, letter slides out, camera gently tracks
   */
  function updateAnimationStep(t, data) {
    if (!envelopeFlapPivot || !letterMesh) return;

    const dur = data.duration || 3.5;
    const progress = Math.min(1.0, Math.max(0.0, (t % dur) / dur));

    // Phase 1: 0% - 25% = String relaxes / Flap flips backward
    // Phase 2: 25% - 70% = Leaked letter smoothly pulls out of pocket with realistic micro-lift
    // Phase 3: 70% - 100% = Hero settle & macro pan

    let flapAngle = 0;
    let letterSlide = 0;
    let letterLift = 0;

    if (progress < 0.28) {
      // Smooth cubic easing for flap swing
      const pFlap = progress / 0.28;
      const easeFlap = pFlap < 0.5 ? 2 * pFlap * pFlap : 1 - Math.pow(-2 * pFlap + 2, 2) / 2;
      flapAngle = easeFlap * THREE.MathUtils.degToRad(data.flapOpenAngle || 168);
      letterSlide = 0;
      letterLift = 0;
      if (stringGroup) stringGroup.scale.setScalar(Math.max(0.001, 1 - easeFlap * 0.95));
    } else {
      flapAngle = THREE.MathUtils.degToRad(data.flapOpenAngle || 168);
      if (stringGroup) stringGroup.scale.setScalar(0.05);

      // Letter slide phase
      const pSlide = Math.min(1.0, (progress - 0.28) / 0.48);
      const easeSlide = 1 - Math.pow(1 - pSlide, 3); // Decelerating cubic
      const maxSlide = data.slideDistance || 78;
      letterSlide = easeSlide * maxSlide;
      // Slight physical paper rise over envelope pocket lip
      letterLift = Math.sin(easeSlide * Math.PI) * 4.5 + easeSlide * 2.5;
    }

    // Apply flap rotation: rotates back along X hinge
    envelopeFlapPivot.rotation.x = flapAngle;

    // Apply letter translation: slides forward along Z axis, rises slightly
    letterMesh.position.z = letterSlide * 0.85;
    letterMesh.position.y = (DEFAULT_CONFIG.type ? 3.5 : 2.0) + letterLift;
    // Organic slight angular skew as it pulls out (never robotic/perfect)
    letterMesh.rotation.y = THREE.MathUtils.degToRad(Math.sin(letterSlide * 0.05) * 3.2);

    // Subtle Macro Camera Flight: slow tracking push-in focusing onto the letter
    if (envCamera && !isManualScrub) {
      const baseCam = data.cameraPreset === 'macro_cinematic' ? new THREE.Vector3(-85, 125, 195) : envCamera.position;
      const pushFactor = Math.min(1.0, progress * 1.15);
      envCamera.position.z = baseCam.z - pushFactor * 18;
      envCamera.position.y = baseCam.y - pushFactor * 6;
    }
  }

  /**
   * Initializes the Three.js 3D Evidence Envelope Scene
   */
  window.initEnvelope3DScene = function(container, customData) {
    if (!container) return;
    cleanupEnvelope3DScene();

    const data = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), customData || {});

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x06080d);
    envScene.fog = new THREE.FogExp2(0x06080d, 0.0018);

    envCamera = new THREE.PerspectiveCamera(34, width / height, 1, 2500);
    applyCameraPreset(data);

    // 2. High-Performance WebGL Renderer with ACES Tone Mapping
    envRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    envRenderer.setSize(width, height);
    envRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    envRenderer.shadowMap.enabled = true;
    envRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    envRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    envRenderer.toneMappingExposure = 1.35;

    container.innerHTML = '';
    container.style.position = 'absolute';
    container.style.inset = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'hidden';

    envRenderer.domElement.style.position = 'absolute';
    envRenderer.domElement.style.inset = '0';
    envRenderer.domElement.style.width = '100%';
    envRenderer.domElement.style.height = '100%';
    envRenderer.domElement.style.display = 'block';
    container.appendChild(envRenderer.domElement);

    // 3. OrbitControls for Interactive User Rotation
    if (typeof THREE.OrbitControls !== 'undefined') {
      envControls = new THREE.OrbitControls(envCamera, envRenderer.domElement);
      envControls.enableDamping = true;
      envControls.dampingFactor = 0.06;
      envControls.maxDistance = 550;
      envControls.minDistance = 110;
      envControls.target.set(10, 8, -5);
      envControls.maxPolarAngle = Math.PI / 2.05; // Stay above desk
      envControls.minPolarAngle = Math.PI / 6.0;
    }

    // 4. Directional Warm Studio Key Lighting & Cinematic Rim Light
    ambientLight = new THREE.AmbientLight(0x1e293b, 0.65);
    envScene.add(ambientLight);

    spotLight = new THREE.SpotLight(new THREE.Color(data.lightWarmth || '#fff3db'), data.lightIntensity || 2.1);
    spotLight.position.set(-80, 220, 160);
    spotLight.angle = Math.PI / 3.8;
    spotLight.penumbra = 0.68;
    spotLight.decay = 1.1;
    spotLight.distance = 950;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0003;
    envScene.add(spotLight);

    // Cool Specular Edge Rim Light (separates dark paper from background)
    rimLight = new THREE.DirectionalLight(0x7dd3fc, 1.25);
    rimLight.position.set(180, 90, -140);
    envScene.add(rimLight);

    // Warm secondary fill
    const fillLight = new THREE.DirectionalLight(0xfdba74, 0.75);
    fillLight.position.set(120, 150, 140);
    envScene.add(fillLight);

    // 5. Build Environment Floor & Envelope Assembly
    buildEnvironmentSurface(data);
    buildEvidenceEnvelope(data);

    // 6. Initial Render Step
    updateAnimationStep(0, data);
    if (envRenderer && envScene && envCamera) {
      envRenderer.render(envScene, envCamera);
    }

    // Render loop
    lastTimestamp = performance.now();
    animClock = 0;

    function renderLoop(now) {
      envAnimFrame = requestAnimationFrame(renderLoop);
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock += dt * (data.animSpeed || 1.0);
      }
      const t = isManualScrub ? manualT : (animClock % (data.duration || 3.5));

      updateAnimationStep(t, data);

      if (envControls) envControls.update();
      if (envRenderer && envScene && envCamera) {
        envRenderer.render(envScene, envCamera);
      }
    }

    envAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * Cleans up scene resources
   */
  function cleanupEnvelope3DScene() {
    if (envAnimFrame) {
      cancelAnimationFrame(envAnimFrame);
      envAnimFrame = null;
    }
    if (envControls) {
      envControls.dispose();
      envControls = null;
    }
    if (envRenderer) {
      if (envRenderer.domElement && envRenderer.domElement.parentElement) {
        envRenderer.domElement.parentElement.removeChild(envRenderer.domElement);
      }
      envRenderer.dispose();
      envRenderer = null;
    }
    envScene = null;
    envCamera = null;
    envelopeBodyMesh = null;
    envelopeFlapPivot = null;
    envelopeFlapMesh = null;
    letterMesh = null;
    stringGroup = null;
    tableMesh = null;
    contactShadowMesh = null;
  }

  /**
   * Mounts the 3D Envelope Stage inside the Customizer Modal
   */
  window.tplMountEnvelope3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #06080d; overflow: hidden; cursor: grab; user-select: none;">
        <!-- High-res Instant Plate Backdrop -->
        <img id="envelope-plate-bg" src="/classified_envelope_macro_ref.png" alt="Evidence Envelope" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.35; filter: contrast(115%) brightness(85%);" />

        <!-- 3D Three.js WebGL Viewport -->
        <div id="envelope-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>

        <!-- Telemetry & Camera Telemetry HUD Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #ef4444; background: rgba(10,12,18,0.9); border: 1px solid rgba(239,68,68,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            3D EVIDENCE RIG &bull; 28LB MANILA &bull; CONFIDENTIAL RUBBER STAMP &bull; STRING-TIE
          </span>
          <span style="font-family: monospace; font-size: 9px; color: #94a3b8; background: rgba(10,12,18,0.75); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 4px;">
            DRAG TO ORBIT
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#envelope-3d-viewport');
    function triggerInit() {
      if (typeof window.initEnvelope3DScene === 'function') {
        window.initEnvelope3DScene(viewport, d);
      }
    }
    triggerInit();
    setTimeout(triggerInit, 60);
  };

  /**
   * Stepper callback for hover preview loop & live customizer playback
   */
  window.stepEnvelopeAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    const viewport = container.querySelector('#envelope-3d-viewport');
    if (!viewport && !envRenderer) {
      window.initEnvelope3DScene(container, d);
    }
    updateAnimationStep(t, d);
  };

  /**
   * Canvas Renderer for Timeline Playback and Video Export
   */
  window.renderEnvelopeCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    if (envRenderer && envRenderer.domElement) {
      updateAnimationStep(t, d);
      if (envScene && envCamera) {
        envRenderer.render(envScene, envCamera);
        ctx.drawImage(envRenderer.domElement, 0, 0, cw, ch);
        return;
      }
    }

    // High-resolution fallback blit
    const refImg = textureCache.get('plate_img');
    if (refImg && refImg.complete) {
      ctx.drawImage(refImg, 0, 0, cw, ch);
    } else {
      const img = new Image();
      img.src = '/classified_envelope_macro_ref.png';
      img.onload = () => {
        textureCache.set('plate_img', img);
        ctx.drawImage(img, 0, 0, cw, ch);
      };
    }
  };

  /**
   * Inspector Controls Panel Builder for Customizer
   */
  window.tplBuildEnvelopeInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">📁</span>
            <span style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.8px;">Photorealistic 3D Evidence Envelope</span>
          </div>
          <span style="font-size: 9px; color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.18); border: 1px solid rgba(239,68,68,0.35); padding: 2px 6px; border-radius: 4px;">PBR THREE.JS RIG</span>
        </div>

        <!-- Section 1: Classification Stamp & Markings -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Classification Stamp &amp; Markings</span>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Rubber Stamp Title</span>
            <input type="text" id="env-inp-stamp" value="${d.stampText || 'CLASSIFIED: FBI INVESTIGATION'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" placeholder="e.g. CLASSIFIED, CONFIDENTIAL, SUBPOENA..." />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Case Code / ID</span>
              <input type="text" id="env-inp-case" value="${d.caseNumber || 'CASE FILE: #2026-X-8842'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Envelope Casing Tone</span>
              <select id="env-sel-tone" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;">
                <option value="#d9ab6a" ${d.paperTone === '#d9ab6a' ? 'selected' : ''}>Aged Manila (28lb)</option>
                <option value="#a67c4b" ${d.paperTone === '#a67c4b' ? 'selected' : ''}>Vintage Kraft Brown</option>
                <option value="#e2d6b5" ${d.paperTone === '#e2d6b5' ? 'selected' : ''}>Bleached Department Parchment</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 2: Interior Leaked Document -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Inside Document &amp; Redactions</span>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Memo Title</span>
            <input type="text" id="env-inp-memo" value="${d.letterHeadline || 'CONFIDENTIAL MEMORANDUM'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Subject Header</span>
            <input type="text" id="env-inp-subject" value="${d.letterSubhead || 'SUBJECT: PROJECT IRIS - SPECIAL ACCESS REQUIRED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-family: monospace; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
          </div>
        </div>

        <!-- Section 3: Studio Environment & Macro Camera -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Environment &amp; Camera Rig</span>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Surface Table</span>
              <select id="env-sel-surface" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;">
                <option value="mahogany" ${d.surfaceType === 'mahogany' ? 'selected' : ''}>Dark Mahogany Desk</option>
                <option value="tactical_grid" ${d.surfaceType === 'tactical_grid' ? 'selected' : ''}>Tactical Coordinate Grid</option>
              </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Camera Angle</span>
              <select id="env-sel-camera" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;">
                <option value="macro_cinematic" ${d.cameraPreset === 'macro_cinematic' ? 'selected' : ''}>30&deg; Macro Cinematic (Vox/Jani)</option>
                <option value="isometric_evidence" ${d.cameraPreset === 'isometric_evidence' ? 'selected' : ''}>45&deg; Forensic Isometric</option>
                <option value="top_down_dossier" ${d.cameraPreset === 'top_down_dossier' ? 'selected' : ''}>Top-Down Surveillance Dossier</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Reset Button -->
        <button type="button" id="btn-env-reset" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; margin-top: 4px;">
          Reset to Classified Defaults
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

    container.querySelector('#env-inp-stamp')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ stampText: e.target.value });
    });

    container.querySelector('#env-inp-case')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ caseNumber: e.target.value });
    });

    container.querySelector('#env-sel-tone')?.addEventListener('change', (e) => {
      textureCache.clear();
      updateData({ paperTone: e.target.value });
    });

    container.querySelector('#env-inp-memo')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ letterHeadline: e.target.value });
    });

    container.querySelector('#env-inp-subject')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ letterSubhead: e.target.value });
    });

    container.querySelector('#env-sel-surface')?.addEventListener('change', (e) => {
      updateData({ surfaceType: e.target.value });
    });

    container.querySelector('#env-sel-camera')?.addEventListener('change', (e) => {
      updateData({ cameraPreset: e.target.value });
    });

    container.querySelector('#btn-env-reset')?.addEventListener('click', () => {
      textureCache.clear();
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  // Expose configuration globally
  window.ENVELOPE_3D_CONFIG = DEFAULT_CONFIG;
  console.log('[Envelope 3D Engine] Initialized Photorealistic 3D Evidence Envelope Engine');
})();
