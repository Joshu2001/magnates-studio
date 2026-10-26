/**
 * ============================================================================
 * ADIDAS VS. PUMA: COSMIC RIFT, OPTICAL REFRACTION, 3D GRAVITY GLOBE &
 * GOOGLE EARTH CLOUD-DIVE ENGINE
 * (TEMPLATE_ID: 'adidas-puma-cosmic-earth-suite')
 * ============================================================================
 * PhD-Level Broadcast VFX & Compositing Engine:
 * - Act 1 (0.0s – 2.2s): Deep Sapphire vs. Velvet Burgundy Fractal Cosmic
 *   Nebula, Living Nebula-Embedded Cloud-Bleed Logos (aspect-locked authentic
 *   Adidas & PUMA vector cutouts with real-time flowing internal cloud
 *   turbulence & subsurface optical light pass-through), High-Density 3-Tier
 *   Starfield (up to 2,500 micro-stardust grains + twinkling stars + 4-point
 *   diamond flares), Razor-Thin Central Optical Rift with tight North/South
 *   Pole Rim Kisses (plus interactive on-stage manual path tracing), and
 *   High-Contrast Cross-Hemisphere Optical Refraction (Top Star travelling
 *   Right -> Rift -> Left Adidas stripe + Counter-Moving Neon Halos sweeping
 *   Red <-> Blue across both logos).
 * - Act 2 (2.2s – 5.2s): Exponential Gravitational Camera Pull + True 3D
 *   Spherical Earth with user-controllable Spin Revolutions (0.25x – 5.0x
 *   full spins), Razor-Sharp Rayleigh Atmospheric Limb Crescent (zero blown-out
 *   white blob), pinpoint city-light filaments, and curved Atlantic terminator.
 * - Act 3 (5.2s – 7.6s): Seamless Full-Frame Europe Night City Lights Macro
 *   (zero wireframe border artifacts, zero double-image ghosting) with
 *   Herzogenaurach regional glow and encroaching storm cloud bank.
 * - Act 4 (7.6s – 12.0s): Multi-Phase Stratospheric Cloud Breakthrough into
 *   Daytime Google Earth Satellite Terrain with cumulus cloud framing and
 *   attribution.
 * - Interactive Stage UX: On-Stage Selection Sheen Box with corner handles &
 *   diagonal light sweep on every tapped object, plus working bottom-right Eye
 *   icon (#btn-tpl-hud-clean-view) & top Clean Screen toggle.
 * ============================================================================
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'adidas-puma-cosmic-earth-suite';

  const SCENES = [
    {
      id: 'scene1',
      index: 1,
      shortLabel: 'Act 1',
      title: 'Act 1: Cosmic Rift & Logos',
      sub: '0.0s – 2.2s • Dual Nebula, Living Logos & Cross-Halo',
      start: 0.0,
      end: 2.2
    },
    {
      id: 'scene2',
      index: 2,
      shortLabel: 'Act 2',
      title: 'Act 2: 3D Globe Gravity Spin',
      sub: '2.2s – 5.2s • Limb Crescent & Multi-Spin Gravity Zoom',
      start: 2.2,
      end: 5.2
    },
    {
      id: 'scene3',
      index: 3,
      shortLabel: 'Act 3',
      title: 'Act 3: Europe City Lights',
      sub: '5.2s – 7.6s • Night Satellite Plate & Storm Front',
      start: 5.2,
      end: 7.6
    },
    {
      id: 'scene4',
      index: 4,
      shortLabel: 'Act 4',
      title: 'Act 4: Cloud Dive & Satellite',
      sub: '7.6s – 12.0s • Cloud Breakthrough & Google Earth',
      start: 7.6,
      end: 12.0
    }
  ];

  // Clean vector Lucide SVGs (Zero emojis)
  const ENGINE_SVGS = {
    layers: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    imageIcon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',
    wand: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4-1 1 4 4 1-1a2.83 2.83 0 1 0-4-4Z"></path><path d="m13 6-8.5 8.5a2.12 2.12 0 1 0 3 3L16 9"></path><path d="M18 13v5"></path><path d="M15.5 15.5h5"></path></svg>',
    sparkles: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M3 5h4"></path></svg>',
    cloud: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>',
    check: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    rotateCcw: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>',
    eye: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>',
    closeX: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
  };

  // ==========================================================================
  // 1. PRECISION ASPECT-LOCKED VECTOR LOGO LOCKUPS (ZERO FONT/STRETCH ARTIFACTS)
  //    Pure geometric vector paths matching image_be30fa77.png 1:1
  // ==========================================================================
  function svgToDataUri(svgString) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString.trim());
  }

  const DEFAULT_LOGO_URIS = {
    // Authentic Adidas 3-Stripes Mountain + geometric lowercase 'adidas' wordmark
    adidasLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 520">
        <g fill="#ffffff">
          <!-- Three parallel 30-degree Adidas Equipment mountain bars -->
          <polygon points="154,284 236,235 278,284"/>
          <polygon points="256,222 338,173 414,284 298,284"/>
          <polygon points="358,160 440,111 550,284 434,284"/>
          <!-- Heavy geometric lowercase 'adidas' lockup -->
          <text x="372" y="424" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', 'Arial Black', sans-serif" font-weight="900" font-size="168" letter-spacing="-5">adidas</text>
        </g>
      </svg>
    `),

    // Authentic PUMA Lockup (Matches Image 2 / image_3f10be62.png 1:1):
    // - Pure geometric PUMA block glyphs (P-U-M-A with rounded outer corners and vertical slit counters)
    // - Anatomically exact leaping Puma cat with compact rounded feline head, short forward-tilted ears,
    //   defined snout & chin/neck hollow, downward-hooked/curved front paws tucked below the chin,
    //   muscular shoulder arch, narrow tucked waist, sweeping tapered hind leg down the right slope of A,
    //   upward-curving thick tail, and the authentic ® registered trademark mark!
    pumaLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 520">
        <g fill="#ffffff" fill-rule="evenodd">
          <!-- Anatomically Exact Leaping PUMA Cat Silhouette (Matches image_3f10be62.png 1:1) -->
          <path fill-rule="nonzero" d="
            M 412,92
            C 417,85 426,81 435,81
            L 442,68 C 445,63 451,65 450,73
            L 458,66 C 463,62 469,66 465,76
            C 474,82 486,91 502,101
            C 528,117 558,136 592,155
            C 618,169 640,179 658,182
            C 676,185 691,173 696,150
            C 700,131 702,108 708,90
            C 711,80 723,82 721,93
            C 717,114 715,138 710,160
            C 704,185 687,201 664,203
            C 656,204 647,203 638,200
            C 656,222 674,248 690,273
            C 695,281 686,288 678,282
            C 662,269 642,246 623,222
            C 631,239 639,257 645,273
            C 648,281 638,286 631,279
            C 616,262 598,234 582,206
            C 550,192 520,173 492,155
            C 472,142 454,138 438,143
            C 420,149 401,158 386,164
            C 382,166 379,170 378,176
            C 377,183 367,183 367,174
            C 367,163 373,154 384,149
            C 399,142 416,135 432,129
            C 414,132 395,137 380,143
            C 375,145 372,149 371,156
            C 370,163 360,162 360,153
            C 361,142 368,133 380,128
            C 396,122 414,118 428,116
            C 424,116 418,115 413,112
            C 406,108 406,98 412,92
            Z
          "/>

          <!-- Authentic ® Registered Trademark Mark beside the hind foot above A -->
          <path d="
            M 706,256
            A 10,10 0 1,1 705.9,256 Z
            M 706,258.2
            A 7.8,7.8 0 1,0 706.1,258.2 Z
          "/>
          <path fill-rule="nonzero" d="
            M 702.5,261 H 706.8 C 708.8,261 709.8,262 709.8,263.6
            C 709.8,264.9 709,265.8 707.7,266.1 L 710,269.8 H 707.8
            L 705.8,266.3 H 704.5 V 269.8 H 702.5 V 261 Z
            M 704.5,262.7 V 264.8 H 706.5 C 707.3,264.8 707.8,264.4 707.8,263.7
            C 707.8,263.1 707.3,262.7 706.5,262.7 H 704.5 Z
          "/>

          <!-- Letter P: Heavy rounded-corner block with narrow vertical slit counter -->
          <path d="
            M 38,290
            H 146 C 170,290 184,304 184,328
            V 368 C 184,392 170,406 146,406
            H 92 V 450 H 38 V 290 Z
            M 92,322 V 374 H 124 C 132,374 136,370 136,362 V 334 C 136,326 132,322 124,322 H 92 Z
          "/>

          <!-- Letter U: Heavy rounded-corner block with narrow central slit -->
          <path d="
            M 204,290
            H 258 V 408 C 258,415 262,418 270,418
            H 284 C 292,418 296,415 296,408
            V 290 H 350 V 412 C 350,436 336,450 312,450
            H 242 C 218,450 204,436 204,412 V 290 Z
          "/>

          <!-- Letter M: Heavy 3-pillar geometric PUMA block M -->
          <path d="
            M 370,290
            H 434 L 464,366 L 494,290
            H 558 V 450 H 506 V 356 L 478,432 H 450 L 422,356 V 450 H 370 V 290 Z
          "/>

          <!-- Letter A: Heavy rounded-top geometric block A with crossbar & counter -->
          <path d="
            M 604,290
            H 688 C 712,290 726,304 726,328
            V 450 H 672 V 408 H 620 V 450 H 566 V 328 C 566,304 580,290 604,290 Z
            M 620,324 V 374 H 672 V 324 C 672,318 668,315 662,315 H 630 C 624,315 620,318 620,324 Z
          "/>
        </g>
      </svg>
    `),

    nikeLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440">
        <g fill="#ffffff">
          <path d="M 145,215 C 115,255 95,295 118,318 C 142,342 195,328 255,302 L 525,184 C 535,179 532,171 522,174 L 238,252 C 192,264 158,255 152,222 C 150,212 148,210 145,215 Z"/>
          <text x="320" y="170" text-anchor="middle" font-family="'Oswald', 'Impact', sans-serif" font-weight="900" font-style="italic" font-size="118" letter-spacing="4">NIKE</text>
        </g>
      </svg>
    `),

    appleLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440">
        <g fill="#ffffff" transform="translate(195, 36) scale(0.95)">
          <path d="M188.5 145.2c-.4-38.3 31.3-56.8 32.7-57.7-17.9-26.1-45.6-29.7-55.4-30.1-23.4-2.4-46.1 13.9-58 13.9-12.1 0-30.5-13.6-50.2-13.2-25.7.4-49.5 15-62.7 38-26.9 46.6-6.9 115.4 19.1 153.1 12.8 18.5 27.9 39.2 47.8 38.5 19.3-.8 26.6-12.4 49.9-12.4 23.1 0 29.9 12.4 50.1 12 20.8-.4 33.9-18.7 46.5-37.3 14.8-21.5 20.8-42.4 21.1-43.5-.5-.2-40.5-15.5-40.9-61.3zM150.3 42.1c10.5-12.8 17.6-30.4 15.6-48.1-15.2.6-33.8 10.1-44.6 22.8-9.6 11.1-18.1 29.1-15.8 46.4 17 1.3 34.3-8.4 44.8-21.1z"/>
          <text x="125" y="355" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="88">Apple</text>
        </g>
      </svg>
    `)
  };

  // Authentic reference plates for hybrid photographic detail in Act 3 & Act 4
  const REFERENCE_PLATES = {
    act3EuropeLights: '/assets/aistudio/image_cc4e4bea.png',
    act4DarkStormClouds: '/assets/aistudio/image_02367181.png',
    act4SunlitClouds: '/assets/aistudio/image_8ba1783a.png',
    act4GoogleEarthSat: '/assets/aistudio/image_66ad139b.png',
    act4Frame1Clouds: '/assets/aistudio/image_364a48a9.png',
    act4Frame2Clouds: '/assets/aistudio/image_94f54734.png',
    act4Frame3Border: '/assets/aistudio/image_4a2b9f34.png',
    act4Frame4Border: '/assets/aistudio/image_c041b82b.png',
    act4Frame5Label: '/assets/aistudio/image_cf5e30ea.png',
    act4Frame6Tilt: '/assets/aistudio/image_438c334b.png',
    act4Frame7Tilt: '/assets/aistudio/image_e16e1d82.png',
    act4Frame8Close: '/assets/aistudio/image_5da88603.png',
    act4Frame9Climax: '/assets/aistudio/image_c1794721.png',
    act4AiDroneVideo: '/assets/aistudio/gemini_generated_video_1430fbc5_aerial_drone_shot_a84f974f.mp4'
  };

  // ==========================================================================
  // 2. IMAGE CACHE, AI DRONE VIDEO SYNC & AUTO BACKGROUND REMOVAL
  // ==========================================================================
  const _imageCache = new Map();
  const _processedBgRemovedCache = new Map();
  let _aiDroneVideoEl = null;
  let _aiDroneVideoReady = false;
  let _lastSyncedDroneVidTime = -1;

  function getSyncedAiDroneVideoElement(act4Progress01) {
    if (typeof document === 'undefined') return null;
    if (!_aiDroneVideoEl) {
      const vid = document.createElement('video');
      vid.src = REFERENCE_PLATES.act4AiDroneVideo;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = 'auto';
      vid.crossOrigin = 'anonymous';
      vid.addEventListener('loadeddata', () => {
        _aiDroneVideoReady = true;
        if (typeof window.apceRequestRender === 'function') {
          window.apceRequestRender();
        }
      });
      vid.load();
      _aiDroneVideoEl = vid;
    }
    if (_aiDroneVideoReady && _aiDroneVideoEl.duration > 0.5) {
      const targetT = clamp(act4Progress01, 0, 0.995) * _aiDroneVideoEl.duration;
      if (Math.abs(targetT - _lastSyncedDroneVidTime) > 0.04 && !_aiDroneVideoEl.seeking) {
        _lastSyncedDroneVidTime = targetT;
        try {
          _aiDroneVideoEl.currentTime = targetT;
        } catch (_) {}
      }
    }
    return _aiDroneVideoReady ? _aiDroneVideoEl : null;
  }

  function getLoadedImage(src) {
    if (!src) return null;
    if (_imageCache.has(src)) {
      return _imageCache.get(src);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const record = { img, loaded: false, error: false };
    img.onload = () => {
      record.loaded = true;
      if (src === REFERENCE_PLATES.act3EuropeLights) {
        _worldNightEuOverlayApplied = false;
      }
      if (typeof window.apceRequestRender === 'function') {
        window.apceRequestRender();
      }
    };
    img.onerror = () => {
      record.error = true;
    };
    img.src = src;
    _imageCache.set(src, record);
    return record;
  }

  /**
   * Computes aspect-ratio-preserved (object-fit: contain) rectangle inside a target box
   * so neither PUMA nor any user-uploaded logo is ever stretched!
   */
  function computeContainRect(drawable, boxCenterX, boxCenterY, maxW, maxH) {
    const natW = drawable.naturalWidth || drawable.width || 760;
    const natH = drawable.naturalHeight || drawable.height || 520;
    const aspect = natW / Math.max(1, natH);
    let drawW = maxW;
    let drawH = drawW / aspect;
    if (drawH > maxH) {
      drawH = maxH;
      drawW = drawH * aspect;
    }
    return {
      x: boxCenterX - drawW * 0.5,
      y: boxCenterY - drawH * 0.5,
      w: Math.max(1, drawW),
      h: Math.max(1, drawH)
    };
  }

  /**
   * Automatically strips solid backgrounds (white, black, or corner-sampled color)
   * and converts the logo into a clean alpha silhouette so cosmic clouds bleed
   * naturally through any user-uploaded PNG/JPG.
   */
  function getBgRemovedLogoCanvas(imgRec, srcKey, removeBgEnabled, threshold = 42) {
    if (!imgRec || !imgRec.loaded) return null;
    if (!removeBgEnabled || srcKey.startsWith('data:image/svg+xml')) {
      return imgRec.img;
    }
    const cacheKey = `${srcKey}__${threshold}`;
    if (_processedBgRemovedCache.has(cacheKey)) {
      return _processedBgRemovedCache.get(cacheKey);
    }
    try {
      const iw = Math.min(imgRec.img.naturalWidth || 512, 680);
      const ih = Math.min(imgRec.img.naturalHeight || 512, 680);
      const c = document.createElement('canvas');
      c.width = iw;
      c.height = ih;
      const cctx = c.getContext('2d');
      cctx.drawImage(imgRec.img, 0, 0, iw, ih);
      const imgData = cctx.getImageData(0, 0, iw, ih);
      const d = imgData.data;
      const bgR = d[0], bgG = d[1], bgB = d[2], bgA = d[3];
      if (bgA > 180) {
        const tol = Math.max(14, threshold);
        for (let i = 0; i < d.length; i += 4) {
          const dr = Math.abs(d[i] - bgR);
          const dg = Math.abs(d[i + 1] - bgG);
          const db = Math.abs(d[i + 2] - bgB);
          const dist = (dr + dg + db) / 3;
          if (dist < tol) {
            d[i + 3] = 0;
          } else if (dist < tol * 1.75) {
            d[i + 3] = Math.round(d[i + 3] * ((dist - tol) / (tol * 0.75)));
          }
        }
        cctx.putImageData(imgData, 0, 0);
      }
      _processedBgRemovedCache.set(cacheKey, c);
      return c;
    } catch (_) {
      return imgRec.img;
    }
  }

  // ==========================================================================
  // 3. DEFAULT CONFIGURATION STATE (WITH GRANULAR SPIN, LIGHT & STAR CONTROLS)
  // ==========================================================================
  function createDefaultAdidasPumaConfig() {
    return {
      type: TEMPLATE_ID,
      activeSceneFilter: 'all',
      cleanScreenHudHidden: false,
      playbackSpeed: 1.0,
      isTracingRiftPath: false,
      selectedStageLayer: 'left_logo_adidas',
      showStageSelectionBox: true,

      // LEFT & RIGHT LOGOS + LIVING CLOUD BLEED + LIGHT PASS-THROUGH
      leftLogoPreset: 'adidas',
      leftLogoUrl: DEFAULT_LOGO_URIS.adidasLogo,
      leftLogoTitle: 'adidas',
      leftLogoTint: '#38bdf8',
      leftLogoOpacity: 0.78,
      leftLogoScale: 1.0,
      leftLogoOffsetX: 0,
      leftLogoOffsetY: 0,
      leftLogoRemoveBg: true,
      leftLogoRemoved: false,

      rightLogoPreset: 'puma',
      rightLogoUrl: DEFAULT_LOGO_URIS.pumaLogo,
      rightLogoTitle: 'PUMA',
      rightLogoTint: '#f43f5e',
      rightLogoOpacity: 0.80,
      rightLogoScale: 1.0,
      rightLogoOffsetX: 0,
      rightLogoOffsetY: 0,
      rightLogoRemoveBg: true,
      rightLogoRemoved: false,

      logoCloudBleedStrength: 0.78,
      logoCloudMotionSpeed: 1.25,
      logoLightPassThrough: 1.35,

      // DUAL COSMIC NEBULA COLORS & VOLUMETRIC CLOUDS
      nebulaPalettePreset: 'authentic_blue_crimson',
      leftNebulaPrimaryColor: '#0055d4',
      leftNebulaSecondaryColor: '#00a8ff',
      leftNebulaDeepColor: '#020818',
      rightNebulaPrimaryColor: '#9f1239',
      rightNebulaSecondaryColor: '#e11d48',
      rightNebulaDeepColor: '#19020a',
      nebulaCloudDensity: 0.96,
      nebulaCloudSpeed: 1.15,
      nebulaScale: 1.0,
      nebulaOffsetX: 0,
      nebulaOffsetY: 0,

      // CENTRAL LIGHT RIFT & INTERACTIVE MANUAL PATH TRACER
      riftPathMode: 'vertical_authentic', // 'vertical_authentic' | 'diagonal_clash' | 's_curve' | 'lightning_rift' | 'custom_traced'
      customRiftPoints: [],
      riftCoreColor: '#ffffff',
      riftLeftGlowColor: '#38bdf8',
      riftRightGlowColor: '#fb7185',
      riftWidthPx: 10,
      riftGlowIntensity: 1.15,
      riftCenterPinchFlare: 1.15,
      riftOffsetX: 0,
      riftOffsetY: 0,

      // HIGH-DENSITY 3-TIER STARFIELD & AMBIANCE PARTICLES + TWINKLE CONTROLS
      ambianceMode: 'stars', // 'stars' | 'rain' | 'snow' | 'embers' | 'cosmic_dust'
      microStardustCount: 1500,
      ambianceParticleCount: 340,
      ambianceParticleSpeed: 1.0,
      ambianceTwinkleIntensity: 1.35,
      ambianceTwinkleSpeed: 1.35,
      prominentPumaStarEnabled: true,

      // TRAVELLING SUN-STAR & CROSS-HEMISPHERE NEON OPTICAL HALO (RED <-> BLUE)
      starTrajectoryMode: 'right_to_left_authentic', // 'right_to_left_authentic' | 'left_to_right' | 'top_to_bottom' | 'bottom_to_top' | 'orbit_globe'
      starTravelSpeed: 1.0,
      starCoreSize: 1.15,
      starOffsetX: 0,
      starOffsetY: 0,
      starFlareColor: '#ffffff',
      neonRefractionEnabled: true,
      neonRefractionIntensity: 1.35,
      crossHemisphereHaloIntensity: 1.40,
      neonRefractionTopColor: '#22d3ee',
      neonRefractionBottomColor: '#ff2a6d',
      neonRefractionRingCount: 3,

      // 3D SPINNING EARTH GLOBE, SURFACE-WRAPPING SUNLIGHT & SPIN REVOLUTIONS
      globeSpinDirection: 'west_to_east_authentic', // 'west_to_east_authentic' | 'east_to_west' | 'north_to_south' | 'south_to_north' | 'diagonal_tumble'
      globeSpinRevolutions: 1.35, // Natural final axial spin before zooming into Europe (0.25 to 5.0 revolutions)
      globeSpinSpeed: 1.15,
      globeGravityAcceleration: 1.25,
      globeInitialScale: 0.145,
      globeOffsetX: 0,
      globeOffsetY: 0,
      globeDaylightRimColor: '#67e8f9',
      globeDaylightRimIntensity: 1.25,
      globeCrescentWidth: 0.22, // Surface-wrapping twilight + limb crescent (0.08 to 0.45)
      globeSunAngleDeg: 148, // Upper-left limb angle in degrees
      globeTerminatorShadowArc: true,
      globeCityLightsColor: '#fef08a',
      globeCityLightsIntensity: 1.35,
      globeTargetRegion: 'europe_germany', // 'europe_germany' | 'north_america' | 'east_asia' | 'global'

      // ACT 3 & 4: EUROPE CITY LIGHTS MACRO, GOLDEN-YELLOW TERRITORIAL GLOW & CLOUD DIVE
      macroMapMode: 'photographic_authentic', // 'photographic_authentic' | 'continual_3d_globe' | 'procedural_vector'
      regionHighlightEnabled: true,
      regionHighlightColor: '#fde047',
      cloudDiveDensity: 1.15,
      cloudDiveSpeed: 1.15,
      satelliteTerrainStyle: 'authentic_daylight', // 'authentic_daylight' | 'tactical_dark' | 'emerald_topo'
      act4MapSourceMode: 'multi_lod_authentic', // 'multi_lod_authentic' | 'ai_drone_video' | 'reference_sequence_plates' | 'custom_uploaded'
      customSatelliteMapUrl: '',
      satelliteScale: 1.0,
      satelliteOffsetX: 0,
      satelliteOffsetY: 0,
      googleEarthWatermarkText: 'Google Earth',
      googleEarthSubText: 'Landsat / Copernicus, Data SIO, NOAA',
      showGoogleEarthWatermark: true,

      // ACT 4: HERZOGENAURACH GIS VECTOR BORDER, EXTERIOR TILT-SHIFT DOF, TITLE -> GHOST WATERMARK & 3D LOGOS
      herzogBorderEnabled: true,
      herzogBorderColor: '#ffffff',
      herzogBorderGlowColor: '#7dd3fc',
      herzogBorderWidthPx: 2.8,
      herzogBorderScale: 1.0,
      herzogBorderOffsetX: 0,
      herzogBorderOffsetY: 0,
      herzogTiltShiftBlurEnabled: true,
      herzogTiltShiftIntensity: 1.15,

      herzogTitleEnabled: true,
      herzogTitleText: 'HERZOGENAURACH',
      herzogTitleColor: '#ffffff',
      herzogTitleAngleDeg: 58, // Authentic 58-degree NW-to-SE valley axis rotation in Frames 4-8
      herzogTitleScale: 1.0,
      herzogTitleOffsetX: 0,
      herzogTitleOffsetY: 0,
      herzogGhostWatermarkEnabled: true,
      herzogGhostWatermarkOpacity: 0.22, // Horizontal ghosted background watermark in Frame 9 (image_c1794721.png)

      act4TerritorialLogosEnabled: true,
      act4TerritorialLogoOpacity: 0.36, // 3D glass translucent rooftop blend in Frame 9 (image_c1794721.png)
      act4TerritorialLogo3DDepth: 1.15,
      act4TerritorialLogoScale: 1.0
    };
  }

  let _configHydrated = false;
  let _soloSceneStartPerf = performance.now() - 250;

  function syncContextualStoreSnapshot(cfg) {
    try {
      if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
        if (!topCustomizerState.customData) topCustomizerState.customData = {};
        topCustomizerState.customData[TEMPLATE_ID] = Object.assign({}, cfg);
      }
      const raw = localStorage.getItem('magnates_tpl_contextual_store_v1');
      const parsed = raw ? (JSON.parse(raw) || {}) : {};
      parsed[TEMPLATE_ID] = Object.assign({}, parsed[TEMPLATE_ID] || {}, {
        activeSceneFilter: cfg.activeSceneFilter
      });
      localStorage.setItem('magnates_tpl_contextual_store_v1', JSON.stringify(parsed));
    } catch (_) {}
  }

  function getConfig(overrideData) {
    const defs = createDefaultAdidasPumaConfig();
    if (!window.ADIDAS_PUMA_COSMIC_CONFIG) {
      window.ADIDAS_PUMA_COSMIC_CONFIG = Object.assign({}, defs);
    }
    if (!window.customTemplateData) {
      window.customTemplateData = {};
    }
    if (!_configHydrated) {
      _configHydrated = true;
      Object.keys(defs).forEach((k) => {
        if (window.customTemplateData[k] === undefined) {
          window.customTemplateData[k] = defs[k];
        }
        if (window.ADIDAS_PUMA_COSMIC_CONFIG[k] === undefined) {
          window.ADIDAS_PUMA_COSMIC_CONFIG[k] = defs[k];
        }
      });
    }
    if (overrideData && typeof overrideData === 'object') {
      Object.keys(defs).forEach((k) => {
        if (
          k === 'activeSceneFilter' ||
          k === 'cleanScreenHudHidden' ||
          k === 'isTracingRiftPath' ||
          k === 'customRiftPoints' ||
          k === 'selectedStageLayer' ||
          k === 'showStageSelectionBox'
        ) {
          return;
        }
        if (overrideData[k] !== undefined) {
          window.ADIDAS_PUMA_COSMIC_CONFIG[k] = overrideData[k];
          window.customTemplateData[k] = overrideData[k];
        }
      });
    }
    return window.ADIDAS_PUMA_COSMIC_CONFIG;
  }

  function updateConfigKey(key, val) {
    const cfg = getConfig();
    cfg[key] = val;
    if (!window.customTemplateData) window.customTemplateData = {};
    window.customTemplateData[key] = val;

    try {
      if (typeof window.tplGetContextualData === 'function') {
        const ctxData = window.tplGetContextualData(TEMPLATE_ID);
        if (ctxData) ctxData[key] = val;
      }
      if (typeof window.tplSaveContextualStore === 'function') {
        window.tplSaveContextualStore();
      }
    } catch (_) {}

    if (typeof window.apceRequestRender === 'function') {
      window.apceRequestRender();
    }
  }

  // Preload default logos and reference plates
  Object.values(DEFAULT_LOGO_URIS).forEach((uri) => getLoadedImage(uri));
  Object.values(REFERENCE_PLATES).forEach((uri) => getLoadedImage(uri));

  // ==========================================================================
  // 4. DETERMINISTIC MATH, 2D VALUE NOISE, FBM & COLOR HELPERS
  // ==========================================================================
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.0001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function easeInOutCubic(x) {
    const t = clamp(x, 0, 1);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeInCubic(x) {
    const t = clamp(x, 0, 1);
    return t * t * t;
  }

  function easeOutCubic(x) {
    const t = clamp(x, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  }

  function hash1D(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function hash2D(ix, iy) {
    const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise2D(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = hash2D(ix, iy);
    const b = hash2D(ix + 1, iy);
    const c = hash2D(ix, iy + 1);
    const d = hash2D(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  function fbm2D(x, y, octaves = 5) {
    let val = 0;
    let amp = 0.5;
    let freq = 1.0;
    for (let i = 0; i < octaves; i++) {
      val += amp * valueNoise2D(x * freq, y * freq);
      freq *= 2.03;
      amp *= 0.5;
    }
    return val;
  }

  function hexToRgb(hex) {
    const clean = String(hex || '#38bdf8').replace('#', '');
    if (clean.length === 3) {
      return {
        r: parseInt(clean[0] + clean[0], 16) || 0,
        g: parseInt(clean[1] + clean[1], 16) || 0,
        b: parseInt(clean[2] + clean[2], 16) || 0
      };
    }
    return {
      r: parseInt(clean.slice(0, 2), 16) || 0,
      g: parseInt(clean.slice(2, 4), 16) || 0,
      b: parseInt(clean.slice(4, 6), 16) || 0
    };
  }

  function rgbaStr(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1).toFixed(3)})`;
  }

  let _lastStageHitBoxes = [];

  // ==========================================================================
  // 5. RIFT PATH GEOMETRY & INTERACTIVE PATH EVALUATION
  // ==========================================================================
  function getRiftXAtNormalizedY(yn, cfg, timeSec) {
    const mode = cfg.riftPathMode || 'vertical_authentic';
    const userShiftX = clamp(Number(cfg.riftOffsetX || 0) / 1280, -0.42, 0.42);
    if (mode === 'custom_traced' && Array.isArray(cfg.customRiftPoints) && cfg.customRiftPoints.length >= 2) {
      const pts = cfg.customRiftPoints;
      let bestDist = Infinity;
      let bestX = 0.5;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const minY = Math.min(a.y, b.y);
        const maxY = Math.max(a.y, b.y);
        if (yn >= minY - 0.02 && yn <= maxY + 0.02) {
          const t = Math.abs(b.y - a.y) < 0.0001 ? 0.5 : clamp((yn - a.y) / (b.y - a.y), 0, 1);
          return clamp(lerp(a.x, b.x, t) + userShiftX, 0.05, 0.95);
        }
        const d = Math.min(Math.abs(yn - a.y), Math.abs(yn - b.y));
        if (d < bestDist) {
          bestDist = d;
          bestX = Math.abs(yn - a.y) < Math.abs(yn - b.y) ? a.x : b.x;
        }
      }
      return clamp(bestX + userShiftX, 0.05, 0.95);
    }
    if (mode === 'diagonal_clash') {
      return clamp(0.58 - (yn - 0.5) * 0.28 + userShiftX, 0.05, 0.95);
    }
    if (mode === 's_curve') {
      return clamp(0.5 + Math.sin((yn - 0.5) * Math.PI * 1.8 + timeSec * 0.45) * 0.075 + userShiftX, 0.05, 0.95);
    }
    if (mode === 'lightning_rift') {
      const seg = Math.floor(yn * 16);
      const frac = yn * 16 - seg;
      const o1 = (hash1D(seg * 19.3) - 0.5) * 0.055;
      const o2 = (hash1D((seg + 1) * 19.3) - 0.5) * 0.055;
      return clamp(0.5 + lerp(o1, o2, frac) + userShiftX, 0.05, 0.95);
    }
    // Authentic razor-straight vertical rift at x = 0.505 + interactive drag offset
    return clamp(0.505 + userShiftX, 0.05, 0.95);
  }

  // ==========================================================================
  // 6. HIGH-RES FRACTAL COSMIC NEBULA, LIVING CLOUD MASK & STARDUST GENERATOR
  //    Deep Sapphire-Cobalt (Left) vs. Velvet Burgundy-Crimson (Right)
  // ==========================================================================
  let _nebulaCacheCanvas = null;
  let _nebulaCloudMaskCanvas = null;
  let _nebulaBrightFilamentCanvas = null;
  let _nebulaCacheKey = '';
  let _logoCompCanvas = null;
  let _stardustCacheCanvases = null;
  let _stardustCacheKey = '';
  let _worldNightEuOverlayApplied = false;

  function resolveNebulaColors(cfg) {
    const preset = cfg.nebulaPalettePreset || 'authentic_blue_crimson';
    if (preset === 'gold_purple') {
      return {
        leftPrim: '#d97706', leftSec: '#fde047', leftDeep: '#120801',
        rightPrim: '#7e22ce', rightSec: '#d8b4fe', rightDeep: '#110320'
      };
    }
    if (preset === 'emerald_amber') {
      return {
        leftPrim: '#059669', leftSec: '#6ee7b7', leftDeep: '#02140e',
        rightPrim: '#c2410c', rightSec: '#fdba74', rightDeep: '#1c0702'
      };
    }
    if (preset === 'cyber_neon') {
      return {
        leftPrim: '#0284c7', leftSec: '#67e8f9', leftDeep: '#021019',
        rightPrim: '#db2777', rightSec: '#f9a8d4', rightDeep: '#1c0311'
      };
    }
    return {
      leftPrim: cfg.leftNebulaPrimaryColor || '#0055d4',
      leftSec: cfg.leftNebulaSecondaryColor || '#00a8ff',
      leftDeep: cfg.leftNebulaDeepColor || '#020818',
      rightPrim: cfg.rightNebulaPrimaryColor || '#9f1239',
      rightSec: cfg.rightNebulaSecondaryColor || '#e11d48',
      rightDeep: cfg.rightNebulaDeepColor || '#19020a'
    };
  }

  function ensureNebulaTextures(cfg) {
    const pal = resolveNebulaColors(cfg);
    const cloudDensity = clamp(Number(cfg.nebulaCloudDensity ?? 0.96), 0.15, 1.6);
    const riftMode = cfg.riftPathMode || 'vertical_authentic';
    const riftShift = Math.round(Number(cfg.riftOffsetX || 0));
    const customHash = Array.isArray(cfg.customRiftPoints) ? cfg.customRiftPoints.length : 0;
    const key = `${pal.leftPrim}_${pal.leftSec}_${pal.leftDeep}_${pal.rightPrim}_${pal.rightSec}_${pal.rightDeep}_${cloudDensity.toFixed(2)}_${riftMode}_${riftShift}_${customHash}`;

    if (_nebulaCacheCanvas && _nebulaCloudMaskCanvas && _nebulaBrightFilamentCanvas && _nebulaCacheKey === key) {
      return;
    }
    _nebulaCacheKey = key;

    const nw = 520;
    const nh = 292;
    if (!_nebulaCacheCanvas) {
      _nebulaCacheCanvas = document.createElement('canvas');
      _nebulaCacheCanvas.width = nw;
      _nebulaCacheCanvas.height = nh;
    }
    if (!_nebulaCloudMaskCanvas) {
      _nebulaCloudMaskCanvas = document.createElement('canvas');
      _nebulaCloudMaskCanvas.width = nw;
      _nebulaCloudMaskCanvas.height = nh;
    }
    if (!_nebulaBrightFilamentCanvas) {
      _nebulaBrightFilamentCanvas = document.createElement('canvas');
      _nebulaBrightFilamentCanvas.width = nw;
      _nebulaBrightFilamentCanvas.height = nh;
    }

    const nctx = _nebulaCacheCanvas.getContext('2d');
    const mctx = _nebulaCloudMaskCanvas.getContext('2d');
    const fctx = _nebulaBrightFilamentCanvas.getContext('2d');
    const imgData = nctx.createImageData(nw, nh);
    const maskData = mctx.createImageData(nw, nh);
    const filData = fctx.createImageData(nw, nh);
    const d = imgData.data;
    const md = maskData.data;
    const fd = filData.data;

    const lPrim = hexToRgb(pal.leftPrim);
    const lSec = hexToRgb(pal.leftSec);
    const lDeep = hexToRgb(pal.leftDeep);
    const rPrim = hexToRgb(pal.rightPrim);
    const rSec = hexToRgb(pal.rightSec);
    const rDeep = hexToRgb(pal.rightDeep);

    for (let y = 0; y < nh; y++) {
      const yn = y / nh;
      const riftX = getRiftXAtNormalizedY(yn, cfg, 0);

      for (let x = 0; x < nw; x++) {
        const xn = x / nw;
        const idx = (y * nw + x) * 4;

        // Domain-warped multi-octave fBm for deep cosmic cloud mottling
        const qx = fbm2D(xn * 4.5 + 1.3, yn * 4.5 + 2.1, 4);
        const qy = fbm2D(xn * 4.5 + 5.7, yn * 4.5 + 8.3, 4);
        const cloud = fbm2D(xn * 6.0 + qx * 2.1, yn * 6.0 + qy * 2.1, 5);
        const fineWisps = fbm2D(xn * 14.5 - qy * 1.6, yn * 14.5 + qx * 1.6, 4);
        const dustLane = fbm2D(xn * 4.2 + 11.2, yn * 4.2 + 4.7, 4);

        let nebVal = clamp((cloud * 0.74 + fineWisps * 0.40 - Math.pow(dustLane, 1.65) * 0.42) * cloudDensity * 1.26, 0, 1);

        // Deep cinema vignette at corners while keeping mid-hemisphere rich (matches image_be30fa77.png)
        const dxCenter = xn - riftX;
        const dyCenter = yn - 0.50;
        const distFromRift = Math.abs(dxCenter);
        const cornerDist = Math.hypot(xn - 0.5, (yn - 0.5) * 1.18);
        const cornerVig = clamp(1.0 - Math.pow(cornerDist * 1.22, 2.35), 0.08, 1.0);

        // Tighter rift proximity so we don't wash out the center with pastel pink/blue
        const riftProximity = Math.exp(-distFromRift * 14.0) * 0.36;
        const lobeProximity = Math.exp(-Math.pow((distFromRift - 0.23) * 3.6, 2) - Math.pow(dyCenter * 1.85, 2)) * 0.46;
        const totalEnergy = clamp((nebVal * 0.84 + lobeProximity + riftProximity) * cornerVig, 0, 1);

        const sideBlend = smoothstep(riftX - 0.008, riftX + 0.008, xn);

        const ePow = Math.pow(totalEnergy, 1.22);
        const hiPow = Math.pow(clamp((totalEnergy - 0.44) / 0.56, 0, 1), 1.85);
        const lr = lerp(lerp(lDeep.r, lPrim.r, ePow), lSec.r, hiPow * 0.82) + riftProximity * 45;
        const lg = lerp(lerp(lDeep.g, lPrim.g, ePow), lSec.g, hiPow * 0.90) + riftProximity * 135;
        const lb = lerp(lerp(lDeep.b, lPrim.b, ePow), lSec.b, hiPow * 0.96) + riftProximity * 205;

        const rr = lerp(lerp(rDeep.r, rPrim.r, ePow), rSec.r, hiPow * 0.92) + riftProximity * 175;
        const rg = lerp(lerp(rDeep.g, rPrim.g, ePow), rSec.g, hiPow * 0.65) + riftProximity * 55;
        const rb = lerp(lerp(rDeep.b, rPrim.b, ePow), rSec.b, hiPow * 0.82) + riftProximity * 105;

        d[idx] = clamp(Math.round(lerp(lr, rr, sideBlend)), 0, 255);
        d[idx + 1] = clamp(Math.round(lerp(lg, rg, sideBlend)), 0, 255);
        d[idx + 2] = clamp(Math.round(lerp(lb, rb, sideBlend)), 0, 255);
        d[idx + 3] = 255;

        // High-contrast cloud mask for living logo bleed-through (carves organic dark cosmic pockets through logos)
        const pocketNoise = clamp((cloud * 0.58 + fineWisps * 0.62 - Math.pow(dustLane, 1.35) * 0.72) * 1.55, 0.0, 1.0);
        const pocketContrast = smoothstep(0.18, 0.84, pocketNoise);
        md[idx] = 0;
        md[idx + 1] = 0;
        md[idx + 2] = 0;
        md[idx + 3] = clamp(Math.round((1.0 - pocketContrast) * 248), 0, 248);

        // Bright nebula filament overlay for additive cloud shimmer inside the logos
        const filStrength = Math.pow(clamp(fineWisps * 1.25 + cloud * 0.35 - 0.55, 0, 1), 1.6);
        fd[idx] = sideBlend < 0.5 ? 186 : 254;
        fd[idx + 1] = sideBlend < 0.5 ? 230 : 205;
        fd[idx + 2] = sideBlend < 0.5 ? 253 : 211;
        fd[idx + 3] = clamp(Math.round(filStrength * 220), 0, 220);
      }
    }

    nctx.putImageData(imgData, 0, 0);
    mctx.putImageData(maskData, 0, 0);
    fctx.putImageData(filData, 0, 0);
  }

  /**
   * Pre-builds 3 phase-shifted harmonic micro-stardust layers (up to 2,500 pinpoint cosmic grains)
   * so that all background stars actively twinkle and sparkle at user-controlled speed & intensity!
   */
  function ensureMicroStardustLayers(w, h, cfg) {
    const count = clamp(Math.round(Number(cfg.microStardustCount ?? 1500)), 0, 2500);
    const key = `${w}x${h}_${count}`;
    if (_stardustCacheCanvases && _stardustCacheKey === key) {
      return _stardustCacheCanvases;
    }
    _stardustCacheKey = key;
    _stardustCacheCanvases = [0, 1, 2].map(() => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    });

    const ctxs = _stardustCacheCanvases.map((c) => {
      const sctx = c.getContext('2d');
      sctx.clearRect(0, 0, w, h);
      return sctx;
    });

    for (let i = 0; i < count; i++) {
      const sctx = ctxs[i % 3];
      const rx = hash1D(i * 17.31 + 11.7) * w;
      const ry = hash1D(i * 31.19 + 5.3) * h;
      const bSeed = hash1D(i * 47.83 + 2.9);
      const r = bSeed > 0.92 ? 1.05 : bSeed > 0.65 ? 0.72 : 0.46;
      const alpha = 0.25 + bSeed * 0.74;

      if (bSeed > 0.82) {
        sctx.fillStyle = rx < w * 0.5 ? `rgba(186, 230, 253, ${alpha.toFixed(2)})` : `rgba(254, 205, 211, ${alpha.toFixed(2)})`;
      } else {
        sctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
      }
      sctx.beginPath();
      sctx.arc(rx, ry, r, 0, Math.PI * 2);
      sctx.fill();

      // Subtle 4-ray micro-glint on the brightest 8% of stardust grains
      if (bSeed > 0.92) {
        sctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.55).toFixed(2)})`;
        sctx.fillRect(rx - r * 2.4, ry - 0.35, r * 4.8, 0.7);
        sctx.fillRect(rx - 0.35, ry - r * 2.4, 0.7, r * 4.8);
      }
    }
    return _stardustCacheCanvases;
  }

  // ==========================================================================
  // 7. HIGH-RES WORLD NIGHT-LIGHTS, 3D TOPOGRAPHIC BUMP MAP & SATELLITE GENERATOR
  //    - Sanitizes 180-degree dateline wrap jumps in ACCURATE_WORLD_MAP.land so
  //      Chukotka/Arctic wrap segments NEVER draw curved dark lines across Europe/Russia!
  //    - Zero artificial 4px interior dot grid: unlit continent interiors are
  //      velvety smooth matte dark slate-navy (matching Image 4 & Image 5 1:1).
  //    - Precomputes a 3D Ridged Mountain Topographic Bump Map in _worldReliefPixels
  //      (R = landMask, G = directional sun slope, B = mountain ridge elevation)
  //      so the sunlit terminator carves realistic 3D mountain ridges & shadows!
  // ==========================================================================
  let _worldNightCanvas = null;
  let _worldNightPixels = null;
  let _worldReliefPixels = null;
  let _worldMapW = 1600;
  let _worldMapH = 800;
  let _globeRenderCanvas = null;
  let _europeMacroCanvas = null;
  let _worldDaySatelliteCanvas = null;

  /**
   * Sanitizes ACCURATE_WORLD_MAP.land by:
   * 1) Dropping all 44 degenerate 1D horizontal crop-line subpaths at y = 45.4
   *    (Subpaths 9, 10, 12, 13, 20, 28, 29, 60, 61, 65, 73, 74, 75) so zero
   *    horizontal blue lines ever cross the Arctic Ocean!
   * 2) Reconstructing the natural rounded North Greenland (Peary Land) and
   *    Canadian/Russian Arctic coastlines where the raw SVG was flat-clipped at y = 45.4.
   * 3) Stripping 180° dateline wrap jumps on Chukotka (Eurasia Subpath 2).
   */
  function buildCleanWorldLandPath2D(rawLandSvg) {
    if (!rawLandSvg || typeof Path2D === 'undefined') return null;
    const subpaths = String(rawLandSvg).split('Z').map((s) => s.trim()).filter(Boolean);
    const cleaned = [];
    for (let s = 0; s < subpaths.length; s++) {
      const nums = subpaths[s].match(/-?\d+(\.\d+)?/g);
      if (!nums || nums.length < 6) continue;
      let pts = [];
      for (let i = 0; i < nums.length; i += 2) {
        pts.push([ parseFloat(nums[i]), parseFloat(nums[i + 1]) ]);
      }

      let minX = 999, maxX = -999, minY = 999, maxY = -999;
      for (let i = 0; i < pts.length; i++) {
        const px = pts[i][0], py = pts[i][1];
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }

      // 1) Drop degenerate flat horizontal subpaths at the y=45.4 northern crop box or Antarctica
      if (maxY - minY < 0.85 || maxY <= 45.6 || minY > 170) continue;

      // 2) Check for 180-degree dateline wrap jumps
      let hasDatelineWrap = false;
      for (let i = 1; i < pts.length; i++) {
        if (Math.abs(pts[i][0] - pts[i - 1][0]) > 100) {
          hasDatelineWrap = true;
          break;
        }
      }
      if (!hasDatelineWrap && Math.abs(pts[0][0] - pts[pts.length - 1][0]) > 100) {
        hasDatelineWrap = true;
      }
      if (hasDatelineWrap) {
        if (pts.length < 50) continue;
        // For Eurasia (Subpath 2), strip the wrapped Chukotka vertices on the left edge (x < 100)
        pts = pts.filter((p) => p[0] > 100);
        if (pts.length < 3) continue;
      }

      // 3) Reconstruct natural rounded northern Greenland cap (Subpath 76: X=131..189, Y=45.4..60.6)
      //    so Greenland never has a flat horizontal cut-off at y=45.4!
      if (minX > 128 && maxX < 192 && minY <= 45.6 && maxY > 56 && maxY < 64) {
        const southCoast = pts.filter((p) => p[1] > 45.65);
        if (southCoast.length >= 10) {
          const northCap = [
            [145.6, 44.6],
            [148.8, 42.4],
            [153.5, 40.3],
            [159.2, 38.8],
            [165.4, 38.2],
            [171.5, 38.9],
            [176.6, 40.4],
            [180.0, 42.6],
            [181.6, 44.8]
          ];
          pts = southCoast.concat(northCap);
        }
      } else if (minY <= 45.55) {
        // Lift any other northern-clipped vertices smoothly above the y=45.4 crop line
        const spanX = Math.max(1.0, maxX - minX);
        pts = pts.map((p) => {
          if (p[1] <= 45.55) {
            const t = clamp((p[0] - minX) / spanX, 0, 1);
            const arch = Math.sin(t * Math.PI) * 3.6 + 0.8 * Math.sin(p[0] * 0.45);
            return [ p[0], 45.2 - Math.max(0.2, arch) ];
          }
          return p;
        });
      }

      let d = 'M ' + pts[0][0].toFixed(2) + ' ' + pts[0][1].toFixed(2);
      for (let i = 1; i < pts.length; i++) {
        d += ' L ' + pts[i][0].toFixed(2) + ' ' + pts[i][1].toFixed(2);
      }
      d += ' Z';
      cleaned.push(d);
    }
    return new Path2D(cleaned.join(' '));
  }

  // Geographically accurate urban & coastal light hubs in (x: 0..400, y: 0..200)
  // Rendered as ultra-fine silver-ivory / warm-white satellite pinpoints (zero yellow pom-pom blobs!)
  const CITY_LIGHT_CLUSTERS = [
    // North America (Northeast Megalopolis Boston-NYC-DC, Great Lakes/Chicago/Toronto, Southeast/Atlanta, Florida coast, Texas, West Coast)
    { x: 121.5, y: 72.0, rx: 5.4, ry: 3.4, count: 380, weight: 1.35 },
    { x: 113.0, y: 73.5, rx: 5.8, ry: 3.6, count: 310, weight: 1.20 },
    { x: 113.5, y: 81.5, rx: 5.0, ry: 4.0, count: 270, weight: 1.15 },
    { x: 116.2, y: 88.0, rx: 2.0, ry: 3.8, count: 190, weight: 1.30 },
    { x: 101.5, y: 84.0, rx: 4.8, ry: 3.8, count: 220, weight: 1.10 },
    { x: 96.0,  y: 77.0, rx: 5.5, ry: 3.8, count: 175, weight: 0.90 },
    { x: 82.0,  y: 78.5, rx: 2.4, ry: 5.5, count: 210, weight: 1.20 },
    { x: 100.0, y: 94.0, rx: 4.0, ry: 3.4, count: 165, weight: 1.05 },
    // South America (São Paulo/Rio coast, Buenos Aires/River Plate, Bogota/Lima)
    { x: 145.5, y: 142.0, rx: 3.8, ry: 6.4, count: 210, weight: 1.05 },
    { x: 133.5, y: 160.0, rx: 3.6, ry: 3.6, count: 135, weight: 0.95 },
    { x: 115.0, y: 112.0, rx: 3.2, ry: 4.2, count: 110, weight: 0.90 },
    // Western, Central & Eastern Europe (Replaced 1:1 by photographic NASA lights from image_cc4e4bea.png once loaded!)
    { x: 196.5, y: 66.8, rx: 2.6, ry: 3.4, count: 310, weight: 1.45, isEuRegion: true }, // UK
    { x: 200.8, y: 71.8, rx: 3.4, ry: 3.0, count: 360, weight: 1.50, isEuRegion: true }, // Paris, Brussels, Randstad
    { x: 207.2, y: 69.8, rx: 4.2, ry: 3.2, count: 420, weight: 1.55, isEuRegion: true }, // Rhine-Ruhr, Frankfurt, Bavaria
    { x: 210.5, y: 75.5, rx: 3.0, ry: 1.9, count: 290, weight: 1.45, isEuRegion: true }, // Po Valley (Turin-Milan-Venice)
    { x: 213.2, y: 79.8, rx: 2.2, ry: 3.4, count: 240, weight: 1.35, isEuRegion: true }, // Rome, Naples & Italy coast
    { x: 196.2, y: 79.8, rx: 2.8, ry: 2.4, count: 210, weight: 1.30, isEuRegion: true }, // Madrid & central Iberia
    { x: 191.8, y: 80.5, rx: 1.2, ry: 2.8, count: 155, weight: 1.25, isEuRegion: true }, // Lisbon & Porto coast
    { x: 200.5, y: 79.5, rx: 2.6, ry: 2.4, count: 195, weight: 1.30, isEuRegion: true }, // Barcelona & Valencia coast
    { x: 216.5, y: 71.2, rx: 5.2, ry: 3.4, count: 310, weight: 1.20, isEuRegion: true }, // Vienna, Prague, Warsaw, Budapest
    { x: 211.0, y: 59.5, rx: 3.8, ry: 2.6, count: 145, weight: 0.95, isEuRegion: true }, // Oslo, Stockholm, Copenhagen
    { x: 222.8, y: 80.5, rx: 3.8, ry: 3.0, count: 210, weight: 1.15, isEuRegion: true }, // Athens, Aegean & Istanbul
    { x: 227.0, y: 69.5, rx: 6.2, ry: 4.5, count: 260, weight: 1.00, isEuRegion: true }, // Kiev, Minsk & Eastern Europe web
    { x: 235.5, y: 63.5, rx: 6.5, ry: 4.8, count: 290, weight: 1.10, isEuRegion: true }, // Moscow & Western Russia web
    { x: 247.5, y: 65.5, rx: 7.5, ry: 4.5, count: 210, weight: 0.90 }, // Volga / Kazan / Samara / Urals corridor
    // North Africa Coastal Necklace & Nile Corridor
    { x: 191.5, y: 86.2, rx: 2.4, ry: 1.1, count: 125, weight: 1.15, isEuRegion: true }, // Casablanca & Tangier
    { x: 201.5, y: 85.0, rx: 4.2, ry: 0.9, count: 165, weight: 1.20, isEuRegion: true }, // Algiers & Oran coast
    { x: 209.5, y: 85.8, rx: 2.0, ry: 1.2, count: 115, weight: 1.15, isEuRegion: true }, // Tunis
    { x: 230.8, y: 89.2, rx: 2.0, ry: 1.8, count: 220, weight: 1.45, isEuRegion: true }, // Nile Delta (Cairo & Alexandria)
    { x: 231.4, y: 92.8, rx: 0.8, ry: 3.4, count: 155, weight: 1.30, isEuRegion: true }, // Nile River Valley
    // Middle East (Anatolia, Levant coast, Mesopotamia, Persian Gulf)
    { x: 231.5, y: 80.5, rx: 5.5, ry: 2.8, count: 210, weight: 1.05, isEuRegion: true }, // Ankara & Anatolia web
    { x: 234.8, y: 86.5, rx: 1.6, ry: 2.8, count: 175, weight: 1.25, isEuRegion: true }, // Levant coast
    { x: 243.5, y: 85.5, rx: 4.2, ry: 3.5, count: 165, weight: 1.00 }, // Tigris-Euphrates / Baghdad / Tehran
    { x: 253.5, y: 93.8, rx: 3.8, ry: 2.8, count: 185, weight: 1.15 }, // Persian Gulf
    // South & East Asia
    { x: 282.0, y: 94.0, rx: 6.2, ry: 6.2, count: 340, weight: 1.25 },
    { x: 318.0, y: 84.0, rx: 7.2, ry: 6.8, count: 390, weight: 1.35 },
    { x: 340.0, y: 80.0, rx: 3.0, ry: 4.4, count: 250, weight: 1.40 }
  ];

  // Organic curved settlement & river/coastal corridors (rendered purely as domain-warped micro-pinpoints, zero straight line strokes!)
  const CITY_LIGHT_FILAMENTS = [
    [[193.5, 83.4], [196.2, 82.8], [199.0, 80.8], [201.2, 78.2], [204.2, 76.5], [207.8, 76.2], [211.2, 78.8], [213.6, 80.5]],
    [[189.2, 87.2], [192.8, 84.5], [196.8, 85.2], [201.2, 84.6], [205.8, 84.8], [209.6, 85.4]],
    [[197.2, 68.5], [202.2, 69.5], [205.5, 69.2], [207.5, 70.6], [210.2, 71.8], [214.2, 72.4], [219.5, 71.2], [227.5, 68.5], [235.5, 63.8]],
    [[206.8, 75.4], [209.2, 75.2], [212.2, 75.3], [214.0, 75.5]],
    [[229.8, 88.2], [231.1, 89.2], [231.0, 91.2], [231.8, 93.2], [232.1, 95.4]],
    // North American Atlantic & Great Lakes corridors
    [[124.5, 69.8], [121.8, 72.2], [119.2, 74.8], [116.5, 78.5], [115.8, 84.2], [116.4, 89.2]],
    [[119.5, 71.5], [114.5, 72.8], [110.2, 74.2], [105.5, 78.5], [101.5, 84.5]]
  ];

  /**
   * Transfers the 13,750 authentic high-pass NASA city-light pinpoints from
   * `image_cc4e4bea.png` (REFERENCE_PLATES.act3EuropeLights) directly onto
   * `_worldNightPixels` and `_europeMacroCanvas`, replacing procedural dots in
   * Europe, Western Russia (Moscow), Levant, and the Nile with 1:1 photographic
   * satellite city lights while stripping 100% of background ocean/land haze!
   */
  function applyAuthenticEuropeLightsToWorldMap(euImg) {
    if (!euImg || !_worldNightCanvas || !_worldNightPixels || !_worldReliefPixels) return;
    const ew = euImg.naturalWidth || euImg.width || 929;
    const eh = euImg.naturalHeight || euImg.height || 518;
    if (ew < 100 || eh < 100) return;

    const tmp = document.createElement('canvas');
    tmp.width = ew;
    tmp.height = eh;
    const tctx = tmp.getContext('2d');
    tctx.drawImage(euImg, 0, 0, ew, eh);
    const euData = tctx.getImageData(0, 0, ew, eh).data;

    const mapW = _worldMapW;
    const mapH = _worldMapH;
    const scaleX = ew / 929.0;
    const scaleY = eh / 518.0;

    // Coverage window in 400x200 world map space: mapX = 184..254, mapY = 47..96
    const xStart = Math.max(1, Math.floor((184 / 400) * mapW));
    const xEnd = Math.min(mapW - 2, Math.ceil((254 / 400) * mapW));
    const yStart = Math.max(1, Math.floor((47 / 200) * mapH));
    const yEnd = Math.min(mapH - 2, Math.ceil((96 / 200) * mapH));

    for (let y = yStart; y <= yEnd; y++) {
      const mapY = (y / mapH) * 200.0;
      const dy = mapY - 72.0;
      const fadeY = smoothstep(47.0, 51.5, mapY) * (1.0 - smoothstep(91.5, 96.0, mapY));
      if (fadeY <= 0.001) continue;

      for (let x = xStart; x <= xEnd; x++) {
        const idx = (y * mapW + x) * 4;
        const landMask = _worldReliefPixels[idx] / 255.0;
        if (landMask < 0.15) continue;

        const mapX = (x / mapW) * 400.0;
        const fadeX = smoothstep(184.0, 189.5, mapX) * (1.0 - smoothstep(246.0, 254.0, mapX));
        const regionBlend = fadeX * fadeY;
        if (regionBlend <= 0.001) continue;

        const dx = mapX - 210.0;
        // Least-squares calibrated bilinear mapping from (mapX, mapY) -> image_cc4e4bea.png (fx, fy)
        const fx929 = 497.74 + 8.3035 * dx + 0.5227 * dy + 0.1746 * dx * dy;
        const fy518 = 275.02 - 0.2848 * dx + 11.8277 * dy + 0.0361 * dx * dy;

        // Exclude top-left sunlit limb of image_cc4e4bea.png
        if (fx929 < 265 || fx929 > 918 || fy518 < 10 || fy518 > 508 || (fx929 + fy518 * 0.92 < 365)) {
          continue;
        }

        const fx = clamp(fx929 * scaleX, 7, ew - 8);
        const fy = clamp(fy518 * scaleY, 7, eh - 8);
        const ix = Math.floor(fx);
        const iy = Math.floor(fy);
        const wx = fx - ix;
        const wy = fy - iy;

        const i00 = (iy * ew + ix) * 4;
        const i10 = (iy * ew + ix + 1) * 4;
        const i01 = ((iy + 1) * ew + ix) * 4;
        const i11 = ((iy + 1) * ew + ix + 1) * 4;

        const w00 = (1 - wx) * (1 - wy);
        const w10 = wx * (1 - wy);
        const w01 = (1 - wx) * wy;
        const w11 = wx * wy;

        const r = euData[i00] * w00 + euData[i10] * w10 + euData[i01] * w01 + euData[i11] * w11;
        const g = euData[i00 + 1] * w00 + euData[i10 + 1] * w10 + euData[i01 + 1] * w01 + euData[i11 + 1] * w11;
        const b = euData[i00 + 2] * w00 + euData[i10 + 2] * w10 + euData[i01 + 2] * w01 + euData[i11 + 2] * w11;

        // 4-point local continent background ring (radius 6px) to strip 100% of dark-blue land/ocean tint
        const step = 6;
        const nL = (iy * ew + (ix - step)) * 4;
        const nR = (iy * ew + (ix + step)) * 4;
        const nU = ((iy - step) * ew + ix) * 4;
        const nD = ((iy + step) * ew + ix) * 4;

        const rBg = Math.min(
          (euData[nL] + euData[nR] + euData[nU] + euData[nD]) * 0.25,
          Math.max(euData[nL], euData[nR])
        );
        const gBg = Math.min(
          (euData[nL + 1] + euData[nR + 1] + euData[nU + 1] + euData[nD + 1]) * 0.25,
          Math.max(euData[nL + 1], euData[nR + 1])
        );
        const bBg = (euData[nL + 2] + euData[nR + 2] + euData[nU + 2] + euData[nD + 2]) * 0.25;

        const dr = Math.max(0, r - rBg - 3.5);
        const dg = Math.max(0, g - gBg - 3.5);
        const db = Math.max(0, b - bBg - 3.5);
        const signal = Math.max(dr, dg * 0.96);

        // Smooth matte dark slate-navy continent base (matches image_b1b8463c.png & image_e6189a1c.png)
        const baseR = 14;
        const baseG = 24;
        const baseB = 41;

        let newR = baseR;
        let newG = baseG;
        let newB = baseB;

        if (signal > 2.5 && r >= b - 25) {
          // Authentic silver-ivory / warm-champagne pinpoint city light
          const gain = 1.52 * landMask;
          newR = clamp(baseR + dr * gain + signal * 0.28, 0, 255);
          newG = clamp(baseG + dg * gain + signal * 0.24, 0, 255);
          newB = clamp(baseB + db * gain * 0.88 + signal * 0.16, 0, 255);
        }

        _worldNightPixels[idx]     = Math.round(lerp(_worldNightPixels[idx], newR, regionBlend));
        _worldNightPixels[idx + 1] = Math.round(lerp(_worldNightPixels[idx + 1], newG, regionBlend));
        _worldNightPixels[idx + 2] = Math.round(lerp(_worldNightPixels[idx + 2], newB, regionBlend));
      }
    }

    const nctx = _worldNightCanvas.getContext('2d');
    const outImgData = nctx.createImageData(mapW, mapH);
    outImgData.data.set(_worldNightPixels);
    nctx.putImageData(outImgData, 0, 0);
  }

  function ensureWorldMapCanvases() {
    const euPlateRec = getLoadedImage(REFERENCE_PLATES.act3EuropeLights);
    if (_worldNightCanvas && _worldNightPixels && _worldReliefPixels && _europeMacroCanvas && _worldDaySatelliteCanvas) {
      if (euPlateRec && euPlateRec.loaded && !_worldNightEuOverlayApplied) {
        _worldNightEuOverlayApplied = true;
        applyAuthenticEuropeLightsToWorldMap(euPlateRec.img);
      }
      return;
    }

    const mapW = _worldMapW;
    const mapH = _worldMapH;
    const scaleX = mapW / 400;
    const scaleY = mapH / 200;

    _worldNightCanvas = document.createElement('canvas');
    _worldNightCanvas.width = mapW;
    _worldNightCanvas.height = mapH;
    const nctx = _worldNightCanvas.getContext('2d');

    // Deep midnight ocean base (matches dark Atlantic ocean in image_b1b8463c.png & image_e6189a1c.png)
    nctx.fillStyle = '#030711';
    nctx.fillRect(0, 0, mapW, mapH);

    const hasAccurateLand = typeof window !== 'undefined' && window.ACCURATE_WORLD_MAP && window.ACCURATE_WORLD_MAP.land;
    const landPath = hasAccurateLand ? buildCleanWorldLandPath2D(window.ACCURATE_WORLD_MAP.land) : null;

    // 1. Build High-Resolution Land Mask + Ultra-Fine Satellite Micro-Relief (Zero low-frequency plastic waves!)
    const reliefCanvas = document.createElement('canvas');
    reliefCanvas.width = mapW;
    reliefCanvas.height = mapH;
    const rctx = reliefCanvas.getContext('2d');
    rctx.fillStyle = '#000000';
    rctx.fillRect(0, 0, mapW, mapH);
    if (landPath) {
      rctx.save();
      rctx.scale(scaleX, scaleY);
      rctx.fillStyle = '#ffffff';
      rctx.fill(landPath, 'nonzero');
      rctx.restore();
    }
    const relImgData = rctx.getImageData(0, 0, mapW, mapH);
    const rData = relImgData.data;

    // Precompute high-frequency satellite micro-relief on land pixels (used ONLY on the far-left sunlit limb)
    // Channel R = landMask (0..255), Channel G = fine directional sun slope (0..255, 128=flat), Channel B = fine micro-height
    for (let y = 1; y < mapH - 1; y++) {
      const vn = y / mapH;
      for (let x = 1; x < mapW - 1; x++) {
        const idx = (y * mapW + x) * 4;
        if (rData[idx] < 16) {
          rData[idx + 1] = 128;
          rData[idx + 2] = 0;
          continue;
        }
        const un = x / mapW;
        // High-frequency rocky satellite micro-relief (no low-frequency 52x26 plastic/tin-foil waves!)
        const f1 = 1.0 - Math.abs(2.0 * valueNoise2D(un * 240.0 + 5.1, vn * 120.0 + 2.7) - 1.0);
        const f2 = valueNoise2D(un * 480.0 + 13.8, vn * 240.0 + 9.1);
        const hCenter = f1 * f1 * 0.65 + f2 * 0.35;

        const unSun = (x - 1.2) / mapW;
        const vnSun = (y - 1.0) / mapH;
        const s1 = 1.0 - Math.abs(2.0 * valueNoise2D(unSun * 240.0 + 5.1, vnSun * 120.0 + 2.7) - 1.0);
        const s2 = valueNoise2D(unSun * 480.0 + 13.8, vnSun * 240.0 + 9.1);
        const hSunward = s1 * s1 * 0.65 + s2 * 0.35;

        const slope = clamp((hCenter - hSunward) * 3.2, -1.0, 1.0);
        rData[idx + 1] = clamp(Math.round(128 + slope * 110), 0, 255);
        rData[idx + 2] = clamp(Math.round(hCenter * 255), 0, 255);
      }
    }
    _worldReliefPixels = rData;

    // 2. Render Velvety-Smooth Matte Dark Slate-Navy Continents (Matches Greenland & North Africa in image_e6189a1c.png!)
    if (landPath) {
      nctx.save();
      nctx.scale(scaleX, scaleY);
      nctx.fillStyle = '#0e182b';
      nctx.fill(landPath, 'nonzero');
      nctx.restore();

      nctx.save();
      nctx.scale(scaleX, scaleY);
      nctx.clip(landPath, 'nonzero');
      nctx.scale(1 / scaleX, 1 / scaleY);
    } else {
      nctx.save();
    }

    // Subtle continuous slate-blue gradient across northern latitudes (100% smooth, zero dots!)
    const northSlateGrad = nctx.createLinearGradient(0, 18 * scaleY, 0, 110 * scaleY);
    northSlateGrad.addColorStop(0, 'rgba(26, 44, 74, 0.38)');
    northSlateGrad.addColorStop(0.55, 'rgba(18, 31, 54, 0.18)');
    northSlateGrad.addColorStop(1, 'rgba(12, 21, 38, 0.04)');
    nctx.fillStyle = northSlateGrad;
    nctx.fillRect(0, 0, mapW, mapH);

    // 3. Render Organic Domain-Warped Micro-Pinpoint Settlement Corridors (Zero straight lines, zero yellow strokes!)
    CITY_LIGHT_FILAMENTS.forEach((chain, ci) => {
      if (chain.length < 2) return;
      nctx.save();
      for (let i = 0; i < chain.length - 1; i++) {
        const ax = chain[i][0] * scaleX, ay = chain[i][1] * scaleY;
        const bx = chain[i + 1][0] * scaleX, by = chain[i + 1][1] * scaleY;
        const dist = Math.hypot(bx - ax, by - ay);
        const steps = Math.max(6, Math.round(dist * 1.65));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const baseX = lerp(ax, bx, t);
          const baseY = lerp(ay, by, t);
          // Organic meandering curve perturbation so corridors never look like straight ruler lines
          const warpX = (valueNoise2D(baseX * 0.09 + ci * 3.7, baseY * 0.09) - 0.5) * 5.2;
          const warpY = (valueNoise2D(baseX * 0.09 + 11.3, baseY * 0.09 + ci * 2.1) - 0.5) * 5.2;
          const jx = (hash1D((ci * 311 + i * 71 + s) * 3.1) - 0.5) * 2.4;
          const jy = (hash1D((ci * 311 + i * 71 + s) * 5.7) - 0.5) * 2.4;
          const px = baseX + warpX + jx;
          const py = baseY + warpY + jy;
          const seed = hash1D((ci * 500 + i * 97 + s) * 7.3);
          const isHub = seed > 0.84;
          nctx.fillStyle = isHub ? '#ffffff' : (seed > 0.45 ? '#f1f5f9' : '#fef9c3');
          nctx.globalAlpha = isHub ? 0.88 : (0.28 + seed * 0.42);
          nctx.beginPath();
          nctx.arc(px, py, isHub ? 0.52 : 0.30, 0, Math.PI * 2);
          nctx.fill();
        }
      }
      nctx.restore();
    });

    // 4. Render Crisp Silver-Ivory & Champagne Pinpoint City Webs (Zero yellow pom-pom blobs or straight lines!)
    CITY_LIGHT_CLUSTERS.forEach((cl, ci) => {
      const cx = cl.x * scaleX;
      const cy = cl.y * scaleY;
      const rx = cl.rx * scaleX;
      const ry = cl.ry * scaleY;

      // Subtle cool-ivory metropolitan core sheen (kept tight and low-alpha so it never forms a yellow blob)
      const glowR = Math.max(1.5, Math.min(rx, ry) * 0.42);
      const basinGrad = nctx.createRadialGradient(cx, cy, 0.2, cx, cy, glowR);
      basinGrad.addColorStop(0, `rgba(248, 250, 252, ${(0.11 * cl.weight).toFixed(3)})`);
      basinGrad.addColorStop(0.55, `rgba(226, 232, 240, ${(0.04 * cl.weight).toFixed(3)})`);
      basinGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nctx.fillStyle = basinGrad;
      nctx.beginPath();
      nctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      nctx.fill();

      for (let p = 0; p < cl.count; p++) {
        const seed = ci * 1200 + p;
        const u1 = hash1D(seed * 1.3);
        const u2 = hash1D(seed * 2.7);
        // Power-law dendrite radial distribution + domain warp so cities form lacy webs, not round balls
        const branchArm = Math.floor(hash1D(seed * 4.1) * 5);
        const branchAngle = (branchArm / 5) * Math.PI * 2 + (u2 - 0.5) * 1.15 + ci * 0.7;
        const distNorm = Math.pow(u1, 1.55) * 1.35;
        let px = cx + Math.cos(branchAngle) * rx * distNorm;
        let py = cy + Math.sin(branchAngle) * ry * distNorm;
        px += (valueNoise2D(px * 0.07, py * 0.07) - 0.5) * rx * 0.55;
        py += (valueNoise2D(px * 0.07 + 9.4, py * 0.07 + 4.2) - 0.5) * ry * 0.55;

        const isCoreHub = p % 22 === 0 && distNorm < 0.45;
        const isIvory = p % 3 !== 0;
        const rDot = isCoreHub ? (0.52 + hash1D(seed * 5.1) * 0.30) : (0.22 + hash1D(seed * 3.9) * 0.24);

        nctx.fillStyle = isCoreHub ? '#ffffff' : (isIvory ? '#f1f5f9' : '#fef9c3');
        nctx.globalAlpha = isCoreHub ? 0.94 : clamp((0.32 + hash1D(seed * 7.7) * 0.52) * (1.0 - distNorm * 0.42), 0.12, 0.85);
        nctx.beginPath();
        nctx.arc(px, py, Math.max(0.22, rDot), 0, Math.PI * 2);
        nctx.fill();
      }
    });
    nctx.restore();

    _worldNightPixels = nctx.getImageData(0, 0, mapW, mapH).data;

    // Immediately overlay authentic high-pass NASA Europe city lights if image_cc4e4bea.png is already loaded
    if (euPlateRec && euPlateRec.loaded) {
      _worldNightEuOverlayApplied = true;
      applyAuthenticEuropeLightsToWorldMap(euPlateRec.img);
    }

    // 5. Build Clean Europe Macro Night Canvas for Act 3 (Procedural Vector Fallback)
    _europeMacroCanvas = document.createElement('canvas');
    _europeMacroCanvas.width = 1280;
    _europeMacroCanvas.height = 720;
    const ectx = _europeMacroCanvas.getContext('2d');
    ectx.fillStyle = '#030711';
    ectx.fillRect(0, 0, 1280, 720);

    const euMinX = 176, euMaxX = 244;
    const euMinY = 50, euMaxY = 88;
    const euScaleX = 1280 / (euMaxX - euMinX);
    const euScaleY = 720 / (euMaxY - euMinY);

    if (landPath) {
      ectx.save();
      ectx.beginPath();
      ectx.rect(0, 4, 1280, 716);
      ectx.clip();

      ectx.scale(euScaleX, euScaleY);
      ectx.translate(-euMinX, -euMinY);

      ectx.fillStyle = '#0e182b';
      ectx.fill(landPath, 'nonzero');

      ectx.clip(landPath, 'nonzero');
      ectx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ectx.save();
    }

    const euClusters = CITY_LIGHT_CLUSTERS.filter((c) => c.x >= 175 && c.x <= 248 && c.y >= 46 && c.y <= 92);
    euClusters.forEach((cl, idx) => {
      const cx = (cl.x - euMinX) * euScaleX;
      const cy = (cl.y - euMinY) * euScaleY;
      const rx = cl.rx * euScaleX * 0.92;
      const ry = cl.ry * euScaleY * 0.92;

      const glowR = Math.max(5, Math.min(rx, ry) * 0.85);
      const bGrad = ectx.createRadialGradient(cx, cy, 1, cx, cy, glowR);
      bGrad.addColorStop(0, 'rgba(248, 250, 252, 0.14)');
      bGrad.addColorStop(0.5, 'rgba(203, 213, 225, 0.06)');
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ectx.fillStyle = bGrad;
      ectx.beginPath();
      ectx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ectx.fill();

      const denseCount = cl.count * 4;
      for (let p = 0; p < denseCount; p++) {
        const seed = 9000 + idx * 2000 + p;
        const u1 = hash1D(seed * 1.7);
        const u2 = hash1D(seed * 3.1);
        const branchArm = Math.floor(hash1D(seed * 4.9) * 5);
        const ang = (branchArm / 5) * Math.PI * 2 + (u2 - 0.5) * 1.2 + idx * 0.6;
        const mag = Math.pow(u1, 1.55) * 1.3;
        let px = cx + Math.cos(ang) * rx * mag;
        let py = cy + Math.sin(ang) * ry * mag;
        px += (valueNoise2D(px * 0.03, py * 0.03) - 0.5) * rx * 0.45;
        py += (valueNoise2D(px * 0.03 + 7.1, py * 0.03 + 3.3) - 0.5) * ry * 0.45;
        const isMetro = p % 28 === 0 && mag < 0.45;
        const rad = isMetro ? (1.1 + hash1D(seed * 4.3) * 0.9) : (0.35 + hash1D(seed * 8.1) * 0.55);

        ectx.fillStyle = isMetro ? '#ffffff' : (p % 3 === 0 ? '#fef9c3' : '#f1f5f9');
        ectx.globalAlpha = isMetro ? 0.92 : (0.28 + hash1D(seed * 5.9) * 0.55);
        ectx.beginPath();
        ectx.arc(px, py, Math.max(0.32, rad), 0, Math.PI * 2);
        ectx.fill();
      }
    });
    ectx.restore();

    // 3. Build Daytime Google Earth High-Altitude Satellite Terrain Canvas
    _worldDaySatelliteCanvas = document.createElement('canvas');
    _worldDaySatelliteCanvas.width = 1280;
    _worldDaySatelliteCanvas.height = 720;
    const sctx = _worldDaySatelliteCanvas.getContext('2d');

    const satBg = sctx.createRadialGradient(640, 360, 40, 640, 360, 780);
    satBg.addColorStop(0, '#647d98');
    satBg.addColorStop(0.55, '#536c88');
    satBg.addColorStop(1, '#3e5570');
    sctx.fillStyle = satBg;
    sctx.fillRect(0, 0, 1280, 720);

    const satImg = sctx.getImageData(0, 0, 1280, 720);
    const sd = satImg.data;
    for (let y = 0; y < 720; y += 2) {
      for (let x = 0; x < 1280; x += 2) {
        const n = fbm2D(x * 0.012, y * 0.012, 4);
        const fine = valueNoise2D(x * 0.08, y * 0.08);
        const delta = Math.round((n - 0.5) * 38 + (fine - 0.5) * 18);
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const p = ((y + dy) * 1280 + (x + dx)) * 4;
            sd[p] = clamp(sd[p] + delta, 0, 255);
            sd[p + 1] = clamp(sd[p + 1] + Math.round(delta * 0.95), 0, 255);
            sd[p + 2] = clamp(sd[p + 2] + Math.round(delta * 0.85), 0, 255);
          }
        }
      }
    }
    sctx.putImageData(satImg, 0, 0);

    // Subtle central municipality / town boundary outline (Herzogenaurach polygon in center of image_66ad139b.png)
    sctx.strokeStyle = 'rgba(226, 232, 240, 0.52)';
    sctx.lineWidth = 1.2;
    sctx.beginPath();
    sctx.moveTo(626, 342);
    sctx.lineTo(638, 336);
    sctx.lineTo(649, 344);
    sctx.lineTo(654, 356);
    sctx.lineTo(642, 366);
    sctx.lineTo(628, 362);
    sctx.closePath();
    sctx.stroke();
  }

  // ==========================================================================
  // 8. COSMIC DUAL-HEMISPHERE NEBULA, LIVING CLOUD-BLEED LOGOS WITH SUBSURFACE
  //    LIGHT PASS-THROUGH, 3-TIER TWINKLING STARFIELD & RAZOR-THIN LIGHT RIFT
  // ==========================================================================
  function renderCosmicSplitAndLogos(ctx, w, h, cameraZoom, timeSec, cfg, starWorldPos) {
    ensureNebulaTextures(cfg);
    const pal = resolveNebulaColors(cfg);
    const cloudBleed = clamp(Number(cfg.logoCloudBleedStrength ?? 0.78), 0.0, 1.0);
    const cloudSpd = clamp(Number(cfg.nebulaCloudSpeed ?? 1.15), 0.1, 3.0);
    const logoCloudSpd = clamp(Number(cfg.logoCloudMotionSpeed ?? 1.25), 0.1, 3.5);
    const lightPassThrough = clamp(Number(cfg.logoLightPassThrough ?? 1.35), 0.0, 2.5);
    const nebScale = clamp(Number(cfg.nebulaScale ?? 1.0), 0.5, 2.2);
    const nebOffX = Number(cfg.nebulaOffsetX || 0);
    const nebOffY = Number(cfg.nebulaOffsetY || 0);

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-w * 0.5, -h * 0.5);

    // ------------------------------------------------------------------------
    // 1. FRACTAL COSMIC NEBULA BACKGROUND FIELD + MULTI-LAYER CLOUD TURBULENCE
    // ------------------------------------------------------------------------
    const nebW = w * nebScale;
    const nebH = h * nebScale;
    const nebX = (w - nebW) * 0.5 + nebOffX;
    const nebY = (h - nebH) * 0.5 + nebOffY;
    ctx.drawImage(_nebulaCacheCanvas, nebX, nebY, nebW, nebH);

    // Dual-layer animated cosmic cloud drift so the background nebula breathes organically
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const driftX1 = Math.sin(timeSec * 0.42 * cloudSpd) * 26;
    const driftY1 = Math.cos(timeSec * 0.34 * cloudSpd) * 16;
    ctx.globalAlpha = 0.22;
    ctx.drawImage(_nebulaCacheCanvas, nebX + driftX1 - 26, nebY + driftY1 - 16, nebW + 52, nebH + 32);

    const driftX2 = Math.cos(timeSec * 0.55 * cloudSpd + 1.4) * 34;
    const driftY2 = Math.sin(timeSec * 0.48 * cloudSpd + 0.8) * 22;
    ctx.globalAlpha = 0.16;
    ctx.drawImage(_nebulaBrightFilamentCanvas, nebX + driftX2 - 34, nebY + driftY2 - 22, nebW + 68, nebH + 44);
    ctx.restore();

    // Register Nebula Backdrop hitBox so selecting 'cosmic_nebula_backdrop' displays a draggable/resizable box
    _lastStageHitBoxes.push({
      id: 'cosmic_nebula_backdrop',
      label: 'Cosmic Nebula Clouds',
      tab: 'colors',
      x: clamp(w * 0.04 + nebOffX, 8, w * 0.35),
      y: clamp(h * 0.06 + nebOffY, 8, h * 0.35),
      w: clamp(w * 0.92 * nebScale, 160, w - 16),
      h: clamp(h * 0.88 * nebScale, 120, h - 16),
      isBackgroundLayer: true
    });

    // ------------------------------------------------------------------------
    // 2. HIGH-DENSITY 3-HARMONIC TWINKLING MICRO-STARDUST & DEEP-SPACE STARS
    // ------------------------------------------------------------------------
    if ((cfg.ambianceMode || 'stars') === 'stars') {
      const stardustLayers = ensureMicroStardustLayers(w, h, cfg);
      const twInt = clamp(Number(cfg.ambianceTwinkleIntensity ?? 1.35), 0.0, 2.5);
      const twSpd = clamp(Number(cfg.ambianceTwinkleSpeed ?? 1.35), 0.1, 4.0);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let li = 0; li < stardustLayers.length; li++) {
        const wave = 0.5 + 0.5 * Math.sin(timeSec * (2.6 + li * 1.35) * twSpd + li * 2.09);
        const layerAlpha = clamp(0.42 + wave * 0.52 * twInt, 0.15, 1.0);
        ctx.globalAlpha = layerAlpha;
        ctx.drawImage(stardustLayers[li], 0, 0);
      }
      ctx.restore();
    }
    renderAmbianceParticles(ctx, w, h, timeSec, cfg, false);

    // ------------------------------------------------------------------------
    // 3. LIVING NEBULA-EMBEDDED LOGOS WITH FLOWING CLOUD BLEED & LIGHT PASS-THROUGH
    // ------------------------------------------------------------------------
    if (!_logoCompCanvas || _logoCompCanvas.width !== w || _logoCompCanvas.height !== h) {
      _logoCompCanvas = document.createElement('canvas');
      _logoCompCanvas.width = w;
      _logoCompCanvas.height = h;
    }
    const lctx = _logoCompCanvas.getContext('2d');
    lctx.clearRect(0, 0, w, h);

    let leftHitBox = { x: w * 0.02, y: h * 0.18, w: w * 0.42, h: h * 0.64 };
    let rightHitBox = { x: w * 0.54, y: h * 0.18, w: w * 0.42, h: h * 0.64 };

    // Left Logo (Adidas) — Aspect-locked in the left hemisphere
    if (!cfg.leftLogoRemoved) {
      const leftSrc = cfg.leftLogoPreset === 'puma'
        ? DEFAULT_LOGO_URIS.pumaLogo
        : cfg.leftLogoPreset === 'nike'
        ? DEFAULT_LOGO_URIS.nikeLogo
        : cfg.leftLogoPreset === 'apple'
        ? DEFAULT_LOGO_URIS.appleLogo
        : (cfg.leftLogoUrl || DEFAULT_LOGO_URIS.adidasLogo);
      const leftRec = getLoadedImage(leftSrc);
      const leftDrawable = getBgRemovedLogoCanvas(leftRec, leftSrc, cfg.leftLogoRemoveBg !== false);

      if (leftDrawable) {
        const leftScale = clamp(Number(cfg.leftLogoScale ?? 1.0), 0.3, 2.2);
        const boxCX = w * 0.225 + Number(cfg.leftLogoOffsetX || 0);
        const boxCY = h * 0.505 + Number(cfg.leftLogoOffsetY || 0);
        const fit = computeContainRect(leftDrawable, boxCX, boxCY, w * 0.46 * leftScale, h * 0.64 * leftScale);
        leftHitBox = { x: fit.x, y: fit.y, w: fit.w, h: fit.h };

        lctx.save();
        lctx.globalAlpha = clamp(Number(cfg.leftLogoOpacity ?? 0.78), 0.1, 1.0);
        lctx.drawImage(leftDrawable, fit.x, fit.y, fit.w, fit.h);

        // Tint the logo interior with the rich sapphire-to-electric-cyan gradient
        lctx.globalCompositeOperation = 'source-in';
        const lTintGrad = lctx.createLinearGradient(fit.x, fit.y, fit.x + fit.w, fit.y + fit.h * 0.85);
        lTintGrad.addColorStop(0, '#38bdf8');
        lTintGrad.addColorStop(0.45, '#7dd3fc');
        lTintGrad.addColorStop(0.82, '#e0f2fe');
        lTintGrad.addColorStop(1, '#ffffff');
        lctx.fillStyle = lTintGrad;
        lctx.fillRect(fit.x, fit.y, fit.w, fit.h);
        lctx.restore();
      }
    }

    // Right Logo (PUMA) — Aspect-locked & positioned safely inward (w * 0.768) so the leaping
    // Puma cat's head, paws, hind legs, and tail are 100% visible and never clipped!
    if (!cfg.rightLogoRemoved) {
      const rightSrc = cfg.rightLogoPreset === 'adidas'
        ? DEFAULT_LOGO_URIS.adidasLogo
        : cfg.rightLogoPreset === 'nike'
        ? DEFAULT_LOGO_URIS.nikeLogo
        : cfg.rightLogoPreset === 'apple'
        ? DEFAULT_LOGO_URIS.appleLogo
        : (cfg.rightLogoUrl || DEFAULT_LOGO_URIS.pumaLogo);
      const rightRec = getLoadedImage(rightSrc);
      const rightDrawable = getBgRemovedLogoCanvas(rightRec, rightSrc, cfg.rightLogoRemoveBg !== false);

      if (rightDrawable) {
        const rightScale = clamp(Number(cfg.rightLogoScale ?? 1.0), 0.3, 2.2);
        const boxCX = w * 0.768 + Number(cfg.rightLogoOffsetX || 0);
        const boxCY = h * 0.505 + Number(cfg.rightLogoOffsetY || 0);
        const fit = computeContainRect(rightDrawable, boxCX, boxCY, w * 0.45 * rightScale, h * 0.62 * rightScale);
        rightHitBox = { x: fit.x, y: fit.y, w: fit.w, h: fit.h };

        const rTmp = document.createElement('canvas');
        rTmp.width = Math.max(1, Math.round(fit.w));
        rTmp.height = Math.max(1, Math.round(fit.h));
        const rctx = rTmp.getContext('2d');
        rctx.drawImage(rightDrawable, 0, 0, rTmp.width, rTmp.height);
        rctx.globalCompositeOperation = 'source-in';
        const rTintGrad = rctx.createLinearGradient(0, 0, rTmp.width, rTmp.height * 0.85);
        rTintGrad.addColorStop(0, '#ffe4e6');
        rTintGrad.addColorStop(0.32, '#fda4af');
        rTintGrad.addColorStop(0.72, '#fb7185');
        rTintGrad.addColorStop(1, pal.rightSec);
        rctx.fillStyle = rTintGrad;
        rctx.fillRect(0, 0, rTmp.width, rTmp.height);

        lctx.save();
        lctx.globalAlpha = clamp(Number(cfg.rightLogoOpacity ?? 0.80), 0.1, 1.0);
        lctx.drawImage(rTmp, fit.x, fit.y);
        lctx.restore();
      }
    }

    // 3A. LIVING CLOUD TURBULENCE INSIDE LOGOS (Two counter-flowing displacement passes!)
    if (cloudBleed > 0.02 && _nebulaCloudMaskCanvas) {
      const flowX1 = Math.sin(timeSec * 0.65 * logoCloudSpd) * 54 + (timeSec * 22 * logoCloudSpd) % 90;
      const flowY1 = Math.cos(timeSec * 0.52 * logoCloudSpd) * 32;
      const flowX2 = -Math.cos(timeSec * 0.78 * logoCloudSpd + 1.2) * 48;
      const flowY2 = Math.sin(timeSec * 0.60 * logoCloudSpd + 2.1) * 36;

      lctx.save();
      lctx.globalCompositeOperation = 'destination-out';
      lctx.globalAlpha = clamp(cloudBleed * 0.68, 0, 0.90);
      lctx.drawImage(_nebulaCloudMaskCanvas, -60 + flowX1, -40 + flowY1, w + 120, h + 80);

      lctx.globalAlpha = clamp(cloudBleed * 0.45, 0, 0.78);
      lctx.drawImage(_nebulaCloudMaskCanvas, -60 + flowX2, -40 + flowY2, w + 120, h + 80);
      lctx.restore();

      // Flowing bright cosmic cloud filaments & internal light transmission (`source-atop`)
      if (_nebulaBrightFilamentCanvas) {
        lctx.save();
        lctx.globalCompositeOperation = 'source-atop';
        lctx.globalAlpha = clamp(0.42 * lightPassThrough, 0, 0.95);
        lctx.drawImage(_nebulaBrightFilamentCanvas, -50 - flowX1 * 0.8, -35 + flowY2 * 0.8, w + 100, h + 70);
        lctx.restore();
      }
    }

    // 3B. SUBSURFACE OPTICAL LIGHT PASS-THROUGH INSIDE LOGOS
    //     When the travelling star, the upper red<->blue halo, or the lower blue<->red halo
    //     passes over `adidas` or `PUMA`, light shines directly through the letters!
    if (lightPassThrough > 0.05 && starWorldPos) {
      lctx.save();
      lctx.globalCompositeOperation = 'source-atop';

      // 1) Travelling Star subsurface illumination through the letters
      const sx = starWorldPos.x;
      const sy = starWorldPos.y;
      const starPassGrad = lctx.createRadialGradient(sx, sy, 4, sx, sy, w * 0.28);
      starPassGrad.addColorStop(0, `rgba(255, 255, 255, ${clamp(0.75 * lightPassThrough, 0, 1).toFixed(3)})`);
      starPassGrad.addColorStop(0.35, `rgba(103, 232, 249, ${clamp(0.48 * lightPassThrough, 0, 1).toFixed(3)})`);
      starPassGrad.addColorStop(0.70, `rgba(244, 63, 94, ${clamp(0.24 * lightPassThrough, 0, 1).toFixed(3)})`);
      starPassGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lctx.fillStyle = starPassGrad;
      lctx.fillRect(0, 0, w, h);

      // 2) Lower Counter-Moving Halo subsurface light beam sweeping from PUMA bottom to Adidas bottom
      const pHalo = starWorldPos.progress || 0;
      const botBeamX = lerp(w * 0.82, w * 0.18, pHalo);
      const botBeamY = lerp(h * 0.68, h * 0.62, pHalo);
      const botPassGrad = lctx.createRadialGradient(botBeamX, botBeamY, 8, botBeamX, botBeamY, w * 0.30);
      botPassGrad.addColorStop(0, `rgba(255, 228, 230, ${clamp(0.68 * lightPassThrough, 0, 1).toFixed(3)})`);
      botPassGrad.addColorStop(0.40, `rgba(251, 113, 133, ${clamp(0.45 * lightPassThrough, 0, 1).toFixed(3)})`);
      botPassGrad.addColorStop(0.75, `rgba(56, 189, 248, ${clamp(0.30 * lightPassThrough, 0, 1).toFixed(3)})`);
      botPassGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lctx.fillStyle = botPassGrad;
      lctx.fillRect(0, 0, w, h);

      // 3) Upper Counter-Moving Halo subsurface light beam sweeping from Adidas top to PUMA top
      const topBeamX = lerp(w * 0.22, w * 0.78, pHalo);
      const topBeamY = lerp(h * 0.26, h * 0.32, pHalo);
      const topPassGrad = lctx.createRadialGradient(topBeamX, topBeamY, 8, topBeamX, topBeamY, w * 0.26);
      topPassGrad.addColorStop(0, `rgba(224, 242, 254, ${clamp(0.62 * lightPassThrough, 0, 1).toFixed(3)})`);
      topPassGrad.addColorStop(0.45, `rgba(56, 189, 248, ${clamp(0.42 * lightPassThrough, 0, 1).toFixed(3)})`);
      topPassGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lctx.fillStyle = topPassGrad;
      lctx.fillRect(0, 0, w, h);

      lctx.restore();
    }

    // Composite the living, light-transmitting logos onto the cosmic stage
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(_logoCompCanvas, 0, 0);
    ctx.restore();

    // ------------------------------------------------------------------------
    // 4. FOREGROUND PINPOINT STARS & MICRO-STARDUST SHINING THROUGH THE LOGOS
    // ------------------------------------------------------------------------
    if ((cfg.ambianceMode || 'stars') === 'stars') {
      const stardustLayers = ensureMicroStardustLayers(w, h, cfg);
      const twInt = clamp(Number(cfg.ambianceTwinkleIntensity ?? 1.35), 0.0, 2.5);
      const twSpd = clamp(Number(cfg.ambianceTwinkleSpeed ?? 1.35), 0.1, 4.0);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let li = 0; li < stardustLayers.length; li++) {
        const shimmerWave = 0.5 + 0.5 * Math.cos(timeSec * (3.1 + li * 1.45) * twSpd + li * 1.57);
        ctx.globalAlpha = clamp(0.28 + shimmerWave * 0.42 * twInt, 0.10, 0.92);
        ctx.drawImage(stardustLayers[li], 0, 0);
      }
      ctx.restore();
    }
    renderAmbianceParticles(ctx, w, h, timeSec, cfg, true);

    // ------------------------------------------------------------------------
    // 5. RAZOR-THIN CENTRAL LIGHT RIFT & TIGHT POLE RIM KISSES
    //    Matches image_be30fa77.png & image_eb6eefef.png:
    //    - Tight, razor-sharp optical seam (zero giant figure-8 white wash!)
    //    - Compact cyan-white diffraction kisses right at the North and South
    //      limbs of the occulting Earth sphere
    // ------------------------------------------------------------------------
    const riftGlow = clamp(Number(cfg.riftGlowIntensity ?? 1.15), 0.1, 2.5);
    const riftW = clamp(Number(cfg.riftWidthPx ?? 10), 3, 42);
    const pinchFlare = clamp(Number(cfg.riftCenterPinchFlare ?? 1.15), 0, 2.5);
    const leftRiftCol = cfg.riftLeftGlowColor || pal.leftSec;
    const rightRiftCol = cfg.riftRightGlowColor || pal.rightSec;
    const riftOffY = Number(cfg.riftOffsetY || 0);

    const steps = 48;
    const riftPts = [];
    for (let i = 0; i <= steps; i++) {
      const yn = i / steps;
      const rx = getRiftXAtNormalizedY(yn, cfg, timeSec) * w;
      riftPts.push({ x: rx, y: yn * h + riftOffY });
    }

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const traceRiftPolyline = (offsetX = 0) => {
      ctx.beginPath();
      riftPts.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x + offsetX, pt.y);
        else ctx.lineTo(pt.x + offsetX, pt.y);
      });
    };

    // Pass 1: Tight Atmospheric Falloff (Cyan left, Rose-Magenta right)
    ctx.strokeStyle = rgbaStr(leftRiftCol, 0.22 * riftGlow);
    ctx.lineWidth = riftW * 1.45;
    ctx.shadowColor = leftRiftCol;
    ctx.shadowBlur = 16;
    traceRiftPolyline(-1.5);
    ctx.stroke();

    ctx.strokeStyle = rgbaStr(rightRiftCol, 0.20 * riftGlow);
    ctx.lineWidth = riftW * 1.45;
    ctx.shadowColor = rightRiftCol;
    ctx.shadowBlur = 16;
    traceRiftPolyline(1.5);
    ctx.stroke();

    // Pass 2: Tight Cyan-White Inner Seam Glow
    ctx.strokeStyle = rgbaStr('#bae6fd', 0.65 * riftGlow);
    ctx.lineWidth = Math.max(2.2, riftW * 0.34);
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    traceRiftPolyline(0);
    ctx.stroke();

    // Pass 3: Razor-Thin White-Hot Needle Core (1.5px)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.lineWidth = Math.max(1.3, riftW * 0.13);
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 3;
    traceRiftPolyline(0);
    ctx.stroke();

    // Pass 4: Compact North & South Pole Rim Kisses + Central Equatorial Rift Sheen
    if (pinchFlare > 0.05) {
      const baseScale = clamp(Number(cfg.globeInitialScale ?? 0.145), 0.06, 0.35);
      const approxGlobeR = Math.min(w, h) * baseScale;
      const globeCY = h * 0.5 + Number(cfg.globeOffsetY || 0) + riftOffY;
      const northY = clamp(globeCY - approxGlobeR * 0.99, h * 0.06, h * 0.48);
      const southY = clamp(globeCY + approxGlobeR * 0.99, h * 0.52, h * 0.94);
      const northX = getRiftXAtNormalizedY(clamp(northY / h, 0, 1), cfg, timeSec) * w;
      const southX = getRiftXAtNormalizedY(clamp(southY / h, 0, 1), cfg, timeSec) * w;

      [
        { x: northX, y: northY, r: approxGlobeR * 0.24 * pinchFlare },
        { x: southX, y: southY, r: approxGlobeR * 0.22 * pinchFlare }
      ].forEach((pole) => {
        const pr = Math.max(6, pole.r);
        const pGrad = ctx.createRadialGradient(pole.x, pole.y, 0.5, pole.x, pole.y, pr);
        pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
        pGrad.addColorStop(0.32, rgbaStr('#7dd3fc', 0.75 * pinchFlare));
        pGrad.addColorStop(0.68, rgbaStr(leftRiftCol, 0.28 * pinchFlare));
        pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(pole.x, pole.y, pr, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore(); // End Rift
    ctx.restore(); // End Camera Zoom

    const riftMidX = getRiftXAtNormalizedY(0.5, cfg, timeSec) * w;
    _lastStageHitBoxes.push(
      {
        id: 'left_logo_adidas',
        label: 'Left Brand Logo',
        scene: 'scene1',
        x: leftHitBox.x,
        y: leftHitBox.y,
        w: leftHitBox.w,
        h: leftHitBox.h
      },
      {
        id: 'right_logo_puma',
        label: 'Right Brand Logo',
        scene: 'scene1',
        x: rightHitBox.x,
        y: rightHitBox.y,
        w: rightHitBox.w,
        h: rightHitBox.h
      },
      {
        id: 'central_light_rift',
        label: 'Central Light Rift',
        scene: 'scene1',
        x: clamp(riftMidX - Math.max(28, riftW * 2.4), 10, w - 60),
        y: clamp(h * 0.04 + riftOffY, 6, h * 0.35),
        w: Math.max(56, riftW * 4.8),
        h: h * 0.90
      }
    );
  }

  function renderAmbianceParticles(ctx, w, h, timeSec, cfg, foregroundPass) {
    const mode = cfg.ambianceMode || 'stars';
    const totalCount = clamp(Math.round(Number(cfg.ambianceParticleCount ?? 340)), 0, 800);
    const count = foregroundPass ? Math.round(totalCount * 0.45) : Math.round(totalCount * 0.55);
    const seedOffset = foregroundPass ? 5000 : 0;
    const spd = clamp(Number(cfg.ambianceParticleSpeed ?? 1.0), 0.1, 3.0);
    const twinkle = clamp(Number(cfg.ambianceTwinkleIntensity ?? 1.35), 0, 2.5);
    const twinkleSpd = clamp(Number(cfg.ambianceTwinkleSpeed ?? 1.35), 0.1, 4.0);

    ctx.save();
    for (let i = 0; i < count; i++) {
      const idx = i + seedOffset;
      const rx = hash1D(idx * 13.7 + 7);
      const ry = hash1D(idx * 29.3 + 19);
      const szSeed = hash1D(idx * 43.1 + 3);

      if (mode === 'rain') {
        const x = ((rx * w - timeSec * 90 * spd) % w + w) % w;
        const y = ((ry * h + timeSec * 520 * spd * (0.7 + szSeed * 0.6)) % h + h) % h;
        const len = 10 + szSeed * 18;
        ctx.strokeStyle = x < w * 0.5 ? 'rgba(186, 230, 253, 0.46)' : 'rgba(254, 205, 211, 0.46)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3, y + len);
        ctx.stroke();
      } else if (mode === 'snow') {
        const x = ((rx * w + Math.sin(timeSec * 1.4 + idx) * 28) % w + w) % w;
        const y = ((ry * h + timeSec * 68 * spd * (0.5 + szSeed * 0.7)) % h + h) % h;
        const r = Math.max(0.8, 1.1 + szSeed * 2.5);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.76)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'embers') {
        const x = ((rx * w + Math.sin(timeSec * 2.1 + idx) * 34) % w + w) % w;
        const y = ((ry * h - timeSec * 95 * spd * (0.5 + szSeed * 0.8)) % h + h) % h;
        const r = Math.max(0.8, 1.0 + szSeed * 2.4);
        ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#fb7185';
        ctx.globalAlpha = clamp(0.4 + 0.55 * Math.sin(timeSec * 5 * twinkleSpd + idx), 0.05, 1.0);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const driftX = mode === 'cosmic_dust' ? Math.sin(timeSec * 0.4 + idx) * 10 : (i % 6 === 0 ? -timeSec * 4.2 * spd : 0);
        const driftY = mode === 'cosmic_dust' ? Math.cos(timeSec * 0.35 + idx) * 10 : (i % 9 === 0 ? timeSec * 5.0 * spd : 0);
        const x = ((rx * w + driftX) % w + w) % w;
        const y = ((ry * h + driftY) % h + h) % h;
        const osc = 0.5 + 0.5 * Math.sin(timeSec * (2.6 + szSeed * 4.5) * twinkleSpd + idx * 1.7);
        const tw = clamp(1.0 - twinkle * 0.48 + osc * twinkle * 0.85, 0.08, 1.6);
        const r = Math.max(0.42, (szSeed > 0.95 ? 1.65 : szSeed > 0.80 ? 1.05 : 0.62) * (0.85 + 0.25 * osc * Math.min(1.5, twinkle)));

        ctx.globalAlpha = clamp(tw * (0.34 + szSeed * 0.66), 0.06, 1);
        ctx.fillStyle = szSeed > 0.86
          ? (x < w * 0.5 ? '#bae6fd' : '#fecdd3')
          : '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle cross-glint on bright twinkling stars when near peak brightness
        if (szSeed > 0.91 && osc > 0.72 && twinkle > 0.3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fillRect(x - r * 2.2, y - 0.35, r * 4.4, 0.7);
          ctx.fillRect(x - 0.35, y - r * 2.2, 0.7, r * 4.4);
        }
      }
    }

    // Prominent 4-point diamond stars (Next to leaping Puma cat, inside PUMA, and drifting down the central rift)
    if (foregroundPass && cfg.prominentPumaStarEnabled !== false) {
      const pPulse1 = 1.0 + 0.22 * Math.sin(timeSec * 3.8 * twinkleSpd) * Math.min(1.5, twinkle);
      const pPulse2 = 1.0 + 0.24 * Math.cos(timeSec * 4.4 * twinkleSpd + 1.2) * Math.min(1.5, twinkle);
      ctx.globalAlpha = 0.96;
      drawFourPointStar(ctx, w * 0.835, h * 0.245, 9.2 * pPulse1, '#fb7185', '#ffffff');
      drawFourPointStar(ctx, w * 0.702, h * 0.415, 5.8 * pPulse2, '#fda4af', '#ffffff');
      drawFourPointStar(ctx, w * 0.165, h * 0.285, 5.4 * pPulse1, '#38bdf8', '#ffffff');
      // Bright star drifting down near bottom of the rift (pointed to by green arrow in image_31b11176.png)
      const driftStarY = h * 0.80 + ((timeSec * 24 * spd) % (h * 0.18));
      const driftStarX = w * 0.448 - ((timeSec * 9 * spd) % (w * 0.035));
      drawFourPointStar(ctx, driftStarX, driftStarY, 7.8 * pPulse2, '#bae6fd', '#ffffff');
    }

    ctx.restore();
  }

  function drawFourPointStar(ctx, x, y, radius, glowColor, coreColor, anamorphicStretch = 1.0) {
    const r = Math.max(1, radius);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const grad = ctx.createRadialGradient(x, y, 0.5, x, y, r * 3.1);
    grad.addColorStop(0, coreColor || '#ffffff');
    grad.addColorStop(0.35, glowColor || '#fda4af');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.1, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal & vertical 4-point crystalline spikes
    const hSpike = r * 1.75 * anamorphicStretch;
    const vSpike = r * 1.65;
    ctx.fillStyle = coreColor || '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x, y - vSpike);
    ctx.quadraticCurveTo(x, y, x + hSpike, y);
    ctx.quadraticCurveTo(x, y, x, y + vSpike);
    ctx.quadraticCurveTo(x, y, x - hSpike, y);
    ctx.quadraticCurveTo(x, y, x, y - vSpike);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ==========================================================================
  // 9. TRAVELLING SUN-STAR (RIGHT -> MIDDLE RIFT -> BLUE ADIDAS) &
  //    CROSS-HEMISPHERE NEON OPTICAL HALOS (RED <-> BLUE & BLUE <-> RED)
  // ==========================================================================
  function computeTravellingStarWorldPos(w, h, globalTimeSec, cfg) {
    const spd = clamp(Number(cfg.starTravelSpeed ?? 1.0), 0.2, 3.0);
    const offX = Number(cfg.starOffsetX || 0);
    const offY = Number(cfg.starOffsetY || 0);
    // Completes main right -> middle -> left Adidas stripe journey over 0.0s .. 2.35s, then drifts slowly
    const rawT = globalTimeSec * spd;
    const p = rawT <= 2.35
      ? easeInOutCubic(rawT / 2.35) * 0.84
      : clamp(0.84 + (rawT - 2.35) * 0.08, 0, 1);

    const mode = cfg.starTrajectoryMode || 'right_to_left_authentic';

    if (mode === 'left_to_right') {
      return {
        x: lerp(w * 0.14, w * 0.80, p) + offX,
        y: lerp(h * 0.20, h * 0.34, p) + offY,
        progress: p
      };
    }
    if (mode === 'top_to_bottom') {
      return {
        x: w * 0.5 + Math.sin(p * Math.PI * 2) * w * 0.14 + offX,
        y: lerp(h * 0.12, h * 0.88, p) + offY,
        progress: p
      };
    }
    if (mode === 'bottom_to_top') {
      return {
        x: w * 0.5 - Math.sin(p * Math.PI * 2) * w * 0.14 + offX,
        y: lerp(h * 0.88, h * 0.12, p) + offY,
        progress: p
      };
    }
    if (mode === 'orbit_globe') {
      const ang = p * Math.PI * 2.2;
      return {
        x: w * 0.5 + Math.cos(ang) * w * 0.24 + offX,
        y: h * 0.5 + Math.sin(ang) * h * 0.22 + offY,
        progress: p
      };
    }

    // DEFAULT: 'right_to_left_authentic'
    // 1) Starts on the right near the leaping Puma cat (0.79w, 0.29h)
    // 2) Crosses the middle rift at p ≈ 0.45 (0.505w, 0.245h)
    // 3) Enters the blue Adidas hemisphere and touches the first Adidas stripe (0.14w, 0.185h)
    const x = lerp(w * 0.79, w * 0.13, p) + offX;
    const y = lerp(h * 0.30, h * 0.185, p) - Math.sin(p * Math.PI) * (h * 0.035) + offY;
    return {
      x,
      y,
      progress: p
    };
  }

  function renderTravellingStarAndCounterRefraction(ctx, w, h, cameraZoom, globalTimeSec, cfg) {
    const starPos = computeTravellingStarWorldPos(w, h, globalTimeSec, cfg);
    const fadeOut = 1 - smoothstep(3.9, 4.9, globalTimeSec);
    if (fadeOut <= 0.01) return;

    const starSize = clamp(Number(cfg.starCoreSize ?? 1.15), 0.3, 2.8);
    const flareInt = clamp(Number(cfg.neonRefractionIntensity ?? 1.35), 0, 2.8) * fadeOut;
    const crossHaloInt = clamp(Number(cfg.crossHemisphereHaloIntensity ?? 1.40), 0, 2.8) * fadeOut;

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-w * 0.5, -h * 0.5);
    ctx.globalCompositeOperation = 'screen';

    const sx = starPos.x;
    const sy = starPos.y;
    const p = starPos.progress;
    const centerX = w * 0.505 + Number(cfg.globeOffsetX || 0);
    const centerY = h * 0.50 + Number(cfg.globeOffsetY || 0);

    // ------------------------------------------------------------------------
    // 1. CROSS-HEMISPHERE NEON OPTICAL HALOS (RED <-> BLUE & BLUE <-> RED)
    // ------------------------------------------------------------------------
    if (cfg.neonRefractionEnabled !== false && (flareInt > 0.02 || crossHaloInt > 0.02)) {
      const topCol = cfg.neonRefractionTopColor || '#22d3ee';
      const botCol = cfg.neonRefractionBottomColor || '#ff2a6d';

      // A. UPPER CROSS-HEMISPHERE HALO (Moves between Adidas Top & Puma Top across the rift)
      const topSweepX = lerp(w * 0.24, w * 0.76, p);
      const topSweepY = lerp(h * 0.23, h * 0.31, p);
      const topHaloR = Math.max(60, w * 0.22);

      const uGrad = ctx.createRadialGradient(topSweepX, topSweepY, 4, topSweepX, topSweepY, topHaloR);
      uGrad.addColorStop(0, rgbaStr('#ffffff', 0.42 * crossHaloInt));
      uGrad.addColorStop(0.24, rgbaStr(topCol, 0.38 * crossHaloInt));
      uGrad.addColorStop(0.55, rgbaStr(botCol, 0.26 * crossHaloInt));
      uGrad.addColorStop(0.82, rgbaStr('#a855f7', 0.12 * crossHaloInt));
      uGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = uGrad;
      ctx.beginPath();
      ctx.arc(topSweepX, topSweepY, topHaloR, 0, Math.PI * 2);
      ctx.fill();

      // B. LOWER COUNTER-MOVING NEON HALO (Sweeps from bottom of PUMA -> across lower Rift -> bottom of Adidas)
      const botSweepX = lerp(w * 0.78, w * 0.20, p);
      const botSweepY = lerp(h * 0.71, h * 0.65, p) + Math.sin(p * Math.PI) * (h * 0.04);
      const botHaloR = Math.max(70, w * 0.25);

      const bGrad = ctx.createRadialGradient(botSweepX, botSweepY, 4, botSweepX, botSweepY, botHaloR);
      bGrad.addColorStop(0, rgbaStr('#fff1f2', 0.48 * crossHaloInt));
      bGrad.addColorStop(0.26, rgbaStr(botCol, 0.42 * crossHaloInt));
      bGrad.addColorStop(0.56, rgbaStr(topCol, 0.32 * crossHaloInt));
      bGrad.addColorStop(0.82, rgbaStr('#ec4899', 0.14 * crossHaloInt));
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(botSweepX, botSweepY, botHaloR, 0, Math.PI * 2);
      ctx.fill();

      // C. CENTRAL EQUATORIAL LIGHT BLOOM IN THE MIDDLE (Matches original Image 3 & Image 4)
      const midBloomR = Math.max(55, w * 0.16);
      const midGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, midBloomR);
      midGrad.addColorStop(0, rgbaStr('#e0f2fe', 0.36 * flareInt));
      midGrad.addColorStop(0.38, rgbaStr(topCol, 0.24 * flareInt));
      midGrad.addColorStop(0.72, rgbaStr(botCol, 0.14 * flareInt));
      midGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = midGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, midBloomR, 0, Math.PI * 2);
      ctx.fill();

      // D. DIAGONAL ANAMORPHIC REFRACTION RIBBON CONNECTING THE STAR AND COUNTER-HALO ACROSS THE RIFT
      ctx.save();
      const ribGrad = ctx.createLinearGradient(sx, sy, botSweepX, botSweepY);
      ribGrad.addColorStop(0, rgbaStr(topCol, 0.28 * flareInt));
      ribGrad.addColorStop(0.45, rgbaStr('#ffffff', 0.22 * flareInt));
      ribGrad.addColorStop(0.75, rgbaStr(botCol, 0.32 * flareInt));
      ribGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.strokeStyle = ribGrad;
      ctx.lineWidth = Math.max(18, w * 0.045);
      ctx.lineCap = 'round';
      ctx.filter = 'blur(12px)';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(centerX, centerY + h * 0.08, botSweepX, botSweepY);
      ctx.stroke();
      ctx.restore();

      // E. SECONDARY IRIS GHOST BLOOMS ALONG THE COUNTER-AXIS
      const bloomCount = clamp(Math.round(Number(cfg.neonRefractionRingCount ?? 3)), 1, 6);
      const dx = sx - centerX;
      const dy = sy - centerY;
      for (let b = 1; b <= bloomCount; b++) {
        const pivot = -0.45 - b * 0.32;
        const bx = clamp(centerX + dx * pivot, w * 0.15, w * 0.88);
        const by = clamp(centerY + dy * pivot + h * 0.10, h * 0.42, h * 0.86);
        const bRad = Math.max(30, w * 0.075 + b * w * 0.035);

        const gGrad = ctx.createRadialGradient(bx, by, 2, bx, by, bRad);
        const isLeftHalf = bx < centerX;
        const innerCol = isLeftHalf ? botCol : topCol;
        const outerCol = isLeftHalf ? topCol : botCol;
        gGrad.addColorStop(0, rgbaStr('#ffffff', 0.30 * flareInt));
        gGrad.addColorStop(0.35, rgbaStr(innerCol, 0.28 * flareInt));
        gGrad.addColorStop(0.72, rgbaStr(outerCol, 0.16 * flareInt));
        gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gGrad;
        ctx.beginPath();
        ctx.arc(bx, by, bRad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ------------------------------------------------------------------------
    // 2. PRIMARY TRAVELLING 4-POINT SUN-STAR (Right -> Middle Rift -> Left Blue)
    // ------------------------------------------------------------------------
    const distToRift = Math.abs(sx - centerX) / (w * 0.5);
    const riftCrossBoost = 1.0 + Math.exp(-distToRift * 12.0) * 0.55;
    const coreR = Math.max(3.2, 4.4 * starSize * riftCrossBoost);
    const outerR = Math.max(22, 48 * starSize * riftCrossBoost);

    const haloGrad = ctx.createRadialGradient(sx, sy, 1, sx, sy, outerR);
    haloGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    haloGrad.addColorStop(0.22, rgbaStr('#e0f2fe', 0.90 * fadeOut));
    haloGrad.addColorStop(0.52, sx < centerX ? rgbaStr('#fb7185', 0.55 * fadeOut) : rgbaStr('#38bdf8', 0.55 * fadeOut));
    haloGrad.addColorStop(0.80, sx < centerX ? rgbaStr('#38bdf8', 0.30 * fadeOut) : rgbaStr('#f43f5e', 0.30 * fadeOut));
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal anamorphic lens flare streak through the star core
    const streakW = outerR * 2.4;
    const streakGrad = ctx.createLinearGradient(sx - streakW, sy, sx + streakW, sy);
    streakGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    streakGrad.addColorStop(0.35, rgbaStr('#7dd3fc', 0.45 * fadeOut));
    streakGrad.addColorStop(0.5, rgbaStr('#ffffff', 0.95 * fadeOut));
    streakGrad.addColorStop(0.65, rgbaStr('#fda4af', 0.45 * fadeOut));
    streakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = streakGrad;
    ctx.fillRect(sx - streakW, sy - 1.6, streakW * 2, 3.2);

    // Crisp 4-point diamond star spikes
    drawFourPointStar(ctx, sx, sy, coreR * 2.2, sx < centerX ? '#38bdf8' : '#fb7185', '#ffffff', 1.45);

    ctx.restore();

    const starBoxSide = Math.max(84, Math.round(outerR * 2.1));
    _lastStageHitBoxes.push({
      id: 'travelling_sun_star',
      label: 'Sun-Star & Lens Flare',
      scene: 'scene1',
      x: sx - starBoxSide * 0.5,
      y: sy - starBoxSide * 0.5,
      w: starBoxSide,
      h: starBoxSide
    });
  }

  // ==========================================================================
  // 10. TRUE 3D SPHERICAL RAYCASTED EARTH GLOBE WITH SURFACE-WRAPPING SUNLIGHT,
  //     CENTRAL EQUATORIAL LIGHT, CRIMSON RIGHT-RIM BOUNCE & CONTINUOUS FINAL SPIN
  //     Matches Image 3 (image_eb6eefef.png) & Image 4 (image_cc6deed2.png) 1:1!
  // ==========================================================================
  function renderSpinning3DEarthGlobe(ctx, w, h, globalTimeSec, cfg) {
    ensureWorldMapCanvases();

    const keep3DInAct3 = cfg.macroMapMode === 'continual_3d_globe';
    const fadeStart = keep3DInAct3 ? 7.2 : 4.96;
    const fadeEnd = keep3DInAct3 ? 8.2 : 5.18;
    const globeFadeOut = 1 - smoothstep(fadeStart, fadeEnd, globalTimeSec);
    if (globeFadeOut <= 0.01) return;

    const baseScale = clamp(Number(cfg.globeInitialScale ?? 0.145), 0.06, 0.35);
    const gravAccel = clamp(Number(cfg.globeGravityAcceleration ?? 1.25), 0.4, 2.5);
    const spinSpd = clamp(Number(cfg.globeSpinSpeed ?? 1.15), 0.2, 3.0);
    const spinRevs = clamp(Number(cfg.globeSpinRevolutions ?? 1.35), 0.25, 5.0);

    // Act 1 (0.0s – 1.85s): Slow optical push-in; Act 2 (1.80s – 5.05s): Exponential gravity zoom
    // Calibrated so at t = 5.05s, radius = minDim * 1.18 (850px in 720p) and camera centers on Europe
    // at (cx = w * 0.438, cy = h * 0.471), matching image_cc4e4bea.png 1:1 with zero ghosting!
    const preSpinT = clamp(globalTimeSec / 1.85, 0, 1);
    const gravT = clamp((globalTimeSec - 1.80) / 3.25, 0, 1.12);
    const gravityCurve = Math.pow(Math.max(0, gravT), 2.25 * gravAccel);

    const minDim = Math.min(w, h);
    const radius = Math.max(18, minDim * (baseScale + preSpinT * 0.030 + gravityCurve * 1.005));
    const panToEu = smoothstep(0.32, 1.0, clamp(gravT, 0, 1));
    const targetReg = cfg.globeTargetRegion || 'europe_germany';
    const panXTarget = targetReg === 'europe_germany' ? w * 0.438 : w * 0.505;
    const panYTarget = targetReg === 'europe_germany' ? h * 0.471 : h * 0.50;
    const cx = lerp(w * 0.505, panXTarget, panToEu) + Number(cfg.globeOffsetX || 0);
    const cy = lerp(h * 0.50, panYTarget, panToEu) + Number(cfg.globeOffsetY || 0);

    ctx.save();
    ctx.globalAlpha = globeFadeOut;

    const rimInt = clamp(Number(cfg.globeDaylightRimIntensity ?? 1.25), 0.1, 2.5);
    const rimCol = cfg.globeDaylightRimColor || '#67e8f9';
    const crescentWidth = clamp(Number(cfg.globeCrescentWidth ?? 0.22), 0.05, 0.48);
    const sunAngleDeg = Number(cfg.globeSunAngleDeg ?? 148);
    const sunAngleRad = (sunAngleDeg * Math.PI) / 180;

    const crescentRamp = 0.40 + 0.60 * smoothstep(0.4, 2.8, globalTimeSec);
    const dynamicRimPower = crescentRamp * rimInt;

    // ------------------------------------------------------------------------
    // A. OUTER ATMOSPHERIC LIMB GLOW + DIRECTIONAL SUNLIT CORONA (Image 3 & 4)
    // ------------------------------------------------------------------------
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Tight full-circle dark-blue atmospheric aura
    const backHaloR = radius * 1.07;
    const backGrad = ctx.createRadialGradient(cx, cy, radius * 0.96, cx, cy, backHaloR);
    backGrad.addColorStop(0, rgbaStr('#7dd3fc', 0.46 * rimInt));
    backGrad.addColorStop(0.5, rgbaStr('#0284c7', 0.20 * rimInt));
    backGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = backGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, backHaloR, 0, Math.PI * 2);
    ctx.fill();

    // Directional upper-left sunlit atmospheric corona hugging the outer limb
    const sunDirX = -Math.cos(sunAngleRad - Math.PI * 0.5);
    const sunDirY = -Math.sin(sunAngleRad - Math.PI * 0.5);
    const offX = sunDirX * radius * 0.10;
    const offY = sunDirY * radius * 0.10;
    const outerAtmoR = radius * 1.18;
    const atmoGrad = ctx.createRadialGradient(
      cx + offX, cy + offY, Math.max(2, radius * 0.86),
      cx + offX * 0.5, cy + offY * 0.5, outerAtmoR
    );
    atmoGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    atmoGrad.addColorStop(0.28, rgbaStr(rimCol, 0.78 * dynamicRimPower));
    atmoGrad.addColorStop(0.65, rgbaStr('#0284c7', 0.32 * dynamicRimPower));
    atmoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = atmoGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerAtmoR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ------------------------------------------------------------------------
    // B. TRUE 3D SPHERICAL RAYCAST PROJECTION WITH BILINEAR FILTERING &
    //    AUTHENTIC SILVER-IVORY NASA NIGHT LIGHTS
    //    Matches image_b1b8463c.png, image_e6189a1c.png & image_cc4e4bea.png 1:1:
    //    - Scandinavia, Europe, Africa & Greenland night side are 100% smooth
    //      matte dark slate-navy (zero shiny plastic bumps, zero grid dots!)
    //    - Subtle high-frequency rocky micro-relief is confined strictly to the
    //      upper-left sunlit limb (nx < -0.15)
    //    - Spin & camera pan finish registered 1:1 with image_cc4e4bea.png!
    // ------------------------------------------------------------------------
    const spinDir = cfg.globeSpinDirection || 'west_to_east_authentic';
    const targetLon = targetReg === 'north_america' ? 0.285 : targetReg === 'east_asia' ? 0.81 : 0.500;
    const targetLat = targetReg === 'north_america' ? 0.38 : targetReg === 'east_asia' ? 0.42 : 0.345;

    // Continuous axial rotation + pitch roll that keeps spinning smoothly right into the zoom!
    let normSpinT = 0;
    if (globalTimeSec < 1.55) {
      normSpinT = (globalTimeSec / 1.55) * 0.08;
    } else {
      const activeT = clamp((globalTimeSec - 1.55) / 3.45, 0, 1.05);
      const eased = activeT <= 1.0
        ? (easeInOutCubic(activeT) * 0.72 + activeT * 0.28)
        : (1.0 + (activeT - 1.0) * 0.22);
      normSpinT = 0.08 + eased * 0.92;
    }

    // Total longitude sweep: lands precisely on targetLon (0.500) & targetLat (0.345) at t = 5.0s!
    const totalLonSweep = (0.30 + Math.max(0, spinRevs - 1.0) * 0.65) * clamp(spinSpd / 1.15, 0.4, 2.5);
    const startLon = targetLon - totalLonSweep;
    let lonCenter = startLon + totalLonSweep * normSpinT;
    let latCenter = lerp(0.415, targetLat, clamp(normSpinT, 0, 1)) + Math.sin(clamp(normSpinT, 0, 1) * Math.PI) * 0.018;

    if (spinDir === 'east_to_west') {
      lonCenter = (targetLon + totalLonSweep) - totalLonSweep * normSpinT;
    } else if (spinDir === 'north_to_south') {
      lonCenter = targetLon;
      latCenter = (targetLat - 0.24 * spinRevs) + (0.24 * spinRevs) * normSpinT;
    } else if (spinDir === 'south_to_north') {
      lonCenter = targetLon;
      latCenter = (targetLat + 0.24 * spinRevs) - (0.24 * spinRevs) * normSpinT;
    } else if (spinDir === 'diagonal_tumble') {
      lonCenter = startLon + totalLonSweep * normSpinT;
      latCenter = lerp(0.54, targetLat, clamp(normSpinT, 0, 1));
    }

    const bufDim = clamp(Math.round(Math.min(540, Math.max(240, radius * 1.65))), 240, 540);
    if (!_globeRenderCanvas || _globeRenderCanvas.width !== bufDim) {
      _globeRenderCanvas = document.createElement('canvas');
      _globeRenderCanvas.width = bufDim;
      _globeRenderCanvas.height = bufDim;
    }
    const gctx = _globeRenderCanvas.getContext('2d');
    const gImg = gctx.createImageData(bufDim, bufDim);
    const gd = gImg.data;

    const half = bufDim * 0.5;
    const invHalf = 1 / half;
    const mapW = _worldMapW;
    const mapH = _worldMapH;
    const srcPixels = _worldNightPixels;
    const relPixels = _worldReliefPixels;
    const cityInt = clamp(Number(cfg.globeCityLightsIntensity ?? 1.35), 0.2, 2.5);
    const rimRgb = hexToRgb(rimCol);

    const pitch = (latCenter - 0.5) * Math.PI;
    const yaw = (lonCenter - 0.5) * Math.PI * 2.0;
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const invTwoPi = 1.0 / (Math.PI * 2.0);
    const invPi = 1.0 / Math.PI;

    // 2D Limb direction vector for the sunlit crescent (default upper-left: nx < 0, ny < 0)
    const limbDirX = -Math.cos((sunAngleDeg - 90) * Math.PI / 180);
    const limbDirY = -Math.sin((sunAngleDeg - 90) * Math.PI / 180);
    const limbSharpness = clamp(0.95 / Math.max(0.06, crescentWidth), 2.0, 11.0);

    for (let py = 0; py < bufDim; py++) {
      const ny = (py + 0.5 - half) * invHalf;
      const ny2 = ny * ny;
      if (ny2 >= 1) continue;

      for (let px = 0; px < bufDim; px++) {
        const nx = (px + 0.5 - half) * invHalf;
        const r2 = nx * nx + ny2;
        if (r2 >= 1) continue;

        const rDist = Math.sqrt(r2);
        const nz = Math.sqrt(1.0 - r2);

        // Rotate view-space normal (nx, ny, nz) by pitch (X-axis) then yaw (Y-axis)
        const y1 = ny * cosPitch + nz * sinPitch;
        const z1 = -ny * sinPitch + nz * cosPitch;
        const wx = nx * cosYaw + z1 * sinYaw;
        const wy = y1;
        const wz = -nx * sinYaw + z1 * cosYaw;

        let u = 0.5 + Math.atan2(wx, wz) * invTwoPi;
        // Map v slightly inward at the North Pole so the sphere horizon stays inside our
        // reconstructed North Greenland cap (y >= 39) with zero flat cut-off!
        const rawV = 0.5 + Math.asin(clamp(wy, -1, 1)) * invPi;
        let v = 0.195 + rawV * 0.785;
        u = ((u % 1) + 1) % 1;
        v = clamp(v, 0.195, 0.98);

        // Bilinear texture sampling on _worldNightPixels & _worldReliefPixels
        const fx = u * (mapW - 1);
        const fy = v * (mapH - 1);
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const x1 = Math.min(mapW - 1, x0 + 1);
        const y1Tex = Math.min(mapH - 1, y0 + 1);
        const wx1 = fx - x0;
        const wy1 = fy - y0;
        const wx0 = 1.0 - wx1;
        const wy0 = 1.0 - wy1;

        const w00 = wx0 * wy0;
        const w10 = wx1 * wy0;
        const w01 = wx0 * wy1;
        const w11 = wx1 * wy1;

        const idx00 = (y0 * mapW + x0) * 4;
        const idx10 = (y0 * mapW + x1) * 4;
        const idx01 = (y1Tex * mapW + x0) * 4;
        const idx11 = (y1Tex * mapW + x1) * 4;

        let rCol = srcPixels[idx00] * w00 + srcPixels[idx10] * w10 + srcPixels[idx01] * w01 + srcPixels[idx11] * w11;
        let gCol = srcPixels[idx00 + 1] * w00 + srcPixels[idx10 + 1] * w10 + srcPixels[idx01 + 1] * w01 + srcPixels[idx11 + 1] * w11;
        let bCol = srcPixels[idx00 + 2] * w00 + srcPixels[idx10 + 2] * w10 + srcPixels[idx01 + 2] * w01 + srcPixels[idx11 + 2] * w11;

        const landMask = relPixels
          ? (relPixels[idx00] * w00 + relPixels[idx10] * w10 + relPixels[idx01] * w01 + relPixels[idx11] * w11) / 255.0
          : 0.0;
        const isLand = landMask > 0.35;

        // Boost pinpoint silver-ivory & warm-white city lights cleanly without washing out smooth dark interiors
        const cityLum = Math.max(rCol - 18, gCol - 28, 0);
        if (cityLum > 8) {
          const boost = 1.0 + (cityInt - 1.0) * clamp(cityLum / 75.0, 0.25, 1.0);
          rCol = clamp(rCol * boost, 0, 255);
          gCol = clamp(gCol * boost, 0, 255);
          bCol = clamp(bCol * boost, 0, 255);
        }

        // 1) UPPER-LEFT SUNLIT ATMOSPHERIC TWILIGHT & SUBTLE MATTE SATELLITE MICRO-RELIEF
        //    - Strictly confined to the left sunlit side (leftHemisphereMask: nx < -0.08)
        //      so Scandinavia, Europe, Africa, and Eastern Greenland stay 100% smooth matte dark slate-navy!
        const sunDot2D = nx * limbDirX + ny * limbDirY;
        const leftHemisphereMask = smoothstep(-0.06, -0.36, nx);
        const dirAlign = clamp(sunDot2D / Math.max(0.001, rDist), 0, 1) * leftHemisphereMask;
        const surfaceSunDot = clamp(sunDot2D * 0.85 + (1.0 - nz) * 0.36, 0, 1) * leftHemisphereMask;
        const twilightWrap = Math.pow(surfaceSunDot, 2.15) * clamp(dirAlign + 0.12, 0, 1) * dynamicRimPower;

        if (twilightWrap > 0.004) {
          const rawSlope = relPixels
            ? ((relPixels[idx00 + 1] * w00 + relPixels[idx10 + 1] * w10 + relPixels[idx01 + 1] * w01 + relPixels[idx11 + 1] * w11) - 128.0) / 127.0
            : 0.0;

          // Subtle matte high-frequency rocky relief ONLY inside the far-left sunlit limb (nx < -0.25)
          const limbReliefZone = smoothstep(-0.22, -0.52, nx) * smoothstep(0.28, 0.62, sunDot2D) * landMask * dynamicRimPower;

          // Soft stratospheric cloud wisps over the sunlit upper-left limb
          const cloudNoise = valueNoise2D(u * 28 + globalTimeSec * 0.06, v * 28) * 0.68
            + valueNoise2D(u * 62 - globalTimeSec * 0.04, v * 62) * 0.32;
          const cloudWisp = Math.pow(clamp(cloudNoise, 0, 1), 1.75) * twilightWrap * (1.0 - landMask * 0.35);

          const surfBaseR = lerp(12, 32, landMask);
          const surfBaseG = lerp(38, 72, landMask);
          const surfBaseB = lerp(80, 130, landMask);

          rCol = rCol + surfBaseR * twilightWrap + cloudWisp * 115;
          gCol = gCol + surfBaseG * twilightWrap + cloudWisp * 175;
          bCol = bCol + surfBaseB * twilightWrap + cloudWisp * 230;

          if (limbReliefZone > 0.01) {
            const sunSlopePos = Math.max(0, rawSlope);
            const sunSlopeNeg = Math.max(0, -rawSlope);
            const microShadow = clamp(sunSlopeNeg * 0.45 * limbReliefZone, 0, 0.32);
            rCol *= (1.0 - microShadow);
            gCol *= (1.0 - microShadow);
            bCol *= (1.0 - microShadow * 0.85);

            const microHighlight = sunSlopePos * 0.48 * limbReliefZone;
            rCol += microHighlight * 135;
            gCol += microHighlight * 195;
            bCol += microHighlight * 235;
          }

          rCol = clamp(rCol, 0, 255);
          gCol = clamp(gCol, 0, 255);
          bCol = clamp(bCol, 0, 255);
        }

        // 2) BRILLIANT CYAN-WHITE RAYLEIGH LIMB CRESCENT (Hugs the upper-left horizon edge)
        const angularMask = Math.pow(dirAlign, 1.42);
        const radialLimb = Math.pow(1.0 - nz, limbSharpness);
        const crescentStrength = radialLimb * angularMask * dynamicRimPower;

        if (crescentStrength > 0.003) {
          const whiteCore = Math.pow(clamp((rDist - (1.0 - crescentWidth * 0.62)) / Math.max(0.02, crescentWidth * 0.62), 0, 1), 1.85) * angularMask * dynamicRimPower;
          rCol = clamp(rCol + rimRgb.r * 0.78 * crescentStrength + whiteCore * 245, 0, 255);
          gCol = clamp(gCol + rimRgb.g * 0.94 * crescentStrength + whiteCore * 252, 0, 255);
          bCol = clamp(bCol + rimRgb.b * 1.05 * crescentStrength + whiteCore * 255, 0, 255);
        }

        // 3) CENTRAL EQUATORIAL ATMOSPHERIC SHEEN (Subtle smooth glow in the middle of the globe)
        const centerSheen = Math.pow(nz, 2.8) * (isLand ? 0.14 : 0.08) * rimInt;
        rCol = clamp(rCol + centerSheen * 18, 0, 255);
        gCol = clamp(gCol + centerSheen * 40, 0, 255);
        bCol = clamp(bCol + centerSheen * 74, 0, 255);

        // 4) RIGHT-LIMB WARM CRIMSON-MAGENTA NEBULA BOUNCE & CURVED REFRACTION BAND (Image 4 & Image 5)
        const fresnel = Math.pow(1.0 - nz, 3.2);
        const leftFresnel = clamp(dirAlign * 0.75 + 0.25, 0, 1) * fresnel * 0.56 * rimInt;
        const rightAlign = clamp(nx * 0.92 + ny * 0.22, 0, 1);
        const rightCrimsonRim = Math.pow(rightAlign, 1.6) * fresnel * 0.60 * rimInt;

        rCol = clamp(rCol + leftFresnel * 62 + rightCrimsonRim * 220, 0, 255);
        gCol = clamp(gCol + leftFresnel * 160 + rightCrimsonRim * 40, 0, 255);
        bCol = clamp(bCol + leftFresnel * 232 + rightCrimsonRim * 92, 0, 255);

        // Smooth anti-aliased sphere edge
        const edgeAlpha = rDist > 0.975 ? clamp((1.0 - rDist) / 0.025, 0, 1) : 1.0;

        const outIdx = (py * bufDim + px) * 4;
        gd[outIdx] = Math.round(rCol);
        gd[outIdx + 1] = Math.round(gCol);
        gd[outIdx + 2] = Math.round(bCol);
        gd[outIdx + 3] = Math.round(edgeAlpha * 255);
      }
    }

    gctx.putImageData(gImg, 0, 0);
    ctx.drawImage(_globeRenderCanvas, cx - radius, cy - radius, radius * 2, radius * 2);

    // Crisp cyan-white horizon arc along the upper-left sunlit limb + subtle rose-magenta right limb arc
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = rgbaStr('#e0f2fe', clamp(0.90 * dynamicRimPower, 0.25, 0.98));
    ctx.lineWidth = Math.max(1.5, radius * 0.012);
    ctx.shadowColor = rimCol;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    const arcCenter = Math.atan2(limbDirY, limbDirX);
    ctx.arc(cx, cy, radius * 0.995, arcCenter - Math.PI * 0.44, arcCenter + Math.PI * 0.44);
    ctx.stroke();

    // Subtle warm rose-crimson rim reflection along the right edge (matching Image 3 & Image 4)
    ctx.strokeStyle = rgbaStr('#fb7185', clamp(0.45 * dynamicRimPower, 0.12, 0.65));
    ctx.lineWidth = Math.max(1.2, radius * 0.009);
    ctx.shadowColor = '#e11d48';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.995, -Math.PI * 0.30, Math.PI * 0.32);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // End Globe Alpha

    const hbW = Math.min(w - 16, Math.max(54, radius * 2));
    const hbH = Math.min(h - 16, Math.max(54, radius * 2));
    _lastStageHitBoxes.push({
      id: 'earth_globe_3d',
      label: '3D Spinning Earth Globe',
      scene: globalTimeSec < 2.2 ? 'scene1' : 'scene2',
      x: clamp(cx - hbW * 0.5, 8, w - hbW - 8),
      y: clamp(cy - hbH * 0.5, 8, h - hbH - 8),
      w: hbW,
      h: hbH
    });
  }

  // ==========================================================================
  // 11. ACT 3 & ACT 4: MACRO EUROPE CITY LIGHTS -> CLOUD DIVE -> CAMERA-LOCKED
  //     HERZOGENAURACH SATELLITE ZOOM, GIS BORDER, TILT-SHIFT DOF,
  //     58° TITLE -> HORIZONTAL GHOST WATERMARK & 3D GLASS ADIDAS/PUMA LOGOS
  //     Matches image_364a48a9.png through image_c1794721.png 1:1!
  // ==========================================================================

  // Authentic GIS Municipal Boundary Polygon of Herzogenaurach (Normalized [-0.5..0.5] around town center)
  // Matches the exact elongated cadastral silhouette in image_438c334b.png, image_e16e1d82.png & image_5da88603.png
  const HERZOGENAURACH_BORDER_PTS = [
    [-0.345, -0.018], [-0.318, -0.052], [-0.305, -0.118], [-0.268, -0.126],
    [-0.235, -0.152], [-0.192, -0.138], [-0.154, -0.092], [-0.108, -0.088],
    [-0.064, -0.112], [-0.022, -0.148], [0.018, -0.195],  [0.062, -0.188],
    [0.105, -0.168],  [0.148, -0.212],  [0.198, -0.245],  [0.248, -0.238],
    [0.286, -0.205],  [0.278, -0.152],  [0.295, -0.118],  [0.334, -0.095],
    [0.322, -0.042],  [0.304, -0.005],  [0.342, 0.038],   [0.325, 0.084],
    [0.276, 0.118],   [0.242, 0.156],   [0.188, 0.162],   [0.146, 0.212],
    [0.098, 0.238],   [0.036, 0.246],   [-0.028, 0.252],  [-0.086, 0.232],
    [-0.138, 0.204],  [-0.184, 0.162],  [-0.228, 0.145],  [-0.268, 0.116],
    [-0.292, 0.068],  [-0.316, 0.034]
  ];

  let _herzogCloseAirbusCanvas = null;
  let _herzogCloseAirbusBlurredCanvas = null;

  /**
   * Synthesizes a 100% borderless, high-detail Prussian-blue Airbus aerial satellite plate
   * of Herzogenaurach (Aurach river valley, Bavarian field patchwork, forest groves, arterial
   * roads, and dense town rooftops matching image_5da88603.png & image_c1794721.png) plus its
   * pre-blurred Tilt-Shift Depth-of-Field companion canvas.
   */
  function ensureHerzogenaurachAirbusCleanCanvas() {
    if (_herzogCloseAirbusCanvas && _herzogCloseAirbusBlurredCanvas) return;
    if (typeof document === 'undefined') return;

    const cw = 1280;
    const ch = 720;
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const ctx = c.getContext('2d');

    // 1. Deep Stratospheric Prussian-Blue Aerial Base (Matches Airbus grade in image_5da88603.png & image_c1794721.png)
    const bgGrad = ctx.createRadialGradient(cw * 0.5, ch * 0.5, 40, cw * 0.5, ch * 0.5, cw * 0.72);
    bgGrad.addColorStop(0, '#17375e');
    bgGrad.addColorStop(0.55, '#112949');
    bgGrad.addColorStop(1, '#09182e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cw, ch);

    // 2. Bavarian Agricultural Field Patchwork (Subtle angled parcels in cool slate/Prussian tones)
    ctx.save();
    for (let i = 0; i < 240; i++) {
      const fx = hash1D(i * 13.7 + 1.1) * cw;
      const fy = hash1D(i * 29.3 + 4.7) * ch;
      const fw = 28 + hash1D(i * 41.1) * 95;
      const fh = 16 + hash1D(i * 53.9) * 52;
      const ang = (Math.floor(hash1D(i * 17.3) * 4) * 0.38) - 0.42;
      const distCenter = Math.hypot((fx - cw * 0.5) / cw, (fy - ch * 0.5) / ch);

      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(ang);
      const tone = hash1D(i * 71.2);
      if (tone < 0.32) {
        ctx.fillStyle = distCenter < 0.25 ? 'rgba(34, 72, 115, 0.36)' : 'rgba(22, 52, 88, 0.42)';
      } else if (tone < 0.68) {
        ctx.fillStyle = 'rgba(46, 89, 134, 0.28)';
      } else {
        // Dark spruce forest groves surrounding Herzogenaurach
        ctx.fillStyle = 'rgba(8, 22, 42, 0.58)';
      }
      ctx.fillRect(-fw * 0.5, -fh * 0.5, fw, fh);
      ctx.strokeStyle = 'rgba(125, 172, 218, 0.12)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-fw * 0.5, -fh * 0.5, fw, fh);
      ctx.restore();
    }
    ctx.restore();

    // 3. Winding Aurach River Valley & Riparian Tree Corridor (Dividing North Adidas vs South Puma!)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, ch * 0.54);
    ctx.bezierCurveTo(cw * 0.25, ch * 0.49, cw * 0.44, ch * 0.55, cw * 0.58, ch * 0.51);
    ctx.bezierCurveTo(cw * 0.74, ch * 0.47, cw * 0.88, ch * 0.52, cw, ch * 0.48);
    ctx.strokeStyle = 'rgba(8, 20, 39, 0.85)';
    ctx.lineWidth = 18;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(56, 118, 176, 0.55)';
    ctx.lineWidth = 4.5;
    ctx.stroke();
    ctx.restore();

    // 4. Primary Arterial Roads, A3 Autobahn (Right Flank) & Herzogenaurach Street Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 189, 228, 0.34)';
    ctx.lineWidth = 2.4;
    // A3 motorway cutting NW-to-SE on the eastern edge
    ctx.beginPath();
    ctx.moveTo(cw * 0.68, 0);
    ctx.lineTo(cw * 0.92, ch);
    ctx.stroke();

    // Radial & grid town streets converging on Herzogenaurach center
    const roadAngles = [-0.45, -0.12, 0.18, 0.58, 1.12, 1.65, 2.35, 2.88];
    roadAngles.forEach((ra, idx) => {
      ctx.beginPath();
      ctx.moveTo(cw * 0.5, ch * 0.5);
      const len = cw * 0.48;
      ctx.lineTo(
        cw * 0.5 + Math.cos(ra) * len,
        ch * 0.5 + Math.sin(ra) * len * 0.75
      );
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(165, 204, 240, 0.32)' : 'rgba(118, 162, 206, 0.22)';
      ctx.lineWidth = idx % 2 === 0 ? 1.8 : 1.1;
      ctx.stroke();
    });
    ctx.restore();

    // 5. Dense Herzogenaurach Urban Rooftops, Industrial Campuses (Adidas North / Puma South) & Courtyards
    ctx.save();
    for (let b = 0; b < 1350; b++) {
      const u1 = Math.max(0.001, hash1D(b * 19.3 + 2.7));
      const u2 = hash1D(b * 31.7 + 5.3);
      const rGauss = Math.min(1.35, Math.sqrt(-2.0 * Math.log(u1)) * 0.34);
      const theta = u2 * Math.PI * 2;
      const bx = cw * 0.50 + Math.cos(theta) * (cw * 0.38) * rGauss;
      const by = ch * 0.50 + Math.sin(theta) * (ch * 0.32) * rGauss;

      const bw = 3.5 + hash1D(b * 43.1) * (rGauss < 0.35 ? 11.5 : 7.5);
      const bh = 2.8 + hash1D(b * 61.7) * (rGauss < 0.35 ? 8.5 : 5.5);
      const bang = ((b % 5) - 2) * 0.18;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(bang);

      const roofType = hash1D(b * 83.9);
      if (roofType < 0.28) {
        // Cool sunlit white/silver commercial & campus rooftops
        ctx.fillStyle = 'rgba(204, 226, 246, 0.72)';
      } else if (roofType < 0.58) {
        // Muted terracotta-rose pitched Bavarian roofs through blue atmospheric haze
        ctx.fillStyle = 'rgba(138, 128, 156, 0.62)';
      } else if (roofType < 0.84) {
        // Slate-blue residential blocks
        ctx.fillStyle = 'rgba(84, 126, 172, 0.65)';
      } else {
        // Deep courtyard shadow
        ctx.fillStyle = 'rgba(10, 25, 48, 0.78)';
      }
      ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
      ctx.restore();
    }
    ctx.restore();

    _herzogCloseAirbusCanvas = c;

    // 6. Pre-render the blurred exterior Tilt-Shift Depth-of-Field companion canvas
    const bc = document.createElement('canvas');
    bc.width = cw;
    bc.height = ch;
    const bctx = bc.getContext('2d');
    try {
      bctx.filter = 'blur(8px)';
      bctx.drawImage(c, -12, -12, cw + 24, ch + 24);
      bctx.filter = 'none';
    } catch (_) {
      // Multi-tap radial box blur fallback if ctx.filter is unavailable
      bctx.globalAlpha = 0.25;
      const offsets = [[-6, -4], [6, -4], [-6, 4], [6, 4], [0, -7], [0, 7], [-7, 0], [7, 0]];
      offsets.forEach(([ox, oy]) => bctx.drawImage(c, ox, oy, cw, ch));
      bctx.globalAlpha = 1.0;
    }
    // Add subtle cool Prussian depth-of-field peripheral darkening
    const vig = bctx.createRadialGradient(cw * 0.5, ch * 0.5, cw * 0.16, cw * 0.5, ch * 0.5, cw * 0.62);
    vig.addColorStop(0, 'rgba(8, 20, 40, 0)');
    vig.addColorStop(1, 'rgba(5, 13, 28, 0.42)');
    bctx.fillStyle = vig;
    bctx.fillRect(0, 0, cw, ch);

    _herzogCloseAirbusBlurredCanvas = bc;
  }

  /**
   * Builds a Canvas2D path for the Herzogenaurach municipal boundary polygon
   * in screen space given center (cx, cy) and half-extents (radW, radH).
   */
  function traceHerzogenaurachPolygonPath(ctx, cx, cy, radW, radH) {
    ctx.beginPath();
    for (let i = 0; i < HERZOGENAURACH_BORDER_PTS.length; i++) {
      const pt = HERZOGENAURACH_BORDER_PTS[i];
      const px = cx + pt[0] * radW * 2.0;
      const py = cy + pt[1] * radH * 2.0;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function renderMacroEuropeAndCloudDiveToGoogleEarth(ctx, w, h, globalTimeSec, cfg) {
    if (globalTimeSec < 4.94) return;
    ensureWorldMapCanvases();
    ensureHerzogenaurachAirbusCleanCanvas();

    const macroEnterAlpha = smoothstep(4.94, 5.18, globalTimeSec);
    // Keep night city lights visible longer so they sparkle through the dark storm clouds at 6.5s-7.8s (Image 6)!
    const dayTransition = smoothstep(7.50, 8.85, globalTimeSec);
    const macroMode = cfg.macroMapMode || 'photographic_authentic';
    const satScale = clamp(Number(cfg.satelliteScale ?? 1.0), 0.5, 2.2);
    const satOffX = Number(cfg.satelliteOffsetX || 0);
    const satOffY = Number(cfg.satelliteOffsetY || 0);

    ctx.save();
    ctx.globalAlpha = macroEnterAlpha;

    // ------------------------------------------------------------------------
    // STAGE 1: MACRO EUROPE NIGHT CITY LIGHTS & WARM GOLDEN-YELLOWISH GLOW (4.94s – 8.85s)
    // ------------------------------------------------------------------------
    if (dayTransition < 0.99 && macroMode !== 'continual_3d_globe') {
      const nightZoom = (1.0 + easeInCubic(clamp((globalTimeSec - 5.05) / 3.6, 0, 1)) * 1.42) * satScale;
      const focusX = w * 0.51 - satOffX;
      const focusY = h * 0.56 - satOffY;

      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.scale(nightZoom, nightZoom);
      ctx.translate(-focusX, -focusY);

      const euPlateRec = getLoadedImage(REFERENCE_PLATES.act3EuropeLights);
      const usePhotoPlate = macroMode === 'photographic_authentic'
        && euPlateRec
        && euPlateRec.loaded
        && (cfg.globeTargetRegion || 'europe_germany') === 'europe_germany';

      if (usePhotoPlate) {
        ctx.drawImage(euPlateRec.img, 0, 0, w, h);
      } else if (_europeMacroCanvas) {
        ctx.drawImage(_europeMacroCanvas, 0, 0, w, h);
      }

      // WARM GOLDEN-YELLOWISH TERRITORIAL HIGHLIGHT COVERING CENTRAL EUROPE / GERMANY
      if (cfg.regionHighlightEnabled !== false && globalTimeSec > 4.95) {
        const regAlpha = smoothstep(4.95, 5.85, globalTimeSec) * (1 - dayTransition * 0.85);
        const hiCol = cfg.regionHighlightColor || '#fde047';

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const hzGrad = ctx.createRadialGradient(w * 0.515, h * 0.562, 4, w * 0.515, h * 0.562, w * 0.21);
        hzGrad.addColorStop(0, rgbaStr('#ffffff', 0.42 * regAlpha));
        hzGrad.addColorStop(0.25, rgbaStr('#fef08a', 0.52 * regAlpha));
        hzGrad.addColorStop(0.58, rgbaStr(hiCol, 0.34 * regAlpha));
        hzGrad.addColorStop(0.85, rgbaStr('#f59e0b', 0.14 * regAlpha));
        hzGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = hzGrad;
        ctx.beginPath();
        ctx.arc(w * 0.515, h * 0.562, w * 0.21, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = rgbaStr('#fde047', 0.28 * regAlpha);
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(w * 0.515, h * 0.562, w * 0.085, h * 0.068, -0.18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Encroaching dark storm cloud shadow bank entering from the right
      if (globalTimeSec > 5.35) {
        const shadowBankAlpha = smoothstep(5.35, 6.5, globalTimeSec) * (1 - dayTransition) * 0.82;
        const sGrad = ctx.createRadialGradient(w * 0.78, h * 0.62, 10, w * 0.78, h * 0.62, w * 0.35);
        sGrad.addColorStop(0, `rgba(3, 6, 14, ${shadowBankAlpha.toFixed(3)})`);
        sGrad.addColorStop(0.6, `rgba(5, 9, 19, ${(shadowBankAlpha * 0.58).toFixed(3)})`);
        sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sGrad;
        ctx.fillRect(w * 0.38, h * 0.22, w * 0.62, h * 0.78);
      }

      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // STAGE 2: CAMERA-LOCKED MULTI-LOD GOOGLE EARTH -> AIRBUS HERZOGENAURACH ZOOM (7.50s – 12.0s)
    //          Matches Frames 1–9 (`image_364a48a9.png` -> `image_c1794721.png`)
    // ------------------------------------------------------------------------
    const act4Progress = clamp((globalTimeSec - 7.55) / 4.45, 0, 1);
    // Exponential camera zoom curve: starts wide at 7.55s (polygon ~14% of width),
    // accelerates smoothly through 8.5s–10.3s (polygon ~68% of width in image_5da88603.png),
    // and pushes in to ~1.18x town macro for the climax adidas/PUMA reveal at 10.5s–12.0s (image_c1794721.png).
    const zoomCurve01 = easeInOutCubic(clamp((globalTimeSec - 7.55) / 3.15, 0, 1)) * 0.82
      + smoothstep(10.2, 12.0, globalTimeSec) * 0.26;
    const camZoom = (1.0 + zoomCurve01 * 4.65) * satScale;
    const mapCenterX = w * 0.5 + satOffX;
    const mapCenterY = h * 0.5 + satOffY;

    // Polygon screen-space half-extents locked to the shared camera zoom matrix
    const bScale = clamp(Number(cfg.herzogBorderScale ?? 1.0), 0.35, 2.5);
    const bOffX = Number(cfg.herzogBorderOffsetX || 0);
    const bOffY = Number(cfg.herzogBorderOffsetY || 0);
    const polyCx = mapCenterX + bOffX;
    const polyCy = mapCenterY + bOffY;
    const polyRadW = w * 0.082 * camZoom * bScale;
    const polyRadH = h * 0.095 * camZoom * bScale;

    if (dayTransition > 0.01) {
      const mapSourceMode = cfg.act4MapSourceMode || 'multi_lod_authentic';
      ctx.save();
      ctx.globalAlpha = macroEnterAlpha * dayTransition;

      if (mapSourceMode === 'ai_drone_video') {
        // Optional Mode 1: User's uploaded AI Aerial Drone Video (`gemini_generated_video_...mp4`) synced to timeline!
        const vidEl = getSyncedAiDroneVideoElement(act4Progress);
        ctx.translate(mapCenterX, mapCenterY);
        ctx.scale(satScale, satScale);
        ctx.translate(-w * 0.5, -h * 0.5);
        if (vidEl) {
          ctx.drawImage(vidEl, 0, 0, w, h);
        } else if (_herzogCloseAirbusCanvas) {
          ctx.drawImage(_herzogCloseAirbusCanvas, 0, 0, w, h);
        }
      } else if (mapSourceMode === 'reference_sequence_plates') {
        // Optional Mode 2: Cross-dissolve the 9 original documentary reference frames directly
        const refKeys = [
          { t: 7.55, key: 'act4Frame1Clouds' },
          { t: 7.95, key: 'act4Frame2Clouds' },
          { t: 8.35, key: 'act4Frame3Border' },
          { t: 8.75, key: 'act4Frame4Border' },
          { t: 9.15, key: 'act4Frame5Label' },
          { t: 9.55, key: 'act4Frame6Tilt' },
          { t: 9.90, key: 'act4Frame7Tilt' },
          { t: 10.25, key: 'act4Frame8Close' },
          { t: 10.85, key: 'act4Frame9Climax' }
        ];
        let prevSpec = refKeys[0];
        let nextSpec = refKeys[refKeys.length - 1];
        for (let i = 0; i < refKeys.length - 1; i++) {
          if (globalTimeSec >= refKeys[i].t && globalTimeSec <= refKeys[i + 1].t) {
            prevSpec = refKeys[i];
            nextSpec = refKeys[i + 1];
            break;
          }
        }
        const blend = prevSpec === nextSpec ? 0 : smoothstep(prevSpec.t, nextSpec.t, globalTimeSec);
        const recA = getLoadedImage(REFERENCE_PLATES[prevSpec.key]);
        const recB = getLoadedImage(REFERENCE_PLATES[nextSpec.key]);
        ctx.translate(mapCenterX, mapCenterY);
        ctx.scale(satScale, satScale);
        ctx.translate(-w * 0.5, -h * 0.5);
        if (recA && recA.loaded) {
          ctx.drawImage(recA.img, 0, 0, w, h);
        }
        if (recB && recB.loaded && blend > 0.01) {
          ctx.globalAlpha = macroEnterAlpha * dayTransition * blend;
          ctx.drawImage(recB.img, 0, 0, w, h);
        }
      } else {
        // Default Mode ('multi_lod_authentic' or 'custom_uploaded'):
        // 100% Clean, Borderless Multi-LOD Google Earth Landsat -> Airbus Prussian-Blue Town Zoom!
        const customSatRec = cfg.customSatelliteMapUrl ? getLoadedImage(cfg.customSatelliteMapUrl) : null;
        const wideLandsatRec = getLoadedImage(REFERENCE_PLATES.act4GoogleEarthSat);
        const closeAirbusTransition = smoothstep(8.25, 9.55, globalTimeSec);

        // Layer 2A: Wide Google Earth Landsat Plate (Zooming from 1.0x to 2.6x)
        if (closeAirbusTransition < 0.99) {
          const wideZoom = (1.0 + zoomCurve01 * 1.65) * satScale;
          ctx.save();
          ctx.translate(mapCenterX, mapCenterY);
          ctx.scale(wideZoom, wideZoom);
          ctx.translate(-w * 0.5, -h * 0.5);
          if (customSatRec && customSatRec.loaded) {
            ctx.drawImage(customSatRec.img, 0, 0, w, h);
          } else if (wideLandsatRec && wideLandsatRec.loaded) {
            ctx.drawImage(wideLandsatRec.img, 0, 0, w, h);
          } else if (_worldDaySatelliteCanvas) {
            ctx.drawImage(_worldDaySatelliteCanvas, 0, 0, w, h);
          }
          ctx.restore();
        }

        // Layer 2B: High-Detail Borderless Airbus Prussian-Blue Herzogenaurach Aerial Plate (8.25s – 12.0s)
        if (closeAirbusTransition > 0.01 && _herzogCloseAirbusCanvas) {
          const closeZoom = (0.72 + zoomCurve01 * 0.85) * satScale;
          ctx.save();
          ctx.globalAlpha = macroEnterAlpha * dayTransition * closeAirbusTransition;
          ctx.translate(mapCenterX, mapCenterY);
          ctx.scale(closeZoom, closeZoom);
          ctx.translate(-w * 0.5, -h * 0.5);
          if (customSatRec && customSatRec.loaded) {
            ctx.drawImage(customSatRec.img, 0, 0, w, h);
          } else {
            ctx.drawImage(_herzogCloseAirbusCanvas, 0, 0, w, h);
          }
          ctx.restore();

          // Layer 2C: Exterior Radial Tilt-Shift Depth-of-Field Blur outside the Herzogenaurach Polygon
          // Matches image_438c334b.png, image_e16e1d82.png & image_5da88603.png where the exterior outside
          // the municipal border is softly blurred while the interior of Herzogenaurach stays razor-sharp!
          if (cfg.herzogTiltShiftBlurEnabled !== false && _herzogCloseAirbusBlurredCanvas && !customSatRec) {
            const dofEnter = smoothstep(8.55, 9.35, globalTimeSec);
            const dofExit = 1.0 - smoothstep(10.45, 11.25, globalTimeSec) * 0.55;
            const dofAlpha = clamp(dofEnter * dofExit * Number(cfg.herzogTiltShiftIntensity ?? 1.15), 0, 1);

            if (dofAlpha > 0.02) {
              ctx.save();
              ctx.globalAlpha = macroEnterAlpha * dayTransition * dofAlpha;
              // Use even-odd clipping path: outer canvas rectangle minus the Herzogenaurach municipal polygon!
              ctx.beginPath();
              ctx.rect(0, 0, w, h);
              traceHerzogenaurachPolygonPath(ctx, polyCx, polyCy, polyRadW, polyRadH);
              ctx.clip('evenodd');

              ctx.translate(mapCenterX, mapCenterY);
              ctx.scale(closeZoom, closeZoom);
              ctx.translate(-w * 0.5, -h * 0.5);
              ctx.drawImage(_herzogCloseAirbusBlurredCanvas, 0, 0, w, h);
              ctx.restore();
            }
          }
        }
      }

      if (cfg.satelliteTerrainStyle === 'tactical_dark') {
        ctx.fillStyle = 'rgba(6, 12, 26, 0.58)';
        ctx.fillRect(0, 0, w, h);
      } else if (cfg.satelliteTerrainStyle === 'emerald_topo') {
        ctx.fillStyle = 'rgba(6, 78, 59, 0.28)';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // STAGE 3: CAMERA-LOCKED HERZOGENAURACH GIS VECTOR BORDER, 58° TITLE ->
    //          HORIZONTAL GHOST WATERMARK & 3D GLASS ADIDAS/PUMA LOGOS
    // ------------------------------------------------------------------------
    if (dayTransition > 0.05 && (cfg.act4MapSourceMode || 'multi_lod_authentic') !== 'reference_sequence_plates') {
      renderHerzogenaurachBorderTitleAndLogos(ctx, w, h, globalTimeSec, dayTransition, {
        mapCenterX,
        mapCenterY,
        camZoom,
        polyCx,
        polyCy,
        polyRadW,
        polyRadH
      }, cfg);
    }

    // ------------------------------------------------------------------------
    // STAGE 4: VOLUMETRIC STRATOSPHERIC CLOUD BREAKTHROUGH (5.65s – 10.2s)
    // ------------------------------------------------------------------------
    if (globalTimeSec > 5.65) {
      renderStratosphericClouds(ctx, w, h, globalTimeSec, dayTransition, cfg);
    }

    // ------------------------------------------------------------------------
    // STAGE 5: GOOGLE EARTH ATTRIBUTION WATERMARK (Bottom-Right)
    //          Automatically updates subtext from 'Landsat / Copernicus...' to 'Airbus' at low altitude!
    // ------------------------------------------------------------------------
    if (cfg.showGoogleEarthWatermark !== false && globalTimeSec > 7.75) {
      const wmAlpha = smoothstep(7.75, 8.45, globalTimeSec);
      ctx.save();
      ctx.globalAlpha = wmAlpha * 0.92;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(241, 245, 249, 0.94)';
      ctx.font = `600 ${Math.round(h * 0.033)}px 'Inter', -apple-system, sans-serif`;
      ctx.fillText(cfg.googleEarthWatermarkText || 'Google Earth', w - 22, h - 26);

      ctx.fillStyle = 'rgba(226, 232, 240, 0.80)';
      ctx.font = `400 ${Math.round(h * 0.0155)}px 'Inter', -apple-system, sans-serif`;
      const defaultSub = globalTimeSec > 9.25 ? 'Airbus' : 'Landsat / Copernicus, Data SIO, NOAA';
      const subTextToUse = (cfg.googleEarthSubText && cfg.googleEarthSubText !== 'Landsat / Copernicus, Data SIO, NOAA')
        ? cfg.googleEarthSubText
        : defaultSub;
      ctx.fillText(subTextToUse, w - 22, h - 11);
      ctx.restore();
    }

    ctx.restore();

    _lastStageHitBoxes.push({
      id: 'satellite_map_plate',
      label: globalTimeSec < 7.6 ? 'Europe City Lights Macro' : 'Google Earth Satellite Map',
      scene: globalTimeSec < 7.6 ? 'scene3' : 'scene4',
      isBackgroundLayer: true,
      x: clamp(w * 0.08 + satOffX, 8, w * 0.4),
      y: clamp(h * 0.08 + satOffY, 8, h * 0.4),
      w: clamp(w * 0.84 * satScale, 160, w - 16),
      h: clamp(h * 0.84 * satScale, 120, h - 16)
    });
  }

  function resolveLogoSource(cfg, side) {
    if (side === 'left') {
      if (cfg.leftLogoPreset === 'puma') return DEFAULT_LOGO_URIS.pumaLogo;
      if (cfg.leftLogoPreset === 'nike') return DEFAULT_LOGO_URIS.nikeLogo;
      if (cfg.leftLogoPreset === 'apple') return DEFAULT_LOGO_URIS.appleLogo;
      return cfg.leftLogoUrl || DEFAULT_LOGO_URIS.adidasLogo;
    }
    if (cfg.rightLogoPreset === 'adidas') return DEFAULT_LOGO_URIS.adidasLogo;
    if (cfg.rightLogoPreset === 'nike') return DEFAULT_LOGO_URIS.nikeLogo;
    if (cfg.rightLogoPreset === 'apple') return DEFAULT_LOGO_URIS.appleLogo;
    return cfg.rightLogoUrl || DEFAULT_LOGO_URIS.pumaLogo;
  }

  /**
   * Renders the decomposed, camera-locked graphic telemetry & brand overlays in Act 4:
   * 1) Herzogenaurach GIS Vector Municipal Border (`herzog_municipal_border`) — traces in, stays
   *    razor-sharp at constant screen-space width across the zoom, and fades out cleanly at 10.35s–10.95s.
   * 2) Coordinate-Locked 58° `HERZOGENAURACH` Title -> Full-Width Horizontal Ghost Watermark (`herzog_region_title`).
   * 3) Giant Translucent 3D-Extruded `adidas` (Left) and `PUMA` (Right) Territorial Watermarks (`image_c1794721.png`).
   */
  function renderHerzogenaurachBorderTitleAndLogos(ctx, w, h, globalTimeSec, dayTransition, camState, cfg) {
    const { polyCx, polyCy, polyRadW, polyRadH, camZoom } = camState;

    // ------------------------------------------------------------------------
    // 1. TRUE GIS VECTOR MUNICIPAL BORDER OF HERZOGENAURACH (7.60s – 11.0s)
    //    Fades out cleanly as adidas & PUMA materialize in Frame 9 (image_c1794721.png)
    // ------------------------------------------------------------------------
    const borderFadeIn = smoothstep(7.58, 7.95, globalTimeSec);
    const borderFadeOut = 1.0 - smoothstep(10.32, 10.98, globalTimeSec);
    const borderAlpha = clamp(borderFadeIn * borderFadeOut * dayTransition, 0, 1);

    if (cfg.herzogBorderEnabled !== false && borderAlpha > 0.01) {
      const strokeW = clamp(Number(cfg.herzogBorderWidthPx ?? 2.8), 1.0, 10.0);
      const borderCol = cfg.herzogBorderColor || '#ffffff';
      const glowCol = cfg.herzogBorderGlowColor || '#7dd3fc';
      const drawProgress = smoothstep(7.60, 8.35, globalTimeSec);

      ctx.save();
      ctx.globalAlpha = borderAlpha;
      traceHerzogenaurachPolygonPath(ctx, polyCx, polyCy, polyRadW, polyRadH);

      // Subtle interior atmospheric highlight during the mid-altitude tilt-shift frames
      const interiorFillAlpha = smoothstep(8.6, 9.6, globalTimeSec) * borderFadeOut * 0.08;
      if (interiorFillAlpha > 0.005) {
        ctx.fillStyle = rgbaStr(glowCol, interiorFillAlpha);
        ctx.fill();
      }

      // Animated perimeter laser-trace draw-on in early Act 4
      if (drawProgress < 0.999) {
        const approxPerim = (polyRadW + polyRadH) * 4.8;
        ctx.setLineDash([approxPerim * drawProgress, approxPerim * 2]);
      }

      // Outer stratospheric cyan-white bloom
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = rgbaStr(glowCol, 0.55);
      ctx.lineWidth = strokeW * 2.4;
      ctx.shadowColor = glowCol;
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Razor-sharp core white municipal boundary line
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = strokeW;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.restore();

      const hbW = clamp(polyRadW * 2.05, 64, w - 24);
      const hbH = clamp(polyRadH * 2.05, 52, h - 24);
      _lastStageHitBoxes.push({
        id: 'herzog_municipal_border',
        label: 'Herzogenaurach Municipal Border',
        scene: 'scene4',
        x: clamp(polyCx - hbW * 0.5, 8, w - hbW - 8),
        y: clamp(polyCy - hbH * 0.5, 8, h - hbH - 8),
        w: hbW,
        h: hbH
      });
    }

    // ------------------------------------------------------------------------
    // 2. COORDINATE-LOCKED 58° 'HERZOGENAURACH' TITLE -> HORIZONTAL GHOST WATERMARK
    //    - 7.70s – 10.65s: Rotated at +58° NW-to-SE inside the municipal border, scaling
    //      organically with camZoom from a tiny diagonal white dash (image_c041b82b.png)
    //      into a bold headline (image_5da88603.png).
    //    - 10.25s – 12.0s: Cross-dissolves into the giant horizontal ghost watermark
    //      spanning the middle of the town behind adidas & PUMA (Middle Green Arrow in image_c1794721.png)!
    // ------------------------------------------------------------------------
    const titleText = String(cfg.herzogTitleText || 'HERZOGENAURACH').toUpperCase();
    const titleCol = cfg.herzogTitleColor || '#ffffff';
    const titleScale = clamp(Number(cfg.herzogTitleScale ?? 1.0), 0.35, 2.5);
    const titleOffX = Number(cfg.herzogTitleOffsetX || 0);
    const titleOffY = Number(cfg.herzogTitleOffsetY || 0);
    const titleCx = polyCx + titleOffX;
    const titleCy = polyCy + titleOffY;

    if (cfg.herzogTitleEnabled !== false) {
      // Phase 2A: Tilted 58° Map-Locked Label (7.70s – 10.75s)
      const tiltedFadeIn = smoothstep(7.68, 8.15, globalTimeSec);
      const tiltedFadeOut = 1.0 - smoothstep(10.28, 10.88, globalTimeSec);
      const tiltedAlpha = clamp(tiltedFadeIn * tiltedFadeOut * dayTransition, 0, 1);

      if (tiltedAlpha > 0.01) {
        const angleRad = (Number(cfg.herzogTitleAngleDeg ?? 58) * Math.PI) / 180;
        const scaledFontPx = clamp(w * 0.0048 * camZoom * titleScale, 4.5, 58);

        ctx.save();
        ctx.globalAlpha = tiltedAlpha;
        ctx.translate(titleCx, titleCy);
        ctx.rotate(angleRad);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // At very high altitude (7.7s – 8.55s, image_94f54734.png -> image_c041b82b.png),
        // the tiny diagonal text also has a crisp glowing core so it reads as that signature diagonal white sliver!
        if (scaledFontPx < 10.5) {
          const sliverLen = Math.max(12, scaledFontPx * 5.2);
          ctx.strokeStyle = titleCol;
          ctx.lineWidth = Math.max(1.6, scaledFontPx * 0.32);
          ctx.shadowColor = '#7dd3fc';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(-sliverLen * 0.5, 0);
          ctx.lineTo(sliverLen * 0.5, 0);
          ctx.stroke();
        }

        ctx.font = `800 ${scaledFontPx.toFixed(1)}px 'Inter', 'Helvetica Neue', Arial, sans-serif`;
        ctx.shadowColor = 'rgba(6, 18, 38, 0.78)';
        ctx.shadowBlur = Math.max(4, scaledFontPx * 0.35);
        ctx.shadowOffsetY = Math.max(1, scaledFontPx * 0.08);
        ctx.fillStyle = titleCol;
        if (typeof ctx.letterSpacing !== 'undefined') {
          ctx.letterSpacing = `${(scaledFontPx * 0.04).toFixed(1)}px`;
        }
        ctx.fillText(titleText, 0, 0);
        ctx.restore();
      }

      // Phase 2B: Giant Horizontal Ghost Watermark across the Center of Herzogenaurach (10.25s – 12.0s)
      // Matches the Middle Green Arrow in image_c1794721.png!
      const ghostFadeIn = smoothstep(10.25, 10.95, globalTimeSec);
      const ghostMaxOp = clamp(Number(cfg.herzogGhostWatermarkOpacity ?? 0.22), 0.04, 0.75);
      const ghostAlpha = clamp(ghostFadeIn * dayTransition * ghostMaxOp, 0, 1);

      if (cfg.herzogGhostWatermarkEnabled !== false && ghostAlpha > 0.008) {
        const ghostGrow = 0.94 + smoothstep(10.25, 12.0, globalTimeSec) * 0.08;
        const ghostFontPx = Math.round(w * 0.076 * titleScale * ghostGrow);
        const ghostX = w * 0.5 + titleOffX;
        const ghostY = h * 0.445 + titleOffY;

        ctx.save();
        ctx.translate(ghostX, ghostY);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${ghostFontPx}px 'Inter', 'Helvetica Neue', Arial, sans-serif`;
        if (typeof ctx.letterSpacing !== 'undefined') {
          ctx.letterSpacing = `${Math.round(ghostFontPx * 0.055)}px`;
        }

        // Subtle 3D Prussian-navy depth shadow under the ghosted horizontal letters
        ctx.globalAlpha = ghostAlpha * 0.65;
        ctx.fillStyle = 'rgba(6, 18, 38, 0.75)';
        ctx.fillText(titleText, -3, 4);

        // Soft screen-blended white ghost watermark across the town rooftops
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = ghostAlpha;
        ctx.shadowColor = 'rgba(186, 230, 253, 0.45)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = titleCol;
        ctx.fillText(titleText, 0, 0);
        ctx.restore();
      }

      // Hitbox for selecting & dragging the HERZOGENAURACH title / ghost watermark on stage
      const isGhostPhase = globalTimeSec >= 10.35;
      const thW = isGhostPhase ? clamp(w * 0.76 * titleScale, 180, w - 24) : clamp(polyRadW * 1.45 * titleScale, 90, w * 0.65);
      const thH = isGhostPhase ? clamp(h * 0.14 * titleScale, 48, h * 0.35) : clamp(polyRadH * 0.95 * titleScale, 44, h * 0.45);
      const boxCx = isGhostPhase ? (w * 0.5 + titleOffX) : titleCx;
      const boxCy = isGhostPhase ? (h * 0.445 + titleOffY) : titleCy;
      _lastStageHitBoxes.push({
        id: 'herzog_region_title',
        label: 'HERZOGENAURACH Region Title',
        scene: 'scene4',
        x: clamp(boxCx - thW * 0.5, 8, w - thW - 8),
        y: clamp(boxCy - thH * 0.5, 8, h - thH - 8),
        w: thW,
        h: thH
      });
    }

    // ------------------------------------------------------------------------
    // 3. GIANT TRANSLUCENT 3D-EXTRUDED 'adidas' (LEFT) & 'PUMA' (RIGHT) TERRITORIAL
    //    WATERMARKS OVER HERZOGENAURACH (10.30s – 12.0s, Left & Right Green Arrows in image_c1794721.png)
    // ------------------------------------------------------------------------
    if (cfg.act4TerritorialLogosEnabled !== false && globalTimeSec > 10.22) {
      const logoReveal = smoothstep(10.25, 11.10, globalTimeSec);
      const logoDriftScale = (0.93 + easeOutCubic(clamp((globalTimeSec - 10.25) / 1.75, 0, 1)) * 0.09)
        * clamp(Number(cfg.act4TerritorialLogoScale ?? 1.0), 0.4, 2.2);
      const baseOp = clamp(Number(cfg.act4TerritorialLogoOpacity ?? 0.36), 0.08, 0.95);
      const depth3D = clamp(Number(cfg.act4TerritorialLogo3DDepth ?? 1.15), 0.0, 2.5);

      const leftSrc = resolveLogoSource(cfg, 'left');
      const rightSrc = resolveLogoSource(cfg, 'right');
      const leftRec = leftSrc ? getLoadedImage(leftSrc) : null;
      const rightRec = rightSrc ? getLoadedImage(rightSrc) : null;

      const draw3DGlassTerritorialLogo = (imgRec, srcKey, removeBg, centerX, centerY, maxW, maxH, userScale, hitId, hitLabel) => {
        if (!imgRec || !imgRec.loaded) return;
        const drawable = getBgRemovedLogoCanvas(imgRec, srcKey, removeBg);
        if (!drawable) return;

        const targetW = maxW * logoDriftScale * userScale;
        const targetH = maxH * logoDriftScale * userScale;
        const rect = computeContainRect(drawable, centerX, centerY, targetW, targetH);

        ctx.save();
        // Pass 1: 3D Extruded Bevel Shadow (gives the white letters physical 3D thickness over the rooftops!)
        if (depth3D > 0.05) {
          const steps = 4;
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = clamp(logoReveal * baseOp * 0.42 * depth3D, 0, 0.65);
          for (let s = steps; s >= 1; s--) {
            const ox = -s * 1.4 * depth3D;
            const oy = s * 1.6 * depth3D;
            ctx.drawImage(drawable, rect.x + ox, rect.y + oy, rect.w, rect.h);
          }
        }

        // Pass 2: Translucent Screen + Source-Over Glass Blend so Herzogenaurach rooftops shine through
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = clamp(logoReveal * baseOp * 0.92, 0, 0.95);
        ctx.shadowColor = 'rgba(186, 230, 253, 0.38)';
        ctx.shadowBlur = 18;
        ctx.drawImage(drawable, rect.x, rect.y, rect.w, rect.h);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = clamp(logoReveal * baseOp * 0.46, 0, 0.85);
        ctx.drawImage(drawable, rect.x, rect.y, rect.w, rect.h);
        ctx.restore();

        _lastStageHitBoxes.push({
          id: hitId,
          label: hitLabel,
          scene: 'scene4',
          x: clamp(rect.x, 8, w - rect.w - 8),
          y: clamp(rect.y, 8, h - rect.h - 8),
          w: clamp(rect.w, 64, w - 16),
          h: clamp(rect.h, 48, h - 16)
        });
      };

      if (!cfg.leftLogoRemoved && leftRec) {
        const lx = w * 0.285 + Number(cfg.leftLogoOffsetX || 0);
        const ly = h * 0.545 + Number(cfg.leftLogoOffsetY || 0);
        draw3DGlassTerritorialLogo(
          leftRec,
          leftSrc,
          cfg.leftLogoRemoveBg !== false,
          lx,
          ly,
          w * 0.34,
          h * 0.40,
          clamp(Number(cfg.leftLogoScale ?? 1.0), 0.35, 2.2),
          'left_logo_adidas',
          'Left Brand Logo (Adidas Watermark)'
        );
      }

      if (!cfg.rightLogoRemoved && rightRec) {
        const rx = w * 0.720 + Number(cfg.rightLogoOffsetX || 0);
        const ry = h * 0.525 + Number(cfg.rightLogoOffsetY || 0);
        draw3DGlassTerritorialLogo(
          rightRec,
          rightSrc,
          cfg.rightLogoRemoveBg !== false,
          rx,
          ry,
          w * 0.35,
          h * 0.40,
          clamp(Number(cfg.rightLogoScale ?? 1.0), 0.35, 2.2),
          'right_logo_puma',
          'Right Brand Logo (PUMA Watermark)'
        );
      }
    }
  }

  /**
   * Renders the Act 3 -> Act 4 stratospheric cloud dive:
   * - Phase A (5.65s – 8.3s): High-contrast dark storm clouds backlit by warm golden-white city lights.
   * - Phase B (7.25s – 9.6s): Sunlit white stratospheric cloud ring parting radially outward toward
   *   the upper-left and lower-right corners (`image_364a48a9.png` -> `image_c041b82b.png`).
   */
  function renderStratosphericClouds(ctx, w, h, globalTimeSec, dayTransition, cfg) {
    const density = clamp(Number(cfg.cloudDiveDensity ?? 1.15), 0.2, 2.5);
    const spd = clamp(Number(cfg.cloudDiveSpeed ?? 1.15), 0.2, 3.0);

    ctx.save();

    // Phase A: High-contrast dark storm clouds backlit by warm golden-white city lights (5.65s – 8.15s)
    const darkCloudBell = Math.sin(clamp((globalTimeSec - 5.65) / 2.50, 0, 1) * Math.PI);
    if (darkCloudBell > 0.02) {
      const darkPlateRec = getLoadedImage(REFERENCE_PLATES.act4DarkStormClouds);
      const darkZoom = 1.0 + clamp((globalTimeSec - 5.65) / 2.50, 0, 1) * 0.28 * spd;
      ctx.save();
      ctx.globalAlpha = clamp(darkCloudBell * 0.94 * density, 0, 1);
      ctx.translate(w * 0.5, h * 0.5);
      ctx.scale(darkZoom, darkZoom);
      ctx.translate(-w * 0.5, -h * 0.5);
      if (darkPlateRec && darkPlateRec.loaded) {
        ctx.drawImage(darkPlateRec.img, 0, 0, w, h);
      }

      ctx.globalCompositeOperation = 'screen';
      const coreX = w * 0.51;
      const coreY = h * 0.53;
      const backlitGrad = ctx.createRadialGradient(coreX, coreY, 8, coreX, coreY, w * 0.29);
      backlitGrad.addColorStop(0, `rgba(255, 251, 235, ${(0.52 * darkCloudBell).toFixed(3)})`);
      backlitGrad.addColorStop(0.32, `rgba(254, 240, 138, ${(0.34 * darkCloudBell).toFixed(3)})`);
      backlitGrad.addColorStop(0.65, `rgba(148, 163, 184, ${(0.14 * darkCloudBell).toFixed(3)})`);
      backlitGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = backlitGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, w * 0.29, 0, Math.PI * 2);
      ctx.fill();

      for (let sp = 0; sp < 68; sp++) {
        const u1 = Math.max(0.002, hash1D(sp * 19.7 + 3.1));
        const u2 = hash1D(sp * 37.3 + 7.9);
        const dist = Math.sqrt(-2.0 * Math.log(u1)) * 0.36;
        const ang = u2 * Math.PI * 2;
        const sx = coreX + Math.cos(ang) * (w * 0.22) * dist;
        const sy = coreY + Math.sin(ang) * (h * 0.20) * dist;
        const twinkle = 0.45 + 0.55 * Math.sin(globalTimeSec * 7.5 + sp * 2.3);
        const rDot = (sp % 7 === 0 ? 1.55 : 0.85) * (0.8 + 0.3 * twinkle);

        ctx.fillStyle = sp % 5 === 0 ? '#ffffff' : '#fef08a';
        ctx.globalAlpha = clamp(darkCloudBell * twinkle * 0.92, 0.05, 0.98);
        ctx.beginPath();
        ctx.arc(sx, sy, rDot, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Phase B: Sunlit white/silver stratospheric cloud canopy parting outward (7.20s – 8.95s)
    const brightCloudBell = Math.sin(clamp((globalTimeSec - 7.20) / 1.75, 0, 1) * Math.PI);
    if (brightCloudBell > 0.02) {
      const brightPlateRec = getLoadedImage(REFERENCE_PLATES.act4SunlitClouds);
      const brightZoom = 1.0 + clamp((globalTimeSec - 7.20) / 1.75, 0, 1) * 0.36 * spd;
      ctx.save();
      ctx.globalAlpha = clamp(brightCloudBell * 0.86 * density, 0, 1);
      ctx.translate(w * 0.5, h * 0.5);
      ctx.scale(brightZoom, brightZoom);
      ctx.translate(-w * 0.5, -h * 0.5);
      if (brightPlateRec && brightPlateRec.loaded) {
        ctx.drawImage(brightPlateRec.img, 0, 0, w, h);
      }
      ctx.restore();
    }

    // Phase C: Outward-parting corner cumulus cloud banks (7.55s – 9.65s)
    // Matches image_364a48a9.png -> image_94f54734.png -> image_4a2b9f34.png -> image_c041b82b.png
    // where white clouds in the top-left and bottom-right part outward to clear the center for Herzogenaurach!
    if (globalTimeSec >= 7.50 && globalTimeSec <= 9.85) {
      const partP = clamp((globalTimeSec - 7.50) / 2.25, 0, 1);
      const cloudRingAlpha = (1.0 - easeInOutCubic(partP)) * clamp(density * 0.78, 0.15, 0.95);
      if (cloudRingAlpha > 0.015) {
        const shift = easeOutCubic(partP) * w * 0.36 * spd;
        const cornerBanks = [
          // Top-left parting cloud bank (prominent in image_364a48a9.png & image_94f54734.png)
          { x: w * 0.18 - shift * 0.85, y: h * 0.22 - shift * 0.45, rx: w * 0.28, ry: h * 0.24 },
          { x: w * 0.32 - shift * 0.95, y: h * 0.14 - shift * 0.52, rx: w * 0.22, ry: h * 0.18 },
          // Bottom-right parting cloud bank (prominent in image_364a48a9.png -> image_c041b82b.png)
          { x: w * 0.78 + shift * 0.85, y: h * 0.76 + shift * 0.45, rx: w * 0.30, ry: h * 0.25 },
          { x: w * 0.64 + shift * 0.75, y: h * 0.84 + shift * 0.50, rx: w * 0.24, ry: h * 0.19 }
        ];
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        cornerBanks.forEach((cb) => {
          const g = ctx.createRadialGradient(cb.x, cb.y, cb.rx * 0.08, cb.x, cb.y, cb.rx);
          g.addColorStop(0, `rgba(255, 255, 255, ${cloudRingAlpha.toFixed(3)})`);
          g.addColorStop(0.48, `rgba(241, 245, 249, ${(cloudRingAlpha * 0.62).toFixed(3)})`);
          g.addColorStop(0.78, `rgba(203, 213, 225, ${(cloudRingAlpha * 0.24).toFixed(3)})`);
          g.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(cb.x, cb.y, cb.rx, cb.ry, -0.25, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // ==========================================================================
  // 12. MASTER TIMELINE, ON-STAGE SELECTION SHEEN BOX & CLEAN SCREEN EYE TOGGLE
  // ==========================================================================
  function resolveActiveSceneAndTime(rawT, cfg) {
    const speed = clamp(Number(cfg.playbackSpeed ?? 1.0), 0.2, 3.0);
    const activeFilter = cfg.activeSceneFilter || 'all';
    const totalDur = SCENES[SCENES.length - 1].end; // 12.0s

    if (activeFilter !== 'all') {
      const targetSc = SCENES.find((s) => s.id === activeFilter) || SCENES[0];
      const dur = Math.max(0.5, targetSc.end - targetSc.start);
      const isScrubbing = !!document.querySelector('#tpl-hud-scrubber-wrap.dragging');
      if (isScrubbing) {
        const scrubP = clamp((Number(rawT) || 0) / totalDur, 0, 0.999);
        return { scene: targetSc, globalT: targetSc.start + scrubP * dur };
      }
      const offsetT = Math.max(0, (Number(rawT) || 0) - targetSc.start);
      const localOffset = ((offsetT * speed) % dur + dur) % dur;
      return { scene: targetSc, globalT: targetSc.start + localOffset };
    }

    const seqT = (((Number(rawT) || 0) * speed) % totalDur + totalDur) % totalDur;
    const found = SCENES.find((s) => seqT >= s.start && seqT < s.end) || SCENES[SCENES.length - 1];
    return { scene: found, globalT: seqT };
  }

  /**
   * Returns a fallback bounding box if the user selects a layer while the timeline is in a different act.
   */
  function getFallbackHitBoxForLayer(layerId, cw, ch, cfg) {
    if (layerId === 'left_logo_adidas') {
      return { id: layerId, label: 'Left Brand Logo', x: cw * 0.05 + Number(cfg.leftLogoOffsetX || 0), y: ch * 0.22 + Number(cfg.leftLogoOffsetY || 0), w: cw * 0.38, h: ch * 0.56 };
    }
    if (layerId === 'right_logo_puma') {
      return { id: layerId, label: 'Right Brand Logo', x: cw * 0.56 + Number(cfg.rightLogoOffsetX || 0), y: ch * 0.22 + Number(cfg.rightLogoOffsetY || 0), w: cw * 0.38, h: ch * 0.56 };
    }
    if (layerId === 'earth_globe_3d') {
      const r = Math.min(cw, ch) * clamp(Number(cfg.globeInitialScale ?? 0.145), 0.06, 0.35) * 1.35;
      return { id: layerId, label: '3D Spinning Earth Globe', x: cw * 0.505 + Number(cfg.globeOffsetX || 0) - r, y: ch * 0.50 + Number(cfg.globeOffsetY || 0) - r, w: r * 2, h: r * 2 };
    }
    if (layerId === 'central_light_rift') {
      return { id: layerId, label: 'Central Light Rift', x: cw * 0.48 + Number(cfg.riftOffsetX || 0), y: ch * 0.05 + Number(cfg.riftOffsetY || 0), w: cw * 0.05, h: ch * 0.90 };
    }
    if (layerId === 'travelling_sun_star') {
      return { id: layerId, label: 'Sun-Star & Lens Flare', x: cw * 0.45 + Number(cfg.starOffsetX || 0), y: ch * 0.20 + Number(cfg.starOffsetY || 0), w: 96, h: 96 };
    }
    if (layerId === 'cosmic_nebula_backdrop') {
      return { id: layerId, label: 'Cosmic Nebula Clouds', x: cw * 0.04 + Number(cfg.nebulaOffsetX || 0), y: ch * 0.06 + Number(cfg.nebulaOffsetY || 0), w: cw * 0.92, h: ch * 0.88 };
    }
    if (layerId === 'herzog_municipal_border') {
      return { id: layerId, label: 'Herzogenaurach Municipal Border', x: cw * 0.22 + Number(cfg.herzogBorderOffsetX || 0), y: ch * 0.22 + Number(cfg.herzogBorderOffsetY || 0), w: cw * 0.56, h: ch * 0.56 };
    }
    if (layerId === 'herzog_region_title') {
      return { id: layerId, label: 'HERZOGENAURACH Region Title', x: cw * 0.18 + Number(cfg.herzogTitleOffsetX || 0), y: ch * 0.36 + Number(cfg.herzogTitleOffsetY || 0), w: cw * 0.64, h: ch * 0.24 };
    }
    return { id: 'satellite_map_plate', label: 'Google Earth Satellite Map', x: cw * 0.08 + Number(cfg.satelliteOffsetX || 0), y: ch * 0.08 + Number(cfg.satelliteOffsetY || 0), w: cw * 0.84, h: ch * 0.84 };
  }

  /**
   * Synchronizes the on-stage Selection Sheen Box over whichever stage object is currently selected.
   */
  function syncStageSelectionSheenBox(canvas, cfg) {
    if (!canvas || !canvas.parentElement) return;
    const sheenEl = canvas.parentElement.querySelector('.apce-selection-sheen-box');
    if (!sheenEl) return;

    if (cfg.cleanScreenHudHidden || !cfg.showStageSelectionBox || !cfg.selectedStageLayer) {
      sheenEl.style.display = 'none';
      return;
    }

    const cw = canvas.width || 1280;
    const ch = canvas.height || 720;
    const hit = _lastStageHitBoxes.find((hb) => hb.id === cfg.selectedStageLayer)
      || getFallbackHitBoxForLayer(cfg.selectedStageLayer, cw, ch, cfg);
    if (!hit) {
      sheenEl.style.display = 'none';
      return;
    }

    const leftPct = clamp((hit.x / cw) * 100, 0.5, 95);
    const topPct = clamp((hit.y / ch) * 100, 0.5, 93);
    const widthPct = clamp((hit.w / cw) * 100, 4.5, 99 - leftPct);
    const heightPct = clamp((hit.h / ch) * 100, 5.5, 99 - topPct);

    sheenEl.style.display = 'block';
    sheenEl.style.left = `${leftPct.toFixed(2)}%`;
    sheenEl.style.top = `${topPct.toFixed(2)}%`;
    sheenEl.style.width = `${widthPct.toFixed(2)}%`;
    sheenEl.style.height = `${heightPct.toFixed(2)}%`;

    const labelSpan = sheenEl.querySelector('.apce-sheen-badge-text');
    if (labelSpan && labelSpan.textContent !== hit.label) {
      labelSpan.textContent = hit.label;
    }
  }

  function renderAdidasPumaCosmicCanvas(canvas, t, overrideData) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width || 1280;
    const h = canvas.height || 720;
    const cfg = getConfig(overrideData);

    _lastStageHitBoxes = [];
    ctx.clearRect(0, 0, w, h);

    const { scene, globalT } = resolveActiveSceneAndTime(t || 0, cfg);

    // Camera zoom on the background cosmic split & logos (1.0x at 0s -> 1.88x at 5.2s as the globe expands)
    const cosmicCamZoom = 1.0 + easeInCubic(clamp(globalT / 5.3, 0, 1)) * 0.88;
    const starWorldPos = computeTravellingStarWorldPos(w, h, globalT, cfg);

    // 1. Render Cosmic Dual-Hemisphere Nebula, Living Cloud-Bleed Logos & Light Rift (Visible 0.0s – 5.4s)
    if (globalT < 5.4) {
      renderCosmicSplitAndLogos(ctx, w, h, cosmicCamZoom, globalT, cfg, starWorldPos);
      renderTravellingStarAndCounterRefraction(ctx, w, h, cosmicCamZoom, globalT, cfg);
    }

    // 2. Render 3D Spinning Night-Earth Globe with Surface-Wrapping Sunlight & Gravity Zoom
    if (globalT < 8.2) {
      renderSpinning3DEarthGlobe(ctx, w, h, globalT, cfg);
    }

    // 3. Render Macro Europe City Lights -> Stratospheric Cloud Dive -> Google Earth Satellite Map (4.75s – 12.0s)
    if (globalT >= 4.75) {
      renderMacroEuropeAndCloudDiveToGoogleEarth(ctx, w, h, globalT, cfg);
    }

    // 4. Interactive "Trace Light Rift Path" Guide when Tracing Mode is Active
    if (cfg.isTracingRiftPath) {
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.85)';
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, w - 4, h - 4);

      if (Array.isArray(cfg.customRiftPoints) && cfg.customRiftPoints.length > 0) {
        ctx.fillStyle = '#c084fc';
        cfg.customRiftPoints.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x * w, pt.y * h, 4.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.restore();
    }

    // 5. Update On-Stage Selection Sheen Box
    syncStageSelectionSheenBox(canvas, cfg);

    // 6. Update Timecode Badge & Top Scene Sub-Toolbar Counter
    const timerBadge = document.getElementById('tpl-modal-timer-badge');
    if (timerBadge) {
      timerBadge.textContent = `${globalT.toFixed(1)}s / 12.0s`;
    }
    const counterEl = document.querySelector('#modal-top-template-customizer .rg-scene-counter-text');
    if (counterEl) {
      counterEl.textContent = cfg.activeSceneFilter === 'all'
        ? `Act ${scene.index} of 4 (All)`
        : `Act ${scene.index} of 4`;
    }
  }

  window.renderAdidasPumaCosmicTimelineCanvas = function (ctx2d, clip, t) {
    if (!ctx2d || !ctx2d.canvas) return;
    const data = (clip && clip.fxScene && clip.fxScene.data) || getConfig();
    renderAdidasPumaCosmicCanvas(ctx2d.canvas, t, data);
  };

  // ==========================================================================
  // 13. STAGE HTML BUILDER, INTERACTIVE SELECTION GIZMO & EYE ICON CLEAN SCREEN
  // ==========================================================================
  let _lastAnimTime = 0;

  function ensureApceStageStyles() {
    if (document.getElementById('apce-stage-selection-styles')) return;
    const style = document.createElement('style');
    style.id = 'apce-stage-selection-styles';
    style.textContent = `
      @keyframes apceSheenSweep {
        0% { transform: translateX(-140%) skewX(-24deg); opacity: 0; }
        20% { opacity: 0.9; }
        60% { transform: translateX(220%) skewX(-24deg); opacity: 0; }
        100% { transform: translateX(220%) skewX(-24deg); opacity: 0; }
      }
      .apce-selection-sheen-box {
        position: absolute;
        pointer-events: none;
        border: 1.5px solid rgba(168, 85, 247, 0.94);
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.35), 0 0 24px rgba(168, 85, 247, 0.38), inset 0 0 16px rgba(168, 85, 247, 0.14);
        z-index: 28;
        transition: left 0.05s ease-out, top 0.05s ease-out, width 0.05s ease-out, height 0.05s ease-out;
      }
      .apce-selection-sheen-box.is-dragging {
        transition: none !important;
        border-color: #38bdf8;
        box-shadow: 0 0 0 1.5px rgba(56, 189, 248, 0.75), 0 0 28px rgba(56, 189, 248, 0.45);
      }
      .apce-selection-sheen-clip {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border-radius: 7px;
        pointer-events: none;
      }
      .apce-selection-sheen-clip::after {
        content: "";
        position: absolute;
        top: -20%;
        left: 0;
        width: 46%;
        height: 140%;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(168,85,247,0.18) 38%, rgba(224,242,254,0.42) 52%, rgba(56,189,248,0.16) 68%, rgba(255,255,255,0) 100%);
        animation: apceSheenSweep 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
      }
      .apce-sheen-handle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #ffffff;
        border: 2.2px solid #9333ea;
        border-radius: 3px;
        box-shadow: 0 0 10px rgba(168, 85, 247, 0.95);
        pointer-events: auto;
        z-index: 32;
        transition: transform 0.12s ease, background 0.12s ease;
      }
      .apce-sheen-handle:hover {
        transform: scale(1.28);
        background: #38bdf8;
        border-color: #ffffff;
      }
      .apce-sheen-handle.is-tl { top: -6px; left: -6px; cursor: nwse-resize; }
      .apce-sheen-handle.is-tr { top: -6px; right: -6px; cursor: nesw-resize; }
      .apce-sheen-handle.is-bl { bottom: -6px; left: -6px; cursor: nesw-resize; }
      .apce-sheen-handle.is-br { bottom: -6px; right: -6px; cursor: nwse-resize; }
      .apce-sheen-badge {
        position: absolute;
        top: -29px;
        left: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 9px;
        border-radius: 6px;
        background: rgba(15, 12, 29, 0.94);
        border: 1px solid rgba(168, 85, 247, 0.72);
        color: #f8fafc;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.01em;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.48);
        pointer-events: auto;
        cursor: grab;
      }
      .apce-sheen-badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: #a855f7;
        box-shadow: 0 0 6px #38bdf8;
      }
      .apce-sheen-badge-hint {
        color: #94a3b8;
        font-size: 9.5px;
        font-weight: 500;
        margin-left: 2px;
      }
      .apce-sheen-badge-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 17px;
        height: 17px;
        border: none;
        background: rgba(255,255,255,0.08);
        color: #cbd5e1;
        border-radius: 4px;
        cursor: pointer;
        padding: 0;
        margin-left: 2px;
      }
      .apce-sheen-badge-btn:hover {
        background: rgba(168, 85, 247, 0.32);
        color: #ffffff;
      }
    `;
    document.head.appendChild(style);
  }

  function buildAdidasPumaCosmicHtml(tplId) {
    ensureApceStageStyles();
    const id = tplId || TEMPLATE_ID;
    return `
      <div id="adidas-puma-cosmic-viewport-${id}" class="apce-stage-root" style="position:absolute;inset:0;width:100%;height:100%;background:#02050d;overflow:hidden;user-select:none;">
        <canvas
          id="adidas-puma-cosmic-canvas-${id}"
          class="apce-main-canvas"
          width="1280"
          height="720"
          style="width:100%;height:100%;object-fit:contain;display:block;cursor:grab;"
        ></canvas>
        <div class="apce-selection-sheen-box" style="display:none;">
          <div class="apce-selection-sheen-clip"></div>
          <span class="apce-sheen-handle is-tl" data-sheen-handle="tl" title="Drag corner to resize"></span>
          <span class="apce-sheen-handle is-tr" data-sheen-handle="tr" title="Drag corner to resize"></span>
          <span class="apce-sheen-handle is-bl" data-sheen-handle="bl" title="Drag corner to resize"></span>
          <span class="apce-sheen-handle is-br" data-sheen-handle="br" title="Drag corner to resize"></span>
          <div class="apce-sheen-badge" data-sheen-drag-bar="1" title="Drag on stage to move, drag corners to resize">
            <span class="apce-sheen-badge-dot"></span>
            <span class="apce-sheen-badge-text">Selected Object</span>
            <span class="apce-sheen-badge-hint">• Drag / Resize</span>
            <button type="button" class="apce-sheen-badge-btn" data-action="reset-layer-transform" title="Reset Position & Scale">${ENGINE_SVGS.rotateCcw}</button>
            <button type="button" class="apce-sheen-badge-btn" data-action="dismiss-sheen-box" title="Hide Selection Frame">${ENGINE_SVGS.closeX}</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Applies Clean Screen (Hide/Show HUD Toolbar & Selection Overlays) when the
   * user clicks EITHER the bottom-right Eye Icon (#btn-tpl-hud-clean-view) OR
   * the top Clean Screen button (#btn-tpl-modal-clean-hud).
   */
  function applyCleanScreenHudState(hidden) {
    const isHidden = Boolean(hidden);
    updateConfigKey('cleanScreenHudHidden', isHidden);

    const topAdaptiveToolbar = document.getElementById('tpl-modal-stage-adaptive-toolbar');
    if (topAdaptiveToolbar) {
      topAdaptiveToolbar.style.opacity = isHidden ? '0' : '1';
      topAdaptiveToolbar.style.pointerEvents = isHidden ? 'none' : 'auto';
      topAdaptiveToolbar.style.transform = isHidden ? 'translateY(-10px)' : 'translateY(0)';
      topAdaptiveToolbar.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }

    const cleanTopBtn = document.getElementById('btn-tpl-modal-clean-hud');
    if (cleanTopBtn) {
      cleanTopBtn.classList.toggle('is-active', isHidden);
      cleanTopBtn.style.background = isHidden ? 'rgba(139, 92, 246, 0.32)' : '';
      cleanTopBtn.style.borderColor = isHidden ? 'rgba(167, 139, 250, 0.7)' : '';
    }

    const eyeBottomBtn = document.getElementById('btn-tpl-hud-clean-view');
    if (eyeBottomBtn) {
      eyeBottomBtn.classList.toggle('is-active', isHidden);
      eyeBottomBtn.style.color = isHidden ? '#c084fc' : '#e2e8f0';
      eyeBottomBtn.style.background = isHidden ? 'rgba(139, 92, 246, 0.25)' : '';
      eyeBottomBtn.style.borderRadius = '6px';
      eyeBottomBtn.innerHTML = isHidden ? ENGINE_SVGS.eyeOff : ENGINE_SVGS.eye;
      eyeBottomBtn.title = isHidden ? 'Show Stage Toolbar (Clean View Active)' : 'Clean View (Hide Overlays & Stage Toolbar)';
    }

    if (isHidden && window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.hide === 'function') {
      window.RegaarderContextualToolbar.hide();
    }

    if (typeof window.apceRequestRender === 'function') {
      window.apceRequestRender();
    }
  }

  function bindGlobalCleanScreenEyeButtons() {
    if (window._apceCleanScreenEyeBound) return;
    window._apceCleanScreenEyeBound = true;

    document.addEventListener('click', (ev) => {
      const eyeBtn = ev.target.closest('#btn-tpl-hud-clean-view, #btn-tpl-modal-clean-hud');
      if (!eyeBtn) return;
      ev.preventDefault();
      ev.stopPropagation();
      const cfg = getConfig();
      applyCleanScreenHudState(!cfg.cleanScreenHudHidden);
    }, true);
  }
  bindGlobalCleanScreenEyeButtons();

  function setActiveSceneFilter(sceneId) {
    const cfg = getConfig();
    const nextScene = sceneId || 'all';
    updateConfigKey('activeSceneFilter', nextScene);
    syncContextualStoreSnapshot(cfg);
    _soloSceneStartPerf = performance.now();

    if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
      if (nextScene !== 'all') {
        const sc = SCENES.find((s) => s.id === nextScene);
        if (sc) {
          topCustomizerState.sceneStartTime = performance.now() - sc.start * 1000;
          _lastAnimTime = sc.start + 0.15;
        }
      } else {
        topCustomizerState.sceneStartTime = performance.now();
        _lastAnimTime = 0.05;
      }
    }

    document.querySelectorAll('[data-apce-scene-btn]').forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute('data-apce-scene-btn') === nextScene);
    });

    if (typeof window.apceRequestRender === 'function') {
      window.apceRequestRender();
    }
  }

  function selectStageLayerAndFocusInspector(layerId) {
    if (!layerId) return;
    updateConfigKey('selectedStageLayer', layerId);
    updateConfigKey('showStageSelectionBox', true);

    document.querySelectorAll('.rg-media-asset-row[data-select-stage-layer]').forEach((row) => {
      row.classList.toggle('is-selected', row.getAttribute('data-select-stage-layer') === layerId);
    });

    const sectionMap = {
      left_logo_adidas: { tab: 'content', cardRole: 'apce-card-logos' },
      right_logo_puma: { tab: 'content', cardRole: 'apce-card-logos' },
      earth_globe_3d: { tab: 'motion', cardRole: 'apce-card-globe-motion' },
      central_light_rift: { tab: 'look', cardRole: 'apce-card-rift-look' },
      travelling_sun_star: { tab: 'effects', cardRole: 'apce-card-refraction-fx' },
      cosmic_nebula_backdrop: { tab: 'look', cardRole: 'apce-card-nebula-look' },
      herzog_municipal_border: { tab: 'content', cardRole: 'apce-card-herzog-telemetry' },
      herzog_region_title: { tab: 'content', cardRole: 'apce-card-herzog-telemetry' },
      satellite_map_plate: { tab: 'content', cardRole: 'apce-card-earth-content' }
    };

    const target = sectionMap[layerId];
    if (target) {
      const tabBtn = document.querySelector(`#modal-top-template-customizer .rg-inspector-tab[data-tab="${target.tab}"]`);
      if (tabBtn && !tabBtn.classList.contains('is-active')) {
        tabBtn.click();
      }
      const cardEl = document.querySelector(`[data-apce-card="${target.cardRole}"]`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        cardEl.classList.remove('rg-card-pulse-highlight');
        void cardEl.offsetWidth;
        cardEl.classList.add('rg-card-pulse-highlight');
      }
    }
  }

  function resetLayerTransformToDefault(layerId) {
    if (layerId === 'left_logo_adidas') {
      updateConfigKey('leftLogoOffsetX', 0);
      updateConfigKey('leftLogoOffsetY', 0);
      updateConfigKey('leftLogoScale', 1.0);
    } else if (layerId === 'right_logo_puma') {
      updateConfigKey('rightLogoOffsetX', 0);
      updateConfigKey('rightLogoOffsetY', 0);
      updateConfigKey('rightLogoScale', 1.0);
    } else if (layerId === 'earth_globe_3d') {
      updateConfigKey('globeOffsetX', 0);
      updateConfigKey('globeOffsetY', 0);
      updateConfigKey('globeInitialScale', 0.145);
    } else if (layerId === 'central_light_rift') {
      updateConfigKey('riftOffsetX', 0);
      updateConfigKey('riftOffsetY', 0);
      updateConfigKey('riftWidthPx', 10);
      _nebulaCacheKey = '';
    } else if (layerId === 'travelling_sun_star') {
      updateConfigKey('starOffsetX', 0);
      updateConfigKey('starOffsetY', 0);
      updateConfigKey('starCoreSize', 1.15);
    } else if (layerId === 'cosmic_nebula_backdrop') {
      updateConfigKey('nebulaOffsetX', 0);
      updateConfigKey('nebulaOffsetY', 0);
      updateConfigKey('nebulaScale', 1.0);
    } else if (layerId === 'herzog_municipal_border') {
      updateConfigKey('herzogBorderOffsetX', 0);
      updateConfigKey('herzogBorderOffsetY', 0);
      updateConfigKey('herzogBorderScale', 1.0);
    } else if (layerId === 'herzog_region_title') {
      updateConfigKey('herzogTitleOffsetX', 0);
      updateConfigKey('herzogTitleOffsetY', 0);
      updateConfigKey('herzogTitleScale', 1.0);
    } else if (layerId === 'satellite_map_plate') {
      updateConfigKey('satelliteOffsetX', 0);
      updateConfigKey('satelliteOffsetY', 0);
      updateConfigKey('satelliteScale', 1.0);
    }
  }

  function bindStageEvents(rootEl, canvas) {
    if (!rootEl || !canvas || rootEl.dataset.apceBound === '1') return;
    rootEl.dataset.apceBound = '1';

    let isDrawingRift = false;
    let activeDragState = null; // { mode: 'move' | 'resize', handle: 'tl'|'tr'|'bl'|'br', layerId, startClientX, startClientY, startOx, startOy, startScale }

    const sheenEl = rootEl.querySelector('.apce-selection-sheen-box');
    const closeSheenBtn = rootEl.querySelector('[data-action="dismiss-sheen-box"]');
    if (closeSheenBtn) {
      closeSheenBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        updateConfigKey('showStageSelectionBox', false);
      });
    }
    const resetSheenBtn = rootEl.querySelector('[data-action="reset-layer-transform"]');
    if (resetSheenBtn) {
      resetSheenBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const cfg = getConfig();
        resetLayerTransformToDefault(cfg.selectedStageLayer || 'left_logo_adidas');
      });
    }

    const toNormCoords = (ev) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clamp((ev.clientX - rect.left) / Math.max(1, rect.width), 0.02, 0.98),
        y: clamp((ev.clientY - rect.top) / Math.max(1, rect.height), 0.0, 1.0)
      };
    };

    const readLayerOffsetsAndScale = (layerId, cfg) => {
      if (layerId === 'left_logo_adidas') {
        return { ox: Number(cfg.leftLogoOffsetX || 0), oy: Number(cfg.leftLogoOffsetY || 0), scale: Number(cfg.leftLogoScale ?? 1.0) };
      }
      if (layerId === 'right_logo_puma') {
        return { ox: Number(cfg.rightLogoOffsetX || 0), oy: Number(cfg.rightLogoOffsetY || 0), scale: Number(cfg.rightLogoScale ?? 1.0) };
      }
      if (layerId === 'earth_globe_3d') {
        return { ox: Number(cfg.globeOffsetX || 0), oy: Number(cfg.globeOffsetY || 0), scale: Number(cfg.globeInitialScale ?? 0.145) };
      }
      if (layerId === 'central_light_rift') {
        return { ox: Number(cfg.riftOffsetX || 0), oy: Number(cfg.riftOffsetY || 0), scale: Number(cfg.riftWidthPx ?? 10) };
      }
      if (layerId === 'travelling_sun_star') {
        return { ox: Number(cfg.starOffsetX || 0), oy: Number(cfg.starOffsetY || 0), scale: Number(cfg.starCoreSize ?? 1.15) };
      }
      if (layerId === 'cosmic_nebula_backdrop') {
        return { ox: Number(cfg.nebulaOffsetX || 0), oy: Number(cfg.nebulaOffsetY || 0), scale: Number(cfg.nebulaScale ?? 1.0) };
      }
      if (layerId === 'herzog_municipal_border') {
        return { ox: Number(cfg.herzogBorderOffsetX || 0), oy: Number(cfg.herzogBorderOffsetY || 0), scale: Number(cfg.herzogBorderScale ?? 1.0) };
      }
      if (layerId === 'herzog_region_title') {
        return { ox: Number(cfg.herzogTitleOffsetX || 0), oy: Number(cfg.herzogTitleOffsetY || 0), scale: Number(cfg.herzogTitleScale ?? 1.0) };
      }
      return { ox: Number(cfg.satelliteOffsetX || 0), oy: Number(cfg.satelliteOffsetY || 0), scale: Number(cfg.satelliteScale ?? 1.0) };
    };

    const applyLayerMoveDelta = (layerId, startOx, startOy, dxCanvas, dyCanvas) => {
      const nx = Math.round(clamp(startOx + dxCanvas, -480, 480));
      const ny = Math.round(clamp(startOy + dyCanvas, -320, 320));
      if (layerId === 'left_logo_adidas') {
        updateConfigKey('leftLogoOffsetX', nx);
        updateConfigKey('leftLogoOffsetY', ny);
      } else if (layerId === 'right_logo_puma') {
        updateConfigKey('rightLogoOffsetX', nx);
        updateConfigKey('rightLogoOffsetY', ny);
      } else if (layerId === 'earth_globe_3d') {
        updateConfigKey('globeOffsetX', nx);
        updateConfigKey('globeOffsetY', ny);
      } else if (layerId === 'central_light_rift') {
        _nebulaCacheKey = '';
        updateConfigKey('riftOffsetX', nx);
        updateConfigKey('riftOffsetY', ny);
      } else if (layerId === 'travelling_sun_star') {
        updateConfigKey('starOffsetX', nx);
        updateConfigKey('starOffsetY', ny);
      } else if (layerId === 'cosmic_nebula_backdrop') {
        updateConfigKey('nebulaOffsetX', nx);
        updateConfigKey('nebulaOffsetY', ny);
      } else if (layerId === 'herzog_municipal_border') {
        updateConfigKey('herzogBorderOffsetX', nx);
        updateConfigKey('herzogBorderOffsetY', ny);
      } else if (layerId === 'herzog_region_title') {
        updateConfigKey('herzogTitleOffsetX', nx);
        updateConfigKey('herzogTitleOffsetY', ny);
      } else if (layerId === 'satellite_map_plate') {
        updateConfigKey('satelliteOffsetX', nx);
        updateConfigKey('satelliteOffsetY', ny);
      }
    };

    const applyLayerScaleFactor = (layerId, startScale, factor) => {
      if (layerId === 'left_logo_adidas') {
        updateConfigKey('leftLogoScale', Number(clamp(startScale * factor, 0.3, 2.2).toFixed(3)));
      } else if (layerId === 'right_logo_puma') {
        updateConfigKey('rightLogoScale', Number(clamp(startScale * factor, 0.3, 2.2).toFixed(3)));
      } else if (layerId === 'earth_globe_3d') {
        updateConfigKey('globeInitialScale', Number(clamp(startScale * factor, 0.06, 0.35).toFixed(3)));
      } else if (layerId === 'central_light_rift') {
        updateConfigKey('riftWidthPx', Math.round(clamp(startScale * factor, 3, 42)));
      } else if (layerId === 'travelling_sun_star') {
        updateConfigKey('starCoreSize', Number(clamp(startScale * factor, 0.3, 2.8).toFixed(2)));
      } else if (layerId === 'cosmic_nebula_backdrop') {
        updateConfigKey('nebulaScale', Number(clamp(startScale * factor, 0.5, 2.2).toFixed(2)));
      } else if (layerId === 'herzog_municipal_border') {
        updateConfigKey('herzogBorderScale', Number(clamp(startScale * factor, 0.35, 2.5).toFixed(2)));
      } else if (layerId === 'herzog_region_title') {
        updateConfigKey('herzogTitleScale', Number(clamp(startScale * factor, 0.35, 2.5).toFixed(2)));
      } else if (layerId === 'satellite_map_plate') {
        updateConfigKey('satelliteScale', Number(clamp(startScale * factor, 0.5, 2.2).toFixed(2)));
      }
    };

    // 1. Bind 4 Corner Resize Handles + Badge Drag Bar on the Selection Sheen Box
    rootEl.querySelectorAll('[data-sheen-handle]').forEach((handleEl) => {
      handleEl.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const cfg = getConfig();
        const layerId = cfg.selectedStageLayer || 'left_logo_adidas';
        const cur = readLayerOffsetsAndScale(layerId, cfg);
        activeDragState = {
          mode: 'resize',
          handle: handleEl.getAttribute('data-sheen-handle') || 'br',
          layerId,
          startClientX: ev.clientX,
          startClientY: ev.clientY,
          startOx: cur.ox,
          startOy: cur.oy,
          startScale: cur.scale
        };
        if (sheenEl) sheenEl.classList.add('is-dragging');
        try { rootEl.setPointerCapture(ev.pointerId); } catch (_) {}
      });
    });

    const badgeDragBar = rootEl.querySelector('[data-sheen-drag-bar="1"]');
    if (badgeDragBar) {
      badgeDragBar.addEventListener('pointerdown', (ev) => {
        if (ev.target.closest('button')) return;
        ev.preventDefault();
        ev.stopPropagation();
        const cfg = getConfig();
        const layerId = cfg.selectedStageLayer || 'left_logo_adidas';
        const cur = readLayerOffsetsAndScale(layerId, cfg);
        activeDragState = {
          mode: 'move',
          layerId,
          startClientX: ev.clientX,
          startClientY: ev.clientY,
          startOx: cur.ox,
          startOy: cur.oy,
          startScale: cur.scale
        };
        if (sheenEl) sheenEl.classList.add('is-dragging');
        try { rootEl.setPointerCapture(ev.pointerId); } catch (_) {}
      });
    }

    // 2. Bind Canvas Pointerdown (Trace Rift OR Hit-Test + Start Direct On-Stage Drag!)
    canvas.addEventListener('pointerdown', (ev) => {
      const cfg = getConfig();
      if (cfg.isTracingRiftPath) {
        isDrawingRift = true;
        const pt = toNormCoords(ev);
        cfg.customRiftPoints = [{ x: pt.x, y: 0.0 }, pt];
        updateConfigKey('riftPathMode', 'custom_traced');
        updateConfigKey('customRiftPoints', cfg.customRiftPoints);
        _nebulaCacheKey = '';
        try { canvas.setPointerCapture(ev.pointerId); } catch (_) {}
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const cx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * canvas.width;
      const cy = ((ev.clientY - rect.top) / Math.max(1, rect.height)) * canvas.height;

      // Prioritize foreground targets (Star, Rift, 3D Globe, Logos, Herzog Title & Border) before background layers
      const sortedBoxes = [..._lastStageHitBoxes].sort((a, b) => {
        if (Boolean(a.isBackgroundLayer) !== Boolean(b.isBackgroundLayer)) {
          return a.isBackgroundLayer ? 1 : -1;
        }
        return (a.w * a.h) - (b.w * b.h);
      });

      let matched = null;
      for (let i = 0; i < sortedBoxes.length; i++) {
        const hb = sortedBoxes[i];
        if (cx >= hb.x && cx <= hb.x + hb.w && cy >= hb.y && cy <= hb.y + hb.h) {
          matched = hb;
          break;
        }
      }
      if (matched) {
        selectStageLayerAndFocusInspector(matched.id);
        const cur = readLayerOffsetsAndScale(matched.id, getConfig());
        activeDragState = {
          mode: 'move',
          layerId: matched.id,
          startClientX: ev.clientX,
          startClientY: ev.clientY,
          startOx: cur.ox,
          startOy: cur.oy,
          startScale: cur.scale
        };
        if (sheenEl) sheenEl.classList.add('is-dragging');
        canvas.style.cursor = 'grabbing';
        try { canvas.setPointerCapture(ev.pointerId); } catch (_) {}
      } else {
        updateConfigKey('showStageSelectionBox', false);
      }
    });

    // 3. Unified Pointermove for Interactive Move, Corner Resize, or Rift Tracing
    const onPointerMove = (ev) => {
      if (activeDragState) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / Math.max(1, rect.width);
        const scaleY = canvas.height / Math.max(1, rect.height);
        const dxCanvas = (ev.clientX - activeDragState.startClientX) * scaleX;
        const dyCanvas = (ev.clientY - activeDragState.startClientY) * scaleY;

        if (activeDragState.mode === 'move') {
          applyLayerMoveDelta(activeDragState.layerId, activeDragState.startOx, activeDragState.startOy, dxCanvas, dyCanvas);
        } else if (activeDragState.mode === 'resize') {
          const hType = activeDragState.handle || 'br';
          const signX = (hType === 'tl' || hType === 'bl') ? -1 : 1;
          const signY = (hType === 'tl' || hType === 'tr') ? -1 : 1;
          const signedDelta = (dxCanvas * signX + dyCanvas * signY) * 0.5;
          const factor = clamp(1.0 + signedDelta / 220, 0.35, 2.65);
          applyLayerScaleFactor(activeDragState.layerId, activeDragState.startScale, factor);
        }
        return;
      }

      if (!isDrawingRift) return;
      const cfg = getConfig();
      if (!cfg.isTracingRiftPath) return;
      const pt = toNormCoords(ev);
      const pts = cfg.customRiftPoints || [];
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) > 0.018) {
        pts.push(pt);
        updateConfigKey('customRiftPoints', pts);
      }
    };

    const endAllInteractions = () => {
      if (activeDragState) {
        activeDragState = null;
        if (sheenEl) sheenEl.classList.remove('is-dragging');
        canvas.style.cursor = 'grab';
      }
      if (!isDrawingRift) return;
      isDrawingRift = false;
      const cfg = getConfig();
      if (Array.isArray(cfg.customRiftPoints) && cfg.customRiftPoints.length >= 2) {
        const last = cfg.customRiftPoints[cfg.customRiftPoints.length - 1];
        if (last.y < 0.96) {
          cfg.customRiftPoints.push({ x: last.x, y: 1.0 });
        }
        cfg.customRiftPoints.sort((a, b) => a.y - b.y);
        _nebulaCacheKey = '';
        updateConfigKey('customRiftPoints', cfg.customRiftPoints);
      }
    };

    rootEl.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endAllInteractions);
    window.addEventListener('pointercancel', endAllInteractions);
  }

  function tplMountAdidasPumaCosmicStage(stageEl, data) {
    if (!stageEl) return;
    const cfg = getConfig(data);
    stageEl.innerHTML = buildAdidasPumaCosmicHtml(TEMPLATE_ID, cfg);
    const root = stageEl.querySelector('.apce-stage-root');
    const canvas = stageEl.querySelector('.apce-main-canvas');
    if (root && canvas) {
      bindStageEvents(root, canvas);
      applyCleanScreenHudState(cfg.cleanScreenHudHidden);
      renderAdidasPumaCosmicCanvas(canvas, _lastAnimTime, cfg);
    }
  }

  function stepAdidasPumaCosmicAnimation(containerEl, tplId, t, data) {
    if (!containerEl) return;
    const id = tplId || TEMPLATE_ID;
    let canvas = containerEl.querySelector(`#adidas-puma-cosmic-canvas-${id}`) || containerEl.querySelector('.apce-main-canvas');
    if (!canvas) {
      containerEl.innerHTML = buildAdidasPumaCosmicHtml(id, data);
      canvas = containerEl.querySelector('.apce-main-canvas');
      const root = containerEl.querySelector('.apce-stage-root');
      if (root && canvas) bindStageEvents(root, canvas);
    }
    _lastAnimTime = Number(t) || 0;
    if (canvas) {
      renderAdidasPumaCosmicCanvas(canvas, _lastAnimTime, data);
    }
  }

  window.apceRequestRender = function () {
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (!stage) return;
    const canvas = stage.querySelector('.apce-main-canvas');
    if (canvas) {
      renderAdidasPumaCosmicCanvas(canvas, _lastAnimTime, getConfig());
    }
  };

  // ==========================================================================
  // 14. STANDARDIZED REGAARDER STUDIO 4-TAB INSPECTOR + GRANULAR VFX CONTROLS
  // ==========================================================================
  function createRgSlider(label, key, min, max, step, unit, val) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-slider-row';
    const numVal = Number(val ?? min);
    const decimals = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
    const fmt = (n) => `${Number(n).toFixed(decimals)}${unit || ''}`;
    wrap.innerHTML = `
      <div class="rg-slider-header">
        <span>${label}</span>
        <span class="rg-slider-val">${fmt(numVal)}</span>
      </div>
      <input type="range" class="rg-range" min="${min}" max="${max}" step="${step}" value="${numVal}">
    `;
    const input = wrap.querySelector('input');
    const valSpan = wrap.querySelector('.rg-slider-val');
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      valSpan.textContent = fmt(v);
      updateConfigKey(key, v);
    });
    return wrap;
  }

  function createRgSelect(label, key, options, currentVal, onChangeExtra) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-field-group';
    wrap.innerHTML = `
      <label class="rg-field-label">${label}</label>
      <div class="rg-anim-select-wrap">
        <select class="rg-anim-select" style="padding-left:12px;">
          ${options.map((o) => `<option value="${o.value}" ${o.value === currentVal ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select>
        <span class="rg-anim-select-chevron">${ENGINE_SVGS.chevronDown}</span>
      </div>
    `;
    const sel = wrap.querySelector('select');
    sel.addEventListener('change', () => {
      updateConfigKey(key, sel.value);
      if (typeof onChangeExtra === 'function') onChangeExtra(sel.value);
    });
    return wrap;
  }

  function createRgColor(label, key, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-color-row';
    const hex = (currentVal || '#38bdf8').toUpperCase();
    wrap.innerHTML = `
      <span class="rg-color-label">${label}</span>
      <div class="rg-color-picker-wrap">
        <input type="color" class="rg-color-input" value="${currentVal || '#38bdf8'}">
        <span class="rg-color-hex">${hex}</span>
      </div>
    `;
    const inp = wrap.querySelector('.rg-color-input');
    const hexSpan = wrap.querySelector('.rg-color-hex');
    inp.addEventListener('input', () => {
      hexSpan.textContent = inp.value.toUpperCase();
      updateConfigKey(key, inp.value);
    });
    return wrap;
  }

  function createRgText(label, key, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-field-group';
    wrap.innerHTML = `
      <label class="rg-field-label">${label}</label>
      <input type="text" class="rg-input" value="${String(currentVal || '').replace(/"/g, '&quot;')}">
    `;
    const inp = wrap.querySelector('.rg-input');
    inp.addEventListener('input', () => {
      updateConfigKey(key, inp.value);
    });
    return wrap;
  }

  function createRgToggle(label, key, checked) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-toggle-row';
    wrap.innerHTML = `
      <span class="rg-toggle-label">${label}</span>
      <input type="checkbox" class="rg-toggle-switch" ${checked ? 'checked' : ''}>
    `;
    const cb = wrap.querySelector('.rg-toggle-switch');
    cb.addEventListener('change', () => {
      updateConfigKey(key, cb.checked);
    });
    return wrap;
  }

  function triggerHiddenFileUpload(onDataUrl) {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.style.display = 'none';
    document.body.appendChild(inp);
    inp.addEventListener('change', () => {
      const f = inp.files && inp.files[0];
      if (f) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            onDataUrl(e.target.result);
          }
        };
        reader.readAsDataURL(f);
      }
      inp.remove();
    });
    inp.click();
  }

  window.tplBuildAdidasPumaCosmicRegaarderPanes = function (panes, advDrawer, shellRefs) {
    if (!panes || !panes.content) return;
    const cfg = getConfig();

    panes.content.innerHTML = '';
    panes.motion.innerHTML = '';
    if (advDrawer) advDrawer.innerHTML = '';

    // Wire the Top Scene Sub-Toolbar Pager (`<` `Act 1 of 4` `>`) cleanly
    if (shellRefs && shellRefs.sceneToolbar) {
      const tb = shellRefs.sceneToolbar;
      const titleEl = tb.querySelector('.rg-scene-title');
      if (titleEl) titleEl.textContent = 'Cosmic Rift & Spinning Earth';
      const pagerWrap = tb.querySelector('.rg-scene-pager');
      if (pagerWrap) pagerWrap.style.display = 'flex';
      const prevBtn = tb.querySelector('[data-action="prev-scene"]');
      const nextBtn = tb.querySelector('[data-action="next-scene"]');
      const cycleOrder = ['all', 'scene1', 'scene2', 'scene3', 'scene4'];
      if (prevBtn && !prevBtn._apceBound) {
        prevBtn._apceBound = true;
        prevBtn.addEventListener('click', () => {
          const activeId = (typeof topCustomizerState !== 'undefined' && topCustomizerState?.currentTpl?.id) || '';
          if (activeId !== TEMPLATE_ID) return;
          const cur = getConfig().activeSceneFilter || 'all';
          const idx = Math.max(0, cycleOrder.indexOf(cur));
          setActiveSceneFilter(cycleOrder[(idx - 1 + cycleOrder.length) % cycleOrder.length]);
        });
      }
      if (nextBtn && !nextBtn._apceBound) {
        nextBtn._apceBound = true;
        nextBtn.addEventListener('click', () => {
          const activeId = (typeof topCustomizerState !== 'undefined' && topCustomizerState?.currentTpl?.id) || '';
          if (activeId !== TEMPLATE_ID) return;
          const cur = getConfig().activeSceneFilter || 'all';
          const idx = Math.max(0, cycleOrder.indexOf(cur));
          setActiveSceneFilter(cycleOrder[(idx + 1) % cycleOrder.length]);
        });
      }
    }

    const leftThumbSrc = cfg.leftLogoPreset === 'puma'
      ? DEFAULT_LOGO_URIS.pumaLogo
      : cfg.leftLogoPreset === 'nike'
      ? DEFAULT_LOGO_URIS.nikeLogo
      : cfg.leftLogoPreset === 'apple'
      ? DEFAULT_LOGO_URIS.appleLogo
      : (cfg.leftLogoUrl || DEFAULT_LOGO_URIS.adidasLogo);

    const rightThumbSrc = cfg.rightLogoPreset === 'adidas'
      ? DEFAULT_LOGO_URIS.adidasLogo
      : cfg.rightLogoPreset === 'nike'
      ? DEFAULT_LOGO_URIS.nikeLogo
      : cfg.rightLogoPreset === 'apple'
      ? DEFAULT_LOGO_URIS.appleLogo
      : (cfg.rightLogoUrl || DEFAULT_LOGO_URIS.pumaLogo);

    const satThumbSrc = cfg.customSatelliteMapUrl || REFERENCE_PLATES.act4GoogleEarthSat;

    // ========================================================================
    // TAB 1: CONTENT
    // 1A. SCENE STAGE LAYERS CARD (Click any object to show Selection Sheen Box!)
    // ========================================================================
    const stageLayersCard = document.createElement('div');
    stageLayersCard.className = 'rg-inspector-section';
    stageLayersCard.innerHTML = `
      <div class="rg-section-header">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="rg-section-title">Scene Stage Layers</span>
          <div class="rg-speed-pills">
            <button type="button" class="rg-speed-pill ${cfg.activeSceneFilter === 'all' ? 'is-active' : ''}" data-apce-scene-btn="all">All</button>
            ${SCENES.map((sc) => `
              <button type="button" class="rg-speed-pill ${cfg.activeSceneFilter === sc.id ? 'is-active' : ''}" data-apce-scene-btn="${sc.id}">${sc.shortLabel}</button>
            `).join('')}
          </div>
        </div>
        <span class="rg-section-subtitle">Tap any object on stage or below to highlight it with the Selection Sheen Box.</span>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'left_logo_adidas' ? 'is-selected' : ''}" data-select-stage-layer="left_logo_adidas">
        <div class="rg-media-asset-info">
          <img class="rg-media-asset-thumb" data-role="apce-left-layer-thumb" src="${leftThumbSrc}" alt="Left Brand Logo" style="background:#071936;object-fit:contain;padding:4px;">
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">Left Brand Logo</span>
            <span class="rg-media-asset-sub">Adidas Cutout • Act 1 & Act 4 Watermark</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="replace-left-logo">
          ${ENGINE_SVGS.imageIcon}
          <span>Replace</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'right_logo_puma' ? 'is-selected' : ''}" data-select-stage-layer="right_logo_puma">
        <div class="rg-media-asset-info">
          <img class="rg-media-asset-thumb" data-role="apce-right-layer-thumb" src="${rightThumbSrc}" alt="Right Brand Logo" style="background:#2a0615;object-fit:contain;padding:4px;">
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">Right Brand Logo</span>
            <span class="rg-media-asset-sub">PUMA Cutout • Act 1 & Act 4 Watermark</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="replace-right-logo">
          ${ENGINE_SVGS.imageIcon}
          <span>Replace</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'herzog_region_title' ? 'is-selected' : ''}" data-select-stage-layer="herzog_region_title">
        <div class="rg-media-asset-info">
          <img class="rg-media-asset-thumb" src="/assets/aistudio/image_c1794721.png" alt="HERZOGENAURACH Title & Ghost Watermark">
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">HERZOGENAURACH Title</span>
            <span class="rg-media-asset-sub">58° Map Label → Horizontal Ghost Watermark</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="focus-herzog-telemetry">
          ${ENGINE_SVGS.wand}
          <span>Edit</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'herzog_municipal_border' ? 'is-selected' : ''}" data-select-stage-layer="herzog_municipal_border">
        <div class="rg-media-asset-info">
          <img class="rg-media-asset-thumb" src="/assets/aistudio/image_5da88603.png" alt="Herzogenaurach GIS Border">
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">Municipal Border & Tilt-Shift</span>
            <span class="rg-media-asset-sub">GIS Vector Polygon • Exterior DoF Blur</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="focus-herzog-border">
          ${ENGINE_SVGS.layers}
          <span>Border</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'earth_globe_3d' ? 'is-selected' : ''}" data-select-stage-layer="earth_globe_3d">
        <div class="rg-media-asset-info">
          <img class="rg-media-asset-thumb" src="/assets/aistudio/image_601e910b.png" alt="3D Spinning Earth">
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">3D Spinning Earth</span>
            <span class="rg-media-asset-sub">3D Sphere • Thin Limb Crescent</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="focus-globe-motion">
          ${ENGINE_SVGS.globe}
          <span>Spin</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'central_light_rift' ? 'is-selected' : ''}" data-select-stage-layer="central_light_rift">
        <div class="rg-media-asset-info">
          <div class="rg-media-asset-icon">${ENGINE_SVGS.wand}</div>
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">Central Light Rift</span>
            <span class="rg-media-asset-sub">Optical Seam • Custom Path</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn ${cfg.isTracingRiftPath ? 'is-active' : ''}" data-action="toggle-trace-rift">
          ${ENGINE_SVGS.wand}
          <span data-role="trace-btn-label">${cfg.isTracingRiftPath ? 'Done' : 'Trace'}</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'travelling_sun_star' ? 'is-selected' : ''}" data-select-stage-layer="travelling_sun_star">
        <div class="rg-media-asset-info">
          <div class="rg-media-asset-icon">${ENGINE_SVGS.sparkles}</div>
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">Sun-Star & Lens Flare</span>
            <span class="rg-media-asset-sub">4-Point Star • Red↔Blue Halo</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="focus-star-fx">
          ${ENGINE_SVGS.sparkles}
          <span>Optics</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'cosmic_nebula_backdrop' ? 'is-selected' : ''}" data-select-stage-layer="cosmic_nebula_backdrop">
        <div class="rg-media-asset-info">
          <img class="rg-media-asset-thumb" src="/assets/aistudio/image_be30fa77.png" alt="Cosmic Nebula Backdrop">
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">Cosmic Nebula Field</span>
            <span class="rg-media-asset-sub">Dual Cloud Colors & Stardust</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="focus-nebula-look">
          ${ENGINE_SVGS.layers}
          <span>Colors</span>
        </button>
      </div>

      <div class="rg-media-asset-row is-selectable ${cfg.selectedStageLayer === 'satellite_map_plate' ? 'is-selected' : ''}" data-select-stage-layer="satellite_map_plate">
        <div class="rg-media-asset-info">
          <img class="rg-media-asset-thumb" data-role="apce-sat-layer-thumb" src="${satThumbSrc}" alt="Satellite Map Plate">
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">Satellite Map Plate</span>
            <span class="rg-media-asset-sub">Act 4 Multi-LOD Google Earth / Airbus</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn" data-action="replace-sat-map">
          ${ENGINE_SVGS.imageIcon}
          <span>Replace</span>
        </button>
      </div>
    `;

    stageLayersCard.querySelectorAll('[data-apce-scene-btn]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveSceneFilter(btn.getAttribute('data-apce-scene-btn'));
      });
    });

    stageLayersCard.querySelectorAll('.rg-media-asset-row[data-select-stage-layer]').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const layerId = row.getAttribute('data-select-stage-layer');
        selectStageLayerAndFocusInspector(layerId);
      });
    });

    const repLeftBtn = stageLayersCard.querySelector('[data-action="replace-left-logo"]');
    if (repLeftBtn) {
      repLeftBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHiddenFileUpload((dataUrl) => {
          updateConfigKey('leftLogoRemoved', false);
          updateConfigKey('leftLogoPreset', 'custom');
          updateConfigKey('leftLogoUrl', dataUrl);
          getLoadedImage(dataUrl);
          const th = stageLayersCard.querySelector('[data-role="apce-left-layer-thumb"]');
          if (th) th.src = dataUrl;
        });
      });
    }

    const repRightBtn = stageLayersCard.querySelector('[data-action="replace-right-logo"]');
    if (repRightBtn) {
      repRightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHiddenFileUpload((dataUrl) => {
          updateConfigKey('rightLogoRemoved', false);
          updateConfigKey('rightLogoPreset', 'custom');
          updateConfigKey('rightLogoUrl', dataUrl);
          getLoadedImage(dataUrl);
          const th = stageLayersCard.querySelector('[data-role="apce-right-layer-thumb"]');
          if (th) th.src = dataUrl;
        });
      });
    }

    const repSatBtn = stageLayersCard.querySelector('[data-action="replace-sat-map"]');
    if (repSatBtn) {
      repSatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHiddenFileUpload((dataUrl) => {
          updateConfigKey('customSatelliteMapUrl', dataUrl);
          getLoadedImage(dataUrl);
          const th = stageLayersCard.querySelector('[data-role="apce-sat-layer-thumb"]');
          if (th) th.src = dataUrl;
        });
      });
    }

    const traceLayerBtn = stageLayersCard.querySelector('[data-action="toggle-trace-rift"]');
    if (traceLayerBtn) {
      traceLayerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = !cfg.isTracingRiftPath;
        updateConfigKey('isTracingRiftPath', next);
        traceLayerBtn.classList.toggle('is-active', next);
        const lbl = traceLayerBtn.querySelector('[data-role="trace-btn-label"]');
        if (lbl) lbl.textContent = next ? 'Done' : 'Trace';
        if (next && (cfg.activeSceneFilter === 'scene3' || cfg.activeSceneFilter === 'scene4')) {
          setActiveSceneFilter('scene1');
        }
      });
    }

    const focusHerzogTelBtn = stageLayersCard.querySelector('[data-action="focus-herzog-telemetry"]');
    if (focusHerzogTelBtn) {
      focusHerzogTelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveSceneFilter('scene4');
        selectStageLayerAndFocusInspector('herzog_region_title');
      });
    }
    const focusHerzogBorderBtn = stageLayersCard.querySelector('[data-action="focus-herzog-border"]');
    if (focusHerzogBorderBtn) {
      focusHerzogBorderBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveSceneFilter('scene4');
        selectStageLayerAndFocusInspector('herzog_municipal_border');
      });
    }
    const focusGlobeBtn = stageLayersCard.querySelector('[data-action="focus-globe-motion"]');
    if (focusGlobeBtn) {
      focusGlobeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectStageLayerAndFocusInspector('earth_globe_3d');
      });
    }
    const focusStarBtn = stageLayersCard.querySelector('[data-action="focus-star-fx"]');
    if (focusStarBtn) {
      focusStarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectStageLayerAndFocusInspector('travelling_sun_star');
      });
    }
    const focusNebBtn = stageLayersCard.querySelector('[data-action="focus-nebula-look"]');
    if (focusNebBtn) {
      focusNebBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectStageLayerAndFocusInspector('cosmic_nebula_backdrop');
      });
    }

    panes.content.appendChild(stageLayersCard);

    // 1B. BRAND LOGOS, LIVING CLOUD BLEED & SUBSURFACE LIGHT PASS-THROUGH CARD
    const logosCard = document.createElement('div');
    logosCard.className = 'rg-inspector-section';
    logosCard.setAttribute('data-apce-card', 'apce-card-logos');
    logosCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Living Cloud-Bleed Logos</span>
        <span class="rg-section-subtitle">Configure aspect-locked brand cutouts, dynamic cloud turbulence, and light pass-through.</span>
      </div>
    `;
    logosCard.appendChild(createRgSelect('Left Logo Preset', 'leftLogoPreset', [
      { value: 'adidas', label: 'Adidas (3-Stripes + Wordmark)' },
      { value: 'puma', label: 'PUMA (Jumping Cat + Wordmark)' },
      { value: 'nike', label: 'Nike Swoosh Lockup' },
      { value: 'apple', label: 'Apple Lockup' },
      { value: 'custom', label: 'Custom Uploaded Image' }
    ], cfg.leftLogoPreset, (val) => {
      if (val !== 'custom') updateConfigKey('leftLogoRemoved', false);
    }));
    logosCard.appendChild(createRgToggle('Auto-Remove Left Background', 'leftLogoRemoveBg', cfg.leftLogoRemoveBg !== false));
    logosCard.appendChild(createRgSlider('Left Logo Scale', 'leftLogoScale', 0.4, 1.8, 0.05, 'x', cfg.leftLogoScale));
    logosCard.appendChild(createRgSlider('Left Logo Opacity', 'leftLogoOpacity', 0.1, 1.0, 0.02, '', cfg.leftLogoOpacity));

    logosCard.appendChild(createRgSelect('Right Logo Preset', 'rightLogoPreset', [
      { value: 'puma', label: 'PUMA (Jumping Cat + Wordmark)' },
      { value: 'adidas', label: 'Adidas (3-Stripes + Wordmark)' },
      { value: 'nike', label: 'Nike Swoosh Lockup' },
      { value: 'apple', label: 'Apple Lockup' },
      { value: 'custom', label: 'Custom Uploaded Image' }
    ], cfg.rightLogoPreset, (val) => {
      if (val !== 'custom') updateConfigKey('rightLogoRemoved', false);
    }));
    logosCard.appendChild(createRgToggle('Auto-Remove Right Background', 'rightLogoRemoveBg', cfg.rightLogoRemoveBg !== false));
    logosCard.appendChild(createRgSlider('Right Logo Scale', 'rightLogoScale', 0.4, 1.8, 0.05, 'x', cfg.rightLogoScale));
    logosCard.appendChild(createRgSlider('Right Logo Opacity', 'rightLogoOpacity', 0.1, 1.0, 0.02, '', cfg.rightLogoOpacity));
    logosCard.appendChild(createRgSlider('Nebula Cloud Bleed-Through', 'logoCloudBleedStrength', 0.0, 1.0, 0.05, '', cfg.logoCloudBleedStrength));
    logosCard.appendChild(createRgSlider('Logo Internal Cloud Flow Speed', 'logoCloudMotionSpeed', 0.1, 3.0, 0.05, 'x', cfg.logoCloudMotionSpeed));
    logosCard.appendChild(createRgSlider('Logo Light Pass-Through', 'logoLightPassThrough', 0.0, 2.5, 0.05, 'x', cfg.logoLightPassThrough));
    panes.content.appendChild(logosCard);

    // 1C. ACT 4 HERZOGENAURACH GIS BORDER, TILT-SHIFT DOF, TITLE -> GHOST WATERMARK & 3D LOGOS CARD
    const herzogTelemetryCard = document.createElement('div');
    herzogTelemetryCard.className = 'rg-inspector-section';
    herzogTelemetryCard.setAttribute('data-apce-card', 'apce-card-herzog-telemetry');
    herzogTelemetryCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Act 4: Herzogenaurach Border, Title & 3D Logos</span>
        <span class="rg-section-subtitle">Decomposed camera-locked GIS boundary, exterior tilt-shift lens blur, 58° title → horizontal ghost watermark, and 3D glass Adidas/PUMA reveal.</span>
      </div>
    `;
    herzogTelemetryCard.appendChild(createRgSelect('Act 4 Satellite Map Source', 'act4MapSourceMode', [
      { value: 'multi_lod_authentic', label: 'Clean Multi-Scale Google Earth + Airbus (Recommended)' },
      { value: 'ai_drone_video', label: 'Uploaded AI Aerial Drone Video (MP4) + Live Overlays' },
      { value: 'reference_sequence_plates', label: 'Original 9 Documentary Reference Plates' },
      { value: 'custom_uploaded', label: 'Custom Uploaded Map Plate' }
    ], cfg.act4MapSourceMode || 'multi_lod_authentic'));
    herzogTelemetryCard.appendChild(createRgToggle('Show Region Title (HERZOGENAURACH)', 'herzogTitleEnabled', cfg.herzogTitleEnabled !== false));
    herzogTelemetryCard.appendChild(createRgText('Region Title Text', 'herzogTitleText', cfg.herzogTitleText || 'HERZOGENAURACH'));
    herzogTelemetryCard.appendChild(createRgSlider('Map-Locked Title Angle', 'herzogTitleAngleDeg', -90, 90, 1, '°', cfg.herzogTitleAngleDeg ?? 58));
    herzogTelemetryCard.appendChild(createRgSlider('Title & Watermark Scale', 'herzogTitleScale', 0.4, 2.2, 0.05, 'x', cfg.herzogTitleScale ?? 1.0));
    herzogTelemetryCard.appendChild(createRgToggle('Climax Horizontal Ghost Watermark', 'herzogGhostWatermarkEnabled', cfg.herzogGhostWatermarkEnabled !== false));
    herzogTelemetryCard.appendChild(createRgSlider('Horizontal Ghost Watermark Opacity', 'herzogGhostWatermarkOpacity', 0.05, 0.65, 0.02, '', cfg.herzogGhostWatermarkOpacity ?? 0.22));
    herzogTelemetryCard.appendChild(createRgToggle('Show GIS Municipal Border', 'herzogBorderEnabled', cfg.herzogBorderEnabled !== false));
    herzogTelemetryCard.appendChild(createRgSlider('Municipal Border Stroke Width', 'herzogBorderWidthPx', 1.0, 8.0, 0.2, 'px', cfg.herzogBorderWidthPx ?? 2.8));
    herzogTelemetryCard.appendChild(createRgColor('Municipal Border Color', 'herzogBorderColor', cfg.herzogBorderColor || '#ffffff'));
    herzogTelemetryCard.appendChild(createRgColor('Border Outer Bloom Color', 'herzogBorderGlowColor', cfg.herzogBorderGlowColor || '#7dd3fc'));
    herzogTelemetryCard.appendChild(createRgToggle('Exterior Tilt-Shift DoF Blur', 'herzogTiltShiftBlurEnabled', cfg.herzogTiltShiftBlurEnabled !== false));
    herzogTelemetryCard.appendChild(createRgSlider('Tilt-Shift Blur Intensity', 'herzogTiltShiftIntensity', 0.0, 2.0, 0.05, 'x', cfg.herzogTiltShiftIntensity ?? 1.15));
    herzogTelemetryCard.appendChild(createRgToggle('Climax 3D Glass Adidas & PUMA Logos', 'act4TerritorialLogosEnabled', cfg.act4TerritorialLogosEnabled !== false));
    herzogTelemetryCard.appendChild(createRgSlider('3D Territorial Logo Opacity', 'act4TerritorialLogoOpacity', 0.10, 0.85, 0.02, '', cfg.act4TerritorialLogoOpacity ?? 0.36));
    herzogTelemetryCard.appendChild(createRgSlider('3D Bevel Extrusion Depth', 'act4TerritorialLogo3DDepth', 0.0, 2.2, 0.05, 'x', cfg.act4TerritorialLogo3DDepth ?? 1.15));
    panes.content.appendChild(herzogTelemetryCard);

    // 1D. TARGET REGION, MACRO MAP MODE & SATELLITE ATTRIBUTION CARD
    const earthContentCard = document.createElement('div');
    earthContentCard.className = 'rg-inspector-section';
    earthContentCard.setAttribute('data-apce-card', 'apce-card-earth-content');
    earthContentCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Target Region & Zoomed Map Mode</span>
        <span class="rg-section-subtitle">Choose between the real photographic night satellite map or continual 3D globe in Act 3.</span>
      </div>
    `;
    earthContentCard.appendChild(createRgSelect('Act 3 Zoomed Map Mode', 'macroMapMode', [
      { value: 'photographic_authentic', label: 'Real Night Satellite Photo Plate (Authentic)' },
      { value: 'continual_3d_globe', label: 'Continual 3D Spherical Globe Zoom' },
      { value: 'procedural_vector', label: 'Clean Pinpoint Urban Corridor Map' }
    ], cfg.macroMapMode));
    earthContentCard.appendChild(createRgSelect('Globe Target Region', 'globeTargetRegion', [
      { value: 'europe_germany', label: 'Europe / Germany (Herzogenaurach)' },
      { value: 'north_america', label: 'North America (Eastern Seaboard)' },
      { value: 'east_asia', label: 'East Asia (Tokyo / Shanghai)' },
      { value: 'global', label: 'Atlantic / Global Center' }
    ], cfg.globeTargetRegion));
    earthContentCard.appendChild(createRgToggle('Regional Glow Highlight', 'regionHighlightEnabled', cfg.regionHighlightEnabled !== false));
    earthContentCard.appendChild(createRgColor('Regional Highlight Color', 'regionHighlightColor', cfg.regionHighlightColor || '#fde047'));
    earthContentCard.appendChild(createRgToggle('Google Earth Attribution', 'showGoogleEarthWatermark', cfg.showGoogleEarthWatermark !== false));
    earthContentCard.appendChild(createRgText('Watermark Title', 'googleEarthWatermarkText', cfg.googleEarthWatermarkText));
    earthContentCard.appendChild(createRgText('Attribution Subtext', 'googleEarthSubText', cfg.googleEarthSubText));
    panes.content.appendChild(earthContentCard);

    // ========================================================================
    // TAB 2: MOTION — GLOBE SPIN REVOLUTIONS, DIRECTION, GRAVITY & STAR PATH
    // ========================================================================
    const globeMotionCard = document.createElement('div');
    globeMotionCard.className = 'rg-inspector-section';
    globeMotionCard.setAttribute('data-apce-card', 'apce-card-globe-motion');
    globeMotionCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Globe Spin Count & Gravity Zoom</span>
        <span class="rg-section-subtitle">Control how many revolutions the Earth spins, rotation direction, and gravity pull.</span>
      </div>
    `;
    globeMotionCard.appendChild(createRgSelect('Globe Spin Direction', 'globeSpinDirection', [
      { value: 'west_to_east_authentic', label: 'Left to Right / West-to-East (Authentic)' },
      { value: 'east_to_west', label: 'Right to Left / East-to-West' },
      { value: 'north_to_south', label: 'Up to Down / North-to-South' },
      { value: 'south_to_north', label: 'Down to Up / South-to-North' },
      { value: 'diagonal_tumble', label: 'Diagonal 3D Orbital Tumble' }
    ], cfg.globeSpinDirection));
    globeMotionCard.appendChild(createRgSlider('Globe Spin Revolutions (Spins)', 'globeSpinRevolutions', 0.25, 5.0, 0.05, 'x', cfg.globeSpinRevolutions));
    globeMotionCard.appendChild(createRgSlider('Globe Rotation Speed', 'globeSpinSpeed', 0.2, 2.5, 0.05, 'x', cfg.globeSpinSpeed));
    globeMotionCard.appendChild(createRgSlider('Gravity Zoom Acceleration', 'globeGravityAcceleration', 0.5, 2.2, 0.05, 'x', cfg.globeGravityAcceleration));
    globeMotionCard.appendChild(createRgSlider('Initial Globe Scale', 'globeInitialScale', 0.08, 0.28, 0.005, 'x', cfg.globeInitialScale));
    panes.motion.appendChild(globeMotionCard);

    const starMotionCard = document.createElement('div');
    starMotionCard.className = 'rg-inspector-section';
    starMotionCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Star Trajectory & Cloud Dive</span>
        <span class="rg-section-subtitle">Control the star travelling from Puma to the middle rift to the blue Adidas side.</span>
      </div>
    `;
    starMotionCard.appendChild(createRgSelect('Star Trajectory Path', 'starTrajectoryMode', [
      { value: 'right_to_left_authentic', label: 'Right -> Middle Rift -> Left Blue (Authentic)' },
      { value: 'left_to_right', label: 'Left -> Middle Rift -> Right Red' },
      { value: 'top_to_bottom', label: 'Top to Bottom Along Rift' },
      { value: 'bottom_to_top', label: 'Bottom to Top Along Rift' },
      { value: 'orbit_globe', label: '360° Orbit Around Globe' }
    ], cfg.starTrajectoryMode));
    starMotionCard.appendChild(createRgSlider('Star Travel Speed', 'starTravelSpeed', 0.3, 2.5, 0.05, 'x', cfg.starTravelSpeed));
    starMotionCard.appendChild(createRgSlider('Cloud Dive Speed', 'cloudDiveSpeed', 0.3, 2.5, 0.05, 'x', cfg.cloudDiveSpeed));
    panes.motion.appendChild(starMotionCard);

    // ========================================================================
    // TAB 3: LOOK — DUAL COSMIC NEBULA COLORS, RIFT PATH & GRANULAR GLOBE LIGHT
    // ========================================================================
    const nebulaLookCard = document.createElement('div');
    nebulaLookCard.className = 'rg-inspector-section';
    nebulaLookCard.setAttribute('data-apce-card', 'apce-card-nebula-look');
    nebulaLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Dual Cosmic Nebula Palette</span>
        <span class="rg-section-subtitle">Customize the left sapphire-blue and right crimson-burgundy cosmic clouds.</span>
      </div>
    `;
    nebulaLookCard.appendChild(createRgSelect('Nebula Palette Preset', 'nebulaPalettePreset', [
      { value: 'authentic_blue_crimson', label: 'Sapphire Blue vs. Velvet Crimson (Authentic)' },
      { value: 'gold_purple', label: 'Imperial Gold vs. Royal Violet' },
      { value: 'emerald_amber', label: 'Emerald Matrix vs. Solar Amber' },
      { value: 'cyber_neon', label: 'Cyber Cyan vs. Hot Magenta' }
    ], cfg.nebulaPalettePreset));
    nebulaLookCard.appendChild(createRgColor('Left Nebula Primary', 'leftNebulaPrimaryColor', cfg.leftNebulaPrimaryColor));
    nebulaLookCard.appendChild(createRgColor('Left Nebula Highlight', 'leftNebulaSecondaryColor', cfg.leftNebulaSecondaryColor));
    nebulaLookCard.appendChild(createRgColor('Right Nebula Primary', 'rightNebulaPrimaryColor', cfg.rightNebulaPrimaryColor));
    nebulaLookCard.appendChild(createRgColor('Right Nebula Highlight', 'rightNebulaSecondaryColor', cfg.rightNebulaSecondaryColor));
    nebulaLookCard.appendChild(createRgSlider('Nebula Cloud Density', 'nebulaCloudDensity', 0.2, 1.5, 0.05, 'x', cfg.nebulaCloudDensity));
    panes.look.appendChild(nebulaLookCard);

    const riftLookCard = document.createElement('div');
    riftLookCard.className = 'rg-inspector-section';
    riftLookCard.setAttribute('data-apce-card', 'apce-card-rift-look');
    riftLookCard.innerHTML = `
      <div class="rg-section-header">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="rg-section-title">Granular Globe Rim & Light Rift</span>
          <div style="display:flex;gap:5px;">
            <button type="button" class="rg-action-pill-btn is-accent" data-action="look-trace-rift">
              ${ENGINE_SVGS.wand}
              <span data-role="look-trace-label">${cfg.isTracingRiftPath ? 'Done Tracing' : 'Trace Rift'}</span>
            </button>
            <button type="button" class="rg-action-pill-btn" data-action="look-reset-rift" title="Reset Rift Path">
              ${ENGINE_SVGS.rotateCcw}
            </button>
          </div>
        </div>
        <span class="rg-section-subtitle">Fine-tune the thin atmospheric daylight crescent, sun angle, and central light rift.</span>
      </div>
    `;
    const lookTraceBtn = riftLookCard.querySelector('[data-action="look-trace-rift"]');
    if (lookTraceBtn) {
      lookTraceBtn.addEventListener('click', () => {
        const next = !cfg.isTracingRiftPath;
        updateConfigKey('isTracingRiftPath', next);
        const lbl = lookTraceBtn.querySelector('[data-role="look-trace-label"]');
        if (lbl) lbl.textContent = next ? 'Done Tracing' : 'Trace Rift';
      });
    }
    const lookResetBtn = riftLookCard.querySelector('[data-action="look-reset-rift"]');
    if (lookResetBtn) {
      lookResetBtn.addEventListener('click', () => {
        updateConfigKey('isTracingRiftPath', false);
        updateConfigKey('customRiftPoints', []);
        updateConfigKey('riftPathMode', 'vertical_authentic');
        _nebulaCacheKey = '';
      });
    }
    riftLookCard.appendChild(createRgSlider('Daylight Crescent Width', 'globeCrescentWidth', 0.06, 0.45, 0.01, '', cfg.globeCrescentWidth));
    riftLookCard.appendChild(createRgSlider('Sun Illumination Angle', 'globeSunAngleDeg', 0, 360, 2, '°', cfg.globeSunAngleDeg));
    riftLookCard.appendChild(createRgSlider('Daylight Rim Intensity', 'globeDaylightRimIntensity', 0.2, 2.2, 0.05, 'x', cfg.globeDaylightRimIntensity));
    riftLookCard.appendChild(createRgSlider('City Lights Brightness', 'globeCityLightsIntensity', 0.3, 2.4, 0.05, 'x', cfg.globeCityLightsIntensity));
    riftLookCard.appendChild(createRgColor('Daylight Crescent Rim', 'globeDaylightRimColor', cfg.globeDaylightRimColor));
    riftLookCard.appendChild(createRgSelect('Light Rift Geometry', 'riftPathMode', [
      { value: 'vertical_authentic', label: 'Vertical Split (Authentic)' },
      { value: 'diagonal_clash', label: 'Diagonal Slash Split' },
      { value: 's_curve', label: 'Flowing S-Curve Faultline' },
      { value: 'lightning_rift', label: 'Jagged Lightning Rift' },
      { value: 'custom_traced', label: 'Custom Traced Path' }
    ], cfg.riftPathMode, () => {
      _nebulaCacheKey = '';
    }));
    riftLookCard.appendChild(createRgColor('Rift Left Glow', 'riftLeftGlowColor', cfg.riftLeftGlowColor));
    riftLookCard.appendChild(createRgColor('Rift Right Glow', 'riftRightGlowColor', cfg.riftRightGlowColor));
    riftLookCard.appendChild(createRgSelect('Satellite Terrain Grade', 'satelliteTerrainStyle', [
      { value: 'authentic_daylight', label: 'Daylight Satellite (Authentic)' },
      { value: 'tactical_dark', label: 'Tactical Night Satellite' },
      { value: 'emerald_topo', label: 'Emerald Topographic' }
    ], cfg.satelliteTerrainStyle));
    panes.look.appendChild(riftLookCard);

    // ========================================================================
    // TAB 4: EFFECTS — 3-TIER STARFIELD, CROSS-HEMISPHERE HALO & CLOUDS
    // ========================================================================
    const ambianceFxCard = document.createElement('div');
    ambianceFxCard.className = 'rg-inspector-section';
    ambianceFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">3-Tier Twinkling Starfield & Ambiance</span>
        <span class="rg-section-subtitle">Control thousands of micro-stardust grains, twinkling speed & intensity, and diamond glints.</span>
      </div>
    `;
    ambianceFxCard.appendChild(createRgSelect('Ambiance Mode', 'ambianceMode', [
      { value: 'stars', label: 'Twinkling Space Stars (Authentic)' },
      { value: 'rain', label: 'Atmospheric Neon Rain' },
      { value: 'snow', label: 'Drifting Winter Snow' },
      { value: 'embers', label: 'Rising Fire Embers' },
      { value: 'cosmic_dust', label: 'Floating Quantum Dust' }
    ], cfg.ambianceMode));
    ambianceFxCard.appendChild(createRgSlider('Micro-Stardust Count', 'microStardustCount', 0, 2500, 50, '', cfg.microStardustCount));
    ambianceFxCard.appendChild(createRgSlider('Twinkling Star Count', 'ambianceParticleCount', 0, 800, 10, '', cfg.ambianceParticleCount));
    ambianceFxCard.appendChild(createRgSlider('Star Twinkle Intensity', 'ambianceTwinkleIntensity', 0.0, 2.5, 0.05, 'x', cfg.ambianceTwinkleIntensity));
    ambianceFxCard.appendChild(createRgSlider('Star Twinkle Speed', 'ambianceTwinkleSpeed', 0.1, 4.0, 0.05, 'x', cfg.ambianceTwinkleSpeed));
    ambianceFxCard.appendChild(createRgSlider('Drift / Fall Speed', 'ambianceParticleSpeed', 0.2, 2.5, 0.05, 'x', cfg.ambianceParticleSpeed));
    ambianceFxCard.appendChild(createRgToggle('Prominent Puma & Rift Stars', 'prominentPumaStarEnabled', cfg.prominentPumaStarEnabled !== false));
    panes.effects.appendChild(ambianceFxCard);

    const refractionFxCard = document.createElement('div');
    refractionFxCard.className = 'rg-inspector-section';
    refractionFxCard.setAttribute('data-apce-card', 'apce-card-refraction-fx');
    refractionFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Cross-Hemisphere Halo & Lens Flare</span>
        <span class="rg-section-subtitle">Tune the Red↔Blue counter-moving neon halos, star size, and rift pinch blooms.</span>
      </div>
    `;
    refractionFxCard.appendChild(createRgToggle('Cross-Hemisphere Neon Halo', 'neonRefractionEnabled', cfg.neonRefractionEnabled !== false));
    refractionFxCard.appendChild(createRgSlider('Red↔Blue Halo Intensity', 'crossHemisphereHaloIntensity', 0.0, 2.5, 0.05, 'x', cfg.crossHemisphereHaloIntensity));
    refractionFxCard.appendChild(createRgSlider('Anamorphic Flare Ribbon', 'neonRefractionIntensity', 0.0, 2.5, 0.05, 'x', cfg.neonRefractionIntensity));
    refractionFxCard.appendChild(createRgSlider('Travelling Star Size', 'starCoreSize', 0.4, 2.5, 0.05, 'x', cfg.starCoreSize));
    refractionFxCard.appendChild(createRgColor('Cyan Refraction Fringe', 'neonRefractionTopColor', cfg.neonRefractionTopColor));
    refractionFxCard.appendChild(createRgColor('Magenta-Rose Halo Fringe', 'neonRefractionBottomColor', cfg.neonRefractionBottomColor));
    refractionFxCard.appendChild(createRgSlider('Light Rift Core Width', 'riftWidthPx', 3, 32, 1, 'px', cfg.riftWidthPx));
    refractionFxCard.appendChild(createRgSlider('Pole Rim Kiss Intensity', 'riftCenterPinchFlare', 0.0, 2.2, 0.05, 'x', cfg.riftCenterPinchFlare));
    refractionFxCard.appendChild(createRgSlider('Stratospheric Cloud Density', 'cloudDiveDensity', 0.2, 2.0, 0.05, 'x', cfg.cloudDiveDensity));
    panes.effects.appendChild(refractionFxCard);

    // ========================================================================
    // ADVANCED CONTROLS DRAWER
    // ========================================================================
    if (advDrawer) {
      const advCard = document.createElement('div');
      advCard.className = 'rg-inspector-section';
      advCard.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Sequence Timing, Selection Box & Offsets</span>
          <span class="rg-section-subtitle">Fine-tune global playback speed, on-stage selection box, and X/Y stage alignment.</span>
        </div>
      `;
      advCard.appendChild(createRgToggle('On-Stage Selection Sheen Box', 'showStageSelectionBox', cfg.showStageSelectionBox !== false));
      advCard.appendChild(createRgSlider('Sequence Playback Speed', 'playbackSpeed', 0.3, 2.5, 0.05, 'x', cfg.playbackSpeed));
      advCard.appendChild(createRgSlider('Left Logo X Offset', 'leftLogoOffsetX', -240, 240, 2, 'px', cfg.leftLogoOffsetX));
      advCard.appendChild(createRgSlider('Left Logo Y Offset', 'leftLogoOffsetY', -180, 180, 2, 'px', cfg.leftLogoOffsetY));
      advCard.appendChild(createRgSlider('Right Logo X Offset', 'rightLogoOffsetX', -240, 240, 2, 'px', cfg.rightLogoOffsetX));
      advCard.appendChild(createRgSlider('Right Logo Y Offset', 'rightLogoOffsetY', -180, 180, 2, 'px', cfg.rightLogoOffsetY));
      advCard.appendChild(createRgSlider('3D Globe X Offset', 'globeOffsetX', -240, 240, 2, 'px', cfg.globeOffsetX));
      advCard.appendChild(createRgSlider('3D Globe Y Offset', 'globeOffsetY', -180, 180, 2, 'px', cfg.globeOffsetY));
      advCard.appendChild(createRgSlider('Central Rift X Offset', 'riftOffsetX', -240, 240, 2, 'px', cfg.riftOffsetX));
      advDrawer.appendChild(advCard);
    }
  };

  window.tplBuildAdidasPumaCosmicInspector = function (containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = `<div id="apce-inspector-root" style="display:none;"></div>`;
    if (typeof window.organizeUniversalTemplateControls === 'function') {
      window.organizeUniversalTemplateControls();
    }
  };

  // ==========================================================================
  // 15. GLOBAL EXPORTS
  // ==========================================================================
  window.buildAdidasPumaCosmicHtml = buildAdidasPumaCosmicHtml;
  window.tplMountAdidasPumaCosmicStage = tplMountAdidasPumaCosmicStage;
  window.stepAdidasPumaCosmicAnimation = stepAdidasPumaCosmicAnimation;
  window.renderAdidasPumaCosmicCanvas = renderAdidasPumaCosmicCanvas;
})();
