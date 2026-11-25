/* ============================================================================
   REGAARDER STUDIO — COMMENT-TO-ANIMATE & AUTO-ASSET PINS
   Works inside both embedded Storyboard Mode and normal Preview Stage.
   ============================================================================ */
(function () {
  'use strict';

  const STORE_KEY = 'rg_comment_pins_v1';
  let pinsByScene = {};
  try {
    pinsByScene = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
  } catch (_) {
    pinsByScene = {};
  }

  let pinModeActive = false;
  let activePinId = null;

  function savePins() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(pinsByScene)); } catch (_) {}
  }

  function getSceneKey(meta) {
    return (meta && meta.sceneId) || 'default-scene';
  }

  function getPinsFor(sceneKey) {
    if (!Array.isArray(pinsByScene[sceneKey])) pinsByScene[sceneKey] = [];
    return pinsByScene[sceneKey];
  }

  function ensureStyles() {
    if (document.getElementById('rg-comment-pins-styles')) return;
    const style = document.createElement('style');
    style.id = 'rg-comment-pins-styles';
    style.textContent = `
      .rg-cp-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 45; }
      .rg-cp-overlay.is-placing { pointer-events: auto; cursor: crosshair; }
      .rg-cp-pin {
        position: absolute; transform: translate(-50%, -50%);
        width: 24px; height: 24px; border-radius: 50%;
        border: 2px solid #fff; background: #8b5cf6; color: #fff;
        font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 14px rgba(139, 92, 246, 0.7); cursor: pointer; pointer-events: auto;
      }
      .rg-cp-pin.is-applied { background: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.55); }
      .rg-cp-pin.is-unsaved::after {
        content: ''; position: absolute; top: -3px; right: -3px;
        width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; border: 1.5px solid #0b0c14;
      }
      .rg-cp-popover {
        position: absolute; z-index: 50; width: 256px; padding: 10px;
        border-radius: 11px; background: rgba(15, 16, 25, 0.96); backdrop-filter: blur(12px);
        border: 1px solid rgba(168, 85, 247, 0.45); box-shadow: 0 14px 34px rgba(0, 0, 0, 0.7);
        display: flex; flex-direction: column; gap: 8px; pointer-events: auto;
      }
      .rg-cp-pop-head { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 600; color: #e2e8f0; }
      .rg-cp-status-badge { font-size: 9.5px; padding: 2px 6px; border-radius: 999px; font-weight: 600; }
      .rg-cp-status-badge.unsaved { background: rgba(245, 158, 11, 0.16); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.35); }
      .rg-cp-status-badge.applied { background: rgba(16, 185, 129, 0.16); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.35); }
      .rg-cp-textarea {
        width: 100%; min-height: 54px; resize: vertical; border-radius: 7px;
        background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f8fafc; font-size: 11px; padding: 6px 8px; outline: none; font-family: inherit;
      }
      .rg-cp-textarea:focus { border-color: rgba(168, 85, 247, 0.65); }
      .rg-cp-pop-actions { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
      .rg-cp-btn-del { background: transparent; border: none; color: #94a3b8; font-size: 11px; cursor: pointer; padding: 4px 6px; }
      .rg-cp-btn-del:hover { color: #f87171; }
      .rg-cp-btn-run {
        background: linear-gradient(180deg, #9353F5 0%, #7C3AED 100%); border: none;
        color: #fff; font-size: 11px; font-weight: 600; border-radius: 7px; padding: 5px 10px; cursor: pointer;
      }
      .rg-cp-asset-tag { font-size: 10px; color: #38bdf8; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 185, 248, 0.28); border-radius: 6px; padding: 3px 6px; }
      .rg-cp-generated-layer {
        position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none; z-index: 20;
      }
      @keyframes rgCpDolly { from { transform: scale(1); } to { transform: scale(1.16); } }
      @keyframes rgCpSlideLeft { from { transform: translateX(14px); opacity: 0.2; } to { transform: translateX(0); opacity: 1; } }
      @keyframes rgCpSlideUp { from { transform: translateY(14px); opacity: 0.2; } to { transform: translateY(0); opacity: 1; } }
      @keyframes rgCpPulse { 0%, 100% { transform: scale(0.98); filter: brightness(1); } 50% { transform: scale(1.04); filter: brightness(1.18); } }
    `;
    document.head.appendChild(style);
  }

  function applyAnimationToContainer(containerEl, pin) {
    if (!containerEl || !pin) return;
    if (pin.assetDataUrl) {
      let img = containerEl.querySelector(`.rg-cp-generated-layer[data-pin-id="${pin.id}"]`);
      if (!img) {
        img = document.createElement('img');
        img.className = 'rg-cp-generated-layer';
        img.setAttribute('data-pin-id', pin.id);
        containerEl.appendChild(img);
      }
      img.src = pin.assetDataUrl;
    }
    const animType = pin.animation?.type || 'dolly-zoom';
    const dur = pin.animation?.duration || 4;
    const target = containerEl.querySelector(`.rg-cp-generated-layer[data-pin-id="${pin.id}"]`) || containerEl.firstElementChild;
    if (target) {
      const kfMap = {
        'dolly-zoom': `rgCpDolly ${dur}s ease-out infinite alternate`,
        'slide-left': `rgCpSlideLeft ${dur}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        'slide-up': `rgCpSlideUp ${dur}s ease-out forwards`,
        'pulse-glow': `rgCpPulse ${dur}s ease-in-out infinite`
      };
      target.style.animation = kfMap[animType] || kfMap['dolly-zoom'];
    }
  }

  function renderOverlay(containerEl, meta) {
    if (!containerEl) return;
    ensureStyles();
    const sceneKey = getSceneKey(meta);
    const pins = getPinsFor(sceneKey);

    let overlay = containerEl.querySelector('.rg-cp-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'rg-cp-overlay';
      containerEl.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (!pinModeActive || e.target !== overlay) return;
        const rect = overlay.getBoundingClientRect();
        const xPct = Math.round(((e.clientX - rect.left) / Math.max(1, rect.width)) * 1000) / 10;
        const yPct = Math.round(((e.clientY - rect.top) / Math.max(1, rect.height)) * 1000) / 10;
        const newPin = {
          id: `pin_${Date.now()}`,
          xPct,
          yPct,
          text: '',
          unsaved: true,
          applied: false,
          assetName: '',
          assetDataUrl: '',
          animation: null
        };
        pins.push(newPin);
        activePinId = newPin.id;
        pinModeActive = false;
        savePins();
        renderOverlay(containerEl, meta);
      });
    }

    overlay.classList.toggle('is-placing', pinModeActive);
    overlay.innerHTML = pins.map((pin, idx) => `
      <button type="button" class="rg-cp-pin ${pin.applied ? 'is-applied' : ''} ${pin.unsaved ? 'is-unsaved' : ''}"
        data-pin-id="${pin.id}" style="left:${pin.xPct}%;top:${pin.yPct}%;" title="Pin #${idx + 1}">
        ${pin.applied ? '✓' : idx + 1}
      </button>
    `).join('');

    const activePin = pins.find((p) => p.id === activePinId);
    if (activePin) {
      const pop = document.createElement('div');
      pop.className = 'rg-cp-popover';
      pop.style.left = Math.min(72, Math.max(4, activePin.xPct)) + '%';
      pop.style.top = Math.min(68, Math.max(6, activePin.yPct + 4)) + '%';
      pop.innerHTML = `
        <div class="rg-cp-pop-head">
          <span>Comment Pin</span>
          <span class="rg-cp-status-badge ${activePin.applied ? 'applied' : 'unsaved'}">${activePin.applied ? 'Applied ✓' : 'Unsaved'}</span>
        </div>
        <textarea class="rg-cp-textarea" placeholder="Describe animation or missing asset to create...">${activePin.text || ''}</textarea>
        ${activePin.assetName ? `<div class="rg-cp-asset-tag">🖼 ${activePin.assetName}</div>` : ''}
        <div class="rg-cp-pop-actions">
          <button type="button" class="rg-cp-btn-del">Delete</button>
          <button type="button" class="rg-cp-btn-run">✦ Animate &amp; Create Asset</button>
        </div>
      `;
      overlay.appendChild(pop);

      const ta = pop.querySelector('.rg-cp-textarea');
      ta.addEventListener('input', () => {
        activePin.text = ta.value;
        activePin.unsaved = true;
        savePins();
      });
      pop.querySelector('.rg-cp-btn-del').addEventListener('click', () => {
        const idx = pins.findIndex((p) => p.id === activePin.id);
        if (idx >= 0) pins.splice(idx, 1);
        activePinId = null;
        savePins();
        renderOverlay(containerEl, meta);
      });
      pop.querySelector('.rg-cp-btn-run').addEventListener('click', async () => {
        const comment = ta.value.trim();
        if (!comment) return;
        const btn = pop.querySelector('.rg-cp-btn-run');
        btn.textContent = 'Animating...';
        btn.disabled = true;
        try {
          const res = await fetch('/api/ai/animate-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment, sceneId: sceneKey })
          });
          const data = await res.json();
          if (data && data.ok) {
            activePin.text = comment;
            activePin.unsaved = false;
            activePin.applied = true;
            activePin.animation = data.animation || null;
            if (data.generatedAsset) {
              activePin.assetName = data.generatedAsset.name;
              activePin.assetDataUrl = data.generatedAsset.dataUrl;
            }
            savePins();
            applyAnimationToContainer(containerEl, activePin);
            renderOverlay(containerEl, meta);
          }
        } finally {
          btn.disabled = false;
        }
      });
    }

    overlay.querySelectorAll('.rg-cp-pin').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-pin-id');
        activePinId = (activePinId === id) ? null : id;
        renderOverlay(containerEl, meta);
      });
    });

    pins.filter((p) => p.applied).forEach((p) => applyAnimationToContainer(containerEl, p));
  }

  window.RegaarderCommentPins = {
    mountOn: (containerEl, meta) => renderOverlay(containerEl, meta || {}),
    togglePinMode: (containerEl, meta) => {
      pinModeActive = !pinModeActive;
      if (containerEl) renderOverlay(containerEl, meta || {});
      return pinModeActive;
    },
    getPinCount: (sceneId) => getPinsFor(sceneId || 'default-scene').length
  };
})();
