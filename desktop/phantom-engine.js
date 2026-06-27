const { BrowserWindow } = require("electron");
const path = require("path");
const https = require("https");

var PLAYER_HTML = path.join(__dirname, "spotify-player.html");

var playerWindow = null;
var deviceId = null;
var currentToken = null;

function setToken(token) {
  currentToken = token;
}

function ensureWindow() {
  if (playerWindow && !playerWindow.isDestroyed()) {
    return playerWindow;
  }

  playerWindow = new BrowserWindow({
    width: 1,
    height: 1,
    x: 0,
    y: 0,
    show: true,
    skipTaskbar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: false
    }
  });

  playerWindow.on("closed", function() {
    playerWindow = null;
    deviceId = null;
  });

  return playerWindow;
}

async function initPhantomEngine() {
  if (!currentToken) {
    console.warn("[PhantomEngine] No token set");
    return;
  }

  var win = ensureWindow();
  var url = "file://" + PLAYER_HTML.replace(/\\/g, "/") + "?token=" + encodeURIComponent(currentToken);
  win.loadURL(url).catch(function(e) {
    console.warn("[PhantomEngine] Load error:", e.message);
  });

  // Wait for device_id from the Web Playback SDK
  try {
    deviceId = await new Promise(function(resolve) {
      var resolved = false;
      var timeout = setTimeout(function() {
        if (!resolved) {
          resolved = true;
          console.warn("[PhantomEngine] SDK init timeout");
          resolve(null);
        }
      }, 20000);

      // Poll for __onReady to be set by the page
      function poll() {
        win.webContents.executeJavaScript([
          "(function() {",
          "  if (typeof window.__onReady === 'function') {",
          "    return new Promise(function(res) {",
          "      window.__onReady = res;",
          "    });",
          "  }",
          "  return null;",
          "})();"
        ].join("\n")).then(function(result) {
          if (resolved) return;
          if (result !== null) {
            resolved = true;
            clearTimeout(timeout);
            resolve(result);
          } else {
            setTimeout(poll, 500);
          }
        }).catch(function() {
          if (!resolved) setTimeout(poll, 500);
        });
      }
      setTimeout(poll, 1000);
    });
    console.log("[PhantomEngine] Device ID:", deviceId);
  } catch (e) {
    console.warn("[PhantomEngine] init error:", e.message);
  }
}

function spotifyRequest(method, apiPath, body) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: "api.spotify.com",
      port: 443,
      path: apiPath,
      method: method,
      headers: {
        "Authorization": "Bearer " + (currentToken || ""),
        "Content-Type": "application/json"
      }
    };
    if (body) opts.headers["Content-Length"] = Buffer.byteLength(body);

    var req = https.request(opts, function(res) {
      var data = "";
      res.on("data", function(chunk) { data += chunk; });
      res.on("end", function() {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error("Spotify API " + res.statusCode + ": " + data.substring(0, 200)));
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function playTrack(uri) {
  if (!deviceId || !currentToken) {
    console.warn("[PhantomEngine] Missing device or token");
    return;
  }
  try {
    var body = JSON.stringify({ uris: [uri] });
    await spotifyRequest("PUT", "/v1/me/player/play?device_id=" + encodeURIComponent(deviceId), body);
    console.log("[PhantomEngine] Played:", uri);
  } catch (e) {
    console.error("[PhantomEngine] Play failed:", e.message);
  }
}

async function pauseTrack() {
  if (!deviceId || !currentToken) return;
  try {
    await spotifyRequest("PUT", "/v1/me/player/pause?device_id=" + encodeURIComponent(deviceId));
  } catch (e) {
    console.error("[PhantomEngine] Pause failed:", e.message);
  }
}

async function resumeTrack() {
  if (!deviceId || !currentToken) return;
  try {
    await spotifyRequest("PUT", "/v1/me/player/play?device_id=" + encodeURIComponent(deviceId));
  } catch (e) {
    console.error("[PhantomEngine] Resume failed:", e.message);
  }
}

function cleanup() {
  if (playerWindow && !playerWindow.isDestroyed()) {
    try { playerWindow.close(); } catch (e) {}
  }
  playerWindow = null;
  deviceId = null;
}

module.exports = {
  setToken: setToken,
  initPhantomEngine: initPhantomEngine,
  playTrack: playTrack,
  pauseTrack: pauseTrack,
  resumeTrack: resumeTrack,
  cleanup: cleanup
};
