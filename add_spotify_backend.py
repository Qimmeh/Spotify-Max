import sys
sys.stdout.reconfigure(encoding="utf-8")
with open("server.js","r",encoding="utf-8") as f:
    lines = f.readlines()

spotify_routes = """  // ---------- Spotify API ----------
  if (pn === '/api/spotify/token') {
    try {
      var token = await getSpotifyApiToken(false);
      sendJSON(res, { ok: !!token, token: token, loggedIn: !!(spotifyUserToken && spotifyUserToken.access_token) });
    } catch (err) {
      sendJSON(res, { ok: false, error: err.message }, 500);
    }
    return;
  }

  if (pn === '/api/spotify/search') {
    try {
      var q = url.searchParams.get('q') || '';
      if (!q) { sendJSON(res, { ok: false, error: 'Missing query' }, 400); return; }
      var token = await getSpotifyClientToken();
      if (!token) { sendJSON(res, { ok: false, error: 'No Spotify token' }, 503); return; }
      var apiRes = await fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(q) + '&type=track&limit=18', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!apiRes.ok) { sendJSON(res, { ok: false, error: 'Spotify API ' + apiRes.status }, apiRes.status); return; }
      var data = await apiRes.json();
      sendJSON(res, data);
    } catch (err) {
      sendJSON(res, { ok: false, error: err.message }, 500);
    }
    return;
  }

  if (pn === '/api/spotify/me') {
    try {
      var token = await getSpotifyApiToken(true);
      if (!token) { sendJSON(res, { ok: false, loggedIn: false, error: 'Not logged in' }, 401); return; }
      var apiRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!apiRes.ok) { sendJSON(res, { ok: false, loggedIn: false, error: 'Spotify API ' + apiRes.status }, apiRes.status); return; }
      var userData = await apiRes.json();
      sendJSON(res, { ok: true, loggedIn: true, data: userData });
    } catch (err) {
      sendJSON(res, { ok: false, error: err.message }, 500);
    }
    return;
  }

  if (pn === '/api/spotify/me/tracks') {
    try {
      var token = await getSpotifyApiToken(true);
      if (!token) { sendJSON(res, { ok: false, items: [], error: 'Not logged in' }, 401); return; }
      var apiRes = await fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!apiRes.ok) { sendJSON(res, { ok: false, items: [], error: 'Spotify API ' + apiRes.status }, apiRes.status); return; }
      var trackData = await apiRes.json();
      sendJSON(res, { ok: true, items: trackData.items || [] });
    } catch (err) {
      sendJSON(res, { ok: false, items: [], error: err.message }, 500);
    }
    return;
  }

  if (pn === '/api/spotify/save-token' && req.method === 'POST') {
    try {
      var body = JSON.parse(await readRequestBody(req));
      if (body && body.access_token) {
        if (!spotifyUserToken) spotifyUserToken = {};
        Object.keys(body).forEach(function(k){
          if (body[k] !== null && body[k] !== undefined && String(body[k]).trim() !== '') {
            spotifyUserToken[k] = body[k];
          }
        });
        fs.writeFileSync(SPOTIFY_TOKEN_PATH, JSON.stringify(spotifyUserToken, null, 2), 'utf8');
      }
      sendJSON(res, { ok: true });
    } catch (err) {
      sendJSON(res, { ok: false, error: err.message }, 500);
    }
    return;
  }

"""

idx = 3413  # 0-indexed, after weather route closing
new_lines = lines[:idx+1] + [spotify_routes] + lines[idx+1:]

with open("server.js","w",encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Done. Total lines: {len(new_lines)}")
print(f"Spotify route refs: {sum(1 for l in new_lines if '/api/spotify' in l)}")
print(f"Spotify OAuth refs: {sum(1 for l in new_lines if 'SPOTIFY_CREDENTIALS_PATH' in l)}")
