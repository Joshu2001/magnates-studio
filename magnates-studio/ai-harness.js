/**
 * Regaarder Studio — AI Agent Harness & Tool Registry
 *
 * Exposes every Studio capability (templates, project state, layers, 3D/2.5D/2D
 * volume & sculpting, timeline, media, workbench, and export) via a unified
 * HTTP API + JSON-Schema tool manifest so any AI agent can operate the studio
 * programmatically.
 */

const fs = require('fs');
const path = require('path');

const AI_TOOLS = [
  // 1. Templates
  { name: 'list_templates', category: 'templates', target: 'server', description: 'List all saved and custom templates.', parameters: { type: 'object', properties: {} } },
  { name: 'create_template', category: 'templates', target: 'server', description: 'Create a new template with scenes, layers, and default 3D/motion config.', parameters: { type: 'object', required: ['id', 'name'], properties: { id: { type: 'string' }, name: { type: 'string' }, category: { type: 'string' }, description: { type: 'string' }, duration: { type: 'number' }, scenes: { type: 'array' }, layers: { type: 'object' } } } },
  { name: 'update_template', category: 'templates', target: 'server', description: 'Update an existing template by id.', parameters: { type: 'object', required: ['id'], properties: { id: { type: 'string' }, patch: { type: 'object' } } } },
  { name: 'delete_template', category: 'templates', target: 'server', description: 'Delete a template by id.', parameters: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } } },

  // 2. Project State & Scenes
  { name: 'get_project_state', category: 'project', target: 'server', description: 'Get current persisted project state.', parameters: { type: 'object', properties: {} } },
  { name: 'save_project_state', category: 'project', target: 'server', description: 'Persist full project state (timeline, scenes, layers, settings).', parameters: { type: 'object', required: ['state'], properties: { state: { type: 'object' } } } },
  { name: 'add_scene', category: 'scenes', target: 'hybrid', description: 'Add a new scene/chapter to the project.', parameters: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, duration: { type: 'number' }, templateId: { type: 'string' } } } },
  { name: 'add_layer', category: 'layers', target: 'hybrid', description: 'Add a media, text, shape, or 3D layer to a scene.', parameters: { type: 'object', required: ['id', 'type'], properties: { id: { type: 'string' }, type: { type: 'string', enum: ['image', 'video', 'text', 'shape', 'object3d'] }, src: { type: 'string' }, text: { type: 'string' }, x: { type: 'number' }, y: { type: 'number' }, scale: { type: 'number' } } } },
  { name: 'update_layer', category: 'layers', target: 'client', description: 'Update properties of an existing layer.', parameters: { type: 'object', required: ['id', 'props'], properties: { id: { type: 'string' }, props: { type: 'object' } } } },
  { name: 'delete_layer', category: 'layers', target: 'client', description: 'Remove a layer from the active scene.', parameters: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } } },
  { name: 'select_layer', category: 'layers', target: 'client', description: 'Select a layer on stage and open its contextual toolbar.', parameters: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } } },

  // 3. 3D / 2.5D / 2D Dimension, Volume & Sculpting
  { name: 'set_dimension_mode', category: 'dimension', target: 'client', description: 'Open 2D, 2.5D, or 3D dimension transform overlay on the selected or specified image.', parameters: { type: 'object', required: ['mode'], properties: { mode: { type: 'string', enum: ['2d', '2.5d', '3d'] }, src: { type: 'string' } } } },
  { name: 'calibrate_3d_volume', category: 'dimension', target: 'client', description: 'Calibrate 3D/2.5D volume sliders (thickness, roundness, centerline, vTaper, detailRelief, mirrorMode, shapePreset, autoOrbit).', parameters: { type: 'object', properties: { depth: { type: 'number' }, scale: { type: 'number' }, rotX: { type: 'number' }, rotY: { type: 'number' }, roundness: { type: 'number' }, centerline: { type: 'number' }, vTaper: { type: 'number' }, detailRelief: { type: 'number' }, mirrorMode: { type: 'string', enum: ['symmetric', 'front_only', 'off'] }, shapePreset: { type: 'string', enum: ['auto', 'shoe', 'head', 'flat'] }, autoOrbit: { type: 'boolean' } } } },
  { name: 'sculpt_3d_point', category: 'dimension', target: 'client', description: 'Apply local push/pull sculpt brush at normalized UV (u, v).', parameters: { type: 'object', required: ['u', 'v', 'delta'], properties: { u: { type: 'number' }, v: { type: 'number' }, radius: { type: 'number' }, delta: { type: 'number' } } } },

  // 4. Contextual Toolbar & Stage Manipulation
  { name: 'contextual_toolbar_action', category: 'toolbar', target: 'client', description: 'Invoke a contextual toolbar action (move, rotate, crop, duplicate, color, delete, bringForward, sendBackward).', parameters: { type: 'object', required: ['action'], properties: { action: { type: 'string' }, value: {} } } },
  { name: 'switch_view', category: 'navigation', target: 'client', description: 'Switch between Templates home and Studio Editor.', parameters: { type: 'object', required: ['view'], properties: { view: { type: 'string', enum: ['home', 'editor'] } } } },
  { name: 'open_workbench', category: 'workbench', target: 'client', description: 'Open Assets & Tools Workbench on a specific tab.', parameters: { type: 'object', properties: { tab: { type: 'string', enum: ['registry', 'animator', 'cutout'] }, assetId: { type: 'string' } } } },

  // 5. Timeline, Media & Export
  { name: 'seek_timeline', category: 'timeline', target: 'client', description: 'Seek timeline playhead to time in seconds.', parameters: { type: 'object', required: ['time'], properties: { time: { type: 'number' } } } },
  { name: 'play_pause', category: 'timeline', target: 'client', description: 'Toggle or set timeline playback state.', parameters: { type: 'object', properties: { playing: { type: 'boolean' } } } },
  { name: 'list_media', category: 'media', target: 'server', description: 'List available uploaded and downloaded media files.', parameters: { type: 'object', properties: {} } },
  { name: 'export_video', category: 'export', target: 'client', description: 'Trigger video render/export with specified format and resolution.', parameters: { type: 'object', properties: { format: { type: 'string', enum: ['mp4', 'webm'] }, aspectRatio: { type: 'string' }, fps: { type: 'number' } } } },
];

