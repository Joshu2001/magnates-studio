/* Inspector "3D Controls" for 3D Spatial Motion + 3D Document & Paper FX.
   Runs inside the unified template customizer (#modal-top-template-customizer).
   - Video mode: CSS hover-effect engine driven by the customizer clock, with tilt/speed/zoom + text editing.
   - 3D mode: the real Three.js engines mounted into the stage, with full camera / layer / FX controls. */
(function () {
  const HOST_ID = 'tpl-modal-3d-controls';
  const kindOf = (id) => id === 'spatial-3d-motion-suite' ? 'spatial' : id === 'document-3d-fx-engine' ? 'doc' : null;

  window.tpl3DFx = { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 };
  const modeByTpl = {};
  const videoNodes = {};      // tplId -> { defaultText: textNode }
  const videoOverrides = {};  // tplId -> { defaultText: customText }
  let lastKey = '';
  let openLayerIdx = -1;
  let lastPlaying = true;
  let lastSeq = 0;
  let resizeObs = null;

  const getMode = (id) => modeByTpl[id] || 'video';
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const stateOf = (k) => k === 'spatial' ? spatial3DState : document3DFXState;

  // ---------- small UI builders ----------
  const lbl = 'font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.6px;';
  const row = (key, label, min, max, step, val, fmt) => `
    <div style="display:flex;flex-direction:column;gap:2px;">
      <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#94a3b8;">
        <span>${label}</span><span data-val-for="${key}" style="color:#c084fc;font-family:monospace;">${fmt ? fmt(val) : val}</span>
      </div>
      <input type="range" data-k="${key}" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%;accent-color:#a855f7;height:3px;cursor:pointer;" />
    </div>`;
  const txt = (key, label, val, area) => `
    <label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:#94a3b8;">${label}
      ${area
        ? `<textarea data-k="${key}" rows="3" style="background:#161926;border:1px solid rgba(255,255,255,.1);border-radius:6px;color:#e2e8f0;padding:5px 7px;font-size:11px;resize:vertical;">${esc(val)}</textarea>`
        : `<input type="text" data-k="${key}" value="${esc(val)}" style="background:#161926;border:1px solid rgba(255,255,255,.1);border-radius:6px;color:#e2e8f0;padding:5px 7px;font-size:11px;" />`}
    </label>`;
  const btn = (key, label, on) => `<button type="button" data-act="${key}" style="padding:5px 8px;font-size:10.5px;font-weight:600;border-radius:6px;cursor:pointer;border:1px solid ${on ? 'rgba(168,85,247,.6)' : 'rgba(255,255,255,.1)'};background:${on ? 'rgba(168,85,247,.22)' : 'rgba(255,255,255,.05)'};color:${on ? '#e9d5ff' : '#cbd5e1'};">${label}</button>`;
  const section = (title, inner) => `<div style="display:flex;flex-direction:column;gap:7px;"><span style="${lbl}">${title}</span>${inner}</div>`;

  // ---------- host ----------
  function host() { return document.getElementById(HOST_ID); }

  function build(tplId) {
    const h = host();
    const k = kindOf(tplId);
    if (!h) return;
    if (!k) { h.style.display = 'none'; h.innerHTML = ''; return; }
    h.style.display = 'flex';
    const mode = getMode(tplId);
    const fx = window.tpl3DFx;
    let html = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="${lbl}">3D Controls</span>
        <div style="display:flex;gap:3px;background:rgba(18,19,28,.9);padding:2px;border-radius:8px;border:1px solid rgba(255,255,255,.08);">
          <button type="button" data-act="mode-video" style="padding:3px 10px;font-size:10.5px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:${mode === 'video' ? 'rgba(168,85,247,.35)' : 'transparent'};color:${mode === 'video' ? '#fff' : '#94a3b8'};">▶ Video</button>
          <button type="button" data-act="mode-3d" style="padding:3px 10px;font-size:10.5px;font-weight:700;border-radius:6px;border:none;cursor:pointer;background:${mode === '3d' ? 'rgba(168,85,247,.35)' : 'transparent'};color:${mode === '3d' ? '#fff' : '#94a3b8'};">⬡ 3D</button>
        </div>
      </div>`;

    if (mode === 'video') {
      html += section('Motion', [
        row('v-speed', 'Playback Speed', 0.2, 3, 0.1, fx.speed, v => v.toFixed(1) + 'x'),
        row('v-pitch', 'Tilt Pitch (X)', -40, 40, 1, fx.pitch, v => v + '°'),
        row('v-yaw', 'Rotation Yaw (Y)', -40, 40, 1, fx.yaw, v => v + '°'),
        row('v-roll', 'Roll (Z)', -30, 30, 1, fx.roll, v => v + '°'),
        row('v-zoom', 'Zoom / Depth', 0.6, 1.6, 0.05, fx.zoom, v => v.toFixed(2) + 'x'),
        `<button type="button" data-act="v-reset" style="${'padding:5px;font-size:10.5px;border-radius:6px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;'}">Reset Motion</button>`
      ].join(''));
      const nodes = videoNodes[tplId] || {};
      const ov = videoOverrides[tplId] || {};
      const fields = Object.keys(nodes).map((def, i) => txt('vt-' + i, i === 0 ? 'Text Element 1' : 'Text Element ' + (i + 1), ov[def] != null ? ov[def] : def)).join('');
      html += section('Text Elements', fields || '<span style="font-size:10.5px;color:#64748b;">Text appears once the preview starts.</span>');
    } else if (k === 'spatial') {
      const s = spatial3DState;
      html += section('Camera Rig', [
        `<select data-k="flight" style="background:#161926;border:1px solid rgba(255,255,255,.1);border-radius:6px;color:#e2e8f0;padding:5px;font-size:11px;">
          ${['zoomthrough:Zoom-Through', 'pullback:Pullback Reveal', 'orbit:360° Orbit'].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${s.flightMode === v ? 'selected' : ''}>${n}</option>`; }).join('')}
        </select>`,
        row('s-speed', 'Zoom Speed (Z-Velocity)', 0.2, 4, 0.1, s.camSpeed, v => v.toFixed(1) + 'x'),
        row('s-drift', 'X/Y Motion Drift', 0, 100, 1, s.camDrift, v => v + '%'),
        row('s-fov', 'Vertigo / FOV Warp', 30, 90, 1, s.fovWarp, v => v + '°'),
        row('s-pitch', 'Tilt Pitch (X)', -30, 30, 1, s.camPitch, v => v + '°'),
        row('s-yaw', 'Rotation Yaw (Y)', -30, 30, 1, s.camYaw, v => v + '°')
      ].join(''));
      html += section('Atmosphere', [
        row('s-fog', 'Fog Density', 0, 100, 1, s.fogDensity, v => v + '%'),
        row('s-light', 'Ambient Glow', 20, 200, 1, s.lightIntensity, v => v + '%'),
        `<div style="display:flex;gap:6px;">${btn('s-grid', '⊞ Floor Grid', s.gridVisible)}${btn('s-dust', '✦ Dust', s.dustVisible)}</div>`
      ].join(''));
      html += section('Presets', `<div style="display:flex;gap:6px;flex-wrap:wrap;">${['docu-essay:Docu-Essay', 'cyber-matrix:Cyber Matrix', 'philosophy:Philosophy'].map(o => { const [v, n] = o.split(':'); return btn('preset-' + v, n, s.activePreset === v); }).join('')}</div>`);
      html += section('3D Layers', `<div id="tpl3d-layers" style="display:flex;flex-direction:column;gap:6px;"></div><button type="button" data-act="s-add" style="padding:5px;font-size:10.5px;border-radius:6px;border:1px dashed rgba(168,85,247,.5);background:transparent;color:#d8b4fe;cursor:pointer;">+ Add Text Plane</button>`);
    } else {
      const d = document3DFXState;
      html += section('Camera', [
        row('d-pitch', 'Tilt Pitch (X)', 0, 75, 1, Math.round(d.pitch), v => v + '°'),
        row('d-yaw', 'Rotation Yaw (Y)', -60, 60, 1, Math.round(d.yaw), v => v + '°'),
        row('d-roll', 'Roll (Z)', -45, 45, 1, Math.round(d.roll), v => v + '°'),
        row('d-dist', 'Camera Distance', 20, 110, 1, Math.round(d.dist), v => v),
        row('d-parallax', 'Parallax Strength', 0, 4, 0.1, d.parallax, v => v.toFixed(1) + 'x'),
        row('d-speed', 'Animation Speed', 0.3, 3, 0.1, d.playbackSpeed || 1, v => v.toFixed(1) + 'x')
      ].join(''));
      html += section('Paper', `<select data-k="d-paper" style="background:#161926;border:1px solid rgba(255,255,255,.1);border-radius:6px;color:#e2e8f0;padding:5px;font-size:11px;">
          ${['aged:Aged Newsprint', 'stark:Stark White', 'darkmode:Dark Mode', 'manuscript:Manuscript'].map(o => { const [v, n] = o.split(':'); return `<option value="${v}" ${d.paperStyle === v ? 'selected' : ''}>${n}</option>`; }).join('')}
        </select>`);
      html += section('Layers', [
        `<div style="display:flex;gap:6px;flex-wrap:wrap;">${btn('d-hl', 'Highlighter', d.enableHighlight)}${btn('d-pop', 'Pop-out Headline', d.enablePopout)}${btn('d-red', 'Redaction', d.enableRedaction)}</div>`,
        row('d-hlprog', 'Highlight Progress', 0, 100, 1, Math.round(d.hlProgress * 100), v => v + '%'),
        row('d-popelev', 'Pop-out Elevation', 0, 20, 0.5, d.popElevation, v => v),
        row('d-redwipe', 'Redaction Wipe', 0, 100, 1, Math.round(d.redactWipe * 100), v => v + '%'),
        `<label style="display:flex;align-items:center;gap:8px;font-size:10.5px;color:#94a3b8;">Highlight Color <input type="color" data-k="d-hlcolor" value="${d.highlightColor}" /></label>`
      ].join(''));
      html += section('Document Text', [
        txt('d-header', 'Masthead', d.header),
        txt('d-headline', 'Headline', d.headline),
        txt('d-dateline', 'Dateline', d.dateline),
        txt('d-body', 'Body Text', d.body, true)
      ].join(''));
    }
    h.innerHTML = html;
    if (mode === '3d' && k === 'spatial') renderSpatialLayers();
  }

  // ---------- spatial layer list / editing ----------
  function renderSpatialLayers() {
    const box = document.getElementById('tpl3d-layers');
    if (!box) return;
    const list = spatial3DState.elements3D || [];
    box.innerHTML = list.map((m, i) => {
      const u = m.userData || {};
      const open = openLayerIdx === i;
      const color = u.color || '#f59e0b';
      let editor = '';
      if (open) {
        editor = `<div style="display:flex;flex-direction:column;gap:6px;padding:8px 2px 2px;">
          ${txt('l-title-' + i, 'Title', u.title || '')}
          ${u.type === 'card' ? txt('l-sub-' + i, 'Subtitle', u.subtitle || '') : ''}
          ${u.type !== 'text' ? txt('l-body-' + i, u.type === 'code' ? 'Code Lines' : 'Body', u.body || u.text || '', true) : ''}
          ${row('l-z-' + i, 'Depth (Z)', -5000, 1500, 10, Math.round(m.position.z), v => v)}
          ${row('l-x-' + i, 'Position X', -1500, 1500, 10, Math.round(m.position.x), v => v)}
          ${row('l-y-' + i, 'Position Y', -1000, 1000, 10, Math.round(m.position.y), v => v)}
          ${row('l-scale-' + i, 'Scale', 0.3, 3, 0.05, u.scale || 1, v => Number(v).toFixed(2) + 'x')}
          <label style="display:flex;align-items:center;gap:8px;font-size:10.5px;color:#94a3b8;">Color <input type="color" data-k="l-color-${i}" value="${/^#[0-9a-f]{6}$/i.test(color) ? color : '#f59e0b'}" /></label>
        </div>`;
      }
      return `<div style="background:#121520;border:1px solid ${open ? 'rgba(168,85,247,.55)' : 'rgba(255,255,255,.08)'};border-radius:8px;padding:7px 9px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <div data-act="l-toggle-${i}" style="display:flex;align-items:center;gap:7px;cursor:pointer;overflow:hidden;flex:1;">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>
            <span style="font-size:11px;font-weight:700;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(u.title)}</span>
            <span style="font-size:9.5px;color:#64748b;font-family:monospace;">Z:${Math.round(m.position.z)}</span>
          </div>
          <button type="button" data-act="l-del-${i}" style="background:transparent;border:none;color:#f43f5e;cursor:pointer;font-size:12px;">✕</button>
        </div>${editor}</div>`;
    }).join('') || '<span style="font-size:10.5px;color:#64748b;">No planes.</span>';
  }

  function rebuildSpatialLayer(i, patch) {
    const s = spatial3DState;
    const old = s.elements3D[i];
    if (!old || !s.scene) return;
    const u = old.userData;
    const item = Object.assign({}, u, { x: old.position.x, y: old.position.y, z: old.position.z }, patch);
    if (item.type === 'code') item.text = item.body = patch.body != null ? patch.body : (u.body || u.text);
    const mesh = item.type === 'text' ? createSpatialTextPlane(item)
      : item.type === 'card' ? createSpatialCardPlane(item) : createSpatialCodePlane(item);
    if (!mesh) return;
    mesh.userData.initialZ = item.z;
    s.scene.remove(old);
    if (old.geometry) old.geometry.dispose();
    if (old.material) { if (old.material.map) old.material.map.dispose(); old.material.dispose(); }
    s.scene.add(mesh);
    s.elements3D[i] = mesh;
  }

  function setVal(key, v, fmtv) {
    const el = host()?.querySelector(`[data-val-for="${key}"]`);
    if (el) el.textContent = fmtv;
  }

  // ---------- events ----------
  function onInput(e) {
    const el = e.target;
    const key = el.dataset && el.dataset.k;
    if (!key) return;
    const tplId = topCustomizerState.currentTpl && topCustomizerState.currentTpl.id;
    const v = el.type === 'range' ? parseFloat(el.value) : el.value;
    const fx = window.tpl3DFx;
    const s = spatial3DState, d = document3DFXState;
    const lab = (txtv) => setVal(key, v, txtv);

    // video-mode
    if (key === 'v-speed') { fx.speed = v; lab(v.toFixed(1) + 'x'); }
    else if (key === 'v-pitch') { fx.pitch = v; lab(v + '°'); }
    else if (key === 'v-yaw') { fx.yaw = v; lab(v + '°'); }
    else if (key === 'v-roll') { fx.roll = v; lab(v + '°'); }
    else if (key === 'v-zoom') { fx.zoom = v; lab(v.toFixed(2) + 'x'); }
    else if (key.startsWith('vt-')) {
      const nodes = videoNodes[tplId] || {};
      const def = Object.keys(nodes)[parseInt(key.slice(3), 10)];
      if (def != null && nodes[def]) {
        (videoOverrides[tplId] = videoOverrides[tplId] || {})[def] = v;
        nodes[def].nodeValue = v;
      }
    }
    // spatial 3D
    else if (key === 'flight') { s.flightMode = v; resetSpatialCameraPath(); }
    else if (key === 's-speed') { s.camSpeed = v; lab(v.toFixed(1) + 'x'); }
    else if (key === 's-drift') { s.camDrift = v; lab(v + '%'); }
    else if (key === 's-fov') { s.fovWarp = v; lab(v + '°'); if (s.camera) { s.camera.fov = v; s.camera.updateProjectionMatrix(); } }
    else if (key === 's-pitch') { s.camPitch = v; lab(v + '°'); }
    else if (key === 's-yaw') { s.camYaw = v; lab(v + '°'); }
    else if (key === 's-fog') { s.fogDensity = v; lab(v + '%'); if (s.scene && s.scene.fog) s.scene.fog.density = 0.0001 + (v / 100) * 0.0008; }
    else if (key === 's-light') { s.lightIntensity = v; lab(v + '%'); if (s.ambientLight) s.ambientLight.intensity = (v / 100) * 0.95; }
    else if (key.startsWith('l-')) {
      const m = key.match(/^l-(title|sub|body|z|x|y|scale|color)-(\d+)$/);
      if (m) {
        const i = parseInt(m[2], 10);
        const map = { title: 'title', sub: 'subtitle', body: 'body', z: 'z', x: 'x', y: 'y', scale: 'scale', color: 'color' };
        const field = map[m[1]];
        const val = ['z', 'x', 'y', 'scale'].includes(field) ? parseFloat(v) : v;
        const patch = {}; patch[field] = val;
        if (field === 'body') patch.text = val;
        rebuildSpatialLayer(i, patch);
        if (['z', 'x', 'y', 'scale'].includes(field)) lab(field === 'scale' ? Number(val).toFixed(2) + 'x' : String(Math.round(val)));
      }
    }
    // document 3D
    else if (key === 'd-pitch') { d.pitch = v; lab(v + '°'); updateDocFXCameraTransform(); }
    else if (key === 'd-yaw') { d.yaw = v; lab(v + '°'); updateDocFXCameraTransform(); }
    else if (key === 'd-roll') { d.roll = v; lab(v + '°'); updateDocFXCameraTransform(); }
    else if (key === 'd-dist') { d.dist = v; lab(String(v)); updateDocFXCameraTransform(); }
    else if (key === 'd-parallax') { d.parallax = v; lab(v.toFixed(1) + 'x'); updateDocFXCameraTransform(); }
    else if (key === 'd-speed') { d.playbackSpeed = v; lab(v.toFixed(1) + 'x'); }
    else if (key === 'd-paper') { d.paperStyle = v; renderDocFXTexture(); }
    else if (key === 'd-hlprog') { d.hlProgress = v / 100; lab(v + '%'); renderDocFXTexture(); }
    else if (key === 'd-popelev') { d.popElevation = v; lab(String(v)); if (d.popoutMesh) d.popoutMesh.position.z = v * 0.4; }
    else if (key === 'd-redwipe') { d.redactWipe = v / 100; lab(v + '%'); renderDocFXTexture(); }
    else if (key === 'd-hlcolor') { d.highlightColor = v; renderDocFXTexture(); }
    else if (key === 'd-header') { d.header = v; renderDocFXTexture(); }
    else if (key === 'd-headline') { d.headline = v; renderDocFXTexture(); }
    else if (key === 'd-dateline') { d.dateline = v; renderDocFXTexture(); }
    else if (key === 'd-body') { d.body = v; renderDocFXTexture(); }
  }

  function onClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    const tplId = topCustomizerState.currentTpl && topCustomizerState.currentTpl.id;
    const k = kindOf(tplId);
    const s = spatial3DState, d = document3DFXState;

    if (act === 'mode-video' || act === 'mode-3d') {
      modeByTpl[tplId] = act === 'mode-3d' ? '3d' : 'video';
      lastKey = '';
      renderTopTemplatePreviewStage();
      return;
    }
    if (act === 'v-reset') { Object.assign(window.tpl3DFx, { speed: 1, pitch: 0, yaw: 0, roll: 0, zoom: 1 }); build(tplId); return; }
    if (act === 's-grid') { s.gridVisible = !s.gridVisible; if (s.floorGrid) s.floorGrid.visible = s.gridVisible; build(tplId); return; }
    if (act === 's-dust') { s.dustVisible = !s.dustVisible; if (s.particlesMesh) s.particlesMesh.visible = s.dustVisible; build(tplId); return; }
    if (act.startsWith('preset-')) { loadSpatialPreset(act.slice(7)); openLayerIdx = -1; build(tplId); return; }
    if (act === 's-add') {
      const item = { type: 'text', id: String(Date.now()), title: 'NEW TEXT', x: 0, y: 0, z: -600, color: '#f59e0b', scale: 1 };
      const mesh = createSpatialTextPlane(item);
      if (mesh && s.scene) { s.scene.add(mesh); s.elements3D.push(mesh); openLayerIdx = s.elements3D.length - 1; renderSpatialLayers(); }
      return;
    }
    if (act.startsWith('l-toggle-')) { const i = parseInt(act.slice(9), 10); openLayerIdx = openLayerIdx === i ? -1 : i; renderSpatialLayers(); return; }
    if (act.startsWith('l-del-')) { removeSpatialLayer(parseInt(act.slice(6), 10)); openLayerIdx = -1; renderSpatialLayers(); return; }
    if (act === 'd-hl') { d.enableHighlight = !d.enableHighlight; renderDocFXTexture(); build(tplId); return; }
    if (act === 'd-pop') { d.enablePopout = !d.enablePopout; if (d.popoutMesh) d.popoutMesh.visible = d.enablePopout; build(tplId); return; }
    if (act === 'd-red') { d.enableRedaction = !d.enableRedaction; renderDocFXTexture(); build(tplId); return; }
  }

  function bindHost() {
    const h = host();
    if (!h || h.dataset.bound) return;
    h.dataset.bound = '1';
    h.addEventListener('input', onInput);
    h.addEventListener('change', onInput);
    h.addEventListener('click', onClick);
  }

  // ---------- 3D stage mount ----------
  function mount3D(stage, tplId) {
    const k = kindOf(tplId);
    const cid = k === 'spatial' ? 'spatial-threejs-container' : 'doc-threejs-container';
    stage.innerHTML = `<div id="customizer-stage-inner" style="position:absolute;inset:0;overflow:hidden;background:#07090e;"><div id="${cid}" style="position:absolute;inset:0;cursor:grab;"></div></div>`;
    const container = document.getElementById(cid);
    const st = stateOf(k);

    setTimeout(() => {
      if (!container.isConnected) return;
      if (!st.renderer) {
        if (k === 'spatial') initSpatialThreeJSEngine(); else initDocument3DFXEngine();
        if (k === 'doc') setTimeout(() => { if (window.gsap) triggerDocFXPresetAnimation('janiFlyby'); }, 200);
      } else {
        container.innerHTML = '';
        container.appendChild(st.renderer.domElement);
      }
      fit();
      if (k === 'spatial') {
        container.addEventListener('mousemove', (ev) => {
          const r = container.getBoundingClientRect();
          spatial3DState.mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
          spatial3DState.mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
        });
      }
    }, 60);

    function fit() {
      const w = container.clientWidth || 800, h = container.clientHeight || 450;
      if (st.renderer && st.camera) {
        st.camera.aspect = w / h;
        st.camera.updateProjectionMatrix();
        st.renderer.setSize(w, h);
      }
    }
    if (resizeObs) resizeObs.disconnect();
    if (window.ResizeObserver) { resizeObs = new ResizeObserver(fit); resizeObs.observe(container); }
  }

  function teardown3D() {
    if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
    [spatial3DState, document3DFXState].forEach(st => {
      if (st.animId) { cancelAnimationFrame(st.animId); st.animId = null; }
      if (st.renderer) { try { st.renderer.dispose(); } catch (_) { } }
      st.renderer = null; st.scene = null; st.camera = null;
    });
    document3DFXState.controls = null;
    document3DFXState.documentMesh = null;
    document3DFXState.popoutMesh = null;
    document3DFXState.textureMap = null;
    if (document3DFXState.animTween) { document3DFXState.animTween.kill(); document3DFXState.animTween = null; }
    if (window.gsap) gsap.globalTimeline.paused(false);
    spatial3DState.isPlaying = true;
    lastKey = '';
  }

  function collectVideoNodes(stage, tplId) {
    const fxc = stage.querySelector('#fx-container-' + tplId);
    const nodes = {};
    if (fxc) {
      const walker = document.createTreeWalker(fxc, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.nodeValue.trim();
        if (!t || /THREE\.JS 3D SUITE/.test(t)) continue;
        if (!(t in nodes)) { nodes[t] = n; n.nodeValue = t; }
      }
    }
    videoNodes[tplId] = nodes;
    const ov = videoOverrides[tplId] || {};
    Object.keys(ov).forEach(def => { if (nodes[def]) nodes[def].nodeValue = ov[def]; });
  }

  // ---------- public hooks used by app.js ----------
  window.tpl3DUse3D = (tplId) => !!kindOf(tplId) && getMode(tplId) === '3d';
  window.tpl3DMountStage = mount3D;

  window.tpl3DAfterVideoStage = function (stage, tplId) {
    if (!kindOf(tplId)) return;
    const before = Object.keys(videoNodes[tplId] || {}).length;
    collectVideoNodes(stage, tplId);
    if (before !== Object.keys(videoNodes[tplId]).length || !host().innerHTML) { lastKey = ''; window.tpl3DSync(tplId); }
  };

  window.tpl3DSync = function (tplId) {
    bindHost();
    const key = tplId + '|' + getMode(tplId);
    if (key === lastKey) return;
    lastKey = key;
    openLayerIdx = -1;
    build(tplId);
  };

  window.tpl3DOnFrame = function (seqTime) {
    const tplId = topCustomizerState.currentTpl && topCustomizerState.currentTpl.id;
    const k = kindOf(tplId);
    if (!k || getMode(tplId) !== '3d') return;
    const playing = topCustomizerState.isPlaying;
    if (k === 'spatial') spatial3DState.isPlaying = playing;
    else {
      if (playing !== lastPlaying && window.gsap) gsap.globalTimeline.paused(!playing);
      if (seqTime < lastSeq - 0.5 && playing && window.gsap && document3DFXState.renderer) triggerDocFXPresetAnimation('janiFlyby');
    }
    lastPlaying = playing;
    lastSeq = seqTime;
  };

  window.tpl3DOnReplay = function () {
    const tplId = topCustomizerState.currentTpl && topCustomizerState.currentTpl.id;
    const k = kindOf(tplId);
    if (!k || getMode(tplId) !== '3d') return;
    if (k === 'spatial') resetSpatialCameraPath();
    else if (window.gsap && document3DFXState.renderer) { gsap.globalTimeline.paused(false); triggerDocFXPresetAnimation('janiFlyby'); }
  };

  window.tpl3DOnClose = function () {
    teardown3D();
    const h = host();
    if (h) { h.style.display = 'none'; h.innerHTML = ''; }
  };
})();
