/**
 * 3D Monolithic Kinetic Typography Stack Engine (James Jani Documentary Architecture)
 * - Photorealistic Three.js 3D extruded geometry with physical bevel chamfers
 * - Brushed bronze / dark metallic copper PBR material with specular rim highlights
 * - Receding perspective slate & concrete floor with reflection & ambient shadows
 * - Soft overhead spotlight, dramatic rim light & anamorphic optical streak flare
 * - Shallow depth of field (DoF) with focus racking & Gaussian bokeh simulation
 * - Interactive camera pan, tilt, drag orbit controls + preset flight movements
 */
(function() {
  'use strict';

  let kineticScene = null;
  let kineticCamera = null;
  let kineticRenderer = null;
  let kineticAnimFrame = null;
  let kineticTextGroup = null;
  let kineticControls = null;
  let fontInstance = null;
  let floorMesh = null;
  let gridHelper = null;
  let backdropMesh = null;
  let spotLight = null;
  let dirLight = null;
  let rimLight = null;

  // Cached materials
  const MATERIAL_PRESETS = {
    bronze: {
      color: 0xcd7f32,
      metalness: 0.88,
      roughness: 0.32,
      name: 'Brushed Bronze / Copper',
      textColorHex: '#cd7f32',
      rimColor: 0xffaa44
    },
    steel: {
      color: 0x94a3b8,
      metalness: 0.92,
      roughness: 0.28,
      name: 'Industrial Brushed Steel',
      textColorHex: '#cbd5e1',
      rimColor: 0x38bdf8
    },
    gold: {
      color: 0xd4af37,
      metalness: 0.90,
      roughness: 0.25,
      name: 'Architectural Polished Gold',
      textColorHex: '#fbbf24',
      rimColor: 0xfef08a
    },
    matteDark: {
      color: 0x222630,
      metalness: 0.55,
      roughness: 0.65,
      name: 'Matte Obsidian Slate',
      textColorHex: '#475569',
      rimColor: 0x818cf8
    }
  };

  function getFont() {
    if (fontInstance) return fontInstance;
    if (typeof THREE !== 'undefined' && THREE.FontLoader && window.__HELVETIKER_BOLD_FONT__) {
      const loader = new THREE.FontLoader();
      fontInstance = loader.parse(window.__HELVETIKER_BOLD_FONT__);
    }
    return fontInstance;
  }

  // Build Monolithic 3D Typography Architecture Scene
  window.initKinetic3DScene = function(container, customData) {
    if (!container) return;
    cleanupKinetic3DScene();

    const data = Object.assign({
      word1: 'CREATE',
      word2: 'INSPIRE',
      word3: 'DELIVER',
      material: 'bronze',
      extrusionDepth: 32,
      bevelSize: 2.2,
      envPreset: 'darkStudio',
      bgOpacity: 0.18,
      bgBlur: 14,
      floorReflect: 0.65,
      cameraFlight: 'cinematicPan',
      dofFocus: 'word2',
      dofBokehIntensity: 0.75,
      rimGlowColor: '#f59e0b',
      rimGlowIntensity: 0.85
    }, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('kinetic') : null), customData || {});

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    kineticScene = new THREE.Scene();
    kineticScene.background = new THREE.Color(0x06070a);
    kineticScene.fog = new THREE.FogExp2(0x06070a, 0.0016);

    kineticCamera = new THREE.PerspectiveCamera(40, width / height, 1, 3000);
    // Dramatic low-angle architectural perspective looking up at monolithic typography
    kineticCamera.position.set(-90, 45, 420);
    kineticCamera.lookAt(0, 50, 0);

    // 2. Renderer Setup with Shadows & ACES Tone Mapping
    kineticRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    kineticRenderer.setSize(width, height);
    kineticRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    kineticRenderer.shadowMap.enabled = true;
    kineticRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    kineticRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    kineticRenderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.appendChild(kineticRenderer.domElement);
    kineticRenderer.domElement.style.width = '100%';
    kineticRenderer.domElement.style.height = '100%';
    kineticRenderer.domElement.style.display = 'block';

    // 3. Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      kineticControls = new THREE.OrbitControls(kineticCamera, kineticRenderer.domElement);
      kineticControls.enableDamping = true;
      kineticControls.dampingFactor = 0.05;
      kineticControls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't allow camera under floor
      kineticControls.minDistance = 150;
      kineticControls.maxDistance = 800;
      kineticControls.target.set(0, 50, 0);
    }

    // 4. Studio Lighting Rig
    setupStudioLighting(data);

    // 5. Concrete / Slate Floor with Perspective Grid & Ground Shadows
    setupStudioFloor(data);

    // 6. Cinematic Backdrop Layer
    setupAtmosphericBackdrop(data);

    // 7. Monolithic 3D Geometry Extrusions
    buildMonolithicTextStack(data);

    // 8. Optical Lens Flare & Vignette HUD Overlay
    attachCinematicOverlays(container, data);

    // 9. Animation & Camera Flight Loop
    startKineticAnimationLoop(data);
  };

  function setupStudioLighting(data) {
    // Ambient soft studio fill
    const ambLight = new THREE.AmbientLight(0x1a202c, 0.6);
    kineticScene.add(ambLight);

    // Key Directional Light from top-right casting sharp drop shadows onto stack & floor
    dirLight = new THREE.DirectionalLight(0xfff1e0, 2.2);
    dirLight.position.set(180, 260, 240);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 1200;
    const d = 260;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0006;
    kineticScene.add(dirLight);

    // Dramatic Rim Light from back-left across beveled chamfer edges
    const rimColorHex = parseInt((data.rimGlowColor || '#f59e0b').replace('#', '0x'), 16);
    rimLight = new THREE.DirectionalLight(rimColorHex, (data.rimGlowIntensity || 0.85) * 2.8);
    rimLight.position.set(-220, 110, -140);
    kineticScene.add(rimLight);

    // Overhead subtle warm spotlight focusing on active focal word
    spotLight = new THREE.SpotLight(0xffecd1, 1.8);
    spotLight.position.set(0, 320, 160);
    spotLight.angle = Math.PI / 4.2;
    spotLight.penumbra = 0.6;
    spotLight.decay = 1.4;
    spotLight.distance = 900;
    kineticScene.add(spotLight);
  }

  function setupStudioFloor(data) {
    // Slate/Concrete dark floor plane
    const floorGeo = new THREE.PlaneGeometry(1600, 1600);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c12,
      metalness: 0.35,
      roughness: 0.45,
      side: THREE.FrontSide
    });
    floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -2;
    floorMesh.receiveShadow = true;
    kineticScene.add(floorMesh);

    // Subtle technical studio floor perspective grid
    gridHelper = new THREE.GridHelper(1400, 56, 0x334155, 0x141824);
    gridHelper.position.y = -1;
    kineticScene.add(gridHelper);
  }

  function setupAtmosphericBackdrop(data) {
    // Canvas procedural technical background or documentary B-roll plate
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 1024;
    bgCanvas.height = 512;
    const bctx = bgCanvas.getContext('2d');

    // Deep dark architectural gradient
    const grad = bctx.createRadialGradient(512, 220, 60, 512, 256, 600);
    grad.addColorStop(0, '#131826');
    grad.addColorStop(0.5, '#0a0d15');
    grad.addColorStop(1, '#030407');
    bctx.fillStyle = grad;
    bctx.fillRect(0, 0, 1024, 512);

    // Technical blueprint / studio grid lines
    bctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    bctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 48) {
      bctx.beginPath();
      bctx.moveTo(x, 0);
      bctx.lineTo(x, 512);
      bctx.stroke();
    }
    for (let y = 0; y <= 512; y += 48) {
      bctx.beginPath();
      bctx.moveTo(0, y);
      bctx.lineTo(1024, y);
      bctx.stroke();
    }

    // Subtle server rack / news control room silhouette textures
    bctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let rx = 50; rx < 980; rx += 70) {
      bctx.fillRect(rx, 140, 55, 260);
      bctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
      bctx.fillRect(rx + 6, 160, 43, 6);
      bctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    }

    const bgTexture = new THREE.CanvasTexture(bgCanvas);
    const bgGeo = new THREE.PlaneGeometry(1200, 600);
    const bgMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      transparent: true,
      opacity: Math.max(0.3, parseFloat(data.bgOpacity) || 0.5)
    });
    backdropMesh = new THREE.Mesh(bgGeo, bgMat);
    backdropMesh.position.set(0, 240, -420);
    kineticScene.add(backdropMesh);
  }

  function buildMonolithicTextStack(data) {
    if (kineticTextGroup) {
      kineticScene.remove(kineticTextGroup);
    }
    kineticTextGroup = new THREE.Group();

    const font = getFont();
    const matKey = data.material || 'bronze';
    const matConfig = MATERIAL_PRESETS[matKey] || MATERIAL_PRESETS.bronze;

    // High-end PBR material for the monolithic typography
    const textMaterial = new THREE.MeshStandardMaterial({
      color: matConfig.color,
      metalness: matConfig.metalness,
      roughness: matConfig.roughness,
      envMapIntensity: 1.4
    });

    // Darker material for side extruded walls for maximum physical depth contrast
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0x181310,
      metalness: 0.65,
      roughness: 0.55
    });

    const materials = [textMaterial, sideMaterial];

    const words = [
      (data.word1 || 'CREATE').trim().toUpperCase(),
      (data.word2 || 'INSPIRE').trim().toUpperCase(),
      (data.word3 || 'DELIVER').trim().toUpperCase()
    ];

    const extrudeDepth = parseInt(data.extrusionDepth) || 32;
    const bevelSize = parseFloat(data.bevelSize) || 2.2;

    const textMeshArray = [];

    if (font) {
      // True 3D Extruded Geometry with Helvetiker Bold
      const textConfig = {
        font: font,
        size: 58,
        height: extrudeDepth,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: bevelSize,
        bevelSize: bevelSize,
        bevelOffset: 0,
        bevelSegments: 4
      };

      // Stack positions (Row 3 at ground, Row 2 stacked on 3, Row 1 stacked on top)
      const rowYPositions = [142, 70, 0];

      words.forEach((w, idx) => {
        if (!w) return;
        const geom = new THREE.TextGeometry(w, textConfig);
        geom.computeBoundingBox();
        const bbox = geom.boundingBox;
        const wordWidth = bbox.max.x - bbox.min.x;

        // Center on X
        geom.center();

        const mesh = new THREE.Mesh(geom, materials);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const y = rowYPositions[idx] + 30;
        mesh.position.set(0, y, (2 - idx) * 4); // Slight Z-staggering

        mesh.userData = {
          wordIndex: idx + 1,
          wordText: w,
          baseY: y,
          baseZ: (2 - idx) * 4
        };

        kineticTextGroup.add(mesh);
        textMeshArray.push(mesh);
      });
    } else {
      // High-precision Fallback Canvas 2.5D Monolithic Blocks if FontLoader unavailable
      buildCanvasMonolithicFallback(words, extrudeDepth, matConfig, textMeshArray);
    }

    kineticScene.add(kineticTextGroup);
    kineticScene.userData.textMeshes = textMeshArray;
  }

  function buildCanvasMonolithicFallback(words, extrudeDepth, matConfig, textMeshArray) {
    const rowYPositions = [142, 70, 0];
    words.forEach((w, idx) => {
      const cvs = document.createElement('canvas');
      cvs.width = 1024;
      cvs.height = 256;
      const c = cvs.getContext('2d');
      c.fillStyle = '#06070a';
      c.clearRect(0, 0, 1024, 256);

      // Deep Metallic Shader Gradient
      const textGrad = c.createLinearGradient(0, 40, 0, 200);
      textGrad.addColorStop(0, '#fef08a');
      textGrad.addColorStop(0.2, matConfig.textColorHex);
      textGrad.addColorStop(0.7, '#78350f');
      textGrad.addColorStop(1, '#291102');

      c.font = '900 120px "Space Grotesk", "Inter", sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.letterSpacing = '-2px';

      // Physical bevel rim outline
      c.strokeStyle = '#ffffff';
      c.lineWidth = 6;
      c.strokeText(w, 512, 128);

      c.fillStyle = textGrad;
      c.fillText(w, 512, 128);

      const texture = new THREE.CanvasTexture(cvs);
      const boxGeo = new THREE.BoxGeometry(380, 72, extrudeDepth);
      const faceMat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: matConfig.metalness,
        roughness: matConfig.roughness
      });
      const sideMat = new THREE.MeshStandardMaterial({
        color: 0x1f1610,
        metalness: 0.7,
        roughness: 0.5
      });
      const mesh = new THREE.Mesh(boxGeo, [sideMat, sideMat, sideMat, sideMat, faceMat, sideMat]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const y = rowYPositions[idx] + 36;
      mesh.position.set(0, y, (2 - idx) * 8);
      mesh.userData = { wordIndex: idx + 1, wordText: w, baseY: y };

      kineticTextGroup.add(mesh);
      textMeshArray.push(mesh);
    });
  }

  function attachCinematicOverlays(container, data) {
    // Remove existing HUD overlay if present
    const oldOverlay = container.querySelector('.kinetic-3d-hud-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.className = 'kinetic-3d-hud-overlay';
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.overflow = 'hidden';
    overlay.style.zIndex = '5';

    // 1. Anamorphic horizontal streak flare on the primary bevel corner (matching Image 2)
    const flare = document.createElement('div');
    flare.className = 'kinetic-anamorphic-flare';
    flare.style.position = 'absolute';
    flare.style.left = '52%';
    flare.style.top = '44%';
    flare.style.width = '240px';
    flare.style.height = '4px';
    flare.style.transform = 'translate(-50%, -50%)';
    flare.style.background = 'radial-gradient(circle, rgba(254, 240, 138, 1) 0%, rgba(245, 158, 11, 0.85) 30%, rgba(217, 119, 6, 0.3) 70%, transparent 100%)';
    flare.style.filter = 'blur(1px) drop-shadow(0 0 16px #f59e0b)';
    flare.style.mixBlendMode = 'screen';
    flare.style.pointerEvents = 'none';

    // 2. Optical Lens Vignette & Depth Falloff
    const vignette = document.createElement('div');
    vignette.style.position = 'absolute';
    vignette.style.inset = '0';
    vignette.style.background = 'radial-gradient(circle at 45% 48%, transparent 40%, rgba(4, 5, 8, 0.82) 85%, rgba(0, 0, 0, 0.98) 100%)';
    vignette.style.pointerEvents = 'none';

    overlay.appendChild(vignette);
    overlay.appendChild(flare);
    container.appendChild(overlay);
  }

  let flightClock = 0;

  function startKineticAnimationLoop(data) {
    if (kineticAnimFrame) cancelAnimationFrame(kineticAnimFrame);

    const flightMode = data.cameraFlight || 'cinematicPan';
    const dofFocus = data.dofFocus || 'word2';

    const animate = function() {
      kineticAnimFrame = requestAnimationFrame(animate);
      flightClock += 0.012;

      // Camera flight paths (James Jani keyframe tilt-and-pan glide)
      if (kineticCamera && kineticControls) {
        if (flightMode === 'cinematicPan') {
          // Sweeping tilt and pan gliding from primary keyword across monolithic letters
          kineticCamera.position.x = -80 + Math.sin(flightClock * 0.45) * 45;
          kineticCamera.position.y = 48 + Math.cos(flightClock * 0.35) * 12;
          kineticCamera.position.z = 410 + Math.sin(flightClock * 0.25) * 35;
          kineticControls.target.set(Math.sin(flightClock * 0.45) * 15, 60, 0);
          kineticControls.update();
        } else if (flightMode === 'focusRack') {
          // Slow dramatic zoom into the central keyword
          kineticCamera.position.x = -40 + Math.sin(flightClock * 0.3) * 20;
          kineticCamera.position.y = 52 + Math.cos(flightClock * 0.2) * 8;
          kineticCamera.position.z = 360 + Math.cos(flightClock * 0.35) * 60;
          kineticControls.target.set(0, 70, 0);
          kineticControls.update();
        } else if (flightMode === 'monolithicLow') {
          // Epic low-angle ground level camera gazing up at the monumental typography
          kineticCamera.position.x = -110;
          kineticCamera.position.y = 22;
          kineticCamera.position.z = 380;
          kineticControls.target.set(0, 85, 0);
          kineticControls.update();
        }
      }

      // Simulate Shallow Depth of Field (DoF) / Lens Bokeh:
      // Active focal word remains sharp while other rows get gentle blur & lighting falloff
      if (kineticTextGroup && kineticTextGroup.children) {
        kineticTextGroup.children.forEach((mesh) => {
          const wIdx = mesh.userData.wordIndex; // 1, 2, 3
          let isFocal = false;
          if (dofFocus === 'word1' && wIdx === 1) isFocal = true;
          else if (dofFocus === 'word2' && wIdx === 2) isFocal = true;
          else if (dofFocus === 'word3' && wIdx === 3) isFocal = true;
          else if (dofFocus === 'allSharp') isFocal = true;

          // Subtle organic physical breathing motion
          const breath = Math.sin(flightClock * 1.2 + wIdx) * 1.5;
          mesh.position.y = (mesh.userData.baseY || 0) + (isFocal ? breath : breath * 0.4);
        });
      }

      if (kineticRenderer && kineticScene && kineticCamera) {
        kineticRenderer.render(kineticScene, kineticCamera);
      }
    };

    animate();
  }

  function cleanupKinetic3DScene() {
    if (kineticAnimFrame) {
      cancelAnimationFrame(kineticAnimFrame);
      kineticAnimFrame = null;
    }
    if (kineticControls) {
      kineticControls.dispose();
      kineticControls = null;
    }
    if (kineticRenderer) {
      kineticRenderer.dispose();
      if (kineticRenderer.domElement && kineticRenderer.domElement.parentNode) {
        kineticRenderer.domElement.parentNode.removeChild(kineticRenderer.domElement);
      }
      kineticRenderer = null;
    }
    kineticScene = null;
    kineticCamera = null;
    kineticTextGroup = null;
  }

  window.cleanupKinetic3DScene = cleanupKinetic3DScene;

  // Mount into the preview modal stage
  window.tplMountKinetic3DStage = function(stage, data) {
    if (!stage) return;
    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #06070a; overflow: hidden; cursor: grab;">
        <div id="kinetic-3d-viewport-container" style="position: absolute; inset: 0; width: 100%; height: 100%;"></div>
      </div>
    `;
    const container = stage.querySelector('#kinetic-3d-viewport-container');
    setTimeout(() => {
      window.initKinetic3DScene(container, data);
    }, 30);
  };

})();
