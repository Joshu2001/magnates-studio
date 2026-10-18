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
      slices: [
        { name: 'S&P 500', pct: '50%', color: '#38bdf8' },
        { name: 'Real Estate', pct: '25%', color: '#10b981' },
        { name: 'Crypto', pct: '15%', color: '#f59e0b' },
        { name: 'Cash', pct: '10%', color: '#a855f7' }
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
      suggestion: 'top index funds for passive wealth'
    },

    // 13. iMessage Thread
    'imessage': {
      type: 'imessage',
      msg1: 'hey, are you up?',
      msg2: 'look at bitcoin right now 🚀',
      msg3: 'already bought the dip 😎'
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
      app: 'Instagram',
      title: 'Direct Message',
      body: 'The investment wire has been confirmed.',
      time: 'Now'
    },

    // 20. Hormozi Captions
    'hormozi': {
      type: 'hormozi',
      caption: 'NEVER TRADE YOUR TIME FOR MONEY',
      keyword: 'TIME',
      keyColor: '#facc15',
      emoji: '🔥'
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
      author: 'Elon Musk',
      handle: '@elonmusk',
      text: 'The most entertaining outcome is the most likely.',
      likes: '482K',
      retweets: '54K'
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

    // 25. Map Pin Drop
    'map': {
      type: 'map',
      location: 'Chernobyl, Ukraine',
      coords: '51.2763° N, 30.2219° E',
      pinColor: '#ef4444'
    },

    // 26. Breaking News Banner
    'news': {
      type: 'news',
      channel: 'WORLD NEWS LIVE',
      headline: 'Tech Giant Announces Unprecedented Layoffs',
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
      photo1: '',
      photo2: ''
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
      line1: '1. Intellectual property rights reserved.',
      line2: '2. Total liability shall not exceed $10,000,000.',
      line3: '3. Immediate termination upon breach of clause.',
      hlIndex: 2,
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
      if (p) p.style.background = `linear-gradient(180deg, ${data.skyTop || '#1a1033'} 0%, #3d1f5c 50%, ${data.skyBottom || '#ff7a59'} 100%)`;
      
      const figUrl = data.figureImg || (typeof topCustomizerState !== 'undefined' && topCustomizerState.primaryUrl);
      if (figUrl) {
        const fig = fxc.querySelector('.figure');
        if (fig) {
          fig.style.clipPath = 'none';
          fig.style.background = `url("${figUrl}") center bottom/contain no-repeat`;
          fig.style.width = '140px';
          fig.style.height = '180px';
        }
      }
      const mtnUrl = data.mountainsImg || (typeof topCustomizerState !== 'undefined' && topCustomizerState.secondaryUrl);
      if (mtnUrl) {
        const mb = fxc.querySelector('.mtn-back');
        if (mb) {
          mb.style.clipPath = 'none';
          mb.style.background = `url("${mtnUrl}") center bottom/cover no-repeat`;
        }
        const mf = fxc.querySelector('.mtn-front');
        if (mf && !data.keepFront) {
          mf.style.opacity = '0.5';
        }
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
      const l1 = fxc.querySelector('.l1 span'); if (l1 && data.line1) l1.textContent = data.line1;
      const l2 = fxc.querySelector('.l2 span'); if (l2 && data.line2) l2.textContent = data.line2;
      const l3 = fxc.querySelector('.l3 span'); if (l3 && data.line3) l3.textContent = data.line3;
      const hlCol = data.hlColor || '#facc15';
      const hlIdx = data.hlIndex !== undefined ? data.hlIndex : 2;
      fxc.querySelectorAll('.highlight').forEach(el => el.remove());
      const lines = [fxc.querySelector('.l1'), fxc.querySelector('.l2'), fxc.querySelector('.l3')];
      lines.forEach((lineEl, idx) => {
        if (lineEl && (hlIdx === idx + 1 || hlIdx === 'all')) {
          const hl = document.createElement('div');
          hl.className = 'highlight';
          hl.style.cssText = `position: absolute; inset: 0; background: ${hlCol}; opacity: 0.75; z-index: 1; border-radius: 3px;`;
          lineEl.appendChild(hl);
        }
      });
    } else if (tplId === 'ticker') {
      const head = fxc.querySelector('.t-head');
      if (head && data.title) head.textContent = data.title;
      const tape = fxc.querySelector('.t-tape');
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
      const vals = fxc.querySelectorAll('.bal-val');
      if (vals[0]) vals[0].textContent = data.assets;
      if (vals[1]) vals[1].textContent = data.liabilities;
      if (vals[2]) vals[2].textContent = data.netWorth;
    } else if (tplId === 'compound') {
      const v = fxc.querySelector('.ci-val'); if (v) v.textContent = data.futureVal;
      const subs = fxc.querySelectorAll('.ci-sub');
      if (subs[0]) subs[0].textContent = `Start: ${data.initial}`;
      if (subs[1]) subs[1].textContent = `Add: ${data.monthly}`;
    } else if (tplId === 'google') {
      const q = fxc.querySelector('.g-query'); if (q) q.textContent = data.query;
      const s = fxc.querySelector('.g-sug'); if (s) s.textContent = data.suggestion;
    } else if (tplId === 'imessage') {
      const b = fxc.querySelectorAll('.bubble');
      if (b[0]) b[0].textContent = data.msg1;
      if (b[1]) b[1].textContent = data.msg2;
      if (b[2]) b[2].textContent = data.msg3;
    } else if (tplId === 'tweet') {
      const name = fxc.querySelector('.tw-name'); if (name) name.textContent = data.author;
      const h = fxc.querySelector('.tw-handle'); if (h) h.textContent = data.handle;
      const txt = fxc.querySelector('.tw-text'); if (txt) txt.textContent = data.text;
      const l = fxc.querySelector('.tw-likes'); if (l) l.textContent = data.likes;
    } else if (tplId === 'quote') {
      const q = fxc.querySelector('.quote-text'); if (q) q.textContent = `“${data.quote}”`;
      const a = fxc.querySelector('.quote-author'); if (a) a.textContent = `— ${data.author}`;
    } else if (tplId === 'news') {
      const ch = fxc.querySelector('.news-badge'); if (ch) ch.textContent = data.channel;
      const hl = fxc.querySelector('.headline'); if (hl) hl.textContent = data.headline;
    } else if (tplId === 'money') {
      const d = fxc.querySelector('.dollar'); if (d) d.textContent = data.amount;
      const l = fxc.querySelector('.money-label'); if (l) l.textContent = data.label;
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
      const cap = fxc.querySelector('.caption');
      if (cap) {
        const full = data.caption || '';
        const kw = data.keyword || '';
        if (kw && full.includes(kw)) {
          cap.innerHTML = full.replace(kw, `<span style="color:${data.keyColor || '#facc15'}; text-shadow:0 0 20px ${data.keyColor || '#facc15'}99;">${kw}</span>`);
        } else {
          cap.textContent = full;
        }
      }
      const em = fxc.querySelector('.emoji'); if (em) em.textContent = data.emoji || '🔥';
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
      const curHl = data.hlIndex !== undefined ? data.hlIndex : 2;

      container.innerHTML = `
        <div style="background: rgba(250,204,21,0.06); border: 1px solid rgba(250,204,21,0.25); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 11px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">📄</span>
              <span style="font-size: 11px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">DOCUMENT HIGHLIGHT CONTROLS</span>
            </div>
            <span style="font-size: 9px; color: #facc15; font-weight: 700; background: rgba(250,204,21,0.15); padding: 1px 6px; border-radius: 4px;">TOP PRIORITY</span>
          </div>

          <!-- Document Header -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Document Title</span>
            <input type="text" id="dh-input-title" value="${data.docTitle || 'CONFIDENTIAL AGREEMENT'}" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 11.5px; font-weight: 700; outline: none;" />
          </div>

          <!-- Text Line 1 -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Line 1 Sentence</span>
              <span style="font-size: 9px; color: ${curHl === 1 || curHl === 'all' ? '#facc15' : '#64748b'}; font-weight: 700;">${curHl === 1 || curHl === 'all' ? '● HIGHLIGHTED' : ''}</span>
            </div>
            <input type="text" id="dh-input-l1" value="${data.line1 || '1. Intellectual property rights reserved.'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; outline: none;" />
          </div>

          <!-- Text Line 2 -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Line 2 Sentence</span>
              <span style="font-size: 9px; color: ${curHl === 2 || curHl === 'all' ? '#facc15' : '#64748b'}; font-weight: 700;">${curHl === 2 || curHl === 'all' ? '● HIGHLIGHTED' : ''}</span>
            </div>
            <input type="text" id="dh-input-l2" value="${data.line2 || '2. Total liability shall not exceed $10,000,000.'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; outline: none;" />
          </div>

          <!-- Text Line 3 -->
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Line 3 Sentence</span>
              <span style="font-size: 9px; color: ${curHl === 3 || curHl === 'all' ? '#facc15' : '#64748b'}; font-weight: 700;">${curHl === 3 || curHl === 'all' ? '● HIGHLIGHTED' : ''}</span>
            </div>
            <input type="text" id="dh-input-l3" value="${data.line3 || '3. Immediate termination upon breach of clause.'}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; color: #fff; font-size: 11px; outline: none;" />
          </div>

          <!-- Highlight Target Selector -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Active Highlight Pass</span>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
              ${[1, 2, 3, 'all'].map(idx => `
                <button type="button" class="dh-hl-btn" data-hl="${idx}" style="padding: 4px 6px; font-size: 9.5px; font-weight: 700; border-radius: 4px; cursor: pointer; ${curHl == idx ? 'background: rgba(250,204,21,0.25); border: 1px solid #facc15; color: #fff;' : 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8;'}">${idx === 'all' ? 'All Lines' : 'Line ' + idx}</button>
              `).join('')}
            </div>
          </div>

          <!-- Highlight Color -->
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Marker Tint</span>
            <div style="display: flex; align-items: center; gap: 5px;">
              <input type="color" id="dh-input-color" value="${data.hlColor || '#facc15'}" style="width: 24px; height: 20px; border: none; background: transparent; cursor: pointer;" />
              <div style="display: flex; gap: 4px;">
                ${hlColors.map(c => `
                  <button type="button" class="dh-color-dot" data-val="${c.val}" style="width: 16px; height: 16px; border-radius: 50%; background: ${c.val}; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;" title="${c.label}"></button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire docheight controls
      const tInp = container.querySelector('#dh-input-title');
      if (tInp) tInp.oninput = (e) => window.tplSetContextualData('docheight', { docTitle: e.target.value });
      const l1Inp = container.querySelector('#dh-input-l1');
      if (l1Inp) l1Inp.oninput = (e) => window.tplSetContextualData('docheight', { line1: e.target.value });
      const l2Inp = container.querySelector('#dh-input-l2');
      if (l2Inp) l2Inp.oninput = (e) => window.tplSetContextualData('docheight', { line2: e.target.value });
      const l3Inp = container.querySelector('#dh-input-l3');
      if (l3Inp) l3Inp.oninput = (e) => window.tplSetContextualData('docheight', { line3: e.target.value });

      container.querySelectorAll('.dh-hl-btn').forEach(btn => {
        btn.onclick = () => {
          const val = btn.dataset.hl === 'all' ? 'all' : parseInt(btn.dataset.hl, 10);
          window.tplSetContextualData('docheight', { hlIndex: val });
          window.tplRenderContextualInspector('docheight');
        };
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
