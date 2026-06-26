import re

with open("server.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace spotifyLyricFuzzyMatch
pattern1 = r'async function spotifyLyricFuzzyMatch\(name, artist\)\s*\{[\s\S]*?\n\}'
def repl1(m):
    return """async function spotifyLyricFuzzyMatch(name, artist) {
  return { lyric: '', tlyric: '', yrc: '', source: 'spotify-none' };
}"""
# Wait, maybe there's a better way to replace just the function body.
code = re.sub(pattern1, repl1, code, count=1)

# Replace the inner logic of /api/spotify/match-audio
pattern2 = r'(if \(pn === \'/api/spotify/match-audio\'\) \{[\s\S]*?try \{)[\s\S]*?(res, \{ error: \'Match error\', message: e\.message \}, 500\);\n      \}\n      return;\n    \})'

def repl2(m):
    return m.group(1) + """
        sendJSON(res, { error: 'No match found', url: '' }, 404);
      } catch (e) {
        sendJSON(res, { error: 'Match error', message: e.message }, 500);
      }
      return;
    }"""
code = re.sub(pattern2, repl2, code)

with open("server.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed lyrics and match-audio")
