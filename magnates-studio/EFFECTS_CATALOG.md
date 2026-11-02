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
| `fx-3d-fly-through`| **3D Camera Fly-Through (Depth Zoom)** | Transitions & Motion | ✅ Implemented | Right-click Clip -> *⚡ 3D Fly-Through* (1-Click) or Inspector |
| `fx-directional-push`| **Directional Push / Pan Under (4-Way)**| Transitions & Motion | ✅ Implemented | Right-click Clip -> *➡️ Directional Push* (1-Click) or Inspector |
| `fx-morph-cut` | **Morph Cut (Optical Blend)** | Transitions & Motion | ✅ Implemented | Right-click Clip -> *🌊 Morph Cut* (1-Click) or Chip |
| `fx-foreground-reveal`| **Foreground Reveal / Split Wipe** | Transitions & Motion | ✅ Implemented | Right-click Clip -> *📐 Foreground Reveal* (1-Click) or Chip |
| `fx-text-depth` | **Depth Text (Behind / Before Subject)** | Composition & Depth | ✅ Implemented | Right-click -> *Send to Back* / *Bring to Front* |
| `fx-ai-cutout` | **AI Subject Isolation / Cutout** | Masking & Cutout | ✅ Implemented | Right-click -> *Remove Background* |
| `fx-vector-sticker`| **Magnates Vector / Paper Cutout** | Stylization | ✅ Implemented | Right-click -> *Magnates Vector / Paper Cutout* |
| `fx-kinetic-type` | **Kinetic Typography Engine** | Text & Titles | ✅ Implemented | Text Inspector -> Anim Dropdown + Accent color |
| `fx-rolling-counter`| **Dynamic Rolling Number Counter** | Text & Infographics | ✅ Implemented | Text Inspector -> Anim -> *Dynamic Number Counter* or Charts -> *1,014% Metric* |
| `fx-dynamic-area-chart`| **Progressive Dual-Line & Area Chart** | Motion Infographics | 🚀 Added (Template) | Templates -> Infographics -> *Dynamic Area Spread* |
| `fx-staggered-bar` | **Staggered Metric Bar Pop-Up** | Motion Infographics | 🚀 Added (Template) | Templates -> Infographics -> *Staggered Bar Reveal* |
| `fx-liquid-pyramid` | **Liquid Wave & Glowing Funnel / Pyramid** | Motion Infographics | 🚀 Added (Template) | Templates -> Infographics -> *Liquid Funnel Tier* |
| `fx-procedural-sfx`| **Procedural SFX Engine** | Audio Design | ✅ Implemented | Auto-triggers on animation pops / whooshes |
| `fx-voice-denoise` | **Voiceover Audio Denoise** | Audio Restoration| ✅ Implemented | Python Denoise Pipeline / Clean script |
| `fx-split-blade` | **Playhead Razor / Split Blade** | Timeline Utility | ✅ Implemented | Shortcut `S` or Split Tool |
| `fx-magnetic-snap` | **Magnetic Timeline & Layer Snapping** | Timeline Utility | 🚧 Experimental | Auto-snap to playhead / adjacent clip boundaries |
| `fx-document-scan` | **Vox Document Highlighter Sweep & Loupe Suite** | Motion & Callout | ✅ Implemented | Templates -> *Document Highlighter & Forensic Loupe Suite* or Clip Menu -> *Add Animated Highlighter* / *Add Whiteout Fade* |
| `fx-parallax-tilt` | **OG 3-Layer Parallax Engine** | 2.5D Camera & Depth | ✅ Implemented | Templates -> 3D Spatial -> *OG 3-Layer Parallax Engine* |
| `fx-spooner-parallax` | **2.5D Parallax Photo Effect** | 2.5D Camera & Depth | ✅ Implemented | Templates -> 3D Spatial -> *2.5D Parallax Photo Effect* or Clip Menu -> *⚡ 2.5D Parallax Photo* |
| `jani-forbes-fraud-reveal` | **James Jani Forbes 3D Cover: Paparazzi Flash & Anamorphic Beam** | 3D Spatial & Motion | ✅ Implemented | Templates -> 3D Spatial -> *James Jani Forbes 3D Cover* |
| `multi-image-flash-sequence` | **Modular Multi-Image Shutter Flash & Lateral Sequence Suite** | Transitions & Storyboard | ✅ Implemented | Templates -> Transitions -> *Modular Multi-Image Shutter Flash* |
| `cinematic-light-trail-typewriter` | **Cinematic Light Trail Typewriter & Glitch Reveal** | Text & Titles | ✅ Implemented | Templates -> Text & Titles -> *Cinematic Light Trail Typewriter* |
| `jani-cinematic-letterbox` | **James Jani Cinematic Letterbox & Lower Caption Frame** | Documentary & Framing | ✅ Implemented | Templates -> Documentary -> *James Jani Cinematic Letterbox* |
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

