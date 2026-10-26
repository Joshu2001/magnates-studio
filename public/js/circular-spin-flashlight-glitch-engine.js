/**
 * Circular Arc Spin & Paparazzi Flashlight Glitch Transition Engine
 * Template ID: 'circular-spin-flashlight-glitch'
 *
 * Visual & Narrative Choreography:
 * 1. Image 1 (Generated Person 1) initiates circular arc spin from left, arching up over head to right.
 * 2. Atmospheric falling particles drift downwards continuously across the scene.
 * 3. While spinning, a 4-flash photoflash sequence fires:
 *    - Flash 1: Slow, powerful camera strobe with high phosphor bloom & decay
 *    - Flash 2, 3, 4: Rapid-fire paparazzi burst (three fast strobes in rapid succession)
 * 4. High-frequency digital glitch & chromatic displacement peak transition.
 * 5. Cut and reveal to Image 2 (Generated Person 2) resolving with cinematic presence.
 * 6. Video editor controls for flashlight color, intensity, tint saturation, particles, spin arc, and glitch.
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'circular-spin-flashlight-glitch';

  const DEFAULT_CONFIG = {
    image1Url: '/generated_person_1.jpg',
    image2Url: '/generated_person_2.jpg',
    image1Title: 'Generated Subject 01 (Curly Founder)',
    image2Title: 'Generated Subject 02 (Tech Executive)',

    totalDuration: 5.4,
    slowFlashStart: 0.85,
    slowFlashDuration: 0.90,
    fastFlashStart1: 2.10,
    fastFlashStart2: 2.32,
    fastFlashStart3: 2.54,
    fastFlashDuration: 0.14,
    glitchStart: 2.68,
    glitchDuration: 0.65,

    flashColor: '#d6f0ff',
    flashIntensity: 2.2,
    flashColorTintStrength: 0.65,
    flashBloomRadius: 65,
    flashShutterSFX: true,
    flashAudioVolume: 0.85,

    arcHeight: 55,
    arcWidth: 80,
    spinMaxAngle: 36,
    spinStartAngle: -22,
    spinMotionBlur: 14,

    particlesEnabled: true,
    particleCount: 55,
    particleSpeedY: 1.6,
    particleDriftX: 0.45,
    particleColor: '#e2e8f0',
    particleGlow: 0.7,
    particleSizeMin: 1.5,
    particleSizeMax: 3.5,

    glitchIntensity: 1.8,
    chromaticSplit: 14,
    sliceCount: 12,

    vignetteStrength: 0.65,
    filmGrain: 0.12
  };

  let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  function playSound(url, vol = 0.8) {
    try {
      const snd = new Audio(url);
      snd.volume = Math.max(0, Math.min(1, vol));
      snd.play().catch(() => {});
    } catch (e) {}
  }

  function triggerFlashAudio(isSlow = false) {
    if (!config.flashShutterSFX) return;
    if (isSlow) {
      playSound('/sfx_camera_dslr.wav', config.flashAudioVolume);
    } else {
      playSound('/sfx_camera_paparazzi.wav', config.flashAudioVolume * 0.9);
    }
  }

  let fallingParticles = [];
  function initFallingParticles(count = config.particleCount) {
    fallingParticles = [];
    for (let i = 0; i < count; i++) {
      fallingParticles.push({
        x: Math.random(),
        y: Math.random(),
        size: config.particleSizeMin + Math.random() * (config.particleSizeMax - config.particleSizeMin),
        speedY: (0.15 + Math.random() * 0.35) * config.particleSpeedY,
        driftFreq: 1.5 + Math.random() * 3.0,
        driftPhase: Math.random() * Math.PI * 2,
        driftAmp: 0.02 * config.particleDriftX,
        opacity: 0.25 + Math.random() * 0.65
      });
    }
  }
  initFallingParticles();

  function hexToRgb(hex) {
    let clean = (hex || '#ffffff').replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16) || 0xffffff;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // Active animation timer for stage self-driving RAF loop
  let stageAnimTimer = null;
  let stageStartTime = performance.now();
  let activeStageEl = null;

  function stepCircularSpinFlashAnimation(stage, tplId, localTime, customData) {
    if (!stage) return;
    const cfg = customData || config;
    const totalT = cfg.totalDuration || 5.4;
    const t = ((localTime % totalT) + totalT) % totalT;

    const wrap = stage.querySelector('#csf-wrapper');
    if (!wrap) return;

    const img1El = stage.querySelector('#csf-img-1');
    const img2El = stage.querySelector('#csf-img-2');
    const flashOverlay = stage.querySelector('#csf-flash-overlay');
    const flashCore = stage.querySelector('#csf-flash-core');
    const glitchOverlay = stage.querySelector('#csf-glitch-overlay');
    const particlesCanvas = stage.querySelector('#csf-particles-canvas');
    const statusHUD = stage.querySelector('#csf-hud-badge');

    // 1. UPDATE FALLING PARTICLES ON CANVAS
    if (particlesCanvas && cfg.particlesEnabled) {
      const ctx = particlesCanvas.getContext('2d');
      const w = particlesCanvas.width = particlesCanvas.offsetWidth || 640;
      const h = particlesCanvas.height = particlesCanvas.offsetHeight || 360;
      ctx.clearRect(0, 0, w, h);

      if (fallingParticles.length !== cfg.particleCount) {
        initFallingParticles(cfg.particleCount);
      }

      const pRgb = hexToRgb(cfg.particleColor || '#e2e8f0');

      for (let i = 0; i < fallingParticles.length; i++) {
        const p = fallingParticles[i];
        const curY = (p.y + t * (p.speedY * 0.18)) % 1.0;
        const curX = (p.x + Math.sin(t * p.driftFreq + p.driftPhase) * p.driftAmp + 1.0) % 1.0;

        const px = curX * w;
        const py = curY * h;

        ctx.fillStyle = `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, ${p.opacity * (cfg.particleGlow || 0.7)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.size > 2.2) {
          ctx.fillStyle = `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, ${p.opacity * 0.25})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 2. CIRCULAR ARC SPIN (Replicating user red doodle)
    // Starts left (-X), arches UP over head (-Y), curves DOWN right (+X, +Y) with clockwise rotation
    const spinProgress = Math.min(1.0, Math.max(0.0, (t - 0.2) / 2.5)); // 0.2s to 2.7s
    let arcX = 0;
    let arcY = 0;
    let spinAngle = 0;
    let motionBlurPx = 0;

    if (t < 2.8) {
      const p = spinProgress;
      arcX = (p * 2.0 - 1.0) * (cfg.arcWidth || 80);

      // Parabolic arch over the head (negative Y) and curve down right
      const archUp = -Math.sin(p * Math.PI) * (cfg.arcHeight || 55);
      const curveDownRight = p * ((cfg.arcHeight || 55) * 0.75);
      arcY = archUp + curveDownRight;

      // Clockwise rotation along the arc
      spinAngle = cfg.spinStartAngle + p * (cfg.spinMaxAngle - cfg.spinStartAngle);

      if (p > 0.05 && p < 0.95) {
        const vel = Math.sin(p * Math.PI);
        motionBlurPx = vel * (cfg.spinMotionBlur || 14);
      }
    } else {
      arcX = 0;
      arcY = 0;
      spinAngle = 0;
      motionBlurPx = 0;
    }

    // 3. FLASHLIGHT SEQUENCE (1 Slow + 3 Fast)
    let currentFlashPower = 0.0;
    let isSlowActive = false;

    // Flash 1: Slow camera strobe (0.85s to 1.75s)
    const f1Start = cfg.slowFlashStart;
    const f1Dur = cfg.slowFlashDuration;
    if (t >= f1Start && t < f1Start + f1Dur) {
      const dt = t - f1Start;
      isSlowActive = true;
      if (dt < 0.06) {
        currentFlashPower = (dt / 0.06) * 1.0;
      } else {
        const decay = (dt - 0.06) / (f1Dur - 0.06);
        currentFlashPower = Math.pow(1.0 - decay, 2.5);
      }
    }

    // Flash 2: Fast Strobe 1
    const f2Start = cfg.fastFlashStart1;
    const fDur = cfg.fastFlashDuration;
    if (t >= f2Start && t < f2Start + fDur) {
      const dt = t - f2Start;
      currentFlashPower = Math.max(currentFlashPower, Math.pow(1.0 - (dt / fDur), 2.0));
    }

    // Flash 3: Fast Strobe 2
    const f3Start = cfg.fastFlashStart2;
    if (t >= f3Start && t < f3Start + fDur) {
      const dt = t - f3Start;
      currentFlashPower = Math.max(currentFlashPower, Math.pow(1.0 - (dt / fDur), 2.0));
    }

    // Flash 4: Fast Strobe 3 (Peak strobe right before glitch)
    const f4Start = cfg.fastFlashStart3;
    if (t >= f4Start && t < f4Start + fDur) {
      const dt = t - f4Start;
      currentFlashPower = Math.max(currentFlashPower, Math.pow(1.0 - (dt / fDur), 1.8) * 1.35);
    }

    const effectiveFlashIntensity = currentFlashPower * (cfg.flashIntensity || 2.2);

    if (flashOverlay) {
      if (effectiveFlashIntensity > 0.01) {
        flashOverlay.style.display = 'block';
        const alpha = Math.min(1.0, effectiveFlashIntensity * 0.95);
        flashOverlay.style.opacity = alpha.toFixed(3);

        const rgb = hexToRgb(cfg.flashColor || '#d6f0ff');
        const tint = Math.max(0, Math.min(1, cfg.flashColorTintStrength || 0.65));
        const whiteMix = 1 - tint;

        const rFinal = Math.round(rgb.r * tint + 255 * whiteMix);
        const gFinal = Math.round(rgb.g * tint + 255 * whiteMix);
        const bFinal = Math.round(rgb.b * tint + 255 * whiteMix);

        flashOverlay.style.background = `rgba(${rFinal}, ${gFinal}, ${bFinal}, ${alpha.toFixed(2)})`;
        const bloomRad = cfg.flashBloomRadius || 65;
        flashOverlay.style.boxShadow = `inset 0 0 ${bloomRad * 2}px ${bloomRad}px rgba(${rFinal}, ${gFinal}, ${bFinal}, 0.85)`;

        if (flashCore) {
          flashCore.style.opacity = Math.min(1.0, effectiveFlashIntensity * 1.3).toFixed(3);
          flashCore.style.transform = `scale(${1.0 + effectiveFlashIntensity * 0.35})`;
        }
      } else {
        flashOverlay.style.opacity = '0';
        flashOverlay.style.display = 'none';
        if (flashCore) flashCore.style.opacity = '0';
      }
    }

    // 4. DIGITAL GLITCH & TRANSITION (Person 1 -> Person 2)
    const gStart = cfg.glitchStart;
    const gDur = cfg.glitchDuration;
    const isGlitching = (t >= gStart && t < gStart + gDur);
    const cutMidpoint = gStart + gDur * 0.45; // Exact moment the image switches
    const isPerson2Active = (t >= cutMidpoint);

    if (glitchOverlay) {
      if (isGlitching) {
        glitchOverlay.style.display = 'block';
        const gProgress = (t - gStart) / gDur;
        const gPower = Math.sin(gProgress * Math.PI) * (cfg.glitchIntensity || 1.8);
        const split = Math.round(gPower * (cfg.chromaticSplit || 14));

        glitchOverlay.style.opacity = Math.min(1.0, gPower * 1.15).toFixed(3);
        glitchOverlay.style.boxShadow = `${split}px 0 rgba(255, 0, 85, 0.75), -${split}px 0 rgba(0, 240, 255, 0.85)`;
      } else {
        glitchOverlay.style.display = 'none';
        glitchOverlay.style.opacity = '0';
      }
    }

    // 5. RENDER SUBJECT 1 VS SUBJECT 2
    if (img1El) {
      if (!isPerson2Active) {
        img1El.style.display = 'flex';
        img1El.style.zIndex = '5';
        const blurCss = motionBlurPx > 1.5 ? `blur(${motionBlurPx.toFixed(1)}px)` : 'none';
        const glitchShiftX = isGlitching ? (Math.random() - 0.5) * 45 : 0;
        const glitchShiftY = isGlitching ? (Math.random() - 0.5) * 20 : 0;

        img1El.style.transform = `translate(${arcX + glitchShiftX}px, ${arcY + glitchShiftY}px) rotate(${spinAngle}deg)`;
        img1El.style.filter = blurCss;
      } else {
        img1El.style.display = 'none';
      }
    }

    if (img2El) {
      if (isPerson2Active) {
        img2El.style.display = 'flex';
        img2El.style.zIndex = '6';

        const settleElapsed = t - cutMidpoint;
        const drift = 1.0 + Math.min(0.05, settleElapsed * 0.018);
        const glitchShiftX = isGlitching ? (Math.random() - 0.5) * 30 : 0;
        const glitchShiftY = isGlitching ? (Math.random() - 0.5) * 15 : 0;

        img2El.style.transform = `translate(${glitchShiftX}px, ${glitchShiftY}px) scale(${drift.toFixed(4)})`;
        img2El.style.filter = isGlitching ? 'contrast(1.4) brightness(1.2)' : 'none';
      } else {
        img2El.style.display = 'none';
      }
    }

    // 6. UPDATE HUD STATUS
    if (statusHUD) {
      if (t < f1Start) {
        statusHUD.textContent = `SPINNING: ARC FROM LEFT TO RIGHT (${t.toFixed(2)}s)`;
      } else if (isSlowActive) {
        statusHUD.textContent = `FLASH 1/4 (SLOW PHOTOFLASH): PEAK BLOOM (${t.toFixed(2)}s)`;
      } else if (t >= f2Start && t < gStart) {
        statusHUD.textContent = `FLASH 2-4/4 (FAST PAPARAZZI BURST) (${t.toFixed(2)}s)`;
      } else if (isGlitching) {
        statusHUD.textContent = `GLITCH CUT: REVEALING SECOND PERSON (${t.toFixed(2)}s)`;
      } else {
        statusHUD.textContent = `SECOND PERSON RESOLVED: CINEMATIC (${t.toFixed(2)}s)`;
      }
    }
  }

  // Mount Stage HTML and initiate self-driving RAF animation loop
  function tplMountCircularSpinFlashStage(container, customData) {
    if (!container) return;
    const cfg = customData || config;
    config = JSON.parse(JSON.stringify(cfg));
    activeStageEl = container;

    container.innerHTML = `
      <div id="csf-wrapper" style="position:relative; width:100%; height:100%; overflow:hidden; background:#070a12; user-select:none; font-family:Inter,sans-serif;">
        <!-- Background Ambient Vignette -->
        <div id="csf-bg-vignette" style="position:absolute; inset:0; z-index:1; background:radial-gradient(circle at center, rgba(15,23,42,0.4) 0%, rgba(2,6,15,0.95) 100%); pointer-events:none;"></div>

        <!-- 3D Camera Rig & Motion Container -->
        <div id="csf-motion-rig" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:2; perspective:1000px;">
          <!-- Person 1: Generated Curly Founder -->
          <div id="csf-img-1" style="position:absolute; width:88%; height:88%; display:flex; align-items:center; justify-content:center; transform-origin:center 70%; transition:filter 0.05s ease-out;">
            <img src="${cfg.image1Url || '/generated_person_1.jpg'}" alt="Person 1" style="width:100%; height:100%; object-fit:cover; border-radius:12px; box-shadow:0 25px 60px rgba(0,0,0,0.85); border:1px solid rgba(255,255,255,0.12);" onerror="this.src='/generated_person_1.jpg'">
          </div>

          <!-- Person 2: Generated Tech Visionary -->
          <div id="csf-img-2" style="position:absolute; width:88%; height:88%; display:none; align-items:center; justify-content:center; transform-origin:center center;">
            <img src="${cfg.image2Url || '/generated_person_2.jpg'}" alt="Person 2" style="width:100%; height:100%; object-fit:cover; border-radius:12px; box-shadow:0 25px 60px rgba(0,0,0,0.85); border:1px solid rgba(56,189,248,0.25);" onerror="this.src='/generated_person_2.jpg'">
          </div>
        </div>

        <!-- Falling Particles Canvas -->
        <canvas id="csf-particles-canvas" style="position:absolute; inset:0; z-index:8; pointer-events:none; width:100%; height:100%;"></canvas>

        <!-- Glitch Overlay Screen -->
        <div id="csf-glitch-overlay" style="position:absolute; inset:0; z-index:9; pointer-events:none; display:none; mix-blend-mode:hard-light; background:repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 4px);"></div>

        <!-- Optical Flashlight Overexposure Bloom -->
        <div id="csf-flash-overlay" style="position:absolute; inset:0; z-index:12; pointer-events:none; display:none; mix-blend-mode:screen;">
          <div id="csf-flash-core" style="position:absolute; top:25%; left:30%; width:40%; height:50%; border-radius:50%; background:radial-gradient(circle, #ffffff 20%, rgba(255,255,255,0.9) 50%, transparent 80%); filter:blur(25px); opacity:0;"></div>
        </div>

        <!-- Film Grain Overlay -->
        <div id="csf-film-grain" style="position:absolute; inset:0; z-index:14; pointer-events:none; opacity:0.12; background-image:radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0); background-size:3px 3px;"></div>

        <!-- Top Edge HUD Status Badge -->
        <div id="csf-hud-badge" style="position:absolute; top:14px; left:16px; z-index:20; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:5px 12px; font-size:11px; font-weight:700; color:#38bdf8; letter-spacing:1px; text-transform:uppercase;">
          CIRCULAR ARC SPIN & 4-FLASH GLITCH
        </div>

        <!-- Test Shutter SFX Button -->
        <button id="csf-btn-test-sfx" title="Preview Shutter Audio Burst" style="position:absolute; bottom:14px; right:16px; z-index:20; background:rgba(15,23,42,0.85); border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#e2e8f0; font-size:11px; font-weight:600; padding:5px 10px; cursor:pointer; display:flex; align-items:center; gap:6px;">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
          Test Shutter SFX
        </button>
      </div>
    `;

    const sfxBtn = container.querySelector('#csf-btn-test-sfx');
    if (sfxBtn) {
      sfxBtn.onclick = (e) => {
        e.stopPropagation();
        triggerFlashAudio(true);
        setTimeout(() => triggerFlashAudio(false), 250);
        setTimeout(() => triggerFlashAudio(false), 450);
        setTimeout(() => triggerFlashAudio(false), 650);
      };
    }

    // Start self-driving playback loop on this stage
    if (stageAnimTimer) cancelAnimationFrame(stageAnimTimer);
    stageStartTime = performance.now();

    function stageLoop(now) {
      if (!activeStageEl || !document.body.contains(activeStageEl)) {
        return;
      }
      const t = (now - stageStartTime) / 1000;
      stepCircularSpinFlashAnimation(activeStageEl, TEMPLATE_ID, t, config);
      stageAnimTimer = requestAnimationFrame(stageLoop);
    }
    stageAnimTimer = requestAnimationFrame(stageLoop);
  }

  // Build Comprehensive Inspector UI
  function tplBuildCircularSpinFlashInspector(container, data) {
    if (!container) return;
    const cfg = Object.assign({}, DEFAULT_CONFIG, data || {});
    config = JSON.parse(JSON.stringify(cfg));

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px; padding:4px 0 24px 0; color:#cbd5e1; font-family:Inter,sans-serif; font-size:12px;">

        <!-- Section: Flashlight Optics & Color (Editor Priority) -->
        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(56,189,248,0.25); border-radius:10px; padding:16px; box-shadow:0 8px 24px rgba(0,0,0,0.4);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:15px;">⚡</span>
              <span style="font-weight:700; color:#f8fafc; font-size:13px; letter-spacing:0.5px;">FLASHLIGHT OPTICS & COLOR</span>
            </div>
            <span style="font-size:10px; background:rgba(56,189,248,0.2); color:#38bdf8; padding:2px 8px; border-radius:4px; font-weight:600;">1 SLOW + 3 FAST BURST</span>
          </div>

          <!-- Color Presets -->
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:11px; color:#94a3b8; margin-bottom:6px; font-weight:600;">FLASHLIGHT COLOR PALETTE</label>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
              <button type="button" class="csf-color-preset" data-color="#d6f0ff" data-tint="0.65" style="background:#0f172a; border:1px solid ${cfg.flashColor === '#d6f0ff' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; border-radius:6px; padding:8px 6px; display:flex; align-items:center; gap:8px; cursor:pointer; color:#e2e8f0; font-size:11px;">
                <span style="width:14px; height:14px; border-radius:50%; background:#d6f0ff; box-shadow:0 0 8px #d6f0ff; display:inline-block;"></span>
                <span>Cold Xenon</span>
              </button>
              <button type="button" class="csf-color-preset" data-color="#ffffff" data-tint="0.0" style="background:#0f172a; border:1px solid ${cfg.flashColor === '#ffffff' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; border-radius:6px; padding:8px 6px; display:flex; align-items:center; gap:8px; cursor:pointer; color:#e2e8f0; font-size:11px;">
                <span style="width:14px; height:14px; border-radius:50%; background:#ffffff; box-shadow:0 0 8px #ffffff; display:inline-block;"></span>
                <span>Daylight 5600K</span>
              </button>
              <button type="button" class="csf-color-preset" data-color="#00f0ff" data-tint="0.8" style="background:#0f172a; border:1px solid ${cfg.flashColor === '#00f0ff' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; border-radius:6px; padding:8px 6px; display:flex; align-items:center; gap:8px; cursor:pointer; color:#e2e8f0; font-size:11px;">
                <span style="width:14px; height:14px; border-radius:50%; background:#00f0ff; box-shadow:0 0 8px #00f0ff; display:inline-block;"></span>
                <span>Electric Cyan</span>
              </button>
              <button type="button" class="csf-color-preset" data-color="#ffe5b4" data-tint="0.75" style="background:#0f172a; border:1px solid ${cfg.flashColor === '#ffe5b4' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; border-radius:6px; padding:8px 6px; display:flex; align-items:center; gap:8px; cursor:pointer; color:#e2e8f0; font-size:11px;">
                <span style="width:14px; height:14px; border-radius:50%; background:#ffe5b4; box-shadow:0 0 8px #ffe5b4; display:inline-block;"></span>
                <span>Amber Halogen</span>
              </button>
              <button type="button" class="csf-color-preset" data-color="#ff3366" data-tint="0.85" style="background:#0f172a; border:1px solid ${cfg.flashColor === '#ff3366' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; border-radius:6px; padding:8px 6px; display:flex; align-items:center; gap:8px; cursor:pointer; color:#e2e8f0; font-size:11px;">
                <span style="width:14px; height:14px; border-radius:50%; background:#ff3366; box-shadow:0 0 8px #ff3366; display:inline-block;"></span>
                <span>Crimson Strobe</span>
              </button>
              <button type="button" class="csf-color-preset" data-color="#ffb703" data-tint="0.8" style="background:#0f172a; border:1px solid ${cfg.flashColor === '#ffb703' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; border-radius:6px; padding:8px 6px; display:flex; align-items:center; gap:8px; cursor:pointer; color:#e2e8f0; font-size:11px;">
                <span style="width:14px; height:14px; border-radius:50%; background:#ffb703; box-shadow:0 0 8px #ffb703; display:inline-block;"></span>
                <span>Golden Hour</span>
              </button>
            </div>
          </div>

          <!-- Custom Color Picker -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px;">
            <input type="color" id="csf-inp-flashcolor" value="${cfg.flashColor || '#d6f0ff'}" style="width:36px; height:32px; border:none; border-radius:4px; cursor:pointer; background:transparent;">
            <div style="flex:1;">
              <div style="font-size:11px; font-weight:600; color:#e2e8f0;">Custom Flashlight Tint</div>
              <div style="font-size:10px; color:#64748b;">Fine-tune exact RGB color temperature</div>
            </div>
            <span id="csf-lbl-flashcolor" style="font-family:monospace; font-size:11px; color:#38bdf8; background:rgba(56,189,248,0.15); padding:3px 8px; border-radius:4px;">${cfg.flashColor || '#d6f0ff'}</span>
          </div>

          <!-- Flash Intensity Slider -->
          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">FLASHLIGHT INTENSITY / BRILLIANCE</label>
              <span id="csf-val-flashint" style="font-weight:700; color:#38bdf8;">${parseFloat(cfg.flashIntensity || 2.2).toFixed(1)}x</span>
            </div>
            <input type="range" id="csf-rng-flashint" min="0.5" max="3.5" step="0.1" value="${cfg.flashIntensity || 2.2}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>

          <!-- Color Tint Strength Slider -->
          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">COLOR TINT STRENGTH</label>
              <span id="csf-val-tintstr" style="font-weight:700; color:#38bdf8;">${Math.round((cfg.flashColorTintStrength || 0.65) * 100)}%</span>
            </div>
            <input type="range" id="csf-rng-tintstr" min="0" max="1" step="0.05" value="${cfg.flashColorTintStrength || 0.65}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>

          <!-- Bloom Radius Slider -->
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">OPTICAL BLOOM & HALATION RADIUS</label>
              <span id="csf-val-bloomrad" style="font-weight:700; color:#38bdf8;">${cfg.flashBloomRadius || 65}px</span>
            </div>
            <input type="range" id="csf-rng-bloomrad" min="15" max="140" step="5" value="${cfg.flashBloomRadius || 65}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>
        </div>

        <!-- Section: Circular Arc Spin Dynamics (User Red Doodle) -->
        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:15px;">🔄</span>
              <span style="font-weight:700; color:#f8fafc; font-size:13px; letter-spacing:0.5px;">CIRCULAR ARC SPIN (DOODLE TRAJECTORY)</span>
            </div>
            <span style="font-size:10px; background:rgba(239,68,68,0.2); color:#f87171; padding:2px 8px; border-radius:4px; font-weight:600;">LEFT TO RIGHT ARC</span>
          </div>

          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">ARC DOME HEIGHT (OVER-HEAD CURVE)</label>
              <span id="csf-val-archeight" style="font-weight:700; color:#38bdf8;">${cfg.arcHeight || 55}px</span>
            </div>
            <input type="range" id="csf-rng-archeight" min="10" max="100" step="5" value="${cfg.arcHeight || 55}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>

          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">MAX CLOCKWISE TILT ANGLE</label>
              <span id="csf-val-spinangle" style="font-weight:700; color:#38bdf8;">+${cfg.spinMaxAngle || 36}°</span>
            </div>
            <input type="range" id="csf-rng-spinangle" min="10" max="70" step="2" value="${cfg.spinMaxAngle || 36}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">SPIN MOTION BLUR</label>
              <span id="csf-val-motionblur" style="font-weight:700; color:#38bdf8;">${cfg.spinMotionBlur || 14}px</span>
            </div>
            <input type="range" id="csf-rng-motionblur" min="0" max="30" step="2" value="${cfg.spinMotionBlur || 14}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>
        </div>

        <!-- Section: Falling Particles -->
        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:15px;">✨</span>
              <span style="font-weight:700; color:#f8fafc; font-size:13px; letter-spacing:0.5px;">FALLING PARTICLES (ATMOSPHERE)</span>
            </div>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="csf-chk-particles" ${cfg.particlesEnabled ? 'checked' : ''} style="accent-color:#38bdf8;">
              <span style="font-size:11px; font-weight:600; color:#e2e8f0;">Active</span>
            </label>
          </div>

          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">PARTICLE DENSITY / COUNT</label>
              <span id="csf-val-partcount" style="font-weight:700; color:#38bdf8;">${cfg.particleCount || 55}</span>
            </div>
            <input type="range" id="csf-rng-partcount" min="10" max="150" step="5" value="${cfg.particleCount || 55}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>

          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">FALLING SPEED (GRAVITY)</label>
              <span id="csf-val-partspeed" style="font-weight:700; color:#38bdf8;">${parseFloat(cfg.particleSpeedY || 1.6).toFixed(1)}x</span>
            </div>
            <input type="range" id="csf-rng-partspeed" min="0.4" max="3.5" step="0.2" value="${cfg.particleSpeedY || 1.6}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="color" id="csf-inp-partcolor" value="${cfg.particleColor || '#e2e8f0'}" style="width:28px; height:26px; border:none; border-radius:4px; cursor:pointer; background:transparent;">
              <span style="font-size:11px; font-weight:600; color:#e2e8f0;">Particle Tint</span>
            </div>
            <span id="csf-lbl-partcolor" style="font-family:monospace; font-size:11px; color:#94a3b8;">${cfg.particleColor || '#e2e8f0'}</span>
          </div>
        </div>

        <!-- Section: Glitch & Person 2 Transition -->
        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:15px;">📺</span>
              <span style="font-weight:700; color:#f8fafc; font-size:13px; letter-spacing:0.5px;">GLITCH & SECOND PERSON CUT</span>
            </div>
            <span style="font-size:10px; background:rgba(168,85,247,0.2); color:#c084fc; padding:2px 8px; border-radius:4px; font-weight:600;">RGB SPLIT + SLICES</span>
          </div>

          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">GLITCH INTENSITY</label>
              <span id="csf-val-glitchint" style="font-weight:700; color:#38bdf8;">${parseFloat(cfg.glitchIntensity || 1.8).toFixed(1)}x</span>
            </div>
            <input type="range" id="csf-rng-glitchint" min="0.5" max="3.0" step="0.1" value="${cfg.glitchIntensity || 1.8}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <label style="font-size:11px; color:#94a3b8; font-weight:600;">CHROMATIC ABERRATION SPLIT</label>
              <span id="csf-val-split" style="font-weight:700; color:#38bdf8;">${cfg.chromaticSplit || 14}px</span>
            </div>
            <input type="range" id="csf-rng-split" min="2" max="30" step="1" value="${cfg.chromaticSplit || 14}" style="width:100%; accent-color:#38bdf8; cursor:pointer;">
          </div>
        </div>

        <!-- Section: Media Asset Controls -->
        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:15px;">👥</span>
              <span style="font-weight:700; color:#f8fafc; font-size:13px; letter-spacing:0.5px;">SUBJECT ASSETS (AI GENERATED)</span>
            </div>
            <span style="font-size:10px; background:rgba(34,197,94,0.2); color:#4ade80; padding:2px 8px; border-radius:4px; font-weight:600;">VERIFIED AI GENERATION</span>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px; text-align:center;">
              <div style="font-size:11px; font-weight:700; color:#38bdf8; margin-bottom:6px;">Person 1 (Spinning)</div>
              <img src="${cfg.image1Url || '/generated_person_1.jpg'}" alt="Thumb 1" style="width:100%; height:75px; object-fit:cover; border-radius:4px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.15);">
              <label style="display:block; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:4px 8px; font-size:10px; color:#cbd5e1; cursor:pointer;">
                Replace Person 1
                <input type="file" id="csf-file-img1" accept="image/*" style="display:none;">
              </label>
            </div>

            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px; text-align:center;">
              <div style="font-size:11px; font-weight:700; color:#c084fc; margin-bottom:6px;">Person 2 (Glitch Reveal)</div>
              <img src="${cfg.image2Url || '/generated_person_2.jpg'}" alt="Thumb 2" style="width:100%; height:75px; object-fit:cover; border-radius:4px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.15);">
              <label style="display:block; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:4px 8px; font-size:10px; color:#cbd5e1; cursor:pointer;">
                Replace Person 2
                <input type="file" id="csf-file-img2" accept="image/*" style="display:none;">
              </label>
            </div>
          </div>
        </div>

      </div>
    `;

    attachInspectorEvents(container);
  }

  function attachInspectorEvents(container) {
    function notifyUpdate() {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(TEMPLATE_ID, config);
      }
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage && typeof window.tplMountCircularSpinFlashStage === 'function') {
        window.tplMountCircularSpinFlashStage(stage, config);
      }
    }

    container.querySelectorAll('.csf-color-preset').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.csf-color-preset').forEach(b => b.style.borderColor = 'rgba(255,255,255,0.15)');
        btn.style.borderColor = '#38bdf8';
        const col = btn.dataset.color;
        const tint = parseFloat(btn.dataset.tint);
        config.flashColor = col;
        config.flashColorTintStrength = tint;

        const inpColor = container.querySelector('#csf-inp-flashcolor');
        const lblColor = container.querySelector('#csf-lbl-flashcolor');
        const rngTint = container.querySelector('#csf-rng-tintstr');
        const valTint = container.querySelector('#csf-val-tintstr');

        if (inpColor) inpColor.value = col;
        if (lblColor) lblColor.textContent = col;
        if (rngTint) rngTint.value = tint;
        if (valTint) valTint.textContent = `${Math.round(tint * 100)}%`;

        notifyUpdate();
      };
    });

    const inpFlashColor = container.querySelector('#csf-inp-flashcolor');
    const lblFlashColor = container.querySelector('#csf-lbl-flashcolor');
    if (inpFlashColor) {
      inpFlashColor.oninput = (e) => {
        config.flashColor = e.target.value;
        if (lblFlashColor) lblFlashColor.textContent = e.target.value;
        notifyUpdate();
      };
    }

    const rngFlashInt = container.querySelector('#csf-rng-flashint');
    const valFlashInt = container.querySelector('#csf-val-flashint');
    if (rngFlashInt) {
      rngFlashInt.oninput = (e) => {
        const val = parseFloat(e.target.value);
        config.flashIntensity = val;
        if (valFlashInt) valFlashInt.textContent = `${val.toFixed(1)}x`;
        notifyUpdate();
      };
    }

    const rngTintStr = container.querySelector('#csf-rng-tintstr');
    const valTintStr = container.querySelector('#csf-val-tintstr');
    if (rngTintStr) {
      rngTintStr.oninput = (e) => {
        const val = parseFloat(e.target.value);
        config.flashColorTintStrength = val;
        if (valTintStr) valTintStr.textContent = `${Math.round(val * 100)}%`;
        notifyUpdate();
      };
    }

    const rngBloomRad = container.querySelector('#csf-rng-bloomrad');
    const valBloomRad = container.querySelector('#csf-val-bloomrad');
    if (rngBloomRad) {
      rngBloomRad.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        config.flashBloomRadius = val;
        if (valBloomRad) valBloomRad.textContent = `${val}px`;
        notifyUpdate();
      };
    }

    const rngArcHeight = container.querySelector('#csf-rng-archeight');
    const valArcHeight = container.querySelector('#csf-val-archeight');
    if (rngArcHeight) {
      rngArcHeight.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        config.arcHeight = val;
        if (valArcHeight) valArcHeight.textContent = `${val}px`;
        notifyUpdate();
      };
    }

    const rngSpinAngle = container.querySelector('#csf-rng-spinangle');
    const valSpinAngle = container.querySelector('#csf-val-spinangle');
    if (rngSpinAngle) {
      rngSpinAngle.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        config.spinMaxAngle = val;
        if (valSpinAngle) valSpinAngle.textContent = `+${val}°`;
        notifyUpdate();
      };
    }

    const rngMotionBlur = container.querySelector('#csf-rng-motionblur');
    const valMotionBlur = container.querySelector('#csf-val-motionblur');
    if (rngMotionBlur) {
      rngMotionBlur.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        config.spinMotionBlur = val;
        if (valMotionBlur) valMotionBlur.textContent = `${val}px`;
        notifyUpdate();
      };
    }

    const chkParticles = container.querySelector('#csf-chk-particles');
    if (chkParticles) {
      chkParticles.onchange = (e) => {
        config.particlesEnabled = e.target.checked;
        notifyUpdate();
      };
    }

    const rngPartCount = container.querySelector('#csf-rng-partcount');
    const valPartCount = container.querySelector('#csf-val-partcount');
    if (rngPartCount) {
      rngPartCount.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        config.particleCount = val;
        if (valPartCount) valPartCount.textContent = val;
        initFallingParticles(val);
        notifyUpdate();
      };
    }

    const rngPartSpeed = container.querySelector('#csf-rng-partspeed');
    const valPartSpeed = container.querySelector('#csf-val-partspeed');
    if (rngPartSpeed) {
      rngPartSpeed.oninput = (e) => {
        const val = parseFloat(e.target.value);
        config.particleSpeedY = val;
        if (valPartSpeed) valPartSpeed.textContent = `${val.toFixed(1)}x`;
        initFallingParticles(config.particleCount);
        notifyUpdate();
      };
    }

    const inpPartColor = container.querySelector('#csf-inp-partcolor');
    const lblPartColor = container.querySelector('#csf-lbl-partcolor');
    if (inpPartColor) {
      inpPartColor.oninput = (e) => {
        config.particleColor = e.target.value;
        if (lblPartColor) lblPartColor.textContent = e.target.value;
        notifyUpdate();
      };
    }

    const rngGlitchInt = container.querySelector('#csf-rng-glitchint');
    const valGlitchInt = container.querySelector('#csf-val-glitchint');
    if (rngGlitchInt) {
      rngGlitchInt.oninput = (e) => {
        const val = parseFloat(e.target.value);
        config.glitchIntensity = val;
        if (valGlitchInt) valGlitchInt.textContent = `${val.toFixed(1)}x`;
        notifyUpdate();
      };
    }

    const rngSplit = container.querySelector('#csf-rng-split');
    const valSplit = container.querySelector('#csf-val-split');
    if (rngSplit) {
      rngSplit.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        config.chromaticSplit = val;
        if (valSplit) valSplit.textContent = `${val}px`;
        notifyUpdate();
      };
    }

    const fileImg1 = container.querySelector('#csf-file-img1');
    if (fileImg1) {
      fileImg1.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          config.image1Url = url;
          notifyUpdate();
        }
      };
    }

    const fileImg2 = container.querySelector('#csf-file-img2');
    if (fileImg2) {
      fileImg2.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          config.image2Url = url;
          notifyUpdate();
        }
      };
    }
  }

  window.tplMountCircularSpinFlashStage = tplMountCircularSpinFlashStage;
  window.stepCircularSpinFlashAnimation = stepCircularSpinFlashAnimation;
  window.tplBuildCircularSpinFlashInspector = tplBuildCircularSpinFlashInspector;
  window.getCircularSpinFlashDefaultConfig = function() {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  };

})();
