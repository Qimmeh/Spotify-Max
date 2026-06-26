import re

with open("public/index.html", "r", encoding="utf-8") as f:
    code = f.read()

pattern = r'function markSplashReadyToEnter\(\)\s*\{[\s\S]*?s\.setAttribute\(\'aria-label\', \'点击进入 Mineradio\'\);'
new_func = """function markSplashReadyToEnter() {
    var s = document.getElementById('splash');
    if (!s || s.classList.contains('hide') || s.classList.contains('exiting')) return;
    markAppPerf('splash-ready');
    splashReadyToEnter = true;
    splashTimer = null;
    
    // Auto-dismiss the splash screen since there is no visual prompt to click
    setTimeout(function() {
      dismissSplash();
    }, 500);
"""
code = re.sub(pattern, new_func, code)

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated markSplashReadyToEnter")
