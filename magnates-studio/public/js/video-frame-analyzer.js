/**
 * Regaarder Studio — Frame-by-Frame Video Deconstructor & Motion Analyzer
 * Launches inside the unified Regaarder Motion Studio (openTopTemplateCustomizer)
 * with a centered Import Video dropzone in the preview stage, frame-by-frame stepping,
 * deterministic cut/flash/camera-motion/color analysis, frame extraction, and
 * asset-replacement / timeline-recipe cloning.
 */
(function () {
  'use strict';

  const ANALYZER_TPL = {
    id: 'import-video-analyzer',
    title: 'Import & Analyze Video',
    category: '3D Spatial',
    origCategory: '3D Spatial',
    badge: 'VIDEO DECONSTRUCTOR',
    difficulty: 'Pro Suite',
    timeToApply: 'Frame-by-Frame',
    previewGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(7, 9, 14, 0.98))',
    description: 'Import any reference video to inspect frame-by-frame, detect cuts, flashes, and camera motion deterministically, extract frames/cutouts, and copy the motion recipe onto your own assets.',
    tags: ['Import Video', 'Frame-by-Frame', 'Motion Detection', 'Transition Detector', 'Cutout & Replace']
  };

  const state = {
    videoUrl: '',
    fileName: '',
    duration: 0,
    fps: 30,
    playbackRate: 1.0,
    currentTime: 0,
    isPlaying: false,
    isAnalyzing: false,
    progress: 0,
    analysis: null, // { duration, fps, sampleCount, cuts, flashes, fades, motion, color, timelineBeats }
    extractedAssets: {
      foreground: '',
      background: '',
      reference: ''
    },
    previewMode: 'source' // 'source' | 'replacement'
  };

  let videoEl = null;
  let rafId = null;

  function formatTimeMs(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  }

  function currentFrameIndex() {
    return Math.max(0, Math.round(state.currentTime * state.fps));
  }

  function totalFramesCount() {
    return Math.max(1, Math.round(state.duration * state.fps));
  }

  function stepFrame(delta) {
    if (!videoEl || !state.duration) return;
    pauseVideo();
    const step = 1 / state.fps;
    const next = Math.max(0, Math.min(state.duration, videoEl.currentTime + delta * step));
    videoEl.currentTime = next;
    state.currentTime = next;
    syncStageHUD();
  }

  function seekToTime(sec) {
    if (!videoEl || !state.duration) return;
    const clamped = Math.max(0, Math.min(state.duration, sec));
    videoEl.currentTime = clamped;
    state.currentTime = clamped;
    syncStageHUD();
  }

  function togglePlay() {
    if (!videoEl || !state.duration) return;
    if (videoEl.paused) {
      videoEl.playbackRate = state.playbackRate;
      videoEl.play().catch(() => {});
      state.isPlaying = true;
      startSyncLoop();
    } else {
      pauseVideo();
    }
    syncStageHUD();
  }

  function pauseVideo() {
    if (videoEl && !videoEl.paused) videoEl.pause();
    state.isPlaying = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startSyncLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    const tick = () => {
      if (!videoEl || videoEl.paused) {
        state.isPlaying = false;
        syncStageHUD();
        return;
      }
      state.currentTime = videoEl.currentTime;
      syncStageHUD();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function syncStageHUD() {
    const frameLabel = document.getElementById('vfa-frame-counter');
    const timeLabel = document.getElementById('vfa-time-counter');
    const scrub = document.getElementById('vfa-scrub-range');
    const playBtn = document.getElementById('vfa-btn-play');
    if (frameLabel) frameLabel.textContent = `FRAME ${currentFrameIndex()} / ${totalFramesCount()}`;
    if (timeLabel) timeLabel.textContent = `${formatTimeMs(state.currentTime)} / ${formatTimeMs(state.duration)}`;
    if (scrub && state.duration > 0) {
      scrub.value = String((state.currentTime / state.duration) * 1000);
    }
    if (playBtn) playBtn.textContent = state.isPlaying ? '⏸ Pause' : '▶ Play';
  }

  // Deterministic frame-by-frame analysis using an offscreen 64x36 canvas
  async function analyzeImportedVideo() {
    if (!state.videoUrl || state.isAnalyzing) return null;
    state.isAnalyzing = true;
    state.progress = 0;
    updateAnalyzerStatusUI('Analyzing frames deterministically...');

    const probe = document.createElement('video');
    probe.src = state.videoUrl;
    probe.muted = true;
    probe.playsInline = true;
    probe.preload = 'auto';

    await new Promise((resolve, reject) => {
      probe.onloadedmetadata = resolve;
      probe.onerror = reject;
    });

    const duration = probe.duration || state.duration || 1;
    const W = 64;
    const H = 36;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Sample up to 90 evenly spaced frames (or ~10 fps for short clips)
    const sampleCount = Math.min(90, Math.max(12, Math.round(duration * 8)));
    const dt = duration / sampleCount;

    let prevData = null;
    let prevLuma = 0;
    const cuts = [];
    const flashes = [];
    const fades = [];
    const motionSamples = [];

    let sumBright = 0;
    let sumSat = 0;
    let sumCenterLuma = 0;
    let sumEdgeLuma = 0;

    for (let i = 0; i < sampleCount; i++) {
      const t = Math.min(duration - 0.01, i * dt);
      probe.currentTime = t;
      await new Promise((res) => {
        const onSeeked = () => {
          probe.removeEventListener('seeked', onSeeked);
          res();
        };
        probe.addEventListener('seeked', onSeeked);
      });

      ctx.drawImage(probe, 0, 0, W, H);
      const img = ctx.getImageData(0, 0, W, H).data;

      let lumaSum = 0;
      let satSum = 0;
      let centerLuma = 0;
      let centerCount = 0;
      let edgeLuma = 0;
      let edgeCount = 0;

      // Centroid of bright features for coarse Pan X/Y estimation
      let cxWeight = 0;
      let cyWeight = 0;
      let totalWeight = 0;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = (y * W + x) * 4;
          const r = img[idx], g = img[idx + 1], b = img[idx + 2];
          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const sat = maxC > 0 ? (maxC - minC) / maxC : 0;

          lumaSum += luma;
          satSum += sat;

          const inCenter = x >= W * 0.25 && x <= W * 0.75 && y >= H * 0.25 && y <= H * 0.75;
          if (inCenter) {
            centerLuma += luma;
            centerCount++;
          } else {
            edgeLuma += luma;
            edgeCount++;
          }

          cxWeight += x * luma;
          cyWeight += y * luma;
          totalWeight += luma;
        }
      }

      const avgLuma = lumaSum / (W * H);
      const avgSat = satSum / (W * H);
      const cLuma = centerLuma / Math.max(1, centerCount);
      const eLuma = edgeLuma / Math.max(1, edgeCount);
      sumBright += avgLuma;
      sumSat += avgSat;
      sumCenterLuma += cLuma;
      sumEdgeLuma += eLuma;

      const cx = totalWeight > 0 ? cxWeight / totalWeight : W / 2;
      const cy = totalWeight > 0 ? cyWeight / totalWeight : H / 2;

      let mad = 0;
      let panDx = 0;
      let panDy = 0;
      let zoomDelta = 0;

      if (prevData) {
        let diffSum = 0;
        let radialOutward = 0;
        for (let p = 0; p < img.length; p += 4) {
          diffSum += Math.abs(img[p] - prevData.img[p]) + Math.abs(img[p + 1] - prevData.img[p + 1]) + Math.abs(img[p + 2] - prevData.img[p + 2]);
        }
        mad = diffSum / (W * H * 3); // 0..255
        panDx = cx - prevData.cx;
        panDy = cy - prevData.cy;
        // Edge-vs-center luma change approximates zoom/push-in activity
        zoomDelta = (eLuma - prevData.eLuma) - (cLuma - prevData.cLuma);
        radialOutward = Math.abs(zoomDelta);

        const lumaJump = avgLuma - prevLuma;
        const frameNum = Math.round(t * state.fps);

        if (lumaJump > 32 && avgLuma > 165) {
          flashes.push({ time: Number(t.toFixed(3)), frame: frameNum, intensity: Number((lumaJump / 255).toFixed(2)) });
        } else if (mad > 28) {
          cuts.push({ time: Number(t.toFixed(3)), frame: frameNum, delta: Number(mad.toFixed(1)) });
        } else if (mad > 10 && Math.abs(lumaJump) > 8) {
          fades.push({ time: Number(t.toFixed(3)), frame: frameNum, direction: lumaJump > 0 ? 'in' : 'out' });
        }

        motionSamples.push({
          time: Number(t.toFixed(3)),
          frame: frameNum,
          mad: Number(mad.toFixed(2)),
          panX: Number(panDx.toFixed(3)),
          panY: Number(panDy.toFixed(3)),
          zoomSignal: Number(radialOutward.toFixed(2))
        });
      }

      prevData = { img: new Uint8ClampedArray(img), cx, cy, eLuma, cLuma };
      prevLuma = avgLuma;
      state.progress = Math.round(((i + 1) / sampleCount) * 100);
      updateAnalyzerStatusUI(`Analyzing frames (${state.progress}%)...`);
    }

    const avgBrightness = sumBright / sampleCount;
    const avgSaturation = sumSat / sampleCount;
    const vignetteRatio = sumEdgeLuma / Math.max(1, sumCenterLuma);

    // Aggregate camera motion summary
    const avgPanX = motionSamples.reduce((a, m) => a + m.panX, 0) / Math.max(1, motionSamples.length);
    const avgPanY = motionSamples.reduce((a, m) => a + m.panY, 0) / Math.max(1, motionSamples.length);
    const avgMotion = motionSamples.reduce((a, m) => a + m.mad, 0) / Math.max(1, motionSamples.length);
    const peakMotion = motionSamples.reduce((a, m) => Math.max(a, m.mad), 0);

    const timelineBeats = [
      ...cuts.map(c => ({ type: 'Hard Cut', time: c.time, frame: c.frame, detail: `Δ ${c.delta}` })),
      ...flashes.map(f => ({ type: 'White Flash', time: f.time, frame: f.frame, detail: `Luma +${Math.round(f.intensity * 100)}%` })),
      ...fades.slice(0, 6).map(fd => ({ type: `Fade ${fd.direction}`, time: fd.time, frame: fd.frame, detail: 'Gradual' }))
    ].sort((a, b) => a.time - b.time);

    state.analysis = {
      fileName: state.fileName,
      duration: Number(duration.toFixed(3)),
      fps: state.fps,
      sampleCount,
      cuts,
      flashes,
      fades,
      timelineBeats,
      motion: {
        avgPanX: Number(avgPanX.toFixed(3)),
        avgPanY: Number(avgPanY.toFixed(3)),
        avgIntensity: Number(avgMotion.toFixed(2)),
        peakIntensity: Number(peakMotion.toFixed(2)),
        cameraStyle: peakMotion > 22 ? 'Dynamic / Snap Cuts' : avgMotion > 6 ? 'Smooth Push / Drift' : 'Locked / Subtle',
        samples: motionSamples
      },
      color: {
        brightness: Number((avgBrightness / 255).toFixed(2)),
        saturation: Number(avgSaturation.toFixed(2)),
        vignetteStrength: Number(Math.max(0, 1 - vignetteRatio).toFixed(2)),
        gradePreset: avgSaturation < 0.25 ? 'Deep Monochromatic / Noir' : avgBrightness < 85 ? 'Dark Financial Thriller' : 'Cinematic Standard'
      }
    };

    state.isAnalyzing = false;
    state.progress = 100;
    renderStageMarkers();
    renderInspectorSummary();
    updateAnalyzerStatusUI(`Analysis complete: ${cuts.length} cuts, ${flashes.length} flashes, ${motionSamples.length} motion samples`);
    return state.analysis;
  }

  function updateAnalyzerStatusUI(text) {
    const el = document.getElementById('vfa-status-pill');
    if (el) el.textContent = text;
  }

  function renderStageMarkers() {
    const markerHost = document.getElementById('vfa-beat-markers');
    if (!markerHost || !state.analysis || !state.duration) return;
    markerHost.innerHTML = state.analysis.timelineBeats.map(b => {
      const pct = Math.min(99, Math.max(0, (b.time / state.duration) * 100));
      const color = b.type === 'White Flash' ? '#fbbf24' : b.type === 'Hard Cut' ? '#f43f5e' : '#38bdf8';
      return `<button type="button" title="${b.type} @ ${formatTimeMs(b.time)} (F${b.frame})" onclick="window.RegaarderVideoAnalyzer.seekToTime(${b.time})" style="position:absolute;left:${pct}%;top:0;bottom:0;width:3px;transform:translateX(-50%);background:${color};border:none;padding:0;cursor:pointer;border-radius:2px;"></button>`;
    }).join('');
  }

  function extractCurrentFrame(role) {
    if (!videoEl || !videoEl.videoWidth) return null;
    const c = document.createElement('canvas');
    c.width = videoEl.videoWidth;
    c.height = videoEl.videoHeight;
    c.getContext('2d').drawImage(videoEl, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL('image/png');
    state.extractedAssets[role || 'reference'] = dataUrl;
    if (role === 'cutout' && window.RegaarderAssetWorkbench && typeof window.RegaarderAssetWorkbench.openCutout === 'function') {
      // Also make available in Asset Workbench if user wants manual/AI cutout refinement
      if (typeof window.showTextTimingAlert === 'function') {
        window.showTextTimingAlert(`Captured Frame #${currentFrameIndex()} as ${role} asset!`, 'success');
      }
    } else if (typeof window.showTextTimingAlert === 'function') {
      window.showTextTimingAlert(`Extracted Frame #${currentFrameIndex()} (${formatTimeMs(state.currentTime)}) as ${role || 'reference'}!`, 'success');
    }
    renderInspectorSummary();
    return dataUrl;
  }

  function applyRecipeToTimeline() {
    if (!state.analysis) return;
    const fgUrl = state.extractedAssets.foreground || state.extractedAssets.reference || '';
    const bgUrl = state.extractedAssets.background || state.extractedAssets.reference || '';
    if (typeof window.timelineClips === 'object' && window.timelineClips && Array.isArray(window.timelineClips.image)) {
      const clip = {
        id: `vfa-recipe-${Date.now()}`,
        name: `${state.fileName || 'Analyzed_Clip'} (Motion Clone)`,
        url: fgUrl || bgUrl || state.videoUrl,
        start: 0,
        duration: Math.max(3, Math.min(15, state.duration || 6)),
        scale: state.analysis.motion.avgIntensity > 8 ? 1.15 : 1.05,
        zoomEffect: state.analysis.flashes.length > 0 ? 'snap' : 'smooth',
        zoomScale: state.analysis.motion.peakIntensity > 20 ? 1.32 : 1.18,
        transition: state.analysis.flashes.length > 0 ? 'flash_cut' : 'cut'
      };
      window.timelineClips.image.push(clip);
      if (typeof window.renderAllTimelineTracks === 'function') window.renderAllTimelineTracks();
      if (typeof window.selectClip === 'function') window.selectClip(clip, 'image');
    }
    if (typeof window.showTextTimingAlert === 'function') {
      window.showTextTimingAlert('Copied detected motion & transition recipe to Timeline!', 'success');
    }
  }

  function handleFileImport(file) {
    if (!file) return;
    if (state.videoUrl && state.videoUrl.startsWith('blob:')) {
      try { URL.revokeObjectURL(state.videoUrl); } catch (_) {}
    }
    state.videoUrl = URL.createObjectURL(file);
    state.fileName = file.name;
    state.currentTime = 0;
    state.analysis = null;
    state.isPlaying = false;
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (stage) mountStage(stage);
  }

  function mountStage(stage) {
    if (!stage) return;
    if (!state.videoUrl) {
      // Centered Import Video dropzone inside the standard preview stage
      stage.innerHTML = `
        <div id="vfa-dropzone" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at center, rgba(30,41,59,0.55) 0%, #07090e 100%);padding:24px;text-align:center;">
          <div style="max-width:440px;width:100%;padding:28px 24px;border-radius:14px;border:1.5px dashed rgba(139,92,246,0.55);background:rgba(15,23,42,0.72);backdrop-filter:blur(10px);box-shadow:0 20px 50px rgba(0,0,0,0.65);">
            <div style="width:48px;height:48px;margin:0 auto 12px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#2563eb);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;box-shadow:0 8px 20px rgba(124,58,237,0.4);">🎬</div>
            <div style="font-size:15px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">Import Video for Frame-by-Frame Analysis</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:6px;line-height:1.45;">Drop an MP4, MOV, or WebM here — inspect frame by frame, detect cuts, flashes &amp; camera motion, extract cutouts, and copy the animation to your own assets.</div>
            <label style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:9px 18px;border-radius:8px;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(139,92,246,0.45);">
              <span>+ Choose Video File</span>
              <input id="vfa-file-input" type="file" accept="video/*" style="display:none;" />
            </label>
          </div>
        </div>
      `;
      const input = document.getElementById('vfa-file-input');
      const dz = document.getElementById('vfa-dropzone');
      if (input) {
        input.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) handleFileImport(e.target.files[0]);
        });
      }
      if (dz) {
        dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.style.outline = '2px solid #8b5cf6'; });
        dz.addEventListener('dragleave', () => { dz.style.outline = 'none'; });
        dz.addEventListener('drop', (e) => {
          e.preventDefault();
          dz.style.outline = 'none';
          const f = e.dataTransfer?.files?.[0];
          if (f && f.type.startsWith('video/')) handleFileImport(f);
        });
      }
      renderInspectorSummary();
      return;
    }

    stage.innerHTML = `
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;background:#05070b;">
        <div style="position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <video id="vfa-video-player" src="${state.videoUrl}" playsinline muted style="max-width:100%;max-height:100%;object-fit:contain;"></video>
          <div id="vfa-status-pill" style="position:absolute;top:10px;left:12px;padding:4px 10px;border-radius:999px;background:rgba(15,23,42,0.86);border:1px solid rgba(139,92,246,0.45);color:#e2e8f0;font-size:11px;font-weight:600;backdrop-filter:blur(6px);">Loading video...</div>
          <label style="position:absolute;top:10px;right:12px;padding:4px 10px;border-radius:6px;background:rgba(15,23,42,0.86);border:1px solid rgba(255,255,255,0.16);color:#cbd5e1;font-size:11px;font-weight:600;cursor:pointer;">
            Replace Video
            <input id="vfa-replace-input" type="file" accept="video/*" style="display:none;" />
          </label>
        </div>
        <div style="padding:8px 12px;background:rgba(10,13,20,0.96);border-top:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:6px;">
          <div style="position:relative;height:14px;display:flex;align-items:center;">
            <div id="vfa-beat-markers" style="position:absolute;inset:3px 0;pointer-events:auto;z-index:2;"></div>
            <input id="vfa-scrub-range" type="range" min="0" max="1000" value="0" style="width:100%;position:relative;z-index:1;accent-color:#8b5cf6;cursor:pointer;" />
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;">
              <button type="button" id="vfa-btn-prev-frame" style="padding:4px 8px;border-radius:5px;background:#1e293b;border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;font-size:11px;font-weight:700;cursor:pointer;">◀ Prev Frame</button>
              <button type="button" id="vfa-btn-play" style="padding:4px 10px;border-radius:5px;background:#7c3aed;border:none;color:#fff;font-size:11px;font-weight:700;cursor:pointer;">▶ Play</button>
              <button type="button" id="vfa-btn-next-frame" style="padding:4px 8px;border-radius:5px;background:#1e293b;border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;font-size:11px;font-weight:700;cursor:pointer;">Next Frame ▶</button>
            </div>
            <div style="display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#cbd5e1;">
              <span id="vfa-frame-counter">FRAME 0 / 1</span>
              <span id="vfa-time-counter">00:00.000 / 00:00.000</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <select id="vfa-speed-select" style="background:#0f172a;color:#e2e8f0;border:1px solid rgba(255,255,255,0.14);border-radius:5px;padding:3px 6px;font-size:11px;">
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="1" selected>1.0x</option>
              </select>
              <select id="vfa-fps-select" style="background:#0f172a;color:#e2e8f0;border:1px solid rgba(255,255,255,0.14);border-radius:5px;padding:3px 6px;font-size:11px;">
                <option value="24">24 fps</option>
                <option value="30" selected>30 fps</option>
                <option value="60">60 fps</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;

    videoEl = document.getElementById('vfa-video-player');
    if (videoEl) {
      videoEl.onloadedmetadata = () => {
        state.duration = videoEl.duration || 0;
        syncStageHUD();
        analyzeImportedVideo();
      };
      videoEl.onended = () => {
        state.isPlaying = false;
        syncStageHUD();
      };
    }

    document.getElementById('vfa-replace-input')?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleFileImport(e.target.files[0]);
    });
    document.getElementById('vfa-btn-prev-frame')?.addEventListener('click', () => stepFrame(-1));
    document.getElementById('vfa-btn-next-frame')?.addEventListener('click', () => stepFrame(1));
    document.getElementById('vfa-btn-play')?.addEventListener('click', togglePlay);
    document.getElementById('vfa-scrub-range')?.addEventListener('input', (e) => {
      if (!state.duration) return;
      pauseVideo();
      seekToTime((Number(e.target.value) / 1000) * state.duration);
    });
    document.getElementById('vfa-speed-select')?.addEventListener('change', (e) => {
      state.playbackRate = Number(e.target.value) || 1;
      if (videoEl) videoEl.playbackRate = state.playbackRate;
    });
    document.getElementById('vfa-fps-select')?.addEventListener('change', (e) => {
      state.fps = Number(e.target.value) || 30;
      syncStageHUD();
    });

    renderStageMarkers();
    renderInspectorSummary();
  }

  function renderInspectorSummary() {
    const host = document.getElementById('tpl-modal-inspector');
    if (!host) return;
    let panel = document.getElementById('vfa-inspector-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'vfa-inspector-panel';
      panel.style.cssText = 'padding:12px;display:flex;flex-direction:column;gap:10px;';
      host.prepend(panel);
    }

    if (!state.videoUrl) {
      panel.innerHTML = `
        <div style="padding:12px;border-radius:10px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:12px;font-weight:700;color:#f8fafc;">Video Deconstructor Ready</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:4px;line-height:1.45;">Import a video in the center preview stage to unlock frame-by-frame stepping, cut/flash detection, camera motion curves, frame extraction, and asset replacement.</div>
        </div>
      `;
      return;
    }

    const a = state.analysis;
    const beatsHtml = a && a.timelineBeats.length
      ? a.timelineBeats.slice(0, 18).map(b => `
          <button type="button" onclick="window.RegaarderVideoAnalyzer.seekToTime(${b.time})" style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:5px 8px;border-radius:6px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-size:11px;cursor:pointer;text-align:left;">
            <span><strong>${b.type}</strong> <span style="color:#94a3b8;">F${b.frame}</span></span>
            <span style="font-family:monospace;color:#a78bfa;">${formatTimeMs(b.time)}</span>
          </button>
        `).join('')
      : `<div style="font-size:11px;color:#64748b;">${state.isAnalyzing ? 'Scanning frames...' : 'No major cuts/flashes detected yet.'}</div>`;

    panel.innerHTML = `
      <div style="padding:10px;border-radius:10px;background:rgba(15,23,42,0.75);border:1px solid rgba(139,92,246,0.28);display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:11.5px;font-weight:800;color:#f8fafc;">Detected Motion &amp; Look</span>
          <button type="button" onclick="window.RegaarderVideoAnalyzer.analyze()" style="padding:3px 8px;border-radius:5px;background:#334155;border:none;color:#e2e8f0;font-size:10.5px;cursor:pointer;">Re-Analyze</button>
        </div>
        ${a ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;">
            <div style="padding:6px;border-radius:6px;background:rgba(2,6,23,0.6);"><div style="color:#94a3b8;font-size:10px;">Camera Style</div><div style="color:#f8fafc;font-weight:700;">${a.motion.cameraStyle}</div></div>
            <div style="padding:6px;border-radius:6px;background:rgba(2,6,23,0.6);"><div style="color:#94a3b8;font-size:10px;">Color Grade</div><div style="color:#f8fafc;font-weight:700;">${a.color.gradePreset}</div></div>
            <div style="padding:6px;border-radius:6px;background:rgba(2,6,23,0.6);"><div style="color:#94a3b8;font-size:10px;">Cuts / Flashes</div><div style="color:#f8fafc;font-weight:700;">${a.cuts.length} cuts · ${a.flashes.length} flashes</div></div>
            <div style="padding:6px;border-radius:6px;background:rgba(2,6,23,0.6);"><div style="color:#94a3b8;font-size:10px;">Pan Drift (X, Y)</div><div style="color:#f8fafc;font-weight:700;">${a.motion.avgPanX}, ${a.motion.avgPanY}</div></div>
          </div>
        ` : `<div style="font-size:11px;color:#94a3b8;">Analyzing ${state.fileName}...</div>`}
      </div>

      <div style="padding:10px;border-radius:10px;background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:6px;">
        <div style="font-size:11.5px;font-weight:800;color:#f8fafc;">Extract Current Frame &amp; Replace</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button type="button" onclick="window.RegaarderVideoAnalyzer.extractCurrentFrame('cutout')" style="padding:6px 8px;border-radius:6px;background:#1e293b;border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;font-size:11px;font-weight:600;cursor:pointer;">✂ Frame → Cutout</button>
          <button type="button" onclick="window.RegaarderVideoAnalyzer.extractCurrentFrame('background')" style="padding:6px 8px;border-radius:6px;background:#1e293b;border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;font-size:11px;font-weight:600;cursor:pointer;">🖼 Frame → Background</button>
        </div>
        <button type="button" onclick="window.RegaarderVideoAnalyzer.applyRecipeToTimeline()" style="width:100%;padding:8px;border-radius:7px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:none;color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;">⚡ Copy Motion &amp; Transitions to Timeline</button>
      </div>

      <div style="padding:10px;border-radius:10px;background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:6px;">
        <div style="font-size:11.5px;font-weight:800;color:#f8fafc;">Detected Cuts &amp; Transitions</div>
        <div style="display:flex;flex-direction:column;gap:4px;max-height:180px;overflow-y:auto;">${beatsHtml}</div>
      </div>
    `;
  }

  function open() {
    if (typeof window.openTopTemplateCustomizer === 'function') {
      window.openTopTemplateCustomizer(ANALYZER_TPL);
    }
  }

  window.openVideoAnalyzerStudio = open;
  window.RegaarderVideoAnalyzer = {
    open,
    mountStage,
    handleFileImport,
    stepFrame,
    seekToTime,
    togglePlay,
    analyze: analyzeImportedVideo,
    extractCurrentFrame,
    applyRecipeToTimeline,
    getAnalysis: () => state.analysis,
    exportRecipe: () => JSON.stringify(state.analysis || {}, null, 2)
  };
})();
