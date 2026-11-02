/**
 * Circular Spin, Falling Particles, 1 Slow + 3 Rapid Flashlight Strobes & Glitch Person Reveal Engine
 * (TEMPLATE_ID: 'jani-spin-flash-glitch-reveal')
 *
 * Upgraded with:
 * - Uncut Full-Scene Subject 1 (NO background removed) with Zoomed-In Region Crop (Zoom, Focal X, Focal Y, Interactive Crop Box)
 * - Granular Per-Image Controls (Zoom, Focal X/Y, Brightness, Contrast, Saturation, Blur, Opacity, Blend Mode, Rotation Offset)
 * - Studio Inspector Layer Stack Panel (Ordered Z=0 Background First -> Foreground FX Layers, matching Photoshop/NLE Layer Stack UI)
 *   with Eye Visibility toggles, Lock toggles, Color-coded group bars, Blend Mode & Opacity header bar, Z-order reordering, and Custom Layer uploads.
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'jani-spin-flash-glitch-reveal';

  const DEFAULT_LAYER_STACK = [
    { id: 'bg', zIndex: 0, group: 'background', colorTag: '#10b981', name: 'Z=0 • Background Environment Plate', kind: 'bg', visible: true, locked: false, opacity: 100, blendMode: 'normal' },
    { id: 'sub1', zIndex: 1, group: 'media', colorTag: '#38bdf8', name: 'Z=1 • Image 1: Spinning Scene (Zoomed Crop)', kind: 'media', visible: true, locked: false, opacity: 100, blendMode: 'normal' },
    { id: 'sub2', zIndex: 2, group: 'media', colorTag: '#06b6d4', name: 'Z=2 • Image 2: Revealed Person (Post-Glitch)', kind: 'media', visible: true, locked: false, opacity: 100, blendMode: 'normal' },
    { id: 'glitch', zIndex: 3, group: 'fx', colorTag: '#f43f5e', name: 'Z=3 • Optical Glitch Slices & RGB Split', kind: 'fx', visible: true, locked: false, opacity: 100, blendMode: 'screen' },
    { id: 'particles', zIndex: 4, group: 'fx', colorTag: '#f59e0b', name: 'Z=4 • Falling Atmospheric Particles', kind: 'fx', visible: true, locked: false, opacity: 100, blendMode: 'screen' },
    { id: 'flashlight', zIndex: 5, group: 'lighting', colorTag: '#a855f7', name: 'Z=5 • Flashlight Cone (1 Slow + 3 Fast)', kind: 'fx', visible: true, locked: false, opacity: 100, blendMode: 'screen' },
    { id: 'vignette', zIndex: 6, group: 'lighting', colorTag: '#64748b', name: 'Z=6 • Cinematic Lens Vignette', kind: 'fx', visible: true, locked: false, opacity: 100, blendMode: 'normal' }
  ];

  const MOOD_PRESETS = {
    investigative_expose: {
      id: 'investigative_expose',
      label: '🔍 Investigative Expose',
      feeling: 'Escalating Scrutiny → Identity Shift',
      desc: 'Zoomed-in uncut scene spins clockwise L→R with falling dust, 1 slow flash + 3 rapid icy-cyan strobes, glitching into Person 2.',
      settings: {
        moodPreset: 'investigative_expose',
        flashlightColor: '#38bdf8',
        flashlightColorIntensity: 72,
        flashBrilliance: 225,
        flashlightRadius: 64,
        flashlightFalloff: 60,
        slowFlashStart: 0.52,
        slowFlashDuration: 0.68,
        fastFlashStart: 1.58,
        fastFlashCount: 3,
        fastFlashInterval: 0.16,
        fastFlashDuration: 0.095,
        spinDirection: 'ltr_cw',
        spinStartAngle: -18,
        spinEndAngle: 22,
        spinArcRadiusX: 58,
        spinArcRadiusY: 34,
        spin3DTilt: 16,
        showSpinGuide: false,
        particlesEnabled: true,
        particleCount: 68,
        particleFallSpeed: 1.25,
        particleWindSway: 0.45,
        particleSize: 2.4,
        particleColor: '#fde68a',
        glitchIntensity: 85,
        glitchDuration: 0.46,
        glitchSliceCount: 14,
        glitchChromaticOffset: 18,
        subject2CyanGrade: 78,
        subject2RevealZoom: 1.12,
        duration: 5.4,
        speedMultiplier: 1.0,
        enableAudioSFX: true,
        sfxVolume: 85
      }
    },
    courtroom_downfall: {
      id: 'courtroom_downfall',
      label: '⚖️ Courtroom Downfall',
      feeling: 'Public Indictment & Sudden Collapse',
      desc: 'Heavy circular arc spin on zoomed uncut frame, warm tungsten press flash + 3 white-hot strobes and jagged glitch cut.',
      settings: {
        moodPreset: 'courtroom_downfall',
        flashlightColor: '#fbbf24',
        flashlightColorIntensity: 65,
        flashBrilliance: 260,
        flashlightRadius: 58,
        flashlightFalloff: 70,
        slowFlashStart: 0.48,
        slowFlashDuration: 0.75,
        fastFlashStart: 1.62,
        fastFlashCount: 3,
        fastFlashInterval: 0.14,
        fastFlashDuration: 0.085,
        spinDirection: 'ltr_cw',
        spinStartAngle: -24,
        spinEndAngle: 28,
        spinArcRadiusX: 72,
        spinArcRadiusY: 42,
        spin3DTilt: 22,
        showSpinGuide: false,
        particlesEnabled: true,
        particleCount: 85,
        particleFallSpeed: 1.55,
        particleWindSway: 0.6,
        particleSize: 2.6,
        particleColor: '#fef3c7',
        glitchIntensity: 95,
        glitchDuration: 0.52,
        glitchSliceCount: 18,
        glitchChromaticOffset: 24,
        subject2CyanGrade: 82,
        subject2RevealZoom: 1.15,
        duration: 5.4,
        speedMultiplier: 1.0,
        enableAudioSFX: true,
        sfxVolume: 90
      }
    },
    cyber_conspiracy: {
      id: 'cyber_conspiracy',
      label: '⚡ Cyber Dossier Override',
      feeling: 'High-Voltage Digital Interrogation',
      desc: 'Deep electric-cyan flashlight beam, 1 slow + 4 rapid strobes, and aggressive chromatic glitch into the mastermind portrait.',
      settings: {
        moodPreset: 'cyber_conspiracy',
        flashlightColor: '#00f0ff',
        flashlightColorIntensity: 90,
        flashBrilliance: 245,
        flashlightRadius: 60,
        flashlightFalloff: 65,
        slowFlashStart: 0.50,
        slowFlashDuration: 0.62,
        fastFlashStart: 1.50,
        fastFlashCount: 4,
        fastFlashInterval: 0.13,
        fastFlashDuration: 0.08,
        spinDirection: 'ltr_cw',
        spinStartAngle: -20,
        spinEndAngle: 25,
        spinArcRadiusX: 64,
        spinArcRadiusY: 38,
        spin3DTilt: 18,
        showSpinGuide: false,
        particlesEnabled: true,
        particleCount: 95,
        particleFallSpeed: 1.7,
        particleWindSway: 0.35,
        particleSize: 2.2,
        particleColor: '#7dd3fc',
        glitchIntensity: 100,
        glitchDuration: 0.55,
        glitchSliceCount: 20,
        glitchChromaticOffset: 28,
        subject2CyanGrade: 92,
        subject2RevealZoom: 1.14,
        duration: 5.4,
        speedMultiplier: 1.05,
        enableAudioSFX: true,
        sfxVolume: 85
      }
    },
    noir_memory: {
      id: 'noir_memory',
      label: '🌑 Phantom Flashback',
      feeling: 'Haunting Memory & Psychological Duality',
      desc: 'Slow hypnotic circular drift on zoomed uncut frame, dense falling ash particles, crimson-amber flash, and optical glitch.',
      settings: {
        moodPreset: 'noir_memory',
        flashlightColor: '#f43f5e',
        flashlightColorIntensity: 58,
        flashBrilliance: 195,
        flashlightRadius: 72,
        flashlightFalloff: 52,
        slowFlashStart: 0.60,
        slowFlashDuration: 0.82,
        fastFlashStart: 1.75,
        fastFlashCount: 3,
        fastFlashInterval: 0.18,
        fastFlashDuration: 0.11,
        spinDirection: 'ltr_cw',
        spinStartAngle: -14,
        spinEndAngle: 16,
        spinArcRadiusX: 48,
        spinArcRadiusY: 28,
        spin3DTilt: 12,
        showSpinGuide: false,
        particlesEnabled: true,
        particleCount: 110,
        particleFallSpeed: 0.95,
        particleWindSway: 0.75,
        particleSize: 2.8,
        particleColor: '#e2e8f0',
        glitchIntensity: 72,
        glitchDuration: 0.44,
        glitchSliceCount: 12,
        glitchChromaticOffset: 15,
        subject2CyanGrade: 88,
        subject2RevealZoom: 1.08,
        duration: 5.8,
        speedMultiplier: 0.92,
        enableAudioSFX: true,
        sfxVolume: 80
      }
    }
  };

  const DEFAULT_CONFIG = Object.assign({
    type: 'jani-spin-flash-glitch',
    // Image 1: Full Uncut Wide Scene (NO background removed) zoomed in on a part of the bigger image!
    subject1Url: '/interview_cutin_cinematic.jpg',
    sub1Zoom: 1.68,           // Zoomed-in factor into the bigger image (1.0x - 3.0x)
    sub1FocalX: 57,           // % horizontal crop focal center inside the bigger image
    sub1FocalY: 32,           // % vertical crop focal center inside the bigger image
    sub1Brightness: 104,      // %
    sub1Contrast: 112,        // %
    sub1Saturation: 105,      // %
    sub1Blur: 0,              // px
    sub1RotationOffset: 0,    // deg manual offset
    sub1KeepFullBg: true,     // No background removed (full uncut scene)

    // Image 2: Revealed Different Person after Glitch
    subject2Url: '/cinematic_split_scene.jpg',
    sub2Zoom: 1.28,           // Zoom factor on Person 2
    sub2FocalX: 50,           // % horizontal focal center
    sub2FocalY: 34,           // % vertical focal center
    sub2Brightness: 98,       // %
    sub2Contrast: 118,        // %
    sub2Saturation: 92,       // %
    sub2Blur: 0,              // px

    // Background Layer (Z=0)
    bgUrl: '',
    bgColor: '#05070e',
    bgStyle: 'warm_courtroom', // 'warm_courtroom' | 'cyan_noir' | 'dark_void' | 'custom'
    bgBlur: 0,

    // Layer Stack Management
    selectedLayerId: 'sub1',
    layerFilterKind: 'all',
    stackDirection: 'bg_first', // 'bg_first' (Z=0 at top, then layers after it) | 'top_down' (Photoshop top-down)
    layers: JSON.parse(JSON.stringify(DEFAULT_LAYER_STACK)),
    extraLayers: []
  }, MOOD_PRESETS.investigative_expose.settings);

  window.JANI_SPIN_FLASH_GLITCH_CONFIG = Object.assign({}, DEFAULT_CONFIG);
  window.JANI_SPIN_FLASH_GLITCH_PRESETS = MOOD_PRESETS;

  // Deterministic falling particles pool
  const PARTICLE_POOL_MAX = 160;
  const particlePool = [];
  for (let i = 0; i < PARTICLE_POOL_MAX; i++) {
    const seed1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const seed2 = Math.sin(i * 93.9898 + 12.456) * 23421.6312;
    const seed3 = Math.sin(i * 45.164 + 39.871) * 19283.4719;
    particlePool.push({
      x0: seed1 - Math.floor(seed1),
      y0: seed2 - Math.floor(seed2),
      sizeMult: 0.55 + (seed3 - Math.floor(seed3)) * 1.15,
      speedMult: 0.65 + ((seed1 * 1.7) - Math.floor(seed1 * 1.7)) * 0.85,
      swayFreq: 1.2 + ((seed2 * 2.3) - Math.floor(seed2 * 2.3)) * 2.4,
      swayPhase: (seed3 - Math.floor(seed3)) * Math.PI * 2,
      alphaBase: 0.35 + ((seed1 * 3.1) - Math.floor(seed1 * 3.1)) * 0.55
    });
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function ensureLayerList(d) {
    if (!Array.isArray(d.layers) || d.layers.length < 5) {
      d.layers = JSON.parse(JSON.stringify(DEFAULT_LAYER_STACK));
    }
    if (!Array.isArray(d.extraLayers)) {
      d.extraLayers = [];
    }
    return d.layers;
  }

  function getLayerMeta(d, id) {
    const list = ensureLayerList(d);
    const found = list.find(l => l.id === id) || (d.extraLayers || []).find(l => l.id === id);
    if (found) return found;
    return DEFAULT_LAYER_STACK.find(l => l.id === id) || { id, zIndex: 1, visible: true, locked: false, opacity: 100, blendMode: 'normal' };
  }

  function hexToRgb(hex) {
    const clean = String(hex || '#38bdf8').replace('#', '').trim();
    if (clean.length === 3) {
      return {
        r: parseInt(clean[0] + clean[0], 16) || 56,
        g: parseInt(clean[1] + clean[1], 16) || 189,
        b: parseInt(clean[2] + clean[2], 16) || 248
      };
    }
    return {
      r: parseInt(clean.slice(0, 2), 16) || 56,
      g: parseInt(clean.slice(2, 4), 16) || 189,
      b: parseInt(clean.slice(4, 6), 16) || 248
    };
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Web Audio API Synthesizer
  let sharedAudioCtx = null;
  let lastTriggeredCueKey = '';

  function getAudioCtx() {
    if (typeof window === 'undefined') return null;
    if (!sharedAudioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) sharedAudioCtx = new AC();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  }

  function playSpinFlashSound(cueType, d) {
    const cfg = Object.assign({}, DEFAULT_CONFIG, d || {});
    if (cfg.enableAudioSFX === false) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterVol = clamp((Number(cfg.sfxVolume) || 85) / 100, 0, 1) * 0.38;
    if (masterVol <= 0.005) return;

    if (cueType === 'slow_flash') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.32);
      gain.gain.setValueAtTime(masterVol * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);

      const bufSize = Math.floor(ctx.sampleRate * 0.08);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.22));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1850;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(masterVol * 1.1, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);

      const whine = ctx.createOscillator();
      const wGain = ctx.createGain();
      whine.type = 'triangle';
      whine.frequency.setValueAtTime(2800, now + 0.02);
      whine.frequency.exponentialRampToValueAtTime(5400, now + 0.45);
      wGain.gain.setValueAtTime(masterVol * 0.16, now + 0.02);
      wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      whine.connect(wGain);
      wGain.connect(ctx.destination);
      whine.start(now + 0.02);
      whine.stop(now + 0.50);
    } else if (cueType === 'fast_flash') {
      const bufSize = Math.floor(ctx.sampleRate * 0.045);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.15));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2400;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(masterVol * 0.95, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
    } else if (cueType === 'glitch_reveal') {
      const bufSize = Math.floor(ctx.sampleRate * 0.24);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const step = Math.floor(i / 180) % 2 === 0 ? 1 : -0.6;
        data[i] = (Math.random() * 2 - 1) * step * Math.exp(-i / (bufSize * 0.55));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1100;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(masterVol * 0.85, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);

      const sub = ctx.createOscillator();
      const sGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(92, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 0.65);
      sGain.gain.setValueAtTime(masterVol * 1.15, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);
      sub.connect(sGain);
      sGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.70);
    }
  }

  window.auditionJaniSpinFlashGlitchSFX = function (data) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    playSpinFlashSound('slow_flash', d);
    const fastCount = clamp(parseInt(d.fastFlashCount, 10) || 3, 1, 6);
    const intervalMs = Math.max(70, (Number(d.fastFlashInterval) || 0.16) * 1000);
    for (let i = 0; i < fastCount; i++) {
      setTimeout(() => playSpinFlashSound('fast_flash', d), 550 + i * intervalMs);
    }
    setTimeout(() => playSpinFlashSound('glitch_reveal', d), 550 + fastCount * intervalMs + 60);
  };

  function computeSpinFlashGlitchState(data, rawT) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const speed = clamp(Number(d.speedMultiplier) || 1.0, 0.25, 3.0);
    const totalDur = Math.max(2.8, Number(d.duration) || 5.4);
    const t = ((rawT * speed) % totalDur + totalDur) % totalDur;

    // 1. Flash Timings (1 Slow Flash + N Fast Strobes)
    const slowStart = clamp(Number(d.slowFlashStart) || 0.52, 0.1, 2.5);
    const slowDur = clamp(Number(d.slowFlashDuration) || 0.68, 0.2, 1.8);
    const fastStart = Math.max(slowStart + slowDur * 0.65, Number(d.fastFlashStart) || 1.58);
    const fastCount = clamp(parseInt(d.fastFlashCount, 10) || 3, 2, 6);
    const fastInterval = clamp(Number(d.fastFlashInterval) || 0.16, 0.06, 0.45);
    const fastDur = clamp(Number(d.fastFlashDuration) || 0.095, 0.04, 0.30);

    let slowFlashEnv = 0;
    if (t >= slowStart && t <= slowStart + slowDur) {
      const localP = (t - slowStart) / slowDur;
      if (localP < 0.18) {
        slowFlashEnv = easeOutCubic(localP / 0.18);
      } else {
        slowFlashEnv = Math.pow(1 - (localP - 0.18) / 0.82, 1.85);
      }
    }

    let fastFlashEnv = 0;
    let activeFastIndex = -1;
    for (let i = 0; i < fastCount; i++) {
      const fStart = fastStart + i * fastInterval;
      if (t >= fStart && t <= fStart + fastDur) {
        const lp = (t - fStart) / fastDur;
        const env = lp < 0.15 ? (lp / 0.15) : Math.pow(1 - (lp - 0.15) / 0.85, 1.6);
        const boost = 0.88 + (i / Math.max(1, fastCount - 1)) * 0.28;
        if (env * boost > fastFlashEnv) {
          fastFlashEnv = env * boost;
          activeFastIndex = i + 2;
        }
      }
    }

    const totalFlashes = 1 + fastCount;
    let activeFlashNumber = 0;
    if (fastFlashEnv > 0.05) activeFlashNumber = activeFastIndex;
    else if (slowFlashEnv > 0.05) activeFlashNumber = 1;

    // 2. Glitch Window & Subject 2 Transition
    const lastFastEnd = fastStart + (fastCount - 1) * fastInterval + fastDur * 0.65;
    const glitchStart = lastFastEnd;
    const glitchDur = clamp(Number(d.glitchDuration) || 0.46, 0.15, 1.4);
    const glitchEnd = glitchStart + glitchDur;

    let isGlitching = false;
    let glitchProgress = 0;
    let glitchEnvelope = 0;
    if (t >= glitchStart && t <= glitchEnd) {
      isGlitching = true;
      glitchProgress = (t - glitchStart) / glitchDur;
      glitchEnvelope = Math.sin(glitchProgress * Math.PI);
    }

    const glitchFlashCarry = isGlitching && glitchProgress < 0.55
      ? Math.pow(1 - glitchProgress / 0.55, 1.5) * 0.85
      : 0;

    const rawFlashPower = Math.max(slowFlashEnv, fastFlashEnv, glitchFlashCarry);
    const brillianceMult = clamp((Number(d.flashBrilliance) || 225) / 100, 0.3, 3.5);
    const flashIntensity = clamp(rawFlashPower * (brillianceMult / 2.2), 0, 1.35);

    const switchPoint = glitchStart + glitchDur * 0.48;
    const showingSubject2 = t >= switchPoint;

    // 3. Circular Spin Motion from Left to Right (Doodle Arc) for Subject 1 (Zoomed-in part of bigger uncut image)
    const spinPhaseDuration = Math.max(0.5, glitchEnd);
    const spinP = clamp(t / spinPhaseDuration, 0, 1);
    const easedSpin = easeInOutCubic(spinP);
    const dirSign = d.spinDirection === 'rtl_ccw' ? -1 : 1;

    const startDeg = Number(d.spinStartAngle) !== undefined ? Number(d.spinStartAngle) : -18;
    const endDeg = Number(d.spinEndAngle) !== undefined ? Number(d.spinEndAngle) : 22;
    const rotOffset = Number(d.sub1RotationOffset) || 0;
    const currentSpinDeg = (startDeg + (endDeg - startDeg) * easedSpin) * dirSign + rotOffset;

    const arcRadX = (Number(d.spinArcRadiusX) !== undefined ? Number(d.spinArcRadiusX) : 58) * dirSign;
    const arcRadY = Number(d.spinArcRadiusY) !== undefined ? Number(d.spinArcRadiusY) : 34;
    const arcTheta = (easedSpin - 0.5) * Math.PI;
    const spinOffsetX = Math.sin(arcTheta) * arcRadX;
    const spinOffsetY = -Math.cos(arcTheta) * arcRadY + arcRadY * 0.45;

    const tilt3D = Number(d.spin3DTilt) !== undefined ? Number(d.spin3DTilt) : 16;
    const rotateY = Math.sin(arcTheta) * tilt3D * dirSign;
    const rotateX = Math.cos(arcTheta) * (tilt3D * 0.45);

    // Base zoom is the user's "Zoomed-In Part of Bigger Image" scale (default 1.68x so rotating never shows edges!)
    const baseSub1Zoom = clamp(Number(d.sub1Zoom) || 1.68, 1.0, 3.2);
    const subject1Scale = baseSub1Zoom * (1.0 + Math.sin(easedSpin * Math.PI) * 0.06 + rawFlashPower * 0.03);

    // 4. Subject 2 Reveal Motion
    const revealDur = Math.max(0.4, totalDur - switchPoint);
    const revealP = showingSubject2 ? clamp((t - switchPoint) / revealDur, 0, 1) : 0;
    const baseSub2Zoom = clamp(Number(d.sub2Zoom) || 1.28, 1.0, 3.0);
    const targetRevZoom = Number(d.subject2RevealZoom) || 1.12;
    const subject2Scale = baseSub2Zoom * (1.0 + easeOutCubic(revealP) * (targetRevZoom - 1.0));

    // 5. Flashlight hotspot coordinates
    const spotX = 50 + Math.sin(arcTheta) * 14 * dirSign;
    const spotY = 44 - Math.cos(arcTheta) * 8;

    let cueKey = '';
    if (activeFlashNumber === 1) cueKey = 'slow_1';
    else if (activeFlashNumber >= 2) cueKey = 'fast_' + activeFlashNumber;
    else if (isGlitching && glitchProgress < 0.25) cueKey = 'glitch';

    return {
      t,
      totalDur,
      showingSubject2,
      activeFlashNumber,
      totalFlashes,
      slowFlashEnv,
      fastFlashEnv,
      flashIntensity,
      rawFlashPower,
      brillianceMult,
      spotX,
      spotY,
      spinP,
      easedSpin,
      currentSpinDeg,
      spinOffsetX,
      spinOffsetY,
      rotateY,
      rotateX,
      baseSub1Zoom,
      subject1Scale,
      isGlitching,
      glitchProgress,
      glitchEnvelope,
      revealP,
      baseSub2Zoom,
      subject2Scale,
      cueKey
    };
  }

  function buildSpinFlashGlitchHtml(tplId, data) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    ensureLayerList(d);

    // Ensure legacy '/ceo_portrait_cutout.jpg' upgrades to full uncut scene '/interview_cutin_cinematic.jpg'
    const s1 = (!d.subject1Url || d.subject1Url === '/ceo_portrait_cutout.jpg')
      ? '/interview_cutin_cinematic.jpg'
      : d.subject1Url;
    const s2 = (!d.subject2Url || d.subject2Url === '/ai_creator_portrait_cutout.png')
      ? '/cinematic_split_scene.jpg'
      : d.subject2Url;

    const rgb = hexToRgb(d.flashlightColor || '#38bdf8');
    const colorInt = clamp((Number(d.flashlightColorIntensity) ?? 72) / 100, 0, 1);

    const lBg = getLayerMeta(d, 'bg');
    const lSub1 = getLayerMeta(d, 'sub1');
    const lSub2 = getLayerMeta(d, 'sub2');
    const lGlitch = getLayerMeta(d, 'glitch');
    const lParticles = getLayerMeta(d, 'particles');
    const lFlash = getLayerMeta(d, 'flashlight');
    const lVig = getLayerMeta(d, 'vignette');

    const f1X = clamp(Number(d.sub1FocalX) ?? 57, 0, 100);
    const f1Y = clamp(Number(d.sub1FocalY) ?? 32, 0, 100);
    const f2X = clamp(Number(d.sub2FocalX) ?? 50, 0, 100);
    const f2Y = clamp(Number(d.sub2FocalY) ?? 34, 0, 100);

    const extraLayersHtml = (d.extraLayers || []).map((el, idx) => `
      <div id="jani-sfg-extra-${tplId}-${el.id}" data-layer-id="${el.id}" style="position: absolute; inset: 0; pointer-events: none; z-index: ${el.zIndex !== undefined ? el.zIndex : (7 + idx)}; display: ${el.visible === false ? 'none' : 'flex'}; align-items: center; justify-content: center; opacity: ${clamp((Number(el.opacity) ?? 100) / 100, 0, 1)}; mix-blend-mode: ${el.blendMode || 'normal'};">
        <img src="${el.url}" alt="${el.name || 'Layer'}" style="width: 100%; height: 100%; object-fit: ${el.fit || 'contain'}; transform: translate(${el.offsetX || 0}px, ${el.offsetY || 0}px) scale(${(Number(el.scale) || 100) / 100});" />
      </div>
    `).join('');

    return `
      <div id="jani-sfg-viewport-${tplId}" class="jani-sfg-viewport" style="position: absolute; inset: 0; background: ${d.bgColor || '#04060b'}; overflow: hidden; perspective: 950px; user-select: none;">
        
        <!-- Z=0: BACKGROUND ENVIRONMENT PLATE LAYER -->
        <div id="jani-sfg-layer-bg-${tplId}" style="position: absolute; inset: 0; pointer-events: none; z-index: ${lBg.zIndex ?? 0}; display: ${lBg.visible === false ? 'none' : 'block'}; opacity: ${clamp((lBg.opacity ?? 100) / 100, 0, 1)}; mix-blend-mode: ${lBg.blendMode || 'normal'};">
          ${d.bgUrl ? `<img src="${d.bgUrl}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:blur(${d.bgBlur || 0}px);" />` : ''}
          <div id="jani-sfg-bg1-${tplId}" style="position: absolute; inset: -8%; background: radial-gradient(circle at 28% 32%, rgba(251, 191, 36, 0.25) 0%, transparent 38%), radial-gradient(circle at 76% 38%, rgba(217, 119, 6, 0.20) 0%, transparent 42%), radial-gradient(ellipse at 50% 45%, #241914 0%, #090707 70%, #020204 100%);"></div>
          <div id="jani-sfg-bg2-${tplId}" style="position: absolute; inset: 0; background: radial-gradient(circle at 58% 38%, rgba(0, 240, 255, 0.28) 0%, rgba(2, 132, 199, 0.14) 42%, #020611 85%); opacity: 0;"></div>
        </div>

        <!-- Z=1: IMAGE 1 (FULL UNCUT SCENE, ZOOMED-IN PART OF BIGGER IMAGE, SPINNING L->R) -->
        <div id="jani-sfg-sub1-rig-${tplId}" style="position: absolute; inset: -14%; transform-origin: 50% 50%; transform-style: preserve-3d; will-change: transform, filter, opacity; z-index: ${lSub1.zIndex ?? 1}; display: ${lSub1.visible === false ? 'none' : 'flex'}; mix-blend-mode: ${lSub1.blendMode || 'normal'}; align-items: center; justify-content: center; overflow: hidden;">
          <img id="jani-sfg-sub1-img-${tplId}" src="${s1}" alt="Primary Spinning Scene" style="width: 100%; height: 100%; object-fit: cover; object-position: ${f1X}% ${f1Y}%; transform-origin: ${f1X}% ${f1Y}%; box-shadow: 0 24px 60px rgba(0,0,0,0.85);" />
        </div>

        <!-- Z=2: IMAGE 2 (REVEALED DIFFERENT PERSON AFTER GLITCH) -->
        <div id="jani-sfg-sub2-rig-${tplId}" style="position: absolute; inset: 0; opacity: 0; transform-origin: ${f2X}% ${f2Y}%; will-change: transform, filter, opacity; z-index: ${lSub2.zIndex ?? 2}; display: ${lSub2.visible === false ? 'none' : 'flex'}; mix-blend-mode: ${lSub2.blendMode || 'normal'}; align-items: center; justify-content: center; overflow: hidden;">
          <img id="jani-sfg-sub2-img-${tplId}" src="${s2}" alt="Revealed Subject 2" style="width: 100%; height: 100%; object-fit: cover; object-position: ${f2X}% ${f2Y}%;" />
          <!-- Moody Cyan/Blue Documentary Lighting Wash on Subject 2 -->
          <div id="jani-sfg-sub2-cyan-${tplId}" style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0, 240, 255, 0.55) 0%, rgba(2, 132, 199, 0.42) 50%, rgba(15, 23, 42, 0.78) 100%); mix-blend-mode: color; pointer-events: none;"></div>
          <div id="jani-sfg-sub2-key-${tplId}" style="position: absolute; inset: 0; background: radial-gradient(circle at 56% 40%, rgba(56, 189, 248, 0.36) 0%, transparent 62%); mix-blend-mode: screen; pointer-events: none;"></div>
        </div>

        <!-- Z=3: GLITCH SLICE DISPLACEMENT & RGB CHROMATIC SPLIT FX LAYER -->
        <div id="jani-sfg-glitch-wrap-${tplId}" style="position: absolute; inset: 0; opacity: 0; pointer-events: none; z-index: ${lGlitch.zIndex ?? 3}; display: ${lGlitch.visible === false ? 'none' : 'block'}; mix-blend-mode: ${lGlitch.blendMode || 'screen'}; overflow: hidden;">
          <img id="jani-sfg-glitch-cyan-${tplId}" src="${s1}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${f1X}% ${f1Y}%; mix-blend-mode: screen; opacity: 0.85; filter: drop-shadow(-14px 0 0 rgba(0, 240, 255, 0.95)) brightness(1.6) contrast(1.4);" />
          <img id="jani-sfg-glitch-red-${tplId}" src="${s2}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${f2X}% ${f2Y}%; mix-blend-mode: screen; opacity: 0.85; filter: drop-shadow(14px 0 0 rgba(244, 63, 94, 0.95)) brightness(1.5) contrast(1.4);" />
          <div id="jani-sfg-glitch-slices-${tplId}" style="position: absolute; inset: 0;"></div>
          <div id="jani-sfg-glitch-frost-${tplId}" style="position: absolute; inset: 0; backdrop-filter: blur(8px) contrast(180%) brightness(160%); background: linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},0.55) 48%, rgba(255,255,255,0.65) 100%); mix-blend-mode: screen;"></div>
        </div>

        <!-- Z=4: FALLING PARTICLES LAYER -->
        <canvas id="jani-sfg-particles-${tplId}" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: ${lParticles.zIndex ?? 4}; display: ${lParticles.visible === false ? 'none' : 'block'}; opacity: ${clamp((lParticles.opacity ?? 100) / 100, 0, 1)}; mix-blend-mode: ${lParticles.blendMode || 'screen'};"></canvas>

        <!-- Z=5: FLASHLIGHT CONE & 1 SLOW + 3 FAST STROBES LAYER -->
        <div id="jani-sfg-layer-flash-${tplId}" style="position: absolute; inset: 0; pointer-events: none; z-index: ${lFlash.zIndex ?? 5}; display: ${lFlash.visible === false ? 'none' : 'block'}; opacity: ${clamp((lFlash.opacity ?? 100) / 100, 0, 1)}; mix-blend-mode: ${lFlash.blendMode || 'screen'};">
          <div id="jani-sfg-flashlight-cone-${tplId}" style="position: absolute; inset: 0; opacity: 0; background: radial-gradient(circle at 50% 44%, rgba(255,255,255,1) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${(0.45 + colorInt * 0.5).toFixed(2)}) 34%, rgba(${rgb.r},${rgb.g},${rgb.b},0.15) 64%, transparent 85%);"></div>
          <div id="jani-sfg-flash-full-${tplId}" style="position: absolute; inset: 0; opacity: 0; background: radial-gradient(circle at 50% 44%, #ffffff 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${(0.55 + colorInt * 0.45).toFixed(2)}) 58%, rgba(255,255,255,0.9) 100%);"></div>
        </div>

        <!-- Z=6: CINEMATIC VIGNETTE LAYER -->
        <div id="jani-sfg-vignette-${tplId}" style="position: absolute; inset: 0; pointer-events: none; z-index: ${lVig.zIndex ?? 6}; display: ${lVig.visible === false ? 'none' : 'block'}; opacity: ${clamp((lVig.opacity ?? 100) / 100, 0, 1)}; mix-blend-mode: ${lVig.blendMode || 'normal'}; background: radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,${clamp((Number(d.flashlightFalloff) || 60) / 100, 0.2, 0.92).toFixed(2)}) 100%);"></div>

        <!-- EXTRA USER LAYERS -->
        ${extraLayersHtml}

        <!-- Optional Doodle Circular Spin Arc Path Guide -->
        <svg id="jani-sfg-spin-guide-${tplId}" viewBox="0 0 640 360" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 25; display: ${d.showSpinGuide ? 'block' : 'none'};">
          <path d="M 120 110 C 220 28, 420 28, 520 115" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 6" opacity="0.9"/>
          <polygon points="520,115 498,102 508,125" fill="#ef4444"/>
          <text x="320" y="42" text-anchor="middle" fill="#fca5a5" font-family="monospace" font-size="11" font-weight="800">CLOCKWISE SPIN ARC (L → R)</text>
        </svg>
      </div>
    `;
  }

  function renderFallingParticlesToCanvas(ctx, w, h, t, d, flashBoost) {
    const lParticles = getLayerMeta(d, 'particles');
    if (!ctx || d.particlesEnabled === false || lParticles.visible === false) {
      if (ctx) ctx.clearRect(0, 0, w, h);
      return;
    }
    ctx.clearRect(0, 0, w, h);
    const count = clamp(parseInt(d.particleCount, 10) || 68, 5, PARTICLE_POOL_MAX);
    const fallSpeed = clamp(Number(d.particleFallSpeed) || 1.25, 0.1, 4.0);
    const windSway = clamp(Number(d.particleWindSway) !== undefined ? Number(d.particleWindSway) : 0.45, 0, 2.5);
    const baseSize = clamp(Number(d.particleSize) || 2.4, 0.8, 6.0);
    const pRgb = hexToRgb(d.particleColor || '#fde68a');
    const fRgb = hexToRgb(d.flashlightColor || '#38bdf8');
    const colorMix = clamp((flashBoost || 0) * ((Number(d.flashlightColorIntensity) || 72) / 100), 0, 1);

    const r = Math.round(pRgb.r * (1 - colorMix) + fRgb.r * colorMix);
    const g = Math.round(pRgb.g * (1 - colorMix) + fRgb.g * colorMix);
    const b = Math.round(pRgb.b * (1 - colorMix) + fRgb.b * colorMix);
    const layerOp = clamp((lParticles.opacity ?? 100) / 100, 0, 1);

    for (let i = 0; i < count; i++) {
      const p = particlePool[i];
      const fallDist = t * 0.22 * fallSpeed * p.speedMult;
      const pyNorm = (p.y0 + fallDist) % 1.08 - 0.04;
      const swayOffset = Math.sin(t * p.swayFreq + p.swayPhase) * 0.035 * windSway;
      const pxNorm = ((p.x0 + swayOffset + t * 0.02 * windSway) % 1.08 + 1.08) % 1.08 - 0.04;

      const px = pxNorm * w;
      const py = pyNorm * h;
      const rad = baseSize * p.sizeMult * (w / 640);
      const alpha = clamp((p.alphaBase + (flashBoost || 0) * 0.45) * layerOp, 0.05, 1.0);

      const grad = ctx.createRadialGradient(px, py, 0, px, py, rad * 2.8);
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha.toFixed(2)})`);
      grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.75).toFixed(2)})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, rad * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function stepJaniSpinFlashGlitchAnimation(container, tplId, rawT, data) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    ensureLayerList(d);
    const st = computeSpinFlashGlitchState(d, rawT);

    if (st.cueKey && st.cueKey !== lastTriggeredCueKey && container.id === 'tpl-modal-preview-stage') {
      lastTriggeredCueKey = st.cueKey;
      if (st.cueKey === 'slow_1') playSpinFlashSound('slow_flash', d);
      else if (st.cueKey.startsWith('fast_')) playSpinFlashSound('fast_flash', d);
      else if (st.cueKey === 'glitch') playSpinFlashSound('glitch_reveal', d);
    } else if (!st.cueKey && container.id === 'tpl-modal-preview-stage') {
      lastTriggeredCueKey = '';
    }

    const lBg = getLayerMeta(d, 'bg');
    const lSub1 = getLayerMeta(d, 'sub1');
    const lSub2 = getLayerMeta(d, 'sub2');
    const lGlitch = getLayerMeta(d, 'glitch');
    const lParticles = getLayerMeta(d, 'particles');
    const lFlash = getLayerMeta(d, 'flashlight');
    const lVig = getLayerMeta(d, 'vignette');

    const layerBgEl = container.querySelector(`#jani-sfg-layer-bg-${tplId}`);
    const sub1Rig = container.querySelector(`#jani-sfg-sub1-rig-${tplId}`);
    const sub1Img = container.querySelector(`#jani-sfg-sub1-img-${tplId}`);
    const sub2Rig = container.querySelector(`#jani-sfg-sub2-rig-${tplId}`);
    const sub2Img = container.querySelector(`#jani-sfg-sub2-img-${tplId}`);
    const sub2Cyan = container.querySelector(`#jani-sfg-sub2-cyan-${tplId}`);
    const bg1 = container.querySelector(`#jani-sfg-bg1-${tplId}`);
    const bg2 = container.querySelector(`#jani-sfg-bg2-${tplId}`);
    const layerFlashEl = container.querySelector(`#jani-sfg-layer-flash-${tplId}`);
    const coneEl = container.querySelector(`#jani-sfg-flashlight-cone-${tplId}`);
    const fullFlashEl = container.querySelector(`#jani-sfg-flash-full-${tplId}`);
    const glitchWrap = container.querySelector(`#jani-sfg-glitch-wrap-${tplId}`);
    const glitchCyan = container.querySelector(`#jani-sfg-glitch-cyan-${tplId}`);
    const glitchRed = container.querySelector(`#jani-sfg-glitch-red-${tplId}`);
    const glitchSlices = container.querySelector(`#jani-sfg-glitch-slices-${tplId}`);
    const glitchFrost = container.querySelector(`#jani-sfg-glitch-frost-${tplId}`);
    const pCanvas = container.querySelector(`#jani-sfg-particles-${tplId}`);
    const vigEl = container.querySelector(`#jani-sfg-vignette-${tplId}`);
    const guideEl = container.querySelector(`#jani-sfg-spin-guide-${tplId}`);

    const s1Url = (!d.subject1Url || d.subject1Url === '/ceo_portrait_cutout.jpg')
      ? '/interview_cutin_cinematic.jpg'
      : d.subject1Url;
    const s2Url = (!d.subject2Url || d.subject2Url === '/ai_creator_portrait_cutout.png')
      ? '/cinematic_split_scene.jpg'
      : d.subject2Url;

    const f1X = clamp(Number(d.sub1FocalX) ?? 57, 0, 100);
    const f1Y = clamp(Number(d.sub1FocalY) ?? 32, 0, 100);
    const f2X = clamp(Number(d.sub2FocalX) ?? 50, 0, 100);
    const f2Y = clamp(Number(d.sub2FocalY) ?? 34, 0, 100);

    if (sub1Img) {
      if (sub1Img.getAttribute('src') !== s1Url) sub1Img.src = s1Url;
      sub1Img.style.objectPosition = `${f1X}% ${f1Y}%`;
      sub1Img.style.transformOrigin = `${f1X}% ${f1Y}%`;
    }
    if (sub2Img) {
      if (sub2Img.getAttribute('src') !== s2Url) sub2Img.src = s2Url;
      sub2Img.style.objectPosition = `${f2X}% ${f2Y}%`;
    }
    if (glitchCyan && glitchCyan.getAttribute('src') !== s1Url) glitchCyan.src = s1Url;
    if (glitchRed && glitchRed.getAttribute('src') !== s2Url) glitchRed.src = s2Url;
    if (guideEl) guideEl.style.display = d.showSpinGuide ? 'block' : 'none';

    if (layerBgEl) {
      layerBgEl.style.display = lBg.visible === false ? 'none' : 'block';
      layerBgEl.style.zIndex = String(lBg.zIndex ?? 0);
      layerBgEl.style.opacity = String(clamp((lBg.opacity ?? 100) / 100, 0, 1));
      layerBgEl.style.mixBlendMode = lBg.blendMode || 'normal';
    }

    // 1. Update Subject 1 (Zoomed-in part of bigger uncut image spinning L -> R)
    if (sub1Rig) {
      sub1Rig.style.display = lSub1.visible === false ? 'none' : 'flex';
      sub1Rig.style.zIndex = String(lSub1.zIndex ?? 1);
      sub1Rig.style.mixBlendMode = lSub1.blendMode || 'normal';
      const l1Op = clamp((lSub1.opacity ?? 100) / 100, 0, 1);

      if (!st.showingSubject2 && lSub1.visible !== false) {
        sub1Rig.style.opacity = l1Op.toFixed(2);
        // Pan shift based on focal point so zooming into (f1X, f1Y) centers that region in the viewport
        const panX = (50 - f1X) * (st.baseSub1Zoom - 1) * 0.85;
        const panY = (50 - f1Y) * (st.baseSub1Zoom - 1) * 0.85;
        sub1Rig.style.transform = `translate3d(${(st.spinOffsetX + panX).toFixed(1)}px, ${(st.spinOffsetY + panY).toFixed(1)}px, 0) rotateX(${st.rotateX.toFixed(2)}deg) rotateY(${st.rotateY.toFixed(2)}deg) rotateZ(${st.currentSpinDeg.toFixed(2)}deg) scale(${st.subject1Scale.toFixed(3)})`;

        const baseB = Number(d.sub1Brightness) || 104;
        const baseC = Number(d.sub1Contrast) || 112;
        const baseS = Number(d.sub1Saturation) !== undefined ? Number(d.sub1Saturation) : 105;
        const baseBlur = Number(d.sub1Blur) || 0;
        const bBoost = baseB + st.flashIntensity * 140;
        const cBoost = baseC + st.flashIntensity * 38;
        sub1Rig.style.filter = `brightness(${bBoost.toFixed(0)}%) contrast(${cBoost.toFixed(0)}%) saturate(${baseS}%) blur(${baseBlur}px)`;
      } else {
        sub1Rig.style.opacity = '0';
      }
    }
    if (bg1) bg1.style.opacity = st.showingSubject2 ? '0' : '1';
    if (bg2) bg2.style.opacity = st.showingSubject2 ? '1' : '0';

    // 2. Update Subject 2 (Revealed Person after Glitch)
    if (sub2Rig) {
      sub2Rig.style.display = lSub2.visible === false ? 'none' : 'flex';
      sub2Rig.style.zIndex = String(lSub2.zIndex ?? 2);
      sub2Rig.style.mixBlendMode = lSub2.blendMode || 'normal';
      const l2Op = clamp((lSub2.opacity ?? 100) / 100, 0, 1);

      if (st.showingSubject2 && lSub2.visible !== false) {
        sub2Rig.style.opacity = l2Op.toFixed(2);
        const pan2X = (50 - f2X) * (st.baseSub2Zoom - 1) * 0.85;
        const pan2Y = (50 - f2Y) * (st.baseSub2Zoom - 1) * 0.85;
        sub2Rig.style.transform = `translate3d(${pan2X.toFixed(1)}px, ${pan2Y.toFixed(1)}px, 0) scale(${st.subject2Scale.toFixed(4)})`;

        const baseB2 = Number(d.sub2Brightness) || 98;
        const baseC2 = Number(d.sub2Contrast) || 118;
        const baseS2 = Number(d.sub2Saturation) !== undefined ? Number(d.sub2Saturation) : 92;
        const baseBlur2 = Number(d.sub2Blur) || 0;
        const settleFlash = st.isGlitching ? st.glitchEnvelope * 65 : 0;
        sub2Rig.style.filter = `brightness(${(baseB2 + settleFlash).toFixed(0)}%) contrast(${baseC2}%) saturate(${baseS2}%) blur(${baseBlur2}px)`;
      } else {
        sub2Rig.style.opacity = '0';
      }
    }
    if (sub2Cyan) {
      sub2Cyan.style.opacity = clamp((Number(d.subject2CyanGrade) ?? 78) / 100, 0, 1).toFixed(2);
    }

    // 3. Update Flashlight Cone & Full Strobe Overexposure
    const rgb = hexToRgb(d.flashlightColor || '#38bdf8');
    const colorInt = clamp((Number(d.flashlightColorIntensity) ?? 72) / 100, 0, 1);
    const coneRad = clamp(Number(d.flashlightRadius) || 64, 20, 100);

    if (layerFlashEl) {
      layerFlashEl.style.display = lFlash.visible === false ? 'none' : 'block';
      layerFlashEl.style.zIndex = String(lFlash.zIndex ?? 5);
      layerFlashEl.style.opacity = String(clamp((lFlash.opacity ?? 100) / 100, 0, 1));
      layerFlashEl.style.mixBlendMode = lFlash.blendMode || 'screen';
    }

    if (coneEl) {
      const coneOpacity = lFlash.visible === false ? 0 : clamp(st.flashIntensity * 1.15, 0, 1);
      coneEl.style.opacity = coneOpacity.toFixed(3);
      coneEl.style.background = `radial-gradient(circle at ${st.spotX.toFixed(1)}% ${st.spotY.toFixed(1)}%, rgba(255,255,255,${(1 - colorInt * 0.35).toFixed(2)}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${(0.45 + colorInt * 0.55).toFixed(2)}) ${(coneRad * 0.52).toFixed(0)}%, rgba(${rgb.r},${rgb.g},${rgb.b},${(0.18 + colorInt * 0.35).toFixed(2)}) ${coneRad.toFixed(0)}%, transparent 92%)`;
    }

    if (fullFlashEl) {
      const fullOp = (lFlash.visible !== false && st.flashIntensity > 0.35) ? clamp((st.flashIntensity - 0.35) * 1.25, 0, 0.92) : 0;
      fullFlashEl.style.opacity = fullOp.toFixed(3);
      fullFlashEl.style.background = `radial-gradient(circle at ${st.spotX.toFixed(1)}% ${st.spotY.toFixed(1)}%, #ffffff 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${(0.45 + colorInt * 0.55).toFixed(2)}) 55%, rgba(${rgb.r},${rgb.g},${rgb.b},${(0.25 + colorInt * 0.5).toFixed(2)}) 100%)`;
    }

    // 4. Update Glitch Transition Layer
    if (glitchWrap) {
      glitchWrap.style.display = lGlitch.visible === false ? 'none' : 'block';
      glitchWrap.style.zIndex = String(lGlitch.zIndex ?? 3);
      glitchWrap.style.mixBlendMode = lGlitch.blendMode || 'screen';
      const gLayerOp = clamp((lGlitch.opacity ?? 100) / 100, 0, 1);
      const gInt = clamp((Number(d.glitchIntensity) ?? 85) / 100, 0, 1) * gLayerOp;

      if (st.isGlitching && gInt > 0.02 && lGlitch.visible !== false) {
        glitchWrap.style.opacity = clamp(st.glitchEnvelope * gInt * 1.35, 0, 1).toFixed(3);
        const chrom = (Number(d.glitchChromaticOffset) || 18) * gInt;
        const jitterX = Math.sin(st.t * 95) * chrom;
        const jitterY = Math.cos(st.t * 73) * (chrom * 0.35);

        if (glitchCyan) {
          glitchCyan.style.transform = `translate3d(${(-chrom + jitterX).toFixed(1)}px, ${jitterY.toFixed(1)}px, 0) scale(${st.baseSub1Zoom.toFixed(2)}) rotate(${(st.currentSpinDeg * 0.4).toFixed(1)}deg)`;
        }
        if (glitchRed) {
          glitchRed.style.transform = `translate3d(${(chrom - jitterX).toFixed(1)}px, ${(-jitterY).toFixed(1)}px, 0) scale(${st.baseSub2Zoom.toFixed(2)})`;
        }
        if (glitchFrost) {
          glitchFrost.style.opacity = clamp(st.glitchEnvelope * 0.85, 0, 0.9).toFixed(2);
          glitchFrost.style.background = `linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${(0.45 + colorInt * 0.5).toFixed(2)}) 50%, rgba(255,255,255,0.65) 100%)`;
        }
        if (glitchSlices) {
          const sliceCount = clamp(parseInt(d.glitchSliceCount, 10) || 14, 4, 24);
          let slicesHtml = '';
          for (let s = 0; s < sliceCount; s++) {
            const seed = Math.sin(s * 31.7 + Math.floor(st.t * 28) * 17.3);
            if (Math.abs(seed) > 0.25) {
              const topPct = (s / sliceCount) * 100;
              const hPct = (100 / sliceCount) * (0.6 + Math.abs(seed) * 0.7);
              const shiftPx = seed * 55 * gInt;
              const isCyanSlice = s % 2 === 0;
              const sliceCol = isCyanSlice
                ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`
                : `rgba(255, 255, 255, 0.65)`;
              slicesHtml += `<div style="position:absolute; left:0; right:0; top:${topPct.toFixed(1)}%; height:${hPct.toFixed(1)}%; transform:translateX(${shiftPx.toFixed(1)}px); background:${sliceCol}; mix-blend-mode:screen; backdrop-filter:blur(4px);"></div>`;
            }
          }
          glitchSlices.innerHTML = slicesHtml;
        }
      } else {
        glitchWrap.style.opacity = '0';
      }
    }

    // 5. Render Falling Particles
    if (pCanvas) {
      pCanvas.style.display = lParticles.visible === false ? 'none' : 'block';
      pCanvas.style.zIndex = String(lParticles.zIndex ?? 4);
      pCanvas.style.mixBlendMode = lParticles.blendMode || 'screen';
      const rect = container.getBoundingClientRect();
      const targetW = Math.max(320, Math.round(rect.width || 640));
      const targetH = Math.max(180, Math.round(rect.height || 360));
      if (pCanvas.width !== targetW || pCanvas.height !== targetH) {
        pCanvas.width = targetW;
        pCanvas.height = targetH;
      }
      const pCtx = pCanvas.getContext('2d');
      renderFallingParticlesToCanvas(pCtx, pCanvas.width, pCanvas.height, st.t, d, st.flashIntensity);
    }

    // 6. Vignette Layer
    if (vigEl) {
      vigEl.style.display = lVig.visible === false ? 'none' : 'block';
      vigEl.style.zIndex = String(lVig.zIndex ?? 6);
      vigEl.style.opacity = String(clamp((lVig.opacity ?? 100) / 100, 0, 1));
      vigEl.style.mixBlendMode = lVig.blendMode || 'normal';
    }
  }

  // Image cache for Timeline 2D Canvas Rendering
  const imgCache = {};
  function getCachedImage(url) {
    if (!url) return null;
    if (!imgCache[url]) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      imgCache[url] = img;
    }
    return imgCache[url];
  }

  function drawCoverImageFocal(ctx, img, x, y, w, h, focalX = 50, focalY = 50) {
    if (!img || !img.complete || !img.naturalWidth) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    const sw = w / scale;
    const sh = h / scale;
    const sx = clamp((iw - sw) * (focalX / 100), 0, Math.max(0, iw - sw));
    const sy = clamp((ih - sh) * (focalY / 100), 0, Math.max(0, ih - sh));
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function renderJaniSpinFlashGlitchCanvas(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const savedData = (typeof window.tplGetContextualData === 'function')
      ? window.tplGetContextualData(TEMPLATE_ID)
      : DEFAULT_CONFIG;
    const d = Object.assign({}, DEFAULT_CONFIG, savedData, (clip && clip.fxScene && clip.fxScene.data) || {});
    ensureLayerList(d);
    const st = computeSpinFlashGlitchState(d, t);

    const s1Url = (!d.subject1Url || d.subject1Url === '/ceo_portrait_cutout.jpg')
      ? '/interview_cutin_cinematic.jpg'
      : d.subject1Url;
    const s2Url = (!d.subject2Url || d.subject2Url === '/ai_creator_portrait_cutout.png')
      ? '/cinematic_split_scene.jpg'
      : d.subject2Url;

    const img1 = getCachedImage(s1Url);
    const img2 = getCachedImage(s2Url);
    const rgb = hexToRgb(d.flashlightColor || '#38bdf8');
    const colorInt = clamp((Number(d.flashlightColorIntensity) ?? 72) / 100, 0, 1);

    const lBg = getLayerMeta(d, 'bg');
    const lSub1 = getLayerMeta(d, 'sub1');
    const lSub2 = getLayerMeta(d, 'sub2');
    const lGlitch = getLayerMeta(d, 'glitch');
    const lFlash = getLayerMeta(d, 'flashlight');

    const f1X = clamp(Number(d.sub1FocalX) ?? 57, 0, 100);
    const f1Y = clamp(Number(d.sub1FocalY) ?? 32, 0, 100);
    const f2X = clamp(Number(d.sub2FocalX) ?? 50, 0, 100);
    const f2Y = clamp(Number(d.sub2FocalY) ?? 34, 0, 100);

    ctx.save();
    ctx.fillStyle = d.bgColor || '#04060b';
    ctx.fillRect(0, 0, cw, ch);

    if (!st.showingSubject2) {
      if (lBg.visible !== false) {
        const bgGrad = ctx.createRadialGradient(cw * 0.5, ch * 0.45, cw * 0.05, cw * 0.5, ch * 0.5, cw * 0.7);
        bgGrad.addColorStop(0, '#261a14');
        bgGrad.addColorStop(1, '#040406');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, cw, ch);
      }

      if (lSub1.visible !== false) {
        ctx.save();
        ctx.globalAlpha = clamp((lSub1.opacity ?? 100) / 100, 0, 1);
        const panX = (50 - f1X) * (st.baseSub1Zoom - 1) * 0.85 * (cw / 640);
        const panY = (50 - f1Y) * (st.baseSub1Zoom - 1) * 0.85 * (ch / 360);
        ctx.translate(cw * 0.5 + st.spinOffsetX * (cw / 640) + panX, ch * 0.5 + st.spinOffsetY * (ch / 360) + panY);
        ctx.rotate((st.currentSpinDeg * Math.PI) / 180);
        ctx.scale(st.subject1Scale, st.subject1Scale);
        drawCoverImageFocal(ctx, img1, -cw * 0.58, -ch * 0.58, cw * 1.16, ch * 1.16, f1X, f1Y);
        ctx.restore();
      }
    } else {
      if (lBg.visible !== false) {
        const bg2Grad = ctx.createRadialGradient(cw * 0.56, ch * 0.4, cw * 0.05, cw * 0.5, ch * 0.5, cw * 0.75);
        bg2Grad.addColorStop(0, '#082f49');
        bg2Grad.addColorStop(1, '#020611');
        ctx.fillStyle = bg2Grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      if (lSub2.visible !== false) {
        ctx.save();
        ctx.globalAlpha = clamp((lSub2.opacity ?? 100) / 100, 0, 1);
        ctx.translate(cw * 0.5, ch * 0.5);
        ctx.scale(st.subject2Scale, st.subject2Scale);
        drawCoverImageFocal(ctx, img2, -cw * 0.5, -ch * 0.5, cw, ch, f2X, f2Y);
        ctx.restore();

        const cyanGrade = clamp((Number(d.subject2CyanGrade) ?? 78) / 100, 0, 1);
        if (cyanGrade > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = 'color';
          ctx.fillStyle = `rgba(0, 210, 255, ${(cyanGrade * 0.55).toFixed(2)})`;
          ctx.fillRect(0, 0, cw, ch);
          ctx.restore();
        }
      }
    }

    // Glitch Slice Displacement
    if (st.isGlitching && lGlitch.visible !== false) {
      const gInt = clamp((Number(d.glitchIntensity) ?? 85) / 100, 0, 1);
      const sliceCount = clamp(parseInt(d.glitchSliceCount, 10) || 14, 4, 24);
      const srcImg = st.showingSubject2 ? img2 : img1;
      for (let s = 0; s < sliceCount; s++) {
        const seed = Math.sin(s * 31.7 + Math.floor(st.t * 28) * 17.3);
        if (Math.abs(seed) > 0.22) {
          const sy = (s / sliceCount) * ch;
          const sh = (ch / sliceCount) * 0.85;
          const shiftX = seed * 48 * gInt * (cw / 640);
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, sy, cw, sh);
          ctx.clip();
          ctx.translate(shiftX, 0);
          drawCoverImageFocal(ctx, srcImg, 0, 0, cw, ch, st.showingSubject2 ? f2X : f1X, st.showingSubject2 ? f2Y : f1Y);
          ctx.fillStyle = s % 2 === 0
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(0.45 * st.glitchEnvelope).toFixed(2)})`
            : `rgba(255, 255, 255, ${(0.5 * st.glitchEnvelope).toFixed(2)})`;
          ctx.fillRect(0, sy, cw, sh);
          ctx.restore();
        }
      }
    }

    // Falling Particles
    renderFallingParticlesToCanvas(ctx, cw, ch, st.t, d, st.flashIntensity);

    // Flashlight Cone & Strobe Bloom
    if (st.flashIntensity > 0.01 && lFlash.visible !== false) {
      const fx = (st.spotX / 100) * cw;
      const fy = (st.spotY / 100) * ch;
      const coneRad = Math.max(cw, ch) * ((Number(d.flashlightRadius) || 64) / 100);
      const fGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, coneRad);
      const lFlashOp = clamp((lFlash.opacity ?? 100) / 100, 0, 1);
      const coreAlpha = clamp(st.flashIntensity * 1.1 * lFlashOp, 0, 1);
      const tintAlpha = clamp(st.flashIntensity * (0.45 + colorInt * 0.55) * lFlashOp, 0, 1);
      fGrad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha.toFixed(2)})`);
      fGrad.addColorStop(0.42, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${tintAlpha.toFixed(2)})`);
      fGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = fGrad;
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }

    ctx.restore();
  }

  function tplMountJaniSpinFlashGlitchStage(stage, data) {
    if (!stage) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #04060b; overflow: hidden;">
        ${buildSpinFlashGlitchHtml(TEMPLATE_ID, d)}
      </div>
    `;
    stepJaniSpinFlashGlitchAnimation(stage, TEMPLATE_ID, 0.62, d);
  }

  /**
   * Builds the Granular Videographer Inspector with NLE / Photoshop-style Layer Stack
   * (Aligned Z=0 Background First -> Layers that come after it, matching our project inspector bar UI)
   */
  function tplBuildJaniSpinFlashGlitchInspector(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    ensureLayerList(d);

    // Upgrade legacy default cutout URL if present
    if (!d.subject1Url || d.subject1Url === '/ceo_portrait_cutout.jpg') {
      d.subject1Url = '/interview_cutin_cinematic.jpg';
    }
    if (!d.subject2Url || d.subject2Url === '/ai_creator_portrait_cutout.png') {
      d.subject2Url = '/cinematic_split_scene.jpg';
    }

    const allLayers = [...d.layers, ...(d.extraLayers || [])];
    // Sort by zIndex: either Background First (Z=0 at top, then layers that come after it) or Top-Down
    const orderedLayers = allLayers.slice().sort((a, b) => {
      return d.stackDirection === 'top_down'
        ? ((b.zIndex ?? 0) - (a.zIndex ?? 0))
        : ((a.zIndex ?? 0) - (b.zIndex ?? 0));
    });

    const filterKind = d.layerFilterKind || 'all';
    const visibleStack = orderedLayers.filter(l => filterKind === 'all' ? true : l.kind === filterKind);
    const activeLayer = allLayers.find(l => l.id === (d.selectedLayerId || 'sub1')) || allLayers[1] || allLayers[0];

    const blendOptions = ['normal', 'screen', 'multiply', 'overlay', 'color-dodge', 'hard-light', 'lighten'];

    function getThumbForLayer(l) {
      if (l.id === 'sub1') return `<img src="${d.subject1Url}" style="width:28px; height:22px; border-radius:3px; object-fit:cover; object-position:${d.sub1FocalX ?? 57}% ${d.sub1FocalY ?? 32}%; border:1px solid rgba(56,189,248,0.4);" />`;
      if (l.id === 'sub2') return `<img src="${d.subject2Url}" style="width:28px; height:22px; border-radius:3px; object-fit:cover; border:1px solid rgba(6,182,212,0.4);" />`;
      if (l.id === 'bg') return d.bgUrl
        ? `<img src="${d.bgUrl}" style="width:28px; height:22px; border-radius:3px; object-fit:cover;" />`
        : `<div style="width:28px; height:22px; border-radius:3px; background:radial-gradient(circle,#261a14,#04060b); border:1px solid rgba(16,185,129,0.4); display:grid; place-items:center; font-size:8px; font-family:monospace; color:#34d399;">BG</div>`;
      if (l.url) return `<img src="${l.url}" style="width:28px; height:22px; border-radius:3px; object-fit:cover;" />`;
      const badgeMap = { glitch: 'GLX', particles: 'PRT', flashlight: 'FLS', vignette: 'VIG' };
      return `<div style="width:28px; height:22px; border-radius:3px; background:#090d16; border:1px solid ${l.colorTag || '#38bdf8'}; display:grid; place-items:center; font-size:8px; font-weight:800; font-family:monospace; color:${l.colorTag || '#38bdf8'};">${badgeMap[l.id] || 'FX'}</div>`;
    }

    const layerRowsHtml = visibleStack.map((l) => {
      const isSel = activeLayer && activeLayer.id === l.id;
      const isVis = l.visible !== false;
      const isLocked = !!l.locked;
      return `
        <div class="sfg-layer-row" data-layer-id="${l.id}" style="display:flex; align-items:center; gap:6px; background:${isSel ? 'linear-gradient(90deg, rgba(56,189,248,0.18), rgba(30,41,59,0.75))' : 'rgba(255,255,255,0.025)'}; border:1px solid ${isSel ? 'rgba(56,189,248,0.55)' : 'rgba(255,255,255,0.06)'}; border-left:4px solid ${l.colorTag || '#38bdf8'}; border-radius:6px; padding:5px 7px; cursor:pointer; transition:all 0.12s ease;">
          <!-- Eye Visibility Toggle -->
          <button type="button" class="sfg-layer-vis-btn" data-layer-id="${l.id}" title="Toggle Layer Visibility" style="width:20px; height:20px; border:none; background:rgba(255,255,255,0.04); border-radius:4px; color:${isVis ? '#e2e8f0' : '#475569'}; font-size:11px; cursor:pointer; display:grid; place-items:center; flex-shrink:0;">
            ${isVis ? '👁' : '—'}
          </button>

          <!-- Checkerboard / Media Thumbnail -->
          <div style="flex-shrink:0; background-image:linear-gradient(45deg,#1e293b 25%,transparent 25%),linear-gradient(-45deg,#1e293b 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1e293b 75%),linear-gradient(-45deg,transparent 75%,#1e293b 75%); background-size:6px 6px; border-radius:3px;">
            ${getThumbForLayer(l)}
          </div>

          <!-- Layer Name & Metadata -->
          <div style="flex:1; min-width:0; display:flex; flex-direction:column;">
            <span style="font-size:10.5px; font-weight:${isSel ? '700' : '600'}; color:${isVis ? '#f1f5f9' : '#64748b'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${l.name}
            </span>
            <span style="font-size:8.5px; color:#64748b; font-family:monospace;">
              ${(l.blendMode || 'normal').toUpperCase()} · ${l.opacity ?? 100}% ${l.id === 'sub1' ? `· Crop ${(Number(d.sub1Zoom) || 1.68).toFixed(2)}x (No BG Cut)` : ''}
            </span>
          </div>

          <!-- Z-Order Move Up / Down Buttons -->
          <div style="display:flex; align-items:center; gap:2px; flex-shrink:0;">
            <button type="button" class="sfg-layer-move-btn" data-layer-id="${l.id}" data-dir="-1" title="Move Layer Earlier in Stack" style="width:18px; height:18px; border-radius:4px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); color:#94a3b8; font-size:9px; cursor:pointer;">▲</button>
            <button type="button" class="sfg-layer-move-btn" data-layer-id="${l.id}" data-dir="1" title="Move Layer Later in Stack" style="width:18px; height:18px; border-radius:4px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); color:#94a3b8; font-size:9px; cursor:pointer;">▼</button>
            ${l.isExtra ? `<button type="button" class="sfg-layer-del-btn" data-layer-id="${l.id}" title="Delete Custom Layer" style="width:18px; height:18px; border-radius:4px; border:1px solid rgba(244,63,94,0.3); background:rgba(244,63,94,0.12); color:#fda4af; font-size:9px; cursor:pointer;">✕</button>` : ''}
            <span style="font-size:9.5px; color:${isLocked ? '#f59e0b' : '#475569'}; padding-left:2px;">${isLocked ? '🔒' : ''}</span>
          </div>
        </div>
      `;
    }).join('');

    // Build Selected Layer Contextual Property Inspector right underneath the Layer Stack!
    let selectedLayerControlsHtml = '';
    if (activeLayer.id === 'sub1') {
      const f1X = clamp(Number(d.sub1FocalX) ?? 57, 0, 100);
      const f1Y = clamp(Number(d.sub1FocalY) ?? 32, 0, 100);
      const z1 = clamp(Number(d.sub1Zoom) || 1.68, 1.0, 3.0);
      const boxW = Math.round(100 / z1);
      const boxH = Math.round(100 / z1);
      const boxLeft = clamp(f1X - boxW / 2, 0, 100 - boxW);
      const boxTop = clamp(f1Y - boxH / 2, 0, 100 - boxH);

      selectedLayerControlsHtml = `
        <div style="background:rgba(14,165,233,0.06); border:1px solid rgba(56,189,248,0.3); border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:10.5px; font-weight:800; color:#38bdf8;">🖼️ Layer 1: Zoomed-In Part of Bigger Image (No BG Removed)</span>
            <label style="padding:3px 8px; border-radius:5px; background:rgba(56,189,248,0.18); border:1px solid rgba(56,189,248,0.45); color:#e0f2fe; font-size:9.5px; font-weight:700; cursor:pointer;">
              📁 Replace Image 1
              <input type="file" id="sfg-file-sub1" accept="image/*,video/*" style="display:none;" />
            </label>
          </div>

          <!-- Interactive Full-Image Crop Viewport Map (Click/Drag to pick zoomed-in region!) -->
          <div style="display:flex; gap:10px; align-items:center;">
            <div id="sfg-sub1-crop-map" title="Click or drag to choose which zoomed-in part of the bigger uncut image is framed" style="position:relative; width:128px; height:76px; border-radius:6px; overflow:hidden; border:1px solid rgba(255,255,255,0.2); cursor:crosshair; flex-shrink:0; background:#000;">
              <img src="${d.subject1Url}" style="width:100%; height:100%; object-fit:cover; opacity:0.65; pointer-events:none;" />
              <div id="sfg-sub1-crop-rect" style="position:absolute; left:${boxLeft.toFixed(1)}%; top:${boxTop.toFixed(1)}%; width:${boxW}%; height:${boxH}%; border:2px solid #facc15; box-shadow:0 0 0 999px rgba(0,0,0,0.45); border-radius:2px; pointer-events:none; display:flex; align-items:center; justify-content:center;">
                <span style="width:4px; height:4px; border-radius:50%; background:#facc15;"></span>
              </div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:5px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:9.5px; color:#cbd5e1;">
                  <span>Crop Zoom (Bigger Image)</span>
                  <b id="sfg-val-sub1zoom" style="color:#facc15; font-family:monospace;">${z1.toFixed(2)}x</b>
                </div>
                <input type="range" id="sfg-inp-sub1zoom" min="1.05" max="2.80" step="0.02" value="${z1}" style="width:100%; accent-color:#facc15;" />
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                    <span>Focal Pan X</span><b id="sfg-val-sub1fx">${f1X}%</b>
                  </div>
                  <input type="range" id="sfg-inp-sub1fx" min="0" max="100" step="1" value="${f1X}" style="width:100%; accent-color:#38bdf8;" />
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                    <span>Focal Pan Y</span><b id="sfg-val-sub1fy">${f1Y}%</b>
                  </div>
                  <input type="range" id="sfg-inp-sub1fy" min="0" max="100" step="1" value="${f1Y}" style="width:100%; accent-color:#38bdf8;" />
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Uncut Wide Scene Presets for Image 1 -->
          <div style="display:flex; flex-wrap:wrap; gap:4px;">
            ${[
              { url: '/interview_cutin_cinematic.jpg', label: 'Executive Study (Uncut)' },
              { url: '/cinematic_split_scene.jpg', label: 'Night Street (Uncut)' },
              { url: '/boardroom_scene_hd.jpg', label: 'NYC Boardroom (Uncut)' },
              { url: '/power_meeting_cinematic_plate.jpg', label: 'War Room Table (Uncut)' }
            ].map(pr => `
              <button type="button" class="sfg-sub1-preset" data-url="${pr.url}" style="padding:3px 7px; border-radius:4px; border:1px solid ${d.subject1Url === pr.url ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background:${d.subject1Url === pr.url ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'}; color:#e2e8f0; font-size:9px; cursor:pointer;">
                ${pr.label}
              </button>
            `).join('')}
          </div>

          <!-- Granular Grading & Transform Controls for Image 1 -->
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; padding-top:4px; border-top:1px solid rgba(255,255,255,0.06);">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Brightness</span><b id="sfg-val-sub1br">${d.sub1Brightness ?? 104}%</b>
              </div>
              <input type="range" id="sfg-inp-sub1br" min="40" max="200" step="2" value="${d.sub1Brightness ?? 104}" style="width:100%; accent-color:#38bdf8;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Contrast</span><b id="sfg-val-sub1ct">${d.sub1Contrast ?? 112}%</b>
              </div>
              <input type="range" id="sfg-inp-sub1ct" min="50" max="200" step="2" value="${d.sub1Contrast ?? 112}" style="width:100%; accent-color:#38bdf8;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Saturation</span><b id="sfg-val-sub1sat">${d.sub1Saturation ?? 105}%</b>
              </div>
              <input type="range" id="sfg-inp-sub1sat" min="0" max="200" step="2" value="${d.sub1Saturation ?? 105}" style="width:100%; accent-color:#38bdf8;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Optical Blur</span><b id="sfg-val-sub1blur">${d.sub1Blur ?? 0}px</b>
              </div>
              <input type="range" id="sfg-inp-sub1blur" min="0" max="20" step="0.5" value="${d.sub1Blur ?? 0}" style="width:100%; accent-color:#38bdf8;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Rotation Offset</span><b id="sfg-val-sub1rot">${d.sub1RotationOffset ?? 0}°</b>
              </div>
              <input type="range" id="sfg-inp-sub1rot" min="-45" max="45" step="1" value="${d.sub1RotationOffset ?? 0}" style="width:100%; accent-color:#38bdf8;" />
            </div>
          </div>
        </div>
      `;
    } else if (activeLayer.id === 'sub2') {
      const f2X = clamp(Number(d.sub2FocalX) ?? 50, 0, 100);
      const f2Y = clamp(Number(d.sub2FocalY) ?? 34, 0, 100);
      const z2 = clamp(Number(d.sub2Zoom) || 1.28, 1.0, 2.8);

      selectedLayerControlsHtml = `
        <div style="background:rgba(6,182,212,0.07); border:1px solid rgba(6,182,212,0.32); border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:10.5px; font-weight:800; color:#22d3ee;">👤 Layer 2: Revealed Person 2 (Post-Glitch Subject)</span>
            <label style="padding:3px 8px; border-radius:5px; background:rgba(6,182,212,0.18); border:1px solid rgba(6,182,212,0.45); color:#cffafe; font-size:9.5px; font-weight:700; cursor:pointer;">
              📁 Replace Image 2
              <input type="file" id="sfg-file-sub2" accept="image/*,video/*" style="display:none;" />
            </label>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#cbd5e1;">
                <span>Crop Zoom</span><b id="sfg-val-sub2zoom" style="color:#22d3ee;">${z2.toFixed(2)}x</b>
              </div>
              <input type="range" id="sfg-inp-sub2zoom" min="1.0" max="2.6" step="0.02" value="${z2}" style="width:100%; accent-color:#22d3ee;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Focal X</span><b id="sfg-val-sub2fx">${f2X}%</b>
              </div>
              <input type="range" id="sfg-inp-sub2fx" min="0" max="100" step="1" value="${f2X}" style="width:100%; accent-color:#22d3ee;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Focal Y</span><b id="sfg-val-sub2fy">${f2Y}%</b>
              </div>
              <input type="range" id="sfg-inp-sub2fy" min="0" max="100" step="1" value="${f2Y}" style="width:100%; accent-color:#22d3ee;" />
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:4px;">
            ${[
              { url: '/cinematic_split_scene.jpg', label: 'Cyan Night Portrait' },
              { url: '/ai_creator_portrait_cutout.png', label: 'Studio Executive B' },
              { url: '/creator_cinematic_portrait_ref.png', label: 'Founder Close-Up' },
              { url: '/portrait_cutout_clean.png', label: 'Blue Key Subject' }
            ].map(pr => `
              <button type="button" class="sfg-sub2-preset" data-url="${pr.url}" style="padding:3px 7px; border-radius:4px; border:1px solid ${d.subject2Url === pr.url ? '#22d3ee' : 'rgba(255,255,255,0.1)'}; background:${d.subject2Url === pr.url ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)'}; color:#e2e8f0; font-size:9px; cursor:pointer;">
                ${pr.label}
              </button>
            `).join('')}
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Cyan Noir Grade</span><b id="sfg-val-cyangrade">${d.subject2CyanGrade ?? 78}%</b>
              </div>
              <input type="range" id="sfg-inp-cyangrade" min="0" max="100" step="1" value="${d.subject2CyanGrade ?? 78}" style="width:100%; accent-color:#22d3ee;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Brightness</span><b id="sfg-val-sub2br">${d.sub2Brightness ?? 98}%</b>
              </div>
              <input type="range" id="sfg-inp-sub2br" min="40" max="200" step="2" value="${d.sub2Brightness ?? 98}" style="width:100%; accent-color:#22d3ee;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                <span>Contrast</span><b id="sfg-val-sub2ct">${d.sub2Contrast ?? 118}%</b>
              </div>
              <input type="range" id="sfg-inp-sub2ct" min="50" max="200" step="2" value="${d.sub2Contrast ?? 118}" style="width:100%; accent-color:#22d3ee;" />
            </div>
          </div>
        </div>
      `;
    } else if (activeLayer.id === 'bg') {
      selectedLayerControlsHtml = `
        <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:10.5px; font-weight:800; color:#34d399;">🌌 Z=0 Background Environment Layer</span>
            <label style="padding:3px 8px; border-radius:5px; background:rgba(16,185,129,0.18); border:1px solid rgba(16,185,129,0.4); color:#d1fae5; font-size:9.5px; font-weight:700; cursor:pointer;">
              📁 Upload Custom BG
              <input type="file" id="sfg-file-bg" accept="image/*" style="display:none;" />
            </label>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <span style="font-size:10px; color:#cbd5e1;">Base Void Color</span>
            <input type="color" id="sfg-inp-bgcolor" value="${d.bgColor || '#05070e'}" style="width:32px; height:22px; border:none; background:transparent; cursor:pointer;" />
          </div>
        </div>
      `;
    } else if (activeLayer.isExtra) {
      selectedLayerControlsHtml = `
        <div style="background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.35); border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:8px;">
          <span style="font-size:10.5px; font-weight:800; color:#c084fc;">✨ Custom Layer: ${activeLayer.name}</span>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;"><span>Scale</span><b id="sfg-val-exscale">${activeLayer.scale || 100}%</b></div>
              <input type="range" id="sfg-inp-exscale" min="20" max="250" value="${activeLayer.scale || 100}" style="width:100%; accent-color:#a855f7;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;"><span>Offset X</span><b id="sfg-val-exx">${activeLayer.offsetX || 0}px</b></div>
              <input type="range" id="sfg-inp-exx" min="-200" max="200" value="${activeLayer.offsetX || 0}" style="width:100%; accent-color:#a855f7;" />
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;"><span>Offset Y</span><b id="sfg-val-exy">${activeLayer.offsetY || 0}px</b></div>
              <input type="range" id="sfg-inp-exy" min="-160" max="160" value="${activeLayer.offsetY || 0}" style="width:100%; accent-color:#a855f7;" />
            </div>
          </div>
        </div>
      `;
    }

    const presetCardsHtml = Object.values(MOOD_PRESETS).map(p => {
      const isAct = (d.moodPreset || 'investigative_expose') === p.id;
      return `
        <button type="button" class="sfg-mood-btn" data-preset="${p.id}" style="text-align: left; padding: 7px 9px; border-radius: 7px; border: 1px solid ${isAct ? '#38bdf8' : 'rgba(255,255,255,0.08)'}; background: ${isAct ? 'linear-gradient(135deg, rgba(14,165,233,0.22), rgba(15,23,42,0.85))' : 'rgba(15,23,42,0.55)'}; color: #f8fafc; cursor: pointer;">
          <div style="font-size: 10.5px; font-weight: 800; color: ${isAct ? '#7dd3fc' : '#e2e8f0'};">${p.label}</div>
          <div style="font-size: 9px; color: #38bdf8; font-weight: 600; margin-top: 1px;">${p.feeling}</div>
        </button>
      `;
    }).join('');

    const colorSwatches = [
      { hex: '#38bdf8', name: 'Icy Cyan' },
      { hex: '#ffffff', name: 'Pure Xenon' },
      { hex: '#00f0ff', name: 'Electric Blue' },
      { hex: '#fbbf24', name: 'Tungsten Gold' },
      { hex: '#f43f5e', name: 'Crimson Alert' },
      { hex: '#a855f7', name: 'UV Violet' }
    ];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 11px; width: 100%; padding-bottom: 16px;">

        <!-- =========================================================
             STUDIO SCENE LAYER STACK (Photoshop/NLE Hierarchy in Project Inspector UI)
             ========================================================= -->
        <div style="background: #0c0e15; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);">
          
          <!-- Header Row: Layers Title + Order Toggle + Add Layer -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 10.5px; font-weight: 800; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.06em;">🗂️ Scene Layers (${allLayers.length})</span>
              <button type="button" id="sfg-btn-stack-order" title="Switch between Background First (Z=0 at top) and Top-Down order" style="padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.3); background: rgba(56,189,248,0.1); color: #7dd3fc; font-size: 8.5px; font-family: monospace; cursor: pointer;">
                ${d.stackDirection === 'top_down' ? '↑ Top-Down' : '↓ BG First (Z=0→6)'}
              </button>
            </div>
            <label style="font-size: 9.5px; font-weight: 700; color: #a855f7; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;">
              + Add Layer
              <input type="file" id="sfg-add-extra-layer" accept="image/*" style="display: none;" />
            </label>
          </div>

          <!-- Photoshop/Inspector Filter & Blend/Opacity Bar (Matches Screenshot 2 in Studio UI) -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 5px 7px;">
            <div style="display: flex; align-items: center; gap: 3px;">
              ${[
                { k: 'all', lbl: 'All' },
                { k: 'bg', lbl: 'BG' },
                { k: 'media', lbl: 'Media' },
                { k: 'fx', lbl: 'FX' }
              ].map(f => `
                <button type="button" class="sfg-kind-filter-btn" data-kind="${f.k}" style="padding: 2px 6px; border-radius: 4px; border: none; background: ${filterKind === f.k ? '#38bdf8' : 'transparent'}; color: ${filterKind === f.k ? '#020617' : '#94a3b8'}; font-size: 9px; font-weight: 700; cursor: pointer;">
                  ${f.lbl}
                </button>
              `).join('')}
            </div>

            <div style="display: flex; align-items: center; gap: 5px;">
              <select id="sfg-active-layer-blend" title="Selected Layer Blend Mode" style="background: #07090e; border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; color: #e2e8f0; font-size: 9.5px; padding: 2px 4px; outline: none;">
                ${blendOptions.map(bm => `<option value="${bm}" ${(activeLayer.blendMode || 'normal') === bm ? 'selected' : ''}>${bm.toUpperCase()}</option>`).join('')}
              </select>
              <div style="display: flex; align-items: center; gap: 3px; font-size: 9.5px; color: #94a3b8;">
                <span>Op:</span>
                <input type="number" id="sfg-active-layer-opacity" min="0" max="100" value="${activeLayer.opacity ?? 100}" style="width: 40px; background: #07090e; border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; color: #f8fafc; font-size: 9.5px; padding: 2px 4px; text-align: right;" />
                <span>%</span>
              </div>
              <button type="button" id="sfg-active-layer-lock" title="Lock/Unlock Selected Layer" style="padding: 2px 5px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); background: ${activeLayer.locked ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)'}; color: ${activeLayer.locked ? '#fbbf24' : '#94a3b8'}; font-size: 9.5px; cursor: pointer;">
                🔒
              </button>
            </div>
          </div>

          <!-- Stacked Layer Rows -->
          <div style="display: flex; flex-direction: column; gap: 4px; max-height: 230px; overflow-y: auto;">
            ${layerRowsHtml}
          </div>

          <!-- Active Selected Layer Granular Inspector Drawer -->
          ${selectedLayerControlsHtml}
        </div>

        <!-- 2. Psychological Mood Presets -->
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(56,189,248,0.22); border-radius: 10px; padding: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10.5px; font-weight: 800; color: #7dd3fc; text-transform: uppercase; letter-spacing: 0.06em;">🎭 Psychological Mood Presets</span>
            <span style="font-size: 9px; color: #94a3b8; font-family: monospace;">1 SLOW + 3 FAST</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            ${presetCardsHtml}
          </div>
        </div>

        <!-- 3. Flashlight Color & Strobe Brilliance -->
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">🔦 Flashlight Color & Strobe Brilliance</div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
            <label style="font-size: 11px; color: #cbd5e1;">Flashlight Color</label>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="color" id="sfg-inp-color" value="${d.flashlightColor || '#38bdf8'}" style="width: 30px; height: 24px; border: none; background: transparent; cursor: pointer;" />
              <span id="sfg-val-color" style="font-family: monospace; font-size: 10.5px; color: #7dd3fc;">${(d.flashlightColor || '#38bdf8').toUpperCase()}</span>
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;">
            ${colorSwatches.map(sw => `
              <button type="button" class="sfg-color-swatch" data-color="${sw.hex}" style="display: flex; align-items: center; gap: 4px; padding: 3px 7px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.04); color: #e2e8f0; font-size: 9.5px; cursor: pointer;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${sw.hex};"></span>
                ${sw.name}
              </button>
            `).join('')}
          </div>

          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: #cbd5e1; margin-bottom: 3px;">
              <span>Flashlight Color Intensity</span>
              <span id="sfg-val-color-int" style="font-family: monospace; color: #38bdf8;">${d.flashlightColorIntensity ?? 72}%</span>
            </div>
            <input type="range" id="sfg-inp-color-int" min="0" max="100" step="1" value="${d.flashlightColorIntensity ?? 72}" style="width: 100%; accent-color: #38bdf8;" />
          </div>

          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: #cbd5e1; margin-bottom: 3px;">
              <span>Flashlight Peak Brilliance</span>
              <span id="sfg-val-brilliance" style="font-family: monospace; color: #38bdf8;">${d.flashBrilliance ?? 225}%</span>
            </div>
            <input type="range" id="sfg-inp-brilliance" min="60" max="300" step="5" value="${d.flashBrilliance ?? 225}" style="width: 100%; accent-color: #38bdf8;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>Beam Cone Radius</span>
                <span id="sfg-val-radius">${d.flashlightRadius ?? 64}%</span>
              </div>
              <input type="range" id="sfg-inp-radius" min="25" max="100" step="1" value="${d.flashlightRadius ?? 64}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>Edge Dark Falloff</span>
                <span id="sfg-val-falloff">${d.flashlightFalloff ?? 60}%</span>
              </div>
              <input type="range" id="sfg-inp-falloff" min="15" max="90" step="1" value="${d.flashlightFalloff ?? 60}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- 4. 1 Slow Flash + 3 Fast Strobes Timing -->
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">⚡ 1 Slow + 3 Fast Strobe Cadence</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
                <span>Slow Flash #1 Duration</span>
                <span id="sfg-val-slowdur" style="font-family: monospace; color: #fbbf24;">${Number(d.slowFlashDuration || 0.68).toFixed(2)}s</span>
              </div>
              <input type="range" id="sfg-inp-slowdur" min="0.25" max="1.40" step="0.05" value="${d.slowFlashDuration || 0.68}" style="width: 100%; accent-color: #fbbf24;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
                <span>Rapid Strobe Count</span>
                <span id="sfg-val-fastcount" style="font-family: monospace; color: #38bdf8;">${d.fastFlashCount || 3} Fast (${1 + (parseInt(d.fastFlashCount, 10) || 3)} Total)</span>
              </div>
              <input type="range" id="sfg-inp-fastcount" min="3" max="6" step="1" value="${d.fastFlashCount || 3}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>Rapid Flash Spacing</span>
                <span id="sfg-val-fastint">${Number(d.fastFlashInterval || 0.16).toFixed(2)}s</span>
              </div>
              <input type="range" id="sfg-inp-fastint" min="0.07" max="0.32" step="0.01" value="${d.fastFlashInterval || 0.16}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>Rapid Flash Snap</span>
                <span id="sfg-val-fastdur">${Number(d.fastFlashDuration || 0.095).toFixed(2)}s</span>
              </div>
              <input type="range" id="sfg-inp-fastdur" min="0.04" max="0.22" step="0.01" value="${d.fastFlashDuration || 0.095}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- 5. Circular Left-to-Right Spin Controls -->
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 10.5px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.06em;">🔄 Circular Spin (Left → Right Arc)</span>
            <label style="display: flex; align-items: center; gap: 4px; font-size: 9.5px; color: #fca5a5; cursor: pointer;">
              <input type="checkbox" id="sfg-inp-guide" ${d.showSpinGuide ? 'checked' : ''} />
              Show Doodle Path
            </label>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
                <span>Start Angle (Left)</span>
                <span id="sfg-val-startdeg">${d.spinStartAngle ?? -18}°</span>
              </div>
              <input type="range" id="sfg-inp-startdeg" min="-60" max="15" step="1" value="${d.spinStartAngle ?? -18}" style="width: 100%; accent-color: #f43f5e;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
                <span>End Angle (Right)</span>
                <span id="sfg-val-enddeg">${d.spinEndAngle ?? 22}°</span>
              </div>
              <input type="range" id="sfg-inp-enddeg" min="-10" max="180" step="1" value="${d.spinEndAngle ?? 22}" style="width: 100%; accent-color: #f43f5e;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>Circular Arc Radius</span>
                <span id="sfg-val-arcx">${d.spinArcRadiusX ?? 58}px</span>
              </div>
              <input type="range" id="sfg-inp-arcx" min="0" max="140" step="2" value="${d.spinArcRadiusX ?? 58}" style="width: 100%; accent-color: #f43f5e;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>3D Perspective Tilt</span>
                <span id="sfg-val-tilt3d">${d.spin3DTilt ?? 16}°</span>
              </div>
              <input type="range" id="sfg-inp-tilt3d" min="0" max="35" step="1" value="${d.spin3DTilt ?? 16}" style="width: 100%; accent-color: #f43f5e;" />
            </div>
          </div>
        </div>

        <!-- 6. Falling Particles & Glitch Controls -->
        <div style="background: rgba(15,23,42,0.65); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">✨ Falling Particles & Glitch Breakup</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>Particle Density</span>
                <span id="sfg-val-pcount">${d.particleCount ?? 68}</span>
              </div>
              <input type="range" id="sfg-inp-pcount" min="10" max="150" step="2" value="${d.particleCount ?? 68}" style="width: 100%; accent-color: #fbbf24;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                <span>Downward Fall Speed</span>
                <span id="sfg-val-pspeed">${Number(d.particleFallSpeed ?? 1.25).toFixed(2)}x</span>
              </div>
              <input type="range" id="sfg-inp-pspeed" min="0.2" max="3.0" step="0.05" value="${d.particleFallSpeed ?? 1.25}" style="width: 100%; accent-color: #fbbf24;" />
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
                <span>Glitch Intensity</span>
                <span id="sfg-val-glitchint">${d.glitchIntensity ?? 85}%</span>
              </div>
              <input type="range" id="sfg-inp-glitchint" min="10" max="100" step="1" value="${d.glitchIntensity ?? 85}" style="width: 100%; accent-color: #00f0ff;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
                <span>Glitch Slices</span>
                <span id="sfg-val-slices">${d.glitchSliceCount ?? 14}</span>
              </div>
              <input type="range" id="sfg-inp-slices" min="4" max="24" step="1" value="${d.glitchSliceCount ?? 14}" style="width: 100%; accent-color: #00f0ff;" />
            </div>
          </div>
          <button type="button" id="sfg-btn-audition-sfx" style="width: 100%; padding: 7px 10px; border-radius: 7px; border: 1px solid rgba(56,189,248,0.45); background: linear-gradient(135deg, rgba(14,165,233,0.22), rgba(2,132,199,0.12)); color: #e0f2fe; font-size: 10.5px; font-weight: 700; cursor: pointer;">
            🔊 Audition 1 Slow + 3 Fast Flash & Glitch SFX
          </button>
        </div>
      </div>
    `;

    function commitUpdate(patch, rebuildInspector = false, rebuildStage = false) {
      Object.assign(d, patch);
      window.JANI_SPIN_FLASH_GLITCH_CONFIG = Object.assign({}, d);
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, d);
      } else if (typeof window.tplUpdateStageWithContextualData === 'function') {
        window.tplUpdateStageWithContextualData(tplId, d);
      }
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (rebuildStage) {
          tplMountJaniSpinFlashGlitchStage(stage, d);
        }
        const previewTime = d.selectedLayerId === 'sub2' ? 3.2 : 0.62;
        stepJaniSpinFlashGlitchAnimation(stage, tplId, previewTime, d);
      }
      if (rebuildInspector) {
        tplBuildJaniSpinFlashGlitchInspector(container, d, tplId);
      }
    }

    // Layer Stack Row Click (Select Layer)
    container.querySelectorAll('.sfg-layer-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const lid = row.getAttribute('data-layer-id');
        commitUpdate({ selectedLayerId: lid }, true, false);
      });
    });

    // Eye Visibility Toggle
    container.querySelectorAll('.sfg-layer-vis-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lid = btn.getAttribute('data-layer-id');
        const target = getLayerMeta(d, lid);
        target.visible = target.visible === false ? true : false;
        commitUpdate({ layers: d.layers, extraLayers: d.extraLayers }, true, true);
      });
    });

    // Z-Order Move Up/Down
    container.querySelectorAll('.sfg-layer-move-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lid = btn.getAttribute('data-layer-id');
        const dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
        const target = getLayerMeta(d, lid);
        if (target && !target.locked) {
          target.zIndex = clamp((target.zIndex ?? 1) + dir, 0, 20);
          commitUpdate({ layers: d.layers, extraLayers: d.extraLayers }, true, true);
        }
      });
    });

    // Delete Custom Extra Layer
    container.querySelectorAll('.sfg-layer-del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lid = btn.getAttribute('data-layer-id');
        d.extraLayers = (d.extraLayers || []).filter(x => x.id !== lid);
        commitUpdate({ extraLayers: d.extraLayers, selectedLayerId: 'sub1' }, true, true);
      });
    });

    // Stack Order Toggle (BG First Z=0->6 vs Top-Down)
    container.querySelector('#sfg-btn-stack-order')?.addEventListener('click', () => {
      const nextOrder = d.stackDirection === 'top_down' ? 'bg_first' : 'top_down';
      commitUpdate({ stackDirection: nextOrder }, true, false);
    });

    // Filter by Kind Buttons
    container.querySelectorAll('.sfg-kind-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        commitUpdate({ layerFilterKind: btn.getAttribute('data-kind') }, true, false);
      });
    });

    // Active Layer Blend Mode & Opacity & Lock
    container.querySelector('#sfg-active-layer-blend')?.addEventListener('change', (e) => {
      if (activeLayer && !activeLayer.locked) {
        activeLayer.blendMode = e.target.value;
        commitUpdate({ layers: d.layers, extraLayers: d.extraLayers }, true, true);
      }
    });
    container.querySelector('#sfg-active-layer-opacity')?.addEventListener('input', (e) => {
      if (activeLayer && !activeLayer.locked) {
        activeLayer.opacity = clamp(parseInt(e.target.value, 10) || 0, 0, 100);
        commitUpdate({ layers: d.layers, extraLayers: d.extraLayers }, false, false);
      }
    });
    container.querySelector('#sfg-active-layer-lock')?.addEventListener('click', () => {
      if (activeLayer) {
        activeLayer.locked = !activeLayer.locked;
        commitUpdate({ layers: d.layers, extraLayers: d.extraLayers }, true, false);
      }
    });

    // + Add Extra Layer Upload
    container.querySelector('#sfg-add-extra-layer')?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target && ev.target.result) {
          const newId = 'extra_' + Date.now();
          const newLayer = {
            id: newId,
            isExtra: true,
            zIndex: 7 + (d.extraLayers ? d.extraLayers.length : 0),
            group: 'media',
            colorTag: '#c084fc',
            name: `Z=${7 + (d.extraLayers ? d.extraLayers.length : 0)} • ${file.name.slice(0, 18)}`,
            kind: 'media',
            visible: true,
            locked: false,
            opacity: 100,
            blendMode: 'normal',
            url: ev.target.result,
            scale: 100,
            offsetX: 0,
            offsetY: 0
          };
          d.extraLayers = [...(d.extraLayers || []), newLayer];
          commitUpdate({ extraLayers: d.extraLayers, selectedLayerId: newId }, true, true);
        }
      };
      reader.readAsDataURL(file);
    });

    // Interactive Crop Map for Image 1 (Zoomed-in part of bigger uncut image)
    const cropMap = container.querySelector('#sfg-sub1-crop-map');
    if (cropMap) {
      let draggingCrop = false;
      const updateCropFromEvent = (ev) => {
        const rect = cropMap.getBoundingClientRect();
        const fx = clamp(Math.round(((ev.clientX - rect.left) / rect.width) * 100), 0, 100);
        const fy = clamp(Math.round(((ev.clientY - rect.top) / rect.height) * 100), 0, 100);
        const fxInp = container.querySelector('#sfg-inp-sub1fx');
        const fyInp = container.querySelector('#sfg-inp-sub1fy');
        const fxVal = container.querySelector('#sfg-val-sub1fx');
        const fyVal = container.querySelector('#sfg-val-sub1fy');
        if (fxInp) fxInp.value = fx;
        if (fyInp) fyInp.value = fy;
        if (fxVal) fxVal.textContent = fx + '%';
        if (fyVal) fyVal.textContent = fy + '%';
        const cropRect = container.querySelector('#sfg-sub1-crop-rect');
        const z1 = clamp(Number(d.sub1Zoom) || 1.68, 1.0, 3.0);
        const bw = Math.round(100 / z1);
        const bh = Math.round(100 / z1);
        if (cropRect) {
          cropRect.style.left = clamp(fx - bw / 2, 0, 100 - bw) + '%';
          cropRect.style.top = clamp(fy - bh / 2, 0, 100 - bh) + '%';
        }
        commitUpdate({ sub1FocalX: fx, sub1FocalY: fy });
      };
      cropMap.addEventListener('mousedown', (ev) => {
        draggingCrop = true;
        updateCropFromEvent(ev);
      });
      window.addEventListener('mousemove', (ev) => {
        if (draggingCrop) updateCropFromEvent(ev);
      });
      window.addEventListener('mouseup', () => {
        draggingCrop = false;
      });
    }

    // Preset Scene/Portrait buttons
    container.querySelectorAll('.sfg-sub1-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        commitUpdate({ subject1Url: btn.getAttribute('data-url') }, true, true);
      });
    });
    container.querySelectorAll('.sfg-sub2-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        commitUpdate({ subject2Url: btn.getAttribute('data-url') }, true, true);
      });
    });

    // Mood Preset buttons
    container.querySelectorAll('.sfg-mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-preset');
        const preset = MOOD_PRESETS[pid];
        if (preset) {
          commitUpdate(Object.assign({}, preset.settings), true, false);
        }
      });
    });

    // Color Swatches
    container.querySelectorAll('.sfg-color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const hex = btn.getAttribute('data-color');
        const colInp = container.querySelector('#sfg-inp-color');
        const colVal = container.querySelector('#sfg-val-color');
        if (colInp) colInp.value = hex;
        if (colVal) colVal.textContent = hex.toUpperCase();
        commitUpdate({ flashlightColor: hex });
      });
    });

    function bindSlider(inputId, valId, key, parser, fmt) {
      const inp = container.querySelector('#' + inputId);
      const valEl = container.querySelector('#' + valId);
      if (!inp) return;
      inp.addEventListener('input', () => {
        const v = parser(inp.value);
        if (valEl && fmt) valEl.textContent = fmt(v);
        commitUpdate({ [key]: v });
        if (key === 'sub1Zoom' || key === 'sub1FocalX' || key === 'sub1FocalY') {
          const cropRect = container.querySelector('#sfg-sub1-crop-rect');
          if (cropRect) {
            const z1 = clamp(Number(d.sub1Zoom) || 1.68, 1.0, 3.0);
            const bw = Math.round(100 / z1);
            const bh = Math.round(100 / z1);
            cropRect.style.width = bw + '%';
            cropRect.style.height = bh + '%';
            cropRect.style.left = clamp((d.sub1FocalX ?? 57) - bw / 2, 0, 100 - bw) + '%';
            cropRect.style.top = clamp((d.sub1FocalY ?? 32) - bh / 2, 0, 100 - bh) + '%';
          }
        }
      });
    }

    bindSlider('sfg-inp-sub1zoom', 'sfg-val-sub1zoom', 'sub1Zoom', parseFloat, v => v.toFixed(2) + 'x');
    bindSlider('sfg-inp-sub1fx', 'sfg-val-sub1fx', 'sub1FocalX', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub1fy', 'sfg-val-sub1fy', 'sub1FocalY', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub1br', 'sfg-val-sub1br', 'sub1Brightness', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub1ct', 'sfg-val-sub1ct', 'sub1Contrast', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub1sat', 'sfg-val-sub1sat', 'sub1Saturation', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub1blur', 'sfg-val-sub1blur', 'sub1Blur', parseFloat, v => v + 'px');
    bindSlider('sfg-inp-sub1rot', 'sfg-val-sub1rot', 'sub1RotationOffset', parseInt, v => v + '°');

    bindSlider('sfg-inp-sub2zoom', 'sfg-val-sub2zoom', 'sub2Zoom', parseFloat, v => v.toFixed(2) + 'x');
    bindSlider('sfg-inp-sub2fx', 'sfg-val-sub2fx', 'sub2FocalX', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub2fy', 'sfg-val-sub2fy', 'sub2FocalY', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub2br', 'sfg-val-sub2br', 'sub2Brightness', parseInt, v => v + '%');
    bindSlider('sfg-inp-sub2ct', 'sfg-val-sub2ct', 'sub2Contrast', parseInt, v => v + '%');
    bindSlider('sfg-inp-cyangrade', 'sfg-val-cyangrade', 'subject2CyanGrade', parseInt, v => v + '%');

    bindSlider('sfg-inp-color', 'sfg-val-color', 'flashlightColor', v => v, v => String(v).toUpperCase());
    bindSlider('sfg-inp-color-int', 'sfg-val-color-int', 'flashlightColorIntensity', parseInt, v => v + '%');
    bindSlider('sfg-inp-brilliance', 'sfg-val-brilliance', 'flashBrilliance', parseInt, v => v + '%');
    bindSlider('sfg-inp-radius', 'sfg-val-radius', 'flashlightRadius', parseInt, v => v + '%');
    bindSlider('sfg-inp-falloff', 'sfg-val-falloff', 'flashlightFalloff', parseInt, v => v + '%');
    bindSlider('sfg-inp-slowdur', 'sfg-val-slowdur', 'slowFlashDuration', parseFloat, v => v.toFixed(2) + 's');
    bindSlider('sfg-inp-fastcount', 'sfg-val-fastcount', 'fastFlashCount', parseInt, v => `${v} Fast (${1 + v} Total)`);
    bindSlider('sfg-inp-fastint', 'sfg-val-fastint', 'fastFlashInterval', parseFloat, v => v.toFixed(2) + 's');
    bindSlider('sfg-inp-fastdur', 'sfg-val-fastdur', 'fastFlashDuration', parseFloat, v => v.toFixed(2) + 's');
    bindSlider('sfg-inp-startdeg', 'sfg-val-startdeg', 'spinStartAngle', parseInt, v => v + '°');
    bindSlider('sfg-inp-enddeg', 'sfg-val-enddeg', 'spinEndAngle', parseInt, v => v + '°');
    bindSlider('sfg-inp-arcx', 'sfg-val-arcx', 'spinArcRadiusX', parseInt, v => v + 'px');
    bindSlider('sfg-inp-tilt3d', 'sfg-val-tilt3d', 'spin3DTilt', parseInt, v => v + '°');
    bindSlider('sfg-inp-pcount', 'sfg-val-pcount', 'particleCount', parseInt, v => String(v));
    bindSlider('sfg-inp-pspeed', 'sfg-val-pspeed', 'particleFallSpeed', parseFloat, v => v.toFixed(2) + 'x');
    bindSlider('sfg-inp-glitchint', 'sfg-val-glitchint', 'glitchIntensity', parseInt, v => v + '%');
    bindSlider('sfg-inp-slices', 'sfg-val-slices', 'glitchSliceCount', parseInt, v => String(v));

    container.querySelector('#sfg-inp-bgcolor')?.addEventListener('input', (e) => {
      commitUpdate({ bgColor: e.target.value }, false, true);
    });

    // Extra Layer Sliders
    if (activeLayer && activeLayer.isExtra) {
      const bindExtra = (id, valId, prop, fmt) => {
        const el = container.querySelector('#' + id);
        const vEl = container.querySelector('#' + valId);
        if (!el) return;
        el.addEventListener('input', () => {
          activeLayer[prop] = parseInt(el.value, 10) || 0;
          if (vEl) vEl.textContent = fmt(activeLayer[prop]);
          commitUpdate({ extraLayers: d.extraLayers }, false, true);
        });
      };
      bindExtra('sfg-inp-exscale', 'sfg-val-exscale', 'scale', v => v + '%');
      bindExtra('sfg-inp-exx', 'sfg-val-exx', 'offsetX', v => v + 'px');
      bindExtra('sfg-inp-exy', 'sfg-val-exy', 'offsetY', v => v + 'px');
    }

    const guideChk = container.querySelector('#sfg-inp-guide');
    if (guideChk) {
      guideChk.addEventListener('change', () => commitUpdate({ showSpinGuide: guideChk.checked }));
    }

    const audBtn = container.querySelector('#sfg-btn-audition-sfx');
    if (audBtn) {
      audBtn.addEventListener('click', () => window.auditionJaniSpinFlashGlitchSFX(d));
    }

    function bindImageUpload(fileInputId, urlKey) {
      const fInp = container.querySelector('#' + fileInputId);
      if (!fInp) return;
      fInp.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target && ev.target.result) {
            commitUpdate({ [urlKey]: ev.target.result }, true, true);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    bindImageUpload('sfg-file-sub1', 'subject1Url');
    bindImageUpload('sfg-file-sub2', 'subject2Url');
    bindImageUpload('sfg-file-bg', 'bgUrl');
  }

  window.buildSpinFlashGlitchHtml = buildSpinFlashGlitchHtml;
  window.computeSpinFlashGlitchState = computeSpinFlashGlitchState;
  window.stepJaniSpinFlashGlitchAnimation = stepJaniSpinFlashGlitchAnimation;
  window.renderJaniSpinFlashGlitchCanvas = renderJaniSpinFlashGlitchCanvas;
  window.tplMountJaniSpinFlashGlitchStage = tplMountJaniSpinFlashGlitchStage;
  window.tplBuildJaniSpinFlashGlitchInspector = tplBuildJaniSpinFlashGlitchInspector;
})();
