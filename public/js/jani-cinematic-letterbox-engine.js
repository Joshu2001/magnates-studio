/**
 * James Jani Cinematic Letterbox & Lower Caption Frame Engine
 * 
 * Replicating the signature high-end video essay letterbox format:
 * 1. Centered photo or video framing with customizable letterbox matte bars
 * 2. Independent or unified color selection for top and bottom bars (default pure black #000000)
 * 3. Draggable, scalable media placement in the middle aperture
 * 4. High-impact lower caption text area under the media (e.g. "SPUN OVER THE COURSE OF A FEW YEARS.")
 * 5. Documentary branding badges (Bottom-left channel watermark "JANi" & bottom-right "SUBSCRIBE")
 * 6. Subtle cinematic slow push-in camera motion
 */

(function() {
  'use strict';

  const TEMPLATE_ID = 'jani-cinematic-letterbox';
  const DEFAULT_IMAGE = '/jani_cinematic_letterbox_ref.png';
  const DEFAULT_VIDEO = '/cinematic_footage_loop.mp4';

  const DEFAULT_CONFIG = {
    // 1. Media Source
    mediaUrl: DEFAULT_IMAGE,
    mediaType: 'image', // 'image' or 'video'
    mediaScale: 1.0,
    mediaX: 0,
    mediaY: 0,
    mediaFit: 'cover', // 'cover' or 'contain'

    // 2. Letterbox Matte Bars (Top & Bottom)
    barColor: '#000000',
    topBarColor: '#000000',
    bottomBarColor: '#000000',
    separateBarColors: false,
    barHeightPercent: 14, // 14% top and bottom (2.35:1 anamorphic ratio feel)
    barPreset: 'cinemascope', // 'cinemascope' (14%), 'anamorphic' (16%), 'univisium' (11%), 'deep' (20%), 'custom'

    // 3. Lower Caption Space (Text under media)
    captionText: 'SPUN OVER THE COURSE OF A FEW YEARS.',
    captionFont: 'Oswald, "Bebas Neue", "Impact", -apple-system, sans-serif',
    captionSize: 28,
    captionColor: '#ffffff',
    captionLetterSpacing: 2.5,
    captionUppercase: true,
    captionAnim: 'pop', // 'pop', 'fade', 'typewriter', 'static'
    captionOffsetY: 0,

    // 4. Subtle Channel Mark & Corner Badges (Image fidelity)
    showChannelTag: true,
    channelTagText: 'JANi',
    channelTagColor: 'rgba(255, 255, 255, 0.45)',
    showActionTag: true,
    actionTagText: 'SUBSCRIBE',
    actionTagColor: 'rgba(255, 255, 255, 0.55)',

    // 5. Camera & Film Motion
    cameraMotion: 'slow-push', // 'static', 'slow-push', 'drift'
    motionIntensity: 0.05,     // 5% zoom over duration
    grainOverlay: true,
    grainOpacity: 0.12,
    duration: 6.0
  };

  // Keep live state
  let activeConfig = Object.assign({}, DEFAULT_CONFIG);
  let activeStageEl = null;
  let isMediaDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialMediaX = 0;
  let initialMediaY = 0;
  let animFrameId = null;

  function getConfig(state) {
    const raw = (typeof window.tplGetContextualData === 'function') 
      ? window.tplGetContextualData(TEMPLATE_ID) 
      : (state && state.letterboxConfig);
    return Object.assign({}, DEFAULT_CONFIG, raw || {});
  }

  window.getJaniCinematicLetterboxDefaultConfig = function() {
    return Object.assign({}, DEFAULT_CONFIG);
  };

  /**
   * Mount interactive stage into Top Template Customizer Modal
   */
  window.tplMountJaniCinematicLetterboxStage = function(stage, data) {
    if (!stage) return;
    activeStageEl = stage;

    // Merge stored contextual data with passed data
    const stored = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(TEMPLATE_ID) : {};
    activeConfig = Object.assign({}, DEFAULT_CONFIG, stored, data || {});

    // If topCustomizerState has primaryUrl, check if user updated media
    if (typeof topCustomizerState !== 'undefined' && topCustomizerState && topCustomizerState.primaryUrl) {
      activeConfig.mediaUrl = topCustomizerState.primaryUrl;
      activeConfig.mediaType = topCustomizerState.primaryIsVideo ? 'video' : (/\.(mp4|webm|mov)(\?|$)/i.test(activeConfig.mediaUrl) ? 'video' : 'image');
    }

    const isVideo = activeConfig.mediaType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(activeConfig.mediaUrl);
    const topColor = activeConfig.separateBarColors ? (activeConfig.topBarColor || '#000000') : (activeConfig.barColor || '#000000');
    const bottomColor = activeConfig.separateBarColors ? (activeConfig.bottomBarColor || '#000000') : (activeConfig.barColor || '#000000');
    const barH = activeConfig.barHeightPercent || 14;

    stage.innerHTML = `
      <div id="jcl-root" style="
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        box-sizing: border-box;
      ">
        <!-- Center Stage 16:9 Letterbox Viewport -->
        <div id="jcl-viewport" style="
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- 1. Middle Media Layer (Draggable Photo or Video) -->
          <div id="jcl-media-wrapper" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            z-index: 2;
            transform: translate(${activeConfig.mediaX}px, ${activeConfig.mediaY}px) scale(${activeConfig.mediaScale});
            transform-origin: center center;
            will-change: transform;
            transition: box-shadow 0.2s ease;
          " title="Drag to reposition media inside frame">
            ${isVideo ? `
              <video id="jcl-video-el" src="${activeConfig.mediaUrl}" autoplay loop muted playsinline style="
                width: 100%;
                height: 100%;
                object-fit: ${activeConfig.mediaFit || 'cover'};
                pointer-events: none;
              "></video>
            ` : `
              <img id="jcl-image-el" src="${activeConfig.mediaUrl}" alt="Letterbox Media" style="
                width: 100%;
                height: 100%;
                object-fit: ${activeConfig.mediaFit || 'cover'};
                pointer-events: none;
              " />
            `}

            <!-- Draggable outline indicator (shows on hover) -->
            <div id="jcl-drag-outline" style="
              position: absolute;
              inset: 0;
              border: 1px dashed rgba(0, 240, 255, 0.35);
              pointer-events: none;
              opacity: 0;
              transition: opacity 0.2s ease;
            "></div>
          </div>

          <!-- 2. Subtle Cinematic Film Grain (Over media only) -->
          <div id="jcl-film-grain" style="
            position: absolute;
            inset: 0;
            background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0);
            background-size: 3px 3px;
            opacity: ${activeConfig.grainOverlay ? activeConfig.grainOpacity : 0};
            pointer-events: none;
            mix-blend-mode: overlay;
            z-index: 3;
          "></div>

          <!-- 3. TOP MATTE BAR (Custom color) -->
          <div id="jcl-top-bar" style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: ${barH}%;
            background-color: ${topColor};
            z-index: 10;
            pointer-events: auto;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            box-sizing: border-box;
          ">
            <span style="font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.2); letter-spacing: 1px; text-transform: uppercase;">
              TOP MATTE BAR
            </span>
            <span id="jcl-top-ratio-tag" style="font-size: 9px; font-family: monospace; color: rgba(255,255,255,0.25);">
              ${barH}%
            </span>
          </div>

          <!-- 4. BOTTOM MATTE BAR & LOWER CAPTION SPACE (Custom color + text area) -->
          <div id="jcl-bottom-bar" style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: ${barH + 1.5}%;
            background-color: ${bottomColor};
            z-index: 10;
            pointer-events: auto;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 24px;
            box-sizing: border-box;
          ">
            <!-- Left Channel Watermark (e.g. JANi) -->
            <div id="jcl-channel-tag" style="
              position: absolute;
              left: 18px;
              bottom: 8px;
              font-family: 'Oswald', 'Bebas Neue', 'Impact', sans-serif;
              font-size: 16px;
              font-weight: 800;
              letter-spacing: 1.5px;
              color: ${activeConfig.channelTagColor || 'rgba(255, 255, 255, 0.45)'};
              display: ${activeConfig.showChannelTag ? 'block' : 'none'};
              pointer-events: none;
              line-height: 1;
              text-transform: uppercase;
            ">${activeConfig.channelTagText || 'JANi'}</div>

            <!-- Main Documentary Caption (User editable & draggable) -->
            <div id="jcl-caption-text" contenteditable="true" spellcheck="false" style="
              color: ${activeConfig.captionColor || '#ffffff'};
              font-family: ${activeConfig.captionFont || 'Oswald, sans-serif'};
              font-size: ${activeConfig.captionSize || 28}px;
              font-weight: 700;
              letter-spacing: ${activeConfig.captionLetterSpacing || 2.5}px;
              text-transform: ${activeConfig.captionUppercase ? 'uppercase' : 'none'};
              text-align: center;
              line-height: 1.15;
              padding: 4px 14px;
              border-radius: 4px;
              outline: none;
              max-width: 80%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              cursor: text;
              transform: translateY(${activeConfig.captionOffsetY || 0}px);
              transition: border 0.15s, background 0.15s;
              z-index: 12;
            " title="Click to edit subtitle text directly">${activeConfig.captionText || 'SPUN OVER THE COURSE OF A FEW YEARS.'}</div>

            <!-- Right Action / Subscribe Watermark -->
            <div id="jcl-action-tag" style="
              position: absolute;
              right: 18px;
              bottom: 10px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 1.5px;
              color: ${activeConfig.actionTagColor || 'rgba(255, 255, 255, 0.55)'};
              display: ${activeConfig.showActionTag ? 'block' : 'none'};
              pointer-events: none;
              text-transform: uppercase;
            ">${activeConfig.actionTagText || 'SUBSCRIBE'}</div>
          </div>

          <!-- Floating Stage Guidance HUD Badge -->
          <div style="
            position: absolute;
            top: 12px;
            left: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            pointer-events: none;
            z-index: 20;
          ">
            <span style="
              font-size: 9.5px;
              font-weight: 800;
              color: #f8fafc;
              background: rgba(0, 0, 0, 0.75);
              border: 1px solid rgba(255, 255, 255, 0.2);
              padding: 3px 8px;
              border-radius: 4px;
              letter-spacing: 0.6px;
              text-transform: uppercase;
            ">CINEMATIC LETTERBOX</span>
            <span style="
              font-size: 9px;
              font-weight: 600;
              color: #38bdf8;
              background: rgba(56, 189, 248, 0.15);
              border: 1px solid rgba(56, 189, 248, 0.3);
              padding: 2px 6px;
              border-radius: 4px;
            ">&#x2728; DRAGGABLE MEDIA</span>
          </div>

          <!-- Quick Reset Center Button (Hovering on canvas) -->
          <button type="button" id="jcl-btn-recenter" style="
            position: absolute;
            top: 12px;
            right: 14px;
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #94a3b8;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 600;
            cursor: pointer;
            z-index: 20;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s ease;
          " title="Reset media back to perfect center">
            <span>&#x2715;</span> Center Media
          </button>
        </div>
      </div>
    `;

    // Bind Stage Interactions
    wireStageInteractions(stage);

    // Sync contextual data to persistent store
    persistConfig();

    // Re-render Inspector Controls to ensure UI is in complete sync
    if (typeof window.tplRenderContextualInspector === 'function') {
      window.tplRenderContextualInspector(TEMPLATE_ID);
    }
  };

  /**
   * Wire Mouse Dragging, Editing, and Stage Controls
   */
  function wireStageInteractions(stage) {
    const mediaWrapper = stage.querySelector('#jcl-media-wrapper');
    const dragOutline = stage.querySelector('#jcl-drag-outline');
    const recenterBtn = stage.querySelector('#jcl-btn-recenter');
    const captionEl = stage.querySelector('#jcl-caption-text');

    if (!mediaWrapper) return;

    // Hover outline
    mediaWrapper.onmouseenter = () => { if (dragOutline) dragOutline.style.opacity = '1'; };
    mediaWrapper.onmouseleave = () => { if (!isMediaDragging && dragOutline) dragOutline.style.opacity = '0'; };

    // Mouse Down: Start dragging media
    mediaWrapper.onmousedown = (e) => {
      // Don't drag if clicking caption or matte bar
      if (e.target.closest('#jcl-top-bar') || e.target.closest('#jcl-bottom-bar')) return;
      isMediaDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialMediaX = activeConfig.mediaX || 0;
      initialMediaY = activeConfig.mediaY || 0;
      mediaWrapper.style.cursor = 'grabbing';
      if (dragOutline) dragOutline.style.opacity = '1';

      const onMouseMove = (ev) => {
        if (!isMediaDragging) return;
        const dx = ev.clientX - dragStartX;
        const dy = ev.clientY - dragStartY;
        activeConfig.mediaX = Math.round(initialMediaX + dx);
        activeConfig.mediaY = Math.round(initialMediaY + dy);
        updateMediaTransform(stage);

        // Update inspector slider values in real-time
        const sliderX = document.getElementById('jcl-slider-pos-x');
        const valX = document.getElementById('jcl-val-pos-x');
        if (sliderX) sliderX.value = activeConfig.mediaX;
        if (valX) valX.textContent = activeConfig.mediaX + 'px';

        const sliderY = document.getElementById('jcl-slider-pos-y');
        const valY = document.getElementById('jcl-val-pos-y');
        if (sliderY) sliderY.value = activeConfig.mediaY;
        if (valY) valY.textContent = activeConfig.mediaY + 'px';
      };

      const onMouseUp = () => {
        isMediaDragging = false;
        mediaWrapper.style.cursor = 'grab';
        if (dragOutline) dragOutline.style.opacity = '0';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        persistConfig();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    // Recenter button
    if (recenterBtn) {
      recenterBtn.onclick = (e) => {
        e.stopPropagation();
        activeConfig.mediaX = 0;
        activeConfig.mediaY = 0;
        activeConfig.mediaScale = 1.0;
        updateMediaTransform(stage);
        persistConfig();
        if (typeof window.tplRenderContextualInspector === 'function') {
          window.tplRenderContextualInspector(TEMPLATE_ID);
        }
      };
    }

    // Direct inline subtitle editing
    if (captionEl) {
      captionEl.oninput = () => {
        activeConfig.captionText = captionEl.innerText.trim();
        const inp = document.getElementById('jcl-input-caption-text');
        if (inp) inp.value = activeConfig.captionText;
        persistConfig();
      };
      captionEl.onfocus = () => {
        captionEl.style.border = '1px dashed #38bdf8';
        captionEl.style.background = 'rgba(0, 0, 0, 0.4)';
      };
      captionEl.onblur = () => {
        captionEl.style.border = 'none';
        captionEl.style.background = 'transparent';
        activeConfig.captionText = captionEl.innerText.trim();
        persistConfig();
      };
    }
  }

  function updateMediaTransform(stage) {
    const el = (stage || activeStageEl)?.querySelector('#jcl-media-wrapper');
    if (el) {
      el.style.transform = `translate(${activeConfig.mediaX}px, ${activeConfig.mediaY}px) scale(${activeConfig.mediaScale})`;
    }
  }

  function persistConfig() {
    if (typeof window.tplSetContextualData === 'function') {
      window.tplSetContextualData(TEMPLATE_ID, activeConfig);
    }
  }

  /**
   * Renders Granular Contextual Inspector Controls into Studio Inspector Panel
   */
  window.tplRenderJaniCinematicLetterboxInspector = function(container) {
    if (!container) return;
    const cfg = getConfig();
    activeConfig = cfg;

    const topColor = cfg.separateBarColors ? (cfg.topBarColor || '#000000') : (cfg.barColor || '#000000');
    const bottomColor = cfg.separateBarColors ? (cfg.bottomBarColor || '#000000') : (cfg.barColor || '#000000');
    const isVideo = cfg.mediaType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(cfg.mediaUrl);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; padding-bottom: 24px; color: #f8fafc;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 12, 20, 0.95)); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 12px 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <div style="font-size: 12px; font-weight: 800; color: #38bdf8; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
              <span>&#x1f3ac;</span> JANI CINEMATIC LETTERBOX FRAME
            </div>
            <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: rgba(56,189,248,0.2); color: #7dd3fc; font-weight: 700;">PRO MATTE</span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
            Widescreen cinematic matte bars with centered draggable photo/video and documentary lower caption space.
          </div>
        </div>

        <!-- SECTION 1: MEDIA SOURCE (PHOTO OR VIDEO) -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">1. Middle Media Source</label>
            <span style="font-size: 10px; color: #38bdf8; font-weight: 600;">${isVideo ? 'Video Clip' : 'Still Photo'}</span>
          </div>

          <!-- Upload / Switch Button & Media Type -->
          <div style="display: flex; gap: 8px;">
            <label style="
              flex: 1; padding: 8px 12px; border-radius: 6px; background: rgba(56, 189, 248, 0.15);
              border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; font-size: 11px; font-weight: 700;
              display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; text-align: center;
              transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(56,189,248,0.25)';" onmouseout="this.style.background='rgba(56,189,248,0.15)';">
              <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; fill: currentColor;"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
              <span>Upload Video / Photo</span>
              <input type="file" id="jcl-file-media-input" accept="video/*,image/*" style="display: none;" />
            </label>
            <button type="button" id="jcl-btn-default-ref" style="
              padding: 8px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; cursor: pointer;
              background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12); color: #cbd5e1;
            " title="Reset to James Jani reference media">Default Ref</button>
          </div>

          <!-- Sample Media Presets -->
          <div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 5px; font-weight: 600;">SAMPLE PRESETS</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
              <button type="button" class="jcl-media-preset-btn" data-url="/jani_cinematic_letterbox_ref.png" data-type="image" style="padding: 5px 4px; font-size: 10px; border-radius: 5px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; cursor: pointer;">Jani Ref</button>
              <button type="button" class="jcl-media-preset-btn" data-url="/cinematic_footage_loop.mp4" data-type="video" style="padding: 5px 4px; font-size: 10px; border-radius: 5px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; cursor: pointer;">Footage Loop</button>
              <button type="button" class="jcl-media-preset-btn" data-url="/boardroom_scene_hd.jpg" data-type="image" style="padding: 5px 4px; font-size: 10px; border-radius: 5px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; cursor: pointer;">Boardroom</button>
              <button type="button" class="jcl-media-preset-btn" data-url="/cctv_surveillance_scene.jpg" data-type="image" style="padding: 5px 4px; font-size: 10px; border-radius: 5px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; cursor: pointer;">CCTV</button>
            </div>
          </div>
        </div>

        <!-- SECTION 2: TOP & BOTTOM MATTE BAR COLORS (THE REQUESTED KEY FEATURE) -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">2. Top & Bottom Bar Color</label>
            <label style="font-size: 10.5px; color: #94a3b8; display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <input type="checkbox" id="jcl-check-separate-colors" ${cfg.separateBarColors ? 'checked' : ''} style="cursor: pointer;" />
              <span>Independent Top / Down Colors</span>
            </label>
          </div>

          <!-- Unified Color Controls -->
          <div id="jcl-wrap-unified-color" style="display: ${cfg.separateBarColors ? 'none' : 'flex'}; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="color" id="jcl-picker-bar-color" value="${cfg.barColor || '#000000'}" style="width: 38px; height: 32px; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; background: transparent; cursor: pointer;" />
              <input type="text" id="jcl-text-bar-color" value="${cfg.barColor || '#000000'}" style="flex: 1; padding: 6px 10px; font-size: 11px; font-family: monospace; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #f8fafc;" />
            </div>
          </div>

          <!-- Independent Separate Colors Controls -->
          <div id="jcl-wrap-separate-colors" style="display: ${cfg.separateBarColors ? 'grid' : 'none'}; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">TOP BAR COLOR</div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="color" id="jcl-picker-top-color" value="${topColor}" style="width: 32px; height: 28px; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: transparent; cursor: pointer;" />
                <input type="text" id="jcl-text-top-color" value="${topColor}" style="width: 100%; padding: 5px 8px; font-size: 10px; font-family: monospace; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 5px; color: #f8fafc;" />
              </div>
            </div>
            <div>
              <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">BOTTOM BAR COLOR</div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="color" id="jcl-picker-bottom-color" value="${bottomColor}" style="width: 32px; height: 28px; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: transparent; cursor: pointer;" />
                <input type="text" id="jcl-text-bottom-color" value="${bottomColor}" style="width: 100%; padding: 5px 8px; font-size: 10px; font-family: monospace; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 5px; color: #f8fafc;" />
              </div>
            </div>
          </div>

          <!-- Quick Color Presets -->
          <div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 5px; font-weight: 600;">COLOR PRESETS</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="jcl-color-preset-pill" data-color="#000000" style="padding: 4px 8px; font-size: 10px; border-radius: 4px; background: #000000; border: 1px solid rgba(255,255,255,0.25); color: #fff; cursor: pointer;">&#x25aa; Pure Black</button>
              <button type="button" class="jcl-color-preset-pill" data-color="#080c14" style="padding: 4px 8px; font-size: 10px; border-radius: 4px; background: #080c14; border: 1px solid rgba(56,189,248,0.3); color: #7dd3fc; cursor: pointer;">Obsidian Navy</button>
              <button type="button" class="jcl-color-preset-pill" data-color="#18181b" style="padding: 4px 8px; font-size: 10px; border-radius: 4px; background: #18181b; border: 1px solid rgba(255,255,255,0.15); color: #e4e4e7; cursor: pointer;">Studio Charcoal</button>
              <button type="button" class="jcl-color-preset-pill" data-color="#1a0a0d" style="padding: 4px 8px; font-size: 10px; border-radius: 4px; background: #1a0a0d; border: 1px solid rgba(244,63,94,0.3); color: #fda4af; cursor: pointer;">Crimson Noir</button>
              <button type="button" class="jcl-color-preset-pill" data-color="#f4eedb" style="padding: 4px 8px; font-size: 10px; border-radius: 4px; background: #f4eedb; border: 1px solid rgba(0,0,0,0.2); color: #1e293b; cursor: pointer;">Vintage Ivory</button>
            </div>
          </div>

          <!-- Matte Bar Height / Aspect Ratio Presets -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span style="font-weight: 600; color: #cbd5e1;">Letterbox Bar Height</span>
              <span id="jcl-val-bar-height" style="color: #38bdf8; font-family: monospace;">${cfg.barHeightPercent}%</span>
            </div>
            <input type="range" id="jcl-slider-bar-height" min="6" max="28" step="1" value="${cfg.barHeightPercent}" style="width: 100%; accent-color: #38bdf8;" />
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <button type="button" class="jcl-ratio-btn" data-pct="14" style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; cursor: pointer;">2.35:1 Anamorphic (14%)</button>
              <button type="button" class="jcl-ratio-btn" data-pct="16" style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; cursor: pointer;">2.39:1 CinemaScope (16%)</button>
              <button type="button" class="jcl-ratio-btn" data-pct="11" style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; cursor: pointer;">2.0:1 Univisium (11%)</button>
            </div>
          </div>
        </div>

        <!-- SECTION 3: MEDIA PLACEMENT & DRAGGABILITY -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">3. Media Drag & Framing</label>
            <button type="button" id="jcl-btn-reset-pos" style="padding: 3px 8px; font-size: 10px; font-weight: 600; border-radius: 4px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #94a3b8; cursor: pointer;">Reset to Center</button>
          </div>

          <!-- Scale Slider -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span style="font-weight: 600; color: #cbd5e1;">Media Scale / Crop</span>
              <span id="jcl-val-scale" style="color: #38bdf8; font-family: monospace;">${Math.round(cfg.mediaScale * 100)}%</span>
            </div>
            <input type="range" id="jcl-slider-scale" min="0.6" max="2.0" step="0.02" value="${cfg.mediaScale}" style="width: 100%; accent-color: #38bdf8;" />
          </div>

          <!-- Horizontal Position Offset -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span style="font-weight: 600; color: #cbd5e1;">Horizontal Offset (X)</span>
              <span id="jcl-val-pos-x" style="color: #38bdf8; font-family: monospace;">${cfg.mediaX}px</span>
            </div>
            <input type="range" id="jcl-slider-pos-x" min="-300" max="300" step="2" value="${cfg.mediaX}" style="width: 100%; accent-color: #38bdf8;" />
          </div>

          <!-- Vertical Position Offset -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span style="font-weight: 600; color: #cbd5e1;">Vertical Offset (Y)</span>
              <span id="jcl-val-pos-y" style="color: #38bdf8; font-family: monospace;">${cfg.mediaY}px</span>
            </div>
            <input type="range" id="jcl-slider-pos-y" min="-200" max="200" step="2" value="${cfg.mediaY}" style="width: 100%; accent-color: #38bdf8;" />
          </div>
          <div style="font-size: 10px; color: #64748b; font-style: italic;">
            Tip: You can also click and drag the video or photo directly inside the preview screen above!
          </div>
        </div>

        <!-- SECTION 4: LOWER CAPTION TEXT & TYPOGRAPHY -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">4. Lower Caption Space (Text)</label>
            <span style="font-size: 10px; color: #38bdf8; font-weight: 600;">Bottom Matte</span>
          </div>

          <!-- Text Input -->
          <div>
            <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">SUBTITLE CAPTION TEXT</div>
            <textarea id="jcl-input-caption-text" rows="2" style="
              width: 100%; padding: 8px 10px; font-size: 12px; font-weight: 600;
              background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
              color: #f8fafc; font-family: ${cfg.captionFont}; resize: vertical; box-sizing: border-box;
            ">${cfg.captionText || ''}</textarea>
          </div>

          <!-- Font Size & Font Color -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Font Size</span>
                <span id="jcl-val-font-size" style="color: #38bdf8; font-family: monospace;">${cfg.captionSize}px</span>
              </div>
              <input type="range" id="jcl-slider-font-size" min="16" max="52" step="1" value="${cfg.captionSize}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
            <div>
              <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">TEXT COLOR</div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="color" id="jcl-picker-text-color" value="${cfg.captionColor || '#ffffff'}" style="width: 32px; height: 28px; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: transparent; cursor: pointer;" />
                <input type="text" id="jcl-text-text-color" value="${cfg.captionColor || '#ffffff'}" style="width: 100%; padding: 5px 8px; font-size: 10px; font-family: monospace; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 5px; color: #f8fafc;" />
              </div>
            </div>
          </div>

          <!-- Font Family & Letter Spacing -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">FONT FAMILY</div>
              <select id="jcl-select-font" style="width: 100%; padding: 6px 8px; font-size: 11px; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #f8fafc;">
                <option value="Oswald, 'Bebas Neue', Impact, sans-serif" ${cfg.captionFont.includes('Oswald') ? 'selected' : ''}>Oswald (Jani Style)</option>
                <option value="'Bebas Neue', sans-serif" ${cfg.captionFont.includes('Bebas') ? 'selected' : ''}>Bebas Neue</option>
                <option value="'Inter', sans-serif" ${cfg.captionFont.includes('Inter') ? 'selected' : ''}>Inter Modern</option>
                <option value="'Cinzel', Georgia, serif" ${cfg.captionFont.includes('Cinzel') ? 'selected' : ''}>Cinzel Serif</option>
                <option value="'JetBrains Mono', monospace" ${cfg.captionFont.includes('Mono') ? 'selected' : ''}>Mono Terminal</option>
              </select>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #cbd5e1;">Letter Spacing</span>
                <span id="jcl-val-spacing" style="color: #38bdf8; font-family: monospace;">${cfg.captionLetterSpacing}px</span>
              </div>
              <input type="range" id="jcl-slider-spacing" min="0" max="10" step="0.5" value="${cfg.captionLetterSpacing}" style="width: 100%; accent-color: #38bdf8;" />
            </div>
          </div>
        </div>

        <!-- SECTION 5: CORNER WATERMARKS & FILM GRAIN -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px;">
          <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">5. Branding & Ambiance</label>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <!-- Left Channel Watermark -->
            <div>
              <label style="font-size: 10.5px; color: #94a3b8; display: flex; align-items: center; gap: 5px; cursor: pointer; margin-bottom: 4px;">
                <input type="checkbox" id="jcl-check-channel-tag" ${cfg.showChannelTag ? 'checked' : ''} style="cursor: pointer;" />
                <span style="font-weight: 600;">Left Channel Tag</span>
              </label>
              <input type="text" id="jcl-input-channel-tag" value="${cfg.channelTagText || 'JANi'}" style="width: 100%; padding: 5px 8px; font-size: 11px; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 5px; color: #f8fafc; font-weight: 700;" />
            </div>

            <!-- Right Action Tag -->
            <div>
              <label style="font-size: 10.5px; color: #94a3b8; display: flex; align-items: center; gap: 5px; cursor: pointer; margin-bottom: 4px;">
                <input type="checkbox" id="jcl-check-action-tag" ${cfg.showActionTag ? 'checked' : ''} style="cursor: pointer;" />
                <span style="font-weight: 600;">Right Action Tag</span>
              </label>
              <input type="text" id="jcl-input-action-tag" value="${cfg.actionTagText || 'SUBSCRIBE'}" style="width: 100%; padding: 5px 8px; font-size: 11px; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 5px; color: #f8fafc; font-weight: 700;" />
            </div>
          </div>

          <!-- Film Grain Toggle -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px;">
            <label style="font-size: 11px; color: #cbd5e1; display: flex; align-items: center; gap: 6px; cursor: pointer;">
              <input type="checkbox" id="jcl-check-grain" ${cfg.grainOverlay ? 'checked' : ''} style="cursor: pointer;" />
              <span>35mm Analog Film Grain Texture</span>
            </label>
            <label style="font-size: 11px; color: #cbd5e1; display: flex; align-items: center; gap: 6px; cursor: pointer;">
              <input type="checkbox" id="jcl-check-motion" ${cfg.cameraMotion === 'slow-push' ? 'checked' : ''} style="cursor: pointer;" />
              <span>Slow Camera Push-In</span>
            </label>
          </div>
        </div>

      </div>
    `;

    // Wire up all Inspector Events
    wireInspectorEvents(container);
  };

  /**
   * Wire Inspector Event Listeners
   */
  function wireInspectorEvents(container) {
    const stage = activeStageEl || document.getElementById('tpl-modal-preview-stage');

    // 1. File Upload (Photo or Video)
    const fileInp = container.querySelector('#jcl-file-media-input');
    if (fileInp) {
      fileInp.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|$)/i.test(file.name);
        activeConfig.mediaUrl = url;
        activeConfig.mediaType = isVid ? 'video' : 'image';
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
          topCustomizerState.primaryUrl = url;
          topCustomizerState.primaryIsVideo = isVid;
        }
        persistConfig();
        window.tplMountJaniCinematicLetterboxStage(stage, activeConfig);
      };
    }

    // Default Ref button
    const defaultRefBtn = container.querySelector('#jcl-btn-default-ref');
    if (defaultRefBtn) {
      defaultRefBtn.onclick = () => {
        activeConfig.mediaUrl = DEFAULT_IMAGE;
        activeConfig.mediaType = 'image';
        activeConfig.mediaX = 0;
        activeConfig.mediaY = 0;
        activeConfig.mediaScale = 1.0;
        persistConfig();
        window.tplMountJaniCinematicLetterboxStage(stage, activeConfig);
      };
    }

    // Media Preset buttons
    container.querySelectorAll('.jcl-media-preset-btn').forEach(btn => {
      btn.onclick = () => {
        const url = btn.dataset.url;
        const type = btn.dataset.type || 'image';
        activeConfig.mediaUrl = url;
        activeConfig.mediaType = type;
        if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
          topCustomizerState.primaryUrl = url;
          topCustomizerState.primaryIsVideo = (type === 'video');
        }
        persistConfig();
        window.tplMountJaniCinematicLetterboxStage(stage, activeConfig);
      };
    });

    // 2. Color Controls
    const checkSeparate = container.querySelector('#jcl-check-separate-colors');
    const wrapUnified = container.querySelector('#jcl-wrap-unified-color');
    const wrapSeparate = container.querySelector('#jcl-wrap-separate-colors');

    const pickerBar = container.querySelector('#jcl-picker-bar-color');
    const textBar = container.querySelector('#jcl-text-bar-color');
    const pickerTop = container.querySelector('#jcl-picker-top-color');
    const textTop = container.querySelector('#jcl-text-top-color');
    const pickerBottom = container.querySelector('#jcl-picker-bottom-color');
    const textBottom = container.querySelector('#jcl-text-bottom-color');

    const updateStageColors = () => {
      const topBarEl = stage?.querySelector('#jcl-top-bar');
      const bottomBarEl = stage?.querySelector('#jcl-bottom-bar');
      const tc = activeConfig.separateBarColors ? (activeConfig.topBarColor || '#000000') : (activeConfig.barColor || '#000000');
      const bc = activeConfig.separateBarColors ? (activeConfig.bottomBarColor || '#000000') : (activeConfig.barColor || '#000000');
      if (topBarEl) topBarEl.style.backgroundColor = tc;
      if (bottomBarEl) bottomBarEl.style.backgroundColor = bc;
      persistConfig();
    };

    if (checkSeparate) {
      checkSeparate.onchange = (e) => {
        activeConfig.separateBarColors = e.target.checked;
        if (wrapUnified) wrapUnified.style.display = activeConfig.separateBarColors ? 'none' : 'flex';
        if (wrapSeparate) wrapSeparate.style.display = activeConfig.separateBarColors ? 'grid' : 'none';
        updateStageColors();
      };
    }

    const bindColorPair = (picker, text, prop) => {
      if (!picker || !text) return;
      picker.oninput = (e) => {
        text.value = e.target.value;
        activeConfig[prop] = e.target.value;
        updateStageColors();
      };
      text.oninput = (e) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
          picker.value = e.target.value;
          activeConfig[prop] = e.target.value;
          updateStageColors();
        }
      };
    };

    bindColorPair(pickerBar, textBar, 'barColor');
    bindColorPair(pickerTop, textTop, 'topBarColor');
    bindColorPair(pickerBottom, textBottom, 'bottomBarColor');

    // Preset color pills
    container.querySelectorAll('.jcl-color-preset-pill').forEach(btn => {
      btn.onclick = () => {
        const c = btn.dataset.color || '#000000';
        activeConfig.barColor = c;
        activeConfig.topBarColor = c;
        activeConfig.bottomBarColor = c;
        if (pickerBar) pickerBar.value = c;
        if (textBar) textBar.value = c;
        if (pickerTop) pickerTop.value = c;
        if (textTop) textTop.value = c;
        if (pickerBottom) pickerBottom.value = c;
        if (textBottom) textBottom.value = c;
        updateStageColors();
      };
    });

    // Bar Height Slider & Presets
    const sliderBarH = container.querySelector('#jcl-slider-bar-height');
    const valBarH = container.querySelector('#jcl-val-bar-height');

    const updateBarHeight = (pct) => {
      activeConfig.barHeightPercent = pct;
      if (valBarH) valBarH.textContent = pct + '%';
      if (sliderBarH) sliderBarH.value = pct;
      const topBarEl = stage?.querySelector('#jcl-top-bar');
      const bottomBarEl = stage?.querySelector('#jcl-bottom-bar');
      const ratioTag = stage?.querySelector('#jcl-top-ratio-tag');
      if (topBarEl) topBarEl.style.height = `${pct}%`;
      if (bottomBarEl) bottomBarEl.style.height = `${pct + 1.5}%`;
      if (ratioTag) ratioTag.textContent = `${pct}%`;
      persistConfig();
    };

    if (sliderBarH) {
      sliderBarH.oninput = (e) => updateBarHeight(parseInt(e.target.value, 10));
    }

    container.querySelectorAll('.jcl-ratio-btn').forEach(btn => {
      btn.onclick = () => updateBarHeight(parseInt(btn.dataset.pct, 10));
    });

    // 3. Media Placement & Drag Controls
    const sliderScale = container.querySelector('#jcl-slider-scale');
    const valScale = container.querySelector('#jcl-val-scale');
    const sliderX = container.querySelector('#jcl-slider-pos-x');
    const valX = container.querySelector('#jcl-val-pos-x');
    const sliderY = container.querySelector('#jcl-slider-pos-y');
    const valY = container.querySelector('#jcl-val-pos-y');
    const resetPosBtn = container.querySelector('#jcl-btn-reset-pos');

    if (sliderScale) {
      sliderScale.oninput = (e) => {
        activeConfig.mediaScale = parseFloat(e.target.value);
        if (valScale) valScale.textContent = Math.round(activeConfig.mediaScale * 100) + '%';
        updateMediaTransform(stage);
        persistConfig();
      };
    }

    if (sliderX) {
      sliderX.oninput = (e) => {
        activeConfig.mediaX = parseInt(e.target.value, 10);
        if (valX) valX.textContent = activeConfig.mediaX + 'px';
        updateMediaTransform(stage);
        persistConfig();
      };
    }

    if (sliderY) {
      sliderY.oninput = (e) => {
        activeConfig.mediaY = parseInt(e.target.value, 10);
        if (valY) valY.textContent = activeConfig.mediaY + 'px';
        updateMediaTransform(stage);
        persistConfig();
      };
    }

    if (resetPosBtn) {
      resetPosBtn.onclick = () => {
        activeConfig.mediaX = 0;
        activeConfig.mediaY = 0;
        activeConfig.mediaScale = 1.0;
        if (sliderX) sliderX.value = 0;
        if (valX) valX.textContent = '0px';
        if (sliderY) sliderY.value = 0;
        if (valY) valY.textContent = '0px';
        if (sliderScale) sliderScale.value = 1.0;
        if (valScale) valScale.textContent = '100%';
        updateMediaTransform(stage);
        persistConfig();
      };
    }

    // 4. Caption Text & Typography
    const inpCaption = container.querySelector('#jcl-input-caption-text');
    const sliderFontSize = container.querySelector('#jcl-slider-font-size');
    const valFontSize = container.querySelector('#jcl-val-font-size');
    const pickerTextColor = container.querySelector('#jcl-picker-text-color');
    const textTextColor = container.querySelector('#jcl-text-text-color');
    const selectFont = container.querySelector('#jcl-select-font');
    const sliderSpacing = container.querySelector('#jcl-slider-spacing');
    const valSpacing = container.querySelector('#jcl-val-spacing');

    const updateCaptionStyle = () => {
      const captionEl = stage?.querySelector('#jcl-caption-text');
      if (captionEl) {
        captionEl.innerText = activeConfig.captionText || '';
        captionEl.style.fontSize = `${activeConfig.captionSize}px`;
        captionEl.style.color = activeConfig.captionColor || '#ffffff';
        captionEl.style.fontFamily = activeConfig.captionFont;
        captionEl.style.letterSpacing = `${activeConfig.captionLetterSpacing}px`;
      }
      persistConfig();
    };

    if (inpCaption) {
      inpCaption.oninput = (e) => {
        activeConfig.captionText = e.target.value;
        const captionEl = stage?.querySelector('#jcl-caption-text');
        if (captionEl) captionEl.innerText = activeConfig.captionText;
        persistConfig();
      };
    }

    if (sliderFontSize) {
      sliderFontSize.oninput = (e) => {
        activeConfig.captionSize = parseInt(e.target.value, 10);
        if (valFontSize) valFontSize.textContent = activeConfig.captionSize + 'px';
        updateCaptionStyle();
      };
    }

    bindColorPair(pickerTextColor, textTextColor, 'captionColor');

    if (selectFont) {
      selectFont.onchange = (e) => {
        activeConfig.captionFont = e.target.value;
        if (inpCaption) inpCaption.style.fontFamily = activeConfig.captionFont;
        updateCaptionStyle();
      };
    }

    if (sliderSpacing) {
      sliderSpacing.oninput = (e) => {
        activeConfig.captionLetterSpacing = parseFloat(e.target.value);
        if (valSpacing) valSpacing.textContent = activeConfig.captionLetterSpacing + 'px';
        updateCaptionStyle();
      };
    }

    // 5. Branding Badges & Film Grain
    const checkChannel = container.querySelector('#jcl-check-channel-tag');
    const inpChannel = container.querySelector('#jcl-input-channel-tag');
    const checkAction = container.querySelector('#jcl-check-action-tag');
    const inpAction = container.querySelector('#jcl-input-action-tag');
    const checkGrain = container.querySelector('#jcl-check-grain');
    const checkMotion = container.querySelector('#jcl-check-motion');

    if (checkChannel) {
      checkChannel.onchange = (e) => {
        activeConfig.showChannelTag = e.target.checked;
        const tagEl = stage?.querySelector('#jcl-channel-tag');
        if (tagEl) tagEl.style.display = activeConfig.showChannelTag ? 'block' : 'none';
        persistConfig();
      };
    }

    if (inpChannel) {
      inpChannel.oninput = (e) => {
        activeConfig.channelTagText = e.target.value;
        const tagEl = stage?.querySelector('#jcl-channel-tag');
        if (tagEl) tagEl.textContent = activeConfig.channelTagText;
        persistConfig();
      };
    }

    if (checkAction) {
      checkAction.onchange = (e) => {
        activeConfig.showActionTag = e.target.checked;
        const tagEl = stage?.querySelector('#jcl-action-tag');
        if (tagEl) tagEl.style.display = activeConfig.showActionTag ? 'block' : 'none';
        persistConfig();
      };
    }

    if (inpAction) {
      inpAction.oninput = (e) => {
        activeConfig.actionTagText = e.target.value;
        const tagEl = stage?.querySelector('#jcl-action-tag');
        if (tagEl) tagEl.textContent = activeConfig.actionTagText;
        persistConfig();
      };
    }

    if (checkGrain) {
      checkGrain.onchange = (e) => {
        activeConfig.grainOverlay = e.target.checked;
        const grainEl = stage?.querySelector('#jcl-film-grain');
        if (grainEl) grainEl.style.opacity = activeConfig.grainOverlay ? activeConfig.grainOpacity : 0;
        persistConfig();
      };
    }

    if (checkMotion) {
      checkMotion.onchange = (e) => {
        activeConfig.cameraMotion = e.target.checked ? 'slow-push' : 'static';
        persistConfig();
      };
    }
  }

  /**
   * Universal Canvas Renderer for Timeline Frame Playback
   * Can be invoked directly during studio timeline playback to draw the letterbox matte bars & caption
   */
  window.renderJaniCinematicLetterboxCanvasFrame = function(ctx, w, h, clip, timeElapsed) {
    if (!ctx) return;
    const cfg = Object.assign({}, DEFAULT_CONFIG, clip?.letterboxConfig || {});
    const barH = (cfg.barHeightPercent || 14) / 100 * h;
    const topColor = cfg.separateBarColors ? (cfg.topBarColor || '#000000') : (cfg.barColor || '#000000');
    const bottomColor = cfg.separateBarColors ? (cfg.bottomBarColor || '#000000') : (cfg.barColor || '#000000');

    // 1. Draw Top Matte Bar
    ctx.save();
    ctx.fillStyle = topColor;
    ctx.fillRect(0, 0, w, barH);
    ctx.restore();

    // 2. Draw Bottom Matte Bar
    ctx.save();
    const bottomH = barH * 1.1;
    const bottomY = h - bottomH;
    ctx.fillStyle = bottomColor;
    ctx.fillRect(0, bottomY, w, bottomH);

    // 3. Draw Bottom Caption Text
    if (cfg.captionText) {
      const fontSize = Math.round((cfg.captionSize || 28) * (h / 720));
      ctx.font = `700 ${fontSize}px ${cfg.captionFont || 'Oswald, sans-serif'}`;
      ctx.fillStyle = cfg.captionColor || '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = w / 2;
      const textY = bottomY + (bottomH / 2);
      ctx.fillText(cfg.captionUppercase ? cfg.captionText.toUpperCase() : cfg.captionText, textX, textY);
    }

    // 4. Draw Left Channel Tag (JANi)
    if (cfg.showChannelTag && cfg.channelTagText) {
      const channelSize = Math.round(18 * (h / 720));
      ctx.font = `800 ${channelSize}px 'Oswald', 'Bebas Neue', 'Impact', sans-serif`;
      ctx.fillStyle = cfg.channelTagColor || 'rgba(255, 255, 255, 0.45)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(cfg.channelTagText.toUpperCase(), 28 * (w / 1280), h - (12 * (h / 720)));
    }

    // 5. Draw Right Action Tag (SUBSCRIBE)
    if (cfg.showActionTag && cfg.actionTagText) {
      const actionSize = Math.round(9 * (h / 720));
      ctx.font = `800 ${actionSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = cfg.actionTagColor || 'rgba(255, 255, 255, 0.55)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(cfg.actionTagText.toUpperCase(), w - (28 * (w / 1280)), h - (14 * (h / 720)));
    }

    ctx.restore();
  };

  /**
   * Helper to build timeline clips when user commits/applies template
   */
  window.tplJaniCinematicLetterboxMakeClips = function(scTpl, sceneStart, dur, opts) {
    const cfg = getConfig();
    const mediaUrl = opts.prim || cfg.mediaUrl || DEFAULT_IMAGE;
    const isVid = cfg.mediaType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl);

    // Media Clip in the middle
    const mediaClip = {
      id: `clip-media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: isVid ? 'Cinematic_Footage.mp4' : 'Cinematic_Portrait.png',
      url: mediaUrl,
      file: { name: isVid ? 'Cinematic_Footage.mp4' : 'Cinematic_Portrait.png', url: mediaUrl, isVideo: isVid, isImage: !isVid },
      start: sceneStart,
      duration: dur,
      scale: cfg.mediaScale || 1.0,
      x: cfg.mediaX || 0,
      y: cfg.mediaY || 0,
      soundEnabled: true,
      volume: 100,
      cinematicLetterbox: true,
      letterboxConfig: Object.assign({}, cfg),
      zIndex: 15
    };

    // Subtitle Text Clip in the bottom matte space
    const captionClip = {
      id: `clip-text-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      start: sceneStart,
      duration: dur,
      text: cfg.captionText || 'SPUN OVER THE COURSE OF A FEW YEARS.',
      highlight: '',
      fontFamily: cfg.captionFont || 'Oswald, sans-serif',
      fontSize: cfg.captionSize || 32,
      textColor: cfg.captionColor || '#ffffff',
      highlightColor: '#ff334b',
      anim: cfg.captionAnim || 'pop',
      sfx: 'whoosh',
      position: 'bottom',
      y: 280, // Positioned inside the bottom letterbox bar
      letterSpacing: cfg.captionLetterSpacing || 2.5,
      zIndex: 35,
      layerOrder: 'front'
    };

    return {
      imageClips: isVid ? [] : [mediaClip],
      videoClips: isVid ? [mediaClip] : [],
      textClips: [captionClip],
      focusClip: mediaClip
    };
  };

})();
