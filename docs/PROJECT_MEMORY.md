# Mineradio Project Memory

### 2026-06-25 - P0 Installer In-Place Repair Rule

- User requirement: all users must receive the installer/uninstaller safety fix with zero risk to unrelated files.
- Files: `build/installer.nsh`, `docs/INSTALLER_STYLE.md`, `CHANGELOG.md`.
- Implementation: the full setup reads existing HKCU/HKLM Mineradio install locations and may adopt them in place only when the registered path is already a dedicated `...\Mineradio` directory and contains Mineradio files or `.mineradio-install-root`; it removes only the legacy `Uninstall Mineradio.exe` single file before writing the new safe uninstaller.
- Same-version v1.1.1 rebuild rule: an existing dedicated `...\Mineradio` folder that already contains Mineradio files may be overwritten even if it lacks `.mineradio-install-root`; mixed folders such as `D:\百度盘\翻身(1)` must not be adopted in place.
- Do not regress: never run the old uninstaller, never adopt mixed parent folders or drive roots, never use quick patch JSON as the only fix path for installer/uninstaller bugs, and never restore recursive install-root deletion.

这个文件用于解决新开 Codex 对�?时“失忆�?的问题。�?次用户明确说“�?留�?“喜欢�?“这个很好�?“记�?�?“�?存一下�?等表达时，�?把关键结论追加到这里。

## Stable Project Facts

- �?��?行程�?：`E:\桌�?�\播放器软件\Mineradio\Mineradio.exe`
- �?行版主目录：`E:\桌�?�\播放器软件\Mineradio`
- 真实代�?/Git 仓库：`E:\桌�?�\播放器软件\Mineradio\resources\app`
- GitHub 仓库：`https://github.com/XxHuberrr/Mineradio.git`
- 统一备份目录：`E:\桌�?�\播放器软件\工作区备份`
- 当�?�?�?检查点：`v1.1.0`
- 最近正�?安装包 Release 基线：`v1.1.0` 纯净安装版；`v1.0.10` �?�更早安装包需隔离，�?�?建议安装或传播。
- �?�布入�?�：GitHub Releases，更新检查�?赖 `latest.yml` 和�?�选轻�?补�? JSON。
- 更新包命�??规则：从 `v1.0.10` 起，快速补�?本地文件�??和 GitHub Release label 使用 `Mineradio-旧版本→新版本.patch.json` 这�?�?�箭头格�?；GitHub 资产底层 `name` �?�能会把 `→` 净化�?点�?�，但更新解�?�?�?�识别 from/to 版本。
- 快速补�?范围规则：从 `v1.0.10` 起，�?次�?�布�?�为低于新版的最近 4 个版本生�?补�?；更早版本�?�?从 `1.0.0` 开始补�?，�??示用户下载完整安装包更新。
- 安装包样�?：以�?�按 `docs/INSTALLER_STYLE.md` 的中文�?简黑白�?格�?打包。

## Workspace Organization

2026-06-18 已整�?�工作区：

- 真正项目移动到 `E:\桌�?�\播放器软件\Mineradio`。
- 旧的 `editable-install`�?历�?� `backups`�?`备份`�?截图�?旧计划文档和验�?目录都归档到 `E:\桌�?�\播放器软件\工作区备份\2026-06-18-workspace-cleanup`。
- 项目内历�?� `backups` 也归档到 `E:\桌�?�\播放器软件\工作区备份\2026-06-18-workspace-cleanup\project-internal`。
- 根目录 `AGENTS.md` 负责给新对�?指路；项目内 `AGENTS.md` 负责项目规则。

## Release Memory

- `v1.1.0` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.1.0`
- 仓库已设为公开：`https://github.com/XxHuberrr/Mineradio`
- `v1.1.0` Release 资产包括：
  - `Mineradio-1.1.0-Setup.exe`
  - `Mineradio-1.1.0-Setup.exe.blockmap`
  - `Mineradio-1.1.0-SHA256SUMS.txt`
- `v1.1.0` 安装包 SHA256：`bd53aae4e551f5b0b5a398a51e6ec1de5a9a57cb42e5eecedb0a1647fdcee6e6`
- `v1.1.0` 未上传 `latest.yml`，Release 创建时使用 `--latest=false`；GitHub `/releases/latest` �?返回 `v1.0.10`，�?��? `v1.0.10` 客户端软件内更新到 1.1.0。
- 已批�?给旧 Release（`v1.0.10` 到 `v0.9.9`）正文顶部追加旧安装包隔离警示；�?�?删除旧资产，�?�标记�?�?�信和建议隔离。
- `v1.0.10` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.10`
- `v1.0.10` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.10-Setup.exe`
  - `Mineradio-1.0.10-Setup.exe.blockmap`
  - `Mineradio-1.0.6.1.0.10.patch.json`（Release label：`Mineradio-1.0.6→1.0.10.patch.json`）
  - `Mineradio-1.0.7.1.0.10.patch.json`（Release label：`Mineradio-1.0.7→1.0.10.patch.json`）
  - `Mineradio-1.0.8.1.0.10.patch.json`（Release label：`Mineradio-1.0.8→1.0.10.patch.json`）
  - `Mineradio-1.0.9.1.0.10.patch.json`（Release label：`Mineradio-1.0.9→1.0.10.patch.json`）
- `v1.0.10` �?�布时 `gh` keyring token 失效，但普通 `git push` �?�?�用；Release 通过 Git Credential Manager �?� GitHub token �?�调用 GitHub API 创建并上传资产。
- `v1.0.9` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.9`
- `v1.0.9` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.9-Setup.exe`
  - `Mineradio-1.0.9-Setup.exe.blockmap`
  - `Mineradio-1.0.0-to-1.0.9.patch.json`
  - `Mineradio-1.0.1-to-1.0.9.patch.json`
  - `Mineradio-1.0.2-to-1.0.9.patch.json`
  - `Mineradio-1.0.3-to-1.0.9.patch.json`
  - `Mineradio-1.0.4-to-1.0.9.patch.json`
  - `Mineradio-1.0.5-to-1.0.9.patch.json`
  - `Mineradio-1.0.6-to-1.0.9.patch.json`
  - `Mineradio-1.0.7-to-1.0.9.patch.json`
  - `Mineradio-1.0.8-to-1.0.9.patch.json`
