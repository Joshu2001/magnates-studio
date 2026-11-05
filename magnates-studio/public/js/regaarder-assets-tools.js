/**
 * ============================================================================
 * REGAARDER STUDIO — ASSETS & TOOLS WORKBENCH STUDIO
 * ============================================================================
 * Ported from Regaarder-Motion (asset-workbench.js, asset-catalog.js,
 * asset-manifest.json) into Magnates Studio's unified stage, 4-Tab Contextual
 * Inspector, and design system tokens.
 *
 * Features:
 *   1. Central Project Media & Asset Registry with Review Filters & Search.
 *   2. 3D Image Animator Studio (flat 2D image projected onto 3D perspective plane).
 *   3. Manual Cutout Studio (interactive canvas polygon contouring with live feather & alpha export).
 * ============================================================================
 */
(function () {
  'use strict';

  // 1. STATE & STORAGE
  const DB_NAME = 'regaarder-assets-db';
  const DB_VERSION = 1;

  let manifestAssets = [];
  let userAssets = [];
  const assetOverrides = {};
  const assetMedia = new Map();

  try {
    const raw = localStorage.getItem('motion-user-assets');
    if (raw) userAssets = JSON.parse(raw);
  } catch (e) {}

  // Fetch asset-manifest.json if available
  fetch('asset-manifest.json?v=motion-v70')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data && Array.isArray(data.assets)) {
        manifestAssets = data.assets;
        restoreStoredBlobs();
      }
    })
    .catch(() => {});

  // IndexedDB Helper for Large Blobs
  function openAssetDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveStoredBlob(key, blob) {
    try {
      const db = await openAssetDB();
      const tx = db.transaction('assets', 'readwrite');
      tx.objectStore('assets').put(blob, key);
      return new Promise((res) => {
        tx.oncomplete = () => res(true);
        tx.onerror = () => res(false);
      });
    } catch (e) {
      return false;
    }
  }

  async function restoreStoredBlobs() {
    try {
      const db = await openAssetDB();
      const tx = db.transaction('assets', 'readonly');
      const store = tx.objectStore('assets');
      const all = getAllAssets();
      all.forEach((a) => {
        const req = store.get('studio-' + a.id);
        req.onsuccess = () => {
          if (req.result instanceof Blob) {
            assetOverrides[a.id] = URL.createObjectURL(req.result);
            assetMedia.delete(a.id);
          }
        };
      });
    } catch (e) {}
  }

  function getAllAssets() {
    return [...manifestAssets, ...userAssets];
  }

  function getAssetById(id) {
    return getAllAssets().find((a) => a.id === id);
  }

  function getAssetURL(a) {
    if (!a) return '';
    return assetOverrides[a.id] || a.src || '';
  }

  function getMediaElement(id) {
    if (assetMedia.has(id)) return assetMedia.get(id);
    const a = getAssetById(id);
    if (!a) return null;
    const url = getAssetURL(a);
    if (!url) return null;

    if (a.kind === 'video') {
      const v = document.createElement('video');
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.src = url;
      assetMedia.set(id, v);
      return v;
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      assetMedia.set(id, img);
      return img;
    }
  }

  function isMediaReady(media) {
    if (!media) return false;
    if (media instanceof HTMLVideoElement) return media.readyState >= 2;
    return media.complete && media.naturalWidth > 0;
  }

  // 2. MAIN WORKBENCH MODAL
  let activeTab = 'registry'; // 'registry' | 'animator' | 'cutout'
  let currentSearchQuery = '';
  let currentReviewFilter = 'all';

  function openAssetsToolsStudio(initialTab = 'registry', targetAssetId = null) {
    activeTab = initialTab;
    let modal = document.getElementById('modal-regaarder-assets-tools');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-regaarder-assets-tools';
      modal.className = 'vector-export-modal rg-shell-mounted';
      modal.style.cssText = 'display: none; z-index: 100010; backdrop-filter: blur(14px); background: rgba(5,6,12,0.96); padding: 0; overflow: hidden;';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="vector-modal-box" style="width: 100vw; max-width: 100vw; height: 100vh; max-height: 100vh; display: flex; flex-direction: column; background: var(--rg-bg-canvas); border: none; border-radius: 0; overflow: hidden;">
        <!-- Top Studio Bar -->
        <header class="rg-global-topbar" style="height: 48px; border-bottom: 1px solid var(--rg-border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: #0B0B11; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: none; stroke: #38bdf8; stroke-width: 2;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span style="font-weight: 700; font-size: 13.5px; color: #fff; letter-spacing: -0.01em;">Assets & Tools Workbench</span>
            </div>

            <!-- Segmented Top Tabs -->
            <div style="display: flex; background: rgba(255,255,255,0.04); padding: 3px; border-radius: 8px; border: 1px solid var(--rg-border-subtle); gap: 4px;">
              <button type="button" class="btn-workbench-tab ${activeTab === 'registry' ? 'active' : ''}" data-tab="registry" style="padding: 4px 12px; font-size: 11px; font-weight: 600; border-radius: 6px; border: none; background: ${activeTab === 'registry' ? 'var(--rg-accent)' : 'transparent'}; color: ${activeTab === 'registry' ? '#fff' : 'var(--rg-text-muted)'}; cursor: pointer;">
                Asset Registry
              </button>
              <button type="button" class="btn-workbench-tab ${activeTab === 'animator' ? 'active' : ''}" data-tab="animator" style="padding: 4px 12px; font-size: 11px; font-weight: 600; border-radius: 6px; border: none; background: ${activeTab === 'animator' ? 'var(--rg-accent)' : 'transparent'}; color: ${activeTab === 'animator' ? '#fff' : 'var(--rg-text-muted)'}; cursor: pointer;">
                3D Image Animator
              </button>
              <button type="button" class="btn-workbench-tab ${activeTab === 'cutout' ? 'active' : ''}" data-tab="cutout" style="padding: 4px 12px; font-size: 11px; font-weight: 600; border-radius: 6px; border: none; background: ${activeTab === 'cutout' ? 'var(--rg-accent)' : 'transparent'}; color: ${activeTab === 'cutout' ? '#fff' : 'var(--rg-text-muted)'}; cursor: pointer;">
                Manual Cutout Studio
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn btn-primary" id="btn-workbench-upload" style="font-size: 11.5px; padding: 5px 12px;">+ Upload Media</button>
            <input type="file" id="file-workbench-upload" accept="image/*,video/mp4,video/webm" style="display: none;">
            <button type="button" class="btn btn-secondary" id="btn-export-recipe-json" style="font-size: 11.5px; padding: 5px 12px;">Export Recipe JSON</button>
            <button type="button" class="btn-sidebar-collapse" id="btn-close-assets-studio" title="Done" style="background: rgba(255,255,255,0.06); border: 1px solid var(--rg-border-subtle); border-radius: 6px; padding: 5px 12px; color: #fff; font-size: 12px; cursor: pointer;">
              Done ✕
            </button>
          </div>
        </header>

        <!-- Main Body Content Area -->
        <div id="workbench-tab-content" style="flex: 1; display: flex; min-height: 0; overflow: hidden; background: var(--rg-bg-canvas);"></div>
      </div>
    `;

    // Bind Tab Switching
    modal.querySelectorAll('.btn-workbench-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        activeTab = tab.getAttribute('data-tab');
        modal.querySelectorAll('.btn-workbench-tab').forEach((t) => {
          const isAct = t.getAttribute('data-tab') === activeTab;
          t.classList.toggle('active', isAct);
          t.style.background = isAct ? 'var(--rg-accent)' : 'transparent';
          t.style.color = isAct ? '#fff' : 'var(--rg-text-muted)';
        });
        renderWorkbenchTabContent(targetAssetId);
      });
    });

    // Upload Media Button
    const uploadBtn = document.getElementById('btn-workbench-upload');
    const uploadInput = document.getElementById('file-workbench-upload');
    if (uploadBtn && uploadInput) {
      uploadBtn.addEventListener('click', () => {
        uploadInput.value = '';
        uploadInput.click();
      });
      uploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await handleMediaUpload(file);
        renderWorkbenchTabContent();
      });
    }

    // Export Recipe JSON
    const exportBtn = document.getElementById('btn-export-recipe-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const recipe = {
          schemaVersion: 1,
          style: 'regaarder-studio',
          assets: getAllAssets(),
          exportedAt: new Date().toISOString()
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recipe, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', 'studio-recipe.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    }

    // Close Button
    const closeBtn = document.getElementById('btn-close-assets-studio');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        stopWorkbenchTimers();
      });
    }

    modal.style.display = 'flex';
    renderWorkbenchTabContent(targetAssetId);
  }

  async function handleMediaUpload(file) {
    const id = 'user-' + Date.now().toString(36);
    const kind = file.type.startsWith('video/') ? 'video' : 'image';
    const newAsset = {
      id,
      label: file.name.replace(/\.[^/.]+$/, ''),
      src: '',
      kind,
      alpha: false,
      method: 'uploaded user media',
      active: true,
      reviewStatus: 'accepted'
    };

    await saveStoredBlob('studio-' + id, file);
    assetOverrides[id] = URL.createObjectURL(file);
    userAssets.push(newAsset);
    try {
      localStorage.setItem('motion-user-assets', JSON.stringify(userAssets));
    } catch (e) {}
    return id;
  }

  function stopWorkbenchTimers() {
    animatorPlaying = false;
  }

  // 3. TAB 1: ASSET REGISTRY VIEW
  function renderAssetRegistryView(host) {
    const all = getAllAssets();
    const filtered = all.filter((a) => {
      const q = currentSearchQuery.toLowerCase();
      const matchesQ = !q || (a.label + ' ' + (a.src || '') + ' ' + (a.method || '')).toLowerCase().includes(q);
      const matchesFilter = currentReviewFilter === 'all' || a.reviewStatus === currentReviewFilter;
      return matchesQ && matchesFilter;
    });

    host.innerHTML = `
      <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 20px 24px;">
        <!-- Filter and Search Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-shrink: 0;">
          <div style="position: relative; width: 340px;">
            <svg viewBox="0 0 24 24" style="position: absolute; left: 10px; top: 9px; width: 14px; height: 14px; fill: none; stroke: var(--rg-text-muted); stroke-width: 2;">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" id="asset-search-input" value="${escapeHtml(currentSearchQuery)}" placeholder="Search asset names, tags, methods..." style="width: 100%; background: var(--rg-bg-panel); border: 1px solid var(--rg-border-subtle); border-radius: 8px; padding: 7px 12px 7px 32px; font-size: 12px; color: #fff;">
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 11px; color: var(--rg-text-muted);">Status:</label>
            <select id="asset-review-filter" class="rg-select" style="font-size: 11.5px; padding: 5px 10px;">
              <option value="all" ${currentReviewFilter === 'all' ? 'selected' : ''}>All Assets (${all.length})</option>
              <option value="accepted" ${currentReviewFilter === 'accepted' ? 'selected' : ''}>Accepted</option>
              <option value="alternate" ${currentReviewFilter === 'alternate' ? 'selected' : ''}>Alternates</option>
              <option value="rejected" ${currentReviewFilter === 'rejected' ? 'selected' : ''}>Rejected / Archive</option>
            </select>
          </div>
        </div>

        <!-- Asset Grid -->
        <div style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${filtered.map((a) => {
            const url = getAssetURL(a);
            const isCutout = a.alpha || (a.method && a.method.includes('alpha'));
            return `
              <div class="asset-card-item" style="background: var(--rg-bg-panel); border: 1px solid var(--rg-border-subtle); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; transition: border-color 0.2s;">
                <div style="height: 140px; background: repeating-conic-gradient(#171722 0% 25%, #101018 0% 50%) 0/16px 16px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                  ${url ? `<img src="${escapeHtml(url)}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="${escapeHtml(a.label)}" loading="lazy">` : `<span style="font-size: 12px; color: var(--rg-text-muted);">${escapeHtml(a.kind)}</span>`}
                  ${isCutout ? `<span class="rg-badge" style="position: absolute; top: 8px; right: 8px; background: rgba(168, 85, 247, 0.2); border: 1px solid rgba(168, 85, 247, 0.4); color: #c084fc; font-size: 9.5px;">Alpha Cutout</span>` : ''}
                </div>
                <div style="padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="font-weight: 600; font-size: 12.5px; color: #f5f5f7; margin-bottom: 2px;">${escapeHtml(a.label)}</div>
                    <div style="font-size: 10.5px; color: var(--rg-text-muted); margin-bottom: 6px;">${escapeHtml(a.method || a.kind)}</div>
                  </div>
                  <div style="display: flex; gap: 6px; margin-top: 10px; border-top: 1px solid var(--rg-border-subtle); padding-top: 10px;">
                    <button type="button" class="btn btn-secondary btn-animate-asset" data-id="${a.id}" style="flex: 1; font-size: 11px; padding: 4px 6px;">
                      Animate 3D
                    </button>
                    ${a.kind !== 'video' ? `
                      <button type="button" class="btn btn-secondary btn-cutout-asset" data-id="${a.id}" style="flex: 1; font-size: 11px; padding: 4px 6px;">
                        Cutout Mask
                      </button>
                    ` : ''}
                    ${url ? `<a href="${escapeHtml(url)}" download="${escapeHtml(a.label)}" class="btn btn-secondary" style="font-size: 11px; padding: 4px 8px;" title="Download Source">↓</a>` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('asset-search-input')?.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderAssetRegistryView(host);
    });

    document.getElementById('asset-review-filter')?.addEventListener('change', (e) => {
      currentReviewFilter = e.target.value;
      renderAssetRegistryView(host);
    });

    host.querySelectorAll('.btn-animate-asset').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        openAssetsToolsStudio('animator', id);
      });
    });

    host.querySelectorAll('.btn-cutout-asset').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        openAssetsToolsStudio('cutout', id);
      });
    });
  }

  // 4. TAB 2: 3D IMAGE ANIMATOR STUDIO
  let animatorAssetId = null;
  let animatorTime = 0;
  let animatorPlaying = false;
  let animatorLast = 0;
  let animatorPickMode = null; // 'start' | 'end' | 'trace'
  let animatorTracedPoints = [];

  const DEFAULT_IMAGE_MOTION = {
    cityDuration: 8,
    cityFlyTime: 8,
    cityStartDistance: 24,
    cityEndDistance: 16,
    cityStartElevation: 45,
    cityEndElevation: 80,
    cityRoll: -8,
    cityEndRoll: 0,
    cityHeading: 0,
    cityTurns: 0.15,
    cityEdgeBlur: 4,
    cityStartU: 0.5,
    cityStartV: 0.5,
    cityEndU: 0.5,
    cityEndV: 0.5,
    cityRegions: []
  };

  let imageMotion = { ...DEFAULT_IMAGE_MOTION };

  function renderImageAnimatorView(host, initialAssetId) {
    if (initialAssetId) animatorAssetId = initialAssetId;
    if (!animatorAssetId) {
      const first = getAllAssets().find((a) => a.kind === 'image');
      if (first) animatorAssetId = first.id;
    }

    host.innerHTML = `
      <div style="flex: 1; display: flex; min-height: 0; overflow: hidden;">
        <!-- Left Stage & Scrubber -->
        <div style="flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--rg-bg-canvas); position: relative;">
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative;">
            <div style="width: 100%; max-width: 960px; aspect-ratio: 16/9; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.9); border-radius: 8px; overflow: hidden; border: 1px solid var(--rg-border-strong);">
              <canvas id="animator-canvas" width="960" height="540" style="width: 100%; height: 100%; display: block; background: #08131c; cursor: crosshair;"></canvas>
            </div>
          </div>

          <div style="height: 52px; background: var(--rg-bg-panel); border-top: 1px solid var(--rg-border-subtle); display: flex; align-items: center; gap: 14px; padding: 0 20px; flex-shrink: 0;">
            <button type="button" id="btn-animator-play" class="icon-btn" style="width: 32px; height: 32px; background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 6px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <input type="range" id="animator-timeline-scrub" min="0" max="${imageMotion.cityDuration}" step="0.02" value="${animatorTime}" style="flex: 1; accent-color: #38bdf8; cursor: pointer;">
            <span id="animator-clock" style="font-size: 11px; font-family: monospace; color: var(--rg-text-secondary); min-width: 80px; text-align: right;">
              ${animatorTime.toFixed(1)}s / ${imageMotion.cityDuration}s
            </span>
          </div>
        </div>

        <!-- Right Controls Drawer (340px) -->
        <aside style="width: 340px; background: var(--rg-bg-panel); border-left: 1px solid var(--rg-border-subtle); display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;">
          <div style="padding: 14px; border-bottom: 1px solid var(--rg-border-subtle); display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 700; font-size: 12px; color: #fff;">3D Plane & Camera Rig</span>
            <select id="animator-asset-picker" class="rg-select" style="font-size: 11px; padding: 3px 6px; max-width: 150px;">
              ${getAllAssets().filter((a) => a.kind === 'image').map((a) => `<option value="${a.id}" ${a.id === animatorAssetId ? 'selected' : ''}>${escapeHtml(a.label)}</option>`).join('')}
            </select>
          </div>

          <div style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
            <div class="rg-control-row">
              <label class="rg-control-label">Duration (s)</label>
              <input type="number" class="rg-input-text" id="ctl-anim-dur" step="0.5" min="1" max="60" value="${imageMotion.cityDuration}">
            </div>
            <div class="rg-control-row">
              <label class="rg-control-label">Camera Move Time</label>
              <input type="number" class="rg-input-text" id="ctl-anim-fly" step="0.5" min="1" max="60" value="${imageMotion.cityFlyTime}">
            </div>
            <div class="rg-control-row">
              <label class="rg-control-label">Camera Tilt (°)</label>
              <div style="display: flex; gap: 6px;">
                <input type="number" class="rg-input-text" id="ctl-anim-start-tilt" value="${imageMotion.cityStartElevation}" title="Start Tilt" style="flex: 1;">
                <input type="number" class="rg-input-text" id="ctl-anim-end-tilt" value="${imageMotion.cityEndElevation}" title="End Tilt" style="flex: 1;">
              </div>
            </div>
            <div class="rg-control-row">
              <label class="rg-control-label">Camera Roll (°)</label>
              <div style="display: flex; gap: 6px;">
                <input type="number" class="rg-input-text" id="ctl-anim-start-roll" value="${imageMotion.cityRoll}" title="Start Roll" style="flex: 1;">
                <input type="number" class="rg-input-text" id="ctl-anim-end-roll" value="${imageMotion.cityEndRoll}" title="End Roll" style="flex: 1;">
              </div>
            </div>
            <div class="rg-control-row">
              <label class="rg-control-label">Heading & Turns</label>
              <div style="display: flex; gap: 6px;">
                <input type="number" class="rg-input-text" id="ctl-anim-heading" value="${imageMotion.cityHeading}" title="Heading °" style="flex: 1;">
                <input type="number" class="rg-input-text" id="ctl-anim-turns" step="0.05" value="${imageMotion.cityTurns}" title="Turns" style="flex: 1;">
              </div>
            </div>
            <div class="rg-control-row">
              <label class="rg-control-label">Soft Edge Blur</label>
              <input type="range" class="rg-slider" id="ctl-anim-blur" min="0" max="25" value="${imageMotion.cityEdgeBlur}">
            </div>

            <!-- Focus Picking Buttons -->
            <div style="display: flex; gap: 8px; margin-top: 6px;">
              <button type="button" class="btn btn-secondary" id="btn-pick-start-focus" style="flex: 1; font-size: 11px;">Pick Start Focus</button>
              <button type="button" class="btn btn-secondary" id="btn-pick-end-focus" style="flex: 1; font-size: 11px;">Pick End Focus</button>
            </div>
            <div id="anim-pick-status" style="font-size: 10.5px; color: #38bdf8; text-align: center; min-height: 16px;"></div>

            <!-- Color Split & Regions -->
            <div style="border-top: 1px solid var(--rg-border-subtle); padding-top: 12px; margin-top: 6px;">
              <span style="font-weight: 700; font-size: 11px; color: var(--rg-text-secondary); text-transform: uppercase;">Color Division & Traced Spots</span>
              <div style="display: flex; gap: 6px; margin: 8px 0;">
                <button type="button" class="btn btn-secondary" id="btn-add-anim-split" style="flex: 1; font-size: 10.5px;">+ Two-Color Split</button>
                <button type="button" class="btn btn-secondary" id="btn-clear-anim-regions" style="font-size: 10.5px;">Clear</button>
              </div>
            </div>

            <button type="button" class="btn btn-primary" id="btn-download-image-motion" style="margin-top: 10px; font-size: 11.5px; padding: 7px;">
              Download Motion Recipe (.json)
            </button>
          </div>
        </aside>
      </div>
    `;

    const canvas = document.getElementById('animator-canvas');
    if (canvas) {
      canvas.addEventListener('click', (e) => {
        if (!animatorPickMode) return;
        const r = canvas.getBoundingClientRect();
        const u = (e.clientX - r.left) / r.width;
        const v = (e.clientY - r.top) / r.height;
        if (animatorPickMode === 'start') {
          imageMotion.cityStartU = u;
          imageMotion.cityStartV = v;
        } else if (animatorPickMode === 'end') {
          imageMotion.cityEndU = u;
          imageMotion.cityEndV = v;
        }
        animatorPickMode = null;
        const st = document.getElementById('anim-pick-status');
        if (st) st.textContent = 'Focus recorded!';
        setTimeout(() => { if (st) st.textContent = ''; }, 2000);
      });
    }

    document.getElementById('animator-asset-picker')?.addEventListener('change', (e) => {
      animatorAssetId = e.target.value;
      getMediaElement(animatorAssetId);
    });

    document.getElementById('btn-pick-start-focus')?.addEventListener('click', () => {
      animatorPickMode = 'start';
      const st = document.getElementById('anim-pick-status');
      if (st) st.textContent = 'Click on canvas to set START focus point...';
    });

    document.getElementById('btn-pick-end-focus')?.addEventListener('click', () => {
      animatorPickMode = 'end';
      const st = document.getElementById('anim-pick-status');
      if (st) st.textContent = 'Click on canvas to set END focus point...';
    });

    document.getElementById('btn-add-anim-split')?.addEventListener('click', () => {
      imageMotion.cityRegions.push(
        { type: 'split', side: 'left', position: 0.5, color: '#277eb3', opacity: 0.4 },
        { type: 'split', side: 'right', position: 0.5, color: '#cc4b43', opacity: 0.4 }
      );
      const st = document.getElementById('anim-pick-status');
      if (st) st.textContent = 'Added paired 2-color split!';
      setTimeout(() => { if (st) st.textContent = ''; }, 2000);
    });

    document.getElementById('btn-clear-anim-regions')?.addEventListener('click', () => {
      imageMotion.cityRegions = [];
    });

    document.getElementById('btn-download-image-motion')?.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(imageMotion, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', 'image-motion.json');
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    const playBtn = document.getElementById('btn-animator-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        animatorPlaying = !animatorPlaying;
        playBtn.innerHTML = animatorPlaying
          ? '<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
          : '<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>';
      });
    }

    const scrub = document.getElementById('animator-timeline-scrub');
    if (scrub) {
      scrub.addEventListener('input', (e) => {
        animatorPlaying = false;
        animatorTime = Number(e.target.value);
        if (playBtn) {
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>';
        }
      });
    }

    requestAnimationFrame(stepAnimatorLoop);
  }

  function stepAnimatorLoop(timestamp) {
    if (activeTab === 'animator') {
      if (animatorPlaying) {
        if (!animatorLast) animatorLast = timestamp;
        const dt = (timestamp - animatorLast) / 1000;
        animatorLast = timestamp;
        animatorTime += dt;
        if (animatorTime >= imageMotion.cityDuration) {
          animatorTime = 0;
        }
        const scrub = document.getElementById('animator-timeline-scrub');
        const clock = document.getElementById('animator-clock');
        if (scrub) scrub.value = animatorTime;
        if (clock) clock.textContent = `${animatorTime.toFixed(1)}s / ${imageMotion.cityDuration}s`;
      } else {
        animatorLast = 0;
      }

      const canvas = document.getElementById('animator-canvas');
      if (canvas) {
        paintImageAnimatorStage(canvas, animatorTime);
      }
      requestAnimationFrame(stepAnimatorLoop);
    }
  }

  function paintImageAnimatorStage(canvas, time) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#08131c';
    ctx.fillRect(0, 0, w, h);

    const media = getMediaElement(animatorAssetId);
    if (!media || !isMediaReady(media)) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading media for 3D projection...', w / 2, h / 2);
      return;
    }

    const dur = Math.max(0.1, imageMotion.cityFlyTime);
    const q = Math.min(1, time / dur);

    // Interpolate camera parameters
    const tilt = imageMotion.cityStartElevation + (imageMotion.cityEndElevation - imageMotion.cityStartElevation) * q;
    const roll = imageMotion.cityRoll + (imageMotion.cityEndRoll - imageMotion.cityRoll) * q;
    const dist = imageMotion.cityStartDistance + (imageMotion.cityEndDistance - imageMotion.cityStartDistance) * q;
    const scale = 28 / Math.max(1, dist);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((roll * Math.PI) / 180);
    // Perspective foreshortening using cosine of tilt
    ctx.scale(scale, scale * Math.cos((tilt * Math.PI) / 180));

    // Draw textured plane
    const mw = media.naturalWidth || media.videoWidth || 800;
    const mh = media.naturalHeight || media.videoHeight || 600;
    ctx.drawImage(media, -mw / 2, -mh / 2, mw, mh);

    // Color split regions
    if (imageMotion.cityRegions && imageMotion.cityRegions.length) {
      imageMotion.cityRegions.forEach((reg) => {
        if (reg.type === 'split') {
          ctx.save();
          ctx.fillStyle = reg.color || '#277eb3';
          ctx.globalAlpha = reg.opacity != null ? reg.opacity : 0.35;
          if (reg.side === 'left') {
            ctx.fillRect(-mw / 2, -mh / 2, mw * (reg.position || 0.5), mh);
          } else {
            const startX = -mw / 2 + mw * (reg.position || 0.5);
            ctx.fillRect(startX, -mh / 2, mw * (1 - (reg.position || 0.5)), mh);
          }
          ctx.restore();
        }
      });
    }

    ctx.restore();

    // Edge blur filter
    if (imageMotion.cityEdgeBlur > 0) {
      ctx.save();
      const edgeGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.55);
      edgeGrad.addColorStop(0, 'rgba(8, 19, 28, 0)');
      edgeGrad.addColorStop(1, 'rgba(8, 19, 28, 0.85)');
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  // 5. TAB 3: MANUAL CUTOUT STUDIO
  let cutoutAssetId = null;
  let cutoutPoints = [];
  let cutoutDragging = -1;
  let cutoutPreview = false;
  let cutoutFeather = 1.5;

  function renderCutoutView(host, initialAssetId) {
    if (initialAssetId) cutoutAssetId = initialAssetId;
    if (!cutoutAssetId) {
      const first = getAllAssets().find((a) => a.kind === 'image');
      if (first) cutoutAssetId = first.id;
    }

    host.innerHTML = `
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; overflow: hidden; background: var(--rg-bg-canvas);">
        <!-- Top Cutout Action Bar -->
        <div style="height: 48px; background: var(--rg-bg-panel); border-bottom: 1px solid var(--rg-border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <label style="font-size: 11px; color: var(--rg-text-muted);">Subject:</label>
            <select id="cutout-asset-picker" class="rg-select" style="font-size: 11px; padding: 3px 6px;">
              ${getAllAssets().filter((a) => a.kind === 'image').map((a) => `<option value="${a.id}" ${a.id === cutoutAssetId ? 'selected' : ''}>${escapeHtml(a.label)}</option>`).join('')}
            </select>
            <span style="font-size: 11px; color: var(--rg-text-muted); margin-left: 8px;" id="cutout-point-count">0 contour points</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <label style="font-size: 11px; color: var(--rg-text-secondary);">Feather:</label>
              <input type="range" id="cutout-feather-slider" min="0" max="20" step="0.5" value="${cutoutFeather}" style="width: 90px; accent-color: var(--rg-accent);">
              <span id="cutout-feather-val" style="font-size: 10.5px; font-family: monospace; color: var(--rg-text-muted);">${cutoutFeather}px</span>
            </div>
            <button type="button" class="btn btn-secondary" id="btn-undo-cutout-point" style="font-size: 11px; padding: 4px 10px;">Undo Point</button>
            <button type="button" class="btn btn-secondary" id="btn-clear-cutout-points" style="font-size: 11px; padding: 4px 10px;">Clear</button>
            <button type="button" class="btn btn-secondary" id="btn-preview-cutout-mask" style="font-size: 11px; padding: 4px 12px; background: ${cutoutPreview ? 'var(--rg-accent)' : 'rgba(255,255,255,0.06)'}; color: ${cutoutPreview ? '#fff' : 'var(--rg-text-primary)'};">
              ${cutoutPreview ? 'Edit Points' : 'Preview Mask'}
            </button>
            <button type="button" class="btn btn-primary" id="btn-save-cutout-asset" style="font-size: 11px; padding: 4px 14px;">
              Save Transparent PNG
            </button>
          </div>
        </div>

        <!-- Canvas Area -->
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">
          <div style="width: 100%; max-width: 960px; aspect-ratio: 16/9; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.9); border-radius: 8px; overflow: hidden; border: 1px solid var(--rg-border-strong);">
            <canvas id="cutout-canvas" width="960" height="540" style="width: 100%; height: 100%; display: block; background: #0c1118; cursor: crosshair;"></canvas>
          </div>
        </div>
      </div>
    `;

    const canvas = document.getElementById('cutout-canvas');
    if (canvas) {
      canvas.addEventListener('pointerdown', handleCutoutPointerDown);
      canvas.addEventListener('pointermove', handleCutoutPointerMove);
      canvas.addEventListener('pointerup', handleCutoutPointerUp);
    }

    document.getElementById('cutout-asset-picker')?.addEventListener('change', (e) => {
      cutoutAssetId = e.target.value;
      cutoutPoints = [];
      paintCutoutCanvas();
    });

    document.getElementById('cutout-feather-slider')?.addEventListener('input', (e) => {
      cutoutFeather = Number(e.target.value);
      const v = document.getElementById('cutout-feather-val');
      if (v) v.textContent = cutoutFeather + 'px';
      paintCutoutCanvas();
    });

    document.getElementById('btn-undo-cutout-point')?.addEventListener('click', () => {
      cutoutPoints.pop();
      paintCutoutCanvas();
    });

    document.getElementById('btn-clear-cutout-points')?.addEventListener('click', () => {
      cutoutPoints = [];
      paintCutoutCanvas();
    });

    document.getElementById('btn-preview-cutout-mask')?.addEventListener('click', () => {
      cutoutPreview = !cutoutPreview;
      const btn = document.getElementById('btn-preview-cutout-mask');
      if (btn) {
        btn.textContent = cutoutPreview ? 'Edit Points' : 'Preview Mask';
        btn.style.background = cutoutPreview ? 'var(--rg-accent)' : 'rgba(255,255,255,0.06)';
      }
      paintCutoutCanvas();
    });

    document.getElementById('btn-save-cutout-asset')?.addEventListener('click', async () => {
      if (cutoutPoints.length < 3) {
        alert('Please draw at least 3 points around the subject.');
        return;
      }
      const media = getMediaElement(cutoutAssetId);
      if (!media || !isMediaReady(media)) return;

      const off = document.createElement('canvas');
      off.width = media.naturalWidth || 960;
      off.height = media.naturalHeight || 540;
      const octx = off.getContext('2d');

      // Draw original image
      octx.drawImage(media, 0, 0, off.width, off.height);

      // Mask
      const mask = document.createElement('canvas');
      mask.width = off.width;
      mask.height = off.height;
      const mctx = mask.getContext('2d');
      if (cutoutFeather > 0) {
        mctx.filter = `blur(${cutoutFeather * (off.width / 960)}px)`;
      }
      mctx.fillStyle = '#ffffff';
      mctx.beginPath();
      cutoutPoints.forEach(([u, v], i) => {
        const x = u * off.width;
        const y = v * off.height;
        if (i === 0) mctx.moveTo(x, y);
        else mctx.lineTo(x, y);
      });
      mctx.closePath();
      mctx.fill();

      octx.globalCompositeOperation = 'destination-in';
      octx.drawImage(mask, 0, 0);

      off.toBlob(async (blob) => {
        if (!blob) return;
        const orig = getAssetById(cutoutAssetId);
        const label = (orig ? orig.label : 'subject') + ' Cutout';
        const file = new File([blob], label + '.png', { type: 'image/png' });
        const newId = await handleMediaUpload(file);
        const created = getAssetById(newId);
        if (created) {
          created.alpha = true;
          created.method = 'manual polygon alpha mask';
        }
        alert(`Saved transparent cutout "${label}" to project assets!`);
        openAssetsToolsStudio('registry');
      }, 'image/png');
    });

    paintCutoutCanvas();
  }

  function handleCutoutPointerDown(e) {
    const canvas = document.getElementById('cutout-canvas');
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const u = (e.clientX - r.left) / r.width;
    const v = (e.clientY - r.top) / r.height;

    // Check if clicking near existing point
    cutoutDragging = cutoutPoints.findIndex(([pu, pv]) => Math.hypot(pu - u, pv - v) < 0.03);
    if (cutoutDragging < 0) {
      cutoutPoints.push([u, v]);
      cutoutDragging = cutoutPoints.length - 1;
    }
    paintCutoutCanvas();
  }

  function handleCutoutPointerMove(e) {
    if (cutoutDragging < 0) return;
    const canvas = document.getElementById('cutout-canvas');
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const u = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const v = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    cutoutPoints[cutoutDragging] = [u, v];
    paintCutoutCanvas();
  }

  function handleCutoutPointerUp() {
    cutoutDragging = -1;
  }

  function paintCutoutCanvas() {
    const canvas = document.getElementById('cutout-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Checkerboard background
    for (let y = 0; y < h; y += 18) {
      for (let x = 0; x < w; x += 18) {
        ctx.fillStyle = ((x + y) / 18) % 2 ? '#1f242d' : '#141820';
        ctx.fillRect(x, y, 18, 18);
      }
    }

    const media = getMediaElement(cutoutAssetId);
    if (!media || !isMediaReady(media)) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading image for cutout...', w / 2, h / 2);
      return;
    }

    const mw = media.naturalWidth || 800;
    const mh = media.naturalHeight || 600;
    const scale = Math.min(w / mw, h / mh);
    const rw = mw * scale;
    const rh = mh * scale;
    const rx = (w - rw) / 2;
    const ry = (h - rh) / 2;

    if (cutoutPreview && cutoutPoints.length >= 3) {
      // Offscreen masked render
      const temp = document.createElement('canvas');
      temp.width = w;
      temp.height = h;
      const tctx = temp.getContext('2d');
      tctx.drawImage(media, rx, ry, rw, rh);

      const m = document.createElement('canvas');
      m.width = w;
      m.height = h;
      const mctx = m.getContext('2d');
      if (cutoutFeather > 0) mctx.filter = `blur(${cutoutFeather}px)`;
      mctx.fillStyle = '#fff';
      mctx.beginPath();
      cutoutPoints.forEach(([u, v], i) => {
        if (i === 0) mctx.moveTo(u * w, v * h);
        else mctx.lineTo(u * w, v * h);
      });
      mctx.closePath();
      mctx.fill();

      tctx.globalCompositeOperation = 'destination-in';
      tctx.drawImage(m, 0, 0);

      ctx.drawImage(temp, 0, 0);
    } else {
      ctx.drawImage(media, rx, ry, rw, rh);

      // Draw outline polygon
      if (cutoutPoints.length > 0) {
        ctx.save();
        ctx.strokeStyle = '#c084fc';
        ctx.fillStyle = 'rgba(192, 132, 252, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        cutoutPoints.forEach(([u, v], i) => {
          if (i === 0) ctx.moveTo(u * w, v * h);
          else ctx.lineTo(u * w, v * h);
        });
        if (cutoutPoints.length > 2) {
          ctx.closePath();
          ctx.fill();
        }
        ctx.stroke();

        // Control vertices
        ctx.fillStyle = '#ffffff';
        cutoutPoints.forEach(([u, v]) => {
          ctx.beginPath();
          ctx.arc(u * w, v * h, 4.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    const count = document.getElementById('cutout-point-count');
    if (count) count.textContent = `${cutoutPoints.length} contour points`;
  }

  function renderWorkbenchTabContent(targetAssetId) {
    const host = document.getElementById('workbench-tab-content');
    if (!host) return;

    if (activeTab === 'registry') {
      renderAssetRegistryView(host);
    } else if (activeTab === 'animator') {
      renderImageAnimatorView(host, targetAssetId);
    } else if (activeTab === 'cutout') {
      renderCutoutView(host, targetAssetId);
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // 6. EXPOSE TO WINDOW
  window.RegaarderAssetWorkbench = {
    open: openAssetsToolsStudio,
    openImageAnimator: (id) => openAssetsToolsStudio('animator', id),
    openCutout: (id) => openAssetsToolsStudio('cutout', id),
    getAllAssets,
    getAssetById,
    uploadMedia: handleMediaUpload
  };

  // Compatibility hook for NoirExpose
  window.NoirExpose = {
    version: 1,
    styleId: 'regaarder-studio',
    listAssets: getAllAssets
  };
})();
