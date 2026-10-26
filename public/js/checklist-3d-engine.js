/**
 * Photorealistic 3D Paper Artifact Reveal Engine (Animated Checklist)
 * Replicating investigative documentary standards (Vox, James Jani, Magnates Media, Johnny Harris)
 *
 * Features:
 * - Default "Sequential Unblur (One-by-One Fade-Out)": Each slip/item enters with optical blur
 *   and smoothly unblurs to 0px (100% sharp) one by one as it settles and gets stamped.
 *   The top 3 items NEVER remain permanently blurred unless the user switches to Rack Focus / Custom Rest Blur.
 * - Full granular control over Entry Blur (px), Resting Blur (px), Unblur Fade Duration (s),
 *   Stagger Step Timing (s), and Per-Item Blur & Unblur Delay (s).
 * - Interactive 3D Orbit in 3D mode (drag on stage to spin/tilt X & Y in 3D space, scroll to scale).
 */

(function() {
  'use strict';

  const CHECKLIST_DEFAULTS = {
    type: 'checklist',
    layoutMode: 'slips', // 'slips' (Stacked Evidence Slips) or 'dossier' (3D Spatial Dossier)
    bgEnvironment: 'desk', // 'desk' (Dark Mahogany Desk) or 'blueprint' (Investigative Blue Map Grid)
    title: 'ACTION STEPS',
    blurMode: 'sequential', // 'sequential' (appears blurred, fades away one-by-one to 0px) | 'rack-focus' | 'none'
    entryBlurPx: 6.5,       // Initial blur when each item appears (fades out to 0px one by one)
    unblurDurationSec: 0.55, // How long each item takes to unblur to sharp
    unblurHoldSec: 0.18,    // Brief hold before blur fades out on each item
    stepIntervalSec: 0.38,  // Time stagger between item 1, item 2, item 3, item 4
    items: [
      { text: 'Register Company LLC', checked: true, blurPx: 0, unblurDelaySec: 0 },
      { text: 'Open Business Account', checked: true, blurPx: 0, unblurDelaySec: 0 },
      { text: 'Acquire First 100 Clients', checked: true, blurPx: 0, unblurDelaySec: 0 },
      { text: 'Automate Sales Funnel', checked: true, blurPx: 0, unblurDelaySec: 0 }
    ],
    activeFocusIndex: -1, // Used when blurMode === 'rack-focus'
    depthOfField: false,
    globalBlurPx: 0,      // Resting blur (0px by default so items end 100% sharp)
    unfocusedOpacity: 100,
    fallMotionBlurPx: 6.5,
    spotlightIntensity: 1.0,
    volumetricDust: true,
    stampColor: '#15803d',
    tiltAngleX: 14,
    tiltAngleY: 0,
    coverageScale: 58,
    organicTape: true,
    organicStampSeal: true,
    organicStampSlam: true
  };

  window.CHECKLIST_3D_DEFAULTS = CHECKLIST_DEFAULTS;

  /**
   * Computes entry blur, resting blur, and timing for each checklist item.
   * By default (blurMode === 'sequential'), every item starts blurred (e.g. 6.5px)
   * and fades its blur out to 0px (sharp) one by one as it lands!
   */
  function computeItemBlurState(item, idx, data) {
    const mode = data.blurMode || (data.depthOfField === true ? 'rack-focus' : 'sequential');
    const stepSec = typeof data.stepIntervalSec === 'number' ? Math.max(0.1, Math.min(2.0, data.stepIntervalSec)) : 0.38;
    const holdSec = typeof data.unblurHoldSec === 'number' ? Math.max(0, Math.min(2.0, data.unblurHoldSec)) : 0.18;
    const fadeSec = typeof data.unblurDurationSec === 'number' ? Math.max(0.1, Math.min(3.0, data.unblurDurationSec)) : 0.55;
    const customItemDelay = (item && typeof item === 'object' && typeof item.unblurDelaySec === 'number')
      ? Math.max(0, Math.min(5.0, item.unblurDelaySec))
      : 0;

    // Entry blur (initial blur when item appears)
    const rawEntryBlur = typeof data.entryBlurPx === 'number'
      ? Math.max(0, Math.min(18, data.entryBlurPx))
      : 6.5;
    const entryBlur = mode === 'none' ? 0 : rawEntryBlur;

    // Resting blur (blur after item settles)
    const isRackFocus = mode === 'rack-focus' || data.depthOfField === true;
    const rawGlobalRestBlur = typeof data.globalBlurPx === 'number'
      ? Math.max(0, Math.min(12, data.globalBlurPx))
      : (isRackFocus ? 3.2 : 0);
    const focusIdx = typeof data.activeFocusIndex === 'number' ? data.activeFocusIndex : -1;

    let globalForThisItem = 0;
    if (isRackFocus && rawGlobalRestBlur > 0) {
      if (focusIdx === -1 || idx !== focusIdx) {
        globalForThisItem = rawGlobalRestBlur;
      }
    }

    const itemRestBlur = (item && typeof item === 'object' && typeof item.blurPx === 'number')
      ? Math.max(0, Math.min(12, item.blurPx))
      : 0;

    const effectiveBlur = Number(Math.min(12, Math.max(globalForThisItem, itemRestBlur)).toFixed(2));
    const isBlurred = effectiveBlur > 0.05;

    const rawUnfocusedOpacity = typeof data.unfocusedOpacity === 'number'
      ? Math.max(40, Math.min(100, data.unfocusedOpacity))
      : (isRackFocus ? 78 : 100);
    const effectiveOpacity = isBlurred
      ? Number(Math.max(0.4, Math.min(1, rawUnfocusedOpacity / 100)).toFixed(2))
      : 1.0;

    const dropDelay = Number((idx * stepSec + 0.06).toFixed(2));
    const unblurStartDelay = Number((dropDelay + holdSec + customItemDelay).toFixed(2));
    const stampDelay = Number((dropDelay + 0.34).toFixed(2));

    return {
      mode,
      entryBlur: Math.max(entryBlur, effectiveBlur),
      effectiveBlur,
      effectiveOpacity,
      isBlurred,
      isFocused: !isBlurred && isRackFocus && focusIdx === idx,
      dropDelay,
      unblurStartDelay,
      unblurDuration: fadeSec,
      stampDelay
    };
  }

  function getPaperDefsSvg() {
    return `
      <svg class="cl-procedural-defs" style="position: absolute; width: 0; height: 0; pointer-events: none;" aria-hidden="true">
        <defs>
          <filter id="cl-ink-bleed-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 1.2 -0.05" in="displaced" result="punchy" />
            <feBlend in="SourceGraphic" in2="punchy" mode="multiply" />
          </filter>
          <filter id="cl-paper-fiber" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="grain" />
            <feColorMatrix type="matrix" values="
              0 0 0 0 0.94
              0 0 0 0 0.91
              0 0 0 0 0.82
              0 0 0 0.22 0" />
            <feBlend mode="multiply" in="SourceGraphic" result="blend" />
          </filter>
          <linearGradient id="cl-tape-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(245, 235, 205, 0.55)" />
            <stop offset="15%" stop-color="rgba(250, 242, 220, 0.78)" />
            <stop offset="50%" stop-color="rgba(240, 228, 195, 0.65)" />
            <stop offset="85%" stop-color="rgba(252, 245, 225, 0.75)" />
            <stop offset="100%" stop-color="rgba(242, 230, 200, 0.55)" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  function getBlueprintBackdropSvg() {
    return `
      <div class="cl-backdrop-blueprint">
        <div class="cl-blueprint-hud cl-hud-tl">
          <span class="cl-coord-label">LAT · 40°42'51"N</span>
          <span class="cl-coord-label">LON · 74°00'23"W</span>
        </div>
        <div class="cl-blueprint-hud cl-hud-tr">
          <span class="cl-coord-badge">GRID REF 8842-X</span>
          <span class="cl-coord-label">ELEV 142M · SECTOR 04</span>
        </div>
        <div class="cl-blueprint-hud cl-hud-br">
          <span class="cl-coord-label">FORENSIC TACTICAL OVERLAY</span>
        </div>
        <svg class="cl-blueprint-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <pattern id="cl-topo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.12)" stroke-width="0.8" />
            <circle cx="60" cy="60" r="1.5" fill="rgba(56, 189, 248, 0.25)" />
          </pattern>
          <rect width="1000" height="600" fill="url(#cl-topo-grid)" />
          <g fill="none" stroke="rgba(56, 189, 248, 0.16)" stroke-width="1.2">
            <path d="M -50 120 C 180 80, 260 220, 480 180 C 700 140, 780 290, 1050 240" />
            <path d="M -50 260 C 120 200, 210 350, 420 320 C 630 290, 700 440, 1050 380" stroke-width="1.4" opacity="0.9" />
            <path d="M -50 410 C 60 340, 150 480, 360 460 C 570 430, 640 580, 1050 520" stroke-width="1.1" opacity="0.75" />
          </g>
        </svg>
      </div>
    `;
  }

  function getMaskingTapeHtml(extraStyle = '') {
    return `
      <div class="cl-masking-tape" style="${extraStyle}">
        <div class="cl-tape-texture"></div>
        <div class="cl-tape-edge-left"></div>
        <div class="cl-tape-edge-right"></div>
      </div>
    `;
  }

  function getInkStampCheckboxHtml(isChecked, stampColor, stampDelay, isSlamActive) {
    const slamClass = isSlamActive ? 'is-slamming' : '';
    return `
      <div class="cl-stamp-box-wrap ${slamClass}" style="--cl-stamp-color: ${stampColor}; --cl-stamp-delay: ${stampDelay}s;">
        <svg class="cl-stamp-svg" viewBox="0 0 38 38" width="34" height="34">
          <rect x="3.5" y="3.5" width="31" height="31" rx="2.5" 
                fill="none" 
                stroke="${stampColor}" 
                stroke-width="2.8" 
                stroke-dasharray="32 1.5 28 2" 
                class="cl-stamp-border" />
          ${isChecked ? `
            <path d="M 9 19 L 16 26.5 L 29 11.5" 
                  fill="none" 
                  stroke="${stampColor}" 
                  stroke-width="4.2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="cl-stamp-check" />
          ` : ''}
        </svg>
        <div class="cl-stamp-ink-bleed"></div>
      </div>
    `;
  }

  function getOfficialStampSealHtml(stampColor) {
    return `
      <div class="cl-official-stamp-seal" style="--cl-seal-color: ${stampColor};">
        <svg viewBox="0 0 100 100" width="88" height="88">
          <circle cx="50" cy="50" r="44" fill="none" stroke="${stampColor}" stroke-width="2.6" stroke-dasharray="80 2 60 3" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="${stampColor}" stroke-width="1.2" stroke-dasharray="50 1.5 40 2" />
          <path id="cl-seal-arc-top" d="M 20 50 A 30 30 0 0 1 80 50" fill="none" />
          <path id="cl-seal-arc-bot" d="M 80 50 A 30 30 0 0 1 20 50" fill="none" />
          <text font-family="'Space Grotesk', sans-serif" font-size="7.5" font-weight="900" letter-spacing="1.8" fill="${stampColor}">
            <textPath href="#cl-seal-arc-top" startOffset="50%" text-anchor="middle">VERIFIED · EVIDENCE</textPath>
          </text>
          <text font-family="'Space Grotesk', sans-serif" font-size="7" font-weight="800" letter-spacing="1.5" fill="${stampColor}">
            <textPath href="#cl-seal-arc-bot" startOffset="50%" text-anchor="middle">FORENSIC AUDIT</textPath>
          </text>
          <text x="50" y="47" fill="${stampColor}" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="900" letter-spacing="0.8" text-anchor="middle">APPROVED</text>
          <line x1="28" y1="52" x2="72" y2="52" stroke="${stampColor}" stroke-width="1.4" />
          <text x="50" y="60" fill="${stampColor}" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="700" letter-spacing="0.5" text-anchor="middle">DOC #8842-X</text>
        </svg>
      </div>
    `;
  }

  function getVolumetricDustMotesHtml() {
    const motes = [
      { top: '22%', left: '42%', size: '3.5px', delay: '0s', dur: '7s', dx: '28px', dy: '-75px' },
      { top: '38%', left: '48%', size: '2.5px', delay: '1.2s', dur: '8.5s', dx: '-32px', dy: '-85px' },
      { top: '55%', left: '52%', size: '4px', delay: '2.5s', dur: '6.8s', dx: '35px', dy: '-95px' },
      { top: '28%', left: '58%', size: '3px', delay: '0.8s', dur: '9s', dx: '-24px', dy: '-65px' },
      { top: '46%', left: '38%', size: '2.2px', delay: '3.1s', dur: '7.8s', dx: '30px', dy: '-80px' },
      { top: '64%', left: '45%', size: '3.2px', delay: '1.8s', dur: '8.2s', dx: '-38px', dy: '-90px' }
    ];
    return `
      <div class="cl-dust-container">
        ${motes.map(m => `
          <div class="cl-dust-mote" style="top: ${m.top}; left: ${m.left}; width: ${m.size}; height: ${m.size}; --dx: ${m.dx}; --dy: ${m.dy}; animation-duration: ${m.dur}; animation-delay: ${m.delay};"></div>
        `).join('')}
      </div>
    `;
  }

  // Bind 3D orbit / drag on the checklist stage when in 3D mode
  function bindChecklist3DStageOrbit(rootEl) {
    if (!rootEl || rootEl.dataset.clOrbitBound === '1') return;
    rootEl.dataset.clOrbitBound = '1';

    let dragging = false;
    let startX = 0, startY = 0;
    let startTiltX = 14, startTiltY = 0;

    rootEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, input, select')) return;
      const d = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('checklist') : null) || CHECKLIST_DEFAULTS;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTiltX = typeof d.tiltAngleX === 'number' ? d.tiltAngleX : 14;
      startTiltY = typeof d.tiltAngleY === 'number' ? d.tiltAngleY : 0;
      rootEl.style.cursor = 'grabbing';
      try { rootEl.setPointerCapture(e.pointerId); } catch (_) {}
    });

    rootEl.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const nextY = Math.max(-38, Math.min(38, Math.round(startTiltY + dx * 0.18)));
      const nextX = Math.max(-15, Math.min(48, Math.round(startTiltX - dy * 0.18)));
      const stageEl = rootEl.querySelector('.cl-3d-stage');
      const d = (typeof window.tplGetContextualData === 'function' ? window.tplGetContextualData('checklist') : null) || CHECKLIST_DEFAULTS;
      const scaleFactor = (Math.max(35, Math.min(90, Number(d.coverageScale || 58))) / 58).toFixed(3);
      const tiltZ = d.layoutMode === 'dossier' ? 2.5 : 0;
      if (stageEl) {
        stageEl.style.transform = `perspective(1100px) rotateX(${nextX}deg) rotateY(${nextY}deg) rotateZ(${tiltZ}deg) scale(${scaleFactor})`;
      }
      if (typeof window.tplSetContextualData === 'function') {
        d.tiltAngleX = nextX;
        d.tiltAngleY = nextY;
      }
      const txLbl = document.getElementById('cl-val-tiltx');
      const tyLbl = document.getElementById('cl-val-tilty');
      const txRng = document.getElementById('cl-range-tiltx');
      const tyRng = document.getElementById('cl-range-tilty');
      if (txLbl) txLbl.textContent = `${nextX}°`;
      if (tyLbl) tyLbl.textContent = `${nextY}°`;
      if (txRng) txRng.value = nextX;
      if (tyRng) tyRng.value = nextY;
    });

    const endOrbit = (e) => {
      if (!dragging) return;
      dragging = false;
      rootEl.style.cursor = 'grab';
      try { rootEl.releasePointerCapture(e.pointerId); } catch (_) {}
      if (typeof window.tplSaveContextualStore === 'function') window.tplSaveContextualStore();
    };
    rootEl.addEventListener('pointerup', endOrbit);
    rootEl.addEventListener('pointercancel', endOrbit);
  }

  window.tplUpdateChecklistOpticsLive = function(container, customData) {
    if (!container) return false;
    const root = container.classList && container.classList.contains('tpl-checklist')
      ? container
      : container.querySelector('.tpl-checklist');
    if (!root) return false;

    const data = Object.assign({}, CHECKLIST_DEFAULTS, customData || {});
    const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : CHECKLIST_DEFAULTS.items;
    const isDossier = (data.layoutMode === 'dossier');
    const spotIntensity = (typeof data.spotlightIntensity === 'number') ? data.spotlightIntensity : 1.0;
    const rawCoverage = typeof data.coverageScale === 'number' ? data.coverageScale : 58;
    const scaleFactor = (Math.max(35, Math.min(90, rawCoverage)) / 58).toFixed(3);
    const tiltX = (typeof data.tiltAngleX === 'number') ? data.tiltAngleX : (isDossier ? 28 : 14);
    const tiltY = (typeof data.tiltAngleY === 'number') ? data.tiltAngleY : (isDossier ? -12 : 0);
    const tiltZ = isDossier ? 2.5 : 0;

    root.style.setProperty('--cl-spot-intensity', spotIntensity);
    root.style.setProperty('--cl-scale-factor', scaleFactor);

    const stageEl = root.querySelector('.cl-3d-stage');
    if (stageEl) {
      stageEl.style.transform = `perspective(1100px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${scaleFactor})`;
    }

    const rowEls = root.querySelectorAll('.cl-evidence-slip-wrapper, .cl-dossier-item');
    rowEls.forEach((rowEl, idx) => {
      const item = items[idx] || {};
      const blurState = computeItemBlurState(item, idx, data);
      rowEl.classList.toggle('is-blurred-dof', blurState.isBlurred);
      rowEl.classList.toggle('is-sharp-focus', blurState.isFocused);
      rowEl.style.setProperty('--cl-entry-blur', `${blurState.entryBlur}px`);
      rowEl.style.setProperty('--cl-item-blur', `${blurState.effectiveBlur}px`);
      rowEl.style.setProperty('--cl-item-opacity', `${blurState.effectiveOpacity}`);
      rowEl.style.setProperty('--cl-drop-delay', `${blurState.dropDelay}s`);
      rowEl.style.setProperty('--cl-unblur-delay', `${blurState.unblurStartDelay}s`);
      rowEl.style.setProperty('--cl-unblur-dur', `${blurState.unblurDuration}s`);
    });

    bindChecklist3DStageOrbit(root);
    return true;
  };

  window.tplBuildChecklistHtml = function(customData) {
    const data = Object.assign({}, CHECKLIST_DEFAULTS, customData || {});
    const isDossier = (data.layoutMode === 'dossier');
    const bgEnv = data.bgEnvironment || 'desk';
    const stampColor = data.stampColor || '#15803d';
    const spotIntensity = (typeof data.spotlightIntensity === 'number') ? data.spotlightIntensity : 1.0;
    const isDof = data.depthOfField === true;

    const rawCoverage = typeof data.coverageScale === 'number' ? data.coverageScale : 58;
    const scaleFactor = (Math.max(35, Math.min(90, rawCoverage)) / 58).toFixed(3);

    const tiltX = (typeof data.tiltAngleX === 'number') ? data.tiltAngleX : (isDossier ? 28 : 14);
    const tiltY = (typeof data.tiltAngleY === 'number') ? data.tiltAngleY : (isDossier ? -12 : 0);
    const tiltZ = isDossier ? 2.5 : 0;

    const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : CHECKLIST_DEFAULTS.items;
    const slipAngles = [-1.4, 1.8, -0.9, 1.3, -1.6, 1.5];

    setTimeout(() => {
      const mountedRoot = document.querySelector('#tpl-modal-preview-stage .tpl-checklist');
      if (mountedRoot) bindChecklist3DStageOrbit(mountedRoot);
    }, 30);

    return `
      <div class="tpl-checklist ${isDossier ? 'mode-dossier' : 'mode-slips'} env-${bgEnv}" 
           style="--cl-spot-intensity: ${spotIntensity}; --cl-scale-factor: ${scaleFactor}; cursor: grab;">
        
        ${getPaperDefsSvg()}

        ${bgEnv === 'desk' ? `
          <div class="cl-desk-surface">
            <div class="cl-desk-tactical-wash"></div>
          </div>
        ` : getBlueprintBackdropSvg()}

        <div class="cl-overhead-spotlight"></div>
        <div class="cl-volumetric-shafts"></div>
        ${data.volumetricDust !== false ? getVolumetricDustMotesHtml() : ''}
        <div class="cl-cinematic-vignette"></div>

        <div class="cl-3d-spatial-rig">
          <div class="cl-3d-stage" style="transform: perspective(1100px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${scaleFactor});">

            ${isDossier ? `
              <div class="cl-dossier-sheet ${isDof ? 'has-shallow-dof' : ''}">
                <div class="cl-paper-grain-overlay"></div>
                <div class="cl-paper-deckle-edge"></div>
                <div class="cl-paper-crease-h"></div>
                
                <div class="cl-dossier-inner">
                  <div class="cl-dossier-header">
                    <span class="cl-dossier-agency">INVESTIGATIVE ACTION FILE</span>
                    <span class="cl-dossier-code">CASE #8842-EVIDENCE</span>
                  </div>

                  <div class="cl-dossier-items-list">
                    ${items.map((item, idx) => {
                      const blurState = computeItemBlurState(item, idx, data);
                      const blurClass = blurState.isBlurred ? 'is-blurred-dof' : (blurState.isFocused ? 'is-sharp-focus' : '');
                      const isChecked = (typeof item === 'object') ? item.checked !== false : true;
                      const text = (typeof item === 'object') ? (item.text || '') : item;

                      return `
                        <div class="cl-dossier-item ${blurClass}" 
                             style="--cl-item-delay: ${blurState.dropDelay}s;
                                    --cl-entry-blur: ${blurState.entryBlur}px;
                                    --cl-item-blur: ${blurState.effectiveBlur}px;
                                    --cl-item-opacity: ${blurState.effectiveOpacity};
                                    --cl-unblur-delay: ${blurState.unblurStartDelay}s;
                                    --cl-unblur-dur: ${blurState.unblurDuration}s;" 
                             data-item-idx="${idx}">
                          ${getInkStampCheckboxHtml(isChecked, stampColor, blurState.stampDelay, data.organicStampSlam !== false)}
                          <div class="cl-item-text">${text}</div>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  ${data.organicStampSeal !== false ? getOfficialStampSealHtml(stampColor) : ''}
                </div>
              </div>
            ` : `
              <div class="cl-slips-stack ${isDof ? 'has-shallow-dof' : ''}">
                ${items.map((item, idx) => {
                  const blurState = computeItemBlurState(item, idx, data);
                  const blurClass = blurState.isBlurred ? 'is-blurred-dof' : (blurState.isFocused ? 'is-sharp-focus' : '');
                  const isChecked = (typeof item === 'object') ? item.checked !== false : true;
                  const text = (typeof item === 'object') ? (item.text || '') : item;
                  const rot = slipAngles[idx % slipAngles.length];

                  return `
                    <div class="cl-evidence-slip-wrapper ${blurClass}" 
                         style="--cl-slip-rot: ${rot}deg;
                                --cl-drop-delay: ${blurState.dropDelay}s;
                                --cl-entry-blur: ${blurState.entryBlur}px;
                                --cl-item-blur: ${blurState.effectiveBlur}px;
                                --cl-item-opacity: ${blurState.effectiveOpacity};
                                --cl-unblur-delay: ${blurState.unblurStartDelay}s;
                                --cl-unblur-dur: ${blurState.unblurDuration}s;" 
                         data-item-idx="${idx}">
                      
                      ${data.organicTape !== false ? getMaskingTapeHtml() : ''}

                      <div class="cl-evidence-slip">
                        <div class="cl-paper-grain-overlay"></div>
                        ${getInkStampCheckboxHtml(isChecked, stampColor, blurState.stampDelay, data.organicStampSlam !== false)}
                        <div class="cl-item-text">${text}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}

          </div>
        </div>

      </div>
    `;
  };

  window.tplTriggerChecklistStampAnimation = function(container) {
    if (!container) return;
    const animEls = container.querySelectorAll('.cl-evidence-slip-wrapper, .cl-dossier-sheet, .cl-dossier-item, .cl-stamp-box-wrap, .cl-masking-tape, .cl-official-stamp-seal');
    animEls.forEach((el) => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  };

  window.tplBuildChecklistInspector = function(container, customData, tplId) {
    if (!container) return;
    const data = Object.assign({}, CHECKLIST_DEFAULTS, customData || {});
    const items = Array.isArray(data.items) ? data.items : CHECKLIST_DEFAULTS.items;
    const blurMode = data.blurMode || (data.depthOfField === true ? 'rack-focus' : 'sequential');
    const entryBlur = typeof data.entryBlurPx === 'number' ? data.entryBlurPx : 6.5;
    const unblurDur = typeof data.unblurDurationSec === 'number' ? data.unblurDurationSec : 0.55;
    const stepInterval = typeof data.stepIntervalSec === 'number' ? data.stepIntervalSec : 0.38;
    const curGlobalBlur = typeof data.globalBlurPx === 'number' ? data.globalBlurPx : 0;

    const stampColors = [
      { label: 'Forensic Green', val: '#15803d' },
      { label: 'Emerald Mint', val: '#10b981' },
      { label: 'Bureau Crimson', val: '#b91c1c' },
      { label: 'Navy Classified', val: '#1d4ed8' },
      { label: 'Noir Charcoal', val: '#1e293b' }
    ];

    container.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.28); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 11px;">
        
        <!-- HEADER -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 7px;">
            <span style="font-size: 15px;">📋</span>
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.8px;">3D PAPER ARTIFACT ENGINE</div>
              <div style="font-size: 8.5px; color: #94a3b8;">Sequential One-by-One Blur Fade-Out &amp; 3D Rig</div>
            </div>
          </div>
          <button type="button" id="cl-btn-replay-slam" style="font-size: 9.5px; font-weight: 800; color: #34d399; cursor: pointer; padding: 4px 9px; border-radius: 5px; background: rgba(16,185,129,0.18); border: 1px solid rgba(16,185,129,0.45); display: flex; align-items: center; gap: 4px;">
            <span>▶ Replay Blur &amp; Drop</span>
          </button>
        </div>

        <!-- 1. MASTER LAYOUT CHOICE -->
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <span style="font-size: 9px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">1. Documentary Presentation Style</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" id="cl-choice-slips" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 7px 8px; border-radius: 6px; cursor: pointer; background: ${data.layoutMode === 'slips' ? 'rgba(16,185,129,0.22)' : 'rgba(0,0,0,0.35)'}; border: 1px solid ${data.layoutMode === 'slips' ? '#10b981' : 'rgba(255,255,255,0.12)'}; color: #fff;">
              <span style="font-size: 10px; font-weight: 800;">📑 Stacked Slips</span>
              <span style="font-size: 8px; color: #94a3b8;">Falling Taped Evidence</span>
            </button>
            <button type="button" id="cl-choice-dossier" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 7px 8px; border-radius: 6px; cursor: pointer; background: ${data.layoutMode === 'dossier' ? 'rgba(16,185,129,0.22)' : 'rgba(0,0,0,0.35)'}; border: 1px solid ${data.layoutMode === 'dossier' ? '#10b981' : 'rgba(255,255,255,0.12)'}; color: #fff;">
              <span style="font-size: 10px; font-weight: 800;">🗺️ 3D Spatial Dossier</span>
              <span style="font-size: 8px; color: #94a3b8;">Tilted Parchment Sheet</span>
            </button>
          </div>
        </div>

        <!-- 2. SEQUENTIAL BLUR FADE-OUT & TIMING CONTROLS -->
        <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(15,23,42,0.65); border: 1px solid rgba(56,189,248,0.28); border-radius: 8px; padding: 9px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 9.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">2. Sequential Blur Fade-Out &amp; Timing</div>
              <div style="font-size: 8px; color: #94a3b8;">Appears with blur, then unblurs one-by-one to 100% sharp</div>
            </div>
            <button type="button" id="cl-btn-reset-seq" style="font-size: 8px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.35); border-radius: 4px; padding: 2px 7px; cursor: pointer;">
              Default Fade-Out
            </button>
          </div>

          <!-- 3 Blur Modes -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
            <button type="button" class="cl-blur-mode-btn" data-mode="sequential" style="padding: 5px 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${blurMode === 'sequential' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${blurMode === 'sequential' ? 'rgba(56,189,248,0.22)' : 'rgba(0,0,0,0.35)'}; color: ${blurMode === 'sequential' ? '#fff' : '#94a3b8'}; cursor: pointer;">
              ✨ One-by-One Fade
            </button>
            <button type="button" class="cl-blur-mode-btn" data-mode="rack-focus" style="padding: 5px 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${blurMode === 'rack-focus' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${blurMode === 'rack-focus' ? 'rgba(56,189,248,0.22)' : 'rgba(0,0,0,0.35)'}; color: ${blurMode === 'rack-focus' ? '#fff' : '#94a3b8'}; cursor: pointer;">
              🎯 Keep DOF Blur
            </button>
            <button type="button" class="cl-blur-mode-btn" data-mode="none" style="padding: 5px 4px; font-size: 8.5px; font-weight: 700; border-radius: 5px; border: 1px solid ${blurMode === 'none' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background: ${blurMode === 'none' ? 'rgba(56,189,248,0.22)' : 'rgba(0,0,0,0.35)'}; color: ${blurMode === 'none' ? '#fff' : '#94a3b8'}; cursor: pointer;">
              💎 Instant Sharp
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #cbd5e1;">
                <span>Appear / Entry Blur</span>
                <span id="cl-val-entry-blur" style="color: #38bdf8; font-family: monospace;">${entryBlur.toFixed(1)}px</span>
              </div>
              <input type="range" id="cl-range-entry-blur" min="0" max="16" step="0.5" value="${entryBlur}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #cbd5e1;">
                <span>Unblur Fade Speed</span>
                <span id="cl-val-unblur-dur" style="color: #34d399; font-family: monospace;">${unblurDur.toFixed(2)}s</span>
              </div>
              <input type="range" id="cl-range-unblur-dur" min="0.15" max="2.5" step="0.05" value="${unblurDur}" style="width: 100%; accent-color: #34d399; height: 3px; cursor: pointer;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #cbd5e1;">
                <span>One-by-One Step Time</span>
                <span id="cl-val-step-sec" style="color: #a855f7; font-family: monospace;">${stepInterval.toFixed(2)}s</span>
              </div>
              <input type="range" id="cl-range-step-sec" min="0.12" max="1.2" step="0.04" value="${stepInterval}" style="width: 100%; accent-color: #a855f7; height: 3px; cursor: pointer;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #cbd5e1;">
                <span>Final Resting Blur</span>
                <span id="cl-val-global-blur" style="color: #94a3b8; font-family: monospace;">${curGlobalBlur.toFixed(1)}px</span>
              </div>
              <input type="range" id="cl-range-global-blur" min="0" max="12" step="0.2" value="${curGlobalBlur}" style="width: 100%; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
            </div>
          </div>
        </div>

        <!-- 3. ENVIRONMENT & 3D SPATIAL RIG (Drag on Stage to Orbit in 3D) -->
        <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 9px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">3. 3D Spatial Rig (Drag Stage to Orbit)</span>
            <span style="font-size: 8px; color: #34d399; font-family: monospace;">3D Interactive</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <select id="cl-sel-bg" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 4px; color: #fff; font-size: 9.5px;">
              <option value="desk" ${data.bgEnvironment === 'desk' ? 'selected' : ''}>🪵 Dark Mahogany Desk</option>
              <option value="blueprint" ${data.bgEnvironment === 'blueprint' ? 'selected' : ''}>🌐 Investigative Blue Grid</option>
            </select>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; cursor: pointer;">
              <input type="checkbox" id="cl-chk-dust" ${data.volumetricDust !== false ? 'checked' : ''} style="accent-color: #34d399;" />
              <span>Volumetric Dust Motes</span>
            </label>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 2px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Tilt X</span>
                <span id="cl-val-tiltx">${data.tiltAngleX !== undefined ? data.tiltAngleX : 14}°</span>
              </div>
              <input type="range" id="cl-range-tiltx" min="-15" max="45" value="${data.tiltAngleX !== undefined ? data.tiltAngleX : 14}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Yaw Y</span>
                <span id="cl-val-tilty">${data.tiltAngleY !== undefined ? data.tiltAngleY : 0}°</span>
              </div>
              <input type="range" id="cl-range-tilty" min="-35" max="35" value="${data.tiltAngleY !== undefined ? data.tiltAngleY : 0}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Scale</span>
                <span id="cl-val-scale">${data.coverageScale || 58}%</span>
              </div>
              <input type="range" id="cl-range-scale" min="40" max="85" value="${data.coverageScale || 58}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8;">
                <span>Light</span>
                <span id="cl-val-spotlight">${Math.round((data.spotlightIntensity || 1.0) * 100)}%</span>
              </div>
              <input type="range" id="cl-range-spotlight" min="20" max="150" value="${Math.round((data.spotlightIntensity || 1.0) * 100)}" style="width: 100%; accent-color: #34d399; height: 3px;" />
            </div>
          </div>
        </div>

        <!-- 4. CHECKLIST ITEMS, PER-ITEM BLUR & CUSTOM UNBLUR TIMING -->
        <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 9px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">4. Items, Custom Blur &amp; Unblur Time</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              ${stampColors.map(c => `
                <div class="cl-color-dot" data-val="${c.val}" title="${c.label}" style="width: 13px; height: 13px; border-radius: 50%; background: ${c.val}; cursor: pointer; border: ${data.stampColor === c.val ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)'};"></div>
              `).join('')}
              <button type="button" id="cl-btn-add-item" style="font-size: 8.5px; font-weight: 700; color: #34d399; cursor: pointer; padding: 2px 6px; border-radius: 4px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);">+ Add</button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px; max-height: 220px; overflow-y: auto; padding-right: 2px;">
            ${items.map((item, idx) => {
              const isChecked = (typeof item === 'object') ? item.checked !== false : true;
              const text = (typeof item === 'object') ? (item.text || '') : item;
              const itemBlur = (typeof item === 'object' && typeof item.blurPx === 'number') ? item.blurPx : 0;
              const itemDelay = (typeof item === 'object' && typeof item.unblurDelaySec === 'number') ? item.unblurDelaySec : 0;
              const blurState = computeItemBlurState(item, idx, data);

              return `
                <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.34); padding: 6px 7px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.07);">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <input type="checkbox" class="cl-item-chk" data-idx="${idx}" ${isChecked ? 'checked' : ''} style="accent-color: #34d399;" />
                    <input type="text" class="cl-item-input" data-idx="${idx}" value="${text.replace(/"/g, '&quot;')}" style="flex: 1; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 3px 6px; color: #fff; font-size: 9.5px;" />
                    <span style="font-size: 8px; font-family: monospace; color: #34d399;">@${blurState.unblurStartDelay.toFixed(2)}s</span>
                    ${items.length > 1 ? `<button type="button" class="cl-item-del-btn" data-idx="${idx}" style="background: none; border: none; cursor: pointer; font-size: 10px; color: #ef4444;">✕</button>` : ''}
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-left: 18px;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 7.5px; color: #94a3b8; white-space: nowrap;">Rest Blur:</span>
                      <input type="range" class="cl-item-blur-range" data-idx="${idx}" min="0" max="12" step="0.2" value="${itemBlur}" style="flex: 1; accent-color: #38bdf8; height: 3px; cursor: pointer;" />
                      <span class="cl-item-blur-val" data-idx="${idx}" style="font-size: 7.5px; font-family: monospace; color: ${blurState.effectiveBlur > 0 ? '#38bdf8' : '#64748b'}; min-width: 28px; text-align: right;">${blurState.effectiveBlur.toFixed(1)}px</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 7.5px; color: #94a3b8; white-space: nowrap;">Hold Blur:</span>
                      <input type="range" class="cl-item-delay-range" data-idx="${idx}" min="0" max="2.5" step="0.1" value="${itemDelay}" style="flex: 1; accent-color: #a855f7; height: 3px; cursor: pointer;" />
                      <span class="cl-item-delay-val" data-idx="${idx}" style="font-size: 7.5px; font-family: monospace; color: #c4b5fd; min-width: 28px; text-align: right;">+${itemDelay.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    const update = (patch, replay = false) => {
      window.tplSetContextualData(tplId, patch);
      window.tplRenderContextualInspector(tplId);
      if (replay) {
        const stage = document.querySelector('.tpl-checklist');
        if (stage && typeof window.tplTriggerChecklistStampAnimation === 'function') {
          window.tplTriggerChecklistStampAnimation(stage.parentElement);
        }
      }
    };

    const updateOpticsLive = (patch, replay = false) => {
      const merged = Object.assign({}, window.tplGetContextualData(tplId), patch);
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage && window.tplUpdateChecklistOpticsLive(stage, merged)) {
        window.tplSetContextualData(tplId, patch);
      } else {
        window.tplSetContextualData(tplId, patch);
      }
      if (replay && stage) {
        window.tplTriggerChecklistStampAnimation(stage);
      }
    };

    container.querySelector('#cl-choice-slips')?.addEventListener('click', () => update({ layoutMode: 'slips', tiltAngleX: 14, tiltAngleY: 0 }, true));
    container.querySelector('#cl-choice-dossier')?.addEventListener('click', () => update({ layoutMode: 'dossier', tiltAngleX: 28, tiltAngleY: -12 }, true));

    container.querySelectorAll('.cl-blur-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.dataset.mode;
        if (m === 'sequential') {
          update({ blurMode: 'sequential', depthOfField: false, globalBlurPx: 0, entryBlurPx: 6.5 }, true);
        } else if (m === 'rack-focus') {
          update({ blurMode: 'rack-focus', depthOfField: true, globalBlurPx: 3.2, activeFocusIndex: items.length - 1 }, true);
        } else {
          update({ blurMode: 'none', depthOfField: false, globalBlurPx: 0, entryBlurPx: 0 }, true);
        }
      });
    });

    container.querySelector('#cl-btn-reset-seq')?.addEventListener('click', () => {
      const resetItems = items.map(it => typeof it === 'object' ? Object.assign({}, it, { blurPx: 0, unblurDelaySec: 0 }) : { text: String(it), checked: true, blurPx: 0, unblurDelaySec: 0 });
      update({
        blurMode: 'sequential',
        depthOfField: false,
        entryBlurPx: 6.5,
        unblurDurationSec: 0.55,
        stepIntervalSec: 0.38,
        globalBlurPx: 0,
        items: resetItems
      }, true);
    });

    container.querySelector('#cl-range-entry-blur')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      const lbl = container.querySelector('#cl-val-entry-blur');
      if (lbl) lbl.textContent = `${val.toFixed(1)}px`;
      updateOpticsLive({ entryBlurPx: val, blurMode: val > 0 ? 'sequential' : data.blurMode }, true);
    });

    container.querySelector('#cl-range-unblur-dur')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0.55;
      const lbl = container.querySelector('#cl-val-unblur-dur');
      if (lbl) lbl.textContent = `${val.toFixed(2)}s`;
      updateOpticsLive({ unblurDurationSec: val }, true);
    });

    container.querySelector('#cl-range-step-sec')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0.38;
      const lbl = container.querySelector('#cl-val-step-sec');
      if (lbl) lbl.textContent = `${val.toFixed(2)}s`;
      updateOpticsLive({ stepIntervalSec: val }, true);
    });

    container.querySelector('#cl-range-global-blur')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      const lbl = container.querySelector('#cl-val-global-blur');
      if (lbl) lbl.textContent = `${val.toFixed(1)}px`;
      updateOpticsLive({ globalBlurPx: val, depthOfField: val > 0 });
    });

    container.querySelector('#cl-sel-bg')?.addEventListener('change', (e) => update({ bgEnvironment: e.target.value }));
    container.querySelector('#cl-chk-dust')?.addEventListener('change', (e) => update({ volumetricDust: e.target.checked }));

    container.querySelector('#cl-range-tiltx')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const lbl = container.querySelector('#cl-val-tiltx');
      if (lbl) lbl.textContent = `${val}°`;
      updateOpticsLive({ tiltAngleX: val });
    });
    container.querySelector('#cl-range-tilty')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const lbl = container.querySelector('#cl-val-tilty');
      if (lbl) lbl.textContent = `${val}°`;
      updateOpticsLive({ tiltAngleY: val });
    });
    container.querySelector('#cl-range-scale')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const lbl = container.querySelector('#cl-val-scale');
      if (lbl) lbl.textContent = `${val}%`;
      updateOpticsLive({ coverageScale: val });
    });
    container.querySelector('#cl-range-spotlight')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) / 100;
      const lbl = container.querySelector('#cl-val-spotlight');
      if (lbl) lbl.textContent = `${e.target.value}%`;
      updateOpticsLive({ spotlightIntensity: val });
    });

    container.querySelectorAll('.cl-color-dot').forEach(dot => {
      dot.onclick = () => update({ stampColor: dot.dataset.val });
    });

    container.querySelector('#cl-btn-replay-slam')?.addEventListener('click', () => {
      const stage = document.querySelector('.tpl-checklist');
      if (stage && typeof window.tplTriggerChecklistStampAnimation === 'function') {
        window.tplTriggerChecklistStampAnimation(stage.parentElement);
      }
    });

    container.querySelectorAll('.cl-item-input').forEach(inp => {
      inp.oninput = (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        const liveData = window.tplGetContextualData(tplId);
        const curItems = Array.isArray(liveData.items) ? [...liveData.items] : [...CHECKLIST_DEFAULTS.items];
        curItems[idx] = Object.assign({}, typeof curItems[idx] === 'object' ? curItems[idx] : { checked: true }, { text: e.target.value });
        window.tplSetContextualData(tplId, { items: curItems });
      };
    });

    container.querySelectorAll('.cl-item-chk').forEach(chk => {
      chk.onchange = (e) => {
        const idx = parseInt(chk.dataset.idx, 10);
        const liveData = window.tplGetContextualData(tplId);
        const curItems = Array.isArray(liveData.items) ? [...liveData.items] : [...CHECKLIST_DEFAULTS.items];
        curItems[idx] = Object.assign({}, typeof curItems[idx] === 'object' ? curItems[idx] : { text: String(curItems[idx]) }, { checked: e.target.checked });
        update({ items: curItems });
      };
    });

    container.querySelectorAll('.cl-item-blur-range').forEach(rng => {
      rng.oninput = (e) => {
        const idx = parseInt(rng.dataset.idx, 10);
        const val = parseFloat(e.target.value) || 0;
        const liveData = window.tplGetContextualData(tplId);
        const curItems = Array.isArray(liveData.items) ? [...liveData.items] : [...CHECKLIST_DEFAULTS.items];
        curItems[idx] = Object.assign({}, typeof curItems[idx] === 'object' ? curItems[idx] : { text: String(curItems[idx]), checked: true }, { blurPx: val });
        updateOpticsLive({ items: curItems });
        const valLbl = container.querySelector(`.cl-item-blur-val[data-idx="${idx}"]`);
        if (valLbl) {
          valLbl.textContent = `${val.toFixed(1)}px`;
          valLbl.style.color = val > 0 ? '#38bdf8' : '#64748b';
        }
      };
    });

    container.querySelectorAll('.cl-item-delay-range').forEach(rng => {
      rng.oninput = (e) => {
        const idx = parseInt(rng.dataset.idx, 10);
        const val = parseFloat(e.target.value) || 0;
        const liveData = window.tplGetContextualData(tplId);
        const curItems = Array.isArray(liveData.items) ? [...liveData.items] : [...CHECKLIST_DEFAULTS.items];
        curItems[idx] = Object.assign({}, typeof curItems[idx] === 'object' ? curItems[idx] : { text: String(curItems[idx]), checked: true }, { unblurDelaySec: val });
        updateOpticsLive({ items: curItems }, true);
        const valLbl = container.querySelector(`.cl-item-delay-val[data-idx="${idx}"]`);
        if (valLbl) valLbl.textContent = `+${val.toFixed(1)}s`;
      };
    });

    container.querySelectorAll('.cl-item-del-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const curItems = Array.isArray(data.items) ? [...data.items] : [...CHECKLIST_DEFAULTS.items];
        curItems.splice(idx, 1);
        update({ items: curItems });
      };
    });

    container.querySelector('#cl-btn-add-item')?.addEventListener('click', () => {
      const curItems = Array.isArray(data.items) ? [...data.items] : [...CHECKLIST_DEFAULTS.items];
      curItems.push({ text: `Step ${curItems.length + 1} milestone`, checked: true, blurPx: 0, unblurDelaySec: 0 });
      update({ items: curItems }, true);
    });
  };

})();