- `v1.0.9` 修�?安装包文字对比度，�?许用户自由选择安装目录，选择盘符根目录时自动补�? `Mineradio` 文件夹；软件�?�动改为�?�实例，�?�?�?�动会唤起已�?行窗�?�；移除�?次�?�动都�?新创建桌�?�快�?�方�?的行为。
- `v1.0.9` 安装器热修：用户实测旧安装包�?显示 C 盘 `AppData\Local\Programs\Mineradio`，原因是 electron-builder 内置目录页和旧安装注册表回填覆盖了默认路径。已关闭内置目录页，�?留自定义安装目录页，并在目录页显示�?强制优先使用 `D:\Mineradio`；tag 已更新到 `9d5f60c`，Release 资产已覆盖上传。
- `v1.0.9` 安装器 UI �?�续热修：安装包改为中文�?简风格，白底黑字，`#3257F7` �?色点缀；欢迎页和安装目录页都简化为中文信�?��?默认路径和�?�选目录控件。该格�?已�?存到 `docs/INSTALLER_STYLE.md`，以�?�安装包按这套方�?打包。
- 补充：快速补�?�?�修�?�?行时�?�实例和快�?�方�?问题；安装器 UI/安装目录选择体验需�?使用完整 `Mineradio-1.0.9-Setup.exe`。
- `v1.0.8` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.8`
- `v1.0.8` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.8-Setup.exe`
  - `Mineradio-1.0.8-Setup.exe.blockmap`
  - `Mineradio-1.0.0-to-1.0.8.patch.json`
  - `Mineradio-1.0.1-to-1.0.8.patch.json`
  - `Mineradio-1.0.2-to-1.0.8.patch.json`
  - `Mineradio-1.0.3-to-1.0.8.patch.json`
  - `Mineradio-1.0.4-to-1.0.8.patch.json`
  - `Mineradio-1.0.5-to-1.0.8.patch.json`
  - `Mineradio-1.0.6-to-1.0.8.patch.json`
  - `Mineradio-1.0.7-to-1.0.8.patch.json`
- `v1.0.8` 包�?� QQ 音�?播放授�?�修�?�?Home 施工�?�片和控制�?�展开�?视觉预设顺�?调整�?用户存档�?歌�?颜色�?�?��?��?�?播放/暂�?�淡入淡出，以�?�安魂�??字架选中�?�?色修�?。
- `v1.0.7` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.7`
- `v1.0.7` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.7-Setup.exe`
  - `Mineradio-1.0.7-Setup.exe.blockmap`
  - `Mineradio-1.0.0-to-1.0.7.patch.json`
  - `Mineradio-1.0.1-to-1.0.7.patch.json`
  - `Mineradio-1.0.2-to-1.0.7.patch.json`
  - `Mineradio-1.0.3-to-1.0.7.patch.json`
  - `Mineradio-1.0.4-to-1.0.7.patch.json`
  - `Mineradio-1.0.5-to-1.0.7.patch.json`
  - `Mineradio-1.0.6-to-1.0.7.patch.json`
- `v1.0.7` 包�?�电影镜头快节�?节�?分�?试调，以�?�骷髅预设改�??为“安魂�?�?副标题“骷髅·YUI7W�?�?黑体�?�片和更明显的自定义视觉色粒�?染色。
- `v1.0.6` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.6`
- `v1.0.6` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.6-Setup.exe`
  - `Mineradio-1.0.6-Setup.exe.blockmap`
  - `Mineradio-1.0.0-to-1.0.6.patch.json`
  - `Mineradio-1.0.1-to-1.0.6.patch.json`
  - `Mineradio-1.0.2-to-1.0.6.patch.json`
  - `Mineradio-1.0.3-to-1.0.6.patch.json`
  - `Mineradio-1.0.4-to-1.0.6.patch.json`
  - `Mineradio-1.0.5-to-1.0.6.patch.json`
- `v1.0.6` 将桌�?�歌�?�?桌�?�歌�?穿�?和�?纸模�?入�?�标记为开�?�中并强制关闭；软件内更新日志文案改为“�??正没什么人看，布想写日志了�?。
- `v1.0.5` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.5`
- `v1.0.5` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.5-Setup.exe`
  - `Mineradio-1.0.5-Setup.exe.blockmap`
  - `Mineradio-1.0.0-to-1.0.5.patch.json`
  - `Mineradio-1.0.1-to-1.0.5.patch.json`
  - `Mineradio-1.0.2-to-1.0.5.patch.json`
  - `Mineradio-1.0.3-to-1.0.5.patch.json`
  - `Mineradio-1.0.4-to-1.0.5.patch.json`
- `v1.0.5` 更新链路新增国内分�?下载�?下载速度/剩余时间显示�?失败原因�??示�?digest 校验和更严格的补�?版本匹�?。
- 2026-06-18 已确认 GitHub CLI / `gh auth refresh` 使用 `127.0.0.1:10808` �?�正常登录；�?�?走旧代�?� `127.0.0.1:26001`，该端�?�会 `connection refused`。需�?临时修�?时先清空 `HTTP_PROXY`/`HTTPS_PROXY`，�?设为 `http://127.0.0.1:10808`。
- `v1.0.4` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.4`
- `v1.0.4` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.4-Setup.exe`
  - `Mineradio-1.0.4-Setup.exe.blockmap`
  - `Mineradio-1.0.0-to-1.0.4.patch.json`
  - `Mineradio-1.0.1-to-1.0.4.patch.json`
  - `Mineradio-1.0.2-to-1.0.4.patch.json`
  - `Mineradio-1.0.3-to-1.0.4.patch.json`
- `v1.0.3` 已�?�布到 GitHub：`https://github.com/XxHuberrr/Mineradio/releases/tag/v1.0.3`
- `v1.0.3` Release 资产包括：
  - `latest.yml`
  - `Mineradio-1.0.3-Setup.exe`
  - `Mineradio-1.0.3-Setup.exe.blockmap`
  - `Mineradio-1.0.0-1.0.3.json`
  - `Mineradio-1.0.1-1.0.3.json`
  - `Mineradio-1.0.2-1.0.3.json`
