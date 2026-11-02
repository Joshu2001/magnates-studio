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
  const STORE_KEY = 'magnates_fx_store_v3';
  const RW = 720, RH = 405; // offscreen raster size for timeline rendering

  const isBridged = (id) => typeof BRIDGED_HOVER_TEMPLATE_IDS !== 'undefined' && BRIDGED_HOVER_TEMPLATE_IDS.has(id);
  // All templates under 3D Spatial category have the Video / 3D switcher!
  const SPATIAL_3D_CATEGORY_IDS = new Set(['money-stack', 
    'jani-spin-flash-glitch-reveal',
    'jani-flash-quad-sequence',
    'jani-forbes-fraud-reveal', 'jani-ftx-logo-reveal',
    'jani-ftx-logo-reveal',
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
  const DEDICATED_CUSTOMIZER_IDS = new Set(['scam-redaction', 'deal-term-sheet', 'pyramid-scheme', 'checklist', 'instagram', 'jani-cross-section-reveal', 'jani-forbes-fraud-reveal', 'jani-flash-quad-sequence', 'jani-spin-flash-glitch-reveal']);
  const kindOf = (id) => DEDICATED_CUSTOMIZER_IDS.has(id) ? null : (id === 'document-3d-fx-engine' ? 'doc' : (id === 'spatial-3d-motion-suite' ? 'spatial' : (is3DSpatial(id) ? 'dom3d' : (isBridged(id) ? 'generic' : null))));
  const has3D = (k, id) => k === 'spatial' || k === 'doc' || k === 'dom3d' || is3DSpatial(id);
  const stOf = (k) => k === 'spatial' ? spatial3DState : document3DFXState;

  // ---------------------------------------------------------------- store
  let store = {};
  try {
    store = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    if (store['spatial-3d-motion-suite'] && (!store['spatial-3d-motion-suite']._v || store['spatial-3d-motion-suite']._v < 18)) {
      delete store['spatial-3d-motion-suite'];
      try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (_) {}
    }
  } catch (_) { store = {}; }
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
    if (!store[id]) store[id] = { _v: id === 'spatial-3d-motion-suite' ? 18 : 4, mode: id === 'spatial-3d-motion-suite' ? 'video' : '3d', fx: { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 }, texts: {}, spatial: null, doc: null, snapshot: null };
    if (id === 'spatial-3d-motion-suite' && (!store[id]._v || store[id]._v < 18)) {
      store[id].mode = 'video';
      store[id]._v = 18;
      store[id].spatial = null;
      store[id].snapshot = null;
    }
    return store[id];
  }
  window.tpl3DFx = { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 };

  // ---------------------------------------------------------------- text slots
  // Pure parallax defaults to clean canvas (no text by default)
  const SPATIAL_SLOTS = [
    { key: 'title', label: 'Main 3D Hero Title', def: 'AWAKENING' },
    { key: 'subtitle', label: 'Secondary 3D Subtitle', def: 'THE SYSTEM' },
    { key: 'a-title', label: 'Left Evidence Plate Title', def: 'DECLASSIFIED MEMORANDUM' },
    { key: 'a-sub', label: 'Left Evidence Plate Tag', def: 'EXHIBIT A // ARCHIVAL RECORD' },
    { key: 'b-title', label: 'Right Evidence Plate Title', def: 'LIQUIDITY & VALUATION INDEX' },
    { key: 'b-sub', label: 'Right Evidence Plate Detail', def: 'CAPITAL CONCENTRATION ($B)' }
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
  let openLayerIdx = -1; // -2 = Z=0 Background Environment drawer open; 0..N = exhibit layer open
  let spatialLayerOrderMode = 'bg-first'; // 'bg-first' (Z=0 -> N) or 'top-down'
  let spatialLayerFilter = 'all'; // 'all', 'bg', 'media', 'shapes', 'text'
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
      const validLayers = (s.elements3D && s.elements3D.length > 0) ? s.elements3D.map(m => {
        const u = m.userData || {};
        return {
          id: u.id, type: u.type,
          artifactMode: u.artifactMode || (u.type === 'text' ? 'text' : 'image'),
          objectShape: u.objectShape || u.objectGeometry || 'icosahedron',
          objectGeometry: u.objectShape || u.objectGeometry || 'icosahedron',
          shapeType: u.shapeType || 'arch-frame',
          contourShape: u.contourShape || s.cardContourShape || 'rounded-rect',
          contourColor: u.contourColor || u.color || s.cardContourColor || '#f59e0b',
          contourWidth: u.contourWidth !== undefined ? u.contourWidth : (s.cardContourWidth !== undefined ? s.cardContourWidth : 3),
          contourGlow: u.contourGlow !== undefined ? u.contourGlow : (s.cardContourGlow !== undefined ? s.cardContourGlow : 18),
          stopHere: !!u.stopHere,
          sfxId: u.sfxId || 'none',
          sfxVol: u.sfxVol !== undefined ? u.sfxVol : 0.85,
          sfxFade: u.sfxFade !== undefined ? u.sfxFade : 0.25,
          imageUrl: u.imageUrl || '',
          videoUrl: u.videoUrl || '',
          cameraAction: u.cameraAction || (u.type === 'text' ? 'glance' : 'stop-zoom'),
          visible: u.visible !== false,
          magazineTitle: u.magazineTitle,
          featureTag: u.featureTag,
          featureTitle: u.featureTitle,
          topTickerLeft: u.topTickerLeft,
          topTickerRight: u.topTickerRight,
          kickerBadge: u.kickerBadge,
          beamActive: u.beamActive,
          beamColor: u.beamColor,
          paparazziFlashes: u.paparazziFlashes,
          title: u.title, subtitle: u.subtitle, body: u.body, text: u.text,
          stamp: u.stamp || '',
          transitionEffect: u.transitionEffect || 'fade',
          fontFamily: u.fontFamily || 'Cinzel',
          color: u.color || u.contourColor || '#f59e0b', scale: u.scale || 1,
          x: u.baseX !== undefined ? u.baseX : m.position.x,
          y: u.baseY !== undefined ? u.baseY : m.position.y,
          z: u.initialZ !== undefined ? u.initialZ : m.position.z
        };
      }) : (e.spatial && e.spatial.layers && e.spatial.layers.length > 0 ? e.spatial.layers : null);

      e.spatial = {
        stylePreset: s.stylePreset || 'documentary',
        flightMode: s.flightMode || s.defaultFlightPreset || 'establishing-shot',
        defaultFlightPreset: s.defaultFlightPreset || 'establishing-shot',
        recordStartBase: s.recordStartBase || 'establishing-shot',
        lastRecordedTrajectory: s.lastRecordedTrajectory || null,
        customRecordedPresets: Array.isArray(s.customRecordedPresets) ? s.customRecordedPresets.slice() : [],
        threeDWalkMode: s.threeDWalkMode || 'free-walk',
        customStartPoint: s.customStartPoint ? Object.assign({}, s.customStartPoint) : { x: 0, y: 20, z: 320, yaw: 0, pitch: 0 },
        hasCustomStartPoint: !!s.hasCustomStartPoint,
        lastStartZoomAction: s.lastStartZoomAction || null,
        zoomActionSpeed: s.zoomActionSpeed !== undefined ? s.zoomActionSpeed : 1.0,
        zoomPercent: s.zoomPercent !== undefined ? s.zoomPercent : 100,
        manualZoomPct: s.manualZoomPct !== undefined ? s.manualZoomPct : 100,
        zoomFxShake: !!s.zoomFxShake,
        zoomFxShakeIntensity: s.zoomFxShakeIntensity !== undefined ? s.zoomFxShakeIntensity : 55,
        zoomFxPulse: !!s.zoomFxPulse,
        zoomFxPulseIntensity: s.zoomFxPulseIntensity !== undefined ? s.zoomFxPulseIntensity : 55,
        zoomFxBoom: !!s.zoomFxBoom,
        zoomFxBoomIntensity: s.zoomFxBoomIntensity !== undefined ? s.zoomFxBoomIntensity : 65,
        stopMode: s.stopMode || 'none',
        randomStopLayerId: s.randomStopLayerId || null,
        cameramanStyle: s.cameramanStyle || 'roaming-curator',
        slowMoIntensity: s.slowMoIntensity !== undefined ? s.slowMoIntensity : 68,
        zoomInspectDepth: s.zoomInspectDepth !== undefined ? s.zoomInspectDepth : 65,
        detourVeerStrength: s.detourVeerStrength !== undefined ? s.detourVeerStrength : 75,
        wallLookAround: s.wallLookAround !== undefined ? s.wallLookAround : 65,
        camSpeed: s.camSpeed !== undefined ? s.camSpeed : 1.0,
        camDrift: s.camDrift !== undefined ? s.camDrift : 18,
        camShake: s.camShake !== undefined ? s.camShake : 6,
        camPitch: s.camPitch || 0,
        camYaw: s.camYaw || 0,
        fovWarp: s.fovWarp || 50,
        fogDensity: s.fogDensity !== undefined ? s.fogDensity : 28,
        lightIntensity: s.lightIntensity !== undefined ? s.lightIntensity : 115,
        cardContourColor: s.cardContourColor || '#d4af37',
        cardContourShape: s.cardContourShape || 'rounded-rect',
        cardContourWidth: s.cardContourWidth !== undefined ? s.cardContourWidth : 1.5,
        cardContourGlow: s.cardContourGlow !== undefined ? s.cardContourGlow : 8,
        slowMoRampEnabled: !!s.slowMoRampEnabled,
        slowMoCurvePreset: s.slowMoCurvePreset || 'slow-slow-boom',
        slowMoTriggerT: s.slowMoTriggerT !== undefined ? s.slowMoTriggerT : 0.45,
        slowMoDecelSpan: s.slowMoDecelSpan !== undefined ? s.slowMoDecelSpan : 0.18,
        slowMoDipSpeed: s.slowMoDipSpeed !== undefined ? s.slowMoDipSpeed : -0.35,
        slowMoBoomBurst: s.slowMoBoomBurst !== undefined ? s.slowMoBoomBurst : 1.85,
        handControlMode: s.handControlMode || 'detour-spring',
        handAutoPreviewIn3D: s.handAutoPreviewIn3D !== false,
        audioEnabled: s.audioEnabled !== false,
        audioVolume: s.audioVolume !== undefined ? s.audioVolume : 0.75,
        customAudioClips: Array.isArray(s.customAudioClips) ? s.customAudioClips.slice() : [],
        audioEvents: Object.assign({
          onSceneStart: 'none',
          onFlyByTransition: 'none',
          onObjectStop: 'none',
          onSlowMoDip: 'none',
          onSlowMoBoom: 'none',
          onTextReveal: 'none'
        }, s.audioEvents || {}),
        audioEventSettings: Object.assign({
          onSceneStart: { volume: 0.85, fade: 0.25 },
          onFlyByTransition: { volume: 0.80, fade: 0.20 },
          onObjectStop: { volume: 0.90, fade: 0.10 },
          onSlowMoDip: { volume: 0.85, fade: 0.35 },
          onSlowMoBoom: { volume: 1.00, fade: 0.20 },
          onTextReveal: { volume: 0.75, fade: 0.15 }
        }, s.audioEventSettings || {}),
        gridVisible: !!s.gridVisible,
        dustVisible: s.dustVisible !== false,
        smokeVisible: s.smokeVisible !== false,
        smokeIntensity: s.smokeIntensity !== undefined ? s.smokeIntensity : 65,
        smokeColor: s.smokeColor || '#1e293b',
        activePreset: s.activePreset || 'documentary',
        bgStyle: s.bgStyle || 'cyber-set',
        bgColor: s.bgColor || '#05070d',
        transparentBg: !!s.transparentBg,
        envStyle: s.envStyle || 'deep-cosmos',
        gridDensity: s.gridDensity || 180,
        gridSpeed: s.gridSpeed !== undefined ? s.gridSpeed : 0.8,
        gridLuminescence: s.gridLuminescence !== undefined ? s.gridLuminescence : 28,
        gridGlow: s.gridGlow !== undefined ? s.gridGlow : 45,
        gridColor: s.gridColor || '#475569',
        gridWallMode: s.gridWallMode || 'floor',
        starCount: s.starCount || 1400,
        starSize: s.starSize || 3.8,
        starSpeed: s.starSpeed !== undefined ? s.starSpeed : 1.0,
        showCelestialObjects: s.showCelestialObjects !== false,
        showText: s.showText !== false,
        textFont: s.textFont || 'Cinzel',
        textStyle: s.textStyle || 'gold',
        textPrimaryColor: s.textPrimaryColor || '#d4af37',
        textSecondaryColor: s.textSecondaryColor || '#fef3c7',
        textBevel: s.textBevel !== false,
        pathStyle: s.pathStyle || 'corridor-hallway',
        pathCurve: s.pathCurve || 0,
        drawnPath: s.drawnPath || null,
        layers: validLayers
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
    return item.type === 'text' ? createSpatialTextPlane(item) : (item.type === 'card' || item.type === 'image' || item.type === 'object' || item.type === 'video' || item.type === 'shape') ? createSpatialCardPlane(item) : createSpatialCodePlane(item);
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
    if (s._appliedSig === sig && s.scene && s.elements3D && s.elements3D.length > 0) return;
    s._appliedSig = sig;
    if (sp) {
      [
        'stylePreset', 'flightMode', 'defaultFlightPreset', 'recordStartBase', 'lastRecordedTrajectory', 'customRecordedPresets',
        'threeDWalkMode', 'customStartPoint', 'hasCustomStartPoint', 'lastStartZoomAction',
        'zoomActionSpeed', 'zoomPercent', 'manualZoomPct', 'zoomFxShake', 'zoomFxShakeIntensity', 'zoomFxPulse', 'zoomFxPulseIntensity', 'zoomFxBoom', 'zoomFxBoomIntensity',
        'stopMode', 'randomStopLayerId',
        'cameramanStyle', 'slowMoIntensity', 'zoomInspectDepth', 'detourVeerStrength', 'wallLookAround',
        'camSpeed', 'camDrift', 'camShake', 'camPitch', 'camYaw', 'fovWarp', 'fogDensity', 'lightIntensity',
        'cardContourColor', 'cardContourShape', 'cardContourWidth', 'cardContourGlow',
        'slowMoRampEnabled', 'slowMoCurvePreset', 'slowMoTriggerT', 'slowMoDecelSpan', 'slowMoDipSpeed', 'slowMoBoomBurst',
        'handControlMode', 'handAutoPreviewIn3D', 'audioEnabled', 'audioVolume', 'customAudioClips', 'audioEvents', 'audioEventSettings',
        'gridVisible', 'dustVisible', 'smokeVisible', 'smokeIntensity', 'smokeColor', 'activePreset',
        'bgStyle', 'bgColor', 'transparentBg', 'envStyle', 'gridDensity', 'gridSpeed', 'gridLuminescence',
        'gridGlow', 'gridColor', 'gridWallMode', 'starCount', 'starSize', 'starSpeed', 'showCelestialObjects',
        'showText', 'textFont', 'textStyle', 'textPrimaryColor', 'textSecondaryColor', 'textBevel',
        'pathStyle', 'pathCurve', 'drawnPath'
      ].forEach(f => { if (sp[f] !== undefined) s[f] = sp[f]; });
      if (sp.layers && sp.layers.length) setSpatialLayers(sp.layers);
    }
    // Guarantee corridor elements are loaded
    if (!s.elements3D || s.elements3D.length === 0) {
      if (typeof loadSpatialPreset === 'function') {
        loadSpatialPreset(s.activePreset || 'documentary');
      }
    }
    if (s.camera) { s.camera.fov = s.fovWarp || 52; s.camera.updateProjectionMatrix(); }
    if (s.scene && s.scene.fog) s.scene.fog.density = 0.0001 + ((s.fogDensity || 32) / 100) * 0.0008;
    if (s.ambientLight) s.ambientLight.intensity = ((s.lightIntensity || 110) / 100) * 0.95;
    if (typeof updateSpatialEnvironmentGrid === 'function') updateSpatialEnvironmentGrid();
    else if (s.floorGrid) s.floorGrid.visible = s.gridVisible;
    // unified text overrides
    Object.keys(e.texts || {}).forEach(key => {
      const m = SPATIAL_3D[key]; if (!m) return;
      rebuildSpatialLayer(m.l, m.f === 'body' ? { body: e.texts[key], text: e.texts[key] } : { [m.f]: e.texts[key] }, true);
    });
  }
  function rebuildSpatialLayer(i, patch, silent) {
    const s = spatial3DState, old = s.elements3D[i];
    if (!old || !s.scene) return;
    const u = old.userData;
    const item = Object.assign({}, u, { x: u.baseX !== undefined ? u.baseX : old.position.x, y: u.baseY !== undefined ? u.baseY : old.position.y, z: u.initialZ !== undefined ? u.initialZ : old.position.z }, patch);
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

  // Granular "Slows, slows... → Negative Dip → BOOM starts again!" speed curve
  let _lastDriveTs = 0;
  function computeSlowMoSpeedMultiplier(s, curT) {
    if (!s.slowMoRampEnabled) return 1.0;
    const trig = s.slowMoTriggerT !== undefined ? s.slowMoTriggerT : 0.45;
    const span = Math.max(0.05, s.slowMoDecelSpan !== undefined ? s.slowMoDecelSpan : 0.18);
    const dip = s.slowMoDipSpeed !== undefined ? s.slowMoDipSpeed : -0.35;
    const boom = s.slowMoBoomBurst !== undefined ? s.slowMoBoomBurst : 1.85;
    const preset = s.slowMoCurvePreset || 'slow-slow-boom';

    const dist = curT - trig;
    if (dist >= -span && dist < 0) {
      // Phase 1: "Slows, slows..." progressive deceleration into dip/negative motion
      const u = (dist + span) / span; // 0 -> 1
      const e = u * u * (3 - 2 * u);
      if (u > 0.35 && !s._slowMoDipPlayed) {
        s._slowMoDipPlayed = true;
        s._slowMoBoomPlayed = false;
        if (s.audioEvents && s.audioEvents.onSlowMoDip && typeof window.playSpatialSFX === 'function') {
          window.playSpatialSFX(s.audioEvents.onSlowMoDip, false, { eventKey: 'onSlowMoDip' });
        }
      }
      if (preset === 'heartbeat-pulse') {
        return 1.0 - Math.sin(u * Math.PI * 2) * (1.0 - dip);
      }
      return 1.0 + (dip - 1.0) * e;
    } else if (dist >= 0 && dist < span * 0.45) {
      // Phase 2: Deep slow-mo / negative pullback hold before the BOOM
      const u = dist / (span * 0.45);
      if (preset === 'elastic-recoil') {
        return dip * (1.0 - u * 0.5);
      }
      return dip + (0.15 - dip) * (u * u);
    } else if (dist >= span * 0.45 && dist < span * 1.15) {
      // Phase 3: "...and BOOM, it starts again!" explosive forward burst
      const u = (dist - span * 0.45) / (span * 0.70);
      if (!s._slowMoBoomPlayed) {
        s._slowMoBoomPlayed = true;
        if (s.audioEvents && s.audioEvents.onSlowMoBoom && typeof window.playSpatialSFX === 'function') {
          window.playSpatialSFX(s.audioEvents.onSlowMoBoom, false, { eventKey: 'onSlowMoBoom' });
        }
      }
      const burstCurve = Math.sin(u * Math.PI);
      return 1.0 + (boom - 1.0) * burstCurve;
    } else {
      if (Math.abs(dist) > span * 1.4) {
        s._slowMoDipPlayed = false;
        s._slowMoBoomPlayed = false;
      }
      return 1.0;
    }
  }

  function driveSpatial(e, t, dtArg) {
    const s = spatial3DState;
    s.isPlaying = false;
    const isZoomMode = (
      s.threeDWalkMode === 'auto-zoom-in' ||
      s.threeDWalkMode === 'auto-zoom-out' ||
      s.flightMode === 'start-point-zoom-in' ||
      s.flightMode === 'start-point-zoom-out'
    );
    const baseSpeed = isZoomMode
      ? (s.zoomActionSpeed !== undefined ? s.zoomActionSpeed : (s.camSpeed !== undefined ? s.camSpeed : 1.0))
      : (s.camSpeed !== undefined ? s.camSpeed : 1.0);
    // 18.0-second reference cycle = 1.5x slower than the original 12.0s cycle at 1.0x speed
    const refCycleSeconds = 18.0;

    if (dtArg !== undefined) {
      // Continuous delta-time integration so the 3D scene NEVER freezes at 4.0s and never jumps when speed changes
      const mult = s.slowMoRampEnabled ? computeSlowMoSpeedMultiplier(s, s.currentTime || 0) : 1.0;
      const effectiveSpeed = baseSpeed * mult;
      if (Math.abs(effectiveSpeed) < 0.002) return;
      const stepT = (dtArg / refCycleSeconds) * effectiveSpeed;
      let nextT = (s.currentTime || 0) + stepT;
      if (nextT > 1.0) {
        nextT = nextT % 1.0;
        s._triggeredStopIds = {};
        s._triggeredFlyByIds = {};
      } else if (nextT < 0.0) {
        nextT = 1.0 + (nextT % 1.0);
        s._triggeredStopIds = {};
        s._triggeredFlyByIds = {};
      }
      s.currentTime = Math.max(0, Math.min(1, nextT));
    } else {
      // Deterministic timeline clip evaluation at time t
      if (Math.abs(baseSpeed) < 0.01) return;
      const absSpeed = Math.max(0.04, Math.abs(baseSpeed));
      const cycleDuration = refCycleSeconds / absSpeed;
      const progress = ((t % cycleDuration) + cycleDuration) % cycleDuration / cycleDuration;
      if (baseSpeed < 0) {
        s.currentTime = 1.0 - progress;
      } else {
        s.currentTime = progress;
      }
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
  let spatialLiveClock = 0;
  function startLoop(k) {
    const st = stOf(k);
    if (st.animId) cancelAnimationFrame(st.animId);
    let lastTickTs = performance.now();
    const tick = () => {
      if (!st.renderer) { st.animId = null; return; }
      const nowTs = performance.now();
      const dt = Math.min(0.06, Math.max(0.001, (nowTs - lastTickTs) / 1000));
      lastTickTs = nowTs;
      const tplId = k === 'spatial' ? 'spatial-3d-motion-suite' : 'document-3d-fx-engine';
      const e = entry(tplId);
      if (k === 'spatial') {
        const is3DStage = (e.mode === '3d');
        st._is3DStageActive = is3DStage;
        const isVideoPaused = !is3DStage && (typeof topCustomizerState !== 'undefined' && topCustomizerState.isPlaying === false);
        st._isVideoPaused = isVideoPaused;
        const shouldAdvanceClock = !isVideoPaused && (!is3DStage || st.isRecording || (st.threeDWalkMode && st.threeDWalkMode !== 'free-walk'));
        if (shouldAdvanceClock) {
          spatialLiveClock += dt;
          driveSpatial(e, spatialLiveClock, dt);
        }
        updateSpatialCameraPosition();
        if (shouldAdvanceClock) {
          if (st.gridMeshes && st.gridMeshes.group && st.gridSpeed > 0) {
            const cellSpan = 10000 / Math.max(40, st.gridDensity || 180);
            const refZ = (st.currentTime * 2400 * st.gridSpeed) + Math.abs(st.handDetourZ || 0);
            st.gridMeshes.group.position.z = refZ % cellSpan;
          }
          if (st.particlesMesh && st.particlesMesh.visible) {
            st.particlesMesh.rotation.y += 0.0003 * (st.starSpeed || 1);
            st.particlesMesh.rotation.x += 0.0001 * (st.starSpeed || 1);
          }
          if (st.smokeGroup && st.smokeGroup.visible) {
            const nowSec = nowTs * 0.001;
            st.smokeGroup.children.forEach(puff => {
              const ud = puff.userData || {};
              puff.rotation.z += (ud.driftSpeed || 0.0004);
              puff.position.x = (ud.baseX || 0) + Math.sin(nowSec * 0.5 + (ud.phase || 0)) * 55;
            });
          }
        }
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

  function s_applyFirst(e, tplId) { applySpatialStored(e); if (!e.spatial || !e.spatial.layers || !e.spatial.layers.length) capture(tplId); }
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
        <button type="button" data-act="mode-video" style="padding:3px 10px;font-size:10.5px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:${mode === 'video' ? 'rgba(168,85,247,.35)' : 'transparent'};color:${mode === 'video' ? '#fff' : '#94a3b8'};" title="Auto-playing 3D Motion Animation (Video Mode)">\u25b6 Video</button>
        <button type="button" data-act="mode-3d" style="padding:3px 10px;font-size:10.5px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:${mode === '3d' ? 'rgba(168,85,247,.35)' : 'transparent'};color:${mode === '3d' ? '#fff' : '#94a3b8'};" title="Interactive 3D Hand Walk-Through Mode">\u2b21 3D</button></div>`;
    }
    html += `</div>`;

    // shared text section (same fields in Video and 3D)
    const slots = slotsFor(tplId);
    const textHtml = slots.map((sl, i) => {
      let v = e.texts[sl.key];
      if (v == null) v = get3DText(tplId, sl);
      if (v == null) v = sl.def != null ? sl.def : '';
      return txt('tx-' + i, sl.label, v);
    }).join('');

    if ((mode === 'video' && k !== 'spatial') || k === 'dom3d') {
      if (mode === '3d' && k === 'dom3d') {
        html += `<div style="background:linear-gradient(135deg, rgba(168,85,247,0.18), rgba(56,189,248,0.12));border:1px solid rgba(192,132,252,0.45);border-radius:8px;padding:8px 10px;display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:15px;">\ud83d\udd90\ufe0f</span>
          <div style="display:flex;flex-direction:column;gap:1px;">
            <span style="font-size:10.5px;font-weight:800;color:#f3e8ff;letter-spacing:0.04em;">INTERACTIVE 3D HAND ORBIT ACTIVE</span>
            <span style="font-size:9.5px;color:#cbd5e1;">Grab &amp; drag the stage to tilt/rotate in 3D \u2022 Scroll wheel to zoom</span>
          </div>
        </div>`;
      }
      if (typeof fx.speed === 'number' && fx.speed <= 0) {
        fx.speed = Number(Math.max(0.1, 1 / (1 + Math.abs(fx.speed))).toFixed(2));
      }
      const curSpeedVal = (typeof fx.speed === 'number' && fx.speed > 0) ? fx.speed : 1.0;
      const fmtSpeed = (v) => {
        const n = Number(v);
        const eff = n <= 0 ? Math.max(0.1, 1 / (1 + Math.abs(n))) : n;
        return eff.toFixed(2) + 'x' + (eff < 0.95 ? ' (Slow)' : (eff > 1.05 ? ' (Fast)' : ''));
      };
      const u3dRecActive = !!(window._univ3dRecordState && window._univ3dRecordState.isRecording && window._univ3dRecordState.tplId === tplId);
      const u3dSavedPath = window._universal3DRecordedPaths && window._universal3DRecordedPaths[tplId];
      const u3dHasPath = !!(u3dSavedPath && u3dSavedPath.frames && u3dSavedPath.frames.length > 1);
      html += section(mode === '3d' ? '3D Camera Rig, Live Orbit & Motion Recorder' : 'Motion & 3D Keyframe Recorder', [
        `<div style="background:linear-gradient(135deg, rgba(239,68,68,0.14), rgba(15,23,42,0.92));border:1px solid ${u3dRecActive ? '#ef4444' : 'rgba(248,113,113,0.38)'};border-radius:8px;padding:7px 9px;display:flex;flex-direction:column;gap:5px;margin-bottom:4px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <span style="font-size:9.5px;font-weight:800;color:#fecaca;letter-spacing:0.04em;text-transform:uppercase;">\u25cf 3D Keyframe Motion Recorder</span>
            <span style="font-size:8.5px;font-weight:700;color:${u3dRecActive ? '#fca5a5' : (u3dHasPath ? '#6ee7b7' : '#94a3b8')};font-family:monospace;">${u3dRecActive ? 'RECORDING...' : (u3dHasPath ? (u3dSavedPath.frames.length + ' pts saved') : 'READY')}</span>
          </div>
          <span style="font-size:8.8px;color:#cbd5e1;line-height:1.3;">Click <b>Record 3D Motion</b>, then drag/tilt/zoom the 3D element directly on the stage to record your custom keyframe trajectory.</span>
          <div style="display:flex;gap:5px;">
            <button type="button" data-act="u3d-rec-toggle" style="flex:1;padding:5px 8px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${u3dRecActive ? '#fde047' : '#f87171'};background:${u3dRecActive ? '#dc2626' : 'rgba(239,68,68,0.28)'};color:#fff;">${u3dRecActive ? '\u25a0 Stop & Save Path' : '\u25cf Record 3D Motion'}</button>
            ${u3dHasPath ? `<button type="button" data-act="u3d-rec-replay" style="padding:5px 8px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(52,211,153,0.55);background:rgba(16,185,129,0.22);color:#a7f3d0;">\u25b6 Replay</button>` : ''}
            ${u3dHasPath ? `<button type="button" data-act="u3d-rec-clear" style="padding:5px 7px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.06);color:#94a3b8;" title="Clear Recorded Path">\u2715</button>` : ''}
          </div>
        </div>`,
        row('v-speed', 'Playback Speed', 0.1, 3.0, 0.05, curSpeedVal, fmtSpeed),
        row('v-pitch', 'Tilt Pitch (X)', -45, 45, 1, fx.pitch, v => v + '\u00b0'),
        row('v-yaw', 'Rotation Yaw (Y)', -45, 45, 1, fx.yaw, v => v + '\u00b0'),
        row('v-roll', 'Roll (Z)', -30, 30, 1, fx.roll, v => v + '\u00b0'),
        row('v-zoom', 'Zoom / Depth', 0.6, 2.2, 0.05, fx.zoom, v => v.toFixed(2) + 'x'),
        `<button type="button" data-act="v-reset" style="padding:5px;font-size:10.5px;border-radius:6px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;">Reset 3D Camera</button>`
      ].join(''));

      if (tplId === 'parallax') {
        const st = (typeof topCustomizerState !== 'undefined' && topCustomizerState) ? topCustomizerState : {};
        const fgDir = st.spoonerFgDir || 'push';
        const bgDir = st.spoonerBgDir || 'pull';
        const txtDir = st.spoonerTxtDir || 'off';
        const fgZoomPct = Math.round(((st.spoonerFgZoom !== undefined ? st.spoonerFgZoom : 1.22)) * 100);
        const bgZoomPct = Math.round(((st.spoonerBgZoom !== undefined ? st.spoonerBgZoom : 1.16)) * 100);
        const panPx = st.spoonerPan !== undefined ? st.spoonerPan : 0;
        const blurPx = st.spoonerBlur !== undefined ? st.spoonerBlur : 0;
        const isPushPull = fgDir === 'push' && bgDir === 'pull';
        const isPullPush = fgDir === 'pull' && bgDir === 'push';

        html += section('Parallax Push-In / Pull-Out & Zoom %', [
          `<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:4px;">
            <button type="button" data-act="px-preset-push-pull" style="padding:6px 6px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${isPushPull ? '#2effc6' : 'rgba(255,255,255,0.12)'};background:${isPushPull ? 'rgba(46,255,198,0.18)' : 'rgba(255,255,255,0.04)'};color:${isPushPull ? '#2effc6' : '#cbd5e1'};">\u2197 FG Push \u2022 BG Pull</button>
            <button type="button" data-act="px-preset-pull-push" style="padding:6px 6px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${isPullPush ? '#38bdf8' : 'rgba(255,255,255,0.12)'};background:${isPullPush ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.04)'};color:${isPullPush ? '#38bdf8' : '#cbd5e1'};">\u2199 FG Pull \u2022 BG Push</button>
          </div>`,
          `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding:3px 0;">
            <span style="font-size:10px;font-weight:700;color:#e2e8f0;">Foreground Cutout</span>
            <div style="display:flex;gap:4px;">
              <button type="button" data-act="px-fg-push" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${fgDir === 'push' ? '#2effc6' : 'rgba(255,255,255,0.12)'};background:${fgDir === 'push' ? 'rgba(46,255,198,0.2)' : 'rgba(255,255,255,0.04)'};color:${fgDir === 'push' ? '#2effc6' : '#94a3b8'};">\u2197 Push In</button>
              <button type="button" data-act="px-fg-pull" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${fgDir === 'pull' ? '#2effc6' : 'rgba(255,255,255,0.12)'};background:${fgDir === 'pull' ? 'rgba(46,255,198,0.2)' : 'rgba(255,255,255,0.04)'};color:${fgDir === 'pull' ? '#2effc6' : '#94a3b8'};">\u2199 Pull Out</button>
            </div>
          </div>`,
          row('px-fg-zoom', 'Foreground Zoom %', 104, 160, 1, fgZoomPct, v => Math.round(v) + '%'),
          `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding:3px 0;margin-top:2px;">
            <span style="font-size:10px;font-weight:700;color:#e2e8f0;">Background Scene</span>
            <div style="display:flex;gap:4px;">
              <button type="button" data-act="px-bg-pull" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${bgDir === 'pull' ? '#38bdf8' : 'rgba(255,255,255,0.12)'};background:${bgDir === 'pull' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'};color:${bgDir === 'pull' ? '#38bdf8' : '#94a3b8'};">\u2199 Pull Out</button>
              <button type="button" data-act="px-bg-push" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${bgDir === 'push' ? '#38bdf8' : 'rgba(255,255,255,0.12)'};background:${bgDir === 'push' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'};color:${bgDir === 'push' ? '#38bdf8' : '#94a3b8'};">\u2197 Push In</button>
            </div>
          </div>`,
          row('px-bg-zoom', 'Background Zoom %', 104, 150, 1, bgZoomPct, v => Math.round(v) + '%'),
          `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding:3px 0;margin-top:2px;">
            <span style="font-size:10px;font-weight:700;color:#e2e8f0;">Text Behind Subject</span>
            <div style="display:flex;gap:4px;">
              <button type="button" data-act="px-txt-off" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${txtDir === 'off' ? '#f43f5e' : 'rgba(255,255,255,0.12)'};background:${txtDir === 'off' ? 'rgba(244,63,94,0.22)' : 'rgba(255,255,255,0.04)'};color:${txtDir === 'off' ? '#fda4af' : '#94a3b8'};">\u2715 OFF</button>
              <button type="button" data-act="px-txt-push" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${txtDir === 'push' ? '#a855f7' : 'rgba(255,255,255,0.12)'};background:${txtDir === 'push' ? 'rgba(168,85,247,0.22)' : 'rgba(255,255,255,0.04)'};color:${txtDir === 'push' ? '#d8b4fe' : '#94a3b8'};">Push In</button>
              <button type="button" data-act="px-txt-pull" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${txtDir === 'pull' ? '#a855f7' : 'rgba(255,255,255,0.12)'};background:${txtDir === 'pull' ? 'rgba(168,85,247,0.22)' : 'rgba(255,255,255,0.04)'};color:${txtDir === 'pull' ? '#d8b4fe' : '#94a3b8'};">Pull Out</button>
            </div>
          </div>`,
          row('px-pan', 'Horizontal Drift (0 = Pure Push/Pull)', 0, 35, 1, panPx, v => Math.round(v) + 'px'),
          row('px-blur', 'Backdrop Lens Blur (DOF)', 0, 12, 0.5, blurPx, v => Number(v).toFixed(1) + 'px')
        ].join(''));
      }

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
      const curStylePreset = s.stylePreset || (s.activePreset === 'tech-investigative' || s.activePreset === 'cyberpunk' ? s.activePreset : 'documentary');
      const curFlight = s.flightMode || 'establishing-shot';
      const curStopMode = s.stopMode || 'none';
      const curContourShape = s.cardContourShape || 'rounded-rect';
      const curContourColor = s.cardContourColor || '#d4af37';
      const layersList = s.elements3D || [];

      // =========================================================================
      // 0. ART DIRECTION STYLE PRESETS (DOCUMENTARY DEFAULT / TECH-INVESTIGATIVE / CYBERPUNK)
      //    + 4-SECOND SAMPLE FLOW TIMELINE BEATS
      // =========================================================================
      const styleCards = [
        {
          id: 'documentary',
          title: 'Premium Doc',
          tag: '(Default)',
          sub: 'Obsidian & Gold',
          accent: '#d4af37',
          bg: 'linear-gradient(135deg, rgba(212,175,55,0.24), rgba(15,23,42,0.95))',
          swatch: 'radial-gradient(circle at 55% 40%, rgba(251,191,36,0.55), rgba(10,12,20,0.95))'
        },
        {
          id: 'tech-investigative',
          title: 'Investigative',
          tag: 'Tech',
          sub: '3D Cyan Globe',
          accent: '#38bdf8',
          bg: 'linear-gradient(135deg, rgba(56,189,248,0.24), rgba(15,23,42,0.95))',
          swatch: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.55), rgba(6,12,24,0.95))'
        },
        {
          id: 'cyberpunk',
          title: 'Cyberpunk',
          tag: 'Neon Grid',
          sub: 'Violet & Chrome',
          accent: '#a855f7',
          bg: 'linear-gradient(135deg, rgba(168,85,247,0.26), rgba(15,23,42,0.95))',
          swatch: 'radial-gradient(circle at 50% 45%, rgba(192,132,252,0.55), rgba(12,6,24,0.95))'
        }
      ];
      html += `<div style="background:#0a0e18;border:1px solid rgba(212,175,55,0.34);border-radius:10px;padding:9px 9px;display:flex;flex-direction:column;gap:7px;box-sizing:border-box;width:100%;max-width:100%;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;min-width:0;">
          <span style="font-size:10px;font-weight:800;color:#fef3c7;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Art Direction &amp; Style Presets</span>
          <span style="font-size:8px;font-weight:700;padding:1px 5px;border-radius:999px;background:rgba(212,175,55,0.16);color:#fde68a;border:1px solid rgba(212,175,55,0.35);flex-shrink:0;">GRID ${s.gridVisible ? 'ON' : 'OFF'}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:5px;width:100%;box-sizing:border-box;">
          ${styleCards.map(sc => {
            const active = curStylePreset === sc.id;
            return `<button type="button" data-act="s-style-preset-${sc.id}" style="min-width:0;width:100%;box-sizing:border-box;overflow:hidden;padding:5px 5px 6px 5px;border-radius:8px;cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px;position:relative;border:${active ? '1.5px solid ' + sc.accent : '1px solid rgba(255,255,255,0.12)'};background:${active ? sc.bg : 'rgba(15,23,42,0.82)'};box-shadow:${active ? '0 0 12px ' + sc.accent + '33' : 'none'};">
              <div style="width:100%;height:26px;border-radius:5px;background:${sc.swatch};border:1px solid ${active ? sc.accent : 'rgba(255,255,255,0.08)'};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
                <span style="font-size:7px;font-weight:900;letter-spacing:0.08em;color:${active ? '#fff' : '#cbd5e1'};text-shadow:0 1px 4px #000;">AWAKENING</span>
                ${active ? `<span style="position:absolute;top:2px;right:2px;width:11px;height:11px;border-radius:50%;background:${sc.accent};color:#05060b;font-size:7.5px;font-weight:900;display:flex;align-items:center;justify-content:center;line-height:1;">\u2713</span>` : ''}
              </div>
              <span style="font-size:8.8px;font-weight:800;color:${active ? '#ffffff' : '#e2e8f0'};width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.15;">${esc(sc.title)}</span>
              <span style="font-size:7.4px;color:${active ? sc.accent : '#94a3b8'};width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.1;">${esc(sc.sub)}</span>
            </button>`;
          }).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;padding-top:3px;border-top:1px solid rgba(255,255,255,0.07);min-width:0;">
          <span style="font-size:8.5px;font-weight:700;color:#cbd5e1;">Sample Flow (4 Seconds \u2022 Click beat to preview):</span>
          <div style="display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:4px;width:100%;box-sizing:border-box;">
            <button type="button" data-act="s-sample-beat-0" style="min-width:0;padding:4px 2px;font-size:7.8px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid rgba(212,175,55,0.3);background:rgba(255,255,255,0.04);color:#fde68a;text-align:center;overflow:hidden;" title="0.0–1.0s: Establish the environment">0.0\u20131.0s<br/><span style="font-size:6.8px;color:#94a3b8;">Establish</span></button>
            <button type="button" data-act="s-sample-beat-1" style="min-width:0;padding:4px 2px;font-size:7.8px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid rgba(212,175,55,0.3);background:rgba(255,255,255,0.04);color:#fde68a;text-align:center;overflow:hidden;" title="1.0–2.0s: Introduce key evidence">1.0\u20132.0s<br/><span style="font-size:6.8px;color:#94a3b8;">Evidence</span></button>
            <button type="button" data-act="s-sample-beat-2" style="min-width:0;padding:4px 2px;font-size:7.8px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid rgba(212,175,55,0.3);background:rgba(255,255,255,0.04);color:#fde68a;text-align:center;overflow:hidden;" title="2.0–3.0s: Reveal the connection">2.0\u20133.0s<br/><span style="font-size:6.8px;color:#94a3b8;">Connection</span></button>
            <button type="button" data-act="s-sample-beat-3" style="min-width:0;padding:4px 2px;font-size:7.8px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid rgba(212,175,55,0.3);background:rgba(255,255,255,0.04);color:#fde68a;text-align:center;overflow:hidden;" title="3.0–4.0s: Settle on the main point">3.0\u20134.0s<br/><span style="font-size:6.8px;color:#94a3b8;">Settle</span></button>
          </div>
        </div>
      </div>`;

      // Mode Banner + Zoom Speed & Zoom Effects (Shake / Pulse / Boom) + Tap-Object Fly-Through Info
      const curZoomSpeed = s.zoomActionSpeed !== undefined ? s.zoomActionSpeed : 1.0;
      const curZoomPct = s.zoomPercent !== undefined ? s.zoomPercent : 100;
      const zShake = !!s.zoomFxShake;
      const zPulse = !!s.zoomFxPulse;
      const zBoom = !!s.zoomFxBoom;
      const zShakeAmt = s.zoomFxShakeIntensity !== undefined ? s.zoomFxShakeIntensity : 55;
      const zPulseAmt = s.zoomFxPulseIntensity !== undefined ? s.zoomFxPulseIntensity : 55;
      const zBoomAmt = s.zoomFxBoomIntensity !== undefined ? s.zoomFxBoomIntensity : 65;

      const zoomSpeedAndFxHtml = `<div style="background:rgba(9,13,22,0.92);border:1px solid rgba(56,189,248,0.32);border-radius:8px;padding:7px 9px;display:flex;flex-direction:column;gap:6px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <span style="font-size:9.5px;font-weight:800;color:#bae6fd;text-transform:uppercase;letter-spacing:0.04em;">Zoom In / Out &amp; Tap-Object Fly Speed</span>
          <span id="spatial-sidebar-zoom-pct" style="font-size:9.5px;font-weight:800;font-family:monospace;padding:1px 6px;border-radius:999px;background:rgba(56,189,248,0.18);color:#38bdf8;border:1px solid rgba(56,189,248,0.4);" title="Current Live Zoom Percentage">${curZoomPct}%</span>
        </div>
        ${row('s-zoom-speed', 'Zoom & Object Fly-Through Speed', 0.2, 3.0, 0.05, curZoomSpeed, v => Number(v).toFixed(2) + 'x')}
        <div style="display:flex;flex-direction:column;gap:4px;padding-top:2px;border-top:1px solid rgba(255,255,255,0.07);">
          <span style="font-size:9px;font-weight:700;color:#94a3b8;">Zoom &amp; Object Entry Effects (Shake / Pulse / Light-Speed Boom):</span>
          <div style="display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:4px;">
            <button type="button" data-act="s-toggle-zoomfx-shake" style="padding:5px 4px;font-size:9px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${zShake ? '#f59e0b' : 'rgba(255,255,255,0.12)'};background:${zShake ? 'rgba(245,158,11,0.24)' : 'rgba(255,255,255,0.04)'};color:${zShake ? '#fde68a' : '#94a3b8'};">\ud83d\udcf3 Shake ${zShake ? 'ON' : 'OFF'}</button>
            <button type="button" data-act="s-toggle-zoomfx-pulse" style="padding:5px 4px;font-size:9px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${zPulse ? '#ec4899' : 'rgba(255,255,255,0.12)'};background:${zPulse ? 'rgba(236,72,153,0.24)' : 'rgba(255,255,255,0.04)'};color:${zPulse ? '#fbcfe8' : '#94a3b8'};">\ud83d\udc93 Pulse ${zPulse ? 'ON' : 'OFF'}</button>
            <button type="button" data-act="s-toggle-zoomfx-boom" style="padding:5px 4px;font-size:9px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${zBoom ? '#38bdf8' : 'rgba(255,255,255,0.12)'};background:${zBoom ? 'linear-gradient(135deg, rgba(56,189,248,0.34), rgba(168,85,247,0.28))' : 'rgba(255,255,255,0.04)'};color:${zBoom ? '#e0f2fe' : '#94a3b8'};" title="Light-Speed Warp &amp; Boom when entering objects">\u26a1 Boom Warp ${zBoom ? 'ON' : 'OFF'}</button>
          </div>
          ${zShake ? row('s-zoomfx-shake-amt', 'Zoom Shake Intensity', 10, 100, 5, zShakeAmt, v => v + '%') : ''}
          ${zPulse ? row('s-zoomfx-pulse-amt', 'Zoom Pulse Beat Depth', 10, 100, 5, zPulseAmt, v => v + '%') : ''}
          ${zBoom ? row('s-zoomfx-boom-amt', 'Boom / Light-Speed Warp Power', 10, 100, 5, zBoomAmt, v => v + '%') : ''}
        </div>
        <div style="font-size:8.8px;color:#a7f3d0;background:rgba(16,185,129,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:6px;padding:4px 7px;line-height:1.3;">
          \ud83c\udfaf <b>Direct Object Fly-Through:</b> Tap/click any 3D object on stage (even the farthest one at the back) to fly straight through it at <b>${curZoomSpeed.toFixed(2)}x</b> speed!
        </div>
      </div>`;

      if (mode === '3d') {
        const curWalkMode = s.threeDWalkMode || 'free-walk';
        const spPt = s.customStartPoint || { x: 0, y: 20, z: 320, yaw: 0, pitch: 0 };
        const hasSp = !!s.hasCustomStartPoint;
        const customPresetsCount = Array.isArray(s.customRecordedPresets) ? s.customRecordedPresets.length : 0;
        html += `<div style="background:linear-gradient(135deg, rgba(16,185,129,0.18), rgba(15,23,42,0.96) 52%, rgba(56,189,248,0.18));border:1px solid rgba(52,211,153,0.5);border-radius:10px;padding:9px 10px;display:flex;flex-direction:column;gap:7px;box-shadow:0 6px 18px rgba(0,0,0,0.35);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:14px;">\ud83e\udded</span>
              <span style="font-size:10.5px;font-weight:800;color:#d1fae5;letter-spacing:0.04em;text-transform:uppercase;">3D Walk-Through: Set Start Point \u2192 Zoom In / Out</span>
            </div>
            <button type="button" data-act="s-reset-hand-cam" style="padding:2px 7px;font-size:9px;font-weight:700;border-radius:5px;border:1px solid rgba(56,189,248,0.45);background:rgba(56,189,248,0.15);color:#bae6fd;cursor:pointer;">Reset Position</button>
          </div>
          <div style="font-size:9.2px;color:#cbd5e1;line-height:1.38;">
            <b>Step 1:</b> Drag &amp; scroll on the 3D stage to move freely (or tap any object to fly straight through it).<br/>
            <b>Step 2:</b> Click <b>\ud83d\udccd Set Starting Point</b> at your chosen spot.<br/>
            <b>Step 3:</b> Click <b>+ Zoom In</b> or <b>\u2212 Zoom Out</b> (here or on top of the stage) \u2014 it flies from your starting point, and you can <b>Save as a Preset</b>!
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(9,13,22,0.85);border:1px solid rgba(56,189,248,0.28);border-radius:7px;padding:5px 8px;gap:6px;">
            <div style="display:flex;flex-direction:column;gap:1px;">
              <span style="font-size:8.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;">${hasSp ? '\u2713 Custom Starting Point Locked' : 'Current Starting Point (Default)'}</span>
              <span style="font-size:9.5px;font-weight:800;color:#7dd3fc;font-family:monospace;">X:${Math.round(spPt.x || 0)} \u2022 Y:${Math.round(spPt.y || 20)} \u2022 Z:${Math.round(spPt.z !== undefined ? spPt.z : 320)}</span>
            </div>
            <button type="button" data-act="s-3d-set-start" style="padding:5px 9px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid #34d399;background:linear-gradient(135deg, rgba(16,185,129,0.35), rgba(6,182,212,0.28));color:#ecfdf5;box-shadow:0 2px 8px rgba(16,185,129,0.25);">\ud83d\udccd Set Starting Point</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 0.9fr;gap:5px;">
            <button type="button" data-act="s-3d-zoom-in" style="padding:6px 7px;font-size:9.5px;font-weight:800;border-radius:7px;cursor:pointer;border:1px solid ${curWalkMode === 'auto-zoom-in' ? '#38bdf8' : 'rgba(56,189,248,0.45)'};background:${curWalkMode === 'auto-zoom-in' ? 'linear-gradient(135deg, rgba(56,189,248,0.42), rgba(14,165,233,0.32))' : 'rgba(56,189,248,0.14)'};color:#e0f2fe;display:flex;align-items:center;justify-content:center;gap:4px;">\uff0b Zoom In</button>
            <button type="button" data-act="s-3d-zoom-out" style="padding:6px 7px;font-size:9.5px;font-weight:800;border-radius:7px;cursor:pointer;border:1px solid ${curWalkMode === 'auto-zoom-out' ? '#c084fc' : 'rgba(192,132,252,0.45)'};background:${curWalkMode === 'auto-zoom-out' ? 'linear-gradient(135deg, rgba(168,85,247,0.42), rgba(139,92,246,0.32))' : 'rgba(168,85,247,0.14)'};color:#f3e8ff;display:flex;align-items:center;justify-content:center;gap:4px;">\u2212 Zoom Out</button>
            <button type="button" data-act="s-3d-free-walk" style="padding:6px 6px;font-size:9px;font-weight:800;border-radius:7px;cursor:pointer;border:1px solid ${curWalkMode === 'free-walk' ? '#34d399' : 'rgba(255,255,255,0.14)'};background:${curWalkMode === 'free-walk' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.05)'};color:${curWalkMode === 'free-walk' ? '#a7f3d0' : '#cbd5e1'};">\ud83d\udeb6 Free Walk (${curZoomPct}%)</button>
          </div>
          ${zoomSpeedAndFxHtml}
          <div style="background:rgba(9,13,22,0.88);border:1px solid rgba(168,85,247,0.32);border-radius:7px;padding:6px 8px;display:flex;flex-direction:column;gap:5px;">
            <span style="font-size:9px;font-weight:700;color:#e9d5ff;">Save Starting Point + ${s.lastStartZoomAction === 'out' ? 'Zoom Out' : 'Zoom In'} as Reusable Preset:</span>
            <input type="text" id="spatial-start-zoom-preset-name" placeholder="Preset name (e.g. Custom Start Zoom In)" value="Start Point ${s.lastStartZoomAction === 'out' ? 'Zoom Out' : 'Zoom In'} #${customPresetsCount + 1}" style="background:#141927;border:1px solid rgba(255,255,255,0.14);border-radius:5px;color:#f1f5f9;padding:4px 7px;font-size:10px;" />
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
              <button type="button" data-act="s-3d-save-start-preset" style="padding:5px 7px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(56,189,248,0.55);background:rgba(56,189,248,0.22);color:#e0f2fe;">\ud83d\udcbe Save as Preset</button>
              <button type="button" data-act="s-3d-save-start-default" style="padding:5px 7px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(251,191,36,0.6);background:rgba(251,191,36,0.22);color:#fef3c7;">\u2b50 Save &amp; Set Default</button>
            </div>
          </div>
        </div>`;
      } else {
        html += `<div style="background:linear-gradient(135deg, rgba(168,85,247,0.14), rgba(56,189,248,0.10));border:1px solid rgba(168,85,247,0.35);border-radius:8px;padding:7px 10px;display:flex;flex-direction:column;gap:7px;">
          <div style="display:flex;flex-direction:column;gap:1px;">
            <span style="font-size:10px;font-weight:800;color:#e9d5ff;letter-spacing:0.04em;">\u25b6 VIDEO MODE (PAUSE / PLAY &amp; TAP-TO-FLY SUPPORTED)</span>
            <span style="font-size:9px;color:#94a3b8;">Click Pause on the stage player to freeze the 3D scene, tap any 3D object on stage to fly straight through it, or use the top <b>+ / \u2212 / Free Walk</b> controls.</span>
          </div>
          ${zoomSpeedAndFxHtml}
        </div>`;
      }

      // =========================================================================
      // 1. STANDARDIZED SCENE LAYERS AT THE VERY TOP OF THE INSPECTOR BAR
      // =========================================================================
      html += `<div style="background:#0c0f1a;border:1px solid rgba(56,189,248,0.25);border-radius:10px;padding:9px 10px;display:flex;flex-direction:column;gap:7px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:10.5px;font-weight:800;color:#f8fafc;text-transform:uppercase;letter-spacing:0.6px;">Scene Layers (Z=0 BG \u2192 3D)</span>
            <span style="font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:999px;background:rgba(56,189,248,0.18);color:#38bdf8;border:1px solid rgba(56,189,248,0.35);">${layersList.length + 1}</span>
          </div>
          <div style="display:flex;gap:4px;">
            <button type="button" data-act="s-add-artifact" style="padding:3px 7px;font-size:9.5px;font-weight:700;border-radius:5px;border:1px solid rgba(56,189,248,.45);background:rgba(56,189,248,.14);color:#7dd3fc;cursor:pointer;">+ Card</button>
            <button type="button" data-act="s-add" style="padding:3px 7px;font-size:9.5px;font-weight:700;border-radius:5px;border:1px solid rgba(168,85,247,.45);background:rgba(168,85,247,.14);color:#d8b4fe;cursor:pointer;">+ Title</button>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${[
            ['all', 'All Layers'],
            ['bg', 'Z=0 BG'],
            ['media', 'Cards'],
            ['shapes', '3D Shapes'],
            ['text', 'Titles']
          ].map(([fk, fl]) => `<button type="button" data-act="s-layer-filter-${fk}" style="padding:2px 7px;font-size:9px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${spatialLayerFilter === fk ? 'rgba(56,189,248,0.6)' : 'rgba(255,255,255,0.08)'};background:${spatialLayerFilter === fk ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.03)'};color:${spatialLayerFilter === fk ? '#bae6fd' : '#94a3b8'};">${fl}</button>`).join('')}
        </div>
        <div id="tpl3d-layers" style="display:flex;flex-direction:column;gap:5px;max-height:310px;overflow-y:auto;padding-right:2px;"></div>
      </div>`;

      // =========================================================================
      // 2. INTERACTIVE 3D CAMERA & LOCAL VIDEO RECORDER + CAMERA MOVEMENT PRESETS
      // =========================================================================
      const defaultPresetId = s.defaultFlightPreset || 'establishing-shot';
      const customPresetsList = Array.isArray(s.customRecordedPresets) ? s.customRecordedPresets : [];
      const curRecBase = s.recordStartBase || curFlight || 'establishing-shot';
      const isRec = !!s.isRecording;
      const hasLastRec = !!(s.lastRecordedTrajectory && s.lastRecordedTrajectory.frames && s.lastRecordedTrajectory.frames.length >= 2);

      const recBaseOptions = [
        ['establishing-shot', '\ud83c\udfac Establishing Shot (4s Documentary Default)'],
        ['slow-dolly', '\ud83c\udfa5 Slow Dolly Push-In'],
        ['lateral-reveal', '\u2194 Lateral Parallax Reveal'],
        ['evidence-focus', '\ud83d\udd0d Evidence Dossier Focus'],
        ['hero-title', '\ud83c\udfc6 Hero Title Lock-On'],
        ['free-hand', '\u270b No Preset \u2014 100% Free-Hand Mouse Move'],
        ['museum-tour', '\ud83c\udfa5 Original Roaming Corridor Tour (1.5\u00d7 Slower)'],
        ['center-title-through', '\ud83c\udfaf Center Title + Side Gallery Zoom-Through'],
        ['back-to-front-back', '\u27fb Preset 1: Back \u2192 Front \u2192 Back (Zoom-Out Loop)'],
        ['front-to-back', '\u27fe Preset 2: Very Front \u2192 Very Back (Deep Dive)'],
        ['left-to-right-weave', '\u27f5 Preset 3: Left \u2192 Right Depth Weave'],
        ['right-to-left-weave', '\u27f6 Preset 4: Right \u2192 Left Depth Weave'],
        ['zoomthrough', '\u2197 Classic Zoom In'],
        ['pullback', '\u2199 Classic Zoom Out'],
        ['slalom', '\u3030 Slalom Weave'],
        ['orbit', '\u25ce 360\u00b0 Orbit'],
        ...customPresetsList.map(cp => [cp.id, `\ud83c\udfac ${cp.name}`])
      ];

      const recorderCardHtml = `<div style="background:linear-gradient(135deg, rgba(239,68,68,0.13), rgba(15,23,42,0.96) 55%, rgba(168,85,247,0.14));border:1px solid ${isRec ? '#ef4444' : 'rgba(248,113,113,0.42)'};border-radius:10px;padding:9px 10px;display:flex;flex-direction:column;gap:7px;box-shadow:${isRec ? '0 0 18px rgba(239,68,68,0.28)' : 'none'};">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="width:9px;height:9px;border-radius:50%;background:${isRec ? '#ef4444' : '#f87171'};box-shadow:0 0 8px ${isRec ? '#ef4444' : 'rgba(248,113,113,0.7)'};display:inline-block;"></span>
            <span style="font-size:10.5px;font-weight:800;color:#fee2e2;letter-spacing:0.04em;text-transform:uppercase;">Record Mouse Movement &amp; Local Video</span>
          </div>
          <span id="spatial-rec-live-timer" style="font-size:10px;font-weight:800;font-family:monospace;padding:2px 6px;border-radius:4px;background:${isRec ? 'rgba(239,68,68,0.28)' : 'rgba(255,255,255,0.06)'};color:${isRec ? '#fecaca' : '#94a3b8'};">${isRec ? (Number(s.recordElapsedSec || 0).toFixed(1) + 's \u25cf REC') : 'READY'}</span>
        </div>
        <div style="font-size:9px;color:#cbd5e1;line-height:1.35;">Choose a starting preset or <b>No Preset at all</b>, press <b>Record</b>, and move your mouse/scroll on the 3D stage to steer through the objects. Stopping automatically <b>saves the video locally on your device</b> and lets you save the motion as a <b>New Preset</b> or <b>Default Option</b>.</div>
        <label style="display:flex;flex-direction:column;gap:3px;font-size:9.5px;color:#fca5a5;font-weight:700;">Start Recording From:
          <select data-k="s-rec-base" style="${selectCss};border-color:rgba(248,113,113,0.35);">
            ${recBaseOptions.map(([val, label]) => `<option value="${esc(val)}" ${curRecBase === val ? 'selected' : ''}>${esc(label)}</option>`).join('')}
          </select>
        </label>
        <div style="display:grid;grid-template-columns:${hasLastRec || s.lastRecordedVideoUrl ? '1.35fr 1fr' : '1fr'};gap:5px;">
          ${!isRec
            ? `<button type="button" data-act="s-rec-start" style="padding:7px 10px;font-size:10.5px;font-weight:800;border-radius:7px;cursor:pointer;border:1px solid #f87171;background:linear-gradient(135deg, rgba(239,68,68,0.85), rgba(185,28,28,0.85));color:#ffffff;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 12px rgba(239,68,68,0.3);">\u25cf Record &amp; Move Through 3D</button>`
            : `<button type="button" data-act="s-rec-stop" style="padding:7px 10px;font-size:10.5px;font-weight:800;border-radius:7px;cursor:pointer;border:1px solid #fde047;background:linear-gradient(135deg, #dc2626, #991b1b);color:#fef08a;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 0 14px rgba(239,68,68,0.5);">\u25a0 Stop &amp; Save Video Locally</button>`
          }
          ${(hasLastRec || s.lastRecordedVideoUrl) ? `<button type="button" data-act="s-rec-download-video" style="padding:7px 8px;font-size:9.5px;font-weight:800;border-radius:7px;cursor:pointer;border:1px solid rgba(56,189,248,0.55);background:rgba(56,189,248,0.18);color:#bae6fd;display:flex;align-items:center;justify-content:center;gap:4px;" title="Download recorded video file locally to your device">\u2b07 Save Video File</button>` : ''}
        </div>
        ${hasLastRec ? `<div style="background:rgba(9,13,22,0.9);border:1px solid rgba(52,211,153,0.4);border-radius:7px;padding:7px 8px;display:flex;flex-direction:column;gap:5px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:9.5px;font-weight:800;color:#6ee7b7;">\u2713 Captured 3D Motion (${Number(s.lastRecordedTrajectory.durationSec || 0).toFixed(1)}s \u2022 ${s.lastRecordedTrajectory.frames.length} keyframes)</span>
            <button type="button" data-act="s-flight-preset-recorded-custom" style="padding:2px 7px;font-size:9px;font-weight:800;border-radius:4px;border:1px solid rgba(52,211,153,0.5);background:rgba(16,185,129,0.2);color:#a7f3d0;cursor:pointer;">\u25b6 Replay Path</button>
          </div>
          <input type="text" id="spatial-rec-preset-name" placeholder="Name your recorded preset (e.g. My Custom Fly-Through)" value="Custom Mouse Tour ${customPresetsList.length + 1}" style="background:#141927;border:1px solid rgba(255,255,255,0.14);border-radius:5px;color:#f1f5f9;padding:4px 7px;font-size:10px;" />
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
            <button type="button" data-act="s-rec-save-preset" style="padding:5px 7px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(168,85,247,0.55);background:rgba(168,85,247,0.22);color:#f3e8ff;">\ud83d\udcbe Save as New Preset</button>
            <button type="button" data-act="s-rec-save-default" style="padding:5px 7px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(251,191,36,0.6);background:rgba(251,191,36,0.22);color:#fef3c7;">\u2b50 Save &amp; Set Default</button>
          </div>
        </div>` : ''}
      </div>`;

      const builtInPresets = [
        {
          id: 'establishing-shot',
          badge: defaultPresetId === 'establishing-shot' ? 'DEFAULT (4S FLOW)' : 'CINEMATIC PRESET 1',
          title: '\ud83c\udfac Establishing Shot (4-Beat Documentary)',
          desc: '0\u20131s entry push \u2192 1\u20132s hero title reveal \u2192 2\u20133s lateral parallax drift \u2192 3\u20134s balanced end frame.'
        },
        {
          id: 'slow-dolly',
          badge: defaultPresetId === 'slow-dolly' ? 'DEFAULT OPTION' : 'CINEMATIC PRESET 2',
          title: '\ud83c\udfa5 Slow Dolly Push-In',
          desc: 'Restrained, linear optical dolly push along the Z-corridor with subtle breathing.'
        },
        {
          id: 'lateral-reveal',
          badge: defaultPresetId === 'lateral-reveal' ? 'DEFAULT OPTION' : 'CINEMATIC PRESET 3',
          title: '\u2194 Lateral Parallax Reveal',
          desc: 'Sweeps laterally across foreground silhouettes and midground evidence plates.'
        },
        {
          id: 'evidence-focus',
          badge: defaultPresetId === 'evidence-focus' ? 'DEFAULT OPTION' : 'CINEMATIC PRESET 4',
          title: '\ud83d\udd0d Evidence Dossier Focus',
          desc: 'Pauses on left archival memorandum, then glides to right financial index & 3D globe.'
        },
        {
          id: 'hero-title',
          badge: defaultPresetId === 'hero-title' ? 'DEFAULT OPTION' : 'CINEMATIC PRESET 5',
          title: '\ud83c\udfc6 Hero Title Lock-On',
          desc: 'Centers on AWAKENING / THE SYSTEM with dramatic volumetric light-ray parallax.'
        },
        {
          id: 'museum-tour',
          badge: defaultPresetId === 'museum-tour' ? 'DEFAULT (1.5\u00d7 SLOWER)' : 'ROAMING TOUR',
          title: '\ud83c\udfa5 Original Roaming Corridor Tour',
          desc: 'Original handheld corridor tour with exhibit detours, look-arounds & breathing (1.5\u00d7 slower).'
        },
        {
          id: 'center-title-through',
          badge: defaultPresetId === 'center-title-through' ? 'DEFAULT OPTION' : 'CENTER + SIDES',
          title: '\ud83c\udfaf Center Title + Side Gallery Zoom-Through',
          desc: 'Title sits dead-center (AWAKENING) with objects flanking on the sides \u2014 zooms straight into & through them.'
        },
        {
          id: 'free-hand',
          badge: defaultPresetId === 'free-hand' ? 'DEFAULT (FREE-HAND)' : 'NO PRESET (MANUAL)',
          title: '\u270b No Preset \u2014 Free-Hand Mouse Move',
          desc: 'No automatic path. Move freely through the 3D objects using mouse drag & scroll wheel.'
        },
        {
          id: 'back-to-front-back',
          badge: defaultPresetId === 'back-to-front-back' ? 'DEFAULT OPTION' : 'PRESET 1 (ZOOM-OUT LOOP)',
          title: '\u27fb Back \u2192 Front \u2192 Back (Zoom-Out Loop)',
          desc: 'Starts at very back (Z=-2650), glides to front (Z=+1050), and returns to back.'
        },
        {
          id: 'front-to-back',
          badge: defaultPresetId === 'front-to-back' ? 'DEFAULT OPTION' : 'PRESET 2 (REVERSE)',
          title: '\u27fe Very Front \u2192 Very Back (Deep Dive)',
          desc: 'Starts at very front (Z=+1100) and glides smoothly all the way to the back.'
        },
        {
          id: 'left-to-right-weave',
          badge: defaultPresetId === 'left-to-right-weave' ? 'DEFAULT OPTION' : 'PRESET 3 (L \u2192 R WEAVE)',
          title: '\u27f5 Left \u2192 Right (Behind & Front Depth Weave)',
          desc: 'Moves Left to Right, weaving behind one object and in front of another.'
        },
        {
          id: 'right-to-left-weave',
          badge: defaultPresetId === 'right-to-left-weave' ? 'DEFAULT OPTION' : 'PRESET 4 (R \u2192 L WEAVE)',
          title: '\u27f6 Right \u2192 Left (Behind & Front Depth Weave)',
          desc: 'Moves Right to Left, weaving in Z-depth behind & in front of cards.'
        },
        ...customPresetsList.map((cp, cIdx) => ({
          id: cp.id,
          isCustom: true,
          presetType: cp.presetType || 'recorded',
          direction: cp.direction || 'in',
          badge: defaultPresetId === cp.id ? '\u2b50 DEFAULT CUSTOM' : (cp.presetType === 'start-point-zoom' ? `START ZOOM ${(cp.direction || 'in').toUpperCase()}` : `CUSTOM PRESET #${cIdx + 1}`),
          title: `\ud83c\udfac ${cp.name}`,
          desc: cp.presetType === 'start-point-zoom'
            ? `Starts at X:${Math.round((cp.startPoint && cp.startPoint.x) || 0)}, Y:${Math.round((cp.startPoint && cp.startPoint.y) || 20)}, Z:${Math.round((cp.startPoint && cp.startPoint.z) || 320)} \u2192 Auto Zoom ${cp.direction === 'out' ? 'Out' : 'In'}.`
            : `Recorded mouse path (${Number(cp.durationSec || 6).toFixed(1)}s \u2022 base: ${cp.basePreset || 'free-hand'}).`
        }))
      ];

      const presetCardsHtml = builtInPresets.map(p => {
        const active = curFlight === p.id;
        const isDef = defaultPresetId === p.id;
        return `<div class="spatial-preset-card-item" data-preset-card-id="${esc(p.id)}" style="padding:7px 9px;border-radius:9px;border:1px solid ${active ? '#38bdf8' : isDef ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.09)'};background:${active ? 'linear-gradient(135deg, rgba(56,189,248,0.20), rgba(168,85,247,0.14))' : '#111522'};display:flex;align-items:center;gap:9px;transition:border-color 0.15s, transform 0.15s;">
          <div data-act="s-flight-preset-${esc(p.id)}" style="position:relative;width:96px;height:56px;border-radius:6px;overflow:hidden;border:1px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.16)'};background:#050811;flex-shrink:0;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.45);" title="Live 3D Camera Trajectory Preview \u2014 Hover to animate, click to apply">
            <canvas class="spatial-preset-thumb-canvas" data-preset-id="${esc(p.id)}" width="136" height="80" style="width:100%;height:100%;display:block;"></canvas>
            <span style="position:absolute;bottom:2px;right:3px;font-size:7.5px;font-weight:800;padding:1px 4px;border-radius:3px;background:rgba(4,7,15,0.82);color:${active ? '#38bdf8' : '#cbd5e1'};border:1px solid rgba(255,255,255,0.12);pointer-events:none;">3D PREVIEW</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
              <button type="button" data-act="s-flight-preset-${esc(p.id)}" style="background:transparent;border:none;padding:0;text-align:left;cursor:pointer;flex:1;min-width:0;display:flex;align-items:center;justify-content:space-between;gap:4px;">
                <span style="font-size:10px;font-weight:800;color:${active ? '#f0f9ff' : '#e2e8f0'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(p.title)}</span>
              </button>
              <div style="display:flex;align-items:center;gap:3px;flex-shrink:0;">
                <span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:4px;background:${isDef ? 'rgba(251,191,36,0.25)' : active ? 'rgba(56,189,248,0.28)' : 'rgba(255,255,255,0.06)'};color:${isDef ? '#fde68a' : active ? '#7dd3fc' : '#94a3b8'};">${esc(p.badge)}</span>
                ${!isDef ? `<button type="button" data-act="s-make-default-preset-${esc(p.id)}" title="Set as Default Option for this template" style="padding:1px 5px;font-size:8px;font-weight:700;border-radius:4px;border:1px solid rgba(251,191,36,0.35);background:rgba(251,191,36,0.1);color:#fde68a;cursor:pointer;">\u2605</button>` : ''}
                ${p.isCustom ? `<button type="button" data-act="s-del-custom-preset-${esc(p.id)}" title="Delete Custom Preset" style="padding:1px 5px;font-size:9px;border-radius:4px;border:none;background:rgba(239,68,68,0.2);color:#fca5a5;cursor:pointer;">\u00d7</button>` : ''}
              </div>
            </div>
            <div data-act="s-flight-preset-${esc(p.id)}" style="font-size:8.8px;color:#94a3b8;line-height:1.28;cursor:pointer;">${esc(p.desc)}</div>
          </div>
        </div>`;
      }).join('');

      const classicModesHtml = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;padding-top:2px;">
        ${[
          ['zoomthrough', '\u2197 Classic Zoom In'],
          ['pullback', '\u2199 Classic Zoom Out'],
          ['slalom', '\u3030 Slalom Weave'],
          ['orbit', '\u25ce 360\u00b0 Orbit']
        ].map(([mid, mlabel]) => `<button type="button" data-act="s-flight-preset-${mid}" style="padding:4px 6px;font-size:9px;font-weight:700;border-radius:7px;cursor:pointer;border:1px solid ${curFlight === mid ? '#38bdf8' : 'rgba(255,255,255,0.1)'};background:${curFlight === mid ? 'rgba(56,189,248,0.2)' : 'rgba(17,21,34,0.9)'};color:${curFlight === mid ? '#e0f2fe' : '#94a3b8'};display:flex;align-items:center;gap:6px;text-align:left;">
          <canvas class="spatial-preset-thumb-canvas" data-preset-id="${mid}" width="64" height="38" style="width:46px;height:28px;border-radius:4px;border:1px solid rgba(255,255,255,0.14);background:#050811;flex-shrink:0;"></canvas>
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${mlabel}</span>
        </button>`).join('')}
      </div>`;

      const stopChipsHtml = layersList.map((m, idx) => {
        const u = m.userData || {};
        const isStopped = !!u.stopHere;
        const name = (u.title || (u.type === 'text' ? 'Title' : 'Card')).slice(0, 16);
        return `<button type="button" data-act="l-stop-${idx}" style="padding:3px 7px;font-size:9.5px;font-weight:700;border-radius:6px;cursor:pointer;border:1px solid ${isStopped ? '#fbbf24' : 'rgba(255,255,255,0.1)'};background:${isStopped ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.04)'};color:${isStopped ? '#fde68a' : '#94a3b8'};" title="Toggle camera stop on this object">${isStopped ? '\ud83d\udccd ' : ''}Z=${idx + 1}: ${esc(name)}</button>`;
      }).join('');

      html += section('Camera Movement Presets, Recorder & Object Stops', [
        recorderCardHtml,
        `<div style="display:flex;flex-direction:column;gap:5px;">${presetCardsHtml}</div>`,
        classicModesHtml,
        `<div style="background:#0e121e;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 9px;display:flex;flex-direction:column;gap:6px;margin-top:2px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:10px;font-weight:700;color:#cbd5e1;">Object Stopping Behavior (Optional)</span>
            <span style="font-size:9px;color:#38bdf8;">${curStopMode === 'none' ? (curFlight === 'museum-tour' ? 'Auto Tour Stops' : 'Continuous Glide') : curStopMode === 'random-single' ? '1 Random Object' : 'User-Selected'}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">
            <button type="button" data-act="s-stopmode-none" style="padding:5px 4px;font-size:9.5px;font-weight:700;border-radius:6px;cursor:pointer;border:1px solid ${curStopMode === 'none' ? '#38bdf8' : 'rgba(255,255,255,0.1)'};background:${curStopMode === 'none' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'};color:${curStopMode === 'none' ? '#e0f2fe' : '#94a3b8'};">Preset Default</button>
            <button type="button" data-act="s-stopmode-selected" style="padding:5px 4px;font-size:9.5px;font-weight:700;border-radius:6px;cursor:pointer;border:1px solid ${curStopMode === 'user-selected' ? '#fbbf24' : 'rgba(255,255,255,0.1)'};background:${curStopMode === 'user-selected' ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.04)'};color:${curStopMode === 'user-selected' ? '#fef3c7' : '#94a3b8'};">\ud83d\udccd Pick Stops</button>
            <button type="button" data-act="s-stopmode-random" style="padding:5px 4px;font-size:9.5px;font-weight:700;border-radius:6px;cursor:pointer;border:1px solid ${curStopMode === 'random-single' ? '#c084fc' : 'rgba(255,255,255,0.1)'};background:${curStopMode === 'random-single' ? 'rgba(168,85,247,0.22)' : 'rgba(255,255,255,0.04)'};color:${curStopMode === 'random-single' ? '#f3e8ff' : '#94a3b8'};">\ud83c\udfb2 Random Stop</button>
          </div>
          ${curStopMode === 'user-selected' ? `<div style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:9px;color:#94a3b8;">Click objects where the camera should pause &amp; inspect before moving to the next:</span>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">${stopChipsHtml}</div>
          </div>` : ''}
          ${curStopMode === 'random-single' ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <span style="font-size:9px;color:#cbd5e1;">Camera pauses on 1 randomly chosen object per pass.</span>
            <button type="button" data-act="s-reroll-random-stop" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:5px;border:1px solid rgba(192,132,252,0.5);background:rgba(168,85,247,0.2);color:#e9d5ff;cursor:pointer;">\ud83c\udfb2 Pick Another</button>
          </div>` : ''}
        </div>`
      ].join(''));

      // =========================================================================
      // 3. GRANULAR SLOW-MOTION & NEGATIVE SPEED RAMP ("SLOWS, SLOWS -> BOOM!")
      // =========================================================================
      const curSpeed = s.camSpeed !== undefined ? s.camSpeed : 1.0;
      const curDip = s.slowMoDipSpeed !== undefined ? s.slowMoDipSpeed : -0.35;
      const curSpan = Math.round((s.slowMoDecelSpan !== undefined ? s.slowMoDecelSpan : 0.18) * 100);
      const curBoom = s.slowMoBoomBurst !== undefined ? s.slowMoBoomBurst : 1.85;
      const curTrig = Math.round((s.slowMoTriggerT !== undefined ? s.slowMoTriggerT : 0.45) * 100);

      html += section('Speed, Negative Motion & Slow-Mo Ramp', [
        row('s-speed', 'Base Camera Speed (Negative = Reverse)', -2.5, 2.5, 0.05, curSpeed, v => (v >= 0 ? '+' : '') + Number(v).toFixed(2) + 'x'),
        `<div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${[
            [-1.0, '-1.0x Rev'],
            [-0.4, '-0.4x Slow Rev'],
            [0.5, '0.5x Slow'],
            [1.0, '1.0x Default (1.5\u00d7 Slower)'],
            [1.5, '1.5x Fast']
          ].map(([sv, sl]) => `<button type="button" data-act="s-set-speed-${sv}" style="padding:3px 6px;font-size:9px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ${Math.abs(curSpeed - sv) < 0.03 ? '#38bdf8' : 'rgba(255,255,255,0.1)'};background:${Math.abs(curSpeed - sv) < 0.03 ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'};color:${Math.abs(curSpeed - sv) < 0.03 ? '#bae6fd' : '#94a3b8'};">${sl}</button>`).join('')}
        </div>`,
        `<div style="background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.55));border:1px solid ${s.slowMoRampEnabled ? 'rgba(192,132,252,0.5)' : 'rgba(255,255,255,0.08)'};border-radius:8px;padding:8px 9px;display:flex;flex-direction:column;gap:6px;margin-top:2px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;flex-direction:column;">
              <span style="font-size:10px;font-weight:800;color:#f3e8ff;">"Slows, Slows... &amp; BOOM!" Speed Ramp</span>
              <span style="font-size:8.5px;color:#94a3b8;">Decelerates into negative/slow-mo, then bursts forward</span>
            </div>
            <button type="button" data-act="s-toggle-slowmo-ramp" style="padding:3px 9px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${s.slowMoRampEnabled ? '#34d399' : 'rgba(255,255,255,0.15)'};background:${s.slowMoRampEnabled ? 'rgba(16,185,129,0.22)' : 'rgba(255,255,255,0.05)'};color:${s.slowMoRampEnabled ? '#6ee7b7' : '#94a3b8'};">${s.slowMoRampEnabled ? '\u2713 Active' : 'Off'}</button>
          </div>
          ${s.slowMoRampEnabled ? `
            <label style="display:flex;flex-direction:column;gap:3px;font-size:9.5px;color:#94a3b8;">Slow-Mo Envelope Preset
              <select data-k="s-slowmo-preset" style="${selectCss}">
                <option value="slow-slow-boom" ${(s.slowMoCurvePreset || 'slow-slow-boom') === 'slow-slow-boom' ? 'selected' : ''}>Slows, Slows... Negative Dip \u2192 BOOM! (Default)</option>
                <option value="elastic-recoil" ${s.slowMoCurvePreset === 'elastic-recoil' ? 'selected' : ''}>Elastic Reverse Recoil Slingshot</option>
                <option value="heartbeat-pulse" ${s.slowMoCurvePreset === 'heartbeat-pulse' ? 'selected' : ''}>Double Slow-Mo Heartbeat Pulse</option>
              </select>
            </label>
            ${row('s-slowmo-dip', 'Slow-Mo / Negative Dip Speed', -1.2, 0.4, 0.05, curDip, v => (v >= 0 ? '+' : '') + Number(v).toFixed(2) + 'x')}
            ${row('s-slowmo-span', '"Slows, Slows..." Decel Duration', 6, 40, 1, curSpan, v => v + '% of timeline')}
            ${row('s-slowmo-boom', '"...and BOOM!" Launch Burst', 1.0, 3.5, 0.05, curBoom, v => Number(v).toFixed(2) + 'x burst')}
            ${row('s-slowmo-trig', 'Ramp Trigger Point on Timeline', 10, 88, 1, curTrig, v => 'at ' + v + '%')}
            <button type="button" data-act="s-test-slowmo-boom" style="padding:5px 8px;font-size:10px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(192,132,252,0.55);background:linear-gradient(135deg, rgba(168,85,247,0.28), rgba(56,189,248,0.22));color:#f3e8ff;">\u26a1 Test "Slows, Slows \u2192 BOOM!" Right Now</button>
          ` : ''}
        </div>`,
        row('s-shake', 'Handheld Camera Shake (Default 12%)', 0, 60, 1, s.camShake !== undefined ? s.camShake : 12, v => v + '%'),
        row('s-drift', 'Subtle Floating Parallax Drift', 0, 50, 1, s.camDrift !== undefined ? s.camDrift : 22, v => v + '%'),
        row('s-fov', 'Lens FOV', 32, 85, 1, s.fovWarp || 52, v => v + '\u00b0'),
        row('s-pitch', 'Camera Tilt Pitch (X)', -45, 45, 1, Math.round(s.camPitch || 0), v => v + '\u00b0'),
        row('s-yaw', 'Camera Rotation Yaw (Y)', -65, 65, 1, Math.round(s.camYaw || 0), v => v + '\u00b0')
      ].join(''));

      // =========================================================================
      // 4. CARD CONTOURS, COLORS & SHAPE PRESETS (ORIGINAL GOLD DEFAULT, USER EDITABLE)
      // =========================================================================
      const contourShapes = [
        ['rounded-rect', '\u25ad Rounded Slate'],
        ['sharp-rect', '\u25a1 Sharp Frame'],
        ['chamfer-octagon', '\u2b23 Chamfer Octagon'],
        ['arch-frame', '\u2312 Arch Vault'],
        ['hexagon-prism', '\u2b21 Hexagon Prism'],
        ['diamond-rhombus', '\u25c7 Diamond'],
        ['circle-portal', '\u25ef Circle Portal'],
        ['capsule-pill', '\u2b2d Capsule']
      ];
      const contourSwatches = [
        ['#f59e0b', 'Amber Gold (Default)'],
        ['#38bdf8', 'Cyan'],
        ['#a855f7', 'Violet'],
        ['#10b981', 'Emerald'],
        ['#f43f5e', 'Crimson'],
        ['#ffffff', 'White'],
        ['#94a3b8', 'Silver']
      ];

      html += section('Card Contours, Colors & Shape Presets', [
        `<div style="background:#0d111c;border:1px solid rgba(56,189,248,0.22);border-radius:8px;padding:8px 9px;display:flex;flex-direction:column;gap:7px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:10px;font-weight:700;color:#e2e8f0;">Card Contour Border Color</span>
            <div style="display:flex;align-items:center;gap:5px;">
              ${contourSwatches.map(([hex, label]) => `<button type="button" data-act="s-contour-swatch-${hex}" title="${label}" style="width:16px;height:16px;border-radius:50%;background:${hex};border:2px solid ${curContourColor.toLowerCase() === hex.toLowerCase() ? '#fff' : 'rgba(255,255,255,0.2)'};cursor:pointer;padding:0;"></button>`).join('')}
              <input type="color" data-k="s-contour-color" value="${/^#[0-9a-f]{6}$/i.test(curContourColor) ? curContourColor : '#f59e0b'}" style="border:none;width:24px;height:20px;border-radius:4px;cursor:pointer;background:transparent;" title="Custom Contour Color" />
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:10px;font-weight:700;color:#94a3b8;">Card Contour Shape Preset</span>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
              ${contourShapes.map(([sk, sl]) => `<button type="button" data-act="s-contour-shape-${sk}" style="padding:4px 6px;font-size:9.5px;font-weight:700;border-radius:6px;text-align:left;cursor:pointer;border:1px solid ${curContourShape === sk ? '#38bdf8' : 'rgba(255,255,255,0.08)'};background:${curContourShape === sk ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.03)'};color:${curContourShape === sk ? '#e0f2fe' : '#cbd5e1'};">${sl}</button>`).join('')}
            </div>
          </div>
          ${row('s-contour-width', 'Contour Line Thickness', 0, 10, 0.5, s.cardContourWidth !== undefined ? s.cardContourWidth : 3, v => v + 'px')}
          ${row('s-contour-glow', 'Contour Neon / Edge Glow', 0, 50, 1, s.cardContourGlow !== undefined ? s.cardContourGlow : 18, v => v + 'px')}
        </div>`
      ].join(''));

      // =========================================================================
      // 5. EXTENDED AUDIO MANAGER UI PANEL (CINEMATIC SFX PRESETS + VOLUME/FADE SLIDERS)
      // =========================================================================
      const builtinSfx = (typeof SPATIAL_BUILTIN_SFX !== 'undefined' && Array.isArray(SPATIAL_BUILTIN_SFX)) ? SPATIAL_BUILTIN_SFX : [
        { id: 'whoosh', name: 'Whoosh', icon: '🌪️', desc: 'Cinematic stereo rush whoosh transition' },
        { id: 'riser', name: 'Riser', icon: '📈', desc: 'Suspenseful harmonic pitch-sweep riser' },
        { id: 'impact', name: 'Impact', icon: '⚡', desc: 'Heavy cinematic trailer hit & sub transient' },
        { id: 'paper-rustle', name: 'Paper Rustle', icon: '📄', desc: 'Crisp archival dossier page turn' },
        { id: 'marker-squeak', name: 'Marker Squeak', icon: '🖊️', desc: 'Felt-tip highlighter stroke squeak' },
        { id: 'camera-shutter', name: 'Camera Shutter', icon: '📸', desc: 'Mechanical SLR investigative snap' },
        { id: 'cinematic-whoosh', name: 'Air Whoosh', icon: '💨', desc: 'Deep 3D parallax fly-by whoosh' },
        { id: 'sub-bass-boom', name: 'Slow-Mo Boom', icon: '💥', desc: 'Sub-bass impact when speed resumes' },
        { id: 'tape-slow-down', name: 'Time-Warp', icon: '⏳', desc: 'Pitch-drop deceleration warble' }
      ];
      const customClips = Array.isArray(s.customAudioClips) ? s.customAudioClips : [];
      const allSfxOptions = [
        { id: 'none', name: '🔇 None (Silent)' },
        ...builtinSfx.map(x => ({ id: x.id, name: `${x.icon} ${x.name}` })),
        ...customClips.map(x => ({ id: x.id, name: `🎵 ${x.name}` }))
      ];
      const evMap = Object.assign({
        onSceneStart: 'none',
        onFlyByTransition: 'none',
        onObjectStop: 'none',
        onSlowMoDip: 'none',
        onSlowMoBoom: 'none',
        onTextReveal: 'none'
      }, s.audioEvents || {});
      const evSettingsMap = Object.assign({
        onSceneStart: { volume: 0.85, fade: 0.25 },
        onFlyByTransition: { volume: 0.80, fade: 0.20 },
        onObjectStop: { volume: 0.90, fade: 0.10 },
        onSlowMoDip: { volume: 0.85, fade: 0.35 },
        onSlowMoBoom: { volume: 1.00, fade: 0.20 },
        onTextReveal: { volume: 0.75, fade: 0.15 }
      }, s.audioEventSettings || {});

      const sfxLibraryCards = [
        ...builtinSfx.map(item => `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 7px;background:#131826;border:1px solid ${['whoosh', 'riser', 'impact'].includes(item.id) ? 'rgba(56,189,248,0.32)' : 'rgba(255,255,255,0.07)'};border-radius:6px;gap:5px;">
          <div style="display:flex;align-items:center;gap:5px;overflow:hidden;">
            <span style="font-size:12px;">${item.icon}</span>
            <span style="font-size:9.5px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(item.name)}</span>
          </div>
          <button type="button" data-act="s-sfx-preview-${item.id}" style="padding:2px 7px;font-size:9px;font-weight:800;border-radius:4px;border:1px solid rgba(56,189,248,0.45);background:rgba(56,189,248,0.16);color:#7dd3fc;cursor:pointer;flex-shrink:0;" title="Preview ${esc(item.name)}">\u25b6 Play</button>
        </div>`),
        ...customClips.map(clip => `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 7px;background: rgba(168,85,247,0.12);border:1px solid rgba(192,132,252,0.35);border-radius:6px;gap:4px;">
          <div style="display:flex;align-items:center;gap:5px;overflow:hidden;">
            <span style="font-size:11px;">🎵</span>
            <span style="font-size:9.5px;font-weight:700;color:#f3e8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(clip.name)}</span>
          </div>
          <div style="display:flex;gap:3px;flex-shrink:0;">
            <button type="button" data-act="s-sfx-preview-${clip.id}" style="padding:2px 6px;font-size:9px;font-weight:800;border-radius:4px;border:1px solid rgba(192,132,252,0.5);background:rgba(168,85,247,0.25);color:#f3e8ff;cursor:pointer;">\u25b6</button>
            <button type="button" data-act="s-sfx-del-${clip.id}" style="padding:2px 5px;font-size:9px;border-radius:4px;border:none;background:rgba(239,68,68,0.2);color:#fca5a5;cursor:pointer;" title="Remove custom SFX">\u00d7</button>
          </div>
        </div>`)
      ].join('');

      const eventAssignRows = [
        ['onSceneStart', 'Scene Start / Launch'],
        ['onFlyByTransition', 'Card Fly-By / Pass Transition'],
        ['onObjectStop', 'Camera Object Stop / Focus'],
        ['onSlowMoDip', '"Slows, Slows..." Decel Dip'],
        ['onSlowMoBoom', '"...and BOOM!" Speed Burst'],
        ['onTextReveal', 'Title / Marker Highlight Reveal']
      ].map(([evKey, evLabel]) => {
        const curVal = evMap[evKey] || 'none';
        const cfg = evSettingsMap[evKey] || { volume: 0.85, fade: 0.25 };
        const volPct = Math.round((cfg.volume !== undefined ? cfg.volume : 0.85) * 100);
        const fadePct = Math.round((cfg.fade !== undefined ? cfg.fade : 0.25) * 100);
        return `<div style="background:#111624;border:1px solid rgba(255,255,255,0.07);border-radius:7px;padding:6px 7px;display:flex;flex-direction:column;gap:5px;">
          <div style="display:grid;grid-template-columns:1.05fr 1.25fr auto;align-items:center;gap:5px;">
            <span style="font-size:9.5px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${evLabel}</span>
            <select data-k="s-audio-ev-${evKey}" style="${selectCss};padding:3px 5px;font-size:9.5px;">
              ${allSfxOptions.map(opt => `<option value="${opt.id}" ${curVal === opt.id ? 'selected' : ''}>${esc(opt.name)}</option>`).join('')}
            </select>
            <button type="button" data-act="s-sfx-evpreview-${evKey}" style="padding:3px 6px;font-size:9px;font-weight:700;border-radius:5px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.14);color:#7dd3fc;cursor:pointer;" title="Preview with Volume &amp; Fade">\u25b6</button>
          </div>
          ${curVal !== 'none' ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:2px;">
            <div style="display:flex;flex-direction:column;gap:1px;">
              <div style="display:flex;justify-content:space-between;font-size:8.5px;color:#94a3b8;"><span>Volume</span><span data-val-for="s-audio-evvol-${evKey}" style="color:#38bdf8;font-family:monospace;">${volPct}%</span></div>
              <input type="range" data-k="s-audio-evvol-${evKey}" min="0" max="150" step="1" value="${volPct}" style="width:100%;accent-color:#38bdf8;height:3px;cursor:pointer;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:1px;">
              <div style="display:flex;justify-content:space-between;font-size:8.5px;color:#94a3b8;"><span>Fade In/Out</span><span data-val-for="s-audio-evfade-${evKey}" style="color:#c084fc;font-family:monospace;">${fadePct}%</span></div>
              <input type="range" data-k="s-audio-evfade-${evKey}" min="0" max="100" step="1" value="${fadePct}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
            </div>
          </div>` : ''}
        </div>`;
      }).join('');

      html += section('Audio Manager & Timeline Transition SFX', [
        `<div style="background:#0c101d;border:1px solid rgba(168,85,247,0.28);border-radius:9px;padding:8px 9px;display:flex;flex-direction:column;gap:7px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <button type="button" data-act="s-audio-toggle" style="padding:4px 8px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid ${s.audioEnabled !== false ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.4)'};background:${s.audioEnabled !== false ? 'rgba(16,185,129,0.16)' : 'rgba(239,68,68,0.14)'};color:${s.audioEnabled !== false ? '#6ee7b7' : '#fca5a5'};">${s.audioEnabled !== false ? '\ud83d\udd0a SFX Enabled' : '\ud83d\udd07 SFX Muted'}</button>
            <input type="file" id="spatial-custom-sfx-input" accept="audio/*" multiple style="display:none;" />
            <button type="button" data-act="s-audio-upload" style="padding:4px 9px;font-size:9.5px;font-weight:800;border-radius:6px;cursor:pointer;border:1px solid rgba(56,189,248,0.5);background:rgba(56,189,248,0.15);color:#7dd3fc;">\ud83d\udcc1 + Upload Custom SFX</button>
          </div>
          ${row('s-audio-vol', 'Master SFX Volume', 0, 100, 1, Math.round((s.audioVolume !== undefined ? s.audioVolume : 0.75) * 100), v => v + '%')}
          <div style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:9.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Cinematic &amp; Investigative SFX Preset Library (\u25b6 Preview)</span>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">${sfxLibraryCards}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;border-top:1px solid rgba(255,255,255,0.07);padding-top:6px;">
            <span style="font-size:9.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Assigned SFX + Volume / Fade Envelopes</span>
            ${eventAssignRows}
          </div>
        </div>`
      ].join(''));

      // =========================================================================
      // 6. TYPOGRAPHY & ENVIRONMENT ARCHITECTURE
      // =========================================================================
      const textSectionHeader = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:10.5px;font-weight:700;color:#e2e8f0;">3D Headline Typography</span>
        <button type="button" data-act="s-toggle-text" style="padding:3px 8px;font-size:9.5px;font-weight:700;border-radius:6px;border:1px solid ${s.showText !== false ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'};background:${s.showText !== false ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};color:${s.showText !== false ? '#6ee7b7' : '#fca5a5'};cursor:pointer;">${s.showText !== false ? '\u2713 Text Visible' : '\u2298 Hidden'}</button>
      </div>`;

      const textControls = [
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Headline Font Family
          <select data-k="s-text-font" style="${selectCss}">${[
            'Cinzel:Cinzel (Imperial Serif)',
            'Playfair Display:Playfair Display (Editorial)',
            'JetBrains Mono:JetBrains Mono (Technical Dossier)',
            'Inter:Inter (Clean Ultra-Modern)',
            'Impact:Impact (Punchy Title)'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.textFont || 'Cinzel') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Typography Shader Style
          <select data-k="s-text-style" style="${selectCss}">${[
            'gold:Imperial 24K Gold Foil (Default)',
            'white:Pure Titanium White',
            'cyan:Quantum Neon Cyan',
            'chrome:Platinum Mirror Chrome',
            'emerald:Syndicate Emerald Green',
            'crimson:Dark Power Blood Crimson',
            'custom:Custom Two-Tone Gradient'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.textStyle || 'gold') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        s.textStyle === 'custom' ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px 0;">
          <label style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#94a3b8;">Color 1 <input type="color" data-k="s-text-c1" value="${s.textPrimaryColor || '#f59e0b'}" style="border:none;width:28px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
          <label style="display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#94a3b8;">Color 2 <input type="color" data-k="s-text-c2" value="${s.textSecondaryColor || '#fde68a'}" style="border:none;width:28px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
        </div>` : '',
        s.showText !== false ? textHtml : ''
      ].join('');

      html += section('Typography & Environment', [
        textSectionHeader + textControls,
        `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;margin-top:4px;">Tunnel Architectural Style
          <select data-k="s-env" style="${selectCss}">${[
            'tunnel-cyan:Cyber Grid Tunnel (Cyan)',
            'tunnel-slate:Slate Architectural Tunnel',
            'open-stars:Floor Grid & Cosmic Starfield',
            'deep-cosmos:Deep Cosmos Void (Pure Stars)',
            'tunnel-gold:Amber Documentary Tunnel'
          ].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${(s.envStyle || 'tunnel-cyan') === v ? 'selected' : ''}>${n}</option>`; }).join('')}</select>
        </label>`,
        `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;">
          <label style="display:flex;align-items:center;gap:8px;font-size:10px;color:#94a3b8;">Grid Color <input type="color" data-k="s-gridcolor" value="${s.gridColor || '#06b6d4'}" style="border:none;width:28px;height:22px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
          <div style="display:flex;gap:4px;">${btn('s-grid', '\u229e Grid', s.gridVisible)}${btn('s-dust', '\u2726 Stars', s.dustVisible)}</div>
        </div>`,
        `<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:2px;">${[
          'documentary:Documentary (Default)',
          'tech-investigative:Tech / Investigative',
          'cyberpunk:Cyberpunk',
          'forbes-hallway:Forbes Tour',
          'awakening-gallery:Awakening Gallery',
          'docu-essay:Docu-Essay',
          'cyber-matrix:Cyber Matrix',
          'philosophy:Philosophy',
          'cosmic-universe:Cosmic Stars'
        ].map(o => { const [v, n] = o.split(':'); return btn('preset-' + v, n, s.activePreset === v); }).join('')}</div>`
      ].join(''));
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
    if (k === 'spatial') {
      renderSpatialLayers();
      initSpatialPresetThumbnails();
    }
  }
  window.rebuild3DInspector = function () {
    if (curTpl) {
      lastKey = '';
      build(curTpl);
    }
  };

  function renderSpatialLayers() {
    const box = document.getElementById('tpl3d-layers'); if (!box) return;
    const s = spatial3DState;
    const list = s.elements3D || [];
    const builtinSfx = (typeof SPATIAL_BUILTIN_SFX !== 'undefined' && Array.isArray(SPATIAL_BUILTIN_SFX)) ? SPATIAL_BUILTIN_SFX : [
      { id: 'whoosh', name: 'Whoosh', icon: '🌪️' },
      { id: 'riser', name: 'Riser', icon: '📈' },
      { id: 'impact', name: 'Impact', icon: '⚡' },
      { id: 'paper-rustle', name: 'Paper Rustle', icon: '📄' },
      { id: 'marker-squeak', name: 'Marker Squeak', icon: '🖊️' },
      { id: 'camera-shutter', name: 'Camera Shutter', icon: '📸' },
      { id: 'cinematic-whoosh', name: 'Air Whoosh', icon: '💨' },
      { id: 'sub-bass-boom', name: 'Slow-Mo Boom', icon: '💥' },
      { id: 'tape-slow-down', name: 'Time-Warp', icon: '⏳' }
    ];
    const customClips = Array.isArray(s.customAudioClips) ? s.customAudioClips : [];
    const sfxOptions = [
      { id: 'none', name: '🔇 No SFX' },
      ...builtinSfx.map(x => ({ id: x.id, name: `${x.icon} ${x.name}` })),
      ...customClips.map(x => ({ id: x.id, name: `🎵 ${x.name}` }))
    ];

    const rowsHtml = [];

    // Z=0 Background Environment Layer Row (Standardized across templates)
    if (spatialLayerFilter === 'all' || spatialLayerFilter === 'bg') {
      const bgOpen = openLayerIdx === -2;
      const bgEditor = !bgOpen ? '' : `<div style="display:flex;flex-direction:column;gap:6px;padding:7px 2px 2px;border-top:1px solid rgba(255,255,255,0.06);margin-top:5px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <label style="display:flex;align-items:center;gap:6px;font-size:10px;color:#94a3b8;">Backdrop Color <input type="color" data-k="s-bgcolor" value="${s.bgColor || '#04060a'}" style="border:none;width:26px;height:20px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
          <label style="display:flex;align-items:center;gap:6px;font-size:10px;color:#94a3b8;">Grid Color <input type="color" data-k="s-gridcolor" value="${s.gridColor || '#06b6d4'}" style="border:none;width:26px;height:20px;border-radius:4px;cursor:pointer;background:transparent;" /></label>
        </div>
        ${row('s-fog', 'Atmospheric Fog Density', 0, 100, 1, s.fogDensity !== undefined ? s.fogDensity : 32, v => v + '%')}
        ${row('s-grid-speed', 'Grid Stream Speed', 0, 3, 0.1, s.gridSpeed !== undefined ? s.gridSpeed : 0.8, v => Number(v).toFixed(1) + 'x')}
      </div>`;

      rowsHtml.push(`<div style="background:#101422;border:1px solid ${bgOpen ? 'rgba(56,189,248,.55)' : 'rgba(255,255,255,.08)'};border-radius:8px;padding:6px 8px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <div data-act="l-toggle-bg" style="display:flex;align-items:center;gap:6px;cursor:pointer;overflow:hidden;flex:1;">
            <span style="font-size:9px;font-weight:800;padding:2px 5px;border-radius:4px;background:rgba(6,182,212,0.18);color:#22d3ee;border:1px solid rgba(6,182,212,0.35);font-family:monospace;">Z=0</span>
            <span style="width:18px;height:18px;border-radius:4px;background:radial-gradient(circle,#06b6d4 10%,#04060a 90%);border:1px solid rgba(255,255,255,0.18);flex-shrink:0;"></span>
            <span style="font-size:10.5px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">3D Corridor Environment</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <button type="button" data-act="s-grid" style="background:${s.gridVisible !== false ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.05)'};border:1px solid ${s.gridVisible !== false ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'};color:${s.gridVisible !== false ? '#6ee7b7' : '#64748b'};font-size:9px;font-weight:700;border-radius:4px;cursor:pointer;padding:2px 5px;" title="Toggle 3D Grid">${s.gridVisible !== false ? 'Grid ON' : 'Grid OFF'}</button>
          </div>
        </div>
        ${bgEditor}
      </div>`);
    }

    list.forEach((m, i) => {
      const u = m.userData || {};
      const curMode = u.artifactMode || (u.type === 'object' ? 'object' : (u.type === 'card' ? 'card' : (u.type === 'text' ? 'text' : 'image')));
      if (spatialLayerFilter === 'media' && (u.type === 'text' || curMode === 'object')) return;
      if (spatialLayerFilter === 'shapes' && curMode !== 'object' && u.type !== 'shape') return;
      if (spatialLayerFilter === 'text' && u.type !== 'text') return;
      if (spatialLayerFilter === 'bg') return;

      const open = openLayerIdx === i;
      const contourCol = u.contourColor || u.color || s.cardContourColor || '#f59e0b';
      const contourShape = u.contourShape || s.cardContourShape || 'rounded-rect';
      const curShape = u.objectShape || u.objectGeometry || 'icosahedron';
      const curTrans = u.transitionEffect || 'fade';
      const curFont = u.fontFamily || 'Cinzel';
      const curSfx = u.sfxId || 'none';
      const curSfxVol = Math.round((u.sfxVol !== undefined ? u.sfxVol : 0.85) * 100);
      const curSfxFade = Math.round((u.sfxFade !== undefined ? u.sfxFade : 0.25) * 100);
      const isStopHere = !!u.stopHere;
      const isVis = u.visible !== false && m.visible !== false;
      const posXVal = Math.round(u.baseX !== undefined ? u.baseX : m.position.x);
      const posYVal = Math.round(u.baseY !== undefined ? u.baseY : m.position.y);
      const posZVal = Math.round(u.initialZ !== undefined ? u.initialZ : m.position.z);

      const thumbBadge = u.imageUrl
        ? `<img src="${esc(u.imageUrl)}" alt="" style="width:20px;height:20px;border-radius:4px;object-fit:cover;border:1.5px solid ${contourCol};flex-shrink:0;" />`
        : `<span style="width:20px;height:20px;border-radius:4px;background:rgba(15,23,42,0.9);border:1.5px solid ${contourCol};display:inline-flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">${u.type === 'text' ? 'T' : curMode === 'object' ? '⬡' : '🖼️'}</span>`;

      const editor = !open ? '' : `<div style="display:flex;flex-direction:column;gap:7px;padding:8px 2px 2px;border-top:1px solid rgba(255,255,255,0.06);margin-top:6px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#0a0e19;padding:6px 8px;border-radius:6px;border:1px solid rgba(56,189,248,0.2);">
          <label style="display:flex;flex-direction:column;gap:3px;font-size:9.5px;color:#94a3b8;">Contour Shape
            <select data-k="l-cshape-${i}" style="${selectCss};padding:4px;font-size:10px;">
              <option value="rounded-rect" ${contourShape === 'rounded-rect' ? 'selected' : ''}>▭ Rounded Slate</option>
              <option value="sharp-rect" ${contourShape === 'sharp-rect' ? 'selected' : ''}>□ Sharp Frame</option>
              <option value="chamfer-octagon" ${contourShape === 'chamfer-octagon' ? 'selected' : ''}>⬣ Chamfer Octagon</option>
              <option value="arch-frame" ${contourShape === 'arch-frame' ? 'selected' : ''}>⌒ Arch Vault</option>
              <option value="hexagon-prism" ${contourShape === 'hexagon-prism' ? 'selected' : ''}>⬡ Hexagon Prism</option>
              <option value="diamond-rhombus" ${contourShape === 'diamond-rhombus' ? 'selected' : ''}>◇ Diamond Rhombus</option>
              <option value="circle-portal" ${contourShape === 'circle-portal' ? 'selected' : ''}>◯ Circle Portal</option>
              <option value="capsule-pill" ${contourShape === 'capsule-pill' ? 'selected' : ''}>⬭ Capsule Pill</option>
            </select>
          </label>
          <label style="display:flex;flex-direction:column;gap:3px;font-size:9.5px;color:#94a3b8;">Contour Color
            <div style="display:flex;align-items:center;gap:6px;height:26px;">
              <input type="color" data-k="l-ccolor-${i}" value="${/^#[0-9a-f]{6}$/i.test(contourCol) ? contourCol : '#f59e0b'}" style="border:none;width:32px;height:24px;border-radius:4px;cursor:pointer;background:transparent;" />
              <span style="font-size:9.5px;font-family:monospace;color:#cbd5e1;">${esc(contourCol)}</span>
            </div>
          </label>
        </div>

        <div style="display:flex;flex-direction:column;gap:5px;background:#0a0e19;padding:6px 8px;border-radius:6px;border:1px solid rgba(168,85,247,0.2);">
          <div style="display:grid;grid-template-columns:1fr auto;gap:6px;align-items:end;">
            <label style="display:flex;flex-direction:column;gap:3px;font-size:9.5px;color:#94a3b8;">Transition / Pass SFX
              <select data-k="l-sfx-${i}" style="${selectCss};padding:4px;font-size:10px;">
                ${sfxOptions.map(opt => `<option value="${opt.id}" ${curSfx === opt.id ? 'selected' : ''}>${esc(opt.name)}</option>`).join('')}
              </select>
            </label>
            <button type="button" data-act="l-sfx-test-${i}" style="padding:5px 8px;font-size:9.5px;font-weight:700;border-radius:5px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.15);color:#7dd3fc;cursor:pointer;">\u25b6 Test</button>
          </div>
          ${curSfx !== 'none' ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:2px;">
            <div style="display:flex;flex-direction:column;gap:1px;">
              <div style="display:flex;justify-content:space-between;font-size:8.5px;color:#94a3b8;"><span>SFX Volume</span><span data-val-for="l-sfxvol-${i}" style="color:#38bdf8;font-family:monospace;">${curSfxVol}%</span></div>
              <input type="range" data-k="l-sfxvol-${i}" min="0" max="150" step="1" value="${curSfxVol}" style="width:100%;accent-color:#38bdf8;height:3px;cursor:pointer;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:1px;">
              <div style="display:flex;justify-content:space-between;font-size:8.5px;color:#94a3b8;"><span>SFX Fade</span><span data-val-for="l-sfxfade-${i}" style="color:#c084fc;font-family:monospace;">${curSfxFade}%</span></div>
              <input type="range" data-k="l-sfxfade-${i}" min="0" max="100" step="1" value="${curSfxFade}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
            </div>
          </div>` : ''}
        </div>

        ${u.type !== 'text' && u.type !== 'code' ? `<label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">Artifact Archetype
          <select data-k="l-mode-${i}" style="${selectCss}">
            <option value="forbes" ${curMode === 'forbes' ? 'selected' : ''}>📰 Magazine 3D Cover (Beam & Flashes)</option>
            <option value="image" ${curMode === 'image' ? 'selected' : ''}>🖼️ Archival Photograph Plate</option>
            <option value="object" ${curMode === 'object' ? 'selected' : ''}>⬡ 3D Celestial / Wireframe Object</option>
            <option value="card" ${curMode === 'card' ? 'selected' : ''}>📄 Frosted Dossier Text Slate</option>
            <option value="chart" ${curMode === 'chart' ? 'selected' : ''}>📈 Financial Candlestick / Graph Slate</option>
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
          <div style="font-size:10px;font-weight:700;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;">Magazine Cover Customization</div>
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
              <button type="button" data-act="l-remove-img-${i}" style="padding:2px 8px;font-size:9.5px;font-weight:600;border-radius:4px;border:1px solid rgba(239,68,68,0.4);background:rgba(239,68,68,0.1);color:#fca5a5;cursor:pointer;">❌ Remove</button>
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
        ${row('l-z-' + i, 'Depth (Z)', -3500, 1200, 10, posZVal, v => v)}
        ${row('l-x-' + i, 'Position X', -1200, 1200, 10, posXVal, v => v)}
        ${row('l-y-' + i, 'Position Y', -800, 800, 10, posYVal, v => v)}
        ${row('l-scale-' + i, 'Scale', 0.3, 3, 0.05, u.scale || 1, v => Number(v).toFixed(2) + 'x')}
      </div>`;

      rowsHtml.push(`<div style="background:#121520;border:1px solid ${open ? 'rgba(56,189,248,.55)' : 'rgba(255,255,255,.08)'};border-radius:8px;padding:6px 8px;opacity:${isVis ? '1' : '0.5'};">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:5px;">
          <div data-act="l-toggle-${i}" style="display:flex;align-items:center;gap:6px;cursor:pointer;overflow:hidden;flex:1;">
            <span style="font-size:9px;font-weight:800;padding:2px 5px;border-radius:4px;background:rgba(168,85,247,0.18);color:#d8b4fe;border:1px solid rgba(168,85,247,0.35);font-family:monospace;flex-shrink:0;">Z=${i + 1}</span>
            ${thumbBadge}
            <div style="display:flex;flex-direction:column;overflow:hidden;">
              <span style="font-size:10.5px;font-weight:700;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(u.title || (u.type === 'text' ? '3D Title Plane' : 'Corridor Slate'))}</span>
              <span style="font-size:8.5px;color:#94a3b8;font-family:monospace;">Z:${posZVal} \u2022 ${esc(contourShape)}</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:3px;flex-shrink:0;">
            <button type="button" data-act="l-stop-${i}" title="Toggle Camera Stop at this Object" style="background:${isStopHere ? 'rgba(251,191,36,0.22)' : 'rgba(255,255,255,0.04)'};border:1px solid ${isStopHere ? '#fbbf24' : 'rgba(255,255,255,0.1)'};color:${isStopHere ? '#fde68a' : '#64748b'};font-size:9px;font-weight:700;border-radius:4px;cursor:pointer;padding:2px 5px;">${isStopHere ? '\ud83d\udccd Stop' : 'Stop'}</button>
            <button type="button" data-act="l-vis-${i}" title="Toggle Layer Visibility" style="background:transparent;border:none;color:${isVis ? '#38bdf8' : '#64748b'};font-size:11px;cursor:pointer;padding:2px 3px;">${isVis ? '\ud83d\udc41' : '\u25ce'}</button>
            <button type="button" data-act="l-up-${i}" style="background:transparent;border:none;color:#94a3b8;font-size:9.5px;cursor:pointer;padding:2px 3px;">\u25b2</button>
            <button type="button" data-act="l-down-${i}" style="background:transparent;border:none;color:#94a3b8;font-size:9.5px;cursor:pointer;padding:2px 3px;">\u25bc</button>
            <button type="button" data-act="l-del-${i}" style="background:transparent;border:none;color:#ef4444;font-size:11px;cursor:pointer;padding:2px 3px;">\u00d7</button>
          </div>
        </div>
        ${editor}
      </div>`);
    });

    box.innerHTML = rowsHtml.join('');
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

      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(curX, curY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    draw();
  }

  function setLabel(key, s) { const el = host() && host().querySelector(`[data-val-for="${key}"]`); if (el) el.textContent = s; }

  function refreshAllSpatialCardContours(patch) {
    const s = spatial3DState;
    (s.elements3D || []).forEach((m, idx) => {
      if (!m || !m.userData || m.userData.type === 'text') return;
      rebuildSpatialLayer(idx, patch, true);
    });
  }

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
    else if (key === 'v-speed') {
      const effSpeed = v <= 0 ? Math.max(0.1, 1 / (1 + Math.abs(v))) : v;
      fx.speed = Number(effSpeed.toFixed(2));
      lab(fx.speed.toFixed(2) + 'x' + (fx.speed < 0.95 ? ' (Slow)' : (fx.speed > 1.05 ? ' (Fast)' : '')));
    }
    else if (key === 'px-fg-zoom') {
      if (typeof topCustomizerState !== 'undefined') topCustomizerState.spoonerFgZoom = Number((v / 100).toFixed(2));
      lab(Math.round(v) + '%');
      if (typeof window.initUniversalStageTransformEngine === 'function') window.initUniversalStageTransformEngine();
    }
    else if (key === 'px-bg-zoom') {
      if (typeof topCustomizerState !== 'undefined') topCustomizerState.spoonerBgZoom = Number((v / 100).toFixed(2));
      lab(Math.round(v) + '%');
      if (typeof window.initUniversalStageTransformEngine === 'function') window.initUniversalStageTransformEngine();
    }
    else if (key === 'px-pan') {
      if (typeof topCustomizerState !== 'undefined') topCustomizerState.spoonerPan = Math.round(v);
      lab(Math.round(v) + 'px');
    }
    else if (key === 'px-blur') {
      if (typeof topCustomizerState !== 'undefined') topCustomizerState.spoonerBlur = Number(v);
      lab(Number(v).toFixed(1) + 'px');
    }
    else if (key === 'v-pitch') { fx.pitch = v; lab(v + '°'); }
    else if (key === 'v-yaw') { fx.yaw = v; lab(v + '°'); }
    else if (key === 'v-roll') { fx.roll = v; lab(v + '°'); }
    else if (key === 'v-zoom') { fx.zoom = v; lab(v.toFixed(2) + 'x'); }
    else if (key === 'flight') { s.flightMode = v; initSpatialPathCanvas(); }
    else if (key === 's-rec-base') { s.recordStartBase = v; }
    else if (key === 's-pathstyle') { s.pathStyle = v; initSpatialPathCanvas(); }
    else if (key === 's-pathcurve') { s.pathCurve = v; lab((v > 0 ? '+' : '') + v + '%'); initSpatialPathCanvas(); }
    else if (key === 's-zoom-speed') { s.zoomActionSpeed = v; lab(Number(v).toFixed(2) + 'x'); }
    else if (key === 's-zoomfx-shake-amt') { s.zoomFxShakeIntensity = v; lab(v + '%'); }
    else if (key === 's-zoomfx-pulse-amt') { s.zoomFxPulseIntensity = v; lab(v + '%'); }
    else if (key === 's-zoomfx-boom-amt') { s.zoomFxBoomIntensity = v; lab(v + '%'); }
    else if (key === 's-speed') { s.camSpeed = v; lab((v >= 0 ? '+' : '') + Number(v).toFixed(2) + 'x'); }
    else if (key === 's-slowmo-preset') { s.slowMoCurvePreset = v; }
    else if (key === 's-slowmo-dip') { s.slowMoDipSpeed = v; lab((v >= 0 ? '+' : '') + Number(v).toFixed(2) + 'x'); }
    else if (key === 's-slowmo-span') { s.slowMoDecelSpan = v / 100; lab(v + '% of timeline'); }
    else if (key === 's-slowmo-boom') { s.slowMoBoomBurst = v; lab(Number(v).toFixed(2) + 'x burst'); }
    else if (key === 's-slowmo-trig') { s.slowMoTriggerT = v / 100; lab('at ' + v + '%'); }
    else if (key === 's-contour-color') {
      s.cardContourColor = v;
      refreshAllSpatialCardContours({ contourColor: v, color: v });
      renderSpatialLayers();
    }
    else if (key === 's-contour-width') {
      s.cardContourWidth = v;
      lab(v + 'px');
      refreshAllSpatialCardContours({ contourWidth: v });
    }
    else if (key === 's-contour-glow') {
      s.cardContourGlow = v;
      lab(v + 'px');
      refreshAllSpatialCardContours({ contourGlow: v });
    }
    else if (key === 's-audio-vol') {
      s.audioVolume = v / 100;
      lab(v + '%');
    }
    else if (key.startsWith('s-audio-evvol-')) {
      const evName = key.replace('s-audio-evvol-', '');
      if (!s.audioEventSettings) s.audioEventSettings = {};
      if (!s.audioEventSettings[evName]) s.audioEventSettings[evName] = { volume: 0.85, fade: 0.25 };
      s.audioEventSettings[evName].volume = v / 100;
      lab(Math.round(v) + '%');
    }
    else if (key.startsWith('s-audio-evfade-')) {
      const evName = key.replace('s-audio-evfade-', '');
      if (!s.audioEventSettings) s.audioEventSettings = {};
      if (!s.audioEventSettings[evName]) s.audioEventSettings[evName] = { volume: 0.85, fade: 0.25 };
      s.audioEventSettings[evName].fade = v / 100;
      lab(Math.round(v) + '%');
    }
    else if (key.startsWith('s-audio-ev-')) {
      const evName = key.replace('s-audio-ev-', '');
      if (!s.audioEvents) s.audioEvents = {};
      s.audioEvents[evName] = v;
      if (v !== 'none' && typeof window.playSpatialSFX === 'function') window.playSpatialSFX(v, true, { eventKey: evName });
      build(tplId);
    }
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
      const m = key.match(/^l-(title|sub|body|stamp|trans|font|mode|shape|img|z|x|y|scale|color|magtitle|featuretag|featuretitle|kicker|beamcol|cshape|ccolor|sfx|sfxvol|sfxfade)-(\d+)$/);
      if (m) {
        const i = parseInt(m[2], 10), rawKey = m[1];
        if (rawKey === 'sfxvol' || rawKey === 'sfxfade') {
          const mesh = s.elements3D && s.elements3D[i];
          if (mesh && mesh.userData) {
            mesh.userData[rawKey === 'sfxvol' ? 'sfxVol' : 'sfxFade'] = parseFloat(v) / 100;
          }
          lab(Math.round(v) + '%');
        } else {
          const field = {
            title: 'title', sub: 'subtitle', body: 'body', stamp: 'stamp', trans: 'transitionEffect', font: 'fontFamily',
            mode: 'artifactMode', shape: 'objectShape', img: 'imageUrl', z: 'z', x: 'x', y: 'y', scale: 'scale', color: 'color',
            magtitle: 'magazineTitle', featuretag: 'featureTag', featuretitle: 'featureTitle', kicker: 'kickerBadge', beamcol: 'beamColor',
            cshape: 'contourShape', ccolor: 'contourColor', sfx: 'sfxId'
          }[rawKey];
          const num = ['z', 'x', 'y', 'scale'].includes(field);
          const val = num ? parseFloat(v) : v;
          const patch = { [field]: val };
          if (field === 'body') patch.text = val;
          if (field === 'x') patch.baseX = val;
          if (field === 'y') patch.baseY = val;
          if (field === 'z') patch.initialZ = val;
          if (field === 'contourColor') patch.color = val;
          rebuildSpatialLayer(i, patch);
          if (num) lab(field === 'scale' ? Number(val).toFixed(2) + 'x' : String(Math.round(val)));
          if (field === 'artifactMode' || field === 'contourShape' || field === 'contourColor' || field === 'sfxId') { renderSpatialLayers(); }
        }
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
    capture(tplId);
  }
  function onClick(ev) {
    const b = ev.target.closest('[data-act]'); if (!b || !curTpl) return;
    const act = b.dataset.act, tplId = curTpl, k = kindOf(tplId), e = entry(tplId), s = spatial3DState, d = document3DFXState;

    if (act === 'u3d-rec-toggle') {
      if (typeof window.tplToggleUniversal3DMotionRecord === 'function') {
        window.tplToggleUniversal3DMotionRecord(tplId);
      }
      build(tplId); return;
    }
    if (act === 'u3d-rec-replay') {
      if (typeof window.tplReplayUniversal3DMotion === 'function') {
        window.tplReplayUniversal3DMotion(tplId);
      }
      build(tplId); return;
    }
    if (act === 'u3d-rec-clear') {
      if (typeof window.tplClearUniversal3DMotion === 'function') {
        window.tplClearUniversal3DMotion(tplId);
      }
      build(tplId); return;
    }
    if (act.startsWith('s-style-preset-')) {
      const styleId = act.replace('s-style-preset-', '');
      if (typeof window.applySpatialStylePreset === 'function') {
        window.applySpatialStylePreset(styleId);
      } else if (typeof loadSpatialPreset === 'function') {
        loadSpatialPreset(styleId);
      }
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('s-sample-beat-')) {
      const beatIdx = parseInt(act.replace('s-sample-beat-', ''), 10);
      const beatTimes = [0.10, 0.35, 0.62, 0.90];
      s.flightMode = 'establishing-shot';
      s.currentTime = beatTimes[beatIdx] !== undefined ? beatTimes[beatIdx] : 0.10;
      spatialLiveClock = s.currentTime * 10;
      if (typeof updateSpatialCameraPosition === 'function') updateSpatialCameraPosition();
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('s-layer-filter-')) {
      spatialLayerFilter = act.replace('s-layer-filter-', '');
      build(tplId); return;
    }
    if (act === 'l-toggle-bg') {
      openLayerIdx = openLayerIdx === -2 ? -1 : -2;
      renderSpatialLayers(); return;
    }
    if (act === 's-rec-start') {
      const baseSel = host() && host().querySelector('[data-k="s-rec-base"]');
      const chosenBase = baseSel ? baseSel.value : (s.recordStartBase || s.flightMode || 'establishing-shot');
      s.recordStartBase = chosenBase;
      // Switch to 3D interactive mode so the user can immediately steer through the 3D scene with the mouse!
      if (e.mode !== '3d') {
        e.mode = '3d';
        s._is3DStageActive = true;
        stageTheaterActive = true;
        if (typeof topCustomizerState !== 'undefined') topCustomizerState.is3DMode = true;
        updateTheaterButtonUI();
        applyModeLayout(true);
      }
      if (typeof window.startSpatialRecording === 'function') {
        window.startSpatialRecording(chosenBase);
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-rec-stop') {
      if (typeof window.stopSpatialRecording === 'function') {
        window.stopSpatialRecording(true);
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-rec-download-video') {
      if (typeof window.downloadLastSpatialRecording === 'function') {
        window.downloadLastSpatialRecording();
      }
      return;
    }
    if (act === 's-rec-save-preset' || act === 's-rec-save-default') {
      const makeDefault = act === 's-rec-save-default';
      const nameInp = document.getElementById('spatial-rec-preset-name');
      const customName = nameInp && nameInp.value ? nameInp.value.trim() : '';
      if (typeof window.saveRecordedSpatialPreset === 'function') {
        window.saveRecordedSpatialPreset(customName, makeDefault);
      }
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('s-make-default-preset-')) {
      const pid = act.replace('s-make-default-preset-', '');
      s.defaultFlightPreset = pid;
      s.flightMode = pid;
      s.currentTime = 0;
      if (typeof showToast === 'function') showToast('Default camera preset updated!', 'success');
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('s-del-custom-preset-')) {
      const pid = act.replace('s-del-custom-preset-', '');
      if (Array.isArray(s.customRecordedPresets)) {
        s.customRecordedPresets = s.customRecordedPresets.filter(p => p.id !== pid);
      }
      if (s.flightMode === pid) s.flightMode = 'museum-tour';
      if (s.defaultFlightPreset === pid) s.defaultFlightPreset = 'museum-tour';
      capture(tplId); build(tplId); return;
    }
    if (act === 's-3d-set-start') {
      if (typeof window.setSpatial3DStartingPoint === 'function') {
        window.setSpatial3DStartingPoint();
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-3d-zoom-in') {
      if (typeof window.stepSpatialManualZoom === 'function') {
        window.stepSpatialManualZoom(25);
      } else if (typeof window.triggerSpatial3DZoomFromStart === 'function') {
        window.triggerSpatial3DZoomFromStart('in');
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-3d-zoom-out') {
      if (typeof window.stepSpatialManualZoom === 'function') {
        window.stepSpatialManualZoom(-20);
      } else if (typeof window.triggerSpatial3DZoomFromStart === 'function') {
        window.triggerSpatial3DZoomFromStart('out');
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-3d-free-walk') {
      if (s._flyThroughTarget) s._flyThroughTarget.active = false;
      s.threeDWalkMode = 'free-walk';
      if (s.camera) {
        s.customStartPoint = {
          x: Number(s.camera.position.x.toFixed(1)),
          y: Number(s.camera.position.y.toFixed(1)),
          z: Number(s.camera.position.z.toFixed(1)),
          yaw: Number((s.camYaw || 0).toFixed(1)),
          pitch: Number((s.camPitch || 0).toFixed(1))
        };
        s.hasCustomStartPoint = true;
        s.handTargetDetourX = 0;
        s.handTargetDetourY = 0;
        s.handTargetDetourZ = 0;
        s.handDetourX = 0;
        s.handDetourY = 0;
        s.handDetourZ = 0;
      }
      if (typeof window.updateSpatialTopZoomHUD === 'function') window.updateSpatialTopZoomHUD();
      capture(tplId); build(tplId); return;
    }
    if (act === 's-toggle-zoomfx-shake') {
      s.zoomFxShake = !s.zoomFxShake;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-toggle-zoomfx-pulse') {
      s.zoomFxPulse = !s.zoomFxPulse;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-toggle-zoomfx-boom') {
      s.zoomFxBoom = !s.zoomFxBoom;
      if (s.zoomFxBoom) {
        s._boomFlashAlpha = 0.55;
        if (typeof window.playSpatialSFX === 'function' && s.audioEnabled) {
          window.playSpatialSFX('sub-bass-boom', true, { volume: 85, fade: 15 });
        }
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-3d-save-start-preset' || act === 's-3d-save-start-default') {
      const makeDef = act === 's-3d-save-start-default';
      const nameEl = document.getElementById('spatial-start-zoom-preset-name');
      const customName = nameEl && nameEl.value ? nameEl.value.trim() : '';
      if (typeof window.saveSpatialStartZoomPreset === 'function') {
        window.saveSpatialStartZoomPreset(customName, makeDef);
      }
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('s-flight-preset-')) {
      const modeId = act.replace('s-flight-preset-', '');
      if (s._flyThroughTarget) s._flyThroughTarget.active = false;
      if (modeId === 'center-title-through' && s.activePreset !== 'awakening-gallery') {
        loadSpatialPreset('awakening-gallery');
      }
      s.flightMode = modeId;
      s.recordStartBase = modeId;
      s.currentTime = 0;
      spatialLiveClock = 0;
      if (e.mode === '3d') {
        s.threeDWalkMode = modeId === 'free-hand' ? 'free-walk' : 'preset-preview';
      }
      s._triggeredStopIds = {};
      s._triggeredFlyByIds = {};
      if (s.audioEvents && s.audioEvents.onSceneStart && s.audioEvents.onSceneStart !== 'none' && typeof window.playSpatialSFX === 'function') {
        window.playSpatialSFX(s.audioEvents.onSceneStart, false, { eventKey: 'onSceneStart' });
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-stopmode-none') {
      s.stopMode = 'none';
      capture(tplId); build(tplId); return;
    }
    if (act === 's-stopmode-selected') {
      s.stopMode = 'user-selected';
      const hasAnyStop = (s.elements3D || []).some(m => m.userData && m.userData.stopHere);
      if (!hasAnyStop && s.elements3D && s.elements3D[0] && s.elements3D[0].userData) {
        s.elements3D[0].userData.stopHere = true;
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-stopmode-random') {
      s.stopMode = 'random-single';
      const list = s.elements3D || [];
      if (list.length > 0) {
        const pick = list[Math.floor(Math.random() * list.length)];
        s.randomStopLayerId = pick && pick.userData ? pick.userData.id : null;
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-reroll-random-stop') {
      const list = s.elements3D || [];
      if (list.length > 0) {
        const pick = list[Math.floor(Math.random() * list.length)];
        s.randomStopLayerId = pick && pick.userData ? pick.userData.id : null;
        if (typeof window.playSpatialSFX === 'function') window.playSpatialSFX('camera-shutter', true);
      }
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('l-stop-')) {
      const idx = parseInt(act.replace('l-stop-', ''), 10);
      const mesh = s.elements3D && s.elements3D[idx];
      if (mesh && mesh.userData) {
        mesh.userData.stopHere = !mesh.userData.stopHere;
        if (mesh.userData.stopHere) s.stopMode = 'user-selected';
      }
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('l-vis-')) {
      const idx = parseInt(act.replace('l-vis-', ''), 10);
      const mesh = s.elements3D && s.elements3D[idx];
      if (mesh && mesh.userData) {
        const nextVis = !(mesh.userData.visible !== false && mesh.visible !== false);
        mesh.userData.visible = nextVis;
        mesh.visible = nextVis;
      }
      capture(tplId); renderSpatialLayers(); return;
    }
    if (act.startsWith('s-set-speed-')) {
      const spVal = parseFloat(act.replace('s-set-speed-', ''));
      if (!isNaN(spVal)) {
        s.camSpeed = spVal;
        capture(tplId); build(tplId);
      }
      return;
    }
    if (act === 's-toggle-slowmo-ramp') {
      s.slowMoRampEnabled = !s.slowMoRampEnabled;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-test-slowmo-boom') {
      s.slowMoRampEnabled = true;
      const trig = s.slowMoTriggerT !== undefined ? s.slowMoTriggerT : 0.45;
      const span = s.slowMoDecelSpan !== undefined ? s.slowMoDecelSpan : 0.18;
      s.currentTime = Math.max(0.02, trig - span * 0.95);
      s._slowMoDipPlayed = false;
      s._slowMoBoomPlayed = false;
      if (e.mode === '3d') {
        e.mode = 'video';
        applyModeLayout(false);
      }
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('s-contour-swatch-')) {
      const hex = act.replace('s-contour-swatch-', '');
      s.cardContourColor = hex;
      refreshAllSpatialCardContours({ contourColor: hex, color: hex });
      capture(tplId); build(tplId); return;
    }
    if (act.startsWith('s-contour-shape-')) {
      const sh = act.replace('s-contour-shape-', '');
      s.cardContourShape = sh;
      refreshAllSpatialCardContours({ contourShape: sh });
      capture(tplId); build(tplId); return;
    }
    if (act === 's-audio-toggle') {
      s.audioEnabled = s.audioEnabled === false ? true : false;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-audio-upload') {
      const inp = document.getElementById('spatial-custom-sfx-input');
      if (inp) {
        inp.onchange = (fev) => {
          const files = Array.from(fev.target.files || []);
          if (!files.length) return;
          if (!Array.isArray(s.customAudioClips)) s.customAudioClips = [];
          let loaded = 0;
          files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (rev) => {
              const clipId = 'custom-sfx-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
              const cleanName = file.name.replace(/\.[^.]+$/, '').slice(0, 24);
              s.customAudioClips.push({ id: clipId, name: cleanName, dataUrl: rev.target.result });
              loaded++;
              if (loaded === files.length) {
                if (typeof window.playSpatialSFX === 'function') window.playSpatialSFX(clipId, true);
                capture(tplId); build(tplId);
              }
            };
            reader.readAsDataURL(file);
          });
        };
        inp.click();
      }
      return;
    }
    if (act.startsWith('s-sfx-evpreview-')) {
      const evKey = act.replace('s-sfx-evpreview-', '');
      const sfxId = s.audioEvents && s.audioEvents[evKey];
      if (sfxId && sfxId !== 'none' && typeof window.playSpatialSFX === 'function') {
        window.playSpatialSFX(sfxId, true, { eventKey: evKey });
      }
      return;
    }
    if (act.startsWith('l-sfx-test-')) {
      const idx = parseInt(act.replace('l-sfx-test-', ''), 10);
      const mesh = s.elements3D && s.elements3D[idx];
      const u = (mesh && mesh.userData) || {};
      if (u.sfxId && u.sfxId !== 'none' && typeof window.playSpatialSFX === 'function') {
        window.playSpatialSFX(u.sfxId, true, {
          volume: u.sfxVol !== undefined ? u.sfxVol : 0.85,
          fade: u.sfxFade !== undefined ? u.sfxFade : 0.25
        });
      }
      return;
    }
    if (act.startsWith('s-sfx-preview-')) {
      const sfxId = act.replace('s-sfx-preview-', '');
      if (sfxId && sfxId !== 'none' && typeof window.playSpatialSFX === 'function') {
        window.playSpatialSFX(sfxId, true);
      }
      return;
    }
    if (act.startsWith('s-sfx-del-')) {
      const clipId = act.replace('s-sfx-del-', '');
      if (Array.isArray(s.customAudioClips)) {
        s.customAudioClips = s.customAudioClips.filter(c => c.id !== clipId);
      }
      capture(tplId); build(tplId); return;
    }
    if (act === 's-hand-mode-spring' || act === 's-hand-mode-walk') {
      s.handControlMode = 'detour-spring';
      capture(tplId); build(tplId); return;
    }
    if (act === 's-hand-mode-hold' || act === 's-hand-mode-orbit') {
      s.handControlMode = 'detour-hold';
      capture(tplId); build(tplId); return;
    }
    if (act === 's-reset-hand-cam') {
      s.handTargetDetourX = 0;
      s.handTargetDetourY = 0;
      s.handTargetDetourZ = 0;
      s.handDetourX = 0;
      s.handDetourY = 0;
      s.handDetourZ = 0;
      s.camYaw = 0;
      s.camPitch = 0;
      updateSpatialCameraPosition();
      capture(tplId); build(tplId); return;
    }
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
        capture(tplId); build(tplId);
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
      const newCard = createSpatialCardPlane({
        id, type: 'card', artifactMode: 'forbes',
        imageUrl: '/portrait_cutout_clean.png',
        magazineTitle: 'Forbes', featureTag: 'SPECIAL REPORT // THE ARCHITECT', featureTitle: 'THE $30 BILLION FRAUD', kickerBadge: 'EXPOSED',
        title: 'FORBES 3D COVER', subtitle: 'THE FRAUD REVEAL', body: 'Investigative dossier artifact placed into spatial corridor.',
        z: (s.elements3D && s.elements3D.length ? s.elements3D[s.elements3D.length - 1].position.z - 400 : -1000),
        x: 0, y: 15, scale: 1.25,
        color: s.cardContourColor || '#f59e0b',
        contourColor: s.cardContourColor || '#f59e0b',
        contourShape: s.cardContourShape || 'rounded-rect',
        sfxId: 'none'
      });
      s.scene.add(newCard); s.elements3D.push(newCard);
      openLayerIdx = s.elements3D.length - 1;
      capture(tplId); build(tplId); return;
    }
    if (act === 's-add') {
      const id = Date.now().toString();
      const newTitle = createSpatialTextPlane({ id, type: 'text', title: 'KEYWORD PHRASE', subtitle: 'SUBHEADING NARRATIVE', body: '', z: (s.elements3D && s.elements3D.length ? s.elements3D[s.elements3D.length - 1].position.z - 400 : -1000), x: 0, y: 15, scale: 1.15, color: '#f59e0b', sfxId: 'none' });
      s.scene.add(newTitle); s.elements3D.push(newTitle);
      openLayerIdx = s.elements3D.length - 1;
      capture(tplId); build(tplId); return;
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
      if (k === 'spatial') {
        spatial3DState._is3DStageActive = is3D;
        if (is3D) {
          spatial3DState.threeDWalkMode = 'free-walk';
          if (spatial3DState.camera) {
            spatial3DState.manualCamPos = {
              x: spatial3DState.camera.position.x,
              y: spatial3DState.camera.position.y,
              z: spatial3DState.camera.position.z
            };
            spatial3DState.manualTargetX = spatial3DState.camera.position.x;
            spatial3DState.manualTargetY = spatial3DState.camera.position.y;
            spatial3DState.manualTargetZ = spatial3DState.camera.position.z;
          }
        }
      }
      stageTheaterActive = is3D;
      if (typeof topCustomizerState !== 'undefined') topCustomizerState.is3DMode = is3D;
      updateTheaterButtonUI();
      applyModeLayout(is3D);
      persist(); lastKey = '';
      renderTopTemplatePreviewStage();
      return;
    }
    if (act === 'v-reset') { Object.assign(e.fx, { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 }); persist(); build(tplId); return; }
    if (act === 'px-preset-push-pull') {
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.spoonerFgDir = 'push';
        topCustomizerState.spoonerBgDir = 'pull';
      }
      if (typeof window.initUniversalStageTransformEngine === 'function') window.initUniversalStageTransformEngine();
      build(tplId); return;
    }
    if (act === 'px-preset-pull-push') {
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.spoonerFgDir = 'pull';
        topCustomizerState.spoonerBgDir = 'push';
      }
      if (typeof window.initUniversalStageTransformEngine === 'function') window.initUniversalStageTransformEngine();
      build(tplId); return;
    }
    if (act === 'px-fg-push' || act === 'px-fg-pull') {
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.spoonerFgDir = act === 'px-fg-push' ? 'push' : 'pull';
      }
      if (typeof window.initUniversalStageTransformEngine === 'function') window.initUniversalStageTransformEngine();
      build(tplId); return;
    }
    if (act === 'px-bg-push' || act === 'px-bg-pull') {
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.spoonerBgDir = act === 'px-bg-push' ? 'push' : 'pull';
      }
      if (typeof window.initUniversalStageTransformEngine === 'function') window.initUniversalStageTransformEngine();
      build(tplId); return;
    }
    if (act === 'px-txt-off' || act === 'px-txt-push' || act === 'px-txt-pull') {
      if (typeof topCustomizerState !== 'undefined') {
        topCustomizerState.spoonerTxtDir = act === 'px-txt-off' ? 'off' : (act === 'px-txt-push' ? 'push' : 'pull');
      }
      build(tplId); return;
    }
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
    const e = entry(tplId);
    const is3DMode = e.mode === '3d';
    stageTheaterActive = is3DMode;
    updateTheaterButtonUI();
    applyModeLayout(is3DMode);
    const k = kindOf(tplId), cid = k === 'spatial' ? 'spatial-threejs-container' : 'doc-threejs-container';
    stage.innerHTML = `<div id="customizer-stage-inner" style="position:absolute;inset:0;overflow:hidden;background:#07090e;"><div data-3d-stage="1" style="position:absolute;inset:0;cursor:grab;"></div></div>`;
    const container = stage.querySelector('[data-3d-stage]');
    container.id = cid;
    const st = stOf(k);
    if (st.renderer) { st.renderer.domElement.parentNode !== container && (container.innerHTML = '', container.appendChild(st.renderer.domElement)); }
    ensureEngine(k, container);
    if (k === 'spatial') {
      spatial3DState._is3DStageActive = is3DMode;
    }
    fit();
    startLoop(k);
    setTimeout(() => {
      if (!container.isConnected) return;
      ensureEngine(k, container);
      fit(); startLoop(k);

      // True Interactive 3D Hand Detour on Top of the Active Route + Tap/Click Any 3D Object to Fly Directly Through It!
      let dragging = false, startX = 0, startY = 0, startYaw = 0, startPitch = 0;
      let startDetourX = 0, startDetourY = 0;
      let maxDragDist = 0;
      container.style.cursor = 'grab';
      container.addEventListener('contextmenu', (ev) => ev.preventDefault());

      // Helper to find a 3D object in spatial3DState.elements3D under clientX, clientY (Raycaster + 2D screen-space fallback for titles/distant cards)
      const findSpatialObjectAtPoint = (clientX, clientY) => {
        if (k !== 'spatial' || typeof THREE === 'undefined' || !spatial3DState.camera || !spatial3DState.elements3D) return null;
        const rect = container.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

        // 1. Direct 3D Raycast against all visible meshes
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), spatial3DState.camera);
        const visList = (spatial3DState.elements3D || []).filter(m => m && m.visible !== false && (!m.userData || m.userData.visible !== false));
        const hits = raycaster.intersectObjects(visList, true);
        if (hits && hits.length > 0) {
          for (let hIdx = 0; hIdx < hits.length; hIdx++) {
            let cur = hits[hIdx].object;
            while (cur && !visList.includes(cur)) {
              cur = cur.parent;
            }
            if (cur) {
              const elIdx = spatial3DState.elements3D.indexOf(cur);
              return { obj: cur, index: elIdx };
            }
          }
        }

        // 2. Screen-space 2D bounding projection fallback (makes tapping between 3D title letters or distant back-wall objects effortless)
        let bestMatch = null;
        let bestScore = Infinity;
        const cam = spatial3DState.camera;
        for (let i = 0; i < visList.length; i++) {
          const obj = visList[i];
          const u = obj.userData || {};
          const dz = cam.position.z - obj.position.z;
          if (dz < 40) continue; // behind or too close to camera lens
          const halfW = (u.planeWidth || (u.type === 'text' ? 900 : 520)) * 0.52;
          const halfH = (u.planeHeight || (u.type === 'text' ? 230 : 330)) * 0.55;
          const centerV = obj.position.clone().project(cam);
          if (centerV.z < -1 || centerV.z > 1) continue;
          const cornerV = new THREE.Vector3(obj.position.x + halfW, obj.position.y + halfH, obj.position.z).project(cam);
          const radX = Math.max(0.06, Math.abs(cornerV.x - centerV.x));
          const radY = Math.max(0.06, Math.abs(cornerV.y - centerV.y));
          if (Math.abs(ndcX - centerV.x) <= radX && Math.abs(ndcY - centerV.y) <= radY) {
            const normDist = Math.hypot((ndcX - centerV.x) / radX, (ndcY - centerV.y) / radY);
            if (normDist < bestScore) {
              bestScore = normDist;
              bestMatch = { obj, index: spatial3DState.elements3D.indexOf(obj) };
            }
          }
        }
        return bestMatch;
      };

      // Bind Top-of-Stage Quick Zoom & Free Walk HUD (#spatial-top-zoom-hud)
      const bindTopZoomHud = () => {
        if (!document.getElementById('spatial-boom-flash-overlay')) {
          const flashEl = document.createElement('div');
          flashEl.id = 'spatial-boom-flash-overlay';
          flashEl.style.cssText = 'position:absolute;inset:0;z-index:11;pointer-events:none;opacity:0;background:radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(0,229,255,0.75) 35%, rgba(168,85,247,0.3) 70%, transparent 100%);mix-blend-mode:screen;transition:opacity 0.06s linear;';
          container.appendChild(flashEl);
        }
        let hud = document.getElementById('spatial-top-zoom-hud');
        if (!hud) {
          hud = document.createElement('div');
          hud.id = 'spatial-top-zoom-hud';
          hud.style.cssText = 'display:none;align-items:center;gap:4px;background:rgba(10,12,20,0.86);backdrop-filter:blur(12px);border:1px solid rgba(56,189,248,0.42);border-radius:10px;padding:3px 6px;box-shadow:0 4px 16px rgba(0,0,0,0.45);';
          hud.innerHTML = `
            <button id="btn-spatial-top-freewalk" type="button" title="Toggle Free Walk Mode (Drag to look/move, Tap any 3D object to fly through it)" style="background:rgba(16,185,129,0.22);border:1px solid rgba(16,185,129,0.55);color:#6ee7b7;border-radius:7px;padding:4px 8px;font-size:11px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.15s;">
              <span>🚶</span><span class="spatial-top-fw-label">Free Walk</span>
            </button>
            <button id="btn-spatial-top-zoom-out" type="button" title="Zoom Out (−) from current/start position" style="background:rgba(168,85,247,0.22);border:1px solid rgba(168,85,247,0.55);color:#d8b4fe;border-radius:7px;width:26px;height:24px;font-size:14px;font-weight:900;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;">−</button>
            <button id="btn-spatial-top-zoom-pct" type="button" title="Current 3D Zoom Percentage (Click to reset to 100%)" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.16);color:#e2e8f0;border-radius:6px;padding:3px 7px;font-size:10px;font-weight:800;font-family:monospace;min-width:44px;text-align:center;cursor:pointer;">100%</button>
            <button id="btn-spatial-top-zoom-in" type="button" title="Zoom In (+) from current/start position" style="background:rgba(56,189,248,0.22);border:1px solid rgba(56,189,248,0.55);color:#7dd3fc;border-radius:7px;width:26px;height:24px;font-size:14px;font-weight:900;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;">+</button>
          `;
          const theaterBtn = document.getElementById('btn-tpl-modal-theater');
          if (theaterBtn && theaterBtn.parentElement) {
            theaterBtn.parentElement.insertBefore(hud, theaterBtn);
          } else {
            container.appendChild(hud);
          }
        }
        hud.style.display = k === 'spatial' ? 'inline-flex' : 'none';
        if (hud.dataset.boundSpatialHud) {
          if (typeof window.updateSpatialTopZoomHUD === 'function') window.updateSpatialTopZoomHUD();
          return;
        }
        hud.dataset.boundSpatialHud = '1';

        const btnFw = document.getElementById('btn-spatial-top-freewalk');
        const btnZi = document.getElementById('btn-spatial-top-zoom-in');
        const btnZo = document.getElementById('btn-spatial-top-zoom-out');
        const btnPct = document.getElementById('btn-spatial-top-zoom-pct');

        if (btnFw) {
          btnFw.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const s = spatial3DState;
            const ent = entry('spatial-3d-motion-suite');
            if (s._flyThroughTarget) s._flyThroughTarget.active = false;
            ent.mode = '3d';
            s._is3DStageActive = true;
            s.threeDWalkMode = 'free-walk';
            if (s.camera) {
              s.customStartPoint = {
                x: Number(s.camera.position.x.toFixed(1)),
                y: Number(s.camera.position.y.toFixed(1)),
                z: Number(s.camera.position.z.toFixed(1)),
                yaw: Number((s.camYaw || 0).toFixed(1)),
                pitch: Number((s.camPitch || 0).toFixed(1))
              };
              s.hasCustomStartPoint = true;
              s.handTargetDetourX = 0;
              s.handTargetDetourY = 0;
              s.handTargetDetourZ = 0;
              s.handDetourX = 0;
              s.handDetourY = 0;
              s.handDetourZ = 0;
            }
            stageTheaterActive = true;
            updateTheaterButtonUI();
            applyModeLayout(true);
            if (typeof window.updateSpatialTopZoomHUD === 'function') window.updateSpatialTopZoomHUD();
            if (typeof window.showToast === 'function') {
              window.showToast(`🚶 Free Walk Active (${s.zoomPercent || 100}%) — Drag to look/move or tap any 3D object to fly through it!`);
            }
            capture('spatial-3d-motion-suite');
            build('spatial-3d-motion-suite');
          });
        }
        if (btnZi) {
          btnZi.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (typeof window.stepSpatialManualZoom === 'function') {
              window.stepSpatialManualZoom(25);
            }
            capture('spatial-3d-motion-suite');
            build('spatial-3d-motion-suite');
          });
        }
        if (btnZo) {
          btnZo.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (typeof window.stepSpatialManualZoom === 'function') {
              window.stepSpatialManualZoom(-20);
            }
            capture('spatial-3d-motion-suite');
            build('spatial-3d-motion-suite');
          });
        }
        if (btnPct) {
          btnPct.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (typeof window.resetSpatialManualZoom === 'function') {
              window.resetSpatialManualZoom();
            }
            capture('spatial-3d-motion-suite');
            build('spatial-3d-motion-suite');
          });
        }
        if (typeof window.updateSpatialTopZoomHUD === 'function') window.updateSpatialTopZoomHUD();
      };
      bindTopZoomHud();

      container.addEventListener('pointerdown', (ev) => {
        if (ev.target.closest('button, input, select, .tpl-modal-player-hud, #spatial-top-zoom-hud')) return;
        dragging = true;
        maxDragDist = 0;
        startX = ev.clientX;
        startY = ev.clientY;
        startYaw = k === 'spatial' ? (spatial3DState.camYaw || 0) : (document3DFXState.yaw || 0);
        startPitch = k === 'spatial' ? (spatial3DState.camPitch || 0) : (document3DFXState.pitch || 0);
        if (k === 'spatial') {
          spatial3DState.isHandDragging = true;
          startDetourX = spatial3DState.handTargetDetourX || 0;
          startDetourY = spatial3DState.handTargetDetourY || 0;
        }
        container.style.cursor = 'grabbing';
        try { container.setPointerCapture(ev.pointerId); } catch (_) {}
      });

      container.addEventListener('pointermove', (ev) => {
        const r = container.getBoundingClientRect();
        if (k === 'spatial') {
          spatial3DState.mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
          spatial3DState.mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
        }

        if (!dragging) {
          if (k === 'spatial') {
            const hovered = findSpatialObjectAtPoint(ev.clientX, ev.clientY);
            container.style.cursor = hovered ? 'pointer' : 'grab';
          }
          return;
        }
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        maxDragDist = Math.max(maxDragDist, Math.hypot(dx, dy));

        if (k === 'spatial') {
          if (maxDragDist >= 7) {
            if (spatial3DState._flyThroughTarget) spatial3DState._flyThroughTarget.active = false;
            if (entry(tplId).mode === '3d' && !spatial3DState.isRecording && spatial3DState.threeDWalkMode !== 'free-walk') {
              spatial3DState.threeDWalkMode = 'free-walk';
            }
          }
          // Hand drag steers & moves through the 3D space (both translating X/Y and angling 3D yaw/pitch!)
          spatial3DState.handTargetDetourX = Math.max(-850, Math.min(850, startDetourX - dx * 1.65));
          spatial3DState.handTargetDetourY = Math.max(-340, Math.min(360, startDetourY + dy * 1.25));
          spatial3DState.camYaw = Math.max(-55, Math.min(55, startYaw + dx * 0.08));
          spatial3DState.camPitch = Math.max(-35, Math.min(35, startPitch - dy * 0.08));

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
        if (k === 'spatial') {
          spatial3DState.isHandDragging = false;
          // If the user tapped/clicked (without dragging) on a 3D object on stage -> Fly Directly Through It at the Inspector speed!
          if (maxDragDist < 8 && ev && typeof ev.clientX === 'number') {
            const tapped = findSpatialObjectAtPoint(ev.clientX, ev.clientY);
            if (tapped && tapped.obj && typeof window.triggerSpatialObjectFlyThrough === 'function') {
              // Restore any tiny micro-movement from the tap before launching the direct fly-through
              spatial3DState.handTargetDetourX = startDetourX;
              spatial3DState.handTargetDetourY = startDetourY;
              spatial3DState.camYaw = startYaw;
              spatial3DState.camPitch = startPitch;
              window.triggerSpatialObjectFlyThrough(tapped.obj, tapped.index);
            }
          }
        }
        container.style.cursor = 'grab';
        try { container.releasePointerCapture(ev.pointerId); } catch (_) {}
        persist();
      };
      container.addEventListener('pointerup', stopDrag);
      container.addEventListener('pointercancel', stopDrag);

      // Mouse Wheel Navigation (Push/pull depth walk-through along the 3D corridor)
      container.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        if (k === 'spatial') {
          if (spatial3DState._flyThroughTarget) spatial3DState._flyThroughTarget.active = false;
          if (entry(tplId).mode === '3d' && !spatial3DState.isRecording && spatial3DState.threeDWalkMode !== 'free-walk') {
            spatial3DState.threeDWalkMode = 'free-walk';
          }
          const zoomSpd = Math.max(0.2, Number(spatial3DState.zoomActionSpeed !== undefined ? spatial3DState.zoomActionSpeed : 1.0));
          spatial3DState.handTargetDetourZ = Math.max(-3400, Math.min(1800, (spatial3DState.handTargetDetourZ || 0) + ev.deltaY * 1.45 * zoomSpd));
          if (typeof window.updateSpatialTopZoomHUD === 'function') window.updateSpatialTopZoomHUD();
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
      const w = container.clientWidth || (stage && stage.clientWidth) || 800;
      const h = container.clientHeight || (stage && stage.clientHeight) || 450;
      if (st.renderer && st.camera) {
        st.camera.aspect = w / h;
        st.camera.updateProjectionMatrix();
        st.renderer.setSize(w, h);
        if (st.scene) st.renderer.render(st.scene, st.camera);
      }
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
    if (typeof window.tplFitAllBalanceSheets === 'function') {
      window.tplFitAllBalanceSheets();
      setTimeout(window.tplFitAllBalanceSheets, 50);
      setTimeout(window.tplFitAllBalanceSheets, 150);
    }
  }

  window.tpl3DUse3D = (id) => {
    const k = kindOf(id);
    return k === 'spatial' || (k === 'doc' && entry(id).mode !== 'video');
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
  window.tpl3DOnFrame = function (seqTime) {
    seqNow = seqTime;
    if (curTpl === 'spatial-3d-motion-suite' && typeof spatial3DState !== 'undefined' && typeof topCustomizerState !== 'undefined' && topCustomizerState.isPlaying === false) {
      const e = entry('spatial-3d-motion-suite');
      driveSpatial(e, seqTime);
      if (typeof updateSpatialCameraPosition === 'function') updateSpatialCameraPosition();
    }
  };
  window.tpl3DOnReplay = function () {
    seqNow = 0;
    spatialLiveClock = 0;
    if (typeof spatial3DState !== 'undefined') {
      spatial3DState.currentTime = 0;
      spatial3DState._triggeredStopIds = {};
      spatial3DState._triggeredFlyByIds = {};
    }
  };
  window.tpl3DOnClose = function () {
    stageTheaterActive = false;
    updateTheaterButtonUI();
    applyModeLayout(false);
    const hud = document.getElementById('spatial-top-zoom-hud');
    if (hud) hud.style.display = 'none';
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
      if (k === 'spatial') { st._is3DStageActive = false; driveSpatial(sc.entry, t); for (let i = 0; i < 8; i++) updateSpatialCameraPosition(); }
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
    if (clip.fxScene && clip.fxScene.tplId === 'jani-ftx-logo-reveal' && typeof window.renderJaniFtxLogoCanvas === 'function') {
      window.renderJaniFtxLogoCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'jani-forbes-fraud-reveal' && typeof window.renderJaniForbesCanvas === 'function') {
      window.renderJaniForbesCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'jani-flash-quad-sequence' && typeof window.renderJaniFlashQuadCanvas === 'function') {
      window.renderJaniFlashQuadCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
    if (clip.fxScene && clip.fxScene.tplId === 'jani-spin-flash-glitch-reveal' && typeof window.renderJaniSpinFlashGlitchCanvas === 'function') {
      window.renderJaniSpinFlashGlitchCanvas(c, clip, t, cw, ch);
      c.restore();
      return;
    }
      if ((k === 'spatial' || (k === 'doc' && sc.entry.mode === '3d')) && typeof THREE !== 'undefined') {
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
    const hasCustomEdits = e && ((e.texts && Object.keys(e.texts).length > 0) || e.mode === '3d');
    if (!hasCustomEdits && typeof window.AUTHENTIC_TEMPLATE_SNAPSHOTS !== 'undefined' && window.AUTHENTIC_TEMPLATE_SNAPSHOTS[tplId]) {
      const authSnap = window.AUTHENTIC_TEMPLATE_SNAPSHOTS[tplId];
      window.tplRefreshCardThumbnails(tplId, authSnap);
      if (cb) cb(authSnap);
      return;
    }
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

  // --- Dynamic Snapshot Thumbnail Renderer for Each Camera Movement Preset
  let _presetThumbBgImg = null;
  let _presetThumbAnimId = null;
  let _hoveredPresetId = null;

  function ensurePresetThumbBg(cb) {
    if (_presetThumbBgImg && _presetThumbBgImg.complete) {
      if (cb) cb(_presetThumbBgImg);
      return _presetThumbBgImg;
    }
    if (!_presetThumbBgImg) {
      _presetThumbBgImg = new Image();
      _presetThumbBgImg.crossOrigin = 'anonymous';
      _presetThumbBgImg.onload = () => { if (cb) cb(_presetThumbBgImg); };
      _presetThumbBgImg.src = '/spatial_3d_real_snapshot.jpg?v=3';
    }
    return null;
  }

  function samplePresetTrajectoryPoint(presetId, u, s) {
    // Returns normalized { x: -1..1, z: 0(front)..1(deep back), label, color }
    if (presetId === 'establishing-shot') {
      const x = u < 0.5 ? Math.sin(u * Math.PI * 2) * 0.08 : Math.sin((u - 0.5) * Math.PI * 2) * 0.36;
      const z = 0.12 + u * 0.78;
      return { x, z, color: '#d4af37', tag: '4S DOCU' };
    }
    if (presetId === 'slow-dolly') {
      return { x: Math.sin(u * Math.PI) * 0.05, z: 0.10 + u * 0.80, color: '#fde68a', tag: 'DOLLY' };
    }
    if (presetId === 'lateral-reveal') {
      return { x: -0.68 + u * 1.36, z: 0.25 + u * 0.55, color: '#38bdf8', tag: 'LATERAL' };
    }
    if (presetId === 'evidence-focus') {
      const x = u < 0.45 ? -0.52 : (u < 0.55 ? (-0.52 + ((u - 0.45) / 0.10) * 1.04) : 0.52);
      return { x, z: 0.20 + u * 0.65, color: '#60a5fa', tag: 'EVIDENCE' };
    }
    if (presetId === 'hero-title') {
      return { x: Math.sin(u * Math.PI * 2) * 0.12, z: 0.18 + u * 0.48, color: '#f59e0b', tag: 'HERO' };
    }
    if (presetId === 'museum-tour') {
      const stopWaves = Math.sin(u * Math.PI * 3) * 0.55;
      return { x: stopWaves, z: u, color: '#38bdf8', tag: 'TOUR' };
    }
    if (presetId === 'center-title-through') {
      return { x: 0, z: 0.08 + u * 0.85, color: '#fbbf24', tag: 'CENTER' };
    }
    if (presetId === 'free-hand') {
      const figX = Math.sin(u * Math.PI * 2) * 0.6;
      const figZ = 0.5 + Math.cos(u * Math.PI * 2) * 0.32;
      return { x: figX, z: figZ, color: '#34d399', tag: 'HAND' };
    }
    if (presetId === 'back-to-front-back') {
      // Starts at back (z=0.92), moves to front (z=0.10) at u=0.5, returns to back (z=0.92)
      const z = u < 0.5 ? (0.92 - (u * 2) * 0.82) : (0.10 + ((u - 0.5) * 2) * 0.82);
      const x = Math.sin(u * Math.PI * 2) * 0.28;
      return { x, z, color: '#c084fc', tag: 'B\u2192F\u2192B' };
    }
    if (presetId === 'front-to-back') {
      return { x: Math.sin(u * Math.PI) * 0.14, z: 0.08 + u * 0.85, color: '#f59e0b', tag: 'F\u2192B' };
    }
    if (presetId === 'left-to-right-weave') {
      const x = -0.78 + u * 1.56;
      const z = 0.5 + Math.sin(u * Math.PI * 2.5) * 0.34;
      return { x, z, color: '#38bdf8', tag: 'L\u2192R' };
    }
    if (presetId === 'right-to-left-weave') {
      const x = 0.78 - u * 1.56;
      const z = 0.5 - Math.sin(u * Math.PI * 2.5) * 0.34;
      return { x, z, color: '#a855f7', tag: 'R\u2192L' };
    }
    if (presetId === 'zoomthrough') {
      return { x: 0, z: 0.1 + u * 0.82, color: '#38bdf8', tag: 'ZOOM IN' };
    }
    if (presetId === 'pullback') {
      return { x: 0, z: 0.92 - u * 0.82, color: '#fbbf24', tag: 'ZOOM OUT' };
    }
    if (presetId === 'slalom') {
      return { x: Math.sin(u * Math.PI * 3.5) * 0.68, z: 0.1 + u * 0.82, color: '#f472b6', tag: 'SLALOM' };
    }
    if (presetId === 'orbit') {
      return {
        x: Math.sin(u * Math.PI * 2) * 0.68,
        z: 0.5 + Math.cos(u * Math.PI * 2) * 0.36,
        color: '#22d3ee',
        tag: '360\u00b0'
      };
    }
    // Check custom presets (start-point-zoom or recorded)
    const customList = (s && Array.isArray(s.customRecordedPresets)) ? s.customRecordedPresets : [];
    const found = customList.find(cp => cp.id === presetId);
    if (found) {
      if (found.presetType === 'start-point-zoom') {
        const sp = found.startPoint || { x: 0, z: 320 };
        const normStartX = Math.max(-0.75, Math.min(0.75, (sp.x || 0) / 500));
        const normStartZ = Math.max(0.12, Math.min(0.88, 1 - ((sp.z !== undefined ? sp.z : 320) + 2400) / 3600));
        const endZ = found.direction === 'out' ? 0.08 : 0.92;
        return {
          x: normStartX * (1 - u * 0.65),
          z: normStartZ + (endZ - normStartZ) * u,
          color: found.direction === 'out' ? '#c084fc' : '#34d399',
          tag: found.direction === 'out' ? 'START\u2199' : 'START\u2197'
        };
      }
      if (found.frames && found.frames.length >= 2) {
        const idx = Math.min(found.frames.length - 1, Math.floor(u * (found.frames.length - 1)));
        const f = found.frames[idx];
        const nx = Math.max(-0.8, Math.min(0.8, (f.x || 0) / 550));
        const nz = Math.max(0.08, Math.min(0.92, 1 - ((f.z !== undefined ? f.z : 0) + 2500) / 3600));
        return { x: nx, z: nz, color: '#fbbf24', tag: 'REC' };
      }
    }
    return { x: Math.sin(u * Math.PI * 2) * 0.4, z: 0.1 + u * 0.8, color: '#38bdf8', tag: '3D' };
  }

  function drawSinglePresetThumbnail(cv, animPhase) {
    if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    const w = cv.width, h = cv.height;
    const presetId = cv.dataset.presetId || 'museum-tour';
    const s = typeof spatial3DState !== 'undefined' ? spatial3DState : {};
    ctx.clearRect(0, 0, w, h);

    // 1. Draw real 3D stage snapshot background with subtle camera shift matching animPhase
    const ptNow = samplePresetTrajectoryPoint(presetId, animPhase, s);
    if (_presetThumbBgImg && _presetThumbBgImg.complete && _presetThumbBgImg.naturalWidth > 0) {
      ctx.save();
      const zoomScale = 1.06 + (ptNow.z * 0.22);
      const panX = -ptNow.x * (w * 0.11);
      const dw = w * zoomScale, dh = h * zoomScale;
      const dx = (w - dw) / 2 + panX;
      const dy = (h - dh) / 2;
      ctx.drawImage(_presetThumbBgImg, dx, dy, dw, dh);
      ctx.fillStyle = 'rgba(4, 7, 15, 0.48)';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    } else {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w * 0.7);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#04060c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Draw 3D perspective corridor lines & exhibit cards in miniature
    ctx.save();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.28)';
    ctx.lineWidth = 0.8;
    const vx = w * 0.5 - ptNow.x * 6, vy = h * 0.36;
    [
      [0, h], [w, h], [0, 0], [w, 0]
    ].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(vx, vy);
      ctx.stroke();
    });

    // Miniature 3D corridor exhibit cards at 3 depth planes
    const cardPlanes = presetId === 'center-title-through'
      ? [
          { x: -0.64, z: 0.30, col: '#f59e0b' },
          { x: 0.64, z: 0.36, col: '#06b6d4' },
          { x: -0.52, z: 0.68, col: '#ef4444' },
          { x: 0.52, z: 0.74, col: '#f59e0b' }
        ]
      : [
          { x: -0.45, z: 0.28, col: s.cardContourColor || '#f59e0b' },
          { x: 0.45, z: 0.54, col: '#38bdf8' },
          { x: -0.32, z: 0.78, col: '#c084fc' }
        ];
    cardPlanes.forEach(cp => {
      const cx = (w * 0.5) + cp.x * (w * 0.36);
      const cy = h - (cp.z * (h * 0.72));
      const cw = Math.max(8, (1 - cp.z * 0.45) * (w * 0.16));
      const ch = Math.max(6, cw * 0.68);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
      ctx.strokeStyle = cp.col;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.rect(cx - cw / 2, cy - ch / 2, cw, ch);
      ctx.fill();
      ctx.stroke();
    });

    // Draw Center Title Plate ("AWAKENING") for center-title-through preset thumbnail
    if (presetId === 'center-title-through') {
      const ty = h * 0.46;
      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 7.5px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('AWAKENING', w * 0.5, ty);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
      ctx.fillRect(w * 0.34, ty + 2.5, w * 0.32, 0.9);
    }

    // 3. Draw full camera movement trajectory curve
    const steps = 26;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const p = samplePresetTrajectoryPoint(presetId, u, s);
      const px = (w * 0.5) + p.x * (w * 0.38);
      const py = (h - 7) - p.z * (h - 15);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = ptNow.color || '#38bdf8';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = ptNow.color || '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. Draw start point marker & live animated camera position dot
    const pStart = samplePresetTrajectoryPoint(presetId, 0, s);
    const sx = (w * 0.5) + pStart.x * (w * 0.38);
    const sy = (h - 7) - pStart.z * (h - 15);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
    ctx.fill();

    const curX = (w * 0.5) + ptNow.x * (w * 0.38);
    const curY = (h - 7) - ptNow.z * (h - 15);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = ptNow.color || '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(curX, curY, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function initSpatialPresetThumbnails() {
    const h = host();
    if (!h) return;
    const canvases = Array.from(h.querySelectorAll('.spatial-preset-thumb-canvas'));
    if (!canvases.length) return;

    const renderAll = (phaseOverride) => {
      canvases.forEach((cv, idx) => {
        const pid = cv.dataset.presetId;
        const isHov = (_hoveredPresetId === pid);
        const phase = isHov && typeof phaseOverride === 'number'
          ? phaseOverride
          : ((0.38 + (idx * 0.11)) % 0.85);
        drawSinglePresetThumbnail(cv, phase);
      });
    };

    ensurePresetThumbBg(() => renderAll());
    renderAll();

    // Bind hover animation on preset cards so users can see the live motion on hover before clicking
    h.querySelectorAll('.spatial-preset-card-item, [data-act^="s-flight-preset-"]').forEach(el => {
      if (el.dataset.thumbHoverBound) return;
      el.dataset.thumbHoverBound = '1';
      const pid = el.dataset.presetCardId || (el.dataset.act && el.dataset.act.replace('s-flight-preset-', ''));
      if (!pid) return;
      el.addEventListener('pointerenter', () => {
        _hoveredPresetId = pid;
        if (_presetThumbAnimId) cancelAnimationFrame(_presetThumbAnimId);
        const t0 = performance.now();
        const step = () => {
          if (_hoveredPresetId !== pid) return;
          const u = ((performance.now() - t0) / 2600) % 1.0;
          const targetCanvases = h.querySelectorAll(`.spatial-preset-thumb-canvas[data-preset-id="${pid}"]`);
          targetCanvases.forEach(c => drawSinglePresetThumbnail(c, u));
          _presetThumbAnimId = requestAnimationFrame(step);
        };
        _presetThumbAnimId = requestAnimationFrame(step);
      });
      el.addEventListener('pointerleave', () => {
        if (_hoveredPresetId === pid) _hoveredPresetId = null;
        if (_presetThumbAnimId) {
          cancelAnimationFrame(_presetThumbAnimId);
          _presetThumbAnimId = null;
        }
        renderAll();
      });
    });
  }

  // --- Real Three.js 3D WebGL Hover Preview Renderer for Template Cards
  window.tplRenderSpatialHoverCanvas = function (fxContainer, tplId, t, _fx) {
    if (!fxContainer || typeof THREE === 'undefined' || typeof spatial3DState === 'undefined') return;
    const targetCv = fxContainer.querySelector(`#fx-spatial-live-webgl-${tplId}`);
    if (!targetCv) return;
    const st = spatial3DState;
    // Do not steal the renderer if the customizer modal is currently open and actively displaying the 3D stage
    const modalStage = document.getElementById('tpl-modal-preview-stage');
    const isModalStageOpen = !!(modalStage && modalStage.offsetParent !== null && curTpl === 'spatial-3d-motion-suite');

    if (!isModalStageOpen) {
      let offCont = getHolder().querySelector('#spatial-hover-offscreen-host');
      if (!offCont) {
        offCont = document.createElement('div');
        offCont.id = 'spatial-hover-offscreen-host';
        offCont.style.cssText = `position:absolute;left:0;top:0;width:${RW}px;height:${RH}px;`;
        getHolder().appendChild(offCont);
      }
      ensureEngine('spatial', offCont);
      if (st.renderer && st.camera) {
        if (st.renderer.domElement.width !== Math.round(RW * (st.renderer.getPixelRatio ? st.renderer.getPixelRatio() : 1))) {
          st.renderer.setSize(RW, RH);
          st.camera.aspect = RW / RH;
          st.camera.updateProjectionMatrix();
        }
        const e = entry('spatial-3d-motion-suite');
        st._is3DStageActive = false;
        st._isVideoPaused = false;
        st.flightMode = st.defaultFlightPreset || 'museum-tour';
        driveSpatial(e, t);
        if (typeof updateSpatialCameraPosition === 'function') {
          updateSpatialCameraPosition();
        }
        if (st.gridMeshes && st.gridMeshes.group && st.gridSpeed > 0) {
          const cellSpan = 10000 / Math.max(40, st.gridDensity || 180);
          const refZ = (st.currentTime * 2400 * st.gridSpeed);
          st.gridMeshes.group.position.z = refZ % cellSpan;
        }
        st.renderer.render(st.scene, st.camera);
      }
    }

    if (st.renderer && st.renderer.domElement) {
      const ctx2d = targetCv.getContext('2d');
      if (ctx2d) {
        ctx2d.clearRect(0, 0, targetCv.width, targetCv.height);
        ctx2d.drawImage(st.renderer.domElement, 0, 0, targetCv.width, targetCv.height);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheaterToggle);
  } else {
    initTheaterToggle();
  }
})();

