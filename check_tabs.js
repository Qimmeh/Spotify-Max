const fs = require('fs');
const html = fs.readFileSync('c:/projects/Flux/public/index.html', 'utf8');
const match = html.match(/<div class="search-mode-toggles"[^>]*>[\s\S]*?<\/div>/);
console.log('Search mode toggles match:', match ? match[0] : 'None');
