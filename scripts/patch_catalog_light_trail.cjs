const fs = require('fs');

let cat = fs.readFileSync('EFFECTS_CATALOG.md', 'utf8');

// 1. Add to status scorecard table
const targetRow = "| `jani-forbes-fraud-reveal` | **James Jani Forbes 3D Cover: Paparazzi Flash & Anamorphic Beam** | 3D Spatial & Motion | ✅ Implemented | Templates -> 3D Spatial -> *James Jani Forbes 3D Cover* |";
const newRow = targetRow + "\n| `cinematic-light-trail-typewriter` | **Cinematic Light Trail Typewriter & Glitch Reveal** | Text & Titles | ✅ Implemented | Templates -> Text & Titles -> *Cinematic Light Trail Typewriter* |";

if (!cat.includes('cinematic-light-trail-typewriter')) {
  cat = cat.replace(targetRow, newRow);

  // 2. Append full specification section
  const section = `

---

## 📽️ Cinematic Light Trail Typewriter & Glitch Reveal Suite

### Overview & Narrative Intent
* **System ID:** \`cinematic-light-trail-typewriter\`
* **Industry & Creator Aliases:** Anamorphic Streak Typewriter, James Jani Mystery Title, High-Tension Statement Reveal, Digital Glitch Breakout
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ High Tension & Climactic Narrative Statement
* **Visual Description:**
  The iconic mystery documentary statement opener: pitch-black cinematic screen where condensed uppercase typography (*"THIS IS NOT ONE OF THOSE STORIES"*) is typed character-by-character with a pulsating cursor. As each character appears, it leaves a brilliant, directional trail of light (signature 2.39:1 anamorphic horizontal lens flare streak) with an intense white-hot core and soft dissipating bloom tails. CRT scanlines, 35mm film grain, and subtle dust scratches add optical analog weight. Once the phrase completes, after a brief psychological pause, the text violently detonates in a high-frequency digital CRT glitch (horizontal slice displacement, chromatic aberration split, and static noise scramble) before immediately revealing a secondary background plate or video through an impactful camera flash punch-zoom.

### Granular Customization Capabilities
1. **Background**:
   * Changeable black screen void with subtle radial vignette.
   * Upload custom background image or video file (\`bgMediaUrl\`).
   * Color tinting, darkness / dimming slider (0% - 100%), and vignette shadow intensity.
   * Preset backdrops: Pure Black Void, Smoky Fog, Boardroom Silhouette, Tactical Desk, CCTV Surveillance.
2. **Typography & Content**:
   * Fully editable text string with character-by-character animation.
   * Font selector: Oswald (Tall Condensed), Bebas Neue, Inter, JetBrains Mono, Cinzel, Anton.
   * Font size, letter spacing (tracking), font weight, text color, and diffuse glow.
   * Blinking cursor style: Underscore (\`_\`), Vertical Pipe (\`|\`), Block (\`█\`), or None.
   * Typing duration and pause before glitch.
3. **Light Trail & Direction**:
   * Multi-directional light control:
     * **Horizontal (0°)**: Classic anamorphic cinema lens flare streak cutting across the frame.
     * **Vertical (90°)**: Volumetric ascending/descending pillar of light.
     * **Diagonal (45° / 135°)**: Angled dynamic streak.
     * **Custom Dial (0° - 360°)**: Granular rotational steering.
     * **Radial (360°)**: Expanding omnidirectional bloom halo.
   * Light color picker (white, electric cyan, amber, crimson, neon violet).
   * Beam length / spread slider (150px - 1400px).
   * Core beam intensity and bloom diffusion radius.
   * Trail persistence / linger decay rate.
4. **Glitch-Out Climax**:
   * High-frequency horizontal slice displacement (reproducing Image 3).
   * Chromatic RGB split (red/cyan separation) and digital raster noise.
   * Glitch intensity slider (0.2x - 2.5x) and duration slider (0.2s - 1.5s).
5. **Secondary Scene Reveal**:
   * Upload custom target image or video (\`revealMediaUrl\`).
   * Built-in dramatic presets (Boardroom, Tactical War Room, CCTV, Tokyo Night).
   * Transition styles: Camera Flash Punch-Zoom, Glitch Impact Cut, Cross Dissolve.
6. **Atmospheric Texture**:
   * CRT scanlines with toggle and opacity slider.
   * Procedural floating dust motes & 35mm hair scratch flickers.
   * Optical chromatic aberration.

### Contextual Inspector Parameters
\`\`\`json
{
  "text": "THIS IS NOT ONE OF THOSE STORIES",
  "fontFamily": "Oswald, sans-serif",
  "fontSize": 44,
  "letterSpacing": 6,
  "textColor": "#ffffff",
  "cursorStyle": "_",
  "cursorBlinkSpeed": 2.5,
  "typingDuration": 3.2,
  "holdBeforeGlitch": 1.2,
  "lightDirection": "horizontal",
  "lightAngle": 0,
  "lightColor": "#ffffff",
  "trailLength": 750,
  "beamIntensity": 2.2,
  "bloomRadius": 28,
  "backgroundColor": "#000000",
  "bgMediaUrl": "",
  "bgDarkness": 0.85,
  "vignetteIntensity": 0.85,
  "scanlines": true,
  "scanlineOpacity": 0.28,
  "dustScratches": true,
  "dustCount": 45,
  "chromaticAberration": true,
  "glitchEnabled": true,
  "glitchIntensity": 1.35,
  "glitchDuration": 0.65,
  "revealMediaUrl": "/boardroom_scene_hd.jpg",
  "revealStyle": "flash-zoom",
  "revealHoldDuration": 2.2,
  "totalDuration": 7.2
}
\`\`\`

### AI Action Signature (Machine-Readable Spec)
\`\`\`json
{
  "action": "apply_template",
  "templateId": "cinematic-light-trail-typewriter",
  "category": "Text & Titles",
  "parameters": {
    "text": "THIS IS NOT ONE OF THOSE STORIES",
    "lightDirection": "horizontal",
    "lightColor": "#ffffff",
    "beamIntensity": 2.2,
    "glitchIntensity": 1.35,
    "revealMediaUrl": "/boardroom_scene_hd.jpg",
    "revealStyle": "flash-zoom"
  }
}
\`\`\`
`;

  cat += section;
  fs.writeFileSync('EFFECTS_CATALOG.md', cat, 'utf8');
  console.log('Updated EFFECTS_CATALOG.md');
} else {
  console.log('Already in EFFECTS_CATALOG.md');
}
