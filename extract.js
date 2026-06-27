const fs = require('fs');
const lines = fs.readFileSync('c:/projects/Flux/public/index.html', 'utf8').split('\n');

const getFuncStr = (name) => {
  const start = lines.findIndex(l => l.includes(name));
  if (start === -1) return '';
  let braceCount = 0;
  let started = false;
  let i = start;
  while (i < lines.length) {
    if (lines[i].includes('{')) {
      braceCount += (lines[i].match(/\{/g) || []).length;
      started = true;
    }
    if (lines[i].includes('}')) {
      braceCount -= (lines[i].match(/\}/g) || []).length;
    }
    if (started && braceCount <= 0) break;
    i++;
  }
  return lines.slice(start, i + 1).join('\n');
};

fs.writeFileSync('c:/projects/Flux/func_fetch.txt', getFuncStr('async function fetchMusicSearchResults(q, mode) {'));
fs.writeFileSync('c:/projects/Flux/func_discover.txt', getFuncStr('async function loadHomeDiscover(force) {'));
fs.writeFileSync('c:/projects/Flux/func_daily.txt', getFuncStr('async function playHomeDaily() {'));

const pStart = lines.findIndex(l => l.includes('var data = isQQPlayback'));
const pEnd = lines.findIndex((l, i) => i > pStart && l.includes(': await apiJson(\'/api/song/url?id=\' + song.id + qualityParam);'));
fs.writeFileSync('c:/projects/Flux/func_playqueue.txt', lines.slice(pStart, pEnd + 1).join('\n'));
