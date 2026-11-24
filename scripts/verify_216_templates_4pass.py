import os
import re
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC = os.path.join(ROOT, 'magnates-studio', 'public')

app_path = os.path.join(PUBLIC, 'js', 'app.js')
snaps_path = os.path.join(PUBLIC, 'js', 'tpl-snapshots.js')
tester_path = os.path.join(PUBLIC, 'js', 'tester-templates', 'tester-templates-data.js')
bundle_path = os.path.join(PUBLIC, 'js', 'tester-templates', 'tester-templates.bundle.js')
redesign_path = os.path.join(PUBLIC, 'js', 'regaarder-redesign.js')

app = open(app_path, encoding='utf-8').read()
snaps = open(snaps_path, encoding='utf-8').read()
tester = open(tester_path, encoding='utf-8').read()
bundle = open(bundle_path, encoding='utf-8').read()
redesign = open(redesign_path, encoding='utf-8').read()

lines = app.splitlines()

# Parse EFFECT_TEMPLATES_DATA (133)
start_idx = next(i for i, l in enumerate(lines) if 'const EFFECT_TEMPLATES_DATA = [' in l)
end_idx = next(i for i in range(start_idx, len(lines)) if lines[i].strip() == '];')

eff_templates = []
cur = {}
for i in range(start_idx, end_idx):
    l = lines[i]
    m_id = re.search(r"^\s*id:\s*['\"]([^'\"]+)['\"]", l)
    if m_id:
        if cur: eff_templates.append(cur)
        cur = {'id': m_id.group(1), 'hidden': False, 'title': '', 'defaultImage': ''}
    m_t = re.search(r"^\s*title:\s*['\"](.+?)['\"],?\s*$", l)
    if m_t and cur: cur['title'] = m_t.group(1)
    m_img = re.search(r"^\s*defaultImage:\s*(?:['\"]([^'\"]+)['\"]|`([^`]+)`)", l)
    if m_img and cur: cur['defaultImage'] = m_img.group(1) or m_img.group(2) or ''
    if 'hidden: true' in l and cur: cur['hidden'] = True
if cur: eff_templates.append(cur)

# Parse NEW_TESTER_TEMPLATES (83)
tester_blocks = re.findall(r'\{\s*"id":\s*"([^"]+)".*?"title":\s*"([^"]+)".*?"previewType":\s*"([^"]+)".*?"defaultImage":\s*"([^"]*)"', tester, re.S)
tester_templates = [{'id': i, 'title': t, 'previewType': p, 'defaultImage': d, 'hidden': False} for i, t, p, d in tester_blocks]

all_templates = eff_templates + tester_templates
print(f"Loaded {len(eff_templates)} EFFECT_TEMPLATES_DATA + {len(tester_templates)} NEW_TESTER_TEMPLATES = {len(all_templates)} total templates.\n")

# =====================================================================
# PASS 1: Catalog & Thumbnail / Asset Integrity
# =====================================================================
print("=== PASS 1: Catalog & Thumbnail / Asset Integrity ===")
snap_keys = set(re.findall(r"^\s*['\"]?([a-z0-9_-]+)['\"]?\s*:", snaps, re.M | re.I))
p1_failures = []
for tpl in all_templates:
    tid = tpl['id']
    has_snap = tid in snap_keys
    img = tpl.get('defaultImage', '')
    if not has_snap:
        if not img:
            p1_failures.append((tid, 'Missing both snapshot and defaultImage'))
        elif img.startswith('/') and not img.startswith('//'):
            # Verify local asset exists under public/ (some live in public/ or public/assets/)
            rel = img.lstrip('/')
            p_direct = os.path.join(PUBLIC, rel)
            p_assets = os.path.join(PUBLIC, 'assets', rel)
            if not (os.path.exists(p_direct) or os.path.exists(p_assets)):
                # Only warn for visible templates without snap
                if not tpl['hidden']:
                    p1_failures.append((tid, f'Local defaultImage not found: {img}'))
print(f"Pass 1 checked {len(all_templates)} templates -> {len(p1_failures)} failures")
for f in p1_failures:
    print("  FAIL:", f)

