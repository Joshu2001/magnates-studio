/**
 * Document Drama 3D Engine (Deal Term Sheet / Newspaper / Dossier) - v3
 *
 *  - Floating volumetric studio (void + parallax bokeh + dust + god rays) instead of a solid table.
 *    Optional far-away surfaces (mahogany / leather / slate) and a custom parallax backdrop image.
 *  - Free camera: pitch / yaw / roll / distance sliders + full OrbitControls (no polar clamp).
 *  - 5 document archetypes (term sheet, scandal broadsheet, financial ledger, victorian gazette, dossier),
 *    every text block editable (masthead, headline, subtitle, deck, full body text, columns).
 *  - Granular highlighting: unlimited phrase highlights, each with its own colour and style
 *    (marker / underline / redact bar) + per-term highlight for key deal terms.
 *  - Signature is its own layer: procedural presets, draw-your-own pad, upload (white knock-out), typed;
 *    position / scale / rotation / colour / timing.
 *  - Stamps with independent text, colour, angle, position.
 *  - Texture pipeline: static paper+text base is cached, only highlights / signature / stamps are redrawn per frame.
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'deal-term-sheet';
  const W = 1536, H = 1988; // US Letter ratio
  const PAPER_W = 140, PAPER_H = PAPER_W * 11 / 8.5;

  // ------------------------------------------------------------------ presets
  const TERMS_SHEET_TERMS = [
    { label: 'Valuation:', value: '$80M pre-money', highlighted: true, color: '#facc15' },
    { label: 'Investment:', value: '$12M for 15%', highlighted: true, color: '#facc15' },
    { label: 'Board Seats:', value: '2 Investor, 3 Founder', highlighted: false, color: '#4ade80' },
    { label: 'Liquidation Pref:', value: '1x Non-Participating', highlighted: false, color: '#38bdf8' },
    { label: 'Option Pool:', value: '10% Unallocated Post-Closing', highlighted: false, color: '#f43f5e' }
  ];

  const PRESETS = {
    term_sheet: {
      label: 'Legal Term Sheet (US Letter)', layout: 'contract', stock: '#f5f0e1', ink: '#0f172a', soft: '#475569',
      content: {
        masthead: '', confidentialBadge: 'STRICTLY CONFIDENTIAL \u00b7 FOR DISCUSSION ONLY',
        title: 'TERM SHEET \u00b7 SERIES A',
        subtitle: 'ACME CORP / ATLAS VENTURES \u2014 October 24, 2024 \u00b7 Wilmington, Delaware',
        preamble: 'The undersigned parties enter into this binding Term Sheet setting forth the principal terms of the Series A Preferred Stock financing in accordance with Section 4(a)(2) of the Securities Act of 1933.',
        termsHeading: '1. PRINCIPAL FINANCING TERMS',
        dealTerms: TERMS_SHEET_TERMS,
        bodyText: '2. The definitive agreements shall contain customary representations, warranties and covenants. All intellectual property of the company shall be fully assigned to the corporation upon closing.\n\n3. The fountain pen ink shall constitute binding execution upon delivery to legal escrow under Delaware Law. This Term Sheet is governed by the laws of the State of Delaware.',
        highlights: [], columns: 1, photoBlock: false,
        stamp1Text: 'DEAL CLOSED', stamp2Text: 'APPROVED', signatureLabel: 'Authorized Signature'
      }
    },
    scandal: {
      label: 'Investigative Scandal Broadsheet', layout: 'news', stock: '#e7e0cc', ink: '#17130d', soft: '#44403c',
      content: {
        masthead: 'THE DAILY TIMES', confidentialBadge: 'SPECIAL REPORT',
        title: 'MAJOR SCANDAL EXPOSED',
        subtitle: 'MONDAY, JANUARY 15, 2024 \u00b7 LEAKED INTERNAL DOSSIER',
        preamble: 'Documents show executives knew for months while investors were kept in the dark',
        termsHeading: '', dealTerms: [],
        bodyText: 'According to confidential documents leaked earlier today, the core mechanism operated behind closed doors without external oversight. Key executives had full awareness of structural vulnerabilities as early as the third quarter, yet the chosen strategy remained unchanged while investor capital was moved through offshore accounts.\n\nInternal emails obtained by this newspaper show that board members were warned in writing on at least four separate occasions. One senior director described the arrangement as a house of cards waiting for a draft, according to a message dated March 3.\n\nRegulators have declined to comment, but two people familiar with the matter said a formal inquiry is expected within days. Shareholders are demanding answers after trading in the company was halted this morning.\n\nThe documents also reveal a network of shell entities used to move more than two billion dollars between jurisdictions over a period of eighteen months. Auditors flagged the transfers twice, but both reports were withheld from the full board.\n\nA spokesperson for the company said it would cooperate fully with any investigation and stands by its financial reporting. Lawyers for several former executives did not respond to requests for comment.',
        highlights: [
          { text: 'offshore accounts', color: '#facc15', style: 'marker', enabled: true },
          { text: 'full awareness of structural vulnerabilities', color: '#fb923c', style: 'underline', enabled: true }
        ],
        columns: 3, photoBlock: true,
        stamp1Text: 'EXHIBIT A-01', stamp2Text: 'LEAKED', signatureLabel: 'Reporter'
      }
    },
    financial: {
      label: 'Financial Ledger Broadsheet', layout: 'news', stock: '#f0d8c2', ink: '#1c1410', soft: '#57412f',
      content: {
        masthead: 'THE FINANCIAL LEDGER', confidentialBadge: 'MARKETS',
        title: 'OFFSHORE BALANCES LEAKED',
        subtitle: 'LONDON \u00b7 NEW YORK \u00b7 NOV 14, 2024',
        preamble: 'Hidden holdings dwarf the figures reported to regulators',
        termsHeading: 'KEY FIGURES',
        dealTerms: [
          { label: 'Hidden total:', value: '$14.2 billion', highlighted: true, color: '#facc15' },
          { label: 'Shell entities:', value: '312 registered', highlighted: false, color: '#4ade80' },
          { label: 'Jurisdictions:', value: 'Cayman, BVI, Panama', highlighted: false, color: '#38bdf8' },
          { label: 'Regulator filing:', value: 'None on record', highlighted: true, color: '#f43f5e' }
        ],
        bodyText: 'A trove of banking records reviewed by this newspaper shows that the group held far more offshore than it ever disclosed to regulators. The balances, spread across hundreds of entities, grew steadily through the last three years even as the company reported falling profits.\n\nAnalysts say the scale of the holdings raises questions about how the money was sourced and why it was never reported. Several large pension funds hold shares in the company and have asked for an emergency briefing.\n\nShares fell sharply in early trading and credit default swaps on the group widened to their highest level in a decade. Rating agencies said they were reviewing their positions.\n\nIn a statement the company said the entities were established for legitimate tax and treasury purposes. Independent experts questioned that explanation after reviewing the transaction logs seen by this newspaper.',
        highlights: [{ text: 'never reported', color: '#fde047', style: 'marker', enabled: true }],
        columns: 3, photoBlock: false,
        stamp1Text: 'AUDITED', stamp2Text: 'FLAGGED', signatureLabel: 'Markets Desk'
      }
    },
    vintage: {
      label: 'Victorian Gazette (1884)', layout: 'news', stock: '#d6c498', ink: '#2a1c0c', soft: '#4a3a22',
      content: {
        masthead: 'THE VICTORIAN GAZETTE', confidentialBadge: 'LATE EDITION',
        title: 'BANK PANIC GRIPS THE CITY',
        subtitle: 'LONDON, SATURDAY, MAY 10, 1884 \u00b7 PRICE TWO PENCE',
        preamble: 'Crowds besiege the counting houses as depositors demand their gold',
        termsHeading: '', dealTerms: [],
        bodyText: 'Scenes of the greatest alarm were witnessed yesterday in Lombard Street, where a dense crowd of depositors assembled before the doors of several banking houses and demanded the immediate return of their savings. The constabulary was summoned to preserve order.\n\nIt is reported that the failure of a great discount house in the north set the rumour in motion. By noon the throng extended the length of the street, and many were seen to carry their bankbooks above their heads.\n\nThe Governor of the Bank has given assurance that the reserves are ample, yet the public remains unpersuaded. Merchants on the Exchange report that credit is withdrawn from every quarter.\n\nOur correspondent learns that a deputation of leading financiers waited upon the Chancellor late last evening. No statement has been issued, though it is believed that measures will be announced before the Monday opening.',
        highlights: [{ text: 'demanded the immediate return of their savings', color: '#facc15', style: 'marker', enabled: true }],
        columns: 3, photoBlock: true,
        stamp1Text: 'FINAL', stamp2Text: 'PANIC', signatureLabel: 'Our Correspondent'
      }
    },
    dossier: {
      label: 'Classified Fraud Dossier', layout: 'contract', stock: '#eeeadd', ink: '#111111', soft: '#44403c',
      content: {
        masthead: 'TOP SECRET // NOFORN', confidentialBadge: 'INTERNAL USE ONLY \u00b7 DO NOT COPY',
        title: 'INTERNAL MEMO \u00b7 EYES ONLY',
        subtitle: 'To: Board of Directors    From: Office of the CFO',
        preamble: 'Re: Q3 revenue booked via side letters totaling $8.4 BILLION. DO NOT DISCLOSE.',
        termsHeading: '', dealTerms: [],
        bodyText: 'The side letters described below were not shared with the external auditors. Revenue recognition for the quarter depends entirely on these arrangements, which grant counterparties an unconditional right of return.\n\nShould the arrangements become public, the restated figures would eliminate the reported profit for the year. Legal counsel advises that no written record of this discussion be retained.\n\nAll copies of this memo are to be destroyed after the board meeting. Questions should be directed to the Office of the CFO and no one else.',
        highlights: [
          { text: '$8.4 BILLION', color: '#facc15', style: 'marker', enabled: true },
          { text: 'Office of the CFO', color: '#000000', style: 'redact', enabled: true },
          { text: 'unconditional right of return', color: '#f43f5e', style: 'underline', enabled: true }
        ],
        columns: 1, photoBlock: false,
        stamp1Text: 'CONFIDENTIAL', stamp2Text: 'EYES ONLY', signatureLabel: 'Chief Financial Officer'
      }
    }
  };

  const DEFAULT_CONFIG = Object.assign({
    type: 'deal-term-sheet',
    is3DMode: true,
    docType: 'term_sheet',
    // camera & paper
    cameraPitch: 29, cameraYaw: -13, cameraRoll: 4, cameraDistance: 1, autoPan: true,
    paperCurl: 0.6, foldCreases: true, paperStock: 'auto', vignette: 0.45,
    // environment
    environment: 'void_studio', bokeh: true, dust: true, godRays: true, godRayIntensity: 0.5,
    backdropImage: '', backdropOpacity: 0.6, lightWarmth: '#fff3db', lightIntensity: 1.5,
    // signature layer
    sigShow: true, sigMode: 'preset', sigPreset: 'quill', sigStrokes: [], sigImage: '', sigTyped: 'Alexander Vance',
    sigX: 0.12, sigY: 0.80, sigScale: 1, sigRotation: -2, sigColor: '#1e3a8a', sigStart: 45, sigSpan: 23, sigLine: true,
    signeeName: 'Alexander Vance', signeeTitle: 'CEO & Managing Partner',
    // stamps
    showStamp1: true, stamp1Color: '#b91c1c', stamp1Angle: -14, stamp1X: 0.74, stamp1Y: 0.77,
    showStamp2: true, stamp2Color: '#b91c1c', stamp2Angle: -16, stamp2X: 0.80, stamp2Y: 0.87,
    duration: 5.0
  }, PRESETS.term_sheet.content);

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function normalizeConfig(data) {
    const d = Object.assign({}, deepClone(DEFAULT_CONFIG), data || {});
    if (!PRESETS[d.docType]) d.docType = 'term_sheet';
    if (!Array.isArray(d.dealTerms)) d.dealTerms = deepClone(TERMS_SHEET_TERMS);
    if (!Array.isArray(d.highlights)) d.highlights = [];
    if (!Array.isArray(d.sigStrokes)) d.sigStrokes = [];
    d.columns = Math.max(1, Math.min(3, parseInt(d.columns, 10) || 1));
    d.duration = Math.max(1, parseFloat(d.duration) || 5);
    d.sigScale = Math.max(0.3, parseFloat(d.sigScale) || 1);
    return d;
  }

  function cfgSig(d) {
    return JSON.stringify(d, function (k, v) {
      return (typeof v === 'string' && v.length > 300) ? (v.length + ':' + v.slice(0, 24) + v.slice(-24)) : v;
    });
  }

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function rng32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hexRgba(hex, a) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 'rgba(0,0,0,' + a + ')';
    const n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  // ------------------------------------------------------------------ text layout
  function normW(s) { return String(s).toLowerCase().replace(/[^\w$%]/g, ''); }

  /**
   * Word-wrapped layout across one or more regions (columns). Returns word boxes (baseline coords).
   * o: {regions:[{x,w,top,bottom}], font,size,lineH,align,color,indent,paraGap}
   */
  function layoutText(ctx, text, o) {
    const words = [];
    ctx.font = o.font;
    const spaceW = ctx.measureText(' ').width;
    const paras = String(text == null ? '' : text).split(/\n\s*\n/);
    let ri = 0;
    let y = o.regions[0].top + o.size;
    const lineH = o.lineH || o.size * 1.3;
    const paraGap = o.paraGap !== undefined ? o.paraGap : lineH * 0.4;
    let stopped = false;

    function flush(line, lineW, firstLine) {
      if (!line.length || stopped) return;
      let reg = o.regions[ri];
      if (y > reg.bottom) {
        ri++;
        if (ri >= o.regions.length) { stopped = true; return; }
        reg = o.regions[ri];
        y = reg.top + o.size;
      }
      const ind = firstLine ? (o.indent || 0) : 0;
      let x = reg.x + ind;
      if (o.align === 'center') x = reg.x + (reg.w - lineW) / 2;
      else if (o.align === 'right') x = reg.x + reg.w - lineW;
      line.forEach(function (wd) {
        words.push({ t: wd.t, n: normW(wd.t), x: x, y: y, w: wd.w, size: o.size, font: o.font, color: o.color });
        x += wd.w + spaceW;
      });
      y += lineH;
    }

    paras.forEach(function (para, pi) {
      if (stopped) return;
      const toks = para.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
      let line = [], lineW = 0, first = true;
      toks.forEach(function (tk) {
        if (stopped) return;
        const ww = ctx.measureText(tk).width;
        const reg = o.regions[Math.min(ri, o.regions.length - 1)];
        const avail = reg.w - (first ? (o.indent || 0) : 0);
        const need = lineW + (line.length ? spaceW : 0) + ww;
        if (need > avail && line.length) {
          flush(line, lineW, first);
          first = false; line = []; lineW = 0;
        }
        line.push({ t: tk, w: ww });
        lineW += (line.length > 1 ? spaceW : 0) + ww;
      });
      flush(line, lineW, first);
      if (pi < paras.length - 1) y += paraGap;
    });
    return { words: words, nextTop: y - o.size, region: ri };
  }

  function findPhraseSegs(words, phrase) {
    const toks = String(phrase || '').split(/\s+/).map(normW).filter(Boolean);
    if (!toks.length) return [];
    const segs = [];
    for (let i = 0; i + toks.length <= words.length; i++) {
      let ok = true;
      for (let k = 0; k < toks.length; k++) {
        const wn = words[i + k].n;
        const last = k === toks.length - 1;
        if (!(wn === toks[k] || (last && toks[k].length >= 3 && wn.indexOf(toks[k]) === 0))) { ok = false; break; }
      }
      if (!ok) continue;
      segsFromWords(words.slice(i, i + toks.length), segs);
      i += toks.length - 1;
    }
    return segs;
  }

  function segsFromWords(ws, out) {
    out = out || [];
    let cur = null;
    ws.forEach(function (w) {
      if (cur && Math.abs(cur.y - w.y) < 3) { cur.x1 = w.x + w.w; }
      else { cur = { x0: w.x, x1: w.x + w.w, y: w.y, size: w.size }; out.push(cur); }
    });
    return out;
  }

  // ------------------------------------------------------------------ paper + base
  const baseCache = { key: '', val: null };

  function baseKey(d) {
    return JSON.stringify([
      d.docType, d.masthead, d.confidentialBadge, d.title, d.subtitle, d.preamble, d.termsHeading,
      d.dealTerms.map(function (t) { return [t.label, t.value]; }), d.bodyText, d.columns, d.photoBlock,
      d.paperStock, d.foldCreases, d.sigX, d.sigY, d.sigScale, d.sigLine, d.signeeName, d.signeeTitle, d.signatureLabel
    ]);
  }

  function paintPaper(ctx, stock, news, creases) {
    ctx.fillStyle = stock; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.25, W * 0.5, H * 0.5, W * 0.78);
    g.addColorStop(0, 'rgba(255,255,255,0.16)'); g.addColorStop(0.65, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(90,60,30,0.2)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = rng32(1337);
    const img = ctx.getImageData(0, 0, W, H); const p = img.data;
    const amp = news ? 16 : 11;
    for (let i = 0; i < p.length; i += 8) {
      const n = (r() - 0.5) * amp;
      p[i] = Math.min(255, Math.max(0, p[i] + n)); p[i + 1] = Math.min(255, Math.max(0, p[i + 1] + n)); p[i + 2] = Math.min(255, Math.max(0, p[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
    ctx.strokeStyle = 'rgba(70,50,30,0.06)'; ctx.lineWidth = 1;
    for (let i = 0; i < 420; i++) {
      const x = r() * W, y = r() * H, a = r() * Math.PI, l = 8 + r() * 26;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
    }
    if (creases) {
      [H / 3, H * 2 / 3].forEach(function (yy) {
        const cg = ctx.createLinearGradient(0, yy - 8, 0, yy + 8);
        cg.addColorStop(0, 'rgba(0,0,0,0)'); cg.addColorStop(0.45, 'rgba(0,0,0,0.10)'); cg.addColorStop(0.55, 'rgba(255,255,255,0.18)'); cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg; ctx.fillRect(0, yy - 8, W, 16);
      });
    }
  }

  function drawHalftone(ctx, x, y, w, h, ink) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = ink;
    const step = 8;
    for (let gy = y; gy < y + h; gy += step) {
      for (let gx = x; gx < x + w; gx += step) {
        const u = (gx - x) / w, v = (gy - y) / h;
        const dh = Math.hypot((u - 0.5) * 1.1, v - 0.36);
        const head = clamp01(1 - dh / 0.2);
        const sh = clamp01(1 - Math.hypot((u - 0.5) / 0.46, (v - 1.08) / 0.46));
        const dark = Math.max(head, sh) * 0.85 + 0.1 + 0.08 * Math.sin(gx * 0.05 + gy * 0.03);
        const rad = step * 0.55 * clamp01(dark);
        if (rad > 0.4) { ctx.beginPath(); ctx.arc(gx, gy, rad, 0, Math.PI * 2); ctx.fill(); }
      }
    }
    ctx.restore();
    ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  function buildBase(d) {
    const key = baseKey(d);
    if (baseCache.key === key && baseCache.val) return baseCache.val;
    const P = PRESETS[d.docType] || PRESETS.term_sheet;
    const stock = (d.paperStock && d.paperStock !== 'auto') ? d.paperStock : P.stock;
    const ink = P.ink, soft = P.soft;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const news = P.layout === 'news';
    paintPaper(ctx, stock, news, d.foldCreases !== false);

    const words = [], termWords = [];
    const mx = news ? 105 : 125, cw = W - mx * 2;
    const sigBoxH = 0.085 * H * d.sigScale;
    const limit = Math.min(H - 120, d.sigY * H - sigBoxH - 40);
    let y = news ? 92 : 108;
    const single = function (top) { return [{ x: mx, w: cw, top: top, bottom: 1e9 }]; };
    function L(text, o) {
      const res = layoutText(ctx, text, o);
      res.words.forEach(function (w) { words.push(w); });
      return res;
    }
    function rule(yy, lw, dash, col) {
      ctx.save(); ctx.strokeStyle = col || hexRgba(ink, 0.45); ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
      ctx.beginPath(); ctx.moveTo(mx, yy); ctx.lineTo(W - mx, yy); ctx.stroke(); ctx.restore();
    }
    const mono = '"Courier New",Courier,monospace';
    const serif = 'Georgia,"Times New Roman",serif';
    let r;

    if (!news) {
      // ---------------- contract / memo layout
      if (d.confidentialBadge) {
        r = L(d.confidentialBadge, { regions: single(y), font: '700 17px ' + mono, size: 17, lineH: 24, align: 'center', color: '#64748b' });
        y = r.nextTop + 6; rule(y, 1, null, 'rgba(30,41,59,0.2)'); y += 38;
      }
      if (d.masthead) {
        r = L(d.masthead, { regions: single(y), font: '900 34px ' + mono, size: 34, lineH: 42, align: 'center', color: ink });
        y = r.nextTop + 10;
      }
      r = L(d.title, { regions: single(y), font: '900 40px ' + mono, size: 40, lineH: 50, align: 'center', color: ink });
      y = r.nextTop + 6;
      if (d.subtitle) {
        r = L(d.subtitle, { regions: single(y), font: '600 20px ' + mono, size: 20, lineH: 28, align: 'center', color: soft });
        y = r.nextTop + 10;
      }
      rule(y, 1.5, [8, 5]); y += 36;
      if (d.preamble) {
        r = L(d.preamble, { regions: single(y), font: '500 21px ' + mono, size: 21, lineH: 31, align: 'left', color: soft });
        y = r.nextTop + 16;
      }
      if (d.dealTerms.length) {
        if (d.termsHeading) {
          r = L(d.termsHeading, { regions: single(y), font: '800 22px ' + mono, size: 22, lineH: 30, align: 'left', color: ink });
          y = r.nextTop + 14;
        }
        d.dealTerms.forEach(function (t, i) {
          const nl = String(t.label || '').trim().split(/\s+/).filter(Boolean).length;
          r = L((t.label || '') + ' ' + (t.value || ''), { regions: single(y), font: '800 31px ' + mono, size: 31, lineH: 40, align: 'left', color: ink });
          r.words.forEach(function (w, wi) { if (wi < nl) w.color = soft; });
          termWords[i] = r.words.slice(nl);
          y = r.nextTop + 14;
        });
        y += 14;
      }
      if (d.bodyText) {
        L(d.bodyText, { regions: [{ x: mx, w: cw, top: y, bottom: limit }], font: '500 21px ' + mono, size: 21, lineH: 31, paraGap: 16, align: 'left', color: soft });
      }
    } else {
      // ---------------- newspaper layout
      let ms = 98;
      ctx.font = '900 ' + ms + 'px ' + serif;
      const mastTxt = d.masthead || 'THE DAILY TIMES';
      while (ctx.measureText(mastTxt).width > cw && ms > 36) { ms -= 4; ctx.font = '900 ' + ms + 'px ' + serif; }
      r = L(mastTxt, { regions: single(y), font: '900 ' + ms + 'px ' + serif, size: ms, lineH: ms * 1.1, align: 'center', color: ink });
      y = r.nextTop + 4;
      ctx.fillStyle = ink; ctx.fillRect(mx, y, cw, 6); ctx.fillRect(mx, y + 11, cw, 2);
      y += 40;
      let rowBottom = y;
      let bannerW = 0;
      if (d.confidentialBadge) {
        ctx.font = '800 17px ' + mono;
        bannerW = ctx.measureText(d.confidentialBadge).width + 34;
        ctx.fillStyle = '#b91c1c'; ctx.fillRect(mx, y, bannerW, 34);
        ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(d.confidentialBadge, mx + 17, y + 23);
        rowBottom = y + 34;
      }
      if (d.subtitle) {
        const sx = mx + (bannerW ? bannerW + 22 : 0);
        r = L(d.subtitle, { regions: [{ x: sx, w: W - mx - sx, top: y + 2, bottom: 1e9 }], font: '700 17px ' + mono, size: 17, lineH: 24, align: bannerW ? 'right' : 'center', color: soft });
        rowBottom = Math.max(rowBottom, r.nextTop);
      }
      y = rowBottom + 12; rule(y, 1.5, null, hexRgba(ink, 0.6)); y += 34;
      r = L(d.title, { regions: single(y), font: '900 86px ' + serif, size: 86, lineH: 92, align: 'center', color: ink });
      y = r.nextTop + 8;
      if (d.preamble) {
        r = L(d.preamble, { regions: single(y), font: 'italic 600 30px ' + serif, size: 30, lineH: 40, align: 'center', color: soft });
        y = r.nextTop + 10;
      }
      if (d.dealTerms.length) {
        y += 8;
        const startY = y;
        if (d.termsHeading) {
          r = L(d.termsHeading, { regions: [{ x: mx + 28, w: cw - 56, top: y + 14, bottom: 1e9 }], font: '800 20px ' + mono, size: 20, lineH: 28, align: 'left', color: ink });
          y = r.nextTop + 4;
        } else { y += 14; }
        d.dealTerms.forEach(function (t, i) {
          const nl = String(t.label || '').trim().split(/\s+/).filter(Boolean).length;
          r = L((t.label || '') + ' ' + (t.value || ''), { regions: [{ x: mx + 28, w: cw - 56, top: y, bottom: 1e9 }], font: '700 28px ' + serif, size: 28, lineH: 36, align: 'left', color: ink });
          r.words.forEach(function (w, wi) { if (wi < nl) w.color = soft; });
          termWords[i] = r.words.slice(nl);
          y = r.nextTop + 6;
        });
        ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.strokeRect(mx, startY, cw, y - startY + 16);
        y += 40;
      }
      rule(y, 1.2, null, hexRgba(ink, 0.5)); y += 30;
      if (d.bodyText) {
        const n = d.columns, gap = 44, colW = (cw - gap * (n - 1)) / n;
        const regions = [];
        for (let k = 0; k < n; k++) regions.push({ x: mx + k * (colW + gap), w: colW, top: y, bottom: limit });
        if (d.photoBlock && n >= 2) {
          const ph = 300;
          drawHalftone(ctx, regions[0].x, y, colW, ph, ink);
          ctx.fillStyle = soft; ctx.font = 'italic 15px ' + serif; ctx.textAlign = 'left';
          ctx.fillText('Photo: obtained by this newspaper', regions[0].x, y + ph + 22);
          regions[0].top = y + ph + 44;
        }
        const bodyRes = L(d.bodyText, { regions: regions, font: '500 23px ' + serif, size: 23, lineH: 32, indent: n > 1 ? 24 : 28, paraGap: 12, align: 'left', color: ink });
        let maxY = y;
        bodyRes.words.forEach(function (w) { if (w.y > maxY) maxY = w.y; });
        ctx.strokeStyle = hexRgba(ink, 0.35); ctx.lineWidth = 1.2;
        for (let k = 1; k < n; k++) {
          const lx = mx + k * (colW + gap) - gap / 2;
          ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx, Math.min(limit, maxY + 10)); ctx.stroke();
        }
      }
    }

    // words
    ctx.textAlign = 'left';
    words.forEach(function (w) { ctx.font = w.font; ctx.fillStyle = w.color; ctx.fillText(w.t, w.x, w.y); });

    // signature rule + caption (static part of the signature layer)
    const sx = d.sigX * W, sy = d.sigY * H, bw = 0.42 * W * d.sigScale;
    if (d.sigLine !== false) {
      ctx.strokeStyle = hexRgba(ink, 0.55); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + bw, sy); ctx.stroke();
    }
    ctx.font = '600 17px ' + mono; ctx.fillStyle = soft; ctx.textAlign = 'left';
    const cap = (d.signatureLabel || '') + (d.signeeName ? ' \u2014 ' + String(d.signeeName).toUpperCase() : '') + (d.signeeTitle ? ' \u00b7 ' + String(d.signeeTitle).toUpperCase() : '');
    ctx.fillText(cap, sx, sy + 28);

    const val = { canvas: cv, words: words, termWords: termWords, ink: ink };
    baseCache.key = key; baseCache.val = val;
    return val;
  }

  // ------------------------------------------------------------------ signature layer
  function interp(pts, steps) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        out.push({ x: pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, y: pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t, w: 2.6 });
      }
    }
    const l = pts[pts.length - 1]; out.push({ x: l[0], y: l[1], w: 2.2 });
    return out;
  }
  const SIG_PRESETS = (function () {
    const quill = [], loop = [], flourish = [];
    for (let i = 0; i < 110; i++) {
      const t = i / 109;
      quill.push({ x: 0.02 + 0.94 * t, y: 0.62 - 0.38 * Math.exp(-Math.pow((t - 0.08) / 0.05, 2)) - 0.18 * Math.abs(Math.sin(t * Math.PI * 6)) * (0.4 + 0.6 * (1 - t)) - (t > 0.9 ? (t - 0.9) * 1.2 : 0), w: 1.8 + 2.8 * Math.abs(Math.sin(t * 37 + 1)) });
    }
    for (let i = 0; i < 150; i++) {
      const t = i / 149, a = t * Math.PI * 10;
      loop.push({ x: 0.05 + 0.88 * t + 0.05 * Math.cos(a), y: 0.55 - 0.28 * Math.sin(a) * (0.6 + 0.4 * Math.sin(t * Math.PI)), w: 2 + 2.2 * Math.abs(Math.cos(a)) });
    }
    for (let i = 0; i < 120; i++) {
      const t = i / 119;
      flourish.push({ x: 0.02 + 0.96 * t, y: 0.5 + 0.38 * Math.sin(t * Math.PI * 2.2) * Math.exp(-t * 1.2), w: 1.8 + 3 * Math.abs(Math.sin(t * 9)) });
    }
    for (let i = 0; i < 40; i++) {
      const a = i / 39 * Math.PI * 2;
      flourish.push({ x: 0.9 + 0.06 * Math.cos(a) * (1 - i / 80), y: 0.62 + 0.14 * Math.sin(a) * (1 - i / 80), w: 2.4 });
    }
    return {
      quill: [quill, interp([[0.15, 0.88], [0.55, 0.84], [0.92, 0.8]], 14)],
      loop: [loop],
      flourish: [flourish],
      initials: [interp([[0.05, 0.85], [0.14, 0.15], [0.23, 0.85]], 14), interp([[0.09, 0.58], [0.2, 0.58]], 8), interp([[0.3, 0.15], [0.4, 0.85], [0.5, 0.15]], 14), interp([[0.02, 0.94], [0.62, 0.9]], 18)]
    };
  })();

  const sigImageCache = {};
  function getSigImage(src) {
    if (!src) return null;
    if (!sigImageCache[src]) {
      const img = new Image(); img.src = src; sigImageCache[src] = img;
    }
    const im = sigImageCache[src];
    return (im.complete && im.naturalWidth > 0) ? im : null;
  }

  function drawStrokes(ctx, strokes, prog, bw, bh, color, k) {
    let total = 0;
    strokes.forEach(function (s) { total += s.length; });
    if (!total) return;
    let target = prog * total;
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    let tip = null, tipW = 3;
    for (let si = 0; si < strokes.length && target > 0; si++) {
      const s = strokes[si];
      for (let i = 1; i < s.length && target > 0; i++, target--) {
        const a = s[i - 1], b = s[i];
        ctx.lineWidth = (b.w || 2.6) * k;
        ctx.beginPath(); ctx.moveTo(a.x * bw, -bh * 0.8 + a.y * bh); ctx.lineTo(b.x * bw, -bh * 0.8 + b.y * bh); ctx.stroke();
        tip = b; tipW = (b.w || 2.6) * k;
      }
      target--;
    }
    if (prog < 1 && tip) { ctx.beginPath(); ctx.arc(tip.x * bw, -bh * 0.8 + tip.y * bh, tipW * 0.85, 0, Math.PI * 2); ctx.fill(); }
  }

  function drawSignature(ctx, d, ct, dur) {
    if (d.sigShow === false) return;
    const prog = clamp01((ct - (d.sigStart / 100) * dur) / Math.max(0.05, (d.sigSpan / 100) * dur));
    if (prog <= 0) return;
    const bw = 0.42 * W * d.sigScale, bh = 0.085 * H * d.sigScale;
    ctx.save();
    ctx.translate(d.sigX * W, d.sigY * H);
    ctx.rotate((d.sigRotation || 0) * Math.PI / 180);
    ctx.globalCompositeOperation = 'multiply';
    const k = 1.3 * d.sigScale;
    const mode = d.sigMode;
    if (mode === 'typed') {
      const fs = Math.round(bh * 0.85);
      ctx.font = fs + 'px "Segoe Script","Brush Script MT","Lucida Handwriting",cursive';
      ctx.fillStyle = d.sigColor; ctx.textAlign = 'left';
      ctx.save(); ctx.beginPath(); ctx.rect(-10, -bh * 1.1, (bw + 20) * prog, bh * 1.6); ctx.clip();
      ctx.fillText(d.sigTyped || d.signeeName || '', 4, -bh * 0.05);
      ctx.restore();
    } else if (mode === 'upload' && d.sigImage) {
      const im = getSigImage(d.sigImage);
      if (im) {
        const sc = Math.min(bw / im.naturalWidth, bh * 1.2 / im.naturalHeight);
        const iw = im.naturalWidth * sc, ih = im.naturalHeight * sc;
        ctx.save(); ctx.beginPath(); ctx.rect(-10, -bh * 1.3, (iw + 20) * prog, bh * 2); ctx.clip();
        ctx.drawImage(im, 0, -ih * 0.85, iw, ih);
        ctx.restore();
      }
    } else {
      let strokes;
      if (mode === 'draw' && d.sigStrokes && d.sigStrokes.length) strokes = d.sigStrokes;
      else strokes = SIG_PRESETS[d.sigPreset] || SIG_PRESETS.quill;
      drawStrokes(ctx, strokes, prog, bw, bh, d.sigColor, k);
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------ stamps
  function drawRubberStamp(ctx, o) {
    ctx.save();
    ctx.globalAlpha = o.alpha; ctx.globalCompositeOperation = 'multiply';
    ctx.translate(o.x, o.y); ctx.rotate(o.angle); ctx.scale(o.scale, o.scale);
    ctx.font = '900 40px "Courier New",Impact,monospace';
    const tw = ctx.measureText(o.text).width;
    const bw = tw + 52, bh = 66;
    ctx.strokeStyle = o.color; ctx.lineWidth = 5; ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
    ctx.lineWidth = 1.8; ctx.strokeRect(-bw / 2 + 5, -bh / 2 + 5, bw - 10, bh - 10);
    ctx.fillStyle = o.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(o.text, 0, 2);
    const r = rng32(o.text.length * 977 + 11);
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 40; i++) {
      ctx.globalAlpha = 0.5;
      ctx.fillRect((r() - 0.5) * bw, (r() - 0.5) * bh, 2 + r() * 4, 1 + r() * 3);
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------ frame renderer
  let frameCv = null, frameCtx = null;

  function drawJob(ctx, job, prog) {
    const total = job.segs.reduce(function (s, g) { return s + (g.x1 - g.x0); }, 0);
    let rem = prog * total;
    job.segs.forEach(function (g) {
      const gw = g.x1 - g.x0, dw = Math.min(gw, Math.max(0, rem));
      rem -= gw;
      if (dw <= 0) return;
      const top = g.y - g.size * 0.95, hh = g.size * 1.22;
      if (job.style === 'underline') {
        ctx.strokeStyle = job.color; ctx.lineWidth = Math.max(4, g.size * 0.14); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(g.x0, g.y + g.size * 0.2); ctx.lineTo(g.x0 + dw * 0.5, g.y + g.size * 0.26); ctx.lineTo(g.x0 + dw, g.y + g.size * 0.19); ctx.stroke();
      } else if (job.style === 'redact') {
        ctx.fillStyle = '#060606'; ctx.fillRect(g.x0 - 5, top + g.size * 0.08, dw + 10, hh * 0.92);
      } else {
        ctx.fillStyle = job.color;
        ctx.beginPath();
        ctx.moveTo(g.x0 - 6, top + 3); ctx.lineTo(g.x0 + dw + 2, top); ctx.lineTo(g.x0 + dw + 7, top + hh); ctx.lineTo(g.x0 - 9, top + hh - 2);
        ctx.closePath(); ctx.fill();
      }
    });
  }

  function renderFrame(d, t) {
    const base = buildBase(d);
    if (!frameCv) { frameCv = document.createElement('canvas'); frameCv.width = W; frameCv.height = H; frameCtx = frameCv.getContext('2d'); }
    const ctx = frameCtx;
    const dur = d.duration, ct = Math.max(0, Math.min(dur, t));
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.drawImage(base.canvas, 0, 0);

    const jobs = [];
    d.dealTerms.forEach(function (term, i) {
      if (term.highlighted && base.termWords[i] && base.termWords[i].length) {
        jobs.push({ segs: segsFromWords(base.termWords[i]), color: term.color || '#facc15', style: 'marker' });
      }
    });
    d.highlights.forEach(function (h) {
      if (h.enabled === false || !h.text) return;
      const segs = findPhraseSegs(base.words, h.text);
      if (segs.length) jobs.push({ segs: segs, color: h.color || '#facc15', style: h.style || 'marker' });
    });
    const hs = 0.12 * dur, span = 0.32 * dur, n = Math.max(1, jobs.length);
    jobs.forEach(function (j, i) { j.p = clamp01((ct - (hs + i * span / n)) / Math.max(0.08, 1.3 * span / n)); });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.88;
    jobs.forEach(function (j) { if (j.style === 'marker' && j.p > 0) drawJob(ctx, j, j.p); });
    ctx.restore();
    ctx.save();
    jobs.forEach(function (j) { if (j.style === 'underline' && j.p > 0) drawJob(ctx, j, j.p); });
    jobs.forEach(function (j) { if (j.style === 'redact' && j.p > 0) drawJob(ctx, j, j.p); });
    ctx.restore();

    drawSignature(ctx, d, ct, dur);

    const sigEnd = (d.sigStart + d.sigSpan) / 100 * dur;
    const st = Math.max(0.72 * dur, sigEnd + 0.03 * dur), sd = Math.max(0.2, 0.08 * dur);
    [[1, st], [2, st + 0.11 * dur]].forEach(function (pair) {
      const i = pair[0], t0 = pair[1];
      if (d['showStamp' + i] === false || ct < t0) return;
      const p = clamp01((ct - t0) / sd);
      const sc = p < 0.6 ? (2.2 - (p / 0.6) * 1.25) : (0.95 + (p - 0.6) * 0.125);
      drawRubberStamp(ctx, {
        text: d['stamp' + i + 'Text'] || '', x: d['stamp' + i + 'X'] * W, y: d['stamp' + i + 'Y'] * H,
        angle: (d['stamp' + i + 'Angle'] || 0) * Math.PI / 180, scale: sc, alpha: Math.min(1, p * 1.8), color: d['stamp' + i + 'Color'] || '#b91c1c'
      });
    });
    return frameCv;
  }

  function generateTermSheetTexture(raw, t) {
    const d = normalizeConfig(raw);
    return renderFrame(d, t !== undefined ? t : d.duration * 0.95);
  }

  // ------------------------------------------------------------------ three.js scene
  let tsScene = null, tsCamera = null, tsRenderer = null, tsAnimFrame = null, tsControls = null, tsGroup = null, tsResizeObs = null;
  let paperFront = null, paperBack = null, envGroup = null, dustPoints = null, raysMesh = null, floorMesh = null;
  let spotLight = null, ambientLight = null, rimLight = null, paperTex = null;
  let liveData = null, liveSig = '', userOrbited = false, lastFrameSig = '';
  let isManualScrub = false, manualT = 0, animClock = 0, lastTimestamp = 0;
  let videoAnimFrame = null, videoClock = 0, videoLast = 0;
  const surfaceCache = {};
  let glowTex = null;

  function setSRGB(tex) { if (tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding; }

  function getGlowTexture() {
    if (glowTex) return glowTex;
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    glowTex = new THREE.CanvasTexture(c);
    return glowTex;
  }

  function surfaceCanvas(type) {
    if (surfaceCache[type]) return surfaceCache[type];
    const cv = document.createElement('canvas'); cv.width = cv.height = 1024;
    const ctx = cv.getContext('2d');
    const r = rng32(99);
    if (type === 'leather') {
      ctx.fillStyle = '#0c0f14'; ctx.fillRect(0, 0, 1024, 1024);
      const img = ctx.getImageData(0, 0, 1024, 1024); const p = img.data;
      for (let i = 0; i < p.length; i += 4) { const n = (r() - 0.5) * 12; p[i] = 12 + n; p[i + 1] = 15 + n; p[i + 2] = 20 + n; }
      ctx.putImageData(img, 0, 0);
      ctx.strokeStyle = 'rgba(217,119,6,0.4)'; ctx.lineWidth = 3.5; ctx.setLineDash([9, 9]); ctx.strokeRect(40, 40, 944, 944);
    } else if (type === 'noir_slate') {
      const g = ctx.createLinearGradient(0, 0, 1024, 1024);
      g.addColorStop(0, '#090b10'); g.addColorStop(0.5, '#11151f'); g.addColorStop(1, '#07080c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 1024);
      const img = ctx.getImageData(0, 0, 1024, 1024); const p = img.data;
      for (let i = 0; i < p.length; i += 4) { const n = (r() - 0.5) * 14; p[i] += n; p[i + 1] += n; p[i + 2] += n; }
      ctx.putImageData(img, 0, 0);
    } else {
      const g = ctx.createLinearGradient(0, 0, 1024, 1024);
      g.addColorStop(0, '#150804'); g.addColorStop(0.3, '#260e06'); g.addColorStop(0.6, '#1a0904'); g.addColorStop(1, '#0e0502');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 1024);
      for (let i = 0; i < 60; i++) { ctx.fillStyle = 'rgba(217,119,6,' + (0.02 + r() * 0.05) + ')'; ctx.fillRect(0, i * 17, 1024, 4 + r() * 10); }
    }
    surfaceCache[type] = cv;
    return cv;
  }

  function envSig(d) {
    return [d.environment, d.bokeh, d.dust, d.godRays, d.godRayIntensity, d.backdropImage ? d.backdropImage.length : 0, d.backdropOpacity].join('|');
  }

  function disposeObject(o) {
    o.traverse(function (n) {
      if (n.geometry) n.geometry.dispose();
      if (n.material) { if (n.material.map && n.material.map !== glowTex) n.material.map.dispose(); n.material.dispose(); }
    });
  }

  let envToken = 0;
  function buildEnvironment(d) {
    if (envGroup) { tsScene.remove(envGroup); disposeObject(envGroup); }
    envGroup = new THREE.Group(); dustPoints = null; raysMesh = null; floorMesh = null;
    tsScene.add(envGroup);
    const token = ++envToken;
    const r = rng32(2024);

    if (d.bokeh !== false) {
      const cols = ['#f59e0b', '#fb923c', '#38bdf8', '#a78bfa', '#fde68a'];
      for (let i = 0; i < 34; i++) {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({
          map: getGlowTexture(), color: new THREE.Color(cols[Math.floor(r() * cols.length)]),
          transparent: true, opacity: 0.08 + r() * 0.2, blending: THREE.AdditiveBlending, depthWrite: false, fog: false
        }));
        const z = -150 - r() * 520;
        sp.position.set((r() - 0.5) * 1100, -120 + r() * 420, z);
        const s = 30 + r() * 110; sp.scale.set(s, s, 1);
        envGroup.add(sp);
      }
    }

    if (d.environment && d.environment !== 'void_studio') {
      const tex = new THREE.CanvasTexture(surfaceCanvas(d.environment === 'noir_slate' ? 'noir_slate' : d.environment));
      setSRGB(tex); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 2.4);
      floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(3500, 2500), new THREE.MeshStandardMaterial({ map: tex, roughness: d.environment === 'leather' ? 0.72 : 0.6, metalness: 0.05 }));
      floorMesh.rotation.x = -Math.PI / 2; floorMesh.position.y = -120; floorMesh.receiveShadow = true;
      envGroup.add(floorMesh);
    }

    if (d.backdropImage) {
      const img = new Image();
      img.onload = function () {
        if (token !== envToken || !envGroup) return;
        const tex = new THREE.Texture(img); tex.needsUpdate = true; setSRGB(tex);
        const asp = img.width / img.height, hgt = Math.max(640, 960 / asp);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(hgt * asp, hgt), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: d.backdropOpacity, fog: false, depthWrite: false }));
        m.position.set(0, 70, -640);
        envGroup.add(m);
      };
      img.src = d.backdropImage;
    }

    if (d.dust !== false) {
      const N = 300, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { pos[i * 3] = (r() - 0.5) * 520; pos[i * 3 + 1] = (r() - 0.5) * 360; pos[i * 3 + 2] = (r() - 0.5) * 420; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      dustPoints = new THREE.Points(g, new THREE.PointsMaterial({ map: getGlowTexture(), size: 5, transparent: true, opacity: 0.55, color: 0xffe9c0, blending: THREE.AdditiveBlending, depthWrite: false }));
      dustPoints.position.set(10, 20, 0);
      envGroup.add(dustPoints);
    }

    if (d.godRays !== false) {
      const geo = new THREE.ConeGeometry(150, 460, 40, 1, true);
      raysMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffe2b0, transparent: true, opacity: 0.07 * (d.godRayIntensity !== undefined ? d.godRayIntensity * 2 : 1), side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      raysMesh.position.set(30, 150, 20); raysMesh.rotation.z = 0.12; raysMesh.rotation.x = 0.1;
      envGroup.add(raysMesh);
    }
  }

  function makePaperGeometry(curl) {
    const g = new THREE.PlaneGeometry(PAPER_W, PAPER_H, 28, 36);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const nx = pos.getX(i) / PAPER_W + 0.5, ny = pos.getY(i) / PAPER_H + 0.5;
      const dist = nx + (1 - ny);
      const over = Math.max(0, dist - 1.4) / 0.6;
      pos.setZ(i, curl * over * over * 20 + curl * 1.8 * Math.sin(nx * Math.PI));
    }
    g.computeVertexNormals();
    return g;
  }

  function applyGroupRotation(d) {
    if (!tsGroup) return;
    tsGroup.rotation.x = THREE.MathUtils.degToRad(d.cameraPitch);
    tsGroup.rotation.y = THREE.MathUtils.degToRad(d.cameraYaw);
    tsGroup.rotation.z = THREE.MathUtils.degToRad(d.cameraRoll);
  }

  function buildTermSheetAssembly(d) {
    if (tsGroup) { tsScene.remove(tsGroup); disposeObject(tsGroup); }
    tsGroup = new THREE.Group();
    const cv = renderFrame(d, d.duration * 0.0);
    paperTex = new THREE.CanvasTexture(cv);
    paperTex.anisotropy = 8; setSRGB(paperTex);
    const geo = makePaperGeometry(d.paperCurl);
    paperFront = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: paperTex, roughness: 0.85, metalness: 0.0, side: THREE.FrontSide }));
    paperFront.rotation.x = -Math.PI / 2; paperFront.castShadow = true; paperFront.receiveShadow = true;
    paperBack = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xe9e2cf, roughness: 0.9, side: THREE.BackSide }));
    paperBack.rotation.x = -Math.PI / 2; paperBack.castShadow = true;
    tsGroup.add(paperFront); tsGroup.add(paperBack);
    tsGroup.position.set(16, 8, -5);
    applyGroupRotation(d);
    tsScene.add(tsGroup);
    lastFrameSig = '';
  }

  function applyLights(d) {
    if (spotLight) { spotLight.color = new THREE.Color(d.lightWarmth || '#fff3db'); spotLight.intensity = d.lightIntensity; }
  }
  function applyVignette(d) {
    const v = document.getElementById('ts-vignette');
    if (v) v.style.background = 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,' + d.vignette + ') 100%)';
  }

  /** Diff-based live update: used by inspector edits and by the customizer step callback. */
  function syncLive(raw) {
    const d = normalizeConfig(raw);
    const sig = cfgSig(d);
    if (sig === liveSig) return d;
    const prev = liveData;
    liveSig = sig; liveData = d;
    if (tsScene) {
      if (!prev || envSig(prev) !== envSig(d)) buildEnvironment(d);
      if (!prev || prev.paperCurl !== d.paperCurl) buildTermSheetAssembly(d);
      applyGroupRotation(d); applyLights(d); applyVignette(d);
      if (prev && (prev.cameraDistance !== d.cameraDistance || prev.autoPan !== d.autoPan)) userOrbited = false;
    }
    return d;
  }

  function cleanupScene() {
    if (tsAnimFrame) { cancelAnimationFrame(tsAnimFrame); tsAnimFrame = null; }
    if (videoAnimFrame) { cancelAnimationFrame(videoAnimFrame); videoAnimFrame = null; }
    if (tsResizeObs) { tsResizeObs.disconnect(); tsResizeObs = null; }
    if (tsControls) { tsControls.dispose(); tsControls = null; }
    if (tsRenderer) {
      if (tsRenderer.domElement && tsRenderer.domElement.parentElement) tsRenderer.domElement.parentElement.removeChild(tsRenderer.domElement);
      tsRenderer.dispose(); tsRenderer = null;
    }
    tsScene = null; tsCamera = null; tsGroup = null; paperFront = null; paperBack = null; envGroup = null; dustPoints = null; raysMesh = null; floorMesh = null; paperTex = null;
    spotLight = null; ambientLight = null; rimLight = null; lastFrameSig = '';
  }
  window.cleanupDealTermSheet3DScene = cleanupScene;

  window.initDealTermSheet3DScene = function (container, data) {
    if (!container) return;
    cleanupScene();
    liveSig = ''; liveData = null; userOrbited = false;
    const d = normalizeConfig(data);
    liveSig = cfgSig(d); liveData = d;
    const w = container.clientWidth || 960, h = container.clientHeight || 540;

    tsScene = new THREE.Scene();
    tsScene.background = new THREE.Color('#05070b');
    tsScene.fog = new THREE.FogExp2(0x05070b, 0.0009);

    tsCamera = new THREE.PerspectiveCamera(31, w / h, 5, 4000);
    tsRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    tsRenderer.setSize(w, h);
    tsRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    tsRenderer.shadowMap.enabled = true; tsRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.sRGBEncoding) tsRenderer.outputEncoding = THREE.sRGBEncoding;
    if (THREE.ACESFilmicToneMapping) { tsRenderer.toneMapping = THREE.ACESFilmicToneMapping; tsRenderer.toneMappingExposure = 1.0; }
    container.innerHTML = '';
    container.appendChild(tsRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      tsControls = new THREE.OrbitControls(tsCamera, tsRenderer.domElement);
      tsControls.enableDamping = true; tsControls.dampingFactor = 0.08;
      tsControls.minDistance = 60; tsControls.maxDistance = 900;
      tsControls.target.set(18, 12, 5);
      tsControls.addEventListener('start', function () { userOrbited = true; });
    }

    ambientLight = new THREE.AmbientLight(0x2d241c, 0.9); tsScene.add(ambientLight);
    spotLight = new THREE.SpotLight(new THREE.Color(d.lightWarmth), d.lightIntensity);
    spotLight.position.set(60, 320, 180); spotLight.target.position.set(15, 0, 0);
    spotLight.angle = 0.8; spotLight.penumbra = 0.75; spotLight.decay = 1.2; spotLight.distance = 1100;
    spotLight.castShadow = true; spotLight.shadow.mapSize.set(2048, 2048); spotLight.shadow.bias = -0.0004;
    tsScene.add(spotLight); tsScene.add(spotLight.target);
    rimLight = new THREE.DirectionalLight(0x93c5fd, 0.4); rimLight.position.set(-180, 80, -120); tsScene.add(rimLight);

    buildEnvironment(d);
    buildTermSheetAssembly(d);
    applyVignette(d);
    updateAnimationStep(0, d);

    if (window.ResizeObserver) {
      tsResizeObs = new ResizeObserver(function () {
        const cw = container.clientWidth, ch = container.clientHeight;
        if (cw && ch && tsRenderer && tsCamera) { tsRenderer.setSize(cw, ch); tsCamera.aspect = cw / ch; tsCamera.updateProjectionMatrix(); }
      });
      tsResizeObs.observe(container);
    }

    lastTimestamp = performance.now();
    function loop(now) {
      tsAnimFrame = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - lastTimestamp) / 1000); lastTimestamp = now;
      const dd = liveData || d;
      if (!isManualScrub) animClock = (animClock + dt) % dd.duration;
      updateAnimationStep(isManualScrub ? manualT : animClock, dd);
      if (dustPoints) {
        const a = dustPoints.geometry.attributes.position;
        for (let i = 0; i < a.count; i++) {
          let yy = a.getY(i) + dt * (4 + (i % 5)); if (yy > 180) yy = -180; a.setY(i, yy);
          a.setX(i, a.getX(i) + Math.sin(now * 0.0003 + i) * dt * 2);
        }
        a.needsUpdate = true;
      }
      if (tsControls) tsControls.update();
      if (tsRenderer && tsScene && tsCamera) tsRenderer.render(tsScene, tsCamera);
    }
    tsAnimFrame = requestAnimationFrame(loop);
  };

  function updateAnimationStep(t, d) {
    if (!paperFront || !paperTex) return;
    const dur = d.duration, ct = Math.max(0, Math.min(dur, t));
    const fsig = liveSig + '|' + Math.round(ct * 30);
    if (fsig !== lastFrameSig) {
      lastFrameSig = fsig;
      renderFrame(d, ct);
      paperTex.needsUpdate = true;
    }
    if (tsCamera && !userOrbited) {
      const p = d.autoPan ? ct / dur : 0, f = d.cameraDistance || 1;
      tsCamera.position.set(14, (155 - 17 * p) * f, (235 - 27 * p) * f);
      tsCamera.lookAt(18, 12 - p * 8, 5 - p * 6);
    }
  }

  // ------------------------------------------------------------------ stages
  function vignetteHtml(d) {
    return '<div id="ts-vignette" style="position:absolute;inset:0;z-index:5;pointer-events:none;background:radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,' + d.vignette + ') 100%);"></div>';
  }

  window.tplMountDealTermSheet3DStage = function (stage, data) {
    if (!stage) return;
    const d = normalizeConfig(Object.assign({}, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {}));
    if (typeof window.applyModeLayout === 'function') window.applyModeLayout(true);
    stage.innerHTML =
      '<div id="customizer-stage-inner" style="position:absolute;inset:0;background:#05070b;overflow:hidden;cursor:grab;user-select:none;">' +
      '<div id="term-sheet-3d-viewport" style="position:absolute;inset:0;width:100%;height:100%;z-index:2;"></div>' + vignetteHtml(d) +
      '<div style="position:absolute;bottom:12px;left:14px;pointer-events:none;z-index:40;display:flex;align-items:center;gap:8px;">' +
      '<span style="font-family:monospace;font-size:9px;font-weight:700;color:#facc15;background:rgba(10,12,18,0.92);border:1px solid rgba(250,204,21,0.4);padding:3px 8px;border-radius:4px;text-transform:uppercase;">3D DOC-DRAMA RIG \u2022 ' + (PRESETS[d.docType].label) + '</span>' +
      '<span style="font-family:monospace;font-size:9px;color:#2effc6;background:rgba(10,12,18,0.85);border:1px solid rgba(46,255,198,0.3);padding:3px 6px;border-radius:4px;font-weight:700;">DRAG = ORBIT \u2022 RIGHT-DRAG = PAN \u2022 WHEEL = ZOOM</span></div></div>';
    const vp = stage.querySelector('#term-sheet-3d-viewport');
    function go() { window.initDealTermSheet3DScene(vp, d); }
    go(); setTimeout(go, 60);
  };

  function drawVoidBackdrop(ctx, cw, ch, d) {
    const g = ctx.createRadialGradient(cw * 0.5, ch * 0.45, 20, cw * 0.5, ch * 0.5, cw * 0.75);
    g.addColorStop(0, '#1b1a22'); g.addColorStop(1, '#05070b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    if (d.bokeh !== false) {
      const r = rng32(2024), cols = ['#f59e0b', '#fb923c', '#38bdf8', '#a78bfa', '#fde68a'];
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 30; i++) {
        const x = r() * cw, y = r() * ch, rad = 10 + r() * 60;
        const gg = ctx.createRadialGradient(x, y, 0, x, y, rad);
        gg.addColorStop(0, hexRgba(cols[Math.floor(r() * 5)], 0.22)); gg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gg; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      ctx.restore();
    }
  }

  function renderDirect2D(ctx, raw, t, cw, ch) {
    if (!ctx) return;
    const d = normalizeConfig(raw);
    if (d.environment && d.environment !== 'void_studio') {
      ctx.drawImage(surfaceCanvas(d.environment), 0, 0, cw, ch);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, cw, ch);
    } else drawVoidBackdrop(ctx, cw, ch, d);
    const cv = renderFrame(d, Math.max(0, Math.min(d.duration, t)));
    ctx.save();
    ctx.translate(cw * 0.5, ch * 0.5);
    ctx.rotate(d.cameraRoll * 0.6 * Math.PI / 180);
    ctx.transform(1, -0.05, Math.max(-0.35, Math.min(0.35, -d.cameraYaw / 70)), 0.9, 0, 0);
    ctx.shadowColor = 'rgba(0,0,0,0.75)'; ctx.shadowBlur = 36; ctx.shadowOffsetX = 14; ctx.shadowOffsetY = 26;
    const dh = ch * 0.92 * (d.cameraDistance ? 1 / Math.max(0.6, d.cameraDistance) : 1), dw = dh * 8.5 / 11;
    ctx.drawImage(cv, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
    const v = ctx.createRadialGradient(cw / 2, ch / 2, ch * 0.3, cw / 2, ch / 2, cw * 0.7);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,' + d.vignette + ')');
    ctx.fillStyle = v; ctx.fillRect(0, 0, cw, ch);
  }

  window.tplMountDealTermSheetVideoStage = function (stage, data) {
    if (!stage) return;
    const d0 = normalizeConfig(Object.assign({}, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(TEMPLATE_ID) : null), data || {}));
    cleanupScene();
    liveData = d0; liveSig = cfgSig(d0);
    if (typeof window.applyModeLayout === 'function') window.applyModeLayout(false);
    stage.innerHTML =
      '<div id="term-sheet-video-stage" style="position:absolute;inset:0;background:#05070b;overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
      '<canvas id="term-sheet-video-canvas" width="1280" height="720" style="width:100%;height:100%;object-fit:contain;"></canvas>' +
      '<div style="position:absolute;bottom:12px;left:14px;pointer-events:none;z-index:40;"><span style="font-family:monospace;font-size:9px;font-weight:700;color:#38bdf8;background:rgba(10,12,18,0.92);border:1px solid rgba(56,189,248,0.4);padding:3px 8px;border-radius:4px;text-transform:uppercase;">FLAT VIDEO MODE \u2022 ' + PRESETS[d0.docType].label + '</span></div></div>';
    const cv = stage.querySelector('#term-sheet-video-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    videoClock = 0; videoLast = performance.now();
    function vLoop(now) {
      videoAnimFrame = requestAnimationFrame(vLoop);
      const dt = Math.min(0.1, (now - videoLast) / 1000); videoLast = now;
      const dd = liveData || d0;
      videoClock = isManualScrub ? manualT : (videoClock + dt) % dd.duration;
      renderDirect2D(ctx, dd, videoClock, cv.width, cv.height);
    }
    videoAnimFrame = requestAnimationFrame(vLoop);
  };

  window.stepDealTermSheetAnimation = function (container, tplId, t, data) {
    if (!container) return;
    manualT = t; isManualScrub = true;
    const d = syncLive(data);
    const vp = container.querySelector('#term-sheet-3d-viewport');
    if (vp) {
      if (!tsRenderer) window.initDealTermSheet3DScene(vp, d);
      updateAnimationStep(t, d);
    }
    const vc = container.querySelector('#term-sheet-video-canvas');
    if (vc) renderDirect2D(vc.getContext('2d'), d, t, vc.width, vc.height);
  };

  window.renderDealTermSheetCanvas = function (ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const d = normalizeConfig(clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData);
    if (tsRenderer && tsRenderer.domElement && tsScene && tsCamera) {
      updateAnimationStep(t, d);
      tsRenderer.render(tsScene, tsCamera);
      ctx.drawImage(tsRenderer.domElement, 0, 0, cw, ch);
      return;
    }
    renderDirect2D(ctx, d, t, cw, ch);
  };

  window.tplSetDealTermSheetAngles = function (pitch, yaw) {
    if (!tsGroup) return;
    if (pitch !== undefined) tsGroup.rotation.x = THREE.MathUtils.degToRad(pitch);
    if (yaw !== undefined) tsGroup.rotation.y = THREE.MathUtils.degToRad(yaw);
  };

  // ------------------------------------------------------------------ inspector
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function downscaleImage(file, maxW, mime, quality, knockOutWhite, cb) {
    const fr = new FileReader();
    fr.onload = function () {
      const img = new Image();
      img.onload = function () {
        const sc = Math.min(1, maxW / img.width);
        const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
        if (knockOutWhite) {
          const id = x.getImageData(0, 0, c.width, c.height), p = id.data;
          for (let i = 0; i < p.length; i += 4) {
            const lum = (p[i] + p[i + 1] + p[i + 2]) / 3;
            if (lum > 235) p[i + 3] = 0; else if (lum > 185) p[i + 3] = Math.round((235 - lum) / 50 * p[i + 3]);
          }
          x.putImageData(id, 0, 0);
        }
        cb(c.toDataURL(mime, quality));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  window.tplBuildDealTermSheetInspector = function (container, rawData, tplId) {
    if (!container) return;
    const d = normalizeConfig(rawData);
    const is3D = d.is3DMode !== false;
    const P = PRESETS[d.docType];
    const IN = 'background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;border-radius:5px;padding:4px 6px;font-size:10px;outline:none;width:100%;box-sizing:border-box;';
    const LB = 'font-size:8.5px;color:#94a3b8;';
    const BTN = 'padding:4px 5px;font-size:9px;font-weight:700;border-radius:5px;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.4);color:#cbd5e1;cursor:pointer;';

    const sec = function (title, color, inner, open) {
      return '<details ' + (open === false ? '' : 'open') + ' style="background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 10px;">' +
        '<summary style="cursor:pointer;font-size:9.5px;font-weight:800;color:' + color + ';text-transform:uppercase;letter-spacing:0.5px;">' + title + '</summary>' +
        '<div style="display:flex;flex-direction:column;gap:7px;margin-top:8px;">' + inner + '</div></details>';
    };
    const field = function (id, label, val) { return '<div style="display:flex;flex-direction:column;gap:2px;"><span style="' + LB + '">' + label + '</span><input type="text" id="' + id + '" value="' + esc(val) + '" style="' + IN + '"/></div>'; };
    const area = function (id, label, val, rows) { return '<div style="display:flex;flex-direction:column;gap:2px;"><span style="' + LB + '">' + label + '</span><textarea id="' + id + '" rows="' + rows + '" style="' + IN + 'font-family:monospace;resize:vertical;">' + esc(val) + '</textarea></div>'; };
    const range = function (id, label, min, max, step, val, unit) {
      return '<div style="display:flex;flex-direction:column;gap:1px;"><div style="display:flex;justify-content:space-between;' + LB + '"><span>' + label + '</span><span id="' + id + '-v" style="font-family:monospace;color:#2effc6;font-weight:700;">' + val + (unit || '') + '</span></div>' +
        '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" style="accent-color:#a855f7;height:3px;cursor:pointer;"/></div>';
    };
    const chk = function (id, label, on) { return '<label style="display:flex;align-items:center;gap:5px;font-size:9.5px;color:#cbd5e1;cursor:pointer;"><input type="checkbox" id="' + id + '" ' + (on ? 'checked' : '') + ' style="accent-color:#a855f7;"/>' + label + '</label>'; };
    const sel = function (id, label, opts, cur) {
      return '<div style="display:flex;flex-direction:column;gap:2px;"><span style="' + LB + '">' + label + '</span><select id="' + id + '" style="' + IN + 'cursor:pointer;">' +
        opts.map(function (o) { return '<option value="' + o[0] + '" ' + (String(o[0]) === String(cur) ? 'selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>';
    };
    const color = function (id, label, val) { return '<div style="display:flex;align-items:center;justify-content:space-between;"><span style="' + LB + '">' + label + '</span><input type="color" id="' + id + '" value="' + val + '" style="width:26px;height:18px;border:none;background:transparent;cursor:pointer;"/></div>'; };

    // ---- camera
    const camera = is3D ? sec('\ud83c\udfa5 3D Camera & Paper', '#e9d5ff',
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">' +
      [['Cinematic', 29, -13, 4], ['Face Camera', 58, 0, 0], ['Flat Lay', 0, 0, 0], ['Dramatic Low', 72, 28, -8], ['Dutch Tilt', 35, -20, -16], ['Iso Left', 45, -32, 0]].map(function (p) {
        return '<button type="button" class="ts-cam-preset" data-p="' + p[1] + '" data-y="' + p[2] + '" data-r="' + p[3] + '" style="' + BTN + '">' + p[0] + '</button>';
      }).join('') + '</div>' +
      range('ts-pitch', 'TILT PITCH', -30, 90, 1, d.cameraPitch, '\u00b0') + range('ts-yaw', 'ROTATION YAW', -75, 75, 1, d.cameraYaw, '\u00b0') +
      range('ts-roll', 'ROLL / DUTCH CANT', -35, 35, 1, d.cameraRoll, '\u00b0') + range('ts-dist', 'CAMERA DISTANCE', 0.5, 2, 0.05, d.cameraDistance, 'x') +
      range('ts-curl', 'PAPER CURL / DOG-EAR', 0, 1.5, 0.05, d.paperCurl, '') +
      chk('ts-autopan', 'Cinematic auto-pan toward signature', d.autoPan !== false) + chk('ts-creases', 'Fold creases', d.foldCreases !== false) +
      '<button type="button" id="ts-cam-reset" style="' + BTN + '">\u21ba Re-center camera (after dragging)</button>') : '';

    // ---- environment
    const environment = sec('\ud83c\udf0c Environment & Depth', '#93c5fd',
      sel('ts-env', 'Background', [['void_studio', 'Floating Void Studio (max depth)'], ['mahogany', 'Mahogany Floor (far below)'], ['leather', 'Leather Floor (far below)'], ['noir_slate', 'Noir Slate Floor (far below)']], d.environment) +
      chk('ts-bokeh', 'Parallax bokeh lights', d.bokeh !== false) + chk('ts-dust', 'Floating dust motes', d.dust !== false) + chk('ts-godrays', 'Volumetric god rays', d.godRays !== false) +
      range('ts-rays', 'GOD RAY INTENSITY', 0, 1.5, 0.05, d.godRayIntensity, '') + range('ts-light', 'KEY LIGHT', 0.3, 3, 0.1, d.lightIntensity, '') + color('ts-warmth', 'Key light colour', d.lightWarmth) +
      range('ts-vig', 'VIGNETTE', 0, 0.95, 0.05, d.vignette, '') +
      '<div style="display:flex;gap:6px;align-items:center;"><label style="' + BTN + 'flex:1;text-align:center;">\ud83d\uddbc Upload parallax backdrop<input type="file" id="ts-backdrop-file" accept="image/*" style="display:none;"/></label>' +
      (d.backdropImage ? '<button type="button" id="ts-backdrop-clear" style="' + BTN + '">Remove</button>' : '') + '</div>' +
      (d.backdropImage ? range('ts-bd-op', 'BACKDROP OPACITY', 0.1, 1, 0.05, d.backdropOpacity, '') : ''));

    // ---- document
    const doc = sec('\ud83d\udcf0 Document & Text', '#facc15',
      sel('ts-doctype', 'Document type (loads that type\'s sample text)', Object.keys(PRESETS).map(function (k) { return [k, PRESETS[k].label]; }), d.docType) +
      field('ts-masthead', 'Masthead / classification line', d.masthead) + field('ts-badge', 'Banner tag', d.confidentialBadge) +
      field('ts-title', 'Headline / title', d.title) + field('ts-subtitle', 'Subtitle / dateline / parties', d.subtitle) +
      area('ts-preamble', 'Deck / preamble', d.preamble, 2) + area('ts-body', 'BODY TEXT (blank line = new paragraph)', d.bodyText, 9) +
      (P.layout === 'news' ? sel('ts-cols', 'Body columns', [[1, '1 column'], [2, '2 columns'], [3, '3 columns']], d.columns) + chk('ts-photo', 'Halftone photo block', d.photoBlock) : '') +
      sel('ts-stock', 'Paper stock', [['auto', 'Auto (matches document type)'], ['#f5f0e1', 'Vintage ivory'], ['#ffffff', 'Crisp white'], ['#fef3c7', 'Aged amber'], ['#e7e0cc', 'Newsprint'], ['#f0d8c2', 'Salmon financial'], ['#d6c498', 'Victorian sepia']], d.paperStock));

    // ---- key terms
    const terms = sec('\ud83d\udcca Key Terms (own highlight each)', '#facc15',
      field('ts-terms-heading', 'Section heading', d.termsHeading) +
      '<div id="ts-terms-list" style="display:flex;flex-direction:column;gap:6px;">' + d.dealTerms.map(function (t, i) {
        return '<div class="ts-term" data-i="' + i + '" style="background:rgba(15,23,42,0.65);border:1px solid rgba(255,255,255,0.08);border-left:3px solid ' + (t.color || '#facc15') + ';border-radius:6px;padding:6px;display:flex;flex-direction:column;gap:4px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;"><label style="display:flex;align-items:center;gap:5px;font-size:9.5px;color:#e2e8f0;cursor:pointer;"><input type="checkbox" class="ts-t-hl" ' + (t.highlighted ? 'checked' : '') + ' style="accent-color:' + (t.color || '#facc15') + ';"/>Highlight</label>' +
          '<span style="display:flex;align-items:center;gap:6px;"><input type="color" class="ts-t-col" value="' + (t.color || '#facc15') + '" style="width:22px;height:16px;border:none;background:transparent;cursor:pointer;"/><button type="button" class="ts-t-del" style="background:none;border:none;color:#f87171;font-weight:800;cursor:pointer;">\u2715</button></span></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1.6fr;gap:5px;"><input type="text" class="ts-t-label" value="' + esc(t.label) + '" style="' + IN + '"/><input type="text" class="ts-t-val" value="' + esc(t.value) + '" style="' + IN + '"/></div></div>';
      }).join('') + '</div><button type="button" id="ts-term-add" style="' + BTN + '">+ Add term</button>');

    // ---- phrase highlights
    const hl = sec('\ud83d\udd8d Phrase Highlights (any text, any colour)', '#4ade80',
      '<span style="font-size:8.5px;color:#94a3b8;">Type any phrase from the document. Every match is highlighted. Styles: marker, underline, redact bar.</span>' +
      '<div id="ts-hl-list" style="display:flex;flex-direction:column;gap:6px;">' + d.highlights.map(function (h, i) {
        return '<div class="ts-hl" data-i="' + i + '" style="background:rgba(15,23,42,0.65);border:1px solid rgba(255,255,255,0.08);border-left:3px solid ' + (h.color || '#facc15') + ';border-radius:6px;padding:6px;display:flex;flex-direction:column;gap:4px;">' +
          '<div style="display:flex;align-items:center;gap:6px;"><input type="checkbox" class="ts-h-on" ' + (h.enabled !== false ? 'checked' : '') + '/>' +
          '<input type="text" class="ts-h-text" value="' + esc(h.text) + '" placeholder="phrase to highlight..." style="' + IN + '"/>' +
          '<button type="button" class="ts-h-del" style="background:none;border:none;color:#f87171;font-weight:800;cursor:pointer;">\u2715</button></div>' +
          '<div style="display:flex;gap:6px;align-items:center;"><select class="ts-h-style" style="' + IN + '"><option value="marker" ' + (h.style === 'marker' || !h.style ? 'selected' : '') + '>Marker</option><option value="underline" ' + (h.style === 'underline' ? 'selected' : '') + '>Underline</option><option value="redact" ' + (h.style === 'redact' ? 'selected' : '') + '>Redact bar</option></select>' +
          '<input type="color" class="ts-h-col" value="' + (h.color || '#facc15') + '" style="width:26px;height:18px;border:none;background:transparent;cursor:pointer;"/></div></div>';
      }).join('') + '</div><button type="button" id="ts-hl-add" style="' + BTN + '">+ Add highlight</button>');

    // ---- signature layer
    const sigModes = [['preset', 'Preset'], ['draw', 'Draw'], ['upload', 'Upload'], ['typed', 'Typed']];
    const sigBody =
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">' + sigModes.map(function (m) {
        const on = d.sigMode === m[0];
        return '<button type="button" class="ts-sig-mode" data-m="' + m[0] + '" style="' + BTN + (on ? 'background:rgba(168,85,247,0.4);color:#fff;' : '') + '">' + m[1] + '</button>';
      }).join('') + '</div>' +
      (d.sigMode === 'preset' ? sel('ts-sigpreset', 'Cursive style', [['quill', 'Executive Quill'], ['loop', 'Modern CEO Loop'], ['flourish', 'Rapid Flourish'], ['initials', 'Initials + Strike']], d.sigPreset) : '') +
      (d.sigMode === 'draw' ? '<canvas id="ts-sig-pad" width="600" height="200" style="width:100%;height:90px;background:#f5f0e1;border-radius:6px;touch-action:none;cursor:crosshair;"></canvas>' +
        '<div style="display:flex;gap:6px;"><button type="button" id="ts-sig-clear" style="' + BTN + 'flex:1;">Clear pad</button><span style="font-size:8.5px;color:#94a3b8;align-self:center;">Sign above with mouse / pen</span></div>' : '') +
      (d.sigMode === 'upload' ? '<label style="' + BTN + 'text-align:center;">\ud83d\udcc1 Upload signature PNG/JPG<input type="file" id="ts-sig-file" accept="image/*" style="display:none;"/></label>' +
        chk('ts-sig-ko', 'Remove white background on upload', true) + (d.sigImage ? '<span style="font-size:8.5px;color:#4ade80;">Signature image loaded</span>' : '<span style="font-size:8.5px;color:#94a3b8;">No image yet - uploaded art is revealed left-to-right like ink.</span>') : '') +
      (d.sigMode === 'typed' ? field('ts-sigtyped', 'Typed signature text', d.sigTyped) : '') +
      chk('ts-sigshow', 'Show signature layer', d.sigShow !== false) + chk('ts-sigline', 'Show signature rule', d.sigLine !== false) +
      color('ts-sigcol', 'Ink colour', d.sigColor) +
      range('ts-sigx', 'POSITION X', 0, 0.8, 0.01, d.sigX, '') + range('ts-sigy', 'POSITION Y', 0.3, 0.97, 0.01, d.sigY, '') +
      range('ts-sigscale', 'SCALE', 0.4, 2, 0.05, d.sigScale, 'x') + range('ts-sigrot', 'ROTATION', -25, 25, 1, d.sigRotation, '\u00b0') +
      range('ts-sigstart', 'START (% of clip)', 5, 80, 1, d.sigStart, '%') + range('ts-sigspan', 'WRITING TIME (% of clip)', 5, 50, 1, d.sigSpan, '%') +
      field('ts-signee', 'Signee name (caption)', d.signeeName) + field('ts-signee-title', 'Signee title', d.signeeTitle) + field('ts-siglabel', 'Caption label', d.signatureLabel);
    const sig = sec('\u270d Signature Layer', '#60a5fa', sigBody);

    // ---- stamps
    const stamp = function (n) {
      return '<div style="background:rgba(15,23,42,0.6);border:1px solid rgba(239,68,68,0.25);border-radius:6px;padding:6px;display:flex;flex-direction:column;gap:5px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' + chk('ts-st' + n + '-on', 'Stamp ' + n, d['showStamp' + n] !== false) + '<input type="color" id="ts-st' + n + '-col" value="' + d['stamp' + n + 'Color'] + '" style="width:24px;height:16px;border:none;background:transparent;cursor:pointer;"/></div>' +
        field('ts-st' + n + '-text', 'Text', d['stamp' + n + 'Text']) + range('ts-st' + n + '-ang', 'ANGLE', -45, 45, 1, d['stamp' + n + 'Angle'], '\u00b0') +
        range('ts-st' + n + '-x', 'X', 0.1, 0.95, 0.01, d['stamp' + n + 'X'], '') + range('ts-st' + n + '-y', 'Y', 0.1, 0.95, 0.01, d['stamp' + n + 'Y'], '') + '</div>';
    };
    const stamps = sec('\ud83d\udd34 Rubber Stamps', '#ef4444', stamp(1) + stamp(2), false);

    container.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:10px;padding:4px 0;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">' +
      '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:10.5px;font-weight:800;color:#facc15;text-transform:uppercase;letter-spacing:0.6px;">\ud83d\udcdc Doc-Drama Engine</span>' +
      '<div style="display:flex;gap:2px;background:rgba(18,19,28,0.9);padding:2px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);">' +
      '<button type="button" id="btn-ts-mode-video" style="padding:2.5px 9px;font-size:10px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:' + (!is3D ? 'rgba(168,85,247,0.35)' : 'transparent') + ';color:' + (!is3D ? '#fff' : '#94a3b8') + ';">\u25b6 Video</button>' +
      '<button type="button" id="btn-ts-mode-3d" style="padding:2.5px 9px;font-size:10px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:' + (is3D ? 'rgba(168,85,247,0.35)' : 'transparent') + ';color:' + (is3D ? '#fff' : '#94a3b8') + ';">\u2b21 3D</button></div></div>' +
      '<span style="font-size:9px;color:' + (is3D ? '#2effc6' : '#facc15') + ';font-weight:800;border:1px solid currentColor;padding:2px 6px;border-radius:4px;">' + (is3D ? '\u2b21 3D ACTIVE' : 'DOC-DRAMA') + '</span></div>' +
      camera + environment + doc + terms + hl + sig + stamps +
      '<button type="button" id="btn-ts-reset" style="' + BTN + 'padding:6px 12px;font-size:10px;">Reset everything to defaults</button></div>';

    // ---- wiring
    const $ = function (s) { return container.querySelector(s); };
    function updateData(patch, rerender) {
      if (typeof window.tplSetContextualData !== 'function') return;
      const cur = normalizeConfig(window.tplGetContextualData(tplId));
      const next = Object.assign({}, cur, patch);
      window.tplSetContextualData(tplId, next);
      syncLive(next);
      if (rerender) window.tplRenderContextualInspector(tplId);
    }
    const bindText = function (id, key) { const e = $(id); if (e) e.addEventListener('input', function () { updateData({ [key]: e.value }); }); };
    const bindChk = function (id, key) { const e = $(id); if (e) e.addEventListener('change', function () { updateData({ [key]: e.checked }); }); };
    const bindColor = function (id, key) { const e = $(id); if (e) e.addEventListener('input', function () { updateData({ [key]: e.value }); }); };
    const bindRange = function (id, key, unit) {
      const e = $(id); if (!e) return;
      e.addEventListener('input', function () {
        const v = parseFloat(e.value); const lab = $(id + '-v'); if (lab) lab.textContent = v + (unit || '');
        updateData({ [key]: v });
      });
    };
    const bindSel = function (id, key, num, rerender) { const e = $(id); if (e) e.addEventListener('change', function () { updateData({ [key]: num ? parseInt(e.value, 10) : e.value }, rerender); }); };

    const setMode = function (m3) {
      updateData({ is3DMode: m3 });
      if (typeof topCustomizerState !== 'undefined') { topCustomizerState.is3DMode = m3; topCustomizerState.paperPreviewMode = m3 ? '3d' : 'video'; }
      const pVid = document.getElementById('btn-paper-rip-mode-video'), p3D = document.getElementById('btn-paper-rip-mode-3d');
      if (pVid && p3D) {
        pVid.style.background = !m3 ? 'rgba(168,85,247,.35)' : 'transparent'; pVid.style.color = !m3 ? '#fff' : '#94a3b8';
        p3D.style.background = m3 ? 'rgba(168,85,247,.35)' : 'transparent'; p3D.style.color = m3 ? '#fff' : '#94a3b8';
      }
      if (typeof window.applyModeLayout === 'function') window.applyModeLayout(m3);
      if (typeof renderTopTemplatePreviewStage === 'function') renderTopTemplatePreviewStage();
      window.tplRenderContextualInspector(tplId);
    };
    $('#btn-ts-mode-video').addEventListener('click', function () { setMode(false); });
    $('#btn-ts-mode-3d').addEventListener('click', function () { setMode(true); });

    // camera
    bindRange('#ts-pitch', 'cameraPitch', '\u00b0'); bindRange('#ts-yaw', 'cameraYaw', '\u00b0'); bindRange('#ts-roll', 'cameraRoll', '\u00b0');
    bindRange('#ts-dist', 'cameraDistance', 'x'); bindRange('#ts-curl', 'paperCurl', '');
    bindChk('#ts-autopan', 'autoPan'); bindChk('#ts-creases', 'foldCreases');
    container.querySelectorAll('.ts-cam-preset').forEach(function (b) {
      b.addEventListener('click', function () { userOrbited = false; updateData({ cameraPitch: +b.dataset.p, cameraYaw: +b.dataset.y, cameraRoll: +b.dataset.r }, true); });
    });
    const camReset = $('#ts-cam-reset'); if (camReset) camReset.addEventListener('click', function () { userOrbited = false; if (tsControls) tsControls.reset(); });

    // environment
    bindSel('#ts-env', 'environment'); bindChk('#ts-bokeh', 'bokeh'); bindChk('#ts-dust', 'dust'); bindChk('#ts-godrays', 'godRays');
    bindRange('#ts-rays', 'godRayIntensity', ''); bindRange('#ts-light', 'lightIntensity', ''); bindColor('#ts-warmth', 'lightWarmth'); bindRange('#ts-vig', 'vignette', '');
    bindRange('#ts-bd-op', 'backdropOpacity', '');
    const bdf = $('#ts-backdrop-file');
    if (bdf) bdf.addEventListener('change', function () {
      if (!bdf.files[0]) return;
      downscaleImage(bdf.files[0], 1600, 'image/jpeg', 0.82, false, function (url) { updateData({ backdropImage: url }, true); });
    });
    const bdc = $('#ts-backdrop-clear'); if (bdc) bdc.addEventListener('click', function () { updateData({ backdropImage: '' }, true); });

    // document
    const dt = $('#ts-doctype');
    if (dt) dt.addEventListener('change', function () {
      const pr = PRESETS[dt.value];
      updateData(Object.assign({ docType: dt.value, paperStock: 'auto' }, deepClone(pr.content)), true);
    });
    bindText('#ts-masthead', 'masthead'); bindText('#ts-badge', 'confidentialBadge'); bindText('#ts-title', 'title'); bindText('#ts-subtitle', 'subtitle');
    bindText('#ts-preamble', 'preamble'); bindText('#ts-body', 'bodyText'); bindSel('#ts-cols', 'columns', true); bindChk('#ts-photo', 'photoBlock'); bindSel('#ts-stock', 'paperStock');
    bindText('#ts-terms-heading', 'termsHeading');

    // terms
    const readTerms = function () { return normalizeConfig(window.tplGetContextualData(tplId)).dealTerms.map(function (t) { return Object.assign({}, t); }); };
    container.querySelectorAll('.ts-term').forEach(function (card) {
      const i = +card.dataset.i;
      const upd = function (patch, rr) { const a = readTerms(); if (a[i]) { Object.assign(a[i], patch); updateData({ dealTerms: a }, rr); } };
      card.querySelector('.ts-t-hl').addEventListener('change', function (e) { upd({ highlighted: e.target.checked }); });
      card.querySelector('.ts-t-col').addEventListener('input', function (e) { upd({ color: e.target.value }); });
      card.querySelector('.ts-t-label').addEventListener('input', function (e) { upd({ label: e.target.value }); });
      card.querySelector('.ts-t-val').addEventListener('input', function (e) { upd({ value: e.target.value }); });
      card.querySelector('.ts-t-del').addEventListener('click', function () { const a = readTerms(); a.splice(i, 1); updateData({ dealTerms: a }, true); });
    });
    $('#ts-term-add').addEventListener('click', function () {
      const a = readTerms(); a.push({ label: 'New Term:', value: 'Value', highlighted: false, color: '#facc15' }); updateData({ dealTerms: a }, true);
    });

    // highlights
    const readHl = function () { return normalizeConfig(window.tplGetContextualData(tplId)).highlights.map(function (h) { return Object.assign({}, h); }); };
    container.querySelectorAll('.ts-hl').forEach(function (card) {
      const i = +card.dataset.i;
      const upd = function (patch) { const a = readHl(); if (a[i]) { Object.assign(a[i], patch); updateData({ highlights: a }); } };
      card.querySelector('.ts-h-on').addEventListener('change', function (e) { upd({ enabled: e.target.checked }); });
      card.querySelector('.ts-h-text').addEventListener('input', function (e) { upd({ text: e.target.value }); });
      card.querySelector('.ts-h-style').addEventListener('change', function (e) { upd({ style: e.target.value }); });
      card.querySelector('.ts-h-col').addEventListener('input', function (e) { upd({ color: e.target.value }); });
      card.querySelector('.ts-h-del').addEventListener('click', function () { const a = readHl(); a.splice(i, 1); updateData({ highlights: a }, true); });
    });
    $('#ts-hl-add').addEventListener('click', function () {
      const a = readHl(); a.push({ text: '', color: '#facc15', style: 'marker', enabled: true }); updateData({ highlights: a }, true);
    });

    // signature layer
    container.querySelectorAll('.ts-sig-mode').forEach(function (b) { b.addEventListener('click', function () { updateData({ sigMode: b.dataset.m }, true); }); });
    bindSel('#ts-sigpreset', 'sigPreset'); bindText('#ts-sigtyped', 'sigTyped'); bindChk('#ts-sigshow', 'sigShow'); bindChk('#ts-sigline', 'sigLine'); bindColor('#ts-sigcol', 'sigColor');
    bindRange('#ts-sigx', 'sigX', ''); bindRange('#ts-sigy', 'sigY', ''); bindRange('#ts-sigscale', 'sigScale', 'x'); bindRange('#ts-sigrot', 'sigRotation', '\u00b0');
    bindRange('#ts-sigstart', 'sigStart', '%'); bindRange('#ts-sigspan', 'sigSpan', '%');
    bindText('#ts-signee', 'signeeName'); bindText('#ts-signee-title', 'signeeTitle'); bindText('#ts-siglabel', 'signatureLabel');
    const sf = $('#ts-sig-file');
    if (sf) sf.addEventListener('change', function () {
      if (!sf.files[0]) return;
      downscaleImage(sf.files[0], 700, 'image/png', 1, $('#ts-sig-ko') ? $('#ts-sig-ko').checked : true, function (url) { updateData({ sigImage: url, sigMode: 'upload' }, true); });
    });
    const pad = $('#ts-sig-pad');
    if (pad) {
      const pctx = pad.getContext('2d');
      let strokes = deepClone(d.sigStrokes || []), cur = null, last = null;
      const paintPad = function () {
        pctx.clearRect(0, 0, pad.width, pad.height);
        pctx.strokeStyle = d.sigColor; pctx.lineCap = 'round'; pctx.lineJoin = 'round';
        strokes.concat(cur ? [cur] : []).forEach(function (s) {
          for (let i = 1; i < s.length; i++) {
            pctx.lineWidth = (s[i].w || 2.6) * 2.2;
            pctx.beginPath(); pctx.moveTo(s[i - 1].x * pad.width, s[i - 1].y * pad.height); pctx.lineTo(s[i].x * pad.width, s[i].y * pad.height); pctx.stroke();
          }
        });
      };
      const pt = function (e) {
        const r = pad.getBoundingClientRect();
        return { x: clamp01((e.clientX - r.left) / r.width), y: clamp01((e.clientY - r.top) / r.height), t: performance.now() };
      };
      pad.addEventListener('pointerdown', function (e) { pad.setPointerCapture(e.pointerId); last = pt(e); cur = [{ x: last.x, y: last.y, w: 3 }]; paintPad(); });
      pad.addEventListener('pointermove', function (e) {
        if (!cur) return;
        const p = pt(e), dist = Math.hypot((p.x - last.x) * pad.width, (p.y - last.y) * pad.height), dtm = Math.max(1, p.t - last.t);
        const w = Math.max(1.4, Math.min(4.4, 4.6 - (dist / dtm) * 1.4));
        cur.push({ x: p.x, y: p.y, w: w }); last = p; paintPad();
      });
      const end = function () {
        if (!cur) return;
        if (cur.length > 1) strokes.push(cur);
        cur = null; paintPad();
        updateData({ sigStrokes: strokes, sigMode: 'draw' });
      };
      pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end);
      $('#ts-sig-clear').addEventListener('click', function () { strokes = []; cur = null; paintPad(); updateData({ sigStrokes: [] }); });
      paintPad();
    }

    // stamps
    [1, 2].forEach(function (n) {
      bindChk('#ts-st' + n + '-on', 'showStamp' + n); bindColor('#ts-st' + n + '-col', 'stamp' + n + 'Color'); bindText('#ts-st' + n + '-text', 'stamp' + n + 'Text');
      bindRange('#ts-st' + n + '-ang', 'stamp' + n + 'Angle', '\u00b0'); bindRange('#ts-st' + n + '-x', 'stamp' + n + 'X', ''); bindRange('#ts-st' + n + '-y', 'stamp' + n + 'Y', '');
    });

    $('#btn-ts-reset').addEventListener('click', function () {
      userOrbited = false;
      updateData(deepClone(DEFAULT_CONFIG), true);
    });
  };

  window.DEAL_TERM_SHEET_CONFIG = DEFAULT_CONFIG;
  window.DEAL_DOC_PRESETS = PRESETS;
  console.log('[Doc-Drama Engine] v3 ready');
})();

window.tplSyncDealTermSheet = syncLive;
