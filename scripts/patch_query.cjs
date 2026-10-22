const fs = require('fs');
let html = fs.readFileSync('magnates-studio/public/index.html', 'utf8');
const target = "if (window.location.search.includes('open=countdown')) {";
const replacement = `if (window.location.search.includes('open=lighttrail')) {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const tpl = (typeof EFFECT_TEMPLATES_DATA !== 'undefined') ? EFFECT_TEMPLATES_DATA.find(t => t.id === 'cinematic-light-trail-typewriter') : null;
          if (tpl && typeof openTopTemplateCustomizer === 'function') openTopTemplateCustomizer(tpl);
        }, 800);
      });
    } else if (window.location.search.includes('open=countdown')) {`;
if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('magnates-studio/public/index.html', html, 'utf8');
  console.log('Added open=lighttrail query handler');
}
