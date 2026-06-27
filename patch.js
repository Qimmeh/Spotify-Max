const fs = require('fs');
let lines = fs.readFileSync('public/index.html', 'utf8').split('\n');

// 1. replace loadHomeWeatherRadio (15709 - 15752)
const newWeatherRadio = `async function loadHomeWeatherRadio(force, opts) {
  opts = opts || {};
  if (homeWeatherRadioState.loading && homeWeatherLoadPromise && opts.lat == null && opts.lon == null && !opts.city) {
    return homeWeatherLoadPromise;
  }
  if (homeWeatherRadioState.loading && !force) return homeWeatherRadioState;
  if (homeWeatherRadioState.loaded && !force && !opts.lat) return homeWeatherRadioState;
  var token = ++homeWeatherToken;
  homeWeatherRadioState.loading = true;
  homeWeatherRadioState.error = '';
  renderHomeDiscover();
  var loadPromise = (async function(){
    try {
      var data = await apiJson(homeWeatherRadioUrl(opts), { timeoutMs: 14000 });
      if (token !== homeWeatherToken) return homeWeatherRadioState;
      homeWeatherRadioState.weather = data && data.weather || null;
      var radio = data && data.radio || null;
      
      if (radio && window.desktopWindow && typeof window.desktopWindow.getPhantomSpotifyToken === 'function') {
        try {
          const spToken = await window.desktopWindow.getPhantomSpotifyToken();
          if (spToken && radio.moodKeywords && radio.moodKeywords.length > 0) {
            let allSongs = [];
            for (let kw of radio.moodKeywords.slice(0, 3)) {
               const res = await window.desktopWindow.executePhantomSpotify(\`
                 fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent('\${kw}') + '&type=track&limit=6', {
                   headers: { 'Authorization': 'Bearer \${spToken}' }
                 }).then(r => r.json())
               \`);
               if (res && res.tracks && res.tracks.items) {
                 const mapped = res.tracks.items.map(t => ({
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
                 allSongs = allSongs.concat(mapped);
               }
            }
            radio.songs = allSongs;
          }
        } catch(e) { console.warn('spotify weather search failed', e); }
      }
      
      homeWeatherRadioState.radio = radio;
      homeWeatherRadioState.loaded = true;
      homeWeatherRadioState.updatedAt = Date.now();
      if (homeWeatherRadioState.weather && homeWeatherRadioState.weather.location && homeWeatherRadioState.weather.location.name) {
        homeWeatherRadioState.city = homeWeatherRadioState.weather.location.name;
        localStorage.setItem(HOME_WEATHER_CITY_KEY, homeWeatherRadioState.city);
      } else if (opts.city) {
        homeWeatherRadioState.city = opts.city;
        localStorage.setItem(HOME_WEATHER_CITY_KEY, homeWeatherRadioState.city);
      }
    } catch (e) {
      console.warn('weather radio failed:', e);
      if (token === homeWeatherToken) homeWeatherRadioState.error = 'WEATHER_FAILED';
    } finally {
      if (token === homeWeatherToken) {
        homeWeatherRadioState.loading = false;
        renderHomeDiscover();
      }
    }
    return homeWeatherRadioState;
  })();
  homeWeatherLoadPromise = loadPromise;
  try {
    return await loadPromise;
  } finally {
    if (homeWeatherLoadPromise === loadPromise) homeWeatherLoadPromise = null;
  }
}`;

// 2. replace resolveArtistSongForDetail (16621 - 16636)
const newResolveArtist = `function resolveArtistSongForDetail(song, artist) {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.desktopWindow && typeof window.desktopWindow.getPhantomSpotifyToken === 'function') {
        const spToken = await window.desktopWindow.getPhantomSpotifyToken();
        if (spToken) {
           const res = await window.desktopWindow.executePhantomSpotify(\`
             fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent('\${artist}') + '&type=track&limit=10', {
               headers: { 'Authorization': 'Bearer \${spToken}' }
             }).then(r => r.json())
           \`);
           if (res && res.tracks && res.tracks.items) {
             const mapped = res.tracks.items.map(t => ({
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
             resolve(mapped);
             return;
           }
        }
      }
      resolve([]);
    } catch (e) {
      console.warn('spotify artist search failed', e);
      resolve([]);
    }
  });
}`;

lines.splice(18284, 15); // delete searchAlternatePlatformSong (15 lines from 0-indexed 18284)
lines.splice(16620, 16, newResolveArtist); // replace resolveArtistSongForDetail (16 lines from 16620)
lines.splice(15708, 44, newWeatherRadio); // replace loadHomeWeatherRadio (44 lines from 15708)

fs.writeFileSync('public/index.html', lines.join('\n'));
