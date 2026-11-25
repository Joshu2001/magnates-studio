/**
 * ============================================================================
 * REGAARDER STUDIO — STORYBOARD SKETCH & AI HARNESS
 * ============================================================================
 * Native Regaarder Motion UI (--rg-* design tokens) + window.RegaarderStoryboardAI:
 * - Unnested Start Screen (Draw or Batch Import)
 * - Circular Orbit Tool Wheel (Brush, Fill, Shapes, Eyedropper, Eraser, Color, Undo)
 * - Right Sidebar: Brush Thickness (px), Stroke Style (Solid/Dashed/Dotted/Straight),
 *   Layer Opacity, Scale, and Reference (Trace Only) toggle
 * - Area / Cell-Targeted Zoom up to 300%
 * - Vector Path Recording + SVG Export + Programmatic AI Harness
 * ============================================================================
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'regaarder-storyboard-v2';
  const TEMPLATES_KEY = 'regaarder-sketch-templates-v1';

  const ASPECT_RATIOS = {
    '16:9': { label: '16:9 YouTube', w: 960, h: 540 },
    '9:16': { label: '9:16 Shorts', w: 540, h: 960 },
    '1:1': { label: '1:1 Square', w: 720, h: 720 },
    '4:5': { label: '4:5 Portrait', w: 640, h: 800 }
  };

  const PALETTE = [
    '#F5F5F7', '#A1A1B0', '#0B0B0E', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#823CF0', '#ec4899'
  ];

  const SHAPE_TOOLS = [
    { id: 'line', label: 'Line', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5" stroke-linecap="round"/></svg>' },
    { id: 'rect', label: 'Rectangle', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>' },
    { id: 'circle', label: 'Circle', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>' },
    { id: 'triangle', label: 'Triangle', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,4 20,19 4,19" stroke-linejoin="round"/></svg>' },
    { id: 'arrow', label: 'Arrow', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5" stroke-linecap="round"/><polyline points="10,5 19,5 19,14" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'star', label: 'Star', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,3 14.9,8.9 21.4,9.8 16.7,14.4 17.8,20.8 12,17.8 6.2,20.8 7.3,14.4 2.6,9.8 9.1,8.9" stroke-linejoin="round"/></svg>' },
    { id: 'diamond', label: 'Diamond', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,3 21,12 12,21 3,12" stroke-linejoin="round"/></svg>' }
  ];

  const ICONS = {
    hub: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
    brush: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>',
    fill: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11l-8-8-8.6 8.6a2 2 0 000 2.8l5.2 5.2a2 2 0 002.8 0L19 11z"/><path d="M5 2l5 5"/><path d="M20 14s2 2.2 2 3.5a2 2 0 11-4 0c0-1.3 2-3.5 2-3.5z"/></svg>',
    shapes: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1.5"/><circle cx="16.5" cy="16.5" r="4.5"/><polygon points="16.5,3 21,10 12,10" stroke-linejoin="round"/></svg>',
    eyedropper: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 5l-3-3-3.5 3.5 1 1-9 9V19h3.5l9-9 1 1L19 5z"/></svg>',
    eraser: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 20H7L3 16a2 2 0 010-2.83L13.17 3a2 2 0 012.83 0L21 8a2 2 0 010 2.83L11.83 20"/></svg>',
    undo: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l5-5M3 10l5 5"/></svg>',
    zoomBox: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path stroke-dasharray="3 2" d="M4 4h11v11H4z"/><circle cx="15" cy="15" r="4"/><line x1="18" y1="18" x2="21" y2="21"/></svg>',
    eyeOn: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',
    drawHero: '<svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="8" width="36" height="32" rx="4" opacity="0.35"/><path stroke-linecap="round" stroke-linejoin="round" d="M31 13l4 4L18 34l-5 1 1-5 17-17z"/></svg>',
    importHero: '<svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="10" width="26" height="22" rx="3" opacity="0.35"/><rect x="14" y="16" width="28" height="22" rx="3"/><circle cx="23" cy="24" r="2.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 35l7-7 5 5 4-4 8 6"/></svg>'
  };

  let state = loadJson(STORAGE_KEY, { aspectRatio: '16:9', scenes: [] });
  let savedTemplates = loadJson(TEMPLATES_KEY, []);

  function loadJson(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  }
  function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} }
  function saveTemplates() { try { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(savedTemplates)); } catch (e) {} }
  function uid(prefix) { return (prefix || 'id_') + Math.random().toString(36).slice(2, 9); }
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  let modalEl = null;
  let editorEl = null;
  let inlineCleanup = null;
  let playTimer = null;
  let contextMenuEl = null;
  let activeEditorApi = null;

  let tool = 'brush';
  let activeShape = 'rect';
  let strokeStyle = 'solid'; // solid | dashed | dotted | straight
  let brushColor = '#F5F5F7';
  let brushSize = 6;
  let showGuides = true;
  let zoomLevel = 1;
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let currentPoints = [];
  let snapshotBeforeShape = null;
  let undoStack = [];
  let copiedFrame = null;
  let copiedLayer = null;

  function ensureStyles() {
    if (document.getElementById('rg-sb-native-styles')) return;
    const style = document.createElement('style');
    style.id = 'rg-sb-native-styles';
    style.textContent = `
      .rg-sb-root {
        position: fixed; inset: 0; z-index: 99980;
        background: var(--rg-bg-canvas, #0B0B0E); color: var(--rg-text-primary, #F5F5F7);
        display: flex; flex-direction: column; font-family: Inter, system-ui, -apple-system, sans-serif;
      }
      .rg-sb-topbar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 12px 20px; background: var(--rg-bg-panel, #111116);
        border-bottom: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
      }
      .rg-sb-brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; }
      .rg-sb-pill {
        font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
        padding: 3px 8px; border-radius: 999px;
        background: var(--rg-accent-soft, rgba(130,60,240,0.18));
        color: #c4b5fd; border: 1px solid var(--rg-accent-border, rgba(130,60,240,0.5));
      }
      .rg-sb-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        padding: 6px 12px; border-radius: 7px; font-size: 12px; font-weight: 600;
        background: var(--rg-bg-elevated, #17171F);
        border: 1px solid var(--rg-border-strong, rgba(255,255,255,0.12));
        color: var(--rg-text-primary, #F5F5F7); cursor: pointer; transition: 0.15s ease;
      }
      .rg-sb-btn:hover { background: rgba(255,255,255,0.09); }
      .rg-sb-btn.active { background: var(--rg-accent, #823CF0); border-color: var(--rg-accent-border, rgba(130,60,240,0.5)); color: #fff; }
      .rg-sb-btn-accent { background: var(--rg-accent, #823CF0); border-color: var(--rg-accent-border, rgba(130,60,240,0.5)); color: #fff; }
      .rg-sb-btn-accent:hover { background: var(--rg-accent-hover, #9353F5); }
      .rg-sb-body { flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; }
      .rg-sb-empty { max-width: 520px; margin: auto; text-align: center; }
      .rg-sb-empty h2 { margin: 0 0 22px; font-size: 17px; font-weight: 600; }
      .rg-sb-start-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .rg-sb-start-card {
        padding: 32px 18px; border-radius: 12px; text-align: center; cursor: pointer;
        display: flex; flex-direction: column; align-items: center; gap: 12px;
        background: var(--rg-bg-card, #181822); border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        color: var(--rg-text-primary, #F5F5F7); transition: 0.15s ease;
      }
      .rg-sb-start-card:hover {
        border-color: var(--rg-accent-border, rgba(130,60,240,0.5));
        background: var(--rg-accent-soft, rgba(130,60,240,0.18)); transform: translateY(-2px);
      }
      .rg-sb-start-card h3 { margin: 0; font-size: 13px; font-weight: 600; }
      .rg-sb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 16px; }
      .rg-sb-card {
        background: var(--rg-bg-card, #181822); border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        border-radius: 10px; overflow: hidden; display: flex; flex-direction: column;
      }
      .rg-sb-card-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 9px 12px; border-bottom: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        font-size: 12px; font-weight: 600;
      }
      .rg-sb-thumb { aspect-ratio: 16/9; background: #070709; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; }
      .rg-sb-thumb img { width: 100%; height: 100%; object-fit: contain; }
      .rg-sb-card-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
      .rg-sb-note {
        width: 100%; box-sizing: border-box; background: var(--rg-bg-input, #101017);
        border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07)); border-radius: 6px;
        color: var(--rg-text-primary, #F5F5F7); font-size: 12px; padding: 6px 8px; resize: vertical; min-height: 44px; font-family: inherit;
      }
      .rg-sb-add-card {
        border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07)); border-radius: 10px;
        min-height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 8px; background: var(--rg-bg-panel, #111116); color: var(--rg-text-secondary, #A1A1B0); cursor: pointer;
      }
      .rg-sb-add-card:hover { border-color: var(--rg-accent-border, rgba(130,60,240,0.5)); color: #fff; }
      /* Editor Workspace */
      .rg-ed-root {
        position: fixed; inset: 0; z-index: 99990;
        background: var(--rg-bg-canvas, #0B0B0E); color: var(--rg-text-primary, #F5F5F7);
        display: flex; flex-direction: column; font-family: Inter, system-ui, -apple-system, sans-serif;
      }
      .rg-ed-root.rg-ed-embedded {
        position: relative; inset: auto; z-index: 5; width: 100%; height: 100%; min-height: 0;
      }
      .rg-ed-root.rg-ed-embedded .rg-ed-stage { padding: 14px; }
      .rg-radial-orbit.is-hover-wheel {
        position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
        width: 156px; height: 156px; z-index: 25; pointer-events: none;
      }
      .rg-radial-orbit.is-hover-wheel .rg-orbit-hub { pointer-events: auto; }
      .rg-radial-orbit.is-hover-wheel .rg-orbit-btn {
        opacity: 0; transform: scale(0.55); pointer-events: none;
        transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .rg-radial-orbit.is-hover-wheel:hover .rg-orbit-btn,
      .rg-radial-orbit.is-hover-wheel.is-pinned .rg-orbit-btn {
        opacity: 1; transform: scale(1); pointer-events: auto;
      }
      .rg-sb-inline-topbar {
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
        width: 100%; flex-wrap: nowrap; min-width: 0;
      }
      .rg-sb-inline-topbar .rg-sb-btn {
        padding: 4px 8px; font-size: 11px; white-space: nowrap;
      }
      .rg-inspector-shell .rg-sb-inspector-pane {
        display: none; flex-direction: column; gap: 12px; padding: 14px;
        overflow-y: auto; flex: 1; min-height: 0;
      }
      .rg-inspector-shell.is-storyboard-inspector:not(.is-ai-director-open) .rg-inspector-tabs,
      .rg-inspector-shell.is-storyboard-inspector:not(.is-ai-director-open) .rg-inspector-scroll {
        display: none !important;
      }
      .rg-inspector-shell.is-storyboard-inspector:not(.is-ai-director-open) .rg-sb-inspector-pane {
        display: flex;
      }
      .rg-ed-main { flex: 1; display: flex; overflow: hidden; position: relative; }
      .rg-ed-stage {
        flex: 1; display: flex; align-items: flex-start; justify-content: flex-start;
        position: relative; padding: 36px; overflow: auto;
      }
      .rg-ed-canvas-wrap {
        position: relative; margin: auto;
        border: 1px solid var(--rg-border-strong, rgba(255,255,255,0.12));
        box-shadow: 0 18px 48px rgba(0,0,0,0.65); background: #070709; flex-shrink: 0;
      }
      .rg-ed-canvas-wrap canvas { display: block; cursor: crosshair; }
      .rg-ed-guides {
        position: absolute; inset: 0; pointer-events: none;
        background-image:
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 33.333% 33.333%;
      }
      .rg-zoom-marquee {
        position: absolute; border: 1.5px dashed var(--rg-accent, #823CF0);
        background: rgba(130,60,240,0.15); pointer-events: none; display: none;
      }
      /* Circular Orbit Tool Ring */
      .rg-radial-orbit {
        position: fixed; left: 26px; top: 50%; transform: translateY(-50%);
        width: 156px; height: 156px; z-index: 25; pointer-events: none;
      }
      .rg-orbit-hub, .rg-orbit-btn {
        position: absolute; width: 36px; height: 36px; border-radius: 50%;
        display: inline-flex; align-items: center; justify-content: center;
        pointer-events: auto; cursor: pointer; transition: 0.15s ease;
        background: rgba(17, 17, 22, 0.92); backdrop-filter: blur(8px);
        border: 1px solid var(--rg-border-strong, rgba(255,255,255,0.14));
        color: var(--rg-text-secondary, #A1A1B0); box-shadow: 0 6px 18px rgba(0,0,0,0.45);
      }
      .rg-orbit-hub { left: 60px; top: 60px; background: var(--rg-accent, #823CF0); color: #fff; border-color: rgba(196,181,253,0.6); }
      .rg-orbit-btn:hover { color: #fff; transform: scale(1.08); }
      .rg-orbit-btn.active { background: var(--rg-accent, #823CF0); color: #fff; border-color: rgba(196,181,253,0.6); }
      .rg-popover {
        position: fixed; left: 194px; top: 50%; transform: translateY(-50%);
        background: var(--rg-bg-panel, #111116);
        border: 1px solid var(--rg-border-strong, rgba(255,255,255,0.12));
        border-radius: 12px; padding: 10px; box-shadow: 0 14px 36px rgba(0,0,0,0.7); z-index: 35;
      }
      .rg-shapes-grid { display: grid; grid-template-columns: repeat(4, 34px); gap: 6px; }
      .rg-color-modal { width: 204px; display: flex; flex-direction: column; gap: 10px; }
      .rg-swatch-grid { display: grid; grid-template-columns: repeat(6, 22px); gap: 6px; }
      .rg-swatch { width: 22px; height: 22px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
      .rg-swatch.active { border-color: #fff; transform: scale(1.1); }
      .rg-hex-input {
        flex: 1; background: var(--rg-bg-input, #101017);
        border: 1px solid var(--rg-border-strong, rgba(255,255,255,0.12));
        border-radius: 6px; color: var(--rg-text-primary, #F5F5F7);
        font-size: 12px; padding: 5px 8px; font-family: monospace;
      }
      /* Right Sidebar (Brush/Stroke + Layers) */
      .rg-ed-sidebar {
        width: 280px; background: var(--rg-bg-panel, #111116);
        border-left: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        display: flex; flex-direction: column; padding: 12px; gap: 12px; overflow-y: auto; z-index: 10;
      }
      .rg-side-box {
        background: var(--rg-bg-card, #181822);
        border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;
      }
      .rg-style-pills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
      .rg-style-pill {
        padding: 5px 4px; border-radius: 6px; font-size: 11px; font-weight: 600; text-align: center;
        background: var(--rg-bg-input, #101017); border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        color: var(--rg-text-secondary, #A1A1B0); cursor: pointer;
      }
      .rg-style-pill.active { background: var(--rg-accent, #823CF0); color: #fff; border-color: var(--rg-accent-border, rgba(130,60,240,0.5)); }
      .rg-layer-row {
        display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 8px;
        background: var(--rg-bg-card, #181822); border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        cursor: pointer; position: relative;
      }
      .rg-layer-row.active { border-color: var(--rg-accent-border, rgba(130,60,240,0.5)); background: var(--rg-accent-soft, rgba(130,60,240,0.18)); }
      .rg-layer-hover-actions { display: none; align-items: center; gap: 4px; justify-content: flex-end; }
      .rg-layer-row:hover .rg-layer-hover-actions { display: flex; }
      .rg-ctx-menu {
        position: fixed; z-index: 99999; min-width: 170px; padding: 5px;
        background: var(--rg-bg-panel, #111116);
        border: 1px solid var(--rg-border-strong, rgba(255,255,255,0.12));
        border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.65);
        display: flex; flex-direction: column; gap: 2px;
      }
      .rg-ctx-item {
        padding: 7px 10px; border-radius: 6px; font-size: 12px; color: var(--rg-text-primary, #F5F5F7);
        background: transparent; border: none; text-align: left; cursor: pointer;
      }
      .rg-ctx-item:hover { background: var(--rg-accent-soft, rgba(130,60,240,0.18)); }
      .rg-ctx-item:disabled { opacity: 0.4; cursor: default; }
      /* Bottom Frame Strip */
      .rg-ed-frames {
        height: 80px; background: var(--rg-bg-panel, #111116);
        border-top: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; gap: 14px; z-index: 10;
      }
      .rg-frame-list { display: flex; align-items: center; gap: 8px; overflow-x: auto; flex: 1; }
      .rg-frame-chip {
        min-width: 54px; height: 46px; border-radius: 6px;
        background: var(--rg-bg-card, #181822); border: 1px solid var(--rg-border-subtle, rgba(255,255,255,0.07));
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700; cursor: pointer; color: var(--rg-text-secondary, #A1A1B0);
      }
      .rg-frame-chip.active { border-color: var(--rg-accent, #823CF0); color: #fff; background: var(--rg-accent-soft, rgba(130,60,240,0.18)); }
    `;
    document.head.appendChild(style);
  }

  function createDefaultLayer(name, type, dataUrl) {
    return {
      id: uid('ly_'),
      name: name || 'Sketch Layer 1',
      type: type || 'sketch',
      visible: true,
      scale: 1,
      opacity: 1,
      isReference: false,
      dataUrl: dataUrl || '',
      vectors: []
    };
  }

  function createDefaultFrame() {
    return { id: uid('fr_'), layers: [createDefaultLayer('Sketch Layer 1', 'sketch', '')] };
  }

  function ensureSceneSchema(sc) {
    if (!Array.isArray(sc.frames) || sc.frames.length === 0) sc.frames = [createDefaultFrame()];
    if (typeof sc.activeFrameIdx !== 'number' || sc.activeFrameIdx >= sc.frames.length) sc.activeFrameIdx = 0;
    sc.frames.forEach((fr) => {
      fr.layers.forEach((ly) => {
        if (typeof ly.opacity !== 'number') ly.opacity = 1;
        if (typeof ly.isReference !== 'boolean') ly.isReference = false;
        if (!Array.isArray(ly.vectors)) ly.vectors = [];
      });
    });
    if (!sc.fps) sc.fps = 24;
    if (!sc.speed) sc.speed = 1;
    return sc;
  }

  function addBlankScene(openAfter) {
    const sc = ensureSceneSchema({
      id: uid('sc_'), title: 'Scene ' + (state.scenes.length + 1),
      aspectRatio: state.aspectRatio, note: '', thumbUrl: '',
      frames: [createDefaultFrame()], activeFrameIdx: 0, fps: 24, speed: 1
    });
    state.scenes.push(sc); saveState(); renderBoard();
    if (openAfter) openSceneEditor(sc.id);
  }

  function triggerBatchImport() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
      if (!files.length) return;
      let done = 0;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          const sc = ensureSceneSchema({
            id: uid('sc_'),
            title: file.name.replace(/\.[^.]+$/, '') || ('Scene ' + (state.scenes.length + 1)),
            aspectRatio: state.aspectRatio, note: '', thumbUrl: dataUrl,
            frames: [{ id: uid('fr_'), layers: [createDefaultLayer(file.name, 'image', dataUrl)] }],
            activeFrameIdx: 0, fps: 24, speed: 1
          });
          state.scenes.push(sc); done++;
          if (done === files.length) { saveState(); renderBoard(); }
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  }

  function renderBoard() {
    if (!modalEl) return;
    const body = modalEl.querySelector('#rg-sb-body');
    if (!body) return;

    if (state.scenes.length === 0) {
      body.innerHTML = `
        <div class="rg-sb-empty">
          <h2>Start Storyboard</h2>
          <div class="rg-sb-start-grid">
            <button type="button" class="rg-sb-start-card" id="rg-sb-start-draw" title="Create a layered scene card with circular brush, fill, shapes, and frame controls">
              ${ICONS.drawHero}
              <h3>Start with Drawing</h3>
            </button>
            <button type="button" class="rg-sb-start-card" id="rg-sb-start-import" title="Import multiple images at once to create scene cards you can layer and draw over">
              ${ICONS.importHero}
              <h3>Batch Import</h3>
            </button>
          </div>
        </div>
      `;
      body.querySelector('#rg-sb-start-draw').onclick = () => addBlankScene(true);
      body.querySelector('#rg-sb-start-import').onclick = () => triggerBatchImport();
      return;
    }

    const cards = state.scenes.map((sc, i) => `
      <div class="rg-sb-card">
        <div class="rg-sb-card-head">
          <span>${i + 1}. ${escapeHtml(sc.title)}</span>
          <span class="rg-sb-pill">${sc.aspectRatio || state.aspectRatio}</span>
        </div>
        <div class="rg-sb-thumb" data-open="${sc.id}">
          ${sc.thumbUrl ? `<img src="${sc.thumbUrl}" alt="${escapeHtml(sc.title)}" />` : `<span style="font-size:12px;color:var(--rg-text-muted);">Click to Sketch</span>`}
        </div>
        <div class="rg-sb-card-body">
          <textarea class="rg-sb-note" data-note="${sc.id}" placeholder="Scene notes / prompt...">${escapeHtml(sc.note || '')}</textarea>
          <div style="display:flex; justify-content:space-between; gap:6px;">
            <button type="button" class="rg-sb-btn rg-sb-btn-accent" data-open="${sc.id}">Open Editor</button>
            <div style="display:flex; gap:6px;">
              <button type="button" class="rg-sb-btn" data-dup="${sc.id}">Copy</button>
              <button type="button" class="rg-sb-btn" data-del="${sc.id}" style="color:#fca5a5;">Del</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    body.innerHTML = `
      <div class="rg-sb-grid">
        ${cards}
        <button type="button" class="rg-sb-add-card" id="rg-sb-add-card">
          <span style="font-size:24px;">＋</span>
          <span style="font-size:12px; font-weight:600;">Add Scene</span>
        </button>
      </div>
    `;

    body.querySelector('#rg-sb-add-card').onclick = () => addBlankScene(true);
    body.querySelectorAll('[data-open]').forEach((el) => { el.onclick = () => openSceneEditor(el.getAttribute('data-open')); });
    body.querySelectorAll('[data-dup]').forEach((el) => {
      el.onclick = () => {
        const src = state.scenes.find((s) => s.id === el.getAttribute('data-dup'));
        if (!src) return;
        state.scenes.push(JSON.parse(JSON.stringify({ ...src, id: uid('sc_'), title: src.title + ' (Copy)' })));
        saveState(); renderBoard();
      };
    });
    body.querySelectorAll('[data-del]').forEach((el) => {
      el.onclick = () => { state.scenes = state.scenes.filter((s) => s.id !== el.getAttribute('data-del')); saveState(); renderBoard(); };
    });
    body.querySelectorAll('[data-note]').forEach((ta) => {
      ta.oninput = (e) => {
        const sc = state.scenes.find((s) => s.id === ta.getAttribute('data-note'));
        if (sc) { sc.note = e.target.value; saveState(); }
      };
    });
  }

  function closeContextMenu() {
    if (contextMenuEl) { contextMenuEl.remove(); contextMenuEl = null; }
  }

  function applyStrokeStyle(targetCtx, styleName, size) {
    if (styleName === 'dashed') targetCtx.setLineDash([size * 2.5, size * 1.6]);
    else if (styleName === 'dotted') targetCtx.setLineDash([1, size * 1.8]);
    else targetCtx.setLineDash([]);
  }

  function drawShapeOnCtx(targetCtx, shape, x1, y1, x2, y2, size) {
    targetCtx.beginPath();
    if (shape === 'line') { targetCtx.moveTo(x1, y1); targetCtx.lineTo(x2, y2); }
    else if (shape === 'rect') { targetCtx.rect(x1, y1, x2 - x1, y2 - y1); }
    else if (shape === 'circle') { targetCtx.arc(x1, y1, Math.hypot(x2 - x1, y2 - y1), 0, Math.PI * 2); }
    else if (shape === 'triangle') {
      targetCtx.moveTo((x1 + x2) / 2, y1); targetCtx.lineTo(x2, y2); targetCtx.lineTo(x1, y2); targetCtx.closePath();
    } else if (shape === 'diamond') {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      targetCtx.moveTo(mx, y1); targetCtx.lineTo(x2, my); targetCtx.lineTo(mx, y2); targetCtx.lineTo(x1, my); targetCtx.closePath();
    } else if (shape === 'arrow') {
      const ang = Math.atan2(y2 - y1, x2 - x1), head = Math.max(12, size * 2.5);
      targetCtx.moveTo(x1, y1); targetCtx.lineTo(x2, y2);
      targetCtx.lineTo(x2 - head * Math.cos(ang - Math.PI / 6), y2 - head * Math.sin(ang - Math.PI / 6));
      targetCtx.moveTo(x2, y2);
      targetCtx.lineTo(x2 - head * Math.cos(ang + Math.PI / 6), y2 - head * Math.sin(ang + Math.PI / 6));
    } else if (shape === 'star') {
      const rOuter = Math.hypot(x2 - x1, y2 - y1), rInner = rOuter * 0.42;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? rOuter : rInner, a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = x1 + r * Math.cos(a), py = y1 + r * Math.sin(a);
        if (i === 0) targetCtx.moveTo(px, py); else targetCtx.lineTo(px, py);
      }
      targetCtx.closePath();
    }
    targetCtx.stroke();
  }

  // ==========================================================================
  // SCENE EDITOR
  // ==========================================================================
  function openSceneEditor(sceneId, opts) {
    ensureStyles();
    const scene = state.scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    ensureSceneSchema(scene);

    if (editorEl) editorEl.remove();
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    closeContextMenu();

    const ratio = ASPECT_RATIOS[scene.aspectRatio || state.aspectRatio] || ASPECT_RATIOS['16:9'];
    let activeLayerId = scene.frames[scene.activeFrameIdx].layers[0].id;
    undoStack = [];
    zoomLevel = 1;
    let zoomBoxMode = false;
    let orbitOpen = true;

    // 7 tools in a true 360-degree ring around the center hub (radius = 56px)
    const orbitDefs = [
      { id: 'brush', attr: 'data-tool="brush"', title: 'Brush', html: ICONS.brush, active: true },
      { id: 'fill', attr: 'data-tool="fill"', title: 'Fill Bucket', html: ICONS.fill },
      { id: 'shapes', attr: 'id="rg-shapes-btn"', title: 'Shapes', html: ICONS.shapes },
      { id: 'eyedropper', attr: 'data-tool="eyedropper"', title: 'Eyedropper (Sample Color)', html: ICONS.eyedropper },
      { id: 'eraser', attr: 'data-tool="eraser"', title: 'Eraser', html: ICONS.eraser },
      { id: 'color', attr: 'id="rg-color-btn"', title: 'Color Picker', html: `<span id="rg-color-dot" style="width:16px;height:16px;border-radius:50%;background:${brushColor};border:1.5px solid #fff;"></span>` },
      { id: 'undo', attr: 'id="rg-ed-undo"', title: 'Undo', html: ICONS.undo }
    ];
    const orbitHtml = orbitDefs.map((item, idx) => {
      const angle = (-Math.PI / 2) + (idx * 2 * Math.PI) / orbitDefs.length;
      const x = Math.round(60 + 56 * Math.cos(angle));
      const y = Math.round(60 + 56 * Math.sin(angle));
      return `<button type="button" class="rg-orbit-btn ${item.active ? 'active' : ''}" ${item.attr} title="${item.title}" style="left:${x}px;top:${y}px;">${item.html}</button>`;
    }).join('');

    const isEmbedded = !!(opts && opts.hostEl);
    const topbarHostEl = (opts && opts.topbarHostEl) || null;
    const sidebarHostEl = (opts && opts.sidebarHostEl) || null;
    if (inlineCleanup) { try { inlineCleanup(); } catch (_) {} inlineCleanup = null; }

    const topbarInnerHtml = `
      <div class="rg-sb-brand">
        <span>${escapeHtml(scene.title)}</span>
        <span class="rg-sb-pill">${scene.aspectRatio || state.aspectRatio}</span>
        <span id="rg-coord-readout" style="font-size:11px; color:var(--rg-text-muted); font-family:monospace;">0, 0</span>
      </div>
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:nowrap;">
        <button type="button" class="rg-sb-btn" id="rg-ed-comment-pin-btn" title="Drop a Comment Pin to AI-Animate &amp; Create Assets">💬 Pin Comment</button>
        <button type="button" class="rg-sb-btn" id="rg-zoom-area-btn" title="Drag a box on the canvas to zoom into that exact cell or area">${ICONS.zoomBox} Area Zoom</button>
        <button type="button" class="rg-sb-btn" id="rg-zoom-out" title="Zoom Out">-</button>
        <span id="rg-zoom-label" style="font-size:11.5px; min-width:38px; text-align:center;">100%</span>
        <button type="button" class="rg-sb-btn" id="rg-zoom-in" title="Zoom In (up to 300%)">+</button>
        <button type="button" class="rg-sb-btn" id="rg-ed-guides">${showGuides ? 'Guides: On' : 'Guides: Off'}</button>
        <button type="button" class="rg-sb-btn rg-sb-btn-accent" id="rg-ed-save">Save &amp; Back</button>
      </div>
    `;

    const sidebarInnerHtml = `
      <div class="rg-side-box rg-inspector-section">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:12px;">Brush &amp; Stroke</strong>
          <span style="font-size:11px; color:var(--rg-text-muted); font-family:monospace;" id="rg-size-readout">${brushSize}px</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="range" id="rg-ed-size" min="1" max="40" value="${brushSize}" style="flex:1;" />
          <input type="number" id="rg-ed-size-num" min="1" max="40" value="${brushSize}" class="rg-hex-input" style="width:46px; flex:none; text-align:center;" />
        </div>
        <div class="rg-style-pills">
          ${['solid', 'dashed', 'dotted', 'straight'].map((st) => `<button type="button" class="rg-style-pill ${strokeStyle === st ? 'active' : ''}" data-stroke-style="${st}">${st[0].toUpperCase() + st.slice(1)}</button>`).join('')}
        </div>
      </div>
      <div class="rg-side-box rg-inspector-section">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:12px;">Layers</strong>
          <div style="display:flex; gap:4px;">
            <button type="button" class="rg-sb-btn" id="rg-add-sketch-layer" style="padding:4px 7px;font-size:11px;">+ Sketch</button>
            <button type="button" class="rg-sb-btn" id="rg-add-img-layer" style="padding:4px 7px;font-size:11px;">+ Image</button>
            <button type="button" class="rg-sb-btn" id="rg-use-tpl-layer" style="padding:4px 7px;font-size:11px;" title="Insert Saved Sketch Template">+ Tpl</button>
          </div>
        </div>
        <div id="rg-layer-list" style="display:flex; flex-direction:column; gap:6px;"></div>
      </div>
    `;

    editorEl = document.createElement('div');
    editorEl.className = isEmbedded ? 'rg-ed-root rg-ed-embedded' : 'rg-ed-root';
    editorEl.innerHTML = `
      ${topbarHostEl ? '' : `<div class="rg-sb-topbar">${topbarInnerHtml}</div>`}
      <div class="rg-ed-main">
        <div class="rg-radial-orbit ${isEmbedded ? 'is-hover-wheel' : ''}" id="rg-radial-orbit">
          <button type="button" class="rg-orbit-hub" id="rg-orbit-hub" title="Hover for tools or click to pin">${ICONS.hub}</button>
          ${orbitHtml}
        </div>
        <div class="rg-popover" id="rg-shapes-popover" style="display:none;">
          <div class="rg-shapes-grid">
            ${SHAPE_TOOLS.map((sh) => `<button type="button" class="rg-orbit-btn" style="position:static;" data-shape="${sh.id}" title="${sh.label}">${sh.svg}</button>`).join('')}
          </div>
        </div>
        <div class="rg-popover" id="rg-color-popover" style="display:none;">
          <div class="rg-color-modal">
            <div class="rg-swatch-grid">
              ${PALETTE.map((c) => `<div class="rg-swatch ${c === brushColor ? 'active' : ''}" data-color="${c}" style="background:${c};"></div>`).join('')}
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <input type="color" id="rg-ed-color" value="${brushColor}" style="width:28px;height:28px;border:none;background:none;cursor:pointer;" />
              <input type="text" id="rg-ed-hex" class="rg-hex-input" value="${brushColor}" maxlength="7" placeholder="#FFFFFF" />
            </div>
          </div>
        </div>
        <div class="rg-ed-stage" id="rg-ed-stage">
          <div class="rg-ed-canvas-wrap" id="rg-ed-canvas-wrap">
            <canvas id="rg-ed-canvas" width="${ratio.w}" height="${ratio.h}"></canvas>
            <div class="rg-ed-guides" id="rg-ed-guides-el" style="display:${showGuides ? 'block' : 'none'};"></div>
            <div class="rg-zoom-marquee" id="rg-zoom-marquee"></div>
          </div>
        </div>
        ${sidebarHostEl ? '' : `<div class="rg-ed-sidebar">${sidebarInnerHtml}</div>`}
      </div>
      <div class="rg-ed-frames">
        <div class="rg-frame-list" id="rg-frame-list"></div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button type="button" class="rg-sb-btn" id="rg-fr-add">+ Frame</button>
          <button type="button" class="rg-sb-btn" id="rg-fr-copy">Copy</button>
          <button type="button" class="rg-sb-btn" id="rg-fr-paste">Paste</button>
          <select id="rg-fr-fps" class="rg-sb-btn" title="Frames Per Second">
            ${[12, 24, 30, 60].map((f) => `<option value="${f}" ${scene.fps === f ? 'selected' : ''}>${f} FPS</option>`).join('')}
          </select>
          <select id="rg-fr-speed" class="rg-sb-btn" title="Playback Speed">
            ${[0.01, 0.1, 0.25, 0.5, 1].map((sp) => `<option value="${sp}" ${scene.speed === sp ? 'selected' : ''}>${sp}x</option>`).join('')}
          </select>
          <button type="button" class="rg-sb-btn rg-sb-btn-accent" id="rg-fr-play">Play</button>
        </div>
      </div>
    `;

    let topbarMount = null;
    let hiddenTopbarChildren = [];
    if (topbarHostEl) {
      hiddenTopbarChildren = Array.from(topbarHostEl.children).map((ch) => ({ el: ch, prev: ch.style.display }));
      hiddenTopbarChildren.forEach(({ el }) => { el.style.display = 'none'; });
      topbarMount = document.createElement('div');
      topbarMount.className = 'rg-sb-inline-topbar';
      topbarMount.innerHTML = topbarInnerHtml;
      topbarHostEl.appendChild(topbarMount);
    }

    let sidebarMount = null;
    if (sidebarHostEl) {
      sidebarMount = document.createElement('div');
      sidebarMount.className = 'rg-sb-inspector-pane';
      sidebarMount.innerHTML = sidebarInnerHtml;
      sidebarHostEl.appendChild(sidebarMount);
      sidebarHostEl.classList.add('is-storyboard-inspector');
    }

    inlineCleanup = () => {
      if (topbarMount) { topbarMount.remove(); topbarMount = null; }
      hiddenTopbarChildren.forEach(({ el, prev }) => { el.style.display = prev; });
      hiddenTopbarChildren = [];
      if (sidebarMount) { sidebarMount.remove(); sidebarMount = null; }
      if (sidebarHostEl) sidebarHostEl.classList.remove('is-storyboard-inspector');
    };

    const q = (sel) => {
      for (const root of [editorEl, topbarMount, sidebarMount]) {
        if (!root) continue;
        const found = root.querySelector(sel);
        if (found) return found;
      }
      return null;
    };
    const qAll = (sel) => {
      const out = [];
      for (const root of [editorEl, topbarMount, sidebarMount]) {
        if (!root) continue;
        root.querySelectorAll(sel).forEach((n) => out.push(n));
      }
      return out;
    };

    if (isEmbedded) {
      opts.hostEl.innerHTML = '';
      opts.hostEl.appendChild(editorEl);
    } else {
      document.body.appendChild(editorEl);
    }

    const stage = q('#rg-ed-stage');
    const canvas = q('#rg-ed-canvas');
    const canvasWrap = q('#rg-ed-canvas-wrap');
    const marquee = q('#rg-zoom-marquee');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = canvas.width;
    layerCanvas.height = canvas.height;
    const lctx = layerCanvas.getContext('2d', { willReadFrequently: true });

    function applyZoom(focusNormX, focusNormY) {
      const stageW = Math.max(320, stage.clientWidth - 72);
      const baseScale = Math.min(1, stageW / canvas.width);
      const displayW = Math.round(canvas.width * baseScale * zoomLevel);
      const displayH = Math.round(canvas.height * baseScale * zoomLevel);
      canvas.style.width = displayW + 'px';
      canvas.style.height = displayH + 'px';
      canvasWrap.style.width = displayW + 'px';
      canvasWrap.style.height = displayH + 'px';
      q('#rg-zoom-label').textContent = Math.round(zoomLevel * 100) + '%';

      if (typeof focusNormX === 'number' && typeof focusNormY === 'number') {
        requestAnimationFrame(() => {
          stage.scrollLeft = Math.max(0, focusNormX * displayW - stage.clientWidth / 2 + 36);
          stage.scrollTop = Math.max(0, focusNormY * displayH - stage.clientHeight / 2 + 36);
        });
      }
    }
    applyZoom();

    const zoomAreaBtn = q('#rg-zoom-area-btn');
    zoomAreaBtn.onclick = () => {
      zoomBoxMode = !zoomBoxMode;
      zoomAreaBtn.classList.toggle('active', zoomBoxMode);
      canvas.style.cursor = zoomBoxMode ? 'zoom-in' : 'crosshair';
    };
    q('#rg-zoom-in').onclick = () => { zoomLevel = Math.min(3, Math.round((zoomLevel + 0.25) * 100) / 100); applyZoom(); };
    q('#rg-zoom-out').onclick = () => { zoomLevel = Math.max(0.5, Math.round((zoomLevel - 0.25) * 100) / 100); applyZoom(); };

    function getActiveFrame() { return scene.frames[scene.activeFrameIdx] || scene.frames[0]; }
    function getActiveLayer() {
      const fr = getActiveFrame();
      return fr.layers.find((l) => l.id === activeLayerId) || fr.layers[0];
    }

    function loadActiveLayerToBuffer() {
      lctx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
      const ly = getActiveLayer();
      if (ly && ly.dataUrl) {
        const img = new Image();
        img.onload = () => { lctx.drawImage(img, 0, 0, layerCanvas.width, layerCanvas.height); compositeAllLayers(); };
        img.src = ly.dataUrl;
      } else {
        compositeAllLayers();
      }
      undoStack = [];
    }

    function commitBufferToActiveLayer() {
      const ly = getActiveLayer();
      if (ly) { ly.dataUrl = layerCanvas.toDataURL('image/png'); saveState(); }
    }

    function compositeAllLayers(excludeReferences) {
      ctx.fillStyle = '#070709';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const fr = getActiveFrame();
      const activeLy = getActiveLayer();
      const drawLayerItem = (ly, source) => {
        if (!ly.visible || (excludeReferences && ly.isReference)) return;
        ctx.save();
        ctx.globalAlpha = typeof ly.opacity === 'number' ? ly.opacity : 1;
        const sc = ly.scale || 1;
        const w = canvas.width * sc;
        const h = canvas.height * sc;
        ctx.drawImage(source, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        ctx.restore();
      };
      let pending = 0;
      const rendered = new Map();
      fr.layers.forEach((ly) => {
        if (!ly.visible || (excludeReferences && ly.isReference)) return;
        if (activeLy && ly.id === activeLy.id) {
          rendered.set(ly.id, layerCanvas);
        } else if (ly.dataUrl) {
          pending++;
          const img = new Image();
          img.onload = () => {
            rendered.set(ly.id, img); pending--;
            if (pending === 0) {
              ctx.fillStyle = '#070709'; ctx.fillRect(0, 0, canvas.width, canvas.height);
              fr.layers.forEach((l) => { if (rendered.has(l.id)) drawLayerItem(l, rendered.get(l.id)); });
            }
          };
          img.src = ly.dataUrl;
        }
      });
      if (pending === 0) {
        fr.layers.forEach((l) => { if (rendered.has(l.id)) drawLayerItem(l, rendered.get(l.id)); });
      }
    }

    function copyLayerById(id) {
      commitBufferToActiveLayer();
      const ly = getActiveFrame().layers.find((l) => l.id === id);
      if (ly) copiedLayer = JSON.parse(JSON.stringify(ly));
    }

    function pasteCopiedLayer() {
      if (!copiedLayer) return;
      commitBufferToActiveLayer();
      const fr = getActiveFrame();
      const pasted = JSON.parse(JSON.stringify(copiedLayer));
      pasted.id = uid('ly_');
      pasted.name = pasted.name + ' (Copy)';
      fr.layers.push(pasted);
      activeLayerId = pasted.id;
      saveState(); loadActiveLayerToBuffer(); renderLayersPanel();
    }

    function saveLayerAsTemplate(id) {
      commitBufferToActiveLayer();
      const ly = getActiveFrame().layers.find((l) => l.id === id);
      if (!ly || !ly.dataUrl) return;
      const name = prompt('Template name (e.g. Humanoid, Prop):', ly.name) || ly.name;
      savedTemplates.push({ id: uid('tpl_'), name, dataUrl: ly.dataUrl });
      saveTemplates();
    }

    function showLayerContextMenu(x, y, layerId) {
      closeContextMenu();
      contextMenuEl = document.createElement('div');
      contextMenuEl.className = 'rg-ctx-menu';
      contextMenuEl.style.left = Math.min(x, window.innerWidth - 190) + 'px';
      contextMenuEl.style.top = Math.min(y, window.innerHeight - 140) + 'px';
      contextMenuEl.innerHTML = `
        <button type="button" class="rg-ctx-item" id="rg-ctx-copy">Copy Layer</button>
        <button type="button" class="rg-ctx-item" id="rg-ctx-paste" ${copiedLayer ? '' : 'disabled'}>Paste Layer</button>
        <button type="button" class="rg-ctx-item" id="rg-ctx-tpl">Save as Template</button>
      `;
      document.body.appendChild(contextMenuEl);
      contextMenuEl.querySelector('#rg-ctx-copy').onclick = () => { copyLayerById(layerId); closeContextMenu(); };
      contextMenuEl.querySelector('#rg-ctx-paste').onclick = () => { pasteCopiedLayer(); closeContextMenu(); };
      contextMenuEl.querySelector('#rg-ctx-tpl').onclick = () => { saveLayerAsTemplate(layerId); closeContextMenu(); };
    }

    function renderLayersPanel() {
      const list = q('#rg-layer-list');
      const fr = getActiveFrame();
      list.innerHTML = fr.layers.slice().reverse().map((ly) => `
        <div class="rg-layer-row ${ly.id === activeLayerId ? 'active' : ''}" data-ly="${ly.id}">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:5px;">
            <button type="button" class="rg-sb-btn" data-vis="${ly.id}" style="padding:3px 6px;" title="Show/Hide">${ly.visible ? ICONS.eyeOn : ICONS.eyeOff}</button>
            <span style="font-size:12px; font-weight:600; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(ly.name)}</span>
            <button type="button" class="rg-sb-btn ${ly.isReference ? 'active' : ''}" data-ref="${ly.id}" style="padding:2px 5px;font-size:10px;" title="Reference (Trace Only — excluded from final)">Ref</button>
            <button type="button" class="rg-sb-btn" data-up="${ly.id}" style="padding:2px 5px;" title="Move Up">↑</button>
            <button type="button" class="rg-sb-btn" data-dn="${ly.id}" style="padding:2px 5px;" title="Move Down">↓</button>
            <button type="button" class="rg-sb-btn" data-rm="${ly.id}" style="padding:2px 5px;color:#fca5a5;" title="Delete">×</button>
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:var(--rg-text-secondary);">
            <span style="width:38px;">Scale</span>
            <input type="range" min="0.25" max="2.5" step="0.05" value="${ly.scale || 1}" data-scale="${ly.id}" style="flex:1;" />
            <span style="width:34px;text-align:right;">${Math.round((ly.scale || 1) * 100)}%</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:var(--rg-text-secondary);">
            <span style="width:38px;">Opac</span>
            <input type="range" min="0.05" max="1" step="0.05" value="${typeof ly.opacity === 'number' ? ly.opacity : 1}" data-opac="${ly.id}" style="flex:1;" />
            <span style="width:34px;text-align:right;">${Math.round((typeof ly.opacity === 'number' ? ly.opacity : 1) * 100)}%</span>
          </div>
          <div class="rg-layer-hover-actions">
            <button type="button" class="rg-sb-btn" data-copy-ly="${ly.id}" style="padding:2px 6px;font-size:10px;" title="Copy Layer">${ICONS.copy} Copy</button>
            <button type="button" class="rg-sb-btn" data-tpl-ly="${ly.id}" style="padding:2px 6px;font-size:10px;" title="Save as Template">${ICONS.bookmark} Save</button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('[data-ly]').forEach((row) => {
        const lyId = row.getAttribute('data-ly');
        row.onclick = (e) => {
          if (e.target.closest('button') || e.target.tagName === 'INPUT') return;
          commitBufferToActiveLayer(); activeLayerId = lyId;
          loadActiveLayerToBuffer(); renderLayersPanel();
        };
        row.oncontextmenu = (e) => { e.preventDefault(); showLayerContextMenu(e.clientX, e.clientY, lyId); };
      });
      list.querySelectorAll('[data-copy-ly]').forEach((b) => { b.onclick = () => copyLayerById(b.getAttribute('data-copy-ly')); });
      list.querySelectorAll('[data-tpl-ly]').forEach((b) => { b.onclick = () => saveLayerAsTemplate(b.getAttribute('data-tpl-ly')); });
      list.querySelectorAll('[data-vis]').forEach((btn) => {
        btn.onclick = () => {
          const ly = fr.layers.find((l) => l.id === btn.getAttribute('data-vis'));
          if (ly) { ly.visible = !ly.visible; saveState(); compositeAllLayers(); renderLayersPanel(); }
        };
      });
      list.querySelectorAll('[data-ref]').forEach((btn) => {
        btn.onclick = () => {
          const ly = fr.layers.find((l) => l.id === btn.getAttribute('data-ref'));
          if (ly) {
            ly.isReference = !ly.isReference;
            if (ly.isReference && ly.opacity === 1) ly.opacity = 0.35;
            saveState(); compositeAllLayers(); renderLayersPanel();
          }
        };
      });
      list.querySelectorAll('[data-scale]').forEach((inp) => {
        inp.oninput = () => {
          const ly = fr.layers.find((l) => l.id === inp.getAttribute('data-scale'));
          if (ly) { ly.scale = parseFloat(inp.value) || 1; compositeAllLayers(); }
        };
        inp.onchange = () => { saveState(); renderLayersPanel(); };
      });
      list.querySelectorAll('[data-opac]').forEach((inp) => {
        inp.oninput = () => {
          const ly = fr.layers.find((l) => l.id === inp.getAttribute('data-opac'));
          if (ly) { ly.opacity = parseFloat(inp.value); compositeAllLayers(); }
        };
        inp.onchange = () => { saveState(); renderLayersPanel(); };
      });
      list.querySelectorAll('[data-up]').forEach((btn) => {
        btn.onclick = () => {
          const idx = fr.layers.findIndex((l) => l.id === btn.getAttribute('data-up'));
          if (idx >= 0 && idx < fr.layers.length - 1) {
            [fr.layers[idx], fr.layers[idx + 1]] = [fr.layers[idx + 1], fr.layers[idx]];
            saveState(); compositeAllLayers(); renderLayersPanel();
          }
        };
      });
      list.querySelectorAll('[data-dn]').forEach((btn) => {
        btn.onclick = () => {
          const idx = fr.layers.findIndex((l) => l.id === btn.getAttribute('data-dn'));
          if (idx > 0) {
            [fr.layers[idx], fr.layers[idx - 1]] = [fr.layers[idx - 1], fr.layers[idx]];
            saveState(); compositeAllLayers(); renderLayersPanel();
          }
        };
      });
      list.querySelectorAll('[data-rm]').forEach((btn) => {
        btn.onclick = () => {
          if (fr.layers.length <= 1) return;
          fr.layers = fr.layers.filter((l) => l.id !== btn.getAttribute('data-rm'));
          activeLayerId = fr.layers[0].id;
          saveState(); loadActiveLayerToBuffer(); renderLayersPanel();
        };
      });
    }

    function renderFramesStrip() {
      const list = q('#rg-frame-list');
      list.innerHTML = scene.frames.map((fr, idx) => `
        <div class="rg-frame-chip ${idx === scene.activeFrameIdx ? 'active' : ''}" data-fidx="${idx}">F${idx + 1}</div>
      `).join('');
      list.querySelectorAll('[data-fidx]').forEach((chip) => {
        chip.onclick = () => {
          commitBufferToActiveLayer();
          scene.activeFrameIdx = parseInt(chip.getAttribute('data-fidx'), 10);
          activeLayerId = getActiveFrame().layers[0].id;
          loadActiveLayerToBuffer(); renderLayersPanel(); renderFramesStrip();
        };
      });
    }

    // Orbit Wheel, Shapes Popover, Color Popover & Brush Controls
    const shapesPopover = q('#rg-shapes-popover');
    const colorPopover = q('#rg-color-popover');
    const shapesBtn = q('#rg-shapes-btn');
    const colorBtn = q('#rg-color-btn');
    const setActiveOrbitBtn = (btn) => {
      qAll('.rg-orbit-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    };

    q('#rg-orbit-hub').onclick = () => {
      const orbitEl = q('#rg-radial-orbit');
      if (orbitEl && orbitEl.classList.contains('is-hover-wheel')) {
        orbitEl.classList.toggle('is-pinned');
      } else {
        orbitOpen = !orbitOpen;
        qAll('.rg-orbit-btn').forEach((b) => { b.style.display = orbitOpen ? 'inline-flex' : 'none'; });
      }
      shapesPopover.style.display = 'none'; colorPopover.style.display = 'none';
    };

    qAll('[data-tool]').forEach((btn) => {
      btn.onclick = () => {
        tool = btn.getAttribute('data-tool');
        zoomBoxMode = false; zoomAreaBtn.classList.remove('active'); canvas.style.cursor = 'crosshair';
        shapesPopover.style.display = 'none'; colorPopover.style.display = 'none';
        setActiveOrbitBtn(btn);
      };
    });
    shapesBtn.onclick = (e) => {
      e.stopPropagation(); colorPopover.style.display = 'none';
      shapesPopover.style.display = shapesPopover.style.display === 'none' ? 'block' : 'none';
    };
    colorBtn.onclick = (e) => {
      e.stopPropagation(); shapesPopover.style.display = 'none';
      colorPopover.style.display = colorPopover.style.display === 'none' ? 'block' : 'none';
    };
    qAll('[data-shape]').forEach((btn) => {
      btn.onclick = () => {
        activeShape = btn.getAttribute('data-shape'); tool = 'shape';
        zoomBoxMode = false; zoomAreaBtn.classList.remove('active'); canvas.style.cursor = 'crosshair';
        shapesPopover.style.display = 'none'; setActiveOrbitBtn(shapesBtn);
      };
    });

    function setColor(hex) {
      if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
      brushColor = hex;
      q('#rg-ed-color').value = hex;
      q('#rg-ed-hex').value = hex.toUpperCase();
      q('#rg-color-dot').style.background = hex;
    }

    qAll('.rg-swatch').forEach((sw) => {
      sw.onclick = () => {
        setColor(sw.getAttribute('data-color'));
        qAll('.rg-swatch').forEach((s) => s.classList.remove('active'));
        sw.classList.add('active');
      };
    });
    q('#rg-ed-color').oninput = (e) => setColor(e.target.value);
    q('#rg-ed-hex').oninput = (e) => {
      const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
      if (/^#[0-9a-fA-F]{6}$/.test(val)) setColor(val);
    };

    const syncBrushSize = (val) => {
      brushSize = Math.max(1, Math.min(40, parseInt(val, 10) || 6));
      q('#rg-ed-size').value = brushSize;
      q('#rg-ed-size-num').value = brushSize;
      q('#rg-size-readout').textContent = brushSize + 'px';
    };
    q('#rg-ed-size').oninput = (e) => syncBrushSize(e.target.value);
    q('#rg-ed-size-num').oninput = (e) => syncBrushSize(e.target.value);

    qAll('[data-stroke-style]').forEach((btn) => {
      btn.onclick = () => {
        strokeStyle = btn.getAttribute('data-stroke-style');
        qAll('[data-stroke-style]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });

    editorEl.onclick = (e) => {
      if (!e.target.closest('#rg-shapes-popover') && !e.target.closest('#rg-shapes-btn')) shapesPopover.style.display = 'none';
      if (!e.target.closest('#rg-color-popover') && !e.target.closest('#rg-color-btn')) colorPopover.style.display = 'none';
      if (!e.target.closest('.rg-ctx-menu')) closeContextMenu();
    };
    canvas.oncontextmenu = (e) => { e.preventDefault(); showLayerContextMenu(e.clientX, e.clientY, activeLayerId); };

    q('#rg-ed-guides').onclick = (e) => {
      showGuides = !showGuides;
      e.target.textContent = showGuides ? 'Guides: On' : 'Guides: Off';
      q('#rg-ed-guides-el').style.display = showGuides ? 'block' : 'none';
    };
    q('#rg-ed-undo').onclick = () => {
      if (undoStack.length > 0) {
        lctx.putImageData(undoStack.pop(), 0, 0);
        commitBufferToActiveLayer(); compositeAllLayers();
      }
    };

    q('#rg-add-sketch-layer').onclick = () => {
      commitBufferToActiveLayer();
      const fr = getActiveFrame();
      const ly = createDefaultLayer('Sketch ' + (fr.layers.length + 1), 'sketch', '');
      fr.layers.push(ly); activeLayerId = ly.id;
      saveState(); loadActiveLayerToBuffer(); renderLayersPanel();
    };
    q('#rg-add-img-layer').onclick = () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          commitBufferToActiveLayer();
          const fr = getActiveFrame();
          const ly = createDefaultLayer(f.name, 'image', ev.target.result);
          fr.layers.push(ly); activeLayerId = ly.id;
          saveState(); loadActiveLayerToBuffer(); renderLayersPanel();
        };
        r.readAsDataURL(f);
      };
      inp.click();
    };
    q('#rg-use-tpl-layer').onclick = () => {
      if (!savedTemplates.length) { alert('No saved templates yet. Right-click or hover a layer and click Save to create one.'); return; }
      const listText = savedTemplates.map((t, i) => `${i + 1}. ${t.name}`).join('\n');
      const pick = parseInt(prompt('Enter template number to insert:\n' + listText, '1'), 10);
      const tpl = savedTemplates[pick - 1];
      if (!tpl) return;
      commitBufferToActiveLayer();
      const fr = getActiveFrame();
      const ly = createDefaultLayer(tpl.name, 'sketch', tpl.dataUrl);
      fr.layers.push(ly); activeLayerId = ly.id;
      saveState(); loadActiveLayerToBuffer(); renderLayersPanel();
    };

    q('#rg-fr-add').onclick = () => {
      commitBufferToActiveLayer();
      scene.frames.push(createDefaultFrame());
      scene.activeFrameIdx = scene.frames.length - 1;
      activeLayerId = getActiveFrame().layers[0].id;
      saveState(); loadActiveLayerToBuffer(); renderLayersPanel(); renderFramesStrip();
    };
    q('#rg-fr-copy').onclick = () => { commitBufferToActiveLayer(); copiedFrame = JSON.parse(JSON.stringify(getActiveFrame())); };
    q('#rg-fr-paste').onclick = () => {
      if (!copiedFrame) return;
      commitBufferToActiveLayer();
      const pasted = JSON.parse(JSON.stringify(copiedFrame));
      pasted.id = uid('fr_'); pasted.layers.forEach((l) => { l.id = uid('ly_'); });
      scene.frames.push(pasted); scene.activeFrameIdx = scene.frames.length - 1;
      activeLayerId = getActiveFrame().layers[0].id;
      saveState(); loadActiveLayerToBuffer(); renderLayersPanel(); renderFramesStrip();
    };
    q('#rg-fr-fps').onchange = (e) => { scene.fps = parseInt(e.target.value, 10) || 24; saveState(); };
    q('#rg-fr-speed').onchange = (e) => { scene.speed = parseFloat(e.target.value) || 1; saveState(); };
    q('#rg-fr-play').onclick = (e) => {
      if (playTimer) { clearInterval(playTimer); playTimer = null; e.target.textContent = 'Play'; return; }
      e.target.textContent = 'Pause';
      const intervalMs = Math.max(16, Math.round(1000 / ((scene.fps || 24) * (scene.speed || 1))));
      playTimer = setInterval(() => {
        scene.activeFrameIdx = (scene.activeFrameIdx + 1) % scene.frames.length;
        activeLayerId = getActiveFrame().layers[0].id;
        loadActiveLayerToBuffer(); renderLayersPanel(); renderFramesStrip();
      }, intervalMs);
    };

    q('#rg-ed-save').onclick = () => {
      if (playTimer) { clearInterval(playTimer); playTimer = null; }
      closeContextMenu();
      commitBufferToActiveLayer();
      compositeAllLayers(true);
      setTimeout(() => {
        scene.thumbUrl = canvas.toDataURL('image/png');
        saveState();
        activeEditorApi = null;
        if (inlineCleanup) { try { inlineCleanup(); } catch (_) {} inlineCleanup = null; }
        editorEl.remove(); editorEl = null;
        if (isEmbedded && typeof opts.onSaveAndBack === 'function') {
          opts.onSaveAndBack();
        } else {
          renderBoard();
        }
      }, 30);
    };

    const pinCommentBtn = q('#rg-ed-comment-pin-btn');
    if (pinCommentBtn) {
      pinCommentBtn.onclick = () => {
        if (window.RegaarderCommentPins && typeof window.RegaarderCommentPins.togglePinMode === 'function') {
          const active = window.RegaarderCommentPins.togglePinMode(canvasWrap);
          pinCommentBtn.classList.toggle('rg-sb-btn-accent', active);
        }
      };
    }
    if (window.RegaarderCommentPins && typeof window.RegaarderCommentPins.mountOn === 'function') {
      window.RegaarderCommentPins.mountOn(canvasWrap, { scope: 'storyboard', sceneId: scene.id });
    }

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.round((e.clientX - rect.left) * (canvas.width / rect.width)),
        y: Math.round((e.clientY - rect.top) * (canvas.height / rect.height)),
        dispX: e.clientX - rect.left, dispY: e.clientY - rect.top,
        rectW: rect.width, rectH: rect.height
      };
    }

    function sampleColorAt(x, y) {
      const cx = Math.max(0, Math.min(canvas.width - 1, Math.round(x)));
      const cy = Math.max(0, Math.min(canvas.height - 1, Math.round(y)));
      const d = ctx.getImageData(cx, cy, 1, 1).data;
      const hex = '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      setColor(hex);
      return hex;
    }

    let zoomDragStart = null;

    canvas.onpointerdown = (e) => {
      if (e.button !== 0) return;
      const pos = getPos(e);
      if (zoomBoxMode) {
        zoomDragStart = pos; marquee.style.display = 'block';
        marquee.style.left = pos.dispX + 'px'; marquee.style.top = pos.dispY + 'px';
        marquee.style.width = '0px'; marquee.style.height = '0px';
        return;
      }
      if (tool === 'eyedropper') { sampleColorAt(pos.x, pos.y); return; }

      undoStack.push(lctx.getImageData(0, 0, layerCanvas.width, layerCanvas.height));
      if (undoStack.length > 20) undoStack.shift();

      if (tool === 'fill') {
        floodFill(lctx, layerCanvas.width, layerCanvas.height, pos.x, pos.y, hexToRgb(brushColor));
        getActiveLayer().vectors.push({ kind: 'fill', x: pos.x, y: pos.y, color: brushColor });
        commitBufferToActiveLayer(); compositeAllLayers();
        return;
      }

      isDrawing = true; startX = pos.x; startY = pos.y;
      currentPoints = [[pos.x, pos.y]];
      lctx.lineCap = 'round'; lctx.lineJoin = 'round';
      lctx.lineWidth = brushSize;
      applyStrokeStyle(lctx, strokeStyle, brushSize);

      if ((tool === 'brush' || tool === 'eraser') && strokeStyle !== 'straight') {
        lctx.beginPath(); lctx.moveTo(pos.x, pos.y);
        lctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        lctx.strokeStyle = brushColor;
      } else {
        lctx.globalCompositeOperation = 'source-over';
        snapshotBeforeShape = lctx.getImageData(0, 0, layerCanvas.width, layerCanvas.height);
      }
    };

    canvas.onpointermove = (e) => {
      const pos = getPos(e);
      q('#rg-coord-readout').textContent = `${pos.x}, ${pos.y}`;
      if (zoomBoxMode && zoomDragStart) {
        marquee.style.left = Math.min(zoomDragStart.dispX, pos.dispX) + 'px';
        marquee.style.top = Math.min(zoomDragStart.dispY, pos.dispY) + 'px';
        marquee.style.width = Math.abs(pos.dispX - zoomDragStart.dispX) + 'px';
        marquee.style.height = Math.abs(pos.dispY - zoomDragStart.dispY) + 'px';
        return;
      }
      if (!isDrawing) return;
      if ((tool === 'brush' || tool === 'eraser') && strokeStyle !== 'straight') {
        currentPoints.push([pos.x, pos.y]);
        lctx.lineTo(pos.x, pos.y); lctx.stroke();
      } else if (snapshotBeforeShape) {
        lctx.putImageData(snapshotBeforeShape, 0, 0);
        lctx.strokeStyle = brushColor; lctx.lineWidth = brushSize;
        applyStrokeStyle(lctx, strokeStyle, brushSize);
        const shapeToDraw = (tool === 'brush' && strokeStyle === 'straight') ? 'line' : activeShape;
        drawShapeOnCtx(lctx, shapeToDraw, startX, startY, pos.x, pos.y, brushSize);
      }
      compositeAllLayers();
    };

    canvas.onpointerup = (e) => {
      if (zoomBoxMode && zoomDragStart) {
        const pos = getPos(e); marquee.style.display = 'none';
        const selW = Math.abs(pos.dispX - zoomDragStart.dispX), selH = Math.abs(pos.dispY - zoomDragStart.dispY);
        const centerX = ((zoomDragStart.dispX + pos.dispX) / 2) / pos.rectW;
        const centerY = ((zoomDragStart.dispY + pos.dispY) / 2) / pos.rectH;
        if (selW > 12 && selH > 12) {
          const factor = Math.min(pos.rectW / selW, pos.rectH / selH);
          zoomLevel = Math.min(3, Math.max(1, Math.round(zoomLevel * factor * 100) / 100));
        } else {
          zoomLevel = Math.min(3, Math.round((zoomLevel + 0.5) * 100) / 100);
        }
        zoomDragStart = null; zoomBoxMode = false;
        zoomAreaBtn.classList.remove('active'); canvas.style.cursor = 'crosshair';
        applyZoom(centerX, centerY);
        return;
      }
      if (!isDrawing) return;
      const pos = getPos(e);
      isDrawing = false; snapshotBeforeShape = null;
      lctx.setLineDash([]); lctx.globalCompositeOperation = 'source-over';
      const ly = getActiveLayer();
      if (ly && tool === 'brush' && strokeStyle !== 'straight') {
        ly.vectors.push({ kind: 'stroke', points: currentPoints, color: brushColor, width: brushSize, style: strokeStyle });
      } else if (ly && (tool === 'shape' || strokeStyle === 'straight')) {
        const sh = strokeStyle === 'straight' ? 'line' : activeShape;
        ly.vectors.push({ kind: 'shape', shape: sh, x1: startX, y1: startY, x2: pos.x, y2: pos.y, color: brushColor, width: brushSize, style: strokeStyle });
      }
      commitBufferToActiveLayer(); compositeAllLayers();
    };

    // Expose live AI Harness hooks for this active editor session
    activeEditorApi = {
      getCanvasInfo: () => ({
        sceneId: scene.id, width: canvas.width, height: canvas.height,
        aspectRatio: scene.aspectRatio || state.aspectRatio,
        activeFrameIdx: scene.activeFrameIdx, frameCount: scene.frames.length,
        activeLayerId, fps: scene.fps, speed: scene.speed,
        layers: getActiveFrame().layers.map((l) => ({
          id: l.id, name: l.name, type: l.type, visible: l.visible,
          scale: l.scale, opacity: l.opacity, isReference: l.isReference
        }))
      }),
      getVectorHistory: (layerId) => {
        const ly = layerId ? getActiveFrame().layers.find((l) => l.id === layerId) : getActiveLayer();
        return ly ? ly.vectors : [];
      },
      drawStroke: (points, opts = {}) => {
        if (!Array.isArray(points) || points.length < 2) return false;
        lctx.save();
        lctx.strokeStyle = opts.color || brushColor;
        lctx.lineWidth = opts.width || brushSize;
        lctx.lineCap = 'round'; lctx.lineJoin = 'round';
        applyStrokeStyle(lctx, opts.style || 'solid', lctx.lineWidth);
        lctx.beginPath(); lctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) lctx.lineTo(points[i][0], points[i][1]);
        lctx.stroke(); lctx.restore();
        getActiveLayer().vectors.push({ kind: 'stroke', points, color: opts.color || brushColor, width: opts.width || brushSize, style: opts.style || 'solid' });
        commitBufferToActiveLayer(); compositeAllLayers();
        return true;
      },
      drawShape: (shape, x1, y1, x2, y2, opts = {}) => {
        lctx.save();
        lctx.strokeStyle = opts.color || brushColor;
        lctx.lineWidth = opts.width || brushSize;
        applyStrokeStyle(lctx, opts.style || 'solid', lctx.lineWidth);
        drawShapeOnCtx(lctx, shape, x1, y1, x2, y2, lctx.lineWidth);
        lctx.restore();
        getActiveLayer().vectors.push({ kind: 'shape', shape, x1, y1, x2, y2, color: opts.color || brushColor, width: opts.width || brushSize, style: opts.style || 'solid' });
        commitBufferToActiveLayer(); compositeAllLayers();
        return true;
      },
      fillAt: (x, y, color) => {
        const c = color || brushColor;
        floodFill(lctx, layerCanvas.width, layerCanvas.height, Math.round(x), Math.round(y), hexToRgb(c));
        getActiveLayer().vectors.push({ kind: 'fill', x, y, color: c });
        commitBufferToActiveLayer(); compositeAllLayers();
        return true;
      },
      sampleColorAt,
      addLayer: (opts = {}) => {
        commitBufferToActiveLayer();
        const fr = getActiveFrame();
        const ly = createDefaultLayer(opts.name || ('Layer ' + (fr.layers.length + 1)), opts.type || 'sketch', opts.dataUrl || '');
        if (typeof opts.opacity === 'number') ly.opacity = opts.opacity;
        if (typeof opts.isReference === 'boolean') ly.isReference = opts.isReference;
        fr.layers.push(ly); activeLayerId = ly.id;
        saveState(); loadActiveLayerToBuffer(); renderLayersPanel();
        return ly.id;
      },
      setLayerProps: (id, props = {}) => {
        const ly = getActiveFrame().layers.find((l) => l.id === id);
        if (!ly) return false;
        if (typeof props.visible === 'boolean') ly.visible = props.visible;
        if (typeof props.scale === 'number') ly.scale = props.scale;
        if (typeof props.opacity === 'number') ly.opacity = props.opacity;
        if (typeof props.isReference === 'boolean') ly.isReference = props.isReference;
        saveState(); compositeAllLayers(); renderLayersPanel();
        return true;
      },
      copyLayer: (id) => copyLayerById(id || activeLayerId),
      pasteLayer: () => pasteCopiedLayer(),
      addFrame: () => { q('#rg-fr-add').click(); return scene.activeFrameIdx; },
      selectFrame: (idx) => {
        if (idx < 0 || idx >= scene.frames.length) return false;
        commitBufferToActiveLayer(); scene.activeFrameIdx = idx;
        activeLayerId = getActiveFrame().layers[0].id;
        loadActiveLayerToBuffer(); renderLayersPanel(); renderFramesStrip();
        return true;
      },
      copyFrame: () => q('#rg-fr-copy').click(),
      pasteFrame: () => q('#rg-fr-paste').click(),
      setTiming: (opts = {}) => {
        if (opts.fps) scene.fps = opts.fps;
        if (opts.speed) scene.speed = opts.speed;
        saveState();
        return { fps: scene.fps, speed: scene.speed };
      },
      exportLayerSVG: (layerId) => {
        const ly = layerId ? getActiveFrame().layers.find((l) => l.id === layerId) : getActiveLayer();
        if (!ly) return '';
        const paths = ly.vectors.map((v) => {
          if (v.kind === 'stroke' && v.points.length) {
            const d = v.points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]).join(' ');
            return `<path d="${d}" fill="none" stroke="${v.color}" stroke-width="${v.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
          }
          if (v.kind === 'shape' && v.shape === 'rect') {
            return `<rect x="${Math.min(v.x1, v.x2)}" y="${Math.min(v.y1, v.y2)}" width="${Math.abs(v.x2 - v.x1)}" height="${Math.abs(v.y2 - v.y1)}" fill="none" stroke="${v.color}" stroke-width="${v.width}"/>`;
          }
          if (v.kind === 'shape' && v.shape === 'circle') {
            return `<circle cx="${v.x1}" cy="${v.y1}" r="${Math.round(Math.hypot(v.x2 - v.x1, v.y2 - v.y1))}" fill="none" stroke="${v.color}" stroke-width="${v.width}"/>`;
          }
          if (v.kind === 'shape' && v.shape === 'line') {
            return `<line x1="${v.x1}" y1="${v.y1}" x2="${v.x2}" y2="${v.y2}" stroke="${v.color}" stroke-width="${v.width}"/>`;
          }
          return '';
        }).join('');
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}">${paths}</svg>`;
      }
    };

    loadActiveLayerToBuffer();
    renderLayersPanel();
    renderFramesStrip();
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
  }

  function floodFill(ctx, w, h, sx, sy, fillRgba) {
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return;
    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;
    const idx0 = (sy * w + sx) * 4;
    const sr = data[idx0], sg = data[idx0 + 1], sb = data[idx0 + 2], sa = data[idx0 + 3];
    if (sr === fillRgba[0] && sg === fillRgba[1] && sb === fillRgba[2] && sa === fillRgba[3]) return;
    const stack = [[sx, sy]];
    const tol = 28;
    while (stack.length) {
      const [x, y] = stack.pop();
      const idx = (y * w + x) * 4;
      if (
        Math.abs(data[idx] - sr) <= tol &&
        Math.abs(data[idx + 1] - sg) <= tol &&
        Math.abs(data[idx + 2] - sb) <= tol &&
        Math.abs(data[idx + 3] - sa) <= tol
      ) {
        data[idx] = fillRgba[0]; data[idx + 1] = fillRgba[1]; data[idx + 2] = fillRgba[2]; data[idx + 3] = 255;
        if (x > 0) stack.push([x - 1, y]);
        if (x < w - 1) stack.push([x + 1, y]);
        if (y > 0) stack.push([x, y - 1]);
        if (y < h - 1) stack.push([x, y + 1]);
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function open() {
    ensureStyles();
    if (modalEl) modalEl.remove();
    modalEl = document.createElement('div');
    modalEl.className = 'rg-sb-root';
    modalEl.innerHTML = `
      <div class="rg-sb-topbar">
        <div class="rg-sb-brand">
          <span>Storyboard Sketch</span>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <select id="rg-sb-ratio" class="rg-sb-btn">
            ${Object.entries(ASPECT_RATIOS).map(([k, v]) => `<option value="${k}" ${k === state.aspectRatio ? 'selected' : ''}>${v.label}</option>`).join('')}
          </select>
          <button type="button" class="rg-sb-btn" id="rg-sb-batch-import">Batch Import</button>
          <button type="button" class="rg-sb-btn rg-sb-btn-accent" id="rg-sb-new-scene">+ Draw Scene</button>
          <button type="button" class="rg-sb-btn" id="rg-sb-close">Close</button>
        </div>
      </div>
      <div class="rg-sb-body" id="rg-sb-body"></div>
    `;
    document.body.appendChild(modalEl);

    modalEl.querySelector('#rg-sb-ratio').onchange = (e) => { state.aspectRatio = e.target.value; saveState(); };
    modalEl.querySelector('#rg-sb-batch-import').onclick = () => triggerBatchImport();
    modalEl.querySelector('#rg-sb-new-scene').onclick = () => addBlankScene(true);
    modalEl.querySelector('#rg-sb-close').onclick = () => { modalEl.remove(); modalEl = null; };
    renderBoard();
  }

  function openInline(hostEl, opts) {
    if (!hostEl) return;
    ensureStyles();
    if (!Array.isArray(state.scenes) || state.scenes.length === 0) {
      state.scenes = [{ id: uid('sc_'), title: 'Scene 1', aspectRatio: state.aspectRatio || '16:9', fps: 24, speed: 1, activeFrameIdx: 0, frames: [] }];
      saveState();
    }
    openSceneEditor(state.scenes[0].id, {
      hostEl,
      topbarHostEl: opts && opts.topbarHostEl,
      sidebarHostEl: opts && opts.sidebarHostEl,
      onSaveAndBack: opts && opts.onSaveAndBack
    });
  }

  function closeInline() {
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    closeContextMenu();
    activeEditorApi = null;
    if (inlineCleanup) { try { inlineCleanup(); } catch (_) {} inlineCleanup = null; }
    if (editorEl) { editorEl.remove(); editorEl = null; }
  }

  window.RegaarderStoryboardSketch = { open, openInline, closeInline, getState: () => state };

  // Programmatic AI Harness
  window.RegaarderStoryboardAI = new Proxy({}, {
    get(_, prop) {
      if (prop === 'open') return open;
      if (prop === 'openScene') return openSceneEditor;
      if (prop === 'getState') return () => state;
      if (activeEditorApi && typeof activeEditorApi[prop] === 'function') return activeEditorApi[prop];
      return () => { throw new Error('Storyboard Editor is not open. Call RegaarderStoryboardAI.openScene(id) first.'); };
    }
  });
})();
