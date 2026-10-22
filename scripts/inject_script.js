import fs from 'fs';

let html = fs.readFileSync('magnates-studio/public/index.html', 'utf8');
const searchStr = '<script src="js/tpl-contextual-inspector.js?v=21"></script>';
const replaceStr = '<script src="js/multi-image-flash-engine.js?v=1"></script>\n  <script src="js/document-barrage-engine.js?v=1"></script>\n  <script src="js/tpl-contextual-inspector.js?v=22"></script>';

if (html.includes(searchStr)) {
  html = html.replace(searchStr, replaceStr);
  fs.writeFileSync('magnates-studio/public/index.html', html, 'utf8');
  console.log('Successfully injected script tag!');
} else {
  console.log('Search string not found!');
}
