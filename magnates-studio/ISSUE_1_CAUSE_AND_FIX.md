# Cause & Resolution of Issue #1: 3D Mode Not Hiding Bottom Playback & Sequence Storyboard

## 1. The Symptoms
When clicking the **3D** toggle button in the Document Highlighting inspector (or the **3D EDIT MODE** pill on the preview canvas), the bottom **Play / Replay** bar (`#tpl-modal-playback-bar`) and the **SEQUENCE STORYBOARD** strip (`#tpl-modal-storyboard-container`) remained visible instead of disappearing to let the 3D document canvas expand to full height.

---

## 2. Root Cause Analysis

There were two interacting causes:

### Cause A: `tpl-3d-inspector.js` Overwriting the Layout Every Render
In `public/js/app.js`, clicking the **3D** button ran:
```js
topCustomizerState.is3DMode = true;
syncTopTemplateDocHighlighterUI(); // <-- This hid #tpl-modal-playback-bar & #tpl-modal-storyboard-container
renderTopTemplatePreviewStage();   // <-- Called immediately after!
```
Inside `renderTopTemplatePreviewStage()`, line 28043 called:
```js
if (window.tpl3DSync) window.tpl3DSync(tplId);
```
And inside `public/js/tpl-3d-inspector.js` (line 730), `window.tpl3DSync` executed:
```js
applyModeLayout(has3D(kindOf(tplId), tplId) && mode === '3d');
```
Because `doc-highlighter-loupe-suite` is a custom SVG/Canvas interactive document template rather than one of the legacy Three.js `SPATIAL_3D_CATEGORY_IDS`, `kindOf('doc-highlighter-loupe-suite')` returned `null`. Therefore, `has3D(...)` evaluated to `false`, and `applyModeLayout(false)` was immediately invoked!

Inside `applyModeLayout(false)` (`tpl-3d-inspector.js` lines 690–712), it forcefully reset:
```js
if (sb) sb.style.display = '';
if (pb) pb.style.display = '';
if (stageCont) stageCont.style.maxHeight = '320px';
```
This completely undid the hiding that `syncTopTemplateDocHighlighterUI()` had just performed milliseconds earlier.

### Cause B: Browser Script Caching (`?v=318`)
In `public/index.html`, the script tags had static query parameters (`js/app.js?v=318` and `js/tpl-3d-inspector.js?v=2`), causing the browser to serve cached JavaScript until the version string was bumped.

---

## 3. The Fix

1. **Updated `window.tpl3DSync` in `public/js/tpl-3d-inspector.js`**:
   Checked `topCustomizerState.is3DMode` alongside `has3D(...)` so `applyModeLayout(true)` is preserved whenever the Document Highlighter (or any template) is in 3D Mode:
   ```js
   const isCustom3D = (typeof topCustomizerState !== 'undefined' && !!topCustomizerState.is3DMode);
   applyModeLayout((has3D(kindOf(tplId), tplId) && mode === '3d') || isCustom3D);
   ```
2. **Synchronized `syncTopTemplateDocHighlighterUI()` in `public/js/app.js`**:
   Ensured both `#tpl-modal-playback-bar` and `#tpl-modal-storyboard-container` are hidden (`display: none`) and `#tpl-modal-preview-stage-container` expands to full height when `topCustomizerState.is3DMode` is `true`.
3. **Cache-Busting Version Bump in `public/index.html`**:
   Updated the `<script>` tags to force immediate loading of the updated scripts.
