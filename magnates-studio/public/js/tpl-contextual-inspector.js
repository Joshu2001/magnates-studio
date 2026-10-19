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

  function persistStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(localStore));
    } catch (_) {}
  }

  // --- 1. DEFAULT DATA CONFIGURATIONS FOR ALL 50 EXTRACTED TEMPLATES ---
  const DEFAULTS = {
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
      assets: '$1,450,000',
      liabilities: '$620,000',
      netWorth: '$830,000',
      assetColor: '#10b981',
      liabColor: '#ef4444'
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
      items: [
        { name: 'Organic Almond Milk', price: '$4.99' },
        { name: 'Avocado 4-Pack', price: '$6.49' },
        { name: 'Grass-Fed Ribeye', price: '$22.80' }
      ],
      total: '$34.28'
    },

    // 12. Google Search Typing
    'google': {
      type: 'google',
      query: 'how to invest in index funds',
      suggestion: 'top index funds for passive wealth',
      suggestion2: 's&p 500 historical annual return',
      suggestion3: 'vanguard vs fidelity index funds'
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
      subs: '1.42M subscribers',
      btnText: 'SUBSCRIBED',
      btnColor: '#ef4444'
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
      showEmoji: false,
      emoji: '\ud83d\udd25',
      transparentBg: false,
      bgMedia: '',
      bgMediaType: 'image'
    },

    // 21. Ken Burns Cinematic
    'kenburns': {
      type: 'kenburns',
      caption: 'Silicon Valley, 1999',
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

    // 23. Money Counter (Cinematic Overhaul: Lost Hatch / Magnates Media / Hollywood Tier)
    'money': {
      type: 'money',
      theme: 'catastrophe', // 'catastrophe' | 'magnates' | 'cyber' | 'minimal'
      headerTag: 'CRITICAL AUDIT DISCLOSURE',
      label: 'TOTAL LOSSES',
      subLabel: 'CAPITAL DRAIN // RUNWAY EXHAUSTED',
      amount: '$69,000,000',
      startAmount: '$0',
      currencySymbol: '$',
      currencySuffix: 'USD',
      deltaText: '-94.2%',
      counterMode: 'odometer', // 'odometer' | 'scramble' | 'countup'
      countDuration: 3.0,
      easing: 'exponential', // 'exponential' | 'linear' | 'elastic'
      scaleSize: 100,
      enableBoom: true,
      shakeIntensity: 8,
      flareIntensity: 85,
      particleType: 'cash-ember', // 'cash-ember' | 'gold-dust' | 'cyber-motes' | 'none'
      particleDensity: 35,
      showVignette: true,
      showScanlines: true,
      soundProfile: 'subbass-boom', // 'subbass-boom' | 'mechanical-ticker' | 'none'
      color: '#ff334b'
    },

    // 24. Glitch Reveal
    'glitch': {
      type: 'glitch',
      text: 'THE TRUTH',
      color: '#00f0ff'
    },

    // 25. Investigative Globe & Map Pin Drop
    'map': {
      type: 'map',
      location: 'USA \u2192 UK \u2192 Ukraine',
      coords: 'MULTI-VECTOR TRANSIT // 2 ACTIVE LEGS',
      lat: 48.0,
      lng: 12.0,
      projection: 'globe',
      mapStyle: 'harris-dark',
      zoomStart: 0.8,
      zoomDuration: 2.2,
      zoomLevel: 1.9,
      pinColor: '#ef4444',
      showFlightPath: true,
      originLabel: 'USA',
      is3DMode: false,
      drawOnScreenMode: false,
      activeTraceTransit: 'plane',
      pitch3D: 22,
      yaw3D: -10,
      routes: [
        { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 54.0, toLng: -2.0, mode: 'plane', color: '#38bdf8' },
        { from: 'UK', to: 'Ukraine', fromLat: 54.0, fromLng: -2.0, toLat: 49.0, toLng: 31.4, mode: 'train', color: '#f59e0b' }
      ],
      customTracedRoutes: []
    },

    // 25B. Empire Rise & Fall Timeline (James Jani / Magnates Media Documentary Style)
    'empire-timeline': {
      type: 'empire-timeline',
      title: 'THE RISE & FALL OF ENRON',
      subtitle: 'CORPORATE VALUATION & LIQUIDITY CRASH \u00b7 1985 \u2014 2001',
      theme: 'james-jani',
      hairline: 1.2,
      showGrid: true,
      showAreaFill: true,
      is3DMode: false,
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
      headline: 'Tech Giant Announces Unprecedented Layoffs',
      ticker: 'MARKETS REACT: NASDAQ FUTURES SLIDE 3.2% IN AFTER-HOURS TRADING \u2022 FEDERAL REGULATORS OPEN INQUIRY',
      bannerColor: '#dc2626'
    },

    // 27. Cinematic Quote Card
    'quote': {
      type: 'quote',
      quote: 'Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.',
      author: 'Warren Buffett',
      source: 'The Essays of Warren Buffett'
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
      bgMediaUrl: '',
      bgMediaType: 'video',
      feedUrl: ''
    },

    // 31. Progress Bar
    'progress': {
      type: 'progress',
      goal: 'Project Funding',
      percent: '74%',
      amount: '$74,000 / $100,000',
      color: '#10b981'
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
      username: 'luxury_lifestyle',
      caption: 'The grind never stops. Private terminal.',
      likes: '124,592 likes',
      image: ''
    },

    // 35. Animated Checklist
    'checklist': {
      type: 'checklist',
      title: 'Action Steps',
      items: [
        'Register Company LLC',
        'Open Business Account',
        'Acquire First 100 Clients',
        'Automate Sales Funnel'
      ]
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

    // 37. Document Key Highlight
    'docheight': {
      type: 'docheight',
      docTitle: 'CONFIDENTIAL AGREEMENT',
      lines: [
        { id: 1, text: '1. Intellectual property rights reserved.', highlighted: true },
        { id: 2, text: '2. Total liability shall not exceed $10,000,000.', highlighted: true },
        { id: 3, text: '3. Immediate termination upon breach of clause.', highlighted: false }
      ],
      hlColor: '#facc15'
    },

    // 38. Kinetic Typography Stack
    'kinetic': {
      type: 'kinetic',
      word1: 'CREATE',
      word2: 'INSPIRE',
      word3: 'DOMINATE',
      color: '#ff7a59'
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
    'headline-fly': {
      type: 'headline-fly',
      tiltAngle: 9.5,
      motionBlur: true,
      blurIntensity: 32,
      dofBokeh: true,
      dofBlur: 8,
      specularGlare: true,
      shadowRadius: 48,
      shadowAlpha: 0.55,
      easingMode: 'cinematic',
      organicDrift: true,
      flySpeed: 1.0,
      staggerDelay: 0.28,
      paperGrain: 35,
      showTelemetry: true,
      hudLeft: 'INVESTIGATIVE PRESS ARCHIVE // RECONSTRUCTION 3D',
      hudRight: 'OPTICAL LENS: 35MM ANAMORPHIC',
      activeCardTab: 5,

      // Card #1 (Top-Left: Classic Broadsheet Tear-Sheet)
      visible1: true,
      theme1: 'newsprint',
      bgColor1: '#f6f1e7',
      textColor1: '#0f172a',
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
      theme2: 'ft-salmon',
      bgColor2: '#fcd5b5',
      textColor2: '#1c1917',
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
      theme3: 'obsidian',
      bgColor3: '#0f172a',
      textColor3: '#f8fafc',
      accentColor3: '#38bdf8',
      hlColor3: '#0284c7',
      source3: 'REUTERS INVESTIGATIVE WIRE',
      kicker3: 'FORENSIC AUDIT',
      date3: 'OCT 26, 2026',
      headline3: 'Federal Prosecutors Unseal Indictments Across 4 Districts',
      highlight3: 'Unseal Indictments',
      subhead3: 'Coordinated dawn raids target shell entities registered in Zurich, Cayman, and Singapore.',
      byline3: 'By Julian Thorne \u00b7 Legal Correspondent',
      exhibit3: 'DOSSIER #409',
      font3: "'Inter', sans-serif",
      fontSize3: 11,
      scale3: 1.0,
      rot3: 1.6,
      x3: 0,
      y3: 0,

      // Card #4 (Bottom-Right: Urgent Breaking Alert)
      visible4: true,
      theme4: 'crimson',
      bgColor4: '#18090c',
      textColor4: '#ffffff',
      accentColor4: '#ef4444',
      hlColor4: '#b91c1c',
      source4: 'BLOOMBERG TERMINAL ALERT',
      kicker4: 'BREAKING NEWS',
      date3_5: '',
      date4: 'OCT 27, 2026',
      headline4: 'Mass Protests as $18B in Depositor Assets Frozen Worldwide',
      highlight4: '$18B in Depositor Assets Frozen',
      subhead4: 'Emergency central bank liquidity facility triggered as contagion spreads to European clearinghouses.',
      byline4: 'Wire Dispatch \u00b7 London / NY',
      exhibit4: 'URGENT WIRE',
      font4: "'Inter', sans-serif",
      fontSize4: 11,
      scale4: 1.0,
      rot4: -1.8,
      x4: 0,
      y4: 0,

      // Card #5 (Center Hero Foreground Clipping: High-Contrast Broadsheet Spotlight)
      visible5: true,
      theme5: 'newsprint',
      bgColor5: '#fdfbf7',
      textColor5: '#09090b',
      accentColor5: '#dc2626',
      hlColor5: '#facc15',
      source5: 'THE WALL STREET INVESTIGATOR',
      kicker5: 'EXCLUSIVE EXPOSE',
      date5: 'OCT 28, 2026',
      headline5: 'The $40B Accounting Black Hole Exposed',
      highlight5: '$40B Accounting Black Hole',
      subhead5: 'How a decade of synthetic shadow loans disguised the largest corporate insolvency in modern history.',
      byline5: 'By Investigative Unit \u00b7 Special Report',
      exhibit5: 'KEY EVIDENCE #01',
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
    const preset = (data && data.bgPreset) || 'default';
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
    const preset = (data && data.bgPreset) || 'default';
    let bgUrl = (data && (data.bgMediaUrl || data.feedUrl)) || '';
    let isVideo = (data && data.bgMediaType === 'video') || (bgUrl && /\.(mp4|webm|mov)(\?|$)/i.test(bgUrl));

    // Fall back to topCustomizerState ONLY if preset is 'default' and no explicit preset was set,
    // and never let primaryUrl (subject figure/portrait/robot) pollute the background layer!
    if (!bgUrl && (!preset || preset === 'default') && typeof topCustomizerState !== 'undefined' && topCustomizerState) {
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
    { name: 'UK', aliases: ['united kingdom', 'britain', 'great britain', 'england', 'london', 'scotland'], lat: 54.0, lng: -2.0 },
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
    { name: 'Ukraine', aliases: ['kyiv', 'kiev', 'chernobyl', 'odessa'], lat: 49.0, lng: 31.4 },
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
            <path d="M -9 -2 L 6 -2 L 10 0 L 6 2 L -9 2 Z" fill="${col}" stroke="#ffffff" stroke-width="0.7"/>
            <rect x="-5" y="-1.4" width="4" height="2.8" rx="0.5" fill="#ffffff"/>
            <rect x="0" y="-1.4" width="3.5" height="2.8" rx="0.5" fill="#fbbf24"/>
            <path d="M -10 -1.5 L -15 -3.5 M -10 1.5 L -15 3.5" stroke="#ffffff" stroke-width="0.6" opacity="0.65"/>
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
            <rect x="-9" y="-2.2" width="14" height="4.4" rx="2.2" fill="${col}" stroke="#ffffff" stroke-width="0.7"/>
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
          <circle r="3" fill="#ffffff" stroke="${col}" stroke-width="1.5">
            <animateMotion dur="${dur}" repeatCount="indefinite">
              <mpath href="#${pathId}"/>
            </animateMotion>
          </circle>
        </g>
      `;
    }
    // Default: crisp commercial/tactical aircraft SVG ('plane')
    return `
      <g filter="url(#mapGlowFilter)">
        <g>
          <animateMotion dur="${dur}" repeatCount="indefinite" rotate="auto">
            <mpath href="#${pathId}"/>
          </animateMotion>
          <path d="M 8 0 L 2 -1.4 L -2 -8.5 L -4.2 -8.5 L -1.8 -1.4 L -6.5 -1.2 L -8.5 -4.2 L -10 -4.2 L -8.6 0 L -10 4.2 L -8.5 4.2 L -6.5 1.2 L -1.8 1.4 L -4.2 8.5 L -2 8.5 L 2 1.4 Z" fill="#ffffff" stroke="${col}" stroke-width="0.7"/>
        </g>
      </g>
    `;
  }

  window.tplBuildInvestigativeGlobeHtml = function(mData) {
    const d = mData || (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('map') : {});
    const proj = d.projection || 'globe';
    const styleKey = d.mapStyle || 'harris-dark';
    const pinColor = d.pinColor || '#ef4444';
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
        bg: 'radial-gradient(circle at 50% 50%, #0d2137 0%, #040911 100%)',
        ocean: '#061222',
        land: '#183252',
        landStroke: '#38bdf8',
        borderStroke: 'rgba(56, 189, 248, 0.32)',
        labelCol: 'rgba(226, 232, 240, 0.78)',
        grid: 'rgba(56, 189, 248, 0.13)',
        atmo: 'rgba(56, 189, 248, 0.32)'
      },
      'satellite': {
        bg: 'radial-gradient(circle at 50% 50%, #0a2540 0%, #020813 100%)',
        ocean: '#05182e',
        land: '#1b4332',
        landStroke: '#52b788',
        borderStroke: 'rgba(116, 198, 157, 0.32)',
        labelCol: 'rgba(241, 245, 249, 0.82)',
        grid: 'rgba(255, 255, 255, 0.12)',
        atmo: 'rgba(56, 189, 248, 0.35)'
      },
      'vox-archival': {
        bg: 'radial-gradient(circle at 50% 50%, #2b2620 0%, #14110e 100%)',
        ocean: '#1c1813',
        land: '#b8a675',
        landStroke: '#f4ecd8',
        borderStroke: 'rgba(244, 236, 216, 0.38)',
        labelCol: 'rgba(254, 243, 199, 0.85)',
        grid: 'rgba(244, 236, 216, 0.15)',
        atmo: 'rgba(245, 158, 11, 0.25)'
      },
      'radar-amber': {
        bg: 'radial-gradient(circle at 50% 50%, #1f1405 0%, #090502 100%)',
        ocean: '#120b03',
        land: '#3d1e06',
        landStroke: '#f59e0b',
        borderStroke: 'rgba(245, 158, 11, 0.35)',
        labelCol: 'rgba(253, 230, 138, 0.82)',
        grid: 'rgba(245, 158, 11, 0.15)',
        atmo: 'rgba(245, 158, 11, 0.32)'
      }
    };
    const th = themes[styleKey] || themes['harris-dark'];

    const activeRoutes = Array.isArray(d.routes) && d.routes.length > 0 ? d.routes : [
      { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 54.0, toLng: -2.0, mode: 'plane', color: '#38bdf8' }
    ];
    const customRoutes = Array.isArray(d.customTracedRoutes) ? d.customTracedRoutes : [];

    // Compute camera focus from the final route destination (or explicit lat/lng)
    const lastRoute = activeRoutes[activeRoutes.length - 1];
    const focusLat = lastRoute && lastRoute.toLat !== undefined ? parseFloat(lastRoute.toLat) : (d.lat !== undefined ? parseFloat(d.lat) : 51.27);
    const focusLng = lastRoute && lastRoute.toLng !== undefined ? parseFloat(lastRoute.toLng) : (d.lng !== undefined ? parseFloat(d.lng) : 30.22);
    const focusProj = window.tplProjectLatLngToMapSvg(focusLat, focusLng);
    const normX = Math.max(16, Math.min(84, focusProj.normX));
    const normY = Math.max(18, Math.min(82, focusProj.normY));
    const panX = ((50 - normX) * 0.28).toFixed(1) + '%';
    const panY = ((50 - normY) * 0.28).toFixed(1) + '%';

    const locTitle = d.location || activeRoutes.map((r, i) => i === 0 ? `${r.from} \u2192 ${r.to}` : r.to).join(' \u2192 ');
    const coordsSub = d.coords || `${activeRoutes.length} ACTIVE TRANSIT LEG${activeRoutes.length > 1 ? 'S' : ''} \u00b7 ${Math.abs(focusLat).toFixed(2)}\u00b0${focusLat >= 0 ? 'N' : 'S'}, ${Math.abs(focusLng).toFixed(2)}\u00b0${focusLng >= 0 ? 'E' : 'W'}`;

    // High-Granularity World Continents, Islands, Country Borders & Labels (400x225 Equirectangular)
    const granularWorldPaths = `
      <g class="world-landmasses" fill="${th.land}" stroke="${th.landStroke}" stroke-width="0.65" fill-opacity="0.9">
        <!-- North America (Alaska, Canada, USA, Baja, Florida, Central America) -->
        <path d="M 38 42 L 52 36 L 72 34 L 96 34 L 114 38 L 128 46 L 138 56 L 126 66 L 134 72 L 122 82 L 114 90 L 110 98 L 107 98 L 106 91 L 96 92 L 92 98 L 96 106 L 105 112 L 100 115 L 91 108 L 83 102 L 76 92 L 73 84 L 70 88 L 66 78 L 64 68 L 58 56 L 44 54 L 34 48 Z"/>
        <!-- Canadian Arctic Archipelago & Baffin Island -->
        <path d="M 94 24 L 112 22 L 122 28 L 116 35 L 98 32 Z"/>
        <path d="M 76 26 L 90 25 L 88 31 L 74 30 Z"/>
        <!-- Greenland -->
        <path d="M 128 16 L 158 14 L 166 24 L 154 38 L 138 40 L 130 28 Z"/>
        <!-- Iceland -->
        <path d="M 168 38 L 177 37 L 178 42 L 169 42 Z"/>
        <!-- Caribbean Islands (Cuba, Hispaniola, Puerto Rico) -->
        <path d="M 106 99 L 116 99 L 118 102 L 107 101 Z"/>
        <path d="M 119 101 L 125 101 L 125 104 L 119 103 Z"/>
        <!-- South America -->
        <path d="M 106 112 L 118 110 L 130 116 L 142 124 L 152 134 L 148 148 L 140 162 L 130 176 L 122 194 L 116 196 L 114 180 L 112 160 L 105 142 L 102 126 Z"/>
        <!-- UK & Ireland -->
        <path d="M 186 48 L 191 47 L 193 56 L 187 57 Z"/>
        <path d="M 181 51 L 185 51 L 185 55 L 181 55 Z"/>
        <!-- Continental Europe (Iberia, France, Germany, Italy, Balkans, Scandinavia) -->
        <path d="M 182 64 L 190 62 L 194 56 L 204 52 L 214 50 L 224 48 L 236 46 L 244 56 L 238 66 L 230 70 L 222 72 L 218 66 L 213 70 L 216 76 L 212 78 L 207 70 L 202 68 L 194 72 L 183 72 Z"/>
        <!-- Scandinavia (Norway, Sweden, Finland) -->
        <path d="M 198 32 L 212 26 L 226 30 L 228 42 L 218 46 L 212 40 L 204 46 L 198 42 Z"/>
        <!-- Africa -->
        <path d="M 182 76 L 202 74 L 216 78 L 228 80 L 236 92 L 248 104 L 244 120 L 238 138 L 230 156 L 218 172 L 208 172 L 202 154 L 198 136 L 192 118 L 178 112 L 172 98 L 176 84 Z"/>
        <!-- Madagascar -->
        <path d="M 242 146 L 247 144 L 246 160 L 241 158 Z"/>
        <!-- Middle East & Arabian Peninsula -->
        <path d="M 228 72 L 244 70 L 256 76 L 262 88 L 254 98 L 240 96 L 232 82 Z"/>
        <!-- Eurasia / Russia / India / SE Asia / China -->
        <path d="M 236 30 L 268 24 L 308 24 L 348 30 L 372 38 L 364 52 L 352 58 L 346 72 L 338 86 L 328 96 L 320 108 L 314 102 L 306 94 L 296 96 L 288 110 L 280 96 L 270 90 L 258 84 L 248 72 L 238 56 Z"/>
        <!-- Sri Lanka -->
        <path d="M 290 111 L 293 111 L 293 115 L 290 115 Z"/>
        <!-- Japan Archipelago -->
        <path d="M 352 62 L 358 60 L 360 68 L 354 76 L 349 74 Z"/>
        <!-- Taiwan & Philippines -->
        <path d="M 336 88 L 339 88 L 338 93 L 335 92 Z"/>
        <path d="M 336 98 L 342 98 L 344 108 L 338 108 Z"/>
        <!-- Indonesia & Maritime SE Asia (Sumatra, Java, Borneo, Sulawesi, Papua) -->
        <path d="M 310 114 L 322 122 L 334 124 L 320 126 L 308 118 Z"/>
        <path d="M 324 112 L 334 112 L 334 120 L 324 120 Z"/>
        <path d="M 346 118 L 364 120 L 366 128 L 348 126 Z"/>
        <!-- Australia & Tasmania -->
        <path d="M 322 142 L 344 138 L 362 144 L 368 158 L 360 174 L 342 176 L 322 168 L 316 154 Z"/>
        <path d="M 350 180 L 355 180 L 354 184 L 350 183 Z"/>
        <!-- New Zealand -->
        <path d="M 380 172 L 386 168 L 388 176 L 378 184 L 374 182 Z"/>
      </g>

      <!-- Granular Country Subdivision Borders -->
      <g stroke="${th.borderStroke}" stroke-width="0.45" stroke-dasharray="1.5 1" fill="none">
        <!-- US / Canada border & US / Mexico border -->
        <line x1="64" y1="62" x2="124" y2="62"/>
        <line x1="76" y1="86" x2="98" y2="89"/>
        <!-- South America borders (Brazil / Argentina / Peru / Colombia) -->
        <path d="M 112 124 L 128 128 L 132 148 L 122 162"/>
        <line x1="115" y1="160" x2="132" y2="162"/>
        <!-- Europe borders (France/Germany/Poland/Ukraine/Russia) -->
        <line x1="198" y1="54" x2="198" y2="66"/>
        <line x1="208" y1="52" x2="208" y2="66"/>
        <line x1="218" y1="50" x2="218" y2="65"/>
        <line x1="229" y1="48" x2="229" y2="66"/>
        <!-- Africa borders -->
        <line x1="176" y1="92" x2="234" y2="92"/>
        <line x1="204" y1="75" x2="204" y2="112"/>
        <line x1="218" y1="92" x2="218" y2="145"/>
        <line x1="204" y1="145" x2="234" y2="145"/>
        <!-- Asia borders (Russia/China/India/Kazakhstan) -->
        <path d="M 256 56 L 292 58 L 336 56"/>
        <path d="M 276 76 L 298 78 L 312 92"/>
      </g>

      <!-- Country & Regional Map Labels -->
      <g fill="${th.labelCol}" font-family="'Space Grotesk', 'Inter', sans-serif" font-size="3.9" font-weight="700" letter-spacing="0.06em" text-anchor="middle" style="pointer-events:none; user-select:none;">
        <text x="90" y="52">CANADA</text>
        <text x="92" y="75">USA</text>
        <text x="88" y="96">MEXICO</text>
        <text x="145" y="28" opacity="0.7">GREENLAND</text>
        <text x="115" y="120">COLOMBIA</text>
        <text x="134" y="142">BRAZIL</text>
        <text x="122" y="176">ARGENTINA</text>
        <text x="186" y="52">UK</text>
        <text x="195" y="63">FRANCE</text>
        <text x="206" y="58">GERMANY</text>
        <text x="186" y="70">SPAIN</text>
        <text x="210" y="69">ITALY</text>
        <text x="212" y="38">SWEDEN</text>
        <text x="226" y="58">UKRAINE</text>
        <text x="285" y="42">RUSSIA</text>
        <text x="233" y="71">TURKEY</text>
        <text x="223" y="86">EGYPT</text>
        <text x="188" y="86">MOROCCO</text>
        <text x="198" y="110">NIGERIA</text>
        <text x="232" y="118">KENYA</text>
        <text x="216" y="168">S. AFRICA</text>
        <text x="246" y="88">SAUDI ARABIA</text>
        <text x="258" y="89">UAE</text>
        <text x="256" y="76">IRAN</text>
        <text x="288" y="96">INDIA</text>
        <text x="316" y="74">CHINA</text>
        <text x="342" y="69">S. KOREA</text>
        <text x="360" y="68">JAPAN</text>
        <text x="316" y="116">SINGAPORE</text>
        <text x="330" y="125">INDONESIA</text>
        <text x="344" y="158">AUSTRALIA</text>
        <text x="382" y="180">N.Z.</text>
      </g>
    `;

    // Build SVG paths + animated transit vehicles for all active routes
    const routeElementsHtml = showArc ? activeRoutes.map((rt, idx) => {
      const fGeo = (rt.fromLat !== undefined && rt.fromLng !== undefined)
        ? { lat: rt.fromLat, lng: rt.fromLng }
        : (window.tplResolveGeoLocation(rt.from) || { lat: 39.8, lng: -98.5 });
      const tGeo = (rt.toLat !== undefined && rt.toLng !== undefined)
        ? { lat: rt.toLat, lng: rt.toLng }
        : (window.tplResolveGeoLocation(rt.to) || { lat: 54.0, lng: -2.0 });

      const p1 = window.tplProjectLatLngToMapSvg(fGeo.lat, fGeo.lng);
      const p2 = window.tplProjectLatLngToMapSvg(tGeo.lat, tGeo.lng);
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const arcLift = rt.mode === 'train' ? Math.min(10, dist * 0.08) : (rt.mode === 'ship' ? -Math.min(14, dist * 0.1) : Math.min(42, Math.max(14, dist * 0.28)));
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2 - arcLift;
      const pathId = `map-route-path-${idx}`;
      const col = rt.color || (idx === 0 ? '#38bdf8' : (idx === 1 ? '#f59e0b' : '#2effc6'));
      const dash = rt.mode === 'train' ? '3 1.5' : (rt.mode === 'ship' ? '2 2.5' : '4 2.5');
      const modeBadge = rt.mode === 'ship' ? '\ud83d\udea2' : (rt.mode === 'train' ? '\ud83d\ude86' : (rt.mode === 'line' ? '\u26a1' : '\u2708\ufe0f'));

      return `
        <g class="map-route-group" data-route-idx="${idx}">
          <!-- Glow under-stroke -->
          <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${col}" stroke-width="3.2" opacity="0.24"/>
          <!-- Primary animated route path -->
          <path id="${pathId}" class="map-animated-arc" d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="${dash}" opacity="0.95"/>
          <!-- Origin & Destination Waypoint Pins -->
          <circle cx="${p1.x.toFixed(1)}" cy="${p1.y.toFixed(1)}" r="2.8" fill="${col}" stroke="#ffffff" stroke-width="0.9"/>
          <circle cx="${p2.x.toFixed(1)}" cy="${p2.y.toFixed(1)}" r="3.2" fill="${pinColor}" stroke="#ffffff" stroke-width="1"/>
          <!-- Endpoint Callout Badges -->
          <g transform="translate(${p1.x.toFixed(1)}, ${(p1.y - 5.5).toFixed(1)})">
            <rect x="-18" y="-5" width="36" height="6.8" rx="2" fill="rgba(4,9,17,0.86)" stroke="${col}" stroke-width="0.45"/>
            <text x="0" y="-0.4" fill="#ffffff" font-family="'Space Grotesk',sans-serif" font-size="3.7" font-weight="800" text-anchor="middle">${(rt.from || 'ORIGIN').toUpperCase().slice(0, 10)}</text>
          </g>
          <g transform="translate(${p2.x.toFixed(1)}, ${(p2.y - 6).toFixed(1)})">
            <rect x="-20" y="-5.2" width="40" height="7" rx="2" fill="rgba(4,9,17,0.9)" stroke="${pinColor}" stroke-width="0.55"/>
            <text x="0" y="-0.4" fill="#ffffff" font-family="'Space Grotesk',sans-serif" font-size="3.8" font-weight="800" text-anchor="middle">${modeBadge} ${(rt.to || 'TARGET').toUpperCase().slice(0, 9)}</text>
          </g>
          <!-- Moving Transit Vehicle Icon -->
          ${buildTransitVehicleSvg(rt.mode || 'plane', pathId, col, idx)}
        </g>
      `;
    }).join('') : '';

    // Build custom on-screen traced routes (drawn directly in 3D/Trace mode)
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
          <radialGradient id="globeSphereGrad" cx="42%" cy="38%" r="58%">
            <stop offset="0%" stop-color="${th.ocean}" stop-opacity="1"/>
            <stop offset="78%" stop-color="#030712" stop-opacity="1"/>
            <stop offset="100%" stop-color="${th.atmo}" stop-opacity="0.9"/>
          </radialGradient>
          <clipPath id="globeClipCircle">
            <circle cx="200" cy="114" r="98"/>
          </clipPath>
          <filter id="mapGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.85"/>
          </filter>
        </defs>
        <!-- Outer Space / Telemetry Grid -->
        <g stroke="${th.grid}" stroke-width="0.45" opacity="0.4">
          <line x1="0" y1="45" x2="400" y2="45"/><line x1="0" y1="112" x2="400" y2="112"/><line x1="0" y1="180" x2="400" y2="180"/>
          <line x1="80" y1="0" x2="80" y2="225"/><line x1="200" y1="0" x2="200" y2="225"/><line x1="320" y1="0" x2="320" y2="225"/>
        </g>
        <!-- Atmosphere Halo -->
        <circle cx="200" cy="114" r="102" fill="none" stroke="${th.atmo}" stroke-width="3.5" opacity="0.65"/>
        <circle cx="200" cy="114" r="98" fill="url(#globeSphereGrad)" stroke="${th.landStroke}" stroke-width="1.1" stroke-opacity="0.65"/>
        <!-- Clipped Orthographic Globe Contents -->
        <g clip-path="url(#globeClipCircle)">
          <g stroke="${th.grid}" stroke-width="0.55" fill="none">
            <ellipse cx="200" cy="114" rx="98" ry="32"/>
            <ellipse cx="200" cy="114" rx="98" ry="66"/>
            <line x1="102" y1="114" x2="298" y2="114"/>
            <ellipse cx="200" cy="114" rx="32" ry="98"/>
            <ellipse cx="200" cy="114" rx="66" ry="98"/>
            <line x1="200" y1="16" x2="200" y2="212"/>
          </g>
          <g class="map-interactive-coord-plane" transform="translate(${globeShiftX}, ${globeShiftY})">
            ${granularWorldPaths}
            ${routeElementsHtml}
            ${customTraceHtml}
          </g>
        </g>
      </svg>
    ` : `
      <svg class="globe-svg" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid meet">
        <defs>
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
          ${granularWorldPaths}
          ${routeElementsHtml}
          ${customTraceHtml}
        </g>
      </svg>
    `;

    const rig3DStyle = is3D
      ? `animation: none !important; transform: perspective(1000px) rotateX(${pitch3D}deg) rotateY(${yaw3D}deg) scale(${Math.min(1.35, Math.max(1.0, zoomLvl * 0.65))}); transform-style: preserve-3d; transition: transform 0.15s ease-out;`
      : '';

    const stage3DControlsHtml = (is3D || isDrawing) ? `
      <div class="map-3d-stage-toolbar" style="position:absolute; top:10px; right:12px; z-index:35; display:flex; align-items:center; gap:6px; background:rgba(7,13,25,0.92); backdrop-filter:blur(10px); border:1px solid rgba(56,189,248,0.45); border-radius:20px; padding:4px 10px; box-shadow:0 8px 24px rgba(0,0,0,0.75); pointer-events:auto;">
        <span style="font-size:9px; font-weight:800; color:#a855f7; font-family:monospace;">\u2b21 3D MAP</span>
        <button type="button" id="map-stage-btn-draw" style="background:${isDrawing ? 'rgba(46,255,198,0.22)' : 'rgba(255,255,255,0.08)'}; border:1px solid ${isDrawing ? '#2effc6' : 'rgba(255,255,255,0.18)'}; color:${isDrawing ? '#2effc6' : '#e2e8f0'}; border-radius:12px; padding:2px 8px; font-size:9.5px; font-weight:700; cursor:pointer;">
          ${isDrawing ? '\u270f\ufe0f Tracing Route (Click/Drag Map)' : '\u270f\ufe0f Trace Route on Screen'}
        </button>
        <select id="map-stage-sel-transit" style="background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff; font-size:9.5px; font-weight:700; padding:2px 5px; cursor:pointer;" title="Transit Mode for On-Screen Trace">
          <option value="plane" ${(d.activeTraceTransit || 'plane') === 'plane' ? 'selected' : ''}>\u2708\ufe0f Plane</option>
          <option value="ship" ${d.activeTraceTransit === 'ship' ? 'selected' : ''}>\ud83d\udea2 Ship</option>
          <option value="train" ${d.activeTraceTransit === 'train' ? 'selected' : ''}>\ud83d\ude86 Train</option>
          <option value="line" ${d.activeTraceTransit === 'line' ? 'selected' : ''}>\u26a1 Line</option>
        </select>
        <button type="button" id="map-stage-btn-clear-trace" style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4); color:#fca5a5; border-radius:10px; padding:2px 7px; font-size:9px; font-weight:700; cursor:pointer;" title="Clear On-Screen Drawn Traces">Clear</button>
      </div>
    ` : '';

    return `
      <div class="tpl-map globe-viewport ${is3D ? 'is-3d-mode' : ''} ${isDrawing ? 'is-drawing-route' : ''}" style="background:${th.bg}; --focus-x:${normX.toFixed(1)}%; --focus-y:${normY.toFixed(1)}%; --zoom-scale:${zoomLvl}; --zoom-delay:${zoomStart}s; --cam-cycle:${totalCycle}s; --pan-x:${panX}; --pan-y:${panY}; --pin-color:${pinColor}; cursor:${isDrawing ? 'crosshair' : (is3D ? 'grab' : 'default')};">
        ${stage3DControlsHtml}
        <div class="globe-camera-rig" style="${rig3DStyle}">
          ${globeSvg}
          <div class="globe-pin-group" style="${proj === 'globe' ? `left:calc(${normX.toFixed(1)}% + ${globeShiftX}px * 0.25); top:calc(${normY.toFixed(1)}% + ${globeShiftY}px * 0.25);` : ''}">
            <div class="radar-ring r1"></div>
            <div class="radar-ring r2"></div>
            <div class="tactical-pin">
              <svg width="22" height="30" viewBox="0 0 24 32" fill="none">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="${pinColor}"/>
                <circle cx="12" cy="12" r="4.5" fill="#ffffff"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="location-hud" style="border-color:${pinColor}88;">
          <div class="location-label">${locTitle}</div>
          <div class="location-coords">${coordsSub}</div>
        </div>
        <div class="telemetry-bar">
          <span>SAT-LOCK // ${proj === 'globe' ? '3D ORTHOGRAPHIC GLOBE' : '2D GRANULAR WORLD MAP'} ${is3D ? '\u00b7 [3D INTERACTIVE]' : ''}</span>
          <span>${activeRoutes.length} ROUTE${activeRoutes.length > 1 ? 'S' : ''} \u00b7 ZOOM @ ${zoomStart}s \u00b7 ${zoomLvl}x</span>
        </div>
      </div>
    `;
  };

  // Interactive 3D Orbit & Direct On-Screen Route Tracing Handler for Map Stage
  window.tplBindInteractiveMapStage = function(stageEl) {
    if (!stageEl) return;
    const viewport = stageEl.querySelector('.tpl-map.globe-viewport');
    if (!viewport) return;

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

  // --- 2D. MONEY COUNTER CINEMATIC ENGINE (Lost Hatch / Magnates Media / Hollywood Tier) ---
  window.tplBuildMoneyHtml = function(mData) {
    const d = mData || (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('money') : {});
    const theme = d.theme || 'catastrophe';
    const label = d.label || 'TOTAL LOSSES';
    const headerTag = d.headerTag || 'CRITICAL AUDIT DISCLOSURE';
    const subLabel = d.subLabel || 'CAPITAL DRAIN // RUNWAY EXHAUSTED';
    const amount = d.amount || '$69,000,000';
    const currSuffix = d.currencySuffix !== undefined ? d.currencySuffix : 'USD';
    const deltaText = d.deltaText || '-94.2%';
    const showScan = d.showScanlines !== false;
    const showVig = d.showVignette !== false;

    return `
      <div class="tpl-money-cinematic theme-${theme}" id="money-stage-root" style="width:100%;height:100%;">
        ${typeof window.tplBuildUniversalBgStageLayer === 'function' ? window.tplBuildUniversalBgStageLayer(d) : ''}
        <div class="money-bg-grid"></div>
        <div class="money-faint-watermarks">
          <span>$</span><span>$</span><span>$</span><span>$</span>
        </div>
        <canvas class="money-particles-canvas" id="money-canvas-particles"></canvas>
        <div class="money-anamorphic-flare"></div>
        
        <div class="money-camera-rig" id="money-camera-rig">
          <div class="money-hero-hud">
            <div class="money-header-pill">
              <span class="money-pill-beacon"></span>
              <span class="money-pill-text">${headerTag}</span>
            </div>
            
            <h2 class="money-label-title">${label}</h2>
            
            <div class="money-hero-amount" id="money-hero-amount">
              <span class="money-amount-val">${amount}</span>
            </div>
            
            <div class="money-bottom-bar">
              <span class="money-currency-tag">${currSuffix}</span>
              <span class="money-sublabel">${subLabel}</span>
              ${deltaText ? `<span class="money-delta-badge">${deltaText}</span>` : ''}
            </div>
          </div>
        </div>

        ${showScan ? '<div class="money-scanlines"></div>' : ''}
        ${showVig ? '<div class="money-vignette"></div>' : ''}
        <div class="money-slam-bloom" id="money-slam-bloom"></div>
      </div>
    `;
  };

  // Money Audio Synthesizer (Sub-bass impact boom & mechanical relay click)
  window.tplPlayMoneyAudio = function(profile, isBoom) {
    if (!profile || profile === 'none') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window._moneyAudioCtx) window._moneyAudioCtx = new AudioCtx();
      const ctx = window._moneyAudioCtx;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      if (isBoom) {
        // --- 1. SEISMIC 808 SUB-BASS DROP ---
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(145, now);
        subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);
        subGain.gain.setValueAtTime(0.95, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.7);

        // --- 2. IMPACT TRANSIENT PUNCH (White noise transient) ---
        const bufLen = Math.floor(ctx.sampleRate * 0.12);
        const nBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const nData = nBuf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) nData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
        const noise = ctx.createBufferSource();
        noise.buffer = nBuf;
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'lowpass';
        nFilter.frequency.setValueAtTime(800, now);
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.7, now);
        nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(now);

        // --- 3. HIGH SHIMMER METALLIC TAIL ---
        const shimOsc = ctx.createOscillator();
        const shimGain = ctx.createGain();
        shimOsc.type = 'triangle';
        shimOsc.frequency.setValueAtTime(1600, now);
        shimOsc.frequency.exponentialRampToValueAtTime(540, now + 0.35);
        shimGain.gain.setValueAtTime(0.25, now);
        shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        shimOsc.connect(shimGain);
        shimGain.connect(ctx.destination);
        shimOsc.start(now);
        shimOsc.stop(now + 0.4);
      } else if (profile === 'mechanical-ticker' || profile === 'subbass-boom') {
        // High-precision mechanical relay micro-click
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1400 + Math.random() * 200, now);
        clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.015);
        clickGain.gain.setValueAtTime(0.22, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.02);
      }
    } catch (_) {}
  };

  // Trigger the dramatic "Boom" Climax
  window.tplTriggerMoneyBoom = function(stageEl, mData) {
    if (!stageEl) return;
    const root = stageEl.querySelector('.tpl-money-cinematic') || stageEl;
    root.classList.remove('money-slam-active');
    // Force DOM reflow to re-trigger keyframe animation cleanly
    void root.offsetWidth;
    root.classList.add('money-slam-active');

    const soundProf = mData?.soundProfile || 'subbass-boom';
    window.tplPlayMoneyAudio(soundProf, true);

    if (root._boomTimer) clearTimeout(root._boomTimer);
    root._boomTimer = setTimeout(() => {
      root.classList.remove('money-slam-active');
    }, 750);
  };

  // Stage Initializer (Particle System & Canvas Setup)
  window.tplInitMoneyStage = function(containerEl, mData) {
    if (!containerEl) return;
    const canvas = containerEl.querySelector('#money-canvas-particles');
    if (!canvas) return;

    const density = (mData && mData.particleDensity) ? Number(mData.particleDensity) : 35;
    const type = (mData && mData.particleType) || 'cash-ember';

    const particles = [];
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0008,
        vy: type === 'cash-ember' ? -(0.001 + Math.random() * 0.002) : (Math.random() - 0.5) * 0.0006,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.7 + 0.2,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        hueOffset: Math.random() * 30 - 15
      });
    }
    containerEl._moneyParticles = { canvas, particles, type };
  };

  // Stage Synchronizer (Updates labels & themes live from Inspector)
  window.tplSyncMoneyStageData = function(rootEl, d) {
    if (!rootEl || !d) return;
    const theme = d.theme || 'catastrophe';
    rootEl.className = `tpl-money-cinematic theme-${theme}`;
    
    if (typeof window.tplSyncUniversalBgStageLayer === 'function') {
      window.tplSyncUniversalBgStageLayer(rootEl, d);
    }

    const pill = rootEl.querySelector('.money-pill-text');
    if (pill && d.headerTag !== undefined) pill.textContent = d.headerTag;

    const label = rootEl.querySelector('.money-label-title');
    if (label && d.label !== undefined) label.textContent = d.label;

    const amount = rootEl.querySelector('.money-amount-val');
    if (amount && d.amount !== undefined) amount.textContent = d.amount;

    const sub = rootEl.querySelector('.money-sublabel');
    if (sub && d.subLabel !== undefined) sub.textContent = d.subLabel;

    const cur = rootEl.querySelector('.money-currency-tag');
    if (cur && d.currencySuffix !== undefined) cur.textContent = d.currencySuffix;

    const delta = rootEl.querySelector('.money-delta-badge');
    if (delta && d.deltaText !== undefined) {
      delta.textContent = d.deltaText;
      delta.style.display = d.deltaText ? '' : 'none';
    }

    const scan = rootEl.querySelector('.money-scanlines');
    if (scan) scan.style.display = (d.showScanlines === false) ? 'none' : '';

    const vig = rootEl.querySelector('.money-vignette');
    if (vig) vig.style.display = (d.showVignette === false) ? 'none' : '';
  };

  // Helper to parse target numeric value from formatted strings like "$69,000,000" or "69M"
  function parseNumericAmount(str) {
    if (typeof str === 'number') return str;
    if (!str) return 69000000;
    const clean = str.replace(/[$,\s]/g, '');
    if (/m$/i.test(clean)) return parseFloat(clean) * 1000000;
    if (/b$/i.test(clean)) return parseFloat(clean) * 1000000000;
    if (/k$/i.test(clean)) return parseFloat(clean) * 1000;
    const n = parseFloat(clean);
    return isNaN(n) ? 69000000 : n;
  }

  // Animation Loop Driver (Tick-accurate 60 FPS countup, odometer roll & boom climax)
  window.tplAnimateMoneyLoop = function(containerEl, t, mData) {
    if (!containerEl) return;
    const root = containerEl.querySelector('.tpl-money-cinematic');
    if (!root) return;

    const dur = Math.max(1.0, parseFloat(mData?.countDuration || 3.0));
    const cycle = dur + 1.4; // 1.4s dramatic pause on locked value before next reveal
    const localT = t % cycle;
    const progress = Math.min(1.0, localT / dur);

    // Easing: Exponential deceleration (Lost suspense: fast rush -> slow roll -> hard slam)
    const easedProgress = 1.0 - Math.pow(1.0 - progress, 4);

    const targetNum = parseNumericAmount(mData?.amount || '$69,000,000');
    const startNum = parseNumericAmount(mData?.startAmount || '0');
    const currentNum = Math.round(startNum + (targetNum - startNum) * easedProgress);

    // Format current number with commas and currency prefix
    const sym = mData?.currencySymbol || '$';
    const numFormatted = sym + currentNum.toLocaleString('en-US');

    const amtEl = root.querySelector('.money-amount-val');
    const mode = mData?.counterMode || 'odometer';

    if (amtEl) {
      if (progress >= 1.0) {
        amtEl.textContent = mData?.amount || numFormatted;
      } else if (mode === 'scramble') {
        // Digital Scramble Mode
        const targetStr = mData?.amount || numFormatted;
        const revealIdx = Math.floor(targetStr.length * progress);
        let scr = '';
        for (let i = 0; i < targetStr.length; i++) {
          if (i <= revealIdx || targetStr[i] === '$' || targetStr[i] === ',') {
            scr += targetStr[i];
          } else {
            scr += Math.floor(Math.random() * 10);
          }
        }
        amtEl.textContent = scr;
      } else {
        amtEl.textContent = numFormatted;
      }
    }

    // Audio clicks on number rollover
    if (progress < 1.0) {
      const clickRate = Math.max(0.04, 0.04 + Math.pow(progress, 2) * 0.25);
      if (!root._lastClickTime || (t - root._lastClickTime) > clickRate) {
        root._lastClickTime = t;
        window.tplPlayMoneyAudio(mData?.soundProfile || 'subbass-boom', false);
      }
    }

    // Boom Trigger at p = 1.0
    const boomCycleId = Math.floor(t / cycle);
    if (progress >= 1.0 && root._lastBoomCycle !== boomCycleId) {
      root._lastBoomCycle = boomCycleId;
      if (mData?.enableBoom !== false) {
        window.tplTriggerMoneyBoom(containerEl, mData);
      }
    }

    // Canvas Particles Simulation
    if (containerEl._moneyParticles) {
      const { canvas, particles, type } = containerEl._moneyParticles;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = (canvas.width = canvas.clientWidth || 640);
        const h = (canvas.height = canvas.clientHeight || 360);
        ctx.clearRect(0, 0, w, h);

        const th = mData?.theme || 'catastrophe';
        const pColor = th === 'magnates' ? '#f59e0b' : (th === 'cyber' ? '#00f0ff' : '#ff334b');

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vRot;
          if (p.y < -0.05) p.y = 1.05;
          if (p.y > 1.05) p.y = -0.05;
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;

          ctx.save();
          ctx.translate(p.x * w, p.y * h);
          ctx.rotate(p.rot);
          ctx.globalAlpha = p.opacity;

          if (type === 'cash-ember') {
            // Rectangular tumbling cash/ember flake
            ctx.fillStyle = pColor;
            ctx.shadowColor = pColor;
            ctx.shadowBlur = 6;
            ctx.fillRect(-p.size * 1.5, -p.size, p.size * 3, p.size * 1.5);
          } else {
            // Glowing circular dust mote
            ctx.fillStyle = pColor;
            ctx.shadowColor = pColor;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      }
    }
  };

  // --- 3. LIVE STAGE DOM UPDATER ---
  window.tplUpdateStageWithContextualData = function(tplId, data) {
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

    if (tplId === 'empire-timeline') {
      fxc.innerHTML = window.tplBuildEmpireTimelineHtml(data);
      fxc.style.display = 'block';
      const defImg = stage.querySelector(`#default-img-${tplId}`);
      if (defImg) defImg.style.display = 'none';
    } else if (tplId === 'parallax') {
      const sun = fxc.querySelector('.sun');
      if (sun) {
        if (data.sunColor) sun.style.background = `radial-gradient(circle at center, #fff 0%, ${data.sunColor} 40%, rgba(255,122,89,0) 70%)`;
        if (data.sunSize) { sun.style.width = `${data.sunSize}px`; sun.style.height = `${data.sunSize}px`; }
      }
      const p = fxc.querySelector('.tpl-parallax');
      if (p) p.style.background = `linear-gradient(180deg, ${data.skyTop || '#0d1b2a'} 0%, #1b263b 50%, ${data.skyBottom || '#415a77'} 100%)`;
      
      const rawFig = data.figureImg || (typeof topCustomizerState !== 'undefined' && topCustomizerState.primaryUrl);
      const isCustomFig = rawFig && !rawFig.includes('data:image/svg');
      const fig = fxc.querySelector('.figure');
      if (fig) {
        const useFig = isCustomFig ? rawFig : '/hiker_cutout_clean_final.png';
        fig.style.clipPath = 'none';
        fig.style.background = `url("${useFig}") center bottom/contain no-repeat`;
        fig.style.width = '165px';
        fig.style.height = '86%';
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
      const head = fxc.querySelector('.doc-header');
      if (head && data.docTitle) head.textContent = data.docTitle;
      const lines = Array.isArray(data.lines) ? data.lines : [
        { id: 1, text: data.line1 || '1. Intellectual property rights reserved.', highlighted: true },
        { id: 2, text: data.line2 || '2. Total liability shall not exceed $10,000,000.', highlighted: true },
        { id: 3, text: data.line3 || '3. Immediate termination upon breach of clause.', highlighted: false }
      ];
      const hlCol = data.hlColor || '#facc15';
      const docEl = fxc.querySelector('.doc');
      if (docEl) {
        let linesContainer = docEl.querySelector('.dh-stage-lines-wrap');
        if (!linesContainer) {
          docEl.querySelectorAll('.doc-text-line').forEach(el => el.remove());
          linesContainer = document.createElement('div');
          linesContainer.className = 'dh-stage-lines-wrap';
          linesContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px; flex: 1;';
          docEl.appendChild(linesContainer);
        }
        linesContainer.innerHTML = lines.map((ln, i) => `
          <div class="doc-text-line l${i+1}" style="font-size: 10px; color: #334155; font-family: 'Georgia', serif; position: relative; padding: 2px 4px; border-radius: 3px;">
            <span style="position: relative; z-index: 2;">${ln.text}</span>
            ${ln.highlighted ? `<div class="highlight" style="position: absolute; inset: 0; background: ${ln.color || hlCol}; opacity: 0.75; z-index: 1; border-radius: 3px;"></div>` : ''}
          </div>
        `).join('');
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
      const vals = fxc.querySelectorAll('.bal-val, .b-row .val');
      if (vals[0]) vals[0].textContent = data.assets;
      if (vals[1]) vals[1].textContent = data.liabilities;
      if (vals[2]) vals[2].textContent = data.netWorth;
    } else if (tplId === 'compound') {
      const v = fxc.querySelector('.ci-val, .ci-amount'); if (v) v.textContent = data.futureVal;
      const subs = fxc.querySelectorAll('.ci-sub');
      if (subs[0]) subs[0].textContent = `Start: ${data.initial}`;
      if (subs[1]) subs[1].textContent = `Add: ${data.monthly}`;
    } else if (tplId === 'receipt') {
      const st = fxc.querySelector('.r-store'); if (st && data.store) st.textContent = data.store;
      const tot = fxc.querySelector('.r-total-val'); if (tot && data.total) tot.textContent = data.total;
      const wrap = fxc.querySelector('.r-items-wrap');
      if (wrap && Array.isArray(data.items)) {
        wrap.innerHTML = data.items.map(it => `<div class="r-item"><span class="name">${it.name || it}</span><span class="price">${it.price || ''}</span></div>`).join('');
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
    } else if (tplId === 'quote') {
      const q = fxc.querySelector('.quote-text'); if (q) q.textContent = `\u201c${data.quote}\u201d`;
      const a = fxc.querySelector('.quote-author'); if (a) a.textContent = `\u2014 ${data.author}`;
    } else if (tplId === 'news') {
      const ch = fxc.querySelector('.news-badge'); if (ch && data.channel !== undefined) ch.textContent = data.channel;
      const hl = fxc.querySelector('.headline'); if (hl && data.headline !== undefined) hl.textContent = data.headline;
      const tk = fxc.querySelector('.ticker-text'); if (tk && data.ticker !== undefined) tk.textContent = data.ticker;
      if (data.bannerColor) {
        const up = fxc.querySelector('.chyron-upper'); if (up) up.style.background = `linear-gradient(90deg, ${data.bannerColor} 0%, #7f1d1d 100%)`;
        const tr = fxc.querySelector('.ticker-red'); if (tr) tr.style.background = data.bannerColor;
        if (hl) hl.style.borderLeftColor = data.bannerColor;
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
      let root = fxc.querySelector('.tpl-money-cinematic');
      if (!root) {
        fxc.innerHTML = window.tplBuildMoneyHtml ? window.tplBuildMoneyHtml(data) : '';
        root = fxc.querySelector('.tpl-money-cinematic');
        if (typeof window.tplInitMoneyStage === 'function') window.tplInitMoneyStage(fxc, data);
      }
      if (root && typeof window.tplSyncMoneyStageData === 'function') {
        window.tplSyncMoneyStageData(root, data);
      }
    } else if (tplId === 'checklist') {
      const items = fxc.querySelectorAll('.check-text');
      (data.items || []).forEach((txt, i) => { if (items[i]) items[i].textContent = txt; });
    } else if (tplId === 'progress') {
      const g = fxc.querySelector('.prog-goal'); if (g) g.textContent = data.goal;
      const p = fxc.querySelector('.prog-pct'); if (p) p.textContent = data.percent;
      const b = fxc.querySelector('.prog-bar-fill'); if (b) b.style.width = data.percent;
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
      const c = fxc.querySelector('.sub-ch'); if (c) c.textContent = data.channel;
      const s = fxc.querySelector('.sub-count'); if (s) s.textContent = data.subs;
      const btn = fxc.querySelector('.sub-btn'); if (btn) btn.textContent = data.btnText;
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
        cap.innerHTML = rawCap.split(/\s+/).filter(Boolean).map((w, idx) => {
          const cleanW = w.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
          const isKw = kw && cleanW === kw;
          return `<span class="word" style="animation-delay:${(idx * 0.35).toFixed(2)}s; ${isKw ? `color:${kCol};--hl-col:${kCol};` : `--hl-col:${kCol};`}">${w}</span>`;
        }).join(' ');
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
            card.className = `fly-card fly-card-${i} theme-${theme}${Number(data.activeCardTab || 5) === i ? ' is-selected-card' : ''}`;

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
      const lines = Array.isArray(data.lines) ? data.lines : [
        { id: 1, text: data.line1 || '1. Intellectual property rights reserved.', highlighted: true },
        { id: 2, text: data.line2 || '2. Total liability shall not exceed $10,000,000.', highlighted: true },
        { id: 3, text: data.line3 || '3. Immediate termination upon breach of clause.', highlighted: false }
      ];

      container.innerHTML = `
        <div style="background: rgba(250,204,21,0.06); border: 1px solid rgba(250,204,21,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 11px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">\ud83d\udcc4</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">DOCUMENT HIGHLIGHT CONTROLS</span>
            </div>
            <button type="button" id="dh-btn-add-line" style="font-size: 9.5px; font-weight: 700; color: #facc15; cursor: pointer; padding: 2px 7px; border-radius: 4px; background: rgba(250,204,21,0.15); border: 1px solid rgba(250,204,21,0.35);">
              + Add Line
            </button>
          </div>

          <!-- Document Title -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Document Title</span>
            <input type="text" id="dh-input-title" value="${data.docTitle || 'CONFIDENTIAL AGREEMENT'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11.5px; font-weight: 700; outline: none;" />
          </div>

          <!-- Document Clauses & Independent Highlight Passes -->
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Document Clauses &amp; Highlights</span>
            <div id="dh-lines-list" style="display: flex; flex-direction: column; gap: 8px;">
              ${lines.map((ln, idx) => `
                <div class="dh-line-card" data-idx="${idx}" style="background: rgba(0,0,0,0.4); border: 1px solid ${ln.highlighted ? (data.hlColor || '#facc15') : 'rgba(255,255,255,0.08)'}; border-radius: 7px; padding: 7px 9px; display: flex; flex-direction: column; gap: 6px; transition: border-color 0.2s;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                    <span style="font-size: 9.5px; font-weight: 800; font-family: monospace; color: #94a3b8;">LINE ${idx + 1}</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <button type="button" class="dh-line-toggle-hl" data-idx="${idx}" style="font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 3px; ${ln.highlighted ? `background: rgba(250,204,21,0.22); border: 1px solid ${data.hlColor || '#facc15'}; color: #fff;` : 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #64748b;'}">
                        <span>${ln.highlighted ? '\ud83d\udd8d\ufe0f Highlighted' : '\u25cb Normal'}</span>
                      </button>
                      ${lines.length > 1 ? `<button type="button" class="dh-line-del" data-idx="${idx}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0 4px;" title="Delete this line">\u2715</button>` : ''}
                    </div>
                  </div>
                  <input type="text" class="dh-line-input-text" data-idx="${idx}" value="${ln.text}" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 4px 6px; color: #fff; font-size: 10.5px; font-family: 'Georgia', serif; outline: none;" placeholder="Sentence clause..." />
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Highlight Marker Tint & Color Dots -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Marker Tint</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="color" id="dh-input-color" value="${data.hlColor || '#facc15'}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" />
              <div style="display: flex; gap: 4px;">
                ${hlColors.map(c => `
                  <button type="button" class="dh-color-dot" data-val="${c.val}" style="width: 17px; height: 17px; border-radius: 50%; background: ${c.val}; border: 1.5px solid ${c.val === data.hlColor ? '#fff' : 'rgba(255,255,255,0.2)'}; cursor: pointer;" title="${c.label}"></button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire docheight controls
      const tInp = container.querySelector('#dh-input-title');
      if (tInp) tInp.oninput = (e) => window.tplSetContextualData('docheight', { docTitle: e.target.value });

      container.querySelectorAll('.dh-line-input-text').forEach(inp => {
        inp.oninput = (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          lines[idx].text = e.target.value;
          window.tplSetContextualData('docheight', { lines: [...lines] });
        };
      });

      container.querySelectorAll('.dh-line-toggle-hl').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx, 10);
          lines[idx].highlighted = !lines[idx].highlighted;
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

      const addLineBtn = container.querySelector('#dh-btn-add-line');
      if (addLineBtn) {
        addLineBtn.onclick = () => {
          lines.push({
            id: Date.now(),
            text: `${lines.length + 1}. Newly added confidential stipulation.`,
            highlighted: true
          });
          window.tplSetContextualData('docheight', { lines: [...lines] });
          window.tplRenderContextualInspector('docheight');
        };
      }

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
          label: '\ud83c\uddfa\ud83c\uddf8 USA \u2192 \ud83c\uddec\ud83c\udde7 UK \u2192 \ud83c\uddfa\ud83c\udde6 Ukraine (Transatlantic + Rail)',
          routes: [
            { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 54.0, toLng: -2.0, mode: 'plane', color: '#38bdf8' },
            { from: 'UK', to: 'Ukraine', fromLat: 54.0, fromLng: -2.0, toLat: 49.0, toLng: 31.4, mode: 'train', color: '#f59e0b' }
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
    // SPECIAL HANDLER: MONEY COUNTER (Lost Hatch / Magnates Media / Hollywood Tier)
    // =========================================================================
    if (tplId === 'money') {
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';

      const curTheme = data.theme || 'catastrophe';
      const curMode = data.counterMode || 'odometer';
      const curSound = data.soundProfile || 'subbass-boom';
      const curParticles = data.particleType || 'cash-ember';

      const THEMES = [
        { id: 'catastrophe', label: '🚨 Lost Hatch', desc: 'Blood Noir, Red Laser HUD, Seismic Sub-Bass Slam', color: '#ff2a44' },
        { id: 'magnates', label: '✨ Magnates Gold', desc: 'Prestige Emerald, 24K Gold Foil, Gold Embers', color: '#f59e0b' },
        { id: 'cyber', label: '💻 Cyber Vault', desc: 'Matrix Cyan & Phosphor Green, Digital Scramble', color: '#00f0ff' },
        { id: 'minimal', label: '🎬 Minimal Noir', desc: 'Stark Monochrome, Deep Slate Vignette', color: '#ffffff' }
      ];

      container.innerHTML = `
        <div style="background: rgba(255, 42, 68, 0.05); border: 1px solid rgba(255, 42, 68, 0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 12px;">
          
          <!-- Header Banner -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 14px;">⚡</span>
              <span style="font-size: 11px; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px; text-transform: uppercase;">MONEY COUNTER • CINEMATIC ENGINE</span>
            </div>
            <span style="font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: rgba(255,42,68,0.2); color: #ff8090; border: 1px solid rgba(255,42,68,0.4); text-transform: uppercase;">HOLLYWOOD TIER</span>
          </div>

          <!-- 1-Click Cinematic Theme Presets -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">1-Click Style Preset</span>
              <span style="font-size: 9.5px; color: #cbd5e1; font-weight: 600;">Instant Dramatic Atmosphere</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
              ${THEMES.map(th => `
                <button type="button" class="money-theme-btn" data-theme="${th.id}" style="padding: 7px 8px; border-radius: 6px; border: 1px solid ${curTheme === th.id ? th.color : 'rgba(255,255,255,0.1)'}; background: ${curTheme === th.id ? th.color + '22' : 'rgba(0,0,0,0.35)'}; color: ${curTheme === th.id ? '#fff' : '#94a3b8'}; text-align: left; cursor: pointer; transition: all 0.15s; display: flex; flex-direction: column; gap: 2px;">
                  <span style="font-size: 10.5px; font-weight: 700; color: ${curTheme === th.id ? th.color : '#e2e8f0'}; display: flex; align-items: center; justify-content: space-between;">
                    ${th.label}
                    ${curTheme === th.id ? '✓' : ''}
                  </span>
                  <span style="font-size: 8px; opacity: 0.75; line-height: 1.1;">${th.desc.split(',')[0]}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Numbers & Values -->
          <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Data &amp; Typography</span>
              <span style="font-size: 9px; color: #64748b;">Fluid Screen Scaling</span>
            </div>

            <!-- Target Amount (Hero Number) -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Hero Target Amount</span>
              <input type="text" id="money-inp-amount" value="${data.amount || '$69,000,000'}" placeholder="$69,000,000" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 10px; color: #fff; font-size: 13px; font-weight: 800; font-family: 'Space Grotesk', monospace; outline: none;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <!-- Primary Title -->
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Category Label</span>
                <input type="text" id="money-inp-label" value="${data.label || 'TOTAL LOSSES'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
              </div>
              <!-- Header Tag -->
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Top Alert Pill</span>
                <input type="text" id="money-inp-headertag" value="${data.headerTag || 'CRITICAL AUDIT DISCLOSURE'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <!-- Currency Tag -->
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Currency Suffix</span>
                <input type="text" id="money-inp-currency" value="${data.currencySuffix !== undefined ? data.currencySuffix : 'USD'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
              </div>
              <!-- Delta / Status -->
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Delta Readout</span>
                <input type="text" id="money-inp-delta" value="${data.deltaText || '-94.2%'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
              </div>
            </div>

            <!-- Sub-label description -->
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Sub-Status Monologue</span>
              <input type="text" id="money-inp-sublabel" value="${data.subLabel || 'CAPITAL DRAIN // RUNWAY EXHAUSTED'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #cbd5e1; font-size: 10.5px; outline: none;" />
            </div>
          </div>

          <!-- Kinetic Engine & Physics -->
          <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Kinetic Mechanics &amp; Timing</span>
              <span style="font-size: 9.5px; color: #a855f7; font-weight: 700;">${(data.countDuration || 3.0)}s Count</span>
            </div>

            <!-- Mode Switcher -->
            <div style="display: flex; gap: 4px; background: rgba(0,0,0,0.4); padding: 3px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
              ${[
                { id: 'odometer', label: '🎡 Odometer Tumbler' },
                { id: 'scramble', label: '👾 Digital Scramble' },
                { id: 'countup', label: '📈 Smooth Count' }
              ].map(m => `
                <button type="button" class="money-mode-btn" data-mode="${m.id}" style="flex: 1; padding: 5px 4px; border-radius: 4px; border: none; background: ${curMode === m.id ? '#8b5cf6' : 'transparent'}; color: ${curMode === m.id ? '#fff' : '#94a3b8'}; font-size: 9px; font-weight: 700; cursor: pointer; transition: all 0.15s;">${m.label}</button>
              `).join('')}
            </div>

            <!-- Count Duration Slider -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Counting Duration</span>
                <span id="money-val-duration">${(data.countDuration || 3.0)}s</span>
              </div>
              <input type="range" id="money-inp-duration" min="10" max="60" value="${Math.round((data.countDuration || 3.0) * 10)}" style="accent-color: #8b5cf6; height: 3px; cursor: pointer;" />
            </div>

            <!-- Action Button: Trigger Boom -->
            <button type="button" id="money-btn-boom-test" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(168, 85, 247, 0.3)); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.15s; margin-top: 2px;">
              <span>💥 Test "The Boom" Climax (Screen Shake + Sub-Bass Hit)</span>
            </button>
          </div>

          <!-- Special FX & Atmosphere ("The Boom" Suite) -->
          <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Cinematic Special Effects</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <!-- Particles Type -->
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Particles Style</span>
                <select id="money-sel-particles" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 6px; color: #fff; font-size: 10px; outline: none; cursor: pointer;">
                  <option value="cash-ember" ${curParticles === 'cash-ember' ? 'selected' : ''}>💸 Floating Cash Embers</option>
                  <option value="gold-dust" ${curParticles === 'gold-dust' ? 'selected' : ''}>✨ Golden Flakes &amp; Dust</option>
                  <option value="cyber-motes" ${curParticles === 'cyber-motes' ? 'selected' : ''}>💠 Cyber Grid Motes</option>
                  <option value="none" ${curParticles === 'none' ? 'selected' : ''}>🚫 Off (Clean)</option>
                </select>
              </div>

              <!-- Sound Design Profile -->
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Audio Experience</span>
                <select id="money-sel-sound" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 6px; color: #fff; font-size: 10px; outline: none; cursor: pointer;">
                  <option value="subbass-boom" ${curSound === 'subbass-boom' ? 'selected' : ''}>🔊 Sub-Bass 808 Slam + Ticker</option>
                  <option value="mechanical-ticker" ${curSound === 'mechanical-ticker' ? 'selected' : ''}>⏱️ Vault Tumbler Clicks Only</option>
                  <option value="none" ${curSound === 'none' ? 'selected' : ''}>🔇 Silent</option>
                </select>
              </div>
            </div>

            <!-- Toggles for CRT Scanlines & Vignette -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="money-chk-scanlines" ${data.showScanlines !== false ? 'checked' : ''} style="accent-color: #ff2a44;" />
                CRT Scanlines
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="money-chk-vignette" ${data.showVignette !== false ? 'checked' : ''} style="accent-color: #ff2a44;" />
                Cinematic Vignette
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
                <input type="checkbox" id="money-chk-boom" ${data.enableBoom !== false ? 'checked' : ''} style="accent-color: #ff2a44;" />
                Lock-in Boom
              </label>
            </div>
          </div>

          <!-- Studio Background Suite Integration -->
          ${typeof window.tplBuildUniversalBgHtml === 'function' ? window.tplBuildUniversalBgHtml(data) : ''}
        </div>
      `;

      // Wire Theme Buttons
      container.querySelectorAll('.money-theme-btn').forEach(btn => {
        btn.onclick = () => {
          const t = btn.dataset.theme;
          const themeDefaults = {
            'catastrophe': { theme: 'catastrophe', headerTag: 'CRITICAL AUDIT DISCLOSURE', label: 'TOTAL LOSSES', subLabel: 'CAPITAL DRAIN // RUNWAY EXHAUSTED', particleType: 'cash-ember', color: '#ff334b', deltaText: '-94.2%' },
            'magnates': { theme: 'magnates', headerTag: 'FORBES WEALTH VALUATION', label: 'NET WORTH', subLabel: 'Q4 RECORD CAPITAL ACCUMULATION', particleType: 'gold-dust', color: '#fbbf24', deltaText: '+248.5%' },
            'cyber': { theme: 'cyber', headerTag: 'BLOOMBERG TERMINAL FEED', label: 'TREASURY BALANCE', subLabel: 'TRANSACTION TELEMETRY VERIFIED', particleType: 'cyber-motes', color: '#00f0ff', deltaText: '+12.4%' },
            'minimal': { theme: 'minimal', headerTag: 'OFFICIAL RECORD', label: 'ANNUAL REVENUE', subLabel: 'CONSOLIDATED STATEMENT OF INCOME', particleType: 'none', color: '#ffffff', deltaText: '' }
          };
          window.tplSetContextualData('money', Object.assign({}, themeDefaults[t] || { theme: t }));
          window.tplRenderContextualInspector('money');
        };
      });

      // Wire Inputs
      container.querySelector('#money-inp-amount')?.addEventListener('input', e => {
        window.tplSetContextualData('money', { amount: e.target.value });
      });
      container.querySelector('#money-inp-label')?.addEventListener('input', e => {
        window.tplSetContextualData('money', { label: e.target.value });
      });
      container.querySelector('#money-inp-headertag')?.addEventListener('input', e => {
        window.tplSetContextualData('money', { headerTag: e.target.value });
      });
      container.querySelector('#money-inp-currency')?.addEventListener('input', e => {
        window.tplSetContextualData('money', { currencySuffix: e.target.value });
      });
      container.querySelector('#money-inp-delta')?.addEventListener('input', e => {
        window.tplSetContextualData('money', { deltaText: e.target.value });
      });
      container.querySelector('#money-inp-sublabel')?.addEventListener('input', e => {
        window.tplSetContextualData('money', { subLabel: e.target.value });
      });

      // Wire Mode buttons
      container.querySelectorAll('.money-mode-btn').forEach(btn => {
        btn.onclick = () => {
          window.tplSetContextualData('money', { counterMode: btn.dataset.mode });
          window.tplRenderContextualInspector('money');
        };
      });

      // Wire Duration slider
      const inpDur = container.querySelector('#money-inp-duration');
      const valDur = container.querySelector('#money-val-duration');
      if (inpDur) {
        inpDur.oninput = (e) => {
          const s = (Number(e.target.value) / 10).toFixed(1);
          if (valDur) valDur.textContent = `${s}s`;
          window.tplSetContextualData('money', { countDuration: parseFloat(s) });
        };
      }

      // Wire Boom Climax Test button
      container.querySelector('#money-btn-boom-test')?.addEventListener('click', () => {
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage && typeof window.tplTriggerMoneyBoom === 'function') {
          window.tplTriggerMoneyBoom(stage, window.tplGetContextualData('money'));
        }
      });

      // Wire Selects & Checkboxes
      container.querySelector('#money-sel-particles')?.addEventListener('change', e => {
        window.tplSetContextualData('money', { particleType: e.target.value });
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage && typeof window.tplInitMoneyStage === 'function') {
          window.tplInitMoneyStage(stage, window.tplGetContextualData('money'));
        }
      });
      container.querySelector('#money-sel-sound')?.addEventListener('change', e => {
        window.tplSetContextualData('money', { soundProfile: e.target.value });
      });
      container.querySelector('#money-chk-scanlines')?.addEventListener('change', e => {
        window.tplSetContextualData('money', { showScanlines: e.target.checked });
      });
      container.querySelector('#money-chk-vignette')?.addEventListener('change', e => {
        window.tplSetContextualData('money', { showVignette: e.target.checked });
      });
      container.querySelector('#money-chk-boom')?.addEventListener('change', e => {
        window.tplSetContextualData('money', { enableBoom: e.target.checked });
      });

      if (typeof window.tplWireUniversalBgControls === 'function') {
        window.tplWireUniversalBgControls('money', container);
      }
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
            <!-- Chat Mode: Sender Handle & Message -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(0,255,136,0.04); border: 1px dashed rgba(0,255,136,0.25); border-radius: 7px; padding: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 9px; font-weight: 800; color: #00ff88; text-transform: uppercase;">Anonymous Sender / Tor Handle</span>
                  <span style="font-size: 8px; color: #64748b; font-family: monospace;">[PGP SIGNED]</span>
                </div>
                <input type="text" id="scramble-inp-sender" value="${(data.senderHandle || 'ANON_USER // UNTRACEABLE').replace(/"/g, '&quot;')}" placeholder="e.g. ANON_USER // UNTRACEABLE" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(0,255,136,0.35); border-radius: 5px; padding: 6px 8px; color: #fff; font-family: monospace; font-size: 10.5px; font-weight: 700; outline: none;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 9px; font-weight: 800; color: #cbd5e1; text-transform: uppercase;">Encrypted Message (Decryption Stream)</span>
                  <span style="font-size: 8px; color: #00ff88; font-family: monospace;">[LIVE CIPHER]</span>
                </div>
                <input type="text" id="scramble-inp-text" value="${(data.text || 'you are a dead man').replace(/"/g, '&quot;')}" placeholder="e.g. you are a dead man" style="background: rgba(0,0,0,0.7); border: 1px solid rgba(0,255,136,0.5); border-radius: 6px; padding: 7px 10px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; outline: none; box-shadow: 0 0 10px rgba(0,255,136,0.15);" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Tor Node / Header Tag</span>
                <input type="text" id="scramble-inp-header" value="${(data.headerTag || 'TOR_ONION_CHAT v3.4 // [SESSION_ID: 0x9F4B]').replace(/"/g, '&quot;')}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 5px 8px; color: #94a3b8; font-family: monospace; font-size: 9.5px;" />
              </div>
            </div>
          ` : `
            <!-- Terminal Mode: Cockpit Decrypt Text & Headers -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(0,229,255,0.04); border: 1px dashed rgba(0,229,255,0.25); border-radius: 7px; padding: 8px;">
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 9px; font-weight: 800; color: #00e5ff; text-transform: uppercase;">Target Decrypt Stream (Center Cockpit)</span>
                  <span style="font-size: 8px; color: #00e5ff; font-family: monospace;">[MAIN STREAM]</span>
                </div>
                <input type="text" id="scramble-inp-text" value="${(data.text || 'SYSTEM PRIVILEGES COMPROMISED').replace(/"/g, '&quot;')}" placeholder="e.g. ACCESS GRANTED" style="background: rgba(0,0,0,0.7); border: 1px solid rgba(0,229,255,0.5); border-radius: 6px; padding: 7px 10px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; outline: none; box-shadow: 0 0 10px rgba(0,229,255,0.15);" />
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

      container.querySelector('#fly-inp-mblur')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { motionBlur: e.target.checked }));
      container.querySelector('#fly-inp-dofbokeh')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { dofBokeh: e.target.checked }));
      container.querySelector('#fly-inp-specular')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { specularGlare: e.target.checked }));
      container.querySelector('#fly-inp-drift')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { organicDrift: e.target.checked }));
      container.querySelector('#fly-inp-hud')?.addEventListener('change', e => window.tplSetContextualData('headline-fly', { showTelemetry: e.target.checked }));

      window.tplWireUniversalBgControls('headline-fly', container);
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
