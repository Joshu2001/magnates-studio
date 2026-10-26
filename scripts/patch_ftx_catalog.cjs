const fs = require('fs');
const filePath = 'EFFECTS_CATALOG.md';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add to status matrix table
const matrixTarget = "| `jani-forbes-fraud-reveal` | **James Jani Forbes 3D Cover: Paparazzi Flash & Anamorphic Beam** | 3D Spatial & Motion | ? Implemented | Templates -> 3D Spatial -> *James Jani Forbes 3D Cover* |";
const matrixNew = matrixTarget + "\n| `jani-ftx-logo-reveal` | **James Jani FTX 3D Kinetic Logo Builder & Shockwave Reveal** | 3D Spatial & Motion | ✅ Implemented | Templates -> 3D Spatial -> *James Jani FTX 3D Kinetic Logo Builder* |";

content = content.replace(matrixTarget, matrixNew);

// 2. Add detailed section at the end of the catalog
const sectionDocumentation = `
---

## 🏛️ James Jani FTX 3D Kinetic Logo Builder & Shockwave Reveal

### Overview & Narrative Intent
* **System ID:** \`jani-ftx-logo-reveal\`
* **Industry & Creator Aliases:** James Jani Logo Builder, 3D Block Deconstruction, FTX Wavy Boom Reveal, Kinetic Logo Assembly
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ High Tension & Climactic Brand Reveal
* **Visual Description:** 
  The signature 3D title reveal from James Jani's famous FTX documentary (*"FTX - The $32 Billion Fraud"*). The iconic logo begins deconstructed into separate 3D geometric slabs tumbling in a deep dark void with cyan fog. A large rectangular slab rolls onto itself and drifts into the background while smaller electric-blue and white companion cubes float across the scene. The slab spins into camera, charges with an intense cyan flare, and dims sharply. At peak tension, it detonates an expanding **"wavy boom" shockwave** that physically ripples through space, wobbling the companion cubes with sinusoidal kinetic waves. All blocks then magnetically arrest their momentum and snap cleanly into the FTX glyph emblem alongside bold 3D extruded white typography (**"FTX"**) and glowing subtitle (**"THE GREAT FRAUD"**).

### 5-Phase Choreography Timeline
1. **Phase 1: The Tumble & Drift (0.0s – 1.8s):**
   * Large top slab rolls on itself along X/Y axes and recedes into depth.
   * White and cyan cubes drift right-to-left across the midground.
   * Materials remain matte/metallic with dark titanium bevels.
2. **Phase 2: The Charge, Flare & Sudden Dim (1.8s – 2.4s):**
   * Central slab rotates toward the camera and surges in emissive brightness (up to 4.5x bloom).
   * Right at peak tension, it suddenly dims down to 0.15 for maximum contrast anticipation.
3. **Phase 3: The Wavy Boom & Kinetic Ripple (2.4s – 4.0s):**
   * Concentric 3D shockwave rings blast radially from the center with glowing cyan bloom.
   * Invisible pressure wave sweeps past the floating companion cubes, causing violent sinusoidal wave oscillation (position wobble & rotational ripple).
   * Central slab executes a full 360° axial spin.
4. **Phase 4: Magnetic Convergence & Logo Assembly (4.0s – 5.6s):**
   * All 4 blocks snap into the exact proportions of the FTX glyph with cubic-eased magnetic inertia.
   * 3D extruded white letters **"FTX"** rush forward from depth and lock into position with specular glare.
   * Subtitle **"THE GREAT FRAUD"** fades up with letter-spacing tracking.
5. **Phase 5: Hero Hold (5.6s – 7.0s+):**
   * Full lockup gently floats in the dark void with floor reflections and ambient drifting dust motes.

### Contextual Inspector Parameters
\`\`\`json
{
  "brandName": "FTX",
  "subtitleText": "THE GREAT FRAUD",
  "subtitleVisible": true,
  "primaryColor": "#00f0ff",
  "secondaryColor": "#ffffff",
  "metalColor": "#0d1520",
  "boomColor": "#38bdf8",
  "boomIntensity": 1.6,
  "waveDistortion": 1.25,
  "waveFrequency": 14.0,
  "spinSpeed": 1.2,
  "bloomGlow": 2.2,
  "dustEnabled": true,
  "dustCount": 75,
  "floorReflections": true,
  "duration": 7.0
}
\`\`\`

### AI Action Signature (Machine-Readable Spec)
\`\`\`json
{
  "action": "apply_template",
  "templateId": "jani-ftx-logo-reveal",
  "category": "3D Spatial",
  "parameters": {
    "brandName": "FTX",
    "subtitleText": "THE GREAT FRAUD",
    "primaryColor": "#00f0ff",
    "secondaryColor": "#ffffff",
    "boomIntensity": 1.6,
    "waveDistortion": 1.25,
    "spinSpeed": 1.2,
    "bloomGlow": 2.2,
    "duration": 7.0
  }
}
\`\`\`
`;

content += sectionDocumentation;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated EFFECTS_CATALOG.md!');
