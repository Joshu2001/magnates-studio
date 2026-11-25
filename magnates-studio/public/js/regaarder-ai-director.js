/* ============================================================================
   REGAARDER STUDIO — AI DIRECTOR (NATURAL CHAT + INTRO / BODY / OUTRO COMPOSER)
   Toggled from the Left Nav Rail AI button; renders inside the Right Sidebar
   (.rg-inspector-shell) without obstructing the preview stage.
   ============================================================================ */
(function () {
  'use strict';

  const ROLE_COLORS = {
    intro: { border: 'rgba(56, 189, 248, 0.55)', bg: 'rgba(14, 165, 233, 0.16)', text: '#bae6fd', tag: '#38bdf8' },
    body: { border: 'rgba(168, 85, 247, 0.55)', bg: 'rgba(139, 92, 246, 0.18)', text: '#e9d5ff', tag: '#c084fc' },
    outro: { border: 'rgba(52, 211, 153, 0.55)', bg: 'rgba(16, 185, 129, 0.16)', text: '#a7f3d0', tag: '#34d399' }
  };

  const state = {
    isOpen: false,
    isSending: false,
    lastBlueprint: null,
    messages: [
      {
        role: 'assistant',
        text: 'Describe a video or reusable template. I can structure it into Intro, Body, and Outro and borrow scenes from any template in your library.',
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
      <form class="rg-ai-director-composer" data-role="composer">
        <input type="text" class="rg-ai-director-input" data-role="input" placeholder="Describe video or template to compose..." autocomplete="off" />
        <button type="submit" class="rg-ai-director-send" data-role="send" title="Send" aria-label="Send">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    `;

    shell.appendChild(panel);

    panel.querySelector('.rg-ai-director-close').addEventListener('click', () => {
      setOpen(shell, false);
    });

    panel.querySelectorAll('.rg-ai-starter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const inp = panel.querySelector('[data-role="input"]');
        if (inp) {
          inp.value = chip.getAttribute('data-prompt') || '';
          submitPrompt(shell, inp.value);
          inp.value = '';
        }
      });
    });

    panel.querySelector('[data-role="composer"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = panel.querySelector('[data-role="input"]');
      if (!inp || !inp.value.trim() || state.isSending) return;
      const val = inp.value.trim();
      inp.value = '';
      submitPrompt(shell, val);
    });

    renderMessages(panel);
    return panel;
  }

  function renderMessages(panel) {
    const feed = panel.querySelector('[data-role="messages"]');
    if (!feed) return;

    feed.innerHTML = state.messages.map((msg) => {
      if (msg.role === 'user') {
        return `
          <div class="rg-ai-msg rg-ai-msg-user">
            <div class="rg-ai-bubble-user">${escapeHtml(msg.text)}</div>
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
          <button type="button" class="rg-ai-save-tpl-btn" data-action="save-blueprint-template">★ Save as Reusable Template</button>
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

    state.messages.push({ role: 'user', text: prompt });
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
          availableTemplates: getCatalogSummary()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.blueprint) {
        throw new Error(data.error || 'Failed to compose sequence');
      }

      state.lastBlueprint = data.blueprint;
      if (typeof window.composeProjectFromBlueprint === 'function') {
        window.composeProjectFromBlueprint(data.blueprint);
      }

      state.messages.push({
        role: 'assistant',
        text: data.summary || 'Composed your Intro, Body, and Outro sequence.',
        blueprint: data.blueprint
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