### 1.3 3D Camera Fly-Through / Seamless Zoom-Through
* **System ID:** `fx-3d-fly-through` / `fly_through`
* **Industry & Creator Aliases:** Magnates Zoom-Through, 3D Camera Fly-Through, Continuous Depth Push, Parallax Camera Transition, Overlap Push-In
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ Cinematic / Hypnotic Retention Flow
* **Visual Description:** 
  * The outgoing image (Clip A) begins scaling forward towards the viewer with cinematic motion blur and radial speed lines.
  * **Crucial Overlap Dynamic:** Before Clip A disappears or finishes fading away, Clip B (the incoming image) emerges from deep center space (scale `0.45x`) and scales into full frame (`1.0x`).
  * Because the two images overlap seamlessly during the transition, the viewer experiences them not as two separate static pictures, but as a continuous forward camera voyage through layered space.
* **🎯 Editorial Intent & When to Use:**
  * **Seamless Scene Transitions:** Moving between two narrative beats, historical photos, or case-study evidence without breaking the visual spell.
  * **Retention Driving:** Eliminating hard jump cuts that cause viewers to look away or scroll.
  * **High-Budget Documentary Flow:** Emulating the signature visual pacing of Magnates Media, Vox, and Bloomberg documentary segments.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Avoid overusing on every single cut (limit to major topic transitions, chapter openings, or rhythmic vocal peaks every 6–10 seconds).
  * Ensure the incoming clip has enough resolution to avoid blur when scaling in.
* **🤖 AI Narrative & Script Triggers:**
  * Keywords: `next`, `meanwhile`, `behind closed doors`, `what happened next`, `then came`, `step two`
  * Visual Asset Type: Two adjacent archival photos, portrait-to-landscape transitions, stock chart to executive photo.
* **How to Achieve in Magnates Studio (UI Recipe):**
  * **1-Click Method (Instant Context Menu):** Right-click the incoming clip on the timeline -> click **"⚡ 3D Fly-Through Transition"**. It automatically applies the `0.7s` duration and pairs it with the `whoosh` procedural sound effect.
  * **2-Click Method (Timeline Transition Chip):** Click the purple **Transition Chip** situated between the two clips on the timeline -> select the **"⚡ 3D Fly-Through"** preset card -> Click **"Apply Transition"**.
  * **Inspector Method:** Select the incoming clip -> set `Transition` to `3D Fly-Through` -> set duration (`0.5s`–`1.2s`) and SFX to `whoosh`.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "apply_clip_transition",
    "clipId": "<target_clip_id>",
    "parameters": {
      "transition": "fly_through",
      "duration": 0.7,
      "sfx": "whoosh",
      "direction": "center",
      "overlapMode": "depth_continuous",
      "scaleRangeOut": [1.0, 2.5],
      "scaleRangeIn": [0.45, 1.0],
      "radialBloom": true
    }
  }
  ```

---

### 1.4 Directional Push & Underneath Layer Overlap
* **System ID:** `fx-directional-push` / `directional_push`
* **Industry & Creator Aliases:** Directional Pan Under, Continuous Push-In, Slide Reveal, YouTuber Overlap Transition, Multi-Angle Pan
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ Kinetic / Continuous Momentum
* **Visual Description:**
  * **Directional Freedom:** Incoming Clip B emerges dynamically from the **Left (`⬅️`)**, **Right (`➡️`)**, **Top (`⬆️`)**, or **Bottom (`⬇️`)**.
  * **Underneath Layer Overlap (Magnates Secret):** Unlike traditional hard slides where the first image is abruptly pushed off, Clip B appears **right underneath** Clip A while Clip A is still gliding and slowly dissolving. Clip B is already established in frame before Clip A leaves!
  * Alternatively, set to **Push Over Top** with a cinematic drop shadow cast onto Clip A.
* **🎯 Editorial Intent & When to Use:**
  * **Directional Narrative Flow:** When presenting sequential ideas (e.g. left-to-right timeline progression, step 1 to step 2).
  * **Maintaining Momentum:** Keeping high-energy storytelling flowing without visual halts.
* **How to Achieve in Magnates Studio (UI Recipe):**
  * **Method A (1-Click Context Menu):** Right-click the incoming clip -> select **"➡️ Directional Push / Pan Under"**. Clicking again cycles directions (`Left` -> `Right` -> `Top` -> `Bottom`).
  * **Method B (Sidebar Inspector):** Select the clip -> in **"Selected Clip Settings"** under **"Transition & Overlap"**:
    * Pick incoming direction: `⬅️ Left`, `➡️ Right`, `⬆️ Top`, `⬇️ Down`, or `🔍 Depth`.
    * Toggle overlap mode: **"Layer Underneath"** vs **"Push Over Top"**.
    * Adjust **Duration / Speed Slider** (`0.2s` to `2.5s`) or tap quick speed presets (`Fast 0.3s`, `Smooth 0.7s`, `Cinema 1.2s`).
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "apply_clip_transition",
    "clipId": "<target_clip_id>",
    "parameters": {
      "transition": "directional_push",
      "direction": "left",
      "overlapMode": "underneath",
      "duration": 0.7,
      "sfx": "whoosh"
    }
  }
  ```

