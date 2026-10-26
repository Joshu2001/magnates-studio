/**
 * James Jani FTX 3D Kinetic Logo Builder & Shockwave Reveal Engine
 * Replicating the iconic intro from James Jani's famous FTX documentary ("FTX - The $32 Billion Fraud")
 *
 * Implements:
 * 1. 3D Geometric Deconstruction:
 *    - 4 discrete 3D beveled blocks forming the FTX emblem:
 *      * Top Cyan Bar (horizontal slab)
 *      * Middle Cyan Bar (horizontal slab)
 *      * Left Cyan Anchor Block (square)
 *      * Bottom White Accent Block (signature glowing white square)
 *    - 3D Extruded Typography ("FTX") and glowing neon cinematic subtitle ("THE GREAT FRAUD")
 * 2. Signature 5-Phase Choreography:
 *    - Phase 1 (0.0s - 1.8s): The Tumble & Drift (Large slab rolling on itself into depth, smaller cubes drifting right to left)
 *    - Phase 2 (1.8s - 2.4s): The Charge, Flare & Sudden Dim (Emission spikes to high intensity, then abruptly dims)
 *    - Phase 3 (2.4s - 4.0s): The Wavy Boom (Shockwave explosion + wavy sine oscillation through companion cubes + 360° axial spin)
 *    - Phase 4 (4.0s - 5.6s): Magnetic Convergence (Blocks snap into lockup + "FTX" letters slam into place + specular flare)
 *    - Phase 5 (5.6s - 7.0s+): Hero Hold (Cinematic camera drift, reflective dark void, floating dust motes)
 * 3. Interactive WebGL Viewport & 2D Canvas Fallback:
 *    - Drag to Orbit / Wheel to Zoom (OrbitControls)
 *    - Contextual Inspector with live text, color pickers, boom intensity, and wave distortion sliders
 *    - Full timeline scrubbing and offline video export rendering
 */
