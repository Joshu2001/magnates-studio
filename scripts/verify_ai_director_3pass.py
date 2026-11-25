import json
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
STUDIO = os.path.join(ROOT, 'magnates-studio')
PUBLIC = os.path.join(STUDIO, 'public')

def fail(msg):
    print(f'  FAIL: {msg}')
    return False

def run_pass_1():
    print('=== PASS 1: Architecture, Syntax & Scalability ===')
    ok = True
    js_files = [
        os.path.join(STUDIO, 'ai-harness.js'),
        os.path.join(PUBLIC, 'js', 'regaarder-ai-director.js'),
        os.path.join(PUBLIC, 'js', 'regaarder-redesign.js'),
        os.path.join(PUBLIC, 'js', 'app.js'),
        os.path.join(PUBLIC, 'js', 'tpl-contextual-inspector.js'),
    ]
    for jf in js_files:
        res = subprocess.run(['node', '--check', jf], capture_output=True, text=True)
        if res.returncode != 0:
            ok = fail(f'Syntax error in {os.path.basename(jf)}: {res.stderr.strip()}')
        else:
            print(f'  OK syntax: {os.path.basename(jf)}')

    index_html = open(os.path.join(PUBLIC, 'index.html'), encoding='utf-8').read()
    idx_dir = index_html.find('js/regaarder-ai-director.js')
    idx_red = index_html.find('js/regaarder-redesign.js')
    if idx_dir < 0 or idx_red < 0 or idx_dir > idx_red:
        ok = fail('index.html must load regaarder-ai-director.js before regaarder-redesign.js')
    else:
        print('  OK script order: regaarder-ai-director.js -> regaarder-redesign.js')

    harness = open(os.path.join(STUDIO, 'ai-harness.js'), encoding='utf-8').read()
    if "router.post('/compose-sequence'" not in harness or 'composeSequenceFromPrompt' not in harness:
        ok = fail('ai-harness.js missing POST /compose-sequence or composeSequenceFromPrompt')
    else:
        print('  OK backend endpoint: POST /api/ai/compose-sequence')
    return ok

def run_pass_2():
    print('\n=== PASS 2: UI Consistency & Preview Alignment ===')
    ok = True
    redesign = open(os.path.join(PUBLIC, 'js', 'regaarder-redesign.js'), encoding='utf-8').read()
    css = open(os.path.join(PUBLIC, 'css', 'regaarder-redesign.css'), encoding='utf-8').read()

    if "id: 'ai', label: 'AI Director Chat'" not in redesign or 'rg-rail-btn-ai' not in redesign:
        ok = fail('Left rail missing custom AI Director button')
    else:
        print('  OK left rail AI button (below Settings)')

    if 'window.RegaarderAIDirector.toggle(shell)' not in redesign or 'window.RegaarderAIDirector.close(shell)' not in redesign:
        ok = fail('Left rail / inspector tab toggle integration missing')
    else:
        print('  OK right sidebar toggle & 4-tab inspector restore')

    required_css = [
        '.rg-rail-btn-ai', '.rg-ai-director-panel', '.rg-inspector-shell.is-ai-director-open',
        '.rg-ai-empty-state', '.rg-ai-empty-row', '.rg-ai-composer-shell', '.rg-ai-composer-row',
        '.rg-inspector-shell .rg-ai-director-input', '.rg-inspector-shell .rg-ai-model-select',
        '.rg-inspector-shell .rg-ai-perm-select', '.rg-ai-plus-btn', '.rg-ai-plus-menu',
        '.rg-ai-att-remove', '.rg-ai-voice-btn', '.rg-ai-director-send'
    ]
    for sel in required_css:
        if sel not in css:
            ok = fail(f'Missing CSS selector in regaarder-redesign.css: {sel}')

    director_js = open(os.path.join(PUBLIC, 'js', 'regaarder-ai-director.js'), encoding='utf-8').read()
    for feat in [
        'What are we making?',
        'Start with a scene or a reusable template.',
        'Build a documentary intro',
        'Create a reusable template',
        'Describe a scene or template...',
        "addEventListener('paste'",
        'local-studio-fast',
        'online-gemini-pro',
        'toggleVoiceDictation',
        'captureStageFrameAttachment'
    ]:
        if feat not in director_js:
            ok = fail(f'regaarder-ai-director.js missing Image 1 parity feature: {feat}')
    if 'rg-ai-director-badge' in director_js:
        ok = fail('Header should match Image 1 (no extra rg-ai-director-badge pill)')
    if ok:
        print('  OK Image 1 parity: centered empty state, single-row composer, +, paste, model, permission, voice')
    return ok