---

### 1.5 Morph Cut / Optical Blend
* **System ID:** `fx-morph-cut` / `morph_cut`
* **Industry & Creator Aliases:** Morph Cut, Seamless Cut, Optical Flow Blend, Fluid Shape Morph
* **Status:** ✅ Implemented
* **Pacing & Energy:** 🌊 Subtle / Invisible Continuity
* **Visual Description:**
  * Smooth optical flow cross-blend between two clips with directional micro-warping and luminous smear in the center.
  * Eliminates harsh cut lines when jumping between similar angles or subjects.
* **🎯 Editorial Intent & When to Use:**
  * **Talking Head / Interview Jump Cuts:** Smoothing out vocal pauses, stutters, or awkward cuts between two similar headshots.
  * **Before/After Comparisons:** Morphing an old logo into a new one, or a company's early office into their modern headquarters.
* **How to Achieve in Magnates Studio (UI Recipe):**
  * Click the **Transition Chip** on the cut point -> select **"Morph Cut"** card -> Click **Apply**.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "apply_clip_transition",
    "clipId": "<target_clip_id>",
    "parameters": {
      "transition": "morph_cut",
      "duration": 0.6,
      "sfx": "whoosh",
      "opticalSmear": true
    }
  }
  ```

---

### 1.6 Foreground Reveal / Push Wipe
* **System ID:** `fx-foreground-reveal` / `mask_reveal`
* **Industry & Creator Aliases:** Foreground Wipe, Depth Split Reveal, Parallax Divider Wipe, Object Slide Reveal
* **Status:** ✅ Implemented
* **Pacing & Energy:** 📐 Structural / Dynamic Reveal
* **Visual Description:**
  * Outgoing Clip A stays grounded while incoming Clip B sweeps in across an eased boundary line with a luminous neon cyan border and physical drop shadow.
  * Both images are visible simultaneously on either side of the sweep line.
* **🎯 Editorial Intent & When to Use:**
  * **Comparative Reveals:** Contrasting two competitors (e.g. Apple vs. Android, Coke vs. Pepsi).
  * **Document / Map Unmasking:** Revealing satellite maps, corporate structures, or redacted files.
* **How to Achieve in Magnates Studio (UI Recipe):**
  * Click the **Transition Chip** on the cut point -> select **"Foreground Reveal"** card -> Click **Apply**.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "apply_clip_transition",
    "clipId": "<target_clip_id>",
    "parameters": {
      "transition": "mask_reveal",
      "duration": 0.6,
      "sfx": "whoosh",
      "edgeColor": "#00f0ff",
      "dropShadow": true
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

```

---

## 📈 4. Motion Infographics & Animated Data Visuals

This section catalogs high-retention motion charts popularized by Vox, Johnny Harris, Magnates, and Alex Hormozi style video breakdowns. These graphics are not static data dumps; they animate progressively over time, highlight comparative gaps, and use luminous accents to command viewer attention.

---

### 4.1 Progressive Dual-Line & Area Spread Chart ("Cost Per Lead / Click")

