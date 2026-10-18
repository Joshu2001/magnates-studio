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
      headline: 'FED SIGNALS RATE HOLD · TECH SURGES',
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
      emoji: '🔥',
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

    // 25. Investigative Globe & Map Pin Drop
    'map': {
      type: 'map',
      location: 'USA → UK → Ukraine',
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

    // 26. Breaking News Banner
    'news': {
      type: 'news',
      channel: 'WORLD NEWS LIVE',
      headline: 'Tech Giant Announces Unprecedented Layoffs',
      ticker: 'MARKETS REACT: NASDAQ FUTURES SLIDE 3.2% IN AFTER-HOURS TRADING • FEDERAL REGULATORS OPEN INQUIRY',
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
      photo2: '/clean_mountain_backdrop.png'
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
      recMode: 'REC ●',
      filter: 'vintage'
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
      text: 'ACCESS GRANTED',
      color: '#00ff88'
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
      leftLabel: 'BEFORE',
      rightLabel: 'AFTER',
      leftImg: '',
      rightImg: '',
      leftColor: '#3a2a4a',
      rightColor: '#ff7a59'
    },

    // 40. 3D Product Zoom & Spin
    'zoom': {
      type: 'zoom',
      productName: 'Limited Edition Watch',
      glowColor: '#ffd27a',
      spinSpeed: 1.0,
      productImg: ''
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
      yield: '4.2% · $350/mo',
      perShare: '$87'
    },

    // 50. Supply & Demand Curves
    'supplydemand': {
      type: 'supplydemand',
      market: 'HOUSING MARKET',
      eq: 'Eq: $350K',
      supplyColor: '#ef4444',
      demandColor: '#10b981'
    }
  };

  window.TPL_CONTEXTUAL_DEFAULTS = DEFAULTS;

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

    const locTitle = d.location || activeRoutes.map((r, i) => i === 0 ? `${r.from} → ${r.to}` : r.to).join(' → ');
    const coordsSub = d.coords || `${activeRoutes.length} ACTIVE TRANSIT LEG${activeRoutes.length > 1 ? 'S' : ''} · ${Math.abs(focusLat).toFixed(2)}°${focusLat >= 0 ? 'N' : 'S'}, ${Math.abs(focusLng).toFixed(2)}°${focusLng >= 0 ? 'E' : 'W'}`;

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
      const modeBadge = rt.mode === 'ship' ? '🚢' : (rt.mode === 'train' ? '🚆' : (rt.mode === 'line' ? '⚡' : '✈️'));

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
        <span style="font-size:9px; font-weight:800; color:#a855f7; font-family:monospace;">⬡ 3D MAP</span>
        <button type="button" id="map-stage-btn-draw" style="background:${isDrawing ? 'rgba(46,255,198,0.22)' : 'rgba(255,255,255,0.08)'}; border:1px solid ${isDrawing ? '#2effc6' : 'rgba(255,255,255,0.18)'}; color:${isDrawing ? '#2effc6' : '#e2e8f0'}; border-radius:12px; padding:2px 8px; font-size:9.5px; font-weight:700; cursor:pointer;">
          ${isDrawing ? '✏️ Tracing Route (Click/Drag Map)' : '✏️ Trace Route on Screen'}
        </button>
        <select id="map-stage-sel-transit" style="background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff; font-size:9.5px; font-weight:700; padding:2px 5px; cursor:pointer;" title="Transit Mode for On-Screen Trace">
          <option value="plane" ${(d.activeTraceTransit || 'plane') === 'plane' ? 'selected' : ''}>✈️ Plane</option>
          <option value="ship" ${d.activeTraceTransit === 'ship' ? 'selected' : ''}>🚢 Ship</option>
          <option value="train" ${d.activeTraceTransit === 'train' ? 'selected' : ''}>🚆 Train</option>
          <option value="line" ${d.activeTraceTransit === 'line' ? 'selected' : ''}>⚡ Line</option>
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
          <span>SAT-LOCK // ${proj === 'globe' ? '3D ORTHOGRAPHIC GLOBE' : '2D GRANULAR WORLD MAP'} ${is3D ? '· [3D INTERACTIVE]' : ''}</span>
          <span>${activeRoutes.length} ROUTE${activeRoutes.length > 1 ? 'S' : ''} · ZOOM @ ${zoomStart}s · ${zoomLvl}x</span>
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
            const locStr = routes.map((r, i) => i === 0 ? `${r.from} → ${r.to}` : r.to).join(' → ');
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
          const locStr = routes.map((r, i) => i === 0 ? `${r.from} → ${r.to}` : r.to).join(' → ');
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

  // --- 3. LIVE STAGE DOM UPDATER ---
  window.tplUpdateStageWithContextualData = function(tplId, data) {
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (!stage) return;
    const fxc = stage.querySelector(`#fx-container-${tplId}`);
    if (!fxc) return;

    if (tplId === 'parallax') {
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
        hoverBtn.textContent = data.layerOrder === 'front' ? '🔲 Send Text Behind' : '🔲 Bring Text to Front';
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
      const q = fxc.querySelector('.quote-text'); if (q) q.textContent = `“${data.quote}”`;
      const a = fxc.querySelector('.quote-author'); if (a) a.textContent = `— ${data.author}`;
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
      const c1 = fxc.querySelector('.p1-cap'); if (c1 && data.caption !== undefined) c1.textContent = data.caption;
      const c2 = fxc.querySelector('.p2-cap'); if (c2 && data.caption2 !== undefined) c2.textContent = data.caption2;
      const img1 = fxc.querySelector('.p1-img'); if (img1 && data.photo1) img1.style.backgroundImage = `url("${data.photo1}")`;
      const img2 = fxc.querySelector('.p2-img'); if (img2 && data.photo2) img2.style.backgroundImage = `url("${data.photo2}")`;
    } else if (tplId === 'money') {
      const d = fxc.querySelector('.dollar'); if (d) d.textContent = data.amount;
      const l = fxc.querySelector('.money-label, .label'); if (l) l.textContent = data.label;
    } else if (tplId === 'checklist') {
      const items = fxc.querySelectorAll('.check-text');
      (data.items || []).forEach((txt, i) => { if (items[i]) items[i].textContent = txt; });
    } else if (tplId === 'progress') {
      const g = fxc.querySelector('.prog-goal'); if (g) g.textContent = data.goal;
      const p = fxc.querySelector('.prog-pct'); if (p) p.textContent = data.percent;
      const b = fxc.querySelector('.prog-bar-fill'); if (b) b.style.width = data.percent;
    } else if (tplId === 'creditscore') {
      const sc = fxc.querySelector('.cs-score'); if (sc) sc.textContent = data.score;
      const r = fxc.querySelector('.cs-rating'); if (r) { r.textContent = data.rating; r.style.color = data.color; }
    } else if (tplId === 'budget') {
      const t = fxc.querySelector('.b-title'); if (t) t.textContent = `50/30/20 Budget · ${data.income}`;
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
          e1.textContent = data.emoji || '🔥';
          root.appendChild(e1);
        }
      }
    } else if (tplId === 'split') {
      const l1 = fxc.querySelector('.split-label-left'); if (l1) l1.textContent = data.leftLabel;
      const l2 = fxc.querySelector('.split-label-right'); if (l2) l2.textContent = data.rightLabel;
      if (data.leftImg) {
        const hl = fxc.querySelector('.half-l');
        if (hl) hl.style.background = `url("${data.leftImg}") center/cover no-repeat`;
      }
      if (data.rightImg) {
        const hr = fxc.querySelector('.half-r');
        if (hr) hr.style.background = `url("${data.rightImg}") center/cover no-repeat`;
      }
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
              <span style="font-size: 13px;">🌄</span>
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
              <span style="color: #64748b; font-size: 10px;">→</span>
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
              <span style="font-size: 13px;">📊</span>
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
                  ${bars.length > 1 ? `<button type="button" class="wealth-item-del" data-idx="${idx}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0 4px;" title="Remove this bar">✕</button>` : ''}
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
              <span style="font-size: 13px;">📈</span>
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
                  ${it.isUp ? '▲' : '▼'}
                </button>
                <button type="button" class="ticker-item-del" data-idx="${idx}" style="background: none; border: none; color: #64748b; font-size: 12px; cursor: pointer; padding: 0 2px;">✕</button>
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
              <span style="font-size: 13px;">🔤</span>
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
                <span>🔲</span> Behind Subject
              </button>
              <button type="button" id="btn-tb-order-front" style="padding: 6px 8px; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; ${curOrder === 'front' ? 'background: rgba(168,85,247,0.2); border: 1px solid #a855f7; color: #fff;' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8;'}">
                <span>🔲</span> Bring to Front
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
              <span style="font-size: 13px;">📄</span>
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
                        <span>${ln.highlighted ? '🖍️ Highlighted' : '○ Normal'}</span>
                      </button>
                      ${lines.length > 1 ? `<button type="button" class="dh-line-del" data-idx="${idx}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0 4px;" title="Delete this line">✕</button>` : ''}
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
          label: '🇺🇸 USA → 🇨🇦 Canada (Cross-Border Flight)',
          routes: [
            { from: 'USA', to: 'Canada', fromLat: 39.8, fromLng: -98.5, toLat: 56.13, toLng: -106.35, mode: 'plane', color: '#38bdf8' }
          ]
        },
        {
          label: '🇺🇸 USA → 🇬🇧 UK → 🇺🇦 Ukraine (Transatlantic + Rail)',
          routes: [
            { from: 'USA', to: 'UK', fromLat: 39.8, fromLng: -98.5, toLat: 54.0, toLng: -2.0, mode: 'plane', color: '#38bdf8' },
            { from: 'UK', to: 'Ukraine', fromLat: 54.0, fromLng: -2.0, toLat: 49.0, toLng: 31.4, mode: 'train', color: '#f59e0b' }
          ]
        },
        {
          label: '🇨🇳 China → 🇸🇬 Singapore → 🇦🇪 UAE → 🇪🇬 Egypt (Maritime Trade)',
          routes: [
            { from: 'China', to: 'Singapore', fromLat: 35.86, fromLng: 104.2, toLat: 1.35, toLng: 103.82, mode: 'ship', color: '#2effc6' },
            { from: 'Singapore', to: 'UAE', fromLat: 1.35, fromLng: 103.82, toLat: 23.42, toLng: 53.85, mode: 'ship', color: '#38bdf8' },
            { from: 'UAE', to: 'Egypt', fromLat: 23.42, fromLng: 53.85, toLat: 26.82, toLng: 30.80, mode: 'ship', color: '#f59e0b' }
          ]
        },
        {
          label: '🇯🇵 Japan → 🇰🇷 South Korea → 🇸🇬 Singapore → 🇦🇺 Australia',
          routes: [
            { from: 'Japan', to: 'South Korea', fromLat: 36.2, fromLng: 138.25, toLat: 35.91, toLng: 127.77, mode: 'plane', color: '#38bdf8' },
            { from: 'South Korea', to: 'Singapore', fromLat: 35.91, fromLng: 127.77, toLat: 1.35, toLng: 103.82, mode: 'plane', color: '#a855f7' },
            { from: 'Singapore', to: 'Australia', fromLat: 1.35, fromLng: 103.82, toLat: -25.27, toLng: 133.78, mode: 'plane', color: '#2effc6' }
          ]
        },
        {
          label: '🇬🇧 UK → 🇫🇷 France → 🇨🇭 Switzerland → 🇮🇹 Italy (Euro High-Speed Rail)',
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
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.6px;">🌍 Multi-Route Globe & Transit Rig</span>
            <span style="font-size: 9px; color: #2effc6; font-weight: 800; background: rgba(46,255,198,0.14); border: 1px solid rgba(46,255,198,0.35); padding: 2px 6px; border-radius: 4px;">${WORLD_GEO_DB.length}+ COUNTRIES</span>
          </div>

          <!-- ▶ VIDEO vs ⬡ 3D INTERACTIVE SWITCH + DIRECT ON-SCREEN TRACE -->
          <div style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.35); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 9.5px; font-weight: 800; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">Stage Mode (Video / 3D Interactive)</span>
              <span style="font-size: 8.5px; font-family: monospace; color: ${is3D ? '#2effc6' : '#38bdf8'}; font-weight: 700;">${is3D ? '⬡ 3D ACTIVE' : '▶ AUTO VIDEO'}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button type="button" id="map-btn-mode-video" style="padding: 6px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 800; cursor: pointer; border: 1px solid ${!is3D ? '#38bdf8' : 'rgba(255,255,255,0.12)'}; background: ${!is3D ? 'rgba(56,189,248,0.25)' : 'rgba(0,0,0,0.4)'}; color: #fff;">▶ Video Mode</button>
              <button type="button" id="map-btn-mode-3d" style="padding: 6px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 800; cursor: pointer; border: 1px solid ${is3D ? '#a855f7' : 'rgba(255,255,245,0.12)'}; background: ${is3D ? 'rgba(168,85,247,0.32)' : 'rgba(0,0,0,0.4)'}; color: #fff;">⬡ 3D Interactive</button>
            </div>
            <button type="button" id="map-btn-draw-screen" style="width: 100%; padding: 6px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; cursor: pointer; border: 1px solid ${isDraw ? '#2effc6' : 'rgba(46,255,198,0.35)'}; background: ${isDraw ? 'rgba(46,255,198,0.24)' : 'rgba(46,255,198,0.08)'}; color: ${isDraw ? '#2effc6' : '#cbd5e1'}; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>✏️</span> ${isDraw ? 'Tracing on Screen Active (Click or Drag on Map!)' : 'Trace Route Directly on Screen (3D Draw)'}
            </button>
          </div>

          <!-- Projection Mode Toggle: 3D Globe vs 2D Granular World Map -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" class="map-proj-btn" data-proj="globe" style="padding: 6px; border-radius: 6px; font-size: 10.5px; font-weight: 700; cursor: pointer; border: 1px solid ${(data.projection || 'globe') === 'globe' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${(data.projection || 'globe') === 'globe' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.35)'}; color: #fff;">🌐 3D Globe</button>
            <button type="button" class="map-proj-btn" data-proj="flat" style="padding: 6px; border-radius: 6px; font-size: 10.5px; font-weight: 700; cursor: pointer; border: 1px solid ${data.projection === 'flat' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${data.projection === 'flat' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.35)'}; color: #fff;">🗺️ 2D Granular Map</button>
          </div>

          <!-- MULTI-ROUTE COUNTRY-TO-COUNTRY BUILDER -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; padding: 9px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">✈️🚢🚆 Country-to-Country Routes</span>
              <button type="button" id="map-btn-add-route" style="background: rgba(46,255,198,0.16); border: 1px solid rgba(46,255,198,0.45); color: #2effc6; border-radius: 5px; padding: 2px 8px; font-size: 9.5px; font-weight: 800; cursor: pointer;">+ Add Route Leg</button>
            </div>
            <div style="font-size: 9px; color: #94a3b8; line-height: 1.35;">Type any country or city (e.g. <strong>USA</strong> to <strong>Canada</strong>, <strong>UK</strong> to <strong>Japan</strong>) and pick a transit vehicle.</div>

            <!-- Quick Multi-Route Presets -->
            <select id="map-route-preset-select" style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; padding: 5px 7px; color: #cbd5e1; font-size: 10px; font-weight: 600; outline: none; cursor: pointer;">
              <option value="">⚡ Load Multi-Route Preset...</option>
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
                        <option value="plane" ${(rt.mode || 'plane') === 'plane' ? 'selected' : ''}>✈️ Plane</option>
                        <option value="ship" ${rt.mode === 'ship' ? 'selected' : ''}>🚢 Ship</option>
                        <option value="train" ${rt.mode === 'train' ? 'selected' : ''}>🚆 Train</option>
                        <option value="line" ${rt.mode === 'line' ? 'selected' : ''}>⚡ Line</option>
                      </select>
                      <input type="color" class="map-rt-color" data-idx="${idx}" value="${rt.color || '#38bdf8'}" style="width: 18px; height: 18px; border: none; background: transparent; cursor: pointer;" title="Route Arc Color"/>
                      ${activeRoutes.length > 1 ? `<button type="button" class="map-rt-del" data-idx="${idx}" style="background: none; border: none; color: #f87171; font-size: 11px; font-weight: 800; cursor: pointer; padding: 0 3px;" title="Remove Route">✕</button>` : ''}
                    </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 5px;">
                    <input type="text" list="map-geo-datalist" class="map-rt-from" data-idx="${idx}" value="${rt.from || 'USA'}" placeholder="From Country..." style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.14); border-radius: 5px; padding: 4px 6px; color: #fff; font-size: 10.5px; font-weight: 700; outline: none;" />
                    <span style="color: #38bdf8; font-size: 11px; font-weight: 900;">→</span>
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
              <input type="text" id="map-inp-loc" value="${data.location || 'USA → UK → Ukraine'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 7px; color: #fff; font-size: 10.5px; font-weight: 600; outline: none;" />
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
            <div style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">🎥 Camera Zoom & 3D Orbit</div>
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
            const locLabel = cloned.map((r, i) => i === 0 ? `${r.from} → ${r.to}` : r.to).join(' → ');
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
          const locLabel = routes.map((r, i) => i === 0 ? `${r.from} → ${r.to}` : r.to).join(' → ');
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
        const locLabel = routes.map((r, i) => i === 0 ? `${r.from} → ${r.to}` : r.to).join(' → ');
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
          const locLabel = routes.map((r, i) => i === 0 ? `${r.from} → ${r.to}` : r.to).join(' → ');
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
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">📊 Portfolio Strategy & Slices</span>
            <span style="font-size: 9px; color: #10b981; font-weight: 700; background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: 4px;">LIVE DONUT</span>
          </div>

          <!-- Portfolio Type Preset Selector -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Select Portfolio Type</span>
            <select id="pie-preset-select" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(56,189,248,0.35); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11px; font-weight: 700; outline: none; cursor: pointer;">
              ${portfolioPresets.map((p, i) => `<option value="${i}" ${data.presetName === p.presetName ? 'selected' : ''} style="background:#0f172a;color:#fff;">${p.presetName} — ${p.title}</option>`).join('')}
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
            <span style="font-size: 11px; font-weight: 800; color: #facc15; text-transform: uppercase;">⚡ Dynamic Captions & Video B-Roll</span>
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

    // =========================================================================
    // GENERAL HANDLER: FOR ALL OTHER 45 EXTRACTED TEMPLATES
    // Provides tailored, highly relevant controls specific to each template's fields
    // =========================================================================
    const keys = Object.keys(data).filter(k => k !== 'type');
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
            <span style="font-size: 13px;">⚙</span>
            <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">${typeLabel} CONTROLS</span>
          </div>
          <span style="font-size: 9px; color: #a855f7; font-weight: 700; background: rgba(168,85,247,0.15); padding: 1px 6px; border-radius: 4px;">TOP PRIORITY</span>
        </div>
        ${fieldsHtml}
      </div>
    `;

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
