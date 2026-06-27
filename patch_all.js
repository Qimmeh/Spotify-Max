const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

const loginOrigStart = html.indexOf('<div id="login-modal"');
const loginOrigEnd = html.indexOf('</div>', html.indexOf('refresh-qr-btn', loginOrigStart)) + 13;
const loginOrig = html.slice(loginOrigStart, loginOrigEnd);

const loginNew = `<div id="login-modal" class="modal-mask">
  <div class="modal dual-login-modal">
    <div class="login-intro" style="margin-top:20px;">
      <div class="login-intro-kicker">Mineradio x Spotify</div>
      <div class="login-intro-title">音乐播放器，也是一座视觉舞台</div>
      <div class="login-intro-body">请连接您的 Spotify 账号，同步推荐与歌单。</div>
    </div>
    <div style="text-align: center; margin: 40px 0;">
      <button class="modal-btn primary" style="background:#1DB954;color:#fff;border:none;padding:12px 24px;border-radius:24px;font-size:16px;cursor:pointer;font-weight:600;" onclick="window.desktopWindow.openSpotifyMusicLogin().then(() => closeLoginModal())">
        连接 Spotify
      </button>
    </div>
    <div class="btn-row" style="justify-content:center;">
      <button class="modal-btn" onclick="closeLoginModal()">取消</button>
      <button class="modal-btn" onclick="skipLoginAndFocusSearch()">先搜索一首歌</button>
    </div>
  </div>
</div>`;

const searchTabsNew = '<div class="search-mode-toggles" id="search-mode-toggles" style="display:none;"></div>';

const fetchOrig = fs.readFileSync('c:/projects/Flux/func_fetch.txt', 'utf8');
const fetchNew = `async function fetchMusicSearchResults(q, mode) {
  try {
    if (window.desktopWindow && typeof window.desktopWindow.getPhantomSpotifyToken === 'function') {
      const spToken = await window.desktopWindow.getPhantomSpotifyToken();
      if (spToken) {
         let res = await window.desktopWindow.executePhantomSpotify(\`
           fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent('\${q}') + '&type=track&limit=18', {
             headers: { 'Authorization': 'Bearer \${spToken}' }
           }).then(r => r.json())
         \`);
         if (res && res.ok && res.result && res.result.tracks && res.result.tracks.items) { res = res.result; }
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

const discoverOrig = fs.readFileSync('c:/projects/Flux/func_discover.txt', 'utf8');
const discoverNew = `async function loadHomeDiscover(force) {
  if (homeDiscoverState.loading) return;
  if (homeDiscoverState.loaded && !force) return;
  var token = ++homeDiscoverToken;
  homeDiscoverState.loading = true;
  homeDiscoverState.error = '';
  renderHomeDiscover();
  try {
    let hasSpotify = false;
    let songs = [];
    if (window.desktopWindow && typeof window.desktopWindow.getPhantomSpotifyToken === 'function') {
      let spToken = await window.desktopWindow.getPhantomSpotifyToken();
      if (!spToken) {
         await new Promise(r => setTimeout(r, 2000));
         spToken = await window.desktopWindow.getPhantomSpotifyToken();
      }
      if (spToken) {
        hasSpotify = true;
        let res = await window.desktopWindow.executePhantomSpotify(\`
           fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
             headers: { 'Authorization': 'Bearer \${spToken}' }
           }).then(r => r.json())
        \`);
        if (res && res.ok && res.result && res.result.items) { res = res.result; }
        if (res && res.items) {
          songs = res.items.map(item => {
             const t = item.track || item;
             return {
               id: t.id,
               name: t.name,
               artist: (t.artists || []).map(a => a.name).join(', '),
               album: t.album && t.album.name ? t.album.name : '',
               cover: t.album && t.album.images && t.album.images[0] ? t.album.images[0].url : '',
               duration: t.duration_ms ? Math.floor(t.duration_ms / 1000) : 0,
               uri: t.uri,
               provider: 'spotify',
               source: 'spotify'
             };
          });
        }
      }
    }

    if (token !== homeDiscoverToken) return;
    homeDiscoverState.loggedIn = hasSpotify;
    homeDiscoverState.mode = hasSpotify ? 'member' : 'starter';
    homeDiscoverState.songs = songs;
    homeDiscoverState.playlists = [];
    homeDiscoverState.podcasts = [];
    homeDiscoverState.updatedAt = Date.now();
    homeDiscoverState.loaded = true;
  } catch (e) {
    console.warn('home discover failed:', e);
    if (token === homeDiscoverToken) homeDiscoverState.error = 'DISCOVER_FAILED';
  } finally {
    if (token === homeDiscoverToken) {
      homeDiscoverState.loading = false;
      renderHomeDiscover();
    }
  }
}`;

const dailyOrig = fs.readFileSync('c:/projects/Flux/func_daily.txt', 'utf8');
const dailyNew = `async function playHomeDaily() {
  homeForcedOpen = false;
  homeSuppressed = false;
  setHomeControlsLocked(false);
  let hasSp = false;
  if (window.desktopWindow && typeof window.desktopWindow.getPhantomSpotifyToken === 'function') {
      let spToken = await window.desktopWindow.getPhantomSpotifyToken();
      if (!spToken) {
         await new Promise(r => setTimeout(r, 2000));
         spToken = await window.desktopWindow.getPhantomSpotifyToken();
      }
      if (spToken) hasSp = true;
  }
  if (!hasSp) {
    showLoginModal({ source: 'home-daily' });
    return;
  }
  await waitForHomeDiscoverIdle();
  if (!homeDiscoverState.loaded || (!homeDiscoverState.songs.length && !homeDiscoverState.loading)) {
    await loadHomeDiscover(true);
  }
  if (!homeDiscoverState.songs.length) {
    runHomeSearch('Coldplay');
    return;
  }
  playQueue = homeDiscoverState.songs.map(cloneSong);
  currentIdx = 0;
  safeRenderQueuePanel('home-daily');
  safeShelfRebuild('home-daily', true);
  forcePlaybackControlsInteractive();
  playQueueAt(0).catch(function(e){ console.warn('[HomeDailyPlay]', e); });
}`;

const playqueueOrig = fs.readFileSync('c:/projects/Flux/func_playqueue.txt', 'utf8');
const playqueueNew = `var data = null;
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

function doReplace(html, orig, nw, name) {
  const parts = html.split(orig);
  if (parts.length !== 2) throw new Error("Failed to replace: " + name);
  return parts.join(nw);
}

html = doReplace(html, loginOrig, loginNew, 'login-modal');
html = html.replace(/<div class="search-mode-toggles"[^>]*>[\s\S]*?<\/div>/, searchTabsNew);
html = doReplace(html, fetchOrig, fetchNew, 'fetchMusicSearchResults');
html = doReplace(html, discoverOrig, discoverNew, 'loadHomeDiscover');
html = doReplace(html, dailyOrig, dailyNew, 'playHomeDaily');
html = doReplace(html, playqueueOrig, playqueueNew, 'playQueueAt');

fs.writeFileSync(target, html);
console.log('ALL PATCHES APPLIED SUCCESSFULLY!');
