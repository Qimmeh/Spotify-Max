import re

with open("public/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Remove login-platform-tabs completely
html = re.sub(r'<div class="login-platform-tabs".*?</div>', '', html, flags=re.DOTALL)

# 2. Remove user-platform-tabs completely
html = re.sub(r'<div class="user-platform-tabs".*?</div>', '', html, flags=re.DOTALL)

# 3. Remove search-mode-tabs completely
html = re.sub(r'<div id="search-mode-tabs".*?</div>', '', html, flags=re.DOTALL)

# 4. Remove UI functions for QQ/Netease auth
# e.g. function setLoginProvider, setLoginStatus
# Actually, it's safer to just let those functions exist but they will never be called since buttons are gone.
# But we must ensure the unified `/api/search` is called WITHOUT 'netease' or 'qq' prefix!
# Wait, `performSearch` uses `searchMode` variable!

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Cleaned tabs")