![Dynamic Dual-Line Area Chart](file:///c:/Users/user/Documents/antigravity/noble-bell/docs/assets/templates/dynamic_area_chart.png)
![Cost Per Click Downward Draw](file:///c:/Users/user/Documents/antigravity/noble-bell/docs/assets/templates/cost_per_click_drop.png)

* **System ID:** `fx-dynamic-area-chart` / `line_area_draw`
* **Industry & Creator Aliases:** Trim Path Line Draw, Dynamic Area Fill, Gap Comparison Chart, Vox Metrics Sweep
* **Visual Description:** 
  * A continuous line graph starts with zero length and progressively draws itself from left to right across the canvas following a custom easing curve.
  * Individual data node dots scale up in sequence as the leading edge of the stroke crosses their X coordinates.
  * Beneath the curve, a semi-transparent monochrome or accent gradient fill unmasks simultaneously (or cascades downward) to reveal the volume/area.
  * When showing two comparative curves (e.g. baseline vs. current), the shaded area between both curves dynamically shrinks or expands, exposing the "distance" or delta between the metrics.
* **🎯 Editorial Intent & When to Use:**
  * **Revealing Trends Over Time:** When narrating a timeline (e.g., *"between January and November, acquisition costs plummeted"*). The line draw paces the narration word-for-word.
  * **Cost Drops & Disasters:** Highlighting a sharp falloff or cliff in metrics (e.g. CAC dropping to zero or revenue collapsing).
  * **Comparative Spreads:** Emphasizing margin or discrepancy between two competing figures.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Do not display all data points instantaneously like a static slide; without the progressive write-on, the viewer's eyes wander before the speaker delivers the takeaway.
  * Do not use overly erratic or chaotic line jitter that makes the overarching directional trend ambiguous.
* **🤖 AI Narrative & Script Triggers:**
  * Keywords: `cost per lead`, `cost per click`, `margin`, `dropped by`, `fell off a cliff`, `gap widened`, `over the course of months`
  * Visual Asset Type: Time-series tables, financial reports, Google/Meta Ads dashboards.
* **How to Achieve this Effect (Plain-Text Guide & Recipes):**
  * **In Magnates Studio (Pre-built Template):**
    1. Open the **Templates** tab -> **Infographics** -> select **"Dynamic Area Spread"**.
    2. Enter or paste your numerical data points (or select presets like *Steep Decline*, *Volatile Growth*, *Dual Comparison*).
    3. Set `Draw Duration` (default: `1.8s` with `cubic_bezier(0.25, 1, 0.5, 1)` easing).
    4. Enable `Area Fill Gradient` and adjust fill opacity (`0.15` to `0.40`).
    5. Check `Animate Node Points` to automatically spawn bouncing indicator dots on each coordinate.
  * **In Video Editors (After Effects / Premiere):**
    1. Draw your line path using the Pen Tool on a Shape Layer.
    2. Add **Trim Paths** -> keyframe `End` from `0%` to `100%`. Set Easy Ease (`F9`) and pull the graph velocity handle forward for a snappy ramp-down.
    3. Duplicate the shape layer, close the path to the bottom axis baseline, and add a Fill with a Vertical Linear Gradient.
    4. Add a **Linear Wipe** (Angle: 90°) to the fill layer and link its completion percentage to the Trim Path `End` keyframe via an expression (`linear(value, 0, 100, 100, 0)`).
  * **In Code / Web (SVG + CSS/JS):**
    1. Compute total path length via `SVGPathElement.getTotalLength()`.
    2. Set `stroke-dasharray: length` and animate `stroke-dashoffset` from `length` to `0`.
    3. Apply an SVG `<clipPath>` bounding rectangle that animates its `width` from `0` to `100%` across the duration.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "create_infographic_chart",
    "template": "dynamic_area_spread",
    "parameters": {
      "title": "COST PER LEAD",
      "dataSeries": [
        { "name": "Organic", "values": [42, 60, 50, 78, 62, 51, 68, 48, 70, 52, 64, 40, 68, 25, 18], "color": "#FFFFFF", "fillOpacity": 0.35 },
        { "name": "Paid Ads", "values": [30, 48, 32, 64, 40, 22, 38, 32, 45, 18, 34, 15, 42, 10, 8], "color": "#B0B0B0", "fillOpacity": 0.20 }
      ],
      "animation": {
        "type": "progressive_write_on",
        "duration": 1.6,
        "easing": "ease_out_cubic",
        "staggerPoints": true
      },
      "showGridLines": true,
      "showDistanceGap": true
    }
  }
  ```

---

### 4.2 Staggered Metric Bar Pop-Up ("Conversion Rate")

![Staggered Metric Bar Pop-Up](file:///c:/Users/user/Documents/antigravity/noble-bell/docs/assets/templates/staggered_bar_chart.png)

* **System ID:** `fx-staggered-bar` / `bar_stagger_pop`
* **Industry & Creator Aliases:** Kinetic Bar Chart, Sequential Growth Bars, Neon Pillar Reveal
* **Visual Description:**
  * Clean vertical columns/bars emerge from a grounded zero baseline, rising smoothly one by one with a slight staggered delay (e.g. 60ms between each column).
  * Bars possess a signature high-visibility neon accent color (e.g., lime green `#76ff03` or neon cyan `#00f0ff`) against a dark matte background.
  * The peak bar (or the target milestone month) triggers an intensified luminous outer glow or scale pulse when reached.
* **🎯 Editorial Intent & When to Use:**
  * **Categorical / Monthly Growth:** Showing progression from bad to great (e.g., *"our conversion rate climbed steadily every month until peaking in October"*).
  * **Leaderboard Comparison:** Comparing multiple companies, products, or channels side-by-side.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Avoid animating all bars upward in unison; it lacks rhythm and fails to direct the viewer through the narrative progression.
* **🤖 AI Narrative & Script Triggers:**
  * Keywords: `conversion rate`, `monthly breakdown`, `soared`, `peaked at`, `month after month`, `consistently climbed`
  * Visual Asset Type: Bar graphs, quarterly revenue comparisons, conversion funnel steps.
* **How to Achieve this Effect (Plain-Text Guide & Recipes):**
  * **In Magnates Studio (Pre-built Template):**
    1. Select **Templates** -> **Infographics** -> **"Staggered Bar Reveal"**.
    2. Input month labels (`Jan` through `Dec`) and values.
    3. Choose bar highlight palette (e.g. *Neon Lime*, *Cyber Cyan*, *Electric Amber*).
    4. Set `Stagger Delay` (default: `0.08s` per bar) and `Growth Easing` (`spring_soft` or `cubic_ease_out`).
    5. Check `Highlight Peak Bar` to automatically apply outer bloom glow to the maximum value.
  * **In Video Editors (After Effects):**
    1. Set the anchor point of each bar shape layer to its bottom center.
    2. Animate `Scale Y` from `0%` to `100%` with an easing curve like `easeOutBack` (overshoot `105%` before settling to `100%`).
    3. Shift each layer in the timeline forward by 3 to 5 frames sequentially (Sequence Layers).
    4. Add a Glow effect (Glow Radius: `40`, Intensity: `0.8`) on an adjustment layer or applied directly to the top bar.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "create_infographic_chart",
    "template": "staggered_bar_reveal",
    "parameters": {
      "title": "CONVERSION RATE",
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      "values": [12, 28, 25, 32, 60, 62, 40, 63, 72, 85, 52, 35],
      "barColor": "#76FF03",
      "staggerDelay": 0.07,
      "riseDuration": 0.5,
      "peakHighlight": { "index": 9, "glow": true }
    }
  }
  ```

---

### 4.3 Liquid Wave & Glowing Funnel / Pyramid ("3% Buying Now")

![Liquid Wave Glowing Pyramid](file:///c:/Users/user/Documents/antigravity/noble-bell/docs/assets/templates/liquid_glowing_pyramid.png)

* **System ID:** `fx-liquid-pyramid` / `wave_funnel_glow`
* **Industry & Creator Aliases:** Hormozi Funnel Pyramid, Organic Wave Fill, Buyer Hierarchy Tier, Neon Liquid Slog
* **Visual Description:**
  * A geometric segmented shape (such as a 4-tier buyer pyramid, market hierarchy triangle, or conversion funnel).
  * Instead of a rigid straight divider, the active metric color sloshes and rolls with an **organic fluid wave / liquid meniscus** that rises up into the tier.
  * As the liquid reaches its resting level, a luminous neon rim or ambient bloom radiates outward along the boundary, pulling immediate focus to the percentage or headline text (e.g., *"3% BUYING NOW"*).
* **🎯 Editorial Intent & When to Use:**
  * **Market Segmentation / Hierarchy:** Explaining audience proportions (e.g. Hormozi's famous *"The 3% who are ready to buy right now vs. the 97% who are not"*).
  * **Liquid Thresholds:** Illustrating filling capacity, goal attainment, or energy levels with visceral physical motion.
* **⚠️ When NOT to Use (Anti-Patterns):**
  * Don't let the liquid wave cycle continuously at high speed during serious narration, as constant churning distracts from the core text reading. Let it settle into a calm, gentle breathing pulse.
* **🤖 AI Narrative & Script Triggers:**
  * Keywords: `pyramid`, `the top 3%`, `funnel`, `tier`, `hierarchy`, `majority of customers`, `only a fraction`, `ready to buy`
  * Visual Asset Type: Funnels, marketing pyramids, maslow hierarchy diagrams, percentage split graphics.
* **How to Achieve this Effect (Plain-Text Guide & Recipes):**
  * **In Magnates Studio (Pre-built Template):**
    1. Select **Templates** -> **Infographics** -> **"Liquid Pyramid Tier"**.
    2. Choose tier level (e.g. `Tier 1: Top Apex`, `Tier 2: Mid Upper`, `Tier 3: Base`).
    3. Input typography overlay (`"3% BUYING NOW"`).
    4. Select accent fill color (`#B4FF00` Neon Chartreuse).
    5. Set `Wave Agitation` (slosh amplitude) and `Liquid Rise Time` (`1.2s`).
    6. Enable `Active Tier Bloom` for the neon perimeter glow.
  * **In Video Editors (After Effects):**
    1. Create the pyramid base vector shape with gray fill (`#333333`).
    2. Duplicate the top segment into a new layer with bright lime color (`#B4FF00`).
    3. Create a wave layer beneath it using a horizontal path with wavy bezier curves, or apply the **Wave Warp** effect (Wave Type: Sine, Wave Height: `18`, Wave Width: `120`, Direction: `0°`).
    4. Animate the Y-position of the wave mask rising up from bottom to top of the tier.
    5. Set the lime tier layer's Track Matte to the pyramid apex mask so the wave is strictly confined inside the triangle.
    6. Apply **Glow / Deep Glow** to the apex layer with a soft feather.