- 用户明确说过：0.9 系列�?�?�?�?�安装补�?，直接跳过。

## Visual And Interaction Preferences

- 用户喜欢播放器当�? SVG 玻璃质感；这是黄金版本，�? `docs/GLASS_SVG_TEXTURE.md`。
- 玻璃质感�?�以套到�?�索�?�?�?按钮等区域，但�?�?改�?�播放器控制�?�当�?质感核心。
- �?明度�?能太低，�?�则会显得廉价；背景内容�?�?�时需�?微弱毛玻璃和浅填充�?�?��?��?眼花。
- UI 高亮颜色�?自定义色�?Home 填充/边框颜色�?尽�?覆盖广泛，�?�?�?�覆盖几个按钮。
- 歌手�??默认白色，�?�?跟�?自定义高亮色�?�得难读。
- 性能优化必须�?�?视觉质�?�?�?滑度和帧数稳定，�?能把效果�?掉�?�低�?�用。
- 3D 歌�?�架控制�?�和手感边界�? `docs/3D_PLAYLIST_SHELF_MEMORY.md`。

## Important Known Sensitive Areas

- `public/index.html` 很大，主 UI�?CSS�?视觉预设�?播放控制都在里�?�。改动�?用 `rg` 精确定�?，�?��?大�?��?写。
- 播放暂�?�按钮曾多次失效，涉�?�天气电�?��?下一首�?歌�?�加载�?�的�?�步状�?。修�?时必须实机验�?控制�?�按钮。
- Emily 视觉预设入场和切歌动画曾有�?�顿跳帧，优化时�?�?��?拖沓和最�?�一下跳跃。
- 3D 歌�?�架曾出现强制回星河预设�?详情页�?�挡�?滚动�?�手�?按钮设计�??差等问题。
- 左侧歌�?�页曾因一次性加载过多导致 CPU 高和回弹刷新，�?�续�?�?�虚拟化/分批渲染，�?�?回到全�?渲染。
- �?�索�? SVG 玻璃曾出现�?�侧缺失�?�??移�?白色�?�?�廉价感；修�?时�?检查黑底和亮底。

## How To Add New Memory

追加格�?：

```markdown
### YYYY-MM-DD - 简短标题

- 用户认�?�/�?求�?留：
- 涉�?�文件：
- 关键�?�数/实现：
- �?止回退或改�??的点：
```

## Memory Entries

### 2026-06-25 - 安装器路径与�?�载防误删 P0 规则

- 用户认�?�/�?求�?留：安装器默认优先 `D:\Mineradio`，D �?存在�? E/F/.../Z；�?�有电脑确实没有任何 D-Z 盘时，�?放行 `C:\Mineradio`。用户手动选 C 盘时也必须按这个规则拦截。
- 涉�?�文件：`build/installer.nsh`�?`docs/INSTALLER_STYLE.md`�?`CHANGELOG.md`�?`package.json`�?`package-lock.json`。
- 关键�?�数/实现：安装路径强制规范化到独立 `Mineradio` �?目录；�?�空且�?� Mineradio-owned 的目录阻止安装；�?�有 `.mineradio-install-root` 标记�?算 Mineradio-owned；新安装器跳过没有该标记的旧�?�载器，�?�删除旧 `Uninstall Mineradio.exe` �?�文件并清�?��?�载注册表；新�?�载器�?�删除已知 Mineradio/Electron 顶层文件，`resources`/`locales` 等�?目录�?��?��?�递归空目录删除。
- �?止回退或改�??的点：�?对�?�?�?��? `RMDir /r $INSTDIR` 删除安装根目录；�?�?递归删除安装目录下的应用�?目录；�?�?默认回到 `AppData\Local\Programs` 或 C 盘；�?�?�?许用户把 Mineradio 直接装进已有�?�项目录�?�由�?�载器递归清空。

### 2026-06-25 - 多音�?接�?�热�?�拔方案与 QQ-only 登录 Bug

- 用户认�?�/�?求�?留：多接�?�扩展先作为工程方案纳入工作区，�?�续新增酷狗�?汽水�?Apple Music�?Spotify �?先按方案推进；QQ 音�?�?�登录时弹“未登录，仅试�?��?的问题必须作为�?置 P0 修�?。
- 涉�?�文件：`docs/MUSIC_PROVIDER_PLUGIN_PLAN.md`�?�?�续预计涉�?� `server.js`�?`public/index.html`�?`desktop/main.js`�?`desktop/preload.js`。
- 关键�?�数/实现：先修 QQ-only 登录播放链，�?抽 `providers/` 注册表；Provider 分 `direct-url` 与 `sdk-player` 两类，Apple Music/Spotify �?承诺直链播放，酷狗/汽水先�?�能力验�?。
- �?止回退或改�??的点：�?�?让网易云登录�?�?为 QQ 或其它 Provider 的播放�?置�?�件；�?�?把新增�?继续硬塞�?更多分支；�?�?承诺所有平�?�都能�?网易云/QQ 一样返回�?�直接播放 URL。

### 2026-06-25 - Ctrl 缩放�?��?临时处�?�与 Bug 计划

- 用户认�?�/�?求�?留：用户�??馈 `Ctrl+-` 缩�?窗�?�/页�?��?�无法通过 `Ctrl++` 放大回�?�，�?装无效；该问题需�?进入工作区更新 Bug 计划，并先�??供临时�?��?方案。
- 涉�?�文件：`docs/WORKSPACE_UPDATE_BUG_PLAN.md`�?�?�续预计涉�?� `desktop/main.js`。
- 关键�?�数/实现：本机已观察到 `%APPDATA%\Mineradio\Preferences` 内 `partition.per_host_zoom_levels` 记录 `127.0.0.1: -1.0`；临时优先�?试 `Ctrl+0`，兜底清�?� Preferences 中的 `per_host_zoom_levels`，�?�?删除整个 `%APPDATA%\Mineradio`。
- �?止回退或改�??的点：正�?修�?必须覆盖 `Ctrl+=`�?`Ctrl+Shift+=`�?`Ctrl+NumpadAdd`�?`Ctrl+NumpadSubtract` 和 `Ctrl+0`，并处�?�旧用户数�?�残留；�?�?�?求用户通过�?装解决。

