import os
import re

# 1. Update tpl-snapshots.js
with open('magnates-studio/public/js/tpl-snapshots.js', 'r', encoding='utf-8') as f:
    snap_content = f.read()

snapshot_entry = """    // Circular Arc Spin & Paparazzi Flashlight Glitch Transition
    'circular-spin-flashlight-glitch': `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
        <defs>
          <radialGradient id="csf-bg-dark" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stop-color="#0b1329"/>
            <stop offset="70%" stop-color="#050811"/>
            <stop offset="100%" stop-color="#020408"/>
          </radialGradient>
          <radialGradient id="csf-flash-burst" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="35%" stop-color="rgba(214,240,255,0.95)"/>
            <stop offset="70%" stop-color="rgba(56,189,248,0.3)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
          <linearGradient id="csf-arc-grad" x1="0%" y1="100%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ef4444"/>
            <stop offset="50%" stop-color="#f87171"/>
            <stop offset="100%" stop-color="#dc2626"/>
          </linearGradient>
        </defs>
        <rect width="400" height="225" fill="url(#csf-bg-dark)"/>
        <!-- Falling Particles -->
        <circle cx="85" cy="40" r="1.5" fill="#e2e8f0" opacity="0.6"/>
        <circle cx="120" cy="110" r="2.2" fill="#ffd166" opacity="0.8"/>
        <circle cx="170" cy="65" r="1.8" fill="#e2e8f0" opacity="0.7"/>
        <circle cx="230" cy="140" r="2.5" fill="#38bdf8" opacity="0.8"/>
        <circle cx="280" cy="75" r="1.5" fill="#e2e8f0" opacity="0.5"/>
        <circle cx="320" cy="130" r="2.0" fill="#ffd166" opacity="0.75"/>
        <circle cx="360" cy="90" r="1.5" fill="#e2e8f0" opacity="0.6"/>
        <circle cx="60" cy="165" r="2.2" fill="#e2e8f0" opacity="0.7"/>
        <circle cx="205" cy="180" r="1.8" fill="#38bdf8" opacity="0.6"/>
        <!-- Circular Doodle Arc Path -->
        <path d="M 110 145 C 100 65, 290 60, 285 140" fill="none" stroke="url(#csf-arc-grad)" stroke-width="3" stroke-dasharray="4,4"/>
        <polygon points="285,148 277,136 293,136" fill="#ef4444"/>
        <!-- Flashlight Optical Core -->
        <circle cx="200" cy="100" r="75" fill="url(#csf-flash-burst)"/>
        <!-- Glitch Slices -->
        <rect x="130" y="88" width="140" height="4" fill="rgba(255,0,85,0.7)"/>
        <rect x="145" y="105" width="130" height="3" fill="rgba(0,240,255,0.8)"/>
        <!-- Badge Title -->
        <rect x="80" y="185" width="240" height="26" rx="4" fill="rgba(0,0,0,0.85)" stroke="rgba(56,189,248,0.4)" stroke-width="1"/>
        <text x="200" y="202" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" text-anchor="middle">CIRCULAR SPIN &amp; 4-FLASH</text>
      </svg>
    `)},
"""

if "'circular-spin-flashlight-glitch':" not in snap_content:
    target_pos = snap_content.find("window.TPL_SNAPSHOTS = {")
    if target_pos != -1:
        insert_idx = snap_content.find("\n", target_pos) + 1
        snap_content = snap_content[:insert_idx] + snapshot_entry + snap_content[insert_idx:]
        with open('magnates-studio/public/js/tpl-snapshots.js', 'w', encoding='utf-8') as f:
            f.write(snap_content)
        print('Updated tpl-snapshots.js')
    else:
        print('Could not find TPL_SNAPSHOTS anchor')
else:
    print('tpl-snapshots.js already contains entry')

# 2. Update tpl-contextual-inspector.js
with open('magnates-studio/public/js/tpl-contextual-inspector.js', 'r', encoding='utf-8') as f:
    insp_content = f.read()

# In tplGetContextualData:
target_get = "    const d = DEFAULTS[tplId];"
rep_get = """    const d = DEFAULTS[tplId] || (tplId === 'circular-spin-flashlight-glitch' && typeof window.getCircularSpinFlashDefaultConfig === 'function' ? window.getCircularSpinFlashDefaultConfig() : null);"""
if target_get in insp_content and "tplId === 'circular-spin-flashlight-glitch'" not in insp_content:
    insp_content = insp_content.replace(target_get, rep_get, 1)

# In Stage mount step:
stage_hook = """    if (tplId === 'circular-spin-flashlight-glitch') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#csf-wrapper')) {
          if (typeof window.tplMountCircularSpinFlashStage === 'function') {
            window.tplMountCircularSpinFlashStage(stage, data);
          }
        }
        if (typeof window.stepCircularSpinFlashAnimation === 'function') {
          window.stepCircularSpinFlashAnimation(stage, tplId, 0, data);
        }
      }
      return;
    }
"""

anchor_stage = "if (tplId === 'multi-image-flash-sequence') {"
if anchor_stage in insp_content and "if (tplId === 'circular-spin-flashlight-glitch')" not in insp_content:
    insp_content = insp_content.replace(anchor_stage, stage_hook + "\n    " + anchor_stage, 1)

