const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

// Regex for fetchMusicSearchResults
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

const oldLen1 = html.length;
html = html.replace(/async function fetchMusicSearchResults\(q, mode\) \{[\s\S]*?return mergeSongSearchResults\(neteaseSongs, qqSongs, 18, q\);\s*\}/, fetchNew);
if (html.length === oldLen1) throw new Error("Search patch failed to replace");

// Regex for playQueueAt logic
const playNew = `var data = null;
    if (songProviderKey(song) === 'spotify') {
      try {
        var qqSearch = await apiJson('/api/qq/search?keywords=' + encodeURIComponent(song.artist + ' ' + song.name) + '&limit=5');
        if (qqSearch && qqSearch.songs && qqSearch.songs.length > 0) {
          var best = qqSearch.songs[0];
          data = await apiJson('/api/qq/song/url?mid=' + encodeURIComponent(best.mid || best.songmid || best.id || '') + '&mediaMid=' + encodeURIComponent(best.mediaMid || best.media_mid || '') + qualityParam);
        }
        if (!data || !data.url) {
          var neSearch = await apiJson('/api/search?keywords=' + encodeURIComponent(song.artist + ' ' + song.name) + '&limit=5');
          if (neSearch && neSearch.songs && neSearch.songs.length > 0) {
            data = await apiJson('/api/song/url?id=' + neSearch.songs[0].id + qualityParam);
          }
        }
      } catch (e) {
        console.warn('Spotify fallback audio fetch failed', e);
      }
      if (!data) data = { url: null };
    } else {
      data = isQQPlayback
        ? await apiJson('/api/qq/song/url?mid=' + encodeURIComponent(song.mid || song.songmid || song.id || '') + '&mediaMid=' + encodeURIComponent(song.mediaMid || song.media_mid || '') + qualityParam)
        : await apiJson('/api/song/url?id=' + song.id + qualityParam);
    }`;

const oldLen2 = html.length;
html = html.replace(/var data = isQQPlayback\s*\? await apiJson\('\/api\/qq\/song\/url\?mid=' \+ encodeURIComponent\(song\.mid \|\| song\.songmid \|\| song\.id \|\| ''\) \+ '&mediaMid=' \+ encodeURIComponent\(song\.mediaMid \|\| song\.media_mid \|\| ''\) \+ qualityParam\)\s*: await apiJson\('\/api\/song\/url\?id=' \+ song\.id \+ qualityParam\);/, playNew);
if (html.length === oldLen2) throw new Error("Play patch failed to replace");

fs.writeFileSync(target, html);
console.log('Search & Play patch VERIFIED successful!');
