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
    handshake: {
      id: 'handshake',
      label: '01 Handshake · Paired Contact',
      description: 'Two anatomical characters with finger-contact grip solver & studio softboxes',
      background: '#141820',
      primaryColor: '#137cba',
      secondaryColor: '#dedbca'
    },
    checkpoint: {
      id: 'checkpoint',
      label: '02 14:55 Crimson Seated & Coach',
      description: 'Seated crimson figure in chair at desk, cream coach with brimmed hat & depth smoke',
      background: '#220406',
      primaryColor: '#9d1514',
      secondaryColor: '#eee9da'
    },
    team: {
      id: 'team',
      label: '03 Three Red Players Formation',
      description: 'Trio formation with independent bone poses, wardrobe & rim lighting',
      background: '#17080a',
      primaryColor: '#b91c1c',
      secondaryColor: '#f8fafc'
    },
    humanoid: {
      id: 'humanoid',
      label: '04 Anatomical Mannequin Studio',
      description: 'Single mannequin for multiresolution sculpting, UV projection & vertex painting',
      background: '#11151b',
      primaryColor: '#7d8c9d',
      secondaryColor: '#343e4b'
    },
    blue: {
      id: 'blue',
      label: '05 Blue & Cream Coach',
      description: 'Blue figure and cream coach with tailored fedora hat and dynamic 3D studio lighting',
      background: '#151322',
      primaryColor: '#137cba',
      secondaryColor: '#dedbca'
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
    autoOrbit: false,
    editTool: 'orbit',
    brushRadius: 0.065,
    showTopology: true,
    showBones: false,
    selectedBone: 'head',
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
    trousersColor: '#137cba',
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
      n3d_actor_primary: { x: 0, y: 0, rot: 90, opacity: 1, color: '#137cba' },
      n3d_actor_secondary: { x: 0, y: 0, rot: -65, opacity: 1, color: '#eee9da' },
      n3d_prop_hat: { x: 0, y: 0, rot: 0, lift: 0, opacity: 1, color: '#dedbca' },
      n3d_prop_desk: { x: 0, y: 0, rot: 0, opacity: 1, color: '#e4e2da' }
    },
    nativeReady: false,
    nativeLoading: false,
    nativePhase: "Loading 3D modules…",
    nativeEngine: null,
    nativeScene: null,
    nativeData: null,
    nativeMods: null
  };

  window.REGAARDER_NATIVE3D_CONFIG = state;

  function getActiveStageObjects(preset = state.preset) {
    if (preset === 'checkpoint') {
      return [
        { id: 'n3d_actor_crimson', name: 'Seated Red Figure', variant: 'object3d', x: 30, y: 56, w: 24, h: 68 },
        { id: 'n3d_actor_coach', name: 'Secondary Coach Rig', variant: 'object3d', x: 68, y: 54, w: 24, h: 72 },
        { id: 'n3d_prop_hat', name: 'Tailored Brimmed Hat', variant: 'object3d', x: 68, y: 35, w: 14, h: 12 },
        { id: 'n3d_prop_desk', name: 'Studio Desk & Chair Prop', variant: 'object3d', x: 44, y: 70, w: 34, h: 24 }
      ];
    }
    if (preset === 'team') {
      return [
        { id: 'n3d_actor_p1', name: 'Left Wing Player', variant: 'object3d', x: 28, y: 56, w: 22, h: 70 },
        { id: 'n3d_actor_primary', name: 'Primary Humanoid Rig', variant: 'object3d', x: 50, y: 53, w: 22, h: 72 },
        { id: 'n3d_actor_secondary', name: 'Secondary Coach Rig', variant: 'object3d', x: 72, y: 56, w: 22, h: 70 }
      ];
    }
    if (preset === 'humanoid') {
      return [
        { id: 'n3d_actor_primary', name: 'Anatomical Mannequin', variant: 'object3d', x: 50, y: 54, w: 24, h: 74 }
      ];
    }
    return [
      { id: 'n3d_actor_primary', name: 'Primary Humanoid Rig', variant: 'object3d', x: 38, y: 56, w: 22, h: 72 },
      { id: 'n3d_actor_secondary', name: 'Secondary Coach Rig', variant: 'object3d', x: 62, y: 54, w: 22, h: 72 },
      { id: 'n3d_prop_hat', name: 'Tailored Brimmed Hat', variant: 'object3d', x: 62, y: 35, w: 14, h: 12 }
    ];
  }

  const STAGE_OBJECTS = getActiveStageObjects('blue');

  let nativeLoadPromise = null;
  async function ensureNative3DLoaded() {
    if (state.nativeReady || state.nativeError) return;
    if (nativeLoadPromise && state.nativeLoading) return nativeLoadPromise;
    if (typeof window === 'undefined' || (navigator && navigator.userAgent && navigator.userAgent.includes('jsdom'))) return;
    state.nativeLoading = true;
    state.nativeError = null;
    nativeLoadPromise = (async () => {
    try {
      const [engineMod, sceneMod, finalMod, checkpointMod, surfaceUiMod, stageEditMod] = await Promise.all([
        import('/native3d-v97/engine.js'),
        import('/native3d-v97/scene.js'),
        import('/native3d-v97/final-scenes.js'),
        import('/native3d-v97/checkpoint.js'),
        import('/native3d-v97/surface-ui.js'),
        import('/native3d-v97/stage-editor.js')
      ]);
      state.nativePhase = "Loading humanoid mesh and wardrobe…";
      const data = await engineMod.loadHumanoid();
      state.nativePhase = "Preparing 3D scene…";
      state.nativeData = data;
      state.nativeMods = { engineMod, sceneMod, finalMod, checkpointMod, surfaceUiMod, stageEditMod };
      const offscreen = document.createElement('canvas');
      offscreen.width = 960;
      offscreen.height = 540;
      state.nativeEngine = new engineMod.Native3DEngine(offscreen, data, { width: 960, height: 540, cacheWorlds: false });
      rebuildNativeSceneFromPreset();
      state.nativeReady = true;
    } catch (err) {
      state.nativeError = err.message;
      console.error('[RegaarderNative3D] Native renderer failed:', err);
    } finally {
      state.nativeLoading = false;
    }
    })();
    return nativeLoadPromise;
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
    state.baseNodes = structuredClone(state.nativeScene.nodes);
    state.backgroundHex = state.nativeScene.background;
    const sample = n => sceneMod.nodeAt(n, PREVIEW_TIMES[state.preset]);
    const camera = sample(state.nativeScene.nodes.find(n=>n.type==='camera'));
    const target = camera.target || [0,1,0];
    const delta = camera.position.map((v,i)=>v-target[i]);
    state.cameraRadius = Math.hypot(...delta);
    state.cameraTarget = [...target];
    state.cameraYaw = Math.atan2(delta[0],delta[2])*180/Math.PI;
    state.cameraPitch = Math.asin(delta[1]/state.cameraRadius)*180/Math.PI;
    state.cameraFov = camera.fov;
    state.cameraZoom = 1;
    state.exposure = state.nativeScene.lighting?.exposure ?? .92;
    state.ambientIntensity = state.nativeScene.lighting?.ambient ?? .65;
    const key = state.nativeScene.nodes.find(n=>n.id==='key'), rim = state.nativeScene.nodes.find(n=>n.id==='rim');
    if(key){state.keyLightIntensity=sample(key).intensity;state.keyLightColor=sample(key).color;}
    if(rim){state.rimLightIntensity=sample(rim).intensity;state.rimLightColor=sample(rim).color;}
    state.editScene = null;
    state.meshEditor?.reset();
  }

  const PREVIEW_TIMES = { handshake: 1.95, checkpoint: 1.8, team: 0.65, humanoid: 0, blue: 0 };
  function isEditing() {
    return window.topCustomizerState?.paperPreviewMode === '3d';
  }
  function actorObjectId(node, index) {
    if (state.preset === 'checkpoint') return node.id === 'red' ? 'n3d_actor_crimson' : 'n3d_actor_coach';
    if (state.preset === 'team') return ['n3d_actor_p1', 'n3d_actor_primary', 'n3d_actor_secondary'][index];
    return index === 0 ? 'n3d_actor_primary' : 'n3d_actor_secondary';
  }
  function syncStateToNativeScene(sc = state.nativeScene) {
    if (!sc?.nodes) return;
    sc.background = state.backgroundHex;
    sc.lighting = { ...sc.lighting, exposure: state.exposure, ambient: state.ambientIntensity };
    // Preserve each preset's choreography; user offsets are relative to its own foundation.
    const humanoids = sc.nodes.filter(n => n.type === 'humanoid');
    humanoids.forEach((h, i) => {
      const base = (sc===state.editScene ? state.editBaseNodes : state.baseNodes)?.find(n => n.id === h.id) || h;
      const off = state.actorOffsets[actorObjectId(h, i)] || {};
      h.wireframe = !!state.wireframe;
      h.editCage = isEditing() && state.showTopology;
      h.proportions = { ...h.proportions, headSize: (base.proportions?.headSize ?? 1.06)*state.headSize/1.06, shoulderWidth: (base.proportions?.shoulderWidth ?? 1)*state.shoulderWidth, armLength: (base.proportions?.armLength ?? 1)*state.armLength, legLength: (base.proportions?.legLength ?? 1)*state.legLength };
      h.shape = { ...h.shape, female: state.foundation === 'female' ? 1 : 0 };
      h.position = [...base.position];
      h.position[0] += (off.x || 0) * .003;
      h.position[1] -= (off.y || 0) * .003;
      h.position[2] += (off.z || 0) * .003;
      h.rotation = [...base.rotation];
      h.rotation[1] += off.yaw || 0;
      h.parts = structuredClone(h.parts || {});
      for (const part of ['shirt', 'trousers']) {
        h.parts[part] = { ...h.parts[part], roughness: off.roughness ?? state.roughness, metalness: off.metalness ?? state.metalness };
        if (i === 0 && state.preset === 'blue') {
          h.parts[part].color = part === 'shirt' ? state.shirtColor : state.trousersColor;
          h.parts[part].visible = state[part + 'Visible'];
        }
        if (off.colorEdited) h.parts[part].color = off.color;
      }
      h.material = { ...h.material, roughness: off.roughness ?? state.roughness, metalness: off.metalness ?? state.metalness };
      if (off.colorEdited) h.material = { ...h.material, color: off.color };
      if (off.opacity !== undefined) h.material = { ...h.material, opacity: off.opacity };
      if (base.parts?.hat?.visible) {
        const hat = state.actorOffsets.n3d_prop_hat || {};
        h.parts.hat = { ...h.parts.hat, visible: state.hatVisible, color: state.hatColor, lift: Math.max(-.15, Math.min(.15, (base.parts.hat.lift || 0)+(hat.lift || 0))) };
      }
    });
    for (const light of sc.nodes.filter(n=>n.type==='light')) {
      if(light.id==='key'){light.intensity=state.keyLightIntensity;light.color=state.keyLightColor;}
      if(light.id==='rim'){light.intensity=state.rimLightIntensity;light.color=state.rimLightColor;}
    }
    if (isEditing()) {
      const cam = sc.nodes.find(n => n.type === 'camera');
      if (cam) {
        const yaw = state.cameraYaw * Math.PI / 180, pitch = state.cameraPitch * Math.PI / 180, r = (state.cameraRadius || 4.3) / state.cameraZoom;
        const target = state.cameraTarget || [0,1.1,0];
        cam.fov = state.cameraFov;
        cam.position = [target[0]+Math.sin(yaw)*Math.cos(pitch)*r, target[1]+Math.sin(pitch)*r, target[2]+Math.cos(yaw)*Math.cos(pitch)*r];
        cam.target = [...target];
      }
    }
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
    } else if (state.preset === 'checkpoint') {
      // 14:55 Crimson Seated & Coach Reconstruction (Image 4 & 10)
      const gSmoke = ctx.createRadialGradient(W * 0.5, H * 0.45, 10, W * 0.5, H * 0.45, 320);
      gSmoke.addColorStop(0, 'rgba(160, 140, 140, 0.18)');
      gSmoke.addColorStop(1, 'transparent');
      ctx.fillStyle = gSmoke;
      ctx.fillRect(0, 0, W, H);

      // Desk assembly
      const deskOff = state.actorOffsets.n3d_prop_desk || { x: 0, y: 0 };
      ctx.fillStyle = '#f1efe7';
      ctx.fillRect(W * 0.34 + deskOff.x, H * 0.58 + deskOff.y, 270, 10);
      ctx.fillStyle = '#080a10';
      ctx.fillRect(W * 0.36 + deskOff.x, H * 0.58 + 10 + deskOff.y, 240, 95);

      // Seated crimson figure on chair (left)
      const rOff = state.actorOffsets.n3d_actor_crimson || p1;
      drawHumanoid(W * 0.26 + rOff.x, H * 0.60 + rOff.y, 0.98, '#9d1514', '#7f1212', false, state.hatColor, 1);

      // Standing cream coach in fedora (right)
      const cOff = state.actorOffsets.n3d_actor_coach || p2;
      drawHumanoid(W * 0.74 + cOff.x, H * 0.54 + cOff.y, 1.08, '#dedbca', '#c5c2b0', true, state.hatColor, -1);
    } else {
      // Blue & Cream or Handshake pair
      drawHumanoid(W * 0.38 + p1.x - sway * 0.4, H * 0.55 + p1.y, 1.06, state.shirtColor, state.trousersColor, false, state.hatColor, 1);
      drawHumanoid(W * 0.62 + p2.x + sway * 0.4, H * 0.54 + p2.y, 1.08, '#dedbca', '#c5c2b0', true, state.hatColor, -1);
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

  function updateHitBoxesFrom3DScene(canvas) {
    if (!canvas || !state.nativeEngine || !state.nativeScene || !state.nativeMods) return;
    const viewport = canvas.closest('.rg-n3d-viewport') || canvas.parentElement;
    if (!viewport) return;
    const engine = state.nativeEngine;
    const camera = engine.camera;
    const T = state.nativeMods.engineMod && state.nativeMods.engineMod.T;
    if (!camera || !T || !engine.characters) return;

    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();

    const W = 960, H = 540;

    const calcBounds = (threeObj) => {
      if (!threeObj) return null;
      threeObj.updateMatrixWorld(true);
      const box = new T.Box3().setFromObject(threeObj);
      if (box.isEmpty() || !isFinite(box.min.x)) return null;
      const corners = [
        new T.Vector3(box.min.x, box.min.y, box.min.z),
        new T.Vector3(box.min.x, box.min.y, box.max.z),
        new T.Vector3(box.min.x, box.max.y, box.min.z),
        new T.Vector3(box.min.x, box.max.y, box.max.z),
        new T.Vector3(box.max.x, box.min.y, box.min.z),
        new T.Vector3(box.max.x, box.min.y, box.max.z),
        new T.Vector3(box.max.x, box.max.y, box.min.z),
        new T.Vector3(box.max.x, box.max.y, box.max.z)
      ];
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      corners.forEach((p) => {
        p.project(camera);
        const px = (p.x * 0.5 + 0.5) * W;
        const py = (-p.y * 0.5 + 0.5) * H;
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      });
      if (minX >= maxX || minY >= maxY) return null;
      return {
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
        w: Math.max(28, maxX - minX),
        h: Math.max(28, maxY - minY)
      };
    };

    const actors=state.nativeScene.nodes.filter(n=>n.type==='humanoid');
    actors.forEach((node,i)=>{
      const character=engine.characters.get(node.id);
      if(!character?.group.visible)return;
      const bounds=calcBounds(character.group);
      if(bounds)applyBoxToHitElement(viewport,actorObjectId(node,i),bounds);
      if(character.hat?.visible){const hb=calcBounds(character.hat);if(hb)applyBoxToHitElement(viewport,'n3d_prop_hat',hb);}
    });

    const deskBox = viewport.querySelector('[data-n3d-obj="n3d_prop_desk"]');
    if (deskBox) {
      deskBox.style.display = state.preset === 'checkpoint' ? 'block' : 'none';
    }
  }

  function applyBoxToHitElement(viewport, objId, b) {
    const el = viewport.querySelector(`[data-n3d-obj="${objId}"]`);
    if (!el) return;
    el.style.left = `${((b.cx / 960) * 100).toFixed(2)}%`;
    el.style.top = `${((b.cy / 540) * 100).toFixed(2)}%`;
    el.style.width = `${((b.w / 960) * 100).toFixed(2)}%`;
    el.style.height = `${((b.h / 540) * 100).toFixed(2)}%`;
  }

  function renderNative3DCanvas(canvas, timeSec) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const status = canvas.parentElement?.querySelector('[data-n3d-status]');
    if (status) {
      status.textContent = state.nativeError ? '3D error: ' + state.nativeError : state.nativeReady ? (state.nativeEngine?.renderer?.isSoftwareRenderer ? 'Software 3D · reduced lighting' : '') : state.nativePhase;
      status.dataset.state = state.nativeError ? 'error' : state.nativeReady ? 'ready' : 'loading';
      status.style.display = status.textContent ? 'block' : 'none';
    }

    if (state.nativeReady && !state.nativeError && state.nativeEngine && state.nativeScene) {
      try {
        const editing = isEditing();
        let scene = state.nativeScene;
        if (editing) {
          if (!state.editScene) {
            state.editScene = { ...scene, nodes: scene.nodes.map(n => {
              const evaluated = state.nativeMods.sceneMod.nodeAt(n, PREVIEW_TIMES[state.preset]);
              for (const k of ['tracks','boneTracks','bonePositionTracks','boneScaleTracks','partTracks','ikTracks','handPoseTracks']) evaluated[k] = {};
              return evaluated;
            }) };
            state.editBaseNodes = structuredClone(state.editScene.nodes);
            // Edits are stored on the source nodes, and survive both mode changes and GLB export.
          }
          scene = state.editScene;
          scene.nodes.forEach(n => { const source = state.nativeScene.nodes.find(x => x.id === n.id); if (source) for (const k of ['sculpt','multires','weights']) n[k] = source[k]; });
        }
        syncStateToNativeScene(scene);
        const dur = state.nativeScene.duration || 5;
        const t = Math.max(0, Number(timeSec) || 0) % dur;
        const renderKey=JSON.stringify(scene)+'|'+(editing?PREVIEW_TIMES[state.preset]:t);
        if(state.nativeRenderKey!==renderKey){state.nativeEngine.render(scene,editing?PREVIEW_TIMES[state.preset]:t);state.nativeRenderKey=renderKey;}
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(state.nativeEngine.canvas, 0, 0, canvas.width, canvas.height);
        updateHitBoxesFrom3DScene(canvas);
        if (editing) state.meshEditor?.draw(ctx);
        return;
      } catch (e) {
        state.nativeError = e.message;
        console.error('[RegaarderNative3D] Frame failed:', e);
      }
    }
    // A software illustration cannot offer mesh editing. Show the actual load
    // state instead of disguising a missing native renderer as a working scene.
    ctx.fillStyle = '#10141b';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#cbd5e1';ctx.textAlign = 'center';ctx.font = '16px Arial';
    ctx.fillText(state.nativeError ? '3D could not load: ' + state.nativeError : state.nativePhase,canvas.width/2,canvas.height/2);
  }

  function buildNative3DStageHTML(templateId, isHover) {
    const suffix = isHover ? `hover-${templateId}` : templateId;
    const currentObjects = getActiveStageObjects(state.preset);

    const hitOverlayHtml = !isHover ? `
      <div class="rg-n3d-hit-layer" style="position:absolute;inset:0;z-index:22;pointer-events:auto;">
        ${currentObjects.map((obj) => `
          <div class="rg-n3d-hit-box"
               data-n3d-obj="${obj.id}"
               data-n3d-variant="${obj.variant}"
               title="${obj.name} (Drag with Hand Cursor to Turn / Move in 3D)"
               style="position:absolute;left:${obj.x}%;top:${obj.y}%;width:${obj.w}%;height:${obj.h}%;transform:translate(-50%,-50%);border:1.5px dashed transparent;border-radius:10px;cursor:grab;transition:border-color 0.15s ease, background 0.15s ease;">
          </div>
        `).join('')}
      </div>
    ` : '';

    const presetPillsHtml = !isHover ? `
      <div class="rg-n3d-presets-bar" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:30;max-width:95%;overflow-x:auto;display:flex;align-items:center;gap:6px;background:rgba(15,19,28,0.92);border:1px solid rgba(255,255,255,0.12);padding:4px 8px;border-radius:24px;backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,0.6);">
        ${Object.values(PRESET_SCENES).map((p) => `
          <button type="button" class="rg-n3d-preset-pill ${state.preset === p.id ? 'is-active' : ''}" data-n3d-preset="${p.id}" title="${p.label} — ${p.description}" style="white-space:nowrap;flex-shrink:0;padding:5px 12px;border-radius:14px;border:none;cursor:pointer;font-size:11px;font-weight:700;color:${state.preset === p.id ? '#ffffff' : '#94a3b8'};background:${state.preset === p.id ? '#6d28d9' : 'transparent'};transition:all 0.15s ease;">
            ${({handshake:'01 Handshake',checkpoint:'02 Seated & Coach',team:'03 Red Trio',humanoid:'04 Mannequin',blue:'05 Blue & Coach'})[p.id]}
          </button>
        `).join('')}
      </div>
    ` : '';

    return `
      <div id="regaarder-n3d-viewport-${suffix}" class="rg-n3d-viewport" data-template-id="${templateId}" style="position:relative;width:100%;height:100%;background:#0b0f17;overflow:hidden;display:flex;align-items:center;justify-content:center;user-select:none;cursor:default;">
        <canvas id="regaarder-n3d-canvas-${suffix}" width="960" height="540" style="width:100%;height:100%;object-fit:contain;display:block;cursor:default;"></canvas>
        <div data-n3d-status role="status" style="position:absolute;left:12px;top:52px;z-index:25;padding:5px 9px;background:#080b10cc;color:#cbd5e1;font:12px Arial;pointer-events:none"></div>
        ${hitOverlayHtml}
        ${!isHover?`<nav aria-label="3D viewport zoom" style="position:absolute;left:14px;bottom:56px;z-index:31;display:flex;gap:6px;padding:6px;border-radius:var(--rg-toolbar-radius,12px);background:var(--rg-toolbar-bg,#1B1628);border:1px solid var(--rg-toolbar-border,#3B2A5F)"><button class="rg-btn-secondary" data-n3d-zoom="out" aria-label="Zoom out">−</button><button class="rg-btn-secondary" data-n3d-zoom="in" aria-label="Zoom in">Zoom +</button><button class="rg-btn-secondary" data-n3d-zoom="reset">Fit</button><output data-n3d-zoom-label>${state.cameraZoom.toFixed(2)}×</output></nav>`:''}
        ${presetPillsHtml}
      </div>
    `;
  }

  function wireNative3DStageInteractions(container, templateId) {
    const viewport = container.querySelector(`[data-template-id="${templateId}"]`) || container;
    const canvas = viewport.querySelector('canvas');

    ensureNative3DLoaded().then(() => {
      const t = (window.topCustomizerState && window.topCustomizerState.currentTime) || 0;
      if (!viewport.isConnected) return;
      if (!state.nativeReady) {renderNative3DCanvas(canvas, t);return;}
      state.meshEditor = state.nativeMods.stageEditMod.mountStageEditor(viewport, canvas, state, () => renderNative3DCanvas(canvas, 0));
      renderNative3DCanvas(canvas, t);
    });

    viewport.querySelectorAll('[data-n3d-zoom]').forEach(button=>button.addEventListener('click',()=>{state.cameraZoom=Math.max(.05,Math.min(64,button.dataset.n3dZoom==='reset'?1:state.cameraZoom*(button.dataset.n3dZoom==='in'?1.5:1/1.5)));const label=viewport.querySelector('[data-n3d-zoom-label]');if(label)label.textContent=state.cameraZoom.toFixed(2)+'×';renderNative3DCanvas(canvas,0);}));
    viewport.querySelectorAll('[data-n3d-preset]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pKey = btn.getAttribute('data-n3d-preset');
        if (pKey && PRESET_SCENES[pKey]) {
          state.preset = pKey;
          state.backgroundHex = PRESET_SCENES[pKey].background;
          state.shirtColor = PRESET_SCENES[pKey].primaryColor;
          rebuildNativeSceneFromPreset();
          const stage = document.getElementById('tpl-modal-preview-stage');
          if (stage) {
            window.renderRegaarderNative3DStage(stage, TEMPLATE_ID, false);
          }
          if (typeof window.organizeUniversalTemplateControls === 'function') {
            window.organizeUniversalTemplateControls();
          }
        }
      });
    });

    const hitBoxes = viewport.querySelectorAll('[data-n3d-obj]');
    hitBoxes.forEach((box) => {
      const objId = box.getAttribute('data-n3d-obj');
      const variant = box.getAttribute('data-n3d-variant') || 'media';

      box.style.cursor = 'grab';

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
      let origX = 0, origY = 0, origRot = 0, origLift = 0;

      box.addEventListener('pointerdown', (e) => {
        if (!isEditing() || state.editTool !== 'orbit') return;
        e.stopPropagation();
        hitBoxes.forEach((b) => {
          b.classList.remove('is-selected');
          b.style.borderColor = 'transparent';
          b.style.background = 'transparent';
        });
        box.classList.add('is-selected');
        box.style.borderColor = '#9B6BFF';
        box.style.background = 'rgba(155, 107, 255, 0.08)';
        box.style.cursor = 'grabbing';

        state.activeActor = objId;
        if (objId === 'n3d_prop_hat') state.activeSurface = 'hat-brim';
        else if (objId === 'n3d_actor_primary') state.activeSurface = 'shirt';
        else if (objId === 'n3d_actor_secondary') state.activeSurface = 'head';

        if (window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.showForObject === 'function') {
          window.RegaarderContextualToolbar.showForObject({
            contextType: 'template',
            objectKey: objId,
            label: getActiveStageObjects().find(object=>object.id===objId)?.name || '3D Object',
            variant,
            anchorElement: box
          });
        }

        const off = state.actorOffsets[objId] || (state.actorOffsets[objId] = {
          x: 0,
          y: 0,
          rot: objId === 'n3d_actor_primary' ? 90 : (objId === 'n3d_actor_secondary' ? -65 : 0),
          opacity: 1
        });
        state.editSession?.begin();
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = off.x || 0;
        origY = off.y || 0;
        origRot = off.yaw || 0;
        /* legacy rotation */ const unusedRot = typeof off.rot === 'number' ? off.rot : (objId === 'n3d_actor_primary' ? 90 : (objId === 'n3d_actor_secondary' ? -65 : 0));
        origLift = off.lift || 0;
        try { box.setPointerCapture(e.pointerId); } catch (err) {}
      });

      box.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const rect = viewport.getBoundingClientRect();
        const dx = ((e.clientX - startX) / Math.max(1, rect.width)) * 960;
        const dy = ((e.clientY - startY) / Math.max(1, rect.height)) * 540;
        const off = state.actorOffsets[objId];
        if (off) {
          if (objId.startsWith('n3d_actor_') && state.objectDragMode !== 'move') {
            // Turning the humanoid using the hand cursor in 3D mode:
            // Horizontal drag turns / rotates the character (yaw) in real-time
            const deltaYaw = dx * 0.75;
            off.yaw = Math.round((origRot + deltaYaw) * 10) / 10;
            // Vertical drag repositions / shifts position
            off.y = Math.round(origY + dy * 0.5);
          } else if (objId === 'n3d_prop_hat') {
            // Dragging hat moves it upward / downward (lift) and adjusts lateral offset
            off.lift = origLift - (dy * 0.003);
            off.x = Math.round(origX + dx * 0.5);
          } else {
            off.x = Math.round(origX + dx);
            off.y = Math.round(origY + dy);
          }
          renderNative3DCanvas(canvas, (window.topCustomizerState && window.topCustomizerState.currentTime) || 0);
          if (window.RegaarderContextualToolbar) {
            window.RegaarderContextualToolbar.updatePosition();
          }
        }
      });

      const endDrag = (e) => {
        if (dragging) {
          dragging = false;
          state.editSession?.commit();
          box.style.cursor = 'grab';
          try { box.releasePointerCapture(e.pointerId); } catch (err) {}
        }
      };
      box.addEventListener('pointerup', endDrag);
      box.addEventListener('pointercancel', endDrag);
    });

    // Orbit / Pan camera navigation when dragging empty space on the 3D canvas
    let isOrbiting = false;
    let orbitStartX = 0, orbitStartY = 0;
    let origYaw = state.cameraYaw || 18, origPitch = state.cameraPitch || 12;

    viewport.addEventListener('pointerdown', (e) => {
      if (!isEditing() || state.editTool !== 'orbit' || e.target.closest('[data-n3d-obj], button')) return;
      isOrbiting = true;
      orbitStartX = e.clientX;
      orbitStartY = e.clientY;
      origYaw = state.cameraYaw || 18;
      origPitch = state.cameraPitch || 12;
      viewport.style.cursor = 'grabbing';
      try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!isOrbiting) return;
      const dx = e.clientX - orbitStartX;
      const dy = e.clientY - orbitStartY;
      state.cameraYaw = Math.round(((origYaw + dx * 0.35) % 360) * 10) / 10;
      state.cameraPitch = Math.max(-40, Math.min(75, Math.round((origPitch + dy * 0.35) * 10) / 10));
      renderNative3DCanvas(canvas, (window.topCustomizerState && window.topCustomizerState.currentTime) || 0);
      if (window.RegaarderContextualToolbar) {
        window.RegaarderContextualToolbar.updatePosition();
      }
    });

    const endOrbit = (e) => {
      if (isOrbiting) {
        isOrbiting = false;
        viewport.style.cursor = 'default';
        try { viewport.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    };
    viewport.addEventListener('pointerup', endOrbit);
    viewport.addEventListener('pointercancel', endOrbit);
  }

  window.renderRegaarderNative3DStage = function (container, templateId, isHover) {
    if (!container) return;
    if(!isHover&&container.querySelector('.rg-n3d-viewport')){renderNative3DCanvas(container.querySelector('canvas'),window.topCustomizerState?.currentTime||0);return;}
    if (!isHover) {state.meshEditor?.dispose();state.meshEditor = null;}
    container.innerHTML = buildNative3DStageHTML(templateId || TEMPLATE_ID, isHover);
    const canvas = container.querySelector('canvas');
    renderNative3DCanvas(canvas, 0.5);
    if (!isHover) {
      wireNative3DStageInteractions(container, templateId || TEMPLATE_ID);
    } else {
      ensureNative3DLoaded().then(() => {if (canvas.isConnected) renderNative3DCanvas(canvas, PREVIEW_TIMES[state.preset]);});
    }
  };

  window.renderProjectedMannequinScene = renderProjectedMannequinScene;
  window.syncStateToNativeScene = syncStateToNativeScene;
  window.ensureNative3DLoaded = ensureNative3DLoaded;
  window.setRegaarderNative3DPreset = function (preset) {
    if (!PRESET_SCENES[preset]) return;
    state.preset = preset;
    rebuildNativeSceneFromPreset();
  };

  window.stepRegaarderNative3DAnimation = function (container, templateId, elapsedSec) {
    if (!container) return;
    const canvas = container.querySelector(`[data-template-id="${templateId || TEMPLATE_ID}"] canvas`);
    if (!canvas) return;
    renderNative3DCanvas(canvas, elapsedSec);
  };

  window.applyRegaarderNative3DToolbarAction = function (actionType, objectKey, value) {
    if (!objectKey || !objectKey.startsWith('n3d_')) return false;
    state.editSession?.begin();
    queueMicrotask(()=>state.editSession?.commit());
    const off = state.actorOffsets[objectKey] || (state.actorOffsets[objectKey] = { x: 0, y: 0, rot: 0, opacity: 1 });
    if (actionType === 'select' || actionType === 'move') { state.editTool='orbit';state.objectDragMode=actionType==='move'?'move':'turn';
    } else if(actionType === 'style') {off.roughness=value==='matte'?.9:value==='metal'?.2:.46;off.metalness=value==='metal'?.8:0;
    } else if (actionType === 'color') {
      off.color = value;
      off.colorEdited = true;
      if (objectKey === 'n3d_actor_primary') {
        state.shirtColor = value;
        state.trousersColor = value;
      } else if (objectKey === 'n3d_prop_hat') {
        state.hatColor = value;
      }
    } else if (actionType === 'opacity') {
      off.opacity = Math.max(0.1, Math.min(1, Number(value) / 100));
    } else if (actionType === 'rotate') {
      const rotStep = Number(value) || 25;
      if (objectKey.startsWith('n3d_actor_')) {
        off.yaw = ((off.yaw || 0) + rotStep) % 360;
      } else {
        state.cameraYaw = (state.cameraYaw + rotStep) % 360;
      }
    } else if (actionType === 'align') {
      off.x = 0;
      off.y = 0;
      off.lift = 0;
      if (objectKey === 'n3d_actor_primary') off.rot = 90;
      if (objectKey === 'n3d_actor_secondary') off.rot = -65;
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
        <div class="rg-section-header"><span class="rg-section-title">Mesh & Skeleton</span></div>
        <div class="rg-section-body">
          <label class="rg-ctrl-label">Stage tool</label>
          <select class="rg-select" data-n3d-prop="editTool">
            ${Object.entries({orbit:'Hand · turn object / orbit background',select:'Select mesh region',box:'Box select vertices (through surface)',bone:'Move skeleton joint','guide-circle':'Draw ellipse guide','guide-box':'Draw box guide','guide-line':'Draw line guide',grab:'Drag mesh region',inflate:'Sculpt · inflate',smooth:'Sculpt · smooth'}).map(([k,v])=>`<option value="${k}" ${state.editTool===k?'selected':''}>${v}</option>`).join('')}
          </select>
          <label><input type="checkbox" data-n3d-bool="showTopology" ${state.showTopology?'checked':''}> Topology & vertices</label>
          <label><input type="checkbox" data-n3d-bool="showBones" ${state.showBones?'checked':''}> Skeleton</label>
          <div class="rg-ctrl-row"><label class="rg-ctrl-label">Region radius</label><input type="range" min="0.015" max="0.2" step="0.005" value="${state.brushRadius}" data-n3d-num="brushRadius"></div>
          <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="rg-btn-secondary" data-n3d-action="undo-mesh">Undo</button><button class="rg-btn-secondary" data-n3d-action="redo">Redo</button><button class="rg-btn-secondary" data-n3d-action="save">Save in browser</button><button class="rg-btn-secondary" data-n3d-action="load">Restore saved</button></div>
          <label class="rg-ctrl-label">Selection</label><select class="rg-select" data-n3d-prop="selectionScope"><option value="region" ${(!state.selectionScope||state.selectionScope==='region')?'selected':''}>Connected region</option><option value="surface" ${state.selectionScope==='surface'?'selected':''}>Whole surface</option><option value="actor" ${state.selectionScope==='actor'?'selected':''}>Selected actor (numeric move)</option><option value="all" ${state.selectionScope==='all'?'selected':''}>All actors (numeric move)</option></select>
          <label class="rg-ctrl-label">Move axis</label><select class="rg-select" data-n3d-prop="moveAxis">${['free','x','y','z'].map(k=>`<option value="${k}" ${(state.moveAxis||'free')===k?'selected':''}>${k==='free'?'Free movement':k.toUpperCase()}</option>`).join('')}</select>
          <label>View target X<input type="number" step="0.001" value="${(state.cameraTarget||[0,1.1,0])[0]}" data-n3d-target="0"></label><label>View target Y<input type="number" step="0.001" value="${(state.cameraTarget||[0,1.1,0])[1]}" data-n3d-target="1"></label><label>View target Z<input type="number" step="0.001" value="${(state.cameraTarget||[0,1.1,0])[2]}" data-n3d-target="2"></label>
          <label>Snap (mm)<input class="rg-input" type="number" min="0" max="100" step="0.1" value="${state.snapMillimetres||0}" data-n3d-num="snapMillimetres"></label>
          <label>Precision move (mm)<input class="rg-input" type="number" step="0.1" value="1" data-n3d-distance></label>
          <div style="display:flex;gap:6px;flex-wrap:wrap">${['x','y','z'].map((a,i)=>`<button class="rg-btn-secondary" data-n3d-move="${i}">Move ${a.toUpperCase()}</button>`).join('')}<button class="rg-btn-secondary" data-n3d-action="round">Round region</button><button class="rg-btn-secondary" data-n3d-action="flatten">Flatten region</button><button class="rg-btn-secondary" data-n3d-action="straighten">Straighten actor</button><button class="rg-btn-secondary" data-n3d-action="clearGuides">Clear guides</button></div>
          <p role="status" data-n3d-feedback style="font-size:11px;color:#c4b5fd"></p>
          <p style="font-size:11px;color:#94a3b8">Shift-click adds a region. Box selects through one surface. Joint drag rotates the selected joint; use Motion for exact angles. Guides stay fixed on screen for calibration. Ctrl/Cmd-Z undoes, Shift-Z redoes.</p>
        </div>
      </div>

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

    const boneNames = state.nativeData?.joints || ['head','wrist.L','wrist.R','foot.L','foot.R'];
    const selectedActorNodes=state.nativeScene?.nodes.filter(n=>n.type==='humanoid')||[];
    const selectedActor=selectedActorNodes.find((n,i)=>n.id===state.selectedBoneActor||actorObjectId(n,i)===state.activeActor)||selectedActorNodes[0];
    const selectedRotation=selectedActor?.bones?.[state.selectedBone]?.rotation||[0,0,0];
    const motionHtml = `
      <div class="rg-inspector-section"><div class="rg-section-header"><span class="rg-section-title">Selected Actor · Bone Rotation</span></div><div class="rg-section-body">
      <select class="rg-select" data-n3d-prop="selectedBone">${boneNames.map(k=>`<option ${k===state.selectedBone?'selected':''}>${k}</option>`).join('')}</select>
      ${['X','Y','Z'].map((axis,i)=>`<div class="rg-ctrl-row"><label>${axis} rotation</label><input type="range" min="-90" max="90" step="0.1" value="${selectedRotation[i]}" data-n3d-bone-axis="${i}"></div>`).join('')}
      </div></div>

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
            <input type="range" class="rg-range" min="0.05" max="64" step="0.05" value="${state.cameraZoom}" data-n3d-num="cameraZoom">
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

    const feedback=text=>{const el=modalEl.querySelector('[data-n3d-feedback]');if(el)el.textContent=text;};
    modalEl.querySelectorAll('[data-n3d-action]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.n3dAction;try{if(!state.meshEditor)throw Error('Wait for the 3D scene to finish loading');if(action==='undo-mesh')state.meshEditor.undo();else if(['redo','save','load','straighten','clearGuides'].includes(action))state.meshEditor[action]();else if(['round','flatten'].includes(action))state.meshEditor.shape(action);else return;feedback(action==='save'?'Saved on this browser.':'Edit applied.');}catch(e){feedback(e.message);}}));
    modalEl.querySelectorAll('[data-n3d-target]').forEach(input=>input.addEventListener('change',()=>{const v=Number(input.value);if(!Number.isFinite(v))return;state.editSession?.begin();state.cameraTarget||=[0,1.1,0];state.cameraTarget[Number(input.dataset.n3dTarget)]=v;state.editSession?.commit();window.stepRegaarderNative3DAnimation(document.getElementById('tpl-modal-preview-stage'),TEMPLATE_ID,0);}));
    modalEl.querySelectorAll('[data-n3d-move]').forEach(button=>button.addEventListener('click',()=>{try{const amount=Number(modalEl.querySelector('[data-n3d-distance]').value);if(!Number.isFinite(amount)||Math.abs(amount)>150)throw Error('Use a movement between -150 and 150 mm');const delta=[0,0,0];delta[Number(button.dataset.n3dMove)]=amount/1000;state.meshEditor?.move(delta);}catch(e){feedback(e.message);}}));
    modalEl.querySelectorAll('[data-n3d-bone-axis]').forEach(input=>{input.addEventListener('pointerdown',()=>state.editSession?.begin());input.addEventListener('change',()=>state.editSession?.commit());});
    modalEl.querySelectorAll('[data-n3d-bone-axis]').forEach(input => input.addEventListener('input', () => {
      const actors = state.nativeScene?.nodes.filter(n=>n.type==='humanoid') || [];
      const node = actors.find((n,i)=>n.id===state.selectedBoneActor||actorObjectId(n,i)===state.activeActor) || actors[0];
      if (!node) return;
      state.editSession?.begin();
      node.bones ||= {};
      const bone = node.bones[state.selectedBone] ||= {rotation:[0,0,0]};
      bone.rotation ||= [0,0,0];
      bone.rotation[Number(input.dataset.n3dBoneAxis)] = Number(input.value);
      if (node.boneTracks) delete node.boneTracks[state.selectedBone];
      state.editScene=null;
      state.editSession?.commit();
      const stage = document.getElementById('tpl-modal-preview-stage');
      window.stepRegaarderNative3DAnimation(stage, TEMPLATE_ID, 0);
    }));
    const uvCanvas = modalEl.querySelector('[data-role="n3d-uv-canvas"]');
    if (uvCanvas) renderUVPreviewCanvas(uvCanvas);

    modalEl.querySelectorAll('[data-action="open-3d-workshop"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (typeof window.openNative3DWorkshop === 'function') {
          window.openNative3DWorkshop();
        }
      });
    });

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
        state.editSession?.begin();
        state[k] = sel.value;
        if(k==='editTool'&&sel.value==='bone')state.showBones=true;
        if(k==='pose'){
          const actors=state.nativeScene?.nodes.filter(n=>n.type==='humanoid')||[];
          const node=actors.find((n,i)=>n.id===state.selectedBoneActor||actorObjectId(n,i)===state.activeActor)||actors[0];
          if(node){node.pose=sel.value;delete node.tracks?.pose;state.editScene=null;}
        }
        if (k === 'preset' && PRESET_SCENES[sel.value]) {
          state.backgroundHex = PRESET_SCENES[sel.value].background;
          state.shirtColor = PRESET_SCENES[sel.value].primaryColor;
          rebuildNativeSceneFromPreset();
        }
        state.editSession?.commit();
        document.querySelectorAll('[data-n3d-preset]').forEach(button=>{const active=button.dataset.n3dPreset===state.preset;button.classList.toggle('is-active',active);button.style.background=active?'#6d28d9':'transparent';button.style.color=active?'#fff':'#94a3b8';});
        refreshStage();
      });
    });

    modalEl.querySelectorAll('[data-n3d-num],[data-n3d-bool]').forEach(input=>{input.addEventListener('pointerdown',()=>state.editSession?.begin());input.addEventListener('change',()=>state.editSession?.commit());});
    modalEl.querySelectorAll('[data-n3d-num]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const k = inp.getAttribute('data-n3d-num');
        state.editSession?.begin();
        state[k] = parseFloat(inp.value);
        if (k === 'legLength') state.armLength = state[k];
        if(k==='leanAngle'||k==='handCurl'){
          const actors=state.nativeScene?.nodes.filter(n=>n.type==='humanoid')||[];
          const node=actors.find((n,i)=>n.id===state.selectedBoneActor||actorObjectId(n,i)===state.activeActor)||actors[0];
          if(node){if(k==='leanAngle'){node.leanAngle=state[k];delete node.tracks?.leanAngle;}else{node.handPose={L:state[k],R:state[k]};node.handPoseTracks={};}state.editScene=null;}
        }
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
            syncStateToNativeScene();
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
