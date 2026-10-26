with open('magnates-studio/public/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = '  <script src="js/tpl-contextual-inspector.js?v='
rep = """  <script src="js/cinematic-light-trail-engine.js?v=1"></script>
  <script src="js/circular-spin-flashlight-glitch-engine.js?v=1"></script>
  <script src="js/tpl-contextual-inspector.js?v="""

if target in text and 'circular-spin-flashlight-glitch-engine.js' not in text:
    text = text.replace(target, rep, 1)
    with open('magnates-studio/public/index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Inserted scripts into index.html')
else:
    print('Already present or target not found')