def run_pass_3():
    print('\n=== PASS 3: Runtime Intro/Body/Outro Composition ===')
    ok = True
    app_js = open(os.path.join(PUBLIC, 'js', 'app.js'), encoding='utf-8').read()
    for sym in ['window.composeProjectFromBlueprint', 'window.selectStoryboardSceneByIndex', '__rgPreservingStoryboardScenes']:
        if sym not in app_js:
            ok = fail(f'app.js missing {sym}')
    if ok:
        print('  OK app.js blueprint & storyboard scene preservation hooks')

    node_test = r"""
const express = require('express');
const http = require('http');
const { createAIHarnessRouter } = require('./ai-harness');
const app = express();
app.use(express.json());
app.use('/api/ai', createAIHarnessRouter({
  templatesFile: './custom_templates.json',
  projectFile: './project_state.json',
  uploadsDir: './uploads',
  userDownloads: '.'
}));
const server = app.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  const payload = JSON.stringify({
    prompt: "Create a 30s documentary video about Apple's rise: borrow Map Pin Drop for intro, Balance Sheet for Body, and Kinetic Typography for Outro",
    model: 'online-gemini-pro',
    permission: 'ask',
    attachments: [{ name: 'ref.png', type: 'image/png', kind: 'image' }],
    availableTemplates: [
      { id: 'map', title: 'Map Pin Drop', category: 'Animations' },
      { id: 'balance', title: 'Balance Sheet', category: 'Finance' },
      { id: 'kinetic', title: 'Kinetic Typography', category: 'Typography' }
    ]
  });
  const req = http.request({ hostname: '127.0.0.1', port, path: '/api/ai/compose-sequence', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } }, (res) => {
    let body = '';
    res.on('data', (c) => body += c);
    res.on('end', () => {
      server.close();
      console.log(body);
    });
  });
  req.write(payload);
  req.end();
});
"""
    res = subprocess.run(['node', '-e', node_test], cwd=STUDIO, capture_output=True, text=True)
    if res.returncode != 0:
        return fail(f'Node runtime test failed: {res.stderr.strip()}')
    try:
        data = json.loads(res.stdout.strip())
    except Exception as e:
        return fail(f'Invalid JSON from /api/ai/compose-sequence: {e} | {res.stdout}')

    bp = data.get('blueprint', {})
    secs = bp.get('sections', [])
    if not data.get('ok') or bp.get('totalDuration') != 30 or len(secs) != 3:
        return fail(f'Unexpected blueprint: {data}')
    roles = [s.get('role') for s in secs]
    tpls = [s.get('sourceTplId') for s in secs]
    if roles != ['intro', 'body', 'outro'] or tpls != ['map', 'balance', 'kinetic'] or bp.get('model') != 'online-gemini-pro' or bp.get('permission') != 'ask' or len(bp.get('attachments', [])) != 1:
        return fail(f'Mismatch in roles/templates/meta: roles={roles}, tpls={tpls}, bp={bp}')
    print(f'  OK /api/ai/compose-sequence -> roles={roles}, templates={tpls}, model={bp.get("model")}, perm={bp.get("permission")}, totalDuration={bp.get("totalDuration")}s')
    return ok

p1 = run_pass_1()
p2 = run_pass_2()
p3 = run_pass_3()
print(f'\nSUMMARY: PASS1={"PASS" if p1 else "FAIL"}, PASS2={"PASS" if p2 else "FAIL"}, PASS3={"PASS" if p3 else "FAIL"}')
sys.exit(0 if (p1 and p2 and p3) else 1)
