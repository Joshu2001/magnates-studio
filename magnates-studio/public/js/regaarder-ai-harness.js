/**
 * Regaarder Studio — Browser AI Agent Harness Bridge
 *
 * Exposes `window.RegaarderAIHarness` for direct programmatic control of every
 * client-side Studio feature (2D/2.5D/3D transforms, volume calibration, sculpt,
 * layers, contextual toolbar, timeline, workbench, and export), and optionally
 * polls `/api/ai/commands/pending` when remote AI control is active.
 */

(function () {
  let pollTimer = null;

  function executeClientTool(tool, args = {}) {
    switch (tool) {
      case 'switch_view': {
        if (typeof window.switchStudioView === 'function') {
          window.switchStudioView(args.view === 'editor' ? 'editor' : 'home');
          return { ok: true, view: args.view };
        }
        return { ok: false, error: 'switchStudioView unavailable' };
      }

      case 'open_workbench': {
        if (window.RegaarderAssetWorkbench?.open) {
          window.RegaarderAssetWorkbench.open(args.tab || 'registry', args.assetId || null);
          return { ok: true, tab: args.tab || 'registry' };
        }
        return { ok: false, error: 'RegaarderAssetWorkbench unavailable' };
      }

      case 'set_dimension_mode': {
        if (window.RegaarderDimensionTransform?.open) {
          window.RegaarderDimensionTransform.open(args.mode || '3d', args.src || '');
          return { ok: true, mode: args.mode || '3d' };
        }
        return { ok: false, error: 'RegaarderDimensionTransform unavailable' };
      }

      case 'calibrate_3d_volume': {
        const stage = document.getElementById('rg-dim-transform-stage');
        if (!stage) return { ok: false, error: 'Dimension transform overlay is not open' };
        const keys = ['depth', 'scale', 'rotX', 'rotY', 'roundness', 'centerline', 'vTaper', 'detailRelief', 'mirrorMode', 'shapePreset'];
        for (const k of keys) {
          if (args[k] === undefined) continue;
          const el = stage.querySelector(`[data-rg-dim="${k}"]`);
          if (el) {
            el.value = String(args[k]);
            el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
          }
        }
        if (typeof args.autoOrbit === 'boolean') {
          const orbitBtn = stage.querySelector('[data-rg-dim-orbit]');
          if (orbitBtn) orbitBtn.click();
        }
        return { ok: true, calibrated: true };
      }

      case 'seek_timeline': {
        if (typeof window.renderCustomizerFrameAtTime === 'function') {
          window.renderCustomizerFrameAtTime(Number(args.time) || 0);
          return { ok: true, time: Number(args.time) || 0 };
        }
        return { ok: false, error: 'renderCustomizerFrameAtTime unavailable' };
      }

      case 'play_pause': {
        if (window.topCustomizerState) {
          window.topCustomizerState.isPlaying = typeof args.playing === 'boolean'
            ? args.playing
            : !window.topCustomizerState.isPlaying;
          return { ok: true, isPlaying: window.topCustomizerState.isPlaying };
        }
        return { ok: false, error: 'topCustomizerState unavailable' };
      }

      case 'select_layer': {
        const el = document.querySelector(`[data-layer-id="${args.id}"], [data-n3d-obj="${args.id}"]`);
        if (el) {
          el.click();
          return { ok: true, selected: args.id };
        }
        return { ok: false, error: `Layer element not found: ${args.id}` };
      }

      case 'contextual_toolbar_action': {
        const tb = window.RegaarderContextualToolbar;
        if (!tb) return { ok: false, error: 'RegaarderContextualToolbar unavailable' };
        if (args.action === 'hide') { tb.hide?.(); return { ok: true }; }
        const btn = document.querySelector(`#rg-universal-contextual-toolbar [data-tool="${args.action}"], #rg-universal-contextual-toolbar [data-action="${args.action}"]`);
        if (btn) {
          btn.click();
          return { ok: true, action: args.action };
        }
        return { ok: false, error: `Toolbar action not found: ${args.action}` };
      }

      default:
        return { ok: false, error: `Unsupported client tool: ${tool}` };
    }
  }

  async function execute(tool, args = {}) {
    // Try client-side execution first if local; otherwise proxy to server /api/ai/execute
    const localRes = executeClientTool(tool, args);
    if (localRes.ok) return localRes;

    const resp = await fetch('/api/ai/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, args }),
    });
    return resp.json();
  }

  async function pollOnce() {
    try {
      const res = await fetch('/api/ai/commands/pending');
      if (!res.ok) return;
      const data = await res.json();
      for (const cmd of data.commands || []) {
        const out = executeClientTool(cmd.tool, cmd.args || {});
        await fetch(`/api/ai/commands/${encodeURIComponent(cmd.id)}/result`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ok: !!out.ok, result: out, error: out.error || null }),
        });
      }
    } catch (_) {}
  }

  function startBridgePolling(intervalMs = 1500) {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(pollOnce, intervalMs);
  }

  function stopBridgePolling() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  window.RegaarderAIHarness = {
    execute,
    executeClientTool,
    startBridgePolling,
    stopBridgePolling,
    getManifest: () => fetch('/api/ai/tools').then((r) => r.json()),
  };
})();