# In Inspector controls builder:
insp_hook = """    if (tplId === 'circular-spin-flashlight-glitch') {
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
        if (typeof window.tplBuildCircularSpinFlashInspector === 'function') {
          window.tplBuildCircularSpinFlashInspector(container, data);
        }
      }
      return;
    }
"""

anchor_insp = "if (tplId === 'multi-image-flash-sequence') {"
# find second occurrence of anchor_insp
second_idx = insp_content.find(anchor_insp, insp_content.find(anchor_insp) + len(anchor_insp))
if second_idx != -1:
    insp_content = insp_content[:second_idx] + insp_hook + "\n    " + insp_content[second_idx:]

with open('magnates-studio/public/js/tpl-contextual-inspector.js', 'w', encoding='utf-8') as f:
    f.write(insp_content)
print('Updated tpl-contextual-inspector.js')

# 3. Update app.js
with open('magnates-studio/public/js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add to BRIDGED_HOVER_TEMPLATE_IDS
if "'circular-spin-flashlight-glitch'" not in app_content:
    target_bridge = "const BRIDGED_HOVER_TEMPLATE_IDS = new Set(["
    rep_bridge = "const BRIDGED_HOVER_TEMPLATE_IDS = new Set(['circular-spin-flashlight-glitch', "
    app_content = app_content.replace(target_bridge, rep_bridge, 1)

# Add template object
tpl_obj = """  {
    id: 'circular-spin-flashlight-glitch',
    title: 'Circular Arc Spin & Paparazzi Flashlight Glitch Transition',
    category: 'Transitions',
    badge: 'Cinematic Burst',
    difficulty: 'Pro Editor',
    timeToApply: '5 sec',
    previewGradient: 'linear-gradient(135deg, rgba(3, 7, 18, 0.95), rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.95))',
    description: 'Image initiates a circular arc spin from left over head down to right, accompanied by falling particles and a 4-flash photoflash sequence (1 slow bloom, 3 fast paparazzi bursts) culminating in a digital glitch transition to a second person.',
    tags: ['Circular Spin', 'Doodle Arc', 'Flashlight', 'Paparazzi Flash', 'Falling Particles', 'Glitch Transition', 'AI Subject Reveal'],
    defaultImage: 'generated_person_1.jpg',
    secondaryImage: 'generated_person_2.jpg'
  },
"""

anchor_app_tpl = "id: 'multi-image-flash-sequence',"
if anchor_app_tpl in app_content and "id: 'circular-spin-flashlight-glitch'" not in app_content:
    idx = app_content.find(anchor_app_tpl)
    start_bracket = app_content.rfind("{", 0, idx)
    app_content = app_content[:start_bracket] + tpl_obj + app_content[start_bracket:]

# Add to openTopTemplateCustomizer
customizer_hook = """  } else if (tpl.id === 'circular-spin-flashlight-glitch') {
      topCustomizerState.primaryUrl = 'generated_person_1.jpg';
      topCustomizerState.secondaryUrl = 'generated_person_2.jpg';
      topCustomizerState.originalPhotoUrl = '';
      if (typeof window.tplMountCircularSpinFlashStage === 'function') {
        const stage = document.getElementById('tpl-modal-preview-stage');
        const d = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData(tpl.id) : {};
        if (stage) window.tplMountCircularSpinFlashStage(stage, d);
      }
"""
anchor_customizer = "} else if (tpl.id === 'cinematic-light-trail-typewriter') {"
if anchor_customizer in app_content and "tpl.id === 'circular-spin-flashlight-glitch'" not in app_content:
    app_content = app_content.replace(anchor_customizer, customizer_hook + anchor_customizer, 1)

# Add to renderTopTemplatePreviewStage
stage_mount_hook = """  if (tplId === 'circular-spin-flashlight-glitch') {
    const csfData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('circular-spin-flashlight-glitch') : {};
    if (activeHoverAnimFrame) { cancelAnimationFrame(activeHoverAnimFrame); activeHoverAnimFrame = null; }
    hoverBridgeActive = false;
    hoverExternalT = null;
    if (typeof window.tplMountCircularSpinFlashStage === 'function') {
      window.tplMountCircularSpinFlashStage(stage, csfData);
    }
    return;
  }
"""

step_anim_hook = """  if (tplId === 'circular-spin-flashlight-glitch') {
    if (typeof window.stepCircularSpinFlashAnimation === 'function') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      const csfData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('circular-spin-flashlight-glitch') : {};
      window.stepCircularSpinFlashAnimation(stage, 'circular-spin-flashlight-glitch', localSceneT, csfData);
    }
  }
"""

anchor_stage_render = "if (tplId === 'multi-image-flash-sequence') {"
if anchor_stage_render in app_content and "tplId === 'circular-spin-flashlight-glitch'" not in app_content:
    # First occurrence in renderTopTemplatePreviewStage
    app_content = app_content.replace(anchor_stage_render, stage_mount_hook + "\n  " + anchor_stage_render, 1)
    # Second occurrence in step animation section
    second_occ = app_content.find(anchor_stage_render, app_content.find(anchor_stage_render) + len(anchor_stage_render))
    if second_occ != -1:
        app_content = app_content[:second_occ] + step_anim_hook + "\n  " + app_content[second_occ:]

with open('magnates-studio/public/js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)
print('Updated app.js')