### 2026-06-25 - �?纸模�?�?Wallpaper Engine 与�?明玻璃模�?方案记录

- 用户认�?�/�?求�?留：当�?讨论形�?一份�?�续工程方案；未�?�新对�?处�?��?纸模�?�?Wallpaper Engine �?�动�?主窗�?��?明穿�?�?MyDockFinder �?�让�?�?�拖动�?�?控制�?�时，先读�?�专门方案文档，�?�?�?�沿用当�?实验�?�?纸代�?。
- 涉�?�文件：`docs/WALLPAPER_ENGINE_DESKTOP_FUSION_PLAN.md`�?�?�续预计涉�?� `desktop/main.js`�?`desktop/preload.js`�?`desktop/overlay-preload.js`�?`public/index.html`�?`public/wallpaper.html`。
- 关键�?�数/实现：方案拆�?普通模�?�?�?明玻璃模�?�?MR 原生桌�?��?纸模�?�?Wallpaper Engine Web �?纸�?�动模�?；优先建议先�?��?明玻璃模�? MVP，�?�?构 WorkerW �?纸视觉层 + 独立控制�?�浮层，然�?��?� MyDockFinder 自动探测/手动安全区，最�?��?� Wallpaper Engine 轻�?�动与本地桥接深�?�动。
- �?止回退或改�??的点：�?�?直接解�?当�? `wallpaperMode` 实验开关；�?�?让�?明空白区域挡�?桌�?�图标�?任务�?或 MyDockFinder；�?�?把播放器黄金版 SVG 玻璃质感改�?普通毛玻璃；�?�?把 Wallpaper Engine 当作 Electron 容器，需输出独立 Web �?纸包。

### 2026-06-24 - 1.1.0 纯净安装�?�布边界
- 用户认�?�/�?求�?留：`v1.1.0` 从当�?�?�信�?�?�?新打包为纯净安装版并�?�布到 GitHub；旧 `v1.0.10` �?�更早 `.exe` 安装包需�?标记隔离，�?�?作为推�??安装�?��?。
- 涉�?�文件：`CHANGELOG.md`�?`README.md`�?`SECURITY.md`�?`RELEASE.md`�?`docs/SECURITY_REBUILD_2026-06-24.md`�?`docs/RELEASE_NOTES_v1.1.0.md`。
- 关键�?�数/实现：本次�?生�? `v1.0.10 -> v1.1.0` 快速补�?，�?上传 `latest.yml`，GitHub Release �?作为旧版软件内更新通�?� latest；用户需�?手动下载 `Mineradio-1.1.0-Setup.exe` 并纯净安装。
- �?止回退或改�??的点：�?�?把旧安装包�?新标为�?�信；�?�?让 `v1.0.10` 客户端通过软件内更新自动拉�?� `v1.1.0`；�?�?�?用旧 `dist`�?旧备份包或历�?� packaged build。

### 2026-06-24 - 默认测试作为默认用户存档
- 用户认�?�/�?求�?留：`E:\Download\默认测试.json` 需�?�?为软件首次�?�用默认用户存档，并且软件内视觉�?�数默认值也按这份 JSON 快照�?始化。
- 涉�?�文件：`public/index.html`�?`public/default-user-fx-archive.json`。
- 关键�?�数/实现：`fxDefaults` 与 `PACKAGED_DEFAULT_FX_SNAPSHOT` �?�步为「默认测试�?；没有本地 `mineradio-lyric-layout-v1` 时 `readSavedLyricLayout()` 使用 packaged snapshot；没有本地用户存档 key 时自动创建「默认测试�?存档槽�?。
- �?止回退或改�??的点：�?�?让首次�?�动回到旧�?�色 UI�?动�?自动�?�?歌�?�架或播客默认显示；�?�?覆盖已有用户本地存档，�?�在首次没有用户存档 key 时�?入默认槽。

### 2026-06-24 - 歌�?�详情页歌�?�?明度边界
- 用户认�?�/�?求�?留：3D 歌�?�详情页打开时，歌�?�?�?�?�?默认�?�读感，�?能为了�?�让详情页把歌�?压到几乎看�?�?；真正目标�?�是�?�?�?�挡详情页和中心高亮行。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：`updateStageLyrics3D()` 使用 `shelfDetailLyricProfile` 分离文字�?明度�?readability�?辉光�?sun/spark 和退场歌�?；普通详情页文字目标约 `0.38`�?骷髅详情页约 `0.30`，详情页�?�更低 `renderOrder` 和削弱辉光�?�让，而�?是把正文�?到 `0.055`。
- �?止回退或改�??的点：�?�?�?��?详情页选歌/切歌时新�?或旧�?�?然跳亮；�?�?把歌�?整体压�?幽�?��?明，也�?�?让�?�光层�?新横穿并盖�?详情页中心高亮行。

### 2026-06-24 - 用户存档应用必须�??交播放�?视觉预设
- 用户认�?�/�?求�?留：应用用户视觉存档�?�，跳转歌曲�?切歌�?播放�?�?��?�?能回退到应用存档�?的上一个视觉预设；用户�?应该需�?�?次点击预设�?能稳定。
- 涉�?�文件：`public/index.html`。
- 关键�?�数/实现：`applyFxArchiveSnapshot()` 应用存档时调用 `setPreset(targetPreset, { noSave: true, commitPlaybackPreset: true })`，�?�步更新 `playbackVisualPreset` 和 `startupVisualPreviewActive`；`setPreset()` 在�?� `noSave` 的用户点击路径下，�?�使预设编�?�未�?�化也�??交播放�?预设并�?存本地布局。
- �?止回退或改�??的点：�?�?把用户存档应用�?��?�留在 `fx.preset` 当�?画�?�状�?；切歌�?��?路径 `switchPlaybackVisualToEmily()` 读�?�的是 `playbackVisualPreset`，任何用户明确应用/点击的预设都必须�?�步这个播放�?值。

