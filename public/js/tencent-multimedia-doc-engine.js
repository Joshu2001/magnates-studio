/**
 * ============================================================================
 * REVERSE-ENGINEERED 5-SCENE MULTIMEDIA DOCUMENTARY ENGINE
 * (TEMPLATE_ID: 'tencent-shadow-giant-multimedia')
 * ============================================================================
 * 100% Pure Multi-Layer Cutout, Parallax, Brush-Off & Glitch Choreography
 * reverse-engineered from frames 000054 through 000410 (raw sitting stage
 * footage in frames 000001-000050 dismissed).
 *
 * Every single cutout, icon, company logo + text lockup (Apple, Microsoft,
 * Google), separate red paint brush stroke ("the red little thing") with
 * independent timing, full-screen 3D low-poly triangle mesh, softly blurred
 * out-of-focus floating fragments, rising fire pit, all 4 2.5D Polaroid beats,
 * Google typewriter bar + tight camera pan, "People also ask" accordion,
 * 4 SERP cards, 8-row 3D Market Cap Leaderboard, and every glitch mechanic
 * is individually editable across the Regaarder Studio Inspector Tabs
 * (Content, Motion, Look, Effects) and clickable directly on the stage canvas.
 * ============================================================================
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'tencent-shadow-giant-multimedia';

  // ==========================================================================
  // 1. HIGH-RESOLUTION TRANSPARENT SVG DATA-URI CUTOUT ASSETS (DEFAULT LAYERS)
  // ==========================================================================
  function svgToDataUri(svgString) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString.trim());
  }

  const DEFAULT_CUTOUT_URIS = {
    // Authentic Frame 000073-000125: Crisp white circular disc with sky-blue border & stylized italic blue Tencent "T"
    tBadge: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        <defs>
          <radialGradient id="tbDisc" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="82%" stop-color="#f1f5f9"/>
            <stop offset="100%" stop-color="#dbeafe"/>
          </radialGradient>
          <linearGradient id="tbBlueT" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="50%" stop-color="#0066cc"/>
            <stop offset="100%" stop-color="#004499"/>
          </linearGradient>
          <filter id="tbGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0088ff" flood-opacity="0.75"/>
          </filter>
        </defs>
        <circle cx="128" cy="128" r="102" fill="url(#tbDisc)" stroke="#0ea5e9" stroke-width="9" filter="url(#tbGlow)"/>
        <circle cx="128" cy="128" r="91" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.55"/>
        <g transform="skewX(-12) translate(22, 0)">
          <path d="M74 78 H184 V104 H143 V186 H113 V104 H74 Z" fill="url(#tbBlueT)"/>
          <rect x="74" y="78" width="110" height="7" fill="#38bdf8" opacity="0.65"/>
        </g>
      </svg>
    `),

    // Authentic Frame 000337-000385 (image_fd5551af.png): Pure solid glowing white Apple logo (no grey gradient)
    appleLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        <defs>
          <filter id="apGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ffffff" flood-opacity="0.38"/>
          </filter>
        </defs>
        <g filter="url(#apGlow)">
          <path d="M168.5 134.8c-.3-25.2 20.6-37.4 21.5-38-11.7-17.2-30-19.5-36.5-19.8-15.5-1.6-30.3 9.1-38.2 9.1-7.9 0-20-8.9-32.9-8.7-16.9.2-32.5 9.8-41.2 25-17.6 30.5-4.5 75.7 12.6 100.5 8.4 12.1 18.4 25.7 31.5 25.2 12.6-.5 17.4-8.1 32.7-8.1 15.3 0 19.6 8.1 32.9 7.9 13.6-.2 22.2-12.3 30.5-24.5 9.6-14 13.6-27.6 13.8-28.3-.3-.1-26.4-10.1-26.7-40.3z" fill="#ffffff"/>
          <path d="M143.6 60.2c6.9-8.4 11.6-20.1 10.3-31.7-10 .4-22.1 6.7-29.2 15.1-6.3 7.3-11.9 19.2-10.4 30.5 11.2.9 22.4-5.5 29.3-13.9z" fill="#ffffff"/>
        </g>
      </svg>
    `),

    // Authentic Frame 000357-000385 (image_fd5551af.png): Microsoft 4-square logo with crisp white outer frame & white cross dividers
    microsoftLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        <defs>
          <filter id="msGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.45"/>
          </filter>
        </defs>
        <g filter="url(#msGlow)">
          <!-- Crisp White Outer Frame & Cross Backing (Matches image_fd5551af.png) -->
          <rect x="34" y="34" width="188" height="188" fill="#ffffff"/>
          <!-- 4 Quadrants Inside White Frame -->
          <rect x="40" y="40" width="85" height="85" fill="#d94f28"/>
          <rect x="131" y="40" width="85" height="85" fill="#81b91e"/>
          <rect x="40" y="131" width="85" height="85" fill="#28a2dc"/>
          <rect x="131" y="131" width="85" height="85" fill="#f2b718"/>
        </g>
      </svg>
    `),

    // Authentic Frame 000365-000385 (image_fd5551af.png): Clean flat 4-color Google "G"
    googleLogo: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        <g>
          <path d="M218 130.2c0-7.4-.7-14.5-1.9-21.4H128v40.5h50.5c-2.2 11.7-8.8 21.6-18.7 28.2v23.4h30.3c17.7-16.3 27.9-40.3 27.9-70.7z" fill="#4285F4"/>
          <path d="M128 222c25.3 0 46.5-8.4 62-22.7l-30.3-23.4c-8.4 5.6-19.1 9-31.7 9-24.4 0-45-16.5-52.4-38.6H44.3v24.2C59.7 201.1 91.4 222 128 222z" fill="#34A853"/>
          <path d="M75.6 146.3c-1.9-5.6-3-11.6-3-17.8s1.1-12.2 3-17.8V86.5H44.3C37.8 99.4 34 113.8 34 128.5s3.8 29.1 10.3 42l31.3-24.2z" fill="#FBBC05"/>
          <path d="M128 72.1c13.8 0 26.1 4.7 35.8 14l26.9-26.9C174.5 44 153.3 35 128 35 91.4 35 59.7 55.9 44.3 86.5l31.3 24.2c7.4-22.1 28-38.6 52.4-38.6z" fill="#EA4335"/>
        </g>
      </svg>
    `),

    // Beat 2A Cutout (Frame 000145-000149): Conference Podium & 3D Tencent Floor Sign
    polaroidPodium: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 280" width="380" height="280">
        <g fill="#0f172a" stroke="#475569" stroke-width="1.5">
          <circle cx="95" cy="92" r="14"/><path d="M72 155 C72 118 118 118 118 155 Z"/>
          <circle cx="145" cy="86" r="15"/><path d="M120 155 C120 114 170 114 170 155 Z"/>
          <circle cx="195" cy="84" r="16"/><path d="M168 155 C168 112 222 112 222 155 Z"/>
          <circle cx="245" cy="88" r="15"/><path d="M220 155 C220 116 270 116 270 155 Z"/>
          <circle cx="290" cy="94" r="14"/><path d="M268 155 C268 120 312 120 312 155 Z"/>
        </g>
        <polygon points="155,126 235,126 222,226 168,226" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <polygon points="155,126 195,148 168,226" fill="#e2e8f0"/>
        <polygon points="235,126 195,148 222,226" fill="#cbd5e1"/>
        <text x="190" y="254" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-style="italic" font-size="38" fill="#ffffff" stroke="#0284c7" stroke-width="2">Tencent 腾讯</text>
      </svg>
    `),

    // Beat 2B Cutout (Frame 000153-000162): Woman in Glowing Red "T T" Ski Goggles
    polaroidGogglesWoman: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340" width="340" height="340">
        <defs>
          <linearGradient id="lensRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff2a2a"/>
            <stop offset="55%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#7f1d1d"/>
          </linearGradient>
          <filter id="redLensGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#ef4444" flood-opacity="0.9"/>
          </filter>
        </defs>
        <path d="M48 335 C52 230 92 205 170 205 C248 205 288 230 292 335 Z" fill="#111827" stroke="#e2e8f0" stroke-width="3"/>
        <path d="M84 220 C72 120 100 52 170 52 C240 52 268 120 256 220 C242 185 225 165 170 165 C115 165 98 185 84 220 Z" fill="#090d16"/>
        <ellipse cx="170" cy="146" rx="58" ry="70" fill="#e5c1b8" stroke="#1e293b" stroke-width="2"/>
        <path d="M154 190 Q170 198 186 190" fill="none" stroke="#9f1239" stroke-width="3.5" stroke-linecap="round"/>
        <g filter="url(#redLensGlow)">
          <rect x="92" y="102" width="156" height="58" rx="24" fill="url(#lensRed)" stroke="#ffffff" stroke-width="4"/>
          <path d="M162 158 Q170 146 178 158" fill="#111827"/>
          <g transform="skewX(-12) translate(18, 0)">
            <path d="M114 116 H150 V125 H137 V148 H127 V125 H114 Z" fill="#090a0f"/>
          </g>
          <g transform="skewX(-12) translate(18, 0)">
            <path d="M178 116 H214 V125 H201 V148 H191 V125 H178 Z" fill="#090a0f"/>
          </g>
        </g>
      </svg>
    `),

    // Beat 2B Background (Frame 000153-000162): B&W Smartphone Paparazzi Crowd Hands
    polaroidBg: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" width="420" height="300">
        <rect width="420" height="300" fill="#18181b"/>
        <g stroke="#71717a" stroke-width="2" fill="#27272a">
          <rect x="28" y="60" width="38" height="68" rx="5" transform="rotate(-12 47 94)" fill="#e4e4e7"/>
          <rect x="92" y="42" width="42" height="74" rx="5" transform="rotate(8 113 79)" fill="#f4f4f5"/>
          <rect x="165" y="34" width="44" height="76" rx="5" transform="rotate(-5 187 72)" fill="#e4e4e7"/>
          <rect x="255" y="48" width="40" height="72" rx="5" transform="rotate(14 275 84)" fill="#f4f4f5"/>
          <rect x="332" y="58" width="42" height="74" rx="5" transform="rotate(-10 353 95)" fill="#d4d4d8"/>
        </g>
        <circle cx="113" cy="56" r="14" fill="#ffffff" opacity="0.75"/>
        <circle cx="275" cy="64" r="12" fill="#ffffff" opacity="0.65"/>
        <circle cx="52" cy="210" r="34" fill="#09090b"/>
        <circle cx="135" cy="225" r="38" fill="#09090b"/>
        <circle cx="295" cy="220" r="36" fill="#09090b"/>
        <circle cx="375" cy="215" r="34" fill="#09090b"/>
      </svg>
    `),

    // Beat 2C Midground (Frame 000165-000177): Vertical Crimson Executive Portrait in Suit & Red Tie
    polaroidSubject: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" width="320" height="380">
        <defs>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
        </defs>
        <circle cx="160" cy="48" r="24" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="6 3"/>
        <polygon points="160,28 166,42 182,42 169,51 174,66 160,57 146,66 151,51 138,42 154,42" fill="#fbbf24"/>
        <path d="M35 370 C38 255 85 225 160 225 C235 225 282 255 285 370 Z" fill="url(#suitGrad)" stroke="#ffffff" stroke-width="3"/>
        <polygon points="125,225 160,280 195,225" fill="#f8fafc"/>
        <polygon points="152,248 168,248 175,365 160,375 145,365" fill="#dc2626"/>
        <ellipse cx="160" cy="152" rx="50" ry="62" fill="#d6b4a1" stroke="#0f172a" stroke-width="3"/>
        <path d="M110 135 C112 92 208 92 210 135 C195 112 125 112 110 135 Z" fill="#111827"/>
        <rect x="120" y="138" width="34" height="18" rx="3" fill="none" stroke="#334155" stroke-width="3"/>
        <rect x="166" y="138" width="34" height="18" rx="3" fill="none" stroke="#334155" stroke-width="3"/>
        <line x1="154" y1="146" x2="166" y2="146" stroke="#334155" stroke-width="3"/>
      </svg>
    `),

    // Beat 2C Foreground (Frame 000169-000177): Two Puppeteer Hands & Golden Circuit Traces
    polaroidHands: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="360" height="360">
        <defs>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#f59e0b" flood-opacity="0.9"/>
          </filter>
        </defs>
        <g filter="url(#goldGlow)">
          <path d="M240 18 L285 18 L272 88 L248 118 L234 112 L244 78 L218 92 L210 82 L238 56 Z" fill="#e5c1b8" stroke="#ffffff" stroke-width="2"/>
          <path d="M142 252 C158 232 205 236 226 258 L242 315 L135 315 Z" fill="#d6b4a1" stroke="#fde047" stroke-width="2"/>
          <g stroke="#fef08a" stroke-width="2.5" fill="none">
            <polyline points="118,340 118,220 148,190 148,118"/>
            <polyline points="156,340 156,205 182,175 182,95"/>
            <polyline points="198,340 198,195 228,165 228,108"/>
            <polyline points="238,340 238,225 262,195 262,128"/>
          </g>
          <circle cx="148" cy="118" r="5" fill="#ffffff"/>
          <circle cx="182" cy="95" r="5.5" fill="#fef08a"/>
          <circle cx="228" cy="108" r="5" fill="#ffffff"/>
          <circle cx="262" cy="128" r="5" fill="#fef08a"/>
        </g>
      </svg>
    `),

    // Beat 2D Cutout (Frame 000181-000193): Warped Binary Code Surveillance Eye + Neon Yellow-Green "T" Iris
    polaroidBinaryEye: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="420" height="280">
        <defs>
          <radialGradient id="redIris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#450a0a"/>
            <stop offset="55%" stop-color="#dc2626"/>
            <stop offset="85%" stop-color="#991b1b"/>
            <stop offset="100%" stop-color="#1f2937"/>
          </radialGradient>
          <filter id="neonTGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#a3e635" flood-opacity="0.95"/>
          </filter>
        </defs>
        <rect width="420" height="280" fill="#090d16"/>
        <g font-family="'JetBrains Mono', monospace" font-weight="800" font-size="15" fill="#94a3b8" opacity="0.85">
          <text x="14" y="34" letter-spacing="3">011001010011010110100101101010</text>
          <text x="8" y="58" letter-spacing="3">101011010110010101101001011001</text>
          <text x="18" y="82" letter-spacing="3">010110010111010100101101011010</text>
          <text x="18" y="218" letter-spacing="3">110101100101011010110010110101</text>
          <text x="8" y="242" letter-spacing="3">010110101100101101001011010010</text>
          <text x="14" y="266" letter-spacing="3">100101101001011010110010101101</text>
        </g>
        <path d="M24 140 Q210 38 396 140 Q210 242 24 140 Z" fill="#f1f5f9" stroke="#475569" stroke-width="6"/>
        <circle cx="210" cy="140" r="68" fill="url(#redIris)" stroke="#7f1d1d" stroke-width="4"/>
        <circle cx="210" cy="140" r="54" fill="none" stroke="#fca5a5" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.7"/>
        <g transform="skewX(-12) translate(28, 0)" filter="url(#neonTGlow)">
          <path d="M182 106 H242 V120 H219 V174 H203 V120 H182 Z" fill="#d9f99d" stroke="#84cc16" stroke-width="2"/>
        </g>
      </svg>
    `),

    // Authentic Frame 000337-000385 (image_fd5551af.png): Softly out-of-focus, curved pale-sage/white 3D banknote fragment (NO cartoon $100 clip-art!)
    dollarBill: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 180" width="260" height="180">
        <defs>
          <filter id="dofBlur" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="6.5"/>
          </filter>
          <linearGradient id="billSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f1f5f2" stop-opacity="0.95"/>
            <stop offset="45%" stop-color="#cbdcd0" stop-opacity="0.92"/>
            <stop offset="100%" stop-color="#94b09d" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <g filter="url(#dofBlur)">
          <!-- Warped / Curved 3D Fluttering Banknote Silhouette (Matches image_fd5551af.png) -->
          <path d="M28 42 Q125 18 228 54 Q212 118 192 146 Q104 122 22 134 Q36 86 28 42 Z" fill="url(#billSurface)"/>
          <!-- Softly Blurred Inner Engraving Frame & Portrait Oval -->
          <path d="M44 54 Q125 34 208 64 Q196 112 180 132 Q104 112 40 120 Z" fill="none" stroke="#5c7867" stroke-width="5" opacity="0.62"/>
          <ellipse cx="122" cy="88" rx="26" ry="30" fill="#6b8776" opacity="0.58"/>
          <circle cx="72" cy="84" r="10" fill="#7c9987" opacity="0.45"/>
          <circle cx="172" cy="92" r="11" fill="#7c9987" opacity="0.45"/>
        </g>
      </svg>
    `),

    subliminalCutout: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        <rect width="256" height="256" fill="#090a0f"/>
        <circle cx="128" cy="100" r="44" fill="#020617" stroke="#ef4444" stroke-width="4"/>
        <path d="M48 236 C54 168 88 152 128 152 C168 152 202 168 208 236 Z" fill="#020617" stroke="#ef4444" stroke-width="4"/>
        <rect x="92" y="84" width="72" height="24" rx="6" fill="#dc2626"/>
        <text x="128" y="102" text-anchor="middle" font-family="monospace" font-size="18" font-weight="900" fill="#ffffff">SHADOW</text>
      </svg>
    `),

    firePitThumb: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        <rect width="256" height="256" rx="16" fill="#0c0608"/>
        <path d="M20 256 Q60 120 95 175 Q128 65 165 165 Q205 110 236 256 Z" fill="#dc2626" opacity="0.85"/>
        <path d="M45 256 Q85 145 115 190 Q140 100 175 185 Q205 140 220 256 Z" fill="#f97316" opacity="0.9"/>
        <path d="M75 256 Q110 175 130 205 Q155 145 185 256 Z" fill="#facc15"/>
        <circle cx="80" cy="95" r="4" fill="#fde047"/>
        <circle cx="145" cy="65" r="5" fill="#fb923c"/>
        <circle cx="190" cy="105" r="3.5" fill="#fde047"/>
      </svg>
    `)
  };

  // Image cache for loaded cutouts (both default SVG Data-URIs and user-uploaded URLs)
  const _cutoutImageCache = new Map();
  function getLoadedImage(src) {
    if (!src) return null;
    if (_cutoutImageCache.has(src)) {
      return _cutoutImageCache.get(src);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const rec = { img, loaded: false };
    img.onload = () => {
      rec.loaded = true;
      if (typeof window.tmmRequestRender === 'function') window.tmmRequestRender();
    };
    img.src = src;
    _cutoutImageCache.set(src, rec);
    return rec;
  }

  // Preload all default cutout SVGs immediately
  Object.values(DEFAULT_CUTOUT_URIS).forEach((uri) => getLoadedImage(uri));

  // ==========================================================================
  // 2. SCENE DEFINITIONS (5 PURE REVERSE-ENGINEERED SCENES, NO STITCHED VIDEO)
  // ==========================================================================
  const SCENES = [
    {
      id: 'scene1',
      index: 1,
      shortLabel: '1. Icon & VHS Glitch',
      title: 'Scene 1: Pop-Up Blue/White "T" Badges, Ghost-Dissolve & Film Burn',
      start: 0.0,
      end: 2.4
    },
    {
      id: 'scene2',
      index: 2,
      shortLabel: '2. Fire & 4 Polaroids',
      title: 'Scene 2: Rising Fire Pit, 4-Stage 2.5D Polaroid Cutouts & White Tear Glitch',
      start: 2.4,
      end: 6.4
    },
    {
      id: 'scene3',
      index: 3,
      shortLabel: '3. Google Pan & SERP',
      title: 'Scene 3: White Google Bar, Hand Click, 2.2x Camera Pan & 3D SERP Warp',
      start: 6.4,
      end: 10.4
    },
    {
      id: 'scene4',
      index: 4,
      shortLabel: '4. Apple/MS/Google Brush',
      title: 'Scene 4: Full-Screen 3D Triangle Mesh, Blurred Fragments & Company Lockups + Red Brush Swipe',
      start: 10.4,
      end: 14.0
    },
    {
      id: 'scene5',
      index: 5,
      shortLabel: '5. 3D Market Cap Table',
      title: 'Scene 5: 3D-Tilted Global Market Cap Leaderboard Scroll (Frame 410)',
      start: 14.0,
      end: 17.0
    }
  ];

  // ==========================================================================
  // 3. COMPLETE DEFAULT STATE & GRANULAR PARAMETERS FOR ALL 5 SCENES
  // ==========================================================================
  function createDefaultTencentMultimediaData() {
    return {
      // Master Playback & Scene Selection
      activeSceneFilter: 'all', // 'all' | 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5'
      selectedStageObject: 'company_apple',
      playbackSpeed: 1.0,
      cleanScreenHudHidden: false,

      // ----------------------------------------------------------------------
      // SCENE 1: POP-UP TENCENT "T" BADGES, UPWARD GHOST-DISSOLVE & FILM BURN
      // ----------------------------------------------------------------------
      badgeSymbol: 'T',
      badgeSubLabel: 'TENCENT',
      badgeCutoutUrl: '',
      badgeCount: 2,
      badgeScale: 1.05,
      badgePopBounce: 1.4,
      badgeStaggerDelay: 0.28,
      badgeRingColor: '#0ea5e9',
      badgeCoreColor: '#ffffff',
      badgeGhostDissolveStrength: 1.0,
      vhsWaveAmplitude: 32,
      vhsWaveFrequency: 3.4,
      filmBurnIntensity: 0.95,

      // ----------------------------------------------------------------------
      // SCENE 2: RISING FIRE PIT + 4-STAGE 2.5D POLAROID CUTOUTS + TEAR GLITCH
      // ----------------------------------------------------------------------
      polaroidBeatMode: 'all_4_beats',
      fireIntensity: 1.25,
      fireHeightRatio: 0.56,
      fireSpeed: 1.35,
      fireEmberCount: 52,
      firePalette: 'classic_amber',
      polaroidCaption: 'TENCENT 腾讯 // SHADOW EMPIRE',
      polaroidVisorText: 'T  T',
      polaroidBannerText: '中国智慧交通生态联盟 正式启动',
      polaroidBinaryText: '011001010011010110100101101010',
      polaroidPodiumCutoutUrl: '',
      polaroidGogglesCutoutUrl: '',
      polaroidBgCutoutUrl: '',
      polaroidSubjectCutoutUrl: '',
      polaroidHandsCutoutUrl: '',
      polaroidBinaryEyeCutoutUrl: '',
      polaroidFrameColor: '#f1f5f9',
      polaroidBorderWidth: 14,
      polaroidTiltDeg: -3.5,
      polaroidBgParallax: 0.42,
      polaroidMidParallax: 1.15,
      polaroidFgParallax: 1.85,
      polaroidMidScale: 1.0,
      polaroidMidOffsetX: 0,
      polaroidMidOffsetY: 0,

      // ----------------------------------------------------------------------
      // SCENE 3: DARK GOOGLE BAR, HAND CLICK, 2.2X CAMERA PAN & 3D SERP WARP
      // ----------------------------------------------------------------------
      googleLogoTitle: 'Google',
      googleLogoStyle: 'authentic_white',
      googleButton1Text: 'Google Search',
      googleButton2Text: "I'm Feeling Lucky",
      searchQueryText: "THE WORLD'S MOST VALUABLE COMPANIES",
      typingSpeedMultiplier: 1.25,
      cursorClickDepth: 1.0,
      googleCameraPunchZoom: 2.15,
      googleCameraPanStrength: 1.0,
      googleTheme: 'dark',
      subliminalFlashEnabled: true,
      subliminalCutoutUrl: '',
      subliminalOpacity: 0.78,
      paaHeaderTitle: 'People also ask',
      paaQ1: "What is world's most valuable company?",
      paaQ2: 'Which is the No 1 company in world?',
      paaQ3: 'What is the top 10 richest company in the world?',
      paaQ4: 'What are the 3 richest companies in the world?',
      serpResult1Source: 'https://businessplus.ie › news › most-valuable-companies',
      serpResult1Title: "The World's 20 Most Valuable Companies - Business Plus",
      serpResult1Snippet: 'Jun 12, 2022 — Apple is the most valuable company in the world with a market capitalization of $2.06 trillion...',
      serpResult2Source: 'https://www.visualcapitalist.com › biggest-public-comp...',
      serpResult2Title: 'Ranked: The 100 Biggest Public Companies in the World',
      serpResult2Snippet: 'Dec 26, 2022 — Berkshire Hathaway, $686B ; 7, Tesla, $522B ; 8, Tencent, $495B ; 9, TSMC, $442B...',
      serpResult3Source: 'https://www.investopedia.com › ... › Fundamental Analysis',
      serpResult3Title: 'Biggest Companies in the World by Market Cap',
      serpResult3Snippet: '1. Apple Inc. (AAPL) · 2. Saudi Aramco (2222.SR) · 3. Microsoft Corp. (MSFT) · 4. Alphabet Inc. (GOOG)...',
      serpResult4Source: 'https://www.statista.com › ... › Economy',
      serpResult4Title: 'Biggest companies in the world by market cap 2022',
      serpResult4Snippet: 'Apple led the ranking of the world’s largest companies by market capitalization in 2022...',
      serpHighlightColor: '#8ab4f8',
      serpTiltAngleDeg: 18,
      serpScrollSpeed: 1.25,
      vortexWarpStrength: 1.15,
      vortexTwistAngle: 3.4,

      // ----------------------------------------------------------------------
      // SCENE 4: FULL-SCREEN 3D TRIANGLE MESH, BLURRED FLOATING FRAGMENTS &
      //          UNIFIED (LOGO + TEXT) LOCKUPS WITH SEPARATE RED BRUSH SWIPES
      // ----------------------------------------------------------------------
      companyAnimStyle: 'brush_fragment_wipe', // 'brush_fragment_wipe' | 'elastic_pop' | 'parallax_drop' | 'flip_3d' | 'glitch_materialize'
      companyHoverAmplitude: 4,
      companyCutoutPopScale: 1.0,

      // Company 1 (Apple): Unified Logo + Text Lockup + Separate Red Brush Controls & Timing
      company1Name: 'Apple',
      company1CutoutUrl: '',
      company1Scale: 1.0,
      company1OffsetY: 0,
      company1TextScale: 1.0,
      company1TextGapPx: 14,
      company1TextColor: '#ffffff',
      company1StartTime: 0.04, // When Apple Logo + "Apple" Text wipe in together
      company1BrushDelay: 0.08, // Delay after Logo+Text before the red brush swipes in behind "Apple"
      company1BrushColor: '#d91b24',
      company1BrushStyle: 'authentic_tapered', // 'authentic_tapered' | 'dry_bristle' | 'rounded_pill' | 'hidden'
      company1BrushWidthScale: 1.0,
      company1BrushHeightScale: 1.0,

      // Company 2 (Microsoft): Unified Logo + Text Lockup + Separate Red Brush Controls & Timing
      company2Name: 'Microsoft',
      company2CutoutUrl: '',
      company2Scale: 1.0,
      company2OffsetY: 0,
      company2TextScale: 1.0,
      company2TextGapPx: 14,
      company2TextColor: '#ffffff',
      company2StartTime: 0.24, // When Microsoft Logo + "Microsoft" Text wipe in together (Frame 349)
      company2BrushDelay: 0.10, // Delay before red brush swipes in behind "Microsoft" (Frame 353-357)
      company2BrushColor: '#d91b24',
      company2BrushStyle: 'authentic_tapered',
      company2BrushWidthScale: 1.0,
      company2BrushHeightScale: 1.0,

      // Company 3 (Google): Unified Logo + Text Lockup + Separate Red Brush Controls & Timing
      company3Name: 'Google',
      company3CutoutUrl: '',
      company3Scale: 1.0,
      company3OffsetY: 0,
      company3TextScale: 1.0,
      company3TextGapPx: 14,
      company3TextColor: '#ffffff',
      company3StartTime: 0.44, // When Google Logo + "Google" Text wipe in together (Frame 365)
      company3BrushDelay: 0.10, // Delay before red brush swipes in behind "Google" (Frame 369+)
      company3BrushColor: '#d91b24',
      company3BrushStyle: 'authentic_tapered',
      company3BrushWidthScale: 1.0,
      company3BrushHeightScale: 1.0,

      // Shared Brush & Background Mesh Controls
      brushSwipeSpeed: 1.35,
      brushRoughness: 0.65,
      brushSplatterCount: 0, // Default 0 so there are NO ugly cartoon dots around the brush like image_fd5551af.png
      plexusNodeCount: 54,
      plexusFacetOpacity: 0.34,
      plexusForegroundShardStrength: 0.85, // 3D dark triangle shards passing across logos during reveal
      plexusRotationSpeed: 0.85,
      dollarBillCount: 11,
      dollarFallSpeed: 0.95,
      dollarBlurSoftness: 1.0,
      dollarBillCutoutUrl: '',

      // ----------------------------------------------------------------------
      // SCENE 5: 3D-TILTED GLOBAL MARKET CAP LEADERBOARD TABLE (FRAME 000410)
      // ----------------------------------------------------------------------
      tableHeaderTitle: 'GLOBAL MARKET CAP LEADERBOARD // VALUATION TRILLIONS',
      tableStyleMode: 'authentic_light',
      tableTiltPitchDeg: 18,
      tableTiltRollDeg: -6,
      tableScrollSpeed: 1.15,
      tableHighlightRow: 8,
      tableHighlightColor: '#0284c7',
      tableRow1Name: 'Apple',
      tableRow1Ticker: 'AAPL',
      tableRow1Cap: '$2.066 T',
      tableRow1Price: '$130.15',
      tableRow2Name: 'Saudi Aramco',
      tableRow2Ticker: '2222.SR',
      tableRow2Cap: '$1.883 T',
      tableRow2Price: '$8.52',
      tableRow3Name: 'Microsoft',
      tableRow3Ticker: 'MSFT',
      tableRow3Cap: '$1.777 T',
      tableRow3Price: '$238.51',
      tableRow4Name: 'Alphabet (Google)',
      tableRow4Ticker: 'GOOG',
      tableRow4Cap: '$1.185 T',
      tableRow4Price: '$91.91',
      tableRow5Name: 'Amazon',
      tableRow5Ticker: 'AMZN',
      tableRow5Cap: '$971.91 B',
      tableRow5Price: '$95.27',
      tableRow6Name: 'Berkshire Hathaway',
      tableRow6Ticker: 'BRK-B',
      tableRow6Cap: '$703.37 B',
      tableRow6Price: '$318.93',
      tableRow7Name: 'Visa',
      tableRow7Ticker: 'V',
      tableRow7Cap: '$473.54 B',
      tableRow7Price: '$223.62',
      tableRow8Name: 'Tencent (Shadow Giant)',
      tableRow8Ticker: '0700.HK',
      tableRow8Cap: '$466.27 B',
      tableRow8Price: '$113.22',

      // ----------------------------------------------------------------------
      // GLOBAL GRANULAR GLITCH & POST-FX MATRIX
      // ----------------------------------------------------------------------
      glitchMasterIntensity: 1.0,
      glitchSliceCount: 14,
      glitchSliceMaxShiftPx: 48,
      glitchWhiteTearBars: 6,
      glitchWhiteTearMaxHeightPx: 26,
      glitchRgbSplitPx: 11,
      glitchNoiseBandDensity: 0.85,
      crtScanlineOpacity: 0.12,
      vignetteStrength: 0.48
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
    const defs = createDefaultTencentMultimediaData();
    if (!window.customTemplateData) {
      window.customTemplateData = Object.assign({}, defs);
    } else {
      Object.keys(defs).forEach((k) => {
        if (window.customTemplateData[k] === undefined) {
          window.customTemplateData[k] = defs[k];
        }
      });
    }

    if (!_configHydrated) {
      _configHydrated = true;
      if (overrideData && typeof overrideData === 'object') {
        Object.keys(defs).forEach((k) => {
          if (k !== 'activeSceneFilter' && k !== 'cleanScreenHudHidden' && overrideData[k] !== undefined) {
            window.customTemplateData[k] = overrideData[k];
          }
        });
      }
      window.customTemplateData.activeSceneFilter = 'all';
      window.customTemplateData.cleanScreenHudHidden = false;
      syncContextualStoreSnapshot(window.customTemplateData);
    }

    if (overrideData && typeof overrideData === 'object' && overrideData !== window.customTemplateData) {
      overrideData.activeSceneFilter = window.customTemplateData.activeSceneFilter;
    }

    return window.customTemplateData;
  }

  function updateConfigKey(key, value) {
    const cfg = getConfig();
    cfg[key] = value;
    syncContextualStoreSnapshot(cfg);
    if (typeof window.tmmRequestRender === 'function') {
      window.tmmRequestRender();
    }
  }

  // ==========================================================================
  // 4. DETERMINISTIC MATH, EASING & PROCEDURAL HELPERS
  // ==========================================================================
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hash1D(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const p = clamp(x, 0, 1) - 1;
    return 1 + c3 * p * p * p + c1 * p * p;
  }

  function easeOutCubic(x) {
    const t = clamp(x, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutElastic(x, bounceScale = 1.0) {
    const t = clamp(x, 0, 1);
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return Math.max(0.02, Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * c4) * bounceScale + 1);
  }

  function easeInOutCubic(x) {
    const t = clamp(x, 0, 1);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  let _lastStageHitBoxes = [];

  let _fxScratchCanvas = null;
  let _fxScratchCtx = null;
  function getScratchBuffer(w, h) {
    if (!_fxScratchCanvas) {
      _fxScratchCanvas = document.createElement('canvas');
      _fxScratchCtx = _fxScratchCanvas.getContext('2d');
    }
    if (_fxScratchCanvas.width !== w || _fxScratchCanvas.height !== h) {
      _fxScratchCanvas.width = w;
      _fxScratchCanvas.height = h;
    }
    return { canvas: _fxScratchCanvas, ctx: _fxScratchCtx };
  }

  // ==========================================================================
  // 5. GRANULAR GLITCH & AUTHENTIC RED BRUSH SWIPE ENGINE
  // ==========================================================================
  function applyGranularSliceAndTearGlitch(ctx, w, h, timeSec, cfg, burstFactor, includeNoiseBand = false) {
    const master = clamp(Number(cfg.glitchMasterIntensity ?? 1.0), 0, 2.5) * burstFactor;
    if (master <= 0.02) return;

    const { canvas: srcCanvas, ctx: sCtx } = getScratchBuffer(w, h);
    sCtx.clearRect(0, 0, w, h);
    sCtx.drawImage(ctx.canvas, 0, 0);

    const sliceCount = clamp(Math.round(Number(cfg.glitchSliceCount ?? 14) * Math.min(1.5, master)), 2, 36);
    const maxShift = Number(cfg.glitchSliceMaxShiftPx ?? 48) * master;
    const rgbSplit = Number(cfg.glitchRgbSplitPx ?? 11) * master;
    const whiteBarCount = clamp(Math.round(Number(cfg.glitchWhiteTearBars ?? 6) * master), 0, 20);
    const whiteBarMaxH = Number(cfg.glitchWhiteTearMaxHeightPx ?? 26) * master;
    const seedTick = Math.floor(timeSec * 24);

    for (let i = 0; i < sliceCount; i++) {
      const r1 = hash1D(seedTick * 17.3 + i * 11.7);
      const r2 = hash1D(seedTick * 29.1 + i * 5.3);
      const r3 = hash1D(seedTick * 43.9 + i * 19.1);
      if (r1 < 0.35) continue;

      const sy = Math.floor(r2 * (h - 24));
      const sh = Math.floor(8 + r3 * (h * 0.12));
      const shiftX = (hash1D(seedTick * 7.7 + i * 31.3) - 0.5) * 2 * maxShift;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, w, sh);
      ctx.clip();
      ctx.drawImage(srcCanvas, shiftX, 0);

      if (rgbSplit > 1) {
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = clamp(0.35 * master, 0, 0.75);
        ctx.drawImage(srcCanvas, shiftX + rgbSplit, 0);
        ctx.drawImage(srcCanvas, shiftX - rgbSplit, 0);
      }
      ctx.restore();
    }

    for (let b = 0; b < whiteBarCount; b++) {
      const rb = hash1D(seedTick * 53.1 + b * 23.7);
      if (rb < 0.42) continue;
      const by = Math.floor(hash1D(seedTick * 19.9 + b * 41.1) * h);
      const bh = Math.max(3, Math.floor(hash1D(seedTick * 61.3 + b * 13.3) * whiteBarMaxH));
      const bw = w * (0.45 + 0.55 * hash1D(seedTick * 37.7 + b * 7.1));
      const bx = (w - bw) * hash1D(seedTick * 83.1 + b * 3.9);

      ctx.save();
      ctx.fillStyle = rb > 0.72 ? '#ffffff' : 'rgba(226, 232, 240, 0.92)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(bx, by, bw, 2);
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(bx, by + bh - 2, bw, 2);
      ctx.restore();
    }

    const noiseDensity = clamp(Number(cfg.glitchNoiseBandDensity ?? 0.85), 0, 1.5);
    if (includeNoiseBand && noiseDensity > 0.05) {
      const bands = [
        { y: h * 0.14, h: h * 0.16 },
        { y: h * 0.68, h: h * 0.14 }
      ];
      ctx.save();
      bands.forEach((band, bi) => {
        const cellW = 14;
        const cellH = 8;
        const cols = Math.ceil(w / cellW);
        const rows = Math.ceil(band.h / cellH);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const n = hash1D(seedTick * 13.7 + bi * 101 + r * 37.1 + c * 11.3);
            if (n > 1.0 - 0.42 * noiseDensity * master) {
              const lum = n > 0.88 ? 255 : n > 0.75 ? 190 : 35;
              ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
              ctx.fillRect(c * cellW, band.y + r * cellH, cellW + 2, cellH - 1);
            }
          }
        }
      });
      ctx.restore();
    }
  }

  function applyVhsSineWaveGlitch(ctx, w, h, timeSec, cfg, envelope) {
    const amp = Number(cfg.vhsWaveAmplitude ?? 32) * envelope * clamp(Number(cfg.glitchMasterIntensity ?? 1.0), 0, 2.5);
    if (amp <= 0.5) return;

    const freq = Number(cfg.vhsWaveFrequency ?? 3.4);
    const { canvas: srcCanvas, ctx: sCtx } = getScratchBuffer(w, h);
    sCtx.clearRect(0, 0, w, h);
    sCtx.drawImage(ctx.canvas, 0, 0);

    ctx.clearRect(0, 0, w, h);
    const stripH = 6;
    for (let y = 0; y < h; y += stripH) {
      const yn = y / h;
      const wave = Math.sin(yn * Math.PI * 2 * freq + timeSec * 18) * amp
        + Math.cos(yn * Math.PI * 7 - timeSec * 29) * (amp * 0.35);
      ctx.drawImage(srcCanvas, 0, y, w, stripH, wave, y, w, stripH);
    }
  }

  /**
   * Draws the authentic red paint brush stroke ("the red little thing") behind
   * "Apple", "Microsoft", and "Google" matching `image_fd5551af.png`:
   * - Smooth rounded left brush head
   * - Slightly organic wavy top/bottom edges hugging the white text
   * - Softly tapered right-side brush bristles (no ugly cartoon dots floating around!)
   * - Progressive left-to-right swipe animation (`progress` 0..1)
   */
  function drawAuthenticRedBrushSwipe(ctx, cx, cy, targetW, targetH, color, progress, styleMode, roughness, splatterCount, seedBase) {
    if (styleMode === 'hidden') return;
    const p = clamp(progress, 0, 1);
    if (p <= 0.01) return;

    const swipeEase = easeOutCubic(p);
    const fullW = targetW;
    const h = targetH;
    const leftX = cx - fullW / 2;
    const topY = cy - h / 2;
    const currentRightX = leftX + fullW * swipeEase;

    ctx.save();

    // Clip horizontally from leftX to currentRightX + bristle tip allowance during swipe
    ctx.beginPath();
    ctx.rect(leftX - 20, topY - 25, (fullW + 50) * swipeEase, h + 50);
    ctx.clip();

    ctx.fillStyle = color || '#d91b24';

    if (styleMode === 'rounded_pill') {
      drawRoundedRect(ctx, leftX, topY, fullW, h, h * 0.48);
      ctx.fill();
    } else if (styleMode === 'dry_bristle') {
      // Dry acrylic streak with stronger bristle teeth
      ctx.beginPath();
      const rCap = h * 0.46;
      ctx.moveTo(leftX + rCap, topY);
      ctx.lineTo(leftX + fullW - 12, topY + 2);
      const teeth = 9;
      for (let i = 0; i <= teeth; i++) {
        const ty = topY + (i / teeth) * h;
        const jag = (hash1D(seedBase + i * 7.3) - 0.35) * 28 * roughness;
        ctx.lineTo(leftX + fullW + jag, ty);
      }
      ctx.lineTo(leftX + rCap, topY + h);
      ctx.arc(leftX + rCap, cy, h / 2, Math.PI * 0.5, Math.PI * 1.5, false);
      ctx.closePath();
      ctx.fill();
    } else {
      // DEFAULT: 'authentic_tapered' — Matches `image_fd5551af.png` 1:1!
      // Smooth rounded left cap, organic slightly arched top/bottom, and 3 tapered brush-tip fingers on the right
      const rCap = h * 0.48;
      const rightBodyX = leftX + fullW - h * 0.32;

      ctx.beginPath();
      // Left rounded brush head
      ctx.arc(leftX + rCap, cy + 1, h * 0.48, Math.PI * 0.52, Math.PI * 1.48, false);
      // Top organic curve
      ctx.bezierCurveTo(
        leftX + fullW * 0.35, topY - 3,
        leftX + fullW * 0.72, topY - 1,
        rightBodyX, topY + 3
      );
      // Tapered right-hand brush bristles (exact silhouette from image_fd5551af.png)
      ctx.lineTo(leftX + fullW + 4, topY + h * 0.20);
      ctx.lineTo(rightBodyX - 4, topY + h * 0.32);
      ctx.lineTo(leftX + fullW + 10, topY + h * 0.52);
      ctx.lineTo(rightBodyX - 2, topY + h * 0.66);
      ctx.lineTo(leftX + fullW + 14, topY + h * 0.80);
      ctx.lineTo(rightBodyX - 6, topY + h - 2);
      // Bottom organic curve back to left cap
      ctx.bezierCurveTo(
        leftX + fullW * 0.68, topY + h + 2,
        leftX + fullW * 0.32, topY + h + 1,
        leftX + rCap, topY + h * 0.98
      );
      ctx.closePath();
      ctx.fill();

      // Subtle darker red inner brush texture along bottom edge (like image_fd5551af.png)
      ctx.fillStyle = 'rgba(120, 10, 15, 0.28)';
      ctx.beginPath();
      ctx.ellipse(cx, topY + h * 0.82, fullW * 0.42, h * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tiny authentic bristle-tip speck right at the trailing right edge (like the tiny dot on the right of Apple/Microsoft brush in image_fd5551af.png)
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(leftX + fullW + 4, topY + h * 0.28, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Optional splatter droplets ONLY if user explicitly increases brushSplatterCount > 0
    const count = clamp(Math.round(Number(splatterCount || 0) * p), 0, 30);
    if (count > 0) {
      ctx.fillStyle = color || '#d91b24';
      for (let d = 0; d < count; d++) {
        const rx = leftX + hash1D(seedBase + d * 41.3) * (fullW + 16) - 8;
        const ry = cy + (hash1D(seedBase + d * 73.9) - 0.5) * (h * 1.35);
        const rad = 1.2 + hash1D(seedBase + d * 17.1) * 2.6 * roughness;
        ctx.beginPath();
        ctx.arc(rx, ry, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ==========================================================================
  // 6. SCENE 1 RENDERER: POP-UP BLUE/WHITE "T" BADGES, GHOST-DISSOLVE & FILM BURN
  // ==========================================================================
  function renderScene1(ctx, w, h, localP, timeSec, cfg) {
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.5, w * 0.72);
    bgGrad.addColorStop(0, '#0c1629');
    bgGrad.addColorStop(0.55, '#060a14');
    bgGrad.addColorStop(1, '#020409');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    for (let i = 0; i < 16; i++) {
      const bx = ((hash1D(i * 19.7) * w) + Math.sin(timeSec * 0.6 + i) * 30 + w) % w;
      const by = ((hash1D(i * 43.1) * h) + Math.cos(timeSec * 0.5 + i) * 20 + h) % h;
      const br = 24 + hash1D(i * 7.3) * 68;
      const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bGrad.addColorStop(0, i % 3 === 0 ? 'rgba(14, 165, 233, 0.14)' : 'rgba(59, 130, 246, 0.08)');
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const count = clamp(Math.round(Number(cfg.badgeCount ?? 2)), 1, 4);
    const stagger = clamp(Number(cfg.badgeStaggerDelay ?? 0.28), 0.05, 0.5);
    const bounce = clamp(Number(cfg.badgePopBounce ?? 1.4), 0.6, 2.5);
    const baseScale = clamp(Number(cfg.badgeScale ?? 1.05), 0.4, 2.2);
    const ghostStr = clamp(Number(cfg.badgeGhostDissolveStrength ?? 1.0), 0, 2.0);
    const cutoutSrc = cfg.badgeCutoutUrl || DEFAULT_CUTOUT_URIS.tBadge;
    const badgeImgRec = getLoadedImage(cutoutSrc);

    const badgePositions = [];
    if (count === 1) {
      badgePositions.push({ x: w * 0.5, y: h * 0.48 });
    } else if (count === 2) {
      badgePositions.push({ x: w * 0.34, y: h * 0.47 });
      badgePositions.push({ x: w * 0.66, y: h * 0.47 });
    } else if (count === 3) {
      badgePositions.push({ x: w * 0.25, y: h * 0.48 });
      badgePositions.push({ x: w * 0.50, y: h * 0.46 });
      badgePositions.push({ x: w * 0.75, y: h * 0.48 });
    } else {
      badgePositions.push({ x: w * 0.20, y: h * 0.48 });
      badgePositions.push({ x: w * 0.40, y: h * 0.46 });
      badgePositions.push({ x: w * 0.60, y: h * 0.48 });
      badgePositions.push({ x: w * 0.80, y: h * 0.46 });
    }

    const dissolveProgress = clamp((localP - 0.76) / 0.18, 0, 1);

    badgePositions.forEach((pos, idx) => {
      const startP = 0.08 + idx * stagger;
      const rawP = (localP - startP) / 0.24;
      if (rawP <= 0) return;

      const popScale = Math.max(0.04, easeOutElastic(clamp(rawP, 0, 1), bounce) * baseScale);
      const hoverY = Math.sin(timeSec * 3.8 + idx * 1.7) * 7;
      const size = Math.max(4, Math.min(w, h) * 0.25 * popScale);

      const upwardDriftY = -dissolveProgress * h * 0.26 * ghostStr;
      const mainAlpha = clamp(1.0 - dissolveProgress * 0.85, 0.08, 1.0);
      const bx = pos.x;
      const by = pos.y + hoverY + upwardDriftY;

      ctx.save();

      if (dissolveProgress > 0.02 && ghostStr > 0.05) {
        for (let g = 1; g <= 3; g++) {
          const gy = by - g * 34 * dissolveProgress * ghostStr;
          const gx = bx + Math.sin(g * 2.1 + timeSec * 14) * 10 * dissolveProgress;
          ctx.save();
          ctx.globalAlpha = clamp((0.42 / g) * (1 - dissolveProgress * 0.5) * ghostStr, 0, 0.45);
          if (badgeImgRec && badgeImgRec.loaded) {
            ctx.drawImage(badgeImgRec.img, gx - size / 2, gy - size / 2, size, size);
          }
          ctx.restore();
        }
      }

      ctx.translate(bx, by);
      ctx.globalAlpha = mainAlpha;

      const rInner = Math.max(0.5, size * 0.22);
      const rOuter = Math.max(rInner + 1, size * 0.72);
      const auraGrad = ctx.createRadialGradient(0, 0, rInner, 0, 0, rOuter);
      auraGrad.addColorStop(0, (cfg.badgeRingColor || '#0ea5e9') + '66');
      auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
      ctx.fill();

      const useCustomSymbol = cfg.badgeSymbol && cfg.badgeSymbol !== 'T';
      if (!useCustomSymbol && badgeImgRec && badgeImgRec.loaded) {
        ctx.drawImage(badgeImgRec.img, -size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = cfg.badgeCoreColor || '#ffffff';
        ctx.strokeStyle = cfg.badgeRingColor || '#0ea5e9';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1, size * 0.42), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0066cc';
        ctx.font = `italic 900 ${Math.round(size * 0.44)}px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cfg.badgeSymbol || 'T', 0, 4);
      }

      if (cfg.badgeSubLabel) {
        ctx.font = `800 ${Math.max(11, Math.round(size * 0.085))}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(cfg.badgeSubLabel, 0, size * 0.52);
      }

      ctx.restore();

      _lastStageHitBoxes.push({
        id: 'scene1_badge',
        label: `Tencent "${cfg.badgeSymbol || 'T'}" Badge #${idx + 1}`,
        scene: 'scene1',
        x: bx - size * 0.5,
        y: by - size * 0.5,
        w: size,
        h: size
      });
    });

    const glitchWindow = localP > 0.68 ? clamp((localP - 0.68) / 0.28, 0, 1) : 0;
    const microTwitch = (localP > 0.28 && localP < 0.36) ? 0.32 : 0;
    const totalGlitchEnv = Math.max(glitchWindow, microTwitch);

    if (totalGlitchEnv > 0.02) {
      applyVhsSineWaveGlitch(ctx, w, h, timeSec, cfg, totalGlitchEnv);
      applyGranularSliceAndTearGlitch(ctx, w, h, timeSec, cfg, totalGlitchEnv * 0.85, false);
    }

    if (localP > 0.84) {
      const burnP = (localP - 0.84) / 0.16;
      const burnAlpha = clamp(burnP * Number(cfg.filmBurnIntensity ?? 0.95), 0, 1);
      ctx.save();
      const burnGrad = ctx.createRadialGradient(w * 0.88, h * 0.5, 10, w * 0.72, h * 0.5, w * 0.85);
      burnGrad.addColorStop(0, `rgba(255, 255, 240, ${burnAlpha.toFixed(3)})`);
      burnGrad.addColorStop(0.28, `rgba(250, 204, 21, ${(burnAlpha * 0.92).toFixed(3)})`);
      burnGrad.addColorStop(0.62, `rgba(239, 68, 68, ${(burnAlpha * 0.78).toFixed(3)})`);
      burnGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = burnGrad;
      ctx.fillRect(0, 0, w, h);

      if (localP > 0.94) {
        const whiteFlash = clamp((localP - 0.94) / 0.06, 0, 1) * Number(cfg.filmBurnIntensity ?? 0.95);
        ctx.fillStyle = `rgba(255, 255, 255, ${(whiteFlash * 0.92).toFixed(3)})`;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }
  }

  // ==========================================================================
  // 7. SCENE 2 RENDERER: RISING FIRE PIT + 4-STAGE 2.5D POLAROID CUTOUTS + TEAR GLITCH
  // ==========================================================================
  function getFirePaletteColors(palette) {
    if (palette === 'crimson_hellfire') {
      return { base: '#7f1d1d', mid: '#dc2626', tip: '#f87171', spark: '#fecaca' };
    }
    if (palette === 'cyber_cyan') {
      return { base: '#0c4a6e', mid: '#0284c7', tip: '#38bdf8', spark: '#e0f2fe' };
    }
    if (palette === 'emerald_wildfire') {
      return { base: '#064e3b', mid: '#10b981', tip: '#6ee7b7', spark: '#ecfdf5' };
    }
    return { base: '#991b1b', mid: '#ea580c', tip: '#facc15', spark: '#fef08a' };
  }

  function renderProceduralFireLayer(ctx, w, h, timeSec, cfg, isForegroundTongues) {
    const intensity = clamp(Number(cfg.fireIntensity ?? 1.25), 0, 2.5);
    if (intensity <= 0.02) return;

    const fireH = h * clamp(Number(cfg.fireHeightRatio ?? 0.56), 0.15, 0.85) * (isForegroundTongues ? 0.54 : 1.0);
    const speed = clamp(Number(cfg.fireSpeed ?? 1.35), 0.2, 3.5);
    const pal = getFirePaletteColors(cfg.firePalette);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    if (!isForegroundTongues) {
      const heatGrad = ctx.createLinearGradient(0, h, 0, h - fireH * 1.25);
      heatGrad.addColorStop(0, pal.mid);
      heatGrad.addColorStop(0.55, pal.base + '99');
      heatGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = heatGrad;
      ctx.fillRect(0, h - fireH * 1.25, w, fireH * 1.25);
    }

    const layers = isForegroundTongues
      ? [{ color: pal.tip, scaleH: 0.72, freq: 5.5, alpha: 0.68 }]
      : [
          { color: pal.base, scaleH: 1.0, freq: 3.0, alpha: 0.88 },
          { color: pal.mid, scaleH: 0.78, freq: 4.4, alpha: 0.84 },
          { color: pal.tip, scaleH: 0.52, freq: 6.2, alpha: 0.78 }
        ];

    layers.forEach((layer, li) => {
      ctx.fillStyle = layer.color;
      ctx.globalAlpha = clamp(layer.alpha * intensity, 0, 1);
      ctx.beginPath();
      ctx.moveTo(0, h);
      const steps = 36;
      for (let i = 0; i <= steps; i++) {
        const xn = i / steps;
        const x = xn * w;
        const n1 = Math.sin(xn * Math.PI * layer.freq + timeSec * 7.5 * speed + li * 1.9);
        const n2 = Math.cos(xn * Math.PI * (layer.freq * 2.1) - timeSec * 11.2 * speed + li);
        const n3 = Math.sin(xn * Math.PI * 11 + timeSec * 15 * speed) * 0.3;
        const flameWave = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15 + 1) * 0.5;
        const centerBoost = 0.65 + 0.55 * Math.sin(xn * Math.PI);
        const y = h - fireH * layer.scaleH * (0.32 + 0.68 * flameWave) * centerBoost;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    });

    if (!isForegroundTongues) {
      const emberCount = clamp(Math.round(Number(cfg.fireEmberCount ?? 52) * intensity), 0, 140);
      ctx.fillStyle = pal.spark;
      for (let e = 0; e < emberCount; e++) {
        const cycle = ((timeSec * 0.52 * speed + hash1D(e * 13.7)) % 1);
        const ex = (hash1D(e * 31.1) * w + Math.sin(timeSec * 3 + e) * 38 + w) % w;
        const ey = h - cycle * (fireH * 1.45);
        const er = (1 - cycle * 0.7) * (2.0 + hash1D(e * 7.9) * 3.8);
        ctx.globalAlpha = clamp((1 - cycle) * 0.92, 0, 1);
        ctx.beginPath();
        ctx.arc(ex, ey, er, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function resolveActivePolaroidBeat(localP, cfg) {
    const mode = cfg.polaroidBeatMode || 'all_4_beats';
    if (mode === 'beat_2a_podium') return { beatIndex: 0, beatP: localP };
    if (mode === 'beat_2b_goggles') return { beatIndex: 1, beatP: localP };
    if (mode === 'beat_2c_puppeteer') return { beatIndex: 2, beatP: localP };
    if (mode === 'beat_2d_binary_eye') return { beatIndex: 3, beatP: localP };

    if (localP < 0.23) {
      return { beatIndex: 0, beatP: clamp(localP / 0.23, 0, 1) };
    } else if (localP < 0.48) {
      return { beatIndex: 1, beatP: clamp((localP - 0.23) / 0.25, 0, 1) };
    } else if (localP < 0.74) {
      return { beatIndex: 2, beatP: clamp((localP - 0.48) / 0.26, 0, 1) };
    } else {
      return { beatIndex: 3, beatP: clamp((localP - 0.74) / 0.26, 0, 1) };
    }
  }

  function renderScene2(ctx, w, h, localP, timeSec, cfg) {
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.65, 30, w * 0.5, h * 0.5, w * 0.8);
    bgGrad.addColorStop(0, '#260b07');
    bgGrad.addColorStop(0.55, '#0d0608');
    bgGrad.addColorStop(1, '#040305');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    renderProceduralFireLayer(ctx, w, h, timeSec, cfg, false);

    const fireH = h * clamp(Number(cfg.fireHeightRatio ?? 0.56), 0.15, 0.85);
    _lastStageHitBoxes.push({
      id: 'fire_pit',
      label: 'Rising Procedural Fire Pit & Embers',
      scene: 'scene2',
      x: 0,
      y: h - fireH,
      w: w,
      h: fireH
    });

    const { beatIndex, beatP } = resolveActivePolaroidBeat(localP, cfg);
    const entryEase = easeOutBack(clamp(beatP / 0.28, 0, 1));
    const camX = Math.sin(timeSec * 2.2 + beatIndex) * 16;
    const camY = (1 - entryEase) * 42 + Math.cos(timeSec * 1.8) * 8;

    const bgPar = Number(cfg.polaroidBgParallax ?? 0.42);
    const midPar = Number(cfg.polaroidMidParallax ?? 1.15);
    const fgPar = Number(cfg.polaroidFgParallax ?? 1.85);

    const isVerticalPolaroid = beatIndex === 2;
    const frameW = isVerticalPolaroid ? Math.min(w * 0.31, 390) : Math.min(w * 0.46, 560);
    const frameH = isVerticalPolaroid ? Math.min(h * 0.68, 490) : Math.min(h * 0.54, 390);
    const borderW = clamp(Number(cfg.polaroidBorderWidth ?? 14), 6, 36);
    const bottomBorderH = borderW * 2.4;
    const baseTiltDeg = Number(cfg.polaroidTiltDeg ?? -3.5) + (beatIndex % 2 === 0 ? -1.5 : 2.0);
    const tiltRad = (baseTiltDeg + Math.sin(timeSec * 1.5) * 1.1) * (Math.PI / 180);

    const centerX = w * 0.5 + camX * 0.45;
    const centerY = h * 0.46 + camY * 0.35;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(tiltRad);
    ctx.scale(0.92 + 0.08 * entryEase, 0.92 + 0.08 * entryEase);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = cfg.polaroidFrameColor || '#f1f5f9';
    drawRoundedRect(ctx, -frameW / 2, -frameH / 2, frameW, frameH, 4);
    ctx.fill();
    ctx.restore();

    const innerX = -frameW / 2 + borderW;
    const innerY = -frameH / 2 + borderW;
    const innerW = frameW - borderW * 2;
    const innerH = frameH - borderW - bottomBorderH;

    if (beatIndex === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerW, innerH);
      ctx.clip();

      ctx.fillStyle = '#090d16';
      ctx.fillRect(innerX, innerY, innerW, innerH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `700 ${Math.round(innerH * 0.065)}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        cfg.polaroidBannerText || '中国智慧交通生态联盟 正式启动',
        -camX * bgPar,
        innerY + innerH * 0.22 - camY * bgPar
      );

      const podiumRec = getLoadedImage(cfg.polaroidPodiumCutoutUrl || DEFAULT_CUTOUT_URIS.polaroidPodium);
      const midScale = clamp(Number(cfg.polaroidMidScale ?? 1.0), 0.5, 1.8);
      if (podiumRec && podiumRec.loaded) {
        const pw = innerW * 0.95 * midScale;
        const ph = innerH * 0.88 * midScale;
        ctx.drawImage(
          podiumRec.img,
          -pw / 2 - camX * midPar + Number(cfg.polaroidMidOffsetX || 0),
          innerY + innerH - ph - camY * midPar * 0.4 + Number(cfg.polaroidMidOffsetY || 0),
          pw,
          ph
        );
      }
      ctx.restore();
    } else if (beatIndex === 1) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerW, innerH);
      ctx.clip();

      const bgRec = getLoadedImage(cfg.polaroidBgCutoutUrl || DEFAULT_CUTOUT_URIS.polaroidBg);
      if (bgRec && bgRec.loaded) {
        ctx.drawImage(
          bgRec.img,
          innerX - 24 - camX * bgPar,
          innerY - 18 - camY * bgPar,
          innerW + 48,
          innerH + 36
        );
      }
      ctx.restore();

      const gogglesRec = getLoadedImage(cfg.polaroidGogglesCutoutUrl || DEFAULT_CUTOUT_URIS.polaroidGogglesWoman);
      const midScale = clamp(Number(cfg.polaroidMidScale ?? 1.0), 0.5, 1.8);
      const subW = innerW * 0.78 * midScale;
      const subH = innerH * 1.06 * midScale;
      const subX = -subW / 2 - camX * midPar + Number(cfg.polaroidMidOffsetX || 0);
      const subY = innerY + innerH - subH + 12 - camY * midPar * 0.45 + Number(cfg.polaroidMidOffsetY || 0);

      if (gogglesRec && gogglesRec.loaded) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.75)';
        ctx.shadowBlur = 18;
        ctx.drawImage(gogglesRec.img, subX, subY, subW, subH);
        ctx.restore();
      }

      if (cfg.polaroidVisorText && cfg.polaroidVisorText !== 'T  T') {
        ctx.save();
        ctx.font = `italic 900 ${Math.round(subH * 0.09)}px 'Inter', sans-serif`;
        ctx.fillStyle = '#090a0f';
        ctx.textAlign = 'center';
        ctx.fillText(cfg.polaroidVisorText, subX + subW * 0.5, subY + subH * 0.40);
        ctx.restore();
      }
    } else if (beatIndex === 2) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerW, innerH);
      ctx.clip();

      const crimGrad = ctx.createRadialGradient(0, innerY + innerH * 0.35, 10, 0, innerY + innerH * 0.5, innerW * 0.85);
      crimGrad.addColorStop(0, '#991b1b');
      crimGrad.addColorStop(0.65, '#450a0a');
      crimGrad.addColorStop(1, '#1a0404');
      ctx.fillStyle = crimGrad;
      ctx.fillRect(innerX, innerY, innerW, innerH);

      const subRec = getLoadedImage(cfg.polaroidSubjectCutoutUrl || DEFAULT_CUTOUT_URIS.polaroidSubject);
      const midScale = clamp(Number(cfg.polaroidMidScale ?? 1.0), 0.5, 1.8);
      if (subRec && subRec.loaded) {
        const sw = innerW * 0.92 * midScale;
        const sh = innerH * 0.94 * midScale;
        ctx.drawImage(
          subRec.img,
          -sw / 2 - camX * midPar + Number(cfg.polaroidMidOffsetX || 0),
          innerY + innerH - sh - camY * midPar * 0.4 + Number(cfg.polaroidMidOffsetY || 0),
          sw,
          sh
        );
      }
      ctx.restore();

      const handsRec = getLoadedImage(cfg.polaroidHandsCutoutUrl || DEFAULT_CUTOUT_URIS.polaroidHands);
      if (handsRec && handsRec.loaded) {
        const hw = frameW * 1.15;
        const hh = frameH * 1.05;
        const hx = -hw / 2 - camX * fgPar;
        const hy = -frameH * 0.52 - camY * fgPar * 0.4 + Math.sin(timeSec * 4.5) * 6;
        ctx.save();
        ctx.drawImage(handsRec.img, hx, hy, hw, hh);
        ctx.restore();
      }
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerW, innerH);
      ctx.clip();

      const eyeRec = getLoadedImage(cfg.polaroidBinaryEyeCutoutUrl || DEFAULT_CUTOUT_URIS.polaroidBinaryEye);
      const midScale = clamp(Number(cfg.polaroidMidScale ?? 1.0), 0.5, 1.8);
      if (eyeRec && eyeRec.loaded) {
        const ew = innerW * 1.04 * midScale;
        const eh = innerH * 1.04 * midScale;
        ctx.drawImage(
          eyeRec.img,
          -ew / 2 - camX * midPar * 0.5 + Number(cfg.polaroidMidOffsetX || 0),
          innerY + (innerH - eh) / 2 - camY * midPar * 0.3 + Number(cfg.polaroidMidOffsetY || 0),
          ew,
          eh
        );
      }
      ctx.restore();
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = `800 13px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(cfg.polaroidCaption || 'TENCENT 腾讯 // SHADOW EMPIRE', 0, frameH / 2 - bottomBorderH * 0.36);

    ctx.restore();

    _lastStageHitBoxes.push({
      id: 'polaroid_subject',
      label: `2.5D Polaroid Cutout (Beat 2${['A', 'B', 'C', 'D'][beatIndex]})`,
      scene: 'scene2',
      x: centerX - frameW * 0.5,
      y: centerY - frameH * 0.5,
      w: frameW,
      h: frameH
    });

    renderProceduralFireLayer(ctx, w, h, timeSec + 1.7, cfg, true);

    const beatBoundaryGlitch = (beatP > 0.88 && cfg.polaroidBeatMode === 'all_4_beats') ? 0.55 : 0;
    const endSceneTear = localP > 0.80 ? clamp((localP - 0.80) / 0.20, 0, 1) * 1.35 : 0;
    const glitchBurst = Math.max(beatBoundaryGlitch, endSceneTear);
    if (glitchBurst > 0.05) {
      applyGranularSliceAndTearGlitch(ctx, w, h, timeSec, cfg, glitchBurst, false);
    }
  }

  // ==========================================================================
  // 8. SCENE 3 RENDERER: WHITE GOOGLE BAR, HAND CLICK, 2.2X CAMERA PAN,
  //    "PEOPLE ALSO ASK" ACCORDION + 4 SERP CARDS & ZOOM-THROUGH TUNNEL WARP
  // ==========================================================================
  function drawGoogleWordmark(ctx, text, x, y, fontSize, styleMode) {
    ctx.save();
    ctx.font = `700 ${fontSize}px 'Inter', -apple-system, sans-serif`;
    ctx.textBaseline = 'alphabetic';
    if (styleMode !== 'multicolor') {
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(text || 'Google', x, y);
      ctx.restore();
      return;
    }
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
    const chars = (text || 'Google').split('');
    let totalW = 0;
    const widths = chars.map((ch) => {
      const cw = ctx.measureText(ch).width;
      totalW += cw;
      return cw;
    });
    let curX = x - totalW / 2;
    chars.forEach((ch, i) => {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillText(ch, curX, y);
      curX += widths[i];
    });
    ctx.restore();
  }

  function drawPointingHandCursor(ctx, x, y, isClicking) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(isClicking ? 0.88 : 1.0, isClicking ? 0.88 : 1.0);
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 20);
    ctx.lineTo(-6, 15);
    ctx.lineTo(-10, 19);
    ctx.lineTo(-2, 31);
    ctx.lineTo(14, 31);
    ctx.lineTo(17, 17);
    ctx.lineTo(17, 10);
    ctx.lineTo(4, 10);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function renderScene3(ctx, w, h, localP, timeSec, cfg) {
    const theme = cfg.googleTheme || 'dark';
    const bgHex = theme === 'light' ? '#ffffff' : theme === 'oled' ? '#07080d' : '#171717';
    const cardBgHex = theme === 'light' ? '#f8fafc' : '#202124';
    const textPrimary = theme === 'light' ? '#1e293b' : '#e8eaed';
    const textSecondary = theme === 'light' ? '#475569' : '#9aa0a6';
    const borderHex = theme === 'light' ? '#cbd5e1' : '#5f6368';

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, w, h);

    const query = String(cfg.searchQueryText || "THE WORLD'S MOST VALUABLE COMPANIES");
    const typeSpeed = clamp(Number(cfg.typingSpeedMultiplier ?? 1.25), 0.4, 3.0);

    const isSubliminalWindow = cfg.subliminalFlashEnabled !== false && localP > 0.21 && localP < 0.235;
    if (isSubliminalWindow) {
      ctx.save();
      ctx.fillStyle = '#05060a';
      ctx.fillRect(0, 0, w, h);
      const subRec = getLoadedImage(cfg.subliminalCutoutUrl || DEFAULT_CUTOUT_URIS.subliminalCutout);
      ctx.globalAlpha = clamp(Number(cfg.subliminalOpacity ?? 0.78), 0.1, 1.0);
      if (subRec && subRec.loaded) {
        const sz = Math.min(w, h) * 0.62;
        ctx.drawImage(subRec.img, w / 2 - sz / 2, h / 2 - sz / 2, sz, sz);
      }
      ctx.restore();
      applyGranularSliceAndTearGlitch(ctx, w, h, timeSec, cfg, 0.9, false);
      return;
    }

    if (localP < 0.48) {
      const phaseP = localP / 0.48;
      const typingProgress = clamp(((phaseP - 0.28) / 0.64) * typeSpeed, 0, 1);
      const charCount = Math.floor(typingProgress * query.length);
      const visibleText = query.slice(0, charCount);

      const punchTarget = clamp(Number(cfg.googleCameraPunchZoom ?? 2.15), 1.0, 3.0);
      const panStr = clamp(Number(cfg.googleCameraPanStrength ?? 1.0), 0.0, 2.0);
      const punchInT = easeInOutCubic(clamp((phaseP - 0.24) / 0.16, 0, 1));
      const camZoom = lerp(1.0, punchTarget, punchInT);

      const barW = Math.min(w * 0.60, 740);
      const barH = 56;
      const barX = (w - barW) / 2;
      const barY = h * 0.46;

      ctx.save();
      ctx.font = `700 21px 'Inter', sans-serif`;
      const typedWidthPx = ctx.measureText(visibleText).width;
      ctx.restore();

      const caretWorldX = barX + 52 + Math.min(typedWidthPx, barW - 110);
      const targetFocusX = lerp(w * 0.5, caretWorldX, punchInT * panStr);
      const targetFocusY = lerp(h * 0.48, barY - 10, punchInT);

      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-targetFocusX, -targetFocusY);

      drawGoogleWordmark(
        ctx,
        cfg.googleLogoTitle || 'Google',
        w * 0.5,
        barY - 46,
        88,
        cfg.googleLogoStyle || 'authentic_white'
      );

      const clickCompress = (phaseP > 0.20 && phaseP < 0.30)
        ? 1 - 0.03 * Math.sin(((phaseP - 0.20) / 0.10) * Math.PI) * Number(cfg.cursorClickDepth ?? 1.0)
        : 1.0;

      ctx.save();
      ctx.translate(w * 0.5, barY + barH / 2);
      ctx.scale(clickCompress, clickCompress);
      ctx.translate(-w * 0.5, -(barY + barH / 2));

      ctx.fillStyle = cardBgHex;
      ctx.strokeStyle = borderHex;
      ctx.lineWidth = 1.8;
      drawRoundedRect(ctx, barX, barY, barW, barH, barH / 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = textSecondary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(barX + 26, barY + barH / 2 - 2, 7.5, 0, Math.PI * 2);
      ctx.moveTo(barX + 32, barY + barH / 2 + 4);
      ctx.lineTo(barX + 38, barY + barH / 2 + 10);
      ctx.stroke();

      ctx.fillStyle = textSecondary;
      ctx.beginPath();
      ctx.arc(barX + barW - 56, barY + barH / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeRect(barX + barW - 34, barY + barH / 2 - 6, 14, 12);

      ctx.fillStyle = textPrimary;
      ctx.font = `700 21px 'Inter', sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const textStartX = barX + 52;
      ctx.fillText(visibleText, textStartX, barY + barH / 2 + 1);

      if (phaseP >= 0.24 && Math.floor(timeSec * 6) % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(textStartX + typedWidthPx + 3, barY + 13, 2.8, barH - 26);
      }
      ctx.restore();

      const btnY = barY + barH + 28;
      const btnW = 142;
      const btnH = 38;
      const btn1X = w * 0.5 - btnW - 8;
      const btn2X = w * 0.5 + 8;

      ctx.fillStyle = '#303134';
      drawRoundedRect(ctx, btn1X, btnY, btnW, btnH, 4);
      ctx.fill();
      drawRoundedRect(ctx, btn2X, btnY, btnW, btnH, 4);
      ctx.fill();

      ctx.fillStyle = '#e8eaed';
      ctx.font = `500 14px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cfg.googleButton1Text || 'Google Search', btn1X + btnW / 2, btnY + btnH / 2);
      ctx.fillText(cfg.googleButton2Text || "I'm Feeling Lucky", btn2X + btnW / 2, btnY + btnH / 2);

      if (phaseP < 0.34) {
        const cursorT = easeInOutCubic(clamp(phaseP / 0.22, 0, 1));
        const curX = lerp(w * 0.52, barX + barW * 0.42, cursorT);
        const curY = lerp(h * 0.85, barY + barH * 0.55, cursorT);
        const isClicking = phaseP > 0.20 && phaseP < 0.28;
        drawPointingHandCursor(ctx, curX, curY, isClicking);

        if (isClicking) {
          const rippleR = ((phaseP - 0.20) / 0.08) * 38;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(curX, curY, rippleR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();

      _lastStageHitBoxes.push({
        id: 'google_search_bar',
        label: 'Google Search Typewriter & Camera Pan',
        scene: 'scene3',
        x: w * 0.15,
        y: h * 0.22,
        w: w * 0.70,
        h: h * 0.48
      });
      return;
    }

    const serpP = (localP - 0.48) / 0.52;
    const scrollSpeed = clamp(Number(cfg.serpScrollSpeed ?? 1.25), 0.3, 3.0);
    const tiltDeg = Number(cfg.serpTiltAngleDeg ?? 18);
    const scrollOffsetY = serpP * 520 * scrollSpeed;

    const warpP = clamp((serpP - 0.74) / 0.26, 0, 1);
    const zoomThroughScale = 1.0 + Math.pow(warpP, 2.2) * 3.8 * clamp(Number(cfg.vortexWarpStrength ?? 1.15), 0, 2.5);

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(zoomThroughScale, zoomThroughScale * Math.cos((tiltDeg * Math.PI) / 180));
    ctx.rotate(Math.sin(serpP * Math.PI) * -0.04);
    ctx.translate(-w * 0.5, -h * 0.5 - scrollOffsetY);

    const colX = w * 0.14;
    const colW = w * 0.72;
    let curY = 72;

    ctx.fillStyle = cardBgHex;
    ctx.strokeStyle = borderHex;
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, colX, curY, colW, 46, 23);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 20px 'Inter', sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(cfg.googleLogoTitle || 'Google', colX - 96, curY + 30);

    ctx.fillStyle = textPrimary;
    ctx.font = `600 15px 'Inter', sans-serif`;
    ctx.fillText(query, colX + 24, curY + 28);
    curY += 68;

    const paaQuestions = [
      cfg.paaQ1 || "What is world's most valuable company?",
      cfg.paaQ2 || 'Which is the No 1 company in world?',
      cfg.paaQ3 || 'What is the top 10 richest company in the world?',
      cfg.paaQ4 || 'What are the 3 richest companies in the world?'
    ];

    ctx.fillStyle = textPrimary;
    ctx.font = `700 20px 'Inter', sans-serif`;
    ctx.fillText(cfg.paaHeaderTitle || 'People also ask', colX, curY);
    curY += 16;

    paaQuestions.forEach((qText) => {
      ctx.strokeStyle = 'rgba(154, 160, 166, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(colX, curY);
      ctx.lineTo(colX + colW, curY);
      ctx.stroke();

      ctx.fillStyle = textPrimary;
      ctx.font = `500 16px 'Inter', sans-serif`;
      ctx.fillText(qText, colX + 4, curY + 26);

      ctx.strokeStyle = textSecondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(colX + colW - 24, curY + 18);
      ctx.lineTo(colX + colW - 18, curY + 24);
      ctx.lineTo(colX + colW - 12, curY + 18);
      ctx.stroke();

      curY += 42;
    });

    curY += 22;

    const results = [
      {
        src: cfg.serpResult1Source || 'https://businessplus.ie › news › most-valuable-companies',
        title: cfg.serpResult1Title || "The World's 20 Most Valuable Companies - Business Plus",
        snippet: cfg.serpResult1Snippet || 'Jun 12, 2022 — Apple is the most valuable company in the world with a market capitalization of $2.06 trillion...'
      },
      {
        src: cfg.serpResult2Source || 'https://www.visualcapitalist.com › biggest-public-comp...',
        title: cfg.serpResult2Title || 'Ranked: The 100 Biggest Public Companies in the World',
        snippet: cfg.serpResult2Snippet || 'Dec 26, 2022 — Berkshire Hathaway, $686B ; 7, Tesla, $522B ; 8, Tencent, $495B ; 9, TSMC, $442B...'
      },
      {
        src: cfg.serpResult3Source || 'https://www.investopedia.com › ... › Fundamental Analysis',
        title: cfg.serpResult3Title || 'Biggest Companies in the World by Market Cap',
        snippet: cfg.serpResult3Snippet || '1. Apple Inc. (AAPL) · 2. Saudi Aramco (2222.SR) · 3. Microsoft Corp. (MSFT) · 4. Alphabet Inc. (GOOG)...'
      },
      {
        src: cfg.serpResult4Source || 'https://www.statista.com › ... › Economy',
        title: cfg.serpResult4Title || 'Biggest companies in the world by market cap 2022',
        snippet: cfg.serpResult4Snippet || 'Apple led the ranking of the world’s largest companies by market capitalization in 2022...'
      }
    ];

    results.forEach((item) => {
      ctx.fillStyle = cardBgHex;
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      drawRoundedRect(ctx, colX - 12, curY, colW + 24, 108, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = textSecondary;
      ctx.font = `500 13px 'Inter', sans-serif`;
      ctx.fillText(item.src, colX + 4, curY + 24);

      ctx.fillStyle = cfg.serpHighlightColor || '#8ab4f8';
      ctx.font = `700 21px 'Inter', sans-serif`;
      ctx.fillText(item.title, colX + 4, curY + 54);

      ctx.fillStyle = textPrimary;
      ctx.font = `400 14.5px 'Inter', sans-serif`;
      ctx.fillText(item.snippet, colX + 4, curY + 84);

      curY += 126;
    });

    ctx.restore();

    ctx.save();
    const dofTop = ctx.createLinearGradient(0, 0, 0, h * 0.22);
    dofTop.addColorStop(0, bgHex);
    dofTop.addColorStop(1, 'rgba(23,23,23,0)');
    ctx.fillStyle = dofTop;
    ctx.fillRect(0, 0, w, h * 0.22);

    const dofBot = ctx.createLinearGradient(0, h * 0.78, 0, h);
    dofBot.addColorStop(0, 'rgba(23,23,23,0)');
    dofBot.addColorStop(1, bgHex);
    ctx.fillStyle = dofBot;
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
    ctx.restore();

    _lastStageHitBoxes.push({
      id: 'serp_results_list',
      label: '3D Perspective Google SERP & People Also Ask',
      scene: 'scene3',
      x: w * 0.12,
      y: h * 0.12,
      w: w * 0.76,
      h: h * 0.76
    });

    if (warpP > 0.02) {
      applyGranularSliceAndTearGlitch(ctx, w, h, timeSec, cfg, warpP * 0.85, false);

      const billRec = getLoadedImage(cfg.dollarBillCutoutUrl || DEFAULT_CUTOUT_URIS.dollarBill);
      if (billRec && billRec.loaded && warpP > 0.35) {
        const billP = (warpP - 0.35) / 0.65;
        ctx.save();
        ctx.globalAlpha = clamp(billP * 0.9, 0, 0.88);
        ctx.translate(w * (0.28 + billP * 0.18), h * (0.35 + billP * 0.25));
        ctx.rotate(-0.45 + billP * 0.6);
        const bw = w * (0.36 + billP * 0.28);
        const bh = bw * 0.68;
        ctx.drawImage(billRec.img, -bw / 2, -bh / 2, bw, bh);
        ctx.restore();
      }
    }
  }

  // ==========================================================================
  // 9. SCENE 4 RENDERER: FULL-SCREEN 3D LOW-POLY TRIANGLE MESH + OUT-OF-FOCUS
  //    BLURRED FRAGMENTS + UNIFIED (LOGO + TEXT) LOCKUPS & SEPARATE RED BRUSH SWIPE
  //    (Matched 1:1 to `image_fd5551af.png` & Frames 000333 – 000409)
  // ==========================================================================
  function renderScene4(ctx, w, h, localP, timeSec, cfg) {
    // 1. Deep Obsidian Black Background (Matching image_fd5551af.png)
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, w, h);

    // 2. FULL-SCREEN 3D LOW-POLY FACETED TRIANGLE MESH (Spans entire 16:9 canvas from edge to edge!)
    const rotSpeed = Number(cfg.plexusRotationSpeed ?? 0.85);
    const facetAlpha = clamp(Number(cfg.plexusFacetOpacity ?? 0.34), 0, 0.85);
    const cols = 8;
    const rows = 5;
    const spanX = w * 1.32;
    const spanY = h * 1.32;
    const startGridX = -w * 0.16;
    const startGridY = -h * 0.16;
    const cellW = spanX / cols;
    const cellH = spanY / rows;

    const gridPts = [];
    for (let r = 0; r <= rows; r++) {
      const rowArr = [];
      for (let c = 0; c <= cols; c++) {
        const seed = r * 31 + c * 17;
        const jx = (hash1D(seed * 3.7) - 0.5) * cellW * 0.72
          + Math.sin(timeSec * 0.9 * rotSpeed + seed) * 18;
        const jy = (hash1D(seed * 7.3) - 0.5) * cellH * 0.72
          + Math.cos(timeSec * 0.8 * rotSpeed + seed * 1.3) * 16;
        const jz = Math.sin(timeSec * 0.7 * rotSpeed + c * 0.6 + r * 0.5);
        rowArr.push({
          x: startGridX + c * cellW + jx,
          y: startGridY + r * cellH + jy,
          z: jz,
          seed
        });
      }
      gridPts.push(rowArr);
    }

    function drawLowPolyMeshLayer(isForegroundShards) {
      ctx.save();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p00 = gridPts[r][c];
          const p10 = gridPts[r][c + 1];
          const p01 = gridPts[r + 1][c];
          const p11 = gridPts[r + 1][c + 1];

          const triPairs = [
            [p00, p10, p01, (r * cols + c) * 2],
            [p10, p11, p01, (r * cols + c) * 2 + 1]
          ];

          triPairs.forEach(([a, b, d, tIdx]) => {
            const avgZ = (a.z + b.z + d.z) / 3;
            const isFgShard = avgZ > 0.36 && (tIdx % 3 === 0);
            if (isFgShard !== isForegroundShards) return;

            // Translucent dark-charcoal/slate 3D triangle face (Matches image_fd5551af.png)
            const shadeVal = Math.floor(38 + (avgZ + 1) * 48 + hash1D(tIdx * 13.1) * 35);
            const triOp = isForegroundShards
              ? clamp(facetAlpha * Number(cfg.plexusForegroundShardStrength ?? 0.85) * (1 - localP * 0.45), 0, 0.52)
              : clamp((0.06 + (avgZ + 1) * 0.11 + hash1D(tIdx * 5.7) * 0.14) * (facetAlpha / 0.34), 0.03, 0.48);

            ctx.fillStyle = `rgba(${shadeVal}, ${shadeVal + 4}, ${shadeVal + 10}, ${triOp.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(d.x, d.y);
            ctx.closePath();
            ctx.fill();

            // Crisp thin wireframe edge
            ctx.strokeStyle = isForegroundShards
              ? 'rgba(226, 232, 240, 0.24)'
              : 'rgba(203, 213, 225, 0.20)';
            ctx.lineWidth = 0.9;
            ctx.stroke();
          });
        }
      }

      // Glowing white vertex dots + fine constellation sparkles across the whole screen (Matches image_fd5551af.png)
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const pt = gridPts[r][c];
          const isFg = pt.z > 0.36;
          if (isFg !== isForegroundShards) continue;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 5.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Tiny ambient star/dust vertices scattered inside triangles
      if (!isForegroundShards) {
        const extraDots = clamp(Math.round(Number(cfg.plexusNodeCount ?? 54)), 10, 100);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        for (let i = 0; i < extraDots; i++) {
          const sx = (hash1D(i * 41.3) * w + Math.sin(timeSec * 0.5 + i) * 14 + w) % w;
          const sy = (hash1D(i * 73.7) * h + Math.cos(timeSec * 0.4 + i) * 14 + h) % h;
          const sr = 1.0 + hash1D(i * 19.1) * 1.6;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Draw background full-screen 3D low-poly triangle mesh
    drawLowPolyMeshLayer(false);

    // 3. Softly Out-of-Focus (Depth-of-Field Blurred) Tumbling Pale-Sage/White Fragments (Matches image_fd5551af.png)
    const billCount = clamp(Math.round(Number(cfg.dollarBillCount ?? 11)), 0, 45);
    const fallSpeed = clamp(Number(cfg.dollarFallSpeed ?? 0.95), 0.1, 3.5);
    const blurSoftness = clamp(Number(cfg.dollarBlurSoftness ?? 1.0), 0.2, 2.5);
    const billRec = getLoadedImage(cfg.dollarBillCutoutUrl || DEFAULT_CUTOUT_URIS.dollarBill);

    function drawBlurredBanknoteFragments(isForegroundPass) {
      if (!billRec || !billRec.loaded || billCount <= 0) return;
      for (let b = 0; b < billCount; b++) {
        const depth = 0.45 + hash1D(b * 13.3) * 1.05;
        const isFg = depth > 1.15;
        if (isFg !== isForegroundPass) continue;

        const progressY = ((timeSec * 0.22 * fallSpeed * depth + hash1D(b * 29.7)) % 1.28) - 0.14;
        const bx = (hash1D(b * 53.1) * w + Math.sin(timeSec * 1.3 + b * 2.1) * 42 + w) % w;
        const by = progressY * h;
        const rot = timeSec * (0.8 + hash1D(b * 7.7) * 0.9) * (b % 2 === 0 ? 1 : -1) + b * 1.7;
        const flutterScaleX = 0.55 + 0.45 * Math.cos(timeSec * 1.9 + b);
        const flutterScaleY = 0.48 + 0.52 * Math.sin(timeSec * 2.3 + b * 1.3);
        const bw = (isFg ? 155 : 96) * depth * blurSoftness;
        const bh = (isFg ? 108 : 68) * depth * blurSoftness;

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(rot);
        ctx.scale(flutterScaleX, flutterScaleY);
        ctx.globalAlpha = isFg ? 0.68 : clamp(0.42 + depth * 0.28, 0.25, 0.78);
        ctx.drawImage(billRec.img, -bw / 2, -bh / 2, bw, bh);
        ctx.restore();
      }
    }

    drawBlurredBanknoteFragments(false);

    // 4. UNIFIED (LOGO + TEXT) LOCKUPS & SEPARATE RED BRUSH SWIPES FOR APPLE, MICROSOFT & GOOGLE
    //    (Frame 349 & 365: Logo + White Text reveal together as one unit first;
    //     then after `BrushDelay`, the red brush stroke swipes in behind the white text!)
    const companies = [
      {
        id: 'company_apple',
        name: cfg.company1Name !== undefined ? cfg.company1Name : 'Apple',
        cutoutUrl: cfg.company1CutoutUrl || DEFAULT_CUTOUT_URIS.appleLogo,
        scale: clamp(Number(cfg.company1Scale ?? 1.0), 0.4, 2.2),
        offsetY: Number(cfg.company1OffsetY ?? 0),
        textScale: clamp(Number(cfg.company1TextScale ?? 1.0), 0.5, 2.0),
        textGapPx: Number(cfg.company1TextGapPx ?? 14),
        textColor: cfg.company1TextColor || '#ffffff',
        startTime: clamp(Number(cfg.company1StartTime ?? 0.04), 0.0, 0.85),
        brushDelay: clamp(Number(cfg.company1BrushDelay ?? 0.08), 0.0, 0.50),
        brushColor: cfg.company1BrushColor || '#d91b24',
        brushStyle: cfg.company1BrushStyle || 'authentic_tapered',
        brushWidthScale: clamp(Number(cfg.company1BrushWidthScale ?? 1.0), 0.5, 2.0),
        brushHeightScale: clamp(Number(cfg.company1BrushHeightScale ?? 1.0), 0.5, 2.0),
        x: w * 0.235,
        y: h * 0.415,
        seed: 101
      },
      {
        id: 'company_microsoft',
        name: cfg.company2Name !== undefined ? cfg.company2Name : 'Microsoft',
        cutoutUrl: cfg.company2CutoutUrl || DEFAULT_CUTOUT_URIS.microsoftLogo,
        scale: clamp(Number(cfg.company2Scale ?? 1.0), 0.4, 2.2),
        offsetY: Number(cfg.company2OffsetY ?? 0),
        textScale: clamp(Number(cfg.company2TextScale ?? 1.0), 0.5, 2.0),
        textGapPx: Number(cfg.company2TextGapPx ?? 14),
        textColor: cfg.company2TextColor || '#ffffff',
        startTime: clamp(Number(cfg.company2StartTime ?? 0.24), 0.0, 0.85),
        brushDelay: clamp(Number(cfg.company2BrushDelay ?? 0.10), 0.0, 0.50),
        brushColor: cfg.company2BrushColor || '#d91b24',
        brushStyle: cfg.company2BrushStyle || 'authentic_tapered',
        brushWidthScale: clamp(Number(cfg.company2BrushWidthScale ?? 1.0), 0.5, 2.0),
        brushHeightScale: clamp(Number(cfg.company2BrushHeightScale ?? 1.0), 0.5, 2.0),
        x: w * 0.535,
        y: h * 0.415,
        seed: 202
      },
      {
        id: 'company_google',
        name: cfg.company3Name !== undefined ? cfg.company3Name : 'Google',
        cutoutUrl: cfg.company3CutoutUrl || DEFAULT_CUTOUT_URIS.googleLogo,
        scale: clamp(Number(cfg.company3Scale ?? 1.0), 0.4, 2.2),
        offsetY: Number(cfg.company3OffsetY ?? 0),
        textScale: clamp(Number(cfg.company3TextScale ?? 1.0), 0.5, 2.0),
        textGapPx: Number(cfg.company3TextGapPx ?? 14),
        textColor: cfg.company3TextColor || '#ffffff',
        startTime: clamp(Number(cfg.company3StartTime ?? 0.44), 0.0, 0.85),
        brushDelay: clamp(Number(cfg.company3BrushDelay ?? 0.10), 0.0, 0.50),
        brushColor: cfg.company3BrushColor || '#d91b24',
        brushStyle: cfg.company3BrushStyle || 'authentic_tapered',
        brushWidthScale: clamp(Number(cfg.company3BrushWidthScale ?? 1.0), 0.5, 2.0),
        brushHeightScale: clamp(Number(cfg.company3BrushHeightScale ?? 1.0), 0.5, 2.0),
        x: w * 0.835,
        y: h * 0.415,
        seed: 303
      }
    ];

    const animStyle = cfg.companyAnimStyle || 'brush_fragment_wipe';
    const hoverAmp = Number(cfg.companyHoverAmplitude ?? 4);
    const masterPop = clamp(Number(cfg.companyCutoutPopScale ?? 1.0), 0.5, 2.0);
    const brushSpeed = clamp(Number(cfg.brushSwipeSpeed ?? 1.35), 0.4, 3.0);
    const brushRough = clamp(Number(cfg.brushRoughness ?? 0.65), 0.1, 1.5);
    const splatterCount = clamp(Number(cfg.brushSplatterCount ?? 0), 0, 30);

    companies.forEach((comp, idx) => {
      const lockupRawP = (localP - comp.startTime) / 0.18;
      if (lockupRawP <= 0) return;

      const lockupP = clamp(lockupRawP, 0, 1);
      const hoverY = Math.sin(timeSec * 2.6 + idx * 2.1) * hoverAmp;
      const logoSize = Math.min(w, h) * 0.215 * comp.scale * masterPop;

      let lockupX = comp.x;
      let lockupY = comp.y + comp.offsetY + hoverY;
      let scaleX = 1;
      let scaleY = 1;
      let alpha = 1;

      if (animStyle === 'elastic_pop') {
        const s = easeOutElastic(lockupP, 1.2);
        scaleX = s;
        scaleY = s;
      } else if (animStyle === 'parallax_drop') {
        const e = easeOutBack(lockupP);
        lockupY -= (1 - e) * 160;
        scaleX = 0.75 + 0.25 * e;
        scaleY = 0.75 + 0.25 * e;
        alpha = clamp(lockupP * 1.5, 0, 1);
      } else if (animStyle === 'flip_3d') {
        const e = easeOutBack(lockupP);
        scaleX = Math.cos((1 - e) * Math.PI);
        scaleY = 0.85 + 0.15 * e;
      } else if (animStyle === 'glitch_materialize') {
        alpha = clamp(lockupP * 1.4, 0, 1);
        if (lockupP < 0.75) {
          lockupX += (hash1D(Math.floor(timeSec * 30) + idx * 19) - 0.5) * 40 * (1 - lockupP);
        }
      }

      // Measure the company text so the Red Brush Stroke and the Unified Lockup Wipe fit it accurately
      const fontSize = Math.round(logoSize * 0.37 * comp.textScale);
      ctx.save();
      ctx.font = `600 ${fontSize}px 'Inter', -apple-system, sans-serif`;
      const measuredTextW = ctx.measureText(comp.name).width;
      ctx.restore();

      const textCenterY = logoSize * 0.50 + comp.textGapPx + fontSize * 0.42;
      const brushW = Math.max(measuredTextW + fontSize * 0.78, logoSize * 1.05) * comp.brushWidthScale;
      const brushH = Math.max(fontSize * 1.08, 42) * comp.brushHeightScale;

      // Independent Red Brush Swipe Progress (Starts `comp.brushDelay` AFTER the Logo+Text lockup!)
      const brushStartP = comp.startTime + comp.brushDelay;
      const brushP = clamp(((localP - brushStartP) / 0.18) * brushSpeed, 0, 1);

      ctx.save();
      ctx.translate(lockupX, lockupY);
      ctx.scale(scaleX, scaleY);
      ctx.globalAlpha = alpha;

      // STEP A: Draw the Red Paint Brush Stroke ("the red little thing") BEHIND the white text
      if (brushP > 0.01) {
        drawAuthenticRedBrushSwipe(
          ctx,
          0,
          textCenterY + 2,
          brushW,
          brushH,
          comp.brushColor,
          brushP,
          comp.brushStyle,
          brushRough,
          splatterCount,
          comp.seed
        );
      }

      // STEP B: Draw the Unified (Logo + White Text) Lockup Together!
      // During 'brush_fragment_wipe', the Logo and the White Text wipe in TOGETHER from left to right (Frame 349 & 365)
      ctx.save();
      if (animStyle === 'brush_fragment_wipe' && lockupP < 0.99) {
        const unionHalfW = Math.max(logoSize * 0.7, brushW * 0.62);
        const wipeW = unionHalfW * 2 * easeInOutCubic(lockupP);
        const leftEdge = -unionHalfW;
        const topEdge = -logoSize * 0.65;
        const botEdge = textCenterY + brushH * 0.85;

        ctx.beginPath();
        ctx.moveTo(leftEdge, topEdge);
        ctx.lineTo(leftEdge + wipeW, topEdge);
        const steps = 12;
        for (let s = 0; s <= steps; s++) {
          const sy = topEdge + (s / steps) * (botEdge - topEdge);
          const jag = (hash1D(comp.seed + s * 11.3) - 0.5) * 34 * brushRough;
          ctx.lineTo(leftEdge + wipeW + jag, sy);
        }
        ctx.lineTo(leftEdge, botEdge);
        ctx.closePath();
        ctx.clip();
      }

      // 1. Company Logo Cutout
      const imgRec = getLoadedImage(comp.cutoutUrl);
      if (imgRec && imgRec.loaded) {
        ctx.drawImage(imgRec.img, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
      }

      // 2. Unified White Company Name Text ("Apple", "Microsoft", "Google") Directly Below Logo
      if (comp.name) {
        ctx.fillStyle = comp.textColor || '#ffffff';
        ctx.font = `600 ${fontSize}px 'Inter', -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 4;
        ctx.fillText(comp.name, 0, textCenterY);
      }
      ctx.restore();

      ctx.restore();

      // Register Hit-Boxes for Stage Click Selection (Both the Logo+Text lockup and the Red Brush)
      const hitW = Math.max(logoSize, brushW) * 1.08;
      const hitTop = lockupY - logoSize * 0.55;
      const hitH = logoSize * 0.55 + textCenterY + brushH * 0.65;
      _lastStageHitBoxes.push({
        id: comp.id,
        label: `${comp.name || 'Company'} (Logo + Text + Red Brush)`,
        scene: 'scene4',
        x: lockupX - hitW / 2,
        y: hitTop,
        w: hitW,
        h: hitH
      });
    });

    // 5. Foreground 3D Dark Triangle Shards Passing Across Logos + Foreground Blurred Banknote Fragments
    drawLowPolyMeshLayer(true);
    drawBlurredBanknoteFragments(true);

    // 6. End of Scene 4 Glitch: Pixelated Digital Noise Band + Block Slices (Frame 000409)
    if (localP > 0.84) {
      const endGlitch = clamp((localP - 0.84) / 0.16, 0, 1);
      applyGranularSliceAndTearGlitch(ctx, w, h, timeSec, cfg, endGlitch * 1.15, true);
    }
  }

  // ==========================================================================
  // 10. SCENE 5 RENDERER: 3D-TILTED GLOBAL MARKET CAP LEADERBOARD TABLE SCROLL
  // ==========================================================================
  function drawMiniCompanyBadge(ctx, x, y, size, rank, name) {
    ctx.save();
    const lower = String(name || '').toLowerCase();
    if (lower.includes('apple')) {
      const rec = getLoadedImage(DEFAULT_CUTOUT_URIS.appleLogo);
      if (rec && rec.loaded) {
        ctx.fillStyle = '#0f172a';
        drawRoundedRect(ctx, x, y, size, size, 6);
        ctx.fill();
        ctx.drawImage(rec.img, x + 3, y + 3, size - 6, size - 6);
        ctx.restore();
        return;
      }
    } else if (lower.includes('microsoft')) {
      const rec = getLoadedImage(DEFAULT_CUTOUT_URIS.microsoftLogo);
      if (rec && rec.loaded) {
        ctx.drawImage(rec.img, x, y, size, size);
        ctx.restore();
        return;
      }
    } else if (lower.includes('google') || lower.includes('alphabet')) {
      const rec = getLoadedImage(DEFAULT_CUTOUT_URIS.googleLogo);
      if (rec && rec.loaded) {
        ctx.drawImage(rec.img, x, y, size, size);
        ctx.restore();
        return;
      }
    } else if (lower.includes('tencent')) {
      const rec = getLoadedImage(DEFAULT_CUTOUT_URIS.tBadge);
      if (rec && rec.loaded) {
        ctx.drawImage(rec.img, x, y, size, size);
        ctx.restore();
        return;
      }
    }

    const badgeColors = ['#0ea5e9', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#1e3a8a', '#1d4ed8', '#dc2626'];
    ctx.fillStyle = badgeColors[(rank - 1) % badgeColors.length];
    drawRoundedRect(ctx, x, y, size, size, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.round(size * 0.52)}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(name || 'C').charAt(0).toUpperCase(), x + size / 2, y + size / 2 + 1);
    ctx.restore();
  }

  function renderScene5(ctx, w, h, localP, timeSec, cfg) {
    const isLightPaper = (cfg.tableStyleMode || 'authentic_light') === 'authentic_light';

    ctx.fillStyle = isLightPaper ? '#d4d8e0' : '#050811';
    ctx.fillRect(0, 0, w, h);

    const pitchDeg = Number(cfg.tableTiltPitchDeg ?? 18);
    const rollDeg = Number(cfg.tableTiltRollDeg ?? -6);
    const scrollSpd = clamp(Number(cfg.tableScrollSpeed ?? 1.15), 0.2, 3.0);
    const highlightIdx = clamp(Math.round(Number(cfg.tableHighlightRow ?? 8)), 1, 8);
    const hiColor = cfg.tableHighlightColor || '#0284c7';

    const rows = [
      { rank: 1, name: cfg.tableRow1Name || 'Apple', ticker: cfg.tableRow1Ticker || 'AAPL', cap: cfg.tableRow1Cap || '$2.066 T', price: cfg.tableRow1Price || '$130.15' },
      { rank: 2, name: cfg.tableRow2Name || 'Saudi Aramco', ticker: cfg.tableRow2Ticker || '2222.SR', cap: cfg.tableRow2Cap || '$1.883 T', price: cfg.tableRow2Price || '$8.52' },
      { rank: 3, name: cfg.tableRow3Name || 'Microsoft', ticker: cfg.tableRow3Ticker || 'MSFT', cap: cfg.tableRow3Cap || '$1.777 T', price: cfg.tableRow3Price || '$238.51' },
      { rank: 4, name: cfg.tableRow4Name || 'Alphabet (Google)', ticker: cfg.tableRow4Ticker || 'GOOG', cap: cfg.tableRow4Cap || '$1.185 T', price: cfg.tableRow4Price || '$91.91' },
      { rank: 5, name: cfg.tableRow5Name || 'Amazon', ticker: cfg.tableRow5Ticker || 'AMZN', cap: cfg.tableRow5Cap || '$971.91 B', price: cfg.tableRow5Price || '$95.27' },
      { rank: 6, name: cfg.tableRow6Name || 'Berkshire Hathaway', ticker: cfg.tableRow6Ticker || 'BRK-B', cap: cfg.tableRow6Cap || '$703.37 B', price: cfg.tableRow6Price || '$318.93' },
      { rank: 7, name: cfg.tableRow7Name || 'Visa', ticker: cfg.tableRow7Ticker || 'V', cap: cfg.tableRow7Cap || '$473.54 B', price: cfg.tableRow7Price || '$223.62' },
      { rank: 8, name: cfg.tableRow8Name || 'Tencent (Shadow Giant)', ticker: cfg.tableRow8Ticker || '0700.HK', cap: cfg.tableRow8Cap || '$466.27 B', price: cfg.tableRow8Price || '$113.22' }
    ];

    const tableW = w * 0.84;
    const rowH = 68;
    const tableX = (w - tableW) / 2;
    const scrollY = (localP - 0.35) * 95 * scrollSpd;

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate((rollDeg * Math.PI) / 180);
    ctx.scale(1.06, Math.cos((pitchDeg * Math.PI) / 180));
    ctx.translate(-w * 0.5, -h * 0.5 - scrollY);

    const startY = 58;
    ctx.fillStyle = isLightPaper ? '#f8fafc' : '#0b1120';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 32;
    drawRoundedRect(ctx, tableX - 18, startY - 48, tableW + 36, rows.length * (rowH + 4) + 68, 12);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isLightPaper ? '#475569' : '#94a3b8';
    ctx.font = `800 13px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(cfg.tableHeaderTitle || 'GLOBAL MARKET CAP LEADERBOARD // VALUATION TRILLIONS', tableX + 8, startY - 16);

    rows.forEach((row, i) => {
      const ry = startY + i * (rowH + 4);
      const isHi = row.rank === highlightIdx;
      const slideIn = easeOutBack(clamp((localP * 1.6 - i * 0.06) / 0.45, 0, 1));
      const rxOffset = (1 - slideIn) * 90;

      ctx.save();
      ctx.translate(rxOffset, 0);

      if (isHi) {
        ctx.fillStyle = isLightPaper ? `${hiColor}18` : `${hiColor}2e`;
        ctx.strokeStyle = hiColor;
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, tableX, ry, tableW, rowH, 8);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = isLightPaper ? (i % 2 === 0 ? '#ffffff' : '#f1f5f9') : 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(tableX, ry, tableW, rowH);
        ctx.strokeStyle = isLightPaper ? '#cbd5e1' : 'rgba(148, 163, 184, 0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tableX, ry + rowH);
        ctx.lineTo(tableX + tableW, ry + rowH);
        ctx.stroke();
      }

      ctx.fillStyle = isHi ? hiColor : (isLightPaper ? '#334155' : '#94a3b8');
      ctx.font = `600 18px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${row.rank}`, tableX + 34, ry + rowH / 2);
      ctx.fillText(`${row.rank}`, tableX + 104, ry + rowH / 2);

      drawMiniCompanyBadge(ctx, tableX + 148, ry + (rowH - 40) / 2, 40, row.rank, row.name);

      ctx.fillStyle = isLightPaper ? '#0f172a' : '#f8fafc';
      ctx.font = `700 18px 'Inter', sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(row.name, tableX + 204, ry + rowH * 0.36);

      ctx.fillStyle = isLightPaper ? '#64748b' : '#94a3b8';
      ctx.font = `600 13px 'JetBrains Mono', monospace`;
      ctx.fillText(row.ticker, tableX + 204, ry + rowH * 0.70);

      ctx.fillStyle = isHi ? hiColor : (isLightPaper ? '#0f172a' : '#e2e8f0');
      ctx.font = `700 18px 'Inter', sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(row.cap, tableX + tableW * 0.76, ry + rowH / 2);

      ctx.fillStyle = isLightPaper ? '#1e293b' : '#cbd5e1';
      ctx.font = `600 18px 'Inter', sans-serif`;
      ctx.fillText(row.price, tableX + tableW - 28, ry + rowH / 2);

      ctx.restore();
    });

    ctx.restore();

    _lastStageHitBoxes.push({
      id: 'leaderboard_table',
      label: '3D Global Market Cap Leaderboard (8 Rows)',
      scene: 'scene5',
      x: w * 0.08,
      y: h * 0.08,
      w: w * 0.84,
      h: h * 0.84
    });
  }

  // ==========================================================================
  // 11. MASTER CANVAS COMPOSITOR & POST-PROCESSING
  // ==========================================================================
  function resolveSceneAndLocalProgress(t, cfg) {
    const speed = clamp(Number(cfg.playbackSpeed ?? 1.0), 0.2, 3.0);
    const activeFilter = cfg.activeSceneFilter || 'all';
    const totalDur = SCENES[SCENES.length - 1].end; // 17.0s

    if (activeFilter !== 'all') {
      const targetSc = SCENES.find((s) => s.id === activeFilter) || SCENES[0];
      const dur = Math.max(2.2, targetSc.end - targetSc.start);
      const isScrubbing = !!document.querySelector('#tpl-hud-scrubber-wrap.dragging');
      const isPaused = typeof topCustomizerState !== 'undefined' && topCustomizerState && topCustomizerState.isPlaying === false;
      if (isScrubbing) {
        const scrubP = clamp((Number(t) || 0) / totalDur, 0, 0.999);
        return { scene: targetSc, localP: scrubP };
      }
      if (isPaused) {
        const pausedP = clamp(((Number(t) || 1.2) % dur) / dur, 0.15, 0.95);
        return { scene: targetSc, localP: pausedP };
      }
      const soloElapsed = Math.max(0, (performance.now() - _soloSceneStartPerf) / 1000);
      const localP = ((soloElapsed * speed) % dur) / dur;
      return { scene: targetSc, localP };
    }

    const seqT = (((Number(t) || 0) * speed) % totalDur + totalDur) % totalDur;
    const found = SCENES.find((s) => seqT >= s.start && seqT < s.end) || SCENES[SCENES.length - 1];
    const localP = clamp((seqT - found.start) / Math.max(0.1, found.end - found.start), 0, 1);
    return { scene: found, localP };
  }

  function renderTencentMultimediaCanvas(canvas, t, overrideData) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width || 1280;
    const h = canvas.height || 720;
    const cfg = getConfig(overrideData);

    _lastStageHitBoxes = [];
    ctx.clearRect(0, 0, w, h);

    const { scene, localP } = resolveSceneAndLocalProgress(t || 0, cfg);
    const animClock = (cfg.activeSceneFilter && cfg.activeSceneFilter !== 'all')
      ? Math.max(0, (performance.now() - _soloSceneStartPerf) / 1000)
      : (t || 0);

    if (scene.id === 'scene1') {
      renderScene1(ctx, w, h, localP, animClock, cfg);
    } else if (scene.id === 'scene2') {
      renderScene2(ctx, w, h, localP, animClock, cfg);
    } else if (scene.id === 'scene3') {
      renderScene3(ctx, w, h, localP, animClock, cfg);
    } else if (scene.id === 'scene4') {
      renderScene4(ctx, w, h, localP, animClock, cfg);
    } else {
      renderScene5(ctx, w, h, localP, animClock, cfg);
    }

    // Global CRT Scanlines
    const scanOp = clamp(Number(cfg.crtScanlineOpacity ?? 0.12), 0, 0.85);
    if (scanOp > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${scanOp.toFixed(3)})`;
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1.4);
      }
      ctx.restore();
    }

    // Global Vignette
    const vigStr = clamp(Number(cfg.vignetteStrength ?? 0.48), 0, 1);
    if (vigStr > 0.02) {
      ctx.save();
      const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.72);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(0,0,0,${(vigStr * 0.88).toFixed(3)})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    const timerBadge = document.getElementById('tpl-modal-timer-badge');
    if (timerBadge) {
      const dispT = clamp(Number(t) || 0, 0, 17.0);
      timerBadge.textContent = `${dispT.toFixed(1)}s / 17.0s (Scene ${scene.index})`;
    }

    const root = canvas.closest('.tmm-stage-root');
    if (root) {
      const pills = root.querySelectorAll('.tmm-stage-scene-pill');
      pills.forEach((p) => {
        const pid = p.getAttribute('data-scene-pill');
        const isCurrent = (cfg.activeSceneFilter === 'all' && pid === 'all') || (cfg.activeSceneFilter === pid);
        p.classList.toggle('is-active', isCurrent);
        p.classList.toggle('is-playing-now', cfg.activeSceneFilter === 'all' && pid === scene.id);
      });
    }
  }

  // ==========================================================================
  // 12. STAGE MOUNTING, CLEAN SCREEN HUD TOGGLE & DIRECT CLICK-TO-SELECT
  // ==========================================================================
  let _lastAnimTime = 0;

  function applyCleanScreenHudState(isHidden) {
    const cfg = getConfig();
    cfg.cleanScreenHudHidden = !!isHidden;

    // 1. Hide/Show Top Adaptive Stage Toolbar ([16:9 YouTube] [Video] [3D] [Theater View] [Clean Screen] [Fullscreen] [Timecode])
    const topToolbar = document.getElementById('tpl-modal-stage-adaptive-toolbar');
    if (topToolbar) {
      topToolbar.style.setProperty('display', isHidden ? 'none' : 'flex', 'important');
    }

    // 2. Hide/Show Stage Scene Bar (▶ All 5 Scenes | 1. Icon & VHS Glitch | ...)
    document.querySelectorAll('.tmm-stage-scene-bar').forEach((bar) => {
      bar.style.display = isHidden ? 'none' : 'flex';
    });

    // 3. Ensure bottom hover player scrubber bar (#tpl-modal-player-hud) stays available on hover!
    const playerHud = document.getElementById('tpl-modal-player-hud');
    if (playerHud) {
      playerHud.style.display = '';
    }

    // 4. Hide/Show Floating Selection Boxes
    if (isHidden) {
      document.querySelectorAll('.tmm-stage-selection-box').forEach((b) => {
        b.style.display = 'none';
      });
    }

    // 5. Show/Hide Subtle Restore Pill in Top-Right of Stage When Clean Mode is Active
    document.querySelectorAll('[data-role="tmm-restore-hud-btn"]').forEach((btn) => {
      btn.style.display = isHidden ? 'inline-flex' : 'none';
    });

    // 6. Update Active State on Both Clean Screen Buttons (Top & Bottom-Right next to Fullscreen)
    const topCleanBtn = document.getElementById('btn-tpl-modal-clean-hud');
    const botCleanBtn = document.getElementById('btn-tpl-hud-clean-view');
    if (topCleanBtn) {
      topCleanBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
    }
    if (botCleanBtn) {
      botCleanBtn.style.color = isHidden ? '#38bdf8' : '';
      botCleanBtn.style.background = isHidden ? 'rgba(56, 189, 248, 0.22)' : '';
      botCleanBtn.title = isHidden ? 'Show Toolbar & Scene Bar' : 'Hide Toolbar & Scene Bar (Clean Screen)';
    }
  }

  window.tmmToggleCleanScreenHud = function (forceState) {
    const cfg = getConfig();
    const next = typeof forceState === 'boolean' ? forceState : !cfg.cleanScreenHudHidden;
    applyCleanScreenHudState(next);
  };

  function bindGlobalCleanHudButtons() {
    const topBtn = document.getElementById('btn-tpl-modal-clean-hud');
    if (topBtn && topBtn.dataset.tmmCleanBound !== '1') {
      topBtn.dataset.tmmCleanBound = '1';
      topBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.tmmToggleCleanScreenHud();
      });
    }

    const botBtn = document.getElementById('btn-tpl-hud-clean-view');
    if (botBtn && botBtn.dataset.tmmCleanBound !== '1') {
      botBtn.dataset.tmmCleanBound = '1';
      botBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.tmmToggleCleanScreenHud();
      });
    }
  }

  function buildTencentMultimediaHtml(tplId, data) {
    const id = tplId || TEMPLATE_ID;
    const cfg = getConfig(data);
    const hideHud = !!cfg.cleanScreenHudHidden;
    return `
      <div id="tencent-mmdoc-viewport-${id}" class="tmm-stage-root" style="position:absolute;inset:0;width:100%;height:100%;background:#04060d;overflow:hidden;user-select:none;">
        <style>
          .tmm-stage-scene-bar {
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
            background: rgba(9, 11, 19, 0.90);
            border: 1px solid rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65);
            max-width: 96%;
            overflow-x: auto;
          }
          .tmm-stage-scene-pill {
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
          .tmm-stage-scene-pill:hover {
            color: #f8fafc;
            background: rgba(255, 255, 255, 0.08);
          }
          .tmm-stage-scene-pill.is-active {
            background: linear-gradient(135deg, #8b5cf6, #6d28d9);
            color: #ffffff;
            border-color: rgba(196, 181, 253, 0.45);
            box-shadow: 0 2px 10px rgba(139, 92, 246, 0.45);
          }
          .tmm-stage-scene-pill.is-playing-now:not(.is-active) {
            border-color: rgba(56, 189, 248, 0.55);
            color: #38bdf8;
          }
          .tmm-restore-hud-pill {
            position: absolute;
            top: 12px;
            right: 14px;
            z-index: 42;
            display: none;
            align-items: center;
            gap: 5px;
            padding: 5px 11px;
            border-radius: 8px;
            background: rgba(15, 23, 42, 0.72);
            border: 1px solid rgba(56, 189, 248, 0.45);
            color: #e2e8f0;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(8px);
            opacity: 0.35;
            transition: opacity 0.18s ease, background 0.18s ease;
          }
          .tmm-stage-root:hover .tmm-restore-hud-pill {
            opacity: 1;
          }
          .tmm-restore-hud-pill:hover {
            background: rgba(2, 132, 199, 0.85);
            color: #ffffff;
          }
          .tmm-stage-selection-box {
            position: absolute;
            pointer-events: none;
            border: 2px dashed #38bdf8;
            border-radius: 8px;
            box-shadow: 0 0 18px rgba(56, 189, 248, 0.35), inset 0 0 12px rgba(56, 189, 248, 0.12);
            z-index: 28;
            display: none;
            transition: opacity 0.2s ease;
          }
          .tmm-stage-selection-tag {
            position: absolute;
            top: -24px;
            left: 0;
            background: #0284c7;
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 9.5px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          }
        </style>

        <!-- Interactive Scene Switcher Bar on Stage -->
        <div class="tmm-stage-scene-bar" data-role="tmm-stage-scene-bar" style="display:${hideHud ? 'none' : 'flex'};">
          <button type="button" class="tmm-stage-scene-pill ${cfg.activeSceneFilter === 'all' ? 'is-active' : ''}" data-scene-pill="all" title="Play Full 5-Scene Sequence">▶ All 5 Scenes</button>
          ${SCENES.map((sc) => `
            <button type="button" class="tmm-stage-scene-pill ${cfg.activeSceneFilter === sc.id ? 'is-active' : ''}" data-scene-pill="${sc.id}" title="${sc.title}">${sc.shortLabel}</button>
          `).join('')}
        </div>

        <!-- Subtle Floating Restore HUD Button (Only visible when Clean Screen mode is active) -->
        <button type="button" class="tmm-restore-hud-pill" data-role="tmm-restore-hud-btn" style="display:${hideHud ? 'inline-flex' : 'none'};" title="Restore Stage Toolbar &amp; Scene Bar">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>
          <span>Show HUD</span>
        </button>

        <!-- Primary 60fps Reverse-Engineered Canvas -->
        <canvas id="tencent-mmdoc-canvas-${id}" width="1280" height="720" style="width:100%;height:100%;object-fit:contain;display:block;cursor:pointer;"></canvas>

        <!-- Direct On-Stage Selection Box -->
        <div class="tmm-stage-selection-box" data-role="tmm-selection-box">
          <div class="tmm-stage-selection-tag" data-role="tmm-selection-tag">Selected Layer</div>
        </div>
      </div>
    `;
  }

  function bindStageInteractivity(container) {
    bindGlobalCleanHudButtons();
    if (!container) return;
    const root = container.querySelector('.tmm-stage-root');
    if (!root || root.dataset.tmmBound === '1') return;
    root.dataset.tmmBound = '1';

    root.querySelectorAll('.tmm-stage-scene-pill').forEach((btn) => {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sceneId = btn.getAttribute('data-scene-pill') || 'all';
        setActiveSceneFilter(sceneId);
      });
    });

    const restoreBtn = root.querySelector('[data-role="tmm-restore-hud-btn"]');
    if (restoreBtn) {
      restoreBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });
      restoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.tmmToggleCleanScreenHud(false);
      });
    }

    const canvas = root.querySelector('canvas');
    const selBox = root.querySelector('[data-role="tmm-selection-box"]');
    const selTag = root.querySelector('[data-role="tmm-selection-tag"]');

    if (canvas) {
      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const cx = (e.clientX - rect.left) * scaleX;
        const cy = (e.clientY - rect.top) * scaleY;

        let hit = null;
        for (let i = _lastStageHitBoxes.length - 1; i >= 0; i--) {
          const box = _lastStageHitBoxes[i];
          if (cx >= box.x && cx <= box.x + box.w && cy >= box.y && cy <= box.y + box.h) {
            hit = box;
            break;
          }
        }

        if (hit) {
          updateConfigKey('selectedStageObject', hit.id);
          const cfg = getConfig();
          if (selBox && selTag && !cfg.cleanScreenHudHidden) {
            selBox.style.display = 'block';
            selBox.style.left = `${(hit.x / canvas.width) * 100}%`;
            selBox.style.top = `${(hit.y / canvas.height) * 100}%`;
            selBox.style.width = `${(hit.w / canvas.width) * 100}%`;
            selBox.style.height = `${(hit.h / canvas.height) * 100}%`;
            selTag.textContent = hit.label;
            clearTimeout(selBox._hideTimer);
            selBox._hideTimer = setTimeout(() => {
              selBox.style.display = 'none';
            }, 2400);
          }
          focusInspectorCardForStageObject(hit.id);
        }
      });
    }
  }

  function applySceneCardVisibility(sceneId) {
    document.querySelectorAll('[data-scene-pill]').forEach((el) => {
      const id = el.getAttribute('data-scene-pill');
      el.classList.toggle('is-active', id === sceneId);
    });
    document.querySelectorAll('[data-inspector-scene-pill]').forEach((el) => {
      const id = el.getAttribute('data-inspector-scene-pill');
      el.classList.toggle('is-accent', id === sceneId);
      el.classList.toggle('is-active', id === sceneId);
    });
    document.querySelectorAll('[data-tmm-scene-card]').forEach((card) => {
      const cardScene = card.getAttribute('data-tmm-scene-card');
      if (sceneId === 'all' || cardScene === 'global' || cardScene === sceneId) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function setActiveSceneFilter(sceneId) {
    _soloSceneStartPerf = performance.now() - 250;
    const targetSc = SCENES.find((s) => s.id === sceneId) || SCENES[0];
    if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
      const seekSec = sceneId === 'all' ? 0.0 : (targetSc.start + 0.35);
      _lastAnimTime = seekSec;
      topCustomizerState.startTime = performance.now() - (seekSec * 1000);
      topCustomizerState.pausedElapsedMs = seekSec * 1000;
    }
    updateConfigKey('activeSceneFilter', sceneId);
    applySceneCardVisibility(sceneId);
    if (typeof window.tmmRequestRender === 'function') window.tmmRequestRender();
  }

  function focusInspectorCardForStageObject(objectId) {
    const card = document.querySelector(`[data-tmm-object-card="${objectId}"]`)
      || document.querySelector(`[data-select-stage-layer="${objectId}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.remove('rg-card-pulse-highlight');
      void card.offsetWidth;
      card.classList.add('rg-card-pulse-highlight');
    }
  }

  function tplMountTencentMultimediaStage(stageEl, data) {
    if (!stageEl) return;
    const cfg = getConfig(data);
    stageEl.innerHTML = buildTencentMultimediaHtml(TEMPLATE_ID, cfg);
    bindStageInteractivity(stageEl);
    applyCleanScreenHudState(!!cfg.cleanScreenHudHidden);
    const canvas = stageEl.querySelector(`#tencent-mmdoc-canvas-${TEMPLATE_ID}`);
    if (canvas) {
      renderTencentMultimediaCanvas(canvas, _lastAnimTime, cfg);
    }
  }

  function stepTencentMultimediaAnimation(containerEl, tplId, t, data) {
    if (!containerEl) return;
    _lastAnimTime = typeof t === 'number' ? t : 0;
    const id = tplId || TEMPLATE_ID;
    let canvas = containerEl.querySelector(`#tencent-mmdoc-canvas-${id}`) || containerEl.querySelector('canvas');
    if (!canvas) {
      containerEl.innerHTML = buildTencentMultimediaHtml(id, data);
      bindStageInteractivity(containerEl);
      canvas = containerEl.querySelector('canvas');
    } else {
      bindStageInteractivity(containerEl);
    }
    if (canvas) {
      renderTencentMultimediaCanvas(canvas, _lastAnimTime, data);
    }
  }

  window.tmmRequestRender = function () {
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (stage) {
      const canvas = stage.querySelector('canvas');
      if (canvas) renderTencentMultimediaCanvas(canvas, _lastAnimTime, getConfig());
    }
  };

  // ==========================================================================
  // 13. REGAARDER STUDIO 4-TAB INSPECTOR BUILDER (CONTENT, MOTION, LOOK, EFFECTS)
  // ==========================================================================
  function createSceneFilterHeaderBar(cfg) {
    const bar = document.createElement('div');
    bar.className = 'rg-inspector-section';
    bar.style.padding = '10px 12px';
    bar.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;">
        <span class="rg-section-title" style="font-size:11.5px;">Active Scene Focus</span>
        <span style="font-size:10px;color:#38bdf8;font-weight:700;">Click to Solo / Filter Scene</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;">
        <button type="button" class="rg-action-pill-btn ${cfg.activeSceneFilter === 'all' ? 'is-accent' : ''}" data-inspector-scene-pill="all">All 5 Scenes</button>
        ${SCENES.map((sc) => `
          <button type="button" class="rg-action-pill-btn ${cfg.activeSceneFilter === sc.id ? 'is-accent' : ''}" data-inspector-scene-pill="${sc.id}">${sc.shortLabel}</button>
        `).join('')}
      </div>
    `;
    bar.querySelectorAll('[data-inspector-scene-pill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const scId = btn.getAttribute('data-inspector-scene-pill') || 'all';
        setActiveSceneFilter(scId);
        bar.querySelectorAll('[data-inspector-scene-pill]').forEach((b) => {
          b.classList.toggle('is-accent', b.getAttribute('data-inspector-scene-pill') === scId);
        });
      });
    });
    return bar;
  }

  function createCutoutAssetRow(opts) {
    const { objectId, title, subtitle, currentUrl, defaultUri, configKey, onSelect } = opts;
    const row = document.createElement('div');
    row.className = 'rg-media-asset-row is-selectable';
    row.setAttribute('data-select-stage-layer', objectId);
    const previewSrc = currentUrl || defaultUri;

    row.innerHTML = `
      <div class="rg-media-asset-info">
        <img class="rg-media-asset-thumb" src="${previewSrc}" alt="${title}" style="background:#0b0f19;object-fit:contain;padding:2px;">
        <div class="rg-media-asset-meta">
          <span class="rg-media-asset-name">${title}</span>
          <span class="rg-media-asset-sub">${subtitle}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:5px;">
        <button type="button" class="rg-asset-replace-btn" data-role="replace-btn" title="Upload custom PNG/WebP/SVG cutout">
          <span>Replace</span>
        </button>
        <button type="button" class="rg-action-pill-btn" data-role="reset-btn" style="padding:4px 7px;font-size:10px;display:${currentUrl ? 'inline-flex' : 'none'};" title="Restore default cutout">
          Reset
        </button>
        <input type="file" accept="image/*" data-role="file-input" style="display:none;">
      </div>
    `;

    const thumbEl = row.querySelector('.rg-media-asset-thumb');
    const replaceBtn = row.querySelector('[data-role="replace-btn"]');
    const resetBtn = row.querySelector('[data-role="reset-btn"]');
    const fileInp = row.querySelector('[data-role="file-input"]');

    row.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;
      if (typeof onSelect === 'function') onSelect(objectId);
    });

    replaceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInp.click();
    });

    fileInp.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = String(ev.target.result || '');
        if (!dataUrl) return;
        getLoadedImage(dataUrl);
        updateConfigKey(configKey, dataUrl);
        thumbEl.src = dataUrl;
        resetBtn.style.display = 'inline-flex';
      };
      reader.readAsDataURL(file);
    });

    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateConfigKey(configKey, '');
      thumbEl.src = defaultUri;
      resetBtn.style.display = 'none';
    });

    return row;
  }

  function createSliderControl(label, configKey, min, max, step, unit, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-Ctrl';
    const val = currentVal !== undefined ? currentVal : min;
    const pct = clamp(((Number(val) - min) / Math.max(0.0001, max - min)) * 100, 0, 100);

    wrap.innerHTML = `
      <div class="rg-slider-head">
        <span class="rg-Ctrl-label">${label}</span>
        <span class="rg-slider-val" data-role="val-badge">${Number(val).toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0)}${unit || ''}</span>
      </div>
      <div class="rg-slider-rail">
        <input type="range" class="rg-range" min="${min}" max="${max}" step="${step}" value="${val}" style="--val-pct:${pct.toFixed(1)}%;">
      </div>
    `;

    const range = wrap.querySelector('input[type="range"]');
    const badge = wrap.querySelector('[data-role="val-badge"]');
    range.addEventListener('input', () => {
      const v = parseFloat(range.value);
      const p = clamp(((v - min) / Math.max(0.0001, max - min)) * 100, 0, 100);
      range.style.setProperty('--val-pct', `${p.toFixed(1)}%`);
      badge.textContent = `${v.toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0)}${unit || ''}`;
      updateConfigKey(configKey, v);
    });

    return wrap;
  }

  function createTextControl(label, configKey, currentVal, placeholder) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-Ctrl';
    wrap.innerHTML = `
      <span class="rg-Ctrl-label">${label}</span>
      <input type="text" class="rg-input" value="${String(currentVal ?? '').replace(/"/g, '&quot;')}" placeholder="${placeholder || ''}">
    `;
    const inp = wrap.querySelector('input');
    inp.addEventListener('input', () => {
      updateConfigKey(configKey, inp.value);
    });
    return wrap;
  }

  function createColorControl(label, configKey, currentHex) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-Ctrl';
    const hex = currentHex || '#d91b24';
    wrap.innerHTML = `
      <div class="rg-color-row">
        <span class="rg-Ctrl-label" style="margin:0;">${label}</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="rg-color-hex" data-role="hex-label">${hex}</span>
          <span class="rg-color-well" style="background:${hex};">
            <input type="color" value="${hex}">
          </span>
        </div>
      </div>
    `;
    const inp = wrap.querySelector('input[type="color"]');
    const well = wrap.querySelector('.rg-color-well');
    const hexLab = wrap.querySelector('[data-role="hex-label"]');
    inp.addEventListener('input', () => {
      well.style.background = inp.value;
      hexLab.textContent = inp.value;
      updateConfigKey(configKey, inp.value);
    });
    return wrap;
  }

  function createSelectControl(label, configKey, options, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-Ctrl';
    wrap.innerHTML = `
      <span class="rg-Ctrl-label">${label}</span>
      <select class="rg-select">
        ${options.map((opt) => `<option value="${opt.value}" ${opt.value === currentVal ? 'selected' : ''}>${opt.label}</option>`).join('')}
      </select>
    `;
    const sel = wrap.querySelector('select');
    sel.addEventListener('change', () => {
      updateConfigKey(configKey, sel.value);
    });
    return wrap;
  }

  function createToggleControl(label, configKey, currentBool) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-Ctrl';
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;">
        <span class="rg-Ctrl-label" style="margin:0;">${label}</span>
        <input type="checkbox" ${currentBool ? 'checked' : ''} style="width:16px;height:16px;accent-color:#8b5cf6;cursor:pointer;">
      </div>
    `;
    const chk = wrap.querySelector('input[type="checkbox"]');
    chk.addEventListener('change', () => {
      updateConfigKey(configKey, chk.checked);
    });
    return wrap;
  }

  /**
   * Builds a dedicated per-company Inspector Section for Scene 4 so that:
   * 1) Logo + Text Lockup are grouped as one unit, while
   * 2) The Text ("Apple" / "Microsoft" / "Google") and
   * 3) The Red Brush Stroke ("the red little thing") + its Timing are separately customizable!
   */
  function buildCompanyLockupInspectorCard(cfg, idx, objectId, defaultUri) {
    const prefix = `company${idx}`;
    const compName = cfg[`${prefix}Name`] || ['Apple', 'Microsoft', 'Google'][idx - 1];
    const card = document.createElement('div');
    card.className = 'rg-inspector-section';
    card.setAttribute('data-tmm-scene-card', 'scene4');
    card.setAttribute('data-tmm-object-card', objectId);

    const brushStyleOptions = [
      { value: 'authentic_tapered', label: 'Authentic Tapered Red Brush Swipe (Original Frame)' },
      { value: 'dry_bristle', label: 'Dry Acrylic Bristle Streak' },
      { value: 'rounded_pill', label: 'Smooth Rounded Marker Pill' },
      { value: 'hidden', label: 'Hidden (No Red Brush)' }
    ];

    card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Company #${idx}: ${compName} (Logo + Text Lockup & Red Brush)</span>
        <span class="rg-section-subtitle">The Logo + Text reveal together as one unit; customize Logo, Text, and Red Brush + Timing separately.</span>
      </div>
    `;

    // 1. Logo Cutout Asset
    card.appendChild(createCutoutAssetRow({
      objectId,
      title: `Company #${idx} Logo Cutout (${compName})`,
      subtitle: 'Unified with text below • Click to solo Scene 4',
      currentUrl: cfg[`${prefix}CutoutUrl`],
      defaultUri,
      configKey: `${prefix}CutoutUrl`,
      onSelect: () => setActiveSceneFilter('scene4')
    }));

    // 2. Separate Text Customization ("Apple", "Microsoft", "Google")
    card.appendChild(createTextControl(`Company #${idx} Text Label`, `${prefix}Name`, cfg[`${prefix}Name`], compName));
    card.appendChild(createSliderControl(`${compName} Text Size Scale`, `${prefix}TextScale`, 0.6, 1.6, 0.05, 'x', cfg[`${prefix}TextScale`]));
    card.appendChild(createSliderControl(`Logo-to-Text Vertical Gap`, `${prefix}TextGapPx`, 0, 36, 1, 'px', cfg[`${prefix}TextGapPx`]));

    // 3. Separate Red Brush Stroke ("The Red Little Thing") Design, Size & Timing
    card.appendChild(createSelectControl(`${compName} Red Brush Design`, `${prefix}BrushStyle`, brushStyleOptions, cfg[`${prefix}BrushStyle`]));
    card.appendChild(createColorControl(`${compName} Red Brush Color`, `${prefix}BrushColor`, cfg[`${prefix}BrushColor`]));
    card.appendChild(createSliderControl(`${compName} Red Brush Width`, `${prefix}BrushWidthScale`, 0.6, 1.6, 0.05, 'x', cfg[`${prefix}BrushWidthScale`]));
    card.appendChild(createSliderControl(`${compName} Red Brush Height`, `${prefix}BrushHeightScale`, 0.6, 1.6, 0.05, 'x', cfg[`${prefix}BrushHeightScale`]));

    // 4. Independent Per-Company Timing (When Logo+Text appears vs. when Red Brush swipes in)
    card.appendChild(createSliderControl(`${compName} Lockup Entrance Time`, `${prefix}StartTime`, 0.0, 0.75, 0.02, 's', cfg[`${prefix}StartTime`]));
    card.appendChild(createSliderControl(`${compName} Red Brush Delay (After Text)`, `${prefix}BrushDelay`, 0.0, 0.35, 0.02, 's', cfg[`${prefix}BrushDelay`]));

    return card;
  }

  window.tplBuildTencentMultimediaRegaarderPanes = function (panes, advDrawer) {
    if (!panes || !panes.content || !panes.motion || !panes.look || !panes.effects) return;
    const cfg = getConfig();

    Object.values(panes).forEach((p) => { if (p) p.innerHTML = ''; });
    if (advDrawer) advDrawer.innerHTML = '';

    panes.content.appendChild(createSceneFilterHeaderBar(cfg));

    // ========================================================================
    // TAB 1: CONTENT TAB (COMPANY LOCKUPS + SEPARATE TEXT & RED BRUSH CONTROLS)
    // ========================================================================
    panes.content.appendChild(buildCompanyLockupInspectorCard(cfg, 1, 'company_apple', DEFAULT_CUTOUT_URIS.appleLogo));
    panes.content.appendChild(buildCompanyLockupInspectorCard(cfg, 2, 'company_microsoft', DEFAULT_CUTOUT_URIS.microsoftLogo));
    panes.content.appendChild(buildCompanyLockupInspectorCard(cfg, 3, 'company_google', DEFAULT_CUTOUT_URIS.googleLogo));

    // Scene 4 Background Blurred Fragments Card
    const sc4BgCard = document.createElement('div');
    sc4BgCard.className = 'rg-inspector-section';
    sc4BgCard.setAttribute('data-tmm-scene-card', 'scene4');
    sc4BgCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Scene 4 Background: Blurred Floating Fragments & 3D Mesh</span>
        <span class="rg-section-subtitle">Out-of-focus fluttering fragments and full-screen 3D low-poly triangle network.</span>
      </div>
    `;
    sc4BgCard.appendChild(createCutoutAssetRow({
      objectId: 'dollar_bill',
      title: 'Out-of-Focus Blurred Floating Fragment',
      subtitle: 'Softly blurred 3D tumbling background fragments',
      currentUrl: cfg.dollarBillCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.dollarBill,
      configKey: 'dollarBillCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene4')
    }));
    sc4BgCard.appendChild(createSliderControl('Floating Fragment Blur / Size Scale', 'dollarBlurSoftness', 0.4, 2.0, 0.05, 'x', cfg.dollarBlurSoftness));
    sc4BgCard.appendChild(createSliderControl('Floating Fragment Count', 'dollarBillCount', 0, 35, 1, '', cfg.dollarBillCount));
    panes.content.appendChild(sc4BgCard);

    // --- SCENE 2 CARD: RISING FIRE PIT & 4-STAGE 2.5D POLAROID CUTOUTS ---
    const sc2Card = document.createElement('div');
    sc2Card.className = 'rg-inspector-section';
    sc2Card.setAttribute('data-tmm-scene-card', 'scene2');
    sc2Card.setAttribute('data-tmm-object-card', 'polaroid_subject');
    sc2Card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Scene 2: 4-Stage 2.5D Polaroid Cutouts & Rising Fire</span>
        <span class="rg-section-subtitle">Solo any of the 4 Polaroid beats (Podium, Red Goggles Woman, Puppeteer Hands, Binary Eye) or replace cutouts.</span>
      </div>
    `;
    sc2Card.appendChild(createSelectControl('Active Polaroid Sub-Beat Mode', 'polaroidBeatMode', [
      { value: 'all_4_beats', label: 'Play All 4 Polaroid Beats Sequentially (Frames 141–197)' },
      { value: 'beat_2a_podium', label: 'Solo Beat 2A: Conference Stage & Podium (Tencent 腾讯)' },
      { value: 'beat_2b_goggles', label: 'Solo Beat 2B: Woman in Red "T T" Goggles + Paparazzi Crowd' },
      { value: 'beat_2c_puppeteer', label: 'Solo Beat 2C: Vertical Crimson Portrait + Puppeteer Hands' },
      { value: 'beat_2d_binary_eye', label: 'Solo Beat 2D: Warped Binary Surveillance Eye + Neon "T" Iris' }
    ], cfg.polaroidBeatMode));

    sc2Card.appendChild(createCutoutAssetRow({
      objectId: 'polaroid_podium',
      title: 'Beat 2A: Conference Podium & 3D Tencent Cutout',
      subtitle: 'Stage silhouettes, white podium & 3D floor sign',
      currentUrl: cfg.polaroidPodiumCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.polaroidPodium,
      configKey: 'polaroidPodiumCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene2')
    }));
    sc2Card.appendChild(createTextControl('Beat 2A Stage Banner Text', 'polaroidBannerText', cfg.polaroidBannerText, '中国智慧交通生态联盟 正式启动'));

    sc2Card.appendChild(createCutoutAssetRow({
      objectId: 'polaroid_goggles',
      title: 'Beat 2B: Woman in Red "T T" Ski Goggles (1.15x)',
      subtitle: 'Foreground portrait cutout popping out of Polaroid',
      currentUrl: cfg.polaroidGogglesCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.polaroidGogglesWoman,
      configKey: 'polaroidGogglesCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene2')
    }));
    sc2Card.appendChild(createCutoutAssetRow({
      objectId: 'polaroid_bg',
      title: 'Beat 2B: B&W Smartphone Paparazzi Crowd (0.4x)',
      subtitle: 'Background hands holding smartphones inside Polaroid',
      currentUrl: cfg.polaroidBgCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.polaroidBg,
      configKey: 'polaroidBgCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene2')
    }));
    sc2Card.appendChild(createTextControl('Beat 2B Red Goggles Lens Emblem', 'polaroidVisorText', cfg.polaroidVisorText, 'T  T'));

    sc2Card.appendChild(createCutoutAssetRow({
      objectId: 'polaroid_subject',
      title: 'Beat 2C: Vertical Crimson Suit Portrait (1.15x)',
      subtitle: 'Executive suit & red tie portrait with golden crest',
      currentUrl: cfg.polaroidSubjectCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.polaroidSubject,
      configKey: 'polaroidSubjectCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene2')
    }));
    sc2Card.appendChild(createCutoutAssetRow({
      objectId: 'polaroid_hands',
      title: 'Beat 2C: Puppeteer Hands & Golden Circuit Traces (1.85x)',
      subtitle: 'Foreground hands pulling golden circuit strings from fire',
      currentUrl: cfg.polaroidHandsCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.polaroidHands,
      configKey: 'polaroidHandsCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene2')
    }));

    sc2Card.appendChild(createCutoutAssetRow({
      objectId: 'polaroid_binary_eye',
      title: 'Beat 2D: Warped Binary Surveillance Eye + Neon "T" Iris',
      subtitle: 'Binary code eyelids, red iris & glowing yellow-green T',
      currentUrl: cfg.polaroidBinaryEyeCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.polaroidBinaryEye,
      configKey: 'polaroidBinaryEyeCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene2')
    }));
    sc2Card.appendChild(createTextControl('Polaroid Frame Bottom Caption', 'polaroidCaption', cfg.polaroidCaption, 'TENCENT 腾讯 // SHADOW EMPIRE'));
    panes.content.appendChild(sc2Card);

    // --- SCENE 3 CARD: GOOGLE TYPEWRITER, "PEOPLE ALSO ASK" & 4 SERP CARDS ---
    const sc3Card = document.createElement('div');
    sc3Card.className = 'rg-inspector-section';
    sc3Card.setAttribute('data-tmm-scene-card', 'scene3');
    sc3Card.setAttribute('data-tmm-object-card', 'google_search_bar');
    sc3Card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Scene 3: Google Typewriter, "People Also Ask" & 4 SERP Cards</span>
        <span class="rg-section-subtitle">Edit the Google logo, search query, buttons, People Also Ask questions, and all 4 SERP results.</span>
      </div>
    `;
    sc3Card.appendChild(createTextControl('Search Engine Header Logo', 'googleLogoTitle', cfg.googleLogoTitle, 'Google'));
    sc3Card.appendChild(createTextControl('Typed Search Query Text', 'searchQueryText', cfg.searchQueryText, "THE WORLD'S MOST VALUABLE COMPANIES"));
    sc3Card.appendChild(createTextControl('Left Search Button Label', 'googleButton1Text', cfg.googleButton1Text, 'Google Search'));
    sc3Card.appendChild(createTextControl('Right Search Button Label', 'googleButton2Text', cfg.googleButton2Text, "I'm Feeling Lucky"));
    sc3Card.appendChild(createCutoutAssetRow({
      objectId: 'subliminal_flash',
      title: 'Subliminal 1-Frame Dark Cutout Flash',
      subtitle: 'Flashes for 1 frame during search typing',
      currentUrl: cfg.subliminalCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.subliminalCutout,
      configKey: 'subliminalCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene3')
    }));
    sc3Card.appendChild(createTextControl('Accordion Header ("People also ask")', 'paaHeaderTitle', cfg.paaHeaderTitle, 'People also ask'));
    sc3Card.appendChild(createTextControl('People Also Ask Question #1', 'paaQ1', cfg.paaQ1));
    sc3Card.appendChild(createTextControl('People Also Ask Question #2', 'paaQ2', cfg.paaQ2));
    sc3Card.appendChild(createTextControl('People Also Ask Question #3', 'paaQ3', cfg.paaQ3));
    sc3Card.appendChild(createTextControl('People Also Ask Question #4', 'paaQ4', cfg.paaQ4));
    sc3Card.appendChild(createTextControl('SERP Result #1 Title (Business Plus)', 'serpResult1Title', cfg.serpResult1Title));
    sc3Card.appendChild(createTextControl('SERP Result #2 Title (Visual Capitalist)', 'serpResult2Title', cfg.serpResult2Title));
    sc3Card.appendChild(createTextControl('SERP Result #3 Title (Investopedia)', 'serpResult3Title', cfg.serpResult3Title));
    sc3Card.appendChild(createTextControl('SERP Result #4 Title (Statista)', 'serpResult4Title', cfg.serpResult4Title));
    panes.content.appendChild(sc3Card);

    // --- SCENE 1 CARD: POP-UP BLUE/WHITE TENCENT "T" BADGES ---
    const sc1Card = document.createElement('div');
    sc1Card.className = 'rg-inspector-section';
    sc1Card.setAttribute('data-tmm-scene-card', 'scene1');
    sc1Card.setAttribute('data-tmm-object-card', 'scene1_badge');
    sc1Card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Scene 1: Pop-Up Blue/White Tencent "T" Badges</span>
        <span class="rg-section-subtitle">Customize the circular badge cutout, emblem character, and badge count.</span>
      </div>
    `;
    sc1Card.appendChild(createCutoutAssetRow({
      objectId: 'scene1_badge',
      title: 'Pop-Up White/Blue "T" Badge Cutout',
      subtitle: 'Crisp white disc with sky-blue border & italic T',
      currentUrl: cfg.badgeCutoutUrl,
      defaultUri: DEFAULT_CUTOUT_URIS.tBadge,
      configKey: 'badgeCutoutUrl',
      onSelect: () => setActiveSceneFilter('scene1')
    }));
    sc1Card.appendChild(createTextControl('Badge Center Emblem Character', 'badgeSymbol', cfg.badgeSymbol, 'T'));
    sc1Card.appendChild(createTextControl('Badge Sub-Label Text', 'badgeSubLabel', cfg.badgeSubLabel, 'TENCENT'));
    sc1Card.appendChild(createSliderControl('Badge Pop-Up Count', 'badgeCount', 1, 4, 1, '', cfg.badgeCount));
    panes.content.appendChild(sc1Card);

    // --- SCENE 5 CARD: 3D GLOBAL MARKET CAP LEADERBOARD TABLE (8 ROWS) ---
    const sc5Card = document.createElement('div');
    sc5Card.className = 'rg-inspector-section';
    sc5Card.setAttribute('data-tmm-scene-card', 'scene5');
    sc5Card.setAttribute('data-tmm-object-card', 'leaderboard_table');
    sc5Card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Scene 5: 3D Global Market Cap Leaderboard (Frame 410)</span>
        <span class="rg-section-subtitle">Edit company names, tickers, market caps, and share prices across all 8 rows.</span>
      </div>
    `;
    sc5Card.appendChild(createTextControl('Leaderboard Header Title', 'tableHeaderTitle', cfg.tableHeaderTitle));
    sc5Card.appendChild(createTextControl('Row #1 Company & Cap (Apple)', 'tableRow1Name', cfg.tableRow1Name));
    sc5Card.appendChild(createTextControl('Row #1 Market Cap', 'tableRow1Cap', cfg.tableRow1Cap));
    sc5Card.appendChild(createTextControl('Row #2 Company (Saudi Aramco)', 'tableRow2Name', cfg.tableRow2Name));
    sc5Card.appendChild(createTextControl('Row #3 Company (Microsoft)', 'tableRow3Name', cfg.tableRow3Name));
    sc5Card.appendChild(createTextControl('Row #4 Company (Alphabet/Google)', 'tableRow4Name', cfg.tableRow4Name));
    sc5Card.appendChild(createTextControl('Row #5 Company (Amazon)', 'tableRow5Name', cfg.tableRow5Name));
    sc5Card.appendChild(createTextControl('Row #6 Company (Berkshire Hathaway)', 'tableRow6Name', cfg.tableRow6Name));
    sc5Card.appendChild(createTextControl('Row #7 Company (Visa)', 'tableRow7Name', cfg.tableRow7Name));
    sc5Card.appendChild(createTextControl('Row #8 Company (Tencent / Exxon)', 'tableRow8Name', cfg.tableRow8Name));
    sc5Card.appendChild(createSliderControl('Highlighted Leaderboard Row #', 'tableHighlightRow', 1, 8, 1, '', cfg.tableHighlightRow));
    panes.content.appendChild(sc5Card);

    // ========================================================================
    // TAB 2: MOTION TAB (LOCKUP TIMING, RED BRUSH SWIPE TIMING, PARALLAX, PAN)
    // ========================================================================
    panes.motion.appendChild(createSceneFilterHeaderBar(cfg));

    const motionSc4Card = document.createElement('div');
    motionSc4Card.className = 'rg-inspector-section';
    motionSc4Card.setAttribute('data-tmm-scene-card', 'scene4');
    motionSc4Card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Company Lockups & Separate Red Brush Timing (Scene 4)</span>
        <span class="rg-section-subtitle">Adjust when each (Logo + Text) lockup appears and when its Red Brush Stroke swipes in behind the text.</span>
      </div>
    `;
    motionSc4Card.appendChild(createSelectControl('Logo + Text Lockup Reveal Mode', 'companyAnimStyle', [
      { value: 'brush_fragment_wipe', label: 'Directional 3D Fragment Wipe (Authentic Frame 349)' },
      { value: 'elastic_pop', label: '3D Elastic Spring Pop' },
      { value: 'parallax_drop', label: '2.5D Parallax Drop + Brush Swipe' },
      { value: 'flip_3d', label: '3D Coin Flip Reveal' },
      { value: 'glitch_materialize', label: 'Glitch Slice Materialize' }
    ], cfg.companyAnimStyle));
    motionSc4Card.appendChild(createSliderControl('Apple (Logo + Text) Start Time', 'company1StartTime', 0.0, 0.75, 0.02, 's', cfg.company1StartTime));
    motionSc4Card.appendChild(createSliderControl('Apple Red Brush Delay', 'company1BrushDelay', 0.0, 0.35, 0.02, 's', cfg.company1BrushDelay));
    motionSc4Card.appendChild(createSliderControl('Microsoft (Logo + Text) Start Time', 'company2StartTime', 0.0, 0.75, 0.02, 's', cfg.company2StartTime));
    motionSc4Card.appendChild(createSliderControl('Microsoft Red Brush Delay', 'company2BrushDelay', 0.0, 0.35, 0.02, 's', cfg.company2BrushDelay));
    motionSc4Card.appendChild(createSliderControl('Google (Logo + Text) Start Time', 'company3StartTime', 0.0, 0.75, 0.02, 's', cfg.company3StartTime));
    motionSc4Card.appendChild(createSliderControl('Google Red Brush Delay', 'company3BrushDelay', 0.0, 0.35, 0.02, 's', cfg.company3BrushDelay));
    motionSc4Card.appendChild(createSliderControl('Red Paint Brush Swipe Speed', 'brushSwipeSpeed', 0.4, 2.8, 0.05, 'x', cfg.brushSwipeSpeed));
    motionSc4Card.appendChild(createSliderControl('Company Lockup Master Scale', 'companyCutoutPopScale', 0.6, 1.6, 0.05, 'x', cfg.companyCutoutPopScale));
    motionSc4Card.appendChild(createSliderControl('3D Triangle Mesh Motion Speed', 'plexusRotationSpeed', 0.1, 3.0, 0.1, 'x', cfg.plexusRotationSpeed));
    motionSc4Card.appendChild(createSliderControl('Blurred Fragment Drift Speed', 'dollarFallSpeed', 0.2, 3.0, 0.1, 'x', cfg.dollarFallSpeed));
    panes.motion.appendChild(motionSc4Card);

    const motionSc2Card = document.createElement('div');
    motionSc2Card.className = 'rg-inspector-section';
    motionSc2Card.setAttribute('data-tmm-scene-card', 'scene2');
    motionSc2Card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">2.5D Polaroid Multi-Plane Parallax & Fire Rise (Scene 2)</span>
        <span class="rg-section-subtitle">Adjust differential parallax speeds between background, subject, and foreground hands.</span>
      </div>
    `;
    motionSc2Card.appendChild(createSliderControl('Background Layer Parallax (0.4x)', 'polaroidBgParallax', 0.0, 1.5, 0.05, 'x', cfg.polaroidBgParallax));
    motionSc2Card.appendChild(createSliderControl('Midground Subject Parallax (1.15x)', 'polaroidMidParallax', 0.2, 2.5, 0.05, 'x', cfg.polaroidMidParallax));
    motionSc2Card.appendChild(createSliderControl('Foreground Puppeteer Hands Parallax (1.85x)', 'polaroidFgParallax', 0.5, 3.2, 0.05, 'x', cfg.polaroidFgParallax));
    motionSc2Card.appendChild(createSliderControl('Polaroid Frame Tilt Angle', 'polaroidTiltDeg', -18, 18, 0.5, '°', cfg.polaroidTiltDeg));
    motionSc2Card.appendChild(createSliderControl('Polaroid Subject Cutout Scale', 'polaroidMidScale', 0.6, 1.6, 0.05, 'x', cfg.polaroidMidScale));
    motionSc2Card.appendChild(createSliderControl('Rising Fire Curtain Height', 'fireHeightRatio', 0.20, 0.80, 0.02, '', cfg.fireHeightRatio));
    panes.motion.appendChild(motionSc2Card);

    const motionSc35Card = document.createElement('div');
    motionSc35Card.className = 'rg-inspector-section';
    motionSc35Card.setAttribute('data-tmm-scene-card', 'global');
    motionSc35Card.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Google 2.2x Camera Pan, SERP Tilt & 3D Table (Scenes 1, 3, 5)</span>
        <span class="rg-section-subtitle">Control camera punch-in zoom, horizontal typing pan, 3D SERP tilt, and table angles.</span>
      </div>
    `;
    motionSc35Card.appendChild(createSliderControl('Scene 1 Badge Elastic Pop Bounce', 'badgePopBounce', 0.6, 2.4, 0.05, 'x', cfg.badgePopBounce));
    motionSc35Card.appendChild(createSliderControl('Scene 1 Upward Ghost-Dissolve Drift', 'badgeGhostDissolveStrength', 0.0, 2.0, 0.05, 'x', cfg.badgeGhostDissolveStrength));
    motionSc35Card.appendChild(createSliderControl('Scene 3 Camera Punch-In Zoom (Frame 253)', 'googleCameraPunchZoom', 1.0, 2.8, 0.05, 'x', cfg.googleCameraPunchZoom));
    motionSc35Card.appendChild(createSliderControl('Scene 3 Horizontal Camera Pan Tracking', 'googleCameraPanStrength', 0.0, 1.8, 0.05, 'x', cfg.googleCameraPanStrength));
    motionSc35Card.appendChild(createSliderControl('Scene 3 Google Typing Speed', 'typingSpeedMultiplier', 0.4, 2.5, 0.05, 'x', cfg.typingSpeedMultiplier));
    motionSc35Card.appendChild(createSliderControl('Scene 3 SERP 3D Tilt Angle', 'serpTiltAngleDeg', 0, 35, 1, '°', cfg.serpTiltAngleDeg));
    motionSc35Card.appendChild(createSliderControl('Scene 3 SERP Scroll Velocity', 'serpScrollSpeed', 0.4, 2.5, 0.05, 'x', cfg.serpScrollSpeed));
    motionSc35Card.appendChild(createSliderControl('Scene 5 Leaderboard 3D Pitch', 'tableTiltPitchDeg', 0, 32, 1, '°', cfg.tableTiltPitchDeg));
    motionSc35Card.appendChild(createSliderControl('Scene 5 Leaderboard 3D Roll', 'tableTiltRollDeg', -18, 18, 1, '°', cfg.tableTiltRollDeg));
    panes.motion.appendChild(motionSc35Card);

    // ========================================================================
    // TAB 3: LOOK TAB (RED BRUSH LOOK, 3D TRIANGLE SHARDS, FIRE PALETTE, THEMES)
    // ========================================================================
    const brushLookCard = document.createElement('div');
    brushLookCard.className = 'rg-inspector-section';
    brushLookCard.setAttribute('data-tmm-scene-card', 'scene4');
    brushLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Red Brush Design, Text Colors & Full-Screen 3D Mesh (Scene 4)</span>
        <span class="rg-section-subtitle">Customize each company's red brush stroke color, text color, and 3D triangle facet shading.</span>
      </div>
    `;
    brushLookCard.appendChild(createColorControl(`${cfg.company1Name} Red Brush Color`, 'company1BrushColor', cfg.company1BrushColor));
    brushLookCard.appendChild(createColorControl(`${cfg.company1Name} Text Color`, 'company1TextColor', cfg.company1TextColor));
    brushLookCard.appendChild(createColorControl(`${cfg.company2Name} Red Brush Color`, 'company2BrushColor', cfg.company2BrushColor));
    brushLookCard.appendChild(createColorControl(`${cfg.company2Name} Text Color`, 'company2TextColor', cfg.company2TextColor));
    brushLookCard.appendChild(createColorControl(`${cfg.company3Name} Red Brush Color`, 'company3BrushColor', cfg.company3BrushColor));
    brushLookCard.appendChild(createColorControl(`${cfg.company3Name} Text Color`, 'company3TextColor', cfg.company3TextColor));
    brushLookCard.appendChild(createSliderControl('Full-Screen 3D Triangle Mesh Shading', 'plexusFacetOpacity', 0.05, 0.75, 0.02, '', cfg.plexusFacetOpacity));
    brushLookCard.appendChild(createSliderControl('Foreground 3D Triangle Shard Overlay', 'plexusForegroundShardStrength', 0.0, 1.5, 0.05, 'x', cfg.plexusForegroundShardStrength));
    brushLookCard.appendChild(createSliderControl('Optional Paint Splatter Count', 'brushSplatterCount', 0, 24, 1, '', cfg.brushSplatterCount));
    panes.look.appendChild(brushLookCard);

    const firePolaroidLookCard = document.createElement('div');
    firePolaroidLookCard.className = 'rg-inspector-section';
    firePolaroidLookCard.setAttribute('data-tmm-scene-card', 'scene2');
    firePolaroidLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Fire Pit Palette & Polaroid Frame Look (Scene 2)</span>
        <span class="rg-section-subtitle">Customize fire color temperature and Polaroid frame border.</span>
      </div>
    `;
    firePolaroidLookCard.appendChild(createSelectControl('Rising Fire Color Palette', 'firePalette', [
      { value: 'classic_amber', label: 'Classic Documentary Orange / Amber Fire' },
      { value: 'crimson_hellfire', label: 'Deep Crimson / Scarlet Fire' },
      { value: 'cyber_cyan', label: 'Cyber Cyan / Blue Plasma Fire' },
      { value: 'emerald_wildfire', label: 'Emerald Green Wildfire' }
    ], cfg.firePalette));
    firePolaroidLookCard.appendChild(createColorControl('Polaroid Frame Border Color', 'polaroidFrameColor', cfg.polaroidFrameColor));
    firePolaroidLookCard.appendChild(createSliderControl('Polaroid Frame Border Width', 'polaroidBorderWidth', 6, 32, 1, 'px', cfg.polaroidBorderWidth));
    panes.look.appendChild(firePolaroidLookCard);

    const badgeSearchLookCard = document.createElement('div');
    badgeSearchLookCard.className = 'rg-inspector-section';
    badgeSearchLookCard.setAttribute('data-tmm-scene-card', 'global');
    badgeSearchLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Badge Style, Google Logo & Leaderboard Theme (Scenes 1, 3, 5)</span>
        <span class="rg-section-subtitle">Customize Scene 1 badge colors, Scene 3 Google logo style, and Scene 5 paper vs cyber theme.</span>
      </div>
    `;
    badgeSearchLookCard.appendChild(createColorControl('"T" Badge Outer Border Color', 'badgeRingColor', cfg.badgeRingColor));
    badgeSearchLookCard.appendChild(createColorControl('"T" Badge Disc Fill Color', 'badgeCoreColor', cfg.badgeCoreColor));
    badgeSearchLookCard.appendChild(createSelectControl('Google Wordmark Logo Style (Scene 3)', 'googleLogoStyle', [
      { value: 'authentic_white', label: 'Authentic Solid White Logo (Frames 201–270)' },
      { value: 'multicolor', label: 'Classic 4-Color Google Wordmark' }
    ], cfg.googleLogoStyle));
    badgeSearchLookCard.appendChild(createSelectControl('Google Search UI Theme (Scene 3)', 'googleTheme', [
      { value: 'dark', label: 'Authentic Dark Mode (#171717)' },
      { value: 'oled', label: 'Midnight OLED Black (#07080d)' },
      { value: 'light', label: 'Classic Light Mode (#ffffff)' }
    ], cfg.googleTheme));
    badgeSearchLookCard.appendChild(createColorControl('SERP Link Highlight Color', 'serpHighlightColor', cfg.serpHighlightColor));
    badgeSearchLookCard.appendChild(createSelectControl('Scene 5 Leaderboard Table Theme', 'tableStyleMode', [
      { value: 'authentic_light', label: 'Authentic Tilted Light Paper Table (Frame 410)' },
      { value: 'cyber_dark', label: 'Dark Cyber HUD Leaderboard' }
    ], cfg.tableStyleMode));
    badgeSearchLookCard.appendChild(createColorControl('Leaderboard Highlight Color', 'tableHighlightColor', cfg.tableHighlightColor));
    panes.look.appendChild(badgeSearchLookCard);

    // ========================================================================
    // TAB 4: EFFECTS TAB (GRANULAR GLITCH MATRIX, NOISE BAND, FIRE, VORTEX WARP)
    // ========================================================================
    const glitchMatrixCard = document.createElement('div');
    glitchMatrixCard.className = 'rg-inspector-section';
    glitchMatrixCard.setAttribute('data-tmm-scene-card', 'global');
    glitchMatrixCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Granular Glitch Matrix (Slice Tear, White Bars, Noise Band & RGB)</span>
        <span class="rg-section-subtitle">Fine-tune every component of the reverse-engineered horizontal slice, white tear-bar, and Frame 409 noise band glitches.</span>
      </div>
    `;
    glitchMatrixCard.appendChild(createSliderControl('Master Glitch Intensity', 'glitchMasterIntensity', 0.0, 2.5, 0.05, 'x', cfg.glitchMasterIntensity));
    glitchMatrixCard.appendChild(createSliderControl('Horizontal Block-Slice Count', 'glitchSliceCount', 4, 32, 1, ' slices', cfg.glitchSliceCount));
    glitchMatrixCard.appendChild(createSliderControl('Horizontal Slice Shift Distance', 'glitchSliceMaxShiftPx', 0, 120, 2, 'px', cfg.glitchSliceMaxShiftPx));
    glitchMatrixCard.appendChild(createSliderControl('Stark White Tear-Bar Count (Frame 193)', 'glitchWhiteTearBars', 0, 16, 1, ' bars', cfg.glitchWhiteTearBars));
    glitchMatrixCard.appendChild(createSliderControl('White Tear-Bar Max Thickness', 'glitchWhiteTearMaxHeightPx', 4, 60, 2, 'px', cfg.glitchWhiteTearMaxHeightPx));
    glitchMatrixCard.appendChild(createSliderControl('Digital Noise Band Density (Frame 409)', 'glitchNoiseBandDensity', 0.0, 1.5, 0.05, 'x', cfg.glitchNoiseBandDensity));
    glitchMatrixCard.appendChild(createSliderControl('RGB Chromatic Aberration Split', 'glitchRgbSplitPx', 0, 32, 1, 'px', cfg.glitchRgbSplitPx));
    panes.effects.appendChild(glitchMatrixCard);

    const vhsVortexFxCard = document.createElement('div');
    vhsVortexFxCard.className = 'rg-inspector-section';
    vhsVortexFxCard.setAttribute('data-tmm-scene-card', 'global');
    vhsVortexFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">VHS Wave Tear, Film Burn Flash & Zoom-Through Tunnel Warp</span>
        <span class="rg-section-subtitle">Adjust Scene 1 VHS sync wave, right-edge warm film burn, Scene 3 subliminal flash, and zoom-through warp.</span>
      </div>
    `;
    vhsVortexFxCard.appendChild(createSliderControl('VHS Horizontal Sine-Wave Amplitude', 'vhsWaveAmplitude', 0, 80, 2, 'px', cfg.vhsWaveAmplitude));
    vhsVortexFxCard.appendChild(createSliderControl('VHS Wave Frequency', 'vhsWaveFrequency', 1.0, 8.0, 0.25, 'x', cfg.vhsWaveFrequency));
    vhsVortexFxCard.appendChild(createSliderControl('Right-Side Warm Film Burn Flash (Frame 137)', 'filmBurnIntensity', 0.0, 1.5, 0.05, 'x', cfg.filmBurnIntensity));
    vhsVortexFxCard.appendChild(createToggleControl('Enable 1-Frame Subliminal Cutout Flash', 'subliminalFlashEnabled', cfg.subliminalFlashEnabled !== false));
    vhsVortexFxCard.appendChild(createSliderControl('Subliminal Flash Opacity', 'subliminalOpacity', 0.1, 1.0, 0.05, '', cfg.subliminalOpacity));
    vhsVortexFxCard.appendChild(createSliderControl('3D SERP Zoom-Through Warp Strength (Frame 325)', 'vortexWarpStrength', 0.0, 2.0, 0.05, 'x', cfg.vortexWarpStrength));
    panes.effects.appendChild(vhsVortexFxCard);

    const fireParticlesFxCard = document.createElement('div');
    fireParticlesFxCard.className = 'rg-inspector-section';
    fireParticlesFxCard.setAttribute('data-tmm-scene-card', 'global');
    fireParticlesFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Fire Turbulence, 3D Faceted Mesh & Blurred Fragments</span>
        <span class="rg-section-subtitle">Control flame intensity, ember count, vertex sparkle density, and floating fragment count.</span>
      </div>
    `;
    fireParticlesFxCard.appendChild(createSliderControl('Rising Fire Flame Intensity', 'fireIntensity', 0.0, 2.2, 0.05, 'x', cfg.fireIntensity));
    fireParticlesFxCard.appendChild(createSliderControl('Fire Flicker & Rise Speed', 'fireSpeed', 0.3, 3.0, 0.05, 'x', cfg.fireSpeed));
    fireParticlesFxCard.appendChild(createSliderControl('Rising Glowing Ember Count', 'fireEmberCount', 0, 120, 5, '', cfg.fireEmberCount));
    fireParticlesFxCard.appendChild(createSliderControl('3D Mesh Vertex Sparkle Count', 'plexusNodeCount', 10, 90, 2, '', cfg.plexusNodeCount));
    fireParticlesFxCard.appendChild(createSliderControl('Blurred Floating Fragment Count', 'dollarBillCount', 0, 35, 1, '', cfg.dollarBillCount));
    fireParticlesFxCard.appendChild(createSliderControl('CRT Scanline Overlay Opacity', 'crtScanlineOpacity', 0.0, 0.7, 0.02, '', cfg.crtScanlineOpacity));
    fireParticlesFxCard.appendChild(createSliderControl('Stage Vignette Darkness', 'vignetteStrength', 0.0, 1.0, 0.05, '', cfg.vignetteStrength));
    panes.effects.appendChild(fireParticlesFxCard);

    if (advDrawer) {
      const advCard = document.createElement('div');
      advCard.className = 'rg-inspector-section';
      advCard.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Master Sequence Timing & Layer Offsets</span>
          <span class="rg-section-subtitle">Global playback speed and fine X/Y layer offsets.</span>
        </div>
      `;
      advCard.appendChild(createSliderControl('Global Sequence Playback Speed', 'playbackSpeed', 0.3, 2.5, 0.05, 'x', cfg.playbackSpeed));
      advCard.appendChild(createSliderControl('Company 1 Vertical Offset', 'company1OffsetY', -120, 120, 2, 'px', cfg.company1OffsetY));
      advCard.appendChild(createSliderControl('Company 2 Vertical Offset', 'company2OffsetY', -120, 120, 2, 'px', cfg.company2OffsetY));
      advCard.appendChild(createSliderControl('Company 3 Vertical Offset', 'company3OffsetY', -120, 120, 2, 'px', cfg.company3OffsetY));
      advCard.appendChild(createSliderControl('Polaroid Subject X Offset', 'polaroidMidOffsetX', -120, 120, 2, 'px', cfg.polaroidMidOffsetX));
      advCard.appendChild(createSliderControl('Polaroid Subject Y Offset', 'polaroidMidOffsetY', -120, 120, 2, 'px', cfg.polaroidMidOffsetY));
      advDrawer.appendChild(advCard);
    }

    applySceneCardVisibility(cfg.activeSceneFilter || 'all');
  };

  window.tplBuildTencentMultimediaInspectorHtml = function () {
    return `<div id="tmm-inspector-root" style="display:none;"></div>`;
  };
  window.tplBindTencentMultimediaInspectorEvents = function () {
    if (typeof window.organizeUniversalTemplateControls === 'function') {
      window.organizeUniversalTemplateControls();
    }
  };

  // ==========================================================================
  // 14. GLOBAL EXPORTS
  // ==========================================================================
  window.DEFAULT_TENCENT_CUTOUT_URIS = DEFAULT_CUTOUT_URIS;
  window.buildTencentMultimediaHtml = buildTencentMultimediaHtml;
  window.tplMountTencentMultimediaStage = tplMountTencentMultimediaStage;
  window.stepTencentMultimediaAnimation = stepTencentMultimediaAnimation;
  window.renderTencentMultimediaCanvas = renderTencentMultimediaCanvas;
})();
