import re

with open("public/index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('if (prevLogged || qqLoginWasLoggedIn)', 'if (qqLoginWasLoggedIn)')

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Fixed prevLogged")
