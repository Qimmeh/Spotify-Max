import re

with open("public/index.html", "r", encoding="utf-8") as f:
    code = f.read()

# Replace fetchMusicSearchResults completely
pattern = r'async function fetchMusicSearchResults\(q, mode\)\s*\{[\s\S]*?\n  \}'
new_func = """async function fetchMusicSearchResults(q, mode) {
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
code = re.sub(pattern, new_func, code)

# We can also hardcode `searchMode` to 'spotify' in doSearch if necessary, but since we removed tabs, the user can't change it.

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated fetchMusicSearchResults")
