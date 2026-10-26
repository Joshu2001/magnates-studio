/**
 * ============================================================================
 * ADIDAS VS. PUMA: COSMIC RIFT, OPTICAL REFRACTION, 3D GRAVITY GLOBE &
 * GOOGLE EARTH CLOUD-DIVE ENGINE
 * (TEMPLATE_ID: 'adidas-puma-cosmic-earth-suite')
 * ============================================================================
 * Scientifically reverse-engineered from the 28 reference frames:
 * - Act 1 (0.0s – 2.4s): Dual-Faction Cosmic Nebula Split (Electric Blue Left /
 *   Crimson-Magenta Right), Semi-Transparent Cloud-Bleed Logos (Adidas & Puma)
 *   with automatic background removal, Central Plasma Rift of Light (with
 *   interactive on-stage manual path tracing), Ambiance Particle Field (Stars /
 *   Rain / Snow / Embers / Dust), and the Travelling White Sun-Star moving
 *   Right-to-Left while its Counter-Vector Neon Optical Refraction Rings sweep
 *   Left-to-Right across the bottom of the globe and over PUMA.
 * - Act 2 (2.4s – 5.2s): Star reaches the first Adidas stripe -> Accelerating
 *   Gravitational Camera Zoom + 3D Earth Globe Self-Spin (North America rotates
 *   to the sunlit upper-left limb while the Atlantic & Europe rotate into view),
 *   complete with the cyan-white Daylight Terminator Crescent Rim Light and
 *   curved Atlantic shadow band.
 * - Act 3 (5.2s – 8.2s): Full-Screen Macro City Lights of Europe & Germany
 *   (Herzogenaurach) with glowing urban nodes, subtle regional border glow, and
 *   night-to-stratosphere transition as volumetric dark storm clouds billow in.
 * - Act 4 (8.2s – 12.0s): High-Altitude Stratospheric Cloud Breakthrough into
 *   Daytime Google Earth Satellite Terrain with drifting white cumulus clouds,
 *   subtle regional map highlight, and customizable Google Earth attribution.
 * ============================================================================
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'adidas-puma-cosmic-earth-suite';

  const SCENES = [
    {
      id: 'scene1',
      index: 1,
      title: '1. Cosmic Rift & Optical Flare',
      sub: '0.0s – 2.4s • Dual Nebula, Adidas/Puma & Counter Flare',
      start: 0.0,
      end: 2.4
    },
    {
      id: 'scene2',
      index: 2,
      title: '2. Gravity Globe Spin & Rim Light',
      sub: '2.4s – 5.2s • Accelerating Spin & Daylight Crescent',
      start: 2.4,
      end: 5.2
    },
    {
      id: 'scene3',
      index: 3,
      title: '3. Europe City Lights Macro',
      sub: '5.2s – 8.2s • Glowing Urban Grid & Regional Map',
      start: 5.2,
      end: 8.2
    },
    {
      id: 'scene4',
      index: 4,
      title: '4. Cloud Dive & Google Earth',
      sub: '8.2s – 12.0s • Stratospheric Clouds & Satellite Map',
      start: 8.2,
      end: 12.0
    }
  ];

  // ==========================================================================
  // 1. HIGH-DEFINITION VECTOR LOGO CUTOUTS (TRANSPARENT SVG DATA URIS)
  // ==========================================================================
  function svgToDataUri(svgString) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString.trim());
  }

  const DEFAULT_LOGO_URIS = {
    // Authentic Adidas 3-Stripes Mountain + "adidas" Wordmark (matches image_be30fa77.png)
    adidasLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
        <g fill="#ffffff">
          <!-- Three tilted parallel stripes forming the mountain -->
          <polygon points="88,242 166,196 202,242"/>
          <polygon points="184,185 262,139 326,242 220,242"/>
          <polygon points="280,128 358,82 452,242 346,242"/>
          <!-- Bold geometric lowercase 'adidas' wordmark -->
          <text x="275" y="348" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="126" letter-spacing="-3">adidas</text>
        </g>
      </svg>
    `),

    // Authentic PUMA Jumping Cat + bold condensed "PUMA®" Wordmark (matches image_be30fa77.png)
    pumaLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
        <g fill="#ffffff">
          <!-- Leaping Puma Cat Silhouette above the M/A -->
          <path d="M 326,120 C 335,108 352,104 366,108 C 374,102 384,103 390,111 C 412,118 446,136 482,158 C 514,176 544,184 568,176 C 592,166 612,138 628,112 C 633,104 642,109 637,119 C 618,152 595,180 566,190 C 574,208 588,236 604,262 C 610,272 598,282 588,272 C 568,248 552,218 538,196 C 504,188 468,170 436,154 C 416,144 396,142 380,148 C 362,154 344,162 328,162 C 316,162 312,150 322,144 C 332,140 342,138 350,134 C 338,132 324,128 326,120 Z"/>
          <!-- Blocky Impact/Condensed PUMA Wordmark -->
          <text x="275" y="346" text-anchor="middle" font-family="'Oswald', 'Impact', 'Arial Black', sans-serif" font-weight="800" font-size="146" letter-spacing="2" transform="scale(1.08, 1)">PUMA</text>
          <!-- Registered Trademark Circle -->
          <circle cx="578" cy="322" r="21" fill="none" stroke="#ffffff" stroke-width="5"/>
          <text x="578" y="330" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="23">R</text>
        </g>
      </svg>
    `),

    nikeLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
        <g fill="#ffffff">
          <path d="M 145,205 C 115,245 95,285 118,308 C 142,332 195,318 255,292 L 515,178 C 525,173 522,165 512,168 L 238,242 C 192,254 158,245 152,212 C 150,202 148,200 145,205 Z"/>
          <text x="300" y="165" text-anchor="middle" font-family="'Oswald', 'Impact', sans-serif" font-weight="900" font-style="italic" font-size="112" letter-spacing="4">NIKE</text>
        </g>
      </svg>
    `),

    appleLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
        <g fill="#ffffff" transform="translate(180, 30) scale(0.95)">
          <path d="M188.5 145.2c-.4-38.3 31.3-56.8 32.7-57.7-17.9-26.1-45.6-29.7-55.4-30.1-23.4-2.4-46.1 13.9-58 13.9-12.1 0-30.5-13.6-50.2-13.2-25.7.4-49.5 15-62.7 38-26.9 46.6-6.9 115.4 19.1 153.1 12.8 18.5 27.9 39.2 47.8 38.5 19.3-.8 26.6-12.4 49.9-12.4 23.1 0 29.9 12.4 50.1 12 20.8-.4 33.9-18.7 46.5-37.3 14.8-21.5 20.8-42.4 21.1-43.5-.5-.2-40.5-15.5-40.9-61.3zM150.3 42.1c10.5-12.8 17.6-30.4 15.6-48.1-15.2.6-33.8 10.1-44.6 22.8-9.6 11.1-18.1 29.1-15.8 46.4 17 1.3 34.3-8.4 44.8-21.1z"/>
          <text x="125" y="355" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="88">Apple</text>
        </g>
      </svg>
    `)
  };

  // ==========================================================================
  // 2. IMAGE CACHE & AUTOMATIC BACKGROUND REMOVAL PROCESSOR
  // ==========================================================================
  const _imageCache = new Map();
  const _processedBgRemovedCache = new Map();

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
   * Automatically strips solid white or solid black backgrounds from user-uploaded
   * logos so they blend with the cosmic clouds just like the transparent cutouts.
   */
  function getBgRemovedLogoCanvas(imgRec, srcKey, removeBgEnabled, threshold = 38) {
    if (!imgRec || !imgRec.loaded) return null;
    if (!removeBgEnabled || srcKey.startsWith('data:image/svg+xml')) {
      return imgRec.img;
    }
    const cacheKey = `${srcKey}__${threshold}`;
    if (_processedBgRemovedCache.has(cacheKey)) {
      return _processedBgRemovedCache.get(cacheKey);
    }
    try {
      const iw = Math.min(imgRec.img.naturalWidth || 512, 640);
      const ih = Math.min(imgRec.img.naturalHeight || 512, 640);
      const c = document.createElement('canvas');
      c.width = iw;
      c.height = ih;
      const cctx = c.getContext('2d');
      cctx.drawImage(imgRec.img, 0, 0, iw, ih);
      const imgData = cctx.getImageData(0, 0, iw, ih);
      const d = imgData.data;
      // Sample corner pixel to detect background color
      const bgR = d[0], bgG = d[1], bgB = d[2], bgA = d[3];
      if (bgA > 200) {
        const tol = Math.max(12, threshold);
        for (let i = 0; i < d.length; i += 4) {
          const dr = Math.abs(d[i] - bgR);
          const dg = Math.abs(d[i + 1] - bgG);
          const db = Math.abs(d[i + 2] - bgB);
          const dist = (dr + dg + db) / 3;
          if (dist < tol) {
            d[i + 3] = 0;
          } else if (dist < tol * 1.6) {
            d[i + 3] = Math.round(d[i + 3] * ((dist - tol) / (tol * 0.6)));
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
  // 3. DEFAULT CONFIGURATION STATE
  // ==========================================================================
  function createDefaultAdidasPumaConfig() {
    return {
      type: TEMPLATE_ID,
      activeSceneFilter: 'all',
      cleanScreenHudHidden: false,
      playbackSpeed: 1.0,
      isTracingRiftPath: false,

      // ----------------------------------------------------------------------
      // LEFT & RIGHT LOGOS + AUTOMATIC BACKGROUND REMOVAL
      // ----------------------------------------------------------------------
      leftLogoPreset: 'adidas',
      leftLogoUrl: DEFAULT_LOGO_URIS.adidasLogo,
      leftLogoTitle: 'adidas',
      leftLogoTint: '#38bdf8',
      leftLogoOpacity: 0.78,
      leftLogoScale: 1.0,
      leftLogoOffsetX: 0,
      leftLogoOffsetY: 0,
      leftLogoRemoveBg: true,

      rightLogoPreset: 'puma',
      rightLogoUrl: DEFAULT_LOGO_URIS.pumaLogo,
      rightLogoTitle: 'PUMA',
      rightLogoTint: '#f43f5e',
      rightLogoOpacity: 0.82,
      rightLogoScale: 1.0,
      rightLogoOffsetX: 0,
      rightLogoOffsetY: 0,
      rightLogoRemoveBg: true,

      logoCloudBleedStrength: 0.58,

      // ----------------------------------------------------------------------
      // DUAL COSMIC NEBULA COLORS & VOLUMETRIC CLOUDS
      // ----------------------------------------------------------------------
      nebulaPalettePreset: 'authentic_blue_crimson',
      leftNebulaPrimaryColor: '#0066ff',
      leftNebulaSecondaryColor: '#0ea5e9',
      leftNebulaDeepColor: '#021028',
      rightNebulaPrimaryColor: '#e11d48',
      rightNebulaSecondaryColor: '#ec4899',
      rightNebulaDeepColor: '#2a0410',
      nebulaCloudDensity: 0.88,
      nebulaCloudSpeed: 1.0,

      // ----------------------------------------------------------------------
      // CENTRAL LIGHT RIFT & INTERACTIVE MANUAL PATH TRACER
      // ----------------------------------------------------------------------
      riftPathMode: 'vertical_authentic', // 'vertical_authentic' | 'diagonal_clash' | 's_curve' | 'lightning_rift' | 'custom_traced'
      customRiftPoints: [], // Array of { x: 0..1, y: 0..1 } traced directly by user on stage
      riftCoreColor: '#ffffff',
      riftLeftGlowColor: '#38bdf8',
      riftRightGlowColor: '#f472b6',
      riftWidthPx: 18,
      riftGlowIntensity: 1.15,
      riftCenterPinchFlare: 1.2,

      // ----------------------------------------------------------------------
      // AMBIANCE PARTICLES (STARS, RAIN, SNOW, EMBERS, COSMIC DUST)
      // ----------------------------------------------------------------------
      ambianceMode: 'stars', // 'stars' | 'rain' | 'snow' | 'embers' | 'cosmic_dust'
      ambianceParticleCount: 220,
      ambianceParticleSpeed: 1.0,
      ambianceTwinkleIntensity: 1.0,
      prominentPumaStarEnabled: true,

      // ----------------------------------------------------------------------
      // TRAVELLING SUN-STAR & COUNTER-MOVING NEON LENS FLARE REFRACTION
      // ----------------------------------------------------------------------
      starTrajectoryMode: 'right_to_left_authentic', // 'right_to_left_authentic' | 'left_to_right' | 'top_to_bottom' | 'bottom_to_top' | 'orbit_globe'
      starTravelSpeed: 1.0,
      starCoreSize: 1.0,
      starFlareColor: '#ffffff',
      neonRefractionEnabled: true,
      neonRefractionIntensity: 1.15,
      neonRefractionTopColor: '#38bdf8',
      neonRefractionBottomColor: '#ec4899',
      neonRefractionRingCount: 4,

      // ----------------------------------------------------------------------
      // 3D SPINNING EARTH GLOBE, TERMINATOR RIM LIGHT & GRAVITY ZOOM
      // ----------------------------------------------------------------------
      globeSpinDirection: 'west_to_east_authentic', // 'west_to_east_authentic' | 'east_to_west' | 'north_to_south' | 'south_to_north' | 'diagonal_tumble'
      globeSpinSpeed: 1.15,
      globeGravityAcceleration: 1.25,
      globeInitialScale: 0.135,
      globeDaylightRimColor: '#7dd3fc',
      globeDaylightRimIntensity: 1.25,
      globeTerminatorShadowArc: true,
      globeCityLightsColor: '#fef08a',
      globeCityLightsIntensity: 1.25,
      globeTargetRegion: 'europe_germany', // 'europe_germany' | 'north_america' | 'east_asia' | 'global'

      // ----------------------------------------------------------------------
      // ACT 3 & 4: EUROPE CITY LIGHTS MACRO, CLOUD DIVE & GOOGLE EARTH MAP
      // ----------------------------------------------------------------------
      regionHighlightEnabled: true,
      regionHighlightColor: '#38bdf8',
      cloudDiveDensity: 1.15,
      cloudDiveSpeed: 1.15,
      satelliteTerrainStyle: 'authentic_daylight', // 'authentic_daylight' | 'tactical_dark' | 'emerald_topo'
      googleEarthWatermarkText: 'Google Earth',
      googleEarthSubText: 'Landsat / Copernicus, Data SIO, NOAA',
      showGoogleEarthWatermark: true
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
        if (k === 'activeSceneFilter' || k === 'cleanScreenHudHidden' || k === 'isTracingRiftPath' || k === 'customRiftPoints') return;
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

  // Preload default logos
  Object.values(DEFAULT_LOGO_URIS).forEach((uri) => getLoadedImage(uri));

  // ==========================================================================
  // 4. DETERMINISTIC MATH & COLOR HELPERS
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
  // 5. HIGH-RES OFFSCREEN WORLD NIGHT-LIGHTS & SATELLITE TERRAIN GENERATOR
  //    Uses `window.ACCURATE_WORLD_MAP` (Natural Earth 110m vector land + countries)
  // ==========================================================================
  let _worldNightCanvas = null;
  let _worldDaySatelliteCanvas = null;
  let _europeMacroCanvas = null;

  // Major world urban light clusters in (x: 0..400, y: 0..200) matching ACCURATE_WORLD_MAP space
  const CITY_LIGHT_CLUSTERS = [
    // North America (Eastern Seaboard, Midwest, West Coast, Mexico)
    { x: 118, y: 74, rx: 14, ry: 9, count: 220, weight: 1.2 }, // NYC / Boston / Chicago / Great Lakes
    { x: 112, y: 82, rx: 12, ry: 8, count: 160, weight: 1.0 }, // Southeast US / Florida / Texas
    { x: 82, y: 78, rx: 6, ry: 10, count: 95, weight: 0.95 },  // California / West Coast
    { x: 102, y: 94, rx: 8, ry: 6, count: 75, weight: 0.85 },  // Mexico City
    // South America (Brazil coast, Buenos Aires, Andes)
    { x: 144, y: 142, rx: 7, ry: 11, count: 95, weight: 0.9 },
    { x: 132, y: 160, rx: 6, ry: 6, count: 55, weight: 0.8 },
    // Europe (Dense golden-white network: UK, France, Benelux, Germany/Herzogenaurach, Italy, Spain, Poland, Moscow)
    { x: 189, y: 67, rx: 4.5, ry: 5.5, count: 140, weight: 1.35 }, // UK & Ireland (London, Manchester)
    { x: 199, y: 74, rx: 6.5, ry: 5.5, count: 180, weight: 1.35 }, // France / Paris / Benelux
    { x: 209, y: 72, rx: 7.5, ry: 5.5, count: 240, weight: 1.45 }, // Germany (Ruhr, Frankfurt, Nuremberg/Herzogenaurach, Berlin)
    { x: 212, y: 80, rx: 5.5, ry: 6.5, count: 165, weight: 1.3 },  // Northern Italy / Milan / Rome
    { x: 188, y: 82, rx: 5.5, ry: 4.5, count: 110, weight: 1.1 },  // Spain & Portugal (Madrid, Barcelona)
    { x: 220, y: 71, rx: 8.0, ry: 5.5, count: 130, weight: 1.05 }, // Poland / Central-East Europe
    { x: 212, y: 56, rx: 6.0, ry: 5.0, count: 65, weight: 0.85 },  // Southern Scandinavia (Stockholm, Oslo, Copenhagen)
    { x: 238, y: 64, rx: 9.0, ry: 7.0, count: 110, weight: 0.95 }, // Moscow / Western Russia
    // North Africa & Middle East (Nile Delta, Mediterranean coast, Levant, Gulf)
    { x: 231, y: 90, rx: 3.5, ry: 6.5, count: 95, weight: 1.2 },   // Cairo & Nile River
    { x: 236, y: 82, rx: 7.0, ry: 4.0, count: 85, weight: 0.95 },  // Turkey / Istanbul
    { x: 254, y: 94, rx: 6.0, ry: 5.0, count: 70, weight: 0.9 },   // Persian Gulf / Dubai
    // South & East Asia (India, China, Japan, Korea)
    { x: 282, y: 96, rx: 10, ry: 10, count: 180, weight: 1.1 },    // India
    { x: 318, y: 84, rx: 12, ry: 11, count: 220, weight: 1.25 },   // Eastern China / Beijing / Shanghai / Shenzhen
    { x: 340, y: 80, rx: 5, ry: 7, count: 130, weight: 1.3 }       // Japan & South Korea
  ];

  function ensureWorldMapCanvases() {
    if (_worldNightCanvas && _worldDaySatelliteCanvas && _europeMacroCanvas) return;

    const mapW = 1600;
    const mapH = 800;
    const scaleX = mapW / 400;
    const scaleY = mapH / 200;

    // 1. Build Night Earth Map Canvas (Dark Ocean + Continent Fill + Coastline Rim + City Lights)
    _worldNightCanvas = document.createElement('canvas');
    _worldNightCanvas.width = mapW;
    _worldNightCanvas.height = mapH;
    const nctx = _worldNightCanvas.getContext('2d');

    // Deep midnight ocean
    nctx.fillStyle = '#070b16';
    nctx.fillRect(0, 0, mapW, mapH);

    // Subtle bathymetric grid lines
    nctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    nctx.lineWidth = 1;
    for (let gx = 0; gx < mapW; gx += 40) {
      nctx.beginPath();
      nctx.moveTo(gx, 0);
      nctx.lineTo(gx, mapH);
      nctx.stroke();
    }
    for (let gy = 0; gy < mapH; gy += 40) {
      nctx.beginPath();
      nctx.moveTo(0, gy);
      nctx.lineTo(mapW, gy);
      nctx.stroke();
    }

    const hasAccurateLand = typeof window !== 'undefined' && window.ACCURATE_WORLD_MAP && window.ACCURATE_WORLD_MAP.land;
    let landPath = null;
    if (hasAccurateLand && typeof Path2D !== 'undefined') {
      landPath = new Path2D(window.ACCURATE_WORLD_MAP.land);
    }

    if (landPath) {
      nctx.save();
      nctx.scale(scaleX, scaleY);
      nctx.fillStyle = '#121b2e';
      nctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
      nctx.lineWidth = 0.35;
      nctx.fill(landPath);
      nctx.stroke(landPath);
      nctx.restore();

      // Clip city lights strictly inside landmasses so no cities float in the ocean!
      nctx.save();
      nctx.scale(scaleX, scaleY);
      nctx.clip(landPath);
      nctx.scale(1 / scaleX, 1 / scaleY);
    } else {
      nctx.save();
    }

    // Topographic dark continent mottling
    for (let i = 0; i < 180; i++) {
      const tx = hash1D(i * 17.3) * mapW;
      const ty = hash1D(i * 31.7) * mapH;
      const tr = Math.max(4, 18 + hash1D(i * 7.1) * 55);
      const tGrad = nctx.createRadialGradient(tx, ty, 0.5, tx, ty, tr);
      tGrad.addColorStop(0, 'rgba(30, 41, 59, 0.42)');
      tGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      nctx.fillStyle = tGrad;
      nctx.beginPath();
      nctx.arc(tx, ty, tr, 0, Math.PI * 2);
      nctx.fill();
    }

    // Render dense golden-white night city lights & highway filaments
    CITY_LIGHT_CLUSTERS.forEach((cl, ci) => {
      const cx = cl.x * scaleX;
      const cy = cl.y * scaleY;
      const rx = cl.rx * scaleX;
      const ry = cl.ry * scaleY;

      // Soft warm urban basin glow
      const glowR = Math.max(4, Math.max(rx, ry) * 1.35);
      const basinGrad = nctx.createRadialGradient(cx, cy, 0.5, cx, cy, glowR);
      basinGrad.addColorStop(0, `rgba(254, 240, 138, ${(0.22 * cl.weight).toFixed(3)})`);
      basinGrad.addColorStop(0.5, `rgba(251, 191, 36, ${(0.08 * cl.weight).toFixed(3)})`);
      basinGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nctx.fillStyle = basinGrad;
      nctx.beginPath();
      nctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      nctx.fill();

      const pts = [];
      for (let p = 0; p < cl.count; p++) {
        const seed = ci * 1000 + p;
        const u1 = Math.max(0.001, hash1D(seed * 1.3));
        const u2 = hash1D(seed * 2.7);
        const mag = Math.sqrt(-2.0 * Math.log(u1)) * 0.42;
        const ang = u2 * Math.PI * 2;
        const px = cx + Math.cos(ang) * rx * mag;
        const py = cy + Math.sin(ang) * ry * mag;
        const isHub = p % 14 === 0;
        const rDot = isHub ? (1.4 + hash1D(seed * 5.1) * 1.6) : (0.55 + hash1D(seed * 3.9) * 0.85);

        if (isHub && pts.length < 18) pts.push({ x: px, y: py });

        nctx.fillStyle = isHub ? '#ffffff' : (p % 3 === 0 ? '#fef08a' : '#cbd5e1');
        nctx.globalAlpha = isHub ? 0.95 : (0.45 + hash1D(seed * 7.7) * 0.5);
        nctx.beginPath();
        nctx.arc(px, py, Math.max(0.4, rDot), 0, Math.PI * 2);
        nctx.fill();
      }

      // Highway light filaments connecting major hubs
      nctx.strokeStyle = 'rgba(254, 240, 138, 0.16)';
      nctx.lineWidth = 0.7;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        if (Math.hypot(b.x - a.x, b.y - a.y) < rx * 1.4) {
          nctx.beginPath();
          nctx.moveTo(a.x, a.y);
          nctx.lineTo(b.x, b.y);
          nctx.stroke();
        }
      }
    });
    nctx.restore();

    // 2. Build High-Resolution Europe Macro Canvas (for Act 3 & Act 4 Zoom)
    // Covers x: 175..245, y: 45..95 in ACCURATE_WORLD_MAP space at 1280x720
    _europeMacroCanvas = document.createElement('canvas');
    _europeMacroCanvas.width = 1280;
    _europeMacroCanvas.height = 720;
    const ectx = _europeMacroCanvas.getContext('2d');
    ectx.fillStyle = '#060a14';
    ectx.fillRect(0, 0, 1280, 720);

    const euMinX = 176, euMaxX = 244; // 68 units wide
    const euMinY = 48, euMaxY = 88;   // 40 units tall
    const euScaleX = 1280 / (euMaxX - euMinX);
    const euScaleY = 720 / (euMaxY - euMinY);

    if (landPath) {
      ectx.save();
      ectx.scale(euScaleX, euScaleY);
      ectx.translate(-euMinX, -euMinY);

      // Dark continent landmass
      ectx.fillStyle = '#111827';
      ectx.fill(landPath);

      // Luminous coastline rim (like image_cc4e4bea.png & image_42c40082.png)
      ectx.strokeStyle = 'rgba(226, 232, 240, 0.42)';
      ectx.lineWidth = 0.32;
      ectx.stroke(landPath);

      // Clip inside European landmasses
      ectx.clip(landPath);

      // Subtle country borders inside Europe
      if (window.ACCURATE_WORLD_MAP.countries) {
        ectx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
        ectx.lineWidth = 0.18;
        Object.values(window.ACCURATE_WORLD_MAP.countries).forEach((cPathStr) => {
          try {
            const cp = new Path2D(cPathStr);
            ectx.stroke(cp);
          } catch (_) {}
        });
      }

      ectx.restore();

      ectx.save();
      ectx.beginPath();
      ectx.scale(euScaleX, euScaleY);
      ectx.translate(-euMinX, -euMinY);
      ectx.clip(landPath);
      ectx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ectx.save();
    }

    // Ultra-detailed European city light network (matching image_cc4e4bea.png & image_42c40082.png)
    const euClusters = CITY_LIGHT_CLUSTERS.filter((c) => c.x >= 175 && c.x <= 248 && c.y >= 46 && c.y <= 92);
    euClusters.forEach((cl, idx) => {
      const cx = (cl.x - euMinX) * euScaleX;
      const cy = (cl.y - euMinY) * euScaleY;
      const rx = cl.rx * euScaleX * 0.92;
      const ry = cl.ry * euScaleY * 0.92;

      const glowR = Math.max(8, Math.max(rx, ry) * 1.45);
      const bGrad = ectx.createRadialGradient(cx, cy, 1, cx, cy, glowR);
      bGrad.addColorStop(0, 'rgba(254, 249, 195, 0.28)');
      bGrad.addColorStop(0.45, 'rgba(203, 213, 225, 0.14)');
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ectx.fillStyle = bGrad;
      ectx.beginPath();
      ectx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ectx.fill();

      const denseCount = cl.count * 4;
      const hubs = [];
      for (let p = 0; p < denseCount; p++) {
        const seed = 9000 + idx * 2000 + p;
        const u1 = Math.max(0.0005, hash1D(seed * 1.7));
        const u2 = hash1D(seed * 3.1);
        const mag = Math.sqrt(-2.0 * Math.log(u1)) * 0.44;
        const ang = u2 * Math.PI * 2;
        const px = cx + Math.cos(ang) * rx * mag;
        const py = cy + Math.sin(ang) * ry * mag;
        const isMetro = p % 22 === 0;
        const rad = isMetro ? (2.0 + hash1D(seed * 4.3) * 2.6) : (0.6 + hash1D(seed * 8.1) * 1.1);

        if (isMetro && hubs.length < 32) hubs.push({ x: px, y: py });

        if (isMetro) {
          const mGrad = ectx.createRadialGradient(px, py, 0.2, px, py, rad * 3.2);
          mGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          mGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.55)');
          mGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ectx.fillStyle = mGrad;
          ectx.beginPath();
          ectx.arc(px, py, rad * 3.2, 0, Math.PI * 2);
          ectx.fill();
        } else {
          ectx.fillStyle = p % 4 === 0 ? '#fef9c3' : '#e2e8f0';
          ectx.globalAlpha = 0.35 + hash1D(seed * 5.9) * 0.6;
          ectx.beginPath();
          ectx.arc(px, py, Math.max(0.4, rad), 0, Math.PI * 2);
          ectx.fill();
        }
      }

      ectx.globalAlpha = 1;
      ectx.strokeStyle = 'rgba(254, 249, 195, 0.18)';
      ectx.lineWidth = 0.85;
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < Math.min(hubs.length, i + 4); j++) {
          const d = Math.hypot(hubs[j].x - hubs[i].x, hubs[j].y - hubs[i].y);
          if (d < 130) {
            ectx.beginPath();
            ectx.moveTo(hubs[i].x, hubs[i].y);
            ectx.lineTo(hubs[j].x, hubs[j].y);
            ectx.stroke();
          }
        }
      }
    });
    ectx.restore();

    // 3. Build Daytime Google Earth High-Altitude Satellite Terrain Canvas (Matches image_66ad139b.png)
    _worldDaySatelliteCanvas = document.createElement('canvas');
    _worldDaySatelliteCanvas.width = 1280;
    _worldDaySatelliteCanvas.height = 720;
    const sctx = _worldDaySatelliteCanvas.getContext('2d');

    // Atmospheric dusty blue-slate satellite base (exact tone from image_66ad139b.png)
    const satBg = sctx.createRadialGradient(640, 360, 40, 640, 360, 780);
    satBg.addColorStop(0, '#647d98');
    satBg.addColorStop(0.55, '#536c88');
    satBg.addColorStop(1, '#3e5570');
    sctx.fillStyle = satBg;
    sctx.fillRect(0, 0, 1280, 720);

    // Fine satellite agricultural & urban parcel grid / rivers / terrain variation
    for (let i = 0; i < 420; i++) {
      const px = hash1D(i * 19.3) * 1280;
      const py = hash1D(i * 37.1) * 720;
      const pw = 12 + hash1D(i * 7.7) * 58;
      const ph = 8 + hash1D(i * 11.3) * 42;
      const ang = (hash1D(i * 5.1) - 0.5) * 0.6;
      sctx.save();
      sctx.translate(px, py);
      sctx.rotate(ang);
      sctx.fillStyle = i % 3 === 0
        ? 'rgba(71, 95, 118, 0.28)'
        : i % 3 === 1
        ? 'rgba(116, 136, 152, 0.22)'
        : 'rgba(168, 150, 138, 0.14)';
      sctx.fillRect(-pw / 2, -ph / 2, pw, ph);
      sctx.restore();
    }

    // Winding river valley & highway arteries across Herzogenaurach / Bavaria satellite view
    sctx.strokeStyle = 'rgba(58, 78, 102, 0.55)';
    sctx.lineWidth = 3.2;
    sctx.beginPath();
    sctx.moveTo(610, 0);
    sctx.bezierCurveTo(635, 210, 665, 420, 625, 720);
    sctx.stroke();

    sctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
    sctx.lineWidth = 1.2;
    for (let r = 0; r < 28; r++) {
      const x0 = hash1D(r * 23.1) * 1280;
      const y0 = hash1D(r * 41.9) * 720;
      const x1 = x0 + (hash1D(r * 13.7) - 0.5) * 380;
      const y1 = y0 + (hash1D(r * 17.9) - 0.5) * 380;
      sctx.beginPath();
      sctx.moveTo(x0, y0);
      sctx.lineTo(x1, y1);
      sctx.stroke();
    }

    // Subtle central municipality / town boundary outline (seen in the center of image_66ad139b.png!)
    sctx.strokeStyle = 'rgba(226, 232, 240, 0.48)';
    sctx.lineWidth = 1.1;
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
  // 6. RIFT PATH GEOMETRY & INTERACTIVE PATH EVALUATION
  // ==========================================================================
  function getRiftXAtNormalizedY(yn, cfg, timeSec) {
    const mode = cfg.riftPathMode || 'vertical_authentic';
    if (mode === 'custom_traced' && Array.isArray(cfg.customRiftPoints) && cfg.customRiftPoints.length >= 2) {
      const pts = cfg.customRiftPoints;
      // Interpolate x for given yn along sorted or sequential points
      let bestDist = Infinity;
      let bestX = 0.5;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const minY = Math.min(a.y, b.y);
        const maxY = Math.max(a.y, b.y);
        if (yn >= minY - 0.02 && yn <= maxY + 0.02) {
          const t = Math.abs(b.y - a.y) < 0.0001 ? 0.5 : clamp((yn - a.y) / (b.y - a.y), 0, 1);
          return lerp(a.x, b.x, t);
        }
        const d = Math.min(Math.abs(yn - a.y), Math.abs(yn - b.y));
        if (d < bestDist) {
          bestDist = d;
          bestX = Math.abs(yn - a.y) < Math.abs(yn - b.y) ? a.x : b.x;
        }
      }
      return bestX;
    }
    if (mode === 'diagonal_clash') {
      return 0.58 - (yn - 0.5) * 0.28;
    }
    if (mode === 's_curve') {
      return 0.5 + Math.sin((yn - 0.5) * Math.PI * 1.8 + timeSec * 0.6) * 0.085;
    }
    if (mode === 'lightning_rift') {
      const seg = Math.floor(yn * 14);
      const frac = (yn * 14) - seg;
      const o1 = (hash1D(seg * 19.3) - 0.5) * 0.07;
      const o2 = (hash1D((seg + 1) * 19.3) - 0.5) * 0.07;
      return 0.5 + lerp(o1, o2, frac);
    }
    // Default 'vertical_authentic': dead-center vertical split with subtle organic plasma micro-shimmer
    return 0.5 + Math.sin(yn * Math.PI * 3 + timeSec * 1.5) * 0.0025;
  }

  // ==========================================================================
  // 7. COSMIC DUAL-HEMISPHERE NEBULA, CLOUD-BLEED LOGOS, AMBIANCE & LIGHT RIFT
  // ==========================================================================
  function resolveNebulaColors(cfg) {
    const preset = cfg.nebulaPalettePreset || 'authentic_blue_crimson';
    if (preset === 'gold_purple') {
      return {
        leftPrim: '#f59e0b', leftSec: '#fde047', leftDeep: '#271503',
        rightPrim: '#9333ea', rightSec: '#c084fc', rightDeep: '#1a052e'
      };
    }
    if (preset === 'emerald_amber') {
      return {
        leftPrim: '#10b981', leftSec: '#34d399', leftDeep: '#032218',
        rightPrim: '#ea580c', rightSec: '#fb923c', rightDeep: '#290d03'
      };
    }
    if (preset === 'cyber_neon') {
      return {
        leftPrim: '#06b6d4', leftSec: '#22d3ee', leftDeep: '#031c26',
        rightPrim: '#ec4899', rightSec: '#f472b6', rightDeep: '#29041b'
      };
    }
    return {
      leftPrim: cfg.leftNebulaPrimaryColor || '#0066ff',
      leftSec: cfg.leftNebulaSecondaryColor || '#0ea5e9',
      leftDeep: cfg.leftNebulaDeepColor || '#021028',
      rightPrim: cfg.rightNebulaPrimaryColor || '#e11d48',
      rightSec: cfg.rightNebulaSecondaryColor || '#ec4899',
      rightDeep: cfg.rightNebulaDeepColor || '#2a0410'
    };
  }

  function renderCosmicSplitAndLogos(ctx, w, h, cameraZoom, timeSec, cfg, starWorldPos) {
    const pal = resolveNebulaColors(cfg);
    const cloudDensity = clamp(Number(cfg.nebulaCloudDensity ?? 0.88), 0.1, 1.6);
    const cloudSpd = clamp(Number(cfg.nebulaCloudSpeed ?? 1.0), 0.1, 3.0);

    ctx.save();
    // Apply camera push-in zoom centered on the globe/rift
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-w * 0.5, -h * 0.5);

    // ------------------------------------------------------------------------
    // 1. CONTINUOUS DEEP-SPACE COSMIC NEBULA (No hard split cuts)
    //    Left: Deep Indigo / Electric Cyan Nebula (Adidas side)
    //    Right: Deep Burgundy / Crimson-Magenta Nebula (Puma side)
    // ------------------------------------------------------------------------
    // Deep interstellar void base
    ctx.fillStyle = '#02040a';
    ctx.fillRect(0, 0, w, h);

    // Left Celestial Nebula (Cyan/Blue)
    const leftNeb = ctx.createRadialGradient(w * 0.22, h * 0.50, 30, w * 0.28, h * 0.50, w * 0.55);
    leftNeb.addColorStop(0, rgbaStr('#0284c7', 0.82));
    leftNeb.addColorStop(0.38, rgbaStr('#0369a1', 0.65));
    leftNeb.addColorStop(0.72, rgbaStr('#082f49', 0.42));
    leftNeb.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = leftNeb;
    ctx.fillRect(0, 0, w * 0.6, h);

    // Volumetric organic cyan cloud billows
    for (let c = 0; c < 14; c++) {
      const cx = (0.06 + hash1D(c * 17.1) * 0.38) * w + Math.sin(timeSec * 0.25 * cloudSpd + c) * 16;
      const cy = (0.10 + hash1D(c * 29.7) * 0.80) * h + Math.cos(timeSec * 0.20 * cloudSpd + c * 1.3) * 12;
      const cr = Math.max(30, (0.12 + hash1D(c * 11.3) * 0.20) * Math.min(w, h));
      const cGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, cr);
      const isBright = c % 4 === 0;
      cGrad.addColorStop(0, isBright ? rgbaStr('#38bdf8', 0.22 * cloudDensity) : rgbaStr('#0284c7', 0.16 * cloudDensity));
      cGrad.addColorStop(0.65, rgbaStr('#0c4a6e', 0.08 * cloudDensity));
      cGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right Celestial Nebula (Crimson/Magenta)
    const rightNeb = ctx.createRadialGradient(w * 0.78, h * 0.50, 30, w * 0.72, h * 0.50, w * 0.55);
    rightNeb.addColorStop(0, rgbaStr('#e11d48', 0.78));
    rightNeb.addColorStop(0.38, rgbaStr('#9f1239', 0.62));
    rightNeb.addColorStop(0.72, rgbaStr('#4c0519', 0.40));
    rightNeb.addColorStop(1, 'rgba(15, 2, 8, 0)');
    ctx.fillStyle = rightNeb;
    ctx.fillRect(w * 0.4, 0, w * 0.6, h);

    // Volumetric organic crimson/magenta cloud billows
    for (let c = 0; c < 14; c++) {
      const cx = (0.56 + hash1D(c * 23.3 + 80) * 0.38) * w + Math.cos(timeSec * 0.22 * cloudSpd + c) * 16;
      const cy = (0.10 + hash1D(c * 37.9 + 80) * 0.80) * h + Math.sin(timeSec * 0.24 * cloudSpd + c * 1.1) * 12;
      const cr = Math.max(30, (0.12 + hash1D(c * 19.1 + 80) * 0.20) * Math.min(w, h));
      const cGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, cr);
      const isBright = c % 4 === 0;
      cGrad.addColorStop(0, isBright ? rgbaStr('#f472b6', 0.24 * cloudDensity) : rgbaStr('#e11d48', 0.16 * cloudDensity));
      cGrad.addColorStop(0.65, rgbaStr('#831843', 0.08 * cloudDensity));
      cGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    // ------------------------------------------------------------------------
    // 2. AMBIENT PARTICLES (Rendered BEFORE logos so stars shine through them!)
    // ------------------------------------------------------------------------
    renderAmbianceParticles(ctx, w, h, timeSec, cfg);

    // ------------------------------------------------------------------------
    // 3. LOGOS EMBEDDED IN THE NEBULA (Ethereal Semi-Transparent & Luminous)
    //    (Matches image_be30fa77.png & image_31b11176.png)
    // ------------------------------------------------------------------------
    const leftSrc = cfg.leftLogoPreset === 'nike'
      ? DEFAULT_LOGO_URIS.nikeLogo
      : cfg.leftLogoPreset === 'apple'
      ? DEFAULT_LOGO_URIS.appleLogo
      : (cfg.leftLogoUrl || DEFAULT_LOGO_URIS.adidasLogo);
    const leftRec = getLoadedImage(leftSrc);
    const leftDrawable = getBgRemovedLogoCanvas(leftRec, leftSrc, cfg.leftLogoRemoveBg !== false);

    const leftScale = clamp(Number(cfg.leftLogoScale ?? 1.0), 0.3, 2.2);
    const leftW = w * 0.44 * leftScale;
    const leftH = leftW * 0.70;
    const leftX = w * 0.235 - leftW * 0.5 + Number(cfg.leftLogoOffsetX || 0);
    const leftY = h * 0.52 - leftH * 0.5 + Number(cfg.leftLogoOffsetY || 0);

    if (leftDrawable) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      // Multi-pass soft celestial cyan glow
      const baseAlpha = clamp(Number(cfg.leftLogoOpacity ?? 0.62), 0.1, 1.0);
      
      // Pass 1: Soft deep cyan aura
      ctx.globalAlpha = baseAlpha * 0.45;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 32;
      ctx.drawImage(leftDrawable, leftX, leftY, leftW, leftH);

      // Pass 2: Vibrant sky-blue body
      ctx.globalAlpha = baseAlpha * 0.75;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.drawImage(leftDrawable, leftX, leftY, leftW, leftH);

      // Pass 3: Core illumination
      ctx.globalAlpha = baseAlpha * 0.95;
      ctx.drawImage(leftDrawable, leftX, leftY, leftW, leftH);
      ctx.restore();
    }

    const rightSrc = cfg.rightLogoPreset === 'adidas'
      ? DEFAULT_LOGO_URIS.adidasLogo
      : cfg.rightLogoPreset === 'nike'
      ? DEFAULT_LOGO_URIS.nikeLogo
      : (cfg.rightLogoUrl || DEFAULT_LOGO_URIS.pumaLogo);
    const rightRec = getLoadedImage(rightSrc);
    const rightDrawable = getBgRemovedLogoCanvas(rightRec, rightSrc, cfg.rightLogoRemoveBg !== false);

    const rightScale = clamp(Number(cfg.rightLogoScale ?? 1.0), 0.3, 2.2);
    const rightW = w * 0.46 * rightScale;
    const rightH = rightW * 0.68;
    const rightX = w * 0.765 - rightW * 0.5 + Number(cfg.rightLogoOffsetX || 0);
    const rightY = h * 0.52 - rightH * 0.5 + Number(cfg.rightLogoOffsetY || 0);

    if (rightDrawable) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const baseAlpha = clamp(Number(cfg.rightLogoOpacity ?? 0.62), 0.1, 1.0);

      // Pass 1: Soft deep crimson aura
      ctx.globalAlpha = baseAlpha * 0.45;
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 32;
      ctx.drawImage(rightDrawable, rightX, rightY, rightW, rightH);

      // Pass 2: Vibrant rose-pink body
      ctx.globalAlpha = baseAlpha * 0.75;
      ctx.shadowColor = '#fb7185';
      ctx.shadowBlur = 12;
      ctx.drawImage(rightDrawable, rightX, rightY, rightW, rightH);

      // Pass 3: Core illumination
      ctx.globalAlpha = baseAlpha * 0.95;
      ctx.drawImage(rightDrawable, rightX, rightY, rightW, rightH);
      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // 4. THE CENTRAL ANAMORPHIC PLASMA RIFT OF LIGHT (Separating the Two Universes)
    //    Natural vertical optical flare pillar bursting from behind the globe
    //    (Matches image_be30fa77.png & image_31b11176.png)
    // ------------------------------------------------------------------------
    const riftGlow = clamp(Number(cfg.riftGlowIntensity ?? 1.25), 0.1, 2.5);
    const riftW = clamp(Number(cfg.riftWidthPx ?? 24), 6, 80);
    const pinchFlare = clamp(Number(cfg.riftCenterPinchFlare ?? 1.4), 0, 2.5);

    // Build Rift Path Points (straight vertical by default, or following user's manual trace)
    const steps = 36;
    const riftPts = [];
    for (let i = 0; i <= steps; i++) {
      const yn = i / steps;
      const rx = getRiftXAtNormalizedY(yn, cfg, timeSec) * w;
      riftPts.push({ x: rx, y: yn * h });
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

    // Layer 1: Wide Soft Atmospheric Halo (Cyan bleed on left, Magenta bleed on right)
    ctx.strokeStyle = rgbaStr('#38bdf8', 0.28 * riftGlow);
    ctx.lineWidth = riftW * 5.5;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 45;
    traceRiftPolyline(-6);
    ctx.stroke();

    ctx.strokeStyle = rgbaStr('#f472b6', 0.28 * riftGlow);
    ctx.lineWidth = riftW * 5.5;
    ctx.shadowColor = '#e11d48';
    ctx.shadowBlur = 45;
    traceRiftPolyline(6);
    ctx.stroke();

    // Layer 2: Medium Electric Aura
    ctx.strokeStyle = rgbaStr('#bae6fd', 0.58 * riftGlow);
    ctx.lineWidth = riftW * 1.8;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 25;
    traceRiftPolyline(0);
    ctx.stroke();

    // Layer 3: Blinding White Needle Core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2.0, riftW * 0.22);
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    traceRiftPolyline(0);
    ctx.stroke();

    // Layer 4: Central Diamond Anamorphic Flare Burst right behind the globe
    // (Creates the brilliant vertical flare horns seen above and below the globe in image_be30fa77.png!)
    if (pinchFlare > 0.05) {
      const midPt = riftPts[Math.floor(riftPts.length / 2)] || { x: w * 0.5, y: h * 0.5 };
      const flareH = h * 0.44 * pinchFlare;
      const flareW = riftW * 3.8 * pinchFlare;

      // Vertical tapered diamond flare
      ctx.save();
      ctx.translate(midPt.x, midPt.y);
      const vGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, flareH);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      vGrad.addColorStop(0.22, rgbaStr('#e0f2fe', 0.85 * pinchFlare));
      vGrad.addColorStop(0.55, rgbaStr('#7dd3fc', 0.38 * pinchFlare));
      vGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = vGrad;
      ctx.scale(flareW / Math.max(10, flareH), 1.0);
      ctx.beginPath();
      ctx.arc(0, 0, flareH, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Subtle horizontal anamorphic streak ray behind the globe
      const streakGrad = ctx.createLinearGradient(midPt.x - w * 0.22, midPt.y, midPt.x + w * 0.22, midPt.y);
      streakGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      streakGrad.addColorStop(0.35, rgbaStr('#38bdf8', 0.45 * pinchFlare));
      streakGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      streakGrad.addColorStop(0.65, rgbaStr('#f472b6', 0.45 * pinchFlare));
      streakGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
      ctx.fillStyle = streakGrad;
      ctx.fillRect(midPt.x - w * 0.22, midPt.y - 1.2, w * 0.44, 2.4);
    }

    ctx.restore(); // End Rift

    ctx.restore(); // End Camera Zoom Transform

    // Register Stage Hit-Boxes for direct clicking
    _lastStageHitBoxes.push(
      {
        id: 'left_logo_adidas',
        label: `Left Brand Logo (${cfg.leftLogoTitle || 'Adidas'})`,
        scene: 'scene1',
        x: w * 0.05,
        y: h * 0.22,
        w: w * 0.38,
        h: h * 0.56
      },
      {
        id: 'right_logo_puma',
        label: `Right Brand Logo (${cfg.rightLogoTitle || 'PUMA'})`,
        scene: 'scene1',
        x: w * 0.57,
        y: h * 0.22,
        w: w * 0.38,
        h: h * 0.56
      },
      {
        id: 'central_light_rift',
        label: 'Central Plasma Rift of Light (Click to Customize or Trace)',
        scene: 'scene1',
        x: w * 0.46,
        y: 0,
        w: w * 0.08,
        h: h
      }
    );
  }

  function renderAmbianceParticles(ctx, w, h, timeSec, cfg) {
    const mode = cfg.ambianceMode || 'stars';
    const count = clamp(Math.round(Number(cfg.ambianceParticleCount ?? 260)), 0, 600);
    const spd = clamp(Number(cfg.ambianceParticleSpeed ?? 1.0), 0.1, 3.0);
    const twinkle = clamp(Number(cfg.ambianceTwinkleIntensity ?? 1.0), 0, 2.0);

    ctx.save();
    for (let i = 0; i < count; i++) {
      const rx = hash1D(i * 13.7 + 7);
      const ry = hash1D(i * 29.3 + 19);
      const szSeed = hash1D(i * 43.1 + 3);

      if (mode === 'rain') {
        const x = ((rx * w - timeSec * 90 * spd) % w + w) % w;
        const y = ((ry * h + timeSec * 520 * spd * (0.7 + szSeed * 0.6)) % h + h) % h;
        const len = 10 + szSeed * 18;
        ctx.strokeStyle = x < w * 0.5 ? 'rgba(186, 230, 253, 0.48)' : 'rgba(254, 205, 211, 0.48)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3, y + len);
        ctx.stroke();
      } else if (mode === 'snow') {
        const x = ((rx * w + Math.sin(timeSec * 1.4 + i) * 28) % w + w) % w;
        const y = ((ry * h + timeSec * 68 * spd * (0.5 + szSeed * 0.7)) % h + h) % h;
        const r = Math.max(0.8, 1.2 + szSeed * 2.8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'embers') {
        const x = ((rx * w + Math.sin(timeSec * 2.1 + i) * 34) % w + w) % w;
        const y = ((ry * h - timeSec * 95 * spd * (0.5 + szSeed * 0.8)) % h + h) % h;
        const r = Math.max(0.8, 1.0 + szSeed * 2.6);
        ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#fb7185';
        ctx.globalAlpha = 0.4 + 0.55 * Math.sin(timeSec * 5 + i);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Natural Multi-Depth Space Dust & Stars (image_be30fa77.png & image_31b11176.png)
        const driftX = mode === 'cosmic_dust' ? Math.sin(timeSec * 0.4 + i) * 10 : (i % 7 === 0 ? -timeSec * 4 * spd : 0);
        const driftY = mode === 'cosmic_dust' ? Math.cos(timeSec * 0.35 + i) * 10 : (i % 11 === 0 ? timeSec * 5 * spd : 0);
        const x = ((rx * w + driftX) % w + w) % w;
        const y = ((ry * h + driftY) % h + h) % h;
        const tw = 0.65 + 0.35 * Math.sin(timeSec * (2.2 + szSeed * 3.5) + i * 1.7) * twinkle;
        const r = Math.max(0.4, szSeed > 0.96 ? 1.6 : szSeed > 0.80 ? 1.05 : 0.62);

        ctx.globalAlpha = clamp(tw * (0.35 + szSeed * 0.65), 0.1, 1);
        ctx.fillStyle = szSeed > 0.88
          ? (x < w * 0.5 ? '#bae6fd' : '#fecdd3')
          : '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Prominent 4-point diamond star above Puma's head (Matches image_be30fa77.png)
    if (cfg.prominentPumaStarEnabled !== false) {
      ctx.globalAlpha = 0.95;
      drawFourPointStar(ctx, w * 0.788, h * 0.278, 9.0, '#fda4af', '#ffffff');
      // Bright white star drifting down-left below the 's' of adidas (green arrow in image_31b11176.png)
      const driftStarY = h * 0.72 + ((timeSec * 28 * spd) % (h * 0.28));
      const driftStarX = w * 0.455 - ((timeSec * 12 * spd) % (w * 0.06));
      drawFourPointStar(ctx, driftStarX, driftStarY, 7.5, '#bae6fd', '#ffffff');
    }

    ctx.restore();
  }

  function drawFourPointStar(ctx, x, y, radius, glowColor, coreColor) {
    const r = Math.max(1, radius);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    // Soft outer circular glow
    const grad = ctx.createRadialGradient(x, y, 0.5, x, y, r * 2.8);
    grad.addColorStop(0, coreColor || '#ffffff');
    grad.addColorStop(0.35, glowColor || '#fda4af');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Sharp 4-point diamond star
    ctx.fillStyle = coreColor || '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x, y - r * 1.6);
    ctx.quadraticCurveTo(x, y, x + r * 1.6, y);
    ctx.quadraticCurveTo(x, y, x, y + r * 1.6);
    ctx.quadraticCurveTo(x, y, x - r * 1.6, y);
    ctx.quadraticCurveTo(x, y, x, y - r * 1.6);
    ctx.closePath();
    ctx.fill();

    // Delicate horizontal anamorphic spike
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(x - r * 2.4, y);
    ctx.lineTo(x + r * 2.4, y);
    ctx.stroke();

    ctx.restore();
  }

  // ==========================================================================
  // 8. TRAVELLING SUN-STAR & COUNTER-VECTOR NEON OPTICAL LENS FLARE SYSTEM
  //    Photographic, non-toyish implementation:
  //    - Pure crystalline diamond star with white-hot core & anamorphic streak
  //    - Soft, translucent optical iris blooms (NO hard thick white bars or toy stroke hoops!)
  // ==========================================================================
  function computeTravellingStarWorldPos(w, h, globalTimeSec, cfg) {
    const spd = clamp(Number(cfg.starTravelSpeed ?? 1.0), 0.2, 3.0);
    const p = clamp((globalTimeSec * spd) / 4.4, 0, 1);
    const mode = cfg.starTrajectoryMode || 'right_to_left_authentic';

    if (mode === 'left_to_right') {
      return {
        x: lerp(w * 0.14, w * 0.74, p),
        y: lerp(h * 0.24, h * 0.40, p),
        progress: p
      };
    }
    if (mode === 'top_to_bottom') {
      return {
        x: w * 0.5 + Math.sin(p * Math.PI * 2) * w * 0.14,
        y: lerp(h * 0.12, h * 0.88, p),
        progress: p
      };
    }
    if (mode === 'bottom_to_top') {
      return {
        x: w * 0.5 - Math.sin(p * Math.PI * 2) * w * 0.14,
        y: lerp(h * 0.88, h * 0.12, p),
        progress: p
      };
    }
    if (mode === 'orbit_globe') {
      const ang = p * Math.PI * 2.2;
      return {
        x: w * 0.5 + Math.cos(ang) * w * 0.24,
        y: h * 0.5 + Math.sin(ang) * h * 0.22,
        progress: p
      };
    }

    // DEFAULT: 'right_to_left_authentic'
    return {
      x: lerp(w * 0.728, w * 0.085, p),
      y: lerp(h * 0.398, h * 0.225, p),
      progress: p
    };
  }

  function renderTravellingStarAndCounterRefraction(ctx, w, h, cameraZoom, globalTimeSec, cfg) {
    const starPos = computeTravellingStarWorldPos(w, h, globalTimeSec, cfg);
    const fadeOut = 1 - smoothstep(3.8, 4.9, globalTimeSec);
    if (fadeOut <= 0.01) return;

    const starSize = clamp(Number(cfg.starCoreSize ?? 1.0), 0.3, 2.5);
    const flareInt = clamp(Number(cfg.neonRefractionIntensity ?? 1.15), 0, 2.5) * fadeOut;

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-w * 0.5, -h * 0.5);
    ctx.globalCompositeOperation = 'screen';

    const sx = starPos.x;
    const sy = starPos.y;
    const centerX = w * 0.5;
    const centerY = h * 0.5;

    const dx = sx - centerX;
    const dy = sy - centerY;

    // ------------------------------------------------------------------------
    // 1. COUNTER-VECTOR OPTICAL LENS FLARE (Ethereal translucent iris blooms)
    // ------------------------------------------------------------------------
    if (cfg.neonRefractionEnabled !== false && flareInt > 0.02) {
      const ringCount = clamp(Math.round(Number(cfg.neonRefractionRingCount ?? 4)), 1, 6);
      const topCol = cfg.neonRefractionTopColor || '#38bdf8';
      const botCol = cfg.neonRefractionBottomColor || '#ec4899';

      // Soft Counter-Moving Iris Discs (No thick strokes or opaque lines!)
      for (let r = 1; r <= ringCount; r++) {
        const tPivot = -0.32 - r * 0.28;
        const rx = centerX + dx * tPivot;
        const ry = centerY + dy * tPivot;
        const ringRad = Math.max(16, (42 + r * 38) * (0.85 + 0.25 * Math.sin(starPos.progress * Math.PI)));

        const rGrad = ctx.createRadialGradient(rx, ry, ringRad * 0.2, rx, ry, ringRad);
        const ringColor = rx < centerX ? topCol : botCol;
        rGrad.addColorStop(0, rgbaStr(ringColor, 0.03 * flareInt));
        rGrad.addColorStop(0.72, rgbaStr(ringColor, 0.10 * flareInt));
        rGrad.addColorStop(0.95, rgbaStr('#ffffff', 0.14 * flareInt));
        rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.arc(rx, ry, ringRad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ------------------------------------------------------------------------
    // 2. PRIMARY TRAVELLING SUN-STAR (Bright crystalline 4-point diamond star)
    // ------------------------------------------------------------------------
    const coreR = Math.max(2, 3.2 * starSize);
    const outerR = Math.max(14, 38 * starSize);

    // Soft outer glow corona
    const haloGrad = ctx.createRadialGradient(sx, sy, 1, sx, sy, outerR);
    haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    haloGrad.addColorStop(0.20, rgbaStr('#ffffff', 0.85 * fadeOut));
    haloGrad.addColorStop(0.50, sx < centerX ? rgbaStr('#38bdf8', 0.42 * fadeOut) : rgbaStr('#f472b6', 0.42 * fadeOut));
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // Sharp 4-point diamond star core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(sx, sy - coreR * 2.8);
    ctx.quadraticCurveTo(sx, sy, sx + coreR * 2.8, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy + coreR * 2.8);
    ctx.quadraticCurveTo(sx, sy, sx - coreR * 2.8, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy - coreR * 2.8);
    ctx.closePath();
    ctx.fill();

    // Thin elegant anamorphic horizontal streak ray
    const streakLength = w * 0.28 * starSize;
    const sGrad = ctx.createLinearGradient(sx - streakLength, sy, sx + streakLength, sy);
    sGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    sGrad.addColorStop(0.40, rgbaStr('#38bdf8', 0.65 * fadeOut));
    sGrad.addColorStop(0.50, 'rgba(255, 255, 255, 0.95)');
    sGrad.addColorStop(0.60, rgbaStr('#f472b6', 0.65 * fadeOut));
    sGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
    ctx.fillStyle = sGrad;
    ctx.fillRect(sx - streakLength, sy - 1.0, streakLength * 2, 2.0);

    ctx.restore();

    _lastStageHitBoxes.push({
      id: 'travelling_sun_star',
      label: 'Travelling Sun-Star & Counter Neon Lens Flare',
      scene: 'scene1',
      x: sx - 45,
      y: sy - 45,
      w: 90,
      h: 90
    });
  }

  // ==========================================================================
  // 9. 3D SPINNING EARTH GLOBE WITH DAYLIGHT TERMINATOR CRESCENT & GRAVITY ZOOM
  //    Photographic, non-toyish implementation:
  //    - In Act 1: Pure dark night silhouette occulting the central light rift
  //      with delicate rim-lighting and pinprick city lights (NO fake bright white bulb on front!)
  //    - In Act 2+: Daylight Terminator Crescent realistically ramps in as it spins
  // ==========================================================================
  function renderSpinning3DEarthGlobe(ctx, w, h, globalTimeSec, cfg) {
    ensureWorldMapCanvases();

    const globeFadeOut = 1 - smoothstep(5.3, 6.2, globalTimeSec);
    if (globeFadeOut <= 0.01) return;

    const baseScale = clamp(Number(cfg.globeInitialScale ?? 0.135), 0.06, 0.35);
    const gravAccel = clamp(Number(cfg.globeGravityAcceleration ?? 1.25), 0.4, 2.5);
    const spinSpd = clamp(Number(cfg.globeSpinSpeed ?? 1.15), 0.2, 3.0);

    const preSpinT = clamp(globalTimeSec / 1.8, 0, 1);
    const gravT = clamp((globalTimeSec - 1.65) / 4.1, 0, 1);
    const gravityCurve = Math.pow(gravT, 2.35 * gravAccel);

    const minDim = Math.min(w, h);
    const radius = Math.max(16, minDim * (baseScale + preSpinT * 0.025 + gravityCurve * 1.18));
    const cx = w * 0.5;
    const cy = h * 0.5;

    ctx.save();
    ctx.globalAlpha = globeFadeOut;

    // Daylight Crescent Rim Light only begins emerging around t > 1.8s as the globe spins toward daylight!
    // In Act 1 (t < 1.8s), the globe is in deep night silhouette occulting the light pillar behind it.
    const daylightRamp = smoothstep(1.8, 3.6, globalTimeSec);
    const rimInt = clamp(Number(cfg.globeDaylightRimIntensity ?? 1.25), 0, 2.5);
    const rimCol = cfg.globeDaylightRimColor || '#7dd3fc';
    const dynamicRimPower = daylightRamp * rimInt;

    // ------------------------------------------------------------------------
    // A. DELICATE BACKLIT ATMOSPHERIC RIM (Light leaking around the sphere silhouette)
    // ------------------------------------------------------------------------
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const backHaloR = radius * 1.14;
    const backGrad = ctx.createRadialGradient(cx, cy, radius * 0.94, cx, cy, backHaloR);
    backGrad.addColorStop(0, 'rgba(224, 242, 254, 0.75)');
    backGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.45)');
    backGrad.addColorStop(0.75, 'rgba(244, 114, 182, 0.25)');
    backGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = backGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, backHaloR, 0, Math.PI * 2);
    ctx.fill();

    // Additional Daylight Upper-Left Corona when rotating into the sun
    if (dynamicRimPower > 0.05) {
      const sunAngle = -Math.PI * 0.78 + gravT * 0.32;
      const offX = Math.cos(sunAngle) * radius * 0.14;
      const offY = Math.sin(sunAngle) * radius * 0.14;
      const outerAtmoR = radius * 1.22;
      const atmoGrad = ctx.createRadialGradient(
        cx + offX, cy + offY, Math.max(1, radius * 0.86),
        cx + offX * 0.5, cy + offY * 0.5, outerAtmoR
      );
      atmoGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      atmoGrad.addColorStop(0.35, rgbaStr(rimCol, 0.82 * dynamicRimPower));
      atmoGrad.addColorStop(0.70, rgbaStr('#0284c7', 0.35 * dynamicRimPower));
      atmoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, outerAtmoR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ------------------------------------------------------------------------
    // B. SPHERICAL 3D EARTH PROJECTION
    // ------------------------------------------------------------------------
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Dark night ocean base
    ctx.fillStyle = '#040711';
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const spinDir = cfg.globeSpinDirection || 'west_to_east_authentic';
    const targetReg = cfg.globeTargetRegion || 'europe_germany';
    const targetLon = targetReg === 'north_america' ? 0.28 : targetReg === 'east_asia' ? 0.81 : 0.515;
    const targetLat = targetReg === 'north_america' ? 0.39 : targetReg === 'east_asia' ? 0.42 : 0.365;

    const spinProgress = easeInOutCubic(clamp((globalTimeSec - 1.5) / 3.7, 0, 1)) * spinSpd;
    let lonCenter = lerp(0.31, targetLon, clamp(spinProgress, 0, 1));
    let latCenter = lerp(0.44, targetLat, clamp(spinProgress, 0, 1));

    if (spinDir === 'east_to_west') {
      lonCenter = lerp(0.72, targetLon, clamp(spinProgress, 0, 1));
    } else if (spinDir === 'north_to_south') {
      lonCenter = targetLon;
      latCenter = lerp(0.18, targetLat, clamp(spinProgress, 0, 1));
    } else if (spinDir === 'south_to_north') {
      lonCenter = targetLon;
      latCenter = lerp(0.72, targetLat, clamp(spinProgress, 0, 1));
    } else if (spinDir === 'diagonal_tumble') {
      lonCenter = lerp(0.24, targetLon, clamp(spinProgress, 0, 1));
      latCenter = lerp(0.62, targetLat, clamp(spinProgress, 0, 1));
    }

    if (_worldNightCanvas) {
      const mw = _worldNightCanvas.width;
      const mh = _worldNightCanvas.height;
      const cols = 42;
      const visibleLonSpan = 0.36;
      const visibleLatSpan = 0.34;
      const srcY = clamp((latCenter - visibleLatSpan * 0.5) * mh, 0, mh * 0.65);
      const srcH = visibleLatSpan * mh;

      for (let i = 0; i < cols; i++) {
        const u0 = i / cols;
        const u1 = (i + 1) / cols;
        const theta0 = (u0 - 0.5) * Math.PI;
        const theta1 = (u1 - 0.5) * Math.PI;

        const dx0 = cx + Math.sin(theta0) * radius;
        const dx1 = cx + Math.sin(theta1) * radius;
        const dw = Math.max(1, dx1 - dx0 + 0.8);

        const lonNorm = ((lonCenter + (u0 - 0.5) * visibleLonSpan) % 1 + 1) % 1;
        const sx = Math.floor(lonNorm * mw);
        const sw = Math.max(2, Math.ceil((visibleLonSpan / cols) * mw));

        const cosMid = Math.cos((theta0 + theta1) * 0.5);
        const stripH = radius * 2 * (0.86 + 0.14 * cosMid);
        const dy = cy - stripH * 0.5;

        ctx.drawImage(
          _worldNightCanvas,
          clamp(sx, 0, mw - sw), srcY, sw, srcH,
          dx0, dy, dw, stripH
        );
      }
    }

    // ------------------------------------------------------------------------
    // C. SUNLIT DAYLIGHT TERMINATOR CRESCENT (Upper-Left Limb)
    //    Ramps in naturally after t > 1.8s as Europe approaches daylight
    // ------------------------------------------------------------------------
    if (dynamicRimPower > 0.05) {
      const limbX = cx - radius * 0.72;
      const limbY = cy - radius * 0.28;
      const limbGrad = ctx.createRadialGradient(
        limbX, limbY, Math.max(2, radius * 0.05),
        limbX, limbY, Math.max(10, radius * 0.92)
      );
      limbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
      limbGrad.addColorStop(0.24, rgbaStr('#bae6fd', 0.85 * dynamicRimPower));
      limbGrad.addColorStop(0.48, rgbaStr('#0284c7', 0.40 * dynamicRimPower));
      limbGrad.addColorStop(0.68, 'rgba(2, 6, 23, 0)');
      limbGrad.addColorStop(1, 'rgba(2, 6, 23, 0.72)');
      ctx.fillStyle = limbGrad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Curved terminator shadow / optical band across the Atlantic
      if (cfg.globeTerminatorShadowArc !== false && globalTimeSec > 2.6) {
        const arcAlpha = smoothstep(2.6, 4.2, globalTimeSec) * 0.38;
        ctx.save();
        ctx.strokeStyle = `rgba(2, 6, 23, ${arcAlpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(8, radius * 0.18);
        ctx.beginPath();
        ctx.arc(cx + radius * 0.95, cy + radius * 0.1, Math.max(10, radius * 1.25), Math.PI * 0.65, Math.PI * 1.35);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 3D Spherical Limb Vignette (Ensures deep spherical depth & curvature)
    const sphereShade = ctx.createRadialGradient(
      cx - radius * 0.15, cy - radius * 0.15, Math.max(2, radius * 0.45),
      cx, cy, Math.max(8, radius)
    );
    sphereShade.addColorStop(0, 'rgba(0, 0, 0, 0)');
    sphereShade.addColorStop(0.82, 'rgba(2, 4, 12, 0.35)');
    sphereShade.addColorStop(1, 'rgba(2, 4, 12, 0.88)');
    ctx.fillStyle = sphereShade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore(); // End Globe Clip

    // Razor-thin illuminated cyan rim line on upper-left edge when sunlit
    if (dynamicRimPower > 0.05) {
      ctx.save();
      ctx.strokeStyle = rgbaStr('#e0f2fe', 0.92 * dynamicRimPower);
      ctx.lineWidth = Math.max(1.5, radius * 0.016);
      ctx.shadowColor = rimCol;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI * 0.68, Math.PI * 1.58);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore(); // End Globe Alpha

    // Register Stage Hit-Boxes for direct clicking
    _lastStageHitBoxes.push(
      {
        id: 'left_logo_adidas',
        label: `Left Brand Logo (${cfg.leftLogoTitle || 'Adidas'})`,
        scene: 'scene1',
        x: w * 0.05,
        y: h * 0.22,
        w: w * 0.38,
        h: h * 0.56
      },
      {
        id: 'right_logo_puma',
        label: `Right Brand Logo (${cfg.rightLogoTitle || 'PUMA'})`,
        scene: 'scene1',
        x: w * 0.57,
        y: h * 0.22,
        w: w * 0.38,
        h: h * 0.56
      },
      {
        id: 'central_light_rift',
        label: 'Central Plasma Rift of Light (Click to Customize or Trace)',
        scene: 'scene1',
        x: w * 0.46,
        y: 0,
        w: w * 0.08,
        h: h
      }
    );
  }
  // ==========================================================================
  // 10. ACT 3 & ACT 4: MACRO EUROPE CITY LIGHTS -> STRATOSPHERIC CLOUD DIVE ->
  //     GOOGLE EARTH DAYTIME SATELLITE MAP
  //     (Matches image_cc4e4bea.png, image_42c40082.png, image_02367181.png,
  //      image_8ba1783a.png, and image_66ad139b.png)
  // ==========================================================================
  function renderMacroEuropeAndCloudDiveToGoogleEarth(ctx, w, h, globalTimeSec, cfg) {
    if (globalTimeSec < 4.8) return;
    ensureWorldMapCanvases();

    // Fade in the full-screen macro view between 4.8s and 5.6s
    const macroEnterAlpha = smoothstep(4.8, 5.6, globalTimeSec);
    // Progress from 5.0s to 12.0s
    const diveP = clamp((globalTimeSec - 5.0) / 7.0, 0, 1);
    // Transition from Night Europe City Lights (5.0s–7.8s) to Daytime Google Earth Satellite (7.5s–12.0s)
    const dayTransition = smoothstep(7.2, 9.2, globalTimeSec);

    ctx.save();
    ctx.globalAlpha = macroEnterAlpha;

    // ------------------------------------------------------------------------
    // STAGE 1: MACRO EUROPE NIGHT CITY LIGHTS & REGIONAL GLOW (5.0s – 8.5s)
    // (Matches image_cc4e4bea.png & image_42c40082.png)
    // ------------------------------------------------------------------------
    if (dayTransition < 0.99 && _europeMacroCanvas) {
      const nightZoom = 1.0 + easeInCubic(clamp((globalTimeSec - 4.8) / 3.8, 0, 1)) * 1.65;
      // Focus zoom onto Central Europe / Germany (Herzogenaurach: x ~ 52%, y ~ 58% of Europe canvas)
      const focusX = w * 0.51;
      const focusY = h * 0.58;

      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.scale(nightZoom, nightZoom);
      ctx.translate(-focusX, -focusY);
      ctx.drawImage(_europeMacroCanvas, 0, 0, w, h);

      // Subtle glowing regional highlight & dark cloud bank forming on the right (pointed out by green arrows in image_42c40082.png!)
      if (cfg.regionHighlightEnabled !== false && globalTimeSec > 5.2) {
        const regAlpha = smoothstep(5.2, 6.2, globalTimeSec) * (1 - dayTransition);
        const hiCol = cfg.regionHighlightColor || '#38bdf8';

        // Subtle regional contour glow over Germany / Central Europe
        if (window.ACCURATE_WORLD_MAP && window.ACCURATE_WORLD_MAP.countries && window.ACCURATE_WORLD_MAP.countries['Germany']) {
          ctx.save();
          const euMinX = 176, euMaxX = 244;
          const euMinY = 48, euMaxY = 88;
          ctx.scale(w / (euMaxX - euMinX), h / (euMaxY - euMinY));
          ctx.translate(-euMinX, -euMinY);
          const gerPath = new Path2D(window.ACCURATE_WORLD_MAP.countries['Germany']);
          ctx.fillStyle = rgbaStr(hiCol, 0.14 * regAlpha);
          ctx.strokeStyle = rgbaStr('#fef08a', 0.45 * regAlpha);
          ctx.lineWidth = 0.25;
          ctx.fill(gerPath);
          ctx.stroke(gerPath);
          ctx.restore();
        }
      }

      // Upper-left atmospheric daylight horizon glow still visible at 5.2s–6.2s (top-left corner of image_cc4e4bea.png)
      const cornerGlow = (1 - smoothstep(5.2, 6.6, globalTimeSec)) * 0.85;
      if (cornerGlow > 0.02) {
        const cGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, w * 0.35);
        cGrad.addColorStop(0, `rgba(224, 242, 254, ${cornerGlow.toFixed(3)})`);
        cGrad.addColorStop(0.5, `rgba(56, 189, 248, ${(cornerGlow * 0.45).toFixed(3)})`);
        cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cGrad;
        ctx.fillRect(0, 0, w * 0.4, h * 0.4);
      }

      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // STAGE 2: DAYTIME GOOGLE EARTH HIGH-ALTITUDE SATELLITE TERRAIN (7.2s – 12.0s)
    // (Matches image_8ba1783a.png & image_66ad139b.png)
    // ------------------------------------------------------------------------
    if (dayTransition > 0.01 && _worldDaySatelliteCanvas) {
      const satProgress = clamp((globalTimeSec - 7.2) / 4.8, 0, 1);
      const satZoom = 1.0 + easeOutCubic(satProgress) * 0.38;

      ctx.save();
      ctx.globalAlpha = macroEnterAlpha * dayTransition;
      ctx.translate(w * 0.5, h * 0.5);
      ctx.scale(satZoom, satZoom);
      ctx.translate(-w * 0.5, -h * 0.5);
      ctx.drawImage(_worldDaySatelliteCanvas, 0, 0, w, h);

      // Optional tint if user switches satelliteTerrainStyle
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
    // STAGE 3: VOLUMETRIC STRATOSPHERIC CLOUD BREAKTHROUGH (6.0s – 12.0s)
    //    - 6.0s – 7.8s: Dark backlit storm clouds with city lights sparkling through (`image_02367181.png`)
    //    - 7.8s – 9.4s: Bright sunlit frost/cloud canopy parting (`image_8ba1783a.png`)
    //    - 9.4s – 12.0s: Crisp white cumulus clouds flanking the Google Earth satellite view (`image_66ad139b.png`)
    // ------------------------------------------------------------------------
    const cloudEnv = smoothstep(5.8, 6.8, globalTimeSec);
    if (cloudEnv > 0.01) {
      renderStratosphericClouds(ctx, w, h, globalTimeSec, dayTransition, cfg);
    }

    // ------------------------------------------------------------------------
    // STAGE 4: GOOGLE EARTH ATTRIBUTION WATERMARK (Bottom-Right, Matches image_66ad139b.png)
    // ------------------------------------------------------------------------
    if (cfg.showGoogleEarthWatermark !== false && globalTimeSec > 8.2) {
      const wmAlpha = smoothstep(8.2, 9.2, globalTimeSec);
      ctx.save();
      ctx.globalAlpha = wmAlpha * 0.88;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(241, 245, 249, 0.92)';
      ctx.font = `600 ${Math.round(h * 0.032)}px 'Inter', -apple-system, sans-serif`;
      ctx.fillText(cfg.googleEarthWatermarkText || 'Google Earth', w - 22, h - 26);

      ctx.fillStyle = 'rgba(226, 232, 240, 0.72)';
      ctx.font = `400 ${Math.round(h * 0.016)}px 'Inter', -apple-system, sans-serif`;
      ctx.fillText(cfg.googleEarthSubText || 'Landsat / Copernicus, Data SIO, NOAA', w - 22, h - 11);
      ctx.restore();
    }

    ctx.restore();

    _lastStageHitBoxes.push({
      id: globalTimeSec < 8.0 ? 'europe_city_lights' : 'google_earth_satellite',
      label: globalTimeSec < 8.0 ? 'Macro Europe City Lights & Regional Map' : 'Google Earth Satellite Map & Clouds',
      scene: globalTimeSec < 8.0 ? 'scene3' : 'scene4',
      x: w * 0.1,
      y: h * 0.1,
      w: w * 0.8,
      h: h * 0.8
    });
  }

  function renderStratosphericClouds(ctx, w, h, globalTimeSec, dayTransition, cfg) {
    const density = clamp(Number(cfg.cloudDiveDensity ?? 1.15), 0.2, 2.5);
    const spd = clamp(Number(cfg.cloudDiveSpeed ?? 1.15), 0.2, 3.0);
    const cloudProgress = clamp(((globalTimeSec - 5.8) / 6.2) * spd, 0, 1);

    ctx.save();

    // 1. Mid-dive thick cloud banks (peak around 6.8s–8.6s like image_02367181.png & image_8ba1783a.png, then part outward!)
    const midBell = Math.sin(clamp((globalTimeSec - 5.8) / 3.8, 0, 1) * Math.PI);
    if (midBell > 0.02) {
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + i * 0.4;
        const outwardPush = cloudProgress * w * 0.48;
        const baseDist = (0.06 + hash1D(i * 19.7) * 0.28) * Math.min(w, h);
        const cx = w * 0.5 + Math.cos(angle) * (baseDist + outwardPush);
        const cy = h * 0.5 + Math.sin(angle) * (baseDist * 0.75 + outwardPush * 0.65);
        const r = Math.max(30, (140 + hash1D(i * 31.3) * 180) * (1 + cloudProgress * 0.6));

        const cGrad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        // Morph from smoky dark charcoal/amber-backlit clouds (image_02367181.png) to bright sunlit white clouds (image_8ba1783a.png)
        const lum = Math.round(lerp(115, 252, dayTransition));
        const alpha = clamp(midBell * 0.62 * density, 0, 0.88);
        cGrad.addColorStop(0, `rgba(${lum}, ${lum + 2}, ${lum + 5}, ${alpha.toFixed(3)})`);
        cGrad.addColorStop(0.55, `rgba(${Math.max(40, lum - 30)}, ${Math.max(45, lum - 25)}, ${Math.max(55, lum - 15)}, ${(alpha * 0.55).toFixed(3)})`);
        cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Crisp white high-altitude cumulus clouds framing the final Google Earth view (Matches image_66ad139b.png 1:1!)
    //    Notice in image_66ad139b.png:
    //    - Large fluffy white cloud bank in upper-left `(x: 0.28w, y: 0.34h)`
    //    - Fluffy white cloud bank in lower-right `(x: 0.66w, y: 0.72h)`
    //    - Soft cloud edges in bottom-left and top-right corners
    if (dayTransition > 0.15) {
      const cumAlpha = smoothstep(0.15, 0.85, dayTransition) * clamp(density, 0.3, 1.5);
      const cumulusBanks = [
        // Upper-left main cumulus bank
        { x: w * 0.26, y: h * 0.33, rx: w * 0.22, ry: h * 0.20, puffs: 9, seed: 10 },
        // Lower-right main cumulus bank
        { x: w * 0.67, y: h * 0.72, rx: w * 0.18, ry: h * 0.18, puffs: 8, seed: 30 },
        // Bottom-left corner cloud
        { x: w * 0.06, y: h * 0.86, rx: w * 0.14, ry: h * 0.14, puffs: 5, seed: 50 },
        // Top-right corner cloud
        { x: w * 0.94, y: h * 0.18, rx: w * 0.12, ry: h * 0.15, puffs: 5, seed: 70 }
      ];

      cumulusBanks.forEach((bank, bi) => {
        const driftX = Math.sin(globalTimeSec * 0.25 * spd + bi) * 14;
        const driftY = Math.cos(globalTimeSec * 0.20 * spd + bi) * 10;

        for (let p = 0; p < bank.puffs; p++) {
          const s = bank.seed + p * 13.7;
          const px = bank.x + (hash1D(s) - 0.5) * bank.rx * 1.25 + driftX;
          const py = bank.y + (hash1D(s + 7.1) - 0.5) * bank.ry * 1.25 + driftY;
          const pr = Math.max(24, (0.45 + hash1D(s + 3.3) * 0.65) * Math.max(bank.rx, bank.ry));

          const pGrad = ctx.createRadialGradient(px, py, pr * 0.08, px, py, pr);
          pGrad.addColorStop(0, `rgba(255, 255, 255, ${clamp(cumAlpha * 0.95, 0, 1).toFixed(3)})`);
          pGrad.addColorStop(0.48, `rgba(248, 250, 252, ${clamp(cumAlpha * 0.68, 0, 1).toFixed(3)})`);
          pGrad.addColorStop(0.78, `rgba(226, 232, 240, ${clamp(cumAlpha * 0.25, 0, 1).toFixed(3)})`);
          pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    ctx.restore();
  }

  // ==========================================================================
  // 11. MASTER TIMELINE & CANVAS COMPOSITOR
  // ==========================================================================
  function resolveActiveSceneAndTime(rawT, cfg) {
    const speed = clamp(Number(cfg.playbackSpeed ?? 1.0), 0.2, 3.0);
    const activeFilter = cfg.activeSceneFilter || 'all';
    const totalDur = SCENES[SCENES.length - 1].end; // 12.0s

    if (activeFilter !== 'all') {
      const targetSc = SCENES.find((s) => s.id === activeFilter) || SCENES[0];
      const dur = Math.max(1.8, targetSc.end - targetSc.start);
      const isScrubbing = !!document.querySelector('#tpl-hud-scrubber-wrap.dragging');
      const isPaused = typeof topCustomizerState !== 'undefined' && topCustomizerState && topCustomizerState.isPlaying === false;
      if (isScrubbing) {
        const scrubP = clamp((Number(rawT) || 0) / totalDur, 0, 0.999);
        return { scene: targetSc, globalT: targetSc.start + scrubP * dur };
      }
      if (isPaused) {
        const pausedP = clamp(((Number(rawT) || 1.0) % dur) / dur, 0.15, 0.92);
        return { scene: targetSc, globalT: targetSc.start + pausedP * dur };
      }
      const soloElapsed = Math.max(0, (performance.now() - _soloSceneStartPerf) / 1000);
      const localP = ((soloElapsed * speed) % dur) / dur;
      return { scene: targetSc, globalT: targetSc.start + localP * dur };
    }

    const seqT = (((Number(rawT) || 0) * speed) % totalDur + totalDur) % totalDur;
    const found = SCENES.find((s) => seqT >= s.start && seqT < s.end) || SCENES[SCENES.length - 1];
    return { scene: found, globalT: seqT };
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

    // Camera zoom on the background cosmic split & logos (1.0x at 0s -> 1.85x at 5.2s as the globe expands)
    const cosmicCamZoom = 1.0 + easeInCubic(clamp(globalT / 5.4, 0, 1)) * 0.88;
    const starWorldPos = computeTravellingStarWorldPos(w, h, globalT, cfg);

    // 1. Render Cosmic Dual-Hemisphere Nebula, Cloud-Bleed Logos & Light Rift (Visible 0.0s – 5.8s)
    if (globalT < 6.0) {
      renderCosmicSplitAndLogos(ctx, w, h, cosmicCamZoom, globalT, cfg, starWorldPos);
      renderTravellingStarAndCounterRefraction(ctx, w, h, cosmicCamZoom, globalT, cfg);
    }

    // 2. Render 3D Spinning Night-Earth Globe with Terminator Rim Light & Accelerating Gravity Zoom (0.0s – 6.2s)
    if (globalT < 6.2) {
      renderSpinning3DEarthGlobe(ctx, w, h, globalT, cfg);
    }

    // 3. Render Macro Europe City Lights -> Stratospheric Cloud Dive -> Google Earth Satellite Map (4.8s – 12.0s)
    if (globalT >= 4.8) {
      renderMacroEuropeAndCloudDiveToGoogleEarth(ctx, w, h, globalT, cfg);
    }

    // 4. Interactive "Trace Light Rift Path" Overlay Banner when Tracing Mode is Active
    if (cfg.isTracingRiftPath) {
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, w - 4, h - 4);

      if (Array.isArray(cfg.customRiftPoints) && cfg.customRiftPoints.length > 0) {
        ctx.fillStyle = '#38bdf8';
        cfg.customRiftPoints.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x * w, pt.y * h, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.restore();
    }

    // Update Timecode Badge
    const timerBadge = document.getElementById('tpl-modal-timer-badge');
    if (timerBadge) {
      timerBadge.textContent = `${globalT.toFixed(1)}s / 12.0s (Act ${scene.index})`;
    }

    // Highlight active Scene Pill in Stage Bar
    const root = canvas.closest('.apce-stage-root');
    if (root) {
      root.querySelectorAll('.apce-stage-scene-pill').forEach((p) => {
        const pid = p.getAttribute('data-scene-pill');
        const isCurrent = (cfg.activeSceneFilter === 'all' && pid === 'all') || (cfg.activeSceneFilter === pid);
        p.classList.toggle('is-active', isCurrent);
        p.classList.toggle('is-playing-now', cfg.activeSceneFilter === 'all' && pid === scene.id);
      });
      const traceBtn = root.querySelector('[data-action="apce-toggle-rift-trace"]');
      if (traceBtn) {
        traceBtn.classList.toggle('is-tracing', !!cfg.isTracingRiftPath);
        traceBtn.textContent = cfg.isTracingRiftPath ? '✓ Done Tracing Rift' : '✏️ Trace Light Rift';
      }
    }
  }

  // Timeline raster bridge for tpl-3d-inspector.js
  window.renderAdidasPumaCosmicTimelineCanvas = function (ctx2d, clip, t, cw, ch) {
    if (!ctx2d || !ctx2d.canvas) return;
    const data = (clip && clip.fxScene && clip.fxScene.data) || getConfig();
    renderAdidasPumaCosmicCanvas(ctx2d.canvas, t, data);
  };

  // ==========================================================================
  // 12. STAGE HTML BUILDER, CLEAN SCREEN HUD, INTERACTIVE RIFT TRACER & MOUNTING
  // ==========================================================================
  let _lastAnimTime = 0;

  function applyCleanScreenHudState(isHidden) {
    const cfg = getConfig();
    cfg.cleanScreenHudHidden = !!isHidden;

    const topToolbar = document.getElementById('tpl-modal-stage-adaptive-toolbar');
    if (topToolbar) {
      topToolbar.style.setProperty('display', isHidden ? 'none' : 'flex', 'important');
    }

    document.querySelectorAll('.apce-stage-scene-bar').forEach((bar) => {
      bar.style.display = isHidden ? 'none' : 'flex';
    });

    const playerHud = document.getElementById('tpl-modal-player-hud');
    if (playerHud) {
      playerHud.style.display = '';
    }

    document.querySelectorAll('[data-role="apce-restore-hud-btn"]').forEach((btn) => {
      btn.style.display = isHidden ? 'inline-flex' : 'none';
    });
  }

  function buildAdidasPumaCosmicHtml(tplId, data) {
    const id = tplId || TEMPLATE_ID;
    const cfg = getConfig(data);
    const hideHud = !!cfg.cleanScreenHudHidden;

    return `
      <div id="adidas-puma-cosmic-viewport-${id}" class="apce-stage-root" style="position:absolute;inset:0;width:100%;height:100%;background:#030611;overflow:hidden;user-select:none;">
        <style>
          .apce-stage-scene-bar {
            position: absolute;
            top: 52px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 65;
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 4px 8px;
            border-radius: 999px;
            background: rgba(8, 11, 20, 0.90);
            border: 1px solid rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65);
            max-width: 96%;
            overflow-x: auto;
          }
          .apce-stage-scene-pill {
            appearance: none;
            border: 1px solid transparent;
            background: transparent;
            color: #94a3b8;
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 10.5px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 999px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.15s ease;
          }
          .apce-stage-scene-pill:hover {
            color: #f8fafc;
            background: rgba(255, 255, 255, 0.08);
          }
          .apce-stage-scene-pill.is-active {
            color: #ffffff;
            background: linear-gradient(135deg, #0284c7, #e11d48);
            border-color: rgba(255, 255, 255, 0.35);
            box-shadow: 0 2px 10px rgba(225, 29, 72, 0.4);
          }
          .apce-stage-scene-pill.is-playing-now:not(.is-active) {
            color: #38bdf8;
            border-color: rgba(56, 189, 248, 0.45);
            background: rgba(56, 189, 248, 0.12);
          }
          .apce-trace-pill-btn {
            appearance: none;
            border: 1px solid rgba(56, 189, 248, 0.45);
            background: rgba(14, 165, 233, 0.16);
            color: #7dd3fc;
            font-family: 'Inter', sans-serif;
            font-size: 10.5px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 999px;
            cursor: pointer;
            white-space: nowrap;
          }
          .apce-trace-pill-btn.is-tracing {
            background: #10b981;
            border-color: #6ee7b7;
            color: #052e16;
          }
        </style>

        <canvas
          id="adidas-puma-cosmic-canvas-${id}"
          class="apce-main-canvas"
          width="1280"
          height="720"
          style="width:100%;height:100%;object-fit:contain;display:block;cursor:pointer;"
        ></canvas>

        <!-- Interactive 4-Act Switcher + Direct Light Rift Path Tracer Bar -->
        <div class="apce-stage-scene-bar" style="display:${hideHud ? 'none' : 'flex'};">
          <button type="button" class="apce-stage-scene-pill ${cfg.activeSceneFilter === 'all' ? 'is-active' : ''}" data-scene-pill="all" title="Play Full 12s Sequence">
            ▶ All 4 Acts (12s)
          </button>
          ${SCENES.map((sc) => `
            <button type="button" class="apce-stage-scene-pill ${cfg.activeSceneFilter === sc.id ? 'is-active' : ''}" data-scene-pill="${sc.id}" title="${sc.sub}">
              ${sc.title}
            </button>
          `).join('')}
          <button type="button" class="apce-trace-pill-btn ${cfg.isTracingRiftPath ? 'is-tracing' : ''}" data-action="apce-toggle-rift-trace" title="Click and drag on the stage to manually trace the path of the central light rift!">
            ${cfg.isTracingRiftPath ? '✓ Done Tracing Rift' : '✏️ Trace Light Rift'}
          </button>
        </div>

        <!-- Subtle Restore HUD Pill when Clean Screen mode is active -->
        <button
          type="button"
          data-role="apce-restore-hud-btn"
          title="Restore Toolbar & Act Bar"
          style="position:absolute;top:12px;right:14px;z-index:80;display:${hideHud ? 'inline-flex' : 'none'};align-items:center;gap:5px;padding:5px 11px;border-radius:999px;background:rgba(9,12,22,0.78);border:1px solid rgba(56,189,248,0.45);color:#e0f2fe;font-family:'Inter',sans-serif;font-size:10.5px;font-weight:700;cursor:pointer;backdrop-filter:blur(8px);"
        >
          <span>👁 Show HUD</span>
        </button>

        <!-- Selection Feedback Toast -->
        <div
          class="apce-stage-selection-box"
          style="position:absolute;bottom:54px;left:50%;transform:translateX(-50%);z-index:62;pointer-events:none;display:none;padding:4px 12px;border-radius:999px;background:rgba(15,23,42,0.9);border:1px solid rgba(56,189,248,0.5);color:#f8fafc;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;"
        ></div>
      </div>
    `;
  }

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
    document.querySelectorAll('.apce-stage-scene-pill').forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute('data-scene-pill') === nextScene);
    });

    if (typeof window.apceRequestRender === 'function') {
      window.apceRequestRender();
    }
  }

  function bindStageEvents(rootEl, canvas) {
    if (!rootEl || !canvas || rootEl.dataset.apceBound === '1') return;
    rootEl.dataset.apceBound = '1';

    rootEl.querySelectorAll('.apce-stage-scene-pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = pill.getAttribute('data-scene-pill') || 'all';
        setActiveSceneFilter(target);
      });
    });

    const traceBtn = rootEl.querySelector('[data-action="apce-toggle-rift-trace"]');
    if (traceBtn) {
      traceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cfg = getConfig();
        const next = !cfg.isTracingRiftPath;
        updateConfigKey('isTracingRiftPath', next);
        if (next) {
          // Jump to Act 1 so the user can see the rift clearly while tracing
          if (cfg.activeSceneFilter === 'scene3' || cfg.activeSceneFilter === 'scene4') {
            setActiveSceneFilter('scene1');
          }
        }
      });
    }

    const restoreBtn = rootEl.querySelector('[data-role="apce-restore-hud-btn"]');
    if (restoreBtn) {
      restoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyCleanScreenHudState(false);
      });
    }

    // Bind global clean screen HUD buttons
    ['btn-tpl-modal-clean-hud', 'btn-tpl-hud-clean-view'].forEach((btnId) => {
      const btn = document.getElementById(btnId);
      if (btn && btn.dataset.apceCleanBound !== '1') {
        btn.dataset.apceCleanBound = '1';
        btn.addEventListener('click', () => {
          const activeTplId = (typeof topCustomizerState !== 'undefined' && topCustomizerState?.currentTpl?.id) || '';
          if (activeTplId === TEMPLATE_ID) {
            const cfg = getConfig();
            applyCleanScreenHudState(!cfg.cleanScreenHudHidden);
          }
        });
      }
    });

    // Interactive Rift Path Tracing on Canvas + Click-to-Select Stage Elements
    let isDrawingRift = false;

    const toNormCoords = (ev) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clamp((ev.clientX - rect.left) / Math.max(1, rect.width), 0.02, 0.98),
        y: clamp((ev.clientY - rect.top) / Math.max(1, rect.height), 0.0, 1.0)
      };
    };

    canvas.addEventListener('pointerdown', (ev) => {
      const cfg = getConfig();
      if (cfg.isTracingRiftPath) {
        isDrawingRift = true;
        const pt = toNormCoords(ev);
        cfg.customRiftPoints = [{ x: pt.x, y: 0.0 }, pt];
        updateConfigKey('riftPathMode', 'custom_traced');
        updateConfigKey('customRiftPoints', cfg.customRiftPoints);
        try { canvas.setPointerCapture(ev.pointerId); } catch (_) {}
        return;
      }

      // Otherwise check stage hit-boxes to focus the matching Inspector section
      const rect = canvas.getBoundingClientRect();
      const cx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * canvas.width;
      const cy = ((ev.clientY - rect.top) / Math.max(1, rect.height)) * canvas.height;

      for (let i = _lastStageHitBoxes.length - 1; i >= 0; i--) {
        const hb = _lastStageHitBoxes[i];
        if (cx >= hb.x && cx <= hb.x + hb.w && cy >= hb.y && cy <= hb.y + hb.h) {
          const toast = rootEl.querySelector('.apce-stage-selection-box');
          if (toast) {
            toast.textContent = `Selected: ${hb.label}`;
            toast.style.display = 'block';
            clearTimeout(toast._hideTimer);
            toast._hideTimer = setTimeout(() => { toast.style.display = 'none'; }, 2200);
          }
          break;
        }
      }
    });

    canvas.addEventListener('pointermove', (ev) => {
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
    });

    const endRiftDraw = () => {
      if (!isDrawingRift) return;
      isDrawingRift = false;
      const cfg = getConfig();
      if (Array.isArray(cfg.customRiftPoints) && cfg.customRiftPoints.length >= 2) {
        const last = cfg.customRiftPoints[cfg.customRiftPoints.length - 1];
        if (last.y < 0.96) {
          cfg.customRiftPoints.push({ x: last.x, y: 1.0 });
        }
        // Sort by y so the rift runs cleanly from top (0) to bottom (1)
        cfg.customRiftPoints.sort((a, b) => a.y - b.y);
        updateConfigKey('customRiftPoints', cfg.customRiftPoints);
      }
    };

    canvas.addEventListener('pointerup', endRiftDraw);
    canvas.addEventListener('pointercancel', endRiftDraw);
  }

  function tplMountAdidasPumaCosmicStage(stageEl, data) {
    if (!stageEl) return;
    const cfg = getConfig(data);
    stageEl.innerHTML = buildAdidasPumaCosmicHtml(TEMPLATE_ID, cfg);
    const root = stageEl.querySelector('.apce-stage-root');
    const canvas = stageEl.querySelector('.apce-main-canvas');
    if (root && canvas) {
      bindStageEvents(root, canvas);
      applyCleanScreenHudState(!!cfg.cleanScreenHudHidden);
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
  // 13. REGAARDER 4-TAB INSPECTOR SUITE (CONTENT, MOTION, LOOK, EFFECTS)
  // ==========================================================================
  function createSliderControl(label, key, min, max, step, unit, val) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-control-row';
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:5px;margin-bottom:10px;';
    const numVal = Number(val ?? min);
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;">
        <span style="color:#cbd5e1;font-weight:600;">${label}</span>
        <span class="rg-slider-val" style="color:#38bdf8;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;">${numVal}${unit || ''}</span>
      </div>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${numVal}" style="width:100%;accent-color:#38bdf8;cursor:pointer;" />
    `;
    const input = wrap.querySelector('input');
    const valSpan = wrap.querySelector('.rg-slider-val');
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      valSpan.textContent = `${v}${unit || ''}`;
      updateConfigKey(key, v);
    });
    return wrap;
  }

  function createSelectControl(label, key, options, currentVal, onChangeExtra) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-control-row';
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:5px;margin-bottom:10px;';
    wrap.innerHTML = `
      <label style="color:#cbd5e1;font-size:11.5px;font-weight:600;">${label}</label>
      <select style="width:100%;padding:7px 9px;border-radius:7px;background:#0f172a;border:1px solid rgba(255,255,255,0.14);color:#f8fafc;font-size:11.5px;font-weight:600;cursor:pointer;">
        ${options.map((o) => `<option value="${o.value}" ${o.value === currentVal ? 'selected' : ''}>${o.label}</option>`).join('')}
      </select>
    `;
    const sel = wrap.querySelector('select');
    sel.addEventListener('change', () => {
      updateConfigKey(key, sel.value);
      if (typeof onChangeExtra === 'function') onChangeExtra(sel.value);
    });
    return wrap;
  }

  function createColorControl(label, key, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-control-row';
    wrap.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
    wrap.innerHTML = `
      <span style="color:#cbd5e1;font-size:11.5px;font-weight:600;">${label}</span>
      <div style="display:flex;align-items:center;gap:6px;">
        <input type="color" value="${currentVal || '#38bdf8'}" style="width:28px;height:24px;border:none;border-radius:4px;background:transparent;cursor:pointer;" />
        <span class="rg-color-hex" style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#94a3b8;">${currentVal || '#38bdf8'}</span>
      </div>
    `;
    const inp = wrap.querySelector('input');
    const hexSpan = wrap.querySelector('.rg-color-hex');
    inp.addEventListener('input', () => {
      hexSpan.textContent = inp.value;
      updateConfigKey(key, inp.value);
    });
    return wrap;
  }

  function createTextControl(label, key, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-control-row';
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-bottom:9px;';
    wrap.innerHTML = `
      <label style="color:#cbd5e1;font-size:11.5px;font-weight:600;">${label}</label>
      <input type="text" value="${String(currentVal || '').replace(/"/g, '&quot;')}" style="width:100%;padding:6px 9px;border-radius:7px;background:#0f172a;border:1px solid rgba(255,255,255,0.14);color:#f8fafc;font-size:11.5px;" />
    `;
    const inp = wrap.querySelector('input');
    inp.addEventListener('input', () => {
      updateConfigKey(key, inp.value);
    });
    return wrap;
  }

  function createToggleControl(label, key, checked) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-control-row';
    wrap.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;';
    wrap.innerHTML = `
      <span style="color:#cbd5e1;font-size:11.5px;font-weight:600;">${label}</span>
      <input type="checkbox" ${checked ? 'checked' : ''} style="width:16px;height:16px;accent-color:#38bdf8;cursor:pointer;" />
    `;
    const cb = wrap.querySelector('input');
    cb.addEventListener('change', () => {
      updateConfigKey(key, cb.checked);
    });
    return wrap;
  }

  function createLogoUploadControl(label, urlKey, presetKey, removeBgKey, cfg) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:10px;border-radius:8px;background:rgba(15,23,42,0.65);border:1px solid rgba(255,255,255,0.08);margin-bottom:10px;';
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:11.5px;font-weight:700;color:#f8fafc;">${label}</span>
        <label style="padding:3px 9px;border-radius:6px;background:rgba(56,189,248,0.18);border:1px solid rgba(56,189,248,0.45);color:#38bdf8;font-size:10.5px;font-weight:700;cursor:pointer;">
          Upload PNG/JPG
          <input type="file" accept="image/*" style="display:none;" />
        </label>
      </div>
      <input type="text" placeholder="Or paste custom logo image URL..." value="${cfg[urlKey] && !cfg[urlKey].startsWith('data:') ? cfg[urlKey] : ''}" style="width:100%;padding:5px 8px;border-radius:6px;background:#090d16;border:1px solid rgba(255,255,255,0.12);color:#cbd5e1;font-size:11px;margin-bottom:6px;" />
    `;
    const fileInp = wrap.querySelector('input[type="file"]');
    const textInp = wrap.querySelector('input[type="text"]');

    fileInp.addEventListener('change', () => {
      const f = fileInp.files && fileInp.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        updateConfigKey(presetKey, 'custom');
        updateConfigKey(urlKey, dataUrl);
        getLoadedImage(dataUrl);
      };
      reader.readAsDataURL(f);
    });

    textInp.addEventListener('change', () => {
      const v = textInp.value.trim();
      if (v) {
        updateConfigKey(presetKey, 'custom');
        updateConfigKey(urlKey, v);
        getLoadedImage(v);
      }
    });

    wrap.appendChild(createToggleControl('Auto-Remove Logo Background', removeBgKey, cfg[removeBgKey] !== false));
    return wrap;
  }

  window.tplBuildAdidasPumaCosmicRegaarderPanes = function (panes, advDrawer) {
    if (!panes || !panes.content) return;
    const cfg = getConfig();

    panes.content.innerHTML = '';
    panes.motion.innerHTML = '';
    panes.look.innerHTML = '';
    panes.effects.innerHTML = '';
    if (advDrawer) advDrawer.innerHTML = '';

    // ========================================================================
    // TOP ACT SWITCHER & INTERACTIVE RIFT TRACER CARD (IN CONTENT TAB)
    // ========================================================================
    const actSwitcherCard = document.createElement('div');
    actSwitcherCard.className = 'rg-inspector-section';
    actSwitcherCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">4-Act Documentary Sequence & Rift Path Tracer</span>
        <span class="rg-section-subtitle">Isolate any act to loop & customize, or click Trace Light Rift to draw the glowing split path directly on screen.</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
        <button type="button" data-apce-scene-btn="all" style="grid-column:span 2;padding:7px 10px;border-radius:7px;border:1px solid rgba(56,189,248,0.45);background:${cfg.activeSceneFilter === 'all' ? 'linear-gradient(135deg,#0284c7,#e11d48)' : 'rgba(15,23,42,0.8)'};color:#fff;font-size:11px;font-weight:800;cursor:pointer;">
          ▶ Play All 4 Acts (Full 12.0s Sequence)
        </button>
        ${SCENES.map((sc) => `
          <button type="button" data-apce-scene-btn="${sc.id}" style="padding:6px 8px;border-radius:7px;border:1px solid rgba(255,255,255,0.14);background:${cfg.activeSceneFilter === sc.id ? '#0284c7' : 'rgba(15,23,42,0.75)'};color:#f8fafc;font-size:10.5px;font-weight:700;cursor:pointer;text-align:left;">
            ${sc.title}
          </button>
        `).join('')}
      </div>
      <div style="display:flex;gap:6px;">
        <button type="button" id="apce-inspector-trace-btn" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid rgba(56,189,248,0.55);background:rgba(14,165,233,0.18);color:#7dd3fc;font-size:11px;font-weight:800;cursor:pointer;">
          ✏️ Trace Light Rift Path on Stage
        </button>
        <button type="button" id="apce-inspector-reset-rift-btn" style="padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#cbd5e1;font-size:11px;font-weight:700;cursor:pointer;">
          Reset Rift
        </button>
      </div>
    `;
    actSwitcherCard.querySelectorAll('[data-apce-scene-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setActiveSceneFilter(btn.getAttribute('data-apce-scene-btn'));
      });
    });
    const inspTraceBtn = actSwitcherCard.querySelector('#apce-inspector-trace-btn');
    if (inspTraceBtn) {
      inspTraceBtn.addEventListener('click', () => {
        const next = !cfg.isTracingRiftPath;
        updateConfigKey('isTracingRiftPath', next);
        inspTraceBtn.textContent = next ? '✓ Click & Drag on Stage (Tap to Finish)' : '✏️ Trace Light Rift Path on Stage';
      });
    }
    const inspResetRiftBtn = actSwitcherCard.querySelector('#apce-inspector-reset-rift-btn');
    if (inspResetRiftBtn) {
      inspResetRiftBtn.addEventListener('click', () => {
        updateConfigKey('isTracingRiftPath', false);
        updateConfigKey('customRiftPoints', []);
        updateConfigKey('riftPathMode', 'vertical_authentic');
      });
    }
    panes.content.appendChild(actSwitcherCard);

    // ========================================================================
    // TAB 1: CONTENT — DUAL RIVAL LOGOS (ADIDAS VS PUMA) & GOOGLE EARTH LABELS
    // ========================================================================
    const logosCard = document.createElement('div');
    logosCard.className = 'rg-inspector-section';
    logosCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Left & Right Faction Logos (Adidas vs. Puma + Auto Background Removal)</span>
        <span class="rg-section-subtitle">Swap either logo or upload your own picture with automatic background removal and cosmic cloud bleed-through.</span>
      </div>
    `;
    logosCard.appendChild(createSelectControl('Left Faction Logo Preset', 'leftLogoPreset', [
      { value: 'adidas', label: 'Adidas (Authentic 3-Stripes + Wordmark)' },
      { value: 'puma', label: 'PUMA (Jumping Cat + Wordmark)' },
      { value: 'nike', label: 'Nike Swoosh Lockup' },
      { value: 'apple', label: 'Apple Lockup' },
      { value: 'custom', label: 'Custom Uploaded / URL Logo' }
    ], cfg.leftLogoPreset));
    logosCard.appendChild(createLogoUploadControl('Left Faction Logo Image', 'leftLogoUrl', 'leftLogoPreset', 'leftLogoRemoveBg', cfg));
    logosCard.appendChild(createSliderControl('Left Logo Scale', 'leftLogoScale', 0.4, 1.8, 0.05, 'x', cfg.leftLogoScale));
    logosCard.appendChild(createSliderControl('Left Logo Opacity', 'leftLogoOpacity', 0.1, 1.0, 0.02, '', cfg.leftLogoOpacity));

    logosCard.appendChild(createSelectControl('Right Faction Logo Preset', 'rightLogoPreset', [
      { value: 'puma', label: 'PUMA (Authentic Jumping Cat + Wordmark)' },
      { value: 'adidas', label: 'Adidas (3-Stripes + Wordmark)' },
      { value: 'nike', label: 'Nike Swoosh Lockup' },
      { value: 'apple', label: 'Apple Lockup' },
      { value: 'custom', label: 'Custom Uploaded / URL Logo' }
    ], cfg.rightLogoPreset));
    logosCard.appendChild(createLogoUploadControl('Right Faction Logo Image', 'rightLogoUrl', 'rightLogoPreset', 'rightLogoRemoveBg', cfg));
    logosCard.appendChild(createSliderControl('Right Logo Scale', 'rightLogoScale', 0.4, 1.8, 0.05, 'x', cfg.rightLogoScale));
    logosCard.appendChild(createSliderControl('Right Logo Opacity', 'rightLogoOpacity', 0.1, 1.0, 0.02, '', cfg.rightLogoOpacity));
    logosCard.appendChild(createSliderControl('Nebula Cloud Bleed-Through on Logos', 'logoCloudBleedStrength', 0.0, 1.0, 0.05, '', cfg.logoCloudBleedStrength));
    panes.content.appendChild(logosCard);

    const earthContentCard = document.createElement('div');
    earthContentCard.className = 'rg-inspector-section';
    earthContentCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">3D Globe Target Region & Google Earth Attribution (Acts 2–4)</span>
        <span class="rg-section-subtitle">Choose which continent/region the spinning globe locks onto and customize the Google Earth satellite watermark.</span>
      </div>
    `;
    earthContentCard.appendChild(createSelectControl('Globe Zoom Target Continent / Region', 'globeTargetRegion', [
      { value: 'europe_germany', label: 'Europe / Germany (Herzogenaurach — Authentic)' },
      { value: 'north_america', label: 'North America (East Coast & Great Lakes)' },
      { value: 'east_asia', label: 'East Asia (Tokyo, Seoul, Shanghai)' },
      { value: 'global', label: 'Atlantic / Global Center' }
    ], cfg.globeTargetRegion));
    earthContentCard.appendChild(createToggleControl('Show Regional Map Highlight Glow (Act 3)', 'regionHighlightEnabled', cfg.regionHighlightEnabled !== false));
    earthContentCard.appendChild(createToggleControl('Show Google Earth Attribution (Act 4)', 'showGoogleEarthWatermark', cfg.showGoogleEarthWatermark !== false));
    earthContentCard.appendChild(createTextControl('Satellite Watermark Title', 'googleEarthWatermarkText', cfg.googleEarthWatermarkText));
    earthContentCard.appendChild(createTextControl('Satellite Attribution Subtext', 'googleEarthSubText', cfg.googleEarthSubText));
    panes.content.appendChild(earthContentCard);

    // ========================================================================
    // TAB 2: MOTION — GLOBE SPIN DIRECTION, GRAVITY ZOOM & STAR TRAJECTORY
    // ========================================================================
    const globeMotionCard = document.createElement('div');
    globeMotionCard.className = 'rg-inspector-section';
    globeMotionCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">3D Earth Spin Direction & Gravity Zoom Acceleration</span>
        <span class="rg-section-subtitle">Spin the globe left-to-right, right-to-left, up-and-down, or diagonal tumble, and control the gravitational pull as it approaches.</span>
      </div>
    `;
    globeMotionCard.appendChild(createSelectControl('3D Globe Spin Direction', 'globeSpinDirection', [
      { value: 'west_to_east_authentic', label: 'Left to Right / West-to-East (Authentic)' },
      { value: 'east_to_west', label: 'Right to Left / East-to-West' },
      { value: 'north_to_south', label: 'Up to Down / North-to-South' },
      { value: 'south_to_north', label: 'Down to Up / South-to-North' },
      { value: 'diagonal_tumble', label: 'Diagonal 3D Orbital Tumble' }
    ], cfg.globeSpinDirection));
    globeMotionCard.appendChild(createSliderControl('Globe Rotation Speed', 'globeSpinSpeed', 0.2, 2.5, 0.05, 'x', cfg.globeSpinSpeed));
    globeMotionCard.appendChild(createSliderControl('Gravitational Zoom Acceleration', 'globeGravityAcceleration', 0.5, 2.2, 0.05, 'x', cfg.globeGravityAcceleration));
    globeMotionCard.appendChild(createSliderControl('Initial Globe Size (Act 1)', 'globeInitialScale', 0.08, 0.28, 0.005, 'x', cfg.globeInitialScale));
    panes.motion.appendChild(globeMotionCard);

    const starMotionCard = document.createElement('div');
    starMotionCard.className = 'rg-inspector-section';
    starMotionCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Travelling Sun-Star & Counter-Flare Trajectory</span>
        <span class="rg-section-subtitle">Control the path of the bright star that travels from Puma to the Adidas stripes while its neon lens-flare rings sweep in reverse.</span>
      </div>
    `;
    starMotionCard.appendChild(createSelectControl('Travelling Star Trajectory Path', 'starTrajectoryMode', [
      { value: 'right_to_left_authentic', label: 'Right-to-Left: Puma Paws → Adidas Stripes (Authentic)' },
      { value: 'left_to_right', label: 'Left-to-Right: Adidas → Puma' },
      { value: 'top_to_bottom', label: 'Top-to-Bottom Along Central Rift' },
      { value: 'bottom_to_top', label: 'Bottom-to-Top Along Central Rift' },
      { value: 'orbit_globe', label: '360° Orbital Loop Around Earth Globe' }
    ], cfg.starTrajectoryMode));
    starMotionCard.appendChild(createSliderControl('Star Travel Speed', 'starTravelSpeed', 0.3, 2.5, 0.05, 'x', cfg.starTravelSpeed));
    starMotionCard.appendChild(createSliderControl('Stratospheric Cloud Dive Speed (Act 4)', 'cloudDiveSpeed', 0.3, 2.5, 0.05, 'x', cfg.cloudDiveSpeed));
    panes.motion.appendChild(starMotionCard);

    // ========================================================================
    // TAB 3: LOOK — DUAL COSMIC NEBULA COLORS, RIFT PATH STYLE & DAYLIGHT RIM
    // ========================================================================
    const nebulaLookCard = document.createElement('div');
    nebulaLookCard.className = 'rg-inspector-section';
    nebulaLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Dual-Universe Cosmic Nebula Colors (Left vs. Right)</span>
        <span class="rg-section-subtitle">Customize the two cloudy cosmic colors on screen or choose a dual-faction color palette preset.</span>
      </div>
    `;
    nebulaLookCard.appendChild(createSelectControl('Dual Cosmic Color Palette Preset', 'nebulaPalettePreset', [
      { value: 'authentic_blue_crimson', label: 'Authentic Electric Blue vs. Crimson Red' },
      { value: 'gold_purple', label: 'Imperial Gold vs. Royal Violet' },
      { value: 'emerald_amber', label: 'Emerald Matrix vs. Solar Amber' },
      { value: 'cyber_neon', label: 'Cyber Cyan vs. Hot Magenta' }
    ], cfg.nebulaPalettePreset));
    nebulaLookCard.appendChild(createColorControl('Left Nebula Primary Color (Adidas Side)', 'leftNebulaPrimaryColor', cfg.leftNebulaPrimaryColor));
    nebulaLookCard.appendChild(createColorControl('Left Nebula Bright Cloud Highlight', 'leftNebulaSecondaryColor', cfg.leftNebulaSecondaryColor));
    nebulaLookCard.appendChild(createColorControl('Right Nebula Primary Color (Puma Side)', 'rightNebulaPrimaryColor', cfg.rightNebulaPrimaryColor));
    nebulaLookCard.appendChild(createColorControl('Right Nebula Bright Cloud Highlight', 'rightNebulaSecondaryColor', cfg.rightNebulaSecondaryColor));
    nebulaLookCard.appendChild(createSliderControl('Cosmic Nebula Cloud Density', 'nebulaCloudDensity', 0.2, 1.5, 0.05, 'x', cfg.nebulaCloudDensity));
    panes.look.appendChild(nebulaLookCard);

    const riftLookCard = document.createElement('div');
    riftLookCard.className = 'rg-inspector-section';
    riftLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Central Light Rift Geometry & Earth Terminator Rim Look</span>
        <span class="rg-section-subtitle">Choose a preset light rift shape (or trace your own), and style the globe's daylight crescent rim light.</span>
      </div>
    `;
    riftLookCard.appendChild(createSelectControl('Light Rift Path Shape', 'riftPathMode', [
      { value: 'vertical_authentic', label: 'Vertical Split (Authentic)' },
      { value: 'diagonal_clash', label: 'Diagonal Slash Split' },
      { value: 's_curve', label: 'Flowing S-Curve Faultline' },
      { value: 'lightning_rift', label: 'Jagged Lightning Rift' },
      { value: 'custom_traced', label: 'Custom Manually-Traced Path' }
    ], cfg.riftPathMode));
    riftLookCard.appendChild(createColorControl('Rift Left Glow Color', 'riftLeftGlowColor', cfg.riftLeftGlowColor));
    riftLookCard.appendChild(createColorControl('Rift Right Glow Color', 'riftRightGlowColor', cfg.riftRightGlowColor));
    riftLookCard.appendChild(createColorControl('Earth Daylight Crescent Rim Color', 'globeDaylightRimColor', cfg.globeDaylightRimColor));
    riftLookCard.appendChild(createSliderControl('Earth Daylight Crescent Rim Intensity', 'globeDaylightRimIntensity', 0.2, 2.2, 0.05, 'x', cfg.globeDaylightRimIntensity));
    riftLookCard.appendChild(createSelectControl('Google Earth Satellite Terrain Theme (Act 4)', 'satelliteTerrainStyle', [
      { value: 'authentic_daylight', label: 'Authentic Daylight Satellite Terrain' },
      { value: 'tactical_dark', label: 'Tactical Night Satellite Recon' },
      { value: 'emerald_topo', label: 'Emerald Topographic Satellite' }
    ], cfg.satelliteTerrainStyle));
    panes.look.appendChild(riftLookCard);

    // ========================================================================
    // TAB 4: EFFECTS — AMBIANCE (STARS/RAIN/SNOW), NEON LENS REFRACTION & CLOUDS
    // ========================================================================
    const ambianceFxCard = document.createElement('div');
    ambianceFxCard.className = 'rg-inspector-section';
    ambianceFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Cosmic Ambiance (Stars, Rain, Snow, Embers, Dust)</span>
        <span class="rg-section-subtitle">Switch the environmental particles between twinkling stars, rain, snow, embers, or cosmic dust.</span>
      </div>
    `;
    ambianceFxCard.appendChild(createSelectControl('Ambiance Particle Mode', 'ambianceMode', [
      { value: 'stars', label: 'Twinkling Deep-Space Stars (Authentic)' },
      { value: 'rain', label: 'Atmospheric Neon Rain' },
      { value: 'snow', label: 'Drifting Winter Snowflakes' },
      { value: 'embers', label: 'Rising Fire Embers' },
      { value: 'cosmic_dust', label: 'Floating Quantum Dust' }
    ], cfg.ambianceMode));
    ambianceFxCard.appendChild(createSliderControl('Ambiance Particle Density', 'ambianceParticleCount', 0, 450, 10, '', cfg.ambianceParticleCount));
    ambianceFxCard.appendChild(createSliderControl('Ambiance Drift / Fall Speed', 'ambianceParticleSpeed', 0.2, 2.5, 0.05, 'x', cfg.ambianceParticleSpeed));
    ambianceFxCard.appendChild(createToggleControl('Show Prominent Puma & Drift Stars', 'prominentPumaStarEnabled', cfg.prominentPumaStarEnabled !== false));
    panes.effects.appendChild(ambianceFxCard);

    const refractionFxCard = document.createElement('div');
    refractionFxCard.className = 'rg-inspector-section';
    refractionFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Optical Lens-Flare Refraction Rings & Rift Plasma Glow</span>
        <span class="rg-section-subtitle">Adjust the counter-moving neon magenta/cyan refraction hoops, star flare size, and stratospheric cloud thickness.</span>
      </div>
    `;
    refractionFxCard.appendChild(createToggleControl('Enable Counter-Moving Neon Lens Refraction', 'neonRefractionEnabled', cfg.neonRefractionEnabled !== false));
    refractionFxCard.appendChild(createSliderControl('Neon Lens Refraction Intensity', 'neonRefractionIntensity', 0.0, 2.2, 0.05, 'x', cfg.neonRefractionIntensity));
    refractionFxCard.appendChild(createSliderControl('Optical Refraction Ring Count', 'neonRefractionRingCount', 1, 7, 1, ' rings', cfg.neonRefractionRingCount));
    refractionFxCard.appendChild(createColorControl('Upper Refraction Glow Color', 'neonRefractionTopColor', cfg.neonRefractionTopColor));
    refractionFxCard.appendChild(createColorControl('Lower Refraction Ring Color (Puma Side)', 'neonRefractionBottomColor', cfg.neonRefractionBottomColor));
    refractionFxCard.appendChild(createSliderControl('Central Light Rift Width', 'riftWidthPx', 6, 48, 1, 'px', cfg.riftWidthPx));
    refractionFxCard.appendChild(createSliderControl('Central Light Rift Glow Intensity', 'riftGlowIntensity', 0.2, 2.2, 0.05, 'x', cfg.riftGlowIntensity));
    refractionFxCard.appendChild(createSliderControl('Stratospheric Cloud Dive Density (Act 4)', 'cloudDiveDensity', 0.2, 2.0, 0.05, 'x', cfg.cloudDiveDensity));
    panes.effects.appendChild(refractionFxCard);

    if (advDrawer) {
      const advCard = document.createElement('div');
      advCard.className = 'rg-inspector-section';
      advCard.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Master Sequence Speed & Fine Logo Offsets</span>
          <span class="rg-section-subtitle">Global playback speed and pixel-level X/Y logo positioning.</span>
        </div>
      `;
      advCard.appendChild(createSliderControl('Global Sequence Playback Speed', 'playbackSpeed', 0.3, 2.5, 0.05, 'x', cfg.playbackSpeed));
      advCard.appendChild(createSliderControl('Left Logo Horizontal Offset', 'leftLogoOffsetX', -160, 160, 2, 'px', cfg.leftLogoOffsetX));
      advCard.appendChild(createSliderControl('Left Logo Vertical Offset', 'leftLogoOffsetY', -120, 120, 2, 'px', cfg.leftLogoOffsetY));
      advCard.appendChild(createSliderControl('Right Logo Horizontal Offset', 'rightLogoOffsetX', -160, 160, 2, 'px', cfg.rightLogoOffsetX));
      advCard.appendChild(createSliderControl('Right Logo Vertical Offset', 'rightLogoOffsetY', -120, 120, 2, 'px', cfg.rightLogoOffsetY));
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
  // 14. GLOBAL EXPORTS
  // ==========================================================================
  window.buildAdidasPumaCosmicHtml = buildAdidasPumaCosmicHtml;
  window.tplMountAdidasPumaCosmicStage = tplMountAdidasPumaCosmicStage;
  window.stepAdidasPumaCosmicAnimation = stepAdidasPumaCosmicAnimation;
  window.renderAdidasPumaCosmicCanvas = renderAdidasPumaCosmicCanvas;
})();
