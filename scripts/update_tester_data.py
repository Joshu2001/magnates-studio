with open('magnates-studio/public/js/tester-templates/tester-templates-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_tpl_json = '''  {
    "id": "circular-spin-flashlight-glitch",
    "title": "Circular Arc Spin & Paparazzi Flashlight Glitch Transition",
    "category": "Transitions",
    "origCategory": "Transitions",
    "badge": "CINEMATIC BURST",
    "difficulty": "Easy",
    "timeToApply": "5s",
    "previewGradient": "linear-gradient(135deg, rgba(3, 7, 18, 0.95), rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.95))",
    "description": "Image initiates a circular arc spin from left over head down to right, accompanied by falling particles and a 4-flash photoflash sequence (1 slow bloom, 3 fast paparazzi bursts) culminating in a digital glitch transition to a second person.",
    "tags": [
      "Circular Spin",
      "Doodle Arc",
      "Flashlight",
      "Paparazzi Flash",
      "Falling Particles",
      "Glitch Transition",
      "AI Subject Reveal"
    ],
    "previewType": "circularSpinFlash",
    "isTesterTemplate": true,
    "defaultImage": "/generated_person_1.jpg",
    "secondaryImage": "/generated_person_2.jpg"
  },
'''

anchor = 'window.NEW_TESTER_TEMPLATES = [\n'
if anchor in text and 'circular-spin-flashlight-glitch' not in text:
    text = text.replace(anchor, anchor + new_tpl_json)
    with open('magnates-studio/public/js/tester-templates/tester-templates-data.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Added circular-spin-flashlight-glitch to tester-templates-data.js')
else:
    print('Already present or anchor missing')