* **AI Action Signature (Machine-Readable Spec):**
  ```json
  {
    "action": "create_infographic_chart",
    "template": "liquid_funnel_tier",
    "parameters": {
      "shape": "pyramid_4_tier",
      "activeTierIndex": 0,
      "tierName": "Apex",
      "text": "3% BUYING NOW",
      "liquidColor": "#B4FF00",
      "baseColor": "#2A2A2A",
      "waveHeight": 18,
      "waveSpeed": 1.2,
      "glowIntensity": 0.85,
      "riseDuration": 1.2
    }
  }
  ```

---

## 🔊 5. Audio Architecture & Restoration

### 5.1 WebAudio Procedural SFX Engine
* **System ID:** `procedural_sfx`
* **Status:** ✅ Implemented
* **🎯 Editorial Intent & When to Use:**
  * **Haptic Audio Subconscious Reinforcement:** Grounding every visual motion (zooms, text pops, loupe sweeps) with physical sound so cuts feel satisfying and weighty.
  * **Subconscious Tension:** Deep bass hits cue the viewer's brain that something serious or consequential just occurred.
* **Sound Palette:**
  * `whoosh`: Bandpass filtered white noise frequency sweep. (Use on quick pans, text slides, and cutaways).
  * `gentle_wind`: Soft blowing wind / ambient transition breeze with pinked resonance. (The signature Magnates Media / documentary scene transition gust).
  * `bass_hit` / `impact`: Deep 808 sub-bass drop with punch envelope. (Use on shocking title stamps and scene endings).
  * `snap_zoom`: High-speed camera whoosh-snap. (Use strictly on punch zooms).
  * `shutter_click`: Dual-click mechanical camera shutter. (Use on photo reveals or evidence presentation).
