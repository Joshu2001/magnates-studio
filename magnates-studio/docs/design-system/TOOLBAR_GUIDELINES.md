# Regaarder Studio — Universal Contextual Toolbar Guidelines

This document defines the permanent architectural, visual, and behavioral standards for all floating contextual object toolbars across Regaarder Studio.

---

## 1. Toolbar Philosophy

1. **Contextual Relevance Over Kitchen-Sink Clutter:** A floating object toolbar must surface only the highest-frequency actions for the currently selected object. Deep parameters, keyframe curves, and multi-axis calibration belong in the right-hand contextual inspector (`Content`, `Motion`, `Look`, `Effects`, and `Advanced Controls`).
2. **Human-Readable Language:** Never expose internal engineering layer indices, z-depth strings, or shader identifiers (e.g., `Z=3 // FLOATING SPEC CARD` or `Z=1.5 // TABLETOP_PLATE`) in the primary UI. Always use clean, creator-friendly object names (`Product Card`, `Comparison Card 1`, `Hero Printer`, `Headline`, `Image`, `Shape`).
3. **Calm, Apple-Inspired Surface:** Toolbars use a unified dark glass surface (`#171722`) with a single brand accent (`#823CF0`) for active tool states. Never mix neon green confirmation pills, bright blue upload badges, and orange engineering borders inside the same floating bar.
4. **Effortless Selection Dismissal:** Ordinary object selection never requires clicking a `Done` button. Users exit selection naturally via `Escape`, clicking empty canvas space, or switching tools.

---

## 2. Standard Toolbar Anatomy

Every contextual toolbar in Regaarder Studio strictly follows this four-zone left-to-right structure separated by `1px` vertical dividers (`#3B2A5F`), plus a downward/upward pointer beak (`.rg-ctx-pointer-beak`) aimed at the horizontal center of the selected object:

```
[ Object Identity ]  |  [ Primary Tools ]  |  [ Quick Properties & More Actions ]
                       ▾ (Pointer Beak aimed at Selected Object)
```

1. **Object Identity:**
   - Displays the selected object's semantic SVG icon (`17px`, `#B794F4`) and human-readable name (`Product Card`, `Headline`, `Hero Printer`, etc.) with a downward chevron (`⌄`).
   - Clicking the identity pill opens the **Scene Objects Switcher** dropdown so creators can switch between overlapping or depth-stacked objects without hunting on the stage.
2. **Primary Tools (Icon-Only Group):**
   - Displays `3–5` direct-manipulation icon tools relevant to the selected object's variant (`Select`, `Move`, `Rotate`, `Crop`, `Duplicate`, `Align`, `Arrange`).
   - Irrelevant tools for a given object type must never be rendered.
3. **Quick Properties (Labeled Inline Actions):**
   - Exposes `2–3` high-frequency visual actions and properties (`Replace` with image icon, `Color` with glowing `#9B6BFF` swatch dot + popover, `Aa Style` with Quick Style presets + Layer Opacity slider).
4. **More Actions:**
   - A consistent `⋯` overflow menu housing secondary and layer-management commands (`Lock / Unlock`, `Hide / Show`, `Group / Ungroup`, separator, `Bring Forward`, `Send Backward`, separator, `Copy Style`, `Paste Style`, separator, `Delete` styled destructively).

---

## 3. Supported Toolbar Variants

All variants share the single `RegaarderContextualToolbar` component (`window.RegaarderContextualToolbar`) and declarative schema registry (`TOOLBAR_VARIANT_SCHEMAS`):

| Variant Key | Toolbar Variant Name | Primary Tools | Quick Properties | Typical Objects |
| :--- | :--- | :--- | :--- | :--- |
| `text` | **Text Toolbar** | `Select`, `Move`, `Rotate`, `Duplicate`, `Align` | `Color`, `Aa Style` | `Headline`, `Sub-Caption`, `Lower Third` |
| `media` | **Image / Media Toolbar** | `Select`, `Move`, `Rotate`, `Crop`, `Duplicate` | `Replace`, `Color`, `Aa Style` | `Product Card`, `Comparison Card 1 & 2`, `Image`, `Article Card` |
| `shape` | **Shape Toolbar** | `Select`, `Move`, `Rotate`, `Duplicate`, `Align` | `Color`, `Aa Style` | `Shape`, `Callout Badge`, `Highlight Strip` |
| `object3d` | **3D Object Toolbar** | `Select`, `Move`, `Rotate`, `Crop`, `Duplicate` | `Replace`, `Color`, `Aa Style` | `Hero Printer`, `Desk Props`, `Brand Emblem`, `Capitol Cutout` |
| `animation` | **Animation Toolbar** | `Select`, `Move`, `Align` | `Color`, `Aa Style` | `Motion Path`, `Cursor Trajectory` |
| `multi` | **Multi-Selection Toolbar** | `Select`, `Move`, `Align`, `Arrange`, `Duplicate` | `Color`, `Aa Style` | `Multiple Objects`, `Grouped Objects` |

