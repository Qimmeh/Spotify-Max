with open("server.js", "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace("\\'", "'")

with open("server.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed quotes")