* **How to Trigger:** Automatically attached to kinetic titles and punch zooms, or configured per clip via Inspector.

---

### 5.2 Background Noise Removal (Audio Denoise)
* **System ID:** `audio_denoise_pipeline`
* **Industry & Creator Aliases:** Speech Isolation, Voice De-hum, De-reverb, Studio Clean
* **Status:** ✅ Implemented (`denoise.py` / `.agents/skills/audio-denoise`)
* **🎯 Editorial Intent & When to Use:**
  * **Amateur Audio Salvage:** Cleaning fan hum, street rumble, or air conditioner hiss from mobile voice notes or Zoom interviews before timeline assembly.
* **How to Trigger:** Run audio through the built-in noise removal skill targeting either `natural` or `aggressive` noise suppression profiles.

---

## 🚀 6. Signature Composite Recipes (Combos)

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

### 🌟 Recipe C: "The Hormozi Metric Drop & Funnel"
* **Components:**
  1. `Dynamic Area Chart` drawing write-on showing steep cost drop.
  2. Transition to `Liquid Pyramid Tier` highlighting `"3% BUYING NOW"`.
  3. `Procedural SFX` (`bass_hit`) on the wave settlement + apex bloom.

### 🌟 Recipe D: "The 2.5D Parallax Photo Push (Chris Spooner Pipeline)"
* **Components:**
  1. `Isolated Subject Cutout` (e.g. Hiker / Portrait) on foreground with edge feathering and drop shadow.
  2. `Clean Inpainted Plate` behind subject (telea content-aware expansion) eliminating ghost silhouettes.
  3. `Multi-Plane Z-Depth` separation (180px optical offset).
  4. `Push-In Zoom Keyframing` (FG 1.35x vs BG 1.08x) with subtle camera tilt orbit and gentle atmospheric wind SFX.

---

## 🔮 7. Roadmap & Planned Capabilities (Backlog)

* [ ] **Animated Document Highlighter Sweep (`fx-highlighter-sweep`):** Realistic hand-drawn fluorescent highlighter bar moving across scanned PDF text.
* [x] **2.5D Parallax Photo Effect (`fx-spooner-parallax`):** Multi-step Photoshop timeline parallax pipeline with subject isolation, clean inpaint plate, Z-separation, and camera push-in zoom.
* [ ] **Stop-Motion Frame Rate Limiter (`fx-posterize-time`):** Restricting cutout animation to 12fps / 8fps for an authentic paper collage feel.
* [ ] **Auto Subtitle Whisper Alignment (`fx-auto-captions`):** Direct audio-to-kinetic-text alignment with karaoke-style per-word highlighting.

### James Jani Narrative Puzzle & Modular Reconstruction Engine (`jani-puzzle-narrative-suite`)
- **Category:** 3D Spatial / Cinematic Storytelling
- **Visual Aesthetic:** Signature James Jani documentary look with procedural interlocking puzzle tabs and blanks, glowing cyan neon edges (`#00f2fe` with dynamic multi-layer bloom), dark textured vignetted background, tech grid overlay, and procedural floating dust motes.
- **Dynamic Animation Flow:**
  1. *Phase 1:* Lead puzzle piece enters from top-left into center.
  2. *Phase 2:* Second piece enters smoothly from above, sliding down and snapping into an interlocking lock with audio click.
  3. *Phase 3:* The locked pair translates leftward to re-center.
  4. *Phase 4:* Multi-piece cascade from left and right snapping into place.
  5. *Phase 5:* Cinematic 3D camera pan & tilt across the completed puzzle wall.
