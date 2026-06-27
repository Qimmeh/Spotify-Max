const fs = require('fs');
const target = 'c:/projects/Flux/public/index.html';
let html = fs.readFileSync(target, 'utf8');

const loginStart = html.indexOf('<div id="login-modal"');
const loginEnd = html.indexOf('</div>', html.indexOf('refresh-qr-btn')) + 13;
const loginOrig = html.slice(loginStart, loginEnd);

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

const searchTabsOrig = '<div class="search-mode-toggles" id="search-mode-toggles">\n      <div class="search-mode-toggles-bg" id="search-mode-toggles-bg"></div>\n      <button class="smt-btn active" type="button" data-mode="song">All</button>\n      <button class="smt-btn" type="button" data-mode="netease">NE</button>\n      <button class="smt-btn" type="button" data-mode="qq">QQ</button>\n      <button class="smt-btn" type="button" data-mode="podcast">Podcast</button>\n    </div>';
const searchTabsNew = '<div class="search-mode-toggles" id="search-mode-toggles" style="display:none;"></div>';

html = html.replace(loginOrig, loginNew);
html = html.replace(searchTabsOrig, searchTabsNew);

fs.writeFileSync(target, html);
console.log('UI HTML patch successful!');
