/* FX Scene system for the unified template customizer.
   - Every bridged template gets an Inspector "Effect Controls" section (motion + editable text).
   - 3D Spatial + 3D Document templates also get a Video/3D switch with full 3D controls.
   - All edits live in a persistent per-template store (localStorage) so nothing resets on close.
   - Applying to the timeline creates an "fxScene" clip that is rendered frame by frame onto the
     studio canvas (CSS effect via SVG rasterisation, 3D effect via the Three.js engines), so the real
     animated effect plays in the timeline preview/export and survives "Save as template". */
(function () {
  'use strict';
  const HOST_ID = 'tpl-modal-3d-controls';
  const STORE_KEY = 'magnates_fx_store_v2';
  const RW = 720, RH = 405; // offscreen raster size for timeline rendering

  const isBridged = (id) => typeof BRIDGED_HOVER_TEMPLATE_IDS !== 'undefined' && BRIDGED_HOVER_TEMPLATE_IDS.has(id);
  // All templates under 3D Spatial category have the Video / 3D switcher!
  const SPATIAL_3D_CATEGORY_IDS = new Set(['money-stack', 
    'jani-forbes-fraud-reveal',
    'og-parallax-depth-engine',
    'spatial-3d-motion-suite',
    'document-3d-fx-engine',
    'jani-puzzle-narrative-suite',
    'jani-countdown-panic-suite',
    'puzzle-piece-reveal',
    '3d-camera-move-rotation',
    'magnates-media-3d-projection',
    'magnates-media-multi-drop-shadows',
    'parallax',
    'zoom',
    'textbehind',
    'docheight'
  ]);
  window.SPATIAL_3D_CATEGORY_IDS = SPATIAL_3D_CATEGORY_IDS;
  const is3DSpatial = (id) => {
    if (!id) return false;
    if (SPATIAL_3D_CATEGORY_IDS.has(id)) return true;
    if (typeof EFFECT_TEMPLATES_DATA !== 'undefined') {
      const t = EFFECT_TEMPLATES_DATA.find(x => x.id === id);
      if (t && t.category === '3D Spatial') return true;
    }
    return false;
  };
  const DEDICATED_CUSTOMIZER_IDS = new Set(['scam-redaction', 'deal-term-sheet', 'pyramid-scheme', 'checklist', 'instagram']);
  const kindOf = (id) => DEDICATED_CUSTOMIZER_IDS.has(id) ? null : (id === 'document-3d-fx-engine' ? 'doc' : (id === 'spatial-3d-motion-suite' ? 'spatial' : (is3DSpatial(id) ? 'dom3d' : (isBridged(id) ? 'generic' : null))));
  const has3D = (k, id) => k === 'spatial' || k === 'doc' || k === 'dom3d' || is3DSpatial(id);
  const stOf = (k) => k === 'spatial' ? spatial3DState : document3DFXState;

  // ---------------------------------------------------------------- store
  let store = {};
  try { store = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; if (store['spatial-3d-motion-suite'] && store['spatial-3d-motion-suite']._v !== 5) { delete store['spatial-3d-motion-suite']; } } catch (_) { store = {}; }
  let saveTimer = null;
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (_) { }
      if (curTpl && typeof window.tplCaptureCurrentSnapshot === 'function') {
        window.tplCaptureCurrentSnapshot(curTpl);
      }
    }, 250);
  }
  function entry(id) {
    if (!store[id]) store[id] = { _v: id === 'spatial-3d-motion-suite' ? 6 : 4, mode: '3d', fx: { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 }, texts: {}, spatial: null, doc: null, snapshot: null };
    if (id === 'spatial-3d-motion-suite' && (!store[id]._v || store[id]._v < 6)) {
      store[id].mode = '3d';
      store[id]._v = 6;
    }
    return store[id];
  }
  window.tpl3DFx = { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 };

  // ---------------------------------------------------------------- text slots
  // Pure parallax defaults to clean canvas (no text by default)
  const SPATIAL_SLOTS = [
    { key: 'title', label: 'Main 3D Title', def: 'THE SYSTEM' },
    { key: 'subtitle', label: 'Sub-Title', def: 'MANIPULATION & CONTROL' },
    { key: 'a-title', label: 'Card A Title', def: 'CONFIDENTIAL SCAN' },
    { key: 'a-sub', label: 'Card A Department', def: 'DEPT. TREASURY // CLASSIFIED' },
    { key: 'b-title', label: 'Card B Title', def: 'FINANCIAL MONOPOLY LEDGER' },
    { key: 'b-sub', label: 'Card B Flow / Detail', def: 'CAPITAL FLOW $84.2B' }
  ];
  const DOC_SLOTS = [
    { key: 'masthead', label: 'Masthead', def: 'THE FINANCIAL GAZETTE' },
    { key: 'headline', label: 'Headline', def: 'Uncovered Files Reveal $4.2B Secret Algorithm Shift' },
    { key: 'quote', label: 'Target Quote / Pop-Out', def: '“Full structural vulnerabilities known since Q3.”' },
    { key: 'byline', label: 'Byline / Subtitle', def: 'Authorison Solezeere • Financial Investigation Desk, Special Market Dispatch' },
    { key: 'dateline', label: 'Dateline Bar', def: 'DATE: 20 October 2021 — IONSDAY, 19 HI 17, 2021 — EDITION: NO. 719' }
  ];
  // slot -> 3D read/write
  function spatialLayer(i) { return spatial3DState.elements3D && spatial3DState.elements3D[i]; }
  const SPATIAL_3D = {
    'title': { l: 0, f: 'title' }, 'subtitle': { l: 0, f: 'subtitle' },
    'a-title': { l: 1, f: 'title' }, 'a-sub': { l: 1, f: 'subtitle' },
    'b-title': { l: 2, f: 'title' }, 'b-sub': { l: 2, f: 'body' }
  };
  const DOC_3D = { masthead: 'header', headline: 'headline', quote: 'quote', body: 'body', dateline: 'dateline', byline: 'byline' };

  function slotsFor(tplId) {
    const k = kindOf(tplId);
    if (k === 'spatial') return SPATIAL_SLOTS;
    if (k === 'doc') return DOC_SLOTS;
    const nodes = videoNodes[tplId] || {};
    return Object.keys(nodes).map((d, i) => ({ key: d, label: 'Text ' + (i + 1), def: d }));
  }
  function get3DText(tplId, slot) {
    const k = kindOf(tplId);
    if (k === 'spatial') {
      const m = SPATIAL_3D[slot.key]; const mesh = m && spatialLayer(m.l);
      if (!mesh) return null;
      const u = mesh.userData; return m.f === 'body' ? (u.body || u.text || '') : (u[m.f] || '');
    }
    if (k === 'doc') { const f = DOC_3D[slot.key]; return f ? document3DFXState[f] : null; }
    return null;
  }

  // ---------------------------------------------------------------- state
  const videoNodes = {};
  let lastKey = '';
  let openLayerIdx = -1;
  let seqNow = 0;
  let resizeObs = null;
  let curTpl = null;

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const lbl = 'font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.6px;';
  const row = (key, label, min, max, step, val, fmt) => `
    <div style="display:flex;flex-direction:column;gap:2px;">
      <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#94a3b8;"><span>${label}</span><span data-val-for="${key}" style="color:#c084fc;font-family:monospace;">${fmt ? fmt(val) : val}</span></div>
      <input type="range" data-k="${key}" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
    </div>`;
  const txt = (key, label, val, area) => `
    <label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">${label}
      ${area ? `<textarea data-k="${key}" rows="3" style="background:#161926;border:1px solid rgba(255,255,255,.1);border-radius:6px;color:#e2e8f0;padding:5px 7px;font-size:11px;resize:vertical;">${esc(val)}</textarea>`
             : `<input type="text" data-k="${key}" value="${esc(val)}" style="background:#161926;border:1px solid rgba(255,255,255,.1);border-radius:6px;color:#e2e8f0;padding:5px 7px;font-size:11px;" />`}
    </label>`;
  const btn = (key, label, on) => `<button type="button" data-act="${key}" style="padding:5px 8px;font-size:10.5px;font-weight:600;border-radius:6px;cursor:pointer;border:1px solid ${on ? 'rgba(168,85,247,.6)' : 'rgba(255,255,255,.1)'};background:${on ? 'rgba(168,85,247,.22)' : 'rgba(255,255,255,.05)'};color:${on ? '#e9d5ff' : '#cbd5e1'};">${label}</button>`;
  const section = (title, inner) => `<div style="display:flex;flex-direction:column;gap:7px;"><span style="${lbl}">${title}</span>${inner}</div>`;
  const selectCss = 'background:#161926;border:1px solid rgba(255,255,255,.1);border-radius:6px;color:#e2e8f0;padding:5px;font-size:11px;';
  const host = () => document.getElementById(HOST_ID);

  // ---------------------------------------------------------------- capture / restore of 3D state
  function capture(tplId) {
    const k = kindOf(tplId); const e = entry(tplId);
    if (k === 'spatial' && spatial3DState.renderer) {
      const s = spatial3DState;
      e.spatial = {
        flightMode: s.flightMode, camSpeed: s.camSpeed, camDrift: s.camDrift, camShake: s.camShake, camPitch: s.camPitch, camYaw: s.camYaw,
        fovWarp: s.fovWarp, fogDensity: s.fogDensity, lightIntensity: s.lightIntensity, gridVisible: s.gridVisible,
        dustVisible: s.dustVisible, activePreset: s.activePreset,
        bgStyle: s.bgStyle, bgColor: s.bgColor, transparentBg: s.transparentBg,
        envStyle: s.envStyle, gridDensity: s.gridDensity, gridSpeed: s.gridSpeed, gridLuminescence: s.gridLuminescence, gridGlow: s.gridGlow, gridColor: s.gridColor,
        starCount: s.starCount, starSize: s.starSize, starSpeed: s.starSpeed, showCelestialObjects: s.showCelestialObjects,
        showText: s.showText, textFont: s.textFont, textStyle: s.textStyle, textPrimaryColor: s.textPrimaryColor, textSecondaryColor: s.textSecondaryColor, textBevel: s.textBevel,
        pathStyle: s.pathStyle, pathCurve: s.pathCurve, drawnPath: s.drawnPath,
        layers: (s.elements3D || []).map(m => {
          const u = m.userData || {};
          return {
            id: u.id, type: u.type,
            artifactMode: u.artifactMode || (u.type === 'text' ? 'text' : 'image'),
            objectShape: u.objectShape || u.objectGeometry || 'icosahedron',
            objectGeometry: u.objectShape || u.objectGeometry || 'icosahedron',
            imageUrl: u.imageUrl || '',
            title: u.title, subtitle: u.subtitle, body: u.body, text: u.text,
            stamp: u.stamp || '',
            transitionEffect: u.transitionEffect || 'fade',
            fontFamily: u.fontFamily || 'Cinzel',
            color: u.color, scale: u.scale || 1,
            x: u.baseX !== undefined ? u.baseX : m.position.x,
            y: u.baseY !== undefined ? u.baseY : m.position.y,
            z: m.position.z
          };
        })
      };
    }
    if (k === 'spatial' && e.spatial) spatial3DState._appliedSig = JSON.stringify([e.spatial, e.texts]);
    persist();
  }
  function ensureDoc(e) {
    if (!e.doc) {
      const d = document3DFXState;
      e.doc = { pitch: 30, yaw: -4, roll: 1, dist: 48, hl: 1, parallax: d.parallax, playbackSpeed: d.playbackSpeed || 1, paperStyle: d.paperStyle,
        highlightColor: d.highlightColor, enableHighlight: d.enableHighlight, enablePopout: d.enablePopout, enableRedaction: d.enableRedaction,
        popElevation: d.popElevation, redactWipe: d.redactWipe, header: d.header, headline: d.headline, dateline: d.dateline, body: d.body, quote: d.quote, byline: d.byline };
    }
    return e.doc;
  }
  function ensurePuzzle(e) {
    if (!e.puzzle) {
      e.puzzle = {
        bgVisible: true,
        bgOpacity: 0.35,
        gridVisible: true,
        watermarkVisible: true,
        thesisVisible: true,
        tileRounding: 4,
        tileGap: 6,
        borderColor: '#1e293b',
        accentColor: '#f59e0b',
        pulseGlow: true
      };
    }
    return e.puzzle;
  }
  window.tplGetPuzzleConfig = function () {
    const e = entry('jani-puzzle-narrative-suite');
    return ensurePuzzle(e);
  };
  function applyDocStatic(e) {
    const p = ensureDoc(e), d = document3DFXState;
    const sig = JSON.stringify([p, e.texts]);
    if (d._appliedSig === sig) return;
    d._appliedSig = sig;
    ['parallax', 'playbackSpeed', 'paperStyle', 'highlightColor', 'enableHighlight', 'enablePopout', 'enableRedaction', 'popElevation', 'redactWipe', 'header', 'headline', 'dateline', 'body', 'quote', 'byline'].forEach(f => { d[f] = p[f]; });
    Object.keys(e.texts).forEach(key => { const f = DOC_3D[key]; if (f) d[f] = e.texts[key]; });
    if (d.popoutMesh) d.popoutMesh.visible = d.enablePopout;
    d._texDirty = true;
  }
  function buildSpatialMesh(item) {
    return item.type === 'text' ? createSpatialTextPlane(item) : (item.type === 'card' || item.type === 'image' || item.type === 'object') ? createSpatialCardPlane(item) : createSpatialCodePlane(item);
  }
  function setSpatialLayers(items) {
    const s = spatial3DState;
    if (!s.scene) return;
    (s.elements3D || []).forEach(m => s.scene.remove(m));
    s.elements3D = [];
    items.forEach(it => { const m = buildSpatialMesh(it); if (m) { s.scene.add(m); s.elements3D.push(m); } });
  }
  function applySpatialStored(e) {
    const s = spatial3DState, sp = e.spatial;
    const sig = JSON.stringify([sp, e.texts]);
    if (s._appliedSig === sig && s.scene) return;
    s._appliedSig = sig;
    if (sp) {
      ['flightMode', 'camSpeed', 'camDrift', 'camShake', 'camPitch', 'camYaw', 'fovWarp', 'fogDensity', 'lightIntensity', 'gridVisible', 'dustVisible', 'activePreset', 'bgStyle', 'bgColor', 'transparentBg', 'envStyle', 'gridDensity', 'gridSpeed', 'gridLuminescence', 'gridGlow', 'gridColor', 'starCount', 'starSize', 'starSpeed', 'showCelestialObjects', 'showText', 'textFont', 'textStyle', 'textPrimaryColor', 'textSecondaryColor', 'textBevel', 'pathStyle', 'pathCurve', 'drawnPath'].forEach(f => { if (sp[f] !== undefined) s[f] = sp[f]; });
      if (sp.layers && sp.layers.length) setSpatialLayers(sp.layers);
    }
    if (s.camera) { s.camera.fov = s.fovWarp; s.camera.updateProjectionMatrix(); }
    if (s.scene && s.scene.fog) s.scene.fog.density = 0.0001 + (s.fogDensity / 100) * 0.0008;
    if (s.ambientLight) s.ambientLight.intensity = (s.lightIntensity / 100) * 0.95;
    if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid();
    else if (s.floorGrid) s.floorGrid.visible = s.gridVisible;
    if (s.particlesMesh) s.particlesMesh.visible = s.dustVisible;
    // unified text overrides
    Object.keys(e.texts).forEach(key => {
      const m = SPATIAL_3D[key]; if (!m) return;
      rebuildSpatialLayer(m.l, m.f === 'body' ? { body: e.texts[key], text: e.texts[key] } : { [m.f]: e.texts[key] }, true);
    });
  }
  function rebuildSpatialLayer(i, patch, silent) {
    const s = spatial3DState, old = s.elements3D[i];
    if (!old || !s.scene) return;
    const u = old.userData;
    const item = Object.assign({}, u, { x: u.baseX !== undefined ? u.baseX : old.position.x, y: u.baseY !== undefined ? u.baseY : old.position.y, z: old.position.z }, patch);
    if (item.type === 'code') { item.text = item.body = patch.body != null ? patch.body : (u.body || u.text); }
    const mesh = buildSpatialMesh(item);
    if (!mesh) return;
    mesh.userData.initialZ = item.z;
    s.scene.remove(old);
    if (old.geometry) old.geometry.dispose();
    if (old.material) { if (old.material.map) old.material.map.dispose(); old.material.dispose(); }
    s.scene.add(mesh);
    s.elements3D[i] = mesh;
  }

  // ---------------------------------------------------------------- analytic drivers (shared by customizer + timeline)
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const easeIO = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const backOut = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  function driveSpatial(e, t) {
    const s = spatial3DState;
    s.isPlaying = false;
    const speed = s.camSpeed !== undefined ? s.camSpeed : 1.0;
    const absSpeed = Math.max(0.1, Math.abs(speed));
    // Full sequence cycle traversal: slow speeds take longer, high speeds fly faster, but ALL speeds traverse 100% of runway!
    const cycleDuration = 10 / absSpeed;
    const progress = (t % cycleDuration) / cycleDuration;
    if (speed < 0) {
      s.currentTime = 1.0 - progress;
    } else {
      s.currentTime = progress;
    }
  }
  function driveDoc(e, t) {
    const d = document3DFXState, p = ensureDoc(e);
    const dragging = d.isDraggingCanvas;
    const a = easeIO(clamp01(t / 3.5) );
    const dp = 7 * a, dy = 45 * a, dr = -20 * a, dd = -10 * a;
    if (dragging) { p.pitch = d.pitch - dp; p.yaw = d.yaw - dy; p.roll = d.roll - dr; p.dist = d.dist - dd; }
    d.pitch = p.pitch + dp; d.yaw = p.yaw + dy; d.roll = p.roll + dr; d.dist = p.dist + dd;
    const h = clamp01((t - 0.8) / 2.2); const hl = (1 - (1 - h) * (1 - h)) * p.hl;
    if (Math.abs(hl - d.hlProgress) > 0.004 || d._texDirty) { d.hlProgress = hl; d._texDirty = false; renderDocFXTexture(); }
    if (d.popoutMesh) d.popoutMesh.position.z = p.popElevation * 0.4 * backOut(clamp01((t - 1.2) / 2.0));
    updateDocFXCameraTransform();
  }

  // ---------------------------------------------------------------- engines (shared, offscreen-capable)
  let holder = null;
  function getHolder() {
    if (!holder || !holder.isConnected) {
      holder = document.createElement('div');
      holder.id = 'tpl3d-offscreen';
      holder.style.cssText = `position:fixed;left:-99999px;top:0;width:${RW}px;height:${RH}px;overflow:hidden;pointer-events:none;`;
      document.body.appendChild(holder);
    }
    return holder;
  }
  function startLoop(k) {
    const st = stOf(k);
    if (st.animId) cancelAnimationFrame(st.animId);
    const tick = () => {
      if (!st.renderer) { st.animId = null; return; }
      const tplId = k === 'spatial' ? 'spatial-3d-motion-suite' : 'document-3d-fx-engine';
      const e = entry(tplId);
      if (k === 'spatial') {
        driveSpatial(e, seqNow);
        updateSpatialCameraPosition();
        if (st.particlesMesh && st.dustVisible) { st.particlesMesh.rotation.y += 0.0003; st.particlesMesh.rotation.x += 0.0001; }
      } else {
        driveDoc(e, seqNow);
        if (st.controls) st.controls.update();
      }
      st.renderer.render(st.scene, st.camera);
      st.animId = requestAnimationFrame(tick);
    };
    st.animId = requestAnimationFrame(tick);
  }
  function stopLoop(k) { const st = stOf(k); if (st.animId) { cancelAnimationFrame(st.animId); st.animId = null; } }

  function s_applyFirst(e, tplId) { applySpatialStored(e); if (!e.spatial) capture(tplId); }
  // make sure engine exists & has this entry applied; container = where renderer should live
  function ensureEngine(k, container) {
    const tplId = k === 'spatial' ? 'spatial-3d-motion-suite' : 'document-3d-fx-engine';
    const e = entry(tplId), st = stOf(k);
    const cid = k === 'spatial' ? 'spatial-threejs-container' : 'doc-threejs-container';
    if (!st.renderer) {
      // free the id if a stale element still owns it
      document.querySelectorAll('#' + cid).forEach(n => { if (n !== container) n.removeAttribute('id'); });
      container.id = cid;
      if (k === 'spatial') initSpatialThreeJSEngine(); else initDocument3DFXEngine();
      stopLoop(k); // engine's own loop; replaced by ours
      if (k === 'doc' && window.gsap) { if (document3DFXState.animTween) document3DFXState.animTween.kill(); gsap.killTweensOf(document3DFXState); }
      if (k === 'spatial') { s_applyFirst(e, tplId); }
      else { applyDocStatic(e); }
    } else {
      if (st.renderer.domElement.parentNode !== container) { container.innerHTML = ''; container.appendChild(st.renderer.domElement); }
      if (k === 'spatial') applySpatialStored(e); else applyDocStatic(e);
    }
    return st;
  }

  // ---------------------------------------------------------------- inspector UI
  function build(tplId) {
    const h = host(); const k = kindOf(tplId);
    if (!h) return;
    if (!k) { h.style.display = 'none'; h.innerHTML = ''; return; }
    h.style.display = 'flex';
    const e = entry(tplId); const fx = e.fx;
    const mode = has3D(k, tplId) ? e.mode : 'video';
    let html = `<div style="display:flex;align-items:center;justify-content:space-between;"><span style="${lbl}">Effect Controls</span>`;
    if (has3D(k, tplId)) {
      html += `<div style="display:flex;gap:3px;background:rgba(18,19,28,.9);padding:2px;border-radius:8px;border:1px solid rgba(255,255,255,.08);">
        <button type="button" data-act="mode-video" style="padding:3px 10px;font-size:10.5px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:${mode === 'video' ? 'rgba(168,85,247,.35)' : 'transparent'};color:${mode === 'video' ? '#fff' : '#94a3b8'};">\u25b6 Video</button>
        <button type="button" data-act="mode-3d" style="padding:3px 10px;font-size:10.5px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:${mode === '3d' ? 'rgba(168,85,247,.35)' : 'transparent'};color:${mode === '3d' ? '#fff' : '#94a3b8'};">\u2b21 3D</button></div>`;
    }
    html += `</div>`;

    // shared text section (same fields in Video and 3D)
    const slots = slotsFor(tplId);
    const textHtml = slots.map((sl, i) => {
      let v = e.texts[sl.key];
      if (v == null) v = (mode === '3d' ? get3DText(tplId, sl) : null);
      if (v == null) v = sl.def != null ? sl.def : '';
      return txt('tx-' + i, sl.label, v);
    }).join('');

    if (mode === 'video' || k === 'dom3d') {
      if (mode === '3d' && k === 'dom3d') {
        html += `<div style="background:linear-gradient(135deg, rgba(168,85,247,0.18), rgba(56,189,248,0.12));border:1px solid rgba(192,132,252,0.45);border-radius:8px;padding:8px 10px;display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:15px;">\ud83d\udd90\ufe0f</span>
          <div style="display:flex;flex-direction:column;gap:1px;">
            <span style="font-size:10.5px;font-weight:800;color:#f3e8ff;letter-spacing:0.04em;">INTERACTIVE 3D HAND ORBIT ACTIVE</span>
            <span style="font-size:9.5px;color:#cbd5e1;">Grab &amp; drag the stage to tilt/rotate in 3D \u2022 Scroll wheel to zoom</span>
          </div>
        </div>`;
      }
      html += section(mode === '3d' ? '3D Camera Rig & Orbit' : 'Motion', [
        row('v-speed', 'Playback Speed', -3.0, 3.0, 0.1, fx.speed, v => (v >= 0 ? '+' : '') + v.toFixed(1) + 'x'),
        row('v-pitch', 'Tilt Pitch (X)', -45, 45, 1, fx.pitch, v => v + '\u00b0'),
        row('v-yaw', 'Rotation Yaw (Y)', -45, 45, 1, fx.yaw, v => v + '\u00b0'),
        row('v-roll', 'Roll (Z)', -30, 30, 1, fx.roll, v => v + '\u00b0'),
        row('v-zoom', 'Zoom / Depth', 0.6, 2.2, 0.05, fx.zoom, v => v.toFixed(2) + 'x'),
        `<button type="button" data-act="v-reset" style="padding:5px;font-size:10.5px;border-radius:6px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;">Reset 3D Camera</button>`
      ].join(''));

      if (tplId === 'jani-puzzle-narrative-suite') {
        const pz = ensurePuzzle(e);
        html += section('Layer Visibility', [
          `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${btn('pz-toggle-bg', 'Background Image', pz.bgVisible)}
            ${btn('pz-toggle-grid', 'Puzzle Pieces (3x3)', pz.gridVisible)}
            ${btn('pz-toggle-thesis', 'Editorial Thesis Card', pz.thesisVisible)}
            ${btn('pz-toggle-watermark', 'Watermark Title', pz.watermarkVisible)}
          </div>`
        ].join(''));

        html += section('Tile Shape & Layout', [
          row('pz-rounding', 'Corner Rounding', 0, 16, 1, pz.tileRounding, v => v + 'px'),
          row('pz-gap', 'Tile Spacing / Dispersion', 0, 16, 1, pz.tileGap, v => v + 'px'),
          row('pz-bgop', 'Backdrop Scene Opacity', 0, 100, 5, Math.round(pz.bgOpacity * 100), v => v + '%')
        ].join(''));

        html += section('Colors & Borders', [
          `<div style="display:flex;gap:12px;align-items:center;padding:4px 0;">
            <label style="display:flex;align-items:center;gap:6px;font-size:10.5px;color:#94a3b8;flex:1;">
              Accent Glow
              <input type="color" data-k="pz-accent" value="${pz.accentColor}" style="border:none;background:transparent;cursor:pointer;width:24px;height:24px;padding:0;" />
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:10.5px;color:#94a3b8;flex:1;">
              Tile Border
              <input type="color" data-k="pz-border" value="${pz.borderColor}" style="border:none;background:transparent;cursor:pointer;width:24px;height:24px;padding:0;" />
            </label>
          </div>`
        ].join(''));
      }

      // Text is optional with a clean + Add Text button
      const hasAnyText = slots.some(sl => {
        const val = e.texts[sl.key] != null ? e.texts[sl.key] : sl.def;
        return val && val.trim().length > 0;
      });
      if (hasAnyText || e.showTextSection) {
        html += section('Text & Kinetic Titles', `
          <div style="display:flex;justify-content:flex-end;margin-bottom:6px;">
            <button type="button" data-act="clear-all-text-slots" style="font-size:9.5px;padding:2px 6px;border-radius:4px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;cursor:pointer;">Clear All Text</button>
          </div>
          ${textHtml}
        `);
      } else {
        html += `<div style="background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.1);border-radius:6px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:10.5px;color:#64748b;">No text overlays active (Clean Canvas)</span>
          <button type="button" data-act="add-kinetic-slot" style="font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:5px;background:rgba(56,189,248,0.2);border:1px solid rgba(56,189,248,0.5);color:#38bdf8;cursor:pointer;">+ Add Text</button>
        </div>`;
      }
    } else if (k === 'spatial') {
      const s = spatial3DState;

      // Section 1: Typography Granularity (Beyond Gold)
      const textSectionHeader = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:11px;font-weight:700;color:#e2e8f0;">Headline Typography</span>
        <button type="button" data-act="s-toggle-text" style="padding:4px 9px;font-size:10px;font-weight:700;border-radius:6px;border:1px solid ${s.showText !== false ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'};background:${s.showText !== false ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};color:${s.showText !== false ? '#6ee7b7' : '#fca5a5'};cursor:pointer;">${s.showText !== false ? '✓ Text Visible' : '⊘ Hidden (Pure 3D Universe)'}</button>
      </div>`;

      const textControls = [
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Headline Font Family
          <select data-k="s-text-font" style="${selectCss}">${[
            'Cinzel:Cinzel (Imperial Serif)',
            'Playfair Display:Playfair Display (Editorial High-Fashion)',
            'JetBrains Mono:JetBrains Mono (Technical Dossier)',
            'Inter:Inter (Clean Ultra-Modern)',
            'Impact:Impact (Punchy Title)'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.textFont || 'Cinzel') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Typography Shader Style
          <select data-k="s-text-style" style="${selectCss}">${[
            'gold:Imperial 24K Gold Foil (Default)',
            'chrome:Platinum Mirror Chrome',
            'cyan:Quantum Neon Cyan',
            'emerald:Syndicate Emerald Green',
            'crimson:Dark Power Blood Crimson',
            'white:Pure Titanium White',
            'custom:Custom Two-Tone Gradient'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.textStyle || 'gold') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        s.textStyle === 'custom' ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px 0;">
          <label style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#94a3b8;">Color 1 <input type="color" data-k="s-text-c1" value="${s.textPrimaryColor || '#f59e0b'}" style="border:none;width:28px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
          <label style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#94a3b8;">Color 2 <input type="color" data-k="s-text-c2" value="${s.textSecondaryColor || '#fde68a'}" style="border:none;width:28px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
        </div>` : '',
        row('s-text-bevel', '3D Bevel Depth', 1, 6, 1, s.textBevel || 3, v => v + ' layers'),
        s.showText !== false ? textHtml : '<div style="font-size:10.5px;color:#94a3b8;font-style:italic;padding:6px 0;">Headline typography hidden. Camera navigates purely through 3D floating exhibits & celestial objects in space.</div>'
      ].join('');

      html += section('Text Overlays & Typography', textSectionHeader + textControls);

      // Section 2: Camera Rig, Velocity Normalization & Path Drawer
      const pathMiniCanvas = `<div style="background:#0b0f19;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 10px;margin-top:6px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:10px;font-weight:700;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.5px;">Flight Runway / Road Path</span>
          <button type="button" data-act="s-reset-path" style="font-size:9.5px;color:#a855f7;background:transparent;border:none;cursor:pointer;text-decoration:underline;">Reset Center</button>
        </div>
        <canvas id="spatial-path-canvas" width="220" height="75" style="width:100%;height:75px;background:#05070c;border:1px solid rgba(168,85,247,0.3);border-radius:6px;cursor:crosshair;touch-action:none;display:block;"></canvas>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:#64748b;margin-top:4px;">
          <span>← Left Wall</span>
          <span style="color:#c084fc;">Drag to shape flight path</span>
          <span>Right Wall →</span>
        </div>
      </div>`;

      html += section('Camera Rig & Flight Path', [
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Flight Mode
          <select data-k="flight" style="${selectCss}">${[
            'zoomthrough:Zoom In (Hallway Fly-Through)',
            'pullback:Zoom Out (Reverse Pullback)',
            'slalom:S-Curve Slalom Weave',
            'orbit:360\\u00b0 Panoramic Orbit Tour',
            'custom-path:Custom Drawn Trajectory'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${s.flightMode === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Runway Path Style
          <select data-k="s-pathstyle" style="${selectCss}">${[
            'corridor-hallway:Hallway Corridor (Flanking Left/Right)',
            'straight:Straight Center Runway',
            'slalom:Sinusoidal S-Weave',
            'cosmic-wave:Cosmic Wave & Undulation',
            'custom:Interactive Custom Drawn Path'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.pathStyle || 'straight') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        row('s-speed', 'Zoom Speed (Z-Velocity - Bidirectional)', -3.0, 3.0, 0.1, s.camSpeed !== undefined ? s.camSpeed : 1.0, v => (v >= 0 ? '+' : '') + v.toFixed(1) + 'x'),
        row('s-shake', 'Handheld Camera Shake (Human Imperfection)', 0, 100, 1, s.camShake !== undefined ? s.camShake : 15, v => v + '%'),
        row('s-pathcurve', 'Runway Banking / Curve', -100, 100, 1, s.pathCurve || 0, v => (v > 0 ? '+' : '') + v + '%'),
        pathMiniCanvas,
        row('s-drift', 'X/Y Motion Drift', 0, 100, 1, s.camDrift, v => v + '%'),
        row('s-fov', 'Vertigo / FOV Warp', 30, 90, 1, s.fovWarp, v => v + '\\u00b0'),
        row('s-pitch', 'Tilt Pitch (X)', -45, 45, 1, Math.round(s.camPitch), v => v + '\\u00b0'),
        row('s-yaw', 'Rotation Yaw (Y)', -65, 65, 1, Math.round(s.camYaw), v => v + '\\u00b0')
      ].join(''));

      // Section 3: Modular Background Architecture
      html += section('Background Architecture', [
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Background Environment Mode
          <select data-k="s-bgstyle" style="${selectCss}">${[
            'grid-stars:Hybrid Grid Corridor + Starfield',
            'pitch-dark:100% Pitch Black Void (Stark Contrast)',
            'grid-only:Architectural / Cyber Grid Corridor Only',
            'stars-only:Deep Cosmos Void (Pure Stars)'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.bgStyle || 'grid-stars') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;">
          <label style="display:flex;align-items:center;gap:8px;font-size:10px;color:#94a3b8;">Backdrop Base Tint <input type="color" data-k="s-bgcolor" value="${s.bgColor || '#07080c'}" style="border:none;width:30px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
          <button type="button" data-act="s-toggle-alpha" style="padding:4px 9px;font-size:10px;font-weight:700;border-radius:6px;border:1px solid ${s.transparentBg ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.15)'};background:${s.transparentBg ? 'rgba(16,185,129,0.15)' : 'transparent'};color:${s.transparentBg ? '#6ee7b7' : '#94a3b8'};cursor:pointer;">${s.transparentBg ? '⊞ Alpha Transparent' : '■ Solid Backdrop'}</button>
        </div>`,
        row('s-fog', 'Atmospheric Fog Density', 0, 100, 1, s.fogDensity, v => v + '%'),
        row('s-light', 'Ambient Lighting Glow', 20, 200, 1, s.lightIntensity, v => v + '%')
      ].join(''));

      // Section 4: Grid Density, Cell Spacing & Conveyor Flow
      html += section('Grid Tunnel & Luminescence', [
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Tunnel Architectural Preset
          <select data-k="s-env" style="${selectCss}">${[
            'tunnel-cyan:Cyber Grid Tunnel (Image 2)',
            'tunnel-gold:Gold Documentary Tunnel (Image 2)',
            'tunnel-slate:Slate Architectural Tunnel',
            'open-stars:Floor Grid & Cosmic Starfield (Image 1)',
            'deep-cosmos:Deep Cosmos Void (Pure Stars)'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.envStyle || 'tunnel-cyan') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        row('s-grid-density', 'Grid Density / Cell Mesh', 20, 120, 2, s.gridDensity || 60, v => v + ' divisions'),
        row('s-grid-speed', 'Grid Conveyor Streaming Speed', 0, 3, 0.1, s.gridSpeed !== undefined ? s.gridSpeed : 1.0, v => v.toFixed(1) + 'x'),
        row('s-lum', 'Grid Line Luminescence / Brightness', 0, 200, 1, s.gridLuminescence !== undefined ? s.gridLuminescence : 100, v => v + '%'),
        row('s-gridglow', 'Grid Light Glow / Point Intensity', 0, 200, 1, s.gridGlow !== undefined ? s.gridGlow : 100, v => v + '%'),
        `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;">
          <label style="display:flex;align-items:center;gap:8px;font-size:10px;color:#94a3b8;">Grid Line Color <input type="color" data-k="s-gridcolor" value="${s.gridColor || '#06b6d4'}" style="border:none;width:30px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
          ${btn('s-grid', '⊞ Grid Active', s.gridVisible)}
        </div>`
      ].join(''));

      // Section 5: Starfield & Cosmic Dust Granularity
      html += section('Starfield & Cosmic Dust', [
        row('s-star-count', 'Star Count', 100, 2500, 50, s.starCount || 1200, v => v + ' stars'),
        row('s-star-size', 'Star Particle Size', 1, 10, 0.2, s.starSize || 4.8, v => v.toFixed(1) + 'px'),
        row('s-star-speed', 'Starfield Drift & Twinkle Speed', 0, 3, 0.1, s.starSpeed !== undefined ? s.starSpeed : 1.0, v => v.toFixed(1) + 'x'),
        `<div style="display:flex;gap:6px;">${btn('s-dust', '✦ Stars Active', s.dustVisible)}${btn('s-toggle-celestial', '⬡ Celestial 3D Objects', s.showCelestialObjects !== false)}</div>`
      ].join(''));

      // Section 6: Presets
      html += section('Presets', `<div style="display:flex;gap:6px;flex-wrap:wrap;">${[
        'forbes-hallway:Forbes Museum Tour (James Jani)',
        'docu-essay:Docu-Essay (Gallery)',
        'cyber-matrix:Cyber Matrix (Image 2)',
        'philosophy:Philosophy (Gold)',
        'cosmic-universe:Cosmic Universe (Stars)'
      ].map(o => { const [v, n] = o.split(':'); return btn('preset-' + v, n, s.activePreset === v); }).join('')}</div>`);

      // Section 7: Corridor Exhibits & 3D Layers
      html += section('Corridor Exhibits & 3D Layers', `<div id="tpl3d-layers" style="display:flex;flex-direction:column;gap:6px;"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;"><button type="button" data-act="s-add-artifact" style="padding:6px;font-size:10px;font-weight:700;border-radius:6px;border:1px dashed rgba(212,175,55,.6);background:rgba(212,175,55,.1);color:#fef08a;cursor:pointer;">+ Image / 3D Celestial</button><button type="button" data-act="s-add" style="padding:6px;font-size:10px;font-weight:700;border-radius:6px;border:1px dashed rgba(168,85,247,.5);background:transparent;color:#d8b4fe;cursor:pointer;">+ Hero Title Plane</button></div>`);
    } else {
      const p = ensureDoc(e);
      html += section('Text', textHtml);
      html += section('Camera', [
        row('d-pitch', 'Tilt Pitch (X)', 0, 75, 1, Math.round(p.pitch), v => v + '\u00b0'),
        row('d-yaw', 'Rotation Yaw (Y)', -60, 60, 1, Math.round(p.yaw), v => v + '\u00b0'),
        row('d-roll', 'Roll (Z)', -45, 45, 1, Math.round(p.roll), v => v + '\u00b0'),
        row('d-dist', 'Camera Distance', 20, 110, 1, Math.round(p.dist), v => v),
        row('d-parallax', 'Parallax Strength', 0, 4, 0.1, p.parallax, v => v.toFixed(1) + 'x')
      ].join(''));
      html += section('Paper', `<select data-k="d-paper" style="${selectCss}">${['aged:Aged Newsprint', 'stark:Stark White', 'darkmode:Dark Mode', 'manuscript:Manuscript'].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${p.paperStyle === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>`);
      html += section('Layers', [
        `<div style="display:flex;gap:6px;flex-wrap:wrap;">${btn('d-hl', 'Highlighter', p.enableHighlight)}${btn('d-pop', 'Pop-out Headline', p.enablePopout)}${btn('d-red', 'Redaction', p.enableRedaction)}</div>`,
        row('d-hlprog', 'Highlight Amount', 0, 100, 1, Math.round(p.hl * 100), v => v + '%'),
        row('d-popelev', 'Pop-out Elevation', 0, 20, 0.5, p.popElevation, v => v),
        row('d-redwipe', 'Redaction Wipe', 0, 100, 1, Math.round(p.redactWipe * 100), v => v + '%'),
        `<label style="display:flex;align-items:center;gap:8px;font-size:10.5px;color:#94a3b8;">Highlight Color <input type="color" data-k="d-hlcolor" value="${p.highlightColor}" /></label>`
      ].join(''));
    }
    h.innerHTML = html;
    if (mode === '3d' && k === 'spatial') renderSpatialLayers();
  }

  function renderSpatialLayers() {
    const box = document.getElementById('tpl3d-layers'); if (!box) return;
    const list = spatial3DState.elements3D || [];
    box.innerHTML = list.map((m, i) => {
      const u = m.userData || {}; const open = openLayerIdx === i; const color = u.color || '#f59e0b';
      const curMode = u.artifactMode || (u.type === 'object' ? 'object' : (u.type === 'card' ? 'card' : 'image'));
      const curShape = u.objectShape || u.objectGeometry || 'icosahedron';
      const curTrans = u.transitionEffect || 'fade';
      const curFont = u.fontFamily || 'Cinzel';
      const posXVal = Math.round(u.baseX !== undefined ? u.baseX : m.position.x);
      const posYVal = Math.round(u.baseY !== undefined ? u.baseY : m.position.y);

      const editor = !open ? '' : `<div style="display:flex;flex-direction:column;gap:7px;padding:8px 2px 2px;">
        ${u.type !== 'text' && u.type !== 'code' ? `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Artifact Archetype
          <select data-k="l-mode-${i}" style="${selectCss}">
            <option value="forbes" ${curMode === 'forbes' ? 'selected' : ''}>📰 James Jani Forbes 3D Cover (Beam & Flashes)</option>
            <option value="image" ${curMode === 'image' ? 'selected' : ''}>🖼️ Archival Photograph Plate</option>
            <option value="object" ${curMode === 'object' ? 'selected' : ''}>⬡ 3D Celestial / Wireframe Object</option>
            <option value="card" ${curMode === 'card' ? 'selected' : ''}>📄 Frosted Dossier Text Slate</option>
            <option value="chart" ${curMode === 'chart' ? 'selected' : ''}>📈 Financial Candlestick / Graph Trend Slate</option>
          </select>
        </label>` : ''}

        ${curMode === 'object' ? `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Celestial 3D Shape
          <select data-k="l-shape-${i}" style="${selectCss}">
            <option value="icosahedron" ${curShape === 'icosahedron' ? 'selected' : ''}>✦ Icosahedron Cosmic Gem</option>
            <option value="torus" ${curShape === 'torus' ? 'selected' : ''}>◎ Stargate Celestial Ring</option>
            <option value="octahedron" ${curShape === 'octahedron' ? 'selected' : ''}>◇ Quantum Diamond Crystal</option>
            <option value="dodecahedron" ${curShape === 'dodecahedron' ? 'selected' : ''}>⬢ Stellar Polyhedron</option>
            <option value="monolith" ${curShape === 'monolith' ? 'selected' : ''}>▮ Sci-Fi Space Monolith</option>
          </select>
        </label>` : ''}

        
        ${curMode === 'forbes' ? `<div style="background:#090d16;padding:8px;border-radius:6px;border:1px solid rgba(56,189,248,0.25);display:flex;flex-direction:column;gap:6px;">
          <div style="font-size:10px;font-weight:700;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;">Forbes Magazine Customization</div>
          ${txt('l-magtitle-' + i, 'Magazine Masthead Title', u.magazineTitle || 'Forbes')}
          ${txt('l-featuretag-' + i, 'Feature Tagline', u.featureTag || 'SPECIAL REPORT // THE ARCHITECT')}
          ${txt('l-featuretitle-' + i, 'Feature Headline', u.featureTitle || u.title || 'THE $30 BILLION FRAUD')}
          ${txt('l-kicker-' + i, 'Kicker Badge', u.kickerBadge || 'EXPOSED')}
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#94a3b8;padding:2px 0;">
            <span>Anamorphic Beam Color</span>
            <input type="color" data-k="l-beamcol-${i}" value="${u.beamColor || '#38bdf8'}" style="border:none;width:28px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" />
          </div>
        </div>` : ''}
${u.type !== 'text' && (curMode === 'image' || curMode === 'forbes') ? `<div style="background:#090d16;padding:7px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:6px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:10px;font-weight:700;color:#cbd5e1;">Image Asset</span>
            <div style="display:flex;gap:4px;">
              <input type="file" id="l-file-input-${i}" accept="image/*" style="display:none;" />
              <button type="button" data-act="l-pick-file-${i}" style="padding:2px 8px;font-size:9.5px;font-weight:600;border-radius:4px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.12);color:#38bdf8;cursor:pointer;">📁 Upload / Replace</button>
              <button type="button" data-act="l-remove-img-${i}" style="padding:2px 8px;font-size:9.5px;font-weight:600;border-radius:4px;border:1px solid rgba(239,68,68,0.4);background:rgba(239,68,68,0.1);color:#fca5a5;cursor:pointer;">❌ Remove Image</button>
            </div>
          </div>
          ${txt('l-img-' + i, 'Image URL', u.imageUrl || '')}
        </div>` : ''}

        ${u.type !== 'text' && u.type !== 'code' ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Entrance Effect
            <select data-k="l-trans-${i}" style="${selectCss}">
              <option value="fade" ${curTrans === 'fade' ? 'selected' : ''}>Fade Dissolve</option>
              <option value="slide-in" ${curTrans === 'slide-in' ? 'selected' : ''}>Slide In from Wall</option>
              <option value="scale-pop" ${curTrans === 'scale-pop' ? 'selected' : ''}>Scale Pop-Up</option>
              <option value="yaw-drift" ${curTrans === 'yaw-drift' ? 'selected' : ''}>Yaw Angle Drift</option>
            </select>
          </label>
          <label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Card Font
            <select data-k="l-font-${i}" style="${selectCss}">
              <option value="Cinzel" ${curFont === 'Cinzel' ? 'selected' : ''}>Cinzel (Serif)</option>
              <option value="JetBrains Mono" ${curFont === 'JetBrains Mono' ? 'selected' : ''}>JetBrains Mono</option>
              <option value="Inter" ${curFont === 'Inter' ? 'selected' : ''}>Inter (Sans)</option>
              <option value="Playfair Display" ${curFont === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
              <option value="Impact" ${curFont === 'Impact' ? 'selected' : ''}>Impact</option>
            </select>
          </label>
        </div>` : ''}

        ${txt('l-title-' + i, 'Title', u.title || '')}
        ${u.type !== 'code' ? txt('l-sub-' + i, 'Subtitle / Classification', u.subtitle || '') : ''}
        ${u.type !== 'text' && curMode === 'image' ? txt('l-stamp-' + i, 'Security Stamp (e.g. CLASSIFIED, VERIFIED)', u.stamp || '') : ''}
        ${u.type !== 'text' ? txt('l-body-' + i, u.type === 'code' ? 'Code Lines' : 'Dossier Body Text', u.body || u.text || '', true) : ''}
        ${row('l-z-' + i, 'Depth (Z)', -5000, 1500, 10, Math.round(m.position.z), v => v)}
        ${row('l-x-' + i, 'Position X', -1500, 1500, 10, posXVal, v => v)}
        ${row('l-y-' + i, 'Position Y', -1000, 1000, 10, posYVal, v => v)}
        ${row('l-scale-' + i, 'Scale', 0.3, 3, 0.05, u.scale || 1, v => Number(v).toFixed(2) + 'x')}
        <label style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#94a3b8;padding:2px 0;">Accent Color <input type="color" data-k="l-color-${i}" value="${/^#[0-9a-f]{6}$/i.test(color) ? color : '#D4AF37'}" style="border:none;width:28px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
      </div>`;

      return `<div style="background:#121520;border:1px solid ${open ? 'rgba(168,85,247,.55)' : 'rgba(255,255,255,.08)'};border-radius:8px;padding:7px 9px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <div data-act="l-toggle-${i}" style="display:flex;align-items:center;gap:7px;cursor:pointer;overflow:hidden;flex:1;">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>
            <span style="font-size:11px;font-weight:700;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.title || (u.type === 'text' ? '3D Title Plane' : 'Corridor Slate')}</span>
            <span style="font-size:9.5px;color:#94a3b8;font-family:monospace;">Z:${Math.round(m.position.z)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <button type="button" data-act="l-up-${i}" style="background:transparent;border:none;color:#94a3b8;font-size:10px;cursor:pointer;padding:2px 4px;">▲</button>
            <button type="button" data-act="l-down-${i}" style="background:transparent;border:none;color:#94a3b8;font-size:10px;cursor:pointer;padding:2px 4px;">▼</button>
            <button type="button" data-act="l-del-${i}" style="background:transparent;border:none;color:#ef4444;font-size:11px;cursor:pointer;padding:2px 4px;">×</button>
          </div>
        </div>
        ${editor}
      </div>`;
    }).join('');

    initSpatialPathCanvas();
  }

  function initSpatialPathCanvas() {
    const canvas = document.getElementById('spatial-path-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = spatial3DState;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height;

      // Draw Corridor Boundaries
      ctx.strokeStyle = 'rgba(6,182,212,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(25, 6); ctx.lineTo(25, h - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 25, 6); ctx.lineTo(w - 25, h - 6); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(w / 2, 6); ctx.lineTo(w / 2, h - 6); ctx.stroke();
      ctx.setLineDash([]);

      // Flight Path
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(192,132,252,0.8)';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let px = 0;
        if (s.pathStyle === 'slalom' || s.flightMode === 'slalom') {
          px = Math.sin(t * Math.PI * 3) * 55;
        } else if (s.pathStyle === 'cosmic-wave') {
          px = Math.sin(t * Math.PI * 2) * 50;
        } else if (s.drawnPath && s.drawnPath.length >= 2) {
          const sampleX = sampleDrawnPathX(s.drawnPath, t);
          px = (sampleX / 740) * (w / 2 - 30);
        } else {
          const curveOffset = (s.pathCurve || 0) * 0.6;
          px = Math.sin(t * Math.PI) * curveOffset;
        }
        const canvasX = (w / 2) + px;
        const canvasY = 8 + t * (h - 16);
        if (i === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Current Camera Live Position Dot
      const currentT = Math.max(0, Math.min(1, s.currentTime || 0));
      let curPx = 0;
      if (s.pathStyle === 'slalom' || s.flightMode === 'slalom') {
        curPx = Math.sin(currentT * Math.PI * 3) * 55;
      } else if (s.drawnPath && s.drawnPath.length >= 2) {
        curPx = (sampleDrawnPathX(s.drawnPath, currentT) / 740) * (w / 2 - 30);
      } else {
        curPx = Math.sin(currentT * Math.PI) * ((s.pathCurve || 0) * 0.6);
      }
      const curX = (w / 2) + curPx;
      const curY = 8 + currentT * (h - 16);

      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(curX, curY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    draw();

    let drawing = false;
    let strokePoints = [];

    const onPointer = (ev) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = ev.clientX !== undefined ? ev.clientX : (ev.touches && ev.touches[0].clientX);
      const clientY = ev.clientY !== undefined ? ev.clientY : (ev.touches && ev.touches[0].clientY);
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const normT = Math.max(0, Math.min(1, (y - 8) / (rect.height - 16)));
      const normX = ((x - rect.width / 2) / (rect.width / 2 - 30)) * 740;

      strokePoints.push({ t: normT, x: Math.max(-740, Math.min(740, normX)) });
      strokePoints.sort((a, b) => a.t - b.t);

      s.pathStyle = 'custom';
      s.flightMode = 'custom-path';
      s.drawnPath = strokePoints.slice();

      const selMode = host()?.querySelector('[data-k="flight"]');
      const selStyle = host()?.querySelector('[data-k="s-pathstyle"]');
      if (selMode) selMode.value = 'custom-path';
      if (selStyle) selStyle.value = 'custom';

      draw();
      persist();
    };

    canvas.onpointerdown = (ev) => {
      drawing = true;
      strokePoints = [];
      try { canvas.setPointerCapture(ev.pointerId); } catch (_) {}
      onPointer(ev);
    };

    canvas.onpointermove = (ev) => {
      if (!drawing) return;
      onPointer(ev);
    };

    const stopDraw = (ev) => {
      if (!drawing) return;
      drawing = false;
      try { canvas.releasePointerCapture(ev.pointerId); } catch (_) {}
      persist();
    };

    canvas.onpointerup = stopDraw;
    canvas.onpointercancel = stopDraw;
  }

  function setLabel(key, s) { const el = host() && host().querySelector(`[data-val-for="${key}"]`); if (el) el.textContent = s; }

  // text edit -> store + video node + 3D (single source of truth)
  function setText(tplId, slot, v, from3DLayer) {
    const e = entry(tplId), k = kindOf(tplId);
    e.texts[slot.key] = v;
    const node = (videoNodes[tplId] || {})[slot.def];
    if (node) node.nodeValue = v;
    if (k === 'spatial' && !from3DLayer) {
      const m = SPATIAL_3D[slot.key];
      if (m && spatialLayer(m.l)) rebuildSpatialLayer(m.l, m.f === 'body' ? { body: v, text: v } : { [m.f]: v });
    } else if (k === 'doc') {
      const f = DOC_3D[slot.key];
      if (f) { document3DFXState[f] = v; ensureDoc(e)[f] = v; document3DFXState._texDirty = true; }
    }
  }

  function onInput(ev) {
    const el = ev.target, key = el.dataset && el.dataset.k;
    if (!key || !curTpl) return;
    const tplId = curTpl, e = entry(tplId), k = kindOf(tplId);
    const v = el.type === 'range' ? parseFloat(el.value) : el.value;
    const fx = e.fx, s = spatial3DState, d = document3DFXState;
    const lab = (t) => setLabel(key, t);

    if (key.startsWith('tx-')) { setText(tplId, slotsFor(tplId)[parseInt(key.slice(3), 10)], v); }
    else if (key === 'v-speed') { fx.speed = v; lab((v >= 0 ? '+' : '') + v.toFixed(1) + 'x'); }
    else if (key === 'v-pitch') { fx.pitch = v; lab(v + '°'); }
    else if (key === 'v-yaw') { fx.yaw = v; lab(v + '°'); }
    else if (key === 'v-roll') { fx.roll = v; lab(v + '°'); }
    else if (key === 'v-zoom') { fx.zoom = v; lab(v.toFixed(2) + 'x'); }
    else if (key === 'flight') { s.flightMode = v; initSpatialPathCanvas(); }
    else if (key === 's-pathstyle') { s.pathStyle = v; initSpatialPathCanvas(); }
    else if (key === 's-pathcurve') { s.pathCurve = v; lab((v > 0 ? '+' : '') + v + '%'); initSpatialPathCanvas(); }
    else if (key === 's-speed') { s.camSpeed = v; lab((v >= 0 ? '+' : '') + v.toFixed(1) + 'x'); }
    else if (key === 's-shake') { s.camShake = v; lab(v + '%'); }
    else if (key === 's-drift') { s.camDrift = v; lab(v + '%'); }
    else if (key === 's-fov') { s.fovWarp = v; lab(v + '°'); if (s.camera) { s.camera.fov = v; s.camera.updateProjectionMatrix(); } }
    else if (key === 's-pitch') { s.camPitch = v; lab(v + '°'); }
    else if (key === 's-yaw') { s.camYaw = v; lab(v + '°'); }
    else if (key === 's-text-font') { s.textFont = v; setSpatialLayers((s.elements3D || []).map(m => m.userData)); }
    else if (key === 's-text-style') { s.textStyle = v; build(tplId); setSpatialLayers((s.elements3D || []).map(m => m.userData)); }
    else if (key === 's-text-c1') { s.textPrimaryColor = v; setSpatialLayers((s.elements3D || []).map(m => m.userData)); }
    else if (key === 's-text-c2') { s.textSecondaryColor = v; setSpatialLayers((s.elements3D || []).map(m => m.userData)); }
    else if (key === 's-text-bevel') { s.textBevel = v; lab(v + ' layers'); setSpatialLayers((s.elements3D || []).map(m => m.userData)); }
    else if (key === 's-bgstyle') { s.bgStyle = v; if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid(); }
    else if (key === 's-bgcolor') { s.bgColor = v; if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid(); }
    else if (key === 's-env') { s.envStyle = v; if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid(); }
    else if (key === 's-grid-density') { s.gridDensity = v; lab(v + ' divisions'); if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid(); }
    else if (key === 's-grid-speed') { s.gridSpeed = v; lab(v.toFixed(1) + 'x'); }
    else if (key === 's-lum') { s.gridLuminescence = v; lab(v + '%'); if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid(); }
    else if (key === 's-gridglow') { s.gridGlow = v; lab(v + '%'); if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid(); }
    else if (key === 's-gridcolor') { s.gridColor = v; if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid(); }
    else if (key === 's-star-count') { s.starCount = v; lab(v + ' stars'); if (typeof buildSpatialDustParticles === 'function' && s.scene) { if (s.particlesMesh) s.scene.remove(s.particlesMesh); s.particlesMesh = buildSpatialDustParticles(s.scene); } }
    else if (key === 's-star-size') { s.starSize = v; lab(v.toFixed(1) + 'px'); if (s.particlesMesh && s.particlesMesh.material) s.particlesMesh.material.size = v; }
    else if (key === 's-star-speed') { s.starSpeed = v; lab(v.toFixed(1) + 'x'); }
    else if (key === 's-fog') { s.fogDensity = v; lab(v + '%'); if (s.scene && s.scene.fog) s.scene.fog.density = 0.0001 + (v / 100) * 0.0008; }
    else if (key === 's-light') { s.lightIntensity = v; lab(v + '%'); if (s.ambientLight) s.ambientLight.intensity = (v / 100) * 0.95; }
    else if (key.startsWith('l-')) {
      const m = key.match(/^l-(title|sub|body|stamp|trans|font|mode|shape|img|z|x|y|scale|color|magtitle|featuretag|featuretitle|kicker|beamcol)-(\d+)$/);
      if (m) {
        const i = parseInt(m[2], 10), field = {
          title: 'title', sub: 'subtitle', body: 'body', stamp: 'stamp', trans: 'transitionEffect', font: 'fontFamily',
          mode: 'artifactMode', shape: 'objectShape', img: 'imageUrl', z: 'z', x: 'x', y: 'y', scale: 'scale', color: 'color',
          magtitle: 'magazineTitle', featuretag: 'featureTag', featuretitle: 'featureTitle', kicker: 'kickerBadge', beamcol: 'beamColor'
        }[m[1]];
        const num = ['z', 'x', 'y', 'scale'].includes(field);
        const val = num ? parseFloat(v) : v;
        const patch = { [field]: val };
        if (field === 'body') patch.text = val;
        if (field === 'x') patch.baseX = val;
        if (field === 'y') patch.baseY = val;
        rebuildSpatialLayer(i, patch);
        if (num) lab(field === 'scale' ? Number(val).toFixed(2) + 'x' : String(Math.round(val)));
        if (field === 'artifactMode') { renderSpatialLayers(); }
      }
    }
    else if (key.startsWith('d-')) {
      const p = ensureDoc(e);
      if (key === 'd-pitch') { p.pitch = v; lab(v + '°'); d.pitch = v; }
      else if (key === 'd-yaw') { p.yaw = v; lab(v + '°'); d.yaw = v; }
      else if (key === 'd-roll') { p.roll = v; lab(v + '°'); d.roll = v; }
      else if (key === 'd-dist') { p.dist = v; lab(String(Math.round(v))); d.dist = v; }
      else if (key === 'd-parallax') { p.parallax = v; lab(v.toFixed(1) + 'x'); d.parallax = v; }
      else if (key === 'd-paper') { p.paperStyle = v; d.paperStyle = v; d._texDirty = true; }
      else if (key === 'd-hlprog') { p.hl = v / 100; lab(v + '%'); d.hl = p.hl; d._texDirty = true; }
      else if (key === 'd-popelev') { p.popElevation = v; lab(String(v)); d.popElevation = v; }
      else if (key === 'd-redwipe') { p.redactWipe = v / 100; lab(v + '%'); d.redactWipe = p.redactWipe; d._texDirty = true; }
      else if (key === 'd-hlcolor') { p.highlightColor = v; d.highlightColor = v; d._texDirty = true; }
    }
    persist();
  }
  function onClick(ev) {
    const b = ev.target.closest('[data-act]'); if (!b || !curTpl) return;
    const act = b.dataset.act, tplId = curTpl, e = entry(tplId), s = spatial3DState, d = document3DFXState;

    if (act === 's-toggle-text') {
      s.showText = s.showText === false ? true : false;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-toggle-alpha') {
      s.transparentBg = !s.transparentBg;
      if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid();
      capture(tplId); build(tplId); return;
    }
    if (act === 's-toggle-celestial') {
      s.showCelestialObjects = s.showCelestialObjects === false ? true : false;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-reset-path') {
      s.pathStyle = 'straight';
      s.pathCurve = 0;
      s.drawnPath = null;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-grid') {
      s.gridVisible = !s.gridVisible;
      if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid();
      capture(tplId); build(tplId); return;
    }
    if (act === 's-dust') {
      s.dustVisible = !s.dustVisible;
      if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid();
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('preset-')) {
      loadSpatialPreset(act.replace('preset-', ''));
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('l-remove-img-')) {
      const idx = parseInt(act.replace('l-remove-img-', ''), 10);
      rebuildSpatialLayer(idx, { imageUrl: '', artifactMode: 'card' });
      capture(tplId); renderSpatialLayers(); return;
    }
    if (act.startsWith('l-pick-file-')) {
      const idx = parseInt(act.replace('l-pick-file-', ''), 10);
      const fileInput = document.getElementById('l-file-input-' + idx);
      if (fileInput) {
        fileInput.onchange = (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              rebuildSpatialLayer(idx, { imageUrl: re.target.result, artifactMode: 'image' });
              capture(tplId); renderSpatialLayers();
            };
            reader.readAsDataURL(file);
          }
        };
        fileInput.click();
      }
      return;
    }
    if (act.startsWith('l-toggle-')) {
      const idx = parseInt(act.slice(9), 10);
      openLayerIdx = openLayerIdx === idx ? -1 : idx;
      renderSpatialLayers(); return;
    }
    if (act.startsWith('l-del-')) {
      const idx = parseInt(act.slice(6), 10);
      if (s.elements3D && s.elements3D[idx]) {
        s.scene.remove(s.elements3D[idx]);
        s.elements3D.splice(idx, 1);
        if (openLayerIdx === idx) openLayerIdx = -1;
        capture(tplId); renderSpatialLayers();
      }
      return;
    }
    if (act.startsWith('l-up-') || act.startsWith('l-down-')) {
      const up = act.startsWith('l-up-');
      const idx = parseInt(act.slice(up ? 5 : 7), 10);
      const list = s.elements3D || [];
      const target = up ? idx - 1 : idx + 1;
      if (target >= 0 && target < list.length) {
        const tmp = list[idx]; list[idx] = list[target]; list[target] = tmp;
        openLayerIdx = target;
        capture(tplId); renderSpatialLayers();
      }
      return;
    }
    if (act === 's-add-artifact') {
      const id = Date.now().toString();
      const newCard = createSpatialCardPlane({ id, type: 'card', artifactMode: 'forbes', imageUrl: '/portrait_cutout_clean.png', magazineTitle: 'Forbes', featureTag: 'SPECIAL REPORT // THE ARCHITECT', featureTitle: 'THE $30 BILLION FRAUD', kickerBadge: 'EXPOSED', title: 'FORBES 3D COVER', subtitle: 'THE FRAUD REVEAL', body: 'Investigative dossier artifact placed into spatial corridor.', z: (s.elements3D && s.elements3D.length ? s.elements3D[s.elements3D.length - 1].position.z - 400 : -1000), x: 0, y: 15, scale: 1.25, color: '#f8fafc' });
      s.scene.add(newCard); s.elements3D.push(newCard);
      openLayerIdx = s.elements3D.length - 1;
      capture(tplId); renderSpatialLayers(); return;
    }
    if (act === 's-add') {
      const id = Date.now().toString();
      const newTitle = createSpatialTextPlane({ id, type: 'text', title: 'KEYWORD PHRASE', subtitle: 'SUBHEADING NARRATIVE', body: '', z: (s.elements3D && s.elements3D.length ? s.elements3D[s.elements3D.length - 1].position.z - 400 : -1000), x: 0, y: 15, scale: 1.15, color: '#f59e0b' });
      s.scene.add(newTitle); s.elements3D.push(newTitle);
      openLayerIdx = s.elements3D.length - 1;
      capture(tplId); renderSpatialLayers(); return;
    }
    if (act === 'add-kinetic-slot') {
      e.showTextSection = true; e.texts['title'] = 'CINEMATIC HORIZON';
      persist(); build(tplId); return;
    }
    if (act === 'clear-all-text-slots') {
      e.showTextSection = false; slotsFor(tplId).forEach(sl => { e.texts[sl.key] = ''; });
      persist(); build(tplId); return;
    }
    if (act === 'mode-video' || act === 'mode-3d') {
      capture(tplId);
      const is3D = act === 'mode-3d';
      e.mode = is3D ? '3d' : 'video';
      stageTheaterActive = is3D;
      if (typeof topCustomizerState !== 'undefined') topCustomizerState.is3DMode = is3D;
      updateTheaterButtonUI();
      applyModeLayout(is3D);
      persist(); lastKey = '';
      renderTopTemplatePreviewStage();
      return;
    }
    if (act === 'v-reset') { Object.assign(e.fx, { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 }); persist(); build(tplId); return; }
    if (act === 'd-hl') { d.enableHighlight = !d.enableHighlight; d._texDirty = true; persist(); build(tplId); return; }
    if (act === 'd-pop') { d.enablePopout = !d.enablePopout; if (d.popoutMesh) d.popoutMesh.visible = d.enablePopout; persist(); build(tplId); return; }
    if (act === 'd-red') { d.enableRedaction = !d.enableRedaction; d._texDirty = true; persist(); build(tplId); return; }
  }
  function bindHost() {
    const h = host(); if (!h || h.dataset.bound) return;
    h.dataset.bound = '1';
    h.addEventListener('input', onInput);
    h.addEventListener('change', onInput);
    h.addEventListener('click', onClick);
  }
  function attachDom3DInteractiveRig(stage, tplId) {
    const inner = stage.querySelector('#customizer-stage-inner') || stage;
    const e = entry(tplId);
    const is3D = e.mode === '3d';
    const existingPill = stage.querySelector('#dom3d-orbit-pill');
    if (existingPill) existingPill.remove();
    if (!is3D) {
      inner.style.cursor = '';
      return;
    }
    inner.style.cursor = 'grab';
    inner.style.perspective = '1100px';
    const pill = document.createElement('div');
    pill.id = 'dom3d-orbit-pill';
    pill.style.cssText = 'position:absolute;top:14px;left:50%;transform:translateX(-50%);z-index:85;display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:rgba(15,23,42,0.88);backdrop-filter:blur(10px);border:1px solid rgba(192,132,252,0.55);color:#f3e8ff;font-size:11px;font-weight:800;letter-spacing:0.05em;box-shadow:0 8px 24px rgba(0,0,0,0.65);pointer-events:none;white-space:nowrap;';
    pill.innerHTML = `<span style="font-size:14px;">\ud83d\udd90\ufe0f</span><span>3D INTERACTIVE MODE \u2014 DRAG TO TILT &amp; ROTATE \u2022 SCROLL TO ZOOM</span>`;
    // pill omitted from center of 3D canvas so view remains completely clean and standard

    if (inner.dataset.dom3dBound === tplId) return;
    inner.dataset.dom3dBound = tplId;

    let dragging = false, startX = 0, startY = 0, startYaw = 0, startPitch = 0;
    const syncSliderUI = () => {
      const h = host(); if (!h) return;
      const pIn = h.querySelector('[data-k="v-pitch"]'); if (pIn) pIn.value = e.fx.pitch;
      const yIn = h.querySelector('[data-k="v-yaw"]'); if (yIn) yIn.value = e.fx.yaw;
      const zIn = h.querySelector('[data-k="v-zoom"]'); if (zIn) zIn.value = e.fx.zoom;
      setLabel('v-pitch', Math.round(e.fx.pitch) + '\u00b0');
      setLabel('v-yaw', Math.round(e.fx.yaw) + '\u00b0');
      setLabel('v-zoom', Number(e.fx.zoom).toFixed(2) + 'x');
    };

    inner.addEventListener('pointerdown', (ev) => {
      if (entry(tplId).mode !== '3d') return;
      if (ev.target.closest('.zoom-hud-bottom, #tpl-universal-stage-toolbar, button, input, select')) return;
      dragging = true;
      startX = ev.clientX;
      startY = ev.clientY;
      startYaw = e.fx.yaw || 0;
      startPitch = e.fx.pitch || 0;
      inner.style.cursor = 'grabbing';
      try { inner.setPointerCapture(ev.pointerId); } catch (_) {}
    });

    inner.addEventListener('pointermove', (ev) => {
      if (!dragging || entry(tplId).mode !== '3d') return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      e.fx.yaw = Math.max(-45, Math.min(45, Math.round(startYaw + dx * 0.25)));
      e.fx.pitch = Math.max(-45, Math.min(45, Math.round(startPitch - dy * 0.25)));
      window.tpl3DFx = e.fx;
      syncSliderUI();
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (entry(tplId).mode === '3d') inner.style.cursor = 'grab';
      persist();
    };
    inner.addEventListener('pointerup', endDrag);
    inner.addEventListener('pointercancel', endDrag);

    inner.addEventListener('wheel', (ev) => {
      if (entry(tplId).mode !== '3d') return;
      ev.preventDefault();
      const delta = ev.deltaY < 0 ? 0.06 : -0.06;
      e.fx.zoom = Math.max(0.6, Math.min(2.2, Number(((e.fx.zoom || 1) + delta).toFixed(2))));
      window.tpl3DFx = e.fx;
      syncSliderUI();
      persist();
    }, { passive: false });
  }

  function mount3D(stage, tplId) {
    stageTheaterActive = true;
    updateTheaterButtonUI();
    applyModeLayout(true);
    const k = kindOf(tplId), cid = k === 'spatial' ? 'spatial-threejs-container' : 'doc-threejs-container';
    stage.innerHTML = `<div id="customizer-stage-inner" style="position:absolute;inset:0;overflow:hidden;background:#07090e;"><div data-3d-stage="1" style="position:absolute;inset:0;cursor:grab;"></div></div>`;
    const container = stage.querySelector('[data-3d-stage]');
    const st = stOf(k);
    if (st.renderer) { st.renderer.domElement.parentNode !== container && (container.innerHTML = '', container.appendChild(st.renderer.domElement)); }
    setTimeout(() => {
      if (!container.isConnected) return;
      ensureEngine(k, container);
      fit(); startLoop(k);

      // True Interactive 3D Hand Grab & Flight Navigation
      let dragging = false, startX = 0, startY = 0, startYaw = 0, startPitch = 0;
      container.style.cursor = 'grab';

      container.addEventListener('pointerdown', (ev) => {
        if (ev.target.closest('button, input, select, .tpl-modal-player-hud')) return;
        dragging = true;
        startX = ev.clientX;
        startY = ev.clientY;
        startYaw = k === 'spatial' ? (spatial3DState.camYaw || 0) : (document3DFXState.yaw || 0);
        startPitch = k === 'spatial' ? (spatial3DState.camPitch || 0) : (document3DFXState.pitch || 0);
        container.style.cursor = 'grabbing';
        try { container.setPointerCapture(ev.pointerId); } catch (_) {}
      });

      container.addEventListener('pointermove', (ev) => {
        const r = container.getBoundingClientRect();
        if (k === 'spatial') {
          spatial3DState.mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
          spatial3DState.mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
        }

        if (!dragging) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        if (k === 'spatial') {
          spatial3DState.camYaw = Math.max(-65, Math.min(65, startYaw + dx * 0.18));
          spatial3DState.camPitch = Math.max(-45, Math.min(45, startPitch - dy * 0.18));

          const h = host();
          if (h) {
            const yIn = h.querySelector('[data-k="s-yaw"]');
            const pIn = h.querySelector('[data-k="s-pitch"]');
            if (yIn) yIn.value = Math.round(spatial3DState.camYaw);
            if (pIn) pIn.value = Math.round(spatial3DState.camPitch);
            setLabel('s-yaw', Math.round(spatial3DState.camYaw) + '°');
            setLabel('s-pitch', Math.round(spatial3DState.camPitch) + '°');
          }
        } else {
          document3DFXState.yaw = Math.max(-60, Math.min(60, startYaw + dx * 0.2));
          document3DFXState.pitch = Math.max(0, Math.min(75, startPitch - dy * 0.2));
          const h = host();
          if (h) {
            const yIn = h.querySelector('[data-k="d-yaw"]');
            const pIn = h.querySelector('[data-k="d-pitch"]');
            if (yIn) yIn.value = Math.round(document3DFXState.yaw);
            if (pIn) pIn.value = Math.round(document3DFXState.pitch);
            setLabel('d-yaw', Math.round(document3DFXState.yaw) + '°');
            setLabel('d-pitch', Math.round(document3DFXState.pitch) + '°');
          }
        }
      });

      const stopDrag = (ev) => {
        if (!dragging) return;
        dragging = false;
        container.style.cursor = 'grab';
        try { container.releasePointerCapture(ev.pointerId); } catch (_) {}
        persist();
      };
      container.addEventListener('pointerup', stopDrag);
      container.addEventListener('pointercancel', stopDrag);

      // Mouse Wheel Navigation (Glide down hallway corridor / universe)
      container.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        if (k === 'spatial') {
          const delta = ev.deltaY * 0.0006;
          spatial3DState.currentTime = Math.max(0, Math.min(1, spatial3DState.currentTime + delta));
          const slider = document.getElementById('spatial-timeline-slider');
          if (slider) slider.value = spatial3DState.currentTime * 100;
          if (typeof updateSpatialTimelineDisplay === 'function') updateSpatialTimelineDisplay();
          if (typeof updateSpatialCameraPosition === 'function') updateSpatialCameraPosition();
          initSpatialPathCanvas();
        } else {
          const delta = ev.deltaY * 0.05;
          document3DFXState.dist = Math.max(20, Math.min(110, document3DFXState.dist + delta));
          const h = host();
          if (h) {
            const dIn = h.querySelector('[data-k="d-dist"]');
            if (dIn) dIn.value = Math.round(document3DFXState.dist);
            setLabel('d-dist', String(Math.round(document3DFXState.dist)));
          }
        }
      }, { passive: false });

      lastKey = ''; window.tpl3DSync(tplId);
      setTimeout(fit, 60);
      setTimeout(fit, 180);
    }, 50);
    function fit() {
      const w = container.clientWidth || 800, h = container.clientHeight || 450;
      if (st.renderer && st.camera) { st.camera.aspect = w / h; st.camera.updateProjectionMatrix(); st.renderer.setSize(w, h); }
    }
    if (resizeObs) resizeObs.disconnect();
    if (window.ResizeObserver) { resizeObs = new ResizeObserver(fit); resizeObs.observe(container); }
  }

function collectVideoNodes(stage, tplId) {
    const fxc = stage.querySelector('#fx-container-' + tplId), nodes = {};
    if (fxc) {
      const w = document.createTreeWalker(fxc, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) {
        const t = n.nodeValue.trim();
        if (!t || /THREE\.JS 3D SUITE|BG REMOVED/.test(t)) continue;
        if (!(t in nodes)) { nodes[t] = n; n.nodeValue = t; }
      }
    }
    videoNodes[tplId] = nodes;
    const ov = entry(tplId).texts;
    slotsFor(tplId).forEach(sl => { if (sl.def != null && nodes[sl.def] && ov[sl.key] != null) nodes[sl.def].nodeValue = ov[sl.key]; });
  }

  let stageTheaterActive = false;

  function updateTheaterButtonUI() {
    const btn = document.getElementById('btn-tpl-modal-theater');
    const icon = document.getElementById('tpl-theater-icon');
    const label = document.getElementById('tpl-theater-label');
    if (!btn) return;
    if (stageTheaterActive) {
      btn.style.background = 'rgba(168,85,247,0.28)';
      btn.style.borderColor = '#c084fc';
      btn.style.color = '#ffffff';
      btn.style.boxShadow = '0 0 14px rgba(168,85,247,0.4)';
      if (icon) icon.textContent = '\u2921';
      if (label) label.textContent = 'Exit Theater';
      btn.setAttribute('aria-pressed', 'true');
      btn.title = 'Exit Theater / Standard Stage View';
    } else {
      btn.style.background = 'rgba(0,0,0,0.75)';
      btn.style.borderColor = 'rgba(255,255,255,0.18)';
      btn.style.color = '#cbd5e1';
      btn.style.boxShadow = 'none';
      if (icon) icon.textContent = '\u26f6';
      if (label) label.textContent = 'Theater View';
      btn.setAttribute('aria-pressed', 'false');
      btn.title = 'Toggle Theater / Expanded Stage View (Takes full vertical space)';
    }
  }

  window.tplToggleStageTheater = function (force) {
    stageTheaterActive = (typeof force === 'boolean') ? force : !stageTheaterActive;
    updateTheaterButtonUI();
    const tplId = curTpl || (typeof topCustomizerState !== 'undefined' && topCustomizerState.currentTpl?.id);
    const mode = (tplId && store[tplId]) ? store[tplId].mode : 'video';
    const isCustom3D = (typeof topCustomizerState !== 'undefined' && !!topCustomizerState.is3DMode);
    const is3D = (tplId && has3D(kindOf(tplId), tplId) && mode === '3d') || isCustom3D;
    applyModeLayout(is3D);
  };
  window.tplIsStageTheater = () => stageTheaterActive;

  function initTheaterToggle() {
    const btn = document.getElementById('btn-tpl-modal-theater');
    if (btn && !btn.dataset.theaterBound) {
      btn.dataset.theaterBound = '1';
      btn.onclick = (e) => {
        e.stopPropagation();
        window.tplToggleStageTheater();
      };
    }
    updateTheaterButtonUI();
  }
  window.tplInitTheaterToggle = initTheaterToggle;

  window.applyModeLayout = applyModeLayout;
  function applyModeLayout(is3D) {
    const sb = document.getElementById('tpl-modal-storyboard-container');
    const pb = document.getElementById('tpl-modal-playback-bar');
    const box = document.getElementById('tpl-modal-preview-canvas-box');
    const stageCont = document.getElementById('tpl-modal-preview-stage-container');
    const hud = document.getElementById('tpl-modal-player-hud');
    const aspectBtn = document.getElementById('tpl-modal-btn-aspect');
    const timerBadge = document.getElementById('tpl-modal-timer-badge');

    const isTheater = (typeof stageTheaterActive !== 'undefined' && !!stageTheaterActive) || !!is3D;

    if (isTheater) {
      if (sb) sb.style.display = 'none';
      if (pb) pb.style.display = 'none';
      if (hud) hud.style.display = 'none';
      const legacyHud = document.querySelector('[style*="3D CAMERA TRACK"]')?.parentElement || document.getElementById('spatial-camera-track-hud');
      if (legacyHud) legacyHud.style.display = 'none';
      if (box) {
        box.style.padding = '0';
        box.style.border = 'none';
        box.style.background = 'transparent';
        box.style.gap = '0';
        box.style.flex = '1';
        box.style.height = '100%';
        box.style.minHeight = '0';
      }
      if (stageCont) {
        stageCont.style.maxHeight = 'none';
        stageCont.style.height = '100%';
        stageCont.style.minHeight = '480px';
        stageCont.style.flex = '1';
        stageCont.style.borderRadius = '14px';
        stageCont.style.border = '1px solid rgba(255,255,255,0.08)';
        stageCont.style.overflow = 'hidden';
      }
    } else {
      if (sb) sb.style.display = '';
      if (pb) pb.style.display = '';
      if (hud) hud.style.display = '';
      if (box) {
        box.style.padding = '';
        box.style.border = '';
        box.style.background = '';
        box.style.gap = '';
        box.style.flex = '1';
        box.style.height = '';
        box.style.minHeight = '';
      }
      if (stageCont) {
        stageCont.style.maxHeight = '320px';
        stageCont.style.height = '';
        stageCont.style.minHeight = '250px';
        stageCont.style.flex = '1';
        stageCont.style.borderRadius = '10px';
        stageCont.style.border = '';
        stageCont.style.overflow = 'visible';
      }
    }
    // Always preserve top controls (format switcher, [ \u25b6 Video ] [ \u2b21 3D ] mode toggle, 3D edit mode pill)
    if (aspectBtn && aspectBtn.parentElement) aspectBtn.parentElement.style.display = '';
    if (timerBadge && timerBadge.parentElement) timerBadge.parentElement.style.display = '';
    updateTheaterButtonUI();
  }

  window.tpl3DUse3D = (id) => {
    const k = kindOf(id);
    return (k === 'spatial' || k === 'doc') && (entry(id).mode !== 'video');
  };
  window.tpl3DMountStage = mount3D;
  window.tpl3DAfterVideoStage = function (stage, tplId) {
    const k = kindOf(tplId);
    if (!k) return;
    const isDom3DActive = (k === 'dom3d' && entry(tplId).mode === '3d');
    if (isDom3DActive) {
      stageTheaterActive = true;
      updateTheaterButtonUI();
    }
    applyModeLayout(isDom3DActive);
    if (k === 'dom3d') attachDom3DInteractiveRig(stage, tplId);
    const before = Object.keys(videoNodes[tplId] || {}).length;
    collectVideoNodes(stage, tplId);
    if (before !== Object.keys(videoNodes[tplId]).length || !(host() && host().innerHTML)) { lastKey = ''; window.tpl3DSync(tplId); }
  };
  window.tpl3DSync = function (tplId) {
    bindHost();
    curTpl = kindOf(tplId) ? tplId : null;
    if (curTpl) window.tpl3DFx = entry(tplId).fx;
    const mode = curTpl ? entry(tplId).mode : 'video';
    const isCustom3D = (typeof topCustomizerState !== 'undefined' && !!topCustomizerState.is3DMode);
    applyModeLayout((has3D(kindOf(tplId), tplId) && mode === '3d') || isCustom3D);
    const key = tplId + '|' + (curTpl ? mode : '');
    if (key === lastKey) return;
    lastKey = key; openLayerIdx = -1;
    build(tplId);
  };
  window.tpl3DOnFrame = function (seqTime) { seqNow = seqTime; };
  window.tpl3DOnReplay = function () { seqNow = 0; };
  window.tpl3DOnClose = function () {
    stageTheaterActive = false;
    updateTheaterButtonUI();
    applyModeLayout(false);
    if (curTpl) capture(curTpl);
    if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
    ['spatial', 'doc'].forEach(k => { const st = stOf(k); stopLoop(k); if (st.renderer) getHolder().appendChild(st.renderer.domElement); });
    const h = host(); if (h) { h.style.display = 'none'; h.innerHTML = ''; }
    persist(); lastKey = ''; curTpl = null;
  };

  // ---------------------------------------------------------------- timeline clips
  window.tpl3DIsFx = (id) => isBridged(id);
  window.tpl3DMakeClip = function (tpl, o) {
    if (curTpl === tpl.id) capture(tpl.id);
    const snap = JSON.parse(JSON.stringify(entry(tpl.id)));
    if (typeof window.tplGetContextualData === 'function') {
      snap.contextualData = window.tplGetContextualData(tpl.id);
    }
    const url = o.prim || tpl.defaultImage;
    return {
      id: `fx-${tpl.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: tpl.title || tpl.id, url,
      file: { name: (tpl.title || tpl.id) + ' (FX)', url, isImage: true },
      start: o.sceneStart, duration: o.scDur, zIndex: 20,
      fxScene: { tplId: tpl.id, entry: snap, prim: o.prim || tpl.defaultImage, sec: o.sec || tpl.secondaryImage || tpl.defaultImage, title: tpl.title }
    };
  };

  // --- image -> dataURL cache (needed to rasterise CSS effects through SVG)
  const dataCache = {};
  function dataUrlFor(url) {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const c = dataCache[url];
    if (c === undefined) {
      dataCache[url] = null;
      const im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = () => {
        try {
          const sc = Math.min(1, 1024 / Math.max(im.naturalWidth, im.naturalHeight));
          const cv = document.createElement('canvas'); cv.width = Math.max(1, im.naturalWidth * sc); cv.height = Math.max(1, im.naturalHeight * sc);
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          dataCache[url] = cv.toDataURL('image/jpeg', 0.85);
        } catch (_) { dataCache[url] = 'FAIL'; }
      };
      im.onerror = () => { dataCache[url] = 'FAIL'; };
      im.src = url;
      return null;
    }
    return c === 'FAIL' ? '' : c;
  }

  const rast = {};
  function tplFor(sc) {
    const t = (typeof EFFECT_TEMPLATES_DATA !== 'undefined' && EFFECT_TEMPLATES_DATA.find(x => x.id === sc.tplId)) || { id: sc.tplId, title: sc.title };
    return Object.assign({}, t, { defaultImage: sc.prim || t.defaultImage, secondaryImage: sc.sec || t.secondaryImage || t.defaultImage });
  }
  function buildRaster(clip) {
    const sc = clip.fxScene, tpl = tplFor(sc), id = tpl.id;
    const hostEl = document.createElement('div');
    hostEl.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    hostEl.style.cssText = `position:relative;width:${RW}px;height:${RH}px;overflow:hidden;background:#000;`;
    hostEl.innerHTML = `<img id="default-img-${id}" src="${esc(tpl.defaultImage)}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;opacity:0;" /><div id="fx-container-${id}" style="position:absolute;left:0;top:0;right:0;bottom:0;display:none;"></div>`;
    const manual = { t: 0, fx: sc.entry.fx || { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 } };
    const step = startTemplateHoverVideo(hostEl, tpl, manual);
    if (sc.entry && sc.entry.contextualData && window.tplUpdateStageWithContextualData) {
      window.tplUpdateStageWithContextualData(id, sc.entry.contextualData);
    }
    // text overrides
    const ov = sc.entry.texts || {};
    const slots = (id === 'spatial-3d-motion-suite') ? SPATIAL_SLOTS : (id === 'document-3d-fx-engine') ? DOC_SLOTS : null;
    const fxc = hostEl.querySelector('#fx-container-' + id);
    if (fxc) {
      const w = document.createTreeWalker(fxc, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) {
        const t = n.nodeValue.trim(); if (!t) continue;
        if (slots) {
          const norm = (s) => String(s || '').replace(/[\u201c\u201d]/g, '"').trim();
          const sl = slots.find(x => norm(x.def) === norm(t) || x.def === t);
          if (sl && ov[sl.key] != null) n.nodeValue = ov[sl.key];
        }
        else if (ov[t] != null) n.nodeValue = ov[t];
      }
    }
    const cv = document.createElement('canvas'); cv.width = RW; cv.height = RH;
    return { hostEl, step, cv, pending: false, has: false, manual };
  }
  function rasterise(r) {
    if (r.pending) return;
    let markup;
    try { markup = new XMLSerializer().serializeToString(r.hostEl); } catch (_) { return; }
    let missing = false;
    markup = markup.replace(/src="(https?:[^"]+)"/g, (m, u) => {
      const raw = u.replace(/&amp;/g, '&'); const d = dataUrlFor(raw);
      if (d === null) { missing = true; return m; }
      return d ? `src="${d}"` : m;
    });
    if (missing) return;
    r.pending = true;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${RW}" height="${RH}"><foreignObject x="0" y="0" width="${RW}" height="${RH}">${markup}</foreignObject></svg>`;
    const im = new Image();
    im.onload = () => { try { const c = r.cv.getContext('2d'); c.clearRect(0, 0, RW, RH); c.drawImage(im, 0, 0, RW, RH); r.has = true; } catch (_) { } r.pending = false; };
    im.onerror = () => { r.pending = false; };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function blit(ctx, src, sw, sh, cw, ch) {
    const sc = Math.min(cw / sw, ch / sh), w = sw * sc, h = sh * sc;
    ctx.drawImage(src, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  function drawPlaceholder(ctx, clip, cw, ch) {
    const u = clip.fxScene.prim; const im = (typeof mediaElementCache !== 'undefined') && mediaElementCache.get(u);
    if (im && im.complete && im.naturalWidth) { ctx.save(); ctx.globalAlpha = 0.9; blit(ctx, im, im.naturalWidth, im.naturalHeight, cw, ch); ctx.restore(); }
  }

  // --- 3D in timeline (engine rendered offscreen)
  function draw3DClip(ctx, clip, t, cw, ch) {
    const sc = clip.fxScene, id = sc.tplId, k = kindOf(id), st = stOf(k);
    // temporarily swap the store entry used by the engines to the clip snapshot
    const prev = store[id]; store[id] = sc.entry;
    try {
      const wasCustomizerLive = !!(st.renderer && st.animId);
      ensureEngine(k, st.renderer ? (st.renderer.domElement.parentNode || getHolder()) : (function () { const c = document.createElement('div'); c.style.cssText = `position:absolute;left:0;top:0;width:${RW}px;height:${RH}px;`; getHolder().appendChild(c); return c; })());
      if (st.renderer.domElement.width !== Math.round(RW * (st.renderer.getPixelRatio ? st.renderer.getPixelRatio() : 1))) {
        st.renderer.setSize(RW, RH); st.camera.aspect = RW / RH; st.camera.updateProjectionMatrix();
      }
      if (k === 'spatial') { driveSpatial(sc.entry, t); for (let i = 0; i < 8; i++) updateSpatialCameraPosition(); }
      else { driveDoc(sc.entry, t); }
      st.renderer.render(st.scene, st.camera);
      blit(ctx, st.renderer.domElement, st.renderer.domElement.width, st.renderer.domElement.height, cw, ch);
      if (wasCustomizerLive) { /* customizer loop keeps going; entry restored below */ }
    } finally { if (prev) store[id] = prev; else delete store[id]; }
  }

  window.tplFxDrawClip = function (clip) {
    const c = (typeof ctx !== 'undefined') ? ctx : null, cv = (typeof canvas !== 'undefined') ? canvas : null;
    if (!c || !cv || !clip.fxScene) return;
    const sc = clip.fxScene, k = kindOf(sc.tplId);
    const t = Math.max(0, currentTime - clip.start);
    const cw = cv.width, ch = cv.height;
    c.save();
    try {
          if (clip.fxScene && clip.fxScene.tplId === 'instagram' && typeof window.renderInstagramCanvas === 'function') {
      window.renderInstagramCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'deal-term-sheet' && typeof window.renderDealTermSheetCanvas === 'function') {
      window.renderDealTermSheetCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'pyramid-scheme' && typeof window.renderPyramidCollapseCanvas === 'function') {
      window.renderPyramidCollapseCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'scam-redaction' && typeof window.renderFraudDossierCanvas === 'function') {
      window.renderFraudDossierCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'money-stack' && typeof window.renderMoneyStackCanvas === 'function') {
      window.renderMoneyStackCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'jani-forbes-fraud-reveal' && typeof window.renderJaniForbesCanvas === 'function') {
      window.renderJaniForbesCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
      if ((k === 'spatial' || k === 'doc') && sc.entry.mode === '3d' && typeof THREE !== 'undefined') {
        draw3DClip(c, clip, t, cw, ch);
      } else {
        let r = rast[clip.id];
        if (!r) r = rast[clip.id] = buildRaster(clip);
        r.manual.t = t; r.step(t);
        rasterise(r);
        if (r.has) blit(c, r.cv, RW, RH, cw, ch); else drawPlaceholder(c, clip, cw, ch);
      }
    } catch (err) { drawPlaceholder(c, clip, cw, ch); }
    c.restore();
  };
  // --- Dynamic Live Thumbnail / Authentic Snapshot System
  window.tplGetSnapshot = function (tplId) {
    if (!tplId) return null;
    const e = store[tplId];
    const hasCustomEdits = e && ((e.texts && Object.keys(e.texts).length > 0) || e.mode === '3d');
    if (hasCustomEdits && e.snapshot) return e.snapshot;
    if (typeof window.AUTHENTIC_TEMPLATE_SNAPSHOTS !== 'undefined' && window.AUTHENTIC_TEMPLATE_SNAPSHOTS[tplId]) {
      return window.AUTHENTIC_TEMPLATE_SNAPSHOTS[tplId];
    }
    if (e && e.snapshot) return e.snapshot;
    return null;
  };

  window.tplCaptureCurrentSnapshot = function (tplId) {
    if (!tplId) return null;
    try {
      const e = entry(tplId);
      const is3D = has3D(kindOf(tplId), tplId) && e.mode === '3d';
      const snapCv = document.createElement('canvas');
      snapCv.width = 400; snapCv.height = 225;
      const sctx = snapCv.getContext('2d');

      if (is3D && typeof THREE !== 'undefined') {
        const k = kindOf(tplId), st = stOf(k);
        if (st && st.renderer && st.renderer.domElement) {
          sctx.drawImage(st.renderer.domElement, 0, 0, 400, 225);
          const data = snapCv.toDataURL('image/jpeg', 0.85);
          if (data && data.length > 50) {
            e.snapshot = data;
            persist();
            window.tplRefreshCardThumbnails(tplId, data);
            return data;
          }
        }
      }

      // For video / CSS hover stage, capture from active stage element if present
      const stage = document.getElementById('tpl-modal-preview-stage');
      const stageInner = stage ? stage.querySelector('#customizer-stage-inner') : null;
      if (stageInner) {
        // Also rasterise via SVG foreignObject
        const clone = stageInner.cloneNode(true);
        const wrapper = document.createElement('div');
        wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        wrapper.style.cssText = `position:relative;width:400px;height:225px;overflow:hidden;background:#000;`;
        wrapper.appendChild(clone);
        let markup = new XMLSerializer().serializeToString(wrapper);
        markup = markup.replace(/src="(https?:[^"]+)"/g, (m, u) => {
          const raw = u.replace(/&amp;/g, '&'); const d = dataUrlFor(raw);
          return d ? `src="${d}"` : m;
        });
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><foreignObject x="0" y="0" width="400" height="225">${markup}</foreignObject></svg>`;
        const im = new Image();
        im.onload = () => {
          try {
            sctx.clearRect(0, 0, 400, 225);
            sctx.drawImage(im, 0, 0, 400, 225);
            const data = snapCv.toDataURL('image/jpeg', 0.85);
            if (data && data.length > 50) {
              e.snapshot = data;
              persist();
              window.tplRefreshCardThumbnails(tplId, data);
            }
          } catch (_) {}
        };
        im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      }
    } catch (_) {}
    return null;
  };

  window.tplRefreshCardThumbnails = function (tplId, url) {
    if (!tplId || !url) return;
    const defImg = document.querySelector(`.home-tpl-card[data-template-id="${tplId}"] #default-img-${tplId}`);
    if (defImg) { defImg.src = url; defImg.style.opacity = '1'; }
    const sideImg = document.getElementById(`sidecard-thumb-${tplId}`);
    if (sideImg) { sideImg.src = url; sideImg.style.opacity = '1'; }
  };

  // Generate an authentic snapshot from the template's real CSS/SVG scene at t=1.5s
  window.tplGenerateAuthenticSnapshot = function (tpl, cb) {
    if (!tpl || !tpl.id) return;
    const tplId = tpl.id;
    const e = entry(tplId);
    if (e.snapshot) { if (cb) cb(e.snapshot); return; }

    try {
      const hostEl = document.createElement('div');
      hostEl.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      hostEl.style.cssText = `position:relative;width:400px;height:225px;overflow:hidden;background:#000;`;
      hostEl.innerHTML = `<img id="default-img-${tplId}" src="${esc(tpl.defaultImage)}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;opacity:0;" /><div id="fx-container-${tplId}" style="position:absolute;left:0;top:0;right:0;bottom:0;display:none;"></div>`;
      
      const manual = { t: 1.5, fx: e.fx || { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 } };
      if (typeof startTemplateHoverVideo === 'function') {
        const step = startTemplateHoverVideo(hostEl, tpl, manual);
        if (step) step(1.5);
      }

      // apply any custom stored texts
      const ov = e.texts || {};
      const slots = (tplId === 'spatial-3d-motion-suite') ? SPATIAL_SLOTS : (tplId === 'document-3d-fx-engine') ? DOC_SLOTS : null;
      const fxc = hostEl.querySelector('#fx-container-' + tplId);
      if (fxc) {
        const w = document.createTreeWalker(fxc, NodeFilter.SHOW_TEXT); let n;
        while ((n = w.nextNode())) {
          const t = n.nodeValue.trim(); if (!t) continue;
          if (slots) {
          const norm = (s) => String(s || '').replace(/[\u201c\u201d]/g, '"').trim();
          const sl = slots.find(x => norm(x.def) === norm(t) || x.def === t);
          if (sl && ov[sl.key] != null) n.nodeValue = ov[sl.key];
        }
          else if (ov[t] != null) n.nodeValue = ov[t];
        }
      }

      let markup = new XMLSerializer().serializeToString(hostEl);
      markup = markup.replace(/src="(https?:[^"]+)"/g, (m, u) => {
        const raw = u.replace(/&amp;/g, '&'); const d = dataUrlFor(raw);
        return d ? `src="${d}"` : m;
      });
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><foreignObject x="0" y="0" width="400" height="225">${markup}</foreignObject></svg>`;
      const im = new Image();
      im.onload = () => {
        try {
          const cv = document.createElement('canvas'); cv.width = 400; cv.height = 225;
          const ctx = cv.getContext('2d');
          ctx.drawImage(im, 0, 0, 400, 225);
          const data = cv.toDataURL('image/jpeg', 0.85);
          if (data && data.length > 50) {
            e.snapshot = data;
            persist();
            window.tplRefreshCardThumbnails(tplId, data);
            if (cb) cb(data);
          }
        } catch (_) {}
      };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    } catch (_) {}
  };

  // Pre-generate authentic snapshots for all templates on idle
  window.tplWarmAllSnapshots = function () {
    if (typeof EFFECT_TEMPLATES_DATA === 'undefined') return;
    let idx = 0;
    function next() {
      if (idx >= EFFECT_TEMPLATES_DATA.length) return;
      const t = EFFECT_TEMPLATES_DATA[idx++];
      if (!entry(t.id).snapshot) {
        window.tplGenerateAuthenticSnapshot(t, () => setTimeout(next, 60));
      } else {
        setTimeout(next, 10);
      }
    }
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => setTimeout(next, 300));
    } else {
      setTimeout(next, 500);
    }
  };

  window.tplFxPreload = function (clip) { if (clip && clip.fxScene) { dataUrlFor(clip.fxScene.prim); dataUrlFor(clip.fxScene.sec); } };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheaterToggle);
  } else {
    initTheaterToggle();
  }
})();

