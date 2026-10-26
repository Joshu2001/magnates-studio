const fs = require('fs');
const filePath = 'magnates-studio/public/js/tpl-contextual-inspector.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = "if (tplId === 'jani-ftx-logo-reveal') {\n      const container = document.getElementById('tpl-modal-dynamic-controls');";
const pos = content.indexOf(target);
if (pos !== -1) {
  const inspectorCode = "if (tplId === 'multi-image-flash-sequence') {\n" +
    "      const container = document.getElementById('tpl-modal-dynamic-controls');\n" +
    "      const stdLayers = document.getElementById('tpl-modal-standard-layers-section');\n" +
    "      const wrapPrim = document.getElementById('tpl-modal-wrap-primary');\n" +
    "      const wrapSec = document.getElementById('tpl-modal-wrap-secondary');\n" +
    "      const wrapText = document.getElementById('tpl-modal-wrap-text');\n" +
    "      const tpl3dControls = document.getElementById('tpl-modal-3d-controls');\n" +
    "      if (tpl3dControls) { tpl3dControls.style.display = 'none'; tpl3dControls.innerHTML = ''; }\n" +
    "      if (stdLayers) stdLayers.style.display = 'none';\n" +
    "      if (wrapPrim) wrapPrim.style.display = 'none';\n" +
    "      if (wrapSec) wrapSec.style.display = 'none';\n" +
    "      if (wrapText) wrapText.style.display = 'none';\n" +
    "      if (container) {\n" +
    "        container.style.display = 'flex';\n" +
    "        const data = window.tplGetContextualData(tplId);\n" +
    "        if (typeof window.tplBuildMultiImageFlashInspector === 'function') {\n" +
    "          window.tplBuildMultiImageFlashInspector(container, data);\n" +
    "        }\n" +
    "      }\n" +
    "      return;\n" +
    "    }\n    ";
  content = content.substring(0, pos) + inspectorCode + content.substring(pos);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully inserted multi-image-flash-sequence inspector block!');
} else {
  console.error('Target not found!');
}
