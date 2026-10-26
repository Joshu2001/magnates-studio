/**
 * Professional Cinematic Countdown Timer Engine
 * Template ID: 'countdown-timer'
 *
 * Designed for Vox / James Jani / Magnates Media documentary tension building.
 * Features:
 * 1. Fully responsive & massive in fullscreen / theater view (scales with viewport)
 * 2. Real-time timeline synchronization & scrubbing support
 * 3. Multiple dramatic style presets (Crimson Thriller, Cyberpunk HUD, Gold Prestige, Minimal Swiss, Hazard Warning, Matrix Stream)
 * 4. Customizable countdown modes (Big Numeral, T-Minus Monospace, Digital Stopwatch, Listicle Rank)
 * 5. Multi-layer precision HUD dial: circular progress sweep arc, radar reticle ticks, crosshairs, telemetry coordinates
 * 6. Pulse shockwaves on each second tick & chromatic aberration
 * 7. Climax impact state at zero: screen bloom flash, camera recoil shake, custom climax word reveal
 * 8. Integrated Web Audio API tension ticking & sub-bass drop sound engine
 * 9. Comprehensive contextual inspector controls
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'countdown-timer';

  const PRESETS = {
    'crimson': {
      name: 'Crimson Thriller',
      accentColor: '#ef4444',
      glowColor: '#dc2626',
      secondaryColor: '#f87171',
      bgCenter: 'rgba(239, 68, 68, 0.22)',
      bgMid: 'rgba(24, 4, 8, 0.88)',
      bgOuter: '#030104',
      textColor: '#ffffff',
      vignette: 85,
      crt: true,
      particles: true,
      fontFamily: "'Space Grotesk', -apple-system, sans-serif"
    },
    'cyberpunk': {
      name: 'Cyberpunk HUD',
      accentColor: '#06b6d4',
      glowColor: '#0891b2',
      secondaryColor: '#67e8f9',
      bgCenter: 'rgba(6, 182, 212, 0.20)',
      bgMid: 'rgba(3, 18, 29, 0.88)',
      bgOuter: '#01060b',
      textColor: '#e0f2fe',
      vignette: 80,
      crt: true,
      particles: true,
      fontFamily: "'JetBrains Mono', monospace"
    },
    'gold': {
      name: 'Gold Prestige',
      accentColor: '#f59e0b',
      glowColor: '#d97706',
      secondaryColor: '#fde68a',
      bgCenter: 'rgba(245, 158, 11, 0.18)',
      bgMid: 'rgba(22, 15, 4, 0.88)',
      bgOuter: '#050402',
      textColor: '#fef3c7',
      vignette: 75,
      crt: false,
      particles: true,
      fontFamily: "'Cinzel', Georgia, serif"
    },
    'minimal': {
      name: 'Minimal Swiss',
      accentColor: '#ffffff',
      glowColor: '#94a3b8',
      secondaryColor: '#cbd5e1',
      bgCenter: 'rgba(255, 255, 255, 0.10)',
      bgMid: 'rgba(15, 23, 42, 0.85)',
      bgOuter: '#020617',
      textColor: '#ffffff',
      vignette: 60,
      crt: false,
      particles: false,
      fontFamily: "'Inter', -apple-system, sans-serif"
    },
    'hazard': {
      name: 'Hazard Warning',
      accentColor: '#eab308',
      glowColor: '#ca8a04',
      secondaryColor: '#fef08a',
      bgCenter: 'rgba(234, 179, 8, 0.22)',
      bgMid: 'rgba(24, 18, 3, 0.88)',
      bgOuter: '#060501',
      textColor: '#ffffff',
      vignette: 90,
      crt: true,
      particles: true,
      fontFamily: "'Impact', sans-serif"
    },
    'matrix': {
      name: 'Matrix Stream',
      accentColor: '#22c55e',
      glowColor: '#16a34a',
      secondaryColor: '#86efac',
      bgCenter: 'rgba(34, 197, 94, 0.18)',
      bgMid: 'rgba(2, 20, 8, 0.88)',
      bgOuter: '#010803',
      textColor: '#dcfce7',
      vignette: 85,
      crt: true,
      particles: true,
      fontFamily: "'JetBrains Mono', monospace"
    }
  };

  const DEFAULT_CONFIG = {
    preset: 'crimson',
    startNumber: 3,
    totalDuration: 6.0,
    displayMode: 'number',    // 'number' | 'tminus' | 'stopwatch' | 'rank'
    scaleSize: 'massive',     // 'massive' | 'standard' | 'compact'
    
    // Headline text
    title: 'TIME REMAINING',
    subtitle: 'CRITICAL REVEAL AT ZERO',
    climaxText: 'IMPACT',
    showHeadlines: true,

    // Visual attributes
    accentColor: '#ef4444',
    glowColor: '#dc2626',
    secondaryColor: '#f87171',
    vignetteIntensity: 85,
    ringStyle: 'arc',         // 'arc' | 'ticks' | 'dual' | 'sonar'
    ringProgressMode: 'drain',// 'drain' | 'fill'

    // Visual FX toggles
    crtScanlines: true,
    particlesEnabled: true,
    shockwavePulse: true,
    climaxFlash: true,
    chromaticAberration: true,

    // Audio SFX
    audioEnabled: true,
    audioVolume: 0.75,
    audioStyle: 'tension'     // 'tension' | 'heartbeat' | 'radar' | 'muted'
  };

  let activeConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  // Web Audio Context for synthesized sound fx
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTickSound(vol = 0.7, style = 'tension', pitchFactor = 1.0) {
    if (!activeConfig.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      const masterVol = Math.max(0, Math.min(1, vol * (activeConfig.audioVolume || 0.75)));

      if (style === 'heartbeat') {
        // Dual low thud: lub-dub
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(65 * pitchFactor, now);
        osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        g1.gain.setValueAtTime(masterVol * 0.9, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(g1);
        g1.connect(gainNode);
        osc1.start(now);
        osc1.stop(now + 0.13);

        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(55 * pitchFactor, now + 0.16);
        osc2.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        g2.gain.setValueAtTime(0, now);
        g2.gain.setValueAtTime(masterVol * 0.7, now + 0.16);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc2.connect(g2);
        g2.connect(gainNode);
        osc2.start(now + 0.16);
        osc2.stop(now + 0.31);
      } else if (style === 'radar') {
        // High-tech radar blip
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400 * pitchFactor, now);
        osc.frequency.exponentialRampToValueAtTime(800 * pitchFactor, now + 0.08);
        g.gain.setValueAtTime(masterVol * 0.6, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(g);
        g.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.11);
      } else {
        // Tension mechanical clock tick with high-pass transient and metal ring
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950 * pitchFactor, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);
        g.gain.setValueAtTime(masterVol * 0.85, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(g);
        g.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.055);

        // Click noise burst
        const bufferSize = ctx.sampleRate * 0.02;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, now);
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(masterVol * 0.5, now);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        whiteNoise.connect(filter);
        filter.connect(ng);
        ng.connect(gainNode);
        whiteNoise.start(now);
      }
    } catch (e) {}
  }

  function playClimaxSound(vol = 0.9) {
    if (!activeConfig.audioEnabled) return;
    try {
      // Attempt file sound if present
      const snd = new Audio('/sfx_subbass_bloom.wav');
      snd.volume = Math.max(0, Math.min(1, vol * (activeConfig.audioVolume || 0.75)));
      snd.play().catch(() => {});
    } catch (e) {}

    // Synthesized heavy 28Hz sub-bass boom
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.8);
      gain.gain.setValueAtTime(vol * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) {}
  }

  let lastTrackedTick = -1;
  let hasFiredClimax = false;

  /**
   * Mounts the countdown stage into a container element
   */
  function tplMountCountdownTimerStage(container, customData) {
    if (!container) return;
    activeConfig = Object.assign({}, DEFAULT_CONFIG, customData || {});
    lastTrackedTick = -1;
    hasFiredClimax = false;

    const preset = PRESETS[activeConfig.preset] || PRESETS.crimson;
    const accent = activeConfig.accentColor || preset.accentColor;
    const glow = activeConfig.glowColor || preset.glowColor;
    const secondary = activeConfig.secondaryColor || preset.secondaryColor;
    const textCol = activeConfig.textColor || preset.textColor;

    // Scale class based on config
    const scaleClass = activeConfig.scaleSize === 'compact'
      ? 'w-[45vmin] h-[45vmin] max-w-[360px] max-h-[360px]'
      : (activeConfig.scaleSize === 'standard'
          ? 'w-[65vmin] h-[65vmin] max-w-[560px] max-h-[560px]'
          : 'w-[85vmin] h-[85vmin] max-w-[820px] max-h-[820px]');

    container.innerHTML = `
      <div id="cdt-wrapper" class="relative w-full h-full overflow-hidden select-none flex items-center justify-center font-sans" style="background: ${preset.bgOuter};">
        
        <!-- Volumetric Radial Vignette Layer -->
        <div id="cdt-vignette" class="absolute inset-0 pointer-events-none transition-all duration-500" style="background: radial-gradient(circle at center, ${preset.bgCenter} 0%, ${preset.bgMid} 52%, ${preset.bgOuter} 100%); opacity: ${(activeConfig.vignetteIntensity || 85) / 100};"></div>

        <!-- Technical Coordinate Grid -->
        <div id="cdt-grid" class="absolute inset-0 pointer-events-none opacity-20" style="background-image: linear-gradient(to right, ${accent}25 1px, transparent 1px), linear-gradient(to bottom, ${accent}25 1px, transparent 1px); background-size: 48px 48px;"></div>

        <!-- Dynamic Ambient Light Burst Flare -->
        <div id="cdt-flare-burst" class="absolute w-[120vmin] h-[120vmin] rounded-full pointer-events-none opacity-30 blur-3xl transition-opacity duration-300" style="background: radial-gradient(circle, ${accent} 0%, transparent 68%);"></div>

        <!-- Anamorphic Lens Streak -->
        <div id="cdt-flare-streak" class="absolute w-full h-[2px] pointer-events-none opacity-40 blur-[1px]" style="background: linear-gradient(90deg, transparent 5%, ${accent} 50%, transparent 95%); box-shadow: 0 0 16px ${accent};"></div>

        <!-- Subtle CRT Scanlines -->
        <div id="cdt-scanlines" class="absolute inset-0 pointer-events-none ${activeConfig.crtScanlines ? 'block' : 'hidden'}" style="background: repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 3px); opacity: 0.28;"></div>

        <!-- Corner HUD Reticles -->
        <div class="absolute top-4 left-4 sm:top-8 sm:left-8 font-mono text-[9px] sm:text-[11px] font-bold text-white/50 tracking-wider flex items-center gap-2 pointer-events-none">
          <span class="w-1.5 h-1.5 rounded-full" style="background: ${accent}; box-shadow: 0 0 6px ${accent};"></span>
          <span>SYS.LOCK // SEC.REC</span>
        </div>
        <div class="absolute top-4 right-4 sm:top-8 sm:right-8 font-mono text-[9px] sm:text-[11px] font-bold text-white/50 tracking-wider pointer-events-none">
          <span>FPS: 60 // [4K MASTER]</span>
        </div>
        <div class="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 font-mono text-[9px] sm:text-[11px] font-bold text-white/50 tracking-wider pointer-events-none">
          <span>LAT 37.7749° // TIMEOUT</span>
        </div>
        <div class="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 font-mono text-[9px] sm:text-[11px] font-bold text-white/50 tracking-wider pointer-events-none">
          <span id="cdt-hud-telemetry" style="color: ${accent};">STATUS: ARMED</span>
        </div>

        <!-- Top Title Bar -->
        <div id="cdt-header-card" class="absolute top-5 sm:top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-center px-4 py-1.5 rounded-lg backdrop-blur-md border ${activeConfig.showHeadlines ? 'flex' : 'hidden'}" style="background: rgba(0,0,0,0.65); border-color: ${accent}40; box-shadow: 0 4px 20px rgba(0,0,0,0.8);">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full animate-ping" style="background: ${accent};"></span>
            <span id="cdt-title-text" class="text-xs sm:text-sm font-mono font-black tracking-[0.25em] uppercase text-white drop-shadow-md">
              ${activeConfig.title || 'TIME REMAINING'}
            </span>
          </div>
        </div>

        <!-- MAIN RESPONSIVE HUD DIAL -->
        <div id="cdt-dial-container" class="relative ${scaleClass} flex items-center justify-center transition-all duration-300">
          
          <!-- Outer Rotating SVG Radar Ring -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none animate-[spin_120s_linear_infinite]" viewBox="0 0 400 400">
            <!-- Reticle Marks -->
            <circle cx="200" cy="200" r="192" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="2 6" opacity="0.25"/>
            <circle cx="200" cy="200" r="178" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.35"/>
            <circle cx="200" cy="200" r="164" fill="none" stroke="${accent}" stroke-width="0.8" opacity="0.2"/>
            
            <!-- Angle Degree Cardinal Marks -->
            <line x1="200" y1="4" x2="200" y2="18" stroke="${accent}" stroke-width="2.5" opacity="0.8"/>
            <line x1="396" y1="200" x2="382" y2="200" stroke="${accent}" stroke-width="2.5" opacity="0.8"/>
            <line x1="200" y1="396" x2="200" y2="382" stroke="${accent}" stroke-width="2.5" opacity="0.8"/>
            <line x1="4" y1="200" x2="18" y2="200" stroke="${accent}" stroke-width="2.5" opacity="0.8"/>
          </svg>

          <!-- Core Circular Progress Sweep Arc -->
          <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 400 400">
            <!-- Background track -->
            <circle cx="200" cy="200" r="150" fill="none" stroke="${accent}" stroke-width="6" opacity="0.12"/>
            
            <!-- Dynamic Glowing Progress Arc -->
            <circle id="cdt-progress-arc" cx="200" cy="200" r="150" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-dasharray="942.48" stroke-dashoffset="0" style="filter: drop-shadow(0 0 16px ${glow}); transition: stroke-dashoffset 0.08s linear;"/>

            <!-- Secondary Inner Orbital Ring -->
            <circle id="cdt-inner-orbital" cx="200" cy="200" r="132" fill="none" stroke="${secondary}" stroke-width="1.8" stroke-dasharray="14 18" opacity="0.55"/>
          </svg>

          <!-- Expanding Pulsing Shockwave Rings -->
          <div id="cdt-shockwave-ring" class="absolute inset-4 rounded-full pointer-events-none border opacity-0 transition-opacity" style="border-color: ${accent}; box-shadow: 0 0 25px ${accent};"></div>

          <!-- Central Counter Block -->
          <div id="cdt-center-block" class="relative z-10 flex flex-col items-center justify-center text-center px-4">
            
            <!-- Pre-Label or Rank -->
            <div id="cdt-pre-label" class="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase opacity-75 mb-1 sm:mb-2" style="color: ${secondary};">
              T-MINUS
            </div>

            <!-- Massive Main Numeral Display -->
            <div id="cdt-numeral-display" class="font-mono font-black tracking-tight leading-none text-white drop-shadow-[0_0_40px_${accent}cc] select-none" style="font-size: clamp(68px, 18vmin, 220px); font-family: ${preset.fontFamily}; text-shadow: 0 0 50px ${glow};">
              ${activeConfig.startNumber || 3}
            </div>

            <!-- Glowing Underline Accent Bar -->
            <div id="cdt-accent-bar" class="w-24 sm:w-44 h-1.5 rounded-full mx-auto mt-2 sm:mt-4 transition-all duration-300" style="background: linear-gradient(90deg, transparent, ${accent}, transparent); box-shadow: 0 0 14px ${accent};"></div>

            <!-- Subsecond / Unit Label -->
            <div id="cdt-sub-label" class="text-[9px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase mt-2 opacity-85" style="color: ${secondary};">
              SECONDS
            </div>

          </div>

          <!-- Reticle Corner Accents -->
          <div class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 pointer-events-none" style="border-color: ${accent};"></div>
          <div class="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 pointer-events-none" style="border-color: ${accent};"></div>
          <div class="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 pointer-events-none" style="border-color: ${accent};"></div>
          <div class="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 pointer-events-none" style="border-color: ${accent};"></div>
        </div>

        <!-- Bottom Subtitle Card -->
        <div id="cdt-footer-card" class="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 text-center px-5 py-1.5 rounded-lg backdrop-blur-md border ${activeConfig.showHeadlines ? 'block' : 'hidden'}" style="background: rgba(0,0,0,0.65); border-color: ${accent}40; box-shadow: 0 4px 20px rgba(0,0,0,0.8);">
          <span id="cdt-subtitle-text" class="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] uppercase text-white drop-shadow-md">
            &lt; ${activeConfig.subtitle || 'CRITICAL REVEAL AT ZERO'} &gt;
          </span>
        </div>

        <!-- Climax Flash Screen Bloom Overlay -->
        <div id="cdt-climax-flash" class="absolute inset-0 bg-white pointer-events-none opacity-0 z-50 transition-opacity duration-150"></div>

      </div>
    `;
  }

  /**
   * Main real-time stepping function called by timeline playback and scrubbing
   */
  function stepCountdownTimerAnimation(stage, tplId, localTime, customData) {
    if (!stage) return;
    const cfg = customData || activeConfig || DEFAULT_CONFIG;
    const totalDuration = cfg.totalDuration || 6.0;
    const startNumber = cfg.startNumber !== undefined ? cfg.startNumber : 3;

    // Normalizing loop time
    const t = Math.max(0, localTime % (totalDuration + 0.001));
    const progress = Math.min(1.0, Math.max(0.0, t / totalDuration));
    const remainingTime = Math.max(0, totalDuration - t);

    // Dynamic Elements
    const wrapper = stage.querySelector('#cdt-wrapper');
    const arcEl = stage.querySelector('#cdt-progress-arc');
    const innerOrbital = stage.querySelector('#cdt-inner-orbital');
    const numDisplay = stage.querySelector('#cdt-numeral-display');
    const preLabel = stage.querySelector('#cdt-pre-label');
    const subLabel = stage.querySelector('#cdt-sub-label');
    const shockwave = stage.querySelector('#cdt-shockwave-ring');
    const climaxFlash = stage.querySelector('#cdt-climax-flash');
    const telemetry = stage.querySelector('#cdt-hud-telemetry');
    const flareBurst = stage.querySelector('#cdt-flare-burst');
    const dialContainer = stage.querySelector('#cdt-dial-container');

    if (!numDisplay) return;

    // Preset styling
    const preset = PRESETS[cfg.preset] || PRESETS.crimson;
    const accent = cfg.accentColor || preset.accentColor;
    const glow = cfg.glowColor || preset.glowColor;

    // Calculate current number in sequence
    // When progress goes from 0 to 1, number counts down from startNumber to 0
    const rawVal = startNumber * (1 - progress);
    const intCount = Math.max(0, Math.ceil(rawVal));

    // Progress Arc Sweep (circumference = 2 * PI * 150 = 942.48)
    const circ = 942.48;
    if (arcEl) {
      if (cfg.ringProgressMode === 'fill') {
        arcEl.style.strokeDashoffset = `${circ * (1 - progress)}`;
      } else {
        arcEl.style.strokeDashoffset = `${circ * progress}`;
      }
    }

    if (innerOrbital) {
      innerOrbital.style.transform = `rotate(${progress * 720}deg)`;
      innerOrbital.style.transformOrigin = '200px 200px';
    }

    // CHECK FOR INTEGER SECOND TICK (Audio & Shockwave)
    if (intCount !== lastTrackedTick && intCount > 0) {
      lastTrackedTick = intCount;
      const pitchRamp = 1.0 + (1 - (intCount / startNumber)) * 0.45;
      playTickSound(0.75, cfg.audioStyle || 'tension', pitchRamp);

      // Trigger Shockwave Pulse
      if (shockwave && cfg.shockwavePulse) {
        shockwave.style.transition = 'none';
        shockwave.style.transform = 'scale(0.85)';
        shockwave.style.opacity = '0.9';
        setTimeout(() => {
          shockwave.style.transition = 'transform 0.65s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.65s ease-out';
          shockwave.style.transform = 'scale(1.45)';
          shockwave.style.opacity = '0';
        }, 16);
      }

      // Pop Bounce on Numeral Display
      numDisplay.style.transition = 'none';
      numDisplay.style.transform = 'scale(1.18)';
      setTimeout(() => {
        numDisplay.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        numDisplay.style.transform = 'scale(1.0)';
      }, 20);
    }

    // FORMATTING NUMERAL BASED ON DISPLAY MODE
    const isAtZero = (progress >= 0.985 || remainingTime <= 0.08);

    if (isAtZero) {
      // CLIMAX IMPACT STATE
      const climaxWord = cfg.climaxText || 'IMPACT';
      numDisplay.textContent = climaxWord;
      numDisplay.style.fontSize = `clamp(48px, 14vmin, 160px)`;
      numDisplay.style.color = '#ffffff';
      numDisplay.style.textShadow = `0 0 60px ${accent}, 0 0 100px ${accent}`;
      if (preLabel) preLabel.textContent = 'SEQUENCE COMPLETE';
      if (subLabel) subLabel.textContent = 'TARGET ACHIEVED';
      if (telemetry) telemetry.textContent = 'STATUS: DETONATED // ZERO';

      if (!hasFiredClimax) {
        hasFiredClimax = true;
        playClimaxSound(0.9);

        // Flash burst
        if (climaxFlash && cfg.climaxFlash) {
          climaxFlash.style.transition = 'none';
          climaxFlash.style.opacity = '0.9';
          setTimeout(() => {
            climaxFlash.style.transition = 'opacity 0.6s ease-out';
            climaxFlash.style.opacity = '0';
          }, 40);
        }

        // Camera impact recoil shake
        if (dialContainer && cfg.climaxFlash) {
          dialContainer.style.transform = 'scale(1.06) translate(4px, -3px)';
          setTimeout(() => {
            dialContainer.style.transform = 'scale(1.0) translate(0px, 0px)';
          }, 300);
        }
      }

    } else {
      // RUNNING COUNTDOWN STATE
      hasFiredClimax = false;

      if (cfg.displayMode === 'tminus') {
        // [ T-MINUS 00:03.42 ]
        const sec = Math.floor(remainingTime);
        const centi = Math.floor((remainingTime % 1) * 100);
        numDisplay.textContent = `00:${sec < 10 ? '0' + sec : sec}.${centi < 10 ? '0' + centi : centi}`;
        numDisplay.style.fontSize = `clamp(34px, 9vmin, 110px)`;
        if (preLabel) preLabel.textContent = '[ T-MINUS CLOCK ]';
        if (subLabel) subLabel.textContent = 'LIVE TELEMETRY STREAM';
      } else if (cfg.displayMode === 'stopwatch') {
        // 00:03:42
        const min = Math.floor(remainingTime / 60);
        const sec = Math.floor(remainingTime % 60);
        const centi = Math.floor((remainingTime % 1) * 100);
        numDisplay.textContent = `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}:${centi < 10 ? '0' + centi : centi}`;
        numDisplay.style.fontSize = `clamp(36px, 9.5vmin, 120px)`;
        if (preLabel) preLabel.textContent = 'PRECISION STOPWATCH';
        if (subLabel) subLabel.textContent = 'HOURS : MINS : SECS';
      } else if (cfg.displayMode === 'rank') {
        // # 3 OF 10
        numDisplay.textContent = `#${intCount}`;
        numDisplay.style.fontSize = `clamp(64px, 18vmin, 200px)`;
        if (preLabel) preLabel.textContent = 'COUNTDOWN RANK';
        if (subLabel) subLabel.textContent = `OF ${startNumber}`;
      } else {
        // Big Cinematic Number (3, 2, 1)
        numDisplay.textContent = intCount;
        numDisplay.style.fontSize = `clamp(68px, 18vmin, 220px)`;
        if (preLabel) preLabel.textContent = 'T-MINUS';
        if (subLabel) subLabel.textContent = 'SECONDS';
      }

      if (telemetry) {
        telemetry.textContent = `STATUS: ARMED // ${remainingTime.toFixed(2)}s REMAINING`;
      }
    }

    // Flare breath pulse
    if (flareBurst) {
      const breath = 0.25 + Math.sin(t * 4.5) * 0.12;
      flareBurst.style.opacity = `${breath}`;
    }
  }

  /**
   * Builds the Contextual Customizer Inspector Panel for Countdown Timer
   */
  function tplBuildCountdownTimerInspector(container, data) {
    if (!container) return;
    const cfg = Object.assign({}, DEFAULT_CONFIG, data || {});
    activeConfig = cfg;

    container.innerHTML = `
      <div class="flex flex-col gap-5 p-4 text-xs font-sans text-slate-200">
        
        <!-- HEADER BADGE -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span class="font-bold text-sm text-white tracking-wide uppercase">Countdown Timer HUD</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/40">PRO ENGINE</span>
        </div>

        <!-- STYLE PRESETS -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Cinematic Style Presets</label>
          <div class="grid grid-cols-3 gap-2" id="cdt-preset-grid">
            ${Object.keys(PRESETS).map(key => {
              const p = PRESETS[key];
              const isAct = cfg.preset === key;
              return `
                <button type="button" class="cdt-preset-btn p-2 rounded-lg border text-left transition-all flex flex-col gap-1 ${isAct ? 'border-red-500 bg-red-500/20 text-white shadow-lg' : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20'}" data-preset="${key}">
                  <div class="w-full h-2 rounded-full" style="background: ${p.accentColor}; box-shadow: 0 0 6px ${p.accentColor};"></div>
                  <span class="text-[10px] font-bold truncate">${p.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- COUNTDOWN CONFIGURATION -->
        <div class="bg-slate-900/70 p-3.5 rounded-xl border border-white/10 flex flex-col gap-3">
          <div class="text-[11px] font-bold text-white uppercase tracking-wider">Timer Configuration</div>
          
          <!-- Start Number -->
          <div>
            <div class="flex justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Start Number</span>
              <span id="cdt-val-startnum" class="font-mono text-white font-bold">${cfg.startNumber}</span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${[3, 5, 10, 20].map(n => `
                <button type="button" class="cdt-startnum-btn py-1.5 rounded-md font-mono font-bold text-center border transition-all ${cfg.startNumber === n ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'}" data-num="${n}">${n}</button>
              `).join('')}
            </div>
          </div>

          <!-- Total Duration -->
          <div>
            <div class="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Total Duration</span>
              <span id="cdt-val-duration" class="font-mono text-red-400 font-bold">${cfg.totalDuration}s</span>
            </div>
            <input type="range" id="cdt-rng-duration" min="2" max="30" step="0.5" value="${cfg.totalDuration}" class="w-full accent-red-500 cursor-pointer">
          </div>

          <!-- Display Mode -->
          <div>
            <label class="block text-[11px] text-slate-400 mb-1.5">Display Mode</label>
            <div class="grid grid-cols-2 gap-1.5">
              <button type="button" class="cdt-mode-btn py-1.5 px-2 rounded-md font-bold text-[10px] border transition-all ${cfg.displayMode === 'number' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-mode="number">Big Numeral (3, 2, 1)</button>
              <button type="button" class="cdt-mode-btn py-1.5 px-2 rounded-md font-bold text-[10px] border transition-all ${cfg.displayMode === 'tminus' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-mode="tminus">T-Minus Monospace</button>
              <button type="button" class="cdt-mode-btn py-1.5 px-2 rounded-md font-bold text-[10px] border transition-all ${cfg.displayMode === 'stopwatch' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-mode="stopwatch">Digital Stopwatch</button>
              <button type="button" class="cdt-mode-btn py-1.5 px-2 rounded-md font-bold text-[10px] border transition-all ${cfg.displayMode === 'rank' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-mode="rank">Top 10 List Rank</button>
            </div>
          </div>

          <!-- Scale Size (Fixes Fullscreen small dial issue!) -->
          <div>
            <label class="block text-[11px] text-slate-400 mb-1.5">Display Scale (Fullscreen Presence)</label>
            <div class="grid grid-cols-3 gap-1.5">
              <button type="button" class="cdt-scale-btn py-1.5 px-2 rounded-md font-bold text-[10px] border transition-all ${cfg.scaleSize === 'massive' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-scale="massive">Massive (85%)</button>
              <button type="button" class="cdt-scale-btn py-1.5 px-2 rounded-md font-bold text-[10px] border transition-all ${cfg.scaleSize === 'standard' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-scale="standard">Standard (65%)</button>
              <button type="button" class="cdt-scale-btn py-1.5 px-2 rounded-md font-bold text-[10px] border transition-all ${cfg.scaleSize === 'compact' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-scale="compact">Compact (45%)</button>
            </div>
          </div>

        </div>

        <!-- NARRATIVE TEXT & CLIMAX -->
        <div class="bg-slate-900/70 p-3.5 rounded-xl border border-white/10 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-white uppercase tracking-wider">Titles & Climax Word</span>
            <label class="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
              <input type="checkbox" id="cdt-chk-headlines" ${cfg.showHeadlines ? 'checked' : ''} class="accent-red-500">
              <span>Show HUD Cards</span>
            </label>
          </div>

          <div>
            <label class="block text-[10px] text-slate-400 mb-1">Header Title</label>
            <input type="text" id="cdt-inp-title" value="${cfg.title || 'TIME REMAINING'}" class="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500">
          </div>

          <div>
            <label class="block text-[10px] text-slate-400 mb-1">Subtitle Status</label>
            <input type="text" id="cdt-inp-subtitle" value="${cfg.subtitle || 'CRITICAL REVEAL AT ZERO'}" class="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500">
          </div>

          <div>
            <label class="block text-[10px] text-slate-400 mb-1">Climax Reveal Word (At Zero)</label>
            <input type="text" id="cdt-inp-climax" value="${cfg.climaxText || 'IMPACT'}" class="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-red-400 font-bold focus:outline-none focus:border-red-500">
          </div>
        </div>

        <!-- VISUAL EFFECTS & STYLING -->
        <div class="bg-slate-900/70 p-3.5 rounded-xl border border-white/10 flex flex-col gap-3">
          <div class="text-[11px] font-bold text-white uppercase tracking-wider">Visual FX & Atmosphere</div>

          <!-- Color Customizer -->
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-400">Accent Glow Color</span>
            <div class="flex items-center gap-2">
              <input type="color" id="cdt-inp-color" value="${cfg.accentColor}" class="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer">
              <span id="cdt-lbl-color" class="font-mono text-[10px] text-slate-300">${cfg.accentColor}</span>
            </div>
          </div>

          <!-- Vignette Slider -->
          <div>
            <div class="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Dark Vignette Intensity</span>
              <span id="cdt-val-vignette" class="font-mono text-white">${cfg.vignetteIntensity}%</span>
            </div>
            <input type="range" id="cdt-rng-vignette" min="0" max="100" value="${cfg.vignetteIntensity}" class="w-full accent-red-500 cursor-pointer">
          </div>

          <!-- Checkboxes -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <label class="flex items-center gap-2 cursor-pointer text-[10.5px] text-slate-300">
              <input type="checkbox" id="cdt-chk-crt" ${cfg.crtScanlines ? 'checked' : ''} class="accent-red-500">
              <span>CRT Scanlines</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-[10.5px] text-slate-300">
              <input type="checkbox" id="cdt-chk-shockwave" ${cfg.shockwavePulse ? 'checked' : ''} class="accent-red-500">
              <span>Tick Shockwave</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-[10.5px] text-slate-300">
              <input type="checkbox" id="cdt-chk-climaxflash" ${cfg.climaxFlash ? 'checked' : ''} class="accent-red-500">
              <span>Climax Screen Shake</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-[10.5px] text-slate-300">
              <input type="checkbox" id="cdt-chk-progressmode" ${cfg.ringProgressMode === 'drain' ? 'checked' : ''} class="accent-red-500">
              <span>Drain Arc Ring</span>
            </label>
          </div>
        </div>

        <!-- AUDIO TENSION ENGINE -->
        <div class="bg-slate-900/70 p-3.5 rounded-xl border border-white/10 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm">🔊</span>
              <span class="text-[11px] font-bold text-white uppercase tracking-wider">Audio Tension Engine</span>
            </div>
            <label class="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
              <input type="checkbox" id="cdt-chk-audio" ${cfg.audioEnabled ? 'checked' : ''} class="accent-red-500">
              <span>Audio On</span>
            </label>
          </div>

          <!-- Audio Style -->
          <div>
            <label class="block text-[10px] text-slate-400 mb-1">Sound Style</label>
            <div class="grid grid-cols-3 gap-1.5">
              <button type="button" class="cdt-audio-btn py-1 px-1.5 rounded text-[10px] font-bold border transition-all ${cfg.audioStyle === 'tension' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-sound="tension">Clock Tick</button>
              <button type="button" class="cdt-audio-btn py-1 px-1.5 rounded text-[10px] font-bold border transition-all ${cfg.audioStyle === 'heartbeat' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-sound="heartbeat">Heartbeat</button>
              <button type="button" class="cdt-audio-btn py-1 px-1.5 rounded text-[10px] font-bold border transition-all ${cfg.audioStyle === 'radar' ? 'border-red-500 bg-red-500/25 text-white' : 'border-white/10 bg-black/40 text-slate-400'}" data-sound="radar">Radar Ping</button>
            </div>
          </div>

          <!-- Audio Volume -->
          <div>
            <div class="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>SFX Volume</span>
              <span id="cdt-val-volume" class="font-mono text-white">${Math.round((cfg.audioVolume || 0.75) * 100)}%</span>
            </div>
            <input type="range" id="cdt-rng-volume" min="0" max="1" step="0.05" value="${cfg.audioVolume || 0.75}" class="w-full accent-red-500 cursor-pointer">
          </div>

          <!-- Test Audio Button -->
          <button type="button" id="cdt-btn-test-sound" class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-white font-mono font-bold text-[11px] flex items-center justify-center gap-2 transition-colors">
            <span>⚡</span> Test Audio Impact Now
          </button>
        </div>

      </div>
    `;

    attachInspectorEvents(container);
  }

  function attachInspectorEvents(container) {
    function notifyUpdate() {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(TEMPLATE_ID, activeConfig);
      }
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage && typeof window.tplMountCountdownTimerStage === 'function') {
        window.tplMountCountdownTimerStage(stage, activeConfig);
      }
    }

    // Presets
    container.querySelectorAll('.cdt-preset-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.cdt-preset-btn').forEach(b => {
          b.classList.remove('border-red-500', 'bg-red-500/20', 'text-white', 'shadow-lg');
          b.classList.add('border-white/10', 'bg-slate-900/60', 'text-slate-300');
        });
        btn.classList.add('border-red-500', 'bg-red-500/20', 'text-white', 'shadow-lg');
        btn.classList.remove('border-white/10', 'bg-slate-900/60', 'text-slate-300');

        const key = btn.dataset.preset;
        const p = PRESETS[key];
        if (p) {
          activeConfig.preset = key;
          activeConfig.accentColor = p.accentColor;
          activeConfig.glowColor = p.glowColor;
          activeConfig.secondaryColor = p.secondaryColor;
          activeConfig.vignetteIntensity = p.vignette;
          activeConfig.crtScanlines = p.crt;

          const colInp = container.querySelector('#cdt-inp-color');
          const colLbl = container.querySelector('#cdt-lbl-color');
          const crtChk = container.querySelector('#cdt-chk-crt');
          const vigRng = container.querySelector('#cdt-rng-vignette');
          const vigVal = container.querySelector('#cdt-val-vignette');

          if (colInp) colInp.value = p.accentColor;
          if (colLbl) colLbl.textContent = p.accentColor;
          if (crtChk) crtChk.checked = p.crt;
          if (vigRng) vigRng.value = p.vignette;
          if (vigVal) vigVal.textContent = `${p.vignette}%`;

          playTickSound(0.8, activeConfig.audioStyle);
          notifyUpdate();
        }
      };
    });

    // Start number buttons
    container.querySelectorAll('.cdt-startnum-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.cdt-startnum-btn').forEach(b => {
          b.classList.remove('border-red-500', 'bg-red-500/25', 'text-white');
          b.classList.add('border-white/10', 'bg-black/40', 'text-slate-400');
        });
        btn.classList.add('border-red-500', 'bg-red-500/25', 'text-white');
        btn.classList.remove('border-white/10', 'bg-black/40', 'text-slate-400');

        const n = parseInt(btn.dataset.num, 10);
        activeConfig.startNumber = n;
        const lbl = container.querySelector('#cdt-val-startnum');
        if (lbl) lbl.textContent = n;
        playTickSound(0.7, activeConfig.audioStyle);
        notifyUpdate();
      };
    });

    // Duration slider
    const rngDur = container.querySelector('#cdt-rng-duration');
    const valDur = container.querySelector('#cdt-val-duration');
    if (rngDur) {
      rngDur.oninput = (e) => {
        const val = parseFloat(e.target.value);
        activeConfig.totalDuration = val;
        if (valDur) valDur.textContent = `${val}s`;
        notifyUpdate();
      };
    }

    // Display mode buttons
    container.querySelectorAll('.cdt-mode-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.cdt-mode-btn').forEach(b => {
          b.classList.remove('border-red-500', 'bg-red-500/25', 'text-white');
          b.classList.add('border-white/10', 'bg-black/40', 'text-slate-400');
        });
        btn.classList.add('border-red-500', 'bg-red-500/25', 'text-white');
        btn.classList.remove('border-white/10', 'bg-black/40', 'text-slate-400');

        activeConfig.displayMode = btn.dataset.mode;
        playTickSound(0.7, activeConfig.audioStyle);
        notifyUpdate();
      };
    });

    // Scale buttons
    container.querySelectorAll('.cdt-scale-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.cdt-scale-btn').forEach(b => {
          b.classList.remove('border-red-500', 'bg-red-500/25', 'text-white');
          b.classList.add('border-white/10', 'bg-black/40', 'text-slate-400');
        });
        btn.classList.add('border-red-500', 'bg-red-500/25', 'text-white');
        btn.classList.remove('border-white/10', 'bg-black/40', 'text-slate-400');

        activeConfig.scaleSize = btn.dataset.scale;
        playTickSound(0.7, activeConfig.audioStyle);
        notifyUpdate();
      };
    });

    // Text inputs
    const inpTitle = container.querySelector('#cdt-inp-title');
    if (inpTitle) {
      inpTitle.oninput = (e) => {
        activeConfig.title = e.target.value;
        const tEl = document.getElementById('cdt-title-text');
        if (tEl) tEl.textContent = e.target.value;
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const inpSub = container.querySelector('#cdt-inp-subtitle');
    if (inpSub) {
      inpSub.oninput = (e) => {
        activeConfig.subtitle = e.target.value;
        const sEl = document.getElementById('cdt-subtitle-text');
        if (sEl) sEl.textContent = `< ${e.target.value} >`;
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const inpClimax = container.querySelector('#cdt-inp-climax');
    if (inpClimax) {
      inpClimax.oninput = (e) => {
        activeConfig.climaxText = e.target.value;
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const chkHeadlines = container.querySelector('#cdt-chk-headlines');
    if (chkHeadlines) {
      chkHeadlines.onchange = (e) => {
        activeConfig.showHeadlines = e.target.checked;
        notifyUpdate();
      };
    }

    // Visual styles
    const inpColor = container.querySelector('#cdt-inp-color');
    const lblColor = container.querySelector('#cdt-lbl-color');
    if (inpColor) {
      inpColor.oninput = (e) => {
        activeConfig.accentColor = e.target.value;
        activeConfig.glowColor = e.target.value;
        if (lblColor) lblColor.textContent = e.target.value;
        notifyUpdate();
      };
    }

    const rngVig = container.querySelector('#cdt-rng-vignette');
    const valVig = container.querySelector('#cdt-val-vignette');
    if (rngVig) {
      rngVig.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        activeConfig.vignetteIntensity = val;
        if (valVig) valVig.textContent = `${val}%`;
        const vEl = document.getElementById('cdt-vignette');
        if (vEl) vEl.style.opacity = `${val / 100}`;
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const chkCrt = container.querySelector('#cdt-chk-crt');
    if (chkCrt) {
      chkCrt.onchange = (e) => {
        activeConfig.crtScanlines = e.target.checked;
        const sEl = document.getElementById('cdt-scanlines');
        if (sEl) sEl.className = e.target.checked ? 'absolute inset-0 pointer-events-none block' : 'absolute inset-0 pointer-events-none hidden';
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const chkShock = container.querySelector('#cdt-chk-shockwave');
    if (chkShock) {
      chkShock.onchange = (e) => {
        activeConfig.shockwavePulse = e.target.checked;
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const chkFlash = container.querySelector('#cdt-chk-climaxflash');
    if (chkFlash) {
      chkFlash.onchange = (e) => {
        activeConfig.climaxFlash = e.target.checked;
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const chkProg = container.querySelector('#cdt-chk-progressmode');
    if (chkProg) {
      chkProg.onchange = (e) => {
        activeConfig.ringProgressMode = e.target.checked ? 'drain' : 'fill';
        notifyUpdate();
      };
    }

    // Audio controls
    const chkAudio = container.querySelector('#cdt-chk-audio');
    if (chkAudio) {
      chkAudio.onchange = (e) => {
        activeConfig.audioEnabled = e.target.checked;
        if (e.target.checked) playTickSound(0.8, activeConfig.audioStyle);
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    container.querySelectorAll('.cdt-audio-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.cdt-audio-btn').forEach(b => {
          b.classList.remove('border-red-500', 'bg-red-500/25', 'text-white');
          b.classList.add('border-white/10', 'bg-black/40', 'text-slate-400');
        });
        btn.classList.add('border-red-500', 'bg-red-500/25', 'text-white');
        btn.classList.remove('border-white/10', 'bg-black/40', 'text-slate-400');

        activeConfig.audioStyle = btn.dataset.sound;
        playTickSound(0.9, activeConfig.audioStyle);
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    });

    const rngVol = container.querySelector('#cdt-rng-volume');
    const valVol = container.querySelector('#cdt-val-volume');
    if (rngVol) {
      rngVol.oninput = (e) => {
        const val = parseFloat(e.target.value);
        activeConfig.audioVolume = val;
        if (valVol) valVol.textContent = `${Math.round(val * 100)}%`;
        if (typeof window.tplSetContextualData === 'function') {
          window.tplSetContextualData(TEMPLATE_ID, activeConfig);
        }
      };
    }

    const btnTest = container.querySelector('#cdt-btn-test-sound');
    if (btnTest) {
      btnTest.onclick = () => {
        playTickSound(0.9, activeConfig.audioStyle);
        setTimeout(() => playClimaxSound(1.0), 300);
      };
    }
  }

  // Global window registration
  window.tplMountCountdownTimerStage = tplMountCountdownTimerStage;
  window.stepCountdownTimerAnimation = stepCountdownTimerAnimation;
  window.tplBuildCountdownTimerInspector = tplBuildCountdownTimerInspector;
  window.getCountdownTimerDefaultConfig = function() {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  };

})();