# =====================================================================
# PASS 2: Unified Studio Routing (No Legacy Modal Interception)
# =====================================================================
print("\n=== PASS 2: Unified Studio Routing ===")
m_apply = re.search(r'function applySelectedHomepageTemplate\(templateId\)\s*\{(.*?)\n\}', app, re.S)
apply_body = m_apply.group(1) if m_apply else ''
has_legacy_map = 'dedicatedSuiteMap' in apply_body
routes_to_customizer = 'openTopTemplateCustomizer(tpl)' in apply_body
has_redesign_hook = 'window.openTopTemplateCustomizer = wrappedOpen' in redesign
has_4tab_inspector = all(tab in redesign for tab in ['Content', 'Motion', 'Look', 'Effects'])
has_3d_switcher = 'showStage3DSwitcher = !isSidebar3DManaged' in app

p2_failures = []
if has_legacy_map: p2_failures.append('dedicatedSuiteMap still present in applySelectedHomepageTemplate')
if not routes_to_customizer: p2_failures.append('openTopTemplateCustomizer(tpl) missing in applySelectedHomepageTemplate')
if not has_redesign_hook: p2_failures.append('regaarder-redesign.js wrapper missing')
if not has_4tab_inspector: p2_failures.append('4-tab inspector missing in regaarder-redesign.js')
if not has_3d_switcher: p2_failures.append('Video/3D stage switcher missing in openTopTemplateCustomizer')
print(f"Pass 2 checked unified routing & studio UI -> {len(p2_failures)} failures")
for f in p2_failures:
    print("  FAIL:", f)

# =====================================================================
# PASS 3: Hover Preview & Stage Alignment across all 216 Templates
# =====================================================================
print("\n=== PASS 3: Hover Preview & Stage Alignment ===")
m_bh = re.search(r'const BRIDGED_HOVER_TEMPLATE_IDS\s*=\s*new Set\(\[(.*?)\]\)', app, re.S)
bh_keys = set(re.findall(r"['\"]([^'\"]+)['\"]", m_bh.group(1))) if m_bh else set()
# Tester templates are dynamically added to BRIDGED_HOVER_TEMPLATE_IDS at L28629
for t in tester_templates:
    bh_keys.add(t['id'])

hover_region = '\n'.join(lines[28635:34055])
stage_region = '\n'.join(lines[37550:40540])

p3_failures = []
for tpl in all_templates:
    tid = tpl['id']
    if tpl['hidden']:
        continue
    if 'previewType' in tpl:
        ptype = tpl['previewType']
        in_bundle = (f"'{ptype}'" in bundle or f'"{ptype}"' in bundle)
        in_app_stage = (tid in stage_region or tid.startswith('regaarder-'))
        if not (in_bundle or in_app_stage):
            p3_failures.append((tid, f'Tester previewType {ptype} missing from bundle & stage'))
    else:
        in_hover = (f"'{tid}'" in hover_region or f'"{tid}"' in hover_region)
        in_stage = (f"'{tid}'" in stage_region or f'"{tid}"' in stage_region or tid.startswith('regaarder-'))
        in_bridge = (tid in bh_keys)
        if not (in_hover or in_stage):
            p3_failures.append((tid, 'Missing hover & stage preview handler'))
        if not (in_bridge or in_stage):
            p3_failures.append((tid, 'Not bridged to openTopTemplateCustomizer stage'))

# Specifically verify the 3 user-highlighted templates
for special in ['nonlinear-time-flash', 'light-rays-lens-leaks', 'monochromatic-crushed-grading']:
    if special not in snap_keys:
        p3_failures.append((special, 'Missing snapshot'))
    if f"tplId === '{special}'" not in hover_region:
        p3_failures.append((special, 'Missing hover/stage fx handler'))

print(f"Pass 3 checked all visible & tester templates -> {len(p3_failures)} failures")
for f in p3_failures:
    print("  FAIL:", f)

# =====================================================================
# PASS 4: JavaScript Syntax Validation
# =====================================================================
print("\n=== PASS 4: JavaScript Syntax Validation ===")
p4_failures = []
for js_file in [app_path, snaps_path, tester_path, bundle_path, redesign_path]:
    res = subprocess.run(['node', '--check', js_file], capture_output=True, text=True)
    if res.returncode != 0:
        p4_failures.append((os.path.basename(js_file), res.stderr.strip()))
    else:
        print(f"  OK: {os.path.basename(js_file)}")

print(f"\nSUMMARY: P1={len(p1_failures)}, P2={len(p2_failures)}, P3={len(p3_failures)}, P4={len(p4_failures)}")
total_fail = len(p1_failures) + len(p2_failures) + len(p3_failures) + len(p4_failures)
raise SystemExit(0 if total_fail == 0 else 1)
