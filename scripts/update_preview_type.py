with open('magnates-studio/public/js/tester-templates/tester-templates-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"previewType": "circularSpinFlash"', '"previewType": "circular-spin-flashlight-glitch"')
with open('magnates-studio/public/js/tester-templates/tester-templates-data.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated previewType in tester-templates-data.js')
