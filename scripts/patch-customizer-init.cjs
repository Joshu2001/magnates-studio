const fs = require('fs');
let file = fs.readFileSync('magnates-studio/public/js/app.js', 'utf8');

const targetDoc2 = "} else if (tpl.id === 'wire-transfer') {";
const setupCode = `} else if (tpl.id === 'hypnotic-vertigo-roll') {
    topCustomizerState.primaryUrl = tpl.defaultImage || '/hypnotic_creation_adam.png';
    topCustomizerState.secondaryUrl = '';
    topCustomizerState.originalPhotoUrl = topCustomizerState.primaryUrl;
    if (!topCustomizerState.hypnoticConfig) {
      topCustomizerState.hypnoticConfig = (typeof window.getHypnoticDefaultConfig === 'function')
        ? window.getHypnoticDefaultConfig()
        : { mode: 'pendulum', spinSpeed: 24.0, maxTiltAngle: 18.0, zoomBase: 1.45, zoomBreathing: 0.22, scanlines: true, chromaticAberration: true, hypnoticSpiralWobble: true };
    }
  } else if (tpl.id === 'wire-transfer') {`;

if (file.includes(targetDoc2)) {
  file = file.replace(targetDoc2, setupCode);
  fs.writeFileSync('magnates-studio/public/js/app.js', file, 'utf8');
  console.log('Successfully added customizer initialization for hypnotic-vertigo-roll!');
} else {
  console.log('targetDoc2 not found');
}
