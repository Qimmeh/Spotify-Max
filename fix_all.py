import re

with open("server.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix /api/spotify/match-audio
p_match = r'if \(pn === \'/api/spotify/match-audio\'\) \{[\s\S]*?\n  \}'
code = re.sub(p_match, r"""if (pn === '/api/spotify/match-audio') {
    sendJSON(res, { error: 'No match found', url: '' }, 404);
    return;
  }""", code)

# Fix /api/playlist/add-song
p_add = r'if \(pn === \'/api/playlist/add-song\'\) \{[\s\S]*?\n  \}'
code = re.sub(p_add, r"""if (pn === '/api/playlist/add-song') {
    sendJSON(res, { error: 'Not supported' }, 400);
    return;
  }""", code)

with open("server.js", "w", encoding="utf-8") as f:
    f.write(code)
