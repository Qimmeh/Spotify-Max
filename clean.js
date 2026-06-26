const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf-8');

// Strip Netease require
content = content.replace(/const\s*\{[\s\S]*?\}\s*=\s*require\('NeteaseCloudMusicApi'\);\n?/g, '');

// Strip endpoints helper
function removeBlock(code, keyword) {
    let newCode = code;
    while (true) {
        let idx = newCode.indexOf(keyword);
        if (idx === -1) break;
        // find previous 'if' or similar
        let lineStart = newCode.lastIndexOf('\n', idx);
        let start = newCode.lastIndexOf('if', idx);
        if (start < lineStart && start !== -1) {
            // we found "if (pn === '/api/qq/search') {"
        } else {
            start = lineStart + 1;
        }

        let braceCount = 0;
        let started = false;
        let i = idx;
        for (; i < newCode.length; i++) {
            if (newCode[i] === '{') {
                braceCount++;
                started = true;
            } else if (newCode[i] === '}') {
                braceCount--;
                if (started && braceCount === 0) {
                    break;
                }
            }
        }
        
        let end = i + 1;
        // Remove from start to end
        newCode = newCode.substring(0, start) + newCode.substring(end);
    }
    return newCode;
}

// We want to remove all API routes containing '/api/qq/'
// And '/api/netease/' if any
const qqRoutes = ['/api/qq/'];
const neteaseRoutes = [
  '/api/search', // we will completely remove handleSearch and /api/search, and replace with /api/spotify/search later! wait, no, I need to keep /api/search and alias it to spotify.
  '/api/song/url',
  '/api/lyric',
  '/api/login/qr',
  '/api/login/status',
  '/api/user/playlists',
  '/api/podcast',
  '/api/dj',
  '/api/comment',
];

for (const route of qqRoutes) {
    content = removeBlock(content, `pn === '${route}`);
}
// But '/api/qq/' is a prefix! Our simple helper uses exact string `pn === '/api/qq/'`, which won't match `pn === '/api/qq/search'` unless we use regex to find start indices.

