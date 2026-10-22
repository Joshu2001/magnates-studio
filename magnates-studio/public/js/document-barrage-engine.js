/**
 * Granular Document Barrage & Screen-Filling Dossier Suite (2.0)
 * 
 * Signature Documentary Investigation Effect (As seen in crypto & high-profile documentary exposés):
 * 1. Background Environment:
 *    - Cinematic out-of-focus background with customizable blur level (0px to 40px),
 *      dark moody backdrop, custom vignette, and floating ambient dust particles.
 * 2. Cascading Pop-In Sequence:
 *    - Documents (or user-uploaded textures / photos / evidence sheets) start appearing one by one in the room,
 *      filling up the screen layer upon layer.
 *    - Configurable entrance animations:
 *      * "slam" (impact drop with camera shake & drop shadow)
 *      * "drift-in" (gentle floating drift with organic rotation)
 *      * "whip-slide" (snappy lateral directional slide)
 *      * "depth-dive" (rushing from far back or zooming from foreground)
 * 3. Pro Editor Granular Calibration:
 *    - Background blur amount, brightness & saturation tint
 *    - Entrance speed, stagger offset between documents, total duration
 *    - Rotation randomness / fan spread angle
 *    - Document stack scale, depth perspective (perspective 3D), tilt X/Y
 *    - Broadcast News Lower-Third banner overlay (headline, subtext, channel badge)
 *    - Custom object types: 'documents', 'photos', 'evidence-polaroids', or 'custom-upload'
 *    - Sound design: Multi-layered paper slams, slides, shutter clicks & deep subbass bloom
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'document-barrage-suite';

  const DEFAULT_CONFIG = {
    // Background Blur & Mood
    bgBlurAmount: 14,             // Background blur in pixels (0 - 40px)
    bgBrightness: 0.55,           // Dim level for backdrop (0.1 - 1.2)
    bgSaturation: 0.85,           // Saturation of backdrop
    bgVignette: 0.65,             // Edge darkening (0 - 1)
    bgImageUrl: '/boardroom_scene_hd.jpg', // Room/backdrop image
    
    // Ambient Atmosphere
    dustParticles: true,
    dustCount: 35,
    crtScanlines: true,
    filmGrain: 0.15,

    // Timing & Sequencing
    duration: 6.5,                // Total template cycle duration (seconds)
    staggerDelay: 0.38,           // Delay between document arrivals (seconds)
    entranceStyle: 'slam',        // 'slam', 'drift-in', 'whip-slide', 'depth-dive'
    entranceDuration: 0.42,       // Duration of individual entrance animation (seconds)
    elasticBounciness: 0.35,      // Spring / overshoot impact amount (0 - 1)
    impactShake: true,            // Micro camera shake on document landing

    // Visual Styling & Layout
    objectType: 'documents',      // 'documents', 'photos', 'polaroids', 'mixed'
    fillCoverage: 1.05,           // How aggressively documents spread to fill the screen (0.6 - 1.5)
    stackScale: 0.95,             // Overall document scale multiplier
    randomRotationMax: 14,        // Max degrees rotation tilt (+/- deg)
    dropShadowDepth: 28,          // Box shadow blur radius
    dropShadowOpacity: 0.65,      // Box shadow darkness
    glowHighlight: false,         // Luminous edge accent on active arrival

    // Perspective & 3D Depth
    perspective3D: 1000,          // CSS 3D perspective distance (px)
    tiltX: 6,                     // Room pitch angle
    tiltY: -4,                    // Room yaw angle

    // Broadcast News Lower Third (As seen in reference screenshot)
    showLowerThird: true,
    lowerThirdHeadline: 'CRYPTO-PROMOTING CELEBRITIES UNDER FIRE',
    lowerThirdSubheadline: 'THE MULTI-BILLION DOLLAR CLASS-ACTION LAWSUIT',
    lowerThirdNetwork: 'NBC NEWS',
    lowerThirdNetworkColor: '#0284c7', // Broadcast brand blue

    // Audio SFX Integration
    soundEnabled: true,
    soundVolume: 0.8,
    sfxType: 'slam',              // 'slam', 'slide', 'stamp', 'camera'

    // Document Items List (Supports adding, editing, replacing with custom images)
    items: [
      {
        id: 'doc-1',
        title: 'Delaware Bankruptcy Petition',
        url: 'legal_court_filing_doc1.svg',
        x: -12, // Offset X (% of frame)
        y: -10, // Offset Y (% of frame)
        rot: -4,
        scale: 1.02
      },
      {
        id: 'doc-2',
        title: 'Class-Action Complaint SDNY',
        url: 'legal_court_filing_doc2.svg',
        x: 16,
        y: -14,
        rot: 6,
        scale: 1.05
      },
      {
        id: 'doc-3',
        title: 'Forensic Restructuring Declaration',
        url: 'legal_court_filing_doc3.svg',
        x: -16,
        y: 12,
        rot: -8,
        scale: 1.0
      },
      {
        id: 'doc-4',
        title: 'Celebrity Subpoena Schedule',
        url: 'legal_court_filing_doc4.svg',
        x: 12,
        y: 10,
        rot: 5,
        scale: 1.08
      },
      {
        id: 'doc-5',
        title: 'Internal Audit Leak',
        url: 'legal_court_filing_doc1.svg',
        x: -2,
        y: -2,
        rot: 1,
        scale: 1.12
      },
      {
        id: 'doc-6',
        title: 'Promotional Wire Ledger',
        url: 'legal_court_filing_doc2.svg',
        x: 4,
        y: 4,
        rot: -2,
        scale: 1.15
      }
    ]
  };

  let audioCtx = null;
  function playAudioFile(url, vol = 0.8) {
    try {
      const a = new Audio(url);
      a.volume = Math.max(0, Math.min(1, vol));
      a.play().catch(() => {});
    } catch (e) {}
  }

  let lastSoundTriggeredIndex = -1;

  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  /**
   * Builds the preview stage DOM
   */
  function buildDocumentBarrageHtml(tplId, customData) {
    const cfg = Object.assign({}, DEFAULT_CONFIG, customData || {});
    return `
      <div id="doc-barrage-container" style="
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #020408;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        perspective: ${cfg.perspective3D}px;
      ">
        <!-- Blurred Background Layer -->
        <div id="doc-barrage-bg" style="
          position: absolute;
          inset: -30px;
          background-image: url('${cfg.bgImageUrl}');
          background-size: cover;
          background-position: center;
          filter: blur(${cfg.bgBlurAmount}px) brightness(${cfg.bgBrightness}) saturate(${cfg.bgSaturation});
          transform: scale(1.08);
          transition: filter 0.2s ease;
          pointer-events: none;
        "></div>

        <!-- Atmospheric Vignette & Color Grade Overlay -->
        <div id="doc-barrage-vignette" style="
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,${cfg.bgVignette}) 100%);
          pointer-events: none;
        "></div>

        <!-- Film Scanlines Overlay (As seen in news / doc broadcast) -->
        <div id="doc-barrage-scanlines" style="
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%);
          background-size: 100% 4px;
          opacity: ${cfg.crtScanlines ? 0.35 : 0};
          pointer-events: none;
        "></div>

        <!-- 3D Room Stage for Stacking Documents -->
        <div id="doc-barrage-stage" style="
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(${cfg.tiltX}deg) rotateY(${cfg.tiltY}deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- Documents generated dynamically in step loop -->
          <div id="doc-barrage-stack" style="position: relative; width: 100%; height: 100%; transform-style: preserve-3d;"></div>
        </div>

        <!-- Broadcast Lower Third (NBC News investigative style) -->
        <div id="doc-barrage-lowerthird" style="
          position: absolute;
          bottom: 24px;
          left: 40px;
          right: 40px;
          display: ${cfg.showLowerThird ? 'flex' : 'none'};
          flex-direction: column;
          align-items: flex-start;
          z-index: 60;
          pointer-events: none;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8));
          transform: translateZ(120px);
        ">
          <div style="
            display: flex;
            align-items: stretch;
            background: #1e3a5f;
            border-top: 2px solid #38bdf8;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
            height: 44px;
            max-width: 90%;
          ">
            <div style="
              background: ${cfg.lowerThirdNetworkColor};
              color: #ffffff;
              font-family: 'Inter', sans-serif;
              font-weight: 900;
              font-size: 14px;
              letter-spacing: 1.5px;
              padding: 0 18px;
              display: flex;
              align-items: center;
              border-right: 2px solid rgba(255, 255, 255, 0.2);
            ">
              ${cfg.lowerThirdNetwork}
            </div>
            <div style="
              padding: 0 20px;
              color: #f8fafc;
              font-family: 'Impact', 'Bebas Neue', sans-serif;
              font-size: 21px;
              letter-spacing: 1.8px;
              display: flex;
              align-items: center;
              text-transform: uppercase;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">
              ${cfg.lowerThirdHeadline}
            </div>
          </div>

          <div style="
            background: rgba(10, 15, 25, 0.92);
            padding: 5px 16px;
            color: #f59e0b;
            font-family: 'Inter', 'Oswald', sans-serif;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            border-left: 3px solid #f59e0b;
            margin-top: 4px;
          ">
            ${cfg.lowerThirdSubheadline}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Evaluates individual document position and arrival progress along time t
   */
  function stepDocumentBarrageAnimation(stage, tplId, t, customData) {
    if (!stage) return;
    const cfg = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(tplId) : null), customData || {});
    const container = stage.querySelector('#doc-barrage-container') || stage;
    const stack = container.querySelector('#doc-barrage-stack');
    const bg = container.querySelector('#doc-barrage-bg');
    if (!stack) return;

    // Background blur update
    if (bg) {
      bg.style.filter = `blur(${cfg.bgBlurAmount}px) brightness(${cfg.bgBrightness}) saturate(${cfg.bgSaturation})`;
    }

    const items = cfg.items || DEFAULT_CONFIG.items;
    const totalTime = cfg.duration || 6.5;
    const loopT = (t % totalTime + totalTime) % totalTime;

    let html = '';
    let highestActiveIndex = -1;

    items.forEach((item, index) => {
      const enterStart = index * cfg.staggerDelay;
      const enterDur = cfg.entranceDuration || 0.42;

      // Check if document has appeared
      if (loopT < enterStart) {
        return; // Has not appeared yet!
      }

      highestActiveIndex = index;
      const progress = Math.min(1.0, (loopT - enterStart) / Math.max(0.01, enterDur));

      // Entrance animation easing
      let xOffset = 0;
      let yOffset = 0;
      let zOffset = 0;
      let scaleMod = 1.0;
      let rotMod = 0;
      let opacity = 1.0;

      const style = cfg.entranceStyle || 'slam';

      if (style === 'slam') {
        // Starts oversized and high up, slams down with bounce
        const eased = easeOutBack(progress);
        scaleMod = 1.6 - 0.6 * eased;
        zOffset = (1 - progress) * 180;
        yOffset = -80 * (1 - progress);
        opacity = Math.min(1.0, progress * 3);
      } else if (style === 'drift-in') {
        const eased = easeOutCubic(progress);
        scaleMod = 0.85 + 0.15 * eased;
        yOffset = 45 * (1 - eased);
        rotMod = (1 - eased) * 15;
        opacity = eased;
      } else if (style === 'whip-slide') {
        const eased = easeOutCubic(progress);
        const dir = index % 2 === 0 ? -1 : 1;
        xOffset = dir * 280 * (1 - eased);
        rotMod = dir * 18 * (1 - eased);
        opacity = eased;
      } else if (style === 'depth-dive') {
        const eased = easeOutBack(progress);
        scaleMod = 0.3 + 0.7 * eased;
        zOffset = -300 * (1 - eased);
        opacity = eased;
      }

      // Base target transform
      const baseX = item.x * (cfg.fillCoverage || 1.0);
      const baseY = item.y * (cfg.fillCoverage || 1.0);
      const baseRot = item.rot;
      const baseScale = (item.scale || 1.0) * (cfg.stackScale || 1.0);

      const finalX = `calc(${baseX}% + ${xOffset}px)`;
      const finalY = `calc(${baseY}% + ${yOffset}px)`;
      const finalZ = (index * 8) + zOffset;
      const finalRot = baseRot + rotMod;
      const finalScale = baseScale * scaleMod;

      const shadowBlur = cfg.dropShadowDepth || 24;
      const shadowColor = `rgba(0,0,0,${cfg.dropShadowOpacity || 0.65})`;

      // Active pop highlight if just arrived
      const isJustArrived = progress < 0.95;
      const borderAccent = (cfg.glowHighlight && isJustArrived) ? '0 0 15px rgba(56, 189, 248, 0.85)' : 'none';

      html += `
        <div class="barrage-doc-item" data-index="${index}" style="
          position: absolute;
          left: 50%;
          top: 50%;
          width: 320px;
          height: 414px;
          margin-left: -160px;
          margin-top: -207px;
          transform-origin: center center;
          transform: translate3d(${finalX}, ${finalY}, ${finalZ}px) rotate(${finalRot}deg) scale(${finalScale});
          box-shadow: 0 14px ${shadowBlur}px ${shadowColor};
          box-shadow: 0 14px ${shadowBlur}px ${shadowColor}${borderAccent !== 'none' ? ', ' + borderAccent : ''};
          opacity: ${opacity};
          pointer-events: auto;
          cursor: pointer;
          border-radius: 3px;
          overflow: hidden;
          background: #ffffff;
        ">
          <img src="${item.url}" alt="${item.title}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          " />
        </div>
      `;
    });

    stack.innerHTML = html;

    // Trigger acoustic SFX upon new document landing
    if (cfg.soundEnabled && highestActiveIndex !== lastSoundTriggeredIndex) {
      if (highestActiveIndex > lastSoundTriggeredIndex && highestActiveIndex >= 0) {
        let sfx = 'sfx_paper_slam.wav';
        if (cfg.sfxType === 'slide') sfx = 'sfx_paper_slide.wav';
        else if (cfg.sfxType === 'stamp') sfx = 'sfx_paper_stamp.wav';
        else if (cfg.sfxType === 'camera') sfx = 'sfx_camera_dslr.wav';

        playAudioFile(sfx, cfg.soundVolume || 0.8);

        // Shake stage lightly if impactShake enabled
        if (cfg.impactShake) {
          const shakeStage = container.querySelector('#doc-barrage-stage');
          if (shakeStage) {
            const mag = 4;
            const sx = (Math.random() - 0.5) * mag;
            const sy = (Math.random() - 0.5) * mag;
            shakeStage.style.transform = `rotateX(${cfg.tiltX + sy}deg) rotateY(${cfg.tiltY + sx}deg) translate(${sx}px, ${sy}px)`;
            setTimeout(() => {
              if (shakeStage) shakeStage.style.transform = `rotateX(${cfg.tiltX}deg) rotateY(${cfg.tiltY}deg)`;
            }, 80);
          }
        }
      }
      lastSoundTriggeredIndex = highestActiveIndex;
    }
  }

  /**
   * Mounts the stage in the customizer preview
   */
  function tplMountDocumentBarrageStage(stage, data) {
    if (!stage) return;
    stage.innerHTML = buildDocumentBarrageHtml(TEMPLATE_ID, data);
    stepDocumentBarrageAnimation(stage, TEMPLATE_ID, 0, data);
  }

  /**
   * Builds the Pro Editor Customizer Inspector Controls
   */
  function tplBuildDocumentBarrageInspector(container, data, tplId) {
    if (!container) return;
    const cfg = Object.assign({}, DEFAULT_CONFIG, (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData(tplId) : null), data || {});

    function commitChange(patch) {
      if (typeof window.tplSetContextualData === 'function') {
        const cur = window.tplGetContextualData(tplId) || {};
        const updated = Object.assign({}, cur, patch);
        window.tplSetContextualData(tplId, updated);
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage) stepDocumentBarrageAnimation(stage, tplId, 0, updated);
      }
    }

    let itemsHtml = '';
    (cfg.items || []).forEach((doc, idx) => {
      itemsHtml += `
        <div style="
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 8px;
        ">
          <div style="
            width: 38px;
            height: 48px;
            background: #fff;
            border-radius: 3px;
            overflow: hidden;
            flex-shrink: 0;
            border: 1px solid #38bdf8;
          ">
            <img src="${doc.url}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 12px; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${idx + 1}. ${doc.title}
            </div>
            <div style="font-size: 10px; color: #94a3b8;">X: ${doc.x}% | Y: ${doc.y}% | Rot: ${doc.rot}°</div>
          </div>
          <label style="
            cursor: pointer;
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            border: 1px solid #38bdf8;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
          ">
            Replace
            <input type="file" accept="image/*" style="display: none;" onchange="
              const file = this.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const items = [...window.tplGetContextualData('${tplId}').items];
                  items[${idx}].url = e.target.result;
                  window.tplSetContextualData('${tplId}', { items });
                  window.tplRenderContextualInspector('${tplId}');
                  const stage = document.getElementById('tpl-modal-preview-stage');
                  if (stage && typeof window.stepDocumentBarrageAnimation === 'function') {
                    window.stepDocumentBarrageAnimation(stage, '${tplId}', 0, window.tplGetContextualData('${tplId}'));
                  }
                };
                reader.readAsDataURL(file);
              }
            " />
          </label>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="padding: 14px; font-family: 'Inter', sans-serif; color: #e2e8f0; font-size: 13px;">
        
        <!-- Header Info -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #0284c7; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">Pro Editor</span>
            <span style="font-weight: 800; font-size: 14px; color: #38bdf8;">Screen-Filling Document Barrage</span>
          </div>
          <button id="doc-barrage-reset-btn" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; padding: 4px 8px; font-size: 10px; font-weight: 700; cursor: pointer;">Reset Defaults</button>
        </div>

        <!-- Section: Background & Blur Calibration -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Background Room & Depth Blur
          </div>

          <!-- Blur Slider -->
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span>Background Blur Level</span>
              <span id="val-bg-blur" style="color: #38bdf8; font-weight: 700;">${cfg.bgBlurAmount}px</span>
            </div>
            <input type="range" id="input-bg-blur" min="0" max="40" step="1" value="${cfg.bgBlurAmount}" style="width: 100%; accent-color: #38bdf8;" />
          </div>

          <!-- Dim & Saturation -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Backdrop Brightness</span>
                <span id="val-bg-bright">${cfg.bgBrightness}</span>
              </div>
              <input type="range" id="input-bg-bright" min="0.1" max="1.2" step="0.05" value="${cfg.bgBrightness}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Vignette Darkness</span>
                <span id="val-bg-vignette">${cfg.bgVignette}</span>
              </div>
              <input type="range" id="input-bg-vignette" min="0" max="1" step="0.05" value="${cfg.bgVignette}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- Section: Entrance Timing & Choreography -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Entrance & Choreography Calibration
          </div>

          <div style="margin-bottom: 10px;">
            <label style="display: block; font-size: 11px; margin-bottom: 4px;">Entrance Style</label>
            <select id="select-entrance-style" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 6px 8px; border-radius: 4px; font-size: 12px;">
              <option value="slam" ${cfg.entranceStyle === 'slam' ? 'selected' : ''}>Heavy Slam & Rebound (Impact Bounce)</option>
              <option value="drift-in" ${cfg.entranceStyle === 'drift-in' ? 'selected' : ''}>Smooth Floating Drift (Investigation Hold)</option>
              <option value="whip-slide" ${cfg.entranceStyle === 'whip-slide' ? 'selected' : ''}>Lateral Whip-Slide (High Velocity)</option>
              <option value="depth-dive" ${cfg.entranceStyle === 'depth-dive' ? 'selected' : ''}>3D Depth Dive (Forward Rush)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Stagger Delay</span>
                <span id="val-stagger" style="color: #38bdf8; font-weight: 700;">${cfg.staggerDelay}s</span>
              </div>
              <input type="range" id="input-stagger" min="0.1" max="1.0" step="0.02" value="${cfg.staggerDelay}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Cycle Duration</span>
                <span id="val-duration" style="color: #38bdf8; font-weight: 700;">${cfg.duration}s</span>
              </div>
              <input type="range" id="input-duration" min="3.0" max="12.0" step="0.5" value="${cfg.duration}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- Section: Screen Fill Spread & Perspective -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Screen-Filling Spread & 3D Tilt
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Fill Coverage</span>
                <span id="val-fill">${cfg.fillCoverage}x</span>
              </div>
              <input type="range" id="input-fill" min="0.5" max="1.6" step="0.05" value="${cfg.fillCoverage}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Document Scale</span>
                <span id="val-scale">${cfg.stackScale}x</span>
              </div>
              <input type="range" id="input-scale" min="0.6" max="1.5" step="0.05" value="${cfg.stackScale}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Pitch (Tilt X)</span>
                <span id="val-tilt-x">${cfg.tiltX}°</span>
              </div>
              <input type="range" id="input-tilt-x" min="-25" max="25" step="1" value="${cfg.tiltX}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Yaw (Tilt Y)</span>
                <span id="val-tilt-y">${cfg.tiltY}°</span>
              </div>
              <input type="range" id="input-tilt-y" min="-25" max="25" step="1" value="${cfg.tiltY}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- Section: Broadcast Lower-Third Banner -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 12px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              Broadcast Lower-Third Overlay
            </div>
            <input type="checkbox" id="check-lowerthird" ${cfg.showLowerThird ? 'checked' : ''} style="accent-color: #38bdf8;" />
          </div>

          <div style="margin-bottom: 8px;">
            <label style="display: block; font-size: 11px; margin-bottom: 3px;">Network Badge Text</label>
            <input type="text" id="input-lt-net" value="${cfg.lowerThirdNetwork}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 5px 8px; border-radius: 4px; font-size: 12px;" />
          </div>

          <div style="margin-bottom: 8px;">
            <label style="display: block; font-size: 11px; margin-bottom: 3px;">Headline Banner</label>
            <input type="text" id="input-lt-head" value="${cfg.lowerThirdHeadline}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 5px 8px; border-radius: 4px; font-size: 12px;" />
          </div>

          <div>
            <label style="display: block; font-size: 11px; margin-bottom: 3px;">Sub-Headline / Topic Description</label>
            <input type="text" id="input-lt-sub" value="${cfg.lowerThirdSubheadline}" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 5px 8px; border-radius: 4px; font-size: 12px;" />
          </div>
        </div>

        <!-- Section: Document Items & Uploads -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-weight: 700; color: #38bdf8; font-size: 12px; display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Stacked Objects & Evidence Items
            </div>
            <label style="
              cursor: pointer;
              background: #0284c7;
              color: #ffffff;
              font-size: 11px;
              font-weight: 700;
              padding: 4px 10px;
              border-radius: 4px;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            ">
              + Add Custom Object
              <input type="file" id="input-add-custom-obj" accept="image/*" style="display: none;" />
            </label>
          </div>

          <div id="doc-barrage-items-list">
            ${itemsHtml}
          </div>
        </div>

        <!-- Section: Sound Design -->
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 12px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
              Acoustic Sound Design
            </div>
            <input type="checkbox" id="check-sound-enabled" ${cfg.soundEnabled ? 'checked' : ''} style="accent-color: #38bdf8;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="display: block; font-size: 11px; margin-bottom: 3px;">Paper Landing Sound</label>
              <select id="select-sfx-type" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 5px 8px; border-radius: 4px; font-size: 12px;">
                <option value="slam" ${cfg.sfxType === 'slam' ? 'selected' : ''}>Heavy Paper Slam</option>
                <option value="slide" ${cfg.sfxType === 'slide' ? 'selected' : ''}>Paper Flutter & Slide</option>
                <option value="stamp" ${cfg.sfxType === 'stamp' ? 'selected' : ''}>Court Stamp Click</option>
                <option value="camera" ${cfg.sfxType === 'camera' ? 'selected' : ''}>DSLR Investigation Shutter</option>
              </select>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>SFX Volume</span>
                <span id="val-sfx-vol">${Math.round(cfg.soundVolume * 100)}%</span>
              </div>
              <input type="range" id="input-sfx-vol" min="0" max="1" step="0.05" value="${cfg.soundVolume}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

      </div>
    `;

    // Event Listeners
    const bindRange = (id, valId, key, suffix = '') => {
      const el = container.querySelector(id);
      const valEl = container.querySelector(valId);
      if (el) {
        el.addEventListener('input', (e) => {
          const v = parseFloat(e.target.value);
          if (valEl) valEl.textContent = v + suffix;
          commitChange({ [key]: v });
        });
      }
    };

    bindRange('#input-bg-blur', '#val-bg-blur', 'bgBlurAmount', 'px');
    bindRange('#input-bg-bright', '#val-bg-bright', 'bgBrightness');
    bindRange('#input-bg-vignette', '#val-bg-vignette', 'bgVignette');
    bindRange('#input-stagger', '#val-stagger', 'staggerDelay', 's');
    bindRange('#input-duration', '#val-duration', 'duration', 's');
    bindRange('#input-fill', '#val-fill', 'fillCoverage', 'x');
    bindRange('#input-scale', '#val-scale', 'stackScale', 'x');
    bindRange('#input-tilt-x', '#val-tilt-x', 'tiltX', '°');
    bindRange('#input-tilt-y', '#val-tilt-y', 'tiltY', '°');
    bindRange('#input-sfx-vol', '#val-sfx-vol', 'soundVolume', '');

    const selStyle = container.querySelector('#select-entrance-style');
    if (selStyle) {
      selStyle.addEventListener('change', (e) => commitChange({ entranceStyle: e.target.value }));
    }

    const selSfx = container.querySelector('#select-sfx-type');
    if (selSfx) {
      selSfx.addEventListener('change', (e) => commitChange({ sfxType: e.target.value }));
    }

    const chkLt = container.querySelector('#check-lowerthird');
    if (chkLt) {
      chkLt.addEventListener('change', (e) => commitChange({ showLowerThird: e.target.checked }));
    }

    const chkSnd = container.querySelector('#check-sound-enabled');
    if (chkSnd) {
      chkSnd.addEventListener('change', (e) => commitChange({ soundEnabled: e.target.checked }));
    }

    const txtLtNet = container.querySelector('#input-lt-net');
    if (txtLtNet) {
      txtLtNet.addEventListener('input', (e) => commitChange({ lowerThirdNetwork: e.target.value }));
    }

    const txtLtHead = container.querySelector('#input-lt-head');
    if (txtLtHead) {
      txtLtHead.addEventListener('input', (e) => commitChange({ lowerThirdHeadline: e.target.value }));
    }

    const txtLtSub = container.querySelector('#input-lt-sub');
    if (txtLtSub) {
      txtLtSub.addEventListener('input', (e) => commitChange({ lowerThirdSubheadline: e.target.value }));
    }

    const addObjInput = container.querySelector('#input-add-custom-obj');
    if (addObjInput) {
      addObjInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            const curItems = [...(cfg.items || DEFAULT_CONFIG.items)];
            const rx = (Math.random() - 0.5) * 36;
            const ry = (Math.random() - 0.5) * 28;
            const rrot = (Math.random() - 0.5) * 24;
            curItems.push({
              id: 'doc-user-' + Date.now(),
              title: file.name.replace(/\.[^/.]+$/, ''),
              url: re.target.result,
              x: Math.round(rx),
              y: Math.round(ry),
              rot: Math.round(rrot),
              scale: 1.05
            });
            commitChange({ items: curItems });
            tplBuildDocumentBarrageInspector(container, { items: curItems }, tplId);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const resetBtn = container.querySelector('#doc-barrage-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        commitChange(Object.assign({}, DEFAULT_CONFIG));
        tplBuildDocumentBarrageInspector(container, DEFAULT_CONFIG, tplId);
      });
    }
  }

  // Export to window
  window.DOCUMENT_BARRAGE_CONFIG = DEFAULT_CONFIG;
  window.buildDocumentBarrageHtml = buildDocumentBarrageHtml;
  window.stepDocumentBarrageAnimation = stepDocumentBarrageAnimation;
  window.tplMountDocumentBarrageStage = tplMountDocumentBarrageStage;
  window.tplBuildDocumentBarrageInspector = tplBuildDocumentBarrageInspector;

})();
