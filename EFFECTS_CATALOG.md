# Magnates Studio — Effects & Capabilities Catalog (ND Registry)

> **File Purpose:** Master registry of all visual effects, kinetic typography styles, audio treatments, and editing capabilities in **Magnates Studio**. 
> Designed as a dual-purpose specification:
> 1. **Human Creator Reference:** How to achieve each effect in the studio UI (recipes, keyboard shortcuts, right-click actions).
> 2. **AI Agent / Automation Schema:** Deterministic JSON-ready parameter signatures so an LLM or autonomous editor can compose timelines programmatically.

---

## 📊 Capabilities Scorecard & Status Matrix

| ID | Effect / Capability | Category | Current Status | Primary Trigger / Shortcut |
| :--- | :--- | :--- | :--- | :--- |
| `fx-punch-zoom` | **Snap Punch Zoom** | Motion & Framing | ✅ Implemented | Right-click Clip -> *Add Punch Zoom* or Tool `Z` |
| `fx-loupe-callout`| **Magnifying Loupe Lens** | Motion & Callout | ✅ Implemented | Right-click Clip -> *Add Loupe Callout* or Tool `L` |
| `fx-text-depth` | **Depth Text (Behind / Before Subject)** | Composition & Depth | ✅ Implemented | Right-click -> *Send to Back* / *Bring to Front* |
| `fx-ai-cutout` | **AI Subject Isolation / Cutout** | Masking & Cutout | ✅ Implemented | Right-click -> *Remove Background* |
| `fx-vector-sticker`| **Magnates Vector / Paper Cutout** | Stylization | ✅ Implemented | Right-click -> *Magnates Vector / Paper Cutout* |
| `fx-kinetic-type` | **Kinetic Typography Engine** | Text & Titles | ✅ Implemented | Text Inspector -> Anim Dropdown + Accent color |
| `fx-procedural-sfx`| **Procedural SFX Engine** | Audio Design | ✅ Implemented | Auto-triggers on animation pops / whooshes |
| `fx-voice-denoise` | **Voiceover Audio Denoise** | Audio Restoration| ✅ Implemented | Python Denoise Pipeline / Clean script |
| `fx-split-blade` | **Playhead Razor / Split Blade** | Timeline Utility | ✅ Implemented | Shortcut `S` or Split Tool |
| `fx-magnetic-snap` | **Magnetic Timeline & Layer Snapping** | Timeline Utility | 🚧 Experimental | Auto-snap to playhead / adjacent clip boundaries |
| `fx-document-scan` | **Vox Document Highlighter Sweep** | Motion & Callout | ⏳ Backlog | Planned: Animated yellow/cyan pen stroke |
| `fx-parallax-tilt` | **3D Parallax Camera Drift** | 2.5D Camera | ⏳ Backlog | Planned: 3D perspective tilt on cutout + backdrop |
| `fx-paper-texture` | **Stop-Motion Crumpled Paper Overlay** | Texture & Grain | ⏳ Backlog | Planned: 12fps cycling grain blend mode |

---

## 🎬 1. Motion & Framing Effects

### 1.1 Snap Punch Zoom
* **System ID:** `punch_zoom` / `snap_zoom`
* **Industry & Creator Aliases:** Vox Punch Zoom, Beat Zoom, Hard Impact Zoom, Snap Push-In, Sudden Crop
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ High Energy / Pacing Reset
* **Visual Description:** A rapid, punchy cubic-eased camera zoom into a specific focal point on an image or document clip.
* **🎯 Editorial Intent & When to Use:**
  * **Pacing Reset (Pattern Interrupt):** When a scene or monologue has been talking for >3-4 seconds and viewer attention risks dropping.
  * **Script Twist / Dramatic Reveal:** When the narrator delivers a punchline, an accusation, or a shocking fact (e.g., *"and that's when the money vanished"*).
  * **Beat Sync:** Timed right on a drum kick, cymbal crash, or sub-bass drop to marry visuals to audio rhythm.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Never use two punch zooms back-to-back within <2.5 seconds (causes visual exhaustion/nausea).
  * Avoid punching into low-resolution assets where the crop exposes blurry pixelation.
* **🤖 AI Narrative & Script Triggers:**
  * Keywords: `suddenly`, `however`, `secret`, `the catch`, `shocking`, `millions`, `disaster`
  * Audio Cue: Sudden rise in voiceover pitch, audio pause followed by a harsh consonant, or drum impact.
