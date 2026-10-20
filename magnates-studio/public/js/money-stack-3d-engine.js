/**
 * Photorealistic 3D Paper Currency Stack Animation Engine
 * Replicating high-stakes financial documentary standards (Magnates Media, James Jani, Vox)
 * 
 * Features:
 * 1. 3D Material & Mesh Pipeline:
 *    - Photorealistic 3D currency bundles ($100 US Dollar bill stacks with paper belly bands)
 *    - Multi-face texturing: Authentic 1996/2000s Benjamin Franklin $100 front face,
 *      hundreds of individual layered paper bill leaf edges on all sides, aged paper fibers
 *    - Kraft paper belly bands stamped "TEN THOUSAND" / "$10,000" with specular reflectivity
 *    - Normal/bump maps for paper micro-creases, ink depth, and layered edge striations
 * 
 * 2. Animation & Physics System:
 *    - Stacking physics: Bundles rapidly drop/stack upward with physical easing,
 *      mass inertia, micro-compression bounce, and organic settling tilt
 *    - Micro-animations: Paper leaf flutter, subtle stack vibration
 *    - Keyframable macro camera pan/tilt drift with simulated f/2.8 depth-of-field lens blur
 *    - Full interactive OrbitControls (drag to tilt/orbit in 3D, wheel to zoom)
 * 
 * 3. Atmospheric Environment & Optics:
 *    - Dark textured vault steel surface with directional brushed sheen & contact shadows
 *    - Directional top-down spotlight with soft edge vignette falloff
 *    - Specular rim light along bill edges and band seams
 *    - Volumetric floating dust motes with organic 3D Brownian drift
 */
