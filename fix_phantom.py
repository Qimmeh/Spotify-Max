import re

with open("desktop/phantom-engine.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix init goto
code = re.sub(
    r'await page\.goto\(\'https://open\.spotify\.com\', \{ waitUntil: \'domcontentloaded\' \}\);',
    r"""try {
      await page.goto('https://open.spotify.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (e) {
      console.warn('[PhantomEngine] Initial page goto timeout/error:', e.message);
    }""",
    code
)

# Fix track goto
code = re.sub(
    r'await page\.goto\(\'https://open\.spotify\.com/track/\' \+ trackId, \{ waitUntil: \'domcontentloaded\' \}\);',
    r"""try {
        await page.goto('https://open.spotify.com/track/' + trackId, { waitUntil: 'domcontentloaded', timeout: 60000 });
      } catch (e) {
        console.warn('[PhantomEngine] Track goto timeout/error:', e.message);
      }""",
    code
)

with open("desktop/phantom-engine.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed phantom timeouts")
