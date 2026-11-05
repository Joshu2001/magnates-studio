/**
 * ============================================================================
 * REGAARDER STUDIO — STORY CONTEXT & AI PROMPTS STUDIO
 * ============================================================================
 * Ported from Regaarder-Motion (story-context.js, semantic-context.json)
 * into Magnates Studio's unified stage, 4-Tab Contextual Inspector,
 * and design system tokens.
 * ============================================================================
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'motion-story-context';

  const DEFAULT_STORY_CONTEXT = {
    transcript: '',
    transcriptStatus: 'awaiting-user-transcript',
    notes: 'Documentary sequence narration and prompt provenance tracking.',
    shots: [
      {
        id: 'origins-map-pan',
        scene: 'Scene 01: Aerial Bavaria',
        localStart: 0,
        localEnd: 5.8,
        assets: ['map', 'adidasBars', 'pumaLogo'],
        narration: 'Herzogenaurach. A small town in Bavaria split by a river and two brothers.',
        intent: 'Establish the geographic cradle of the rivalry before revealing the founders.',
        metaphor: 'Slow aerial cartography drifting forward into brand heraldry.',
        soundCue: 'Muffled village bell, distant river flow, followed by sharp cinematic low rumble.',
        status: 'accepted'
      },
      {
        id: 'origins-portrait-reveal',
        scene: 'Scene 02: Eye Strip & Tears',
        localStart: 5.8,
        localEnd: 15.2,
        assets: ['portrait', 'reveal'],
        narration: 'Beneath the trademark stripes lay decades of unresolved grievance.',
        intent: 'Pivot from corporate identities to human emotional animus.',
        metaphor: 'Organic paper tears tearing open the archival sepia face.',
        soundCue: 'Paper fiber tearing sound design with rising tape-loop cello.',
        status: 'accepted'
      },
      {
        id: 'origins-fire-lamp',
        scene: 'Scene 03: Living Fire & Desk Lamp',
        localStart: 15.2,
        localEnd: 24.0,
        assets: ['shoulder', 'deskLamp', 'flameShader'],
        narration: 'War contracts and competing workshop orders fueled an inextinguishable flame.',
        intent: 'Visually manifest the escalating feud through ambient fire and stark desk lighting.',
        metaphor: 'Warm incandescent light fighting against living procedural fire.',
        soundCue: 'Open furnace crackle, typewriter staccato, low synth drone.',
        status: 'accepted'
      }
    ],
    assets: [
      {
        assetId: 'map',
        generationPrompt: 'Vintage 1940 aerial cartographic map of Bavarian town Herzogenaurach, muted tones, fine etching line work, high-detail archival photography --ar 16:9 --style raw',
        promptStatus: 'catalog-derived',
        method: 'historical archival plate',
        rationale: 'Provides authentic geographic grounding before corporate symbols emerge.'
      },
      {
        assetId: 'portrait',
        generationPrompt: 'Medium close-up archival sepia portrait of middle-aged German industrialist 1948, stark contrast, dramatic chiaroscuro side lighting, authentic grain --ar 4:5 --v 6.0',
        promptStatus: 'reconstructed',
        method: 'generated raster plate',
        rationale: 'Emphasizes psychological gravity and familial rivalry.'
      },
      {
        assetId: 'reveal',
        generationPrompt: 'Macro shot of tearing vintage parchment paper revealing underlying monochrome workshop photograph, frayed paper fibers --ar 16:9',
        promptStatus: 'user-authored',
        method: 'alpha cutout & mask',
        rationale: 'Serves as physical transition surface between archival past and present.'
      }
    ]
  };

  let storyContext = null;

  // Attempt local storage hydration
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) storyContext = JSON.parse(local);
  } catch (e) {}

  // Fetch semantic-context.json if available
  fetch('semantic-context.json?v=transcript-v60')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data) {
        storyContext = mergeStoryData(storyContext, data);
        saveContext();
      }
    })
    .catch(() => {});

  if (!storyContext) {
    storyContext = JSON.parse(JSON.stringify(DEFAULT_STORY_CONTEXT));
  }

  function mergeStoryData(current, incoming) {
    if (!current) return JSON.parse(JSON.stringify(incoming));
    if (!String(current.transcript || '').trim() && incoming.transcript) {
      current.transcript = incoming.transcript;
      current.transcriptStatus = incoming.transcriptStatus;
    }
    if (incoming.shots && Array.isArray(incoming.shots)) {
      current.shots = current.shots || [];
      incoming.shots.forEach((s) => {
        if (!current.shots.some((old) => old.id === s.id)) {
          current.shots.push(s);
        }
      });
    }
    if (incoming.assets && Array.isArray(incoming.assets)) {
      current.assets = current.assets || [];
      incoming.assets.forEach((a) => {
        if (!current.assets.some((old) => old.assetId === a.assetId)) {
          current.assets.push(a);
        }
      });
    }
    return current;
  }

  function saveContext() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storyContext));
    } catch (e) {}
  }

  function getContext() {
    return JSON.parse(JSON.stringify(storyContext));
  }

  let activeTab = 'shots';
  let selectedShotIndex = 0;
  let selectedAssetIndex = 0;

  function openStoryContextStudio() {
    let modal = document.getElementById('modal-regaarder-story-prompts');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-regaarder-story-prompts';
      modal.className = 'vector-export-modal rg-shell-mounted';
      modal.style.cssText = 'display: none; z-index: 100010; backdrop-filter: blur(14px); background: rgba(5,6,12,0.96); padding: 0; overflow: hidden;';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="vector-modal-box" style="width: 100vw; max-width: 100vw; height: 100vh; max-height: 100vh; display: flex; flex-direction: column; background: var(--rg-bg-canvas); border: none; border-radius: 0; overflow: hidden;">
        <!-- Top Studio Bar -->
        <header class="rg-global-topbar" style="height: 48px; border-bottom: 1px solid var(--rg-border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: #0B0B11; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: none; stroke: #c084fc; stroke-width: 2;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <span style="font-weight: 700; font-size: 13.5px; color: #fff; letter-spacing: -0.01em;">Story Context & AI Prompts</span>
            </div>
            <span class="rg-badge" id="story-status-badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.35); font-size: 10px;">
              ${escapeHtml(storyContext.transcriptStatus || 'Awaiting Transcript')}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn btn-secondary" id="btn-export-story-json" style="font-size: 11.5px; padding: 5px 12px;">Export Context JSON</button>
            <button type="button" class="btn btn-secondary" id="btn-import-story-json" style="font-size: 11.5px; padding: 5px 12px;">Import Context JSON</button>
            <input type="file" id="file-import-story-json" accept=".json,application/json" style="display: none;">
            <button type="button" class="btn-sidebar-collapse" id="btn-close-story-studio" title="Done" style="background: rgba(255,255,255,0.06); border: 1px solid var(--rg-border-subtle); border-radius: 6px; padding: 5px 12px; color: #fff; font-size: 12px; cursor: pointer;">
              Done ✕
            </button>
          </div>
        </header>

        <!-- Main Body: Two-column master/detail layout -->
        <div style="display: flex; flex: 1; min-height: 0; overflow: hidden;">
          <!-- Left Column: Master Narration Transcript + Context History (360px) -->
          <aside style="width: 380px; background: var(--rg-bg-panel); border-right: 1px solid var(--rg-border-subtle); display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;">
            <div style="padding: 14px 16px; border-bottom: 1px solid var(--rg-border-subtle); background: #0F0F14;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 700; font-size: 12px; color: #f5f5f7;">Full Voiceover Transcript</span>
                <span id="story-word-count" style="font-size: 10.5px; font-family: monospace; color: var(--rg-text-muted);">0 words</span>
              </div>
              <p style="font-size: 11px; color: var(--rg-text-muted); line-height: 1.5; margin: 0 0 10px;">
                Timestamped source script. Associates spoken word with visuals, movement curves, and sound design.
              </p>
              <textarea id="story-transcript-input" rows="8" style="width: 100%; background: var(--rg-bg-input); border: 1px solid var(--rg-border-subtle); border-radius: 6px; padding: 10px; font-size: 12px; color: #f5f5f7; line-height: 1.6; resize: vertical;" placeholder="Paste narrative transcript here...">${escapeHtml(storyContext.transcript || '')}</textarea>
            </div>

            <!-- Notes & Editorial Guidelines -->
            <div style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
              <span style="font-weight: 700; font-size: 11.5px; color: var(--rg-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Editorial Intent & Notes</span>
              <textarea id="story-notes-input" rows="5" style="width: 100%; background: var(--rg-bg-input); border: 1px solid var(--rg-border-subtle); border-radius: 6px; padding: 10px; font-size: 11.5px; color: var(--rg-text-secondary); line-height: 1.5; resize: vertical;">${escapeHtml(storyContext.notes || '')}</textarea>

              <div style="padding: 12px; border-radius: 8px; background: rgba(130, 60, 240, 0.08); border: 1px solid rgba(130, 60, 240, 0.25);">
                <div style="font-weight: 600; font-size: 11px; color: #c084fc; margin-bottom: 4px;">AI Prompt Provenance Standard</div>
                <div style="font-size: 10.5px; color: var(--rg-text-muted); line-height: 1.5;">
                  All generative visual prompts are archived with their exact reconstruction status. No reconstructed prompt is presented as historically authentic without catalog citation.
                </div>
              </div>
            </div>
          </aside>

          <!-- Right Column: Detail Workstation (Shots Alignment & AI Prompts tabs) -->
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--rg-bg-canvas); overflow: hidden;">
            <!-- Studio Tab Switcher -->
            <div style="height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid var(--rg-border-subtle); background: #0E0F15; flex-shrink: 0;">
              <div style="display: flex; gap: 4px;">
                <button type="button" class="btn-story-tab ${activeTab === 'shots' ? 'active' : ''}" data-tab="shots" style="padding: 6px 14px; font-size: 11.5px; font-weight: 600; border-radius: 6px; border: none; background: ${activeTab === 'shots' ? 'var(--rg-accent)' : 'transparent'}; color: ${activeTab === 'shots' ? '#fff' : 'var(--rg-text-muted)'}; cursor: pointer; transition: all 0.2s;">
                  Shot Sequences (${storyContext.shots.length})
                </button>
                <button type="button" class="btn-story-tab ${activeTab === 'assets' ? 'active' : ''}" data-tab="assets" style="padding: 6px 14px; font-size: 11.5px; font-weight: 600; border-radius: 6px; border: none; background: ${activeTab === 'assets' ? 'var(--rg-accent)' : 'transparent'}; color: ${activeTab === 'assets' ? '#fff' : 'var(--rg-text-muted)'}; cursor: pointer; transition: all 0.2s;">
                  AI Asset Prompts (${storyContext.assets.length})
                </button>
              </div>

              <div id="story-tab-actions"></div>
            </div>

            <!-- Tab Content Area -->
            <div id="story-tab-body" style="flex: 1; overflow-y: auto; padding: 24px;"></div>
          </div>
        </div>
      </div>
    `;

    // Bind Transcript updates
    const transcriptInput = document.getElementById('story-transcript-input');
    if (transcriptInput) {
      const updateWordCount = () => {
        const text = transcriptInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const wc = document.getElementById('story-word-count');
        if (wc) wc.textContent = `${words} words`;
      };
      updateWordCount();
      transcriptInput.addEventListener('input', (e) => {
        storyContext.transcript = e.target.value;
        storyContext.transcriptStatus = e.target.value.trim() ? 'provided; alignment pending' : 'awaiting-user-transcript';
        const badge = document.getElementById('story-status-badge');
        if (badge) badge.textContent = storyContext.transcriptStatus;
        updateWordCount();
        saveContext();
      });
    }

    const notesInput = document.getElementById('story-notes-input');
    if (notesInput) {
      notesInput.addEventListener('input', (e) => {
        storyContext.notes = e.target.value;
        saveContext();
      });
    }

    // Bind Tab Switching
    modal.querySelectorAll('.btn-story-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        activeTab = tab.getAttribute('data-tab');
        modal.querySelectorAll('.btn-story-tab').forEach((t) => {
          const isAct = t.getAttribute('data-tab') === activeTab;
          t.classList.toggle('active', isAct);
          t.style.background = isAct ? 'var(--rg-accent)' : 'transparent';
          t.style.color = isAct ? '#fff' : 'var(--rg-text-muted)';
        });
        renderStoryTab();
      });
    });

    // Export / Import
    const exportBtn = document.getElementById('btn-export-story-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storyContext, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', 'story-context.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    }

    const importBtn = document.getElementById('btn-import-story-json');
    const importInput = document.getElementById('file-import-story-json');
    if (importBtn && importInput) {
      importBtn.addEventListener('click', () => {
        importInput.value = '';
        importInput.click();
      });
      importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const parsed = JSON.parse(await file.text());
          if (parsed && Array.isArray(parsed.shots)) {
            storyContext = parsed;
            saveContext();
            openStoryContextStudio();
          }
        } catch (err) {
          alert('Could not import story context JSON: ' + err.message);
        }
      });
    }

    // Close Button
    const closeBtn = document.getElementById('btn-close-story-studio');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    modal.style.display = 'flex';
    renderStoryTab();
  }

  function renderStoryTab() {
    const container = document.getElementById('story-tab-body');
    const actionsHost = document.getElementById('story-tab-actions');
    if (!container) return;

    if (activeTab === 'shots') {
      if (actionsHost) {
        actionsHost.innerHTML = `
          <button type="button" class="btn btn-primary" id="btn-add-story-shot" style="font-size: 11px; padding: 4px 10px;">
            + Add Shot Sequence
          </button>
        `;
        document.getElementById('btn-add-story-shot')?.addEventListener('click', () => {
          const newShot = {
            id: 'shot-' + (storyContext.shots.length + 1),
            scene: 'Scene ' + String(storyContext.shots.length + 1).padStart(2, '0'),
            localStart: 0,
            localEnd: 5,
            assets: [],
            narration: 'New narration cue',
            intent: 'Scene communication goal',
            metaphor: 'Visual metaphor description',
            soundCue: 'Atmospheric room tone',
            status: 'draft'
          };
          storyContext.shots.push(newShot);
          selectedShotIndex = storyContext.shots.length - 1;
          saveContext();
          renderStoryTab();
        });
      }

      if (!storyContext.shots.length) {
        container.innerHTML = '<div style="color: var(--rg-text-muted); text-align: center; padding: 40px;">No shots defined.</div>';
        return;
      }

      selectedShotIndex = Math.max(0, Math.min(storyContext.shots.length - 1, selectedShotIndex));
      const shot = storyContext.shots[selectedShotIndex];

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 240px 1fr; gap: 24px; max-width: 1100px; margin: 0 auto;">
          <!-- Shot Selector List -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 11px; font-weight: 600; color: var(--rg-text-muted); text-transform: uppercase;">Sequence Shots</label>
            <div style="display: flex; flex-direction: column; gap: 4px; max-height: 70vh; overflow-y: auto;">
              ${storyContext.shots.map((s, idx) => `
                <div class="story-shot-item ${idx === selectedShotIndex ? 'active' : ''}" data-idx="${idx}" style="padding: 10px 12px; background: ${idx === selectedShotIndex ? 'rgba(130, 60, 240, 0.16)' : 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${idx === selectedShotIndex ? 'rgba(130, 60, 240, 0.5)' : 'var(--rg-border-subtle)'}; border-radius: 8px; cursor: pointer; transition: all 0.15s;">
                  <div style="font-weight: 600; font-size: 12px; color: ${idx === selectedShotIndex ? '#fff' : 'var(--rg-text-secondary)'}; margin-bottom: 2px;">
                    ${escapeHtml(s.scene || s.id)}
                  </div>
                  <div style="font-size: 10.5px; color: var(--rg-text-muted); font-family: monospace;">
                    ${s.localStart}s–${s.localEnd}s · ${s.assets.length} assets
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Shot Detail Editor Form -->
          <div style="background: var(--rg-bg-panel); border: 1px solid var(--rg-border-subtle); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--rg-border-subtle); padding-bottom: 12px;">
              <div>
                <span class="rg-badge" style="background: rgba(255,255,255,0.06); font-family: monospace; font-size: 10.5px;">${escapeHtml(shot.id)}</span>
                <span style="font-size: 13.5px; font-weight: 700; color: #fff; margin-left: 8px;">${escapeHtml(shot.scene)}</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <label style="font-size: 11px; color: var(--rg-text-muted);">Timing:</label>
                <input type="number" id="shot-field-start" step="0.1" value="${shot.localStart}" style="width: 55px; background: var(--rg-bg-input); border: 1px solid var(--rg-border-subtle); border-radius: 4px; color: #fff; padding: 3px 6px; font-size: 11px;">
                <span style="font-size: 11px; color: var(--rg-text-muted);">to</span>
                <input type="number" id="shot-field-end" step="0.1" value="${shot.localEnd}" style="width: 55px; background: var(--rg-bg-input); border: 1px solid var(--rg-border-subtle); border-radius: 4px; color: #fff; padding: 3px 6px; font-size: 11px;">
                <span style="font-size: 11px; color: var(--rg-text-muted);">s</span>
              </div>
            </div>

            <div>
              <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Associated Narration</label>
              <textarea id="shot-field-narration" rows="3" class="rg-input-text" style="width: 100%; font-size: 12.5px; line-height: 1.6;">${escapeHtml(shot.narration || '')}</textarea>
            </div>

            <div>
              <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Communication Goal (Intent)</label>
              <textarea id="shot-field-intent" rows="2" class="rg-input-text" style="width: 100%; font-size: 12px; line-height: 1.5;">${escapeHtml(shot.intent || '')}</textarea>
            </div>

            <div>
              <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Metaphor (Text ↔ Image / Movement Association)</label>
              <textarea id="shot-field-metaphor" rows="2" class="rg-input-text" style="width: 100%; font-size: 12px; line-height: 1.5;">${escapeHtml(shot.metaphor || '')}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Planned Sound / Foley Cue</label>
                <input type="text" id="shot-field-sound" class="rg-input-text" value="${escapeHtml(shot.soundCue || '')}" style="width: 100%;">
              </div>
              <div>
                <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Review Status</label>
                <select id="shot-field-status" class="rg-select" style="width: 100%;">
                  <option value="draft" ${shot.status === 'draft' ? 'selected' : ''}>Draft Alignment</option>
                  <option value="accepted" ${shot.status === 'accepted' ? 'selected' : ''}>Accepted · Verified</option>
                  <option value="needs-revision" ${shot.status === 'needs-revision' ? 'selected' : ''}>Needs Revision</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
              <button type="button" class="btn btn-secondary" id="btn-delete-story-shot" style="color: #f87171; border-color: rgba(239, 68, 68, 0.3); font-size: 11.5px;">
                Delete Shot
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.story-shot-item').forEach((item) => {
        item.addEventListener('click', () => {
          selectedShotIndex = Number(item.getAttribute('data-idx'));
          renderStoryTab();
        });
      });

      const bindShotInput = (id, fn) => {
        document.getElementById(id)?.addEventListener('input', fn);
      };

      bindShotInput('shot-field-start', (e) => { shot.localStart = Number(e.target.value) || 0; saveContext(); });
      bindShotInput('shot-field-end', (e) => { shot.localEnd = Number(e.target.value) || 0; saveContext(); });
      bindShotInput('shot-field-narration', (e) => { shot.narration = e.target.value; saveContext(); });
      bindShotInput('shot-field-intent', (e) => { shot.intent = e.target.value; saveContext(); });
      bindShotInput('shot-field-metaphor', (e) => { shot.metaphor = e.target.value; saveContext(); });
      bindShotInput('shot-field-sound', (e) => { shot.soundCue = e.target.value; saveContext(); });

      document.getElementById('shot-field-status')?.addEventListener('change', (e) => {
        shot.status = e.target.value;
        saveContext();
      });

      document.getElementById('btn-delete-story-shot')?.addEventListener('click', () => {
        storyContext.shots.splice(selectedShotIndex, 1);
        selectedShotIndex = Math.max(0, selectedShotIndex - 1);
        saveContext();
        renderStoryTab();
      });

    } else if (activeTab === 'assets') {
      if (actionsHost) {
        actionsHost.innerHTML = `
          <button type="button" class="btn btn-primary" id="btn-add-story-asset" style="font-size: 11px; padding: 4px 10px;">
            + Add Asset Prompt
          </button>
        `;
        document.getElementById('btn-add-story-asset')?.addEventListener('click', () => {
          const newAsset = {
            assetId: 'asset-' + (storyContext.assets.length + 1),
            generationPrompt: 'Cinematic photograph, dramatic studio lighting, 8k --ar 16:9',
            promptStatus: 'user-authored',
            method: 'generated raster plate',
            rationale: 'Visual element for sequence'
          };
          storyContext.assets.push(newAsset);
          selectedAssetIndex = storyContext.assets.length - 1;
          saveContext();
          renderStoryTab();
        });
      }

      if (!storyContext.assets.length) {
        container.innerHTML = '<div style="color: var(--rg-text-muted); text-align: center; padding: 40px;">No asset prompt records defined.</div>';
        return;
      }

      selectedAssetIndex = Math.max(0, Math.min(storyContext.assets.length - 1, selectedAssetIndex));
      const asset = storyContext.assets[selectedAssetIndex];

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 240px 1fr; gap: 24px; max-width: 1100px; margin: 0 auto;">
          <!-- Asset Selector List -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 11px; font-weight: 600; color: var(--rg-text-muted); text-transform: uppercase;">Asset Catalog</label>
            <div style="display: flex; flex-direction: column; gap: 4px; max-height: 70vh; overflow-y: auto;">
              ${storyContext.assets.map((a, idx) => `
                <div class="story-asset-item ${idx === selectedAssetIndex ? 'active' : ''}" data-idx="${idx}" style="padding: 10px 12px; background: ${idx === selectedAssetIndex ? 'rgba(130, 60, 240, 0.16)' : 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${idx === selectedAssetIndex ? 'rgba(130, 60, 240, 0.5)' : 'var(--rg-border-subtle)'}; border-radius: 8px; cursor: pointer; transition: all 0.15s;">
                  <div style="font-weight: 600; font-size: 12px; color: ${idx === selectedAssetIndex ? '#fff' : 'var(--rg-text-secondary)'}; margin-bottom: 2px;">
                    ${escapeHtml(a.assetId)}
                  </div>
                  <div style="font-size: 10.5px; color: var(--rg-text-muted);">
                    ${escapeHtml(a.promptStatus || 'user-authored')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Asset Prompt Detail Editor -->
          <div style="background: var(--rg-bg-panel); border: 1px solid var(--rg-border-subtle); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--rg-border-subtle); padding-bottom: 12px;">
              <div>
                <span class="rg-badge" style="background: rgba(130, 60, 240, 0.18); color: #c084fc; font-family: monospace; font-size: 11px;">${escapeHtml(asset.assetId)}</span>
                <span style="font-size: 12px; color: var(--rg-text-muted); margin-left: 8px;">Provenance: ${escapeHtml(asset.promptStatus || 'Reconstructed')}</span>
              </div>
              <button type="button" class="btn btn-secondary" id="btn-copy-asset-prompt" style="font-size: 11px; padding: 4px 10px; display: flex; align-items: center; gap: 4px;">
                <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; fill: currentColor;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                <span>Copy Prompt</span>
              </button>
            </div>

            <div>
              <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Generative AI Asset Prompt</label>
              <textarea id="asset-field-prompt" rows="4" class="rg-input-text" style="width: 100%; font-size: 12px; line-height: 1.6; font-family: 'JetBrains Mono', monospace;">${escapeHtml(asset.generationPrompt || '')}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Prompt Provenance / Exactness</label>
                <select id="asset-field-status" class="rg-select" style="width: 100%;">
                  <option value="exact-video" ${asset.promptStatus === 'exact-video' ? 'selected' : ''}>Exact Video Plate Match</option>
                  <option value="catalog-derived" ${asset.promptStatus === 'catalog-derived' ? 'selected' : ''}>Catalog-Derived Standard</option>
                  <option value="reconstructed" ${asset.promptStatus === 'reconstructed' ? 'selected' : ''}>Historical Reconstruction</option>
                  <option value="user-authored" ${asset.promptStatus === 'user-authored' ? 'selected' : ''}>User-Authored Custom Prompt</option>
                </select>
              </div>
              <div>
                <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Production Method</label>
                <select id="asset-field-method" class="rg-select" style="width: 100%;">
                  <option value="generated raster plate" ${asset.method === 'generated raster plate' ? 'selected' : ''}>Generated Raster Plate</option>
                  <option value="generated alpha cutout" ${asset.method === 'generated alpha cutout' ? 'selected' : ''}>Generated Alpha Cutout</option>
                  <option value="manual polygon alpha mask" ${asset.method === 'manual polygon alpha mask' ? 'selected' : ''}>Manual Polygon Alpha Mask</option>
                  <option value="textured 3d plane" ${asset.method === 'textured 3d plane' ? 'selected' : ''}>Textured 3D Perspective Plane</option>
                  <option value="historical archival plate" ${asset.method === 'historical archival plate' ? 'selected' : ''}>Historical Archival Plate</option>
                </select>
              </div>
            </div>

            <div>
              <label class="rg-control-label" style="display: block; margin-bottom: 6px; font-weight: 600;">Concise Creative Rationale</label>
              <textarea id="asset-field-rationale" rows="2" class="rg-input-text" style="width: 100%; font-size: 12px; line-height: 1.5;">${escapeHtml(asset.rationale || '')}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
              <button type="button" class="btn btn-secondary" id="btn-delete-story-asset" style="color: #f87171; border-color: rgba(239, 68, 68, 0.3); font-size: 11.5px;">
                Delete Asset Record
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.story-asset-item').forEach((item) => {
        item.addEventListener('click', () => {
          selectedAssetIndex = Number(item.getAttribute('data-idx'));
          renderStoryTab();
        });
      });

      const bindAssetInput = (id, fn) => {
        document.getElementById(id)?.addEventListener('input', fn);
      };

      bindAssetInput('asset-field-prompt', (e) => { asset.generationPrompt = e.target.value; saveContext(); });
      bindAssetInput('asset-field-rationale', (e) => { asset.rationale = e.target.value; saveContext(); });

      document.getElementById('asset-field-status')?.addEventListener('change', (e) => {
        asset.promptStatus = e.target.value;
        saveContext();
      });

      document.getElementById('asset-field-method')?.addEventListener('change', (e) => {
        asset.method = e.target.value;
        saveContext();
      });

      document.getElementById('btn-copy-asset-prompt')?.addEventListener('click', () => {
        if (asset.generationPrompt) {
          navigator.clipboard?.writeText(asset.generationPrompt);
          const btn = document.getElementById('btn-copy-asset-prompt');
          if (btn) {
            btn.innerHTML = '<span>Copied ✓</span>';
            setTimeout(() => {
              btn.innerHTML = '<svg viewBox="0 0 24 24" style="width: 12px; height: 12px; fill: currentColor;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg><span>Copy Prompt</span>';
            }, 2000);
          }
        }
      });

      document.getElementById('btn-delete-story-asset')?.addEventListener('click', () => {
        storyContext.assets.splice(selectedAssetIndex, 1);
        selectedAssetIndex = Math.max(0, selectedAssetIndex - 1);
        saveContext();
        renderStoryTab();
      });
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // Expose API
  window.RegaarderStoryContext = {
    open: openStoryContextStudio,
    getContext,
    save: saveContext,
    merge: mergeStoryData
  };

  // Compatibility hook
  if (window.MotionCore) {
    window.MotionCore.getStoryContext = getContext;
  }
})();
