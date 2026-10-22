with open('magnates-studio/public/js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add to UPGRADED_PRO_TESTER_IDS
target_upgraded = "const UPGRADED_PRO_TESTER_IDS = new Set(['conspiracy-board'"
rep_upgraded = "const UPGRADED_PRO_TESTER_IDS = new Set(['circular-spin-flashlight-glitch', 'conspiracy-board'"
if target_upgraded in text:
    text = text.replace(target_upgraded, rep_upgraded, 1)
    print('Added to UPGRADED_PRO_TESTER_IDS')

# 2. Add to hover preview HTML generator
hover_anchor = "} else if (tplId === 'jani-cross-section-reveal') {"
hover_hook = """} else if (tplId === 'circular-spin-flashlight-glitch') {
      if (typeof window.stepCircularSpinFlashAnimation === 'function') {
        const csfData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('circular-spin-flashlight-glitch') : (typeof window.getCircularSpinFlashDefaultConfig === 'function' ? window.getCircularSpinFlashDefaultConfig() : {});
        if (!fxContainer.querySelector('#csf-wrapper') && typeof window.tplMountCircularSpinFlashStage === 'function') {
          window.tplMountCircularSpinFlashStage(fxContainer, csfData);
        }
        window.stepCircularSpinFlashAnimation(fxContainer, tplId, t, csfData);
      }
"""
if hover_anchor in text:
    first_occ = text.find(hover_anchor)
    text = text[:first_occ] + hover_hook + text[first_occ:]
    print('Added first hover hook')
    second_occ = text.find(hover_anchor, first_occ + len(hover_hook) + len(hover_anchor))
    if second_occ != -1:
        text = text[:second_occ] + hover_hook + text[second_occ:]
        print('Added second hover hook')

# 3. Add to updateTopCustomizerFrame loop around line 34630
frame_anchor = "if (tplId === 'jani-cross-section-reveal') {"
frame_hook = """if (tplId === 'circular-spin-flashlight-glitch') {
    if (typeof window.stepCircularSpinFlashAnimation === 'function') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      const csfData = (typeof window.tplGetContextualData === 'function') ? window.tplGetContextualData('circular-spin-flashlight-glitch') : (typeof window.getCircularSpinFlashDefaultConfig === 'function' ? window.getCircularSpinFlashDefaultConfig() : {});
      window.stepCircularSpinFlashAnimation(stage, 'circular-spin-flashlight-glitch', localSceneT, csfData);
    }
  }

  """
if frame_anchor in text and "if (tplId === 'circular-spin-flashlight-glitch') {" not in text[text.find(frame_anchor) - 300:text.find(frame_anchor)]:
    text = text.replace(frame_anchor, frame_hook + frame_anchor, 1)
    print('Added updateTopCustomizerFrame hook')

with open('magnates-studio/public/js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully updated app.js')