* **How to Achieve in Magnates Studio (UI Recipe):**
  1. Add an image or video clip to the timeline.
  2. **Method A (Toolbar):** Select the **Punch Zoom Tool** (`tool-snap-zoom`) from the toolbar, then click on the exact point in the canvas preview where you want the camera to punch into.
  3. **Method B (Context Menu):** Right-click the clip on the timeline or canvas -> select **"Add Punch Zoom"**.
  4. **Fine-Tuning:** In the Inspector panel, adjust the target zoom scale (e.g. `1.5x` - `3.0x`), start time offset, and drag the visual crosshair target on the canvas.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "apply_zoom_effect",
    "trackType": "image",
    "clipId": "<target_clip_id>",
    "parameters": {
      "zoomEffect": "snap",
      "zoomScale": 2.2,
      "zoomStartTime": 0.5,
      "zoomOriginX": 0.5,
      "zoomOriginY": 0.42,
      "easing": "cubic_ease_out",
      "duration": 0.42,
      "sfx": "snap_zoom"
    }
  }
  ```

---

### 1.2 Magnifying Loupe / Circular Callout
* **System ID:** `loupe_zoom` / `circular_callout`
* **Industry & Creator Aliases:** Documentary Magnifying Glass, Forensic Loupe, Document Highlight Circle, Johnny Harris Inspection Ring
* **Status:** ✅ Implemented
* **Pacing & Energy:** 🔍 Analytical / Investigative
* **Visual Description:** Creates a localized circular (or rectangular) magnifying lens overlay with a clean cyan/white neon bezel ring and subtle drop shadow over a specific document detail, chart figure, or face.
* **🎯 Editorial Intent & When to Use:**
  * **Forensic Evidence & Proof:** Directing viewer attention to fine print, a signed document line, an email header, or a tiny percentage on a graph.
  * **Complex Infographics:** When the entire graphic contains too much clutter and you want the viewer to look *only* at one data point without cutting away.
  * **Face Recognition in Crowds:** Highlighting a key personality or culprit inside a historical group photo or conference screenshot.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Do not use for generic beauty shots or cinematic b-roll with no specific micro-detail.
  * Avoid covering more than 35% of the total screen space with the loupe bezel, or the background context is lost.
* **🤖 AI Narrative & Script Triggers:**
  * Keywords: `look closely`, `hidden clause`, `in the fine print`, `paragraph 4`, `this number`, `right here`
  * Visual Asset Type: PDF scans, financial balance sheets, court filings, stock charts, satellite maps.
* **How to Achieve in Magnates Studio (UI Recipe):**
  1. Select the clip on the timeline.
  2. Select the **Loupe Tool** (`tool-loupe`) or right-click the clip -> select **"Add Loupe Callout"**.
  3. Click and drag the loupe crosshair over the specific text line, invoice number, or detail.
  4. In the Inspector, switch shape between **Circle** (`btn-loupe-shape-circle`) and **Rectangle** (`btn-loupe-shape-rect`), and set magnification (`1.5x` to `4.0x`).
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "apply_loupe_callout",
    "clipId": "<target_clip_id>",
    "parameters": {
      "zoomEffect": "loupe",
      "shape": "circle",
      "zoomScale": 2.5,
      "zoomOriginX": 0.65,
      "zoomOriginY": 0.35,
      "bezelColor": "#00f0ff",
      "radiusRatio": 0.22
    }
  }
  ```

---

## 🎨 2. Layering, Cutout & Depth Effects

### 2.1 Depth Text (Text Behind Subject / Sandwich Text)
* **System ID:** `text_depth_layering` / `sandwich_text`
* **Industry & Creator Aliases:** Depth Text, Subject Sandwich, 3D Text Behind Person, Magnates Cutout Layering
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ High Energy / Premium Aesthetic
* **Visual Description:** Massive kinetic typography placed physically behind a foreground person or object cutout, but in front of the background scene, creating instant high-budget 3D depth.
* **🎯 Editorial Intent & When to Use:**
  * **Footage Shortage / Abstract Concepts ("The B-Roll Filler"):** When the narrator talks about an abstract business strategy, philosophy, or internal scandal where no real video footage exists. It transforms a static stock portrait into a high-energy cinematic sequence.
  * **Chapter / Major Topic Introductions:** Opening hooks, thesis statements, or act transitions (e.g., *"Chapter 2: The Monopoly"*).
  * **Elevating Low-Budget Assets:** Turns ordinary static headshots into magazine-cover-style visual showstoppers.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Do not use for long sentences or paragraphs (>5-6 words). Depth text must be 1 to 4 punchy, high-impact words; otherwise it becomes illegible behind the subject.
  * Don't use if the foreground subject has wispy hair or blurry borders without clean AI cutout edges.
* **🤖 AI Narrative & Script Triggers:**
  * Script Structure: Sentence intros, video hooks (00:00 - 00:30), chapter titles, one-word thematic statements (`CORRUPTION`, `MONOPOLY`, `THE COLLAPSE`).
