with open("scripts/tv_static_snapshot.svg", "r", encoding="utf-8") as f:
    svg_code = f.read().strip()

snapshot_entry = f"""  SNAPSHOTS['static-transition'] = `data:image/svg+xml;utf8,${{encodeURIComponent(`{svg_code}`)}}`;\n"""

# 1. Update tpl-snapshots.js
with open("magnates-studio/public/js/tpl-snapshots.js", "r", encoding="utf-8") as f:
    snap_content = f.read()

target = "  window.tplGetSnapshot = function (id) {"
if "SNAPSHOTS['static-transition']" not in snap_content:
    if target in snap_content:
        snap_content = snap_content.replace(target, snapshot_entry + "\n" + target)
        with open("magnates-studio/public/js/tpl-snapshots.js", "w", encoding="utf-8") as f:
            f.write(snap_content)
        print("Successfully added SNAPSHOTS['static-transition'] to tpl-snapshots.js")
    else:
        print("Error: target not found in tpl-snapshots.js")
else:
    print("SNAPSHOTS['static-transition'] already present in tpl-snapshots.js")

# 2. Update tester-templates-data.js defaultImage for static-transition
with open("magnates-studio/public/js/tester-templates/tester-templates-data.js", "r", encoding="utf-8") as f:
    data_content = f.read()

old_needle = '"id": "static-transition"'
if old_needle in data_content:
    # Find the defaultImage line for static-transition
    idx = data_content.find(old_needle)
    default_img_idx = data_content.find('"defaultImage": "', idx)
    end_quote_idx = data_content.find('"\n  },', default_img_idx)
    if default_img_idx != -1 and end_quote_idx != -1:
        old_default_img_line = data_content[default_img_idx:end_quote_idx+1]
        data_content = data_content[:default_img_idx] + '"defaultImage": "/tv_static_thumbnail.svg"' + data_content[end_quote_idx+1:]
        with open("magnates-studio/public/js/tester-templates/tester-templates-data.js", "w", encoding="utf-8") as f:
            f.write(data_content)
        print("Successfully updated defaultImage for static-transition in tester-templates-data.js")
    else:
        print("Error: could not locate defaultImage for static-transition")
else:
    print("Error: id static-transition not found in tester-templates-data.js")
