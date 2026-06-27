const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

const fetchStart = html.indexOf('async function fetchMusicSearchResults(q, mode) {');
const fetchEnd = html.indexOf('}', html.indexOf('return mergeSongSearchResults(neteaseSongs, qqSongs, 18, q);')) + 1;
const fetchOrig = html.slice(fetchStart, fetchEnd);

const fetchNew = `async function fetchMusicSearchResults(q, mode) {
  try {
    if (window.desktopWindow && typeof window.desktopWindow.getPhantomSpotifyToken === 'function') {
      const spToken = await window.desktopWindow.getPhantomSpotifyToken();
      if (spToken) {
         const res = await window.desktopWindow.executePhantomSpotify(\`
           fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent('\${q}') + '&type=track&limit=18', {
             headers: { 'Authorization': 'Bearer \${spToken}' }
           }).then(r => r.json())
         \`);
         if (res && res.tracks && res.tracks.items) {
           return res.tracks.items.map(t => ({
             id: t.id,
             name: t.name,
             artist: t.artists.map(a => a.name).join(', '),
             album: t.album.name,
             cover: t.album.images && t.album.images[0] ? t.album.images[0].url : '',
             duration: t.duration_ms ? Math.floor(t.duration_ms / 1000) : 0,
             uri: t.uri,
             provider: 'spotify',
             source: 'spotify'
           }));
         }
      }
    }
  } catch (e) {
    console.warn('Spotify search failed:', e);
  }
  return [];
}`;

if (!html.includes(fetchOrig)) throw new Error('fetchMusicSearchResults Orig not found');
html = html.replace(fetchOrig, fetchNew);
fs.writeFileSync(target, html);
console.log('Search patch successful!');
