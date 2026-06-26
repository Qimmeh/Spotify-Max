import re

with open("public/index.html", "r", encoding="utf-8") as f:
    html = f.read()

pattern = r'async function fetchMusicSearchResults\(q, mode\)\s*\{[\s\S]*?return mergeSongSearchResults\(neteaseSongs, qqSongs, 18, q\);\n  \}'
new_func = """async function fetchMusicSearchResults(q) {
    try {
      var spOnly = await apiJson('/api/spotify/search?keywords=' + encodeURIComponent(q) + '&limit=18');
      if (spOnly && spOnly.error) {
        showToast('Spotify 搜索出错: ' + spOnly.error);
      }
      return mergeSongSearchResults((spOnly && spOnly.songs) || [], [], 18, q);
    } catch (e) {
      console.warn('Search API Error:', e);
      return [];
    }
  }"""

html = re.sub(pattern, new_func, html)

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Fixed fetchMusicSearchResults")
