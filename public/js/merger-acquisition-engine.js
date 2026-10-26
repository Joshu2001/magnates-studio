/**
 * Merger & Acquisition — Cinematic Collision Engine
 * ---------------------------------------------------------------------------
 * Two company logos build up, recoil, accelerate, COLLIDE (hit-stop, flash,
 * shockwaves, sparks, shattering shards, pixel dust, chromatic aberration,
 * screen shake), fuse into a swirling plasma core and then a brand-new merged
 * logo is revealed.
 *
 *  - Everything is a PURE FUNCTION OF TIME (seeded RNG, analytic physics) so
 *    scrubbing, looping and frame-exact export always match the preview.
 *  - 2D canvas only (no WebGL dependency), 1920x1080 virtual space, any aspect.
 *  - Logos are generated procedurally (original fictional brands, flat vector
 *    construction) and any of the three slots (A, B, merged C) can be replaced
 *    with an uploaded PNG/SVG, e.g. real company artwork.
 *  - Every phase duration and every VFX layer is individually controllable
 *    from the contextual inspector (see tplBuildMergerAcqInspector).
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'merger-acquisition';
  const VW = 1920, VH = 1080, CX = 960, LCY = 520, FLOOR_Y = 800;
  const LW = 760, LH = 600;           // logical logo layout box
  const SS = 1.5;                     // sprite supersampling
  const TAU = Math.PI * 2;
  const FONT = "'Montserrat','Inter','Segoe UI','Helvetica Neue',Arial,sans-serif";

  // ------------------------------------------------------------------ config
  const DEFAULT_CONFIG = {
    type: TEMPLATE_ID,
    // Brands
    brandA: 'aethon', brandB: 'orbis',
    nameA: '', nameB: '', tagA: '', tagB: '',
    accentA: '', accentB: '', accentC: '',
    logoImgA: '', logoImgB: '', logoImgC: '',
    mergedName: '', mergedTag: '', mergedMode: 'interlock', mergedScale: 1.1,
    logoSize: 300, separation: 1180,
    // Timing (seconds)
    durIntro: 1.6, durAnticipation: 1.4, durApproach: 1.8, durImpact: 1.2,
    durFusion: 1.8, durReveal: 2.0, durHold: 2.2,
    // Motion
    pullBack: 90, approachEase: 'cubic', tilt: 7, trailLength: 10,
    camPush: 0.14, overlap: 0.88, arcIntensity: 1.0,
    // Impact
    flashIntensity: 1.0, flashDecay: 0.34, hitstop: 0.12, shake: 1.0,
    shockRings: 3, shockSize: 1.0, sparkCount: 420, sparkSpeed: 1.0, gravity: 1.0,
    shardGrid: 6, dustDensity: 1.0, aberration: 1.0, anamorphic: true,
    flicker: 1.0, strobes: 2,
    // Fusion & reveal
    coreSize: 1.0, coreSwirl: 1.0, coreColor: '',
    revealStyle: 'bloom', revealFlash: 0.9, overshoot: 1.0, shine: 1.0, rays: 1.0,
    // Look
    bgStyle: 'void', grain: 0.5, vignette: 0.6, letterbox: 0.0, bloom: 1.0, reflection: 0.35,
    // Captions
    showCaptions: true, introText: 'TWO TITANS. ONE FUTURE.', eyebrow: 'MERGER COMPLETE',
    dealValue: '$48.2B', dealTagline: 'COMBINED ENTERPRISE VALUE',
    // Engine
    quality: 'high', seed: 7
  };

  const QUALITY_MUL = { draft: 0.35, high: 1, ultra: 1.7 };

  // --------------------------------------------------------------- utilities
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInCubic = t => t * t * t;
  const easeInQuad = t => t * t;
  const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const easeOutBack = (t, k) => { const c1 = 1.70158 * k, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const EASES = {
    quad: easeInQuad, cubic: easeInCubic,
    quart: t => t * t * t * t,
    expo: t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    sine: t => 1 - Math.cos(t * Math.PI / 2)
  };
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function h1(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function vnoise(x, s) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return lerp(h1(i + s * 17.13), h1(i + 1 + s * 17.13), u) * 2 - 1;
  }
  function hex2rgb(h) {
    h = String(h || '#ffffff').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgba = (h, a) => { const c = hex2rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; };
  function mixHex(a, b, t) {
    const x = hex2rgb(a), y = hex2rgb(b);
    const f = v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
    return '#' + f(lerp(x[0], y[0], t)) + f(lerp(x[1], y[1], t)) + f(lerp(x[2], y[2], t));
  }
  const lighten = (h, t) => mixHex(h, '#ffffff', t);

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
    return c;
  }

  function drawTracked(ctx, text, x, y, size, weight, track, fill, align) {
    text = String(text || '');
    if (!text) return 0;
    ctx.font = weight + ' ' + size + 'px ' + FONT;
    const widths = [...text].map(ch => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + track * (text.length - 1);
    let cx = align === 'left' ? x : align === 'right' ? x - total : x - total / 2;
    ctx.fillStyle = fill; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    [...text].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += widths[i] + track; });
    return total;
  }
  function trackedWidth(ctx, text, size, weight, track) {
    ctx.font = weight + ' ' + size + 'px ' + FONT;
    return [...String(text)].reduce((a, ch) => a + ctx.measureText(ch).width, 0) + track * Math.max(0, String(text).length - 1);
  }

  // ------------------------------------------------------------- brand marks
  // Each mark is built in a 400x400 box. path(ctx, part) appends sub-paths for
  // 'body' (silver) or 'accent' (brand colour) to the current path.
  const BRANDS = {
    aethon: {
      name: 'AETHON', tag: 'MOTORS', accent: '#e11d48', rule: 'evenodd',
      path(c, part) {
        if (part === 'body') {
          c.moveTo(200, 30); c.lineTo(44, 372); c.lineTo(122, 372); c.lineTo(200, 196); c.closePath();
          c.moveTo(200, 30); c.lineTo(356, 372); c.lineTo(278, 372); c.lineTo(200, 196); c.closePath();
        } else {
          c.moveTo(172, 292); c.lineTo(228, 292); c.lineTo(246, 332); c.lineTo(154, 332); c.closePath();
        }
      }
    },
    orbis: {
      name: 'ORBIS', tag: 'AEROSPACE', accent: '#38bdf8', rule: 'evenodd',
      path(c, part) {
        if (part === 'body') {
          const a0 = -58 * Math.PI / 180, a1 = -22 * Math.PI / 180;
          c.arc(200, 200, 170, a1, a0 + TAU, false);
          c.arc(200, 200, 134, a0 + TAU, a1, true);
          c.closePath();
          c.moveTo(96, 300); c.bezierCurveTo(122, 226, 200, 164, 296, 140);
          c.bezierCurveTo(226, 186, 172, 240, 134, 316); c.closePath();
        } else {
          c.moveTo(316 + 26, 102); c.arc(316, 102, 26, 0, TAU);
        }
      }
    },
    nexora: {
      name: 'NEXORA', tag: 'SYSTEMS', accent: '#10b981', rule: 'evenodd',
      path(c, part) {
        const hex = (r) => {
          for (let i = 0; i < 6; i++) {
            const a = (-90 + 60 * i) * Math.PI / 180;
            const x = 200 + r * Math.cos(a), y = 200 + r * Math.sin(a);
            if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
          }
          c.closePath();
        };
        if (part === 'body') { hex(182); hex(146); }
        else {
          c.moveTo(128, 272); c.lineTo(128, 128); c.lineTo(160, 128); c.lineTo(240, 216); c.lineTo(240, 128);
          c.lineTo(272, 128); c.lineTo(272, 272); c.lineTo(240, 272); c.lineTo(160, 184); c.lineTo(160, 272); c.closePath();
        }
      }
    },
    valkyr: {
      name: 'VALKYR', tag: 'DYNAMICS', accent: '#f59e0b', rule: 'evenodd',
      path(c, part) {
        if (part === 'body') {
          c.moveTo(36, 100); c.lineTo(104, 100); c.lineTo(200, 252); c.lineTo(296, 100); c.lineTo(364, 100);
          c.lineTo(200, 372); c.closePath();
        } else {
          c.moveTo(128, 100); c.lineTo(172, 100); c.lineTo(200, 152); c.lineTo(228, 100); c.lineTo(272, 100);
          c.lineTo(200, 222); c.closePath();
        }
      }
    },
    solace: {
      name: 'SOLACE', tag: 'ENERGY', accent: '#fb923c', rule: 'evenodd',
      path(c, part) {
        if (part === 'body') {
          c.moveTo(80, 250); c.arc(200, 250, 120, Math.PI, TAU); c.closePath();
          c.rect(50, 278, 300, 24);
        } else {
          for (let i = 0; i < 7; i++) {
            const th = Math.PI + (i + 0.5) * Math.PI / 7;
            const ca = Math.cos(th), sa = Math.sin(th);
            const nx = -sa, ny = ca;
            const r0 = 148, r1 = 200, w0 = 8, w1 = 14;
            c.moveTo(200 + ca * r0 + nx * w0, 250 + sa * r0 + ny * w0);
            c.lineTo(200 + ca * r1 + nx * w1, 250 + sa * r1 + ny * w1);
            c.lineTo(200 + ca * r1 - nx * w1, 250 + sa * r1 - ny * w1);
            c.lineTo(200 + ca * r0 - nx * w0, 250 + sa * r0 - ny * w0);
            c.closePath();
          }
        }
      }
    },
    kairos: {
      name: 'KAIROS', tag: 'CAPITAL', accent: '#a78bfa', rule: 'nonzero',
      path(c, part) {
        if (part === 'body') {
          [150, 250].forEach(cx => {
            c.moveTo(cx + 110, 200); c.arc(cx, 200, 110, 0, TAU, false);
            c.moveTo(cx + 78, 200); c.arc(cx, 200, 78, 0, TAU, true);
          });
        } else {
          c.moveTo(222, 200); c.arc(200, 200, 22, 0, TAU);
        }
      }
    }
  };
  const BRAND_IDS = Object.keys(BRANDS);

  function markPaint(ctx, accent) {
    const body = ctx.createLinearGradient(0, 30, 0, 380);
    body.addColorStop(0, '#ffffff'); body.addColorStop(1, '#aeb6c4');
    const acc = ctx.createLinearGradient(0, 30, 0, 380);
    acc.addColorStop(0, lighten(accent, 0.38)); acc.addColorStop(1, accent);
    return { body: body, accent: acc };
  }
  function drawMark(ctx, brand, cx, cy, size, accent, knock) {
    const k = size / 400;
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-200, -200);
    if (knock) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); brand.path(ctx, 'body'); brand.path(ctx, 'accent');
      ctx.lineWidth = knock / k; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();
    }
    const paint = markPaint(ctx, accent);
    ['body', 'accent'].forEach(part => {
      ctx.beginPath(); brand.path(ctx, part);
      ctx.fillStyle = paint[part]; ctx.fill(brand.rule || 'evenodd');
    });
    ctx.restore();
  }
  function drawWordmark(ctx, name, tag, accent, maxW) {
    let size = 88;
    const track = 0.2;
    while (size > 36 && trackedWidth(ctx, name, size, 800, size * track) > maxW) size -= 2;
    drawTracked(ctx, name, LW / 2, 500, size, 800, size * track, '#f4f6fa', 'center');
    if (tag) {
      const ts = Math.max(22, Math.round(size * 0.36));
      drawTracked(ctx, tag, LW / 2, 500 + ts * 1.7, ts, 600, ts * 0.55, lighten(accent, 0.15), 'center');
    }
  }

  // ----------------------------------------------------------- image support
  const imgCache = new Map();
  let invalidateHook = null;
  function getImage(url) {
    if (!url) return null;
    let e = imgCache.get(url);
    if (!e) {
      e = { img: new Image(), ready: false };
      e.img.onload = () => { e.ready = true; spriteCache.clear(); if (invalidateHook) invalidateHook(); };
      e.img.onerror = () => { e.failed = true; };
      e.img.src = url;
      imgCache.set(url, e);
    }
    return e;
  }

  // ---------------------------------------------------------------- sprites
  const spriteCache = new Map();
  let particleCache = null;

  function resolveSide(cfg, side) {
    const id = cfg['brand' + side] in BRANDS ? cfg['brand' + side] : (side === 'A' ? 'aethon' : 'orbis');
    const b = BRANDS[id];
    return {
      id: id,
      name: cfg['name' + side] || b.name,
      tag: (cfg['tag' + side] !== undefined && cfg['tag' + side] !== '') ? cfg['tag' + side] : b.tag,
      accent: cfg['accent' + side] || b.accent,
      img: cfg['logoImg' + side] || ''
    };
  }
  function resolveMerged(cfg) {
    const A = resolveSide(cfg, 'A'), B = resolveSide(cfg, 'B');
    const accent = cfg.accentC || mixHex(A.accent, B.accent, 0.5);
    return {
      A: A, B: B, accent: accent,
      name: cfg.mergedName || (A.name + ' ' + B.name),
      tag: cfg.mergedTag || (BRANDS[A.id].tag + '  \u00D7  ' + BRANDS[B.id].tag),
      mode: cfg.mergedMode, img: cfg.logoImgC || ''
    };
  }

  function buildSprite(spec) {
    const c = makeCanvas(LW * SS, LH * SS);
    const g = c.getContext('2d');
    g.scale(SS, SS);
    if (spec.img) {
      const e = getImage(spec.img);
      if (e && e.ready) {
        const iw = e.img.naturalWidth || 1, ih = e.img.naturalHeight || 1;
        const s = Math.min(700 / iw, 520 / ih);
        g.drawImage(e.img, LW / 2 - iw * s / 2, LH / 2 - ih * s / 2, iw * s, ih * s);
      }
    } else if (spec.kind === 'merged') {
      const M = spec.m, bA = BRANDS[M.A.id], bB = BRANDS[M.B.id];
      if (M.mode === 'split') {
        const mk = (brand, accent, left) => {
          g.save();
          g.beginPath();
          if (left) { g.moveTo(0, 0); g.lineTo(LW / 2 + 36, 0); g.lineTo(LW / 2 - 36, 440); g.lineTo(0, 440); }
          else { g.moveTo(LW, 0); g.lineTo(LW / 2 + 36, 0); g.lineTo(LW / 2 - 36, 440); g.lineTo(LW, 440); }
          g.closePath(); g.clip();
          drawMark(g, brand, LW / 2, 220, 400, accent, 0);
          g.restore();
        };
        mk(bA, M.A.accent, true); mk(bB, M.B.accent, false);
        g.save(); g.globalCompositeOperation = 'lighter';
        const sg = g.createLinearGradient(0, 0, 0, 440);
        sg.addColorStop(0, rgba(M.accent, 0)); sg.addColorStop(0.5, rgba('#ffffff', 0.9)); sg.addColorStop(1, rgba(M.accent, 0));
        g.strokeStyle = sg; g.lineWidth = 3;
        g.beginPath(); g.moveTo(LW / 2 + 36, 0); g.lineTo(LW / 2 - 36, 440); g.stroke(); g.restore();
      } else {
        drawMark(g, bB, LW / 2 + 82, 222, 330, M.B.accent, 0);
        drawMark(g, bA, LW / 2 - 82, 222, 330, M.A.accent, 22);
      }
      drawWordmark(g, M.name, M.tag, M.accent, 700);
    } else {
      const s = spec.side, b = BRANDS[s.id];
      drawMark(g, b, LW / 2, 220, 400, s.accent, 0);
      drawWordmark(g, s.name, s.tag, s.accent, 680);
    }
    let data = null;
    try { data = g.getImageData(0, 0, c.width, c.height).data; } catch (err) { data = null; }
    return { canvas: c, data: data, glow: null, accent: spec.accent };
  }

  function makeGlow(sp, color) {
    const pad = 80;
    const gw = Math.round((LW + pad * 2) / 2), gh = Math.round((LH + pad * 2) / 2);
    const c = makeCanvas(gw, gh), g = c.getContext('2d');
    if ('filter' in g) {
      g.filter = 'blur(7px)';
      g.drawImage(sp.canvas, pad / 2, pad / 2, LW / 2, LH / 2);
      g.drawImage(sp.canvas, pad / 2, pad / 2, LW / 2, LH / 2);
      g.filter = 'none';
    } else {
      g.shadowColor = color; g.shadowBlur = 16; g.shadowOffsetX = gw;
      g.drawImage(sp.canvas, pad / 2 - gw, pad / 2, LW / 2, LH / 2);
    }
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = color; g.fillRect(0, 0, gw, gh);
    return c;
  }

  function getSprites(cfg) {
    const A = resolveSide(cfg, 'A'), B = resolveSide(cfg, 'B'), M = resolveMerged(cfg);
    const rd = u => { const e = u ? getImage(u) : null; return e && e.ready ? 1 : 0; };
    const key = JSON.stringify([A, B, M, rd(A.img), rd(B.img), rd(M.img)]);
    let hit = spriteCache.get(key);
    if (hit) return hit;
    if (spriteCache.size > 6) spriteCache.clear();
    const sa = buildSprite({ kind: 'brand', side: A, img: A.img, accent: A.accent });
    const sb = buildSprite({ kind: 'brand', side: B, img: B.img, accent: B.accent });
    const useC = M.mode === 'custom' && M.img;
    const sc = buildSprite({ kind: 'merged', m: M, img: useC ? M.img : '', accent: M.accent });
    sa.glow = makeGlow(sa, A.accent); sb.glow = makeGlow(sb, B.accent); sc.glow = makeGlow(sc, M.accent);
    hit = { A: sa, B: sb, C: sc, accA: A.accent, accB: B.accent, accC: M.accent, key: key };
    spriteCache.set(key, hit);
    return hit;
  }

  // ---------------------------------------------------------------- timeline
  function timeline(c) {
    const d = k => Math.max(0.1, +c[k] || 0.1);
    const tAnt = d('durIntro'), tApp = tAnt + d('durAnticipation'), tImp = tApp + d('durApproach');
    const tFus = tImp + d('durImpact'), tRev = tFus + d('durFusion'), tHold = tRev + d('durReveal');
    return {
      tAnt: tAnt, tApp: tApp, tImp: tImp, tFus: tFus, tRev: tRev, tHold: tHold, T: tHold + d('durHold'),
      durFus: d('durFusion'), durRev: d('durReveal'), durApp: d('durApproach'), durAnt: d('durAnticipation'), durIntro: tAnt
    };
  }
  function phaseName(t, tl) {
    return t < tl.tAnt ? 'INTRO' : t < tl.tApp ? 'ANTICIPATION' : t < tl.tImp ? 'APPROACH'
      : t < tl.tFus ? 'IMPACT' : t < tl.tRev ? 'FUSION' : t < tl.tHold ? 'REVEAL' : 'HOLD';
  }

  // ------------------------------------------------------------ logo motion
  function geom(cfg) {
    const sc = cfg.logoSize / 400;
    return { sc: sc, contactHalf: LW * sc * 0.5 * cfg.overlap, baseHalf: cfg.separation / 2 };
  }
  function logoState(side, t, tl, cfg, g) {
    // side: -1 (A, left) / +1 (B, right)
    let off, rot = 0, s = 1, alpha = 1, y = LCY;
    const easeIn = EASES[cfg.approachEase] || EASES.cubic;
    if (t < tl.tAnt) {
      const u = clamp(t / tl.durIntro), e = easeOutCubic(u);
      off = g.baseHalf + (1 - e) * 240; s = 0.92 + 0.08 * e; alpha = smooth(0, 0.55, u);
    } else if (t < tl.tApp) {
      const u = clamp((t - tl.tAnt) / tl.durAnt);
      off = g.baseHalf + cfg.pullBack * easeInOutSine(u);
      s = 1 - 0.03 * smooth(0, 1, u);
      off += Math.sin(t * 95 + side) * 2.2 * u * u;
    } else {
      const u = clamp((t - tl.tApp) / tl.durApp), p = easeIn(u);
      off = lerp(g.baseHalf + cfg.pullBack, g.contactHalf, p);
      rot = -side * (cfg.tilt * Math.PI / 180) * easeInQuad(u);
      s = 0.97 + 0.15 * p;
    }
    if (t < tl.tApp) {
      const calm = t < tl.tAnt ? 1 : 1 - smooth(0, 1, (t - tl.tAnt) / tl.durAnt) * 0.6;
      y += Math.sin(t * 1.7 + (side > 0 ? 1.9 : 0)) * 6 * calm;
    }
    return { x: CX + side * off, y: y, rot: rot, s: s, alpha: alpha };
  }

  // ---------------------------------------------------------- particle sims
  function sampleSprite(sp, step, maxN, rng) {
    const out = [];
    if (!sp.data) return out;
    const w = sp.canvas.width, h = sp.canvas.height;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const px = Math.min(w - 1, Math.max(0, Math.round(x + (rng() - 0.5) * step * 0.8)));
        const py = Math.min(h - 1, Math.max(0, Math.round(y + (rng() - 0.5) * step * 0.8)));
        const i = (py * w + px) * 4;
        if (sp.data[i + 3] > 140) out.push({ x: px / SS - LW / 2, y: py / SS - LH / 2, r: sp.data[i], g: sp.data[i + 1], b: sp.data[i + 2] });
      }
    }
    while (out.length > maxN) out.splice(Math.floor(rng() * out.length), 1);
    return out;
  }
  function alphaAt(sp, lx, ly) {
    if (!sp.data) return 1;
    const px = Math.round((lx + LW / 2) * SS), py = Math.round((ly + LH / 2) * SS);
    if (px < 0 || py < 0 || px >= sp.canvas.width || py >= sp.canvas.height) return 0;
    return sp.data[(py * sp.canvas.width + px) * 4 + 3];
  }

  function buildShards(sp, cols, rng) {
    const pts = sampleSprite(sp, 10, 5000, rng);
    if (!pts.length) return [];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(p => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); });
    const bw = x1 - x0, bh = y1 - y0, cw = bw / cols, rows = Math.max(3, Math.round(bh / cw));
    const ch = bh / rows;
    const grid = [];
    for (let j = 0; j <= rows; j++) {
      grid[j] = [];
      for (let i = 0; i <= cols; i++) {
        const edge = i === 0 || j === 0 || i === cols || j === rows;
        grid[j][i] = [x0 + i * cw + (edge ? 0 : (rng() - 0.5) * cw * 0.6), y0 + j * ch + (edge ? 0 : (rng() - 0.5) * ch * 0.6)];
      }
    }
    const shards = [];
    const add = (a, b, c) => {
      const cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3;
      const hit = alphaAt(sp, cx, cy) > 30 || alphaAt(sp, a[0] * 0.5 + cx * 0.5, a[1] * 0.5 + cy * 0.5) > 30 ||
        alphaAt(sp, b[0] * 0.5 + cx * 0.5, b[1] * 0.5 + cy * 0.5) > 30 || alphaAt(sp, c[0] * 0.5 + cx * 0.5, c[1] * 0.5 + cy * 0.5) > 30;
      if (!hit) return;
      const v = [[a[0] - cx, a[1] - cy], [b[0] - cx, b[1] - cy], [c[0] - cx, c[1] - cy]];
      const bx0 = Math.min(v[0][0], v[1][0], v[2][0]), bx1 = Math.max(v[0][0], v[1][0], v[2][0]);
      const by0 = Math.min(v[0][1], v[1][1], v[2][1]), by1 = Math.max(v[0][1], v[1][1], v[2][1]);
      shards.push({
        cx: cx, cy: cy, v: v, bx: bx0, by: by0, bw: bx1 - bx0, bh: by1 - by0,
        spd: 160 + rng() * 780, up: 40 + rng() * 380, om: (rng() - 0.5) * 12, jit: rng() * TAU, delay: rng() * 0.45
      });
    };
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const p00 = grid[j][i], p10 = grid[j][i + 1], p01 = grid[j + 1][i], p11 = grid[j + 1][i + 1];
        if (rng() < 0.5) { add(p00, p10, p11); add(p00, p11, p01); }
        else { add(p00, p10, p01); add(p10, p11, p01); }
      }
    }
    return shards;
  }

  function getParticles(cfg, sprites) {
    const q = QUALITY_MUL[cfg.quality] || 1;
    const key = [sprites.key, cfg.seed, cfg.sparkCount, cfg.dustDensity, cfg.shardGrid, cfg.quality].join('|');
    if (particleCache && particleCache.key === key) return particleCache;
    const rng = mulberry32((cfg.seed | 0) * 9973 + 17);
    const step = Math.max(5, Math.round(9 / Math.max(0.2, cfg.dustDensity * Math.sqrt(q))));
    const maxD = Math.round(3400 * q);
    const mk = (pts, ox) => pts.map(p => ({
      x: p.x, y: p.y, r: p.r, g: p.g, b: p.b,
      spd: 40 + Math.pow(rng(), 1.6) * 1100, jit: (rng() - 0.5) * 1.4, size: 2 + rng() * 3.2, delay: rng() * 0.5,
      up: rng() * 220
    }));
    const P = { key: key };
    P.dustA = mk(sampleSprite(sprites.A, step, maxD, rng));
    P.dustB = mk(sampleSprite(sprites.B, step, maxD, rng));
    P.assemble = sampleSprite(sprites.C, Math.round(step * 1.25), Math.round(2600 * q), rng).map(p => ({
      x: p.x, y: p.y, r: p.r, g: p.g, b: p.b, size: 2 + rng() * 2.6, delay: rng() * 0.45,
      sa: rng() * TAU, sr: 60 + rng() * 460
    }));
    P.shardsA = buildShards(sprites.A, Math.max(3, cfg.shardGrid | 0), rng);
    P.shardsB = buildShards(sprites.B, Math.max(3, cfg.shardGrid | 0), rng);
    const nS = Math.round(cfg.sparkCount * q);
    P.sparks = [];
    for (let i = 0; i < nS; i++) {
      P.sparks.push({
        ang: rng() * TAU, spd: 260 + Math.pow(rng(), 2.2) * 2300, life: 0.55 + rng() * 1.4,
        w: 1 + rng() * 2.6, oy: (rng() - 0.5) * 340, ox: (rng() - 0.5) * 70, up: rng() * 160
      });
    }
    P.sparks2 = [];
    for (let i = 0; i < Math.round(nS * 0.38); i++) {
      P.sparks2.push({ ang: rng() * TAU, spd: 240 + Math.pow(rng(), 1.8) * 1500, life: 0.7 + rng() * 1.4, w: 0.8 + rng() * 2 });
    }
    P.stars = [];
    for (let i = 0; i < Math.round(70 * Math.sqrt(q)); i++) {
      const a = rng() * TAU, r = 120 + Math.pow(rng(), 0.7) * 620;
      P.stars.push({ x: CX + Math.cos(a) * r * 1.35, y: LCY + Math.sin(a) * r * 0.75, size: 10 + rng() * 26, period: 0.9 + rng() * 1.8, t0: rng() * 3, rot: rng() * 0.6 });
    }
    P.motes = [];
    for (let i = 0; i < Math.round(80 * Math.sqrt(q)); i++) {
      P.motes.push({ x: rng() * VW, y: rng() * VH, z: 0.25 + rng() * 0.75, vx: (rng() - 0.5) * 18, vy: -6 - rng() * 14, s: 0.8 + rng() * 2 });
    }
    P.rays = [];
    for (let i = 0; i < 26; i++) P.rays.push({ a: rng() * TAU, len: 0.5 + rng() * 0.5, w: 0.004 + Math.pow(rng(), 2) * 0.022 });
    particleCache = P;
    return P;
  }

  // ----------------------------------------------------------------- bolts
  function bolt(ctx, x0, y0, x1, y1, seed, jag, depth) {
    const pts = [[x0, y0], [x1, y1]];
    for (let d = 0; d < depth; d++) {
      const next = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const n = h1(seed + d * 31.7 + i * 7.3) * 2 - 1;
        const nx = -(b[1] - a[1]) / (len || 1), ny = (b[0] - a[0]) / (len || 1);
        next.push([mx + nx * n * len * jag, my + ny * n * len * jag], b);
      }
      pts.length = 0; next.forEach(p => pts.push(p));
    }
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }

  // ------------------------------------------------------------ shared buffers
  const buffers = { scene: null, tmpA: null, tmpB: null, sheen: null, refl: null, grain: null };
  function bufferFor(name, w, h) {
    let b = buffers[name];
    if (!b || b.width !== w || b.height !== h) { b = makeCanvas(w, h); buffers[name] = b; }
    return b;
  }
  function grainPattern(ctx) {
    if (!buffers.grain) {
      const c = makeCanvas(256, 256), g = c.getContext('2d'), id = g.createImageData(256, 256);
      const r = mulberry32(99);
      for (let i = 0; i < id.data.length; i += 4) { const v = 90 + r() * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      g.putImageData(id, 0, 0);
      buffers.grain = c;
    }
    return ctx.createPattern(buffers.grain, 'repeat');
  }

  // -------------------------------------------------------------- draw bits
  function glowDot(ctx, x, y, r, color, a) {
    if (r <= 0 || a <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, a)); g.addColorStop(0.35, rgba(color, a * 0.4)); g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function drawSprite(ctx, sp, L, sc, alpha, comp) {
    ctx.save();
    ctx.globalAlpha = clamp(alpha * (L.alpha === undefined ? 1 : L.alpha));
    if (comp) ctx.globalCompositeOperation = comp;
    ctx.translate(L.x, L.y); ctx.rotate(L.rot); ctx.scale(sc * L.s, sc * L.s);
    ctx.drawImage(sp.canvas, -LW / 2, -LH / 2, LW, LH);
    ctx.restore();
  }
  function drawGlow(ctx, sp, L, sc, alpha, grow) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(alpha);
    ctx.translate(L.x, L.y); ctx.rotate(L.rot); ctx.scale(sc * L.s * (grow || 1), sc * L.s * (grow || 1));
    ctx.drawImage(sp.glow, -LW / 2 - 80, -LH / 2 - 80, LW + 160, LH + 160);
    ctx.restore();
  }
  function drawSheen(ctx, sp, L, sc, p, strength) {
    if (strength <= 0.01 || p < -0.4 || p > 1.4) return;
    const w = sp.canvas.width, h = sp.canvas.height;
    const tmp = bufferFor('sheen', w, h), g = tmp.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h);
    g.drawImage(sp.canvas, 0, 0);
    g.globalCompositeOperation = 'source-in';
    const cx = p * (w + h * 0.4) - h * 0.2, bandW = w * 0.16;
    const grd = g.createLinearGradient(cx - bandW, 0, cx + bandW, h * 0.4);
    grd.addColorStop(0, 'rgba(255,255,255,0)'); grd.addColorStop(0.5, 'rgba(255,255,255,' + clamp(0.95 * strength) + ')'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(L.alpha === undefined ? 1 : L.alpha);
    ctx.translate(L.x, L.y); ctx.rotate(L.rot); ctx.scale(sc * L.s, sc * L.s);
    ctx.drawImage(tmp, -LW / 2, -LH / 2, LW, LH);
    ctx.restore();
  }
  function drawReflection(ctx, sp, L, sc, strength) {
    if (strength <= 0.01) return;
    const w = sp.canvas.width, h = sp.canvas.height;
    const tmp = bufferFor('refl', w, h), g = tmp.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h);
    g.drawImage(sp.canvas, 0, 0);
    g.globalCompositeOperation = 'destination-in';
    const grd = g.createLinearGradient(0, h, 0, h * 0.8);
    grd.addColorStop(0, 'rgba(0,0,0,1)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = clamp(strength * (L.alpha === undefined ? 1 : L.alpha));
    ctx.beginPath(); ctx.rect(0, FLOOR_Y, VW, VH - FLOOR_Y); ctx.clip();
    ctx.translate(L.x, 2 * FLOOR_Y - L.y); ctx.scale(sc * L.s, -sc * L.s);
    ctx.drawImage(tmp, -LW / 2, -LH / 2, LW, LH);
    ctx.restore();
  }

  function drawStar(ctx, x, y, size, rot, a, color) {
    if (a <= 0.01) return;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot);
    glowDot(ctx, 0, 0, size * 1.1, color, a * 0.55);
    ctx.fillStyle = rgba('#ffffff', clamp(a));
    for (let i = 0; i < 2; i++) {
      ctx.rotate(Math.PI / 2 * i);
      ctx.beginPath();
      ctx.moveTo(-size, 0); ctx.quadraticCurveTo(0, -size * 0.06, size, 0); ctx.quadraticCurveTo(0, size * 0.06, -size, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the scene
  function drawBackground(b, cw, ch, cfg) {
    const styles = {
      void: ['#0d1224', '#05070f', '#010208'],
      steel: ['#16213a', '#0a101d', '#030509'],
      ember: ['#2a1410', '#120907', '#030101'],
      studio: ['#262a33', '#12141a', '#050608']
    };
    const st = styles[cfg.bgStyle] || styles.void;
    const g = b.createRadialGradient(cw / 2, ch * 0.46, 0, cw / 2, ch * 0.5, Math.hypot(cw, ch) * 0.62);
    g.addColorStop(0, st[0]); g.addColorStop(0.55, st[1]); g.addColorStop(1, st[2]);
    b.fillStyle = g; b.fillRect(0, 0, cw, ch);
  }

  function drawScene(b, t, cfg, sim, cw, ch) {
    const { tl, sp, P, g } = sim;
    const sc = g.sc;
    const colA = sp.accA, colB = sp.accB, colC = sp.accC;
    const colCore = cfg.coreColor || lighten(mixHex(colA, colB, 0.5), 0.25);
    const tauI = t - tl.tImp;                       // real time since impact
    const tauM = Math.max(0, tauI - cfg.hitstop);   // motion time (hit-stop frozen)
    const appU = clamp((t - tl.tApp) / tl.durApp);
    const antU = clamp((t - tl.tAnt) / tl.durAnt);
    const revU = clamp((t - tl.tRev) / tl.durRev);
    const fusF = (t - tl.tFus) / tl.durFus;

    b.setTransform(1, 0, 0, 1, 0, 0);
    b.globalCompositeOperation = 'source-over'; b.globalAlpha = 1;
    drawBackground(b, cw, ch, cfg);

    // ---- camera
    const s = Math.min(cw / VW, ch / VH);
    const ox = (cw - VW * s) / 2, oy = (ch - VH * s) / 2;
    const rumble = cfg.shake * (1.2 * antU + 5 * appU * appU);
    const impactShake = tauI >= 0 ? cfg.shake * 34 * Math.exp(-tauI * 4.5) : 0;
    const revShake = t >= tl.tRev ? cfg.shake * 10 * Math.exp(-(t - tl.tRev) * 7) : 0;
    const amp = rumble + impactShake + revShake;
    const shx = amp * vnoise(t * 38, 1), shy = amp * vnoise(t * 38, 2), roll = amp * 0.0006 * vnoise(t * 30, 3);
    let zoom = 1 + 0.03 * (t / tl.T) + cfg.camPush * Math.pow(appU, 3) * (tauI < 0 ? 1 : Math.exp(-tauI * 2.2));
    if (tauI >= 0) zoom += 0.06 * Math.exp(-tauI * 10);
    if (t >= tl.tRev) zoom -= 0.035 * easeOutCubic(revU);
    b.setTransform(s, 0, 0, s, ox, oy);
    b.save();
    b.translate(CX, VH / 2); b.rotate(roll); b.scale(zoom, zoom); b.translate(-CX + shx, -VH / 2 + shy);

    // floor + horizon
    const fl = b.createLinearGradient(0, FLOOR_Y - 60, 0, VH);
    fl.addColorStop(0, 'rgba(255,255,255,0)'); fl.addColorStop(0.08, 'rgba(255,255,255,0.05)'); fl.addColorStop(1, 'rgba(0,0,0,0.5)');
    b.fillStyle = fl; b.fillRect(-VW, FLOOR_Y - 60, VW * 3, VH);
    const hz = b.createLinearGradient(0, 0, VW, 0);
    hz.addColorStop(0, 'rgba(255,255,255,0)'); hz.addColorStop(0.5, 'rgba(255,255,255,0.22)'); hz.addColorStop(1, 'rgba(255,255,255,0)');
    b.fillStyle = hz; b.fillRect(-300, FLOOR_Y - 1, VW + 600, 1.6);

    // floating motes
    b.save(); b.globalCompositeOperation = 'lighter';
    P.motes.forEach(m => {
      const x = ((m.x + t * m.vx * m.z) % VW + VW) % VW, y = ((m.y + t * m.vy * m.z) % VH + VH) % VH;
      b.fillStyle = 'rgba(190,210,255,' + (0.1 + 0.28 * m.z) + ')';
      b.fillRect(x, y, m.s * m.z, m.s * m.z);
    });
    b.restore();

    // ambient accent glow behind each side
    const charge = t < tl.tImp ? clamp(0.25 + 0.75 * (antU * 0.5 + appU * 0.5 + (t >= tl.tApp ? 0.5 : 0))) : 0;
    const L_A = logoState(-1, Math.min(t, tl.tImp), tl, cfg, g), L_B = logoState(1, Math.min(t, tl.tImp), tl, cfg, g);
    if (t < tl.tImp) {
      b.save(); b.globalCompositeOperation = 'lighter';
      const ia = smooth(0, tl.tAnt, t) * (0.12 + 0.22 * charge) * cfg.bloom;
      glowDot(b, L_A.x, L_A.y, 520, colA, ia); glowDot(b, L_B.x, L_B.y, 520, colB, ia);
      b.restore();
    }

    // ---- pre-impact: reflections, arcs, trails, logos
    if (t < tl.tImp) {
      const refl = cfg.reflection * (1 - smooth(0, 1, appU * 1.4));
      drawReflection(b, sp.A, L_A, sc, refl); drawReflection(b, sp.B, L_B, sc, refl);

      // electric arcs between the facing edges
      const arcI = cfg.arcIntensity * smooth(0.05, 0.9, antU * 0.6 + appU * 0.9 + (t >= tl.tApp ? 0.4 : 0));
      if (arcI > 0.02 && t >= tl.tAnt * 0.8) {
        const qs = Math.floor(t * 18);
        const aEdge = L_A.x + LW * sc * L_A.s * 0.5 * 0.82, bEdge = L_B.x - LW * sc * L_B.s * 0.5 * 0.82;
        b.save(); b.globalCompositeOperation = 'lighter'; b.lineCap = 'round'; b.lineJoin = 'round';
        const nb = 2 + Math.round(2 * arcI);
        for (let i = 0; i < nb; i++) {
          const yy0 = LCY + (h1(qs * 3 + i) - 0.5) * 220, yy1 = LCY + (h1(qs * 5 + i + 9) - 0.5) * 220;
          const vis = h1(qs * 7 + i * 3) < 0.35 + 0.6 * arcI;
          if (!vis) continue;
          b.strokeStyle = rgba(mixHex(colA, colB, i / Math.max(1, nb - 1)), 0.35 * arcI); b.lineWidth = 9;
          bolt(b, aEdge, yy0, bEdge, yy1, qs * 13 + i * 5, 0.13, 5);
          b.strokeStyle = rgba('#ffffff', 0.9 * arcI); b.lineWidth = 2.2;
          bolt(b, aEdge, yy0, bEdge, yy1, qs * 13 + i * 5, 0.13, 5);
        }
        b.restore();
      }

      // speed trails
      const trailN = Math.round(cfg.trailLength);
      if (t >= tl.tApp && trailN > 0) {
        for (let k = trailN; k >= 1; k--) {
          const tk = t - k * 0.018;
          if (tk < tl.tApp) continue;
          const a = (1 - k / (trailN + 1)) * 0.22 * smooth(0, 0.7, appU);
          drawGlow(b, sp.A, logoState(-1, tk, tl, cfg, g), sc, a * 1.2 * cfg.bloom);
          drawGlow(b, sp.B, logoState(1, tk, tl, cfg, g), sc, a * 1.2 * cfg.bloom);
          drawSprite(b, sp.A, logoState(-1, tk, tl, cfg, g), sc, a * 0.7, 'lighter');
          drawSprite(b, sp.B, logoState(1, tk, tl, cfg, g), sc, a * 0.7, 'lighter');
        }
      }

      // rim glow + logos
      const rim = (0.15 + 0.85 * charge) * cfg.bloom * (0.85 + 0.15 * Math.sin(t * 9));
      drawGlow(b, sp.A, L_A, sc, rim * 0.9, 1.0); drawGlow(b, sp.B, L_B, sc, rim * 0.9, 1.0);
      drawSprite(b, sp.A, L_A, sc, 1); drawSprite(b, sp.B, L_B, sc, 1);
      // intro sheen
      const sh = clamp((t - tl.tAnt * 0.45) / (tl.tAnt * 0.55 + 0.4));
      drawSheen(b, sp.A, L_A, sc, sh, 0.8 * cfg.shine); drawSheen(b, sp.B, L_B, sc, sh, 0.8 * cfg.shine);
    }

    // ---- post-impact: shards, dust, sparks
    const Limp = {
      A: logoState(-1, tl.tImp - 1e-4, tl, cfg, g),
      B: logoState(1, tl.tImp - 1e-4, tl, cfg, g)
    };
    const coreX = CX, coreY = LCY;
    const G = 560 * cfg.gravity, K = 1.7;
    const pullDur = tl.durFus * 0.55;

    function freeState(delayT, spd, vdirX, vdirY, up, ox, oy) {
      // Analytic ballistic position (drag + gravity) at motion time, stopped at pull start
      const tp = tl.tFus + delayT;
      const tf = Math.max(0, Math.min(t, tp) - tl.tImp - cfg.hitstop);
      const e = (1 - Math.exp(-K * tf)) / K;
      return [ox + vdirX * spd * e, oy + (vdirY * spd - up) * e + 0.5 * G * tf * tf, tp];
    }
    function pulled(px, py, tp, swirl) {
      const sp_ = clamp((t - tp) / pullDur);
      if (sp_ <= 0) return [px, py, 0];
      const e = sp_ * sp_;
      const rx = px - coreX, ry = py - coreY, ang = e * swirl * 2.6, k = 1 - e;
      const c = Math.cos(ang), s2 = Math.sin(ang);
      return [coreX + (rx * c - ry * s2) * k, coreY + (rx * s2 + ry * c) * k, sp_];
    }

    if (t >= tl.tImp - 0.0001) {
      const doShards = (shards, L, spr) => {
        const cs = Math.cos(L.rot), sn = Math.sin(L.rot);
        shards.forEach(sh => {
          const wx0 = L.x + (sh.cx * cs - sh.cy * sn) * sc * L.s, wy0 = L.y + (sh.cx * sn + sh.cy * cs) * sc * L.s;
          let dx = wx0 - coreX, dy = wy0 - coreY; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
          const jx = Math.cos(sh.jit) * 0.35, jy = Math.sin(sh.jit) * 0.35;
          const nx = dx + jx, ny = dy + jy, nl = Math.hypot(nx, ny) || 1;
          const [fx, fy, tp] = freeState(sh.delay, sh.spd * cfg.sparkSpeed, nx / nl, ny / nl, sh.up, wx0, wy0);
          const [px, py, pr] = pulled(fx, fy, tp, cfg.coreSwirl);
          if (pr >= 1) return;
          const tmot = Math.max(0, Math.min(t, tp) - tl.tImp - cfg.hitstop);
          const ang = L.rot + sh.om * (1 - Math.exp(-1.5 * tmot)) / 1.5;
          const scl = sc * L.s * (1 - 0.25 * smooth(0, 1.8, tmot)) * (1 - pr * pr * 0.85);
          b.save();
          b.globalAlpha = clamp(1 - pr * pr);
          b.translate(px, py); b.rotate(ang); b.scale(scl, scl);
          b.beginPath(); b.moveTo(sh.v[0][0], sh.v[0][1]); b.lineTo(sh.v[1][0], sh.v[1][1]); b.lineTo(sh.v[2][0], sh.v[2][1]); b.closePath();
          b.save(); b.clip();
          b.drawImage(spr.canvas, (sh.cx + LW / 2 + sh.bx) * SS, (sh.cy + LH / 2 + sh.by) * SS, sh.bw * SS, sh.bh * SS, sh.bx, sh.by, sh.bw, sh.bh);
          b.restore();
          const heat = Math.exp(-tmot * 2.2);
          if (heat > 0.03) {
            b.globalCompositeOperation = 'lighter';
            b.strokeStyle = 'rgba(255,190,110,' + (0.9 * heat) + ')'; b.lineWidth = 2.6 / scl;
            b.stroke();
          }
          b.restore();
        });
      };
      // Shards always (they make up the logo at the instant of impact)
      b.save(); b.globalAlpha = 1;
      if (tauI >= 0) { doShards(P.shardsA, Limp.A, sp.A); doShards(P.shardsB, Limp.B, sp.B); }
      b.restore();

      // Dust (disintegrating pixels) + sparks, additive
      b.save(); b.globalCompositeOperation = 'lighter';
      const doDust = (list, L) => {
        const cs = Math.cos(L.rot), sn = Math.sin(L.rot);
        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          const wx0 = L.x + (p.x * cs - p.y * sn) * sc * L.s, wy0 = L.y + (p.x * sn + p.y * cs) * sc * L.s;
          let dx = wx0 - coreX, dy = wy0 - coreY; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
          const a = Math.atan2(dy, dx) + p.jit, vx = Math.cos(a), vy = Math.sin(a);
          const [fx, fy, tp] = freeState(p.delay, p.spd * cfg.sparkSpeed, vx, vy, p.up, wx0, wy0);
          const [px, py, pr] = pulled(fx, fy, tp, cfg.coreSwirl);
          if (pr >= 1) continue;
          const tmot = Math.max(0, Math.min(t, tp) - tl.tImp - cfg.hitstop);
          const heat = Math.exp(-tmot * 2.6);
          const r = p.r + (255 - p.r) * heat, gg = p.g + (230 - p.g) * heat, bb = p.b + (180 - p.b) * heat;
          const al = clamp(smooth(0, 0.12, tauI) * (1 - pr * pr) * (0.85 + 0.15 * Math.sin(t * 20 + i)));
          b.fillStyle = 'rgba(' + (r | 0) + ',' + (gg | 0) + ',' + (bb | 0) + ',' + al.toFixed(3) + ')';
          const sz = p.size * (1 - pr * 0.8);
          b.fillRect(px - sz / 2, py - sz / 2, sz, sz);
        }
      };
      if (tauI >= 0) { doDust(P.dustA, Limp.A); doDust(P.dustB, Limp.B); }

      // sparks (streaks)
      if (tauI >= 0) {
        b.lineCap = 'round';
        P.sparks.forEach(sk => {
          const life = sk.life, tm = tauM;
          if (tm > life) return;
          const ex = Math.cos(sk.ang), ey = Math.sin(sk.ang) - sk.up / (sk.spd || 1) * 0.15;
          const pos = tt => { const e = (1 - Math.exp(-K * 1.3 * tt)) / (K * 1.3); return [coreX + sk.ox + ex * sk.spd * cfg.sparkSpeed * e, coreY + sk.oy * 0.4 + ey * sk.spd * cfg.sparkSpeed * e + 0.5 * G * 0.8 * tt * tt]; };
          const p1 = pos(tm), p0 = pos(Math.max(0, tm - 0.045));
          const a = Math.pow(1 - tm / life, 1.4);
          const hot = clamp(1 - tm / (life * 0.55));
          const cr = 255, cg = Math.round(lerp(120, 245, hot)), cb = Math.round(lerp(30, 200, hot * hot));
          b.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + a.toFixed(3) + ')';
          b.lineWidth = sk.w * (0.5 + a);
          b.beginPath(); b.moveTo(p0[0], p0[1]); b.lineTo(p1[0], p1[1]); b.stroke();
        });
      }
      b.restore();
    }

    // ---- fusion: converging rings + core + arms
    if (t >= tl.tImp + 0.1 && t < tl.tHold) {
      b.save(); b.globalCompositeOperation = 'lighter';
      if (t >= tl.tFus && t < tl.tRev) {
        for (let k = 0; k < 3; k++) {
          const u = ((t - tl.tFus) - k * 0.42) / 0.95;
          if (u < 0 || u > 1) continue;
          const r = 560 * (1 - easeInQuad(u)) + 30;
          b.strokeStyle = rgba(mixHex(colA, colB, k / 2), Math.sin(Math.PI * u) * 0.55); b.lineWidth = 3 + 4 * (1 - u);
          b.beginPath(); b.arc(coreX, coreY, r, 0, TAU); b.stroke();
        }
      }
      let cs = 0, ci = 0;
      if (t >= tl.tFus && t < tl.tRev) {
        const gG = easeOutCubic(clamp(fusF / 0.3)), pulse = 1 + 0.06 * Math.sin(fusF * 38), cl = smooth(0.84, 1, fusF);
        cs = gG * pulse * (1 - 0.8 * cl); ci = 0.55 + 0.45 * fusF;
      } else if (t >= tl.tRev) {
        const rv = t - tl.tRev; cs = 0.2 * (1 + rv * 7); ci = Math.exp(-rv * 5.5);
      } else if (t >= tl.tImp) {
        cs = 0.08 * smooth(0, 0.4, tauI); ci = 0.5 * smooth(0, 0.4, tauI);
      }
      const fl = 1 + cfg.flicker * 0.3 * (h1(Math.floor(t * 30) + cfg.seed) - 0.5) * 2;
      if (cs > 0.01 && ci > 0.01) {
        const R = 150 * cfg.coreSize * cs;
        glowDot(b, coreX, coreY, R * 3.4, colCore, 0.55 * ci * fl * cfg.bloom);
        glowDot(b, coreX, coreY, R * 1.5, '#ffffff', 0.85 * ci * fl);
        // spiral arms
        if (t < tl.tRev + 0.5) {
          b.lineCap = 'round';
          for (let arm = 0; arm < 2; arm++) {
            const col = arm ? colB : colA, N = 46;
            for (let i = 0; i < N; i++) {
              const s0 = i / N, s1 = (i + 1) / N;
              const ang0 = (arm * Math.PI) + s0 * TAU * 1.25 + t * 3.2 * cfg.coreSwirl;
              const ang1 = (arm * Math.PI) + s1 * TAU * 1.25 + t * 3.2 * cfg.coreSwirl;
              const r0 = R * (0.3 + 2.3 * (1 - s0)), r1 = R * (0.3 + 2.3 * (1 - s1));
              b.strokeStyle = rgba(lighten(col, 0.2), (1 - s0) * 0.8 * ci);
              b.lineWidth = lerp(8, 1, s0) * Math.max(0.4, cs);
              b.beginPath(); b.moveTo(coreX + Math.cos(ang0) * r0, coreY + Math.sin(ang0) * r0 * 0.9);
              b.lineTo(coreX + Math.cos(ang1) * r1, coreY + Math.sin(ang1) * r1 * 0.9); b.stroke();
            }
          }
          // dashed orbit rings
          for (let i = 0; i < 3; i++) {
            b.save(); b.translate(coreX, coreY); b.rotate(t * (0.9 + i * 0.55) * (i % 2 ? -1 : 1) * cfg.coreSwirl);
            b.scale(1, 0.32 + 0.18 * i); b.setLineDash([10, 14 + i * 6]);
            b.strokeStyle = rgba('#ffffff', 0.45 * ci); b.lineWidth = 1.8;
            b.beginPath(); b.arc(0, 0, R * (1.6 + 0.4 * i), 0, TAU); b.stroke();
            b.restore();
          }
        }
      }
      b.restore();
    }

    // ---- reveal: merged logo C
    if (t >= tl.tRev) {
      const style = cfg.revealStyle;
      const u = revU;
      const LC = { x: CX, y: LCY, rot: 0, s: cfg.mergedScale, alpha: 1 };
      let alpha = smooth(0, 0.25, u), bloomGlow = 1 - smooth(0.1, 0.95, u);
      if (style === 'iris') { LC.s = cfg.mergedScale * lerp(0.9, 1, easeOutCubic(clamp(u / 0.7))); alpha = smooth(0, 0.12, u); }
      else if (style === 'assemble') { alpha = smooth(0.52, 0.88, u); LC.s = cfg.mergedScale * lerp(0.96, 1, smooth(0.5, 1, u)); }
      else { const e = easeOutBack(clamp(u / 0.55), cfg.overshoot); LC.s = cfg.mergedScale * lerp(0.3, 1, e); }
      const idle = t >= tl.tHold ? 1 : smooth(0.7, 1, u);
      LC.y += Math.sin(t * 1.3) * 7 * idle; LC.s *= 1 + 0.012 * Math.sin(t * 1.1) * idle;
      b.save();
      if (style === 'iris') {
        b.beginPath(); b.arc(CX, LCY, lerp(30, 760, easeOutCubic(clamp(u / 0.7))), 0, TAU); b.clip();
      }
      drawReflection(b, sp.C, LC, sc, cfg.reflection * smooth(0.3, 1, u));
      drawGlow(b, sp.C, LC, sc, (bloomGlow * 1.3 + 0.28 + 0.1 * Math.sin(t * 2)) * cfg.bloom, 1.0);
      drawSprite(b, sp.C, LC, sc, alpha);
      // sheen: one sweep on reveal, then periodic
      let shp = clamp((u - 0.42) / 0.5);
      if (t >= tl.tHold) shp = ((t - tl.tHold) % 3.2) / 1.1;
      drawSheen(b, sp.C, LC, sc, shp, 0.9 * cfg.shine * (u > 0.4 || t >= tl.tHold ? 1 : 0));
      b.restore();

      if (style === 'assemble' && u < 0.95) {
        b.save(); b.globalCompositeOperation = 'lighter';
        const cs2 = LC.s * sc;
        P.assemble.forEach((p, i) => {
          const pr = easeOutCubic(clamp((u * 0.95 - p.delay * 0.6) / 0.5));
          const tx = CX + p.x * cs2, ty = LC.y + p.y * cs2;
          const sx = CX + Math.cos(p.sa) * p.sr * (1 - 0.35 * pr), sy = LCY + Math.sin(p.sa) * p.sr * 0.6;
          const x = lerp(sx, tx, pr), y = lerp(sy, ty, pr);
          const al = smooth(0, 0.15, u) * (1 - smooth(0.7, 0.96, u));
          b.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + al.toFixed(3) + ')';
          b.fillRect(x - p.size / 2, y - p.size / 2, p.size, p.size);
        });
        b.restore();
      }
    }

    // ---- sparkle stars
    if (t >= tl.tImp + 0.15) {
      b.save(); b.globalCompositeOperation = 'lighter';
      const starAmt = smooth(tl.tImp + 0.15, tl.tImp + 0.7, t) * (t < tl.tFus ? 0.6 : 1);
      P.stars.forEach(st => {
        const local = (t - tl.tImp - st.t0) / st.period;
        if (local < 0) return;
        const ph = local - Math.floor(local), idx = Math.floor(local);
        const jx = (h1(idx * 3.1 + st.t0 * 50) - 0.5) * 120, jy = (h1(idx * 5.7 + st.t0 * 80) - 0.5) * 80;
        const a = Math.pow(Math.sin(Math.PI * ph), 2) * starAmt * cfg.bloom;
        drawStar(b, st.x + jx, st.y + jy, st.size * (0.6 + 0.5 * a), st.rot + ph * 0.4, a, colCore);
      });
      b.restore();
    }

    // ---- shockwaves, rays, flares
    b.save(); b.globalCompositeOperation = 'lighter';
    const ringCols = ['#ffffff', lighten(colA, 0.4), lighten(colB, 0.4), lighten(colC, 0.3)];
    if (tauI >= 0) {
      for (let i = 0; i < cfg.shockRings; i++) {
        const dur = 0.85 + i * 0.22, u = (tauI - i * 0.07) / dur;
        if (u < 0 || u > 1) continue;
        const r = (240 + i * 130) * cfg.shockSize * 4.2 * easeOutCubic(u) * 0.55 + 20;
        const a = Math.pow(1 - u, 1.7);
        b.strokeStyle = rgba(ringCols[i % ringCols.length], a * 0.28); b.lineWidth = (26 - i * 5) * (1 - u) + 4;
        b.beginPath(); b.arc(coreX, coreY, r, 0, TAU); b.stroke();
        b.strokeStyle = rgba('#ffffff', a * 0.9); b.lineWidth = (6 - i) * (1 - u) + 1;
        b.beginPath(); b.arc(coreX, coreY, r, 0, TAU); b.stroke();
      }
    }
    if (t >= tl.tRev) {
      const u = (t - tl.tRev) / 1.1;
      if (u <= 1) {
        const r = 40 + 760 * easeOutCubic(u), a = Math.pow(1 - u, 1.5);
        b.strokeStyle = rgba(lighten(colC, 0.5), a * 0.35); b.lineWidth = 34 * (1 - u) + 3;
        b.beginPath(); b.arc(coreX, coreY, r, 0, TAU); b.stroke();
        b.strokeStyle = rgba('#ffffff', a * 0.85); b.lineWidth = 4 * (1 - u) + 1;
        b.beginPath(); b.arc(coreX, coreY, r, 0, TAU); b.stroke();
      }
    }
    // light rays (impact + reveal)
    const rayI = cfg.rays * Math.max(
      tauI >= 0 ? Math.exp(-tauI * 4.2) * 0.75 : 0,
      t >= tl.tRev ? Math.exp(-(t - tl.tRev) * 2.2) * 0.65 : 0,
      t >= tl.tFus && t < tl.tRev ? 0.1 + 0.35 * smooth(0.5, 1, fusF) : 0);
    if (rayI > 0.01) {
      const rg = b.createRadialGradient(coreX, coreY, 0, coreX, coreY, 1500);
      rg.addColorStop(0, 'rgba(255,255,255,' + clamp(rayI) + ')'); rg.addColorStop(0.5, rgba(colCore, clamp(rayI * 0.35))); rg.addColorStop(1, 'rgba(255,255,255,0)');
      b.fillStyle = rg; b.beginPath();
      P.rays.forEach(r => {
        const a = r.a + t * 0.07, L2 = 1500 * r.len, w = r.w;
        b.moveTo(coreX, coreY); b.lineTo(coreX + Math.cos(a - w) * L2, coreY + Math.sin(a - w) * L2);
        b.lineTo(coreX + Math.cos(a + w) * L2, coreY + Math.sin(a + w) * L2); b.closePath();
      });
      b.fill();
    }
    // anamorphic streak
    if (cfg.anamorphic) {
      const sI = Math.max(tauI >= 0 ? Math.exp(-tauI * 2.6) : 0, t >= tl.tRev ? Math.exp(-(t - tl.tRev) * 2.8) * 0.9 : 0) * cfg.flashIntensity;
      if (sI > 0.02) {
        const len = 1300 * (0.55 + 0.45 * Math.min(1, sI * 2));
        const sg = b.createLinearGradient(coreX - len, 0, coreX + len, 0);
        sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, rgba(lighten(colCore, 0.5), clamp(sI))); sg.addColorStop(1, 'rgba(255,255,255,0)');
        b.fillStyle = sg; b.fillRect(coreX - len, coreY - 5, len * 2, 10);
        const sg2 = b.createLinearGradient(coreX - len, 0, coreX + len, 0);
        sg2.addColorStop(0, 'rgba(255,255,255,0)'); sg2.addColorStop(0.5, rgba(colCore, clamp(sI * 0.28))); sg2.addColorStop(1, 'rgba(255,255,255,0)');
        b.fillStyle = sg2;
        b.fillRect(coreX - len, coreY - 34, len * 2, 68);
      }
    }
    // impact bloom blob
    if (tauI >= -0.04) {
      const k = Math.exp(-Math.max(0, tauI) * 5);
      glowDot(b, coreX, coreY, 260 + 700 * (1 - k), '#ffffff', 0.9 * k * cfg.flashIntensity);
      glowDot(b, coreX, coreY, 900, colCore, 0.5 * k * cfg.bloom * cfg.flashIntensity);
    }
    // reveal secondary sparks
    if (t >= tl.tRev) {
      const tr = t - tl.tRev; b.lineCap = 'round';
      P.sparks2.forEach(sk => {
        if (tr > sk.life) return;
        const pos = tt => { const e = (1 - Math.exp(-2.2 * tt)) / 2.2; return [coreX + Math.cos(sk.ang) * sk.spd * e, coreY + Math.sin(sk.ang) * sk.spd * e * 0.8 + 0.5 * 160 * tt * tt]; };
        const p1 = pos(tr), p0 = pos(Math.max(0, tr - 0.04)), a = Math.pow(1 - tr / sk.life, 1.5);
        b.strokeStyle = 'rgba(255,' + Math.round(lerp(200, 244, a)) + ',' + Math.round(lerp(120, 210, a)) + ',' + a.toFixed(3) + ')';
        b.lineWidth = sk.w * (0.5 + a); b.beginPath(); b.moveTo(p0[0], p0[1]); b.lineTo(p1[0], p1[1]); b.stroke();
      });
    }
    b.restore();
    b.restore(); // camera

    // ---- captions (not affected by camera)
    if (cfg.showCaptions) {
      b.save();
      const intro = smooth(0.3, 1.1, t) * (1 - smooth(tl.tApp - 0.1, tl.tApp + 0.7, t));
      if (intro > 0.01 && cfg.introText) {
        b.globalAlpha = intro;
        const wd = drawTracked(b, cfg.introText, CX, 168 - (1 - intro) * 14, 34, 600, 16, 'rgba(226,232,240,0.95)', 'center');
        b.fillStyle = rgba(colA, 0.9); b.fillRect(CX - wd / 2, 190, wd * 0.5 * intro, 2);
        b.fillStyle = rgba(colB, 0.9); b.fillRect(CX, 190, wd * 0.5 * intro, 2);
      }
      const c1 = smooth(tl.tRev + 0.9, tl.tRev + 1.5, t);
      if (c1 > 0.01) {
        b.globalAlpha = c1;
        const wd = drawTracked(b, cfg.eyebrow, CX, 150 - (1 - c1) * 14, 30, 700, 18, rgba(lighten(colC, 0.35), 1), 'center');
        b.fillStyle = rgba(colC, 0.9); b.fillRect(CX - wd * 0.3 * c1, 176, wd * 0.6 * c1, 2);
      }
      const c2 = smooth(tl.tRev + 1.2, tl.tRev + 1.9, t);
      if (c2 > 0.01) {
        b.globalAlpha = c2;
        b.shadowColor = rgba(colC, 0.55); b.shadowBlur = 28;
        drawTracked(b, cfg.dealValue, CX, 928 + (1 - c2) * 22, 84, 800, 4, '#ffffff', 'center');
        b.shadowBlur = 0;
        drawTracked(b, cfg.dealTagline, CX, 986 + (1 - c2) * 22, 24, 600, 13, 'rgba(148,163,184,1)', 'center');
      }
      b.restore();
    }
  }

  // --------------------------------------------------------- frame + post FX
  function normalizeCfg(data) {
    const c = Object.assign({}, DEFAULT_CONFIG, data || {});
    ['logoSize', 'separation', 'durIntro', 'durAnticipation', 'durApproach', 'durImpact', 'durFusion', 'durReveal', 'durHold',
      'pullBack', 'tilt', 'trailLength', 'camPush', 'overlap', 'arcIntensity', 'flashIntensity', 'flashDecay', 'hitstop', 'shake',
      'shockRings', 'shockSize', 'sparkCount', 'sparkSpeed', 'gravity', 'shardGrid', 'dustDensity', 'aberration', 'flicker', 'strobes',
      'coreSize', 'coreSwirl', 'revealFlash', 'overshoot', 'shine', 'rays', 'grain', 'vignette', 'letterbox', 'bloom', 'reflection',
      'seed', 'mergedScale'].forEach(k => { c[k] = +c[k]; if (!isFinite(c[k])) c[k] = DEFAULT_CONFIG[k]; });
    c.anamorphic = !!c.anamorphic; c.showCaptions = c.showCaptions !== false;
    return c;
  }
  function getSim(cfg) {
    const sp = getSprites(cfg);
    return { tl: timeline(cfg), sp: sp, P: getParticles(cfg, sp), g: geom(cfg) };
  }

  function flashAlpha(t, cfg, tl) {
    const tau = t - tl.tImp;
    let a = 0;
    if (tau >= -0.04 && tau < 0) a = 0.45 * (1 + tau / 0.04);
    if (tau >= 0) a = cfg.flashIntensity * Math.exp(-Math.pow(tau / cfg.flashDecay, 1.3));
    for (let j = 0; j < Math.round(cfg.strobes); j++) {
      const c = 0.13 + 0.15 * j, amp = 0.55 * Math.pow(0.75, j) * cfg.flicker;
      a = Math.max(a, amp * Math.max(0, 1 - Math.abs(tau - c) / 0.05));
    }
    const pre = t - (tl.tRev - 0.14);
    if (pre >= 0 && t < tl.tRev) a = Math.max(a, cfg.revealFlash * 0.75 * (pre / 0.14));
    if (t >= tl.tRev) a = Math.max(a, cfg.revealFlash * 0.8 * Math.exp(-Math.pow((t - tl.tRev) / 0.26, 1.3)));
    return clamp(a * 0.82);
  }

  function renderFrame(ctx, t, data, cw, ch) {
    const cfg = normalizeCfg(data);
    const sim = getSim(cfg);
    const tl = sim.tl;
    t = clamp(t, 0, tl.T);
    const scene = bufferFor('scene', cw, ch);
    const b = scene.getContext('2d');
    drawScene(b, t, cfg, sim, cw, ch);
    b.setTransform(1, 0, 0, 1, 0, 0);

    // composite w/ chromatic aberration
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    const tau = t - tl.tImp, appU = clamp((t - tl.tApp) / tl.durApp);
    const ab = cfg.aberration * ((tau >= 0 ? 16 * Math.exp(-tau * 5) : 0) + (t >= tl.tRev ? 7 * Math.exp(-(t - tl.tRev) * 6) : 0) + 2.2 * Math.pow(appU, 3) * (tau < 0 ? 1 : 0));
    const px = ab * cw / VW;
    if (px > 0.6) {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch);
      const tmp = bufferFor('tmpA', cw, ch), g = tmp.getContext('2d');
      [['#ff0000', px, 0.5], ['#00ff00', 0, 0], ['#0000ff', -px, -0.5]].forEach(ch3 => {
        g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.drawImage(scene, 0, 0);
        g.globalCompositeOperation = 'multiply'; g.fillStyle = ch3[0]; g.fillRect(0, 0, cw, ch);
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(tmp, ch3[1], ch3[2]);
      });
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.drawImage(scene, 0, 0);
    }

    // flash overlay
    const fa = flashAlpha(t, cfg, tl);
    if (fa > 0.005) { ctx.fillStyle = 'rgba(255,250,242,' + fa.toFixed(3) + ')'; ctx.fillRect(0, 0, cw, ch); }

    // vignette
    if (cfg.vignette > 0.01) {
      const v = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.3, cw / 2, ch / 2, Math.hypot(cw, ch) * 0.62);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,' + clamp(cfg.vignette * (0.62 + 0.25 * appU)) + ')');
      ctx.fillStyle = v; ctx.fillRect(0, 0, cw, ch);
    }
    // grain
    if (cfg.grain > 0.01) {
      const fr = Math.floor(t * 24);
      ctx.save();
      ctx.globalAlpha = clamp(cfg.grain * 0.09); ctx.globalCompositeOperation = 'overlay';
      ctx.translate((h1(fr * 1.7) * 256) | 0, (h1(fr * 2.9) * 256) | 0);
      ctx.fillStyle = grainPattern(ctx); ctx.fillRect(-256, -256, cw + 256, ch + 256);
      ctx.restore();
    }
    // letterbox
    if (cfg.letterbox > 0.001) {
      const bh = ch * cfg.letterbox;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, bh); ctx.fillRect(0, ch - bh, cw, bh);
    }
    ctx.restore();
    return { phase: phaseName(t, tl), total: tl.T };
  }

  // ---------------------------------------------------------------------------
  // Stage integration
  // ---------------------------------------------------------------------------
  const state = { canvas: null, hud: null, cfg: null, t: 0, stage: null };
  invalidateHook = () => { particleCache = null; if (state.canvas && state.canvas.isConnected) renderStage(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { spriteCache.clear(); particleCache = null; renderStage(); });

  function resolveData(data) {
    const live = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(TEMPLATE_ID) : null;
    return Object.assign({}, DEFAULT_CONFIG, live || {}, data || {});
  }
  function fitCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr)), h = Math.max(2, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  function renderStage() {
    const cv = state.canvas;
    if (!cv || !cv.isConnected || !cv.clientWidth) return;
    fitCanvas(cv);
    const info = renderFrame(cv.getContext('2d'), state.t, state.cfg, cv.width, cv.height);
    if (state.hud) state.hud.textContent = info.phase + '  \u00B7  ' + state.t.toFixed(1) + 's / ' + info.total.toFixed(1) + 's';
  }

  window.tplMountMergerAcqStage = function (stage, data) {
    if (!stage) return;
    state.cfg = resolveData(data);
    stage.innerHTML =
      '<div id="merger-acq-stage-inner" style="position:absolute;inset:0;background:#02030a;overflow:hidden;">' +
      '<canvas id="merger-acq-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;"></canvas>' +
      '<div style="position:absolute;bottom:12px;left:14px;pointer-events:none;display:flex;gap:8px;align-items:center;">' +
      '<span id="merger-acq-hud" style="font-family:monospace;font-size:8.5px;font-weight:800;color:#fbbf24;background:rgba(8,10,18,0.82);border:1px solid rgba(251,191,36,0.4);padding:3px 8px;border-radius:5px;">INTRO</span>' +
      '</div></div>';
    state.stage = stage;
    state.canvas = stage.querySelector('#merger-acq-canvas');
    state.hud = stage.querySelector('#merger-acq-hud');
    requestAnimationFrame(renderStage);
    renderStage();
  };

  window.tplUpdateMergerAcqStage = function (data) {
    state.cfg = resolveData(data);
    if (!state.canvas || !state.canvas.isConnected) {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) window.tplMountMergerAcqStage(stage, state.cfg);
      return;
    }
    renderStage();
  };

  window.stepMergerAcqAnimation = function (container, tplId, t, data) {
    if (!state.canvas || !state.canvas.isConnected) {
      if (!container) return;
      window.tplMountMergerAcqStage(container, data);
    }
    state.cfg = resolveData(data);
    const tl = timeline(normalizeCfg(state.cfg));
    let tt = t;
    if (typeof topCustomizerState !== 'undefined' && topCustomizerState && topCustomizerState.duration > 0.5) {
      const k = tl.T / topCustomizerState.duration;
      if (Math.abs(k - 1) > 0.02) tt = t * k;
    }
    state.t = tt;
    renderStage();
  };

  window.renderMergerAcquisitionCanvas = function (ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const entry = clip && clip.fxScene && clip.fxScene.entry;
    renderFrame(ctx, t, Object.assign({}, DEFAULT_CONFIG, (entry && entry.contextualData) || {}), cw, ch);
  };

  // Hover / card preview: self-contained looping canvas
  window.tplMountMergerAcqPreview = function (container) {
    if (!container) return;
    container.innerHTML = '<canvas style="position:absolute;inset:0;width:100%;height:100%;display:block;background:#02030a"></canvas>';
    const cv = container.querySelector('canvas');
    const cfg = Object.assign({}, resolveData(), { quality: 'draft', grain: 0.3, letterbox: 0 });
    const T = timeline(normalizeCfg(cfg)).T;
    const t0 = performance.now();
    (function loop() {
      if (!cv.isConnected) return;
      if (cv.clientWidth) {
        fitCanvas(cv);
        renderFrame(cv.getContext('2d'), (((performance.now() - t0) / 1000) * 1.35) % (T + 0.6), cfg, cv.width, cv.height);
      }
      requestAnimationFrame(loop);
    })();
  };

  // ---------------------------------------------------------------------------
  // Contextual inspector (granular controls)
  // ---------------------------------------------------------------------------
  const BRAND_OPTS = BRAND_IDS.map(id => [id, BRANDS[id].name + ' \u2014 ' + BRANDS[id].tag]);
  const SECTIONS = [
    {
      title: '\uD83C\uDFE2 Brands & Logos', open: true, items: [
        { k: 'brandA', t: 'select', l: 'Company A (left)', o: BRAND_OPTS },
        { k: 'brandB', t: 'select', l: 'Company B (right)', o: BRAND_OPTS },
        { k: 'nameA', t: 'text', l: 'Name A (override)' }, { k: 'tagA', t: 'text', l: 'Descriptor A' },
        { k: 'nameB', t: 'text', l: 'Name B (override)' }, { k: 'tagB', t: 'text', l: 'Descriptor B' },
        { k: 'logoImgA', t: 'upload', l: 'Upload real logo A (transparent PNG/SVG)' },
        { k: 'logoImgB', t: 'upload', l: 'Upload real logo B (transparent PNG/SVG)' },
        { k: 'mergedName', t: 'text', l: 'Merged name (blank = A + B)' }, { k: 'mergedTag', t: 'text', l: 'Merged descriptor' },
        { k: 'mergedMode', t: 'select', l: 'Merged logo style', o: [['interlock', 'Interlocked marks'], ['split', 'Split-seam fusion'], ['custom', 'Uploaded logo C']] },
        { k: 'logoImgC', t: 'upload', l: 'Upload merged logo C' },
        { k: 'accentA', t: 'color', l: 'Accent A' }, { k: 'accentB', t: 'color', l: 'Accent B' }, { k: 'accentC', t: 'color', l: 'Accent merged' },
        { k: 'logoSize', t: 'range', l: 'Logo size', min: 160, max: 420, step: 5, u: 'px' },
        { k: 'mergedScale', t: 'range', l: 'Merged logo scale', min: 0.7, max: 1.5, step: 0.05, u: '\u00D7' },
        { k: 'separation', t: 'range', l: 'Starting distance', min: 800, max: 1500, step: 10, u: 'px' }
      ]
    },
    {
      title: '\u23F1 Timing (seconds per phase)', open: true, items: [
        { t: 'presets', id: 'timing' },
        { k: 'durIntro', t: 'range', l: '1 \u00B7 Intro (logos appear)', min: 0.4, max: 4, step: 0.1, u: 's' },
        { k: 'durAnticipation', t: 'range', l: '2 \u00B7 Anticipation (recoil + charge)', min: 0.3, max: 4, step: 0.1, u: 's' },
        { k: 'durApproach', t: 'range', l: '3 \u00B7 Approach (accelerate)', min: 0.4, max: 4, step: 0.1, u: 's' },
        { k: 'durImpact', t: 'range', l: '4 \u00B7 Impact (explosion)', min: 0.5, max: 3, step: 0.1, u: 's' },
        { k: 'durFusion', t: 'range', l: '5 \u00B7 Fusion (plasma core)', min: 0.6, max: 4, step: 0.1, u: 's' },
        { k: 'durReveal', t: 'range', l: '6 \u00B7 Reveal (new logo)', min: 0.6, max: 4, step: 0.1, u: 's' },
        { k: 'durHold', t: 'range', l: '7 \u00B7 Hold (end card)', min: 0.3, max: 8, step: 0.1, u: 's' },
        { t: 'total' }
      ]
    },
    {
      title: '\uD83D\uDE80 Approach motion', items: [
        { k: 'pullBack', t: 'range', l: 'Recoil distance', min: 0, max: 260, step: 5, u: 'px' },
        { k: 'approachEase', t: 'select', l: 'Acceleration curve', o: [['quad', 'Gentle (quad)'], ['cubic', 'Strong (cubic)'], ['quart', 'Violent (quart)'], ['expo', 'Explosive (expo)'], ['sine', 'Smooth (sine)']] },
        { k: 'tilt', t: 'range', l: 'Lean into collision', min: 0, max: 25, step: 1, u: '\u00B0' },
        { k: 'trailLength', t: 'range', l: 'Motion trail', min: 0, max: 20, step: 1 },
        { k: 'arcIntensity', t: 'range', l: 'Electric arcs between logos', min: 0, max: 2, step: 0.05, u: '\u00D7' },
        { k: 'overlap', t: 'range', l: 'Overlap at impact', min: 0.5, max: 1.2, step: 0.02 },
        { k: 'camPush', t: 'range', l: 'Camera push-in', min: 0, max: 0.4, step: 0.01 }
      ]
    },
    {
      title: '\uD83D\uDCA5 Impact & explosion', open: true, items: [
        { t: 'presets', id: 'look' },
        { k: 'flashIntensity', t: 'range', l: 'Flash brightness', min: 0, max: 1.5, step: 0.05, u: '\u00D7' },
        { k: 'flashDecay', t: 'range', l: 'Flash fade time', min: 0.1, max: 1.2, step: 0.02, u: 's' },
        { k: 'strobes', t: 'range', l: 'Light flicker strobes', min: 0, max: 6, step: 1 },
        { k: 'flicker', t: 'range', l: 'Flicker amount', min: 0, max: 2, step: 0.05, u: '\u00D7' },
        { k: 'hitstop', t: 'range', l: 'Hit-stop freeze', min: 0, max: 0.4, step: 0.01, u: 's' },
        { k: 'shake', t: 'range', l: 'Screen shake', min: 0, max: 2.5, step: 0.05, u: '\u00D7' },
        { k: 'shockRings', t: 'range', l: 'Shockwave rings', min: 0, max: 5, step: 1 },
        { k: 'shockSize', t: 'range', l: 'Shockwave size', min: 0.4, max: 2, step: 0.05, u: '\u00D7' },
        { k: 'sparkCount', t: 'range', l: 'Spark count', min: 0, max: 1200, step: 20 },
        { k: 'sparkSpeed', t: 'range', l: 'Debris & spark speed', min: 0.3, max: 2.5, step: 0.05, u: '\u00D7' },
        { k: 'gravity', t: 'range', l: 'Gravity', min: 0, max: 2.5, step: 0.05, u: '\u00D7' },
        { k: 'shardGrid', t: 'range', l: 'Logo shard detail', min: 3, max: 12, step: 1 },
        { k: 'dustDensity', t: 'range', l: 'Pixel-dust density', min: 0.2, max: 2.5, step: 0.1, u: '\u00D7' },
        { k: 'aberration', t: 'range', l: 'Chromatic aberration', min: 0, max: 2.5, step: 0.05, u: '\u00D7' },
        { k: 'anamorphic', t: 'check', l: 'Anamorphic lens streak' }
      ]
    },
    {
      title: '\uD83C\uDF00 Fusion & reveal', items: [
        { k: 'coreSize', t: 'range', l: 'Plasma core size', min: 0.4, max: 2.2, step: 0.05, u: '\u00D7' },
        { k: 'coreSwirl', t: 'range', l: 'Swirl intensity', min: 0, max: 3, step: 0.1, u: '\u00D7' },
        { k: 'coreColor', t: 'color', l: 'Core colour (blank = blend)' },
        { k: 'revealStyle', t: 'select', l: 'Reveal style', o: [['bloom', 'Bloom burst'], ['iris', 'Iris wipe'], ['assemble', 'Particle assemble']] },
        { k: 'revealFlash', t: 'range', l: 'Reveal flash', min: 0, max: 1.5, step: 0.05, u: '\u00D7' },
        { k: 'overshoot', t: 'range', l: 'Pop overshoot', min: 0, max: 2.5, step: 0.1, u: '\u00D7' },
        { k: 'shine', t: 'range', l: 'Logo shine sweep', min: 0, max: 1.5, step: 0.05, u: '\u00D7' },
        { k: 'rays', t: 'range', l: 'Light rays', min: 0, max: 2, step: 0.05, u: '\u00D7' }
      ]
    },
    {
      title: '\uD83C\uDFAC Look & captions', items: [
        { k: 'bgStyle', t: 'select', l: 'Backdrop', o: [['void', 'Midnight void'], ['steel', 'Blue steel'], ['ember', 'Ember'], ['studio', 'Graphite studio']] },
        { k: 'bloom', t: 'range', l: 'Bloom / glow', min: 0, max: 2, step: 0.05, u: '\u00D7' },
        { k: 'reflection', t: 'range', l: 'Floor reflection', min: 0, max: 0.8, step: 0.02 },
        { k: 'vignette', t: 'range', l: 'Vignette', min: 0, max: 1, step: 0.02 },
        { k: 'grain', t: 'range', l: 'Film grain', min: 0, max: 1.5, step: 0.05 },
        { k: 'letterbox', t: 'range', l: 'Cinema bars', min: 0, max: 0.14, step: 0.005 },
        { k: 'showCaptions', t: 'check', l: 'Show captions' },
        { k: 'introText', t: 'text', l: 'Intro line' }, { k: 'eyebrow', t: 'text', l: 'End-card headline' },
        { k: 'dealValue', t: 'text', l: 'Deal value' }, { k: 'dealTagline', t: 'text', l: 'Deal caption' }
      ]
    },
    {
      title: '\u2699 Engine', items: [
        { k: 'quality', t: 'select', l: 'Render quality', o: [['draft', 'Draft (fast)'], ['high', 'High'], ['ultra', 'Ultra (heavy)']] },
        { k: 'seed', t: 'range', l: 'Randomness seed', min: 1, max: 99, step: 1 }
      ]
    }
  ];

  const PRESETS = {
    timing: [
      ['Punchy 8s', { durIntro: 1.0, durAnticipation: 0.9, durApproach: 1.2, durImpact: 1.0, durFusion: 1.2, durReveal: 1.4, durHold: 1.3 }],
      ['Cinematic 12s', { durIntro: 1.6, durAnticipation: 1.4, durApproach: 1.8, durImpact: 1.2, durFusion: 1.8, durReveal: 2.0, durHold: 2.2 }],
      ['Epic 16s', { durIntro: 2.2, durAnticipation: 2.0, durApproach: 2.4, durImpact: 1.6, durFusion: 2.4, durReveal: 2.6, durHold: 3.0 }]
    ],
    look: [
      ['Blockbuster', { flashIntensity: 1.2, shake: 1.5, sparkCount: 700, aberration: 1.5, anamorphic: true, letterbox: 0.09, grain: 0.7, bgStyle: 'steel', strobes: 3, shockRings: 4, camPush: 0.18 }],
      ['Clean corporate', { flashIntensity: 0.6, shake: 0.45, sparkCount: 220, aberration: 0.35, anamorphic: false, letterbox: 0, grain: 0.2, bgStyle: 'studio', tilt: 3, revealStyle: 'iris', strobes: 1, shockRings: 2 }],
      ['Electric storm', { arcIntensity: 2, flicker: 1.8, strobes: 5, sparkCount: 560, bgStyle: 'void', coreSwirl: 1.8, aberration: 1.2, rays: 1.4 }]
    ]
  };

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  function totalOf(d) { return timeline(normalizeCfg(d)).T; }

  window.tplBuildMergerAcqInspector = function (container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const inputCss = 'width:100%;background:#0f172a;border:1px solid #334155;color:#f8fafc;padding:5px 8px;border-radius:5px;font-size:11px;box-sizing:border-box;';
    const lbl = 'font-size:9.5px;color:#94a3b8;';
    const resolvedColor = k => {
      if (d[k]) return d[k];
      if (k === 'accentA') return resolveSide(d, 'A').accent;
      if (k === 'accentB') return resolveSide(d, 'B').accent;
      if (k === 'accentC') return resolveMerged(d).accent;
      return '#ffffff';
    };
    const item = it => {
      if (it.t === 'range') {
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><label style="' + lbl + 'flex:1;">' + it.l + '</label>' +
          '<input type="range" data-k="' + it.k + '" data-t="range" data-u="' + (it.u || '') + '" min="' + it.min + '" max="' + it.max + '" step="' + it.step + '" value="' + d[it.k] + '" style="width:104px;">' +
          '<span data-ro="' + it.k + '" style="font-family:monospace;font-size:9.5px;color:#fbbf24;width:46px;text-align:right;">' + (+d[it.k]).toFixed(it.step < 0.1 ? 2 : it.step < 1 ? 1 : 0) + (it.u || '') + '</span></div>';
      }
      if (it.t === 'select') {
        return '<div><label style="' + lbl + 'display:block;margin-bottom:3px;">' + it.l + '</label><select data-k="' + it.k + '" data-t="select" style="' + inputCss + '">' +
          it.o.map(o => '<option value="' + o[0] + '"' + (String(d[it.k]) === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></div>';
      }
      if (it.t === 'text') {
        return '<div><label style="' + lbl + 'display:block;margin-bottom:3px;">' + it.l + '</label><input type="text" data-k="' + it.k + '" data-t="text" value="' + esc(d[it.k]) + '" style="' + inputCss + '"></div>';
      }
      if (it.t === 'check') {
        return '<label style="display:flex;align-items:center;justify-content:space-between;' + lbl + '">' + it.l + '<input type="checkbox" data-k="' + it.k + '" data-t="check"' + (d[it.k] ? ' checked' : '') + '></label>';
      }
      if (it.t === 'color') {
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><label style="' + lbl + 'flex:1;">' + it.l + '</label>' +
          '<input type="color" data-k="' + it.k + '" data-t="color" value="' + resolvedColor(it.k) + '" style="width:38px;height:22px;border:none;background:none;padding:0;">' +
          '<button type="button" data-clear="' + it.k + '" title="Back to automatic" style="background:#1e293b;border:1px solid #334155;color:#94a3b8;border-radius:4px;font-size:9px;padding:2px 6px;cursor:pointer;">auto</button></div>';
      }
      if (it.t === 'upload') {
        const has = !!d[it.k];
        return '<div style="display:flex;align-items:center;gap:8px;"><label style="' + lbl + 'flex:1;">' + it.l + (has ? ' <b style="color:#22c55e;">\u2713</b>' : '') + '</label>' +
          '<label style="background:#1e293b;border:1px solid #334155;color:#e2e8f0;border-radius:4px;font-size:9.5px;padding:3px 8px;cursor:pointer;">Choose<input type="file" accept="image/*" data-up="' + it.k + '" style="display:none;"></label>' +
          (has ? '<button type="button" data-clear="' + it.k + '" style="background:#3f1d1d;border:1px solid #7f1d1d;color:#fca5a5;border-radius:4px;font-size:9px;padding:3px 6px;cursor:pointer;">\u2715</button>' : '') + '</div>';
      }
      if (it.t === 'presets') {
        return '<div style="display:flex;gap:6px;flex-wrap:wrap;">' + PRESETS[it.id].map((p, i) =>
          '<button type="button" data-preset="' + it.id + ':' + i + '" style="flex:1;min-width:70px;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.4);color:#fbbf24;font-size:9.5px;font-weight:700;padding:5px 6px;border-radius:5px;cursor:pointer;">' + p[0] + '</button>').join('') + '</div>';
      }
      if (it.t === 'total') {
        return '<div style="font-size:10px;color:#cbd5e1;text-align:right;">Total length: <b data-total style="color:#fbbf24;font-family:monospace;">' + totalOf(d).toFixed(1) + 's</b></div>';
      }
      return '';
    };

    container.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:10px;padding:4px 0;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);">' +
      '<span style="font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:0.8px;">\uD83D\uDCA5 Merger Collision Engine</span>' +
      '<span data-total-pill style="font-size:9px;color:#fbbf24;font-weight:700;background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.35);padding:2px 6px;border-radius:4px;">' + totalOf(d).toFixed(1) + 's</span></div>' +
      SECTIONS.map(sec =>
        '<details' + (sec.open ? ' open' : '') + ' style="background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 10px;">' +
        '<summary style="cursor:pointer;font-size:10px;font-weight:800;color:#f8fafc;letter-spacing:0.5px;text-transform:uppercase;">' + sec.title + '</summary>' +
        '<div style="display:flex;flex-direction:column;gap:9px;margin-top:10px;">' + sec.items.map(item).join('') + '</div></details>').join('') +
      '<div style="display:flex;gap:6px;">' +
      '<button type="button" data-act="reseed" style="flex:1;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);color:#38bdf8;font-size:10px;font-weight:700;padding:7px;border-radius:6px;cursor:pointer;">\uD83C\uDFB2 New debris pattern</button>' +
      '<button type="button" data-act="reset" style="flex:1;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#ef4444;font-size:10px;font-weight:700;padding:7px;border-radius:6px;cursor:pointer;">Reset defaults</button></div></div>';

    const refresh = () => { window.tplRenderContextualInspector && window.tplRenderContextualInspector(tplId); };
    const update = patch => {
      if (typeof window.tplSetContextualData !== 'function') return;
      window.tplSetContextualData(tplId, patch);
      if (Object.keys(patch).some(k => k.indexOf('dur') === 0)) syncDuration();
    };
    const syncDuration = () => {
      const cur = Object.assign({}, DEFAULT_CONFIG, window.tplGetContextualData(tplId));
      const T = totalOf(cur);
      container.querySelectorAll('[data-total]').forEach(e => { e.textContent = T.toFixed(1) + 's'; });
      container.querySelectorAll('[data-total-pill]').forEach(e => { e.textContent = T.toFixed(1) + 's'; });
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.duration = Math.max(1, Math.round(T * 10) / 10);
        ['tpl-modal-slider-duration', 'tpl-modal-duration-slider', 'tpl-modal-duration'].forEach(id => {
          const sl = document.getElementById(id); if (sl) sl.value = topCustomizerState.duration;
        });
        const v = document.getElementById('tpl-modal-val-duration'); if (v) v.textContent = topCustomizerState.duration + ' sec';
      }
    };

    if (container._mgHandlers) container._mgHandlers.forEach(h => container.removeEventListener(h[0], h[1]));
    container._mgHandlers = [];
    const on = (ev, fn) => { container.addEventListener(ev, fn); container._mgHandlers.push([ev, fn]); };
    on('input', e => {
      const el = e.target, k = el.getAttribute && el.getAttribute('data-k');
      if (!k) return;
      const ty = el.getAttribute('data-t');
      let v;
      if (ty === 'range') {
        v = parseFloat(el.value);
        const ro = container.querySelector('[data-ro="' + k + '"]');
        if (ro) { const step = parseFloat(el.step); ro.textContent = v.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0) + (el.getAttribute('data-u') || ''); }
      } else if (ty === 'check') v = el.checked;
      else v = el.value;
      update({ [k]: v });
    });
    on('change', e => {
      const el = e.target;
      if (el.getAttribute && el.getAttribute('data-t') === 'check') update({ [el.getAttribute('data-k')]: el.checked });
      const up = el.getAttribute && el.getAttribute('data-up');
      if (up && el.files && el.files[0]) {
        const rd = new FileReader();
        rd.onload = () => {
          const im = new Image();
          im.onload = () => {
            const m = Math.min(1, 900 / Math.max(im.naturalWidth, im.naturalHeight));
            const c = makeCanvas(im.naturalWidth * m, im.naturalHeight * m);
            c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
            const patch = { [up]: c.toDataURL('image/png') };
            if (up === 'logoImgC') patch.mergedMode = 'custom';
            update(patch); refresh();
          };
          im.src = rd.result;
        };
        rd.readAsDataURL(el.files[0]);
      }
    });
    on('click', e => {
      const t = e.target.closest ? e.target.closest('button') : null;
      if (!t) return;
      if (t.hasAttribute('data-clear')) { update({ [t.getAttribute('data-clear')]: '' }); refresh(); }
      else if (t.hasAttribute('data-preset')) {
        const [grp, i] = t.getAttribute('data-preset').split(':');
        update(Object.assign({}, PRESETS[grp][+i][1])); refresh();
      } else if (t.getAttribute('data-act') === 'reseed') {
        update({ seed: 1 + Math.floor(Math.random() * 98) }); refresh();
      } else if (t.getAttribute('data-act') === 'reset') {
        update(Object.assign({}, DEFAULT_CONFIG)); refresh();
      }
    });
    syncDuration();
  };

  window.MERGER_ACQ_CONFIG = DEFAULT_CONFIG;
  window.MERGER_ACQ_TOTAL = function (c) { return totalOf(c || DEFAULT_CONFIG); };
  window.mergerAcqRenderFrame = renderFrame; // exposed for tests / tooling
  console.log('[Merger & Acquisition Engine] Cinematic collision engine ready');
})();