### 2026-06-24 - 高级性能设置和常驻歌�?�架实�?�边界
- 用户认�?�/�?求�?留：设置里的高级性能选项需�?进入本地存档和用户存档，退出软件�?�?��?��?留；直播�?��?��?�?开�?��?��?能�?进入低�?�用暂�?�。常驻 3D 歌�?�架默认应接近�?�键展开�?�的实�?�质感，�?�?�?是�?�暗�?��?明幽�?��?�。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：高级设置新增 `fx.performanceBackground`（`auto`/`keep`/`release`）和 `fx.performanceQuality`（`eco`/`balanced`/`high`/`ultra`），与旧字段 `fx.liveBackgroundKeep` 兼容；`saveLyricLayout()`�?`readSavedLyricLayout()`�?`normalizeFxArchiveSnapshot()` 都�?�?留这些字段。常驻歌�?�架 `passiveAlways` 默认�?�?实�?�亮度/�?明度，但层级边界�?由 `selected`/`floatMix` 控制，未命中时�?能长期压�?歌�?。
- �?止回退或改�??的点：�?�?让高级性能设置�?�存在 UI�?�?进本地/用户存档；�?�?为了常驻实�?�质感把歌�?�架永久抬到歌�?上层，�?�有鼠标命中/选中�?�片时�?�?许浮起到歌�?�?景。

### 2026-06-24 - 3D 歌�?�架内容开关与直播�?��?��?�?
- 用户认�?�/�?求�?留：3D 歌�?�架需�?�?��?�独关闭播客歌�?�显示；“我的歌�?� + 收�?歌�?��?默认�?�?留滚到底切页，开�?��?�并开关�?��?按一�?�线连续滚到底；全�?模�?视觉引导/热键按钮�?能�?被全�? DIY 悬浮入�?��?�挡；高级设置里的“直播�?��?��?�?�?开�?��?��?��?�或最�?化�?能进入低�?�用暂�?�。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：`fx.shelfShowPodcasts` 默认 `true`，`fx.shelfMergeCollections` 默认 `false`，`fx.liveBackgroundKeep` 默认 `false`；歌�?�架列表签�??�?包�?�这两个内容开关并在切�?�时 `shelfManager.rebuild(true)`；直播�?��?��?�?通过 `isLiveBackgroundKeepMode()` 阻断 `isDeepBackgroundMode()` 和�?�?窗�?�视觉�?载；视觉引导使用 `body.visual-guide-active` �?�?全�? DIY 浮层并把 `#visual-guide` �??到更高层级。
- �?止回退或改�??的点：�?�?把播客从歌�?�架里永久移除，也�?�?默认�?�并收�?歌�?�；�?�?让直播�?��?��?�?开�?��?��?把画�?��?到 1fps�?4x4 renderer�?�?�? canvas 或强制暂�?�视觉；�?�?�?��?全�? DIY 入�?��?�挡视觉引导热键区域的问题。

### 2026-06-24 - 3D 歌�?�详情页动�?/�?��?绑定边界

- 用户认�?�/�?求�?留：3D 歌�?�详情页在动�?镜头模�?下�?继续跟�?镜头；�?��?/固定模�?�?和�?�?�粒�?/画布绑定旋转移动。动�?镜头 + 常驻歌�?�架�?�时开�?�时，�?�?�粒�?区域�?能被误当�?歌�?�架触�?�区。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：`makeContentListManager().open()/update()` 按 `shouldUseShelfDynamicCamera('shelf-detail')` 分�?，动�?详情页使用 `camera.quaternion`，�?��?详情页使用 `particles.rotation` 绑定；常驻未 pinned 时 `isSideShelfFocusHit()`�?滚轮和点击�?�认真实�?�片命中，�?�?用常驻状�?裸触�?� shelf focus。
- �?止回退或改�??的点：�?�?把动�?详情页也绑到�?�?�粒�?轴上；�?�?�?��? `shelfAlwaysVisible()` 直接让整个画布/�?�?�区触�?� 3D 歌�?�架 focus�?滚轮或点击。

### 2026-06-24 - 歌�?必须绑定�?�?�粒�?世界轴

- 用户认�?�/�?求�?留：旋转�?�?�粒�?到左上方俯视等大角度时，歌�?应该和画布粒�?绑定死一起�?动，�?能出现�??轴�?过度倾斜�?�?绕�?�一个轴滑走的感觉；固定/�?��?歌�?�详情页打开时，歌�?�?能挡�?详情页中心高亮行。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：自由歌�?模�?使用 `particles.getWorldPosition()` 和 `particles.getWorldQuaternion()` 作为歌�?组的世界�?置/四元数基准，`setStageLyricViewBasisFromCameraOrQuaternion()` 传入粒�?四元数时�?能被相机轴覆盖；详情页打开时�?低 `stageLyrics.group.renderOrder`，并把歌�?正文�?readability�?glow�?sun�?sparks 压�?背景弱光；详情中心高亮行强制使用更实的黑玻璃底和更高中心行 opacity，�?��?�?明玻璃让歌�?穿�?。
- �?止回退或改�??的点：�?�?�?��?相机�??标轴 + �?�?�欧拉角混�?�的歌�?姿�?算法；�?�?让固定歌�?�详情页�?次被�?�光歌�?横穿�?�挡，也�?�?把中心高亮行改回完全跟�?全局�?明度的状�?。

### 2026-06-24 - 3D 歌�?�架详情页和固定角度�??好

- 用户认�?�/�?求�?留：3D 歌�?�架选择音方�?�是对的，但�?更清脆，�?? PSP/机械齿轮咔哒，�?�?�?闷；侧�?�角度 `-15` �?是�?��?/固定时与画布粒�?平行的默认�?�?�，动�?默认�?为 `0`；歌�?�详情页�?更大�?更上，中心高亮区尽�?和歌�?�?�水平，并且跟�?�?�?�粒�?/画布旋转移动，�?�?打开�?��?硬贴�?�镜头。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：`shelfDefaultAngleForCameraMode()` 规定 dynamic=0�?static=-15，`shelfAngleYManual` �?�在用户手动拖动滑�?��?��?�用自定义；详情页�?�骷髅布局放大�?上移�?轻微收中，`makeContentListManager().update()` 使用 `particles.rotation` 绑定详情页旋转和轻微�?置�?�动；动�? `shelf-detail` 镜头�?�焦放轻，�?少硬拉镜头。
- �?止回退或改�??的点：�?�?把�?��?/固定默认角度改回 0；�?�?让详情页�??�?�??下�?脱离画布粒�?�?打开时硬跟�?镜头；选择音效�?�?�?�回闷�?低频点击。