- **Granular Controls:**
  - **Master Image Slicer:** Upload any photo or paste an image URL to slice dynamically across all puzzle pieces.
  - **Animation Modes:** `cinematic-story` (Storyboard sequence), `falling` (Gravity waterfall drops), `scatter` (Interactive shuffle & snap), `pop-isolate` (3D popped talking point piece), and static assembled view.
  - **Grid Granularity:** 2x2 macro up to 4x4 complexity.
  - **Badge Overlays:** Documentary title strips, portrait badges (e.g. Sam Bankman-Fried), documents, and crypto token badges.

---

## 🏛️ James Jani FTX 3D Kinetic Logo Builder & Shockwave Reveal

### Overview & Narrative Intent
* **System ID:** `jani-ftx-logo-reveal`
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
```json
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
```

### AI Action Signature (Machine-Readable Spec)
```json
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
```


---

## 📽️ Cinematic Light Trail Typewriter & Glitch Reveal Suite

### Overview & Narrative Intent
* **System ID:** `cinematic-light-trail-typewriter`
* **Industry & Creator Aliases:** Anamorphic Streak Typewriter, James Jani Mystery Title, High-Tension Statement Reveal, Digital Glitch Breakout
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ High Tension & Climactic Narrative Statement
* **Visual Description:**
  The iconic mystery documentary statement opener: pitch-black cinematic screen where condensed uppercase typography (*"THIS IS NOT ONE OF THOSE STORIES"*) is typed character-by-character with a pulsating cursor. As each character appears, it leaves a brilliant, directional trail of light (signature 2.39:1 anamorphic horizontal lens flare streak) with an intense white-hot core and soft dissipating bloom tails. CRT scanlines, 35mm film grain, and subtle dust scratches add optical analog weight. Once the phrase completes, after a brief psychological pause, the text violently detonates in a high-frequency digital CRT glitch (horizontal slice displacement, chromatic aberration split, and static noise scramble) before immediately revealing a secondary background plate or video through an impactful camera flash punch-zoom.

### Granular Customization Capabilities
1. **Background**:
   * Changeable black screen void with subtle radial vignette.
   * Upload custom background image or video file (`bgMediaUrl`).
   * Color tinting, darkness / dimming slider (0% - 100%), and vignette shadow intensity.
   * Preset backdrops: Pure Black Void, Smoky Fog, Boardroom Silhouette, Tactical Desk, CCTV Surveillance.
2. **Typography & Content**:
   * Fully editable text string with character-by-character animation.
   * Font selector: Oswald (Tall Condensed), Bebas Neue, Inter, JetBrains Mono, Cinzel, Anton.
   * Font size, letter spacing (tracking), font weight, text color, and diffuse glow.
   * Blinking cursor style: Underscore (`_`), Vertical Pipe (`|`), Block (`█`), or None.
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
   * Upload custom target image or video (`revealMediaUrl`).
   * Built-in dramatic presets (Boardroom, Tactical War Room, CCTV, Tokyo Night).
   * Transition styles: Camera Flash Punch-Zoom, Glitch Impact Cut, Cross Dissolve.
6. **Atmospheric Texture**:
   * CRT scanlines with toggle and opacity slider.
   * Procedural floating dust motes & 35mm hair scratch flickers.
   * Optical chromatic aberration.

### Contextual Inspector Parameters
```json
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
```

### AI Action Signature (Machine-Readable Spec)
```json
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
```


---

## ⚡ 17. Modular Multi-Image Shutter Flash & Lateral Sequence Suite

### 17.1 Cinematic Multi-Image Flash & Lateral Storyboard Engine
* **System ID:** `multi-image-flash-sequence`
* **Category:** Transitions & Documentary Storytelling
* **Status:** ✅ Implemented
* **Pacing & Energy:** ⚡ High-Energy Investigative Shock $\rightarrow$ Lateral Ping-Pong $\rightarrow$ Sluggish Center Dread
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


---

## 🎬 18. James Jani Cinematic Letterbox & Lower Caption Frame

### 18.1 Signature Documentary Letterbox Matte & Lower Space
* **System ID:** `jani-cinematic-letterbox`
* **Industry & Creator Aliases:** James Jani Letterbox, Documentary Subtitle Frame, Cinematic Widescreen Matte, Lower Caption Frame
* **Status:** ✅ Implemented
* **Pacing & Energy:** 🎙️ Monologue Narrative Pace / Cinematic Monologue & Evidence Presentation
* **Visual Description:**
  The iconic widescreen presentation frame from James Jani video essays:
  1. **Top & Bottom Matte Bars:** Customizable color letterbox bars (pure cinematic black `#000000`, obsidian navy, studio dark, crimson, or vintage ivory), selectable as unified or independent colors.
  2. **Centered Middle Media:** Video clip or photo sitting centered in the middle aperture without taking the full screen. Interactive dragging and scaling supported directly on canvas.
  3. **Lower Caption Space:** Prominent subtitle/caption text space situated directly under the media in the bottom matte bar (`"SPUN OVER THE COURSE OF A FEW YEARS."`) rendered in high-impact condensed bold uppercase typography with live inline editing.
  4. **Corner Watermark & Badges:** Signature bottom-left channel brand watermark (`JANi`) and bottom-right call-to-action (`SUBSCRIBE`).
  5. **Atmosphere:** 35mm film grain texture pass and slow cinematic camera push-in.