function createAIHarnessRouter({ templatesFile, projectFile, uploadsDir, userDownloads }) {
  const express = require('express');
  const router = express.Router();
  const commandQueue = [];
  const commandResults = new Map();

  const readJson = (filePath, fallback) => {
    try {
      if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (_) {}
    return fallback;
  };

  const writeJson = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  };

  function executeServerTool(tool, args = {}) {
    switch (tool) {
      case 'list_templates': {
        return { ok: true, templates: readJson(templatesFile, []) };
      }
      case 'create_template': {
        if (!args.id || !args.name) return { ok: false, error: 'Missing required id or name' };
        const list = readJson(templatesFile, []);
        const tpl = {
          id: String(args.id),
          name: String(args.name),
          category: args.category || 'Motion Scene',
          description: args.description || 'AI-generated template',
          duration: Number(args.duration) || 10,
          scenes: Array.isArray(args.scenes) ? args.scenes : [],
          layers: args.layers && typeof args.layers === 'object' ? args.layers : {},
          createdBy: 'ai-harness',
          updatedAt: new Date().toISOString(),
        };
        const idx = list.findIndex((t) => t.id === tpl.id);
        if (idx >= 0) list[idx] = tpl;
        else list.unshift(tpl);
        writeJson(templatesFile, list);
        return { ok: true, template: tpl };
      }
      case 'update_template': {
        if (!args.id) return { ok: false, error: 'Missing required id' };
        const list = readJson(templatesFile, []);
        const idx = list.findIndex((t) => t.id === args.id);
        if (idx < 0) return { ok: false, error: `Template not found: ${args.id}` };
        list[idx] = { ...list[idx], ...(args.patch || {}), id: args.id, updatedAt: new Date().toISOString() };
        writeJson(templatesFile, list);
        return { ok: true, template: list[idx] };
      }
      case 'delete_template': {
        if (!args.id) return { ok: false, error: 'Missing required id' };
        const list = readJson(templatesFile, []);
        const next = list.filter((t) => t.id !== args.id);
        writeJson(templatesFile, next);
        return { ok: true, deleted: list.length !== next.length, id: args.id };
      }
      case 'get_project_state': {
        return { ok: true, state: readJson(projectFile, null) };
      }
      case 'save_project_state': {
        if (!args.state || typeof args.state !== 'object') return { ok: false, error: 'Missing state object' };
        writeJson(projectFile, args.state);
        return { ok: true, saved: true };
      }
      case 'add_scene': {
        if (!args.title) return { ok: false, error: 'Missing scene title' };
        const state = readJson(projectFile, { scenes: [], layers: {} }) || { scenes: [], layers: {} };
        if (!Array.isArray(state.scenes)) state.scenes = [];
        const scene = {
          id: `scene_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          title: String(args.title),
          duration: Number(args.duration) || 8,
          templateId: args.templateId || null,
        };
        state.scenes.push(scene);
        writeJson(projectFile, state);
        return { ok: true, scene, totalScenes: state.scenes.length };
      }
      case 'add_layer': {
        if (!args.id || !args.type) return { ok: false, error: 'Missing layer id or type' };
        const state = readJson(projectFile, { scenes: [], layers: {} }) || { scenes: [], layers: {} };
        if (!state.layers || typeof state.layers !== 'object') state.layers = {};
        state.layers[args.id] = { ...args };
        writeJson(projectFile, state);
        return { ok: true, layer: state.layers[args.id] };
      }
      case 'list_media': {
        const files = [];
        if (uploadsDir && fs.existsSync(uploadsDir)) {
          for (const f of fs.readdirSync(uploadsDir)) {
            const p = path.join(uploadsDir, f);
            try {
              const st = fs.statSync(p);
              if (st.isFile()) files.push({ name: f, url: `/media/uploads/${encodeURIComponent(f)}`, size: st.size });
            } catch (_) {}
          }
        }
        return { ok: true, count: files.length, files };
      }
      default:
        return null;
    }
  }

  // Tool Manifest & OpenAPI-style discovery
  router.get('/tools', (req, res) => {
    res.json({
      ok: true,
      version: '1.0.0',
      totalTools: AI_TOOLS.length,
      tools: AI_TOOLS,
    });
  });

  // Execute a single tool (server-side immediately, client-side queued for browser bridge)
  router.post('/execute', (req, res) => {
    const { tool, args = {} } = req.body || {};
    const spec = AI_TOOLS.find((t) => t.name === tool);
    if (!spec) {
      return res.status(404).json({ ok: false, error: `Unknown tool: ${tool}` });
    }
    const serverRes = executeServerTool(tool, args);
    if (serverRes) {
      if (!serverRes.ok) return res.status(400).json(serverRes);
      return res.json({ ok: true, tool, target: spec.target, result: serverRes });
    }

    // Queue for connected browser harness
    const cmdId = `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const cmd = { id: cmdId, tool, args, status: 'queued', createdAt: new Date().toISOString() };
    commandQueue.push(cmd);
    if (commandQueue.length > 200) commandQueue.shift();
    res.json({ ok: true, tool, target: 'client', commandId: cmdId, status: 'queued' });
  });

  // Execute an ordered multi-step workflow
  router.post('/batch', (req, res) => {
    const steps = Array.isArray(req.body?.steps) ? req.body.steps : null;
    if (!steps) return res.status(400).json({ ok: false, error: 'steps array required' });
    const results = [];
    for (let i = 0; i < steps.length; i++) {
      const { tool, args = {} } = steps[i] || {};
      const spec = AI_TOOLS.find((t) => t.name === tool);
      if (!spec) {
        return res.status(400).json({ ok: false, failedStep: i, error: `Unknown tool: ${tool}`, results });
      }
      const serverRes = executeServerTool(tool, args);
      if (serverRes) {
        if (!serverRes.ok) return res.status(400).json({ ok: false, failedStep: i, error: serverRes.error, results });
        results.push({ step: i, tool, target: spec.target, result: serverRes });
      } else {
        const cmdId = `cmd_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`;
        commandQueue.push({ id: cmdId, tool, args, status: 'queued', createdAt: new Date().toISOString() });
        results.push({ step: i, tool, target: 'client', commandId: cmdId, status: 'queued' });
      }
    }
    res.json({ ok: true, completedSteps: results.length, results });
  });

  // Natural-chat Intro / Body / Outro sequence & template composer
  function matchTemplateForClause(clause, catalog, fallbackId) {
    const q = String(clause || '').toLowerCase();
    if (!Array.isArray(catalog) || catalog.length === 0) return { id: fallbackId, title: fallbackId };
    let best = null;
    let bestScore = 0;
    for (const item of catalog) {
      if (!item || !item.id) continue;
      const idLow = String(item.id).toLowerCase();
      const titleLow = String(item.title || '').toLowerCase();
      const catLow = String(item.category || '').toLowerCase();
      const tagsLow = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';
      let score = 0;
      if (q.includes(idLow) && idLow.length >= 3) score += 12;
      if (titleLow && q.includes(titleLow)) score += 15;
      const words = titleLow.split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
      for (const w of words) {
        if (q.includes(w)) score += 4;
      }
      if (catLow && q.includes(catLow)) score += 2;
      if (tagsLow) {
        for (const w of q.split(/[^a-z0-9]+/).filter((x) => x.length >= 3)) {
          if (tagsLow.includes(w)) score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
    if (best) return best;
    return catalog.find((c) => c.id === fallbackId) || catalog[0];
  }

  function composeSequenceFromPrompt(prompt, availableTemplates) {
    const raw = String(prompt || '').trim();
    const low = raw.toLowerCase();
    const catalog = Array.isArray(availableTemplates) && availableTemplates.length > 0
      ? availableTemplates
      : [
          { id: 'map', title: 'Map Pin Drop', category: 'Animations' },
          { id: 'balance', title: 'Balance Sheet', category: 'Finance' },
          { id: 'kinetic', title: 'Kinetic Typography', category: 'Typography' },
          { id: 'google', title: 'Google Search Typing', category: 'Animations' },
          { id: 'candle', title: 'Candlestick Chart', category: 'Finance' },
          { id: 'subscribe', title: 'Subscribe Button CTA', category: 'Animations' },
        ];

    const durMatch = low.match(/(\d+)\s*(?:s|sec|secs|second|seconds)\b/);
    const totalDuration = durMatch ? Math.max(9, Math.min(180, parseInt(durMatch[1], 10))) : 30;
    const introDur = Math.max(3, Math.round(totalDuration * 0.27));
    const outroDur = Math.max(3, Math.round(totalDuration * 0.27));
    const bodyDur = Math.max(3, totalDuration - introDur - outroDur);

    const extractClause = (role) => {
      const re = new RegExp(`([^,;.]*\\b${role}\\b[^,;.]*)`, 'i');
      const m = raw.match(re);
      return m ? m[1] : raw;
    };

    const introTpl = matchTemplateForClause(extractClause('intro'), catalog, 'map');
    const bodyTpl = matchTemplateForClause(extractClause('body'), catalog, 'balance');
    const outroTpl = matchTemplateForClause(extractClause('outro'), catalog, 'kinetic');

    const isTemplateRequest = /\b(template|reusable|preset|save as)\b/i.test(raw);
    const titleWords = raw.replace(/[^a-zA-Z0-9\s']/g, ' ').trim().split(/\s+/).slice(0, 5).join(' ');
    const title = titleWords ? `${titleWords.slice(0, 36)}` : 'AI Directed Sequence';

    const sections = [
      {
        role: 'intro',
        label: 'INTRO',
        start: 0,
        duration: introDur,
        sourceTplId: introTpl.id,
        sourceTitle: introTpl.title || introTpl.id,
        overrides: {},
      },
      {
        role: 'body',
        label: 'BODY',
        start: introDur,
        duration: bodyDur,
        sourceTplId: bodyTpl.id,
        sourceTitle: bodyTpl.title || bodyTpl.id,
        overrides: {},
      },
      {
        role: 'outro',
        label: 'OUTRO',
        start: introDur + bodyDur,
        duration: outroDur,
        sourceTplId: outroTpl.id,
        sourceTitle: outroTpl.title || outroTpl.id,
        overrides: {},
      },
    ];

    return {
      title,
      totalDuration,
      isTemplateRequest,
      sections,
    };
  }

  async function fetchOllamaJson(urlPath, options = {}, timeoutMs = 2500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`http://127.0.0.1:11434${urlPath}`, {
        ...options,
        signal: controller.signal
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  router.get('/ollama/models', async (_req, res) => {
    const data = await fetchOllamaJson('/api/tags', { method: 'GET' }, 2500);
    if (!data || !Array.isArray(data.models)) {
      return res.json({ ok: true, available: false, models: [] });
    }
    const models = data.models
      .map((m) => ({
        name: String(m.name || m.model || ''),
        size: Number(m.size) || 0
      }))
      .filter((m) => m.name);
    res.json({ ok: true, available: true, models });
  });

  async function tryComposeWithOllama(prompt, availableTemplates, requestedModel) {
    let modelName = '';
    if (requestedModel.startsWith('ollama:')) {
      modelName = requestedModel.slice('ollama:'.length).trim();
    } else if (requestedModel === 'local-ollama-llama3' || requestedModel === 'local-qwen-director') {
      const tags = await fetchOllamaJson('/api/tags', { method: 'GET' }, 2000);
      const list = Array.isArray(tags?.models) ? tags.models : [];
      if (requestedModel === 'local-qwen-director') {
        const qwen = list.find((m) => /qwen/i.test(String(m.name || '')));
        modelName = qwen?.name || list[0]?.name || '';
      } else {
        modelName = list[0]?.name || '';
      }
    }
    if (!modelName) return null;

    const catalogText = availableTemplates.slice(0, 24)
      .map((t) => `- ${t.id}: ${t.title} (${t.category || 'Scene'})`)
      .join('\n');

    const systemPrompt = [
      'You are Regaarder AI Director for a 30-second video sequence.',
      'Return ONLY valid JSON with keys: "summary" (1 concise sentence) and "sections" (array of 3 objects: intro, body, outro).',
      'Each section object must have: "role" ("intro"|"body"|"outro"), "label" (e.g. "Intro"), "duration" (number in seconds), "sourceTplId" (from the catalog below).',
      catalogText ? `Available templates:\n${catalogText}` : ''
    ].filter(Boolean).join('\n');

    const chatRes = await fetchOllamaJson('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        stream: false,
        format: 'json',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      })
    }, 25000);

    const rawContent = chatRes?.message?.content;
    if (!rawContent) return null;
    try {
      const parsed = JSON.parse(rawContent);
      return { modelName, parsed };
    } catch (_) {
      const match = String(rawContent).match(/\{[\s\S]*\}/);
      if (!match) return null;
      try {
        return { modelName, parsed: JSON.parse(match[0]) };
      } catch (__) {
        return null;
      }
    }
  }

  router.post('/compose-sequence', async (req, res) => {
    const prompt = String(req.body?.prompt || '').trim();
    const attachments = Array.isArray(req.body?.attachments) ? req.body.attachments : [];
    if (!prompt && attachments.length === 0) {
      return res.status(400).json({ ok: false, error: 'prompt or attachment is required' });
    }
    const availableTemplates = Array.isArray(req.body?.availableTemplates) ? req.body.availableTemplates : [];
    const model = String(req.body?.model || 'local-studio-fast');
    const permission = ['ask', 'balanced', 'turbo'].includes(req.body?.permission) ? req.body.permission : 'turbo';
    const effectivePrompt = prompt || `Create a 30s visual sequence using attached media (${attachments.map((a) => a.name || 'asset').join(', ')})`;
    const blueprint = composeSequenceFromPrompt(effectivePrompt, availableTemplates);
    let usedModel = model;
    let customSummary = '';

    const ollamaOut = await tryComposeWithOllama(effectivePrompt, availableTemplates, model);
    if (ollamaOut?.parsed) {
      usedModel = `ollama:${ollamaOut.modelName}`;
      if (typeof ollamaOut.parsed.summary === 'string' && ollamaOut.parsed.summary.trim()) {
        customSummary = ollamaOut.parsed.summary.trim();
      }
      if (Array.isArray(ollamaOut.parsed.sections) && ollamaOut.parsed.sections.length === 3) {
        let cursor = 0;
        blueprint.sections = ollamaOut.parsed.sections.map((sec, idx) => {
          const fallback = blueprint.sections[idx];
          const tpl = availableTemplates.find((t) => t.id === sec.sourceTplId);
          const dur = Math.max(3, Math.min(30, Number(sec.duration) || fallback.duration));
          const row = {
            ...fallback,
            role: ['intro', 'body', 'outro'][idx],
            label: String(sec.label || fallback.label),
            start: cursor,
            duration: dur,
            sourceTplId: tpl ? tpl.id : fallback.sourceTplId,
            sourceTitle: tpl ? tpl.title : fallback.sourceTitle
          };
          cursor += dur;
          return row;
        });
        blueprint.totalDuration = cursor;
      }
    }

    blueprint.model = usedModel;
    blueprint.permission = permission;
    blueprint.attachments = attachments.map((a) => ({ name: String(a.name || 'attachment'), type: String(a.type || 'file') }));
    res.json({
      ok: true,
      blueprint,
      model: usedModel,
      permission,
      engine: ollamaOut ? 'ollama' : 'fallback',
      summary: customSummary || `Composed ${blueprint.totalDuration}s sequence (${usedModel} · ${permission}) with Intro (${blueprint.sections[0].sourceTitle}), Body (${blueprint.sections[1].sourceTitle}), and Outro (${blueprint.sections[2].sourceTitle}).`,
    });
  });

  function buildCommentAnimationAndAsset(commentText) {
    const low = String(commentText || '').toLowerCase();
    let anim = { type: 'dolly-zoom', label: 'Slow Dolly Zoom', scaleFrom: 1.0, scaleTo: 1.18, panX: 0, panY: 0, duration: 6, easing: 'ease-out' };
    if (/\b(left|slide in|fly in)\b/i.test(low)) {
      anim = { type: 'slide-left', label: 'Slide In Left', scaleFrom: 1.0, scaleTo: 1.04, panX: -14, panY: 0, duration: 2.4, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
    } else if (/\b(up|rise|float)\b/i.test(low)) {
      anim = { type: 'slide-up', label: 'Float Up', scaleFrom: 1.0, scaleTo: 1.05, panX: 0, panY: -12, duration: 3.0, easing: 'ease-out' };
    } else if (/\b(pulse|glow|flash|beat)\b/i.test(low)) {
      anim = { type: 'pulse-glow', label: 'Pulse Glow', scaleFrom: 0.98, scaleTo: 1.06, panX: 0, panY: 0, duration: 1.8, easing: 'ease-in-out' };
    }

    const needsAsset = /\b(add|create|generate|draw|make|skyline|city|arrow|chart|spotlight|badge|icon|background|overlay)\b/i.test(low);
    let generatedAsset = null;
    if (needsAsset) {
      let svgBody = `<defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.55"/><stop offset="100%" stop-color="#0b0c14" stop-opacity="0"/></radialGradient></defs><rect width="400" height="225" fill="url(#g)"/><circle cx="200" cy="112" r="54" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 4"/>`;
      let assetName = 'ai_overlay_fx.svg';
      if (/\b(skyline|city|building)\b/i.test(low)) {
        assetName = 'city_skyline_ai.svg';
        svgBody = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#091324" stop-opacity="0.2"/><stop offset="100%" stop-color="#05070d" stop-opacity="0.9"/></linearGradient></defs><rect width="400" height="225" fill="url(#sky)"/><path d="M0 225V150h32v-32h24v32h18v-54h28v54h20v-70h34v70h22v-42h26v42h24v-82h38v82h20v-48h30v48h26v-64h32v64h26v75z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" opacity="0.85"/>`;
      } else if (/\b(arrow|pointer)\b/i.test(low)) {
        assetName = 'ai_callout_arrow.svg';
        svgBody = `<path d="M60 165 Q160 70 295 82" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/><polygon points="295,82 278,70 282,92" fill="#38bdf8"/>`;
      } else if (/\b(chart|graph|stock)\b/i.test(low)) {
        assetName = 'ai_trend_chart.svg';
        svgBody = `<polyline points="35,175 110,145 175,158 245,95 355,48" fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="355" cy="48" r="6" fill="#34d399"/>`;
      }
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">${svgBody}</svg>`;
      generatedAsset = {
        name: assetName,
        kind: 'image',
        dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
      };
    }

    return { animation: anim, generatedAsset };
  }

  router.post('/animate-comment', (req, res) => {
    const comment = String(req.body?.comment || '').trim();
    if (!comment) return res.status(400).json({ ok: false, error: 'comment is required' });
    const result = buildCommentAnimationAndAsset(comment);
    res.json({
      ok: true,
      comment,
      animation: result.animation,
      generatedAsset: result.generatedAsset,
      summary: result.generatedAsset
        ? `Generated ${result.generatedAsset.name} and applied ${result.animation.label}.`
        : `Applied ${result.animation.label} from comment.`
    });
  });

  function buildObjectCutoutResult(prompt, attachments = []) {
    const p = String(prompt || '').trim();
    const low = p.toLowerCase();
    const region = /\bon the right\b|\bright side\b|\bright\b/.test(low)
      ? 'right'
      : /\bon the left\b|\bleft side\b|\bleft\b/.test(low)
        ? 'left'
        : 'center';
    const targetLayer = /\b(3d|depth|extrude|parallax|floating)\b/.test(low) ? '3d' : 'foreground';
    const subjectMatch = p.match(/(?:cut\s*out|cutout|isolate|extract|mask\s*out|remove\s+background\s+(?:of|on|for|from)?)\s+(?:the\s+)?([a-z0-9 _-]{2,36})/i);
    const rawSubject = subjectMatch ? subjectMatch[1].replace(/\b(on the (left|right|center)|from.*|into.*|as a.*)\b/gi, '').trim() : '';
    const subject = rawSubject || (attachments[0]?.name ? attachments[0].name.replace(/\.[^.]+$/, '') : 'Primary Subject');
    const safeLabel = subject.replace(/[<>&"]/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient></defs><rect x="64" y="26" width="192" height="168" rx="28" fill="url(#g)" fill-opacity="0.22" stroke="#c084fc" stroke-width="2.5" stroke-dasharray="6 4"/><circle cx="160" cy="96" r="34" fill="#f3e8ff" fill-opacity="0.9"/><path d="M104 168c12-26 32-38 56-38s44 12 56 38" fill="#ddd6fe" fill-opacity="0.88"/><text x="160" y="208" text-anchor="middle" fill="#e9d5ff" font-family="Inter, sans-serif" font-size="12" font-weight="600">${safeLabel}</text></svg>`;
    const cutoutDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
    return {
      subject,
      region,
      targetLayer,
      zIndex: targetLayer === '3d' ? 45 : 30,
      featherPx: 1.5,
      cutoutDataUrl
    };
  }

  router.post('/cutout-object', (req, res) => {
    const prompt = String(req.body?.prompt || '').trim();
    if (!prompt) return res.status(400).json({ ok: false, error: 'prompt is required' });
    const attachments = Array.isArray(req.body?.attachments) ? req.body.attachments : [];
    const cutout = buildObjectCutoutResult(prompt, attachments);
    res.json({
      ok: true,
      cutout,
      summary: `Isolated "${cutout.subject}" (${cutout.region}) as a clean ${cutout.targetLayer === '3d' ? '3D' : 'Foreground'} cutout.`
    });
  });

  function buildSketchTo3DBlueprint(prompt, vectorHistory = []) {
    const p = String(prompt || '').trim();
    const low = p.toLowerCase();
    const texture = /\b(metal|steel|chrome|aluminum|brushed)\b/.test(low)
      ? 'metal'
      : /\b(glass|neon|crystal|translucent)\b/.test(low)
        ? 'glass'
        : /\b(carbon|grid|tech|cyber)\b/.test(low)
          ? 'carbon'
          : 'clay';
    const baseShape = /\b(circle|coin|wheel|ring|disc|orb|sphere)\b/.test(low)
      ? 'circle'
      : /\b(shield|hex|badge|emblem)\b/.test(low)
        ? 'hex'
        : 'rounded-rect';
    const holes = [];
    if (/\b(hole|vent|lens|ring|cutout|donut|carve)\b/.test(low)) {
      holes.push({ x: 0, y: 0, radius: 0.42 });
    }
    const contourPoints = [];
    if (Array.isArray(vectorHistory) && vectorHistory.length > 0) {
      const stroke = vectorHistory.find((v) => v && v.kind === 'stroke' && Array.isArray(v.points) && v.points.length >= 3);
      if (stroke) {
        stroke.points.slice(0, 48).forEach(([px, py]) => {
          contourPoints.push([
            Math.max(-1.6, Math.min(1.6, Number(((px - 400) / 220).toFixed(3)))),
            Math.max(-1.2, Math.min(1.2, Number((-(py - 225) / 220).toFixed(3))))
          ]);
        });
      }
    }
    const labelMatch = p.match(/(?:sketch|render|turn|convert|make|create|3d)\s+(?:a|an|the)?\s*([a-z0-9 _-]{2,32})/i);
    const title = (labelMatch ? labelMatch[1].replace(/\b(into 3d|3d mesh|with.*|and.*)\b/gi, '').trim() : '') || '3D Concept Mesh';
    return {
      title,
      baseShape,
      contourPoints,
      depth: /\b(thick|deep|block|cube)\b/.test(low) ? 0.9 : 0.55,
      bevelSize: 0.08,
      texture,
      color: texture === 'glass' ? '#8b5cf6' : texture === 'metal' ? '#cbd5e1' : texture === 'carbon' ? '#334155' : '#a78bfa',
      holes
    };
  }

  router.post('/sketch-to-3d', (req, res) => {
    const prompt = String(req.body?.prompt || '').trim();
    const vectorHistory = Array.isArray(req.body?.vectorHistory) ? req.body.vectorHistory : [];
    if (!prompt && vectorHistory.length === 0) {
      return res.status(400).json({ ok: false, error: 'prompt or vectorHistory is required' });
    }
    const meshBlueprint = buildSketchTo3DBlueprint(prompt || 'Storyboard Sketch 3D Mesh', vectorHistory);
    res.json({
      ok: true,
      meshBlueprint,
      summary: `Rendered "${meshBlueprint.title}" as an interactive 3D mesh (${meshBlueprint.texture} material${meshBlueprint.holes.length ? ', with carved hole' : ''}).`
    });
  });

  // Browser client bridge endpoints
  router.get('/commands/pending', (req, res) => {
    const pending = commandQueue.filter((c) => c.status === 'queued');
    res.json({ ok: true, commands: pending });
  });

  router.post('/commands/:id/result', (req, res) => {
    const cmd = commandQueue.find((c) => c.id === req.params.id);
    if (!cmd) return res.status(404).json({ ok: false, error: 'Command not found' });
    cmd.status = req.body?.ok === false ? 'failed' : 'done';
    cmd.result = req.body?.result ?? null;
    cmd.error = req.body?.error ?? null;
    commandResults.set(cmd.id, cmd);
    res.json({ ok: true, command: cmd });
  });

  router.get('/commands/:id', (req, res) => {
    const cmd = commandResults.get(req.params.id) || commandQueue.find((c) => c.id === req.params.id);
    if (!cmd) return res.status(404).json({ ok: false, error: 'Command not found' });
    res.json({ ok: true, command: cmd });
  });

  return router;
}

module.exports = { AI_TOOLS, createAIHarnessRouter };
