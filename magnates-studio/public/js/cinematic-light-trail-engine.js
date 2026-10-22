/**
 * Cinematic Light Trail Typewriter & Glitch Reveal Engine
 * Replicating the signature high-tension cinematic title effect:
 * 1. Pitch-black moody cinematic background (changeable to user-uploaded image/video)
 * 2. Character-by-character typewriter animation with blinking cursor
 * 3. Directional trail of light (horizontal anamorphic flare streak, vertical, angled, or 360 radial)
 * 4. CRT scanlines, chromatic aberration, 35mm film dust & scratches
 * 5. High-frequency digital static glitch-out (Image 3 reproduction)
 * 6. Secondary target image reveal with optical flash / camera zoom transition
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'cinematic-light-trail-typewriter';

  const DEFAULT_CONFIG = {
    // 1. Typography & Content
    text: 'THIS IS NOT ONE OF THOSE STORIES',
    fontFamily: 'Oswald, "Bebas Neue", sans-serif',
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: 6,
    uppercase: true,
    textColor: '#ffffff',
    textGlowColor: '#ffffff',
    textGlowIntensity: 1.5,
    cursorStyle: '_',        // '_', '|', '█', 'none'
    cursorColor: '#ffffff',
    cursorBlinkSpeed: 2.5,   // Blinks per second
    typingDuration: 3.2,     // Duration in seconds to type all characters
    holdBeforeGlitch: 1.2,   // Seconds to hold completed text before glitch

    // 2. Light Trail & Direction
    lightDirection: 'horizontal', // 'horizontal', 'vertical', 'diagonal-down', 'diagonal-up', 'angle-custom', 'radial'
    lightAngle: 0,                // 0 - 360 degrees when angle-custom is active
    lightColor: '#ffffff',        // Streak flare color tint (white, cyan, amber, etc.)
    trailLength: 750,             // Beam spread / streak length in px
    beamIntensity: 2.2,           // Brightness multiplier for optical core
    bloomRadius: 28,              // Soft diffusion blur radius
    trailDecay: 0.7,              // Linger persistence of light trails on typed letters

    // 3. Background & Ambiance
    backgroundColor: '#000000',
    bgMediaUrl: '',               // User-uploaded image or video background
    bgDarkness: 0.85,             // Darkness dimming over background media
    vignetteIntensity: 0.85,      // Radial edge falloff

    // 4. Optical Effects & Texture
    scanlines: true,
    scanlineOpacity: 0.28,
    scanlineDensity: 3,           // Line spacing in px
    dustScratches: true,
    dustCount: 45,
    scratchIntensity: 0.35,
    chromaticAberration: true,
    chromaticOffset: 3.5,

    // 5. Glitch-Out Climax
    glitchEnabled: true,
    glitchIntensity: 1.35,        // Severity of slice displacement and noise
    glitchDuration: 0.65,         // Duration of the glitch transition
    glitchSlices: 24,             // Horizontal slice tear density

    // 6. Secondary Reveal Image
    revealMediaUrl: '/boardroom_scene_hd.jpg', // Default cinematic reveal plate
    revealStyle: 'flash-zoom',    // 'flash-zoom', 'glitch-cut', 'cross-dissolve'
    revealHoldDuration: 2.2,      // Seconds to display revealed image
    totalDuration: 7.2            // Total sequence length
  };

  // State instances keyed by stage element ID or singleton
  let activeState = Object.assign({}, DEFAULT_CONFIG);
  let animationTimer = null;
  let isPlaying = true;
  let currentTime = 0;
  let dustParticles = [];
  let scratchSegments = [];

  // Generate deterministic dust motes & scratches
  function initAtmosphereParticles(count) {
    dustParticles = [];
    scratchSegments = [];
    for (let i = 0; i < count; i++) {
      dustParticles.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.6 + Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.008,
        speedY: (Math.random() - 0.5) * 0.008,
        flickerOffset: Math.random() * 10
      });
    }
    for (let i = 0; i < 12; i++) {
      scratchSegments.push({
        x: Math.random(),
        y: Math.random(),
        length: 20 + Math.random() * 60,
        angle: (Math.random() - 0.5) * 0.3,
        opacity: 0.1 + Math.random() * 0.35,
        life: Math.random()
      });
    }
  }
  initAtmosphereParticles(DEFAULT_CONFIG.dustCount);

  // Cached media elements
  const imageCache = {};
  function getLoadedImage(url) {
    if (!url) return null;
    if (imageCache[url]) return imageCache[url];
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    imageCache[url] = img;
    return img;
  }

  // Preload default media
  getLoadedImage('/boardroom_scene_hd.jpg');

  /**
   * Calculate current phase & progress based on time
   */
  function computeSequencePhase(t, cfg) {
    const typeStart = 0.2;
    const typeEnd = typeStart + cfg.typingDuration;
    const holdEnd = typeEnd + cfg.holdBeforeGlitch;
    const glitchEnd = holdEnd + (cfg.glitchEnabled ? cfg.glitchDuration : 0);
    const revealEnd = glitchEnd + cfg.revealHoldDuration;

    let phase = 'typing';
    let typeProgress = 0;
    let glitchProgress = 0;
    let revealProgress = 0;

    if (t < typeStart) {
      phase = 'intro';
      typeProgress = 0;
    } else if (t < typeEnd) {
      phase = 'typing';
      typeProgress = Math.min(1, Math.max(0, (t - typeStart) / cfg.typingDuration));
    } else if (t < holdEnd) {
      phase = 'hold';
      typeProgress = 1;
    } else if (t < glitchEnd) {
      phase = 'glitch';
      typeProgress = 1;
      glitchProgress = (t - holdEnd) / cfg.glitchDuration;
    } else {
      phase = 'reveal';
      typeProgress = 1;
      glitchProgress = 1;
      revealProgress = Math.min(1, Math.max(0, (t - glitchEnd) / cfg.revealHoldDuration));
    }

    return {
      phase,
      typeProgress,
      glitchProgress,
      revealProgress,
      totalLength: revealEnd
    };
  }

  /**
   * Main Render Function
   */
  function renderFrame(ctx, width, height, t, cfg) {
    const timing = computeSequencePhase(t, cfg);

    // 1. Base Layer: Solid Color / Dark Void
    ctx.fillStyle = cfg.backgroundColor || '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. Custom Background Media (if uploaded / provided)
    if (cfg.bgMediaUrl) {
      const bgImg = getLoadedImage(cfg.bgMediaUrl);
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 1 - Math.min(0.98, Math.max(0, cfg.bgDarkness));
        // Cover scaling
        const imgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
        const canvasAspect = width / height;
        let dw, dh, dx, dy;
        if (canvasAspect > imgAspect) {
          dw = width;
          dh = width / imgAspect;
          dx = 0;
          dy = (height - dh) / 2;
        } else {
          dh = height;
          dw = height * imgAspect;
          dx = (width - dw) / 2;
          dy = 0;
        }
        ctx.drawImage(bgImg, dx, dy, dw, dh);
        ctx.restore();
      }
    }

    // 3. Ambient Fog / Radial Center Vignette
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.sqrt(cx * cx + cy * cy);
    const gradVignette = ctx.createRadialGradient(cx, cy, maxRadius * 0.15, cx, cy, maxRadius * 0.95);
    gradVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradVignette.addColorStop(0.65, `rgba(0, 0, 0, ${0.4 * cfg.vignetteIntensity})`);
    gradVignette.addColorStop(1, `rgba(0, 0, 0, ${0.98 * cfg.vignetteIntensity})`);
    ctx.fillStyle = gradVignette;
    ctx.fillRect(0, 0, width, height);

    // 4. Secondary Reveal Image (rendered underneath or over depending on phase)
    if (timing.phase === 'reveal' && cfg.revealMediaUrl) {
      const revealImg = getLoadedImage(cfg.revealMediaUrl);
      if (revealImg && revealImg.complete && revealImg.naturalWidth > 0) {
        ctx.save();
        const rp = timing.revealProgress;
        let revealAlpha = 1;
        let revealScale = 1;

        if (cfg.revealStyle === 'flash-zoom') {
          // Camera punch zoom into the revealed footage
          revealScale = 1.15 - rp * 0.15;
          revealAlpha = Math.min(1, rp * 3.5);
        } else if (cfg.revealStyle === 'glitch-cut') {
          revealScale = 1.02 + Math.sin(rp * 10) * 0.02 * (1 - rp);
          revealAlpha = rp > 0.05 ? 1 : rp / 0.05;
        } else {
          // Cross-dissolve
          revealScale = 1.0 + rp * 0.04;
          revealAlpha = Math.min(1, rp * 2.0);
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, revealAlpha));
        ctx.translate(cx, cy);
        ctx.scale(revealScale, revealScale);
        ctx.translate(-cx, -cy);

        const imgAspect = revealImg.naturalWidth / revealImg.naturalHeight;
        const canvasAspect = width / height;
        let rdw, rdh, rdx, rdy;
        if (canvasAspect > imgAspect) {
          rdw = width;
          rdh = width / imgAspect;
          rdx = 0;
          rdy = (height - rdh) / 2;
        } else {
          rdh = height;
          rdw = height * imgAspect;
          rdx = (width - rdw) / 2;
          rdy = 0;
        }
        ctx.drawImage(revealImg, rdx, rdy, rdw, rdh);

        // Flash burst on initial reveal frame
        if (rp < 0.25 && cfg.revealStyle === 'flash-zoom') {
          const flashIntensity = (1 - rp / 0.25) * 0.85;
          ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity})`;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();

        // If we are in full reveal mode with high alpha, skip typing rendering or fade it
        if (rp > 0.6) {
          drawAtmosphere(ctx, width, height, t, cfg);
          return;
        }
      }
    }

    // 5. Calculate Typewriter Text String & Active Character Count
    const fullText = cfg.uppercase ? (cfg.text || '').toUpperCase() : (cfg.text || '');
    const totalChars = fullText.length;
    const visibleCharCount = Math.floor(totalChars * timing.typeProgress);
    const visibleSubstring = fullText.slice(0, visibleCharCount);

    // Blinking cursor calculation
    let showCursor = false;
    if (cfg.cursorStyle && cfg.cursorStyle !== 'none' && timing.phase !== 'reveal') {
      const blinkCycle = (t * cfg.cursorBlinkSpeed) % 1;
      showCursor = blinkCycle < 0.55;
    }
    const displayedString = visibleSubstring + (showCursor ? cfg.cursorStyle : '');

    // Setup Text Layout & Font Metrics
    ctx.save();
    const activeFontSize = Math.round(cfg.fontSize * (width / 960));
    ctx.font = `${cfg.fontWeight} ${activeFontSize}px ${cfg.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Letter-spacing calculation helper
    const spacing = Math.round(cfg.letterSpacing * (width / 960));
    const textY = cy;

    // Helper to calculate total spaced text width
    function measureSpacedText(str) {
      let totalW = 0;
      for (let i = 0; i < str.length; i++) {
        totalW += ctx.measureText(str[i]).width + (i < str.length - 1 ? spacing : 0);
      }
      return totalW;
    }

    const textWidth = measureSpacedText(displayedString);
    const startX = cx - textWidth / 2;

    // Position of the most recently typed character (the leading tip of light)
    let leadCharX = cx;
    if (visibleCharCount > 0) {
      let curX = startX;
      for (let i = 0; i < visibleCharCount; i++) {
        const charW = ctx.measureText(displayedString[i] || '').width;
        if (i === visibleCharCount - 1) {
          leadCharX = curX + charW / 2;
        }
        curX += charW + spacing;
      }
    }

    // 6. RENDER LUMINOUS TRAIL OF LIGHT (Anamorphic Beams / Directional Streaks)
    // The trail emanates from the text line and focuses strongly on the leading edge!
    if (timing.phase !== 'reveal' && visibleCharCount > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Angle calculation
      let angleRad = 0;
      if (cfg.lightDirection === 'horizontal') {
        angleRad = 0;
      } else if (cfg.lightDirection === 'vertical') {
        angleRad = Math.PI / 2;
      } else if (cfg.lightDirection === 'diagonal-down') {
        angleRad = Math.PI / 4;
      } else if (cfg.lightDirection === 'diagonal-up') {
        angleRad = -Math.PI / 4;
      } else if (cfg.lightDirection === 'angle-custom') {
        angleRad = (cfg.lightAngle * Math.PI) / 180;
      }

      const beamLen = Math.max(100, cfg.trailLength * (width / 960));
      const beamCol = cfg.lightColor || '#ffffff';
      const beamInt = cfg.beamIntensity || 2.0;

      // Transform to beam center coordinate
      ctx.translate(cx, cy);
      if (cfg.lightDirection !== 'radial') {
        ctx.rotate(angleRad);
      }

      // 6a. Wide Anamorphic Streak Layer (Horizontal soft streak across canvas)
      const gradStreak = ctx.createLinearGradient(-beamLen, 0, beamLen, 0);
      gradStreak.addColorStop(0, 'rgba(0,0,0,0)');
      gradStreak.addColorStop(0.35, hexToRgba(beamCol, 0.15 * beamInt));
      gradStreak.addColorStop(0.5, hexToRgba(beamCol, 0.7 * beamInt));
      gradStreak.addColorStop(0.65, hexToRgba(beamCol, 0.15 * beamInt));
      gradStreak.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradStreak;
      // Elliptical beam profile: thin vertical height, wide horizontal spread
      ctx.fillRect(-beamLen, -activeFontSize * 0.35, beamLen * 2, activeFontSize * 0.7);

      // 6b. Intense Razor Core Beam (Hot center slice)
      const gradCore = ctx.createLinearGradient(-beamLen * 0.8, 0, beamLen * 0.8, 0);
      gradCore.addColorStop(0, 'rgba(255,255,255,0)');
      gradCore.addColorStop(0.42, hexToRgba(beamCol, 0.5 * beamInt));
      gradCore.addColorStop(0.5, 'rgba(255,255,255, 0.95)');
      gradCore.addColorStop(0.58, hexToRgba(beamCol, 0.5 * beamInt));
      gradCore.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.fillStyle = gradCore;
      ctx.fillRect(-beamLen * 0.8, -3, beamLen * 1.6, 6);

      // 6c. Radial Core Flare at Leading Typed Character Position
      const localLeadX = leadCharX - cx;
      const flareRadius = Math.max(15, cfg.bloomRadius * (width / 960));
      const gradFlare = ctx.createRadialGradient(localLeadX, 0, 2, localLeadX, 0, flareRadius * 2.5);
      gradFlare.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gradFlare.addColorStop(0.25, hexToRgba(beamCol, 0.65 * beamInt));
      gradFlare.addColorStop(0.7, hexToRgba(beamCol, 0.15 * beamInt));
      gradFlare.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradFlare;
      ctx.beginPath();
      ctx.arc(localLeadX, 0, flareRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Additional localized horizontal micro-streak at the lead character
      ctx.fillStyle = hexToRgba(beamCol, 0.85);
      ctx.fillRect(localLeadX - 160, -2, 320, 4);

      ctx.restore();
    }

    // 7. GLITCH-OUT PHASE (Matches Image 3 dc04cd52.png)
    // When text finishes or glitch triggers:
    // Slices text horizontally with displacement, CRT noise, chromatic split!
    if (timing.phase === 'glitch') {
      const gp = timing.glitchProgress;
      const gInt = cfg.glitchIntensity;

      // Draw normal text onto offscreen scratch buffer first
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d');
      offCtx.font = ctx.font;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'middle';

      // Render spaced characters on offscreen
      let drawX = startX;
      for (let i = 0; i < displayedString.length; i++) {
        const char = displayedString[i];
        const isCursor = (i === displayedString.length - 1 && showCursor);
        offCtx.fillStyle = isCursor ? cfg.cursorColor : cfg.textColor;
        offCtx.fillText(char, drawX, textY);
        drawX += ctx.measureText(char).width + spacing;
      }

      // Cut into random horizontal displacement slices
      const slices = Math.max(8, Math.min(48, Math.round(cfg.glitchSlices * (1 + Math.sin(gp * Math.PI) * 0.5))));
      const sliceH = height / slices;

      for (let s = 0; s < slices; s++) {
        const sy = s * sliceH;
        // Jitter calculation
        const noise = (Math.sin(s * 12.3 + gp * 45) * 43758.5453) % 1;
        const shiftMax = 35 * gInt;
        const shiftX = (noise - 0.5) * shiftMax * (Math.random() > 0.3 ? 1.5 : 0.2);

        // Slice chromatic split (Red / Cyan separation)
        if (cfg.chromaticAberration) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          // Red channel offset
          ctx.drawImage(offCanvas, 0, sy, width, sliceH, shiftX - 6 * gInt, sy, width, sliceH);
          ctx.fillStyle = 'rgba(255, 30, 80, 0.45)';
          ctx.fillRect(0, sy, width, sliceH);
          ctx.restore();

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          // Cyan channel offset
          ctx.drawImage(offCanvas, 0, sy, width, sliceH, shiftX + 6 * gInt, sy, width, sliceH);
          ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
          ctx.fillRect(0, sy, width, sliceH);
          ctx.restore();
        }

        // Main slice draw
        ctx.drawImage(offCanvas, 0, sy, width, sliceH, shiftX, sy, width, sliceH);

        // High frequency digital static raster lines over text area (Image 3 look)
        if (Math.abs(sy - textY) < activeFontSize * 1.5) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.5})`;
          for (let n = 0; n < 6; n++) {
            const rx = startX + Math.random() * textWidth;
            const rw = 15 + Math.random() * 45;
            ctx.fillRect(rx, sy + (n * sliceH) / 6, rw, 1.5);
          }
        }
      }

      // Glitch explosion flash strobe
      if (gp > 0.82) {
        const flashAlpha = (gp - 0.82) / 0.18;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.9})`;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
    } else if (timing.phase !== 'reveal') {
      // 8. NORMAL TYPOGRAPHY RENDERING (High fidelity glow & text)
      ctx.save();

      // Soft diffuse text glow
      if (cfg.textGlowIntensity > 0) {
        ctx.shadowColor = cfg.textGlowColor || '#ffffff';
        ctx.shadowBlur = Math.round(14 * cfg.textGlowIntensity * (width / 960));
      }

      // Draw individual characters with letter spacing
      let drawX = startX;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < displayedString.length; i++) {
        const char = displayedString[i];
        const isCursor = (i === displayedString.length - 1 && showCursor);
        const charW = ctx.measureText(char).width;

        ctx.fillStyle = isCursor ? cfg.cursorColor : cfg.textColor;
        ctx.fillText(char, drawX, textY);

        drawX += charW + spacing;
      }

      ctx.restore();
    }

    // 9. CRT SCANLINES OVERLAY (Horizontal broadcast lines)
    if (cfg.scanlines && cfg.scanlineOpacity > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${cfg.scanlineOpacity})`;
      const density = Math.max(2, Math.round(cfg.scanlineDensity));
      for (let y = 0; y < height; y += density) {
        ctx.fillRect(0, y, width, 1);
      }
      ctx.restore();
    }

    // 10. 35MM FILM DUST, PARTICLES & SCRATCHES (Matching Image 1 & 2)
    drawAtmosphere(ctx, width, height, t, cfg);

    ctx.restore();
  }

  /**
   * Procedural Dust & Film Scratches Rendering
   */
  function drawAtmosphere(ctx, width, height, t, cfg) {
    if (!cfg.dustScratches) return;

    ctx.save();
    // Floating dust motes
    for (let i = 0; i < dustParticles.length; i++) {
      const p = dustParticles[i];
      p.x = (p.x + p.speedX + 1) % 1;
      p.y = (p.y + p.speedY + 1) % 1;

      const px = p.x * width;
      const py = p.y * height;
      const flicker = 0.7 + 0.3 * Math.sin(t * 8 + p.flickerOffset);
      const alpha = p.opacity * flicker;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Film hair scratches (intermittent flickers)
    if (cfg.scratchIntensity > 0) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${cfg.scratchIntensity * 0.6})`;
      ctx.lineWidth = 1;
      for (let j = 0; j < scratchSegments.length; j++) {
        const sc = scratchSegments[j];
        if (Math.sin(t * 14 + j * 3.7) > 0.4) {
          const sx = sc.x * width + Math.sin(t * 30 + j) * 2;
          const sy = sc.y * height;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + Math.sin(sc.angle) * sc.length, sy + Math.cos(sc.angle) * sc.length);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  // Utility to convert hex to rgba
  function hexToRgba(hex, alpha) {
    if (!hex || hex[0] !== '#') return `rgba(255,255,255,${alpha})`;
    let c = hex.substring(1);
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Preset Backdrops
  const PRESET_BACKDROPS = [
    { id: 'pure-black', name: 'Black Screen', url: '', color: '#000000', darkness: 1.0 },
    { id: 'dark-fog', name: 'Smoky Void', url: '/creator_background_plate.png', color: '#030710', darkness: 0.88 },
    { id: 'boardroom', name: 'Boardroom', url: '/boardroom_scene_hd.jpg', color: '#000000', darkness: 0.75 },
    { id: 'tactical', name: 'War Room Desk', url: '/tactical_desk_hd_plate.png', color: '#000000', darkness: 0.8 },
    { id: 'cctv', name: 'Surveillance CCTV', url: '/cctv_surveillance_scene.jpg', color: '#000000', darkness: 0.78 }
  ];

  // Preset Reveal Targets
  const PRESET_REVEALS = [
    { id: 'boardroom', name: 'Boardroom Intrigue', url: '/boardroom_scene_hd.jpg' },
    { id: 'tactical', name: 'Tactical War Room', url: '/tactical_desk_hd_plate.png' },
    { id: 'cctv', name: 'Surveillance CCTV', url: '/cctv_surveillance_scene.jpg' },
    { id: 'pyramid', name: 'Pyramid Concrete Stage', url: '/pyramid_concrete_hd_plate.png' },
    { id: 'tokyo', name: 'Tokyo 1987 Night', url: '/tokyo_1987_cinematic.jpg' }
  ];

  /**
   * Mount stage DOM into Customizer Modal
   */
  window.tplMountCinematicLightTrailStage = function(stage, data) {
    if (!stage) return;
    activeState = Object.assign({}, DEFAULT_CONFIG, data || {});

    // High DPI Canvas & Interactive Stage Wrapper
    stage.innerHTML = `
      <div id="cinematic-light-trail-root" style="position: relative; width: 100%; height: 100%; overflow: hidden; background: #000000; display: flex; flex-direction: column; user-select: none;">
        <!-- Canvas Viewport -->
        <div style="position: relative; flex: 1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000;">
          <canvas id="cinematic-light-trail-canvas" style="display: block; max-width: 100%; max-height: 100%; width: 100%; height: 100%; aspect-ratio: 16/9; object-fit: contain;"></canvas>
          
          <!-- Watermark / Stage Mode Tag -->
          <div style="position: absolute; top: 12px; left: 14px; display: flex; align-items: center; gap: 8px; pointer-events: none; z-index: 10;">
            <span style="font-size: 10px; font-weight: 800; color: #ffffff; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase;">CINEMATIC LIGHT TRAIL</span>
            <span id="clt-badge-phase" style="font-size: 9.5px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">TYPING</span>
          </div>

          <!-- Timecode Pill -->
          <div style="position: absolute; top: 12px; right: 14px; font-family: monospace; font-size: 11px; font-weight: 700; color: #e2e8f0; background: rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.15); padding: 3px 9px; border-radius: 4px; z-index: 10;">
            <span id="clt-timecode-display">00:00.0</span> / <span id="clt-totaltime-display">07.2s</span>
          </div>
        </div>

        <!-- Embedded Bottom Scrubber & Control Bar -->
        <div style="height: 48px; background: rgba(10, 14, 23, 0.95); border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; padding: 0 16px; gap: 14px; z-index: 20;">
          <!-- Play / Pause Button -->
          <button type="button" id="clt-btn-play-pause" style="width: 30px; height: 30px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s;">
            <svg id="clt-icon-play" viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor; display: none;"><polygon points="6,4 20,12 6,20"></polygon></svg>
            <svg id="clt-icon-pause" viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor; display: block;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </button>

          <!-- Replay Button -->
          <button type="button" id="clt-btn-replay" title="Replay from start" style="width: 30px; height: 30px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); background: transparent; color: #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.2;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
          </button>

          <!-- Scrubber Range Slider -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">
            <input type="range" id="clt-timeline-scrubber" min="0" max="${activeState.totalDuration}" step="0.02" value="0" style="width: 100%; height: 5px; cursor: pointer; accent-color: #38bdf8;" />
            <!-- Visual Phase Track Indicators -->
            <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">
              <span>0.0s [Start]</span>
              <span>Typing Light Trail</span>
              <span style="color: #f43f5e;">⚡ Glitch</span>
              <span style="color: #38bdf8;">Image Reveal</span>
              <span>${activeState.totalDuration}s</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const canvas = stage.querySelector('#cinematic-light-trail-canvas');
    if (!canvas) return;

    // Canvas resize & render loop
    let dpr = window.devicePixelRatio || 1;
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const rw = rect.width > 0 ? rect.width : 960;
      const rh = rect.height > 0 ? rect.height : 540;
      canvas.width = Math.round(rw * dpr);
      canvas.height = Math.round(rh * dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Playback loop
    let lastStamp = performance.now();
    currentTime = 0;
    isPlaying = true;

    function loop(now) {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;

      if (isPlaying) {
        currentTime += dt;
        if (currentTime > activeState.totalDuration) {
          currentTime = 0; // Loop
        }
      }

      // Update UI elements
      const scrubber = stage.querySelector('#clt-timeline-scrubber');
      if (scrubber && !scrubber.matches(':active')) {
        scrubber.value = currentTime.toFixed(2);
      }
      const timecode = stage.querySelector('#clt-timecode-display');
      if (timecode) {
        const secs = Math.floor(currentTime);
        const tenths = Math.floor((currentTime % 1) * 10);
        timecode.textContent = `00:0${secs}.${tenths}`;
      }
      const phaseBadge = stage.querySelector('#clt-badge-phase');
      if (phaseBadge) {
        const p = computeSequencePhase(currentTime, activeState).phase;
        phaseBadge.textContent = p.toUpperCase();
        if (p === 'glitch') {
          phaseBadge.style.color = '#f43f5e';
          phaseBadge.style.borderColor = 'rgba(244,63,94,0.4)';
          phaseBadge.style.background = 'rgba(244,63,94,0.18)';
        } else if (p === 'reveal') {
          phaseBadge.style.color = '#38bdf8';
          phaseBadge.style.borderColor = 'rgba(56,189,248,0.4)';
          phaseBadge.style.background = 'rgba(56,189,248,0.18)';
        } else {
          phaseBadge.style.color = '#ffffff';
          phaseBadge.style.borderColor = 'rgba(255,255,255,0.3)';
          phaseBadge.style.background = 'rgba(255,255,255,0.12)';
        }
      }

      // Render
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderFrame(ctx, canvas.width, canvas.height, currentTime, activeState);
      }

      animationTimer = requestAnimationFrame(loop);
    }

    if (animationTimer) cancelAnimationFrame(animationTimer);
    animationTimer = requestAnimationFrame(loop);

    // Wire Play/Pause Controls
    const btnPlayPause = stage.querySelector('#clt-btn-play-pause');
    const iconPlay = stage.querySelector('#clt-icon-play');
    const iconPause = stage.querySelector('#clt-icon-pause');
    if (btnPlayPause) {
      btnPlayPause.onclick = () => {
        isPlaying = !isPlaying;
        if (iconPlay) iconPlay.style.display = isPlaying ? 'none' : 'block';
        if (iconPause) iconPause.style.display = isPlaying ? 'block' : 'none';
      };
    }

    // Wire Replay
    const btnReplay = stage.querySelector('#clt-btn-replay');
    if (btnReplay) {
      btnReplay.onclick = () => {
        currentTime = 0;
        isPlaying = true;
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
      };
    }

    // Wire Scrubber
    const scrubber = stage.querySelector('#clt-timeline-scrubber');
    if (scrubber) {
      scrubber.oninput = (e) => {
        currentTime = parseFloat(e.target.value);
      };
    }
  };

  /**
   * Step animation for timeline scrubbing and rendering exports
   */
  window.stepCinematicLightTrailAnimation = function(stage, tplId, time, data) {
    if (!stage) return;
    const canvas = stage.querySelector('#cinematic-light-trail-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cfg = Object.assign({}, DEFAULT_CONFIG, activeState, data || {});
    renderFrame(ctx, canvas.width, canvas.height, time, cfg);
  };

  /**
   * Update active parameters dynamically
   */
  window.tplUpdateCinematicLightTrail = function(params) {
    if (!params) return;
    Object.assign(activeState, params);
    if (params.dustCount !== undefined) {
      initAtmosphereParticles(activeState.dustCount);
    }
    if (typeof window.tplSetContextualData === 'function') {
      window.tplSetContextualData(TEMPLATE_ID, params);
    }
  };

  /**
   * Render the Granular Contextual Inspector Panel
   */
  window.tplBuildCinematicLightTrailInspector = function(container, data, tplId) {
    if (!container) return;
    const d = Object.assign({}, DEFAULT_CONFIG, data || {}, activeState);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding: 4px 0; color: #f1f5f9;">
        <!-- Header Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; align-items: center; gap: 7px;">
            <span style="font-size: 14px;">✨</span>
            <span style="font-size: 11px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.8px;">Cinematic Light Trail</span>
          </div>
          <span style="font-size: 9px; color: #38bdf8; font-weight: 700; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); padding: 2px 7px; border-radius: 4px;">HIGH IMPACT</span>
        </div>

        <!-- SECTION 1: TYPOGRAPHY & TEXT CONTENT -->
        <div style="display: flex; flex-direction: column; gap: 9px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Text & Typography</span>
            <span style="font-size: 9px; color: #64748b;">Character-by-character</span>
          </div>

          <!-- Text string input -->
          <div>
            <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Cinematic Text String</label>
            <input type="text" id="clt-inp-text" value="${d.text}" style="width: 100%; font-size: 11px; font-weight: 700; background: #070d18; border: 1px solid #1e293b; color: #fff; padding: 6px 8px; border-radius: 4px; box-sizing: border-box;" />
          </div>

          <!-- Font Family & Font Size -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Font Family</label>
              <select id="clt-sel-font" style="width: 100%; font-size: 11px; font-weight: 600; background: #070d18; border: 1px solid #1e293b; color: #fff; padding: 5px; border-radius: 4px;">
                <option value='Oswald, sans-serif' ${d.fontFamily.includes('Oswald') ? 'selected' : ''}>Oswald (Cinematic Tall)</option>
                <option value='"Bebas Neue", sans-serif' ${d.fontFamily.includes('Bebas') ? 'selected' : ''}>Bebas Neue (Bold Display)</option>
                <option value='Inter, sans-serif' ${d.fontFamily.includes('Inter') ? 'selected' : ''}>Inter (Modern Sans)</option>
                <option value='"JetBrains Mono", monospace' ${d.fontFamily.includes('Mono') ? 'selected' : ''}>JetBrains Mono (Terminal)</option>
                <option value='Cinzel, serif' ${d.fontFamily.includes('Cinzel') ? 'selected' : ''}>Cinzel (Dramatic Roman)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Font Size (<span id="clt-val-fontsize">${d.fontSize}px</span>)</label>
              <input type="range" id="clt-rng-fontsize" min="24" max="72" step="1" value="${d.fontSize}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>

          <!-- Letter Spacing & Text Color -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Letter Spacing (<span id="clt-val-spacing">${d.letterSpacing}px</span>)</label>
              <input type="range" id="clt-rng-spacing" min="0" max="18" step="1" value="${d.letterSpacing}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Text Color</label>
              <input type="color" id="clt-col-text" value="${d.textColor}" style="width: 100%; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
            </div>
          </div>

          <!-- Cursor Style & Blink Rate -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Cursor Style</label>
              <select id="clt-sel-cursor" style="width: 100%; font-size: 11px; font-weight: 600; background: #070d18; border: 1px solid #1e293b; color: #fff; padding: 5px; border-radius: 4px;">
                <option value="_" ${d.cursorStyle === '_' ? 'selected' : ''}>_ (Underscore - Original)</option>
                <option value="|" ${d.cursorStyle === '|' ? 'selected' : ''}>| (Vertical Pipe)</option>
                <option value="█" ${d.cursorStyle === '█' ? 'selected' : ''}>█ (Block Cursor)</option>
                <option value="none" ${d.cursorStyle === 'none' ? 'selected' : ''}>None (No Cursor)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Typing Speed (<span id="clt-val-typespeed">${d.typingDuration}s</span>)</label>
              <input type="range" id="clt-rng-typespeed" min="1.0" max="6.0" step="0.2" value="${d.typingDuration}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- SECTION 2: LIGHT TRAIL & BEAM DIRECTION -->
        <div style="display: flex; flex-direction: column; gap: 9px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Light Trail & Direction</span>
            <span style="font-size: 9px; color: #38bdf8; font-weight: 700;">ANAMORPHIC FLARE</span>
          </div>

          <!-- Direction Selector Buttons -->
          <div>
            <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 4px;">Light Beam Direction</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
              <button type="button" class="clt-btn-dir ${d.lightDirection === 'horizontal' ? 'active' : ''}" data-dir="horizontal" style="padding: 6px; font-size: 10px; font-weight: 700; border-radius: 5px; border: 1px solid ${d.lightDirection === 'horizontal' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${d.lightDirection === 'horizontal' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.lightDirection === 'horizontal' ? '#fff' : '#94a3b8'}; cursor: pointer;">↔ Horizontal</button>
              <button type="button" class="clt-btn-dir ${d.lightDirection === 'vertical' ? 'active' : ''}" data-dir="vertical" style="padding: 6px; font-size: 10px; font-weight: 700; border-radius: 5px; border: 1px solid ${d.lightDirection === 'vertical' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${d.lightDirection === 'vertical' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.lightDirection === 'vertical' ? '#fff' : '#94a3b8'}; cursor: pointer;">↕ Vertical</button>
              <button type="button" class="clt-btn-dir ${d.lightDirection === 'diagonal-down' ? 'active' : ''}" data-dir="diagonal-down" style="padding: 6px; font-size: 10px; font-weight: 700; border-radius: 5px; border: 1px solid ${d.lightDirection === 'diagonal-down' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${d.lightDirection === 'diagonal-down' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.lightDirection === 'diagonal-down' ? '#fff' : '#94a3b8'}; cursor: pointer;">↘ 45° Angle</button>
              <button type="button" class="clt-btn-dir ${d.lightDirection === 'diagonal-up' ? 'active' : ''}" data-dir="diagonal-up" style="padding: 6px; font-size: 10px; font-weight: 700; border-radius: 5px; border: 1px solid ${d.lightDirection === 'diagonal-up' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${d.lightDirection === 'diagonal-up' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.lightDirection === 'diagonal-up' ? '#fff' : '#94a3b8'}; cursor: pointer;">↗ 135° Angle</button>
              <button type="button" class="clt-btn-dir ${d.lightDirection === 'angle-custom' ? 'active' : ''}" data-dir="angle-custom" style="padding: 6px; font-size: 10px; font-weight: 700; border-radius: 5px; border: 1px solid ${d.lightDirection === 'angle-custom' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${d.lightDirection === 'angle-custom' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.lightDirection === 'angle-custom' ? '#fff' : '#94a3b8'}; cursor: pointer;">⚙ Custom °</button>
              <button type="button" class="clt-btn-dir ${d.lightDirection === 'radial' ? 'active' : ''}" data-dir="radial" style="padding: 6px; font-size: 10px; font-weight: 700; border-radius: 5px; border: 1px solid ${d.lightDirection === 'radial' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${d.lightDirection === 'radial' ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.lightDirection === 'radial' ? '#fff' : '#94a3b8'}; cursor: pointer;">⦿ 360° Radial</button>
            </div>
          </div>

          <!-- Custom Angle Dial (shown if custom) -->
          <div id="clt-wrap-custom-angle" style="display: ${d.lightDirection === 'angle-custom' ? 'block' : 'none'};">
            <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Angle Rotation (<span id="clt-val-angle">${d.lightAngle}°</span>)</label>
            <input type="range" id="clt-rng-angle" min="0" max="360" step="1" value="${d.lightAngle}" style="width: 100%; accent-color: #38bdf8;" />
          </div>

          <!-- Light Trail Color & Core Intensity -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Light Beam Color</label>
              <div style="display: flex; gap: 6px; align-items: center;">
                <input type="color" id="clt-col-light" value="${d.lightColor}" style="width: 100%; height: 26px; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
              </div>
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Beam Intensity (<span id="clt-val-beamint">${d.beamIntensity.toFixed(1)}x</span>)</label>
              <input type="range" id="clt-rng-beamint" min="0.5" max="4.0" step="0.1" value="${d.beamIntensity}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>

          <!-- Trail Spread / Length & Bloom Radius -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Beam Spread / Length (<span id="clt-val-traillen">${d.trailLength}px</span>)</label>
              <input type="range" id="clt-rng-traillen" min="150" max="1400" step="25" value="${d.trailLength}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Bloom Radius (<span id="clt-val-bloom">${d.bloomRadius}px</span>)</label>
              <input type="range" id="clt-rng-bloom" min="8" max="64" step="2" value="${d.bloomRadius}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- SECTION 3: BACKGROUND CUSTOMIZATION & UPLOAD -->
        <div style="display: flex; flex-direction: column; gap: 9px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Background Media</span>
            <span style="font-size: 9px; color: #38bdf8;">Upload or Select</span>
          </div>

          <!-- Quick Backdrop Presets -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
            ${PRESET_BACKDROPS.map(p => `
              <button type="button" class="clt-btn-bgpreset ${d.bgMediaUrl === p.url ? 'active' : ''}" data-url="${p.url}" data-color="${p.color}" data-darkness="${p.darkness}" style="padding: 5px 6px; font-size: 9.5px; font-weight: 600; border-radius: 4px; border: 1px solid ${d.bgMediaUrl === p.url ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${d.bgMediaUrl === p.url ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.bgMediaUrl === p.url ? '#fff' : '#94a3b8'}; cursor: pointer; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${p.name}</button>
            `).join('')}
          </div>

          <!-- File Upload Action -->
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 2px;">
            <label style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 10px; border-radius: 6px; background: rgba(56,189,248,0.12); border: 1px dashed rgba(56,189,248,0.4); color: #38bdf8; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
              <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 2.2;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span>+ Upload Custom Background</span>
              <input type="file" id="clt-file-bg" accept="image/*,video/*" style="display: none;" />
            </label>
            <button type="button" id="clt-btn-clear-bg" title="Reset to black screen" style="padding: 7px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: #94a3b8; font-size: 10px; cursor: pointer;">Pure Black</button>
          </div>

          <!-- Background Darkness & Vignette Sliders -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Darkness / Dimming (<span id="clt-val-bgdark">${Math.round(d.bgDarkness * 100)}%</span>)</label>
              <input type="range" id="clt-rng-bgdark" min="0" max="1" step="0.05" value="${d.bgDarkness}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Vignette Shadow (<span id="clt-val-vignette">${Math.round(d.vignetteIntensity * 100)}%</span>)</label>
              <input type="range" id="clt-rng-vignette" min="0" max="1" step="0.05" value="${d.vignetteIntensity}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- SECTION 4: GLITCH-OUT CLIMAX & IMAGE REVEAL -->
        <div style="display: flex; flex-direction: column; gap: 9px; background: rgba(244,63,94,0.04); padding: 10px; border-radius: 8px; border: 1px solid rgba(244,63,94,0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11px;">⚡</span>
              <span style="font-size: 10px; font-weight: 800; color: #f43f5e; text-transform: uppercase; letter-spacing: 0.5px;">Glitch-Out & Image Reveal</span>
            </div>
            <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <input type="checkbox" id="clt-chk-glitch" ${d.glitchEnabled ? 'checked' : ''} style="accent-color: #f43f5e;" />
              <span style="font-size: 9.5px; color: #f43f5e; font-weight: 700;">Glitch Active</span>
            </label>
          </div>

          <!-- Glitch Severity & Glitch Duration -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Glitch Intensity (<span id="clt-val-glitchint">${d.glitchIntensity.toFixed(1)}x</span>)</label>
              <input type="range" id="clt-rng-glitchint" min="0.2" max="2.5" step="0.1" value="${d.glitchIntensity}" style="width: 100%; accent-color: #f43f5e;" />
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Glitch Duration (<span id="clt-val-glitchdur">${d.glitchDuration}s</span>)</label>
              <input type="range" id="clt-rng-glitchdur" min="0.2" max="1.5" step="0.05" value="${d.glitchDuration}" style="width: 100%; accent-color: #f43f5e;" />
            </div>
          </div>

          <!-- Secondary Image Reveal Selection -->
          <div>
            <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Secondary Revealed Scene Plate</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-bottom: 6px;">
              ${PRESET_REVEALS.map(r => `
                <button type="button" class="clt-btn-revealpreset ${d.revealMediaUrl === r.url ? 'active' : ''}" data-url="${r.url}" style="padding: 5px 6px; font-size: 9.5px; font-weight: 600; border-radius: 4px; border: 1px solid ${d.revealMediaUrl === r.url ? '#f43f5e' : 'rgba(255,255,255,0.1)'}; background: ${d.revealMediaUrl === r.url ? 'rgba(244,63,94,0.2)' : 'rgba(0,0,0,0.3)'}; color: ${d.revealMediaUrl === r.url ? '#fff' : '#94a3b8'}; cursor: pointer; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${r.name}</button>
              `).join('')}
            </div>

            <!-- Upload Reveal Media -->
            <label style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 10px; border-radius: 6px; background: rgba(244,63,94,0.12); border: 1px dashed rgba(244,63,94,0.4); color: #f43f5e; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
              <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 2.2;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span>+ Upload Secondary Image/Video</span>
              <input type="file" id="clt-file-reveal" accept="image/*,video/*" style="display: none;" />
            </label>
          </div>

          <!-- Reveal Transition Style -->
          <div>
            <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Reveal Transition Style</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
              <button type="button" class="clt-btn-style ${d.revealStyle === 'flash-zoom' ? 'active' : ''}" data-style="flash-zoom" style="padding: 5px; font-size: 9.5px; font-weight: 700; border-radius: 4px; border: 1px solid ${d.revealStyle === 'flash-zoom' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}; background: ${d.revealStyle === 'flash-zoom' ? 'rgba(244,63,94,0.2)' : 'rgba(0,0,0,0.3)'}; color: #fff; cursor: pointer;">Camera Flash Zoom</button>
              <button type="button" class="clt-btn-style ${d.revealStyle === 'glitch-cut' ? 'active' : ''}" data-style="glitch-cut" style="padding: 5px; font-size: 9.5px; font-weight: 700; border-radius: 4px; border: 1px solid ${d.revealStyle === 'glitch-cut' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}; background: ${d.revealStyle === 'glitch-cut' ? 'rgba(244,63,94,0.2)' : 'rgba(0,0,0,0.3)'}; color: #fff; cursor: pointer;">Glitch Cut</button>
              <button type="button" class="clt-btn-style ${d.revealStyle === 'cross-dissolve' ? 'active' : ''}" data-style="cross-dissolve" style="padding: 5px; font-size: 9.5px; font-weight: 700; border-radius: 4px; border: 1px solid ${d.revealStyle === 'cross-dissolve' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}; background: ${d.revealStyle === 'cross-dissolve' ? 'rgba(244,63,94,0.2)' : 'rgba(0,0,0,0.3)'}; color: #fff; cursor: pointer;">Cross Dissolve</button>
            </div>
          </div>
        </div>

        <!-- SECTION 5: ATMOSPHERIC TEXTURE & OPTICAL POLISH -->
        <div style="display: flex; flex-direction: column; gap: 9px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Atmosphere, CRT & Grain</span>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            <label style="display: flex; align-items: center; gap: 5px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="clt-chk-scanlines" ${d.scanlines ? 'checked' : ''} style="accent-color: #38bdf8;" />
              <span>CRT Scanlines</span>
            </label>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="clt-chk-dust" ${d.dustScratches ? 'checked' : ''} style="accent-color: #38bdf8;" />
              <span>Dust & Scratches</span>
            </label>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 10px; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" id="clt-chk-chroma" ${d.chromaticAberration ? 'checked' : ''} style="accent-color: #38bdf8;" />
              <span>RGB Aberration</span>
            </label>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Scanline Opacity (<span id="clt-val-scanlines">${Math.round(d.scanlineOpacity * 100)}%</span>)</label>
              <input type="range" id="clt-rng-scanlines" min="0" max="0.8" step="0.05" value="${d.scanlineOpacity}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <label style="font-size: 9px; color: #64748b; display: block; margin-bottom: 3px;">Dust Particle Count (<span id="clt-val-dustcount">${d.dustCount}</span>)</label>
              <input type="range" id="clt-rng-dustcount" min="0" max="100" step="5" value="${d.dustCount}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>
      </div>
    `;

    // WIRE ALL INSPECTOR EVENTS
    // Text String
    const inpText = container.querySelector('#clt-inp-text');
    if (inpText) inpText.oninput = (e) => window.tplUpdateCinematicLightTrail({ text: e.target.value });

    // Font Select
    const selFont = container.querySelector('#clt-sel-font');
    if (selFont) selFont.onchange = (e) => window.tplUpdateCinematicLightTrail({ fontFamily: e.target.value });

    // Font Size
    const rngFontSize = container.querySelector('#clt-rng-fontsize');
    const valFontSize = container.querySelector('#clt-val-fontsize');
    if (rngFontSize) rngFontSize.oninput = (e) => {
      valFontSize.textContent = `${e.target.value}px`;
      window.tplUpdateCinematicLightTrail({ fontSize: parseInt(e.target.value, 10) });
    };

    // Spacing
    const rngSpacing = container.querySelector('#clt-rng-spacing');
    const valSpacing = container.querySelector('#clt-val-spacing');
    if (rngSpacing) rngSpacing.oninput = (e) => {
      valSpacing.textContent = `${e.target.value}px`;
      window.tplUpdateCinematicLightTrail({ letterSpacing: parseInt(e.target.value, 10) });
    };

    // Text Color
    const colText = container.querySelector('#clt-col-text');
    if (colText) colText.oninput = (e) => window.tplUpdateCinematicLightTrail({ textColor: e.target.value });

    // Cursor Select
    const selCursor = container.querySelector('#clt-sel-cursor');
    if (selCursor) selCursor.onchange = (e) => window.tplUpdateCinematicLightTrail({ cursorStyle: e.target.value });

    // Type Speed
    const rngTypeSpeed = container.querySelector('#clt-rng-typespeed');
    const valTypeSpeed = container.querySelector('#clt-val-typespeed');
    if (rngTypeSpeed) rngTypeSpeed.oninput = (e) => {
      valTypeSpeed.textContent = `${e.target.value}s`;
      window.tplUpdateCinematicLightTrail({ typingDuration: parseFloat(e.target.value) });
    };

    // Direction buttons
    const wrapAngle = container.querySelector('#clt-wrap-custom-angle');
    container.querySelectorAll('.clt-btn-dir').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.clt-btn-dir').forEach(b => {
          b.style.borderColor = 'rgba(255,255,255,0.1)';
          b.style.background = 'rgba(0,0,0,0.3)';
          b.style.color = '#94a3b8';
        });
        btn.style.borderColor = '#38bdf8';
        btn.style.background = 'rgba(56,189,248,0.2)';
        btn.style.color = '#fff';
        const dir = btn.dataset.dir;
        if (wrapAngle) wrapAngle.style.display = (dir === 'angle-custom') ? 'block' : 'none';
        window.tplUpdateCinematicLightTrail({ lightDirection: dir });
      };
    });

    // Custom Angle Slider
    const rngAngle = container.querySelector('#clt-rng-angle');
    const valAngle = container.querySelector('#clt-val-angle');
    if (rngAngle) rngAngle.oninput = (e) => {
      valAngle.textContent = `${e.target.value}°`;
      window.tplUpdateCinematicLightTrail({ lightAngle: parseInt(e.target.value, 10) });
    };

    // Light Color
    const colLight = container.querySelector('#clt-col-light');
    if (colLight) colLight.oninput = (e) => window.tplUpdateCinematicLightTrail({ lightColor: e.target.value });

    // Beam Intensity
    const rngBeamInt = container.querySelector('#clt-rng-beamint');
    const valBeamInt = container.querySelector('#clt-val-beamint');
    if (rngBeamInt) rngBeamInt.oninput = (e) => {
      valBeamInt.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
      window.tplUpdateCinematicLightTrail({ beamIntensity: parseFloat(e.target.value) });
    };

    // Trail Length
    const rngTrailLen = container.querySelector('#clt-rng-traillen');
    const valTrailLen = container.querySelector('#clt-val-traillen');
    if (rngTrailLen) rngTrailLen.oninput = (e) => {
      valTrailLen.textContent = `${e.target.value}px`;
      window.tplUpdateCinematicLightTrail({ trailLength: parseInt(e.target.value, 10) });
    };

    // Bloom Radius
    const rngBloom = container.querySelector('#clt-rng-bloom');
    const valBloom = container.querySelector('#clt-val-bloom');
    if (rngBloom) rngBloom.oninput = (e) => {
      valBloom.textContent = `${e.target.value}px`;
      window.tplUpdateCinematicLightTrail({ bloomRadius: parseInt(e.target.value, 10) });
    };

    // Background Presets
    container.querySelectorAll('.clt-btn-bgpreset').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.clt-btn-bgpreset').forEach(b => {
          b.style.borderColor = 'rgba(255,255,255,0.1)';
          b.style.background = 'rgba(0,0,0,0.3)';
          b.style.color = '#94a3b8';
        });
        btn.style.borderColor = '#38bdf8';
        btn.style.background = 'rgba(56,189,248,0.2)';
        btn.style.color = '#fff';
        window.tplUpdateCinematicLightTrail({
          bgMediaUrl: btn.dataset.url,
          backgroundColor: btn.dataset.color,
          bgDarkness: parseFloat(btn.dataset.darkness)
        });
      };
    });

    // Custom Background File Upload
    const fileBg = container.querySelector('#clt-file-bg');
    if (fileBg) {
      fileBg.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          window.tplUpdateCinematicLightTrail({ bgMediaUrl: url });
        }
      };
    }

    // Clear Background to Pure Black
    const btnClearBg = container.querySelector('#clt-btn-clear-bg');
    if (btnClearBg) {
      btnClearBg.onclick = () => {
        window.tplUpdateCinematicLightTrail({
          bgMediaUrl: '',
          backgroundColor: '#000000',
          bgDarkness: 1.0
        });
      };
    }

    // BG Darkness & Vignette Sliders
    const rngBgDark = container.querySelector('#clt-rng-bgdark');
    const valBgDark = container.querySelector('#clt-val-bgdark');
    if (rngBgDark) rngBgDark.oninput = (e) => {
      valBgDark.textContent = `${Math.round(parseFloat(e.target.value) * 100)}%`;
      window.tplUpdateCinematicLightTrail({ bgDarkness: parseFloat(e.target.value) });
    };

    const rngVignette = container.querySelector('#clt-rng-vignette');
    const valVignette = container.querySelector('#clt-val-vignette');
    if (rngVignette) rngVignette.oninput = (e) => {
      valVignette.textContent = `${Math.round(parseFloat(e.target.value) * 100)}%`;
      window.tplUpdateCinematicLightTrail({ vignetteIntensity: parseFloat(e.target.value) });
    };

    // Glitch Toggle & Sliders
    const chkGlitch = container.querySelector('#clt-chk-glitch');
    if (chkGlitch) chkGlitch.onchange = (e) => window.tplUpdateCinematicLightTrail({ glitchEnabled: e.target.checked });

    const rngGlitchInt = container.querySelector('#clt-rng-glitchint');
    const valGlitchInt = container.querySelector('#clt-val-glitchint');
    if (rngGlitchInt) rngGlitchInt.oninput = (e) => {
      valGlitchInt.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
      window.tplUpdateCinematicLightTrail({ glitchIntensity: parseFloat(e.target.value) });
    };

    const rngGlitchDur = container.querySelector('#clt-rng-glitchdur');
    const valGlitchDur = container.querySelector('#clt-val-glitchdur');
    if (rngGlitchDur) rngGlitchDur.oninput = (e) => {
      valGlitchDur.textContent = `${parseFloat(e.target.value).toFixed(2)}s`;
      window.tplUpdateCinematicLightTrail({ glitchDuration: parseFloat(e.target.value) });
    };

    // Reveal Presets
    container.querySelectorAll('.clt-btn-revealpreset').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.clt-btn-revealpreset').forEach(b => {
          b.style.borderColor = 'rgba(255,255,255,0.1)';
          b.style.background = 'rgba(0,0,0,0.3)';
          b.style.color = '#94a3b8';
        });
        btn.style.borderColor = '#f43f5e';
        btn.style.background = 'rgba(244,63,94,0.2)';
        btn.style.color = '#fff';
        window.tplUpdateCinematicLightTrail({ revealMediaUrl: btn.dataset.url });
      };
    });

    // Reveal File Upload
    const fileReveal = container.querySelector('#clt-file-reveal');
    if (fileReveal) {
      fileReveal.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          window.tplUpdateCinematicLightTrail({ revealMediaUrl: url });
        }
      };
    }

    // Reveal Styles
    container.querySelectorAll('.clt-btn-style').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.clt-btn-style').forEach(b => {
          b.style.borderColor = 'rgba(255,255,255,0.1)';
          b.style.background = 'rgba(0,0,0,0.3)';
        });
        btn.style.borderColor = '#f43f5e';
        btn.style.background = 'rgba(244,63,94,0.2)';
        window.tplUpdateCinematicLightTrail({ revealStyle: btn.dataset.style });
      };
    });

    // Atmospheric Checkboxes
    const chkScanlines = container.querySelector('#clt-chk-scanlines');
    if (chkScanlines) chkScanlines.onchange = (e) => window.tplUpdateCinematicLightTrail({ scanlines: e.target.checked });

    const chkDust = container.querySelector('#clt-chk-dust');
    if (chkDust) chkDust.onchange = (e) => window.tplUpdateCinematicLightTrail({ dustScratches: e.target.checked });

    const chkChroma = container.querySelector('#clt-chk-chroma');
    if (chkChroma) chkChroma.onchange = (e) => window.tplUpdateCinematicLightTrail({ chromaticAberration: e.target.checked });

    const rngScanlines = container.querySelector('#clt-rng-scanlines');
    const valScanlines = container.querySelector('#clt-val-scanlines');
    if (rngScanlines) rngScanlines.oninput = (e) => {
      valScanlines.textContent = `${Math.round(parseFloat(e.target.value) * 100)}%`;
      window.tplUpdateCinematicLightTrail({ scanlineOpacity: parseFloat(e.target.value) });
    };

    const rngDustCount = container.querySelector('#clt-rng-dustcount');
    const valDustCount = container.querySelector('#clt-val-dustcount');
    if (rngDustCount) rngDustCount.oninput = (e) => {
      valDustCount.textContent = e.target.value;
      window.tplUpdateCinematicLightTrail({ dustCount: parseInt(e.target.value, 10) });
    };
  };

})();
