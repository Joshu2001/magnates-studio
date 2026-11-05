/**
 * Regaarder Studio — Native 3D / V108 Surface Builder Engine (Phase 3)
 * Template ID: 'regaarder-native3d-surface-builder'
 *
 * Ports the V108 Native 3D Character & Surface Builder from Regaarder-Motion
 * (character-editor-v97.html, native3d-v97/, native3d-director-v97.js) into
 * Magnates Studio's unified stage, 4-Tab Contextual Inspector
 * (Content, Motion, Look, Effects + Advanced Controls), and Universal Contextual Toolbar.
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'regaarder-native3d-surface-builder';
  window.REGAARDER_NATIVE3D_TEMPLATE_ID = TEMPLATE_ID;

  const PRESET_SCENES = {
    blue: {
      id: 'blue',
      label: '01 Blue & Cream Coach',
      description: 'Blue figure and cream coach with tailored fedora hat and dynamic 3D studio lighting',
      background: '#151322',
      primaryColor: '#137cba',
      secondaryColor: '#dedbca'
    },
    handshake: {
      id: 'handshake',
      label: '02 Handshake · Paired Contact',
      description: 'Two anatomical characters with finger-contact grip solver & studio softboxes',
      background: '#141820',
      primaryColor: '#137cba',
      secondaryColor: '#dedbca'
    },
    checkpoint: {
      id: 'checkpoint',
      label: '03 14:55 Crimson Seated & Coach',
      description: 'Seated crimson figure, cream coach with brimmed hat, desk assembly & depth smoke',
      background: '#220406',
      primaryColor: '#9d1514',
      secondaryColor: '#eee9da'
    },
    team: {
      id: 'team',
      label: '04 Three Red Players Formation',
      description: 'Trio formation with independent bone poses, wardrobe & rim lighting',
      background: '#17080a',
      primaryColor: '#b91c1c',
      secondaryColor: '#f8fafc'
    },
    humanoid: {
      id: 'humanoid',
      label: '05 Anatomical Mannequin Studio',
      description: 'Single mannequin for multiresolution sculpting, UV projection & vertex painting',
      background: '#11151b',
      primaryColor: '#7d8c9d',
      secondaryColor: '#343e4b'
    }
  };

  const state = {
    preset: 'blue',
    foundation: 'male', // 'male' | 'female'
    activeActor: 'actor_primary',
    activeSurface: 'body', // 'body' | 'head' | 'shirt' | 'trousers' | 'hat-brim' | 'hat-crown'
    pose: 'standing', // 'standing' | 'seated' | 'folded' | 'lean'
    headSize: 1.06,
    shoulderWidth: 1.0,
    armLength: 1.0,
    legLength: 1.0,
    leanAngle: 0,
    handCurl: 0.15,
    cameraYaw: 18,
    cameraPitch: 12,
    cameraZoom: 1.0,
    cameraFov: 32,
    autoOrbit: true,
    orbitSpeed: 0.45,
    exposure: 0.92,
    ambientIntensity: 0.65,
    keyLightIntensity: 3.0,
    keyLightColor: '#fff3e1',
    rimLightIntensity: 2.0,
    rimLightColor: '#dce6ff',
    backgroundHex: '#141820',
    shirtVisible: true,
    shirtColor: '#137cba',
    trousersVisible: true,
    trousersColor: '#343e4b',
    hatVisible: true,
    hatColor: '#dedbca',
    roughness: 0.46,
    metalness: 0.05,
    wireframe: false,
    // V108 Surface Builder controls
    multiresLevels: 1,
    multiresEditLevel: 1,
    multiresDisplayLevel: 1,
    uvProjection: 'cylindrical', // 'xy' | 'xz' | 'yz' | 'cylindrical'
    uvScale: 1.0,
    uvRotation: 0,
    vertexPaintColor: '#c38d62',
    vertexPaintEnabled: false,
    pbrSlot: 'color', // 'color' | 'roughness' | 'metalness' | 'normal' | 'bump'
    normalStrength: 1.0,
    bumpHeight: 0.001,
    smokeEnabled: true,
    smokeDensity: 0.85,
    actorOffsets: {
      n3d_actor_primary: { x: 0, y: 0, rot: 0, opacity: 1, color: '#137cba' },
      n3d_actor_secondary: { x: 0, y: 0, rot: 0, opacity: 1, color: '#eee9da' },
      n3d_prop_hat: { x: 0, y: 0, rot: 0, opacity: 1, color: '#dedbca' },
      n3d_prop_desk: { x: 0, y: 0, rot: 0, opacity: 1, color: '#e4e2da' }
    },
    nativeReady: false,
    nativeLoading: false,
    nativeEngine: null,
    nativeScene: null,
    nativeData: null,
    nativeMods: null
  };

  window.REGAARDER_NATIVE3D_CONFIG = state;

  const STAGE_OBJECTS = [
    { id: 'n3d_actor_primary', name: 'Primary Humanoid Rig', variant: 'media', x: 35, y: 54, w: 26, h: 68 },
    { id: 'n3d_actor_secondary', name: 'Secondary Coach Rig', variant: 'media', x: 65, y: 52, w: 26, h: 68 },
    { id: 'n3d_prop_hat', name: 'Tailored Fedora Hat', variant: 'shape', x: 65, y: 22, w: 16, h: 14 },
    { id: 'n3d_prop_desk', name: 'Studio Props', variant: 'shape', x: 50, y: 74, w: 46, h: 24 }
  ];

  async function ensureNative3DLoaded() {
    if (state.nativeReady || state.nativeLoading) return;
    if (typeof window === 'undefined' || (navigator && navigator.userAgent && navigator.userAgent.includes('jsdom'))) return;
    state.nativeLoading = true;
    try {
      const [engineMod, sceneMod, finalMod, checkpointMod, surfaceUiMod] = await Promise.all([
        import('/native3d-v97/engine.js'),
        import('/native3d-v97/scene.js'),
        import('/native3d-v97/final-scenes.js'),
        import('/native3d-v97/checkpoint.js'),
        import('/native3d-v97/surface-ui.js')
      ]);
      const data = await engineMod.loadHumanoid();
      state.nativeData = data;
      state.nativeMods = { engineMod, sceneMod, finalMod, checkpointMod, surfaceUiMod };
      const offscreen = document.createElement('canvas');
      offscreen.width = 960;
      offscreen.height = 540;
      state.nativeEngine = new engineMod.Native3DEngine(offscreen, data, { width: 960, height: 540, cacheWorlds: false });
      rebuildNativeSceneFromPreset();
      state.nativeReady = true;
    } catch (err) {
      console.warn('[RegaarderNative3D] Using deterministic 2.5D/3D software projection:', err.message);
    } finally {
      state.nativeLoading = false;
    }
  }

  function rebuildNativeSceneFromPreset() {
    if (!state.nativeMods) return;
    const { sceneMod, finalMod, checkpointMod } = state.nativeMods;
    if (state.preset === 'blue') {
      state.nativeScene = sceneMod.createNativeScene('blue');
    } else if (state.preset === 'handshake') {
      state.nativeScene = finalMod.createFinalHandshake();
    } else if (state.preset === 'checkpoint') {
      state.nativeScene = checkpointMod.createCheckpoint3D();
    } else if (state.preset === 'team') {
      state.nativeScene = finalMod.createFinalTeam();
    } else {
      state.nativeScene = sceneMod.createNativeScene('humanoid');
    }
    syncStateToNativeScene();
  }

  function syncStateToNativeScene() {
    const sc = state.nativeScene;
    if (!sc || !Array.isArray(sc.nodes)) return;
    sc.background = state.backgroundHex;
    sc.lighting = sc.lighting || {};
    sc.lighting.exposure = state.exposure;
    sc.lighting.ambient = state.ambientIntensity;

    const cam = sc.nodes.find((n) => n.type === 'camera');
    if (cam) {
      cam.fov = state.cameraFov;
    }
    const keyLight = sc.nodes.find((n) => n.id === 'key' || (n.name && n.name.toLowerCase().includes('key')));
    if (keyLight) {
      keyLight.intensity = state.keyLightIntensity;
      keyLight.color = state.keyLightColor;
    }
    const rimLight = sc.nodes.find((n) => n.id === 'rim' || (n.name && n.name.toLowerCase().includes('rim')));
    if (rimLight) {
      rimLight.intensity = state.rimLightIntensity;
      rimLight.color = state.rimLightColor;
    }

    const humanoids = sc.nodes.filter((n) => n.type === 'humanoid');
    humanoids.forEach((h, idx) => {
      h.wireframe = !!state.wireframe;
      h.proportions = {
        headSize: state.headSize,
        neckLength: 0.95,
        shoulderWidth: state.shoulderWidth,
        armLength: state.armLength,
        legLength: state.legLength
      };
      h.shape = h.shape || {};
      h.shape.female = state.foundation === 'female' ? 1 : 0;
      if (idx === 0) {
        h.material = h.material || {};
        h.material.color = state.shirtColor;
        h.material.roughness = state.roughness;
        h.material.metalness = state.metalness;
        h.parts = h.parts || {};
        h.parts.shirt = { ...(h.parts.shirt || {}), visible: state.shirtVisible, color: state.shirtColor, roughness: state.roughness };
        h.parts.trousers = { ...(h.parts.trousers || {}), visible: state.trousersVisible, color: state.trousersColor, roughness: state.roughness };
      } else if (idx === 1) {
        h.parts = h.parts || {};
        h.parts.hat = { ...(h.parts.hat || {}), visible: state.hatVisible, color: state.hatColor };
      }
    });
  }

  // Deterministic 3D wireframe/shaded mannequin fallback renderer (also used in JSDOM or while Three.js loads)
  function renderProjectedMannequinScene(ctx, timeSec) {
    const W = 960, H = 540;
    ctx.save();

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, state.backgroundHex || '#141820');
    bgGrad.addColorStop(1, '#080b10');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Studio floor grid with perspective
    const yawRad = ((state.cameraYaw + (state.autoOrbit ? timeSec * state.orbitSpeed * 22 : 0)) * Math.PI) / 180;
    const zoom = state.cameraZoom || 1;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    const horizonY = H * 0.68;
    for (let i = -8; i <= 8; i++) {
      const xTop = W / 2 + i * 38 * zoom;
      const xBot = W / 2 + i * 115 * zoom;
      ctx.beginPath();
      ctx.moveTo(xTop, horizonY);
      ctx.lineTo(xBot, H);
      ctx.stroke();
    }
    for (let r = 1; r <= 5; r++) {
      const y = horizonY + Math.pow(r / 5, 1.4) * (H - horizonY);
      ctx.beginPath();
      ctx.moveTo(W * 0.08, y);
      ctx.lineTo(W * 0.92, y);
      ctx.stroke();
    }

    // Depth smoke plane
    if (state.smokeEnabled) {
      const smokeGrad = ctx.createRadialGradient(W * 0.48, H * 0.46, 20, W * 0.48, H * 0.46, 340);
      smokeGrad.addColorStop(0, `rgba(185, 205, 230, ${0.14 * state.smokeDensity})`);
      smokeGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = smokeGrad;
      ctx.fillRect(0, 0, W, H);
    }

    // Draw articulated anatomical figures
    const drawHumanoid = (cx, cy, scale, bodyColor, trousersColor, hasHat, hatColor, facingSign) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale * zoom, scale * zoom);

      // Contact shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 145, 52, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs / Trousers
      ctx.fillStyle = state.trousersVisible ? trousersColor : bodyColor;
      ctx.strokeStyle = state.wireframe ? '#38bdf8' : 'rgba(255,255,255,0.18)';
      ctx.lineWidth = state.wireframe ? 1.4 : 0.8;
      for (const legSign of [-1, 1]) {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(legSign * 16 - 13, 22, 26, 118 * state.legLength, 12);
        } else {
          ctx.rect(legSign * 16 - 13, 22, 26, 118 * state.legLength);
        }
        ctx.fill();
        ctx.stroke();
      }

      // Torso / Shirt
      const torsoW = 68 * state.shoulderWidth * (state.foundation === 'female' ? 0.92 : 1);
      ctx.fillStyle = state.shirtVisible ? bodyColor : '#d4d4c9';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-torsoW / 2, -78, torsoW, 106, 18);
      } else {
        ctx.rect(-torsoW / 2, -78, torsoW, 106);
      }
      ctx.fill();
      ctx.stroke();

      // Arms + Handshake / Pose
      const armReach = state.preset === 'handshake' ? facingSign * 38 : facingSign * 14;
      ctx.strokeStyle = state.shirtVisible ? bodyColor : '#d4d4c9';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(facingSign * (torsoW * 0.42), -62);
      ctx.quadraticCurveTo(facingSign * 42, -15, armReach, -4);
      ctx.stroke();

      // Head (Anatomical Oval V104)
      const headR = 26 * state.headSize;
      const headGrad = ctx.createRadialGradient(-6, -118, 4, 0, -112, headR * 1.3);
      headGrad.addColorStop(0, state.keyLightColor || '#fff3e1');
      headGrad.addColorStop(0.55, bodyColor);
      headGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.ellipse(0, -112, headR * 0.88, headR * 1.12, 0, 0, Math.PI * 2);
      ctx.fill();
      if (state.wireframe) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Tailored Brimmed Hat (V90)
      if (hasHat && state.hatVisible) {
        ctx.save();
        ctx.translate(0, -136);
        ctx.rotate(-0.08 * facingSign);
        ctx.fillStyle = hatColor || '#dedbca';
        ctx.beginPath();
        ctx.ellipse(0, 6, 44, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-24, -18, 48, 24, 8);
        } else {
          ctx.rect(-24, -18, 48, 24);
        }
        ctx.fill();
        ctx.fillStyle = '#a7a18f';
        ctx.fillRect(-24, 0, 48, 5);
        ctx.restore();
      }

      ctx.restore();
    };

    const p1 = state.actorOffsets.n3d_actor_primary || { x: 0, y: 0 };
    const p2 = state.actorOffsets.n3d_actor_secondary || { x: 0, y: 0 };
    const sway = Math.sin(yawRad) * 16;

    if (state.preset === 'humanoid') {
      drawHumanoid(W * 0.5 + p1.x + sway, H * 0.54 + p1.y, 1.22, state.shirtColor, state.trousersColor, state.hatVisible, state.hatColor, 1);
    } else if (state.preset === 'team') {
      drawHumanoid(W * 0.31 + p1.x, H * 0.55 + p1.y, 0.96, '#b91c1c', '#1e293b', false, state.hatColor, 1);
      drawHumanoid(W * 0.50, H * 0.52, 1.08, state.shirtColor, state.trousersColor, false, state.hatColor, 1);
      drawHumanoid(W * 0.69 + p2.x, H * 0.55 + p2.y, 0.96, '#991b1b', '#1e293b', false, state.hatColor, -1);
    } else {
      // Handshake or 14:55 Checkpoint pair
      if (state.preset === 'checkpoint') {
        // Desk & Chair assembly
        const deskOff = state.actorOffsets.n3d_prop_desk || { x: 0, y: 0 };
        ctx.fillStyle = '#e4e2da';
        ctx.fillRect(W * 0.36 + deskOff.x, H * 0.56 + deskOff.y, 240, 8);
        ctx.fillStyle = '#090b10';
        ctx.fillRect(W * 0.38 + deskOff.x, H * 0.56 + 8 + deskOff.y, 210, 95);
      }
      drawHumanoid(W * 0.38 + p1.x - sway * 0.4, H * 0.55 + p1.y, 1.06, state.shirtColor, state.trousersColor, false, state.hatColor, 1);
      drawHumanoid(W * 0.62 + p2.x + sway * 0.4, H * 0.54 + p2.y, 1.08, '#eee9da', '#d6d3c4', true, state.hatColor, -1);
    }

    // HUD badge for V108 Surface Builder telemetry
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(18, 16, 330, 52, 10);
    } else {
      ctx.rect(18, 16, 330, 52);
    }
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`NATIVE 3D · ${PRESET_SCENES[state.preset]?.label || 'V108 BUILDER'}`, 30, 36);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px Inter, system-ui, sans-serif';
    ctx.fillText(`Surface: ${state.activeSurface} · Multires L${state.multiresDisplayLevel} · UV: ${state.uvProjection.toUpperCase()}`, 30, 54);

    ctx.restore();
  }

  function renderNative3DCanvas(canvas, timeSec) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (state.nativeReady && state.nativeEngine && state.nativeScene) {
      try {
        syncStateToNativeScene();
        const dur = state.nativeScene.duration || 5;
        const t = Math.max(0, Number(timeSec) || 0) % dur;
        state.nativeEngine.render(state.nativeScene, t);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(state.nativeEngine.canvas, 0, 0, canvas.width, canvas.height);
        return;
      } catch (e) {
        // Fallback to projected renderer if WebGL context unavailable
      }
    }
    renderProjectedMannequinScene(ctx, timeSec || 0);
  }

  function buildNative3DStageHTML(templateId, isHover) {
    const suffix = isHover ? `hover-${templateId}` : templateId;

    const hitOverlayHtml = !isHover ? `
      <div class="rg-n3d-hit-layer" style="position:absolute;inset:0;z-index:22;pointer-events:auto;">
        ${STAGE_OBJECTS.map((obj) => `
          <div class="rg-n3d-hit-box"
               data-n3d-obj="${obj.id}"
               data-n3d-variant="${obj.variant}"
               title="${obj.name} (Click to select · Drag to orbit/reposition)"
               style="position:absolute;left:${obj.x}%;top:${obj.y}%;width:${obj.w}%;height:${obj.h}%;transform:translate(-50%,-50%);border:1.5px dashed transparent;border-radius:10px;cursor:grab;transition:border-color 0.15s ease, background 0.15s ease;">
          </div>
        `).join('')}
      </div>
    ` : '';

    return `
      <div id="regaarder-n3d-viewport-${suffix}" class="rg-n3d-viewport" data-template-id="${templateId}" style="position:relative;width:100%;height:100%;background:#0b0f17;overflow:hidden;display:flex;align-items:center;justify-content:center;user-select:none;">
        <canvas id="regaarder-n3d-canvas-${suffix}" width="960" height="540" style="width:100%;height:100%;object-fit:contain;display:block;"></canvas>
        ${hitOverlayHtml}
      </div>
    `;
  }

  function wireNative3DStageInteractions(container, templateId) {
    const viewport = container.querySelector(`[data-template-id="${templateId}"]`) || container;
    const canvas = viewport.querySelector('canvas');

    ensureNative3DLoaded().then(() => {
      const t = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
      renderNative3DCanvas(canvas, t);
    });

    const hitBoxes = viewport.querySelectorAll('[data-n3d-obj]');
    hitBoxes.forEach((box) => {
      const objId = box.getAttribute('data-n3d-obj');
      const variant = box.getAttribute('data-n3d-variant') || 'media';

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
      let origX = 0, origY = 0;

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

        state.activeActor = objId;
        if (objId === 'n3d_prop_hat') state.activeSurface = 'hat-brim';
        else if (objId === 'n3d_actor_primary') state.activeSurface = 'shirt';
        else if (objId === 'n3d_actor_secondary') state.activeSurface = 'head';

        if (window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.showForObject === 'function') {
          window.RegaarderContextualToolbar.showForObject({
            contextType: 'template',
            objectKey: objId,
            variant,
            anchorElement: box
          });
        }

        const off = state.actorOffsets[objId] || (state.actorOffsets[objId] = { x: 0, y: 0, rot: 0, opacity: 1 });
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = off.x || 0;
        origY = off.y || 0;
        try { box.setPointerCapture(e.pointerId); } catch (err) {}
      });

      box.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const rect = viewport.getBoundingClientRect();
        const dx = ((e.clientX - startX) / Math.max(1, rect.width)) * 960;
        const dy = ((e.clientY - startY) / Math.max(1, rect.height)) * 540;
        const off = state.actorOffsets[objId];
        if (off) {
          off.x = Math.round(origX + dx);
          off.y = Math.round(origY + dy);
          renderNative3DCanvas(canvas, (window.topCustomizerState && window.topCustomizerState.currentTime) || 0);
        }
      });

      const endDrag = () => { dragging = false; };
      box.addEventListener('pointerup', endDrag);
      box.addEventListener('pointercancel', endDrag);
    });
  }

  window.renderRegaarderNative3DStage = function (container, templateId, isHover) {
    if (!container) return;
    container.innerHTML = buildNative3DStageHTML(templateId || TEMPLATE_ID, isHover);
    const canvas = container.querySelector('canvas');
    renderNative3DCanvas(canvas, 0.5);
    if (!isHover) {
      wireNative3DStageInteractions(container, templateId || TEMPLATE_ID);
    }
  };

  window.stepRegaarderNative3DAnimation = function (container, templateId, elapsedSec) {
    if (!container) return;
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    renderNative3DCanvas(canvas, elapsedSec);
  };

  window.applyRegaarderNative3DToolbarAction = function (actionType, objectKey, value) {
    if (!objectKey || !objectKey.startsWith('n3d_')) return false;
    const off = state.actorOffsets[objectKey] || (state.actorOffsets[objectKey] = { x: 0, y: 0, rot: 0, opacity: 1 });
    if (actionType === 'color') {
      off.color = value;
      if (objectKey === 'n3d_actor_primary') state.shirtColor = value;
      else if (objectKey === 'n3d_prop_hat') state.hatColor = value;
      else if (objectKey === 'n3d_actor_secondary') state.keyLightColor = value;
    } else if (actionType === 'opacity') {
      off.opacity = Math.max(0.1, Math.min(1, Number(value) / 100));
    } else if (actionType === 'rotate') {
      state.cameraYaw = (state.cameraYaw + (Number(value) || 15)) % 360;
    } else if (actionType === 'align') {
      off.x = 0;
      off.y = 0;
    }
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (stage) {
      window.stepRegaarderNative3DAnimation(stage, TEMPLATE_ID, (window.topCustomizerState && window.topCustomizerState.currentTime) || 0);
    }
    return true;
  };

  // Draw interactive 2D UV coordinate layout preview inside the Look/Effects inspector
  function renderUVPreviewCanvas(uvCanvas) {
    if (!uvCanvas) return;
    const c = uvCanvas.getContext('2d');
    if (!c) return;
    const W = uvCanvas.width, H = uvCanvas.height;
    c.fillStyle = '#0d131c';
    c.fillRect(0, 0, W, H);
    c.strokeStyle = '#475569';
    c.lineWidth = 0.6;
    const scale = state.uvScale || 1;
    const rot = (state.uvRotation || 0) * Math.PI / 180;
    const rings = 8, segs = 12;
    for (let r = 1; r <= rings; r++) {
      for (let s = 0; s < segs; s++) {
        const a1 = (s / segs) * Math.PI * 2 + rot;
        const a2 = ((s + 1) / segs) * Math.PI * 2 + rot;
        const rad = (r / rings) * (W * 0.38) * scale;
        const x1 = W / 2 + Math.cos(a1) * rad;
        const y1 = H / 2 + Math.sin(a1) * rad;
        const x2 = W / 2 + Math.cos(a2) * rad;
        const y2 = H / 2 + Math.sin(a2) * rad;
        c.beginPath();
        c.moveTo(W / 2, H / 2);
        c.lineTo(x1, y1);
        c.lineTo(x2, y2);
        c.closePath();
        c.stroke();
      }
    }
    c.fillStyle = '#f59e0b';
    c.fillRect(W / 2 - 3, H / 2 - 3, 6, 6);
  }

  // Standardized 4-Tab Contextual Inspector (Content, Motion, Look, Effects) + Advanced Controls
  window.tplBuildRegaarderNative3DRegaarderPanes = function () {
    const contentHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">3D Scene Preset & Foundation</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">Scene Composition</label>
            <select class="rg-select" data-n3d-prop="preset">
              ${Object.values(PRESET_SCENES).map((p) => `<option value="${p.id}" ${state.preset === p.id ? 'selected' : ''}>${p.label}</option>`).join('')}
            </select>
          </div>
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">Anatomical Foundation</label>
            <select class="rg-select" data-n3d-prop="foundation">
              <option value="male" ${state.foundation === 'male' ? 'selected' : ''}>Male Anatomical Rig (V89)</option>
              <option value="female" ${state.foundation === 'female' ? 'selected' : ''}>Female Morph Target (V93)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Anatomical Proportions</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Head Scale</label><span class="rg-ctrl-val">${Number(state.headSize).toFixed(2)}×</span></div>
            <input type="range" class="rg-range" min="0.85" max="1.25" step="0.01" value="${state.headSize}" data-n3d-num="headSize">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Shoulder Width</label><span class="rg-ctrl-val">${Number(state.shoulderWidth).toFixed(2)}×</span></div>
            <input type="range" class="rg-range" min="0.80" max="1.25" step="0.01" value="${state.shoulderWidth}" data-n3d-num="shoulderWidth">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Arm & Leg Length</label><span class="rg-ctrl-val">${Number(state.legLength).toFixed(2)}×</span></div>
            <input type="range" class="rg-range" min="0.85" max="1.20" step="0.01" value="${state.legLength}" data-n3d-num="legLength">
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Tailored Wardrobe & Hat (V91)</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row" style="display:flex;gap:12px;flex-wrap:wrap;">
            <label style="display:flex;align-items:center;gap:6px;font-size:11.5px;cursor:pointer;">
              <input type="checkbox" data-n3d-bool="shirtVisible" ${state.shirtVisible ? 'checked' : ''}> Shirt
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:11.5px;cursor:pointer;">
              <input type="checkbox" data-n3d-bool="trousersVisible" ${state.trousersVisible ? 'checked' : ''}> Trousers
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:11.5px;cursor:pointer;">
              <input type="checkbox" data-n3d-bool="hatVisible" ${state.hatVisible ? 'checked' : ''}> Brimmed Hat
            </label>
          </div>
        </div>
      </div>
    `;

    const motionHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Skeleton Rig, IK & Finger Contact</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">Posture Preset</label>
            <select class="rg-select" data-n3d-prop="pose">
              <option value="standing" ${state.pose === 'standing' ? 'selected' : ''}>Standing / Paired Contact</option>
              <option value="seated" ${state.pose === 'seated' ? 'selected' : ''}>Seated (Chair Contact Solver)</option>
              <option value="folded" ${state.pose === 'folded' ? 'selected' : ''}>Folded Arms (Coach Stance)</option>
              <option value="lean" ${state.pose === 'lean' ? 'selected' : ''}>Forward Lean</option>
            </select>
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Spine Lean Angle</label><span class="rg-ctrl-val">${state.leanAngle}°</span></div>
            <input type="range" class="rg-range" min="-25" max="65" step="1" value="${state.leanAngle}" data-n3d-num="leanAngle">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Finger Grip & Opposed Thumb Curl</label><span class="rg-ctrl-val">${Math.round(state.handCurl * 100)}%</span></div>
            <input type="range" class="rg-range" min="0" max="1" step="0.02" value="${state.handCurl}" data-n3d-num="handCurl">
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">3D Camera Rig & Keyframe Orbit</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Camera Orbit Yaw</label><span class="rg-ctrl-val">${state.cameraYaw}°</span></div>
            <input type="range" class="rg-range" min="-180" max="180" step="2" value="${state.cameraYaw}" data-n3d-num="cameraYaw">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Focal Length / FOV</label><span class="rg-ctrl-val">${state.cameraFov}°</span></div>
            <input type="range" class="rg-range" min="18" max="60" step="1" value="${state.cameraFov}" data-n3d-num="cameraFov">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Camera Dolly Zoom</label><span class="rg-ctrl-val">${Number(state.cameraZoom).toFixed(2)}×</span></div>
            <input type="range" class="rg-range" min="0.6" max="1.6" step="0.02" value="${state.cameraZoom}" data-n3d-num="cameraZoom">
          </div>
          <div class="rg-ctrl-row">
            <label style="display:flex;align-items:center;gap:8px;font-size:11.5px;cursor:pointer;">
              <input type="checkbox" data-n3d-bool="autoOrbit" ${state.autoOrbit ? 'checked' : ''}> Continuous Turntable Orbit
            </label>
          </div>
        </div>
      </div>
    `;

    const lookHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">PBR Material & Texture Maps (V108)</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">Target Surface Mesh</label>
            <select class="rg-select" data-n3d-prop="activeSurface">
              <option value="body" ${state.activeSurface === 'body' ? 'selected' : ''}>Body Surface (Anatomical)</option>
              <option value="head" ${state.activeSurface === 'head' ? 'selected' : ''}>Head Surface (V104 Oval)</option>
              <option value="shirt" ${state.activeSurface === 'shirt' ? 'selected' : ''}>Tailored Shirt & Fitted Hem</option>
              <option value="trousers" ${state.activeSurface === 'trousers' ? 'selected' : ''}>Tailored Trousers</option>
              <option value="hat-brim" ${state.activeSurface === 'hat-brim' ? 'selected' : ''}>Hat Swept Brim & Crown</option>
            </select>
          </div>
          <div class="rg-ctrl-row" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
            <div>
              <label class="rg-ctrl-label" style="font-size:10px;">Primary</label>
              <input type="color" value="${state.shirtColor}" data-n3d-color="shirtColor" style="width:100%;height:28px;border:none;border-radius:6px;cursor:pointer;">
            </div>
            <div>
              <label class="rg-ctrl-label" style="font-size:10px;">Trousers</label>
              <input type="color" value="${state.trousersColor}" data-n3d-color="trousersColor" style="width:100%;height:28px;border:none;border-radius:6px;cursor:pointer;">
            </div>
            <div>
              <label class="rg-ctrl-label" style="font-size:10px;">Hat / Trim</label>
              <input type="color" value="${state.hatColor}" data-n3d-color="hatColor" style="width:100%;height:28px;border:none;border-radius:6px;cursor:pointer;">
            </div>
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Surface Roughness</label><span class="rg-ctrl-val">${Number(state.roughness).toFixed(2)}</span></div>
            <input type="range" class="rg-range" min="0.05" max="1" step="0.02" value="${state.roughness}" data-n3d-num="roughness">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Metalness</label><span class="rg-ctrl-val">${Number(state.metalness).toFixed(2)}</span></div>
            <input type="range" class="rg-range" min="0" max="1" step="0.02" value="${state.metalness}" data-n3d-num="metalness">
          </div>
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">PBR Map Slot (Color / Roughness / Normal / Bump)</label>
            <select class="rg-select" data-n3d-prop="pbrSlot">
              <option value="color" ${state.pbrSlot === 'color' ? 'selected' : ''}>Base Color (sRGB)</option>
              <option value="roughness" ${state.pbrSlot === 'roughness' ? 'selected' : ''}>Roughness (Linear Green)</option>
              <option value="metalness" ${state.pbrSlot === 'metalness' ? 'selected' : ''}>Metalness (Linear Blue)</option>
              <option value="normal" ${state.pbrSlot === 'normal' ? 'selected' : ''}>Tangent Normal Map</option>
              <option value="bump" ${state.pbrSlot === 'bump' ? 'selected' : ''}>Height / Bump Map → Normal</option>
            </select>
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">3-Point Studio Lighting & Backdrop</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Key Softbox Intensity</label><span class="rg-ctrl-val">${Number(state.keyLightIntensity).toFixed(1)}</span></div>
            <input type="range" class="rg-range" min="0.2" max="5" step="0.1" value="${state.keyLightIntensity}" data-n3d-num="keyLightIntensity">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Rim Backlight Intensity</label><span class="rg-ctrl-val">${Number(state.rimLightIntensity).toFixed(1)}</span></div>
            <input type="range" class="rg-range" min="0" max="4" step="0.1" value="${state.rimLightIntensity}" data-n3d-num="rimLightIntensity">
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">ACES Filmic Exposure</label><span class="rg-ctrl-val">${Number(state.exposure).toFixed(2)}</span></div>
            <input type="range" class="rg-range" min="0.3" max="1.6" step="0.02" value="${state.exposure}" data-n3d-num="exposure">
          </div>
        </div>
      </div>
    `;

    const effectsHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Multiresolution Surface Detail (V108)</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">Subdivision Detail Level</label><span class="rg-ctrl-val">Level ${state.multiresDisplayLevel}</span></div>
            <input type="range" class="rg-range" min="0" max="2" step="1" value="${state.multiresDisplayLevel}" data-n3d-num="multiresDisplayLevel">
          </div>
          <div class="rg-ctrl-row">
            <label style="display:flex;align-items:center;gap:8px;font-size:11.5px;cursor:pointer;">
              <input type="checkbox" data-n3d-bool="wireframe" ${state.wireframe ? 'checked' : ''}> Show Cage & Subdivision Wireframe
            </label>
          </div>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">UV Layout, Coordinates & Vertex Paint</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label class="rg-ctrl-label">UV Projection Axis</label>
            <select class="rg-select" data-n3d-prop="uvProjection">
              <option value="cylindrical" ${state.uvProjection === 'cylindrical' ? 'selected' : ''}>Cylindrical Unwrap</option>
              <option value="xy" ${state.uvProjection === 'xy' ? 'selected' : ''}>Planar XY</option>
              <option value="xz" ${state.uvProjection === 'xz' ? 'selected' : ''}>Planar XZ</option>
              <option value="yz" ${state.uvProjection === 'yz' ? 'selected' : ''}>Planar YZ</option>
            </select>
          </div>
          <div class="rg-ctrl-row">
            <div class="rg-ctrl-top"><label class="rg-ctrl-label">UV Island Scale</label><span class="rg-ctrl-val">${Number(state.uvScale).toFixed(2)}×</span></div>
            <input type="range" class="rg-range" min="0.4" max="2.0" step="0.05" value="${state.uvScale}" data-n3d-num="uvScale">
          </div>
          <canvas data-role="n3d-uv-canvas" width="220" height="140" style="width:100%;height:110px;border-radius:8px;background:#0d131c;border:1px solid rgba(255,255,255,0.08);margin:6px 0;"></canvas>
          <div class="rg-ctrl-row" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <label class="rg-ctrl-label" style="margin:0;">Vertex Brush Color</label>
            <input type="color" value="${state.vertexPaintColor}" data-n3d-color="vertexPaintColor" style="width:42px;height:26px;border:none;border-radius:6px;cursor:pointer;">
          </div>
        </div>
      </div>
    `;

    const advancedHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header"><span class="rg-section-title">Topology & GLB Export</span></div>
        <div class="rg-section-body">
          <div class="rg-ctrl-row">
            <label style="display:flex;align-items:center;gap:8px;font-size:11.5px;cursor:pointer;">
              <input type="checkbox" data-n3d-bool="smokeEnabled" ${state.smokeEnabled ? 'checked' : ''}> Volumetric Depth Smoke Plane
            </label>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button type="button" class="rg-btn-secondary" data-n3d-action="bake-vertex-color" style="flex:1;padding:6px 10px;font-size:11px;">Bake Vertex → Map</button>
            <button type="button" class="rg-btn-secondary" data-n3d-action="export-glb" style="flex:1;padding:6px 10px;font-size:11px;">Export .GLB</button>
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

  window.wireRegaarderNative3DInspectorEvents = function (modalEl) {
    if (!modalEl) return;

    const uvCanvas = modalEl.querySelector('[data-role="n3d-uv-canvas"]');
    if (uvCanvas) renderUVPreviewCanvas(uvCanvas);

    const refreshStage = () => {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        window.stepRegaarderNative3DAnimation(stage, TEMPLATE_ID, (window.topCustomizerState && window.topCustomizerState.currentTime) || 0);
      }
      if (uvCanvas) renderUVPreviewCanvas(uvCanvas);
    };

    modalEl.querySelectorAll('[data-n3d-prop]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const k = sel.getAttribute('data-n3d-prop');
        state[k] = sel.value;
        if (k === 'preset' && PRESET_SCENES[sel.value]) {
          state.backgroundHex = PRESET_SCENES[sel.value].background;
          state.shirtColor = PRESET_SCENES[sel.value].primaryColor;
          rebuildNativeSceneFromPreset();
        }
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-n3d-num]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const k = inp.getAttribute('data-n3d-num');
        state[k] = parseFloat(inp.value);
        if (k === 'legLength') state.armLength = state[k];
        const valSpan = inp.parentElement?.querySelector('.rg-ctrl-val');
        if (valSpan) {
          if (k === 'multiresDisplayLevel') valSpan.textContent = `Level ${state[k]}`;
          else if (k === 'handCurl') valSpan.textContent = `${Math.round(state[k] * 100)}%`;
          else if (k.includes('Angle') || k.includes('Yaw') || k.includes('Fov')) valSpan.textContent = `${state[k]}°`;
          else valSpan.textContent = Number(state[k]).toFixed(2);
        }
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-n3d-bool]').forEach((inp) => {
      inp.addEventListener('change', () => {
        state[inp.getAttribute('data-n3d-bool')] = inp.checked;
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-n3d-color]').forEach((inp) => {
      inp.addEventListener('input', () => {
        state[inp.getAttribute('data-n3d-color')] = inp.value;
        refreshStage();
      });
    });

    const exportBtn = modalEl.querySelector('[data-n3d-action="export-glb"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        if (state.nativeReady && state.nativeScene && state.nativeData) {
          try {
            const expMod = await import('../native3d-v97/export.js');
            const glb = await expMod.exportNativeGLB(state.nativeScene, state.nativeData);
            expMod.downloadGLB(glb);
          } catch (e) {
            console.warn('GLB export failed:', e);
          }
        }
      });
    }
  };
})();
