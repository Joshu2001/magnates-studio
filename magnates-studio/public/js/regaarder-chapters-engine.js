/**
 * Regaarder Studio — Documentary Chapters Suite (Phase 2)
 * Unifies:
 *   1. regaarder-minute16-chapter ("Minute 16 · Victory, Ships & Warehouse Accusations", 16:00–17:00)
 *   2. regaarder-minute17-chapter ("Minute 17 · Rain Rivalry, Next Generation & Split Flare", 17:00–18:00)
 *   3. regaarder-pele-pact-chapter ("The Pelé Pact · Chapter 6 (V127)", 18:50–20:14)
 *   4. regaarder-final-chapter ("The Final Chapter · Chapter 7 (V130)", 23:29–26:54)
 *
 * Adapted into Magnates Studio's unified stage, 4-Tab Contextual Inspector
 * (Content, Motion, Look, Effects + Advanced Controls), and Universal Contextual Toolbar.
 */
(function () {
  'use strict';

  const CHAPTER_TEMPLATE_IDS = [
    'regaarder-pele-pact-chapter',
    'regaarder-minute16-chapter',
    'regaarder-minute17-chapter',
    'regaarder-final-chapter',
    'regaarder-full-documentary'
  ];

  window.REGAARDER_CHAPTER_TEMPLATE_IDS = CHAPTER_TEMPLATE_IDS;

  // Registry of loaded ES module backends and media caches
  const chapterRuntime = {
    'regaarder-pele-pact-chapter': {
      key: 'pele',
      title: 'The Pelé Pact · Chapter 6',
      subtitle: '18:50–20:14 · V127 Documentary Sequence',
      duration: 84,
      ready: false,
      loading: false,
      mod: null,
      media: {},
      config: null,
      defaults: null,
      scenes: [
        { id: 'chapter', start: 0, end: 10, label: '01 Chapter 6 Intro' },
        { id: 'restaurant', start: 10, end: 22.7, label: '02 Wine & Dine' },
        { id: 'rivals', start: 22.7, end: 37.1, label: '03 Escalating Bids' },
        { id: 'mexico', start: 37.1, end: 44.5, label: '04 Mexico 70 Roll' },
        { id: 'newspapers', start: 44.5, end: 60.5, label: '05 Newspaper Collage' },
        { id: 'pact', start: 60.5, end: 75.3, label: '06 Crossed Brands' },
        { id: 'football', start: 75.3, end: 84, label: '07 Bicycle Kick' }
      ],
      selectedLayer: 'guest0',
      stageObjects: [
        { id: 'chapter_pele_handshake', layerId: 'handshake', name: 'Handshake Clasp', variant: 'media', x: 50, y: 24, w: 36, h: 28 },
        { id: 'chapter_pele_guest0', layerId: 'guest0', name: 'Left Diner (Blue)', variant: 'media', x: 35, y: 58, w: 22, h: 36 },
        { id: 'chapter_pele_guest1', layerId: 'guest1', name: 'Right Diner (Red)', variant: 'media', x: 65, y: 58, w: 22, h: 36 },
        { id: 'chapter_pele_poster', layerId: 'poster', name: 'Mexico 70 Poster', variant: 'media', x: 50, y: 50, w: 26, h: 38 },
        { id: 'chapter_pele_paper1', layerId: 'newspaper1', name: 'Lead Newspaper', variant: 'text', x: 62, y: 46, w: 28, h: 36 },
        { id: 'chapter_pele_player0', layerId: 'player0', name: 'Pelé Bicycle Kick', variant: 'media', x: 56, y: 54, w: 34, h: 42 }
      ]
    },
    'regaarder-minute16-chapter': {
      key: 'minute16',
      title: 'Minute 16 · Shipments & Warehouse',
      subtitle: '16:00–17:00 · V123 Documentary Sequence',
      duration: 60,
      ready: false,
      loading: false,
      mod: null,
      media: {},
      config: null,
      defaults: null,
      scenes: [
        { id: 'victory', start: 0, end: 13, label: '01 Archival Victory' },
        { id: 'showcase', start: 13, end: 23, label: '02 Shoe Pedestal' },
        { id: 'observer', start: 23, end: 29, label: '03 Rear Observer' },
        { id: 'rivalry', start: 29, end: 44.4, label: '04 Rivalry Ships' },
        { id: 'warehouse', start: 44.4, end: 56.7, label: '05 Warehouse Accusations' },
        { id: 'confrontation', start: 56.7, end: 60, label: '06 Confrontation' }
      ],
      selectedLayer: 'boot',
      stageObjects: [
        { id: 'chapter_m16_group', layerId: 'celebrationGroup', name: 'Celebration Trio', variant: 'media', x: 50, y: 52, w: 46, h: 52 },
        { id: 'chapter_m16_boot', layerId: 'boot', name: 'Pedestal Boot', variant: 'media', x: 50, y: 58, w: 24, h: 28 },
        { id: 'chapter_m16_ship_blue', layerId: 'blue', name: 'Adidas Cargo Ship', variant: 'media', x: 40, y: 50, w: 18, h: 48 },
        { id: 'chapter_m16_ship_orange', layerId: 'orange', name: 'PUMA Cargo Ship', variant: 'media', x: 60, y: 50, w: 18, h: 48 },
        { id: 'chapter_m16_bootpair', layerId: 'bootPair', name: 'Warehouse Boot Pair', variant: 'media', x: 50, y: 48, w: 32, h: 32 }
      ]
    },
    'regaarder-minute17-chapter': {
      key: 'minute17',
      title: 'Minute 17 · Next Generation & Split Flare',
      subtitle: '17:00–18:00 · V125 Documentary Sequence',
      duration: 60,
      ready: false,
      loading: false,
      mod: null,
      media: {},
      config: null,
      defaults: null,
      scenes: [
        { id: 'rivalry', start: 0, end: 13, label: '01 Rain & Products' },
        { id: 'families', start: 13, end: 25.5, label: '02 Next Generation' },
        { id: 'photo', start: 25.5, end: 35.5, label: '03 Archival Retreat' },
        { id: 'split', start: 35.5, end: 41, label: '04 Split & Flare' },
        { id: 'bridge', start: 43, end: 60, label: '05 Motion Bridge' }
      ],
      selectedLayer: 'photo',
      stageObjects: [
        { id: 'chapter_m17_blue', layerId: 'profileBlue', name: 'Blue Portrait', variant: 'media', x: 32, y: 56, w: 26, h: 46 },
        { id: 'chapter_m17_red', layerId: 'profileRed', name: 'Red Portrait', variant: 'media', x: 68, y: 56, w: 26, h: 46 },
        { id: 'chapter_m17_photo', layerId: 'photo', name: 'Archival Family Photo', variant: 'media', x: 50, y: 50, w: 48, h: 52 },
        { id: 'chapter_m17_shoe_blue', layerId: 'shoeBlue', name: 'Floating Blue Boot', variant: 'media', x: 36, y: 24, w: 20, h: 18 },
        { id: 'chapter_m17_shoe_red', layerId: 'shoeRed', name: 'Floating Red Boot', variant: 'media', x: 78, y: 38, w: 20, h: 18 }
      ]
    },
    'regaarder-final-chapter': {
      key: 'finalChapter',
      title: 'The Final Chapter · Legacy & Fire',
      subtitle: '23:29–26:54 · V130 Full Ending Sequence',
      duration: 205.632,
      ready: false,
      loading: false,
      mod: null,
      media: {},
      config: null,
      defaults: null,
      scenes: [
        { id: 'Final Chapter', start: 0, end: 9.65, label: '01 Final Chapter' },
        { id: 'Founders', start: 9.65, end: 18.05, label: '02 Founders' },
        { id: 'Burning shoe', start: 28.2, end: 37.13, label: '03 Burning Shoe' },
        { id: 'Financial distress', start: 37.13, end: 54, label: '04 Distress' },
        { id: 'Nike vortex', start: 58.57, end: 65, label: '05 Nike Vortex' },
        { id: 'Predator', start: 70.5, end: 81.5, label: '06 Predator & Athletes' },
        { id: 'Yeezy', start: 91.2, end: 99.93, label: '07 Yeezy' },
        { id: 'McQueen and Rihanna', start: 132.9, end: 149.3, label: '08 McQueen & Rihanna' },
        { id: 'Final rivalry', start: 183.4, end: 205.6, label: '09 Final Rivalry' }
      ],
      selectedLayer: 'hotShoe',
      stageObjects: [
        { id: 'chapter_final_shoe_tl', layerId: 'chapterShoes', name: 'Floating Boot (Top Left)', variant: 'media', x: 18, y: 38, w: 22, h: 22, sceneId: 'Final Chapter' },
        { id: 'chapter_final_shoe_tr', layerId: 'chapterShoes', name: 'Floating Boot (Top Right)', variant: 'media', x: 82, y: 36, w: 22, h: 22, sceneId: 'Final Chapter' },
        { id: 'chapter_final_shoe_bl', layerId: 'chapterShoes', name: 'Floating Boot (Bottom Left)', variant: 'media', x: 20, y: 84, w: 22, h: 22, sceneId: 'Final Chapter' },
        { id: 'chapter_final_shoe_br', layerId: 'chapterShoes', name: 'Floating Boot (Bottom Right)', variant: 'media', x: 78, y: 82, w: 22, h: 22, sceneId: 'Final Chapter' },
        { id: 'chapter_final_blue_frame', layerId: 'blueTrim', name: 'Adi Dassler Portrait & Blue Trim', variant: 'media', x: 32, y: 44, w: 28, h: 56, sceneId: 'Founders' },
        { id: 'chapter_final_red_frame', layerId: 'redTrim', name: 'Rudolf Dassler Portrait & Red Trim', variant: 'media', x: 68, y: 44, w: 28, h: 56, sceneId: 'Founders' },
        { id: 'chapter_final_sofa', layerId: 'sofa', name: 'Leather Parlor Sofa', variant: 'media', x: 50, y: 88, w: 64, h: 24, sceneId: 'Founders' },
        { id: 'chapter_final_viewer_blue', layerId: 'viewerBlue', name: 'Viewer Silhouette Blue', variant: 'media', x: 20, y: 78, w: 32, h: 44, sceneId: 'Founders' },
        { id: 'chapter_final_viewer_red', layerId: 'viewerRed', name: 'Viewer Silhouette Red', variant: 'media', x: 80, y: 78, w: 32, h: 44, sceneId: 'Founders' },
        { id: 'chapter_final_shoe', layerId: 'hotShoe', name: 'Burning Trainer Mesh', variant: 'media', x: 50, y: 54, w: 46, h: 44, sceneId: 'Burning shoe' },
        { id: 'chapter_final_paper_a', layerId: 'paperA', name: 'Deed of Debt A', variant: 'media', x: 28, y: 38, w: 32, h: 36, sceneId: 'Financial distress' },
        { id: 'chapter_final_paper_b', layerId: 'paperB', name: 'Deed of Debt B', variant: 'media', x: 54, y: 38, w: 32, h: 36, sceneId: 'Financial distress' },
        { id: 'chapter_final_adidas', layerId: 'adidasCard', name: 'Adidas Card', variant: 'media', x: 32, y: 64, w: 28, h: 34, sceneId: 'Financial distress' },
        { id: 'chapter_final_puma', layerId: 'pumaCard', name: 'PUMA Card', variant: 'media', x: 66, y: 64, w: 28, h: 34, sceneId: 'Financial distress' },
        { id: 'chapter_final_robert', layerId: 'robert', name: 'Robert Louis-Dreyfus', variant: 'media', x: 42, y: 52, w: 26, h: 48, sceneId: 'Nike vortex' },
        { id: 'chapter_final_beckham', layerId: 'beckham', name: 'David Beckham Cutout', variant: 'media', x: 26, y: 50, w: 24, h: 48, sceneId: 'Predator' },
        { id: 'chapter_final_kobe', layerId: 'kobe', name: 'Kobe Bryant Cutout', variant: 'media', x: 74, y: 50, w: 24, h: 48, sceneId: 'Predator' },
        { id: 'chapter_final_kanye', layerId: 'kanye', name: 'Kanye West Cutout', variant: 'media', x: 72, y: 50, w: 24, h: 48, sceneId: 'Yeezy' },
        { id: 'chapter_final_mcqueen', layerId: 'mcqueen', name: 'Alexander McQueen', variant: 'media', x: 34, y: 50, w: 26, h: 48, sceneId: 'McQueen and Rihanna' },
        { id: 'chapter_final_rihanna', layerId: 'rihanna', name: 'Rihanna Runway Cutout', variant: 'media', x: 66, y: 50, w: 26, h: 48, sceneId: 'McQueen and Rihanna' }
      ]
    },
    'regaarder-full-documentary': {
      key: 'documentary',
      title: 'Regaarder Documentary · Master Sequence',
      subtitle: '0:00–26:54 · The Complete 7-Chapter Master Documentary Sequence',
      duration: 1614.6,
      ready: false,
      loading: false,
      mod: null,
      media: {},
      config: null,
      defaults: null,
      scenes: [
        { id: 'origins', start: 0, end: 20, label: '01 · 0:00 Origins Slow Reveal' },
        { id: 'early_feud', start: 20, end: 895, label: '02 · 0:20 Early Decades & Archival Feud' },
        { id: 'checkpoint3d', start: 895, end: 960, label: '03 · 14:55 Checkpoint 3D Mannequins' },
        { id: 'minute16', start: 960, end: 1020, label: '04 · 16:00 Minute 16 Victory & Accusations' },
        { id: 'minute17', start: 1020, end: 1080, label: '05 · 17:00 Minute 17 Rain Rivalry & Split Flare' },
        { id: 'pele', start: 1130, end: 1214, label: '06 · 18:50 Chapter 6: The Pelé Pact' },
        { id: 'final', start: 1409, end: 1614.6, label: '07 · 23:29 Chapter 7: The Final Climax' }
      ],
      selectedLayer: 'masterTimeline',
      stageObjects: [
        { id: 'doc_origins_portrait', layerId: 'portrait', name: 'Archival Founder Portrait', variant: 'media', x: 50, y: 50, w: 42, h: 58, sceneId: 'origins' },
        { id: 'doc_act1_adolf', layerId: 'portrait', name: 'Adolf Dassler (Founder)', variant: 'media', x: 24, y: 44, w: 26, h: 48, sceneId: 'early_feud', minTime: 20, maxTime: 180 },
        { id: 'doc_act1_shoe', layerId: 'vintageBoot', name: 'Original Hand-Forged Spikes (1924)', variant: 'media', x: 50, y: 46, w: 32, h: 36, sceneId: 'early_feud', minTime: 55, maxTime: 180 },
        { id: 'doc_act1_rudolf', layerId: 'brother', name: 'Rudolf Dassler (Co-Founder)', variant: 'media', x: 76, y: 44, w: 26, h: 48, sceneId: 'early_feud', minTime: 110, maxTime: 180 },
        { id: 'doc_act2_golden_spikes', layerId: 'goldenSpikes', name: 'Jesse Owens Golden Spikes (1936)', variant: 'media', x: 50, y: 46, w: 34, h: 36, sceneId: 'early_feud', minTime: 180, maxTime: 360 },
        { id: 'doc_act3_adidas_logo', layerId: 'adidasBars', name: 'Adidas 3-Stripes Mark (1948)', variant: 'media', x: 25, y: 45, w: 30, h: 36, sceneId: 'early_feud', minTime: 360, maxTime: 540 },
        { id: 'doc_act3_puma_logo', layerId: 'pumaLockup', name: 'PUMA Formstrip & Cat (1948)', variant: 'media', x: 75, y: 45, w: 30, h: 36, sceneId: 'early_feud', minTime: 360, maxTime: 540 },
        { id: 'doc_act4_bern_boot', layerId: 'bernBoot', name: 'Screw-in Studded Boot (Bern 1954)', variant: 'media', x: 50, y: 46, w: 32, h: 36, sceneId: 'early_feud', minTime: 540, maxTime: 720 },
        { id: 'doc_act5_contract', layerId: 'contract', name: 'Underground Secret Contract', variant: 'media', x: 50, y: 46, w: 32, h: 36, sceneId: 'early_feud', minTime: 720, maxTime: 895 },
        { id: 'doc_checkpoint_figure', layerId: 'mannequinRig', name: 'Checkpoint 3D Mannequin Rig', variant: 'model', x: 50, y: 50, w: 40, h: 60, sceneId: 'checkpoint3d', minTime: 895, maxTime: 960 },
        { id: 'doc_pele_handshake', layerId: 'handshake', name: 'Handshake Clasp', variant: 'media', x: 50, y: 24, w: 36, h: 28, sceneId: 'pele', minTime: 1130, maxTime: 1214 },
        { id: 'doc_final_shoe', layerId: 'hotShoe', name: 'Burning Trainer Mesh', variant: 'media', x: 50, y: 52, w: 42, h: 38, sceneId: 'final', minTime: 1409, maxTime: 1614.6 },
        { id: 'doc_final_adidas', layerId: 'adidasCard', name: 'Adidas Brand Card', variant: 'media', x: 32, y: 52, w: 28, h: 34, sceneId: 'final', minTime: 1409, maxTime: 1614.6 },
        { id: 'doc_final_puma', layerId: 'pumaCard', name: 'PUMA Brand Card', variant: 'media', x: 66, y: 54, w: 28, h: 34, sceneId: 'final', minTime: 1409, maxTime: 1614.6 }
      ]
    }
  };

  window.REGAARDER_CHAPTER_RUNTIME = chapterRuntime;

  function cloneDeep(obj) {
    try {
      return structuredClone(obj);
    } catch (e) {
      return JSON.parse(JSON.stringify(obj));
    }
  }

  // Initialize default configs synchronously so Inspector can read them immediately
  function ensureFallbackConfig(templateId) {
    const rt = chapterRuntime[templateId];
    if (!rt) return {};
    if (rt.config) return rt.config;

    if (templateId === 'regaarder-pele-pact-chapter') {
      const layerKeys = ['room','guest6','guest7','table','chairBlue','chairRed','cash','guest0','guest1','guest2','guest3','guest4','guest5','handshake','portraitBlue','portraitRed','stage','smoke','wood','poster','blueCard','redCard','logoBlue','logoRed','moneyOne','moneyHundred','peleBall','footballBackground','player0','player1','player2','ball','fireAtlas','bootBlue','bootRed','paperEdge','nextInsert','newspaper1','newspaper2','photoPrint'];
      const layers = {};
      layerKeys.forEach((id) => {
        layers[id] = { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, flipX: false, useImage: id.startsWith('newspaper'), visible: true };
      });
      rt.defaults = {
        schema: 'regaarder-pele-v1', version: 127, speed: 1, reverse: false, zoom: 1, parallax: 1, exposure: 1,
        glow: 9, fog: 0.16, flameStrength: 0.85, flameSpeed: 8, handStart: 13.5, handSettle: 15.2, handExit: 22.6,
        roomPullback: 0.55, roomPullbackEnd: 22.6, logoSlideStart: 25, logoSlideDuration: 2, logoSlideDirection: 1,
        cashApproach: 3.2, lightStrength: 0.8, grainStrength: 0.16, edgeSoftness: 0.5, peopleMotion: 1,
        cashStart: 29.5, cashStagger: 0.4, cashCount: 3, cameraRoll: 90, posterSize: 245, tableTravel: 1,
        paperAge: 0.85, paperTitle: 'MAKE WAY FOR PELÉ', secondTitle: 'THE PRICE OF RIVALRY',
        chapterTitle: 'THE PELÉ PACT', chapterLabel: 'CHAPTER 6', crossPuma: 68.5, crossAdidas: 69, crossPele: 72.25,
        bootPunch: 80.9, ringStart: 81.2, ringDuration: 1.25, ringRadius: 75, ringWidth: 11, playerFlex: 0.4,
        ballDrift: 8, rampStrength: 0, rampStart: 75.3, rampEnd: 77.6, contactLock: true, bootMark: false,
        occlusion: true, showBounds: false, layers
      };
    } else if (templateId === 'regaarder-minute16-chapter') {
      const layerKeys = ['trophy','celebration','showcase','pedestal','moneyLeft','moneyRight','bankLeft','bankFront','celebrationGroup','celebrationClean','captain','rightPlayer','foregroundFan','pumaSymbol','sea','boot','bootPair','observer','blue','orange','warehouse','boxes','handUpperLeft','handRight','handLowerLeft','handLowerRight','profileBlue','profileOrange','city','crowd'];
      const layers = {};
      layerKeys.forEach((id) => {
        layers[id] = { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true };
      });
      rt.defaults = {
        schema: 'regaarder-minute16-v1', version: 123, masterStart: 960, duration: 60, speed: 1, reverse: false,
        cameraDolly: 0.42, parallax: 1, ambientStrength: 1, glow: 0.72, zoomScale: 1, occlusion: true, grain: 0.025,
        showBounds: false, brandLabels: true, brandText: { blue: 'adidas', orange: 'PUMA' }, snow: 0.65,
        waterSpeed: 12, waterStrength: 1, reflection: 1, mist: 0.5, shipBloom: 1.3, shoeTilt: 2.4, handMotion: 1,
        moneyGlow: 0.35, moneyBlur: 0.2, photoParallax: 1, archiveMode: 'exact-video',
        reveals: { moneyLeft: 14.8, moneyRight: 15.8, bankLeft: 16.4, bankFront: 17.4 },
        shoeEntryStart: 46.5, shoeEntryEnd: 48, shoeExitStart: 55.65, shoeExitEnd: 56.85,
        photoStartScale: 1, photoEndScale: 1, photoDebug: 'composite', layers,
        boundaries: rt.scenes.map((s) => ({ id: s.id, start: s.start, end: s.end })),
        hands: [
          { asset: 'handUpperLeft', start: 48.05, x: 38, y: 81, w: 310, angle: 0, fromX: -240, fromY: -90, depth: 0.5 },
          { asset: 'handRight', start: 49.1, x: 930, y: 70, w: 380, angle: 0, fromX: 320, fromY: 10, depth: 0.6 },
          { asset: 'handLowerLeft', start: 49.6, x: 22, y: 405, w: 360, angle: 0, fromX: -300, fromY: 30, depth: 0.7 },
          { asset: 'handLowerRight', start: 50.8, x: 800, y: 480, w: 390, angle: 90, fromX: 320, fromY: 220, depth: 0.3 }
        ],
        fit: { stageRetreat: 4, stageBootWidth: 105, stageAnchorX: 480, stageAnchorY: 322, shipHeight: 350, shipGap: 156, warehousePush: 1.22, observerWidth: 680, profileWidth: 565 }
      };
    } else if (templateId === 'regaarder-minute17-chapter') {
      const layerKeys = ['city','profileBlue','profileRed','logoBlue','logoRed','shortsBlue','shortsRed','shoeBlue','shoeRed','sockBlue','sockRed','panelBlue','panelRed','adultBlue','adultRed','sonBlue','sonRed','photo','paperEdge'];
      const layers = {};
      layerKeys.forEach((id) => {
        layers[id] = { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, visible: true, depth: 1 };
      });
      rt.defaults = {
        schema: 'regaarder-minute17-v1', version: 125, speed: 1, reverse: false, zoom: 1, parallax: 1,
        rain: 1, rainSpeed: 0.65, fog: 0.19, glow: 10, reflection: 0.5, productStart: 6.5, productStagger: 0.32,
        panelRedStart: 12.5, panelBlueStart: 13.1, panelRise: 2.3, panelExit: 25.5, panelExitEnd: 27.3,
        photoStartWidth: 590, photoEndWidth: 380, photoRetreat: 1, splitStart: 35.5, splitDuration: 3,
        splitGap: 160, splitTilt: 28, flare: 1.6, flareDuration: 1.7, portraitGap: 80, portraitEndWidth: 218,
        hairWind: 1.8, hairSpeed: 1.3, heat: 1.1, groundSmoke: 0.8, lightDepth: 1, lightBeam: 0.7,
        panelPullback: 0.15, panelPullbackStart: 16, panelPullbackEnd: 24.5, panelSmoke: 0.65,
        photoWear: 0.8, photoAge: 0.65, photoGrain: 0.08, bridgeTitle: 'REGAARDER', bridgeSubtitle: 'MOTION ATELIER',
        layers
      };
    } else if (templateId === 'regaarder-final-chapter') {
      const layerKeys = ['titles','beam','particles','vortex','markers','chapterShoes','hotShoe','clouds','pumaRed','wall','sofa','viewerBlue','viewerRed','hand','crowd','crowdNear','redRoom','wood','adidasCard','pumaCard','paperA','paperB','billA','billB','puma','adidas','nike','gold','amber','robert','warehouse','predator','kobe','beckham','kanye','yeezy','zeitz','mcqueen','rihanna','aerial','rivalBlueLogo','rivalRedLogo'];
      const layers = {};
      layerKeys.forEach((id) => {
        layers[id] = { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true };
      });
      rt.defaults = {
        speed: 1, reverse: false, direction: 1, travel: 1, particles: 1, glow: 1, exposure: 1,
        copy: {
          label: 'CHAPTER 7', title: 'THE FINAL CHAPTER', distress: 'BUT REVIVING THEM WOULDN’T BE',
          easy: 'EASY', robert: 'ROBERT LOUIS-DREYFUS', zeitz: 'JOCHEN ZEITZ',
          mcqueen: 'ALEXANDER McQUEEN', profession: 'FASHION DESIGNER', rihanna: 'RIHANNA',
          adidasHQ: 'ADIDAS HEADQUARTERS', pumaHQ: 'PUMA HEADQUARTERS'
        },
        cues: {},
        layers
      };
    } else if (templateId === 'regaarder-full-documentary') {
      rt.defaults = {
        speed: 1, reverse: false, zoom: 1, exposure: 1,
        copy: {
          title: 'REGAARDER MASTER SEQUENCE',
          subtitle: '0:00–26:54 FULL DOCUMENTARY'
        },
        layers: {
          portrait: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          vintageBoot: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          brother: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          goldenSpikes: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          adidasBars: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          pumaLockup: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          bernBoot: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          contract: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          mannequinRig: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          handshake: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          hotShoe: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          adidasCard: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          pumaCard: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true },
          masterTimeline: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true }
        }
      };
    }

    rt.config = cloneDeep(rt.defaults);
    return rt.config;
  }

  CHAPTER_TEMPLATE_IDS.forEach(ensureFallbackConfig);

  const docMediaCache = {};
  function getDocArchivalImage(src) {
    if (docMediaCache[src]) return docMediaCache[src];
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.src = src;
    docMediaCache[src] = im;
    return im;
  }

  async function ensureChapterModuleLoaded(templateId) {
    const rt = chapterRuntime[templateId];
    if (!rt || rt.ready || rt.loading) return rt;
    rt.loading = true;
    try {
      if (templateId === 'regaarder-full-documentary') {
        const immediateUrls = [
          '/assets/regaarder-motion/map.png',
          '/assets/regaarder-motion/portrait.png',
          '/assets/regaarder-motion/pair-v2.png',
          '/assets/minute16/vintage-boot.png'
        ];
        await Promise.all(immediateUrls.map((u) => {
          const im = getDocArchivalImage(u);
          return (im.decode ? im.decode().catch(() => {}) : Promise.resolve());
        }));

        rt.ready = true;
        rt.loading = false;

        // Lazy-load later chapter modules in background without stalling playback
        setTimeout(() => {
          const laterUrls = [
            '/assets/regaarder-motion/faces-v3.png',
            '/assets/regaarder-motion/clouds.png',
            '/assets/regaarder-motion/adidas-bars.svg',
            '/assets/regaarder-motion/puma-lockup.svg',
            '/assets/pele126/dollar-hundred-source.jpg',
            '/assets/pele126/horst-archival.jpg',
            '/assets/final-chapter/wall.png',
            '/assets/final-chapter/wood.png',
            '/assets/final-chapter/dust.png'
          ];
          laterUrls.forEach((u) => getDocArchivalImage(u));

          Promise.allSettled([
            ensureChapterModuleLoaded('regaarder-pele-pact-chapter'),
            ensureChapterModuleLoaded('regaarder-minute16-chapter'),
            ensureChapterModuleLoaded('regaarder-minute17-chapter'),
            ensureChapterModuleLoaded('regaarder-final-chapter'),
            (typeof window.ensureNative3DLoaded === 'function' ? window.ensureNative3DLoaded() : Promise.resolve())
          ]).catch(() => {});
        }, 150);

        return rt;
      }

      if (templateId === 'regaarder-pele-pact-chapter') {
        const mod = await import('./regaarder-chapters/pele-sequence.js');
        rt.mod = mod;
        rt.defaults = cloneDeep(mod.peleDefaults);
        rt.config = { ...cloneDeep(mod.peleDefaults), ...rt.config, layers: { ...cloneDeep(mod.peleDefaults.layers), ...(rt.config?.layers || {}) } };
        const loadedMap = await mod.preloadPele({
          manifest: async () => {
            try {
              const r = await fetch('pele-manifest.json');
              return r.ok ? await r.json() : { assets: [] };
            } catch (e) { return { assets: [] }; }
          },
          image: async (file) => {
            const im = new Image();
            im.crossOrigin = 'anonymous';
            im.src = '/assets/pele126/' + file;
            try { await im.decode(); } catch (e) {}
            return im;
          }
        });
        loadedMap.forEach((v, k) => { if (!rt.media[k]) rt.media[k] = v; });
      } else if (templateId === 'regaarder-minute16-chapter') {
        const mod = await import('./regaarder-chapters/minute16-sequence.js');
        rt.mod = mod;
        rt.defaults = cloneDeep(mod.minute16Defaults);
        rt.config = { ...cloneDeep(mod.minute16Defaults), ...rt.config, layers: { ...cloneDeep(mod.minute16Defaults.layers), ...(rt.config?.layers || {}) } };
        const loadedMap = mod.preloadMinute16('/assets/minute16/');
        loadedMap.forEach((v, k) => { if (!rt.media[k]) rt.media[k] = v; });
      } else if (templateId === 'regaarder-minute17-chapter') {
        const mod = await import('./regaarder-chapters/minute17-sequence.js');
        rt.mod = mod;
        rt.defaults = cloneDeep(mod.minute17Defaults);
        rt.config = { ...cloneDeep(mod.minute17Defaults), ...rt.config, layers: { ...cloneDeep(mod.minute17Defaults.layers), ...(rt.config?.layers || {}) } };
        const loadedMap = await mod.preloadMinute17({
          manifest: async () => {
            try {
              const r = await fetch('minute17-manifest.json');
              return r.ok ? await r.json() : { assets: [] };
            } catch (e) { return { assets: [] }; }
          },
          image: async (file) => {
            const im = new Image();
            im.crossOrigin = 'anonymous';
            im.src = '/assets/minute17/' + file;
            try { await im.decode(); } catch (e) {}
            return im;
          }
        });
        loadedMap.forEach((v, k) => { if (!rt.media[k]) rt.media[k] = v; });
      } else if (templateId === 'regaarder-final-chapter') {
        const mod = await import('./regaarder-chapters/chapter-sequence.js');
        rt.mod = mod;
        rt.defaults = cloneDeep(mod.defaults);
        rt.config = {
          ...cloneDeep(mod.defaults),
          ...rt.config,
          copy: { ...cloneDeep(mod.defaults.copy), ...(rt.config?.copy || {}) },
          cues: { ...cloneDeep(mod.defaults.cues), ...(rt.config?.cues || {}) },
          layers: { ...cloneDeep(mod.defaults.layers), ...(rt.config?.layers || {}) }
        };
        const loadPromises = Object.entries(mod.sources).map(([id, file]) => {
          if (rt.media[id]) return Promise.resolve(rt.media[id]);
          const url = '/assets/final-chapter/' + file;
          if (file.endsWith('.mp4')) {
            const v = document.createElement('video');
            v.muted = true;
            v.playsInline = true;
            v.preload = 'auto';
            v.src = url;
            rt.media[id] = v;
            return Promise.resolve(v);
          } else {
            const im = new Image();
            im.crossOrigin = 'anonymous';
            im.src = url;
            rt.media[id] = im;
            return (im.decode ? im.decode() : Promise.resolve()).catch(() => {}).then(() => {
              const stage = document.getElementById('tpl-modal-preview-stage');
              if (stage) {
                const t = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
                window.stepRegaarderChapterAnimation(stage, templateId, t);
              }
              return im;
            });
          }
        });
        await Promise.all(loadPromises);
      }
      rt.ready = true;
    } catch (err) {
      console.warn('[RegaarderChapter] Module load fallback active for', templateId, err.message);
    } finally {
      rt.loading = false;
    }
    return rt;
  }

  function renderFallbackPreview(ctx, rt, timeSec) {
    const W = 960, H = 540;
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#121b2d');
    grad.addColorStop(1, '#06080f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const sweepX = ((timeSec * 90) % (W + 400)) - 200;
    const glow = ctx.createRadialGradient(sweepX, H * 0.45, 10, sweepX, H * 0.45, 360);
    glow.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    glow.addColorStop(0.5, 'rgba(249, 115, 22, 0.10)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 16px Inter, system-ui, sans-serif';
    ctx.fillText((rt.subtitle || '').toUpperCase(), W / 2, H / 2 - 28);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 38px Inter, system-ui, sans-serif';
    ctx.fillText((rt.title || '').toUpperCase(), W / 2, H / 2 + 18);
    ctx.restore();
  }

  function paintArchivalDocumentarySegment(ctx, t, W, H) {
    ctx.save();

    let actTitle = 'CHAPTER 1 · THE DASSLER BROTHERS WORKSHOP';
    let actSubtitle = '1924–1936 · BAVARIAN ARTISANS & THE BIRTH OF SPIKES';
    let bgUrl = '/assets/regaarder-motion/map.png';
    let fgLeftUrl = null;
    let fgRightUrl = null;
    let centerUrl = null;
    let showSplit = false;

    if (t < 55) {
      actTitle = 'CHAPTER 1 · THE DASSLER BROTHERS WORKSHOP';
      actSubtitle = '1924–1928 · BAVARIAN ARTISANS & THE LAUNDRY ROOM ATELIER';
      bgUrl = '/assets/regaarder-motion/map.png';
      fgLeftUrl = '/assets/regaarder-motion/portrait.png';
      centerUrl = null;
      fgRightUrl = null;
    } else if (t < 110) {
      actTitle = 'CHAPTER 1 · FORGING THE FIRST RUNNING SPIKES';
      actSubtitle = '1924–1928 · ADOLF DASSLER FORGES HAND-HAMMERED STEEL TRACK SHOES';
      bgUrl = '/assets/regaarder-motion/map.png';
      fgLeftUrl = '/assets/regaarder-motion/portrait.png';
      centerUrl = '/assets/minute16/vintage-boot.png';
      fgRightUrl = null;
    } else if (t < 180) {
      actTitle = 'CHAPTER 1 · ADOLF & RUDOLF JOIN FORCES';
      actSubtitle = '1928–1936 · GEBRÜDER DASSLER SCHUHFABRIK ON THE WORLD STAGE';
      bgUrl = '/assets/regaarder-motion/map.png';
      fgLeftUrl = '/assets/regaarder-motion/portrait.png';
      centerUrl = '/assets/minute16/vintage-boot.png';
      fgRightUrl = '/assets/regaarder-motion/pair-v2.png';
    } else if (t < 360) {
      actTitle = 'CHAPTER 2 · THE 1936 OLYMPIC TRIUMPH';
      actSubtitle = 'BERLIN 1936 · JESSE OWENS & THE GOLDEN HAND-CRAFTED SPIKES';
      bgUrl = '/assets/regaarder-motion/clouds.png';
      centerUrl = '/assets/regaarder-motion/pair-v2.png';
      fgLeftUrl = '/assets/regaarder-motion/portrait.png';
      fgRightUrl = '/assets/minute16/vintage-boot.png';
    } else if (t < 540) {
      actTitle = 'CHAPTER 3 · THE GREAT SCHISM (1948)';
      actSubtitle = 'HERZOGENAURACH DIVIDED · ADIDAS VS PUMA ACROSS THE AURACH';
      bgUrl = '/assets/regaarder-motion/faces-v3.png';
      fgLeftUrl = '/assets/regaarder-motion/adidas-bars.svg';
      fgRightUrl = '/assets/regaarder-motion/puma-lockup.svg';
      showSplit = true;
    } else if (t < 720) {
      actTitle = 'CHAPTER 4 · THE MIRACLE OF BERN (1954)';
      actSubtitle = 'SWITZERLAND 1954 · SCREW-IN STUDS IN TORRENTIAL SEEDED RAIN';
      bgUrl = '/assets/final-chapter/wall.png';
      centerUrl = '/assets/minute16/vintage-boot.png';
      fgLeftUrl = '/assets/minute16/captain-cutout-v122.png';
      fgRightUrl = '/assets/minute16/rightPlayer-cutout-v122.png';
    } else if (t < 895) {
      actTitle = 'CHAPTER 4 · SECRET ENVOYS & UNDERGROUND WARS';
      actSubtitle = '1960–1970 · ESPIONAGE, BRIBES & THE RACE FOR WORLD CUP PLAYERS';
      bgUrl = '/assets/final-chapter/wood.png';
      fgLeftUrl = '/assets/pele126/horst-archival.jpg';
      centerUrl = '/assets/pele126/dollar-hundred-source.jpg';
    } else if (t >= 1080 && t < 1130) {
      actTitle = 'INTERMISSION · THE SECRET CONTRACT & ESCALATING BIDS';
      actSubtitle = '18:00–18:50 · RIVAL BIDS FOR THE WORLD’S GREATEST ATHLETE';
      bgUrl = '/assets/final-chapter/wood.png';
      fgLeftUrl = '/assets/pele126/horst-archival.jpg';
      centerUrl = '/assets/pele126/dollar-hundred-source.jpg';
    } else if (t >= 1214 && t < 1409) {
      actTitle = 'EPILOGUE · GLOBAL EXPANSION & MULTI-BILLION SNEAKER WARS';
      actSubtitle = '20:14–23:29 · WALL STREET, SATELLITE BROADCASTS & RECOVERY';
      bgUrl = '/assets/final-chapter/wall.png';
      fgLeftUrl = '/assets/final-chapter/adidasCard.png';
      fgRightUrl = '/assets/final-chapter/pumaCard.png';
      centerUrl = '/assets/final-chapter/sofa.png';
    }

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a0e17');
    grad.addColorStop(1, '#030508');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const bgImg = getDocArchivalImage(bgUrl);
    if (bgImg && bgImg.naturalWidth) {
      ctx.save();
      const zoom = 1.05 + 0.05 * Math.sin(t * 0.12);
      const panX = Math.sin(t * 0.08) * 24;
      const panY = Math.cos(t * 0.06) * 12;
      ctx.translate(W / 2 + panX, H / 2 + panY);
      ctx.scale(zoom, zoom);
      ctx.globalAlpha = 0.42;
      ctx.drawImage(bgImg, -W / 2, -H / 2, W, H);
      ctx.restore();
    }

    if (showSplit) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const splitGradL = ctx.createLinearGradient(0, 0, W / 2, 0);
      splitGradL.addColorStop(0, 'rgba(29, 78, 216, 0.28)');
      splitGradL.addColorStop(1, 'rgba(29, 78, 216, 0.02)');
      ctx.fillStyle = splitGradL;
      ctx.fillRect(0, 0, W / 2, H);

      const splitGradR = ctx.createLinearGradient(W, 0, W / 2, 0);
      splitGradR.addColorStop(0, 'rgba(185, 28, 28, 0.28)');
      splitGradR.addColorStop(1, 'rgba(185, 28, 28, 0.02)');
      ctx.fillStyle = splitGradR;
      ctx.fillRect(W / 2, 0, W / 2, H);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2, 40);
      ctx.lineTo(W / 2, H - 70);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    if (fgLeftUrl) {
      const leftImg = getDocArchivalImage(fgLeftUrl);
      if (leftImg && leftImg.naturalWidth) {
        ctx.save();
        const floatY = Math.sin(t * 0.4 + 1.2) * 6;
        ctx.translate(W * 0.24, H * 0.44 + floatY);
        const lScale = Math.min(220 / leftImg.naturalWidth, 260 / leftImg.naturalHeight);
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 18;
        ctx.drawImage(leftImg, -leftImg.naturalWidth * lScale / 2, -leftImg.naturalHeight * lScale / 2, leftImg.naturalWidth * lScale, leftImg.naturalHeight * lScale);
        ctx.restore();
      }
    }

    if (centerUrl) {
      const centerImg = getDocArchivalImage(centerUrl);
      if (centerImg && centerImg.naturalWidth) {
        ctx.save();
        const floatY = Math.sin(t * 0.45) * 8;
        ctx.translate(W * 0.50, H * 0.46 + floatY);
        const cScale = Math.min(280 / centerImg.naturalWidth, 240 / centerImg.naturalHeight);
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 24;
        ctx.drawImage(centerImg, -centerImg.naturalWidth * cScale / 2, -centerImg.naturalHeight * cScale / 2, centerImg.naturalWidth * cScale, centerImg.naturalHeight * cScale);
        ctx.restore();
      }
    }

    if (fgRightUrl) {
      const rightImg = getDocArchivalImage(fgRightUrl);
      if (rightImg && rightImg.naturalWidth) {
        ctx.save();
        const floatY = Math.sin(t * 0.38 + 2.5) * 6;
        ctx.translate(W * 0.76, H * 0.44 + floatY);
        const rScale = Math.min(220 / rightImg.naturalWidth, 260 / rightImg.naturalHeight);
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 18;
        ctx.drawImage(rightImg, -rightImg.naturalWidth * rScale / 2, -rightImg.naturalHeight * rScale / 2, rightImg.naturalWidth * rScale, rightImg.naturalHeight * rScale);
        ctx.restore();
      }
    }

    const vigGrad = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.65);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(3,5,8,0.78)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let p = 0; p < 18; p++) {
      const px = ((p * 137.5 + t * 24) % (W + 40)) - 20;
      const py = ((p * 93.1 + Math.sin(t * 0.5 + p) * 30 + p * 28) % (H + 40)) - 20;
      const pr = (p % 3) * 0.8 + 0.8;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    const barH = 68;
    const barY = H - barH - 14;
    const barW = W - 48;
    const barX = 24;

    ctx.save();
    ctx.fillStyle = 'rgba(10, 14, 24, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 12);
    ctx.fill();
    ctx.stroke();

    const accentGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
    accentGrad.addColorStop(0, '#38bdf8');
    accentGrad.addColorStop(0.5, '#a855f7');
    accentGrad.addColorStop(1, '#f97316');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(barX + 16, barY + 2, barW - 32, 2);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 16px Inter, system-ui, sans-serif';
    ctx.fillText(actTitle, barX + 20, barY + 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 12px Inter, system-ui, sans-serif';
    ctx.fillText(actSubtitle, barX + 20, barY + 50);

    ctx.textAlign = 'right';
    const curM = Math.floor(t / 60);
    const curS = Math.floor(t % 60).toString().padStart(2, '0');
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '700 14px ui-monospace, monospace';
    ctx.fillText(`${curM}:${curS} / 26:54`, barX + barW - 20, barY + 32);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 11px ui-monospace, monospace';
    ctx.fillText('MASTER TIMELINE', barX + barW - 20, barY + 50);

    ctx.restore();
    ctx.restore();
  }

  function paintDocumentarySequence(ctx, t) {
    const W = 960, H = 540;
    if (t < 20) {
      if (typeof window.renderOriginsSlowRevealCanvas === 'function') {
        window.renderOriginsSlowRevealCanvas(ctx, null, t, W, H);
        return;
      }
      if (typeof window.renderOriginsSlowRevealFrame === 'function') {
        window.renderOriginsSlowRevealFrame(ctx.canvas, t, window.REGAARDER_ORIGINS_CONFIG || {});
        return;
      }
    } else if (t >= 895 && t < 960) {
      const n3dState = window.REGAARDER_NATIVE3D_CONFIG;
      if (n3dState && n3dState.nativeReady && n3dState.nativeEngine && n3dState.nativeScene) {
        try {
          if (n3dState.preset !== 'checkpoint') {
            n3dState.preset = 'checkpoint';
            if (typeof window.syncStateToNativeScene === 'function') window.syncStateToNativeScene();
          }
          n3dState.nativeEngine.render(n3dState.nativeScene, (t - 895) % 5);
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(n3dState.nativeEngine.canvas, 0, 0, W, H);
          return;
        } catch (e) {}
      }
      if (typeof window.renderProjectedMannequinScene === 'function') {
        const prevPreset = n3dState?.preset;
        if (n3dState) n3dState.preset = 'checkpoint';
        window.renderProjectedMannequinScene(ctx, (t - 895) % 5);
        if (n3dState && prevPreset) n3dState.preset = prevPreset;
        return;
      }
    } else if (t >= 960 && t < 1020) {
      const rtM16 = chapterRuntime['regaarder-minute16-chapter'];
      if (rtM16 && rtM16.ready && rtM16.mod) {
        rtM16.mod.paintMinute16(ctx, t - 960, rtM16.media, rtM16.config);
        return;
      }
    } else if (t >= 1020 && t < 1080) {
      const rtM17 = chapterRuntime['regaarder-minute17-chapter'];
      if (rtM17 && rtM17.ready && rtM17.mod) {
        rtM17.mod.paintMinute17(ctx, t - 1020, rtM17.media, rtM17.config);
        return;
      }
    } else if (t >= 1130 && t < 1214) {
      const rtPele = chapterRuntime['regaarder-pele-pact-chapter'];
      if (rtPele && rtPele.ready && rtPele.mod) {
        rtPele.mod.paintPele(ctx, t - 1130, rtPele.media, rtPele.config);
        return;
      }
    } else if (t >= 1409 && t <= 1614.6) {
      const rtFinal = chapterRuntime['regaarder-final-chapter'];
      if (rtFinal && rtFinal.ready && rtFinal.mod) {
        rtFinal.mod.paint(ctx, t - 1409, rtFinal.media, rtFinal.config);
        return;
      }
    }

    paintArchivalDocumentarySegment(ctx, t, W, H);
  }

  function paintChapterFrame(canvas, templateId, timeSec) {
    if (!canvas) return;
    const rt = chapterRuntime[templateId];
    if (!rt) return;
    ensureFallbackConfig(templateId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const t = Math.max(0, Number(timeSec) || 0) % rt.duration;
    if (templateId === 'regaarder-full-documentary') {
      paintDocumentarySequence(ctx, t);
      return;
    }
    if (rt.ready && rt.mod) {
      try {
        if (templateId === 'regaarder-pele-pact-chapter') {
          rt.mod.paintPele(ctx, t, rt.media, rt.config);
        } else if (templateId === 'regaarder-minute16-chapter') {
          rt.mod.paintMinute16(ctx, t, rt.media, rt.config);
        } else if (templateId === 'regaarder-minute17-chapter') {
          rt.mod.paintMinute17(ctx, t, rt.media, rt.config);
        } else if (templateId === 'regaarder-final-chapter') {
          rt.mod.paint(ctx, t, rt.media, rt.config);
        }
        return;
      } catch (e) {
        // Fallback if any asset is still decoding
      }
    }
    renderFallbackPreview(ctx, rt, t);
  }

  function isChapterObjActive(obj, curSceneId, timeSec) {
    if (!obj) return false;
    const t = Number(timeSec) || 0;
    if (obj.sceneId && curSceneId && obj.sceneId !== curSceneId) return false;
    if (typeof obj.minTime === 'number' && t < obj.minTime) return false;
    if (typeof obj.maxTime === 'number' && t > obj.maxTime) return false;
    return true;
  }

  function syncChapterHitOverlay(container, templateId, timeSec) {
    if (!container) return;
    const rt = chapterRuntime[templateId];
    if (!rt || !Array.isArray(rt.stageObjects)) return;
    const t = Number(timeSec) || 0;
    const curScene = (rt.scenes || []).find((s) => t >= s.start && t < s.end) || rt.scenes?.[0];
    const curSceneId = curScene ? curScene.id : null;
    const hitBoxes = container.querySelectorAll('[data-chapter-obj]');
    hitBoxes.forEach((box) => {
      const objId = box.getAttribute('data-chapter-obj');
      const obj = rt.stageObjects.find((o) => o.id === objId);
      if (!obj) return;
      const active = isChapterObjActive(obj, curSceneId, t);
      if (!active) {
        box.style.display = 'none';
        box.style.pointerEvents = 'none';
      } else {
        box.style.display = 'block';
        box.style.pointerEvents = 'auto';
      }
    });
  }

  function buildChapterStageHTML(templateId, isHover) {
    const rt = chapterRuntime[templateId];
    if (!rt) return '';
    const suffix = isHover ? `hover-${templateId}` : templateId;
    const activeTime = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
    const curScene = (rt.scenes || []).find((s) => activeTime >= s.start && activeTime < s.end) || rt.scenes?.[0];
    const curSceneId = curScene ? curScene.id : null;

    const interactiveOverlayHtml = !isHover ? `
      <div class="rg-chapter-hit-layer" data-role="chapter-hit-layer" style="position:absolute;inset:0;z-index:22;pointer-events:auto;">
        ${rt.stageObjects.map((obj) => {
          const isVisible = isChapterObjActive(obj, curSceneId, activeTime);
          return `
          <div class="rg-chapter-hit-box"
               data-chapter-obj="${obj.id}"
               data-chapter-layer="${obj.layerId}"
               data-chapter-variant="${obj.variant}"
               title="${obj.name} (Click to select · Drag to reposition)"
               style="position:absolute;left:${obj.x}%;top:${obj.y}%;width:${obj.w}%;height:${obj.h}%;transform:translate(-50%,-50%);border:1.5px dashed transparent;border-radius:8px;cursor:grab;transition:border-color 0.15s ease, background 0.15s ease;display:${isVisible ? 'block' : 'none'};pointer-events:${isVisible ? 'auto' : 'none'};">
          </div>
        `;}).join('')}
      </div>
    ` : '';

    return `
      <div id="regaarder-chapter-viewport-${suffix}" class="rg-chapter-viewport" data-template-id="${templateId}" style="position:relative;width:100%;height:100%;background:#04060a;overflow:hidden;display:flex;align-items:center;justify-content:center;user-select:none;">
        <canvas id="regaarder-chapter-canvas-${suffix}" width="960" height="540" style="width:100%;height:100%;object-fit:contain;display:block;"></canvas>
        ${interactiveOverlayHtml}
      </div>
    `;
  }
  function wireChapterStageInteractions(container, templateId) {
    const rt = chapterRuntime[templateId];
    if (!rt || !container) return;
    const viewport = container.querySelector(`[data-template-id="${templateId}"]`) || container;
    const canvas = viewport.querySelector('canvas');

    ensureChapterModuleLoaded(templateId).then(() => {
      const t = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
      paintChapterFrame(canvas, templateId, t);
    });

    // Interactive object hit boxes -> Universal Contextual Toolbar + Drag
    const hitBoxes = viewport.querySelectorAll('[data-chapter-obj]');
    hitBoxes.forEach((box) => {
      box.addEventListener('mouseenter', () => {
        box.style.borderColor = 'rgba(155, 107, 255, 0.65)';
      });
      box.addEventListener('mouseleave', () => {
        if (!box.classList.contains('is-selected')) {
          box.style.borderColor = 'transparent';
        }
      });

      let dragging = false;
      let startX = 0, startY = 0;
      let origLayerX = 0, origLayerY = 0;
      const objId = box.getAttribute('data-chapter-obj');
      const layerId = box.getAttribute('data-chapter-layer');
      const variant = box.getAttribute('data-chapter-variant') || 'media';

      box.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        hitBoxes.forEach((b) => {
          b.classList.remove('is-selected');
          b.style.borderColor = 'transparent';
          b.style.background = 'transparent';
        });
        box.classList.add('is-selected');
        box.style.borderColor = '#9B6BFF';
        box.style.background = 'rgba(155, 107, 255, 0.08)';

        rt.selectedLayer = layerId;

        if (window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.showForObject === 'function') {
          const stageObj = rt.stageObjects.find((o) => o.id === objId);
          window.RegaarderContextualToolbar.showForObject({
            contextType: 'template',
            objectKey: objId,
            label: stageObj ? stageObj.name : objId,
            variant,
            anchorElement: box
          });
        }

        const cfg = ensureFallbackConfig(templateId);
        const layerObj = (cfg.layers && cfg.layers[layerId]) || { x: 0, y: 0 };
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origLayerX = layerObj.x || 0;
        origLayerY = layerObj.y || 0;
        try { box.setPointerCapture(e.pointerId); } catch (err) {}
      });

      box.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const rect = viewport.getBoundingClientRect();
        const scaleX = 960 / Math.max(1, rect.width);
        const scaleY = 540 / Math.max(1, rect.height);
        const dx = (e.clientX - startX) * scaleX;
        const dy = (e.clientY - startY) * scaleY;
        const cfg = ensureFallbackConfig(templateId);
        if (cfg.layers && cfg.layers[layerId]) {
          cfg.layers[layerId].x = Math.round(origLayerX + dx);
          cfg.layers[layerId].y = Math.round(origLayerY + dy);
          const t = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
          paintChapterFrame(canvas, templateId, t);
        }
      });

      const endDrag = () => { dragging = false; };
      box.addEventListener('pointerup', endDrag);
      box.addEventListener('pointercancel', endDrag);
    });
  }

  window.renderRegaarderChapterStage = function (container, templateId, isHover) {
    if (!container) return;
    container.innerHTML = buildChapterStageHTML(templateId, isHover);
    const canvas = container.querySelector('canvas');
    paintChapterFrame(canvas, templateId, 0.5);
    if (!isHover) {
      wireChapterStageInteractions(container, templateId);
    } else {
      ensureChapterModuleLoaded(templateId).then(() => {
        paintChapterFrame(canvas, templateId, 1.5);
      });
    }
  };

  window.stepRegaarderChapterAnimation = function (container, templateId, elapsedSec) {
    if (!container) return;
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    paintChapterFrame(canvas, templateId, elapsedSec);
    syncChapterHitOverlay(container, templateId, elapsedSec);
  };

  // Toolbar action handler for all Chapter objects
  window.applyRegaarderChapterToolbarAction = function (actionType, objectKey, value) {
    for (const tid of CHAPTER_TEMPLATE_IDS) {
      const rt = chapterRuntime[tid];
      const match = rt.stageObjects.find((o) => o.id === objectKey);
      if (!match) continue;
      const cfg = ensureFallbackConfig(tid);
      const layer = cfg.layers && cfg.layers[match.layerId];
      if (!layer) return false;

      if (actionType === 'opacity') {
        layer.opacity = Math.max(0.05, Math.min(1, Number(value) / 100));
      } else if (actionType === 'rotate') {
        layer.rotation = ((layer.rotation || 0) + (Number(value) || 15)) % 360;
      } else if (actionType === 'color') {
        cfg.glow = Math.max(4, cfg.glow || 10);
      } else if (actionType === 'align') {
        layer.x = 0;
        layer.y = 0;
      }
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const t = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
        window.stepRegaarderChapterAnimation(stage, tid, t);
      }
      return true;
    }
    return false;
  };

  // Build standardized 4-Tab Contextual Inspector (Content, Motion, Look, Effects) + Advanced Controls
  window.tplBuildRegaarderChapterRegaarderPanes = function (templateId) {
    const rt = chapterRuntime[templateId];
    if (!rt) return null;
    const cfg = ensureFallbackConfig(templateId);
    const layerIds = Object.keys(cfg.layers || {});
    const curLayerId = rt.selectedLayer && cfg.layers[rt.selectedLayer] ? rt.selectedLayer : (layerIds[0] || 'guest0');
    const curLayer = (cfg.layers && cfg.layers[curLayerId]) || { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, blur: 0, depth: 1, visible: true };

    // Copy fields depending on chapter
    let copyInputsHtml = '';
    if (templateId === 'regaarder-pele-pact-chapter') {
      copyInputsHtml = `
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Chapter Title</label><input type="text" class="rg-text-input" data-ch-prop="chapterTitle" value="${cfg.chapterTitle || 'THE PELÉ PACT'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Chapter Label</label><input type="text" class="rg-text-input" data-ch-prop="chapterLabel" value="${cfg.chapterLabel || 'CHAPTER 6'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Lead Headline</label><input type="text" class="rg-text-input" data-ch-prop="paperTitle" value="${cfg.paperTitle || 'MAKE WAY FOR PELÉ'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Second Headline</label><input type="text" class="rg-text-input" data-ch-prop="secondTitle" value="${cfg.secondTitle || 'THE PRICE OF RIVALRY'}"></div>
      `;
    } else if (templateId === 'regaarder-minute16-chapter') {
      copyInputsHtml = `
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Blue Ship Brand</label><input type="text" class="rg-text-input" data-ch-brand="blue" value="${(cfg.brandText && cfg.brandText.blue) || 'adidas'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Orange Ship Brand</label><input type="text" class="rg-text-input" data-ch-brand="orange" value="${(cfg.brandText && cfg.brandText.orange) || 'PUMA'}"></div>
      `;
    } else if (templateId === 'regaarder-minute17-chapter') {
      copyInputsHtml = `
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Bridge Headline</label><input type="text" class="rg-text-input" data-ch-prop="bridgeTitle" value="${cfg.bridgeTitle || 'REGAARDER'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Bridge Subtitle</label><input type="text" class="rg-text-input" data-ch-prop="bridgeSubtitle" value="${cfg.bridgeSubtitle || 'MOTION ATELIER'}"></div>
      `;
    } else if (templateId === 'regaarder-final-chapter') {
      const cp = cfg.copy || {};
      copyInputsHtml = `
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Chapter Label</label><input type="text" class="rg-text-input" data-ch-copy="label" value="${cp.label || 'CHAPTER 7'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Chapter Title</label><input type="text" class="rg-text-input" data-ch-copy="title" value="${cp.title || 'THE FINAL CHAPTER'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Distress Line</label><input type="text" class="rg-text-input" data-ch-copy="distress" value="${cp.distress || 'BUT REVIVING THEM WOULDN’T BE'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Adidas HQ Pin</label><input type="text" class="rg-text-input" data-ch-copy="adidasHQ" value="${cp.adidasHQ || 'ADIDAS HEADQUARTERS'}"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">PUMA HQ Pin</label><input type="text" class="rg-text-input" data-ch-copy="pumaHQ" value="${cp.pumaHQ || 'PUMA HEADQUARTERS'}"></div>
      `;
    } else if (templateId === 'regaarder-full-documentary') {
      copyInputsHtml = `
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Documentary Title</label><input type="text" class="rg-text-input" data-ch-copy="title" value="REGAARDER MASTER SEQUENCE"></div>
        <div class="rg-ctrl-row"><label class="rg-ctrl-label">Documentary Subtitle</label><input type="text" class="rg-text-input" data-ch-copy="subtitle" value="0:00–26:54 FULL DOCUMENTARY"></div>
      `;
    }

    const contentHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Chapter Beats & Timeline</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">Jump to Scene Beat</label>
            <select class="rg-select" data-ch-action="jump-scene">
              ${rt.scenes.map((s) => `<option value="${s.start}">${s.label} (${s.start}s)</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Titles & Editorial Copy</span></div>
        <div class="rg-section-body">
          ${copyInputsHtml}
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Independent Layer & Media Slot</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">Active Scene Layer (${layerIds.length} slots)</label>
            <select class="rg-select" data-ch-action="select-layer">
              ${layerIds.map((id) => `<option value="${id}" ${id === curLayerId ? 'selected' : ''}>${id}</option>`).join('')}
            </select>
          </div>
          <div class="rg-ctrl-row" style="margin-top:8px;">
            <label class="rg-ctrl-label">Replace Layer Image</label>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-ch-action="replace-layer-image" style="font-size:11px;width:100%;">
          </div>
        </div>
      </div>
    `;

    const motionHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Camera & Sequence Pace</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Playback Pace</label><span class="rg-ctrl-val">${Number(cfg.speed ?? 1).toFixed(2)}×</span></div>
            <input type="range" class="rg-range" min="0.2" max="2.5" step="0.05" value="${cfg.speed ?? 1}" data-ch-num="speed">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Parallax & Depth Motion</label><span class="rg-ctrl-val">${Number(cfg.parallax ?? cfg.travel ?? 1).toFixed(2)}</span></div>
            <input type="range" class="rg-range" min="0" max="2" step="0.05" value="${cfg.parallax ?? cfg.travel ?? 1}" data-ch-num="${'parallax' in cfg ? 'parallax' : 'travel'}">
          </div>
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" data-ch-bool="reverse" ${cfg.reverse ? 'checked' : ''}>
              <span>Reverse Sequence Playback</span>
            </label>
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Selected Layer Placement (${curLayerId})</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Offset X (px)</label><span class="rg-ctrl-val">${curLayer.x || 0}</span></div>
            <input type="range" class="rg-range" min="-600" max="600" step="2" value="${curLayer.x || 0}" data-ch-layer-num="x">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Offset Y (px)</label><span class="rg-ctrl-val">${curLayer.y || 0}</span></div>
            <input type="range" class="rg-range" min="-450" max="450" step="2" value="${curLayer.y || 0}" data-ch-layer-num="y">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Scale Multiplier</label><span class="rg-ctrl-val">${Number(curLayer.scale ?? 1).toFixed(2)}×</span></div>
            <input type="range" class="rg-range" min="0.15" max="3" step="0.02" value="${curLayer.scale ?? 1}" data-ch-layer-num="scale">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Rotation (°)</label><span class="rg-ctrl-val">${curLayer.rotation || 0}°</span></div>
            <input type="range" class="rg-range" min="-180" max="180" step="1" value="${curLayer.rotation || 0}" data-ch-layer-num="rotation">
          </div>
        </div>
      </div>
    `;

    const lookHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Lighting & Archival Grade</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Scene Exposure</label><span class="rg-ctrl-val">${Number(cfg.exposure ?? cfg.ambientStrength ?? 1).toFixed(2)}</span></div>
            <input type="range" class="rg-range" min="0.2" max="1.4" step="0.02" value="${cfg.exposure ?? cfg.ambientStrength ?? 1}" data-ch-num="${'exposure' in cfg ? 'exposure' : 'ambientStrength'}">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Accent Rim Glow</label><span class="rg-ctrl-val">${Number(cfg.glow ?? 1).toFixed(1)}</span></div>
            <input type="range" class="rg-range" min="0" max="25" step="0.2" value="${cfg.glow ?? 1}" data-ch-num="glow">
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Layer Opacity & Depth (${curLayerId})</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Layer Opacity</label><span class="rg-ctrl-val">${Math.round((curLayer.opacity ?? 1) * 100)}%</span></div>
            <input type="range" class="rg-range" min="0" max="1" step="0.02" value="${curLayer.opacity ?? 1}" data-ch-layer-num="opacity">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Depth Plane</label><span class="rg-ctrl-val">${Number(curLayer.depth ?? 1).toFixed(2)}</span></div>
            <input type="range" class="rg-range" min="0.1" max="3" step="0.05" value="${curLayer.depth ?? 1}" data-ch-layer-num="depth">
          </div>
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" data-ch-layer-bool="visible" ${curLayer.visible !== false ? 'checked' : ''}>
              <span>Layer Visible on Stage</span>
            </label>
          </div>
        </div>
      </div>
    `;

    const effectsHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Atmosphere, Flame & Paper Wear</span></div>
        <div class="rg-section-body">
          ${'flameStrength' in cfg ? `
            <div class="rg-ctrl-row">
              <div class="rg-ctrl-top"><label class="rg-ctrl-label">Flame Atlas Intensity</label><span class="rg-ctrl-val">${Number(cfg.flameStrength).toFixed(2)}</span></div>
              <input type="range" class="rg-range" min="0" max="1.5" step="0.05" value="${cfg.flameStrength}" data-ch-num="flameStrength">
            </div>
          ` : ''}
          ${'rain' in cfg ? `
            <div class="rg-ctrl-row">
              <div class="rg-ctrl-top"><label class="rg-ctrl-label">Rain & Storm Density</label><span class="rg-ctrl-val">${Number(cfg.rain).toFixed(2)}</span></div>
              <input type="range" class="rg-range" min="0" max="2.5" step="0.05" value="${cfg.rain}" data-ch-num="rain">
            </div>
          ` : ''}
          ${'snow' in cfg ? `
            <div class="rg-ctrl-row">
              <div class="rg-ctrl-top"><label class="rg-ctrl-label">Atmospheric Particles / Snow</label><span class="rg-ctrl-val">${Number(cfg.snow).toFixed(2)}</span></div>
              <input type="range" class="rg-range" min="0" max="1" step="0.02" value="${cfg.snow}" data-ch-num="snow">
            </div>
          ` : ''}
          ${'particles' in cfg ? `
            <div class="rg-ctrl-row">
              <div class="rg-ctrl-top"><label class="rg-ctrl-label">Vortex & Ember Particles</label><span class="rg-ctrl-val">${Number(cfg.particles).toFixed(2)}</span></div>
              <input type="range" class="rg-range" min="0" max="2" step="0.05" value="${cfg.particles}" data-ch-num="particles">
            </div>
          ` : ''}
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Selected Layer Soft Blur</label><span class="rg-ctrl-val">${Number(curLayer.blur || 0).toFixed(1)}px</span></div>
            <input type="range" class="rg-range" min="0" max="20" step="0.2" value="${curLayer.blur || 0}" data-ch-layer-num="blur">
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Preset & Frame Actions</span></div>
        <div class="rg-section-body">
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="rg-btn-secondary" data-ch-action="reset-layer" style="flex:1;padding:6px 10px;font-size:11px;">Reset Layer</button>
            <button type="button" class="rg-btn-secondary" data-ch-action="reset-all" style="flex:1;padding:6px 10px;font-size:11px;">Reset Chapter</button>
          </div>
        </div>
      </div>
    `;

    const advancedHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Diagnostics & Timing Calibration</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" data-ch-bool="showBounds" ${cfg.showBounds ? 'checked' : ''}>
              <span>Show Cutout Bounding Boxes</span>
            </label>
          </div>
        </div>
      </div>
    `;

    return {
      content: contentHtml,
      motion: motionHtml,
      look: lookHtml,
      effects: effectsHtml,
      advanced: advancedHtml
    };
  };

  window.wireRegaarderChapterInspectorEvents = function (modalEl, templateId) {
    if (!modalEl) return;
    const rt = chapterRuntime[templateId];
    if (!rt) return;
    const cfg = ensureFallbackConfig(templateId);

    const refreshStage = () => {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const t = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
        window.stepRegaarderChapterAnimation(stage, templateId, t);
      }
    };

    modalEl.querySelectorAll('[data-ch-prop]').forEach((inp) => {
      inp.addEventListener('input', () => {
        cfg[inp.getAttribute('data-ch-prop')] = inp.value;
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-ch-brand]').forEach((inp) => {
      inp.addEventListener('input', () => {
        cfg.brandText = cfg.brandText || {};
        cfg.brandText[inp.getAttribute('data-ch-brand')] = inp.value;
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-ch-copy]').forEach((inp) => {
      inp.addEventListener('input', () => {
        cfg.copy = cfg.copy || {};
        cfg.copy[inp.getAttribute('data-ch-copy')] = inp.value;
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-ch-num]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const k = inp.getAttribute('data-ch-num');
        cfg[k] = parseFloat(inp.value);
        const valSpan = inp.parentElement?.querySelector('.rg-ctrl-val');
        if (valSpan) valSpan.textContent = Number(cfg[k]).toFixed(2);
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-ch-bool]').forEach((inp) => {
      inp.addEventListener('change', () => {
        cfg[inp.getAttribute('data-ch-bool')] = inp.checked;
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-ch-layer-num]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const k = inp.getAttribute('data-ch-layer-num');
        const layer = cfg.layers && cfg.layers[rt.selectedLayer];
        if (!layer) return;
        layer[k] = parseFloat(inp.value);
        const valSpan = inp.parentElement?.querySelector('.rg-ctrl-val');
        if (valSpan) valSpan.textContent = k === 'opacity' ? `${Math.round(layer[k] * 100)}%` : String(layer[k]);
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-ch-layer-bool]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const k = inp.getAttribute('data-ch-layer-bool');
        const layer = cfg.layers && cfg.layers[rt.selectedLayer];
        if (!layer) return;
        layer[k] = inp.checked;
        refreshStage();
      });
    });

    const jumpSel = modalEl.querySelector('[data-ch-action="jump-scene"]');
    if (jumpSel) {
      jumpSel.addEventListener('change', () => {
        const sec = parseFloat(jumpSel.value) || 0;
        if (window.topCustomizerState) window.topCustomizerState.currentTime = sec + 0.1;
        refreshStage();
      });
    }

    const layerSel = modalEl.querySelector('[data-ch-action="select-layer"]');
    if (layerSel) {
      layerSel.addEventListener('change', () => {
        rt.selectedLayer = layerSel.value;
        if (typeof window.organizeUniversalTemplateControls === 'function') {
          window.organizeUniversalTemplateControls();
        }
      });
    }

    const fileInput = modalEl.querySelector('[data-ch-action="replace-layer-image"]');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          const im = new Image();
          im.onload = () => {
            rt.media[rt.selectedLayer] = im;
            refreshStage();
          };
          im.src = reader.result;
        };
        reader.readAsDataURL(f);
      });
    }

    const resetLayerBtn = modalEl.querySelector('[data-ch-action="reset-layer"]');
    if (resetLayerBtn) {
      resetLayerBtn.addEventListener('click', () => {
        if (rt.defaults && rt.defaults.layers && rt.defaults.layers[rt.selectedLayer]) {
          cfg.layers[rt.selectedLayer] = cloneDeep(rt.defaults.layers[rt.selectedLayer]);
          refreshStage();
          if (typeof window.organizeUniversalTemplateControls === 'function') {
            window.organizeUniversalTemplateControls();
          }
        }
      });
    }

    const resetAllBtn = modalEl.querySelector('[data-ch-action="reset-all"]');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => {
        if (rt.defaults) {
          rt.config = cloneDeep(rt.defaults);
          refreshStage();
          if (typeof window.organizeUniversalTemplateControls === 'function') {
            window.organizeUniversalTemplateControls();
          }
        }
      });
    }
  };
})();