### 2026-06-24 - 3D 歌�?�架滚动选择音和滚轮热区

- 用户认�?�/�?求�?留：滚动选择�?跟�?中心�?�/中心行高亮，并有类似 PSP 的清脆机械齿轮咔哒选择音；鼠标滚轮触�?�区�?能�?��?��?�?�粒�?�?��?。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：`step()` 和详情 `scrollBy()/next()/prev()` 在中心目标�?�化时�?�步高亮并调用 `playShelfSelectTick()`；选择音用 WebAudio �?��?，�?引入外部二进制素�??。侧�?滚轮接管使用 `isShelfWheelZone()`�?真实�?�片命中和详情�?��?�/行命中，�?�?用�?��? `isShelfPreviewUseZone()`。
- �?止回退或改�??的点：�?�?�?��?滚动高亮�?�?�步�?选择完全无声�?或常驻/预览状�?下�?��?滚轮都被 3D 歌�?�架抢走的问题。

### 2026-06-24 - 3D 歌�?�架常驻�?�?�挡歌�?

- 用户认�?�/�?求�?留：常驻状�?�?能长期�?�挡歌�?；�?�有鼠标命中/选中 3D 歌�?�架�?�片时，�?�片�?浮起到歌�?�?景并呈现高亮质感。歌�?�详情页打开�?��?�?�?选中行居中，页�?�完整显示，�?能�?�侧被�?�?或整体�??下。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：常驻未选中时 shelf group/card �?低层级和�?明度；`updateShelfCardHoverSelection()` 负责�?�步悬�?�选中，`setSelected()` 必须按真实 `card.index` 匹�?；选中�?�片用 `floatMix` 过渡�?置�?缩放�?亮度和 renderOrder。详情页�?�骷髅布局在 `shelfLayoutProfile().detail`�?�?��?� x �??移和 row base/intro/parallax �?�数处收回居中。
- �?止回退或改�??的点：�?�?�?��?常驻�?�片压�?歌�?�?悬�?��?浮起�?详情页�?�侧�?切或�??下�?居中的状�?；�?�?破�??固定状�?下打开歌�?�详情和点击播放按钮的命中回退。

### 2026-06-24 - �?存 3D 歌�?�架控制�?�和手感边界

- 用户认�?�/�?求�?留：修过的 3D 歌�?�架控制�?��?常驻/�?��?镜头�?详情页层级和歌�?�?�让逻辑需�?�?存，�?�续�?�?回退到�?�挡�?误触�?强制切预设或手感散掉的版本。
- 涉�?�文件：`public/index.html`�?`docs/3D_PLAYLIST_SHELF_MEMORY.md`。
- 关键�?�数/实现：控制�?��?留歌�?�架模�?�?镜头模�?�?显示模�?�?独立颜色和大�?/�?置/景深/角度/�?明度滑�?�；调�?�优先看 `shelfLayoutProfile()`�?`makeShelfManager()`�?`makeContentListManager()`�?`setFocusZone()`。
- �?止回退或改�??的点：�?�?推倒�?�?�歌�?�架手感；�?�?�?��?详情页�?�挡�?滚动�?�手�?Home 穿�?�?�?�键歌�?�架误唤底部控制�?��?shelf �?建误报歌�?�加载失败等旧问题。

### 2026-06-24 - 1.1.0 安全�?建�?�?优先

- 用户认�?�/�?求�?留：�?�绒全盘查�?�并隔离大�?感染文件�?�，Mineradio 先走�?�?�?�信�?建路线；该边界已�?�级为 `v1.1.0` 纯净安装�?�布�?程，旧安装包�?�?�?�信。
- 涉�?�文件：`package.json`�?`package-lock.json`�?`CHANGELOG.md`�?`server.js`�?`public/index.html`�?`.gitignore`�?`docs/SECURITY_REBUILD_2026-06-24.md`。
- 关键�?�数/实现：`v1.1.0` 作为安全�?建版本；`.playwright-cli/`�?`output/`�?`tmp/` �?进 Git；软件内更新失败时�?�?自动无�?切�?�到完整安装包，下载好的安装包需用户手动打开；�?�布安装包必须从当�? Git-tracked �?�?�?新构建并扫�??。
- �?止回退或改�??的点：�?�?�?用旧感染环境产出的安装包；�?�?把旧 `dist`�?旧 `node_modules`�?�?览器 profile 或临时扫�??资料�??交到 GitHub；旧安装包需�?隔离标注。

### 2026-06-22 - �?存桌�?�歌�?白底/黑底�?�读视觉效果

- 用户认�?�/�?求�?留：当�?桌�?�歌�?白底�?�读效果“很好�?，需�?记录�?存，�?�续�?�?�?改�?�?�黄分层�?绿色方片或�?�挡�?��?��?作的版本。
- 涉�?�文件：`public/desktop-lyrics.html`�?`desktop/main.js`�?`desktop/overlay-preload.js`�?`docs/DESKTOP_LYRICS_VISUAL.md`。
- 关键�?�数/实现：歌�?字心必须�?�?软件内歌�?/预设原色；白底�?�读性�?�用 `.lyric-viewport` 外层中性 `drop-shadow(0 1px 2.4px rgba(4,6,12,.58)) drop-shadow(0 0 4.8px rgba(4,6,12,.30))` 和 `.line` �?细白�??边 `-webkit-text-stroke:.18px rgba(255,255,255,.72)`；�?定�?由主进程�?�?鼠标穿�?，中键�?定/解�?通过 `GetAsyncKeyState(4)` + 歌�?热区处�?�。
- �?止回退或改�??的点：�?�?�?��? `mix-blend-mode`�?`difference`�?`multiply`�?`.line::before`�?`.line::after` 对比层；�?�?用�?暗�??边/伪文字层把歌�?染�?�染黄；�?定�?�?�?�?新�?�获鼠标导致�?�挡�?��?��?作；改桌�?�歌�?�?先读 `docs/DESKTOP_LYRICS_VISUAL.md`。

