# Root Cause Analysis and Resolution: "+ Add Line" Button and Drag-to-Highlight Failure

## 1. Executive Summary

In the **Document Highlighter & Loupe Suite** template customizer:
1. Clicking the **"+ Add Line"** button (`#btn-tpl-modal-add-hl-line`) produced no effect: no new highlight line was added to the document preview stage, and no entry appeared in the sidebar highlight list.
2. Dragging across document text displayed a temporary yellow marquee selection box, but upon releasing the mouse/pointer (`pointerup`), the selection disappeared without creating a persistent highlight or displaying the direct transform/resize bounding box (`#doc-direct-transform-box`).

Both symptoms were caused by an uncaught JavaScript runtime error (`ReferenceError: getActiveDocLines is not defined`) triggered whenever a new line was calculated.

---

## 2. Root Cause Analysis

### A. Scoping Isolation of `getActiveDocLines()`
The helper function `getActiveDocLines()` and constant dataset `FORBES_DOC_LINES` were previously defined **inside the local function body** of `renderTopTemplatePreviewStage()`:

```javascript
function renderTopTemplatePreviewStage() {
  // ...
  const FORBES_DOC_LINES = [ ... ];
  function getActiveDocLines() {
    // extracts snappable line baselines and bounding boxes
    return ...;
  }
  // ...
}
```

### B. Why "+ Add Line" Failed
The click listener for the "+ Add Line" button was located in `syncTopTemplateDocHighlighterUI()`:

```javascript
btnAddLine.onclick = (e) => {
  e.stopPropagation();
  e.preventDefault();
  if (!Array.isArray(topCustomizerState.docHighlights)) topCustomizerState.docHighlights = [];
  const docLines = getActiveDocLines(); // <-- CRASH: ReferenceError: getActiveDocLines is not defined!
  const nextIdx = topCustomizerState.docHighlights.length;
  // ...
};
```
Because `getActiveDocLines()` was enclosed inside `renderTopTemplatePreviewStage()`, calling it from `syncTopTemplateDocHighlighterUI()` threw an unhandled `ReferenceError`. The function terminated immediately, preventing `topCustomizerState.docHighlights.push(...)`, UI synchronization, and stage re-rendering from executing.

### C. Why Dragging Across Text Disappeared on Pointer Up
A direct canvas trace feature was implemented via `stageInner`'s pointer events:
1. `pointerdown`: Recorded starting coordinates `traceStartClientX` and `traceStartClientY`.
2. `pointermove`: Dynamically sized the visual dashed marquee element (`stageMarqueeEl`).
3. `pointerup` (`onPointerUpStage`):
   ```javascript
   const onPointerUpStage = (ue) => {
     window.removeEventListener('pointermove', onPointerMoveStage);
     window.removeEventListener('pointerup', onPointerUpStage);
     stageMarqueeEl.style.display = 'none'; // <-- 1. Hide marquee preview

     // ...
     const docLines = getActiveDocLines(); // <-- 2. CRASH: ReferenceError thrown here!
     
     // 3. Highlight creation and transform-box display were NEVER reached:
     topCustomizerState.docHighlights.push(newHl);
     renderTopTemplatePreviewStage();
     initDocDirectCanvasEditing();
   };
   ```
   Because `stageMarqueeEl.style.display = 'none'` ran *before* `getActiveDocLines()`, the temporary marquee disappeared, and the runtime exception prevented the permanent highlight line and `#doc-direct-transform-box` from being created and attached to the DOM.

---

## 3. The Fix

### A. Hoisted `FORBES_DOC_LINES` and `getActiveDocLines()` to Module Scope
Both the dataset and lookup function were moved to the top-level scope of `public/js/app.js` (lines ~28046–28064) so that all template customizer modules, event handlers, and canvas inspectors can access line geometry consistently:

```javascript
const FORBES_DOC_LINES = [
  { normX: 0.125, normY: 0.285, normW: 0.542, normH: 0.046, text: "Line 1" },
  { normX: 0.125, normY: 0.355, normW: 0.650, normH: 0.046, text: "Line 2" },
  // ...
];

function getActiveDocLines() {
  const customLines = topCustomizerState.articleDocLines;
  if (Array.isArray(customLines) && customLines.length > 0) {
    return customLines;
  }
  return FORBES_DOC_LINES;
}
```

### B. Cleaned Event Handlers & Prevented Listener Stacking
- Replaced `stageInner.addEventListener('pointerdown', ...)` with `stageInner.onpointerdown = ...` in `initDocDirectCanvasEditing()` to prevent duplicate event listener stacking when re-rendering or opening the inspector.
- Updated `.doc-snappable-line` event logic so rapid clicks snap to a single line, while drag actions cleanly delegate to the marquee coordinate processor without event collisions.
- Preserved user-dragged width and position while maintaining vertical alignment to closest text baselines.
- Immediately set `#doc-direct-transform-box` to `display: 'block'` upon releasing the mouse or adding a line so the resize handles and toolbar are visible immediately.

### C. Cache Invalidation
Bumped the script version in `public/index.html` from `js/app.js?v=320` to `js/app.js?v=321` and `js/tpl-3d-inspector.js?v=5` to guarantee browsers load the updated logic immediately without serving stale cached scripts.

---

## 4. Verification

- Verified syntax via `node -c magnates-studio/public/js/app.js` and `node -c magnates-studio/public/js/tpl-3d-inspector.js` (both completed with exit code 0).
- Confirmed that "+ Add Line" adds Line 3, Line 4, etc. with appropriate timing offsets and updates both the sidebar list and canvas.
- Confirmed that dragging across text accurately creates a highlight matching the drag dimensions and leaves the interactive transform box with resize handles active.
