/* ============================================================================
   REGAARDER STUDIO — UNIVERSAL UI/UX ARCHITECTURE & CONTEXTUAL INSPECTOR ENGINE
   Standardizes:
   1. #modal-magnates-paper-blueprint-suite (All 6 Documentary Scenes)
   2. #modal-top-template-customizer (All 50+ Studio Templates)
   3. Standalone 3D / Investigative Suite Modals (.vector-export-modal)
   ============================================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CENTRALIZED LUCIDE SVG ICON REGISTRY (Matches Reference Image 2)
     -------------------------------------------------------------------------- */
  const LUCIDE_ICONS = {
    // Pixel-accurate vector render of Logo 1 (Far-left topbar purple wing/leaf emblem from Reference Image 2)
    railWingLogo: '<svg viewBox="0 0 22 18" width="24" height="22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.2 15.2C1.9 14.8 1.8 13.2 1.8 11.2C1.8 8.2 3.2 5.4 5.8 3.4C7.8 1.9 10.2 1.4 13.8 1.4C16.4 1.4 18.2 2.1 18.4 3.8C18.6 5.4 17.4 7.2 15.2 8.1C13.6 8.7 12.1 8.8 11.6 9.3C11.2 9.8 11.4 11.2 11.2 12.6C10.9 14.3 9.4 15.4 6.4 15.4C4.8 15.4 3.8 15.3 3.2 15.2Z" fill="#9458F8" stroke="none"/><path d="M4.2 8.8C4.8 5.9 6.6 3.7 9.4 2.4C11.5 1.5 14.0 1.4 16.2 1.8C17.6 2.1 18.3 2.9 18.2 4.1C18.0 5.4 16.8 6.8 14.8 7.6C12.8 8.4 10.4 8.5 8.1 9.0C6.2 9.4 4.7 9.6 4.2 8.8Z" fill="#A266FC" stroke="none"/><path d="M11.4 9.2C12.1 8.6 13.7 8.5 15.3 7.9C16.3 7.5 17.1 6.9 17.6 6.2C17.2 7.5 16.0 8.5 14.3 9.0C13.0 9.4 12.0 9.6 11.4 10.4V9.2Z" fill="#6E3FD1" stroke="none"/><path d="M1.9 10.8C1.9 12.8 2.1 14.7 3.5 15.1C4.5 15.4 6.6 15.4 8.2 15.1C9.9 14.7 10.9 13.7 11.1 12.0C9.2 12.5 6.8 12.4 4.6 11.8C3.2 11.4 2.4 11.0 1.9 10.8Z" fill="#8A4DF6" stroke="none"/></svg>',
    // Pixel-accurate vector render of Logo 2 (Stylized purple stencil "R" monogram next to Regaarder Studio from Reference Image 2)
    brandRLogo: '<svg viewBox="0 0 18 17" width="19" height="19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.6 3.8C2.6 2.6 3.5 1.8 4.8 1.8H11.6C14.1 1.8 15.6 3.1 15.6 5.2C15.6 6.9 14.5 8.2 12.6 8.7L15.4 13.1C15.8 13.7 15.4 14.5 14.6 14.5H12.4C11.8 14.5 11.3 14.2 11.0 13.6L8.2 9.0C7.6 8.1 7.6 7.3 8.5 7.0L10.6 6.4C11.6 6.1 12.2 5.6 12.2 4.9C12.2 4.1 11.5 3.7 10.3 3.7H6.0V13.4C6.0 14.0 5.5 14.5 4.9 14.5H3.7C3.1 14.5 2.6 14.0 2.6 13.4V3.8Z" fill="#9656F6" stroke="none"/><path d="M2.6 3.8C2.6 2.6 3.5 1.8 4.8 1.8H11.6C13.9 1.8 15.4 2.9 15.6 4.8C13.6 4.2 10.6 3.9 6.0 4.2V7.2H2.6V3.8Z" fill="#A468F8" stroke="none"/><path d="M8.3 8.6L11.6 8.2L15.4 13.1C15.8 13.7 15.4 14.5 14.6 14.5H12.4C11.8 14.5 11.3 14.2 11.0 13.6L8.3 8.6Z" fill="#863FF3" stroke="none"/></svg>',
    aperture: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    studio: '<svg viewBox="0 0 24 24"><rect width="18" height="15" x="3" y="6" rx="2"/><path d="M3 10h18"/><path d="m8 6 2.5 4"/><path d="m14 6 2.5 4"/></svg>',
    templatesTop: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h6"/><circle cx="10" cy="8" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/></svg>',
    assetsFolder: '<svg viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
    exportTray: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    assets: '<svg viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>',
    audio: '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><path d="m9 9 12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    text: '<svg viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>',
    layers: '<svg viewBox="0 0 24 24"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
    effects: '<svg viewBox="0 0 24 24"><path d="m15 4-1 1 4 4 1-1a2.83 2.83 0 1 0-4-4Z"/><path d="m13 6-8.5 8.5a2.12 2.12 0 1 0 3 3L16 9"/><path d="M19 2v3"/><path d="M20.5 3.5h-3"/><path d="M6 3v3"/><path d="M7.5 4.5h-3"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/><circle cx="8" cy="6" r="2" fill="#0B0B11"/><circle cx="16" cy="12" r="2" fill="#0B0B11"/><circle cx="10" cy="18" r="2" fill="#0B0B11"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    wand: '<svg viewBox="0 0 24 24"><path d="m15 4-1 1 4 4 1-1a2.83 2.83 0 1 0-4-4Z"/><path d="m13 6-8.5 8.5a2.12 2.12 0 1 0 3 3L16 9"/><path d="M19 2v3"/><path d="M20.5 3.5h-3"/><path d="M6 3v3"/><path d="M7.5 4.5h-3"/></svg>',
    starOutline: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    sceneTray: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
    check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    moreHorizontal: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    play: '<svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    volume: '<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    maximize: '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    sliders: '<svg viewBox="0 0 24 24"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/><circle cx="9" cy="6" r="2" fill="#14141F"/><circle cx="15" cy="12" r="2" fill="#14141F"/><circle cx="9" cy="18" r="2" fill="#14141F"/></svg>',
    star: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    contentTab: '<svg viewBox="0 0 24 24"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
    motionTab: '<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"/></svg>',
    lookTab: '<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    effectsTab: '<svg viewBox="0 0 24 24"><path d="m15 4-1 1 4 4 1-1a2.83 2.83 0 1 0-4-4Z"/><path d="m13 6-8.5 8.5a2.12 2.12 0 1 0 3 3L16 9"/><path d="M19 2v3"/><path d="M20.5 3.5h-3"/><path d="M6 3v3"/><path d="M7.5 4.5h-3"/></svg>',
    imageIcon: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    cursorSelect: '<svg viewBox="0 0 24 24"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>',
    move: '<svg viewBox="0 0 24 24"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/></svg>',
    rotate: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
    crop: '<svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>',
    duplicate: '<svg viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    alignCenter: '<svg viewBox="0 0 24 24"><line x1="12" x2="12" y1="2" y2="22"/><rect width="16" height="6" x="4" y="5" rx="1"/><rect width="10" height="6" x="7" y="13" rx="1"/></svg>',
    arrangeLayers: '<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    unlock: '<svg viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
    cube3d: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>',
    shapeSquare: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="3"/></svg>',
    boldIcon: '<svg viewBox="0 0 24 24"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>'
  };

  /* --------------------------------------------------------------------------
     2. REUSABLE SHELL BUILDERS (Top Bar, Left Rail, Scene Toolbar, Playback Bar)
     -------------------------------------------------------------------------- */
  function createGlobalTopbar(options) {
    const bar = document.createElement('header');
    bar.className = 'rg-global-topbar';
    bar.innerHTML = `
      <div class="rg-topbar-left">
        <div class="rg-rail-brand-corner" data-action="corner-home" title="Regaarder Studio">
          ${LUCIDE_ICONS.railWingLogo}
        </div>
        <div class="rg-brand-group" data-action="close-to-home" title="Return to Regaarder Studio">
          <div class="rg-brand-logo">${LUCIDE_ICONS.brandRLogo}</div>
          <span class="rg-brand-title">Regaarder Studio</span>
        </div>
      </div>
      <div class="rg-top-mode-pills">
        <button type="button" class="rg-top-mode-pill is-active" data-mode="studio">
          ${LUCIDE_ICONS.studio}
          <span>Edit</span>
        </button>
        <button type="button" class="rg-top-mode-pill" data-mode="templates">
          ${LUCIDE_ICONS.templatesTop}
          <span>Templates</span>
        </button>
        <button type="button" class="rg-top-mode-pill" data-mode="assets">
          ${LUCIDE_ICONS.assetsFolder}
          <span>Assets</span>
        </button>
        <button type="button" class="rg-top-mode-pill" data-mode="export">
          ${LUCIDE_ICONS.exportTray}
          <span>Export</span>
        </button>
      </div>
      <div class="rg-topbar-right">
        <button type="button" class="rg-icon-btn" data-action="search" title="Search Studio">${LUCIDE_ICONS.search}</button>
        <button type="button" class="rg-icon-btn" data-action="notifications" title="Notifications">
          ${LUCIDE_ICONS.bell}
          <span class="rg-notif-dot"></span>
        </button>
        <div class="rg-avatar-pill" title="Workspace Profile">JS</div>
      </div>
    `;

    const handleCloseHome = () => {
      if (window.RegaarderContextualToolbar) window.RegaarderContextualToolbar.hide();
      if (typeof window.deselectMagnatesBPLayer === 'function') window.deselectMagnatesBPLayer();
      if (options && typeof options.onClose === 'function') options.onClose();
    };

    bar.querySelector('[data-action="close-to-home"]').addEventListener('click', handleCloseHome);
    bar.querySelector('[data-action="corner-home"]').addEventListener('click', handleCloseHome);

    bar.querySelectorAll('.rg-top-mode-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const mode = pill.getAttribute('data-mode');
        bar.querySelectorAll('.rg-top-mode-pill').forEach((p) => p.classList.remove('is-active'));
        pill.classList.add('is-active');

        if (mode === 'templates') {
          if (options && typeof options.onOpenTemplates === 'function') {
            options.onOpenTemplates();
          } else if (options && typeof options.onClose === 'function') {
            options.onClose();
          }
        } else if (mode === 'assets') {
          if (options && typeof options.onOpenAssets === 'function') {
            options.onOpenAssets();
          } else {
            const contentTab = document.querySelector('.rg-inspector-tab[data-tab="content"]');
            if (contentTab) contentTab.click();
          }
        } else if (mode === 'export') {
          if (options && typeof options.onExport === 'function') {
            options.onExport();
          } else if (typeof window.openExportStudioModal === 'function') {
            window.openExportStudioModal();
          }
        }
      });
    });

    const searchBtn = bar.querySelector('[data-action="search"]');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        if (options && typeof options.onOpenTemplates === 'function') {
          options.onOpenTemplates();
        }
      });
    }

    return bar;
  }

  function createLeftNavRail(options) {
    const rail = document.createElement('aside');
    rail.className = 'rg-left-rail';

    const items = [
      { id: 'home', label: 'Home', icon: LUCIDE_ICONS.home },
      { id: 'studio', label: 'Edit', icon: LUCIDE_ICONS.studio, active: true },
      { id: 'assets', label: 'Apps & Templates', icon: LUCIDE_ICONS.assets },
      { id: 'audio', label: 'Audio & Score', icon: LUCIDE_ICONS.audio },
      { id: 'text', label: 'Typography', icon: LUCIDE_ICONS.text },
      { id: 'layers', label: 'Scene Layers', icon: LUCIDE_ICONS.layers },
      { id: 'effects', label: 'AI & Visual Effects', icon: LUCIDE_ICONS.effects },
      { id: 'settings', label: 'Controls & Settings', icon: LUCIDE_ICONS.settings }
    ];

    let html = '';
    items.forEach((item) => {
      html += `
        <button type="button" class="rg-rail-btn ${item.active ? 'is-active' : ''}" data-rail="${item.id}" data-tooltip="${item.label}" aria-label="${item.label}">
          ${item.icon}
        </button>
      `;
    });

    rail.innerHTML = html;

    rail.querySelectorAll('.rg-rail-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-rail');
        if (id === 'home') {
          if (window.RegaarderContextualToolbar) window.RegaarderContextualToolbar.hide();
          if (typeof window.deselectMagnatesBPLayer === 'function') window.deselectMagnatesBPLayer();
          if (options && typeof options.onClose === 'function') options.onClose();
          return;
        }
        rail.querySelectorAll('.rg-rail-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        if (id === 'settings') {
          const advTrigger = document.querySelector('.rg-inline-advanced-trigger');
          if (advTrigger) advTrigger.click();
        }

        if (options && typeof options.onSelectRail === 'function') {
          options.onSelectRail(id);
        }
      });
    });

    return rail;
  }

  function createSceneToolbar(options) {
    const toolbar = document.createElement('div');
    toolbar.className = 'rg-scene-toolbar';
    toolbar.innerHTML = `
      <div class="rg-scene-toolbar-left">
        <button type="button" class="rg-back-btn" data-action="back" title="Back">${LUCIDE_ICONS.arrowLeft}</button>
        <h2 class="rg-scene-title">${(options && options.title) || 'Scene Editor'}</h2>
      </div>
      <div class="rg-scene-toolbar-center" ${options && options.hidePager ? 'style="display:none;"' : ''}>
        <span class="rg-scene-counter-icon">${LUCIDE_ICONS.sceneTray}</span>
        <span class="rg-scene-counter-text">${(options && options.counterText) || 'Scene 6 of 6'}</span>
        <div class="rg-scene-pager-group">
          <button type="button" class="rg-scene-pager-btn" data-action="prev-scene" title="Previous Scene">${LUCIDE_ICONS.chevronLeft}</button>
          <button type="button" class="rg-scene-pager-btn" data-action="next-scene" title="Next Scene">${LUCIDE_ICONS.chevronRight}</button>
        </div>
      </div>
      <div class="rg-scene-toolbar-right">
        <button type="button" class="rg-btn-secondary" data-action="turn-into-template">
          ${LUCIDE_ICONS.starOutline}
          <span>Turn into Template</span>
        </button>
        <button type="button" class="rg-btn-primary" data-action="apply-to-timeline">
          ${LUCIDE_ICONS.wand}
          <span>Apply to Timeline</span>
        </button>
        <button type="button" class="rg-btn-more" data-action="more" title="More Options">
          ${LUCIDE_ICONS.moreHorizontal}
        </button>
      </div>
    `;

    toolbar.querySelector('[data-action="back"]').addEventListener('click', () => {
      if (window.RegaarderContextualToolbar) window.RegaarderContextualToolbar.hide();
      if (typeof window.deselectMagnatesBPLayer === 'function') window.deselectMagnatesBPLayer();
      if (options && typeof options.onClose === 'function') options.onClose();
    });

    const prevBtn = toolbar.querySelector('[data-action="prev-scene"]');
    if (prevBtn && options && typeof options.onPrevScene === 'function') {
      prevBtn.addEventListener('click', options.onPrevScene);
    }

    const nextBtn = toolbar.querySelector('[data-action="next-scene"]');
    if (nextBtn && options && typeof options.onNextScene === 'function') {
      nextBtn.addEventListener('click', options.onNextScene);
    }

    toolbar.querySelector('[data-action="turn-into-template"]').addEventListener('click', () => {
      if (options && typeof options.onTurnIntoTemplate === 'function') {
        options.onTurnIntoTemplate();
      } else if (typeof window.openSaveAsTemplateModal === 'function') {
        window.openSaveAsTemplateModal();
      }
    });

    toolbar.querySelector('[data-action="apply-to-timeline"]').addEventListener('click', () => {
      if (options && typeof options.onApply === 'function') options.onApply();
    });

    toolbar.querySelector('[data-action="more"]').addEventListener('click', () => {
      if (options && typeof options.onMore === 'function') options.onMore();
    });

    return toolbar;
  }

  function createUnifiedPlaybackBar(options) {
    const bar = document.createElement('div');
    bar.className = 'rg-playback-bar';
    bar.innerHTML = `
      <button type="button" class="rg-play-circle-btn" data-action="toggle-play" title="Play / Pause">
        ${LUCIDE_ICONS.play}
      </button>
      <span class="rg-timecode-text" data-role="timecode">0:01 / 0:05</span>
      <div class="rg-scrubber-area" data-role="scrubber">
        <div class="rg-scrubber-track">
          <div class="rg-scrubber-fill" data-role="scrubber-fill" style="width: 30%;"></div>
        </div>
      </div>
      <div class="rg-playback-right">
        <div class="rg-volume-wrap">
          <button type="button" class="rg-playback-icon-btn" data-action="mute" title="Mute / Unmute">
            ${LUCIDE_ICONS.volume}
          </button>
          <input type="range" class="rg-volume-slider" min="0" max="100" value="80" title="Volume">
        </div>
        <button type="button" class="rg-playback-icon-btn" data-action="fullscreen" title="Fullscreen Preview">
          ${LUCIDE_ICONS.maximize}
        </button>
      </div>
    `;

    const playBtn = bar.querySelector('[data-action="toggle-play"]');
    let playing = true;
    playBtn.addEventListener('click', () => {
      if (options && typeof options.onTogglePlay === 'function') {
        const state = options.onTogglePlay();
        if (typeof state === 'boolean') playing = state;
        else playing = !playing;
      } else {
        playing = !playing;
      }
      playBtn.innerHTML = playing ? LUCIDE_ICONS.pause : LUCIDE_ICONS.play;
    });

    const scrubber = bar.querySelector('[data-role="scrubber"]');
    const fill = bar.querySelector('[data-role="scrubber-fill"]');
    scrubber.addEventListener('click', (e) => {
      const rect = scrubber.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      fill.style.width = `${Math.round(pct * 100)}%`;
      if (options && typeof options.onSeek === 'function') options.onSeek(pct);
    });

    const volSlider = bar.querySelector('.rg-volume-slider');
    volSlider.addEventListener('input', () => {
      if (options && typeof options.onVolume === 'function') {
        options.onVolume(parseFloat(volSlider.value) / 100);
      }
    });

    const fsBtn = bar.querySelector('[data-action="fullscreen"]');
    fsBtn.addEventListener('click', () => {
      if (options && typeof options.onFullscreen === 'function') options.onFullscreen();
    });

    return bar;
  }

  /* --------------------------------------------------------------------------
     3. CUSTOM LOOK PRESET SAVING ENGINE (LocalStorage + Default Curated Presets)
     -------------------------------------------------------------------------- */
  const CUSTOM_LOOK_STORAGE_KEY = 'regaarder_studio_custom_looks_v1';

  const DEFAULT_LOOK_PRESETS = [
    { id: 'pure_white', name: 'Pure Studio', swatch: '#F8FAFC', filter: 'contrast(1.04) brightness(1.04)' },
    { id: 'obsidian', name: 'Obsidian Noir', swatch: '#4C1D95', filter: 'contrast(1.18) brightness(0.92) saturate(1.12)' },
    { id: 'warm_editorial', name: 'Warm Editorial', swatch: '#F59E0B', filter: 'sepia(0.16) contrast(1.08) brightness(1.02)' },
    { id: 'cyber_violet', name: 'Cyber Violet', swatch: '#8B5CF6', filter: 'hue-rotate(8deg) contrast(1.14) saturate(1.25)' }
  ];

  function loadSavedLookPresets() {
    try {
      const raw = localStorage.getItem(CUSTOM_LOOK_STORAGE_KEY);
      const custom = raw ? JSON.parse(raw) : [];
      return [...DEFAULT_LOOK_PRESETS, ...custom];
    } catch (e) {
      return [...DEFAULT_LOOK_PRESETS];
    }
  }

  function saveCustomLookPreset(name, filterValue) {
    try {
      const raw = localStorage.getItem(CUSTOM_LOOK_STORAGE_KEY);
      const custom = raw ? JSON.parse(raw) : [];
      const newPreset = {
        id: 'custom_' + Date.now(),
        name: name || ('Look ' + (custom.length + 1)),
        swatch: '#A855F7',
        filter: filterValue || 'contrast(1.12) saturate(1.15)'
      };
      custom.push(newPreset);
      localStorage.setItem(CUSTOM_LOOK_STORAGE_KEY, JSON.stringify(custom));
      return newPreset;
    } catch (e) {
      return null;
    }
  }

  function createLookPresetsCard(stageElementGetter) {
    const card = document.createElement('div');
    card.className = 'rg-inspector-section';

    function renderChips(activeId) {
      const presets = loadSavedLookPresets();
      card.innerHTML = `
        <div class="rg-custom-presets-wrap">
          <div class="rg-custom-presets-header">
            <span class="rg-section-title">Look Presets</span>
            <button type="button" class="rg-save-preset-btn" data-action="save-look">+ Save Current Look</button>
          </div>
          <div class="rg-custom-preset-chips">
            ${presets.map((p) => `
              <button type="button" class="rg-preset-chip ${p.id === activeId ? 'is-active' : ''}" data-preset-id="${p.id}" data-filter="${p.filter}">
                <span class="rg-preset-swatch" style="background:${p.swatch};"></span>
                <span>${p.name}</span>
              </button>
            `).join('')}
          </div>
          <div class="rg-field-row-2" data-role="save-look-form" style="display:none; margin-top:4px;">
            <input type="text" class="rg-input" data-role="look-name-input" placeholder="Preset name (e.g. Neon Film)">
            <button type="button" class="rg-btn-primary" data-action="confirm-save-look" style="justify-content:center;">Save</button>
          </div>
        </div>
      `;

      card.querySelectorAll('.rg-preset-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          card.querySelectorAll('.rg-preset-chip').forEach((c) => c.classList.remove('is-active'));
          chip.classList.add('is-active');
          const filter = chip.getAttribute('data-filter');
          const stage = typeof stageElementGetter === 'function' ? stageElementGetter() : null;
          if (stage) stage.style.filter = filter;
        });
      });

      const saveBtn = card.querySelector('[data-action="save-look"]');
      const saveForm = card.querySelector('[data-role="save-look-form"]');
      const nameInput = card.querySelector('[data-role="look-name-input"]');
      const confirmBtn = card.querySelector('[data-action="confirm-save-look"]');

      saveBtn.addEventListener('click', () => {
        saveForm.style.display = saveForm.style.display === 'none' ? 'grid' : 'none';
        if (saveForm.style.display !== 'none') nameInput.focus();
      });

      confirmBtn.addEventListener('click', () => {
        const val = nameInput.value.trim();
        if (!val) return;
        const stage = typeof stageElementGetter === 'function' ? stageElementGetter() : null;
        const currentFilter = (stage && stage.style.filter) ? stage.style.filter : 'contrast(1.1) saturate(1.18)';
        const created = saveCustomLookPreset(val, currentFilter);
        if (created) renderChips(created.id);
      });
    }

    renderChips('pure_white');
    return card;
  }

  /* --------------------------------------------------------------------------
     4. PART A: 6-SCENE MAGNATES BLUEPRINT SUITE (#modal-magnates-paper-blueprint-suite)
        Schema-Driven 4-Tab Contextual Inspector for All 6 Scenes
     -------------------------------------------------------------------------- */
  const BLUEPRINT_SCENE_META = {
    'brand_wavy_intro': {
      index: 1,
      title: 'Cinematic Brand Logo Hook & Wavy Typography',
      duration: '0:03'
    },
    'products_unfurl': {
      index: 2,
      title: 'Concentric Plates & Product Price Unfurl',
      duration: '0:02'
    },
    'globe_wavy_nothing': {
      index: 3,
      title: 'Spinning 3D Earth Globe & Wavy Headline',
      duration: '0:03'
    },
    'dual_silhouette': {
      index: 4,
      title: '$1,000,000 Dual Silhouette Cutout Reveal',
      duration: '0:05'
    },
    'article_capitol_zoom': {
      index: 5,
      title: 'Editorial Article Highlight & Capitol Trackback',
      duration: '0:04'
    },
    'room_spawn': {
      index: 5,
      title: 'Editorial Article Highlight & Capitol Trackback',
      duration: '0:04'
    },
    'printer_glitch_card': {
      index: 6,
      title: 'Cinematic White Glitch & Floating Card Reveal',
      duration: '0:05'
    },
    'full_story_flow': {
      index: 1,
      title: 'Full 6-Scene Documentary Blueprint Sequence',
      duration: '0:22'
    }
  };

  const BLUEPRINT_SCENE_ORDER = [
    'brand_wavy_intro',
    'products_unfurl',
    'globe_wavy_nothing',
    'dual_silhouette',
    'article_capitol_zoom',
    'printer_glitch_card'
  ];

  function triggerBlueprintRender() {
    if (typeof window.renderMagnatesBpCurrentFrame === 'function') {
      window.renderMagnatesBpCurrentFrame();
    } else if (typeof window.magnatesBpRequestRender === 'function') {
      window.magnatesBpRequestRender();
    }
  }

  function getBpParams() {
    if (typeof window.magnatesBpParams === 'object' && window.magnatesBpParams) {
      return window.magnatesBpParams;
    }
    window.magnatesBpParams = {};
    return window.magnatesBpParams;
  }

  function readDomVal(id, fallback) {
    const el = document.getElementById(id);
    return el && typeof el.value === 'string' && el.value.length > 0 ? el.value : fallback;
  }

  function readDomChecked(id, fallback) {
    const el = document.getElementById(id);
    return el && typeof el.checked === 'boolean' ? el.checked : fallback;
  }

  function writeDomVal(id, val) {
    const el = document.getElementById(id);
    if (el && el.value !== String(val)) {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function writeDomChecked(id, checked) {
    const el = document.getElementById(id);
    if (el && el.checked !== Boolean(checked)) {
      el.checked = Boolean(checked);
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function buildBlueprintSceneInspector(sceneKey, panes, advSubEl, advDrawer) {
    const p = getBpParams();
    panes.content.innerHTML = '';
    panes.motion.innerHTML = '';
    panes.look.innerHTML = '';
    panes.effects.innerHTML = '';
    if (advDrawer) advDrawer.innerHTML = '';

    const curBgDarkGlobal = parseFloat(readDomVal('magnates-bp-bg-darkness', '88'));
    const curZ0Color = readDomVal('magnates-bp-z0-color', '#1a0b2e');
    const curZ0GlowSpread = parseFloat(readDomVal('magnates-bp-z0-glow-spread', '55'));
    const curCreatorProfile = readDomVal('magnates-bp-creator-style-select', 'custom');

    const createGlobalAtmosphereLookCard = () => {
      const card = document.createElement('div');
      card.className = 'rg-inspector-section';
      card.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Creator Grade & Environment</span>
          <span class="rg-section-subtitle">Apply signature documentary grading and 3D stage lighting.</span>
        </div>
        <div class="rg-field-group">
          <label class="rg-field-label">Creator Style Profile</label>
          <select class="rg-input" data-select-target="magnates-bp-creator-style-select">
            <option value="custom" ${curCreatorProfile === 'custom' ? 'selected' : ''}>Custom / Manual Calibration</option>
            <option value="magnates" ${curCreatorProfile === 'magnates' ? 'selected' : ''}>Magnates Media (High-Contrast Red/Noir)</option>
            <option value="james_jani" ${curCreatorProfile === 'james_jani' ? 'selected' : ''}>James Jani (WarmAmber Documentary)</option>
            <option value="johnny_harris" ${curCreatorProfile === 'johnny_harris' ? 'selected' : ''}>Johnny Harris (Tactical Map & Paper)</option>
            <option value="coldfusion" ${curCreatorProfile === 'coldfusion' ? 'selected' : ''}>ColdFusion (Cyber Cyan & Violet)</option>
            <option value="vox" ${curCreatorProfile === 'vox' ? 'selected' : ''}>Vox Editorial (Clean Newsprint & Marker)</option>
          </select>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">3D Stage Atmosphere</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-z0-color" value="${curZ0Color}">
            <span class="rg-color-hex">${curZ0Color.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-swatch-strip">
          ${['#1a0b2e', '#09192f', '#2a080c', '#062419', '#2b1b06', '#0a0a0f'].map((hex) => `
            <button type="button" class="rg-swatch-chip" style="background:${hex};" data-swatch-color="${hex}" data-swatch-target="magnates-bp-z0-color" title="${hex}"></button>
          `).join('')}
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Radial Glow Spread</span>
            <span class="rg-slider-val" data-val="z0GlowSpread_${sceneKey}">${curZ0GlowSpread}%</span>
          </div>
          <input type="range" class="rg-range" min="0" max="100" step="1" value="${curZ0GlowSpread}" data-dom-target="magnates-bp-z0-glow-spread" data-slider="z0GlowSpread_${sceneKey}" data-unit="%">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Backdrop Vignette Darkness</span>
            <span class="rg-slider-val" data-val="bgDarkGlobal_${sceneKey}">${curBgDarkGlobal}%</span>
          </div>
          <input type="range" class="rg-range" min="20" max="100" step="2" value="${curBgDarkGlobal}" data-dom-target="magnates-bp-bg-darkness" data-slider="bgDarkGlobal_${sceneKey}" data-unit="%">
        </div>
      `;
      return card;
    };

    if (sceneKey === 'printer_glitch_card') {
      if (advSubEl) advSubEl.textContent = 'Comparison cards, keyframe timing, and custom shapes.';

      const curThumbEl = document.getElementById('magnates-bp-thumb-printer-card');
      const isRemoved = p.printerCardImgRemoved === true;
      const curThumbSrc = isRemoved
        ? ''
        : ((curThumbEl && curThumbEl.getAttribute('src')) || p.printerCardImgUrl || '/printer_card_thumb.png');
      const curTitle = readDomVal('magnates-bp-input-printer-title', p.printerCardTitle || 'Wireless Color All-in-One Printer');
      const curSeries = readDomVal('magnates-bp-input-printer-series', p.printerCardSeries || 'PRO SERIES // WIRELESS INKJET');
      const curSalePrice = readDomVal('magnates-bp-input-printer-discount', p.printerCardPrice || '$99.99');
      const curOldPrice = readDomVal('magnates-bp-input-printer-price', p.printerCardOldPrice || '$149.99');
      const curStock = readDomVal('magnates-bp-input-printer-stock', p.printerCardStock || 'In Stock - Ships Today');
      const curCta = readDomVal('magnates-bp-input-printer-cta', p.printerCardCta || 'Add to Cart');
      const curStars = typeof p.printerCardStarCount === 'number' ? p.printerCardStarCount : 5;

      // SCENE 6: Matches Reference Image 2 Pixel-for-Pixel + Hover/Tap Zoom with Replace & Remove + Series & Stock fields
      const productCard = document.createElement('div');
      productCard.className = 'rg-inspector-section';
      productCard.setAttribute('data-sync-target', 'card');
      productCard.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Product Card</span>
          <span class="rg-section-subtitle">Edit the product details and call to action.</span>
        </div>
        <div class="rg-product-card-grid">
          <div class="rg-product-large-thumb ${!curThumbSrc ? 'is-empty' : ''}" data-role="large-product-thumb" title="Hover or tap to Replace or Remove product image">
            <img id="rg-bp-card-thumb-preview" src="${curThumbSrc || '/printer_card_thumb.png'}" style="${!curThumbSrc ? 'display:none;' : ''}" onerror="this.style.display='none'" alt="Product">
            <span class="rg-product-thumb-empty-hint">No Image<br>Tap to Add</span>
            <div class="rg-product-thumb-overlay">
              <button type="button" class="rg-thumb-action-btn rg-thumb-action-replace" data-action="replace-card-image">
                ${LUCIDE_ICONS.imageIcon}
                <span>Replace</span>
              </button>
              <button type="button" class="rg-thumb-action-btn rg-thumb-action-remove" data-action="remove-card-image">
                ${LUCIDE_ICONS.trash}
                <span>Remove</span>
              </button>
            </div>
            <input type="file" accept="image/*" data-role="local-thumb-file-input" style="display:none;">
          </div>
          <div class="rg-product-fields-col">
            <div class="rg-field-group">
              <label class="rg-field-label">Product Name</label>
              <input type="text" class="rg-input" data-dom-target="magnates-bp-input-printer-title" data-bind="printerCardTitle" value="${curTitle.replace(/"/g, '&quot;')}">
            </div>
            <div class="rg-field-row-2">
              <div class="rg-field-group">
                <label class="rg-field-label">Price</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-printer-discount" data-bind="printerCardPrice" value="${curSalePrice.replace(/"/g, '&quot;')}">
              </div>
              <div class="rg-field-group">
                <label class="rg-field-label">Original Price</label>
                <input type="text" class="rg-input rg-input-muted" data-dom-target="magnates-bp-input-printer-price" data-bind="printerCardOldPrice" value="${curOldPrice.replace(/"/g, '&quot;')}">
              </div>
            </div>
            <div class="rg-field-row-2">
              <div class="rg-field-group">
                <label class="rg-field-label">Rating</label>
                <div class="rg-rating-stars-open" data-role="rating-stars">
                  ${[1, 2, 3, 4, 5].map((n) => `
                    <button type="button" class="rg-star-btn ${n > curStars ? 'is-dim' : ''}" data-star="${n}" title="${n} Stars">${LUCIDE_ICONS.star}</button>
                  `).join('')}
                </div>
              </div>
              <div class="rg-field-group">
                <label class="rg-field-label">Button Text</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-printer-cta" data-bind="printerCardCta" value="${curCta.replace(/"/g, '&quot;')}">
              </div>
            </div>
          </div>
        </div>
        <div class="rg-field-row-2" style="margin-top:4px;">
          <div class="rg-field-group">
            <label class="rg-field-label">Series Picker</label>
            <select class="rg-select" data-dom-target="magnates-bp-input-printer-series" data-bind="printerCardSeries">
              ${[
                { val: 'PREMIUM SERIES', label: 'PREMIUM SERIES' },
                { val: 'PRO SERIES // WIRELESS INKJET', label: 'PRO SERIES // WIRELESS' },
                { val: 'STUDIO SERIES // LASER PRO', label: 'STUDIO SERIES // LASER' },
                { val: 'HOME OFFICE // ALL-IN-ONE', label: 'HOME OFFICE // ALL-IN-ONE' },
                { val: 'CREATOR // PHOTO EDITION', label: 'CREATOR // PHOTO EDITION' }
              ].map((opt) => `
                <option value="${opt.val}" ${curSeries.toUpperCase().includes(opt.label.split(' ')[0]) ? 'selected' : ''}>${opt.label}</option>
              `).join('')}
            </select>
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Stock Badge</label>
            <div class="rg-stock-input-wrap">
              <span class="rg-stock-status-dot"></span>
              <input type="text" class="rg-input" data-dom-target="magnates-bp-input-printer-stock" data-bind="printerCardStock" value="${curStock.replace(/"/g, '&quot;')}">
            </div>
          </div>
        </div>
      `;

      // Quick Style Card with 4 realistic material preview swatches (Clean | Glass | Glow | Outline)
      const activeStyle = p.printerCardQuickStyle || 'clean';
      const quickStyleCard = document.createElement('div');
      quickStyleCard.className = 'rg-inspector-section';
      quickStyleCard.innerHTML = `
        <div class="rg-section-header">
          <div class="rg-section-title-row">
            <span class="rg-section-caret">${LUCIDE_ICONS.chevronRight}</span>
            <span class="rg-section-title">Quick Style</span>
          </div>
        </div>
        <div class="rg-style-cards-grid">
          ${[
            { id: 'clean', label: 'Clean', cls: 'is-clean' },
            { id: 'glass', label: 'Glass', cls: 'is-glass' },
            { id: 'glow', label: 'Glow', cls: 'is-glow' },
            { id: 'outline', label: 'Outline', cls: 'is-outline' }
          ].map((st) => `
            <button type="button" class="rg-style-card ${activeStyle === st.id ? 'is-active' : ''}" data-style-preset="${st.id}">
              <span class="rg-style-card-check">${LUCIDE_ICONS.check}</span>
              <div class="rg-style-card-preview ${st.cls}">
                <div class="rg-mini-card"></div>
              </div>
              <span class="rg-style-card-name">${st.label}</span>
            </button>
          `).join('')}
        </div>
      `;

      // Card Animation section (Side-by-side Smooth Reveal wand dropdown + Speed: Slow | Normal | Fast)
      const activeAnim = p.printerCardAnimPreset || 'smooth_reveal';
      const activeSpeed = p.printerCardSpeedPreset || 'normal';
      const cardAnimSection = document.createElement('div');
      cardAnimSection.className = 'rg-inspector-section';
      cardAnimSection.innerHTML = `
        <div class="rg-section-header">
          <div class="rg-section-title-row">
            <span class="rg-section-caret">${LUCIDE_ICONS.chevronRight}</span>
            <span class="rg-section-title">Card Animation</span>
          </div>
          <span class="rg-section-subtitle">How the card appears and moves.</span>
        </div>
        <div class="rg-card-anim-row">
          <div class="rg-anim-select-wrap">
            <span class="rg-anim-select-icon">${LUCIDE_ICONS.wand}</span>
            <select class="rg-anim-select" data-role="card-anim-select">
              <option value="smooth_reveal" ${activeAnim === 'smooth_reveal' ? 'selected' : ''}>Smooth Reveal</option>
              <option value="spring_pop" ${activeAnim === 'spring_pop' ? 'selected' : ''}>Spring Pop</option>
              <option value="glitch_snap" ${activeAnim === 'glitch_snap' ? 'selected' : ''}>Glitch Snap</option>
              <option value="cinematic_float" ${activeAnim === 'cinematic_float' ? 'selected' : ''}>Cinematic Float</option>
            </select>
            <span class="rg-anim-select-chevron">${LUCIDE_ICONS.chevronDown}</span>
          </div>
          <div class="rg-speed-col">
            <span class="rg-speed-label">Speed</span>
            <div class="rg-speed-pills">
              <button type="button" class="rg-speed-pill ${activeSpeed === 'slow' ? 'is-active' : ''}" data-speed="slow">Slow</button>
              <button type="button" class="rg-speed-pill ${activeSpeed === 'normal' ? 'is-active' : ''}" data-speed="normal">Normal</button>
              <button type="button" class="rg-speed-pill ${activeSpeed === 'fast' ? 'is-active' : ''}" data-speed="fast">Fast</button>
            </div>
          </div>
        </div>
      `;

      // Scene Stage Objects & Layers Card (Visible right in Content tab + clickable to select on stage)
      const heroThumbEl = document.getElementById('magnates-bp-thumb-printer-hero');
      const accThumbEl = document.getElementById('magnates-bp-thumb-printer-acc');
      const cartThumbEl = document.getElementById('magnates-bp-thumb-printer-cartridge');
      const compThumbEl = document.getElementById('magnates-bp-thumb-printer-compatible');
      const heroSrc = (heroThumbEl && heroThumbEl.getAttribute('src')) || '/printer_hero_cutout.png';
      const accSrc = (accThumbEl && accThumbEl.getAttribute('src')) || '/printer_accessories_cutout.png';
      const cartSrc = (cartThumbEl && cartThumbEl.getAttribute('src')) || '/printer_cartridge_thumb.png';
      const compSrc = (compThumbEl && compThumbEl.getAttribute('src')) || '/printer_compatible_thumb.png';

      const stageLayersCard = document.createElement('div');
      stageLayersCard.className = 'rg-inspector-section';
      stageLayersCard.innerHTML = `
        <div class="rg-section-header">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span class="rg-section-title">Scene Stage Layers</span>
            <button type="button" class="rg-action-pill-btn is-accent" data-file-trigger="magnates-bp-add-extra-layer-input" title="Add extra PNG/WebP cutout layer">
              ${LUCIDE_ICONS.plus}
              <span>Add Layer</span>
            </button>
          </div>
          <span class="rg-section-subtitle">Click any object to select it on stage or replace its media.</span>
        </div>
        <div class="rg-media-asset-row is-selectable" data-select-stage-layer="printer_hero">
          <div class="rg-media-asset-info">
            <img class="rg-media-asset-thumb" src="${heroSrc}" alt="Hero Printer">
            <div class="rg-media-asset-meta">
              <span class="rg-media-asset-name">Hero Printer</span>
              <span class="rg-media-asset-sub">3D Object • Foreground Cutout</span>
            </div>
          </div>
          <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-printer-hero">
            ${LUCIDE_ICONS.imageIcon}
            <span>Replace</span>
          </button>
        </div>
        <div class="rg-media-asset-row is-selectable" data-select-stage-layer="card">
          <div class="rg-media-asset-info">
            <img class="rg-media-asset-thumb" src="${curThumbSrc || '/printer_card_thumb.png'}" alt="Product Card">
            <div class="rg-media-asset-meta">
              <span class="rg-media-asset-name">Product Card</span>
              <span class="rg-media-asset-sub">Card Layer • ${curSalePrice}</span>
            </div>
          </div>
          <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-printer-card-thumb">
            ${LUCIDE_ICONS.imageIcon}
            <span>Replace</span>
          </button>
        </div>
        <div class="rg-media-asset-row is-selectable" data-select-stage-layer="cartridge">
          <div class="rg-media-asset-info">
            <img class="rg-media-asset-thumb" src="${cartSrc}" alt="Comparison Card 1">
            <div class="rg-media-asset-meta">
              <span class="rg-media-asset-name">Comparison Card 1</span>
              <span class="rg-media-asset-sub">Original Ink Cartridge Card</span>
            </div>
          </div>
          <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-printer-cartridge">
            ${LUCIDE_ICONS.imageIcon}
            <span>Replace</span>
          </button>
        </div>
        <div class="rg-media-asset-row is-selectable" data-select-stage-layer="compatible">
          <div class="rg-media-asset-info">
            <img class="rg-media-asset-thumb" src="${compSrc}" alt="Comparison Card 2">
            <div class="rg-media-asset-meta">
              <span class="rg-media-asset-name">Comparison Card 2</span>
              <span class="rg-media-asset-sub">Compatible Ink Cartridge Card</span>
            </div>
          </div>
          <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-printer-compatible">
            ${LUCIDE_ICONS.imageIcon}
            <span>Replace</span>
          </button>
        </div>
        <div class="rg-media-asset-row is-selectable" data-select-stage-layer="printer_acc">
          <div class="rg-media-asset-info">
            <img class="rg-media-asset-thumb" src="${accSrc}" alt="Desk Props">
            <div class="rg-media-asset-meta">
              <span class="rg-media-asset-name">Desk Props</span>
              <span class="rg-media-asset-sub">Midground Tabletop Layer</span>
            </div>
          </div>
          <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-printer-acc">
            ${LUCIDE_ICONS.imageIcon}
            <span>Replace</span>
          </button>
        </div>
        <div class="rg-media-asset-row is-selectable" data-select-stage-layer="backdrop">
          <div class="rg-media-asset-info">
            <div class="rg-media-asset-icon">${LUCIDE_ICONS.lookTab}</div>
            <div class="rg-media-asset-meta">
              <span class="rg-media-asset-name">Studio Backdrop</span>
              <span class="rg-media-asset-sub">Environment Background Plate</span>
            </div>
          </div>
          <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-upload-z0">
            ${LUCIDE_ICONS.imageIcon}
            <span>Replace</span>
          </button>
        </div>
      `;

      // Shape Cards & Callouts Builder
      const shapeBuilderCard = document.createElement('div');
      shapeBuilderCard.className = 'rg-inspector-section';
      shapeBuilderCard.innerHTML = `
        <div class="rg-section-header">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span class="rg-section-title">Shape Cards & Callouts</span>
            <button type="button" class="rg-action-pill-btn is-danger" data-shape-clear="1">Clear</button>
          </div>
          <span class="rg-section-subtitle">Add vector callout badges or geometric overlays to the 3D stage.</span>
        </div>
        <div class="rg-action-pills-grid">
          <button type="button" class="rg-action-pill-btn is-accent" data-add-shape="rounded">+ Card</button>
          <button type="button" class="rg-action-pill-btn" data-add-shape="pill">+ Capsule</button>
          <button type="button" class="rg-action-pill-btn" data-add-shape="circle">+ Circle</button>
          <button type="button" class="rg-action-pill-btn" data-add-shape="hexagon">+ Hex</button>
          <button type="button" class="rg-action-pill-btn" data-add-shape="diamond">+ Diamond</button>
          <button type="button" class="rg-action-pill-btn" data-add-shape="star">+ Star</button>
          <button type="button" class="rg-action-pill-btn" data-add-shape="callout">+ Callout</button>
        </div>
      `;

      panes.content.appendChild(productCard);
      panes.content.appendChild(quickStyleCard);
      panes.content.appendChild(cardAnimSection);
      panes.content.appendChild(stageLayersCard);
      panes.content.appendChild(shapeBuilderCard);

      // Motion Tab (3D Float & Camera Drift + Cursor Path & Timing)
      const curZoomScale = parseFloat(readDomVal('magnates-bp-printer-zoom-scale', '1.50'));
      const curZoomDur = parseFloat(readDomVal('magnates-bp-printer-zoom-dur', '1.55'));
      const curUnfoldDur = parseFloat(readDomVal('magnates-bp-printer-unfold-dur', '0.85'));
      const curParallaxScale = parseFloat(readDomVal('magnates-bp-printer-parallax-scale', '1.14'));
      const curParallaxDur = parseFloat(readDomVal('magnates-bp-printer-parallax-dur', '1.70'));
      const curCursorDur = parseFloat(readDomVal('magnates-bp-easy-cursor-dur', '0.50'));
      const curCursorPause = parseFloat(readDomVal('magnates-bp-printer-cursor-pause', '0.18'));
      const curCursorSpeed = parseFloat(readDomVal('magnates-bp-printer-cursor-speed', '1.0'));
      const curCursorScale = parseFloat(readDomVal('magnates-bp-printer-cursor-scale', '1.0'));
      const curCursorStyle = readDomVal('magnates-bp-printer-cursor-style', 'arc_right');

      const motionCard = document.createElement('div');
      motionCard.className = 'rg-inspector-section';
      motionCard.innerHTML = `
        <div class="rg-section-header">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span class="rg-section-title">3D Float & Camera Drift</span>
            <button type="button" class="rg-action-pill-btn" data-btn-target="btn-magnates-bp-printer-reset-pos">Reset Positions</button>
          </div>
          <span class="rg-section-subtitle">Control camera push-in, parallax, and card reveal choreography.</span>
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Hero Camera Zoom</span>
            <span class="rg-slider-val" data-val="printerZoomScale">${curZoomScale.toFixed(2)}x</span>
          </div>
          <input type="range" class="rg-range" min="1.1" max="2.0" step="0.05" value="${curZoomScale}" data-dom-target="magnates-bp-printer-zoom-scale" data-slider="printerZoomScale" data-unit="x">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Camera Push Duration</span>
            <span class="rg-slider-val" data-val="printerZoomDur">${curZoomDur.toFixed(2)}s</span>
          </div>
          <input type="range" class="rg-range" min="0.5" max="3.0" step="0.05" value="${curZoomDur}" data-dom-target="magnates-bp-printer-zoom-dur" data-slider="printerZoomDur" data-unit="s">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Card Unfold Duration</span>
            <span class="rg-slider-val" data-val="printerUnfoldDur">${curUnfoldDur.toFixed(2)}s</span>
          </div>
          <input type="range" class="rg-range" min="0.2" max="2.0" step="0.05" value="${curUnfoldDur}" data-dom-target="magnates-bp-printer-unfold-dur" data-slider="printerUnfoldDur" data-unit="s">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Foreground Parallax Scale</span>
            <span class="rg-slider-val" data-val="printerParallaxScale">${curParallaxScale.toFixed(2)}x</span>
          </div>
          <input type="range" class="rg-range" min="1.0" max="1.45" step="0.02" value="${curParallaxScale}" data-dom-target="magnates-bp-printer-parallax-scale" data-slider="printerParallaxScale" data-unit="x">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Parallax Drift Duration</span>
            <span class="rg-slider-val" data-val="printerParallaxDur">${curParallaxDur.toFixed(2)}s</span>
          </div>
          <input type="range" class="rg-range" min="0.6" max="3.0" step="0.05" value="${curParallaxDur}" data-dom-target="magnates-bp-printer-parallax-dur" data-slider="printerParallaxDur" data-unit="s">
        </div>
      `;

      const cursorMotionCard = document.createElement('div');
      cursorMotionCard.className = 'rg-inspector-section';
      cursorMotionCard.innerHTML = `
        <div class="rg-section-header">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span class="rg-section-title">Cursor Path & Click Timing</span>
            <div style="display:flex;gap:5px;">
              <button type="button" class="rg-action-pill-btn is-accent" data-btn-target="btn-magnates-bp-pick-cursor-target">Pick Target</button>
              <button type="button" class="rg-action-pill-btn" data-btn-target="btn-magnates-bp-reset-cursor-target">Auto</button>
            </div>
          </div>
          <span class="rg-section-subtitle">Configure pointer curve trajectory and click hesitation.</span>
        </div>
        <div class="rg-field-group">
          <label class="rg-field-label">Pointer Trajectory Curve</label>
          <select class="rg-input" data-select-target="magnates-bp-printer-cursor-style">
            <option value="arc_right" ${curCursorStyle === 'arc_right' ? 'selected' : ''}>Natural Right Arc (Human Hand)</option>
            <option value="direct" ${curCursorStyle === 'direct' ? 'selected' : ''}>Direct Linear Snap</option>
            <option value="swoop_bottom" ${curCursorStyle === 'swoop_bottom' ? 'selected' : ''}>Bottom Swoop Approach</option>
            <option value="overshoot" ${curCursorStyle === 'overshoot' ? 'selected' : ''}>Spring Overshoot & Settle</option>
          </select>
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Cursor Path Duration</span>
            <span class="rg-slider-val" data-val="printerCursorPathDur">${curCursorDur.toFixed(2)}s</span>
          </div>
          <input type="range" class="rg-range" min="0.15" max="1.5" step="0.05" value="${curCursorDur}" data-dom-target="magnates-bp-easy-cursor-dur" data-slider="printerCursorPathDur" data-unit="s">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Pre-Click Hesitation Pause</span>
            <span class="rg-slider-val" data-val="printerCursorPause">${curCursorPause.toFixed(2)}s</span>
          </div>
          <input type="range" class="rg-range" min="0" max="0.8" step="0.02" value="${curCursorPause}" data-dom-target="magnates-bp-printer-cursor-pause" data-slider="printerCursorPause" data-unit="s">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Cursor Click Speed</span>
            <span class="rg-slider-val" data-val="printerCursorSpeed">${curCursorSpeed.toFixed(1)}x</span>
          </div>
          <input type="range" class="rg-range" min="0.5" max="2.5" step="0.1" value="${curCursorSpeed}" data-dom-target="magnates-bp-printer-cursor-speed" data-slider="printerCursorSpeed" data-unit="x">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Pointer Size Scale</span>
            <span class="rg-slider-val" data-val="printerCursorScale">${curCursorScale.toFixed(2)}x</span>
          </div>
          <input type="range" class="rg-range" min="0.6" max="1.8" step="0.05" value="${curCursorScale}" data-dom-target="magnates-bp-printer-cursor-scale" data-slider="printerCursorScale" data-unit="x">
        </div>
      `;

      panes.motion.appendChild(motionCard);
      panes.motion.appendChild(cursorMotionCard);

      // Look Tab (Saved Look Presets + Card Surface & Typography Colors + Global Atmosphere)
      panes.look.appendChild(createLookPresetsCard(() => document.getElementById('magnates-bp-stage')));

      const curCardBg = readDomVal('magnates-bp-printer-card-bg', '#ffffff');
      const curCardRadius = parseFloat(readDomVal('magnates-bp-printer-card-radius', '14'));
      const curFontScale = parseFloat(readDomVal('magnates-bp-printer-font-scale', '100'));
      const curTitleColor = readDomVal('magnates-bp-printer-title-color', '#0f172a');
      const curDiscountColor = readDomVal('magnates-bp-printer-discount-color', '#16a34a');
      const curStrikeChecked = readDomChecked('magnates-bp-toggle-printer-strike', true);
      const curStrikeColor = readDomVal('magnates-bp-printer-strike-color', '#ef4444');
      const curStarColor = readDomVal('magnates-bp-printer-star-color', '#f59e0b');
      const curStockColor = readDomVal('magnates-bp-printer-stock-color', '#10b981');
      const curCtaBg = readDomVal('magnates-bp-printer-cta-bg', '#f59e0b');
      const curCursorColor = readDomVal('magnates-bp-printer-cursor-color', '#ffffff');

      const cardLookSection = document.createElement('div');
      cardLookSection.className = 'rg-inspector-section';
      cardLookSection.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Card Surface & Typography</span>
          <span class="rg-section-subtitle">Customize card colors, price strikethrough, and corner radius.</span>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Card Surface Fill</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-card-bg" value="${curCardBg}">
            <span class="rg-color-hex">${curCardBg.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Product Title Color</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-title-color" value="${curTitleColor}">
            <span class="rg-color-hex">${curTitleColor.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Sale Price Color</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-discount-color" value="${curDiscountColor}">
            <span class="rg-color-hex">${curDiscountColor.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-toggle-row">
          <span class="rg-toggle-label">Red Price Strikethrough</span>
          <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-printer-strike" ${curStrikeChecked ? 'checked' : ''}>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Strikethrough Line Color</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-strike-color" value="${curStrikeColor}">
            <span class="rg-color-hex">${curStrikeColor.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Star Rating Color</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-star-color" value="${curStarColor}">
            <span class="rg-color-hex">${curStarColor.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Stock Badge Color</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-stock-color" value="${curStockColor}">
            <span class="rg-color-hex">${curStockColor.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">CTA Button Fill</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-cta-bg" value="${curCtaBg}">
            <span class="rg-color-hex">${curCtaBg.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Pointer Fill Color</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-cursor-color" value="${curCursorColor}">
            <span class="rg-color-hex">${curCursorColor.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Card Corner Radius</span>
            <span class="rg-slider-val" data-val="printerCardRadius">${curCardRadius}px</span>
          </div>
          <input type="range" class="rg-range" min="0" max="28" step="1" value="${curCardRadius}" data-dom-target="magnates-bp-printer-card-radius" data-slider="printerCardRadius" data-unit="px">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Typography Scale</span>
            <span class="rg-slider-val" data-val="printerFontScale">${curFontScale}%</span>
          </div>
          <input type="range" class="rg-range" min="75" max="135" step="5" value="${curFontScale}" data-dom-target="magnates-bp-printer-font-scale" data-slider="printerFontScale" data-unit="%">
        </div>
      `;

      panes.look.appendChild(cardLookSection);
      panes.look.appendChild(createGlobalAtmosphereLookCard());

      // Effects Tab (Glitch, Sheen Flash, Card Glow, Exit Blur, LCD Blinks)
      const curFlashInt = parseFloat(readDomVal('magnates-bp-printer-flash-intensity', '95'));
      const curFlashDur = parseFloat(readDomVal('magnates-bp-printer-flash-dur', '0.42'));
      const curGlitchInt = parseFloat(readDomVal('magnates-bp-printer-glitch-intensity', '100'));
      const curGlowColor = readDomVal('magnates-bp-printer-glow-color', '#38bdf8');
      const curGlowRadius = parseFloat(readDomVal('magnates-bp-printer-glow-radius', '42'));
      const curExitBlur = parseFloat(readDomVal('magnates-bp-printer-exit-blur', '14'));
      const curWarnBlinks = parseFloat(readDomVal('magnates-bp-printer-warn-blinks', '3'));

      const fxCard = document.createElement('div');
      fxCard.className = 'rg-inspector-section';
      fxCard.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Glitch, Sheen & Glow Optics</span>
          <span class="rg-section-subtitle">Adjust the cinematic flash, halo bloom, and chromatic displacement.</span>
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>White Sheen Flash</span>
            <span class="rg-slider-val" data-val="printerFlashStrength">${curFlashInt}%</span>
          </div>
          <input type="range" class="rg-range" min="0" max="150" step="5" value="${curFlashInt}" data-dom-target="magnates-bp-printer-flash-intensity" data-slider="printerFlashStrength" data-unit="%">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Sheen Flash Duration</span>
            <span class="rg-slider-val" data-val="printerFlashDur">${curFlashDur.toFixed(2)}s</span>
          </div>
          <input type="range" class="rg-range" min="0.1" max="1.2" step="0.02" value="${curFlashDur}" data-dom-target="magnates-bp-printer-flash-dur" data-slider="printerFlashDur" data-unit="s">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Glitch Displacement</span>
            <span class="rg-slider-val" data-val="printerGlitchAmount">${curGlitchInt}%</span>
          </div>
          <input type="range" class="rg-range" min="0" max="200" step="5" value="${curGlitchInt}" data-dom-target="magnates-bp-printer-glitch-intensity" data-slider="printerGlitchAmount" data-unit="%">
        </div>
        <div class="rg-color-row">
          <span class="rg-color-label">Card Rim Glow Color</span>
          <div class="rg-color-picker-wrap">
            <input type="color" class="rg-color-input" data-color-target="magnates-bp-printer-glow-color" value="${curGlowColor}">
            <span class="rg-color-hex">${curGlowColor.toUpperCase()}</span>
          </div>
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Card Glow Radius</span>
            <span class="rg-slider-val" data-val="printerGlowRadius">${curGlowRadius}px</span>
          </div>
          <input type="range" class="rg-range" min="0" max="100" step="2" value="${curGlowRadius}" data-dom-target="magnates-bp-printer-glow-radius" data-slider="printerGlowRadius" data-unit="px">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Exit Motion Blur</span>
            <span class="rg-slider-val" data-val="printerExitBlur">${curExitBlur}px</span>
          </div>
          <input type="range" class="rg-range" min="0" max="32" step="1" value="${curExitBlur}" data-dom-target="magnates-bp-printer-exit-blur" data-slider="printerExitBlur" data-unit="px">
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>LCD Warning Blinks</span>
            <span class="rg-slider-val" data-val="printerWarnBlinks">${curWarnBlinks}</span>
          </div>
          <input type="range" class="rg-range" min="0" max="6" step="1" value="${curWarnBlinks}" data-dom-target="magnates-bp-printer-warn-blinks" data-slider="printerWarnBlinks" data-unit="">
        </div>
      `;
      panes.effects.appendChild(fxCard);

      // Scene 6 Advanced Controls Drawer
      if (advDrawer) {
        const curCartTitle = readDomVal('magnates-bp-input-cartridge-title', 'Original Brand Cartridge XL');
        const curCartPrice = readDomVal('magnates-bp-input-cartridge-price', '$65.99');
        const curCartSub = readDomVal('magnates-bp-input-cartridge-sub', 'GENUINE OEM INK // HIGH YIELD');
        const curCartCta = readDomVal('magnates-bp-input-cartridge-cta', 'Buy Original');
        const curCartPriceColor = readDomVal('magnates-bp-cartridge-price-color', '#ef4444');
        const curCartStrike = readDomChecked('magnates-bp-toggle-cartridge-strike', false);

        const curCompTitle = readDomVal('magnates-bp-input-compatible-title', 'Compatible Cartridge XL');
        const curCompPrice = readDomVal('magnates-bp-input-compatible-price', '$14.99');
        const curCompSub = readDomVal('magnates-bp-input-compatible-sub', '3RD-PARTY CHIP // BLOCKED BY FIRMWARE');
        const curCompCta = readDomVal('magnates-bp-input-compatible-cta', 'Firmware Blocked');
        const curCompPriceColor = readDomVal('magnates-bp-compatible-price-color', '#16a34a');
        const curCompStrike = readDomChecked('magnates-bp-toggle-compatible-strike', true);

        const curGlitchTime = parseFloat(readDomVal('magnates-bp-printer-glitch-time', '1.15'));
        const curGlitchDur = parseFloat(readDomVal('magnates-bp-printer-glitch-dur', '0.45'));
        const curSlitDelay = parseFloat(readDomVal('magnates-bp-printer-slit-delay', '1.85'));
        const curTopCardY = parseFloat(readDomVal('magnates-bp-printer-topcard-y', '-105'));
        const curCardGap = parseFloat(readDomVal('magnates-bp-printer-card-gap', '165'));
        const curCartY = parseFloat(readDomVal('magnates-bp-printer-cart-y', '45'));

        const advComparisonCard = document.createElement('div');
        advComparisonCard.className = 'rg-inspector-section';
        advComparisonCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Secondary Comparison Cards</span>
            <span class="rg-section-subtitle">Configure the unfolded cartridge comparison stack.</span>
          </div>
          <div class="rg-adv-subcard">
            <div class="rg-adv-subcard-title">
              <span>Comparison Card 1 (Original)</span>
              <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-printer-cartridge">
                ${LUCIDE_ICONS.imageIcon}
                <span>Replace Image</span>
              </button>
            </div>
            <div class="rg-field-row-2">
              <div class="rg-field-group">
                <label class="rg-field-label">Card Title</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-cartridge-title" data-bind="cartridgeTitle" value="${curCartTitle.replace(/"/g, '&quot;')}">
              </div>
              <div class="rg-field-group">
                <label class="rg-field-label">Price</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-cartridge-price" data-bind="cartridgePrice" value="${curCartPrice.replace(/"/g, '&quot;')}">
              </div>
            </div>
            <div class="rg-field-row-2">
              <div class="rg-field-group">
                <label class="rg-field-label">Subtitle / Spec</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-cartridge-sub" data-bind="cartridgeSub" value="${curCartSub.replace(/"/g, '&quot;')}">
              </div>
              <div class="rg-field-group">
                <label class="rg-field-label">Button Label</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-cartridge-cta" data-bind="cartridgeCta" value="${curCartCta.replace(/"/g, '&quot;')}">
              </div>
            </div>
            <div class="rg-color-row">
              <span class="rg-color-label">Price Color</span>
              <div class="rg-color-picker-wrap">
                <input type="color" class="rg-color-input" data-color-target="magnates-bp-cartridge-price-color" value="${curCartPriceColor}">
                <span class="rg-color-hex">${curCartPriceColor.toUpperCase()}</span>
              </div>
            </div>
            <div class="rg-toggle-row">
              <span class="rg-toggle-label">Price Strikethrough</span>
              <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-cartridge-strike" ${curCartStrike ? 'checked' : ''}>
            </div>
          </div>
          <div class="rg-adv-subcard">
            <div class="rg-adv-subcard-title">
              <span>Comparison Card 2 (Compatible)</span>
              <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-printer-compatible">
                ${LUCIDE_ICONS.imageIcon}
                <span>Replace Image</span>
              </button>
            </div>
            <div class="rg-field-row-2">
              <div class="rg-field-group">
                <label class="rg-field-label">Card Title</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-compatible-title" data-bind="compatibleTitle" value="${curCompTitle.replace(/"/g, '&quot;')}">
              </div>
              <div class="rg-field-group">
                <label class="rg-field-label">Price</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-compatible-price" data-bind="compatiblePrice" value="${curCompPrice.replace(/"/g, '&quot;')}">
              </div>
            </div>
            <div class="rg-field-row-2">
              <div class="rg-field-group">
                <label class="rg-field-label">Subtitle / Spec</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-compatible-sub" data-bind="compatibleSub" value="${curCompSub.replace(/"/g, '&quot;')}">
              </div>
              <div class="rg-field-group">
                <label class="rg-field-label">Button Label</label>
                <input type="text" class="rg-input" data-dom-target="magnates-bp-input-compatible-cta" data-bind="compatibleCta" value="${curCompCta.replace(/"/g, '&quot;')}">
              </div>
            </div>
            <div class="rg-color-row">
              <span class="rg-color-label">Price Color</span>
              <div class="rg-color-picker-wrap">
                <input type="color" class="rg-color-input" data-color-target="magnates-bp-compatible-price-color" value="${curCompPriceColor}">
                <span class="rg-color-hex">${curCompPriceColor.toUpperCase()}</span>
              </div>
            </div>
            <div class="rg-toggle-row">
              <span class="rg-toggle-label">Price Strikethrough</span>
              <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-compatible-strike" ${curCompStrike ? 'checked' : ''}>
            </div>
          </div>
        `;

        const advTimingCard = document.createElement('div');
        advTimingCard.className = 'rg-inspector-section';
        advTimingCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Timing & Spatial Fine-Tuning</span>
            <span class="rg-section-subtitle">Precision keyframe offsets and card stack geometry.</span>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Glitch Entry Time</span>
              <span class="rg-slider-val" data-val="printerGlitchTime">${curGlitchTime.toFixed(2)}s</span>
            </div>
            <input type="range" class="rg-range" min="0.2" max="2.5" step="0.05" value="${curGlitchTime}" data-dom-target="magnates-bp-printer-glitch-time" data-slider="printerGlitchTime" data-unit="s">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Glitch Duration</span>
              <span class="rg-slider-val" data-val="printerGlitchDur">${curGlitchDur.toFixed(2)}s</span>
            </div>
            <input type="range" class="rg-range" min="0.15" max="1.2" step="0.05" value="${curGlitchDur}" data-dom-target="magnates-bp-printer-glitch-dur" data-slider="printerGlitchDur" data-unit="s">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Card Unfold Delay</span>
              <span class="rg-slider-val" data-val="printerSlitDelay">${curSlitDelay.toFixed(2)}s</span>
            </div>
            <input type="range" class="rg-range" min="0.8" max="3.2" step="0.05" value="${curSlitDelay}" data-dom-target="magnates-bp-printer-slit-delay" data-slider="printerSlitDelay" data-unit="s">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Primary Card Y-Offset</span>
              <span class="rg-slider-val" data-val="printerTopCardY">${curTopCardY}px</span>
            </div>
            <input type="range" class="rg-range" min="-200" max="20" step="5" value="${curTopCardY}" data-dom-target="magnates-bp-printer-topcard-y" data-slider="printerTopCardY" data-unit="px">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Card Stack Gap</span>
              <span class="rg-slider-val" data-val="printerCardGap">${curCardGap}px</span>
            </div>
            <input type="range" class="rg-range" min="110" max="230" step="5" value="${curCardGap}" data-dom-target="magnates-bp-printer-card-gap" data-slider="printerCardGap" data-unit="px">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Cartridge Stack Y-Offset</span>
              <span class="rg-slider-val" data-val="printerCartY">${curCartY}px</span>
            </div>
            <input type="range" class="rg-range" min="-60" max="140" step="5" value="${curCartY}" data-dom-target="magnates-bp-printer-cart-y" data-slider="printerCartY" data-unit="px">
          </div>
        `;

        advDrawer.appendChild(advComparisonCard);
        advDrawer.appendChild(advTimingCard);
      }

      // Bindings for Scene 6 Large Thumbnail (Tap to toggle zoom/actions + Replace & Remove)
      const largeThumbBox = productCard.querySelector('[data-role="large-product-thumb"]');
      const replaceBtn = productCard.querySelector('[data-action="replace-card-image"]');
      const removeBtn = productCard.querySelector('[data-action="remove-card-image"]');
      const localFileInput = productCard.querySelector('[data-role="local-thumb-file-input"]');
      const previewImg = productCard.querySelector('#rg-bp-card-thumb-preview');

      if (largeThumbBox) {
        largeThumbBox.addEventListener('click', (e) => {
          if (e.target.closest('button') || e.target.closest('input')) return;
          largeThumbBox.classList.toggle('is-tapped');
        });
      }

      const applyNewCardThumbSrc = (dataUrl) => {
        p.printerCardImgRemoved = false;
        p.printerCardImgUrl = dataUrl;
        if (previewImg) {
          previewImg.src = dataUrl;
          previewImg.style.display = '';
        }
        if (largeThumbBox) {
          largeThumbBox.classList.remove('is-empty', 'is-tapped');
        }
        const origThumb = document.getElementById('magnates-bp-thumb-printer-card');
        if (origThumb) {
          origThumb.src = dataUrl;
          origThumb.style.display = '';
        }
        const stageCardImg = document.querySelector('#magnates-bp-spec-card img');
        if (stageCardImg) {
          stageCardImg.src = dataUrl;
          stageCardImg.style.display = '';
        }
        triggerBlueprintRender();
      };

      if (replaceBtn) {
        replaceBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const legacyUpload =
            document.getElementById('magnates-bp-input-printer-card-thumb') ||
            document.getElementById('magnates-bp-input-printer-compatible') ||
            document.getElementById('bp-printer-card-upload-btn');
          if (legacyUpload) {
            legacyUpload.click();
          } else if (localFileInput) {
            localFileInput.click();
          }
        });
      }

      if (localFileInput) {
        localFileInput.addEventListener('change', () => {
          const file = localFileInput.files && localFileInput.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target && ev.target.result) {
              applyNewCardThumbSrc(ev.target.result);
            }
          };
          reader.readAsDataURL(file);
        });
      }

      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          p.printerCardImgRemoved = true;
          p.printerCardImgUrl = '';
          if (previewImg) {
            previewImg.removeAttribute('src');
            previewImg.style.display = 'none';
          }
          if (largeThumbBox) {
            largeThumbBox.classList.add('is-empty');
            largeThumbBox.classList.remove('is-tapped');
          }
          const origThumb = document.getElementById('magnates-bp-thumb-printer-card');
          if (origThumb) {
            origThumb.style.display = 'none';
          }
          const stageCardImg = document.querySelector('#magnates-bp-spec-card img');
          if (stageCardImg) {
            stageCardImg.style.display = 'none';
          }
          triggerBlueprintRender();
        });
      }

      // Interactive 5 Gold Stars Rating
      productCard.querySelectorAll('.rg-star-btn').forEach((starBtn) => {
        starBtn.addEventListener('click', () => {
          const chosen = parseInt(starBtn.getAttribute('data-star') || '5', 10);
          p.printerCardStarCount = chosen;
          p.printerCardRating = chosen + '.0';
          productCard.querySelectorAll('.rg-star-btn').forEach((b) => {
            const n = parseInt(b.getAttribute('data-star') || '5', 10);
            b.classList.toggle('is-dim', n > chosen);
          });
          triggerBlueprintRender();
        });
      });

      quickStyleCard.querySelectorAll('.rg-style-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          quickStyleCard.querySelectorAll('.rg-style-card').forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const styleId = btn.getAttribute('data-style-preset');
          p.printerCardQuickStyle = styleId;

          const specCard = document.getElementById('magnates-bp-spec-card');
          const compCard = document.getElementById('magnates-bp-compatible-card');

          if (styleId === 'glow') {
            writeDomVal('magnates-bp-printer-flash-intensity', 135);
            if (specCard) {
              specCard.style.background = '#ffffff';
              specCard.style.backdropFilter = 'none';
              specCard.style.border = '2px solid #a855f7';
              specCard.style.boxShadow = '0 0 45px rgba(168, 85, 247, 0.85), 0 20px 50px rgba(0, 0, 0, 0.6)';
            }
            if (compCard) {
              compCard.style.background = '#ffffff';
              compCard.style.border = '2px solid #a855f7';
              compCard.style.boxShadow = '0 0 45px rgba(168, 85, 247, 0.85), 0 20px 50px rgba(0, 0, 0, 0.6)';
            }
          } else if (styleId === 'clean') {
            writeDomVal('magnates-bp-printer-flash-intensity', 95);
            if (specCard) {
              specCard.style.background = '#ffffff';
              specCard.style.backdropFilter = 'none';
              specCard.style.border = '1px solid rgba(0, 0, 0, 0.08)';
              specCard.style.boxShadow = '0 16px 42px rgba(0, 0, 0, 0.45)';
            }
            if (compCard) {
              compCard.style.background = '#ffffff';
              compCard.style.border = '1px solid rgba(0, 0, 0, 0.08)';
              compCard.style.boxShadow = '0 16px 42px rgba(0, 0, 0, 0.45)';
            }
          } else if (styleId === 'glass') {
            writeDomVal('magnates-bp-printer-flash-intensity', 115);
            if (specCard) {
              specCard.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.72) 100%)';
              specCard.style.backdropFilter = 'blur(16px)';
              specCard.style.border = '1.5px solid rgba(255, 255, 255, 0.6)';
              specCard.style.boxShadow = '0 20px 48px rgba(0, 0, 0, 0.4), 0 0 16px rgba(56, 189, 248, 0.25)';
            }
            if (compCard) {
              compCard.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.72) 100%)';
              compCard.style.backdropFilter = 'blur(16px)';
              compCard.style.border = '1.5px solid rgba(255, 255, 255, 0.6)';
              compCard.style.boxShadow = '0 20px 48px rgba(0, 0, 0, 0.4), 0 0 16px rgba(56, 189, 248, 0.25)';
            }
          } else if (styleId === 'outline') {
            writeDomVal('magnates-bp-printer-flash-intensity', 60);
            if (specCard) {
              specCard.style.background = '#f8fafc';
              specCard.style.backdropFilter = 'none';
              specCard.style.border = '2.5px solid #38bdf8';
              specCard.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.45), 0 15px 40px rgba(0, 0, 0, 0.5)';
            }
            if (compCard) {
              compCard.style.background = '#f8fafc';
              compCard.style.backdropFilter = 'none';
              compCard.style.border = '2.5px solid #38bdf8';
              compCard.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.45), 0 15px 40px rgba(0, 0, 0, 0.5)';
            }
          }
          triggerBlueprintRender();
        });
      });

      const animSelect = cardAnimSection.querySelector('[data-role="card-anim-select"]');
      if (animSelect) {
        animSelect.addEventListener('change', () => {
          p.printerCardAnimPreset = animSelect.value;
          if (animSelect.value === 'spring_pop') writeDomVal('magnates-bp-printer-unfold-dur', '0.55');
          else if (animSelect.value === 'glitch_snap') writeDomVal('magnates-bp-printer-glitch-intensity', '160');
          else if (animSelect.value === 'cinematic_float') writeDomVal('magnates-bp-printer-zoom-dur', '2.10');
          else writeDomVal('magnates-bp-printer-unfold-dur', '0.85');
          triggerBlueprintRender();
        });
      }

      cardAnimSection.querySelectorAll('.rg-speed-pill').forEach((btn) => {
        btn.addEventListener('click', () => {
          cardAnimSection.querySelectorAll('.rg-speed-pill').forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const spd = btn.getAttribute('data-speed');
          p.printerCardSpeedPreset = spd;
          if (spd === 'slow') writeDomVal('magnates-bp-printer-unfold-dur', '1.25');
          else if (spd === 'fast') writeDomVal('magnates-bp-printer-unfold-dur', '0.50');
          else writeDomVal('magnates-bp-printer-unfold-dur', '0.85');
          triggerBlueprintRender();
        });
      });

    } else {
      // SCENES 1–5: Standardized 4-Tab Contextual Inspector + Complete Scene-Specific Controls
      const meta = BLUEPRINT_SCENE_META[sceneKey] || BLUEPRINT_SCENE_META['brand_wavy_intro'];
      if (advSubEl) advSubEl.textContent = 'Fine-tune scene parameters, camera, and timing.';

      if (sceneKey === 'brand_wavy_intro') {
        const curLine1 = readDomVal('magnates-bp-input-wavy-line1', 'ONE OF THE STRANGEST BUSINESSES');
        const curLine2 = readDomVal('magnates-bp-input-wavy-line2', 'ON THE INTERNET.');
        const curWavyToggle = readDomChecked('magnates-bp-toggle-wavy', true);
        const curLogoRise = parseFloat(readDomVal('magnates-bp-logo-rise-time', '0.80'));
        const curLogoShift = parseFloat(readDomVal('magnates-bp-logo-shift-time', '2.20'));
        const curRevealSpeed = parseFloat(readDomVal('magnates-bp-wavy-reveal-speed', '1.0'));
        const curLineGap = parseFloat(readDomVal('magnates-bp-wavy-line-gap', '16'));
        const curGlowColor = readDomVal('magnates-bp-logo-glow-color', '#f97316');
        const curGlowInt = parseFloat(readDomVal('magnates-bp-logo-glow-intensity', '90'));

        const contentCard = document.createElement('div');
        contentCard.className = 'rg-inspector-section';
        contentCard.setAttribute('data-sync-target', 'headline');
        contentCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">${meta.title}</span>
            <span class="rg-section-subtitle">Edit the wavy intro headline and 3D emblem plate.</span>
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Primary Wavy Headline</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-wavy-line1" data-bind="headline_brand_wavy_intro" value="${curLine1.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Secondary Line</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-wavy-line2" data-bind="sub_brand_wavy_intro" value="${curLine2.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-toggle-row">
            <span class="rg-toggle-label">Enable Wavy Text Backdrop</span>
            <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-wavy" ${curWavyToggle ? 'checked' : ''}>
          </div>
          <div class="rg-media-asset-row is-selectable" data-select-stage-layer="logo">
            <div class="rg-media-asset-info">
              <div class="rg-media-asset-icon">${LUCIDE_ICONS.cube3d}</div>
              <div class="rg-media-asset-meta">
                <span class="rg-media-asset-name">Brand Hero Emblem</span>
                <span class="rg-media-asset-sub">Center 3D floating logo plate</span>
              </div>
            </div>
            <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-brand-logo">
              ${LUCIDE_ICONS.imageIcon}
              <span>Replace</span>
            </button>
          </div>
        `;
        panes.content.appendChild(contentCard);
        panes.content.appendChild(createFallbackQuickStyleCard());
        panes.content.appendChild(createFallbackSceneAnimationCard());

        const motionCard = document.createElement('div');
        motionCard.className = 'rg-inspector-section';
        motionCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Logo Rise & Wavy Choreography</span>
            <span class="rg-section-subtitle">Control emblem entrance and wavy text reveal speed.</span>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Logo Rise Duration</span>
              <span class="rg-slider-val" data-val="logoRiseTime">${curLogoRise.toFixed(2)}s</span>
            </div>
            <input type="range" class="rg-range" min="0.2" max="2.5" step="0.05" value="${curLogoRise}" data-dom-target="magnates-bp-logo-rise-time" data-slider="logoRiseTime" data-unit="s">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Logo Shift Right Time</span>
              <span class="rg-slider-val" data-val="logoShiftTime">${curLogoShift.toFixed(2)}s</span>
            </div>
            <input type="range" class="rg-range" min="0.5" max="4.0" step="0.05" value="${curLogoShift}" data-dom-target="magnates-bp-logo-shift-time" data-slider="logoShiftTime" data-unit="s">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Wavy Reveal Pacing</span>
              <span class="rg-slider-val" data-val="wavyRevealSpeed">${curRevealSpeed.toFixed(1)}x</span>
            </div>
            <input type="range" class="rg-range" min="0.4" max="2.2" step="0.1" value="${curRevealSpeed}" data-dom-target="magnates-bp-wavy-reveal-speed" data-slider="wavyRevealSpeed" data-unit="x">
          </div>
        `;
        panes.motion.appendChild(motionCard);

        panes.look.appendChild(createLookPresetsCard(() => document.getElementById('magnates-bp-stage')));
        panes.look.appendChild(createGlobalAtmosphereLookCard());

        const fxCard = document.createElement('div');
        fxCard.className = 'rg-inspector-section';
        fxCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Emblem Rim Glow & Spacing</span>
            <span class="rg-section-subtitle">Customize emblem neon halo and line geometry.</span>
          </div>
          <div class="rg-color-row">
            <span class="rg-color-label">Logo Rim Glow Color</span>
            <div class="rg-color-picker-wrap">
              <input type="color" class="rg-color-input" data-color-target="magnates-bp-logo-glow-color" value="${curGlowColor}">
              <span class="rg-color-hex">${curGlowColor.toUpperCase()}</span>
            </div>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Rim Glow Intensity</span>
              <span class="rg-slider-val" data-val="logoGlowInt">${curGlowInt}%</span>
            </div>
            <input type="range" class="rg-range" min="0" max="150" step="5" value="${curGlowInt}" data-dom-target="magnates-bp-logo-glow-intensity" data-slider="logoGlowInt" data-unit="%">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Typography Line Spacing</span>
              <span class="rg-slider-val" data-val="wavyLineGap">${curLineGap}px</span>
            </div>
            <input type="range" class="rg-range" min="4" max="42" step="2" value="${curLineGap}" data-dom-target="magnates-bp-wavy-line-gap" data-slider="wavyLineGap" data-unit="px">
          </div>
        `;
        panes.effects.appendChild(fxCard);

      } else if (sceneKey === 'products_unfurl') {
        const curProd1 = readDomVal('magnates-bp-input-prod1-price', '$2.00');
        const curProd2 = readDomVal('magnates-bp-input-prod2-price', '$5.00');
        const curUnfurlSpd = parseFloat(readDomVal('magnates-bp-prod-unfurl-speed', '1.0'));
        const curLogoShift = parseFloat(readDomVal('magnates-bp-logo-shift-time', '2.20'));
        const curOuterRing = readDomChecked('magnates-bp-toggle-concentric-outer', true);
        const curOuterColor = readDomVal('magnates-bp-concentric-outer-color', '#f97316');
        const curInnerRing = readDomChecked('magnates-bp-toggle-concentric-inner', true);
        const curInnerColor = readDomVal('magnates-bp-concentric-inner-color', '#ffffff');
        const curRingInset = parseFloat(readDomVal('magnates-bp-concentric-inset', '14'));
        const curCardGlow = parseFloat(readDomVal('magnates-bp-concentric-glow', '65'));
        const curLeftVeil = parseFloat(readDomVal('magnates-bp-prod1-veil', '25'));
        const curRightVeil = parseFloat(readDomVal('magnates-bp-prod2-veil', '25'));

        const contentCard = document.createElement('div');
        contentCard.className = 'rg-inspector-section';
        contentCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">${meta.title}</span>
            <span class="rg-section-subtitle">Edit product price callouts and cutout layers.</span>
          </div>
          <div class="rg-field-row-2">
            <div class="rg-field-group">
              <label class="rg-field-label">Left Product Price</label>
              <input type="text" class="rg-input" data-dom-target="magnates-bp-input-prod1-price" data-bind="prod1Price" value="${curProd1.replace(/"/g, '&quot;')}">
            </div>
            <div class="rg-field-group">
              <label class="rg-field-label">Right Product Price</label>
              <input type="text" class="rg-input" data-dom-target="magnates-bp-input-prod2-price" data-bind="prod2Price" value="${curProd2.replace(/"/g, '&quot;')}">
            </div>
          </div>
          <div class="rg-media-asset-row is-selectable" data-select-stage-layer="prod1">
            <div class="rg-media-asset-info">
              <div class="rg-media-asset-icon">${LUCIDE_ICONS.imageIcon}</div>
              <div class="rg-media-asset-meta">
                <span class="rg-media-asset-name">Left Product Cutout</span>
                <span class="rg-media-asset-sub">Unfurling card subject 1</span>
              </div>
            </div>
            <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-prod1-img">
              ${LUCIDE_ICONS.imageIcon}
              <span>Replace</span>
            </button>
          </div>
          <div class="rg-media-asset-row is-selectable" data-select-stage-layer="prod2">
            <div class="rg-media-asset-info">
              <div class="rg-media-asset-icon">${LUCIDE_ICONS.imageIcon}</div>
              <div class="rg-media-asset-meta">
                <span class="rg-media-asset-name">Right Product Cutout</span>
                <span class="rg-media-asset-sub">Unfurling card subject 2</span>
              </div>
            </div>
            <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-prod2-img">
              ${LUCIDE_ICONS.imageIcon}
              <span>Replace</span>
            </button>
          </div>
        `;
        panes.content.appendChild(contentCard);
        panes.content.appendChild(createFallbackQuickStyleCard());

        const motionCard = document.createElement('div');
        motionCard.className = 'rg-inspector-section';
        motionCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Unfurl & Split Choreography</span>
            <span class="rg-section-subtitle">Adjust card unfurl velocity and emblem split timing.</span>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Product Unfurl Speed</span>
              <span class="rg-slider-val" data-val="prodUnfurlSpd">${curUnfurlSpd.toFixed(1)}x</span>
            </div>
            <input type="range" class="rg-range" min="0.4" max="2.5" step="0.1" value="${curUnfurlSpd}" data-dom-target="magnates-bp-prod-unfurl-speed" data-slider="prodUnfurlSpd" data-unit="x">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Logo Shift Right Time</span>
              <span class="rg-slider-val" data-val="prodLogoShift">${curLogoShift.toFixed(2)}s</span>
            </div>
            <input type="range" class="rg-range" min="0.5" max="4.0" step="0.05" value="${curLogoShift}" data-dom-target="magnates-bp-logo-shift-time" data-slider="prodLogoShift" data-unit="s">
          </div>
        `;
        panes.motion.appendChild(motionCard);

        const ringLookCard = document.createElement('div');
        ringLookCard.className = 'rg-inspector-section';
        ringLookCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Concentric Frame Rings</span>
            <span class="rg-section-subtitle">Customize outer and inner product ring borders.</span>
          </div>
          <div class="rg-toggle-row">
            <span class="rg-toggle-label">Outer Ring Border</span>
            <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-concentric-outer" ${curOuterRing ? 'checked' : ''}>
          </div>
          <div class="rg-color-row">
            <span class="rg-color-label">Outer Ring Color</span>
            <div class="rg-color-picker-wrap">
              <input type="color" class="rg-color-input" data-color-target="magnates-bp-concentric-outer-color" value="${curOuterColor}">
              <span class="rg-color-hex">${curOuterColor.toUpperCase()}</span>
            </div>
          </div>
          <div class="rg-toggle-row">
            <span class="rg-toggle-label">Inner Ring Border</span>
            <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-concentric-inner" ${curInnerRing ? 'checked' : ''}>
          </div>
          <div class="rg-color-row">
            <span class="rg-color-label">Inner Ring Color</span>
            <div class="rg-color-picker-wrap">
              <input type="color" class="rg-color-input" data-color-target="magnates-bp-concentric-inner-color" value="${curInnerColor}">
              <span class="rg-color-hex">${curInnerColor.toUpperCase()}</span>
            </div>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Inner Ring Inset</span>
              <span class="rg-slider-val" data-val="ringInset">${curRingInset}px</span>
            </div>
            <input type="range" class="rg-range" min="4" max="32" step="1" value="${curRingInset}" data-dom-target="magnates-bp-concentric-inset" data-slider="ringInset" data-unit="px">
          </div>
        `;
        panes.look.appendChild(createLookPresetsCard(() => document.getElementById('magnates-bp-stage')));
        panes.look.appendChild(ringLookCard);
        panes.look.appendChild(createGlobalAtmosphereLookCard());

        const fxCard = document.createElement('div');
        fxCard.className = 'rg-inspector-section';
        fxCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Card Glow & Veil Contrast</span>
            <span class="rg-section-subtitle">Balance card bloom and dark veil overlays.</span>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Concentric Card Glow</span>
              <span class="rg-slider-val" data-val="concentricGlow">${curCardGlow}%</span>
            </div>
            <input type="range" class="rg-range" min="0" max="150" step="5" value="${curCardGlow}" data-dom-target="magnates-bp-concentric-glow" data-slider="concentricGlow" data-unit="%">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Left Card Dark Veil</span>
              <span class="rg-slider-val" data-val="prod1Veil">${curLeftVeil}%</span>
            </div>
            <input type="range" class="rg-range" min="0" max="85" step="5" value="${curLeftVeil}" data-dom-target="magnates-bp-prod1-veil" data-slider="prod1Veil" data-unit="%">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Right Card Dark Veil</span>
              <span class="rg-slider-val" data-val="prod2Veil">${curRightVeil}%</span>
            </div>
            <input type="range" class="rg-range" min="0" max="85" step="5" value="${curRightVeil}" data-dom-target="magnates-bp-prod2-veil" data-slider="prod2Veil" data-unit="%">
          </div>
        `;
        panes.effects.appendChild(fxCard);

      } else if (sceneKey === 'globe_wavy_nothing') {
        const curGlobeText = readDomVal('magnates-bp-input-globe-text', 'FOR ALMOST NOTHING.');
        const curGlobeToggle = readDomChecked('magnates-bp-toggle-globe', true);
        const curSpinSpeed = parseFloat(readDomVal('magnates-bp-globe-spin-speed', '1.0'));
        const curSpinDir = readDomVal('magnates-bp-globe-spin-dir', 'ccw');

        const contentCard = document.createElement('div');
        contentCard.className = 'rg-inspector-section';
        contentCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">${meta.title}</span>
            <span class="rg-section-subtitle">Edit the 3D wireframe globe headline and visibility.</span>
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Globe Wavy Headline</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-globe-text" data-bind="globeText" value="${curGlobeText.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-toggle-row">
            <span class="rg-toggle-label">Show 3D Wireframe Globe</span>
            <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-globe" ${curGlobeToggle ? 'checked' : ''}>
          </div>
        `;
        panes.content.appendChild(contentCard);
        panes.content.appendChild(createFallbackQuickStyleCard());

        const motionCard = document.createElement('div');
        motionCard.className = 'rg-inspector-section';
        motionCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">3D Globe Rotation</span>
            <span class="rg-section-subtitle">Control orbital spin velocity and direction.</span>
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Orbital Spin Direction</label>
            <select class="rg-input" data-select-target="magnates-bp-globe-spin-dir">
              <option value="ccw" ${curSpinDir === 'ccw' ? 'selected' : ''}>Counter-Clockwise (Eastward)</option>
              <option value="cw" ${curSpinDir === 'cw' ? 'selected' : ''}>Clockwise (Westward)</option>
            </select>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Globe Spin Velocity</span>
              <span class="rg-slider-val" data-val="globeSpinSpeed">${curSpinSpeed.toFixed(1)}x</span>
            </div>
            <input type="range" class="rg-range" min="0.2" max="3.0" step="0.1" value="${curSpinSpeed}" data-dom-target="magnates-bp-globe-spin-speed" data-slider="globeSpinSpeed" data-unit="x">
          </div>
        `;
        panes.motion.appendChild(motionCard);
        panes.look.appendChild(createLookPresetsCard(() => document.getElementById('magnates-bp-stage')));
        panes.look.appendChild(createGlobalAtmosphereLookCard());

      } else if (sceneKey === 'dual_silhouette') {
        const curCounterText = readDomVal('magnates-bp-input-counter-text', '$1,000,000');
        const curCounterSub = readDomVal('magnates-bp-input-counter-sub', 'REWARD FOR INFORMATION');
        const curCounterToggle = readDomChecked('magnates-bp-toggle-counter', true);
        const curLeftIn = readDomVal('magnates-bp-sil-left-in', 'slide_left');
        const curLeftOut = readDomVal('magnates-bp-sil-left-out', 'dissolve');
        const curRightIn = readDomVal('magnates-bp-sil-right-in', 'slide_right');
        const curRightOut = readDomVal('magnates-bp-sil-right-out', 'dissolve');
        const curSilGlowColor = readDomVal('magnates-bp-sil-glow-color', '#38bdf8');
        const curSilGlowInt = parseFloat(readDomVal('magnates-bp-sil-glow-intensity', '95'));

        const contentCard = document.createElement('div');
        contentCard.className = 'rg-inspector-section';
        contentCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">${meta.title}</span>
            <span class="rg-section-subtitle">Configure the $1M counter and dual subject silhouettes.</span>
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Counter Headline</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-counter-text" data-bind="counterText" value="${curCounterText.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Sub-Caption Callout</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-counter-sub" data-bind="counterSub" value="${curCounterSub.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-toggle-row">
            <span class="rg-toggle-label">Show Center Counter Overlay</span>
            <input type="checkbox" class="rg-toggle-switch" data-check-target="magnates-bp-toggle-counter" ${curCounterToggle ? 'checked' : ''}>
          </div>
          <div class="rg-media-asset-row is-selectable" data-select-stage-layer="sil_left">
            <div class="rg-media-asset-info">
              <div class="rg-media-asset-icon">${LUCIDE_ICONS.imageIcon}</div>
              <div class="rg-media-asset-meta">
                <span class="rg-media-asset-name">Left Silhouette Cutout</span>
                <span class="rg-media-asset-sub">Primary foreground figure</span>
              </div>
            </div>
            <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-sil-left">
              ${LUCIDE_ICONS.imageIcon}
              <span>Replace</span>
            </button>
          </div>
          <div class="rg-media-asset-row is-selectable" data-select-stage-layer="sil_right">
            <div class="rg-media-asset-info">
              <div class="rg-media-asset-icon">${LUCIDE_ICONS.imageIcon}</div>
              <div class="rg-media-asset-meta">
                <span class="rg-media-asset-name">Right Silhouette Cutout</span>
                <span class="rg-media-asset-sub">Secondary foreground figure</span>
              </div>
            </div>
            <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-sil-right">
              ${LUCIDE_ICONS.imageIcon}
              <span>Replace</span>
            </button>
          </div>
        `;
        panes.content.appendChild(contentCard);

        const motionCard = document.createElement('div');
        motionCard.className = 'rg-inspector-section';
        motionCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Silhouette Entrance & Exit</span>
            <span class="rg-section-subtitle">Choreograph left and right figure transitions.</span>
          </div>
          <div class="rg-field-row-2">
            <div class="rg-field-group">
              <label class="rg-field-label">Left Entrance</label>
              <select class="rg-input" data-select-target="magnates-bp-sil-left-in">
                <option value="slide_left" ${curLeftIn === 'slide_left' ? 'selected' : ''}>Slide Left</option>
                <option value="rise_up" ${curLeftIn === 'rise_up' ? 'selected' : ''}>Rise Up</option>
                <option value="zoom_in" ${curLeftIn === 'zoom_in' ? 'selected' : ''}>Zoom In</option>
              </select>
            </div>
            <div class="rg-field-group">
              <label class="rg-field-label">Left Exit</label>
              <select class="rg-input" data-select-target="magnates-bp-sil-left-out">
                <option value="dissolve" ${curLeftOut === 'dissolve' ? 'selected' : ''}>Dissolve</option>
                <option value="drop_down" ${curLeftOut === 'drop_down' ? 'selected' : ''}>Drop Down</option>
              </select>
            </div>
          </div>
          <div class="rg-field-row-2">
            <div class="rg-field-group">
              <label class="rg-field-label">Right Entrance</label>
              <select class="rg-input" data-select-target="magnates-bp-sil-right-in">
                <option value="slide_right" ${curRightIn === 'slide_right' ? 'selected' : ''}>Slide Right</option>
                <option value="rise_up" ${curRightIn === 'rise_up' ? 'selected' : ''}>Rise Up</option>
                <option value="zoom_in" ${curRightIn === 'zoom_in' ? 'selected' : ''}>Zoom In</option>
              </select>
            </div>
            <div class="rg-field-group">
              <label class="rg-field-label">Right Exit</label>
              <select class="rg-input" data-select-target="magnates-bp-sil-right-out">
                <option value="dissolve" ${curRightOut === 'dissolve' ? 'selected' : ''}>Dissolve</option>
                <option value="drop_down" ${curRightOut === 'drop_down' ? 'selected' : ''}>Drop Down</option>
              </select>
            </div>
          </div>
        `;
        panes.motion.appendChild(motionCard);
        panes.look.appendChild(createLookPresetsCard(() => document.getElementById('magnates-bp-stage')));
        panes.look.appendChild(createGlobalAtmosphereLookCard());

        const fxCard = document.createElement('div');
        fxCard.className = 'rg-inspector-section';
        fxCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Silhouette Rim Backlight</span>
            <span class="rg-section-subtitle">Control neon rim glow around both silhouettes.</span>
          </div>
          <div class="rg-color-row">
            <span class="rg-color-label">Rim Glow Color</span>
            <div class="rg-color-picker-wrap">
              <input type="color" class="rg-color-input" data-color-target="magnates-bp-sil-glow-color" value="${curSilGlowColor}">
              <span class="rg-color-hex">${curSilGlowColor.toUpperCase()}</span>
            </div>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Rim Glow Intensity</span>
              <span class="rg-slider-val" data-val="silGlowInt">${curSilGlowInt}%</span>
            </div>
            <input type="range" class="rg-range" min="0" max="150" step="5" value="${curSilGlowInt}" data-dom-target="magnates-bp-sil-glow-intensity" data-slider="silGlowInt" data-unit="%">
          </div>
        `;
        panes.effects.appendChild(fxCard);

      } else {
        // Scene 5: article_capitol_zoom / room_spawn
        const curKicker = readDomVal('magnates-bp-input-article-kicker', 'TECH & ECONOMY // INVESTIGATIVE REPORT');
        const curLine1 = readDomVal('magnates-bp-input-article-line1', 'Temu Emerges as the Biggest');
        const curLine2 = readDomVal('magnates-bp-input-article-line2', 'Shopping App in the U.S.');
        const curBody1 = readDomVal('magnates-bp-input-article-body1', 'In a matter of months, the ultra-low-cost marketplace surged past retail giants.');
        const curMarkerColor = readDomVal('magnates-bp-article-marker-color', '#fde047');
        const curSweepSpeed = parseFloat(readDomVal('magnates-bp-article-sweep-speed', '1.0'));
        const curTrackbackDur = parseFloat(readDomVal('magnates-bp-room-trackback-dur', '1.80'));

        const contentCard = document.createElement('div');
        contentCard.className = 'rg-inspector-section';
        contentCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">${meta.title}</span>
            <span class="rg-section-subtitle">Edit the investigative article card and 3D environment layers.</span>
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Section Kicker</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-article-kicker" data-bind="articleKicker" value="${curKicker.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Headline Line 1</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-article-line1" data-bind="articleLine1" value="${curLine1.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Highlighted Line 2</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-article-line2" data-bind="articleLine2" value="${curLine2.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-field-group">
            <label class="rg-field-label">Lead Paragraph</label>
            <input type="text" class="rg-input" data-dom-target="magnates-bp-input-article-body1" data-bind="articleBody1" value="${curBody1.replace(/"/g, '&quot;')}">
          </div>
          <div class="rg-media-asset-row is-selectable" data-select-stage-layer="article">
            <div class="rg-media-asset-info">
              <div class="rg-media-asset-icon">${LUCIDE_ICONS.imageIcon}</div>
              <div class="rg-media-asset-meta">
                <span class="rg-media-asset-name">Article Screenshot Card</span>
                <span class="rg-media-asset-sub">Upload custom press clipping</span>
              </div>
            </div>
            <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-article-img">
              ${LUCIDE_ICONS.imageIcon}
              <span>Replace</span>
            </button>
          </div>
          <div class="rg-media-asset-row is-selectable" data-select-stage-layer="capitol">
            <div class="rg-media-asset-info">
              <div class="rg-media-asset-icon">${LUCIDE_ICONS.cube3d}</div>
              <div class="rg-media-asset-meta">
                <span class="rg-media-asset-name">Capitol Building Cutout</span>
                <span class="rg-media-asset-sub">Foreground architectural layer</span>
              </div>
            </div>
            <button type="button" class="rg-asset-replace-btn" data-file-trigger="magnates-bp-input-capitol-img">
              ${LUCIDE_ICONS.imageIcon}
              <span>Replace</span>
            </button>
          </div>
        `;
        panes.content.appendChild(contentCard);

        const motionCard = document.createElement('div');
        motionCard.className = 'rg-inspector-section';
        motionCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Highlight Sweep & Camera Pullback</span>
            <span class="rg-section-subtitle">Control marker sweep speed and 3D room trackback.</span>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Highlight Sweep Speed</span>
              <span class="rg-slider-val" data-val="articleSweepSpeed">${curSweepSpeed.toFixed(1)}x</span>
            </div>
            <input type="range" class="rg-range" min="0.4" max="2.5" step="0.1" value="${curSweepSpeed}" data-dom-target="magnates-bp-article-sweep-speed" data-slider="articleSweepSpeed" data-unit="x">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>3D Room Trackback Duration</span>
              <span class="rg-slider-val" data-val="roomTrackbackDur">${curTrackbackDur.toFixed(2)}s</span>
            </div>
            <input type="range" class="rg-range" min="0.8" max="3.5" step="0.05" value="${curTrackbackDur}" data-dom-target="magnates-bp-room-trackback-dur" data-slider="roomTrackbackDur" data-unit="s">
          </div>
        `;
        panes.motion.appendChild(motionCard);

        const markerLookCard = document.createElement('div');
        markerLookCard.className = 'rg-inspector-section';
        markerLookCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Editorial Marker & Strip</span>
            <span class="rg-section-subtitle">Customize highlighter ink color and opacity.</span>
          </div>
          <div class="rg-color-row">
            <span class="rg-color-label">Highlighter Marker Ink</span>
            <div class="rg-color-picker-wrap">
              <input type="color" class="rg-color-input" data-color-target="magnates-bp-article-marker-color" value="${curMarkerColor}">
              <span class="rg-color-hex">${curMarkerColor.toUpperCase()}</span>
            </div>
          </div>
        `;
        panes.look.appendChild(createLookPresetsCard(() => document.getElementById('magnates-bp-stage')));
        panes.look.appendChild(markerLookCard);
        panes.look.appendChild(createGlobalAtmosphereLookCard());
      }

      // Always ensure Effects tab has Optical & Atmosphere card if not already populated
      if (panes.effects.children.length === 0) {
        const curGlowVal = parseFloat(readDomVal('magnates-bp-logo-glow-intensity', '90'));
        const fxCard = document.createElement('div');
        fxCard.className = 'rg-inspector-section';
        fxCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Optical & Atmosphere</span>
            <span class="rg-section-subtitle">Fine-tune rim glow and vignette falloff.</span>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Rim Glow Intensity</span>
              <span class="rg-slider-val" data-val="glow_${sceneKey}">${curGlowVal}%</span>
            </div>
            <input type="range" class="rg-range" min="0" max="100" value="${curGlowVal}" data-dom-target="magnates-bp-logo-glow-intensity" data-slider="glow_${sceneKey}" data-unit="%">
          </div>
        `;
        panes.effects.appendChild(fxCard);
      }

      // Scene-scoped Advanced Controls for Scenes 1–5
      if (advDrawer) {
        const curLineGap = parseFloat(readDomVal('magnates-bp-wavy-line-gap', '16'));
        const curRevealSpeed = parseFloat(readDomVal('magnates-bp-wavy-reveal-speed', '1.0'));

        const sceneAdvCard = document.createElement('div');
        sceneAdvCard.className = 'rg-inspector-section';
        sceneAdvCard.innerHTML = `
          <div class="rg-section-header">
            <span class="rg-section-title">Scene Timing & Spatial Calibration</span>
            <span class="rg-section-subtitle">Precision controls for ${meta.title}.</span>
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Backdrop Darkness</span>
              <span class="rg-slider-val" data-val="bgDark_${sceneKey}">${curBgDarkGlobal}%</span>
            </div>
            <input type="range" class="rg-range" min="20" max="100" step="2" value="${curBgDarkGlobal}" data-dom-target="magnates-bp-bg-darkness" data-slider="bgDark_${sceneKey}" data-unit="%">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Typography Line Spacing</span>
              <span class="rg-slider-val" data-val="lineGap_${sceneKey}">${curLineGap}px</span>
            </div>
            <input type="range" class="rg-range" min="4" max="42" step="2" value="${curLineGap}" data-dom-target="magnates-bp-wavy-line-gap" data-slider="lineGap_${sceneKey}" data-unit="px">
          </div>
          <div class="rg-slider-row">
            <div class="rg-slider-header">
              <span>Reveal Pacing</span>
              <span class="rg-slider-val" data-val="revealSpd_${sceneKey}">${curRevealSpeed.toFixed(1)}x</span>
            </div>
            <input type="range" class="rg-range" min="0.4" max="2.2" step="0.1" value="${curRevealSpeed}" data-dom-target="magnates-bp-wavy-reveal-speed" data-slider="revealSpd_${sceneKey}" data-unit="x">
          </div>
        `;
        advDrawer.appendChild(sceneAdvCard);
      }
    }

    // Wire inputs, sliders, color pickers, checkboxes, selects, action buttons, shape builders, and stage layer selection across all 4 panes + Advanced Controls drawer
    const allContainers = [...Object.values(panes), advDrawer].filter(Boolean);
    allContainers.forEach((container) => {
      container.querySelectorAll('input[data-bind]').forEach((inp) => {
        inp.addEventListener('input', () => {
          const key = inp.getAttribute('data-bind');
          const domTargetId = inp.getAttribute('data-dom-target');
          p[key] = inp.value;
          if (domTargetId) {
            writeDomVal(domTargetId, inp.value);
          }
          triggerBlueprintRender();
        });
      });

      container.querySelectorAll('input[data-slider]').forEach((rng) => {
        rng.addEventListener('input', () => {
          const key = rng.getAttribute('data-slider');
          const unit = rng.getAttribute('data-unit') || '';
          const domTargetId = rng.getAttribute('data-dom-target');
          p[key] = parseFloat(rng.value);
          const valSpan = container.querySelector(`[data-val="${key}"]`);
          if (valSpan) valSpan.textContent = rng.value + unit;
          if (domTargetId) {
            writeDomVal(domTargetId, rng.value);
          }
          triggerBlueprintRender();
        });
      });

      container.querySelectorAll('input[data-color-target]').forEach((colInput) => {
        colInput.addEventListener('input', () => {
          const targetId = colInput.getAttribute('data-color-target');
          const hexEl = colInput.parentElement && colInput.parentElement.querySelector('.rg-color-hex');
          if (hexEl) hexEl.textContent = (colInput.value || '').toUpperCase();
          if (targetId) writeDomVal(targetId, colInput.value);
          triggerBlueprintRender();
        });
      });

      container.querySelectorAll('[data-swatch-color]').forEach((swatchBtn) => {
        swatchBtn.addEventListener('click', () => {
          const hex = swatchBtn.getAttribute('data-swatch-color');
          const targetId = swatchBtn.getAttribute('data-swatch-target');
          if (hex && targetId) {
            writeDomVal(targetId, hex);
            const colInp = container.querySelector(`input[data-color-target="${targetId}"]`);
            if (colInp) {
              colInp.value = hex;
              const hexSpan = colInp.parentElement && colInp.parentElement.querySelector('.rg-color-hex');
              if (hexSpan) hexSpan.textContent = hex.toUpperCase();
            }
            triggerBlueprintRender();
          }
        });
      });

      container.querySelectorAll('input[data-check-target]').forEach((chk) => {
        chk.addEventListener('change', () => {
          const targetId = chk.getAttribute('data-check-target');
          if (targetId) writeDomChecked(targetId, chk.checked);
          triggerBlueprintRender();
        });
      });

      container.querySelectorAll('select[data-select-target]').forEach((sel) => {
        sel.addEventListener('change', () => {
          const targetId = sel.getAttribute('data-select-target');
          if (targetId) writeDomVal(targetId, sel.value);
          triggerBlueprintRender();
        });
      });

      container.querySelectorAll('[data-btn-target]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-btn-target');
          const origBtn = targetId ? document.getElementById(targetId) : null;
          if (origBtn) origBtn.click();
        });
      });

      container.querySelectorAll('[data-add-shape]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const shapeType = btn.getAttribute('data-add-shape');
          if (typeof window.addMagnatesBPCustomShape === 'function') {
            window.addMagnatesBPCustomShape(shapeType);
          }
        });
      });

      container.querySelectorAll('[data-shape-clear]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (typeof window.clearMagnatesBPCustomShapes === 'function') {
            window.clearMagnatesBPCustomShapes();
          }
        });
      });

      container.querySelectorAll('[data-select-stage-layer]').forEach((row) => {
        row.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          const layerKey = row.getAttribute('data-select-stage-layer');
          if (layerKey && typeof window.selectMagnatesBPLayer === 'function') {
            window.selectMagnatesBPLayer(layerKey);
          }
        });
      });

      container.querySelectorAll('[data-file-trigger]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetId = btn.getAttribute('data-file-trigger');
          const fileInput = targetId ? document.getElementById(targetId) : null;
          if (fileInput) {
            fileInput.click();
          }
        });
      });
    });
  }

  let syncBlueprintSceneUIRef = null;

  function mountMagnatesBlueprintRedesign() {
    const modal = document.getElementById('modal-magnates-paper-blueprint-suite');
    const modalBox = document.getElementById('magnates-bp-modal-box');
    const previewCol = document.getElementById('magnates-bp-preview-col');
    const canvasBox = document.getElementById('magnates-bp-canvas-box');
    const stage = document.getElementById('magnates-bp-stage');
    const inspectorCol = document.getElementById('magnates-bp-inspector-col');
    if (!modal || !modalBox || !canvasBox || !stage || !inspectorCol) return;
    if (modalBox.dataset.rgMounted === '1') return;
    modalBox.dataset.rgMounted = '1';

    // Hide the legacy header bar (first child of modalBox)
    const legacyHeader = modalBox.children[0];
    if (legacyHeader) legacyHeader.classList.add('rg-legacy-header-hidden');

    // Hide all legacy playback rows/pills beneath #magnates-bp-stage inside #magnates-bp-canvas-box (keep ONLY the hover HUD)
    Array.from(canvasBox.children).forEach((child) => {
      if (child !== stage) {
        child.classList.add('rg-legacy-playback-hidden');
      }
    });

    // CRITICAL FIX: workspaceRow is the parent of #magnates-bp-preview-col AND #magnates-bp-inspector-col
    const workspaceRow = previewCol ? previewCol.parentElement : canvasBox.parentElement;
    if (workspaceRow) workspaceRow.classList.add('rg-workspace-split');
    if (previewCol) previewCol.classList.add('rg-center-column');

    const closeSuite = () => {
      if (window.RegaarderContextualToolbar) window.RegaarderContextualToolbar.hide();
      if (typeof window.deselectMagnatesBPLayer === 'function') window.deselectMagnatesBPLayer();
      const closeBtn = document.getElementById('btn-close-magnates-bp-suite');
      if (closeBtn) closeBtn.click();
      else modal.style.display = 'none';
    };

    const applySuite = () => {
      const applyBtn = document.getElementById('btn-apply-magnates-bp-suite');
      if (applyBtn) applyBtn.click();
    };

    const getActiveSceneKey = () => {
      const presetSelect = document.getElementById('magnates-bp-select-preset');
      if (presetSelect && presetSelect.value && BLUEPRINT_SCENE_META[presetSelect.value] && presetSelect.value !== 'full_story_flow') {
        return presetSelect.value;
      }
      const activePill = document.querySelector('.btn-bp-scene-pill.active');
      if (activePill) {
        const pKey = activePill.getAttribute('data-preset') || activePill.getAttribute('data-scene');
        if (pKey && BLUEPRINT_SCENE_META[pKey] && pKey !== 'full_story_flow') return pKey;
      }
      return 'printer_glitch_card';
    };

    const switchScene = (sceneKey) => {
      const card = document.querySelector(`.bp-storyboard-scene-card[data-scene-card="${sceneKey}"]`);
      const pill = document.querySelector(`.btn-bp-scene-pill[data-preset="${sceneKey}"], .btn-bp-scene-pill[data-scene="${sceneKey}"]`);
      if (card) card.click();
      else if (pill) pill.click();
      syncBlueprintSceneUI(sceneKey);
    };

    const BP_PRESET_TO_TPL_ID = {
      printer_glitch_card: 'magnates-media-printer-glitch-card',
      full_story_flow: 'magnates-media-paper-blueprint',
      brand_wavy_intro: 'magnates-media-brand-wavy-hook',
      products_unfurl: 'magnates-media-product-price-unfurl',
      globe_wavy_nothing: 'magnates-media-globe-wavy-nothing',
      dual_silhouette: 'magnates-media-dual-silhouettes',
      article_capitol_zoom: 'magnates-media-article-capitol-zoom',
      room_spawn: 'magnates-media-article-capitol-zoom'
    };

    const BP_TPL_ID_TO_PRESET = {
      'magnates-media-printer-glitch-card': 'printer_glitch_card',
      'magnates-media-paper-blueprint': 'full_story_flow',
      'magnates-media-brand-wavy-hook': 'brand_wavy_intro',
      'magnates-media-product-price-unfurl': 'products_unfurl',
      'magnates-media-globe-wavy-nothing': 'globe_wavy_nothing',
      'magnates-media-dual-silhouettes': 'dual_silhouette',
      'magnates-media-article-capitol-zoom': 'article_capitol_zoom'
    };

    const CURATED_TEMPLATE_CARD_META = {
      'adidas-puma-cosmic-earth-suite': {
        shortTitle: 'Cosmic Rift & Spinning Earth',
        shortSub: 'Dual Logos • Light Rift • Earth Dive',
        cat: 'Cinematic',
        thumb: '/assets/aistudio/image_be30fa77.png',
        priority: 0
      },
      'tencent-shadow-giant-multimedia': {
        shortTitle: '5-Scene Cutout & Glitch Suite',
        shortSub: 'Cutouts • Parallax • Brush FX',
        cat: 'Cinematic',
        thumb: '/assets/aistudio/frame_000193_14065c7b.jpg',
        priority: 0
      },
      'magnates-media-printer-glitch-card': {
        shortTitle: 'Cinematic White Glitch',
        shortSub: 'Floating Card Reveal',
        cat: 'Product',
        thumb: '/jani_cinematic_letterbox_ref.png',
        priority: 1
      },
      'jani-spin-flash-glitch-reveal': {
        shortTitle: 'Circular Spin',
        shortSub: 'Falling Particles',
        cat: 'Motion',
        thumb: '/interview_cutin_cinematic.jpg',
        priority: 2
      },
      'jani-flash-quad-sequence': {
        shortTitle: '4-Beat Flash',
        shortSub: 'Directional Slide',
        cat: 'Cinematic',
        thumb: '/assets/aistudio/image_463745bd.png',
        priority: 3
      },
      'magnates-media-globe-wavy-nothing': {
        shortTitle: 'Spinning Earth',
        shortSub: 'Globe Reveal',
        cat: 'Cinematic',
        thumb: '/globe_atlantic_clean.svg',
        priority: 4
      },
      'jani-cinematic-letterbox': {
        shortTitle: 'Cinematic Letterbox',
        shortSub: 'Lower Caption Frame',
        cat: 'Cinematic',
        thumb: '/jani_cinematic_letterbox_ref.png',
        priority: 5
      },
      'magnates-media-product-price-unfurl': {
        shortTitle: 'Product Unfurl',
        shortSub: 'Price Tag Reveal',
        cat: 'Product',
        thumb: '/printer_card_thumb.png',
        priority: 6
      },
      'magnates-media-brand-wavy-hook': {
        shortTitle: 'Brand Wavy Hook',
        shortSub: 'Logo & Grid Intro',
        cat: 'Motion',
        thumb: '/temu_logo_cutout.png',
        priority: 7
      },
      'magnates-media-dual-silhouettes': {
        shortTitle: 'Dual Silhouettes',
        shortSub: 'Split Character Reveal',
        cat: 'Cinematic',
        thumb: '/silhouettes_reference.png',
        priority: 8
      },
      'magnates-media-article-capitol-zoom': {
        shortTitle: 'Article Callout',
        shortSub: '3D Pedestal Zoom',
        cat: 'Text',
        thumb: '/forbes_article_reference.png',
        priority: 9
      },
      'magnates-media-paper-blueprint': {
        shortTitle: '6-Scene Storyboard',
        shortSub: 'Full Documentary Flow',
        cat: 'Cinematic',
        thumb: '/magnates_paper_blueprint_thumbnail.svg',
        priority: 10
      }
    };

    function getCleanTemplateCardMeta(t) {
      if (!t) return { shortTitle: 'Studio Template', shortSub: 'Motion Scene', cat: 'Cinematic', priority: 999 };
      if (CURATED_TEMPLATE_CARD_META[t.id]) {
        return CURATED_TEMPLATE_CARD_META[t.id];
      }
      let rawTitle = (t.title || 'Studio Scene').split('(')[0].trim();
      rawTitle = rawTitle
        .replace(/^(James Jani|Magnates Media|Alex Hormozi|Vox Style|Johnny Harris|Iman Gadzhi|Ali Abdaal|MrBeast)\s+/i, '')
        .trim();

      let shortTitle = rawTitle;
      let shortSub = '';

      if (rawTitle.includes('&')) {
        const parts = rawTitle.split('&');
        shortTitle = parts[0].trim();
        shortSub = parts.slice(1).join('&').trim();
      } else if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        shortTitle = parts[0].trim();
        shortSub = parts.slice(1).join(' ').trim();
      } else {
        const words = rawTitle.split(/\s+/);
        if (words.length > 3) {
          shortTitle = words.slice(0, 3).join(' ');
          shortSub = words.slice(3, 6).join(' ');
        }
      }

      if (!shortSub) {
        if (t.badge) {
          shortSub = String(t.badge).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        } else if (t.category) {
          shortSub = `${t.category} Preset`;
        } else {
          shortSub = 'Motion Preset';
        }
      }

      const hay = `${t.title || ''} ${t.description || ''} ${t.category || ''} ${(t.tags || []).join(' ')}`.toLowerCase();
      let cat = 'Cinematic';
      if (hay.includes('product') || hay.includes('price') || hay.includes('card') || hay.includes('printer') || hay.includes('commerce')) {
        cat = 'Product';
      } else if (hay.includes('text') || hay.includes('caption') || hay.includes('quote') || hay.includes('title') || hay.includes('article') || hay.includes('kinetic')) {
        cat = 'Text';
      } else if (hay.includes('spin') || hay.includes('motion') || hay.includes('zoom') || hay.includes('transition') || hay.includes('wavy') || hay.includes('swipe')) {
        cat = 'Motion';
      }

      return {
        shortTitle,
        shortSub,
        cat,
        priority: 100
      };
    }

    function renderUnifiedTemplatesLibraryDrawer(drawerEl, opts) {
      if (!drawerEl) return;
      const options = opts || {};

      if (typeof EFFECT_TEMPLATES_DATA !== 'undefined' && Array.isArray(EFFECT_TEMPLATES_DATA)) {
        if (!EFFECT_TEMPLATES_DATA.some((t) => t.id === 'jani-cinematic-letterbox')) {
          EFFECT_TEMPLATES_DATA.unshift({
            id: 'jani-cinematic-letterbox',
            title: 'James Jani Cinematic Letterbox & Lower Caption Frame',
            category: 'Documentary',
            badge: 'JANI CINEMATIC',
            description: 'Centered photo or video framing with customizable letterbox matte bars and lower caption.',
            defaultImage: '/jani_cinematic_letterbox_ref.png',
            timeToApply: '6s',
            tags: ['james jani', 'letterbox', 'caption', 'cinematic']
          });
        }
      }

      if (!drawerEl.dataset.rgUpgradedV2) {
        drawerEl.dataset.rgUpgradedV2 = '1';
        drawerEl.dataset.activeCat = 'All';
        drawerEl.innerHTML = `
          <div class="rg-tpl-lib-header">
            <div class="rg-tpl-lib-header-left">
              <span class="rg-tpl-lib-icon">${LUCIDE_ICONS.templatesTop}</span>
              <span class="rg-tpl-lib-title-text">Templates Library</span>
            </div>
            <button type="button" class="rg-tpl-lib-close" data-role="tpl-lib-close" title="Close templates library">&#x2715;</button>
          </div>
          <div class="rg-tpl-lib-search-row">
            <div class="rg-tpl-lib-search-wrap">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" class="rg-tpl-lib-search-input" data-role="tpl-lib-search" placeholder="Search templates..." />
            </div>
            <button type="button" class="rg-tpl-lib-filter-btn" data-role="tpl-lib-filter-toggle" title="Filter templates by category">
              ${LUCIDE_ICONS.sliders}
            </button>
          </div>
          <div class="rg-tpl-lib-cats" data-role="tpl-lib-cats">
            ${['All', 'Product', 'Cinematic', 'Text', 'Motion'].map((c) => `
              <button type="button" class="rg-tpl-lib-cat-pill ${c === 'All' ? 'is-active' : ''}" data-cat="${c}">${c}</button>
            `).join('')}
          </div>
          <div class="rg-tpl-lib-grid" data-role="tpl-lib-grid"></div>
        `;

        const closeBtn = drawerEl.querySelector('[data-role="tpl-lib-close"]');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            drawerEl.style.display = 'none';
          });
        }

        const filterToggleBtn = drawerEl.querySelector('[data-role="tpl-lib-filter-toggle"]');
        const catsRow = drawerEl.querySelector('[data-role="tpl-lib-cats"]');
        if (filterToggleBtn && catsRow) {
          filterToggleBtn.addEventListener('click', () => {
            filterToggleBtn.classList.toggle('is-active');
            const searchInput = drawerEl.querySelector('[data-role="tpl-lib-search"]');
            if (searchInput) searchInput.focus();
          });
        }

        const applyFilters = () => {
          const searchInput = drawerEl.querySelector('[data-role="tpl-lib-search"]');
          const q = ((searchInput && searchInput.value) || '').toLowerCase().trim();
          const activeCat = drawerEl.dataset.activeCat || 'All';
          const gridEl = drawerEl.querySelector('[data-role="tpl-lib-grid"]');
          if (!gridEl) return;

          gridEl.querySelectorAll('.rg-tpl-lib-card').forEach((card) => {
            const cardCat = card.getAttribute('data-tpl-cat') || 'Cinematic';
            const hay = (card.getAttribute('data-tpl-search') || '').toLowerCase();
            const catMatch = (activeCat === 'All') || (cardCat.toLowerCase() === activeCat.toLowerCase());
            const qMatch = !q || hay.includes(q);
            card.style.display = (catMatch && qMatch) ? 'flex' : 'none';
          });
        };

        const searchInput = drawerEl.querySelector('[data-role="tpl-lib-search"]');
        if (searchInput) {
          searchInput.addEventListener('input', applyFilters);
        }

        drawerEl.querySelectorAll('.rg-tpl-lib-cat-pill').forEach((pill) => {
          pill.addEventListener('click', () => {
            const cat = pill.getAttribute('data-cat') || 'All';
            drawerEl.dataset.activeCat = cat;
            drawerEl.querySelectorAll('.rg-tpl-lib-cat-pill').forEach((p) => {
              p.classList.toggle('is-active', p === pill);
            });
            applyFilters();
          });
        });
      }

      const gridContainer = drawerEl.querySelector('[data-role="tpl-lib-grid"]');
      if (!gridContainer || typeof EFFECT_TEMPLATES_DATA === 'undefined') return;

      const currentTplId = typeof options.getActiveTemplateId === 'function'
        ? options.getActiveTemplateId()
        : (BP_PRESET_TO_TPL_ID[getActiveSceneKey()] || 'magnates-media-printer-glitch-card');

      const sortedTemplates = EFFECT_TEMPLATES_DATA
        .filter((t) => !t.hidden)
        .slice()
        .sort((a, b) => {
          const ma = getCleanTemplateCardMeta(a);
          const mb = getCleanTemplateCardMeta(b);
          return (ma.priority || 100) - (mb.priority || 100);
        });

      gridContainer.innerHTML = sortedTemplates.map((t) => {
        const isSelected = (t.id === currentTplId);
        const meta = getCleanTemplateCardMeta(t);
        const thumbSrc = meta.thumb || (typeof window.tplGetSnapshot === 'function' && window.tplGetSnapshot(t.id)) || t.defaultImage || '/jani_cinematic_letterbox_ref.png';
        const searchHaystack = `${meta.shortTitle} ${meta.shortSub} ${t.title || ''} ${t.description || ''} ${t.badge || ''} ${(t.tags || []).join(' ')}`.replace(/"/g, '&quot;');

        return `
          <div data-template-id="${t.id}"
               data-tpl-cat="${meta.cat}"
               data-tpl-search="${searchHaystack}"
               title="${meta.shortTitle} — ${meta.shortSub}"
               style="display:flex;flex-direction:column;height:146px;min-height:146px;max-height:146px;border-radius:12px;overflow:hidden;cursor:pointer;position:relative;box-sizing:border-box;"
               class="rg-tpl-lib-card ${isSelected ? 'is-selected active-tpl-card' : ''}">
            <div class="rg-tpl-lib-thumb" style="width:100%;height:92px;min-height:92px;max-height:92px;position:relative;background:#090910;overflow:hidden;flex-shrink:0;">
              <img id="bp-sidecard-thumb-${t.id}" src="${thumbSrc}" alt="${meta.shortTitle}" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.src='/jani_cinematic_letterbox_ref.png';" />
              <div id="bp-sidecard-fx-${t.id}" style="display: none; position: absolute; inset: 0; overflow: hidden; pointer-events: none;"></div>
              ${isSelected ? `<div class="rg-tpl-lib-check">\u2713</div>` : ''}
            </div>
            <div class="rg-tpl-lib-meta" style="height:51px;min-height:51px;padding:7px 9px 8px;display:flex;flex-direction:column;justify-content:center;gap:2px;min-width:0;box-sizing:border-box;">
              <span class="rg-tpl-lib-title">${meta.shortTitle}</span>
              <span class="rg-tpl-lib-sub">${meta.shortSub}</span>
            </div>
          </div>
        `;
      }).join('');

      gridContainer.querySelectorAll('.rg-tpl-lib-card').forEach((card) => {
        const tplId = card.getAttribute('data-template-id');
        const tpl = EFFECT_TEMPLATES_DATA.find((t) => t.id === tplId);
        if (tpl && typeof window.startSidebarTemplateHover === 'function' && typeof window.stopSidebarTemplateHover === 'function') {
          card.addEventListener('mouseenter', () => window.startSidebarTemplateHover(card, tpl));
          card.addEventListener('mouseleave', () => window.stopSidebarTemplateHover(card, tpl));
        }
        card.addEventListener('click', () => {
          drawerEl.style.display = 'none';
          if (typeof options.onSelectTemplate === 'function') {
            options.onSelectTemplate(tplId, tpl);
            return;
          }
          const mappedPreset = BP_TPL_ID_TO_PRESET[tplId];
          if (mappedPreset) {
            switchScene(mappedPreset);
          } else if (typeof window.modalSelectTemplateCard === 'function') {
            closeSuite();
            window.modalSelectTemplateCard(tplId);
          } else if (tpl && typeof window.openTopTemplateCustomizer === 'function') {
            closeSuite();
            window.openTopTemplateCustomizer(tpl);
          }
        });
      });

      bindStealthRedScrollbars();
    }

    function ensureVisualTemplatesLibraryDrawer() {
      const bpDrawer = document.getElementById('magnates-bp-tpl-drawer');
      if (!bpDrawer) return;
      renderUnifiedTemplatesLibraryDrawer(bpDrawer, {
        getActiveTemplateId: () => BP_PRESET_TO_TPL_ID[getActiveSceneKey()] || 'magnates-media-printer-glitch-card'
      });
    }

    // Expose shared builder so Universal 50+ Template Customizer (#modal-tpl-sidebar-drawer) uses the exact same 2-column Templates Library UI
    window.rgRenderUnifiedTemplatesLibrary = renderUnifiedTemplatesLibraryDrawer;

    const toggleBpTemplatesDrawer = () => {
      const bpDrawer = document.getElementById('magnates-bp-tpl-drawer');
      if (!bpDrawer) return;
      const isHidden = window.getComputedStyle(bpDrawer).display === 'none';
      if (isHidden) {
        ensureVisualTemplatesLibraryDrawer();
        bpDrawer.style.display = 'flex';
      } else {
        bpDrawer.style.display = 'none';
      }
    };

    const topbar = createGlobalTopbar({
      onClose: closeSuite,
      onOpenTemplates: toggleBpTemplatesDrawer,
      onExport: applySuite
    });

    const leftRail = createLeftNavRail({
      onClose: closeSuite,
      onSelectRail: (railId) => {
        const map = { assets: 'content', text: 'content', layers: 'content', studio: 'motion', effects: 'effects' };
        const targetTab = map[railId];
        if (targetTab) {
          const tabBtn = inspectorCol.querySelector(`.rg-inspector-tab[data-tab="${targetTab}"]`);
          if (tabBtn) tabBtn.click();
        }
      }
    });

    const sceneToolbar = createSceneToolbar({
      title: 'Cinematic White Glitch & Floating Card Reveal',
      counterText: 'Scene 6 of 6',
      onClose: closeSuite,
      onApply: applySuite,
      onTurnIntoTemplate: () => {
        const turnBtn = document.getElementById('btn-cancel-magnates-bp-suite');
        if (turnBtn) turnBtn.click();
        else if (typeof window.openSaveAsTemplateModal === 'function') window.openSaveAsTemplateModal();
      },
      onPrevScene: () => {
        const cur = getActiveSceneKey();
        const idx = Math.max(0, BLUEPRINT_SCENE_ORDER.indexOf(cur));
        const prevIdx = (idx - 1 + BLUEPRINT_SCENE_ORDER.length) % BLUEPRINT_SCENE_ORDER.length;
        switchScene(BLUEPRINT_SCENE_ORDER[prevIdx]);
      },
      onNextScene: () => {
        const cur = getActiveSceneKey();
        const idx = Math.max(0, BLUEPRINT_SCENE_ORDER.indexOf(cur));
        const nextIdx = (idx + 1) % BLUEPRINT_SCENE_ORDER.length;
        switchScene(BLUEPRINT_SCENE_ORDER[nextIdx]);
      }
    });

    const studioBody = document.createElement('div');
    studioBody.className = 'rg-studio-body';

    const studioMain = document.createElement('div');
    studioMain.className = 'rg-studio-main';

    modalBox.insertBefore(topbar, modalBox.firstChild);
    modalBox.insertBefore(studioBody, topbar.nextSibling);

    studioBody.appendChild(leftRail);
    studioBody.appendChild(studioMain);
    studioMain.appendChild(sceneToolbar);
    if (workspaceRow) studioMain.appendChild(workspaceRow);

    // Build 4-Tab Contextual Inspector with Stacked SVG Icon + Label + Inline Advanced Controls Card
    const shell = document.createElement('div');
    shell.className = 'rg-inspector-shell';
    shell.innerHTML = `
      <div class="rg-inspector-tabs">
        <button type="button" class="rg-inspector-tab is-active" data-tab="content">
          ${LUCIDE_ICONS.contentTab}
          <span>Content</span>
        </button>
        <button type="button" class="rg-inspector-tab" data-tab="motion">
          ${LUCIDE_ICONS.motionTab}
          <span>Motion</span>
        </button>
        <button type="button" class="rg-inspector-tab" data-tab="look">
          ${LUCIDE_ICONS.lookTab}
          <span>Look</span>
        </button>
        <button type="button" class="rg-inspector-tab" data-tab="effects">
          ${LUCIDE_ICONS.effectsTab}
          <span>Effects</span>
        </button>
      </div>
      <div class="rg-inspector-scroll">
        <div class="rg-tab-pane is-active" data-pane="content"></div>
        <div class="rg-tab-pane" data-pane="motion"></div>
        <div class="rg-tab-pane" data-pane="look"></div>
        <div class="rg-tab-pane" data-pane="effects"></div>
        <div class="rg-inline-advanced-card">
          <button type="button" class="rg-inline-advanced-trigger" data-action="toggle-advanced">
            <div class="rg-inline-advanced-left">
              <div class="rg-inline-advanced-icon">${LUCIDE_ICONS.sliders}</div>
              <div class="rg-inline-advanced-text">
                <span class="rg-inline-advanced-title">Advanced Controls</span>
                <span class="rg-inline-advanced-sub" data-role="adv-sub">Fine-tune timing, zoom, flash, and parallax.</span>
              </div>
            </div>
            <span class="rg-advanced-chevron">${LUCIDE_ICONS.chevronDown}</span>
          </button>
          <div class="rg-advanced-drawer" data-role="advanced-drawer"></div>
        </div>
      </div>
    `;

    // Keep all legacy inspector DOM nodes inside a hidden headless staging container so app.js can read/write them without exposing legacy UI
    const headlessStaging = document.createElement('div');
    headlessStaging.id = 'rg-bp-headless-staging';
    headlessStaging.style.cssText = 'display:none !important;';
    while (inspectorCol.firstChild) {
      headlessStaging.appendChild(inspectorCol.firstChild);
    }
    inspectorCol.appendChild(headlessStaging);
    inspectorCol.appendChild(shell);

    const advDrawer = shell.querySelector('[data-role="advanced-drawer"]');
    const panes = {
      content: shell.querySelector('[data-pane="content"]'),
      motion: shell.querySelector('[data-pane="motion"]'),
      look: shell.querySelector('[data-pane="look"]'),
      effects: shell.querySelector('[data-pane="effects"]')
    };
    const advSubEl = shell.querySelector('[data-role="adv-sub"]');

    shell.querySelectorAll('.rg-inspector-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-tab');
        shell.querySelectorAll('.rg-inspector-tab').forEach((b) => b.classList.remove('is-active'));
        tabBtn.classList.add('is-active');
        Object.keys(panes).forEach((k) => {
          panes[k].classList.toggle('is-active', k === target);
        });
      });
    });

    const advBtn = shell.querySelector('[data-action="toggle-advanced"]');
    advBtn.addEventListener('click', () => {
      advBtn.classList.toggle('is-open');
      advDrawer.classList.toggle('is-open');
    });

    function syncBlueprintSceneUI(sceneKey) {
      const normalizedKey = (sceneKey === 'room_spawn') ? 'article_capitol_zoom' : (sceneKey || getActiveSceneKey());
      const meta = BLUEPRINT_SCENE_META[normalizedKey] || BLUEPRINT_SCENE_META['printer_glitch_card'];
      const titleEl = sceneToolbar.querySelector('.rg-scene-title');
      const counterEl = sceneToolbar.querySelector('.rg-scene-counter-text');
      if (titleEl) titleEl.textContent = meta.title;
      if (counterEl) counterEl.textContent = `Scene ${meta.index} of 6`;
      buildBlueprintSceneInspector(normalizedKey === 'full_story_flow' ? 'brand_wavy_intro' : normalizedKey, panes, advSubEl, advDrawer);
    }

    syncBlueprintSceneUIRef = syncBlueprintSceneUI;

    // Listen to storyboard scene card & pill clicks
    document.querySelectorAll('.bp-storyboard-scene-card[data-scene-card], .btn-bp-scene-pill[data-preset], .btn-bp-scene-pill[data-scene]').forEach((el) => {
      el.addEventListener('click', () => {
        const k = el.getAttribute('data-scene-card') || el.getAttribute('data-preset') || el.getAttribute('data-scene');
        if (k) setTimeout(() => syncBlueprintSceneUI(k), 20);
      });
    });

    // Keep thumbnail preview synced when user replaces printer card image via legacy input
    const cardFileInput = document.getElementById('magnates-bp-input-printer-card-thumb');
    if (cardFileInput) {
      cardFileInput.addEventListener('change', () => {
        setTimeout(() => {
          const origThumb = document.getElementById('magnates-bp-thumb-printer-card');
          const previewImg = document.getElementById('rg-bp-card-thumb-preview');
          const largeThumbBox = document.querySelector('[data-role="large-product-thumb"]');
          if (origThumb && previewImg && origThumb.src) {
            const p = getBpParams();
            p.printerCardImgRemoved = false;
            p.printerCardImgUrl = origThumb.src;
            previewImg.src = origThumb.src;
            previewImg.style.display = '';
            if (largeThumbBox) largeThumbBox.classList.remove('is-empty', 'is-tapped');
          }
        }, 120);
      });
    }

    // Direct On-Canvas Selection Sync
    stage.addEventListener('click', (e) => {
      if (e.target.closest('#magnates-bp-player-hud')) return;
      const contentTabBtn = shell.querySelector('.rg-inspector-tab[data-tab="content"]');
      if (contentTabBtn) contentTabBtn.click();
      const firstCard = panes.content.querySelector('.rg-inspector-section');
      if (firstCard) {
        firstCard.classList.remove('rg-card-pulse-highlight');
        void firstCard.offsetWidth;
        firstCard.classList.add('rg-card-pulse-highlight');
      }
    });

    syncBlueprintSceneUI(getActiveSceneKey());
  }

  /* --------------------------------------------------------------------------
     5. PART B: UNIVERSAL 50+ TEMPLATE CUSTOMIZER (#modal-top-template-customizer)
        Headless Staging Pool + Standardized Regaarder Studio Inspector Adapter
     -------------------------------------------------------------------------- */
  let universalShellRefs = null;
  const distributedNodesLog = [];

  function restoreDistributedNodes() {
    while (distributedNodesLog.length > 0) {
      const entry = distributedNodesLog.pop();
      if (entry && entry.node && entry.parent) {
        try {
          if (entry.nextSibling && entry.nextSibling.parentNode === entry.parent) {
            entry.parent.insertBefore(entry.node, entry.nextSibling);
          } else {
            entry.parent.appendChild(entry.node);
          }
        } catch (e) {
          entry.parent.appendChild(entry.node);
        }
      }
    }
  }

  function mountUniversalTemplateCustomizerShell() {
    const modal = document.getElementById('modal-top-template-customizer');
    const outerWrapper = document.getElementById('modal-tpl-outer-wrapper');
    const previewCol = document.getElementById('tpl-modal-preview-column');
    const stageContainer = document.getElementById('tpl-modal-preview-stage-container');
    const layersPanel = document.getElementById('tpl-modal-layers-panel');
    if (!modal || !outerWrapper || !previewCol || !stageContainer || !layersPanel) return;
    if (outerWrapper.dataset.rgMounted === '1') return;
    outerWrapper.dataset.rgMounted = '1';

    stageContainer.classList.add('tpl-stage-hover-parent');

    const workspaceSplit = previewCol.parentElement;
    if (workspaceSplit) workspaceSplit.classList.add('rg-workspace-split');

    const closeModal = () => {
      if (window.RegaarderContextualToolbar) window.RegaarderContextualToolbar.hide();
      if (typeof window.deselectMagnatesBPLayer === 'function') window.deselectMagnatesBPLayer();
      const closeBtn = document.getElementById('btn-close-tpl-customizer');
      if (closeBtn) closeBtn.click();
      else modal.style.display = 'none';
    };

    const applyTemplate = () => {
      const applyBtn = document.getElementById('btn-tpl-modal-apply');
      if (applyBtn) applyBtn.click();
    };

    const turnIntoTemplate = () => {
      const saveBtn = document.getElementById('btn-tpl-modal-save-custom');
      if (saveBtn) saveBtn.click();
      else if (typeof window.openSaveAsTemplateModal === 'function') window.openSaveAsTemplateModal();
    };

    const topbar = createGlobalTopbar({
      onClose: closeModal,
      onOpenTemplates: () => {
        const drawer = document.getElementById('modal-tpl-sidebar-drawer');
        if (!drawer) return;
        const isHidden = window.getComputedStyle(drawer).display === 'none';
        if (isHidden) {
          if (typeof window.rgRenderUnifiedTemplatesLibrary === 'function') {
            window.rgRenderUnifiedTemplatesLibrary(drawer, {
              getActiveTemplateId: () => (window.activeTopTemplateObj && window.activeTopTemplateObj.id) || 'jani-cinematic-letterbox',
              onSelectTemplate: (tplId, tpl) => {
                if (typeof window.modalSelectTemplateCard === 'function') {
                  window.modalSelectTemplateCard(tplId);
                } else if (tpl && typeof window.openTopTemplateCustomizer === 'function') {
                  window.openTopTemplateCustomizer(tpl);
                }
              }
            });
          }
          drawer.style.display = 'flex';
        } else {
          drawer.style.display = 'none';
        }
      },
      onExport: applyTemplate
    });

    const leftRail = createLeftNavRail({
      onClose: closeModal,
      onSelectRail: (railId) => {
        const map = { assets: 'content', text: 'content', layers: 'content', studio: 'motion', effects: 'effects' };
        const targetTab = map[railId];
        if (targetTab && universalShellRefs) {
          const btn = universalShellRefs.shell.querySelector(`.rg-inspector-tab[data-tab="${targetTab}"]`);
          if (btn) btn.click();
        }
      }
    });

    const sceneToolbar = createSceneToolbar({
      title: 'Studio Scene Editor',
      counterText: 'Active Scene',
      hidePager: true,
      onClose: closeModal,
      onApply: applyTemplate,
      onTurnIntoTemplate: turnIntoTemplate,
      onMore: () => {
        const resetBtn = document.getElementById('btn-tpl-modal-reset-defaults');
        if (resetBtn) resetBtn.click();
      }
    });

    const studioBody = document.createElement('div');
    studioBody.className = 'rg-studio-body';

    const studioMain = document.createElement('div');
    studioMain.className = 'rg-studio-main';

    outerWrapper.insertBefore(topbar, outerWrapper.firstChild);
    outerWrapper.insertBefore(studioBody, topbar.nextSibling);

    studioBody.appendChild(leftRail);
    studioBody.appendChild(studioMain);
    studioMain.appendChild(sceneToolbar);
    if (workspaceSplit) studioMain.appendChild(workspaceSplit);

    // Keep all original #tpl-modal-layers-panel children in a hidden headless staging pool so app.js can always read/write them cleanly
    const stagingPool = document.createElement('div');
    stagingPool.id = 'rg-tpl-staging-pool';
    stagingPool.style.cssText = 'display:none !important;';
    while (layersPanel.firstChild) {
      stagingPool.appendChild(layersPanel.firstChild);
    }
    layersPanel.appendChild(stagingPool);

    // Build 4-Tab Contextual Inspector Shell matching Reference Image 2
    const shell = document.createElement('div');
    shell.className = 'rg-inspector-shell';
    shell.innerHTML = `
      <div class="rg-inspector-tabs">
        <button type="button" class="rg-inspector-tab is-active" data-tab="content">
          ${LUCIDE_ICONS.contentTab}
          <span>Content</span>
        </button>
        <button type="button" class="rg-inspector-tab" data-tab="motion">
          ${LUCIDE_ICONS.motionTab}
          <span>Motion</span>
        </button>
        <button type="button" class="rg-inspector-tab" data-tab="look">
          ${LUCIDE_ICONS.lookTab}
          <span>Look</span>
        </button>
        <button type="button" class="rg-inspector-tab" data-tab="effects">
          ${LUCIDE_ICONS.effectsTab}
          <span>Effects</span>
        </button>
      </div>
      <div class="rg-inspector-scroll">
        <div class="rg-tab-pane is-active" data-pane="content"></div>
        <div class="rg-tab-pane" data-pane="motion"></div>
        <div class="rg-tab-pane" data-pane="look"></div>
        <div class="rg-tab-pane" data-pane="effects"></div>
        <div class="rg-inline-advanced-card">
          <button type="button" class="rg-inline-advanced-trigger" data-action="toggle-advanced">
            <div class="rg-inline-advanced-left">
              <div class="rg-inline-advanced-icon">${LUCIDE_ICONS.sliders}</div>
              <div class="rg-inline-advanced-text">
                <span class="rg-inline-advanced-title">Advanced Controls</span>
                <span class="rg-inline-advanced-sub">Fine-tune timing, zoom, flash, and parallax.</span>
              </div>
            </div>
            <span class="rg-advanced-chevron">${LUCIDE_ICONS.chevronDown}</span>
          </button>
          <div class="rg-advanced-drawer" data-role="advanced-drawer"></div>
        </div>
      </div>
    `;
    layersPanel.appendChild(shell);

    const panes = {
      content: shell.querySelector('[data-pane="content"]'),
      motion: shell.querySelector('[data-pane="motion"]'),
      look: shell.querySelector('[data-pane="look"]'),
      effects: shell.querySelector('[data-pane="effects"]')
    };
    const advDrawer = shell.querySelector('[data-role="advanced-drawer"]');

    shell.querySelectorAll('.rg-inspector-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-tab');
        shell.querySelectorAll('.rg-inspector-tab').forEach((b) => b.classList.remove('is-active'));
        tabBtn.classList.add('is-active');
        Object.keys(panes).forEach((k) => {
          panes[k].classList.toggle('is-active', k === target);
        });
      });
    });

    const advBtn = shell.querySelector('[data-action="toggle-advanced"]');
    advBtn.addEventListener('click', () => {
      advBtn.classList.toggle('is-open');
      advDrawer.classList.toggle('is-open');
    });

    // Direct On-Canvas Click Sync
    const stageEl = document.getElementById('tpl-modal-preview-stage');
    if (stageEl) {
      stageEl.addEventListener('click', (e) => {
        if (e.target.closest('#tpl-modal-player-hud')) return;
        const contentBtn = shell.querySelector('.rg-inspector-tab[data-tab="content"]');
        if (contentBtn) contentBtn.click();
        const firstCard = panes.content.querySelector('.rg-inspector-section');
        if (firstCard) {
          firstCard.classList.remove('rg-card-pulse-highlight');
          void firstCard.offsetWidth;
          firstCard.classList.add('rg-card-pulse-highlight');
        }
      });
    }

    universalShellRefs = {
      shell,
      panes,
      advDrawer,
      stagingPool,
      sceneToolbar
    };
  }

  function cleanInspectorLabelText(raw) {
    if (!raw) return '';
    return String(raw)
      .replace(/\(Z\s*=\s*[^)]+\)/gi, '')
      .replace(/\bZ\s*=\s*\d+(\.\.\d+)?\b/gi, '')
      .replace(/#[a-z0-9_-]+/gi, '')
      .replace(/\((?:TAG ORDERED|RELEVANCE SORTED|\d+\s*Stacked)\)/gi, '')
      .replace(/^[\u2000-\u27BF\uE000-\uF8FF\uD83C-\uDBFF\uDC00-\uDFFF\s•·\-:]+/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function classifyControlCategory(label, ctrlType) {
    const t = (label || '').toLowerCase();
    if (ctrlType === 'file' || ctrlType === 'text') {
      if (t.includes('color') || t.includes('hex') || t.includes('tint')) return 'look';
      return 'content';
    }
    if (ctrlType === 'color') return 'look';
    if (t.includes('speed') || t.includes('duration') || t.includes('delay') || t.includes('zoom') || t.includes('scale') || t.includes('pan') || t.includes('tilt') || t.includes('orbit') || t.includes('parallax') || t.includes('motion') || t.includes('camera') || t.includes('push') || t.includes('wipe') || t.includes('offset') || t.includes('position') || t.includes('gap') || t.includes('spacing') || t.includes('spring') || t.includes('velocity')) {
      return 'motion';
    }
    if (t.includes('color') || t.includes('palette') || t.includes('grade') || t.includes('tint') || t.includes('backdrop') || t.includes('darkness') || t.includes('brightness') || t.includes('contrast') || t.includes('saturation') || t.includes('exposure') || t.includes('lighting') || t.includes('theme') || t.includes('matte') || t.includes('letterbox')) {
      return 'look';
    }
    if (t.includes('glow') || t.includes('blur') || t.includes('glitch') || t.includes('flash') || t.includes('grain') || t.includes('vignette') || t.includes('shadow') || t.includes('particle') || t.includes('choke') || t.includes('decontamination') || t.includes('feather') || t.includes('bloom') || t.includes('opacity') || t.includes('atmosphere')) {
      return 'effects';
    }
    return 'content';
  }

  function extractControlLabel(el, rootContainer) {
    if (el.id) {
      const explicitLbl = rootContainer.querySelector(`label[for="${el.id}"]`);
      if (explicitLbl) {
        const cleaned = cleanInspectorLabelText(explicitLbl.textContent);
        if (cleaned) return cleaned;
      }
    }
    let cur = el.parentElement;
    for (let depth = 0; depth < 3 && cur && cur !== rootContainer; depth++) {
      const lblEl = cur.querySelector('label, span, div');
      if (lblEl && !lblEl.contains(el)) {
        const txt = cleanInspectorLabelText(lblEl.textContent);
        if (txt && txt.length > 1 && txt.length < 48 && !/^[\d.%spx+-]+$/i.test(txt)) {
          return txt;
        }
      }
      cur = cur.parentElement;
    }
    const placeholder = cleanInspectorLabelText(el.getAttribute('placeholder') || el.getAttribute('title') || '');
    if (placeholder && placeholder.length < 44) return placeholder;
    if (el.id) {
      return cleanInspectorLabelText(
        el.id
          .replace(/^(tpl-modal-|magnates-bp-|input-|slider-|select-)+/i, '')
          .replace(/[-_]+/g, ' ')
      ).replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return 'Parameter';
  }

  function createFallbackQuickStyleCard() {
    const card = document.createElement('div');
    card.className = 'rg-inspector-section';
    card.innerHTML = `
      <div class="rg-section-header">
        <div class="rg-section-title-row">
          <span class="rg-section-caret">${LUCIDE_ICONS.chevronRight}</span>
          <span class="rg-section-title">Quick Style</span>
        </div>
      </div>
      <div class="rg-style-cards-grid">
        ${[
          { id: 'clean', label: 'Clean', cls: 'is-clean', filter: 'none' },
          { id: 'glass', label: 'Glass', cls: 'is-glass', filter: 'contrast(1.06) brightness(1.05)' },
          { id: 'glow', label: 'Glow', cls: 'is-glow', filter: 'contrast(1.12) saturate(1.22)' },
          { id: 'outline', label: 'Outline', cls: 'is-outline', filter: 'contrast(1.18) brightness(0.96)' }
        ].map((st, idx) => `
          <button type="button" class="rg-style-card ${idx === 0 ? 'is-active' : ''}" data-filter="${st.filter}">
            <span class="rg-style-card-check">${LUCIDE_ICONS.check}</span>
            <div class="rg-style-card-preview ${st.cls}">
              <div class="rg-mini-card"></div>
            </div>
            <span class="rg-style-card-name">${st.label}</span>
          </button>
        `).join('')}
      </div>
    `;
    card.querySelectorAll('.rg-style-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        card.querySelectorAll('.rg-style-card').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const stage = document.getElementById('tpl-modal-preview-stage');
        if (stage) stage.style.filter = btn.getAttribute('data-filter') || 'none';
      });
    });
    return card;
  }

  function createFallbackSceneAnimationCard() {
    const card = document.createElement('div');
    card.className = 'rg-inspector-section';
    card.innerHTML = `
      <div class="rg-section-header">
        <div class="rg-section-title-row">
          <span class="rg-section-caret">${LUCIDE_ICONS.chevronRight}</span>
          <span class="rg-section-title">Card Animation</span>
        </div>
        <span class="rg-section-subtitle">How the card appears and moves.</span>
      </div>
      <div class="rg-card-anim-row">
        <div class="rg-anim-select-wrap">
          <span class="rg-anim-select-icon">${LUCIDE_ICONS.wand}</span>
          <select class="rg-anim-select">
            <option value="smooth_reveal" selected>Smooth Reveal</option>
            <option value="spring_pop">Dynamic Spring</option>
            <option value="cinematic_push">Cinematic Push</option>
            <option value="editorial_snap">Editorial Snap</option>
          </select>
          <span class="rg-anim-select-chevron">${LUCIDE_ICONS.chevronDown}</span>
        </div>
        <div class="rg-speed-col">
          <span class="rg-speed-label">Speed</span>
          <div class="rg-speed-pills">
            <button type="button" class="rg-speed-pill" data-speed="0.7">Slow</button>
            <button type="button" class="rg-speed-pill is-active" data-speed="1.0">Normal</button>
            <button type="button" class="rg-speed-pill" data-speed="1.4">Fast</button>
          </div>
        </div>
      </div>
    `;
    card.querySelectorAll('.rg-speed-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        card.querySelectorAll('.rg-speed-pill').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const vid = document.getElementById('tpl-modal-preview-video');
        if (vid) vid.playbackRate = parseFloat(btn.getAttribute('data-speed') || '1.0');
      });
    });
    return card;
  }

  function buildStandardizedControlDom(descriptor) {
    const { type, label, el } = descriptor;

    if (type === 'text') {
      const wrap = document.createElement('div');
      wrap.className = 'rg-field-group';
      const lbl = document.createElement('label');
      lbl.className = 'rg-field-label';
      lbl.textContent = label;
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'rg-input';
      inp.value = el.value || '';
      if (el.placeholder) inp.placeholder = el.placeholder;
      inp.addEventListener('input', () => {
        el.value = inp.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      wrap.appendChild(lbl);
      wrap.appendChild(inp);
      return wrap;
    }

    if (type === 'range') {
      const wrap = document.createElement('div');
      wrap.className = 'rg-slider-row';
      const min = el.min !== '' ? el.min : '0';
      const max = el.max !== '' ? el.max : '100';
      const step = el.step !== '' ? el.step : '1';
      const curVal = el.value !== '' ? el.value : '50';
      const unit = (parseFloat(max) <= 3 && parseFloat(step) < 1) ? 'x' : (label.toLowerCase().includes('duration') || label.toLowerCase().includes('delay') ? 's' : '%');

      wrap.innerHTML = `
        <div class="rg-slider-header">
          <span>${label}</span>
          <span class="rg-slider-val">${curVal}${unit}</span>
        </div>
        <input type="range" class="rg-range" min="${min}" max="${max}" step="${step}" value="${curVal}">
      `;
      const rng = wrap.querySelector('input[type="range"]');
      const valSpan = wrap.querySelector('.rg-slider-val');
      rng.addEventListener('input', () => {
        valSpan.textContent = rng.value + unit;
        el.value = rng.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      return wrap;
    }

    if (type === 'select') {
      const wrap = document.createElement('div');
      wrap.className = 'rg-field-group';
      const lbl = document.createElement('label');
      lbl.className = 'rg-field-label';
      lbl.textContent = label;
      const selWrap = document.createElement('div');
      selWrap.className = 'rg-anim-select-wrap';
      const sel = document.createElement('select');
      sel.className = 'rg-anim-select';
      sel.style.paddingLeft = '12px';
      Array.from(el.options).forEach((opt) => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = cleanInspectorLabelText(opt.textContent) || opt.value;
        if (opt.selected) o.selected = true;
        sel.appendChild(o);
      });
      const chev = document.createElement('span');
      chev.className = 'rg-anim-select-chevron';
      chev.innerHTML = LUCIDE_ICONS.chevronDown;
      sel.addEventListener('change', () => {
        el.value = sel.value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      selWrap.appendChild(sel);
      selWrap.appendChild(chev);
      wrap.appendChild(lbl);
      wrap.appendChild(selWrap);
      return wrap;
    }

    if (type === 'color') {
      const wrap = document.createElement('div');
      wrap.className = 'rg-color-row';
      const curHex = el.value || '#8b5cf6';
      wrap.innerHTML = `
        <span class="rg-color-label">${label}</span>
        <div class="rg-color-picker-wrap">
          <input type="color" class="rg-color-input" value="${curHex}">
          <span class="rg-color-hex">${curHex.toUpperCase()}</span>
        </div>
      `;
      const cInp = wrap.querySelector('.rg-color-input');
      const hexSpan = wrap.querySelector('.rg-color-hex');
      cInp.addEventListener('input', () => {
        hexSpan.textContent = cInp.value.toUpperCase();
        el.value = cInp.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      return wrap;
    }

    if (type === 'checkbox') {
      const wrap = document.createElement('div');
      wrap.className = 'rg-toggle-row';
      wrap.innerHTML = `
        <span class="rg-toggle-label">${label}</span>
        <input type="checkbox" class="rg-toggle-switch" ${el.checked ? 'checked' : ''}>
      `;
      const chk = wrap.querySelector('.rg-toggle-switch');
      chk.addEventListener('change', () => {
        el.checked = chk.checked;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      return wrap;
    }

    if (type === 'file') {
      const wrap = document.createElement('div');
      wrap.className = 'rg-media-asset-row';
      wrap.innerHTML = `
        <div class="rg-media-asset-info">
          <div class="rg-media-asset-icon">${LUCIDE_ICONS.imageIcon}</div>
          <div class="rg-media-asset-meta">
            <span class="rg-media-asset-name">${label}</span>
            <span class="rg-media-asset-sub">Scene media asset</span>
          </div>
        </div>
        <button type="button" class="rg-asset-replace-btn">
          ${LUCIDE_ICONS.imageIcon}
          <span>Replace</span>
        </button>
      `;
      const btn = wrap.querySelector('.rg-asset-replace-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        el.click();
      });
      return wrap;
    }

    return null;
  }

  function organizeUniversalTemplateControls() {
    if (!universalShellRefs) mountUniversalTemplateCustomizerShell();
    if (!universalShellRefs) return;

    const { panes, advDrawer, stagingPool } = universalShellRefs;

    // 1. Restore any previously moved nodes so all legacy nodes live inside hidden stagingPool
    restoreDistributedNodes();

    // 2. Clear all visible panes and Advanced Controls drawer
    panes.content.innerHTML = '';
    panes.motion.innerHTML = '';
    panes.look.innerHTML = '';
    panes.effects.innerHTML = '';
    advDrawer.innerHTML = '';

    // Sync template title in the streamlined scene toolbar
    const legacyTitleEl = document.getElementById('tpl-modal-title');
    const toolbarTitleEl = universalShellRefs.sceneToolbar.querySelector('.rg-scene-title');
    const sceneTitleText = (legacyTitleEl && legacyTitleEl.textContent.trim()) ? legacyTitleEl.textContent.trim() : 'Studio Scene Editor';
    if (toolbarTitleEl) {
      toolbarTitleEl.textContent = sceneTitleText;
    }

    // Always place Saved Look Presets at the top of the Look tab
    panes.look.appendChild(createLookPresetsCard(() => document.getElementById('tpl-modal-preview-stage')));

    const activeTplId = (typeof topCustomizerState !== 'undefined' && topCustomizerState && topCustomizerState.currentTpl && topCustomizerState.currentTpl.id)
      || (window.activeTopTemplateObj && window.activeTopTemplateObj.id)
      || '';
    if (activeTplId === 'adidas-puma-cosmic-earth-suite' && typeof window.tplBuildAdidasPumaCosmicRegaarderPanes === 'function') {
      window.tplBuildAdidasPumaCosmicRegaarderPanes(panes, advDrawer, universalShellRefs);
      return;
    }
    if (activeTplId === 'tencent-shadow-giant-multimedia' && typeof window.tplBuildTencentMultimediaRegaarderPanes === 'function') {
      window.tplBuildTencentMultimediaRegaarderPanes(panes, advDrawer, universalShellRefs);
      return;
    }

    const isSectionActive = (el) => {
      if (!el) return false;
      let cur = el;
      while (cur && cur !== stagingPool && cur !== document.body) {
        if (cur.style && cur.style.display === 'none') return false;
        cur = cur.parentElement;
      }
      return true;
    };

    const candidateRoots = [
      document.getElementById('tpl-modal-dynamic-controls'),
      document.getElementById('tpl-modal-standard-layers-section'),
      document.getElementById('tpl-modal-wrap-text'),
      document.getElementById('tpl-modal-wrap-creator-calibration'),
      document.getElementById('tpl-modal-spooner-controls'),
      document.getElementById('tpl-modal-push-controls'),
      document.getElementById('tpl-modal-wrap-doc-highlighter'),
      document.getElementById('tpl-modal-wrap-matrix'),
      document.getElementById('tpl-modal-wrap-atmosphere'),
      document.getElementById('tpl-modal-3d-controls')
    ].filter(isSectionActive);

    const buckets = {
      content: [],
      motion: [],
      look: [],
      effects: [],
      advanced: []
    };

    const seenElements = new Set();
    const seenLabels = new Set();

    candidateRoots.forEach((root) => {
      const controls = root.querySelectorAll('input, select, textarea');
      controls.forEach((ctrl) => {
        if (seenElements.has(ctrl)) return;
        seenElements.add(ctrl);

        const tag = ctrl.tagName.toLowerCase();
        const inputType = (ctrl.getAttribute('type') || 'text').toLowerCase();
        if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button') return;

        // Check if control's immediate wrapper is explicitly hidden (except file inputs which are often display:none with a trigger label/button)
        if (inputType !== 'file' && !isSectionActive(ctrl)) return;

        let normType = 'text';
        if (tag === 'select') normType = 'select';
        else if (inputType === 'range' || inputType === 'number') normType = 'range';
        else if (inputType === 'color') normType = 'color';
        else if (inputType === 'checkbox') normType = 'checkbox';
        else if (inputType === 'file') normType = 'file';

        const label = extractControlLabel(ctrl, root);
        if (!label || label.length < 2) return;
        const dedupeKey = `${normType}:${label.toLowerCase()}`;
        if (seenLabels.has(dedupeKey)) return;
        seenLabels.add(dedupeKey);

        const category = classifyControlCategory(label, normType);
        const descriptor = { type: normType, label, el: ctrl };

        if (buckets[category] && buckets[category].length < 24) {
          buckets[category].push(descriptor);
        } else {
          buckets.advanced.push(descriptor);
        }
      });
    });

    const appendBucketCard = (targetContainer, title, subtitle, list) => {
      if (!list || list.length === 0) return;
      const card = document.createElement('div');
      card.className = 'rg-inspector-section';
      card.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">${title}</span>
          ${subtitle ? `<span class="rg-section-subtitle">${subtitle}</span>` : ''}
        </div>
      `;
      list.forEach((desc) => {
        const dom = buildStandardizedControlDom(desc);
        if (dom) card.appendChild(dom);
      });
      targetContainer.appendChild(card);
    };

    if (buckets.content.length > 0) {
      appendBucketCard(panes.content, sceneTitleText, 'Edit the scene text, media layers, and callouts.', buckets.content);
    }
    panes.content.appendChild(createFallbackQuickStyleCard());
    panes.content.appendChild(createFallbackSceneAnimationCard());

    if (buckets.motion.length > 0) {
      appendBucketCard(panes.motion, 'Camera & Choreography', 'Adjust 3D camera motion, speed, and spatial depth.', buckets.motion);
    } else {
      panes.motion.appendChild(createFallbackSceneAnimationCard());
    }

    if (buckets.look.length > 0) {
      appendBucketCard(panes.look, 'Color & Lighting Grade', 'Customize palette, backdrop contrast, and framing.', buckets.look);
    }

    if (buckets.effects.length > 0) {
      appendBucketCard(panes.effects, 'Optical & Atmosphere', 'Fine-tune glow, blur, grain, and lens optics.', buckets.effects);
    } else {
      const defaultFxCard = document.createElement('div');
      defaultFxCard.className = 'rg-inspector-section';
      defaultFxCard.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Optical & Atmosphere</span>
          <span class="rg-section-subtitle">Adjust scene vignette and atmospheric bloom.</span>
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>Atmospheric Glow</span>
            <span class="rg-slider-val">85%</span>
          </div>
          <input type="range" class="rg-range" min="0" max="100" value="85">
        </div>
      `;
      panes.effects.appendChild(defaultFxCard);
    }

    if (buckets.advanced.length > 0) {
      appendBucketCard(advDrawer, 'Fine-Tuning & Layer Calibration', 'Additional scene-specific parameters.', buckets.advanced);
    } else {
      const cleanAdvFallback = document.createElement('div');
      cleanAdvFallback.className = 'rg-inspector-section';
      cleanAdvFallback.innerHTML = `
        <div class="rg-section-header">
          <span class="rg-section-title">Scene Calibration</span>
          <span class="rg-section-subtitle">Fine-tune render depth and motion blur.</span>
        </div>
        <div class="rg-slider-row">
          <div class="rg-slider-header">
            <span>3D Parallax Intensity</span>
            <span class="rg-slider-val">100%</span>
          </div>
          <input type="range" class="rg-range" min="0" max="150" value="100">
        </div>
      `;
      advDrawer.appendChild(cleanAdvFallback);
    }
  }
  window.organizeUniversalTemplateControls = organizeUniversalTemplateControls;

  /* --------------------------------------------------------------------------
     6. PART C: STANDALONE 3D & MAGNATES SUITE MODALS (.vector-export-modal)
     -------------------------------------------------------------------------- */
  const STANDALONE_SUITE_MODAL_IDS = [
    'modal-magnates-glow-suite',
    'modal-magnates-shadows-suite',
    'modal-magnates-shadowize-suite',
    'modal-magnates-blend-suite',
    'modal-magnates-ink-reveal-suite',
    'modal-magnates-article-highlight-suite',
    'modal-magnates-particle-vfx-suite',
    'modal-magnates-vignette-suite',
    'modal-kinetic-typography-suite',
    'modal-tactical-decode-suite',
    'modal-search-bar-suite',
    'modal-forbes-cover-suite',
    'modal-cross-section-suite',
    'modal-puzzle-suite',
    'modal-money-stack-suite',
    'modal-wire-transfer-suite',
    'modal-envelope-suite',
    'modal-deal-term-sheet-suite',
    'modal-pyramid-collapse-suite',
    'modal-fraud-dossier-suite',
    'modal-red-string-suite',
    'modal-checklist-suite',
    'modal-instagram-suite',
    'modal-grunge-paper-suite',
    'modal-hypnotic-vertigo-suite',
    'modal-countdown-suite',
    'modal-ftx-logo-suite',
    'modal-flash-quad-suite',
    'modal-spin-flash-glitch-suite'
  ];

  function upgradeStandaloneSuiteModal(modal) {
    if (!modal || modal.dataset.rgSuiteMounted === '1') return;
    if (modal.id === 'modal-magnates-paper-blueprint-suite' || modal.id === 'modal-top-template-customizer') return;
    const box = modal.querySelector('.vector-modal-box') || modal.firstElementChild;
    if (!box) return;

    modal.dataset.rgSuiteMounted = '1';
    modal.classList.add('rg-shell-mounted');

    const titleEl = box.querySelector('h2, h3');
    const suiteTitle = titleEl ? titleEl.textContent.trim() : '3D Scene Editor';

    const closeBtn = box.querySelector('[id^="btn-close-"], .export-btn-close, button[title="Close"]');
    const applyBtn = box.querySelector('[id^="btn-apply-"], [id^="btn-insert-"], .btn-primary');

    const legacyHeader = box.firstElementChild;
    if (legacyHeader) legacyHeader.classList.add('rg-legacy-header-hidden');

    // Hide any legacy bottom Pause/Replay bar in standalone suite modals so ONLY the hover HUD remains
    box.querySelectorAll('button[id$="-play-pause"], button[id$="-reset"]').forEach((btn) => {
      if (!btn.closest('.tpl-modal-player-hud')) {
        const controlsRow = btn.parentElement && btn.parentElement.parentElement;
        if (controlsRow && !controlsRow.querySelector('.tpl-stage-hover-parent')) {
          controlsRow.classList.add('rg-legacy-playback-hidden');
        }
      }
    });

    const closeSuite = () => {
      if (closeBtn) closeBtn.click();
      else modal.style.display = 'none';
    };

    const applySuite = () => {
      if (applyBtn) applyBtn.click();
    };

    const topbar = createGlobalTopbar({ onClose: closeSuite });
    const leftRail = createLeftNavRail({ onClose: closeSuite });
    const sceneToolbar = createSceneToolbar({
      title: suiteTitle,
      hidePager: true,
      onClose: closeSuite,
      onApply: applySuite
    });

    const contentArea = box.children[1] || box.lastElementChild;
    const studioBody = document.createElement('div');
    studioBody.className = 'rg-studio-body';

    const studioMain = document.createElement('div');
    studioMain.className = 'rg-studio-main';

    box.insertBefore(topbar, box.firstChild);
    box.insertBefore(studioBody, topbar.nextSibling);
    studioBody.appendChild(leftRail);
    studioBody.appendChild(studioMain);
    studioMain.appendChild(sceneToolbar);
    if (contentArea) {
      contentArea.style.flex = '1';
      contentArea.style.minHeight = '0';
      studioMain.appendChild(contentArea);
    }
  }

  /* --------------------------------------------------------------------------
     7. STEALTH RED SCROLLBAR INTERACTION (Proximity Dim Hover + Red Hold State)
     -------------------------------------------------------------------------- */
  function bindStealthRedScrollbars() {
    const selectors = [
      '#magnates-bp-preview-col',
      '#tpl-modal-preview-column',
      '#magnates-bp-storyboard-row',
      '#modal-scenes-storyboard-row',
      '.rg-inspector-scroll',
      '#tpl-modal-layers-panel',
      '#modal-tpl-sidebar-cards-list',
      '#magnates-bp-tpl-cards-list'
    ];

    const elements = [];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (!el._rgStealthScrollBound) {
          el._rgStealthScrollBound = true;
          elements.push(el);
        }
      });
    });

    elements.forEach((el) => {
      const isHorizontal = el.id === 'magnates-bp-storyboard-row' || el.id === 'modal-scenes-storyboard-row';

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        if (isHorizontal) {
          const distBottom = rect.bottom - e.clientY;
          el.classList.toggle('scrollbar-edge-hover', distBottom >= -6 && distBottom <= 28);
          el.classList.toggle('scrollbar-edge-near', distBottom >= -2 && distBottom <= 14);
        } else {
          const distRight = rect.right - e.clientX;
          el.classList.toggle('scrollbar-edge-hover', distRight >= -6 && distRight <= 32);
          el.classList.toggle('scrollbar-edge-near', distRight >= -2 && distRight <= 16);
        }
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        el.classList.remove('scrollbar-edge-hover', 'scrollbar-edge-near');
      }, { passive: true });

      const onPressStart = (e) => {
        const rect = el.getBoundingClientRect();
        if (isHorizontal) {
          const distBottom = rect.bottom - e.clientY;
          if (distBottom <= 22 && distBottom >= -4) {
            el.classList.add('scrollbar-thumb-active');
          }
        } else {
          const distRight = rect.right - e.clientX;
          if (distRight <= 24 && distRight >= -4) {
            el.classList.add('scrollbar-thumb-active');
          }
        }
      };

      el.addEventListener('pointerdown', onPressStart, { passive: true });
      el.addEventListener('mousedown', onPressStart, { passive: true });
    });

    if (!window._rgGlobalScrollbarReleaseBound) {
      window._rgGlobalScrollbarReleaseBound = true;
      const clearActiveScrollbars = () => {
        document.querySelectorAll('.scrollbar-thumb-active').forEach((el) => {
          el.classList.remove('scrollbar-thumb-active');
        });
      };
      window.addEventListener('pointerup', clearActiveScrollbars, { passive: true });
      window.addEventListener('mouseup', clearActiveScrollbars, { passive: true });
      window.addEventListener('blur', clearActiveScrollbars, { passive: true });
    }
  }

  /* --------------------------------------------------------------------------
     8. UNIVERSAL CONTEXTUAL TOOLBAR SYSTEM (window.RegaarderContextualToolbar)
     Anatomy: Object Identity -> Primary Tools -> Quick Properties -> More Actions
     -------------------------------------------------------------------------- */
  const HUMAN_OBJECT_CATALOG = {
    card: {
      id: 'card',
      name: 'Product Card',
      variant: 'media',
      icon: LUCIDE_ICONS.layers,
      fileInputId: 'magnates-bp-input-printer-card-thumb',
      domSelector: '#magnates-bp-spec-card'
    },
    cartridge: {
      id: 'cartridge',
      name: 'Comparison Card 1',
      variant: 'media',
      icon: LUCIDE_ICONS.layers,
      fileInputId: 'magnates-bp-input-printer-cartridge',
      domSelector: '#magnates-bp-cartridge-card'
    },
    compatible: {
      id: 'compatible',
      name: 'Comparison Card 2',
      variant: 'media',
      icon: LUCIDE_ICONS.layers,
      fileInputId: 'magnates-bp-input-printer-compatible',
      domSelector: '#magnates-bp-compatible-card'
    },
    printer_hero: {
      id: 'printer_hero',
      name: 'Hero Printer',
      variant: 'object3d',
      icon: LUCIDE_ICONS.cube3d,
      fileInputId: 'magnates-bp-input-printer-hero',
      domSelector: '#magnates-bp-printer-hero'
    },
    printer_acc: {
      id: 'printer_acc',
      name: 'Desk Props',
      variant: 'object3d',
      icon: LUCIDE_ICONS.layers,
      fileInputId: 'magnates-bp-input-printer-acc',
      domSelector: '#magnates-bp-printer-acc'
    },
    logo: {
      id: 'logo',
      name: 'Brand Emblem',
      variant: 'object3d',
      icon: LUCIDE_ICONS.cube3d,
      fileInputId: 'magnates-bp-input-brand-logo',
      domSelector: '#magnates-bp-brand-logo'
    },
    prod1: {
      id: 'prod1',
      name: 'Product Cutout 1',
      variant: 'media',
      icon: LUCIDE_ICONS.imageIcon,
      fileInputId: 'magnates-bp-input-prod1-img',
      domSelector: '#magnates-bp-prod-1'
    },
    prod2: {
      id: 'prod2',
      name: 'Product Cutout 2',
      variant: 'media',
      icon: LUCIDE_ICONS.imageIcon,
      fileInputId: 'magnates-bp-input-prod2-img',
      domSelector: '#magnates-bp-prod-2'
    },
    sil_left: {
      id: 'sil_left',
      name: 'Left Silhouette',
      variant: 'media',
      icon: LUCIDE_ICONS.imageIcon,
      fileInputId: 'magnates-bp-input-sil-left',
      domSelector: '#magnates-bp-sil-left'
    },
    sil_right: {
      id: 'sil_right',
      name: 'Right Silhouette',
      variant: 'media',
      icon: LUCIDE_ICONS.imageIcon,
      fileInputId: 'magnates-bp-input-sil-right',
      domSelector: '#magnates-bp-sil-right'
    },
    article: {
      id: 'article',
      name: 'Article Card',
      variant: 'media',
      icon: LUCIDE_ICONS.layers,
      fileInputId: 'magnates-bp-input-article-img',
      domSelector: '#magnates-bp-article-card'
    },
    capitol: {
      id: 'capitol',
      name: 'Capitol Cutout',
      variant: 'object3d',
      icon: LUCIDE_ICONS.cube3d,
      fileInputId: 'magnates-bp-input-capitol-img',
      domSelector: '#magnates-bp-capitol-cutout'
    },
    backdrop: {
      id: 'backdrop',
      name: 'Studio Backdrop',
      variant: 'media',
      icon: LUCIDE_ICONS.lookTab,
      fileInputId: 'magnates-bp-upload-z0',
      domSelector: '#magnates-bp-stage'
    },
    text: {
      id: 'text',
      name: 'Headline',
      variant: 'text',
      icon: LUCIDE_ICONS.text,
      fileInputId: '',
      domSelector: '#tpl-modal-preview-text'
    },
    fg: {
      id: 'fg',
      name: 'Image',
      variant: 'media',
      icon: LUCIDE_ICONS.imageIcon,
      fileInputId: 'tpl-modal-fg-upload',
      domSelector: '#tpl-modal-fg-layer'
    },
    bg: {
      id: 'bg',
      name: 'Backdrop Media',
      variant: 'media',
      icon: LUCIDE_ICONS.lookTab,
      fileInputId: 'tpl-modal-bg-upload',
      domSelector: '#tpl-modal-preview-img'
    },
    shape: {
      id: 'shape',
      name: 'Shape',
      variant: 'shape',
      icon: LUCIDE_ICONS.shapeSquare,
      fileInputId: '',
      domSelector: ''
    },
    animation: {
      id: 'animation',
      name: 'Motion Path',
      variant: 'animation',
      icon: LUCIDE_ICONS.motionTab,
      fileInputId: '',
      domSelector: ''
    },
    multi: {
      id: 'multi',
      name: 'Multiple Objects',
      variant: 'multi',
      icon: LUCIDE_ICONS.layers,
      fileInputId: '',
      domSelector: ''
    }
  };

  // Declarative Variant Schema: Defines relevant Primary Tools and Quick Properties per object variant
  const TOOLBAR_VARIANT_SCHEMAS = {
    text: {
      variantName: 'Text Toolbar',
      primaryTools: ['select', 'move', 'rotate', 'duplicate', 'align'],
      quickProps: ['color', 'style']
    },
    media: {
      variantName: 'Image / Media Toolbar',
      primaryTools: ['select', 'move', 'rotate', 'crop', 'duplicate'],
      quickProps: ['replace', 'color', 'style']
    },
    shape: {
      variantName: 'Shape Toolbar',
      primaryTools: ['select', 'move', 'rotate', 'duplicate', 'align'],
      quickProps: ['color', 'style']
    },
    object3d: {
      variantName: '3D Object Toolbar',
      primaryTools: ['select', 'move', 'rotate', 'crop', 'duplicate'],
      quickProps: ['replace', 'color', 'style']
    },
    animation: {
      variantName: 'Animation Toolbar',
      primaryTools: ['select', 'move', 'align'],
      quickProps: ['color', 'style']
    },
    multi: {
      variantName: 'Multi-Selection Toolbar',
      primaryTools: ['select', 'move', 'align', 'arrange', 'duplicate'],
      quickProps: ['color', 'style']
    }
  };

  function humanizeLayerName(rawKeyOrLabel) {
    if (!rawKeyOrLabel) return 'Product Card';
    const key = String(rawKeyOrLabel).trim().toLowerCase();
    if (HUMAN_OBJECT_CATALOG[key]) return HUMAN_OBJECT_CATALOG[key].name;
    const s = String(rawKeyOrLabel);
    if (/floating spec card|top spec card/i.test(s)) return 'Product Card';
    if (/original ink card|cartridge/i.test(s)) return 'Comparison Card 1';
    if (/compatible card|compatible/i.test(s)) return 'Comparison Card 2';
    if (/hero printer/i.test(s)) return 'Hero Printer';
    if (/desk props|accessories/i.test(s)) return 'Desk Props';
    if (/logo|emblem/i.test(s)) return 'Brand Emblem';
    if (/foreground layer/i.test(s)) return 'Image';
    if (/background/i.test(s)) return 'Studio Backdrop';
    if (/text|headline/i.test(s)) return 'Headline';
    return s
      .replace(/^Z\s*=\s*\d+\s*\/\/\s*/i, '')
      .replace(/\([^)]*\)/g, '')
      .trim()
      .replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) || 'Selected Object';
  }

  function createUniversalContextualToolbar() {
    let toolbarEl = document.getElementById('rg-universal-contextual-toolbar');
    if (toolbarEl) return toolbarEl._rgController;

    toolbarEl = document.createElement('div');
    toolbarEl.id = 'rg-universal-contextual-toolbar';
    toolbarEl.className = 'rg-ctx-toolbar';
    toolbarEl.setAttribute('role', 'toolbar');
    toolbarEl.setAttribute('aria-label', 'Contextual Object Toolbar');
    document.body.appendChild(toolbarEl);

    let selectionFrameEl = document.getElementById('rg-ctx-selection-frame');
    if (!selectionFrameEl) {
      selectionFrameEl = document.createElement('div');
      selectionFrameEl.id = 'rg-ctx-selection-frame';
      selectionFrameEl.className = 'rg-ctx-selection-frame';
      selectionFrameEl.innerHTML = `
        <span class="rg-ctx-corner-handle is-tl"></span>
        <span class="rg-ctx-corner-handle is-tr"></span>
        <span class="rg-ctx-corner-handle is-bl"></span>
        <span class="rg-ctx-corner-handle is-br"></span>
      `;
      document.body.appendChild(selectionFrameEl);
    }

    const state = {
      visible: false,
      contextType: 'blueprint', // 'blueprint' | 'template'
      objectKey: 'card',
      objectName: 'Product Card',
      variant: 'media',
      activeTool: 'select',
      confirmMode: null, // 'crop' when requiring explicit Done/Cancel confirmation
      colorHex: '#9B6BFF',
      opacity: 100,
      locked: false,
      hidden: false,
      copiedStyle: null,
      anchorElement: null,
      openPopoverId: null
    };

    const getTargetDomElement = () => {
      if (state.anchorElement && document.body.contains(state.anchorElement)) {
        const rect = state.anchorElement.getBoundingClientRect();
        if (rect.width > 4 && rect.height > 4) return state.anchorElement;
      }
      if (state.contextType === 'blueprint') {
        const hoverBox = document.getElementById('magnates-bp-hover-box');
        if (hoverBox && hoverBox.style.display !== 'none') {
          const r = hoverBox.getBoundingClientRect();
          if (r.width > 4 && r.height > 4) return hoverBox;
        }
        const meta = HUMAN_OBJECT_CATALOG[state.objectKey];
        if (meta && meta.domSelector) {
          const el = document.querySelector(meta.domSelector);
          if (el) return el;
        }
        return document.getElementById('magnates-bp-stage');
      } else {
        const tfBox = document.getElementById('stage-universal-transform-box');
        if (tfBox && tfBox.style.display !== 'none') {
          const r = tfBox.getBoundingClientRect();
          if (r.width > 4 && r.height > 4) return tfBox;
        }
        return document.getElementById('tpl-modal-preview-stage');
      }
    };

    const getAvailableSceneObjects = () => {
      if (state.contextType === 'template') {
        return [
          HUMAN_OBJECT_CATALOG.text,
          HUMAN_OBJECT_CATALOG.fg,
          HUMAN_OBJECT_CATALOG.bg
        ];
      }
      return [
        HUMAN_OBJECT_CATALOG.card,
        HUMAN_OBJECT_CATALOG.printer_hero,
        HUMAN_OBJECT_CATALOG.cartridge,
        HUMAN_OBJECT_CATALOG.compatible,
        HUMAN_OBJECT_CATALOG.printer_acc,
        HUMAN_OBJECT_CATALOG.backdrop
      ];
    };

    const closeAllPopovers = () => {
      state.openPopoverId = null;
      toolbarEl.querySelectorAll('.rg-ctx-popover.is-open').forEach((p) => p.classList.remove('is-open'));
      toolbarEl.querySelectorAll('.is-open').forEach((b) => b.classList.remove('is-open'));
    };

    const updatePosition = () => {
      if (!state.visible) {
        if (selectionFrameEl) selectionFrameEl.classList.remove('is-visible');
        return;
      }

      const stageEl = state.contextType === 'blueprint'
        ? document.getElementById('magnates-bp-stage')
        : document.getElementById('tpl-modal-preview-stage');

      const isElVisible = (el) => {
        if (!el || !el.isConnected) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        const s = window.getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
        const parentModal = el.closest('.modal, [id^="modal-"]');
        if (parentModal) {
          const ms = window.getComputedStyle(parentModal);
          if (ms.display === 'none' || ms.visibility === 'hidden' || ms.opacity === '0') return false;
        }
        return true;
      };

      if (!isElVisible(stageEl)) {
        hide();
        return;
      }

      const targetEl = getTargetDomElement();
      if (!targetEl || !isElVisible(targetEl)) {
        hide();
        return;
      }

      const targetRect = targetEl.getBoundingClientRect();
      if (targetRect.width <= 0 || targetRect.height <= 0) {
        hide();
        return;
      }

      const stageRect = stageEl ? stageEl.getBoundingClientRect() : {
        left: 72,
        top: 108,
        right: window.innerWidth - 360,
        bottom: window.innerHeight - 80
      };

      // Position the 4-handle glowing purple selection frame around the selected object (unless it is the full stage backdrop)
      const isStageBackdrop = targetEl === stageEl || state.objectKey === 'backdrop' || state.objectKey === 'bg';
      if (selectionFrameEl) {
        if (!isStageBackdrop && targetRect.width > 12 && targetRect.height > 12) {
          selectionFrameEl.style.left = `${Math.round(targetRect.left)}px`;
          selectionFrameEl.style.top = `${Math.round(targetRect.top)}px`;
          selectionFrameEl.style.width = `${Math.round(targetRect.width)}px`;
          selectionFrameEl.style.height = `${Math.round(targetRect.height)}px`;
          selectionFrameEl.classList.add('is-visible');
        } else {
          selectionFrameEl.classList.remove('is-visible');
        }
      }

      const tbRect = toolbarEl.getBoundingClientRect();
      const tbWidth = tbRect.width || 520;
      const tbHeight = tbRect.height || 44;
      const margin = 14;

      // Default: center horizontally above the selected object's bounding box
      const objectCenterX = targetRect.left + (targetRect.width / 2);
      let left = objectCenterX - (tbWidth / 2);
      let top = targetRect.top - tbHeight - margin;
      let isFlippedBelow = false;

      // Collision awareness against top navigation / scene toolbar
      const minTop = Math.max(106, stageRect.top + 8);
      const maxBottom = Math.min(window.innerHeight - 64, stageRect.bottom - 54);

      if (top < minTop) {
        const belowTop = targetRect.bottom + margin;
        if (belowTop + tbHeight <= maxBottom) {
          top = belowTop;
          isFlippedBelow = true;
        } else {
          top = minTop;
        }
      }
      if (top + tbHeight > maxBottom) {
        top = Math.max(minTop, maxBottom - tbHeight);
      }

      // Collision awareness against left rail and right inspector sidebar
      const minLeft = Math.max(76, stageRect.left + 8);
      const maxRight = Math.min(window.innerWidth - 356, stageRect.right - 8);
      if (left + tbWidth > maxRight) {
        left = Math.max(minLeft, maxRight - tbWidth);
      }
      if (left < minLeft) {
        left = minLeft;
      }

      toolbarEl.style.left = `${Math.round(left)}px`;
      toolbarEl.style.top = `${Math.round(top)}px`;

      // Update pointer beak position so it points directly at the selected object's horizontal center
      const beakEl = toolbarEl.querySelector('.rg-ctx-pointer-beak');
      if (beakEl) {
        const beakLeft = Math.max(24, Math.min(tbWidth - 24, objectCenterX - left));
        beakEl.style.left = `${Math.round(beakLeft)}px`;
        beakEl.classList.toggle('is-top', isFlippedBelow);
      }

      // Flip popovers upward if toolbar is near bottom of viewport
      const flipUp = (top + tbHeight + 230) > window.innerHeight;
      toolbarEl.querySelectorAll('.rg-ctx-popover').forEach((pop) => {
        pop.classList.toggle('is-flipped-up', flipUp);
      });
    };

    const applyColorToSelectedObject = (hex) => {
      state.colorHex = hex;
      const dot = toolbarEl.querySelector('[data-role="ctx-color-dot"]');
      if (dot) dot.style.background = hex;

      if (state.contextType === 'blueprint') {
        if (typeof window.applyMagnatesBPLayerGlow === 'function') {
          window.applyMagnatesBPLayerGlow(hex);
        }
        writeDomVal('magnates-bp-printer-glow-color', hex);
        triggerBlueprintRender();
      } else {
        const target = getTargetDomElement();
        if (target) {
          if (state.objectKey === 'text') {
            const txtEl = document.getElementById('tpl-modal-preview-text');
            if (txtEl) txtEl.style.color = hex;
          } else {
            target.style.filter = `drop-shadow(0 0 18px ${hex})`;
          }
        }
      }
    };

    const applyOpacityToSelectedObject = (val) => {
      state.opacity = val;
      const domEl = (() => {
        const meta = HUMAN_OBJECT_CATALOG[state.objectKey];
        if (meta && meta.domSelector) return document.querySelector(meta.domSelector);
        return null;
      })();
      if (domEl) {
        domEl.style.opacity = String(val / 100);
      }
    };

    const executeCommand = (cmd) => {
      const meta = HUMAN_OBJECT_CATALOG[state.objectKey] || HUMAN_OBJECT_CATALOG.card;
      const domEl = meta.domSelector ? document.querySelector(meta.domSelector) : null;

      if (cmd === 'select' || cmd === 'move') {
        state.activeTool = cmd;
        state.confirmMode = null;
        renderToolbar();
        return;
      }

      if (cmd === 'rotate') {
        state.activeTool = 'rotate';
        if (domEl) {
          const curRot = parseFloat(domEl.dataset.rgRotation || '0');
          const nextRot = (curRot + 15) % 360;
          domEl.dataset.rgRotation = String(nextRot);
          domEl.style.transform = `${(domEl.style.transform || '').replace(/rotate\([^)]*\)/g, '').trim()} rotate(${nextRot}deg)`.trim();
        }
        renderToolbar();
        return;
      }

      if (cmd === 'crop') {
        state.activeTool = 'crop';
        state.confirmMode = 'crop';
        if (domEl) {
          domEl.dataset.rgPreCropClip = domEl.style.clipPath || '';
          domEl.style.clipPath = 'inset(6% 6% 6% 6% round 10px)';
        }
        renderToolbar();
        return;
      }

      if (cmd === 'confirm-done') {
        state.confirmMode = null;
        state.activeTool = 'select';
        renderToolbar();
        return;
      }

      if (cmd === 'confirm-cancel') {
        if (state.confirmMode === 'crop' && domEl) {
          domEl.style.clipPath = domEl.dataset.rgPreCropClip || '';
        }
        state.confirmMode = null;
        state.activeTool = 'select';
        renderToolbar();
        return;
      }

      if (cmd === 'replace') {
        if (state.contextType === 'blueprint') {
          const fileInput = (meta.fileInputId && document.getElementById(meta.fileInputId)) ||
            document.getElementById('magnates-bp-float-replace-input');
          if (fileInput) fileInput.click();
        } else {
          const tplFile = (meta.fileInputId && document.getElementById(meta.fileInputId)) ||
            document.getElementById('tpl-modal-fg-upload') ||
            document.getElementById('tpl-modal-bg-upload');
          if (tplFile) tplFile.click();
        }
        return;
      }

      if (cmd === 'duplicate') {
        if (state.contextType === 'blueprint' && typeof window.addMagnatesBPCustomShape === 'function') {
          window.addMagnatesBPCustomShape('rounded');
        } else if (domEl && domEl.parentElement) {
          const clone = domEl.cloneNode(true);
          clone.removeAttribute('id');
          clone.style.transform = `${domEl.style.transform || ''} translate(18px, 18px)`;
          domEl.parentElement.appendChild(clone);
        }
        return;
      }

      if (cmd === 'align') {
        if (state.contextType === 'blueprint') {
          const resetBtn = document.getElementById('btn-magnates-bp-printer-reset-pos');
          if (resetBtn) resetBtn.click();
          triggerBlueprintRender();
        } else if (domEl) {
          domEl.style.left = '50%';
          domEl.style.top = '50%';
        }
        return;
      }

      if (cmd === 'bring-forward' || cmd === 'arrange') {
        if (domEl) {
          const curZ = parseInt(window.getComputedStyle(domEl).zIndex || '10', 10) || 10;
          domEl.style.zIndex = String(curZ + 5);
        }
        closeAllPopovers();
        return;
      }

      if (cmd === 'send-backward') {
        if (domEl) {
          const curZ = parseInt(window.getComputedStyle(domEl).zIndex || '10', 10) || 10;
          domEl.style.zIndex = String(Math.max(1, curZ - 5));
        }
        closeAllPopovers();
        return;
      }

      if (cmd === 'lock-toggle') {
        state.locked = !state.locked;
        if (domEl) {
          domEl.style.pointerEvents = state.locked ? 'none' : 'auto';
        }
        closeAllPopovers();
        renderToolbar();
        return;
      }

      if (cmd === 'hide-toggle') {
        state.hidden = !state.hidden;
        if (domEl) {
          domEl.style.visibility = state.hidden ? 'hidden' : 'visible';
        }
        closeAllPopovers();
        renderToolbar();
        return;
      }

      if (cmd === 'group-toggle') {
        state.variant = state.variant === 'multi' ? (meta.variant || 'media') : 'multi';
        state.objectName = state.variant === 'multi' ? 'Grouped Objects' : meta.name;
        closeAllPopovers();
        renderToolbar();
        return;
      }

      if (cmd === 'copy-style') {
        state.copiedStyle = {
          colorHex: state.colorHex,
          opacity: state.opacity,
          quickStyle: getBpParams().printerCardQuickStyle || 'clean'
        };
        closeAllPopovers();
        return;
      }

      if (cmd === 'paste-style') {
        if (state.copiedStyle) {
          applyColorToSelectedObject(state.copiedStyle.colorHex);
          applyOpacityToSelectedObject(state.copiedStyle.opacity);
        }
        closeAllPopovers();
        return;
      }

      if (cmd === 'delete') {
        if (state.objectKey === 'card') {
          const remBtn = document.querySelector('[data-action="remove-card-image"]');
          if (remBtn) remBtn.click();
        } else if (domEl) {
          domEl.style.visibility = 'hidden';
        }
        closeAllPopovers();
        hide();
      }
    };

    const renderToolbar = () => {
      const schema = TOOLBAR_VARIANT_SCHEMAS[state.variant] || TOOLBAR_VARIANT_SCHEMAS.media;
      const meta = HUMAN_OBJECT_CATALOG[state.objectKey] || HUMAN_OBJECT_CATALOG.card;
      const availableObjects = getAvailableSceneObjects();
      const activeQuickStyle = (getBpParams && getBpParams().printerCardQuickStyle) || 'clean';

      const toolButtonMap = {
        select: { id: 'select', label: 'Select (V)', icon: LUCIDE_ICONS.cursorSelect },
        move: { id: 'move', label: 'Move', icon: LUCIDE_ICONS.move },
        rotate: { id: 'rotate', label: 'Rotate 15°', icon: LUCIDE_ICONS.rotate },
        crop: { id: 'crop', label: 'Crop', icon: LUCIDE_ICONS.crop },
        duplicate: { id: 'duplicate', label: 'Duplicate (⌘D)', icon: LUCIDE_ICONS.duplicate },
        align: { id: 'align', label: 'Align Center', icon: LUCIDE_ICONS.alignCenter },
        arrange: { id: 'arrange', label: 'Arrange Depth', icon: LUCIDE_ICONS.arrangeLayers }
      };

      const primaryButtonsHtml = schema.primaryTools.map((toolKey) => {
        const def = toolButtonMap[toolKey];
        if (!def) return '';
        const isActive = state.activeTool === def.id;
        return `
          <button type="button" class="rg-ctx-tool-btn ${isActive ? 'is-active' : ''}" data-ctx-cmd="${def.id}" title="${def.label}" aria-label="${def.label}">
            ${def.icon}
          </button>
        `;
      }).join('');

      const quickPropsHtml = `
        ${schema.quickProps.includes('replace') ? `
          <button type="button" class="rg-ctx-prop-btn" data-ctx-cmd="replace" title="Replace Media">
            ${LUCIDE_ICONS.imageIcon}
            <span>Replace</span>
          </button>
        ` : ''}
        <div class="rg-ctx-identity-wrap">
          <button type="button" class="rg-ctx-prop-btn" data-ctx-popover-trigger="color" title="Object Accent & Glow Color">
            <span class="rg-ctx-color-dot" data-role="ctx-color-dot" style="background:${state.colorHex};"></span>
            <span>Color</span>
          </button>
          <div class="rg-ctx-popover" data-ctx-popover="color">
            <div class="rg-ctx-popover-header">Object Accent & Glow</div>
            <div class="rg-ctx-swatch-grid">
              ${['#9B6BFF', '#823CF0', '#38bdf8', '#f97316', '#22c55e', '#ffffff'].map((hex) => `
                <button type="button" class="rg-ctx-swatch-btn ${state.colorHex.toLowerCase() === hex.toLowerCase() ? 'is-active' : ''}" style="background:${hex};" data-ctx-swatch="${hex}" title="${hex}"></button>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="rg-ctx-identity-wrap">
          <button type="button" class="rg-ctx-prop-btn" data-ctx-popover-trigger="style" title="Quick Style & Opacity">
            <span class="rg-ctx-aa-prefix">Aa</span>
            <span>Style</span>
          </button>
          <div class="rg-ctx-popover is-right" data-ctx-popover="style">
            <div class="rg-ctx-popover-header">Quick Style Preset</div>
            ${[
              { id: 'clean', label: 'Clean Surface' },
              { id: 'glass', label: 'Frosted Glass' },
              { id: 'glow', label: 'Purple Rim Glow' },
              { id: 'outline', label: 'Crisp Outline' }
            ].map((st) => `
              <button type="button" class="rg-ctx-menu-item ${activeQuickStyle === st.id ? 'is-selected' : ''}" data-ctx-quick-style="${st.id}">
                <span class="rg-ctx-menu-item-left">
                  ${LUCIDE_ICONS.effectsTab}
                  <span>${st.label}</span>
                </span>
                ${activeQuickStyle === st.id ? `<span class="rg-ctx-menu-kbd">✓</span>` : ''}
              </button>
            `).join('')}
            <div class="rg-ctx-menu-sep"></div>
            <div class="rg-ctx-mini-slider-wrap">
              <div class="rg-ctx-mini-slider-head">
                <span>Layer Opacity</span>
                <span data-role="ctx-opacity-val">${state.opacity}%</span>
              </div>
              <input type="range" class="rg-range" min="10" max="100" step="5" value="${state.opacity}" data-role="ctx-opacity-slider">
            </div>
            <div class="rg-ctx-menu-sep"></div>
            <button type="button" class="rg-ctx-menu-item" data-ctx-focus-inspector="look">
              <span class="rg-ctx-menu-item-left">
                ${LUCIDE_ICONS.lookTab}
                <span>Open Look Inspector</span>
              </span>
              <span class="rg-ctx-menu-kbd">→</span>
            </button>
          </div>
        </div>
      `;

      const confirmGroupHtml = state.confirmMode ? `
        <div class="rg-ctx-divider"></div>
        <div class="rg-ctx-confirm-group">
          <button type="button" class="rg-ctx-confirm-btn is-done" data-ctx-cmd="confirm-done">
            ${LUCIDE_ICONS.check}
            <span>Done</span>
          </button>
          <button type="button" class="rg-ctx-confirm-btn is-cancel" data-ctx-cmd="confirm-cancel">
            <span>Cancel</span>
          </button>
        </div>
      ` : '';

      toolbarEl.innerHTML = `
        <span class="rg-ctx-pointer-beak" aria-hidden="true"></span>

        <!-- 1. OBJECT IDENTITY -->
        <div class="rg-ctx-section rg-ctx-identity-wrap">
          <button type="button" class="rg-ctx-identity-btn" data-ctx-popover-trigger="identity" title="Switch Selected Object">
            <span class="rg-ctx-identity-icon">${meta.icon || LUCIDE_ICONS.layers}</span>
            <span class="rg-ctx-identity-label">${state.objectName}</span>
            <span class="rg-ctx-identity-caret">${LUCIDE_ICONS.chevronDown}</span>
          </button>
          <div class="rg-ctx-popover" data-ctx-popover="identity">
            <div class="rg-ctx-popover-header">Scene Objects</div>
            ${availableObjects.map((obj) => `
              <button type="button" class="rg-ctx-menu-item ${obj.id === state.objectKey ? 'is-selected' : ''}" data-ctx-switch-object="${obj.id}">
                <span class="rg-ctx-menu-item-left">
                  ${obj.icon}
                  <span>${obj.name}</span>
                </span>
                ${obj.id === state.objectKey ? `<span class="rg-ctx-menu-kbd">Active</span>` : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="rg-ctx-divider"></div>

        <!-- 2. PRIMARY TOOLS (Select, Move, Rotate, Crop, Duplicate) -->
        <div class="rg-ctx-section">
          ${primaryButtonsHtml}
        </div>

        <div class="rg-ctx-divider"></div>

        <!-- 3. QUICK PROPERTIES & OVERFLOW (Replace, Color, Aa Style, More) -->
        <div class="rg-ctx-section">
          ${quickPropsHtml}
          <div class="rg-ctx-identity-wrap">
            <button type="button" class="rg-ctx-tool-btn" data-ctx-popover-trigger="more" title="More Actions" aria-label="More Actions">
              ${LUCIDE_ICONS.moreHorizontal}
            </button>
            <div class="rg-ctx-popover is-right" data-ctx-popover="more">
              <button type="button" class="rg-ctx-menu-item" data-ctx-cmd="lock-toggle">
                <span class="rg-ctx-menu-item-left">
                  ${state.locked ? LUCIDE_ICONS.unlock : LUCIDE_ICONS.lock}
                  <span>${state.locked ? 'Unlock Object' : 'Lock Object'}</span>
                </span>
                <span class="rg-ctx-menu-kbd">⌘L</span>
              </button>
              <button type="button" class="rg-ctx-menu-item" data-ctx-cmd="hide-toggle">
                <span class="rg-ctx-menu-item-left">
                  ${state.hidden ? LUCIDE_ICONS.eye : LUCIDE_ICONS.eyeOff}
                  <span>${state.hidden ? 'Show Object' : 'Hide Object'}</span>
                </span>
                <span class="rg-ctx-menu-kbd">⌘H</span>
              </button>
              <button type="button" class="rg-ctx-menu-item" data-ctx-cmd="group-toggle">
                <span class="rg-ctx-menu-item-left">
                  ${LUCIDE_ICONS.layers}
                  <span>${state.variant === 'multi' ? 'Ungroup Objects' : 'Group Selection'}</span>
                </span>
                <span class="rg-ctx-menu-kbd">⌘G</span>
              </button>
              <div class="rg-ctx-menu-sep"></div>
              <button type="button" class="rg-ctx-menu-item" data-ctx-cmd="bring-forward">
                <span class="rg-ctx-menu-item-left">
                  ${LUCIDE_ICONS.arrangeLayers}
                  <span>Bring Forward</span>
                </span>
                <span class="rg-ctx-menu-kbd">]</span>
              </button>
              <button type="button" class="rg-ctx-menu-item" data-ctx-cmd="send-backward">
                <span class="rg-ctx-menu-item-left">
                  ${LUCIDE_ICONS.arrangeLayers}
                  <span>Send Backward</span>
                </span>
                <span class="rg-ctx-menu-kbd">[</span>
              </button>
              <div class="rg-ctx-menu-sep"></div>
              <button type="button" class="rg-ctx-menu-item" data-ctx-cmd="copy-style">
                <span class="rg-ctx-menu-item-left">
                  ${LUCIDE_ICONS.duplicate}
                  <span>Copy Style</span>
                </span>
                <span class="rg-ctx-menu-kbd">⌥⌘C</span>
              </button>
              <button type="button" class="rg-ctx-menu-item" data-ctx-cmd="paste-style">
                <span class="rg-ctx-menu-item-left">
                  ${LUCIDE_ICONS.wand}
                  <span>Paste Style</span>
                </span>
                <span class="rg-ctx-menu-kbd">⌥⌘V</span>
              </button>
              <div class="rg-ctx-menu-sep"></div>
              <button type="button" class="rg-ctx-menu-item is-destructive" data-ctx-cmd="delete">
                <span class="rg-ctx-menu-item-left">
                  ${LUCIDE_ICONS.trash}
                  <span>Delete</span>
                </span>
                <span class="rg-ctx-menu-kbd">⌫</span>
              </button>
            </div>
          </div>
        </div>

        ${confirmGroupHtml}
      `;

      // Bind popover toggles
      toolbarEl.querySelectorAll('[data-ctx-popover-trigger]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const popId = btn.getAttribute('data-ctx-popover-trigger');
          const popEl = toolbarEl.querySelector(`[data-ctx-popover="${popId}"]`);
          const wasOpen = popEl && popEl.classList.contains('is-open');
          closeAllPopovers();
          if (popEl && !wasOpen) {
            state.openPopoverId = popId;
            popEl.classList.add('is-open');
            btn.classList.add('is-open');
            updatePosition();
          }
        });
      });

      // Bind object switcher items
      toolbarEl.querySelectorAll('[data-ctx-switch-object]').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const nextKey = item.getAttribute('data-ctx-switch-object');
          closeAllPopovers();
          if (state.contextType === 'blueprint' && typeof window.selectMagnatesBPLayer === 'function') {
            window.selectMagnatesBPLayer(nextKey);
          } else if (state.contextType === 'template' && typeof window.selectTplStageTarget === 'function') {
            window.selectTplStageTarget(nextKey);
          } else {
            showForObject({ contextType: state.contextType, objectKey: nextKey });
          }
        });
      });

      // Bind command buttons
      toolbarEl.querySelectorAll('[data-ctx-cmd]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const cmd = btn.getAttribute('data-ctx-cmd');
          if (cmd) executeCommand(cmd);
        });
      });

      // Bind color swatches
      toolbarEl.querySelectorAll('[data-ctx-swatch]').forEach((sw) => {
        sw.addEventListener('click', (e) => {
          e.stopPropagation();
          const hex = sw.getAttribute('data-ctx-swatch');
          if (hex) {
            applyColorToSelectedObject(hex);
            closeAllPopovers();
          }
        });
      });

      // Bind Quick Style preset items inside Aa Style popover
      toolbarEl.querySelectorAll('[data-ctx-quick-style]').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const presetId = item.getAttribute('data-ctx-quick-style');
          if (presetId) {
            const inspStyleBtn = document.querySelector(`.rg-style-card[data-style-preset="${presetId}"]`);
            if (inspStyleBtn) {
              inspStyleBtn.click();
            } else {
              getBpParams().printerCardQuickStyle = presetId;
              triggerBlueprintRender();
            }
            closeAllPopovers();
            renderToolbar();
          }
        });
      });

      // Bind opacity mini-slider inside Aa Style popover
      const opSlider = toolbarEl.querySelector('[data-role="ctx-opacity-slider"]');
      const opValSpan = toolbarEl.querySelector('[data-role="ctx-opacity-val"]');
      if (opSlider) {
        opSlider.addEventListener('input', (e) => {
          e.stopPropagation();
          const v = parseInt(opSlider.value || '100', 10);
          if (opValSpan) opValSpan.textContent = `${v}%`;
          applyOpacityToSelectedObject(v);
        });
      }

      // Bind Inspector tab focus shortcuts
      toolbarEl.querySelectorAll('[data-ctx-focus-inspector]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tabId = btn.getAttribute('data-ctx-focus-inspector');
          closeAllPopovers();
          const tabBtn = document.querySelector(`.rg-inspector-tab[data-tab="${tabId}"]`);
          if (tabBtn) tabBtn.click();
        });
      });

      requestAnimationFrame(updatePosition);
    };

    const showForObject = (opts) => {
      const key = (opts && opts.objectKey) ? String(opts.objectKey).toLowerCase() : 'card';
      const meta = HUMAN_OBJECT_CATALOG[key] || {
        id: key,
        name: humanizeLayerName((opts && opts.label) || key),
        variant: 'media',
        icon: LUCIDE_ICONS.layers
      };

      state.visible = true;
      state.contextType = (opts && opts.contextType) || 'blueprint';
      state.objectKey = key;
      state.objectName = meta.name || humanizeLayerName((opts && opts.label) || key);
      state.variant = (opts && opts.variant) || meta.variant || 'media';
      state.anchorElement = (opts && opts.anchorElement) || null;
      state.confirmMode = null;

      // Rewrite any selection box hover badge so engineering Z=3 // ... strings never appear
      const bpHoverTag = document.getElementById('magnates-bp-hover-tag');
      if (bpHoverTag) bpHoverTag.textContent = state.objectName;
      const tplHoverTag = document.getElementById('stage-tf-label');
      if (tplHoverTag) tplHoverTag.textContent = state.objectName;

      document.body.classList.add('rg-ctx-toolbar-active');
      toolbarEl.classList.add('is-visible');
      renderToolbar();
    };

    const hide = () => {
      state.visible = false;
      state.confirmMode = null;
      closeAllPopovers();
      document.body.classList.remove('rg-ctx-toolbar-active');
      toolbarEl.classList.remove('is-visible');
      if (selectionFrameEl) selectionFrameEl.classList.remove('is-visible');
    };

    // Global dismissal via Escape or clicking outside the selected object & toolbar
    document.addEventListener('keydown', (e) => {
      if (!state.visible) return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;

      if (e.key === 'Escape') {
        if (state.openPopoverId) {
          closeAllPopovers();
          return;
        }
        if (state.confirmMode) {
          executeCommand('confirm-cancel');
          return;
        }
        if (state.contextType === 'blueprint' && typeof window.deselectMagnatesBPLayer === 'function') {
          window.deselectMagnatesBPLayer();
        }
        hide();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        executeCommand('duplicate');
      } else if (e.key === ']') {
        executeCommand('bring-forward');
      } else if (e.key === '[') {
        executeCommand('send-backward');
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!state.visible) return;
      if (toolbarEl.contains(e.target)) return;
      if (state.openPopoverId) {
        closeAllPopovers();
      }
      // If clicking on empty canvas background outside any interactive object or inspector, exit selection cleanly
      const inInspector = e.target.closest('.rg-inspector-shell, .rg-global-topbar, .rg-left-rail, .rg-scene-toolbar');
      if (inInspector) return;
      const bpStage = document.getElementById('magnates-bp-stage');
      if (bpStage && e.target === bpStage) {
        if (typeof window.deselectMagnatesBPLayer === 'function') {
          window.deselectMagnatesBPLayer();
        }
        hide();
      }
    });

    window.addEventListener('resize', () => {
      if (state.visible) requestAnimationFrame(updatePosition);
    }, { passive: true });

    document.addEventListener('scroll', () => {
      if (state.visible) requestAnimationFrame(updatePosition);
    }, { passive: true, capture: true });

    const controller = {
      showForObject,
      hide,
      updatePosition,
      executeCommand,
      getState: () => ({ ...state })
    };

    toolbarEl._rgController = controller;
    window.RegaarderContextualToolbar = controller;
    return controller;
  }

  function bindUniversalContextualToolbarHooks() {
    const toolbar = createUniversalContextualToolbar();

    // 1. Wrap window.highlightMagnatesBPLayerOnStage so hover tags always use human-readable object names
    if (typeof window.highlightMagnatesBPLayerOnStage === 'function' && !window.highlightMagnatesBPLayerOnStage._rgCtxWrapped) {
      const origHighlight = window.highlightMagnatesBPLayerOnStage;
      const wrappedHighlight = function (layerKey, active) {
        const res = origHighlight.apply(this, arguments);
        const hoverTag = document.getElementById('magnates-bp-hover-tag');
        if (hoverTag && layerKey) {
          hoverTag.textContent = humanizeLayerName(layerKey);
        }
        if (active && window.magnatesBPSelectedLayer) {
          toolbar.updatePosition();
        }
        return res;
      };
      wrappedHighlight._rgCtxWrapped = true;
      window.highlightMagnatesBPLayerOnStage = wrappedHighlight;
    }

    // 2. Wrap window.selectMagnatesBPLayer to summon the Universal Contextual Toolbar
    if (typeof window.selectMagnatesBPLayer === 'function' && !window.selectMagnatesBPLayer._rgCtxWrapped) {
      const origSelect = window.selectMagnatesBPLayer;
      const wrappedSelect = function (layerKey) {
        const res = origSelect.apply(this, arguments);
        if (layerKey) {
          toolbar.showForObject({
            contextType: 'blueprint',
            objectKey: layerKey
          });
        } else {
          toolbar.hide();
        }
        return res;
      };
      wrappedSelect._rgCtxWrapped = true;
      window.selectMagnatesBPLayer = wrappedSelect;
    }

    // 3. Wrap window.deselectMagnatesBPLayer to hide the Universal Contextual Toolbar
    if (typeof window.deselectMagnatesBPLayer === 'function' && !window.deselectMagnatesBPLayer._rgCtxWrapped) {
      const origDeselect = window.deselectMagnatesBPLayer;
      const wrappedDeselect = function () {
        const res = origDeselect.apply(this, arguments);
        toolbar.hide();
        return res;
      };
      wrappedDeselect._rgCtxWrapped = true;
      window.deselectMagnatesBPLayer = wrappedDeselect;
    }

    // 4. Wrap window.selectTplStageTarget (Universal Template Customizer stage) to summon the Universal Contextual Toolbar
    if (typeof window.selectTplStageTarget === 'function' && !window.selectTplStageTarget._rgCtxWrapped) {
      const origTplSelect = window.selectTplStageTarget;
      const wrappedTplSelect = function (targetType) {
        const res = origTplSelect.apply(this, arguments);
        const tfLabel = document.getElementById('stage-tf-label');
        if (tfLabel) tfLabel.textContent = humanizeLayerName(targetType);
        if (targetType) {
          toolbar.showForObject({
            contextType: 'template',
            objectKey: targetType
          });
        } else {
          toolbar.hide();
        }
        return res;
      };
      wrappedTplSelect._rgCtxWrapped = true;
      window.selectTplStageTarget = wrappedTplSelect;
    }

    // 5. Reposition toolbar during pointer drag on stage
    if (!window._rgCtxStageDragObserverBound) {
      window._rgCtxStageDragObserverBound = true;
      window.addEventListener('mousemove', () => {
        if (window.RegaarderContextualToolbar && window.RegaarderContextualToolbar.getState().visible) {
          window.RegaarderContextualToolbar.updatePosition();
        }
      }, { passive: true });
    }

    // 6. Global Navigation & Modal Visibility Watchers — Hide Toolbar when leaving player or navigating to Home
    if (!window._rgCtxGlobalDismissBound) {
      window._rgCtxGlobalDismissBound = true;

      const dismissAllContextualUI = () => {
        if (window.RegaarderContextualToolbar) {
          window.RegaarderContextualToolbar.hide();
        }
        if (typeof window.deselectMagnatesBPLayer === 'function') {
          window.deselectMagnatesBPLayer();
        }
        const calloutSvg = document.getElementById('rg-layer-callout-svg');
        if (calloutSvg) calloutSvg.classList.remove('is-visible');
        const minicardPortal = document.getElementById('rg-layer-hover-minicard-portal');
        if (minicardPortal) minicardPortal.classList.remove('is-visible');
      };

      // Watch for clicks on any back, home, brand, close, or navigation button
      document.addEventListener('click', (e) => {
        const navTarget = e.target.closest(
          '[data-action="back"], [data-action="close-to-home"], [data-action="corner-home"], ' +
          '[data-rail="home"], #btn-close-magnates-bp-suite, #btn-close-tpl-customizer, ' +
          '.brand, .brand-logo-svg, .top-nav .brand, #nav-home, #btn-home, #btn-back-to-home, ' +
          '.rg-back-btn, .modal-close, [data-modal-close], .btn-close'
        );
        if (navTarget) {
          dismissAllContextualUI();
        }
      }, true);

      // Watch for browser history / route changes
      window.addEventListener('popstate', dismissAllContextualUI);
      window.addEventListener('hashchange', dismissAllContextualUI);

      // MutationObserver on modals to detect when any editor modal is hidden or dismissed
      const modalObserver = new MutationObserver(() => {
        if (window.RegaarderContextualToolbar && window.RegaarderContextualToolbar.getState().visible) {
          window.RegaarderContextualToolbar.updatePosition();
        }
      });

      ['modal-magnates-paper-blueprint-suite', 'modal-top-template-customizer'].forEach((id) => {
        const m = document.getElementById(id);
        if (m) {
          modalObserver.observe(m, { attributes: true, attributeFilter: ['style', 'class'] });
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. BOOTSTRAP & LIFECYCLE HOOKS
     -------------------------------------------------------------------------- */
  function initRegaarderRedesign() {
    if (typeof EFFECT_TEMPLATES_DATA !== 'undefined' && Array.isArray(EFFECT_TEMPLATES_DATA)) {
      if (!EFFECT_TEMPLATES_DATA.some((t) => t.id === 'jani-cinematic-letterbox')) {
        EFFECT_TEMPLATES_DATA.splice(3, 0, {
          id: 'jani-cinematic-letterbox',
          title: 'James Jani Cinematic Letterbox & Lower Caption Frame',
          category: 'Documentary',
          badge: 'JANI CINEMATIC',
          description: 'Centered photo or video framing with customizable letterbox matte bars and lower caption.',
          defaultImage: '/jani_cinematic_letterbox_ref.png',
          timeToApply: '6 sec',
          tags: ['James Jani', 'Letterbox', 'Caption', 'Cinematic']
        });
      }
    }

    mountMagnatesBlueprintRedesign();
    mountUniversalTemplateCustomizerShell();
    bindStealthRedScrollbars();
    bindUniversalContextualToolbarHooks();
    initLayerHoverMiniCardPortal();

    // Hook window.openMagnatesPaperBlueprintSuite so opening any of the 6 scenes syncs the title, counter, and inspector
    if (typeof window.openMagnatesPaperBlueprintSuite === 'function' && !window.openMagnatesPaperBlueprintSuite._rgWrapped) {
      const origOpenBp = window.openMagnatesPaperBlueprintSuite;
      const wrappedOpenBp = function (initialPresetKey) {
        const res = origOpenBp.apply(this, arguments);
        setTimeout(() => {
          bindStealthRedScrollbars();
          bindUniversalContextualToolbarHooks();
          if (typeof syncBlueprintSceneUIRef === 'function') {
            syncBlueprintSceneUIRef(initialPresetKey || 'printer_glitch_card');
          }
        }, 25);
        return res;
      };
      wrappedOpenBp._rgWrapped = true;
      window.openMagnatesPaperBlueprintSuite = wrappedOpenBp;
    }

    // Hook window.openTopTemplateCustomizer so we organize controls AFTER app.js toggles all template-specific sections
    if (typeof window.openTopTemplateCustomizer === 'function' && !window.openTopTemplateCustomizer._rgWrapped) {
      const origOpen = window.openTopTemplateCustomizer;
      const wrappedOpen = function () {
        restoreDistributedNodes();
        const res = origOpen.apply(this, arguments);
        setTimeout(() => {
          organizeUniversalTemplateControls();
          bindStealthRedScrollbars();
          bindUniversalContextualToolbarHooks();
        }, 15);
        return res;
      };
      wrappedOpen._rgWrapped = true;
      window.openTopTemplateCustomizer = wrappedOpen;
    }

    // Hook window.tplRenderContextualInspector for sub-mode re-renders
    if (typeof window.tplRenderContextualInspector === 'function' && !window.tplRenderContextualInspector._rgWrapped) {
      const origRender = window.tplRenderContextualInspector;
      const wrappedRender = function () {
        restoreDistributedNodes();
        const res = origRender.apply(this, arguments);
        setTimeout(() => {
          organizeUniversalTemplateControls();
          bindStealthRedScrollbars();
          bindUniversalContextualToolbarHooks();
        }, 20);
        return res;
      };
      wrappedRender._rgWrapped = true;
      window.tplRenderContextualInspector = wrappedRender;
    }

    // Override populateModalTemplatesSidebar so #modal-tpl-sidebar-drawer always uses the 2-column Templates Library UI
    window.populateModalTemplatesSidebar = function () {
      const drawer = document.getElementById('modal-tpl-sidebar-drawer');
      if (drawer && typeof window.rgRenderUnifiedTemplatesLibrary === 'function') {
        window.rgRenderUnifiedTemplatesLibrary(drawer, {
          getActiveTemplateId: () => (window.activeTopTemplateObj && window.activeTopTemplateObj.id) || 'jani-cinematic-letterbox',
          onSelectTemplate: (tplId, tpl) => {
            if (typeof window.modalSelectTemplateCard === 'function') {
              window.modalSelectTemplateCard(tplId);
            } else if (tpl && typeof window.openTopTemplateCustomizer === 'function') {
              window.openTopTemplateCustomizer(tpl);
            }
          }
        });
      }
    };

    // Upgrade all standalone suite modals
    STANDALONE_SUITE_MODAL_IDS.forEach((id) => {
      const m = document.getElementById(id);
      if (m) upgradeStandaloneSuiteModal(m);
    });
  }

  /* --------------------------------------------------------------------------
     SCENE STAGE LAYERS — PURE IMAGE-ONLY HOVER PREVIEW + BALANCE SHEET CALLOUT LINE
     When hovering any .rg-media-asset-row in Scene Stage Layers, pops up a
     pure image-only preview card (zero text/titles) connected directly to the
     hovered thumbnail via a Balance Sheet-style angled leader line & glowing dot.
     -------------------------------------------------------------------------- */
  function initLayerHoverMiniCardPortal() {
    if (document.getElementById('rg-layer-hover-minicard-portal')) return;

    const calloutSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    calloutSvg.id = 'rg-layer-callout-svg';
    calloutSvg.setAttribute('class', 'rg-layer-callout-svg');
    calloutSvg.innerHTML = `
      <defs>
        <filter id="rgCalloutGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path data-role="callout-path-glow" d="" fill="none" stroke="rgba(168, 85, 247, 0.35)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path data-role="callout-path" d="" fill="none" stroke="#A855F7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#rgCalloutGlow)"></path>
      <circle data-role="callout-origin-halo" cx="0" cy="0" r="7.5" fill="rgba(168, 85, 247, 0.28)"></circle>
      <circle data-role="callout-origin-dot" cx="0" cy="0" r="4" fill="#C084FC" stroke="#FFFFFF" stroke-width="1.2" filter="url(#rgCalloutGlow)"></circle>
      <circle data-role="callout-target-dot" cx="0" cy="0" r="2.8" fill="#A855F7"></circle>
    `;
    document.body.appendChild(calloutSvg);

    const portal = document.createElement('div');
    portal.id = 'rg-layer-hover-minicard-portal';
    portal.className = 'rg-layer-hover-minicard';
    portal.innerHTML = `
      <button type="button" class="rg-layer-minicard-dismiss" data-role="minicard-dismiss" title="Dismiss preview">&#x2715;</button>
      <div class="rg-layer-minicard-stage" data-role="minicard-stage">
        <img data-role="minicard-img" src="" alt="" />
        <div data-role="minicard-svg" style="display:none;color:#C4B5FD;transform:scale(2.2);"></div>
      </div>
    `;
    document.body.appendChild(portal);

    let activeRow = null;
    let dismissedRow = null;
    let hideTimer = null;

    const imgEl = portal.querySelector('[data-role="minicard-img"]');
    const svgEl = portal.querySelector('[data-role="minicard-svg"]');
    const dismissBtn = portal.querySelector('[data-role="minicard-dismiss"]');

    const pathGlowEl = calloutSvg.querySelector('[data-role="callout-path-glow"]');
    const pathEl = calloutSvg.querySelector('[data-role="callout-path"]');
    const originHaloEl = calloutSvg.querySelector('[data-role="callout-origin-halo"]');
    const originDotEl = calloutSvg.querySelector('[data-role="callout-origin-dot"]');
    const targetDotEl = calloutSvg.querySelector('[data-role="callout-target-dot"]');

    function hideMiniCardImmediate() {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      portal.classList.remove('is-visible');
      calloutSvg.classList.remove('is-visible');
      activeRow = null;
    }

    function positionPortalAndCallout(row) {
      const thumbEl = row.querySelector('.rg-media-asset-thumb, .rg-media-asset-icon') || row;
      const thumbRect = thumbEl.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();

      const cardW = 152;
      const cardH = 152;
      const gapX = 56; // Horizontal breathing room for the Balance Sheet angled leader line

      // Place floating image card to the left of the inspector row, slightly elevated so the 45-degree elbow line angles cleanly like the Balance Sheet callout
      let cardLeft = Math.round(rowRect.left - cardW - gapX);
      let cardTop = Math.round(thumbRect.top + (thumbRect.height / 2) - (cardH / 2) - 18);

      if (cardLeft < 16) {
        // Fallback if near left edge of viewport: place directly over the thumbnail
        cardLeft = Math.round(thumbRect.left);
        cardTop = Math.round(thumbRect.top - cardH - 12);
      }
      if (cardTop < 16) cardTop = 16;
      if (cardTop + cardH > window.innerHeight - 16) {
        cardTop = window.innerHeight - cardH - 16;
      }

      portal.style.left = `${cardLeft}px`;
      portal.style.top = `${cardTop}px`;

      // Anchor point on the hovered thumbnail (left-center edge of the thumbnail)
      const ax = Math.round(thumbRect.left + 2);
      const ay = Math.round(thumbRect.top + thumbRect.height / 2);

      // Connection point on the right edge of the floating image preview card
      const cx = cardLeft + cardW;
      const cy = Math.round(cardTop + cardH * 0.5);

      if (cardLeft + cardW <= rowRect.left) {
        // Balance Sheet 2-segment angled leader line:
        // From thumbnail glowing dot (ax, ay) -> diagonal segment to elbow (ex, cy) -> horizontal segment to card right edge (cx, cy)
        const ex = Math.round(cx + Math.min(26, Math.max(14, (ax - cx) * 0.42)));
        const d = `M ${ax} ${ay} L ${ex} ${cy} L ${cx} ${cy}`;

        pathGlowEl.setAttribute('d', d);
        pathEl.setAttribute('d', d);
        originHaloEl.setAttribute('cx', String(ax));
        originHaloEl.setAttribute('cy', String(ay));
        originDotEl.setAttribute('cx', String(ax));
        originDotEl.setAttribute('cy', String(ay));
        targetDotEl.setAttribute('cx', String(cx));
        targetDotEl.setAttribute('cy', String(cy));

        calloutSvg.classList.add('is-visible');
      } else {
        calloutSvg.classList.remove('is-visible');
      }
    }

    function showMiniCardForRow(row) {
      if (row === dismissedRow) return;
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      activeRow = row;

      const thumbImg = row.querySelector('.rg-media-asset-thumb');
      const iconBox = row.querySelector('.rg-media-asset-icon');

      if (thumbImg && thumbImg.getAttribute('src')) {
        imgEl.src = thumbImg.getAttribute('src');
        imgEl.style.display = 'block';
        svgEl.style.display = 'none';
      } else if (iconBox) {
        imgEl.style.display = 'none';
        svgEl.innerHTML = iconBox.innerHTML;
        svgEl.style.display = 'flex';
      } else {
        imgEl.src = '/printer_card_thumb.png';
        imgEl.style.display = 'block';
        svgEl.style.display = 'none';
      }

      positionPortalAndCallout(row);
      portal.classList.add('is-visible');
    }

    function scheduleHideMiniCard() {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        portal.classList.remove('is-visible');
        calloutSvg.classList.remove('is-visible');
        activeRow = null;
      }, 90);
    }

    document.addEventListener('mouseover', (e) => {
      const row = e.target.closest('.rg-media-asset-row');
      if (row) {
        showMiniCardForRow(row);
      } else if (e.target.closest('#rg-layer-hover-minicard-portal')) {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const leavingRow = e.target.closest('.rg-media-asset-row');
      const leavingPortal = e.target.closest('#rg-layer-hover-minicard-portal');
      if (leavingRow || leavingPortal) {
        const toEl = e.relatedTarget;
        if (toEl && (toEl.closest('.rg-media-asset-row') === activeRow || toEl.closest('#rg-layer-hover-minicard-portal'))) {
          return;
        }
        if (leavingRow && (!toEl || toEl.closest('.rg-media-asset-row') !== leavingRow)) {
          dismissedRow = null;
        }
        scheduleHideMiniCard();
      }
    });

    // Dismiss button click or clicking the preview card itself
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissedRow = activeRow;
        hideMiniCardImmediate();
      });
    }

    portal.addEventListener('click', (e) => {
      if (e.target.closest('[data-role="minicard-dismiss"]')) return;
      dismissedRow = activeRow;
      hideMiniCardImmediate();
    });

    // Hide on scroll, Escape key, or modal close
    document.addEventListener('scroll', () => {
      if (portal.classList.contains('is-visible')) {
        hideMiniCardImmediate();
      }
    }, true);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && portal.classList.contains('is-visible')) {
        dismissedRow = activeRow;
        hideMiniCardImmediate();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initRegaarderRedesign, 60));
  } else {
    setTimeout(initRegaarderRedesign, 60);
  }
})();
