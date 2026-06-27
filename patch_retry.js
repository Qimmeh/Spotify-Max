const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

const loadDiscoverRetry = `async function loadHomeDiscover(force) {
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

const playHomeDailyRetry = `async function playHomeDaily() {
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

let oldLen = html.length;
html = html.replace(/async function loadHomeDiscover\(force\) \{[\s\S]*?renderHomeDiscover\(\);\s*\}\s*\}/, loadDiscoverRetry);
if (html.length === oldLen) throw new Error("loadHomeDiscover retry patch failed");

oldLen = html.length;
html = html.replace(/async function playHomeDaily\(\) \{[\s\S]*?playQueueAt\(0\)\.catch\(function\(e\)\{\s*console\.warn\('\[HomeDailyPlay\]', e\);\s*\}\);\s*\}/, playHomeDailyRetry);
if (html.length === oldLen) throw new Error("playHomeDaily retry patch failed");

fs.writeFileSync(target, html);
console.log('Retry patch VERIFIED successful!');