* **How to Achieve in Magnates Studio:**
  1. Open **Templates** -> **Documentary** -> Select **"James Jani Cinematic Letterbox & Lower Caption Frame"**.
  2. In the Inspector, choose Top & Bottom Bar colors, bar height percentage (e.g. 14% Anamorphic, 16% CinemaScope, 11% Univisium), drag the photo/video to your preferred framing, and customize the subtitle caption text.
  3. Click **"Apply to Timeline"** to generate editable timeline tracks.


---

## 🕒 19. Cinematic Tension Countdown Timer HUD & Climax Impact Engine

### 19.1 High-Stakes Documentary Countdown Dial & Tension Riser
* **System ID:** `countdown-timer`
* **Industry & Creator Aliases:** Vox T-Minus Clock, James Jani Countdown, Climax Timer HUD, Dramatic Listicle Rank Reveal, Tension Countdown
* **Status:** ✅ Implemented & Upgraded
* **Pacing & Energy:** ⚡⚡⚡ High Tension Build / Climax Impact Transition
* **Visual & Structural Description:**
  The definitive countdown timer engine engineered for documentary tension building, chapter intros, and climactic reveals:
  1. **Fullscreen-Adaptive Architecture:** Dynamically scales to any resolution (720p, 1080p, 4K, ultrawide 21:9, and vertical 9:16). Numbers scale dynamically (`clamp(68px, 18vmin, 220px)`) providing commanding screen presence in Fullscreen and Theater view.
  2. **4 Display Modes:**
     * **Big Numeral (3, 2, 1):** Huge block typography that springs forward with overshoot on each second tick.
     * **T-Minus Monospace (`[ T-MINUS 00:03.42 ]`):** Military-grade telemetry clock with live centisecond counters.
     * **Digital Stopwatch (`00:03:42`):** Clean mission countdown clock.
     * **Top 10 List Rank (`#3 OF 10`):** Listicle rank countdown.
  3. **3 Display Scale Presets:**
     * **Massive (85% Viewport):** Blockbuster screen-filling countdown dial for fullscreen tension.
     * **Standard (65% Viewport):** Balanced layout with telemetry cards.
     * **Compact (45% Viewport):** Tight picture-in-picture / corner overlay layout.
  4. **Multi-Layered Precision HUD Geometry:**
     * Dynamic circular SVG arc that smoothly drains or fills 360° synced with timeline progress (`stroke-dashoffset`).
     * Outer rotating 120s radar reticle with 60 degree ticks and cardinal degree markers.
     * Counter-rotating inner orbital ring and pulsing shockwave rings on each integer second tick.
     * Tactical corner brackets, anamorphic laser flare streaks, and CRT scanlines.
  5. **Zero Climax State:**
     * Optical screen bloom flash and camera recoil impact shake.
     * Customizable climax reveal word (`IMPACT`, `ZERO`, `REVEAL`, `CRASH`, etc.) in blazing neon glow.
     * 28Hz sub-bass impact drop and audio shockwave.
  6. **Integrated Procedural Audio Engine:**
     * Web Audio API synthesized mechanical clock ticking, bio-thriller heartbeat, or radar chirp with pitch ramping toward zero.
     * Optional toggle and master volume slider.
  7. **6 One-Click Aesthetic Presets:**
     * **Crimson Thriller (Default):** Deep dark vignette, red pulsing glow, subtle CRT scanlines, red chromatic aberration.
     * **Cyberpunk Cyan HUD:** Sci-fi tactical grid, cyan & electric blue dual rings, digital crosshairs, telemetry coordinates.
     * **Gold Prestige:** Dark navy & warm amber gold aesthetic, serif typography, elegant thin concentric rings.
     * **Minimal Swiss (Vox/Bloomberg):** Ultra-clean monochrome, high-contrast stark numbers, precision circular SVG progress bar.
     * **Hazard Warning:** High-contrast caution yellow, flashing beacon strobe, military stencil aesthetic.
     * **Matrix Stream:** Phosphor green terminal stream, CRT distortion.
* **How to Access:**
  1. Open **Templates** -> **Documentary** or **Motion Graphics** -> Select **"Countdown Timer"**.
  2. In the contextual inspector, select your style preset, start count, display mode, scale size, headline texts, and audio settings.
  3. Scrub playback timeline or toggle fullscreen to watch the dynamic countdown count down in real time.
