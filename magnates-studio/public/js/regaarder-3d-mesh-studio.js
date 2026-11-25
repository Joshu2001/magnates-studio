/* ============================================================================
   REGAARDER 3D MESH STUDIO (#7 — AI Sketch -> 3D Render -> Texturing, Holes & Sculpting)
   Uses Three.js r128 + OrbitControls already loaded in index.html.
   ============================================================================ */
(function initRegaarder3DMeshStudio() {
  if (window.Regaarder3DMeshStudio) return;

  let activeSession = null;

  function makeProceduralTexture(kind) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d');
    if (kind === 'carbon') {
      g.fillStyle = '#1e293b';
      g.fillRect(0, 0, 256, 256);
      g.fillStyle = '#334155';
      for (let y = 0; y < 256; y += 16) {
        for (let x = 0; x < 256; x += 16) {
          if (((x + y) / 16) % 2 === 0) g.fillRect(x, y, 8, 8);
        }
      }
    } else if (kind === 'metal') {
      const grad = g.createLinearGradient(0, 0, 256, 256);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#e2e8f0');
      grad.addColorStop(1, '#64748b');
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
      g.strokeStyle = 'rgba(255,255,255,0.12)';
      for (let y = 0; y < 256; y += 3) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke();
      }
    } else if (kind === 'glass') {
      const grad = g.createRadialGradient(128, 128, 12, 128, 128, 160);
      grad.addColorStop(0, '#ddd6fe');
      grad.addColorStop(1, '#6d28d9');
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
    } else {
      g.fillStyle = '#c4b5fd';
      g.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function buildShapeFromBlueprint(bp) {
    const shape = new THREE.Shape();
    if (Array.isArray(bp.contourPoints) && bp.contourPoints.length >= 3) {
      shape.moveTo(bp.contourPoints[0][0], bp.contourPoints[0][1]);
      for (let i = 1; i < bp.contourPoints.length; i++) {
        shape.lineTo(bp.contourPoints[i][0], bp.contourPoints[i][1]);
      }
      shape.closePath();
    } else if (bp.baseShape === 'circle') {
      shape.absarc(0, 0, 1.15, 0, Math.PI * 2, false);
    } else if (bp.baseShape === 'hex') {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const px = Math.cos(a) * 1.15;
        const py = Math.sin(a) * 1.15;
        if (i === 0) shape.moveTo(px, py);
        else shape.lineTo(px, py);
      }
      shape.closePath();
    } else {
      const w = 2.2, h = 1.45, r = 0.22;
      const x = -w / 2, y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
    }

    (bp.holes || []).forEach((hole) => {
      const path = new THREE.Path();
      path.absarc(hole.x || 0, hole.y || 0, hole.radius || 0.3, 0, Math.PI * 2, true);
      shape.holes.push(path);
    });
    return shape;
  }

  function close() {
    if (!activeSession) return;
    const s = activeSession;
    activeSession = null;
    if (s.rafId) cancelAnimationFrame(s.rafId);
    if (s.renderer) s.renderer.dispose();
    if (s.rootEl) s.rootEl.remove();
    if (s.hiddenEls) s.hiddenEls.forEach(({ el, prev }) => { el.style.display = prev; });
  }

  function open(stageContainer, blueprint = {}, opts = {}) {
    close();
    const host = stageContainer || document.getElementById('tpl-modal-preview-stage-container');
    if (!host || typeof THREE === 'undefined') return null;

    const bp = {
      title: blueprint.title || '3D Concept Mesh',
      baseShape: blueprint.baseShape || 'rounded-rect',
      contourPoints: Array.isArray(blueprint.contourPoints) ? blueprint.contourPoints : [],
      depth: blueprint.depth || 0.55,
      bevelSize: blueprint.bevelSize || 0.08,
      texture: blueprint.texture || 'clay',
      color: blueprint.color || '#a78bfa',
      holes: Array.isArray(blueprint.holes) ? blueprint.holes.map((h) => ({ ...h })) : []
    };

    const hiddenEls = Array.from(host.children).map((ch) => ({ el: ch, prev: ch.style.display }));
    hiddenEls.forEach(({ el }) => { el.style.display = 'none'; });

    const rootEl = document.createElement('div');
    rootEl.className = 'rg-3d-studio-root';
    rootEl.style.cssText = 'position:relative;width:100%;height:100%;min-height:360px;display:flex;flex-direction:column;background:#09090d;border-radius:10px;overflow:hidden;';
    rootEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.08);background:#111118;">
        <div style="display:flex;align-items:center;gap:8px;">
          <strong style="font-size:12px;color:#f5f5f7;">${String(bp.title).replace(/[<>&"]/g, '')}</strong>
          <div style="display:flex;gap:3px;background:#0b0b10;padding:3px;border-radius:7px;border:1px solid rgba(255,255,255,0.06);">
            ${['orbit', 'hole', 'push', 'pull'].map((m) => `<button type="button" data-3d-mode="${m}" style="padding:4px 8px;border-radius:5px;border:none;font-size:11px;font-weight:600;cursor:pointer;background:${m === 'orbit' ? '#23232f' : 'transparent'};color:${m === 'orbit' ? '#fff' : '#a1a1b0'};">${m === 'hole' ? 'Carve Hole' : m === 'push' ? 'Sculpt Push' : m === 'pull' ? 'Sculpt Pull' : 'Orbit'}</button>`).join('')}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          ${['clay', 'metal', 'carbon', 'glass'].map((t) => `<button type="button" data-3d-tex="${t}" style="padding:4px 7px;border-radius:5px;border:1px solid rgba(255,255,255,0.1);font-size:10.5px;cursor:pointer;background:${bp.texture === t ? '#23232f' : 'transparent'};color:#e2e8f0;">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}
          <button type="button" id="rg-3d-img-tex" style="padding:4px 7px;border-radius:5px;border:1px solid rgba(255,255,255,0.1);font-size:10.5px;cursor:pointer;background:transparent;color:#e2e8f0;">+ Tex</button>
          <input type="color" id="rg-3d-color" value="${bp.color}" style="width:24px;height:24px;border:none;background:none;cursor:pointer;" />
          <button type="button" id="rg-3d-reset" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);font-size:11px;cursor:pointer;background:transparent;color:#cbd5e1;">Reset</button>
          <button type="button" id="rg-3d-apply" style="padding:5px 11px;border-radius:6px;border:none;font-size:11px;font-weight:600;cursor:pointer;background:#823cf0;color:#fff;">Apply &amp; Back</button>
        </div>
      </div>
      <div id="rg-3d-canvas-mount" style="flex:1;position:relative;min-height:0;"></div>
    `;
    host.appendChild(rootEl);

    const mount = rootEl.querySelector('#rg-3d-canvas-mount');
    const w = Math.max(420, mount.clientWidth || 720);
    const h = Math.max(300, mount.clientHeight || 420);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#09090d');
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) { controls.enableDamping = true; controls.dampingFactor = 0.08; }

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.7);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    let material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bp.color),
      map: makeProceduralTexture(bp.texture),
      roughness: bp.texture === 'metal' ? 0.25 : bp.texture === 'glass' ? 0.15 : 0.65,
      metalness: bp.texture === 'metal' ? 0.85 : 0.15,
      transparent: bp.texture === 'glass',
      opacity: bp.texture === 'glass' ? 0.82 : 1
    });

    let mesh = null;
    function rebuildMesh() {
      if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); }
      const shape = buildShapeFromBlueprint(bp);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: bp.depth,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 3,
        bevelSize: bp.bevelSize,
        bevelThickness: bp.bevelSize,
        curveSegments: 24
      });
      geo.center();
      mesh = new THREE.Mesh(geo, material);
      scene.add(mesh);
    }
    rebuildMesh();

    let mode = 'orbit';
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let sculpting = false;

    function updatePointer(ev) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function sculptAt(ev, dirSign) {
      if (!mesh) return;
      updatePointer(ev);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(mesh, false);
      if (!hits.length) return;
      const hitPt = hits[0].point;
      const pos = mesh.geometry.attributes.position;
      const norm = mesh.geometry.attributes.normal;
      const radius = 0.55;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
        const dist = Math.hypot(vx - hitPt.x, vy - hitPt.y, vz - hitPt.z);
        if (dist < radius) {
          const falloff = (1 - dist / radius) * 0.045 * dirSign;
          pos.setXYZ(
            i,
            vx + norm.getX(i) * falloff,
            vy + norm.getY(i) * falloff,
            vz + norm.getZ(i) * falloff
          );
        }
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    }

    renderer.domElement.addEventListener('pointerdown', (ev) => {
      if (mode === 'hole') {
        updatePointer(ev);
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObject(mesh, false);
        if (hits.length) {
          bp.holes.push({ x: hits[0].point.x, y: hits[0].point.y, radius: 0.24 });
          rebuildMesh();
        }
      } else if (mode === 'push' || mode === 'pull') {
        sculpting = true;
        sculptAt(ev, mode === 'push' ? 1 : -1);
      }
    });
    renderer.domElement.addEventListener('pointermove', (ev) => {
      if (!sculpting || (mode !== 'push' && mode !== 'pull')) return;
      sculptAt(ev, mode === 'push' ? 1 : -1);
    });
    window.addEventListener('pointerup', () => { sculpting = false; });

    rootEl.querySelectorAll('[data-3d-mode]').forEach((btn) => {
      btn.onclick = () => {
        mode = btn.getAttribute('data-3d-mode');
        if (controls) controls.enabled = (mode === 'orbit');
        rootEl.querySelectorAll('[data-3d-mode]').forEach((b) => {
          b.style.background = b === btn ? '#23232f' : 'transparent';
          b.style.color = b === btn ? '#fff' : '#a1a1b0';
        });
      };
    });

    rootEl.querySelectorAll('[data-3d-tex]').forEach((btn) => {
      btn.onclick = () => {
        const texKind = btn.getAttribute('data-3d-tex');
        bp.texture = texKind;
        material.map = makeProceduralTexture(texKind);
        material.roughness = texKind === 'metal' ? 0.25 : texKind === 'glass' ? 0.15 : 0.65;
        material.metalness = texKind === 'metal' ? 0.85 : 0.15;
        material.transparent = texKind === 'glass';
        material.opacity = texKind === 'glass' ? 0.82 : 1;
        material.needsUpdate = true;
        rootEl.querySelectorAll('[data-3d-tex]').forEach((b) => { b.style.background = b === btn ? '#23232f' : 'transparent'; });
      };
    });

    rootEl.querySelector('#rg-3d-color').oninput = (e) => {
      bp.color = e.target.value;
      material.color.set(bp.color);
    };
    rootEl.querySelector('#rg-3d-img-tex').onclick = () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const tex = new THREE.Texture(img);
            tex.needsUpdate = true;
            material.map = tex;
            material.needsUpdate = true;
          };
          img.src = ev.target.result;
        };
        r.readAsDataURL(f);
      };
      inp.click();
    };
    rootEl.querySelector('#rg-3d-reset').onclick = () => {
      bp.holes = [];
      rebuildMesh();
    };
    rootEl.querySelector('#rg-3d-apply').onclick = () => {
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL('image/png');
      if (window.topCustomizerState) {
        window.topCustomizerState.primaryUrl = dataUrl;
        if (typeof window.renderCustomizerFrameAtTime === 'function') window.renderCustomizerFrameAtTime(0);
      }
      if (typeof opts.onApply === 'function') opts.onApply(dataUrl, bp);
      close();
    };

    const session = { rootEl, hiddenEls, renderer, rafId: 0, blueprint: bp };
    activeSession = session;
    function animate() {
      if (activeSession !== session) return;
      session.rafId = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    animate();
    return session;
  }

  window.Regaarder3DMeshStudio = {
    open,
    close,
    isOpen: () => !!activeSession
  };
})();
