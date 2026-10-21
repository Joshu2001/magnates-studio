/**
 * Photorealistic 3D Pyramid Collapse & Crumble Engine (James Jani / Vox / Magnates Media Standard)
 *
 * Professional Documentary Destruction System:
 * 1. Procedural Fracturing & Physics:
 *    - Mode A: Dramatic Crumble & Buckle (Default) - Foundation fractures, base blocks tumble under gravity,
 *              upper slabs tilt and sag, exposed steel rebar bends, volumetric dust billows.
 *    - Mode B: Catastrophic Explosion & Blast - Radial explosive force shattering chunks outward at high speed.
 *    - Mode C: Deep Fault Rift & Sag - Structural crevice splits open with intense binary light leak.
 *    - Mode D: Tactical Wireframe & Data Breakdown - Vox investigative holographic breakdown with corrupted code.
 * 2. Materiality & Shaders:
 *    - Gritty brutalist concrete with coarse aggregate stone grain, normal bump maps, and beveled chipped edges.
 *    - Deep carved / 3D embossed typography with shadow occlusion.
 *    - Glowing cyan/red binary data matrix stream pulsating through fault seams.
 * 3. Professional Granular Controls:
 *    - Action Effect, Crumble Speed, Destruction Intensity, Trigger Timing, Debris Count, Scatter Radius,
 *      Upper Tier Sag, Camera Impact Tremor, Color Themes, Custom Tier Colors, Typography, Volumetric Dust.
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'pyramid-scheme';

  // Default Professional Doc-Drama Configuration
  const DEFAULT_CONFIG = {
    type: 'pyramid-scheme',
    is3DMode: true,
    styleMode: 'concrete', // 'concrete' (Brutalist, Image 3) or 'matrix' (Vox, Image 4)
    actionEffect: 'crumble', // 'crumble' (Default), 'explode', 'fracture_sag', 'matrix_shatter'
    crumbleSpeed: 1.0, // 0.25x to 3.0x
    collapseIntensity: 0.85, // 0.0 (intact) to 1.0 (pulverized)
    fractureStart: 0.6, // Seconds into sequence when fracture begins
    debrisCount: 42, // Number of fractured chunks (15 - 75)
    scatterRadius: 1.0, // Multiplier for debris spread
    upperTierSag: 1.0, // Sag and tilt of upper tiers
    cameraTremor: true, // Impact shake on foundation failure
    cameraPitch: 28,
    cameraYaw: -14,
    headlineText: 'STRUCTURE UNSUSTAINABLE',
    tier1Text: 'FOUNDER',
    tier2Text: 'EARLY INVESTORS · +400%',
    tier3Text: 'LATE ADOPTERS · BREAK-EVEN',
    tier4Text: 'LAST 90% · TOTAL LOSS',
    tier1Color: '#d6d1c7', // Founder stone
    tier2Color: '#e5a43b', // Early investors amber/gold
    tier3Color: '#b8b1a3', // Late adopters neutral stone
    tier4Color: '#963434', // Last 90% warning red
    colorTheme: 'brutalist', // 'brutalist', 'ponzi_heatmap', 'obsidian_gold', 'custom'
    showBinaryGlow: true,
    binaryGlowColor: '#00f0ff',
    binaryGlowIntensity: 1.2,
    showRebar: true,
    dustIntensity: 1.1,
    dustWarmth: '#f5ead8',
    spotlightWarmth: '#fff1d6',
    spotlightIntensity: 2.4,
    duration: 3.5
  };

  // Three.js Scene References
  let pcScene = null;
  let pcCamera = null;
  let pcRenderer = null;
  let pcAnimFrame = null;
  let pcControls = null;
  let pcGroup = null;

  // Structural Objects
  let groundMesh = null;
  let shadowMesh = null;
  let baseTiers = []; // Tiers 0, 1, 2, 3
  let fractureChunks = []; // Dynamically tumbling 3D stone chunks
  let rebarRods = []; // Exposed steel reinforcement
  let binarySeamMesh = null;
  let dustParticleSystem = null;
  let wireframeGroup = null;
  let radarMesh = null;

  // Animation State
  let isManualScrub = false;
  let manualT = 0;
  let animClock = 0;
  let lastTimestamp = 0;
  let tremorOffset = { x: 0, y: 0 };

  // Texture Cache
  const textureCache = new Map();

  // =========================================================================
  // 1. PROCEDURAL TEXTURES (TACTILE CONCRETE, AGGREGATE, BUMP, MATRIX)
  // =========================================================================

  /**
   * Generates Authentic Brutalist Concrete Face & Bump Texture
   */
  function generateConcreteTexture(tierIndex, text, colorHex, isBump = false, w = 1024, h = 256) {
    const key = `conc_${tierIndex}_${text}_${colorHex}_${isBump ? 'bump' : 'diff'}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');

    if (isBump) {
      // Greyscale bump map
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, w, h);

      // Micro-pores and aggregate noise
      const img = ctx.getImageData(0, 0, w, h);
      const pix = img.data;
      for (let i = 0; i < pix.length; i += 4) {
        const n = (Math.random() - 0.5) * 45;
        const val = Math.min(255, Math.max(0, 128 + n));
        pix[i] = val; pix[i + 1] = val; pix[i + 2] = val;
      }
      ctx.putImageData(img, 0, 0);

      // Bevel borders
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, 6);
      ctx.fillStyle = '#202020'; ctx.fillRect(0, h - 8, w, 8);

      // Text bump (embossed white, shadow dark)
      if (text) {
        ctx.font = '900 44px "JetBrains Mono", sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#202020';
        ctx.fillText(text, w * 0.5 + 2, h * 0.5 + 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, w * 0.5 - 2, h * 0.5 - 2);
      }
    } else {
      // Diffuse Color Texture
      const baseCol = colorHex || (tierIndex === 0 ? '#d6d1c7' : (tierIndex === 1 ? '#e5a43b' : (tierIndex === 2 ? '#b8b1a3' : '#963434')));

      // Linear gradient for atmospheric slab depth
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, adjustBrightness(baseCol, 22));
      grad.addColorStop(0.5, baseCol);
      grad.addColorStop(1, adjustBrightness(baseCol, -30));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Aggregate stone noise and micro-pores
      const img = ctx.getImageData(0, 0, w, h);
      const pix = img.data;
      for (let i = 0; i < pix.length; i += 4) {
        const n = (Math.random() - 0.5) * 36;
        pix[i] = Math.min(255, Math.max(0, pix[i] + n));
        pix[i + 1] = Math.min(255, Math.max(0, pix[i + 1] + n));
        pix[i + 2] = Math.min(255, Math.max(0, pix[i + 2] + n));
      }
      ctx.putImageData(img, 0, 0);

      // Weathered edges
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.fillRect(0, 0, w, 5);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, h - 8, w, 8);

      // Vertical slab expansion seams on lower tiers
      if (tierIndex >= 2) {
        const seams = tierIndex === 2 ? [w * 0.33, w * 0.67] : [w * 0.25, w * 0.5, w * 0.75];
        seams.forEach(sx => {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fillRect(sx, 0, 3, h);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(sx + 3, 0, 1.5, h);
        });
      }

      // Engraved typography with 3D drop shadow
      if (text) {
        ctx.font = '900 44px "JetBrains Mono", "Inter", sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const cx = w * 0.5;
        const cy = h * 0.52;

        // Shadow carving into stone
        ctx.fillStyle = 'rgba(10, 8, 6, 0.85)';
        ctx.fillText(text, cx + 2.5, cy + 3.5);

        // Specular upper bevel highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.fillText(text, cx - 1.5, cy - 1.5);

        // Crisp engraved core
        ctx.fillStyle = tierIndex === 1 ? '#fff0c7' : (tierIndex === 3 ? '#ffe5e5' : '#ffffff');
        ctx.fillText(text, cx, cy);
      }
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 8;
    textureCache.set(key, tex);
    return tex;
  }

  function adjustBrightness(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + percent));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    let b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * Generates Dark Slate Cutting Mat Grid (Desk Environment)
   */
  function generateDeskGridTexture(w = 1024, h = 1024) {
    const key = `desk_grid_${w}x${h}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');

    // Deep dark slate background
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.72);
    bg.addColorStop(0, '#131822');
    bg.addColorStop(0.7, '#0b0e14');
    bg.addColorStop(1, '#05070a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Millimeter grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // 5cm Major Accent Grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 1.8;
    for (let x = 0; x <= w; x += step * 5) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += step * 5) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Centimeter ruler numbers
    ctx.font = '600 10px monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    for (let x = step; x < w; x += step) {
      ctx.fillText(`${Math.round(x / step)}`, x + 4, 16);
      ctx.fillRect(x - 0.5, 0, 1, 8);
    }
    for (let y = step; y < h; y += step) {
      ctx.fillText(`${Math.round(y / step)}`, 6, y + 12);
      ctx.fillRect(0, y - 0.5, 8, 1);
    }

    const tex = new THREE.CanvasTexture(cv);
    textureCache.set(key, tex);
    return tex;
  }

  /**
   * Generates Glowing Cyan Binary Stream Texture
   */
  function generateBinaryStreamTexture(colorHex = '#00f0ff', t = 0) {
    const frameIndex = Math.round((t % 2.0) * 20);
    const key = `bin_stream_${colorHex}_${frameIndex}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024; cv.height = 96;
    const ctx = cv.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 96);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.3, colorHex + '44');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(0.7, colorHex + '44');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 96);

    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 14;

    const baseBin = '010101010  1010101011  001100101  010010010  110100101  010101101  001010101';
    const shift = Math.floor((t * 24) % baseBin.length);
    const stream = baseBin.slice(shift) + '  ' + baseBin.slice(0, shift);
    ctx.fillText(stream, 18, 58);
    ctx.fillText(stream, -400, 58);

    const tex = new THREE.CanvasTexture(cv);
    textureCache.set(key, tex);
    return tex;
  }

  /**
   * Generates Soft Radial Volumetric Smoke Puff Sprite
   */
  function generateDustPuffTexture() {
    const key = 'dust_puff_sprite';
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 128; cv.height = 128;
    const ctx = cv.getContext('2d');

    const rad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    rad.addColorStop(0, 'rgba(245, 235, 220, 0.9)');
    rad.addColorStop(0.35, 'rgba(215, 200, 180, 0.5)');
    rad.addColorStop(0.7, 'rgba(165, 150, 130, 0.18)');
    rad.addColorStop(1, 'rgba(140, 125, 110, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(cv);
    textureCache.set(key, tex);
    return tex;
  }

  // =========================================================================
  // 2. PROCEDURAL 3D MESH & DESTRUCTION BUILDER
  // =========================================================================

  function buildProceduralPyramidAssembly(data, t = 0) {
    if (!pcScene) return;

    if (pcGroup) {
      pcScene.remove(pcGroup);
      pcGroup = null;
    }
    pcGroup = new THREE.Group();
    pcScene.add(pcGroup);

    baseTiers = [];
    fractureChunks = [];
    rebarRods = [];

    // 1. Ground Cutting Mat Desk
    const groundGeo = new THREE.PlaneGeometry(640, 480);
    const groundMat = new THREE.MeshStandardMaterial({
      map: generateDeskGridTexture(1024, 1024),
      roughness: 0.88,
      metalness: 0.05
    });
    groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -2, 0);
    groundMesh.receiveShadow = true;
    pcGroup.add(groundMesh);

    // 2. Ambient Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(360, 360);
    const sCv = document.createElement('canvas');
    sCv.width = 256; sCv.height = 256;
    const sCtx = sCv.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 30, 128, 128, 124);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    sGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
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

    // 3. Tiers 0, 1, 2, 3 Configuration
    const tierDefs = [
      { idx: 0, w: 76, d: 76, h: 26, y: 78, text: data.tier1Text || 'FOUNDER', col: data.tier1Color || '#d6d1c7' },
      { idx: 1, w: 138, d: 138, h: 26, y: 52, text: data.tier2Text || 'EARLY INVESTORS · +400%', col: data.tier2Color || '#e5a43b' },
      { idx: 2, w: 200, d: 200, h: 26, y: 26, text: data.tier3Text || 'LATE ADOPTERS · BREAK-EVEN', col: data.tier3Color || '#b8b1a3' },
      { idx: 3, w: 264, d: 264, h: 26, y: 0, text: data.tier4Text || 'LAST 90% · TOTAL LOSS', col: data.tier4Color || '#963434' }
    ];

    tierDefs.forEach(def => {
      // Build Tier Slabs with Bump and Detail
      const slabGeo = new THREE.BoxGeometry(def.w, def.h, def.d);
      const diffTex = generateConcreteTexture(def.idx, def.text, def.col, false, 1024, 256);
      const bumpTex = generateConcreteTexture(def.idx, def.text, def.col, true, 1024, 256);
      const sideTex = generateConcreteTexture(def.idx, '', def.col, false, 512, 256);

      const frontMat = new THREE.MeshStandardMaterial({
        map: diffTex,
        bumpMap: bumpTex,
        bumpScale: 1.8,
        roughness: 0.85,
        metalness: 0.04
      });
      const sideMat = new THREE.MeshStandardMaterial({
        map: sideTex,
        roughness: 0.9,
        metalness: 0.03
      });
      const topMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(def.col).multiplyScalar(0.92),
        roughness: 0.94,
        metalness: 0.02
      });

      const mats = [sideMat, sideMat, topMat, sideMat, frontMat, sideMat];
      const mesh = new THREE.Mesh(slabGeo, mats);
      mesh.position.set(0, def.y + def.h * 0.5, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Store base position and rotation for physics simulation
      mesh.userData = {
        tierIndex: def.idx,
        basePos: mesh.position.clone(),
        baseRot: mesh.rotation.clone(),
        w: def.w, h: def.h, d: def.d
      };

      baseTiers.push(mesh);
      pcGroup.add(mesh);
    });

    // 4. Glowing Cyan Binary Data Seam
    if (data.showBinaryGlow !== false) {
      const seamGeo = new THREE.PlaneGeometry(248, 14);
      const seamMat = new THREE.MeshBasicMaterial({
        map: generateBinaryStreamTexture(data.binaryGlowColor || '#00f0ff', t),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      binarySeamMesh = new THREE.Mesh(seamGeo, seamMat);
      binarySeamMesh.position.set(0, 26, 101);
      pcGroup.add(binarySeamMesh);
    }

    // 5. Procedural 3D Fractured Chunks & Rubble Field (The Foundation Crumble)
    const count = Math.min(80, Math.max(12, data.debrisCount || 42));
    fractureChunks = [];

    for (let i = 0; i < count; i++) {
      const sz = 3 + Math.random() * 16;
      // Dodecahedron deformed with randomized vertices for natural broken stone
      const rockGeo = new THREE.DodecahedronGeometry(sz, 0);
      const posAttr = rockGeo.attributes.position;
      for (let j = 0; j < posAttr.count; j++) {
        posAttr.setXYZ(
          j,
          posAttr.getX(j) * (0.75 + Math.random() * 0.5),
          posAttr.getY(j) * (0.75 + Math.random() * 0.5),
          posAttr.getZ(j) * (0.75 + Math.random() * 0.5)
        );
      }
      rockGeo.computeVertexNormals();

      const rockMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.tier4Color || '#963434').multiplyScalar(0.7 + Math.random() * 0.4),
        roughness: 0.95,
        metalness: 0.05
      });

      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.castShadow = true;
      rock.receiveShadow = true;

      // Initial rest point inside the right corner of Tier 4
      const initX = 85 + Math.random() * 45;
      const initY = 4 + Math.random() * 22;
      const initZ = 20 + Math.random() * 85;

      // Physics target vector depending on collapse action
      const scatterMult = data.scatterRadius || 1.0;
      const targetX = initX + (35 + Math.random() * 75) * scatterMult;
      const targetY = sz * 0.5; // Rest on ground
      const targetZ = initZ + (-20 + Math.random() * 95) * scatterMult;

      rock.position.set(initX, initY, initZ);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      rock.userData = {
        initPos: new THREE.Vector3(initX, initY, initZ),
        targetPos: new THREE.Vector3(targetX, targetY, targetZ),
        initRot: rock.rotation.clone(),
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4),
        mass: 0.5 + Math.random() * 1.5,
        bounceOffset: Math.random() * 8
      };

      fractureChunks.push(rock);
      pcGroup.add(rock);
    }

    // 6. Exposed Structural Steel Rebar Rods
    if (data.showRebar !== false) {
      rebarRods = [];
      const rebarMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#334155'),
        roughness: 0.55,
        metalness: 0.85
      });

      const rebarCoords = [
        { x: 92, y: 14, z: 98, rx: 0.4, rz: 0.6, len: 34 },
        { x: 106, y: 18, z: 86, rx: -0.3, rz: 0.9, len: 42 },
        { x: 114, y: 10, z: 106, rx: 0.2, rz: 1.2, len: 30 },
        { x: 88, y: 22, z: 80, rx: -0.5, rz: 0.5, len: 38 }
      ];

      rebarCoords.forEach(rb => {
        const cylGeo = new THREE.CylinderGeometry(1.4, 1.4, rb.len, 8);
        const rod = new THREE.Mesh(cylGeo, rebarMat);
        rod.position.set(rb.x, rb.y, rb.z);
        rod.rotation.set(rb.rx, 0, rb.rz);
        rod.castShadow = true;
        rebarRods.push(rod);
        pcGroup.add(rod);
      });
    }

    // 7. Volumetric Billowing Dust Cloud Particles
    const dustCount = 48;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = 90 + Math.random() * 95;
      dustPositions[i * 3 + 1] = 12 + Math.random() * 90;
      dustPositions[i * 3 + 2] = 25 + Math.random() * 95;
      dustSizes[i] = 45 + Math.random() * 65;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustMat = new THREE.PointsMaterial({
      map: generateDustPuffTexture(),
      size: 68,
      transparent: true,
      opacity: 0.5 * (data.dustIntensity || 1.1),
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    dustParticleSystem = new THREE.Points(dustGeo, dustMat);
    pcGroup.add(dustParticleSystem);

    applyCameraRig(data);
  }

  // =========================================================================
  // 3. DYNAMIC PHYSICS & DESTRUCTION ANIMATION STEP
  // =========================================================================

  function updatePyramidDestructionPhysics(t, data) {
    const dur = Math.max(1, data.duration || 3.5);
    const ct = Math.max(0, Math.min(dur, t));
    const speed = data.crumbleSpeed || 1.0;
    const trigger = Math.min(dur * 0.8, Math.max(0, data.fractureStart || 0.6));
    const intensity = data.collapseIntensity !== undefined ? data.collapseIntensity : 0.85;

    // Time elapsed after fracture initiation
    const activeT = Math.max(0, (ct - trigger) * speed);
    const progress = Math.min(1.0, activeT / (dur - trigger));

    // 1. Camera Impact Tremor on Foundation Rupture
    if (data.cameraTremor && ct > trigger && ct < trigger + 0.65) {
      const shakeDecay = 1.0 - (ct - trigger) / 0.65;
      tremorOffset.x = (Math.random() - 0.5) * 4.5 * shakeDecay;
      tremorOffset.y = (Math.random() - 0.5) * 3.5 * shakeDecay;
      if (pcCamera) {
        pcCamera.position.x += tremorOffset.x * 0.1;
        pcCamera.position.y += tremorOffset.y * 0.1;
      }
    }

    // 2. Structural Tier Tilts & Foundation Sag (Upper Tier Buckle)
    const sagMult = data.upperTierSag || 1.0;
    if (baseTiers.length >= 4) {
      const t4 = baseTiers[3];
      const t3 = baseTiers[2];
      const t2 = baseTiers[1];
      const t1 = baseTiers[0];

      if (data.actionEffect === 'explode') {
        // Explode: Slabs get shoved outward radially
        t4.position.x = t4.userData.basePos.x + progress * 24 * intensity;
        t4.position.y = Math.max(4, t4.userData.basePos.y - progress * 10 * intensity);
        t4.rotation.z = -progress * 0.12 * intensity;
        t3.rotation.z = -progress * 0.08 * sagMult * intensity;
      } else {
        // Crumble / Sag: Foundation drops on the right, upper tiers tilt and slide down
        const collapseDrop = progress * 16 * intensity;
        t4.position.y = t4.userData.basePos.y - collapseDrop * 0.45;
        t4.position.x = t4.userData.basePos.x + progress * 12 * intensity;
        t4.rotation.z = -progress * 0.18 * intensity;

        t3.position.y = t3.userData.basePos.y - collapseDrop * 0.65;
        t3.rotation.z = -progress * 0.14 * sagMult * intensity;

        t2.position.y = t2.userData.basePos.y - collapseDrop * 0.35;
        t2.rotation.z = -progress * 0.09 * sagMult * intensity;

        t1.position.y = t1.userData.basePos.y - collapseDrop * 0.2;
        t1.rotation.z = -progress * 0.05 * sagMult * intensity;
      }
    }

    // 3. Dynamic Fracture Chunks & Rubble Tumbling
    if (fractureChunks.length > 0) {
      fractureChunks.forEach((rock, idx) => {
        if (!rock.userData) return;
        const d = rock.userData;

        if (data.actionEffect === 'explode') {
          // Explosive radial blast trajectory
          const p = Math.min(1.0, progress * (1.2 + (idx % 4) * 0.2));
          rock.position.lerpVectors(d.initPos, d.targetPos, p);
          // Parabolic arc (jump up then crash)
          rock.position.y = d.initPos.y + Math.sin(p * Math.PI) * (25 + (idx % 5) * 8) - p * 15;
          rock.position.y = Math.max(d.targetPos.y, rock.position.y);
          rock.rotation.x += d.rotSpeed.x * 0.06;
          rock.rotation.y += d.rotSpeed.y * 0.06;
        } else {
          // Crumble: Gravity fall with rotational tumble
          const chunkProg = Math.min(1.0, Math.max(0, (progress - (idx % 6) * 0.05) * 1.3));
          rock.position.lerpVectors(d.initPos, d.targetPos, chunkProg);
          rock.rotation.x = d.initRot.x + chunkProg * d.rotSpeed.x;
          rock.rotation.y = d.initRot.y + chunkProg * d.rotSpeed.y;
          rock.rotation.z = d.initRot.z + chunkProg * d.rotSpeed.z;
        }
      });
    }

    // 4. Glowing Binary Seam Light Pulse & Leak
    if (binarySeamMesh && binarySeamMesh.material) {
      const binTex = generateBinaryStreamTexture(data.binaryGlowColor || '#00f0ff', ct);
      if (binarySeamMesh.material.map !== binTex) {
        binarySeamMesh.material.map = binTex;
        binarySeamMesh.material.map.needsUpdate = true;
      }
      // Light flare on rupture
      const flare = (ct > trigger && ct < trigger + 0.8) ? 1.6 : 1.0;
      binarySeamMesh.material.opacity = (0.75 + Math.sin(ct * 9) * 0.25) * flare * (data.binaryGlowIntensity || 1.2);
    }

    // 5. Billowing Volumetric Smoke & Dust Cloud
    if (dustParticleSystem && dustParticleSystem.geometry) {
      const posAttr = dustParticleSystem.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i) + 0.22 * (1.0 + progress * 2.0);
        if (y > 125) y = 14;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      const dustAlpha = Math.min(0.72, (0.2 + progress * 0.55)) * (data.dustIntensity || 1.1);
      dustParticleSystem.material.opacity = dustAlpha;
    }
  }

  function applyCameraRig(data) {
    if (!pcCamera) return;
    const pitch = (data.cameraPitch !== undefined) ? data.cameraPitch : 28;
    const yaw = (data.cameraYaw !== undefined) ? data.cameraYaw : -14;

    const radPitch = THREE.MathUtils.degToRad(pitch);
    const radYaw = THREE.MathUtils.degToRad(yaw);
    const dist = 325;

    const camY = Math.sin(radPitch) * dist + 38;
    const groundDist = Math.cos(radPitch) * dist;
    const camX = Math.sin(radYaw) * groundDist;
    const camZ = Math.cos(radYaw) * groundDist;

    pcCamera.position.set(camX, camY, camZ);
    pcCamera.lookAt(12, 40, 0);

    if (pcControls) {
      pcControls.target.set(12, 40, 0);
      pcControls.update();
    }
  }

  // =========================================================================
  // 4. INITIALIZATION & VIEWPORT MOUNTING
  // =========================================================================

  window.initPyramidCollapse3DScene = function(container, data) {
    if (!container) return;
    cleanupPyramidCollapse3DScene();

    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const width = container.clientWidth || 1024;
    const height = container.clientHeight || 576;

    pcScene = new THREE.Scene();
    pcScene.background = new THREE.Color(d.styleMode === 'matrix' ? '#04070e' : '#080a0f');

    pcCamera = new THREE.PerspectiveCamera(38, width / height, 1, 2000);

    pcRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    pcRenderer.setSize(width, height);
    pcRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    pcRenderer.shadowMap.enabled = true;
    pcRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    pcRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    pcRenderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(pcRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      pcControls = new THREE.OrbitControls(pcCamera, pcRenderer.domElement);
      pcControls.enableDamping = true;
      pcControls.dampingFactor = 0.08;
      pcControls.maxPolarAngle = Math.PI * 0.48;
      pcControls.minDistance = 140;
      pcControls.maxDistance = 650;
      pcControls.target.set(12, 40, 0);

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

    // Directional Spotlight Lighting
    ambientLight = new THREE.AmbientLight(d.styleMode === 'matrix' ? '#1e293b' : '#334155', 1.3);
    pcScene.add(ambientLight);

    spotLight = new THREE.SpotLight(new THREE.Color(d.spotlightWarmth || '#fff1d6'), d.spotlightIntensity || 2.4);
    spotLight.position.set(-130, 240, 160);
    spotLight.angle = Math.PI / 3.8;
    spotLight.penumbra = 0.6;
    spotLight.decay = 1.4;
    spotLight.distance = 900;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0004;
    pcScene.add(spotLight);

    rimLight = new THREE.DirectionalLight(d.styleMode === 'matrix' ? '#2effc6' : '#38bdf8', 1.3);
    rimLight.position.set(160, 140, -140);
    pcScene.add(rimLight);

    buildProceduralPyramidAssembly(d, 0);

    lastTimestamp = performance.now();
    function renderLoop(now) {
      pcAnimFrame = requestAnimationFrame(renderLoop);
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock = (animClock + delta) % (d.duration || 3.5);
        updatePyramidDestructionPhysics(animClock, d);
      } else {
        updatePyramidDestructionPhysics(manualT, d);
      }

      if (pcControls) pcControls.update();
      if (pcRenderer && pcScene && pcCamera) {
        pcRenderer.render(pcScene, pcCamera);
      }
    }
    pcAnimFrame = requestAnimationFrame(renderLoop);
  };

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
    baseTiers = [];
    fractureChunks = [];
    rebarRods = [];
    binarySeamMesh = null;
    dustParticleSystem = null;
  }

  window.tplMountPyramidCollapse3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});

    if (typeof window.applyModeLayout === 'function') {
      window.applyModeLayout(true);
    }

    const isMatrix = d.styleMode === 'matrix';
    const bgPlate = isMatrix ? '/pyramid_matrix_plate_clean.png' : '/pyramid_concrete_plate_clean.png';

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: ${isMatrix ? '#04070e' : '#080a0f'}; overflow: hidden; cursor: grab; user-select: none;">
        <img id="pyramid-plate-bg" src="${bgPlate}" alt="Pyramid Collapse Plate" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.25; filter: contrast(120%) brightness(85%);" />
        <div id="pyramid-collapse-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;"></div>
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: ${isMatrix ? '#2effc6' : '#f59e0b'}; background: rgba(10,12,18,0.92); border: 1px solid ${isMatrix ? 'rgba(46,255,198,0.4)' : 'rgba(245,158,11,0.4)'}; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            ${d.actionEffect ? d.actionEffect.toUpperCase() : 'CRUMBLE'} FX &bull; 3D BRUTALIST DESTRUCTION
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

  window.tplMountPyramidCollapseVideoStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {});
    cleanupPyramidCollapse3DScene();
    if (typeof window.applyModeLayout === 'function') window.applyModeLayout(false);

    stage.innerHTML = `
      <div id="pyramid-video-stage" style="position: absolute; inset: 0; background: #0c0808; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <canvas id="pyramid-video-canvas" width="1280" height="720" style="width: 100%; height: 100%; object-fit: contain;"></canvas>
      </div>
    `;
  };

  window.stepPyramidCollapseAnimation = function(container, tplId, t, data) {
    if (tplId !== TEMPLATE_ID) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    isManualScrub = true;
    manualT = t;
    if (pcScene) {
      updatePyramidDestructionPhysics(t, d);
      if (pcRenderer && pcCamera) pcRenderer.render(pcScene, pcCamera);
    }
  };

  window.renderPyramidCollapseCanvas = function(ctx, clip, t, cw, ch) {
    const d = Object.assign({}, DEFAULT_CONFIG, (clip.fxScene && clip.fxScene.contextualData) ? clip.fxScene.contextualData : {});
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, cw, ch);
  };

  // =========================================================================
  // 5. PROFESSIONAL GRANULAR CONTEXTUAL INSPECTOR
  // =========================================================================

  window.tplBuildPyramidCollapseInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const isConcrete = d.styleMode !== 'matrix';
    const pitch = (d.cameraPitch !== undefined) ? d.cameraPitch : 28;
    const yaw = (d.cameraYaw !== undefined) ? d.cameraYaw : -14;
    const action = d.actionEffect || 'crumble';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header with Dual Production Style -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.6px; display: flex; align-items: center; gap: 5px;">
              <span>💥</span> Pyramid Destruction Studio
            </span>
          </div>
          <div style="display: flex; gap: 2px; background: rgba(18,19,28,0.9); padding: 2px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12);">
            <button type="button" id="btn-pc-mode-concrete" style="padding: 3px 8px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${isConcrete ? 'rgba(245,158,11,0.35)' : 'transparent'}; color: ${isConcrete ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="Brutalist Concrete Demolition">⬡ Concrete</button>
            <button type="button" id="btn-pc-mode-matrix" style="padding: 3px 8px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${!isConcrete ? 'rgba(46,255,198,0.35)' : 'transparent'}; color: ${!isConcrete ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="Tactical Wireframe Matrix">❖ Matrix</button>
          </div>
        </div>

        <!-- Section 1: Destruction & Collapse Action Engine -->
        <div style="background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 9px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #fcd34d; text-transform: uppercase; letter-spacing: 0.5px;">💥 Crumble &amp; Destruction Action</span>
            <span style="font-size: 8.5px; font-family: monospace; color: #f59e0b; font-weight: 700;">PHYSICS FX</span>
          </div>

          <!-- Action Effect Selector (Crumble vs Explode vs Sag) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button type="button" class="pc-action-btn" data-action="crumble" style="padding: 5px; font-size: 9.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${action === 'crumble' ? '#f59e0b' : 'rgba(255,255,255,0.12)'}; background: ${action === 'crumble' ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.4)'}; color: ${action === 'crumble' ? '#fff' : '#cbd5e1'}; cursor: pointer;">
              ⬡ Crumble &amp; Buckle
            </button>
            <button type="button" class="pc-action-btn" data-action="explode" style="padding: 5px; font-size: 9.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${action === 'explode' ? '#f59e0b' : 'rgba(255,255,255,0.12)'}; background: ${action === 'explode' ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.4)'}; color: ${action === 'explode' ? '#fff' : '#cbd5e1'}; cursor: pointer;">
              💥 Explosive Blast
            </button>
            <button type="button" class="pc-action-btn" data-action="fracture_sag" style="padding: 5px; font-size: 9.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${action === 'fracture_sag' ? '#f59e0b' : 'rgba(255,255,255,0.12)'}; background: ${action === 'fracture_sag' ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.4)'}; color: ${action === 'fracture_sag' ? '#fff' : '#cbd5e1'}; cursor: pointer;">
              ⚡ Deep Fault Sag
            </button>
            <button type="button" class="pc-action-btn" data-action="matrix_shatter" style="padding: 5px; font-size: 9.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${action === 'matrix_shatter' ? '#f59e0b' : 'rgba(255,255,255,0.12)'}; background: ${action === 'matrix_shatter' ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.4)'}; color: ${action === 'matrix_shatter' ? '#fff' : '#cbd5e1'}; cursor: pointer;">
              ❖ Data Disintegrate
            </button>
          </div>

          <!-- Crumbling Speed Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>CRUMBLING &amp; MOTION SPEED</span>
              <span id="pc-val-speed" style="font-family: monospace; color: #f59e0b; font-weight: 700;">${(d.crumbleSpeed || 1.0).toFixed(2)}x</span>
            </div>
            <input type="range" id="pc-slider-speed" min="25" max="300" value="${Math.round((d.crumbleSpeed || 1.0) * 100)}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
          </div>

          <!-- Destruction Intensity Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>DESTRUCTION INTENSITY</span>
              <span id="pc-val-intensity" style="font-family: monospace; color: #f59e0b; font-weight: 700;">${Math.round((d.collapseIntensity || 0.85) * 100)}%</span>
            </div>
            <input type="range" id="pc-slider-intensity" min="0" max="100" value="${Math.round((d.collapseIntensity || 0.85) * 100)}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
          </div>

          <!-- Fracture Trigger Timing -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
              <span>RUPTURE TRIGGER TIME</span>
              <span id="pc-val-trigger" style="font-family: monospace; color: #f59e0b; font-weight: 700;">${(d.fractureStart || 0.6).toFixed(1)}s</span>
            </div>
            <input type="range" id="pc-slider-trigger" min="0" max="25" value="${Math.round((d.fractureStart || 0.6) * 10)}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
          </div>

          <!-- Debris Chunks Count & Scatter -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>CHUNKS</span>
                <span id="pc-val-debris" style="font-family: monospace; color: #f59e0b;">${d.debrisCount || 42}</span>
              </div>
              <input type="range" id="pc-slider-debris" min="15" max="75" value="${d.debrisCount || 42}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>SCATTER</span>
                <span id="pc-val-scatter" style="font-family: monospace; color: #f59e0b;">${(d.scatterRadius || 1.0).toFixed(1)}x</span>
              </div>
              <input type="range" id="pc-slider-scatter" min="3" max="25" value="${Math.round((d.scatterRadius || 1.0) * 10)}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
            </div>
          </div>
        </div>

        <!-- Section 2: Colors & Material Shaders -->
        <div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.3); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 9px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 800; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">🎨 Material Colors &amp; Themes</span>
            <span style="font-size: 8.5px; font-family: monospace; color: #c084fc; font-weight: 700;">SHADERS</span>
          </div>

          <!-- Color Presets -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
            <button type="button" class="pc-theme-btn" data-theme="brutalist" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Brutalist</button>
            <button type="button" class="pc-theme-btn" data-theme="ponzi_heatmap" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Heatmap</button>
            <button type="button" class="pc-theme-btn" data-theme="obsidian_gold" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Obsidian</button>
            <button type="button" class="pc-theme-btn" data-theme="tactical_slate" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Tactical</button>
          </div>

          <!-- Individual Tier Color Pickers -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 5px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Tier 1 (Apex)</span>
              <input type="color" id="pc-col-t1" value="${d.tier1Color || '#d6d1c7'}" style="width: 22px; height: 18px; border: none; background: none; cursor: pointer;" />
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 5px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Tier 2 (Investors)</span>
              <input type="color" id="pc-col-t2" value="${d.tier2Color || '#e5a43b'}" style="width: 22px; height: 18px; border: none; background: none; cursor: pointer;" />
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 5px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Tier 3 (Adopters)</span>
              <input type="color" id="pc-col-t3" value="${d.tier3Color || '#b8b1a3'}" style="width: 22px; height: 18px; border: none; background: none; cursor: pointer;" />
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 5px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Tier 4 (Base)</span>
              <input type="color" id="pc-col-t4" value="${d.tier4Color || '#963434'}" style="width: 22px; height: 18px; border: none; background: none; cursor: pointer;" />
            </div>
          </div>

          <!-- Binary Glow Color & Toggle -->
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 5px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="pc-chk-binary" ${d.showBinaryGlow !== false ? 'checked' : ''} style="accent-color: #06b6d4;" />
              <span>Glowing Binary Seam</span>
            </label>
            <input type="color" id="pc-col-binary" value="${d.binaryGlowColor || '#00f0ff'}" style="width: 22px; height: 18px; border: none; background: none; cursor: pointer;" />
          </div>
        </div>

        <!-- Section 3: Typography & Text Editing -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">📝 Engraved Typography</span>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8px; color: #94a3b8;">HEADLINE BANNER</span>
            <input type="text" id="pc-inp-headline" value="${d.headlineText || 'STRUCTURE UNSUSTAINABLE'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 800; padding: 4px 7px; border-radius: 5px; font-size: 10px; outline: none;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8px; color: #94a3b8;">TIER 1 (APEX)</span>
            <input type="text" id="pc-inp-t1" value="${d.tier1Text || 'FOUNDER'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; font-weight: 700; padding: 4px 7px; border-radius: 5px; font-size: 10px; outline: none;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8px; color: #94a3b8;">TIER 2 (INVESTORS)</span>
            <input type="text" id="pc-inp-t2" value="${d.tier2Text || 'EARLY INVESTORS · +400%'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #f59e0b; font-weight: 700; padding: 4px 7px; border-radius: 5px; font-size: 10px; outline: none;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8px; color: #94a3b8;">TIER 3 (ADOPTERS)</span>
            <input type="text" id="pc-inp-t3" value="${d.tier3Text || 'LATE ADOPTERS · BREAK-EVEN'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-weight: 700; padding: 4px 7px; border-radius: 5px; font-size: 10px; outline: none;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 8px; color: #94a3b8;">TIER 4 (BASE FAILURE)</span>
            <input type="text" id="pc-inp-t4" value="${d.tier4Text || 'LAST 90% · TOTAL LOSS'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ef4444; font-weight: 700; padding: 4px 7px; border-radius: 5px; font-size: 10px; outline: none;" />
          </div>
        </div>

        <!-- Section 4: Atmosphere, Dust & 3D Camera -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">🎥 Atmosphere &amp; 3D Camera</span>

          <!-- Volumetric Dust Slider -->
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
              <span>VOLUMETRIC DUST CLOUD</span>
              <span id="pc-val-dust" style="font-family: monospace; color: #f59e0b;">${Math.round((d.dustIntensity || 1.1) * 100)}%</span>
            </div>
            <input type="range" id="pc-slider-dust" min="0" max="200" value="${Math.round((d.dustIntensity || 1.1) * 100)}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
          </div>

          <!-- Camera Presets -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
            <button type="button" class="pc-3d-preset-btn" data-pitch="28" data-yaw="-14" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Macro 30°</button>
            <button type="button" class="pc-3d-preset-btn" data-pitch="18" data-yaw="-18" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Low 18°</button>
            <button type="button" class="pc-3d-preset-btn" data-pitch="42" data-yaw="-24" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Iso 45°</button>
            <button type="button" class="pc-3d-preset-btn" data-pitch="68" data-yaw="0" style="padding: 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Top 70°</button>
          </div>

          <!-- Tilt Pitch & Yaw -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>PITCH</span>
                <span id="pc-val-pitch" style="font-family: monospace; color: #2effc6;">${pitch}°</span>
              </div>
              <input type="range" id="pc-slider-pitch" min="5" max="75" value="${pitch}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>YAW</span>
                <span id="pc-val-yaw" style="font-family: monospace; color: #2effc6;">${yaw}°</span>
              </div>
              <input type="range" id="pc-slider-yaw" min="-60" max="60" value="${yaw}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
            </div>
          </div>

          <!-- Toggles -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="pc-chk-tremor" ${d.cameraTremor !== false ? 'checked' : ''} style="accent-color: #f59e0b;" />
              <span>Camera Tremor</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="pc-chk-rebar" ${d.showRebar !== false ? 'checked' : ''} style="accent-color: #64748b;" />
              <span>Steel Rebar</span>
            </label>
          </div>
        </div>

        <!-- Reset Button -->
        <div style="display: flex; gap: 6px; margin-top: 2px;">
          <button type="button" id="btn-pc-reset" style="width: 100%; padding: 7px; font-size: 10px; font-weight: 700; border-radius: 6px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); color: #94a3b8; cursor: pointer; transition: all 0.2s;">
            ↺ Reset All to Pro Defaults
          </button>
        </div>
      </div>
    `;

    function updateData(patch) {
      if (typeof window.tplSetContextualData === 'function') {
        const next = window.tplSetContextualData(tplId, patch);
        if (typeof window.tplUpdateStageWithContextualData === 'function') {
          window.tplUpdateStageWithContextualData(tplId, next);
        }
      }
    }

    // Style Mode Switcher
    container.querySelector('#btn-pc-mode-concrete')?.addEventListener('click', () => {
      textureCache.clear();
      updateData({ styleMode: 'concrete', is3DMode: true });
      window.tplRenderContextualInspector(tplId);
    });
    container.querySelector('#btn-pc-mode-matrix')?.addEventListener('click', () => {
      textureCache.clear();
      updateData({ styleMode: 'matrix', is3DMode: true });
      window.tplRenderContextualInspector(tplId);
    });

    // Action Effect Buttons
    container.querySelectorAll('.pc-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.action;
        updateData({ actionEffect: act });
        window.tplRenderContextualInspector(tplId);
      });
    });

    // Sliders
    container.querySelector('#pc-slider-speed')?.addEventListener('input', (e) => {
      const spd = parseInt(e.target.value, 10) / 100;
      const val = container.querySelector('#pc-val-speed');
      if (val) val.textContent = `${spd.toFixed(2)}x`;
      updateData({ crumbleSpeed: spd });
    });

    container.querySelector('#pc-slider-intensity')?.addEventListener('input', (e) => {
      const intVal = parseInt(e.target.value, 10) / 100;
      const val = container.querySelector('#pc-val-intensity');
      if (val) val.textContent = `${Math.round(intVal * 100)}%`;
      updateData({ collapseIntensity: intVal });
    });

    container.querySelector('#pc-slider-trigger')?.addEventListener('input', (e) => {
      const trig = parseInt(e.target.value, 10) / 10;
      const val = container.querySelector('#pc-val-trigger');
      if (val) val.textContent = `${trig.toFixed(1)}s`;
      updateData({ fractureStart: trig });
    });

    container.querySelector('#pc-slider-debris')?.addEventListener('input', (e) => {
      const cnt = parseInt(e.target.value, 10);
      const val = container.querySelector('#pc-val-debris');
      if (val) val.textContent = `${cnt}`;
      updateData({ debrisCount: cnt });
      buildProceduralPyramidAssembly(window.tplGetContextualData(tplId));
    });

    container.querySelector('#pc-slider-scatter')?.addEventListener('input', (e) => {
      const sc = parseInt(e.target.value, 10) / 10;
      const val = container.querySelector('#pc-val-scatter');
      if (val) val.textContent = `${sc.toFixed(1)}x`;
      updateData({ scatterRadius: sc });
    });

    container.querySelector('#pc-slider-dust')?.addEventListener('input', (e) => {
      const dVal = parseInt(e.target.value, 10) / 100;
      const val = container.querySelector('#pc-val-dust');
      if (val) val.textContent = `${Math.round(dVal * 100)}%`;
      updateData({ dustIntensity: dVal });
    });

    // Themes
    container.querySelectorAll('.pc-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const th = btn.dataset.theme;
        let patch = { colorTheme: th };
        if (th === 'brutalist') {
          patch.tier1Color = '#d6d1c7';
          patch.tier2Color = '#e5a43b';
          patch.tier3Color = '#b8b1a3';
          patch.tier4Color = '#963434';
        } else if (th === 'ponzi_heatmap') {
          patch.tier1Color = '#facc15';
          patch.tier2Color = '#f97316';
          patch.tier3Color = '#ea580c';
          patch.tier4Color = '#dc2626';
        } else if (th === 'obsidian_gold') {
          patch.tier1Color = '#27272a';
          patch.tier2Color = '#eab308';
          patch.tier3Color = '#18181b';
          patch.tier4Color = '#09090b';
        } else if (th === 'tactical_slate') {
          patch.tier1Color = '#38bdf8';
          patch.tier2Color = '#0284c7';
          patch.tier3Color = '#1e293b';
          patch.tier4Color = '#0f172a';
        }
        textureCache.clear();
        updateData(patch);
        window.tplRenderContextualInspector(tplId);
      });
    });

    // Color Pickers
    container.querySelector('#pc-col-t1')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier1Color: e.target.value, colorTheme: 'custom' });
    });
    container.querySelector('#pc-col-t2')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier2Color: e.target.value, colorTheme: 'custom' });
    });
    container.querySelector('#pc-col-t3')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier3Color: e.target.value, colorTheme: 'custom' });
    });
    container.querySelector('#pc-col-t4')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ tier4Color: e.target.value, colorTheme: 'custom' });
    });
    container.querySelector('#pc-col-binary')?.addEventListener('input', (e) => {
      textureCache.clear();
      updateData({ binaryGlowColor: e.target.value });
    });

    // Checkboxes
    container.querySelector('#pc-chk-binary')?.addEventListener('change', (e) => {
      updateData({ showBinaryGlow: e.target.checked });
      buildProceduralPyramidAssembly(window.tplGetContextualData(tplId));
    });
    container.querySelector('#pc-chk-tremor')?.addEventListener('change', (e) => {
      updateData({ cameraTremor: e.target.checked });
    });
    container.querySelector('#pc-chk-rebar')?.addEventListener('change', (e) => {
      updateData({ showRebar: e.target.checked });
      buildProceduralPyramidAssembly(window.tplGetContextualData(tplId));
    });

    // Text Inputs
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

    // Camera Presets
    container.querySelectorAll('.pc-3d-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.pitch, 10);
        const y = parseInt(btn.dataset.yaw, 10);
        const pSlider = container.querySelector('#pc-slider-pitch');
        const ySlider = container.querySelector('#pc-slider-yaw');
        const pVal = container.querySelector('#pc-val-pitch');
        const yVal = container.querySelector('#pc-val-yaw');
        if (pSlider) pSlider.value = p;
        if (ySlider) ySlider.value = y;
        if (pVal) pVal.textContent = `${p}°`;
        if (yVal) yVal.textContent = `${y}°`;
        updateData({ cameraPitch: p, cameraYaw: y });
        applyCameraRig({ cameraPitch: p, cameraYaw: y });
      });
    });

    // Pitch & Yaw Sliders
    container.querySelector('#pc-slider-pitch')?.addEventListener('input', (e) => {
      const p = parseInt(e.target.value, 10);
      const val = container.querySelector('#pc-val-pitch');
      if (val) val.textContent = `${p}°`;
      updateData({ cameraPitch: p });
      applyCameraRig({ cameraPitch: p, cameraYaw: d.cameraYaw });
    });
    container.querySelector('#pc-slider-yaw')?.addEventListener('input', (e) => {
      const y = parseInt(e.target.value, 10);
      const val = container.querySelector('#pc-val-yaw');
      if (val) val.textContent = `${y}°`;
      updateData({ cameraYaw: y });
      applyCameraRig({ cameraPitch: d.cameraPitch, cameraYaw: y });
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

  // Expose Global Config
  window.PYRAMID_COLLAPSE_CONFIG = DEFAULT_CONFIG;
  console.log('[Pyramid Collapse 3D Engine] Initialized Advanced Doc-Drama Destruction Engine');
})();
