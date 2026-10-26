with open('magnates-studio/public/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

bad = '<script src="js/cinematic-light-trail-engine.js?v=1></script>\n <script src=js/circular-spin-flashlight-glitch-engine.js?v=1></script>'
good = '<script src="js/cinematic-light-trail-engine.js?v=1"></script>\n  <script src="js/circular-spin-flashlight-glitch-engine.js?v=1"></script>'

if bad in text:
    text = text.replace(bad, good)
    with open('magnates-studio/public/index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Cleaned up index.html')
else:
    print('Pattern not matched, checking...')
