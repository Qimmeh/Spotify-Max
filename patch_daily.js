const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

const loadDiscoverOrigStr = `async function loadHomeDiscover(force) {
  if (homeDiscoverState.loading) return;
  if (homeDiscoverState.loaded && !force) return;
  var token = ++homeDiscoverToken;
  homeDiscoverState.loading = true;
  homeDiscoverState.error = '';
  renderHomeDiscover();
  try {
    var data = await apiJson('/api/discover/home?t=' + Date.now());
    if (token !== homeDiscoverToken) return;
    homeDiscoverState.loggedIn = !!(data && data.loggedIn);
    homeDiscoverState.mode = data && data.mode || (homeDiscoverState.loggedIn ? 'member' : 'starter');
    homeDiscoverState.songs = homeDiscoverState.loggedIn ? (data && data.dailySongs || []).map(cloneSong) : [];
    homeDiscoverState.playlists = homeDiscoverState.loggedIn ? (data && data.playlists || []) : [];
    homeDiscoverState.podcasts = homeDiscoverState.loggedIn ? (data && data.podcasts || []) : [];
    homeDiscoverState.updatedAt = Number(data && data.updatedAt) || Date.now();
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

const loadDiscoverNew = `async function loadHomeDiscover(force) {
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
      const spToken = await window.desktopWindow.getPhantomSpotifyToken();
      if (spToken) {
        hasSpotify = true;
        const res = await window.desktopWindow.executePhantomSpotify(\`
           fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
             headers: { 'Authorization': 'Bearer \${spToken}' }
           }).then(r => r.json())
        \`);
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

const playHomeDailyOrigStr = `async function playHomeDaily() {
  homeForcedOpen = false;
  homeSuppressed = false;
  setHomeControlsLocked(false);
  if (!hasAnyPlatformLogin() && !homeDiscoverState.loggedIn) {
    showLoginModal({ source: 'home-daily' });
    return;
  }
  await waitForHomeDiscoverIdle();
  if (!homeDiscoverState.loaded || (!homeDiscoverState.songs.length && !homeDiscoverState.loading)) {
    await loadHomeDiscover(true);
  }
  if (!homeDiscoverState.songs.length) {
    runHomeSearch('每日推荐');
    return;
  }
  playQueue = homeDiscoverState.songs.map(cloneSong);
  currentIdx = 0;
  safeRenderQueuePanel('home-daily');
  safeShelfRebuild('home-daily', true);
  forcePlaybackControlsInteractive();
  playQueueAt(0).catch(function(e){ console.warn('[HomeDailyPlay]', e); });
}`;

const playHomeDailyNew = `async function playHomeDaily() {
  homeForcedOpen = false;
  homeSuppressed = false;
  setHomeControlsLocked(false);
  let hasSp = false;
  if (window.desktopWindow && typeof window.desktopWindow.getPhantomSpotifyToken === 'function') {
      const spToken = await window.desktopWindow.getPhantomSpotifyToken();
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

// Use proper regex replace for robustness against small whitespace changes
if (!html.includes(loadDiscoverOrigStr.split('\\n')[0])) throw new Error('loadDiscoverOrig not found');
html = html.replace(loadDiscoverOrigStr, loadDiscoverNew);
html = html.replace(playHomeDailyOrigStr, playHomeDailyNew);

fs.writeFileSync(target, html);
console.log('Daily patch successful!');
