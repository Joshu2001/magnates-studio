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
