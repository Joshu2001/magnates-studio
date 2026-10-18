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
    if (isMapInteractive3D) {
      box.style.display = 'none';
      toolbar.style.display = 'none';
      return;
    }
    toolbar.style.display = 'flex';
    const fgCandidate = stage.querySelector('.subject, .figure, .doc, .tweet-card, .google-frame, .imessage-phone, .r-paper, .notif-stack, .ig-post, .cert, .p-card, .globe-viewport, #customizer-live-fg-wrap, #customizer-live-fg, .home-tpl-fx-container > div');
    const textCandidate = stage.querySelector('.bigtext, .doc-header, .w-title, .quote-text, .headline, .caption-wrap');
    const bgCandidate = stage.querySelector('.tpl-textbehind, .tpl-docheight, .tpl-parallax, #customizer-live-bg, .layer-mid, .mtn-back');

    // Function to update toolbar contents based on active targetType
    const renderToolbar = () => {
      if (!toolbar) return;
      const tf = topCustomizerState.transforms[targetType] || { x: 0, y: 0, scale: 1, isFullscreen: false };

      if (targetType === 'text') {
        const textData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(tplId) : {};
        const fonts = [
          { label: 'Space Grotesk', val: "'Space Grotesk', sans-serif" },
          { label: 'Impact', val: 'Impact, sans-serif' },
          { label: 'Montserrat', val: "'Montserrat', sans-serif" },
          { label: 'Bebas Neue', val: "'Bebas Neue', sans-serif" },
          { label: 'Arial Black', val: "'Arial Black', sans-serif" },
          { label: 'Inter', val: "'Inter', sans-serif" },
          { label: 'Georgia', val: "'Georgia', serif" }
        ];
        toolbar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px; border-right: 1px solid rgba(255,255,255,0.15); padding-right: 6px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #38bdf8; font-family: monospace;">TEXT</span>
          </div>
          <!-- Font Dropdown -->
          <select id="stage-tb-font" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 4px; outline: none; cursor: pointer;">
            ${fonts.map(f => `<option value="${f.val}" ${f.val === textData.fontFamily ? 'selected' : ''}>${f.label}</option>`).join('')}
          </select>
          <!-- Size Steppers -->
          <div style="display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 1px 4px;">
            <button type="button" id="stage-tb-size-dec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">-</button>
            <span id="stage-tb-size-val" style="font-size: 10px; font-family: monospace; color: #38bdf8; font-weight: 700; min-width: 32px; text-align: center;">${textData.fontSize || 80}px</span>
            <button type="button" id="stage-tb-size-inc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">+</button>
          </div>
          <!-- Color Picker -->
          <input type="color" id="stage-tb-color" value="${textData.textColor || '#ffffff'}" style="width: 20px; height: 18px; border: none; background: transparent; cursor: pointer;" title="Text Color" />
          <!-- Layer Depth Switch -->
          <button type="button" id="stage-tb-depth" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); border-radius: 4px; color: #fff; font-size: 9.5px; font-weight: 700; padding: 2px 6px; cursor: pointer;" title="Bring to Front or Send Behind">
            ${textData.layerOrder === 'front' ? '🔲 Send Behind' : '🔲 Bring Front'}
          </button>
          <!-- Switch to Layer -->
          <button type="button" id="stage-tb-switch-fg" style="background: none; border: none; color: #94a3b8; font-size: 9.5px; cursor: pointer; text-decoration: underline;">Subject</button>
        `;
        // Wire text toolbar
        toolbar.querySelector('#stage-tb-font')?.addEventListener('change', (e) => {
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { fontFamily: e.target.value });
          if (typeof window.tplRenderContextualInspector === 'function') window.tplRenderContextualInspector(tplId);
        });
        toolbar.querySelector('#stage-tb-size-dec')?.addEventListener('click', () => {
          const sz = Math.max(24, (textData.fontSize || 80) - 6);
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { fontSize: sz });
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-size-inc')?.addEventListener('click', () => {
          const sz = Math.min(180, (textData.fontSize || 80) + 6);
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { fontSize: sz });
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-color')?.addEventListener('input', (e) => {
          if (typeof window.tplSetContextualData === 'function') window.tplSetContextualData(tplId, { textColor: e.target.value });
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
        toolbar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px; border-right: 1px solid rgba(255,255,255,0.15); padding-right: 6px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #2effc6; font-family: monospace;">FOREGROUND LAYER</span>
          </div>
          <!-- Fullscreen / Fit Toggle -->
          <button type="button" id="stage-tb-fullscreen" style="background: ${tf.isFullscreen ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.08)'}; border: 1px solid ${tf.isFullscreen ? '#38bdf8' : 'rgba(255,255,255,0.2)'}; border-radius: 4px; color: #fff; font-size: 9.5px; font-weight: 700; padding: 2px 7px; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="Toggle Full Screen Stage Coverage">
            <span>⛶</span> ${tf.isFullscreen ? 'Fit Mode' : 'Fullscreen'}
          </button>
          <!-- Scale Zoom Steppers -->
          <div style="display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 1px 4px;">
            <button type="button" id="stage-tb-scale-dec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">-</button>
            <span id="stage-tb-scale-val" style="font-size: 10px; font-family: monospace; color: #2effc6; font-weight: 700; min-width: 32px; text-align: center;">${Math.round((tf.scale || 1) * 100)}%</span>
            <button type="button" id="stage-tb-scale-inc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">+</button>
          </div>
          <!-- Reset Transform -->
          <button type="button" id="stage-tb-reset" style="background: none; border: none; color: #94a3b8; font-size: 9.5px; cursor: pointer;" title="Reset Position & Scale">
            ↺ Reset
          </button>
          <!-- Switch to Background -->
          <button type="button" id="stage-tb-switch-bg" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; color: #cbd5e1; font-size: 9.5px; font-weight: 600; padding: 2px 6px; cursor: pointer;" title="Select and adjust Background Scene">
            Backdrop ▾
          </button>
          ${textCandidate ? `<button type="button" id="stage-tb-switch-txt" style="background: none; border: none; color: #38bdf8; font-size: 9.5px; cursor: pointer; text-decoration: underline;">Edit Text</button>` : ''}
        `;
        // Wire fg toolbar
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
        toolbar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px; border-right: 1px solid rgba(255,255,255,0.15); padding-right: 6px;">
            <span style="font-size: 9.5px; font-weight: 800; color: #f59e0b; font-family: monospace;">BACKGROUND SCENE</span>
          </div>
          <!-- Scale Zoom Steppers -->
          <div style="display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 1px 4px;">
            <button type="button" id="stage-tb-bg-dec" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">-</button>
            <span id="stage-tb-bg-val" style="font-size: 10px; font-family: monospace; color: #f59e0b; font-weight: 700; min-width: 32px; text-align: center;">${Math.round((tf.scale || 1) * 100)}%</span>
            <button type="button" id="stage-tb-bg-inc" style="background: none; border: none; color: #cbd5e1; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0 3px;">+</button>
          </div>
          <!-- Reset BG -->
          <button type="button" id="stage-tb-bg-reset" style="background: none; border: none; color: #94a3b8; font-size: 9.5px; cursor: pointer;" title="Reset Background Pan & Scale">
            ↺ Reset
          </button>
          <!-- Switch back to Foreground -->
          <button type="button" id="stage-tb-switch-fg2" style="background: rgba(46,255,198,0.15); border: 1px solid rgba(46,255,198,0.4); border-radius: 4px; color: #2effc6; font-size: 9.5px; font-weight: 700; padding: 2px 7px; cursor: pointer;" title="Switch back to Subject">
            Subject ▴
          </button>
        `;
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
        toolbar.querySelector('#stage-tb-bg-reset')?.addEventListener('click', () => {
          tf.x = 0;
          tf.y = 0;
          tf.scale = 1;
          applyTransforms();
          renderToolbar();
        });
        toolbar.querySelector('#stage-tb-switch-fg2')?.addEventListener('click', () => {
          selectTarget('fg');
        });
      }
    };

    // Apply active CSS transform rules to stage elements
    const applyTransforms = () => {
      const fgTf = topCustomizerState.transforms.fg;
      if (fgCandidate && fgTf) {
        if (fgTf.isFullscreen) {
          const sRect = stage.getBoundingClientRect();
          const naturalW = fgCandidate.offsetWidth || 380;
          const naturalH = fgCandidate.offsetHeight || 220;
          const fitScale = Math.min(
            (sRect.width * 0.88) / Math.max(naturalW, 1),
            (sRect.height * 0.88) / Math.max(naturalH, 1)
          );
          const safeScale = Math.max(1, Math.min(fitScale, 2.4));
          fgCandidate.style.transformOrigin = 'center center';
          fgCandidate.style.transform = `translate(0px, 0px) scale(${safeScale.toFixed(3)})`;
        } else {
          fgCandidate.style.transformOrigin = 'center center';
          fgCandidate.style.transform = `translate(${fgTf.x}px, ${fgTf.y}px) scale(${fgTf.scale || 1})`;
        }
      }

      const textTf = topCustomizerState.transforms.text;
      if (textCandidate && textTf) {
        const isCenteredAbs = getComputedStyle(textCandidate).position === 'absolute' && textCandidate.classList.contains('bigtext');
        if (isCenteredAbs) {
          textCandidate.style.transform = `translate(calc(-50% + ${textTf.x}px), calc(-50% + ${textTf.y}px)) scale(${textTf.scale || 1})`;
        } else {
          textCandidate.style.transform = `translate(${textTf.x}px, ${textTf.y}px) scale(${textTf.scale || 1})`;
        }
      }

      const bgTf = topCustomizerState.transforms.bg;
      if (bgCandidate && bgTf) {
        bgCandidate.style.transform = `translate(${bgTf.x}px, ${bgTf.y}px) scale(${bgTf.scale || 1})`;
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
        labelEl.textContent = type === 'text' ? 'HEADLINE TEXT' : (type === 'bg' ? 'BACKGROUND SCENE' : 'FOREGROUND SUBJECT');
        labelEl.style.background = type === 'text' ? '#a855f7' : (type === 'bg' ? '#d97706' : '#0284c7');
      }

      renderToolbar();
      updateBox();
    };

    // Update bounding box position
    const updateBox = () => {
      if (!currentTargetEl || !box) {
        if (box) box.style.display = 'none';
        return;
      }
      const elRect = currentTargetEl.getBoundingClientRect();
      const parentRect = stageInner.getBoundingClientRect();

      box.style.display = 'block';
      box.style.left = `${elRect.left - parentRect.left}px`;
      box.style.top = `${elRect.top - parentRect.top}px`;
      box.style.width = `${elRect.width}px`;
      box.style.height = `${elRect.height}px`;
    };

    // Default select foreground if available, else text
    if (fgCandidate) selectTarget('fg');
    else if (textCandidate) selectTarget('text');
    else if (bgCandidate) selectTarget('bg');

    // Attach click & drag to elements on stage
    const setupDraggable = (el, type) => {
      if (!el) return;
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

})();
