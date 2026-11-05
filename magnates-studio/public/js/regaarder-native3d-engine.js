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
      label: '01 Handshake · Paired Contact', shortLabel: '01 Handshake', previewTime: 1.95,
      description: 'Two anatomical characters with finger-contact grip solver & studio softboxes',
      background: '#141820',
      primaryColor: '#137cba',
      secondaryColor: '#dedbca'
    },
    checkpoint: {
      id: 'checkpoint',
      label: '02 14:55 Crimson Seated & Coach', shortLabel: '02 Seated & Coach', previewTime: 1.8,
      description: 'Seated crimson figure in chair at desk, cream coach with brimmed hat & depth smoke',
      background: '#220406',
      primaryColor: '#9d1514',
      secondaryColor: '#eee9da'
    },
    team: {
      id: 'team',
      label: '03 Three Red Players Formation', shortLabel: '03 Red Trio', previewTime: 0.65,
      description: 'Trio formation with independent bone poses, wardrobe & rim lighting',
      background: '#17080a',
      primaryColor: '#b91c1c',
      secondaryColor: '#f8fafc'
    },
    humanoid: {
      id: 'humanoid',
      label: '04 Anatomical Mannequin Studio', shortLabel: '04 Mannequin', previewTime: 0.5,
      description: 'Single mannequin for multiresolution sculpting, UV projection & vertex painting',
      background: '#11151b',
      primaryColor: '#7d8c9d',
      secondaryColor: '#343e4b'
    },
    blue: {
      id: 'blue',
      label: '05 Blue & Cream Coach', shortLabel: '05 Blue & Coach', previewTime: 0.5,
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
    nativeEngine: null,
    nativeScene: null,
    nativeData: null,
    nativeMods: null,
    nativeSceneDirty: false,
    savedScenes: {},
    sceneTime: 0.5,
    inlineEditor: null
  };

  window.REGAARDER_NATIVE3D_CONFIG = state;

  function getActiveStageObjects(preset = state.preset) {
    if (preset === 'checkpoint') {
      return [
        { id: 'n3d_actor_crimson', name: 'Seated Red Figure', variant: 'media', x: 30, y: 56, w: 24, h: 68 },
        { id: 'n3d_actor_coach', name: 'Secondary Coach Rig', variant: 'media', x: 68, y: 54, w: 24, h: 72 },
        { id: 'n3d_prop_hat', name: 'Tailored Brimmed Hat', variant: 'shape', x: 68, y: 35, w: 14, h: 12 },
        { id: 'n3d_prop_desk', name: 'Studio Desk & Chair Prop', variant: 'shape', x: 44, y: 70, w: 34, h: 24 }
      ];
    }
    if (preset === 'team') {
      return [
        { id: 'n3d_actor_p1', name: 'Left Wing Player', variant: 'media', x: 28, y: 56, w: 22, h: 70 },
        { id: 'n3d_actor_primary', name: 'Primary Humanoid Rig', variant: 'media', x: 50, y: 53, w: 22, h: 72 },
        { id: 'n3d_actor_secondary', name: 'Secondary Coach Rig', variant: 'media', x: 72, y: 56, w: 22, h: 70 }
      ];
    }
    if (preset === 'humanoid') {
      return [
        { id: 'n3d_actor_primary', name: 'Anatomical Mannequin', variant: 'media', x: 50, y: 54, w: 24, h: 74 }
      ];
    }
    return [
      { id: 'n3d_actor_primary', name: 'Primary Humanoid Rig', variant: 'media', x: 38, y: 56, w: 22, h: 72 },
      { id: 'n3d_actor_secondary', name: 'Secondary Coach Rig', variant: 'media', x: 62, y: 54, w: 22, h: 72 },
      { id: 'n3d_prop_hat', name: 'Tailored Brimmed Hat', variant: 'shape', x: 62, y: 35, w: 14, h: 12 }
    ];
  }

  const STAGE_OBJECTS = getActiveStageObjects('blue');

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
    if (state.savedScenes[state.preset]) {
      state.nativeScene = structuredClone(state.savedScenes[state.preset]);
      state.nativeSceneDirty = true;
    } else {
      state.nativeSceneDirty = false;
    }
    syncStateToNativeScene();
  }

  function syncStateToNativeScene() {
    const sc = state.nativeScene;
    if (!sc || !Array.isArray(sc.nodes) || state.nativeSceneDirty) return;
    sc.background = state.backgroundHex;
    sc.lighting = sc.lighting || {};
    sc.lighting.exposure = state.exposure;
    sc.lighting.ambient = state.ambientIntensity;

    const cam = sc.nodes.find((n) => n.type === 'camera');
    if (cam) {
      cam.fov = state.cameraFov;
      const radYaw = ((state.cameraYaw || 18) * Math.PI) / 180;
      const radPitch = ((state.cameraPitch || 12) * Math.PI) / 180;
      const radius = 4.3;
      cam.position = [
        Math.sin(radYaw) * Math.cos(radPitch) * radius,
        1.2 + Math.sin(radPitch) * radius,
        Math.cos(radYaw) * Math.cos(radPitch) * radius
      ];
      cam.target = [0, 1.2, 0];
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
    // The source's handshake and red-team rigs carry intentionally authored poses, materials,
    // lights and animated locations. Do not overwrite them with the blue-pair defaults.
    if (!['blue', 'checkpoint'].includes(state.preset)) {
      humanoids.forEach((h) => { h.wireframe = !!state.wireframe; });
      return;
    }
    if (state.preset === 'checkpoint') {
      const redNode = sc.nodes.find((n) => n.id === 'red') || humanoids[0];
      const rOff = state.actorOffsets.n3d_actor_crimson || state.actorOffsets.n3d_actor_primary || {};
      if (redNode) {
        redNode.wireframe = !!state.wireframe;
        redNode.position = [-0.94 + ((rOff.x || 0) * 0.003), -((rOff.y || 0) * 0.003), 0.6];
        redNode.rotation = [0, typeof rOff.rot === 'number' ? rOff.rot : 90, 0];
        redNode.leanAngle = 65;
        redNode.pose = 'seated';
        redNode.material = redNode.material || {};
        redNode.material.color = '#9d1514';
        redNode.parts = redNode.parts || {};
        redNode.parts.shirt = { ...(redNode.parts.shirt || {}), color: '#9d1514', visible: true };
        redNode.parts.trousers = { ...(redNode.parts.trousers || {}), color: '#7f1212', visible: true };
        redNode.visible = true;
      }
      const coachNode = sc.nodes.find((n) => n.id === 'coach') || humanoids[1];
      const cOff = state.actorOffsets.n3d_actor_coach || state.actorOffsets.n3d_actor_secondary || {};
      if (coachNode) {
        coachNode.wireframe = !!state.wireframe;
        coachNode.position = [0.83 + ((cOff.x || 0) * 0.003), -((cOff.y || 0) * 0.003), -0.15];
        coachNode.rotation = [0, typeof cOff.rot === 'number' ? cOff.rot : 90, 0];
        coachNode.pose = 'folded';
        coachNode.material = coachNode.material || {};
        coachNode.material.color = '#e0ded0';
        coachNode.parts = coachNode.parts || {};
        coachNode.parts.shirt = { ...(coachNode.parts.shirt || {}), color: '#e0ded0', visible: true };
        coachNode.parts.trousers = { ...(coachNode.parts.trousers || {}), color: '#cdc8b8', visible: true };
        coachNode.parts.hat = { ...(coachNode.parts.hat || {}), visible: true, color: state.hatColor };
        coachNode.visible = true;
      }
      sc.nodes.filter((n) => n.id.startsWith('table-') || n.id.startsWith('chair-') || n.id === 'smoke-back').forEach((n) => {
        n.visible = true;
      });
    } else {
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
          h.parts.trousers = { ...(h.parts.trousers || {}), visible: state.trousersVisible, color: state.trousersColor || state.shirtColor, roughness: state.roughness };

          const pOff = state.actorOffsets.n3d_actor_primary || {};
          h.rotation = h.rotation || [0, 90, 0];
          if (typeof pOff.rot === 'number') {
            h.rotation[1] = pOff.rot;
          }
          if (typeof pOff.x === 'number') {
            h.position = h.position || [-0.65, 0, 0.3];
            h.position[0] = -0.65 + (pOff.x * 0.003);
          }
          if (typeof pOff.y === 'number') {
            h.position = h.position || [-0.65, 0, 0.3];
            h.position[1] = -(pOff.y * 0.003);
          }
        } else if (idx === 1) {
          const sOff = state.actorOffsets.n3d_actor_secondary || {};
          h.rotation = h.rotation || [0, -65, 0];
          if (typeof sOff.rot === 'number') {
            h.rotation[1] = sOff.rot;
          }
          if (typeof sOff.x === 'number') {
            h.position = h.position || [0.65, 0, -0.6];
            h.position[0] = 0.65 + (sOff.x * 0.003);
          }
          if (typeof sOff.y === 'number') {
            h.position = h.position || [0.65, 0, -0.6];
            h.position[1] = -(sOff.y * 0.003);
          }
          const hatOff = state.actorOffsets.n3d_prop_hat || {};
          h.parts = h.parts || {};
          h.parts.hat = {
            ...(h.parts.hat || {}),
            visible: state.hatVisible,
            color: state.hatColor,
            lift: (hatOff.lift || 0),
            offsetX: (hatOff.x || 0) * 0.002
          };
        }
      });
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

    const actorsByPreset = {
      checkpoint: [['n3d_actor_crimson', 'red'], ['n3d_actor_coach', 'coach']],
      handshake: [['n3d_actor_primary', 'final-blue'], ['n3d_actor_secondary', 'final-coach']],
      team: [['n3d_actor_p1', 'final-player-0'], ['n3d_actor_primary', 'final-player-1'], ['n3d_actor_secondary', 'final-player-2']],
      humanoid: [['n3d_actor_primary', 'humanoid']],
      blue: [['n3d_actor_primary', 'blue'], ['n3d_actor_secondary', 'coach']]
    };
    for (const [overlayId, nodeId] of (actorsByPreset[state.preset] || actorsByPreset.blue)) {
      const character = engine.characters.get(nodeId);
      if (!character?.group) continue;
      const bounds = calcBounds(character.group);
      if (bounds) applyBoxToHitElement(viewport, overlayId, bounds);
      if (nodeId === 'coach' || nodeId === 'final-coach') {
        let hat = character.hat;
        if (!hat) character.group.traverse((child) => {
          if (!hat && child.name?.toLowerCase().includes('hat')) hat = child;
        });
        const hatBounds = hat && calcBounds(hat);
        if (hatBounds) applyBoxToHitElement(viewport, 'n3d_prop_hat', hatBounds);
      }
    }
    const desk = viewport.querySelector('[data-n3d-obj="n3d_prop_desk"]');
    if (desk) desk.style.display = state.preset === 'checkpoint' ? 'block' : 'none';
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

    if (state.nativeReady && state.nativeEngine && state.nativeScene) {
      try {
        syncStateToNativeScene();
        const dur = state.nativeScene.duration || 5;
        const isStillEditMode = !!window.topCustomizerState?.is3DMode;
        const rawTime = isStillEditMode ? state.sceneTime : Number(timeSec);
        const t = Math.max(0, Number(rawTime) || 0) % dur;
        state.nativeEngine.render(state.nativeScene, t);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(state.nativeEngine.canvas, 0, 0, canvas.width, canvas.height);
        updateHitBoxesFrom3DScene(canvas);
        return;
      } catch (e) {
        // Fallback to projected renderer if WebGL context unavailable
      }
    }
    renderProjectedMannequinScene(ctx, timeSec || 0);
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
      <div class="rg-n3d-presets-bar" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:30;display:flex;max-width:calc(100% - 18px);overflow-x:auto;align-items:center;gap:6px;white-space:nowrap;background:rgba(15,19,28,0.92);border:1px solid rgba(255,255,255,0.12);padding:4px 8px;border-radius:24px;backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,0.6);">
        ${Object.values(PRESET_SCENES).map((p) => `
          <button type="button" class="rg-n3d-preset-pill ${state.preset === p.id ? 'is-active' : ''}" data-n3d-preset="${p.id}" title="${p.description}" style="white-space:nowrap;flex-shrink:0;padding:5px 12px;border-radius:14px;border:none;cursor:pointer;font-size:11px;font-weight:700;color:${state.preset === p.id ? '#ffffff' : '#94a3b8'};background:${state.preset === p.id ? '#6d28d9' : 'transparent'};transition:all 0.15s ease;">
            ${p.shortLabel}
          </button>
        `).join('')}
        <button type="button" data-n3d-open-workspace title="Edit the real vertex, edge, face and skeletal geometry" style="flex-shrink:0;white-space:nowrap;padding:5px 11px;border-radius:14px;border:1px solid #a78bfa;color:white;background:#4c1d95;font-size:11px;font-weight:700;cursor:pointer">Mesh / Rig Editor</button>
      </div>
    ` : '';

    return `
      <div id="regaarder-n3d-viewport-${suffix}" class="rg-n3d-viewport" data-template-id="${templateId}" style="position:relative;width:100%;height:100%;background:#0b0f17;overflow:hidden;display:flex;align-items:center;justify-content:center;user-select:none;cursor:default;">
        <canvas id="regaarder-n3d-canvas-${suffix}" width="960" height="540" style="width:100%;height:100%;object-fit:contain;display:block;cursor:default;"></canvas>
        ${hitOverlayHtml}
        ${presetPillsHtml}
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

    viewport.querySelectorAll('[data-n3d-preset]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pKey = btn.getAttribute('data-n3d-preset');
        if (pKey && PRESET_SCENES[pKey]) {
          state.preset = pKey;
          state.sceneTime = PRESET_SCENES[pKey].previewTime;
          state.autoOrbit = false;
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

    const workbench = viewport.querySelector('[data-n3d-open-workspace]');
    if (workbench) workbench.addEventListener('click', (e) => {
      e.stopPropagation();
      openIntegratedMeshEditor(viewport);
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
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = off.x || 0;
        origY = off.y || 0;
        origRot = typeof off.rot === 'number' ? off.rot : (objId === 'n3d_actor_primary' ? 90 : (objId === 'n3d_actor_secondary' ? -65 : 0));
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
          if (objId === 'n3d_actor_primary' || objId === 'n3d_actor_secondary') {
            // Turning the humanoid using the hand cursor in 3D mode:
            // Horizontal drag turns / rotates the character (yaw) in real-time
            const deltaYaw = dx * 0.75;
            off.rot = Math.round((origRot + deltaYaw) * 10) / 10;
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
      if (e.target.closest('[data-n3d-obj],button,.rg-n3d-presets-bar')) return;
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

  // A real V108 geometry workspace in the same application, not a decorative 2D mesh overlay.
  // The original Motion editor owns Three.js raycasting, vertex/edge/face selection,
  // orange selection markers, sculpt brush strokes, bone gizmos and history.
  async function openIntegratedMeshEditor(viewport) {
    if (state.inlineEditor) return;
    state.inlineEditor = { loading: true };
    let host, api;
    try {
      await ensureNative3DLoaded();
      if (!state.nativeReady || !state.nativeData || !state.nativeScene) {
        throw Error('Native WebGL humanoid assets are unavailable; the 2D preview cannot provide mesh editing.');
      }
      if (!document.getElementById('rg-native-editor-css')) {
        const sheet = document.createElement('link');
        sheet.id = 'rg-native-editor-css';
        sheet.rel = 'stylesheet';
        sheet.href = '/native3d-v97/editor.css';
        document.head.append(sheet);
      }
      host = document.createElement('section');
      host.className = 'rg-native-integrated-editor';
      host.setAttribute('role', 'region');
      host.setAttribute('aria-label', 'Native mesh and rig editor');
      host.style.cssText = 'position:fixed;inset:44px 14px 12px;z-index:2147483000;background:#11151b;color:#fff;border:1px solid #6d28d9;border-radius:14px;box-shadow:0 28px 90px #000e;overflow:auto;';
      document.body.appendChild(host);
      const editorMod = await import('/native3d-v97/editor.js');
      const exportMod = await import('/native3d-v97/export.js');
      const activePreset = state.preset;
      state.autoOrbit = false;
      const close = () => {
        if (state.inlineEditor?.api) state.inlineEditor.api.dispose();
        host?.remove();
        window.removeEventListener('keydown', onEscape, true);
        state.inlineEditor = null;
        if (viewport?.isConnected) {
          const canvas = viewport.querySelector('canvas');
          if (canvas) renderNative3DCanvas(canvas, state.sceneTime);
        }
      };
      const onEscape = (event) => {
        if (event.key === 'Escape' && !event.target.closest('input,textarea,select')) {
          event.preventDefault();
          close();
        }
      };
      host.addEventListener('click', (event) => {
        if (event.target.closest('[data-act="close"]')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          close();
        }
      }, true);
      window.addEventListener('keydown', onEscape, true);
      api = editorMod.mountNativeEditor(host, structuredClone(state.nativeScene), state.nativeData, {
        onSave(next) {
          state.savedScenes[activePreset] = structuredClone(next);
          if (state.preset === activePreset) {
            state.nativeScene = structuredClone(next);
            state.nativeSceneDirty = true;
            const canvas = viewport?.querySelector('canvas');
            if (canvas) renderNative3DCanvas(canvas, state.sceneTime);
          }
        },
        async onExportGLB(next) {
          await exportMod.downloadGLB(await exportMod.exportNativeGLB(next, state.nativeData));
        }
      });
      state.inlineEditor = { host, api, close };
      host.querySelector('.n3-top strong')?.replaceChildren(document.createTextNode('Regaarder Motion · Editable 3D Mesh & Rig'));
      // Video playback belongs to Video mode. Native bone/sculpt controls remain interactive.
      const timeline = host.querySelector('.n3-timeline');
      if (timeline) timeline.style.display = 'none';
      host.querySelector('[data-act="close"]')?.setAttribute('title', 'Return to the studio 3D viewport');
    } catch (err) {
      if (api) api.dispose();
      host?.remove();
      state.inlineEditor = null;
      console.error('[RegaarderNative3D] Mesh editor integration failed:', err);
      if (viewport) {
        const warning = document.createElement('div');
        warning.textContent = 'Mesh workspace unavailable: ' + err.message;
        warning.style.cssText = 'position:absolute;top:40px;left:12px;z-index:60;background:#42151b;color:#fff;padding:9px;border-radius:8px';
        viewport.append(warning);
        setTimeout(() => warning.remove(), 6000);
      }
    }
  }

  window.openNative3DWorkshop = () => {
    const viewport = document.querySelector('.rg-n3d-viewport:not([id*="hover"])');
    if (viewport) return openIntegratedMeshEditor(viewport);
    throw Error('Open the Native 3D Surface Builder stage first.');
  };

  window.renderRegaarderNative3DStage = function (container, templateId, isHover) {
    if (!container) return;
    container.innerHTML = buildNative3DStageHTML(templateId || TEMPLATE_ID, isHover);
    const canvas = container.querySelector('canvas');
    renderNative3DCanvas(canvas, 0.5);
    if (!isHover) {
      wireNative3DStageInteractions(container, templateId || TEMPLATE_ID);
    }
  };

  window.renderProjectedMannequinScene = renderProjectedMannequinScene;
  window.syncStateToNativeScene = syncStateToNativeScene;

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
      if (objectKey === 'n3d_actor_primary') {
        state.shirtColor = value;
        state.trousersColor = value;
      } else if (objectKey === 'n3d_prop_hat') {
        state.hatColor = value;
      } else if (objectKey === 'n3d_actor_secondary') {
        state.keyLightColor = value;
      }
    } else if (actionType === 'opacity') {
      off.opacity = Math.max(0.1, Math.min(1, Number(value) / 100));
    } else if (actionType === 'rotate') {
      const rotStep = Number(value) || 25;
      if (objectKey === 'n3d_actor_primary' || objectKey === 'n3d_actor_secondary') {
        off.rot = ((off.rot || 0) + rotStep) % 360;
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
        <div class="rg-section-header"><span class="rg-section-title">3D Mesh, Topology & Rigging Workshop</span></div>
        <div class="rg-section-body">
          <button type="button" class="rg-btn-primary" data-action="open-3d-workshop" style="width:100%;padding:9px 12px;background:linear-gradient(135deg, #7c3aed, #4f46e5);color:#fff;border:none;border-radius:8px;font-weight:700;font-size:11.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px rgba(124,58,237,0.35);">
            <span>🛠️</span> Open 3D Mesh & Rigging Workshop
          </button>
          <div style="font-size:10px;color:#94a3b8;margin-top:6px;line-height:1.4;">
            Launch the full native 3D viewport with wireframe topology, vertex sculpting brushes (Smooth, Grab, Inflate), and bone rigging.
          </div>
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
