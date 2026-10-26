/**
 * Magnates Studio - Universal Stage Direct Manipulation & Floating Contextual Toolbar Engine
 * Enables on-canvas selection, dragging, corner-resizing, font/size toolbar, and fullscreen toggling
 * across all template foreground and background layers.
 */
(function() {
  'use strict';

  let currentTargetEl = null;
  let targetType = 'fg'; // 'fg', 'bg', or 'text'
  let isDragging = false;
  let isResizing = false;
  let activeHandle = null;
  let dragStartX = 0, dragStartY = 0;
  let initialOffsetX = 0, initialOffsetY = 0;
  let initialScale = 1;
  let initialBoxRect = null;

  // Initialize or rebind on canvas whenever preview stage updates
  window.initUniversalStageTransformEngine = function() {
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (!stage) return;
    const stageInner = stage.querySelector('#customizer-stage-inner') || stage;

    // Ensure state container exists
    if (typeof topCustomizerState === 'undefined') window.topCustomizerState = {};
    if (!topCustomizerState.transforms) topCustomizerState.transforms = { fg: { x: 0, y: 0, scale: 1, isFullscreen: false }, bg: { x: 0, y: 0, scale: 1 }, text: { x: 0, y: 0, scale: 1 } };
    if ((topCustomizerState.currentTpl?.id === 'subscribe' || topCustomizerState.currentTpl?.id === 'receipt') && typeof window.tplGetContextualData === 'function') {
      const liveData = window.tplGetContextualData(topCustomizerState.currentTpl.id);
      if (liveData) {
        topCustomizerState.transforms.fg.x = typeof liveData.posX === 'number' ? liveData.posX : 0;
        topCustomizerState.transforms.fg.y = typeof liveData.posY === 'number' ? liveData.posY : 0;
        topCustomizerState.transforms.fg.scale = typeof liveData.scale === 'number' ? liveData.scale : 1.0;
      }
    }

    // Inject or retrieve transform box & toolbar
    let box = document.getElementById('stage-universal-transform-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'stage-universal-transform-box';
      box.style.cssText = `
        display: none;
        position: absolute;
        border: 1.5px dashed #38bdf8;
        box-shadow: 0 0 16px rgba(56,189,248,0.45), inset 0 0 8px rgba(56,189,248,0.15);
        pointer-events: none;
        z-index: 999;
        border-radius: 4px;
        transition: border-color 0.15s;
      `;
      box.innerHTML = `
        <div id="stage-tf-label" style="position: absolute; top: -22px; left: 0; background: #0284c7; color: #fff; font-size: 8.5px; font-weight: 800; padding: 1px 7px; border-radius: 3px; font-family: monospace; letter-spacing: 0.5px; text-transform: uppercase; white-space: nowrap; pointer-events: auto; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
          LAYER
        </div>
        <div class="stage-tf-handle" data-handle="tl" style="position: absolute; top: -6px; left: -6px; width: 12px; height: 12px; background: #fff; border: 2px solid #0284c7; border-radius: 3px; cursor: nwse-resize; pointer-events: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>
        <div class="stage-tf-handle" data-handle="tr" style="position: absolute; top: -6px; right: -6px; width: 12px; height: 12px; background: #fff; border: 2px solid #0284c7; border-radius: 3px; cursor: nesw-resize; pointer-events: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>
        <div class="stage-tf-handle" data-handle="bl" style="position: absolute; bottom: -6px; left: -6px; width: 12px; height: 12px; background: #fff; border: 2px solid #0284c7; border-radius: 3px; cursor: nesw-resize; pointer-events: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>
        <div class="stage-tf-handle" data-handle="br" style="position: absolute; bottom: -6px; right: -6px; width: 12px; height: 12px; background: #fff; border: 2px solid #0284c7; border-radius: 3px; cursor: nwse-resize; pointer-events: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>
      `;
      stageInner.appendChild(box);

      // Handle corner resizing
      box.querySelectorAll('.stage-tf-handle').forEach(h => {
        h.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          isResizing = true;
          activeHandle = h.dataset.handle;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          initialScale = topCustomizerState.transforms[targetType]?.scale || 1;
          initialBoxRect = box.getBoundingClientRect();
        });
      });
    }

    // Floating Contextual Toolbar
    let toolbar = document.getElementById('stage-floating-direct-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.id = 'stage-floating-direct-toolbar';
      toolbar.style.cssText = `
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(15,23,42,0.92);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.18);
        box-shadow: 0 8px 24px rgba(0,0,0,0.7);
        border-radius: 20px;
        padding: 5px 12px;
        z-index: 1000;
        pointer-events: auto;
      `;
      stageInner.appendChild(toolbar);
    }

    // Identify candidate interactive elements on stage
    const tplId = topCustomizerState.currentTpl?.id;
    const mapCtxData = (tplId === 'map' && typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('map') : null;
    const isMapInteractive3D = !!(mapCtxData && (mapCtxData.is3DMode || mapCtxData.drawOnScreenMode));
    const isUniversal3DOrbitActive = !!(typeof topCustomizerState !== 'undefined' && topCustomizerState.is3DMode);

    // Bind direct drag & 3D orbit for Cinematic Progress HUD (.tpl-progress)
    if (tplId === 'progress') {
      const progRoot = stage.querySelector('.tpl-progress');
      const progFrame = stage.querySelector('.tpl-progress .hud-progress-frame');
      if (progRoot && progFrame && progRoot.dataset.progInteractiveBound !== '1') {
        progRoot.dataset.progInteractiveBound = '1';
        let pMode = null;
        let sX = 0, sY = 0, oX = 0, oY = 0, oTiltX = 0, oTiltY = 0;
        progRoot.addEventListener('pointerdown', (ev) => {
          if (ev.target.closest('button, input, select')) return;
          const d = (typeof window.tplGetContextualData === 'function') ? (window.tplGetContextualData('progress') || {}) : {};
          const in3D = !!(typeof topCustomizerState !== 'undefined' && topCustomizerState.is3DMode);
          pMode = (in3D || ev.altKey || ev.shiftKey) ? 'orbit3d' : 'move';
          sX = ev.clientX;
          sY = ev.clientY;
          oX = Number(d.posX) || 0;
          oY = Number(d.posY) || 0;
          oTiltX = Number(d.tiltX) || 0;
          oTiltY = Number(d.tiltY) || 0;
          try { progRoot.setPointerCapture(ev.pointerId); } catch (_) {}
        });
        progRoot.addEventListener('pointermove', (ev) => {
          if (!pMode) return;
          const r = stage.getBoundingClientRect();
          const dx = ev.clientX - sX;
          const dy = ev.clientY - sY;
          if (pMode === 'orbit3d') {
            const nY = Math.max(-55, Math.min(55, Math.round(oTiltY + dx * 0.32)));
            const nX = Math.max(-45, Math.min(45, Math.round(oTiltX - dy * 0.28)));
            progFrame.style.setProperty('--hud-tilt-x', `${nX}deg`);
            progFrame.style.setProperty('--hud-tilt-y', `${nY}deg`);
            const d = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('progress') : null;
            if (d) { d.tiltX = nX; d.tiltY = nY; }
          } else {
            const nX = Math.max(-35, Math.min(35, Math.round(oX + (dx / Math.max(r.width, 1)) * 100)));
            const nY = Math.max(-35, Math.min(35, Math.round(oY + (dy / Math.max(r.height, 1)) * 100)));
            progRoot.style.setProperty('--hud-pos-x', `${nX}%`);
            progRoot.style.setProperty('--hud-pos-y', `${nY}%`);
            const d = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('progress') : null;
            if (d) { d.posX = nX; d.posY = nY; }
          }
        });
        const finishProgDrag = () => {
          if (!pMode) return;
          pMode = null;
          if (typeof window.tplSaveContextualStore === 'function') window.tplSaveContextualStore();
        };
        progRoot.addEventListener('pointerup', finishProgDrag);
        progRoot.addEventListener('pointercancel', finishProgDrag);
      }
    }

    // Universal 3D Stage Orbit for any general template when [ ⬡ 3D ] is active
    if (isUniversal3DOrbitActive && !['google', 'checklist', 'progress', 'conspiracy-board', 'wire-transfer', 'envelope-open', 'money-stack', 'map-pin-drop', 'map', 'empire-map', 'empire-timeline', 'headline-fly', 'newspaper-3d', 'screen-blur', 'docheight', 'tencent-shadow-giant-multimedia', 'adidas-puma-cosmic-earth-suite'].includes(tplId)) {
      const tplRoot = stage.querySelector('.home-tpl-fx-container > div') || stageInner.firstElementChild;
      if (tplRoot && tplRoot.dataset.univ3dBound !== '1') {
        tplRoot.dataset.univ3dBound = '1';
        tplRoot.style.transformStyle = 'preserve-3d';
        stageInner.style.perspective = '1150px';
        let uOrbit = false, uSX = 0, uSY = 0;
        let curRX = Number(topCustomizerState.univ3dRX) || 12;
        let curRY = Number(topCustomizerState.univ3dRY) || -16;
        tplRoot.style.transform = `perspective(1150px) rotateX(${curRX}deg) rotateY(${curRY}deg)`;
        tplRoot.style.cursor = 'grab';
        tplRoot.addEventListener('pointerdown', (ev) => {
          if (ev.target.closest('button, input, select, #paper-rip-mode-switcher')) return;
          if (!topCustomizerState.is3DMode) return;
          uOrbit = true;
          uSX = ev.clientX;
          uSY = ev.clientY;
          curRX = Number(topCustomizerState.univ3dRX) || 12;
          curRY = Number(topCustomizerState.univ3dRY) || -16;
          tplRoot.style.cursor = 'grabbing';
          try { tplRoot.setPointerCapture(ev.pointerId); } catch (_) {}
        });
        tplRoot.addEventListener('pointermove', (ev) => {
          if (!uOrbit || !topCustomizerState.is3DMode) return;
          const nRY = Math.max(-65, Math.min(65, Math.round(curRY + (ev.clientX - uSX) * 0.35)));
          const nRX = Math.max(-50, Math.min(50, Math.round(curRX - (ev.clientY - uSY) * 0.30)));
          topCustomizerState.univ3dRX = nRX;
          topCustomizerState.univ3dRY = nRY;
          tplRoot.style.transform = `perspective(1150px) rotateX(${nRX}deg) rotateY(${nRY}deg)`;
        });
        const endUOrbit = () => {
          uOrbit = false;
          tplRoot.style.cursor = 'grab';
        };
        tplRoot.addEventListener('pointerup', endUOrbit);
        tplRoot.addEventListener('pointercancel', endUOrbit);
      }
    } else {
      const tplRoot = stage.querySelector('.home-tpl-fx-container > div');
      if (tplRoot && tplRoot.dataset.univ3dBound === '1' && !isUniversal3DOrbitActive) {
        tplRoot.style.transform = '';
      }
    }

    // =========================================================================
    // UNIVERSAL 3D KEYFRAME MOTION RECORDER (FOR ALL 3D TEMPLATES & ELEMENTS)
    // =========================================================================
    if (!window._universal3DRecordedPaths) {
      try {
        window._universal3DRecordedPaths = JSON.parse(localStorage.getItem('regaarder_univ_3d_paths_v1') || '{}') || {};
      } catch (_) {
        window._universal3DRecordedPaths = {};
      }
    }
    if (!window._univ3dRecordState) {
      window._univ3dRecordState = { isRecording: false, isReplaying: false, tplId: null, startTime: 0, frames: [], rafId: null };
    }

    const persistUniv3DPaths = () => {
      try {
        localStorage.setItem('regaarder_univ_3d_paths_v1', JSON.stringify(window._universal3DRecordedPaths));
      } catch (_) {}
    };

    const captureUniv3DFrameSnapshot = (activeTplId) => {
      const ctxRaw = (typeof window.tplGetContextualData === 'function' && activeTplId) ? window.tplGetContextualData(activeTplId) : null;
      const numericCtx = {};
      if (ctxRaw && typeof ctxRaw === 'object') {
        ['posX', 'posY', 'scale', 'tiltX', 'tiltY', 'rotX', 'rotY', 'rotZ', 'camPitch', 'camYaw', 'camRoll', 'camZoom', 'zoomLevel', 'rotation'].forEach(k => {
          if (typeof ctxRaw[k] === 'number' && !isNaN(ctxRaw[k])) numericCtx[k] = ctxRaw[k];
        });
      }
      const progRoot = stage.querySelector('.tpl-progress');
      const progFrame = stage.querySelector('.tpl-progress .hud-progress-frame');
      const tplRoot = stage.querySelector('.home-tpl-fx-container > div') || stageInner.firstElementChild;
      return {
        t: performance.now() - window._univ3dRecordState.startTime,
        univ3dRX: Number(topCustomizerState.univ3dRX) || 0,
        univ3dRY: Number(topCustomizerState.univ3dRY) || 0,
        fx: window.tpl3DFx ? Object.assign({}, window.tpl3DFx) : null,
        fgTf: topCustomizerState.transforms?.fg ? Object.assign({}, topCustomizerState.transforms.fg) : null,
        ctx: numericCtx,
        hudPosX: progRoot ? progRoot.style.getPropertyValue('--hud-pos-x') : '',
        hudPosY: progRoot ? progRoot.style.getPropertyValue('--hud-pos-y') : '',
        hudTiltX: progFrame ? progFrame.style.getPropertyValue('--hud-tilt-x') : '',
        hudTiltY: progFrame ? progFrame.style.getPropertyValue('--hud-tilt-y') : '',
        rootTransform: (tplRoot && tplRoot.style) ? tplRoot.style.transform : ''
      };
    };

    const applyUniv3DInterpolatedFrame = (activeTplId, fA, fB, alpha) => {
      const lerp = (a, b) => a + (b - a) * alpha;
      if (typeof fA.univ3dRX === 'number' && typeof fB.univ3dRX === 'number') {
        topCustomizerState.univ3dRX = lerp(fA.univ3dRX, fB.univ3dRX);
        topCustomizerState.univ3dRY = lerp(fA.univ3dRY, fB.univ3dRY);
      }
      if (fA.fx && fB.fx && window.tpl3DFx) {
        ['pitch', 'yaw', 'roll', 'zoom'].forEach(k => {
          if (typeof fA.fx[k] === 'number' && typeof fB.fx[k] === 'number') {
            window.tpl3DFx[k] = Number(lerp(fA.fx[k], fB.fx[k]).toFixed(2));
          }
        });
      }
      if (fA.fgTf && fB.fgTf && topCustomizerState.transforms?.fg) {
        topCustomizerState.transforms.fg.x = lerp(fA.fgTf.x || 0, fB.fgTf.x || 0);
        topCustomizerState.transforms.fg.y = lerp(fA.fgTf.y || 0, fB.fgTf.y || 0);
        topCustomizerState.transforms.fg.scale = lerp(fA.fgTf.scale || 1, fB.fgTf.scale || 1);
      }
      if (fA.ctx && fB.ctx && typeof window.tplGetContextualData === 'function') {
        const liveD = window.tplGetContextualData(activeTplId);
        if (liveD) {
          Object.keys(fA.ctx).forEach(k => {
            if (typeof fA.ctx[k] === 'number' && typeof fB.ctx[k] === 'number') {
              liveD[k] = Number(lerp(fA.ctx[k], fB.ctx[k]).toFixed(2));
            }
          });
          if (activeTplId === 'progress') {
            const pRoot = stage.querySelector('.tpl-progress');
            const pFrame = stage.querySelector('.tpl-progress .hud-progress-frame');
            if (pRoot && typeof liveD.posX === 'number') {
              pRoot.style.setProperty('--hud-pos-x', `${liveD.posX}%`);
              pRoot.style.setProperty('--hud-pos-y', `${liveD.posY || 0}%`);
            }
            if (pFrame && typeof liveD.tiltX === 'number') {
              pFrame.style.setProperty('--hud-tilt-x', `${liveD.tiltX}deg`);
              pFrame.style.setProperty('--hud-tilt-y', `${liveD.tiltY || 0}deg`);
            }
          } else if (typeof window.tplUpdateStageWithContextualData === 'function') {
            window.tplUpdateStageWithContextualData(activeTplId, liveD);
          }
        }
      }
      const tplRoot = stage.querySelector('.home-tpl-fx-container > div') || stageInner.firstElementChild;
      if (tplRoot && topCustomizerState.is3DMode && !['google', 'spatial-3d-motion-suite', 'progress'].includes(activeTplId)) {
        tplRoot.style.transform = `perspective(1150px) rotateX(${(topCustomizerState.univ3dRX || 0).toFixed(1)}deg) rotateY(${(topCustomizerState.univ3dRY || 0).toFixed(1)}deg)`;
      }
    };

    window.tplReplayUniversal3DMotion = function(activeTplId) {
      const targetId = activeTplId || topCustomizerState.currentTpl?.id;
      if (!targetId) return;
      if (targetId === 'google' && typeof window.tplReplayGoogleRecordedMotion === 'function') {
        window.tplReplayGoogleRecordedMotion();
        return;
      }
      const pathObj = window._universal3DRecordedPaths[targetId];
      if (!pathObj || !Array.isArray(pathObj.frames) || pathObj.frames.length < 2) return;
      const st = window._univ3dRecordState;
      if (st.rafId) cancelAnimationFrame(st.rafId);
      st.isReplaying = true;
      const frames = pathObj.frames;
      const totalDur = Math.max(400, pathObj.durationMs || frames[frames.length - 1].t || 2500);
      const t0 = performance.now();
      const step = (now) => {
        if (!st.isReplaying) return;
        const elapsed = now - t0;
        const clamped = Math.min(elapsed, totalDur);
        let idx = 0;
        while (idx < frames.length - 2 && frames[idx + 1].t < clamped) idx++;
        const fA = frames[idx];
        const fB = frames[Math.min(frames.length - 1, idx + 1)];
        const span = Math.max(1, (fB.t || 0) - (fA.t || 0));
        const alpha = Math.max(0, Math.min(1, (clamped - (fA.t || 0)) / span));
        applyUniv3DInterpolatedFrame(targetId, fA, fB, alpha);
        if (elapsed < totalDur) {
          st.rafId = requestAnimationFrame(step);
        } else {
          st.isReplaying = false;
          renderUniv3DRecorderHud();
        }
      };
      renderUniv3DRecorderHud();
      st.rafId = requestAnimationFrame(step);
    };

    window.tplToggleUniversal3DMotionRecord = function(activeTplId) {
      const targetId = activeTplId || topCustomizerState.currentTpl?.id;
      if (!targetId) return;
      const st = window._univ3dRecordState;
      if (!st.isRecording) {
        if (st.rafId) cancelAnimationFrame(st.rafId);
        st.isReplaying = false;
        st.isRecording = true;
        st.tplId = targetId;
        st.startTime = performance.now();
        st.frames = [captureUniv3DFrameSnapshot(targetId)];
      } else {
        st.isRecording = false;
        st.frames.push(captureUniv3DFrameSnapshot(targetId));
        if (st.frames.length >= 2) {
          window._universal3DRecordedPaths[targetId] = {
            durationMs: Math.max(400, performance.now() - st.startTime),
            frames: st.frames.slice()
          };
          persistUniv3DPaths();
          window.tplReplayUniversal3DMotion(targetId);
        }
      }
      renderUniv3DRecorderHud();
    };

    window.tplClearUniversal3DMotion = function(activeTplId) {
      const targetId = activeTplId || topCustomizerState.currentTpl?.id;
      if (!targetId) return;
      delete window._universal3DRecordedPaths[targetId];
      persistUniv3DPaths();
      renderUniv3DRecorderHud();
    };

    const ALWAYS_3D_CAPABLE_TPLS = new Set([
      'progress', 'checklist', 'scam-redaction', 'deal-term-sheet', 'pyramid-scheme',
      'money-stack', 'wire-transfer', 'envelope-open', 'conspiracy-board', 'map',
      'empire-map', 'empire-timeline', 'headline-fly', 'newspaper-3d', 'document-3d-fx-engine',
      'jani-forbes-fraud-reveal', 'jani-ftx-logo-reveal', 'jani-flash-quad-sequence', 'jani-spin-flash-glitch-reveal'
    ]);
    const shouldShowUniv3DHud = tplId && tplId !== 'google' && tplId !== 'spatial-3d-motion-suite' && tplId !== 'tencent-shadow-giant-multimedia' && tplId !== 'adidas-puma-cosmic-earth-suite' && (isUniversal3DOrbitActive || isMapInteractive3D || ALWAYS_3D_CAPABLE_TPLS.has(tplId) || (window.SPATIAL_3D_CATEGORY_IDS && window.SPATIAL_3D_CATEGORY_IDS.has(tplId)));

    let u3dHud = document.getElementById('universal-3d-motion-recorder-hud');
    if (!u3dHud) {
      u3dHud = document.createElement('div');
      u3dHud.id = 'universal-3d-motion-recorder-hud';
      u3dHud.style.cssText = 'position:absolute;bottom:12px;right:14px;z-index:990;display:none;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;background:rgba(10,14,26,0.90);backdrop-filter:blur(12px);border:1px solid rgba(56,189,248,0.42);color:#e0f2fe;font-size:10.5px;font-weight:700;letter-spacing:0.03em;box-shadow:0 8px 24px rgba(0,0,0,0.65);pointer-events:auto;';
      stageInner.appendChild(u3dHud);
    }

    function renderUniv3DRecorderHud() {
      if (!u3dHud) return;
      if (!shouldShowUniv3DHud) {
        u3dHud.style.display = 'none';
        return;
      }
      u3dHud.style.display = 'flex';
      const st = window._univ3dRecordState;
      const isRec = st.isRecording && st.tplId === tplId;
      const saved = window._universal3DRecordedPaths[tplId];
      const hasSaved = !!(saved && saved.frames && saved.frames.length >= 2);
      u3dHud.innerHTML = `
        <span style="color:#94a3b8;font-size:9.5px;">3D Motion:</span>
        <button type="button" id="u3d-hud-rec-btn" style="background:${isRec ? 'rgba(239,68,68,0.92)' : 'rgba(239,68,68,0.22)'};border:1px solid ${isRec ? '#f87171' : 'rgba(239,68,68,0.55)'};color:${isRec ? '#fff' : '#fca5a5'};border-radius:999px;padding:2px 9px;font-size:10px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
          <span>${isRec ? '\u25a0' : '\u25cf'}</span><span>${isRec ? 'Stop & Save Path' : 'Record 3D Motion'}</span>
        </button>
        ${hasSaved && !isRec ? `<button type="button" id="u3d-hud-replay-btn" style="background:rgba(16,185,129,0.24);border:1px solid rgba(52,211,153,0.6);color:#6ee7b7;border-radius:999px;padding:2px 9px;font-size:10px;font-weight:800;cursor:pointer;">\u25b6 Replay (${saved.frames.length} pts)</button>` : ''}
        ${hasSaved && !isRec ? `<button type="button" id="u3d-hud-clear-btn" title="Clear Recorded 3D Path" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#cbd5e1;border-radius:999px;padding:2px 6px;font-size:9.5px;font-weight:700;cursor:pointer;">\u2715</button>` : ''}
      `;
      u3dHud.querySelector('#u3d-hud-rec-btn')?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        window.tplToggleUniversal3DMotionRecord(tplId);
      });
      u3dHud.querySelector('#u3d-hud-replay-btn')?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        window.tplReplayUniversal3DMotion(tplId);
      });
      u3dHud.querySelector('#u3d-hud-clear-btn')?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        window.tplClearUniversal3DMotion(tplId);
      });
    }
    renderUniv3DRecorderHud();

    if (stage.dataset.u3dRecCaptureBound !== '1') {
      stage.dataset.u3dRecCaptureBound = '1';
      let lastSampleTs = 0;
      const sampleIfRecording = () => {
        const st = window._univ3dRecordState;
        if (!st || !st.isRecording) return;
        const now = performance.now();
        if (now - lastSampleTs < 16) return;
        lastSampleTs = now;
        st.frames.push(captureUniv3DFrameSnapshot(st.tplId));
      };
      stage.addEventListener('pointermove', sampleIfRecording, { passive: true });
      stage.addEventListener('wheel', sampleIfRecording, { passive: true });
    }

    const hasDedicatedCustomizerBox = !!stage.querySelector('#customizer-transform-box, #doc-direct-transform-box');
    const isBypassStageTransform = hasDedicatedCustomizerBox || isMapInteractive3D || tplId === 'tencent-shadow-giant-multimedia' || tplId === 'adidas-puma-cosmic-earth-suite' || tplId === 'spooner-2-5d-photo-parallax' || tplId === 'progress' || tplId === 'conspiracy-board' || tplId === 'wire-transfer' || tplId === 'envelope-open' || tplId === 'money-stack' || tplId === 'map-pin-drop' || tplId === 'map' || tplId === 'empire-map' || tplId === 'empire-timeline' || tplId === 'headline-fly' || tplId === 'newspaper-3d' || tplId === 'screen-blur' || tplId === 'docheight' || tplId === 'google' || tplId === 'checklist' || isUniversal3DOrbitActive;
    if (isBypassStageTransform) {
      box.style.display = 'none';
      toolbar.style.display = 'none';
      return;
    }
    toolbar.style.display = 'flex';
    const fgCandidate = stage.querySelector('.tpl-subscribe .sub-wrap, .tpl-receipt .r-paper, .tpl-receipt .r-wrap, .r-paper, .sub-wrap, .quote-card, .scramble-terminal, .tpl-zoom .product, [id^="zb-cutout-wrap-"], [id^="fx-iris-container-"], .tpl-polaroid .polaroid-1, .subject, .figure, .doc, .tweet-card, .google-frame, .imessage-phone, .notif-stack, .ig-post, .cert, .p-card, .tpl-redcircle .red-circle, .tpl-countdown .big-num, .tpl-bearbull .bb-icon, .tpl-creditscore .cs-gauge, .globe-viewport, #customizer-live-fg-wrap, #customizer-live-fg, .ceo-cutout-wrap, .boardroom-scene-wrap, .home-tpl-fx-container > div');
    const textCandidate = stage.querySelector('.scramble-main-text, .zoom-hud-bottom, .ceo-info-card, .boardroom-hud-card, .cctv-hud-header, .bigtext, .doc-header, .w-title, .quote-text, .headline, .caption-wrap');
    const bgCandidate = stage.querySelector('.tpl-universal-bg-layer, .tpl-parallax .mtn-back, .tpl-textbehind, .tpl-docheight, #customizer-live-bg, .layer-mid, .mtn-back, .tpl-parallax');

    // Direct independent pointer dragging for Polaroid #1 and Polaroid #2 on stage
    if (tplId === 'polaroid') {
      const polCards = stage.querySelectorAll('.tpl-polaroid .polaroid');
      polCards.forEach((pCard, idx) => {
        if (pCard.dataset.polDragBound === '1') return;
        pCard.dataset.polDragBound = '1';
        let pDragging = false, pStartX = 0, pStartY = 0, origX = 0, origY = 0;
        pCard.addEventListener('pointerdown', (ev) => {
          if (ev.target.closest('button, input, select')) return;
          ev.stopPropagation();
          pDragging = true;
          pStartX = ev.clientX;
          pStartY = ev.clientY;
          currentTargetEl = pCard;
          targetType = 'fg';
          const pData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('polaroid') : {};
          origX = idx === 0 ? (pData.p1X != null ? Number(pData.p1X) : -78) : (pData.p2X != null ? Number(pData.p2X) : 72);
          origY = idx === 0 ? (pData.p1Y != null ? Number(pData.p1Y) : -6) : (pData.p2Y != null ? Number(pData.p2Y) : 10);
          pCard.style.cursor = 'grabbing';
          pCard.style.zIndex = '15';
          if (polCards[1 - idx]) polCards[1 - idx].style.zIndex = '5';
          updateBox();
          try { pCard.setPointerCapture(ev.pointerId); } catch (_) {}
        });
        pCard.addEventListener('pointermove', (ev) => {
          if (!pDragging) return;
          const dx = ev.clientX - pStartX;
          const dy = ev.clientY - pStartY;
          const nx = Math.round(origX + dx);
          const ny = Math.round(origY + dy);
          if (typeof window.tplSetContextualData === 'function') {
            window.tplSetContextualData('polaroid', idx === 0 ? { p1X: nx, p1Y: ny } : { p2X: nx, p2Y: ny });
          }
          currentTargetEl = pCard;
          updateBox();
        });
        const endPolDrag = () => {
          if (!pDragging) return;
          pDragging = false;
          pCard.style.cursor = 'grab';
          updateBox();
        };
        pCard.addEventListener('pointerup', endPolDrag);
        pCard.addEventListener('pointercancel', endPolDrag);
        pCard.addEventListener('wheel', (ev) => {
          ev.preventDefault();
          const pData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('polaroid') : {};
          const curSc = pData.polaroidScale != null ? Number(pData.polaroidScale) : 1.0;
          const nextSc = Math.max(0.6, Math.min(1.8, Number((curSc + (ev.deltaY < 0 ? 0.05 : -0.05)).toFixed(2))));
          if (typeof window.tplSetContextualData === 'function') {
            window.tplSetContextualData('polaroid', { polaroidScale: nextSc });
            if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector('polaroid');
          }
          updateBox();
        }, { passive: false });
      });
    }

    // Function to update toolbar contents based on active targetType
    const renderToolbar = () => {
      if (!toolbar) return;
      const tf = topCustomizerState.transforms[targetType] || { x: 0, y: 0, scale: 1, isFullscreen: false };

      if (targetType === 'text') {
        const textData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(tplId) : {};
        const curFont = textData.fontFamily || textData.titleFont || (tplId === 'scramble' ? "'JetBrains Mono', monospace" : "'Space Grotesk', sans-serif");
        const curSize = textData.fontSize || textData.titleSize || (tplId === 'scramble' ? 36 : 32);
        const curColor = textData.color || textData.textColor || textData.titleColor || textData.nameColor || (tplId === 'scramble' ? '#00ff88' : '#ffffff');
        const fonts = [
          { label: 'Space Grotesk', val: "'Space Grotesk', sans-serif" },
          { label: 'Impact', val: 'Impact, sans-serif' },
          { label: 'Montserrat', val: "'Montserrat', sans-serif" },
          { label: 'Cinzel', val: "'Cinzel', Georgia, serif" },
          { label: 'JetBrains Mono', val: "'JetBrains Mono', monospace" },
          { label: 'Inter', val: "'Inter', sans-serif" },
          { label: 'Georgia', val: "'Georgia', serif" }
        ];
        toolbar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px; border-right: 1px solid rgba(255,255,255,0.15); padding-right: 6px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #38bdf8; font-family: monospace;">TEXT</span>
          </div>
          <!-- Font Dropdown -->
          <select id="stage-tb-font" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 4px; outline: none; cursor: pointer;">
            ${fonts.map(f => `<option value="${f.val}" ${f.val === curFont ? 'selected' : ''}>${f.label}</option>`).join('')}
          </select>
          <!-- Size Steppers -->
          <div style="display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 1px 4px;">
            <button type="button" id="stage-tb-size-dec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">-</button>
            <span id="stage-tb-size-val" style="font-size: 10px; font-family: monospace; color: #38bdf8; font-weight: 700; min-width: 32px; text-align: center;">${curSize}px</span>
            <button type="button" id="stage-tb-size-inc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">+</button>
          </div>
          <!-- Color Picker -->
          <input type="color" id="stage-tb-color" value="${curColor}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" title="Text Color" />
          <!-- Layer Depth Switch -->
          <button type="button" id="stage-tb-depth" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); border-radius: 4px; color: #fff; font-size: 9.5px; font-weight: 700; padding: 2px 6px; cursor: pointer;" title="Bring to Front or Send Behind">
            ${textData.layerOrder === 'front' ? '\ud83d\udd32 Send Behind' : '\ud83d\udd32 Bring Front'}
          </button>
          <!-- Switch to Layer -->
          <button type="button" id="stage-tb-switch-fg" style="background: none; border: none; color: #94a3b8; font-size: 9.5px; cursor: pointer; text-decoration: underline;">Subject</button>
        `;
        // Wire text toolbar
        toolbar.querySelector('#stage-tb-font')?.addEventListener('change', (e) => {
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { fontFamily: e.target.value, titleFont: e.target.value });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
        });
        toolbar.querySelector('#stage-tb-size-dec')?.addEventListener('click', () => {
          const sz = Math.max(12, curSize - 3);
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { fontSize: sz, titleSize: sz });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-size-inc')?.addEventListener('click', () => {
          const sz = Math.min(180, curSize + 3);
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { fontSize: sz, titleSize: sz });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-color')?.addEventListener('input', (e) => {
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { color: e.target.value, textColor: e.target.value, titleColor: e.target.value, nameColor: e.target.value });
        });
        toolbar.querySelector('#stage-tb-depth')?.addEventListener('click', () => {
          const ord = textData.layerOrder === 'front' ? 'behind' : 'front';
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { layerOrder: ord });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-switch-fg')?.addEventListener('click', () => {
          selectTarget('fg');
        });
      } else if (targetType === 'fg') {
        const isParallax = tplId === 'parallax';
        const fgDir = topCustomizerState.spoonerFgDir || 'push';
        const fgZoomPct = Math.round(((topCustomizerState.spoonerFgZoom !== undefined ? topCustomizerState.spoonerFgZoom : 1.22)) * 100);
        toolbar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px; border-right: 1px solid rgba(255,255,255,0.15); padding-right: 6px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #2effc6; font-family: monospace;">FOREGROUND LAYER</span>
          </div>
          ${isParallax ? `
          <div style="display: flex; align-items: center; gap: 3px; background: rgba(0,0,0,0.45); border: 1px solid rgba(46,255,198,0.35); border-radius: 5px; padding: 1px 4px;" title="Foreground Motion Direction & Zoom %">
            <button type="button" id="stage-tb-px-fg-dir" style="background: rgba(46,255,198,0.18); border: 1px solid rgba(46,255,198,0.45); border-radius: 3px; color: #2effc6; font-size: 9px; font-weight: 800; padding: 1px 5px; cursor: pointer;">
              ${fgDir === 'push' ? '\u2197 Push In' : '\u2199 Pull Out'}
            </button>
            <button type="button" id="stage-tb-px-fg-zdec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 2px;">-</button>
            <span id="stage-tb-px-fg-zval" style="font-size: 9.5px; font-family: monospace; color: #fff; font-weight: 700; min-width: 30px; text-align: center;" title="Push/Pull Zoom Percentage">${fgZoomPct}%</span>
            <button type="button" id="stage-tb-px-fg-zinc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 2px;">+</button>
          </div>
          ` : ''}
          <!-- Fullscreen / Fit Toggle -->
          <button type="button" id="stage-tb-fullscreen" style="background: ${tf.isFullscreen ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.08)'}; border: 1px solid ${tf.isFullscreen ? '#38bdf8' : 'rgba(255,255,255,0.2)'}; border-radius: 4px; color: #fff; font-size: 9.5px; font-weight: 700; padding: 2px 7px; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="Toggle Full Screen Stage Coverage">
            <span>\u26f6</span> ${tf.isFullscreen ? 'Fit Mode' : 'Fullscreen'}
          </button>
          <!-- Scale Zoom Steppers -->
          <div style="display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 1px 4px;" title="Subject Base Scale">
            <button type="button" id="stage-tb-scale-dec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">-</button>
            <span id="stage-tb-scale-val" style="font-size: 10px; font-family: monospace; color: #2effc6; font-weight: 700; min-width: 32px; text-align: center;">${Math.round((tf.scale || 1) * 100)}%</span>
            <button type="button" id="stage-tb-scale-inc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">+</button>
          </div>
          <!-- Reset Transform -->
          <button type="button" id="stage-tb-reset" style="background: none; border: none; color: #94a3b8; font-size: 9.5px; cursor: pointer;" title="Reset Position & Scale">
            \u21ba Reset
          </button>
          <!-- Switch to Background -->
          <button type="button" id="stage-tb-switch-bg" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; color: #cbd5e1; font-size: 9.5px; font-weight: 600; padding: 2px 6px; cursor: pointer;" title="Select and adjust Background Scene">
            Backdrop \u25be
          </button>
          ${textCandidate ? `<button type="button" id="stage-tb-switch-txt" style="background: none; border: none; color: #38bdf8; font-size: 9.5px; cursor: pointer; text-decoration: underline;">Edit Text</button>` : ''}
        `;
        // Wire fg toolbar
        toolbar.querySelector('#stage-tb-px-fg-dir')?.addEventListener('click', () => {
          const nextFg = (topCustomizerState.spoonerFgDir || 'push') === 'push' ? 'pull' : 'push';
          topCustomizerState.spoonerFgDir = nextFg;
          topCustomizerState.spoonerBgDir = nextFg === 'push' ? 'pull' : 'push';
          renderToolbar();
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
        });
        toolbar.querySelector('#stage-tb-px-fg-zdec')?.addEventListener('click', () => {
          const cur = topCustomizerState.spoonerFgZoom !== undefined ? topCustomizerState.spoonerFgZoom : 1.22;
          topCustomizerState.spoonerFgZoom = Number(Math.max(1.04, cur - 0.03).toFixed(2));
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-px-fg-zinc')?.addEventListener('click', () => {
          const cur = topCustomizerState.spoonerFgZoom !== undefined ? topCustomizerState.spoonerFgZoom : 1.22;
          topCustomizerState.spoonerFgZoom = Number(Math.min(1.60, cur + 0.03).toFixed(2));
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-fullscreen')?.addEventListener('click', () => {
          tf.isFullscreen = !tf.isFullscreen;
          if (tf.isFullscreen) {
            tf.scale = 1;
            tf.x = 0;
            tf.y = 0;
          }
          applyTransforms();
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-scale-dec')?.addEventListener('click', () => {
          tf.scale = Math.max(0.2, (tf.scale || 1) - 0.1);
          tf.isFullscreen = false;
          applyTransforms();
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-scale-inc')?.addEventListener('click', () => {
          tf.scale = Math.min(3.5, (tf.scale || 1) + 0.1);
          tf.isFullscreen = false;
          applyTransforms();
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-reset')?.addEventListener('click', () => {
          tf.x = 0;
          tf.y = 0;
          tf.scale = 1;
          tf.isFullscreen = false;
          applyTransforms();
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-switch-bg')?.addEventListener('click', () => {
          selectTarget('bg');
        });
        toolbar.querySelector('#stage-tb-switch-txt')?.addEventListener('click', () => {
          selectTarget('text');
        });
      } else if (targetType === 'bg') {
        const isParallax = tplId === 'parallax';
        const bgDir = topCustomizerState.spoonerBgDir || 'pull';
        const bgZoomPct = Math.round(((topCustomizerState.spoonerBgZoom !== undefined ? topCustomizerState.spoonerBgZoom : 1.16)) * 100);
        const bgData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(tplId) : {};
        const curPreset = bgData.bgPreset || 'default';
        const presets = window.UNIVERSAL_BG_PRESETS || [
          { id: 'default', label: 'Default Scene' },
          { id: 'cyber-grid', label: 'Cyber Set Grid' },
          { id: 'cyber-3d-grid', label: '3D Cyber Grid' },
          { id: 'solid-black', label: 'Solid Black' },
          { id: 'transparent', label: 'No Background' },
          { id: 'vox-doc', label: 'Vox Document' },
          { id: 'embers', label: 'Floating Embers' },
          { id: 'dawn', label: 'Dawn Horizon' }
        ];
        toolbar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px; border-right: 1px solid rgba(255,255,255,0.15); padding-right: 6px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #f59e0b; font-family: monospace;">BACKGROUND</span>
          </div>
          ${isParallax ? `
          <div style="display: flex; align-items: center; gap: 3px; background: rgba(0,0,0,0.45); border: 1px solid rgba(56,189,248,0.35); border-radius: 5px; padding: 1px 4px;" title="Background Motion Direction & Zoom %">
            <button type="button" id="stage-tb-px-bg-dir" style="background: rgba(56,189,248,0.18); border: 1px solid rgba(56,189,248,0.45); border-radius: 3px; color: #38bdf8; font-size: 9px; font-weight: 800; padding: 1px 5px; cursor: pointer;">
              ${bgDir === 'pull' ? '\u2199 Pull Out' : '\u2197 Push In'}
            </button>
            <button type="button" id="stage-tb-px-bg-zdec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 2px;">-</button>
            <span id="stage-tb-px-bg-zval" style="font-size: 9.5px; font-family: monospace; color: #fff; font-weight: 700; min-width: 30px; text-align: center;" title="Push/Pull Zoom Percentage">${bgZoomPct}%</span>
            <button type="button" id="stage-tb-px-bg-zinc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 2px;">+</button>
          </div>
          ` : ''}
          <!-- Universal Backdrop Preset Selector -->
          <select id="stage-tb-bg-preset" style="background: rgba(0,0,0,0.65); border: 1px solid rgba(245,158,11,0.45); border-radius: 4px; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; outline: none; cursor: pointer;">
            ${presets.map(p => `<option value="${p.id}" ${p.id === curPreset ? 'selected' : ''} style="background:#0f172a;color:#fff;">${p.label}</option>`).join('')}
          </select>
          <!-- Upload Custom Video / Image BG -->
          <label style="background: rgba(56,189,248,0.2); border: 1px solid rgba(56,189,248,0.5); border-radius: 4px; color: #38bdf8; font-size: 9.5px; font-weight: 700; padding: 2px 7px; cursor: pointer; white-space: nowrap;">
            + Video / Img
            <input type="file" id="stage-tb-bg-file" accept="video/*,image/*" style="display: none;" />
          </label>
          <!-- Scale Zoom Steppers -->
          <div style="display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 1px 4px;">
            <button type="button" id="stage-tb-bg-dec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">-</button>
            <span id="stage-tb-bg-val" style="font-size: 10px; font-family: monospace; color: #f59e0b; font-weight: 700; min-width: 32px; text-align: center;">${Math.round((tf.scale || 1) * 100)}%</span>
            <button type="button" id="stage-tb-bg-inc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">+</button>
          </div>
          <!-- Switch back to Foreground -->
          <button type="button" id="stage-tb-switch-fg2" style="background: rgba(46,255,198,0.15); border: 1px solid rgba(46,255,198,0.4); border-radius: 4px; color: #2effc6; font-size: 9.5px; font-weight: 700; padding: 2px 7px; cursor: pointer;" title="Switch back to Subject">
            Subject \u25b4
          </button>
        `;
        toolbar.querySelector('#stage-tb-px-bg-dir')?.addEventListener('click', () => {
          const nextBg = (topCustomizerState.spoonerBgDir || 'pull') === 'pull' ? 'push' : 'pull';
          topCustomizerState.spoonerBgDir = nextBg;
          topCustomizerState.spoonerFgDir = nextBg === 'pull' ? 'push' : 'pull';
          renderToolbar();
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
        });
        toolbar.querySelector('#stage-tb-px-bg-zdec')?.addEventListener('click', () => {
          const cur = topCustomizerState.spoonerBgZoom !== undefined ? topCustomizerState.spoonerBgZoom : 1.16;
          topCustomizerState.spoonerBgZoom = Number(Math.max(1.04, cur - 0.03).toFixed(2));
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-px-bg-zinc')?.addEventListener('click', () => {
          const cur = topCustomizerState.spoonerBgZoom !== undefined ? topCustomizerState.spoonerBgZoom : 1.16;
          topCustomizerState.spoonerBgZoom = Number(Math.min(1.50, cur + 0.03).toFixed(2));
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-bg-preset')?.addEventListener('change', (e) => {
          if (typeof window.tplSetContextualData === 'function') {
            window.tplSetContextualData(tplId, { bgPreset: e.target.value, bgMediaUrl: '', bgMediaType: 'image' });
            if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
          }
        });
        toolbar.querySelector('#stage-tb-bg-file')?.addEventListener('change', (e) => {
          const f = e.target.files && e.target.files[0];
          if (f && typeof window.tplSetContextualData === 'function') {
            const url = URL.createObjectURL(f);
            const isVid = f.type.startsWith('video/');
            window.tplSetContextualData(tplId, { bgMediaUrl: url, bgMediaType: isVid ? 'video' : 'image' });
            if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
          }
        });
        toolbar.querySelector('#stage-tb-bg-dec')?.addEventListener('click', () => {
          tf.scale = Math.max(0.5, (tf.scale || 1) - 0.08);
          applyTransforms();
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-bg-inc')?.addEventListener('click', () => {
          tf.scale = Math.min(2.5, (tf.scale || 1) + 0.08);
          applyTransforms();
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-switch-fg2')?.addEventListener('click', () => {
          selectTarget('fg');
        });
      }
    };

    // Apply active CSS transform rules to stage elements (composing with CSS @keyframes via individual translate/scale when needed)
    const applyTransforms = () => {
      const fgTf = topCustomizerState.transforms.fg;
      if (fgCandidate && fgTf && tplId !== 'polaroid') {
        const isZoomProduct = fgCandidate.classList.contains('product') || (fgCandidate.id && fgCandidate.id.startsWith('fx-iris-container-'));
        const isBottomCenteredCutout = fgCandidate.classList.contains('figure') || fgCandidate.classList.contains('subject') || (fgCandidate.id && fgCandidate.id.startsWith('zb-cutout-wrap-'));
        const hasActiveKeyframes = (() => {
          try {
            const animName = getComputedStyle(fgCandidate).animationName;
            return animName && animName !== 'none';
          } catch (_) {
            return false;
          }
        })();

        if (fgTf.isFullscreen) {
          const sRect = stage.getBoundingClientRect();
          const naturalW = fgCandidate.offsetWidth || 380;
          const naturalH = fgCandidate.offsetHeight || 220;
          const fitScale = Math.min(
            (sRect.width * 0.88) / Math.max(naturalW, 1),
            (sRect.height * 0.88) / Math.max(naturalH, 1)
          );
          const safeScale = Math.max(1, Math.min(fitScale, 2.4));
          fgCandidate.style.transformOrigin = isBottomCenteredCutout ? 'center bottom' : 'center center';
          if (hasActiveKeyframes) {
            fgCandidate.style.translate = '0px 0px';
            fgCandidate.style.scale = `${safeScale.toFixed(3)}`;
          } else {
            fgCandidate.style.transform = isZoomProduct
              ? `translate(-50%, -50%) scale(${safeScale.toFixed(3)})`
              : (isBottomCenteredCutout
                  ? `translateX(-50%) scale(${safeScale.toFixed(3)})`
                  : `translate(0px, 0px) scale(${safeScale.toFixed(3)})`);
          }
        } else if (fgTf.x || fgTf.y || (fgTf.scale && fgTf.scale !== 1) || (tplId === 'receipt')) {
          fgCandidate.style.transformOrigin = isBottomCenteredCutout ? 'center bottom' : 'center center';
          if (isZoomProduct) {
            fgCandidate.style.animation = 'none';
            fgCandidate.style.transform = `translate(calc(-50% + ${fgTf.x || 0}px), calc(-50% + ${fgTf.y || 0}px)) scale(${fgTf.scale || 1})`;
          } else if (hasActiveKeyframes) {
            // Compose smoothly on top of running CSS @keyframes so the element never leaves its selection box behind
            fgCandidate.style.translate = `${fgTf.x || 0}px ${fgTf.y || 0}px`;
            fgCandidate.style.scale = `${fgTf.scale || 1}`;
          } else if (isBottomCenteredCutout) {
            fgCandidate.style.transform = `translate(calc(-50% + ${fgTf.x || 0}px), ${fgTf.y || 0}px) scale(${fgTf.scale || 1})`;
          } else if (tplId === 'receipt') {
            const rot = (typeof window.tplGetContextualData === 'function' && window.tplGetContextualData('receipt')?.rotation) || 0;
            fgCandidate.style.transform = `translate(${fgTf.x || 0}px, ${fgTf.y || 0}px) scale(${fgTf.scale || 1}) rotate(${rot}deg)`;
          } else {
            fgCandidate.style.transform = `translate(${fgTf.x || 0}px, ${fgTf.y || 0}px) scale(${fgTf.scale || 1})`;
          }
        } else if (hasActiveKeyframes) {
          fgCandidate.style.translate = '';
          fgCandidate.style.scale = '';
        }
      }

      const textTf = topCustomizerState.transforms.text;
      if (textCandidate && textTf && (textTf.x || textTf.y || (textTf.scale && textTf.scale !== 1))) {
        const isCenteredAbs = getComputedStyle(textCandidate).position === 'absolute' && (textCandidate.classList.contains('bigtext') || textCandidate.classList.contains('zoom-hud-bottom'));
        const hasTextKeyframes = (() => {
          try {
            const animName = getComputedStyle(textCandidate).animationName;
            return animName && animName !== 'none';
          } catch (_) {
            return false;
          }
        })();
        if (hasTextKeyframes) {
          textCandidate.style.translate = `${textTf.x || 0}px ${textTf.y || 0}px`;
          textCandidate.style.scale = `${textTf.scale || 1}`;
        } else if (isCenteredAbs) {
          textCandidate.style.transform = `translate(calc(-50% + ${textTf.x || 0}px), ${textTf.y || 0}px) scale(${textTf.scale || 1})`;
        } else {
          textCandidate.style.transform = `translate(${textTf.x || 0}px, ${textTf.y || 0}px) scale(${textTf.scale || 1})`;
        }
      }

      const bgTf = topCustomizerState.transforms.bg;
      if (bgCandidate && bgTf && (bgTf.x || bgTf.y || (bgTf.scale && bgTf.scale !== 1))) {
        const hasBgKeyframes = (() => {
          try {
            const animName = getComputedStyle(bgCandidate).animationName;
            return animName && animName !== 'none';
          } catch (_) {
            return false;
          }
        })();
        if (hasBgKeyframes) {
          bgCandidate.style.translate = `${bgTf.x || 0}px ${bgTf.y || 0}px`;
          bgCandidate.style.scale = `${bgTf.scale || 1}`;
        } else {
          bgCandidate.style.transform = `translate(${bgTf.x || 0}px, ${bgTf.y || 0}px) scale(${bgTf.scale || 1})`;
        }
      }

      updateBox();
    };

    // Select target element
    const selectTarget = (type) => {
      targetType = type;
      if (type === 'text') currentTargetEl = textCandidate;
      else if (type === 'bg') currentTargetEl = bgCandidate;
      else currentTargetEl = fgCandidate;

      const labelEl = box.querySelector('#stage-tf-label');
      if (labelEl) {
        labelEl.textContent = type === 'text' ? (tplId === 'quote' ? 'QUOTE TEXT' : 'HEADLINE TEXT') : (type === 'bg' ? 'BACKGROUND SCENE' : (tplId === 'subscribe' ? 'SUBSCRIBE CTA' : (tplId === 'receipt' ? ((typeof window.tplGetContextualData === 'function' && window.tplGetContextualData('receipt')?.isOverlay === false) ? 'RECEIPT OBJECT' : 'RECEIPT OVERLAY') : (tplId === 'quote' ? 'QUOTE CARD' : 'FOREGROUND SUBJECT'))));
        labelEl.style.background = type === 'text' ? '#a855f7' : (type === 'bg' ? '#d97706' : '#0284c7');
      }

      renderToolbar();
      updateBox();
    };

    // Update bounding box position (tightly fitted to actual visual item/icon, never full-player box)
    const updateBox = () => {
      if (!currentTargetEl || !box || !document.body.contains(currentTargetEl)) {
        if (box) box.style.display = 'none';
        return;
      }
      const parentRect = stageInner.getBoundingClientRect();
      if (parentRect.width < 10 || parentRect.height < 10) {
        box.style.display = 'none';
        return;
      }
      let elRect = currentTargetEl.getBoundingClientRect();
      let left = elRect.left - parentRect.left;
      let top = elRect.top - parentRect.top;
      let width = elRect.width;
      let height = elRect.height;

      if (targetType === 'bg') {
        // Suppress full-player outer selection box for background layer
        box.style.display = 'none';
        return;
      } else if (targetType === 'fg') {
        // 1. If the element is a full-stage wrapper (or >82% of stage), check for tighter inner visual item
        const isNearlyFullStage = (width > parentRect.width * 0.82 && height > parentRect.height * 0.82);
        if (isNearlyFullStage) {
          const innerVisual = currentTargetEl.querySelector(
            '.b-sheet-asset, .r-paper, .sub-btn, .quote-card, .p-card, .cert, .tweet-card, .google-frame, .imessage-phone, .notif-stack, .ig-post, .red-circle, .big-num, .bb-icon, .cs-gauge, #customizer-live-fg, .ceo-cutout-img'
          );
          if (innerVisual) {
            const ir = innerVisual.getBoundingClientRect();
            if (ir.width > 16 && ir.height > 16 && (ir.width < width * 0.94 || ir.height < height * 0.94)) {
              left = ir.left - parentRect.left;
              top = ir.top - parentRect.top;
              width = ir.width;
              height = ir.height;
            }
          }
        }

        // 2. If element or its image uses a cutout asset with transparent horizontal margins, tighten box to visible subject
        const imgEl = currentTargetEl.tagName === 'IMG' ? currentTargetEl : currentTargetEl.querySelector('img');
        const bgStr = (currentTargetEl.style && currentTargetEl.style.background) || '';
        const srcStr = ((imgEl && (imgEl.currentSrc || imgEl.src)) || bgStr || '');
        if (currentTargetEl.classList.contains('ceo-cutout-wrap') || srcStr.includes('ceo_portrait_alpha_cutout')) {
          const newW = width * 0.48;
          const newH = height * 0.92;
          left += (width - newW) * 0.5;
          top += height * 0.06;
          width = newW;
          height = newH;
        } else if (currentTargetEl.classList.contains('product') && tplId === 'zoom') {
          const newW = width * 0.58;
          const newH = height * 0.68;
          left += (width - newW) * 0.5;
          top += (height - newH) * 0.5;
          width = newW;
          height = newH;
        } else if ((srcStr.includes('hiker_cutout') || srcStr.includes('clean_traveler_cutout')) && !currentTargetEl.classList.contains('figure') && !currentTargetEl.classList.contains('subject')) {
          const newW = width * 0.24;
          const newH = height * 0.64;
          left += (width - newW) * 0.5;
          top += height * 0.22;
          width = newW;
          height = newH;
        }
      }

      // If after tightening, the box still covers the entire player viewport (>92% width & height), hide it so no full-player box appears
      if (width >= parentRect.width * 0.92 && height >= parentRect.height * 0.92) {
        box.style.display = 'none';
        return;
      }

      // Clamp box inside stage boundaries so handles remain reachable on screen
      const maxLeft = Math.max(0, parentRect.width - 20);
      const maxTop = Math.max(0, parentRect.height - 20);
      left = Math.max(3, Math.min(maxLeft, left));
      top = Math.max(3, Math.min(maxTop, top));
      width = Math.min(width, parentRect.width - left - 3);
      height = Math.min(height, parentRect.height - top - 3);

      box.style.display = 'block';
      box.style.left = `${left.toFixed(1)}px`;
      box.style.top = `${top.toFixed(1)}px`;
      box.style.width = `${width.toFixed(1)}px`;
      box.style.height = `${height.toFixed(1)}px`;
    };
    window.tplUpdateTransformBox = updateBox;

    // Continuous 60fps synchronization loop so CSS @keyframes and JS animations never leave the selection box behind
    if (window._univStageBoxSyncRaf) {
      cancelAnimationFrame(window._univStageBoxSyncRaf);
      window._univStageBoxSyncRaf = null;
    }
    const syncBoxLoop = () => {
      if (!document.body.contains(stageInner)) {
        window._univStageBoxSyncRaf = null;
        return;
      }
      if (currentTargetEl && targetType !== 'bg') {
        updateBox();
      }
      window._univStageBoxSyncRaf = requestAnimationFrame(syncBoxLoop);
    };
    window._univStageBoxSyncRaf = requestAnimationFrame(syncBoxLoop);

    // Default select foreground if available, else text
    if (fgCandidate) selectTarget('fg');
    else if (textCandidate) selectTarget('text');
    else if (bgCandidate) selectTarget('bg');

    // Attach click & drag to elements on stage
    const setupDraggable = (el, type) => {
      if (!el || (tplId === 'polaroid' && type === 'fg')) return;
      el.style.cursor = 'grab';
      el.addEventListener('pointerdown', (e) => {
        // If clicking inside toolbar or controls, ignore
        if (e.target.closest('#stage-floating-direct-toolbar') || e.target.closest('button') || e.target.closest('input')) return;
        selectTarget(type);
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const tf = topCustomizerState.transforms[type] || { x: 0, y: 0, scale: 1 };
        initialOffsetX = tf.x || 0;
        initialOffsetY = tf.y || 0;
        el.style.cursor = 'grabbing';
        e.stopPropagation();
      });
    };

    setupDraggable(fgCandidate, 'fg');
    setupDraggable(textCandidate, 'text');
    setupDraggable(bgCandidate, 'bg');

    // Window move & up events
    window.onpointermove = (e) => {
      if (isDragging && currentTargetEl) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        const tf = topCustomizerState.transforms[targetType];
        if (tf) {
          tf.x = initialOffsetX + dx;
          tf.y = initialOffsetY + dy;
          tf.isFullscreen = false;
          applyTransforms();
          if (targetType === 'fg') {
            if (tplId === 'subscribe' && typeof window.tplSyncSubscribeInspectorUI === 'function') {
              window.tplSetContextualData('subscribe', { posX: tf.x, posY: tf.y, positionPreset: 'custom' });
              window.tplSyncSubscribeInspectorUI();
            } else if (tplId === 'receipt' && typeof window.tplSyncReceiptInspectorUI === 'function') {
              window.tplSetContextualData('receipt', { posX: tf.x, posY: tf.y, positionPreset: 'custom' });
              window.tplSyncReceiptInspectorUI();
            }
          }
        }
      } else if (isResizing && currentTargetEl) {
        const dx = e.clientX - dragStartX;
        const factor = (activeHandle === 'br' || activeHandle === 'tr') ? (dx / 150) : (-dx / 150);
        const tf = topCustomizerState.transforms[targetType];
        if (tf) {
          tf.scale = Math.max(0.2, Math.min(4.0, initialScale + factor));
          tf.isFullscreen = false;
          applyTransforms();
          renderToolbar();
          if (targetType === 'fg') {
            if (tplId === 'subscribe' && typeof window.tplSyncSubscribeInspectorUI === 'function') {
              window.tplSetContextualData('subscribe', { scale: Number(tf.scale.toFixed(2)) });
              window.tplSyncSubscribeInspectorUI();
            } else if (tplId === 'receipt' && typeof window.tplSyncReceiptInspectorUI === 'function') {
              window.tplSetContextualData('receipt', { scale: Number(tf.scale.toFixed(2)) });
              window.tplSyncReceiptInspectorUI();
            }
          }
        }
      }
    };

    window.onpointerup = () => {
      if (isDragging) {
        isDragging = false;
        if (currentTargetEl) currentTargetEl.style.cursor = 'grab';
      }
      if (isResizing) {
        isResizing = false;
        activeHandle = null;
      }
    };

    // Initial render
    applyTransforms();
    renderToolbar();
  };


  // Helper to programmatically apply preset positioning for subscribe CTA
  window.tplApplySubscribePreset = function(presetId) {
    if (typeof topCustomizerState === 'undefined') window.topCustomizerState = {};
    if (!topCustomizerState.transforms) topCustomizerState.transforms = { fg: { x: 0, y: 0, scale: 1 } };
    let x = 0, y = 0;
    if (presetId === 'tl') { x = -210; y = -120; }
    else if (presetId === 'tr') { x = 210; y = -120; }
    else if (presetId === 'bl') { x = -210; y = 115; }
    else if (presetId === 'br') { x = 210; y = 115; }
    else { x = 0; y = 0; } // center default

    topCustomizerState.transforms.fg.x = x;
    topCustomizerState.transforms.fg.y = y;
    topCustomizerState.transforms.fg.isFullscreen = false;

    if (typeof window.tplSetContextualData === 'function') {
      window.tplSetContextualData('subscribe', { posX: x, posY: y, positionPreset: presetId });
    }
    const stage = document.getElementById('tpl-modal-preview-stage');
    const wrap = stage ? stage.querySelector('.tpl-subscribe .sub-wrap') : null;
    if (wrap) {
      const curScale = topCustomizerState.transforms.fg.scale || 1.0;
      wrap.style.transform = `translate(${x}px, ${y}px) scale(${curScale})`;
    }
    if (typeof window.tplUpdateTransformBox === 'function') {
      window.tplUpdateTransformBox();
    }
    if (typeof window.tplSyncSubscribeInspectorUI === 'function') {
      window.tplSyncSubscribeInspectorUI();
    }
  };

  // Helper to programmatically apply preset positioning for receipt overlay
  window.tplApplyReceiptPreset = function(presetId) {
    if (typeof topCustomizerState === 'undefined') window.topCustomizerState = {};
    if (!topCustomizerState.transforms) topCustomizerState.transforms = { fg: { x: 0, y: 0, scale: 1 } };
    let x = 0, y = 0;
    if (presetId === 'tl') { x = -200; y = -100; }
    else if (presetId === 'tr') { x = 200; y = -100; }
    else if (presetId === 'bl') { x = -200; y = 90; }
    else if (presetId === 'br') { x = 200; y = 90; }
    else { x = 0; y = 0; } // center default

    topCustomizerState.transforms.fg.x = x;
    topCustomizerState.transforms.fg.y = y;
    topCustomizerState.transforms.fg.isFullscreen = false;

    if (typeof window.tplSetContextualData === 'function') {
      window.tplSetContextualData('receipt', { posX: x, posY: y, positionPreset: presetId });
    }
    const stage = document.getElementById('tpl-modal-preview-stage');
    const wrap = stage ? stage.querySelector('.tpl-receipt .r-wrap, .tpl-receipt .r-paper') : null;
    if (wrap) {
      const curScale = topCustomizerState.transforms.fg.scale || 1.0;
      const curRot = (typeof window.tplGetContextualData === 'function' && window.tplGetContextualData('receipt')?.rotation) || 0;
      wrap.style.transform = `translate(${x}px, ${y}px) scale(${curScale}) rotate(${curRot}deg)`;
    }
    if (typeof window.tplUpdateTransformBox === 'function') {
      window.tplUpdateTransformBox();
    }
    if (typeof window.tplSyncReceiptInspectorUI === 'function') {
      window.tplSyncReceiptInspectorUI();
    }
  };

})();
