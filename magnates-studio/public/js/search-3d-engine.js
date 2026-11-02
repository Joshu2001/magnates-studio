/**
 * Regaarder Studio — Google Search Documentary Typing Engine (Pixel-Perfect Reference Image 3)
 *
 * Features:
 * - Authentic multi-color vector SVG Google logo (exact geometric Product Sans paths + angled 'e' crossbar)
 * - Reference Image 3 diagonal warm orange/magenta/violet/blue Aurora Light Waves at top-right & bottom-left
 * - Frosted dark glass card with top-left milky frost, 2px white-ice specular border, and warm/violet corner refraction
 * - Intense neon sky-blue glowing search pill with live typing caret '|'
 * - 3 rounded suggestion capsules (brighter frosted steel-blue 1st row, deeper translucent slate 2nd & 3rd rows, bold 'return')
 * - True 3D Interactive Spatial Orbit when 3D Mode is active + Live 3D Keyframe Motion Recorder (● Record 3D Motion)
 * - Video Mode 2D direct drag & locked-aspect-ratio corner resizing (Compact 35%, Standard 65% default, Fullscreen 95%)
 */
(function() {
  'use strict';

  let activeTypingTimer = null;
  let activeKeyframeRaf = null;
  let activeResizeObserver = null;
  let motionRecordState = {
    isRecording: false,
    startTime: 0,
    frames: []
  };

  const GOOGLE_DEFAULTS = {
    query: 'how to invest in index funds',
    suggestion: 'top index funds for passive wealth',
    suggestion2: 's&p 500 historical annual return',
    suggestion3: 'vanguard vs fidelity index funds',
    sizePreset: 'standard',     // 'compact' (35%) | 'standard' (65%) | 'fullscreen' (95%) | 'custom'
    widthPercent: 65,           // 25% to 98% of video canvas width
    lockAspectRatio: true,      // Locked proportional scaling by default
    posX: 0,                    // % offset from center (-45 to +45)
    posY: 0,                    // % offset from center (-45 to +45)
    rotationDeg: 0,             // Z-axis rotation (-45° to +45°)
    is3DMode: false,            // False = front-facing Reference Image 3; True = 3D spatial orbit rig
    tiltX: 0,                   // 3D X-tilt (-35° to +35°)
    tiltY: 0,                   // 3D Y-tilt (-45° to +45°)
    auroraEnabled: true,        // Reference Image 3 diagonal orange/magenta/blue aurora waves ON by default
    auroraIntensity: 95,        // 0% to 100%
    cardBlurPx: 24,             // Glass backdrop blur
    rimGlowIntensity: 95,       // Specular border glow intensity
    styleMode: 'cinematic',     // 'cinematic' (Ref Image 3 Dark Frosted Glass) | 'light-glass' | 'midnight'
    typingSpeed: 1.0,
    keyframeEnabled: false,
    kfStartScale: 52,
    kfStartX: 0,
    kfStartY: 8,
    kfStartRot: 0,
    kfDuration: 2.4,
    recordedMotionFrames: null
  };

  window.GOOGLE_SEARCH_DEFAULTS = GOOGLE_DEFAULTS;

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Authentic Vector SVG of the Official Multi-Color Google Logo (272x92 viewBox)
   * Renders the exact geometric 'G', 'o', 'o', 'g', 'l', and angled-crossbar 'e' on all platforms.
   */
  function buildOfficialGoogleLogoSvg() {
    return `
      <svg class="gs-google-logo-svg" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
        <!-- Red 'o' -->
        <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
        <!-- Yellow 'o' -->
        <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
        <!-- Blue 'g' -->
        <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
        <!-- Green 'l' -->
        <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
        <!-- Red 'e' with signature angled crossbar -->
        <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
        <!-- Blue 'G' -->
        <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
      </svg>
    `;
  }

  function formatSuggestionHtml(text, index) {
    const raw = String(text == null ? '' : text).trim();
    if (!raw) return '';
    if (raw.includes('*')) {
      return escapeHtml(raw).replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    }
    if (index === 1 && /\breturn$/i.test(raw)) {
      return escapeHtml(raw).replace(/\b(return)$/i, '<strong>$1</strong>');
    }
    return escapeHtml(raw);
  }

  /**
   * Builds the exact Reference Image 3 (`image_e33ac0a6.png`) Aurora Light Waves:
   * - Sweeping diagonal warm orange/gold/magenta/violet/blue ribbon on the top-right
   * - Sweeping diagonal warm orange/gold/cyan-blue ribbon on the bottom-left
   */
  function buildAuroraLightWavesHtml(auroraEnabled, auroraIntensity) {
    const isHidden = auroraEnabled === false;
    const opacityVal = Math.max(0, Math.min(1, (auroraIntensity !== undefined ? Number(auroraIntensity) : 95) / 100));
    return `
      <div class="gs-aurora-backdrop ${isHidden ? 'is-hidden' : ''}" style="--gs-aurora-opacity: ${opacityVal.toFixed(2)};">
        <div class="gs-aurora-glow-orb orb-tr-violet"></div>
        <div class="gs-aurora-glow-orb orb-tr-warm"></div>
        <div class="gs-aurora-glow-orb orb-bl-blue"></div>
        <div class="gs-aurora-glow-orb orb-bl-warm"></div>
        <svg class="gs-aurora-svg" viewBox="0 0 1600 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Top-Right Diagonal Ribbon Gradient (Magenta -> Orange/Gold -> Warm White) -->
            <linearGradient id="gsRef3TopRightWarm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#c026d3" stop-opacity="0.0" />
              <stop offset="18%" stop-color="#ec4899" stop-opacity="0.92" />
              <stop offset="46%" stop-color="#fb923c" stop-opacity="1.0" />
              <stop offset="68%" stop-color="#fef08a" stop-opacity="0.98" />
              <stop offset="86%" stop-color="#6366f1" stop-opacity="0.78" />
              <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.0" />
            </linearGradient>
            <!-- Top-Right Outer Violet/Blue Halo -->
            <linearGradient id="gsRef3TopRightViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.0" />
              <stop offset="28%" stop-color="#8b5cf6" stop-opacity="0.82" />
              <stop offset="64%" stop-color="#3b82f6" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#1e40af" stop-opacity="0.0" />
            </linearGradient>
            <!-- Bottom-Left Diagonal Ribbon Gradient (Electric Blue -> White-Gold -> Warm Orange) -->
            <linearGradient id="gsRef3BotLeftWarm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.0" />
              <stop offset="20%" stop-color="#38bdf8" stop-opacity="0.95" />
              <stop offset="48%" stop-color="#fffbeb" stop-opacity="1.0" />
              <stop offset="72%" stop-color="#f97316" stop-opacity="0.95" />
              <stop offset="92%" stop-color="#ea580c" stop-opacity="0.62" />
              <stop offset="100%" stop-color="#9a3412" stop-opacity="0.0" />
            </linearGradient>
            <filter id="gsSoftWaveBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
            <filter id="gsCoreWaveBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          <!-- TOP-RIGHT SWEEPING AURORA WAVE (Matches Reference Image 3 top-right corner) -->
          <path d="M 1030,-80 C 1210,30 1390,180 1570,450"
                fill="none" stroke="url(#gsRef3TopRightViolet)" stroke-width="145" stroke-linecap="round"
                filter="url(#gsSoftWaveBlur)" opacity="0.9" />
          <path d="M 1130,-70 C 1285,40 1440,180 1595,410"
                fill="none" stroke="url(#gsRef3TopRightWarm)" stroke-width="68" stroke-linecap="round"
                filter="url(#gsSoftWaveBlur)" opacity="0.98" />
          <path d="M 1155,-50 C 1300,55 1445,190 1585,390"
                fill="none" stroke="#fff7ed" stroke-width="16" stroke-linecap="round"
                filter="url(#gsCoreWaveBlur)" opacity="0.92" />

          <!-- BOTTOM-LEFT SWEEPING AURORA WAVE (Matches Reference Image 3 bottom-left corner) -->
          <path d="M -85,490 C 60,640 245,765 490,965"
                fill="none" stroke="url(#gsRef3TopRightViolet)" stroke-width="140" stroke-linecap="round"
                filter="url(#gsSoftWaveBlur)" opacity="0.86" />
          <path d="M -55,555 C 95,690 270,805 475,965"
                fill="none" stroke="url(#gsRef3BotLeftWarm)" stroke-width="62" stroke-linecap="round"
                filter="url(#gsSoftWaveBlur)" opacity="0.98" />
          <path d="M -35,570 C 105,695 265,805 455,955"
                fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round"
                filter="url(#gsCoreWaveBlur)" opacity="0.95" />
        </svg>
      </div>
    `;
  }

  function computeProportionalScale(stageEl, widthPercent) {
    const wPct = Math.max(25, Math.min(98, Number(widthPercent) || 65));
    let stageW = 720;
    let stageH = 405;
    if (stageEl && stageEl.clientWidth > 40) {
      stageW = stageEl.clientWidth;
      stageH = stageEl.clientHeight || Math.round(stageW * 0.5625);
    }
    const aspect = stageW / Math.max(1, stageH);
    const targetCardPx = stageW * (wPct / 100);
    let scale = targetCardPx / 540;
    if (aspect < 0.8) {
      scale = Math.min(scale, (stageH * 0.72) / 340);
    } else if (aspect < 1.15) {
      scale = Math.min(scale, (stageH * 0.78) / 340);
    }
    return Math.max(0.22, Math.min(2.4, scale));
  }

  window.tplBuildGoogleSearchHtml = function(customData, options) {
    const stored = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null) || {};
    const d = Object.assign({}, GOOGLE_DEFAULTS, stored, customData || {});
    const opts = options || {};

    const widthPct = Math.max(25, Math.min(98, Number(d.widthPercent) || 65));
    const posX = Number(d.posX) || 0;
    const posY = Number(d.posY) || 0;
    const rotDeg = Number(d.rotation !== undefined ? d.rotation : d.rotationDeg) || 0;
    const is3D = d.is3DMode === true || (typeof topCustomizerState !== 'undefined' && topCustomizerState.is3DMode && topCustomizerState.currentTpl?.id === 'google');
    const tiltX = Number(d.tiltX !== undefined ? d.tiltX : (is3D ? 8 : 0)) || 0;
    const tiltY = Number(d.tiltY !== undefined ? d.tiltY : (is3D ? -16 : 0)) || 0;
    const cardBlur = d.cardBlurPx !== undefined ? Number(d.cardBlurPx) : 24;
    const rimGlow = (d.rimGlowIntensity !== undefined ? Number(d.rimGlowIntensity) : 95) / 100;
    const initScale = opts.initialScale || (widthPct / 65);
    const hasRecordedPath = Array.isArray(d.recordedMotionFrames) && d.recordedMotionFrames.length > 1;

    const themeClass = d.styleMode === 'light-glass' || d.styleMode === 'classic'
      ? 'theme-light-glass'
      : (d.styleMode === 'midnight' ? 'theme-midnight' : 'theme-cinematic');

    const queryText = d.query || GOOGLE_DEFAULTS.query;
    const s1 = d.suggestion || GOOGLE_DEFAULTS.suggestion;
    const s2 = d.suggestion2 || GOOGLE_DEFAULTS.suggestion2;
    const s3 = d.suggestion3 || GOOGLE_DEFAULTS.suggestion3;

    const searchSvgIcon = `
      <svg class="gs-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="10.5" cy="10.5" r="7"></circle>
        <line x1="15.8" y1="15.8" x2="21.2" y2="21.2"></line>
      </svg>
    `;

    const suggSvgIcon = `
      <svg class="gs-sugg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="10.5" cy="10.5" r="6.8"></circle>
        <line x1="15.6" y1="15.6" x2="20.8" y2="20.8"></line>
      </svg>
    `;

    return `
      <div class="tpl-google gs-stage-root ${d.transparentBg ? 'is-transparent-bg' : ''} ${is3D ? 'is-3d-spatial-mode' : ''}"
           data-tpl-google-root="1"
           style="position:absolute; inset:0; width:100%; height:100%; overflow:hidden;">
        ${buildAuroraLightWavesHtml(d.auroraEnabled !== false, d.auroraIntensity)}

        <!-- Stage 3D Keyframe Motion Recorder HUD -->
        <div class="gs-motion-recorder-hud" data-gs-recorder-hud="1" style="position:absolute; top:12px; left:14px; z-index:45; display:flex; align-items:center; gap:6px; pointer-events:auto;">
          <button type="button" data-gs-rec-toggle="1"
            style="height:26px; padding:0 11px; border-radius:999px; font-size:10px; font-weight:800; letter-spacing:0.4px; cursor:pointer; display:inline-flex; align-items:center; gap:5px; border:1px solid ${motionRecordState.isRecording ? 'rgba(239,68,68,0.75)' : 'rgba(56,189,248,0.45)'}; background:${motionRecordState.isRecording ? 'rgba(220,38,38,0.28)' : 'rgba(9,14,28,0.82)'}; color:${motionRecordState.isRecording ? '#fecaca' : '#e0f2fe'}; backdrop-filter:blur(10px); box-shadow:0 4px 14px rgba(0,0,0,0.4);">
            <span style="width:7px; height:7px; border-radius:50%; background:${motionRecordState.isRecording ? '#ef4444' : '#38bdf8'}; box-shadow:0 0 8px ${motionRecordState.isRecording ? '#ef4444' : '#38bdf8'};"></span>
            <span data-gs-rec-label="1">${motionRecordState.isRecording ? '■ Stop & Save Path' : (hasRecordedPath ? '● Re-Record 3D Motion' : '● Record 3D Motion')}</span>
          </button>
          <button type="button" data-gs-rec-play="1"
            style="height:26px; padding:0 10px; border-radius:999px; font-size:10px; font-weight:700; cursor:pointer; display:${hasRecordedPath ? 'inline-flex' : 'none'}; align-items:center; gap:4px; border:1px solid rgba(52,211,153,0.45); background:rgba(6,78,59,0.55); color:#a7f3d0; backdrop-filter:blur(10px);">
            ▶ Replay Path (${hasRecordedPath ? d.recordedMotionFrames.length : 0} pts)
          </button>
          <button type="button" data-gs-rec-clear="1"
            style="height:26px; padding:0 8px; border-radius:999px; font-size:10px; font-weight:700; cursor:pointer; display:${hasRecordedPath ? 'inline-flex' : 'none'}; align-items:center; border:1px solid rgba(255,255,255,0.16); background:rgba(15,23,42,0.75); color:#94a3b8;" title="Clear recorded motion path">
            ✕
          </button>
        </div>

        <div class="gs-composition-anchor"
             data-gs-anchor="1"
             style="--gs-width-pct: ${widthPct}%;
                    --gs-pos-x: ${posX}%;
                    --gs-pos-y: ${posY}%;
                    --gs-rot-deg: ${rotDeg}deg;
                    --gs-tilt-x: ${tiltX}deg;
                    --gs-tilt-y: ${tiltY}deg;
                    --gs-comp-scale: ${initScale.toFixed(3)};
                    --gs-card-blur: ${cardBlur}px;
                    --gs-rim-glow: ${rimGlow.toFixed(2)};">

          <div class="gs-glass-card ${themeClass}" data-gs-card="1">
            <!-- Frosted Glass Corner Light Refractions matching Reference Image 3 -->
            <div class="gs-card-frost-tl"></div>
            <div class="gs-card-refract-tr"></div>
            <div class="gs-card-refract-bl"></div>
            <div class="gs-card-top-specular"></div>

            <!-- Official Multi-Color Vector SVG Google Logo -->
            <div class="gs-google-wordmark" aria-label="Google">
              ${buildOfficialGoogleLogoSvg()}
            </div>

            <!-- Glowing Neon Sky-Blue Pill Search Input -->
            <div class="gs-search-pill">
              ${searchSvgIcon}
              <div class="gs-query-wrap">
                <span class="gs-query-text" data-gs-query-target="1" data-full-query="${escapeHtml(queryText)}">${escapeHtml(queryText)}</span><span class="gs-typing-caret"></span>
              </div>
            </div>

            <!-- 3 Rounded Translucent Suggestion Capsules -->
            <div class="gs-suggestions-stack">
              <div class="gs-sugg-pill is-primary-sugg" data-gs-sugg="0">
                ${suggSvgIcon}
                <span class="gs-sugg-text">${formatSuggestionHtml(s1, 0)}</span>
              </div>
              <div class="gs-sugg-pill" data-gs-sugg="1">
                ${suggSvgIcon}
                <span class="gs-sugg-text">${formatSuggestionHtml(s2, 1)}</span>
              </div>
              <div class="gs-sugg-pill" data-gs-sugg="2">
                ${suggSvgIcon}
                <span class="gs-sugg-text">${formatSuggestionHtml(s3, 2)}</span>
              </div>
            </div>
          </div>

          <!-- Corner Resize Handles (Locked Aspect Ratio by default) -->
          <div class="gs-resize-handle nw" data-gs-handle="nw" title="Drag corner to resize proportionally"></div>
          <div class="gs-resize-handle ne" data-gs-handle="ne" title="Drag corner to resize proportionally"></div>
          <div class="gs-resize-handle sw" data-gs-handle="sw" title="Drag corner to resize proportionally"></div>
          <div class="gs-resize-handle se" data-gs-handle="se" title="Drag corner to resize proportionally"></div>
          <div class="gs-transform-badge" data-gs-badge="1">${is3D ? `3D Orbit (${Math.round(tiltY)}°, ${Math.round(tiltX)}°) · ${Math.round(widthPct)}%` : `${Math.round(widthPct)}% · (${Math.round(posX)}%, ${Math.round(posY)}%)`}</div>
        </div>
      </div>
    `;
  };

  function syncProportionalScale(rootEl, widthPercent) {
    if (!rootEl) return;
    const anchor = rootEl.querySelector('[data-gs-anchor="1"]');
    if (!anchor) return;
    const wPct = widthPercent !== undefined
      ? Number(widthPercent)
      : parseFloat(anchor.style.getPropertyValue('--gs-width-pct') || '65');
    const scale = computeProportionalScale(rootEl, wPct);
    anchor.style.setProperty('--gs-comp-scale', scale.toFixed(3));
  }

  function replayRecordedMotionPath(rootEl, frames) {
    if (!rootEl || !Array.isArray(frames) || frames.length < 2) return;
    const anchor = rootEl.querySelector('[data-gs-anchor="1"]');
    const badge = rootEl.querySelector('[data-gs-badge="1"]');
    if (!anchor) return;
    if (activeKeyframeRaf) {
      cancelAnimationFrame(activeKeyframeRaf);
      activeKeyframeRaf = null;
    }

    const totalDur = Math.max(400, frames[frames.length - 1].t || 2400);
    const t0 = performance.now();

    const stepReplay = (now) => {
      if (!anchor.isConnected) return;
      const elapsed = now - t0;
      const clampedT = Math.min(totalDur, elapsed);

      // Find surrounding frames
      let f0 = frames[0];
      let f1 = frames[frames.length - 1];
      for (let i = 0; i < frames.length - 1; i++) {
        if (clampedT >= frames[i].t && clampedT <= frames[i + 1].t) {
          f0 = frames[i];
          f1 = frames[i + 1];
          break;
        }
      }
      const span = Math.max(1, f1.t - f0.t);
      const alpha = Math.max(0, Math.min(1, (clampedT - f0.t) / span));

      const curW = f0.w + (f1.w - f0.w) * alpha;
      const curX = f0.x + (f1.x - f0.x) * alpha;
      const curY = f0.y + (f1.y - f0.y) * alpha;
      const curTiltX = f0.tx + (f1.tx - f0.tx) * alpha;
      const curTiltY = f0.ty + (f1.ty - f0.ty) * alpha;
      const curRot = (f0.rot || 0) + ((f1.rot || 0) - (f0.rot || 0)) * alpha;

      if (Math.abs(curTiltX) > 0.2 || Math.abs(curTiltY) > 0.2) {
        rootEl.classList.add('is-3d-spatial-mode');
      }
      anchor.style.setProperty('--gs-width-pct', `${curW.toFixed(2)}%`);
      anchor.style.setProperty('--gs-pos-x', `${curX.toFixed(2)}%`);
      anchor.style.setProperty('--gs-pos-y', `${curY.toFixed(2)}%`);
      anchor.style.setProperty('--gs-tilt-x', `${curTiltX.toFixed(2)}deg`);
      anchor.style.setProperty('--gs-tilt-y', `${curTiltY.toFixed(2)}deg`);
      anchor.style.setProperty('--gs-rot-deg', `${curRot.toFixed(2)}deg`);
      syncProportionalScale(rootEl, curW);

      if (badge) {
        badge.textContent = `▶ 3D Replay (${Math.round(curTiltY)}°, ${Math.round(curTiltX)}°) · ${Math.round(curW)}%`;
      }

      if (elapsed < totalDur) {
        activeKeyframeRaf = requestAnimationFrame(stepReplay);
      } else {
        activeKeyframeRaf = null;
      }
    };

    activeKeyframeRaf = requestAnimationFrame(stepReplay);
  }

  window.tplReplayGoogleRecordedMotion = function(containerEl) {
    const rootEl = (containerEl && containerEl.matches && containerEl.matches('[data-tpl-google-root="1"]'))
      ? containerEl
      : (containerEl || document).querySelector('[data-tpl-google-root="1"]');
    if (!rootEl) return;
    const stored = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null) || {};
    if (Array.isArray(stored.recordedMotionFrames) && stored.recordedMotionFrames.length > 1) {
      replayRecordedMotionPath(rootEl, stored.recordedMotionFrames);
    }
  };

  window.tplTriggerGoogleSearchAnimation = function(containerEl, customData) {
    if (!containerEl) return;
    if (activeTypingTimer) {
      clearInterval(activeTypingTimer);
      activeTypingTimer = null;
    }
    if (activeKeyframeRaf) {
      cancelAnimationFrame(activeKeyframeRaf);
      activeKeyframeRaf = null;
    }

    const stored = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null) || {};
    const d = Object.assign({}, GOOGLE_DEFAULTS, stored, customData || {});

    const rootEl = containerEl.matches && containerEl.matches('[data-tpl-google-root="1"]')
      ? containerEl
      : containerEl.querySelector('[data-tpl-google-root="1"]');
    if (!rootEl) return;

    syncProportionalScale(rootEl, d.widthPercent);

    const anchor = rootEl.querySelector('[data-gs-anchor="1"]');
    const queryEl = rootEl.querySelector('[data-gs-query-target="1"]');
    const suggEls = rootEl.querySelectorAll('[data-gs-sugg]');
    const fullQuery = String(d.query || GOOGLE_DEFAULTS.query);
    const speedMult = Math.max(0.3, Math.min(3.0, Number(d.typingSpeed) || 1.0));

    suggEls.forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      setTimeout(() => {
        if (!el.isConnected) return;
        el.style.opacity = '1';
        el.style.transform = '';
      }, Math.round((420 + idx * 160) / speedMult));
    });

    if (queryEl) {
      let charIdx = 0;
      queryEl.textContent = '';
      const stepMs = Math.max(18, Math.round(44 / speedMult));
      activeTypingTimer = setInterval(() => {
        if (!queryEl.isConnected) {
          clearInterval(activeTypingTimer);
          activeTypingTimer = null;
          return;
        }
        charIdx++;
        queryEl.textContent = fullQuery.slice(0, charIdx);
        if (charIdx >= fullQuery.length) {
          clearInterval(activeTypingTimer);
          activeTypingTimer = null;
        }
      }, stepMs);
    }

    if (Array.isArray(d.recordedMotionFrames) && d.recordedMotionFrames.length > 1) {
      replayRecordedMotionPath(rootEl, d.recordedMotionFrames);
    } else if (d.keyframeEnabled && anchor) {
      const rawStartScale = Number(d.kfStartScale) || 0.92;
      const startW = rawStartScale <= 3 ? Math.round(rawStartScale * (Number(d.widthPercent) || 65)) : Math.max(25, Math.min(98, rawStartScale));
      const endW = Math.max(25, Math.min(98, Number(d.widthPercent) || 65));
      const startX = Number(d.kfStartX) || 0;
      const endX = Number(d.posX) || 0;
      const startY = Number(d.kfStartY !== undefined ? d.kfStartY : 12);
      const endY = Number(d.posY) || 0;
      const startRot = Number(d.kfStartRot) || 0;
      const endRot = Number(d.rotation !== undefined ? d.rotation : d.rotationDeg) || 0;
      const durMs = Math.max(400, (Number(d.kfDuration) || 1.4) * 1000);
      const t0 = performance.now();

      const stepKf = (now) => {
        if (!anchor.isConnected) return;
        const rawP = Math.min(1, (now - t0) / durMs);
        const ease = 1 - Math.pow(1 - rawP, 3);
        const curW = startW + (endW - startW) * ease;
        const curX = startX + (endX - startX) * ease;
        const curY = startY + (endY - startY) * ease;
        const curRot = startRot + (endRot - startRot) * ease;

        anchor.style.setProperty('--gs-width-pct', `${curW.toFixed(2)}%`);
        anchor.style.setProperty('--gs-pos-x', `${curX.toFixed(2)}%`);
        anchor.style.setProperty('--gs-pos-y', `${curY.toFixed(2)}%`);
        anchor.style.setProperty('--gs-rot-deg', `${curRot.toFixed(2)}deg`);
        syncProportionalScale(rootEl, curW);

        if (rawP < 1) {
          activeKeyframeRaf = requestAnimationFrame(stepKf);
        } else {
          activeKeyframeRaf = null;
        }
      };
      activeKeyframeRaf = requestAnimationFrame(stepKf);
    }
  };

  /**
   * Interactive Stage Manipulation:
   * - In 3D Mode (or Shift+drag): Pointer drag on the stage/card smoothly spins & tilts the card in 3D space (rotateY / rotateX)!
   * - In Video Mode: Pointer drag moves X/Y position freely on the canvas.
   * - Corner Handles (NW, NE, SW, SE): Always resize widthPercent proportionally (Locked Aspect Ratio).
   * - Mouse Wheel: Smoothly scales widthPercent (35% - 95%).
   * - Live 3D Keyframe Motion Recorder: Records real-time drag/orbit/zoom trajectories and replays them on demand.
   */
  function bindInteractiveStageTransform(rootEl) {
    if (!rootEl || rootEl.dataset.gsInteractiveBound === '1') return;
    rootEl.dataset.gsInteractiveBound = '1';

    const anchor = rootEl.querySelector('[data-gs-anchor="1"]');
    const badge = rootEl.querySelector('[data-gs-badge="1"]');
    const recBtn = rootEl.querySelector('[data-gs-rec-toggle="1"]');
    const recLabel = rootEl.querySelector('[data-gs-rec-label="1"]');
    const playBtn = rootEl.querySelector('[data-gs-rec-play="1"]');
    const clearBtn = rootEl.querySelector('[data-gs-rec-clear="1"]');
    if (!anchor) return;

    let mode = null; // 'orbit3d' | 'drag2d' | 'resize'
    let handleCorner = null;
    let startClientX = 0;
    let startClientY = 0;
    let startPosX = 0;
    let startPosY = 0;
    let startTiltX = 0;
    let startTiltY = 0;
    let startWidthPct = 65;

    const getLiveStore = () => {
      return (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null) || Object.assign({}, GOOGLE_DEFAULTS);
    };

    const pushRecordedFrameIfActive = (d) => {
      if (!motionRecordState.isRecording) return;
      const now = performance.now();
      if (motionRecordState.frames.length === 0) {
        motionRecordState.startTime = now;
      }
      const t = Math.round(now - motionRecordState.startTime);
      motionRecordState.frames.push({
        t,
        w: Number(d.widthPercent) || 65,
        x: Number(d.posX) || 0,
        y: Number(d.posY) || 0,
        tx: Number(d.tiltX) || 0,
        ty: Number(d.tiltY) || 0,
        rot: Number(d.rotation !== undefined ? d.rotation : d.rotationDeg) || 0
      });
    };

    const syncRecorderHudButtons = () => {
      const d = getLiveStore();
      const hasPath = Array.isArray(d.recordedMotionFrames) && d.recordedMotionFrames.length > 1;
      if (recBtn && recLabel) {
        recLabel.textContent = motionRecordState.isRecording
          ? '■ Stop & Save Path'
          : (hasPath ? '● Re-Record 3D Motion' : '● Record 3D Motion');
        recBtn.style.borderColor = motionRecordState.isRecording ? 'rgba(239,68,68,0.85)' : 'rgba(56,189,248,0.45)';
        recBtn.style.background = motionRecordState.isRecording ? 'rgba(220,38,38,0.32)' : 'rgba(9,14,28,0.82)';
      }
      if (playBtn) {
        playBtn.style.display = hasPath ? 'inline-flex' : 'none';
        playBtn.textContent = `▶ Replay Path (${hasPath ? d.recordedMotionFrames.length : 0} pts)`;
      }
      if (clearBtn) {
        clearBtn.style.display = hasPath ? 'inline-flex' : 'none';
      }
    };

    if (recBtn) {
      recBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const d = getLiveStore();
        if (!motionRecordState.isRecording) {
          motionRecordState.isRecording = true;
          motionRecordState.startTime = performance.now();
          motionRecordState.frames = [{
            t: 0,
            w: Number(d.widthPercent) || 65,
            x: Number(d.posX) || 0,
            y: Number(d.posY) || 0,
            tx: Number(d.tiltX) || 0,
            ty: Number(d.tiltY) || 0,
            rot: Number(d.rotation !== undefined ? d.rotation : d.rotationDeg) || 0
          }];
          if (badge) badge.textContent = '● REC: Drag card on stage to record 3D motion...';
          syncRecorderHudButtons();
        } else {
          motionRecordState.isRecording = false;
          if (motionRecordState.frames.length > 1) {
            d.recordedMotionFrames = motionRecordState.frames.slice();
            if (typeof window.tplSaveContextualStore === 'function') window.tplSaveContextualStore();
            replayRecordedMotionPath(rootEl, d.recordedMotionFrames);
          }
          syncRecorderHudButtons();
        }
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const d = getLiveStore();
        if (Array.isArray(d.recordedMotionFrames) && d.recordedMotionFrames.length > 1) {
          window.tplTriggerGoogleSearchAnimation(rootEl, d);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const d = getLiveStore();
        d.recordedMotionFrames = null;
        motionRecordState.isRecording = false;
        motionRecordState.frames = [];
        if (typeof window.tplSaveContextualStore === 'function') window.tplSaveContextualStore();
        syncRecorderHudButtons();
      });
    }

    const isCurrently3DMode = (d) => {
      if (typeof topCustomizerState !== 'undefined' && topCustomizerState.currentTpl?.id === 'google') {
        if (topCustomizerState.paperPreviewMode === '3d' || topCustomizerState.is3DMode === true) return true;
        if (topCustomizerState.paperPreviewMode === 'video' && topCustomizerState.is3DMode === false) return false;
      }
      return d.is3DMode === true;
    };

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('button, input, select')) return;
      e.stopPropagation();

      const handleEl = e.target.closest('[data-gs-handle]');
      const d = getLiveStore();
      startClientX = e.clientX;
      startClientY = e.clientY;
      startPosX = Number(d.posX) || 0;
      startPosY = Number(d.posY) || 0;
      startTiltX = Number(d.tiltX) || 0;
      startTiltY = Number(d.tiltY) || 0;
      startWidthPct = Number(d.widthPercent) || 65;

      if (handleEl) {
        mode = 'resize';
        handleCorner = handleEl.dataset.gsHandle;
      } else if (isCurrently3DMode(d) || e.shiftKey) {
        mode = 'orbit3d';
        rootEl.classList.add('is-3d-spatial-mode');
      } else {
        mode = 'drag2d';
      }

      pushRecordedFrameIfActive(d);
      anchor.classList.add('is-transforming');
      try { rootEl.setPointerCapture(e.pointerId); } catch (_) {}
    };

    const onPointerMove = (e) => {
      if (!mode) return;
      e.stopPropagation();

      const rect = rootEl.getBoundingClientRect();
      const stageW = Math.max(100, rect.width);
      const stageH = Math.max(100, rect.height);
      const dx = e.clientX - startClientX;
      const dy = e.clientY - startClientY;
      const d = getLiveStore();

      if (mode === 'orbit3d') {
        const nextTiltY = Math.max(-45, Math.min(45, Math.round((startTiltY + dx * 0.22) * 10) / 10));
        const nextTiltX = Math.max(-35, Math.min(35, Math.round((startTiltX - dy * 0.22) * 10) / 10));
        d.tiltY = nextTiltY;
        d.tiltX = nextTiltX;
        anchor.style.setProperty('--gs-tilt-y', `${nextTiltY}deg`);
        anchor.style.setProperty('--gs-tilt-x', `${nextTiltX}deg`);
        if (badge) badge.textContent = `${motionRecordState.isRecording ? '● REC · ' : ''}3D Orbit (${Math.round(nextTiltY)}°, ${Math.round(nextTiltX)}°) · ${Math.round(startWidthPct)}%`;
        const tyEl = document.getElementById('g-val-tilt-y');
        const txEl = document.getElementById('g-val-tilt-x');
        const tySlider = document.getElementById('g-slider-tilt-y');
        const txSlider = document.getElementById('g-slider-tilt-x');
        if (tyEl) tyEl.textContent = `${Math.round(nextTiltY)}°`;
        if (txEl) txEl.textContent = `${Math.round(nextTiltX)}°`;
        if (tySlider) tySlider.value = Math.round(nextTiltY);
        if (txSlider) txSlider.value = Math.round(nextTiltX);
      } else if (mode === 'drag2d') {
        const nextX = Math.max(-45, Math.min(45, startPosX + (dx / stageW) * 100));
        const nextY = Math.max(-45, Math.min(45, startPosY + (dy / stageH) * 100));
        d.posX = Math.round(nextX * 10) / 10;
        d.posY = Math.round(nextY * 10) / 10;
        anchor.style.setProperty('--gs-pos-x', `${d.posX}%`);
        anchor.style.setProperty('--gs-pos-y', `${d.posY}%`);
        if (badge) badge.textContent = `${motionRecordState.isRecording ? '● REC · ' : ''}${Math.round(startWidthPct)}% · (${Math.round(d.posX)}%, ${Math.round(d.posY)}%)`;
        if (typeof window.tplSyncGoogleInspectorUI === 'function') window.tplSyncGoogleInspectorUI();
      } else if (mode === 'resize') {
        const signX = (handleCorner === 'nw' || handleCorner === 'sw') ? -1 : 1;
        const deltaPct = ((dx * signX * 2) / stageW) * 100;
        const nextWidth = Math.max(25, Math.min(98, startWidthPct + deltaPct));
        d.widthPercent = Math.round(nextWidth);
        d.sizePreset = (d.widthPercent <= 40) ? 'compact' : (d.widthPercent >= 90 ? 'fullscreen' : 'standard');
        anchor.style.setProperty('--gs-width-pct', `${d.widthPercent}%`);
        syncProportionalScale(rootEl, d.widthPercent);
        if (badge) badge.textContent = `${motionRecordState.isRecording ? '● REC · ' : ''}${ d.widthPercent }% · (${Math.round(startPosX)}%, ${Math.round(startPosY)}%)`;
        if (typeof window.tplSyncGoogleInspectorUI === 'function') window.tplSyncGoogleInspectorUI();
      }

      pushRecordedFrameIfActive(d);
    };

    const finishTransform = (e) => {
      if (!mode) return;
      mode = null;
      handleCorner = null;
      anchor.classList.remove('is-transforming');
      try { rootEl.releasePointerCapture(e.pointerId); } catch (_) {}
      if (typeof window.tplSaveContextualStore === 'function') {
        window.tplSaveContextualStore();
      }
    };

    rootEl.addEventListener('pointerdown', onPointerDown);
    rootEl.addEventListener('pointermove', onPointerMove);
    rootEl.addEventListener('pointerup', finishTransform);
    rootEl.addEventListener('pointercancel', finishTransform);

    rootEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      const d = getLiveStore();
      const curW = Number(d.widthPercent) || 65;
      const nextW = Math.max(25, Math.min(96, Math.round(curW + (e.deltaY < 0 ? 3 : -3))));
      d.widthPercent = nextW;
      anchor.style.setProperty('--gs-width-pct', `${nextW}%`);
      syncProportionalScale(rootEl, nextW);
      pushRecordedFrameIfActive(d);
      if (badge) badge.textContent = `${nextW}% · (${Math.round(d.posX || 0)}%, ${Math.round(d.posY || 0)}%)`;
      if (typeof window.tplSyncGoogleInspectorUI === 'function') window.tplSyncGoogleInspectorUI();
      if (typeof window.tplSaveContextualStore === 'function') window.tplSaveContextualStore();
    }, { passive: false });
  }

  window.tplUpdateGoogleSearchLive = function(stageContainer, customData, options) {
    if (!stageContainer) return;
    const stored = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null) || {};
    const d = Object.assign({}, GOOGLE_DEFAULTS, stored, customData || {});
    const opts = options || {};

    let rootEl = stageContainer.matches && stageContainer.matches('[data-tpl-google-root="1"]')
      ? stageContainer
      : stageContainer.querySelector('[data-tpl-google-root="1"]');

    if (!rootEl || opts.forceRebuild) {
      window.initSearch3DScene(stageContainer, d);
      return;
    }

    const anchor = rootEl.querySelector('[data-gs-anchor="1"]');
    const card = rootEl.querySelector('[data-gs-card="1"]');
    const aurora = rootEl.querySelector('.gs-aurora-backdrop');
    const badge = rootEl.querySelector('[data-gs-badge="1"]');

    const is3D = d.is3DMode === true || (typeof topCustomizerState !== 'undefined' && topCustomizerState.is3DMode && topCustomizerState.currentTpl?.id === 'google');
    rootEl.classList.toggle('is-3d-spatial-mode', is3D);

    const widthPct = Math.max(25, Math.min(98, Number(d.widthPercent) || 65));
    const posX = Number(d.posX) || 0;
    const posY = Number(d.posY) || 0;
    const rotDeg = Number(d.rotation !== undefined ? d.rotation : d.rotationDeg) || 0;
    const tiltX = Number(d.tiltX) || 0;
    const tiltY = Number(d.tiltY) || 0;
    const cardBlur = d.cardBlurPx !== undefined ? Number(d.cardBlurPx) : 24;
    const rimGlow = (d.rimGlowIntensity !== undefined ? Number(d.rimGlowIntensity) : 95) / 100;

    if (anchor) {
      anchor.style.setProperty('--gs-width-pct', `${widthPct}%`);
      anchor.style.setProperty('--gs-pos-x', `${posX}%`);
      anchor.style.setProperty('--gs-pos-y', `${posY}%`);
      anchor.style.setProperty('--gs-rot-deg', `${rotDeg}deg`);
      anchor.style.setProperty('--gs-tilt-x', `${tiltX}deg`);
      anchor.style.setProperty('--gs-tilt-y', `${tiltY}deg`);
      anchor.style.setProperty('--gs-card-blur', `${cardBlur}px`);
      anchor.style.setProperty('--gs-rim-glow', rimGlow.toFixed(2));
      syncProportionalScale(rootEl, widthPct);
    }

    if (card) {
      card.classList.remove('theme-cinematic', 'theme-light-glass', 'theme-midnight');
      const themeClass = d.styleMode === 'light-glass' || d.styleMode === 'classic'
        ? 'theme-light-glass'
        : (d.styleMode === 'midnight' ? 'theme-midnight' : 'theme-cinematic');
      card.classList.add(themeClass);
    }

    if (aurora) {
      const isHidden = d.auroraEnabled === false;
      aurora.classList.toggle('is-hidden', isHidden);
      const opacityVal = Math.max(0, Math.min(1, (d.auroraIntensity !== undefined ? Number(d.auroraIntensity) : 95) / 100));
      aurora.style.setProperty('--gs-aurora-opacity', opacityVal.toFixed(2));
    }

    if (badge) {
      badge.textContent = is3D
        ? `3D Orbit (${Math.round(tiltY)}°, ${Math.round(tiltX)}°) · ${Math.round(widthPct)}%`
        : `${Math.round(widthPct)}% · (${Math.round(posX)}%, ${Math.round(posY)}%)`;
    }

    const queryEl = rootEl.querySelector('[data-gs-query-target="1"]');
    if (queryEl) {
      const nextQ = String(d.query || GOOGLE_DEFAULTS.query);
      queryEl.dataset.fullQuery = nextQ;
      if (!opts.replayTyping) {
        queryEl.textContent = nextQ;
      }
    }

    const s0 = rootEl.querySelector('[data-gs-sugg="0"] .gs-sugg-text');
    const s1 = rootEl.querySelector('[data-gs-sugg="1"] .gs-sugg-text');
    const s2 = rootEl.querySelector('[data-gs-sugg="2"] .gs-sugg-text');
    if (s0) s0.innerHTML = formatSuggestionHtml(d.suggestion || GOOGLE_DEFAULTS.suggestion, 0);
    if (s1) s1.innerHTML = formatSuggestionHtml(d.suggestion2 || GOOGLE_DEFAULTS.suggestion2, 1);
    if (s2) s2.innerHTML = formatSuggestionHtml(d.suggestion3 || GOOGLE_DEFAULTS.suggestion3, 2);

    if (opts.replayTyping) {
      window.tplTriggerGoogleSearchAnimation(rootEl, d);
    }
  };

  window.initSearch3DScene = function(container, customData) {
    if (!container) return;
    cleanupSearch3DScene();

    const stored = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null) || {};
    const data = Object.assign({}, GOOGLE_DEFAULTS, stored, customData || {});

    container.innerHTML = window.tplBuildGoogleSearchHtml(data);
    const rootEl = container.querySelector('[data-tpl-google-root="1"]');
    if (rootEl) {
      syncProportionalScale(rootEl, data.widthPercent);
      bindInteractiveStageTransform(rootEl);
      window.tplTriggerGoogleSearchAnimation(rootEl, data);

      if (typeof ResizeObserver !== 'undefined') {
        activeResizeObserver = new ResizeObserver(() => {
          const liveData = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('google') : null) || data;
          syncProportionalScale(rootEl, liveData.widthPercent);
        });
        activeResizeObserver.observe(rootEl);
      }
    }
  };

  function cleanupSearch3DScene() {
    if (activeTypingTimer) {
      clearInterval(activeTypingTimer);
      activeTypingTimer = null;
    }
    if (activeKeyframeRaf) {
      cancelAnimationFrame(activeKeyframeRaf);
      activeKeyframeRaf = null;
    }
    if (activeResizeObserver) {
      activeResizeObserver.disconnect();
      activeResizeObserver = null;
    }
  }

  window.cleanupSearch3DScene = cleanupSearch3DScene;

  window.tplMountSearch3DStage = function(stage, data) {
    if (!stage) return;
    stage.innerHTML = `
      <div id="customizer-stage-inner" style="position: absolute; inset: 0; background: #03060f; overflow: hidden;">
        <div id="search-3d-viewport-container" style="position: absolute; inset: 0; width: 100%; height: 100%;"></div>
      </div>
    `;
    const container = stage.querySelector('#search-3d-viewport-container');
    window.initSearch3DScene(container, data);
  };

})();
