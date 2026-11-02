/**
 * Psychological 4-Beat Photo Sequence Engine
 * (Camera Flash Burst -> L-to-R Slide -> R-to-L Slide -> Sluggish Center Emergence)
 *
 * Choreography:
 * - Beat 1: Appears with an authentic camera flash + directional flashlight cone bloom,
 *   pre-flash retinal exposure dip, highlight overexposure blowout, and multi-profile camera shutter + capacitor whine SFX.
 * - Beat 2: Enters dynamically from Left to Right (supports Full Push, Evidence Photo Stack, or 3D Parallax).
 * - Beat 3: Enters dynamically from Right to Left (visual ping-pong momentum).
 * - Beat 4: Emerges from the center of Beat 3 with customizable "Sluggishness / Viscosity"
 *   (heavy exponential damping, deep center origin scale, optical defocus blur-to-sharp pull, ghost trail, and sub-bass swell).
 *
 * Includes 5 Psychological Mood Presets ("What We Want People to Feel") + granular NLE controls.
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'jani-flash-quad-sequence';

  // Psychological Mood Presets ("What We Want People to Feel")
  const MOOD_PRESETS = {
    genius: {
      id: 'genius',
      label: '🧠 Eccentric Genius Myth',
      feeling: 'Awe, Intrigue & Documentary Mystique',
      desc: 'Warm-white Leica flash, smooth L→R / R→L momentum, and a hypnotic, weighty center emergence into the trading terminal.',
      settings: {
        moodPreset: 'genius',
        // Flash & Flashlight (Beat 1)
        flashBrilliance: 210,       // % peak exposure
        flashColor: '#fff5e0',      // Warm studio xenon
        flashDecayDuration: 0.42,   // seconds
        preFlashDip: 35,            // % pre-flash darkness dip
        flashlightRadius: 68,       // % cone hotspot size
        flashlightFalloff: 55,      // % vignette edge darkness
        flashlightSpotX: 0,         // % offset from center
        flashlightSpotY: -6,        // % offset from center
        retinalAfterimage: 30,      // % chromatic afterglow

        // Audio / Photograph SFX
        shutterSoundProfile: 'slr_35mm',
        enableShutterSFX: true,
        shutterVolume: 85,          // %
        shutterPitch: 1.0,          // multiplier
        shutterPreRollMs: -25,      // ms (fires slightly before peak flash)
        enableSlideWhoosh: true,
        enableSubSwell: true,

        // Beat 2 (L->R) & Beat 3 (R->L)
        layoutStyle: 'stack',       // 'push' | 'stack' | 'parallax'
        ltrSpeed: 0.42,             // seconds
        rtlSpeed: 0.42,             // seconds
        slideOvershoot: 18,         // % spring/overshoot feel
        slideMotionBlur: 10,        // px
        prevFrameDim: 48,           // % dim of underlying image
        photoBorderWidth: 6,        // px frame border
        photoBorderColor: '#f8fafc',
        stackTiltAngle: 2.2,        // degrees

        // Beat 4 (Sluggish Center Emergence)
        sluggishness: 0.82,         // 0.10 (crisp) to 0.98 (heavy viscous drag)
        centerEmergenceDuration: 1.35, // seconds
        centerStartScale: 0.36,     // deep center scale origin
        centerFocusPullBlur: 16,    // px start blur resolving to 0
        centerGhostTrail: 55,       // % ghost echo opacity
        prevCenterSink: 65,         // % how much Image 3 sinks/darkens into center

        // Timing & Framing
        speedMultiplier: 1.0,
        beat1Duration: 1.45,
        beat2Duration: 1.35,
        beat3Duration: 1.35,
        beat4Duration: 2.25,
        kenBurnsDrift: 1.04         // subtle post-entrance life drift
      }
    },
    expose: {
      id: 'expose',
      label: '📸 Caught Red-Handed / Expose',
      feeling: 'Shock, Scrutiny & Leaked Insider Evidence',
      desc: 'Harsh cold-blue paparazzi xenon blowout with capacitor whine, whip-fast directional cuts, and an ominous center reveal.',
      settings: {
        moodPreset: 'expose',
        flashBrilliance: 275,
        flashColor: '#e0f2fe',
        flashDecayDuration: 0.28,
        preFlashDip: 52,
        flashlightRadius: 52,
        flashlightFalloff: 72,
        flashlightSpotX: 0,
        flashlightSpotY: -4,
        retinalAfterimage: 55,

        shutterSoundProfile: 'paparazzi_xenon',
        enableShutterSFX: true,
        shutterVolume: 100,
        shutterPitch: 1.08,
        shutterPreRollMs: -35,
        enableSlideWhoosh: true,
        enableSubSwell: true,

        layoutStyle: 'stack',
        ltrSpeed: 0.26,
        rtlSpeed: 0.26,
        slideOvershoot: 32,
        slideMotionBlur: 18,
        prevFrameDim: 62,
        photoBorderWidth: 8,
        photoBorderColor: '#ffffff',
        stackTiltAngle: 3.8,

        sluggishness: 0.76,
        centerEmergenceDuration: 1.15,
        centerStartScale: 0.28,
        centerFocusPullBlur: 20,
        centerGhostTrail: 68,
        prevCenterSink: 78,

        speedMultiplier: 1.15,
        beat1Duration: 1.25,
        beat2Duration: 1.15,
        beat3Duration: 1.15,
        beat4Duration: 2.05,
        kenBurnsDrift: 1.05
      }
    },
    burnout: {
      id: 'burnout',
      label: '🫗 4 AM Burnout / Delirium',
      feeling: 'Exhaustion, Obsession & Heavy Gravity',
      desc: 'Amber-tungsten flash with slow retinal burn, heavy slide friction, and maximum syrupy sluggishness on the 4th shot.',
      settings: {
        moodPreset: 'burnout',
        flashBrilliance: 175,
        flashColor: '#ffd699',
        flashDecayDuration: 0.72,
        preFlashDip: 45,
        flashlightRadius: 60,
        flashlightFalloff: 78,
        flashlightSpotX: 0,
        flashlightSpotY: 0,
        retinalAfterimage: 70,

        shutterSoundProfile: 'vintage_bulb',
        enableShutterSFX: true,
        shutterVolume: 80,
        shutterPitch: 0.82,
        shutterPreRollMs: -15,
        enableSlideWhoosh: true,
        enableSubSwell: true,

        layoutStyle: 'parallax',
        ltrSpeed: 0.58,
        rtlSpeed: 0.58,
        slideOvershoot: 8,
        slideMotionBlur: 14,
        prevFrameDim: 55,
        photoBorderWidth: 0,
        photoBorderColor: '#e2e8f0',
        stackTiltAngle: 1.2,

        sluggishness: 0.94,
        centerEmergenceDuration: 1.75,
        centerStartScale: 0.24,
        centerFocusPullBlur: 26,
        centerGhostTrail: 82,
        prevCenterSink: 85,

        speedMultiplier: 0.88,
        beat1Duration: 1.55,
        beat2Duration: 1.45,
        beat3Duration: 1.45,
        beat4Duration: 2.55,
        kenBurnsDrift: 1.03
      }
    },
    forensic: {
      id: 'forensic',
      label: '🗂️ Forensic Evidence Dossier',
      feeling: 'Cold, Clinical & Prosecutorial Objectivity',
      desc: 'Crisp pure-white strobe, silent mirrorless shutter, geometric 0° full-frame pushes, and a clinical optical center resolve.',
      settings: {
        moodPreset: 'forensic',
        flashBrilliance: 165,
        flashColor: '#ffffff',
        flashDecayDuration: 0.22,
        preFlashDip: 25,
        flashlightRadius: 80,
        flashlightFalloff: 45,
        flashlightSpotX: 0,
        flashlightSpotY: 0,
        retinalAfterimage: 15,

        shutterSoundProfile: 'mirrorless_silent',
        enableShutterSFX: true,
        shutterVolume: 75,
        shutterPitch: 1.12,
        shutterPreRollMs: -10,
        enableSlideWhoosh: true,
        enableSubSwell: false,

        layoutStyle: 'push',
        ltrSpeed: 0.34,
        rtlSpeed: 0.34,
        slideOvershoot: 0,
        slideMotionBlur: 6,
        prevFrameDim: 40,
        photoBorderWidth: 2,
        photoBorderColor: '#38bdf8',
        stackTiltAngle: 0,

        sluggishness: 0.65,
        centerEmergenceDuration: 1.05,
        centerStartScale: 0.45,
        centerFocusPullBlur: 10,
        centerGhostTrail: 30,
        prevCenterSink: 50,

        speedMultiplier: 1.0,
        beat1Duration: 1.35,
        beat2Duration: 1.25,
        beat3Duration: 1.25,
        beat4Duration: 2.00,
        kenBurnsDrift: 1.02
      }
    },
    nostalgic: {
      id: 'nostalgic',
      label: '🎞️ Archival Polaroid Memory',
      feeling: 'Intimate, Reflective & Bygone Era',
      desc: 'Warm sepia-halide flash, Polaroid motor eject sound, framed instant-photo borders, and a dreamy soft-focus center fade.',
      settings: {
        moodPreset: 'nostalgic',
        flashBrilliance: 185,
        flashColor: '#ffe4b5',
        flashDecayDuration: 0.55,
        preFlashDip: 30,
        flashlightRadius: 65,
        flashlightFalloff: 62,
        flashlightSpotX: 0,
        flashlightSpotY: -5,
        retinalAfterimage: 45,

        shutterSoundProfile: 'polaroid_instant',
        enableShutterSFX: true,
        shutterVolume: 90,
        shutterPitch: 0.96,
        shutterPreRollMs: -20,
        enableSlideWhoosh: true,
        enableSubSwell: true,

        layoutStyle: 'stack',
        ltrSpeed: 0.48,
        rtlSpeed: 0.48,
        slideOvershoot: 14,
        slideMotionBlur: 8,
        prevFrameDim: 42,
        photoBorderWidth: 12,
        photoBorderColor: '#fafaf9',
        stackTiltAngle: 3.4,

        sluggishness: 0.86,
        centerEmergenceDuration: 1.50,
        centerStartScale: 0.38,
        centerFocusPullBlur: 18,
        centerGhostTrail: 60,
        prevCenterSink: 55,

        speedMultiplier: 0.95,
        beat1Duration: 1.50,
        beat2Duration: 1.40,
        beat3Duration: 1.40,
        beat4Duration: 2.30,
        kenBurnsDrift: 1.04
      }
    }
  };

  const DEFAULT_CONFIG = Object.assign(
    {
      // 4 Placeholder Image Slots (from user's uploaded reference images)
      image1Url: '/assets/aistudio/image_463745bd.png',
      image2Url: '/assets/aistudio/image_c2fee6b7.png',
      image3Url: '/assets/aistudio/image_560b8340.png',
      image4Url: '/assets/aistudio/image_174cfa38.png',

      // Per-Slot Framing & Captions
      img1Scale: 1.0, img1OffsetX: 0, img1OffsetY: 0, img1Caption: 'EXHIBIT 01 // THE PUBLIC PERSONA',
      img2Scale: 1.0, img2OffsetX: 0, img2OffsetY: 0, img2Caption: 'EXHIBIT 02 // OFFICE FLOOR NAP',
      img3Scale: 1.0, img3OffsetX: 0, img3OffsetY: 0, img3Caption: 'EXHIBIT 03 // BEANBAG BY THE DESK',
      img4Scale: 1.0, img4OffsetX: 0, img4OffsetY: 0, img4Caption: 'EXHIBIT 04 // LOCKED IN AT THE TERMINAL',
      showCaptions: false,
      showFlashlightBeamCone: true,
      duration: 6.4
    },
    MOOD_PRESETS.genius.settings
  );

  // Image cache for synchronous 60fps Canvas rendering
  const imgCache = new Map();
  function getCachedImage(url) {
    if (!url) return null;
    let img = imgCache.get(url);
    if (!img) {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      imgCache.set(url, img);
    }
    return img.complete && img.naturalWidth ? img : null;
  }

  // Preload the 4 default images immediately
  getCachedImage(DEFAULT_CONFIG.image1Url);
  getCachedImage(DEFAULT_CONFIG.image2Url);
  getCachedImage(DEFAULT_CONFIG.image3Url);
  getCachedImage(DEFAULT_CONFIG.image4Url);

  // =========================================================================
  // PROCEDURAL WEB AUDIO CAMERA SHUTTER, FLASHLIGHT & TRANSITION SYNTHESIZER
  // =========================================================================
  let sharedAudioCtx = null;
  function getAudioCtx() {
    if (!sharedAudioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) sharedAudioCtx = new AC();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  }

  function createNoiseBuffer(ctx, durationSec) {
    const sampleRate = ctx.sampleRate;
    const len = Math.max(1, Math.floor(sampleRate * durationSec));
    const buffer = ctx.createBuffer(1, len, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * Synthesizes 5 distinct photograph shutter + flash audio profiles
   */
  function playPhotographSound(profile = 'slr_35mm', volumePct = 85, pitchMult = 1.0) {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = Math.max(0, Math.min(1.5, (volumePct || 85) / 100)) * 0.55;
      if (vol <= 0.001) return;
      const p = Math.max(0.5, Math.min(1.6, pitchMult || 1.0));

      const master = ctx.createGain();
      master.gain.setValueAtTime(vol, now);
      master.connect(ctx.destination);

      if (profile === 'paparazzi_xenon') {
        // 1. Sharp metallic double-curtain snap
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 0.09);
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(2400 * p, now);
        bp.Q.setValueAtTime(1.8, now);
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(1.1, now);
        nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.045);
        noise.connect(bp);
        bp.connect(nGain);
        nGain.connect(master);
        noise.start(now);

        // Second curtain click +28ms
        const noise2 = ctx.createBufferSource();
        noise2.buffer = createNoiseBuffer(ctx, 0.08);
        const nGain2 = ctx.createGain();
        nGain2.gain.setValueAtTime(0.001, now);
        nGain2.gain.setValueAtTime(0.95, now + 0.028);
        nGain2.gain.exponentialRampToValueAtTime(0.008, now + 0.075);
        noise2.connect(bp);
        bp.connect(nGain2);
        nGain2.connect(master);
        noise2.start(now + 0.028);

        // 2. Xenon tube thump pop (low-mid capacitive discharge)
        const popOsc = ctx.createOscillator();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(320 * p, now + 0.01);
        popOsc.frequency.exponentialRampToValueAtTime(58 * p, now + 0.11);
        const popGain = ctx.createGain();
        popGain.gain.setValueAtTime(0.85, now + 0.01);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        popOsc.connect(popGain);
        popGain.connect(master);
        popOsc.start(now + 0.01);
        popOsc.stop(now + 0.13);

        // 3. Signature High-Voltage Capacitor Recharge Whine (rising sine sweep)
        const whineOsc = ctx.createOscillator();
        whineOsc.type = 'sine';
        whineOsc.frequency.setValueAtTime(2600 * p, now + 0.05);
        whineOsc.frequency.exponentialRampToValueAtTime(7800 * p, now + 0.55);
        const whineGain = ctx.createGain();
        whineGain.gain.setValueAtTime(0.001, now);
        whineGain.gain.linearRampToValueAtTime(0.16, now + 0.08);
        whineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
        whineOsc.connect(whineGain);
        whineGain.connect(master);
        whineOsc.start(now + 0.05);
        whineOsc.stop(now + 0.60);

      } else if (profile === 'polaroid_instant') {
        // 1. Heavy mechanical clunk
        const clunkOsc = ctx.createOscillator();
        clunkOsc.type = 'sawtooth';
        clunkOsc.frequency.setValueAtTime(190 * p, now);
        clunkOsc.frequency.exponentialRampToValueAtTime(45 * p, now + 0.08);
        const clunkGain = ctx.createGain();
        clunkGain.gain.setValueAtTime(0.9, now);
        clunkGain.gain.exponentialRampToValueAtTime(0.01, now + 0.085);
        clunkOsc.connect(clunkGain);
        clunkGain.connect(master);
        clunkOsc.start(now);
        clunkOsc.stop(now + 0.09);

        // 2. Motorized film roller eject whir (85ms to 460ms)
        const motorOsc = ctx.createOscillator();
        motorOsc.type = 'sawtooth';
        motorOsc.frequency.setValueAtTime(410 * p, now + 0.08);
        motorOsc.frequency.linearRampToValueAtTime(445 * p, now + 0.25);
        motorOsc.frequency.linearRampToValueAtTime(390 * p, now + 0.45);
        const motorFilter = ctx.createBiquadFilter();
        motorFilter.type = 'bandpass';
        motorFilter.frequency.setValueAtTime(850 * p, now + 0.08);
        motorFilter.Q.setValueAtTime(2.5, now + 0.08);
        const motorGain = ctx.createGain();
        motorGain.gain.setValueAtTime(0.001, now);
        motorGain.gain.linearRampToValueAtTime(0.32, now + 0.10);
        motorGain.gain.setValueAtTime(0.30, now + 0.38);
        motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.47);
        motorOsc.connect(motorFilter);
        motorFilter.connect(motorGain);
        motorGain.connect(master);
        motorOsc.start(now + 0.08);
        motorOsc.stop(now + 0.48);

      } else if (profile === 'vintage_bulb') {
        // 1. Deep magnesium flashbulb pop + warm sizzle
        const bulbOsc = ctx.createOscillator();
        bulbOsc.type = 'sine';
        bulbOsc.frequency.setValueAtTime(240 * p, now);
        bulbOsc.frequency.exponentialRampToValueAtTime(38 * p, now + 0.18);
        const bulbGain = ctx.createGain();
        bulbGain.gain.setValueAtTime(1.0, now);
        bulbGain.gain.exponentialRampToValueAtTime(0.005, now + 0.20);
        bulbOsc.connect(bulbGain);
        bulbGain.connect(master);
        bulbOsc.start(now);
        bulbOsc.stop(now + 0.21);

        // 2. Foil filament sizzle tail
        const sizzle = ctx.createBufferSource();
        sizzle.buffer = createNoiseBuffer(ctx, 0.32);
        const hp = ctx.createBiquadFilter();
        hp.type = 'bandpass';
        hp.frequency.setValueAtTime(3600 * p, now);
        hp.Q.setValueAtTime(1.2, now);
        const sGain = ctx.createGain();
        sGain.gain.setValueAtTime(0.65, now + 0.01);
        sGain.gain.exponentialRampToValueAtTime(0.005, now + 0.30);
        sizzle.connect(hp);
        hp.connect(sGain);
        sGain.connect(master);
        sizzle.start(now + 0.01);

      } else if (profile === 'mirrorless_silent') {
        // Tight damped electronic shutter tick
        const tick = ctx.createBufferSource();
        tick.buffer = createNoiseBuffer(ctx, 0.035);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1800 * p, now);
        const tGain = ctx.createGain();
        tGain.gain.setValueAtTime(0.75, now);
        tGain.gain.exponentialRampToValueAtTime(0.005, now + 0.028);
        tick.connect(filter);
        filter.connect(tGain);
        tGain.connect(master);
        tick.start(now);

      } else {
        // Default: 'slr_35mm' — Classic 35mm Mechanical SLR Mirror Slap + Curtain
        const snap1 = ctx.createBufferSource();
        snap1.buffer = createNoiseBuffer(ctx, 0.055);
        const f1 = ctx.createBiquadFilter();
        f1.type = 'bandpass';
        f1.frequency.setValueAtTime(1650 * p, now);
        f1.Q.setValueAtTime(1.4, now);
        const g1 = ctx.createGain();
        g1.gain.setValueAtTime(1.0, now);
        g1.gain.exponentialRampToValueAtTime(0.01, now + 0.045);
        snap1.connect(f1);
        f1.connect(g1);
        g1.connect(master);
        snap1.start(now);

        // Mirror return clack +38ms
        const snap2 = ctx.createBufferSource();
        snap2.buffer = createNoiseBuffer(ctx, 0.065);
        const f2 = ctx.createBiquadFilter();
        f2.type = 'bandpass';
        f2.frequency.setValueAtTime(2200 * p, now + 0.038);
        f2.Q.setValueAtTime(1.9, now + 0.038);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.85, now + 0.038);
        g2.gain.exponentialRampToValueAtTime(0.008, now + 0.095);
        snap2.connect(f2);
        f2.connect(g2);
        g2.connect(master);
        snap2.start(now + 0.038);

        // Subtle mechanical body resonance
        const bodyOsc = ctx.createOscillator();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(180 * p, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(65 * p, now + 0.07);
        const bGain = ctx.createGain();
        bGain.gain.setValueAtTime(0.55, now);
        bGain.gain.exponentialRampToValueAtTime(0.005, now + 0.075);
        bodyOsc.connect(bGain);
        bGain.connect(master);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.08);
      }
    } catch (_) {}
  }

  /**
   * Plays directional whoosh for Beat 2 (L->R) & Beat 3 (R->L), or Sub-Bass Swell for Beat 4
   */
  function playTransitionAccentSFX(type, volumePct = 80) {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = Math.max(0, Math.min(1.5, (volumePct || 80) / 100)) * 0.38;
      if (vol <= 0.001) return;

      if (type === 'whoosh_ltr' || type === 'whoosh_rtl') {
        const dur = 0.28;
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, dur);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        const startFreq = type === 'whoosh_ltr' ? 280 : 920;
        const peakFreq = type === 'whoosh_ltr' ? 980 : 320;
        filter.frequency.setValueAtTime(startFreq, now);
        filter.frequency.exponentialRampToValueAtTime(peakFreq, now + dur * 0.75);
        filter.Q.setValueAtTime(2.2, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol, now + dur * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'sub_swell') {
        // Deep visceral sub-bass swell + slow heart-thump for Beat 4 sluggish emergence
        const dur = 1.15;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(92, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + dur);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol * 1.35, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.05);
      }
    } catch (_) {}
  }

  // Expose sound test helper globally
  window.playJaniFlashQuadTestSound = playPhotographSound;

  // Track which beat SFX last fired during preview playback so each beat fires once per cycle
  let lastTriggeredBeat = -1;
  let lastCycleIndex = -1;

  // =========================================================================
  // EASING & MATHEMATICAL CURVES
  // =========================================================================
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  }

  function easeOutBack(x, overshootPct = 18) {
    const t = clamp(x, 0, 1);
    const c1 = (overshootPct / 100) * 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /**
   * Custom "Sluggish / Viscous Emergence" curve for Beat 4:
   * High sluggishness (e.g., 0.85 - 0.95) creates a heavy, syrupy initial resistance
   * followed by a slow, deliberate, hypnotic arrival from the center of Beat 3.
   */
  function easeSluggishViscous(x, sluggishness = 0.82) {
    const t = clamp(x, 0, 1);
    const s = clamp(sluggishness, 0.1, 0.98);
    // Combine an S-curve inertia start with a heavy viscous exponential settle
    const inertiaPower = 1.6 + s * 1.8; // higher sluggishness = heavier initial resistance
    const dragFactor = 1 - Math.pow(1 - t, 1.2 + (1 - s) * 2.5);
    const slowBuild = Math.pow(t, inertiaPower) / (Math.pow(t, inertiaPower) + Math.pow(1 - t, inertiaPower));
    return slowBuild * 0.72 + dragFactor * 0.28;
  }

  function hexToRgb(hex) {
    const clean = String(hex || '#ffffff').replace('#', '');
    if (clean.length === 3) {
      return {
        r: parseInt(clean[0] + clean[0], 16) || 255,
        g: parseInt(clean[1] + clean[1], 16) || 255,
        b: parseInt(clean[2] + clean[2], 16) || 255
      };
    }
    return {
      r: parseInt(clean.substring(0, 2), 16) || 255,
      g: parseInt(clean.substring(2, 4), 16) || 255,
      b: parseInt(clean.substring(4, 6), 16) || 255
    };
  }

  function colorToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1).toFixed(3)})`;
  }

  // =========================================================================
  // DETERMINISTIC FRAME STATE CALCULATOR (60 FPS TIMELINE & PREVIEW)
  // =========================================================================
  function computeFlashQuadState(rawConfig, rawTime, allowAudioTrigger = false) {
    const d = Object.assign({}, DEFAULT_CONFIG, rawConfig || {});
    const speedMult = clamp(parseFloat(d.speedMultiplier) || 1.0, 0.35, 2.5);

    const b1Dur = Math.max(0.4, (parseFloat(d.beat1Duration) || 1.45) / speedMult);
    const b2Dur = Math.max(0.4, (parseFloat(d.beat2Duration) || 1.35) / speedMult);
    const b3Dur = Math.max(0.4, (parseFloat(d.beat3Duration) || 1.35) / speedMult);
    const b4Dur = Math.max(0.6, (parseFloat(d.beat4Duration) || 2.25) / speedMult);

    const tBeat1Start = 0;
    const tBeat2Start = b1Dur;
    const tBeat3Start = b1Dur + b2Dur;
    const tBeat4Start = b1Dur + b2Dur + b3Dur;
    const totalCycle = tBeat4Start + b4Dur;

    const safeT = Math.max(0, rawTime || 0);
    const cycleIndex = Math.floor(safeT / totalCycle);
    const t = safeT % totalCycle;

    // Determine active beat index (1, 2, 3, or 4)
    let activeBeat = 1;
    if (t >= tBeat4Start) activeBeat = 4;
    else if (t >= tBeat3Start) activeBeat = 3;
    else if (t >= tBeat2Start) activeBeat = 2;

    // Trigger synchronized audio on beat transitions during live preview
    if (allowAudioTrigger) {
      if (cycleIndex !== lastCycleIndex) {
        lastCycleIndex = cycleIndex;
        lastTriggeredBeat = -1;
      }
      if (activeBeat !== lastTriggeredBeat) {
        lastTriggeredBeat = activeBeat;
        if (activeBeat === 1 && d.enableShutterSFX !== false) {
          playPhotographSound(d.shutterSoundProfile || 'slr_35mm', d.shutterVolume, d.shutterPitch);
        } else if (activeBeat === 2 && d.enableSlideWhoosh !== false) {
          playTransitionAccentSFX('whoosh_ltr', d.shutterVolume);
        } else if (activeBeat === 3 && d.enableSlideWhoosh !== false) {
          playTransitionAccentSFX('whoosh_rtl', d.shutterVolume);
        } else if (activeBeat === 4 && d.enableSubSwell !== false) {
          playTransitionAccentSFX('sub_swell', d.shutterVolume);
        }
      }
    }

    const driftAmount = Math.max(0, (parseFloat(d.kenBurnsDrift) || 1.04) - 1.0);

    // --- BEAT 1: Camera Flash & Flashlight Appearance ---
    const preDipWindow = 0.065; // 65ms pre-flash retinal dip before xenon ignition
    const flashDecay = Math.max(0.10, (parseFloat(d.flashDecayDuration) || 0.42) / speedMult);
    const peakBrilliance = clamp(parseFloat(d.flashBrilliance) || 210, 100, 360);

    let flashOverlayAlpha = 0;
    let img1Brightness = 100;
    let img1Contrast = 104;
    let img1ScaleDyn = 1.0;
    let img1Opacity = 1.0;
    let afterimageAlpha = 0;

    if (t < preDipWindow) {
      // Brief pre-flash darkness dip for maximum optical contrast
      const dipProg = t / preDipWindow;
      img1Brightness = 100 - (parseFloat(d.preFlashDip) || 35) * Math.sin(dipProg * Math.PI);
      img1Opacity = 0.25 + 0.75 * dipProg;
      img1ScaleDyn = 1.06 - 0.04 * dipProg;
    } else {
      const sinceFlash = t - preDipWindow;
      if (sinceFlash <= flashDecay) {
        const fp = sinceFlash / flashDecay;
        const decayCurve = Math.pow(1 - fp, 2.2);
        flashOverlayAlpha = clamp((peakBrilliance - 100) / 165, 0.15, 1.0) * decayCurve;
        img1Brightness = 100 + (peakBrilliance - 100) * decayCurve;
        img1Contrast = 104 + 28 * decayCurve;
      }
      // Retinal afterimage tail
      const afterDur = flashDecay * 1.65;
      if (sinceFlash <= afterDur) {
        afterimageAlpha = ((parseFloat(d.retinalAfterimage) || 30) / 100) * Math.pow(1 - sinceFlash / afterDur, 1.8) * 0.45;
      }
      const b1Progress = clamp(t / b1Dur, 0, 1);
      img1ScaleDyn = 1.02 - 0.02 * easeOutCubic(Math.min(1, sinceFlash / 0.35)) + b1Progress * driftAmount;
    }

    // --- BEAT 2: Left-to-Right (L -> R) Entrance ---
    const ltrDur = Math.max(0.12, (parseFloat(d.ltrSpeed) || 0.42) / speedMult);
    const b2LocalT = Math.max(0, t - tBeat2Start);
    const b2EnterProg = t >= tBeat2Start ? clamp(b2LocalT / ltrDur, 0, 1) : 0;
    const b2Eased = (parseFloat(d.slideOvershoot) || 0) > 0
      ? easeOutBack(b2EnterProg, parseFloat(d.slideOvershoot))
      : easeOutCubic(b2EnterProg);
    const b2HoldProg = t >= tBeat2Start ? clamp(b2LocalT / b2Dur, 0, 1) : 0;

    // Enters from Left (-108%) to Center (0%)
    const img2TranslateX = t < tBeat2Start ? -110 : (1 - b2Eased) * -108;
    const img2Opacity = t < tBeat2Start ? 0 : clamp(b2EnterProg * 3.2, 0, 1);
    const img2Blur = t >= tBeat2Start && b2EnterProg < 1 ? (1 - b2EnterProg) * (parseFloat(d.slideMotionBlur) || 10) : 0;
    const img2ScaleDyn = 1.0 + b2HoldProg * driftAmount;
    const img2Tilt = d.layoutStyle === 'stack' ? -(parseFloat(d.stackTiltAngle) || 2.2) * Math.min(1, b2EnterProg) : 0;

    // --- BEAT 3: Right-to-Left (R -> L) Entrance ---
    const rtlDur = Math.max(0.12, (parseFloat(d.rtlSpeed) || 0.42) / speedMult);
    const b3LocalT = Math.max(0, t - tBeat3Start);
    const b3EnterProg = t >= tBeat3Start ? clamp(b3LocalT / rtlDur, 0, 1) : 0;
    const b3Eased = (parseFloat(d.slideOvershoot) || 0) > 0
      ? easeOutBack(b3EnterProg, parseFloat(d.slideOvershoot))
      : easeOutCubic(b3EnterProg);
    const b3HoldProg = t >= tBeat3Start ? clamp(b3LocalT / b3Dur, 0, 1) : 0;

    // Enters from Right (+108%) to Center (0%)
    const img3TranslateX = t < tBeat3Start ? 110 : (1 - b3Eased) * 108;
    const img3Opacity = t < tBeat3Start ? 0 : clamp(b3EnterProg * 3.2, 0, 1);
    const img3Blur = t >= tBeat3Start && b3EnterProg < 1 ? (1 - b3EnterProg) * (parseFloat(d.slideMotionBlur) || 10) : 0;
    const img3ScaleDyn = 1.0 + b3HoldProg * driftAmount;
    const img3Tilt = d.layoutStyle === 'stack' ? (parseFloat(d.stackTiltAngle) || 2.2) * Math.min(1, b3EnterProg) : 0;

    // --- BEAT 4: Sluggish Center Fade-In Emergence ---
    const emergeDur = Math.max(0.35, (parseFloat(d.centerEmergenceDuration) || 1.35) / speedMult);
    const b4LocalT = Math.max(0, t - tBeat4Start);
    const b4RawProg = t >= tBeat4Start ? clamp(b4LocalT / emergeDur, 0, 1) : 0;
    const sluggishVal = clamp(parseFloat(d.sluggishness) !== undefined ? parseFloat(d.sluggishness) : 0.82, 0.1, 0.98);
    const b4Viscous = easeSluggishViscous(b4RawProg, sluggishVal);
    const b4HoldProg = t >= tBeat4Start ? clamp(b4LocalT / b4Dur, 0, 1) : 0;

    const startScale4 = clamp(parseFloat(d.centerStartScale) || 0.36, 0.15, 0.90);
    const img4ScaleDyn = t < tBeat4Start
      ? startScale4
      : startScale4 + (1.0 - startScale4) * b4Viscous + b4HoldProg * (driftAmount * 0.65);

    // Sluggish opacity curve: rises from center with viscous weight
    const img4Opacity = t < tBeat4Start ? 0 : clamp(Math.pow(b4Viscous, 0.78) * 1.12, 0, 1);
    const maxBlur4 = parseFloat(d.centerFocusPullBlur) !== undefined ? parseFloat(d.centerFocusPullBlur) : 16;
    const img4Blur = t >= tBeat4Start ? Math.max(0, (1 - b4Viscous) * maxBlur4) : maxBlur4;
    const img4GhostAlpha = t >= tBeat4Start
      ? ((parseFloat(d.centerGhostTrail) || 55) / 100) * Math.sin(b4RawProg * Math.PI) * 0.65
      : 0;

    // How previous layers react (push vs stack vs parallax, plus Beat 4 center sink)
    const prevDimRatio = clamp((parseFloat(d.prevFrameDim) || 48) / 100, 0, 0.9);
    const sinkRatio = clamp((parseFloat(d.prevCenterSink) || 65) / 100, 0, 1);

    let img1PushX = 0;
    let img2PushX = 0;
    let img3SinkScale = 1.0;
    let img3ExtraBlur = 0;

    if (d.layoutStyle === 'push') {
      if (t >= tBeat2Start) img1PushX = b2Eased * 100; // pushed right as img2 comes from left
      if (t >= tBeat3Start) img2PushX = -b3Eased * 100; // pushed left as img3 comes from right
    } else if (d.layoutStyle === 'parallax') {
      if (t >= tBeat2Start) img1PushX = b2Eased * 28;
      if (t >= tBeat3Start) img2PushX = -b3Eased * 28;
    }

    if (t >= tBeat4Start) {
      // As Image 4 emerges sluggishly from the center of Image 3, Image 3 sinks inward & defocuses
      img3SinkScale = 1.0 - b4Viscous * (0.14 * sinkRatio);
      img3ExtraBlur = b4Viscous * (12 * sinkRatio);
    }

    const img1FinalBrightness = img1Brightness * (t >= tBeat2Start ? 1 - b2EnterProg * prevDimRatio : 1);
    const img2FinalBrightness = 100 * (t >= tBeat3Start ? 1 - b3EnterProg * prevDimRatio : 1);
    const img3FinalBrightness = 100 * (t >= tBeat4Start ? 1 - b4Viscous * (0.72 * sinkRatio) : 1);

    return {
      t,
      totalCycle,
      activeBeat,
      tBeat1Start,
      tBeat2Start,
      tBeat3Start,
      tBeat4Start,

      // Beat 1
      img1Opacity,
      img1Scale: img1ScaleDyn * (parseFloat(d.img1Scale) || 1.0),
      img1TranslateX: img1PushX + (parseFloat(d.img1OffsetX) || 0),
      img1TranslateY: parseFloat(d.img1OffsetY) || 0,
      img1Brightness: img1FinalBrightness,
      img1Contrast,
      flashOverlayAlpha,
      afterimageAlpha,

      // Beat 2 (L -> R)
      img2Visible: t >= tBeat2Start,
      img2Opacity,
      img2Scale: img2ScaleDyn * (parseFloat(d.img2Scale) || 1.0) * (d.layoutStyle === 'stack' ? 0.94 : 1.0),
      img2TranslateX: img2TranslateX + img2PushX + (parseFloat(d.img2OffsetX) || 0),
      img2TranslateY: parseFloat(d.img2OffsetY) || 0,
      img2Tilt,
      img2Blur,
      img2Brightness: img2FinalBrightness,

      // Beat 3 (R -> L)
      img3Visible: t >= tBeat3Start,
      img3Opacity,
      img3Scale: img3ScaleDyn * img3SinkScale * (parseFloat(d.img3Scale) || 1.0) * (d.layoutStyle === 'stack' ? 0.95 : 1.0),
      img3TranslateX: img3TranslateX + (parseFloat(d.img3OffsetX) || 0),
      img3TranslateY: parseFloat(d.img3OffsetY) || 0,
      img3Tilt,
      img3Blur: img3Blur + img3ExtraBlur,
      img3Brightness: img3FinalBrightness,

      // Beat 4 (Sluggish Center Emergence)
      img4Visible: t >= tBeat4Start,
      b4RawProg,
      b4Viscous,
      img4Opacity,
      img4Scale: img4ScaleDyn * (parseFloat(d.img4Scale) || 1.0),
      img4TranslateX: parseFloat(d.img4OffsetX) || 0,
      img4TranslateY: parseFloat(d.img4OffsetY) || 0,
      img4Blur,
      img4GhostAlpha,
      img4GhostScale: img4ScaleDyn * 1.12
    };
  }

  // =========================================================================
  // DOM BUILDER & REACTIVE UPDATER (FOR MODAL CUSTOMIZER & HOVER PREVIEW)
  // =========================================================================
  function buildFlashQuadHtml(tplId, rawData) {
    const d = Object.assign({}, DEFAULT_CONFIG, rawData || {});
    const st = computeFlashQuadState(d, 0, false);

    const borderPx = Math.max(0, parseFloat(d.photoBorderWidth) || 0);
    const borderClr = d.photoBorderColor || '#f8fafc';
    const borderStyle = borderPx > 0 ? `border: ${borderPx}px solid ${borderClr}; border-radius: 6px;` : '';

    const flashClr = d.flashColor || '#fff5e0';
    const spotX = 50 + (parseFloat(d.flashlightSpotX) || 0);
    const spotY = 50 + (parseFloat(d.flashlightSpotY) || -6);
    const coneRad = clamp(parseFloat(d.flashlightRadius) || 68, 20, 100);
    const falloffAlpha = clamp((parseFloat(d.flashlightFalloff) || 55) / 100, 0, 0.95);

    return `
      <div id="jani-flash-quad-viewport-${tplId}" class="jani-flash-quad-viewport" style="position: absolute; inset: 0; background: #04060b; overflow: hidden; display: flex; align-items: center; justify-content: center; user-select: none; font-family: 'Inter', sans-serif;">
        
        <!-- SHOT 1: Flash Entrance Layer -->
        <div id="jfq-layer-1-${tplId}" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, filter, opacity;">
          <div id="jfq-card-1-${tplId}" style="position: relative; width: 100%; height: 100%; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.85);">
            <img id="jfq-img-1-${tplId}" src="${d.image1Url}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            <!-- Directional Flashlight Cone Illumination Overlay on Shot 1 -->
            <div id="jfq-cone-1-${tplId}" style="position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light; opacity: ${d.showFlashlightBeamCone !== false ? '0.85' : '0'}; background: radial-gradient(circle at ${spotX}% ${spotY}%, ${colorToRgba(flashClr, 0.9)} 0%, ${colorToRgba(flashClr, 0.25)} ${coneRad * 0.55}%, rgba(0,0,0,${falloffAlpha}) 100%);"></div>
          </div>
        </div>

        <!-- SHOT 2: Left-to-Right (L -> R) Entrance Layer -->
        <div id="jfq-layer-2-${tplId}" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0; will-change: transform, filter, opacity; z-index: 2;">
          <div id="jfq-card-2-${tplId}" style="position: relative; width: 100%; height: 100%; overflow: hidden; box-shadow: -24px 20px 60px rgba(0,0,0,0.92); ${borderStyle}">
            <img id="jfq-img-2-${tplId}" src="${d.image2Url}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        </div>

        <!-- SHOT 3: Right-to-Left (R -> L) Entrance Layer -->
        <div id="jfq-layer-3-${tplId}" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0; will-change: transform, filter, opacity; z-index: 3;">
          <div id="jfq-card-3-${tplId}" style="position: relative; width: 100%; height: 100%; overflow: hidden; box-shadow: 24px 20px 60px rgba(0,0,0,0.92); ${borderStyle}">
            <img id="jfq-img-3-${tplId}" src="${d.image3Url}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        </div>

        <!-- SHOT 4: Sluggish Center Fade-In Emergence Layer -->
        <div id="jfq-layer-4-${tplId}" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0; will-change: transform, filter, opacity; z-index: 4;">
          <!-- Viscous Ghost Echo Trail -->
          <div id="jfq-ghost-4-${tplId}" style="position: absolute; inset: 0; opacity: 0; filter: blur(18px) brightness(135%); mix-blend-mode: screen; pointer-events: none;">
            <img id="jfq-ghost-img-4-${tplId}" src="${d.image4Url}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <div id="jfq-card-4-${tplId}" style="position: relative; width: 100%; height: 100%; overflow: hidden; box-shadow: 0 0 90px rgba(0,0,0,0.98); ${borderPx > 0 ? `border: ${Math.max(2, borderPx * 0.6)}px solid ${borderClr};` : ''}">
            <img id="jfq-img-4-${tplId}" src="${d.image4Url}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        </div>

        <!-- REALISTIC CAMERA FLASHLIGHT & XENON STROBE BURST OVERLAY -->
        <div id="jfq-flash-burst-${tplId}" style="position: absolute; inset: 0; pointer-events: none; z-index: 10; opacity: ${st.flashOverlayAlpha.toFixed(3)}; mix-blend-mode: screen; background: radial-gradient(circle at ${spotX}% ${spotY}%, #ffffff 0%, ${colorToRgba(flashClr, 0.92)} ${coneRad * 0.45}%, ${colorToRgba(flashClr, 0.25)} ${coneRad}%, rgba(0,0,0,0) 100%);"></div>

        <!-- RETINAL AFTERIMAGE HALO -->
        <div id="jfq-afterimage-${tplId}" style="position: absolute; inset: 0; pointer-events: none; z-index: 9; opacity: 0; mix-blend-mode: screen; background: radial-gradient(circle at ${spotX}% ${spotY}%, ${colorToRgba(flashClr, 0.65)} 0%, rgba(56,189,248,0.18) 45%, rgba(0,0,0,0) 75%);"></div>

        <!-- CINEMATIC PERIPHERAL VIGNETTE -->
        <div id="jfq-vignette-${tplId}" style="position: absolute; inset: 0; pointer-events: none; z-index: 8; background: radial-gradient(ellipse at center, rgba(0,0,0,0) ${coneRad * 0.75}%, rgba(0,0,0,${falloffAlpha}) 100%);"></div>

        <!-- OPTIONAL DOCUMENTARY EXHIBIT CAPTION BAR -->
        <div id="jfq-caption-pill-${tplId}" style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 12; display: ${d.showCaptions ? 'flex' : 'none'}; align-items: center; gap: 8px; padding: 5px 14px; border-radius: 6px; background: rgba(4, 6, 11, 0.85); border: 1px solid rgba(255,255,255,0.16); backdrop-filter: blur(8px); color: #f8fafc; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">
          <span id="jfq-caption-dot-${tplId}" style="width: 7px; height: 7px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span>
          <span id="jfq-caption-text-${tplId}">${d.img1Caption || 'EXHIBIT 01'}</span>
        </div>
      </div>
    `;
  }

  function applyFlashQuadStateToDOM(container, tplId, st, rawData) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, rawData || {});

    const borderPx = Math.max(0, parseFloat(d.photoBorderWidth) || 0);
    const borderClr = d.photoBorderColor || '#f8fafc';
    const flashClr = d.flashColor || '#fff5e0';
    const spotX = 50 + (parseFloat(d.flashlightSpotX) || 0);
    const spotY = 50 + (parseFloat(d.flashlightSpotY) || -6);
    const coneRad = clamp(parseFloat(d.flashlightRadius) || 68, 20, 100);
    const falloffAlpha = clamp((parseFloat(d.flashlightFalloff) || 55) / 100, 0, 0.95);

    // Sync Image Sources if user uploaded custom photos
    const syncImg = (id, url) => {
      const el = container.querySelector(`#${id}-${tplId}`);
      if (el && url && el.getAttribute('src') !== url) el.src = url;
    };
    syncImg('jfq-img-1', d.image1Url);
    syncImg('jfq-img-2', d.image2Url);
    syncImg('jfq-img-3', d.image3Url);
    syncImg('jfq-img-4', d.image4Url);
    syncImg('jfq-ghost-img-4', d.image4Url);

    // Layer 1 (Flash Reveal)
    const l1 = container.querySelector(`#jfq-layer-1-${tplId}`);
    if (l1) {
      l1.style.display = d.layer1Visible === false ? 'none' : 'flex';
      l1.style.zIndex = String(d.layer1Z ?? 1);
      l1.style.mixBlendMode = d.layer1Blend || 'normal';
      const op1 = clamp((d.layer1Opacity ?? 100) / 100, 0, 1);
      l1.style.opacity = (st.img1Opacity * op1).toFixed(3);
      l1.style.transform = `translate3d(${st.img1TranslateX.toFixed(2)}%, ${st.img1TranslateY.toFixed(2)}%, 0) scale(${st.img1Scale.toFixed(4)})`;
      l1.style.filter = `brightness(${st.img1Brightness.toFixed(0)}%) contrast(${st.img1Contrast.toFixed(0)}%)`;
    }
    const cone1 = container.querySelector(`#jfq-cone-1-${tplId}`);
    if (cone1) {
      cone1.style.opacity = d.showFlashlightBeamCone !== false ? '0.85' : '0';
      cone1.style.background = `radial-gradient(circle at ${spotX}% ${spotY}%, ${colorToRgba(flashClr, 0.9)} 0%, ${colorToRgba(flashClr, 0.25)} ${coneRad * 0.55}%, rgba(0,0,0,${falloffAlpha}) 100%)`;
    }

    // Layer 2 (Left -> Right)
    const l2 = container.querySelector(`#jfq-layer-2-${tplId}`);
    const c2 = container.querySelector(`#jfq-card-2-${tplId}`);
    if (l2) {
      l2.style.display = d.layer2Visible === false ? 'none' : 'flex';
      l2.style.zIndex = String(d.layer2Z ?? 2);
      l2.style.mixBlendMode = d.layer2Blend || 'normal';
      const op2 = clamp((d.layer2Opacity ?? 100) / 100, 0, 1);
      l2.style.opacity = (st.img2Opacity * op2).toFixed(3);
      l2.style.transform = `translate3d(${st.img2TranslateX.toFixed(2)}%, ${st.img2TranslateY.toFixed(2)}%, 0) scale(${st.img2Scale.toFixed(4)}) rotate(${st.img2Tilt.toFixed(2)}deg)`;
      l2.style.filter = `brightness(${st.img2Brightness.toFixed(0)}%)${st.img2Blur > 0.3 ? ` blur(${st.img2Blur.toFixed(1)}px)` : ''}`;
    }
    if (c2) {
      c2.style.border = borderPx > 0 ? `${borderPx}px solid ${borderClr}` : 'none';
      c2.style.borderRadius = borderPx > 0 ? '6px' : '0px';
    }

    // Layer 3 (Right -> Left)
    const l3 = container.querySelector(`#jfq-layer-3-${tplId}`);
    const c3 = container.querySelector(`#jfq-card-3-${tplId}`);
    if (l3) {
      l3.style.display = d.layer3Visible === false ? 'none' : 'flex';
      l3.style.zIndex = String(d.layer3Z ?? 3);
      l3.style.mixBlendMode = d.layer3Blend || 'normal';
      const op3 = clamp((d.layer3Opacity ?? 100) / 100, 0, 1);
      l3.style.opacity = (st.img3Opacity * op3).toFixed(3);
      l3.style.transform = `translate3d(${st.img3TranslateX.toFixed(2)}%, ${st.img3TranslateY.toFixed(2)}%, 0) scale(${st.img3Scale.toFixed(4)}) rotate(${st.img3Tilt.toFixed(2)}deg)`;
      l3.style.filter = `brightness(${st.img3Brightness.toFixed(0)}%)${st.img3Blur > 0.3 ? ` blur(${st.img3Blur.toFixed(1)}px)` : ''}`;
    }
    if (c3) {
      c3.style.border = borderPx > 0 ? `${borderPx}px solid ${borderClr}` : 'none';
      c3.style.borderRadius = borderPx > 0 ? '6px' : '0px';
    }

    // Layer 4 (Sluggish Center Emergence)
    const l4 = container.querySelector(`#jfq-layer-4-${tplId}`);
    const g4 = container.querySelector(`#jfq-ghost-4-${tplId}`);
    const c4 = container.querySelector(`#jfq-card-4-${tplId}`);
    if (l4) {
      l4.style.display = d.layer4Visible === false ? 'none' : 'flex';
      l4.style.zIndex = String(d.layer4Z ?? 4);
      l4.style.mixBlendMode = d.layer4Blend || 'normal';
      const op4 = clamp((d.layer4Opacity ?? 100) / 100, 0, 1);
      l4.style.opacity = (st.img4Opacity * op4).toFixed(3);
      l4.style.transform = `translate3d(${st.img4TranslateX.toFixed(2)}%, ${st.img4TranslateY.toFixed(2)}%, 0) scale(${st.img4Scale.toFixed(4)})`;
      l4.style.filter = st.img4Blur > 0.35 ? `blur(${st.img4Blur.toFixed(1)}px)` : 'none';
    }
    if (g4) {
      g4.style.opacity = st.img4GhostAlpha.toFixed(3);
      g4.style.transform = `scale(${(st.img4GhostScale / Math.max(0.1, st.img4Scale)).toFixed(3)})`;
    }
    if (c4) {
      c4.style.border = borderPx > 0 ? `${Math.max(2, borderPx * 0.6)}px solid ${borderClr}` : 'none';
    }

    // Flash Burst & Afterimage Overlays
    const fb = container.querySelector(`#jfq-flash-burst-${tplId}`);
    if (fb) {
      fb.style.opacity = st.flashOverlayAlpha.toFixed(3);
      fb.style.background = `radial-gradient(circle at ${spotX}% ${spotY}%, #ffffff 0%, ${colorToRgba(flashClr, 0.92)} ${coneRad * 0.45}%, ${colorToRgba(flashClr, 0.25)} ${coneRad}%, rgba(0,0,0,0) 100%)`;
    }
    const ai = container.querySelector(`#jfq-afterimage-${tplId}`);
    if (ai) {
      ai.style.opacity = st.afterimageAlpha.toFixed(3);
      ai.style.background = `radial-gradient(circle at ${spotX}% ${spotY}%, ${colorToRgba(flashClr, 0.65)} 0%, rgba(56,189,248,0.18) 45%, rgba(0,0,0,0) 75%)`;
    }
    const vig = container.querySelector(`#jfq-vignette-${tplId}`);
    if (vig) {
      vig.style.background = `radial-gradient(ellipse at center, rgba(0,0,0,0) ${coneRad * 0.75}%, rgba(0,0,0,${falloffAlpha}) 100%)`;
    }

    // Caption bar
    const capPill = container.querySelector(`#jfq-caption-pill-${tplId}`);
    const capText = container.querySelector(`#jfq-caption-text-${tplId}`);
    if (capPill) {
      capPill.style.display = d.showCaptions ? 'flex' : 'none';
      if (capText && d.showCaptions) {
        const captions = [d.img1Caption, d.img2Caption, d.img3Caption, d.img4Caption];
        capText.textContent = captions[st.activeBeat - 1] || `EXHIBIT 0${st.activeBeat}`;
      }
    }
  }

  // =========================================================================
  // 2D CANVAS RENDERER FOR TIMELINE PLAYBACK & VIDEO EXPORT
  // =========================================================================
  function drawCoverImage(ctx, img, x, y, w, h) {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = w / h;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (imgRatio > boxRatio) {
      sw = img.naturalHeight * boxRatio;
      sx = (img.naturalWidth - sw) * 0.5;
    } else {
      sh = img.naturalWidth / boxRatio;
      sy = (img.naturalHeight - sh) * 0.5;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  window.renderJaniFlashQuadCanvas = function (ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const data = Object.assign(
      {},
      DEFAULT_CONFIG,
      (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {}
    );
    const st = computeFlashQuadState(data, t, true);

    ctx.save();
    ctx.fillStyle = '#04060b';
    ctx.fillRect(0, 0, cw, ch);

    const borderPx = Math.max(0, parseFloat(data.photoBorderWidth) || 0);
    const borderClr = data.photoBorderColor || '#f8fafc';
    const flashClr = data.flashColor || '#fff5e0';
    const cx = cw * (0.5 + (parseFloat(data.flashlightSpotX) || 0) / 100);
    const cy = ch * (0.5 + (parseFloat(data.flashlightSpotY) || -6) / 100);
    const coneRadPx = Math.max(cw, ch) * (clamp(parseFloat(data.flashlightRadius) || 68, 20, 100) / 100);
    const falloffAlpha = clamp((parseFloat(data.flashlightFalloff) || 55) / 100, 0, 0.95);

    const drawLayer = (imgUrl, opacity, txPct, tyPct, scale, tiltDeg, brightness, contrast, blurPx, withBorder) => {
      if (opacity <= 0.01) return;
      const img = getCachedImage(imgUrl);
      ctx.save();
      ctx.globalAlpha = clamp(opacity, 0, 1);
      ctx.translate(cw / 2 + (txPct / 100) * cw, ch / 2 + (tyPct / 100) * ch);
      if (tiltDeg) ctx.rotate((tiltDeg * Math.PI) / 180);
      ctx.scale(scale, scale);

      let filterStr = `brightness(${brightness.toFixed(0)}%)`;
      if (contrast && contrast !== 100) filterStr += ` contrast(${contrast.toFixed(0)}%)`;
      if (blurPx > 0.35) filterStr += ` blur(${blurPx.toFixed(1)}px)`;
      ctx.filter = filterStr;

      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 32;
      ctx.fillStyle = '#090d16';
      ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
      ctx.shadowColor = 'transparent';

      if (img) {
        drawCoverImage(ctx, img, -cw / 2, -ch / 2, cw, ch);
      }

      if (withBorder && borderPx > 0) {
        ctx.filter = 'none';
        ctx.strokeStyle = borderClr;
        ctx.lineWidth = borderPx * 2;
        ctx.strokeRect(-cw / 2 + borderPx, -ch / 2 + borderPx, cw - borderPx * 2, ch - borderPx * 2);
      }
      ctx.restore();
    };

    // 1. Beat 1 Layer
    drawLayer(data.image1Url, st.img1Opacity, st.img1TranslateX, st.img1TranslateY, st.img1Scale, 0, st.img1Brightness, st.img1Contrast, 0, false);

    // 2. Beat 2 Layer (L -> R)
    if (st.img2Visible) {
      drawLayer(data.image2Url, st.img2Opacity, st.img2TranslateX, st.img2TranslateY, st.img2Scale, st.img2Tilt, st.img2Brightness, 104, st.img2Blur, true);
    }

    // 3. Beat 3 Layer (R -> L)
    if (st.img3Visible) {
      drawLayer(data.image3Url, st.img3Opacity, st.img3TranslateX, st.img3TranslateY, st.img3Scale, st.img3Tilt, st.img3Brightness, 104, st.img3Blur, true);
    }

    // 4. Beat 4 Layer (Sluggish Center Emergence)
    if (st.img4Visible) {
      if (st.img4GhostAlpha > 0.02) {
        drawLayer(data.image4Url, st.img4GhostAlpha, st.img4TranslateX, st.img4TranslateY, st.img4GhostScale, 0, 130, 110, 14, false);
      }
      drawLayer(data.image4Url, st.img4Opacity, st.img4TranslateX, st.img4TranslateY, st.img4Scale, 0, 104, 108, st.img4Blur, borderPx > 0);
    }

    // 5. Camera Flash Strobe Burst + Flashlight Cone
    if (st.flashOverlayAlpha > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = clamp(st.flashOverlayAlpha, 0, 1);
      const fg = ctx.createRadialGradient(cx, cy, 4, cx, cy, coneRadPx);
      fg.addColorStop(0, '#ffffff');
      fg.addColorStop(0.45, colorToRgba(flashClr, 0.92));
      fg.addColorStop(0.85, colorToRgba(flashClr, 0.25));
      fg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fg;
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }

    // 6. Retinal Afterimage Halo
    if (st.afterimageAlpha > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = clamp(st.afterimageAlpha, 0, 1);
      const ag = ctx.createRadialGradient(cx, cy, 10, cx, cy, coneRadPx * 0.85);
      ag.addColorStop(0, colorToRgba(flashClr, 0.65));
      ag.addColorStop(0.5, 'rgba(56,189,248,0.2)');
      ag.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }

    // 7. Flashlight Edge Falloff Vignette
    ctx.save();
    const vg = ctx.createRadialGradient(cw / 2, ch / 2, coneRadPx * 0.45, cw / 2, ch / 2, Math.max(cw, ch) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, `rgba(0,0,0,${falloffAlpha})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, cw, ch);
    ctx.restore();

    ctx.restore();
  };

  // =========================================================================
  // STAGE MOUNT & STEPPER HOOKS
  // =========================================================================
  window.tplMountJaniFlashQuadStage = function (container, data) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    container.innerHTML = buildFlashQuadHtml(TEMPLATE_ID, d);
  };

  window.stepJaniFlashQuadAnimation = function (container, tplId, manualT, data) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    if (!container.querySelector(`#jani-flash-quad-viewport-${tplId}`)) {
      container.innerHTML = buildFlashQuadHtml(tplId, d);
    }
    const isModalStage = container.id === 'tpl-modal-preview-stage';
    const st = computeFlashQuadState(d, manualT, isModalStage);
    applyFlashQuadStateToDOM(container, tplId, st, d);
  };

  // =========================================================================
  // GRANULAR CONTEXTUAL INSPECTOR WITH MOOD PSYCHOLOGY DIRECTOR
  // =========================================================================
  window.tplBuildJaniFlashQuadInspector = function (container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const activeMood = MOOD_PRESETS[d.moodPreset] || MOOD_PRESETS.genius;

    const moodCardsHtml = Object.values(MOOD_PRESETS).map((m) => {
      const isSel = (d.moodPreset || 'genius') === m.id;
      return `
        <button type="button" data-mood-id="${m.id}" class="jfq-mood-btn" style="text-align: left; padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: all 0.15s ease; background: ${isSel ? 'linear-gradient(135deg, rgba(56,189,248,0.22), rgba(168,85,247,0.18))' : 'rgba(15,23,42,0.65)'}; border: 1.5px solid ${isSel ? '#38bdf8' : 'rgba(255,255,255,0.08)'}; box-shadow: ${isSel ? '0 4px 16px rgba(56,189,248,0.25)' : 'none'};">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
            <span style="font-size: 10.5px; font-weight: 800; color: ${isSel ? '#ffffff' : '#e2e8f0'};">${m.label}</span>
            ${isSel ? '<span style="font-size: 8px; font-weight: 800; color: #38bdf8; background: rgba(56,189,248,0.18); padding: 1px 6px; border-radius: 99px;">ACTIVE MOOD</span>' : ''}
          </div>
          <div style="font-size: 9px; font-weight: 700; color: #fbbf24; margin-bottom: 2px;">Psychology: ${m.feeling}</div>
          <div style="font-size: 8.5px; color: #94a3b8; line-height: 1.35;">${m.desc}</div>
        </button>
      `;
    }).join('');

    const colorSwatches = [
      { hex: '#e0f2fe', label: 'Xenon Blue' },
      { hex: '#ffffff', label: 'Pure Strobe' },
      { hex: '#fff5e0', label: 'Leica Warm' },
      { hex: '#ffd699', label: 'Tungsten' },
      { hex: '#fca5a5', label: 'Darkroom Red' }
    ].map(s => `
      <button type="button" class="jfq-color-swatch" data-color="${s.hex}" title="${s.label}" style="height: 22px; border-radius: 4px; background: ${s.hex}; border: 2px solid ${(d.flashColor || '').toLowerCase() === s.hex ? '#38bdf8' : 'rgba(255,255,255,0.2)'}; cursor: pointer;"></button>
    `).join('');

    const jfqLayers = [
      { id: 'bg', idx: 0, zKey: 'layer0Z', zDef: 0, visKey: 'layer0Visible', opKey: 'layer0Opacity', blendKey: 'layer0Blend', color: '#10b981', name: 'Z=0 • Background Studio Canvas', thumb: '' },
      { id: 'b1', idx: 1, zKey: 'layer1Z', zDef: 1, visKey: 'layer1Visible', opKey: 'layer1Opacity', blendKey: 'layer1Blend', color: '#38bdf8', name: 'Z=1 • Layer 1: Beat 1 (Flash Entrance)', thumb: d.image1Url, scaleKey: 'img1Scale', oxKey: 'img1OffsetX', oyKey: 'img1OffsetY' },
      { id: 'b2', idx: 2, zKey: 'layer2Z', zDef: 2, visKey: 'layer2Visible', opKey: 'layer2Opacity', blendKey: 'layer2Blend', color: '#0ea5e9', name: 'Z=2 • Layer 2: Beat 2 (Left → Right)', thumb: d.image2Url, scaleKey: 'img2Scale', oxKey: 'img2OffsetX', oyKey: 'img2OffsetY' },
      { id: 'b3', idx: 3, zKey: 'layer3Z', zDef: 3, visKey: 'layer3Visible', opKey: 'layer3Opacity', blendKey: 'layer3Blend', color: '#f59e0b', name: 'Z=3 • Layer 3: Beat 3 (Right → Left)', thumb: d.image3Url, scaleKey: 'img3Scale', oxKey: 'img3OffsetX', oyKey: 'img3OffsetY' },
      { id: 'b4', idx: 4, zKey: 'layer4Z', zDef: 4, visKey: 'layer4Visible', opKey: 'layer4Opacity', blendKey: 'layer4Blend', color: '#a855f7', name: 'Z=4 • Layer 4: Beat 4 (Sluggish Center)', thumb: d.image4Url, scaleKey: 'img4Scale', oxKey: 'img4OffsetX', oyKey: 'img4OffsetY' },
      { id: 'fx', idx: 5, zKey: 'layer5Z', zDef: 10, visKey: 'showFlashlightBeamCone', opKey: 'layer5Opacity', blendKey: 'layer5Blend', color: '#f43f5e', name: 'Z=5 • Flashlight Cone & Strobe Overlay', thumb: '' }
    ];
    const selJfqId = d.selectedJfqLayer || 'b1';
    const selJfqLayer = jfqLayers.find(l => l.id === selJfqId) || jfqLayers[1];

    container.innerHTML = `
      <div style="background: rgba(15,23,42,0.75); border: 1px solid rgba(56,189,248,0.38); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 12px 32px rgba(0,0,0,0.75); width: 100%;">
        
        <!-- HEADER -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">📸</span>
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #f8fafc; letter-spacing: 0.4px;">4-BEAT FLASH & SLUGGISH EMERGENCE ENGINE</div>
              <div style="font-size: 9.5px; color: #38bdf8;">Beat 1 Flash · Beat 2 L→R · Beat 3 R→L · Beat 4 Viscous Center</div>
            </div>
          </div>
          <span style="font-size: 8.5px; font-weight: 800; background: rgba(245,158,11,0.2); color: #fbbf24; padding: 2px 7px; border-radius: 4px; border: 1px solid rgba(245,158,11,0.4);">PSYCHOLOGY SUITE</span>
        </div>

        <!-- 0. STUDIO SCENE LAYER STACK (Z=0 Background First -> Layers After It) -->
        <div style="background: #0c0e15; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 10px; display: flex; flex-direction: column; gap: 7px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 5px;">
            <span style="font-size: 10.5px; font-weight: 800; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.05em;">🗂️ Scene Layers (Z=0 Background → Z=5 FX)</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <select id="jfq-layer-blend-sel" style="background:#07090e; border:1px solid rgba(255,255,255,0.12); border-radius:4px; color:#e2e8f0; font-size:9px; padding:2px 4px;">
                ${['normal', 'screen', 'multiply', 'overlay', 'lighten'].map(bm => `<option value="${bm}" ${(d[selJfqLayer.blendKey] || 'normal') === bm ? 'selected' : ''}>${bm.toUpperCase()}</option>`).join('')}
              </select>
              <span style="font-size:9px; color:#94a3b8;">Op:</span>
              <input type="number" id="jfq-layer-op-inp" min="0" max="100" value="${d[selJfqLayer.opKey] ?? 100}" style="width:38px; background:#07090e; border:1px solid rgba(255,255,255,0.12); border-radius:4px; color:#fff; font-size:9px; padding:2px 4px; text-align:right;" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${jfqLayers.map(l => {
              const isSel = l.id === selJfqId;
              const isVis = d[l.visKey] !== false;
              const opVal = d[l.opKey] ?? 100;
              const zVal = d[l.zKey] ?? l.zDef;
              return `
                <div class="jfq-stack-row" data-lid="${l.id}" style="display:flex; align-items:center; gap:6px; background:${isSel ? 'linear-gradient(90deg, rgba(56,189,248,0.18), rgba(30,41,59,0.75))' : 'rgba(255,255,255,0.025)'}; border:1px solid ${isSel ? 'rgba(56,189,248,0.55)' : 'rgba(255,255,255,0.06)'}; border-left:4px solid ${l.color}; border-radius:6px; padding:5px 7px; cursor:pointer;">
                  <button type="button" class="jfq-stack-vis" data-viskey="${l.visKey}" style="width:20px; height:20px; border:none; background:rgba(255,255,255,0.04); border-radius:4px; color:${isVis ? '#e2e8f0' : '#475569'}; font-size:11px; cursor:pointer;">${isVis ? '👁' : '—'}</button>
                  ${l.thumb
                    ? `<img src="${l.thumb}" style="width:28px; height:20px; border-radius:3px; object-fit:cover; border:1px solid rgba(255,255,255,0.15);" />`
                    : `<div style="width:28px; height:20px; border-radius:3px; background:#090d16; border:1px solid ${l.color}; display:grid; place-items:center; font-size:8px; font-family:monospace; color:${l.color};">${l.id.toUpperCase()}</div>`}
                  <div style="flex:1; min-width:0; display:flex; flex-direction:column;">
                    <span style="font-size:10px; font-weight:${isSel ? '700' : '600'}; color:${isVis ? '#f1f5f9' : '#64748b'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${l.name}</span>
                    <span style="font-size:8.5px; color:#64748b; font-family:monospace;">Z=${zVal} · ${(d[l.blendKey] || 'normal').toUpperCase()} · ${opVal}%</span>
                  </div>
                  ${l.idx >= 1 && l.idx <= 4 ? `
                    <label style="padding:2px 6px; border-radius:4px; background:rgba(56,189,248,0.14); border:1px solid rgba(56,189,248,0.35); color:#7dd3fc; font-size:8.5px; cursor:pointer;" onclick="event.stopPropagation();">
                      Replace
                      <input type="file" class="inp-jfq-slot-file" data-slot="${l.idx}" accept="image/*" style="display:none;" />
                    </label>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          ${selJfqLayer.scaleKey ? `
            <div style="background:rgba(14,165,233,0.06); border:1px solid rgba(56,189,248,0.28); border-radius:6px; padding:7px 9px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:8.5px; color:#cbd5e1;"><span>Zoom Scale</span><b id="val-jfq-lscale">${Number(d[selJfqLayer.scaleKey] || 1.0).toFixed(2)}x</b></div>
                <input type="range" id="inp-jfq-lscale" min="0.6" max="2.5" step="0.02" value="${d[selJfqLayer.scaleKey] || 1.0}" style="width:100%; accent-color:#38bdf8;" />
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:8.5px; color:#94a3b8;"><span>Pan X</span><b id="val-jfq-lox">${d[selJfqLayer.oxKey] || 0}%</b></div>
                <input type="range" id="inp-jfq-lox" min="-40" max="40" step="1" value="${d[selJfqLayer.oxKey] || 0}" style="width:100%; accent-color:#38bdf8;" />
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:8.5px; color:#94a3b8;"><span>Pan Y</span><b id="val-jfq-loy">${d[selJfqLayer.oyKey] || 0}%</b></div>
                <input type="range" id="inp-jfq-loy" min="-40" max="40" step="1" value="${d[selJfqLayer.oyKey] || 0}" style="width:100%; accent-color:#38bdf8;" />
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 1. EMOTIONAL PSYCHOLOGY & MOOD DIRECTOR -->
        <div style="background: rgba(2,6,23,0.65); border: 1px solid rgba(251,191,36,0.28); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 800; color: #fbbf24;">🧠 1. Psychological Mood Director (What Viewers Feel)</span>
            <span style="font-size: 8.5px; color: #94a3b8;">Auto-Configures All Controls</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${moodCardsHtml}
          </div>
        </div>

        <!-- 2. SHOT 1: CAMERA FLASHLIGHT & OPTICAL STROBE -->
        <div style="background: rgba(0,0,0,0.32); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #f8fafc;">⚡ 2. Shot 1 — Flashlight Brilliance, Color & Optics</span>
            <label style="font-size: 9px; color: #38bdf8; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-jfq-cone" ${d.showFlashlightBeamCone !== false ? 'checked' : ''} /> Flashlight Beam
            </label>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Flash Brilliance</span><b id="val-jfq-brilliance" style="color:#fff;">${d.flashBrilliance}%</b>
              </div>
              <input type="range" id="slider-jfq-brilliance" min="100" max="350" step="5" value="${d.flashBrilliance}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Flash Decay Tail</span><b id="val-jfq-flash-decay" style="color:#fff;">${Number(d.flashDecayDuration).toFixed(2)}s</b>
              </div>
              <input type="range" id="slider-jfq-flash-decay" min="0.10" max="1.20" step="0.02" value="${d.flashDecayDuration}" style="width: 100%;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 8px; align-items: center;">
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 3px;">Flash Color Picker</div>
              <input type="color" id="picker-jfq-flash-color" value="${d.flashColor || '#fff5e0'}" style="width: 100%; height: 24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: transparent; cursor: pointer;" />
            </div>
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 3px;">Optical Color Temperature Swatches</div>
              <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px;">
                ${colorSwatches}
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 2px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Beam Cone</span><b id="val-jfq-cone-rad">${d.flashlightRadius}%</b>
              </div>
              <input type="range" id="slider-jfq-cone-rad" min="25" max="100" value="${d.flashlightRadius}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Pre-Flash Dip</span><b id="val-jfq-predip">${d.preFlashDip}%</b>
              </div>
              <input type="range" id="slider-jfq-predip" min="0" max="75" value="${d.preFlashDip}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Retinal Burn</span><b id="val-jfq-afterimage">${d.retinalAfterimage}%</b>
              </div>
              <input type="range" id="slider-jfq-afterimage" min="0" max="90" value="${d.retinalAfterimage}" style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 3. PHOTOGRAPH SOUND & AUDIO DESIGN -->
        <div style="background: rgba(0,0,0,0.32); border: 1px solid rgba(56,189,248,0.22); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #38bdf8;">🔊 3. Photograph Sound & Audio Psychology</span>
            <button type="button" id="btn-jfq-test-sound" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 3px 8px; background: rgba(56,189,248,0.18); border-color: #38bdf8; color: #fff;">
              🔊 Audition Shutter
            </button>
          </div>

          <div>
            <div style="font-size: 9px; color: #94a3b8; margin-bottom: 3px;">Camera Mechanism & Flash Sound Profile</div>
            <select id="sel-jfq-sound-profile" style="width: 100%; background: #090d16; border: 1px solid rgba(255,255,255,0.16); border-radius: 5px; padding: 6px 8px; color: #f8fafc; font-size: 10.5px; font-weight: 600;">
              <option value="slr_35mm" ${d.shutterSoundProfile === 'slr_35mm' ? 'selected' : ''}>📷 35mm Mechanical SLR (Mirror Slap + Metallic Curtain)</option>
              <option value="paparazzi_xenon" ${d.shutterSoundProfile === 'paparazzi_xenon' ? 'selected' : ''}>⚡ Paparazzi Xenon Strobe (Double Snap + Capacitor Recharge Whine)</option>
              <option value="polaroid_instant" ${d.shutterSoundProfile === 'polaroid_instant' ? 'selected' : ''}>🎞️ Polaroid Instant Camera (Heavy Latch + Motorized Film Eject)</option>
              <option value="vintage_bulb" ${d.shutterSoundProfile === 'vintage_bulb' ? 'selected' : ''}>💡 Vintage Press Flashbulb (Deep Pop + Filament Sizzle)</option>
              <option value="mirrorless_silent" ${d.shutterSoundProfile === 'mirrorless_silent' ? 'selected' : ''}>🔇 Modern Silent Mirrorless (Tight Clinical Electronic Click)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>SFX Volume</span><b id="val-jfq-sfx-vol" style="color:#fff;">${d.shutterVolume}%</b>
              </div>
              <input type="range" id="slider-jfq-sfx-vol" min="0" max="150" step="5" value="${d.shutterVolume}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Shutter Pitch / Weight</span><b id="val-jfq-sfx-pitch" style="color:#fff;">${Number(d.shutterPitch).toFixed(2)}x</b>
              </div>
              <input type="range" id="slider-jfq-sfx-pitch" min="0.65" max="1.40" step="0.05" value="${d.shutterPitch}" style="width: 100%;" />
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding-top: 2px;">
            <label style="font-size: 9.5px; color: #cbd5e1; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-jfq-sfx-shutter" ${d.enableShutterSFX !== false ? 'checked' : ''} /> Shot 1 Shutter SFX
            </label>
            <label style="font-size: 9.5px; color: #cbd5e1; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-jfq-sfx-whoosh" ${d.enableSlideWhoosh !== false ? 'checked' : ''} /> Shot 2/3 Whoosh
            </label>
            <label style="font-size: 9.5px; color: #cbd5e1; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-jfq-sfx-sub" ${d.enableSubSwell !== false ? 'checked' : ''} /> Shot 4 Sub-Bass Swell
            </label>
          </div>
        </div>

        <!-- 4. SHOTS 2 & 3: L->R AND R->L DIRECTIONAL ENTRANCES -->
        <div style="background: rgba(0,0,0,0.32); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #f8fafc;">↔️ 4. Shots 2 & 3 — Left-to-Right & Right-to-Left</span>
            <span style="font-size: 8.5px; color: #94a3b8;">Directional Choreography</span>
          </div>

          <div>
            <div style="font-size: 9px; color: #94a3b8; margin-bottom: 3px;">Frame Interaction Mode</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
              <button type="button" class="btn btn-secondary btn-sm jfq-layout-btn" data-layout="stack" style="font-size: 9px; padding: 5px; ${d.layoutStyle === 'stack' ? 'border-color:#38bdf8; background:rgba(56,189,248,0.2); color:#fff;' : ''}">🗂️ Photo Stack</button>
              <button type="button" class="btn btn-secondary btn-sm jfq-layout-btn" data-layout="push" style="font-size: 9px; padding: 5px; ${d.layoutStyle === 'push' ? 'border-color:#38bdf8; background:rgba(56,189,248,0.2); color:#fff;' : ''}">➡️ Full Push</button>
              <button type="button" class="btn btn-secondary btn-sm jfq-layout-btn" data-layout="parallax" style="font-size: 9px; padding: 5px; ${d.layoutStyle === 'parallax' ? 'border-color:#38bdf8; background:rgba(56,189,248,0.2); color:#fff;' : ''}">📐 Parallax Whip</button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Shot 2 (L → R) Speed</span><b id="val-jfq-ltr-speed" style="color:#fff;">${Number(d.ltrSpeed).toFixed(2)}s</b>
              </div>
              <input type="range" id="slider-jfq-ltr-speed" min="0.14" max="1.10" step="0.02" value="${d.ltrSpeed}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Shot 3 (R → L) Speed</span><b id="val-jfq-rtl-speed" style="color:#fff;">${Number(d.rtlSpeed).toFixed(2)}s</b>
              </div>
              <input type="range" id="slider-jfq-rtl-speed" min="0.14" max="1.10" step="0.02" value="${d.rtlSpeed}" style="width: 100%;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Snap Bounce</span><b id="val-jfq-overshoot">${d.slideOvershoot}%</b>
              </div>
              <input type="range" id="slider-jfq-overshoot" min="0" max="45" value="${d.slideOvershoot}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Motion Blur</span><b id="val-jfq-mblur">${d.slideMotionBlur}px</b>
              </div>
              <input type="range" id="slider-jfq-mblur" min="0" max="28" value="${d.slideMotionBlur}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Photo Border</span><b id="val-jfq-border">${d.photoBorderWidth}px</b>
              </div>
              <input type="range" id="slider-jfq-border" min="0" max="16" value="${d.photoBorderWidth}" style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 5. SHOT 4: SLUGGISH CENTER FADE-IN EMERGENCE -->
        <div style="background: rgba(0,0,0,0.38); border: 1px solid rgba(168,85,247,0.35); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #c084fc;">🌀 5. Shot 4 — Center Emergence & "Sluggishness"</span>
            <span style="font-size: 8.5px; color: #94a3b8;">Viscous Center Pull</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Sluggishness / Viscosity</span><b id="val-jfq-sluggish" style="color:#c084fc;">${Math.round(d.sluggishness * 100)}%</b>
              </div>
              <input type="range" id="slider-jfq-sluggish" min="0.15" max="0.98" step="0.02" value="${d.sluggishness}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Emergence Duration</span><b id="val-jfq-emerge-dur" style="color:#fff;">${Number(d.centerEmergenceDuration).toFixed(2)}s</b>
              </div>
              <input type="range" id="slider-jfq-emerge-dur" min="0.40" max="2.50" step="0.05" value="${d.centerEmergenceDuration}" style="width: 100%;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Center Origin</span><b id="val-jfq-cscale">${Number(d.centerStartScale).toFixed(2)}x</b>
              </div>
              <input type="range" id="slider-jfq-cscale" min="0.15" max="0.85" step="0.02" value="${d.centerStartScale}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Focus Pull Blur</span><b id="val-jfq-cblur">${d.centerFocusPullBlur}px</b>
              </div>
              <input type="range" id="slider-jfq-cblur" min="0" max="32" value="${d.centerFocusPullBlur}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
                <span>Ghost Trail</span><b id="val-jfq-cghost">${d.centerGhostTrail}%</b>
              </div>
              <input type="range" id="slider-jfq-cghost" min="0" max="95" value="${d.centerGhostTrail}" style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 6. GLOBAL SPEED, PER-BEAT TIMING & 4 IMAGE PLACEHOLDER SLOTS -->
        <div style="background: rgba(0,0,0,0.32); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #cbd5e1;">🖼️ 6. 4-Shot Media Slots & Hold Durations</span>
            <label style="font-size: 9px; color: #94a3b8; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-jfq-captions" ${d.showCaptions ? 'checked' : ''} /> Show Exhibit Captions
            </label>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
              <span>Master Pacing / Speed Multiplier</span><b id="val-jfq-speed-mult" style="color:#38bdf8;">${Number(d.speedMultiplier).toFixed(2)}x</b>
            </div>
            <input type="range" id="slider-jfq-speed-mult" min="0.50" max="2.00" step="0.05" value="${d.speedMultiplier}" style="width: 100%;" />
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 2px;">
            ${[
              { idx: 1, title: 'Beat 1: Camera Flash', url: d.image1Url, dur: d.beat1Duration },
              { idx: 2, title: 'Beat 2: Left → Right', url: d.image2Url, dur: d.beat2Duration },
              { idx: 3, title: 'Beat 3: Right → Left', url: d.image3Url, dur: d.beat3Duration },
              { idx: 4, title: 'Beat 4: Sluggish Center', url: d.image4Url, dur: d.beat4Duration }
            ].map(slot => `
              <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px; display: flex; flex-direction: column; gap: 5px;">
                <div style="font-size: 9px; font-weight: 700; color: #e2e8f0; display: flex; justify-content: space-between;">
                  <span>${slot.title}</span>
                  <span id="val-jfq-b${slot.idx}-dur" style="color:#38bdf8;">${Number(slot.dur).toFixed(2)}s</span>
                </div>
                <div style="position: relative; height: 54px; border-radius: 4px; overflow: hidden; background: #020617; border: 1px solid rgba(255,255,255,0.08);">
                  <img src="${slot.url}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                  <label style="position: absolute; inset: 0; background: rgba(2,6,23,0.62); opacity: 0; transition: opacity 0.15s; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 9px; font-weight: 700; color: #fff;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
                    📁 Replace Image
                    <input type="file" class="inp-jfq-slot-file" data-slot="${slot.idx}" accept="image/*" style="display: none;" />
                  </label>
                </div>
                <input type="range" class="slider-jfq-beat-dur" data-slot="${slot.idx}" min="0.50" max="3.50" step="0.05" value="${slot.dur}" style="width: 100%;" title="Hold Duration (seconds)" />
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 7. INTERACTIVE SEQUENCE SCRUBBER -->
        <div style="background: rgba(2,6,23,0.7); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span id="val-jfq-beat-badge" style="font-size: 9.5px; font-weight: 800; color: #38bdf8;">⏱️ BEAT 1: CAMERA FLASH</span>
            <span id="val-jfq-playhead" style="font-family: monospace; font-size: 10px; color: #f8fafc;">0.00s</span>
          </div>
          <input type="range" id="slider-jfq-scrub" min="0" max="6.4" step="0.02" value="0" style="width: 100%;" />
          <div style="display: flex; gap: 8px;">
            <button type="button" id="btn-jfq-toggle-play" class="btn btn-secondary btn-sm" style="flex: 1; font-size: 10px; padding: 6px;">
              ▶ Play Sequence
            </button>
            <button type="button" id="btn-jfq-reset" class="btn btn-secondary btn-sm" style="font-size: 10px; padding: 6px; color: #94a3b8;">
              ↺ Reset
            </button>
          </div>
        </div>

      </div>
    `;

    wireFlashQuadControls(container, tplId);
  };

  function wireFlashQuadControls(container, tplId) {
    if (!container) return;

    function getData() {
      return (typeof window.tplGetContextualData === 'function')
        ? window.tplGetContextualData(tplId)
        : Object.assign({}, DEFAULT_CONFIG);
    }

    function update(patch, reRenderInspector = false) {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, patch);
      }
      const cur = Object.assign({}, DEFAULT_CONFIG, getData(), patch);
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const scrubEl = container.querySelector('#slider-jfq-scrub');
        const tVal = scrubEl ? parseFloat(scrubEl.value) || 0 : 0;
        const st = computeFlashQuadState(cur, tVal, false);
        applyFlashQuadStateToDOM(stage, tplId, st, cur);
      }
      if (reRenderInspector && typeof window.tplRenderContextualInspector === 'function') {
        window.tplRenderContextualInspector(tplId);
      }
    }

    // 0. Layer Stack Handlers
    container.querySelectorAll('.jfq-stack-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('label')) return;
        const lid = row.getAttribute('data-lid');
        const jumpMap = { b1: 0.15, b2: 1.85, b3: 3.15, b4: 4.85 };
        if (jumpMap[lid] !== undefined) {
          const sc = container.querySelector('#slider-jfq-scrub');
          if (sc) sc.value = jumpMap[lid];
        }
        update({ selectedJfqLayer: lid }, true);
      });
    });
    container.querySelectorAll('.jfq-stack-vis').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vk = btn.getAttribute('data-viskey');
        const cur = getData();
        update({ [vk]: cur[vk] === false ? true : false }, true);
      });
    });
    container.querySelector('#jfq-layer-blend-sel')?.addEventListener('change', (e) => {
      const cur = getData();
      const lid = cur.selectedJfqLayer || 'b1';
      const bMap = { bg: 'layer0Blend', b1: 'layer1Blend', b2: 'layer2Blend', b3: 'layer3Blend', b4: 'layer4Blend', fx: 'layer5Blend' };
      if (bMap[lid]) update({ [bMap[lid]]: e.target.value }, true);
    });
    container.querySelector('#jfq-layer-op-inp')?.addEventListener('input', (e) => {
      const cur = getData();
      const lid = cur.selectedJfqLayer || 'b1';
      const oMap = { bg: 'layer0Opacity', b1: 'layer1Opacity', b2: 'layer2Opacity', b3: 'layer3Opacity', b4: 'layer4Opacity', fx: 'layer5Opacity' };
      if (oMap[lid]) update({ [oMap[lid]]: clamp(parseInt(e.target.value, 10) || 0, 0, 100) }, false);
    });
    container.querySelector('#inp-jfq-lscale')?.addEventListener('input', (e) => {
      const cur = getData();
      const lid = cur.selectedJfqLayer || 'b1';
      const sMap = { b1: 'img1Scale', b2: 'img2Scale', b3: 'img3Scale', b4: 'img4Scale' };
      const v = parseFloat(e.target.value) || 1.0;
      const lbl = container.querySelector('#val-jfq-lscale');
      if (lbl) lbl.textContent = v.toFixed(2) + 'x';
      if (sMap[lid]) update({ [sMap[lid]]: v }, false);
    });
    container.querySelector('#inp-jfq-lox')?.addEventListener('input', (e) => {
      const cur = getData();
      const lid = cur.selectedJfqLayer || 'b1';
      const xMap = { b1: 'img1OffsetX', b2: 'img2OffsetX', b3: 'img3OffsetX', b4: 'img4OffsetX' };
      const v = parseInt(e.target.value, 10) || 0;
      const lbl = container.querySelector('#val-jfq-lox');
      if (lbl) lbl.textContent = v + '%';
      if (xMap[lid]) update({ [xMap[lid]]: v }, false);
    });
    container.querySelector('#inp-jfq-loy')?.addEventListener('input', (e) => {
      const cur = getData();
      const lid = cur.selectedJfqLayer || 'b1';
      const yMap = { b1: 'img1OffsetY', b2: 'img2OffsetY', b3: 'img3OffsetY', b4: 'img4OffsetY' };
      const v = parseInt(e.target.value, 10) || 0;
      const lbl = container.querySelector('#val-jfq-loy');
      if (lbl) lbl.textContent = v + '%';
      if (yMap[lid]) update({ [yMap[lid]]: v }, false);
    });

    // 1. Psychological Mood Preset Buttons
    container.querySelectorAll('.jfq-mood-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const moodId = btn.getAttribute('data-mood-id');
        const preset = MOOD_PRESETS[moodId];
        if (preset) {
          update(Object.assign({}, preset.settings), true);
          playPhotographSound(preset.settings.shutterSoundProfile, preset.settings.shutterVolume, preset.settings.shutterPitch);
        }
      });
    });

    // 2. Color Swatches & Picker
    container.querySelectorAll('.jfq-color-swatch').forEach((sw) => {
      sw.addEventListener('click', () => {
        const hex = sw.getAttribute('data-color');
        const picker = container.querySelector('#picker-jfq-flash-color');
        if (picker) picker.value = hex;
        update({ flashColor: hex }, true);
      });
    });
    container.querySelector('#picker-jfq-flash-color')?.addEventListener('input', (e) => {
      update({ flashColor: e.target.value });
    });

    // 3. Audition Shutter Sound Button & Profile Selector
    container.querySelector('#btn-jfq-test-sound')?.addEventListener('click', () => {
      const cur = getData();
      playPhotographSound(cur.shutterSoundProfile || 'slr_35mm', cur.shutterVolume || 85, cur.shutterPitch || 1.0);
    });
    container.querySelector('#sel-jfq-sound-profile')?.addEventListener('change', (e) => {
      const profile = e.target.value;
      update({ shutterSoundProfile: profile });
      const cur = getData();
      playPhotographSound(profile, cur.shutterVolume || 85, cur.shutterPitch || 1.0);
    });

    // 4. Layout Mode Buttons
    container.querySelectorAll('.jfq-layout-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const layout = btn.getAttribute('data-layout');
        update({ layoutStyle: layout }, true);
      });
    });

    // 5. Range Sliders Helper
    const bindSlider = (sel, valSel, key, fmt) => {
      const el = container.querySelector(sel);
      if (!el) return;
      el.addEventListener('input', (e) => {
        const num = parseFloat(e.target.value);
        const label = container.querySelector(valSel);
        if (label && fmt) label.textContent = fmt(num);
        update({ [key]: num });
      });
    };

    bindSlider('#slider-jfq-brilliance', '#val-jfq-brilliance', 'flashBrilliance', v => `${Math.round(v)}%`);
    bindSlider('#slider-jfq-flash-decay', '#val-jfq-flash-decay', 'flashDecayDuration', v => `${v.toFixed(2)}s`);
    bindSlider('#slider-jfq-cone-rad', '#val-jfq-cone-rad', 'flashlightRadius', v => `${Math.round(v)}%`);
    bindSlider('#slider-jfq-predip', '#val-jfq-predip', 'preFlashDip', v => `${Math.round(v)}%`);
    bindSlider('#slider-jfq-afterimage', '#val-jfq-afterimage', 'retinalAfterimage', v => `${Math.round(v)}%`);
    bindSlider('#slider-jfq-sfx-vol', '#val-jfq-sfx-vol', 'shutterVolume', v => `${Math.round(v)}%`);
    bindSlider('#slider-jfq-sfx-pitch', '#val-jfq-sfx-pitch', 'shutterPitch', v => `${v.toFixed(2)}x`);
    bindSlider('#slider-jfq-ltr-speed', '#val-jfq-ltr-speed', 'ltrSpeed', v => `${v.toFixed(2)}s`);
    bindSlider('#slider-jfq-rtl-speed', '#val-jfq-rtl-speed', 'rtlSpeed', v => `${v.toFixed(2)}s`);
    bindSlider('#slider-jfq-overshoot', '#val-jfq-overshoot', 'slideOvershoot', v => `${Math.round(v)}%`);
    bindSlider('#slider-jfq-mblur', '#val-jfq-mblur', 'slideMotionBlur', v => `${Math.round(v)}px`);
    bindSlider('#slider-jfq-border', '#val-jfq-border', 'photoBorderWidth', v => `${Math.round(v)}px`);
    bindSlider('#slider-jfq-sluggish', '#val-jfq-sluggish', 'sluggishness', v => `${Math.round(v * 100)}%`);
    bindSlider('#slider-jfq-emerge-dur', '#val-jfq-emerge-dur', 'centerEmergenceDuration', v => `${v.toFixed(2)}s`);
    bindSlider('#slider-jfq-cscale', '#val-jfq-cscale', 'centerStartScale', v => `${v.toFixed(2)}x`);
    bindSlider('#slider-jfq-cblur', '#val-jfq-cblur', 'centerFocusPullBlur', v => `${Math.round(v)}px`);
    bindSlider('#slider-jfq-cghost', '#val-jfq-cghost', 'centerGhostTrail', v => `${Math.round(v)}%`);
    bindSlider('#slider-jfq-speed-mult', '#val-jfq-speed-mult', 'speedMultiplier', v => `${v.toFixed(2)}x`);

    // 6. Checkboxes
    const bindChk = (sel, key) => {
      container.querySelector(sel)?.addEventListener('change', (e) => {
        update({ [key]: e.target.checked });
      });
    };
    bindChk('#chk-jfq-cone', 'showFlashlightBeamCone');
    bindChk('#chk-jfq-sfx-shutter', 'enableShutterSFX');
    bindChk('#chk-jfq-sfx-whoosh', 'enableSlideWhoosh');
    bindChk('#chk-jfq-sfx-sub', 'enableSubSwell');
    bindChk('#chk-jfq-captions', 'showCaptions');

    // 7. Per-Beat Hold Duration Sliders & Image File Uploads
    container.querySelectorAll('.slider-jfq-beat-dur').forEach((sl) => {
      sl.addEventListener('input', (e) => {
        const slot = e.target.getAttribute('data-slot');
        const val = parseFloat(e.target.value);
        const lbl = container.querySelector(`#val-jfq-b${slot}-dur`);
        if (lbl) lbl.textContent = `${val.toFixed(2)}s`;
        update({ [`beat${slot}Duration`]: val });
      });
    });

    container.querySelectorAll('.inp-jfq-slot-file').forEach((inp) => {
      inp.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        const slot = e.target.getAttribute('data-slot');
        if (file && slot) {
          const url = URL.createObjectURL(file);
          getCachedImage(url);
          update({ [`image${slot}Url`]: url }, true);
        }
      });
    });

    // 8. Scrubber & Play/Pause Preview
    const scrub = container.querySelector('#slider-jfq-scrub');
    const playheadVal = container.querySelector('#val-jfq-playhead');
    const beatBadge = container.querySelector('#val-jfq-beat-badge');
    const playBtn = container.querySelector('#btn-jfq-toggle-play');

    let isPlaying = false;
    let animId = null;
    let playStart = 0;
    let scrubOffset = 0;

    const beatNames = {
      1: '⏱️ BEAT 1: CAMERA FLASH & CONE',
      2: '⏱️ BEAT 2: LEFT → RIGHT ENTRANCE',
      3: '⏱️ BEAT 3: RIGHT → LEFT COUNTER',
      4: '⏱️ BEAT 4: SLUGGISH CENTER EMERGE'
    };

    function renderAtTime(tVal, triggerAudio) {
      if (playheadVal) playheadVal.textContent = `${tVal.toFixed(2)}s`;
      const cur = Object.assign({}, DEFAULT_CONFIG, getData());
      const st = computeFlashQuadState(cur, tVal, triggerAudio);
      if (beatBadge) beatBadge.textContent = beatNames[st.activeBeat] || beatNames[1];
      if (scrub) scrub.max = st.totalCycle.toFixed(2);
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        applyFlashQuadStateToDOM(stage, tplId, st, cur);
      }
    }

    scrub?.addEventListener('input', (e) => {
      if (isPlaying) {
        isPlaying = false;
        if (playBtn) playBtn.textContent = '▶ Play Sequence';
        cancelAnimationFrame(animId);
      }
      scrubOffset = parseFloat(e.target.value) || 0;
      renderAtTime(scrubOffset, false);
    });

    playBtn?.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.textContent = '⏸ Pause';
        lastTriggeredBeat = -1;
        playStart = performance.now() - scrubOffset * 1000;
        const loop = () => {
          if (!isPlaying) return;
          const cur = Object.assign({}, DEFAULT_CONFIG, getData());
          const stTmp = computeFlashQuadState(cur, 0, false);
          const elapsed = ((performance.now() - playStart) / 1000) % stTmp.totalCycle;
          scrubOffset = elapsed;
          if (scrub) scrub.value = elapsed;
          renderAtTime(elapsed, true);
          animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);
      } else {
        playBtn.textContent = '▶ Play Sequence';
        cancelAnimationFrame(animId);
      }
    });

    container.querySelector('#btn-jfq-reset')?.addEventListener('click', () => {
      update(Object.assign({}, DEFAULT_CONFIG), true);
    });
  }

  // Expose configuration & APIs globally
  window.JANI_FLASH_QUAD_CONFIG = DEFAULT_CONFIG;
  window.JANI_FLASH_QUAD_MOODS = MOOD_PRESETS;
  window.computeFlashQuadState = computeFlashQuadState;
  window.buildFlashQuadHtml = buildFlashQuadHtml;

  console.log('[Jani Flash Quad Engine] Initialized 4-Beat Flash, Directional & Sluggish Center Emergence Engine');
})();