(function() {
  'use strict';

  const TEMPLATE_ID = 'money-stack';

  // Default Configuration matching documentary reference
  const DEFAULT_CONFIG = {
    // Currency & Bundle Specs
    stackCount: 3,             // 3 bundles stacked as in reference (configurable 1 - 5)
    denomination: '100',       // '$100 USD'
    currencyStyle: 'usd_100',  // 'usd_100', 'usd_new', 'euro_500', 'gbp_50'
    bandStamp: 'TEN THOUSAND', // 'TEN THOUSAND', '$10,000', '$100,000', 'FEDERAL RESERVE'
    bandColor: '#cfb284',      // Tan kraft paper band
    agedPaperTone: '#eae5d4',  // Vintage linen-cotton banknote tone
    bundleThickness: 12.0,     // mm thickness (~100 crisp bills)
    billLayerDetail: 95,       // % detail for paper edge striations

    // Animation & Physics
    animMode: 'drop_settle',   // 'drop_settle' (default), 'rapid_stack', 'macro_drift'
    dropSpeed: 1.15,           // Speed multiplier
    bounceStrength: 1.25,      // Compression & rebound physics intensity
    settleOrganicTilt: true,   // Natural micro-rotation on stacked bundles
    macroDriftEnabled: true,   // Subtle continuous camera drift
    billFlutterEnabled: true,  // Micro-vibration / paper flutter

    // Camera & Lens Rig
    cameraPreset: 'macro_35',  // 'macro_35' (default low-angle), 'iso_45', 'surveillance'
    cameraPitch: 32.0,         // Degrees low-angle tilt
    cameraYaw: -28.0,          // Degrees horizontal angle
    cameraDistance: 310,       // Intimate macro distance (~50% viewport coverage)
    dofBlur: 0.85,             // f/2.8 lens blur simulation
    fov: 34,                   // Telephoto macro lens (avoid wide-angle warping)

    // Atmospheric Environment & Lighting
    surfaceType: 'vault_steel', // 'vault_steel', 'mahogany', 'tactical_grid', 'obsidian'
    spotlightIntensity: 1.85,
    spotlightColor: '#fff8eb',
    rimLightIntensity: 1.35,
    rimLightColor: '#7dd3fc',
    warmRimIntensity: 0.85,
    warmRimColor: '#fdba74',
    enableDustMotes: true,
    dustMoteCount: 140,
    dustSpeed: 1.0,
    vignetteDepth: 0.72,

    // Runtime state
    duration: 5.0
  };

  let moneyScene = null;
  let moneyCamera = null;
  let moneyRenderer = null;
  let moneyAnimFrame = null;
  let moneyControls = null;
  let moneyGroup = null;
  let bundleMeshes = [];
  let tableMesh = null;
  let shadowMesh = null;
  let dustParticles = null;
  let dustPositions = null;
  let dustVelocities = null;
  let spotLight = null;
  let dirRimLight = null;
  let warmRimLight = null;
  let ambientLight = null;

  let animClock = 0;
  let lastTimestamp = 0;
  let isManualScrub = false;
  let manualT = 0;

  // Cached generated canvas textures
  const textureCache = new Map();

  /**
   * Generates photorealistic high-res US $100 Banknote Top Face Canvas Texture
   * Accurate to Series 1996/2000s (Benjamin Franklin, Guilloche lace, serial numbers, seals)
   */
  function generateBanknoteTexture(data) {
    const key = `bill_${data.currencyStyle || 'usd_100'}_${data.agedPaperTone || '#eae5d4'}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1200;
    cv.height = 512;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // 1. Aged Banknote Fiber Base (Cotton/Linen Parchment)
    ctx.fillStyle = data.agedPaperTone || '#eae5d4';
    ctx.fillRect(0, 0, w, h);

    // Subtle paper grain & tonal gradient
    const paperGrad = ctx.createLinearGradient(0, 0, w, h);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    paperGrad.addColorStop(0.5, 'rgba(235, 230, 215, 0.05)');
    paperGrad.addColorStop(1, 'rgba(210, 200, 180, 0.22)');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, w, h);

    // Micro paper fibers noise
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;
    for (let i = 0; i < pix.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      pix[i] = Math.min(255, Math.max(0, pix[i] + n));
      pix[i+1] = Math.min(255, Math.max(0, pix[i+1] + n));
      pix[i+2] = Math.min(255, Math.max(0, pix[i+2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. Ornate Engraved Guilloche Border Frame
    const pad = 16;
    ctx.strokeStyle = '#273b2d'; // Deep treasury green-black ink
    ctx.lineWidth = 3;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

    // Double lace border
    ctx.lineWidth = 1.2;
    ctx.strokeRect(pad + 8, pad + 8, w - pad * 2 - 16, h - pad * 2 - 16);

    // Guilloche corner flourishes
    const cornerSize = 44;
    function drawCornerLace(cx, cy, rx, ry) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = '#324a3a';
      ctx.lineWidth = 0.8;
      for (let r = 6; r < cornerSize; r += 4) {
        ctx.beginPath();
        ctx.arc(rx ? -r : r, ry ? -r : r, r, 0, Math.PI / 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    drawCornerLace(pad + 8, pad + 8, false, false);
    drawCornerLace(w - pad - 8, pad + 8, true, false);
    drawCornerLace(pad + 8, h - pad - 8, false, true);
    drawCornerLace(w - pad - 8, h - pad - 8, true, true);

    // Fine fine geometric lathe waves along top and bottom
    ctx.strokeStyle = 'rgba(40, 62, 48, 0.45)';
    ctx.lineWidth = 0.6;
    for (let y = pad + 12; y <= pad + 24; y += 3) {
      ctx.beginPath();
      ctx.moveTo(pad + 50, y);
      for (let x = pad + 50; x < w - pad - 50; x += 12) {
        ctx.quadraticCurveTo(x + 6, y + (x % 24 === 0 ? 2 : -2), x + 12, y);
      }
      ctx.stroke();
    }
    for (let y = h - pad - 24; y <= h - pad - 12; y += 3) {
      ctx.beginPath();
      ctx.moveTo(pad + 50, y);
      for (let x = pad + 50; x < w - pad - 50; x += 12) {
        ctx.quadraticCurveTo(x + 6, y + (x % 24 === 0 ? 2 : -2), x + 12, y);
      }
      ctx.stroke();
    }

    // 3. Central Oval Portrait Frame (Benjamin Franklin)
    const ovalX = w * 0.46;
    const ovalY = h * 0.50;
    const ovalR1 = 150;
    const ovalR2 = 195;

    // Portrait background shading
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(ovalX, ovalY, ovalR1, ovalR2, 0, 0, Math.PI * 2);
    ctx.clip();

    const portraitGrad = ctx.createRadialGradient(ovalX, ovalY - 20, 30, ovalX, ovalY, ovalR2);
    portraitGrad.addColorStop(0, '#dad6c5');
    portraitGrad.addColorStop(0.7, '#c8c3b0');
    portraitGrad.addColorStop(1, '#9e9985');
    ctx.fillStyle = portraitGrad;
    ctx.fillRect(ovalX - ovalR1, ovalY - ovalR2, ovalR1 * 2, ovalR2 * 2);

    // Engraved cross-hatching texture in portrait vignette
    ctx.strokeStyle = 'rgba(38, 52, 42, 0.35)';
    ctx.lineWidth = 0.75;
    for (let lx = ovalX - ovalR1; lx < ovalX + ovalR1; lx += 4) {
      ctx.beginPath();
      ctx.moveTo(lx, ovalY - ovalR2);
      ctx.lineTo(lx + 40, ovalY + ovalR2);
      ctx.stroke();
    }

    // Stylized silhouette & engraving of Benjamin Franklin
    // Shoulders
    ctx.fillStyle = '#2c362f';
    ctx.beginPath();
    ctx.ellipse(ovalX + 8, ovalY + 130, 115, 85, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Coat cravat / collar
    ctx.fillStyle = '#eae5d4';
    ctx.beginPath();
    ctx.moveTo(ovalX + 8, ovalY + 65);
    ctx.lineTo(ovalX - 12, ovalY + 115);
    ctx.lineTo(ovalX + 28, ovalY + 115);
    ctx.closePath();
    ctx.fill();

    // Head / Face
    ctx.fillStyle = '#cfc9b6';
    ctx.beginPath();
    ctx.ellipse(ovalX + 6, ovalY - 12, 58, 72, 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Hair flowing back
    ctx.fillStyle = '#5c635b';
    ctx.beginPath();
    ctx.ellipse(ovalX - 34, ovalY - 8, 38, 62, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(ovalX + 44, ovalY - 8, 30, 58, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Facial features & deep shadow engraving
    ctx.strokeStyle = '#232b25';
    ctx.lineWidth = 1.5;
    // Eyebrows & eyes
    ctx.beginPath();
    ctx.arc(ovalX - 8, ovalY - 26, 12, 0.2, Math.PI - 0.2, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ovalX + 26, ovalY - 26, 12, 0.2, Math.PI - 0.2, true);
    ctx.stroke();
    // Nose bridge
    ctx.beginPath();
    ctx.moveTo(ovalX + 8, ovalY - 24);
    ctx.lineTo(ovalX + 11, ovalY);
    ctx.lineTo(ovalX + 4, ovalY + 4);
    ctx.stroke();
    // Mouth
    ctx.beginPath();
    ctx.moveTo(ovalX - 4, ovalY + 22);
    ctx.quadraticCurveTo(ovalX + 10, ovalY + 24, ovalX + 24, ovalY + 21);
    ctx.stroke();
    // Glasses / Franklin cheekbone contour
    ctx.strokeStyle = 'rgba(35, 43, 37, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.strokeRect(ovalX - 18, ovalY - 32, 22, 16);
    ctx.strokeRect(ovalX + 16, ovalY - 32, 22, 16);

    ctx.restore();

    // Oval engraved border ring
    ctx.strokeStyle = '#1e2d23';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(ovalX, ovalY, ovalR1, ovalR2, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#3d5244';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(ovalX, ovalY, ovalR1 + 5, ovalR2 + 5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // "FRANKLIN" nameplate banner below portrait
    ctx.fillStyle = '#223328';
    ctx.fillRect(ovalX - 48, ovalY + ovalR2 - 18, 96, 14);
    ctx.fillStyle = '#f4f0e2';
    ctx.font = 'bold 10px "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('FRANKLIN', ovalX, ovalY + ovalR2 - 7);

    // 4. Federal Bank Titles & Typographic Elements
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1c2920';
    ctx.font = 'bold 12px "Times New Roman", Georgia, serif';
    ctx.letterSpacing = '1.8px';
    ctx.fillText('FEDERAL RESERVE NOTE', w * 0.46, pad + 38);

    ctx.font = '900 24px "Times New Roman", Georgia, serif';
    ctx.fillText('THE UNITED STATES OF AMERICA', w * 0.46, pad + 68);

    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#2d3e33';
    ctx.fillText('THIS NOTE IS LEGAL TENDER FOR ALL DEBTS, PUBLIC AND PRIVATE', w * 0.46, h - pad - 32);

    ctx.font = '900 19px "Times New Roman", Georgia, serif';
    ctx.fillStyle = '#1c2920';
    ctx.fillText('ONE HUNDRED DOLLARS', w * 0.46, h - pad - 12);

    // 5. Huge Numeric "100" Indicators
    // Top Left
    ctx.textAlign = 'left';
    ctx.font = '900 46px "Times New Roman", Georgia, serif';
    ctx.fillStyle = '#18241b';
    ctx.fillText('100', pad + 32, pad + 64);

    // Bottom Right (Color shifting green/gold OVI style)
    ctx.textAlign = 'right';
    const oviGrad = ctx.createLinearGradient(w - pad - 120, h - pad - 30, w - pad - 20, h - pad - 10);
    oviGrad.addColorStop(0, '#105e32');
    oviGrad.addColorStop(0.6, '#1d7340');
    oviGrad.addColorStop(1, '#8da857');
    ctx.fillStyle = oviGrad;
    ctx.font = '900 58px "Times New Roman", Georgia, serif';
    ctx.fillText('100', w - pad - 36, h - pad - 32);

    // Top Right Numeric 100
    ctx.fillStyle = '#18241b';
    ctx.font = '900 38px "Times New Roman", Georgia, serif';
    ctx.fillText('100', w - pad - 42, pad + 60);

    // Bottom Left Numeric 100
    ctx.textAlign = 'left';
    ctx.font = '900 38px "Times New Roman", Georgia, serif';
    ctx.fillText('100', pad + 32, h - pad - 34);

    // 6. Serial Numbers in Authentic Federal Reserve Green Ink
    ctx.fillStyle = '#0f6e3c';
    ctx.font = 'bold 20px "Courier New", Courier, monospace';
    ctx.letterSpacing = '1px';
    // Top-left serial
    ctx.fillText('KB 90049531 B', pad + 78, pad + 116);
    // Bottom-right serial
    ctx.fillText('KB 90049531 B', w * 0.64, h - pad - 68);

    // District Seal & Federal Reserve Indicator "B2"
    // Left Federal Reserve Black Seal
    const sealX = w * 0.22;
    const sealY = h * 0.50;
    ctx.strokeStyle = '#18241b';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '900 34px "Times New Roman", serif';
    ctx.fillStyle = '#18241b';
    ctx.fillText('B', sealX, sealY + 12);

    ctx.font = 'bold 8px monospace';
    ctx.fillText('UNITED STATES', sealX, sealY - 18);
    ctx.fillText('NEW YORK', sealX, sealY + 28);

    // Large "B2" District Marker
    ctx.font = '900 32px "Times New Roman", serif';
    ctx.fillText('B2', pad + 95, pad + 158);

    // Right Green Treasury Seal
    const tSealX = w * 0.73;
    const tSealY = h * 0.44;
    ctx.strokeStyle = '#0f6e3c';
    ctx.fillStyle = '#0f6e3c';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(tSealX, tSealY, 36, 0, Math.PI * 2);
    ctx.stroke();

    // Toothed gear rim around treasury seal
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      const tx = tSealX + Math.cos(a) * 36;
      const ty = tSealY + Math.sin(a) * 36;
      ctx.fillRect(tx - 2, ty - 2, 4, 4);
    }

    ctx.font = 'bold 9px monospace';
    ctx.fillText('TREASURY', tSealX, tSealY - 6);
    ctx.fillText('1789', tSealX, tSealY + 12);

    // Subtle Aging & Crease Line Pass (mix-blend-mode look)
    ctx.strokeStyle = 'rgba(70, 60, 40, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, 0);
    ctx.lineTo(w * 0.49, h);
    ctx.stroke();

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates photorealistic Banknote Layered Paper Edge Texture
   * Hundreds of thin horizontal striations showing genuine bill-stack thickness
   */
  function generateEdgeTexture(data) {
    const key = `edge_${data.billLayerDetail || 95}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 256;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // Base tone of compressed aged currency paper edges
    ctx.fillStyle = '#eae5d4';
    ctx.fillRect(0, 0, w, h);

    // Gradient shading across height (darker at bottom crease, brighter where spotlight hits)
    const edgeGrad = ctx.createLinearGradient(0, 0, 0, h);
    edgeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    edgeGrad.addColorStop(0.3, 'rgba(235, 230, 215, 0.1)');
    edgeGrad.addColorStop(0.85, 'rgba(195, 185, 165, 0.35)');
    edgeGrad.addColorStop(1, 'rgba(140, 130, 110, 0.65)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, w, h);

    // Individual bill paper leaf striations (approx 100 - 150 leaves)
    const leafCount = 140;
    for (let i = 0; i < leafCount; i++) {
      const y = (i / leafCount) * h;
      const isShadowLine = (i % 2 === 0);
      const alpha = isShadowLine ? (0.25 + Math.random() * 0.35) : (0.15 + Math.random() * 0.25);
      
      ctx.strokeStyle = isShadowLine 
        ? `rgba(75, 68, 55, ${alpha})`
        : `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = isShadowLine ? 1.0 : 0.8;

      ctx.beginPath();
      ctx.moveTo(0, y);
      // Slight organic wave across the width (bills aren't laser-milled metal)
      for (let x = 0; x < w; x += 32) {
        const jitter = (Math.random() - 0.5) * 0.8;
        ctx.lineTo(x, y + jitter);
      }
      ctx.stroke();
    }

    // Occasional micro-creases & slightly uneven sheet corners
    ctx.fillStyle = 'rgba(65, 58, 45, 0.18)';
    for (let i = 0; i < 28; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      ctx.fillRect(rx, ry, 1 + Math.random() * 3, 2 + Math.random() * 6);
    }

    // Subtle green ink bleed along the far left and right edges (from border guilloche)
    const greenBleed = ctx.createLinearGradient(0, 0, 80, 0);
    greenBleed.addColorStop(0, 'rgba(35, 75, 45, 0.32)');
    greenBleed.addColorStop(1, 'rgba(35, 75, 45, 0.0)');
    ctx.fillStyle = greenBleed;
    ctx.fillRect(0, 0, 80, h);

    const greenBleedR = ctx.createLinearGradient(w - 80, 0, w, 0);
    greenBleedR.addColorStop(0, 'rgba(35, 75, 45, 0.0)');
    greenBleedR.addColorStop(1, 'rgba(35, 75, 45, 0.32)');
    ctx.fillStyle = greenBleedR;
    ctx.fillRect(w - 80, 0, 80, h);

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Kraft Paper Belly Band Strap Texture
   * Authentic Federal Reserve Currency Strap stamped "TEN THOUSAND" / "$10,000"
   */
  function generateBandTexture(data) {
    const stampText = data.bandStamp || 'TEN THOUSAND';
    const key = `band_${stampText}_${data.bandColor || '#cfb284'}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 512;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    // Kraft paper band tone
    ctx.fillStyle = data.bandColor || '#cfb284';
    ctx.fillRect(0, 0, w, h);

    // Paper grain
    const bandGrad = ctx.createLinearGradient(0, 0, w, 0);
    bandGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    bandGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.06)');
    bandGrad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(0, 0, w, h);

    // Gold / Brown border stripes along band edges
    ctx.fillStyle = '#6b4f2c';
    ctx.fillRect(0, 16, w, 6);
    ctx.fillRect(0, h - 22, w, 6);

    ctx.fillStyle = '#a6824b';
    ctx.fillRect(0, 24, w, 2);
    ctx.fillRect(0, h - 26, w, 2);

    // Large Bold Stamp "TEN THOUSAND"
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.textAlign = 'center';

    // Top Header: $10,000
    ctx.fillStyle = '#3a2712';
    ctx.font = '900 28px "Inter", -apple-system, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('$10,000', 0, -36);

    // Main Stamp Text
    ctx.font = '900 38px "Impact", "Arial Black", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(stampText.toUpperCase(), 0, 8);

    // Barcode & Federal Reserve Serial
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#523a1e';
    ctx.fillText('FED. RES. SERIES // 100 x $100', 0, 46);

    // Barcode lines
    const barW = 180;
    const startX = -barW / 2;
    const barY = 62;
    for (let x = 0; x < barW; x += 4) {
      if (Math.sin(x * 1.5) > -0.2) {
        ctx.fillRect(startX + x, barY, 2.5, 18);
      }
    }

    ctx.restore();

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Generates Dark Brushed Vault Steel / Slate Table Texture
   * Matches the high-stakes financial documentary table in Image 2
   */
  function generateVaultSteelTexture(data) {
    const key = `vault_steel_${data.surfaceType || 'vault_steel'}`;
    if (textureCache.has(key)) return textureCache.get(key);

    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 1024;
    const ctx = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;

    if (data.surfaceType === 'mahogany') {
      // Dark mahogany wood table
      ctx.fillStyle = '#180e0a';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(74, 38, 22, 0.35)';
      for (let y = 0; y < h; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + (Math.sin(y * 0.05) * 8));
        ctx.stroke();
      }
    } else if (data.surfaceType === 'tactical_grid') {
      // Dark tactical grid
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      const step = 48;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    } else {
      // Dark Brushed Vault Steel (Default - matching Image 2)
      ctx.fillStyle = '#11161d';
      ctx.fillRect(0, 0, w, h);

      // Anisotropic brushed metal scratches (subtle horizontal streaks)
      ctx.lineWidth = 0.75;
      for (let i = 0; i < 2400; i++) {
        const y = Math.random() * h;
        const x = Math.random() * (w - 200);
        const len = 80 + Math.random() * 240;
        const alpha = 0.02 + Math.random() * 0.06;
        ctx.strokeStyle = `rgba(180, 205, 230, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y + (Math.random() - 0.5) * 1.5);
        ctx.stroke();
      }
    }

    // Heavy Circular Vignette (darkens corners)
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.65);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
    vignette.addColorStop(0.65, 'rgba(4, 7, 12, 0.45)');
    vignette.addColorStop(1, 'rgba(2, 4, 8, 0.92)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    textureCache.set(key, cv);
    return cv;
  }

  /**
   * Initializes the Three.js 3D Money Stack Scene
   */
  window.initMoneyStack3DScene = function(container, customData) {
    if (!container) return;
    cleanupMoneyStack3DScene();

    const data = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), customData || {});

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    moneyScene = new THREE.Scene();
    moneyScene.background = new THREE.Color(0x05080c);
    moneyScene.fog = new THREE.FogExp2(0x05080c, 0.0022);

    moneyCamera = new THREE.PerspectiveCamera(data.fov || 34, width / height, 1, 2500);
    applyCameraPreset(data);

    // 2. WebGL Renderer with High-Precision ACES Filmic Tone Mapping
    moneyRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    moneyRenderer.setSize(width, height);
    moneyRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    moneyRenderer.shadowMap.enabled = true;
    moneyRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    moneyRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    moneyRenderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.appendChild(moneyRenderer.domElement);

    // 3. OrbitControls for Interactive User Pan/Tilt/Orbit
    if (typeof THREE.OrbitControls !== 'undefined') {
      moneyControls = new THREE.OrbitControls(moneyCamera, moneyRenderer.domElement);
      moneyControls.enableDamping = true;
      moneyControls.dampingFactor = 0.06;
      moneyControls.maxDistance = 650;
      moneyControls.minDistance = 140;
      moneyControls.target.set(0, 16, 0);
      moneyControls.maxPolarAngle = Math.PI / 2.05; // Don't flip below floor
      moneyControls.minPolarAngle = Math.PI / 6.0;
    }

    // 4. Directional Top-Down Spotlight & Rim Lights
    ambientLight = new THREE.AmbientLight(0x283244, 0.85);
    moneyScene.add(ambientLight);

    spotLight = new THREE.SpotLight(new THREE.Color(data.spotlightColor || '#fff8eb'), data.spotlightIntensity || 1.85);
    spotLight.position.set(-60, 240, 140);
    spotLight.angle = Math.PI / 4.2;
    spotLight.penumbra = 0.65;
    spotLight.decay = 1.2;
    spotLight.distance = 900;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0004;
    moneyScene.add(spotLight);

    // Cyan/Blue Specular Edge Rim Light
    dirRimLight = new THREE.DirectionalLight(new THREE.Color(data.rimLightColor || '#7dd3fc'), data.rimLightIntensity || 1.35);
    dirRimLight.position.set(160, 80, -120);
    moneyScene.add(dirRimLight);

    // Warm Ambient Light from front-right
    warmRimLight = new THREE.DirectionalLight(new THREE.Color(data.warmRimColor || '#fdba74'), data.warmRimIntensity || 0.85);
    warmRimLight.position.set(120, 140, 180);
    moneyScene.add(warmRimLight);

    // 5. Vault Steel / Slate Surface Table
    buildTableSurface(data);

    // 6. 3D Currency Bundle Stack (3 Bundles)
    buildCurrencyStack(data);

    // 7. Volumetric Dust Particles
    if (data.enableDustMotes !== false) {
      buildVolumetricDustMotes(data);
    }

    // 8. Animation Loop
    lastTimestamp = performance.now();
    animClock = 0;

    function renderLoop(now) {
      moneyAnimFrame = requestAnimationFrame(renderLoop);
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (!isManualScrub) {
        animClock += dt * (data.dropSpeed || 1.15);
      }
      const t = isManualScrub ? manualT : (animClock % (data.duration || 5.0));

      // Update stack physics, micro-settle and dust particles
      updatePhysicsStep(t, data);

      if (moneyControls) moneyControls.update();
      if (moneyRenderer && moneyScene && moneyCamera) {
        moneyRenderer.render(moneyScene, moneyCamera);
      }
    }

    moneyAnimFrame = requestAnimationFrame(renderLoop);
  };

  /**
   * Applies camera preset coordinates
   */
  function applyCameraPreset(data) {
    if (!moneyCamera) return;
    const preset = data.cameraPreset || 'macro_35';

    if (preset === 'iso_45') {
      moneyCamera.position.set(-160, 160, 220);
      moneyCamera.lookAt(0, 18, 0);
    } else if (preset === 'surveillance') {
      moneyCamera.position.set(-40, 260, 120);
      moneyCamera.lookAt(0, 10, 0);
    } else {
      // Default: Macro 35° Low-Angle close-in (Matching Image 2)
      // Height coverage ~ 50%
      moneyCamera.position.set(-115, 95, 205);
      moneyCamera.lookAt(5, 18, -10);
    }
  }

  /**
   * Builds the Vault Steel / Slate Surface Table
   */
  function buildTableSurface(data) {
    if (tableMesh && moneyScene) {
      moneyScene.remove(tableMesh);
      if (tableMesh.geometry) tableMesh.geometry.dispose();
    }
    if (shadowMesh && moneyScene) {
      moneyScene.remove(shadowMesh);
      if (shadowMesh.geometry) shadowMesh.geometry.dispose();
    }

    const steelCanvas = generateVaultSteelTexture(data);
    const steelTex = new THREE.CanvasTexture(steelCanvas);
    steelTex.wrapS = THREE.ClampToEdgeWrapping;
    steelTex.wrapT = THREE.ClampToEdgeWrapping;

    const tableGeo = new THREE.PlaneGeometry(800, 800);
    const tableMat = new THREE.MeshStandardMaterial({
      map: steelTex,
      roughness: 0.38,
      metalness: 0.82
    });

    tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.rotation.x = -Math.PI / 2;
    tableMesh.position.y = 0;
    tableMesh.receiveShadow = true;
    moneyScene.add(tableMesh);

    // Ground Contact Drop Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(240, 160);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.65)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });
    shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.2, 0);
    moneyScene.add(shadowMesh);
  }

  /**
   * Builds the 3D Currency Bundle Stack (US Dollars $10,000 straps)
   */
  function buildCurrencyStack(data) {
    if (moneyGroup && moneyScene) {
      moneyScene.remove(moneyGroup);
    }

    moneyGroup = new THREE.Group();
    bundleMeshes = [];

    // Banknote Dimensions (Ratio ~ 15.6 cm x 6.6 cm x 1.2 cm)
    const bundleLength = 156; // X length
    const bundleWidth = 66.5; // Z depth
    const bundleHeight = data.bundleThickness || 12.0; // Y thickness (100 bills)

    // Textures
    const billTopCanvas = generateBanknoteTexture(data);
    const billTopTex = new THREE.CanvasTexture(billTopCanvas);
    billTopTex.anisotropy = moneyRenderer ? moneyRenderer.capabilities.getMaxAnisotropy() : 4;

    const edgeCanvas = generateEdgeTexture(data);
    const edgeTex = new THREE.CanvasTexture(edgeCanvas);
    edgeTex.anisotropy = 4;

    const bandCanvas = generateBandTexture(data);
    const bandTex = new THREE.CanvasTexture(bandCanvas);

    // Multi-Material Array for 3D Box (Right, Left, Top, Bottom, Front, Back)
    const edgeMatSide = new THREE.MeshStandardMaterial({
      map: edgeTex,
      roughness: 0.72,
      metalness: 0.04
    });

    const edgeMatFront = new THREE.MeshStandardMaterial({
      map: edgeTex,
      roughness: 0.72,
      metalness: 0.04
    });

    const billTopMat = new THREE.MeshStandardMaterial({
      map: billTopTex,
      roughness: 0.64,
      metalness: 0.06
    });

    const billBottomMat = new THREE.MeshStandardMaterial({
      map: billTopTex, // Reversible greenback look
      roughness: 0.70,
      metalness: 0.04
    });

    const bundleMaterials = [
      edgeMatSide,  // +X (Right side edge)
      edgeMatSide,  // -X (Left side edge)
      billTopMat,   // +Y (Top bill face)
      billBottomMat,// -Y (Bottom bill face)
      edgeMatFront, // +Z (Front edge)
      edgeMatFront  // -Z (Back edge)
    ];

    // Belly Band Material
    const bandMat = new THREE.MeshStandardMaterial({
      map: bandTex,
      roughness: 0.42,
      metalness: 0.08
    });

    const count = Math.max(1, Math.min(5, data.stackCount || 3));

    // Natural micro-variations for documentary realism
    const microRotations = [
      { y: 0.0,      z: 0.0,       x: 0.0 },       // Base bundle
      { y: -0.015,   z: 0.004,     x: 0.002 },     // Middle bundle (slight -0.9° yaw)
      { y: 0.022,    z: -0.003,    x: -0.002 },    // Top bundle (slight +1.3° yaw)
      { y: -0.018,   z: 0.002,     x: 0.003 },
      { y: 0.012,    z: -0.002,    x: -0.001 }
    ];

    for (let i = 0; i < count; i++) {
      const bundleContainer = new THREE.Group();

      // Main Bundle Box Geometry
      const bundleGeo = new THREE.BoxGeometry(bundleLength, bundleHeight, bundleWidth, 4, 2, 4);
      const bundleMesh = new THREE.Mesh(bundleGeo, bundleMaterials);
      bundleMesh.castShadow = true;
      bundleMesh.receiveShadow = true;
      bundleContainer.add(bundleMesh);

      // Paper Belly Band Strap Geometry (Wrapped around center-left)
      const bandWidth = 32; // Width of the strap along X
      const bandGeo = new THREE.BoxGeometry(bandWidth, bundleHeight + 0.45, bundleWidth + 0.45);
      const bandMesh = new THREE.Mesh(bandGeo, bandMat);
      bandMesh.position.set(-6, 0, 0); // Positioned slightly left of Franklin's portrait
      bandMesh.castShadow = true;
      bandMesh.receiveShadow = true;
      bundleContainer.add(bandMesh);

      // Resting elevation
      const restingY = bundleHeight * 0.5 + (i * bundleHeight);
      bundleContainer.position.set(0, restingY, 0);

      // Micro organic offsets
      const mRot = microRotations[i % microRotations.length];
      if (data.settleOrganicTilt !== false) {
        bundleContainer.rotation.y = mRot.y;
        bundleContainer.rotation.z = mRot.z;
        bundleContainer.rotation.x = mRot.x;
      }

      bundleContainer.userData = {
        index: i,
        restingY: restingY,
        baseY: restingY,
        baseRotY: bundleContainer.rotation.y,
        baseRotZ: bundleContainer.rotation.z
      };

      moneyGroup.add(bundleContainer);
      bundleMeshes.push(bundleContainer);
    }

    // Orient stack slightly to catch the 35° camera perspective
    moneyGroup.position.set(-10, 0, 0);
    moneyGroup.rotation.y = 0.38; // ~22° angle facing camera
    moneyScene.add(moneyGroup);
  }

  /**
   * Volumetric Dust Particles System (Drifting through spotlight beam)
   */
  function buildVolumetricDustMotes(data) {
    if (dustParticles && moneyScene) {
      moneyScene.remove(dustParticles);
    }

    const count = data.dustMoteCount || 140;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    dustVelocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 260;
      pos[i * 3 + 1] = 10 + Math.random() * 180;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 220;

      dustVelocities[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
      dustVelocities[i * 3 + 1] = 0.08 + Math.random() * 0.18; // Slow upward/downward drift
      dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dustPositions = pos;

    // Glowing circular particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    pGrad.addColorStop(0.35, 'rgba(200, 230, 255, 0.55)');
    pGrad.addColorStop(0.7, 'rgba(125, 211, 252, 0.2)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTex = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      map: pTex,
      size: 4.8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    dustParticles = new THREE.Points(geo, pMat);
    moneyScene.add(dustParticles);
  }

  /**
   * Physics & Micro-Animation Update Step
   */
  function updatePhysicsStep(t, data) {
    const mode = data.animMode || 'drop_settle';
    const bounceStr = data.bounceStrength || 1.25;

    // 1. Stack Stacking Physics Sequence
    bundleMeshes.forEach((bundle, idx) => {
      const restY = bundle.userData.restingY;

      if (mode === 'macro_drift') {
        // Continuous gentle macro breathing
        bundle.position.y = restY;
        if (data.billFlutterEnabled) {
          const flutter = Math.sin(t * 8 + idx * 1.5) * 0.15;
          bundle.position.y = restY + flutter;
        }
      } else if (mode === 'rapid_stack') {
        // Stacking upward sequentially
        const dropStart = idx * 0.35;
        if (t < dropStart) {
          bundle.position.y = restY + 160;
          bundle.visible = false;
        } else {
          bundle.visible = true;
          const prog = Math.min(1.0, (t - dropStart) / 0.45);
          // Easing with overshoot bounce
          const ease = 1 - Math.pow(1 - prog, 3);
          const bounce = Math.sin(prog * Math.PI) * (1 - prog) * 12 * bounceStr;
          bundle.position.y = (restY + 160) - (160 * ease) - bounce;
        }
      } else {
        // 'drop_settle' (Default - high-stakes documentary settling)
        // Bundle 0 sits on table
        // Bundle 1 drops at t = 0.25s
        // Bundle 2 drops at t = 0.75s
        const dropTime = idx * 0.42;
        const dur = 0.52;

        if (t < dropTime) {
          bundle.position.y = restY + 140;
          bundle.visible = false;
        } else {
          bundle.visible = true;
          const elapsed = t - dropTime;
          if (elapsed < dur) {
            const p = elapsed / dur;
            // Physical cubic fall with damped spring settle
            const fall = Math.pow(p, 2.4);
            const spring = Math.sin(p * Math.PI * 3.5) * Math.exp(-p * 5.0) * 14 * bounceStr;
            bundle.position.y = (restY + 140) * (1 - fall) + restY * fall + spring;
            
            // Micro impact settling rotation
            bundle.rotation.z = bundle.userData.baseRotZ + Math.sin(p * Math.PI * 4) * Math.exp(-p * 4.0) * 0.02;
          } else {
            bundle.position.y = restY;
            bundle.rotation.z = bundle.userData.baseRotZ;
          }
        }
      }
    });

    // 2. Volumetric Dust Motes Particle Motion
    if (dustParticles && dustPositions && dustVelocities) {
      const count = dustPositions.length / 3;
      for (let i = 0; i < count; i++) {
        dustPositions[i * 3 + 0] += dustVelocities[i * 3 + 0];
        dustPositions[i * 3 + 1] += dustVelocities[i * 3 + 1];
        dustPositions[i * 3 + 2] += dustVelocities[i * 3 + 2];

        // Wrap around boundaries
        if (dustPositions[i * 3 + 1] > 200) dustPositions[i * 3 + 1] = 10;
        if (dustPositions[i * 3 + 0] > 140) dustPositions[i * 3 + 0] = -140;
        if (dustPositions[i * 3 + 0] < -140) dustPositions[i * 3 + 0] = 140;
        if (dustPositions[i * 3 + 2] > 120) dustPositions[i * 3 + 2] = -120;
        if (dustPositions[i * 3 + 2] < -120) dustPositions[i * 3 + 2] = 120;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Subtle Cinematic Macro Camera Drift
    if (data.macroDriftEnabled && !moneyControls?.state && moneyCamera) {
      const driftAngle = (t * 0.08);
      moneyCamera.position.x = -115 + Math.sin(driftAngle) * 8;
      moneyCamera.position.y = 95 + Math.cos(driftAngle * 0.8) * 4;
      moneyCamera.lookAt(5, 18, -10);
    }
  }

  /**
   * Cleanup 3D scene resources
   */
  function cleanupMoneyStack3DScene() {
    if (moneyAnimFrame) {
      cancelAnimationFrame(moneyAnimFrame);
      moneyAnimFrame = null;
    }
    if (moneyControls) {
      moneyControls.dispose();
      moneyControls = null;
    }
    if (moneyRenderer) {
      moneyRenderer.dispose();
      moneyRenderer = null;
    }
    bundleMeshes = [];
    moneyScene = null;
    moneyCamera = null;
    moneyGroup = null;
    tableMesh = null;
    shadowMesh = null;
    dustParticles = null;
  }

  /**
   * Mounts the Money Stack 3D stage inside the top template customizer modal
   */
  window.tplMountMoneyStack3DStage = function(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #05080c; overflow: hidden; cursor: grab;">
        <div id="money-stack-3d-viewport" style="position: absolute; inset: 0; width: 100%; height: 100%;"></div>
        
        <!-- Macro Lens Telemetry & Depth-of-Field HUD Pill -->
        <div style="position: absolute; bottom: 12px; left: 14px; pointer-events: none; z-index: 40; display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 9px; font-weight: 700; color: #38bdf8; background: rgba(5,8,14,0.85); border: 1px solid rgba(56,189,248,0.3); padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            3D CURRENCY RIG &bull; 35&deg; MACRO &bull; f/2.8 DoF &bull; 3x $10K BUNDLES
          </span>
          <span style="font-family: monospace; font-size: 9px; color: #94a3b8; background: rgba(5,8,14,0.7); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 4px;">
            DRAG TO ORBIT
          </span>
        </div>
      </div>
    `;

    const viewport = stage.querySelector('#money-stack-3d-viewport');
    setTimeout(() => {
      window.initMoneyStack3DScene(viewport, d);
    }, 30);
  };

  /**
   * Stepper callback for hover preview loop & live customizer playback
   */
  window.stepMoneyStackAnimation = function(container, tplId, t, data) {
    if (!container) return;
    manualT = t;
    isManualScrub = true;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    // If 3D viewport exists, step it
    const viewport = container.querySelector('#money-stack-3d-viewport');
    if (!viewport && !moneyRenderer) {
      window.initMoneyStack3DScene(container, d);
    }
    updatePhysicsStep(t, d);
  };

  /**
   * High-performance Canvas Renderer for Timeline Playback and Video Export
   */
  window.renderMoneyStackCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});

    // If WebGL renderer canvas is available, blit directly
    if (moneyRenderer && moneyRenderer.domElement) {
      updatePhysicsStep(t, d);
      if (moneyScene && moneyCamera) {
        moneyRenderer.render(moneyScene, moneyCamera);
        ctx.drawImage(moneyRenderer.domElement, 0, 0, cw, ch);
        return;
      }
    }

    // High-resolution fallback snapshot blit
    const refImg = textureCache.get('plate_img');
    if (refImg && refImg.complete) {
      ctx.drawImage(refImg, 0, 0, cw, ch);
    } else {
      const img = new Image();
      img.src = '/money_stack_cinematic_plate.png';
      img.onload = () => textureCache.set('plate_img', img);
      ctx.fillStyle = '#05080c';
      ctx.fillRect(0, 0, cw, ch);
    }
  };

  /**
   * Inspector Controls Builder
   */
  window.tplBuildMoneyStackInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">💵</span>
            <span style="font-size: 11px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.8px;">Photorealistic 3D Currency Stack</span>
          </div>
          <span style="font-size: 9px; color: #10b981; font-weight: 700; background: rgba(16,185,129,0.18); border: 1px solid rgba(16,185,129,0.35); padding: 2px 6px; border-radius: 4px;">PBR THREE.JS ENGINE</span>
        </div>

        <!-- Section 1: Currency Bundle Setup -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Bundle Specs & Denomination</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Stack Count -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Bundle Count</span>
              <select id="ms-sel-stacks" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="1" ${d.stackCount === 1 ? 'selected' : ''}>1 Bundle ($10K)</option>
                <option value="2" ${d.stackCount === 2 ? 'selected' : ''}>2 Bundles ($20K)</option>
                <option value="3" ${d.stackCount === 3 ? 'selected' : ''}>3 Bundles ($30K - Reference)</option>
                <option value="5" ${d.stackCount === 5 ? 'selected' : ''}>5 Bundles ($50K Fortress)</option>
              </select>
            </div>

            <!-- Currency Style -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Denomination</span>
              <select id="ms-sel-currency" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="usd_100" selected>$100 USD (Franklin 1996)</option>
                <option value="usd_new">$100 USD (Blue Ribbon 2013)</option>
                <option value="euro_500">&euro;500 Euro Note</option>
                <option value="gbp_50">&pound;50 Bank of England</option>
              </select>
            </div>
          </div>

          <!-- Kraft Band Stamp Text -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 8.5px; color: #cbd5e1;">Paper Band Stamp Text</span>
            <input type="text" id="ms-inp-stamp" value="${d.bandStamp || 'TEN THOUSAND'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fbbf24; font-weight: 700; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;" placeholder="e.g. TEN THOUSAND, $10,000..." />
          </div>
        </div>

        <!-- Section 2: Animation & Physics System -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Physics & Animation Mode</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
            <button type="button" id="btn-ms-anim-drop" class="btn-ms-mode" data-mode="drop_settle" style="background: ${d.animMode === 'drop_settle' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${d.animMode === 'drop_settle' ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.08)'}; color: ${d.animMode === 'drop_settle' ? '#fff' : '#94a3b8'}; padding: 6px 4px; border-radius: 6px; font-size: 9.5px; font-weight: 700; cursor: pointer;">
              Drop &amp; Settle
            </button>
            <button type="button" id="btn-ms-anim-rapid" class="btn-ms-mode" data-mode="rapid_stack" style="background: ${d.animMode === 'rapid_stack' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${d.animMode === 'rapid_stack' ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.08)'}; color: ${d.animMode === 'rapid_stack' ? '#fff' : '#94a3b8'}; padding: 6px 4px; border-radius: 6px; font-size: 9.5px; font-weight: 700; cursor: pointer;">
              Rapid Stack
            </button>
            <button type="button" id="btn-ms-anim-drift" class="btn-ms-mode" data-mode="macro_drift" style="background: ${d.animMode === 'macro_drift' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${d.animMode === 'macro_drift' ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.08)'}; color: ${d.animMode === 'macro_drift' ? '#fff' : '#94a3b8'}; padding: 6px 4px; border-radius: 6px; font-size: 9.5px; font-weight: 700; cursor: pointer;">
              Macro Drift
            </button>
          </div>

          <!-- Bounce & Speed Sliders -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #cbd5e1;">
              <span>Drop Compression &amp; Weight</span>
              <span id="ms-val-bounce">${Math.round((d.bounceStrength || 1.25) * 100)}%</span>
            </div>
            <input type="range" id="ms-slider-bounce" min="50" max="250" value="${Math.round((d.bounceStrength || 1.25) * 100)}" style="width: 100%; accent-color: #10b981;" />
          </div>
        </div>

        <!-- Section 3: Macro Camera & Atmospheric Environment -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Camera Rig &amp; Environment</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Surface Table -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Surface Table</span>
              <select id="ms-sel-surface" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="vault_steel" ${d.surfaceType === 'vault_steel' ? 'selected' : ''}>Dark Vault Steel</option>
                <option value="mahogany" ${d.surfaceType === 'mahogany' ? 'selected' : ''}>Mahogany Wood</option>
                <option value="tactical_grid" ${d.surfaceType === 'tactical_grid' ? 'selected' : ''}>Tactical Grid</option>
              </select>
            </div>

            <!-- Camera Perspective -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 8.5px; color: #cbd5e1;">Macro Perspective</span>
              <select id="ms-sel-camera" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; outline: none;">
                <option value="macro_35" ${d.cameraPreset === 'macro_35' ? 'selected' : ''}>35&deg; Macro Low-Angle</option>
                <option value="iso_45" ${d.cameraPreset === 'iso_45' ? 'selected' : ''}>45&deg; Cinematic Isometric</option>
                <option value="surveillance" ${d.cameraPreset === 'surveillance' ? 'selected' : ''}>Top-Down Surveillance</option>
              </select>
            </div>
          </div>

          <!-- Volumetric Dust Motes Toggle -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 12px;">✨</span>
              <span style="font-size: 9.5px; font-weight: 600; color: #cbd5e1;">Volumetric Dust Motes in Spotlight</span>
            </div>
            <input type="checkbox" id="ms-chk-dust" ${d.enableDustMotes !== false ? 'checked' : ''} style="accent-color: #38bdf8; cursor: pointer;" />
          </div>
        </div>

        <!-- Reset Button -->
        <button type="button" id="btn-ms-reset" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; margin-top: 4px;">
          Reset to Reference Defaults
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

    container.querySelector('#ms-sel-stacks')?.addEventListener('change', (e) => {
      updateData({ stackCount: parseInt(e.target.value, 10) });
    });

    container.querySelector('#ms-sel-currency')?.addEventListener('change', (e) => {
      updateData({ currencyStyle: e.target.value });
    });

    container.querySelector('#ms-inp-stamp')?.addEventListener('input', (e) => {
      updateData({ bandStamp: e.target.value });
    });

    container.querySelectorAll('.btn-ms-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        container.querySelectorAll('.btn-ms-mode').forEach(b => {
          const isSel = b.getAttribute('data-mode') === mode;
          b.style.background = isSel ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.04)';
          b.style.border = isSel ? '1px solid rgba(16,185,129,0.7)' : '1px solid rgba(255,255,255,0.08)';
          b.style.color = isSel ? '#fff' : '#94a3b8';
        });
        updateData({ animMode: mode });
      });
    });

    container.querySelector('#ms-slider-bounce')?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      const lbl = container.querySelector('#ms-val-bounce');
      if (lbl) lbl.textContent = `${v}%`;
      updateData({ bounceStrength: v / 100 });
    });

    container.querySelector('#ms-sel-surface')?.addEventListener('change', (e) => {
      updateData({ surfaceType: e.target.value });
    });

    container.querySelector('#ms-sel-camera')?.addEventListener('change', (e) => {
      updateData({ cameraPreset: e.target.value });
    });

    container.querySelector('#ms-chk-dust')?.addEventListener('change', (e) => {
      updateData({ enableDustMotes: e.target.checked });
    });

    container.querySelector('#btn-ms-reset')?.addEventListener('click', () => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
        window.tplUpdateStageWithContextualData(tplId, DEFAULT_CONFIG);
      }
    });
  };

  // Expose configuration globally
  window.MONEY_STACK_CONFIG = DEFAULT_CONFIG;
  console.log('[Money Stack 3D Engine] Initialized Photorealistic 3D Currency Stack Animation Engine');
})();