---

## 4. Visual Tokens

All contextual toolbars consume the centralized CSS custom properties in `/public/css/regaarder-redesign.css`:

```css
:root {
  --rg-toolbar-bg: #1B1628;           /* Surface */
  --rg-toolbar-surface-elev: #261C3D; /* Surface Elev. */
  --rg-toolbar-hover: #261C3D;
  --rg-toolbar-active: #823CF0;       /* Brand */
  --rg-toolbar-glow: #9B6BFF;         /* Glow */
  --rg-toolbar-icon-primary: #F3EFFE;
  --rg-toolbar-icon-secondary: #A89EC4;
  --rg-toolbar-border: #3B2A5F;       /* Border */
  --rg-toolbar-height: 44px;
  --rg-toolbar-radius: 12px;
  --rg-toolbar-shadow: 0 0 0 1px rgba(59, 42, 95, 0.9), 0 0 26px rgba(155, 107, 255, 0.42), 0 16px 40px rgba(0, 0, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.14);
}
```

---

## 5. Sizing and Spacing Rules

- **Toolbar Height:** `44px` (`--rg-toolbar-height`)
- **Corner Radius:** `12px` (`--rg-toolbar-radius`)
- **Icon Size:** `17px` (`15px–16px` inside Quick Property buttons and dropdown menu items)
- **Button Hit Target:** `34px × 34px` (`8px` border radius)
- **Internal Section Gap:** `6px` between major anatomy zones; `3px` between adjacent icon buttons
- **Horizontal Padding:** `8px` (`0 8px`)
- **Divider Dimensions:** `1px` width × `24px` height (`#3B2A5F`)

---

## 6. Color, Stage Selection Frame, and State Rules

- **Elevated Toolbar Surface:** `linear-gradient(180deg, rgba(38, 28, 61, 0.96) 0%, rgba(27, 22, 40, 0.98) 100%)` with `1.5px solid rgba(155, 107, 255, 0.72)` and `--rg-toolbar-shadow`.
- **Stage Selection Frame (`.rg-ctx-selection-frame`):** Whenever an object is selected, its bounding box displays a luminous `2px solid #9B6BFF` border with soft outer/inner purple glow (`0 0 28px rgba(155, 107, 255, 0.55)`) and **4 crisp corner handles** (`10px × 10px`, `#F5F0FF` fill, `2px solid #823CF0`).
- **Default Button State:** Transparent background, `--rg-toolbar-icon-primary` (`#F3EFFE`) icon/label.
- **Hover State:** `--rg-toolbar-hover` (`#261C3D`) background, `rgba(155, 107, 255, 0.35)` border, `#FFFFFF` icon/label.
- **Active / Selected Tool State:** `linear-gradient(180deg, #9353F5 0%, #823CF0 100%)` background, `#9B6BFF` border, `#FFFFFF` icon/label, outer glow (`0 0 14px rgba(155, 107, 255, 0.55)`).
- **Destructive Action State (`Delete`):** `#F87171` text and icon, `rgba(239, 68, 68, 0.16)` hover background, always preceded by a menu separator.
- **Confirmation Mode (`Done` / `Cancel`):** Rendered **only** during modal sub-operations requiring explicit confirmation (such as `Crop`). Never render a green `Done` button during standard object selection.

---

## 7. Positioning, Pointer Beak, and Collision Rules

1. **Default Anchor & Pointer Beak:** Centered horizontally `14px` above the selected object's bounding box, with `.rg-ctx-pointer-beak` aligned to the horizontal center of the selected object.
2. **Top Edge Collision Flip:** If `targetRect.top - 44 - 14` would collide with the Global Top Bar or Scene Toolbar (`top < 106px`), the toolbar automatically flips to `14px` below the selected object's bounding box (`targetRect.bottom + 14`) with `.rg-ctx-pointer-beak.is-top`, or clamps cleanly inside the top of the stage if the object fills the frame.
3. **Horizontal Clamping:** The toolbar clamps between the Left Navigation Rail (`minLeft = Math.max(76, stageRect.left + 8)`) and the Right Contextual Inspector (`maxRight = Math.min(window.innerWidth - 356, stageRect.right - 8)`).
4. **Bottom Playback Clearance:** The toolbar never overlaps the bottom playback HUD (`maxBottom = Math.min(window.innerHeight - 64, stageRect.bottom - 54)`).
5. **Live Tracking:** Both the toolbar and `.rg-ctx-selection-frame` reposition via `requestAnimationFrame` whenever the selected object is dragged, resized, rotated, or when the viewport resizes/scrolls.

---

## 8. Overflow Menu Structure

The `More Actions` (`⋯`) popover menu follows a strict four-group hierarchy separated by `1px` horizontal dividers (`.rg-ctx-menu-sep`):

1. **State Group:**
   - `Lock Object` / `Unlock Object` (`⌘L`)
   - `Hide Object` / `Show Object` (`⌘H`)
   - `Group Selection` / `Ungroup Objects` (`⌘G`)