### 2026-06-22 - 情绪节�?音效大师方案记忆

- 用户认�?�/�?求�?留：情绪节�?音效大师先作为�?�续开�?�方案�?存，之�?��?�直接调用本方案继续实现。
- 涉�?�文件：�?�续预计涉�?� `dj-analyzer.js`�?`public/index.html`�?`server.js`（如需缓存/接�?�），当�?仅记录方案。
- 关键�?�数/实现：自研本地引擎，�?�?赖网易云�?有音效接�?�；分�? BPM�?鼓点置信度�?kick/snare/onset�?能�?曲线�?段�?��?�化�?drop�?低频比例�?亮度�?人声密度�?动�?范围；输出 `energy/aggression/groove/space/brightness/warmth/stability` 等情绪节�?�?�数；音效层使用 WebAudio 的轻�? EQ�?动�?压缩�?�?幅�?轻微饱和�?空间宽度，默认“自动·轻微�?，带原声 A/B 和一键关闭；视觉电影镜头读�?��?�一情绪节�?结果，电�?歌�?? kick �?�?，摇滚�??军鼓/段�?�爆�?�，阴�?歌�??慢推镜和粒�?呼�?�。
- �?止回退或改�??的点：�?�?�?赖网易云�?�?�控�?有音效模型；�?�?默认强处�?�导致原曲削波�?音�?跳�?�或�?�感�?�闷；必须有音�?匹�?�?防削波�?CPU 上�?�?失败回退原声和�?�曲关闭能力。第一阶段优先�?�“分�?层 + UI 状�?展示 + �?守 EQ/压缩�?，确认�?�感�?��?接电影镜头。

### 2026-06-22 - 播放器控制�?�音质按钮�?置审美

- 用户认�?�/�?求�?留：音质按钮应放在播放器控制�?�左侧歌曲信�?�区，�?于歌�??/歌手信�?��?�侧；�?�?�?塞回�?�侧模�?按钮区。
- 涉�?�文件：`public/index.html`。
- 关键�?�数/实现：`#quality-control` �?于 `.control-cluster.actions` 内，紧跟 `.control-track` 之�?�；�?�侧 `.control-cluster.modes` �?��?留歌�?�?音�?�?�?�?/沉浸/全�?/时间等模�?控制。
- �?止回退或改�??的点：�?�侧控制区�?�?�?次被音质按钮挤爆；左侧按钮�?�?歌曲信�?�的状�?胶囊，固定尺寸�?轻�?�?和歌�??�?�?呼�?�感，�?能压�??歌�??�?略与控制�?�平衡。

### 2026-06-22 - �?存安装包中文�?简格�?

- 用户认�?�/�?求�?留：当�?安装包格�?以�?�继续沿用，中文�?简�?黑白为主�?�?色点缀。
- 涉�?�文件：`build/installer.nsh`�?`build/installerHeader.bmp`�?`build/installerSidebar.bmp`�?`docs/INSTALLER_STYLE.md`。
- 关键�?�数/实现：白底 `#FFFFFF`�?主文字 `#111217`�?弱文字 `#4B5263`/`#6B7280`�?�?色 `#3257F7`；自定义欢迎页和自定义安装目录页；默认 `D:\Mineradio`；`�?览...` 必须�?�用。
- �?止回退或改�??的点：�?�?�?��?红色 MR�?深色大�?�片�?英文大段说明�?�?�?�装饰；�?�?改回 electron-builder 原生目录页导致 C 盘旧路径回填；�?�布�?必须打开安装器验�?默认路径和�?览按钮。

### 2026-06-21 - 新对�?交接文件

- 用户认�?�/�?求�?留：当�?窗�?�对�?�?��?�时，使用固定交接文件承接上下文。
- 涉�?�文件：`docs/HANDOFF_NEXT_CHAT.md`。
- 关键�?�数/实现：新对�?先执行文件内 PowerShell 命令，读�?� `AGENTS.md`�?`docs/PROJECT_MEMORY.md` 和 `docs/HANDOFF_NEXT_CHAT.md`。
- �?止回退或改�??的点：�?�?把真实代�?目录改回旧外层�?�?目录；�?�?忘记 GitHub 代�?�端�?� `127.0.0.1:10808`。

### 2026-06-21 - 软件内更新日志轻�?文案

- 用户认�?�/�?求�?留：以�?�软件内更新日志写�?“�??正没什么人看，布想写日志了�?。
- 涉�?�文件：`CHANGELOG.md`�?GitHub Release body�?软件内更新弹窗读�?�的 release notes。
- 关键�?�数/实现：正�?�?�布时优先使用这�?�短文案，�?�?为�?版本写长篇更新说明。
- �?止回退或改�??的点：�?�?在用户未�?求时�?��?大段软件内更新日志。

### 2026-06-18 - �?存播放器 SVG 玻璃质感

- 用户认�?�/�?求�?留：播放器控制�?�当�? SVG 玻璃质感，�?�续�?作为其它�?��?�/按钮的�?�考基线。
- 涉�?�文件：`public/index.html`�?`docs/GLASS_SVG_TEXTURE.md`
- 关键�?�数/实现：`#mineradio-control-glass-filter`�?`generateControlGlassDisplacementMap()`�?`--saved-panel-glass-*`�?`--saved-button-glass-*`。
- �?止回退或改�??的点：�?�?改�?普通毛玻璃；�?�?把中心�?��?一团糊；�?�?让�?�侧缺�?��?整体�?��??或廉价白�?�?��?新出现。

### 2026-06-18 - 建立干净工作区和新对�?接力规则

