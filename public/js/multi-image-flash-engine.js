/**
 * Multi-Image Flash & Lateral Sequence Engine
 * Template ID: 'multi-image-flash-sequence'
 *
 * Visual & Narrative Choreography:
 * - Clip 0: Realistic Camera Flash Impact (Color temp, brilliance, phosphor decay, halation, micro camera shake, camera shutter SFX)
 * - Clip 1: Lateral Push / Swipe from Left to Right with motion blur
 * - Clip 2: Lateral Push / Swipe from Right to Left with counter-motion blur
 * - Clip 3: Center Core Expansion / Sluggish Bloom (slow organic expansion & dissolve from previous core)
 * - Clip N: Modular extension for 5, 6, 7+ images (alternating lateral sweeps and center blooms)
 *
 * Mood Profiles:
 * - Investigative Exposé (Cold Xenon flash, harsh DSLR, high contrast)
 * - Vintage Archival (Warm Amber flash, 35mm mechanical snap, soft grain)
 * - High-Octane Paparazzi (Rapid strobe flash, triple burst, aggressive whips)
 * - True Crime / Psychological Descent (Desaturated flash, deep subbass bloom, heavy vignette)
 */
(function() {
  'use strict';

  const TEMPLATE_ID = 'multi-image-flash-sequence';

  // Master Default Configurations
  const DEFAULT_CONFIG = {
    // Current Active Mood Preset
    moodPreset: 'investigative', // 'investigative' | 'vintage' | 'paparazzi' | 'truecrime' | 'custom'

    // Flash Optics & Photoflash Controls
    flashBrilliance: 1.8,          // Peak intensity (0.5 to 3.0)
    flashColor: '#d6f0ff',         // Color tint of the flash (#ffffff, cold xenon #d6f0ff, warm amber #ffddaa)
    flashDurationMs: 420,          // Total decay time in milliseconds (150ms to 900ms)
    flashSoundProfile: 'dslr',     // 'dslr' | 'paparazzi' | 'vintage' | 'disposable' | 'procedural'
    flashSoundVolume: 0.9,
    cameraShake: true,             // Physical 1-2 frame micro-shake on flash impact
    cameraShakeIntensity: 8,       // Shake magnitude in px
    halationGlow: true,            // High-exposure edge blooming / optical glow

    // Lateral Push & Transition Dynamics
    slideDuration: 0.55,           // Seconds per transition
    slideEasing: 'cubic-bezier(0.16, 1, 0.3, 1)', // Snappy cinematic out
    motionBlurIntensity: 18,       // Simulated shutter-angle motion blur (0 to 40px)
    enableWhooshSFX: true,

    // Center Core Sluggish Bloom
    sluggishStartScale: 0.28,      // Starting scale from previous center core
    sluggishDuration: 1.45,        // Sluggish expansion duration in seconds
    sluggishEasing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Heavy slow ease
    sluggishSubbassSFX: true,

    // Continuous Motion / Ken Burns
    kenBurnsDrift: true,           // Subtle 1.02x scale drift while resting
    vignetteStrength: 0.65,        // Edge darkening
    filmGrain: 0.15,               // Archival grain texture intensity

    // Total Sequence Duration per slide
    slideHoldDuration: 2.2,        // Time each slide remains focused before next transition

    // Dynamic Image List (Supports N images, user can add/remove/reorder)
    images: [
      {
        id: 'img-1',
        url: 'photocut_scene1.png',
        title: 'Evidence 01: SBF Beanbag Lounge',
        transition: 'flash', // 'flash', 'slide-left-to-right', 'slide-right-to-left', 'center-bloom'
        holdDuration: 2.4
      },
      {
        id: 'img-2',
        url: 'photocut_scene2.png',
        title: 'Evidence 02: Open Floor Exhaustion',
        transition: 'slide-left-to-right',
        holdDuration: 2.2
      },
      {
        id: 'img-3',
        url: 'photocut_scene3.png',
        title: 'Evidence 03: Fetal Sleep Beanbag',
        transition: 'slide-right-to-left',
        holdDuration: 2.2
      },
      {
        id: 'img-4',
        url: 'photocut_scene4.png',
        title: 'Evidence 04: Six-Screen Trading Terminal',
        transition: 'center-bloom',
        holdDuration: 3.0
      }
    ]
  };

  // Stock library presets for quick demo swapping
  const STOCK_LIBRARY = [
    { name: 'SBF Beanbag 1 (Uploaded)', url: 'photocut_scene1.png' },
    { name: 'SBF Blanket 2 (Uploaded)', url: 'photocut_scene2.png' },
    { name: 'SBF Beanbag 3 (Uploaded)', url: 'photocut_scene3.png' },
    { name: 'SBF FTX Screens 4 (Uploaded)', url: 'photocut_scene4.png' },
    { name: 'Corporate Boardroom (Archival)', url: 'photo_doc_boardroom.jpg' },
    { name: 'Office Exhaustion (Documentary)', url: 'photo_doc_exhaustion.jpg' },
    { name: 'Glass HQ Skyline (Corporate)', url: 'photo_doc_headquarters.jpg' },
    { name: 'Trading Bloomberg Terminal (Finance)', url: 'photo_doc_terminal.jpg' }
  ];

  // Mood Presets configurations
  const MOOD_PRESETS = {
    investigative: {
      name: 'Investigative Exposé (Cold Xenon)',
      description: 'High contrast, cold forensic flash, heavy DSLR mirror slap, sharp lateral whips, deliberate terminal zoom.',
      flashColor: '#d6f0ff',
      flashBrilliance: 2.0,
      flashDurationMs: 380,
      flashSoundProfile: 'dslr',
      motionBlurIntensity: 22,
      slideDuration: 0.5,
      sluggishDuration: 1.5,
      vignetteStrength: 0.72,
      filmGrain: 0.12
    },
    vintage: {
      name: 'Vintage Archival (Warm Amber)',
      description: 'Nostalgic 35mm mechanical snap, warm incandescent flash, softer sliding transitions, dreamy organic grain.',
      flashColor: '#ffe5b4',
      flashBrilliance: 1.5,
      flashDurationMs: 520,
      flashSoundProfile: 'vintage',
      motionBlurIntensity: 12,
      slideDuration: 0.75,
      sluggishDuration: 1.8,
      vignetteStrength: 0.55,
      filmGrain: 0.35
    },
    paparazzi: {
      name: 'High-Octane Media Frenzy (Paparazzi Burst)',
      description: 'Rapid multi-strobe flash burst, aggressive lateral swipes, frantic energy and snappy editorial pacing.',
      flashColor: '#ffffff',
      flashBrilliance: 2.5,
      flashDurationMs: 300,
      flashSoundProfile: 'paparazzi',
      motionBlurIntensity: 32,
      slideDuration: 0.38,
      sluggishDuration: 1.1,
      vignetteStrength: 0.8,
      filmGrain: 0.18
    },
    truecrime: {
      name: 'True Crime / Psychological Descent (Desaturated)',
      description: 'Muted desaturated flash, dark hollow disposable snap, deep subbass hum on sluggish center expansion.',
      flashColor: '#9bb0c1',
      flashBrilliance: 1.3,
      flashDurationMs: 650,
      flashSoundProfile: 'disposable',
      motionBlurIntensity: 16,
      slideDuration: 0.85,
      sluggishDuration: 2.2,
      vignetteStrength: 0.88,
      filmGrain: 0.28
    }
  };

  // Runtime State
  let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  let currentAudioContext = null;
  let activeAudioBuffers = {};

  // Audio Preloader
  function getAudioContext() {
    if (!currentAudioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) currentAudioContext = new AudioCtx();
    }
    if (currentAudioContext && currentAudioContext.state === 'suspended') {
      currentAudioContext.resume().catch(() => {});
    }
    return currentAudioContext;
  }

  function playSoundFile(url, volume = 0.9) {
    try {
      const audio = new Audio(url);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch(() => {});
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  function triggerShutterSFX(profile = config.flashSoundProfile, vol = config.flashSoundVolume) {
    const sfxMap = {
      dslr: 'sfx_camera_dslr.wav',
      paparazzi: 'sfx_camera_paparazzi.wav',
      vintage: 'sfx_camera_vintage.wav',
      disposable: 'sfx_camera_disposable.wav'
    };
    const file = sfxMap[profile] || 'sfx_camera_dslr.wav';
    playSoundFile(file, vol);
  }

  function triggerWhooshSFX() {
    if (!config.enableWhooshSFX) return;
    playSoundFile('sfx_whoosh_swipe.wav', 0.6);
  }

  function triggerSubbassSFX() {
    if (!config.sluggishSubbassSFX) return;
    playSoundFile('sfx_subbass_bloom.wav', 0.8);
  }

  // Calculate Cumulative Timings for N images
  function getTimelineStructure(cfg) {
    const images = cfg.images && cfg.images.length ? cfg.images : DEFAULT_CONFIG.images;
    let accumulatedTime = 0;
    const segments = [];

    images.forEach((img, idx) => {
      const hold = typeof img.holdDuration === 'number' ? img.holdDuration : cfg.slideHoldDuration;
      const transDur = idx === 0 ? (cfg.flashDurationMs / 1000) : (img.transition === 'center-bloom' ? cfg.sluggishDuration : cfg.slideDuration);
      
      const startTime = accumulatedTime;
      const endTime = startTime + hold;
      segments.push({
        index: idx,
        image: img,
        startTime: startTime,
        endTime: endTime,
        transDuration: transDur,
        transition: img.transition || (idx === 0 ? 'flash' : (idx % 2 === 1 ? 'slide-left-to-right' : 'slide-right-to-left'))
      });
      accumulatedTime = endTime;
    });

    return {
      totalDuration: Math.max(accumulatedTime, 1.0),
      segments: segments
    };
  }

  // Step Animation Loop Function (called each frame by studio timeline or inspector preview)
  function stepMultiImageFlashAnimation(stage, tplId, localTime, customData) {
    if (!stage) return;
    const cfg = customData || config;
    const { totalDuration, segments } = getTimelineStructure(cfg);

    // Normalize time in loop if scrubbing beyond total
    const t = (localTime % totalDuration + totalDuration) % totalDuration;

    // Find active slide and previous slide
    let activeSegIndex = 0;
    for (let i = 0; i < segments.length; i++) {
      if (t >= segments[i].startTime && t < segments[i].endTime) {
        activeSegIndex = i;
        break;
      }
      if (i === segments.length - 1 && t >= segments[i].startTime) {
        activeSegIndex = i;
      }
    }

    const curSeg = segments[activeSegIndex];
    const prevSeg = activeSegIndex > 0 ? segments[activeSegIndex - 1] : segments[segments.length - 1];
    const segLocalTime = t - curSeg.startTime;
    const transProgress = Math.min(1.0, segLocalTime / Math.max(0.01, curSeg.transDuration));

    // Get stage DOM layers
    const wrapper = stage.querySelector('#multi-flash-wrapper');
    if (!wrapper) return;

    const layersContainer = stage.querySelector('#multi-flash-layers');
    const flashOverlay = stage.querySelector('#multi-flash-lens-flash');
    const grainOverlay = stage.querySelector('#multi-flash-grain');
    const vignetteOverlay = stage.querySelector('#multi-flash-vignette');
    const shakeWrapper = stage.querySelector('#multi-flash-shake-rig');
    const statusHUD = stage.querySelector('#multi-flash-hud-badge');

    // Update vignette & grain styles
    if (vignetteOverlay) {
      vignetteOverlay.style.background = `radial-gradient(circle at center, transparent 40%, rgba(0,0,0,${cfg.vignetteStrength || 0.65}) 100%)`;
    }
    if (grainOverlay) {
      grainOverlay.style.opacity = `${cfg.filmGrain || 0.15}`;
    }

    // Camera Shake on Flash Impact (Clip 0)
    if (curSeg.index === 0 && cfg.cameraShake && segLocalTime < 0.18) {
      const shakeProgress = 1.0 - (segLocalTime / 0.18);
      const mag = (cfg.cameraShakeIntensity || 8) * shakeProgress;
      const sx = (Math.sin(segLocalTime * 95) * mag).toFixed(1);
      const sy = (Math.cos(segLocalTime * 110) * mag).toFixed(1);
      if (shakeWrapper) shakeWrapper.style.transform = `translate(${sx}px, ${sy}px)`;
    } else {
      if (shakeWrapper) shakeWrapper.style.transform = 'translate(0px, 0px)';
    }

    // Update HUD Badge
    if (statusHUD) {
      statusHUD.textContent = `SLIDE ${curSeg.index + 1}/${segments.length}: ${curSeg.transition.toUpperCase()} (T: ${t.toFixed(2)}s)`;
    }

    // Flash Overlay Physics (Only on Clip 0 or when transition is 'flash')
    if (flashOverlay) {
      if (curSeg.transition === 'flash' && segLocalTime < (cfg.flashDurationMs / 1000)) {
        const flashDurSec = cfg.flashDurationMs / 1000;
        const flashProgress = segLocalTime / flashDurSec;
        // Non-linear exponential flash decay: peak instant brightness, fast falloff, subtle warm phosphor tail
        const intensity = Math.pow(1.0 - flashProgress, 2.2) * (cfg.flashBrilliance || 1.8);
        flashOverlay.style.display = 'block';
        flashOverlay.style.opacity = Math.min(1.0, intensity).toFixed(3);
        flashOverlay.style.background = cfg.flashColor || '#d6f0ff';
        flashOverlay.style.boxShadow = cfg.halationGlow ? `inset 0 0 120px 40px ${cfg.flashColor}` : 'none';
      } else {
        flashOverlay.style.opacity = '0';
        flashOverlay.style.display = 'none';
      }
    }

    // Render individual image slides visibility, positions, and sluggish blooms
    const slideEls = layersContainer.querySelectorAll('.multi-flash-slide-item');
    slideEls.forEach((slideEl, idx) => {
      const imgData = cfg.images[idx];
      if (!imgData) {
        slideEl.style.display = 'none';
        return;
      }

      // Continuous subtle Ken Burns slow creep
      const driftScale = cfg.kenBurnsDrift ? (1.0 + (segLocalTime * 0.015)) : 1.0;

      if (idx === curSeg.index) {
        slideEl.style.display = 'block';
        slideEl.style.zIndex = '10';

        if (curSeg.transition === 'flash') {
          // Slide 0: Appears on flash, holds steady with subtle zoom drift
          slideEl.style.transform = `scale(${driftScale.toFixed(4)})`;
          slideEl.style.opacity = '1';
          slideEl.style.filter = 'none';
        } else if (curSeg.transition === 'slide-left-to-right') {
          // Slide 1: Enters from left (-100% -> 0%)
          const eased = easeOutCubic(transProgress);
          const xPercent = ((1.0 - eased) * -100).toFixed(2);
          const blurPx = transProgress < 0.85 ? Math.round((1.0 - transProgress) * (cfg.motionBlurIntensity || 18)) : 0;
          slideEl.style.transform = `translateX(${xPercent}%) scale(${driftScale.toFixed(4)})`;
          slideEl.style.opacity = '1';
          slideEl.style.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
        } else if (curSeg.transition === 'slide-right-to-left') {
          // Slide 2: Enters from right (100% -> 0%)
          const eased = easeOutCubic(transProgress);
          const xPercent = ((1.0 - eased) * 100).toFixed(2);
          const blurPx = transProgress < 0.85 ? Math.round((1.0 - transProgress) * (cfg.motionBlurIntensity || 18)) : 0;
          slideEl.style.transform = `translateX(${xPercent}%) scale(${driftScale.toFixed(4)})`;
          slideEl.style.opacity = '1';
          slideEl.style.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
        } else if (curSeg.transition === 'center-bloom') {
          // Slide 3: Emerges from the center core of previous image with sluggishness
          const startScale = cfg.sluggishStartScale || 0.28;
          const sluggishEased = easeOutSine(transProgress);
          const currentScale = startScale + (1.0 - startScale) * sluggishEased * driftScale;
          const opacity = Math.min(1.0, transProgress * 1.6);
          // Subtle initial focus depth blur that clears as it sluggishly expands
          const depthBlur = transProgress < 0.7 ? Math.round((1.0 - transProgress) * 10) : 0;

          slideEl.style.transform = `scale(${currentScale.toFixed(4)})`;
          slideEl.style.opacity = opacity.toFixed(3);
          slideEl.style.filter = depthBlur > 0 ? `blur(${depthBlur}px)` : 'none';
        }
      } else if (idx === prevSeg.index && transProgress < 1.0) {
        // Previous slide remains under current slide during transition
        slideEl.style.display = 'block';
        slideEl.style.zIndex = '5';
        slideEl.style.transform = 'scale(1)';
        slideEl.style.opacity = '1';
        slideEl.style.filter = 'none';
      } else {
        // Other inactive slides are hidden
        slideEl.style.display = 'none';
        slideEl.style.zIndex = '1';
      }
    });
  }

  // Easing helper functions
  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
  }

  // Stage Mounting Function
  function tplMountMultiImageFlashStage(container, customData) {
    if (!container) return;
    const cfg = customData || config;
    container.innerHTML = '';

    const stageHtml = `
      <div id="multi-flash-wrapper" style="position: absolute; inset: 0; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; user-select: none;">
        <!-- Camera Shake Rig -->
        <div id="multi-flash-shake-rig" style="position: absolute; inset: 0; width: 100%; height: 100%; transition: transform 0.05s ease-out;">
          
          <!-- Image Slides Container -->
          <div id="multi-flash-layers" style="position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden;">
            ${(cfg.images || []).map((img, i) => `
              <div class="multi-flash-slide-item" data-slide-index="${i}" style="position: absolute; inset: 0; width: 100%; height: 100%; display: none; will-change: transform, opacity, filter; transform-origin: center center;">
                <img src="${img.url}" alt="${img.title || ''}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; pointer-events: none;" />
                <!-- Subtle Dark Shadow Framing -->
                <div style="position: absolute; inset: 0; box-shadow: inset 0 0 90px rgba(0,0,0,0.65); pointer-events: none;"></div>
              </div>
            `).join('')}
          </div>

          <!-- Forensic Optical Lens Flash Overlay -->
          <div id="multi-flash-lens-flash" style="position: absolute; inset: 0; background: ${cfg.flashColor || '#d6f0ff'}; opacity: 0; pointer-events: none; z-index: 50; display: none; mix-blend-mode: screen;"></div>

          <!-- Procedural Archival Film Grain -->
          <div id="multi-flash-grain" style="position: absolute; inset: 0; pointer-events: none; z-index: 30; opacity: ${cfg.filmGrain || 0.15}; background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 0); background-size: 4px 4px;"></div>

          <!-- Cinematic Heavy Vignette -->
          <div id="multi-flash-vignette" style="position: absolute; inset: 0; pointer-events: none; z-index: 31; background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,${cfg.vignetteStrength || 0.65}) 100%);"></div>

          <!-- Editorial HUD Badge -->
          <div id="multi-flash-hud-badge" style="position: absolute; bottom: 12px; left: 16px; z-index: 60; font-family: monospace; font-size: 10px; font-weight: 800; color: #38bdf8; background: rgba(3,7,18,0.8); border: 1px solid rgba(56,189,248,0.4); padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; backdrop-filter: blur(8px); pointer-events: none;">
            SLIDE 1/${(cfg.images || []).length}: FLASH
          </div>

        </div>
      </div>
    `;

    container.innerHTML = stageHtml;
  }

  // Contextual Inspector Builder
  function tplBuildMultiImageFlashInspector(container, data) {
    if (!container) return;
    const cur = data || config;

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px; font-family: 'Inter', system-ui, sans-serif; color: #f1f5f9; padding-bottom: 20px;">
        
        <!-- Header Banner & Mood Psychology Selector -->
        <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(15, 23, 42, 0.6)); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 10px; padding: 12px 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #38bdf8; letter-spacing: 0.8px;">
              🎭 Mood & Psychology Presets
            </div>
            <span style="font-size: 9px; background: rgba(56,189,248,0.25); color: #7dd3fc; padding: 2px 6px; border-radius: 3px; font-weight: 700;">1-Click Mood</span>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px;">
            Select the subconscious mood you want viewers to feel. Reconfigures optics, shutter physics, and pacing defaults.
          </div>
          <select id="multi-flash-mood-select" style="width: 100%; background: #0f172a; border: 1px solid #38bdf8; color: #fff; padding: 7px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            <option value="investigative" ${cur.moodPreset === 'investigative' ? 'selected' : ''}>🔍 Investigative Exposé (Cold Xenon, Heavy DSLR, Sharp Lateral Pushes)</option>
            <option value="vintage" ${cur.moodPreset === 'vintage' ? 'selected' : ''}>🎞️ Vintage Archival (Warm Amber, 35mm Shutter, Dreamy Soft Float)</option>
            <option value="paparazzi" ${cur.moodPreset === 'paparazzi' ? 'selected' : ''}>📸 High-Octane Paparazzi (Rapid Burst, High Intensity, Snappy Cuts)</option>
            <option value="truecrime" ${cur.moodPreset === 'truecrime' ? 'selected' : ''}>🩸 True Crime / Psychological Descent (Desaturated, Deep Subbass Bloom)</option>
            <option value="custom" ${cur.moodPreset === 'custom' ? 'selected' : ''}>⚙️ Custom Editor Configuration</option>
          </select>
        </div>

        <!-- Section 1: Camera Flash Optics & Acoustic Profile -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>⚡ Camera Flash Optics & Sound Profile</span>
            <button id="btn-test-flash-shutter" style="background: #0284c7; hover: #0369a1; color: #fff; border: none; border-radius: 4px; padding: 3px 8px; font-size: 9.5px; font-weight: 700; cursor: pointer;">
              🔊 Test Shutter & Flash
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">Flash Shutter Sound</label>
              <select id="inp-flash-sound-profile" style="width: 100%; background: #0b0f19; border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 5px 8px; border-radius: 5px; font-size: 10px;">
                <option value="dslr" ${cur.flashSoundProfile === 'dslr' ? 'selected' : ''}>Heavy DSLR Mirror Slap (Canon/Nikon)</option>
                <option value="paparazzi" ${cur.flashSoundProfile === 'paparazzi' ? 'selected' : ''}>Paparazzi High-Speed Burst + Whine</option>
                <option value="vintage" ${cur.flashSoundProfile === 'vintage' ? 'selected' : ''}>Vintage 35mm Mechanical Leica Snap</option>
                <option value="disposable" ${cur.flashSoundProfile === 'disposable' ? 'selected' : ''}>Disposable Plastic Spring & Pop</option>
              </select>
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">Flash Color Tint</label>
              <div style="display: flex; gap: 6px; align-items: center;">
                <input type="color" id="inp-flash-color" value="${cur.flashColor || '#d6f0ff'}" style="width: 34px; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
                <span id="lbl-flash-color" style="font-size: 10px; font-family: monospace; color: #cbd5e1;">${cur.flashColor || '#d6f0ff'}</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Brilliance / Peak Intensity: <span id="lbl-flash-brilliance" style="color: #38bdf8;">${cur.flashBrilliance || 1.8}x</span>
              </label>
              <input type="range" id="inp-flash-brilliance" min="0.5" max="3.0" step="0.1" value="${cur.flashBrilliance || 1.8}" style="width: 100%; accent-color: #38bdf8;" />
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Flash Decay Time: <span id="lbl-flash-duration" style="color: #38bdf8;">${cur.flashDurationMs || 420}ms</span>
              </label>
              <input type="range" id="inp-flash-duration" min="150" max="900" step="25" value="${cur.flashDurationMs || 420}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>

          <div style="display: flex; gap: 14px; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);">
            <label style="font-size: 10px; color: #cbd5e1; display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <input type="checkbox" id="inp-flash-shake" ${cur.cameraShake !== false ? 'checked' : ''} /> 
              Camera Micro-Shake Impact
            </label>
            <label style="font-size: 10px; color: #cbd5e1; display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <input type="checkbox" id="inp-flash-halation" ${cur.halationGlow !== false ? 'checked' : ''} /> 
              Optic Halation Glow
            </label>
          </div>
        </div>

        <!-- Section 2: Motion Dynamics & Sluggish Center Bloom -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">
            🌊 Lateral Motion & Sluggish Bloom Inertia
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Slide Push Duration: <span id="lbl-slide-dur" style="color: #38bdf8;">${cur.slideDuration || 0.55}s</span>
              </label>
              <input type="range" id="inp-slide-duration" min="0.25" max="1.5" step="0.05" value="${cur.slideDuration || 0.55}" style="width: 100%; accent-color: #38bdf8;" />
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Motion Blur / Shutter Angle: <span id="lbl-slide-blur" style="color: #38bdf8;">${cur.motionBlurIntensity || 18}px</span>
              </label>
              <input type="range" id="inp-slide-blur" min="0" max="40" step="2" value="${cur.motionBlurIntensity || 18}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Sluggish Bloom Duration: <span id="lbl-sluggish-dur" style="color: #38bdf8;">${cur.sluggishDuration || 1.45}s</span>
              </label>
              <input type="range" id="inp-sluggish-duration" min="0.6" max="3.0" step="0.1" value="${cur.sluggishDuration || 1.45}" style="width: 100%; accent-color: #38bdf8;" />
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Center Core Start Scale: <span id="lbl-sluggish-scale" style="color: #38bdf8;">${Math.round((cur.sluggishStartScale || 0.28) * 100)}%</span>
              </label>
              <input type="range" id="inp-sluggish-scale" min="0.1" max="0.6" step="0.02" value="${cur.sluggishStartScale || 0.28}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>

          <div style="display: flex; gap: 14px; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);">
            <label style="font-size: 10px; color: #cbd5e1; display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <input type="checkbox" id="inp-subbass-sfx" ${cur.sluggishSubbassSFX !== false ? 'checked' : ''} /> 
              Sluggish Sub-Bass Bloom SFX
            </label>
            <label style="font-size: 10px; color: #cbd5e1; display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <input type="checkbox" id="inp-kenburns" ${cur.kenBurnsDrift !== false ? 'checked' : ''} /> 
              Continuous Ken Burns Drift
            </label>
          </div>
        </div>

        <!-- Section 3: Modular Multi-Image Storyboard Sequence (Add / Remove / Swap Images) -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 11px; font-weight: 700; color: #f8fafc;">
              🎞️ Modular Storyboard Sequence (${(cur.images || []).length} Clips)
            </div>
            <button id="btn-add-sequence-image" style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #86efac; border-radius: 5px; padding: 4px 10px; font-size: 10px; font-weight: 700; cursor: pointer;">
              + Add Image Slot
            </button>
          </div>
          <div style="font-size: 9.5px; color: #94a3b8; margin-bottom: 10px;">
            You are not limited to 4 images. Add as many images as your edit requires; customize transition types and individual durations per slide.
          </div>

          <!-- Slide Cards List -->
          <div id="multi-flash-slides-container" style="display: flex; flex-direction: column; gap: 8px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
            ${(cur.images || []).map((img, i) => `
              <div class="slide-card-item" data-index="${i}" style="background: #090d16; border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; padding: 8px 10px; display: flex; gap: 10px; align-items: center;">
                <!-- Thumbnail -->
                <div style="position: relative; width: 64px; height: 42px; border-radius: 4px; overflow: hidden; background: #000; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.15);">
                  <img src="${img.url}" style="width: 100%; height: 100%; object-fit: cover;" />
                  <span style="position: absolute; bottom: 1px; left: 2px; font-size: 8px; font-weight: 800; background: rgba(0,0,0,0.7); color: #38bdf8; padding: 1px 3px; border-radius: 2px;">#${i+1}</span>
                </div>

                <!-- Controls -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                    <input type="text" class="inp-slide-title" data-index="${i}" value="${img.title || ('Image ' + (i+1))}" style="background: transparent; border: none; border-bottom: 1px dashed rgba(255,255,255,0.2); color: #fff; font-size: 10px; font-weight: 600; width: 60%; padding: 1px;" />
                    <button class="btn-remove-slide" data-index="${i}" style="background: transparent; border: none; color: #ef4444; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 4px;" title="Remove this slide">✕</button>
                  </div>

                  <div style="display: flex; gap: 6px; align-items: center;">
                    <select class="inp-slide-trans" data-index="${i}" style="background: #0b0f19; border: 1px solid rgba(255,255,255,0.12); color: #93c5fd; font-size: 9.5px; border-radius: 4px; padding: 2px 4px; flex: 1;">
                      <option value="flash" ${img.transition === 'flash' ? 'selected' : ''}>⚡ Forensic Flash</option>
                      <option value="slide-left-to-right" ${img.transition === 'slide-left-to-right' ? 'selected' : ''}>➡️ Left to Right Push</option>
                      <option value="slide-right-to-left" ${img.transition === 'slide-right-to-left' ? 'selected' : ''}>⬅️ Right to Left Push</option>
                      <option value="center-bloom" ${img.transition === 'center-bloom' ? 'selected' : ''}>🎯 Center Core Sluggish Bloom</option>
                    </select>

                    <div style="display: flex; align-items: center; gap: 2px; font-size: 9px; color: #94a3b8;">
                      <input type="number" class="inp-slide-hold" data-index="${i}" step="0.2" min="0.5" max="10" value="${img.holdDuration || 2.2}" style="width: 42px; background: #0b0f19; border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 9.5px; padding: 2px 4px; border-radius: 3px;" />
                      <span>sec</span>
                    </div>
                  </div>

                  <!-- Swap Image / Upload Button -->
                  <div style="display: flex; gap: 4px; margin-top: 2px;">
                    <input type="text" class="inp-slide-url" data-index="${i}" value="${img.url}" placeholder="Image URL / filename" style="flex: 1; background: #0b0f19; border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 9px; padding: 2px 4px; border-radius: 3px;" />
                    <button class="btn-swap-stock" data-index="${i}" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; font-size: 9px; padding: 2px 6px; border-radius: 3px; cursor: pointer;">Stock</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 4: Videographer Finish (Vignette & Film Grain) -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">
            🎥 Cinema Grade & Texture Overlays
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Vignette Strength: <span id="lbl-vignette-str" style="color: #38bdf8;">${Math.round((cur.vignetteStrength || 0.65) * 100)}%</span>
              </label>
              <input type="range" id="inp-vignette-str" min="0" max="1" step="0.05" value="${cur.vignetteStrength || 0.65}" style="width: 100%; accent-color: #38bdf8;" />
            </div>

            <div>
              <label style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 3px;">
                Film Grain Texture: <span id="lbl-grain-str" style="color: #38bdf8;">${Math.round((cur.filmGrain || 0.15) * 100)}%</span>
              </label>
              <input type="range" id="inp-grain-str" min="0" max="0.5" step="0.02" value="${cur.filmGrain || 0.15}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;
    attachInspectorEventListeners(container);
  }

  // Event Listeners for Inspector Inputs
  function attachInspectorEventListeners(container) {
    if (!container) return;

    function notifyUpdate() {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(TEMPLATE_ID, config);
      }
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage && typeof window.tplMountMultiImageFlashStage === 'function') {
        window.tplMountMultiImageFlashStage(stage, config);
      }
    }

    // Mood Selector Listener
    container.querySelector('#multi-flash-mood-select')?.addEventListener('change', (e) => {
      const moodKey = e.target.value;
      config.moodPreset = moodKey;
      if (MOOD_PRESETS[moodKey]) {
        const p = MOOD_PRESETS[moodKey];
        config.flashColor = p.flashColor;
        config.flashBrilliance = p.flashBrilliance;
        config.flashDurationMs = p.flashDurationMs;
        config.flashSoundProfile = p.flashSoundProfile;
        config.motionBlurIntensity = p.motionBlurIntensity;
        config.slideDuration = p.slideDuration;
        config.sluggishDuration = p.sluggishDuration;
        config.vignetteStrength = p.vignetteStrength;
        config.filmGrain = p.filmGrain;
      }
      triggerShutterSFX();
      // Re-render inspector to refresh slider handles
      tplBuildMultiImageFlashInspector(container, config);
      notifyUpdate();
      if (typeof window.showTextTimingAlert === 'function') {
        window.showTextTimingAlert(`🎭 Applied Mood: ${MOOD_PRESETS[moodKey]?.name || 'Custom'}`, 'success');
      }
    });

    // Test Audio Shutter Button
    container.querySelector('#btn-test-flash-shutter')?.addEventListener('click', () => {
      triggerShutterSFX();
      // Trigger momentary flash visual on stage
      const stage = document.getElementById('tpl-modal-preview-stage');
      const flashEl = stage?.querySelector('#multi-flash-lens-flash');
      if (flashEl) {
        flashEl.style.display = 'block';
        flashEl.style.opacity = `${config.flashBrilliance || 1.8}`;
        setTimeout(() => {
          flashEl.style.transition = `opacity ${(config.flashDurationMs || 420)}ms ease-out`;
          flashEl.style.opacity = '0';
          setTimeout(() => {
            flashEl.style.display = 'none';
            flashEl.style.transition = '';
          }, config.flashDurationMs || 420);
        }, 30);
      }
    });

    // Flash Sound Profile
    container.querySelector('#inp-flash-sound-profile')?.addEventListener('change', (e) => {
      config.flashSoundProfile = e.target.value;
      triggerShutterSFX(config.flashSoundProfile);
      notifyUpdate();
    });

    // Flash Color
    container.querySelector('#inp-flash-color')?.addEventListener('input', (e) => {
      config.flashColor = e.target.value;
      const lbl = container.querySelector('#lbl-flash-color');
      if (lbl) lbl.textContent = e.target.value;
      notifyUpdate();
    });

    // Flash Brilliance
    container.querySelector('#inp-flash-brilliance')?.addEventListener('input', (e) => {
      config.flashBrilliance = parseFloat(e.target.value);
      const lbl = container.querySelector('#lbl-flash-brilliance');
      if (lbl) lbl.textContent = `${config.flashBrilliance}x`;
      notifyUpdate();
    });

    // Flash Duration
    container.querySelector('#inp-flash-duration')?.addEventListener('input', (e) => {
      config.flashDurationMs = parseInt(e.target.value);
      const lbl = container.querySelector('#lbl-flash-duration');
      if (lbl) lbl.textContent = `${config.flashDurationMs}ms`;
      notifyUpdate();
    });

    // Flash Shake & Halation
    container.querySelector('#inp-flash-shake')?.addEventListener('change', (e) => {
      config.cameraShake = e.target.checked;
      notifyUpdate();
    });
    container.querySelector('#inp-flash-halation')?.addEventListener('change', (e) => {
      config.halationGlow = e.target.checked;
      notifyUpdate();
    });

    // Slide Duration & Motion Blur
    container.querySelector('#inp-slide-duration')?.addEventListener('input', (e) => {
      config.slideDuration = parseFloat(e.target.value);
      const lbl = container.querySelector('#lbl-slide-dur');
      if (lbl) lbl.textContent = `${config.slideDuration}s`;
      notifyUpdate();
    });
    container.querySelector('#inp-slide-blur')?.addEventListener('input', (e) => {
      config.motionBlurIntensity = parseInt(e.target.value);
      const lbl = container.querySelector('#lbl-slide-blur');
      if (lbl) lbl.textContent = `${config.motionBlurIntensity}px`;
      notifyUpdate();
    });

    // Sluggish Bloom Duration & Scale
    container.querySelector('#inp-sluggish-duration')?.addEventListener('input', (e) => {
      config.sluggishDuration = parseFloat(e.target.value);
      const lbl = container.querySelector('#lbl-sluggish-dur');
      if (lbl) lbl.textContent = `${config.sluggishDuration}s`;
      notifyUpdate();
    });
    container.querySelector('#inp-sluggish-scale')?.addEventListener('input', (e) => {
      config.sluggishStartScale = parseFloat(e.target.value);
      const lbl = container.querySelector('#lbl-sluggish-scale');
      if (lbl) lbl.textContent = `${Math.round(config.sluggishStartScale * 100)}%`;
      notifyUpdate();
    });

    // SFX Toggles
    container.querySelector('#inp-subbass-sfx')?.addEventListener('change', (e) => {
      config.sluggishSubbassSFX = e.target.checked;
      notifyUpdate();
    });
    container.querySelector('#inp-kenburns')?.addEventListener('change', (e) => {
      config.kenBurnsDrift = e.target.checked;
      notifyUpdate();
    });

    // Vignette & Grain
    container.querySelector('#inp-vignette-str')?.addEventListener('input', (e) => {
      config.vignetteStrength = parseFloat(e.target.value);
      const lbl = container.querySelector('#lbl-vignette-str');
      if (lbl) lbl.textContent = `${Math.round(config.vignetteStrength * 100)}%`;
      notifyUpdate();
    });
    container.querySelector('#inp-grain-str')?.addEventListener('input', (e) => {
      config.filmGrain = parseFloat(e.target.value);
      const lbl = container.querySelector('#lbl-grain-str');
      if (lbl) lbl.textContent = `${Math.round(config.filmGrain * 100)}%`;
      notifyUpdate();
    });

    // Add Image Slot Button
    container.querySelector('#btn-add-sequence-image')?.addEventListener('click', () => {
      const nextIdx = config.images.length;
      // Alternate transition naturally
      const transCycle = ['slide-left-to-right', 'slide-right-to-left', 'center-bloom'];
      const chosenTrans = transCycle[(nextIdx - 1) % transCycle.length];
      const stock = STOCK_LIBRARY[nextIdx % STOCK_LIBRARY.length];

      config.images.push({
        id: `img-${Date.now()}`,
        url: stock.url,
        title: `Clip 0${nextIdx + 1}: ${stock.name}`,
        transition: chosenTrans,
        holdDuration: 2.2
      });

      tplBuildMultiImageFlashInspector(container, config);
      notifyUpdate();
      if (typeof window.showTextTimingAlert === 'function') {
        window.showTextTimingAlert(`Added Clip 0${nextIdx + 1} to sequence!`, 'success');
      }
    });

    // Slide Items Listeners (Remove, Change Trans, Change Hold, URL change)
    container.querySelectorAll('.btn-remove-slide').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (config.images.length <= 2) {
          if (typeof window.showTextTimingAlert === 'function') {
            window.showTextTimingAlert('Sequence requires at least 2 images.', 'warning');
          }
          return;
        }
        config.images.splice(idx, 1);
        tplBuildMultiImageFlashInspector(container, config);
        notifyUpdate();
      });
    });

    container.querySelectorAll('.inp-slide-trans').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (config.images[idx]) {
          config.images[idx].transition = e.target.value;
          notifyUpdate();
        }
      });
    });

    container.querySelectorAll('.inp-slide-hold').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (config.images[idx]) {
          config.images[idx].holdDuration = parseFloat(e.target.value) || 2.0;
          notifyUpdate();
        }
      });
    });

    container.querySelectorAll('.inp-slide-title').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (config.images[idx]) {
          config.images[idx].title = e.target.value;
          notifyUpdate();
        }
      });
    });

    container.querySelectorAll('.inp-slide-url').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (config.images[idx]) {
          config.images[idx].url = e.target.value;
          notifyUpdate();
        }
      });
    });

    container.querySelectorAll('.btn-swap-stock').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (config.images[idx]) {
          // Cycle stock image
          const nextStock = STOCK_LIBRARY[(idx + Math.floor(Math.random() * (STOCK_LIBRARY.length - 1)) + 1) % STOCK_LIBRARY.length];
          config.images[idx].url = nextStock.url;
          config.images[idx].title = nextStock.name;
          tplBuildMultiImageFlashInspector(container, config);
          notifyUpdate();
        }
      });
    });
  }

  // Global Exports for Studio Bridge
  window.tplMountMultiImageFlashStage = tplMountMultiImageFlashStage;
  window.stepMultiImageFlashAnimation = stepMultiImageFlashAnimation;
  window.tplBuildMultiImageFlashInspector = tplBuildMultiImageFlashInspector;
  window.getMultiImageFlashDefaultConfig = function() {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  };
  window.triggerMultiImageFlashShutterSFX = triggerShutterSFX;

})();
