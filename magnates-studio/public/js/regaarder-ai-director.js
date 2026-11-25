/* ============================================================================
   REGAARDER STUDIO — AI DIRECTOR (GEMINI-STYLE COMPOSER + INTRO/BODY/OUTRO)
   Toggled from the Left Nav Rail AI button; renders inside the Right Sidebar
   (.rg-inspector-shell) with:
   - Ctrl+V paste / drag-drop / "+" file attachments with hover "x" remove
   - Local & Online Model selector
   - Permission level selector (Turbo / Balanced / Ask)
   - Voice dictation button
   ============================================================================ */
(function () {
  'use strict';

  const STORE_KEY = 'rg_ai_director_prefs_v1';
  const ROLE_COLORS = {
    intro: { border: 'rgba(56, 189, 248, 0.55)', bg: 'rgba(14, 165, 233, 0.16)', text: '#bae6fd', tag: '#38bdf8' },
    body: { border: 'rgba(168, 85, 247, 0.55)', bg: 'rgba(139, 92, 246, 0.18)', text: '#e9d5ff', tag: '#c084fc' },
    outro: { border: 'rgba(52, 211, 153, 0.55)', bg: 'rgba(16, 185, 129, 0.16)', text: '#a7f3d0', tag: '#34d399' }
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
    messages: [
      {
        role: 'assistant',
        text: 'Describe a video or reusable template, paste images with Ctrl+V, or attach assets with +.',
        blueprint: null
      }
    ]
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
    const reader = new FileReader();
    reader.onload = () => {
      state.attachments.push({
        id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: file.name || (isImage ? 'Pasted image.png' : 'Attached file'),
        type: file.type || 'application/octet-stream',
        kind: isImage ? 'image' : (isVideo ? 'video' : 'file'),
        previewUrl: (isImage || isVideo) ? String(reader.result || '') : ''
      });
      const panel = document.querySelector('.rg-ai-director-panel');
      if (panel) renderAttachments(panel);
    };
    if (isImage) {
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
        inp.style.height = Math.min(110, inp.scrollHeight) + 'px';
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
          <span class="rg-ai-director-sparkle" aria-hidden="true">✦</span>
          <span class="rg-ai-director-title">AI Director</span>
          <span class="rg-ai-director-badge">Intro · Body · Outro</span>
        </div>
        <button type="button" class="rg-ai-director-close" title="Back to Inspector" aria-label="Back to Inspector">&times;</button>
      </div>

      <div class="rg-ai-director-messages" data-role="messages"></div>

      <div class="rg-ai-director-starters">
        <button type="button" class="rg-ai-starter-chip" data-prompt="Create a 30s documentary video about Apple's rise: borrow Map Pin Drop for intro, Balance Sheet for Body, and Kinetic Typography for Outro">30s Doc: Map + Balance + Kinetic</button>
        <button type="button" class="rg-ai-starter-chip" data-prompt="Build a 24s finance template: Glitch Reveal intro, Candlestick Chart body, Subscribe Button CTA outro">24s Finance Template</button>
      </div>

      <div class="rg-ai-composer-shell" data-role="composer-shell">
        <input type="file" class="rg-ai-file-input" data-role="file-input" multiple accept="image/*,video/*,audio/*,.pdf,.svg" style="display:none;" />
        <div class="rg-ai-plus-menu" data-role="plus-menu" style="display:none;">
          <button type="button" class="rg-ai-plus-item" data-plus-action="upload">📁 Upload from Computer</button>
          <button type="button" class="rg-ai-plus-item" data-plus-action="stage">🎬 Capture Stage Frame</button>
          <button type="button" class="rg-ai-plus-item" data-plus-action="assets">🗂️ Open Studio Assets</button>
        </div>

        <div class="rg-ai-attachments-strip" data-role="attachments" style="display:none;"></div>

        <textarea class="rg-ai-director-input" data-role="input" rows="1" placeholder="Ask AI Director or paste media (Ctrl+V)..."></textarea>

        <div class="rg-ai-composer-toolbar">
          <div class="rg-ai-toolbar-left">
            <button type="button" class="rg-ai-plus-btn" data-role="plus-btn" title="Add files, stage frame, or assets" aria-label="Add attachments">+</button>
            <select class="rg-ai-model-select" data-role="model-select" title="Select AI Model (Local or Online)">
              <optgroup label="Local Models">
                <option value="local-studio-fast">Local · Studio Fast</option>
                <option value="local-ollama-llama3">Local · Ollama Llama 3</option>
                <option value="local-qwen-director">Local · Qwen 2.5</option>
              </optgroup>
              <optgroup label="Online Models">
                <option value="online-gemini-pro">Online · Gemini Pro</option>
                <option value="online-gemini-flash">Online · Gemini Flash</option>
                <option value="online-gpt4o">Online · GPT-4o</option>
              </optgroup>
            </select>
          </div>

          <div class="rg-ai-toolbar-right">
            <label class="rg-ai-perm-wrap" title="AI Permission Level">
              <span class="rg-ai-perm-shield" aria-hidden="true">🛡</span>
              <select class="rg-ai-perm-select" data-role="perm-select" aria-label="Permission Level">
                <option value="turbo">Turbo</option>
                <option value="balanced">Balanced</option>
                <option value="ask">Ask</option>
              </select>
            </label>
            <button type="button" class="rg-ai-voice-btn" data-role="voice" title="Voice Input" aria-label="Voice Input">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>
            <button type="button" class="rg-ai-director-send" data-role="send" title="Send" aria-label="Send">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            </button>
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
      inp.style.height = Math.min(110, inp.scrollHeight) + 'px';
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

    panel.querySelectorAll('.rg-ai-starter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        submitPrompt(shell, chip.getAttribute('data-prompt') || '');
      });
    });

    renderAttachments(panel);
    renderMessages(panel);
    return panel;
  }

  function renderMessages(panel) {
    const feed = panel.querySelector('[data-role="messages"]');
    if (!feed) return;

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

      return `
        <div class="rg-ai-msg rg-ai-msg-assistant">
          <div class="rg-ai-avatar" aria-hidden="true">✦</div>
          <div class="rg-ai-bubble-assistant">
            ${msg.text ? `<div class="rg-ai-msg-text">${escapeHtml(msg.text)}</div>` : ''}
            ${pillsHtml}
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

    feed.scrollTop = feed.scrollHeight;
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
      const data = await res.json();
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

    document.querySelectorAll('.rg-rail-btn[data-rail="ai"]').forEach((btn) => {
      btn.classList.toggle('is-active', state.isOpen);
    });
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
