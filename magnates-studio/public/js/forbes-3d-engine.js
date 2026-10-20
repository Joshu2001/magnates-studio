/**
 * James Jani Forbes 3D Cover Engine
 * Replicating the iconic sequence from "The Fake Genius: The $30 Billion Fraud":
 * - Macro camera zoom on face that dollies back into flat magazine cover
 * - 3D perspective orientation (tilted in 3D space, leveling out to 0° flat)
 * - Initial flash illumination on dark background
 * - Shallow depth-of-field text with heavy blur & ghosted duplicate, resolving to crisp sharp text
 * - 4 rapid paparazzi camera shutter flashes (fraction-of-a-second strobes with ambient shadow dips)
 * - Horizontal CRT TV / anamorphic lens flare beam streak (Image 3) slicing across eyes/face
 * - Sudden facial highlight bloom when the beam strikes, snapping shut into a secondary pulse
 * - Modular portrait swappable to any subject (defaults to distinguished executive/founder, NOT SBF)
 * - Granular control over all visual, timing, 3D, and typographic parameters
 */
(function() {
  'use strict';

  const TEMPLATE_ID = 'jani-forbes-fraud-reveal';

  const DEFAULT_CONFIG = {
    // Subject / Portrait
    portraitUrl: '/portrait_cutout_clean.png',
    portraitPreset: 'executive',
    portraitScale: 1.0,
    portraitOffsetX: 0,
    portraitOffsetY: 0,
    portraitBrightness: 100,
    portraitContrast: 110,

    // 3D Camera Dolly & Perspective
    startZoom: 2.45,
    endZoom: 1.0,
    startTiltX: 13.0,  // Pitch (degrees)
    startTiltY: -17.0, // Yaw (degrees)
    startTiltZ: 5.5,   // Roll (degrees)
    endTiltX: 0.0,
    endTiltY: 0.0,
    endTiltZ: 0.0,
    perspective: 900,  // px
    dollyEasing: 'cubic-out',

    // Depth-of-Field & Blur
    startBlur: 18.0,   // px
    endBlur: 0.0,      // px
    ghostBloomOpacity: 75, // %
    blurResolveTime: 3.2,  // seconds

    // 4 Paparazzi Camera Flashes
    flashCount: 4,
    flashTimes: [0.65, 1.15, 1.65, 2.15],
    flashDuration: 0.14,
    flashPeakIntensity: 220, // %
    flashAmbientDip: 42,     // %
    enableFlashSFX: true,

    // Anamorphic CRT TV Light Beam (Image 3)
    beamTriggerTime: 2.55,
    beamDuration: 0.28,
    beamIntensity: 180,
    beamThickness: 3.5,
    beamGlowSpread: 42,
    beamColor: '#38bdf8',
    beamFaceBloom: 195,
    secondaryPulseTime: 3.12,
    secondaryPulseDuration: 0.16,

    // Magazine Typography & Layout
    magazineTitle: 'Forbes',
    mastheadColor: '#ffffff',
    kickerBadge: 'SPECIAL ISSUE',
    showKickerBox: true,
    kickerBoxBg: '#ef4444',
    topTickerLeft: "THE VATICAN'S CORRUPTION TRIAL PROBLEM",
    topTickerRight: "THE MOGUL WHO MASTERED WASHINGTON",
    featureTag: '40th ANNUAL',
    featureTitle: 'FORBES 400',
    subHeadline1: "• NEW RECORD: $4.5 TRILLION FOR AMERICA'S RICHEST",
    subHeadline2: "• CAN ANYONE REALLY TRUST THE NEW BILLIONAIRES?",
    subjectName: 'ALEXANDER VANCE',
    subjectQuote: '"I BUILT AN EMPIRE BEFORE ANYONE KNEW WHAT WAS REAL."',

    // Overall Timing
    duration: 5.0
  };

  // Image cache for Canvas rendering
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
    return (img.complete && img.naturalWidth) ? img : null;
  }

  // Pre-cache default portrait
  getCachedImage(DEFAULT_CONFIG.portraitUrl);
  getCachedImage('/ceo_portrait_cutout.jpg');
  getCachedImage('/creator_portrait_cutout.png');

  // Audio SFX helper
  let lastAudioTrigger = 0;
  function triggerShutterSFX() {
    const now = performance.now();
    if (now - lastAudioTrigger < 180) return;
    lastAudioTrigger = now;
    if (typeof window.playSFX === 'function') {
      try { window.playSFX('camera_shutter', 0.6); } catch (_) {}
    }
  }

  // Easing helper
  function easeCubicOut(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  /**
   * Calculates the instantaneous frame state for any timestamp t (0 <= t <= duration)
   */
  function computeFrameState(data, t) {
    const dur = Math.max(1, data.duration || 5.0);
    const ct = Math.max(0, Math.min(dur, t % dur));
    const p = ct / dur;
    const dollyProg = easeCubicOut(Math.min(1, ct / (data.blurResolveTime || 3.2)));

    // 1. Zoom & 3D Orientation
    const currentZoom = (data.startZoom || 2.45) + ((data.endZoom || 1.0) - (data.startZoom || 2.45)) * dollyProg;
    const currentTiltX = (data.startTiltX || 13.0) * (1 - dollyProg) + (data.endTiltX || 0) * dollyProg;
    const currentTiltY = (data.startTiltY || -17.0) * (1 - dollyProg) + (data.endTiltY || 0) * dollyProg;
    const currentTiltZ = (data.startTiltZ || 5.5) * (1 - dollyProg) + (data.endTiltZ || 0) * dollyProg;

    // 2. Depth-of-Field Blur
    const blurResolveTime = data.blurResolveTime || 3.2;
    let currentBlur = 0;
    let ghostOpacity = 0;
    if (ct < blurResolveTime) {
      const bProg = ct / blurResolveTime;
      const bFalloff = 1 - easeCubicOut(bProg);
      currentBlur = (data.endBlur || 0) + ((data.startBlur || 18.0) - (data.endBlur || 0)) * bFalloff;
      ghostOpacity = bFalloff * ((data.ghostBloomOpacity !== undefined ? data.ghostBloomOpacity : 75) / 100);
    } else {
      currentBlur = data.endBlur || 0;
      ghostOpacity = 0;
    }

    // 3. Lighting & Flashes calculation
    let flashExposure = 0; // additive brightness %
    let isBetweenFlashes = false;
    let flashTriggerNow = false;

    // Initial reveal flash at t=0
    if (ct < 0.35) {
      const initFlash = Math.exp(-ct / 0.08);
      flashExposure = Math.max(flashExposure, initFlash * 180);
    }

    // 4 Paparazzi Flashes
    const flashTimes = Array.isArray(data.flashTimes) ? data.flashTimes : [0.65, 1.15, 1.65, 2.15];
    const flashDur = data.flashDuration || 0.14;
    const flashPeak = data.flashPeakIntensity || 220;

    for (let i = 0; i < Math.min(flashTimes.length, data.flashCount || 4); i++) {
      const ft = flashTimes[i];
      const dt = ct - ft;
      if (dt >= 0 && dt <= flashDur) {
        // High-energy strobe spike with rapid decay
        const strobe = Math.exp(-dt / 0.035);
        flashExposure = Math.max(flashExposure, strobe * flashPeak);
        if (dt < 0.03) flashTriggerNow = true;
      }
    }

    // Check if in the shadow dip period (between flashes before the beam)
    if (ct > 0.4 && ct < (data.beamTriggerTime || 2.55)) {
      if (flashExposure < 15) {
        isBetweenFlashes = true;
      }
    }

    // 4. Anamorphic CRT TV Light Beam (Image 3)
    const beamStart = data.beamTriggerTime || 2.55;
    const beamDur = data.beamDuration || 0.28;
    let beamActive = false;
    let beamProgress = 0;
    let beamGlowAlpha = 0;

    if (ct >= beamStart && ct <= (beamStart + beamDur)) {
      beamActive = true;
      const dt = ct - beamStart;
      beamProgress = dt / beamDur;
      // Envelope: instant rise, intense sustained beam, rapid collapse
      beamGlowAlpha = Math.sin(beamProgress * Math.PI);
      flashExposure = Math.max(flashExposure, (data.beamFaceBloom || 195) * beamGlowAlpha);
    }

    // Secondary follow-up pulse
    const secPulseTime = data.secondaryPulseTime || 3.12;
    const secPulseDur = data.secondaryPulseDuration || 0.16;
    if (ct >= secPulseTime && ct <= (secPulseTime + secPulseDur)) {
      const dt = ct - secPulseTime;
      const sStrobe = Math.exp(-dt / 0.04);
      flashExposure = Math.max(flashExposure, sStrobe * 110);
    }

    // Calculate final portrait brightness & contrast
    let baseBrightness = data.portraitBrightness || 100;
    if (isBetweenFlashes && !beamActive) {
      baseBrightness = (data.flashAmbientDip || 42);
    }
    const finalBrightness = baseBrightness + flashExposure;
    const finalContrast = (data.portraitContrast || 110) + (flashExposure > 20 ? 30 : 0);

    return {
      t: ct,
      zoom: currentZoom,
      tiltX: currentTiltX,
      tiltY: currentTiltY,
      tiltZ: currentTiltZ,
      blur: currentBlur,
      ghostOpacity,
      brightness: finalBrightness,
      contrast: finalContrast,
      flashOverlayOpacity: Math.min(1, flashExposure / 220),
      beamActive,
      beamGlowAlpha,
      flashTriggerNow
    };
  }

  /**
   * Generates the authentic HTML structure for the template
   */
  function buildForbesHtml(tplId, data) {
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const pUrl = d.portraitUrl || '/portrait_cutout_clean.png';

    return `
      <div id="jani-forbes-viewport-${tplId}" class="jani-forbes-viewport" style="position: absolute; inset: 0; background: #020306; overflow: hidden; display: flex; align-items: center; justify-content: center; perspective: ${d.perspective || 900}px;">
        
        <!-- 3D Camera Dolly Rig -->
        <div id="jani-forbes-rig-${tplId}" class="jani-forbes-rig" style="position: absolute; width: 420px; height: 560px; transform-style: preserve-3d; will-change: transform;">
          
          <!-- Background Studio Plate -->
          <div style="position: absolute; inset: 0; background: radial-gradient(circle at 50% 40%, #151a29 0%, #060912 65%, #000000 100%); border-radius: 4px; box-shadow: 0 30px 70px rgba(0,0,0,0.95); border: 1px solid rgba(255,255,255,0.06);"></div>

          <!-- Subject Portrait Layer -->
          <div id="jani-forbes-portrait-wrap-${tplId}" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; overflow: hidden;">
            <img id="jani-forbes-portrait-img-${tplId}" src="${pUrl}" alt="Forbes Subject" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%; filter: brightness(100%) contrast(110%); will-change: filter;" />
          </div>

          <!-- Paparazzi Strobe Overlay -->
          <div id="jani-forbes-flash-overlay-${tplId}" style="position: absolute; inset: 0; pointer-events: none; opacity: 0; background: radial-gradient(circle at 50% 40%, rgba(255,255,255,1) 0%, rgba(220,240,255,0.7) 45%, rgba(0,0,0,0) 80%); mix-blend-mode: screen; z-index: 15; will-change: opacity;"></div>

          <!-- Anamorphic CRT TV Light Beam (Image 3) -->
          <div id="jani-forbes-beam-${tplId}" style="position: absolute; inset: 0; pointer-events: none; display: none; z-index: 20;">
            <!-- Wide Anamorphic Cyan Wash -->
            <div id="jani-forbes-beam-wash-${tplId}" style="position: absolute; left: -120px; right: -120px; top: 40%; height: 64px; transform: translateY(-50%); background: linear-gradient(90deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.45) 25%, rgba(255,255,255,0.95) 50%, rgba(56,189,248,0.45) 75%, rgba(56,189,248,0) 100%); filter: blur(12px); opacity: 0.9;"></div>
            <!-- Razor Sharp White Core Line -->
            <div id="jani-forbes-beam-core-${tplId}" style="position: absolute; left: -120px; right: -120px; top: 40%; height: ${d.beamThickness || 3.5}px; transform: translateY(-50%); background: #ffffff; box-shadow: 0 0 16px 4px ${d.beamColor || '#38bdf8'}, 0 0 40px 10px rgba(96,165,250,0.85);"></div>
            <!-- Anamorphic Optical Flare Bloom (Left-Center) -->
            <div id="jani-forbes-beam-flare-${tplId}" style="position: absolute; left: 16%; top: 40%; width: 150px; height: 38px; transform: translate(-50%, -50%); background: radial-gradient(ellipse at center, #ffffff 0%, rgba(147,197,253,0.85) 35%, rgba(37,99,235,0) 70%); filter: blur(2px);"></div>
          </div>

          <!-- Magazine Text Stack Layer -->
          <div id="jani-forbes-text-layer-${tplId}" style="position: absolute; inset: 0; padding: 22px 24px; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none; z-index: 25; will-change: filter;">
            
            <!-- Top Section -->
            <div>
              <!-- Top Ticker & Kicker Bar -->
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 14px; width: 100%;">
                <span id="jani-txt-ticker-left-${tplId}" style="font-family: 'Inter', sans-serif; font-size: 6px; font-weight: 800; color: rgba(255,255,255,0.55); letter-spacing: 0.4px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; flex-shrink: 1;">${d.topTickerLeft}</span>
                <div id="jani-kicker-box-${tplId}" style="background: ${d.kickerBoxBg || '#ef4444'}; padding: 2px 7px; border-radius: 2px; display: ${d.showKickerBox !== false ? 'inline-flex' : 'none'}; align-items: center; justify-content: center; flex-shrink: 0; white-space: nowrap; height: 13px; box-sizing: border-box;">
                  <span id="jani-txt-kicker-${tplId}" style="font-family: 'Inter', sans-serif; font-size: 6.5px; font-weight: 900; color: #ffffff; letter-spacing: 0.8px; white-space: nowrap; text-transform: uppercase; line-height: 1;">${d.kickerBadge}</span>
                </div>
                <span id="jani-txt-ticker-right-${tplId}" style="font-family: 'Inter', sans-serif; font-size: 6px; font-weight: 800; color: rgba(255,255,255,0.55); letter-spacing: 0.4px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; flex-shrink: 1; text-align: right;">${d.topTickerRight}</span>
              </div>

              <!-- Forbes Masthead with Ghosted DOF Duplicate (Image 2) -->
              <div style="position: relative; text-align: center; margin-top: 6px;">
                <!-- Ghosted Depth-of-Field Blur Duplicate -->
                <div id="jani-txt-ghost-masthead-${tplId}" style="position: absolute; inset: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 80px; font-weight: 900; letter-spacing: -2px; color: rgba(255,255,255,0.7); filter: blur(10px); transform: translateY(6px); opacity: ${d.ghostBloomOpacity / 100}; line-height: 0.95;">
                  ${d.magazineTitle || 'Forbes'}
                </div>
                <!-- Main Forbes Masthead -->
                <div id="jani-txt-main-masthead-${tplId}" style="position: relative; font-family: 'Playfair Display', Georgia, serif; font-size: 80px; font-weight: 900; letter-spacing: -2px; color: ${d.mastheadColor || '#ffffff'}; text-shadow: 0 4px 20px rgba(0,0,0,0.85); line-height: 0.95;">
                  ${d.magazineTitle || 'Forbes'}
                </div>
              </div>
            </div>

            <!-- Bottom Section -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <!-- Left Feature Headline -->
              <div style="max-width: 58%;">
                <div id="jani-txt-feature-tag-${tplId}" style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: 1px; line-height: 1.1;">
                  ${d.featureTag}
                </div>
                <div id="jani-txt-feature-title-${tplId}" style="font-family: 'Playfair Display', Georgia, serif; font-size: 38px; font-weight: 900; color: #ffffff; letter-spacing: -1px; line-height: 1; margin: 2px 0 6px 0; text-shadow: 0 4px 15px rgba(0,0,0,0.9);">
                  ${d.featureTitle}
                </div>
                <div id="jani-txt-subhead-1-${tplId}" style="font-family: 'Inter', sans-serif; font-size: 6.8px; font-weight: 700; color: #e2e8f0; line-height: 1.35; text-shadow: 0 2px 6px #000;">
                  ${d.subHeadline1}
                </div>
                <div id="jani-txt-subhead-2-${tplId}" style="font-family: 'Inter', sans-serif; font-size: 6.8px; font-weight: 700; color: #cbd5e1; line-height: 1.35; text-shadow: 0 2px 6px #000; margin-top: 2px;">
                  ${d.subHeadline2}
                </div>
              </div>

              <!-- Right Subject Name & Quote -->
              <div style="max-width: 38%; text-align: right;">
                <div id="jani-txt-subject-name-${tplId}" style="font-family: 'Inter', sans-serif; font-size: 8.5px; font-weight: 900; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                  ${d.subjectName}
                </div>
                <div id="jani-txt-subject-quote-${tplId}" style="font-family: 'Georgia', serif; font-style: italic; font-size: 7.5px; color: #cbd5e1; line-height: 1.3; margin-top: 4px; text-shadow: 0 2px 6px #000;">
                  ${d.subjectQuote}
                </div>
              </div>
            </div>

          </div>

          <!-- Subtle Edge Border & Grain Vignette -->
          <div style="position: absolute; inset: 0; border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; pointer-events: none; box-shadow: inset 0 0 40px rgba(0,0,0,0.5);"></div>

        </div>

        <!-- Watermark Badge -->
        <div style="position: absolute; top: 10px; right: 10px; padding: 3px 8px; border-radius: 4px; background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8; color: #fff; font-size: 8px; font-weight: 800; letter-spacing: 0.05em; z-index: 30; box-shadow: 0 4px 12px rgba(2,132,199,0.5);">
          ⚡ JANI 3D FORBES
        </div>
      </div>
    `;
  }

  /**
   * Applies the computed state to the live DOM elements
   */
  function applyStateToDOM(container, tplId, st, data) {
    if (!container) return;

    // 1. 3D Camera Rig Transform
    const rig = container.querySelector(`#jani-forbes-rig-${tplId}`) || container.querySelector('.jani-forbes-rig');
    if (rig) {
      rig.style.transform = `scale(${st.zoom.toFixed(3)}) rotateX(${st.tiltX.toFixed(2)}deg) rotateY(${st.tiltY.toFixed(2)}deg) rotateZ(${st.tiltZ.toFixed(2)}deg)`;
    }

    // 2. Subject Portrait Filter
    const portImg = container.querySelector(`#jani-forbes-portrait-img-${tplId}`);
    if (portImg) {
      portImg.style.filter = `brightness(${st.brightness.toFixed(0)}%) contrast(${st.contrast.toFixed(0)}%)`;
      if (data && data.portraitUrl && portImg.getAttribute('src') !== data.portraitUrl) {
        portImg.src = data.portraitUrl;
      }
    }

    // 3. Strobe Flash Overlay
    const flashEl = container.querySelector(`#jani-forbes-flash-overlay-${tplId}`);
    if (flashEl) {
      flashEl.style.opacity = st.flashOverlayOpacity.toFixed(3);
    }

    // 4. Anamorphic CRT Beam (Image 3)
    const beamEl = container.querySelector(`#jani-forbes-beam-${tplId}`);
    if (beamEl) {
      if (st.beamActive) {
        beamEl.style.display = 'block';
        beamEl.style.opacity = st.beamGlowAlpha.toFixed(3);
      } else {
        beamEl.style.display = 'none';
      }
    }

    // 5. Depth-of-field Text Blur & Ghost Bloom
    const textLayer = container.querySelector(`#jani-forbes-text-layer-${tplId}`);
    if (textLayer) {
      textLayer.style.filter = st.blur > 0.4 ? `blur(${st.blur.toFixed(1)}px)` : 'none';
    }

    const ghostMasthead = container.querySelector(`#jani-txt-ghost-masthead-${tplId}`);
    if (ghostMasthead) {
      ghostMasthead.style.opacity = st.ghostOpacity.toFixed(3);
      ghostMasthead.style.display = st.ghostOpacity > 0.02 ? 'block' : 'none';
    }

    // Audio SFX on flash hits
    if (st.flashTriggerNow && (data.enableFlashSFX !== false)) {
      triggerShutterSFX();
    }

    // Dynamic text content sync
    if (data) {
      const kickerEl = container.querySelector(`#jani-txt-kicker-${tplId}`);
      if (kickerEl && data.kickerBadge !== undefined) kickerEl.textContent = data.kickerBadge;

      const tickerLeft = container.querySelector(`#jani-txt-ticker-left-${tplId}`);
      if (tickerLeft && data.topTickerLeft !== undefined) tickerLeft.textContent = data.topTickerLeft;

      const tickerRight = container.querySelector(`#jani-txt-ticker-right-${tplId}`);
      if (tickerRight && data.topTickerRight !== undefined) tickerRight.textContent = data.topTickerRight;

      const mainMasthead = container.querySelector(`#jani-txt-main-masthead-${tplId}`);
      if (mainMasthead && data.magazineTitle !== undefined) mainMasthead.textContent = data.magazineTitle;

      if (ghostMasthead && data.magazineTitle !== undefined) ghostMasthead.textContent = data.magazineTitle;

      const fTag = container.querySelector(`#jani-txt-feature-tag-${tplId}`);
      if (fTag && data.featureTag !== undefined) fTag.textContent = data.featureTag;

      const fTitle = container.querySelector(`#jani-txt-feature-title-${tplId}`);
      if (fTitle && data.featureTitle !== undefined) fTitle.textContent = data.featureTitle;

      const sub1 = container.querySelector(`#jani-txt-subhead-1-${tplId}`);
      if (sub1 && data.subHeadline1 !== undefined) sub1.textContent = data.subHeadline1;

      const sub2 = container.querySelector(`#jani-txt-subhead-2-${tplId}`);
      if (sub2 && data.subHeadline2 !== undefined) sub2.textContent = data.subHeadline2;

      const sName = container.querySelector(`#jani-txt-subject-name-${tplId}`);
      if (sName && data.subjectName !== undefined) sName.textContent = data.subjectName;

      const sQuote = container.querySelector(`#jani-txt-subject-quote-${tplId}`);
      if (sQuote && data.subjectQuote !== undefined) sQuote.textContent = data.subjectQuote;
    }
  }

  /**
   * Mounts the Forbes 3D stage inside the modal preview or card container
   */
  window.tplMountForbes3DStage = function(container, data) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    container.innerHTML = buildForbesHtml(TEMPLATE_ID, d);
  };

  /**
   * High-performance Canvas Renderer for Timeline Playback and Export
   * Directly renders on canvas `ctx` at `t = currentTime - clip.start`.
   */
  window.renderJaniForbesCanvas = function(ctx, clip, t, cw, ch) {
    if (!ctx) return;
    const data = Object.assign({}, DEFAULT_CONFIG, (clip && clip.fxScene && clip.fxScene.entry && clip.fxScene.entry.contextualData) || {});
    const st = computeFrameState(data, t);

    ctx.save();

    // 1. Clear / Background Studio Plate
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, cw, ch);

    const grad = ctx.createRadialGradient(cw * 0.5, ch * 0.45, 10, cw * 0.5, ch * 0.45, Math.max(cw, ch) * 0.65);
    grad.addColorStop(0, '#151a29');
    grad.addColorStop(0.65, '#060912');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // 2. Camera Dolly & 3D Tilt Transformation
    ctx.translate(cw / 2, ch / 2);
    ctx.scale(st.zoom, st.zoom);

    // Skew / Perspective emulation in 2D Canvas matrix
    const radX = (st.tiltX * Math.PI) / 180;
    const radY = (st.tiltY * Math.PI) / 180;
    const radZ = (st.tiltZ * Math.PI) / 180;
    ctx.rotate(radZ);
    ctx.transform(Math.cos(radY), Math.sin(radX) * 0.35, -Math.sin(radY) * 0.25, Math.cos(radX), 0, 0);

    const coverW = 420;
    const coverH = 560;
    const cx = -coverW / 2;
    const cy = -coverH / 2;

    // Draw Magazine Plate Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(cx, cy, coverW, coverH);
    ctx.shadowColor = 'transparent';

    // 3. Subject Portrait
    const portImg = getCachedImage(data.portraitUrl || '/portrait_cutout_clean.png');
    if (portImg) {
      ctx.save();
      // Clip to cover bounds
      ctx.beginPath();
      ctx.rect(cx, cy, coverW, coverH);
      ctx.clip();

      // Apply brightness & contrast
      ctx.filter = `brightness(${st.brightness.toFixed(0)}%) contrast(${st.contrast.toFixed(0)}%)`;
      ctx.drawImage(portImg, cx, cy, coverW, coverH);
      ctx.restore();
    }

    // 4. Strobe Flash Overlay
    if (st.flashOverlayOpacity > 0.02) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = st.flashOverlayOpacity;
      const flashGrad = ctx.createRadialGradient(0, cy + 180, 20, 0, cy + 180, coverW * 0.6);
      flashGrad.addColorStop(0, '#ffffff');
      flashGrad.addColorStop(0.45, 'rgba(220, 240, 255, 0.7)');
      flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = flashGrad;
      ctx.fillRect(cx, cy, coverW, coverH);
      ctx.restore();
    }

    // 5. Anamorphic CRT Laser Beam (Image 3)
    if (st.beamActive && st.beamGlowAlpha > 0.02) {
      ctx.save();
      const beamY = cy + coverH * 0.40;
      ctx.globalAlpha = st.beamGlowAlpha;

      // Broad Blue Glow
      const beamGrad = ctx.createLinearGradient(cx - 100, beamY, cx + coverW + 100, beamY);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      beamGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.5)');
      beamGrad.addColorStop(0.5, '#ffffff');
      beamGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.5)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = beamGrad;
      ctx.fillRect(cx - 150, beamY - 24, coverW + 300, 48);

      // Core White Line
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = data.beamColor || '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillRect(cx - 150, beamY - (data.beamThickness || 3) / 2, coverW + 300, data.beamThickness || 3);

      // Anamorphic Optical Flare
      const flareGrad = ctx.createRadialGradient(cx + 80, beamY, 2, cx + 80, beamY, 70);
      flareGrad.addColorStop(0, '#ffffff');
      flareGrad.addColorStop(0.35, 'rgba(147, 197, 253, 0.85)');
      flareGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.ellipse(cx + 80, beamY, 70, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 6. Typography & Text Stack
    ctx.save();
    if (st.blur > 0.4) {
      ctx.filter = `blur(${st.blur.toFixed(1)}px)`;
    }

    // Top Kicker Badge
    if (data.showKickerBox !== false) {
      ctx.fillStyle = data.kickerBoxBg || '#ef4444';
      ctx.fillRect(-42, cy + 18, 84, 13);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 6.5px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.kickerBadge || 'SPECIAL ISSUE', 0, cy + 27.5);
    }

    // Ticker Headlines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '800 6px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(data.topTickerLeft || '', cx + 24, cy + 27.5);
    ctx.textAlign = 'right';
    ctx.fillText(data.topTickerRight || '', cx + coverW - 24, cy + 27.5);

    // Ghosted Masthead Duplicate (Image 2)
    if (st.ghostOpacity > 0.02) {
      ctx.save();
      ctx.globalAlpha = st.ghostOpacity;
      ctx.filter = 'blur(10px)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '900 82px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.magazineTitle || 'Forbes', 0, cy + 115);
      ctx.restore();
    }

    // Main Forbes Masthead
    ctx.fillStyle = data.mastheadColor || '#ffffff';
    ctx.font = '900 82px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.magazineTitle || 'Forbes', 0, cy + 110);

    // Bottom Left Features
    ctx.textAlign = 'left';
    ctx.font = 'italic 700 15px "Playfair Display", Georgia, serif';
    ctx.fillText(data.featureTag || '40th ANNUAL', cx + 24, cy + coverH - 80);

    ctx.font = '900 38px "Playfair Display", Georgia, serif';
    ctx.fillText(data.featureTitle || 'FORBES 400', cx + 24, cy + coverH - 44);

    ctx.font = '700 7px Inter, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(data.subHeadline1 || '', cx + 24, cy + coverH - 28);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(data.subHeadline2 || '', cx + 24, cy + coverH - 16);

    // Bottom Right Subject & Quote
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 8.5px Inter, sans-serif';
    ctx.fillText(data.subjectName || 'ALEXANDER VANCE', cx + coverW - 24, cy + coverH - 65);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 7.5px Georgia, serif';
    ctx.fillText(data.subjectQuote || '', cx + coverW - 24, cy + coverH - 48);

    ctx.restore();

    // 7. Subtle Border Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx, cy, coverW, coverH);

    ctx.restore();
  };

  /**
   * Builds the comprehensive contextual inspector UI with granular controls for everything on screen
   */
  window.tplBuildForbesInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});

    container.innerHTML = `
      <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(56,189,248,0.4); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.7);">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">⚡</span>
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px;">JAMES JANI FORBES 3D ENGINE</div>
              <div style="font-size: 9.5px; color: #38bdf8;">Granular Control Suite · Paparazzi Strobes & CRT Beam</div>
            </div>
          </div>
          <span style="font-size: 9px; font-weight: 800; background: rgba(56,189,248,0.2); color: #38bdf8; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.4);">AUTHENTIC JANI</span>
        </div>

        <!-- 1. Subject & Portrait Section -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #cbd5e1;">👤 Subject Portrait Asset (Not SBF)</span>
            <span style="font-size: 9px; color: #94a3b8;">Customizable Model</span>
          </div>

          <!-- Presets -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
            <button type="button" id="btn-forbes-preset-exec" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 4px; ${d.portraitPreset === 'executive' ? 'border-color:#38bdf8; background:rgba(56,189,248,0.2); color:#fff;' : ''}">👔 Tech Exec</button>
            <button type="button" id="btn-forbes-preset-founder" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 4px; ${d.portraitPreset === 'founder' ? 'border-color:#38bdf8; background:rgba(56,189,248,0.2); color:#fff;' : ''}">💼 Modern Founder</button>
            <button type="button" id="btn-forbes-preset-creator" class="btn btn-secondary btn-sm" style="font-size: 9px; padding: 4px; ${d.portraitPreset === 'creator' ? 'border-color:#38bdf8; background:rgba(56,189,248,0.2); color:#fff;' : ''}">🎬 Creator</button>
          </div>

          <!-- Custom Upload -->
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
            <label style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 5px 8px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2); border-radius: 6px; cursor: pointer; font-size: 10px; color: #94a3b8;">
              <span>📁 Upload Custom Portrait</span>
              <input type="file" id="inp-forbes-custom-portrait" accept="image/*" style="display: none;" />
            </label>
          </div>

          <!-- Brightness & Contrast -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Face Exposure</span><span id="val-forbes-brightness">${d.portraitBrightness}%</span>
              </div>
              <input type="range" id="slider-forbes-brightness" min="60" max="160" value="${d.portraitBrightness}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Contrast</span><span id="val-forbes-contrast">${d.portraitContrast}%</span>
              </div>
              <input type="range" id="slider-forbes-contrast" min="80" max="180" value="${d.portraitContrast}" style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 2. 3D Camera Dolly & Perspective Section -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #cbd5e1;">🎥 3D Camera Dolly & Perspective</span>
            <span style="font-size: 9px; color: #38bdf8;">Zoom Out & Settle Flat</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Start Zoom (Macro)</span><span id="val-forbes-start-zoom">${d.startZoom}x</span>
              </div>
              <input type="range" id="slider-forbes-start-zoom" min="1.4" max="3.5" step="0.05" value="${d.startZoom}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>End Zoom (Cover)</span><span id="val-forbes-end-zoom">${d.endZoom}x</span>
              </div>
              <input type="range" id="slider-forbes-end-zoom" min="0.8" max="1.5" step="0.05" value="${d.endZoom}" style="width: 100%;" />
            </div>
          </div>

          <!-- 3D Rotation Sliders -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
            <div>
              <div style="font-size: 8.5px; color: #94a3b8;">Pitch X: <b id="val-forbes-tilt-x">${d.startTiltX}°</b></div>
              <input type="range" id="slider-forbes-tilt-x" min="-30" max="30" value="${d.startTiltX}" style="width: 100%;" />
            </div>
            <div>
              <div style="font-size: 8.5px; color: #94a3b8;">Yaw Y: <b id="val-forbes-tilt-y">${d.startTiltY}°</b></div>
              <input type="range" id="slider-forbes-tilt-y" min="-30" max="30" value="${d.startTiltY}" style="width: 100%;" />
            </div>
            <div>
              <div style="font-size: 8.5px; color: #94a3b8;">Roll Z: <b id="val-forbes-tilt-z">${d.startTiltZ}°</b></div>
              <input type="range" id="slider-forbes-tilt-z" min="-20" max="20" value="${d.startTiltZ}" style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 3. Depth-of-Field & Text Blur Section -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #cbd5e1;">🌫️ Typography Blur & Ghost Bloom (Image 2)</span>
            <span style="font-size: 9px; color: #38bdf8;">Depth-of-Field Focus</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Start Text Blur</span><span id="val-forbes-start-blur">${d.startBlur}px</span>
              </div>
              <input type="range" id="slider-forbes-start-blur" min="0" max="35" value="${d.startBlur}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Ghost Bloom Opacity</span><span id="val-forbes-ghost-opacity">${d.ghostBloomOpacity}%</span>
              </div>
              <input type="range" id="slider-forbes-ghost-opacity" min="0" max="100" value="${d.ghostBloomOpacity}" style="width: 100%;" />
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
              <span>Blur Clears Up At</span><span id="val-forbes-resolve-time">${d.blurResolveTime}s</span>
            </div>
            <input type="range" id="slider-forbes-resolve-time" min="1.5" max="4.5" step="0.1" value="${d.blurResolveTime}" style="width: 100%;" />
          </div>
        </div>

        <!-- 4. Paparazzi Shutter Flashes Section -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #cbd5e1;">⚡ 4 Rapid Paparazzi Flashes</span>
            <label style="font-size: 9px; color: #94a3b8; display: flex; align-items: center; gap: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-forbes-sfx" ${d.enableFlashSFX !== false ? 'checked' : ''} /> Shutter Audio SFX
            </label>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Peak Exposure</span><span id="val-forbes-peak-flash">${d.flashPeakIntensity}%</span>
              </div>
              <input type="range" id="slider-forbes-peak-flash" min="120" max="320" value="${d.flashPeakIntensity}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Between Shadow Dip</span><span id="val-forbes-ambient-dip">${d.flashAmbientDip}%</span>
              </div>
              <input type="range" id="slider-forbes-ambient-dip" min="15" max="80" value="${d.flashAmbientDip}" style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 5. Anamorphic CRT TV Light Beam Section (Image 3) -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(56,189,248,0.25); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px;">💫</span>
              <span style="font-size: 11px; font-weight: 700; color: #38bdf8;">Anamorphic CRT TV Beam (Image 3)</span>
            </div>
            <span style="font-size: 8.5px; color: #94a3b8;">Streak Across Eyes</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Beam Trigger Time</span><span id="val-forbes-beam-time">${d.beamTriggerTime}s</span>
              </div>
              <input type="range" id="slider-forbes-beam-time" min="1.8" max="3.5" step="0.05" value="${d.beamTriggerTime}" style="width: 100%;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8;">
                <span>Face Bloom Surge</span><span id="val-forbes-beam-bloom">${d.beamFaceBloom}%</span>
              </div>
              <input type="range" id="slider-forbes-beam-bloom" min="120" max="260" value="${d.beamFaceBloom}" style="width: 100%;" />
            </div>
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <div style="flex: 1;">
              <div style="font-size: 9.5px; color: #94a3b8; margin-bottom: 2px;">Beam Flare Tint</div>
              <input type="color" id="picker-forbes-beam-color" value="${d.beamColor || '#38bdf8'}" style="width: 100%; height: 26px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: transparent; cursor: pointer;" />
            </div>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8; margin-bottom: 2px;">
                <span>Line Thickness</span><span id="val-forbes-beam-thick">${d.beamThickness}px</span>
              </div>
              <input type="range" id="slider-forbes-beam-thick" min="1" max="8" step="0.5" value="${d.beamThickness}" style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 6. Magazine Layout & Copy Section -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: #cbd5e1;">📰 Forbes Magazine Typography & Details</span>
            <span style="font-size: 9px; color: #94a3b8;">Editable Text</span>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Magazine Masthead</div>
              <input type="text" id="inp-forbes-title" value="${d.magazineTitle}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #fff; font-size: 11px;" />
            </div>
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Kicker Badge</div>
              <input type="text" id="inp-forbes-kicker" value="${d.kickerBadge}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #ef4444; font-weight: 800; font-size: 10px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Issue Tag</div>
              <input type="text" id="inp-forbes-feature-tag" value="${d.featureTag}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #fff; font-size: 10px;" />
            </div>
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Headline Feature</div>
              <input type="text" id="inp-forbes-feature-title" value="${d.featureTitle}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #fff; font-weight: 800; font-size: 11px;" />
            </div>
          </div>

          <div>
            <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Sub-Headline 1 (Record)</div>
            <input type="text" id="inp-forbes-sub1" value="${d.subHeadline1}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #cbd5e1; font-size: 10px;" />
          </div>

          <div>
            <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Sub-Headline 2 (Question / Hook)</div>
            <input type="text" id="inp-forbes-sub2" value="${d.subHeadline2}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #cbd5e1; font-size: 10px;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Subject Name</div>
              <input type="text" id="inp-forbes-subj-name" value="${d.subjectName}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #fff; font-size: 10px;" />
            </div>
            <div>
              <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">Subject Quote</div>
              <input type="text" id="inp-forbes-subj-quote" value="${d.subjectQuote}" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 5px 8px; color: #cbd5e1; font-size: 10px;" />
            </div>
          </div>
        </div>

        <!-- 7. Interactive Scrubber & Quick Actions -->
        <div style="background: rgba(2,6,23,0.6); border: 1px solid rgba(56,189,248,0.2); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 700; color: #38bdf8;">⏱️ Sequence Scrubber (0s - 5s)</span>
            <span id="val-forbes-playhead" style="font-family: monospace; font-size: 10px; color: #f8fafc;">0.00s</span>
          </div>
          <input type="range" id="slider-forbes-scrub" min="0" max="${d.duration || 5.0}" step="0.02" value="0" style="width: 100%;" />
          
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <button type="button" id="btn-forbes-toggle-play" class="btn btn-secondary btn-sm" style="flex: 1; font-size: 10px; padding: 6px;">
              ▶ Play Animation
            </button>
            <button type="button" id="btn-forbes-reset-defaults" class="btn btn-secondary btn-sm" style="font-size: 10px; padding: 6px; color: #94a3b8;">
              ↺ Reset
            </button>
          </div>
        </div>

      </div>
    `;

    // Wire Interactive Event Listeners
    wireForbesControls(container, tplId);
  };

  /**
   * Connects all event handlers in the inspector to live updates
   */
  function wireForbesControls(container, tplId) {
    if (!container) return;

    function update(patch) {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, patch);
      }
    }

    // 1. Portrait Presets
    container.querySelector('#btn-forbes-preset-exec')?.addEventListener('click', () => {
      update({ portraitUrl: '/ceo_portrait_cutout.jpg', portraitPreset: 'executive' });
      window.tplRenderContextualInspector(tplId);
    });

    container.querySelector('#btn-forbes-preset-founder')?.addEventListener('click', () => {
      update({ portraitUrl: '/portrait_cutout_clean.png', portraitPreset: 'founder' });
      window.tplRenderContextualInspector(tplId);
    });

    container.querySelector('#btn-forbes-preset-creator')?.addEventListener('click', () => {
      update({ portraitUrl: '/creator_portrait_cutout.png', portraitPreset: 'creator' });
      window.tplRenderContextualInspector(tplId);
    });

    // Custom Upload
    const customInp = container.querySelector('#inp-forbes-custom-portrait');
    customInp?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        update({ portraitUrl: url, portraitPreset: 'custom' });
        window.tplRenderContextualInspector(tplId);
      }
    });

    // Brightness & Contrast
    const sBright = container.querySelector('#slider-forbes-brightness');
    sBright?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      container.querySelector('#val-forbes-brightness').textContent = `${v}%`;
      update({ portraitBrightness: v });
    });

    const sContrast = container.querySelector('#slider-forbes-contrast');
    sContrast?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      container.querySelector('#val-forbes-contrast').textContent = `${v}%`;
      update({ portraitContrast: v });
    });

    // Zoom & 3D Tilt
    const sStartZoom = container.querySelector('#slider-forbes-start-zoom');
    sStartZoom?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-start-zoom').textContent = `${v.toFixed(2)}x`;
      update({ startZoom: v });
    });

    const sEndZoom = container.querySelector('#slider-forbes-end-zoom');
    sEndZoom?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-end-zoom').textContent = `${v.toFixed(2)}x`;
      update({ endZoom: v });
    });

    const sTiltX = container.querySelector('#slider-forbes-tilt-x');
    sTiltX?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-tilt-x').textContent = `${v}°`;
      update({ startTiltX: v });
    });

    const sTiltY = container.querySelector('#slider-forbes-tilt-y');
    sTiltY?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-tilt-y').textContent = `${v}°`;
      update({ startTiltY: v });
    });

    const sTiltZ = container.querySelector('#slider-forbes-tilt-z');
    sTiltZ?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-tilt-z').textContent = `${v}°`;
      update({ startTiltZ: v });
    });

    // Blur & Ghost Bloom
    const sStartBlur = container.querySelector('#slider-forbes-start-blur');
    sStartBlur?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-start-blur').textContent = `${v}px`;
      update({ startBlur: v });
    });

    const sGhostOp = container.querySelector('#slider-forbes-ghost-opacity');
    sGhostOp?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      container.querySelector('#val-forbes-ghost-opacity').textContent = `${v}%`;
      update({ ghostBloomOpacity: v });
    });

    const sResolveTime = container.querySelector('#slider-forbes-resolve-time');
    sResolveTime?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-resolve-time').textContent = `${v.toFixed(1)}s`;
      update({ blurResolveTime: v });
    });

    // Flashes
    const sPeakFlash = container.querySelector('#slider-forbes-peak-flash');
    sPeakFlash?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      container.querySelector('#val-forbes-peak-flash').textContent = `${v}%`;
      update({ flashPeakIntensity: v });
    });

    const sAmbientDip = container.querySelector('#slider-forbes-ambient-dip');
    sAmbientDip?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      container.querySelector('#val-forbes-ambient-dip').textContent = `${v}%`;
      update({ flashAmbientDip: v });
    });

    container.querySelector('#chk-forbes-sfx')?.addEventListener('change', (e) => {
      update({ enableFlashSFX: e.target.checked });
    });

    // Anamorphic Beam
    const sBeamTime = container.querySelector('#slider-forbes-beam-time');
    sBeamTime?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-beam-time').textContent = `${v.toFixed(2)}s`;
      update({ beamTriggerTime: v });
    });

    const sBeamBloom = container.querySelector('#slider-forbes-beam-bloom');
    sBeamBloom?.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      container.querySelector('#val-forbes-beam-bloom').textContent = `${v}%`;
      update({ beamFaceBloom: v });
    });

    const sBeamThick = container.querySelector('#slider-forbes-beam-thick');
    sBeamThick?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      container.querySelector('#val-forbes-beam-thick').textContent = `${v}px`;
      update({ beamThickness: v });
    });

    container.querySelector('#picker-forbes-beam-color')?.addEventListener('input', (e) => {
      update({ beamColor: e.target.value });
    });

    // Typography inputs
    const textFields = [
      ['#inp-forbes-title', 'magazineTitle'],
      ['#inp-forbes-kicker', 'kickerBadge'],
      ['#inp-forbes-feature-tag', 'featureTag'],
      ['#inp-forbes-feature-title', 'featureTitle'],
      ['#inp-forbes-sub1', 'subHeadline1'],
      ['#inp-forbes-sub2', 'subHeadline2'],
      ['#inp-forbes-subj-name', 'subjectName'],
      ['#inp-forbes-subj-quote', 'subjectQuote']
    ];
    textFields.forEach(([sel, key]) => {
      container.querySelector(sel)?.addEventListener('input', (e) => {
        update({ [key]: e.target.value });
      });
    });

    // Sequence Scrubber
    const scrub = container.querySelector('#slider-forbes-scrub');
    const playheadVal = container.querySelector('#val-forbes-playhead');
    const playBtn = container.querySelector('#btn-forbes-toggle-play');

    let isPlaying = false;
    let animId = null;
    let playStart = 0;
    let scrubOffset = 0;

    function renderScrubFrame(tVal) {
      if (playheadVal) playheadVal.textContent = `${tVal.toFixed(2)}s`;
      const curData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(tplId) : DEFAULT_CONFIG;
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        const st = computeFrameState(curData, tVal);
        applyStateToDOM(stage, tplId, st, curData);
      }
    }

    scrub?.addEventListener('input', (e) => {
      if (isPlaying) {
        isPlaying = false;
        if (playBtn) playBtn.textContent = '▶ Play Animation';
        cancelAnimationFrame(animId);
      }
      const tVal = parseFloat(e.target.value);
      scrubOffset = tVal;
      renderScrubFrame(tVal);
    });

    playBtn?.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.textContent = '⏸ Pause';
        playStart = performance.now() - (scrubOffset * 1000);
        function loop() {
          if (!isPlaying) return;
          const dur = 5.0;
          const elapsed = ((performance.now() - playStart) / 1000) % dur;
          scrubOffset = elapsed;
          if (scrub) scrub.value = elapsed;
          renderScrubFrame(elapsed);
          animId = requestAnimationFrame(loop);
        }
        animId = requestAnimationFrame(loop);
      } else {
        playBtn.textContent = '▶ Play Animation';
        cancelAnimationFrame(animId);
      }
    });

    // Reset Defaults
    container.querySelector('#btn-forbes-reset-defaults')?.addEventListener('click', () => {
      if (typeof window.tplSetContextualData === 'function') {
        window.tplSetContextualData(tplId, Object.assign({}, DEFAULT_CONFIG));
        window.tplRenderContextualInspector(tplId);
      }
    });
  }

  /**
   * Stepper callback for hover preview loop & live customizer stage
   */
  window.stepJaniForbesAnimation = function(container, tplId, manualT, data) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {});
    const st = computeFrameState(d, manualT);
    applyStateToDOM(container, tplId, st, d);
  };

  // Expose configuration & default metadata
  window.JANI_FORBES_CONFIG = DEFAULT_CONFIG;
  window.computeForbesFrameState = computeFrameState;
  window.buildForbesHtml = buildForbesHtml;

  console.log('[Forbes 3D Engine] Initialized James Jani Forbes 3D Template Engine');
})();
