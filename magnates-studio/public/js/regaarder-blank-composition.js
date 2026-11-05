/**
 * ============================================================================
 * REGAARDER STUDIO — BLANK COMPOSITION STUDIO ENGINE
 * ============================================================================
 * Ported from Regaarder-Motion (composition-core.js, animation-instance.js,
 * path-motion.js, scene-geometry.js) into Magnates Studio's unified stage,
 * 4-Tab Contextual Inspector (Content, Motion, Look, Effects + Advanced Controls),
 * and Universal Contextual Toolbar (window.RegaarderContextualToolbar).
 * ============================================================================
 */
(function () {
  'use strict';

  // 1. CAPABILITY REGISTRY
  const capabilityRegistry = new Map();

  function registerCapability(id, def) {
    capabilityRegistry.set(id, { id, ...def });
  }

  const BASE_CAPABILITIES = [
    { id: 'image', label: 'Image / Video Plane', category: 'Media & Cutouts', kind: 'asset' },
    { id: 'image3d', label: 'Image on 3D Plane', category: '3D Spatial', kind: 'asset' },
    { id: 'text', label: 'Stroke-Written Typography', category: 'Typography', kind: 'text' },
    { id: 'fireOverlay', label: 'Living Flame & Embers', category: 'Shaders & FX', kind: 'overlay' },
    { id: 'cloudOverlay', label: 'Atmospheric Cloud Drift', category: 'Atmosphere', kind: 'overlay' },
    { id: 'surface', label: 'Procedural Surface Reveal', category: 'Organic Reveal', kind: 'overlay' },
    { id: 'object3d', label: '3D Primitive Object', category: '3D Spatial', kind: '3D' },
    { id: 'region', label: 'Color Division & Traced Region', category: 'Graphic Design', kind: 'overlay' },
    { id: 'adjustment', label: 'Live Adjustment (Blur / Fade / Exposure)', category: 'Post FX', kind: 'adjustment' }
  ];

  BASE_CAPABILITIES.forEach((c) => capabilityRegistry.set(c.id, c));

  function discoverTemplateCapabilities() {
    if (window.EFFECT_TEMPLATES_DATA && Array.isArray(window.EFFECT_TEMPLATES_DATA)) {
      window.EFFECT_TEMPLATES_DATA.forEach((tpl) => {
        capabilityRegistry.set('template:' + tpl.id, {
          id: 'template:' + tpl.id,
          label: tpl.name || tpl.title || tpl.id,
          category: 'Documentary Templates',
          templateId: tpl.id
        });
      });
    }
  }

  // 2. COMPOSITION STATE & DEFAULTS
  const DEFAULT_COMPOSITION = {
    version: 1,
    schema: 'regaarder-composition-v1',
    name: 'Untitled Composition',
    width: 960,
    height: 540,
    duration: 20,
    background: '#080b10',
    layers: [],
    context: {
      transcript: '',
      intent: 'Documentary sequence built from modular layers',
      metaphor: 'Multi-layer archival collage with kinetic motion',
      soundPlan: 'Subtle atmospheric room tone, archival tape hum, and rhythmic cues'
    }
  };

  let composition = null;
  try {
    const raw = localStorage.getItem('motion-blank');
    composition = raw ? { ...DEFAULT_COMPOSITION, ...JSON.parse(raw) } : { ...DEFAULT_COMPOSITION };
  } catch (e) {
    composition = { ...DEFAULT_COMPOSITION };
  }

  let selectedLayerId = null;
  let playheadTime = 0;
  let isPlaying = false;
  let lastTimestamp = 0;
  let activeTab = 'content';
  let modalMounted = false;

  function saveComposition() {
    try {
      localStorage.setItem('motion-blank', JSON.stringify(composition));
    } catch (e) {}
  }

  function getComposition() {
    return JSON.parse(JSON.stringify(composition));
  }

  // Easing helper
  function motionEase(t) {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }

  // Calculate active span of a layer accounting for playback settings
  function getLayerSpan(layer) {
    const pb = layer.playback || {};
    const spd = Math.max(0.05, Number(pb.speed) || 1);
    const del = Math.max(0, Number(pb.delay) || 0);
    const pause = Math.max(0, Number(pb.pauseFor) || 0);
    return del + (layer.duration / spd) + pause;
  }

  // Compute normalized progress for layer at given composition playhead time
  function sampleLayerProgress(layer, compTime) {
    const span = getLayerSpan(layer);
    if (compTime < layer.start || compTime > layer.start + span) {
      return { active: false, time: 0, progress: 0 };
    }
    const pb = layer.playback || {};
    const spd = Math.max(0.05, Number(pb.speed) || 1);
    const del = Math.max(0, Number(pb.delay) || 0);
    const local = Math.max(0, compTime - layer.start - del);

    let progress = Math.min(1, (local * spd) / Math.max(0.1, layer.duration));
    if (pb.reverse) progress = 1 - progress;

    if (pb.slowFast) {
      const sStart = pb.slowStart || 0.3;
      const sEnd = pb.slowEnd || 0.65;
      if (progress < sStart) {
        progress = progress * (pb.slowSpeed || 0.4);
      } else if (progress > sEnd) {
        progress = progress * (pb.fastSpeed || 1.8);
      }
    }

    if (pb.ease === 'in') progress = Math.pow(progress, 2);
    else if (pb.ease === 'out') progress = 1 - Math.pow(1 - progress, 2);
    else if (pb.ease === 'smooth') progress = motionEase(progress);

    return {
      active: true,
      time: local,
      progress: Math.max(0, Math.min(1, progress))
    };
  }

  // 3. LAYER FACTORY
  function createBlankLayer(type) {
    const cap = capabilityRegistry.get(type) || { label: type };
    const id = 'layer_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    const layer = {
      id,
      type,
      name: cap.label || 'New Layer',
      start: playheadTime || 0,
      duration: 8,
      visible: true,
      opacity: 1,
      blur: 0,
      blend: 'source-over',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      tilt: 0,
      endX: 0,
      endY: 0,
      endScale: 1,
      endRotation: 0,
      endTilt: 0,
      assetId: '',
      params: {},
      playback: {
        speed: 1,
        reverse: false,
        delay: 0,
        pauseAt: 0.5,
        pauseFor: 0,
        ease: 'linear',
        slowFast: false,
        slowStart: 0.3,
        slowEnd: 0.65,
        slowSpeed: 0.4,
        fastSpeed: 2
      },
      context: {
        intent: 'Visual component in sequence',
        metaphor: 'Atmospheric narrative element',
        generationPrompt: '',
        soundCue: ''
      }
    };

    if (type === 'image' || type === 'image3d') {
      layer.params = {
        cityDuration: 8,
        cityFlyTime: 8,
        cityStartElevation: 45,
        cityEndElevation: 80,
        cityRoll: -6,
        cityEndRoll: 0,
        cityEdgeBlur: 4,
        cityStartDistance: 24,
        cityEndDistance: 16,
        cityHeading: 0,
        cityTurns: 0.15,
        cityRegions: []
      };
    } else if (type === 'text') {
      layer.params = {
        text: 'NARRATIVE STATEMENT',
        fontFamily: 'Inter',
        color: '#f5f5f7',
        size: 54,
        style: 'brush', // brush | ink | chalk
        letterSpacing: 2,
        writeDuration: 3.5
      };
    } else if (type === 'fireOverlay') {
      layer.params = {
        fireStyle: 'classic',
        fireWildness: 65,
        fireSpeed: 55,
        fireSize: 85,
        fireWind: 5,
        fireColor: '#ff681f'
      };
    } else if (type === 'cloudOverlay') {
      layer.params = {
        density: 0.6,
        driftSpeed: 12,
        feather: 24,
        tint: '#c8d4e0'
      };
    } else if (type === 'surface') {
      layer.params = {
        surfaceType: 'soil', // soil | snow | clouds
        roughness: 9,
        feather: 9,
        particles: 18,
        color: '#73553b'
      };
    } else if (type === 'object3d') {
      layer.params = {
        primitive: 'box', // box | sphere | torus | cone
        objectColor: '#9353f5',
        spinX: 0.2,
        spinY: 0.4,
        spinZ: 0.1
      };
    } else if (type === 'region') {
      layer.params = {
        color: '#823cf0',
        shape: 'rectangle', // rectangle | ellipse | polygon
        points: [[0.1, 0.1], [0.9, 0.1], [0.8, 0.9], [0.2, 0.8]]
      };
    } else if (type === 'adjustment') {
      layer.params = {
        exposure: 1.15,
        blur: 0,
        fade: 0
      };
    }

    return layer;
  }

  // 4. CANVAS RENDERING ENGINE
  const _layerBuffer = document.createElement('canvas');
  _layerBuffer.width = 960;
  _layerBuffer.height = 540;
  const _lbCtx = _layerBuffer.getContext('2d');

  function renderBlankCanvas(canvas, time) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width || 960;
    const h = canvas.height || 540;

    // Draw background
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    ctx.fillStyle = composition.background || '#080b10';
    ctx.fillRect(0, 0, w, h);

    // Subtle dark studio grid background
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    // Render layers back to front
    const layers = composition.layers || [];
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (!layer.visible) continue;

      const sampled = sampleLayerProgress(layer, time);
      if (!sampled.active) continue;

      const q = sampled.progress;

      // Render layer content into offscreen buffer
      _lbCtx.setTransform(1, 0, 0, 1, 0, 0);
      _lbCtx.filter = 'none';
      _lbCtx.clearRect(0, 0, 960, 540);

      paintLayerContent(_lbCtx, layer, sampled.time, q);

      // Interpolate transforms
      const posX = 480 + (Number(layer.x) || 0) + ((Number(layer.endX) || 0) - (Number(layer.x) || 0)) * q;
      const posY = 270 + (Number(layer.y) || 0) + ((Number(layer.endY) || 0) - (Number(layer.y) || 0)) * q;
      const scale = (Number(layer.scale) || 1) + ((Number(layer.endScale) || 1) - (Number(layer.scale) || 1)) * q;
      const rot = (Number(layer.rotation) || 0) + ((Number(layer.endRotation) || 0) - (Number(layer.rotation) || 0)) * q;
      const tilt = (Number(layer.tilt) || 0) + ((Number(layer.endTilt) || 0) - (Number(layer.tilt) || 0)) * q;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, Number(layer.opacity) != null ? Number(layer.opacity) : 1));
      ctx.globalCompositeOperation = layer.blend || 'source-over';
      const blurPx = Number(layer.blur) || 0;
      if (blurPx > 0) {
        ctx.filter = `blur(${blurPx}px)`;
      }

      ctx.translate(posX, posY);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(scale, scale * Math.cos((tilt * Math.PI) / 180));
      ctx.drawImage(_layerBuffer, -480, -270);
      ctx.restore();

      // If this layer is selected, draw subtle selection border
      if (layer.id === selectedLayerId) {
        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate((rot * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.strokeStyle = '#9353f5';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(-220, -120, 440, 240);
        ctx.restore();
      }
    }
  }

  function paintLayerContent(ctx, layer, localTime, q) {
    const type = layer.type;
    const p = layer.params || {};

    if (type === 'text') {
      ctx.save();
      ctx.font = `800 ${p.size || 54}px ${p.fontFamily || 'Inter'}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = p.color || '#f5f5f7';
      const txt = String(p.text || 'NARRATIVE TEXT');
      // Progressive letter write reveal
      const writeDur = Math.max(0.2, Number(p.writeDuration) || 3);
      const writeFrac = Math.min(1, localTime / writeDur);
      const charsToShow = Math.ceil(txt.length * writeFrac);
      ctx.fillText(txt.slice(0, charsToShow), 480, 270);
      ctx.restore();
    } else if (type === 'fireOverlay') {
      // Living procedural fire
      ctx.save();
      const fireW = 960;
      const fireH = 220;
      const grad = ctx.createLinearGradient(0, 540, 0, 540 - fireH);
      const col = p.fireColor || '#ff681f';
      grad.addColorStop(0, col);
      grad.addColorStop(0.4, 'rgba(255, 140, 0, 0.85)');
      grad.addColorStop(0.8, 'rgba(255, 220, 100, 0.45)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 540);
      const waveSpeed = (p.fireSpeed || 55) / 20;
      const wild = (p.fireWildness || 65) / 30;
      for (let x = 0; x <= 960; x += 30) {
        const off = Math.sin(x * 0.02 + localTime * waveSpeed) * wild * 15 + Math.cos(x * 0.05 + localTime * 2) * 8;
        ctx.lineTo(x, 540 - fireH * 0.7 + off);
      }
      ctx.lineTo(960, 540);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (type === 'cloudOverlay') {
      ctx.save();
      const drift = (localTime * (p.driftSpeed || 12)) % 960;
      const grad = ctx.createRadialGradient(240 + drift, 200, 40, 240 + drift, 200, 360);
      grad.addColorStop(0, 'rgba(220, 230, 245, 0.55)');
      grad.addColorStop(0.6, 'rgba(180, 195, 215, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 960, 540);
      ctx.restore();
    } else if (type === 'region') {
      ctx.save();
      ctx.fillStyle = p.color || '#823cf0';
      if (p.shape === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(480, 270, 260, 160, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'polygon' && Array.isArray(p.points)) {
        ctx.beginPath();
        p.points.forEach(([u, v], i) => {
          const x = u * 960;
          const y = v * 540;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(200, 140, 560, 260);
      }
      ctx.restore();
    } else if (type === 'object3d') {
      // 3D pseudo perspective projection of primitive
      ctx.save();
      ctx.translate(480, 270);
      const spin = localTime * (p.spinY || 0.4);
      ctx.fillStyle = p.objectColor || '#9353f5';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;

      const sz = 110;
      const cos = Math.cos(spin);
      const sin = Math.sin(spin);

      ctx.beginPath();
      ctx.moveTo(-sz * cos, -sz * 0.7);
      ctx.lineTo(sz * cos, -sz * 0.7 + sin * 20);
      ctx.lineTo(sz * cos, sz * 0.7 + sin * 20);
      ctx.lineTo(-sz * cos, sz * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (type === 'surface') {
      ctx.save();
      ctx.fillStyle = p.color || '#73553b';
      const spread = q * 480;
      ctx.beginPath();
      ctx.arc(480, 270, spread, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (type === 'adjustment') {
      ctx.save();
      if (p.blur) ctx.filter = `blur(${p.blur}px)`;
      if (p.fade) {
        ctx.fillStyle = `rgba(0, 0, 0, ${p.fade})`;
        ctx.fillRect(0, 0, 960, 540);
      }
      ctx.restore();
    } else if (type === 'image' || type === 'image3d') {
      // Fallback stylized image card
      ctx.save();
      const grad = ctx.createLinearGradient(200, 100, 760, 440);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#312e81');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(200, 100, 560, 340);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(200, 100, 560, 340);

      ctx.fillStyle = '#c084fc';
      ctx.font = '600 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(layer.name || 'Image 3D Plane', 480, 270);
      ctx.restore();
    } else if (type.startsWith('template:')) {
      // Template sequence action fallback representation
      ctx.save();
      ctx.fillStyle = 'rgba(130, 60, 240, 0.15)';
      ctx.strokeStyle = '#823cf0';
      ctx.lineWidth = 2;
      ctx.strokeRect(160, 90, 640, 360);
      ctx.fillRect(160, 90, 640, 360);
      ctx.fillStyle = '#f5f5f7';
      ctx.font = '700 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(layer.name || type, 480, 270);
      ctx.restore();
    }
  }

  // 5. ANIMATION PLAYHEAD LOOP
  function stepBlankLoop(timestamp) {
    if (isPlaying) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      playheadTime += dt;
      if (playheadTime >= composition.duration) {
        playheadTime = 0;
      }
      syncPlayheadUI();
    } else {
      lastTimestamp = 0;
    }

    const canvas = document.getElementById('blank-studio-canvas');
    if (canvas) {
      renderBlankCanvas(canvas, playheadTime);
    }

    if (modalMounted) {
      requestAnimationFrame(stepBlankLoop);
    }
  }

  function syncPlayheadUI() {
    const timeDisplay = document.getElementById('blank-time-display');
    const scrub = document.getElementById('blank-timeline-scrub');
    if (timeDisplay) {
      const cur = playheadTime.toFixed(1);
      const total = composition.duration.toFixed(1);
      timeDisplay.textContent = `${cur}s / ${total}s`;
    }
    if (scrub && document.activeElement !== scrub) {
      scrub.max = composition.duration;
      scrub.value = playheadTime;
    }
  }

  // 6. 4-TAB CONTEXTUAL INSPECTOR GENERATION
  function renderBlankInspector() {
    const container = document.getElementById('blank-inspector-body');
    if (!container) return;

    const layer = composition.layers.find((l) => l.id === selectedLayerId);
    if (!layer) {
      container.innerHTML = `
        <div class="rg-inspector-empty" style="padding: 32px 18px; text-align: center; color: var(--rg-text-muted);">
          <svg viewBox="0 0 24 24" style="width: 32px; height: 32px; fill: none; stroke: currentColor; stroke-width: 1.5; margin: 0 auto 12px; display: block;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <div style="font-weight: 600; font-size: 13px; color: var(--rg-text-secondary); margin-bottom: 4px;">No Layer Selected</div>
          <div style="font-size: 11.5px; line-height: 1.5;">Click any layer in the timeline or stage to inspect transforms, motion curves, and shaders.</div>
        </div>
      `;
      return;
    }

    const p = layer.params || {};
    const pb = layer.playback || {};

    let contentHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header">
          <span class="rg-section-title">Layer Identity & Source</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Name</label>
          <input type="text" class="rg-input-text" id="blank-ctl-name" value="${escapeHtml(layer.name)}" style="width: 100%;">
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Type</label>
          <span class="rg-badge" style="font-family: monospace;">${escapeHtml(layer.type)}</span>
        </div>
    `;

    if (layer.type === 'text') {
      contentHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Words</label>
          <textarea class="rg-input-text" id="blank-ctl-text" rows="2" style="width: 100%; resize: vertical;">${escapeHtml(p.text || '')}</textarea>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Pen Style</label>
          <select class="rg-select" id="blank-ctl-style" style="width: 100%;">
            <option value="brush" ${p.style === 'brush' ? 'selected' : ''}>Brush</option>
            <option value="ink" ${p.style === 'ink' ? 'selected' : ''}>Ink</option>
            <option value="chalk" ${p.style === 'chalk' ? 'selected' : ''}>Chalk</option>
          </select>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Font Size</label>
          <input type="range" class="rg-slider" id="blank-ctl-fontsize" min="18" max="120" value="${p.size || 54}">
          <span class="rg-value-pill" id="blank-val-fontsize">${p.size || 54}px</span>
        </div>
      `;
    } else if (layer.type === 'object3d') {
      contentHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Geometry</label>
          <select class="rg-select" id="blank-ctl-primitive" style="width: 100%;">
            <option value="box" ${p.primitive === 'box' ? 'selected' : ''}>Cube Box</option>
            <option value="sphere" ${p.primitive === 'sphere' ? 'selected' : ''}>Sphere</option>
            <option value="torus" ${p.primitive === 'torus' ? 'selected' : ''}>Torus Ring</option>
            <option value="cone" ${p.primitive === 'cone' ? 'selected' : ''}>Cone</option>
          </select>
        </div>
      `;
    } else if (layer.type === 'region') {
      contentHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Shape</label>
          <select class="rg-select" id="blank-ctl-shape" style="width: 100%;">
            <option value="rectangle" ${p.shape === 'rectangle' ? 'selected' : ''}>Rectangle</option>
            <option value="ellipse" ${p.shape === 'ellipse' ? 'selected' : ''}>Ellipse</option>
            <option value="polygon" ${p.shape === 'polygon' ? 'selected' : ''}>Polygon Outline</option>
          </select>
        </div>
      `;
    }

    contentHtml += `</div>`;

    let motionHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header">
          <span class="rg-section-title">Timeline Timing & Duration</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Start Time</label>
          <input type="number" class="rg-input-text" id="blank-ctl-start" step="0.1" min="0" max="600" value="${layer.start || 0}">
          <span class="rg-value-pill">sec</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Duration</label>
          <input type="number" class="rg-input-text" id="blank-ctl-duration" step="0.1" min="0.2" max="600" value="${layer.duration || 8}">
          <span class="rg-value-pill">sec</span>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header">
          <span class="rg-section-title">Playback Rate & Easing</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Speed Multiplier</label>
          <input type="range" class="rg-slider" id="blank-ctl-speed" min="0.1" max="4" step="0.05" value="${pb.speed || 1}">
          <span class="rg-value-pill" id="blank-val-speed">${(pb.speed || 1).toFixed(2)}x</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Easing Curve</label>
          <select class="rg-select" id="blank-ctl-ease" style="width: 100%;">
            <option value="linear" ${pb.ease === 'linear' ? 'selected' : ''}>Linear (Constant)</option>
            <option value="smooth" ${pb.ease === 'smooth' ? 'selected' : ''}>Smooth Ease In/Out</option>
            <option value="in" ${pb.ease === 'in' ? 'selected' : ''}>Accelerate (Ease In)</option>
            <option value="out" ${pb.ease === 'out' ? 'selected' : ''}>Settle (Ease Out)</option>
          </select>
        </div>
        <div class="rg-control-row" style="display: flex; align-items: center; justify-content: space-between;">
          <label class="rg-control-label">Reverse Playback</label>
          <input type="checkbox" id="blank-ctl-reverse" ${pb.reverse ? 'checked' : ''}>
        </div>
      </div>

      <div class="rg-inspector-section">
        <div class="rg-section-header">
          <span class="rg-section-title">Keyframed Transforms</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Position X (Start → End)</label>
          <div style="display: flex; gap: 8px; width: 100%;">
            <input type="number" class="rg-input-text" id="blank-ctl-x" value="${layer.x || 0}" style="flex: 1;">
            <input type="number" class="rg-input-text" id="blank-ctl-endx" value="${layer.endX || 0}" style="flex: 1;">
          </div>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Position Y (Start → End)</label>
          <div style="display: flex; gap: 8px; width: 100%;">
            <input type="number" class="rg-input-text" id="blank-ctl-y" value="${layer.y || 0}" style="flex: 1;">
            <input type="number" class="rg-input-text" id="blank-ctl-endy" value="${layer.endY || 0}" style="flex: 1;">
          </div>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Scale (Start → End)</label>
          <div style="display: flex; gap: 8px; width: 100%;">
            <input type="number" class="rg-input-text" id="blank-ctl-scale" step="0.05" value="${layer.scale || 1}" style="flex: 1;">
            <input type="number" class="rg-input-text" id="blank-ctl-endscale" step="0.05" value="${layer.endScale || 1}" style="flex: 1;">
          </div>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Rotation (Start → End °)</label>
          <div style="display: flex; gap: 8px; width: 100%;">
            <input type="number" class="rg-input-text" id="blank-ctl-rot" value="${layer.rotation || 0}" style="flex: 1;">
            <input type="number" class="rg-input-text" id="blank-ctl-endrot" value="${layer.endRotation || 0}" style="flex: 1;">
          </div>
        </div>
      </div>
    `;

    let lookHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header">
          <span class="rg-section-title">Color, Blend & Opacity</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Opacity</label>
          <input type="range" class="rg-slider" id="blank-ctl-opacity" min="0" max="1" step="0.02" value="${layer.opacity != null ? layer.opacity : 1}">
          <span class="rg-value-pill" id="blank-val-opacity">${Math.round((layer.opacity != null ? layer.opacity : 1) * 100)}%</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Layer Softness / Blur</label>
          <input type="range" class="rg-slider" id="blank-ctl-blur" min="0" max="40" step="1" value="${layer.blur || 0}">
          <span class="rg-value-pill" id="blank-val-blur">${layer.blur || 0}px</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Blend Mode</label>
          <select class="rg-select" id="blank-ctl-blend" style="width: 100%;">
            <option value="source-over" ${layer.blend === 'source-over' ? 'selected' : ''}>Normal (Source Over)</option>
            <option value="screen" ${layer.blend === 'screen' ? 'selected' : ''}>Screen (Luminance)</option>
            <option value="multiply" ${layer.blend === 'multiply' ? 'selected' : ''}>Multiply (Archival Ink)</option>
            <option value="overlay" ${layer.blend === 'overlay' ? 'selected' : ''}>Overlay (Vivid Contrast)</option>
          </select>
        </div>
    `;

    if (layer.type === 'text') {
      lookHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Ink Color</label>
          <input type="color" class="rg-input-color" id="blank-ctl-color" value="${p.color || '#f5f5f7'}">
        </div>
      `;
    } else if (layer.type === 'object3d') {
      lookHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Material Color</label>
          <input type="color" class="rg-input-color" id="blank-ctl-objcolor" value="${p.objectColor || '#9353f5'}">
        </div>
      `;
    } else if (layer.type === 'region') {
      lookHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Region Tint</label>
          <input type="color" class="rg-input-color" id="blank-ctl-regcolor" value="${p.color || '#823cf0'}">
        </div>
      `;
    }

    lookHtml += `</div>`;

    let effectsHtml = `
      <div class="rg-inspector-section">
        <div class="rg-section-header">
          <span class="rg-section-title">Special Effects & Parameters</span>
        </div>
    `;

    if (layer.type === 'fireOverlay') {
      effectsHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Flame Wildness</label>
          <input type="range" class="rg-slider" id="blank-ctl-firewild" min="0" max="100" value="${p.fireWildness || 65}">
          <span class="rg-value-pill" id="blank-val-firewild">${p.fireWildness || 65}%</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Flame Speed</label>
          <input type="range" class="rg-slider" id="blank-ctl-firespd" min="10" max="100" value="${p.fireSpeed || 55}">
          <span class="rg-value-pill" id="blank-val-firespd">${p.fireSpeed || 55}%</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Flame Tint</label>
          <input type="color" class="rg-input-color" id="blank-ctl-firecol" value="${p.fireColor || '#ff681f'}">
        </div>
      `;
    } else if (layer.type === 'cloudOverlay') {
      effectsHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Drift Speed</label>
          <input type="range" class="rg-slider" id="blank-ctl-clouddrift" min="0" max="40" value="${p.driftSpeed || 12}">
          <span class="rg-value-pill" id="blank-val-clouddrift">${p.driftSpeed || 12}px/s</span>
        </div>
      `;
    } else if (layer.type === 'adjustment') {
      effectsHtml += `
        <div class="rg-control-row">
          <label class="rg-control-label">Exposure Gain</label>
          <input type="range" class="rg-slider" id="blank-ctl-adjexp" min="0" max="3" step="0.05" value="${p.exposure ?? 1.15}">
          <span class="rg-value-pill" id="blank-val-adjexp">${(p.exposure ?? 1.15).toFixed(2)}x</span>
        </div>
        <div class="rg-control-row">
          <label class="rg-control-label">Black Fade</label>
          <input type="range" class="rg-slider" id="blank-ctl-adjfade" min="0" max="1" step="0.02" value="${p.fade || 0}">
          <span class="rg-value-pill" id="blank-val-adjfade">${Math.round((p.fade || 0) * 100)}%</span>
        </div>
      `;
    } else {
      effectsHtml += `
        <div style="font-size: 11.5px; color: var(--rg-text-muted); padding: 8px 0;">No dedicated shader effect active for this layer type.</div>
      `;
    }

    effectsHtml += `</div>`;

    let advancedHtml = `
      <details class="rg-advanced-drawer" style="margin-top: 14px; border: 1px solid var(--rg-border-subtle); border-radius: 8px; background: rgba(0,0,0,0.25);">
        <summary style="padding: 10px 14px; font-size: 11.5px; font-weight: 600; color: var(--rg-text-secondary); cursor: pointer;">
          Advanced Controls & Creative Notes
        </summary>
        <div style="padding: 14px; display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label class="rg-control-label" style="font-size: 11px;">Author Narrative Intent</label>
            <textarea class="rg-input-text" id="blank-ctl-intent" rows="2" style="width: 100%; font-size: 11px;">${escapeHtml(layer.context?.intent || '')}</textarea>
          </div>
          <div>
            <label class="rg-control-label" style="font-size: 11px;">Metaphor / Symbolic Association</label>
            <textarea class="rg-input-text" id="blank-ctl-metaphor" rows="2" style="width: 100%; font-size: 11px;">${escapeHtml(layer.context?.metaphor || '')}</textarea>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary" id="btn-duplicate-blank-layer" style="flex: 1; font-size: 11.5px;">Duplicate</button>
            <button type="button" class="btn btn-secondary" id="btn-delete-blank-layer" style="flex: 1; font-size: 11.5px; color: #f87171; border-color: rgba(239, 68, 68, 0.3);">Delete</button>
          </div>
        </div>
      </details>
    `;

    container.innerHTML = `
      <div class="rg-tab-pane ${activeTab === 'content' ? 'active' : ''}" data-pane="content">${contentHtml}</div>
      <div class="rg-tab-pane ${activeTab === 'motion' ? 'active' : ''}" data-pane="motion">${motionHtml}</div>
      <div class="rg-tab-pane ${activeTab === 'look' ? 'active' : ''}" data-pane="look">${lookHtml}</div>
      <div class="rg-tab-pane ${activeTab === 'effects' ? 'active' : ''}" data-pane="effects">${effectsHtml}</div>
      ${advancedHtml}
    `;

    wireBlankInspectorEvents(layer);
  }

  function wireBlankInspectorEvents(layer) {
    const bindInput = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', fn);
    };

    bindInput('blank-ctl-name', (e) => {
      layer.name = e.target.value;
      renderBlankLayersList();
      saveComposition();
    });

    bindInput('blank-ctl-text', (e) => {
      layer.params.text = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-style', (e) => {
      layer.params.style = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-fontsize', (e) => {
      layer.params.size = Number(e.target.value);
      const v = document.getElementById('blank-val-fontsize');
      if (v) v.textContent = e.target.value + 'px';
      saveComposition();
    });

    bindInput('blank-ctl-start', (e) => {
      layer.start = Math.max(0, Number(e.target.value) || 0);
      renderBlankLayersList();
      saveComposition();
    });

    bindInput('blank-ctl-duration', (e) => {
      layer.duration = Math.max(0.2, Number(e.target.value) || 8);
      renderBlankLayersList();
      saveComposition();
    });

    bindInput('blank-ctl-speed', (e) => {
      layer.playback.speed = Number(e.target.value) || 1;
      const v = document.getElementById('blank-val-speed');
      if (v) v.textContent = Number(e.target.value).toFixed(2) + 'x';
      saveComposition();
    });

    bindInput('blank-ctl-ease', (e) => {
      layer.playback.ease = e.target.value;
      saveComposition();
    });

    const revCheck = document.getElementById('blank-ctl-reverse');
    if (revCheck) {
      revCheck.addEventListener('change', (e) => {
        layer.playback.reverse = e.target.checked;
        saveComposition();
      });
    }

    bindInput('blank-ctl-x', (e) => { layer.x = Number(e.target.value) || 0; saveComposition(); });
    bindInput('blank-ctl-endx', (e) => { layer.endX = Number(e.target.value) || 0; saveComposition(); });
    bindInput('blank-ctl-y', (e) => { layer.y = Number(e.target.value) || 0; saveComposition(); });
    bindInput('blank-ctl-endy', (e) => { layer.endY = Number(e.target.value) || 0; saveComposition(); });
    bindInput('blank-ctl-scale', (e) => { layer.scale = Number(e.target.value) || 1; saveComposition(); });
    bindInput('blank-ctl-endscale', (e) => { layer.endScale = Number(e.target.value) || 1; saveComposition(); });
    bindInput('blank-ctl-rot', (e) => { layer.rotation = Number(e.target.value) || 0; saveComposition(); });
    bindInput('blank-ctl-endrot', (e) => { layer.endRotation = Number(e.target.value) || 0; saveComposition(); });

    bindInput('blank-ctl-opacity', (e) => {
      layer.opacity = Number(e.target.value);
      const v = document.getElementById('blank-val-opacity');
      if (v) v.textContent = Math.round(Number(e.target.value) * 100) + '%';
      saveComposition();
    });

    bindInput('blank-ctl-blur', (e) => {
      layer.blur = Number(e.target.value);
      const v = document.getElementById('blank-val-blur');
      if (v) v.textContent = e.target.value + 'px';
      saveComposition();
    });

    bindInput('blank-ctl-blend', (e) => {
      layer.blend = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-color', (e) => {
      layer.params.color = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-objcolor', (e) => {
      layer.params.objectColor = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-regcolor', (e) => {
      layer.params.color = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-firewild', (e) => {
      layer.params.fireWildness = Number(e.target.value);
      const v = document.getElementById('blank-val-firewild');
      if (v) v.textContent = e.target.value + '%';
      saveComposition();
    });

    bindInput('blank-ctl-firespd', (e) => {
      layer.params.fireSpeed = Number(e.target.value);
      const v = document.getElementById('blank-val-firespd');
      if (v) v.textContent = e.target.value + '%';
      saveComposition();
    });

    bindInput('blank-ctl-firecol', (e) => {
      layer.params.fireColor = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-intent', (e) => {
      if (!layer.context) layer.context = {};
      layer.context.intent = e.target.value;
      saveComposition();
    });

    bindInput('blank-ctl-metaphor', (e) => {
      if (!layer.context) layer.context = {};
      layer.context.metaphor = e.target.value;
      saveComposition();
    });

    const dupBtn = document.getElementById('btn-duplicate-blank-layer');
    if (dupBtn) {
      dupBtn.addEventListener('click', () => {
        duplicateLayer(layer.id);
      });
    }

    const delBtn = document.getElementById('btn-delete-blank-layer');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        removeLayer(layer.id);
      });
    }
  }

  // 7. LAYER LIST & ACTIONS
  function renderBlankLayersList() {
    const list = document.getElementById('blank-layers-list');
    if (!list) return;

    if (!composition.layers.length) {
      list.innerHTML = `
        <div style="padding: 24px 14px; text-align: center; color: var(--rg-text-muted); font-size: 11.5px; border: 1px dashed var(--rg-border-subtle); border-radius: 8px;">
          Empty canvas. Click <strong>+ Add Layer</strong> above to begin.
        </div>
      `;
      return;
    }

    list.innerHTML = composition.layers.map((l, idx) => {
      const isSel = l.id === selectedLayerId;
      const span = getLayerSpan(l);
      return `
        <div class="blank-layer-row ${isSel ? 'selected' : ''}" data-layer-id="${l.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; background: ${isSel ? 'rgba(130, 60, 240, 0.16)' : 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${isSel ? 'rgba(130, 60, 240, 0.5)' : 'var(--rg-border-subtle)'}; border-radius: 7px; cursor: pointer; transition: all 0.15s; margin-bottom: 5px;">
          <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
            <span style="font-size: 10px; color: var(--rg-text-muted); font-family: monospace;">#${idx + 1}</span>
            <span style="font-size: 11.5px; font-weight: ${isSel ? '600' : '500'}; color: ${isSel ? '#ffffff' : 'var(--rg-text-secondary)'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(l.name)}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <span style="font-size: 10.5px; color: var(--rg-text-muted); font-family: monospace;">${l.start}s–${(l.start + span).toFixed(1)}s</span>
            <button type="button" class="btn-blank-layer-action" data-action="toggle-vis" data-id="${l.id}" title="${l.visible ? 'Hide' : 'Show'}" style="background: none; border: none; color: ${l.visible ? 'var(--rg-text-muted)' : '#f87171'}; cursor: pointer; padding: 2px;">
              <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 2;">
                ${l.visible ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' : '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>'}
              </svg>
            </button>
            <button type="button" class="btn-blank-layer-action" data-action="move-up" data-id="${l.id}" title="Move Up" style="background: none; border: none; color: var(--rg-text-muted); cursor: pointer; padding: 2px;">↑</button>
            <button type="button" class="btn-blank-layer-action" data-action="move-down" data-id="${l.id}" title="Move Down" style="background: none; border: none; color: var(--rg-text-muted); cursor: pointer; padding: 2px;">↓</button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.blank-layer-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.btn-blank-layer-action')) return;
        const id = row.getAttribute('data-layer-id');
        selectLayer(id);
      });
    });

    list.querySelectorAll('.btn-blank-layer-action').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');
        const idx = composition.layers.findIndex((l) => l.id === id);
        if (idx < 0) return;

        if (action === 'toggle-vis') {
          composition.layers[idx].visible = !composition.layers[idx].visible;
          renderBlankLayersList();
          saveComposition();
        } else if (action === 'move-up' && idx > 0) {
          const tmp = composition.layers[idx - 1];
          composition.layers[idx - 1] = composition.layers[idx];
          composition.layers[idx] = tmp;
          renderBlankLayersList();
          saveComposition();
        } else if (action === 'move-down' && idx < composition.layers.length - 1) {
          const tmp = composition.layers[idx + 1];
          composition.layers[idx + 1] = composition.layers[idx];
          composition.layers[idx] = tmp;
          renderBlankLayersList();
          saveComposition();
        }
      });
    });
  }

  function selectLayer(id) {
    selectedLayerId = id;
    renderBlankLayersList();
    renderBlankInspector();

    // Anchor universal contextual toolbar
    const layer = composition.layers.find((l) => l.id === id);
    if (layer && window.RegaarderContextualToolbar) {
      const stage = document.getElementById('blank-stage-viewport');
      window.RegaarderContextualToolbar.showForObject({
        contextType: 'blank',
        objectKey: 'blank_' + layer.type,
        label: layer.name,
        variant: layer.type === 'text' ? 'text' : 'media',
        anchorElement: stage
      });
    }
  }

  function addLayer(type) {
    const layer = createBlankLayer(type);
    composition.layers.push(layer);
    selectedLayerId = layer.id;
    composition.duration = Math.max(composition.duration, layer.start + layer.duration);
    saveComposition();
    renderBlankLayersList();
    renderBlankInspector();
    syncPlayheadUI();
  }

  function duplicateLayer(id) {
    const orig = composition.layers.find((l) => l.id === id);
    if (!orig) return;
    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = 'layer_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    copy.name = orig.name + ' (Copy)';
    copy.x = (orig.x || 0) + 20;
    copy.y = (orig.y || 0) + 20;
    const idx = composition.layers.findIndex((l) => l.id === id);
    composition.layers.splice(idx + 1, 0, copy);
    selectedLayerId = copy.id;
    saveComposition();
    renderBlankLayersList();
    renderBlankInspector();
  }

  function removeLayer(id) {
    composition.layers = composition.layers.filter((l) => l.id !== id);
    if (selectedLayerId === id) {
      selectedLayerId = composition.layers.length ? composition.layers[0].id : null;
    }
    saveComposition();
    renderBlankLayersList();
    renderBlankInspector();
    if (window.RegaarderContextualToolbar) {
      window.RegaarderContextualToolbar.hide();
    }
  }

  // 8. TOOLBAR ACTION BRIDGE
  function applyBlankToolbarAction(action, objectKey, val) {
    const layer = composition.layers.find((l) => l.id === selectedLayerId);
    if (!layer) return;

    if (action === 'rotate') {
      layer.rotation = ((layer.rotation || 0) + 15) % 360;
    } else if (action === 'duplicate') {
      duplicateLayer(layer.id);
    } else if (action === 'delete') {
      removeLayer(layer.id);
    } else if (action === 'color' && val) {
      if (layer.type === 'text') layer.params.color = val;
      else if (layer.type === 'object3d') layer.params.objectColor = val;
      else if (layer.type === 'region') layer.params.color = val;
      else if (layer.type === 'fireOverlay') layer.params.fireColor = val;
    } else if (action === 'opacity' && val != null) {
      layer.opacity = Math.max(0, Math.min(1, Number(val) / 100));
    }
    saveComposition();
    renderBlankInspector();
  }

  window.applyRegaarderBlankToolbarAction = applyBlankToolbarAction;

  // 9. MODAL MOUNT & SHELL
  function openBlankCompositionStudio() {
    discoverTemplateCapabilities();
    let modal = document.getElementById('modal-regaarder-blank-composition');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-regaarder-blank-composition';
      modal.className = 'vector-export-modal rg-shell-mounted';
      modal.style.cssText = 'display: none; z-index: 100010; backdrop-filter: blur(14px); background: rgba(5,6,12,0.96); padding: 0; overflow: hidden;';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="vector-modal-box" style="width: 100vw; max-width: 100vw; height: 100vh; max-height: 100vh; display: flex; flex-direction: column; background: var(--rg-bg-canvas); border: none; border-radius: 0; overflow: hidden;">
        <!-- Top Studio Bar -->
        <header class="rg-global-topbar" style="height: 48px; border-bottom: 1px solid var(--rg-border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: #0B0B11; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: none; stroke: #823cf0; stroke-width: 2.2;">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18M3 9h18"/>
              </svg>
              <span style="font-weight: 700; font-size: 13.5px; color: #fff; letter-spacing: -0.01em;">Blank Composition Studio</span>
            </div>
            <input type="text" id="blank-comp-name" value="${escapeHtml(composition.name)}" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 4px 10px; font-size: 12px; color: #f5f5f7; width: 220px;" title="Composition Name">
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn btn-secondary" id="btn-export-blank-json" style="font-size: 11.5px; padding: 5px 12px;">Export JSON</button>
            <button type="button" class="btn btn-secondary" id="btn-import-blank-json" style="font-size: 11.5px; padding: 5px 12px;">Import JSON</button>
            <input type="file" id="file-import-blank-json" accept=".json,application/json" style="display: none;">
            <button type="button" class="btn-sidebar-collapse" id="btn-close-blank-studio" title="Done" style="background: rgba(255,255,255,0.06); border: 1px solid var(--rg-border-subtle); border-radius: 6px; padding: 5px 12px; color: #fff; font-size: 12px; cursor: pointer;">
              Done ✕
            </button>
          </div>
        </header>

        <!-- Main Body: Left Layers Panel + Stage + 4-Tab Inspector -->
        <div style="display: flex; flex: 1; min-height: 0; overflow: hidden;">
          <!-- Left Layers Drawer (260px) -->
          <aside style="width: 270px; background: var(--rg-bg-panel); border-right: 1px solid var(--rg-border-subtle); display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;">
            <div style="padding: 12px; border-bottom: 1px solid var(--rg-border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 700; font-size: 12px; color: var(--rg-text-primary);">Layer Stack</span>
              <div style="position: relative;">
                <button type="button" class="btn btn-primary" id="btn-show-add-capability" style="font-size: 11px; padding: 4px 10px; display: flex; align-items: center; gap: 4px;">
                  <span>+ Add Layer</span>
                </button>
              </div>
            </div>

            <div id="blank-add-capability-menu" style="display: none; padding: 10px; background: var(--rg-bg-elevated); border-bottom: 1px solid var(--rg-border-strong);">
              <label style="font-size: 10.5px; color: var(--rg-text-muted); display: block; margin-bottom: 5px;">Choose Capability Action:</label>
              <select id="blank-select-capability" class="rg-select" style="width: 100%; margin-bottom: 8px; font-size: 11.5px;"></select>
              <button type="button" class="btn btn-primary" id="btn-confirm-add-layer" style="width: 100%; font-size: 11.5px; padding: 5px;">Add to Composition</button>
            </div>

            <!-- Layer List -->
            <div id="blank-layers-list" style="flex: 1; overflow-y: auto; padding: 10px;"></div>

            <!-- Composition Settings -->
            <div style="padding: 12px; border-top: 1px solid var(--rg-border-subtle); background: rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 11px; color: var(--rg-text-secondary);">Total Duration</label>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input type="number" id="blank-comp-duration" min="1" max="600" value="${composition.duration}" style="width: 55px; background: var(--rg-bg-input); border: 1px solid var(--rg-border-subtle); border-radius: 4px; color: #fff; padding: 3px 6px; font-size: 11px;">
                  <span style="font-size: 10.5px; color: var(--rg-text-muted);">s</span>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 11px; color: var(--rg-text-secondary);">Background</label>
                <input type="color" id="blank-comp-bg" value="${composition.background || '#080b10'}" style="width: 28px; height: 22px; border: none; background: none; cursor: pointer;">
              </div>
            </div>
          </aside>

          <!-- Center Stage Viewport (Stage + Timeline) -->
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--rg-bg-canvas); position: relative; overflow: hidden;">
            <div id="blank-stage-viewport" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">
              <div style="width: 100%; max-width: 960px; aspect-ratio: 16/9; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(130, 60, 240, 0.15); border-radius: 10px; overflow: hidden; border: 1px solid var(--rg-border-strong);">
                <canvas id="blank-studio-canvas" width="960" height="540" style="width: 100%; height: 100%; display: block; background: #080b10; cursor: pointer;"></canvas>
              </div>
            </div>

            <!-- Bottom Playbar & Timeline -->
            <div style="height: 52px; background: var(--rg-bg-panel); border-top: 1px solid var(--rg-border-subtle); display: flex; align-items: center; gap: 14px; padding: 0 20px; flex-shrink: 0;">
              <button type="button" id="blank-play-btn" class="icon-btn" style="width: 32px; height: 32px; background: rgba(130, 60, 240, 0.2); border: 1px solid rgba(130, 60, 240, 0.4); border-radius: 6px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button type="button" id="blank-restart-btn" class="icon-btn" style="width: 28px; height: 28px; background: none; border: none; color: var(--rg-text-muted); cursor: pointer;" title="Restart">
                ↺
              </button>
              <input type="range" id="blank-timeline-scrub" min="0" max="${composition.duration}" step="0.02" value="${playheadTime}" style="flex: 1; accent-color: var(--rg-accent); cursor: pointer;">
              <span id="blank-time-display" style="font-size: 11px; font-family: monospace; color: var(--rg-text-secondary); min-width: 90px; text-align: right;">
                ${playheadTime.toFixed(1)}s / ${composition.duration.toFixed(1)}s
              </span>
            </div>
          </div>

          <!-- Right 4-Tab Contextual Inspector (320px) -->
          <aside class="rg-inspector-shell" style="width: 330px; background: var(--rg-bg-panel); border-left: 1px solid var(--rg-border-subtle); display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;">
            <!-- 4 Standard Tabs -->
            <div class="rg-inspector-tabs" style="display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--rg-border-subtle); background: #0F0F14;">
              <button type="button" class="rg-inspector-tab ${activeTab === 'content' ? 'active' : ''}" data-tab="content" style="padding: 10px 4px; font-size: 11px; font-weight: 600; text-align: center; border: none; background: none; color: ${activeTab === 'content' ? '#fff' : 'var(--rg-text-muted)'}; border-bottom: 2px solid ${activeTab === 'content' ? 'var(--rg-accent)' : 'transparent'}; cursor: pointer;">Content</button>
              <button type="button" class="rg-inspector-tab ${activeTab === 'motion' ? 'active' : ''}" data-tab="motion" style="padding: 10px 4px; font-size: 11px; font-weight: 600; text-align: center; border: none; background: none; color: ${activeTab === 'motion' ? '#fff' : 'var(--rg-text-muted)'}; border-bottom: 2px solid ${activeTab === 'motion' ? 'var(--rg-accent)' : 'transparent'}; cursor: pointer;">Motion</button>
              <button type="button" class="rg-inspector-tab ${activeTab === 'look' ? 'active' : ''}" data-tab="look" style="padding: 10px 4px; font-size: 11px; font-weight: 600; text-align: center; border: none; background: none; color: ${activeTab === 'look' ? '#fff' : 'var(--rg-text-muted)'}; border-bottom: 2px solid ${activeTab === 'look' ? 'var(--rg-accent)' : 'transparent'}; cursor: pointer;">Look</button>
              <button type="button" class="rg-inspector-tab ${activeTab === 'effects' ? 'active' : ''}" data-tab="effects" style="padding: 10px 4px; font-size: 11px; font-weight: 600; text-align: center; border: none; background: none; color: ${activeTab === 'effects' ? '#fff' : 'var(--rg-text-muted)'}; border-bottom: 2px solid ${activeTab === 'effects' ? 'var(--rg-accent)' : 'transparent'}; cursor: pointer;">Effects</button>
            </div>

            <!-- Inspector Tab Pane Body -->
            <div id="blank-inspector-body" style="flex: 1; overflow-y: auto; padding: 14px;"></div>
          </aside>
        </div>
      </div>
    `;

    // Populate capabilities dropdown
    const select = document.getElementById('blank-select-capability');
    if (select) {
      select.innerHTML = '';
      const groups = {};
      for (const cap of capabilityRegistry.values()) {
        const cat = cap.category || 'General';
        if (!groups[cat]) {
          groups[cat] = document.createElement('optgroup');
          groups[cat].label = cat;
          select.appendChild(groups[cat]);
        }
        const opt = document.createElement('option');
        opt.value = cap.id;
        opt.textContent = cap.label;
        groups[cat].appendChild(opt);
      }
    }

    // Bind capability adder toggle
    const addToggle = document.getElementById('btn-show-add-capability');
    const addMenu = document.getElementById('blank-add-capability-menu');
    if (addToggle && addMenu) {
      addToggle.addEventListener('click', () => {
        const isHidden = addMenu.style.display === 'none';
        addMenu.style.display = isHidden ? 'block' : 'none';
      });
    }

    const confirmAdd = document.getElementById('btn-confirm-add-layer');
    if (confirmAdd && select && addMenu) {
      confirmAdd.addEventListener('click', () => {
        addLayer(select.value);
        addMenu.style.display = 'none';
      });
    }

    // Inspector Tab Switching
    modal.querySelectorAll('.rg-inspector-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        activeTab = tab.getAttribute('data-tab');
        modal.querySelectorAll('.rg-inspector-tab').forEach((t) => {
          const isAct = t.getAttribute('data-tab') === activeTab;
          t.classList.toggle('active', isAct);
          t.style.color = isAct ? '#fff' : 'var(--rg-text-muted)';
          t.style.borderBottomColor = isAct ? 'var(--rg-accent)' : 'transparent';
        });
        renderBlankInspector();
      });
    });

    // Playhead Controls
    const playBtn = document.getElementById('blank-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying
          ? '<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
          : '<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>';
      });
    }

    const restartBtn = document.getElementById('blank-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        playheadTime = 0;
        isPlaying = true;
        if (playBtn) {
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        }
        syncPlayheadUI();
      });
    }

    const scrub = document.getElementById('blank-timeline-scrub');
    if (scrub) {
      scrub.addEventListener('input', (e) => {
        isPlaying = false;
        playheadTime = Number(e.target.value);
        if (playBtn) {
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>';
        }
        syncPlayheadUI();
      });
    }

    // Comp Properties
    const compName = document.getElementById('blank-comp-name');
    if (compName) {
      compName.addEventListener('input', (e) => {
        composition.name = e.target.value;
        saveComposition();
      });
    }

    const compDur = document.getElementById('blank-comp-duration');
    if (compDur) {
      compDur.addEventListener('input', (e) => {
        composition.duration = Math.max(1, Number(e.target.value) || 20);
        saveComposition();
        syncPlayheadUI();
      });
    }

    const compBg = document.getElementById('blank-comp-bg');
    if (compBg) {
      compBg.addEventListener('input', (e) => {
        composition.background = e.target.value;
        saveComposition();
      });
    }

    // JSON Export / Import
    const exportBtn = document.getElementById('btn-export-blank-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(composition, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', `${(composition.name || 'composition').toLowerCase().replace(/\s+/g, '-')}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    }

    const importBtn = document.getElementById('btn-import-blank-json');
    const importInput = document.getElementById('file-import-blank-json');
    if (importBtn && importInput) {
      importBtn.addEventListener('click', () => {
        importInput.value = '';
        importInput.click();
      });
      importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const parsed = JSON.parse(await file.text());
          if (parsed && Array.isArray(parsed.layers)) {
            composition = { ...DEFAULT_COMPOSITION, ...parsed };
            selectedLayerId = composition.layers.length ? composition.layers[0].id : null;
            saveComposition();
            renderBlankLayersList();
            renderBlankInspector();
            syncPlayheadUI();
          }
        } catch (err) {
          alert('Could not import composition JSON: ' + err.message);
        }
      });
    }

    // Close Studio
    const closeBtn = document.getElementById('btn-close-blank-studio');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        modalMounted = false;
        isPlaying = false;
        if (window.RegaarderContextualToolbar) {
          window.RegaarderContextualToolbar.hide();
        }
      });
    }

    modal.style.display = 'flex';
    modalMounted = true;
    if (!selectedLayerId && composition.layers.length) {
      selectedLayerId = composition.layers[0].id;
    }
    renderBlankLayersList();
    renderBlankInspector();
    syncPlayheadUI();

    requestAnimationFrame(stepBlankLoop);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // 10. EXPOSE TO WINDOW & MOTION CORE
  window.RegaarderBlankComposition = {
    open: openBlankCompositionStudio,
    addLayer,
    removeLayer,
    duplicateLayer,
    selectLayer,
    getComposition,
    save: saveComposition,
    renderCanvas: renderBlankCanvas,
    applyToolbarAction: applyBlankToolbarAction,
    registerCapability
  };

  // Compatibility alias
  window.MotionCore = {
    openBlank: openBlankCompositionStudio,
    getComposition,
    registerCapability,
    listCapabilities: () => Array.from(capabilityRegistry.values())
  };
})();
