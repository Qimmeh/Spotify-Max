with open("server.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "require('NeteaseCloudMusicApi')" in line:
        end_idx = i
        break

if end_idx != -1:
    for i in range(end_idx, -1, -1):
        if "const {" in lines[i]:
            start_idx = i
            break

if start_idx != -1 and end_idx != -1:
    del lines[start_idx:end_idx+1]

with open("server.js", "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Done")
