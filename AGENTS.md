# Regaarder Studio — Engineering & Design System Rules (AGENTS.md)

## Mandatory Design System Consultation

1. **Universal Contextual Toolbar System:**
   - Before creating, modifying, or styling any floating toolbar, stage selection overlay, or direct-manipulation object bar in Regaarder Studio, you **must** consult:
     `docs/design-system/TOOLBAR_GUIDELINES.md`
   - All object toolbars must use the shared `window.RegaarderContextualToolbar` architecture (`Object Identity → Primary Tools → Quick Properties → More Actions`) defined in `/public/js/regaarder-redesign.js` and the `--rg-toolbar-*` tokens in `/public/css/regaarder-redesign.css`.
   - Never introduce template-specific floating toolbars, engineering `Z=...` labels, or persistent green `Done` buttons for standard object selection.

2. **Contextual Inspector Architecture:**
   - All right-hand inspector controls must use the standardized 4-tab hierarchy (`Content`, `Motion`, `Look`, `Effects`) plus the collapsible `Advanced Controls` drawer in `/public/js/regaarder-redesign.js` and `/public/css/regaarder-redesign.css`.
