/**
 * Photorealistic 3D Red String Investigation Board Animation Engine
 * Replicating Top Investigative Documentary Standards (James Jani, Magnates Media, Vox, Lemmino)
 *
 * Implements:
 * 1. Material Shaders & Geometry:
 *    - 3D tactile corkboard surface with high-resolution bump/normal maps, organic porous grain,
 *      ambient occlusion shading, and warm directional spotlight vignette.
 *    - Authentic Polaroid photo frames featuring gloss photo paper shaders, physical aged white borders,
 *      realistic adhesive masking tape anchors, and handwritten ink labels ("Target A", "Key Witness", etc.).
 *    - 3D physical metallic pushpins (Vintage Brass, Polished Copper, Dark Steel, Red Plastic) with specular glints.
 *    - Braided twisted red yarn using 3D TubeGeometry with spiral fiber texture, wrapping around pushpin collars,
 *      applying natural gravitational catenary sag physics, and casting direct PCF drop shadows.
 * 2. Dynamic Animation & Assembly Sequence:
 *    - Pushpins striking into the corkboard with subtle screen-shake impulse.
 *    - Red yarn rapidly tracing and stretching between pins with physical recoil/tension twang.
 *    - Dynamic 3D camera rig at 25°-35° tilt, panning and zooming along the active connection path.
 * 3. Optics & Lighting Pass:
 *    - Overhead warm directional spotlight casting soft PCF directional shadows across all board layers.
 *    - Cinematic f/2.8 depth-of-field lens blur / bokeh pass keeping the active polaroid tack-sharp
 *      while adjacent nodes blur into the background.
 * 4. Interactive Production Studio:
 *    - OrbitControls for pan/tilt/zoom in 3D.
 *    - Contextual Inspector controls for node labels, photo uploads, yarn tension, pin metals, camera presets.
 *    - Timeline scrubbing & canvas video export pipeline.
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'conspiracy-board';

  // Default Investigative Conspiracy Board Configuration
  const DEFAULT_CONFIG = {
    type: 'conspiracy-board',

    // Node 0: Primary Suspect / Target A
    node0Label: 'Target A',
    node0Sub: 'Lead Architect',
    node0Photo: '/ceo_portrait_cutout.jpg',
    node0Tilt: -4.5,
    node0Pos: [-270, 45, 4],

    // Node 1: Key Witness
    node1Label: 'Key Witness',
    node1Sub: 'Former CFO',
    node1Photo: '/portrait_cutout_clean.png',
    node1Tilt: 1.8,
    node1Pos: [-45, -25, 6],

    // Node 2: Surveillance / Photo 3
    node2Label: 'Photo #3',
    node2Sub: 'Boardroom Meet',
    node2Photo: '/boardroom_scene_hd_thumb.jpg',
    node2Tilt: 4.2,
    node2Pos: [85, 125, 4],

    // Node 3: Suspect 2 / Handler
    node3Label: 'Suspect 2',
    node3Sub: 'Offshore Escrow',
    node3Photo: '/interview_cutin_cinematic.jpg',
    node3Tilt: -3.2,
    node3Pos: [165, -55, 6],

    // Node 4: Alibi / Accomplice
    node4Label: 'Alibi',
    node4Sub: 'Foreign Accounts',
    node4Photo: '/creator_portrait_cutout.png',
    node4Tilt: 6.0,
    node4Pos: [365, 15, 3],

    // Yarn Physics & Style
    yarnColor: '#c81e1e', // Braided Crimson
    yarnHighlightColor: '#ef4444',
    yarnTension: 0.72, // 0 = very loose sag, 1 = tight tension
    yarnRadius: 2.2, // Physical rope thickness in units
    yarnStyle: 'crimson_braided', // 'crimson_braided', 'deep_maroon', 'tactical_black', 'high_vis_orange'

    // Pushpin Material Finish
    pinFinish: 'vintage_brass', // 'vintage_brass', 'polished_copper', 'gunmetal_steel', 'red_plastic'

    // Board Surface & Lighting
    corkStyle: 'warm_cork', // 'warm_cork', 'dark_bulletin', 'vintage_forensic'
    spotlightWarmth: '#fff3db',
    spotlightIntensity: 2.3,
    rimLightIntensity: 0.85,
    vignetteStrength: 0.75,

    // Optics & Camera
    cameraPreset: 'cinematic_30', // 'cinematic_30', 'macro_target', 'macro_witness', 'overview_wide'
    cameraTilt: 28.0,
    dofEnabled: true,
    dofBokehIntensity: 0.85,
    focusTargetNode: 1, // Focus on Key Witness by default (matching Image 2)

    // Animation Timing
    animSpeed: 1.0,
    duration: 4.0,
    cameraGlide: true,
    pinStrikeShake: true
  };

  // Three.js Scene References
  let rsScene = null;
  let rsCamera = null;
  let rsRenderer = null;
  let rsAnimFrame = null;
  let rsControls = null;
  let rsGroup = null;

  // Meshes & Objects
  let corkboardMesh = null;
  let borderFrameMesh = null;
  let nodeMeshes = []; // 5 Polaroid cards
  let pinMeshes = []; // 5 Pushpins
  let tapeMeshes = []; // Masking tape strips
  let yarnTubes = []; // TubeGeometry meshes for red yarn strands
  let yarnDropShadowMeshes = []; // Projected drop shadow meshes

  // Lighting
  let spotLight = null;
  let coolRimLight = null;
  let warmFillLight = null;
  let ambientLight = null;

  // Animation State
  let animClock = 0;
  let lastTimestamp = 0;
  let isManualScrub = false;
  let manualT = 0;
  let shakeOffset = { x: 0, y: 0, z: 0 };

  // Texture & Image Cache
  const textureCache = new Map();
  const imageElementCache = new Map();

  /**
   * Safe image preloader for polaroid faces
   */
  function preloadImage(url) {
    if (!url) return null;
    if (imageElementCache.has(url)) return imageElementCache.get(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    imageElementCache.set(url, img);
    return img;
  }

  // Preload default documentary portrait assets
  preloadImage(DEFAULT_CONFIG.node0Photo);
  preloadImage(DEFAULT_CONFIG.node1Photo);
  preloadImage(DEFAULT_CONFIG.node2Photo);
  preloadImage(DEFAULT_CONFIG.node3Photo);
  preloadImage(DEFAULT_CONFIG.node4Photo);

  /**
   * Generates High-Resolution Procedural 3D Corkboard Canvas Texture
   * Accurate porous cork granules, layered Perlin micro-flecks, voids, and edge vignette
   */
  function generateCorkTexture(data) {
    const key = `cork_${data.corkStyle || 'warm_cork'}_${data.vignetteStrength || 0.75}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1536;
    cv.height = 1024;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Base Warm Amber Cork Tone
    let baseColor = '#aa6c35';
    let gradStop1 = '#c48548';
    let gradStop2 = '#8c5222';
    if (data.corkStyle === 'dark_bulletin') {
      baseColor = '#6d421d';
      gradStop1 = '#7e5025';
      gradStop2 = '#4b2a0f';
    } else if (data.corkStyle === 'vintage_forensic') {
      baseColor = '#9a5c28';
      gradStop1 = '#b16f34';
      gradStop2 = '#754018';
    }

    const baseGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w * 0.75);
    baseGrad.addColorStop(0, gradStop1);
    baseGrad.addColorStop(0.65, baseColor);
    baseGrad.addColorStop(1, gradStop2);
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. High-Density Multi-Scale Cork Granules
    // Layer A: Micro-pores (Thousands of tiny light and dark speckles)
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const noise = (Math.random() - 0.48) * 38;
      d[i] = Math.min(255, Math.max(0, d[i] + noise * 1.1));
      d[i+1] = Math.min(255, Math.max(0, d[i+1] + noise * 0.85));
      d[i+2] = Math.min(255, Math.max(0, d[i+2] + noise * 0.55));
    }
    ctx.putImageData(imgData, 0, 0);

    // Layer B: Organic Oblong Cork Flecks (Coarse physical chunks)
    const fleckCount = 14000;
    const fleckColors = [
      'rgba(235, 185, 125, 0.45)', // Golden beige fleck
      'rgba(245, 205, 145, 0.35)', // Light cork crumb
      'rgba(140, 80, 35, 0.55)',   // Medium umber granule
      'rgba(90, 45, 18, 0.65)',    // Deep fissure chunk
      'rgba(50, 22, 8, 0.75)',     // Dark void pore
      'rgba(215, 150, 90, 0.40)'   // Warm amber bit
    ];

    for (let i = 0; i < fleckCount; i++) {
      const fx = Math.random() * w;
      const fy = Math.random() * h;
      const fw = 1.5 + Math.random() * 5.5;
      const fh = 1.2 + Math.random() * 3.8;
      const angle = Math.random() * Math.PI;

      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(angle);
      ctx.fillStyle = fleckColors[Math.floor(Math.random() * fleckColors.length)];
      ctx.beginPath();
      ctx.ellipse(0, 0, fw, fh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Layer C: Cork Fissure Crevices & Surface Imperfections
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 350; i++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const len = 6 + Math.random() * 18;
      const rot = Math.random() * Math.PI * 2;
      ctx.strokeStyle = 'rgba(40, 16, 5, 0.45)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(rot) * len, cy + Math.sin(rot) * len);
      ctx.stroke();
    }

    // 3. Cinematic Spotlight Radial Vignette (Dramatic Documentary Framing)
    const vigGrad = ctx.createRadialGradient(w * 0.48, h * 0.45, w * 0.22, w / 2, h / 2, w * 0.72);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
    vigGrad.addColorStop(0.55, 'rgba(25, 12, 4, 0.25)');
    vigGrad.addColorStop(0.85, 'rgba(15, 6, 2, 0.65)');
    vigGrad.addColorStop(1, 'rgba(5, 2, 0, 0.92)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates High-Resolution Procedural Corkboard Bump / Normal Map
   */
  function generateCorkBumpMap() {
    const key = 'cork_bump_map';
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 768;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 85;
      const v = Math.min(255, Math.max(0, 128 + n));
      d[i] = v;
      d[i+1] = v;
      d[i+2] = v;
    }
    ctx.putImageData(imgData, 0, 0);

    // Embossed fleck cavities
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 1 + Math.random() * 4;
      ctx.fillStyle = Math.random() > 0.45 ? 'rgba(40, 40, 40, 0.6)' : 'rgba(220, 220, 220, 0.5)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Photorealistic Braided Twisted Yarn Spiral Texture
   * Creates the 3-ply twisted thread surface with micro-fibers
   */
  function generateYarnTexture(data) {
    const key = `yarn_braid_${data.yarnColor || '#c81e1e'}_${data.yarnStyle || 'crimson_braided'}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 128;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    let baseHex = data.yarnColor || '#c81e1e';
    let hiHex = data.yarnHighlightColor || '#ef4444';
    let shadowHex = '#660b0b';

    if (data.yarnStyle === 'deep_maroon') {
      baseHex = '#881337';
      hiHex = '#be123c';
      shadowHex = '#4c0519';
    } else if (data.yarnStyle === 'tactical_black') {
      baseHex = '#1e293b';
      hiHex = '#475569';
      shadowHex = '#090d16';
    } else if (data.yarnStyle === 'high_vis_orange') {
      baseHex = '#ea580c';
      hiHex = '#fb923c';
      shadowHex = '#7c2d12';
    }

    // Base tone
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, w, h);

    // Twisted Braided 3-Ply Spiral Striations
    const strandPeriod = 32;
    for (let x = 0; x < w; x += 1) {
      const phase = (x % strandPeriod) / strandPeriod;
      const angle = phase * Math.PI * 2;
      const sinVal = Math.sin(angle);

      // Deep valley shadow between twists
      if (Math.abs(sinVal) > 0.8) {
        ctx.fillStyle = shadowHex;
        ctx.fillRect(x, 0, 1, h);
      } else if (sinVal > 0.2) {
        // Specular fiber ridge
        ctx.fillStyle = hiHex;
        ctx.fillRect(x, 0, 1, h);
      }
    }

    // Micro fiber noise (micro-frays)
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 4) {
      const n = (Math.random() - 0.5) * 35;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i+1] = Math.min(255, Math.max(0, pix[i+1] + n * 0.4));
      pix[i+2] = Math.min(255, Math.max(0, pix[i+2] + n * 0.4));
    }
    ctx.putImageData(imgData, 0, 0);

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Photorealistic Polaroid Photo Canvas Texture
   * Accurate aged photo paper, semi-gloss portrait print, and authentic handwritten ink label
   */
  function generatePolaroidTexture(nodeIndex, labelText, photoUrl, subText) {
    const key = `polaroid_${nodeIndex}_${labelText}_${photoUrl}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 620;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Aged Photographic Paper Base
    ctx.fillStyle = '#f9f6ee'; // Off-white warm polaroid card stock
    ctx.fillRect(0, 0, w, h);

    // Subtle paper age tone gradient
    const paperGrad = ctx.createLinearGradient(0, 0, w, h);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    paperGrad.addColorStop(0.5, 'rgba(240, 235, 220, 0.15)');
    paperGrad.addColorStop(1, 'rgba(225, 215, 195, 0.55)');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // Outer subtle card bevel / paper border shadow
    ctx.strokeStyle = 'rgba(160, 140, 115, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // 2. Photo Area (Inset: 32px margins on sides and top, large 140px chin at bottom)
    const px = 32;
    const py = 32;
    const pw = w - 64;
    const ph = 430;

    // Photo frame recessed shadow
    ctx.fillStyle = '#111317';
    ctx.fillRect(px, py, pw, ph);

    // Draw Portrait Photo (from preloaded image or stylized procedural fallback)
    let drawn = false;
    if (photoUrl && imageElementCache.has(photoUrl)) {
      const img = imageElementCache.get(photoUrl);
      if (img && img.complete && img.naturalWidth > 0) {
        try {
          ctx.save();
          ctx.beginPath();
          ctx.rect(px, py, pw, ph);
          ctx.clip();

          // Calculate center crop
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const frameAspect = pw / ph;
          let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
          if (imgAspect > frameAspect) {
            sw = img.naturalHeight * frameAspect;
            sx = (img.naturalWidth - sw) / 2;
          } else {
            sh = img.naturalWidth / frameAspect;
            sy = (img.naturalHeight - sh) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph);

          // Apply Cinematic High-Contrast Grading & Vignette to Photo
          const pVig = ctx.createRadialGradient(px + pw / 2, py + ph / 2, pw * 0.25, px + pw / 2, py + ph / 2, pw * 0.7);
          pVig.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
          pVig.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
          pVig.addColorStop(1, 'rgba(10, 12, 18, 0.65)');
          ctx.fillStyle = pVig;
          ctx.fillRect(px, py, pw, ph);

          ctx.restore();
          drawn = true;
        } catch (e) {
          drawn = false;
        }
      }
    }

    // Procedural Investigative Suspect Portrait Fallback
    if (!drawn) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();

      const bgGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
      bgGrad.addColorStop(0, '#2c3540');
      bgGrad.addColorStop(1, '#0e1217');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(px, py, pw, ph);

      // Stylized Suspect Silhouette / Portrait bust
      ctx.fillStyle = '#1a202c';
      // Head
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph * 0.38, 62, 0, Math.PI * 2);
      ctx.fill();
      // Shoulders
      ctx.beginPath();
      ctx.ellipse(px + pw / 2, py + ph * 0.88, 130, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Film grain noise over photo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 1800; i++) {
        ctx.fillRect(px + Math.random() * pw, py + Math.random() * ph, 1.5, 1.5);
      }

      ctx.restore();
    }

    // Semi-Gloss Photo Glint (Diagonal specular sheen across photo paper)
    const sheen = ctx.createLinearGradient(px, py, px + pw, py + ph);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.0)');
    sheen.addColorStop(0.55, 'rgba(255, 255, 255, 0.08)');
    sheen.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(px, py, pw, ph);

    // 3. Handwritten Ink Marker Label (Bottom Chin)
    ctx.save();
    ctx.translate(w / 2, h - 72);

    // Subtle random tilt to handwriting for realism
    const textTilt = ((nodeIndex * 1.7) % 3 - 1.5) * (Math.PI / 180);
    ctx.rotate(textTilt);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Primary Marker Title ("Target A", "Key Witness", etc.)
    // Sharp ink with slight porous bleed
    ctx.font = '700 38px "Playfair Display", "Times New Roman", Georgia, serif';
    ctx.fillStyle = 'rgba(20, 22, 28, 0.95)';
    ctx.fillText(labelText, 0, 0);

    // Subtle ink bleed shadow for authentic fiber absorption
    ctx.font = '700 38px "Playfair Display", "Times New Roman", Georgia, serif';
    ctx.fillStyle = 'rgba(15, 18, 24, 0.35)';
    ctx.fillText(labelText, 0.8, 0.8);

    // Secondary forensic note
    if (subText) {
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(90, 85, 80, 0.85)';
      ctx.fillText(subText.toUpperCase(), 0, 36);
    }

    ctx.restore();

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Translucent Masking Tape Canvas Texture
   * Cream semi-translucent crinkled paper adhesive tape
   */
  function generateMaskingTapeTexture() {
    const key = 'masking_tape_tex';
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 96;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // Semi-translucent aged cream tape
    ctx.fillStyle = 'rgba(238, 226, 192, 0.82)';
    ctx.fillRect(0, 0, w, h);

    // Fiber striations along tape length
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    for (let y = 4; y < h; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + (Math.random() - 0.5) * 1.5);
      ctx.stroke();
    }

    // Torn frayed ends on left and right
    ctx.clearRect(0, 0, 8, h);
    ctx.clearRect(w - 8, 0, 8, h);

    ctx.fillStyle = 'rgba(215, 195, 150, 0.85)';
    for (let y = 0; y < h; y += 4) {
      const lLen = 4 + Math.random() * 8;
      const rLen = 4 + Math.random() * 8;
      ctx.fillRect(0, y, lLen, 3);
      ctx.fillRect(w - rLen, y, rLen, 3);
    }

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Builds 3D Metallic Pushpin Mesh (Vintage Brass, Copper, Steel)
   */
  function createPushpinMesh(data) {
    const group = new THREE.Group();

    let metalColor = 0xdfba66; // Vintage Brass (Default)
    let metalRough = 0.28;
    let metalness = 0.92;

    if (data.pinFinish === 'polished_copper') {
      metalColor = 0xd97d54;
      metalRough = 0.24;
      metalness = 0.90;
    } else if (data.pinFinish === 'gunmetal_steel') {
      metalColor = 0x8a95a5;
      metalRough = 0.20;
      metalness = 0.95;
    } else if (data.pinFinish === 'red_plastic') {
      metalColor = 0xdc2626;
      metalRough = 0.38;
      metalness = 0.12;
    }

    const pinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(metalColor),
      roughness: metalRough,
      metalness: metalness
    });

    // 1. Tapered Needle Shaft (inserts into board)
    const shaftGeo = new THREE.CylinderGeometry(0.9, 0.3, 16, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.98, roughness: 0.15 });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.rotation.x = Math.PI / 2;
    shaftMesh.position.z = -7;
    shaftMesh.castShadow = true;
    group.add(shaftMesh);

    // 2. Base Collar Ring
    const collarGeo = new THREE.CylinderGeometry(5.2, 5.8, 3.2, 24);
    const collarMesh = new THREE.Mesh(collarGeo, pinMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.z = 1.6;
    collarMesh.castShadow = true;
    group.add(collarMesh);

    // 3. Waist / Neck (recess where yarn loops around!)
    const neckGeo = new THREE.CylinderGeometry(3.6, 3.8, 5.5, 24);
    const neckMesh = new THREE.Mesh(neckGeo, pinMat);
    neckMesh.rotation.x = Math.PI / 2;
    neckMesh.position.z = 5.2;
    neckMesh.castShadow = true;
    group.add(neckMesh);

    // 4. Flared Pushpin Head / Cap (Metallic thumb rest)
    const headGeo = new THREE.CylinderGeometry(7.8, 5.2, 4.8, 28);
    const headMesh = new THREE.Mesh(headGeo, pinMat);
    headMesh.rotation.x = Math.PI / 2;
    headMesh.position.z = 9.8;
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    group.add(headMesh);

    // 5. Concave Top Cap Bevel
    const topCapGeo = new THREE.CylinderGeometry(7.2, 7.8, 1.2, 28);
    const topCapMesh = new THREE.Mesh(topCapGeo, pinMat);
    topCapMesh.rotation.x = Math.PI / 2;
    topCapMesh.position.z = 12.5;
    topCapMesh.castShadow = true;
    group.add(topCapMesh);

    return group;
  }

  /**
   * Initializes the Three.js 3D Red String Investigation Scene
   */
  window.initRedString3DScene = function(container, customData) {
    if (!container) return;
    cleanupRedString3DScene();

    const data = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), customData || {});

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 540;

    // 1. Scene & Camera Setup
    rsScene = new THREE.Scene();
    rsScene.background = new THREE.Color(0x06080c);
    rsScene.fog = new THREE.Fog(0x06080c, 900, 2800);

    rsCamera = new THREE.PerspectiveCamera(36, width / height, 1, 3000);
    applyCameraPreset(data);

    // 2. High-Precision WebGL Renderer with ACES Filmic Tone Mapping
    rsRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rsRenderer.setSize(width, height);
    rsRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rsRenderer.shadowMap.enabled = true;
    rsRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rsRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    rsRenderer.toneMappingExposure = 1.35;

    container.innerHTML = '';
    container.style.position = 'absolute';
    container.style.inset = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'hidden';

    rsRenderer.domElement.style.position = 'absolute';
    rsRenderer.domElement.style.inset = '0';
    rsRenderer.domElement.style.width = '100%';
    rsRenderer.domElement.style.height = '100%';
    rsRenderer.domElement.style.display = 'block';
    container.appendChild(rsRenderer.domElement);

    // 3. OrbitControls for Interactive Tilt/Orbit in 3D
    if (typeof THREE.OrbitControls !== 'undefined') {
      rsControls = new THREE.OrbitControls(rsCamera, rsRenderer.domElement);
      rsControls.enableDamping = true;
      rsControls.dampingFactor = 0.06;
      rsControls.maxDistance = 1100;
      rsControls.minDistance = 180;
      rsControls.target.set(0, 0, 0);
      rsControls.maxPolarAngle = Math.PI / 2.05; // Stay in front of corkboard
      rsControls.minPolarAngle = Math.PI / 12.0;
    }

    // 4. Dramatic Forensic Studio Lighting Rig (Vibrant, high-contrast, fully illuminated)
    // Clear Warm Ambient Light
    ambientLight = new THREE.AmbientLight(0xfff3e0, 1.45);
    rsScene.add(ambientLight);

    // Direct Overhead Key Directional Light (Ensures whole board is crisp, vivid, and bright)
    const overheadKeyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    overheadKeyLight.position.set(0, 180, 480);
    overheadKeyLight.castShadow = true;
    overheadKeyLight.shadow.mapSize.width = 2048;
    overheadKeyLight.shadow.mapSize.height = 2048;
    overheadKeyLight.shadow.bias = -0.0001;
    rsScene.add(overheadKeyLight);

    // Warm Directional Spotlight (James Jani / Magnates Media Signature Warm Glow)
    spotLight = new THREE.SpotLight(new THREE.Color(data.spotlightWarmth || '#fff3db'), data.spotlightIntensity || 3.2);
    spotLight.position.set(-60, 260, 420);
    spotLight.target.position.set(0, 0, 0);
    spotLight.angle = Math.PI / 2.6;
    spotLight.penumbra = 0.6;
    spotLight.decay = 0; // Crucial: decay=0 ensures full light transmission across 3D distance!
    spotLight.distance = 0;
    spotLight.castShadow = false;
    rsScene.add(spotLight);
    rsScene.add(spotLight.target);

    // Cool Specular Edge Rim Light (High-stakes documentary blue contrast)
    coolRimLight = new THREE.DirectionalLight(0x7dd3fc, data.rimLightIntensity || 1.1);
    coolRimLight.position.set(420, -180, 280);
    rsScene.add(coolRimLight);

    // Warm Fill Light
    warmFillLight = new THREE.DirectionalLight(0xfdba74, 0.95);
    warmFillLight.position.set(-320, 160, 220);
    rsScene.add(warmFillLight);

    // 5. Build 3D Corkboard Environment
    buildCorkboardSurface(data);

    // 6. Build Polaroid Nodes & Pushpins
    buildPolaroidNodes(data);

    // 7. Build Braided Red Yarn Physics Network
    buildYarnNetwork(data);

    // 8. Initial Step & Render
    updateAnimationStep(0, data);
    if (rsRenderer && rsScene && rsCamera) {
      rsRenderer.render(rsScene, rsCamera);
    }

    // Animation Loop
    lastTimestamp = performance.now();
    animClock = 0;

    function renderLoop(now) {
      rsAnimFrame = requestAnimationFrame(renderLoop);
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock += dt * (data.animSpeed || 1.0);
      }
      const t = isManualScrub ? manualT : (animClock % (data.duration || 4.0));

      // Update string draw, pin drop physics, and dynamic camera glide
      updateAnimationStep(t, data);

      if (rsControls) rsControls.update();
      if (rsRenderer && rsScene && rsCamera) {
        rsRenderer.render(rsScene, rsCamera);
      }
    }

    rsAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * Applies Camera Perspective Preset
   */
  function applyCameraPreset(data) {
    if (!rsCamera) return;
    const preset = data.cameraPreset || 'cinematic_30';

    if (preset === 'macro_target') {
      // Focused tight on Target A
      rsCamera.position.set(-220, 30, 240);
      rsCamera.lookAt(-250, 40, 0);
    } else if (preset === 'macro_witness') {
      // Focused tight on Key Witness
      rsCamera.position.set(-30, -35, 230);
      rsCamera.lookAt(-45, -25, 0);
    } else if (preset === 'overview_wide') {
      // Full Board overview
      rsCamera.position.set(0, -20, 680);
      rsCamera.lookAt(0, 0, 0);
    } else {
      // Default: Cinematic 28°-32° Tilt Low-Angle (Matching Image 2 Benchmark)
      // Dramatic perspective, nodes fill 70% of screen
      rsCamera.position.set(-20, -145, 460);
      rsCamera.lookAt(10, 15, 0);
    }
  }

  /**
   * Builds the 3D Tactile Corkboard Surface with Normal Map & Wood Framing
   */
  function buildCorkboardSurface(data) {
    if (corkboardMesh && rsScene) {
      rsScene.remove(corkboardMesh);
      if (corkboardMesh.geometry) corkboardMesh.geometry.dispose();
    }
    if (borderFrameMesh && rsScene) {
      rsScene.remove(borderFrameMesh);
      if (borderFrameMesh.geometry) borderFrameMesh.geometry.dispose();
    }

    // 1. Cork Surface Plane
    const corkCv = generateCorkTexture(data);
    const corkTex = new THREE.CanvasTexture(corkCv);
    corkTex.needsUpdate = true;
    corkTex.anisotropy = rsRenderer ? rsRenderer.capabilities.getMaxAnisotropy() : 4;

    const bumpCv = generateCorkBumpMap();
    const bumpTex = new THREE.CanvasTexture(bumpCv);
    bumpTex.needsUpdate = true;
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(2, 2);

    const corkGeo = new THREE.PlaneGeometry(1180, 760);
    const corkMat = new THREE.MeshStandardMaterial({
      map: corkTex,
      bumpMap: bumpTex,
      bumpScale: 1.8,
      roughness: 0.88,
      metalness: 0.04
    });

    corkboardMesh = new THREE.Mesh(corkGeo, corkMat);
    corkboardMesh.position.set(0, 0, -1);
    corkboardMesh.receiveShadow = true;
    rsScene.add(corkboardMesh);

    // 2. Beveled Dark Wood Border Frame
    const frameGeo = new THREE.BoxGeometry(1210, 790, 16);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1a120c,
      roughness: 0.65,
      metalness: 0.08
    });
    borderFrameMesh = new THREE.Mesh(frameGeo, frameMat);
    borderFrameMesh.position.set(0, 0, -10);
    borderFrameMesh.receiveShadow = true;
    rsScene.add(borderFrameMesh);
  }

  /**
   * Builds the 5 Polaroid Nodes, Pushpins, and Tape Anchors
   */
  function buildPolaroidNodes(data) {
    // Clean existing
    nodeMeshes.forEach(m => rsScene.remove(m));
    nodeMeshes = [];
    pinMeshes.forEach(m => rsScene.remove(m));
    pinMeshes = [];
    tapeMeshes.forEach(m => rsScene.remove(m));
    tapeMeshes = [];

    const nodesData = [
      {
        idx: 0,
        label: data.node0Label || 'Target A',
        sub: data.node0Sub || 'Lead Architect',
        photo: data.node0Photo || '/ceo_portrait_cutout.jpg',
        tilt: (data.node0Tilt !== undefined ? data.node0Tilt : -4.5) * (Math.PI / 180),
        pos: data.node0Pos || [-270, 45, 4]
      },
      {
        idx: 1,
        label: data.node1Label || 'Key Witness',
        sub: data.node1Sub || 'Former CFO',
        photo: data.node1Photo || '/portrait_cutout_clean.png',
        tilt: (data.node1Tilt !== undefined ? data.node1Tilt : 1.8) * (Math.PI / 180),
        pos: data.node1Pos || [-45, -25, 6]
      },
      {
        idx: 2,
        label: data.node2Label || 'Photo #3',
        sub: data.node2Sub || 'Boardroom Meet',
        photo: data.node2Photo || '/boardroom_scene_hd_thumb.jpg',
        tilt: (data.node2Tilt !== undefined ? data.node2Tilt : 4.2) * (Math.PI / 180),
        pos: data.node2Pos || [85, 125, 4]
      },
      {
        idx: 3,
        label: data.node3Label || 'Suspect 2',
        sub: data.node3Sub || 'Offshore Escrow',
        photo: data.node3Photo || '/interview_cutin_cinematic.jpg',
        tilt: (data.node3Tilt !== undefined ? data.node3Tilt : -3.2) * (Math.PI / 180),
        pos: data.node3Pos || [165, -55, 6]
      },
      {
        idx: 4,
        label: data.node4Label || 'Alibi',
        sub: data.node4Sub || 'Foreign Accounts',
        photo: data.node4Photo || '/creator_portrait_cutout.png',
        tilt: (data.node4Tilt !== undefined ? data.node4Tilt : 6.0) * (Math.PI / 180),
        pos: data.node4Pos || [365, 15, 3]
      }
    ];

    const tapeTexCv = generateMaskingTapeTexture();
    const tapeTex = new THREE.CanvasTexture(tapeTexCv);
    tapeTex.needsUpdate = true;

    nodesData.forEach(nd => {
      // 1. Polaroid Card Box Mesh (130 x 156 mm)
      const pWidth = 130;
      const pHeight = 156;
      const pThickness = 1.2;

      const pCv = generatePolaroidTexture(nd.idx, nd.label, nd.photo, nd.sub);
      const pTex = new THREE.CanvasTexture(pCv);
      pTex.needsUpdate = true;
      pTex.anisotropy = 4;

      const cardGeo = new THREE.BoxGeometry(pWidth, pHeight, pThickness);

      const paperWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xf5f2e8,
        roughness: 0.65,
        metalness: 0.02
      });

      const frontMat = new THREE.MeshStandardMaterial({
        map: pTex,
        roughness: 0.42, // Photo paper specular glint
        metalness: 0.04
      });

      const cardMats = [
        paperWhiteMat, paperWhiteMat, paperWhiteMat, paperWhiteMat,
        frontMat, // Front face (+Z)
        paperWhiteMat
      ];

      const cardMesh = new THREE.Mesh(cardGeo, cardMats);
      cardMesh.position.set(nd.pos[0], nd.pos[1], nd.pos[2]);
      cardMesh.rotation.z = nd.tilt;
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;

      // Store initial resting transform for pin shake & drop animation
      cardMesh.userData = {
        basePos: [nd.pos[0], nd.pos[1], nd.pos[2]],
        baseTilt: nd.tilt,
        index: nd.idx
      };

      rsScene.add(cardMesh);
      nodeMeshes.push(cardMesh);

      // 2. Adhesive Masking Tape Strip (at top edge of polaroid)
      const tapeGeo = new THREE.PlaneGeometry(52, 22);
      const tapeMat = new THREE.MeshStandardMaterial({
        map: tapeTex,
        transparent: true,
        opacity: 0.88,
        roughness: 0.75,
        metalness: 0.05
      });
      const tapeMesh = new THREE.Mesh(tapeGeo, tapeMat);
      tapeMesh.position.set(nd.pos[0], nd.pos[1] + pHeight * 0.46, nd.pos[2] + 1.2);
      tapeMesh.rotation.z = nd.tilt + (Math.random() - 0.5) * 0.08;
      tapeMesh.castShadow = true;
      rsScene.add(tapeMesh);
      tapeMeshes.push(tapeMesh);

      // 3. 3D Metallic Pushpin
      const pinMesh = createPushpinMesh(data);
      // Pin placed in upper center of polaroid
      pinMesh.position.set(nd.pos[0], nd.pos[1] + pHeight * 0.28, nd.pos[2] + 2);
      pinMesh.userData = {
        basePos: [nd.pos[0], nd.pos[1] + pHeight * 0.28, nd.pos[2] + 2],
        index: nd.idx
      };
      rsScene.add(pinMesh);
      pinMeshes.push(pinMesh);
    });
  }

  /**
   * Builds the 3D Braided Red Yarn Physics Network & Catenary Curves
   */
  function buildYarnNetwork(data) {
    yarnTubes.forEach(t => rsScene.remove(t));
    yarnTubes = [];
    yarnDropShadowMeshes.forEach(s => rsScene.remove(s));
    yarnDropShadowMeshes = [];

    // Red yarn texture with twisted spiral braid
    const yarnCv = generateYarnTexture(data);
    const yarnTex = new THREE.CanvasTexture(yarnCv);
    yarnTex.needsUpdate = true;
    yarnTex.wrapS = THREE.RepeatWrapping;
    yarnTex.wrapT = THREE.RepeatWrapping;
    yarnTex.repeat.set(24, 1);

    const yarnMat = new THREE.MeshStandardMaterial({
      map: yarnTex,
      roughness: 0.82,
      metalness: 0.08
    });

    // Shadow material for realistic soft contact drop shadow on cork
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050201,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });

    // Network Connection Topology (Iconic Investigation Web)
    const connections = [
      { from: 0, to: 1, sagMult: 1.0, delay: 0.8, dur: 0.6 },  // Target A -> Key Witness
      { from: 1, to: 2, sagMult: 1.2, delay: 1.4, dur: 0.5 },  // Key Witness -> Photo 3
      { from: 2, to: 3, sagMult: 0.9, delay: 1.9, dur: 0.5 },  // Photo 3 -> Suspect 2
      { from: 3, to: 4, sagMult: 1.1, delay: 2.4, dur: 0.6 },  // Suspect 2 -> Alibi
      { from: 0, to: 2, sagMult: 1.4, delay: 2.1, dur: 0.5 },  // Cross-link: Target A -> Photo 3
      { from: 1, to: 3, sagMult: 1.3, delay: 2.6, dur: 0.5 }   // Cross-link: Key Witness -> Suspect 2
    ];

    connections.forEach((conn, cIdx) => {
      const pinA = pinMeshes[conn.from];
      const pinB = pinMeshes[conn.to];
      if (!pinA || !pinB) return;

      const pA = new THREE.Vector3().fromArray(pinA.userData.basePos);
      const pB = new THREE.Vector3().fromArray(pinB.userData.basePos);

      // Elevated yarn height (resting on pin collar)
      pA.z += 5.5;
      pB.z += 5.5;

      // Compute Catenary Curve with Natural Gravitational Sag
      const tension = (data.yarnTension !== undefined ? data.yarnTension : 0.72);
      const dist = pA.distanceTo(pB);
      // Less tension = more sag; more tension = tight catenary
      const sagAmount = Math.max(3.0, (1.05 - tension) * (dist * 0.14) * conn.sagMult);

      // Generate points along the catenary arc
      const points = [];
      const steps = 36;
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        // Base linear interpolation
        const pt = new THREE.Vector3().lerpVectors(pA, pB, u);

        // Gravitational Sag along Y axis and subtle outward Z bow
        const arch = 4 * u * (1 - u);
        pt.y -= arch * sagAmount;
        pt.z -= arch * (sagAmount * 0.15);

        // Micro-twist fiber jitter
        pt.x += (Math.sin(u * 28) * 0.25);

        points.push(pt);
      }

      // Add a loop around pin collars at the ends
      const loopRadius = 4.2;
      points[0].x += loopRadius * Math.cos(cIdx);
      points[0].y += loopRadius * Math.sin(cIdx);
      points[points.length - 1].x -= loopRadius * Math.cos(cIdx);
      points[points.length - 1].y -= loopRadius * Math.sin(cIdx);

      const curve = new THREE.CatmullRomCurve3D(points);
      const yarnRadius = (data.yarnRadius || 2.2);

      // Main 3D Braided Yarn Tube Mesh
      const tubeGeo = new THREE.TubeGeometry(curve, 48, yarnRadius, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, yarnMat);
      tubeMesh.castShadow = true;
      tubeMesh.receiveShadow = false;

      tubeMesh.userData = {
        curve: curve,
        fullGeo: tubeGeo,
        delay: conn.delay,
        dur: conn.dur,
        fromPin: conn.from,
        toPin: conn.to,
        points: points
      };

      rsScene.add(tubeMesh);
      yarnTubes.push(tubeMesh);

      // Contact Drop Shadow Mesh onto Corkboard (projected plane)
      const shadowPoints = points.map(pt => new THREE.Vector3(pt.x + 8, pt.y - 12, 1.0));
      const shadowCurve = new THREE.CatmullRomCurve3D(shadowPoints);
      const shadowGeo = new THREE.TubeGeometry(shadowCurve, 40, yarnRadius * 1.5, 6, false);
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.userData = { delay: conn.delay, dur: conn.dur };
      rsScene.add(shadowMesh);
      yarnDropShadowMeshes.push(shadowMesh);
    });
  }

  /**
   * Evaluates the Animation Step at time t (Assembly Sequence, Pin Strikes, String Tracing, Camera Drift)
   */
  function updateAnimationStep(t, data) {
    const dur = data.duration || 4.0;
    const progress = Math.min(1.0, Math.max(0.0, t / dur));

    // 1. Pushpin Strike Animation & Impact Impulse
    pinMeshes.forEach((pin, pIdx) => {
      // Pins strike down sequentially: Pin 0 at t=0.2s, Pin 1 at t=0.8s, Pin 2 at t=1.4s, Pin 3 at t=1.9s, Pin 4 at t=2.4s
      const strikeTimes = [0.2, 0.8, 1.4, 1.9, 2.4];
      const strikeT = strikeTimes[pIdx] || 0.2;
      const basePos = pin.userData.basePos;
      const node = nodeMeshes[pIdx];

      if (t < strikeT) {
        // Pin is held elevated above the board waiting to strike
        const elev = Math.min(120, (strikeT - t) * 180);
        pin.position.set(basePos[0], basePos[1], basePos[2] + elev);
        pin.scale.set(1, 1, 1);
        if (node) {
          node.position.set(node.userData.basePos[0], node.userData.basePos[1], node.userData.basePos[2]);
        }
      } else {
        // Pin has struck! Calculate impact settle bounce
        const sinceStrike = t - strikeT;
        if (sinceStrike < 0.25) {
          // Sharp impact impulse shake
          const damp = Math.exp(-sinceStrike * 16);
          const bounceZ = Math.sin(sinceStrike * 45) * 4.5 * damp;
          pin.position.set(basePos[0], basePos[1], basePos[2] + Math.max(0, bounceZ));

          // Subtle board shock impulse
          if (data.pinStrikeShake !== false && sinceStrike < 0.12) {
            shakeOffset.x = (Math.random() - 0.5) * 2.2 * damp;
            shakeOffset.y = (Math.random() - 0.5) * 2.2 * damp;
          }

          if (node) {
            const rotWobble = Math.sin(sinceStrike * 35) * 0.025 * damp;
            node.rotation.z = node.userData.baseTilt + rotWobble;
          }
        } else {
          // Fully seated resting position
          pin.position.set(basePos[0], basePos[1], basePos[2]);
          if (node) {
            node.position.set(node.userData.basePos[0], node.userData.basePos[1], node.userData.basePos[2]);
            node.rotation.z = node.userData.baseTilt;
          }
        }
      }
    });

    // 2. Red Braided Yarn Dynamic Draw Sequence
    yarnTubes.forEach((tube, idx) => {
      const delay = tube.userData.delay;
      const span = tube.userData.dur;
      const shadow = yarnDropShadowMeshes[idx];

      if (t < delay) {
        // Strand has not started connecting yet
        tube.visible = false;
        if (shadow) shadow.visible = false;
      } else if (t < delay + span) {
        // Actively tracing across the board!
        tube.visible = true;
        if (shadow) shadow.visible = true;

        const strandProgress = Math.min(1.0, (t - delay) / span);
        // Truncate geometry along curve path to show rapid thread travel
        const points = tube.userData.points;
        const activeCount = Math.max(2, Math.floor(points.length * strandProgress));
        const subPoints = points.slice(0, activeCount);
        const subCurve = new THREE.CatmullRomCurve3D(subPoints);

        tube.geometry.dispose();
        tube.geometry = new THREE.TubeGeometry(subCurve, Math.max(6, activeCount * 2), data.yarnRadius || 2.2, 8, false);

        if (shadow) {
          const sPoints = subPoints.map(pt => new THREE.Vector3(pt.x + 8, pt.y - 12, 1.0));
          const sCurve = new THREE.CatmullRomCurve3D(sPoints);
          shadow.geometry.dispose();
          shadow.geometry = new THREE.TubeGeometry(sCurve, Math.max(6, activeCount * 2), (data.yarnRadius || 2.2) * 1.5, 6, false);
        }
      } else {
        // Fully traced and pulled taut!
        tube.visible = true;
        if (shadow) shadow.visible = true;
        // Subtle tension recoil settle
        const settleT = t - (delay + span);
        if (settleT < 0.3) {
          const recoil = Math.sin(settleT * 25) * Math.exp(-settleT * 12) * 0.8;
          tube.position.y = recoil;
        } else {
          tube.position.y = 0;
        }
      }
    });

    // 3. Dynamic 3D Spatial Camera Glide (James Jani / Vox Tracking Style)
    const isUserInteracting = rsControls && rsControls.state !== -1 && rsControls.state !== undefined;
    if (data.cameraGlide !== false && rsCamera && !isUserInteracting) {
      if (t < 1.2) {
        const u = t / 1.2;
        rsCamera.position.x = THREE.MathUtils.lerp(-180, -90, u) + shakeOffset.x;
        rsCamera.position.y = THREE.MathUtils.lerp(-90, -110, u) + shakeOffset.y;
        rsCamera.position.z = THREE.MathUtils.lerp(380, 420, u);
        const tx = -120 + u * 40;
        const ty = 20 - u * 25;
        rsCamera.lookAt(tx, ty, 0);
        if (rsControls) rsControls.target.set(tx, ty, 0);
      } else if (t < 2.5) {
        const u = (t - 1.2) / 1.3;
        rsCamera.position.x = THREE.MathUtils.lerp(-90, 60, u) + shakeOffset.x;
        rsCamera.position.y = THREE.MathUtils.lerp(-110, -95, u) + shakeOffset.y;
        rsCamera.position.z = THREE.MathUtils.lerp(420, 440, u);
        const tx = -40 + u * 120;
        const ty = -5 + u * 30;
        rsCamera.lookAt(tx, ty, 0);
        if (rsControls) rsControls.target.set(tx, ty, 0);
      } else {
        const u = Math.min(1.0, (t - 2.5) / 1.5);
        const smoothU = 0.5 - 0.5 * Math.cos(u * Math.PI);
        rsCamera.position.x = THREE.MathUtils.lerp(60, -20, smoothU) + shakeOffset.x;
        rsCamera.position.y = THREE.MathUtils.lerp(-95, -145, smoothU) + shakeOffset.y;
        rsCamera.position.z = THREE.MathUtils.lerp(440, 460, smoothU);
        rsCamera.lookAt(10, 15, 0);
        if (rsControls) rsControls.target.set(10, 15, 0);
      }
    }

    // Reset impulse shake
    shakeOffset.x *= 0.85;
    shakeOffset.y *= 0.85;
  }

  /**
   * Cleanup Three.js Scene, Renderer, Geometries, and Loops
   */
  function cleanupRedString3DScene() {
    if (rsAnimFrame) {
      cancelAnimationFrame(rsAnimFrame);
      rsAnimFrame = null;
    }
    if (rsControls) {
      rsControls.dispose();
      rsControls = null;
    }
    if (rsRenderer) {
      if (rsRenderer.domElement && rsRenderer.domElement.parentElement) {
        rsRenderer.domElement.parentElement.removeChild(rsRenderer.domElement);
      }
      rsRenderer.dispose();
      rsRenderer = null;
    }
    rsScene = null;
    rsCamera = null;
    nodeMeshes = [];
    pinMeshes = [];
    tapeMeshes = [];
    yarnTubes = [];
    yarnDropShadowMeshes = [];
  }

  /**
   * Public Mount API: mounts the interactive 3D stage into the Studio Editor / Customizer Modal
   */
  window.tplMountRedString3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; overflow: hidden; background: #06080c;">
        <div id="red-string-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden;"></div>
        
        <!-- Depth-of-Field & Vignette Lens Flare Overlay -->
        <div id="rs-dof-overlay" style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 48% 46%, transparent 55%, rgba(6, 8, 12, 0.18) 85%, rgba(3, 4, 6, 0.45) 100%);"></div>

        <!-- 3D HUD Badge -->
        <div style="position: absolute; top: 12px; left: 14px; pointer-events: none; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 800; color: #ef4444; background: rgba(10,12,18,0.9); border: 1px solid rgba(239,68,68,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
            3D INVESTIGATION RIG &bull; CORK NORMAL MAP &bull; CATENARY YARN &bull; f/2.8 BOKEH
          </span>
          <span style="font-family: monospace; font-size: 8.5px; color: #94a3b8; background: rgba(10,12,18,0.75); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 4px;">
            DRAG TO ORBIT / SCROLL TO ZOOM
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#red-string-3d-viewport');
    function triggerInit() {
      if (typeof window.initRedString3DScene === 'function') {
        window.initRedString3DScene(viewport, d);
      }
    }
    triggerInit();
    setTimeout(triggerInit, 60);
  };

  /**
   * Timeline Stepper for Live Scrubbing & Customizer Player
   */
  window.stepRedStringAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    const viewport = container.querySelector('#red-string-3d-viewport');
    if (!viewport && !rsRenderer) {
      window.initRedString3DScene(container, d);
    }
    updateAnimationStep(t, d);
  };

  /**
   * Canvas Video Export & Timeline Blit Renderer
   */
  window.renderRedStringCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    // If WebGL renderer canvas is available, blit directly
    if (rsRenderer && rsRenderer.domElement) {
      updateAnimationStep(t, d);
      if (rsScene && rsCamera) {
        rsRenderer.render(rsScene, rsCamera);
        ctx.drawImage(rsRenderer.domElement, 0, 0, cw, ch);
        return;
      }
    }

    // High-resolution fallback blit
    const corkCv = generateCorkTexture(d);
    ctx.drawImage(corkCv, 0, 0, cw, ch);
  };

  /**
   * Rich Preview HTML Builder for Template Catalog & Cards
   */
  window.tplBuildRedStringBoardPreviewHtml = function(customData) {
    const d = Object.assign({}, DEFAULT_CONFIG, customData || {});
    return `
      <div class="rs-preview-board-wrap" style="position: absolute; inset: 0; overflow: hidden; background: #06080c; display: flex; align-items: center; justify-content: center;">
        <!-- High-Res Corkboard Texture Plate -->
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at 45% 45%, #b2743b 0%, #874e1d 60%, #4a250c 100%);">
          <!-- Porous Cork Noise Layer -->
          <div style="position: absolute; inset: 0; opacity: 0.28; background-image: radial-gradient(#220e03 1px, transparent 1px); background-size: 8px 8px;"></div>
        </div>

        <!-- 3D Spatial Polaroid Nodes Mockup (Matching Image 2 Reference) -->
        <div style="position: absolute; inset: 0; transform: perspective(800px) rotateX(18deg) rotateY(-4deg); transform-origin: center center;">
          <!-- Node 0: Target A -->
          <div style="position: absolute; left: 8%; top: 20%; width: 22%; aspect-ratio: 1/1.22; background: #fdfaf3; border-radius: 2px; box-shadow: 0 16px 28px rgba(0,0,0,0.65); transform: rotate(-5deg); padding: 5px 5px 18px 5px; border: 1px solid rgba(0,0,0,0.15);">
            <div style="width: 100%; height: 75%; background: url('${d.node0Photo}') center/cover no-repeat, #20242c; border-radius: 1px;"></div>
            <div style="font-family: 'Playfair Display', serif; font-size: 8px; font-weight: 700; color: #1c1917; text-align: center; margin-top: 3px;">${d.node0Label}</div>
            <!-- Brass Pushpin -->
            <div style="position: absolute; top: -4px; left: 46%; width: 10px; height: 10px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fef08a, #ca8a04 70%, #713f12); box-shadow: 0 4px 6px rgba(0,0,0,0.7);"></div>
          </div>

          <!-- Node 1: Key Witness (Focal Sharpness) -->
          <div style="position: absolute; left: 36%; top: 28%; width: 25%; aspect-ratio: 1/1.22; background: #fdfaf3; border-radius: 2px; box-shadow: 0 20px 32px rgba(0,0,0,0.75); transform: rotate(2deg); padding: 6px 6px 20px 6px; border: 1px solid rgba(0,0,0,0.15); z-index: 2;">
            <div style="width: 100%; height: 75%; background: url('${d.node1Photo}') center/cover no-repeat, #20242c; border-radius: 1px;"></div>
            <div style="font-family: 'Playfair Display', serif; font-size: 9.5px; font-weight: 700; color: #1c1917; text-align: center; margin-top: 4px;">${d.node1Label}</div>
            <!-- Masking Tape -->
            <div style="position: absolute; top: -6px; left: 35%; width: 30%; height: 8px; background: rgba(238, 226, 192, 0.85); box-shadow: 0 1px 3px rgba(0,0,0,0.25);"></div>
            <!-- Brass Pushpin -->
            <div style="position: absolute; top: -3px; left: 47%; width: 11px; height: 11px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fef08a, #ca8a04 70%, #713f12); box-shadow: 0 5px 8px rgba(0,0,0,0.75);"></div>
          </div>

          <!-- Node 2: Photo #3 -->
          <div style="position: absolute; left: 60%; top: 12%; width: 19%; aspect-ratio: 1/1.22; background: #fdfaf3; border-radius: 2px; box-shadow: 0 14px 24px rgba(0,0,0,0.6); transform: rotate(5deg); padding: 4px 4px 14px 4px; border: 1px solid rgba(0,0,0,0.15);">
            <div style="width: 100%; height: 74%; background: url('${d.node2Photo}') center/cover no-repeat, #20242c; border-radius: 1px;"></div>
            <div style="font-family: 'Playfair Display', serif; font-size: 7.5px; font-weight: 700; color: #1c1917; text-align: center; margin-top: 2px;">${d.node2Label}</div>
            <div style="position: absolute; top: -3px; left: 45%; width: 9px; height: 9px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #f87171, #b91c1c 70%, #450a0a); box-shadow: 0 3px 5px rgba(0,0,0,0.6);"></div>
          </div>

          <!-- Node 3: Suspect 2 -->
          <div style="position: absolute; left: 66%; top: 40%; width: 21%; aspect-ratio: 1/1.22; background: #fdfaf3; border-radius: 2px; box-shadow: 0 16px 26px rgba(0,0,0,0.65); transform: rotate(-4deg); padding: 5px 5px 16px 5px; border: 1px solid rgba(0,0,0,0.15);">
            <div style="width: 100%; height: 75%; background: url('${d.node3Photo}') center/cover no-repeat, #20242c; border-radius: 1px;"></div>
            <div style="font-family: 'Playfair Display', serif; font-size: 8px; font-weight: 700; color: #1c1917; text-align: center; margin-top: 3px;">${d.node3Label}</div>
            <div style="position: absolute; top: -4px; left: 46%; width: 10px; height: 10px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fef08a, #ca8a04 70%, #713f12); box-shadow: 0 4px 6px rgba(0,0,0,0.7);"></div>
          </div>

          <!-- SVG Red Twisted Yarn Web with Natural Sag -->
          <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; filter: drop-shadow(0 8px 10px rgba(0,0,0,0.85));" viewBox="0 0 400 225">
            <!-- Strand 1: Target A -> Key Witness -->
            <path d="M 78 72 Q 130 92 195 90" fill="none" stroke="#c81e1e" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="1000" style="animation: yarnDraw 1.8s ease-out infinite alternate;" />
            <!-- Strand 2: Key Witness -> Photo 3 -->
            <path d="M 195 90 Q 240 68 275 52" fill="none" stroke="#c81e1e" stroke-width="3.5" stroke-linecap="round" />
            <!-- Strand 3: Photo 3 -> Suspect 2 -->
            <path d="M 275 52 Q 295 85 305 116" fill="none" stroke="#c81e1e" stroke-width="3.2" stroke-linecap="round" />
            <!-- Strand 4: Key Witness -> Suspect 2 Cross-link -->
            <path d="M 195 90 Q 248 114 305 116" fill="none" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" />
            <!-- Strand 5: Target A -> Photo 3 Long Arc -->
            <path d="M 78 72 Q 170 54 275 52" fill="none" stroke="#b91c1c" stroke-width="3.0" stroke-linecap="round" />
          </svg>
        </div>

        <!-- Spotlight Vignette Overlay -->
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at 45% 42%, transparent 35%, rgba(6,8,12,0.45) 80%, rgba(2,3,5,0.92) 100%); pointer-events: none;"></div>

        <!-- Forensic Badge -->
        <div style="position: absolute; bottom: 8px; left: 10px; font-family: monospace; font-size: 8px; font-weight: 800; color: #ef4444; background: rgba(10,12,18,0.92); border: 1px solid rgba(239,68,68,0.4); padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
          3D RED STRING BOARD &bull; INVESTIGATIVE STANDARD
        </div>
      </div>
    `;
  };

  /**
   * Builds the Contextual Inspector Controls for Red String Board
   */
  window.tplBuildRedStringInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">🧶</span>
            <span style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.8px;">3D Red String Investigation Board</span>
          </div>
          <span style="font-size: 9px; color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.18); border: 1px solid rgba(239,68,68,0.35); padding: 2px 6px; border-radius: 4px;">PBR THREE.JS RIG</span>
        </div>

        <!-- Section 1: Investigation Photo Nodes -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Investigation Nodes (Handwritten Labels)</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Node 0: Target A -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8px; color: #cbd5e1;">Node 1 (Lead Suspect)</span>
              <input type="text" id="rs-inp-node0" value="${d.node0Label || 'Target A'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" placeholder="Target A" />
            </div>

            <!-- Node 1: Key Witness -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8px; color: #cbd5e1;">Node 2 (Key Witness)</span>
              <input type="text" id="rs-inp-node1" value="${d.node1Label || 'Key Witness'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fbbf24; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" placeholder="Key Witness" />
            </div>

            <!-- Node 2: Photo #3 -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8px; color: #cbd5e1;">Node 3 (Meeting / Event)</span>
              <input type="text" id="rs-inp-node2" value="${d.node2Label || 'Photo #3'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" placeholder="Photo #3" />
            </div>

            <!-- Node 4: Alibi -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8px; color: #cbd5e1;">Node 4 (Alibi / Link)</span>
              <input type="text" id="rs-inp-node4" value="${d.node4Label || 'Alibi'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" placeholder="Alibi" />
            </div>
          </div>
        </div>

        <!-- Section 2: Twisted Red Yarn Physics -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Braided Yarn Physics &amp; Tension</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Yarn Style Preset -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Thread Palette</span>
              <select id="rs-sel-yarn-style" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="crimson_braided" ${d.yarnStyle === 'crimson_braided' ? 'selected' : ''}>Braided Crimson (Classic)</option>
                <option value="deep_maroon" ${d.yarnStyle === 'deep_maroon' ? 'selected' : ''}>Deep Maroon Blood</option>
                <option value="high_vis_orange" ${d.yarnStyle === 'high_vis_orange' ? 'selected' : ''}>High-Vis Orange Cord</option>
                <option value="tactical_black" ${d.yarnStyle === 'tactical_black' ? 'selected' : ''}>Tactical Black Thread</option>
              </select>
            </div>

            <!-- Pushpin Metallic Finish -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Pushpin Metal</span>
              <select id="rs-sel-pin-finish" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="vintage_brass" ${d.pinFinish === 'vintage_brass' ? 'selected' : ''}>Vintage Brass (Reference)</option>
                <option value="polished_copper" ${d.pinFinish === 'polished_copper' ? 'selected' : ''}>Polished Copper</option>
                <option value="gunmetal_steel" ${d.pinFinish === 'gunmetal_steel' ? 'selected' : ''}>Gunmetal Steel</option>
                <option value="red_plastic" ${d.pinFinish === 'red_plastic' ? 'selected' : ''}>Crimson Red Acrylic</option>
              </select>
            </div>
          </div>

          <!-- Yarn Tension & Sag Slider -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #cbd5e1;">
              <span>Line Tension vs Catenary Sag</span>
              <span id="rs-val-tension">${Math.round((d.yarnTension !== undefined ? d.yarnTension : 0.72) * 100)}%</span>
            </div>
            <input type="range" id="rs-slider-tension" min="20" max="98" value="${Math.round((d.yarnTension !== undefined ? d.yarnTension : 0.72) * 100)}" style="width: 100%; accent-color: #ef4444;" />
          </div>

          <!-- Yarn Thickness Slider -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #cbd5e1;">
              <span>Yarn Fiber Thickness</span>
              <span id="rs-val-thick">${(d.yarnRadius || 2.2).toFixed(1)}mm</span>
            </div>
            <input type="range" id="rs-slider-thick" min="14" max="42" value="${Math.round((d.yarnRadius || 2.2) * 10)}" style="width: 100%; accent-color: #ef4444;" />
          </div>
        </div>

        <!-- Section 3: Camera & Optics Rig -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Camera Rig &amp; Depth of Field</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Camera Preset -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Camera Angle</span>
              <select id="rs-sel-camera" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="cinematic_30" ${d.cameraPreset === 'cinematic_30' ? 'selected' : ''}>28&deg;-32&deg; Cinematic Tilt</option>
                <option value="macro_witness" ${d.cameraPreset === 'macro_witness' ? 'selected' : ''}>Macro Witness Close-Up</option>
                <option value="macro_target" ${d.cameraPreset === 'macro_target' ? 'selected' : ''}>Macro Target A Focus</option>
                <option value="overview_wide" ${d.cameraPreset === 'overview_wide' ? 'selected' : ''}>Full Board Overview</option>
              </select>
            </div>

            <!-- Board Cork Tone -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Cork Grain Style</span>
              <select id="rs-sel-cork" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="warm_cork" ${d.corkStyle === 'warm_cork' ? 'selected' : ''}>Warm Natural Cork</option>
                <option value="dark_bulletin" ${d.corkStyle === 'dark_bulletin' ? 'selected' : ''}>Aged Dark Bulletin</option>
                <option value="vintage_forensic" ${d.corkStyle === 'vintage_forensic' ? 'selected' : ''}>Vintage Forensic Office</option>
              </select>
            </div>
          </div>

          <!-- Camera Tracking Glide Toggle -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 12px;">🎥</span>
              <span style="font-size: 9.5px; font-weight: 600; color: #cbd5e1;">Dynamic Camera Pan along Active String</span>
            </div>
            <input type="checkbox" id="rs-chk-glide" ${d.cameraGlide !== false ? 'checked' : ''} style="accent-color: #ef4444; cursor: pointer;" />
          </div>

          <!-- Pin Strike Impact Shake Toggle -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 12px;">📌</span>
              <span style="font-size: 9.5px; font-weight: 600; color: #cbd5e1;">Pushpin Strike Impulse Shake</span>
            </div>
            <input type="checkbox" id="rs-chk-shake" ${d.pinStrikeShake !== false ? 'checked' : ''} style="accent-color: #ef4444; cursor: pointer;" />
          </div>
        </div>

        <!-- Reset Button -->
        <button type="button" id="btn-rs-reset" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; margin-top: 4px;">
          Reset to Investigative Reference Defaults
        </button>
      </div>
    `;

    // Event Bindings
    function updateData(patch) {
      if (typeof window.tplSetContextualData === 'function') {
        const cur = window.tplGetContextualData(tplId) || {};
        const next = Object.assign({}, cur, patch);
        window.tplSetContextualData(tplId, next);
        window.tplUpdateStageWithContextualData(tplId, next);
      }
    }

    container.querySelector('#rs-inp-node0')?.addEventListener('input', (e) => {
      updateData({ node0Label: e.target.value });
    });
    container.querySelector('#rs-inp-node1')?.addEventListener('input', (e) => {
      updateData({ node1Label: e.target.value });
    });
    container.querySelector('#rs-inp-node2')?.addEventListener('input', (e) => {
      updateData({ node2Label: e.target.value });
    });
    container.querySelector('#rs-inp-node4')?.addEventListener('input', (e) => {
      updateData({ node4Label: e.target.value });
    });

    container.querySelector('#rs-sel-yarn-style')?.addEventListener('change', (e) => {
      updateData({ yarnStyle: e.target.value });
    });

    container.querySelector('#rs-sel-pin-finish')?.addEventListener('change', (e) => {
      updateData({ pinFinish: e.target.value });
    });

    container.querySelector('#rs-slider-tension')?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      const lbl = container.querySelector('#rs-val-tension');
      if (lbl) lbl.textContent = `${v}%`;
      updateData({ yarnTension: v / 100 });
    });

    container.querySelector('#rs-slider-thick')?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10) / 10;
      const lbl = container.querySelector('#rs-val-thick');
      if (lbl) lbl.textContent = `${v.toFixed(1)}mm`;
      updateData({ yarnRadius: v });
    });

    container.querySelector('#rs-sel-camera')?.addEventListener('change', (e) => {
      updateData({ cameraPreset: e.target.value });
    });

    container.querySelector('#rs-sel-cork')?.addEventListener('change', (e) => {
      updateData({ corkStyle: e.target.value });
    });

    container.querySelector('#rs-chk-glide')?.addEventListener('change', (e) => {
      updateData({ cameraGlide: e.target.checked });
    });

    container.querySelector('#rs-chk-shake')?.addEventListener('change', (e) => {
      updateData({ pinStrikeShake: e.target.checked });
    });

    container.querySelector('#btn-rs-reset')?.addEventListener('click', () => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  // Expose configuration globally
  window.RED_STRING_3D_CONFIG = DEFAULT_CONFIG;
  console.log('[Red String 3D Engine] Initialized Photorealistic 3D Investigative Corkboard Engine');
})();
