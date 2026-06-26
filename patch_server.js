const fs = require('fs');

const helpers = `
// ---------- Spotify App Credentials & Token Management ----------
const SPOTIFY_CREDS_FILE = path.join(__dirname, '.spotify-creds.json');
const SPOTIFY_TOKEN_FILE = path.join(__dirname, '.spotify-token.json');

let spotifyCredentials = {
  clientId: '', 
  clientSecret: '',
};

try {
  if (fs.existsSync(SPOTIFY_CREDS_FILE)) {
    spotifyCredentials = JSON.parse(fs.readFileSync(SPOTIFY_CREDS_FILE, 'utf8'));
  }
} catch (e) {
  console.warn('[Spotify] Failed to read custom credentials', e.message);
}

function saveSpotifyCredentials(clientId, clientSecret) {
  spotifyCredentials = { clientId, clientSecret };
  try {
    fs.writeFileSync(SPOTIFY_CREDS_FILE, JSON.stringify(spotifyCredentials, null, 2), 'utf8');
  } catch (e) {
    console.error('[Spotify] Failed to save custom credentials', e.message);
  }
}

let spotifyTokenData = null;
try {
  if (fs.existsSync(SPOTIFY_TOKEN_FILE)) {
    spotifyTokenData = JSON.parse(fs.readFileSync(SPOTIFY_TOKEN_FILE, 'utf8'));
  }
} catch (e) {
  spotifyTokenData = null;
}

function saveSpotifyToken(data) {
  spotifyTokenData = data;
  try {
    if (!data) {
      if (fs.existsSync(SPOTIFY_TOKEN_FILE)) fs.unlinkSync(SPOTIFY_TOKEN_FILE);
    } else {
      fs.writeFileSync(SPOTIFY_TOKEN_FILE, JSON.stringify(data, null, 2), 'utf8');
    }
  } catch (e) {
    console.error('[Spotify] Failed to save token', e.message);
  }
}

async function getSpotifyClientToken() {
  if (!spotifyCredentials.clientId || !spotifyCredentials.clientSecret) {
    throw new Error('Spotify API Credentials not configured');
  }
  const authStr = Buffer.from(spotifyCredentials.clientId + ':' + spotifyCredentials.clientSecret).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + authStr,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Client token error: ' + text);
  }
  const data = await res.json();
  return data.access_token;
}

async function getSpotifyUserToken() {
  if (!spotifyTokenData || !spotifyTokenData.refresh_token) {
    throw new Error('No user token');
  }
  if (spotifyTokenData.expires_at && Date.now() < spotifyTokenData.expires_at) {
    return spotifyTokenData.access_token;
  }
  const authStr = Buffer.from(spotifyCredentials.clientId + ':' + spotifyCredentials.clientSecret).toString('base64');
  const res = await safeFetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + authStr,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(spotifyTokenData.refresh_token)
  });
  if (!res.ok) {
    throw new Error('Refresh token failed');
  }
  const data = await res.json();
  spotifyTokenData.access_token = data.access_token;
  spotifyTokenData.expires_at = Date.now() + (data.expires_in * 1000) - 60000;
  if (data.refresh_token) spotifyTokenData.refresh_token = data.refresh_token;
  saveSpotifyToken(spotifyTokenData);
  return spotifyTokenData.access_token;
}

async function safeFetch(url, options = {}) {
  const fetchFn = typeof fetch === 'function' ? fetch : require('node-fetch');
  return fetchFn(url, options);
}

// --------------------------------------------------------------
`;

let code = fs.readFileSync('server.js', 'utf8');
code = code.replace("const COOKIE_FILE =", helpers + "\nconst COOKIE_FILE =");

const missing_routes = fs.readFileSync('missing.txt', 'utf8');
// missing.txt contains the API endpoints!
// Find a good place to put them inside http.createServer
code = code.replace("if (pn === '/api/login/qr/key') {", missing_routes + "\n    if (pn === '/api/login/qr/key') {");

fs.writeFileSync('server.js', code, 'utf8');
console.log('Patch complete!');
