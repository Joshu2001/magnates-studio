/* ============================================================================
   REGAARDER STUDIO — AI DIRECTOR (IMAGE 1 PARITY + INTRO/BODY/OUTRO)
   Toggled from the Left Nav Rail AI button; renders inside the Right Sidebar
   (.rg-inspector-shell) with:
   - Centered empty state ("What are we making?" + 2 clean starter rows)
   - Compact single-row composer (+, input, Model, Permission, Voice, Send)
   - Ctrl+V paste / drag-drop / "+" file attachments with hover "x" remove
   ============================================================================ */
(function () {
  'use strict';

  const STORE_KEY = 'rg_ai_director_prefs_v1';
  const ROLE_COLORS = {
    intro: { border: 'rgba(255, 255, 255, 0.10)', bg: 'rgba(255, 255, 255, 0.035)', text: '#e2e8f0', tag: '#c4b5fd' },
    body: { border: 'rgba(255, 255, 255, 0.10)', bg: 'rgba(255, 255, 255, 0.035)', text: '#e2e8f0', tag: '#a78bfa' },
    outro: { border: 'rgba(255, 255, 255, 0.10)', bg: 'rgba(255, 255, 255, 0.035)', text: '#e2e8f0', tag: '#8b5cf6' }
  };

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    } catch (_) {
      return {};
    }
  }

  function savePrefs(patch) {
    try {
      const next = Object.assign(loadPrefs(), patch || {});
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch (_) {}
  }

  const savedPrefs = loadPrefs();
  const state = {
    isOpen: false,
    isSending: false,
    isRecordingVoice: false,
    recognition: null,
    model: savedPrefs.model || 'local-studio-fast',
    permission: savedPrefs.permission || 'turbo',
    attachments: [],
    lastBlueprint: null,
    messages: []
  };

  function getCatalogSummary() {
    if (typeof EFFECT_TEMPLATES_DATA === 'undefined' || !Array.isArray(EFFECT_TEMPLATES_DATA)) return [];
    const seen = new Set();
    const out = [];
    for (const t of EFFECT_TEMPLATES_DATA) {
      if (!t || !t.id || t.hidden || seen.has(t.id)) continue;
      seen.add(t.id);
      out.push({
        id: t.id,
        title: t.title || t.id,
        category: t.category || '',
        tags: Array.isArray(t.tags) ? t.tags.slice(0, 4) : []
      });
    }
    return out;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function addFileAttachment(file) {
    if (!file) return;
    const isImage = /^image\//i.test(file.type || '');
    const isVideo = /^video\//i.test(file.type || '');
    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        state.attachments.push({
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name || 'Pasted image.png',
          type: file.type || 'image/png',
          kind: 'image',
          previewUrl: String(reader.result || '')
        });
        const panel = document.querySelector('.rg-ai-director-panel');
        if (panel) renderAttachments(panel);
      };
      reader.readAsDataURL(file);
    } else {
      state.attachments.push({
        id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: file.name || 'Attached file',
        type: file.type || 'application/octet-stream',
        kind: isVideo ? 'video' : 'file',
        previewUrl: isVideo ? URL.createObjectURL(file) : ''
      });
      const panel = document.querySelector('.rg-ai-director-panel');
      if (panel) renderAttachments(panel);
    }
  }

  function renderAttachments(panel) {
    const strip = panel.querySelector('[data-role="attachments"]');
    if (!strip) return;
    if (state.attachments.length === 0) {
      strip.innerHTML = '';
      strip.style.display = 'none';
      return;
    }
    strip.style.display = 'flex';
    strip.innerHTML = state.attachments.map((att) => `
      <div class="rg-ai-att-item" data-att-id="${escapeHtml(att.id)}" title="${escapeHtml(att.name)}">
        ${att.kind === 'image' && att.previewUrl
          ? `<img src="${att.previewUrl}" class="rg-ai-att-thumb" alt="${escapeHtml(att.name)}" />`
          : `<div class="rg-ai-att-file-badge"><span>${att.kind === 'video' ? '🎬' : '📄'}</span><span class="rg-ai-att-ext">${escapeHtml((att.name.split('.').pop() || 'FILE').toUpperCase().slice(0, 4))}</span></div>`
        }
        <button type="button" class="rg-ai-att-remove" data-remove-att="${escapeHtml(att.id)}" title="Remove attachment" aria-label="Remove attachment">&times;</button>
      </div>
    `).join('');

    strip.querySelectorAll('[data-remove-att]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-remove-att');
        state.attachments = state.attachments.filter((a) => a.id !== id);
        renderAttachments(panel);
      });
    });
  }

  function captureStageFrameAttachment(panel) {
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (!stage) return;
    const canvas = stage.querySelector('canvas');
    const img = stage.querySelector('img');
    if (canvas) {
      try {
        const url = canvas.toDataURL('image/png');
        state.attachments.push({
          id: `att_${Date.now()}`,
          name: 'Stage Frame.png',
          type: 'image/png',
          kind: 'image',
          previewUrl: url
        });
        renderAttachments(panel);
        return;
      } catch (_) {}
    }
    if (img && img.src) {
      state.attachments.push({
        id: `att_${Date.now()}`,
        name: 'Stage Visual.png',
        type: 'image/png',
        kind: 'image',
        previewUrl: img.src
      });
      renderAttachments(panel);
    }
  }

  function toggleVoiceDictation(panel) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn = panel.querySelector('[data-role="voice"]');
    const inp = panel.querySelector('[data-role="input"]');
    if (!SpeechRec) {
      if (typeof window.showTextTimingAlert === 'function') {
        window.showTextTimingAlert('Voice dictation is not supported in this browser.', 'info');
      }
      return;
    }

    if (state.isRecordingVoice && state.recognition) {
      state.recognition.stop();
      return;
    }

    const rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    state.recognition = rec;
    state.isRecordingVoice = true;
    if (voiceBtn) voiceBtn.classList.add('is-recording');

    const baseText = inp ? inp.value : '';
    rec.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (inp) {
        inp.value = (baseText ? `${baseText.trim()} ` : '') + transcript;
        inp.style.height = 'auto';
        inp.style.height = Math.min(96, inp.scrollHeight) + 'px';
      }
    };
    const stopRecording = () => {
      state.isRecordingVoice = false;
      state.recognition = null;
      if (voiceBtn) voiceBtn.classList.remove('is-recording');
    };
    rec.onerror = stopRecording;
    rec.onend = stopRecording;
    rec.start();
  }

  function ensurePanelInShell(shell) {
    if (!shell) return null;
    let panel = shell.querySelector('.rg-ai-director-panel');
    if (panel) return panel;

    panel = document.createElement('div');
    panel.className = 'rg-ai-director-panel';
    panel.innerHTML = `
      <div class="rg-ai-director-header">
        <div class="rg-ai-director-title-wrap">
          <svg class="rg-ai-director-sparkle-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/></svg>
          <span class="rg-ai-director-title">AI Director</span>
        </div>
        <div class="rg-ai-header-actions">
          <button type="button" class="rg-ai-header-btn" id="rg-ai-new-btn" title="Archive current chat &amp; start a new conversation">+ New</button>
          <button type="button" class="rg-ai-header-btn" id="rg-ai-history-btn" title="View past AI Director conversations">History</button>
          <button type="button" class="rg-ai-director-close" title="Back to Inspector" aria-label="Back to Inspector">&times;</button>
        </div>
      </div>
      <div class="rg-ai-history-menu" id="rg-ai-history-menu" style="display:none;"></div>

      <div class="rg-ai-director-body" data-role="body">
        <div class="rg-ai-empty-state" data-role="empty-state">
          <div class="rg-ai-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#8B5CF6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.1 5.2L19.3 10.3l-5.2 2.1L12 17.6l-2.1-5.2L4.7 10.3l5.2-2.1L12 3z"/></svg>
          </div>
          <h3 class="rg-ai-empty-title">What are we making?</h3>
          <p class="rg-ai-empty-sub">Start with a scene or a reusable template.</p>
          <div class="rg-ai-empty-actions">
            <button type="button" class="rg-ai-empty-row" data-prompt="Create a 30s documentary intro using Map Pin Drop for Intro, Balance Sheet for Body, and Kinetic Typography for Outro">
              <span class="rg-ai-empty-row-left">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#8B5CF6" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="15" x="3" y="4.5" rx="2"/><path d="M3 9h18"/><path d="m8 4.5 2.5 4.5"/><path d="m14 4.5 2.5 4.5"/></svg>
                <span>Build a documentary intro</span>
              </span>
              <span class="rg-ai-empty-chevron">&#8250;</span>
            </button>
            <button type="button" class="rg-ai-empty-row" data-prompt="Create a reusable 24s finance template: Glitch Reveal intro, Candlestick Chart body, Subscribe Button CTA outro">
              <span class="rg-ai-empty-row-left">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#8B5CF6" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                <span>Create a reusable template</span>
              </span>
              <span class="rg-ai-empty-chevron">&#8250;</span>
            </button>
          </div>
        </div>
        <div class="rg-ai-director-messages" data-role="messages" style="display:none;"></div>
      </div>

      <div class="rg-ai-composer-shell" data-role="composer-shell">
        <input type="file" class="rg-ai-file-input" data-role="file-input" multiple accept="image/*,video/*,audio/*,.pdf,.svg" style="display:none;" />
        <div class="rg-ai-plus-menu" data-role="plus-menu" style="display:none;">
          <button type="button" class="rg-ai-plus-item" data-plus-action="upload">📁 Upload from Computer</button>
          <button type="button" class="rg-ai-plus-item" data-plus-action="stage">🎬 Capture Stage Frame</button>
          <button type="button" class="rg-ai-plus-item" data-plus-action="assets">🗂️ Open Studio Assets</button>
        </div>

        <div class="rg-ai-attachments-strip" data-role="attachments" style="display:none;"></div>

        <div class="rg-ai-composer-row" style="flex-direction:column;align-items:stretch;gap:6px;">
          <textarea class="rg-ai-director-input" data-role="input" rows="1" placeholder="Describe a scene or template..." style="width:100%;"></textarea>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <div style="display:flex;align-items:center;gap:5px;">
              <button type="button" class="rg-ai-plus-btn" data-role="plus-btn" title="Add files, stage frame, or assets" aria-label="Add attachments">+</button>
              <select class="rg-ai-model-select" data-role="model-select" title="Select AI Model (Local or Online)">
                <optgroup label="Local Models">
                  <option value="local-studio-fast">Studio</option>
                  <option value="local-ollama-llama3">Ollama</option>
                  <option value="local-qwen-director">Qwen 2.5</option>
                </optgroup>
                <optgroup label="Online Models">
                  <option value="online-gemini-pro">Gemini Pro</option>
                  <option value="online-gemini-flash">Gemini Flash</option>
                  <option value="online-gpt4o">GPT-4o</option>
                </optgroup>
              </select>
              <select class="rg-ai-perm-select" data-role="perm-select" title="AI Permission Level" aria-label="Permission Level">
                <option value="turbo">Turbo</option>
                <option value="balanced">Balanced</option>
                <option value="ask">Ask</option>
              </select>
            </div>
            <div class="rg-ai-inline-controls">
              <button type="button" class="rg-ai-voice-btn" data-role="voice" title="Voice Input" aria-label="Voice Input">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </button>
              <button type="button" class="rg-ai-director-send" data-role="send" title="Send" aria-label="Send">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    shell.appendChild(panel);

    const modelSel = panel.querySelector('[data-role="model-select"]');
    const permSel = panel.querySelector('[data-role="perm-select"]');
    if (modelSel) {
      modelSel.value = state.model;
      modelSel.addEventListener('change', () => {
        state.model = modelSel.value;
        savePrefs({ model: state.model });
      });
      fetch('/api/ai/ollama/models')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.available || !Array.isArray(data.models) || !data.models.length) return;
          const localGroup = modelSel.querySelector('optgroup[label*="Local"]');
          if (!localGroup) return;
          localGroup.label = 'Local Models (Ollama)';
          localGroup.innerHTML = data.models
            .map((m) => `<option value="ollama:${escapeHtml(m.name)}">${escapeHtml(m.name)}</option>`)
            .join('');
          const hasSaved = [...modelSel.options].some((o) => o.value === state.model);
          if (hasSaved) {
            modelSel.value = state.model;
          } else {
            state.model = localGroup.querySelector('option')?.value || state.model;
            modelSel.value = state.model;
            savePrefs({ model: state.model });
          }
        })
        .catch(() => {});
    }
    if (permSel) {
      permSel.value = state.permission;
      permSel.addEventListener('change', () => {
        state.permission = permSel.value;
        savePrefs({ permission: state.permission });
      });
    }

    panel.querySelector('.rg-ai-director-close').addEventListener('click', () => setOpen(shell, false));

    const plusBtn = panel.querySelector('[data-role="plus-btn"]');
    const plusMenu = panel.querySelector('[data-role="plus-menu"]');
    const fileInput = panel.querySelector('[data-role="file-input"]');

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = plusMenu.style.display !== 'none';
      plusMenu.style.display = open ? 'none' : 'flex';
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.rg-ai-plus-menu') && !e.target.closest('.rg-ai-plus-btn')) {
        plusMenu.style.display = 'none';
      }
    });

    plusMenu.querySelectorAll('[data-plus-action]').forEach((item) => {
      item.addEventListener('click', () => {
        const act = item.getAttribute('data-plus-action');
        plusMenu.style.display = 'none';
        if (act === 'upload' && fileInput) fileInput.click();
        else if (act === 'stage') captureStageFrameAttachment(panel);
        else if (act === 'assets') {
          const assetsBtn = document.querySelector('.rg-topbar-nav-btn[data-nav="assets"], #nav-assets');
          if (assetsBtn) assetsBtn.click();
        }
      });
    });

    fileInput.addEventListener('change', () => {
      Array.from(fileInput.files || []).forEach(addFileAttachment);
      fileInput.value = '';
    });

    const inp = panel.querySelector('[data-role="input"]');
    const triggerSend = () => {
      const val = inp.value.trim();
      if ((!val && state.attachments.length === 0) || state.isSending) return;
      inp.value = '';
      inp.style.height = 'auto';
      submitPrompt(shell, val);
    };

    inp.addEventListener('input', () => {
      inp.style.height = 'auto';
      inp.style.height = Math.min(96, inp.scrollHeight) + 'px';
    });

    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        triggerSend();
      }
    });

    inp.addEventListener('paste', (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            addFileAttachment(file);
          }
        }
      }
    });

    const composerShell = panel.querySelector('[data-role="composer-shell"]');
    composerShell.addEventListener('dragover', (e) => {
      e.preventDefault();
      composerShell.classList.add('is-dragover');
    });
    composerShell.addEventListener('dragleave', () => {
      composerShell.classList.remove('is-dragover');
    });
    composerShell.addEventListener('drop', (e) => {
      e.preventDefault();
      composerShell.classList.remove('is-dragover');
      Array.from(e.dataTransfer?.files || []).forEach(addFileAttachment);
    });

    panel.querySelector('[data-role="send"]').addEventListener('click', triggerSend);
    panel.querySelector('[data-role="voice"]').addEventListener('click', () => toggleVoiceDictation(panel));

    panel.querySelectorAll('.rg-ai-empty-row').forEach((row) => {
      row.addEventListener('click', () => {
        submitPrompt(shell, row.getAttribute('data-prompt') || '');
      });
    });

    const CHAT_HISTORY_KEY = 'regaarder-ai-chat-history-v1';
    const historyMenu = panel.querySelector('#rg-ai-history-menu');
    const getChatHistory = () => {
      try { return JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '[]'); } catch (_) { return []; }
    };
    const saveChatHistory = (arr) => {
      try { localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(arr.slice(0, 20))); } catch (_) {}
    };
    const archiveCurrentChat = () => {
      if (!state.messages || state.messages.length === 0) return;
      const firstUser = state.messages.find((m) => m.role === 'user');
      const hist = getChatHistory();
      hist.unshift({
        id: `chat_${Date.now()}`,
        title: (firstUser && firstUser.text ? firstUser.text : 'AI Director Session').slice(0, 42),
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: state.messages.map((m) => ({ role: m.role, text: m.text || '', blueprint: m.blueprint || null, cutout: m.cutout || null, meshBlueprint: m.meshBlueprint || null }))
      });
      saveChatHistory(hist);
    };

    panel.querySelector('#rg-ai-new-btn')?.addEventListener('click', () => {
      archiveCurrentChat();
      state.messages = [];
      state.attachments = [];
      state.lastBlueprint = null;
      if (historyMenu) historyMenu.style.display = 'none';
      renderAttachments(panel);
      renderMessages(panel);
    });

    panel.querySelector('#rg-ai-history-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!historyMenu) return;
      if (historyMenu.style.display !== 'none') {
        historyMenu.style.display = 'none';
        return;
      }
      const hist = getChatHistory();
      historyMenu.innerHTML = hist.length === 0
        ? '<div class="rg-ai-history-empty">No past chats yet. Click + New to archive & start fresh.</div>'
        : hist.map((h) => `
            <button type="button" class="rg-ai-history-item" data-chat-hist="${escapeHtml(h.id)}">
              <span class="rg-ai-history-title">${escapeHtml(h.title)}</span>
              <span class="rg-ai-history-time">${escapeHtml(h.savedAt)}</span>
            </button>
          `).join('');
      historyMenu.style.display = 'flex';
      historyMenu.querySelectorAll('[data-chat-hist]').forEach((b) => {
        b.addEventListener('click', () => {
          const item = getChatHistory().find((x) => x.id === b.getAttribute('data-chat-hist'));
          if (item && Array.isArray(item.messages)) {
            state.messages = item.messages;
            renderMessages(panel);
          }
          historyMenu.style.display = 'none';
        });
      });
    });

    document.addEventListener('mousedown', (e) => {
      if (historyMenu && historyMenu.style.display !== 'none' && !historyMenu.contains(e.target) && e.target.id !== 'rg-ai-history-btn') {
        historyMenu.style.display = 'none';
      }
    });

    renderAttachments(panel);
    renderMessages(panel);
    return panel;
  }

  function renderMessages(panel) {
    const emptyEl = panel.querySelector('[data-role="empty-state"]');
    const feed = panel.querySelector('[data-role="messages"]');
    if (!feed) return;

    if (state.messages.length === 0) {
      if (emptyEl) emptyEl.style.display = 'flex';
      feed.style.display = 'none';
      feed.innerHTML = '';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    feed.style.display = 'flex';

    feed.innerHTML = state.messages.map((msg, msgIdx) => {
      if (msg.role === 'user') {
        const attHtml = Array.isArray(msg.attachments) && msg.attachments.length > 0 ? `
          <div class="rg-ai-msg-atts">
            ${msg.attachments.map((a) => a.previewUrl
              ? `<img src="${a.previewUrl}" class="rg-ai-msg-att-thumb" alt="${escapeHtml(a.name)}" />`
              : `<span class="rg-ai-msg-att-pill">📄 ${escapeHtml(a.name)}</span>`
            ).join('')}
          </div>
        ` : '';
        return `
          <div class="rg-ai-msg rg-ai-msg-user">
            <div class="rg-ai-bubble-user">${attHtml}${msg.text ? `<div>${escapeHtml(msg.text)}</div>` : ''}</div>
          </div>
        `;
      }

      const bp = msg.blueprint;
      const pillsHtml = bp && Array.isArray(bp.sections) ? `
        <div class="rg-ai-section-pills">
          ${bp.sections.map((sec, idx) => {
            const c = ROLE_COLORS[sec.role] || ROLE_COLORS.body;
            const end = (sec.start || 0) + (sec.duration || 0);
            return `
              <button type="button" class="rg-ai-section-pill" data-scene-idx="${idx}"
                style="border-color:${c.border};background:${c.bg};color:${c.text};">
                <span class="rg-ai-pill-dot" style="background:${c.tag};"></span>
                <span>${idx + 1}. ${escapeHtml(sec.label)} (${sec.start}–${end}s) · ${escapeHtml(sec.sourceTitle || sec.sourceTplId)}</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="rg-ai-bp-actions">
          ${msg.needsApproval ? `<button type="button" class="rg-ai-apply-bp-btn" data-apply-msg="${msgIdx}">▶ Apply Blueprint</button>` : ''}
          <button type="button" class="rg-ai-save-tpl-btn" data-action="save-blueprint-template">★ Save as Template</button>
        </div>
      ` : '';

      const cutoutHtml = msg.cutout ? `
        <div class="rg-ai-cutout-card">
          <div class="rg-ai-cutout-preview"><img src="${msg.cutout.cutoutDataUrl}" alt="${escapeHtml(msg.cutout.subject)}" /></div>
          <div class="rg-ai-cutout-meta">
            <strong>${escapeHtml(msg.cutout.subject)}</strong>
            <span>${escapeHtml(msg.cutout.region)} · ${msg.cutout.appliedMode ? `Applied (${msg.cutout.appliedMode})` : 'Ready'}</span>
          </div>
          <div class="rg-ai-cutout-actions">
            <button type="button" data-cutout-msg="${msgIdx}" data-cutout-mode="foreground">Use as Foreground</button>
            <button type="button" data-cutout-msg="${msgIdx}" data-cutout-mode="3d">Use as 3D Layer</button>
          </div>
        </div>
      ` : '';

      const meshHtml = msg.meshBlueprint ? `
        <div class="rg-ai-bp-actions">
          <button type="button" class="rg-ai-apply-bp-btn" data-open-3d-msg="${msgIdx}">🧊 Open 3D Mesh Studio (${escapeHtml(msg.meshBlueprint.texture)})</button>
        </div>
      ` : '';

      return `
        <div class="rg-ai-msg rg-ai-msg-assistant">
          <div class="rg-ai-avatar" aria-hidden="true">✦</div>
          <div class="rg-ai-bubble-assistant">
            ${msg.text ? `<div class="rg-ai-msg-text">${escapeHtml(msg.text)}</div>` : ''}
            ${pillsHtml}
            ${cutoutHtml}
            ${meshHtml}
          </div>
        </div>
      `;
    }).join('');

    feed.querySelectorAll('.rg-ai-section-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-scene-idx'), 10);
        if (!isNaN(idx) && typeof window.selectStoryboardSceneByIndex === 'function') {
          window.selectStoryboardSceneByIndex(idx);
        }
      });
    });

    feed.querySelectorAll('[data-apply-msg]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mIdx = parseInt(btn.getAttribute('data-apply-msg'), 10);
        const targetMsg = state.messages[mIdx];
        if (targetMsg && targetMsg.blueprint && typeof window.composeProjectFromBlueprint === 'function') {
          window.composeProjectFromBlueprint(targetMsg.blueprint);
          targetMsg.needsApproval = false;
          renderMessages(panel);
        }
      });
    });

    feed.querySelectorAll('[data-action="save-blueprint-template"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const saveBtn = document.getElementById('btn-tpl-modal-save-custom');
        if (saveBtn) saveBtn.click();
        else if (typeof window.openSaveAsTemplateModal === 'function') window.openSaveAsTemplateModal();
      });
    });

    feed.querySelectorAll('[data-cutout-msg]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mIdx = parseInt(btn.getAttribute('data-cutout-msg'), 10);
        const mode = btn.getAttribute('data-cutout-mode') || 'foreground';
        const targetMsg = state.messages[mIdx];
        if (targetMsg && targetMsg.cutout) {
          applyCutoutToStage(targetMsg.cutout, mode);
          targetMsg.cutout.appliedMode = mode;
          renderMessages(panel);
        }
      });
    });

    feed.querySelectorAll('[data-open-3d-msg]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mIdx = parseInt(btn.getAttribute('data-open-3d-msg'), 10);
        const targetMsg = state.messages[mIdx];
        if (targetMsg && targetMsg.meshBlueprint && window.Regaarder3DMeshStudio) {
          const stage = document.getElementById('tpl-modal-preview-stage-container');
          window.Regaarder3DMeshStudio.open(stage, targetMsg.meshBlueprint);
        }
      });
    });

    feed.scrollTop = feed.scrollHeight;
  }

  function is3DSketchPrompt(prompt) {
    return /\b(3d\s*mesh|sketch\s*(?:to|into)\s*3d|sculpt|carve\s*hole|3d\s*render|extrude)\b/i.test(String(prompt || ''));
  }

  function isCutoutPrompt(prompt) {
    return /\b(cut\s*out|cutout|isolate|remove\s+background|extract\s+(?:the\s+)?(?:subject|object)|mask\s*out)\b/i.test(String(prompt || ''));
  }

  function applyCutoutToStage(cutout, mode) {
    if (!cutout) return;
    const sbApi = window.RegaarderStoryboardSketch && typeof window.RegaarderStoryboardSketch.getActiveEditorApi === 'function'
      ? window.RegaarderStoryboardSketch.getActiveEditorApi() : null;
    if (sbApi && typeof sbApi.addLayer === 'function') {
      sbApi.addLayer({
        name: `${cutout.subject} (${mode === '3d' ? '3D Cutout' : 'Foreground'})`,
        type: 'image',
        dataUrl: cutout.cutoutDataUrl
      });
      return;
    }
    if (window.topCustomizerState) {
      window.topCustomizerState.primaryUrl = cutout.cutoutDataUrl;
      window.topCustomizerState.cutoutLayerMode = mode;
      window.topCustomizerState.cutoutZIndex = mode === '3d' ? 45 : 30;
      if (typeof window.renderCustomizerFrameAtTime === 'function') {
        window.renderCustomizerFrameAtTime(0);
      }
    }
  }

  async function parseApiJson(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      throw new Error(`Server returned HTTP ${res.status} (non-JSON). Please restart the server & refresh.`);
    }
  }

  async function submitPrompt(shell, prompt) {
    const panel = ensurePanelInShell(shell);
    if (!panel || state.isSending) return;

    const sentAttachments = state.attachments.slice();
    state.attachments = [];
    renderAttachments(panel);

    state.messages.push({ role: 'user', text: prompt, attachments: sentAttachments });
    state.isSending = true;
    renderMessages(panel);

    const sendBtn = panel.querySelector('[data-role="send"]');
    if (sendBtn) sendBtn.disabled = true;

    try {
      if (is3DSketchPrompt(prompt)) {
        const sbApi = window.RegaarderStoryboardSketch && typeof window.RegaarderStoryboardSketch.getActiveEditorApi === 'function'
          ? window.RegaarderStoryboardSketch.getActiveEditorApi() : null;
        const vectorHistory = sbApi && typeof sbApi.getVectorHistory === 'function' ? sbApi.getVectorHistory() : [];
        const res = await fetch('/api/ai/sketch-to-3d', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, vectorHistory })
        });
        const data = await parseApiJson(res);
        if (!res.ok || !data.ok || !data.meshBlueprint) {
          throw new Error(data.error || 'Failed to build 3D mesh');
        }
        if (state.permission !== 'ask' && window.Regaarder3DMeshStudio) {
          const stage = document.getElementById('tpl-modal-preview-stage-container');
          window.Regaarder3DMeshStudio.open(stage, data.meshBlueprint);
        }
        state.messages.push({
          role: 'assistant',
          text: data.summary || `Rendered ${data.meshBlueprint.title} as 3D mesh.`,
          meshBlueprint: data.meshBlueprint
        });
        return;
      }

      if (isCutoutPrompt(prompt)) {
        const res = await fetch('/api/ai/cutout-object', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            model: state.model,
            permission: state.permission,
            attachments: sentAttachments.map((a) => ({ name: a.name, type: a.type, kind: a.kind }))
          })
        });
        const data = await parseApiJson(res);
        if (!res.ok || !data.ok || !data.cutout) {
          throw new Error(data.error || 'Failed to isolate object');
        }
        const needsApproval = state.permission === 'ask';
        if (!needsApproval) {
          applyCutoutToStage(data.cutout, data.cutout.targetLayer || 'foreground');
          data.cutout.appliedMode = data.cutout.targetLayer || 'foreground';
        }
        state.messages.push({
          role: 'assistant',
          text: data.summary || `Isolated ${data.cutout.subject}.`,
          cutout: data.cutout
        });
        return;
      }

      const res = await fetch('/api/ai/compose-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: state.model,
          permission: state.permission,
          attachments: sentAttachments.map((a) => ({ name: a.name, type: a.type, kind: a.kind })),
          availableTemplates: getCatalogSummary()
        })
      });
      const data = await parseApiJson(res);
      if (!res.ok || !data.ok || !data.blueprint) {
        throw new Error(data.error || 'Failed to compose sequence');
      }

      state.lastBlueprint = data.blueprint;
      const needsApproval = state.permission === 'ask';
      if (!needsApproval && typeof window.composeProjectFromBlueprint === 'function') {
        window.composeProjectFromBlueprint(data.blueprint);
      }

      state.messages.push({
        role: 'assistant',
        text: data.summary || 'Composed your Intro, Body, and Outro sequence.',
        blueprint: data.blueprint,
        needsApproval
      });
    } catch (err) {
      state.messages.push({
        role: 'assistant',
        text: `Could not compose sequence: ${err.message}`,
        blueprint: null
      });
    } finally {
      state.isSending = false;
      if (sendBtn) sendBtn.disabled = false;
      renderMessages(panel);
    }
  }

  function setOpen(shell, open) {
    const targetShell = shell || document.querySelector('#modal-top-template-customizer .rg-inspector-shell, .rg-inspector-shell');
    if (!targetShell) return;
    ensurePanelInShell(targetShell);
    state.isOpen = !!open;
    targetShell.classList.toggle('is-ai-director-open', state.isOpen);

    const rail = targetShell.closest('.rg-studio-body')?.querySelector('.rg-left-rail');
    if (rail) {
      if (state.isOpen) {
        rail.querySelectorAll('.rg-rail-btn').forEach((b) => {
          b.classList.toggle('is-active', b.getAttribute('data-rail') === 'ai');
        });
      } else {
        const aiBtn = rail.querySelector('.rg-rail-btn[data-rail="ai"]');
        if (aiBtn) aiBtn.classList.remove('is-active');
        if (!rail.querySelector('.rg-rail-btn.is-active')) {
          const editBtn = rail.querySelector('.rg-rail-btn[data-rail="edit"]');
          if (editBtn) editBtn.classList.add('is-active');
        }
      }
    } else {
      document.querySelectorAll('.rg-rail-btn[data-rail="ai"]').forEach((btn) => {
        btn.classList.toggle('is-active', state.isOpen);
      });
    }
    if (state.isOpen) {
      const inp = targetShell.querySelector('.rg-ai-director-input');
      if (inp) setTimeout(() => inp.focus(), 40);
    }
  }

  function toggle(shell) {
    const targetShell = shell || document.querySelector('#modal-top-template-customizer .rg-inspector-shell, .rg-inspector-shell');
    if (!targetShell) return;
    setOpen(targetShell, !state.isOpen);
  }

  window.RegaarderAIDirector = {
    open: (shell) => setOpen(shell, true),
    close: (shell) => setOpen(shell, false),
    toggle,
    isOpen: () => state.isOpen,
    getLastBlueprint: () => state.lastBlueprint
  };
})();