* **How to Achieve in Magnates Studio (UI Recipe):**
  1. Add a photo or cutout clip to the timeline.
  2. Right-click the image clip -> select **"Remove Background" (AI Cutout)** so the subject is isolated with transparency.
  3. Add a **Text Clip** over the same time range.
  4. Right-click the Image clip -> select **"Bring to Front"** (or in Inspector click `Front`), OR right-click the Text clip -> select **"Send to Back"** (`Behind Text`).
  5. The canvas renderer immediately places the typography between background and foreground cutout.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "set_layer_hierarchy",
    "clips": [
      { "id": "<background_image_id>", "layerOrder": "back", "zIndex": 10 },
      { "id": "<kinetic_text_id>", "layerOrder": "middle", "zIndex": 20 },
      { "id": "<foreground_cutout_id>", "layerOrder": "front", "zIndex": 30, "hasCutout": true }
    ]
  }
  ```

---

### 2.2 Magnates Vector / Paper Cutout (Comic / Sticker Contour)
* **System ID:** `vector_cutout` / `paper_sticker_fx`
* **Industry & Creator Aliases:** Magnates Media White Outline, Paper Cutout Sticker, Graphic Novel Border, Stop-Motion Cutout
* **Status:** ✅ Implemented
* **Pacing & Energy:** 🎨 Stylized Documentary / Playful Satire
* **Visual Description:** Takes an isolated subject and renders a crisp, bold multi-pass white and dark outline contour around the silhouette, evoking a tangible paper cutout or documentary graphic novel aesthetic.
* **🎯 Editorial Intent & When to Use:**
  * **Separation From Cluttered Backgrounds:** When the subject blends into a busy or dark backdrop and needs an instant pop to stand out.
  * **Satirical / Critical Tone:** Giving CEOs, politicians, or business moguls a slightly stylized, animated comic-book/puppet caricature feel.
  * **Collage Storytelling:** When assembling multiple elements onto the screen simultaneously (e.g., money stacks, company logos, and an executive's cutout).
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Avoid when the video aims for a strictly somber, tragic, or hyper-photorealistic cinematic tone where stylized comic borders feel inappropriate.
* **🤖 AI Narrative & Script Triggers:**
  * Tone: Irony, corporate exposes, satirical bios, playful comparisons (`versus`, `competitors`, `the CEO`).
* **How to Achieve in Magnates Studio (UI Recipe):**
  1. Select any transparent cutout or image clip.
  2. Right-click the clip -> select **"Magnates Vector / Paper Cutout"**.
  3. Alternatively, toggle **"Paper Cutout / Vector FX"** in the Right Sidebar Inspector.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "toggle_clip_filter",
    "clipId": "<target_clip_id>",
    "parameters": {
      "vectorEffect": true,
      "strokeWidth": 6,
      "strokeColor": "#ffffff",
      "shadowDrop": true
    }
  }
  ```

---

## 🔤 3. Kinetic Typography Engine

### 3.1 Kinetic Text Animations & Highlighting
* **System ID:** `kinetic_typography`
* **Industry & Creator Aliases:** Vox Big Typography, Word-by-Word Highlight, Punch Headline, Kinetic Pop
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ Variable (Punchy to Measured)
* **🎯 Editorial Intent & When to Use:**
  * **Visual Anchoring (Audio Comprehension):** Visual reinforcement for names, dates, financial sums, or complex jargon so viewers don't lose the thread.
  * **Pacing & Rhythm Driving:** Syncing word highlights to the exact cadence of the speaker's vocal stresses, creating addictive viewer retention.
  * **Hook Reinforcement:** Displaying the central premise or provocative question during the first 5 seconds of the video.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Avoid subtitle wall-of-text: never put full multi-sentence paragraphs on screen as kinetic text.
  * Do not animate every single word in a sentence; highlight only the 1-2 words that carry emotional weight.
* **🤖 AI Narrative & Script Triggers:**
  * Sentence structure: Interrogative hooks (*"Why did...?"*, *"How does...?"*), quantifiable claims (*"$42 Billion"*, *"80% drop"*), and key quotes.
* **Supported Styles:**
  * `pop`: Bouncy scale pop on arrival with focal red/cyan drop shadow. Best for punchy single words or keywords.
  * `slide_up` / `slide_down` / `slide_left` / `slide_right`: Directional smooth camera glide. Best for questions and quotes.
  * `zoom_in`: Dramatic scale from `0.2` to `1.0`. Best for startling revelations.
  * `stamp`: Impact slam with camera shake and heavy SFX. Best for verdict words (*GUILTY*, *FRAUD*, *BANNED*).
  * `typewriter`: Character-by-character investigative reveal. Best for leaked messages and search queries.
  * `wipe_right`: Smooth horizontal mask wipe. Best for chapter subheadings.
  * `materialize`: Blur-to-sharp dissolve. Best for philosophical or atmospheric statements.
