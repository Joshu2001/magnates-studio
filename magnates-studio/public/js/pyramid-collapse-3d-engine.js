/**
 * Photorealistic 3D Pyramid Collapse Engine (Vox / James Jani / Magnates Media Standard)
 * High-end documentary storytelling engine replacing flat 2D vector diagrams with:
 *
 * Model A: 3D Tactical Wireframe & Data-Matrix Breakdown (VOX / Investigative Standard)
 *  - Translucent glowing data-grid matrix structure with illuminated binary code packets
 *  - Dark tactical blueprint map grid backdrop with topographic coordinate contours and crosshairs
 *  - Concentric glowing radar rings with rotational beam pulse
 *  - Dynamic node failure shattering into binary data particles (0100110 corrupted to 0X1F)
 *  - 3D perspective projected tier labels (STRUCTURE UNSUSTAINABLE, FOUNDER, etc.)
 *
 * Model B: Brutalist Concrete Demolition (Creator Drama / James Jani Standard)
 *  - Photorealistic brutalist concrete pyramid with 4 stacked slabs (Founder, Investors, Adopters, Last 90%)
 *  - Heavy concrete micro-grain, normal/bevel maps, embossed stone lettering
 *  - Glowing cyan binary data matrix strip illuminating between Tier 3 & 4
 *  - Dynamic fracture demolition at the base 'Last 90%' level: tumbled concrete rubble, gravel field
 *  - Exposed structural steel rebar rods jutting from fractured core
 *  - Monumental volumetric dust cloud billowing upward catching warm overhead spotlight
 *
 * Seamless One-Click Switcher between Model A and Model B in contextual inspector.
 * Full 3D OrbitControls (drag to tilt/orbit), timeline scrubbing, and 4K canvas export.
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'pyramid-scheme';

  // Default Doc-Drama Collapse Configuration
  const DEFAULT_CONFIG = {
    type: 'pyramid-scheme',
    is3DMode: true,
    styleMode: 'concrete', // 'concrete' (James Jani, Image 3) or 'matrix' (Vox, Image 4)
    cameraPitch: 28,
    cameraYaw: -12,
    headlineText: 'STRUCTURE UNSUSTAINABLE',
    tier1Text: 'FOUNDER',
    tier2Text: 'EARLY INVESTORS \u00b7 +400%',
    tier3Text: 'LATE ADOPTERS \u00b7 BREAK-EVEN',
    tier4Text: 'LAST 90% \u00b7 TOTAL LOSS',
    tier1Val: 'FOUNDER',
    tier2Val: '+400%',
    tier3Val: 'BREAK-EVEN',
    tier4Val: 'TOTAL LOSS',
    collapseProgress: 0.82, // 0.0 (intact) to 1.0 (maximum demolition)
    dustIntensity: 1.0,
    showBinaryGlow: true,
    showRebar: true,
    showRadar: true,
    matrixHue: '#2effc6', // Cyan/Emerald green
    matrixCorruptedHue: '#ef4444', // Red warning glitch
    spotlightWarmth: '#fff3db',
    spotlightIntensity: 2.3,
    duration: 3.0
  };

  // Three.js Scene References
  let pcScene = null;
  let pcCamera = null;
  let pcRenderer = null;
  let pcAnimFrame = null;
  let pcControls = null;
  let pcGroup = null;

  // Meshes & Systems
  let groundMesh = null;
  let shadowMesh = null;
  let tierMeshes = [];
  let binaryStripMesh = null;
  let rubbleMeshes = [];
  let rebarMeshes = [];
  let dustParticles = null;
  let radarMesh = null;
  let wireframeLines = [];
  let matrixNodePoints = null;
  let labelSprites = [];

  // Lighting
  let spotLight = null;
  let ambientLight = null;
  let rimLight = null;
  let matrixPointLight = null;

  // Animation State
  let isManualScrub = false;
  let manualT = 0;
  let animClock = 0;
  let lastTimestamp = 0;

  // Video Mode State
  let videoAnimFrame = null;
  let videoClock = 0;
  let videoLastTimestamp = 0;

  // Texture Cache & Preloading
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

  preloadImage('/pyramid_concrete_plate_clean.png');
  preloadImage('/pyramid_matrix_plate_clean.png');
  preloadImage('/pyramid_concrete_hd_plate.png');
  preloadImage('/pyramid_matrix_hd_plate.png');
  preloadImage('/tactical_desk_hd_plate.png');

  // =========================================================================
  // 1. PROCEDURAL TEXTURE GENERATION
  // =========================================================================

  /**
   * Generates Dark Slate Self-Healing Cutting Mat Texture (Model B Background)
   * High-contrast tactical grid with millimeter tick marks and angle diagonals
   */
  function generateCuttingMatTexture(w = 1024, h = 1024) {
    const key = `mat_tex_${w}x${h}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');

    // Base dark slate tone (#10141b to #0a0d12)
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.7);
    bgGrad.addColorStop(0, '#151b24');
    bgGrad.addColorStop(0.7, '#0d1117');
    bgGrad.addColorStop(1, '#06080b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle cutting mat texture micro-stipple
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }

    // Centimeter & Minor Millimeter Grid Lines
    const step = 48;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Major 5cm Accent Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 1.8;
    for (let x = 0; x <= w; x += step * 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step * 5) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Ruler edge tick marks & millimeter numbering
    ctx.font = '600 10px monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    for (let x = step; x < w; x += step) {
      const cmVal = Math.round(x / step);
      ctx.fillText(`${cmVal}`, x + 4, 16);
      ctx.fillRect(x - 0.5, 0, 1, 8);
    }
    for (let y = step; y < h; y += step) {
      const cmVal = Math.round(y / step);
      ctx.fillText(`${cmVal}`, 6, y + 12);
      ctx.fillRect(0, y - 0.5, 8, 1);
    }

    // Cutting mat 45-degree angle guides
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5); ctx.lineTo(w * 0.5, 0);
    ctx.moveTo(0, h); ctx.lineTo(w, 0);
    ctx.moveTo(w * 0.5, h); ctx.lineTo(w, h * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosshairs (+) at key junctions
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    const crosses = [
      [w * 0.25, h * 0.25], [w * 0.75, h * 0.25],
      [w * 0.25, h * 0.75], [w * 0.75, h * 0.75],
      [w * 0.5, h * 0.5]
    ];
    crosses.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
      ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    textureCache.set(key, tex);
    return tex;
  }

  /**
   * Generates Multi-Layered Investigative Blueprint Map Grid (Model A Background)
   * Topographic coordinate contour lines, network crosshairs, and digital telemetry
   */
  function generateTacticalMapTexture(w = 1024, h = 1024) {
    const key = `tactical_map_tex_${w}x${h}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');

    // Deep blue-black investigative backdrop
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.72);
    grad.addColorStop(0, '#091522');
    grad.addColorStop(0.65, '#040b13');
    grad.addColorStop(1, '#020508');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Fine coordinate grid lines
    ctx.strokeStyle = 'rgba(46, 255, 198, 0.08)';
    ctx.lineWidth = 1;
    const step = 42;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Topographic Elevation Contours (curved Bézier loops)
    ctx.strokeStyle = 'rgba(46, 255, 198, 0.16)';
    ctx.lineWidth = 1.3;
    const drawContour = (cx, cy, rx, ry, seed) => {
      ctx.beginPath();
      const numPts = 24;
      for (let i = 0; i <= numPts; i++) {
        const theta = (i / numPts) * Math.PI * 2;
        const wobble = Math.sin(theta * 3 + seed) * 12 + Math.cos(theta * 5) * 8;
        const px = cx + Math.cos(theta) * (rx + wobble);
        const py = cy + Math.sin(theta) * (ry + wobble * 0.7);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    };

    drawContour(w * 0.35, h * 0.45, 180, 110, 1.2);
    drawContour(w * 0.35, h * 0.45, 260, 170, 2.4);
    drawContour(w * 0.35, h * 0.45, 340, 230, 3.8);
    drawContour(w * 0.72, h * 0.65, 160, 120, 4.5);
    drawContour(w * 0.72, h * 0.65, 240, 180, 5.7);

    // Coordinate telemetry text & crosshairs
    ctx.font = '700 9px monospace';
    ctx.fillStyle = 'rgba(46, 255, 198, 0.55)';
    ctx.fillText('COORD // 25\u00b018\'42"N 55\u00b014\'10"E', w * 0.06, h * 0.12);
    ctx.fillText('TACTICAL DATA MATRIX // RECON-STAGE 04', w * 0.06, h * 0.145);
    ctx.fillText('SURVEILLANCE NODE // ACTIVE BREAKPOINT', w * 0.65, h * 0.88);
    ctx.fillText('GRID REF // 0x7F2A \u00b7 BOKEH f/2.8', w * 0.65, h * 0.905);

    // Crosshairs
    ctx.strokeStyle = 'rgba(46, 255, 198, 0.35)';
    ctx.lineWidth = 1.4;
    [[w * 0.15, h * 0.3], [w * 0.85, h * 0.3], [w * 0.2, h * 0.8], [w * 0.8, h * 0.75]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy);
      ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12);
      ctx.stroke();
      ctx.strokeRect(cx - 3, cy - 3, 6, 6);
    });

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    textureCache.set(key, tex);
    return tex;
  }

  /**
   * Generates Brutalist Concrete Slab Face Texture with Embossed Lettering
   * Tier 1: "FOUNDER" (Carved Stone)
   * Tier 2: "EARLY INVESTORS +400%" (Warm Gold Embossed)
   * Tier 3: "LATE ADOPTERS - BREAK-EVEN" (Crisp Off-White Stone)
   * Tier 4: "LAST 90%" (and crumbling "LOSS")
   */
  function generateConcreteSlabTexture(tierIndex, mainText, valText, w = 1024, h = 256, isFractured = false) {
    const key = `conc_slab_${tierIndex}_${mainText}_${valText}_${isFractured ? 'fx' : 'solid'}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');

    // 1. Concrete Base Tone & Gradient Patina
    const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (tierIndex === 0) {
      baseGrad.addColorStop(0, '#c7c2b5');
      baseGrad.addColorStop(0.5, '#aba597');
      baseGrad.addColorStop(1, '#8f887b');
    } else if (tierIndex === 1) {
      baseGrad.addColorStop(0, '#b8b2a3');
      baseGrad.addColorStop(0.5, '#9e9788');
      baseGrad.addColorStop(1, '#7e7769');
    } else if (tierIndex === 2) {
      baseGrad.addColorStop(0, '#9c9586');
      baseGrad.addColorStop(0.5, '#7f7869');
      baseGrad.addColorStop(1, '#655e50');
    } else {
      baseGrad.addColorStop(0, '#827a6c');
      baseGrad.addColorStop(0.5, '#696153');
      baseGrad.addColorStop(1, '#4e473a');
    }
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Concrete Aggregate Micro-Pores & Fissure Noise
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
      pix[i] = Math.min(255, Math.max(0, pix[i] + noise));
      pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + noise));
      pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Beveled Slab Edges (Top highlight, bottom shadow)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(0, 0, w, 5);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, h - 7, w, 7);

    // Vertical seam grooves on wide blocks
    if (tierIndex >= 2) {
      const seams = tierIndex === 2 ? [w * 0.33, w * 0.67] : [w * 0.25, w * 0.5, w * 0.75];
      seams.forEach(sx => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(sx, 0, 3, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fillRect(sx + 3, 0, 1.5, h);
      });
    }

    // 4. Fine Surface Cracks & Fissures
    ctx.strokeStyle = 'rgba(20, 15, 10, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(w * 0.18, 0);
    ctx.lineTo(w * 0.20, h * 0.35);
    ctx.lineTo(w * 0.19, h * 0.7);
    ctx.lineTo(w * 0.22, h);
    ctx.stroke();

    if (tierIndex === 3) {
      // Violent diagonal fracture crack on Tier 4 (Last 90%)
      ctx.strokeStyle = 'rgba(10, 8, 5, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.58, 0);
      ctx.lineTo(w * 0.63, h * 0.4);
      ctx.lineTo(w * 0.68, h * 0.75);
      ctx.lineTo(w * 0.75, h);
      ctx.stroke();

      // Secondary fissures
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(w * 0.63, h * 0.4);
      ctx.lineTo(w * 0.72, h * 0.3);
      ctx.moveTo(w * 0.68, h * 0.75);
      ctx.lineTo(w * 0.82, h * 0.85);
      ctx.stroke();
    }

    // 5. Authentic Embossed Heavy Typography
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fullText = valText ? `${mainText} ${valText}` : mainText;
    const fontSize = tierIndex === 0 ? 54 : (tierIndex === 1 ? 46 : (tierIndex === 2 ? 40 : 42));
    ctx.font = `900 ${fontSize}px "JetBrains Mono", "Inter", sans-serif`;

    const textX = w * 0.5;
    const textY = h * 0.52;

    // Emboss: Deep Drop Shadow (carved into stone)
    ctx.fillStyle = 'rgba(10, 8, 6, 0.85)';
    ctx.fillText(fullText, textX + 2.5, textY + 3.5);

    // Emboss: Top inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fillText(fullText, textX - 1.5, textY - 1.5);

    // Main Fill Color
    if (tierIndex === 0) {
      ctx.fillStyle = '#f8fafc'; // Founder: Bright stone white
    } else if (tierIndex === 1) {
      ctx.fillStyle = '#f59e0b'; // Early Investors: Warm Amber / Gold
    } else if (tierIndex === 2) {
      ctx.fillStyle = '#f1f5f9'; // Late Adopters: Clean Stone
    } else {
      ctx.fillStyle = '#ef4444'; // Last 90%: Warning Red Loss
    }
    ctx.fillText(fullText, textX, textY);
    ctx.restore();

    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 8;
    textureCache.set(key, tex);
    return tex;
  }

  /**
   * Generates Glowing Cyan Binary Stream Texture
   * Animates glowing binary matrix numbers between Tier 3 and Tier 4
   */
  function generateBinaryStripTexture(w = 1024, h = 96, t = 0) {
    const frameIndex = Math.round((t % 2.0) * 20);
    const key = `bin_strip_${frameIndex}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    // Horizontal cyan glow gradient
    const glowGrad = ctx.createLinearGradient(0, 0, 0, h);
    glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
    glowGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.45)');
    glowGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    glowGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.45)');
    glowGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // Streaming binary numbers
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;

    const baseBin = '010101010  1010101011  001100101  010010010  110100101  010101101  001010101  111000101';
    const shift = Math.floor((t * 24) % baseBin.length);
    const stream = baseBin.slice(shift) + '  ' + baseBin.slice(0, shift);

    ctx.fillText(stream, 18, h * 0.62);
    ctx.fillText(stream, -w * 0.4, h * 0.62);

    const tex = new THREE.CanvasTexture(cv);
    textureCache.set(key, tex);
    return tex;
  }

  /**
   * Generates Soft Radial Dust / Smoke Particle Sprite
   */
  function generateDustSprite() {
    const key = 'dust_sprite_tex';
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 128; cv.height = 128;
    const ctx = cv.getContext('2d');

    const rad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    rad.addColorStop(0, 'rgba(245, 235, 220, 0.85)');
    rad.addColorStop(0.35, 'rgba(215, 200, 180, 0.45)');
    rad.addColorStop(0.7, 'rgba(175, 160, 140, 0.15)');
    rad.addColorStop(1, 'rgba(150, 135, 120, 0)');

    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(cv);
    textureCache.set(key, tex);
    return tex;
  }

  /**
   * Generates Projected 3D Perspective Matrix Label (Model A - Vox Standard)
   */
  function generateMatrixLabelCanvas(text, valText, color = '#2effc6', isWarning = false) {
    const cv = document.createElement('canvas');
    cv.width = 768; cv.height = 128;
    const ctx = cv.getContext('2d');

    ctx.clearRect(0, 0, cv.width, cv.height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 44px "JetBrains Mono", "Space Grotesk", sans-serif';

    const full = valText ? `${text}  ${valText}` : text;

    // Glowing Neon Shadow
    ctx.shadowColor = isWarning ? '#ff3b30' : color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = isWarning ? '#ff4d4d' : color;
    ctx.fillText(full, cv.width * 0.5, cv.height * 0.5);

    // Crisp White Core
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(full, cv.width * 0.5, cv.height * 0.5);

    const tex = new THREE.CanvasTexture(cv);
    return tex;
  }

  // =========================================================================
  // 2. 3D SCENE BUILDERS (BRUTALIST CONCRETE vs TACTICAL MATRIX)
  // =========================================================================

  /**
   * Builds Model B: Photorealistic Brutalist Concrete Demolition (James Jani Standard)
   */
  function buildConcreteScene(data, t) {
    if (!pcScene) return;

    // 1. Cutting Mat Desk Plane
    const groundGeo = new THREE.PlaneGeometry(620, 480);
    const groundMat = new THREE.MeshStandardMaterial({
      map: generateCuttingMatTexture(1024, 1024),
      roughness: 0.88,
      metalness: 0.05
    });
    groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -2, 0);
    groundMesh.receiveShadow = true;
    pcGroup.add(groundMesh);

    // 2. Ambient Contact Shadow beneath Pyramid
    const shadowGeo = new THREE.PlaneGeometry(380, 380);
    const sCv = document.createElement('canvas');
    sCv.width = 256; sCv.height = 256;
    const sCtx = sCv.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 30, 128, 128, 124);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    sGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.4)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(sCv),
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.2, 0);
    pcGroup.add(shadowMesh);

    // 3. Four Stacked Brutalist Concrete Slabs
    // Dimensions: [Width, Depth, Height, Elevation Y]
    const tiersConfig = [
      { w: 74, d: 74, h: 26, y: 78, text: data.tier1Text || 'FOUNDER', val: '' },
      { w: 136, d: 136, h: 26, y: 52, text: data.tier2Text ? data.tier2Text.split('·')[0].trim() : 'EARLY INVESTORS', val: '+400%' },
      { w: 198, d: 198, h: 26, y: 26, text: data.tier3Text ? data.tier3Text.split('·')[0].trim() : 'LATE ADOPTERS', val: 'BREAK-EVEN' },
      { w: 262, d: 262, h: 26, y: 0, text: data.tier4Text ? data.tier4Text.split('·')[0].trim() : 'LAST 90%', val: 'TOTAL LOSS' }
    ];

    tierMeshes = [];
    tiersConfig.forEach((cfg, idx) => {
      const slabGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);

      // Create multi-material for realistic sides and front face
      const frontTex = generateConcreteSlabTexture(idx, cfg.text, cfg.val, 1024, 256, idx === 3);
      const sideTex = generateConcreteSlabTexture(idx, '', '', 512, 256, false);

      const sideMat = new THREE.MeshStandardMaterial({
        map: sideTex,
        roughness: 0.92,
        metalness: 0.04
      });
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        roughness: 0.88,
        metalness: 0.05
      });
      const topMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#948d7f'),
        roughness: 0.94,
        metalness: 0.03
      });

      // Materials array: [right, left, top, bottom, front (+Z), back (-Z)]
      const mats = [sideMat, sideMat, topMat, sideMat, frontMat, sideMat];
      const mesh = new THREE.Mesh(slabGeo, mats);
      mesh.position.set(0, cfg.y + cfg.h * 0.5, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Slight structural displacement for collapsed Tier 4
      if (idx === 3) {
        mesh.userData.basePos = mesh.position.clone();
      }

      tierMeshes.push(mesh);
      pcGroup.add(mesh);
    });

    // 4. Glowing Cyan Binary Data Strip between Tier 3 & Tier 4
    if (data.showBinaryGlow !== false) {
      const stripGeo = new THREE.PlaneGeometry(245, 12);
      const stripMat = new THREE.MeshBasicMaterial({
        map: generateBinaryStripTexture(1024, 96, t),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      binaryStripMesh = new THREE.Mesh(stripGeo, stripMat);
      binaryStripMesh.position.set(0, 26, 100);
      pcGroup.add(binaryStripMesh);
    }

    // 5. Dynamic Fractured Concrete Rubble & Debris Chunks (Right corner demolition)
    rubbleMeshes = [];
    const debrisCount = 28;
    const debrisColors = ['#696153', '#5a5347', '#4b453b', '#7a7263', '#857d6e'];

    for (let i = 0; i < debrisCount; i++) {
      const sz = 4 + Math.random() * 14;
      const rockGeo = new THREE.DodecahedronGeometry(sz, 0);
      // Deform vertices for jagged natural stone chunks
      const posAttr = rockGeo.attributes.position;
      for (let j = 0; j < posAttr.count; j++) {
        posAttr.setXYZ(
          j,
          posAttr.getX(j) * (0.8 + Math.random() * 0.4),
          posAttr.getY(j) * (0.8 + Math.random() * 0.4),
          posAttr.getZ(j) * (0.8 + Math.random() * 0.4)
        );
      }
      rockGeo.computeVertexNormals();

      const rockMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(debrisColors[i % debrisColors.length]),
        roughness: 0.95,
        metalness: 0.05
      });

      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.castShadow = true;
      rock.receiveShadow = true;

      // Position scattered around right & front-right base (x: +80 to +160, z: +20 to +110)
      const scatterX = 85 + Math.random() * 75;
      const scatterZ = 20 + Math.random() * 95;
      const scatterY = sz * 0.5;

      rock.position.set(scatterX, scatterY, scatterZ);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      rock.userData.initPos = new THREE.Vector3(scatterX, scatterY, scatterZ);
      rock.userData.targetPos = new THREE.Vector3(scatterX + Math.random() * 20, scatterY, scatterZ + Math.random() * 20);

      rubbleMeshes.push(rock);
      pcGroup.add(rock);
    }

    // 6. Structural Steel Rebar Rods
    if (data.showRebar !== false) {
      rebarMeshes = [];
      const rebarMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#334155'),
        roughness: 0.65,
        metalness: 0.8
      });

      const rebarCoords = [
        { x: 92, y: 14, z: 98, rx: 0.4, rz: 0.6, len: 32 },
        { x: 104, y: 18, z: 88, rx: -0.3, rz: 0.8, len: 38 },
        { x: 112, y: 10, z: 105, rx: 0.2, rz: 1.1, len: 28 },
        { x: 86, y: 22, z: 82, rx: -0.5, rz: 0.4, len: 35 }
      ];

      rebarCoords.forEach(rb => {
        const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, rb.len, 8);
        const cyl = new THREE.Mesh(cylGeo, rebarMat);
        cyl.position.set(rb.x, rb.y, rb.z);
        cyl.rotation.set(rb.rx, 0, rb.rz);
        cyl.castShadow = true;
        rebarMeshes.push(cyl);
        pcGroup.add(cyl);
      });
    }

    // 7. Volumetric Billowing Dust Cloud Particles
    const dustCount = 45;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      // Cluster dust heavily around the collapse zone (X: 80 to 180, Y: 10 to 110, Z: 20 to 140)
      dustPositions[i * 3] = 90 + Math.random() * 90;
      dustPositions[i * 3 + 1] = 15 + Math.random() * 85;
      dustPositions[i * 3 + 2] = 30 + Math.random() * 90;
      dustSizes[i] = 40 + Math.random() * 55;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustMat = new THREE.PointsMaterial({
      map: generateDustSprite(),
      size: 65,
      transparent: true,
      opacity: 0.48 * (data.dustIntensity || 1.0),
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    dustParticles = new THREE.Points(dustGeo, dustMat);
    pcGroup.add(dustParticles);

    // Apply 3D Camera Angles
    applyCameraRig(data);
  }

  /**
   * Builds Model A: 3D Tactical Wireframe & Data-Matrix Breakdown (Vox Standard)
   */
  function buildMatrixScene(data, t) {
    if (!pcScene) return;

    // 1. Tactical Blueprint Map Backdrop Plane
    const groundGeo = new THREE.PlaneGeometry(620, 480);
    const groundMat = new THREE.MeshStandardMaterial({
      map: generateTacticalMapTexture(1024, 1024),
      roughness: 0.75,
      metalness: 0.1
    });
    groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -2, 0);
    pcGroup.add(groundMesh);

    // 2. Concentric Tactical Radar Scanning Rings
    if (data.showRadar !== false) {
      const radarGeo = new THREE.RingGeometry(40, 165, 48);
      const rCv = document.createElement('canvas');
      rCv.width = 512; rCv.height = 512;
      const rCtx = rCv.getContext('2d');
      rCtx.strokeStyle = 'rgba(46, 255, 198, 0.45)';
      rCtx.lineWidth = 2.5;

      // Concentric circles
      [60, 110, 160, 210].forEach(r => {
        rCtx.beginPath();
        rCtx.arc(256, 256, r, 0, Math.PI * 2);
        rCtx.stroke();
      });

      // Radar sweep wedge
      const sweep = rCtx.createRadialGradient(256, 256, 10, 256, 256, 210);
      sweep.addColorStop(0, 'rgba(46, 255, 198, 0.4)');
      sweep.addColorStop(0.8, 'rgba(46, 255, 198, 0.08)');
      sweep.addColorStop(1, 'rgba(46, 255, 198, 0)');
      rCtx.fillStyle = sweep;
      rCtx.beginPath();
      rCtx.moveTo(256, 256);
      rCtx.arc(256, 256, 210, -0.4, 0.4);
      rCtx.closePath();
      rCtx.fill();

      const radarMat = new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(rCv),
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      radarMesh = new THREE.Mesh(radarGeo, radarMat);
      radarMesh.rotation.x = -Math.PI / 2;
      radarMesh.position.set(0, -1, 0);
      pcGroup.add(radarMesh);
    }

    // 3. 3D Translucent Holographic Wireframe Slabs
    const tiersConfig = [
      { w: 72, d: 72, h: 24, y: 76, label: data.tier1Text || 'FOUNDER', val: '', warn: false },
      { w: 134, d: 134, h: 24, y: 50, label: data.tier2Text || 'EARLY INVESTORS · +400%', val: '', warn: false },
      { w: 196, d: 196, h: 24, y: 24, label: data.tier3Text || 'LATE ADOPTERS · BREAK-EVEN', val: '', warn: true },
      { w: 258, d: 258, h: 24, y: 0, label: data.tier4Text || 'LAST 90% · TOTAL LOSS', val: '', warn: true }
    ];

    wireframeLines = [];
    labelSprites = [];
    const matrixColor = new THREE.Color(data.matrixHue || '#2effc6');

    tiersConfig.forEach((cfg, idx) => {
      // Semi-transparent box body
      const boxGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const boxMat = new THREE.MeshBasicMaterial({
        color: matrixColor,
        transparent: true,
        opacity: 0.12,
        depthWrite: false
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.set(0, cfg.y + cfg.h * 0.5, 0);
      pcGroup.add(box);

      // Glowing Edges
      const edges = new THREE.EdgesGeometry(boxGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: cfg.warn ? new THREE.Color('#ef4444') : matrixColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.95
      });
      const line = new THREE.LineSegments(edges, edgeMat);
      line.position.copy(box.position);
      wireframeLines.push(line);
      pcGroup.add(line);

      // Projected 3D Perspective Labels on front face
      const labelTex = generateMatrixLabelCanvas(cfg.label, cfg.val, data.matrixHue || '#2effc6', cfg.warn);
      const planeGeo = new THREE.PlaneGeometry(cfg.w * 0.95, cfg.h * 0.85);
      const planeMat = new THREE.MeshBasicMaterial({
        map: labelTex,
        transparent: true,
        opacity: 0.95,
        depthWrite: false
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.position.set(0, cfg.y + cfg.h * 0.5, cfg.d * 0.5 + 1.5);
      labelSprites.push(plane);
      pcGroup.add(plane);
    });

    // 4. Headline Label Plane (STRUCTURE UNSUSTAINABLE)
    const hlTex = generateMatrixLabelCanvas(data.headlineText || 'STRUCTURE UNSUSTAINABLE', '', '#ef4444', true);
    const hlGeo = new THREE.PlaneGeometry(160, 24);
    const hlMat = new THREE.MeshBasicMaterial({
      map: hlTex,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });
    const hlMesh = new THREE.Mesh(hlGeo, hlMat);
    hlMesh.position.set(0, 114, 20);
    pcGroup.add(hlMesh);

    // 5. Matrix Nodes at Vertices (Illuminated binary code packets)
    const nodeCoords = [];
    tiersConfig.forEach(cfg => {
      const hw = cfg.w * 0.5;
      const hd = cfg.d * 0.5;
      const y1 = cfg.y;
      const y2 = cfg.y + cfg.h;
      [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].forEach(([x, z]) => {
        nodeCoords.push(x, y1, z);
        nodeCoords.push(x, y2, z);
      });
    });

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodeCoords, 3));

    // Glowing Node Points
    const nCv = document.createElement('canvas');
    nCv.width = 64; nCv.height = 64;
    const nCtx = nCv.getContext('2d');
    const nRad = nCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    nRad.addColorStop(0, '#ffffff');
    nRad.addColorStop(0.3, '#2effc6');
    nRad.addColorStop(0.8, 'rgba(46, 255, 198, 0.4)');
    nRad.addColorStop(1, 'rgba(0,0,0,0)');
    nCtx.fillStyle = nRad;
    nCtx.fillRect(0, 0, 64, 64);

    const nodeMat = new THREE.PointsMaterial({
      map: new THREE.CanvasTexture(nCv),
      size: 14,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    matrixNodePoints = new THREE.Points(nodeGeo, nodeMat);
    pcGroup.add(matrixNodePoints);

    // Apply 3D Camera Angles
    applyCameraRig(data);
  }

  /**
   * Configures 3D Camera Angles & Orbit Controls
   */
  function applyCameraRig(data) {
    if (!pcCamera) return;

    const pitch = (data.cameraPitch !== undefined) ? data.cameraPitch : 28;
    const yaw = (data.cameraYaw !== undefined) ? data.cameraYaw : -12;

    const radPitch = THREE.MathUtils.degToRad(pitch);
    const radYaw = THREE.MathUtils.degToRad(yaw);
    const dist = 320;

    const camY = Math.sin(radPitch) * dist + 35;
    const groundDist = Math.cos(radPitch) * dist;
    const camX = Math.sin(radYaw) * groundDist;
    const camZ = Math.cos(radYaw) * groundDist;

    pcCamera.position.set(camX, camY, camZ);
    pcCamera.lookAt(0, 42, 0);

    if (pcControls) {
      pcControls.target.set(0, 42, 0);
      pcControls.update();
    }
  }

  // =========================================================================
  // 3. MAIN INITIALIZATION & RENDER LOOP
  // =========================================================================

  /**
   * Initializes the Three.js 3D Viewport Scene
   */
  window.initPyramidCollapse3DScene = function(container, data) {
    if (!container) return;
    cleanupPyramidCollapse3DScene();

    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const width = container.clientWidth || 1024;
    const height = container.clientHeight || 576;

    // 1. Scene
    pcScene = new THREE.Scene();
    pcScene.background = new THREE.Color(d.styleMode === 'matrix' ? '#04070e' : '#080a0f');

    // 2. Camera (Focal length ~40° for macro compression)
    pcCamera = new THREE.PerspectiveCamera(38, width / height, 1, 2000);

    // 3. Renderer with high shadow precision
    pcRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    pcRenderer.setSize(width, height);
    pcRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    pcRenderer.shadowMap.enabled = true;
    pcRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    pcRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    pcRenderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(pcRenderer.domElement);

    // 4. Orbit Controls (Interactive Tilt & Rotation)
    if (typeof THREE.OrbitControls !== 'undefined') {
      pcControls = new THREE.OrbitControls(pcCamera, pcRenderer.domElement);
      pcControls.enableDamping = true;
      pcControls.dampingFactor = 0.08;
      pcControls.maxPolarAngle = Math.PI * 0.48; // Don't go below desk
      pcControls.minDistance = 140;
      pcControls.maxDistance = 650;
      pcControls.target.set(0, 42, 0);

      // Listen to user drag orbit and update inspector sliders
      pcControls.addEventListener('change', () => {
        if (!pcCamera) return;
        const offset = pcCamera.position.clone().sub(pcControls.target);
        const dist = offset.length();
        const p = Math.round(THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, offset.y / dist)))));
        const y = Math.round(THREE.MathUtils.radToDeg(Math.atan2(offset.x, offset.z)));

        const pEl = document.getElementById('pc-slider-pitch');
        const yEl = document.getElementById('pc-slider-yaw');
        const pvEl = document.getElementById('pc-val-pitch');
        const yvEl = document.getElementById('pc-val-yaw');
        if (pEl && pvEl) { pEl.value = p; pvEl.textContent = `${p}°`; }
        if (yEl && yvEl) { yEl.value = y; yvEl.textContent = `${y}°`; }
      });
    }

    // 5. Lighting Setup
    ambientLight = new THREE.AmbientLight(d.styleMode === 'matrix' ? '#1e293b' : '#334155', 1.2);
    pcScene.add(ambientLight);

    // Key Directional Spotlight
    spotLight = new THREE.SpotLight(new THREE.Color(d.spotlightWarmth || '#fff3db'), d.spotlightIntensity || 2.3);
    spotLight.position.set(-140, 260, 180);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.6;
    spotLight.decay = 1.5;
    spotLight.distance = 900;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0004;
    pcScene.add(spotLight);

    // Cool Rim Light
    rimLight = new THREE.DirectionalLight(d.styleMode === 'matrix' ? '#2effc6' : '#38bdf8', 1.4);
    rimLight.position.set(180, 160, -140);
    pcScene.add(rimLight);

    // 6. Assembly Group
    pcGroup = new THREE.Group();
    pcScene.add(pcGroup);

    // Build chosen aesthetic model
    if (d.styleMode === 'matrix') {
      buildMatrixScene(d, 0);
    } else {
      buildConcreteScene(d, 0);
    }

    // 7. Render Loop
    lastTimestamp = performance.now();
    function renderLoop(now) {
      pcAnimFrame = requestAnimationFrame(renderLoop);
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock = (animClock + delta) % (d.duration || 3.0);
        updatePyramidAnimationStep(animClock, d);
      } else {
        updatePyramidAnimationStep(manualT, d);
      }

      if (pcControls) pcControls.update();
      if (pcRenderer && pcScene && pcCamera) {
        pcRenderer.render(pcScene, pcCamera);
      }
    }
    pcAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * Updates dynamic 3D elements for timestamp t (0 <= t <= duration)
   */
  function updatePyramidAnimationStep(t, data) {
    const dur = Math.max(1, data.duration || 3.0);
    const ct = Math.max(0, Math.min(dur, t));
    const prog = ct / dur;

    // Dynamic Concrete Demolition Logic (Model B)
    if (data.styleMode === 'concrete') {
      // 1. Binary strip glow pulse & text shift
      if (binaryStripMesh && binaryStripMesh.material && binaryStripMesh.material.map) {
        const binTex = generateBinaryStripTexture(1024, 96, ct);
        if (binaryStripMesh.material.map !== binTex) {
          binaryStripMesh.material.map = binTex;
          binaryStripMesh.material.map.needsUpdate = true;
        }
        // Pulse glow brightness
        binaryStripMesh.material.opacity = 0.75 + Math.sin(ct * 8) * 0.25;
      }

      // 2. Structural failure timing: Intact until t=0.8s, then fractures violently
      const collapsePhase = Math.max(0, (ct - 0.8) / (dur - 0.8));

      // Shake Tier 4 slightly before crash
      if (tierMeshes[3] && tierMeshes[3].userData.basePos) {
        const shake = (ct > 0.6 && ct < 1.1) ? (Math.random() - 0.5) * 1.8 : 0;
        tierMeshes[3].position.x = tierMeshes[3].userData.basePos.x + shake;
        tierMeshes[3].position.z = tierMeshes[3].userData.basePos.z + shake * 0.5;
        // Tilt fractured base slightly downward on the right
        tierMeshes[3].rotation.z = -collapsePhase * 0.04;
      }

      // 3. Rubble scatter & tumble
      if (rubbleMeshes.length > 0) {
        rubbleMeshes.forEach((rock, idx) => {
          if (!rock.userData.initPos) return;
          const p = Math.min(1, collapsePhase * (1.1 + (idx % 5) * 0.15));
          rock.position.lerpVectors(rock.userData.initPos, rock.userData.targetPos, p);
          rock.rotation.x += 0.008 * (1 - p);
          rock.rotation.y += 0.012 * (1 - p);
        });
      }

      // 4. Billowing Dust Drift
      if (dustParticles && dustParticles.geometry) {
        const posAttr = dustParticles.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          let y = posAttr.getY(i) + 0.15 * (1 + collapsePhase);
          if (y > 115) y = 15;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
        dustParticles.material.opacity = Math.min(0.65, 0.25 + collapsePhase * 0.4) * (data.dustIntensity || 1.0);
      }
    }

    // Dynamic Tactical Matrix Breakdown Logic (Model A)
    if (data.styleMode === 'matrix') {
      // 1. Radar Sweep Rotation
      if (radarMesh) {
        radarMesh.rotation.z -= 0.035;
      }

      // 2. Glitch Wireframe Opacity on Base Tiers
      if (wireframeLines.length > 3) {
        const glitch = (Math.random() > 0.85) ? 0.35 : 0.95;
        wireframeLines[3].material.opacity = glitch;
      }

      // 3. Matrix Nodes Pulse
      if (matrixNodePoints) {
        matrixNodePoints.material.size = 12 + Math.sin(ct * 6) * 3;
      }
    }
  }

  /**
   * Cleans up scene resources
   */
  function cleanupPyramidCollapse3DScene() {
    if (pcAnimFrame) {
      cancelAnimationFrame(pcAnimFrame);
      pcAnimFrame = null;
    }
    if (pcRenderer) {
      if (pcRenderer.domElement && pcRenderer.domElement.parentNode) {
        pcRenderer.domElement.parentNode.removeChild(pcRenderer.domElement);
      }
      pcRenderer.dispose();
      pcRenderer = null;
    }
    if (pcControls) {
      pcControls.dispose();
      pcControls = null;
    }
    pcScene = null;
    pcCamera = null;
    groundMesh = null;
    shadowMesh = null;
    binaryStripMesh = null;
    tierMeshes = [];
    rubbleMeshes = [];
    rebarMeshes = [];
    dustParticles = null;
    radarMesh = null;
    wireframeLines = [];
    matrixNodePoints = null;
    labelSprites = [];
  }

  // =========================================================================
  // 4. MOUNTING HOOKS (CUSTOMIZER MODAL INTEGRATION)
  // =========================================================================

  /**
   * Mounts the 3D Pyramid Collapse Stage inside the Customizer Modal
   */
  window.tplMountPyramidCollapse3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    // Automatically expand stage to full theater view in 3D Mode
    if (typeof window.applyModeLayout === 'function') {
      window.applyModeLayout(true);
    }

    const isMatrix = d.styleMode === 'matrix';
    const bgPlate = isMatrix ? '/pyramid_matrix_plate_clean.png' : '/pyramid_concrete_plate_clean.png';

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: ${isMatrix ? '#04070e' : '#080a0f'}; overflow: hidden; cursor: grab; user-select: none;">
        <!-- High-res Instant Plate Backdrop -->
        <img id="pyramid-plate-bg" src="${bgPlate}" alt="Pyramid Collapse Plate" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.28; filter: contrast(120%) brightness(85%);" />

        <!-- 3D Three.js WebGL Viewport -->
        <div id="pyramid-collapse-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>

        <!-- Telemetry & Camera Telemetry HUD Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: ${isMatrix ? '#2effc6' : '#f59e0b'}; background: rgba(10,12,18,0.92); border: 1px solid ${isMatrix ? 'rgba(46,255,198,0.4)' : 'rgba(245,158,11,0.4)'}; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            ${isMatrix ? '❖ 3D TACTICAL WIREFRAME · VOX MATRIX' : '⬡ 3D BRUTALIST CONCRETE · JAMES JANI'}
          </span>
          <span style="font-family: monospace; font-size: 9px; color: #38bdf8; background: rgba(10,12,18,0.85); border: 1px solid rgba(56,189,248,0.3); padding: 3px 6px; border-radius: 4px; font-weight: 700;">
            DRAG TO ORBIT / TILT
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#pyramid-collapse-3d-viewport');
    function triggerInit() {
      if (typeof window.initPyramidCollapse3DScene === 'function') {
        window.initPyramidCollapse3DScene(viewport, d);
      }
    }
    triggerInit();
    setTimeout(triggerInit, 60);
  };

  /**
   * Mounts the Flat 2D Video Stage for Pyramid Collapse (Legacy Mode Fallback)
   */
  window.tplMountPyramidCollapseVideoStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});
    cleanupPyramidCollapse3DScene();

    if (typeof window.applyModeLayout === 'function') {
      window.applyModeLayout(false);
    }

    stage.innerHTML = `
      <div id="pyramid-video-stage" style="position: absolute; inset: 0; background: #0c0808; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <canvas id="pyramid-video-canvas" width="1280" height="720" style="width: 100%; height: 100%; object-fit: contain;"></canvas>
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #ff4757; background: rgba(10,12,18,0.92); border: 1px solid rgba(255,71,87,0.4); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            FLAT VECTOR MODE · 2D INFOGRAPHIC
          </span>
        </div>
      </div>
    `;

    const canvas = stage.querySelector('#pyramid-video-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (videoAnimFrame) { cancelAnimationFrame(videoAnimFrame); videoAnimFrame = null; }
    videoLastTimestamp = performance.now();
    function loopVideo(now) {
      videoAnimFrame = requestAnimationFrame(loopVideo);
      const delta = (now - videoLastTimestamp) / 1000;
      videoLastTimestamp = now;
      videoClock = (videoClock + delta) % (d.duration || 3.0);
      renderPyramidCollapseDirect2D(ctx, d, videoClock, canvas.width, canvas.height);
    }
    videoAnimFrame = requestAnimationFrame(loopVideo);
  };

  /**
   * Direct 2D Canvas Fallback Renderer
   */
  function renderPyramidCollapseDirect2D(ctx, d, t, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0c0808';
    ctx.fillRect(0, 0, w, h);

    // Headline
    ctx.font = '900 24px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ff4757';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText(d.headlineText || 'STRUCTURE UNSUSTAINABLE', w * 0.5, 60);

    // 4 Slabs
    const cx = w * 0.5;
    const cy = h * 0.52;
    const slabs = [
      { topW: 80, botW: 130, h: 42, fill: '#ffd23f', text: d.tier1Text || 'FOUNDER', color: '#000' },
      { topW: 130, botW: 240, h: 46, fill: '#ff8c42', text: d.tier2Text || 'EARLY INVESTORS · +400%', color: '#000' },
      { topW: 240, botW: 360, h: 50, fill: '#c1440e', text: d.tier3Text || 'LATE ADOPTERS · BREAK-EVEN', color: '#fff' },
      { topW: 360, botW: 510, h: 54, fill: '#5a1e1e', text: d.tier4Text || 'LAST 90% · TOTAL LOSS', color: '#ff9d9d' }
    ];

    let currentY = cy - 85;
    slabs.forEach((s, i) => {
      ctx.beginPath();
      ctx.moveTo(cx - s.topW * 0.5, currentY);
      ctx.lineTo(cx + s.topW * 0.5, currentY);
      ctx.lineTo(cx + s.botW * 0.5, currentY + s.h);
      ctx.lineTo(cx - s.botW * 0.5, currentY + s.h);
      ctx.closePath();
      ctx.fillStyle = s.fill;
      ctx.fill();

      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillStyle = s.color;
      ctx.fillText(s.text, cx, currentY + s.h * 0.62);

      currentY += s.h + 6;
    });

    // Stress Crack
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 85);
    ctx.lineTo(cx + 8, cy - 30);
    ctx.lineTo(cx - 10, cy + 25);
    ctx.lineTo(cx + 14, currentY);
    ctx.stroke();
  }

  /**
   * Timeline playback and scrubbing hook
   */
  window.stepPyramidCollapseAnimation = function(container, tplId, t, data) {
    if (tplId !== TEMPLATE_ID) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    isManualScrub = true;
    manualT = t;

    if (pcScene) {
      updatePyramidAnimationStep(t, d);
      if (pcRenderer && pcCamera) {
        pcRenderer.render(pcScene, pcCamera);
      }
    }

    // Direct 2D Video Canvas if active
    const vCv = container ? container.querySelector('#pyramid-video-canvas') : null;
    if (vCv) {
      const vCtx = vCv.getContext('2d');
      renderPyramidCollapseDirect2D(vCtx, d, t, vCv.width, vCv.height);
    }
  };

  /**
   * Canvas Video Export Hook
   */
  window.renderPyramidCollapseCanvas = function(ctx, clip, t, cw, ch) {
    const d = Object.assign({}, DEFAULT_CONFIG, (clip.fxScene && clip.fxScene.contextualData) ? clip.fxScene.contextualData : {});
    renderPyramidCollapseDirect2D(ctx, d, t, cw, ch);
  };

  // =========================================================================
  // 5. CONTEXTUAL INSPECTOR CONTROLS BUILDER
  // =========================================================================

  /**
   * Builds Contextual Inspector with Mode Switcher & Deep Customization
   */
  window.tplBuildPyramidCollapseInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const is3D = d.is3DMode !== false;
    const isConcrete = d.styleMode !== 'matrix';
    const pitch = (d.cameraPitch !== undefined) ? d.cameraPitch : 28;
    const yaw = (d.cameraYaw !== undefined) ? d.cameraYaw : -12;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 4px 0;">
        <!-- Header with Dual Mode Switcher: Brutalist Concrete (Jani) vs Tactical Matrix (Vox) -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 10.5px; font-weight: 800; color: ${isConcrete ? '#f59e0b' : '#2effc6'}; text-transform: uppercase; letter-spacing: 0.6px; display: flex; align-items: center; gap: 4px;">
              <span>${isConcrete ? '⬡' : '❖'}</span> ${isConcrete ? 'Brutalist Concrete' : 'Tactical Matrix'}
            </span>
          </div>

          <!-- Presentation Style Segmented Switcher -->
          <div id="pc-style-switcher" style="display: flex; gap: 2px; background: rgba(18,19,28,0.9); padding: 2px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12);">
            <button type="button" id="btn-pc-mode-concrete" style="padding: 2.5px 8px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${isConcrete ? 'rgba(245,158,11,0.35)' : 'transparent'}; color: ${isConcrete ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="Brutalist Concrete Demolition (James Jani / Creator Drama Standard, Image 3)">⬡ Concrete (Jani)</button>
            <button type="button" id="btn-pc-mode-matrix" style="padding: 2.5px 8px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${!isConcrete ? 'rgba(46,255,198,0.35)' : 'transparent'}; color: ${!isConcrete ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="3D Tactical Wireframe & Data-Matrix Breakdown (Vox / Investigative Standard, Image 4)">❖ Matrix (Vox)</button>
          </div>
        </div>

        <!-- 3D Camera Controls -->
        <div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.32); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 7px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">🎥 3D Camera &amp; Tilt Angle</span>
            <span style="font-size: 8.5px; font-family: monospace; color: #2effc6; font-weight: 700;">DRAG CANVAS TO ORBIT</span>
          </div>

          <!-- Presets -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
            <button type="button" class="pc-3d-preset-btn" data-pitch="28" data-yaw="-12" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Macro (30°)</button>
            <button type="button" class="pc-3d-preset-btn" data-pitch="42" data-yaw="-24" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Isometric (45°)</button>
            <button type="button" class="pc-3d-preset-btn" data-pitch="68" data-yaw="0" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Top-Down</button>
          </div>

          <!-- Pitch Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>TILT PITCH</span>
              <span id="pc-val-pitch" style="font-family: monospace; color: #2effc6; font-weight: 700;">${pitch}°</span>
            </div>
            <input type="range" id="pc-slider-pitch" min="5" max="75" value="${pitch}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
          </div>

          <!-- Yaw Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>ROTATION YAW</span>
              <span id="pc-val-yaw" style="font-family: monospace; color: #2effc6; font-weight: 700;">${yaw}°</span>
            </div>
            <input type="range" id="pc-slider-yaw" min="-60" max="60" value="${yaw}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
          </div>
        </div>

        <!-- Tier Content Customization -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Pyramid Tiers &amp; Headline</span>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Headline Banner</span>
            <input type="text" id="pc-inp-headline" value="${d.headlineText || 'STRUCTURE UNSUSTAINABLE'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 800; padding: 5px 8px; border-radius: 6px; font-size: 10.5px; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Tier 1 (Apex): Founder Block</span>
            <input type="text" id="pc-inp-t1" value="${d.tier1Text || 'FOUNDER'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Tier 2: Early Investors Block</span>
            <input type="text" id="pc-inp-t2" value="${d.tier2Text || 'EARLY INVESTORS · +400%'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #f59e0b; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Tier 3: Late Adopters Block</span>
            <input type="text" id="pc-inp-t3" value="${d.tier3Text || 'LATE ADOPTERS · BREAK-EVEN'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Tier 4 (Base): Last 90% Collapse Block</span>
            <input type="text" id="pc-inp-t4" value="${d.tier4Text || 'LAST 90% · TOTAL LOSS'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 10px; outline: none;" />
          </div>
        </div>

        <!-- Demolition & FX Controls -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Atmosphere &amp; Fracture Dynamics</span>

          <!-- Volumetric Dust Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>VOLUMETRIC DUST CLOUD</span>
              <span id="pc-val-dust" style="font-family: monospace; color: #f59e0b; font-weight: 700;">${Math.round((d.dustIntensity || 1.0) * 100)}%</span>
            </div>
            <input type="range" id="pc-slider-dust" min="0" max="150" value="${Math.round((d.dustIntensity || 1.0) * 100)}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
          </div>

          <!-- Toggles -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="pc-chk-binary" ${d.showBinaryGlow !== false ? 'checked' : ''} style="accent-color: #06b6d4;" />
              <span>Glowing Binary Seam</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="pc-chk-rebar" ${d.showRebar !== false ? 'checked' : ''} style="accent-color: #64748b;" />
              <span>Exposed Steel Rebar</span>
            </label>
          </div>
        </div>

        <!-- Reset Button -->
        <div style="display: flex; gap: 6px; margin-top: 4px;">
          <button type="button" id="btn-pc-reset" style="width: 100%; padding: 6px; font-size: 10px; font-weight: 700; border-radius: 6px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: #94a3b8; cursor: pointer; transition: all 0.2s;">
            ↺ Reset Defaults
          </button>
        </div>
      </div>
    `;

    // Event Listeners
    function updateData(patch) {
      if (typeof window.tplSetContextualData === 'function') {
        const next = window.tplSetContextualData(tplId, patch);
        if (typeof window.tplUpdateStageWithContextualData === 'function') {
          window.tplUpdateStageWithContextualData(tplId, next);
        }
      }
    }

    // Mode Switcher Buttons (Concrete vs Matrix)
    const btnConcrete = container.querySelector('#btn-pc-mode-concrete');
    const btnMatrix = container.querySelector('#btn-pc-mode-matrix');

    btnConcrete?.addEventListener('click', () => {
      textureCache.clear();
      updateData({ styleMode: 'concrete', is3DMode: true });
      window.tplRenderContextualInspector(tplId);
    });

    btnMatrix?.addEventListener('click', () => {
      textureCache.clear();
      updateData({ styleMode: 'matrix', is3DMode: true });
      window.tplRenderContextualInspector(tplId);
    });

    // Pitch & Yaw Sliders
    const pitchSlider = container.querySelector('#pc-slider-pitch');
    const yawSlider = container.querySelector('#pc-slider-yaw');
    const pitchVal = container.querySelector('#pc-val-pitch');
    const yawVal = container.querySelector('#pc-val-yaw');

    pitchSlider?.addEventListener('input', (e) => {
      const p = parseInt(e.target.value, 10);
      if (pitchVal) pitchVal.textContent = `${p}°`;
      updateData({ cameraPitch: p });
      applyCameraRig({ cameraPitch: p, cameraYaw: yawSlider ? parseInt(yawSlider.value, 10) : yaw });
    });

    yawSlider?.addEventListener('input', (e) => {
      const y = parseInt(e.target.value, 10);
      if (yawVal) yawVal.textContent = `${y}°`;
      updateData({ cameraYaw: y });
      applyCameraRig({ cameraPitch: pitchSlider ? parseInt(pitchSlider.value, 10) : pitch, cameraYaw: y });
    });

    // Preset Buttons
    container.querySelectorAll('.pc-3d-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.pitch, 10);
        const y = parseInt(btn.dataset.yaw, 10);
        if (pitchSlider) pitchSlider.value = p;
        if (yawSlider) yawSlider.value = y;
        if (pitchVal) pitchVal.textContent = `${p}°`;
        if (yawVal) yawVal.textContent = `${y}°`;
        updateData({ cameraPitch: p, cameraYaw: y });
        applyCameraRig({ cameraPitch: p, cameraYaw: y });
      });
    });

    // Content Inputs
    container.querySelector('#pc-inp-headline')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ headlineText: e.target.value });
    });
    container.querySelector('#pc-inp-t1')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier1Text: e.target.value });
    });
    container.querySelector('#pc-inp-t2')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier2Text: e.target.value });
    });
    container.querySelector('#pc-inp-t3')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier3Text: e.target.value });
    });
    container.querySelector('#pc-inp-t4')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier4Text: e.target.value });
    });

    // Dust Slider
    container.querySelector('#pc-slider-dust')?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10) / 100;
      const vEl = container.querySelector('#pc-val-dust');
      if (vEl) vEl.textContent = `${Math.round(v * 100)}%`;
      updateData({ dustIntensity: v });
    });

    // Checkboxes
    container.querySelector('#pc-chk-binary')?.addEventListener('change', (e) => {
      updateData({ showBinaryGlow: e.target.checked });
    });
    container.querySelector('#pc-chk-rebar')?.addEventListener('change', (e) => {
      updateData({ showRebar: e.target.checked });
    });

    // Reset Button
    container.querySelector('#btn-pc-reset')?.addEventListener('click', () => {
      textureCache.clear();
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  // Global Config Export
  window.PYRAMID_COLLAPSE_CONFIG = DEFAULT_CONFIG;
  console.log('[Pyramid Collapse 3D Engine] Initialized Doc-Drama Pyramid Demolition Engine');
})();
