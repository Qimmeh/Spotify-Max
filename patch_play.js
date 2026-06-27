const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

const playOrig = `var data = isQQPlayback
      ? await apiJson('/api/qq/song/url?mid=' + encodeURIComponent(song.mid || song.songmid || song.id || '') + '&mediaMid=' + encodeURIComponent(song.mediaMid || song.media_mid || '') + qualityParam)
      : await apiJson('/api/song/url?id=' + song.id + qualityParam);`;

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

if (!html.includes(playOrig)) throw new Error('playQueueAt logic orig not found');
html = html.replace(playOrig, playNew);
fs.writeFileSync(target, html);
console.log('Playback patch successful!');