- 用户认�?�/�?求�?留：工作区根目录�?�?清晰，项目�?� `Mineradio`，备份统一进入 `工作区备份`。
- 涉�?�文件：根目录 `AGENTS.md`�?项目 `AGENTS.md`�?本文件�?用户技能 `mineradio-project-memory`。
- 关键�?�数/实现：新对�?先读�?�项目说明；�?�到“�?留/喜欢/记�?�?类表达时更新本文件。
- �?止回退或改�??的点：�?�?�?把项目�?回 `editable-install\...\resources\app`；�?�?把散�?�备份�?新放到根目录。

### 2026-06-18 - 将 win-unpacked 设为 Mineradio 主�?行目录

- 用户认�?�/�?求�?留：用户实际检查软件�?� `win-unpacked` 里的 `Mineradio.exe`，所以 `win-unpacked` 已�??�?�为 `E:\桌�?�\播放器软件\Mineradio` 主目录。
- 涉�?�文件：`E:\桌�?�\播放器软件\AGENTS.md`�?`E:\桌�?�\播放器软件\Mineradio\AGENTS.md`�?`AGENTS.md`�?本文件。
- 关键�?�数/实现：真实代�?/Git 仓库移动到 `E:\桌�?�\播放器软件\Mineradio\resources\app`；�?��?行程�?在 `E:\桌�?�\播放器软件\Mineradio\Mineradio.exe`。
- �?止回退或改�??的点：以�?��?�?修改外层旧�?�?路径；改代�?必须进入 `resources\app`，�?�则用户打开 exe 看�?到效果。
- 补充：�?行版 `node_modules` �?�能没有打包�?赖；�?�布�?如缺少 `electron-builder`，在 `resources\app` 里执行 `npm install`。

### 2026-06-18 - �?留最�?化内存优化边界

- 用户认�?�/�?求�?留：用户确认当�?内存优化处�?�很好，�?�以在最�?化/窗�?��?�?时尽�?�?低�?�用。
- 涉�?�文件：`desktop/main.js`�?`public/index.html`。
- 关键�?�数/实现：Electron �?�?�?��?�节�?能力并�?��?端回传 `isMinimized/isVisible/isFocused`；�?端�?�在 `document.hidden`�?窗�?�最�?化或�?�?��?时进入 `render-deep-sleep` 与低帧渲染。
- �?止回退或改�??的点：�?�?�?因为窗�?�失焦�?放在副�?或�?�焦点状�?就�?低帧率�?�?低 DPR 或弱化电影镜头；�?�焦点�?��?窗�?�应�?�?正常视觉�?行。

### 2026-06-21 - 止痛�?�骷髅点云审美边界

- 用户认�?�/�?求�?留：骷髅预设点云�?贴�?�模型表�?��?分布�?�匀规整，有清晰建模轮廓，�?�?回到散乱�?�?�?�匀�?星尘�?�?机点云感。
- 涉�?�文件：`public/index.html`�?`public/assets/skull-decimation-points.bin`
- 关键�?�数/实现：优先使用带下颌/下牙�?�独标记点的点云资产，让下颌张嘴由标记点旋转完�?；粒�?动效�?��?�轻微呼�?��?音律振幅和伦勃朗�?明暗�?�化，�?�?�大范围�?机飘散。
- �?止回退或改�??的点：�?�?用�?�黑影或�?机粒�?堆去伪造嘴巴；�?�?牺牲点云规整性�?��?�“热闹�?的背景星河效果。

### 2026-06-21 - �?留止痛�?�骷髅低角度仰视回正

- 用户认�?�/�?求�?留：骷髅预设�?�击回正角度已确认“很好�?，�?�续�?�?回退�?正�?�平视或歪斜侧视。
- 涉�?�文件：`public/index.html`
- 关键�?�数/实现：`SKULL_MODEL_BASE_ROTATION_X = -0.26`�?`SKULL_MODEL_SCALE = 2.34`�?`SKULL_MODEL_BASE_POSITION.y = 0.22`；默认骷髅相机 `pos=(0,-2.52,4.98)`�?`look=(0,-0.20,0.02)`，�?�?低机�?仰视压迫感。
- �?止回退或改�??的点：�?�?把�?�击回正改回平视；�?�?让歌�?从嘴部�?定跳到普通镜头歌�?�?置；3D 歌�?�架打开时应使用左侧大骷髅近景�?�?�侧�??中歌�?�架构图。

### 2026-06-21 - QQ 音�?接�?�播放授�?�排障记录

- 用户认�?�/�?求�?留：�?存这次 QQ 音�?接�?�修�?记录；以�?��?�到 QQ 登录�?�头�?/昵称异常�?歌�?�能读但歌曲�?能播�?`104003` 等�?�类问题，优先按本记录排查。
- 涉�?�文件：`docs/QQ_MUSIC_INTERFACE_NOTES.md`�?`server.js`�?`desktop/main.js`�?`public/index.html`。
- 关键�?�数/实现：区分网页账�?��? `p_skey` 和播放票�?� `qm_keyst`/`qqmusic_key`/`music_key`/`wxskey`；`/api/qq/login/status` 返回 `playbackKeyReady`；缺播放票�?�时 `104003` 归类为 `login_required`；昵称头�?用 `ptnick_*` 和 `qlogo.cn` 兜底。
- �?止回退或改�??的点：�?�?�?把 `p_skey` 当作完整 QQ 音�?播放授�?�；�?�?因为 QQ 资料接�?� `code:1000` 就清空头�?/昵称或标记未登录；修 QQ 播放�?先读 `docs/QQ_MUSIC_INTERFACE_NOTES.md`。
### 2026-06-26 - Spotify Phantom Player Integration

- ????/????:Spotify ????? Phantom ?????????
- ????:desktop/main.js?public/index.html?
- ????/??:main.js ?? pp.whenReady() ???????????? createPhantomPlayer() ???????? https://open.spotify.com ??????? index.html ? etchMusicSearchResults ? playQueueAt ???? executePhantomSpotify ????? Phantom Window ??,???? CORS ??? Web Player ? Device ???
- ?????????:????????? Spotify Web API etch,????? CORS ??;????????? ${spotifyToken} ??????;??????? Spotify ???????? Phantom Window ????

