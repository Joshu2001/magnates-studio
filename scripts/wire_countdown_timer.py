import os
import re

print("--- 1. PATCH INDEX.HTML ---")
with open('magnates-studio/public/index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

script_tag = '  <script src="js/countdown-timer-engine.js?v=1"></script>\n'
if 'js/countdown-timer-engine.js' not in idx_content:
    target = '  <script src="js/circular-spin-flashlight-glitch-engine.js?v=2"></script>'
    if target in idx_content:
        idx_content = idx_content.replace(target, target + '\n' + script_tag)
        print("Inserted script tag into index.html")
    else:
        print("Target for script tag not found in index.html")

url_hook = """    if (window.location.search.includes('open=countdowntimer') || window.location.search.includes('open=countdown-timer')) {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const tpl = (typeof EFFECT_TEMPLATES_DATA !== 'undefined') ? EFFECT_TEMPLATES_DATA.find(t => t.id === 'countdown-timer') : null;
          if (tpl && typeof openTopTemplateCustomizer === 'function') openTopTemplateCustomizer(tpl);
        }, 600);
      });
    }
"""
if 'open=countdowntimer' not in idx_content:
    url_target = "if (window.location.search.includes('open=circularspin') || window.location.search.includes('open=spinflash')) {"
    if url_target in idx_content:
        idx_content = idx_content.replace(url_target, url_hook + '    ' + url_target)
        print("Inserted URL hook into index.html")
    else:
        print("URL target hook not found in index.html")

with open('magnates-studio/public/index.html', 'w', encoding='utf-8') as f:
    f.write(idx_content)

print("--- 2. PATCH TPL-SNAPSHOTS.JS ---")
with open('magnates-studio/public/js/tpl-snapshots.js', 'r', encoding='utf-8') as f:
    snap_content = f.read()

snapshot_entry = """    'countdown-timer': `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
        <defs>
          <radialGradient id="cdt-bg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#2d060c"/>
            <stop offset="55%" stop-color="#120205"/>
            <stop offset="100%" stop-color="#030104"/>
          </radialGradient>
          <radialGradient id="cdt-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"/>
            <stop offset="60%" stop-color="#dc2626" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="225" fill="url(#cdt-bg)"/>
        
        <!-- Radar Circles & Ticks -->
        <circle cx="200" cy="112" r="78" fill="none" stroke="#ef4444" stroke-width="0.8" stroke-dasharray="2 4" opacity="0.35"/>
        <circle cx="200" cy="112" r="68" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.4"/>
        <circle cx="200" cy="112" r="58" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="364" stroke-dashoffset="91" opacity="0.9"/>
        <circle cx="200" cy="112" r="38" fill="url(#cdt-glow)"/>
        
        <!-- Cardinal crosshairs -->
        <line x1="200" y1="26" x2="200" y2="34" stroke="#ef4444" stroke-width="2"/>
        <line x1="200" y1="190" x2="200" y2="198" stroke="#ef4444" stroke-width="2"/>
        <line x1="114" y1="112" x2="122" y2="112" stroke="#ef4444" stroke-width="2"/>
        <line x1="278" y1="112" x2="286" y2="112" stroke="#ef4444" stroke-width="2"/>

        <!-- Top Status Pill -->
        <rect x="140" y="14" width="120" height="16" rx="4" fill="rgba(0,0,0,0.7)" stroke="#ef4444" stroke-width="0.8"/>
        <circle cx="150" cy="22" r="2.5" fill="#ef4444"/>
        <text x="204" y="25" fill="#f87171" font-family="monospace" font-size="7.5" font-weight="700" letter-spacing="1.5" text-anchor="middle">T-MINUS // ARMED</text>

        <!-- Big Center 3 -->
        <text x="200" y="132" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="56" text-anchor="middle" filter="drop-shadow(0 0 10px #ef4444)">3</text>
        <line x1="170" y1="140" x2="230" y2="140" stroke="#ef4444" stroke-width="2"/>
        <text x="200" y="152" fill="#fca5a5" font-family="monospace" font-size="7.5" font-weight="700" letter-spacing="2" text-anchor="middle">SECONDS</text>

        <!-- Bottom Status -->
        <text x="200" y="208" fill="#f87171" font-family="monospace" font-size="8" font-weight="700" letter-spacing="2" text-anchor="middle">&lt; CLIMAX IMPACT AT T-ZERO &gt;</text>
      </svg>
    `)},
"""

if "'countdown-timer':" not in snap_content:
    target_pos = snap_content.find("const SNAPSHOTS = {")
    if target_pos != -1:
        insert_idx = snap_content.find("\n", target_pos) + 1
        snap_content = snap_content[:insert_idx] + snapshot_entry + snap_content[insert_idx:]
        with open('magnates-studio/public/js/tpl-snapshots.js', 'w', encoding='utf-8') as f:
            f.write(snap_content)
        print("Updated tpl-snapshots.js with countdown-timer entry")
    else:
        print("Could not find SNAPSHOTS anchor")
else:
    print("tpl-snapshots.js already has countdown-timer")

print("--- 3. PATCH TPL-CONTEXTUAL-INSPECTOR.JS ---")
with open('magnates-studio/public/js/tpl-contextual-inspector.js', 'r', encoding='utf-8') as f:
    insp_content = f.read()

# Default getter hook
target_get = "    const d = DEFAULTS[tplId]"
hook_get = "    const d = DEFAULTS[tplId] || (tplId === 'countdown-timer' && typeof window.getCountdownTimerDefaultConfig === 'function' ? window.getCountdownTimerDefaultConfig() : null)"
if "tplId === 'countdown-timer'" not in insp_content:
    if target_get in insp_content:
        insp_content = insp_content.replace(target_get, hook_get, 1)
        print("Added getCountdownTimerDefaultConfig to tpl-contextual-inspector.js")

# Stage mount hook
stage_mount_hook = """    if (tplId === 'countdown-timer') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#cdt-wrapper')) {
          if (typeof window.tplMountCountdownTimerStage === 'function') {
            window.tplMountCountdownTimerStage(stage, data);
          }
        }
        if (typeof window.stepCountdownTimerAnimation === 'function') {
          window.stepCountdownTimerAnimation(stage, tplId, 0, data);
        }
      }
      return;
    }
"""
anchor_mount = "if (tplId === 'circular-spin-flashlight-glitch') {"
if "if (tplId === 'countdown-timer')" not in insp_content and anchor_mount in insp_content:
    insp_content = insp_content.replace(anchor_mount, stage_mount_hook + "\n        " + anchor_mount, 1)
    print("Added stage mount hook to tpl-contextual-inspector.js")

# Dynamic inspector controls hook
insp_controls_hook = """    if (tplId === 'countdown-timer') {
      const container = document.getElementById('tpl-modal-dynamic-controls');
      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');
      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');
      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');
      const wrapText = document.getElementById('tpl-modal-wrap-text');
      const tpl3dControls = document.getElementById('tpl-modal-3d-controls');
      if (tpl3dControls) { tpl3dControls.style.display = 'none'; tpl3dControls.innerHTML = ''; }
      if (stdLayers) stdLayers.style.display = 'none';
      if (wrapPrim) wrapPrim.style.display = 'none';
      if (wrapSec) wrapSec.style.display = 'none';
      if (wrapText) wrapText.style.display = 'none';
      if (container) {
        container.style.display = 'flex';
        const data = window.tplGetContextualData(tplId);
        if (typeof window.tplBuildCountdownTimerInspector === 'function') {
          window.tplBuildCountdownTimerInspector(container, data);
        }
      }
      return;
    }
"""
anchor_controls = "if (tplId === 'circular-spin-flashlight-glitch') {"
# find second occurrence for inspector controls
second_idx = insp_content.find(anchor_controls, insp_content.find(anchor_controls) + 1)
if second_idx != -1 and "if (tplId === 'countdown-timer')" in insp_content:
    # check if already added in second spot
    if insp_content.count("if (tplId === 'countdown-timer')") < 2:
        insp_content = insp_content[:second_idx] + insp_controls_hook + "\n        " + insp_content[second_idx:]
        print("Added dynamic controls hook to tpl-contextual-inspector.js")

with open('magnates-studio/public/js/tpl-contextual-inspector.js', 'w', encoding='utf-8') as f:
    f.write(insp_content)

print("--- 4. PATCH APP.JS ---")
with open('magnates-studio/public/js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add to UPGRADED_PRO_TESTER_IDS
upgraded_anchor = "const UPGRADED_PRO_TESTER_IDS = new Set(["
if "countdown-timer" not in app_content[:app_content.find(";", app_content.find(upgraded_anchor))]:
    app_content = app_content.replace(upgraded_anchor, upgraded_anchor + "'countdown-timer', ", 1)
    print("Added countdown-timer to UPGRADED_PRO_TESTER_IDS")

# Hover video preview hook (fxContainer)
hover_hook = """    } else if (tplId === 'countdown-timer') {
      if (typeof window.stepCountdownTimerAnimation === 'function') {
        const cdtData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('countdown-timer') : (typeof window.getCountdownTimerDefaultConfig === 'function' ? window.getCountdownTimerDefaultConfig() : {});
        if (!fxContainer.querySelector('#cdt-wrapper') && typeof window.tplMountCountdownTimerStage === 'function') {
          window.tplMountCountdownTimerStage(fxContainer, cdtData);
        }
        window.stepCountdownTimerAnimation(fxContainer, tplId, t, cdtData);
      }
"""
anchor_hover = "} else if (tplId === 'circular-spin-flashlight-glitch') {"
if "countdown-timer" not in app_content[app_content.find(anchor_hover)-200:app_content.find(anchor_hover)+200]:
    app_content = app_content.replace(anchor_hover, hover_hook + anchor_hover, 1)
    print("Added hover preview hook to app.js")

# Modal initial setup in openTopCustomizer
modal_init_hook = """    } else if (tpl.id === 'countdown-timer') {
      topCustomizerState.duration = 6;
      const stage = document.getElementById('tpl-modal-preview-stage');
      const cdtData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(tpl.id) : {};
      if (typeof window.tplMountCountdownTimerStage === 'function' && stage) {
        window.tplMountCountdownTimerStage(stage, cdtData);
      }
"""
anchor_modal_init = "} else if (tpl.id === 'jani-countdown-panic-suite') {"
if "tpl.id === 'countdown-timer'" not in app_content:
    if anchor_modal_init in app_content:
        app_content = app_content.replace(anchor_modal_init, modal_init_hook + anchor_modal_init, 1)
        print("Added modal initialization hook to app.js")

# Stage render in renderTopTemplatePreviewStage
stage_render_hook = """  if (tplId === 'countdown-timer') {
    const cdtData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('countdown-timer') : {};
    if (activeHoverAnimFrame) { cancelAnimationFrame(activeHoverAnimFrame); activeHoverAnimFrame = null; }
    hoverBridgeActive = false;
    hoverExternalT = null;
    if (typeof window.tplMountCountdownTimerStage === 'function') {
      window.tplMountCountdownTimerStage(stage, cdtData);
    }
    return;
  }
"""
anchor_stage_render = "if (tplId === 'circular-spin-flashlight-glitch') {"
# find occurrence around line 33600
occ_idx = app_content.find(anchor_stage_render, app_content.find("function renderTopTemplatePreviewStage()"))
if occ_idx != -1 and "tplId === 'countdown-timer'" not in app_content[occ_idx-300:occ_idx+300]:
    app_content = app_content[:occ_idx] + stage_render_hook + "\n  " + app_content[occ_idx:]
    print("Added stage render hook to app.js")

# Stepping animation in customizer timeline loop
timeline_step_hook = """  if (tplId === 'countdown-timer') {
    if (typeof window.stepCountdownTimerAnimation === 'function') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      const cdtData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('countdown-timer') : {};
      window.stepCountdownTimerAnimation(stage, 'countdown-timer', localSceneT, cdtData);
    }
  }
"""
step_anchor = "if (tplId === 'circular-spin-flashlight-glitch') {\n    if (typeof window.stepCircularSpinFlashAnimation === 'function') {"
if step_anchor in app_content and "stepCountdownTimerAnimation" not in app_content[app_content.find(step_anchor)-300:app_content.find(step_anchor)+300]:
    app_content = app_content.replace(step_anchor, timeline_step_hook + "\n  " + step_anchor, 1)
    print("Added timeline stepping hook to app.js")

with open('magnates-studio/public/js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("ALL WIRING COMPLETE!")