* **How to Achieve in Magnates Studio (UI Recipe):**
  1. Click **"Add Text Overlay"** on canvas or from context menu.
  2. In the Inspector, input the headline (e.g., `"Did Google pump and dump?"`).
  3. In the **Highlight Words** field, enter the specific keywords to emphasize (e.g., `"pump and dump"`).
  4. Select highlight color (e.g. Magnates Red `#ff334b` or Cyber Cyan `#00f0ff`).
  5. Select **Anim Style** (`pop`, `slide_up`, `stamp`, etc.).
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "create_kinetic_text",
    "parameters": {
      "text": "The Billion Dollar Scam",
      "highlight": "Billion Dollar",
      "fontFamily": "Inter, sans-serif",
      "fontSize": 72,
      "textColor": "#FFFFFF",
      "highlightColor": "#FF334B",
      "anim": "pop",
      "sfx": "whoosh",
      "position": "center"
    }
  }
  ```

---

## 🔊 4. Audio Architecture & Restoration

### 4.1 WebAudio Procedural SFX Engine
* **System ID:** `procedural_sfx`
* **Status:** ✅ Implemented
* **🎯 Editorial Intent & When to Use:**
  * **Haptic Audio Subconscious Reinforcement:** Grounding every visual motion (zooms, text pops, loupe sweeps) with physical sound so cuts feel satisfying and weighty.
  * **Subconscious Tension:** Deep bass hits cue the viewer's brain that something serious or consequential just occurred.
* **Sound Palette:**
  * `whoosh`: Bandpass filtered white noise frequency sweep. (Use on quick pans, text slides, and cutaways).
  * `bass_hit` / `impact`: Deep 808 sub-bass drop with punch envelope. (Use on shocking title stamps and scene endings).
  * `snap_zoom`: High-speed camera whoosh-snap. (Use strictly on punch zooms).
  * `shutter_click`: Dual-click mechanical camera shutter. (Use on photo reveals or evidence presentation).
* **How to Trigger:** Automatically attached to kinetic titles and punch zooms, or configured per clip via Inspector.

---

### 4.2 Background Noise Removal (Audio Denoise)
* **System ID:** `audio_denoise_pipeline`
* **Industry & Creator Aliases:** Speech Isolation, Voice De-hum, De-reverb, Studio Clean
* **Status:** ✅ Implemented (`denoise.py` / `.agents/skills/audio-denoise`)
* **🎯 Editorial Intent & When to Use:**
  * **Amateur Audio Salvage:** Cleaning fan hum, street rumble, or air conditioner hiss from mobile voice notes or Zoom interviews before timeline assembly.
* **How to Trigger:** Run audio through the built-in noise removal skill targeting either `natural` or `aggressive` noise suppression profiles.

---

## 🚀 5. Signature Composite Recipes (Combos)

These are multi-effect presets that give videos the signature high-production look:

### 🌟 Recipe A: "The Vox Investigative Breakdown"
* **Components:**
  1. `Cutout Image` on Foreground.
  2. `Depth Text` behind subject in uppercase `Oswald` or `Inter ExtraBold`.
  3. `Snap Punch Zoom` triggered at 0.5s targeting the subject's face.
  4. `Procedural SFX` (`whoosh` + `snap_zoom`) fired at zoom transition.

### 🌟 Recipe B: "The Magnates Financial Dossier"
* **Components:**
  1. Document / Stock Chart image.
  2. `Magnates Vector / Paper Cutout` white sticker outline.
  3. `Loupe Callout` magnifying the critical headline or revenue drop.
  4. Highlighted Kinetic Pop title in red `#ff334b`.

---

## 🔮 6. Roadmap & Planned Capabilities (Backlog)

* [ ] **Animated Document Highlighter Sweep (`fx-highlighter-sweep`):** Realistic hand-drawn fluorescent highlighter bar moving across scanned PDF text.
* [ ] **3D Parallax Tilt (`fx-parallax-tilt`):** 2.5D camera drift where foreground cutout shifts faster than the background on mouse drag or timeline playback.
* [ ] **Stop-Motion Frame Rate Limiter (`fx-posterize-time`):** Restricting cutout animation to 12fps / 8fps for an authentic paper collage feel.
* [ ] **Auto Subtitle Whisper Alignment (`fx-auto-captions`):** Direct audio-to-kinetic-text alignment with karaoke-style per-word highlighting.