2. **Depth Arrangement Group:**
   - `Bring Forward` (`]`)
   - `Send Backward` (`[`)
3. **Style Clipboard Group:**
   - `Copy Style` (`⌥⌘C`)
   - `Paste Style` (`⌥⌘V`)
4. **Destructive Group:**
   - `Delete` (`⌫`) — styled in `.is-destructive` red (`#F87171`).

---

## 9. Keyboard and Accessibility Behavior

- **`Escape`:**
  1. If a toolbar popover (`Object Switcher`, `Color`, `Opacity`, `More Actions`) is open, `Escape` closes the popover first.
  2. If the toolbar is in a modal confirmation sub-mode (`Crop`), `Escape` cancels the sub-operation and restores the previous state.
  3. Otherwise, `Escape` deselects the active object and hides the contextual toolbar.
- **`⌘D` / `Ctrl+D`:** Duplicates the selected object.
- **`]` / `[`:** Brings the selected object forward or sends it backward in z-order.
- **ARIA & Focus:** The toolbar root uses `role="toolbar"` and `aria-label="Contextual Object Toolbar"`. Every icon button includes both `title` and `aria-label`.

---

## 10. Relationship Between Toolbar and Inspector

| Surface | Responsibility | Examples |
| :--- | :--- | :--- |
| **Contextual Toolbar** | Immediate spatial actions, asset replacement, quick accent/opacity tweaks, and layer management | `Select`, `Move`, `Rotate`, `Crop`, `Replace`, `Duplicate`, `Color` swatch, `Opacity`, `Lock`, `Bring Forward`, `Delete` |
| **Right Inspector (`Content`, `Motion`, `Look`, `Effects`, `Advanced Controls`)** | Deep content editing, keyframe choreography, camera drift, typography grading, and optical effects | Product title/price/rating inputs, camera push duration, cursor trajectory curve, strikethrough thickness, glitch displacement |

Clicking `Typography` or `Style` in the contextual toolbar's Quick Properties focuses the corresponding `Content` or `Look` tab in the Right Inspector.

---

## 11. Naming Conventions for Objects and Actions

- **Object Names:** Title Case nouns under 24 characters (`Product Card`, `Comparison Card 1`, `Comparison Card 2`, `Hero Printer`, `Desk Props`, `Brand Emblem`, `Headline`, `Image`, `Shape`).
- **Action Labels:** Imperative verbs (`Select`, `Move`, `Rotate`, `Crop`, `Replace`, `Duplicate`, `Align`, `Arrange`, `Lock Object`, `Bring Forward`, `Delete`).
- **Command IDs:** Lowercase kebab-case (`select`, `move`, `rotate`, `crop`, `replace`, `duplicate`, `align`, `arrange`, `lock-toggle`, `hide-toggle`, `group-toggle`, `bring-forward`, `send-backward`, `copy-style`, `paste-style`, `delete`).

---

## 12. Anti-Patterns to Avoid

- **Never** display internal layer coordinates or engineering strings (`Z=3 // FLOATING SPEC CARD`, `Z=0 // ATMO_PLATE`) in the toolbar or selection bounding box.
- **Never** add a bright green `✓ Done` button for ordinary object selection.
- **Never** hardcode inline-styled one-off floating toolbars inside individual templates or modals; always call `window.RegaarderContextualToolbar.showForObject(...)`.
- **Never** place multi-line forms, range slider banks, or raw `<input type="file">` elements directly inside the floating toolbar.

---

## 13. Component API Examples

### Summoning the Toolbar for a Selected Stage Object

```javascript
window.RegaarderContextualToolbar.showForObject({
  contextType: 'blueprint', // 'blueprint' | 'template'
  objectKey: 'card',        // Key in HUMAN_OBJECT_CATALOG
  variant: 'media',         // 'text' | 'media' | 'shape' | 'object3d' | 'animation' | 'multi'
  anchorElement: document.getElementById('magnates-bp-spec-card')
});
```

### Repositioning During Drag / Transform

```javascript
window.RegaarderContextualToolbar.updatePosition();
```

### Hiding the Toolbar on Deselection

```javascript
window.RegaarderContextualToolbar.hide();
```

---

## 14. Checklist for Creating New Toolbars

Before merging any new object type or stage interaction in Regaarder Studio, verify:

- [ ] Does the object register a human-readable name and semantic icon in `HUMAN_OBJECT_CATALOG`?
- [ ] Does it map to one of the 6 standardized variants in `TOOLBAR_VARIANT_SCHEMAS` (`text`, `media`, `shape`, `object3d`, `animation`, `multi`)?
- [ ] Does it follow `Object Identity → Primary Tools → Quick Properties → More Actions`?
- [ ] Are all engineering `Z=...` labels stripped from both the toolbar and the stage selection box?
- [ ] Does `Escape` and clicking outside on the canvas background dismiss selection without requiring a green `Done` button?
- [ ] Does the toolbar stay clear of the Top Bar, Left Rail, Playback HUD, and Right Inspector across all viewport sizes?
