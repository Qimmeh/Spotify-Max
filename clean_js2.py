import re

with open("public/index.html", "r", encoding="utf-8") as f:
    code = f.read()

# Replace any `/api/qq/search` and `/api/search` with `/api/spotify/search` in inline fetches
# Actually, I should just replace all occurrences of `apiJson('/api/qq/search` with `apiJson('/api/spotify/search` 
# Wait, fetchMusicSearchResults already handles Spotify search and ignores the rest since we replaced it.

# What about checkQQLyric or fallback lyric fetching?
# In `fetchLyricData`
pattern = r'endpoint = \'/api/qq/lyric[^;]*;'
code = re.sub(pattern, 'endpoint = \'\';', code)

pattern = r'endpoint = \'/api/lyric[^;]*;'
code = re.sub(pattern, 'endpoint = \'\';', code)

# For playlist loading: `handleQQUserPlaylists` or `/api/qq/user/playlists`
code = re.sub(r'qqLoginStatus.loggedIn \? apiJson\(\'/api/qq/user/playlists\'\) : Promise.resolve\(\{ playlists: \[\] \}\)', 'Promise.resolve({ playlists: [] })', code)

# For login status
code = re.sub(r'var info = await apiJson\(\'/api/qq/login/status[^;]*;\n.*qqLoginStatus = normalizeQQLoginStatus\(info\);', 'var info = {loggedIn: false}; qqLoginStatus = normalizeQQLoginStatus(info);', code, flags=re.MULTILINE|re.DOTALL)

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(code)

print("Cleaned up endpoints in index.html")
