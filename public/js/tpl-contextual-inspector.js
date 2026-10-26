/* ==============================================================================
   REGAARDER STUDIO - CONTEXTUAL TEMPLATE INSPECTOR SUITE
   Provides granular, top-priority editing controls for all extracted document templates.
   Controls appear directly at the top of the Inspector panel.
   ============================================================================== */
(function() {
  'use strict';

  const STORE_KEY = 'magnates_tpl_contextual_store_v1';
  let localStore = {};
  try {
    localStore = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
  } catch (_) { localStore = {}; }

  if (localStore['kenburns'] && (localStore['kenburns'].caption === 'Silicon Valley, 1999' || !localStore['kenburns'].caption)) {
    localStore['kenburns'].caption = 'TOKYO · 1987';
    if (!localStore['kenburns'].image || localStore['kenburns'].image.includes('clean_mountain')) {
      localStore['kenburns'].image = '';
    }
  }

    // Reset/migrate headline-fly so broadsheet default matches Image 2 authentic newsprint
  if (localStore['headline-fly']) {
    const h = localStore['headline-fly'];
    if (h.layoutStyle === undefined || h.theme3 === 'obsidian' || h.bgColor3 === '#0f172a' || h.theme4 === 'crimson' || h.bgColor4 === '#18090c') {
      h.layoutStyle = 'broadsheet';
      h.theme1 = 'newsprint'; h.bgColor1 = '#ece6d8'; h.textColor1 = '#1a1816'; h.accentColor1 = '#b91c1c'; h.hlColor1 = '#fde047';
      h.theme2 = 'newsprint'; h.bgColor2 = '#eae4d5'; h.textColor2 = '#1a1816'; h.accentColor2 = '#9a3412'; h.hlColor2 = '#fde047';
      h.theme3 = 'newsprint'; h.bgColor3 = '#e8e2d2'; h.textColor3 = '#1a1816'; h.accentColor3 = '#0284c7'; h.hlColor3 = '#38bdf8';
      h.theme4 = 'newsprint'; h.bgColor4 = '#ece6d8'; h.textColor4 = '#1a1816'; h.accentColor4 = '#dc2626'; h.hlColor4 = '#ef4444';
      h.theme5 = 'newsprint'; h.bgColor5 = '#f6f2e8'; h.textColor5 = '#0a0a0a'; h.accentColor5 = '#b91c1c'; h.hlColor5 = '#facc15';
      h.font1 = "'Playfair Display', Georgia, serif";
      h.font2 = "'Playfair Display', Georgia, serif";
      h.font3 = "'Playfair Display', Georgia, serif";
      h.font4 = "'Playfair Display', Georgia, serif";
      h.font5 = "'Playfair Display', Georgia, serif";
      h.date4 = 'OCT 28, 2026';
      h.dofBokeh = true;
      h.dofBlur = 9;
      h.paperGrain = 42;
    }
  }

  if (localStore['vhs'] && (!localStore['vhs'].bgMediaUrl || localStore['vhs'].bgMediaUrl === '')) {
    localStore['vhs'].bgMediaUrl = '/vhs_summer_1989_bg.jpg';
    localStore['vhs'].bgMediaType = 'image';
    localStore['vhs'].feedUrl = '/vhs_summer_1989_bg.jpg';
  }

  // Migrate checklist so items appear with blur and unblur one-by-one to 0px sharp by default
  if (localStore['checklist'] && !localStore['checklist']._migratedSequentialUnblurV3) {
    localStore['checklist'].blurMode = 'sequential';
    localStore['checklist'].entryBlurPx = 6.5;
    localStore['checklist'].unblurDurationSec = 0.55;
    localStore['checklist'].unblurStaggerSec = 0.32;
    localStore['checklist'].depthOfField = false;
    localStore['checklist'].globalBlurPx = 0;
    localStore['checklist'].activeFocusIndex = -1;
    localStore['checklist'].fallMotionBlurPx = 6.5;
    if (Array.isArray(localStore['checklist'].items)) {
      localStore['checklist'].items.forEach((it) => {
        it.blurPx = 0;
        if (it.unblurDelayOffsetSec === undefined) it.unblurDelayOffsetSec = 0;
      });
    }
    localStore['checklist']._migratedSequentialUnblurV3 = true;
  }

  // Migrate Google Search Typing UI to Reference Image 3 defaults (65% width centered, aurora enabled, front-facing)
  if (localStore['google'] && !localStore['google']._migratedRefImage3V3) {
    localStore['google'].widthPercent = 65;
    localStore['google'].sizePreset = 'standard';
    localStore['google'].lockAspectRatio = true;
    localStore['google'].auroraEnabled = true;
    localStore['google'].auroraIntensity = 90;
    localStore['google'].tiltX = 0;
    localStore['google'].tiltY = 0;
    localStore['google'].posX = 0;
    localStore['google'].posY = 0;
    localStore['google'].scale = 1;
    localStore['google'].rotation = 0;
    localStore['google']._migratedRefImage3V3 = true;
  }

  // Migrate Cinematic Progress HUD to Reference Image 4 (Direction A: Premium Documentary)
  if (localStore['progress'] && !localStore['progress']._migratedRefImage4V3) {
    localStore['progress'].stylePreset = 'documentary';
    localStore['progress'].eyebrow = 'PROJECT FUNDING';
    localStore['progress'].title = 'Funding Progress';
    localStore['progress'].phaseLabel = 'Phase 2 of 3';
    localStore['progress'].phaseStatus = 'Active';
    localStore['progress'].percent = '74%';
    localStore['progress'].calloutSublabel = 'of target';
    localStore['progress'].raisedValue = '$74,000,000';
    localStore['progress'].raisedLabel = 'Raised';
    localStore['progress'].targetValue = '$100,000,000';
    localStore['progress'].targetLabel = 'Target';
    localStore['progress'].gradientStart = '#7c3aed';
    localStore['progress'].gradientEnd = '#38bdf8';
    localStore['progress'].barWidthPercent = 70;
    localStore['progress'].barThickness = 12;
    localStore['progress']._migratedRefImage4V3 = true;
  }

  function persistStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(localStore));
    } catch (_) {}
  }
  window.tplSaveContextualStore = persistStore;

  // --- 1. DEFAULT DATA CONFIGURATIONS FOR ALL 50 EXTRACTED TEMPLATES ---
  const DEFAULTS = {
    // Photorealistic 3D Investigative Evidence Envelope Engine
    'conspiracy-board': Object.assign({}, (typeof window !== 'undefined' && window.RED_STRING_3D_CONFIG) || {
      type: 'conspiracy-board',
      node0Label: 'Target A',
      node0Sub: 'Lead Architect',
      node0Photo: '/ceo_portrait_cutout.jpg',
      node1Label: 'Key Witness',
      node1Sub: 'Former CFO',
      node1Photo: '/portrait_cutout_clean.png',
      node2Label: 'Photo #3',
      node2Sub: 'Boardroom Meet',
      node2Photo: '/boardroom_scene_hd_thumb.jpg',
      node3Label: 'Suspect 2',
      node3Sub: 'Offshore Escrow',
      node3Photo: '/interview_cutin_cinematic.jpg',
      node4Label: 'Alibi',
      node4Sub: 'Foreign Accounts',
      node4Photo: '/creator_portrait_cutout.png',
      yarnColor: '#c81e1e',
      yarnTension: 0.72,
      yarnRadius: 2.2,
      yarnStyle: 'crimson_braided',
      pinFinish: 'vintage_brass',
      corkStyle: 'warm_cork',
      cameraPreset: 'cinematic_30',
      cameraTilt: 28.0,
      cameraGlide: true,
      pinStrikeShake: true
    }),

    'jani-countdown-panic-suite': {
      type: 'jani-countdown-panic-suite',
      title: 'FTX LIQUIDITY CRASH',
      quote: '"And in less than 48 hours... $32 Billion vanished into thin air."',
      tickerText: '$FTT -94.2%  |  BTC $15,820 (-22.4%)  |  BINANCE WITHDRAWALS PAUSED  |  $ETH $1,080 (-28.9%)  |  ALAMEDA RESEARCH BANKRUPT',
      tickerEnabled: true,
      totalDuration: 10,
      displayMode: 'tminus',
      stylePreset: 'neon-red',
      vignetteIntensity: 80,
      crtEnabled: true,
      shakeEnabled: true,
      customBgImage: null,
      customBgUrl: ''
    },

    'pyramid-scheme': Object.assign({}, (typeof window !== 'undefined' && window.PYRAMID_COLLAPSE_CONFIG) || {
      type: 'pyramid-scheme',
      is3DMode: true,
      styleMode: 'concrete',
      actionEffect: 'crumble',
      crumbleSpeed: 1.0,
      collapseIntensity: 0.85,
      debrisCount: 45,
      dustIntensity: 1.0
    }),

    'deal-term-sheet': Object.assign({}, (typeof window !== 'undefined' && window.DEAL_TERM_SHEET_CONFIG) || {
      type: 'deal-term-sheet',
      is3DMode: true,
      cameraPitch: 29,
      cameraYaw: -13,
      title: 'TERM SHEET \u00b7 SERIES A',
      confidentialBadge: 'STRICTLY CONFIDENTIAL \u00b7 FOR DISCUSSION ONLY',
      companyName: 'ACME CORP / ATLAS VENTURES',
      dateText: 'October 24, 2024 \u00b7 Wilmington, Delaware',
      preamble: 'The undersigned parties enter into this binding Term Sheet setting forth the principal terms of the Series A Preferred Stock financing in accordance with Section 4(a)(2) of the Securities Act of 1933.',
      dealTerms: [
        { id: 'term-1', label: 'Valuation:', value: '$80M pre-money', highlighted: true, color: '#facc15' },
        { id: 'term-2', label: 'Investment:', value: '$12M for 15%', highlighted: true, color: '#facc15' },
        { id: 'term-3', label: 'Board Seats:', value: '2 Investor, 3 Founder', highlighted: false, color: '#4ade80' },
        { id: 'term-4', label: 'Liquidation Pref:', value: '1x Non-Participating', highlighted: false, color: '#38bdf8' },
        { id: 'term-5', label: 'Option Pool:', value: '10% Unallocated Post-Closing', highlighted: false, color: '#f43f5e' }
      ],
      valuationText: 'Valuation: $80M pre-money',
      investmentText: 'Investment: $12M for 15%',
      boardSeatsText: 'Board seats: 2 investor, 3 founder',
      liquidationPrefText: 'Liquidation pref: 1x non-participating',
      clause2: '2. The definitive agreements shall contain customary representations, warranties and covenants. All intellectual property of the company shall be fully assigned to the corporation upon closing.',
      clause3: '3. The fountain pen ink shall constitute binding execution upon delivery to legal escrow under Delaware Law.',
      signatureLabel: 'Authorized Signature,',
      signeeName: 'Alexander Vance',
      signeeTitle: 'CEO & Managing Partner',
      inkColor: '#1e293b',
      stamp1Text: 'DEAL CLOSED',
      stamp1Color: '#b91c1c',
      stamp1Angle: -14,
      stamp2Text: 'APPROVED',
      stamp2Color: '#b91c1c',
      stamp2Angle: -16,
      showStamp1: true,
      showStamp2: true,
      paperTone: '#f5f0e1',
      highlighterColor: '#facc15',
      surfaceType: 'mahogany',
      cameraPreset: 'macro_cinematic',
      duration: 5.0
    }),

    'scam-redaction': Object.assign({}, (typeof window !== 'undefined' && window.FRAUD_DOSSIER_CONFIG) || {
      type: 'scam-redaction',
      title: 'INTERNAL MEMO \u00b7 EYES ONLY',
      titleColor: '#3a2418',
      recipient: 'To: Board of Directors',
      recipientColor: '#3a2418',
      senderLabel: 'From:',
      senderRedacted: 'Alexander Vance, CFO',
      senderColor: '#3a2418',
      redactionColor: '#111111',
      showRedaction: true,
      subjectLine1: 'Re: Q3 revenue booked via',
      subjectLine2: 'side letters totaling',
      subjectColor: '#3a2418',
      highlightedAmount: '$8.4 BILLION',
      highlighterColor: '#facc15',
      showHighlighter: true,
      disclosureWarning: 'DO NOT DISCLOSE.',
      warningColor: '#ef4444',
      showWarning: true,
      stampText: 'CONFIDENTIAL',
      stampColor: '#c1121f',
      stampAngle: -14,
      showStamp: true,
      paperTone: '#fbf8ef',
      paperBrightness: 100,
      paperContrast: 105,
      backgroundBlur: 1.5,
      floatingMotion: true,
      floatAmplitude: 100,
      floatSpeed: 1.0,
      investigationHeader: 'INVESTIGATION // FILE 904',
      investigationSubject: 'SUBJECT: OFF-BALANCE SHEET LIABILITIES',
      investigationExhibit: 'EXHIBIT D-4: REVENUE COMMINGLING',
      investigationSeal: 'SUBPOENA VERIFIED',
      topSecretHeader: 'TOP SECRET',
      topSecretClassifier: 'LEVEL 4 CLASSIFIED \u00b7 OIG AUDIT',
      contractHeader: 'CONTRACT',
      contractLine1: 'WHEREAS Corporation executed side covenants;',
      contractLine2: 'NOW THEREFORE undisclosed considerations apply;',
      showContractSignature: true,
      surfaceType: 'mahogany',
      spotlightIntensity: 2.2,
      volumetricDust: true,
      showCoordinateGrid: true,
      tiltAngleX: 29,
      tiltAngleY: -10,
      coverageScale: 62,
      is3DMode: false,
      duration: 5.0
    }),

    'envelope-open': Object.assign({}, (typeof window !== 'undefined' && window.ENVELOPE_3D_CONFIG) || {
      type: 'envelope-open',
      envelopeStyle: 'manila_classified',
      stampText: 'CLASSIFIED: FBI INVESTIGATION',
      caseNumber: 'CASE FILE: #2026-X-8842',
      letterHeadline: 'CONFIDENTIAL MEMORANDUM',
      letterSubhead: 'SUBJECT: PROJECT IRIS - SPECIAL ACCESS REQUIRED',
      paperTone: '#d9ab6a',
      letterPaperTone: '#f7f4ea',
      stampColor: '#b91c1c',
      stringTieEnabled: true,
      surfaceType: 'mahogany',
      cameraPreset: 'macro_cinematic',
      slideDistance: 78,
      flapOpenAngle: 168
    }),

    // Photorealistic 3D Paper Currency Stack ($100 US Dollars with Kraft Bands)
    'wire-transfer': Object.assign({}, (typeof window !== 'undefined' && window.WIRE_TRANSFER_CONFIG) || {
      type: 'wire-transfer',
      originTitle: 'ORIGIN /',
      originSubtitle: 'Cayman Islands Branch',
      originIban: 'IBAN / XXXX-XXXX-XXXX-XXXX-8003',
      originSwift: 'SWIFT code  1234568',
      originBankLogo: 'SWIFT',
      destBadge: 'Shell Corp',
      destTitle: 'Destination Account',
      destAccountNum: '#8492',
      transferAmount: 2500000.00,
      destCurrencySymbol: String.fromCharCode(36),
      destPrefix: '+',
      statusAlert: 'Balance counter alert',
      beamSpeed: 1.25,
      beamGlowColor: '#7dd3fc',
      beamCoreColor: '#ffffff',
      particleCount: 160,
      impactPulseEnabled: true,
      counterSpeed: 1.0,
      cameraTiltY: 18.0,
      cameraTiltX: 6.0,
      cameraDistance: 440,
      dofBlur: 0.85,
      tacticalGridEnabled: true,
      matrixTelemetryEnabled: true,
      vignetteIntensity: 0.75,
      styleMode: 'investigative_hud'
    }),
    'money-stack': Object.assign({}, (typeof window !== 'undefined' && window.MONEY_STACK_CONFIG) || {
      type: 'money-stack',
      stackCount: 3,
      denomination: '100',
      currencyStyle: 'usd_100',
      bandStamp: 'TEN THOUSAND',
      bandColor: '#cfb284',
      agedPaperTone: '#eae5d4',
      bundleThickness: 12.0,
      billLayerDetail: 95,
      animMode: 'drop_settle',
      dropSpeed: 1.15,
      bounceStrength: 1.25,
      settleOrganicTilt: true,
      macroDriftEnabled: true,
      billFlutterEnabled: true,
      cameraPreset: 'macro_35',
      cameraPitch: 32.0,
      cameraYaw: -28.0,
      cameraDistance: 310,
      dofBlur: 0.85,
      fov: 34,
      surfaceType: 'vault_steel',
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
      duration: 5.0
    }),
    'adidas-puma-cosmic-earth-suite': Object.assign({}, (typeof window !== 'undefined' && window.ADIDAS_PUMA_COSMIC_EARTH_CONFIG) || {
      type: 'adidas-puma-cosmic-earth-suite',
      activePhase: 'all',
      inspectorTab: 'logos',
      duration: 12.0
    }),
    'tencent-shadow-giant-multimedia': Object.assign({}, (typeof window !== 'undefined' && window.TENCENT_MULTIMEDIA_DOC_CONFIG) || {
      type: 'tencent-shadow-giant-multimedia',
      renderMode: 'hybrid',
      activeAct: 'all',
      inspectorTab: 'glitch',
      duration: 17.5
    }),
    'jani-spin-flash-glitch-reveal': Object.assign({}, (typeof window !== 'undefined' && window.JANI_SPIN_FLASH_GLITCH_CONFIG) || {
      type: 'jani-spin-flash-glitch',
      moodPreset: 'investigative_expose',
      subject1Url: '/interview_cutin_cinematic.jpg',
      sub1Zoom: 1.68,
      sub1FocalX: 57,
      sub1FocalY: 32,
      subject2Url: '/cinematic_split_scene.jpg',
      sub2Zoom: 1.28,
      sub2FocalX: 50,
      sub2FocalY: 34,
      flashlightColor: '#38bdf8',
      flashlightColorIntensity: 72,
      flashBrilliance: 225,
      flashlightRadius: 64,
      flashlightFalloff: 60,
      slowFlashStart: 0.52,
      slowFlashDuration: 0.68,
      fastFlashStart: 1.58,
      fastFlashCount: 3,
      fastFlashInterval: 0.16,
      fastFlashDuration: 0.095,
      spinDirection: 'ltr_cw',
      spinStartAngle: -18,
      spinEndAngle: 22,
      spinArcRadiusX: 58,
      spinArcRadiusY: 34,
      spin3DTilt: 16,
      showSpinGuide: false,
      particlesEnabled: true,
      particleCount: 68,
      particleFallSpeed: 1.25,
      particleWindSway: 0.45,
      particleSize: 2.4,
      particleColor: '#fde68a',
      glitchIntensity: 85,
      glitchDuration: 0.46,
      glitchSliceCount: 14,
      glitchChromaticOffset: 18,
      subject2CyanGrade: 78,
      subject2RevealZoom: 1.08,
      duration: 5.4,
      speedMultiplier: 1.0,
      enableAudioSFX: true,
      sfxVolume: 85
    }),
    'jani-flash-quad-sequence': Object.assign({}, (typeof window !== 'undefined' && window.JANI_FLASH_QUAD_CONFIG) || {
      type: 'jani-flash-quad',
      moodPreset: 'genius',
      image1Url: '/assets/aistudio/image_463745bd.png',
      image2Url: '/assets/aistudio/image_c2fee6b7.png',
      image3Url: '/assets/aistudio/image_560b8340.png',
      image4Url: '/assets/aistudio/image_174cfa38.png',
      flashBrilliance: 210,
      flashColor: '#fff5e0',
      flashDecayDuration: 0.42,
      preFlashDip: 35,
      flashlightRadius: 68,
      flashlightFalloff: 55,
      retinalAfterimage: 30,
      shutterSoundProfile: 'slr_35mm',
      enableShutterSFX: true,
      shutterVolume: 85,
      shutterPitch: 1.0,
      enableSlideWhoosh: true,
      enableSubSwell: true,
      layoutStyle: 'stack',
      ltrSpeed: 0.42,
      rtlSpeed: 0.42,
      slideOvershoot: 18,
      slideMotionBlur: 10,
      photoBorderWidth: 6,
      sluggishness: 0.82,
      centerEmergenceDuration: 1.35,
      centerStartScale: 0.36,
      centerFocusPullBlur: 16,
      centerGhostTrail: 55,
      speedMultiplier: 1.0,
      beat1Duration: 1.45,
      beat2Duration: 1.35,
      beat3Duration: 1.35,
      beat4Duration: 2.25
    }),
    'jani-cross-section-reveal': Object.assign({}, (typeof window !== 'undefined' && window.JANI_CROSS_SECTION_CONFIG) || {
      type: 'jani-cross-section',
      topImageUrl: '/jani_cross_top.png',
      bottomImageUrl: '/jani_cross_bottom.png',
      duration: 6.0,
      holdDuration: 2.2,
      anticipationDuration: 0.6,
      scrollDuration: 2.2,
      settleDuration: 1.0,
      startZoom: 1.10,
      holdEndZoom: 1.02,
      anticipationZoom: 1.08,
      settleZoom: 1.00,
      anticipationYOffset: -22,
      dustEnabled: true,
      dustParticleCount: 45,
      dustSpeed: 1.0,
      seamShadowIntensity: 0.65,
      vignetteIntensity: 0.45
    }),
    'jani-forbes-fraud-reveal': Object.assign({}, (typeof window !== 'undefined' && window.JANI_FORBES_CONFIG) || {
      type: 'jani-forbes',
      portraitUrl: '/portrait_cutout_clean.png',
      portraitPreset: 'founder',
      portraitScale: 1.0,
      portraitOffsetX: 0,
      portraitOffsetY: 0,
      portraitBrightness: 100,
      portraitContrast: 110,
      startZoom: 2.45,
      endZoom: 1.0,
      startTiltX: 13.0,
      startTiltY: -17.0,
      startTiltZ: 5.5,
      endTiltX: 0.0,
      endTiltY: 0.0,
      endTiltZ: 0.0,
      perspective: 900,
      startBlur: 18.0,
      endBlur: 0.0,
      ghostBloomOpacity: 75,
      blurResolveTime: 3.2,
      flashCount: 4,
      flashTimes: [0.65, 1.15, 1.65, 2.15],
      flashDuration: 0.14,
      flashPeakIntensity: 220,
      flashAmbientDip: 42,
      enableFlashSFX: true,
      beamTriggerTime: 2.55,
      beamDuration: 0.28,
      beamIntensity: 180,
      beamThickness: 3.5,
      beamGlowSpread: 42,
      beamColor: '#38bdf8',
      beamFaceBloom: 195,
      secondaryPulseTime: 3.12,
      secondaryPulseDuration: 0.16,
      magazineTitle: 'Forbes',
      mastheadColor: '#ffffff',
      kickerBadge: 'SPECIAL ISSUE',
      showKickerBox: true,
      kickerBoxBg: '#ef4444',
      topTickerLeft: "THE VATICAN'S CORRUPTION TRIAL PROBLEM",
      topTickerRight: "THE MOGUL WHO MASTERED WASHINGTON",
      featureTag: '40th ANNUAL',
      featureTitle: 'FORBES 400',
      subHeadline1: "• NEW RECORD: $4.5 TRILLION FOR AMERICA'S RICHEST",
      subHeadline2: "• CAN ANYONE REALLY TRUST THE NEW BILLIONAIRES?",
      subjectName: 'ALEXANDER VANCE',
      subjectQuote: '"I BUILT AN EMPIRE BEFORE ANYONE KNEW WHAT WAS REAL."',
      duration: 5.0
    }),
    // 1. Depth Parallax Multi-Layer
    'parallax': {
      type: 'parallax',
      sunColor: '#ff7a59',
      sunSize: 64,
      skyTop: '#1a1033',
      skyBottom: '#ff7a59',
      mountainsImg: '',
      figureImg: '',
      extraLayers: [],
      motionSpeed: 1.0,
      zoomScale: 1.15
    },

    // 2. Wealth Comparison Bars
    'wealth': {
      type: 'bars',
      title: 'Net Worth Comparison',
      bars: [
        { label: 'Jeff Bezos', val: '$200B', pct: 85, color: '#00a8ff' },
        { label: 'Elon Musk', val: '$180B', pct: 75, color: '#ff5370' },
        { label: 'Avg American', val: '$97K', pct: 8, color: '#64748b' }
      ]
    },

    // 3. Stock Ticker Tape
    'ticker': {
      type: 'ticker',
      title: 'LIVE MARKETS',
      speed: 1.0,
      items: [
        { sym: 'TSLA', price: '248.50', change: '+5.67%', isUp: true },
        { sym: 'NVDA', price: '487.90', change: '+4.12%', isUp: true },
        { sym: 'AAPL', price: '187.44', change: '+2.34%', isUp: true },
        { sym: 'MSFT', price: '415.20', change: '+1.12%', isUp: true },
        { sym: 'GOOGL', price: '175.90', change: '-0.45%', isUp: false },
        { sym: 'AMZN', price: '178.20', change: '+3.10%', isUp: true }
      ]
    },

    // 4. Candlestick Chart
    'candle': {
      type: 'candle',
      symbol: 'BTC / USDT',
      price: '$64,250',
      change: '+4.8%',
      upColor: '#10b981',
      downColor: '#ef4444'
    },

        // 5. Balance Sheet Breakdown
    'balance': {
      type: 'balance',
      theme: 'archival',
      company: 'APPLE INC.',
      period: 'FORM 10-K \u00b7 FISCAL 2024',
      assetsTotal: '$143.5B',
      liabilitiesTotal: '$81.4B',
      equityTotal: '$62.1B',
      assets: '$143.5B',
      liabilities: '$81.4B',
      netWorth: '$62.1B',
      assetColor: '#10b981',
      liabColor: '#ef4444',
      equityColor: '#6366f1',
      dofFocusEnabled: true,
      unfocusedBlur: 1.2,
      unfocusedOpacity: 0.6,
      lineAlpha: 0.28,
      leaderAlpha: 0.22,
      cameraTilt: 13.5,
      assetRows: [
        { name: 'Cash & Equivalents', val: '$29.9B' },
        { name: 'Marketable Securities', val: '$61.5B' },
        { name: 'Accounts Receivable', val: '$29.5B' },
        { name: 'Inventories & Other', val: '$22.6B' }
      ],
      liabRows: [
        { name: 'Short-term Debt & Payables', val: '$16.2B' },
        { name: 'Long-term Debt Obligations', val: '$65.2B' }
      ]
    },

// 6. Compound Interest Curve
    'compound': {
      type: 'compound',
      initial: '$10,000',
      monthly: '$500/mo',
      rate: '10%',
      futureVal: '$354,800',
      curveColor: '#00d68f'
    },

    // 7. Bloomberg Terminal
    'bloom': {
      type: 'bloom',
      panelTitle: 'US EQUITIES',
      headline: 'FED SIGNALS RATE HOLD \u00b7 TECH SURGES',
      accentColor: '#f59e0b'
    },

    // 8. Inflation Shrink
    'inflation': {
      type: 'inflation',
      item: 'Grocery Basket',
      pastPrice: '$100 (2020)',
      currPrice: '$165 (2024)',
      shrinkPct: '-39%'
    },

    // 9. Debt Snowball
    'snowball': {
      type: 'snowball',
      title: 'Debt Payoff Progress',
      debts: [
        { name: 'Credit Card', bal: '$3,200', paid: true },
        { name: 'Car Loan', bal: '$12,500', paid: false },
        { name: 'Student Loan', bal: '$24,000', paid: false }
      ]
    },

    // 10. Portfolio Allocation Pie
    'pie': {
      type: 'pie',
      title: 'Portfolio Allocation',
      presetName: 'Classic Growth',
      totalValue: '$100,000',
      slices: [
        { name: 'S&P 500 Index', pct: '50%', color: '#38bdf8' },
        { name: 'Real Estate', pct: '25%', color: '#10b981' },
        { name: 'Bitcoin / Tech', pct: '15%', color: '#f59e0b' },
        { name: 'Treasury Cash', pct: '10%', color: '#a855f7' }
      ]
    },

    // 11. Receipt / Invoice
    'receipt': {
      type: 'receipt',
      store: 'WHOLE FOODS MARKET',
      authCode: 'TERM #0491 · AUTH VERIFIED',
      items: [
        { name: 'Organic Almond Milk', price: '$4.99' },
        { name: 'Avocado 4-Pack', price: '$6.49' },
        { name: 'Grass-Fed Ribeye', price: '$22.80' }
      ],
      total: '$34.28',
      isOverlay: true,            // By default it should be an overlay!
      positionPreset: 'center',   // Snap presets: 'center', 'br', 'bl', 'tr', 'tl', 'custom'
      posX: 0,
      posY: 0,
      scale: 1.0,
      rotation: 0,
      transparentBg: true,        // By default transparent overlay!
      receiptTheme: 'classic',
      bgPreset: 'transparent',
      bgMediaUrl: '',
      bgMediaType: 'video'
    },

    // 12. Google Search Typing (Reference Image 3: Frosted Glass Card + Aurora + 65% Default Width)
    'google': {
      type: 'google',
      query: 'how to invest in index funds',
      suggestion: 'top index funds for passive wealth',
      suggestion2: 's&p 500 historical annual return',
      suggestion3: 'vanguard vs fidelity index funds',
      styleMode: 'cinematic',
      auroraEnabled: true,
      auroraIntensity: 85,
      widthPercent: 65,
      sizePreset: 'standard',
      lockAspectRatio: true,
      posX: 0,
      posY: 0,
      scale: 1,
      rotation: 0,
      tiltX: 0,
      tiltY: 0,
      keyframeEnabled: false,
      kfStartX: 0,
      kfStartY: 18,
      kfStartScale: 0.92,
      kfStartRot: 0,
      kfEndX: 0,
      kfEndY: 0,
      kfEndScale: 1.0,
      kfEndRot: 0,
      kfDuration: 1.2,
      typingSpeedMs: 42
    },

    // 13. iMessage Thread
    'imessage': {
      type: 'imessage',
      contact: 'Insider Source',
      msg1: 'hey, are you up?',
      msg2: 'look at institutional inflow right now',
      msg3: 'already positioned before the announcement',
      msg4: 'send me the filing PDF'
    },

    // 14. Subscribe Button CTA
    'subscribe': {
      type: 'subscribe',
      channel: 'Magnates Media',
      subs: 'Road to 1 million',
      btnText: 'SUBSCRIBE',
      btnColor: '#ef4444',
      positionPreset: 'center',
      posX: 0,
      posY: 0,
      scale: 1.0,
      transparentBg: true,
      bgPreset: 'transparent',
      bgMediaUrl: '',
      bgMediaType: 'video',
      showBell: true
    },

    // 15. Countdown / Top 10
    'countdown': {
      type: 'countdown',
      num: '7',
      label: 'BILLIONAIRE SECRETS',
      color: '#facc15'
    },

    // 16. Red Circle Highlight
    'redcircle': {
      type: 'redcircle',
      title: 'CRITICAL DETAIL',
      circleColor: '#ef4444',
      circleSize: 100,
      targetImg: ''
    },

    // 17. Stock Chart Drawing
    'chart': {
      type: 'chart',
      symbol: 'NVDA',
      price: '$875.20',
      change: '+6.4%',
      lineColor: '#10b981'
    },

    // 18. Typewriter Reveal
    'typewriter': {
      type: 'typewriter',
      header: 'THE CONFIDENTIAL MEMO',
      text: 'On the night of October 24th, three executives entered the boardroom...'
    },

    // 19. Phone Notification Stack
    'notif': {
      type: 'notif',
      app: 'Mercury Bank',
      title: 'Wire Transfer Confirmed',
      body: '$24,500.00 deposited via SWIFT',
      time: 'Now'
    },

    // 20. Hormozi Captions
    'hormozi': {
      type: 'hormozi',
      caption: 'NEVER TRADE YOUR TIME FOR MONEY',
      keyword: 'TIME',
      keyColor: '#facc15',
      fontSize: 32,
      fontFamily: "'Space Grotesk', sans-serif",
      showEmoji: false,
      emoji: '\ud83d\udd25',
      transparentBg: false,
      bgMedia: '',
      bgMediaType: 'image'
    },

    // 21. Ken Burns Cinematic
    'kenburns': {
      type: 'kenburns',
      caption: 'TOKYO · 1987',
      image: '',
      motion: 'Zoom In'
    },

    // 22. Tweet / Social Proof
    'tweet': {
      type: 'tweet',
      author: 'Alex Hormozi',
      handle: '@AlexHormozi',
      text: 'The best investment you can make is in skills nobody can tax or inflate away.',
      likes: '48.2K',
      retweets: '9.4K'
    },

    // 23. Money Counter
    'money': {
      type: 'money',
      amount: '$127,450',
      label: 'NET PROFIT (Q3)',
      color: '#10b981'
    },

    // 24. Glitch Reveal
    'glitch': {
      type: 'glitch',
      text: 'THE TRUTH',
      color: '#00f0ff'
    },

    // 25. Investigative Globe (Original 3D Interactive Globe - Johnny Harris Style)
    'map': {
      type: 'map',
      location: 'USA \u2192 UK \u2192 UKRAINE',
      coords: 'MULTI-VECTOR TRANSIT // 2 ACTIVE LEGS',
      lat: 48.37,
      lng: 31.16,
      projection: 'globe',
      mapStyle: 'harris-dark',
      zoomStart: 0.8,
      zoomDuration: 2.2,
      zoomLevel: 1.9,
      pinColor: '#38bdf8',
      showFlightPath: true,
      originLabel: 'USA',
      is3DMode: true,
      drawOnScreenMode: false,
      activeTraceTransit: 'plane',
      pitch3D: 22,
      yaw3D: -10,
      routes: [
        { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 51.50, toLng: -0.12, mode: 'plane', color: '#38bdf8' },
        { from: 'UK', to: 'Ukraine', fromLat: 51.50, fromLng: -0.12, toLat: 48.37, toLng: 31.16, mode: 'plane', color: '#38bdf8' }
      ],
      customTracedRoutes: []
    },

    // 25B. Layered Cinematic 3D Map Pin Drop (Scalable Vector SVG - James Jani / Yes Theory standard)
    'map-pin-drop': {
      type: 'map-pin-drop',
      location: 'KYIV, UKRAINE',
      coords: '50.4501°N 30.5234°E',
      telemetry: 'O.SR5911TES     DFX35.EVA',
      lat: 50.4501,
      lng: 30.5234,
      pinMaterial: 'copper',
      showImpactDust: true,
      showBorders: true,
      showLabels: true,
      showWaterCurrents: true,
      showGrid: true,
      pitch3D: 10,
      yaw3D: -3,
      pinColor: '#f97316',
      showFlightPath: true,
      is3DMode: true,
      routes: [
        { from: 'Americas', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 51.50, toLng: -0.12, mode: 'plane', color: '#f97316' },
        { from: 'UK', to: 'Kyiv', fromLat: 51.50, fromLng: -0.12, toLat: 50.4501, toLng: 30.5234, mode: 'plane', color: '#f97316' },
        { from: 'Kyiv', to: 'East Asia', fromLat: 50.4501, fromLng: 30.5234, toLat: 35.86, toLng: 104.2, mode: 'plane', color: '#ea580c' }
      ]
    },

    // 25B. Empire Rise & Fall Timeline (James Jani / Magnates Media Documentary Style)
    'empire-map': {
      type: 'empire-map',
      title: 'Empire Expansion Map',
      mapStyle: 'tactical-dark', // 'tactical-dark' (Image 2 standard) or 'vintage-cartography' (Vox Cartography)
      preset: 'corporate-dominance',
      is3DMode: true,
      pitch3D: 28,
      yaw3D: -3,
      zoomLevel: 1.08,
      panX: 0,
      panY: 0,
      cameraGlide: true,
      depthOfField: true,
      dofBlur: 2.5,
      arcColor: '#fbbf24',
      arcGlowColor: 'rgba(245, 158, 11, 0.45)',
      arcCurvature: 1.0,
      arcMultiStrand: true,
      arcSpeed: 3.5,
      highlightTerritory: 'India',
      highlightColor: '#2dd4bf',
      highlightOpacity: 0.28,
      pinStyle: 'beacon',
      showShockwaves: true,
      showCountryBorders: true,
      showGrid: true,
      showDotMatrix: true,
      showLabels: true,
      hubs: [
        { id: 'sf', name: 'Silicon Valley', code: 'SFO', x: 85.8, y: 81.9, active: true },
        { id: 'ny', name: 'New York', code: 'NYC', x: 130.9, y: 79.1, active: true },
        { id: 'sp', name: 'São Paulo', code: 'SAO', x: 156.5, y: 140.5, active: true },
        { id: 'lon', name: 'London', code: 'LON', x: 199.9, y: 68.8, active: true },
        { id: 'fra', name: 'Frankfurt', code: 'FRA', x: 208.1, y: 70.1, active: true },
        { id: 'jnb', name: 'Johannesburg', code: 'JNB', x: 226.2, y: 143.0, active: true },
        { id: 'del', name: 'India', code: 'IND', x: 272.1, y: 95.0, active: true },
        { id: 'hkg', name: 'East Asia', code: 'HKG', x: 306.5, y: 96.7, active: true },
        { id: 'tyo', name: 'Tokyo', code: 'TYO', x: 330.3, y: 83.9, active: true },
        { id: 'syd', name: 'Sydney', code: 'SYD', x: 341.1, y: 150.4, active: true }
      ],
      routes: [
        { from: 'sf', to: 'ny', curv: 0.65, delay: 0 },
        { from: 'ny', to: 'lon', curv: 0.95, delay: 0.4 },
        { from: 'sp', to: 'ny', curv: 0.70, delay: 0.7 },
        { from: 'lon', to: 'fra', curv: 0.50, delay: 0.9 },
        { from: 'lon', to: 'jnb', curv: 0.75, delay: 1.1 },
        { from: 'lon', to: 'del', curv: 1.15, delay: 1.3 },
        { from: 'fra', to: 'del', curv: 1.05, delay: 1.5 },
        { from: 'del', to: 'hkg', curv: 0.65, delay: 1.8 },
        { from: 'hkg', to: 'tyo', curv: 0.55, delay: 2.1 },
        { from: 'hkg', to: 'syd', curv: 0.75, delay: 2.4 }
      ]
    },
    'empire-timeline': {
      type: 'empire-timeline',
      title: 'THE RISE & FALL OF ENRON',
      subtitle: 'CORPORATE VALUATION & LIQUIDITY CRASH \u00b7 1985 \u2014 2001',
      theme: 'james-jani',
      hairline: 1.2,
      showGrid: true,
      showAreaFill: true,
      is3DMode: true,
      cameraPitch: 26,
      cameraYaw: -14,
      peakValuation: '$1.5B',
      milestones: [
        { label: 'FOUNDED', date: '1985', value: '$10M', desc: 'Houston Merger', color: '#10b981', x: 80, y: 315 },
        { label: 'WALL ST DARLING', date: '1995', value: '$320M', desc: 'Mark-to-Market Model', color: '#38bdf8', x: 230, y: 225 },
        { label: 'PEAK EMPIRE', date: '2000', value: '$1.5B', desc: 'Fortune #1 Innovator', color: '#f59e0b', x: 380, y: 95 },
        { label: 'WHISTLEBLOWER', date: 'AUG 2001', value: '$480M', desc: 'SEC Inquiry & Debt', color: '#fb923c', x: 525, y: 235 },
        { label: 'BANKRUPTCY', date: 'DEC 2001', value: '$0', desc: 'Chapter 11 Liquidation', color: '#ef4444', x: 645, y: 340 }
      ]
    },

    // 26. Breaking News Banner
    'news': {
      type: 'news',
      channel: 'WORLD NEWS LIVE',
      report: 'BREAKING REPORT',
      headline: 'Tech Giant Announces Unprecedented Layoffs',
      ticker: 'MARKETS REACT: NASDAQ FUTURES SLIDE 3.2% IN AFTER-HOURS TRADING \u2022 FEDERAL REGULATORS OPEN INQUIRY',
      bannerColor: '#dc2626',
      glassBlur: 28
    },

    // 27. Cinematic Quote Card
    'quote': {
      type: 'quote',
      quote: 'The obstacle is the way.',
      author: 'Marcus Aurelius',
      palette: 'parchment',
      fontSize: 42,
      fontFamily: "'Playfair Display', Georgia, serif",
      textColor: '#3a2418',
      authorColor: '#8b5a3c',
      quoteMarkColor: 'rgba(139, 90, 60, 0.16)',
      bgGradient: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 100%)'
    },

    // 28. Polaroid Stack
    'polaroid': {
      type: 'polaroid',
      caption: 'First Office, 1994',
      caption2: 'Archive Exhibit #04',
      photo1: '/hiker_background_inpainted.png',
      photo2: '/clean_mountain_backdrop.png',
      polaroidScale: 1.0,
      p1Rot: -11,
      p2Rot: 7,
      p1X: -78,
      p1Y: -6,
      p2X: 72,
      p2Y: 10,
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

    // 29. Comic POW!
    'comic': {
      type: 'comic',
      word: 'POW!',
      color: '#facc15',
      bgColor: '#e11d48'
    },

    // 30. VHS Retro Overlay
    'vhs': {
      type: 'vhs',
      tag: 'SUMMER 89',
      recMode: 'REC \u25cf',
      filter: 'vintage',
      bgPreset: 'default',
      bgMediaUrl: '/vhs_summer_1989_bg.jpg',
      bgMediaType: 'image',
      feedUrl: '/vhs_summer_1989_bg.jpg'
    },

    // 31. Progress Bar / Cinematic Progress HUD (Reference Image 4: 3 Selectable Documentary Directions)
    'progress': {
      type: 'progress',
      stylePreset: 'documentary', // 'documentary' (A - Default Ref Image 4), 'tech' (B), 'editorial' (C)
      eyebrow: 'PROJECT FUNDING',
      title: 'Funding Progress',
      phaseLabel: 'Phase 2 of 3',
      phaseStatus: 'Active',
      percent: '74%',
      calloutSublabel: 'of target',
      raisedValue: '$74,000,000',
      raisedLabel: 'Raised',
      targetValue: '$100,000,000',
      targetLabel: 'Target',
      gradientStart: '#7c3aed', // Restrained violet
      gradientEnd: '#38bdf8',   // Refined cyan-blue
      barWidthPercent: 70,      // 70% default documentary width
      barThickness: 8,          // Slim 8px track
      posX: 0,
      posY: 0,
      scale: 1,
      radialGlowIntensity: 0.65,
      showEndpointDot: true,
      showFilmGrain: false,
      animDurationSec: 1.35,
      bgPreset: 'cinematic-dark'
    },

    // 32. Text Scramble / Hacker
    'scramble': {
      type: 'scramble',
      layoutMode: 'chat',
      text: 'you are a dead man',
      color: '#00ff88',
      senderHandle: 'ANON_USER // UNTRACEABLE',
      headerTag: 'ROOT@0x7A_DARKNET // [SYS_BREACH_ESTABLISHED]',
      subText: 'IP: 185.220.101.5 // CIPHER: AES-256-GCM // PORT: 9050',
      scrambleSpeed: 'normal',
      showScanlines: true,
      bgPreset: 'cyber-3d-grid'
    },

    // 33. Newspaper Headline
    'newspaper': {
      type: 'newspaper',
      paperName: 'THE DAILY TIMES',
      headline: 'MARKET CRASH STUNS WALL STREET',
      subhead: 'Emergency Fed Meeting Called Tonight'
    },

    // 34. Instagram Post
    'instagram': {
      type: 'instagram',
      username: '@creator',
      verified: true,
      caption: 'Expandable 1 part to roast cinematic storytelling highlights and more...',
      likesCount: 1248900,
      likes: '1,248,900 likes',
      location: '📍 Location, 💬 Comment',
      timestamp: '14 hours ago',
      audioTrack: 'Original Audio • @creator',
      postImage: '/clean_mountain_backdrop.png',
      frostedFilter: true,
      keyLightColor: '#fff5ea',
      spatialPitch: 20,
      spatialTilt: 10,
      backdropType: 'feed_grid'
    },

    // 35. Animated Checklist (Master 3D Paper Artifact Reveal Engine - Sequential Blur-to-Sharp Reveal by Default)
    'checklist': {
      type: 'checklist',
      layoutMode: 'slips', // 'slips' (Image 2) or 'dossier' (Image 3)
      bgEnvironment: 'desk', // 'desk' (Dark Mahogany Desk) or 'blueprint' (Investigative Blue Map Grid)
      title: 'Action Steps',
      items: [
        { text: 'Register Company LLC', checked: true, blurPx: 0, unblurDelayOffsetSec: 0 },
        { text: 'Open Business Account', checked: true, blurPx: 0, unblurDelayOffsetSec: 0 },
        { text: 'Acquire First 100 Clients', checked: true, blurPx: 0, unblurDelayOffsetSec: 0 },
        { text: 'Automate Sales Funnel', checked: true, blurPx: 0, unblurDelayOffsetSec: 0 }
      ],
      blurMode: 'sequential', // 'sequential' (Appear Blurred -> Fade Out 1-by-1), 'focus' (Hold Blur on Unfocused), 'off'
      entryBlurPx: 6.5,
      unblurDurationSec: 0.55,
      unblurStaggerSec: 0.32,
      activeFocusIndex: -1,
      depthOfField: false,
      globalBlurPx: 0,
      blurredItemOpacity: 0.85,
      fallMotionBlurPx: 6.5,
      spotlightIntensity: 1.0,
      volumetricDust: true,
      stampColor: '#15803d',
      tiltAngleX: 14,
      tiltAngleY: 0,
      coverageScale: 58,
      organicTape: true,
      organicStampSeal: true,
      organicStampSlam: true
    },

    // 36. Text Behind Object
    'textbehind': {
      type: 'textbehind',
      bgText: 'DREAM',
      textColor: '#ffffff',
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 80,
      letterSpacing: -2,
      layerOrder: 'behind',
      subjectImg: ''
    },

    // 37. Document Key Highlight (3D Classified Legal Dossier)
    'docheight': {
      type: 'docheight',
      docTitle: 'CONFIDENTIAL AGREEMENT',
      agencyName: 'GOVERNMENT AGENCY',
      caseRef: 'CASE FILE: #DOJ-8842-X',
      classificationLevel: 'CLASSIFIED INFORMATION',
      showClassifiedHeader: true,
      lines: [
        { id: 1, text: '1. Intellectual property rights reserved.', mode: 'highlight', color: '#facc15' },
        { id: 2, text: '2. Total liability shall not exceed $10,000,000.', mode: 'highlight', color: '#facc15' },
        { id: 3, text: '3. Immediate termination upon breach of clause.', mode: 'normal', color: '#facc15' },
        { id: 4, text: 'The redaction must be respected under federal oversight mandate.', mode: 'redact', color: '#000000' }
      ],
      hlColor: '#facc15',
      showTopSecretStamp: true,
      topSecretText: 'TOP SECRET',
      topSecretAngle: 16,
      showDeclassifiedStamp: true,
      declassifiedText: 'DECLASSIFIED',
      declassAngle: -10,
      showPaperClip: true,
      showManilaFolder: true,
      showStackedPages: true,
      showLeatherCase: true,
      showCreases: true,
      envTheme: 'mahogany',
      spotlightIntensity: 0.85,
      volumetricRays: true,
      rayIntensity: 0.45,
      dustMotes: true,
      dustCount: 28,
      vignetteIntensity: 0.9,
      cameraPitch: 16,
      cameraYaw: -12,
      cameraRoll: 3,
      cameraZoom: 1.05,
      perspective: 1100,
      organicDrift: true
    },

    // 38. Kinetic Typography Stack (James Jani Monolithic 3D Architecture)
    'kinetic': {
      type: 'kinetic',
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
    },

    // 39. Split Reveal Before / After
    'split': {
      type: 'split',
      leftLabel: 'RAW // S-LOG3',
      rightLabel: '4K MASTER GRADE',
      leftImg: '/cinematic_split_scene.jpg',
      rightImg: '/cinematic_split_scene.jpg',
      leftColor: '#3a2a4a',
      rightColor: '#ff7a59'
    },

    // 40. 3D Product Zoom & Spin
    'zoom': {
      type: 'zoom',
      productName: 'TITAN VELOX X1',
      productSub: 'GRADE-5 TITANIUM',
      titleFont: "'Space Grotesk', sans-serif",
      titleSize: 26,
      titleColor: '#f8fafc',
      subColor: '#fbbf24',
      glowColor: '#38bdf8',
      spinSpeed: 1.0,
      productImg: '/product_scan_3d.jpg',
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

    // 40B. CEO Portrait Reveal
    'interview-cutin': {
      type: 'interview-cutin',
      subjectName: 'JOHN DOE',
      subjectTitle: 'FORMER CEO, COMPANY INC.',
      metaTag: 'INTERVIEW / EXPERT ANALYSIS',
      timecode: 'TC: 01:24:03',
      accentColor: '#ef4444',
      interviewBg: '/interview_cutin_cinematic.jpg',
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

    'ceo-portrait': {
      type: 'ceo-portrait',
      ceoName: 'ALEXANDER VANCE',
      ceoRole: 'CHIEF EXECUTIVE OFFICER \u00b7 VANGUARD GLOBAL',
      ceoBadge: 'EXECUTIVE DOSSIER // VERIFIED',
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 32,
      nameColor: '#ffffff',
      accentColor: '#fbbf24',
      cutoutUrl: '/ceo_portrait_cutout.jpg',
      portraitScale: 1.0,
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

        // 40B-2. Power Meeting Cinematic Engine
    'power-meeting': {
      type: 'power-meeting',
      headline: 'POWER MEETING',
      subline: 'SILHOUETTES · HIGH-STAKES NEGOTIATION',
      fontFamily: "'Space Grotesk', sans-serif",
      textColor: '#f8fafc',
      accentColor: '#fbbf24',
      meetingBg: '/power_meeting_cinematic_plate.jpg',
      spotlightWarmth: 85,
      fogDensity: 75,
      dofIntensity: 80,
      showHud: false,
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

    // 40C. Boardroom Zoom
    'boardroom-zoom': {
      type: 'boardroom-zoom',
      headline: 'EMERGENCY BOARDROOM SUMMIT',
      subline: '42ND FLOOR \u00b7 MANHATTAN HQ // $14.8B MERGER VOTE',
      fontFamily: "'Space Grotesk', sans-serif",
      textColor: '#f8fafc',
      accentColor: '#fbbf24',
      sceneUrl: '/boardroom_scene_hd.jpg',
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

    // 40C-2. Zoom Blur Burst (Editorial Combo: Background Radial Blur + Cutout Burst + Kinetic Text)
    'zoom-blur': {
      type: 'zoom-blur',
      headline: 'THE MASTERMIND',
      kicker: '[ 00:01:28 · TARGET IDENTIFIED ]',
      subline: 'RADIAL BURST // PIN-SHARP CUTOUT',
      subjectUrl: '/ceo_portrait_alpha_cutout.png',
      sceneUrl: '/boardroom_scene_hd.jpg',
      blurIntensity: 14,
      zoomScale: 1.35,
      subjectZoom: 1.15,
      textColor: '#ffffff',
      accentColor: '#38bdf8',
      kickerColor: '#fbbf24',
      shutterSpeed: '1/48S',
      reticleBrackets: true,
      fontFamily: "'Space Grotesk', sans-serif"
    },

    // 40D. Security Camera Overlay
    'security-camera': {
      type: 'security-camera',
      camId: 'CAM 04 // NORTH VAULT CORRIDOR',
      recText: 'REC',
      datePrefix: '2026-10-19',
      timecode: '2026-10-19  03:14:28:09',
      statusText: 'ISO 3200 \u00b7 IR NIGHT VISION \u00b7 1080P/24',
      colorMode: 'night',
      showScanlines: true,
      feedUrl: '/cctv_surveillance_scene.jpg',
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

    // 40E. Film Grain & Camera Overlay Suite
    'film-grain': {
      type: 'film-grain',
      feedUrl: '/cinematic_footage_loop.mp4',
      filmStyle: 'kodak35',
      grainIntensity: 65,
      vignetteIntensity: 60,
      showScanlines: true,
      showDust: true,
      filmFlicker: true,
      showHud: true,
      stockName: 'KODAK 5219 // 35MM',
      fpsText: '24.000 FPS',
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'video'
    },

    // 40F. Cinematic 3D Screen Recording Blur Suite
    'screen-blur': {
      type: 'screen-blur',
      urlBar: 'https://cloud.internal/admin/api-keys',
      windowTitle: 'Enterprise Security Console',
      tiltX: 5,
      tiltY: -7,
      tiltZ: 1.2,
      showRedaction: true,
      redactStyle: 'classified',
      redactLabel: 'RESTRICTED // API KEY REDACTED',
      showMagnifier: true,
      magnifierZoom: 1.5,
      magnifierTarget: 'SESSION AUTH TOKEN: 0x9F4A...VALID',
      magnifierSub: 'FOCUS SPOTLIGHT \u00b7 2-FACTOR OK',
      showGpuHud: true,
      gpuText: 'REC \u25cf 00:02:14 // 120 FPS \u00b7 GPU ACCEL \u00b7 62\u00b0C',
      showCursor: true,
      cursorTrail: true,
      screenTheme: 'terminal',
      screenMediaUrl: '',
      bgPreset: 'default',
      bgMediaUrl: '',
      bgMediaType: 'image'
    },

    // 41. Fed Rate Timeline
    'fedrate': {
      type: 'fedrate',
      title: 'FED RATE TIMELINE',
      rate1980: '20%',
      rate2008: '0.25%',
      rate2024: '5.5%',
      color: '#38bdf8'
    },

    // 42. Bear vs Bull Market
    'bearbull': {
      type: 'bearbull',
      bullPct: '68%',
      bearPct: '32%',
      bullColor: '#10b981',
      bearColor: '#ef4444'
    },

    // 43. Stock Certificate
    'certificate': {
      type: 'certificate',
      corp: 'Apple Computer Co.',
      shareholder: 'Steve Jobs',
      shares: '10,000 SHARES'
    },

    // 44. Crypto Wallet Balance
    'cryptowallet': {
      type: 'cryptowallet',
      cryptoSymbol: 'Bitcoin (BTC)',
      balance: '4.8291 BTC',
      usdValue: '$310,240 USD'
    },

    // 45. Real Estate Deal Analyzer
    'realestate': {
      type: 'realestate',
      price: '$425,000',
      rent: '$3,200/mo',
      capRate: '7.8% Cap',
      cashFlow: '+$850/mo Net'
    },

    // 46. Credit Score Gauge
    'creditscore': {
      type: 'creditscore',
      score: '785',
      rating: 'EXCELLENT',
      color: '#10b981'
    },

    // 47. 50/30/20 Budget Breakdown
    'budget': {
      type: 'budget',
      income: '$5,000/mo',
      needs: '$2,500 (50%)',
      wants: '$1,500 (30%)',
      savings: '$1,000 (20%)'
    },

    // 48. Market Crash Animation
    'crash': {
      type: 'crash',
      title: 'BLACK MONDAY',
      drop: '-22.6%',
      indexName: 'Dow Jones Industrial Average'
    },

    // 49. Dividend Calendar
    'dividend': {
      type: 'dividend',
      title: 'Dividend Calendar',
      yield: '4.2% \u00b7 $350/mo',
      perShare: '$87'
    },

    // 50. Supply & Demand Curves
    'supplydemand': {
      type: 'supplydemand',
      market: 'HOUSING MARKET',
      eq: 'Eq: $350K',
      supplyColor: '#ef4444',
      demandColor: '#10b981'
    },

    // 51. Flying Headlines (3D Cinematic Motion Suite)
    
    // 3D Newspaper Clipping (James Jani / Corridor Digital Cinematic Suite)
    'magnates-media-article-highlight': {
      type: 'article-highlight',
      headline: 'MARKET COLLAPSES IN PANIC',
      subcaption: 'NEW YORK — Oct 28',
      markText1: '$14,000,000,000 LOST',
      markText2: 'NO BUYERS FOUND',
      zoomScale: 155,
      cameraTilt: 20,
      dofBokeh: 3.5,
      panDistance: 35,
      markerColor: '#facc15'
    },
    'newspaper-3d': {
      type: 'newspaper-3d',
      stylePreset: 'scandal',
      masthead: 'THE DAILY TIMES',
      headline: 'MAJOR SCANDAL\nEXPOSED',
      dateline: 'MONDAY, JANUARY 15, 2024',
      subhead: 'Special Investigation Report • Leaked Internal Dossier',
      bodyText: 'According to confidential documents leaked earlier today, the core mechanism operated behind closed doors without external oversight. Key executives had full awareness of structural vulnerabilities as early as Q3, yet chosen strategy remained unchanged while investor capital was mobilized across offshore accounts.',
      dofBokeh: true,
      dofBlur: 14,
      dofBgBlur: 7,
      dofFgBlur: 14,
      cameraPitch: 10,
      cameraYaw: -7,
      cameraRoll: 2,
      perspective: 1100,
      showDogEar: true,
      dogEarSize: 54,
      paperBrightness: 104,
      inkContrast: 115,
      paperAging: 75,
      inkBleed: true,
      inkBleedAmount: 0.6,
      deckleEdge: true,
      volumetricRays: true,
      rayIntensity: 0.45,
      rimLight: true,
      warmSpotlight: true,
      spotIntensity: 0.5,
      dustMotes: true,
      dustCount: 20,
      organicDrift: true,
      driftSpeed: 1.0,
      parallaxStrength: 1.5,
      motionBlur: true,
      filmGrain: true,
      filmGrainOpacity: 0.22,
      enableHighlight: true,
      highlightDelay: 0.8,
      highlightDuration: 2.2,
      highlightColor: '#facc15',
      highlightPhrase: 'structural vulnerabilities known since Q3'
    },
'headline-fly': {
      type: 'headline-fly',
      layoutStyle: 'broadsheet', // 'broadsheet' (default, authentic journalism like Image 1) vs 'saas' (legacy UI cards)
      tiltAngle: 9.5,
      motionBlur: true,
      blurIntensity: 32,
      dofBokeh: true,
      dofBlur: 7,
      specularGlare: true,
      shadowRadius: 48,
      shadowAlpha: 0.55,
      easingMode: 'cinematic',
      organicDrift: true,
      flySpeed: 1.0,
      staggerDelay: 0.28,
      paperGrain: 35,
      showTelemetry: false,
      hudLeft: 'INVESTIGATIVE PRESS ARCHIVE // RECONSTRUCTION 3D',
      hudRight: 'OPTICAL LENS: 35MM ANAMORPHIC',
      activeCardTab: 5,
      bodyCol1: 'Lorem ipsum dolor sit amet, consectetur cuised the largerst corporate insolven- evovencs in modern histroy.',
      bodyCol2: 'onablewead of the oxourancy and alentarih rough hanning inkia lioso, with mauitty-draw nes, and comhlicste distribution',

      // Card #1 (Top-Left: Classic Broadsheet Tear-Sheet)
      visible1: true,
      theme1: 'newsprint',
      bgColor1: '#ece6d8', textColor1: '#1a1816',
      accentColor1: '#b91c1c',
      hlColor1: '#fde047',
      source1: 'THE FINANCIAL CHRONICLE',
      kicker1: 'SPECIAL DISCLOSURE',
      date1: 'OCT 24, 2026',
      headline1: 'Tech Giant Collapse: Internal Memos Reveal Chaos',
      highlight1: 'Internal Memos Reveal Chaos',
      subhead1: 'Leaked board minutes show executives knew of liquidity shortfall six months prior to freeze.',
      byline1: 'By Marcus Vance \u00b7 Markets Desk',
      exhibit1: 'EXHIBIT A-01',
      font1: "'Playfair Display', Georgia, serif",
      fontSize1: 11.5,
      scale1: 1.0,
      rot1: -2.2,
      x1: 0,
      y1: 0,

      // Card #2 (Top-Right: Financial Times Salmon Pink Press Clipping)
      visible2: true,
      theme2: 'newsprint', bgColor2: '#eae4d5', textColor2: '#1a1816',
      accentColor2: '#9a3412',
      hlColor2: '#fef08a',
      source2: 'GLOBAL MARKETS LEDGER',
      kicker2: 'SENATE SUBCOMMITTEE',
      date2: 'OCT 25, 2026',
      headline2: 'Whistleblower Testifies Before Senate Hearing',
      highlight2: 'Whistleblower Testifies',
      subhead2: 'Former chief risk officer hands over 4,200 pages of unredacted offshore wire transfers.',
      byline2: 'By Elena Rostova \u00b7 Washington',
      exhibit2: 'EXHIBIT B-14',
      font2: "'Playfair Display', Georgia, serif",
      fontSize2: 11.5,
      scale2: 1.0,
      rot2: 2.4,
      x2: 0,
      y2: 0,

      // Card #3 (Bottom-Left: Dark Investigative Wire)
      visible3: true,
      theme3: 'newsprint', bgColor3: '#e8e2d2', textColor3: '#1a1816', accentColor3: '#0284c7', hlColor3: '#38bdf8',
      source3: 'REUTERS INVESTIGATIVE WIRE',
      kicker3: 'FORENSIC AUDIT',
      date3: 'OCT 26, 2026',
      headline3: 'Federal Prosecutors Unseal Indictments Across 4 Districts',
      highlight3: 'Unseal Indictments',
      subhead3: 'Coordinated dawn raids target shell entities registered in Zurich, Cayman, and Singapore.',
      byline3: 'By Julian Thorne \u00b7 Legal Correspondent',
      exhibit3: 'DOSSIER #409',
      font3: "'Playfair Display', Georgia, serif",
      fontSize3: 11,
      scale3: 1.0,
      rot3: 1.6,
      x3: 0,
      y3: 0,

      // Card #4 (Bottom-Right: Urgent Breaking Alert)
      visible4: true,
      theme4: 'newsprint', bgColor4: '#ece6d8', textColor4: '#1a1816', accentColor4: '#dc2626', hlColor4: '#ef4444',
      source4: 'BLOOMBERG TERMINAL ALERT',
      kicker4: 'BREAKING NEWS',
      date3_5: '',
      date4: 'OCT 28, 2026',
      headline4: 'Mass Protests as $18B in Depositor Assets Frozen Worldwide',
      highlight4: '$18B in Depositor Assets Frozen',
      subhead4: 'Emergency central bank liquidity facility triggered as contagion spreads to European clearinghouses.',
      byline4: 'Wire Dispatch \u00b7 London / NY',
      exhibit4: 'URGENT WIRE',
      font4: "'Playfair Display', Georgia, serif",
      fontSize4: 11,
      scale4: 1.0,
      rot4: -1.8,
      x4: 0,
      y4: 0,

      // Card #5 (Center Hero Foreground Clipping: High-Contrast Broadsheet Spotlight)
      visible5: true,
      theme5: 'newsprint',
      bgColor5: '#f6f2e8', textColor5: '#0a0a0a', accentColor5: '#b91c1c',
      hlColor5: '#facc15',
      source5: 'THE WALL STREET INVESTIGATOR',
      kicker5: '',
      date5: 'OCT 28, 2026',
      headline5: 'The $40B Accounting Black Hole Exposed',
      highlight5: '$40B Accounting Black Hole',
      subhead5: 'How a decade of synthetic shadow loans disguised the largest corporate insolvency in modern history.',
      byline5: 'By Investigative Unit \u00b7 Special Report',
      exhibit5: '',
      font5: "'Playfair Display', Georgia, serif",
      fontSize5: 13,
      scale5: 1.06,
      rot5: -0.6,
      x5: 0,
      y5: 0
    }
  };

  window.TPL_CONTEXTUAL_DEFAULTS = DEFAULTS;

  const UNIVERSAL_BG_PRESETS = [
    { id: 'default', label: 'Default Scene', dot: '#64748b' },
    { id: 'cyber-grid', label: 'Cyber Set Grid', dot: '#38bdf8' },
    { id: 'cyber-3d-grid', label: '3D Cyber Grid', dot: '#c084fc' },
    { id: 'solid-black', label: 'Solid Black', dot: '#020617' },
    { id: 'transparent', label: 'No Background', dot: '#94a3b8' },
    { id: 'vox-doc', label: 'Vox Document', dot: '#d97706' },
    { id: 'embers', label: 'Floating Embers', dot: '#f97316' },
    { id: 'dawn', label: 'Dawn Horizon', dot: '#fbbf24' }
  ];
  window.UNIVERSAL_BG_PRESETS = UNIVERSAL_BG_PRESETS;

  window.tplBuildUniversalBgHtml = function(data) {
    const curPreset = (data && data.bgPreset) || 'default';
    const hasCustomMedia = !!(data && data.bgMediaUrl);
    return `
      <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 10px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">\ud83c\udf0c Studio Background &amp; Video B-Roll</span>
          ${hasCustomMedia ? `<button type="button" class="ubg-clear-media" style="background:rgba(239,68,68,0.18);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;cursor:pointer;">Clear Media</button>` : ''}
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
          ${UNIVERSAL_BG_PRESETS.map(p => {
            const active = !hasCustomMedia && curPreset === p.id;
            return `<button type="button" class="ubg-preset-btn" data-bg-preset="${p.id}" style="display:flex;align-items:center;gap:6px;padding:5px 7px;border-radius:5px;border:1px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.09)'};background:${active ? 'rgba(56,189,248,0.2)' : 'rgba(15,23,42,0.65)'};color:${active ? '#ffffff' : '#cbd5e1'};font-size:9.5px;font-weight:700;cursor:pointer;text-align:left;">
              <span style="width:8px;height:8px;border-radius:50%;background:${p.dot};border:1px solid rgba(255,255,255,0.35);flex-shrink:0;"></span>
              <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.label}</span>
            </button>`;
          }).join('')}
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px; border-top: 1px dashed rgba(255,255,255,0.08);">
          <span style="font-size: 9px; color: #94a3b8;">${hasCustomMedia ? (data.bgMediaType === 'video' ? '\ud83c\udfac Custom Video BG Active' : '\ud83d\uddbc\ufe0f Custom Image BG Active') : 'Upload custom video (.mp4/.webm) or image'}</span>
          <label style="font-size: 9.5px; font-weight: 800; color: #0f172a; background: linear-gradient(135deg, #38bdf8, #818cf8); padding: 4px 9px; border-radius: 5px; cursor: pointer; white-space: nowrap;">
            + Video / Image BG
            <input type="file" class="ubg-file-input" accept="video/*,image/*" style="display: none;" />
          </label>
        </div>
      </div>
    `;
  };

  window.tplWireUniversalBgControls = function(tplId, container) {
    if (!container) return;
    container.querySelectorAll('.ubg-preset-btn').forEach(btn => {
      btn.onclick = () => {
        const p = btn.dataset.bgPreset || 'default';
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
          topCustomizerState.secondaryUrl = '';
          topCustomizerState.secondaryIsVideo = false;
        }
        window.tplSetContextualData(tplId, { bgPreset: p, bgMediaUrl: '', feedUrl: '', bgMediaType: 'image' });
        window.tplRenderContextualInspector(tplId);
      };
    });
    const clearBtn = container.querySelector('.ubg-clear-media');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
          topCustomizerState.secondaryUrl = '';
          topCustomizerState.secondaryIsVideo = false;
        }
        window.tplSetContextualData(tplId, { bgMediaUrl: '', feedUrl: '', bgMediaType: 'image' });
        window.tplRenderContextualInspector(tplId);
      };
    }
    const fileInp = container.querySelector('.ubg-file-input');
    if (fileInp) {
      fileInp.onchange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        const isVid = f.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|$)/i.test(f.name);
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
          topCustomizerState.secondaryUrl = url;
          topCustomizerState.secondaryIsVideo = isVid;
          const thumbImg = document.getElementById('tpl-modal-thumb-secondary');
          const thumbVid = document.getElementById('tpl-modal-thumb-secondary-video');
          if (isVid) {
            if (thumbImg) thumbImg.style.display = 'none';
            if (thumbVid) { thumbVid.style.display = 'block'; thumbVid.src = url; }
          } else {
            if (thumbVid) thumbVid.style.display = 'none';
            if (thumbImg) { thumbImg.style.display = 'block'; thumbImg.src = url; }
          }
          const fnEl = document.getElementById('tpl-modal-filename-secondary');
          if (fnEl) fnEl.textContent = f.name.length > 22 ? f.name.substring(0, 20) + '...' : f.name;
        }
        window.tplSetContextualData(tplId, { bgMediaUrl: url, feedUrl: url, bgMediaType: isVid ? 'video' : 'image', bgPreset: 'default' });
        window.tplRenderContextualInspector(tplId);
      };
    }
  };

  window.tplRenderUniversalBgLayer = function(data) {
    let preset = (data && data.bgPreset) || (data && data.type === 'scramble' ? 'cyber-3d-grid' : 'default');
    if (data && data.type === 'scramble' && (!preset || preset === 'default')) {
      preset = 'cyber-3d-grid';
    }
    const bgUrl = (data && (data.bgMediaUrl || data.feedUrl)) || '';
    const isVideo = (data && data.bgMediaType === 'video') || (bgUrl && /\.(mp4|webm|mov)(\?|$)/i.test(bgUrl));
    const cls = 'tpl-universal-bg-layer' + (!bgUrl && preset !== 'default' ? ` bg-preset-${preset}` : '');
    if (bgUrl) {
      if (isVideo) {
        return `<div class="${cls}"><video class="tpl-universal-bg-video" src="${bgUrl}" autoplay loop muted playsinline></video></div>`;
      }
      return `<div class="${cls}" style="background:url('${bgUrl}') center/cover no-repeat;"></div>`;
    }
    return `<div class="${cls}"></div>`;
  };

  window.tplSyncUniversalBgStageLayer = function(rootEl, data) {
    if (!rootEl) return;
    let bgEl = rootEl.querySelector('.tpl-universal-bg-layer');
    if (!bgEl) {
      bgEl = document.createElement('div');
      bgEl.className = 'tpl-universal-bg-layer';
      rootEl.prepend(bgEl);
    }
    const isScramble = rootEl.classList.contains('tpl-scramble');
    let preset = (data && data.bgPreset) || (isScramble ? 'cyber-3d-grid' : 'default');
    if (isScramble && (!preset || preset === 'default')) {
      preset = 'cyber-3d-grid';
    }
    let bgUrl = (data && (data.bgMediaUrl || data.feedUrl)) || '';
    let isVideo = (data && data.bgMediaType === 'video') || (bgUrl && /\.(mp4|webm|mov)(\?|$)/i.test(bgUrl));

    // Fall back to topCustomizerState ONLY if preset is 'default', NEVER for scramble,
    // and never let primaryUrl (subject figure/portrait/robot) pollute the background layer!
    if (!isScramble && !bgUrl && (!preset || preset === 'default') && typeof topCustomizerState !== 'undefined' && topCustomizerState) {
      if (topCustomizerState.secondaryIsVideo && topCustomizerState.secondaryUrl) {
        bgUrl = topCustomizerState.secondaryUrl;
        isVideo = true;
      } else if (topCustomizerState.secondaryUrl && /^(blob:|data:)/i.test(topCustomizerState.secondaryUrl)) {
        bgUrl = topCustomizerState.secondaryUrl;
        isVideo = Boolean(topCustomizerState.secondaryIsVideo);
      }
    }

    const hasActiveBg = Boolean(bgUrl || (preset && preset !== 'default'));
    rootEl.classList.toggle('has-universal-bg', hasActiveBg);
    bgEl.className = 'tpl-universal-bg-layer' + (!bgUrl && preset !== 'default' ? ` bg-preset-${preset}` : '');
    if (bgUrl) {
      if (isVideo) {
        bgEl.style.background = '';
        let v = bgEl.querySelector('video');
        if (!v) {
          bgEl.innerHTML = `<video class="tpl-universal-bg-video" autoplay loop muted playsinline></video>`;
          v = bgEl.querySelector('video');
        }
        if (v && v.getAttribute('src') !== bgUrl) {
          v.setAttribute('src', bgUrl);
          v.src = bgUrl;
          v.play().catch(() => {});
        }
      } else {
        bgEl.innerHTML = '';
        bgEl.style.background = `url("${bgUrl}") center/cover no-repeat`;
      }
    } else {
      bgEl.innerHTML = '';
      bgEl.style.background = '';
    }
  };

  // --- 2. GET & SET CONTEXTUAL DATA ---
  window.tplGetContextualData = function(tplId) {
    if (!tplId) return {};
        const d = DEFAULTS[tplId];
    if (!d) return {};
    const stored = (localStore[tplId] && Object.keys(localStore[tplId]).length > 0) ? localStore[tplId] : {};
    const live = (typeof topCustomizerState !== 'undefined' && topCustomizerState.customData && topCustomizerState.customData[tplId]) ? topCustomizerState.customData[tplId] : {};
    return Object.assign({}, JSON.parse(JSON.stringify(d)), stored, live);
  };

  window.tplSetContextualData = function(tplId, patch) {
    if (!tplId) return;
        if (typeof topCustomizerState === 'undefined') window.topCustomizerState = {};
    if (!topCustomizerState.customData) topCustomizerState.customData = {};
    const cur = window.tplGetContextualData(tplId);
    const updated = Object.assign({}, cur, patch);
    topCustomizerState.customData[tplId] = updated;
    if (patch.figureImg) {
      topCustomizerState.primaryUrl = patch.figureImg;
      const pt = document.getElementById('tpl-modal-thumb-primary');
      if (pt) pt.src = patch.figureImg;
    }
    if (patch.mountainsImg) {
      topCustomizerState.secondaryUrl = patch.mountainsImg;
      const st = document.getElementById('tpl-modal-thumb-secondary');
      if (st) st.src = patch.mountainsImg;
    }
    localStore[tplId] = updated;
    persistStore();

    // Live update stage
    window.tplUpdateStageWithContextualData(tplId, updated);
  };

  // --- 2B. INVESTIGATIVE GLOBE & TACTICAL MAP BUILDER (Johnny Harris / Vox Style) ---
  const WORLD_GEO_DB = [
    { name: 'USA', aliases: ['united states', 'america', 'us', 'u.s.', 'u.s.a.'], lat: 39.8, lng: -98.5 },
    { name: 'New York, USA', aliases: ['new york', 'nyc', 'wall street', 'manhattan'], lat: 40.71, lng: -74.01 },
    { name: 'Washington DC', aliases: ['washington', 'dc', 'pentagon', 'langley'], lat: 38.90, lng: -77.04 },
    { name: 'Los Angeles, USA', aliases: ['los angeles', 'la', 'california', 'silicon valley', 'san francisco'], lat: 34.05, lng: -118.24 },
    { name: 'Canada', aliases: ['ottawa', 'toronto', 'vancouver', 'montreal'], lat: 56.13, lng: -106.35 },
    { name: 'Mexico', aliases: ['mexico city', 'cancun'], lat: 23.63, lng: -102.55 },
    { name: 'Panama', aliases: ['panama canal', 'panama city'], lat: 9.08, lng: -79.68 },
    { name: 'Cuba', aliases: ['havana'], lat: 21.52, lng: -77.78 },
    { name: 'Colombia', aliases: ['bogota', 'medellin'], lat: 4.57, lng: -74.30 },
    { name: 'Venezuela', aliases: ['caracas'], lat: 6.42, lng: -66.59 },
    { name: 'Brazil', aliases: ['sao paulo', 'rio de janeiro', 'brasilia', 'rio'], lat: -14.24, lng: -51.93 },
    { name: 'Peru', aliases: ['lima'], lat: -9.19, lng: -75.02 },
    { name: 'Chile', aliases: ['santiago'], lat: -35.68, lng: -71.54 },
    { name: 'Argentina', aliases: ['buenos aires'], lat: -38.42, lng: -63.62 },
    { name: 'Greenland', aliases: ['nuuk'], lat: 71.71, lng: -42.60 },
    { name: 'Iceland', aliases: ['reykjavik'], lat: 64.96, lng: -19.02 },
    { name: 'UK', aliases: ['united kingdom', 'britain', 'great britain', 'england', 'scotland'], lat: 54.0, lng: -2.0 },
    { name: 'London, UK', aliases: ['london'], lat: 51.50, lng: -0.12 },
    { name: 'Ireland', aliases: ['dublin'], lat: 53.14, lng: -7.69 },
    { name: 'France', aliases: ['paris', 'marseille'], lat: 46.23, lng: 2.21 },
    { name: 'Spain', aliases: ['madrid', 'barcelona'], lat: 40.46, lng: -3.75 },
    { name: 'Portugal', aliases: ['lisbon'], lat: 39.40, lng: -8.22 },
    { name: 'Germany', aliases: ['berlin', 'frankfurt', 'munich'], lat: 51.17, lng: 10.45 },
    { name: 'Netherlands', aliases: ['amsterdam', 'holland', 'rotterdam'], lat: 52.13, lng: 5.29 },
    { name: 'Belgium', aliases: ['brussels'], lat: 50.50, lng: 4.47 },
    { name: 'Switzerland', aliases: ['zurich', 'geneva', 'bern'], lat: 46.82, lng: 8.23 },
    { name: 'Italy', aliases: ['rome', 'milan', 'venice'], lat: 41.87, lng: 12.57 },
    { name: 'Austria', aliases: ['vienna'], lat: 47.52, lng: 14.55 },
    { name: 'Poland', aliases: ['warsaw', 'krakow'], lat: 51.92, lng: 19.15 },
    { name: 'Norway', aliases: ['oslo'], lat: 60.47, lng: 8.47 },
    { name: 'Sweden', aliases: ['stockholm'], lat: 60.13, lng: 18.64 },
    { name: 'Finland', aliases: ['helsinki'], lat: 61.92, lng: 25.75 },
    { name: 'Greece', aliases: ['athens'], lat: 39.07, lng: 21.82 },
    { name: 'Ukraine', aliases: ['kyiv', 'kiev', 'chernobyl', 'odessa'], lat: 48.37, lng: 31.16 },
    { name: 'Russia', aliases: ['moscow', 'st petersburg', 'kremlin', 'siberia'], lat: 61.52, lng: 90.0 },
    { name: 'Moscow, Russia', aliases: ['moscow'], lat: 55.75, lng: 37.62 },
    { name: 'Turkey', aliases: ['istanbul', 'ankara', 'turkiye'], lat: 38.96, lng: 35.24 },
    { name: 'Israel', aliases: ['tel aviv', 'jerusalem'], lat: 31.05, lng: 34.85 },
    { name: 'Egypt', aliases: ['cairo', 'suez', 'suez canal'], lat: 26.82, lng: 30.80 },
    { name: 'Morocco', aliases: ['casablanca', 'rabat', 'marrakesh'], lat: 31.79, lng: -7.09 },
    { name: 'Algeria', aliases: ['algiers'], lat: 28.03, lng: 1.66 },
    { name: 'Nigeria', aliases: ['lagos', 'abuja'], lat: 9.08, lng: 8.68 },
    { name: 'Kenya', aliases: ['nairobi'], lat: -0.02, lng: 37.91 },
    { name: 'Ethiopia', aliases: ['addis ababa'], lat: 9.15, lng: 40.49 },
    { name: 'South Africa', aliases: ['johannesburg', 'cape town', 'pretoria'], lat: -30.56, lng: 22.94 },
    { name: 'Saudi Arabia', aliases: ['riyadh', 'jeddah', 'mecca'], lat: 23.89, lng: 45.08 },
    { name: 'UAE', aliases: ['dubai', 'abu dhabi', 'emirates', 'united arab emirates'], lat: 23.42, lng: 53.85 },
    { name: 'Qatar', aliases: ['doha'], lat: 25.35, lng: 51.18 },
    { name: 'Iran', aliases: ['tehran', 'hormuz'], lat: 32.43, lng: 53.69 },
    { name: 'Pakistan', aliases: ['karachi', 'islamabad', 'lahore'], lat: 30.38, lng: 69.35 },
    { name: 'India', aliases: ['new delhi', 'delhi', 'mumbai', 'bangalore', 'bengaluru'], lat: 20.59, lng: 78.96 },
    { name: 'China', aliases: ['beijing', 'shanghai', 'shenzhen', 'guangzhou'], lat: 35.86, lng: 104.20 },
    { name: 'Hong Kong', aliases: ['hk'], lat: 22.32, lng: 114.17 },
    { name: 'Taiwan', aliases: ['taipei'], lat: 23.70, lng: 120.96 },
    { name: 'South Korea', aliases: ['korea', 'seoul', 'busan'], lat: 35.91, lng: 127.77 },
    { name: 'North Korea', aliases: ['pyongyang'], lat: 40.34, lng: 127.51 },
    { name: 'Japan', aliases: ['tokyo', 'osaka', 'kyoto'], lat: 36.20, lng: 138.25 },
    { name: 'Thailand', aliases: ['bangkok'], lat: 15.87, lng: 100.99 },
    { name: 'Vietnam', aliases: ['hanoi', 'ho chi minh', 'saigon'], lat: 14.06, lng: 108.28 },
    { name: 'Singapore', aliases: ['singapore strait', 'malacca'], lat: 1.35, lng: 103.82 },
    { name: 'Malaysia', aliases: ['kuala lumpur'], lat: 4.21, lng: 101.98 },
    { name: 'Indonesia', aliases: ['jakarta', 'bali'], lat: -0.79, lng: 113.92 },
    { name: 'Philippines', aliases: ['manila'], lat: 12.88, lng: 121.77 },
    { name: 'Australia', aliases: ['sydney', 'melbourne', 'canberra', 'perth'], lat: -25.27, lng: 133.78 },
    { name: 'New Zealand', aliases: ['auckland', 'wellington'], lat: -40.90, lng: 174.89 }
  ];
  window.WORLD_GEO_DB = WORLD_GEO_DB;

  window.tplResolveGeoLocation = function(query) {
    if (!query) return null;
    const q = String(query).trim().toLowerCase();
    if (!q) return null;
    for (const item of WORLD_GEO_DB) {
      if (item.name.toLowerCase() === q || item.aliases.includes(q)) return item;
    }
    for (const item of WORLD_GEO_DB) {
      if (item.name.toLowerCase().includes(q) || q.includes(item.name.toLowerCase()) || item.aliases.some(a => a.includes(q) || q.includes(a))) {
        return item;
      }
    }
    return null;
  };

  window.tplNearestCountryFromLatLng = function(lat, lng) {
    let best = WORLD_GEO_DB[0];
    let bestDist = Infinity;
    for (const item of WORLD_GEO_DB) {
      const d = Math.hypot(item.lat - lat, (item.lng - lng) * 0.75);
      if (d < bestDist) {
        bestDist = d;
        best = item;
      }
    }
    return best;
  };

  window.tplProjectLatLngToMapSvg = function(lat, lng) {
    const clampedLat = Math.max(-68, Math.min(76, parseFloat(lat) || 0));
    const clampedLng = Math.max(-172, Math.min(175, parseFloat(lng) || 0));
    const x = 200 + (clampedLng / 180) * 168;
    const y = 118 - (clampedLat / 90) * 86;
    return { x, y, normX: (x / 400) * 100, normY: (y / 225) * 100 };
  };

  window.tplSvgPointToLatLng = function(svgX, svgY) {
    const lng = Math.max(-170, Math.min(170, ((svgX - 200) / 168) * 180));
    const lat = Math.max(-65, Math.min(74, ((118 - svgY) / 86) * 90));
    return { lat: parseFloat(lat.toFixed(2)), lng: parseFloat(lng.toFixed(2)) };
  };

  function getCountryFlag(name) {
    if (!name) return '🌐';
    const n = String(name).toLowerCase();
    if (n.includes('usa') || n.includes('united states') || n.includes('america') || n.includes('us')) return '🇺🇸';
    if (n.includes('uk') || n.includes('britain') || n.includes('england') || n.includes('london')) return '🇬🇧';
    if (n.includes('ukraine') || n.includes('kyiv')) return '🇺🇦';
    if (n.includes('canada')) return '🇨🇦';
    if (n.includes('france') || n.includes('paris')) return '🇫🇷';
    if (n.includes('germany') || n.includes('berlin')) return '🇩🇪';
    if (n.includes('japan') || n.includes('tokyo')) return '🇯🇵';
    if (n.includes('china') || n.includes('beijing')) return '🇨🇳';
    if (n.includes('india') || n.includes('delhi')) return '🇮🇳';
    if (n.includes('australia') || n.includes('sydney')) return '🇦🇺';
    if (n.includes('italy') || n.includes('rome')) return '🇮🇹';
    if (n.includes('spain') || n.includes('madrid')) return '🇪🇸';
    if (n.includes('russia') || n.includes('moscow')) return '🇷🇺';
    if (n.includes('uae') || n.includes('dubai')) return '🇦🇪';
    if (n.includes('singapore')) return '🇸🇬';
    if (n.includes('korea') || n.includes('seoul')) return '🇰🇷';
    if (n.includes('egypt') || n.includes('cairo')) return '🇪🇬';
    if (n.includes('brazil')) return '🇧🇷';
    if (n.includes('mexico')) return '🇲🇽';
    return '📍';
  }

  function getCountrySvgPath(query) {
    if (!query || typeof window === 'undefined' || !window.ACCURATE_WORLD_MAP || !window.ACCURATE_WORLD_MAP.countries) return null;
    const rawQ = String(query).trim();
    const upper = rawQ.toUpperCase();
    const nameMap = {
      'USA': 'United States of America',
      'UNITED STATES': 'United States of America',
      'AMERICA': 'United States of America',
      'UK': 'United Kingdom',
      'UNITED KINGDOM': 'United Kingdom',
      'GREAT BRITAIN': 'United Kingdom',
      'BRITAIN': 'United Kingdom',
      'ENGLAND': 'United Kingdom',
      'LONDON': 'United Kingdom',
      'RUSSIA': 'Russia',
      'MOSCOW': 'Russia',
      'KOREA': 'South Korea',
      'S. KOREA': 'South Korea',
      'N. KOREA': 'North Korea',
      'DR CONGO': 'Dem. Rep. Congo',
      'DEM. REP. CONGO': 'Dem. Rep. Congo',
      'S. SUDAN': 'S. Sudan',
      'CENTRAL AFRICAN REPUBLIC': 'Central African Rep.',
      'DOMINICAN REPUBLIC': 'Dominican Rep.',
      'BOSNIA': 'Bosnia and Herz.',
      'CZECH REPUBLIC': 'Czechia',
      'UAE': 'United Arab Emirates'
    };
    const directMatch = nameMap[upper];
    if (directMatch && window.ACCURATE_WORLD_MAP.countries[directMatch]) {
      return window.ACCURATE_WORLD_MAP.countries[directMatch];
    }
    const q = rawQ.toLowerCase();
    for (const [name, path] of Object.entries(window.ACCURATE_WORLD_MAP.countries)) {
      const nl = name.toLowerCase();
      if (nl === q || nl.replace(/[^a-z]/g, '') === q.replace(/[^a-z]/g, '')) return path;
    }
    for (const [name, path] of Object.entries(window.ACCURATE_WORLD_MAP.countries)) {
      const nl = name.toLowerCase();
      if (nl.includes(q) || q.includes(nl)) return path;
    }
    return null;
  }

  function buildTransitVehicleSvg(mode, pathId, color, idx) {
    const dur = (2.8 + (idx % 3) * 0.45).toFixed(2) + 's';
    const col = color || '#38bdf8';
    if (mode === 'ship') {
      return `
        <g filter="url(#mapGlowFilter)">
          <g>
            <animateMotion dur="${dur}" repeatCount="indefinite" rotate="auto">
              <mpath href="#${pathId}"/>
            </animateMotion>
            <path d="M -9 -2 L 6 -2 L 10 0 L 6 2 L -9 2 Z" fill="${col}" stroke="#ffffff" stroke-width="0.75"/>
            <rect x="-5" y="-1.4" width="4" height="2.8" rx="0.5" fill="#ffffff"/>
            <rect x="0" y="-1.4" width="3.5" height="2.8" rx="0.5" fill="#fbbf24"/>
            <path d="M -10 -1.5 L -16 -3.5 M -10 1.5 L -16 3.5" stroke="#ffffff" stroke-width="0.6" opacity="0.75"/>
          </g>
        </g>
      `;
    }
    if (mode === 'train') {
      return `
        <g filter="url(#mapGlowFilter)">
          <g>
            <animateMotion dur="${dur}" repeatCount="indefinite" rotate="auto">
              <mpath href="#${pathId}"/>
            </animateMotion>
            <rect x="-9" y="-2.2" width="14" height="4.4" rx="2.2" fill="${col}" stroke="#ffffff" stroke-width="0.75"/>
            <path d="M 3 -1.5 L 7 0 L 3 1.5 Z" fill="#ffffff"/>
            <line x1="-6" y1="-1" x2="1" y2="-1" stroke="#ffffff" stroke-width="0.6" stroke-dasharray="1.5 1"/>
            <line x1="-6" y1="1" x2="1" y2="1" stroke="#ffffff" stroke-width="0.6" stroke-dasharray="1.5 1"/>
          </g>
        </g>
      `;
    }
    if (mode === 'line') {
      return `
        <g filter="url(#mapGlowFilter)">
          <circle r="3.2" fill="#ffffff" stroke="${col}" stroke-width="1.6">
            <animateMotion dur="${dur}" repeatCount="indefinite">
              <mpath href="#${pathId}"/>
            </animateMotion>
          </circle>
        </g>
      `;
    }
    // High-End Sleek Tactical Twin-Engine Jet Aircraft Silhouette (Vox / Hoyoverse Style)
    return `
      <g filter="url(#arcGlowFilter)">
        <g>
          <animateMotion dur="${dur}" repeatCount="indefinite" rotate="auto">
            <mpath href="#${pathId}"/>
          </animateMotion>
          <!-- Engine Jet Exhaust Trail -->
          <line x1="-9" y1="0" x2="-22" y2="0" stroke="${col}" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
          <circle cx="-9" cy="0" r="2.8" fill="${col}" opacity="0.95"/>
          <!-- Crisp Pure White Aerodynamic Vector Aircraft -->
          <path d="M 10 0 L 2.8 -1.6 L -2.8 -9.8 L -4.8 -9.8 L -2.2 -1.6 L -7.8 -1.4 L -10.2 -4.8 L -11.8 -4.8 L -10.5 0 L -11.8 4.8 L -10.2 4.8 L -7.8 1.4 L -2.2 1.6 L -4.8 9.8 L -2.8 9.8 L 2.8 1.6 Z" fill="#ffffff" stroke="${col}" stroke-width="0.8"/>
          <!-- Cockpit & Wingtip Accents -->
          <circle cx="4" cy="0" r="0.9" fill="${col}"/>
          <circle cx="-3.8" cy="-9.2" r="0.8" fill="${col}"/>
          <circle cx="-3.8" cy="9.2" r="0.8" fill="${col}"/>
        </g>
      </g>
    `;
  }

  window.tplBuildInvestigativeGlobeHtml = function(mData) {
    const d = mData || (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('map') : {});
    const proj = d.projection || 'globe';
    const styleKey = d.mapStyle || 'harris-dark';
    const pinColor = d.pinColor || '#38bdf8';
    const zoomStart = Math.max(0, parseFloat(d.zoomStart !== undefined ? d.zoomStart : 0.8));
    const zoomDur = Math.max(0.5, parseFloat(d.zoomDuration !== undefined ? d.zoomDuration : 2.2));
    const zoomLvl = Math.max(1.1, Math.min(5, parseFloat(d.zoomLevel !== undefined ? d.zoomLevel : 1.9)));
    const totalCycle = (zoomStart + zoomDur + 3.0).toFixed(2);
    const showArc = d.showFlightPath !== false;
    const is3D = !!d.is3DMode;
    const isDrawing = !!d.drawOnScreenMode;
    const pitch3D = d.pitch3D !== undefined ? parseFloat(d.pitch3D) : 22;
    const yaw3D = d.yaw3D !== undefined ? parseFloat(d.yaw3D) : -10;

    const themes = {
      'harris-dark': {
        bg: 'radial-gradient(circle at 50% 50%, #061324 0%, #01050d 100%)',
        ocean: '#051325',
        oceanLight: '#0d2745',
        land: '#0a1c33',
        landStroke: '#38bdf8',
        landGlow: 'rgba(56, 189, 248, 0.45)',
        borderStroke: 'rgba(56, 189, 248, 0.32)',
        highlightCountry: '#fbbf24',
        highlightGlow: 'rgba(251, 191, 36, 0.65)',
        labelCol: 'rgba(226, 232, 240, 0.75)',
        grid: 'rgba(56, 189, 248, 0.16)',
        atmo: '#38bdf8',
        atmoOuter: 'rgba(56, 189, 248, 0.55)',
        fresnelRim: '#7dd3fc'
      },
      'satellite': {
        bg: 'radial-gradient(circle at 50% 50%, #051a2e 0%, #010813 100%)',
        ocean: '#041527',
        oceanLight: '#0b2e45',
        land: '#0e2d22',
        landStroke: '#52b788',
        landGlow: 'rgba(82, 183, 136, 0.45)',
        borderStroke: 'rgba(116, 198, 157, 0.32)',
        highlightCountry: '#34d399',
        highlightGlow: 'rgba(52, 211, 153, 0.65)',
        labelCol: 'rgba(241, 245, 249, 0.82)',
        grid: 'rgba(82, 183, 136, 0.18)',
        atmo: '#38bdf8',
        atmoOuter: 'rgba(56, 189, 248, 0.5)',
        fresnelRim: '#7dd3fc'
      },
      'vox-archival': {
        bg: 'radial-gradient(circle at 50% 50%, #201a14 0%, #0a0705 100%)',
        ocean: '#15110d',
        oceanLight: '#2b231a',
        land: '#544633',
        landStroke: '#f4ecd8',
        landGlow: 'rgba(244, 236, 216, 0.45)',
        borderStroke: 'rgba(244, 236, 216, 0.35)',
        highlightCountry: '#fbbf24',
        highlightGlow: 'rgba(251, 191, 36, 0.65)',
        labelCol: 'rgba(254, 243, 199, 0.85)',
        grid: 'rgba(244, 236, 216, 0.15)',
        atmo: '#f59e0b',
        atmoOuter: 'rgba(245, 158, 11, 0.45)',
        fresnelRim: '#fde68a'
      },
      'radar-amber': {
        bg: 'radial-gradient(circle at 50% 50%, #170d03 0%, #060301 100%)',
        ocean: '#100802',
        oceanLight: '#261304',
        land: '#351804',
        landStroke: '#f59e0b',
        landGlow: 'rgba(245, 158, 11, 0.45)',
        borderStroke: 'rgba(245, 158, 11, 0.35)',
        highlightCountry: '#ef4444',
        highlightGlow: 'rgba(239, 68, 68, 0.65)',
        labelCol: 'rgba(253, 230, 138, 0.82)',
        grid: 'rgba(245, 158, 11, 0.18)',
        atmo: '#f59e0b',
        atmoOuter: 'rgba(245, 158, 11, 0.5)',
        fresnelRim: '#fde68a'
      }
    };
    const th = themes[styleKey] || themes['harris-dark'];

    const activeRoutes = Array.isArray(d.routes) && d.routes.length > 0 ? d.routes : [
      { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 51.50, toLng: -0.12, mode: 'plane', color: '#38bdf8' },
      { from: 'UK', to: 'Ukraine', fromLat: 51.50, fromLng: -0.12, toLat: 48.37, toLng: 31.16, mode: 'plane', color: '#38bdf8' }
    ];
    const customRoutes = Array.isArray(d.customTracedRoutes) ? d.customTracedRoutes : [];

    // Target Destination (primary focus) & Origin
    const lastRoute = activeRoutes[activeRoutes.length - 1];
    const firstRoute = activeRoutes[0];
    const targetName = (lastRoute && lastRoute.to) ? lastRoute.to : (d.location ? d.location.split('→').pop().trim() : 'Ukraine');
    const originName = (firstRoute && firstRoute.from) ? firstRoute.from : 'London';

    const targetLat = lastRoute && lastRoute.toLat !== undefined ? parseFloat(lastRoute.toLat) : (d.lat !== undefined ? parseFloat(d.lat) : 48.37);
    const targetLng = lastRoute && lastRoute.toLng !== undefined ? parseFloat(lastRoute.toLng) : (d.lng !== undefined ? parseFloat(d.lng) : 31.16);
    const originLat = firstRoute && firstRoute.fromLat !== undefined ? parseFloat(firstRoute.fromLat) : 51.50;
    const originLng = firstRoute && firstRoute.fromLng !== undefined ? parseFloat(firstRoute.fromLng) : -0.12;

    const targetProj = window.tplProjectLatLngToMapSvg(targetLat, targetLng);
    const originProj = window.tplProjectLatLngToMapSvg(originLat, originLng);

    const normX = Math.max(16, Math.min(84, targetProj.normX));
    const normY = Math.max(18, Math.min(82, targetProj.normY));
    const panX = ((50 - normX) * 0.28).toFixed(1) + '%';
    const panY = ((50 - normY) * 0.28).toFixed(1) + '%';

    const targetCoordsStr = `${Math.abs(targetLat).toFixed(2)}°${targetLat >= 0 ? 'N' : 'S'} ${Math.abs(targetLng).toFixed(2)}°${targetLng >= 0 ? 'E' : 'W'}`;
    const originCoordsStr = `${Math.abs(originLat).toFixed(2)}°${originLat >= 0 ? 'N' : 'S'} ${Math.abs(originLng).toFixed(2)}°${originLng >= 0 ? 'E' : 'W'}`;

    // High-Definition Vector Cartography Engine (Natural Earth 110m Real TopoJSON Geometry)
    const accurateMapData = (typeof window !== "undefined" && window.ACCURATE_WORLD_MAP) ? window.ACCURATE_WORLD_MAP : null;
    let highPrecisionWorldVectors = "";
    if (accurateMapData && accurateMapData.land) {
      highPrecisionWorldVectors = `
        <g class="world-landmasses" fill="${th.land}" stroke="${th.landStroke}" stroke-width="0.55" stroke-linejoin="round" fill-opacity="0.94">
          <path d="${accurateMapData.land}"/>
        </g>
      `;
    } else {
      highPrecisionWorldVectors = `
        <g class="world-landmasses" fill="${th.land}" stroke="${th.landStroke}" stroke-width="0.65" stroke-linejoin="round" fill-opacity="0.94">
          <path d="M 32 40 L 42 35 L 56 34 L 72 32 L 86 31 L 98 33 L 112 37 L 126 44 L 136 54 L 128 62 L 134 70 L 124 78 L 116 86 L 112 94 L 108 97 L 105 91 L 96 92 L 91 97 L 95 105 L 104 110 L 98 114 L 90 106 L 82 101 L 75 91 L 72 83 L 68 87 L 65 77 L 62 67 L 55 54 L 42 52 L 32 46 Z"/>
          <path d="M 94 22 L 114 20 L 124 26 L 118 33 L 98 30 Z"/>
          <path d="M 128 14 L 158 12 L 166 22 L 156 36 L 138 38 L 130 26 Z"/>
          <path d="M 106 112 L 118 110 L 130 115 L 142 122 L 152 132 L 148 146 L 140 160 L 130 174 L 122 192 L 116 194 L 114 178 L 112 158 L 105 140 L 102 124 Z"/>
          <path d="M 194 48 L 198 47 L 201 51 L 199 57 L 202 62 L 199 68 L 194 69 L 191 66 L 193 58 L 191 52 Z"/>
          <path d="M 188 51 L 192 50 L 192 58 L 187 59 L 186 54 Z"/>
          <path d="M 197 32 L 210 26 L 224 28 L 228 38 L 222 45 L 215 42 L 206 45 L 198 40 Z"/>
          <path d="M 184 63 L 191 61 L 195 56 L 203 52 L 213 50 L 223 48 L 234 46 L 242 54 L 236 64 L 228 68 L 220 70 L 216 64 L 212 68 L 215 74 L 211 76 L 206 68 L 201 66 L 193 70 L 184 70 Z"/>
          <path d="M 235 30 L 268 24 L 308 24 L 348 30 L 372 38 L 364 52 L 352 58 L 346 72 L 338 86 L 328 96 L 320 108 L 314 102 L 306 94 L 296 96 L 288 110 L 280 96 L 270 90 L 258 84 L 248 72 L 238 56 Z"/>
          <path d="M 183 75 L 203 73 L 217 77 L 229 79 L 237 91 L 249 103 L 245 119 L 239 137 L 231 155 L 219 171 L 209 171 L 203 153 L 199 135 L 193 117 L 179 111 L 173 97 L 177 83 Z"/>
          <path d="M 264 85 L 276 86 L 286 96 L 282 108 L 274 106 L 268 94 Z"/>
          <path d="M 288 64 L 324 62 L 332 74 L 324 88 L 304 90 L 292 78 Z"/>
          <path d="M 322 142 L 344 138 L 362 144 L 368 158 L 360 174 L 342 176 L 322 168 L 316 154 Z"/>
        </g>
      `;
    }

    // Dynamic Country Highlighting: lookup exact polygon geometry of the active target country
    const targetCountrySvgPath = getCountrySvgPath(targetName);
    const highlightedCountryMarkup = targetCountrySvgPath ? `
      <g class="tactical-highlight-country">
        <path d="${targetCountrySvgPath}" fill="rgba(251, 191, 36, 0.16)" stroke="${th.highlightCountry}" stroke-width="1.3" filter="url(#activeCountryGlow)"/>
      </g>
    ` : `
      <g class="tactical-highlight-country">
        <circle cx="${targetProj.x.toFixed(1)}" cy="${targetProj.y.toFixed(1)}" r="10" fill="rgba(251, 191, 36, 0.12)" stroke="${th.highlightCountry}" stroke-width="1.2" filter="url(#activeCountryGlow)"/>
      </g>
    `;

    // Faint Topographic / Bathymetric Depth Contours
    const bathymetricContoursMarkup = `
      <g stroke="${th.grid}" stroke-width="0.32" fill="none" opacity="0.45">
        <path d="M 180 60 C 188 56, 196 52, 204 50 C 216 48, 228 44, 240 44"/>
        <path d="M 178 72 C 188 70, 200 70, 214 74 C 224 76, 234 74, 246 76"/>
        <path d="M 180 84 C 196 82, 212 84, 228 86 C 240 88, 252 86, 264 92"/>
        <path d="M 194 116 C 210 114, 226 122, 242 134"/>
      </g>
    `;

    // Dynamic Country Labels with Proximity Occlusion Management
    const countryLabelsDb = [
      { name: "RUSSIA", x: 260, y: 35 },
      { name: "UK", x: 189, y: 67 },
      { name: "FRANCE", x: 198, y: 77 },
      { name: "SPAIN", x: 187, y: 83 },
      { name: "GERMANY", x: 209, y: 73 },
      { name: "POLAND", x: 219, y: 71 },
      { name: "ITALY", x: 212, y: 81 },
      { name: "ROMANIA", x: 222, y: 76 },
      { name: "TURKEY", x: 236, y: 81 },
      { name: "SWEDEN", x: 212, y: 52 },
      { name: "FINLAND", x: 226, y: 50 },
      { name: "KAZAKHSTAN", x: 264, y: 73 },
      { name: "IRAN", x: 254, y: 85 },
      { name: "IRAQ", x: 242, y: 86 },
      { name: "SYRIA", x: 236, y: 86 },
      { name: "SAUDI ARABIA", x: 248, y: 96 },
      { name: "YEMEN", x: 254, y: 104 },
      { name: "MOROCCO", x: 188, y: 89 },
      { name: "ALGERIA", x: 202, y: 93 },
      { name: "LIBYA", x: 220, y: 93 },
      { name: "EGYPT", x: 232, y: 93 },
      { name: "SUDAN", x: 228, y: 105 },
      { name: "CHAD", x: 218, y: 105 },
      { name: "NIGER", x: 206, y: 104 },
      { name: "NIGERIA", x: 203, y: 112 },
      { name: "ETHIOPIA", x: 238, y: 110 },
      { name: "S. SUDAN", x: 228, y: 113 },
      { name: "DR CONGO", x: 218, y: 124 },
      { name: "KENYA", x: 236, y: 121 },
      { name: "TANZANIA", x: 234, y: 129 },
      { name: "ANGOLA", x: 213, y: 135 },
      { name: "ZAMBIA", x: 226, y: 137 },
      { name: "INDIA", x: 276, y: 98 }
    ];

    // Build Set of active route locations to eliminate duplicate redundant static labels
    const activeRouteNames = new Set();
    activeRoutes.forEach(r => {
      if (r.from) activeRouteNames.add(r.from.trim().toUpperCase());
      if (r.to) activeRouteNames.add(r.to.trim().toUpperCase());
    });

    // Filter country labels based on proximity to target and origin to avoid visual clutter
    const filteredLabelsHtml = countryLabelsDb.map(lbl => {
      if (activeRouteNames.has(lbl.name)) return "";
      const dTarget = Math.hypot(lbl.x - targetProj.x, lbl.y - targetProj.y);
      const dOrigin = Math.hypot(lbl.x - originProj.x, lbl.y - originProj.y);
      if (dTarget < 16 || dOrigin < 14) return "";
      const isSubtle = (dTarget < 26 || dOrigin < 22);
      return `<text x="${lbl.x}" y="${lbl.y}" fill="${th.labelCol}" opacity="${isSubtle ? 0.35 : 0.82}">${lbl.name}</text>`;
    }).join("");

    // Decluttered Waypoints Registry: render unique, non-overlapping waypoints and HUD tags
    const renderedNodes = new Map();

    // Great-Circle Parabolic 3D Arcs + Clean Multi-Route Transit Trails
    const routeElementsHtml = showArc ? activeRoutes.map((rt, idx) => {
      const fGeo = (rt.fromLat !== undefined && rt.fromLng !== undefined)
        ? { lat: rt.fromLat, lng: rt.fromLng }
        : (window.tplResolveGeoLocation(rt.from) || { lat: 39.8, lng: -98.5 });
      const tGeo = (rt.toLat !== undefined && rt.toLng !== undefined)
        ? { lat: rt.toLat, lng: rt.toLng }
        : (window.tplResolveGeoLocation(rt.to) || { lat: 48.37, lng: 31.16 });

      const p1 = window.tplProjectLatLngToMapSvg(fGeo.lat, fGeo.lng);
      const p2 = window.tplProjectLatLngToMapSvg(tGeo.lat, tGeo.lng);
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      // High-altitude parabolic 3D flight trajectory curve
      const arcLift = Math.min(38, Math.max(16, dist * 0.32));
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2 - arcLift;
      const pathId = `map-route-path-${idx}`;
      const col = rt.color || "#38bdf8";
      const isLastLeg = (idx === activeRoutes.length - 1);

      // Unique node tracking for Waypoint 1 (Origin)
      const p1Key = `${Math.round(p1.x / 8)}_${Math.round(p1.y / 8)}`;
      let originNodeHtml = "";
      if (!renderedNodes.has(p1Key)) {
        renderedNodes.set(p1Key, true);
        originNodeHtml = `
          <!-- Waypoint Origin Node -->
          <circle cx="${p1.x.toFixed(1)}" cy="${p1.y.toFixed(1)}" r="2.4" fill="${col}" stroke="#ffffff" stroke-width="0.8"/>
          <circle cx="${p1.x.toFixed(1)}" cy="${p1.y.toFixed(1)}" r="5.2" fill="none" stroke="${col}" stroke-width="0.6" opacity="0.7"/>
          ${idx === 0 ? `
            <g class="map-waypoint-hud" transform="translate(${p1.x.toFixed(1)}, ${p1.y.toFixed(1)})">
              <path d="M 0 -2.4 L 0 -10 L 16 -10" fill="none" stroke="${col}" stroke-width="0.65" opacity="0.85"/>
              <text x="18" y="-13" fill="#ffffff" font-family="'Space Grotesk',sans-serif" font-size="4.2" font-weight="900" letter-spacing="0.06em">${(rt.from || "ORIGIN").toUpperCase()}</text>
              <text x="18" y="-8.5" fill="${col}" font-family="'JetBrains Mono',monospace" font-size="2.9" font-weight="700" letter-spacing="0.04em">${originCoordsStr}</text>
            </g>
          ` : ""}
        `;
      }

      // Unique node tracking for Waypoint 2 (Destination or Intermediate Transfer Node)
      const p2Key = `${Math.round(p2.x / 8)}_${Math.round(p2.y / 8)}`;
      let destNodeHtml = "";
      if (isLastLeg) {
        // Multi-Ring Concentric Tactical HUD Reticle matching Image 2 for the Primary Destination
        destNodeHtml = `
          <g class="map-target-reticle" transform="translate(${p2.x.toFixed(1)}, ${p2.y.toFixed(1)})">
            <!-- Expanding Radar Pulse Ring -->
            <circle cx="0" cy="0" r="6" fill="none" stroke="${col}" stroke-width="1" class="hud-radar-pulse"/>
            <!-- Outer Dashed Reticle Ring -->
            <circle cx="0" cy="0" r="15" fill="none" stroke="${col}" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.85"/>
            <!-- Inner Solid Reticle Ring -->
            <circle cx="0" cy="0" r="9.5" fill="none" stroke="${col}" stroke-width="1.2" opacity="0.95"/>
            <!-- 4-Corner Crosshair Ticks -->
            <path d="M -12 -12 L -9 -12 M -12 -12 L -12 -9 M 12 -12 L 9 -12 M 12 -12 L 12 -9 M -12 12 L -9 12 M -12 12 L -12 9 M 12 12 L 9 12 M 12 12 L 12 9" stroke="${col}" stroke-width="0.8" fill="none"/>
            <!-- Center Glowing Target Node -->
            <circle cx="0" cy="0" r="3.2" fill="${th.highlightCountry}" stroke="#ffffff" stroke-width="0.8"/>
            <circle cx="0" cy="0" r="1.2" fill="#ffffff"/>

            <!-- Tactical Leader Line + Target HUD Tag -->
            <path d="M 0 -9.5 L 0 -17 L 24 -17" fill="none" stroke="${col}" stroke-width="0.75" opacity="0.85"/>
            <text x="26" y="-20" fill="#ffffff" font-family="'Space Grotesk',sans-serif" font-size="5" font-weight="900" letter-spacing="0.08em">${targetName.toUpperCase()}</text>
            <text x="26" y="-14.5" fill="${col}" font-family="'JetBrains Mono',monospace" font-size="3.3" font-weight="700" letter-spacing="0.05em">${targetCoordsStr}</text>
          </g>
        `;
        renderedNodes.set(p2Key, true);
      } else if (!renderedNodes.has(p2Key)) {
        renderedNodes.set(p2Key, true);
        const intermediateName = (rt.to || "").toUpperCase() === "UK" ? "LONDON" : (rt.to || "WAYPOINT").toUpperCase();
        const intermediateCoords = (rt.to || "").toUpperCase() === "UK" ? "51.50°N 0.12°W" : `${Math.abs(tGeo.lat).toFixed(2)}°${tGeo.lat >= 0 ? "N" : "S"} ${Math.abs(tGeo.lng).toFixed(2)}°${tGeo.lng >= 0 ? "E" : "W"}`;
        destNodeHtml = `
          <!-- Intermediate Transfer Node & Waypoint HUD (e.g. London / UK in Image 2) -->
          <g class="map-intermediate-hud" transform="translate(${p2.x.toFixed(1)}, ${p2.y.toFixed(1)})">
            <circle cx="0" cy="0" r="2.6" fill="${col}" stroke="#ffffff" stroke-width="0.8"/>
            <circle cx="0" cy="0" r="5.2" fill="none" stroke="${col}" stroke-width="0.6" opacity="0.7"/>
            <path d="M 0 -2.6 L 0 -11 L 18 -11" fill="none" stroke="${col}" stroke-width="0.65" opacity="0.85"/>
            <text x="20" y="-14" fill="#ffffff" font-family="'Space Grotesk',sans-serif" font-size="4.4" font-weight="900" letter-spacing="0.06em">${intermediateName}</text>
            <text x="20" y="-9" fill="${col}" font-family="'JetBrains Mono',monospace" font-size="2.9" font-weight="700" letter-spacing="0.04em">${intermediateCoords}</text>
          </g>
        `;
      } else {
        destNodeHtml = `
          <circle cx="${p2.x.toFixed(1)}" cy="${p2.y.toFixed(1)}" r="2.2" fill="${col}" stroke="#ffffff" stroke-width="0.7" opacity="0.85"/>
        `;
      }

      return `
        <g class="map-route-group" data-route-idx="${idx}">
          <!-- Glowing Parabolic Under-Stroke -->
          <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${col}" stroke-width="4.8" opacity="0.28" filter="url(#arcGlowFilter)"/>
          <!-- Core Luminous Arc Path -->
          <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${col}" stroke-width="1.8" opacity="0.95"/>
          <!-- Dynamic Animated Dash-Array Motion Trail -->
          <path id="${pathId}" class="map-animated-arc" d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-dasharray="8 4 2 4" opacity="0.9"/>

          ${originNodeHtml}
          ${destNodeHtml}

          <!-- Moving Transit Vehicle (Jet / Train / Ship) along Great-Circle Arc -->
          ${buildTransitVehicleSvg(rt.mode || "plane", pathId, col, idx)}
        </g>
      `;
    }).join("") : "";

    // Custom on-screen traced routes (for 3D Direct Tracing mode)
    const customTraceHtml = customRoutes.map((cr, cIdx) => {
      const pts = Array.isArray(cr.points) ? cr.points : [];
      if (pts.length < 2) return '';
      const dStr = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
      const cPathId = `map-custom-trace-${cIdx}`;
      const col = cr.color || '#2effc6';
      return `
        <g class="map-custom-trace-group">
          <path d="${dStr}" fill="none" stroke="${col}" stroke-width="3" opacity="0.25" stroke-linecap="round" stroke-linejoin="round"/>
          <path id="${cPathId}" d="${dStr}" fill="none" stroke="${col}" stroke-width="1.6" stroke-dasharray="3 2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="${pts[0].x.toFixed(1)}" cy="${pts[0].y.toFixed(1)}" r="2.6" fill="${col}" stroke="#fff" stroke-width="0.8"/>
          <circle cx="${pts[pts.length - 1].x.toFixed(1)}" cy="${pts[pts.length - 1].y.toFixed(1)}" r="3" fill="#ef4444" stroke="#fff" stroke-width="0.9"/>
          ${buildTransitVehicleSvg(cr.mode || 'plane', cPathId, col, cIdx + 3)}
        </g>
      `;
    }).join('');

    const globeShiftX = ((50 - normX) * 0.65).toFixed(1);
    const globeShiftY = ((50 - normY) * 0.45).toFixed(1);

    const globeSvg = proj === 'globe' ? `
      <svg class="globe-svg" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Volumetric 3D Sphere Shading Shader (Depth & Upper-Left Sun Rim) -->
          <radialGradient id="globeSphereGrad" cx="35%" cy="30%" r="72%">
            <stop offset="0%" stop-color="${th.oceanLight}" stop-opacity="1"/>
            <stop offset="48%" stop-color="${th.ocean}" stop-opacity="1"/>
            <stop offset="82%" stop-color="#020814" stop-opacity="1"/>
            <stop offset="100%" stop-color="#01040a" stop-opacity="1"/>
          </radialGradient>

          <!-- Sci-Fi 3D Fresnel Atmosphere Rim Glow (Authentic Earth Limb Brightening) -->
          <radialGradient id="globeFresnelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stop-color="${th.atmo}" stop-opacity="0"/>
            <stop offset="89%" stop-color="${th.atmo}" stop-opacity="0.25"/>
            <stop offset="96%" stop-color="${th.fresnelRim}" stop-opacity="0.7"/>
            <stop offset="99%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="1"/>
          </radialGradient>

          <!-- Volumetric Terminator Depth Shadow Overlay -->
          <radialGradient id="globeDepthShadow" cx="28%" cy="24%" r="80%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08"/>
            <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
            <stop offset="85%" stop-color="#010611" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#000308" stop-opacity="0.88"/>
          </radialGradient>

          <clipPath id="globeClipCircle">
            <circle cx="200" cy="114" r="102"/>
          </clipPath>

          <filter id="outerAtmoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
          </filter>
          <filter id="arcGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5"/>
          </filter>
          <filter id="activeCountryGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${th.highlightCountry}" flood-opacity="0.85"/>
          </filter>
          <filter id="mapGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.85"/>
          </filter>
        </defs>

        <!-- Outer Space Deep Stars & Telemetry Grid -->
        <g stroke="${th.grid}" stroke-width="0.45" opacity="0.32">
          <line x1="0" y1="45" x2="400" y2="45"/><line x1="0" y1="112" x2="400" y2="112"/><line x1="0" y1="180" x2="400" y2="180"/>
          <line x1="80" y1="0" x2="80" y2="225"/><line x1="200" y1="0" x2="200" y2="225"/><line x1="320" y1="0" x2="320" y2="225"/>
        </g>

        <!-- Multi-Layer 3D Atmosphere Rim Lighting Halo (Fresnel Glow along Earth Curve) -->
        <circle cx="200" cy="114" r="102" fill="none" stroke="${th.atmo}" stroke-width="2.5" opacity="0.95" filter="url(#outerAtmoGlow)"/>
        <circle cx="200" cy="114" r="106" fill="none" stroke="#0ea5e9" stroke-width="5" opacity="0.45" filter="url(#outerAtmoGlow)"/>
        <circle cx="200" cy="114" r="111" fill="none" stroke="${th.atmo}" stroke-width="9" opacity="0.18" filter="url(#outerAtmoGlow)"/>

        <!-- Circumference Telemetry Degree Marks -->
        <circle cx="200" cy="114" r="102" fill="url(#globeSphereGrad)" stroke="rgba(56,189,248,0.7)" stroke-width="1.2"/>

        <!-- Clipped 3D Orthographic Globe Body -->
        <g clip-path="url(#globeClipCircle)">
          <!-- Curved 3D Spherical Graticules (Latitude Parallels & Longitude Meridians) -->
          <g stroke="${th.grid}" stroke-width="0.55" fill="none" opacity="0.85">
            <!-- Parallels (Latitudes) -->
            <ellipse cx="200" cy="62" rx="74" ry="22"/>
            <ellipse cx="200" cy="78" rx="88" ry="26"/>
            <ellipse cx="200" cy="95" rx="98" ry="30"/>
            <ellipse cx="200" cy="105" rx="101" ry="31"/>
            <ellipse cx="200" cy="114" rx="102" ry="32"/>
            <line x1="98" y1="114" x2="302" y2="114"/>
            <ellipse cx="200" cy="123" rx="101" ry="31"/>
            <ellipse cx="200" cy="133" rx="98" ry="30"/>
            <ellipse cx="200" cy="150" rx="88" ry="26"/>
            <ellipse cx="200" cy="166" rx="74" ry="22"/>

            <!-- Meridians (Longitudes) -->
            <ellipse cx="200" cy="114" rx="28" ry="102"/>
            <ellipse cx="200" cy="114" rx="58" ry="102"/>
            <ellipse cx="200" cy="114" rx="85" ry="102"/>
            <line x1="200" y1="12" x2="200" y2="216"/>
          </g>

          <!-- Interactive Transformed Coordinate Plane -->
          <g class="map-interactive-coord-plane" transform="translate(${globeShiftX}, ${globeShiftY})">
            ${highPrecisionWorldVectors}
            ${highlightedCountryMarkup}
            ${bathymetricContoursMarkup}
            <g font-family="'JetBrains Mono', 'Space Grotesk', monospace" font-size="3.2" font-weight="700" letter-spacing="0.08em" text-anchor="middle" style="pointer-events:none; user-select:none;">
              ${filteredLabelsHtml}
            </g>
            ${routeElementsHtml}
            ${customTraceHtml}
          </g>

          <!-- 3D Volumetric Terminator Depth Shadow Overlay -->
          <circle cx="200" cy="114" r="102" fill="url(#globeDepthShadow)" pointer-events="none"/>

          <!-- 3D Fresnel Limb Rim Glow Overlay (Inner Edge Highlight) -->
          <circle cx="200" cy="114" r="102" fill="url(#globeFresnelGrad)" pointer-events="none"/>
        </g>
      </svg>
    ` : `
      <svg class="globe-svg" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="arcGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5"/>
          </filter>
          <filter id="activeCountryGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${th.highlightCountry}" flood-opacity="0.85"/>
          </filter>
          <filter id="mapGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.85"/>
          </filter>
        </defs>
        <rect width="400" height="225" fill="${th.ocean}"/>
        <g stroke="${th.grid}" stroke-width="0.5" fill="none">
          <line x1="0" y1="38" x2="400" y2="38"/><line x1="0" y1="75" x2="400" y2="75"/><line x1="0" y1="112" x2="400" y2="112"/><line x1="0" y1="150" x2="400" y2="150"/><line x1="0" y1="188" x2="400" y2="188"/>
          <line x1="66" y1="0" x2="66" y2="225"/><line x1="133" y1="0" x2="133" y2="225"/><line x1="200" y1="0" x2="200" y2="225"/><line x1="266" y1="0" x2="266" y2="225"/><line x1="333" y1="0" x2="333" y2="225"/>
        </g>
        <g class="map-interactive-coord-plane">
          ${highPrecisionWorldVectors}
          ${highlightedCountryMarkup}
          ${bathymetricContoursMarkup}
          <g font-family="'JetBrains Mono', 'Space Grotesk', monospace" font-size="3.2" font-weight="700" letter-spacing="0.08em" text-anchor="middle" style="pointer-events:none; user-select:none;">
            ${filteredLabelsHtml}
          </g>
          ${routeElementsHtml}
          ${customTraceHtml}
        </g>
      </svg>
    `;

    const rig3DStyle = is3D
      ? `animation: none !important; transform: perspective(1000px) rotateX(${pitch3D}deg) rotateY(${yaw3D}deg) scale(${Math.min(1.35, Math.max(1.0, zoomLvl * 0.65))}); transform-style: preserve-3d; transition: transform 0.15s ease-out;`
      : '';

    const stage3DControlsHtml = `
      <div class="map-3d-stage-toolbar" style="position:absolute; top:10px; right:12px; z-index:35; display:flex; align-items:center; gap:6px; background:rgba(7,13,25,0.92); backdrop-filter:blur(10px); border:1px solid rgba(56,189,248,0.45); border-radius:20px; padding:4px 10px; box-shadow:0 8px 24px rgba(0,0,0,0.75); pointer-events:auto;">
        <button type="button" id="map-stage-btn-toggle-3d" style="background:${is3D ? "rgba(56,189,248,0.25)" : "rgba(255,255,255,0.08)"}; border:1px solid ${is3D ? "#38bdf8" : "rgba(255,255,255,0.18)"}; color:${is3D ? "#38bdf8" : "#94a3b8"}; border-radius:12px; padding:2px 8px; font-size:9.5px; font-weight:800; cursor:pointer;" title="Toggle 3D Orbit / Camera Mode">
          ${is3D ? "🌐 3D Orbit ON" : "🌐 3D Orbit"}
        </button>
        <div style="display:flex; align-items:center; gap:2px; background:rgba(0,0,0,0.5); border-radius:12px; border:1px solid rgba(255,255,255,0.12); padding:1px 4px;">
          <button type="button" id="map-stage-btn-zoom-in" style="background:none; border:none; color:#38bdf8; font-weight:900; font-size:11px; cursor:pointer; padding:0 4px;" title="Zoom In (+)">+</button>
          <span id="map-stage-zoom-badge" style="font-family:monospace; font-size:8.5px; color:#e2e8f0; min-width:24px; text-align:center;">${zoomLvl.toFixed(1)}x</span>
          <button type="button" id="map-stage-btn-zoom-out" style="background:none; border:none; color:#38bdf8; font-weight:900; font-size:11px; cursor:pointer; padding:0 4px;" title="Zoom Out (−)">−</button>
        </div>
        <button type="button" id="map-stage-btn-draw" style="background:${isDrawing ? "rgba(46,255,198,0.22)" : "rgba(255,255,255,0.08)"}; border:1px solid ${isDrawing ? "#2effc6" : "rgba(255,255,255,0.18)"}; color:${isDrawing ? "#2effc6" : "#e2e8f0"}; border-radius:12px; padding:2px 8px; font-size:9.5px; font-weight:700; cursor:pointer;" title="Direct Route Tracing Mode">
          ${isDrawing ? "✏️ Tracing Route" : "✏️ Trace"}
        </button>
        <select id="map-stage-sel-transit" style="background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff; font-size:9.5px; font-weight:700; padding:2px 5px; cursor:pointer;" title="Transit Mode for On-Screen Trace">
          <option value="plane" ${(d.activeTraceTransit || "plane") === "plane" ? "selected" : ""}>✈️ Plane</option>
          <option value="ship" ${d.activeTraceTransit === "ship" ? "selected" : ""}>🚢 Ship</option>
          <option value="train" ${d.activeTraceTransit === "train" ? "selected" : ""}>🚆 Train</option>
          <option value="line" ${d.activeTraceTransit === "line" ? "selected" : ""}>⚡ Line</option>
        </select>
        <button type="button" id="map-stage-btn-clear-trace" style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4); color:#fca5a5; border-radius:10px; padding:2px 7px; font-size:9px; font-weight:700; cursor:pointer;" title="Clear On-Screen Drawn Traces">Clear</button>
      </div>
    `;

    return `
      <div class="tpl-map globe-viewport ${is3D ? 'is-3d-mode' : ''} ${isDrawing ? 'is-drawing-route' : ''}" style="background:${th.bg}; --focus-x:${normX.toFixed(1)}%; --focus-y:${normY.toFixed(1)}%; --zoom-scale:${zoomLvl}; --zoom-delay:${zoomStart}s; --cam-cycle:${totalCycle}s; --pan-x:${panX}; --pan-y:${panY}; --pin-color:${pinColor}; cursor:${isDrawing ? 'crosshair' : (is3D ? 'grab' : 'default')};">
        ${stage3DControlsHtml}
        <div class="globe-camera-rig" style="${rig3DStyle}">
          ${globeSvg}
        </div>

        <!-- Floating Glassmorphic HUD Route Card matching Image 2 -->
        <div class="location-hud">
          <div class="hud-top-meta">
            <span class="hud-badge-tag">[MULTI-VECTOR TRANSIT 01]</span>
            <span class="hud-badge-tag">[ACTIVE LEGS: ${activeRoutes.length}]</span>
          </div>
          <div class="hud-route-legs">
            ${activeRoutes.map((rt, i) => {
              const isLast = (i === activeRoutes.length - 1);
              const fromFlag = getCountryFlag(rt.from);
              return `
                <div class="hud-route-item ${isLast ? 'active-leg' : ''}">
                  ${i === 0 ? `<span class="hud-flag">${fromFlag}</span>` : `<span class="hud-arrow-down">\u2794</span>`}
                  <span class="hud-country">${(rt.from || 'ORIGIN').toUpperCase()}</span>
                  <span class="hud-arrow">\u2192</span>
                  <span class="hud-country ${isLast ? 'highlight' : ''}">${(rt.to || 'TARGET').toUpperCase()}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- High-Tech Bottom Telemetry Bar -->
        <div class="telemetry-bar">
          <span>SAT-LOCK // ${proj === 'globe' ? '3D ORTHOGRAPHIC GLOBE' : '2D GRANULAR WORLD MAP'} ${is3D ? '\u00b7 [3D INTERACTIVE]' : ''}</span>
          <span>${activeRoutes.length} ROUTE${activeRoutes.length > 1 ? 'S' : ''} \u00b7 ZOOM @ ${zoomStart}s \u00b7 ${zoomLvl}x</span>
        </div>
      </div>
    `;
  };

  // Interactive 3D Orbit & Direct On-Screen Route Tracing Handler for Map Stage

// =========================================================================
  // =========================================================================
  // 25B. HIGH-RESOLUTION CINEMATIC 3D MAP PIN DROP ENGINE (map-pin-drop)
  // Matching Image 3 Visual Standard (James Jani / Yes Theory standard)
  // =========================================================================
  window.tplBuildTacticalMapPinDropHtml = function(mData) {
    const d = mData || (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('map-pin-drop') : {});
    const is3D = d.is3DMode !== false;
    const pitch = d.pitch3D !== undefined ? parseFloat(d.pitch3D) : 10;
    const yaw = d.yaw3D !== undefined ? parseFloat(d.yaw3D) : -3;
    const pinMat = d.pinMaterial || 'copper';
    const showDust = d.showImpactDust !== false;
    const showBorders = d.showBorders !== false;
    const showLabels = d.showLabels !== false;
    const showWater = d.showWaterCurrents !== false;
    const showGrid = d.showGrid !== false;
    const showFlightPath = d.showFlightPath !== false;
    const locTitle = (d.location || 'KYIV, UKRAINE').toUpperCase();
    const locCoords = d.coords || '50.4501°N 30.5234°E';
    const locSub = d.telemetry || 'O.SR5911TES     DFX35.EVA';

    // Metallic Pin Palettes
    const palettes = {
      'copper': {
        stop0: '#fed7aa', stop25: '#f97316', stop55: '#c2410c', stop85: '#7c2d12', stop100: '#431407',
        stem0: '#ea580c', stem50: '#ffedd5', stem100: '#7c2d12',
        rim: '#fed7aa', center: '#7c2d12', pulse: '#f59e0b'
      },
      'steel': {
        stop0: '#f8fafc', stop25: '#cbd5e1', stop55: '#64748b', stop85: '#334155', stop100: '#0f172a',
        stem0: '#94a3b8', stem50: '#ffffff', stem100: '#334155',
        rim: '#e2e8f0', center: '#1e293b', pulse: '#38bdf8'
      },
      'gold': {
        stop0: '#fef08a', stop25: '#eab308', stop55: '#ca8a04', stop85: '#854d0e', stop100: '#422006',
        stem0: '#d97706', stem50: '#fef9c3', stem100: '#78350f',
        rim: '#fde047', center: '#713f12', pulse: '#eab308'
      }
    };
    const pal = palettes[pinMat] || palettes['copper'];

    const rig3DStyle = is3D
      ? `transform: perspective(1200px) rotateX(${pitch}deg) rotateY(${yaw}deg) scale(1.02); transform-style: preserve-3d; transition: transform 0.25s ease-out;`
      : 'transform: none;';

    return `
      <div class="tpl-map cinematic-map-pin-suite ${is3D ? 'is-3d-perspective' : ''}" style="background:#020610; width:100%; height:100%; position:relative; overflow:hidden; user-select:none;">
        <div class="cinematic-map-canvas-container" style="${rig3DStyle} width:100%; height:100%; position:relative;">
          <!-- 1. BASE WORLD SATELLITE & TOPOGRAPHIC RELIEF LAYER (Photorealistic Image 3) -->
          <img src="/cinematic_tactical_world_map_kyiv.png" alt="Cinematic Tactical Relief World Map" class="cinematic-map-base-img" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; filter: contrast(1.06) brightness(1.02);" />

          <!-- 2. DYNAMIC WATER CURRENTS SHIMMER -->
          ${showWater ? `
            <div class="ocean-shimmer-layer" style="position: absolute; inset: 0; background: radial-gradient(ellipse at 42% 64%, rgba(56, 189, 248, 0.08) 0%, transparent 70%); mix-blend-mode: screen; pointer-events: none; animation: oceanCurrentShift 9s ease-in-out infinite alternate;"></div>
          ` : ''}

          <!-- 3. VOLUMETRIC ATMOSPHERIC LIMB GLOW & VIGNETTE -->
          <div class="atmospheric-limb-glow" style="position: absolute; inset: 0; box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.85), inset 0 0 100px rgba(2, 8, 20, 0.7); pointer-events: none;"></div>

          <!-- 4. DYNAMIC VECTOR OVERLAY: 3D PIN, SHOCKWAVE, ARCS, HUD LEADER LINE (viewBox 0 0 968 410) -->
          <svg class="cinematic-map-svg-overlay" viewBox="0 0 968 410" preserveAspectRatio="none" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">
            <defs>
              <!-- Lat/Long Graticule Filter -->
              <pattern id="cmpGridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.07)" stroke-width="0.6" stroke-dasharray="2, 4" />
              </pattern>

              <!-- Radial Pin Head Metallic Gradient -->
              <radialGradient id="cmpPinHead" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stop-color="${pal.stop0}"/>
                <stop offset="25%" stop-color="${pal.stop25}"/>
                <stop offset="55%" stop-color="${pal.stop55}"/>
                <stop offset="85%" stop-color="${pal.stop85}"/>
                <stop offset="100%" stop-color="${pal.stop100}"/>
              </radialGradient>

              <!-- Concentric Lathe Grooves -->
              <radialGradient id="cmpPinGrooves" cx="50%" cy="50%" r="50%">
                <stop offset="25%" stop-color="${pal.stop85}" stop-opacity="0.7"/>
                <stop offset="45%" stop-color="${pal.stop0}" stop-opacity="0.9"/>
                <stop offset="65%" stop-color="${pal.stop55}" stop-opacity="0.8"/>
                <stop offset="85%" stop-color="${pal.stop0}" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="${pal.stop100}"/>
              </radialGradient>

              <!-- 3D Conical Stem Gradient -->
              <linearGradient id="cmpPinStem" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="${pal.stem0}"/>
                <stop offset="45%" stop-color="${pal.stem50}"/>
                <stop offset="70%" stop-color="${pal.stem0}"/>
                <stop offset="100%" stop-color="${pal.stem100}"/>
              </linearGradient>

              <!-- Glow and Shadow Filters -->
              <filter id="cmpGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
              </filter>
              <filter id="cmpPinShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="6" dy="14" stdDeviation="8" flood-color="#000000" flood-opacity="0.9"/>
              </filter>
            </defs>

            <!-- Technical Lat/Long Graticule Grid Overlay -->
            ${showGrid ? `
              <rect width="968" height="410" fill="url(#cmpGridPattern)" opacity="0.8" />
            ` : ''}

            <!-- Shaded Relief & Glowing Country Borders Overlay -->
            ${showBorders ? `
              <g class="glowing-borders" stroke="rgba(249, 115, 22, 0.35)" stroke-width="0.75" fill="none" opacity="0.65">
                <path d="M 440 115 Q 465 105 490 120 T 520 135 T 555 140 T 575 160" />
                <path d="M 465 130 Q 480 150 495 155 T 515 170" />
                <path d="M 525 135 Q 545 138 560 148 T 570 175" />
              </g>
            ` : ''}

            <!-- Flight Trajectory Arcs (Americas -> London -> Kyiv -> Asia) -->
            ${showFlightPath ? `
              <g class="trajectory-flight-arcs">
                <path d="M 290 220 Q 410 130 540 143" fill="none" stroke="rgba(249, 115, 22, 0.45)" stroke-width="3" stroke-dasharray="6 4" class="animated-flight-dash" />
                <path d="M 290 220 Q 410 130 540 143" fill="none" stroke="#f97316" stroke-width="1.6" stroke-dasharray="6 4" />
                <path d="M 540 143 Q 660 120 780 185" fill="none" stroke="rgba(249, 115, 22, 0.4)" stroke-width="2.5" stroke-dasharray="5 4" />
                <path d="M 540 143 Q 660 120 780 185" fill="none" stroke="#ea580c" stroke-width="1.2" stroke-dasharray="5 4" />
              </g>
            ` : ''}

            <!-- Secondary Metallic Network Pins -->
            <!-- London / UK Pin -->
            <g class="secondary-pin" transform="translate(485, 132) scale(0.65)" filter="url(#cmpPinShadow)">
              <ellipse cx="0" cy="18" rx="7" ry="2.5" fill="rgba(0,0,0,0.6)" />
              <path d="M 0 16 L -5 3 L 5 3 Z" fill="url(#cmpPinStem)" />
              <circle cx="0" cy="0" r="10" fill="url(#cmpPinHead)" stroke="${pal.rim}" stroke-width="1" />
              <circle cx="0" cy="0" r="6" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
            </g>

            <!-- US West Pin -->
            <g class="secondary-pin" transform="translate(305, 156) scale(0.65)" filter="url(#cmpPinShadow)">
              <ellipse cx="0" cy="18" rx="7" ry="2.5" fill="rgba(0,0,0,0.6)" />
              <path d="M 0 16 L -5 3 L 5 3 Z" fill="url(#cmpPinStem)" />
              <circle cx="0" cy="0" r="10" fill="url(#cmpPinHead)" stroke="${pal.rim}" stroke-width="1" />
              <circle cx="0" cy="0" r="6" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
            </g>

            <!-- East Asia Pin -->
            <g class="secondary-pin" transform="translate(775, 185) scale(0.65)" filter="url(#cmpPinShadow)">
              <ellipse cx="0" cy="18" rx="7" ry="2.5" fill="rgba(0,0,0,0.6)" />
              <path d="M 0 16 L -5 3 L 5 3 Z" fill="url(#cmpPinStem)" />
              <circle cx="0" cy="0" r="10" fill="url(#cmpPinHead)" stroke="${pal.rim}" stroke-width="1" />
              <circle cx="0" cy="0" r="6" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
            </g>

            <!-- GROUND IMPACT DYNAMICS AT KYIV -->
            <g class="ground-impact-group" transform="translate(540, 143)">
              <ellipse cx="0" cy="0" rx="36" ry="14" fill="none" stroke="${pal.pulse}" stroke-width="1.8" opacity="0.8" class="kyiv-shockwave-1" />
              <ellipse cx="0" cy="0" rx="64" ry="22" fill="none" stroke="${pal.pulse}" stroke-width="1.2" stroke-dasharray="4 2" opacity="0.45" class="kyiv-shockwave-2" />
              ${showDust ? `
                <ellipse cx="0" cy="2" rx="42" ry="18" fill="rgba(180, 83, 9, 0.28)" filter="url(#cmpGlow)" />
                <ellipse cx="-8" cy="-2" rx="32" ry="14" fill="rgba(217, 119, 6, 0.22)" filter="url(#cmpGlow)" />
              ` : ''}
            </g>

            <!-- PRIMARY 3D METALLIC PIN OBJECT AT KYIV -->
            <g class="primary-3d-pin-object" transform="translate(540, 143)" filter="url(#cmpPinShadow)">
              <!-- Contact Drop Shadow on Terrain -->
              <ellipse cx="14" cy="2" rx="22" ry="8" fill="rgba(0,0,0,0.85)" filter="url(#cmpGlow)" />

              <!-- 3D Tapered Conical Stem touching coordinate -->
              <path d="M 0 0 L -12 -38 L 12 -38 Z" fill="url(#cmpPinStem)" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" />
              <line x1="0" y1="0" x2="0" y2="-38" stroke="#ffedd5" stroke-width="1" opacity="0.75" />

              <!-- Heavy Beveled Circular Metallic Pin Head with Concentric Lathe Grooves -->
              <g transform="translate(0, -56)">
                <circle cx="0" cy="0" r="28" fill="#431407" />
                <circle cx="0" cy="0" r="27" fill="url(#cmpPinHead)" stroke="${pal.rim}" stroke-width="1.5" />
                <circle cx="0" cy="0" r="21" fill="url(#cmpPinGrooves)" stroke="rgba(0,0,0,0.35)" stroke-width="1" />
                <circle cx="0" cy="0" r="15" fill="url(#cmpPinHead)" stroke="rgba(254, 215, 170, 0.6)" stroke-width="0.8" />
                <circle cx="0" cy="0" r="8" fill="${pal.center}" stroke="${pal.rim}" stroke-width="0.7" />
                <!-- Specular Gleam Arc -->
                <path d="M -18 -18 A 25 25 0 0 1 18 -18" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.75" filter="url(#cmpGlow)" />
                <circle cx="-7" cy="-7" r="3" fill="#ffffff" opacity="0.8" />
              </g>
            </g>

            <!-- HIGH-TECH MODULAR DATA HUD & LEADER LINE (Image 3 Precision) -->
            <g class="kyiv-leader-line-callout" transform="translate(540, 143)">
              <polyline points="20,-72 65,-94 75,-94" fill="none" stroke="#cbd5e1" stroke-width="1.4" opacity="0.85" />
              <circle cx="20" cy="-72" r="2.2" fill="${pal.stop25}" stroke="#ffffff" stroke-width="0.8" />

              <!-- High-Tech Telemetry Glassmorphic Card -->
              <g transform="translate(75, -112)">
                <rect x="0" y="0" width="198" height="34" rx="4" fill="rgba(8, 12, 22, 0.88)" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1" />
                <!-- Tech Corner Ticks -->
                <line x1="0" y1="0" x2="6" y2="0" stroke="${pal.stop25}" stroke-width="2" />
                <line x1="0" y1="0" x2="0" y2="6" stroke="${pal.stop25}" stroke-width="2" />
                <line x1="198" y1="34" x2="192" y2="34" stroke="${pal.stop25}" stroke-width="2" />
                <line x1="198" y1="34" x2="198" y2="28" stroke="${pal.stop25}" stroke-width="2" />

                <!-- Main Bold Coordinate Header Text -->
                <text x="8" y="15" fill="#ffffff" font-family="'Space Grotesk', -apple-system, sans-serif" font-size="9.5" font-weight="800" letter-spacing="0.04em">
                  ${locTitle} <tspan fill="rgba(255,255,255,0.4)">|</tspan> ${locCoords}
                </text>

                <!-- Telemetry Subtext -->
                <text x="8" y="27" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="600" letter-spacing="0.1em">
                  ${locSub}
                </text>
              </g>
            </g>
          </svg>

          <!-- On-Screen Transport Controls (Bottom-Left) matching Image 3 -->
          <div class="map-on-canvas-transport" style="position: absolute; bottom: 14px; left: 14px; display: flex; align-items: center; gap: 8px; z-index: 40; pointer-events: auto;">
            <button type="button" class="btn-canvas-pause" onclick="if (typeof window.toggleModalPlayPause === 'function') window.toggleModalPlayPause();" style="padding: 6px 14px; font-size: 11px; font-weight: 700; background: #151824; border: 1px solid rgba(255,255,255,0.14); color: #f8fafc; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.6); transition: all 0.15s;" onmouseover="this.style.background='#1f2333';" onmouseout="this.style.background='#151824';">
              <span style="font-size: 10px;">❚❚</span>
              <span>Pause</span>
            </button>
            <button type="button" class="btn-canvas-replay" onclick="if (typeof window.resetModalPlayback === 'function') window.resetModalPlayback();" style="padding: 6px 14px; font-size: 11px; font-weight: 600; background: #151824; border: 1px solid rgba(255,255,255,0.14); color: #cbd5e1; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.6); transition: all 0.15s;" onmouseover="this.style.background='#1f2333';" onmouseout="this.style.background='#151824';">
              <span style="font-size: 11px;">↺</span>
              <span>Replay</span>
            </button>
          </div>
        </div>
      </div>
    `;
  };

  window.tplBindInteractiveMapStage = function(stageEl) {
    if (!stageEl) return;
    const viewport = stageEl.querySelector(".tpl-map.globe-viewport");
    if (!viewport) return;

    // Wire up 3D Orbit Toggle
    const btnToggle3D = viewport.querySelector("#map-stage-btn-toggle-3d");
    if (btnToggle3D) {
      btnToggle3D.onclick = (e) => {
        e.stopPropagation();
        const cur = window.tplGetContextualData("map");
        window.tplSetContextualData("map", { is3DMode: !cur.is3DMode });
        if (typeof window.tplRenderContextualInspector === "function") window.tplRenderContextualInspector("map");
      };
    }

    // Wire up Zoom In and Zoom Out controls
    const btnZoomIn = viewport.querySelector("#map-stage-btn-zoom-in");
    if (btnZoomIn) {
      btnZoomIn.onclick = (e) => {
        e.stopPropagation();
        const cur = window.tplGetContextualData("map");
        const newZ = Math.min(5, (cur.zoomLevel !== undefined ? parseFloat(cur.zoomLevel) : 1.9) + 0.35);
        window.tplSetContextualData("map", { zoomLevel: parseFloat(newZ.toFixed(2)), is3DMode: true });
        if (typeof window.tplRenderContextualInspector === "function") window.tplRenderContextualInspector("map");
      };
    }

    const btnZoomOut = viewport.querySelector("#map-stage-btn-zoom-out");
    if (btnZoomOut) {
      btnZoomOut.onclick = (e) => {
        e.stopPropagation();
        const cur = window.tplGetContextualData("map");
        const newZ = Math.max(1.0, (cur.zoomLevel !== undefined ? parseFloat(cur.zoomLevel) : 1.9) - 0.35);
        window.tplSetContextualData("map", { zoomLevel: parseFloat(newZ.toFixed(2)), is3DMode: true });
        if (typeof window.tplRenderContextualInspector === "function") window.tplRenderContextualInspector("map");
      };
    }

    // Wire up Wheel Zoom on viewport
    viewport.onwheel = (e) => {
      e.preventDefault();
      const cur = window.tplGetContextualData("map");
      const curZ = cur.zoomLevel !== undefined ? parseFloat(cur.zoomLevel) : 1.9;
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      const newZ = Math.max(1.0, Math.min(5.0, curZ + delta));
      window.tplSetContextualData("map", { zoomLevel: parseFloat(newZ.toFixed(2)), is3DMode: true });
      const rig = viewport.querySelector(".globe-camera-rig");
      if (rig) {
        const pitch = cur.pitch3D !== undefined ? parseFloat(cur.pitch3D) : 22;
        const yaw = cur.yaw3D !== undefined ? parseFloat(cur.yaw3D) : -10;
        rig.style.transform = `perspective(1000px) rotateX(${pitch}deg) rotateY(${yaw}deg) scale(${newZ.toFixed(2)})`;
      }
      const badge = viewport.querySelector("#map-stage-zoom-badge");
      if (badge) badge.textContent = newZ.toFixed(1) + "x";
    };

    const btnDraw = viewport.querySelector('#map-stage-btn-draw');
    if (btnDraw) {
      btnDraw.onclick = (e) => {
        e.stopPropagation();
        const cur = window.tplGetContextualData('map');
        window.tplSetContextualData('map', { drawOnScreenMode: !cur.drawOnScreenMode, is3DMode: true });
        if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('map');
      };
    }

    const selTransit = viewport.querySelector('#map-stage-sel-transit');
    if (selTransit) {
      selTransit.onchange = (e) => {
        e.stopPropagation();
        window.tplSetContextualData('map', { activeTraceTransit: e.target.value });
      };
    }

    const btnClear = viewport.querySelector('#map-stage-btn-clear-trace');
    if (btnClear) {
      btnClear.onclick = (e) => {
        e.stopPropagation();
        window.tplSetContextualData('map', { customTracedRoutes: [] });
        if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('map');
      };
    }

    const svgEl = viewport.querySelector('.globe-svg');
    const rigEl = viewport.querySelector('.globe-camera-rig');
    if (!svgEl) return;

    let isPointerDown = false;
    let startClientX = 0;
    let startClientY = 0;
    let startPitch = 22;
    let startYaw = -10;
    let tracedPoints = [];
    let tempLineEl = null;

    const clientToSvgCoords = (clientX, clientY) => {
      const rect = svgEl.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
      const relY = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
      return { x: relX * 400, y: relY * 225 };
    };

    viewport.onpointerdown = (e) => {
      if (e.target.closest('.map-3d-stage-toolbar') || e.target.closest('button') || e.target.closest('select')) return;
      const d = window.tplGetContextualData('map');
      if (!d.is3DMode && !d.drawOnScreenMode) return;

      isPointerDown = true;
      startClientX = e.clientX;
      startClientY = e.clientY;
      startPitch = d.pitch3D !== undefined ? parseFloat(d.pitch3D) : 22;
      startYaw = d.yaw3D !== undefined ? parseFloat(d.yaw3D) : -10;

      if (d.drawOnScreenMode) {
        const pt = clientToSvgCoords(e.clientX, e.clientY);
        tracedPoints = [pt];
        const planeGroup = svgEl.querySelector('.map-interactive-coord-plane') || svgEl;
        tempLineEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempLineEl.setAttribute('fill', 'none');
        tempLineEl.setAttribute('stroke', '#2effc6');
        tempLineEl.setAttribute('stroke-width', '2');
        tempLineEl.setAttribute('stroke-dasharray', '3 2');
        tempLineEl.setAttribute('d', `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
        planeGroup.appendChild(tempLineEl);
      } else {
        viewport.style.cursor = 'grabbing';
      }
      e.stopPropagation();
    };

    viewport.onpointermove = (e) => {
      if (!isPointerDown) return;
      const d = window.tplGetContextualData('map');
      if (d.drawOnScreenMode && tempLineEl) {
        const pt = clientToSvgCoords(e.clientX, e.clientY);
        const lastPt = tracedPoints[tracedPoints.length - 1];
        if (!lastPt || Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y) > 4) {
          tracedPoints.push(pt);
          tempLineEl.setAttribute('d', tracedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '));
        }
      } else if (d.is3DMode && rigEl) {
        const dx = e.clientX - startClientX;
        const dy = e.clientY - startClientY;
        const newYaw = Math.max(-45, Math.min(45, startYaw + dx * 0.22));
        const newPitch = Math.max(-15, Math.min(55, startPitch - dy * 0.22));
        rigEl.style.transform = `perspective(1000px) rotateX(${newPitch.toFixed(1)}deg) rotateY(${newYaw.toFixed(1)}deg) scale(${Math.min(1.35, Math.max(1.0, (d.zoomLevel || 1.9) * 0.65))})`;
        d.pitch3D = parseFloat(newPitch.toFixed(1));
        d.yaw3D = parseFloat(newYaw.toFixed(1));
      }
    };

    viewport.onpointerup = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      const d = window.tplGetContextualData('map');

      if (d.drawOnScreenMode) {
        const endPt = clientToSvgCoords(e.clientX, e.clientY);
        if (tracedPoints.length === 1) {
          // Single click on map -> snap to nearest country and chain a route leg!
          const ll = window.tplSvgPointToLatLng(endPt.x, endPt.y);
          const nearCountry = window.tplNearestCountryFromLatLng(ll.lat, ll.lng);
          const routes = Array.isArray(d.routes) ? d.routes.slice() : [];
          const prevDest = routes.length > 0 ? routes[routes.length - 1] : { to: 'USA', toLat: 39.8, toLng: -98.5 };
          if (nearCountry && nearCountry.name !== prevDest.to) {
            routes.push({
              from: prevDest.to || 'USA',
              to: nearCountry.name,
              fromLat: prevDest.toLat ?? 39.8,
              fromLng: prevDest.toLng ?? -98.5,
              toLat: nearCountry.lat,
              toLng: nearCountry.lng,
              mode: d.activeTraceTransit || 'plane',
              color: routes.length % 2 === 0 ? '#38bdf8' : '#2effc6'
            });
            const locStr = routes.map((r, i) => i === 0 ? `${r.from} \u2192 ${r.to}` : r.to).join(' \u2192 ');
            window.tplSetContextualData('map', {
              routes,
              location: locStr,
              lat: nearCountry.lat,
              lng: nearCountry.lng
            });
            if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('map');
          }
        } else if (tracedPoints.length >= 2) {
          // Dragged a custom trajectory across the map! Also resolve start & end countries
          const startLL = window.tplSvgPointToLatLng(tracedPoints[0].x, tracedPoints[0].y);
          const endLL = window.tplSvgPointToLatLng(endPt.x, endPt.y);
          const startCountry = window.tplNearestCountryFromLatLng(startLL.lat, startLL.lng);
          const endCountry = window.tplNearestCountryFromLatLng(endLL.lat, endLL.lng);
          const customList = Array.isArray(d.customTracedRoutes) ? d.customTracedRoutes.slice() : [];
          customList.push({
            points: tracedPoints,
            mode: d.activeTraceTransit || 'plane',
            color: '#2effc6',
            from: startCountry ? startCountry.name : 'Origin',
            to: endCountry ? endCountry.name : 'Destination'
          });
          const routes = Array.isArray(d.routes) ? d.routes.slice() : [];
          if (startCountry && endCountry && startCountry.name !== endCountry.name) {
            routes.push({
              from: startCountry.name,
              to: endCountry.name,
              fromLat: startCountry.lat,
              fromLng: startCountry.lng,
              toLat: endCountry.lat,
              toLng: endCountry.lng,
              mode: d.activeTraceTransit || 'plane',
              color: '#2effc6'
            });
          }
          const locStr = routes.map((r, i) => i === 0 ? `${r.from} \u2192 ${r.to}` : r.to).join(' \u2192 ');
          window.tplSetContextualData('map', {
            customTracedRoutes: customList,
            routes,
            location: locStr,
            lat: endLL.lat,
            lng: endLL.lng
          });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('map');
        }
        tracedPoints = [];
        tempLineEl = null;
      } else if (d.is3DMode) {
        viewport.style.cursor = 'grab';
        if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('map');
      }
    };
  };

  // --- 2C. EMPIRE RISE & FALL TIMELINE BUILDER (James Jani / Magnates Media Documentary Style) ---
  // --- 2D. EMPIRE EXPANSION MAP 3D ENGINE (Vox / Johnny Harris / Magnates Media Photorealistic Engine) ---
  window.tplBuildEmpireMapHtml = function(mData) {
    const d = mData || (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('empire-map') : {});
    const mapStyle = d.mapStyle || 'tactical-dark';
    const isVintage = mapStyle === 'vintage-cartography';
    const is3D = d.is3DMode !== false;
    const pitch = parseFloat(d.pitch3D !== undefined ? d.pitch3D : 28);
    const yaw = parseFloat(d.yaw3D !== undefined ? d.yaw3D : -3);
    const zoom = parseFloat(d.zoomLevel !== undefined ? d.zoomLevel : 1.08);
    const panX = parseFloat(d.panX || 0);
    const panY = parseFloat(d.panY || 0);
    const cameraGlide = d.cameraGlide !== false;
    const dof = d.depthOfField !== false;
    const dofBlur = parseFloat(d.dofBlur || 2.5);
    const arcColor = d.arcColor || (isVintage ? '#ef4444' : '#fbbf24');
    const arcGlow = d.arcGlowColor || (isVintage ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.45)');
    const arcCurv = parseFloat(d.arcCurvature || 1.0);
    const multiStrand = d.arcMultiStrand !== false;
    const arcSpeed = parseFloat(d.arcSpeed || 3.5);
    const highlightTerritory = d.highlightTerritory !== undefined ? d.highlightTerritory : 'India';
    const highlightColor = d.highlightColor || (isVintage ? '#dc2626' : '#2dd4bf');
    const highlightOpacity = parseFloat(d.highlightOpacity !== undefined ? d.highlightOpacity : (isVintage ? 0.32 : 0.28));
    const showShockwaves = d.showShockwaves !== false;
    const showBorders = d.showCountryBorders !== false;
    const showGrid = d.showGrid !== false;
    const showDotMatrix = d.showDotMatrix !== false;
    const showLabels = d.showLabels !== false;

    // High-Resolution Cartography Geometry
    const accurateMapData = (typeof window !== "undefined" && window.ACCURATE_WORLD_MAP) ? window.ACCURATE_WORLD_MAP : null;
    const landPath = (accurateMapData && accurateMapData.land) ? accurateMapData.land : "M 32 40 L 42 35 L 56 34 L 72 32 L 86 31 L 98 33 L 112 37 L 126 44 L 136 54 L 128 62 L 134 70 L 124 78 L 116 86 L 112 94 L 108 97 L 105 91 L 96 92 L 91 97 L 95 105 L 104 110 L 98 114 L 90 106 L 82 101 L 75 91 L 72 83 L 68 87 L 65 77 L 62 67 L 55 54 L 42 52 L 32 46 Z";

    // Theme Palettes: Tactical Dark (Image 2) vs Aged Vintage Cartography
    const th = isVintage ? {
      bg: 'radial-gradient(ellipse at 50% 50%, #201a14 0%, #15110d 60%, #0a0806 100%)',
      grid: 'rgba(212, 196, 168, 0.12)',
      gridSub: 'rgba(212, 196, 168, 0.05)',
      landFill: '#382f25',
      landStroke: '#c2b195',
      dotCol: '#d4c4a8',
      dotOpacity: 0.35,
      borderCol: 'rgba(212, 196, 168, 0.30)',
      atmoLimb: 'rgba(212, 196, 168, 0.15)',
      vignette: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(18, 14, 10, 0.72) 75%, rgba(10, 8, 6, 0.96) 100%)',
      pinStem0: '#78350f',
      pinStem1: '#d4c4a8',
      pinHeadRim: '#b45309',
      pinHeadCenter: '#451a03',
      pinHeadCore: '#fef3c7',
      pulseRingCol: 'rgba(239, 68, 68, 0.55)',
      paperGrain: 'opacity(0.18) contrast(1.2)'
    } : {
      // Tactical Dark Blueprint Grid (Image 2 Standard)
      bg: 'radial-gradient(ellipse at 50% 55%, #041624 0%, #020b16 52%, #01040a 100%)',
      grid: 'rgba(45, 212, 191, 0.12)',
      gridSub: 'rgba(45, 212, 191, 0.05)',
      landFill: '#07192a',
      landStroke: 'rgba(45, 212, 191, 0.42)',
      dotCol: '#38bdf8',
      dotOpacity: 0.75,
      borderCol: 'rgba(45, 212, 191, 0.22)',
      atmoLimb: 'rgba(56, 189, 248, 0.25)',
      vignette: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2, 6, 16, 0.68) 75%, rgba(1, 3, 8, 0.94) 100%)',
      pinStem0: '#ea580c',
      pinStem1: '#fef08a',
      pinHeadRim: '#f59e0b',
      pinHeadCenter: '#78350f',
      pinHeadCore: '#fffbeb',
      pulseRingCol: 'rgba(251, 191, 36, 0.65)',
      paperGrain: 'none'
    };

    // Global Expansion Hubs matching Image 2
    const hubs = [
      { id: 'sf', name: 'Silicon Valley', code: 'SFO', x: 85.8, y: 81.9, active: true },
      { id: 'ny', name: 'New York', code: 'NYC', x: 130.9, y: 79.1, active: true },
      { id: 'sp', name: 'São Paulo', code: 'SAO', x: 156.5, y: 140.5, active: true },
      { id: 'lon', name: 'London', code: 'LON', x: 199.9, y: 68.8, active: true },
      { id: 'fra', name: 'Frankfurt', code: 'FRA', x: 208.1, y: 70.1, active: true },
      { id: 'jnb', name: 'Johannesburg', code: 'JNB', x: 226.2, y: 143.0, active: true },
      { id: 'del', name: 'India', code: 'IND', x: 272.1, y: 95.0, active: true },
      { id: 'hkg', name: 'East Asia', code: 'HKG', x: 306.5, y: 96.7, active: true },
      { id: 'tyo', name: 'Tokyo', code: 'TYO', x: 330.3, y: 83.9, active: true },
      { id: 'syd', name: 'Sydney', code: 'SYD', x: 341.1, y: 150.4, active: true }
    ];

    // Expansion Routes matching Image 2
    const routes = [
      { from: 'sf', to: 'ny', curv: 0.65, delay: 0 },
      { from: 'ny', to: 'lon', curv: 0.95, delay: 0.4 },
      { from: 'sp', to: 'ny', curv: 0.70, delay: 0.7 },
      { from: 'lon', to: 'fra', curv: 0.50, delay: 0.9 },
      { from: 'lon', to: 'jnb', curv: 0.75, delay: 1.1 },
      { from: 'lon', to: 'del', curv: 1.15, delay: 1.3 },
      { from: 'fra', to: 'del', curv: 1.05, delay: 1.5 },
      { from: 'del', to: 'hkg', curv: 0.65, delay: 1.8 },
      { from: 'hkg', to: 'tyo', curv: 0.55, delay: 2.1 },
      { from: 'hkg', to: 'syd', curv: 0.75, delay: 2.4 }
    ];

    const hubMap = {};
    hubs.forEach(h => hubMap[h.id] = h);

    // Build Parabolic 3D Light Arcs
    const arcsMarkup = routes.map((r, i) => {
      const h1 = hubMap[r.from];
      const h2 = hubMap[r.to];
      if (!h1 || !h2) return '';
      const x1 = h1.x, y1 = h1.y, x2 = h2.x, y2 = h2.y;
      const mx = (x1 + x2) / 2;
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const arcH = Math.min(85, Math.max(22, dist * 0.48 * arcCurv * r.curv));
      const my = Math.min(y1, y2) - arcH;

      const mainD = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
      const subD1 = `M ${x1} ${y1} Q ${mx} ${my - 2.5} ${x2} ${y2}`;
      const subD2 = `M ${x1} ${y1} Q ${mx} ${my + 2.0} ${x2} ${y2}`;

      return `
        <g class="empire-arc-group" data-from="${r.from}" data-to="${r.to}">
          <!-- Outer luminous bloom glow -->
          <path d="${mainD}" fill="none" stroke="${arcGlow}" stroke-width="5.5" filter="url(#empGlowBlur)" stroke-linecap="round"/>
          <!-- Radiant amber/gold beam body -->
          <path d="${mainD}" fill="none" stroke="${arcColor}" stroke-width="2.2" filter="url(#empArcGlow)" stroke-linecap="round"/>
          <!-- Hot white-gold central filament -->
          <path d="${mainD}" fill="none" stroke="#ffffff" stroke-width="0.9" stroke-linecap="round"/>
          ${multiStrand ? `
            <!-- Secondary multi-fiber satellite filaments -->
            <path d="${subD1}" fill="none" stroke="${arcColor}" stroke-opacity="0.65" stroke-width="0.75" stroke-dasharray="4, 3" stroke-linecap="round"/>
            <path d="${subD2}" fill="none" stroke="${arcColor}" stroke-opacity="0.45" stroke-width="0.65" stroke-dasharray="2, 4" stroke-linecap="round"/>
          ` : ''}
          <!-- Animated traveling energy pulse / comet head -->
          <path class="empire-arc-pulse-line" d="${mainD}" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="14 200" style="animation: empireArcFlow ${arcSpeed}s linear infinite ${r.delay}s;"/>
        </g>
      `;
    }).join('');

    // Build 3D Beacon Pins & Ground Ripples
    const pinsMarkup = hubs.map((h, i) => {
      const hx = h.x, hy = h.y;
      return `
        <g class="empire-hub-node" data-hub="${h.id}">
          ${showShockwaves ? `
            <!-- Concentric ground shockwaves on tilted plane -->
            <ellipse cx="${hx}" cy="${hy}" rx="14" ry="7" fill="none" stroke="${th.pulseRingCol}" stroke-width="0.85" style="animation: empireShockwave 2.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite ${i * 0.28}s; transform-origin: ${hx}px ${hy}px;"/>
            <ellipse cx="${hx}" cy="${hy}" rx="7" ry="3.5" fill="none" stroke="${th.pulseRingCol}" stroke-width="0.75" style="animation: empireShockwave 2.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite ${i * 0.28 + 0.55}s; transform-origin: ${hx}px ${hy}px;"/>
          ` : ''}
          <!-- Ground contact anchor glow -->
          <ellipse cx="${hx}" cy="${hy}" rx="3.2" ry="1.6" fill="${th.pulseRingCol}" opacity="0.85"/>
          <circle cx="${hx}" cy="${hy}" r="1.1" fill="#fff"/>
          <!-- Vertical 3D Pin Needle Stem -->
          <line x1="${hx}" y1="${hy - 11}" x2="${hx}" y2="${hy}" stroke="url(#empPinStemGrad)" stroke-width="1.3" stroke-linecap="round"/>
          <!-- 3D Beacon Pin Head with concentric metallic rim and luminous center -->
          <circle cx="${hx}" cy="${hy - 11}" r="3.6" fill="${th.pinHeadCenter}" stroke="${th.pinHeadRim}" stroke-width="0.9" filter="url(#empBeaconGlow)"/>
          <circle cx="${hx}" cy="${hy - 11}" r="1.8" fill="${th.pinHeadCore}"/>
          ${showLabels ? `
            <text x="${hx}" y="${hy - 16}" fill="rgba(255,255,255,0.85)" font-family="'JetBrains Mono', monospace" font-size="4.2" font-weight="700" text-anchor="middle" letter-spacing="0.5">${h.code}</text>
          ` : ''}
        </g>
      `;
    }).join('');

    // Country Boundary Outlines from Natural Earth Real Cartography
    let countryBordersSvg = '';
    if (showBorders && accurateMapData && accurateMapData.countries) {
      const paths = Object.values(accurateMapData.countries).slice(0, 150);
      countryBordersSvg = `
        <g class="empire-country-boundaries" fill="none" stroke="${th.borderCol}" stroke-width="0.38" stroke-linejoin="round" opacity="0.85">
          ${paths.map(p => `<path d="${p}"/>`).join('')}
        </g>
      `;
    }

    // Territory Highlight Layer (India standard in Image 2)
    let territoryHighlightSvg = '';
    if (highlightTerritory && highlightTerritory !== 'None') {
      const terrPath = typeof getCountrySvgPath === 'function' ? getCountrySvgPath(highlightTerritory) : (accurateMapData && accurateMapData.countries ? accurateMapData.countries[highlightTerritory] : null);
      if (terrPath) {
        territoryHighlightSvg = `
          <g class="empire-highlight-layer" style="animation: empireTerritoryBreathe 4s ease-in-out infinite alternate;">
            <path d="${terrPath}" fill="${highlightColor}" fill-opacity="${highlightOpacity}" stroke="${highlightColor}" stroke-width="1.3" filter="url(#empTerrGlow)"/>
          </g>
        `;
      }
    }

    // 3D Camera Rig Styles
    const rigTransform = is3D
      ? `transform: perspective(1100px) rotateX(${pitch}deg) rotateY(${yaw}deg) scale(${zoom}) translate(${panX}px, ${panY}px);`
      : 'transform: none;';

    return `
      <div class="tpl-empire-map ${is3D ? 'is-3d-rig' : ''} ${isVintage ? 'is-vintage-style' : 'is-tactical-style'}" style="background: ${th.bg}; width: 100%; height: 100%; position: relative; overflow: hidden; user-select: none;">
        <style>
          @keyframes empireShockwave {
            0% { transform: scale(0.2); opacity: 0.95; }
            50% { opacity: 0.6; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          @keyframes empireArcFlow {
            0% { stroke-dashoffset: 220; }
            100% { stroke-dashoffset: -20; }
          }
          @keyframes empireTerritoryBreathe {
            0% { fill-opacity: ${highlightOpacity * 0.85}; filter: drop-shadow(0 0 4px ${highlightColor}); }
            100% { fill-opacity: ${highlightOpacity * 1.35}; filter: drop-shadow(0 0 10px ${highlightColor}); }
          }
          @keyframes empireCameraGlideAnim {
            0% { transform: perspective(1100px) rotateX(${pitch}deg) rotateY(${yaw - 1.5}deg) scale(${zoom}) translate(${panX - 8}px, ${panY}px); }
            50% { transform: perspective(1100px) rotateX(${pitch + 2}deg) rotateY(${yaw + 1.5}deg) scale(${zoom * 1.02}) translate(${panX + 8}px, ${panY - 4}px); }
            100% { transform: perspective(1100px) rotateX(${pitch}deg) rotateY(${yaw - 1.5}deg) scale(${zoom}) translate(${panX - 8}px, ${panY}px); }
          }
          .empire-3d-canvas-wrap {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            ${rigTransform}
            ${cameraGlide ? 'animation: empireCameraGlideAnim 10s ease-in-out infinite alternate;' : ''}
            transition: transform 0.25s ease-out;
          }
        </style>

        <!-- 3D Spatial Canvas Rig Container -->
        <div class="empire-3d-canvas-wrap">
          <svg class="empire-map-svg" viewBox="0 0 400 225" preserveAspectRatio="none" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">
            <defs>
              <filter id="empGlowBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5"/>
              </filter>
              <filter id="empArcGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="${arcColor}"/>
              </filter>
              <filter id="empBeaconGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="${th.pinHeadRim}"/>
              </filter>
              <filter id="empTerrGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4.5" flood-color="${highlightColor}"/>
              </filter>
              <pattern id="empCoordGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${th.grid}" stroke-width="0.5"/>
              </pattern>
              <pattern id="empDotMatrixPattern" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
                <circle cx="1.2" cy="1.2" r="0.48" fill="${th.dotCol}" opacity="${th.dotOpacity}"/>
              </pattern>
              <linearGradient id="empPinStemGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${th.pinStem0}"/>
                <stop offset="100%" stop-color="${th.pinStem1}"/>
              </linearGradient>
            </defs>

            <!-- 1. Coordinate Blueprint Ground Mesh -->
            ${showGrid ? `<rect width="400" height="225" fill="url(#empCoordGrid)"/>` : ''}

            <!-- 2. Continents Cartography Layer -->
            <g class="empire-landmasses">
              <!-- Base Continent Shapes -->
              <path d="${landPath}" fill="${th.landFill}" stroke="${th.landStroke}" stroke-width="0.55" stroke-linejoin="round"/>
              <!-- Tactical Dot Matrix Texture (Image 2 standard) -->
              ${showDotMatrix ? `<path d="${landPath}" fill="url(#empDotMatrixPattern)"/>` : ''}
              <!-- High-precision country boundaries -->
              ${countryBordersSvg}
            </g>

            <!-- 3. Captured Territory Highlight (India in Image 2) -->
            ${territoryHighlightSvg}

            <!-- 4. Parabolic 3D Light Arcs -->
            <g class="empire-arcs-layer">
              ${arcsMarkup}
            </g>

            <!-- 5. 3D Beacon Pins & Shockwaves -->
            <g class="empire-pins-layer">
              ${pinsMarkup}
            </g>
          </svg>
        </div>

        <!-- Atmospheric Vignette & Depth of Field (f/2.8 Lens Bokeh) -->
        ${dof ? `
          <!-- Top horizon lens bokeh progressive blur -->
          <div class="empire-dof-horizon" style="position: absolute; top: 0; left: 0; right: 0; height: 32%; pointer-events: none; backdrop-filter: blur(${dofBlur}px); -webkit-backdrop-filter: blur(${dofBlur}px); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, transparent 100%); z-index: 6;"></div>
          <!-- Bottom foreground lens bokeh soft focus -->
          <div class="empire-dof-foreground" style="position: absolute; bottom: 0; left: 0; right: 0; height: 20%; pointer-events: none; backdrop-filter: blur(${dofBlur * 0.65}px); -webkit-backdrop-filter: blur(${dofBlur * 0.65}px); mask-image: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); z-index: 6;"></div>
        ` : ''}

        <!-- Volumetric Vignette & Atmospheric Limb Glow -->
        <div class="empire-atmospheric-vignette" style="position: absolute; inset: 0; background: ${th.vignette}; box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.85); pointer-events: none; z-index: 7;"></div>

        <!-- Telemetry HUD & Status Overlay -->
        <div class="empire-telemetry-hud" style="position: absolute; top: 12px; left: 14px; pointer-events: none; z-index: 8; display: flex; flex-direction: column; gap: 3px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 800; color: ${highlightColor}; letter-spacing: 1.2px; text-shadow: 0 0 8px ${highlightColor}; display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${highlightColor}; box-shadow: 0 0 6px ${highlightColor}; animation: pulse 1.5s infinite;"></span>
            GLOBAL EMPIRE EXPANSION // MATRIX ACTIVE
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 7px; color: rgba(255,255,255,0.55); letter-spacing: 0.8px;">
            HUBS: 10 ACTIVE | CORRIDORS: 10 | PROJ: 3D CYLINDRICAL ${is3D ? `| PITCH: ${pitch}°` : ''}
          </div>
        </div>
      </div>
    `;
  };

  window.tplBuildEmpireTimelineHtml = function(mData) {
    const d = mData || (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('empire-timeline') : {});
    const title = d.title || 'THE RISE & FALL OF ENRON';
    const subtitle = d.subtitle || 'CORPORATE VALUATION & LIQUIDITY CRASH \u00b7 1985 \u2014 2001';
    const themeKey = d.theme || 'james-jani';
    const hairline = Math.max(0.7, Math.min(3.0, parseFloat(d.hairline || 1.2)));
    const showGrid = d.showGrid !== false;
    const showAreaFill = d.showAreaFill !== false;
    const is3D = !!d.is3DMode;
    const cameraPitch = typeof d.cameraPitch === 'number' ? d.cameraPitch : 26;
    const cameraYaw = typeof d.cameraYaw === 'number' ? d.cameraYaw : -14;

    const themes = {
      'james-jani': {
        bg: 'radial-gradient(ellipse at 50% 35%, #0f172a 0%, #030712 100%)',
        gridLine: 'rgba(56, 189, 248, 0.08)',
        axisText: 'rgba(148, 163, 184, 0.65)',
        baseline: 'rgba(239, 68, 68, 0.35)',
        accent: '#38bdf8',
        cardBg: 'rgba(7, 13, 25, 0.88)',
        gradStart: '#10b981',
        gradMid: '#f59e0b',
        gradEnd: '#ef4444'
      },
      'magnates-gold': {
        bg: 'radial-gradient(ellipse at 50% 35%, #1c1407 0%, #060401 100%)',
        gridLine: 'rgba(245, 158, 11, 0.08)',
        axisText: 'rgba(217, 119, 6, 0.7)',
        baseline: 'rgba(245, 158, 11, 0.35)',
        accent: '#f59e0b',
        cardBg: 'rgba(20, 14, 4, 0.9)',
        gradStart: '#fde047',
        gradMid: '#f59e0b',
        gradEnd: '#b45309'
      },
      'bloomberg-cyan': {
        bg: 'radial-gradient(ellipse at 50% 35%, #061e24 0%, #02090c 100%)',
        gridLine: 'rgba(46, 255, 198, 0.08)',
        axisText: 'rgba(46, 255, 198, 0.65)',
        baseline: 'rgba(46, 255, 198, 0.35)',
        accent: '#2effc6',
        cardBg: 'rgba(3, 16, 20, 0.9)',
        gradStart: '#38bdf8',
        gradMid: '#2effc6',
        gradEnd: '#06b6d4'
      },
      'crimson-noir': {
        bg: 'radial-gradient(ellipse at 50% 35%, #240b0f 0%, #080203 100%)',
        gridLine: 'rgba(244, 63, 94, 0.08)',
        axisText: 'rgba(251, 113, 133, 0.7)',
        baseline: 'rgba(239, 68, 68, 0.4)',
        accent: '#f43f5e',
        cardBg: 'rgba(20, 5, 8, 0.92)',
        gradStart: '#fb7185',
        gradMid: '#f43f5e',
        gradEnd: '#9f1239'
      }
    };
    const th = themes[themeKey] || themes['james-jani'];

    const milestones = Array.isArray(d.milestones) && d.milestones.length > 0 ? d.milestones : [
      { label: 'FOUNDED', date: '1985', value: '$10M', desc: 'Houston Merger', color: '#10b981', x: 80, y: 315 },
      { label: 'WALL ST DARLING', date: '1995', value: '$320M', desc: 'Mark-to-Market Model', color: '#38bdf8', x: 230, y: 225 },
      { label: 'PEAK EMPIRE', date: '2000', value: '$1.5B', desc: 'Fortune #1 Innovator', color: '#f59e0b', x: 380, y: 95 },
      { label: 'WHISTLEBLOWER', date: 'AUG 2001', value: '$480M', desc: 'SEC Inquiry & Debt', color: '#fb923c', x: 525, y: 235 },
      { label: 'BANKRUPTCY', date: 'DEC 2001', value: '$0', desc: 'Chapter 11 Liquidation', color: '#ef4444', x: 645, y: 340 }
    ];

    // Build smooth cubic bezier curve through all milestones
    let curvePathD = '';
    if (milestones.length === 1) {
      curvePathD = `M ${milestones[0].x} ${milestones[0].y} L 640 ${milestones[0].y}`;
    } else {
      curvePathD = `M ${milestones[0].x} ${milestones[0].y}`;
      for (let i = 0; i < milestones.length - 1; i++) {
        const p0 = milestones[i === 0 ? 0 : i - 1];
        const p1 = milestones[i];
        const p2 = milestones[i + 1];
        const p3 = milestones[i + 2 < milestones.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        curvePathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
    }

    const firstPt = milestones[0];
    const lastPt = milestones[milestones.length - 1];
    const areaPathD = `${curvePathD} L ${lastPt.x.toFixed(1)} 350 L ${firstPt.x.toFixed(1)} 350 Z`;

    const gridLinesHtml = showGrid ? `
      <g stroke="${th.gridLine}" stroke-width="0.8" stroke-dasharray="3 3">
        <line x1="60" y1="95" x2="665" y2="95"/>
        <line x1="60" y1="165" x2="665" y2="165"/>
        <line x1="60" y1="235" x2="665" y2="235"/>
        <line x1="60" y1="305" x2="665" y2="305"/>
      </g>
      <line x1="50" y1="350" x2="670" y2="350" stroke="${th.baseline}" stroke-width="1.2"/>
      
      <g fill="${th.axisText}" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="600" text-anchor="end">
        <text x="54" y="98">${d.peakValuation || '$1.5B'}</text>
        <text x="54" y="168">$1.0B</text>
        <text x="54" y="238">$500M</text>
        <text x="54" y="308">$100M</text>
        <text x="54" y="353">$0</text>
      </g>

      <g stroke="${th.gridLine}" stroke-width="0.7" stroke-dasharray="2 4">
        ${milestones.map(m => `<line x1="${m.x}" y1="75" x2="${m.x}" y2="350"/>`).join('')}
      </g>
    ` : '';

    const nodesHtml = milestones.map((m, idx) => {
      const col = m.color || '#38bdf8';
      const isTop = m.y > 185;
      const cardY = isTop ? m.y - 48 : m.y + 14;
      const leaderY1 = isTop ? m.y - 4 : m.y + 4;
      const leaderY2 = isTop ? m.y - 12 : m.y + 12;

      return `
        <g class="tm-node-group" data-idx="${idx}">
          <circle cx="${m.x}" cy="${m.y}" r="14" fill="none" stroke="${col}" stroke-width="0.8" opacity="0.4" class="tm-pulse"/>
          <circle cx="${m.x}" cy="${m.y}" r="8" fill="${col}" fill-opacity="0.15"/>
          <circle cx="${m.x}" cy="${m.y}" r="3.8" fill="${col}" stroke="#ffffff" stroke-width="1.3"/>
          <line x1="${m.x}" y1="${leaderY1}" x2="${m.x}" y2="${leaderY2}" stroke="${col}" stroke-width="0.9" stroke-dasharray="1.5 1"/>
          <g transform="translate(${m.x}, ${cardY})">
            <rect x="-56" y="0" width="112" height="34" rx="5" fill="${th.cardBg}" stroke="${col}" stroke-width="0.8" filter="url(#tmCardShadow)"/>
            <rect x="-52" y="4" width="34" height="9" rx="2" fill="rgba(255,255,255,0.08)"/>
            <text x="-35" y="11" fill="#cbd5e1" font-family="'JetBrains Mono',monospace" font-size="6" font-weight="700" text-anchor="middle">${m.date}</text>
            <text x="50" y="11.5" fill="${col}" font-family="'JetBrains Mono',monospace" font-size="7.5" font-weight="800" text-anchor="end">${m.value}</text>
            <text x="-51" y="22.5" fill="#f8fafc" font-family="'Space Grotesk',sans-serif" font-size="7" font-weight="800" text-anchor="start">${m.label.length > 18 ? m.label.slice(0, 16) + '..' : m.label}</text>
            <text x="-51" y="30" fill="rgba(148,163,184,0.75)" font-family="'Inter',sans-serif" font-size="5.5" text-anchor="start">${(m.desc || '').slice(0, 24)}</text>
          </g>
        </g>
      `;
    }).join('');

    return `
      <div class="tpl-empire-timeline timeline-viewport ${is3D ? 'is-3d-active' : ''}" style="background:${th.bg}; width:100%; height:100%; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; overflow:hidden; user-select:none; perspective:1200px; perspective-origin:50% 45%;">
        <div style="position:absolute; inset:0; opacity:0.25; background-image:radial-gradient(rgba(255,255,255,0.1) 1px, transparent 0); background-size:3px 3px; pointer-events:none;"></div>
        
        <div class="timeline-hud-header" style="position:absolute; top:48px; left:20px; max-width:280px; z-index:10; pointer-events:none; display:flex; flex-direction:column; gap:3px;">
          <div style="font-family:'Space Grotesk',sans-serif; font-size:12.5px; font-weight:900; color:#f8fafc; letter-spacing:0.12em; text-transform:uppercase; text-shadow:0 2px 10px rgba(0,0,0,0.85); line-height:1.2;">${title}</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:600; color:${th.accent}; letter-spacing:0.08em; text-transform:uppercase; opacity:0.9;">${subtitle}</div>
        </div>
        
        <div style="position:absolute; bottom:12px; right:18px; z-index:10; pointer-events:none; background:rgba(4,9,17,0.75); border:1px solid rgba(255,255,255,0.12); padding:3px 8px; border-radius:4px; font-family:'JetBrains Mono',monospace; font-size:7.5px; color:#94a3b8; letter-spacing:0.06em; backdrop-filter:blur(4px);">
          ${is3D ? `\u2b21 3D DEPTH // PITCH: ${cameraPitch}\u00b0 YAW: ${cameraYaw}\u00b0` : `VALUATION TRAJECTORY // HAIRLINE: ${hairline.toFixed(1)}px`}
        </div>

        <div id="tm-3d-stage-plane" style="width:100%; height:100%; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; transform-style:preserve-3d; transition:transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); ${is3D ? `transform: rotateX(${cameraPitch}deg) rotateY(${cameraYaw}deg) scale(0.92); box-shadow: 0 35px 70px rgba(0,0,0,0.85);` : ''}">
          ${is3D ? `<div style="position:absolute; bottom:-12px; width:85%; height:45px; background:radial-gradient(ellipse at 50% 50%, ${th.accent} 0%, transparent 75%); opacity:0.18; filter:blur(18px); transform:rotateX(90deg) translateZ(-40px); pointer-events:none;"></div>` : ''}

          <svg class="timeline-svg" viewBox="0 0 720 405" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; display:block; ${is3D ? 'filter: drop-shadow(0 20px 30px rgba(0,0,0,0.7));' : ''}">
            <defs>
              <linearGradient id="timelineStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="${th.gradStart}"/>
                <stop offset="50%" stop-color="${th.gradMid}"/>
                <stop offset="100%" stop-color="${th.gradEnd}"/>
              </linearGradient>
              <linearGradient id="timelineAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${th.accent}" stop-opacity="0.22"/>
                <stop offset="60%" stop-color="${th.accent}" stop-opacity="0.06"/>
                <stop offset="100%" stop-color="${th.accent}" stop-opacity="0.0"/>
              </linearGradient>
              <filter id="tmGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="${th.accent}" flood-opacity="0.65"/>
              </filter>
              <filter id="tmCardShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.85"/>
              </filter>
            </defs>

            ${gridLinesHtml}

            <!-- Under-curve Luminous Area Fill -->
            ${showAreaFill ? `<path d="${areaPathD}" fill="url(#timelineAreaGrad)"/>` : ''}

            <!-- Ambient soft under-glow -->
            <path d="${curvePathD}" fill="none" stroke="${th.accent}" stroke-width="${(hairline * 2.8).toFixed(1)}" opacity="0.22" stroke-linecap="round"/>

            <!-- High-Precision Fine Hairline Curve -->
            <path id="empireTimelinePath" d="${curvePathD}" fill="none" stroke="url(#timelineStrokeGrad)" stroke-width="${hairline.toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" filter="url(#tmGlowFilter)"/>

            <!-- Glowing Tracer Particle -->
            <circle r="3.2" fill="#ffffff" stroke="${th.accent}" stroke-width="1.2" filter="url(#tmGlowFilter)">
              <animateMotion dur="4.8s" repeatCount="indefinite">
                <mpath href="#empireTimelinePath"/>
              </animateMotion>
            </circle>

            <!-- Milestone Nodes & Callout Cards -->
            ${nodesHtml}
          </svg>
        </div>
      </div>
    `;
  };

  // --- 3. LIVE STAGE DOM UPDATER ---
  window.tplUpdateStageWithContextualData = function(tplId, data) {
    if (tplId === 'conspiracy-board') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const vp = stage.querySelector('#red-string-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountRedString3DStage === 'function') {
            window.tplMountRedString3DStage(stage, data);
          }
        } else {
          if (typeof window.initRedString3DScene === 'function') {
            window.initRedString3DScene(vp, data);
          }
        }
      }
      return;
    }
    if (tplId === 'envelope-open') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const vp = stage.querySelector('#envelope-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountEnvelope3DStage === 'function') {
            window.tplMountEnvelope3DStage(stage, data);
          }
        } else {
          if (typeof window.initEnvelope3DScene === 'function') {
            window.initEnvelope3DScene(vp, data);
          }
        }
      }
      return;
    }
    if (tplId === 'wire-transfer') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const vp = stage.querySelector('#wire-transfer-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountWireTransfer3DStage === 'function') {
            window.tplMountWireTransfer3DStage(stage, data);
          }
        } else {
          if (typeof window.initWireTransfer3DScene === 'function') {
            window.initWireTransfer3DScene(vp, data);
          }
        }
      }
      return;
    }
    if (tplId === 'money-stack') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const vp = stage.querySelector('#money-stack-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountMoneyStack3DStage === 'function') {
            window.tplMountMoneyStack3DStage(stage, data);
          }
        } else {
          if (typeof window.initMoneyStack3DScene === 'function') {
            window.initMoneyStack3DScene(vp, data);
          }
        }
      }
      return;
    }
    if (tplId === 'pyramid-scheme') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const is3D = data.is3DMode !== false && (typeof topCustomizerState === 'undefined' || topCustomizerState.paperPreviewMode !== 'video');
        if (!is3D) {
          if (typeof window.tplMountPyramidCollapseVideoStage === 'function') {
            window.tplMountPyramidCollapseVideoStage(stage, data);
          }
          return;
        }
        const vp = stage.querySelector('#pyramid-collapse-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountPyramidCollapse3DStage === 'function') {
            window.tplMountPyramidCollapse3DStage(stage, data);
          }
        } else {
          if (typeof window.initPyramidCollapse3DScene === 'function') {
            window.initPyramidCollapse3DScene(vp, data);
          }
        }
      }
      return;
    }
    if (tplId === 'jani-countdown-panic-suite') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage && typeof window.tplMountCountdown3DStage === 'function') {
        window.tplMountCountdown3DStage(stage, data);
      }
      return;
    }
    if (tplId === 'jani-countdown-panic-suite') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildCountdownInspector === 'function') {
          window.tplBuildCountdownInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'deal-term-sheet' || tplId === 'newspaper-3d') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const vp = stage.querySelector('#term-sheet-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountDealTermSheet3DStage === 'function') {
            window.tplMountDealTermSheet3DStage(stage, data);
          }
        } else {
          if (typeof window.initDealTermSheet3DScene === 'function') {
            window.initDealTermSheet3DScene(vp, data);
          }
        }
      }
      return;
    }
    if (tplId === 'scam-redaction') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const is3D = data.is3DMode === true || (typeof topCustomizerState !== 'undefined' && topCustomizerState.paperPreviewMode === '3d');
        const vp = stage.querySelector('#fraud-dossier-3d-viewport');
        const fxWrap = stage.querySelector('#fx-container-scam-redaction') || stage.querySelector('.fd-scene-root');
        if (!is3D && fxWrap && typeof window.tplBuildFraudDossierHtml === 'function') {
          const target = stage.querySelector('#fx-container-scam-redaction') || stage.querySelector('#customizer-stage-inner') || stage;
          target.innerHTML = window.tplBuildFraudDossierHtml(data);
        } else if (is3D && vp) {
          if (typeof window.initFraudDossier3DScene === 'function') {
            window.initFraudDossier3DScene(vp, data);
          }
        } else {
          if (typeof window.renderTopTemplatePreviewStage === 'function') {
            window.renderTopTemplatePreviewStage();
          }
        }
      }
      return;
    }
    if (tplId === 'jani-cross-section-reveal') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#jani-cross-viewport-jani-cross-section-reveal')) {
          if (typeof window.tplMountJaniCrossSectionStage === 'function') {
            window.tplMountJaniCrossSectionStage(stage, data);
          }
        }
        if (typeof window.stepJaniCrossSectionAnimation === 'function') {
          window.stepJaniCrossSectionAnimation(stage, tplId, 0, data);
        }
      }
      return;
    }
    if (tplId === 'jani-ftx-logo-reveal') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const vp = stage.querySelector('#jani-ftx-3d-viewport');
        if (!vp) {
          if (typeof window.tplMountJaniFtxLogoStage === 'function') {
            window.tplMountJaniFtxLogoStage(stage, data);
          }
        } else {
          if (typeof window.initJaniFtxLogoScene === 'function') {
            window.initJaniFtxLogoScene(vp, data);
          }
        }
      }
      return;
    }
    if (tplId === 'jani-forbes-fraud-reveal') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#jani-forbes-viewport-jani-forbes-fraud-reveal')) {
          if (typeof window.tplMountForbes3DStage === 'function') {
            window.tplMountForbes3DStage(stage, data);
          }
        }
        if (typeof window.stepJaniForbesAnimation === 'function') {
          window.stepJaniForbesAnimation(stage, tplId, 0, data);
        }
      }
      return;
    }
    if (tplId === 'adidas-puma-cosmic-earth-suite') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#apce-viewport-adidas-puma-cosmic-earth-suite')) {
          if (typeof window.tplMountAdidasPumaCosmicStage === 'function') {
            window.tplMountAdidasPumaCosmicStage(stage, data);
          }
        }
        if (typeof window.stepAdidasPumaCosmicAnimation === 'function') {
          window.stepAdidasPumaCosmicAnimation(stage, tplId, 0.35, data);
        }
      }
      return;
    }
    if (tplId === 'tencent-shadow-giant-multimedia') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#tencent-mmdoc-viewport-tencent-shadow-giant-multimedia')) {
          if (typeof window.tplMountTencentMultimediaStage === 'function') {
            window.tplMountTencentMultimediaStage(stage, data);
          }
        }
        if (typeof window.stepTencentMultimediaAnimation === 'function') {
          window.stepTencentMultimediaAnimation(stage, tplId, 0.35, data);
        }
      }
      return;
    }
    if (tplId === 'jani-spin-flash-glitch-reveal') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#jani-sfg-viewport-jani-spin-flash-glitch-reveal')) {
          if (typeof window.tplMountJaniSpinFlashGlitchStage === 'function') {
            window.tplMountJaniSpinFlashGlitchStage(stage, data);
          }
        }
        if (typeof window.stepJaniSpinFlashGlitchAnimation === 'function') {
          window.stepJaniSpinFlashGlitchAnimation(stage, tplId, 0.62, data);
        }
      }
      return;
    }
    if (tplId === 'jani-flash-quad-sequence') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#jani-flash-quad-viewport-jani-flash-quad-sequence')) {
          if (typeof window.tplMountJaniFlashQuadStage === 'function') {
            window.tplMountJaniFlashQuadStage(stage, data);
          }
        }
        if (typeof window.stepJaniFlashQuadAnimation === 'function') {
          window.stepJaniFlashQuadAnimation(stage, tplId, 0, data);
        }
      }
      return;
    }
    if (tplId === 'google') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      const vContainer = stage ? stage.querySelector('#search-3d-viewport-container') : null;
      if (vContainer && typeof window.tplUpdateGoogleSearchLive === 'function' && vContainer.querySelector('.tpl-google')) {
        window.tplUpdateGoogleSearchLive(vContainer, data);
        return;
      } else if (vContainer && typeof window.initSearch3DScene === 'function') {
        window.initSearch3DScene(vContainer, data);
        return;
      } else if (stage && typeof window.tplMountSearch3DStage === 'function') {
        window.tplMountSearch3DStage(stage, data);
        return;
      }
    }
    if (tplId === 'kinetic') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      const vContainer = stage ? stage.querySelector('#kinetic-3d-viewport-container') : null;
      if (vContainer && typeof window.initKinetic3DScene === 'function') {
        window.initKinetic3DScene(vContainer, data);
        return;
      } else if (stage && typeof window.tplMountKinetic3DStage === 'function') {
        window.tplMountKinetic3DStage(stage, data);
        return;
      }
    }
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (!stage) return;
    let fxc = stage.querySelector(`#fx-container-${tplId}`);
    if (!fxc) {
      stage.innerHTML = `
        <div id="customizer-stage-inner" style="position: absolute; inset: 0; overflow: hidden; background: #000;">
          <div id="fx-container-${tplId}" style="position: absolute; inset: 0; display: block;"></div>
        </div>`;
      fxc = stage.querySelector(`#fx-container-${tplId}`);
    }
    if (!fxc) return;

    if (tplId === 'empire-map') {
      fxc.innerHTML = window.tplBuildEmpireMapHtml(data);
      fxc.style.display = 'block';
      const defImg = stage.querySelector(`#default-img-${tplId}`);
      if (defImg) defImg.style.display = 'none';
      if (typeof window.initUniversalStageTransformEngine === 'function') {
        window.initUniversalStageTransformEngine();
      }
      return;
    }

    if (tplId === 'empire-timeline') {
      fxc.innerHTML = window.tplBuildEmpireTimelineHtml(data);
      fxc.style.display = 'block';
      const defImg = stage.querySelector(`#default-img-${tplId}`);
      if (defImg) defImg.style.display = 'none';
    } else if (tplId === 'kenburns') {
      const kbImg = fxc.querySelector('.kb-img');
      const kbCap = fxc.querySelector('.kb-caption');
      if (kbCap) {
        kbCap.textContent = data.caption || 'TOKYO · 1987';
      }
      if (kbImg) {
        const useImg = (data.image && !data.image.includes('data:image/svg')) ? data.image : '/tokyo_1987_cinematic.jpg';
        kbImg.style.backgroundImage = `url("${useImg}")`;
        if (data.motion === 'Zoom Out') {
          kbImg.style.animation = 'kenBurnsOut 6s ease-in-out infinite';
        } else if (data.motion === 'Pan Right') {
          kbImg.style.animation = 'kenBurnsPanRight 6s ease-in-out infinite';
        } else if (data.motion === 'Pan Left') {
          kbImg.style.animation = 'kenBurnsPanLeft 6s ease-in-out infinite';
        } else {
          kbImg.style.animation = 'kenBurns 6s ease-in-out infinite';
        }
      }
    } else if (tplId === 'parallax') {
      const sun = fxc.querySelector('.sun');
      if (sun) {
        if (data.sunColor) sun.style.background = `radial-gradient(circle at center, #fff 0%, ${data.sunColor} 40%, rgba(255,122,89,0) 70%)`;
        if (data.sunSize) { sun.style.width = `${data.sunSize}px`; sun.style.height = `${data.sunSize}px`; }
      }
      const p = fxc.querySelector('.tpl-parallax');
      if (p) p.style.background = `linear-gradient(180deg, ${data.skyTop || '#0d1b2a'} 0%, #1b263b 50%, ${data.skyBottom || '#415a77'} 100%)`;
      
      const rawFig = data.figureImg || (typeof topCustomizerState !== 'undefined' && topCustomizerState.primaryUrl);
      const isCustomFig = rawFig && !rawFig.includes('data:image/svg') && !rawFig.includes('parallax_multilayer_thumb');
      const fig = fxc.querySelector('.figure');
      if (fig) {
        const useFig = isCustomFig ? rawFig : '/hiker_cutout_clean_final.png';
        const isDefaultHiker = !isCustomFig || useFig.includes('hiker_cutout') || useFig.includes('clean_traveler_cutout');
        const zScale = Number(data.zoomScale || 1.15) / 1.15;
        fig.style.clipPath = 'none';
        fig.style.background = 'none';
        fig.style.overflow = 'visible';
        fig.style.width = '25%';
        fig.style.height = '74%';
        fig.style.bottom = '0';
        fig.style.left = '50%';
        fig.style.transformOrigin = 'center bottom';
        fig.style.transform = `translateX(-50%) scale(${zScale.toFixed(3)})`;
        const imgStyle = isDefaultHiker
          ? 'position: absolute; top: -60.5%; left: 46%; transform: translateX(-50%); width: 705%; max-width: none; height: auto; pointer-events: none; user-select: none; display: block;'
          : 'width: 100%; height: 100%; object-fit: contain; object-position: center bottom; pointer-events: none; display: block;';
        fig.innerHTML = `<img class="figure-img" src="${useFig}" alt="" style="${imgStyle}" />`;
      }
      const rawMtn = data.mountainsImg || (typeof topCustomizerState !== 'undefined' && topCustomizerState.secondaryUrl);
      const isCustomMtn = rawMtn && !rawMtn.includes('data:image/svg');
      const mb = fxc.querySelector('.mtn-back');
      if (mb) {
        const useMtn = isCustomMtn ? rawMtn : '/hiker_background_inpainted.png';
        mb.style.clipPath = 'none';
        mb.style.background = `url("${useMtn}") center/cover no-repeat`;
      }
      const mf = fxc.querySelector('.mtn-front');
      if (mf && !data.keepFront) {
        mf.style.opacity = isCustomMtn ? '0.5' : '1';
      }
    } else if (tplId === 'pie') {
      const pTitle = fxc.querySelector('.p-title');
      if (pTitle && data.title) pTitle.textContent = data.title;
      const pBadge = fxc.querySelector('.p-badge');
      if (pBadge && data.presetName) pBadge.textContent = data.presetName;
      const pTotal = fxc.querySelector('.p-total');
      if (pTotal && data.totalValue) pTotal.textContent = data.totalValue;
      const slices = Array.isArray(data.slices) ? data.slices : [];
      const svgEl = fxc.querySelector('.p-svg svg');
      const legEl = fxc.querySelector('.p-legend');
      if (svgEl && slices.length) {
        const circum = 188.5;
        let offsetAcc = 0;
        svgEl.innerHTML = slices.map(s => {
          const num = Math.max(0, parseFloat(String(s.pct).replace(/[^0-9.]/g, '')) || 0);
          const dash = (num / 100) * circum;
          const curOff = -offsetAcc;
          offsetAcc += dash;
          return `<circle class="p-slice" cx="40" cy="40" r="30" stroke="${s.color || '#38bdf8'}" stroke-dashoffset="${curOff.toFixed(2)}" style="--d:${dash.toFixed(2)}"/>`;
        }).join('');
      }
      if (legEl && slices.length) {
        legEl.innerHTML = slices.map(s => `
          <div class="p-leg">
            <div class="p-leg-left"><span class="p-dot" style="background:${s.color || '#38bdf8'}"></span><span>${s.name}</span></div>
            <span class="p-pct">${s.pct}</span>
          </div>
        `).join('');
      }
    } else if (tplId === 'map') {
      fxc.innerHTML = window.tplBuildInvestigativeGlobeHtml(data);
      if (typeof window.tplBindInteractiveMapStage === 'function') {
        window.tplBindInteractiveMapStage(stage);
      }
      if (typeof window.initUniversalStageTransformEngine === 'function') {
        window.initUniversalStageTransformEngine();
      }
    }

    if (tplId === 'map-pin-drop') {
      fxc.innerHTML = window.tplBuildTacticalMapPinDropHtml(data);
      if (typeof window.initUniversalStageTransformEngine === 'function') {
        window.initUniversalStageTransformEngine();
      }
    } else if (tplId === 'wealth') {
      const title = fxc.querySelector('.w-title');
      if (title && data.title) title.textContent = data.title;
      const rows = fxc.querySelectorAll('.w-bar-row');
      (data.bars || []).forEach((b, idx) => {
        const row = rows[idx];
        if (row) {
          const l = row.querySelector('.w-label');
          if (l) l.textContent = b.label;
          const bar = row.querySelector('.w-bar');
          if (bar) {
            bar.style.width = `${b.pct}%`;
            bar.style.background = b.color;
            bar.style.boxShadow = `0 0 15px ${b.color}66`;
            const v = bar.querySelector('.w-val');
            if (v) v.textContent = b.val;
          }
        }
      });
    } else if (tplId === 'textbehind') {
      const txt = fxc.querySelector('.bigtext');
      if (txt) {
        if (data.bgText !== undefined) txt.textContent = data.bgText;
        if (data.textColor) txt.style.color = data.textColor;
        if (data.fontFamily) txt.style.fontFamily = data.fontFamily;
        if (data.fontSize) txt.style.fontSize = `${data.fontSize}px`;
        if (data.letterSpacing !== undefined) txt.style.letterSpacing = `${data.letterSpacing}px`;
        if (data.layerOrder) txt.style.zIndex = data.layerOrder === 'front' ? '4' : '1';
      }
      const subj = fxc.querySelector('.subject');
      if (subj) {
        const url = data.subjectImg || (typeof topCustomizerState !== 'undefined' && topCustomizerState.primaryUrl);
        if (url && !url.includes('data:image/svg')) {
          subj.style.clipPath = 'none';
          subj.style.borderRadius = '0';
          subj.style.backgroundImage = `url("${url}")`;
          subj.style.backgroundSize = 'contain';
          subj.style.backgroundPosition = 'center bottom';
          subj.style.backgroundRepeat = 'no-repeat';
          subj.style.width = '180px';
          subj.style.height = '220px';
        }
      }
      const bgUrl = (typeof topCustomizerState !== 'undefined') ? topCustomizerState.secondaryUrl : '';
      const tb = fxc.querySelector('.tpl-textbehind');
      if (tb && bgUrl && !bgUrl.includes('data:image/svg')) {
        tb.style.backgroundImage = `url("${bgUrl}")`;
        tb.style.backgroundSize = 'cover';
        tb.style.backgroundPosition = 'center';
      }
      const hoverBtn = fxc.querySelector('#btn-stage-toggle-order span');
      if (hoverBtn) {
        hoverBtn.textContent = data.layerOrder === 'front' ? '\ud83d\udd32 Send Text Behind' : '\ud83d\udd32 Bring Text to Front';
      }
    } else if (tplId === 'docheight') {
      if (typeof window.renderDocheightDossierHtml === 'function') {
        const docRoot = fxc.querySelector('.tpl-docheight');
        if (docRoot) {
          fxc.innerHTML = window.renderDocheightDossierHtml(data);
        } else if (typeof renderTopTemplatePreviewStage === 'function') {
          renderTopTemplatePreviewStage();
        }
      }
    } else if (tplId === 'ticker') {
      const head = fxc.querySelector('.t-head');
      if (head && data.title) head.textContent = data.title;
      const tape = fxc.querySelector('.t-tape, .t-strip');
      if (tape && Array.isArray(data.items)) {
        tape.innerHTML = data.items.map(it => `
          <span class="t-item ${it.isUp ? 'up' : 'down'}" style="${it.isUp ? 'color:#10b981;' : 'color:#ef4444;'} font-weight:700;">
            ${it.sym} ${it.price} ${it.change}
          </span>
        `).join('');
      }
    } else if (tplId === 'candle') {
      const sym = fxc.querySelector('.c-sym'); if (sym) sym.textContent = data.symbol;
      const pr = fxc.querySelector('.c-price'); if (pr) pr.textContent = data.price;
      const ch = fxc.querySelector('.c-change'); if (ch) ch.textContent = data.change;
    } else if (tplId === 'balance') {
      const root = fxc.querySelector('.tpl-balance');
      if (root) {
        root.className = `tpl-balance theme-${data.theme || 'archival'}`;
        if (typeof window.tplFitBalanceSheet === 'function') window.tplFitBalanceSheet(root);

        // CSS Variables for dynamic colors and timings
        if (data.cardAssetsDot) root.style.setProperty('--card-assets-dot', data.cardAssetsDot);
        if (data.cardStatusDot) root.style.setProperty('--card-status-dot', data.cardStatusDot);
        if (data.cardLiabDot) root.style.setProperty('--card-liab-dot', data.cardLiabDot);
        if (data.cardEquityDot) root.style.setProperty('--card-equity-dot', data.cardEquityDot);

        if (data.sceneOrbitDur !== undefined) root.style.setProperty('--scene-orbit-dur', data.sceneOrbitDur + 's');
        if (data.stampDelay !== undefined) root.style.setProperty('--stamp-delay', data.stampDelay + 's');
        if (data.stampDur !== undefined) root.style.setProperty('--stamp-dur', data.stampDur + 's');

        if (data.sweep1Delay !== undefined) root.style.setProperty('--sweep-1-delay', data.sweep1Delay + 's');
        if (data.sweep1Color) root.style.setProperty('--sweep-1-color', data.sweep1Color);
        if (data.sweep1Dur !== undefined) root.style.setProperty('--sweep-1-dur', data.sweep1Dur + 's');

        if (data.sweep2Delay !== undefined) root.style.setProperty('--sweep-2-delay', data.sweep2Delay + 's');
        if (data.sweep2Color) root.style.setProperty('--sweep-2-color', data.sweep2Color);
        if (data.sweep2Dur !== undefined) root.style.setProperty('--sweep-2-dur', data.sweep2Dur + 's');

        if (data.sweepLiabDelay !== undefined) root.style.setProperty('--sweep-liab-delay', data.sweepLiabDelay + 's');
        if (data.sweepLiabColor) root.style.setProperty('--sweep-liab-color', data.sweepLiabColor);
        if (data.sweepLiabDur !== undefined) root.style.setProperty('--sweep-liab-dur', data.sweepLiabDur + 's');

        if (data.sweepEquityDelay !== undefined) root.style.setProperty('--sweep-equity-delay', data.sweepEquityDelay + 's');
        if (data.sweepEquityColor) root.style.setProperty('--sweep-equity-color', data.sweepEquityColor);
        if (data.sweepEquityDur !== undefined) root.style.setProperty('--sweep-equity-dur', data.sweepEquityDur + 's');

        if (data.cardAssetsDelay !== undefined) root.style.setProperty('--card-assets-delay', data.cardAssetsDelay + 's');
        if (data.cardStatusDelay !== undefined) root.style.setProperty('--card-status-delay', data.cardStatusDelay + 's');
        if (data.cardLiabDelay !== undefined) root.style.setProperty('--card-liab-delay', data.cardLiabDelay + 's');
        if (data.cardEquityDelay !== undefined) root.style.setProperty('--card-equity-delay', data.cardEquityDelay + 's');
      }

      // Rubber stamp updates
      const stampEl = fxc.querySelector('.b-rubber-stamp');
      if (stampEl) {
        stampEl.style.display = (data.stampEnabled === false) ? 'none' : 'block';
        if (data.stampTop !== undefined) {
          const el = stampEl.querySelector('.stamp-txt-top');
          if (el) el.textContent = data.stampTop;
        }
        if (data.stampMain !== undefined) {
          const el = stampEl.querySelector('.stamp-txt-main');
          if (el) el.textContent = data.stampMain;
        }
        if (data.stampSub !== undefined) {
          const el = stampEl.querySelector('.stamp-txt-sub');
          if (el) el.textContent = data.stampSub;
        }
        if (data.stampColor) {
          const box = stampEl.querySelector('.b-stamp-box');
          if (box) {
            box.style.borderColor = data.stampColor;
            box.style.color = data.stampColor;
          }
        }
      }

      // Header updates
      const comp = fxc.querySelector('.b-company');
      if (comp && data.company !== undefined) comp.textContent = data.company;
      const per = fxc.querySelector('.b-period');
      if (per && data.period !== undefined) per.textContent = data.period;

      // Totals
      const aTot = data.assetsTotal || data.assets || '$143.5B';
      const lTot = data.liabilitiesTotal || data.liabilities || '$81.4B';
      const eTot = data.equityTotal || data.netWorth || '$62.1B';

      fxc.querySelectorAll('.val-assets').forEach(el => { el.textContent = aTot; });
      fxc.querySelectorAll('.val-assets-sub').forEach(el => { el.textContent = aTot; });
      fxc.querySelectorAll('.val-liab').forEach(el => { el.textContent = lTot; });
      fxc.querySelectorAll('.val-liab-calc').forEach(el => { el.textContent = lTot; });
      fxc.querySelectorAll('.val-equity').forEach(el => { el.textContent = eTot; });
      fxc.querySelectorAll('.val-equity-calc').forEach(el => { el.textContent = eTot; });
      fxc.querySelectorAll('.val-liab-equity-sum').forEach(el => { el.textContent = aTot; });

      // HUD Card 1 (Assets)
      const cAssets = fxc.querySelector('.b-hud-assets');
      if (cAssets) {
        if (data.cardAssetsTag !== undefined) {
          const t = cAssets.querySelector('.b-hud-tag'); if (t) t.textContent = data.cardAssetsTag;
        }
        if (data.cardAssetsVal !== undefined) {
          const v = cAssets.querySelector('.val-hud-assets'); if (v) v.textContent = data.cardAssetsVal;
        }
        if (data.cardAssetsPct !== undefined) {
          const p = cAssets.querySelector('.b-delta-pct'); if (p) p.textContent = data.cardAssetsPct;
        }
        if (data.cardAssetsSub !== undefined) {
          const s = cAssets.querySelector('.b-hud-sub'); if (s) s.textContent = data.cardAssetsSub;
        }
      }

      // HUD Card 2 (Status)
      const cStatus = fxc.querySelector('.b-hud-status');
      if (cStatus) {
        if (data.cardStatusTag !== undefined) {
          const t = cStatus.querySelector('.b-hud-tag'); if (t) t.textContent = data.cardStatusTag;
        }
        if (data.cardStatusVal !== undefined) {
          const v = cStatus.querySelector('.b-hud-status-val'); if (v) v.textContent = data.cardStatusVal;
        }
        if (data.cardStatusSub !== undefined) {
          const s = cStatus.querySelector('.b-hud-sub'); if (s) s.textContent = data.cardStatusSub;
        }
        const checkIcon = cStatus.querySelector('.b-hud-check-icon');
        if (checkIcon) {
          checkIcon.style.display = (data.cardStatusCheck === false) ? 'none' : 'inline-flex';
        }
      }

      // HUD Card 3 (Liabilities)
      const cLiab = fxc.querySelector('.b-hud-liab');
      if (cLiab) {
        if (data.cardLiabTag !== undefined) {
          const t = cLiab.querySelector('.b-hud-tag'); if (t) t.textContent = data.cardLiabTag;
        }
        if (data.cardLiabVal !== undefined) {
          const v = cLiab.querySelector('.val-hud-liab'); if (v) v.textContent = data.cardLiabVal;
        }
        if (data.cardLiabPct !== undefined) {
          const p = cLiab.querySelector('.b-delta-pct'); if (p) p.textContent = data.cardLiabPct;
        }
        if (data.cardLiabSub !== undefined) {
          const s = cLiab.querySelector('.b-hud-sub'); if (s) s.textContent = data.cardLiabSub;
        }
      }

      // HUD Card 4 (Equity)
      const cEquity = fxc.querySelector('.b-hud-equity');
      if (cEquity) {
        if (data.cardEquityTag !== undefined) {
          const t = cEquity.querySelector('.b-hud-tag'); if (t) t.textContent = data.cardEquityTag;
        }
        if (data.cardEquityVal !== undefined) {
          const v = cEquity.querySelector('.val-hud-equity'); if (v) v.textContent = data.cardEquityVal;
        }
        if (data.cardEquityPct !== undefined) {
          const p = cEquity.querySelector('.b-delta-pct'); if (p) p.textContent = data.cardEquityPct;
        }
        if (data.cardEquitySub !== undefined) {
          const s = cEquity.querySelector('.b-hud-sub'); if (s) s.textContent = data.cardEquitySub;
        }
      }

      // Legacy Color highlights compatibility
      if (data.assetColor) {
        const el = fxc.querySelector('.b-hud-assets .b-hud-tag');
        if (el) el.style.color = data.assetColor;
      }
      if (data.liabColor) {
        const el = fxc.querySelector('.b-hud-liab .b-hud-tag');
        if (el) el.style.color = data.liabColor;
      }
      if (data.equityColor) {
        const el = fxc.querySelector('.b-hud-equity .b-hud-tag');
        if (el) el.style.color = data.equityColor;
      }

      // Dynamic rows update if provided
      if (Array.isArray(data.assetRows) && data.assetRows.length > 0) {
        const aList = fxc.querySelector('.b-asset-rows');
        if (aList) {
          aList.innerHTML = data.assetRows.map((r, i) => `
            <div class="b-tbl-row ${i === 0 ? 'b-row-hl-mint sweep-1' : (i === 1 ? 'b-row-hl-mint sweep-2' : '')}">
              <span class="b-marker-stroke ${i < 2 ? 'b-mint-marker' : ''}"></span>
              <span class="b-tbl-name">${r.name || ''}</span>
              <span class="b-tbl-leader"></span>
              <span class="b-tbl-val yr-curr val-asset-${i+1}">${r.val || ''}</span>
              <span class="b-tbl-val yr-prev">${r.prev || r.val || ''}</span>
            </div>
          `).join('');
        }
      }
      if (Array.isArray(data.liabRows) && data.liabRows.length > 0) {
        const lList = fxc.querySelector('.b-liab-rows-inner');
        if (lList) {
          lList.innerHTML = data.liabRows.map((r, i) => `
            <div class="b-tbl-row">
              <span class="b-marker-stroke"></span>
              <span class="b-tbl-name">${r.name || ''}</span>
              <span class="b-tbl-leader"></span>
              <span class="b-tbl-val yr-curr val-liab-${i+1}">${r.val || ''}</span>
              <span class="b-tbl-val yr-prev">${r.prev || r.val || ''}</span>
            </div>
          `).join('');
        }
      }

      // Depth of Field focus mode, unfocused blur, mystery lines, and camera tilt
      const balRoot = fxc.querySelector('.tpl-balance');
      if (balRoot) {
        const dofEnabled = data.dofFocusEnabled !== false;
        balRoot.classList.toggle('has-dof-focus', dofEnabled);
        const blurPx = data.unfocusedBlur !== undefined ? data.unfocusedBlur : 1.2;
        const opacityVal = data.unfocusedOpacity !== undefined ? data.unfocusedOpacity : 0.55;
        balRoot.style.setProperty('--bal-unfocus-blur', `${blurPx}px`);
        balRoot.style.setProperty('--bal-unfocus-opacity', `${opacityVal}`);

        // Mystery line alpha control
        const lineAlpha = data.lineAlpha !== undefined ? data.lineAlpha : 0.28;
        const leaderAlpha = data.leaderAlpha !== undefined ? data.leaderAlpha : 0.22;
        balRoot.style.setProperty('--bal-line-alpha', `${lineAlpha}`);
        balRoot.style.setProperty('--bal-leader-alpha', `${leaderAlpha}`);

        // 3D Camera tilt control
        if (data.cameraTilt !== undefined) {
          const scene3D = balRoot.querySelector('.b-scene-3d');
          if (scene3D) {
            const tilt = parseFloat(data.cameraTilt);
            scene3D.style.transform = `translate(-50%, -50%) rotateX(${tilt}deg) rotateY(${(-tilt * 0.85).toFixed(1)}deg) rotateZ(1.2deg)`;
          }
        }
      }
    } else if (tplId === 'compound') {
      const v = fxc.querySelector('.ci-val, .ci-amount'); if (v) v.textContent = data.futureVal;
      const subs = fxc.querySelectorAll('.ci-sub');
      if (subs[0]) subs[0].textContent = `Start: ${data.initial}`;
      if (subs[1]) subs[1].textContent = `Add: ${data.monthly}`;
    } else if (tplId === 'receipt') {
      const st = fxc.querySelector('.r-store'); if (st && data.store) st.textContent = data.store;
      const tot = fxc.querySelector('.r-total-val'); if (tot && data.total) tot.textContent = data.total;
      const auth = fxc.querySelector('.r-auth'); if (auth && data.authCode) auth.textContent = data.authCode;
      const wrapItems = fxc.querySelector('.r-items-wrap');
      if (wrapItems && Array.isArray(data.items)) {
        wrapItems.innerHTML = data.items.map(it => `<div class="r-item"><span class="name">${it.name || it}</span><span class="price">${it.price || ''}</span></div>`).join('');
      }
      const isOverlay = data.isOverlay !== false;
      const isTrans = data.transparentBg !== false && isOverlay;
      const root = fxc.querySelector('.tpl-receipt');
      if (root) {
        if (isOverlay) {
          root.classList.add('is-overlay-mode');
          root.classList.remove('is-object-mode');
        } else {
          root.classList.add('is-object-mode');
          root.classList.remove('is-overlay-mode');
        }
        if (isTrans) {
          root.classList.add('is-transparent');
          root.style.background = 'transparent';
        } else {
          root.classList.remove('is-transparent');
          root.style.background = '';
        }
        if (typeof window.tplSyncUniversalBgStageLayer === 'function') {
          window.tplSyncUniversalBgStageLayer(root, data);
        }
      }
      const wrap = fxc.querySelector('.r-wrap');
      if (wrap) {
        const posX = typeof data.posX === 'number' ? data.posX : 0;
        const posY = typeof data.posY === 'number' ? data.posY : 0;
        const scale = typeof data.scale === 'number' ? data.scale : 1.0;
        const rot = typeof data.rotation === 'number' ? data.rotation : 0;
        wrap.style.transform = `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rot}deg)`;
      }
      const paper = fxc.querySelector('.r-paper');
      if (paper && data.receiptTheme) {
        paper.className = `r-paper theme-${data.receiptTheme}`;
      }
      if (typeof window.tplUpdateTransformBox === 'function') {
        window.tplUpdateTransformBox();
      }
    } else if (tplId === 'google') {
      const q = fxc.querySelector('.g-query, .typed-text'); if (q && data.query !== undefined) q.textContent = data.query;
      const s1 = fxc.querySelector('.g-sug .g-sug-text, .sugg:nth-child(1)'); if (s1 && data.suggestion !== undefined) s1.textContent = data.suggestion;
      const s2 = fxc.querySelector('.g-sug2 .g-sug-text, .sugg:nth-child(2)'); if (s2 && data.suggestion2 !== undefined) s2.textContent = data.suggestion2;
      const s3 = fxc.querySelector('.g-sug3 .g-sug-text, .sugg:nth-child(3)'); if (s3 && data.suggestion3 !== undefined) s3.textContent = data.suggestion3;
    } else if (tplId === 'imessage') {
      const c = fxc.querySelector('.im-contact'); if (c && data.contact) c.textContent = data.contact;
      const av = fxc.querySelector('.im-avatar'); if (av && data.contact) av.textContent = data.contact.charAt(0).toUpperCase();
      const b = fxc.querySelectorAll('.bubble');
      if (b[0] && data.msg1 !== undefined) b[0].textContent = data.msg1;
      if (b[1] && data.msg2 !== undefined) b[1].textContent = data.msg2;
      if (b[2] && data.msg3 !== undefined) b[2].textContent = data.msg3;
      if (b[3] && data.msg4 !== undefined) b[3].textContent = data.msg4;
    } else if (tplId === 'notif') {
      const t = fxc.querySelector('.notif-title'); if (t && data.title) t.textContent = data.title;
      const m = fxc.querySelector('.notif-msg'); if (m && data.body) m.textContent = data.body;
      const tm = fxc.querySelector('.notif-time'); if (tm && data.time) tm.textContent = data.time;
    } else if (tplId === 'tweet') {
      const name = fxc.querySelector('.tw-name'); if (name && data.author !== undefined) name.textContent = data.author;
      const av = fxc.querySelector('.tw-avatar'); if (av && data.author) av.textContent = data.author.charAt(0).toUpperCase();
      const h = fxc.querySelector('.tw-handle'); if (h && data.handle !== undefined) h.textContent = data.handle;
      const txt = fxc.querySelector('.tw-text'); if (txt && data.text !== undefined) txt.textContent = data.text;
      const l = fxc.querySelector('.tw-likes'); if (l && data.likes !== undefined) l.textContent = data.likes;
      const rt = fxc.querySelector('.tw-retweets'); if (rt && data.retweets !== undefined) rt.textContent = data.retweets;
    } else if (tplId === 'kinetic') {
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';

      const materials = [
        { id: 'bronze', name: 'Brushed Bronze (Image 2)', color: '#cd7f32', border: '#f59e0b' },
        { id: 'steel', name: 'Industrial Brushed Steel', color: '#cbd5e1', border: '#38bdf8' },
        { id: 'gold', name: 'Architectural Gold', color: '#fbbf24', border: '#fef08a' },
        { id: 'matteDark', name: 'Matte Obsidian Slate', color: '#475569', border: '#818cf8' }
      ];

      const envs = [
        { id: 'darkStudio', name: 'Architectural Studio (Floor Grid + Spotlight)', icon: '🏛️' },
        { id: 'archivalStock', name: 'Subtle B-Roll Backdrop (18% Opacity + Vignette)', icon: '🎥' }
      ];

      const cameraFlights = [
        { id: 'cinematicPan', name: 'Cinematic Tilt & Pan Sweep (Jani Style)' },
        { id: 'focusRack', name: 'Dramatic Focus Rack Zoom' },
        { id: 'monolithicLow', name: 'Monumental Low-Angle Perspective' }
      ];

      const dofOptions = [
        { id: 'word2', label: 'Focus INSPIRE (Middle)', desc: 'Word 1 & 3 receive smooth lens bokeh' },
        { id: 'word1', label: 'Focus CREATE (Top)', desc: 'Foreground & lower words blur out' },
        { id: 'word3', label: 'Focus DELIVER (Bottom)', desc: 'Camera looks up at razor-sharp base' },
        { id: 'allSharp', label: 'All Words Sharp', desc: 'Deep architectural depth of field' }
      ];

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(245,158,11,0.35); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">🏛️</span>
              <span style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.8px;">James Jani 3D Kinetic Typography</span>
            </div>
            <span style="font-size: 9px; color: #22c55e; font-weight: 700; background: rgba(34,197,94,0.18); border: 1px solid rgba(34,197,94,0.35); padding: 2px 6px; border-radius: 4px;">PHYSICAL SHADERS</span>
          </div>

          <!-- Section 1: Monolithic Words Stack -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Monolithic Word Architecture (3-Tier Stack)</span>
            
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.35); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
                <span style="font-size: 8.5px; font-family: monospace; color: #f59e0b; width: 44px; font-weight: 700;">TIER 1</span>
                <input type="text" id="kt-inp-word1" value="${data.word1 || 'CREATE'}" style="flex: 1; background: transparent; border: none; color: #fff; font-size: 11px; font-weight: 800; outline: none; text-transform: uppercase;" />
              </div>
              <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.35); padding: 4px 8px; border-radius: 6px; border: 1.5px solid rgba(245,158,11,0.5); box-shadow: inset 0 0 10px rgba(245,158,11,0.15);">
                <span style="font-size: 8.5px; font-family: monospace; color: #fbbf24; width: 44px; font-weight: 800;">TIER 2 ★</span>
                <input type="text" id="kt-inp-word2" value="${data.word2 || 'INSPIRE'}" style="flex: 1; background: transparent; border: none; color: #fef08a; font-size: 11.5px; font-weight: 800; outline: none; text-transform: uppercase;" />
              </div>
              <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.35); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
                <span style="font-size: 8.5px; font-family: monospace; color: #f59e0b; width: 44px; font-weight: 700;">TIER 3</span>
                <input type="text" id="kt-inp-word3" value="${data.word3 || 'DELIVER'}" style="flex: 1; background: transparent; border: none; color: #fff; font-size: 11px; font-weight: 800; outline: none; text-transform: uppercase;" />
              </div>
            </div>
          </div>

          <!-- Section 2: Physical Material & Shaders -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Physical Shader Material</span>
              <span style="font-size: 9px; color: #cbd5e1; font-weight: 600;">Specular Rim Shaders</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
              ${materials.map(m => `
                <button type="button" class="btn-kt-mat" data-mat="${m.id}" style="padding: 6px 8px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: 1.5px solid ${data.material === m.id ? m.border : 'rgba(255,255,255,0.08)'}; background: ${data.material === m.id ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.35)'}; color: ${data.material === m.id ? '#fff' : '#94a3b8'}; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: ${m.color}; display: inline-block;"></span>
                  <span>${m.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 3: Extrusion Depth & Bevel Sliders -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
                <span>Z-AXIS EXTRUSION</span>
                <span id="kt-val-extrude" style="color: #cbd5e1; font-family: monospace;">${data.extrusionDepth || 32}px</span>
              </div>
              <input type="range" id="kt-slider-extrude" min="16" max="64" value="${data.extrusionDepth || 32}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
                <span>BEVEL CHAMFER</span>
                <span id="kt-val-bevel" style="color: #cbd5e1; font-family: monospace;">${data.bevelSize || 2.2}px</span>
              </div>
              <input type="range" id="kt-slider-bevel" min="1" max="5" step="0.2" value="${data.bevelSize || 2.2}" style="accent-color: #f59e0b; height: 3px; cursor: pointer;" />
            </div>
          </div>

          <!-- Section 4: Atmospheric Background Studio Environment -->
          <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Atmospheric Canvas Backdrop</span>
            <div style="display: flex; flex-direction: column; gap: 5px;">
              ${envs.map(env => `
                <button type="button" class="btn-kt-env" data-env="${env.id}" style="padding: 6px 8px; font-size: 10px; font-weight: 600; border-radius: 6px; border: 1px solid ${data.envPreset === env.id ? '#f59e0b' : 'rgba(255,255,255,0.08)'}; background: ${data.envPreset === env.id ? 'rgba(245,158,11,0.18)' : 'rgba(0,0,0,0.3)'}; color: ${data.envPreset === env.id ? '#fef08a' : '#94a3b8'}; cursor: pointer; display: flex; align-items: center; gap: 6px; text-align: left;">
                  <span>${env.icon}</span>
                  <span>${env.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 5: 3D Camera Rig & Shallow Depth of Field (DoF) -->
          <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">3D Camera Flight & Lens Optics</span>
              <span style="font-size: 8.5px; color: #38bdf8; font-family: monospace;">f/2.8 BOKEH</span>
            </div>

            <!-- Flight Path Selector -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #64748b;">FLIGHT PATH MOTION</span>
              <select id="kt-sel-flight" style="background: #09090b; border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: 10px; border-radius: 5px; padding: 4px 6px; outline: none; cursor: pointer;">
                ${cameraFlights.map(cf => `
                  <option value="${cf.id}" ${data.cameraFlight === cf.id ? 'selected' : ''}>${cf.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Depth of Field Focal Word -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; color: #64748b;">LENS FOCUS RACK TARGET</span>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                ${dofOptions.map(dof => `
                  <button type="button" class="btn-kt-dof" data-dof="${dof.id}" style="padding: 4px 6px; font-size: 9px; font-weight: 600; border-radius: 4px; border: 1px solid ${data.dofFocus === dof.id ? '#38bdf8' : 'rgba(255,255,255,0.06)'}; background: ${data.dofFocus === dof.id ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${data.dofFocus === dof.id ? '#38bdf8' : '#94a3b8'}; cursor: pointer;">
                    ${dof.label}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      // Event Listeners for Kinetic Typography Stack
      ['word1', 'word2', 'word3'].forEach(k => {
        const inp = container.querySelector(`#kt-inp-${k}`);
        inp?.addEventListener('input', (e) => {
          const val = e.target.value.toUpperCase();
          window.tplSetContextualData('kinetic', { [k]: val });
          window.tplUpdateStageWithContextualData('kinetic', window.tplGetContextualData('kinetic'));
        });
      });

      // Material buttons
      container.querySelectorAll('.btn-kt-mat').forEach(b => {
        b.addEventListener('click', () => {
          const mat = b.dataset.mat;
          window.tplSetContextualData('kinetic', { material: mat });
          window.tplRenderContextualInspector('kinetic');
          window.tplUpdateStageWithContextualData('kinetic', window.tplGetContextualData('kinetic'));
        });
      });

      // Sliders
      const sExt = container.querySelector('#kt-slider-extrude');
      sExt?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        container.querySelector('#kt-val-extrude').textContent = `${val}px`;
        window.tplSetContextualData('kinetic', { extrusionDepth: val });
        window.tplUpdateStageWithContextualData('kinetic', window.tplGetContextualData('kinetic'));
      });

      const sBev = container.querySelector('#kt-slider-bevel');
      sBev?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        container.querySelector('#kt-val-bevel').textContent = `${val}px`;
        window.tplSetContextualData('kinetic', { bevelSize: val });
        window.tplUpdateStageWithContextualData('kinetic', window.tplGetContextualData('kinetic'));
      });

      // Environment buttons
      container.querySelectorAll('.btn-kt-env').forEach(b => {
        b.addEventListener('click', () => {
          const env = b.dataset.env;
          window.tplSetContextualData('kinetic', { envPreset: env });
          window.tplRenderContextualInspector('kinetic');
          window.tplUpdateStageWithContextualData('kinetic', window.tplGetContextualData('kinetic'));
        });
      });

      // Camera flight select
      const selFlight = container.querySelector('#kt-sel-flight');
      selFlight?.addEventListener('change', (e) => {
        window.tplSetContextualData('kinetic', { cameraFlight: e.target.value });
        window.tplUpdateStageWithContextualData('kinetic', window.tplGetContextualData('kinetic'));
      });

      // DoF buttons
      container.querySelectorAll('.btn-kt-dof').forEach(b => {
        b.addEventListener('click', () => {
          const dof = b.dataset.dof;
          window.tplSetContextualData('kinetic', { dofFocus: dof });
          window.tplRenderContextualInspector('kinetic');
          window.tplUpdateStageWithContextualData('kinetic', window.tplGetContextualData('kinetic'));
        });
      });

      return;
    }

    if (tplId === 'quote') {
      const q = fxc.querySelector('.quote-text');
      if (q && data.quote !== undefined) {
        q.textContent = data.quote;
      }
      const a = fxc.querySelector('.quote-author');
      if (a && data.author !== undefined) {
        a.textContent = `\u2014 ${data.author}`;
      }
      const qm = fxc.querySelector('.quote-mark');
      const root = fxc.querySelector('.tpl-quote');
      if (data.textColor && q) q.style.color = data.textColor;
      if (data.authorColor && a) a.style.color = data.authorColor;
      if (data.quoteMarkColor && qm) qm.style.color = data.quoteMarkColor;
      if (data.bgGradient && root) root.style.background = data.bgGradient;
      if (data.fontFamily && q) q.style.fontFamily = data.fontFamily;
      if (data.fontSize && q) q.style.fontSize = `${data.fontSize}px`;
    } else if (tplId === 'news') {
      const root = fxc.querySelector('.tpl-news');
      if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
        window.tplSyncUniversalBgStageLayer(root, data);
      }
      const ch = fxc.querySelector('.news-badge'); if (ch && data.channel !== undefined) ch.textContent = data.channel;
      const rep = fxc.querySelector('.chyron-report'); if (rep && data.report !== undefined) rep.textContent = data.report;
      const hl = fxc.querySelector('.headline'); if (hl && data.headline !== undefined) hl.textContent = data.headline;
      const tk = fxc.querySelector('.ticker-text'); if (tk && data.ticker !== undefined) tk.textContent = data.ticker;
      if (data.bannerColor) {
        const up = fxc.querySelector('.chyron-upper');
        const tr = fxc.querySelector('.ticker-red');
        const isCustomCol = data.bannerColor !== '#dc2626' && data.bannerColor !== '#ef4444';
        if (up) {
          up.style.background = isCustomCol 
            ? `linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 38%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.52) 100%), linear-gradient(90deg, #450407 0%, ${data.bannerColor} 30%, #ef1c24 50%, ${data.bannerColor} 70%, #450407 100%)`
            : '';
        }
        if (tr) {
          tr.style.background = isCustomCol
            ? `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.5) 100%), ${data.bannerColor}`
            : '';
        }
        if (hl) {
          hl.style.borderLeftColor = data.bannerColor;
          hl.style.boxShadow = `inset 2px 0 8px ${data.bannerColor}66, inset 0 1.5px 0 rgba(255,255,255,0.3), inset 0 -1.5px 1px rgba(0,0,0,0.7)`;
        }
      }
      if (data.glassBlur !== undefined && hl) {
        hl.style.backdropFilter = `blur(${data.glassBlur}px) saturate(180%) contrast(108%)`;
        hl.style.webkitBackdropFilter = `blur(${data.glassBlur}px) saturate(180%) contrast(108%)`;
      }
    } else if (tplId === 'polaroid') {
      const root = fxc.querySelector('.tpl-polaroid');
      if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
        window.tplSyncUniversalBgStageLayer(root, data);
      }
      const c1 = fxc.querySelector('.p1-cap'); if (c1 && data.caption !== undefined) c1.textContent = data.caption;
      const c2 = fxc.querySelector('.p2-cap'); if (c2 && data.caption2 !== undefined) c2.textContent = data.caption2;
      const img1 = fxc.querySelector('.p1-img'); if (img1 && data.photo1) img1.style.backgroundImage = `url("${data.photo1}")`;
      const img2 = fxc.querySelector('.p2-img'); if (img2 && data.photo2) img2.style.backgroundImage = `url("${data.photo2}")`;
      const pCards = fxc.querySelectorAll('.polaroid');
      const sc = data.polaroidScale !== undefined ? Number(data.polaroidScale) : 1;
      if (pCards[0]) {
        const x1 = data.p1X !== undefined ? Number(data.p1X) : -78;
        const y1 = data.p1Y !== undefined ? Number(data.p1Y) : -6;
        const r1 = data.p1Rot !== undefined ? Number(data.p1Rot) : -11;
        pCards[0].classList.add('is-user-transformed');
        pCards[0].style.transform = `translate(${x1}px, ${y1}px) rotate(${r1}deg) scale(${sc})`;
      }
      if (pCards[1]) {
        const x2 = data.p2X !== undefined ? Number(data.p2X) : 72;
        const y2 = data.p2Y !== undefined ? Number(data.p2Y) : 10;
        const r2 = data.p2Rot !== undefined ? Number(data.p2Rot) : 7;
        pCards[1].classList.add('is-user-transformed');
        pCards[1].style.transform = `translate(${x2}px, ${y2}px) rotate(${r2}deg) scale(${sc})`;
      }
    } else if (tplId === 'money') {
      const d = fxc.querySelector('.dollar'); if (d) d.textContent = data.amount;
      const l = fxc.querySelector('.money-label, .label'); if (l) l.textContent = data.label;
    } else if (tplId === 'instagram') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      const viewport = stage ? stage.querySelector('#instagram-3d-viewport') : null;
      if (viewport && typeof window.initInstagram3DScene === 'function') {
        window.initInstagram3DScene(viewport, data);
      }
    } else if (tplId === 'checklist') {
      if (typeof window.tplBuildChecklistHtml === 'function') {
        fxc.innerHTML = window.tplBuildChecklistHtml(data);
      }
    } else if (tplId === 'progress') {
      if (typeof window.tplBuildProgressHtml === 'function') {
        fxc.innerHTML = window.tplBuildProgressHtml(data);
        const root = fxc.querySelector('.tpl-progress');
        if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
          window.tplSyncUniversalBgStageLayer(root, data);
        }
      }
    } else if (tplId === 'scramble') {
      let root = fxc.querySelector('.tpl-scramble');
      const activeMode = (data && data.layoutMode) || 'chat';
      const currentMode = root ? (root.classList.contains('scramble-mode-terminal') ? 'terminal' : 'chat') : null;
      if (!root || currentMode !== activeMode) {
        fxc.innerHTML = window.tplBuildScrambleHtml ? window.tplBuildScrambleHtml(data) : '';
        root = fxc.querySelector('.tpl-scramble');
      }
      if (root) {
        if (typeof window.tplSyncUniversalBgStageLayer === 'function') {
          window.tplSyncUniversalBgStageLayer(root, data);
        }
        const color = data.color || '#00ff88';
        root.style.setProperty('--scramble-col', color);
        root.style.setProperty('--scramble-glow', color + '99');
        root.style.setProperty('--scramble-dim', color + '26');

        const scan = root.querySelector('.scramble-scanlines');
        if (scan) {
          scan.style.display = (data.showScanlines === false) ? 'none' : '';
        }

        const nodeTag = root.querySelector('.scramble-node-tag');
        if (nodeTag && data.headerTag !== undefined) nodeTag.textContent = data.headerTag;

        const senderHandle = root.querySelector('.scramble-sender-handle');
        if (senderHandle && data.senderHandle !== undefined) senderHandle.textContent = data.senderHandle;

        const subTextEl = root.querySelector('.scramble-subtext');
        if (subTextEl && data.subText !== undefined) subTextEl.textContent = data.subText;

        const mainTextEl = root.querySelector('.scramble-main-text');
        if (mainTextEl) {
          if (data.fontFamily) mainTextEl.style.fontFamily = data.fontFamily;
          if (data.fontSize) mainTextEl.style.fontSize = `${data.fontSize}px`;
        }

        const charsEl = root.querySelector('.scramble-chars');
        if (charsEl) {
          const prevTarget = charsEl.dataset.target;
          const newTarget = data.text !== undefined ? String(data.text) : (prevTarget || 'you are a dead man');
          if (prevTarget !== newTarget) {
            charsEl.dataset.target = newTarget;
            if (typeof window.tplTriggerScrambleAnimation === 'function') {
              window.tplTriggerScrambleAnimation(root, data);
            } else {
              charsEl.textContent = newTarget;
            }
          }
        }
      }
    } else if (tplId === 'creditscore') {
      const sc = fxc.querySelector('.cs-score'); if (sc) sc.textContent = data.score;
      const r = fxc.querySelector('.cs-rating'); if (r) { r.textContent = data.rating; r.style.color = data.color; }
    } else if (tplId === 'budget') {
      const t = fxc.querySelector('.b-title'); if (t) t.textContent = `50/30/20 Budget \u00b7 ${data.income}`;
    } else if (tplId === 'subscribe') {
      const c = fxc.querySelector('.sub-ch'); if (c) c.textContent = (data.channel !== undefined) ? data.channel : 'Magnates Media';
      const s = fxc.querySelector('.sub-count'); if (s) s.textContent = data.subs || 'Road to 1 million';
      const btn = fxc.querySelector('.sub-btn');
      if (btn) {
        const btnLbl = btn.querySelector('.sub-btn-label');
        if (btnLbl) btnLbl.textContent = data.btnText || 'SUBSCRIBE';
        else btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 15l5.19-3L10 9v6z"/></svg><span class="sub-btn-label">${data.btnText || 'SUBSCRIBE'}</span>`;
        if (data.btnColor) {
          btn.style.setProperty('--sub-btn-bg', data.btnColor);
          btn.style.backgroundColor = data.btnColor;
          btn.style.boxShadow = `0 8px 24px ${data.btnColor}66`;
        }
      }
      const bell = fxc.querySelector('.bell');
      if (bell) {
        bell.style.display = data.showBell !== false ? 'grid' : 'none';
        if (data.bellColor) bell.style.background = data.bellColor;
      }
      const wrap = fxc.querySelector('.sub-wrap');
      if (wrap) {
        const posX = typeof data.posX === 'number' ? data.posX : 0;
        const posY = typeof data.posY === 'number' ? data.posY : 0;
        const scale = typeof data.scale === 'number' ? data.scale : 1.0;
        wrap.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
      }
      const root = fxc.querySelector('.tpl-subscribe');
      if (root) {
        if (data.transparentBg) {
          root.classList.add('is-transparent');
          root.style.background = 'transparent';
        } else {
          root.classList.remove('is-transparent');
          root.style.background = '';
        }
        if (typeof window.tplSyncUniversalBgStageLayer === 'function') {
          window.tplSyncUniversalBgStageLayer(root, data);
        }
      }
      if (typeof window.tplUpdateTransformBox === 'function') {
        window.tplUpdateTransformBox();
      }
    } else if (tplId === 'newspaper') {
      const n = fxc.querySelector('.paper-name'); if (n) n.textContent = data.paperName;
      const h = fxc.querySelector('.headline'); if (h) h.textContent = data.headline;
      const sub = fxc.querySelector('.subhead'); if (sub) sub.textContent = data.subhead;
    } else if (tplId === 'hormozi') {
      const root = fxc.querySelector('.tpl-hormozi');
      const cap = fxc.querySelector('.caption-wrap, .caption');
      const rawCap = data.caption || 'NEVER TRADE YOUR TIME FOR MONEY';
      const kw = (data.keyword || '').toUpperCase();
      const kCol = data.keyColor || '#facc15';
      if (cap) {
        if (data.fontSize) cap.style.fontSize = `${data.fontSize}px`;
        if (data.fontFamily) cap.style.fontFamily = data.fontFamily;
        if (data.color || data.textColor) cap.style.color = data.color || data.textColor;
        cap.style.whiteSpace = 'nowrap';
        cap.innerHTML = rawCap.split(/\s+/).filter(Boolean).map((w, idx) => {
          const cleanW = w.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
          const isKw = kw && cleanW === kw;
          return `<span class="word" style="animation-delay:${(idx * 0.35).toFixed(2)}s; ${isKw ? `color:${kCol};--hl-col:${kCol};` : `--hl-col:${kCol};`}">${w}</span>`;
        }).join(' ');
        if (typeof window.tplUpdateTransformBox === 'function') window.tplUpdateTransformBox();
      }
      if (root) {
        const existingVid = root.querySelector('.hormozi-bg-video');
        if (data.bgMedia && data.bgMediaType === 'video') {
          if (existingVid) {
            if (existingVid.src !== data.bgMedia) existingVid.src = data.bgMedia;
          } else {
            const v = document.createElement('video');
            v.className = 'hormozi-bg-video';
            v.src = data.bgMedia;
            v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
            root.prepend(v);
          }
        } else {
          if (existingVid) existingVid.remove();
          if (data.bgMedia) {
            root.style.background = `radial-gradient(circle at 50% 40%, rgba(15,23,42,0.45) 0%, rgba(5,8,17,0.85) 100%), url("${data.bgMedia}") center/cover no-repeat`;
          } else if (data.transparentBg) {
            root.style.background = 'rgba(15,23,42,0.22)';
          } else {
            root.style.background = '';
          }
        }
        root.querySelectorAll('.emoji').forEach(el => el.remove());
        if (data.showEmoji) {
          const e1 = document.createElement('div');
          e1.className = 'emoji e1';
          e1.textContent = data.emoji || '\ud83d\udd25';
          root.appendChild(e1);
        }
      }
    } else if (tplId === 'split') {
      const l1 = fxc.querySelector('.split-label-left'); if (l1 && data.leftLabel) l1.textContent = data.leftLabel;
      const l2 = fxc.querySelector('.split-label-right'); if (l2 && data.rightLabel) l2.textContent = data.rightLabel;
      if (data.leftImg) {
        const hl = fxc.querySelector('.half-l');
        if (hl) hl.style.backgroundImage = `url("${data.leftImg}")`;
      }
      if (data.rightImg) {
        const hr = fxc.querySelector('.half-r');
        if (hr) hr.style.backgroundImage = `url("${data.rightImg}")`;
      }
    } else if (tplId === 'zoom') {
      const root = fxc.querySelector('.tpl-zoom');
      if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
        window.tplSyncUniversalBgStageLayer(root, data);
      }
      const pt = fxc.querySelector('.zoom-prod-title');
      if (pt) {
        if (data.productName !== undefined) pt.textContent = data.productName;
        if (data.titleFont) pt.style.fontFamily = data.titleFont;
        if (data.titleSize) pt.style.fontSize = `${data.titleSize}px`;
        if (data.titleColor) pt.style.color = data.titleColor;
      }
      const ps = fxc.querySelector('.zoom-prod-sub');
      if (ps) {
        if (data.productSub !== undefined) ps.textContent = data.productSub;
        if (data.subColor) ps.style.color = data.subColor;
      }
      if (data.productImg) {
        const prod = fxc.querySelector('.product');
        if (prod) prod.style.backgroundImage = `url("${data.productImg}")`;
      }
    } else if (tplId === 'interview-cutin') {
      const root = fxc.querySelector('.tpl-interview-cutin');
      if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
        window.tplSyncUniversalBgStageLayer(root, data);
      }
      const bg = fxc.querySelector('.interview-bg-wrap');
      if (bg && data.interviewBg) bg.style.backgroundImage = `url("${data.interviewBg}")`;
      const nameEl = fxc.querySelector('.interview-name');
      if (nameEl && data.subjectName !== undefined) nameEl.textContent = data.subjectName;
      const titleEl = fxc.querySelector('.interview-title');
      if (titleEl && data.subjectTitle !== undefined) titleEl.textContent = data.subjectTitle;
      const metaEl = fxc.querySelector('.interview-meta-text');
      if (metaEl && data.metaTag !== undefined) {
        if (typeof data.metaTag === 'string' && data.metaTag.includes('/')) {
          const parts = data.metaTag.split('/');
          metaEl.innerHTML = `${parts[0].trim()}<span class="interview-meta-divider">/</span>${parts.slice(1).join('/').trim()}`;
        } else {
          metaEl.textContent = data.metaTag;
        }
      }
      const tcEl = fxc.querySelector('.interview-tc-box');
      if (tcEl && data.timecode !== undefined) tcEl.textContent = data.timecode;
      const dotEl = fxc.querySelector('.interview-live-dot');
      if (dotEl && data.accentColor) {
        dotEl.style.background = data.accentColor;
        dotEl.style.boxShadow = `0 0 8px ${data.accentColor}`;
      }
      const slashBars = fxc.querySelectorAll('.interview-slash-bar');
      if (slashBars.length && data.accentColor) {
        slashBars.forEach(b => {
          b.style.background = `linear-gradient(180deg, ${data.accentColor} 0%, #ff2a2a 100%)`;
          b.style.boxShadow = `0 0 6px ${data.accentColor}`;
        });
      }
    } else if (tplId === 'ceo-portrait') {
      const root = fxc.querySelector('.tpl-ceo-portrait');
      if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
        window.tplSyncUniversalBgStageLayer(root, data);
      }
      const img = fxc.querySelector('.ceo-cutout-img');
      if (img && data.cutoutUrl) img.src = data.cutoutUrl;
      const wrap = fxc.querySelector('.ceo-cutout-wrap');
      if (wrap && data.portraitScale !== undefined) {
        const sc = Number(data.portraitScale);
        if (sc !== 1) {
          wrap.style.animation = 'none';
          wrap.style.transform = `scale(${sc})`;
        } else {
          wrap.style.animation = '';
          wrap.style.transform = '';
        }
      }
      const nm = fxc.querySelector('.ceo-name-title');
      if (nm) {
        if (data.ceoName !== undefined) nm.textContent = data.ceoName;
        if (data.fontFamily) nm.style.fontFamily = data.fontFamily;
        if (data.fontSize) nm.style.fontSize = `${data.fontSize}px`;
        if (data.nameColor) nm.style.color = data.nameColor;
      }
      const rl = fxc.querySelector('.ceo-role-sub');
      if (rl && data.ceoRole !== undefined) rl.textContent = data.ceoRole;
      const bg = fxc.querySelector('.ceo-badge-tag');
      if (bg) {
        if (data.ceoBadge !== undefined) bg.textContent = data.ceoBadge;
        if (data.accentColor) bg.style.color = data.accentColor;
      }
      const card = fxc.querySelector('.ceo-info-card');
      if (card && data.accentColor) card.style.borderLeftColor = data.accentColor;
    } else if (tplId === 'power-meeting') {
      const root = fxc.querySelector('.tpl-power-meeting');
      if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
        window.tplSyncUniversalBgStageLayer(root, data);
      }
      const sc = fxc.querySelector('.pm-scene-wrap');
      if (sc && data.meetingBg) sc.style.backgroundImage = `url("${data.meetingBg}")`;
      const spot = fxc.querySelector('.pm-spotlight-cone');
      if (spot && data.spotlightWarmth !== undefined) {
        spot.style.opacity = (data.spotlightWarmth / 100).toString();
      }
      const fog1 = fxc.querySelector('.pm-fog-1');
      const fog2 = fxc.querySelector('.pm-fog-2');
      if (data.fogDensity !== undefined) {
        const fd = data.fogDensity / 100;
        if (fog1) fog1.style.opacity = (0.7 * fd).toString();
        if (fog2) fog2.style.opacity = (0.8 * fd).toString();
      }
      const dof = fxc.querySelector('.pm-dof-overlay');
      if (dof && data.dofIntensity !== undefined) {
        dof.style.opacity = (data.dofIntensity / 100).toString();
      }
      const hl = fxc.querySelector('.pm-headline');
      if (hl) {
        if (data.headline !== undefined) hl.textContent = data.headline;
        if (data.fontFamily) hl.style.fontFamily = data.fontFamily;
        if (data.textColor) hl.style.color = data.textColor;
      }
      const sb = fxc.querySelector('.pm-sub');
      if (sb) {
        if (data.subline !== undefined) sb.textContent = data.subline;
        if (data.accentColor) sb.style.color = data.accentColor;
      }
    } else if (tplId === 'boardroom-zoom') {
      const root = fxc.querySelector('.tpl-boardroom-zoom');
      if (root && typeof window.tplSyncUniversalBgStageLayer === 'function') {
        window.tplSyncUniversalBgStageLayer(root, data);
      }
      const sc = fxc.querySelector('.boardroom-scene-wrap');
      if (sc && data.sceneUrl) sc.style.backgroundImage = `url("${data.sceneUrl}")`;
      const hl = fxc.querySelector('.boardroom-headline');
      if (hl) {
        if (data.headline !== undefined) hl.textContent = data.headline;
        if (data.fontFamily) hl.style.fontFamily = data.fontFamily;
        if (data.textColor) hl.style.color = data.textColor;
      }
      const sb = fxc.querySelector('.boardroom-sub');
      if (sb) {
        if (data.subline !== undefined) sb.textContent = data.subline;
        if (data.accentColor) sb.style.color = data.accentColor;
      }
    } else if (tplId === 'zoom-blur') {
      const bg = fxc.querySelector('#zb-bg-layer') || fxc.querySelector('.zb-bg-scene');
      if (bg && data.sceneUrl) bg.style.backgroundImage = `url("${data.sceneUrl}")`;
      const cut = fxc.querySelector('#zb-cutout-img') || fxc.querySelector('.zb-cutout-img');
      if (cut && data.subjectUrl) cut.src = data.subjectUrl;
      const hl = fxc.querySelector('#zb-headline') || fxc.querySelector('.zb-headline');
      if (hl) {
        if (data.headline !== undefined) hl.textContent = data.headline;
        if (data.textColor) hl.style.color = data.textColor;
      }
      const kic = fxc.querySelector('#zb-kicker') || fxc.querySelector('.zb-kicker');
      if (kic) {
        if (data.kicker !== undefined) kic.textContent = data.kicker;
        if (data.kickerColor) kic.style.color = data.kickerColor;
      }
      const sub = fxc.querySelector('#zb-subline') || fxc.querySelector('.zb-subline');
      if (sub) {
        if (data.subline !== undefined) sub.textContent = data.subline;
        if (data.accentColor) sub.style.color = data.accentColor;
      }
    } else if (tplId === 'security-camera') {
      const root = fxc.querySelector('.tpl-security-camera');
      if (root) {
        if (typeof window.tplSyncUniversalBgStageLayer === 'function') {
          window.tplSyncUniversalBgStageLayer(root, data);
        }
        const mode = data.colorMode || 'night';
        root.className = `tpl-security-camera cctv-mode-${mode}`;
        const scan = root.querySelector('.cctv-scanlines');
        if (data.showScanlines === false && scan) scan.style.display = 'none';
        else if (scan) scan.style.display = '';
        const feedUrl = data.bgMediaUrl || data.feedUrl || '/cctv_surveillance_scene.jpg';
        const isVideo = data.bgMediaType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(feedUrl);
        let feedEl = root.querySelector('.cctv-feed-layer');
        if (data.bgPreset === 'transparent') {
          if (feedEl) feedEl.style.display = 'none';
        } else {
          if (feedEl) feedEl.style.display = '';
          if (isVideo) {
            if (!feedEl || feedEl.tagName !== 'VIDEO') {
              if (feedEl) feedEl.remove();
              const v = document.createElement('video');
              v.className = 'cctv-feed-layer';
              v.src = feedUrl;
              v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
              v.style.objectFit = 'cover';
              root.prepend(v);
            } else if (feedEl.src !== feedUrl) {
              feedEl.src = feedUrl;
            }
          } else {
            if (!feedEl || feedEl.tagName === 'VIDEO') {
              if (feedEl) feedEl.remove();
              const d = document.createElement('div');
              d.className = 'cctv-feed-layer';
              d.style.backgroundImage = `url("${feedUrl}")`;
              root.prepend(d);
            } else {
              feedEl.style.backgroundImage = `url("${feedUrl}")`;
            }
          }
        }
      }
      const cid = fxc.querySelector('.cctv-cam-id'); if (cid && data.camId !== undefined) cid.textContent = data.camId;
      const rl = fxc.querySelector('.cctv-rec-label'); if (rl && data.recText !== undefined) rl.textContent = data.recText;
      const st = fxc.querySelector('.cctv-status-text'); if (st && data.statusText !== undefined) st.textContent = data.statusText;
      const tc = fxc.querySelector('.cctv-timecode'); if (tc && data.timecode !== undefined) tc.textContent = data.timecode;
    } else if (tplId === 'film-grain') {
      const root = fxc.querySelector('.tpl-film-grain');
      if (root) {
        if (typeof window.tplSyncUniversalBgStageLayer === 'function') {
          window.tplSyncUniversalBgStageLayer(root, data);
        }
        const style = data.filmStyle || 'kodak35';
        root.className = `tpl-film-grain film-style-${style}${data.filmFlicker !== false ? ' has-flicker' : ''}${style === 'super8' ? ' has-gate-weave' : ''}`;
        root.style.setProperty('--grain-alpha', ((data.grainIntensity !== undefined ? data.grainIntensity : 65) / 100).toFixed(2));
        root.style.setProperty('--vignette-alpha', ((data.vignetteIntensity !== undefined ? data.vignetteIntensity : 60) / 100).toFixed(2));

        const scan = root.querySelector('.film-scanlines');
        if (scan) scan.style.display = data.showScanlines === false ? 'none' : '';
        const dust = root.querySelector('.film-dust-overlay');
        if (dust) dust.style.display = data.showDust === false ? 'none' : '';
        const scratch = root.querySelector('.film-dust-scratch');
        if (scratch) scratch.style.display = data.showDust === false ? 'none' : '';
        const leak = root.querySelector('.film-light-leak');
        if (leak) leak.style.display = style === 'lightleak' ? '' : 'none';

        const hud = root.querySelector('.film-hud-badge');
        if (hud) hud.style.display = data.showHud === false ? 'none' : 'flex';
        const fps = root.querySelector('.hud-fps');
        if (fps && data.fpsText !== undefined) fps.textContent = data.fpsText;
        const stock = root.querySelector('.hud-stock');
        if (stock && data.stockName !== undefined) stock.textContent = data.stockName;

        const feedUrl = data.bgMediaUrl || data.feedUrl || '/cinematic_footage_loop.mp4';
        const isVideo = data.bgMediaType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(feedUrl);
        let mediaEl = root.querySelector('.film-media-layer');
        if (data.bgPreset === 'transparent') {
          if (mediaEl) mediaEl.style.display = 'none';
        } else {
          if (mediaEl) mediaEl.style.display = '';
          if (isVideo) {
            if (!mediaEl || mediaEl.tagName !== 'VIDEO') {
              if (mediaEl) mediaEl.remove();
              const v = document.createElement('video');
              v.className = 'film-media-layer';
              v.src = feedUrl;
              v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
              root.prepend(v);
            } else if (mediaEl.src !== feedUrl) {
              mediaEl.src = feedUrl;
            }
          } else {
            if (!mediaEl || mediaEl.tagName === 'VIDEO') {
              if (mediaEl) mediaEl.remove();
              const img = document.createElement('img');
              img.className = 'film-media-layer';
              img.src = feedUrl;
              root.prepend(img);
            } else if (mediaEl.src !== feedUrl) {
              mediaEl.src = feedUrl;
            }
          }
        }
      }
    } else if (tplId === 'newspaper-3d') {
      const root = fxc.querySelector('.tpl-newspaper-3d');
      if (root) {
        if (data.cameraPitch !== undefined) root.style.setProperty('--np-camera-pitch', `${data.cameraPitch}deg`);
        if (data.cameraYaw !== undefined) root.style.setProperty('--np-camera-yaw', `${data.cameraYaw}deg`);
        if (data.cameraRoll !== undefined) root.style.setProperty('--np-camera-roll', `${data.cameraRoll}deg`);
        if (data.perspective !== undefined) root.style.setProperty('--np-perspective', `${data.perspective}px`);
        if (data.dofBgBlur !== undefined) {
          root.style.setProperty('--np-dof-bg-blur', `${data.dofBgBlur}px`);
        } else if (data.dofBlur !== undefined) {
          root.style.setProperty('--np-dof-bg-blur', `${Math.round(data.dofBlur * 0.55)}px`);
        }
        if (data.dofFgBlur !== undefined) {
          root.style.setProperty('--np-dof-fg-blur', `${data.dofFgBlur}px`);
        } else if (data.dofBlur !== undefined) {
          root.style.setProperty('--np-dof-fg-blur', `${data.dofBlur}px`);
        }
        if (data.paperBrightness !== undefined) {
          root.style.setProperty('--np-paper-brightness', `${(data.paperBrightness / 100).toFixed(2)}`);
        }
        if (data.inkContrast !== undefined) {
          root.style.setProperty('--np-ink-contrast', `${(data.inkContrast / 100).toFixed(2)}`);
        }
        if (data.highlightDelay !== undefined) {
          root.style.setProperty('--np-hl-delay', `${data.highlightDelay}s`);
        }
        if (data.highlightDuration !== undefined) {
          root.style.setProperty('--np-hl-duration', `${data.highlightDuration}s`);
        }
        if (data.highlightColor !== undefined) {
          root.style.setProperty('--np-hl-color', data.highlightColor);
        }
        if (data.volumetricRays !== undefined || data.rayIntensity !== undefined) {
          const rayOp = data.volumetricRays !== false ? (data.rayIntensity !== undefined ? data.rayIntensity : 0.95) : 0;
          root.style.setProperty('--np-ray-opacity', `${rayOp}`);
        }
        if (data.warmSpotlight !== undefined || data.spotIntensity !== undefined) {
          const spotOp = data.warmSpotlight !== false ? (data.spotIntensity !== undefined ? data.spotIntensity : 1.4) : 0;
          root.style.setProperty('--np-spot-intensity', `${spotOp}`);
        }
        if (data.rimLight !== undefined) {
          root.style.setProperty('--np-rim-glow', data.rimLight !== false ? 'rgba(186, 230, 253, 0.55)' : 'transparent');
        }
        if (data.filmGrain !== undefined || data.filmGrainOpacity !== undefined) {
          const grainOp = data.filmGrain !== false ? (data.filmGrainOpacity !== undefined ? data.filmGrainOpacity : 0.26) : 0;
          root.style.setProperty('--np-grain-opacity', `${grainOp}`);
        }
        if (data.motionBlur !== undefined) root.classList.toggle('has-motion-blur', !!data.motionBlur);
        if (data.organicDrift !== undefined) root.classList.toggle('has-organic-drift', !!data.organicDrift);
        if (data.stylePreset) {
          root.className = `tpl-newspaper-3d theme-${data.stylePreset} ${data.motionBlur !== false ? 'has-motion-blur' : ''} ${data.organicDrift !== false ? 'has-organic-drift' : ''}`;
        }
        
        const mastheadEl = root.querySelector('.tpl-np-masthead');
        if (mastheadEl && data.masthead !== undefined) mastheadEl.textContent = data.masthead;
        const headlineEl = root.querySelector('.tpl-np-headline');
        if (headlineEl && data.headline !== undefined) headlineEl.innerHTML = data.headline.replace(/\n/g, '<br/>');
        const datelineEl = root.querySelector('.tpl-np-dateline');
        if (datelineEl && data.dateline !== undefined) datelineEl.textContent = data.dateline;

        const dogEarWrap = root.querySelector('.tpl-np-dog-ear-wrap');
        if (dogEarWrap) {
          dogEarWrap.style.display = data.showDogEar !== false ? 'block' : 'none';
          if (data.dogEarSize !== undefined) {
            dogEarWrap.style.width = `${data.dogEarSize}px`;
            dogEarWrap.style.height = `${data.dogEarSize}px`;
            const fold = dogEarWrap.querySelector('.tpl-np-dog-ear-fold');
            if (fold) fold.style.borderWidth = `0 ${data.dogEarSize}px ${data.dogEarSize}px 0`;
            const flap = dogEarWrap.querySelector('.tpl-np-dog-ear-flap');
            if (flap) flap.style.borderWidth = `${data.dogEarSize}px 0 0 ${data.dogEarSize}px`;
          }
        }
      }
    } else if (tplId === 'headline-fly') {
      const root = fxc.querySelector('.tpl-headline-fly');
      if (root) {
        if (typeof window.tplSyncUniversalBgStageLayer === 'function') {
          window.tplSyncUniversalBgStageLayer(root, data);
        }
        if (data.tiltAngle !== undefined) root.style.setProperty('--fly-tilt', `${data.tiltAngle}deg`);
        if (data.motionBlur !== undefined) root.classList.toggle('has-motion-blur', !!data.motionBlur);
        if (data.blurIntensity !== undefined) root.style.setProperty('--motion-blur-px', `${data.blurIntensity}px`);
        if (data.dofBokeh !== undefined) root.classList.toggle('has-dof-bokeh', !!data.dofBokeh);
        if (data.dofBlur !== undefined) root.style.setProperty('--dof-blur-px', `${data.dofBlur}px`);
        if (data.specularGlare !== undefined) root.classList.toggle('has-specular-glare', !!data.specularGlare);
        if (data.organicDrift !== undefined) root.classList.toggle('has-organic-drift', !!data.organicDrift);
        if (data.shadowRadius !== undefined) root.style.setProperty('--card-shadow-radius', `${data.shadowRadius}px`);
        if (data.shadowAlpha !== undefined) root.style.setProperty('--card-shadow-alpha', `${data.shadowAlpha}`);
        if (data.flySpeed !== undefined) root.style.setProperty('--fly-speed', `${data.flySpeed}`);
        if (data.staggerDelay !== undefined) root.style.setProperty('--fly-stagger', `${data.staggerDelay}s`);
        if (data.paperGrain !== undefined) root.style.setProperty('--fly-paper-grain', `${(Number(data.paperGrain) / 100).toFixed(2)}`);

        const hudEl = root.querySelector('.fly-hud-telemetry');
        if (hudEl) {
          hudEl.style.display = data.showTelemetry === false ? 'none' : 'flex';
          const hudSpans = hudEl.querySelectorAll('span');
          if (hudSpans[0] && data.hudLeft !== undefined) hudSpans[0].textContent = data.hudLeft;
          if (hudSpans[1]) {
            const rightTxt = data.hudRight !== undefined ? data.hudRight : `CAM PERSPECTIVE: 1200PX // YAW-TILT: ${data.tiltAngle ?? 9.5}\u00b0`;
            hudSpans[1].textContent = rightTxt;
          }
        }

        const formatHeadlineHtml = (text, hlPhrase) => {
          const raw = String(text || '');
          const hl = String(hlPhrase || '').trim();
          const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          if (!hl) return esc(raw);
          const idx = raw.toLowerCase().indexOf(hl.toLowerCase());
          if (idx === -1) return esc(raw);
          const before = raw.slice(0, idx);
          const match = raw.slice(idx, idx + hl.length);
          const after = raw.slice(idx + hl.length);
          return `${esc(before)}<span class="fly-hl-mark">${esc(match)}</span>${esc(after)}`;
        };

        for (let i = 1; i <= 5; i++) {
          const card = root.querySelector(`.fly-card-${i}`);
          if (card) {
            const vis = data[`visible${i}`] !== false;
            card.style.display = vis ? 'block' : 'none';
            card.classList.toggle('is-selected-card', Number(data.activeCardTab || 5) === i);

            const theme = data[`theme${i}`] || 'newsprint';
            const curLayout = data.layoutStyle || 'broadsheet';
            card.className = `fly-card fly-card-${i} theme-${theme} mode-${curLayout}${Number(data.activeCardTab || 5) === i ? ' is-selected-card' : ''}`;
            root.className = `tpl-headline-fly mode-${curLayout} ${data.motionBlur !== false ? 'has-motion-blur' : ''} ${data.dofBokeh !== false ? 'has-dof-bokeh' : ''} ${data.specularGlare !== false ? 'has-specular-glare' : ''} ${data.organicDrift !== false ? 'has-organic-drift' : ''}`;
            if (card.querySelector('.fly-card-kicker')) {
              card.querySelector('.fly-card-kicker').classList.toggle('fly-kicker-editorial', curLayout === 'broadsheet');
            }
            if (card.querySelector('.fly-card-stamp')) {
              card.querySelector('.fly-card-stamp').classList.toggle('fly-stamp-broadsheet', curLayout === 'broadsheet');
            }
            const col1El = card.querySelector('.fly-card-col:nth-child(1)');
            if (col1El && data.bodyCol1 !== undefined) col1El.textContent = data.bodyCol1;
            const col2El = card.querySelector('.fly-card-col:nth-child(2)');
            if (col2El && data.bodyCol2 !== undefined) col2El.textContent = data.bodyCol2;

            if (data[`bgColor${i}`]) card.style.setProperty('--c-bg', data[`bgColor${i}`]);
            if (data[`textColor${i}`]) {
              card.style.setProperty('--c-text', data[`textColor${i}`]);
              const isLight = /^#(f|e|d|c)/i.test(data[`bgColor${i}`] || '');
              card.style.setProperty('--c-sub', isLight ? '#475569' : '#94a3b8');
              card.style.setProperty('--c-rule', isLight ? 'rgba(15,23,42,0.16)' : 'rgba(255,255,255,0.14)');
              card.style.setProperty('--c-border', isLight ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.22)');
            }
            if (data[`accentColor${i}`]) card.style.setProperty('--c-accent', data[`accentColor${i}`]);
            if (data[`hlColor${i}`]) card.style.setProperty('--c-hl', data[`hlColor${i}`]);
            if (data[`font${i}`]) card.style.setProperty('--c-font', data[`font${i}`]);
            if (data[`fontSize${i}`] !== undefined) card.style.setProperty('--c-title-size', `${data[`fontSize${i}`]}px`);
            if (data[`scale${i}`] !== undefined) card.style.setProperty('--c-scale', `${data[`scale${i}`]}`);
            if (data[`rot${i}`] !== undefined) card.style.setProperty('--c-rot', `${data[`rot${i}`]}deg`);
            if (data[`x${i}`] !== undefined) card.style.setProperty('--c-x', `${data[`x${i}`]}px`);
            if (data[`y${i}`] !== undefined) card.style.setProperty('--c-y', `${data[`y${i}`]}px`);

            const s = card.querySelector('.fly-card-source');
            if (s && data[`source${i}`] !== undefined) s.textContent = data[`source${i}`];
            const pIcon = card.querySelector('.fly-card-pub-icon');
            if (pIcon && data[`source${i}`] !== undefined) {
              const cleanInit = String(data[`source${i}`] || 'N').replace(/^THE\s+/i, '').trim().charAt(0).toUpperCase() || 'N';
              pIcon.textContent = cleanInit;
            }
            const k = card.querySelector('.fly-card-kicker');
            if (k && data[`kicker${i}`] !== undefined) {
              k.textContent = data[`kicker${i}`];
              k.style.display = data[`kicker${i}`] ? 'inline-block' : 'none';
            }
            const d = card.querySelector('.fly-card-date');
            if (d && data[`date${i}`] !== undefined) d.textContent = data[`date${i}`];
            const h = card.querySelector('.fly-card-headline');
            if (h && (data[`headline${i}`] !== undefined || data[`highlight${i}`] !== undefined)) {
              h.innerHTML = formatHeadlineHtml(data[`headline${i}`], data[`highlight${i}`]);
            }
            const sub = card.querySelector('.fly-card-subdeck');
            if (sub && data[`subhead${i}`] !== undefined) {
              sub.textContent = data[`subhead${i}`];
              sub.style.display = data[`subhead${i}`] ? '-webkit-box' : 'none';
            }
            const byl = card.querySelector('.fly-card-byline');
            if (byl && data[`byline${i}`] !== undefined) byl.textContent = data[`byline${i}`];
            const stmp = card.querySelector('.fly-card-stamp');
            if (stmp && data[`exhibit${i}`] !== undefined) {
              stmp.textContent = data[`exhibit${i}`];
              stmp.style.display = data[`exhibit${i}`] ? 'inline-block' : 'none';
            }
          }
        }
      }
    } else if (tplId === 'screen-blur') {
      const root = fxc.querySelector('.tpl-screen-blur');
      if (root) {
        if (data.tiltX !== undefined) root.style.setProperty('--tilt-x', `${data.tiltX}deg`);
        if (data.tiltY !== undefined) root.style.setProperty('--tilt-y', `${data.tiltY}deg`);
        if (data.tiltZ !== undefined) root.style.setProperty('--tilt-z', `${data.tiltZ}deg`);
        if (data.magnifierZoom !== undefined) root.style.setProperty('--mag-zoom', `${data.magnifierZoom}`);
        
        const urlEl = root.querySelector('.window-url-text');
        if (urlEl && data.urlBar !== undefined) urlEl.textContent = data.urlBar;

        const titleEl = root.querySelector('.mock-title span:last-child');
        if (titleEl && data.windowTitle !== undefined) titleEl.textContent = data.windowTitle;

        const redactZone = root.querySelector('.screen-redaction-zone');
        if (redactZone) {
          if (data.showRedaction !== undefined) redactZone.style.display = data.showRedaction ? 'flex' : 'none';
          if (data.redactStyle) {
            redactZone.classList.remove('style-classified', 'style-glass', 'style-pixel');
            redactZone.classList.add(`style-${data.redactStyle}`);
          }
          const redactLbl = redactZone.querySelector('.redact-stamp-label span:last-child');
          if (redactLbl && data.redactLabel !== undefined) redactLbl.textContent = data.redactLabel;
        }

        const dofEl = root.querySelector('.screen-dof-overlay');
        const magLens = root.querySelector('.screen-magnifier-lens');
        if (data.showMagnifier !== undefined) {
          if (dofEl) dofEl.style.display = data.showMagnifier ? 'block' : 'none';
          if (magLens) magLens.style.display = data.showMagnifier ? 'block' : 'none';
        }
        if (magLens) {
          const magHdr = magLens.querySelector('.magnifier-header span:first-child');
          if (magHdr && data.magnifierZoom !== undefined) magHdr.textContent = `🔍 ${data.magnifierZoom}X FOCUS LENS`;
          const magLine = magLens.querySelector('.magnifier-focus-line span:last-child');
          if (magLine && data.magnifierTarget !== undefined) magLine.textContent = data.magnifierTarget;
          const magSub = magLens.querySelector('.magnifier-focus-sub');
          if (magSub && data.magnifierSub !== undefined) magSub.textContent = data.magnifierSub;
        }

        const cursorGroup = root.querySelector('.screen-cursor-group');
        if (cursorGroup && data.showCursor !== undefined) cursorGroup.style.display = data.showCursor ? 'block' : 'none';

        const gpuHud = root.querySelector('.screen-gpu-hud');
        if (gpuHud) {
          if (data.showGpuHud !== undefined) gpuHud.style.display = data.showGpuHud ? 'flex' : 'none';
          const gpuTxt = gpuHud.querySelector('.hud-metric-hl');
          if (gpuTxt && data.gpuText !== undefined) gpuTxt.textContent = data.gpuText;
        }

        if (data.screenMediaUrl !== undefined) {
          let customImg = root.querySelector('.screen-custom-media');
          if (data.screenMediaUrl) {
            if (!customImg) {
              const body = root.querySelector('.screen-window-body');
              if (body) {
                customImg = document.createElement('img');
                customImg.className = 'screen-custom-media';
                body.appendChild(customImg);
              }
            }
            if (customImg) customImg.src = data.screenMediaUrl;
            const mockup = root.querySelector('.screen-ui-mockup');
            if (mockup) mockup.style.display = 'none';
          } else {
            if (customImg) customImg.remove();
            const mockup = root.querySelector('.screen-ui-mockup');
            if (mockup) mockup.style.display = 'flex';
          }
        }
      }
    } else if (tplId === 'vhs') {
      const root = fxc.querySelector('.tpl-vhs');
      if (root) {
        const filterMode = data.filter || 'vintage';
        root.classList.remove('vhs-filter-vintage', 'vhs-filter-glitch', 'vhs-filter-bw', 'vhs-filter-clean');
        root.classList.add(`vhs-filter-${filterMode}`);
        const recEl = root.querySelector('.rec');
        if (recEl && data.recMode !== undefined) recEl.textContent = data.recMode;
        const txtEl = root.querySelector('.vhs-text');
        if (txtEl && data.tag !== undefined) txtEl.textContent = data.tag;
        const blEl = root.querySelector('.vhs-hud-bl');
        if (blEl && data.tag !== undefined) blEl.textContent = `SLP  ${data.tag}`;
      }
    }

    // Universal Background Video / Image / Preset Stage Sync across ALL templates
    const anyStageRoot = fxc.firstElementChild;
    if (anyStageRoot && typeof window.tplSyncUniversalBgStageLayer === 'function') {
      window.tplSyncUniversalBgStageLayer(anyStageRoot, data);
    }
  };

  // --- 4. RENDER CONTEXTUAL INSPECTOR MODULES ---
  window.tplRenderContextualInspector = function(tplId) {
    if (tplId === 'hypnotic-vertigo-roll') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (wrapPrim) wrapPrim.style.display = 'block';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';

        if (!topCustomizerState.hypnoticConfig) {
          topCustomizerState.hypnoticConfig = (typeof window.getHypnoticDefaultConfig === 'function')
            ? window.getHypnoticDefaultConfig()
            : { mode: 'pendulum', spinSpeed: 24.0, maxTiltAngle: 18.0, zoomBase: 1.45, zoomBreathing: 0.22, scanlines: true, chromaticAberration: true, hypnoticSpiralWobble: true };
        }
        const cfg = topCustomizerState.hypnoticConfig;

        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; padding-bottom: 20px;">
            <div style="background: rgba(30, 58, 138, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 12px;">
              <div style="font-size: 12px; font-weight: 700; color: #60a5fa; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                <span>🌀</span> HYPNOTIC VERTIGO & DIZZINESS ROLL
              </div>
              <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
                Slow rolling tilt and dolly-zoom breathing cycle producing psychological trance / vertigo tension.
              </div>
            </div>

            <!-- Motion Mode Toggle -->
            <div>
              <label style="font-size: 11px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px; display: block;">Motion Pattern</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" id="hypnotic-mode-pendulum" style="
                  padding: 8px; font-size: 11px; font-weight: 600; border-radius: 6px; cursor: pointer;
                  background: ${cfg.mode === 'pendulum' ? '#2563eb' : '#1e293b'};
                  color: ${cfg.mode === 'pendulum' ? '#ffffff' : '#94a3b8'};
                  border: 1px solid ${cfg.mode === 'pendulum' ? '#60a5fa' : 'rgba(255,255,255,0.1)'};
                ">↔ Left-Right Tilt</button>
                <button type="button" id="hypnotic-mode-continuous" style="
                  padding: 8px; font-size: 11px; font-weight: 600; border-radius: 6px; cursor: pointer;
                  background: ${cfg.mode === 'continuous' ? '#2563eb' : '#1e293b'};
                  color: ${cfg.mode === 'continuous' ? '#ffffff' : '#94a3b8'};
                  border: 1px solid ${cfg.mode === 'continuous' ? '#60a5fa' : 'rgba(255,255,255,0.1)'};
                ">🔄 360° Infinite Roll</button>
              </div>
            </div>

            <!-- Tilt / Spin Speed Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Roll Cycle Duration</span>
                <span id="hypnotic-val-speed" style="color: #60a5fa; font-family: monospace;">${cfg.spinSpeed}s</span>
              </div>
              <input type="range" id="hypnotic-slider-speed" min="6" max="45" step="1" value="${cfg.spinSpeed}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- Tilt Angle (only relevant for pendulum) -->
            <div id="hypnotic-tilt-group" style="display: ${cfg.mode === 'pendulum' ? 'block' : 'none'};">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Max Tilt Angle</span>
                <span id="hypnotic-val-tilt" style="color: #60a5fa; font-family: monospace;">±${cfg.maxTiltAngle}°</span>
              </div>
              <input type="range" id="hypnotic-slider-tilt" min="5" max="45" step="1" value="${cfg.maxTiltAngle}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- Zoom Base Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Deep Zoom Crop</span>
                <span id="hypnotic-val-zoombase" style="color: #60a5fa; font-family: monospace;">${Math.round(cfg.zoomBase * 100)}%</span>
              </div>
              <input type="range" id="hypnotic-slider-zoombase" min="1.0" max="2.5" step="0.05" value="${cfg.zoomBase}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- Zoom Breathing Pulse Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Dolly-Zoom Breathing</span>
                <span id="hypnotic-val-breathing" style="color: #60a5fa; font-family: monospace;">±${Math.round(cfg.zoomBreathing * 100)}%</span>
              </div>
              <input type="range" id="hypnotic-slider-breathing" min="0.0" max="0.5" step="0.02" value="${cfg.zoomBreathing}" style="width: 100%; accent-color: #3b82f6;" />
            </div>

            <!-- FX Toggles -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; cursor: pointer;">
                <span>CRT Scanline Interlacing</span>
                <input type="checkbox" id="hypnotic-chk-scanlines" ${cfg.scanlines ? 'checked' : ''} style="accent-color: #3b82f6;" />
              </label>

              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; cursor: pointer;">
                <span>RGB Chromatic Aberration</span>
                <input type="checkbox" id="hypnotic-chk-chroma" ${cfg.chromaticAberration ? 'checked' : ''} style="accent-color: #3b82f6;" />
              </label>

              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; cursor: pointer;">
                <span>Hypnotic Wobble / Orbital Sway</span>
                <input type="checkbox" id="hypnotic-chk-wobble" ${cfg.hypnoticSpiralWobble ? 'checked' : ''} style="accent-color: #3b82f6;" />
              </label>
            </div>
          </div>
        `;

        // Wire up event listeners
        const btnPendulum = container.querySelector('#hypnotic-mode-pendulum');
        const btnContinuous = container.querySelector('#hypnotic-mode-continuous');
        const tiltGroup = container.querySelector('#hypnotic-tilt-group');

        btnPendulum?.addEventListener('click', () => {
          cfg.mode = 'pendulum';
          if (btnPendulum) { btnPendulum.style.background = '#2563eb'; btnPendulum.style.color = '#fff'; }
          if (btnContinuous) { btnContinuous.style.background = '#1e293b'; btnContinuous.style.color = '#94a3b8'; }
          if (tiltGroup) tiltGroup.style.display = 'block';
        });

        btnContinuous?.addEventListener('click', () => {
          cfg.mode = 'continuous';
          if (btnContinuous) { btnContinuous.style.background = '#2563eb'; btnContinuous.style.color = '#fff'; }
          if (btnPendulum) { btnPendulum.style.background = '#1e293b'; btnPendulum.style.color = '#94a3b8'; }
          if (tiltGroup) tiltGroup.style.display = 'none';
        });

        container.querySelector('#hypnotic-slider-speed')?.addEventListener('input', (e) => {
          cfg.spinSpeed = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-speed');
          if (lbl) lbl.textContent = cfg.spinSpeed + 's';
        });

        container.querySelector('#hypnotic-slider-tilt')?.addEventListener('input', (e) => {
          cfg.maxTiltAngle = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-tilt');
          if (lbl) lbl.textContent = '±' + cfg.maxTiltAngle + '°';
        });

        container.querySelector('#hypnotic-slider-zoombase')?.addEventListener('input', (e) => {
          cfg.zoomBase = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-zoombase');
          if (lbl) lbl.textContent = Math.round(cfg.zoomBase * 100) + '%';
        });

        container.querySelector('#hypnotic-slider-breathing')?.addEventListener('input', (e) => {
          cfg.zoomBreathing = parseFloat(e.target.value);
          const lbl = container.querySelector('#hypnotic-val-breathing');
          if (lbl) lbl.textContent = '±' + Math.round(cfg.zoomBreathing * 100) + '%';
        });

        container.querySelector('#hypnotic-chk-scanlines')?.addEventListener('change', (e) => {
          cfg.scanlines = e.target.checked;
          const scanEl = document.getElementById('hypnotic-crt-scanlines');
          if (scanEl) scanEl.style.opacity = cfg.scanlines ? '0.9' : '0';
        });

        container.querySelector('#hypnotic-chk-chroma')?.addEventListener('change', (e) => {
          cfg.chromaticAberration = e.target.checked;
          const r = document.getElementById('hypnotic-chroma-red');
          const c = document.getElementById('hypnotic-chroma-cyan');
          if (r) r.style.display = cfg.chromaticAberration ? 'block' : 'none';
          if (c) c.style.display = cfg.chromaticAberration ? 'block' : 'none';
        });

        container.querySelector('#hypnotic-chk-wobble')?.addEventListener('change', (e) => {
          cfg.hypnoticSpiralWobble = e.target.checked;
        });
      }
      return;
    }
    if (tplId === 'instagram') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildInstagramInspector === 'function') {
          window.tplBuildInstagramInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'checklist') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildChecklistInspector === 'function') {
          window.tplBuildChecklistInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'conspiracy-board') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildRedStringInspector === 'function') {
          window.tplBuildRedStringInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'envelope-open') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildEnvelopeInspector === 'function') {
          window.tplBuildEnvelopeInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'wire-transfer') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildWireTransferInspector === 'function') {
          window.tplBuildWireTransferInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'money-stack') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildMoneyStackInspector === 'function') {
          window.tplBuildMoneyStackInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'pyramid-scheme') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (stdLayers) stdLayers.style.display = 'none';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildPyramidCollapseInspector === 'function') {
          window.tplBuildPyramidCollapseInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'deal-term-sheet' || tplId === 'newspaper-3d') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section') || document.getElementById('tpl-modal-std-layers');
      const wrapAi = document.getElementById('tpl-modal-wrap-ai-engine') || document.getElementById('tpl-modal-ai-engine');
      const wrapAtmo = document.getElementById('tpl-modal-wrap-atmosphere') || document.getElementById('tpl-modal-atmosphere');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      const tpl3dControls = document.getElementById('tpl-modal-3d-controls');
      if (tpl3dControls) { tpl3dControls.style.display = 'none'; tpl3dControls.innerHTML = ''; }
      if (stdLayers) stdLayers.style.display = 'none';
      if (wrapAi) wrapAi.style.display = 'none';
      if (wrapAtmo) wrapAtmo.style.display = 'none';
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildDealTermSheetInspector === 'function') {
          window.tplBuildDealTermSheetInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'scam-redaction') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      const tpl3dControls = document.getElementById('tpl-modal-3d-controls');
      if (tpl3dControls) { tpl3dControls.style.display = 'none'; tpl3dControls.innerHTML = ''; }
      if (stdLayers) stdLayers.style.display = 'none';
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildFraudDossierInspector === 'function') {
          window.tplBuildFraudDossierInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'jani-cross-section-reveal') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (wrapSec) wrapSec.style.display = 'block';
      if (wrapText) wrapText.style.display = 'none';
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId) || {};
        container.innerHTML = `
          <div style="font-size: 11px; font-weight: 700; color: #f59e0b; letter-spacing: 0.5px; margin-bottom: 6px; text-transform: uppercase;">
            ⚡ James Jani Cross-Section Engine Controls
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Hold Zoom (Start → End)</label>
              <div style="display: flex; gap: 4px;">
                <input type="number" id="inp-cross-startzoom" step="0.02" value="${data.startZoom || 1.1}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
                <input type="number" id="inp-cross-endzoom" step="0.02" value="${data.holdEndZoom || 1.02}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
              </div>
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Anticipation Zoom Punch</label>
              <input type="number" id="inp-cross-anticzoom" step="0.02" value="${data.anticipationZoom || 1.08}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Anticipation Rise (px)</label>
              <input type="number" id="inp-cross-rise" step="2" value="${data.anticipationYOffset || -22}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 2px;">Scroll Duration (sec)</label>
              <input type="number" id="inp-cross-scrolldur" step="0.2" value="${data.scrollDuration || 2.2}" style="width: 100%; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; margin-top: 8px;">
            <label style="font-size: 10px; color: #cbd5e1; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="inp-cross-dust" ${data.dustEnabled !== false ? 'checked' : ''} /> Floating Dust VFX
            </label>
            <div style="flex: 1; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 9px; color: #94a3b8;">Count:</span>
              <input type="range" id="inp-cross-dustcount" min="10" max="100" value="${data.dustParticleCount || 45}" style="flex: 1;" />
            </div>
          </div>
        `;

        const bindCross = (id, key, parser = parseFloat) => {
          const el = document.getElementById(id);
          if (el) {
            el.addEventListener('input', (e) => {
              const val = el.type === 'checkbox' ? el.checked : parser(e.target.value);
              data[key] = val;
              if (typeof window.tplUpdateJaniCrossSection === 'function') {
                window.tplUpdateJaniCrossSection({ [key]: val });
              }
            });
          }
        };

        bindCross('inp-cross-startzoom', 'startZoom');
        bindCross('inp-cross-endzoom', 'holdEndZoom');
        bindCross('inp-cross-anticzoom', 'anticipationZoom');
        bindCross('inp-cross-rise', 'anticipationYOffset');
        bindCross('inp-cross-scrolldur', 'scrollDuration');
        bindCross('inp-cross-dust', 'dustEnabled', v => v);
        bindCross('inp-cross-dustcount', 'dustParticleCount', parseInt);
      }
      return;
    }
    if (tplId === 'jani-ftx-logo-reveal') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      const tpl3dControls = document.getElementById('tpl-modal-3d-controls');
      if (tpl3dControls) { tpl3dControls.style.display = 'none'; tpl3dControls.innerHTML = ''; }
      if (stdLayers) stdLayers.style.display = 'none';
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildJaniFtxLogoInspector === 'function') {
          window.tplBuildJaniFtxLogoInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'jani-forbes-fraud-reveal') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildForbesInspector === 'function') {
          window.tplBuildForbesInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'jani-flash-quad-sequence') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (stdLayers) stdLayers.style.display = 'none';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildJaniFlashQuadInspector === 'function') {
          window.tplBuildJaniFlashQuadInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'adidas-puma-cosmic-earth-suite') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (stdLayers) stdLayers.style.display = 'none';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildAdidasPumaCosmicInspector === 'function') {
          window.tplBuildAdidasPumaCosmicInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'tencent-shadow-giant-multimedia') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (stdLayers) stdLayers.style.display = 'none';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildTencentMultimediaInspector === 'function') {
          window.tplBuildTencentMultimediaInspector(container, data, tplId);
        }
      }
      return;
    }
    if (tplId === 'jani-spin-flash-glitch-reveal') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      if (container) {
        container.style.display = 'flex';
        if (stdLayers) stdLayers.style.display = 'none';
        if (wrapPrim) wrapPrim.style.display = 'none';
        if (wrapSec) wrapSec.style.display = 'none';
        if (wrapText) wrapText.style.display = 'none';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildJaniSpinFlashGlitchInspector === 'function') {
          window.tplBuildJaniSpinFlashGlitchInspector(container, data, tplId);
        }
      }
      return;
    }
        const container = document.getElementById('tpl-modal-dynamic-controls');
    const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
    const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
    const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
    const wrapText = document.getElementById('tpl-modal-wrap-text');
    if (!container) return;

    if (!DEFAULTS[tplId]) {
      container.style.display = 'none';
      container.innerHTML = '';
      if (stdLayers) stdLayers.style.display = 'flex';
      return;
    }

    // Ensure layers are always visible!
    if (stdLayers) stdLayers.style.display = 'flex';
    if (wrapPrim) wrapPrim.style.display = 'flex';
    if (wrapSec) wrapSec.style.display = 'flex';
    if (wrapText) wrapText.style.display = 'none';
    container.style.display = 'flex';

    const data = window.tplGetContextualData(tplId);

    // =========================================================================
    // CASE 1: DEPTH PARALLAX MULTI-LAYER (Image 1)
    // =========================================================================

    // =========================================================================
    // SPECIAL HANDLER: SUBSCRIBE BUTTON CTA (subscribe)
    // =========================================================================
    if (tplId === 'subscribe') {
      const presets = [
        { id: 'tl', label: '↖ Top Left', desc: 'Top Left Corner' },
        { id: 'tr', label: '↗ Top Right', desc: 'Top Right Corner' },
        { id: 'center', label: '⏺ Center (Default)', desc: 'Center Stage' },
        { id: 'bl', label: '↙ Bottom Left', desc: 'Bottom Left Corner' },
        { id: 'br', label: '↘ Bottom Right', desc: 'Bottom Right Corner' }
      ];

      const colorPalettes = [
        { name: 'YouTube Red', hex: '#ef4444' },
        { name: 'Dark Slate', hex: '#27272a' },
        { name: 'Electric Cyan', hex: '#06b6d4' },
        { name: 'Emerald', hex: '#10b981' },
        { name: 'Amber Gold', hex: '#f59e0b' },
        { name: 'Royal Purple', hex: '#8b5cf6' },
        { name: 'Hot Pink', hex: '#ec4899' },
        { name: 'Crimson', hex: '#b91c1c' }
      ];

      const curPreset = data.positionPreset || 'center';
      const curSubs = data.subs || 'Road to 1 million';
      const curCh = (data.channel !== undefined) ? data.channel : 'Magnates Media';
      const curBtnText = data.btnText || 'SUBSCRIBE';
      const curColor = data.btnColor || '#ef4444';
      const curX = typeof data.posX === 'number' ? data.posX : 0;
      const curY = typeof data.posY === 'number' ? data.posY : 0;
      const curScale = typeof data.scale === 'number' ? data.scale : 1.0;
      const isTrans = data.transparentBg !== false;
      const showBell = data.showBell !== false;

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(239,68,68,0.3); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.65);">
          
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:rgba(239,68,68,0.2);color:#ef4444;font-size:12px;font-weight:900;">▶</span>
              <span style="font-size: 11.5px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px;">Subscribe CTA Controls</span>
            </div>
            <span style="font-size: 9px; color: #38bdf8; font-weight: 800; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); padding: 2px 7px; border-radius: 4px;">FOREGROUND LAYER</span>
          </div>

          <!-- Section 1: Placement & Snap Presets -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Position Presets</span>
              <span style="font-size: 8.5px; color: #64748b; font-family: monospace;">${curPreset.toUpperCase()}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
              ${presets.slice(0, 2).map(p => `
                <button type="button" class="sub-preset-btn" data-preset="${p.id}" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; border: 1px solid ${curPreset === p.id ? '#38bdf8' : 'rgba(255,255,255,0.12)'}; background: ${curPreset === p.id ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.04)'}; color: ${curPreset === p.id ? '#38bdf8' : '#cbd5e1'}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s;">
                  ${p.label}
                </button>
              `).join('')}
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 6px;">
              <button type="button" class="sub-preset-btn" data-preset="center" style="padding: 7px 8px; font-size: 10.5px; font-weight: 800; border-radius: 6px; border: 1px solid ${curPreset === 'center' ? '#38bdf8' : 'rgba(56,189,248,0.35)'}; background: ${curPreset === 'center' ? 'rgba(56,189,248,0.25)' : 'rgba(15,23,42,0.6)'}; color: ${curPreset === 'center' ? '#38bdf8' : '#e2e8f0'}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s;">
                ⏺ Center (Default)
              </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
              ${presets.slice(3, 5).map(p => `
                <button type="button" class="sub-preset-btn" data-preset="${p.id}" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; border: 1px solid ${curPreset === p.id ? '#38bdf8' : 'rgba(255,255,255,0.12)'}; background: ${curPreset === p.id ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.04)'}; color: ${curPreset === p.id ? '#38bdf8' : '#cbd5e1'}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s;">
                  ${p.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 2: Degrees of Freedom (Custom Coordinates & Scale) -->
          <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">Degrees of Freedom (Custom Offset)</span>
              <button type="button" id="sub-btn-reset-tf" style="background: none; border: none; color: #94a3b8; font-size: 9px; cursor: pointer; text-decoration: underline;" title="Reset coordinates to default center">↺ Reset</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>X Position</span>
                  <span id="sub-val-x" style="color: #38bdf8; font-family: monospace;">${curX}px</span>
                </div>
                <input type="range" id="sub-slider-x" min="-360" max="360" value="${curX}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Y Position</span>
                  <span id="sub-val-y" style="color: #38bdf8; font-family: monospace;">${curY}px</span>
                </div>
                <input type="range" id="sub-slider-y" min="-200" max="200" value="${curY}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Scale Size</span>
                <span id="sub-val-scale" style="color: #38bdf8; font-family: monospace;">${Math.round(curScale * 100)}%</span>
              </div>
              <input type="range" id="sub-slider-scale" min="40" max="220" value="${Math.round(curScale * 100)}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
            </div>
            <div style="font-size: 8.5px; color: #64748b; font-style: italic; display: flex; align-items: center; gap: 4px;">
              <span>💡</span> <span>Tap directly on preview canvas to drag or corner-resize with selection box.</span>
            </div>
          </div>

          <!-- Section 3: Text & Milestone Content -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Text & Milestone Content</span>
            
            <!-- Milestone / Counter Text -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 9px; font-weight: 700; color: #cbd5e1;">Milestone / Counter Text</span>
                <span style="font-size: 8.5px; color: #a855f7;">Editable Goal</span>
              </div>
              <input type="text" id="sub-inp-subs" value="${curSubs}" placeholder="e.g. Road to 1 million or Road to 1,000 subscribers" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 9px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
              <!-- Quick Milestone Suggestion Chips -->
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px;">
                <button type="button" class="sub-chip-subs" data-val="Road to 1 million" style="font-size: 8px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; padding: 2px 6px; border-radius: 4px; cursor: pointer;">Road to 1M</button>
                <button type="button" class="sub-chip-subs" data-val="Road to 1,000 subscribers" style="font-size: 8px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; padding: 2px 6px; border-radius: 4px; cursor: pointer;">Road to 1,000</button>
                <button type="button" class="sub-chip-subs" data-val="Road to 100K" style="font-size: 8px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; padding: 2px 6px; border-radius: 4px; cursor: pointer;">Road to 100K</button>
                <button type="button" class="sub-chip-subs" data-val="1.42M subscribers" style="font-size: 8px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; padding: 2px 6px; border-radius: 4px; cursor: pointer;">1.42M subs</button>
              </div>
            </div>

            <!-- Channel / Subhead -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #cbd5e1;">Channel Name</span>
                <input type="text" id="sub-inp-channel" value="${curCh}" placeholder="Channel Name" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #cbd5e1;">Button Text</span>
                <input type="text" id="sub-inp-btn-txt" value="${curBtnText}" placeholder="SUBSCRIBE" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
              </div>
            </div>
          </div>

          <!-- Section 4: Button Color & Styling -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Button Color & Accent</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="color" id="sub-inp-col" value="${curColor}" style="width: 22px; height: 20px; border: none; background: transparent; cursor: pointer;" title="Custom Button Color" />
                <span id="sub-val-col" style="font-size: 9px; font-family: monospace; color: #cbd5e1;">${curColor.toUpperCase()}</span>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
              ${colorPalettes.map(c => `
                <button type="button" class="sub-col-preset" data-hex="${c.hex}" title="${c.name}" style="width: 22px; height: 22px; border-radius: 5px; background: ${c.hex}; border: 1px solid ${curColor === c.hex ? '#fff' : 'rgba(255,255,255,0.2)'}; cursor: pointer; box-shadow: ${curColor === c.hex ? '0 0 8px ' + c.hex : 'none'}; transition: transform 0.15s;"></button>
              `).join('')}
            </div>
            <!-- Bell Notification Toggle -->
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; margin-top: 4px;">
              <input type="checkbox" id="sub-chk-bell" ${showBell ? 'checked' : ''} style="accent-color: #ef4444;" />
              <span style="font-size: 10px; color: #cbd5e1; font-weight: 600;">Show Animated Notification Bell</span>
            </label>
          </div>

          <!-- Section 5: Layer Compositing & Video Overlay -->
          <div style="display: flex; flex-direction: column; gap: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Layer & Backdrop Compositing</span>
              <span style="font-size: 8.5px; color: #22c55e; font-weight: 700;">VIDEO READY</span>
            </div>
            <!-- Transparent Background Checkbox -->
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); padding: 6px 8px; border-radius: 6px;">
              <input type="checkbox" id="sub-chk-trans" ${isTrans ? 'checked' : ''} style="accent-color: #22c55e;" />
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 10px; color: #f8fafc; font-weight: 700;">Transparent Foreground Overlay</span>
                <span style="font-size: 8.5px; color: #94a3b8;">Place directly on top of video clips or B-roll with zero background blackness</span>
              </div>
            </label>

            <!-- Universal Backdrop & Custom Video Upload -->
            ${window.tplBuildUniversalBgHtml ? window.tplBuildUniversalBgHtml(data) : ''}
          </div>

        </div>
      `;

      // --- EVENT HANDLERS ---
      // 1. Preset buttons
      container.querySelectorAll('.sub-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.dataset.preset;
          if (typeof window.tplApplySubscribePreset === 'function') {
            window.tplApplySubscribePreset(pid);
          } else {
            let px = 0, py = 0;
            if (pid === 'tl') { px = -210; py = -120; }
            else if (pid === 'tr') { px = 210; py = -120; }
            else if (pid === 'bl') { px = -210; py = 115; }
            else if (pid === 'br') { px = 210; py = 115; }
            window.tplSetContextualData('subscribe', { posX: px, posY: py, positionPreset: pid });
            window.tplApplyContextualDataToPreview('subscribe');
          }
          window.tplRenderContextualInspector('subscribe');
        });
      });

      // 2. Custom X, Y, Scale Sliders
      const sliderX = container.querySelector('#sub-slider-x');
      const valX = container.querySelector('#sub-val-x');
      sliderX?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valX) valX.textContent = `${val}px`;
        if (topCustomizerState && topCustomizerState.transforms && topCustomizerState.transforms.fg) {
          topCustomizerState.transforms.fg.x = val;
        }
        window.tplSetContextualData('subscribe', { posX: val, positionPreset: 'custom' });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      const sliderY = container.querySelector('#sub-slider-y');
      const valY = container.querySelector('#sub-val-y');
      sliderY?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valY) valY.textContent = `${val}px`;
        if (topCustomizerState && topCustomizerState.transforms && topCustomizerState.transforms.fg) {
          topCustomizerState.transforms.fg.y = val;
        }
        window.tplSetContextualData('subscribe', { posY: val, positionPreset: 'custom' });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      const sliderScale = container.querySelector('#sub-slider-scale');
      const valScale = container.querySelector('#sub-val-scale');
      sliderScale?.addEventListener('input', (e) => {
        const sc = Number((parseInt(e.target.value, 10) / 100).toFixed(2));
        if (valScale) valScale.textContent = `${Math.round(sc * 100)}%`;
        if (topCustomizerState && topCustomizerState.transforms && topCustomizerState.transforms.fg) {
          topCustomizerState.transforms.fg.scale = sc;
        }
        window.tplSetContextualData('subscribe', { scale: sc });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      // Reset transform button
      container.querySelector('#sub-btn-reset-tf')?.addEventListener('click', () => {
        if (typeof window.tplApplySubscribePreset === 'function') {
          window.tplApplySubscribePreset('center');
        }
        window.tplSetContextualData('subscribe', { posX: 0, posY: 0, scale: 1.0, positionPreset: 'center' });
        window.tplApplyContextualDataToPreview('subscribe');
        window.tplRenderContextualInspector('subscribe');
      });

      // 3. Text inputs
      const inpSubs = container.querySelector('#sub-inp-subs');
      inpSubs?.addEventListener('input', (e) => {
        window.tplSetContextualData('subscribe', { subs: e.target.value });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      // Quick Chips
      container.querySelectorAll('.sub-chip-subs').forEach(ch => {
        ch.addEventListener('click', () => {
          const v = ch.dataset.val;
          if (inpSubs) inpSubs.value = v;
          window.tplSetContextualData('subscribe', { subs: v });
          window.tplApplyContextualDataToPreview('subscribe');
        });
      });

      container.querySelector('#sub-inp-channel')?.addEventListener('input', (e) => {
        window.tplSetContextualData('subscribe', { channel: e.target.value });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      container.querySelector('#sub-inp-btn-txt')?.addEventListener('input', (e) => {
        window.tplSetContextualData('subscribe', { btnText: e.target.value });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      // 4. Color pickers & palettes
      const inpCol = container.querySelector('#sub-inp-col');
      const valCol = container.querySelector('#sub-val-col');
      inpCol?.addEventListener('input', (e) => {
        const hex = e.target.value;
        if (valCol) valCol.textContent = hex.toUpperCase();
        window.tplSetContextualData('subscribe', { btnColor: hex });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      container.querySelectorAll('.sub-col-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const hex = btn.dataset.hex;
          if (inpCol) inpCol.value = hex;
          if (valCol) valCol.textContent = hex.toUpperCase();
          window.tplSetContextualData('subscribe', { btnColor: hex });
          window.tplApplyContextualDataToPreview('subscribe');
          window.tplRenderContextualInspector('subscribe');
        });
      });

      // 5. Bell toggle
      container.querySelector('#sub-chk-bell')?.addEventListener('change', (e) => {
        window.tplSetContextualData('subscribe', { showBell: e.target.checked });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      // 6. Transparent background toggle
      container.querySelector('#sub-chk-trans')?.addEventListener('change', (e) => {
        window.tplSetContextualData('subscribe', { transparentBg: e.target.checked });
        window.tplApplyContextualDataToPreview('subscribe');
      });

      // Wire universal background controls (for video/img underneath)
      if (typeof window.tplWireUniversalBgControls === 'function') {
        window.tplWireUniversalBgControls('subscribe', container);
      }

      // Sync function called when dragged/scaled directly on stage
      window.tplSyncSubscribeInspectorUI = function() {
        const liveData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('subscribe') : {};
        const sx = document.getElementById('sub-slider-x');
        const vx = document.getElementById('sub-val-x');
        if (sx && typeof liveData.posX === 'number') { sx.value = liveData.posX; }
        if (vx && typeof liveData.posX === 'number') { vx.textContent = `${liveData.posX}px`; }

        const sy = document.getElementById('sub-slider-y');
        const vy = document.getElementById('sub-val-y');
        if (sy && typeof liveData.posY === 'number') { sy.value = liveData.posY; }
        if (vy && typeof liveData.posY === 'number') { vy.textContent = `${liveData.posY}px`; }

        const ss = document.getElementById('sub-slider-scale');
        const vs = document.getElementById('sub-val-scale');
        if (ss && typeof liveData.scale === 'number') { ss.value = Math.round(liveData.scale * 100); }
        if (vs && typeof liveData.scale === 'number') { vs.textContent = `${Math.round(liveData.scale * 100)}%`; }
      };

      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: RECEIPT / INVOICE OVERLAY & OBJECT (receipt)
    // =========================================================================
    if (tplId === 'receipt') {
      const isOverlay = data.isOverlay !== false; // Default: true (overlay)
      const isTrans = data.transparentBg !== false && isOverlay;
      const curPreset = data.positionPreset || 'center';
      const curStore = data.store || 'WHOLE FOODS MARKET';
      const curAuth = data.authCode || 'TERM #0491 \u00b7 AUTH VERIFIED';
      const curTotal = data.total || '$34.28';
      const curItems = Array.isArray(data.items) && data.items.length ? data.items : [
        { name: 'Organic Almond Milk', price: '$4.99' },
        { name: 'Avocado 4-Pack', price: '$6.49' },
        { name: 'Grass-Fed Ribeye', price: '$22.80' }
      ];
      const curX = typeof data.posX === 'number' ? data.posX : 0;
      const curY = typeof data.posY === 'number' ? data.posY : 0;
      const curScale = typeof data.scale === 'number' ? data.scale : 1.0;
      const curRot = typeof data.rotation === 'number' ? data.rotation : 0;
      const curTheme = data.receiptTheme || 'classic';

      const presets = [
        { id: 'tl', label: '\u2196 Top Left', desc: 'Top Left Corner' },
        { id: 'tr', label: '\u2197 Top Right', desc: 'Top Right Corner' },
        { id: 'center', label: '\u23fa Center (Default)', desc: 'Center Stage' },
        { id: 'bl', label: '\u2199 Bottom Left', desc: 'Bottom Left Corner' },
        { id: 'br', label: '\u2198 Bottom Right', desc: 'Bottom Right Corner' }
      ];

      const quickReceiptTemplates = [
        {
          id: 'grocery',
          label: '\ud83d\uded2 Whole Foods ($34.28)',
          store: 'WHOLE FOODS MARKET',
          auth: 'TERM #0491 \u00b7 AUTH VERIFIED',
          theme: 'classic',
          total: '$34.28',
          items: [
            { name: 'Organic Almond Milk', price: '$4.99' },
            { name: 'Avocado 4-Pack', price: '$6.49' },
            { name: 'Grass-Fed Ribeye', price: '$22.80' }
          ]
        },
        {
          id: 'apple',
          label: '\ud83d\udcbb Apple Store ($1,299)',
          store: 'APPLE FIFTH AVENUE',
          auth: 'ORD #8921 \u00b7 INVOICE PAID',
          theme: 'dark',
          total: '$1,299.00',
          items: [
            { name: 'MacBook Air M3 16GB', price: '$1,099.00' },
            { name: 'AppleCare+ 3-Year Plan', price: '$149.00' },
            { name: 'USB-C Dual 35W Adapter', price: '$51.00' }
          ]
        },
        {
          id: 'cafe',
          label: '\u2615 Starbucks ($14.75)',
          store: 'STARBUCKS RESERVE',
          auth: 'STORE #204 \u00b7 REGISTER 02',
          theme: 'thermal',
          total: '$14.75',
          items: [
            { name: 'Iced Brown Sugar Oat', price: '$6.25' },
            { name: 'Nitro Cold Brew Cream', price: '$5.50' },
            { name: 'Butter Croissant Warmed', price: '$3.00' }
          ]
        },
        {
          id: 'luxury',
          label: '\ud83d\udecd\ufe0f Gucci Luxury ($2,850)',
          store: 'GUCCI BEVERLY HILLS',
          auth: 'VIP CLIENT ID #00482',
          theme: 'luxury',
          total: '$2,850.00',
          items: [
            { name: 'GG Marmont Matelass\u00e9 Bag', price: '$2,450.00' },
            { name: 'Silk Monogram Scarf', price: '$400.00' }
          ]
        },
        {
          id: 'flight',
          label: '\u2708\ufe0f Emirates Airline ($840)',
          store: 'EMIRATES AIRLINE',
          auth: 'TKT #176-928401 \u00b7 CONFIRMED',
          theme: 'kraft',
          total: '$840.00',
          items: [
            { name: 'JFK \u2192 DXB Economy Flex', price: '$720.00' },
            { name: 'Extra Legroom Row 18', price: '$70.00' },
            { name: 'Onboard High-Speed WiFi', price: '$50.00' }
          ]
        }
      ];

      const paperThemes = [
        { id: 'classic', label: 'Classic White', border: '#cbd5e1' },
        { id: 'thermal', label: 'Thermal Yellow', border: '#fef08a' },
        { id: 'dark', label: 'Dark Obsidian', border: '#38bdf8' },
        { id: 'kraft', label: 'Kraft Brown', border: '#d97706' },
        { id: 'luxury', label: 'Gold Luxury', border: '#f59e0b' }
      ];

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(56,189,248,0.35); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.65);">
          
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:rgba(56,189,248,0.2);color:#38bdf8;font-size:12px;font-weight:900;">\ud83e\uddfe</span>
              <span style="font-size: 11.5px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px;">Receipt / Invoice Controls</span>
            </div>
            <span style="font-size: 9px; color: ${isOverlay ? '#38bdf8' : '#a855f7'}; font-weight: 800; background: ${isOverlay ? 'rgba(56,189,248,0.15)' : 'rgba(168,85,247,0.15)'}; border: 1px solid ${isOverlay ? 'rgba(56,189,248,0.3)' : 'rgba(168,85,247,0.3)'}; padding: 2px 7px; border-radius: 4px;">${isOverlay ? 'OVERLAY MODE (DEFAULT)' : 'STANDALONE OBJECT'}</span>
          </div>

          <!-- Section 1: Behavior Switcher (Overlay vs Standalone Object) -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Behavior & Display Mode</span>
              <span style="font-size: 8.5px; color: ${isOverlay ? '#38bdf8' : '#a855f7'}; font-weight: 700;">${isOverlay ? '\u2605 DEFAULT OVERLAY' : 'STUDIO OBJECT'}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button type="button" id="rcpt-btn-mode-overlay" style="padding: 8px 10px; font-size: 10px; font-weight: 700; border-radius: 8px; border: 1.5px solid ${isOverlay ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${isOverlay ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${isOverlay ? '#fff' : '#94a3b8'}; cursor: pointer; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; transition: all 0.15s; text-align: left;">
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span style="color: #38bdf8; font-size: 11px;">\u2728</span>
                  <span style="font-weight: 800; color: ${isOverlay ? '#38bdf8' : '#e2e8f0'};">Video Overlay</span>
                </div>
                <span style="font-size: 8px; color: #94a3b8; line-height: 1.2;">Transparent floating sticker on video B-roll / clips</span>
              </button>
              <button type="button" id="rcpt-btn-mode-object" style="padding: 8px 10px; font-size: 10px; font-weight: 700; border-radius: 8px; border: 1.5px solid ${!isOverlay ? '#a855f7' : 'rgba(255,255,255,0.1)'}; background: ${!isOverlay ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${!isOverlay ? '#fff' : '#94a3b8'}; cursor: pointer; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; transition: all 0.15s; text-align: left;">
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span style="color: #a855f7; font-size: 11px;">\ud83d\udce6</span>
                  <span style="font-weight: 800; color: ${!isOverlay ? '#c084fc' : '#e2e8f0'};">Scene Object</span>
                </div>
                <span style="font-size: 8px; color: #94a3b8; line-height: 1.2;">Centered item on dark studio desk backdrop</span>
              </button>
            </div>
          </div>

          <!-- Section 2: Placement & Snap Presets -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Position Presets</span>
              <span style="font-size: 8.5px; color: #64748b; font-family: monospace;">${curPreset.toUpperCase()}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
              ${presets.slice(0, 2).map(p => `
                <button type="button" class="rcpt-preset-btn" data-preset="${p.id}" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; border: 1px solid ${curPreset === p.id ? '#38bdf8' : 'rgba(255,255,255,0.12)'}; background: ${curPreset === p.id ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.04)'}; color: ${curPreset === p.id ? '#38bdf8' : '#cbd5e1'}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s;">
                  ${p.label}
                </button>
              `).join('')}
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 6px;">
              <button type="button" class="rcpt-preset-btn" data-preset="center" style="padding: 7px 8px; font-size: 10.5px; font-weight: 800; border-radius: 6px; border: 1px solid ${curPreset === 'center' ? '#38bdf8' : 'rgba(56,189,248,0.35)'}; background: ${curPreset === 'center' ? 'rgba(56,189,248,0.25)' : 'rgba(15,23,42,0.6)'}; color: ${curPreset === 'center' ? '#38bdf8' : '#e2e8f0'}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s;">
                \u23fa Center (Default)
              </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
              ${presets.slice(3, 5).map(p => `
                <button type="button" class="rcpt-preset-btn" data-preset="${p.id}" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; border: 1px solid ${curPreset === p.id ? '#38bdf8' : 'rgba(255,255,255,0.12)'}; background: ${curPreset === p.id ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.04)'}; color: ${curPreset === p.id ? '#38bdf8' : '#cbd5e1'}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s;">
                  ${p.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 3: Fine-Tuning Sliders (X, Y, Scale, Rotation) -->
          <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.3); padding: 9px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">Direct Transform Sliders</span>
              <button type="button" id="rcpt-btn-reset-tf" style="font-size: 8px; font-weight: 700; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #94a3b8; padding: 2px 7px; border-radius: 4px; cursor: pointer;">Reset Position</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>X Position</span>
                  <span id="rcpt-val-x" style="color: #38bdf8; font-family: monospace;">${curX}px</span>
                </div>
                <input type="range" id="rcpt-slider-x" min="-360" max="360" value="${curX}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Y Position</span>
                  <span id="rcpt-val-y" style="color: #38bdf8; font-family: monospace;">${curY}px</span>
                </div>
                <input type="range" id="rcpt-slider-y" min="-200" max="200" value="${curY}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Scale Size</span>
                  <span id="rcpt-val-scale" style="color: #38bdf8; font-family: monospace;">${Math.round(curScale * 100)}%</span>
                </div>
                <input type="range" id="rcpt-slider-scale" min="40" max="220" value="${Math.round(curScale * 100)}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Paper Tilt Angle</span>
                  <span id="rcpt-val-rot" style="color: #38bdf8; font-family: monospace;">${curRot}\u00b0</span>
                </div>
                <input type="range" id="rcpt-slider-rot" min="-25" max="25" value="${curRot}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
            </div>

            <div style="font-size: 8.5px; color: #64748b; font-style: italic; display: flex; align-items: center; gap: 4px;">
              <span>\ud83d\udca1</span> <span>Tap directly on preview canvas to drag or corner-resize with selection box.</span>
            </div>
          </div>

          <!-- Section 4: Quick Story Presets Chips -->
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Quick Preset Templates</span>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${quickReceiptTemplates.map(t => `
                <button type="button" class="rcpt-quick-preset-btn" data-qid="${t.id}" style="font-size: 8.5px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; padding: 3px 7px; border-radius: 5px; cursor: pointer; transition: all 0.15s;">
                  ${t.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 5: Receipt Content Editor -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Receipt / Invoice Content</span>
            
            <!-- Store Name & Header -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #cbd5e1;">Store / Brand Name</span>
                <input type="text" id="rcpt-inp-store" value="${curStore}" placeholder="Store name" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #cbd5e1;">Auth / Subtitle</span>
                <input type="text" id="rcpt-inp-auth" value="${curAuth}" placeholder="Auth info" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
              </div>
            </div>

            <!-- Receipt Line Items -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 9px; font-weight: 700; color: #cbd5e1;">Itemized Expense Lines</span>
                <button type="button" id="rcpt-btn-add-item" style="font-size: 9px; font-weight: 700; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); color: #38bdf8; padding: 2px 8px; border-radius: 4px; cursor: pointer;">+ Add Item</button>
              </div>
              <div id="rcpt-items-list" style="display: flex; flex-direction: column; gap: 5px; max-height: 180px; overflow-y: auto; padding-right: 2px;">
                ${curItems.map((it, idx) => `
                  <div class="rcpt-item-row" data-idx="${idx}" style="display: grid; grid-template-columns: 1fr 75px 24px; gap: 5px; align-items: center;">
                    <input type="text" class="rcpt-inp-item-name" data-idx="${idx}" value="${it.name || ''}" placeholder="Item name" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 4px 7px; color: #fff; font-size: 10px; outline: none;" />
                    <input type="text" class="rcpt-inp-item-price" data-idx="${idx}" value="${it.price || ''}" placeholder="$0.00" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 4px 7px; color: #38bdf8; font-size: 10px; font-family: monospace; outline: none; text-align: right;" />
                    <button type="button" class="rcpt-btn-del-item" data-idx="${idx}" title="Remove Item" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; border-radius: 4px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px;">\u2715</button>
                  </div>
                `).join('')}
              </div>
              
              <!-- Total USD Row -->
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; margin-top: 2px;">
                <span style="font-size: 9.5px; font-weight: 800; color: #f8fafc; text-transform: uppercase;">Total USD</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button type="button" id="rcpt-btn-auto-sum" style="font-size: 8px; font-weight: 700; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; padding: 2px 5px; border-radius: 3px; cursor: pointer;" title="Auto-sum items">\u2211 Auto-Sum</button>
                  <input type="text" id="rcpt-inp-total" value="${curTotal}" style="width: 80px; background: transparent; border: none; color: #22c55e; font-size: 12px; font-weight: 800; font-family: monospace; text-align: right; outline: none;" />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 6: Paper Theme & Material -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Paper Theme & Texture</span>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
              ${paperThemes.map(th => `
                <button type="button" class="rcpt-theme-btn" data-theme="${th.id}" style="padding: 5px 7px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: 1.5px solid ${curTheme === th.id ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${curTheme === th.id ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${curTheme === th.id ? '#fff' : '#94a3b8'}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s;">
                  ${th.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 7: Layer Compositing & Video Overlay -->
          <div style="display: flex; flex-direction: column; gap: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Layer &amp; Backdrop Compositing</span>
              <span style="font-size: 8.5px; color: #22c55e; font-weight: 700;">VIDEO READY</span>
            </div>
            <!-- Transparent Background Checkbox -->
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); padding: 6px 8px; border-radius: 6px;">
              <input type="checkbox" id="rcpt-chk-trans" ${isTrans ? 'checked' : ''} style="accent-color: #22c55e;" />
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 10px; color: #f8fafc; font-weight: 700;">Transparent Foreground Overlay</span>
                <span style="font-size: 8.5px; color: #94a3b8;">Place directly on top of video clips or B-roll with zero background blackness</span>
              </div>
            </label>

            <!-- Universal Backdrop & Custom Video Upload -->
            ${window.tplBuildUniversalBgHtml ? window.tplBuildUniversalBgHtml(data) : ''}
          </div>

        </div>
      `;

      // --- EVENT HANDLERS ---
      // Mode Switchers (Overlay vs Object)
      container.querySelector('#rcpt-btn-mode-overlay')?.addEventListener('click', () => {
        window.tplSetContextualData('receipt', { isOverlay: true, transparentBg: true });
        window.tplApplyContextualDataToPreview('receipt');
        window.tplRenderContextualInspector('receipt');
      });

      container.querySelector('#rcpt-btn-mode-object')?.addEventListener('click', () => {
        window.tplSetContextualData('receipt', { isOverlay: false, transparentBg: false, positionPreset: 'center' });
        if (typeof window.tplApplyReceiptPreset === 'function') {
          window.tplApplyReceiptPreset('center');
        }
        window.tplApplyContextualDataToPreview('receipt');
        window.tplRenderContextualInspector('receipt');
      });

      // Preset buttons
      container.querySelectorAll('.rcpt-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.dataset.preset;
          if (typeof window.tplApplyReceiptPreset === 'function') {
            window.tplApplyReceiptPreset(pid);
          } else {
            let px = 0, py = 0;
            if (pid === 'tl') { px = -200; py = -100; }
            else if (pid === 'tr') { px = 200; py = -100; }
            else if (pid === 'bl') { px = -200; py = 90; }
            else if (pid === 'br') { px = 200; py = 90; }
            window.tplSetContextualData('receipt', { posX: px, posY: py, positionPreset: pid });
            window.tplApplyContextualDataToPreview('receipt');
          }
          window.tplRenderContextualInspector('receipt');
        });
      });

      // Sliders
      const sliderX = container.querySelector('#rcpt-slider-x');
      const valX = container.querySelector('#rcpt-val-x');
      sliderX?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valX) valX.textContent = `${val}px`;
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState.transforms && topCustomizerState.transforms.fg) {
          topCustomizerState.transforms.fg.x = val;
        }
        window.tplSetContextualData('receipt', { posX: val, positionPreset: 'custom' });
        window.tplApplyContextualDataToPreview('receipt');
      });

      const sliderY = container.querySelector('#rcpt-slider-y');
      const valY = container.querySelector('#rcpt-val-y');
      sliderY?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (valY) valY.textContent = `${val}px`;
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState.transforms && topCustomizerState.transforms.fg) {
          topCustomizerState.transforms.fg.y = val;
        }
        window.tplSetContextualData('receipt', { posY: val, positionPreset: 'custom' });
        window.tplApplyContextualDataToPreview('receipt');
      });

      const sliderScale = container.querySelector('#rcpt-slider-scale');
      const valScale = container.querySelector('#rcpt-val-scale');
      sliderScale?.addEventListener('input', (e) => {
        const sc = Number((parseInt(e.target.value, 10) / 100).toFixed(2));
        if (valScale) valScale.textContent = `${Math.round(sc * 100)}%`;
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState.transforms && topCustomizerState.transforms.fg) {
          topCustomizerState.transforms.fg.scale = sc;
        }
        window.tplSetContextualData('receipt', { scale: sc });
        window.tplApplyContextualDataToPreview('receipt');
      });

      const sliderRot = container.querySelector('#rcpt-slider-rot');
      const valRot = container.querySelector('#rcpt-val-rot');
      sliderRot?.addEventListener('input', (e) => {
        const rot = parseInt(e.target.value, 10);
        if (valRot) valRot.textContent = `${rot}\u00b0`;
        window.tplSetContextualData('receipt', { rotation: rot });
        window.tplApplyContextualDataToPreview('receipt');
      });

      // Reset transform
      container.querySelector('#rcpt-btn-reset-tf')?.addEventListener('click', () => {
        if (typeof window.tplApplyReceiptPreset === 'function') {
          window.tplApplyReceiptPreset('center');
        }
        window.tplSetContextualData('receipt', { posX: 0, posY: 0, scale: 1.0, rotation: 0, positionPreset: 'center' });
        window.tplApplyContextualDataToPreview('receipt');
        window.tplRenderContextualInspector('receipt');
      });

      // Quick template presets
      container.querySelectorAll('.rcpt-quick-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const qid = btn.dataset.qid;
          const matched = quickReceiptTemplates.find(t => t.id === qid);
          if (matched) {
            window.tplSetContextualData('receipt', {
              store: matched.store,
              authCode: matched.auth,
              receiptTheme: matched.theme,
              total: matched.total,
              items: JSON.parse(JSON.stringify(matched.items))
            });
            window.tplApplyContextualDataToPreview('receipt');
            window.tplRenderContextualInspector('receipt');
          }
        });
      });

      // Store & Auth inputs
      container.querySelector('#rcpt-inp-store')?.addEventListener('input', (e) => {
        window.tplSetContextualData('receipt', { store: e.target.value });
        window.tplApplyContextualDataToPreview('receipt');
      });

      container.querySelector('#rcpt-inp-auth')?.addEventListener('input', (e) => {
        window.tplSetContextualData('receipt', { authCode: e.target.value });
        window.tplApplyContextualDataToPreview('receipt');
      });

      // Line items input binding
      const bindItemEvents = () => {
        container.querySelectorAll('.rcpt-inp-item-name').forEach(inp => {
          inp.oninput = (e) => {
            const idx = parseInt(inp.dataset.idx, 10);
            const live = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('receipt') : {};
            const items = [...(live.items || curItems)];
            if (items[idx]) {
              items[idx].name = e.target.value;
              window.tplSetContextualData('receipt', { items });
              window.tplApplyContextualDataToPreview('receipt');
            }
          };
        });

        container.querySelectorAll('.rcpt-inp-item-price').forEach(inp => {
          inp.oninput = (e) => {
            const idx = parseInt(inp.dataset.idx, 10);
            const live = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('receipt') : {};
            const items = [...(live.items || curItems)];
            if (items[idx]) {
              items[idx].price = e.target.value;
              window.tplSetContextualData('receipt', { items });
              window.tplApplyContextualDataToPreview('receipt');
            }
          };
        });

        container.querySelectorAll('.rcpt-btn-del-item').forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx, 10);
            const live = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('receipt') : {};
            const items = [...(live.items || curItems)];
            if (items.length > 1) {
              items.splice(idx, 1);
              window.tplSetContextualData('receipt', { items });
              window.tplApplyContextualDataToPreview('receipt');
              window.tplRenderContextualInspector('receipt');
            }
          };
        });
      };
      bindItemEvents();

      // Add item button
      container.querySelector('#rcpt-btn-add-item')?.addEventListener('click', () => {
        const live = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('receipt') : {};
        const items = [...(live.items || curItems)];
        items.push({ name: 'New Line Item', price: '$9.99' });
        window.tplSetContextualData('receipt', { items });
        window.tplApplyContextualDataToPreview('receipt');
        window.tplRenderContextualInspector('receipt');
      });

      // Total input & Auto-sum
      const inpTotal = container.querySelector('#rcpt-inp-total');
      inpTotal?.addEventListener('input', (e) => {
        window.tplSetContextualData('receipt', { total: e.target.value });
        window.tplApplyContextualDataToPreview('receipt');
      });

      container.querySelector('#rcpt-btn-auto-sum')?.addEventListener('click', () => {
        const live = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('receipt') : {};
        const items = live.items || curItems;
        let sum = 0;
        items.forEach(it => {
          const num = parseFloat(String(it.price || '').replace(/[^0-9.]/g, ''));
          if (!isNaN(num)) sum += num;
        });
        const formatted = '$' + sum.toFixed(2);
        if (inpTotal) inpTotal.value = formatted;
        window.tplSetContextualData('receipt', { total: formatted });
        window.tplApplyContextualDataToPreview('receipt');
      });

      // Paper Themes
      container.querySelectorAll('.rcpt-theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const th = btn.dataset.theme;
          window.tplSetContextualData('receipt', { receiptTheme: th });
          window.tplApplyContextualDataToPreview('receipt');
          window.tplRenderContextualInspector('receipt');
        });
      });

      // Transparent Background Toggle
      container.querySelector('#rcpt-chk-trans')?.addEventListener('change', (e) => {
        window.tplSetContextualData('receipt', { transparentBg: e.target.checked });
        window.tplApplyContextualDataToPreview('receipt');
      });

      // Wire universal background controls (for video/img underneath)
      if (typeof window.tplWireUniversalBgControls === 'function') {
        window.tplWireUniversalBgControls('receipt', container);
      }

      // Sync function called when dragged/scaled directly on stage
      window.tplSyncReceiptInspectorUI = function() {
        const liveData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('receipt') : {};
        const sx = document.getElementById('rcpt-slider-x');
        const vx = document.getElementById('rcpt-val-x');
        if (sx && typeof liveData.posX === 'number') { sx.value = liveData.posX; }
        if (vx && typeof liveData.posX === 'number') { vx.textContent = `${liveData.posX}px`; }

        const sy = document.getElementById('rcpt-slider-y');
        const vy = document.getElementById('rcpt-val-y');
        if (sy && typeof liveData.posY === 'number') { sy.value = liveData.posY; }
        if (vy && typeof liveData.posY === 'number') { vy.textContent = `${liveData.posY}px`; }

        const ss = document.getElementById('rcpt-slider-scale');
        const vs = document.getElementById('rcpt-val-scale');
        if (ss && typeof liveData.scale === 'number') { ss.value = Math.round(liveData.scale * 100); }
        if (vs && typeof liveData.scale === 'number') { vs.textContent = `${Math.round(liveData.scale * 100)}%`; }

        const sr = document.getElementById('rcpt-slider-rot');
        const vr = document.getElementById('rcpt-val-rot');
        if (sr && typeof liveData.rotation === 'number') { sr.value = liveData.rotation; }
        if (vr && typeof liveData.rotation === 'number') { vr.textContent = `${liveData.rotation}\u00b0`; }
      };

      return;
    }


    // =========================================================================
    // GOOGLE SEARCH FX SUITE (3D Glassmorphic & Classic 2D Card)
    // =========================================================================
    if (tplId === 'google') {
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';

      const widthPct = Math.max(25, Math.min(98, Number(data.widthPercent !== undefined ? data.widthPercent : 65)));
      const sizePreset = data.sizePreset || (widthPct <= 40 ? 'compact' : (widthPct >= 90 ? 'fullscreen' : 'standard'));
      const lockAspect = data.lockAspectRatio !== false;
      const auroraEnabled = data.auroraEnabled !== false;
      const auroraIntensity = data.auroraIntensity !== undefined ? Number(data.auroraIntensity) : 85;
      const styleMode = data.styleMode || 'cinematic';
      const posX = Math.round(Number(data.posX || 0));
      const posY = Math.round(Number(data.posY || 0));
      const rotation = Math.round(Number(data.rotation || 0));
      const tiltX = Math.round(Number(data.tiltX || 0));
      const tiltY = Math.round(Number(data.tiltY || 0));
      const kfEnabled = data.keyframeEnabled === true;

      container.innerHTML = `
        <div style="background: rgba(11,17,32,0.88); border: 1px solid rgba(56,189,248,0.32); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 10px 28px rgba(0,0,0,0.65);">
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">🔍</span>
              <span style="font-size: 11px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.7px;">Google Search Studio</span>
            </div>
            <span style="font-size: 8.5px; color: #38bdf8; font-weight: 700; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.35); padding: 2px 7px; border-radius: 999px;">ADAPTIVE ${widthPct}%</span>
          </div>

          <!-- Section 1: Size Presets & Proportional Canvas Scaling -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(15,23,42,0.65); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 9px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 8.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.6px;">Size Preset &amp; Canvas Scale</span>
              <span id="g-val-width-pct" style="font-size: 9.5px; font-family: monospace; color: #38bdf8; font-weight: 700;">${widthPct}% Width</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
              <button type="button" class="g-preset-size-btn" data-preset="compact" data-width="35" style="padding: 6px 4px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: 1px solid ${sizePreset === 'compact' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${sizePreset === 'compact' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.35)'}; color: ${sizePreset === 'compact' ? '#fff' : '#94a3b8'}; cursor: pointer;">
                Compact (35%)
              </button>
              <button type="button" class="g-preset-size-btn" data-preset="standard" data-width="65" style="padding: 6px 4px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: 1px solid ${sizePreset === 'standard' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${sizePreset === 'standard' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.35)'}; color: ${sizePreset === 'standard' ? '#fff' : '#94a3b8'}; cursor: pointer;">
                Standard (65%)
              </button>
              <button type="button" class="g-preset-size-btn" data-preset="fullscreen" data-width="95" style="padding: 6px 4px; font-size: 9.5px; font-weight: 700; border-radius: 6px; border: 1px solid ${sizePreset === 'fullscreen' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${sizePreset === 'fullscreen' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.35)'}; color: ${sizePreset === 'fullscreen' ? '#fff' : '#94a3b8'}; cursor: pointer;">
                Fullscreen (95%)
              </button>
            </div>
            <input type="range" id="g-slider-width-pct" min="25" max="95" step="1" value="${widthPct}" style="width: 100%; accent-color: #38bdf8; height: 4px; cursor: pointer; margin-top: 2px;" />
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 2px;">
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="g-chk-lock-aspect" ${lockAspect ? 'checked' : ''} style="accent-color: #38bdf8;" />
                <span>Lock Aspect Ratio (Proportional Scaling)</span>
              </label>
              <button type="button" id="g-btn-center-reset" style="padding: 2px 7px; font-size: 8.5px; font-weight: 700; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #e2e8f0; cursor: pointer;">
                Center (65%)
              </button>
            </div>
          </div>

          <!-- Section 2: Position, Rotation & Optional 3D Perspective -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(15,23,42,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 9px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 8.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Transform (Drag on Stage or Fine-Tune)</span>
              <span style="font-size: 8px; color: #64748b; font-family: monospace;">16:9 · 9:16 · 1:1</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>POS X</span>
                  <span id="g-val-pos-x" style="color: #38bdf8; font-family: monospace;">${posX}px</span>
                </div>
                <input type="range" id="g-slider-pos-x" min="-260" max="260" value="${posX}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>POS Y</span>
                  <span id="g-val-pos-y" style="color: #38bdf8; font-family: monospace;">${posY}px</span>
                </div>
                <input type="range" id="g-slider-pos-y" min="-180" max="180" value="${posY}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>ROTATE</span>
                  <span id="g-val-rot" style="color: #38bdf8; font-family: monospace;">${rotation}°</span>
                </div>
                <input type="range" id="g-slider-rot" min="-25" max="25" value="${rotation}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 2px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>3D TILT Y</span>
                  <span id="g-val-tilt-y" style="color: #a855f7; font-family: monospace;">${tiltY}°</span>
                </div>
                <input type="range" id="g-slider-tilt-y" min="-30" max="30" value="${tiltY}" style="width: 100%; accent-color: #a855f7; height: 3px; cursor: pointer;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>3D TILT X</span>
                  <span id="g-val-tilt-x" style="color: #a855f7; font-family: monospace;">${tiltX}°</span>
                </div>
                <input type="range" id="g-slider-tilt-x" min="-25" max="25" value="${tiltX}" style="width: 100%; accent-color: #a855f7; height: 3px; cursor: pointer;" />
              </div>
            </div>
          </div>

          <!-- Section 3: Search Query & Auto-Suggestions -->
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 8.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Search Query &amp; Suggestions</span>
              <button type="button" id="g-btn-replay-typing" style="padding: 2px 8px; font-size: 8.5px; font-weight: 700; border-radius: 4px; border: 1px solid rgba(56,189,248,0.45); background: rgba(56,189,248,0.15); color: #38bdf8; cursor: pointer;">
                ▶ Replay Typing
              </button>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.42); padding: 5px 8px; border-radius: 6px; border: 1.5px solid rgba(56,189,248,0.5);">
              <span style="font-size: 8px; font-family: monospace; color: #38bdf8; width: 46px; font-weight: 800;">QUERY</span>
              <input type="text" id="g-inp-query" value="${(data.query || 'how to invest in index funds').replace(/"/g, '&quot;')}" style="flex: 1; background: transparent; border: none; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.35); padding: 5px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.07);">
              <span style="font-size: 8px; font-family: monospace; color: #94a3b8; width: 46px; font-weight: 700;">ROW 1</span>
              <input type="text" id="g-inp-sug1" value="${(data.suggestion || 'top index funds for passive wealth').replace(/"/g, '&quot;')}" style="flex: 1; background: transparent; border: none; color: #e2e8f0; font-size: 10.5px; outline: none;" />
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.35); padding: 5px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.07);">
              <span style="font-size: 8px; font-family: monospace; color: #94a3b8; width: 46px; font-weight: 700;">ROW 2</span>
              <input type="text" id="g-inp-sug2" value="${(data.suggestion2 || 's&p 500 historical annual return').replace(/"/g, '&quot;')}" style="flex: 1; background: transparent; border: none; color: #e2e8f0; font-size: 10.5px; outline: none;" />
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.35); padding: 5px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.07);">
              <span style="font-size: 8px; font-family: monospace; color: #94a3b8; width: 46px; font-weight: 700;">ROW 3</span>
              <input type="text" id="g-inp-sug3" value="${(data.suggestion3 || 'vanguard vs fidelity index funds').replace(/"/g, '&quot;')}" style="flex: 1; background: transparent; border: none; color: #e2e8f0; font-size: 10.5px; outline: none;" />
            </div>
          </div>

          <!-- Section 4: Aurora Light Waves & Card Appearance -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(15,23,42,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 9px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; font-weight: 700; color: #e2e8f0; cursor: pointer;">
                <input type="checkbox" id="g-chk-aurora" ${auroraEnabled ? 'checked' : ''} style="accent-color: #38bdf8;" />
                <span>Glowing Aurora Light Waves Backdrop</span>
              </label>
              <span id="g-val-aurora" style="font-size: 8.5px; font-family: monospace; color: #38bdf8;">${auroraIntensity}%</span>
            </div>
            <input type="range" id="g-slider-aurora" min="0" max="100" value="${auroraIntensity}" ${!auroraEnabled ? 'disabled' : ''} style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer; opacity: ${auroraEnabled ? 1 : 0.4};" />
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 2px;">
              <button type="button" id="g-btn-mode-cinematic" style="padding: 5px 8px; font-size: 9.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${styleMode !== 'classic' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${styleMode !== 'classic' ? 'rgba(56,189,248,0.18)' : 'rgba(0,0,0,0.35)'}; color: ${styleMode !== 'classic' ? '#fff' : '#94a3b8'}; cursor: pointer;">
                ✨ Frosted Dark Glass
              </button>
              <button type="button" id="g-btn-mode-classic" style="padding: 5px 8px; font-size: 9.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${styleMode === 'classic' ? '#e2e8f0' : 'rgba(255,255,255,0.1)'}; background: ${styleMode === 'classic' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.35)'}; color: ${styleMode === 'classic' ? '#fff' : '#94a3b8'}; cursor: pointer;">
                📄 Clean Light Card
              </button>
            </div>
          </div>

          <!-- Section 5: Keyframe Animation (Position, Scale, Rotation) -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(15,23,42,0.5); border: 1px solid rgba(168,85,247,0.25); border-radius: 8px; padding: 9px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; font-weight: 700; color: #e9d5ff; cursor: pointer;">
                <input type="checkbox" id="g-chk-keyframe" ${kfEnabled ? 'checked' : ''} style="accent-color: #a855f7;" />
                <span>Keyframe Motion (Start → End)</span>
              </label>
              <button type="button" id="g-btn-play-kf" style="padding: 2px 7px; font-size: 8.5px; font-weight: 700; border-radius: 4px; border: 1px solid rgba(168,85,247,0.45); background: rgba(168,85,247,0.2); color: #e9d5ff; cursor: pointer;">
                ▶ Preview Motion
              </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; opacity: ${kfEnabled ? 1 : 0.5};">
              <div>
                <span style="font-size: 7.5px; color: #94a3b8; display: block;">START SCALE</span>
                <input type="number" id="g-kf-start-scale" step="0.05" min="0.4" max="1.6" value="${data.kfStartScale !== undefined ? data.kfStartScale : 0.92}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; color: #fff; font-size: 9.5px; padding: 3px 5px;" />
              </div>
              <div>
                <span style="font-size: 7.5px; color: #94a3b8; display: block;">START Y (PX)</span>
                <input type="number" id="g-kf-start-y" step="5" min="-200" max="200" value="${data.kfStartY !== undefined ? data.kfStartY : 18}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; color: #fff; font-size: 9.5px; padding: 3px 5px;" />
              </div>
              <div>
                <span style="font-size: 7.5px; color: #94a3b8; display: block;">START ROT (°)</span>
                <input type="number" id="g-kf-start-rot" step="1" min="-45" max="45" value="${data.kfStartRot !== undefined ? data.kfStartRot : 0}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; color: #fff; font-size: 9.5px; padding: 3px 5px;" />
              </div>
            </div>
          </div>
        </div>
      `;

      // Helper for live sync when stage drag/resize happens
      window.tplSyncGoogleInspectorUI = () => {
        const latest = window.tplGetContextualData('google');
        const wEl = container.querySelector('#g-val-width-pct');
        const wSlider = container.querySelector('#g-slider-width-pct');
        if (wEl && latest.widthPercent !== undefined) wEl.textContent = `${Math.round(latest.widthPercent)}% Width`;
        if (wSlider && latest.widthPercent !== undefined) wSlider.value = Math.round(latest.widthPercent);
        const pxEl = container.querySelector('#g-val-pos-x');
        const pxSlider = container.querySelector('#g-slider-pos-x');
        if (pxEl && latest.posX !== undefined) pxEl.textContent = `${Math.round(latest.posX)}px`;
        if (pxSlider && latest.posX !== undefined) pxSlider.value = Math.round(latest.posX);
        const pyEl = container.querySelector('#g-val-pos-y');
        const pySlider = container.querySelector('#g-slider-pos-y');
        if (pyEl && latest.posY !== undefined) pyEl.textContent = `${Math.round(latest.posY)}px`;
        if (pySlider && latest.posY !== undefined) pySlider.value = Math.round(latest.posY);
      };

      // Preset Size Buttons (Compact 35%, Standard 65%, Fullscreen 95%)
      container.querySelectorAll('.g-preset-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          const w = Number(btn.dataset.width || 65);
          window.tplSetContextualData('google', { sizePreset: preset, widthPercent: w, scale: 1 });
          window.tplRenderContextualInspector('google');
        });
      });

      container.querySelector('#g-slider-width-pct')?.addEventListener('input', (e) => {
        const w = parseInt(e.target.value, 10);
        const preset = w <= 40 ? 'compact' : (w >= 90 ? 'fullscreen' : 'standard');
        const lbl = container.querySelector('#g-val-width-pct');
        if (lbl) lbl.textContent = `${w}% Width`;
        window.tplSetContextualData('google', { widthPercent: w, sizePreset: preset, scale: 1 });
      });

      container.querySelector('#g-chk-lock-aspect')?.addEventListener('change', (e) => {
        window.tplSetContextualData('google', { lockAspectRatio: e.target.checked });
      });

      container.querySelector('#g-btn-center-reset')?.addEventListener('click', () => {
        window.tplSetContextualData('google', {
          widthPercent: 65,
          sizePreset: 'standard',
          posX: 0,
          posY: 0,
          scale: 1,
          rotation: 0,
          tiltX: 0,
          tiltY: 0
        });
        window.tplRenderContextualInspector('google');
      });

      container.querySelector('#g-slider-pos-x')?.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        const lbl = container.querySelector('#g-val-pos-x');
        if (lbl) lbl.textContent = `${v}px`;
        window.tplSetContextualData('google', { posX: v });
      });

      container.querySelector('#g-slider-pos-y')?.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        const lbl = container.querySelector('#g-val-pos-y');
        if (lbl) lbl.textContent = `${v}px`;
        window.tplSetContextualData('google', { posY: v });
      });

      container.querySelector('#g-slider-rot')?.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        const lbl = container.querySelector('#g-val-rot');
        if (lbl) lbl.textContent = `${v}°`;
        window.tplSetContextualData('google', { rotation: v });
      });

      container.querySelector('#g-slider-tilt-y')?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const valEl = container.querySelector('#g-val-tilt-y');
        if (valEl) valEl.textContent = `${val}°`;
        window.tplSetContextualData('google', { tiltY: val });
      });

      container.querySelector('#g-slider-tilt-x')?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const valEl = container.querySelector('#g-val-tilt-x');
        if (valEl) valEl.textContent = `${val}°`;
        window.tplSetContextualData('google', { tiltX: val });
      });

      container.querySelector('#g-inp-query')?.addEventListener('input', (e) => {
        window.tplSetContextualData('google', { query: e.target.value });
      });
      container.querySelector('#g-inp-sug1')?.addEventListener('input', (e) => {
        window.tplSetContextualData('google', { suggestion: e.target.value });
      });
      container.querySelector('#g-inp-sug2')?.addEventListener('input', (e) => {
        window.tplSetContextualData('google', { suggestion2: e.target.value });
      });
      container.querySelector('#g-inp-sug3')?.addEventListener('input', (e) => {
        window.tplSetContextualData('google', { suggestion3: e.target.value });
      });

      container.querySelector('#g-btn-replay-typing')?.addEventListener('click', () => {
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage && typeof window.tplTriggerGoogleSearchAnimation === 'function') {
          window.tplTriggerGoogleSearchAnimation(stage, window.tplGetContextualData('google'));
        }
      });

      container.querySelector('#g-chk-aurora')?.addEventListener('change', (e) => {
        window.tplSetContextualData('google', { auroraEnabled: e.target.checked });
        window.tplRenderContextualInspector('google');
      });

      container.querySelector('#g-slider-aurora')?.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        const lbl = container.querySelector('#g-val-aurora');
        if (lbl) lbl.textContent = `${v}%`;
        window.tplSetContextualData('google', { auroraIntensity: v });
      });

      container.querySelector('#g-btn-mode-cinematic')?.addEventListener('click', () => {
        window.tplSetContextualData('google', { styleMode: 'cinematic' });
        window.tplRenderContextualInspector('google');
      });

      container.querySelector('#g-btn-mode-classic')?.addEventListener('click', () => {
        window.tplSetContextualData('google', { styleMode: 'classic' });
        window.tplRenderContextualInspector('google');
      });

      container.querySelector('#g-chk-keyframe')?.addEventListener('change', (e) => {
        window.tplSetContextualData('google', { keyframeEnabled: e.target.checked });
        window.tplRenderContextualInspector('google');
      });

      container.querySelector('#g-kf-start-scale')?.addEventListener('input', (e) => {
        window.tplSetContextualData('google', { kfStartScale: parseFloat(e.target.value) || 0.92 });
      });
      container.querySelector('#g-kf-start-y')?.addEventListener('input', (e) => {
        window.tplSetContextualData('google', { kfStartY: parseInt(e.target.value, 10) || 0 });
      });
      container.querySelector('#g-kf-start-rot')?.addEventListener('input', (e) => {
        window.tplSetContextualData('google', { kfStartRot: parseInt(e.target.value, 10) || 0 });
      });

      container.querySelector('#g-btn-play-kf')?.addEventListener('click', () => {
        window.tplSetContextualData('google', { keyframeEnabled: true });
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage && typeof window.tplTriggerGoogleSearchAnimation === 'function') {
          window.tplTriggerGoogleSearchAnimation(stage, window.tplGetContextualData('google'));
        }
      });

      return;
    }

    if (tplId === 'quote') {
      const palettes = [
        { id: 'parchment', name: 'Warm Parchment', bg: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 100%)', text: '#3a2418', author: '#8b5a3c', mark: 'rgba(139, 90, 60, 0.16)' },
        { id: 'noir', name: 'Noir Cinema', bg: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)', text: '#f4f4f5', author: '#a1a1aa', mark: 'rgba(255, 255, 255, 0.08)' },
        { id: 'midnight', name: 'Midnight Gold', bg: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', text: '#f8fafc', author: '#eab308', mark: 'rgba(234, 179, 8, 0.12)' },
        { id: 'terracotta', name: 'Terracotta', bg: 'linear-gradient(135deg, #451a03 0%, #1c0a00 100%)', text: '#fef3c7', author: '#f59e0b', mark: 'rgba(245, 158, 11, 0.12)' },
        { id: 'emerald', name: 'Emerald Vault', bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', text: '#ecfdf5', author: '#34d399', mark: 'rgba(52, 211, 153, 0.12)' }
      ];

      const fonts = [
        { label: 'Playfair Display (Editorial)', val: "'Playfair Display', Georgia, serif" },
        { label: 'Georgia (Classic Book)', val: "Georgia, serif" },
        { label: 'Cinzel (Cinematic Epic)', val: "'Cinzel', serif" },
        { label: 'Garamond (Poetic Novel)', val: "Garamond, serif" },
        { label: 'Space Grotesk (Modern Bold)', val: "'Space Grotesk', sans-serif" },
        { label: 'Inter (Clean Tech)', val: "'Inter', sans-serif" }
      ];

      const curPal = data.palette || 'parchment';
      const curFont = data.fontFamily || "'Playfair Display', Georgia, serif";

      container.innerHTML = `
        <div style="background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">\u275d</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">Cinematic Quote Studio</span>
            </div>
            <span style="font-size: 9px; font-weight: 700; background: rgba(56,189,248,0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-family: monospace;">RESPONSIVE CARD</span>
          </div>

          <!-- Quote Text (Textarea) -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Quote Statement</span>
            <textarea id="quote-inp-text" rows="3" style="width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-family: inherit; line-height: 1.4; outline: none; resize: vertical;">${data.quote || 'The obstacle is the way.'}</textarea>
          </div>

          <!-- Author Field -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Attribution / Author</span>
            <input type="text" id="quote-inp-author" value="${data.author || 'Marcus Aurelius'}" style="width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
          </div>

          <!-- Color & Palette Themes -->
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Aesthetic Color Palette</span>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;">
              ${palettes.map(p => `
                <button type="button" class="quote-pal-btn" data-pal="${p.id}" title="${p.name}" style="height: 32px; border-radius: 6px; background: ${p.bg}; border: ${curPal === p.id ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)'}; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: ${curPal === p.id ? '0 0 8px rgba(56,189,248,0.5)' : 'none'};">
                  <span style="font-size: 12px; color: ${p.text}; font-weight: 900; line-height: 1;">\u201c</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Typography Style -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Serif Typography</span>
            <select id="quote-sel-font" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #f1f5f9; font-size: 11px; font-weight: 600; outline: none; cursor: pointer;">
              ${fonts.map(f => `
                <option value="${f.val}" ${f.val === curFont ? 'selected' : ''}>${f.label}</option>
              `).join('')}
            </select>
          </div>

          <!-- Font Size Slider -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between; font-size: 9.5px;">
              <span style="color: #94a3b8; font-weight: 600; text-transform: uppercase;">Scale Font Size</span>
              <span id="quote-lbl-size" style="color: #38bdf8; font-family: monospace; font-weight: 700;">${data.fontSize || 42}px</span>
            </div>
            <input type="range" id="quote-slider-size" min="20" max="64" value="${data.fontSize || 42}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
          </div>

          <!-- Individual Colors -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Text</span>
              <input type="color" id="quote-col-text" value="${data.textColor || '#3a2418'}" style="width: 22px; height: 20px; border: none; background: transparent; cursor: pointer;" />
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Author</span>
              <input type="color" id="quote-col-author" value="${data.authorColor || '#8b5a3c'}" style="width: 22px; height: 20px; border: none; background: transparent; cursor: pointer;" />
            </div>
          </div>
        </div>
      `;

      // Wire Quote Studio Controls
      const qInp = container.querySelector('#quote-inp-text');
      if (qInp) {
        qInp.oninput = (e) => {
          window.tplSetContextualData('quote', { quote: e.target.value });
        };
      }

      const aInp = container.querySelector('#quote-inp-author');
      if (aInp) {
        aInp.oninput = (e) => {
          window.tplSetContextualData('quote', { author: e.target.value });
        };
      }

      container.querySelectorAll('.quote-pal-btn').forEach(btn => {
        btn.onclick = () => {
          const palId = btn.dataset.pal;
          const chosen = palettes.find(p => p.id === palId);
          if (chosen) {
            window.tplSetContextualData('quote', {
              palette: chosen.id,
              bgGradient: chosen.bg,
              textColor: chosen.text,
              authorColor: chosen.author,
              quoteMarkColor: chosen.mark
            });
            window.tplRenderContextualInspector('quote');
          }
        };
      });

      const fontSel = container.querySelector('#quote-sel-font');
      if (fontSel) {
        fontSel.onchange = (e) => {
          window.tplSetContextualData('quote', { fontFamily: e.target.value });
        };
      }

      const szSlider = container.querySelector('#quote-slider-size');
      const szLbl = container.querySelector('#quote-lbl-size');
      if (szSlider) {
        szSlider.oninput = (e) => {
          const val = parseInt(e.target.value, 10);
          if (szLbl) szLbl.textContent = `${val}px`;
          window.tplSetContextualData('quote', { fontSize: val });
        };
      }

      const tCol = container.querySelector('#quote-col-text');
      if (tCol) {
        tCol.onchange = (e) => {
          window.tplSetContextualData('quote', { textColor: e.target.value });
        };
      }

      const auCol = container.querySelector('#quote-col-author');
      if (auCol) {
        auCol.onchange = (e) => {
          window.tplSetContextualData('quote', { authorColor: e.target.value });
        };
      }
    }

    if (tplId === 'parallax') {
      container.innerHTML = `
        <div style="background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">\ud83c\udf04</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">Depth Layer Stack</span>
            </div>
            <label for="parallax-add-custom-layer" style="font-size: 10px; font-weight: 600; color: #c084fc; cursor: pointer; padding: 2px 6px; border-radius: 4px; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3);">
              + Add Layer
              <input type="file" id="parallax-add-custom-layer" accept="image/*,video/*" style="display: none;" />
            </label>
          </div>

          <!-- Layer 1: Foreground Figure -->
          <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 9px; font-weight: 700; background: rgba(56,189,248,0.2); color: #38bdf8; padding: 2px 5px; border-radius: 4px; font-family: monospace;">Z=3 (FG)</span>
                <span style="font-size: 11px; font-weight: 600; color: #fff;">Foreground Silhouette</span>
              </div>
              <label for="parallax-upload-fg" style="font-size: 9.5px; font-weight: 600; color: #38bdf8; cursor: pointer; padding: 2px 6px; border-radius: 4px; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25);">
                Replace
                <input type="file" id="parallax-upload-fg" accept="image/*,video/*" style="display: none;" />
              </label>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-top: 4px;">
              <span>Zoom Scale</span>
              <span id="parallax-lbl-zoom">${(data.zoomScale || 1.15).toFixed(2)}x</span>
            </div>
            <input type="range" id="parallax-input-zoom" min="100" max="180" value="${Math.round((data.zoomScale || 1.15) * 100)}" style="accent-color: #38bdf8; height: 3px; cursor: pointer;" />
          </div>

          <!-- Layer 2: Midground Mountain Range -->
          <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 9px; font-weight: 700; background: rgba(168,85,247,0.2); color: #c084fc; padding: 2px 5px; border-radius: 4px; font-family: monospace;">Z=2 (MID)</span>
                <span style="font-size: 11px; font-weight: 600; color: #fff;">Mountains / Terrain</span>
              </div>
              <label for="parallax-upload-mid" style="font-size: 9.5px; font-weight: 600; color: #c084fc; cursor: pointer; padding: 2px 6px; border-radius: 4px; background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.25);">
                Replace
                <input type="file" id="parallax-upload-mid" accept="image/*,video/*" style="display: none;" />
              </label>
            </div>
          </div>

          <!-- Layer 3: Sun / Atmospheric Orb -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 9px; font-weight: 700; background: rgba(245,158,11,0.2); color: #fbbf24; padding: 2px 5px; border-radius: 4px; font-family: monospace;">Z=1 (ATM)</span>
                <span style="font-size: 11px; font-weight: 600; color: #fff;">Sun Glow & Size</span>
              </div>
              <input type="color" id="parallax-input-sun-col" value="${data.sunColor || '#ff7a59'}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" title="Sun Core Color" />
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #94a3b8;">
              <span>Orb Diameter</span>
              <span id="parallax-lbl-sun-size">${data.sunSize || 64}px</span>
            </div>
            <input type="range" id="parallax-input-sun-size" min="30" max="140" value="${data.sunSize || 64}" style="accent-color: #fbbf24; height: 3px; cursor: pointer;" />
          </div>

          <!-- Layer 4: Sky Backdrop Gradient -->
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 9px; font-weight: 700; background: rgba(100,116,139,0.2); color: #cbd5e1; padding: 2px 5px; border-radius: 4px; font-family: monospace;">Z=0 (BG)</span>
              <span style="font-size: 11px; font-weight: 600; color: #fff;">Sky Horizon</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="color" id="parallax-input-sky-top" value="${data.skyTop || '#1a1033'}" style="width: 20px; height: 20px; border: none; background: transparent; cursor: pointer;" title="Sky Top Color" />
              <span style="color: #64748b; font-size: 10px;">\u2192</span>
              <input type="color" id="parallax-input-sky-bot" value="${data.skyBottom || '#ff7a59'}" style="width: 20px; height: 20px; border: none; background: transparent; cursor: pointer;" title="Sky Horizon Glow" />
            </div>
          </div>
        </div>
      `;

      // Wire Parallax Controls
      const sunCol = container.querySelector('#parallax-input-sun-col');
      if (sunCol) sunCol.oninput = (e) => window.tplSetContextualData('parallax', { sunColor: e.target.value });
      const sunSize = container.querySelector('#parallax-input-sun-size');
      const sunSizeLbl = container.querySelector('#parallax-lbl-sun-size');
      if (sunSize) sunSize.oninput = (e) => {
        const sz = parseInt(e.target.value, 10);
        if (sunSizeLbl) sunSizeLbl.textContent = `${sz}px`;
        window.tplSetContextualData('parallax', { sunSize: sz });
      };
      const skyTop = container.querySelector('#parallax-input-sky-top');
      if (skyTop) skyTop.oninput = (e) => window.tplSetContextualData('parallax', { skyTop: e.target.value });
      const skyBot = container.querySelector('#parallax-input-sky-bot');
      if (skyBot) skyBot.oninput = (e) => window.tplSetContextualData('parallax', { skyBottom: e.target.value });
      const zoom = container.querySelector('#parallax-input-zoom');
      const zoomLbl = container.querySelector('#parallax-lbl-zoom');
      if (zoom) zoom.oninput = (e) => {
        const sc = parseInt(e.target.value, 10) / 100;
        if (zoomLbl) zoomLbl.textContent = `${sc.toFixed(2)}x`;
        window.tplSetContextualData('parallax', { zoomScale: sc });
      };

      // File upload replacers
      const upFg = container.querySelector('#parallax-upload-fg');
      if (upFg) upFg.onchange = (e) => {
        const f = e.target.files[0];
        if (f) {
          const url = URL.createObjectURL(f);
          window.tplSetContextualData('parallax', { figureImg: url });
        }
      };
      const upMid = container.querySelector('#parallax-upload-mid');
      if (upMid) upMid.onchange = (e) => {
        const f = e.target.files[0];
        if (f) {
          const url = URL.createObjectURL(f);
          window.tplSetContextualData('parallax', { mountainsImg: url });
        }
      };
      const upCustom = container.querySelector('#parallax-add-custom-layer');
      if (upCustom) upCustom.onchange = (e) => {
        const f = e.target.files[0];
        if (f) {
          const url = URL.createObjectURL(f);
          window.tplSetContextualData('parallax', { figureImg: url });
          if (typeof showTextTimingAlert === 'function') showTextTimingAlert('Added custom parallax plane!', 'success');
        }
      };
      return;
    }

    // =========================================================================
    // CASE 2: WEALTH COMPARISON BARS (Image 2)
    // =========================================================================
    if (tplId === 'wealth') {
      const bars = data.bars || [];
      container.innerHTML = `
        <div style="background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">\ud83d\udcca</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">Comparison Bars</span>
            </div>
            <button type="button" id="wealth-btn-add-bar" style="font-size: 10px; font-weight: 600; color: #38bdf8; cursor: pointer; padding: 2px 7px; border-radius: 4px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.35);">
              + Add Bar
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Chart Title</span>
            <input type="text" id="wealth-input-title" value="${data.title || 'Net Worth Comparison'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
          </div>

          <div id="wealth-bars-list" style="display: flex; flex-direction: column; gap: 8px;">
            ${bars.map((b, idx) => `
              <div class="wealth-bar-edit-card" style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                  <span style="font-size: 10px; font-weight: 700; color: ${b.color}; font-family: monospace;">#${idx + 1}</span>
                  <input type="text" class="wealth-item-label" data-idx="${idx}" value="${b.label}" placeholder="Entity Name" style="flex: 1; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 11px; font-weight: 600; padding: 2px 4px; outline: none;" />
                  <input type="text" class="wealth-item-val" data-idx="${idx}" value="${b.val}" placeholder="Value" style="width: 55px; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.15); color: ${b.color}; font-size: 11px; font-weight: 700; text-align: right; padding: 2px 4px; outline: none;" />
                  <input type="color" class="wealth-item-color" data-idx="${idx}" value="${b.color}" style="width: 22px; height: 20px; border: none; background: transparent; cursor: pointer;" title="Change Bar Color" />
                  ${bars.length > 1 ? `<button type="button" class="wealth-item-del" data-idx="${idx}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0 4px;" title="Remove this bar">\u2715</button>` : ''}
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #64748b;">
                  <span>Bar Fill Length</span>
                  <span>${b.pct}%</span>
                </div>
                <input type="range" class="wealth-item-pct" data-idx="${idx}" min="5" max="100" value="${b.pct}" style="accent-color: ${b.color}; height: 3px; cursor: pointer;" />
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Wire Wealth Controls
      const tInput = container.querySelector('#wealth-input-title');
      if (tInput) tInput.oninput = (e) => window.tplSetContextualData('wealth', { title: e.target.value });

      container.querySelectorAll('.wealth-item-label').forEach(inp => {
        inp.oninput = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          bars[i].label = e.target.value;
          window.tplSetContextualData('wealth', { bars: [...bars] });
        };
      });

      container.querySelectorAll('.wealth-item-val').forEach(inp => {
        inp.oninput = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          bars[i].val = e.target.value;
          window.tplSetContextualData('wealth', { bars: [...bars] });
        };
      });

      container.querySelectorAll('.wealth-item-color').forEach(inp => {
        inp.onchange = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          bars[i].color = e.target.value;
          window.tplSetContextualData('wealth', { bars: [...bars] });
          window.tplRenderContextualInspector('wealth');
        };
      });

      container.querySelectorAll('.wealth-item-pct').forEach(inp => {
        inp.oninput = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          bars[i].pct = parseInt(e.target.value, 10);
          window.tplSetContextualData('wealth', { bars: [...bars] });
          const card = inp.closest('.wealth-bar-edit-card');
          if (card) {
            const span = card.querySelectorAll('span')[2];
            if (span) span.textContent = `${bars[i].pct}%`;
          }
        };
      });

      container.querySelectorAll('.wealth-item-del').forEach(btn => {
        btn.onclick = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          bars.splice(i, 1);
          window.tplSetContextualData('wealth', { bars: [...bars] });
          window.tplRenderContextualInspector('wealth');
        };
      });

      const addBarBtn = container.querySelector('#wealth-btn-add-bar');
      if (addBarBtn) {
        addBarBtn.onclick = () => {
          const colors = ['#f59e0b', '#10b981', '#a855f7', '#ec4899', '#06b6d4'];
          const rndCol = colors[bars.length % colors.length];
          bars.push({ label: 'New Entity', val: '$50B', pct: 50, color: rndCol });
          window.tplSetContextualData('wealth', { bars: [...bars] });
          window.tplRenderContextualInspector('wealth');
        };
      }
      return;
    }

    // =========================================================================
    // CASE 3: STOCK TICKER TAPE (Image 3)
    // =========================================================================
    if (tplId === 'ticker') {
      const items = data.items || [];
      container.innerHTML = `
        <div style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">\ud83d\udcc8</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">Ticker Feed & Feeds</span>
            </div>
            <button type="button" id="ticker-btn-add-item" style="font-size: 10px; font-weight: 600; color: #10b981; cursor: pointer; padding: 2px 7px; border-radius: 4px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.35);">
              + Add Stock
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Tape Header Label</span>
            <input type="text" id="ticker-input-title" value="${data.title || 'LIVE MARKETS'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 260px; overflow-y: auto; padding-right: 2px;">
            ${items.map((it, idx) => `
              <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 5px 8px;">
                <input type="text" class="ticker-item-sym" data-idx="${idx}" value="${it.sym}" placeholder="Symbol" style="width: 50px; background: transparent; border: none; color: #fff; font-size: 11px; font-weight: 700; outline: none; font-family: monospace;" />
                <input type="text" class="ticker-item-price" data-idx="${idx}" value="${it.price}" placeholder="Price" style="flex: 1; background: transparent; border: none; color: #cbd5e1; font-size: 10.5px; font-weight: 600; outline: none;" />
                <input type="text" class="ticker-item-change" data-idx="${idx}" value="${it.change}" placeholder="+0.0%" style="width: 50px; background: transparent; border: none; color: ${it.isUp ? '#10b981' : '#ef4444'}; font-size: 10.5px; font-weight: 700; text-align: right; outline: none;" />
                <button type="button" class="ticker-item-toggle" data-idx="${idx}" style="padding: 2px 5px; font-size: 9px; font-weight: 700; border-radius: 4px; background: ${it.isUp ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${it.isUp ? '#10b981' : '#ef4444'}; border: 1px solid ${it.isUp ? '#10b981' : '#ef4444'}; cursor: pointer;">
                  ${it.isUp ? '\u25b2' : '\u25bc'}
                </button>
                <button type="button" class="ticker-item-del" data-idx="${idx}" style="background: none; border: none; color: #64748b; font-size: 12px; cursor: pointer; padding: 0 2px;">\u2715</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Wire Ticker Controls
      const headInput = container.querySelector('#ticker-input-title');
      if (headInput) headInput.oninput = (e) => window.tplSetContextualData('ticker', { title: e.target.value });

      container.querySelectorAll('.ticker-item-sym').forEach(inp => {
        inp.oninput = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          items[i].sym = e.target.value.toUpperCase();
          window.tplSetContextualData('ticker', { items: [...items] });
        };
      });

      container.querySelectorAll('.ticker-item-price').forEach(inp => {
        inp.oninput = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          items[i].price = e.target.value;
          window.tplSetContextualData('ticker', { items: [...items] });
        };
      });

      container.querySelectorAll('.ticker-item-change').forEach(inp => {
        inp.oninput = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          items[i].change = e.target.value;
          window.tplSetContextualData('ticker', { items: [...items] });
        };
      });

      container.querySelectorAll('.ticker-item-toggle').forEach(btn => {
        btn.onclick = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          items[i].isUp = !items[i].isUp;
          if (items[i].isUp && items[i].change.startsWith('-')) items[i].change = '+' + items[i].change.slice(1);
          if (!items[i].isUp && items[i].change.startsWith('+')) items[i].change = '-' + items[i].change.slice(1);
          window.tplSetContextualData('ticker', { items: [...items] });
          window.tplRenderContextualInspector('ticker');
        };
      });

      container.querySelectorAll('.ticker-item-del').forEach(btn => {
        btn.onclick = (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          items.splice(i, 1);
          window.tplSetContextualData('ticker', { items: [...items] });
          window.tplRenderContextualInspector('ticker');
        };
      });

      const addBtn = container.querySelector('#ticker-btn-add-item');
      if (addBtn) {
        addBtn.onclick = () => {
          items.push({ sym: 'COIN', price: '215.40', change: '+3.45%', isUp: true });
          window.tplSetContextualData('ticker', { items: [...items] });
          window.tplRenderContextualInspector('ticker');
        };
      }
      return;
    }

    // =========================================================================
    // CASE 4: TEXT BEHIND OBJECT (Image 2)
    // =========================================================================
    if (tplId === 'textbehind') {
      const fonts = [
        { label: 'Space Grotesk (Editorial)', val: "'Space Grotesk', sans-serif" },
        { label: 'Impact (Bold Poster)', val: 'Impact, sans-serif' },
        { label: 'Montserrat (Ultra Bold)', val: "'Montserrat', sans-serif" },
        { label: 'Bebas Neue (Tall Cinema)', val: "'Bebas Neue', sans-serif" },
        { label: 'Arial Black (Heavy)', val: "'Arial Black', sans-serif" },
        { label: 'Inter (Clean Modern)', val: "'Inter', sans-serif" },
        { label: 'Georgia (Classic)', val: "'Georgia', serif" }
      ];
      const swatches = ['#ffffff', '#ff334b', '#00f0ff', '#facc15', '#10b981', '#a855f7'];
      const curOrder = data.layerOrder || 'behind';

      container.innerHTML = `
        <div style="background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 11px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">\ud83d\udd24</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">TEXT BEHIND CONTROLS</span>
            </div>
            <span style="font-size: 9px; color: #c084fc; font-weight: 700; background: rgba(168,85,247,0.15); padding: 1px 6px; border-radius: 4px;">TOP PRIORITY</span>
          </div>

          <!-- Text Input -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Headline Text</span>
            <input type="text" id="tb-input-text" value="${data.bgText || 'DREAM'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 12px; font-weight: 700; outline: none; letter-spacing: 0.5px;" />
          </div>

          <!-- Color & Swatches -->
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Text Color</span>
              <div style="display: flex; align-items: center; gap: 5px;">
                <input type="color" id="tb-input-color" value="${data.textColor || '#ffffff'}" style="width: 26px; height: 22px; border: none; background: transparent; cursor: pointer;" title="Pick Custom Color" />
                <span id="tb-lbl-color" style="font-size: 10px; font-family: monospace; color: #cbd5e1; font-weight: 600;">${data.textColor || '#ffffff'}</span>
              </div>
            </div>
            <!-- Quick Swatches -->
            <div style="display: flex; align-items: center; gap: 6px; padding: 2px 0;">
              ${swatches.map(c => `
                <button type="button" class="tb-swatch-btn" data-color="${c}" style="width: 20px; height: 20px; border-radius: 4px; background: ${c}; border: 1.5px solid ${c === data.textColor ? '#fff' : 'rgba(255,255,255,0.18)'}; cursor: pointer; box-shadow: ${c === data.textColor ? '0 0 6px rgba(255,255,255,0.6)' : 'none'}; transition: transform 0.1s;" onmouseover="this.style.transform='scale(1.15)';" onmouseout="this.style.transform='scale(1)';"></button>
              `).join('')}
            </div>
          </div>

          <!-- Font Family Selector -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Typography Style</span>
            <select id="tb-select-font" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #f1f5f9; font-size: 11px; font-weight: 600; outline: none; cursor: pointer;">
              ${fonts.map(f => `
                <option value="${f.val}" ${f.val === data.fontFamily ? 'selected' : ''}>${f.label}</option>
              `).join('')}
            </select>
          </div>

          <!-- Font Size Slider -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between; font-size: 9.5px;">
              <span style="color: #94a3b8; font-weight: 600; text-transform: uppercase;">Font Size</span>
              <span id="tb-lbl-size" style="color: #38bdf8; font-family: monospace; font-weight: 700;">${data.fontSize || 80}px</span>
            </div>
            <input type="range" id="tb-slider-size" min="40" max="140" value="${data.fontSize || 80}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
          </div>

          <!-- Letter Spacing Tracking Slider -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between; font-size: 9.5px;">
              <span style="color: #94a3b8; font-weight: 600; text-transform: uppercase;">Letter Spacing</span>
              <span id="tb-lbl-track" style="color: #a855f7; font-family: monospace; font-weight: 700;">${data.letterSpacing !== undefined ? data.letterSpacing : -2}px</span>
            </div>
            <input type="range" id="tb-slider-track" min="-6" max="16" value="${data.letterSpacing !== undefined ? data.letterSpacing : -2}" style="width: 100%; accent-color: #a855f7; height: 3px; cursor: pointer;" />
          </div>

          <!-- Layer Depth Order Toggle (Behind vs In Front) -->
          <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">Text Depth Placement</span>
              <span style="font-size: 8.5px; color: #94a3b8; font-family: monospace;">Z-INDEX</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 2px;">
              <button type="button" id="btn-tb-order-behind" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; ${curOrder === 'behind' ? 'background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #fff;' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8;'}">
                <span>\ud83d\udd32</span> Behind Subject
              </button>
              <button type="button" id="btn-tb-order-front" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; ${curOrder === 'front' ? 'background: rgba(168,85,247,0.2); border: 1px solid #a855f7; color: #fff;' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8;'}">
                <span>\ud83d\udd32</span> Bring to Front
              </button>
            </div>
          </div>
        </div>
      `;

      // Wire Text Behind Controls
      const textInput = container.querySelector('#tb-input-text');
      if (textInput) {
        textInput.oninput = (e) => {
          window.tplSetContextualData('textbehind', { bgText: e.target.value });
          if (typeof topCustomizerState !== 'undefined') topCustomizerState.mainText = e.target.value;
        };
      }

      const colorInput = container.querySelector('#tb-input-color');
      const colorLbl = container.querySelector('#tb-lbl-color');
      if (colorInput) {
        colorInput.oninput = (e) => {
          const c = e.target.value;
          if (colorLbl) colorLbl.textContent = c;
          window.tplSetContextualData('textbehind', { textColor: c });
          if (typeof topCustomizerState !== 'undefined') topCustomizerState.textColor = c;
        };
      }

      container.querySelectorAll('.tb-swatch-btn').forEach(btn => {
        btn.onclick = () => {
          const c = btn.dataset.color;
          if (colorInput) colorInput.value = c;
          if (colorLbl) colorLbl.textContent = c;
          window.tplSetContextualData('textbehind', { textColor: c });
          if (typeof topCustomizerState !== 'undefined') topCustomizerState.textColor = c;
          window.tplRenderContextualInspector('textbehind');
        };
      });

      const fontSelect = container.querySelector('#tb-select-font');
      if (fontSelect) {
        fontSelect.onchange = (e) => {
          window.tplSetContextualData('textbehind', { fontFamily: e.target.value });
        };
      }

      const sizeSlider = container.querySelector('#tb-slider-size');
      const sizeLbl = container.querySelector('#tb-lbl-size');
      if (sizeSlider) {
        sizeSlider.oninput = (e) => {
          const sz = parseInt(e.target.value, 10);
          if (sizeLbl) sizeLbl.textContent = `${sz}px`;
          window.tplSetContextualData('textbehind', { fontSize: sz });
        };
      }

      const trackSlider = container.querySelector('#tb-slider-track');
      const trackLbl = container.querySelector('#tb-lbl-track');
      if (trackSlider) {
        trackSlider.oninput = (e) => {
          const tr = parseInt(e.target.value, 10);
          if (trackLbl) trackLbl.textContent = `${tr}px`;
          window.tplSetContextualData('textbehind', { letterSpacing: tr });
        };
      }

      const btnBehind = container.querySelector('#btn-tb-order-behind');
      const btnFront = container.querySelector('#btn-tb-order-front');
      if (btnBehind) {
        btnBehind.onclick = () => {
          window.tplSetContextualData('textbehind', { layerOrder: 'behind' });
          window.tplRenderContextualInspector('textbehind');
        };
      }
      if (btnFront) {
        btnFront.onclick = () => {
          window.tplSetContextualData('textbehind', { layerOrder: 'front' });
          window.tplRenderContextualInspector('textbehind');
        };
      }
      return;
    }

    // =========================================================================
    // CASE 5: DOCUMENT KEY HIGHLIGHT (Image 1)
    // =========================================================================
    if (tplId === 'docheight') {
      const hlColors = [
        { label: 'Highlighter Yellow', val: '#facc15' },
        { label: 'Cyan Focus', val: '#38bdf8' },
        { label: 'Neon Green', val: '#10b981' },
        { label: 'Magenta Pink', val: '#f43f5e' },
        { label: 'Amber Orange', val: '#fb923c' }
      ];

      const rawLines = Array.isArray(data.lines) ? data.lines : [
        { id: 1, text: data.line1 || '1. Intellectual property rights reserved.', mode: 'highlight' },
        { id: 2, text: data.line2 || '2. Total liability shall not exceed $10,000,000.', mode: 'highlight' },
        { id: 3, text: data.line3 || '3. Immediate termination upon breach of clause.', mode: 'normal' },
        { id: 4, text: 'The redaction must be respected under federal oversight mandate.', mode: 'redact' }
      ];

      const lines = rawLines.map((ln, idx) => {
        let m = ln.mode;
        if (!m) {
          if (ln.redacted || ln.isRedacted) m = 'redact';
          else if (ln.highlighted) m = 'highlight';
          else m = 'normal';
        }
        return {
          id: ln.id || (idx + 1),
          text: ln.text || '',
          mode: m,
          color: ln.color || (data.hlColor || '#facc15')
        };
      });

      const envTheme = data.envTheme || 'mahogany';

      container.innerHTML = `
        <div style="background: rgba(185, 28, 28, 0.06); border: 1px solid rgba(185, 28, 28, 0.3); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 12px;">
          
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 7px;">
              <span style="font-size: 15px;">📁</span>
              <div>
                <div style="font-size: 11px; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.8px;">CLASSIFIED DOSSIER ENGINE</div>
                <div style="font-size: 9px; color: #94a3b8;">High-Stakes Investigative Legal Document</div>
              </div>
            </div>
            <button type="button" id="dh-btn-add-line" style="font-size: 9.5px; font-weight: 800; color: #ef4444; cursor: pointer; padding: 3px 8px; border-radius: 5px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); display: flex; align-items: center; gap: 4px;">
              <span>+ Add Clause</span>
            </button>
          </div>

          <!-- SECTION 1: DOCUMENT METADATA & AGENCY HEADER -->
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">1. Legal Document Markings</span>
            
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Document Title</span>
              <input type="text" id="dh-input-title" value="${data.docTitle || 'CONFIDENTIAL AGREEMENT'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Agency Name</span>
                <input type="text" id="dh-input-agency" value="${data.agencyName || 'GOVERNMENT AGENCY'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 4px 6px; color: #fff; font-size: 10px; font-weight: 600;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Case Ref Code</span>
                <input type="text" id="dh-input-caseref" value="${data.caseRef || 'CASE FILE: #DOJ-8842-X'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 4px 6px; color: #cbd5e1; font-size: 9.5px; font-family: monospace;" />
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 5px 8px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.06);">
              <span style="font-size: 9px; color: #94a3b8;">Red Classification Header Pill</span>
              <input type="checkbox" id="dh-chk-classified-header" ${data.showClassifiedHeader !== false ? 'checked' : ''} style="accent-color: #ef4444; cursor: pointer;" />
            </div>
          </div>

          <!-- SECTION 2: OFFICIAL RED RUBBER STAMPS -->
          <div style="display: flex; flex-direction: column; gap: 7px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.5px;">2. Distressed Rubber Stamps</span>
            
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <!-- TOP SECRET STAMP -->
              <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(239,68,68,0.25); border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 10px; font-weight: 800; color: #ef4444; letter-spacing: 1px;">🗳️ TOP SECRET STAMP</span>
                  <input type="checkbox" id="dh-chk-stamp-topsecret" ${data.showTopSecretStamp !== false ? 'checked' : ''} style="accent-color: #ef4444; cursor: pointer;" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: center;">
                  <input type="text" id="dh-input-stamp-topsecret-text" value="${data.topSecretText || 'TOP SECRET'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #ef4444; font-size: 9.5px; font-weight: 800;" />
                  <div style="display: flex; align-items: center; gap: 4px;" title="Stamp Angle">
                    <span style="font-size: 8.5px; color: #94a3b8;">Angle:</span>
                    <input type="range" id="dh-range-stamp-topsecret-angle" min="-35" max="35" value="${data.topSecretAngle !== undefined ? data.topSecretAngle : 16}" style="width: 55px; accent-color: #ef4444; height: 3px;" />
                  </div>
                </div>
              </div>

              <!-- DECLASSIFIED STAMP -->
              <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(239,68,68,0.25); border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 10px; font-weight: 800; color: #f87171; letter-spacing: 1px;">🔓 DECLASSIFIED STAMP</span>
                  <input type="checkbox" id="dh-chk-stamp-declassified" ${data.showDeclassifiedStamp !== false ? 'checked' : ''} style="accent-color: #ef4444; cursor: pointer;" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: center;">
                  <input type="text" id="dh-input-stamp-declassified-text" value="${data.declassifiedText || 'DECLASSIFIED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #f87171; font-size: 9.5px; font-weight: 800;" />
                  <div style="display: flex; align-items: center; gap: 4px;" title="Stamp Angle">
                    <span style="font-size: 8.5px; color: #94a3b8;">Angle:</span>
                    <input type="range" id="dh-range-stamp-declass-angle" min="-35" max="35" value="${data.declassAngle !== undefined ? data.declassAngle : -10}" style="width: 55px; accent-color: #ef4444; height: 3px;" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 3: CLAUSES & INDEPENDENT REDACTION / HIGHLIGHT ENGINE -->
          <div style="display: flex; flex-direction: column; gap: 7px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">3. Clauses, Redactions &amp; Highlights</span>
              <span style="font-size: 8.5px; color: #94a3b8;">${lines.length} Clauses</span>
            </div>

            <div id="dh-lines-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto; padding-right: 2px;">
              ${lines.map((ln, idx) => `
                <div class="dh-line-card" data-idx="${idx}" style="background: rgba(0,0,0,0.45); border: 1px solid ${ln.mode === 'redact' ? '#ef4444' : (ln.mode === 'highlight' ? (data.hlColor || '#facc15') : 'rgba(255,255,255,0.08)')}; border-radius: 7px; padding: 7px 9px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                    <span style="font-size: 9px; font-weight: 800; font-family: monospace; color: #94a3b8;">CLAUSE #${idx + 1}</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <!-- 3-Way Mode Segmented Switch -->
                      <div style="display: flex; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 1px;">
                        <button type="button" class="dh-btn-mode-select" data-idx="${idx}" data-mode="normal" style="font-size: 8.5px; font-weight: 700; padding: 2px 5px; border: none; border-radius: 4px; cursor: pointer; ${ln.mode === 'normal' ? 'background: #334155; color: #fff;' : 'background: transparent; color: #64748b;'}">Normal</button>
                        <button type="button" class="dh-btn-mode-select" data-idx="${idx}" data-mode="highlight" style="font-size: 8.5px; font-weight: 700; padding: 2px 5px; border: none; border-radius: 4px; cursor: pointer; ${ln.mode === 'highlight' ? 'background: #facc15; color: #000;' : 'background: transparent; color: #eab308;'}">🖍️ Highlight</button>
                        <button type="button" class="dh-btn-mode-select" data-idx="${idx}" data-mode="redact" style="font-size: 8.5px; font-weight: 700; padding: 2px 5px; border: none; border-radius: 4px; cursor: pointer; ${ln.mode === 'redact' ? 'background: #dc2626; color: #fff;' : 'background: transparent; color: #ef4444;'}">⬛ Redact</button>
                      </div>
                      ${lines.length > 1 ? `<button type="button" class="dh-line-del" data-idx="${idx}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0 4px;" title="Delete this clause">✕</button>` : ''}
                    </div>
                  </div>
                  <input type="text" class="dh-line-input-text" data-idx="${idx}" value="${ln.text}" style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10.5px; font-family: 'Georgia', serif; outline: none;" placeholder="Contract clause text..." />
                </div>
              `).join('')}
            </div>

            <!-- Highlighter Color Dots -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 2px; background: rgba(0,0,0,0.25); padding: 5px 8px; border-radius: 5px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Highlighter Tint</span>
              <div style="display: flex; align-items: center; gap: 5px;">
                <input type="color" id="dh-input-color" value="${data.hlColor || '#facc15'}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" />
                <div style="display: flex; gap: 3px;">
                  ${hlColors.map(c => `
                    <button type="button" class="dh-color-dot" data-val="${c.val}" style="width: 15px; height: 15px; border-radius: 50%; background: ${c.val}; border: 1.5px solid ${c.val === (data.hlColor || '#facc15') ? '#fff' : 'rgba(255,255,255,0.2)'}; cursor: pointer;" title="${c.label}"></button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 4: TACTILE PAPER MATERIALITY & STACK DEPTH -->
          <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">4. Paper Materiality &amp; Stack Depth</span>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
                <input type="checkbox" id="dh-chk-paperclip" ${data.showPaperClip !== false ? 'checked' : ''} style="accent-color: #38bdf8;" />
                <span>📎 Silver Paper Clip</span>
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
                <input type="checkbox" id="dh-chk-manila" ${data.showManilaFolder !== false ? 'checked' : ''} style="accent-color: #eab308;" />
                <span>📁 Manila Dossier Tab</span>
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
                <input type="checkbox" id="dh-chk-stacked" ${data.showStackedPages !== false ? 'checked' : ''} style="accent-color: #facc15;" />
                <span>📑 Stacked Archives</span>
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
                <input type="checkbox" id="dh-chk-leather" ${data.showLeatherCase !== false ? 'checked' : ''} style="accent-color: #a855f7;" />
                <span>💼 Leather Portfolio</span>
              </label>
            </div>
          </div>

          <!-- SECTION 5: WORKSPACE & ATMOSPHERIC LIGHTING -->
          <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">5. Workspace &amp; Lighting Environment</span>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 8.5px; color: #94a3b8; text-transform: uppercase;">Desk Surface</span>
                <select id="dh-sel-env" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 4px; color: #fff; font-size: 9.5px;">
                  <option value="mahogany" ${envTheme === 'mahogany' ? 'selected' : ''}>🪵 Dark Mahogany Desk</option>
                  <option value="light-table" ${envTheme === 'light-table' ? 'selected' : ''}>💡 Tactical Light Table</option>
                  <option value="noir" ${envTheme === 'noir' ? 'selected' : ''}>🌑 Noir Bureau Desk</option>
                  <option value="slate" ${envTheme === 'slate' ? 'selected' : ''}>⬛ Modern Slate Console</option>
                </select>
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Spotlight Beam</span>
                  <span id="dh-val-spotlight">${Math.round((data.spotlightIntensity !== undefined ? data.spotlightIntensity : 0.85) * 100)}%</span>
                </div>
                <input type="range" id="dh-range-spotlight" min="20" max="150" value="${Math.round((data.spotlightIntensity !== undefined ? data.spotlightIntensity : 0.85) * 100)}" style="width: 100%; accent-color: #facc15; height: 3px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 2px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
                <input type="checkbox" id="dh-chk-godrays" ${data.volumetricRays !== false ? 'checked' : ''} style="accent-color: #fef08a;" />
                <span>Volumetric Rays</span>
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
                <input type="checkbox" id="dh-chk-dust" ${data.dustMotes !== false ? 'checked' : ''} style="accent-color: #facc15;" />
                <span>Floating Dust Motes</span>
              </label>
            </div>
          </div>

          <!-- SECTION 6: 3D CAMERA RIG & MOVEMENT -->
          <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #c084fc; text-transform: uppercase; letter-spacing: 0.5px;">6. 3D Camera Pan &amp; Tilt</span>
              <label style="display: flex; align-items: center; gap: 4px; font-size: 8.5px; color: #c084fc; cursor: pointer;">
                <input type="checkbox" id="dh-chk-drift" ${data.organicDrift !== false ? 'checked' : ''} style="accent-color: #c084fc;" />
                <span>Organic Drift</span>
              </label>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Pitch (X)</span>
                  <span id="dh-val-pitch">${data.cameraPitch !== undefined ? data.cameraPitch : 16}°</span>
                </div>
                <input type="range" id="dh-range-pitch" min="-30" max="45" value="${data.cameraPitch !== undefined ? data.cameraPitch : 16}" style="width: 100%; accent-color: #c084fc; height: 3px;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Yaw (Y)</span>
                  <span id="dh-val-yaw">${data.cameraYaw !== undefined ? data.cameraYaw : -12}°</span>
                </div>
                <input type="range" id="dh-range-yaw" min="-40" max="40" value="${data.cameraYaw !== undefined ? data.cameraYaw : -12}" style="width: 100%; accent-color: #c084fc; height: 3px;" />
              </div>
            </div>
          </div>

        </div>
      `;

      // Wire up all controls
      container.querySelector('#dh-input-title')?.addEventListener('input', e => {
        window.tplSetContextualData('docheight', { docTitle: e.target.value });
      });
      container.querySelector('#dh-input-agency')?.addEventListener('input', e => {
        window.tplSetContextualData('docheight', { agencyName: e.target.value });
      });
      container.querySelector('#dh-input-caseref')?.addEventListener('input', e => {
        window.tplSetContextualData('docheight', { caseRef: e.target.value });
      });
      container.querySelector('#dh-chk-classified-header')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { showClassifiedHeader: e.target.checked });
      });

      // Rubber Stamps
      container.querySelector('#dh-chk-stamp-topsecret')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { showTopSecretStamp: e.target.checked });
      });
      container.querySelector('#dh-input-stamp-topsecret-text')?.addEventListener('input', e => {
        window.tplSetContextualData('docheight', { topSecretText: e.target.value });
      });
      container.querySelector('#dh-range-stamp-topsecret-angle')?.addEventListener('input', e => {
        window.tplSetContextualData('docheight', { topSecretAngle: parseInt(e.target.value, 10) });
      });

      container.querySelector('#dh-chk-stamp-declassified')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { showDeclassifiedStamp: e.target.checked });
      });
      container.querySelector('#dh-input-stamp-declassified-text')?.addEventListener('input', e => {
        window.tplSetContextualData('docheight', { declassifiedText: e.target.value });
      });
      container.querySelector('#dh-range-stamp-declass-angle')?.addEventListener('input', e => {
        window.tplSetContextualData('docheight', { declassAngle: parseInt(e.target.value, 10) });
      });

      // Clauses line inputs and mode selectors
      container.querySelectorAll('.dh-line-input-text').forEach(inp => {
        inp.oninput = (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          lines[idx].text = e.target.value;
          window.tplSetContextualData('docheight', { lines: [...lines] });
        };
      });

      container.querySelectorAll('.dh-btn-mode-select').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const m = btn.dataset.mode;
          lines[idx].mode = m;
          window.tplSetContextualData('docheight', { lines: [...lines] });
          window.tplRenderContextualInspector('docheight');
        };
      });

      container.querySelectorAll('.dh-line-del').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx, 10);
          lines.splice(idx, 1);
          window.tplSetContextualData('docheight', { lines: [...lines] });
          window.tplRenderContextualInspector('docheight');
        };
      });

      container.querySelector('#dh-btn-add-line')?.addEventListener('click', () => {
        lines.push({
          id: Date.now(),
          text: `${lines.length + 1}. Newly verified classified stipulation clause.`,
          mode: 'highlight',
          color: data.hlColor || '#facc15'
        });
        window.tplSetContextualData('docheight', { lines: [...lines] });
        window.tplRenderContextualInspector('docheight');
      });

      const colInp = container.querySelector('#dh-input-color');
      if (colInp) {
        colInp.oninput = (e) => {
          window.tplSetContextualData('docheight', { hlColor: e.target.value });
        };
      }
      container.querySelectorAll('.dh-color-dot').forEach(dot => {
        dot.onclick = () => {
          const val = dot.dataset.val;
          if (colInp) colInp.value = val;
          window.tplSetContextualData('docheight', { hlColor: val });
        };
      });

      // Paper & Stack depth
      container.querySelector('#dh-chk-paperclip')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { showPaperClip: e.target.checked });
      });
      container.querySelector('#dh-chk-manila')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { showManilaFolder: e.target.checked });
      });
      container.querySelector('#dh-chk-stacked')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { showStackedPages: e.target.checked });
      });
      container.querySelector('#dh-chk-leather')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { showLeatherCase: e.target.checked });
      });

      // Lighting & Workspace
      container.querySelector('#dh-sel-env')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { envTheme: e.target.value });
      });
      container.querySelector('#dh-range-spotlight')?.addEventListener('input', e => {
        const val = parseInt(e.target.value, 10) / 100;
        const valEl = container.querySelector('#dh-val-spotlight');
        if (valEl) valEl.textContent = `${e.target.value}%`;
        window.tplSetContextualData('docheight', { spotlightIntensity: val });
      });
      container.querySelector('#dh-chk-godrays')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { volumetricRays: e.target.checked });
      });
      container.querySelector('#dh-chk-dust')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { dustMotes: e.target.checked });
      });

      // Camera
      container.querySelector('#dh-chk-drift')?.addEventListener('change', e => {
        window.tplSetContextualData('docheight', { organicDrift: e.target.checked });
      });
      container.querySelector('#dh-range-pitch')?.addEventListener('input', e => {
        const p = parseInt(e.target.value, 10);
        const valEl = container.querySelector('#dh-val-pitch');
        if (valEl) valEl.textContent = `${p}°`;
        window.tplSetContextualData('docheight', { cameraPitch: p });
      });
      container.querySelector('#dh-range-yaw')?.addEventListener('input', e => {
        const y = parseInt(e.target.value, 10);
        const valEl = container.querySelector('#dh-val-yaw');
        if (valEl) valEl.textContent = `${y}°`;
        window.tplSetContextualData('docheight', { cameraYaw: y });
      });

      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: EMPIRE RISE & FALL TIMELINE (empire-timeline)
    // James Jani / Magnates Media Documentary Visuals, Hairline, Milestones
    // =========================================================================
    if (tplId === 'empire-timeline') {
      if (stdLayers) stdLayers.style.display = 'none';
      const aiWrapEl = document.getElementById('tpl-modal-wrap-ai-engine');
      if (aiWrapEl) aiWrapEl.style.display = 'none';
      const atmoWrapEl = document.getElementById('tpl-modal-wrap-atmosphere');
      if (atmoWrapEl) atmoWrapEl.style.display = 'none';
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';

      const presets = [
        {
          label: '\u26a1 Enron: The Smartest Guys in the Room (1985 \u2014 2001)',
          title: 'THE RISE & FALL OF ENRON',
          subtitle: 'CORPORATE VALUATION & LIQUIDITY CRASH \u00b7 1985 \u2014 2001',
          theme: 'james-jani',
          peakValuation: '$1.5B',
          milestones: [
            { label: 'FOUNDED', date: '1985', value: '$10M', desc: 'Houston Natural Gas Merger', color: '#10b981', x: 80, y: 315 },
            { label: 'WALL ST DARLING', date: '1995', value: '$320M', desc: 'Mark-to-Market Model', color: '#38bdf8', x: 230, y: 225 },
            { label: 'PEAK EMPIRE', date: '2000', value: '$1.5B', desc: 'Fortune #1 Innovator', color: '#f59e0b', x: 380, y: 95 },
            { label: 'WHISTLEBLOWER', date: 'AUG 2001', value: '$480M', desc: 'SEC Inquiry & Debt', color: '#fb923c', x: 525, y: 235 },
            { label: 'BANKRUPTCY', date: 'DEC 2001', value: '$0', desc: 'Chapter 11 Liquidation', color: '#ef4444', x: 645, y: 340 }
          ]
        },
        {
          label: '\ud83c\udfe2 WeWork: The $47 Billion Mirage (2010 \u2014 2023)',
          title: 'WEWORK: RISE & COLLAPSE',
          subtitle: 'SOFTBANK HYPER-VALUATION TO PENNY STOCK \u00b7 2010 \u2014 2023',
          theme: 'magnates-gold',
          peakValuation: '$47B',
          milestones: [
            { label: 'FIRST LOCATION', date: '2010', value: '$1M', desc: 'SoHo NYC Launch', color: '#10b981', x: 80, y: 320 },
            { label: 'SOFTBANK VISION', date: '2017', value: '$20B', desc: 'Global Expansion Blitz', color: '#38bdf8', x: 225, y: 200 },
            { label: 'PEAK EVALUATION', date: 'JAN 2019', value: '$47B', desc: 'The World\u2019s #1 Unicorn', color: '#f59e0b', x: 380, y: 90 },
            { label: 'PULLED S-1 IPO', date: 'SEP 2019', value: '$8B', desc: 'Neumann Ouster', color: '#fb923c', x: 525, y: 240 },
            { label: 'CHAPTER 11', date: 'NOV 2023', value: '$45M', desc: 'Unprofitable Leases', color: '#ef4444', x: 645, y: 345 }
          ]
        },
        {
          label: '\ud83e\ude78 Theranos: The Silicon Valley Lie (2003 \u2014 2018)',
          title: 'THE THERANOS DECEPTION',
          subtitle: 'EDISON MACHINE MIRAGE TO WIRE FRAUD \u00b7 2003 \u2014 2018',
          theme: 'crimson-noir',
          peakValuation: '$9.0B',
          milestones: [
            { label: 'STANFORD DROPOUT', date: '2003', value: '$5M', desc: 'Micro-fluidics Dream', color: '#10b981', x: 80, y: 320 },
            { label: 'WALGREENS DEAL', date: '2013', value: '$1.0B', desc: 'Wellness Center Clinics', color: '#38bdf8', x: 230, y: 210 },
            { label: 'PEAK VALUATION', date: '2014', value: '$9.0B', desc: 'Cover of Forbes & Fortune', color: '#f59e0b', x: 380, y: 95 },
            { label: 'WSJ EXPOS\u00c9', date: 'OCT 2015', value: '$800M', desc: 'John Carreyrou Bombshell', color: '#fb923c', x: 525, y: 240 },
            { label: 'CRIMINAL CHARGES', date: '2018', value: '$0', desc: 'Company Dissolved', color: '#ef4444', x: 645, y: 345 }
          ]
        },
        {
          label: '\ud83d\udcc9 Dot-Com Crash: Pets.com (1998 \u2014 2000)',
          title: 'PETS.COM: SUPER BOWL TO BUST',
          subtitle: 'NASDAQ SPECULATION TO 268-DAY COLLAPSE \u00b7 1998 \u2014 2000',
          theme: 'bloomberg-cyan',
          peakValuation: '$300M',
          milestones: [
            { label: 'INCEPTION', date: 'AUG 1998', value: '$500K', desc: 'Domain Registered', color: '#10b981', x: 80, y: 315 },
            { label: 'SUPER BOWL AD', date: 'JAN 2000', value: '$82M', desc: '$11M Marketing Blitz', color: '#38bdf8', x: 230, y: 215 },
            { label: 'NASDAQ IPO', date: 'FEB 2000', value: '$300M', desc: 'Priced at $11/Share', color: '#2effc6', x: 380, y: 100 },
            { label: 'CASH RUNWAY LOW', date: 'JUL 2000', value: '$45M', desc: 'High Customer Burn', color: '#fb923c', x: 525, y: 250 },
            { label: 'LIQUIDATION', date: 'NOV 2000', value: '$0.19', desc: '268 Days After IPO', color: '#ef4444', x: 645, y: 345 }
          ]
        }
      ];

      const themesList = [
        { id: 'james-jani', label: 'James Jani Noir (Emerald \u2192 Gold \u2192 Crimson)' },
        { id: 'magnates-gold', label: 'Magnates Media Gold (Obsidian & Amber)' },
        { id: 'bloomberg-cyan', label: 'Bloomberg Terminal (Cyan & Mint)' },
        { id: 'crimson-noir', label: 'Crimson Noir (Rose & Blood Red)' }
      ];

      const is3D = !!data.is3DMode;
      const cameraPitch = typeof data.cameraPitch === 'number' ? data.cameraPitch : 26;
      const cameraYaw = typeof data.cameraYaw === 'number' ? data.cameraYaw : -14;

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(56,189,248,0.32); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <!-- Header with Video / 3D Segmented Switcher (Matching Article & Document Highlighter) -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 10.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.6px; display: flex; align-items: center; gap: 4px;">
                <span>\ud83d\udcc9</span> Timeline Engine
              </span>
              <!-- Video / 3D Mode Switcher -->
              <div id="tm-mode-switcher-wrap" style="display: flex; gap: 2px; background: rgba(18,19,28,0.9); padding: 2px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12);">
                <button type="button" id="btn-tm-mode-video" style="padding: 2.5px 9px; font-size: 10px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${!is3D ? 'rgba(168,85,247,0.35)' : 'transparent'}; color: ${!is3D ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="Flat Video Playback View">\u25b6 Video</button>
                <button type="button" id="btn-tm-mode-3d" style="padding: 2.5px 9px; font-size: 10px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: ${is3D ? 'rgba(168,85,247,0.35)' : 'transparent'}; color: ${is3D ? '#fff' : '#94a3b8'}; transition: all 0.2s;" title="Cinematic 3D Depth & Orbit View">\u2b21 3D</button>
              </div>
            </div>
            <span style="font-size: 9px; color: ${is3D ? '#2effc6' : '#f59e0b'}; font-weight: 800; background: ${is3D ? 'rgba(46,255,198,0.15)' : 'rgba(245,158,11,0.15)'}; border: 1px solid ${is3D ? 'rgba(46,255,198,0.35)' : 'rgba(245,158,11,0.35)'}; padding: 2px 6px; border-radius: 4px;">
              ${is3D ? '\u2b21 3D ACTIVE' : 'JAMES JANI'}
            </span>
          </div>

          <!-- 3D Camera Controls (Shown in 3D Mode) -->
          ${is3D ? `
          <div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.32); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 7px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">\ud83c\udfa5 3D Camera & Orbit Angle</span>
              <span style="font-size: 8.5px; font-family: monospace; color: #2effc6; font-weight: 700;">DRAG CANVAS TO TILT</span>
            </div>

            <!-- 3D Angle Presets -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
              <button type="button" class="tm-3d-preset-btn" data-pitch="26" data-yaw="-14" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Cinematic</button>
              <button type="button" class="tm-3d-preset-btn" data-pitch="38" data-yaw="-24" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Isometric</button>
              <button type="button" class="tm-3d-preset-btn" data-pitch="45" data-yaw="-8" style="padding: 4px 5px; font-size: 9px; font-weight: 700; border-radius: 5px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.4); color: #cbd5e1; cursor: pointer;">Dramatic</button>
            </div>

            <!-- Pitch / Tilt Slider -->
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
                <span>TILT PITCH</span>
                <span id="tm-val-pitch" style="font-family: monospace; color: #2effc6; font-weight: 700;">${cameraPitch}\u00b0</span>
              </div>
              <input type="range" id="tm-slider-pitch" min="0" max="60" value="${cameraPitch}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
            </div>

            <!-- Yaw / Angle Slider -->
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8;">
                <span>ROTATION YAW</span>
                <span id="tm-val-yaw" style="font-family: monospace; color: #2effc6; font-weight: 700;">${cameraYaw}\u00b0</span>
              </div>
              <input type="range" id="tm-slider-yaw" min="-45" max="45" value="${cameraYaw}" style="accent-color: #a855f7; height: 3px; cursor: pointer;" />
            </div>
          </div>
          ` : ''}

          <!-- Quick Documentary Presets -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Documentary Preset</span>
            <select id="tm-preset-select" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none; cursor: pointer;">
              <option value="" style="background:#0f172a;color:#94a3b8;">\u2014 Select Mini-Doc Story Preset \u2014</option>
              ${presets.map((p, i) => `<option value="${i}" style="background:#0f172a;color:#fff;">${p.label}</option>`).join('')}
            </select>
          </div>

          <!-- Title & Subtitle Inputs -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Header Title</span>
              <input type="text" id="tm-inp-title" value="${data.title || 'THE RISE & FALL OF ENRON'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Subtitle Telemetry</span>
              <input type="text" id="tm-inp-sub" value="${data.subtitle || 'CORPORATE VALUATION & LIQUIDITY CRASH \u00b7 1985 \u2014 2001'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #38bdf8; font-family: monospace; font-size: 10px; outline: none;" />
            </div>
          </div>

          <!-- Visual Theme Selector -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Documentary Palette</span>
            <select id="tm-theme-select" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;">
              ${themesList.map(t => `<option value="${t.id}" ${data.theme === t.id ? 'selected' : ''} style="background:#0f172a;color:#fff;">${t.label}</option>`).join('')}
            </select>
          </div>

          <!-- Hairline Stroke Precision & Area Glow -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 7px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase;">Curve Hairline Thickness</span>
              <span id="tm-lbl-hairline" style="font-size: 9.5px; font-family: monospace; color: #38bdf8; font-weight: 700;">${data.hairline || 1.2}px</span>
            </div>
            <input type="range" id="tm-slider-hairline" min="0.7" max="2.8" step="0.1" value="${data.hairline || 1.2}" style="accent-color: #38bdf8; height: 3px; cursor: pointer;" />

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.06);">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="tm-chk-grid" ${data.showGrid !== false ? 'checked' : ''} style="accent-color: #38bdf8;" />
                <span>Coordinate Grid</span>
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="tm-chk-fill" ${data.showAreaFill !== false ? 'checked' : ''} style="accent-color: #38bdf8;" />
                <span>Under-Curve Glow Fill</span>
              </label>
            </div>
          </div>

          <!-- Milestones Builder -->
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">Milestones &amp; Narrative Arcs</span>
              <button type="button" id="tm-btn-add-node" style="background: rgba(56,189,248,0.18); border: 1px solid rgba(56,189,248,0.4); color: #38bdf8; border-radius: 4px; padding: 2px 7px; font-size: 9.5px; font-weight: 700; cursor: pointer;">+ Add Node</button>
            </div>

            <div id="tm-milestones-list" style="display: flex; flex-direction: column; gap: 6px; max-height: 250px; overflow-y: auto; padding-right: 2px;">
              ${milestones.map((m, idx) => `
                <div class="tm-milestone-row" data-idx="${idx}" style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid ${m.color || '#38bdf8'}; border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 5px;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="font-size: 9px; font-family: monospace; font-weight: 800; color: #94a3b8;">NODE #${idx + 1}</span>
                      <input type="color" class="tm-node-color" data-idx="${idx}" value="${m.color || '#38bdf8'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Milestone Color" />
                    </div>
                    ${milestones.length > 2 ? `<button type="button" class="tm-node-del" data-idx="${idx}" style="background: none; border: none; color: #f87171; font-size: 11px; font-weight: 800; cursor: pointer;">\u2715</button>` : ''}
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                    <input type="text" class="tm-node-label" data-idx="${idx}" value="${m.label}" placeholder="Milestone Name" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #fff; font-size: 10px; font-weight: 700; outline: none;" />
                    <input type="text" class="tm-node-val" data-idx="${idx}" value="${m.value}" placeholder="Valuation ($)" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: ${m.color || '#38bdf8'}; font-family: monospace; font-size: 10px; font-weight: 700; outline: none;" />
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 4px;">
                    <input type="text" class="tm-node-date" data-idx="${idx}" value="${m.date}" placeholder="Year / Date" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #cbd5e1; font-family: monospace; font-size: 9.5px; outline: none;" />
                    <input type="text" class="tm-node-desc" data-idx="${idx}" value="${m.desc || ''}" placeholder="Narrative note..." style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #94a3b8; font-size: 9.5px; outline: none;" />
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Sync stage top-left Video / 3D buttons as well
      const syncStage3DMode = (mode3d) => {
        const pVid = document.getElementById('btn-paper-rip-mode-video');
        const p3D = document.getElementById('btn-paper-rip-mode-3d');
        if (pVid && p3D) {
          pVid.style.background = !mode3d ? 'rgba(168,85,247,.35)' : 'transparent';
          pVid.style.color = !mode3d ? '#fff' : '#94a3b8';
          p3D.style.background = mode3d ? 'rgba(168,85,247,.35)' : 'transparent';
          p3D.style.color = mode3d ? '#fff' : '#94a3b8';
        }
        if (typeof topCustomizerState !== 'undefined') {
          topCustomizerState.is3DMode = mode3d;
          topCustomizerState.paperPreviewMode = mode3d ? '3d' : 'video';
          const btnToggle3D = document.getElementById('btn-toggle-3d-interactive-mode');
          if (btnToggle3D) {
            btnToggle3D.style.background = mode3d ? 'rgba(46,255,198,0.25)' : 'rgba(168,85,247,0.15)';
            btnToggle3D.style.borderColor = mode3d ? '#2effc6' : 'rgba(168,85,247,0.5)';
            btnToggle3D.style.color = mode3d ? '#2effc6' : '#c084fc';
            const dot = document.getElementById('pill-3d-dot');
            if (dot) {
              dot.style.background = mode3d ? '#2effc6' : '#a855f7';
              dot.style.boxShadow = mode3d ? '0 0 10px #2effc6' : '0 0 8px #a855f7';
            }
            const lbl = document.getElementById('label-3d-mode');
            if (lbl) lbl.textContent = mode3d ? '3D MODE: ON (CLICK TO SELECT)' : '3D EDIT MODE';
          }
        }
      };

      const btnModeVid = container.querySelector('#btn-tm-mode-video');
      if (btnModeVid) {
        btnModeVid.onclick = () => {
          window.tplSetContextualData('empire-timeline', { is3DMode: false });
          syncStage3DMode(false);
          window.tplRenderContextualInspector('empire-timeline');
        };
      }
      const btnMode3D = container.querySelector('#btn-tm-mode-3d');
      if (btnMode3D) {
        btnMode3D.onclick = () => {
          window.tplSetContextualData('empire-timeline', { is3DMode: true });
          syncStage3DMode(true);
          window.tplRenderContextualInspector('empire-timeline');
        };
      }

      // 3D Angle Presets and Sliders
      container.querySelectorAll('.tm-3d-preset-btn').forEach(btn => {
        btn.onclick = () => {
          const p = parseInt(btn.dataset.pitch, 10);
          const y = parseInt(btn.dataset.yaw, 10);
          window.tplSetContextualData('empire-timeline', { cameraPitch: p, cameraYaw: y });
          window.tplRenderContextualInspector('empire-timeline');
        };
      });

      const sPitch = container.querySelector('#tm-slider-pitch');
      if (sPitch) {
        sPitch.oninput = (e) => {
          const v = parseInt(e.target.value, 10);
          const valEl = container.querySelector('#tm-val-pitch');
          if (valEl) valEl.textContent = `${v}\u00b0`;
          const plane = document.getElementById('tm-3d-stage-plane');
          const yaw = data.cameraYaw ?? -14;
          if (plane) plane.style.transform = `rotateX(${v}deg) rotateY(${yaw}deg) scale(0.92)`;
          window.tplSetContextualData('empire-timeline', { cameraPitch: v });
        };
      }
      const sYaw = container.querySelector('#tm-slider-yaw');
      if (sYaw) {
        sYaw.oninput = (e) => {
          const v = parseInt(e.target.value, 10);
          const valEl = container.querySelector('#tm-val-yaw');
          if (valEl) valEl.textContent = `${v}\u00b0`;
          const plane = document.getElementById('tm-3d-stage-plane');
          const pitch = data.cameraPitch ?? 26;
          if (plane) plane.style.transform = `rotateX(${pitch}deg) rotateY(${v}deg) scale(0.92)`;
          window.tplSetContextualData('empire-timeline', { cameraYaw: v });
        };
      }

      // Stage interactive 3D drag-to-orbit
      const viewport = document.querySelector('.tpl-empire-timeline.timeline-viewport');
      if (viewport && is3D) {
        let isOrbiting = false;
        let startX = 0;
        let startY = 0;
        let initPitch = data.cameraPitch ?? 26;
        let initYaw = data.cameraYaw ?? -14;

        viewport.onpointerdown = (e) => {
          if (e.target.closest('button, input, select, a')) return;
          isOrbiting = true;
          startX = e.clientX;
          startY = e.clientY;
          initPitch = data.cameraPitch ?? 26;
          initYaw = data.cameraYaw ?? -14;
          viewport.setPointerCapture(e.pointerId);
          viewport.style.cursor = 'grabbing';
        };

        viewport.onpointermove = (e) => {
          if (!isOrbiting) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          const newPitch = Math.max(0, Math.min(65, Math.round(initPitch - dy * 0.25)));
          const newYaw = Math.max(-50, Math.min(50, Math.round(initYaw + dx * 0.25)));
          const plane = document.getElementById('tm-3d-stage-plane');
          if (plane) plane.style.transform = `rotateX(${newPitch}deg) rotateY(${newYaw}deg) scale(0.92)`;
          const vp = container.querySelector('#tm-val-pitch');
          const vy = container.querySelector('#tm-val-yaw');
          if (vp) vp.textContent = `${newPitch}\u00b0`;
          if (vy) vy.textContent = `${newYaw}\u00b0`;
          const sp = container.querySelector('#tm-slider-pitch');
          const sy = container.querySelector('#tm-slider-yaw');
          if (sp) sp.value = newPitch;
          if (sy) sy.value = newYaw;
          data.cameraPitch = newPitch;
          data.cameraYaw = newYaw;
        };

        const stopOrbit = (e) => {
          if (!isOrbiting) return;
          isOrbiting = false;
          viewport.style.cursor = 'default';
          try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}
          window.tplSetContextualData('empire-timeline', { cameraPitch: data.cameraPitch, cameraYaw: data.cameraYaw });
        };
        viewport.onpointerup = stopOrbit;
        viewport.onpointercancel = stopOrbit;
      }

      // Wire preset select
      const presetSel = container.querySelector('#tm-preset-select');
      if (presetSel) {
        presetSel.onchange = (e) => {
          const p = presets[parseInt(e.target.value, 10)];
          if (p) {
            window.tplSetContextualData('empire-timeline', {
              title: p.title,
              subtitle: p.subtitle,
              theme: p.theme,
              peakValuation: p.peakValuation,
              milestones: p.milestones.map(m => Object.assign({}, m))
            });
            window.tplRenderContextualInspector('empire-timeline');
          }
        };
      }

      const inpTitle = container.querySelector('#tm-inp-title');
      if (inpTitle) inpTitle.oninput = (e) => window.tplSetContextualData('empire-timeline', { title: e.target.value });
      const inpSub = container.querySelector('#tm-inp-sub');
      if (inpSub) inpSub.oninput = (e) => window.tplSetContextualData('empire-timeline', { subtitle: e.target.value });

      const themeSel = container.querySelector('#tm-theme-select');
      if (themeSel) themeSel.onchange = (e) => window.tplSetContextualData('empire-timeline', { theme: e.target.value });

      const sliderHairline = container.querySelector('#tm-slider-hairline');
      const lblHairline = container.querySelector('#tm-lbl-hairline');
      if (sliderHairline) {
        sliderHairline.oninput = (e) => {
          const v = parseFloat(e.target.value);
          if (lblHairline) lblHairline.textContent = `${v.toFixed(1)}px`;
          window.tplSetContextualData('empire-timeline', { hairline: v });
        };
      }

      const chkGrid = container.querySelector('#tm-chk-grid');
      if (chkGrid) chkGrid.onchange = (e) => window.tplSetContextualData('empire-timeline', { showGrid: e.target.checked });
      const chkFill = container.querySelector('#tm-chk-fill');
      if (chkFill) chkFill.onchange = (e) => window.tplSetContextualData('empire-timeline', { showAreaFill: e.target.checked });

      const syncNodeChange = (idx, field, val) => {
        const ms = milestones.map(m => Object.assign({}, m));
        if (!ms[idx]) return;
        ms[idx][field] = val;
        window.tplSetContextualData('empire-timeline', { milestones: ms });
      };

      container.querySelectorAll('.tm-node-label').forEach(inp => {
        inp.oninput = (e) => syncNodeChange(parseInt(inp.dataset.idx, 10), 'label', e.target.value);
      });
      container.querySelectorAll('.tm-node-val').forEach(inp => {
        inp.oninput = (e) => syncNodeChange(parseInt(inp.dataset.idx, 10), 'value', e.target.value);
      });
      container.querySelectorAll('.tm-node-date').forEach(inp => {
        inp.oninput = (e) => syncNodeChange(parseInt(inp.dataset.idx, 10), 'date', e.target.value);
      });
      container.querySelectorAll('.tm-node-desc').forEach(inp => {
        inp.oninput = (e) => syncNodeChange(parseInt(inp.dataset.idx, 10), 'desc', e.target.value);
      });
      container.querySelectorAll('.tm-node-color').forEach(inp => {
        inp.oninput = (e) => {
          syncNodeChange(parseInt(inp.dataset.idx, 10), 'color', e.target.value);
          window.tplRenderContextualInspector('empire-timeline');
        };
      });
      container.querySelectorAll('.tm-node-del').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const ms = milestones.filter((_, i) => i !== idx);
          const count = ms.length;
          ms.forEach((m, i) => {
            m.x = Math.round(80 + (i / Math.max(1, count - 1)) * 565);
          });
          window.tplSetContextualData('empire-timeline', { milestones: ms });
          window.tplRenderContextualInspector('empire-timeline');
        };
      });

      const btnAdd = container.querySelector('#tm-btn-add-node');
      if (btnAdd) {
        btnAdd.onclick = () => {
          const ms = milestones.map(m => Object.assign({}, m));
          const newIdx = ms.length;
          ms.push({
            label: `NEW MILESTONE`,
            date: `YEAR ${newIdx + 1}`,
            value: `$500M`,
            desc: `Key turning point`,
            color: '#38bdf8',
            x: 500,
            y: 200
          });
          const count = ms.length;
          ms.forEach((m, i) => {
            m.x = Math.round(80 + (i / Math.max(1, count - 1)) * 565);
          });
          window.tplSetContextualData('empire-timeline', { milestones: ms });
          window.tplRenderContextualInspector('empire-timeline');
        };
      }
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: INVESTIGATIVE GLOBE & TACTICAL MAP (map)
    // Granular World Map + Multi-Route Country-to-Country Transit + 3D Video Switch + Direct On-Screen Tracing
    // =========================================================================
    if (tplId === 'map') {
      // Hide irrelevant generic Subject Cutout / AI Parallax sections so Cartography & Routes sit right at the top
      if (stdLayers) stdLayers.style.display = 'none';
      const aiWrapEl = document.getElementById('tpl-modal-wrap-ai-engine');
      if (aiWrapEl) aiWrapEl.style.display = 'none';
      const atmoWrapEl = document.getElementById('tpl-modal-wrap-atmosphere');
      if (atmoWrapEl) atmoWrapEl.style.display = 'none';

      const routePresets = [
        {
          label: '\ud83c\uddfa\ud83c\uddf8 USA \u2192 \ud83c\udde8\ud83c\udde6 Canada (Cross-Border Flight)',
          routes: [
            { from: 'USA', to: 'Canada', fromLat: 39.8, fromLng: -98.5, toLat: 56.13, toLng: -106.35, mode: 'plane', color: '#38bdf8' }
          ]
        },
        {
          label: '\ud83c\uddfa\ud83c\uddf8 USA \u2192 \ud83c\uddec\ud83c\udde7 UK \u2192 \ud83c\uddfa\ud83c\udde6 Ukraine (Multi-Vector Transit)',
          routes: [
            { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 51.50, toLng: -0.12, mode: 'plane', color: '#38bdf8' },
            { from: 'UK', to: 'Ukraine', fromLat: 51.50, fromLng: -0.12, toLat: 48.37, toLng: 31.16, mode: 'plane', color: '#38bdf8' }
          ]
        },
        {
          label: '\ud83c\udde8\ud83c\uddf3 China \u2192 \ud83c\uddf8\ud83c\uddec Singapore \u2192 \ud83c\udde6\ud83c\uddea UAE \u2192 \ud83c\uddea\ud83c\uddec Egypt (Maritime Trade)',
          routes: [
            { from: 'China', to: 'Singapore', fromLat: 35.86, fromLng: 104.2, toLat: 1.35, toLng: 103.82, mode: 'ship', color: '#2effc6' },
            { from: 'Singapore', to: 'UAE', fromLat: 1.35, fromLng: 103.82, toLat: 23.42, toLng: 53.85, mode: 'ship', color: '#38bdf8' },
            { from: 'UAE', to: 'Egypt', fromLat: 23.42, fromLng: 53.85, toLat: 26.82, toLng: 30.80, mode: 'ship', color: '#f59e0b' }
          ]
        },
        {
          label: '\ud83c\uddef\ud83c\uddf5 Japan \u2192 \ud83c\uddf0\ud83c\uddf7 South Korea \u2192 \ud83c\uddf8\ud83c\uddec Singapore \u2192 \ud83c\udde6\ud83c\uddfa Australia',
          routes: [
            { from: 'Japan', to: 'South Korea', fromLat: 36.2, fromLng: 138.25, toLat: 35.91, toLng: 127.77, mode: 'plane', color: '#38bdf8' },
            { from: 'South Korea', to: 'Singapore', fromLat: 35.91, fromLng: 127.77, toLat: 1.35, toLng: 103.82, mode: 'plane', color: '#a855f7' },
            { from: 'Singapore', to: 'Australia', fromLat: 1.35, fromLng: 103.82, toLat: -25.27, toLng: 133.78, mode: 'plane', color: '#2effc6' }
          ]
        },
        {
          label: '\ud83c\uddec\ud83c\udde7 UK \u2192 \ud83c\uddeb\ud83c\uddf7 France \u2192 \ud83c\udde8\ud83c\udded Switzerland \u2192 \ud83c\uddee\ud83c\uddf9 Italy (Euro High-Speed Rail)',
          routes: [
            { from: 'UK', to: 'France', fromLat: 54.0, fromLng: -2.0, toLat: 46.23, toLng: 2.21, mode: 'train', color: '#38bdf8' },
            { from: 'France', to: 'Switzerland', fromLat: 46.23, fromLng: 2.21, toLat: 46.82, toLng: 8.23, mode: 'train', color: '#2effc6' },
            { from: 'Switzerland', to: 'Italy', fromLat: 46.82, fromLng: 8.23, toLat: 41.87, toLng: 12.57, mode: 'train', color: '#f59e0b' }
          ]
        }
      ];

      const mapStyles = [
        { id: 'harris-dark', label: 'Johnny Harris Dark' },
        { id: 'satellite', label: 'Satellite Blue' },
        { id: 'vox-archival', label: 'Vox Archival Paper' },
        { id: 'radar-amber', label: 'Pentagon Radar' }
      ];

      const activeRoutes = Array.isArray(data.routes) && data.routes.length > 0 ? data.routes : [
        { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 54.0, toLng: -2.0, mode: 'plane', color: '#38bdf8' }
      ];
      const is3D = !!data.is3DMode;
      const isDraw = !!data.drawOnScreenMode;

      container.innerHTML = `
        <datalist id="map-geo-datalist">
          ${WORLD_GEO_DB.map(g => `<option value="${g.name}"></option>`).join('')}
        </datalist>

        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(56,189,248,0.32); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.6px;">\ud83c\udf0d Multi-Route Globe & Transit Rig</span>
            <span style="font-size: 9px; color: #2effc6; font-weight: 800; background: rgba(46,255,198,0.14); border: 1px solid rgba(46,255,198,0.35); padding: 2px 6px; border-radius: 4px;">${WORLD_GEO_DB.length}+ COUNTRIES</span>
          </div>

          <!-- \u25b6 VIDEO vs \u2b21 3D INTERACTIVE SWITCH + DIRECT ON-SCREEN TRACE -->
          <div style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.35); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">Stage Mode (Video / 3D Interactive)</span>
              <span style="font-size: 8.5px; font-family: monospace; color: ${is3D ? '#2effc6' : '#38bdf8'}; font-weight: 700;">${is3D ? '\u2b21 3D ACTIVE' : '\u25b6 AUTO VIDEO'}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button type="button" id="map-btn-mode-video" style="padding: 6px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 800; cursor: pointer; border: 1px solid ${!is3D ? '#38bdf8' : 'rgba(255,255,255,0.12)'}; background: ${!is3D ? 'rgba(56,189,248,0.25)' : 'rgba(0,0,0,0.4)'}; color: #fff;">\u25b6 Video Mode</button>
              <button type="button" id="map-btn-mode-3d" style="padding: 6px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 800; cursor: pointer; border: 1px solid ${is3D ? '#a855f7' : 'rgba(255,255,245,0.12)'}; background: ${is3D ? 'rgba(168,85,247,0.32)' : 'rgba(0,0,0,0.4)'}; color: #fff;">\u2b21 3D Interactive</button>
            </div>
            <button type="button" id="map-btn-draw-screen" style="width: 100%; padding: 6px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; cursor: pointer; border: 1px solid ${isDraw ? '#2effc6' : 'rgba(46,255,198,0.35)'}; background: ${isDraw ? 'rgba(46,255,198,0.24)' : 'rgba(46,255,198,0.08)'}; color: ${isDraw ? '#2effc6' : '#cbd5e1'}; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>\u270f\ufe0f</span> ${isDraw ? 'Tracing on Screen Active (Click or Drag on Map!)' : 'Trace Route Directly on Screen (3D Draw)'}
            </button>
          </div>

          <!-- Projection Mode Toggle: 3D Globe vs 2D Granular World Map -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" class="map-proj-btn" data-proj="globe" style="padding: 6px; border-radius: 6px; font-size: 10.5px; font-weight: 700; cursor: pointer; border: 1px solid ${(data.projection || 'globe') === 'globe' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${(data.projection || 'globe') === 'globe' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.35)'}; color: #fff;">\ud83c\udf10 3D Globe</button>
            <button type="button" class="map-proj-btn" data-proj="flat" style="padding: 6px; border-radius: 6px; font-size: 10.5px; font-weight: 700; cursor: pointer; border: 1px solid ${data.projection === 'flat' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${data.projection === 'flat' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.35)'}; color: #fff;">\ud83d\uddfa\ufe0f 2D Granular Map</button>
          </div>

          <!-- MULTI-ROUTE COUNTRY-TO-COUNTRY BUILDER -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; padding: 9px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">\u2708\ufe0f\ud83d\udea2\ud83d\ude86 Country-to-Country Routes</span>
              <button type="button" id="map-btn-add-route" style="background: rgba(46,255,198,0.16); border: 1px solid rgba(46,255,198,0.45); color: #2effc6; border-radius: 5px; padding: 2px 8px; font-size: 9.5px; font-weight: 800; cursor: pointer;">+ Add Route Leg</button>
            </div>
            <div style="font-size: 9px; color: #94a3b8; line-height: 1.35;">Type any country or city (e.g. <strong>USA</strong> to <strong>Canada</strong>, <strong>UK</strong> to <strong>Japan</strong>) and pick a transit vehicle.</div>

            <!-- Quick Multi-Route Presets -->
            <select id="map-route-preset-select" style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 7px; color: #cbd5e1; font-size: 10px; font-weight: 600; outline: none; cursor: pointer;">
              <option value="">\u26a1 Load Multi-Route Preset...</option>
              ${routePresets.map((rp, i) => `<option value="${i}">${rp.label}</option>`).join('')}
            </select>

            <!-- Dynamic Route Legs List -->
            <div id="map-routes-list" style="display: flex; flex-direction: column; gap: 7px; max-height: 230px; overflow-y: auto; padding-right: 2px;">
              ${activeRoutes.map((rt, idx) => `
                <div class="map-route-row" data-idx="${idx}" style="background: rgba(15,23,42,0.75); border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid ${rt.color || '#38bdf8'}; border-radius: 6px; padding: 7px; display: flex; flex-direction: column; gap: 5px;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 9px; font-weight: 800; color: #94a3b8; font-family: monospace;">ROUTE LEG #${idx + 1}</span>
                    <div style="display: flex; align-items: center; gap: 5px;">
                      <select class="map-rt-mode" data-idx="${idx}" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.18); border-radius: 4px; color: #fff; font-size: 9.5px; font-weight: 700; padding: 2px 4px; cursor: pointer;">
                        <option value="plane" ${(rt.mode || 'plane') === 'plane' ? 'selected' : ''}>\u2708\ufe0f Plane</option>
                        <option value="ship" ${rt.mode === 'ship' ? 'selected' : ''}>\ud83d\udea2 Ship</option>
                        <option value="train" ${rt.mode === 'train' ? 'selected' : ''}>\ud83d\ude86 Train</option>
                        <option value="line" ${rt.mode === 'line' ? 'selected' : ''}>\u26a1 Line</option>
                      </select>
                      <input type="color" class="map-rt-color" data-idx="${idx}" value="${rt.color || '#38bdf8'}" style="width: 18px; height: 18px; border: none; background: transparent; cursor: pointer;" title="Route Arc Color"/>
                      ${activeRoutes.length > 1 ? `<button type="button" class="map-rt-del" data-idx="${idx}" style="background: none; border: none; color: #f87171; font-size: 11px; font-weight: 800; cursor: pointer; padding: 0 3px;" title="Remove Route">\u2715</button>` : ''}
                    </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 5px;">
                    <input type="text" list="map-geo-datalist" class="map-rt-from" data-idx="${idx}" value="${rt.from || 'USA'}" placeholder="From Country..." style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.14); border-radius: 5px; padding: 4px 6px; color: #fff; font-size: 10.5px; font-weight: 700; outline: none;" />
                    <span style="color: #38bdf8; font-size: 11px; font-weight: 900;">\u2192</span>
                    <input type="text" list="map-geo-datalist" class="map-rt-to" data-idx="${idx}" value="${rt.to || 'Canada'}" placeholder="To Country..." style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.14); border-radius: 5px; padding: 4px 6px; color: #2effc6; font-size: 10.5px; font-weight: 700; outline: none;" />
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Custom HUD Banner Label & Sub-Telemetry -->
          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">HUD Title</span>
              <input type="text" id="map-inp-loc" value="${data.location || 'USA \u2192 UK \u2192 Ukraine'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 7px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">HUD Telemetry</span>
              <input type="text" id="map-inp-coords" value="${data.coords || 'MULTI-VECTOR TRANSIT'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 7px; color: #38bdf8; font-family: monospace; font-size: 10px; outline: none;" />
            </div>
          </div>

          <!-- Cartography Theme Selector -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Cartography Theme</span>
            <select id="map-style-select" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;">
              ${mapStyles.map(s => `<option value="${s.id}" ${data.mapStyle === s.id ? 'selected' : ''} style="background:#0f172a;color:#fff;">${s.label}</option>`).join('')}
            </select>
          </div>

          <!-- CAMERA ZOOM KEYFRAME TIMING ("When to zoom and stuff") -->
          <div style="background: rgba(56,189,248,0.07); border: 1px solid rgba(56,189,248,0.22); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 6px;">
            <div style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">\ud83c\udfa5 Camera Zoom & 3D Orbit</div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#e2e8f0;"><span>When to Start Zoom</span><strong id="map-zstart-lbl">${data.zoomStart ?? 0.8}s</strong></div>
              <input type="range" id="map-inp-zstart" min="0" max="4" step="0.2" value="${data.zoomStart ?? 0.8}" style="accent-color:#38bdf8;cursor:pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#e2e8f0;"><span>Zoom Duration (Speed)</span><strong id="map-zdur-lbl">${data.zoomDuration ?? 2.2}s</strong></div>
              <input type="range" id="map-inp-zdur" min="0.6" max="5" step="0.2" value="${data.zoomDuration ?? 2.2}" style="accent-color:#38bdf8;cursor:pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#e2e8f0;"><span>Target Zoom Level</span><strong id="map-zlvl-lbl">${data.zoomLevel ?? 1.9}x</strong></div>
              <input type="range" id="map-inp-zlvl" min="1.1" max="4.5" step="0.1" value="${data.zoomLevel ?? 1.9}" style="accent-color:#38bdf8;cursor:pointer;" />
            </div>
          </div>

          <!-- Pin Color & Flight Path Toggle -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <label style="display:flex;align-items:center;gap:6px;font-size:10px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="map-inp-arc" ${data.showFlightPath !== false ? 'checked' : ''} style="accent-color:#ef4444;" />
              Show Transit Routes
            </label>
            <div style="display:flex;align-items:center;gap:5px;">
              <span style="font-size:9.5px;color:#94a3b8;">Pin Color</span>
              <input type="color" id="map-inp-color" value="${data.pinColor || '#ef4444'}" style="width:24px;height:20px;border:none;background:transparent;cursor:pointer;" />
            </div>
          </div>
        </div>
      `;

      // Sync stage top-left Video / 3D buttons as well
      const syncTopBarMode = (mode3d) => {
        const pVid = document.getElementById('btn-paper-rip-mode-video');
        const p3D = document.getElementById('btn-paper-rip-mode-3d');
        if (pVid && p3D) {
          pVid.style.background = !mode3d ? 'rgba(168,85,247,.35)' : 'transparent';
          pVid.style.color = !mode3d ? '#fff' : '#94a3b8';
          p3D.style.background = mode3d ? 'rgba(168,85,247,.35)' : 'transparent';
          p3D.style.color = mode3d ? '#fff' : '#94a3b8';
        }
      };

      const btnVid = container.querySelector('#map-btn-mode-video');
      if (btnVid) {
        btnVid.onclick = () => {
          window.tplSetContextualData('map', { is3DMode: false, drawOnScreenMode: false });
          syncTopBarMode(false);
          window.tplRenderContextualInspector('map');
        };
      }
      const btn3D = container.querySelector('#map-btn-mode-3d');
      if (btn3D) {
        btn3D.onclick = () => {
          window.tplSetContextualData('map', { is3DMode: true });
          syncTopBarMode(true);
          window.tplRenderContextualInspector('map');
        };
      }
      const btnDrawScreen = container.querySelector('#map-btn-draw-screen');
      if (btnDrawScreen) {
        btnDrawScreen.onclick = () => {
          const nextDraw = !data.drawOnScreenMode;
          window.tplSetContextualData('map', { is3DMode: true, drawOnScreenMode: nextDraw });
          syncTopBarMode(true);
          window.tplRenderContextualInspector('map');
        };
      }

      container.querySelectorAll('.map-proj-btn').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('map', { projection: btn.dataset.proj });
          window.tplRenderContextualInspector('map');
        };
      });

      // Route Preset Loader
      const routePresetSel = container.querySelector('#map-route-preset-select');
      if (routePresetSel) {
        routePresetSel.onchange = (e) => {
          const rp = routePresets[parseInt(e.target.value, 10)];
          if (rp) {
            const cloned = rp.routes.map(r => Object.assign({}, r));
            const last = cloned[cloned.length - 1];
            const locLabel = cloned.map((r, i) => i === 0 ? `${r.from} \u2192 ${r.to}` : r.to).join(' \u2192 ');
            window.tplSetContextualData('map', {
              routes: cloned,
              location: locLabel,
              coords: `MULTI-VECTOR TRANSIT // ${cloned.length} LEG${cloned.length > 1 ? 'S' : ''}`,
              lat: last.toLat,
              lng: last.toLng
            });
            window.tplRenderContextualInspector('map');
          }
        };
      }

      // Add Route Leg button
      const btnAddRoute = container.querySelector('#map-btn-add-route');
      if (btnAddRoute) {
        btnAddRoute.onclick = () => {
          const routes = activeRoutes.map(r => Object.assign({}, r));
          const prev = routes[routes.length - 1] || { to: 'USA', toLat: 39.8, toLng: -98.5 };
          const defaultNext = prev.to === 'Canada' ? 'UK' : (prev.to === 'UK' ? 'Japan' : 'Canada');
          const nextGeo = window.tplResolveGeoLocation(defaultNext) || { name: 'Canada', lat: 56.13, lng: -106.35 };
          const palette = ['#38bdf8', '#f59e0b', '#2effc6', '#a855f7', '#f43f5e'];
          routes.push({
            from: prev.to || 'USA',
            to: nextGeo.name,
            fromLat: prev.toLat ?? 39.8,
            fromLng: prev.toLng ?? -98.5,
            toLat: nextGeo.lat,
            toLng: nextGeo.lng,
            mode: 'plane',
            color: palette[routes.length % palette.length]
          });
          const locLabel = routes.map((r, i) => i === 0 ? `${r.from} \u2192 ${r.to}` : r.to).join(' \u2192 ');
          window.tplSetContextualData('map', {
            routes,
            location: locLabel,
            coords: `MULTI-VECTOR TRANSIT // ${routes.length} LEGS`,
            lat: nextGeo.lat,
            lng: nextGeo.lng
          });
          window.tplRenderContextualInspector('map');
        };
      }

      // Wire individual route rows (From Country, To Country, Transit Mode, Color, Delete)
      const syncRouteChange = (idx, field, val) => {
        const routes = activeRoutes.map(r => Object.assign({}, r));
        if (!routes[idx]) return;
        routes[idx][field] = val;
        if (field === 'from') {
          const g = window.tplResolveGeoLocation(val);
          if (g) {
            routes[idx].fromLat = g.lat;
            routes[idx].fromLng = g.lng;
          }
        } else if (field === 'to') {
          const g = window.tplResolveGeoLocation(val);
          if (g) {
            routes[idx].toLat = g.lat;
            routes[idx].toLng = g.lng;
            // Also chain to next leg's origin if next leg exists!
            if (routes[idx + 1]) {
              routes[idx + 1].from = val;
              routes[idx + 1].fromLat = g.lat;
              routes[idx + 1].fromLng = g.lng;
            }
          }
        }
        const last = routes[routes.length - 1];
        const locLabel = routes.map((r, i) => i === 0 ? `${r.from} \u2192 ${r.to}` : r.to).join(' \u2192 ');
        const locInpEl = container.querySelector('#map-inp-loc');
        if (locInpEl) locInpEl.value = locLabel;
        window.tplSetContextualData('map', {
          routes,
          location: locLabel,
          lat: last.toLat ?? data.lat,
          lng: last.toLng ?? data.lng
        });
      };

      container.querySelectorAll('.map-rt-from').forEach(inp => {
        inp.oninput = (e) => syncRouteChange(parseInt(inp.dataset.idx, 10), 'from', e.target.value);
      });
      container.querySelectorAll('.map-rt-to').forEach(inp => {
        inp.oninput = (e) => syncRouteChange(parseInt(inp.dataset.idx, 10), 'to', e.target.value);
      });
      container.querySelectorAll('.map-rt-mode').forEach(sel => {
        sel.onchange = (e) => syncRouteChange(parseInt(sel.dataset.idx, 10), 'mode', e.target.value);
      });
      container.querySelectorAll('.map-rt-color').forEach(col => {
        col.oninput = (e) => syncRouteChange(parseInt(col.dataset.idx, 10), 'color', e.target.value);
      });
      container.querySelectorAll('.map-rt-del').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const routes = activeRoutes.filter((_, i) => i !== idx);
          const locLabel = routes.map((r, i) => i === 0 ? `${r.from} \u2192 ${r.to}` : r.to).join(' \u2192 ');
          window.tplSetContextualData('map', { routes, location: locLabel });
          window.tplRenderContextualInspector('map');
        };
      });

      const styleSel = container.querySelector('#map-style-select');
      if (styleSel) styleSel.onchange = (e) => window.tplSetContextualData('map', { mapStyle: e.target.value });

      const locInp = container.querySelector('#map-inp-loc');
      if (locInp) locInp.oninput = (e) => window.tplSetContextualData('map', { location: e.target.value });
      const coordsInp = container.querySelector('#map-inp-coords');
      if (coordsInp) coordsInp.oninput = (e) => window.tplSetContextualData('map', { coords: e.target.value });

      const zsInp = container.querySelector('#map-inp-zstart');
      if (zsInp) zsInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const l = container.querySelector('#map-zstart-lbl'); if (l) l.textContent = `${v}s`;
        window.tplSetContextualData('map', { zoomStart: v });
      };
      const zdInp = container.querySelector('#map-inp-zdur');
      if (zdInp) zdInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const l = container.querySelector('#map-zdur-lbl'); if (l) l.textContent = `${v}s`;
        window.tplSetContextualData('map', { zoomDuration: v });
      };
      const zlInp = container.querySelector('#map-inp-zlvl');
      if (zlInp) zlInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const l = container.querySelector('#map-zlvl-lbl'); if (l) l.textContent = `${v}x`;
        window.tplSetContextualData('map', { zoomLevel: v });
      };
      const arcInp = container.querySelector('#map-inp-arc');
      if (arcInp) arcInp.onchange = (e) => window.tplSetContextualData('map', { showFlightPath: e.target.checked });
      const colInp = container.querySelector('#map-inp-color');
      if (colInp) colInp.oninput = (e) => window.tplSetContextualData('map', { pinColor: e.target.value });

      // Ensure interactive stage bindings are active on initial open
      setTimeout(() => {
        const stageEl = document.getElementById('tpl-modal-preview-stage');
        if (stageEl && typeof window.tplBindInteractiveMapStage === 'function') {
          window.tplBindInteractiveMapStage(stageEl);
        }
      }, 60);
      return;
    }

    // =========================================================================
    //

    // SPECIAL HANDLER: LAYERED CINEMATIC 3D MAP PIN DROP (map-pin-drop)
    // High-Resolution Scalable Vector System - James Jani / Yes Theory standard
    // =========================================================================
    if (tplId === 'empire-map') {
      if (stdLayers) stdLayers.style.display = 'none';
      const aiWrapEl = document.getElementById('tpl-modal-wrap-ai-engine');
      if (aiWrapEl) aiWrapEl.style.display = 'none';
      const atmoWrapEl = document.getElementById('tpl-modal-wrap-atmosphere');
      if (atmoWrapEl) atmoWrapEl.style.display = 'flex';

      const is3D = data.is3DMode !== false;
      const curStyle = data.mapStyle || 'tactical-dark';
      const curTerritory = data.highlightTerritory || 'India';

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(45,212,191,0.35); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          <!-- Header & Quick Preset Selector -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 15px;">🌐</span>
              <span style="font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #2dd4bf; text-transform: uppercase;">Empire Expansion Map • Vox / Harris Standard</span>
            </div>
            <span style="font-size: 9px; font-weight: 700; background: rgba(45,212,191,0.15); color: #2dd4bf; border: 1px solid rgba(45,212,191,0.3); border-radius: 4px; padding: 2px 7px;">PRO 3D CARTOGRAPHY</span>
          </div>

          <!-- Preset Switcher -->
          <div>
            <label style="display: block; font-size: 9.5px; font-weight: 700; color: #94a3b8; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Documentary Style Preset</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button type="button" class="emp-preset-btn ${curStyle === 'tactical-dark' ? 'active' : ''}" data-preset="tactical-dark" style="padding: 7px 10px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid ${curStyle === 'tactical-dark' ? '#2dd4bf' : 'rgba(255,255,255,0.1)'}; background: ${curStyle === 'tactical-dark' ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.04)'}; color: ${curStyle === 'tactical-dark' ? '#2dd4bf' : '#cbd5e1'}; text-align: left;">
                🛰️ Tactical Dark Grid (Image 2)
              </button>
              <button type="button" class="emp-preset-btn ${curStyle === 'vintage-cartography' ? 'active' : ''}" data-preset="vintage-cartography" style="padding: 7px 10px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid ${curStyle === 'vintage-cartography' ? '#f59e0b' : 'rgba(255,255,255,0.1)'}; background: ${curStyle === 'vintage-cartography' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)'}; color: ${curStyle === 'vintage-cartography' ? '#f59e0b' : '#cbd5e1'}; text-align: left;">
                📜 Vintage Paper (Vox Style)
              </button>
            </div>
          </div>

          <!-- Section 1: 3D Spatial Camera & Lens Optics -->
          <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 10px; font-weight: 800; color: #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
              <span>🎥 3D Camera Rig & Lens Optics (f/2.8 Bokeh)</span>
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #94a3b8; cursor: pointer;">
                <input type="checkbox" id="emp-toggle-3d" ${is3D ? 'checked' : ''} style="cursor: pointer; accent-color: #2dd4bf;"/>
                3D Perspective
              </label>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; margin-bottom: 2px;">
                  <span>Camera Pitch</span>
                  <span id="emp-val-pitch">${data.pitch3D !== undefined ? data.pitch3D : 28}°</span>
                </div>
                <input type="range" id="emp-inp-pitch" min="15" max="42" step="1" value="${data.pitch3D !== undefined ? data.pitch3D : 28}" style="width: 100%; cursor: pointer; accent-color: #2dd4bf;"/>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; margin-bottom: 2px;">
                  <span>Camera Yaw</span>
                  <span id="emp-val-yaw">${data.yaw3D !== undefined ? data.yaw3D : -3}°</span>
                </div>
                <input type="range" id="emp-inp-yaw" min="-25" max="25" step="1" value="${data.yaw3D !== undefined ? data.yaw3D : -3}" style="width: 100%; cursor: pointer; accent-color: #2dd4bf;"/>
              </div>
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 2px;">
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="emp-toggle-glide" ${data.cameraGlide !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #2dd4bf;"/>
                3D Sweeping Camera Glide
              </label>
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="emp-toggle-dof" ${data.depthOfField !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #2dd4bf;"/>
                f/2.8 Lens Bokeh (Horizon Blur)
              </label>
            </div>
          </div>

          <!-- Section 2: Parabolic 3D Light-Arcs & Expansion Routes -->
          <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 10px; font-weight: 800; color: #f1f5f9;">
              ⚡ Parabolic 3D Light-Arcs & Trajectories
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 9px; color: #94a3b8; margin-bottom: 3px;">Arc Glow Color</label>
                <input type="color" id="emp-inp-arc-col" value="${data.arcColor || '#fbbf24'}" style="width: 100%; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;"/>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; margin-bottom: 2px;">
                  <span>Arc Height / Curvature</span>
                  <span id="emp-val-curv">${data.arcCurvature !== undefined ? data.arcCurvature : '1.0'}x</span>
                </div>
                <input type="range" id="emp-inp-curv" min="0.5" max="1.8" step="0.1" value="${data.arcCurvature !== undefined ? data.arcCurvature : 1.0}" style="width: 100%; cursor: pointer; accent-color: #fbbf24;"/>
              </div>
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="emp-toggle-multistrand" ${data.arcMultiStrand !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #fbbf24;"/>
                Multi-Strand Fiber-Optic Bundles
              </label>
            </div>
          </div>

          <!-- Section 3: Captured Territory Highlight & Hub Pins -->
          <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 10px; font-weight: 800; color: #f1f5f9;">
              📍 Expansion Hubs & Captured Territory Fill
            </div>
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 9px; color: #94a3b8; margin-bottom: 3px;">Captured Territory</label>
                <select id="emp-sel-territory" style="width: 100%; padding: 5px 8px; background: rgba(15,23,42,0.9); border: 1px solid rgba(255,255,255,0.15); border-radius: 5px; color: #f8fafc; font-size: 10px; cursor: pointer;">
                  <option value="India" ${curTerritory === 'India' ? 'selected' : ''}>🇮🇳 India (Image 2 Standard)</option>
                  <option value="United States of America" ${curTerritory === 'United States of America' ? 'selected' : ''}>🇺🇸 United States</option>
                  <option value="United Kingdom" ${curTerritory === 'United Kingdom' ? 'selected' : ''}>🇬🇧 United Kingdom</option>
                  <option value="Germany" ${curTerritory === 'Germany' ? 'selected' : ''}>🇩🇪 Germany</option>
                  <option value="China" ${curTerritory === 'China' ? 'selected' : ''}>🇨🇳 China</option>
                  <option value="None" ${curTerritory === 'None' ? 'selected' : ''}>None (Routes Only)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 9px; color: #94a3b8; margin-bottom: 3px;">Territory Glow</label>
                <input type="color" id="emp-inp-terr-col" value="${data.highlightColor || '#2dd4bf'}" style="width: 100%; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;"/>
              </div>
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="emp-toggle-shockwaves" ${data.showShockwaves !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #2dd4bf;"/>
                Pulsing Ground Shockwaves
              </label>
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="emp-toggle-borders" ${data.showCountryBorders !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #2dd4bf;"/>
                Country Boundary Outlines
              </label>
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="emp-toggle-dotmatrix" ${data.showDotMatrix !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #2dd4bf;"/>
                Dot-Matrix Mesh
              </label>
            </div>
          </div>
        </div>
      `;

      // Event Listeners for Inspector Controls
      container.querySelectorAll('.emp-preset-btn').forEach(btn => {
        btn.onclick = () => {
          const p = btn.dataset.preset;
          const updates = p === 'vintage-cartography' ? {
            mapStyle: 'vintage-cartography',
            arcColor: '#ef4444',
            arcGlowColor: 'rgba(239, 68, 68, 0.45)',
            highlightColor: '#dc2626'
          } : {
            mapStyle: 'tactical-dark',
            arcColor: '#fbbf24',
            arcGlowColor: 'rgba(245, 158, 11, 0.45)',
            highlightColor: '#2dd4bf'
          };
          window.tplSetContextualData('empire-map', updates);
          window.tplRenderContextualInspector('empire-map');
        };
      });

      const t3D = container.querySelector('#emp-toggle-3d');
      if (t3D) t3D.onchange = (e) => {
        window.tplSetContextualData('empire-map', { is3DMode: e.target.checked });
        window.tplRenderContextualInspector('empire-map');
      };

      const pInp = container.querySelector('#emp-inp-pitch');
      if (pInp) pInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const lbl = container.querySelector('#emp-val-pitch');
        if (lbl) lbl.textContent = `${v}°`;
        window.tplSetContextualData('empire-map', { pitch3D: v });
      };

      const yInp = container.querySelector('#emp-inp-yaw');
      if (yInp) yInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const lbl = container.querySelector('#emp-val-yaw');
        if (lbl) lbl.textContent = `${v}°`;
        window.tplSetContextualData('empire-map', { yaw3D: v });
      };

      const tGlide = container.querySelector('#emp-toggle-glide');
      if (tGlide) tGlide.onchange = (e) => window.tplSetContextualData('empire-map', { cameraGlide: e.target.checked });

      const tDof = container.querySelector('#emp-toggle-dof');
      if (tDof) tDof.onchange = (e) => window.tplSetContextualData('empire-map', { depthOfField: e.target.checked });

      const arcColInp = container.querySelector('#emp-inp-arc-col');
      if (arcColInp) arcColInp.oninput = (e) => window.tplSetContextualData('empire-map', { arcColor: e.target.value, arcGlowColor: e.target.value + '73' });

      const curvInp = container.querySelector('#emp-inp-curv');
      if (curvInp) curvInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const lbl = container.querySelector('#emp-val-curv');
        if (lbl) lbl.textContent = `${v.toFixed(1)}x`;
        window.tplSetContextualData('empire-map', { arcCurvature: v });
      };

      const tStrand = container.querySelector('#emp-toggle-multistrand');
      if (tStrand) tStrand.onchange = (e) => window.tplSetContextualData('empire-map', { arcMultiStrand: e.target.checked });

      const terrSel = container.querySelector('#emp-sel-territory');
      if (terrSel) terrSel.onchange = (e) => window.tplSetContextualData('empire-map', { highlightTerritory: e.target.value });

      const terrColInp = container.querySelector('#emp-inp-terr-col');
      if (terrColInp) terrColInp.oninput = (e) => window.tplSetContextualData('empire-map', { highlightColor: e.target.value });

      const tShock = container.querySelector('#emp-toggle-shockwaves');
      if (tShock) tShock.onchange = (e) => window.tplSetContextualData('empire-map', { showShockwaves: e.target.checked });

      const tBorders = container.querySelector('#emp-toggle-borders');
      if (tBorders) tBorders.onchange = (e) => window.tplSetContextualData('empire-map', { showCountryBorders: e.target.checked });

      const tDots = container.querySelector('#emp-toggle-dotmatrix');
      if (tDots) tDots.onchange = (e) => window.tplSetContextualData('empire-map', { showDotMatrix: e.target.checked });

      return;
    }

    if (tplId === 'map-pin-drop') {
      if (stdLayers) stdLayers.style.display = 'none';
      const aiWrapEl = document.getElementById('tpl-modal-wrap-ai-engine');
      if (aiWrapEl) aiWrapEl.style.display = 'none';
      const atmoWrapEl = document.getElementById('tpl-modal-wrap-atmosphere');
      if (atmoWrapEl) atmoWrapEl.style.display = 'flex';

      const routePresets = [
        {
          label: '🇺🇸 Americas → 🇬🇧 UK → 🇺🇦 Kyiv → 🇨🇳 Asia (Global Transit Arcs)',
          routes: [
            { from: 'Americas', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 51.50, toLng: -0.12, mode: 'plane', color: '#f97316' },
            { from: 'UK', to: 'Kyiv', fromLat: 51.50, fromLng: -0.12, toLat: 50.4501, toLng: 30.5234, mode: 'plane', color: '#f97316' },
            { from: 'Kyiv', to: 'East Asia', fromLat: 50.4501, fromLng: 30.5234, toLat: 35.86, toLng: 104.2, mode: 'plane', color: '#ea580c' }
          ]
        },
        {
          label: '🇺🇸 USA → 🇬🇧 UK → 🇺🇦 Ukraine (Direct Support Corridor)',
          routes: [
            { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 51.50, toLng: -0.12, mode: 'plane', color: '#38bdf8' },
            { from: 'UK', to: 'Ukraine', fromLat: 51.50, fromLng: -0.12, toLat: 50.4501, toLng: 30.5234, mode: 'plane', color: '#38bdf8' }
          ]
        }
      ];

      const is3D = data.is3DMode !== false;
      const curMaterial = data.pinMaterial || 'copper';

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(249,115,22,0.35); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 7px;">
              <span style="font-size: 14px;">📍</span>
              <span style="font-size: 11px; font-weight: 800; color: #fed7aa; text-transform: uppercase; letter-spacing: 0.6px;">Layered Vector 3D Pin Drop</span>
            </div>
            <span style="font-size: 8.5px; color: #f97316; font-weight: 800; background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.4); padding: 2px 7px; border-radius: 12px; font-family: monospace;">SCALABLE VECTOR</span>
          </div>

          <!-- Section 1: Target Coordinates & HUD -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #fdba74; text-transform: uppercase;">📍 Target Coordinate Drop & Leader HUD</span>
            
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; color: #94a3b8; font-weight: 600;">Location Title</span>
              <input type="text" id="vtr-inp-loc" value="${data.location || 'KYIV, UKRAINE'}" style="background: #080c16; border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; color: #94a3b8; font-weight: 600;">Coordinates</span>
                <input type="text" id="vtr-inp-coords" value="${data.coords || '50.4501°N 30.5234°E'}" style="background: #080c16; border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 7px; color: #fdba74; font-family: monospace; font-size: 10px; font-weight: 600; outline: none;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; color: #94a3b8; font-weight: 600;">Telemetry Code</span>
                <input type="text" id="vtr-inp-telemetry" value="${data.telemetry || 'O.SR5911TES     DFX35.EVA'}" style="background: #080c16; border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 7px; color: #94a3b8; font-family: monospace; font-size: 10px; font-weight: 600; outline: none;" />
              </div>
            </div>
          </div>

          <!-- Section 2: 3D Metallic Pin Material -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #fdba74; text-transform: uppercase;">⚙️ 3D Metallic Pin Material</span>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
              <button type="button" class="vtr-btn-mat ${curMaterial === 'copper' ? 'active' : ''}" data-mat="copper" style="padding: 7px 4px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid ${curMaterial === 'copper' ? '#f97316' : 'rgba(255,255,255,0.12)'}; background: ${curMaterial === 'copper' ? 'rgba(249,115,22,0.25)' : '#0f172a'}; color: ${curMaterial === 'copper' ? '#fed7aa' : '#94a3b8'};">
                Brushed Copper
              </button>
              <button type="button" class="vtr-btn-mat ${curMaterial === 'steel' ? 'active' : ''}" data-mat="steel" style="padding: 7px 4px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid ${curMaterial === 'steel' ? '#38bdf8' : 'rgba(255,255,255,0.12)'}; background: ${curMaterial === 'steel' ? 'rgba(56,189,248,0.22)' : '#0f172a'}; color: ${curMaterial === 'steel' ? '#ffffff' : '#94a3b8'};">
                Brushed Steel
              </button>
              <button type="button" class="vtr-btn-mat ${curMaterial === 'gold' ? 'active' : ''}" data-mat="gold" style="padding: 7px 4px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid ${curMaterial === 'gold' ? '#eab308' : 'rgba(255,255,255,0.12)'}; background: ${curMaterial === 'gold' ? 'rgba(234,179,8,0.25)' : '#0f172a'}; color: ${curMaterial === 'gold' ? '#fef08a' : '#94a3b8'};">
                24K Gold
              </button>
            </div>
          </div>

          <!-- Section 3: Modular Vector Layers -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #fdba74; text-transform: uppercase;">🗺️ Modular Vector Layers (Infinite Resolution)</span>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #e2e8f0; cursor: pointer;">
                <span>Shaded Topographic Relief</span>
                <input type="checkbox" id="vtr-toggle-topo" checked style="accent-color: #f97316; cursor: pointer;" />
              </label>
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #e2e8f0; cursor: pointer;">
                <span>Country Borders & Coastlines</span>
                <input type="checkbox" id="vtr-toggle-borders" ${data.showBorders !== false ? 'checked' : ''} style="accent-color: #f97316; cursor: pointer;" />
              </label>
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #e2e8f0; cursor: pointer;">
                <span>Geographic Vector Labels</span>
                <input type="checkbox" id="vtr-toggle-labels" ${data.showLabels !== false ? 'checked' : ''} style="accent-color: #f97316; cursor: pointer;" />
              </label>
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #e2e8f0; cursor: pointer;">
                <span>Ground Impact Dust Plume</span>
                <input type="checkbox" id="vtr-toggle-dust" ${data.showImpactDust !== false ? 'checked' : ''} style="accent-color: #f97316; cursor: pointer;" />
              </label>
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #e2e8f0; cursor: pointer;">
                <span>Dynamic Ocean Water Currents</span>
                <input type="checkbox" id="vtr-toggle-water" ${data.showWaterCurrents !== false ? 'checked' : ''} style="accent-color: #38bdf8; cursor: pointer;" />
              </label>
            </div>
          </div>

          <!-- Section 4: Cinematic 3D Camera -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #fdba74; text-transform: uppercase;">🎥 3D Camera Tilt (Parallax Perspective)</span>
              <label style="display: flex; align-items: center; gap: 5px; font-size: 9px; color: #2effc6; cursor: pointer;">
                <input type="checkbox" id="vtr-toggle-3d" ${is3D ? 'checked' : ''} style="accent-color: #2effc6;" />
                <span>3D Tilt Active</span>
              </label>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1;">
                <span>Camera Pitch (Tilt X)</span>
                <strong id="vtr-pitch-lbl" style="color: #fed7aa; font-family: monospace;">${data.pitch3D !== undefined ? data.pitch3D : 10}°</strong>
              </div>
              <input type="range" id="vtr-inp-pitch" min="-25" max="35" step="1" value="${data.pitch3D !== undefined ? data.pitch3D : 10}" style="accent-color: #f97316; cursor: pointer; height: 3px;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1;">
                <span>Camera Yaw (Pan Y)</span>
                <strong id="vtr-yaw-lbl" style="color: #fed7aa; font-family: monospace;">${data.yaw3D !== undefined ? data.yaw3D : -3}°</strong>
              </div>
              <input type="range" id="vtr-inp-yaw" min="-25" max="25" step="1" value="${data.yaw3D !== undefined ? data.yaw3D : -3}" style="accent-color: #f97316; cursor: pointer; height: 3px;" />
            </div>
          </div>

          <!-- Section 5: Transit Arcs -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #fdba74; text-transform: uppercase;">✈️ Flight Paths & Route Arcs</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="color" id="vtr-inp-color" value="${data.pinColor || '#f97316'}" style="width: 20px; height: 20px; border: none; background: transparent; cursor: pointer;" />
                <label style="display: flex; align-items: center; gap: 4px; font-size: 9.5px; color: #cbd5e1; cursor: pointer;">
                  <input type="checkbox" id="vtr-inp-arc" ${data.showFlightPath !== false ? 'checked' : ''} style="accent-color: #f97316;" />
                  <span>Show</span>
                </label>
              </div>
            </div>
            <select id="vtr-route-preset-select" style="background: #080c16; border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 7px; color: #cbd5e1; font-size: 10px; font-weight: 600; outline: none; cursor: pointer;">
              <option value="">⚡ Load Transit Arcs Preset...</option>
              ${routePresets.map((rp, i) => `<option value="${i}">${rp.label}</option>`).join('')}
            </select>
          </div>
        </div>
      `;

      // Event Listeners for map-pin-drop
      const locInp = container.querySelector('#vtr-inp-loc');
      if (locInp) locInp.oninput = (e) => window.tplSetContextualData('map-pin-drop', { location: e.target.value });

      const coordsInp = container.querySelector('#vtr-inp-coords');
      if (coordsInp) coordsInp.oninput = (e) => window.tplSetContextualData('map-pin-drop', { coords: e.target.value });

      const telInp = container.querySelector('#vtr-inp-telemetry');
      if (telInp) telInp.oninput = (e) => window.tplSetContextualData('map-pin-drop', { telemetry: e.target.value });

      container.querySelectorAll('.vtr-btn-mat').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('map-pin-drop', { pinMaterial: btn.dataset.mat });
          window.tplRenderContextualInspector('map-pin-drop');
        };
      });

      const tBorders = container.querySelector('#vtr-toggle-borders');
      if (tBorders) tBorders.onchange = (e) => window.tplSetContextualData('map-pin-drop', { showBorders: e.target.checked });

      const tLabels = container.querySelector('#vtr-toggle-labels');
      if (tLabels) tLabels.onchange = (e) => window.tplSetContextualData('map-pin-drop', { showLabels: e.target.checked });

      const tDust = container.querySelector('#vtr-toggle-dust');
      if (tDust) tDust.onchange = (e) => window.tplSetContextualData('map-pin-drop', { showImpactDust: e.target.checked });

      const tWater = container.querySelector('#vtr-toggle-water');
      if (tWater) tWater.onchange = (e) => window.tplSetContextualData('map-pin-drop', { showWaterCurrents: e.target.checked });

      const t3D = container.querySelector('#vtr-toggle-3d');
      if (t3D) t3D.onchange = (e) => {
        window.tplSetContextualData('map-pin-drop', { is3DMode: e.target.checked });
        window.tplRenderContextualInspector('map-pin-drop');
      };

      const pInp = container.querySelector('#vtr-inp-pitch');
      if (pInp) pInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const l = container.querySelector('#vtr-pitch-lbl'); if (l) l.textContent = `${v}°`;
        window.tplSetContextualData('map-pin-drop', { pitch3D: v });
      };

      const yInp = container.querySelector('#vtr-inp-yaw');
      if (yInp) yInp.oninput = (e) => {
        const v = parseFloat(e.target.value);
        const l = container.querySelector('#vtr-yaw-lbl'); if (l) l.textContent = `${v}°`;
        window.tplSetContextualData('map-pin-drop', { yaw3D: v });
      };

      const arcInp = container.querySelector('#vtr-inp-arc');
      if (arcInp) arcInp.onchange = (e) => window.tplSetContextualData('map-pin-drop', { showFlightPath: e.target.checked });

      const colInp = container.querySelector('#vtr-inp-color');
      if (colInp) colInp.oninput = (e) => window.tplSetContextualData('map-pin-drop', { pinColor: e.target.value });

      const routePresetSel = container.querySelector('#vtr-route-preset-select');
      if (routePresetSel) {
        routePresetSel.onchange = (e) => {
          const rp = routePresets[parseInt(e.target.value, 10)];
          if (rp) {
            window.tplSetContextualData('map-pin-drop', { routes: rp.routes });
            window.tplRenderContextualInspector('map-pin-drop');
          }
        };
      }

      return;
    }


        // SPECIAL HANDLER: BALANCE SHEET BREAKDOWN (balance)
    // High-End T-Account, Archival 10-K & Bloomberg Glass themes, granular item rows
    // =========================================================================
    if (tplId === 'balance') {
      const presets = [
        {
          label: 'Apple Inc. (10-K)',
          company: 'APPLE INC.',
          period: 'FORM 10-K · FISCAL 2024',
          assetsTotal: '$143.5B',
          liabilitiesTotal: '$81.4B',
          equityTotal: '$62.1B',
          cardAssetsVal: '$143.5B',
          cardLiabVal: '$81.4B',
          cardEquityVal: '$62.1B',
          assetRows: [
            { name: 'Cash & Equivalents', val: '$29.9B' },
            { name: 'Marketable Securities', val: '$61.5B' },
            { name: 'Accounts receivable, net', val: '$29.5B' },
            { name: 'Inventories', val: '$22.6B' }
          ],
          liabRows: [
            { name: 'Short-term debt', val: '$16.2B' },
            { name: 'Long-term debt', val: '$65.2B' }
          ]
        },
        {
          label: 'Tesla Inc. (Auto/Energy)',
          company: 'TESLA, INC.',
          period: 'FORM 10-K · ANNUAL REPORT',
          assetsTotal: '$106.6B',
          liabilitiesTotal: '$43.0B',
          equityTotal: '$63.6B',
          cardAssetsVal: '$106.6B',
          cardLiabVal: '$43.0B',
          cardEquityVal: '$63.6B',
          assetRows: [
            { name: 'Cash & Investments', val: '$29.1B' },
            { name: 'Solar & Gigafactory PP&E', val: '$32.5B' },
            { name: 'Inventory & Fleet', val: '$14.2B' },
            { name: 'Other Current Assets', val: '$30.8B' }
          ],
          liabRows: [
            { name: 'Accounts Payable & Accrued', val: '$26.8B' },
            { name: 'Total Debt & Leases', val: '$16.2B' }
          ]
        },
        {
          label: 'Tech Startup (Series A)',
          company: 'NEXUS AI CORP.',
          period: 'Q3 INVESTOR DECK · 2024',
          assetsTotal: '$18.4M',
          liabilitiesTotal: '$3.2M',
          equityTotal: '$15.2M',
          cardAssetsVal: '$18.4M',
          cardLiabVal: '$3.2M',
          cardEquityVal: '$15.2M',
          assetRows: [
            { name: 'Treasury & Silicon Valley Bank', val: '$14.2M' },
            { name: 'GPU Cluster Compute Assets', val: '$3.1M' },
            { name: 'Enterprise SaaS Receivables', val: '$1.1M' }
          ],
          liabRows: [
            { name: 'Venture Debt Line', val: '$2.4M' },
            { name: 'Accounts Payable & Cloud', val: '$0.8M' }
          ]
        },
        {
          label: 'Personal Net Worth',
          company: 'EXECUTIVE BALANCE SHEET',
          period: 'PRIVATE WEALTH STATEMENT',
          assetsTotal: '$2,450,000',
          liabilitiesTotal: '$620,000',
          equityTotal: '$1,830,000',
          cardAssetsVal: '$2.45M',
          cardLiabVal: '$620K',
          cardEquityVal: '$1.83M',
          assetRows: [
            { name: 'Primary Residence Equity', val: '$1,200,000' },
            { name: 'Index Funds & Equities', val: '$850,000' },
            { name: 'High-Yield Cash Reserves', val: '$400,000' }
          ],
          liabRows: [
            { name: 'Fixed 30-Yr Mortgage', val: '$580,000' },
            { name: 'Vehicle & Revolving Debt', val: '$40,000' }
          ]
        }
      ];

      const curTheme = data.theme || 'archival';
      const curTab = data._activeBalanceTab || 'doc';

      // Default rows if not set
      const curAssetRows = (Array.isArray(data.assetRows) && data.assetRows.length > 0) ? data.assetRows : [
        { name: 'Cash & Equivalents', val: '$29.9B' },
        { name: 'Marketable Securities', val: '$61.5B' },
        { name: 'Accounts receivable, net', val: '$29.5B' },
        { name: 'Inventories', val: '$22.6B' }
      ];
      const curLiabRows = (Array.isArray(data.liabRows) && data.liabRows.length > 0) ? data.liabRows : [
        { name: 'Short-term debt', val: '$16.2B' },
        { name: 'Long-term debt', val: '$65.2B' }
      ];

      // Tab bar navigation HTML
      const tabNavHtml = `
        <div style="display: flex; gap: 4px; background: rgba(0,0,0,0.5); padding: 3px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
          <button type="button" class="bal-tab-btn" data-tab="doc" style="flex: 1; padding: 6px 4px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: none; background: ${curTab === 'doc' ? 'rgba(56,189,248,0.22)' : 'transparent'}; color: ${curTab === 'doc' ? '#38bdf8' : '#94a3b8'}; transition: all 0.15s;">
            📄 Doc & Rows
          </button>
          <button type="button" class="bal-tab-btn" data-tab="cards" style="flex: 1; padding: 6px 4px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: none; background: ${curTab === 'cards' ? 'rgba(16,185,129,0.22)' : 'transparent'}; color: ${curTab === 'cards' ? '#34d399' : '#94a3b8'}; transition: all 0.15s;">
            🗂️ 4 HUD Cards
          </button>
          <button type="button" class="bal-tab-btn" data-tab="timing" style="flex: 1; padding: 6px 4px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: none; background: ${curTab === 'timing' ? 'rgba(168,85,247,0.22)' : 'transparent'}; color: ${curTab === 'timing' ? '#c084fc' : '#94a3b8'}; transition: all 0.15s;">
            ⏱️ Timing
          </button>
        </div>
      `;

      // TAB 1: Document & Rows Content
      let tabContentHtml = '';
      if (curTab === 'doc') {
        tabContentHtml = `
          <!-- Presets -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Company Template Presets</span>
            <select id="bal-preset-select" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none; cursor: pointer;">
              <option value="">-- Choose Corporate Preset --</option>
              ${presets.map((p, idx) => `<option value="${idx}">${p.label}</option>`).join('')}
            </select>
          </div>

          <!-- Theme Mode Switcher -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Visual Aesthetic</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button type="button" id="bal-theme-archival" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid ${curTheme === 'archival' ? '#8b5a3c' : 'rgba(255,255,255,0.1)'}; background: ${curTheme === 'archival' ? 'rgba(139,90,60,0.25)' : 'rgba(0,0,0,0.3)'}; color: ${curTheme === 'archival' ? '#fed7aa' : '#94a3b8'}; transition: all 0.15s;">
                📜 Archival 10-K
              </button>
              <button type="button" id="bal-theme-bloomberg" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid ${curTheme === 'bloomberg' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${curTheme === 'bloomberg' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${curTheme === 'bloomberg' ? '#38bdf8' : '#94a3b8'}; transition: all 0.15s;">
                💻 Bloomberg Glass
              </button>
            </div>
          </div>

          <!-- Entity & Subtitle -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Entity Name</span>
              <input type="text" id="bal-inp-company" value="${data.company || 'APPLE INC.'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Filing Period</span>
              <input type="text" id="bal-inp-period" value="${data.period || 'FORM 10-K · FISCAL 2024'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
            </div>
          </div>

          <!-- Formula Totals -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">Accounting Equation Totals</span>
              <span style="font-size: 8.5px; color: #10b981; font-family: monospace;">A = L + E</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 8.5px; font-weight: 700; color: #10b981;">TOTAL ASSETS</span>
                <input type="text" id="bal-inp-assets" value="${data.assetsTotal || data.assets || '$143.5B'}" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(16,185,129,0.4); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 11px; font-weight: 700; font-family: monospace; outline: none;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 8.5px; font-weight: 700; color: #f43f5e;">LIABILITIES</span>
                <input type="text" id="bal-inp-liab" value="${data.liabilitiesTotal || data.liabilities || '$81.4B'}" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(244,63,94,0.4); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 11px; font-weight: 700; font-family: monospace; outline: none;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 8.5px; font-weight: 700; color: #818cf8;">EQUITY</span>
                <input type="text" id="bal-inp-equity" value="${data.equityTotal || data.netWorth || '$62.1B'}" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(129,140,248,0.4); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 11px; font-weight: 700; font-family: monospace; outline: none;" />
              </div>
            </div>
          </div>

          <!-- Itemized Rows Customizer -->
          <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 700; color: #34d399; text-transform: uppercase;">Current Assets Rows</span>
              <span style="font-size: 8px; color: #64748b;">(Row sweeps applied to 1 & 2)</span>
            </div>
            ${curAssetRows.map((r, i) => `
              <div style="display: grid; grid-template-columns: 1fr 65px; gap: 4px;">
                <input type="text" class="bal-asset-row-name" data-idx="${i}" value="${r.name || ''}" placeholder="Line Item" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #e2e8f0; font-size: 10px;" />
                <input type="text" class="bal-asset-row-val" data-idx="${i}" value="${r.val || ''}" placeholder="$ Value" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(52,211,153,0.3); border-radius: 4px; padding: 3px 6px; color: #34d399; font-size: 10px; font-family: monospace; text-align: right;" />
              </div>
            `).join('')}

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
              <span style="font-size: 9.5px; font-weight: 700; color: #f87171; text-transform: uppercase;">Liabilities Itemized Rows</span>
            </div>
            ${curLiabRows.map((r, i) => `
              <div style="display: grid; grid-template-columns: 1fr 65px; gap: 4px;">
                <input type="text" class="bal-liab-row-name" data-idx="${i}" value="${r.name || ''}" placeholder="Debt Item" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #e2e8f0; font-size: 10px;" />
                <input type="text" class="bal-liab-row-val" data-idx="${i}" value="${r.val || ''}" placeholder="$ Value" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(248,113,113,0.3); border-radius: 4px; padding: 3px 6px; color: #f87171; font-size: 10px; font-family: monospace; text-align: right;" />
              </div>
            `).join('')}
          </div>

          <!-- Cinematic Depth of Field & Line Mystery Controls -->
          <div style="background: rgba(15,23,42,0.5); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; padding: 9px; display: flex; flex-direction: column; gap: 7px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <input type="checkbox" id="bal-chk-dof" ${data.dofFocusEnabled !== false ? 'checked' : ''} style="cursor: pointer; accent-color: #38bdf8;" />
                <label for="bal-chk-dof" style="font-size: 9.5px; font-weight: 700; color: #38bdf8; text-transform: uppercase; cursor: pointer;">Focus Highlighted (Blur Unfocused)</label>
              </div>
              <span style="font-size: 8.5px; color: #94a3b8; font-family: monospace;" id="bal-lbl-dof-val">${data.unfocusedBlur !== undefined ? data.unfocusedBlur : 1.2}px</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #cbd5e1;">
                <span>Unfocused Text Blur:</span>
                <span id="bal-lbl-unfocus-blur" style="color: #38bdf8; font-family: monospace;">${data.unfocusedBlur !== undefined ? data.unfocusedBlur : 1.2}px</span>
              </div>
              <input type="range" id="bal-rng-unfocus-blur" min="0" max="4" step="0.2" value="${data.unfocusedBlur !== undefined ? data.unfocusedBlur : 1.2}" style="width: 100%; accent-color: #38bdf8; cursor: pointer;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #cbd5e1;">
                <span>Unfocused Opacity:</span>
                <span id="bal-lbl-unfocus-op" style="color: #38bdf8; font-family: monospace;">${Math.round((data.unfocusedOpacity !== undefined ? data.unfocusedOpacity : 0.55) * 100)}%</span>
              </div>
              <input type="range" id="bal-rng-unfocus-op" min="0.2" max="1.0" step="0.05" value="${data.unfocusedOpacity !== undefined ? data.unfocusedOpacity : 0.55}" style="width: 100%; accent-color: #38bdf8; cursor: pointer;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px; margin-top: 2px; padding-top: 5px; border-top: 1px solid rgba(255,255,255,0.06);">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #cbd5e1;">
                <span>Line Delicacy & Mystery:</span>
                <span id="bal-lbl-line-alpha" style="color: #fed7aa; font-family: monospace;">${Math.round((data.lineAlpha !== undefined ? data.lineAlpha : 0.28) * 100)}%</span>
              </div>
              <input type="range" id="bal-rng-line-alpha" min="0.10" max="0.75" step="0.05" value="${data.lineAlpha !== undefined ? data.lineAlpha : 0.28}" style="width: 100%; accent-color: #f59e0b; cursor: pointer;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #cbd5e1;">
                <span>3D Camera Tilt (0° = Flat & Razor Sharp):</span>
                <span id="bal-lbl-cam-tilt" style="color: #c084fc; font-family: monospace;">${data.cameraTilt !== undefined ? data.cameraTilt : 13.5}°</span>
              </div>
              <input type="range" id="bal-rng-cam-tilt" min="0" max="22" step="0.5" value="${data.cameraTilt !== undefined ? data.cameraTilt : 13.5}" style="width: 100%; accent-color: #c084fc; cursor: pointer;" />
            </div>
          </div>

          <!-- Official Rubber Stamp Customizer -->
          <div style="background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.3); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <input type="checkbox" id="bal-chk-stamp" ${data.stampEnabled !== false ? 'checked' : ''} style="cursor: pointer;" />
                <label for="bal-chk-stamp" style="font-size: 9.5px; font-weight: 700; color: #f87171; text-transform: uppercase; cursor: pointer;">Official Audit Stamp</label>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 8.5px; color: #94a3b8;">Ink:</span>
                <input type="color" id="bal-col-stamp" value="${data.stampColor || '#b91c1c'}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
              <input type="text" id="bal-inp-stamptop" value="${data.stampTop || 'SEC EDGAR AUDIT'}" placeholder="Top Header" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 5px; color: #fca5a5; font-size: 9px; font-weight: 700;" />
              <input type="text" id="bal-inp-stampmain" value="${data.stampMain || 'VERIFIED'}" placeholder="Main Stamp" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 5px; color: #f87171; font-size: 9px; font-weight: 900;" />
              <input type="text" id="bal-inp-stampsub" value="${data.stampSub || 'GAAP • FORM 10-K'}" placeholder="Sub Text" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 5px; color: #fca5a5; font-size: 9px;" />
            </div>
          </div>
        `;
      } else if (curTab === 'cards') {
        // TAB 2: 4 HUD Cards Customizer
        tabContentHtml = `
          <!-- CARD 1: Total Assets -->
          <div style="background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.25); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: ${data.cardAssetsDot || '#34d399'}; display: inline-block;"></span>
                <span style="font-size: 9.5px; font-weight: 700; color: #34d399;">CARD 1 · TOTAL ASSETS (TOP-LEFT)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 8px; color: #94a3b8;">Dot/Line:</span>
                <input type="color" id="bal-col-card-assets" value="${data.cardAssetsDot || '#34d399'}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
              <input type="text" id="bal-inp-card1-tag" value="${data.cardAssetsTag || 'Total Assets'}" placeholder="Tag/Label" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
              <input type="text" id="bal-inp-card1-val" value="${data.cardAssetsVal || data.assetsTotal || '$143.5B'}" placeholder="Main Value" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px; font-weight: 700; font-family: monospace;" />
            </div>
            <div style="display: grid; grid-template-columns: 80px 1fr; gap: 5px;">
              <input type="text" id="bal-inp-card1-pct" value="${data.cardAssetsPct || '↑ 4.2%'}" placeholder="Delta %" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(52,211,153,0.3); border-radius: 4px; padding: 4px 6px; color: #34d399; font-size: 10px; font-weight: 700;" />
              <input type="text" id="bal-inp-card1-sub" value="${data.cardAssetsSub || 'Consolidated balance'}" placeholder="Subtitle description" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #94a3b8; font-size: 9.5px;" />
            </div>
          </div>

          <!-- CARD 2: Balance Check -->
          <div style="background: rgba(148,163,184,0.06); border: 1px solid rgba(148,163,184,0.22); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: ${data.cardStatusDot || '#94a3b8'}; display: inline-block;"></span>
                <span style="font-size: 9.5px; font-weight: 700; color: #cbd5e1;">CARD 2 · BALANCE CHECK (TOP-RIGHT)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 8px; color: #94a3b8;">Dot/Line:</span>
                <input type="color" id="bal-col-card-status" value="${data.cardStatusDot || '#94a3b8'}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
              <input type="text" id="bal-inp-card2-tag" value="${data.cardStatusTag || 'Balance Check'}" placeholder="Tag/Label" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
              <input type="text" id="bal-inp-card2-val" value="${data.cardStatusVal || 'Balanced'}" placeholder="Status Value" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px; font-weight: 700;" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; align-items: center;">
              <input type="text" id="bal-inp-card2-sub" value="${data.cardStatusSub || 'Assets = Liabilities + Equity'}" placeholder="Equation description" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #94a3b8; font-size: 9.5px;" />
              <label style="display: flex; align-items: center; gap: 3px; font-size: 8.5px; color: #94a3b8; cursor: pointer;">
                <input type="checkbox" id="bal-chk-card2-icon" ${data.cardStatusCheck !== false ? 'checked' : ''} /> Checkmark
              </label>
            </div>
          </div>

          <!-- CARD 3: Total Liabilities -->
          <div style="background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.25); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: ${data.cardLiabDot || '#f87171'}; display: inline-block;"></span>
                <span style="font-size: 9.5px; font-weight: 700; color: #f87171;">CARD 3 · LIABILITIES (MID-RIGHT)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 8px; color: #94a3b8;">Dot/Line:</span>
                <input type="color" id="bal-col-card-liab" value="${data.cardLiabDot || '#f87171'}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
              <input type="text" id="bal-inp-card3-tag" value="${data.cardLiabTag || 'Total Liabilities'}" placeholder="Tag/Label" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
              <input type="text" id="bal-inp-card3-val" value="${data.cardLiabVal || data.liabilitiesTotal || '$81.4B'}" placeholder="Main Value" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px; font-weight: 700; font-family: monospace;" />
            </div>
            <div style="display: grid; grid-template-columns: 80px 1fr; gap: 5px;">
              <input type="text" id="bal-inp-card3-pct" value="${data.cardLiabPct || '↑ 3.1%'}" placeholder="Delta %" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(248,113,113,0.3); border-radius: 4px; padding: 4px 6px; color: #f87171; font-size: 10px; font-weight: 700;" />
              <input type="text" id="bal-inp-card3-sub" value="${data.cardLiabSub || 'Outstanding obligations'}" placeholder="Subtitle description" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #94a3b8; font-size: 9.5px;" />
            </div>
          </div>

          <!-- CARD 4: Shareholders' Equity -->
          <div style="background: rgba(167,139,250,0.06); border: 1px solid rgba(167,139,250,0.25); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: ${data.cardEquityDot || '#a78bfa'}; display: inline-block;"></span>
                <span style="font-size: 9.5px; font-weight: 700; color: #a78bfa;">CARD 4 · EQUITY (BOT-RIGHT)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 8px; color: #94a3b8;">Dot/Line:</span>
                <input type="color" id="bal-col-card-equity" value="${data.cardEquityDot || '#a78bfa'}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
              <input type="text" id="bal-inp-card4-tag" value="${data.cardEquityTag || 'Shareholders\' Equity'}" placeholder="Tag/Label" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px;" />
              <input type="text" id="bal-inp-card4-val" value="${data.cardEquityVal || data.equityTotal || '$62.1B'}" placeholder="Main Value" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10px; font-weight: 700; font-family: monospace;" />
            </div>
            <div style="display: grid; grid-template-columns: 80px 1fr; gap: 5px;">
              <input type="text" id="bal-inp-card4-pct" value="${data.cardEquityPct || '↑ 5.6%'}" placeholder="Delta %" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(167,139,250,0.3); border-radius: 4px; padding: 4px 6px; color: #a78bfa; font-size: 10px; font-weight: 700;" />
              <input type="text" id="bal-inp-card4-sub" value="${data.cardEquitySub || 'Net assets attributable to equity'}" placeholder="Subtitle description" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 6px; color: #94a3b8; font-size: 9.5px;" />
            </div>
          </div>
        `;
      } else if (curTab === 'timing') {
        // TAB 3: Timeline Timing Content
        tabContentHtml = `
          <!-- 3D Orbit Camera Speed -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 700; color: #38bdf8; text-transform: uppercase;">3D Camera Orbit Duration</span>
              <span id="bal-lbl-orbit" style="font-size: 9.5px; color: #38bdf8; font-weight: 700; font-family: monospace;">${data.sceneOrbitDur || 10}s</span>
            </div>
            <input type="range" id="bal-rng-orbit" min="4" max="24" step="0.5" value="${data.sceneOrbitDur || 10}" style="width: 100%; accent-color: #38bdf8; cursor: pointer;" />
          </div>

          <!-- Official Stamp Slam Timing -->
          <div style="background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.25); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 700; color: #f87171; text-transform: uppercase;">Stamp Slam Trigger Delay</span>
              <span id="bal-lbl-stamp-delay" style="font-size: 9.5px; color: #f87171; font-weight: 700; font-family: monospace;">${data.stampDelay !== undefined ? data.stampDelay : 0}s</span>
            </div>
            <input type="range" id="bal-rng-stamp-delay" min="0" max="4" step="0.1" value="${data.stampDelay !== undefined ? data.stampDelay : 0}" style="width: 100%; accent-color: #f87171; cursor: pointer;" />
          </div>

          <!-- Highlighter Sweeps Delays & Colors -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">Row Highlighter Sweeps Timing</span>

            <!-- Sweep 1: Cash -->
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 9px; color: #34d399; font-weight: 600;">Cash & Equiv Sweep Delay:</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input type="color" id="bal-col-sweep1" value="${data.sweep1Color || '#8ed0a8'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Highlighter Color" />
                  <span id="bal-lbl-sw1" style="font-size: 9px; color: #34d399; font-family: monospace;">${data.sweep1Delay !== undefined ? data.sweep1Delay : 0.3}s</span>
                </div>
              </div>
              <input type="range" id="bal-rng-sw1" min="0" max="4" step="0.1" value="${data.sweep1Delay !== undefined ? data.sweep1Delay : 0.3}" style="width: 100%; accent-color: #34d399; cursor: pointer;" />
            </div>

            <!-- Sweep 2: Marketable Securities -->
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 9px; color: #34d399; font-weight: 600;">Securities Sweep Delay:</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input type="color" id="bal-col-sweep2" value="${data.sweep2Color || '#8ed0a8'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Highlighter Color" />
                  <span id="bal-lbl-sw2" style="font-size: 9px; color: #34d399; font-family: monospace;">${data.sweep2Delay !== undefined ? data.sweep2Delay : 0.9}s</span>
                </div>
              </div>
              <input type="range" id="bal-rng-sw2" min="0" max="4" step="0.1" value="${data.sweep2Delay !== undefined ? data.sweep2Delay : 0.9}" style="width: 100%; accent-color: #34d399; cursor: pointer;" />
            </div>

            <!-- Sweep 3: Total Liabilities -->
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 9px; color: #f87171; font-weight: 600;">Liabilities Sweep Delay:</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input type="color" id="bal-col-sweepliab" value="${data.sweepLiabColor || '#ebaca8'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Highlighter Color" />
                  <span id="bal-lbl-swliab" style="font-size: 9px; color: #f87171; font-family: monospace;">${data.sweepLiabDelay !== undefined ? data.sweepLiabDelay : 1.5}s</span>
                </div>
              </div>
              <input type="range" id="bal-rng-swliab" min="0" max="4" step="0.1" value="${data.sweepLiabDelay !== undefined ? data.sweepLiabDelay : 1.5}" style="width: 100%; accent-color: #f87171; cursor: pointer;" />
            </div>

            <!-- Sweep 4: Shareholders' Equity -->
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 9px; color: #c084fc; font-weight: 600;">Equity Sweep Delay:</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input type="color" id="bal-col-sweepequity" value="${data.sweepEquityColor || '#c4bce4'}" style="width: 18px; height: 16px; border: none; background: transparent; cursor: pointer;" title="Highlighter Color" />
                  <span id="bal-lbl-sweq" style="font-size: 9px; color: #c084fc; font-family: monospace;">${data.sweepEquityDelay !== undefined ? data.sweepEquityDelay : 2.1}s</span>
                </div>
              </div>
              <input type="range" id="bal-rng-sweq" min="0" max="4" step="0.1" value="${data.sweepEquityDelay !== undefined ? data.sweepEquityDelay : 2.1}" style="width: 100%; accent-color: #c084fc; cursor: pointer;" />
            </div>
          </div>

          <!-- HUD Floating Animation Stagger Delays -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">4 HUD Cards Stagger Delays</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Assets:</span>
                  <span id="bal-lbl-card-a-del" style="color: #fff; font-family: monospace;">${data.cardAssetsDelay !== undefined ? data.cardAssetsDelay : 0}s</span>
                </div>
                <input type="range" id="bal-rng-card-a-del" min="0" max="3" step="0.1" value="${data.cardAssetsDelay !== undefined ? data.cardAssetsDelay : 0}" style="width: 100%; accent-color: #34d399;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Status:</span>
                  <span id="bal-lbl-card-s-del" style="color: #fff; font-family: monospace;">${data.cardStatusDelay !== undefined ? data.cardStatusDelay : 0.6}s</span>
                </div>
                <input type="range" id="bal-rng-card-s-del" min="0" max="3" step="0.1" value="${data.cardStatusDelay !== undefined ? data.cardStatusDelay : 0.6}" style="width: 100%; accent-color: #cbd5e1;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Liabilities:</span>
                  <span id="bal-lbl-card-l-del" style="color: #fff; font-family: monospace;">${data.cardLiabDelay !== undefined ? data.cardLiabDelay : 1.2}s</span>
                </div>
                <input type="range" id="bal-rng-card-l-del" min="0" max="3" step="0.1" value="${data.cardLiabDelay !== undefined ? data.cardLiabDelay : 1.2}" style="width: 100%; accent-color: #f87171;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                  <span>Equity:</span>
                  <span id="bal-lbl-card-e-del" style="color: #fff; font-family: monospace;">${data.cardEquityDelay !== undefined ? data.cardEquityDelay : 1.8}s</span>
                </div>
                <input type="range" id="bal-rng-card-e-del" min="0" max="3" step="0.1" value="${data.cardEquityDelay !== undefined ? data.cardEquityDelay : 1.8}" style="width: 100%; accent-color: #a78bfa;" />
              </div>
            </div>
          </div>
        `;
      }

      container.innerHTML = `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 11px;">
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">🏛️</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">BALANCE SHEET CONTROLS</span>
            </div>
            <span style="font-size: 9px; color: #10b981; font-weight: 700; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 1px 6px; border-radius: 4px;">TOP PRIORITY</span>
          </div>

          <!-- Tab Bar -->
          ${tabNavHtml}

          <!-- Tab Active Panel -->
          ${tabContentHtml}

          ${window.tplBuildUniversalBgHtml ? window.tplBuildUniversalBgHtml(data) : ''}
        </div>
      `;

      if (window.tplWireUniversalBgControls) window.tplWireUniversalBgControls(tplId, container);

      // Tab switcher event listeners
      container.querySelectorAll('.bal-tab-btn').forEach(btn => {
        btn.onclick = () => {
          const tab = btn.dataset.tab;
          window.tplSetContextualData('balance', { _activeBalanceTab: tab });
          window.tplRenderContextualInspector('balance');
        };
      });

      // EVENT LISTENERS: TAB 1 (Document & Rows)
      if (curTab === 'doc') {
        const presetSel = container.querySelector('#bal-preset-select');
        if (presetSel) {
          presetSel.onchange = (e) => {
            const idx = parseInt(e.target.value, 10);
            if (!isNaN(idx) && presets[idx]) {
              const p = presets[idx];
              window.tplSetContextualData('balance', {
                company: p.company,
                period: p.period,
                assetsTotal: p.assetsTotal,
                liabilitiesTotal: p.liabilitiesTotal,
                equityTotal: p.equityTotal,
                assets: p.assetsTotal,
                liabilities: p.liabilitiesTotal,
                netWorth: p.equityTotal,
                cardAssetsVal: p.cardAssetsVal || p.assetsTotal,
                cardLiabVal: p.cardLiabVal || p.liabilitiesTotal,
                cardEquityVal: p.cardEquityVal || p.equityTotal,
                assetRows: p.assetRows,
                liabRows: p.liabRows
              });
              window.tplRenderContextualInspector('balance');
            }
          };
        }

        const btnArch = container.querySelector('#bal-theme-archival');
        if (btnArch) btnArch.onclick = () => {
          window.tplSetContextualData('balance', { theme: 'archival' });
          window.tplRenderContextualInspector('balance');
        };

        const btnBloom = container.querySelector('#bal-theme-bloomberg');
        if (btnBloom) btnBloom.onclick = () => {
          window.tplSetContextualData('balance', { theme: 'bloomberg' });
          window.tplRenderContextualInspector('balance');
        };

        const inpComp = container.querySelector('#bal-inp-company');
        if (inpComp) inpComp.oninput = (e) => window.tplSetContextualData('balance', { company: e.target.value });

        const inpPer = container.querySelector('#bal-inp-period');
        if (inpPer) inpPer.oninput = (e) => window.tplSetContextualData('balance', { period: e.target.value });

        const inpAss = container.querySelector('#bal-inp-assets');
        if (inpAss) inpAss.oninput = (e) => window.tplSetContextualData('balance', { assetsTotal: e.target.value, assets: e.target.value });

        const inpLiab = container.querySelector('#bal-inp-liab');
        if (inpLiab) inpLiab.oninput = (e) => window.tplSetContextualData('balance', { liabilitiesTotal: e.target.value, liabilities: e.target.value });

        const inpEq = container.querySelector('#bal-inp-equity');
        if (inpEq) inpEq.oninput = (e) => window.tplSetContextualData('balance', { equityTotal: e.target.value, netWorth: e.target.value });

        // Asset rows item editors
        container.querySelectorAll('.bal-asset-row-name').forEach(inp => {
          inp.oninput = (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            const rows = [...curAssetRows];
            if (rows[idx]) {
              rows[idx] = Object.assign({}, rows[idx], { name: e.target.value });
              window.tplSetContextualData('balance', { assetRows: rows });
            }
          };
        });
        container.querySelectorAll('.bal-asset-row-val').forEach(inp => {
          inp.oninput = (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            const rows = [...curAssetRows];
            if (rows[idx]) {
              rows[idx] = Object.assign({}, rows[idx], { val: e.target.value });
              window.tplSetContextualData('balance', { assetRows: rows });
            }
          };
        });

        // Liability rows item editors
        container.querySelectorAll('.bal-liab-row-name').forEach(inp => {
          inp.oninput = (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            const rows = [...curLiabRows];
            if (rows[idx]) {
              rows[idx] = Object.assign({}, rows[idx], { name: e.target.value });
              window.tplSetContextualData('balance', { liabRows: rows });
            }
          };
        });
        container.querySelectorAll('.bal-liab-row-val').forEach(inp => {
          inp.oninput = (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            const rows = [...curLiabRows];
            if (rows[idx]) {
              rows[idx] = Object.assign({}, rows[idx], { val: e.target.value });
              window.tplSetContextualData('balance', { liabRows: rows });
            }
          };
        });

        // Stamp controls
        const chkStamp = container.querySelector('#bal-chk-stamp');
        if (chkStamp) chkStamp.onchange = (e) => window.tplSetContextualData('balance', { stampEnabled: e.target.checked });

        const colStamp = container.querySelector('#bal-col-stamp');
        if (colStamp) colStamp.oninput = (e) => window.tplSetContextualData('balance', { stampColor: e.target.value });

        const inpStampTop = container.querySelector('#bal-inp-stamptop');
        if (inpStampTop) inpStampTop.oninput = (e) => window.tplSetContextualData('balance', { stampTop: e.target.value });

        const inpStampMain = container.querySelector('#bal-inp-stampmain');
        if (inpStampMain) inpStampMain.oninput = (e) => window.tplSetContextualData('balance', { stampMain: e.target.value });

        const inpStampSub = container.querySelector('#bal-inp-stampsub');
        if (inpStampSub) inpStampSub.oninput = (e) => window.tplSetContextualData('balance', { stampSub: e.target.value });

        // Depth of field & line mystery listeners
        const chkDof = container.querySelector('#bal-chk-dof');
        if (chkDof) chkDof.onchange = (e) => window.tplSetContextualData('balance', { dofFocusEnabled: e.target.checked });

        const rngBlur = container.querySelector('#bal-rng-unfocus-blur');
        if (rngBlur) rngBlur.oninput = (e) => {
          const v = parseFloat(e.target.value);
          const lbl = container.querySelector('#bal-lbl-unfocus-blur');
          const lblDof = container.querySelector('#bal-lbl-dof-val');
          if (lbl) lbl.textContent = `${v}px`;
          if (lblDof) lblDof.textContent = `${v}px`;
          window.tplSetContextualData('balance', { unfocusedBlur: v });
        };

        const rngOp = container.querySelector('#bal-rng-unfocus-op');
        if (rngOp) rngOp.oninput = (e) => {
          const v = parseFloat(e.target.value);
          const lbl = container.querySelector('#bal-lbl-unfocus-op');
          if (lbl) lbl.textContent = `${Math.round(v * 100)}%`;
          window.tplSetContextualData('balance', { unfocusedOpacity: v });
        };

        const rngLineAlpha = container.querySelector('#bal-rng-line-alpha');
        if (rngLineAlpha) rngLineAlpha.oninput = (e) => {
          const v = parseFloat(e.target.value);
          const lbl = container.querySelector('#bal-lbl-line-alpha');
          if (lbl) lbl.textContent = `${Math.round(v * 100)}%`;
          window.tplSetContextualData('balance', { lineAlpha: v, leaderAlpha: Math.max(0.12, v * 0.8) });
        };

        const rngCamTilt = container.querySelector('#bal-rng-cam-tilt');
        if (rngCamTilt) rngCamTilt.oninput = (e) => {
          const v = parseFloat(e.target.value);
          const lbl = container.querySelector('#bal-lbl-cam-tilt');
          if (lbl) lbl.textContent = `${v}°`;
          window.tplSetContextualData('balance', { cameraTilt: v });
        };
      }

      // EVENT LISTENERS: TAB 2 (4 HUD Cards)
      if (curTab === 'cards') {
        // Card 1
        const colC1 = container.querySelector('#bal-col-card-assets');
        if (colC1) colC1.oninput = (e) => window.tplSetContextualData('balance', { cardAssetsDot: e.target.value, assetColor: e.target.value });
        const c1Tag = container.querySelector('#bal-inp-card1-tag');
        if (c1Tag) c1Tag.oninput = (e) => window.tplSetContextualData('balance', { cardAssetsTag: e.target.value });
        const c1Val = container.querySelector('#bal-inp-card1-val');
        if (c1Val) c1Val.oninput = (e) => window.tplSetContextualData('balance', { cardAssetsVal: e.target.value });
        const c1Pct = container.querySelector('#bal-inp-card1-pct');
        if (c1Pct) c1Pct.oninput = (e) => window.tplSetContextualData('balance', { cardAssetsPct: e.target.value });
        const c1Sub = container.querySelector('#bal-inp-card1-sub');
        if (c1Sub) c1Sub.oninput = (e) => window.tplSetContextualData('balance', { cardAssetsSub: e.target.value });

        // Card 2
        const colC2 = container.querySelector('#bal-col-card-status');
        if (colC2) colC2.oninput = (e) => window.tplSetContextualData('balance', { cardStatusDot: e.target.value });
        const c2Tag = container.querySelector('#bal-inp-card2-tag');
        if (c2Tag) c2Tag.oninput = (e) => window.tplSetContextualData('balance', { cardStatusTag: e.target.value });
        const c2Val = container.querySelector('#bal-inp-card2-val');
        if (c2Val) c2Val.oninput = (e) => window.tplSetContextualData('balance', { cardStatusVal: e.target.value });
        const c2Sub = container.querySelector('#bal-inp-card2-sub');
        if (c2Sub) c2Sub.oninput = (e) => window.tplSetContextualData('balance', { cardStatusSub: e.target.value });
        const c2Chk = container.querySelector('#bal-chk-card2-icon');
        if (c2Chk) c2Chk.onchange = (e) => window.tplSetContextualData('balance', { cardStatusCheck: e.target.checked });

        // Card 3
        const colC3 = container.querySelector('#bal-col-card-liab');
        if (colC3) colC3.oninput = (e) => window.tplSetContextualData('balance', { cardLiabDot: e.target.value, liabColor: e.target.value });
        const c3Tag = container.querySelector('#bal-inp-card3-tag');
        if (c3Tag) c3Tag.oninput = (e) => window.tplSetContextualData('balance', { cardLiabTag: e.target.value });
        const c3Val = container.querySelector('#bal-inp-card3-val');
        if (c3Val) c3Val.oninput = (e) => window.tplSetContextualData('balance', { cardLiabVal: e.target.value });
        const c3Pct = container.querySelector('#bal-inp-card3-pct');
        if (c3Pct) c3Pct.oninput = (e) => window.tplSetContextualData('balance', { cardLiabPct: e.target.value });
        const c3Sub = container.querySelector('#bal-inp-card3-sub');
        if (c3Sub) c3Sub.oninput = (e) => window.tplSetContextualData('balance', { cardLiabSub: e.target.value });

        // Card 4
        const colC4 = container.querySelector('#bal-col-card-equity');
        if (colC4) colC4.oninput = (e) => window.tplSetContextualData('balance', { cardEquityDot: e.target.value, equityColor: e.target.value });
        const c4Tag = container.querySelector('#bal-inp-card4-tag');
        if (c4Tag) c4Tag.oninput = (e) => window.tplSetContextualData('balance', { cardEquityTag: e.target.value });
        const c4Val = container.querySelector('#bal-inp-card4-val');
        if (c4Val) c4Val.oninput = (e) => window.tplSetContextualData('balance', { cardEquityVal: e.target.value });
        const c4Pct = container.querySelector('#bal-inp-card4-pct');
        if (c4Pct) c4Pct.oninput = (e) => window.tplSetContextualData('balance', { cardEquityPct: e.target.value });
        const c4Sub = container.querySelector('#bal-inp-card4-sub');
        if (c4Sub) c4Sub.oninput = (e) => window.tplSetContextualData('balance', { cardEquitySub: e.target.value });
      }

      // EVENT LISTENERS: TAB 3 (Timeline Timing)
      if (curTab === 'timing') {
        const rngOrbit = container.querySelector('#bal-rng-orbit');
        if (rngOrbit) {
          rngOrbit.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-orbit'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { sceneOrbitDur: v });
          };
        }

        const rngStampDelay = container.querySelector('#bal-rng-stamp-delay');
        if (rngStampDelay) {
          rngStampDelay.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-stamp-delay'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { stampDelay: v });
          };
        }

        // Sweeps
        const rngSw1 = container.querySelector('#bal-rng-sw1');
        if (rngSw1) {
          rngSw1.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-sw1'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { sweep1Delay: v });
          };
        }
        const colSw1 = container.querySelector('#bal-col-sweep1');
        if (colSw1) colSw1.oninput = (e) => window.tplSetContextualData('balance', { sweep1Color: e.target.value });

        const rngSw2 = container.querySelector('#bal-rng-sw2');
        if (rngSw2) {
          rngSw2.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-sw2'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { sweep2Delay: v });
          };
        }
        const colSw2 = container.querySelector('#bal-col-sweep2');
        if (colSw2) colSw2.oninput = (e) => window.tplSetContextualData('balance', { sweep2Color: e.target.value });

        const rngSwL = container.querySelector('#bal-rng-swliab');
        if (rngSwL) {
          rngSwL.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-swliab'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { sweepLiabDelay: v });
          };
        }
        const colSwL = container.querySelector('#bal-col-sweepliab');
        if (colSwL) colSwL.oninput = (e) => window.tplSetContextualData('balance', { sweepLiabColor: e.target.value });

        const rngSwE = container.querySelector('#bal-rng-sweq');
        if (rngSwE) {
          rngSwE.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-sweq'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { sweepEquityDelay: v });
          };
        }
        const colSwE = container.querySelector('#bal-col-sweepequity');
        if (colSwE) colSwE.oninput = (e) => window.tplSetContextualData('balance', { sweepEquityColor: e.target.value });

        // HUD Card delays
        const rngCA = container.querySelector('#bal-rng-card-a-del');
        if (rngCA) {
          rngCA.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-card-a-del'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { cardAssetsDelay: v });
          };
        }

        const rngCS = container.querySelector('#bal-rng-card-s-del');
        if (rngCS) {
          rngCS.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-card-s-del'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { cardStatusDelay: v });
          };
        }

        const rngCL = container.querySelector('#bal-rng-card-l-del');
        if (rngCL) {
          rngCL.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-card-l-del'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { cardLiabDelay: v });
          };
        }

        const rngCE = container.querySelector('#bal-rng-card-e-del');
        if (rngCE) {
          rngCE.oninput = (e) => {
            const v = parseFloat(e.target.value);
            const lbl = container.querySelector('#bal-lbl-card-e-del'); if (lbl) lbl.textContent = `${v}s`;
            window.tplSetContextualData('balance', { cardEquityDelay: v });
          };
        }
      }

      return;
    }

    // =========================================================================

    // SPECIAL HANDLER: PORTFOLIO ALLOCATION PIE (pie)
    // Allows selecting different portfolio types + customizing slices & percentages
    // =========================================================================
    if (tplId === 'pie') {
      const portfolioPresets = [
        {
          presetName: 'Classic Growth',
          title: 'Portfolio Allocation',
          totalValue: '$100,000',
          slices: [
            { name: 'S&P 500 Index', pct: '50%', color: '#38bdf8' },
            { name: 'Real Estate', pct: '25%', color: '#10b981' },
            { name: 'Bitcoin / Tech', pct: '15%', color: '#f59e0b' },
            { name: 'Treasury Cash', pct: '10%', color: '#a855f7' }
          ]
        },
        {
          presetName: 'Wall St 60/40',
          title: 'Institutional 60/40',
          totalValue: '$250,000',
          slices: [
            { name: 'US Equities', pct: '60%', color: '#38bdf8' },
            { name: 'US Treasuries', pct: '30%', color: '#10b981' },
            { name: 'Gold Bullion', pct: '10%', color: '#f59e0b' }
          ]
        },
        {
          presetName: 'Ray Dalio All-Weather',
          title: 'All-Weather Fund',
          totalValue: '$500,000',
          slices: [
            { name: 'Long-Term Bonds', pct: '40%', color: '#38bdf8' },
            { name: 'Global Stocks', pct: '30%', color: '#10b981' },
            { name: 'Interm. Bonds', pct: '15%', color: '#a855f7' },
            { name: 'Gold & Commod.', pct: '15%', color: '#f59e0b' }
          ]
        },
        {
          presetName: 'Aggressive Tech & AI',
          title: 'High-Beta Growth',
          totalValue: '$180,000',
          slices: [
            { name: 'AI & Semis (NVDA)', pct: '45%', color: '#10b981' },
            { name: 'Nasdaq 100 (QQQ)', pct: '30%', color: '#38bdf8' },
            { name: 'Bitcoin (BTC)', pct: '15%', color: '#f59e0b' },
            { name: 'Venture / Cash', pct: '10%', color: '#ec4899' }
          ]
        },
        {
          presetName: 'Dividend & Real Estate',
          title: 'Cashflow Portfolio',
          totalValue: '$420,000',
          slices: [
            { name: 'Multifamily REITs', pct: '40%', color: '#10b981' },
            { name: 'Dividend ETF (SCHD)', pct: '35%', color: '#38bdf8' },
            { name: 'Private Credit', pct: '15%', color: '#a855f7' },
            { name: 'T-Bills (5.2%)', pct: '10%', color: '#f59e0b' }
          ]
        }
      ];
      const slices = Array.isArray(data.slices) ? data.slices : portfolioPresets[0].slices;
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(56,189,248,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">\ud83d\udcca Portfolio Strategy & Slices</span>
            <span style="font-size: 9px; color: #10b981; font-weight: 700; background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: 4px;">LIVE DONUT</span>
          </div>

          <!-- Portfolio Type Preset Selector -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Select Portfolio Type</span>
            <select id="pie-preset-select" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(56,189,248,0.35); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none; cursor: pointer;">
              ${portfolioPresets.map((p, i) => `<option value="${i}" ${data.presetName === p.presetName ? 'selected' : ''} style="background:#0f172a;color:#fff;">${p.presetName} \u2014 ${p.title}</option>`).join('')}
            </select>
          </div>

          <!-- Title & Total Value -->
          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Header Title</span>
              <input type="text" id="pie-inp-title" value="${data.title || 'Portfolio Allocation'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 7px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Total AUM Value</span>
              <input type="text" id="pie-inp-total" value="${data.totalValue || '$100,000'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 7px; color: #10b981; font-family: monospace; font-size: 10.5px; font-weight: 700; outline: none;" />
            </div>
          </div>

          <!-- Asset Slices Editor -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Asset Allocation Slices</span>
            ${slices.map((s, idx) => `
              <div style="display: grid; grid-template-columns: 22px 1fr 58px; gap: 6px; align-items: center; background: rgba(0,0,0,0.35); padding: 5px 7px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
                <input type="color" class="pie-slice-col" data-idx="${idx}" value="${s.color || '#38bdf8'}" style="width: 20px; height: 20px; border: none; background: transparent; cursor: pointer;" />
                <input type="text" class="pie-slice-name" data-idx="${idx}" value="${s.name}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10.5px; outline: none;" />
                <input type="text" class="pie-slice-pct" data-idx="${idx}" value="${s.pct}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 4px 6px; color: #38bdf8; font-family: monospace; font-size: 10.5px; font-weight: 700; text-align: right; outline: none;" />
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const pSel = container.querySelector('#pie-preset-select');
      if (pSel) {
        pSel.onchange = (e) => {
          const p = portfolioPresets[parseInt(e.target.value, 10)];
          if (p) {
            window.tplSetContextualData('pie', {
              presetName: p.presetName,
              title: p.title,
              totalValue: p.totalValue,
              slices: JSON.parse(JSON.stringify(p.slices))
            });
            window.tplRenderContextualInspector('pie');
          }
        };
      }
      const tInp = container.querySelector('#pie-inp-title');
      if (tInp) tInp.oninput = (e) => window.tplSetContextualData('pie', { title: e.target.value });
      const totInp = container.querySelector('#pie-inp-total');
      if (totInp) totInp.oninput = (e) => window.tplSetContextualData('pie', { totalValue: e.target.value });

      const updateSlice = (idx, field, val) => {
        const next = slices.map((item, i) => i === idx ? { ...item, [field]: val } : item);
        window.tplSetContextualData('pie', { slices: next });
      };
      container.querySelectorAll('.pie-slice-col').forEach(inp => {
        inp.oninput = (e) => updateSlice(parseInt(inp.dataset.idx, 10), 'color', e.target.value);
      });
      container.querySelectorAll('.pie-slice-name').forEach(inp => {
        inp.oninput = (e) => updateSlice(parseInt(inp.dataset.idx, 10), 'name', e.target.value);
      });
      container.querySelectorAll('.pie-slice-pct').forEach(inp => {
        inp.oninput = (e) => updateSlice(parseInt(inp.dataset.idx, 10), 'pct', e.target.value);
      });
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: HORMOZI WORD-BY-WORD CAPTIONS (hormozi)
    // Supports uploading background Video/Image B-roll + Transparent Overlay
    // =========================================================================
    if (tplId === 'hormozi') {
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(250,204,21,0.28); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #facc15; text-transform: uppercase;">\u26a1 Dynamic Captions & Video B-Roll</span>
            <span style="font-size: 9px; color: #facc15; font-weight: 700; background: rgba(250,204,21,0.15); padding: 2px 6px; border-radius: 4px;">OVERLAY READY</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Caption Phrase (Word-by-Word)</span>
            <input type="text" id="hz-inp-caption" value="${data.caption || 'NEVER TRADE YOUR TIME FOR MONEY'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: end;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Highlighted Keyword</span>
              <input type="text" id="hz-inp-kw" value="${data.keyword || 'TIME'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #facc15; font-size: 11px; font-weight: 700; outline: none;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px; align-items: center;">
              <span style="font-size: 9px; color: #94a3b8;">Color</span>
              <input type="color" id="hz-inp-col" value="${data.keyColor || '#facc15'}" style="width: 30px; height: 26px; border: none; background: transparent; cursor: pointer;" />
            </div>
          </div>

          <!-- Background Video / Image Uploader -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 10.5px; font-weight: 700; color: #fff;">Background Video / Image</span>
              <span style="font-size: 9px; color: #94a3b8;">${data.bgMedia ? 'Custom video/image active on stage' : 'Upload MP4/WebM video or photo backdrop'}</span>
            </div>
            <label for="hz-upload-media" style="font-size: 10px; font-weight: 700; color: #0f172a; background: #facc15; padding: 5px 10px; border-radius: 6px; cursor: pointer;">
              + Upload Video/Img
              <input type="file" id="hz-upload-media" accept="video/*,image/*" style="display: none;" />
            </label>
          </div>

          <!-- Toggles for Transparent Overlay & Emoji Accents -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px;">
            <label style="display:flex;align-items:center;gap:6px;font-size:10px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="hz-inp-trans" ${data.transparentBg ? 'checked' : ''} style="accent-color:#facc15;" />
              Transparent Video Overlay
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:10px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="hz-inp-emoji" ${data.showEmoji ? 'checked' : ''} style="accent-color:#facc15;" />
              Show Emoji Accents
            </label>
          </div>
        </div>
      `;

      const cInp = container.querySelector('#hz-inp-caption');
      if (cInp) cInp.oninput = (e) => window.tplSetContextualData('hormozi', { caption: e.target.value });
      const kwInp = container.querySelector('#hz-inp-kw');
      if (kwInp) kwInp.oninput = (e) => window.tplSetContextualData('hormozi', { keyword: e.target.value });
      const colInp = container.querySelector('#hz-inp-col');
      if (colInp) colInp.oninput = (e) => window.tplSetContextualData('hormozi', { keyColor: e.target.value });
      const upInp = container.querySelector('#hz-upload-media');
      if (upInp) {
        upInp.onchange = (e) => {
          const f = e.target.files && e.target.files[0];
          if (f) {
            const url = URL.createObjectURL(f);
            const isVid = f.type.startsWith('video/');
            window.tplSetContextualData('hormozi', { bgMedia: url, bgMediaType: isVid ? 'video' : 'image' });
            window.tplRenderContextualInspector('hormozi');
          }
        };
      }
      const trInp = container.querySelector('#hz-inp-trans');
      if (trInp) trInp.onchange = (e) => window.tplSetContextualData('hormozi', { transparentBg: e.target.checked });
      const emInp = container.querySelector('#hz-inp-emoji');
      if (emInp) emInp.onchange = (e) => window.tplSetContextualData('hormozi', { showEmoji: e.target.checked });
      return;
    }

    const fontOptionsHtml = (selectedFont) => [
      { label: 'Space Grotesk', val: "'Space Grotesk', sans-serif" },
      { label: 'Cinzel Serif', val: "'Cinzel', Georgia, serif" },
      { label: 'Impact Bold', val: 'Impact, sans-serif' },
      { label: 'Montserrat', val: "'Montserrat', sans-serif" },
      { label: 'JetBrains Mono', val: "'JetBrains Mono', monospace" },
      { label: 'Inter', val: "'Inter', sans-serif" },
      { label: 'Playfair Display', val: "'Playfair Display', serif" }
    ].map(f => `<option value="${f.val}" ${f.val === selectedFont ? 'selected' : ''} style="background:#0f172a;color:#fff;">${f.label}</option>`).join('');

    // =========================================================================
    // SPECIAL HANDLER: 3D PRODUCT ZOOM & SPIN (zoom)
    // =========================================================================
    if (tplId === 'zoom') {
      if (wrapSec) wrapSec.style.display = 'none';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(56,189,248,0.28); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">\u2b21 3D Product Studio &amp; Typography</span>
            <span style="font-size: 9px; color: #c084fc; font-weight: 700; background: rgba(168,85,247,0.18); padding: 2px 6px; border-radius: 4px;">DRAGGABLE HUD</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Product Headline</span>
              <input type="text" id="zm-inp-name" value="${data.productName || 'TITAN VELOX X1'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Spec Badge / Subtitle</span>
              <input type="text" id="zm-inp-sub" value="${data.productSub || 'GRADE-5 TITANIUM'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fbbf24; font-size: 11px; font-weight: 700; outline: none;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr auto auto; gap: 6px; align-items: end;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Font Family</span>
              <select id="zm-inp-font" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 6px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;">
                ${fontOptionsHtml(data.titleFont || "'Space Grotesk', sans-serif")}
              </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Size: <b id="zm-lbl-sz" style="color:#38bdf8;">${data.titleSize || 26}px</b></span>
              <input type="range" id="zm-inp-size" min="14" max="54" step="1" value="${data.titleSize || 26}" style="width:100%; accent-color:#38bdf8;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Title</span>
              <input type="color" id="zm-inp-tcol" value="${data.titleColor || '#f8fafc'}" style="width:24px;height:24px;border:none;background:transparent;cursor:pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Spec</span>
              <input type="color" id="zm-inp-scol" value="${data.subColor || '#fbbf24'}" style="width:24px;height:24px;border:none;background:transparent;cursor:pointer;" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 7px 10px;">
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 10px; font-weight: 700; color: #fff;">3D Product Render Asset</span>
              <span style="font-size: 8.5px; color: #94a3b8;">Drag title or product directly on stage</span>
            </div>
            <label style="font-size: 9.5px; font-weight: 700; color: #fff; background: rgba(168,85,247,0.28); border: 1px solid #c084fc; padding: 4px 10px; border-radius: 5px; cursor: pointer;">
              Swap Product
              <input type="file" id="zm-inp-img" accept="image/*" style="display:none;" />
            </label>
          </div>

          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;
      container.querySelector('#zm-inp-name')?.addEventListener('input', e => window.tplSetContextualData('zoom', { productName: e.target.value }));
      container.querySelector('#zm-inp-sub')?.addEventListener('input', e => window.tplSetContextualData('zoom', { productSub: e.target.value }));
      container.querySelector('#zm-inp-font')?.addEventListener('change', e => window.tplSetContextualData('zoom', { titleFont: e.target.value }));
      container.querySelector('#zm-inp-size')?.addEventListener('input', e => {
        const v = parseInt(e.target.value, 10);
        const l = container.querySelector('#zm-lbl-sz'); if (l) l.textContent = v + 'px';
        window.tplSetContextualData('zoom', { titleSize: v });
      });
      container.querySelector('#zm-inp-tcol')?.addEventListener('input', e => window.tplSetContextualData('zoom', { titleColor: e.target.value }));
      container.querySelector('#zm-inp-scol')?.addEventListener('input', e => window.tplSetContextualData('zoom', { subColor: e.target.value }));
      container.querySelector('#zm-inp-img')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) window.tplSetContextualData('zoom', { productImg: URL.createObjectURL(f) });
      });
      window.tplWireUniversalBgControls('zoom', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: POLAROID STACK (polaroid)
    // =========================================================================
    if (tplId === 'polaroid') {
      if (wrapSec) wrapSec.style.display = 'none';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(251,191,36,0.28); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">\ud83d\udcf8 Polaroid Stack &amp; Stage Freedom</span>
            <button type="button" id="pol-btn-reset" style="font-size: 9px; color: #cbd5e1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 2px 7px; border-radius: 4px; cursor: pointer;">\u21ba Reset Layout</button>
          </div>

          <div style="font-size: 9.5px; color: #cbd5e1; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); padding: 6px 8px; border-radius: 6px;">
            \ud83d\udca1 <b>Full-Screen Interactive:</b> Drag either Polaroid directly on the preview stage to reposition, or use the scale &amp; tilt sliders below.
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.07); border-radius: 7px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:9.5px;font-weight:800;color:#f8fafc;">POLAROID #1 (LEFT)</span>
                <label style="font-size:9px;font-weight:700;color:#38bdf8;cursor:pointer;">+ Photo<input type="file" id="pol-up-1" accept="image/*" style="display:none;"/></label>
              </div>
              <input type="text" id="pol-cap-1" value="${data.caption || 'First Office, 1994'}" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.12);border-radius:5px;padding:4px 6px;color:#fff;font-size:10.5px;" />
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;"><span>Tilt Angle</span><b id="pol-rot1-lbl" style="color:#fbbf24;">${data.p1Rot != null ? data.p1Rot : -11}\u00b0</b></div>
              <input type="range" id="pol-rot-1" min="-35" max="35" step="1" value="${data.p1Rot != null ? data.p1Rot : -11}" style="width:100%;accent-color:#fbbf24;" />
            </div>

            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.07); border-radius: 7px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:9.5px;font-weight:800;color:#f8fafc;">POLAROID #2 (RIGHT)</span>
                <label style="font-size:9px;font-weight:700;color:#38bdf8;cursor:pointer;">+ Photo<input type="file" id="pol-up-2" accept="image/*" style="display:none;"/></label>
              </div>
              <input type="text" id="pol-cap-2" value="${data.caption2 || 'Archive Exhibit #04'}" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.12);border-radius:5px;padding:4px 6px;color:#fff;font-size:10.5px;" />
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;"><span>Tilt Angle</span><b id="pol-rot2-lbl" style="color:#fbbf24;">${data.p2Rot != null ? data.p2Rot : 7}\u00b0</b></div>
              <input type="range" id="pol-rot-2" min="-35" max="35" step="1" value="${data.p2Rot != null ? data.p2Rot : 7}" style="width:100%;accent-color:#fbbf24;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#cbd5e1;"><span>Polaroid Frame Scale (Full-Screen Size)</span><b id="pol-scale-lbl" style="color:#38bdf8;">${Math.round((data.polaroidScale || 1) * 100)}%</b></div>
            <input type="range" id="pol-inp-scale" min="0.6" max="1.8" step="0.05" value="${data.polaroidScale || 1}" style="width:100%;accent-color:#38bdf8;" />
          </div>

          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;
      container.querySelector('#pol-cap-1')?.addEventListener('input', e => window.tplSetContextualData('polaroid', { caption: e.target.value }));
      container.querySelector('#pol-cap-2')?.addEventListener('input', e => window.tplSetContextualData('polaroid', { caption2: e.target.value }));
      container.querySelector('#pol-rot-1')?.addEventListener('input', e => {
        const v = parseInt(e.target.value, 10);
        const l = container.querySelector('#pol-rot1-lbl'); if (l) l.textContent = v + '\u00b0';
        window.tplSetContextualData('polaroid', { p1Rot: v });
      });
      container.querySelector('#pol-rot-2')?.addEventListener('input', e => {
        const v = parseInt(e.target.value, 10);
        const l = container.querySelector('#pol-rot2-lbl'); if (l) l.textContent = v + '\u00b0';
        window.tplSetContextualData('polaroid', { p2Rot: v });
      });
      container.querySelector('#pol-inp-scale')?.addEventListener('input', e => {
        const v = parseFloat(e.target.value);
        const l = container.querySelector('#pol-scale-lbl'); if (l) l.textContent = Math.round(v * 100) + '%';
        window.tplSetContextualData('polaroid', { polaroidScale: v });
      });
      container.querySelector('#pol-up-1')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) window.tplSetContextualData('polaroid', { photo1: URL.createObjectURL(f) });
      });
      container.querySelector('#pol-up-2')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) window.tplSetContextualData('polaroid', { photo2: URL.createObjectURL(f) });
      });
      container.querySelector('#pol-btn-reset')?.addEventListener('click', () => {
        window.tplSetContextualData('polaroid', { polaroidScale: 1.0, p1Rot: -11, p2Rot: 7, p1X: -78, p1Y: -6, p2X: 72, p2Y: 10 });
        window.tplRenderContextualInspector('polaroid');
      });
      window.tplWireUniversalBgControls('polaroid', container);
      return;
    }

    // =========================================================================
    // =========================================================================
    // SPECIAL HANDLER: INTERVIEW CUT-IN CINEMATIC OVERLAY (interview-cutin)
    // =========================================================================
    if (tplId === 'interview-cutin') {
      if (wrapSec) wrapSec.style.display = 'none';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #f87171; text-transform: uppercase;">🎙️ Interview Cut-In &amp; Glass Lower-Third</span>
            <span style="font-size: 9px; color: #10b981; font-weight: 700; background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: 4px;">BROADCAST READY</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 10px; font-weight: 700; color: #cbd5e1;">Interview Footage / Photo</span>
            <div style="display: flex; gap: 5px;">
              <label style="font-size: 9.5px; font-weight: 800; color: #ffffff; background: #ef4444; padding: 5px 9px; border-radius: 5px; cursor: pointer; white-space: nowrap;">
                + Upload Footage
                <input type="file" id="interview-up-photo" accept="image/*,video/*" style="display:none;" />
              </label>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Subject Name</span>
            <input type="text" id="interview-inp-name" value="${data.subjectName || 'JOHN DOE'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; color: #fff; font-size: 11px; font-weight: 700;" placeholder="JOHN DOE" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Title / Affiliation Subtitle</span>
            <input type="text" id="interview-inp-title" value="${data.subjectTitle || 'FORMER CEO, COMPANY INC.'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; color: #fff; font-size: 11px;" placeholder="FORMER CEO, COMPANY INC." />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Category / Meta Tag</span>
              <input type="text" id="interview-inp-meta" value="${data.metaTag || 'INTERVIEW / EXPERT ANALYSIS'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 10px;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Broadcast Timecode</span>
              <input type="text" id="interview-inp-tc" value="${data.timecode || 'TC: 01:24:03'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 10px;" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Micro-UI Accent Color</span>
            <input type="color" id="interview-inp-acol" value="${data.accentColor || '#ef4444'}" style="width: 28px; height: 24px; border: none; border-radius: 4px; background: transparent; cursor: pointer;" />
          </div>
        </div>
      `;
      container.querySelector('#interview-inp-name')?.addEventListener('input', e => window.tplSetContextualData('interview-cutin', { subjectName: e.target.value }));
      container.querySelector('#interview-inp-title')?.addEventListener('input', e => window.tplSetContextualData('interview-cutin', { subjectTitle: e.target.value }));
      container.querySelector('#interview-inp-meta')?.addEventListener('input', e => window.tplSetContextualData('interview-cutin', { metaTag: e.target.value }));
      container.querySelector('#interview-inp-tc')?.addEventListener('input', e => window.tplSetContextualData('interview-cutin', { timecode: e.target.value }));
      container.querySelector('#interview-inp-acol')?.addEventListener('input', e => window.tplSetContextualData('interview-cutin', { accentColor: e.target.value }));
      container.querySelector('#interview-up-photo')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) {
          const url = URL.createObjectURL(f);
          window.tplSetContextualData('interview-cutin', { interviewBg: url });
        }
      });
      window.tplWireUniversalBgControls('interview-cutin', container);
      return;
    }

    // SPECIAL HANDLER: CEO PORTRAIT REVEAL (ceo-portrait)
    // =========================================================================
    if (tplId === 'ceo-portrait') {
      if (wrapSec) wrapSec.style.display = 'none';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(251,191,36,0.3); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">\ud83d\udc54 CEO Cutout Reveal &amp; Executive Dossier</span>
            <span style="font-size: 9px; color: #10b981; font-weight: 700; background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: 4px;">AI CUTOUT READY</span>
          </div>

          <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(251,191,36,0.28); border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 10px; font-weight: 800; color: #fff;">CEO Portrait Photo / Cutout</span>
              <span style="font-size: 8.5px; color: #94a3b8;">Upload any portrait \u2014 auto-cutout removes background</span>
            </div>
            <div style="display: flex; gap: 5px;">
              <label style="font-size: 9.5px; font-weight: 800; color: #0f172a; background: #fbbf24; padding: 5px 9px; border-radius: 5px; cursor: pointer; white-space: nowrap;">
                + Upload Photo
                <input type="file" id="ceo-up-photo" accept="image/*" style="display:none;" />
              </label>
              <button type="button" id="ceo-btn-cutout" style="font-size: 9.5px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.4); padding: 5px 8px; border-radius: 5px; cursor: pointer; white-space: nowrap;" title="Run Subject Cutout Isolation">\u2702\ufe0f Auto-Cutout</button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Executive Name</span>
            <input type="text" id="ceo-inp-name" value="${data.ceoName || 'ALEXANDER VANCE'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 700;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Role / Company</span>
              <input type="text" id="ceo-inp-role" value="${data.ceoRole || 'CHIEF EXECUTIVE OFFICER \u00b7 VANGUARD GLOBAL'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #cbd5e1; font-size: 10px; font-weight: 600;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Dossier Header Tag</span>
              <input type="text" id="ceo-inp-badge" value="${data.ceoBadge || 'EXECUTIVE DOSSIER // VERIFIED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fbbf24; font-size: 10px; font-weight: 700;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr auto auto; gap: 6px; align-items: end;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Font</span>
              <select id="ceo-inp-font" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 6px; color: #fff; font-size: 10.5px;">
                ${fontOptionsHtml(data.fontFamily || "'Space Grotesk', sans-serif")}
              </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Portrait Scale: <b id="ceo-sc-lbl" style="color:#fbbf24;">${Math.round((data.portraitScale || 1) * 100)}%</b></span>
              <input type="range" id="ceo-inp-scale" min="0.7" max="1.6" step="0.05" value="${data.portraitScale || 1}" style="width:100%;accent-color:#fbbf24;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Name</span>
              <input type="color" id="ceo-inp-ncol" value="${data.nameColor || '#ffffff'}" style="width:24px;height:24px;border:none;background:transparent;cursor:pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Accent</span>
              <input type="color" id="ceo-inp-acol" value="${data.accentColor || '#fbbf24'}" style="width:24px;height:24px;border:none;background:transparent;cursor:pointer;" />
            </div>
          </div>

          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;
      container.querySelector('#ceo-inp-name')?.addEventListener('input', e => window.tplSetContextualData('ceo-portrait', { ceoName: e.target.value }));
      container.querySelector('#ceo-inp-role')?.addEventListener('input', e => window.tplSetContextualData('ceo-portrait', { ceoRole: e.target.value }));
      container.querySelector('#ceo-inp-badge')?.addEventListener('input', e => window.tplSetContextualData('ceo-portrait', { ceoBadge: e.target.value }));
      container.querySelector('#ceo-inp-font')?.addEventListener('change', e => window.tplSetContextualData('ceo-portrait', { fontFamily: e.target.value }));
      container.querySelector('#ceo-inp-scale')?.addEventListener('input', e => {
        const v = parseFloat(e.target.value);
        const l = container.querySelector('#ceo-sc-lbl'); if (l) l.textContent = Math.round(v * 100) + '%';
        window.tplSetContextualData('ceo-portrait', { portraitScale: v });
      });
      container.querySelector('#ceo-inp-ncol')?.addEventListener('input', e => window.tplSetContextualData('ceo-portrait', { nameColor: e.target.value }));
      container.querySelector('#ceo-inp-acol')?.addEventListener('input', e => window.tplSetContextualData('ceo-portrait', { accentColor: e.target.value }));
      container.querySelector('#ceo-up-photo')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) {
          const url = URL.createObjectURL(f);
          window.tplSetContextualData('ceo-portrait', { cutoutUrl: url });
        }
      });
      container.querySelector('#ceo-btn-cutout')?.addEventListener('click', () => {
        const curUrl = (window.tplGetContextualData('ceo-portrait').cutoutUrl) || '/ceo_portrait_cutout.jpg';
        if (typeof generateCutoutCanvasForUrl === 'function') {
          generateCutoutCanvasForUrl(curUrl, (c) => {
            if (c) window.tplSetContextualData('ceo-portrait', { cutoutUrl: c.toDataURL() });
          });
        }
      });
      window.tplWireUniversalBgControls('ceo-portrait', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: POWER MEETING CINEMATIC ENGINE (power-meeting)
    // =========================================================================
    if (tplId === 'power-meeting') {
      if (wrapSec) wrapSec.style.display = 'none';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(251,191,36,0.28); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">💼 Power Meeting Cinematic Engine</span>
            <label style="font-size: 9px; font-weight: 800; color: #0f172a; background: #fbbf24; padding: 3px 8px; border-radius: 4px; cursor: pointer;">
              + Swap Scene Plate
              <input type="file" id="pm-up-scene" accept="image/*" style="display:none;" />
            </label>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Overhead Spotlight Warmth</span>
              <input type="range" id="pm-rng-spot" min="20" max="150" value="${data.spotlightWarmth || 85}" style="accent-color: #fbbf24;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Atmospheric Fog Density</span>
              <input type="range" id="pm-rng-fog" min="10" max="150" value="${data.fogDensity || 75}" style="accent-color: #fbbf24;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Depth of Field Blur (f/2.8)</span>
              <input type="range" id="pm-rng-dof" min="0" max="150" value="${data.dofIntensity || 80}" style="accent-color: #fbbf24;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Accent Gold Tint</span>
              <input type="color" id="pm-inp-acol" value="${data.accentColor || '#fbbf24'}" style="width: 100%; height: 26px; border: none; border-radius: 4px; background: transparent; cursor: pointer;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Summit Briefing Title</span>
            <input type="text" id="pm-inp-hl" value="${data.headline || 'POWER MEETING'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 700;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Negotiation Subline</span>
            <input type="text" id="pm-inp-sub" value="${data.subline || 'SILHOUETTES · HIGH-STAKES NEGOTIATION'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px;" />
          </div>
        </div>
      `;

      container.querySelector('#pm-rng-spot')?.addEventListener('input', e => window.tplSetContextualData('power-meeting', { spotlightWarmth: parseInt(e.target.value, 10) }));
      container.querySelector('#pm-rng-fog')?.addEventListener('input', e => window.tplSetContextualData('power-meeting', { fogDensity: parseInt(e.target.value, 10) }));
      container.querySelector('#pm-rng-dof')?.addEventListener('input', e => window.tplSetContextualData('power-meeting', { dofIntensity: parseInt(e.target.value, 10) }));
      container.querySelector('#pm-inp-hl')?.addEventListener('input', e => window.tplSetContextualData('power-meeting', { headline: e.target.value }));
      container.querySelector('#pm-inp-sub')?.addEventListener('input', e => window.tplSetContextualData('power-meeting', { subline: e.target.value }));
      container.querySelector('#pm-inp-acol')?.addEventListener('input', e => window.tplSetContextualData('power-meeting', { accentColor: e.target.value }));
      container.querySelector('#pm-up-scene')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) window.tplSetContextualData('power-meeting', { meetingBg: URL.createObjectURL(f) });
      });
      window.tplWireUniversalBgControls('power-meeting', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: BOARDROOM ZOOM (boardroom-zoom)
    // =========================================================================
    if (tplId === 'boardroom-zoom') {
      if (wrapSec) wrapSec.style.display = 'none';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(251,191,36,0.28); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">\ud83c\udfe2 Corporate Boardroom Zoom &amp; Lower-Third</span>
            <label style="font-size: 9px; font-weight: 800; color: #0f172a; background: #fbbf24; padding: 3px 8px; border-radius: 4px; cursor: pointer;">
              + Swap Boardroom Photo
              <input type="file" id="br-up-scene" accept="image/*" style="display:none;" />
            </label>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Summit Headline</span>
            <input type="text" id="br-inp-hl" value="${data.headline || 'EMERGENCY BOARDROOM SUMMIT'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 700;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 6px; align-items: end;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Location / Deal Subline</span>
              <input type="text" id="br-inp-sub" value="${data.subline || '42ND FLOOR \u00b7 MANHATTAN HQ // $14.8B MERGER VOTE'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fbbf24; font-size: 10px; font-weight: 700;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Text</span>
              <input type="color" id="br-inp-tcol" value="${data.textColor || '#f8fafc'}" style="width:24px;height:24px;border:none;background:transparent;cursor:pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Accent</span>
              <input type="color" id="br-inp-acol" value="${data.accentColor || '#fbbf24'}" style="width:24px;height:24px;border:none;background:transparent;cursor:pointer;" />
            </div>
          </div>

          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;
      container.querySelector('#br-inp-hl')?.addEventListener('input', e => window.tplSetContextualData('boardroom-zoom', { headline: e.target.value }));
      container.querySelector('#br-inp-sub')?.addEventListener('input', e => window.tplSetContextualData('boardroom-zoom', { subline: e.target.value }));
      container.querySelector('#br-inp-tcol')?.addEventListener('input', e => window.tplSetContextualData('boardroom-zoom', { textColor: e.target.value }));
      container.querySelector('#br-inp-acol')?.addEventListener('input', e => window.tplSetContextualData('boardroom-zoom', { accentColor: e.target.value }));
      container.querySelector('#br-up-scene')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) window.tplSetContextualData('boardroom-zoom', { sceneUrl: URL.createObjectURL(f) });
      });
      window.tplWireUniversalBgControls('boardroom-zoom', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: ZOOM BLUR BURST (zoom-blur)
    // =========================================================================
    if (tplId === 'zoom-blur') {
      if (wrapSec) wrapSec.style.display = 'none';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(56,189,248,0.35); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span>
              <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">Zoom Blur Burst · Editorial Combo</span>
            </div>
            <button type="button" id="zb-btn-trigger-burst" style="font-size: 9px; font-weight: 800; color: #0284c7; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.5); padding: 3px 8px; border-radius: 4px; cursor: pointer;">
              ⚡ Trigger Burst
            </button>
          </div>

          <!-- Headline & Kicker -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Kinetic Headline (Bursts forward)</span>
            <input type="text" id="zb-inp-hl" value="${data.headline || 'THE MASTERMIND'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Top Accolade / Kicker</span>
              <input type="text" id="zb-inp-kic" value="${data.kicker || '[ 00:01:28 · TARGET IDENTIFIED ]'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 4px 6px; color: #fbbf24; font-size: 9.5px; font-weight: 700;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Subline</span>
              <input type="text" id="zb-inp-sub" value="${data.subline || 'RADIAL BURST // PIN-SHARP CUTOUT'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 4px 6px; color: #38bdf8; font-size: 9.5px; font-weight: 700;" />
            </div>
          </div>

          <!-- Color Pickers -->
          <div style="display: flex; gap: 12px; align-items: center; background: rgba(0,0,0,0.25); padding: 6px 10px; border-radius: 6px;">
            <div style="display: flex; gap: 4px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Headline:</span>
              <input type="color" id="zb-inp-tcol" value="${data.textColor || '#ffffff'}" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;" />
            </div>
            <div style="display: flex; gap: 4px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Accent Cyan:</span>
              <input type="color" id="zb-inp-acol" value="${data.accentColor || '#38bdf8'}" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;" />
            </div>
            <div style="display: flex; gap: 4px; align-items: center;">
              <span style="font-size: 8.5px; color: #94a3b8;">Kicker Amber:</span>
              <input type="color" id="zb-inp-kcol" value="${data.kickerColor || '#fbbf24'}" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;" />
            </div>
          </div>

          <!-- Subject Cutout Preset Switcher -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Foreground Cutout Subject</span>
              <label style="font-size: 8.5px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.4); padding: 2px 6px; border-radius: 3px; cursor: pointer;">
                + Upload Cutout
                <input type="file" id="zb-up-cutout" accept="image/*" style="display:none;" />
              </label>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
              <button type="button" class="zb-preset-cutout-btn" data-cutout="/ceo_portrait_alpha_cutout.png" style="background: ${data.subjectUrl === '/ceo_portrait_alpha_cutout.png' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${data.subjectUrl === '/ceo_portrait_alpha_cutout.png' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; color: #e2e8f0; font-size: 8.5px; font-weight: 700; padding: 4px; border-radius: 4px; cursor: pointer;">
                Executive CEO
              </button>
              <button type="button" class="zb-preset-cutout-btn" data-cutout="/laptop_guy_cutout.png" style="background: ${data.subjectUrl === '/laptop_guy_cutout.png' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${data.subjectUrl === '/laptop_guy_cutout.png' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; color: #e2e8f0; font-size: 8.5px; font-weight: 700; padding: 4px; border-radius: 4px; cursor: pointer;">
                Investigator
              </button>
              <button type="button" class="zb-preset-cutout-btn" data-cutout="/hiker_cutout_clean_final.png" style="background: ${data.subjectUrl === '/hiker_cutout_clean_final.png' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${data.subjectUrl === '/hiker_cutout_clean_final.png' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; color: #e2e8f0; font-size: 8.5px; font-weight: 700; padding: 4px; border-radius: 4px; cursor: pointer;">
                Outdoor Figure
              </button>
            </div>
          </div>

          <!-- Background Scene Preset Switcher -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Background Scene (Radial Blur Pass)</span>
              <label style="font-size: 8.5px; font-weight: 700; color: #fbbf24; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); padding: 2px 6px; border-radius: 3px; cursor: pointer;">
                + Upload Scene
                <input type="file" id="zb-up-scene" accept="image/*" style="display:none;" />
              </label>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
              <button type="button" class="zb-preset-scene-btn" data-scene="/boardroom_scene_hd.jpg" style="background: ${data.sceneUrl === '/boardroom_scene_hd.jpg' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${data.sceneUrl === '/boardroom_scene_hd.jpg' ? '#fbbf24' : 'rgba(255,255,255,0.1)'}; color: #e2e8f0; font-size: 8px; font-weight: 700; padding: 4px; border-radius: 4px; cursor: pointer;">
                Boardroom
              </button>
              <button type="button" class="zb-preset-scene-btn" data-scene="/tokyo_1987_cinematic.jpg" style="background: ${data.sceneUrl === '/tokyo_1987_cinematic.jpg' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${data.sceneUrl === '/tokyo_1987_cinematic.jpg' ? '#fbbf24' : 'rgba(255,255,255,0.1)'}; color: #e2e8f0; font-size: 8px; font-weight: 700; padding: 4px; border-radius: 4px; cursor: pointer;">
                Tokyo Night
              </button>
              <button type="button" class="zb-preset-scene-btn" data-scene="/clean_terminal_warroom_plate.png" style="background: ${data.sceneUrl === '/clean_terminal_warroom_plate.png' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${data.sceneUrl === '/clean_terminal_warroom_plate.png' ? '#fbbf24' : 'rgba(255,255,255,0.1)'}; color: #e2e8f0; font-size: 8px; font-weight: 700; padding: 4px; border-radius: 4px; cursor: pointer;">
                War Room
              </button>
              <button type="button" class="zb-preset-scene-btn" data-scene="/cctv_surveillance_scene.jpg" style="background: ${data.sceneUrl === '/cctv_surveillance_scene.jpg' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${data.sceneUrl === '/cctv_surveillance_scene.jpg' ? '#fbbf24' : 'rgba(255,255,255,0.1)'}; color: #e2e8f0; font-size: 8px; font-weight: 700; padding: 4px; border-radius: 4px; cursor: pointer;">
                Bank CCTV
              </button>
            </div>
          </div>

          <!-- Sliders: Blur Intensity & Shutter -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Radial Blur Intensity</span>
                <span id="zb-lbl-blur">${data.blurIntensity || 14}px</span>
              </div>
              <input type="range" id="zb-rng-blur" min="4" max="28" value="${data.blurIntensity || 14}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Forward Burst Zoom</span>
                <span id="zb-lbl-zoom">${((data.zoomScale || 1.35) * 100).toFixed(0)}%</span>
              </div>
              <input type="range" id="zb-rng-zoom" min="110" max="170" value="${Math.round((data.zoomScale || 1.35) * 100)}" style="width: 100%; accent-color: #fbbf24;" />
            </div>
          </div>
        </div>
      `;

      container.querySelector('#zb-inp-hl')?.addEventListener('input', e => window.tplSetContextualData('zoom-blur', { headline: e.target.value }));
      container.querySelector('#zb-inp-kic')?.addEventListener('input', e => window.tplSetContextualData('zoom-blur', { kicker: e.target.value }));
      container.querySelector('#zb-inp-sub')?.addEventListener('input', e => window.tplSetContextualData('zoom-blur', { subline: e.target.value }));
      container.querySelector('#zb-inp-tcol')?.addEventListener('input', e => window.tplSetContextualData('zoom-blur', { textColor: e.target.value }));
      container.querySelector('#zb-inp-acol')?.addEventListener('input', e => window.tplSetContextualData('zoom-blur', { accentColor: e.target.value }));
      container.querySelector('#zb-inp-kcol')?.addEventListener('input', e => window.tplSetContextualData('zoom-blur', { kickerColor: e.target.value }));

      container.querySelectorAll('.zb-preset-cutout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const c = btn.getAttribute('data-cutout');
          window.tplSetContextualData('zoom-blur', { subjectUrl: c });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('zoom-blur');
        });
      });

      container.querySelectorAll('.zb-preset-scene-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = btn.getAttribute('data-scene');
          window.tplSetContextualData('zoom-blur', { sceneUrl: s });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('zoom-blur');
        });
      });

      container.querySelector('#zb-up-cutout')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) {
          window.tplSetContextualData('zoom-blur', { subjectUrl: URL.createObjectURL(f) });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('zoom-blur');
        }
      });

      container.querySelector('#zb-up-scene')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) {
          window.tplSetContextualData('zoom-blur', { sceneUrl: URL.createObjectURL(f) });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('zoom-blur');
        }
      });

      container.querySelector('#zb-rng-blur')?.addEventListener('input', e => {
        const v = parseInt(e.target.value, 10);
        const lbl = container.querySelector('#zb-lbl-blur');
        if (lbl) lbl.textContent = `${v}px`;
        window.tplSetContextualData('zoom-blur', { blurIntensity: v });
      });

      container.querySelector('#zb-rng-zoom')?.addEventListener('input', e => {
        const v = parseInt(e.target.value, 10) / 100;
        const lbl = container.querySelector('#zb-lbl-zoom');
        if (lbl) lbl.textContent = `${(v * 100).toFixed(0)}%`;
        window.tplSetContextualData('zoom-blur', { zoomScale: v });
      });

      container.querySelector('#zb-btn-trigger-burst')?.addEventListener('click', () => {
        if (typeof window.triggerZoomBlurBurst === 'function') window.triggerZoomBlurBurst();
      });

      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: SECURITY CAMERA OVERLAY (security-camera)
    // =========================================================================
    if (tplId === 'security-camera') {
      if (wrapSec) wrapSec.style.display = 'none';
      const curMode = data.colorMode || 'night';
      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.55); border: 1px solid rgba(16,185,129,0.32); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #10b981; text-transform: uppercase;">\ud83d\udcf9 CCTV Surveillance HUD &amp; Footage Feed</span>
            <span style="font-size: 9px; color: #ef4444; font-weight: 800; background: rgba(239,68,68,0.18); padding: 2px 6px; border-radius: 4px;">\u25cf LIVE OVERLAY</span>
          </div>

          <div style="display: grid; grid-template-columns: 1.4fr 0.8fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Camera ID / Sector</span>
              <input type="text" id="cctv-inp-cam" value="${data.camId || 'CAM 04 // NORTH VAULT CORRIDOR'}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #fff; font-family: monospace; font-size: 10.5px; font-weight: 700;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Date Stamp</span>
              <input type="text" id="cctv-inp-date" value="${data.datePrefix || '2026-10-19'}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #10b981; font-family: monospace; font-size: 10.5px; font-weight: 700;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Optical Telemetry Footer</span>
            <input type="text" id="cctv-inp-status" value="${data.statusText || 'ISO 3200 \u00b7 IR NIGHT VISION \u00b7 1080P/24'}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 5px 8px; color: #cbd5e1; font-family: monospace; font-size: 10px;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Surveillance Sensor Grading</span>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
              ${[
                { id: 'night', label: 'IR Night' },
                { id: 'bw', label: 'Mono B&W' },
                { id: 'color', label: 'Raw CCTV' },
                { id: 'thermal', label: 'Thermal' }
              ].map(m => `<button type="button" class="cctv-mode-btn" data-mode="${m.id}" style="padding:5px 4px;border-radius:5px;border:1px solid ${curMode === m.id ? '#10b981' : 'rgba(255,255,255,0.1)'};background:${curMode === m.id ? 'rgba(16,185,129,0.22)' : 'rgba(0,0,0,0.4)'};color:${curMode === m.id ? '#fff' : '#94a3b8'};font-size:9.5px;font-weight:700;cursor:pointer;">${m.label}</button>`).join('')}
            </div>
          </div>

          <label style="display:flex;align-items:center;gap:6px;font-size:10px;color:#cbd5e1;cursor:pointer;">
            <input type="checkbox" id="cctv-inp-scan" ${data.showScanlines !== false ? 'checked' : ''} style="accent-color:#10b981;" />
            Enable CRT Scanlines &amp; Viewfinder Grid
          </label>

          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;
      container.querySelector('#cctv-inp-cam')?.addEventListener('input', e => window.tplSetContextualData('security-camera', { camId: e.target.value }));
      container.querySelector('#cctv-inp-date')?.addEventListener('input', e => window.tplSetContextualData('security-camera', { datePrefix: e.target.value }));
      container.querySelector('#cctv-inp-status')?.addEventListener('input', e => window.tplSetContextualData('security-camera', { statusText: e.target.value }));
      container.querySelector('#cctv-inp-scan')?.addEventListener('change', e => window.tplSetContextualData('security-camera', { showScanlines: e.target.checked }));
      container.querySelectorAll('.cctv-mode-btn').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('security-camera', { colorMode: btn.dataset.mode });
          window.tplRenderContextualInspector('security-camera');
        };
      });
      window.tplWireUniversalBgControls('security-camera', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: CINEMATIC PROGRESS HUD (progress)
    // =========================================================================
    if (tplId === 'progress') {
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';

      const stylePreset = data.stylePreset || 'documentary';
      const curEyebrow = data.eyebrow !== undefined ? data.eyebrow : 'PROJECT FUNDING';
      const curTitle = (data.title !== undefined && data.title !== 'PROJECT FUNDING STATUS') ? data.title : 'Funding Progress';
      const curPhaseLabel = data.phaseLabel !== undefined ? data.phaseLabel : 'Phase 2 of 3';
      const curPhaseStatus = data.phaseStatus !== undefined ? data.phaseStatus : 'Active';
      const curPct = (data.percent !== undefined) ? String(data.percent).replace(/[^0-9.]/g, '') : '74';
      const curCalloutSub = data.calloutSublabel !== undefined ? data.calloutSublabel : 'of target';
      const curRaisedVal = data.raisedValue !== undefined ? data.raisedValue : '$74,000,000';
      const curRaisedLbl = data.raisedLabel !== undefined ? data.raisedLabel : 'Raised';
      const curTargetVal = data.targetValue !== undefined ? data.targetValue : '$100,000,000';
      const curTargetLbl = data.targetLabel !== undefined ? data.targetLabel : 'Target';
      const gradStart = (data.gradientStart && data.gradientStart !== '#ff007f') ? data.gradientStart : '#7c3aed';
      const gradEnd = (data.gradientEnd && data.gradientEnd !== '#00e5ff') ? data.gradientEnd : '#38bdf8';
      const barWidth = data.barWidthPercent !== undefined ? Number(data.barWidthPercent) : 70;
      const barThickness = data.barThickness !== undefined ? Number(data.barThickness) : 8;
      const posX = Math.round(Number(data.posX || 0));
      const posY = Math.round(Number(data.posY || 0));

      const HUD_STYLE_DIRECTIONS = [
        { id: 'documentary', badge: 'A · DEFAULT', title: 'Premium Documentary', desc: 'Restrained violet-to-blue, speech callout, financial storytelling' },
        { id: 'tech', badge: 'B · TECH', title: 'Cinematic Technology', desc: 'Clean precision ticks & restrained cyan-blue telemetry' },
        { id: 'editorial', badge: 'C · EDITORIAL', title: 'Editorial Storytelling', desc: 'High-contrast serif figures & minimal investigative rule' }
      ];

      const HUD_GRAD_PRESETS = [
        { label: 'Restrained Violet → Blue', start: '#7c3aed', end: '#38bdf8' },
        { label: 'Institutional Blue → Cyan', start: '#2563eb', end: '#06b6d4' },
        { label: 'Emerald Sovereign', start: '#059669', end: '#34d399' },
        { label: 'Editorial Gold → Amber', start: '#d97706', end: '#fbbf24' }
      ];

      container.innerHTML = `
        <div style="background: rgba(8,12,24,0.92); border: 1px solid rgba(124,58,237,0.35); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 10px 30px rgba(0,0,0,0.65);">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 7px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 3px; height: 12px; border-radius: 2px; background: #7c3aed; display: inline-block;"></span>
              <span style="font-size: 11px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.6px;">Documentary Progress Studio</span>
            </div>
            <span style="font-size: 8.5px; color: #c4b5fd; font-weight: 700; background: rgba(124,58,237,0.18); border: 1px solid rgba(124,58,237,0.38); padding: 2px 7px; border-radius: 999px;">${stylePreset.toUpperCase()}</span>
          </div>

          <!-- Section 1: 3 Selectable Visual Directions (Shared Data & Animation) -->
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 8.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Visual Direction (Preserves Data)</span>
              <span style="font-size: 8px; color: #94a3b8;">3 Styles</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
              ${HUD_STYLE_DIRECTIONS.map(dir => {
                const active = stylePreset === dir.id;
                return `
                  <button type="button" class="hud-style-dir-btn" data-style="${dir.id}" style="padding: 7px 6px; border-radius: 7px; border: 1.5px solid ${active ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}; background: ${active ? 'rgba(124,58,237,0.22)' : 'rgba(0,0,0,0.38)'}; color: ${active ? '#fff' : '#94a3b8'}; cursor: pointer; text-align: left; display: flex; flex-direction: column; gap: 2px; transition: all 0.15s;">
                    <span style="font-size: 7.5px; font-weight: 800; color: ${active ? '#c4b5fd' : '#64748b'}; letter-spacing: 0.5px;">${dir.badge}</span>
                    <span style="font-size: 9.5px; font-weight: 700; color: ${active ? '#fff' : '#cbd5e1'}; line-height: 1.15;">${dir.title}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Section 2: Header Hierarchy (Eyebrow, Title, Phase Pill) -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(15,23,42,0.55); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 9px;">
            <span style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Header &amp; Phase Indicator</span>
            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 6px;">
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">EYEBROW TAG</span>
                <input type="text" id="hud-inp-eyebrow" value="${curEyebrow.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #cbd5e1; font-size: 10px; font-weight: 700; outline: none;" />
              </div>
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">MAIN HEADING</span>
                <input type="text" id="hud-inp-title" value="${curTitle.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 6px;">
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">PHASE LABEL</span>
                <input type="text" id="hud-inp-phase-label" value="${curPhaseLabel.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #cbd5e1; font-size: 10px; outline: none;" />
              </div>
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">PHASE STATUS</span>
                <input type="text" id="hud-inp-phase-status" value="${curPhaseStatus.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #94a3b8; font-size: 10px; outline: none;" />
              </div>
            </div>
          </div>

          <!-- Section 3: Progress Endpoint & Integrated Financial Figures -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(15,23,42,0.55); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 9px;">
            <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 8px; align-items: end;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 800; color: #cbd5e1; margin-bottom: 3px;">
                  <span>PROGRESS ENDPOINT</span>
                  <span id="hud-val-pct" style="color: #38bdf8; font-family: monospace;">${curPct}%</span>
                </div>
                <input type="range" id="hud-inp-pct" min="0" max="100" step="1" value="${curPct}" style="width: 100%; accent-color: #38bdf8; height: 4px; cursor: pointer;" />
              </div>
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">BADGE SUB-LABEL</span>
                <input type="text" id="hud-inp-callout-sub" value="${curCalloutSub.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 4px 7px; color: #cbd5e1; font-size: 10px; outline: none;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 6px; margin-top: 2px;">
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">PRIMARY FIGURE (RAISED)</span>
                <input type="text" id="hud-inp-raised-val" value="${curRaisedVal.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #fff; font-size: 10.5px; font-weight: 700; outline: none;" />
              </div>
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">PRIMARY LABEL</span>
                <input type="text" id="hud-inp-raised-lbl" value="${curRaisedLbl.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #94a3b8; font-size: 10px; outline: none;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 6px;">
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">SECONDARY FIGURE (TARGET)</span>
                <input type="text" id="hud-inp-target-val" value="${curTargetVal.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #cbd5e1; font-size: 10.5px; font-weight: 600; outline: none;" />
              </div>
              <div>
                <span style="font-size: 7.5px; color: #64748b; display: block; margin-bottom: 2px;">SECONDARY LABEL</span>
                <input type="text" id="hud-inp-target-lbl" value="${curTargetLbl.replace(/"/g, '&quot;')}" style="width: 100%; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 7px; color: #64748b; font-size: 10px; outline: none;" />
              </div>
            </div>
          </div>

          <!-- Section 4: Composition Size, Proportional Scaling & Track Styling -->
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(15,23,42,0.55); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 9px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Composition Scale &amp; Track Geometry</span>
              <button type="button" id="hud-btn-reset-layout" style="padding: 1px 6px; font-size: 8px; font-weight: 700; border-radius: 4px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: #cbd5e1; cursor: pointer;">Reset 70%</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>CANVAS WIDTH</span>
                  <span id="hud-val-width" style="color: #c4b5fd; font-family: monospace;">${barWidth}%</span>
                </div>
                <input type="range" id="hud-inp-width" min="40" max="92" step="1" value="${barWidth}" style="width: 100%; accent-color: #8b5cf6; height: 3px; cursor: pointer;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>BAR THICKNESS</span>
                  <span id="hud-val-thick" style="color: #38bdf8; font-family: monospace;">${barThickness}px</span>
                </div>
                <input type="range" id="hud-inp-thick" min="4" max="16" step="1" value="${barThickness}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>OFFSET X</span>
                  <span id="hud-val-posx" style="color: #94a3b8; font-family: monospace;">${posX}px</span>
                </div>
                <input type="range" id="hud-inp-posx" min="-220" max="220" step="1" value="${posX}" style="width: 100%; accent-color: #8b5cf6; height: 3px; cursor: pointer;" />
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                  <span>OFFSET Y</span>
                  <span id="hud-val-posy" style="color: #94a3b8; font-family: monospace;">${posY}px</span>
                </div>
                <input type="range" id="hud-inp-posy" min="-160" max="160" step="1" value="${posY}" style="width: 100%; accent-color: #8b5cf6; height: 3px; cursor: pointer;" />
              </div>
            </div>
          </div>

          <!-- Section 5: Signature Accent Color Palette -->
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <span style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Signature Accent Gradient</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
              ${HUD_GRAD_PRESETS.map(p => `
                <button type="button" class="hud-grad-preset-btn" data-start="${p.start}" data-end="${p.end}" style="display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 6px; border: 1px solid ${gradStart === p.start ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}; background: ${gradStart === p.start ? 'rgba(124,58,237,0.18)' : 'rgba(0,0,0,0.4)'}; color: #e2e8f0; font-size: 9px; font-weight: 700; cursor: pointer; text-align: left;">
                  <span style="width: 13px; height: 13px; border-radius: 4px; background: linear-gradient(135deg, ${p.start}, ${p.end}); display: inline-block; flex-shrink: 0;"></span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Retrigger Animation Action -->
          <button type="button" id="hud-btn-retrigger" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; border-radius: 7px; border: 1px solid rgba(124,58,237,0.5); background: linear-gradient(135deg, rgba(124,58,237,0.28), rgba(56,189,248,0.22)); color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer;">
            <span>▶</span>
            <span>Replay Documentary Progress (0% → ${curPct}%)</span>
          </button>

          <!-- Studio Background & Video B-Roll Suite -->
          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;

      // Wire 3 Visual Direction Buttons (Preserves all user content)
      container.querySelectorAll('.hud-style-dir-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          window.tplSetContextualData('progress', { stylePreset: btn.dataset.style });
          window.tplRenderContextualInspector('progress');
        });
      });

      container.querySelector('#hud-inp-eyebrow')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { eyebrow: e.target.value });
      });
      container.querySelector('#hud-inp-title')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { title: e.target.value, goal: e.target.value });
      });
      container.querySelector('#hud-inp-phase-label')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { phaseLabel: e.target.value });
      });
      container.querySelector('#hud-inp-phase-status')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { phaseStatus: e.target.value });
      });
      container.querySelector('#hud-inp-pct')?.addEventListener('input', e => {
        const val = e.target.value;
        const valLabel = container.querySelector('#hud-val-pct');
        if (valLabel) valLabel.textContent = `${val}%`;
        window.tplSetContextualData('progress', { percent: `${val}%` });
      });
      container.querySelector('#hud-inp-callout-sub')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { calloutSublabel: e.target.value });
      });
      container.querySelector('#hud-inp-raised-val')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { raisedValue: e.target.value });
      });
      container.querySelector('#hud-inp-raised-lbl')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { raisedLabel: e.target.value });
      });
      container.querySelector('#hud-inp-target-val')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { targetValue: e.target.value });
      });
      container.querySelector('#hud-inp-target-lbl')?.addEventListener('input', e => {
        window.tplSetContextualData('progress', { targetLabel: e.target.value });
      });

      container.querySelector('#hud-inp-width')?.addEventListener('input', e => {
        const val = Number(e.target.value);
        const widthLabel = container.querySelector('#hud-val-width');
        if (widthLabel) widthLabel.textContent = `${val}%`;
        window.tplSetContextualData('progress', { barWidthPercent: val });
      });
      container.querySelector('#hud-inp-thick')?.addEventListener('input', e => {
        const val = Number(e.target.value);
        const thickLabel = container.querySelector('#hud-val-thick');
        if (thickLabel) thickLabel.textContent = `${val}px`;
        window.tplSetContextualData('progress', { barThickness: val });
      });
      container.querySelector('#hud-inp-posx')?.addEventListener('input', e => {
        const val = Number(e.target.value);
        const lbl = container.querySelector('#hud-val-posx');
        if (lbl) lbl.textContent = `${val}px`;
        window.tplSetContextualData('progress', { posX: val });
      });
      container.querySelector('#hud-inp-posy')?.addEventListener('input', e => {
        const val = Number(e.target.value);
        const lbl = container.querySelector('#hud-val-posy');
        if (lbl) lbl.textContent = `${val}px`;
        window.tplSetContextualData('progress', { posY: val });
      });
      container.querySelector('#hud-btn-reset-layout')?.addEventListener('click', () => {
        window.tplSetContextualData('progress', { barWidthPercent: 70, barThickness: 8, posX: 0, posY: 0, scale: 1 });
        window.tplRenderContextualInspector('progress');
      });

      container.querySelectorAll('.hud-grad-preset-btn').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('progress', {
            gradientStart: btn.dataset.start,
            gradientEnd: btn.dataset.end
          });
          window.tplRenderContextualInspector('progress');
        };
      });

      container.querySelector('#hud-btn-retrigger')?.addEventListener('click', () => {
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage && typeof window.tplTriggerProgressAnimation === 'function') {
          window.tplTriggerProgressAnimation(stage, window.tplGetContextualData('progress'));
        }
      });

      window.tplWireUniversalBgControls('progress', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: TEXT SCRAMBLE / DARK WEB TERMINAL (scramble)
    // =========================================================================
    if (tplId === 'scramble') {
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';
      const curCol = data.color || '#00ff88';
      const curSpeed = data.scrambleSpeed || 'normal';
      const curMode = data.layoutMode === 'terminal' ? 'terminal' : 'chat';

      const CYBER_THEMES = [
        { label: 'Matrix Green', col: '#00ff88', dot: '#00ff88' },
        { label: 'Cyber Cyan', col: '#00e5ff', dot: '#00e5ff' },
        { label: 'Breach Red', col: '#ff3366', dot: '#ff3366' },
        { label: 'Amber Gold', col: '#ffb700', dot: '#ffb700' }
      ];

      container.innerHTML = `
        <div style="background: rgba(4,10,7,0.75); border: 1px solid rgba(0,255,136,0.35); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 0 20px rgba(0,255,136,0.08);">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">💻</span>
              <span style="font-size: 11px; font-weight: 800; color: #00ff88; text-transform: uppercase; letter-spacing: 0.5px;">Hacker Terminal &amp; Text Scramble</span>
            </div>
            <span style="font-size: 9px; color: #00ff88; font-weight: 800; background: rgba(0,255,136,0.18); border: 1px solid rgba(0,255,136,0.35); padding: 2px 6px; border-radius: 4px;">TOP PRIORITY</span>
          </div>

          <!-- Sub-Template Layout Switcher -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">Interface Sub-Template</span>
              <span style="font-size: 8.5px; color: #64748b; font-family: monospace;">[MODE]</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button type="button" class="scramble-mode-toggle" data-mode="chat" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 8px; border-radius: 6px; border: 1px solid ${curMode === 'chat' ? '#00ff88' : 'rgba(255,255,255,0.1)'}; background: ${curMode === 'chat' ? 'rgba(0,255,136,0.18)' : 'rgba(0,0,0,0.45)'}; color: ${curMode === 'chat' ? '#ffffff' : '#94a3b8'}; font-size: 10px; font-weight: 800; cursor: pointer; box-shadow: ${curMode === 'chat' ? '0 0 12px rgba(0,255,136,0.22)' : 'none'}; transition: all 0.15s ease;">
                <span>💬</span>
                <span>Dark Web Chat</span>
              </button>
              <button type="button" class="scramble-mode-toggle" data-mode="terminal" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 8px; border-radius: 6px; border: 1px solid ${curMode === 'terminal' ? '#00e5ff' : 'rgba(255,255,255,0.1)'}; background: ${curMode === 'terminal' ? 'rgba(0,229,255,0.18)' : 'rgba(0,0,0,0.45)'}; color: ${curMode === 'terminal' ? '#ffffff' : '#94a3b8'}; font-size: 10px; font-weight: 800; cursor: pointer; box-shadow: ${curMode === 'terminal' ? '0 0 12px rgba(0,229,255,0.22)' : 'none'}; transition: all 0.15s ease;">
                <span>🖥️</span>
                <span>Full Terminal</span>
              </button>
            </div>
          </div>

          ${curMode === 'chat' ? `
            <!-- Chat / Console Window Mode -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(0,255,136,0.04); border: 1px dashed rgba(0,255,136,0.25); border-radius: 7px; padding: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 9px; font-weight: 800; color: #00ff88; text-transform: uppercase;">Target Decrypt Text</span>
                  <span style="font-size: 8px; color: #00ff88; font-family: monospace;">[MAIN STREAM]</span>
                </div>
                <input type="text" id="scramble-inp-text" value="${(data.text || 'you are a dead man').replace(/"/g, '&quot;')}" placeholder="e.g. you are a dead man" style="background: rgba(0,0,0,0.7); border: 1px solid rgba(0,255,136,0.5); border-radius: 6px; padding: 7px 10px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; outline: none; box-shadow: 0 0 10px rgba(0,255,136,0.15);" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Terminal Node / Header</span>
                <input type="text" id="scramble-inp-header" value="${(data.headerTag || 'ROOT@0x7A_DARKNET // [SYS_BREACH_ESTABLISHED]').replace(/"/g, '&quot;')}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 8px; color: #94a3b8; font-family: monospace; font-size: 9.5px;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Sub-Telemetry Readout</span>
                <input type="text" id="scramble-inp-sub" value="${(data.subText || 'IP: 185.220.101.5 // CIPHER: AES-256-GCM // PORT: 9050').replace(/"/g, '&quot;')}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 8px; color: #64748b; font-family: monospace; font-size: 9.5px;" />
              </div>
            </div>
          ` : `
            <!-- Cockpit Terminal Mode -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(0,229,255,0.04); border: 1px dashed rgba(0,229,255,0.25); border-radius: 7px; padding: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 9px; font-weight: 800; color: #00e5ff; text-transform: uppercase;">Target Decrypt Stream (Center Cockpit)</span>
                  <span style="font-size: 8px; color: #00e5ff; font-family: monospace;">[MAIN STREAM]</span>
                </div>
                <input type="text" id="scramble-inp-text" value="${(data.text || 'SYSTEM PRIVILEGES COMPROMISED').replace(/"/g, '&quot;')}" placeholder="e.g. SYSTEM PRIVILEGES COMPROMISED" style="background: rgba(0,0,0,0.7); border: 1px solid rgba(0,229,255,0.5); border-radius: 6px; padding: 7px 10px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; outline: none; box-shadow: 0 0 10px rgba(0,229,255,0.15);" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Terminal Node / Header</span>
                <input type="text" id="scramble-inp-header" value="${(data.headerTag || 'ROOT@0x7A_DARKNET // [SYS_BREACH_ESTABLISHED]').replace(/"/g, '&quot;')}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 8px; color: #94a3b8; font-family: monospace; font-size: 9.5px;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Sub-Telemetry Readout</span>
                <input type="text" id="scramble-inp-sub" value="${(data.subText || 'IP: 185.220.101.5 // CIPHER: AES-256-GCM // PORT: 9050').replace(/"/g, '&quot;')}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 8px; color: #64748b; font-family: monospace; font-size: 9.5px;" />
              </div>
            </div>
          `}

          <!-- Color & Cyber Presets -->
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Cyber Glow Color</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="color" id="scramble-inp-col" value="${curCol}" style="width: 22px; height: 18px; border: none; background: transparent; cursor: pointer;" title="Custom Color" />
                <span style="font-size: 9.5px; font-family: monospace; color: ${curCol}; font-weight: 800;">${curCol.toUpperCase()}</span>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
              ${CYBER_THEMES.map(th => {
                const active = curCol.toLowerCase() === th.col.toLowerCase();
                return `
                  <button type="button" class="scramble-col-preset" data-col="${th.col}" style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 4px 5px; border-radius: 5px; border: 1px solid ${active ? th.col : 'rgba(255,255,255,0.1)'}; background: ${active ? th.col + '22' : 'rgba(0,0,0,0.4)'}; color: ${active ? '#fff' : '#94a3b8'}; font-size: 9px; font-weight: 700; cursor: pointer;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: ${th.dot};"></span>
                    <span>${th.label.split(' ')[0]}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Speed & Toggles -->
          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 6px; align-items: center;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Scramble Speed</span>
              <div style="display: flex; gap: 3px;">
                ${[
                  { id: 'fast', label: 'Fast' },
                  { id: 'normal', label: 'Normal' },
                  { id: 'slow', label: 'Cinematic' }
                ].map(s => `
                  <button type="button" class="scramble-speed-btn" data-speed="${s.id}" style="flex: 1; padding: 4px 2px; border-radius: 4px; border: 1px solid ${curSpeed === s.id ? '#00ff88' : 'rgba(255,255,255,0.1)'}; background: ${curSpeed === s.id ? 'rgba(0,255,136,0.2)' : 'rgba(0,0,0,0.4)'}; color: ${curSpeed === s.id ? '#fff' : '#94a3b8'}; font-size: 9px; font-weight: 700; cursor: pointer;">${s.label}</button>
                `).join('')}
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px; justify-content: flex-end; padding-top: 14px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="scramble-inp-scan" ${data.showScanlines !== false ? 'checked' : ''} style="accent-color: #00ff88;" />
                CRT Scanlines
              </label>
            </div>
          </div>

          <!-- Re-trigger button -->
          <button type="button" id="scramble-btn-retrigger" style="display: flex; align-items: center; justify-content: center; gap: 6px; background: linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,229,255,0.2)); border: 1px solid rgba(0,255,136,0.5); border-radius: 6px; padding: 6px 10px; color: #00ff88; font-size: 10px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em;">
            <span>⚡ Re-Trigger Decryption Stream</span>
          </button>

          <!-- Studio Background & Video B-Roll Suite -->
          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;

      // Wire controls
      container.querySelectorAll('.scramble-mode-toggle').forEach(btn => {
        btn.onclick = () => {
          const m = btn.dataset.mode;
          window.tplSetContextualData('scramble', { layoutMode: m });
          window.tplRenderContextualInspector('scramble');
        };
      });
      container.querySelector('#scramble-inp-sender')?.addEventListener('input', e => {
        window.tplSetContextualData('scramble', { senderHandle: e.target.value });
      });
      container.querySelector('#scramble-inp-text')?.addEventListener('input', e => {
        window.tplSetContextualData('scramble', { text: e.target.value });
      });
      container.querySelector('#scramble-inp-header')?.addEventListener('input', e => {
        window.tplSetContextualData('scramble', { headerTag: e.target.value });
      });
      container.querySelector('#scramble-inp-sub')?.addEventListener('input', e => {
        window.tplSetContextualData('scramble', { subText: e.target.value });
      });
      container.querySelector('#scramble-inp-col')?.addEventListener('input', e => {
        window.tplSetContextualData('scramble', { color: e.target.value });
      });
      container.querySelector('#scramble-inp-col')?.addEventListener('change', () => {
        window.tplRenderContextualInspector('scramble');
      });
      container.querySelectorAll('.scramble-col-preset').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('scramble', { color: btn.dataset.col });
          window.tplRenderContextualInspector('scramble');
        };
      });
      container.querySelectorAll('.scramble-speed-btn').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('scramble', { scrambleSpeed: btn.dataset.speed });
          window.tplRenderContextualInspector('scramble');
        };
      });
      container.querySelector('#scramble-inp-scan')?.addEventListener('change', e => {
        window.tplSetContextualData('scramble', { showScanlines: e.target.checked });
      });
      container.querySelector('#scramble-btn-retrigger')?.addEventListener('click', () => {
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage && typeof window.tplTriggerScrambleAnimation === 'function') {
          window.tplTriggerScrambleAnimation(stage, window.tplGetContextualData('scramble'));
        }
      });
      window.tplWireUniversalBgControls('scramble', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: FILM GRAIN & CAMERA OVERLAY SUITE (film-grain)
    // =========================================================================
    if (tplId === 'film-grain') {
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) {
        wrapSec.style.display = 'flex';
        const labelSec = document.getElementById('tpl-modal-label-secondary');
        if (labelSec) labelSec.textContent = '\ud83c\udfac Base Footage / Scene Asset';
      }
      const curStyle = data.filmStyle || 'kodak35';
      const grainVal = data.grainIntensity !== undefined ? data.grainIntensity : 65;
      const vigVal = data.vignetteIntensity !== undefined ? data.vignetteIntensity : 60;
      
      const FILM_STYLES = [
        { id: 'kodak35', label: '\ud83c\udf9e\ufe0f Kodak 35mm', desc: 'Warm organic grain & micro-contrast' },
        { id: 'doc16mm', label: '\ud83c\udfa5 16mm Doc', desc: 'High-contrast gritty documentary' },
        { id: 'super8', label: '\ud83d\udcfc Super 8', desc: 'Vintage warm color fade & gate weave' },
        { id: 'vhs', label: '\ud83d\udcf9 VHS Tape', desc: 'Retro tape texture & scan lines' },
        { id: 'silent', label: '\ud83d\udcfd\ufe0f 1920s Silent', desc: 'Sepia monochrome & high shutter flicker' },
        { id: 'lightleak', label: '\u2600\ufe0f Light Leak', desc: 'Warm amber-orange lens burn' }
      ];

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(168,85,247,0.35); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">\ud83c\udfac</span>
              <span style="font-size: 11px; font-weight: 800; color: #c084fc; text-transform: uppercase; letter-spacing: 0.5px;">35MM / 16MM FILM CAMERA OVERLAY</span>
            </div>
            <span style="font-size: 9px; color: #a855f7; font-weight: 800; background: rgba(168,85,247,0.18); padding: 2px 6px; border-radius: 4px;">\u25cf MASTER FX</span>
          </div>

          <!-- Camera Style Profile Grid -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Film Camera Style &amp; Emulsion Profile</span>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
              ${FILM_STYLES.map(s => {
                const active = curStyle === s.id;
                return `<button type="button" class="film-style-btn" data-style="${s.id}" style="padding:6px 8px;border-radius:6px;border:1px solid ${active ? '#c084fc' : 'rgba(255,255,255,0.1)'};background:${active ? 'rgba(168,85,247,0.24)' : 'rgba(0,0,0,0.4)'};color:${active ? '#ffffff' : '#cbd5e1'};font-size:10px;font-weight:700;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:1px;">
                  <span>${s.label}</span>
                  <span style="font-size:8px;font-weight:400;color:${active ? '#e9d5ff' : '#64748b'};">${s.desc}</span>
                </button>`;
              }).join('')}
            </div>
          </div>

          <!-- Sliders: Grain Intensity & Vignette -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
                <span>Grain Density</span>
                <span id="film-val-grain" style="color: #c084fc;">${grainVal}%</span>
              </div>
              <input type="range" id="film-inp-grain" min="0" max="100" value="${grainVal}" style="width: 100%; accent-color: #c084fc; height: 3px; cursor: pointer;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
                <span>Lens Vignette</span>
                <span id="film-val-vig" style="color: #c084fc;">${vigVal}%</span>
              </div>
              <input type="range" id="film-inp-vig" min="0" max="100" value="${vigVal}" style="width: 100%; accent-color: #c084fc; height: 3px; cursor: pointer;" />
            </div>
          </div>

          <!-- Checkbox Toggles -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);">
            <label style="display:flex;align-items:center;gap:6px;font-size:9.5px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="film-inp-scan" ${data.showScanlines !== false ? 'checked' : ''} style="accent-color:#c084fc;" />
              TV Scanlines
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:9.5px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="film-inp-dust" ${data.showDust !== false ? 'checked' : ''} style="accent-color:#c084fc;" />
              Dust &amp; Scratches
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:9.5px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="film-inp-flicker" ${data.filmFlicker !== false ? 'checked' : ''} style="accent-color:#c084fc;" />
              Shutter Flicker
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:9.5px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="film-inp-hud" ${data.showHud !== false ? 'checked' : ''} style="accent-color:#c084fc;" />
              Telemetry HUD
            </label>
          </div>

          <!-- Film Stock & Shutter Telemetry -->
          <div style="display: grid; grid-template-columns: 1.3fr 0.8fr; gap: 6px;">
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Stock Emulsion Badge</span>
              <input type="text" id="film-inp-stock" value="${data.stockName || 'KODAK 5219 // 35MM'}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 4px 7px; color: #fff; font-family: monospace; font-size: 10px; font-weight: 700;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 8.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Shutter / FPS</span>
              <input type="text" id="film-inp-fps" value="${data.fpsText || '24.000 FPS'}" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 4px 7px; color: #fbbf24; font-family: monospace; font-size: 10px; font-weight: 700;" />
            </div>
          </div>

          <!-- Studio Backdrop & Video B-Roll Picker -->
          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;

      // Wire controls
      container.querySelectorAll('.film-style-btn').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('film-grain', { filmStyle: btn.dataset.style });
          window.tplRenderContextualInspector('film-grain');
        };
      });

      const inpGrain = container.querySelector('#film-inp-grain');
      const valGrain = container.querySelector('#film-val-grain');
      if (inpGrain) {
        inpGrain.oninput = (e) => {
          if (valGrain) valGrain.textContent = `${e.target.value}%`;
          window.tplSetContextualData('film-grain', { grainIntensity: Number(e.target.value) });
        };
      }

      const inpVig = container.querySelector('#film-inp-vig');
      const valVig = container.querySelector('#film-val-vig');
      if (inpVig) {
        inpVig.oninput = (e) => {
          if (valVig) valVig.textContent = `${e.target.value}%`;
          window.tplSetContextualData('film-grain', { vignetteIntensity: Number(e.target.value) });
        };
      }

      container.querySelector('#film-inp-scan')?.addEventListener('change', e => window.tplSetContextualData('film-grain', { showScanlines: e.target.checked }));
      container.querySelector('#film-inp-dust')?.addEventListener('change', e => window.tplSetContextualData('film-grain', { showDust: e.target.checked }));
      container.querySelector('#film-inp-flicker')?.addEventListener('change', e => window.tplSetContextualData('film-grain', { filmFlicker: e.target.checked }));
      container.querySelector('#film-inp-hud')?.addEventListener('change', e => window.tplSetContextualData('film-grain', { showHud: e.target.checked }));
      container.querySelector('#film-inp-stock')?.addEventListener('input', e => window.tplSetContextualData('film-grain', { stockName: e.target.value }));
      container.querySelector('#film-inp-fps')?.addEventListener('input', e => window.tplSetContextualData('film-grain', { fpsText: e.target.value }));

      window.tplWireUniversalBgControls('film-grain', container);
      return;
    }

    // =========================================================================
    // CASE: 3D NEWSPAPER CLIPPING (James Jani / Corridor Digital Production Grade)
    // =========================================================================
    if (tplId === 'newspaper-3d') {
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) {
        wrapSec.style.display = 'flex';
        const labelSec = document.getElementById('tpl-modal-label-secondary');
        if (labelSec) labelSec.textContent = 'Atmospheric Backdrop / Dark Room B-Roll';
      }

      const stylePreset = data.stylePreset || 'scandal';
      const masthead = data.masthead || 'THE DAILY TIMES';
      const headline = data.headline || 'MAJOR SCANDAL\nEXPOSED';
      const dateline = data.dateline || 'MONDAY, JANUARY 15, 2024';
      const dofBgBlur = data.dofBgBlur !== undefined ? data.dofBgBlur : (data.dofBlur !== undefined ? Math.round(data.dofBlur * 0.5) : 7);
      const dofFgBlur = data.dofFgBlur !== undefined ? data.dofFgBlur : (data.dofBlur !== undefined ? data.dofBlur : 14);
      const paperBrightness = data.paperBrightness !== undefined ? data.paperBrightness : 104;
      const inkContrast = data.inkContrast !== undefined ? data.inkContrast : 115;
      const highlightDelay = data.highlightDelay !== undefined ? data.highlightDelay : 0.8;
      const highlightDuration = data.highlightDuration !== undefined ? data.highlightDuration : 2.2;
      const highlightColor = data.highlightColor || '#facc15';
      const cameraPitch = data.cameraPitch !== undefined ? data.cameraPitch : 10;
      const cameraYaw = data.cameraYaw !== undefined ? data.cameraYaw : -7;
      const cameraRoll = data.cameraRoll !== undefined ? data.cameraRoll : 2;
      const perspective = data.perspective !== undefined ? data.perspective : 1100;
      const showDogEar = data.showDogEar !== false;
      const dogEarSize = data.dogEarSize !== undefined ? data.dogEarSize : 54;
      const volumetricRays = data.volumetricRays !== false;
      const rayIntensity = data.rayIntensity !== undefined ? data.rayIntensity : 0.45;
      const rimLight = data.rimLight !== false;
      const warmSpotlight = data.warmSpotlight !== false;
      const spotIntensity = data.spotIntensity !== undefined ? data.spotIntensity : 0.5;
      const dustMotes = data.dustMotes !== false;
      const organicDrift = data.organicDrift !== false;
      const motionBlur = data.motionBlur !== false;
      const filmGrain = data.filmGrain !== false;
      const filmGrainOpacity = data.filmGrainOpacity !== undefined ? data.filmGrainOpacity : 0.22;
      const inkBleed = data.inkBleed !== false;

      const PRESETS = [
        { id: 'scandal', label: 'The Daily Times (Image 2)', badge: 'HERO', desc: 'Modern investigative scandal broadsheet with dog-eared fold' },
        { id: 'victorian', label: 'Victorian Gazette (Image 3)', badge: '1884', desc: 'Antique woodcut engravings, gothic masthead & vintage ads' },
        { id: 'jfk', label: 'Historic Dispatch (Image 4)', badge: '1963', desc: 'Mid-century halftone portrait newsprint & assassination wire' },
        { id: 'tribune', label: 'Chicago Tribune (Image 5)', badge: 'NOIR', desc: 'Sensationalist 1930s crime swindle plot & political cartoon' },
        { id: 'financial', label: 'WSJ Financial Dossier', badge: 'WALL ST', desc: 'Wall Street broadsheet layout with leaked offshore balances' }
      ];

      container.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;width:100%;">
          <!-- Header Banner -->
          <div style="display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(245,158,11,0.14) 0%,rgba(168,85,247,0.12) 100%);border:1px solid rgba(245,158,11,0.3);padding:10px 12px;border-radius:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:16px;">📰</span>
              <div>
                <div style="font-size:12px;font-weight:700;color:#fef08a;letter-spacing:0.3px;">3D Newspaper Clipping • Production Grade</div>
                <div style="font-size:10px;color:#cbd5e1;">James Jani / Corridor Digital Depth, God Rays & Shaders</div>
              </div>
            </div>
            <span style="font-size:9px;font-weight:800;background:rgba(245,158,11,0.25);border:1px solid rgba(245,158,11,0.5);color:#fef08a;padding:2px 6px;border-radius:4px;letter-spacing:1px;">PRO FX</span>
          </div>

          <!-- Newspaper Archetype Styles (Image 2, 3, 4, 5) -->
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;">Newspaper Style Archetypes</span>
              <span style="font-size:9.5px;color:#a855f7;font-weight:600;">Image 2 • 3 • 4 • 5</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:6px;">
              ${PRESETS.map(p => `
                <button type="button" class="np-preset-btn" data-preset="${p.id}" style="text-align:left;display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:6px;border:1px solid ${stylePreset === p.id ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.08)'};background:${stylePreset === p.id ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.03)'};cursor:pointer;transition:all 0.15s;">
                  <div style="display:flex;flex-direction:column;gap:2px;">
                    <span style="font-size:11px;font-weight:700;color:${stylePreset === p.id ? '#fef08a' : '#e2e8f0'};">${p.label}</span>
                    <span style="font-size:9.5px;color:#94a3b8;">${p.desc}</span>
                  </div>
                  <span style="font-size:8.5px;font-weight:800;padding:2px 6px;border-radius:4px;background:${stylePreset === p.id ? '#f59e0b' : 'rgba(255,255,255,0.06)'};color:${stylePreset === p.id ? '#000' : '#94a3b8'};letter-spacing:0.8px;">${p.badge}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 1: Granular Depth of Field (Background & Foreground Bokeh) -->
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;">🎥</span>
              <span style="font-size:10.5px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.5px;">Optical Depth of Field & Bokeh</span>
            </div>

            <!-- Background Bokeh Slider -->
            <div style="display:flex;flex-direction:column;gap:3px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
                <span>Background Archival Blur (Deep Space Bokeh)</span>
                <span id="np-val-bgblur" style="color:#facc15;font-family:monospace;">${dofBgBlur}px</span>
              </div>
              <input type="range" id="np-inp-bgblur" min="0" max="25" step="1" value="${dofBgBlur}" style="width:100%;accent-color:#f59e0b;height:4px;cursor:pointer;" />
              <div style="font-size:9px;color:#64748b;">Controls how out-of-focus background archival pages appear behind the hero clipping.</div>
            </div>

            <!-- Foreground Cutout Slider -->
            <div style="display:flex;flex-direction:column;gap:3px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
                <span>Foreground Cutout Blur (Camera Lens Proximity)</span>
                <span id="np-val-fgblur" style="color:#facc15;font-family:monospace;">${dofFgBlur}px</span>
              </div>
              <input type="range" id="np-inp-fgblur" min="0" max="30" step="1" value="${dofFgBlur}" style="width:100%;accent-color:#f59e0b;height:4px;cursor:pointer;" />
              <div style="font-size:9px;color:#64748b;">Dramatic lens bokeh for the bottom-left clipping framing the camera.</div>
            </div>

            <!-- Camera Dynamic Angle Controls -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;">
                  <span>Camera Pitch</span>
                  <span id="np-val-pitch" style="color:#c084fc;font-family:monospace;">${cameraPitch}°</span>
                </div>
                <input type="range" id="np-inp-pitch" min="-10" max="35" step="1" value="${cameraPitch}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
              </div>

              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;">
                  <span>Camera Yaw</span>
                  <span id="np-val-yaw" style="color:#c084fc;font-family:monospace;">${cameraYaw}°</span>
                </div>
                <input type="range" id="np-inp-yaw" min="-30" max="30" step="1" value="${cameraYaw}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
              </div>

              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;">
                  <span>Camera Roll</span>
                  <span id="np-val-roll" style="color:#c084fc;font-family:monospace;">${cameraRoll}°</span>
                </div>
                <input type="range" id="np-inp-roll" min="-15" max="15" step="0.5" value="${cameraRoll}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
              </div>

              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;">
                  <span>Perspective Field</span>
                  <span id="np-val-persp" style="color:#c084fc;font-family:monospace;">${perspective}px</span>
                </div>
                <input type="range" id="np-inp-persp" min="600" max="1800" step="50" value="${perspective}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
              </div>
            </div>
          </div>

          <!-- Section 2: Paper Clarity & Ink Readability (Image 2 Sharpness) -->
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;">✨</span>
              <span style="font-size:10.5px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.5px;">Paper Clarity & Ink Readability</span>
            </div>

            <!-- Paper Exposure / Brightness -->
            <div style="display:flex;flex-direction:column;gap:3px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
                <span>Paper Exposure & Brightness</span>
                <span id="np-val-paperbright" style="color:#facc15;font-family:monospace;">${paperBrightness}%</span>
              </div>
              <input type="range" id="np-inp-paperbright" min="80" max="130" step="1" value="${paperBrightness}" style="width:100%;accent-color:#f59e0b;height:4px;cursor:pointer;" />
              <div style="font-size:9px;color:#64748b;">Brightens parchment background so the headline and story pop with high clarity.</div>
            </div>

            <!-- Ink Contrast / Sharpness -->
            <div style="display:flex;flex-direction:column;gap:3px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
                <span>Ink Contrast & Crispness</span>
                <span id="np-val-inkcontrast" style="color:#facc15;font-family:monospace;">${inkContrast}%</span>
              </div>
              <input type="range" id="np-inp-inkcontrast" min="100" max="160" step="1" value="${inkContrast}" style="width:100%;accent-color:#f59e0b;height:4px;cursor:pointer;" />
              <div style="font-size:9px;color:#64748b;">Sharpens typographic black values for razor-sharp readability on mobile & desktop.</div>
            </div>

            <!-- Folded Corner Dog-Ear -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;margin-top:2px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Folded / Dog-Eared Corner (Image 2)</div>
                <div style="font-size:9px;color:#94a3b8;">Realistic 3D triangular flap with cast shadow on paper</div>
              </div>
              <input type="checkbox" id="np-chk-dogear" ${showDogEar ? 'checked' : ''} style="width:16px;height:16px;accent-color:#f59e0b;cursor:pointer;" />
            </div>

            <div style="display:flex;flex-direction:column;gap:2px;">
              <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;">
                <span>Corner Fold Size</span>
                <span id="np-val-dogsize" style="color:#facc15;font-family:monospace;">${dogEarSize}px</span>
              </div>
              <input type="range" id="np-inp-dogsize" min="25" max="85" step="1" value="${dogEarSize}" style="width:100%;accent-color:#f59e0b;height:3px;cursor:pointer;" />
            </div>

            <!-- Ink Bleed & Letterpress -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Ink Absorption & Letterpress Edge</div>
                <div style="font-size:9px;color:#94a3b8;">Authentic press diffusion edge instead of sterile digital text</div>
              </div>
              <input type="checkbox" id="np-chk-inkbleed" ${inkBleed ? 'checked' : ''} style="width:16px;height:16px;accent-color:#f59e0b;cursor:pointer;" />
            </div>
          </div>

          <!-- Section 3: Text Highlighter Timing & Styling -->
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;">🖊️</span>
              <span style="font-size:10.5px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.5px;">Text Highlighter Animation</span>
            </div>

            <!-- Start Delay Slider -->
            <div style="display:flex;flex-direction:column;gap:3px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
                <span>Highlight Start Delay ("When")</span>
                <span id="np-val-hldelay" style="color:#facc15;font-family:monospace;">${highlightDelay.toFixed(1)}s</span>
              </div>
              <input type="range" id="np-inp-hldelay" min="0" max="3" step="0.1" value="${highlightDelay}" style="width:100%;accent-color:#f59e0b;height:4px;cursor:pointer;" />
              <div style="font-size:9px;color:#64748b;">Controls how many seconds into the scene before the highlighter begins wiping.</div>
            </div>

            <!-- Wipe Duration Slider -->
            <div style="display:flex;flex-direction:column;gap:3px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
                <span>Highlighter Wipe Duration</span>
                <span id="np-val-hldur" style="color:#facc15;font-family:monospace;">${highlightDuration.toFixed(1)}s</span>
              </div>
              <input type="range" id="np-inp-hldur" min="0.5" max="4.5" step="0.1" value="${highlightDuration}" style="width:100%;accent-color:#f59e0b;height:4px;cursor:pointer;" />
              <div style="font-size:9px;color:#64748b;">Speed of the horizontal highlighter wipe stroke across key evidence.</div>
            </div>

            <!-- Highlighter Color -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Highlighter Marker Tint</div>
                <div style="font-size:9px;color:#94a3b8;">Fluorescent investigative marker wash</div>
              </div>
              <input type="color" id="np-inp-hlcolor" value="${highlightColor}" style="border:none;background:transparent;width:28px;height:24px;cursor:pointer;" />
            </div>
          </div>

          <!-- Section 4: Volumetric & Thematic Lighting -->
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;">💡</span>
              <span style="font-size:10.5px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.5px;">Volumetric & Thematic Lighting</span>
            </div>

            <!-- God Rays Toggle & Slider -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Volumetric Light Shafts (God Rays)</div>
                <div style="font-size:9px;color:#94a3b8;">Atmospheric diagonal light beams cutting through depth</div>
              </div>
              <input type="checkbox" id="np-chk-rays" ${volumetricRays ? 'checked' : ''} style="width:16px;height:16px;accent-color:#f59e0b;cursor:pointer;" />
            </div>

            <div style="display:flex;flex-direction:column;gap:2px;">
              <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;">
                <span>Ray Shaft Intensity</span>
                <span id="np-val-rayint" style="color:#facc15;font-family:monospace;">${Math.round(rayIntensity * 100)}%</span>
              </div>
              <input type="range" id="np-inp-rayint" min="0" max="1.5" step="0.05" value="${rayIntensity}" style="width:100%;accent-color:#f59e0b;height:3px;cursor:pointer;" />
            </div>

            <!-- Edge Rim Lighting -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Cool Rim Lighting (Backlight)</div>
                <div style="font-size:9px;color:#94a3b8;">Luminous cool blue outline separating papers from void</div>
              </div>
              <input type="checkbox" id="np-chk-rim" ${rimLight ? 'checked' : ''} style="width:16px;height:16px;accent-color:#38bdf8;cursor:pointer;" />
            </div>

            <!-- Headline Focused Spotlight -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Headline Warm Spotlight Gel</div>
                <div style="font-size:9px;color:#94a3b8;">Warm focused pool on scandal headline vs cool ambient</div>
              </div>
              <input type="checkbox" id="np-chk-spot" ${warmSpotlight ? 'checked' : ''} style="width:16px;height:16px;accent-color:#f59e0b;cursor:pointer;" />
            </div>

            <!-- Floating Golden Dust Motes -->
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Suspended Dust Motes & Embers</div>
                <div style="font-size:9px;color:#94a3b8;">Glowing particles drifting through the light rays</div>
              </div>
              <input type="checkbox" id="np-chk-dust" ${dustMotes ? 'checked' : ''} style="width:16px;height:16px;accent-color:#f59e0b;cursor:pointer;" />
            </div>
          </div>

          <!-- Section 5: Kinetic Motion & High-End Polish -->
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;">🌀</span>
              <span style="font-size:10.5px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.5px;">Kinetic Drift & Motion Polish</span>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Organic Air Currents Drift</div>
                <div style="font-size:9px;color:#94a3b8;">Slow, continuous floating simulation with varied paths</div>
              </div>
              <input type="checkbox" id="np-chk-drift" ${organicDrift ? 'checked' : ''} style="width:16px;height:16px;accent-color:#a855f7;cursor:pointer;" />
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Velocity-Based Motion Blur</div>
                <div style="font-size:9px;color:#94a3b8;">Increases blur dynamically on moving foreground/background</div>
              </div>
              <input type="checkbox" id="np-chk-mblur" ${motionBlur ? 'checked' : ''} style="width:16px;height:16px;accent-color:#a855f7;cursor:pointer;" />
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;">
              <div>
                <div style="font-size:10.5px;font-weight:600;color:#e2e8f0;">Cinematic 35mm Film Grain</div>
                <div style="font-size:9px;color:#94a3b8;">Authentic documentary production texture overlay</div>
              </div>
              <input type="checkbox" id="np-chk-grain" ${filmGrain ? 'checked' : ''} style="width:16px;height:16px;accent-color:#a855f7;cursor:pointer;" />
            </div>

            <div style="display:flex;flex-direction:column;gap:2px;">
              <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;">
                <span>Film Grain Opacity</span>
                <span id="np-val-grain" style="color:#c084fc;font-family:monospace;">${Math.round(filmGrainOpacity * 100)}%</span>
              </div>
              <input type="range" id="np-inp-grain" min="0.05" max="0.6" step="0.01" value="${filmGrainOpacity}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
            </div>
          </div>

          <!-- Section 6: Editorial Content & Typography -->
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;">✍️</span>
              <span style="font-size:10.5px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.5px;">Editorial Content & Typography</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:3px;">
              <label style="font-size:9.5px;color:#94a3b8;">Masthead Name</label>
              <input type="text" id="np-inp-masthead" value="${masthead}" style="background:#161926;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#f8fafc;padding:5px 8px;font-size:11px;" />
            </div>

            <div style="display:flex;flex-direction:column;gap:3px;">
              <label style="font-size:9.5px;color:#94a3b8;">Main Headline (use newline for second deck)</label>
              <textarea id="np-inp-headline" rows="2" style="background:#161926;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#f8fafc;padding:5px 8px;font-size:11px;resize:vertical;">${headline}</textarea>
            </div>

            <div style="display:flex;flex-direction:column;gap:3px;">
              <label style="font-size:9.5px;color:#94a3b8;">Dateline / Subtitle Rule</label>
              <input type="text" id="np-inp-dateline" value="${dateline}" style="background:#161926;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#f8fafc;padding:5px 8px;font-size:11px;" />
            </div>
          </div>
        </div>
      `;

      // Wire preset switching
      container.querySelectorAll('.np-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.getAttribute('data-preset');
          let patch = { stylePreset: pid };
          if (pid === 'scandal') {
            patch.masthead = 'THE DAILY TIMES';
            patch.headline = 'MAJOR SCANDAL\nEXPOSED';
            patch.dateline = 'MONDAY, JANUARY 15, 2024';
          } else if (pid === 'victorian') {
            patch.masthead = 'Daily Newspaper';
            patch.headline = 'LOST CITY\nDISCOVERED';
            patch.dateline = 'SUNDAY, NOVEMBER 28, 1884 • PRICE 5 CENTS';
          } else if (pid === 'jfk') {
            patch.masthead = 'Delaware County Daily Times';
            patch.headline = "KENNEDY'S ASSASSIN\nCHARGED";
            patch.dateline = 'SATURDAY, NOVEMBER 23, 1963';
          } else if (pid === 'tribune') {
            patch.masthead = 'Chicago Daily Tribune';
            patch.headline = 'EXPOSES HUGE\nSWINDLE PLOT';
            patch.dateline = 'FINAL CITY EDITION • 2 CENTS';
          } else if (pid === 'financial') {
            patch.masthead = 'THE WALL STREET JOURNAL';
            patch.headline = 'U.S. BLAMES ATTACK\nON REBELS';
            patch.dateline = 'GLOBAL BUSINESS REPORT • CONFIDENTIAL';
          }
          window.tplSetContextualData('newspaper-3d', patch);
          window.tplRenderContextualInspector('newspaper-3d');
        });
      });

      // Wire Sliders & Toggles
      const bindNpSlider = (id, valId, prop, fmt) => {
        const inp = container.querySelector(id);
        const valEl = container.querySelector(valId);
        if (inp) {
          inp.oninput = (e) => {
            const num = Number(e.target.value);
            if (valEl) valEl.textContent = fmt ? fmt(num) : num;
            window.tplSetContextualData('newspaper-3d', { [prop]: num });
          };
        }
      };

      bindNpSlider('#np-inp-bgblur', '#np-val-bgblur', 'dofBgBlur', v => `${v}px`);
      bindNpSlider('#np-inp-fgblur', '#np-val-fgblur', 'dofFgBlur', v => `${v}px`);
      bindNpSlider('#np-inp-paperbright', '#np-val-paperbright', 'paperBrightness', v => `${v}%`);
      bindNpSlider('#np-inp-inkcontrast', '#np-val-inkcontrast', 'inkContrast', v => `${v}%`);
      bindNpSlider('#np-inp-hldelay', '#np-val-hldelay', 'highlightDelay', v => `${v.toFixed(1)}s`);
      bindNpSlider('#np-inp-hldur', '#np-val-hldur', 'highlightDuration', v => `${v.toFixed(1)}s`);
      bindNpSlider('#np-inp-pitch', '#np-val-pitch', 'cameraPitch', v => `${v}°`);
      bindNpSlider('#np-inp-yaw', '#np-val-yaw', 'cameraYaw', v => `${v}°`);
      bindNpSlider('#np-inp-roll', '#np-val-roll', 'cameraRoll', v => `${v}°`);
      bindNpSlider('#np-inp-persp', '#np-val-persp', 'perspective', v => `${v}px`);
      bindNpSlider('#np-inp-dogsize', '#np-val-dogsize', 'dogEarSize', v => `${v}px`);
      bindNpSlider('#np-inp-rayint', '#np-val-rayint', 'rayIntensity', v => `${Math.round(v * 100)}%`);
      bindNpSlider('#np-inp-grain', '#np-val-grain', 'filmGrainOpacity', v => `${Math.round(v * 100)}%`);

      const hlColorInp = container.querySelector('#np-inp-hlcolor');
      if (hlColorInp) {
        hlColorInp.addEventListener('input', e => {
          window.tplSetContextualData('newspaper-3d', { highlightColor: e.target.value });
        });
      }

      const bindNpChk = (id, prop) => {
        container.querySelector(id)?.addEventListener('change', e => {
          window.tplSetContextualData('newspaper-3d', { [prop]: e.target.checked });
        });
      };

      bindNpChk('#np-chk-dogear', 'showDogEar');
      bindNpChk('#np-chk-inkbleed', 'inkBleed');
      bindNpChk('#np-chk-rays', 'volumetricRays');
      bindNpChk('#np-chk-rim', 'rimLight');
      bindNpChk('#np-chk-spot', 'warmSpotlight');
      bindNpChk('#np-chk-dust', 'dustMotes');
      bindNpChk('#np-chk-drift', 'organicDrift');
      bindNpChk('#np-chk-mblur', 'motionBlur');
      bindNpChk('#np-chk-grain', 'filmGrain');

      container.querySelector('#np-inp-masthead')?.addEventListener('input', e => {
        window.tplSetContextualData('newspaper-3d', { masthead: e.target.value });
      });
      container.querySelector('#np-inp-headline')?.addEventListener('input', e => {
        window.tplSetContextualData('newspaper-3d', { headline: e.target.value });
      });
      container.querySelector('#np-inp-dateline')?.addEventListener('input', e => {
        window.tplSetContextualData('newspaper-3d', { dateline: e.target.value });
      });

      window.tplWireUniversalBgControls('newspaper-3d', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: FLYING HEADLINES 3D CINEMATIC SUITE (headline-fly)
    // =========================================================================
    if (tplId === 'headline-fly') {
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) {
        wrapSec.style.display = 'flex';
        const labelSec = document.getElementById('tpl-modal-label-secondary');
        if (labelSec) labelSec.textContent = 'Background Ambient / Video B-Roll';
      }

      const tilt = data.tiltAngle !== undefined ? data.tiltAngle : 9.5;
      const motionBlur = data.motionBlur !== false;
      const blurPx = data.blurIntensity !== undefined ? data.blurIntensity : 32;
      const dofBokeh = data.dofBokeh !== false;
      const dofPx = data.dofBlur !== undefined ? data.dofBlur : 8;
      const specular = data.specularGlare !== false;
      const shadowRad = data.shadowRadius !== undefined ? data.shadowRadius : 48;
      const drift = data.organicDrift !== false;
      const flySpeed = data.flySpeed !== undefined ? data.flySpeed : 1.0;
      const staggerDelay = data.staggerDelay !== undefined ? data.staggerDelay : 0.28;
      const paperGrain = data.paperGrain !== undefined ? data.paperGrain : 35;
      const showTelemetry = data.showTelemetry !== false;
      const activeCard = Number(data.activeCardTab || 5);

      const CARD_THEME_PRESETS = [
        { id: 'newsprint', label: 'Broadsheet Cream', bg: '#f6f1e7', text: '#0f172a', accent: '#b91c1c', hl: '#fde047' },
        { id: 'ft-salmon', label: 'Financial Salmon', bg: '#fcd5b5', text: '#1c1917', accent: '#9a3412', hl: '#fef08a' },
        { id: 'obsidian',  label: 'Dark Wire',        bg: '#0f172a', text: '#f8fafc', accent: '#38bdf8', hl: '#0284c7' },
        { id: 'crimson',   label: 'Breaking Red',     bg: '#18090c', text: '#ffffff', accent: '#ef4444', hl: '#b91c1c' },
        { id: 'amber',     label: 'Audit Gold',       bg: '#171207', text: '#fefce8', accent: '#f59e0b', hl: '#d97706' },
        { id: 'classified',label: 'Dossier Noir',     bg: '#11131a', text: '#f1f5f9', accent: '#a855f7', hl: '#7e22ce' }
      ];

      const CARD_FONTS = [
        { label: 'Playfair Serif (NYT / Editorial)', val: "'Playfair Display', Georgia, serif" },
        { label: 'Cinzel Classic (WSJ / Institutional)', val: "'Cinzel', Georgia, serif" },
        { label: 'Oswald Condensed (Tabloid / Impact)', val: "'Oswald', sans-serif" },
        { label: 'Inter Sans (Modern Digital Wire)', val: "'Inter', sans-serif" },
        { label: 'JetBrains Mono (Forensic Report)', val: "'JetBrains Mono', monospace" }
      ];

      const cVis = data[`visible${activeCard}`] !== false;
      const cTheme = data[`theme${activeCard}`] || 'newsprint';
      const cBg = data[`bgColor${activeCard}`] || '#f6f1e7';
      const cText = data[`textColor${activeCard}`] || '#0f172a';
      const cAccent = data[`accentColor${activeCard}`] || '#b91c1c';
      const cHl = data[`hlColor${activeCard}`] || '#fde047';
      const cSource = data[`source${activeCard}`] || '';
      const cKicker = data[`kicker${activeCard}`] || '';
      const cDate = data[`date${activeCard}`] || '';
      const cHeadline = data[`headline${activeCard}`] || '';
      const cHighlight = data[`highlight${activeCard}`] || '';
      const cSubhead = data[`subhead${activeCard}`] || '';
      const cByline = data[`byline${activeCard}`] || '';
      const cExhibit = data[`exhibit${activeCard}`] || '';
      const cFont = data[`font${activeCard}`] || "'Playfair Display', Georgia, serif";
      const cFontSize = data[`fontSize${activeCard}`] !== undefined ? data[`fontSize${activeCard}`] : 11.5;
      const cScale = data[`scale${activeCard}`] !== undefined ? data[`scale${activeCard}`] : 1.0;
      const cRot = data[`rot${activeCard}`] !== undefined ? data[`rot${activeCard}`] : 0;
      const cX = data[`x${activeCard}`] !== undefined ? data[`x${activeCard}`] : 0;
      const cY = data[`y${activeCard}`] !== undefined ? data[`y${activeCard}`] : 0;

      const escAttr = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const curLayoutStyle = data.layoutStyle || 'broadsheet';
      const bodyCol1 = data.bodyCol1 || 'Lorem ipsum dolor sit amet, consectetur cuised the largerst corporate insolven- evovencs in modern histroy.';
      const bodyCol2 = data.bodyCol2 || 'onablewead of the oxourancy and alentarih rough hanning inkia lioso, with mauitty-draw nes, and comhlicste distribution';

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(245,158,11,0.35); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 11px;">
          <!-- Suite Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 7px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: none; stroke: #fbbf24; stroke-width: 2;"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              <span style="font-size: 10.5px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px;">PRESS CLIPPINGS // 3D EDITORIAL SUITE</span>
            </div>
            <span style="font-size: 8.5px; color: #f59e0b; font-weight: 800; background: rgba(245,158,11,0.16); border: 1px solid rgba(245,158,11,0.3); padding: 2px 6px; border-radius: 4px;">PRO DOC</span>
          </div>

          <!-- PRESENTATION MODE: Broadsheet Journalism (Image 1) vs SaaS UI Cards -->
          <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(2,6,23,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 8.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">Documentary Editorial Presentation</span>
              <span style="font-size: 8px; color: #94a3b8;">Image 1 Default</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
              <button type="button" class="fly-mode-btn" data-mode="broadsheet" style="padding: 6px 7px; border-radius: 5px; font-size: 8.5px; font-weight: 800; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 5px; border: 1px solid ${curLayoutStyle !== 'saas' ? '#38bdf8' : 'rgba(255,255,255,0.08)'}; background: ${curLayoutStyle !== 'saas' ? 'rgba(56,189,248,0.2)' : 'rgba(15,23,42,0.6)'}; color: ${curLayoutStyle !== 'saas' ? '#ffffff' : '#94a3b8'};">
                <span style="font-size: 11px;">📰</span>
                <span>Broadsheet (Image 1)</span>
              </button>
              <button type="button" class="fly-mode-btn" data-mode="saas" style="padding: 6px 7px; border-radius: 5px; font-size: 8.5px; font-weight: 700; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 5px; border: 1px solid ${curLayoutStyle === 'saas' ? '#f59e0b' : 'rgba(255,255,255,0.08)'}; background: ${curLayoutStyle === 'saas' ? 'rgba(245,158,11,0.2)' : 'rgba(15,23,42,0.6)'}; color: ${curLayoutStyle === 'saas' ? '#ffffff' : '#94a3b8'};">
                <span style="font-size: 11px;">🏷️</span>
                <span>SaaS Cards (Legacy)</span>
              </button>
            </div>
          </div>

          <!-- SECTION 1: GRANULAR PER-CARD SELECTOR TABS (CARDS 1 TO 5) -->
          <div style="display: flex; flex-direction: column; gap: 7px; background: rgba(2,6,23,0.55); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px;">Select Clipping Card to Customize</span>
              <span style="font-size: 8.5px; color: #94a3b8;">Tip: Drag any card on stage</span>
            </div>

            <!-- 5 Card Pill Tabs -->
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px;">
              ${[1, 2, 3, 4, 5].map(idx => {
                const isAct = idx === activeCard;
                const isVis = data[`visible${idx}`] !== false;
                const dotCol = data[`accentColor${idx}`] || '#f59e0b';
                return `
                  <button type="button" class="fly-card-tab-btn" data-card-idx="${idx}" style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 2px;border-radius:6px;border:1px solid ${isAct ? '#f59e0b' : 'rgba(255,255,255,0.1)'};background:${isAct ? 'rgba(245,158,11,0.22)' : 'rgba(15,23,42,0.7)'};color:${isAct ? '#fff' : '#cbd5e1'};cursor:pointer;opacity:${isVis ? '1' : '0.45'};transition:all 0.15s;">
                    <div style="display:flex;align-items:center;gap:3px;">
                      <span style="width:6px;height:6px;border-radius:50%;background:${dotCol};"></span>
                      <span style="font-size:9.5px;font-weight:800;">#${idx}${idx === 5 ? '\u2605' : ''}</span>
                    </div>
                    <span style="font-size:7.5px;color:${isAct ? '#fde68a' : '#64748b'};font-weight:600;">${idx === 5 ? 'Hero' : `Clip ${idx}`}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Active Card Header + Visibility + Reset Position -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.06);">
              <label style="display:flex;align-items:center;gap:6px;font-size:9.5px;font-weight:700;color:#f8fafc;cursor:pointer;">
                <input type="checkbox" id="fly-card-vis" ${cVis ? 'checked' : ''} style="accent-color:#f59e0b;cursor:pointer;" />
                <span>Show Card #${activeCard} ${activeCard === 5 ? '(Center Hero Spotlight)' : ''}</span>
              </label>
              <button type="button" id="fly-card-reset-tf" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#cbd5e1;font-size:8.5px;font-weight:600;padding:2px 7px;border-radius:4px;cursor:pointer;" title="Reset this card's position, rotation, and scale">Reset Pos</button>
            </div>

            <!-- Theme Quick Presets for Active Card -->
            <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
              <span style="font-size: 8.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Paper &amp; Editorial Theme Preset</span>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                ${CARD_THEME_PRESETS.map(p => {
                  const active = cTheme === p.id;
                  return `<button type="button" class="fly-theme-preset-btn" data-theme-id="${p.id}" data-bg="${p.bg}" data-text="${p.text}" data-accent="${p.accent}" data-hl="${p.hl}" style="display:flex;align-items:center;gap:5px;padding:4px 6px;border-radius:5px;border:1px solid ${active ? '#f59e0b' : 'rgba(255,255,255,0.08)'};background:${active ? 'rgba(245,158,11,0.18)' : 'rgba(15,23,42,0.6)'};color:${active ? '#fff' : '#cbd5e1'};font-size:8.5px;font-weight:700;cursor:pointer;text-align:left;">
                    <span style="width:10px;height:10px;border-radius:2px;background:${p.bg};border:1.5px solid ${p.accent};flex-shrink:0;"></span>
                    <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.label}</span>
                  </button>`;
                }).join('')}
              </div>
            </div>

            <!-- 4 Granular Color Pickers for Active Card -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 2px;">
              <div style="display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(0,0,0,0.35);padding:4px;border-radius:5px;border:1px solid rgba(255,255,255,0.06);">
                <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">PAPER BG</span>
                <input type="color" id="fly-col-bg" value="${cBg}" style="width:100%;height:20px;border:none;background:transparent;cursor:pointer;" />
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(0,0,0,0.35);padding:4px;border-radius:5px;border:1px solid rgba(255,255,255,0.06);">
                <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">INK / TEXT</span>
                <input type="color" id="fly-col-text" value="${cText}" style="width:100%;height:20px;border:none;background:transparent;cursor:pointer;" />
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(0,0,0,0.35);padding:4px;border-radius:5px;border:1px solid rgba(255,255,255,0.06);">
                <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">ACCENT</span>
                <input type="color" id="fly-col-accent" value="${cAccent}" style="width:100%;height:20px;border:none;background:transparent;cursor:pointer;" />
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(0,0,0,0.35);padding:4px;border-radius:5px;border:1px solid rgba(255,255,255,0.06);">
                <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">MARKER HL</span>
                <input type="color" id="fly-col-hl" value="${cHl}" style="width:100%;height:20px;border:none;background:transparent;cursor:pointer;" />
              </div>
            </div>

            <!-- Editorial Copy Inputs for Active Card -->
            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 3px;">
              <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 5px;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">PUBLICATION MASTHEAD</span>
                  <input type="text" id="fly-card-source" value="${escAttr(cSource)}" placeholder="e.g. THE FINANCIAL CHRONICLE" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.12);border-radius:4px;padding:4px 6px;color:#f8fafc;font-size:9.5px;font-weight:700;outline:none;" />
                </div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">CATEGORY KICKER</span>
                  <input type="text" id="fly-card-kicker" value="${escAttr(cKicker)}" placeholder="e.g. EXCLUSIVE EXPOSE" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.12);border-radius:4px;padding:4px 6px;color:#fbbf24;font-size:9.5px;font-weight:700;outline:none;" />
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:2px;">
                <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">MAIN HEADLINE</span>
                <input type="text" id="fly-card-headline" value="${escAttr(cHeadline)}" placeholder="Main Headline Text" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.14);border-radius:4px;padding:5px 7px;color:#ffffff;font-size:10.5px;font-weight:700;outline:none;" />
              </div>

              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;justify-content:space-between;">
                  <span style="font-size:7.5px;color:#fde047;font-weight:700;">HIGHLIGHTED PHRASE (ANIMATED MARKER SWEEP)</span>
                  <span style="font-size:7.5px;color:#64748b;">Matches words in headline</span>
                </div>
                <input type="text" id="fly-card-highlight" value="${escAttr(cHighlight)}" placeholder="Exact words from headline to highlight..." style="background:rgba(250,204,21,0.08);border:1px solid rgba(250,204,21,0.3);border-radius:4px;padding:4px 6px;color:#fef08a;font-size:9.5px;font-weight:600;outline:none;" />
              </div>

              <div style="display:flex;flex-direction:column;gap:2px;">
                <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">SUB-HEADLINE / ARTICLE LEAD EXCERPT</span>
                <input type="text" id="fly-card-subhead" value="${escAttr(cSubhead)}" placeholder="Secondary investigative deck or excerpt..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:4px 6px;color:#cbd5e1;font-size:9px;outline:none;" />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 0.8fr 0.8fr; gap: 5px;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">AUTHOR BYLINE</span>
                  <input type="text" id="fly-card-byline" value="${escAttr(cByline)}" placeholder="By Reporter" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:3px 5px;color:#cbd5e1;font-size:8.5px;outline:none;" />
                </div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">DATE</span>
                  <input type="text" id="fly-card-date" value="${escAttr(cDate)}" placeholder="OCT 28, 2026" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:3px 5px;color:#cbd5e1;font-size:8.5px;outline:none;" />
                </div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">STAMP / EXHIBIT</span>
                  <input type="text" id="fly-card-exhibit" value="${escAttr(cExhibit)}" placeholder="EXHIBIT A-01" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:3px 5px;color:#fca5a5;font-size:8.5px;font-weight:700;outline:none;" />
                </div>
              </div>

              ${activeCard === 5 ? `
              <!-- Broadsheet Dual-Column Body Excerpts (Matches Image 1) -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 3px; padding-top: 5px; border-top: 1px dashed rgba(255,255,255,0.08);">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#38bdf8;font-weight:700;">BROADSHEET COL 1 EXCERPT</span>
                  <input type="text" id="fly-body-col1" value="${escAttr(bodyCol1)}" placeholder="Column 1 text..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(56,189,248,0.25);border-radius:4px;padding:3px 5px;color:#cbd5e1;font-size:8px;outline:none;" />
                </div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#38bdf8;font-weight:700;">BROADSHEET COL 2 EXCERPT</span>
                  <input type="text" id="fly-body-col2" value="${escAttr(bodyCol2)}" placeholder="Column 2 text..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(56,189,248,0.25);border-radius:4px;padding:3px 5px;color:#cbd5e1;font-size:8px;outline:none;" />
                </div>
              </div>
              ` : ''}
            </div>

            <!-- Per-Card Typography & Spatial Transform Controls -->
            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 3px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.08);">
              <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 6px; align-items: center;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:7.5px;color:#94a3b8;font-weight:700;">HEADLINE TYPOGRAPHY</span>
                  <select id="fly-card-font" style="background:#0f172a;border:1px solid rgba(255,255,255,0.15);border-radius:4px;color:#fff;font-size:9px;padding:3px 5px;outline:none;cursor:pointer;">
                    ${CARD_FONTS.map(f => `<option value="${escAttr(f.val)}" ${f.val === cFont ? 'selected' : ''}>${f.label}</option>`).join('')}
                  </select>
                </div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <div style="display:flex;justify-content:space-between;font-size:7.5px;color:#94a3b8;font-weight:700;">
                    <span>TEXT SIZE</span>
                    <span id="fly-val-csize" style="color:#fbbf24;">${cFontSize}px</span>
                  </div>
                  <input type="range" id="fly-card-fontsize" min="8.5" max="17" step="0.5" value="${cFontSize}" style="width:100%;accent-color:#f59e0b;height:3px;cursor:pointer;" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <div style="display:flex;justify-content:space-between;font-size:7.5px;color:#94a3b8;font-weight:700;">
                    <span>CARD SCALE</span>
                    <span id="fly-val-cscale" style="color:#fbbf24;">${Math.round(cScale * 100)}%</span>
                  </div>
                  <input type="range" id="fly-card-scale" min="0.65" max="1.45" step="0.02" value="${cScale}" style="width:100%;accent-color:#f59e0b;height:3px;cursor:pointer;" />
                </div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <div style="display:flex;justify-content:space-between;font-size:7.5px;color:#94a3b8;font-weight:700;">
                    <span>Z-TILT ANGLE</span>
                    <span id="fly-val-crot" style="color:#fbbf24;">${cRot}\u00b0</span>
                  </div>
                  <input type="range" id="fly-card-rot" min="-15" max="15" step="0.2" value="${cRot}" style="width:100%;accent-color:#f59e0b;height:3px;cursor:pointer;" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <div style="display:flex;justify-content:space-between;font-size:7.5px;color:#94a3b8;font-weight:700;">
                    <span>X OFFSET</span>
                    <span id="fly-val-cx" style="color:#38bdf8;">${cX}px</span>
                  </div>
                  <input type="range" id="fly-card-x" min="-220" max="220" step="1" value="${cX}" style="width:100%;accent-color:#38bdf8;height:3px;cursor:pointer;" />
                </div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <div style="display:flex;justify-content:space-between;font-size:7.5px;color:#94a3b8;font-weight:700;">
                    <span>Y OFFSET</span>
                    <span id="fly-val-cy" style="color:#38bdf8;">${cY}px</span>
                  </div>
                  <input type="range" id="fly-card-y" min="-160" max="160" step="1" value="${cY}" style="width:100%;accent-color:#38bdf8;height:3px;cursor:pointer;" />
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 2: 3D CAMERA RIG, MOTION BLUR & CHOREOGRAPHY -->
          <div style="display: flex; flex-direction: column; gap: 7px; background: rgba(2,6,23,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 9px;">
            <span style="font-size: 8.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">3D Camera Optics &amp; Entry Choreography</span>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 700; color: #94a3b8;">
                  <span>3D CAMERA TILT</span>
                  <span id="fly-val-tilt" style="color: #fbbf24;">${tilt}\u00b0</span>
                </div>
                <input type="range" id="fly-inp-tilt" min="0" max="25" step="0.5" value="${tilt}" style="width: 100%; accent-color: #f59e0b; height: 3px; cursor: pointer;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 700; color: #94a3b8;">
                  <span>VELOCITY BLUR</span>
                  <span id="fly-val-blur" style="color: #fbbf24;">${blurPx}px</span>
                </div>
                <input type="range" id="fly-inp-blur" min="0" max="64" value="${blurPx}" style="width: 100%; accent-color: #f59e0b; height: 3px; cursor: pointer;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 700; color: #94a3b8;">
                  <span>FLY-IN SPEED</span>
                  <span id="fly-val-speed" style="color: #fbbf24;">${Number(flySpeed).toFixed(1)}x</span>
                </div>
                <input type="range" id="fly-inp-speed" min="0.4" max="2.5" step="0.1" value="${flySpeed}" style="width: 100%; accent-color: #f59e0b; height: 3px; cursor: pointer;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 700; color: #94a3b8;">
                  <span>CARD STAGGER</span>
                  <span id="fly-val-stagger" style="color: #fbbf24;">${Number(staggerDelay).toFixed(2)}s</span>
                </div>
                <input type="range" id="fly-inp-stagger" min="0.05" max="0.65" step="0.03" value="${staggerDelay}" style="width: 100%; accent-color: #f59e0b; height: 3px; cursor: pointer;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 700; color: #94a3b8;">
                  <span>PAPER TEXTURE</span>
                  <span id="fly-val-grain" style="color: #fbbf24;">${paperGrain}%</span>
                </div>
                <input type="range" id="fly-inp-grain" min="0" max="100" value="${paperGrain}" style="width: 100%; accent-color: #f59e0b; height: 3px; cursor: pointer;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 700; color: #94a3b8;">
                  <span>DROP SHADOW</span>
                  <span id="fly-val-shadow" style="color: #fbbf24;">${shadowRad}px</span>
                </div>
                <input type="range" id="fly-inp-shadow" min="10" max="80" value="${shadowRad}" style="width: 100%; accent-color: #f59e0b; height: 3px; cursor: pointer;" />
              </div>
            </div>

            <!-- Cinematic Focal Depth-of-Field Bokeh Slider -->
            <div style="display: flex; flex-direction: column; gap: 2px; padding: 4px 0;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; font-weight: 700; color: #38bdf8;">
                <span>BACKGROUND DOF BOKEH BLUR</span>
                <span id="fly-val-dofblur" style="color: #38bdf8;">${dofPx}px</span>
              </div>
              <input type="range" id="fly-inp-dofblur" min="0" max="20" step="0.5" value="${dofPx}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
            </div>

            <!-- Optical Toggles -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding-top: 5px; border-top: 1px solid rgba(255,255,255,0.06);">
              <label style="display:flex;align-items:center;gap:5px;font-size:9px;color:#cbd5e1;cursor:pointer;">
                <input type="checkbox" id="fly-inp-mblur" ${motionBlur ? 'checked' : ''} style="accent-color:#f59e0b;" />
                Velocity Blur Vector
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:9px;color:#cbd5e1;cursor:pointer;">
                <input type="checkbox" id="fly-inp-dofbokeh" ${dofBokeh ? 'checked' : ''} style="accent-color:#f59e0b;" />
                Spotlight Hero Focus
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:9px;color:#cbd5e1;cursor:pointer;">
                <input type="checkbox" id="fly-inp-specular" ${specular ? 'checked' : ''} style="accent-color:#f59e0b;" />
                Specular Glare Sweep
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:9px;color:#cbd5e1;cursor:pointer;">
                <input type="checkbox" id="fly-inp-drift" ${drift ? 'checked' : ''} style="accent-color:#f59e0b;" />
                Organic Resting Drift
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:9px;color:#cbd5e1;cursor:pointer;grid-column:span 2;">
                <input type="checkbox" id="fly-inp-hud" ${showTelemetry ? 'checked' : ''} style="accent-color:#f59e0b;" />
                Show Top Archive Telemetry HUD
              </label>
            </div>
          </div>

          <!-- Studio Backdrop & Video B-Roll Picker -->
          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;

      // Wire Presentation Mode Switcher (Broadsheet vs SaaS)
      container.querySelectorAll('.fly-mode-btn').forEach(btn => {
        btn.onclick = () => {
          const nextMode = btn.dataset.mode || 'broadsheet';
          if (nextMode === 'broadsheet') {
            window.tplSetContextualData('headline-fly', {
              layoutStyle: 'broadsheet',
              theme1: 'newsprint', bgColor1: '#ece6d8', textColor1: '#1a1816', accentColor1: '#b91c1c', hlColor1: '#fde047', font1: "'Playfair Display', Georgia, serif",
              theme2: 'newsprint', bgColor2: '#eae4d5', textColor2: '#1a1816', accentColor2: '#9a3412', hlColor2: '#fde047', font2: "'Playfair Display', Georgia, serif",
              theme3: 'newsprint', bgColor3: '#e8e2d2', textColor3: '#1a1816', accentColor3: '#0284c7', hlColor3: '#38bdf8', font3: "'Playfair Display', Georgia, serif",
              theme4: 'newsprint', bgColor4: '#ece6d8', textColor4: '#1a1816', accentColor4: '#dc2626', hlColor4: '#ef4444', font4: "'Playfair Display', Georgia, serif", date4: 'OCT 28, 2026',
              theme5: 'newsprint', bgColor5: '#f6f2e8', textColor5: '#0a0a0a', accentColor5: '#b91c1c', hlColor5: '#facc15', font5: "'Playfair Display', Georgia, serif",
              dofBokeh: true, dofBlur: 9, paperGrain: 42
            });
          } else {
            window.tplSetContextualData('headline-fly', {
              layoutStyle: 'saas',
              theme1: 'newsprint', bgColor1: '#f6f1e7', textColor1: '#0f172a', accentColor1: '#b91c1c', hlColor1: '#fde047',
              theme2: 'ft-salmon', bgColor2: '#fcd5b5', textColor2: '#1c1917', accentColor2: '#9a3412', hlColor2: '#fef08a',
              theme3: 'obsidian',  bgColor3: '#0f172a', textColor3: '#f8fafc', accentColor3: '#38bdf8', hlColor3: '#0284c7', font3: "'Inter', sans-serif",
              theme4: 'crimson',   bgColor4: '#18090c', textColor4: '#ffffff', accentColor4: '#ef4444', hlColor4: '#b91c1c', font4: "'Inter', sans-serif", date4: 'OCT 27, 2026',
              theme5: 'newsprint', bgColor5: '#fdfbf7', textColor5: '#09090b', accentColor5: '#dc2626', hlColor5: '#facc15'
            });
          }
          window.tplRenderContextualInspector('headline-fly');
        };
      });

      // Wire Card Tab Selector Buttons
      container.querySelectorAll('.fly-card-tab-btn').forEach(btn => {
        btn.onclick = () => {
          const nextIdx = Number(btn.dataset.cardIdx || 5);
          window.tplSetContextualData('headline-fly', { activeCardTab: nextIdx });
          window.tplRenderContextualInspector('headline-fly');
        };
      });

      // Wire Visibility & Reset Position for Active Card
      container.querySelector('#fly-card-vis')?.addEventListener('change', e => {
        window.tplSetContextualData('headline-fly', { [`visible${activeCard}`]: e.target.checked });
        window.tplRenderContextualInspector('headline-fly');
      });
      container.querySelector('#fly-card-reset-tf')?.addEventListener('click', () => {
        const defRots = { 1: -2.2, 2: 2.4, 3: 1.6, 4: -1.8, 5: -0.6 };
        const defScales = { 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.06 };
        window.tplSetContextualData('headline-fly', {
          [`x${activeCard}`]: 0,
          [`y${activeCard}`]: 0,
          [`rot${activeCard}`]: defRots[activeCard] || 0,
          [`scale${activeCard}`]: defScales[activeCard] || 1.0
        });
        window.tplRenderContextualInspector('headline-fly');
      });

      // Wire Theme Preset Buttons for Active Card
      container.querySelectorAll('.fly-theme-preset-btn').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('headline-fly', {
            [`theme${activeCard}`]: btn.dataset.themeId,
            [`bgColor${activeCard}`]: btn.dataset.bg,
            [`textColor${activeCard}`]: btn.dataset.text,
            [`accentColor${activeCard}`]: btn.dataset.accent,
            [`hlColor${activeCard}`]: btn.dataset.hl
          });
          window.tplRenderContextualInspector('headline-fly');
        };
      });

      // Wire 4 Color Pickers for Active Card
      container.querySelector('#fly-col-bg')?.addEventListener('input', e => {
        window.tplSetContextualData('headline-fly', { [`bgColor${activeCard}`]: e.target.value });
      });
      container.querySelector('#fly-col-text')?.addEventListener('input', e => {
        window.tplSetContextualData('headline-fly', { [`textColor${activeCard}`]: e.target.value });
      });
      container.querySelector('#fly-col-accent')?.addEventListener('input', e => {
        window.tplSetContextualData('headline-fly', { [`accentColor${activeCard}`]: e.target.value });
      });
      container.querySelector('#fly-col-hl')?.addEventListener('input', e => {
        window.tplSetContextualData('headline-fly', { [`hlColor${activeCard}`]: e.target.value });
      });

      // Wire Editorial Copy Inputs for Active Card
      const bindCardText = (sel, propKey) => {
        container.querySelector(sel)?.addEventListener('input', e => {
          window.tplSetContextualData('headline-fly', { [`${propKey}${activeCard}`]: e.target.value });
        });
      };
      bindCardText('#fly-card-source', 'source');
      bindCardText('#fly-card-kicker', 'kicker');
      bindCardText('#fly-card-headline', 'headline');
      bindCardText('#fly-card-highlight', 'highlight');
      bindCardText('#fly-card-subhead', 'subhead');
      bindCardText('#fly-card-byline', 'byline');
      bindCardText('#fly-card-date', 'date');
      bindCardText('#fly-card-exhibit', 'exhibit');

      // Wire Broadsheet Body Column Inputs for Card 5
      container.querySelector('#fly-body-col1')?.addEventListener('input', e => {
        window.tplSetContextualData('headline-fly', { bodyCol1: e.target.value });
      });
      container.querySelector('#fly-body-col2')?.addEventListener('input', e => {
        window.tplSetContextualData('headline-fly', { bodyCol2: e.target.value });
      });

      // Wire Font & Spatial Transform Sliders for Active Card
      container.querySelector('#fly-card-font')?.addEventListener('change', e => {
        window.tplSetContextualData('headline-fly', { [`font${activeCard}`]: e.target.value });
      });
      const bindCardSlider = (sel, valSel, propKey, fmt) => {
        const inp = container.querySelector(sel);
        const valEl = container.querySelector(valSel);
        if (inp) {
          inp.oninput = (e) => {
            const num = Number(e.target.value);
            if (valEl) valEl.textContent = fmt(num);
            window.tplSetContextualData('headline-fly', { [`${propKey}${activeCard}`]: num });
          };
        }
      };
      bindCardSlider('#fly-card-fontsize', '#fly-val-csize', 'fontSize', v => `${v}px`);
      bindCardSlider('#fly-card-scale', '#fly-val-cscale', 'scale', v => `${Math.round(v * 100)}%`);
      bindCardSlider('#fly-card-rot', '#fly-val-crot', 'rot', v => `${v}\u00b0`);
      bindCardSlider('#fly-card-x', '#fly-val-cx', 'x', v => `${v}px`);
      bindCardSlider('#fly-card-y', '#fly-val-cy', 'y', v => `${v}px`);

      // Wire Global 3D Camera & Choreography Sliders
      const bindGlobalSlider = (sel, valSel, propKey, fmt) => {
        const inp = container.querySelector(sel);
        const valEl = container.querySelector(valSel);
        if (inp) {
          inp.oninput = (e) => {
            const num = Number(e.target.value);
            if (valEl) valEl.textContent = fmt(num);
            window.tplSetContextualData('headline-fly', { [propKey]: num });
          };
        }
      };
      bindGlobalSlider('#fly-inp-tilt', '#fly-val-tilt', 'tiltAngle', v => `${v}\u00b0`);
      bindGlobalSlider('#fly-inp-blur', '#fly-val-blur', 'blurIntensity', v => `${v}px`);
      bindGlobalSlider('#fly-inp-speed', '#fly-val-speed', 'flySpeed', v => `${v.toFixed(1)}x`);
      bindGlobalSlider('#fly-inp-stagger', '#fly-val-stagger', 'staggerDelay', v => `${v.toFixed(2)}s`);
      bindGlobalSlider('#fly-inp-grain', '#fly-val-grain', 'paperGrain', v => `${v}%`);
      bindGlobalSlider('#fly-inp-shadow', '#fly-val-shadow', 'shadowRadius', v => `${v}px`);
      bindGlobalSlider('#fly-inp-dofblur', '#fly-val-dofblur', 'dofBlur', v => `${v}px`);

      container.querySelector('#fly-inp-mblur')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { motionBlur: e.target.checked }));
      container.querySelector('#fly-inp-dofbokeh')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { dofBokeh: e.target.checked }));
      container.querySelector('#fly-inp-specular')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { specularGlare: e.target.checked }));
      container.querySelector('#fly-inp-drift')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { organicDrift: e.target.checked }));
      container.querySelector('#fly-inp-hud')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { showTelemetry: e.target.checked }));

      window.tplWireUniversalBgControls('headline-fly', container);
      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: PAPER TEAR TRANSITION (paper-rip-shred)
    // =========================================================================
    if (tplId === 'paper-rip-shred') {
      if (wrapPrim) wrapPrim.style.display = 'flex';
      if (wrapSec) wrapSec.style.display = 'flex';

      const curPreset = topCustomizerState.tearPreset || 'gold-standard';
      const curFps = topCustomizerState.tearFps || 12;
      const isStopMotion = topCustomizerState.tearStopMotion !== false;
      const curCurl = topCustomizerState.tearCurl ?? 60;
      const curShadow = topCustomizerState.tearShadowDepth ?? 32;
      const curRoughness = topCustomizerState.tearRoughness ?? 85;

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(168,85,247,0.35); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
          <!-- Header Banner -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">📜</span>
              <span style="font-size: 11px; font-weight: 800; color: #c084fc; text-transform: uppercase; letter-spacing: 0.5px;">Tactile Paper Tear Engine</span>
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #a855f7; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); padding: 2px 7px; border-radius: 4px;">VOX &amp; JOHNNY HARRIS</span>
          </div>

          <!-- Section 1: Preset Styles -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">1. Paper Material Preset</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
              <button type="button" class="paper-preset-btn ${curPreset === 'gold-standard' ? 'active' : ''}" data-preset="gold-standard" style="padding: 7px 4px; border-radius: 6px; font-size: 9.5px; font-weight: 700; background: ${curPreset === 'gold-standard' ? 'rgba(168,85,247,0.35)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${curPreset === 'gold-standard' ? '#a855f7' : 'rgba(255,255,255,0.1)'}; color: #fff; cursor: pointer;">
                🗺️ Aged Map / News
              </button>
              <button type="button" class="paper-preset-btn ${curPreset === 'document-dossier' ? 'active' : ''}" data-preset="document-dossier" style="padding: 7px 4px; border-radius: 6px; font-size: 9.5px; font-weight: 700; background: ${curPreset === 'document-dossier' ? 'rgba(168,85,247,0.35)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${curPreset === 'document-dossier' ? '#a855f7' : 'rgba(255,255,255,0.1)'}; color: #fff; cursor: pointer;">
                📁 Dossier Archive
              </button>
              <button type="button" class="paper-preset-btn ${curPreset === 'black-construction' ? 'active' : ''}" data-preset="black-construction" style="padding: 7px 4px; border-radius: 6px; font-size: 9.5px; font-weight: 700; background: ${curPreset === 'black-construction' ? 'rgba(168,85,247,0.35)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${curPreset === 'black-construction' ? '#a855f7' : 'rgba(255,255,255,0.1)'}; color: #fff; cursor: pointer;">
                ⬛ Black Paper
              </button>
            </div>
          </div>

          <!-- Section 2: Stop-Motion Cadence Controls -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">2. Stop-Motion Feel (Step Frames)</span>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="paper-inp-stopmotion" ${isStopMotion ? 'checked' : ''} style="cursor: pointer;" />
                <span style="font-size: 9.5px; font-weight: 700; color: ${isStopMotion ? '#38bdf8' : '#64748b'};"><span id="paper-lbl-fps">${curFps}</span> FPS Cadence</span>
              </label>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <button type="button" id="btn-fps-12" style="flex: 1; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; font-weight: 700; background: ${curFps === 12 ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${curFps === 12 ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; color: #fff; cursor: pointer;">
                12 FPS (Organic)
              </button>
              <button type="button" id="btn-fps-15" style="flex: 1; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; font-weight: 700; background: ${curFps === 15 ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${curFps === 15 ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; color: #fff; cursor: pointer;">
                15 FPS (Fluid)
              </button>
              <button type="button" id="btn-fps-smooth" style="flex: 1; padding: 5px 8px; border-radius: 5px; font-size: 9.5px; font-weight: 700; background: ${!isStopMotion ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${!isStopMotion ? '#c084fc' : 'rgba(255,255,255,0.1)'}; color: #fff; cursor: pointer;">
                Smooth 60 FPS
              </button>
            </div>
          </div>

          <!-- Section 3: 3D Curl & Shadow Physics -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">3. 3D Peel, Curl & Shadows</div>
            
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1;">
                <span>3D Flap Curl Roll-Back</span>
                <span id="paper-val-curl">${curCurl}%</span>
              </div>
              <input type="range" id="paper-slider-curl" min="10" max="100" value="${curCurl}" style="width: 100%; accent-color: #a855f7; cursor: pointer;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1;">
                <span>Directional Contact Shadow Depth</span>
                <span id="paper-val-shadow">${curShadow}px</span>
              </div>
              <input type="range" id="paper-slider-shadow" min="10" max="60" value="${curShadow}" style="width: 100%; accent-color: #a855f7; cursor: pointer;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #cbd5e1;">
                <span>Torn Edge Displacement & Shreds</span>
                <span id="paper-val-roughness">${curRoughness}%</span>
              </div>
              <input type="range" id="paper-slider-roughness" min="30" max="120" value="${curRoughness}" style="width: 100%; accent-color: #a855f7; cursor: pointer;" />
            </div>
          </div>
        </div>
      `;

      // Preset Click Handlers
      container.querySelectorAll('.paper-preset-btn').forEach(btn => {
        btn.onclick = () => {
          const p = btn.getAttribute('data-preset');
          topCustomizerState.tearPreset = p;
          if (p === 'gold-standard') {
            topCustomizerState.primaryUrl = '/paper_tear_hero_gold.jpg';
            topCustomizerState.secondaryUrl = '/paper_tear_revealed_city.jpg';
          } else if (p === 'document-dossier') {
            topCustomizerState.primaryUrl = '/paper_tear_document_dossier.jpg';
            topCustomizerState.secondaryUrl = '/paper_tear_revealed_city.jpg';
          } else if (p === 'black-construction') {
            topCustomizerState.primaryUrl = '/paper_tear_black_construction.jpg';
            topCustomizerState.secondaryUrl = '/cinematic_split_scene.jpg';
          }
          if (typeof renderTopTemplatePreviewStage === 'function') renderTopTemplatePreviewStage();
          window.tplRenderContextualInspector('paper-rip-shred');
        };
      });

      // Stop-Motion Handlers
      container.querySelector('#paper-inp-stopmotion')?.addEventListener('change', (e) => {
        topCustomizerState.tearStopMotion = e.target.checked;
        if (typeof renderTopTemplatePreviewStage === 'function') renderTopTemplatePreviewStage();
        window.tplRenderContextualInspector('paper-rip-shred');
      });

      container.querySelector('#btn-fps-12')?.addEventListener('click', () => {
        topCustomizerState.tearStopMotion = true;
        topCustomizerState.tearFps = 12;
        if (typeof renderTopTemplatePreviewStage === 'function') renderTopTemplatePreviewStage();
        window.tplRenderContextualInspector('paper-rip-shred');
      });

      container.querySelector('#btn-fps-15')?.addEventListener('click', () => {
        topCustomizerState.tearStopMotion = true;
        topCustomizerState.tearFps = 15;
        if (typeof renderTopTemplatePreviewStage === 'function') renderTopTemplatePreviewStage();
        window.tplRenderContextualInspector('paper-rip-shred');
      });

      container.querySelector('#btn-fps-smooth')?.addEventListener('click', () => {
        topCustomizerState.tearStopMotion = false;
        if (typeof renderTopTemplatePreviewStage === 'function') renderTopTemplatePreviewStage();
        window.tplRenderContextualInspector('paper-rip-shred');
      });

      // Slider Handlers
      const sliderCurl = container.querySelector('#paper-slider-curl');
      sliderCurl?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        topCustomizerState.tearCurl = val;
        const valEl = container.querySelector('#paper-val-curl');
        if (valEl) valEl.textContent = `${val}%`;
      });

      const sliderShadow = container.querySelector('#paper-slider-shadow');
      sliderShadow?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        topCustomizerState.tearShadowDepth = val;
        const valEl = container.querySelector('#paper-val-shadow');
        if (valEl) valEl.textContent = `${val}px`;
      });

      const sliderRough = container.querySelector('#paper-slider-roughness');
      sliderRough?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        topCustomizerState.tearRoughness = val;
        const valEl = container.querySelector('#paper-val-roughness');
        if (valEl) valEl.textContent = `${val}%`;
      });

      return;
    }

    // =========================================================================
    // SPECIAL HANDLER: CINEMATIC 3D SCREEN RECORDING BLUR (screen-blur)
    // =========================================================================
    if (tplId === 'screen-blur') {
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';

      const curUrl = data.urlBar || 'https://cloud.internal/admin/api-keys';
      const curTitle = data.windowTitle || 'Enterprise Security Console';
      const curTiltX = data.tiltX !== undefined ? data.tiltX : 5;
      const curRedact = data.showRedaction !== false;
      const curStyle = data.redactStyle || 'classified';
      const curLabel = data.redactLabel || 'RESTRICTED // API KEY REDACTED';
      const curMag = data.showMagnifier !== false;
      const curZoom = data.magnifierZoom || 1.5;
      const curTarget = data.magnifierTarget || 'SESSION AUTH TOKEN: 0x9F4A...VALID';
      const curHud = data.showGpuHud !== false;
      const curGpu = data.gpuText || 'REC \u25cf 00:02:14 // 120 FPS \u00b7 GPU ACCEL \u00b7 62\u00b0C';
      const curCursor = data.showCursor !== false;

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(56,189,248,0.35); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
          <!-- Header Banner -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">🖥️</span>
              <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">Cinematic 3D Screen Spotlight</span>
            </div>
            <label style="font-size: 9px; font-weight: 800; color: #020617; background: #38bdf8; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s;">
              + Swap Screen Media
              <input type="file" id="sb-up-screen" accept="image/*,video/*" style="display:none;" />
            </label>
          </div>

          <!-- Section 1: 3D Window Frame & Perspective Camera Tilt -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">1. 3D Window Frame & Camera Tilt</div>
            
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9.5px; color:#cbd5e1; margin-bottom:3px;">
                <span>3D Camera Tilt Angle</span>
                <span id="sb-val-tilt" style="color:#38bdf8; font-weight:700;">${curTiltX}°</span>
              </div>
              <input type="range" id="sb-inp-tilt" min="0" max="15" step="1" value="${curTiltX}" style="width:100%; accent-color:#38bdf8; cursor:pointer;" />
            </div>

            <div>
              <div style="font-size:9px; color:#94a3b8; margin-bottom:3px;">Window URL Bar & Domain Header</div>
              <input type="text" id="sb-inp-url" value="${curUrl}" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:5px; padding:5px 8px; font-size:10px; color:#38bdf8; font-family:monospace;" placeholder="https://..." />
            </div>

            <div>
              <div style="font-size:9px; color:#94a3b8; margin-bottom:3px;">App Header Title</div>
              <input type="text" id="sb-inp-title" value="${curTitle}" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:5px; padding:5px 8px; font-size:10px; color:#e2e8f0;" placeholder="Console / Dashboard Title" />
            </div>
          </div>

          <!-- Section 2: Selective Redaction & Censorship Mask -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">2. Selective Redaction Zone</span>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 10px; color: #cbd5e1;">
                <input type="checkbox" id="sb-inp-redact-enable" ${curRedact ? 'checked' : ''} style="accent-color: #ef4444;" />
                <span>Enabled</span>
              </label>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <div style="font-size:9px; color:#94a3b8; margin-bottom:3px;">Redaction Style</div>
                <select id="sb-inp-redact-style" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:5px; padding:5px 8px; font-size:10px; color:#e2e8f0;">
                  <option value="classified" ${curStyle === 'classified' ? 'selected' : ''}>🚨 Classified Bar</option>
                  <option value="glass" ${curStyle === 'glass' ? 'selected' : ''}>💎 Glassmorphic Blur</option>
                  <option value="pixel" ${curStyle === 'pixel' ? 'selected' : ''}>⬛ Cyber Pixel Block</option>
                </select>
              </div>
              <div>
                <div style="font-size:9px; color:#94a3b8; margin-bottom:3px;">Redaction Label</div>
                <input type="text" id="sb-inp-redact-label" value="${curLabel}" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:5px; padding:5px 8px; font-size:9px; color:#f87171; font-family:monospace;" />
              </div>
            </div>
          </div>

          <!-- Section 3: Focus Spotlight / Magnifier Callout Lens -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">3. Magnifier Callout Lens (Focus Zoom)</span>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 10px; color: #cbd5e1;">
                <input type="checkbox" id="sb-inp-mag-enable" ${curMag ? 'checked' : ''} style="accent-color: #38bdf8;" />
                <span>Enabled</span>
              </label>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size:9.5px; color:#cbd5e1; margin-bottom:3px;">
                <span>Spotlight Zoom Factor</span>
                <span id="sb-val-zoom" style="color:#38bdf8; font-weight:700;">${curZoom}x</span>
              </div>
              <input type="range" id="sb-inp-mag-zoom" min="1.1" max="2.4" step="0.1" value="${curZoom}" style="width:100%; accent-color:#38bdf8; cursor:pointer;" />
            </div>

            <div>
              <div style="font-size:9px; color:#94a3b8; margin-bottom:3px;">Magnified Target Focus Text</div>
              <input type="text" id="sb-inp-mag-target" value="${curTarget}" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:5px; padding:5px 8px; font-size:10px; color:#34d399; font-family:monospace;" />
            </div>
          </div>

          <!-- Section 4: Tech & GPU Hardware HUD Overlay -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">4. Tech / GPU Hardware HUD</span>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 10px; color: #cbd5e1;">
                <input type="checkbox" id="sb-inp-hud-enable" ${curHud ? 'checked' : ''} style="accent-color: #ef4444;" />
                <span>Show HUD</span>
              </label>
            </div>

            <div>
              <div style="font-size:9px; color:#94a3b8; margin-bottom:3px;">Telemetry & Hardware Metrics</div>
              <input type="text" id="sb-inp-hud-text" value="${curGpu}" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:5px; padding:5px 8px; font-size:9.5px; color:#38bdf8; font-family:monospace;" />
            </div>

            <!-- Quick Preset Pills for Tech HUD -->
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
              <button type="button" class="sb-hud-preset" data-text="REC \u25cf 00:02:14 // 120 FPS \u00b7 GPU ACCEL \u00b7 62\u00b0C" style="font-size:8px; padding:2px 6px; border-radius:4px; background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3); color:#38bdf8; cursor:pointer;">⚡ GPU Benchmark</button>
              <button type="button" class="sb-hud-preset" data-text="REC \u25cf 00:48:19 // 4K PRORES \u00b7 60 FPS \u00b7 NVENC" style="font-size:8px; padding:2px 6px; border-radius:4px; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.3); color:#4ade80; cursor:pointer;">🎥 4K Screen Capture</button>
              <button type="button" class="sb-hud-preset" data-text="FORENSIC REC // 1080P/24 \u00b7 ENCRYPTED FEED" style="font-size:8px; padding:2px 6px; border-radius:4px; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; cursor:pointer;">🔍 Cyber Forensic</button>
            </div>
          </div>

          <!-- Section 5: Animated Cursor & Spotlight -->
          <div style="background: rgba(2,6,23,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 10px; font-weight: 700; color: #cbd5e1;">5. Interactive Cursor & Motion Trail</span>
              <span style="font-size: 8.5px; color: #64748b;">Keyframed mouse sweeping across sensitive zone</span>
            </div>
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 10px; color: #cbd5e1;">
              <input type="checkbox" id="sb-inp-cursor-enable" ${curCursor ? 'checked' : ''} style="accent-color: #38bdf8;" />
              <span>Visible</span>
            </label>
          </div>

          ${window.tplBuildUniversalBgHtml(data)}
        </div>
      `;

      // Event listeners wiring
      container.querySelector('#sb-inp-tilt')?.addEventListener('input', e => {
        const v = Number(e.target.value);
        container.querySelector('#sb-val-tilt').textContent = `${v}°`;
        window.tplSetContextualData('screen-blur', { tiltX: v });
      });

      container.querySelector('#sb-inp-url')?.addEventListener('input', e => {
        window.tplSetContextualData('screen-blur', { urlBar: e.target.value });
      });

      container.querySelector('#sb-inp-title')?.addEventListener('input', e => {
        window.tplSetContextualData('screen-blur', { windowTitle: e.target.value });
      });

      container.querySelector('#sb-inp-redact-enable')?.addEventListener('change', e => {
        window.tplSetContextualData('screen-blur', { showRedaction: e.target.checked });
      });

      container.querySelector('#sb-inp-redact-style')?.addEventListener('change', e => {
        window.tplSetContextualData('screen-blur', { redactStyle: e.target.value });
      });

      container.querySelector('#sb-inp-redact-label')?.addEventListener('input', e => {
        window.tplSetContextualData('screen-blur', { redactLabel: e.target.value });
      });

      container.querySelector('#sb-inp-mag-enable')?.addEventListener('change', e => {
        window.tplSetContextualData('screen-blur', { showMagnifier: e.target.checked });
      });

      container.querySelector('#sb-inp-mag-zoom')?.addEventListener('input', e => {
        const v = Number(e.target.value);
        container.querySelector('#sb-val-zoom').textContent = `${v}x`;
        window.tplSetContextualData('screen-blur', { magnifierZoom: v });
      });

      container.querySelector('#sb-inp-mag-target')?.addEventListener('input', e => {
        window.tplSetContextualData('screen-blur', { magnifierTarget: e.target.value });
      });

      container.querySelector('#sb-inp-hud-enable')?.addEventListener('change', e => {
        window.tplSetContextualData('screen-blur', { showGpuHud: e.target.checked });
      });

      container.querySelector('#sb-inp-hud-text')?.addEventListener('input', e => {
        window.tplSetContextualData('screen-blur', { gpuText: e.target.value });
      });

      container.querySelectorAll('.sb-hud-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.dataset.text;
          const inp = container.querySelector('#sb-inp-hud-text');
          if (inp) inp.value = t;
          window.tplSetContextualData('screen-blur', { gpuText: t });
        });
      });

      container.querySelector('#sb-inp-cursor-enable')?.addEventListener('change', e => {
        window.tplSetContextualData('screen-blur', { showCursor: e.target.checked });
      });

      container.querySelector('#sb-up-screen')?.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (f) window.tplSetContextualData('screen-blur', { screenMediaUrl: URL.createObjectURL(f) });
      });

      window.tplWireUniversalBgControls('screen-blur', container);
      return;
    }

    // =========================================================================
    // GENERAL HANDLER: FOR ALL OTHER EXTRACTED TEMPLATES
    // Provides tailored, highly relevant controls specific to each template's fields
    // =========================================================================
    const keys = Object.keys(data).filter(k => !['type', 'bgPreset', 'bgMediaUrl', 'bgMediaType'].includes(k));
    const typeLabel = tplId.replace(/[-_]/g, ' ').toUpperCase();

    let fieldsHtml = '';
    keys.forEach(key => {
      const val = data[key];
      const prettyName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      if (typeof val === 'string' && val.startsWith('#') && (val.length === 7 || val.length === 4)) {
        // Color Picker
        fieldsHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 6px 8px;">
            <span style="font-size: 10.5px; font-weight: 600; color: #cbd5e1;">${prettyName}</span>
            <input type="color" data-key="${key}" value="${val}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" />
          </div>
        `;
      } else if (Array.isArray(val)) {
        // Simple Array of strings
        fieldsHtml += `
          <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 6px 8px;">
            <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${prettyName}</span>
            ${val.map((item, idx) => `
              <input type="text" data-array-key="${key}" data-idx="${idx}" value="${typeof item === 'object' ? (item.name || item.text || item.label || JSON.stringify(item)) : item}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10.5px; outline: none;" />
            `).join('')}
          </div>
        `;
      } else if (key.toLowerCase().includes('img') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('image')) {
        // Image / Media replacer
        fieldsHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 6px 8px;">
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 10.5px; font-weight: 600; color: #fff;">${prettyName}</span>
              <span style="font-size: 9px; color: #64748b;">${val ? 'Custom asset loaded' : 'Default asset'}</span>
            </div>
            <label for="ctx-upload-${key}" style="font-size: 9.5px; font-weight: 600; color: #a855f7; cursor: pointer; padding: 3px 8px; border-radius: 4px; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3);">
              Replace
              <input type="file" id="ctx-upload-${key}" data-img-key="${key}" accept="image/*,video/*" style="display: none;" />
            </label>
          </div>
        `;
      } else {
        // Text / Number Input
        fieldsHtml += `
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">${prettyName}</span>
            <input type="text" data-key="${key}" value="${val}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; font-weight: 600; outline: none;" />
          </div>
        `;
      }
    });

    container.innerHTML = `
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 13px;">\u2699</span>
            <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">${typeLabel} CONTROLS</span>
          </div>
          <span style="font-size: 9px; color: #a855f7; font-weight: 700; background: rgba(168,85,247,0.15); padding: 1px 6px; border-radius: 4px;">TOP PRIORITY</span>
        </div>
        ${fieldsHtml}
        ${window.tplBuildUniversalBgHtml ? window.tplBuildUniversalBgHtml(data) : ''}
      </div>
    `;
    if (window.tplWireUniversalBgControls) window.tplWireUniversalBgControls(tplId, container);

    // Wire general controls
    container.querySelectorAll('input[data-key]').forEach(inp => {
      const k = inp.dataset.key;
      inp.oninput = (e) => {
        window.tplSetContextualData(tplId, { [k]: e.target.value });
      };
    });

    container.querySelectorAll('input[data-img-key]').forEach(inp => {
      const k = inp.dataset.imgKey;
      inp.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          window.tplSetContextualData(tplId, { [k]: url });
        }
      };
    });

    container.querySelectorAll('input[data-array-key]').forEach(inp => {
      const k = inp.dataset.arrayKey;
      const idx = parseInt(inp.dataset.idx, 10);
      inp.oninput = (e) => {
        const arr = [...(data[k] || [])];
        if (typeof arr[idx] === 'object') {
          if (arr[idx].name !== undefined) arr[idx].name = e.target.value;
          else if (arr[idx].text !== undefined) arr[idx].text = e.target.value;
          else if (arr[idx].label !== undefined) arr[idx].label = e.target.value;
        } else {
          arr[idx] = e.target.value;
        }
        window.tplSetContextualData(tplId, { [k]: arr });
      };
    });
  };

  // --- 5. INITIALIZE ON LOAD ---
  if (typeof window !== 'undefined') {
    window.tplContextualLoaded = true;
  }
})();
