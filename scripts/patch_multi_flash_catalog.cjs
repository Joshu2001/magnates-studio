const fs = require('fs');
const filePath = 'EFFECTS_CATALOG.md';
let content = fs.readFileSync(filePath, 'utf8');

const tableTarget = "| `jani-forbes-fraud-reveal` | **James Jani Forbes 3D Cover: Paparazzi Flash & Anamorphic Beam** | 3D Spatial & Motion | ✅ Implemented | Templates -> 3D Spatial -> *James Jani Forbes 3D Cover* |";
const newTableRow = "\n| `multi-image-flash-sequence` | **Modular Multi-Image Shutter Flash & Lateral Sequence Suite** | Transitions & Storyboard | ✅ Implemented | Templates -> Transitions -> *Modular Multi-Image Shutter Flash* |";

if (!content.includes('multi-image-flash-sequence')) {
  content = content.replace(tableTarget, tableTarget + newTableRow);

  const docSection = `\n\n---

## ⚡ 17. Modular Multi-Image Shutter Flash & Lateral Sequence Suite

### 17.1 Cinematic Multi-Image Flash & Lateral Storyboard Engine
* **System ID:** \`multi-image-flash-sequence\`
* **Category:** Transitions & Documentary Storytelling
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ High-Energy Investigative Shock $\\rightarrow$ Lateral Ping-Pong $\\rightarrow$ Sluggish Center Dread
* **Visual & Acoustic Choreography:**
  1. **Clip 1 (Forensic Photoflash):** Realistic camera flash with non-linear phosphor decay, optical halation, camera micro-shake, and acoustic shutter sound profile.
  2. **Clip 2 (Left-to-Right Lateral Push):** Directional push with simulated shutter angle motion blur.
  3. **Clip 3 (Right-to-Left Lateral Push):** Counter-directional push maintaining narrative momentum.
  4. **Clip 4 (Center Core Sluggish Bloom):** Slow, heavy expansion from the center core of the previous image accompanied by sub-bass bloom.
  5. **Modular Extension:** Supports unlimited ($N$) images with customizable transition types, durations, and stock swapping.
* **1-Click Mood Psychology Presets:**
  * **Investigative Exposé (Cold Xenon):** Heavy DSLR mirror slap, high contrast, cold daylight tint.
  * **Vintage Archival (Warm Amber):** Nostalgic 35mm mechanical Leica snap, warm incandescent flash, soft film grain.
  * **High-Octane Paparazzi Burst:** Triple strobe burst, aggressive whips, fast-paced editorial energy.
  * **True Crime / Psychological Descent:** Muted desaturated flash, disposable crunch, sluggish center creep with deep sub-bass.
* **How to Access:** Navigate to **Templates** -> **Transitions** -> **"Modular Multi-Image Shutter Flash & Lateral Sequence Suite"**.
`;
  content += docSection;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('EFFECTS_CATALOG.md updated successfully');
} else {
  console.log('Already registered in catalog');
}
