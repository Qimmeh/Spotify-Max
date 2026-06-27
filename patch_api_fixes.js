const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

// Fix search result object access
html = html.replace(
  'if (res && res.tracks && res.tracks.items) {',
  'if (res && res.ok && res.result && res.result.tracks && res.result.tracks.items) { res = res.result;'
);

// Fix discover result object access
html = html.replace(
  'if (res && res.items) {',
  'if (res && res.ok && res.result && res.result.items) { res = res.result;'
);

fs.writeFileSync(target, html);
console.log('API access patched!');