(function() {
  'use strict';

  const TEMPLATE_ID = 'jani-ftx-logo-reveal';

  const DEFAULT_CONFIG = {
    // Branding & Typography
    brandName: 'FTX',
    subtitleText: 'THE GREAT FRAUD',
    subtitleVisible: true,
    fontSize: 56,
    subtitleFontSize: 20,

    // Color Palette
    primaryColor: '#00f0ff',     // Electric Cyan (Top/Mid/Left blocks, rim lighting)
    secondaryColor: '#ffffff',   // Pure White (Bottom accent block, FTX letters)
    metalColor: '#0d1520',       // Dark beveled titanium edges
    boomColor: '#38bdf8',        // Shockwave aura color
    backgroundColor: '#030710',  // Deep void

    // Physics & Timing
    duration: 7.0,
    boomTime: 2.3,               // Seconds into sequence when the shockwave explodes
    boomIntensity: 1.6,          // Scale/velocity of the shockwave
    waveDistortion: 1.25,        // Amplitude of the wavy reaction on companion cubes
    waveFrequency: 14.0,         // Frequency of the sine-wave wobble
    spinSpeed: 1.2,              // Rolling / tumble rotational velocity
    bloomGlow: 2.2,              // Emissive peak multiplier

    // Atmosphere & Environment
    cameraDistance: 450,
    floorReflections: true,
    dustEnabled: true,
    dustCount: 75,
    vignetteIntensity: 0.78,
    shakeEnabled: true
  };

  // State
  let ftxScene = null;
  let ftxCamera = null;
  let ftxRenderer = null;
  let ftxAnimFrame = null;
  let ftxControls = null;
  let ftxGroup = null;

  // Meshes
  let pieceTop = null;
  let pieceMid = null;
  let pieceLeft = null;
  let pieceBottom = null;
  let textGroup = null;
  let subtitleMesh = null;
  let shockwaveMesh = null;
  let shockwaveMesh2 = null;
  let floorMesh = null;
  let dustParticles = null;
  let dustPositions = null;
  let dustVelocities = null;

  // Lights
  let boomLight = null;
  let cyanLight = null;
  let whiteLight = null;
  let ambientLight = null;

  // Offscreen rendering / texture cache
  const textureCache = new Map();
  let manualT = 0;
  let isManualScrub = false;
  let animClock = 0;
  let lastTimestamp = 0;

  // Helper Easing
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
  }
  function easeInOutCubic(t) {
    t = Math.max(0, Math.min(1, t));
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function easeOutBack(t, b = 1.70158) {
    t = Math.max(0, Math.min(1, t)) - 1;
    return t * t * ((b + 1) * t + b) + 1;
  }

  /**
   * Generates a beveled slab with contrasting face and metallic sides
   */
  function createBeveledBlock(w, h, d, faceColor, bevelColor, emissiveColor) {
    const group = new THREE.Group();

    // Main body (dark beveled metallic chassis)
    const bodyGeo = new THREE.BoxGeometry(w, h, d);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bevelColor || '#0a101d'),
      roughness: 0.35,
      metalness: 0.85,
      envMapIntensity: 1.0
    });

    // Glowing front face
    const pad = 1.2;
    const faceGeo = new THREE.PlaneGeometry(w - pad * 2, h - pad * 2);
    const faceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(faceColor),
      emissive: new THREE.Color(emissiveColor || faceColor),
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.1
    });

    // Back face (matte)
    const backGeo = new THREE.PlaneGeometry(w - pad * 2, h - pad * 2);
    const backMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bevelColor || '#0a101d'),
      roughness: 0.8,
      metalness: 0.5
    });

    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = d * 0.5 + 0.15;
    group.add(faceMesh);

    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -d * 0.5 - 0.15;
    backMesh.rotation.y = Math.PI;
    group.add(backMesh);

    // Glowing edge wireframe rim for extra cinematic punch
    const edges = new THREE.EdgesGeometry(faceGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(faceColor),
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });
    const edgeLine = new THREE.LineSegments(edges, edgeMat);
    edgeLine.position.z = d * 0.5 + 0.25;
    group.add(edgeLine);

    group.userData = {
      bodyMat,
      faceMat,
      edgeMat,
      baseW: w, baseH: h, baseD: d,
      faceColor,
      emissiveColor: emissiveColor || faceColor
    };

    return group;
  }

  /**
   * Generates Shockwave Ripple Wave Texture
   */
  function generateShockwaveTexture(color) {
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 512;
    const ctx = cv.getContext('2d');
    const cx = 256, cy = 256;

    const grad = ctx.createRadialGradient(cx, cy, 140, cx, cy, 250);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.75, color || '#00f0ff');
    grad.addColorStop(0.88, '#ffffff');
    grad.addColorStop(0.95, color || '#00f0ff');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 254, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(cv);
  }

  /**
   * Generates Cinematic Subtitle Texture ("THE GREAT FRAUD")
   */
  function generateSubtitleTexture(text, color) {
    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 160;
    const ctx = cv.getContext('2d');

    ctx.clearRect(0, 0, cv.width, cv.height);

    // Glowing subtitle typography
    ctx.font = '900 48px "Inter", "Segoe UI", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '14px';

    // Ambient drop glow
    ctx.shadowColor = color || '#00f0ff';
    ctx.shadowBlur = 24;
    ctx.fillStyle = color || '#00f0ff';
    ctx.fillText(text || 'THE GREAT FRAUD', cv.width / 2, cv.height / 2);

    // Crisp core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text || 'THE GREAT FRAUD', cv.width / 2, cv.height / 2);

    const tex = new THREE.CanvasTexture(cv);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Build 3D Extruded Letters "FTX"
   */
  function buildLettersMesh(textStr, font, data) {
    const group = new THREE.Group();
    const str = (textStr || 'FTX').trim();

    if (font) {
      // True 3D Extruded Helvetiker Bold
      const textGeo = new THREE.TextGeometry(str, {
        font: font,
        size: 58,
        height: 24,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 3.5,
        bevelSize: 2.2,
        bevelOffset: 0,
        bevelSegments: 4
      });
      textGeo.computeBoundingBox();
      textGeo.center();

      const frontMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.secondaryColor || '#ffffff'),
        emissive: new THREE.Color(data.secondaryColor || '#ffffff'),
        emissiveIntensity: 0.45,
        roughness: 0.18,
        metalness: 0.8
      });
      const sideMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0f172a'),
        roughness: 0.4,
        metalness: 0.9
      });

      const mesh = new THREE.Mesh(textGeo, [frontMat, sideMat]);
      mesh.castShadow = true;
      group.add(mesh);
    } else {
      // High-precision geometric fallback for "FTX"
      // F
      const fGroup = new THREE.Group();
      const fVert = new THREE.Mesh(new THREE.BoxGeometry(18, 70, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }));
      const fTop = new THREE.Mesh(new THREE.BoxGeometry(36, 16, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }));
      const fMid = new THREE.Mesh(new THREE.BoxGeometry(26, 14, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }));
      fTop.position.set(12, 27, 0);
      fMid.position.set(8, 2, 0);
      fGroup.add(fVert, fTop, fMid);
      fGroup.position.x = -65;

      // T
      const tGroup = new THREE.Group();
      const tBar = new THREE.Mesh(new THREE.BoxGeometry(54, 16, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }));
      const tStem = new THREE.Mesh(new THREE.BoxGeometry(18, 56, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }));
      tBar.position.y = 27;
      tStem.position.y = -8;
      tGroup.add(tBar, tStem);
      tGroup.position.x = 0;

      // X
      const xGroup = new THREE.Group();
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(18, 76, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }));
      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(18, 76, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }));
      arm1.rotation.z = Math.PI / 4;
      arm2.rotation.z = -Math.PI / 4;
      xGroup.add(arm1, arm2);
      xGroup.position.x = 62;

      group.add(fGroup, tGroup, xGroup);
    }

    return group;
  }

  /**
   * INITIALIZE THREE.JS 3D SCENE
   */
  window.initJaniFtxLogoScene = function(container, customData) {
    if (!container) return;
    window.cleanupJaniFtxLogoScene();

    const data = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), customData || {});

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    ftxScene = new THREE.Scene();
    ftxScene.background = new THREE.Color(data.backgroundColor || 0x030710);
    ftxScene.fog = new THREE.FogExp2(0x030710, 0.0018);

    ftxCamera = new THREE.PerspectiveCamera(34, width / height, 1, 3000);
    ftxCamera.position.set(0, 15, data.cameraDistance || 450);
    ftxCamera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    ftxRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    ftxRenderer.setSize(width, height);
    ftxRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    ftxRenderer.shadowMap.enabled = true;
    ftxRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    ftxRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    ftxRenderer.toneMappingExposure = 1.35;

    container.innerHTML = '';
    container.appendChild(ftxRenderer.domElement);

    // 3. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      ftxControls = new THREE.OrbitControls(ftxCamera, ftxRenderer.domElement);
      ftxControls.enableDamping = true;
      ftxControls.dampingFactor = 0.06;
      ftxControls.maxDistance = 900;
      ftxControls.minDistance = 150;
      ftxControls.target.set(0, 0, 0);
    }

    // 4. Lights
    ambientLight = new THREE.AmbientLight(0x0c1424, 1.2);
    ftxScene.add(ambientLight);

    cyanLight = new THREE.PointLight(new THREE.Color(data.primaryColor || '#00f0ff'), 2.4, 600);
    cyanLight.position.set(-80, 50, 120);
    ftxScene.add(cyanLight);

    whiteLight = new THREE.PointLight(new THREE.Color(data.secondaryColor || '#ffffff'), 1.8, 500);
    whiteLight.position.set(100, -20, 100);
    ftxScene.add(whiteLight);

    boomLight = new THREE.PointLight(new THREE.Color(data.boomColor || '#38bdf8'), 0.0, 900);
    boomLight.position.set(0, 10, 80);
    ftxScene.add(boomLight);

    const dirRim = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirRim.position.set(120, 180, -100);
    ftxScene.add(dirRim);

    // 5. Main 3D Group
    ftxGroup = new THREE.Group();
    ftxScene.add(ftxGroup);

    // Reflective Ground Floor
    if (data.floorReflections !== false) {
      const floorGeo = new THREE.PlaneGeometry(1200, 800);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x050b18,
        roughness: 0.35,
        metalness: 0.85,
        envMapIntensity: 0.8
      });
      floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = -130;
      floorMesh.receiveShadow = true;
      ftxGroup.add(floorMesh);
    }

    // 6. Build the 4 Signature FTX Logo Blocks
    // Exact FTX Icon Block Dimensions:
    // Piece 1: Top Bar (width 124, height 34, depth 26)
    pieceTop = createBeveledBlock(124, 34, 26, data.primaryColor || '#00f0ff', data.metalColor, data.primaryColor);
    ftxGroup.add(pieceTop);

    // Piece 2: Middle Bar (width 86, height 34, depth 26)
    pieceMid = createBeveledBlock(86, 34, 26, data.primaryColor || '#00f0ff', data.metalColor, data.primaryColor);
    ftxGroup.add(pieceMid);

    // Piece 3: Left Anchor Block (width 34, height 34, depth 26)
    pieceLeft = createBeveledBlock(34, 34, 26, data.primaryColor || '#00f0ff', data.metalColor, data.primaryColor);
    ftxGroup.add(pieceLeft);

    // Piece 4: Bottom Accent Block (width 34, height 34, depth 26 - Bright White)
    pieceBottom = createBeveledBlock(34, 34, 26, data.secondaryColor || '#ffffff', data.metalColor, data.secondaryColor);
    ftxGroup.add(pieceBottom);

    // 7. Shockwave Wavy Ring Meshes (Additive Bloom)
    const waveGeo = new THREE.PlaneGeometry(360, 360);
    const waveMat = new THREE.MeshBasicMaterial({
      map: generateShockwaveTexture(data.boomColor || '#38bdf8'),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    shockwaveMesh = new THREE.Mesh(waveGeo, waveMat);
    shockwaveMesh.position.set(-60, 20, 10);
    ftxGroup.add(shockwaveMesh);

    const waveMat2 = waveMat.clone();
    waveMat2.opacity = 0;
    shockwaveMesh2 = new THREE.Mesh(waveGeo, waveMat2);
    shockwaveMesh2.position.set(-60, 20, 8);
    ftxGroup.add(shockwaveMesh2);

    // 8. 3D Letters "FTX"
    let parsedFont = null;
    if (typeof THREE.FontLoader !== 'undefined' && window.__HELVETIKER_BOLD_FONT__) {
      try {
        const loader = new THREE.FontLoader();
        parsedFont = loader.parse(window.__HELVETIKER_BOLD_FONT__);
      } catch (e) {
        console.warn('[FTX 3D] Helvetiker font parse warning:', e);
      }
    }
    textGroup = buildLettersMesh(data.brandName || 'FTX', parsedFont, data);
    textGroup.position.set(70, -2, 0);
    ftxGroup.add(textGroup);

    // 9. Subtitle Plate ("THE GREAT FRAUD")
    if (data.subtitleVisible !== false) {
      const subGeo = new THREE.PlaneGeometry(320, 50);
      const subMat = new THREE.MeshBasicMaterial({
        map: generateSubtitleTexture(data.subtitleText || 'THE GREAT FRAUD', data.primaryColor || '#00f0ff'),
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      subtitleMesh = new THREE.Mesh(subGeo, subMat);
      subtitleMesh.position.set(-10, -96, 5);
      ftxGroup.add(subtitleMesh);
    }

    // 10. Floating Ambient 3D Dust Motes
    if (data.dustEnabled !== false) {
      const count = data.dustCount || 75;
      const dGeo = new THREE.BufferGeometry();
      dustPositions = new Float32Array(count * 3);
      dustVelocities = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        dustPositions[i * 3] = (Math.random() - 0.5) * 600;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
        dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;

        dustVelocities[i * 3] = (Math.random() - 0.5) * 0.4;
        dustVelocities[i * 3 + 1] = 0.2 + Math.random() * 0.4;
        dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }

      dGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

      // Circular glowing particle texture
      const pCv = document.createElement('canvas');
      pCv.width = 32; pCv.height = 32;
      const pCtx = pCv.getContext('2d');
      const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      pGrad.addColorStop(0, '#ffffff');
      pGrad.addColorStop(0.4, data.primaryColor || '#00f0ff');
      pGrad.addColorStop(1, 'rgba(0,0,0,0)');
      pCtx.fillStyle = pGrad;
      pCtx.beginPath();
      pCtx.arc(16, 16, 16, 0, Math.PI * 2);
      pCtx.fill();

      const dMat = new THREE.PointsMaterial({
        size: 5.5,
        map: new THREE.CanvasTexture(pCv),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      dustParticles = new THREE.Points(dGeo, dMat);
      ftxGroup.add(dustParticles);
    }

    // 11. Run Animation Loop
    isManualScrub = false;
    animClock = 0;
    lastTimestamp = performance.now();

    function renderLoop(now) {
      ftxAnimFrame = requestAnimationFrame(renderLoop);
      if (!isManualScrub) {
        const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
        lastTimestamp = now;
        animClock = (animClock + dt) % (data.duration || 7.0);
        updateFtxPhysicsStep(animClock, data);
      }
      if (ftxControls) ftxControls.update();
      if (ftxRenderer && ftxScene && ftxCamera) {
        ftxRenderer.render(ftxScene, ftxCamera);
      }
    }
    ftxAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * CORE PHYSICS & CHOREOGRAPHY STEP
   * Exactly implementing the James Jani Reference Video motion timeline
   */
  function updateFtxPhysicsStep(t, d) {
    if (!pieceTop || !pieceMid || !pieceLeft || !pieceBottom) return;

    const totalDur = d.duration || 7.0;
    const boomT = d.boomTime || 2.3;
    const spinMult = d.spinSpeed || 1.2;
    const waveDistort = d.waveDistortion || 1.25;
    const waveFreq = d.waveFrequency || 14.0;
    const bloom = d.bloomGlow || 2.2;

    // Assembled Target Offsets (Standard FTX Emblem Anatomy):
    // Top bar: width 124, height 34. Centered horizontally on middle row.
    const TARGET_TOP = { x: -84, y: 38, z: 0, rx: 0, ry: 0, rz: 0 };
    // Middle bar: width 86, height 34. Attached to left block.
    const TARGET_MID = { x: -65, y: -2, z: 0, rx: 0, ry: 0, rz: 0 };
    // Left anchor block: width 34, height 34.
    const TARGET_LEFT = { x: -129, y: -2, z: 0, rx: 0, ry: 0, rz: 0 };
    // Bottom accent block: width 34, height 34. White block under middle row.
    const TARGET_BOTTOM = { x: -95, y: -42, z: 0, rx: 0, ry: 0, rz: 0 };

    // --- PHASE 1 (0.0s - 1.7s): The Tumble & Drift ---
    // User description: "The bigger thing in image one is rolling on itself and moving to the back while the other little thing is moving from right to left. For a half of a second, it goes like this slowly..."
    if (t < 1.7) {
      const p1 = t / 1.7;

      // Piece 1 (Large Slab): Rolling on itself and moving deeper into the dark background
      pieceTop.position.x = -20 - p1 * 45;
      pieceTop.position.y = 10 - p1 * 15;
      pieceTop.position.z = 40 - p1 * 140; // Moves back
      pieceTop.rotation.x = t * 2.2 * spinMult; // Rolling on itself
      pieceTop.rotation.y = t * 1.6 * spinMult;
      pieceTop.rotation.z = Math.sin(t * 1.8) * 0.3;

      // Piece 3 (Cyan Companion Cube) & Piece 4 (White Cube): Drift from right to left
      pieceLeft.position.x = 90 - p1 * 130; // Moving right to left
      pieceLeft.position.y = 45 + Math.sin(t * 2.5) * 12;
      pieceLeft.position.z = -30 - p1 * 40;
      pieceLeft.rotation.x = t * 1.8 * spinMult;
      pieceLeft.rotation.y = -t * 1.4 * spinMult;

      pieceBottom.position.x = 130 - p1 * 150; // Drifts right to left
      pieceBottom.position.y = 65 + Math.cos(t * 2.2) * 15;
      pieceBottom.position.z = -70 - p1 * 30;
      pieceBottom.rotation.x = -t * 1.5 * spinMult;
      pieceBottom.rotation.y = t * 2.0 * spinMult;

      // Piece 2 (Mid Bar): Floating below
      pieceMid.position.x = 40 - p1 * 80;
      pieceMid.position.y = -60 + Math.sin(t * 2.0) * 10;
      pieceMid.position.z = -90;
      pieceMid.rotation.x = t * 1.2;
      pieceMid.rotation.y = t * 1.5;

      // Lighting: Minimal emission (matte), no shockwave yet
      pieceTop.userData.faceMat.emissiveIntensity = 0.35;
      pieceLeft.userData.faceMat.emissiveIntensity = 0.4;
      pieceBottom.userData.faceMat.emissiveIntensity = 0.5;
      if (shockwaveMesh) shockwaveMesh.material.opacity = 0;
      if (shockwaveMesh2) shockwaveMesh2.material.opacity = 0;
      if (boomLight) boomLight.intensity = 0;
      if (textGroup) textGroup.position.z = -400; // Hidden in depth
      if (subtitleMesh) subtitleMesh.material.opacity = 0;
    }
    // --- PHASE 2 (1.7s - 2.3s): The Flare & Sudden Dim ---
    // User description: "...then it brightens. And when it brightens, it dims suddenly."
    else if (t < boomT) {
      const p2 = (t - 1.7) / (boomT - 1.7);

      // Large slab turns towards camera and pulls into center
      pieceTop.position.x = -65 + (1 - p2) * 15;
      pieceTop.position.y = 15;
      pieceTop.position.z = -100 + p2 * 110; // Pulls forward into focus
      pieceTop.rotation.x = p2 * Math.PI * 1.5;
      pieceTop.rotation.y = (1 - p2) * 0.8;
      pieceTop.rotation.z = Math.sin(p2 * Math.PI) * 0.4;

      // Companions hover in top-left
      pieceLeft.position.set(-60 + Math.sin(t * 4) * 5, 55, -70);
      pieceBottom.position.set(-20 + Math.cos(t * 4) * 5, 75, -90);
      pieceMid.position.set(-40, -50, -80);

      // Emissive Flare: spikes high then dims sharply right before the boom!
      let flare;
      if (p2 < 0.7) {
        // Brightening surge
        flare = 0.35 + (p2 / 0.7) * (bloom * 3.8);
      } else {
        // Sudden Dim!
        const dimProgress = (p2 - 0.7) / 0.3;
        flare = (bloom * 3.8) * Math.max(0.08, 1 - dimProgress * 0.92);
      }
      pieceTop.userData.faceMat.emissiveIntensity = flare;
      pieceTop.userData.faceMat.color.set(d.primaryColor || '#00f0ff');
      if (cyanLight) cyanLight.intensity = 2.4 + flare * 1.5;
      if (shockwaveMesh) shockwaveMesh.material.opacity = 0;
      if (shockwaveMesh2) shockwaveMesh2.material.opacity = 0;
      if (boomLight) boomLight.intensity = flare * 0.8;
    }
    // --- PHASE 3 (2.3s - 3.9s): The Wavy Boom (Shockwave) & Kinetic Displacement ---
    // User description: "...when it glows, it creates this sort of boom, a wavy boom, that pushes the two little things into waving. When the boom is created, you see the wave passing through these two little things. Then it spins on itself..."
    else if (t < 3.9) {
      const p3 = (t - boomT) / (3.9 - boomT);
      const waveRadius = p3 * 260 * (d.boomIntensity || 1.6);

      // Shockwave ring expansion & fade
      if (shockwaveMesh && shockwaveMesh2) {
        const sScale = 0.1 + p3 * 2.8 * (d.boomIntensity || 1.6);
        shockwaveMesh.scale.set(sScale, sScale, 1);
        shockwaveMesh2.scale.set(sScale * 0.82, sScale * 0.82, 1);
        shockwaveMesh.position.set(pieceTop.position.x, pieceTop.position.y, pieceTop.position.z);
        shockwaveMesh2.position.set(pieceTop.position.x, pieceTop.position.y, pieceTop.position.z - 2);

        const waveAlpha = Math.max(0, (1 - p3 * 1.1) * 0.95);
        shockwaveMesh.material.opacity = waveAlpha;
        shockwaveMesh2.material.opacity = waveAlpha * 0.75;
      }

      // Boom flash lighting
      if (boomLight) {
        boomLight.position.set(pieceTop.position.x, pieceTop.position.y, pieceTop.position.z + 30);
        boomLight.intensity = Math.max(0, (1 - p3 * 2.0)) * 6.5 * (d.boomIntensity || 1.6);
      }

      // Central slab spins fast on itself right after the boom
      const spinEase = easeOutCubic(p3);
      pieceTop.position.x = -65 + Math.sin(p3 * Math.PI) * 12;
      pieceTop.position.y = 15;
      pieceTop.position.z = 10 - p3 * 10;
      pieceTop.rotation.x = Math.PI * 1.5 + spinEase * Math.PI * 2 * spinMult; // Full 360° axial spin
      pieceTop.rotation.y = Math.sin(p3 * Math.PI * 2) * 0.35;
      pieceTop.rotation.z = Math.cos(p3 * Math.PI) * 0.25;
      pieceTop.userData.faceMat.emissiveIntensity = 1.0 + (1 - p3) * bloom;

      // WAVE PASSING THROUGH THE TWO LITTLE THINGS (Cyan & White Blocks):
      // Distance from boom origin to companion cubes
      const distLeft = Math.hypot(pieceLeft.position.x - pieceTop.position.x, pieceLeft.position.y - pieceTop.position.y);
      const distBottom = Math.hypot(pieceBottom.position.x - pieceTop.position.x, pieceBottom.position.y - pieceTop.position.y);

      // Kinetic Waving / Sine Oscillation triggered as wave radius sweeps past them
      const hitLeft = Math.max(0, waveRadius - distLeft * 0.5);
      const hitBottom = Math.max(0, waveRadius - distBottom * 0.5);

      const decayLeft = Math.max(0, 1 - (p3 * 1.3));
      const decayBottom = Math.max(0, 1 - (p3 * 1.2));

      // Wavy sinusoidal oscillation on Y and Z + wobble rotation!
      const waveOscLeft = Math.sin(hitLeft * 0.12 * waveFreq) * 22 * waveDistort * decayLeft;
      const waveOscBottom = Math.cos(hitBottom * 0.14 * waveFreq) * 26 * waveDistort * decayBottom;

      pieceLeft.position.x = -85 - p3 * 25 + Math.sin(hitLeft * 0.08) * 8 * decayLeft;
      pieceLeft.position.y = 50 + waveOscLeft;
      pieceLeft.position.z = -50 + Math.cos(hitLeft * 0.1) * 18 * decayLeft;
      pieceLeft.rotation.z = Math.sin(hitLeft * 0.1) * 0.6 * decayLeft;
      pieceLeft.rotation.x = t * 2.0;

      pieceBottom.position.x = -45 - p3 * 30 + Math.cos(hitBottom * 0.08) * 10 * decayBottom;
      pieceBottom.position.y = 65 + waveOscBottom;
      pieceBottom.position.z = -60 + Math.sin(hitBottom * 0.12) * 20 * decayBottom;
      pieceBottom.rotation.z = -Math.cos(hitBottom * 0.1) * 0.7 * decayBottom;
      pieceBottom.rotation.y = -t * 2.2;

      // Mid bar drifts towards assembly
      pieceMid.position.x = -55 - p3 * 10;
      pieceMid.position.y = -35 + p3 * 15;
      pieceMid.position.z = -60 + p3 * 40;
      pieceMid.rotation.x = (1 - p3) * Math.PI;

      // Letters rush in from depth
      if (textGroup) {
        textGroup.position.z = -300 + p3 * 240;
        textGroup.position.x = 70;
        textGroup.rotation.y = (1 - p3) * 0.4;
      }
    }
    // --- PHASE 4 (3.9s - 5.5s): Magnetic Convergence & Logo Assembly ---
    // User description: "Then it transforms a bit more until it takes shape of the FTX logo."
    else if (t < 5.5) {
      const p4 = (t - 3.9) / (5.5 - 3.9);
      const easeSnap = easeOutBack(p4, 1.25);
      const easeLetters = easeOutCubic(p4);

      if (shockwaveMesh) shockwaveMesh.material.opacity = 0;
      if (shockwaveMesh2) shockwaveMesh2.material.opacity = 0;
      if (boomLight) boomLight.intensity = 0;

      // Snap all 4 pieces into perfect FTX layout coordinates!
      // Piece 1: Top Bar
      pieceTop.position.x = -65 + (TARGET_TOP.x - (-65)) * easeSnap;
      pieceTop.position.y = 15 + (TARGET_TOP.y - 15) * easeSnap;
      pieceTop.position.z = (TARGET_TOP.z) * easeSnap;
      pieceTop.rotation.x = (1 - easeSnap) * 0.3;
      pieceTop.rotation.y = 0;
      pieceTop.rotation.z = 0;

      // Piece 2: Middle Bar
      pieceMid.position.x = -65 + (TARGET_MID.x - (-65)) * easeSnap;
      pieceMid.position.y = -20 + (TARGET_MID.y - (-20)) * easeSnap;
      pieceMid.position.z = (TARGET_MID.z) * easeSnap;
      pieceMid.rotation.x = 0; pieceMid.rotation.y = 0; pieceMid.rotation.z = 0;

      // Piece 3: Left Anchor Block
      pieceLeft.position.x = -110 + (TARGET_LEFT.x - (-110)) * easeSnap;
      pieceLeft.position.y = 50 + (TARGET_LEFT.y - 50) * easeSnap;
      pieceLeft.position.z = (TARGET_LEFT.z) * easeSnap;
      pieceLeft.rotation.x = 0; pieceLeft.rotation.y = 0; pieceLeft.rotation.z = 0;

      // Piece 4: Bottom White Accent Block
      pieceBottom.position.x = -75 + (TARGET_BOTTOM.x - (-75)) * easeSnap;
      pieceBottom.position.y = 65 + (TARGET_BOTTOM.y - 65) * easeSnap;
      pieceBottom.position.z = (TARGET_BOTTOM.z) * easeSnap;
      pieceBottom.rotation.x = 0; pieceBottom.rotation.y = 0; pieceBottom.rotation.z = 0;

      // Emission glow settles to clean illuminated state
      pieceTop.userData.faceMat.emissiveIntensity = 0.8 + (1 - p4) * 0.6;
      pieceMid.userData.faceMat.emissiveIntensity = 0.8 + (1 - p4) * 0.6;
      pieceLeft.userData.faceMat.emissiveIntensity = 0.8 + (1 - p4) * 0.6;
      pieceBottom.userData.faceMat.emissiveIntensity = 1.1 + (1 - p4) * 0.8;

      // 3D "FTX" letters slam into place beside the icon!
      if (textGroup) {
        textGroup.position.x = 70;
        textGroup.position.y = -2;
        textGroup.position.z = -60 + easeLetters * 60;
        textGroup.rotation.y = (1 - easeLetters) * 0.2;
      }

      // Subtitle "THE GREAT FRAUD" fades in under the logo
      if (subtitleMesh) {
        subtitleMesh.material.opacity = Math.max(0, (p4 - 0.3) / 0.7);
        subtitleMesh.position.y = -106 + easeLetters * 10;
      }
    }
    // --- PHASE 5 (5.5s - 7.0s+): Hero Hold & Subtle Cinematic Drift ---
    else {
      const p5 = (t - 5.5) / (totalDur - 5.5);

      // Lockup in exact position with organic floating breathing drift
      const breathY = Math.sin(t * 1.5) * 2.5;
      const breathZ = Math.cos(t * 1.2) * 2.0;

      pieceTop.position.set(TARGET_TOP.x, TARGET_TOP.y + breathY, TARGET_TOP.z + breathZ);
      pieceMid.position.set(TARGET_MID.x, TARGET_MID.y + breathY, TARGET_MID.z + breathZ);
      pieceLeft.position.set(TARGET_LEFT.x, TARGET_LEFT.y + breathY, TARGET_LEFT.z + breathZ);
      pieceBottom.position.set(TARGET_BOTTOM.x, TARGET_BOTTOM.y + breathY, TARGET_BOTTOM.z + breathZ);

      pieceTop.rotation.set(0, 0, 0);
      pieceMid.rotation.set(0, 0, 0);
      pieceLeft.rotation.set(0, 0, 0);
      pieceBottom.rotation.set(0, 0, 0);

      pieceTop.userData.faceMat.emissiveIntensity = 0.85;
      pieceMid.userData.faceMat.emissiveIntensity = 0.85;
      pieceLeft.userData.faceMat.emissiveIntensity = 0.85;
      pieceBottom.userData.faceMat.emissiveIntensity = 1.15;

      if (textGroup) {
        textGroup.position.set(70, -2 + breathY, breathZ);
        textGroup.rotation.set(0, 0, 0);
      }

      if (subtitleMesh) {
        subtitleMesh.material.opacity = 1.0;
        subtitleMesh.position.set(-10, -96 + breathY * 0.5, 5 + breathZ);
      }

      if (shockwaveMesh) shockwaveMesh.material.opacity = 0;
      if (shockwaveMesh2) shockwaveMesh2.material.opacity = 0;
      if (boomLight) boomLight.intensity = 0;
    }

    // Camera Slow Cinematic Push-In Drift
    if (ftxCamera && !isManualScrub) {
      ftxCamera.position.z = (d.cameraDistance || 450) - (t / totalDur) * 40;
    }

    // Animate 3D Dust Particles
    if (dustParticles && dustPositions && dustVelocities) {
      const count = dustPositions.length / 3;
      for (let i = 0; i < count; i++) {
        dustPositions[i * 3 + 1] += dustVelocities[i * 3 + 1];
        dustPositions[i * 3] += dustVelocities[i * 3];
        if (dustPositions[i * 3 + 1] > 200) dustPositions[i * 3 + 1] = -200;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  /**
   * CLEANUP / TEARDOWN THREE.JS SCENE
   */
  window.cleanupJaniFtxLogoScene = function() {
    if (ftxAnimFrame) {
      cancelAnimationFrame(ftxAnimFrame);
      ftxAnimFrame = null;
    }
    if (ftxControls) {
      ftxControls.dispose();
      ftxControls = null;
    }
    if (ftxRenderer) {
      if (ftxRenderer.domElement && ftxRenderer.domElement.parentNode) {
        ftxRenderer.domElement.parentNode.removeChild(ftxRenderer.domElement);
      }
      ftxRenderer.dispose();
      ftxRenderer = null;
    }
    ftxScene = null;
    ftxCamera = null;
    ftxGroup = null;
    pieceTop = null;
    pieceMid = null;
    pieceLeft = null;
    pieceBottom = null;
    textGroup = null;
    subtitleMesh = null;
    shockwaveMesh = null;
    shockwaveMesh2 = null;
    floorMesh = null;
    dustParticles = null;
  };

  /**
   * MOUNT INTO UNIVERSAL CUSTOMIZER PREVIEW MODAL STAGE
   */
  window.tplMountJaniFtxLogoStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #030710; overflow: hidden; cursor: grab; user-select: none;">
        <!-- 3D WebGL Three.js Viewport -->
        <div id="jani-ftx-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>

        <!-- Macro Lens Telemetry & FPS HUD Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 8.5px; font-weight: 800; color: #00f0ff; background: rgba(3,7,16,0.85); border: 1px solid rgba(0,240,255,0.4); padding: 3px 8px; border-radius: 5px; backdrop-filter: blur(6px); display: flex; align-items: center; gap: 5px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#00f0ff;box-shadow:0 0 6px #00f0ff;"></span>
            JAMES JANI // 3D KINETIC LOGO BUILDER &bull; f/2.4 VOID
          </span>
          <span style="font-family: monospace; font-size: 8px; color: #94a3b8; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">
            DRAG TO ORBIT 3D
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#jani-ftx-3d-viewport');
    setTimeout(() => {
      if (viewport) {
        window.initJaniFtxLogoScene(viewport, d);
      }
    }, 30);
  };

  /**
   * BUILD DYNAMIC CONTEXTUAL INSPECTOR PANEL
   */
  window.tplBuildJaniFtxLogoInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">⚡</span>
            <span style="font-size: 11px; font-weight: 800; color: #00f0ff; text-transform: uppercase; letter-spacing: 0.8px;">FTX 3D Logo Builder</span>
          </div>
          <span style="font-size: 9px; color: #00f0ff; font-weight: 700; background: rgba(0,240,255,0.15); border: 1px solid rgba(0,240,255,0.35); padding: 2px 6px; border-radius: 4px;">JAMES JANI SIGNATURE</span>
        </div>

        <!-- 1. Typography & Branding -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Brand & Titles</span>
          <div style="display: flex; gap: 8px;">
            <div style="flex: 1;">
              <label style="font-size: 9.5px; color: #64748b; display: block; margin-bottom: 3px;">3D Main Brand</label>
              <input type="text" id="ftx-inp-brand" value="${d.brandName || 'FTX'}" style="width: 100%; font-size: 11px; font-weight: 700; background: #070d18; border: 1px solid #1e293b; color: #fff; padding: 5px 8px; border-radius: 4px;" />
            </div>
          </div>
          <div>
            <label style="font-size: 9.5px; color: #64748b; display: block; margin-bottom: 3px;">Cinematic Subtitle</label>
            <input type="text" id="ftx-inp-sub" value="${d.subtitleText || 'THE GREAT FRAUD'}" style="width: 100%; font-size: 11px; font-weight: 700; background: #070d18; border: 1px solid #1e293b; color: #00f0ff; padding: 5px 8px; border-radius: 4px;" />
          </div>
        </div>

        <!-- 2. Color Palette -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Emissive Colors</span>
          <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
              <label style="font-size: 9.5px; color: #64748b; display: block; margin-bottom: 3px;">Primary Neon</label>
              <input type="color" id="ftx-col-primary" value="${d.primaryColor || '#00f0ff'}" style="width: 100%; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 9.5px; color: #64748b; display: block; margin-bottom: 3px;">Accent Glow</label>
              <input type="color" id="ftx-col-secondary" value="${d.secondaryColor || '#ffffff'}" style="width: 100%; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 9.5px; color: #64748b; display: block; margin-bottom: 3px;">Boom Wave</label>
              <input type="color" id="ftx-col-boom" value="${d.boomColor || '#38bdf8'}" style="width: 100%; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
            </div>
          </div>
        </div>

        <!-- 3. Shockwave & Wavy Boom Dynamics -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Wavy Boom Dynamics</span>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1; margin-bottom: 3px;">
              <span>Boom Explosion Intensity</span>
              <span id="ftx-val-boom">${d.boomIntensity || 1.6}x</span>
            </div>
            <input type="range" id="ftx-slider-boom" min="0.5" max="3.0" step="0.1" value="${d.boomIntensity || 1.6}" style="width: 100%; accent-color: #00f0ff;" />
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1; margin-bottom: 3px;">
              <span>Companion Wave Distortion</span>
              <span id="ftx-val-wave">${d.waveDistortion || 1.25}x</span>
            </div>
            <input type="range" id="ftx-slider-wave" min="0.2" max="2.5" step="0.05" value="${d.waveDistortion || 1.25}" style="width: 100%; accent-color: #00f0ff;" />
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1; margin-bottom: 3px;">
              <span>Tumble & Spin Velocity</span>
              <span id="ftx-val-spin">${d.spinSpeed || 1.2}x</span>
            </div>
            <input type="range" id="ftx-slider-spin" min="0.4" max="2.5" step="0.1" value="${d.spinSpeed || 1.2}" style="width: 100%; accent-color: #00f0ff;" />
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1; margin-bottom: 3px;">
              <span>Emissive Bloom Peak</span>
              <span id="ftx-val-bloom">${d.bloomGlow || 2.2}x</span>
            </div>
            <input type="range" id="ftx-slider-bloom" min="0.5" max="4.0" step="0.1" value="${d.bloomGlow || 2.2}" style="width: 100%; accent-color: #00f0ff;" />
          </div>
        </div>

        <!-- 4. Environment & Dust -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 10px; font-weight: 600; color: #cbd5e1;">Floating 3D Dust Motes</span>
          <input type="checkbox" id="ftx-chk-dust" ${d.dustEnabled !== false ? 'checked' : ''} style="accent-color: #00f0ff; cursor: pointer;" />
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 10px; font-weight: 600; color: #cbd5e1;">Floor Specular Sheen</span>
          <input type="checkbox" id="ftx-chk-floor" ${d.floorReflections !== false ? 'checked' : ''} style="accent-color: #00f0ff; cursor: pointer;" />
        </div>

        <!-- Reset Button -->
        <button type="button" id="btn-ftx-reset" style="padding: 6px 12px; font-size: 10.5px; font-weight: 600; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; cursor: pointer; transition: all 0.2s;">
          Reset to James Jani FTX Defaults
        </button>
      </div>
    `;

    // Event listeners
    const update = (patch) => {
      if (typeof window.tplSetContextualData === 'function') {
        const current = window.tplGetContextualData(tplId) || {};
        const merged = Object.assign({}, current, patch);
        window.tplSetContextualData(tplId, merged);
        window.tplUpdateStageWithContextualData(tplId, merged);
      }
    };

    container.querySelector('#ftx-inp-brand')?.addEventListener('input', (e) => update({ brandName: e.target.value }));
    container.querySelector('#ftx-inp-sub')?.addEventListener('input', (e) => update({ subtitleText: e.target.value }));
    container.querySelector('#ftx-col-primary')?.addEventListener('input', (e) => update({ primaryColor: e.target.value }));
    container.querySelector('#ftx-col-secondary')?.addEventListener('input', (e) => update({ secondaryColor: e.target.value }));
    container.querySelector('#ftx-col-boom')?.addEventListener('input', (e) => update({ boomColor: e.target.value }));

    container.querySelector('#ftx-slider-boom')?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#ftx-val-boom').textContent = `${v.toFixed(1)}x`;
      update({ boomIntensity: v });
    });
    container.querySelector('#ftx-slider-wave')?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#ftx-val-wave').textContent = `${v.toFixed(2)}x`;
      update({ waveDistortion: v });
    });
    container.querySelector('#ftx-slider-spin')?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#ftx-val-spin').textContent = `${v.toFixed(1)}x`;
      update({ spinSpeed: v });
    });
    container.querySelector('#ftx-slider-bloom')?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#ftx-val-bloom').textContent = `${v.toFixed(1)}x`;
      update({ bloomGlow: v });
    });

    container.querySelector('#ftx-chk-dust')?.addEventListener('change', (e) => update({ dustEnabled: e.target.checked }));
    container.querySelector('#ftx-chk-floor')?.addEventListener('change', (e) => update({ floorReflections: e.target.checked }));

    container.querySelector('#btn-ftx-reset')?.addEventListener('click', () => {
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
  window.stepJaniFtxLogoAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const viewport = container.querySelector('#jani-ftx-3d-viewport');
    if (!viewport && !ftxRenderer) {
      window.initJaniFtxLogoScene(container, d);
    }
    updateFtxPhysicsStep(t, d);
  };

  /**
   * Canvas Renderer for timeline and video export
   */
  window.renderJaniFtxLogoCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    if (ftxRenderer && ftxRenderer.domElement) {
      updateFtxPhysicsStep(t, d);
      if (ftxScene && ftxCamera) {
        ftxRenderer.render(ftxScene, ftxCamera);
        ctx.drawImage(ftxRenderer.domElement, 0, 0, cw, ch);
        return;
      }
    }

    // 2D Canvas Fallback
    ctx.fillStyle = d.backgroundColor || '#030710';
    ctx.fillRect(0, 0, cw, ch);

    // Subtle dark gradient vignette
    const vGrad = ctx.createRadialGradient(cw / 2, ch / 2, ch * 0.2, cw / 2, ch / 2, ch * 0.85);
    vGrad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
    vGrad.addColorStop(0.5, 'rgba(3, 7, 16, 0.4)');
    vGrad.addColorStop(1, 'rgba(2, 4, 8, 0.95)');
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, cw, ch);

    // FTX Icon Emblem
    const cx = cw * 0.38;
    const cy = ch * 0.45;
    const unit = Math.min(cw, ch) * 0.065;

    ctx.save();
    // Top Bar (Cyan)
    ctx.fillStyle = d.primaryColor || '#00f0ff';
    ctx.shadowColor = d.primaryColor || '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.fillRect(cx - unit * 2.2, cy - unit * 1.5, unit * 3.6, unit * 0.95);

    // Middle Bar (Cyan)
    ctx.fillRect(cx - unit * 1.0, cy - unit * 0.2, unit * 2.4, unit * 0.95);

    // Left Block (Cyan)
    ctx.fillRect(cx - unit * 2.2, cy - unit * 0.2, unit * 0.95, unit * 0.95);

    // Bottom Accent Block (White)
    ctx.fillStyle = d.secondaryColor || '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 22;
    ctx.fillRect(cx - unit * 1.4, cy + unit * 1.0, unit * 0.95, unit * 0.95);
    ctx.restore();

    // 3D Title "FTX"
    ctx.save();
    ctx.font = `900 ${Math.round(unit * 2.2)}px "Inter", "Segoe UI", "Arial Black", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 25;
    ctx.fillText(d.brandName || 'FTX', cx + unit * 2.4, cy + unit * 0.7);
    ctx.restore();

    // Subtitle "THE GREAT FRAUD"
    if (d.subtitleVisible !== false) {
      ctx.save();
      ctx.font = `800 ${Math.round(unit * 0.58)}px "Inter", "Segoe UI", monospace`;
      ctx.fillStyle = d.primaryColor || '#00f0ff';
      ctx.shadowColor = d.primaryColor || '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText(d.subtitleText || 'THE GREAT FRAUD', cw / 2, cy + unit * 2.8);
      ctx.restore();
    }
  };

  window.JANI_FTX_LOGO_CONFIG = DEFAULT_CONFIG;
  console.log('[FTX Logo 3D Engine] Initialized James Jani FTX 3D Kinetic Logo Builder Engine');
})();
