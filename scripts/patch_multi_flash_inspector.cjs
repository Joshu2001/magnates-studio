const fs = require('fs');
const filePath = 'magnates-studio/public/js/tpl-contextual-inspector.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. In tplUpdateStageWithContextualData:
const target1 = "if (tplId === 'jani-ftx-logo-reveal') {";
const mountCode = `if (tplId === 'multi-image-flash-sequence') {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage) {
        if (!stage.querySelector('#multi-flash-wrapper')) {
          if (typeof window.tplMountMultiImageFlashStage === 'function') {
            window.tplMountMultiImageFlashStage(stage, data);
          }
        }
        if (typeof window.stepMultiImageFlashAnimation === 'function') {
          window.stepMultiImageFlashAnimation(stage, tplId, 0, data);
        }
      }
      return;
    }
    `;

if (!content.includes("if (tplId === 'multi-image-flash-sequence') {")) {
  content = content.replace(target1, mountCode + target1);
  console.log('Added stage mount handler to tplUpdateStageWithContextualData');
}

// 2. In tplRenderContextualInspector:
const target2 = "if (tplId === 'jani-ftx-logo-reveal') {";
const inspectorCode = `if (tplId === 'multi-image-flash-sequence') {
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
        if (typeof window.tplBuildMultiImageFlashInspector === 'function') {
          window.tplBuildMultiImageFlashInspector(container, data);
        }
      }
      return;
    }
    `;

const posInspector = content.indexOf("function tplRenderContextualInspector");
if (posInspector !== -1) {
  const targetInInspector = content.indexOf(target2, posInspector);
  if (targetInInspector !== -1) {
    content = content.substring(0, targetInInspector) + inspectorCode + content.substring(targetInInspector);
    console.log('Added inspector handler to tplRenderContextualInspector');
  }
}

// 3. Default contextual data initializer
const defTarget = "case 'jani-ftx-logo-reveal':";
const defCode = `case 'multi-image-flash-sequence':
      return (typeof window.getMultiImageFlashDefaultConfig === 'function') ? window.getMultiImageFlashDefaultConfig() : {};
    `;
if (!content.includes("case 'multi-image-flash-sequence':")) {
  content = content.replace(defTarget, defCode + defTarget);
  console.log('Added default config handler in tplGetContextualData');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('tpl-contextual-inspector.js patched successfully');
