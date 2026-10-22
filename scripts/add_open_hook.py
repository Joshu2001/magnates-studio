with open('magnates-studio/public/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = "    if (window.location.search.includes('open=countdown')) {"
rep = """    if (window.location.search.includes('open=circularspin') || window.location.search.includes('open=spinflash')) {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const tpl = (typeof EFFECT_TEMPLATES_DATA !== 'undefined') ? EFFECT_TEMPLATES_DATA.find(t => t.id === 'circular-spin-flashlight-glitch') : null;
          if (tpl && typeof openTopTemplateCustomizer === 'function') openTopTemplateCustomizer(tpl);
        }, 800);
      });
    }
    if (window.location.search.includes('open=countdown')) {"""

if target in text and 'open=circularspin' not in text:
    text = text.replace(target, rep, 1)
    with open('magnates-studio/public/index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Added open=circularspin hook")
else:
    print("Target not found or already added")
