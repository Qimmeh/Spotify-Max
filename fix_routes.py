import re

with open("server.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace /api/spotify/match-audio
code = re.sub(
    r'(if \(pn === \'/api/spotify/match-audio\'\) \{)[\s\S]*?(return;\n    \})',
    r'\1\n      sendJSON(res, { error: \'No match found\', url: \'\' }, 404);\n      \2',
    code
)

# Replace /api/playlist/add-song
code = re.sub(
    r'(if \(pn === \'/api/playlist/add-song\'\) \{)[\s\S]*?(return;\n    \})',
    r'\1\n      sendJSON(res, { error: \'Not supported\' }, 400);\n      \2',
    code
)

with open("server.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed server routes")
