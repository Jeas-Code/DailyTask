# 每日任务工作台 — 交付说明

**文件**：`index.html`（单文件前端，零外部依赖，双击即用）+ `functions/api/sync.js`（EdgeOne Pages 同步后端）

## 四个模块

| 模块 | 内容 |
|---|---|
| 今天要处理（置顶） | 逾期 / 今天到期 / 3 天内到期自动汇总，逾期标红并显示「逾期 N 天」；每条带 +25%、顺延 1 天、AI 处理三个一键操作。未完成的过期任务永远留在此区，不会凭空消失 |
| 登记任务 | 任务名称、截止日、协助人（逗号分隔多人）、风险等级（高/中/低）、风险说明卡点、状态、进度滑块 0-100%、详情备注 |
| 任务清单 | 6 种筛选（全部/逾期/待开始/进行中/已完成/高风险）+ 关键词搜索 + 4 种排序；行内进度条、详情展开查看 AI 处理记录、编辑/删除 |
| 进度看板 | 4 个 KPI + 完成率环形图、风险分布柱状图、协助人负载条形图、近 14 天完成趋势折线图（全部内联 SVG 手写） |

## AI 直连能力

- 在「AI 设置」填 **Base URL + API Key + 模型名** 即可，兼容所有 OpenAI 格式接口（DeepSeek / Moonshot / OpenAI / 自建网关）
- Base URL 智能补全：填 `https://api.deepseek.com` 自动变成 `.../v1/chat/completions`，界面实时显示最终请求地址
- 支持流式输出（可关闭）、停止生成、连接测试
- **AI 自动读取任务上下文**：截止日、剩余天数、风险等级、卡点、协助人、进度全部注入 prompt
- 5 个快捷动作：拆解执行步骤 / 风险应对方案 / 写催办话术 / 生成进度汇报 / 今日全局作战计划
- 回答支持 Markdown 渲染，可一键「保存到任务记录」沉淀到对应任务下

## 数据安全

- localStorage 持久化，key 前缀 `wb_dtw_`
- 首屏「导出备份」「导入恢复」（导入按 id 合并去重，不限条数）
- 额外支持导出 CSV（带 BOM，Excel 直接打开不乱码）
- 清空全部数据需二次确认；数据满 30 条自动提示备份
- API Key 只存本地浏览器，不上传任何服务器；「清除 Key」按钮随时清空

## 已验证

- 内联 JS 语法校验通过（约 892 行）
- 零外部引用（无 CDN / 字体 / 图表库）、零 emoji 图标（全 SVG）
- DOM stub 冒烟测试：初始化、5 条示例数据、完成/顺延/加进度操作链路、6 种筛选、4 张图表、空数据边界渲染全部通过
- Markdown 渲染器修复两处：代码块被误包 `<p>`、代码块语言标识被当正文

## 已知边界

- 浏览器直连模型接口受 **CORS** 限制。DeepSeek、OpenAI 等主流服务支持；若报「Failed to fetch」，页面会给出三条排查提示，需换支持 CORS 的服务或走中转网关
- 部署到公网后链接任何人可访问（数据仍在各自浏览器本地），公共设备用完请清除 Key

## 迭代 v2：深色模式 + 今日作战计划入口

- **深色模式**：全站 CSS 变量化（`--bg/--card/--txt/--field/--track/--pri` 等），`html[data-theme="dark"]` 覆盖整套变量；顶栏新增「深色/浅色」切换按钮，选择持久化到 `localStorage`（key `wb_dtw_theme`），下次打开自动恢复。图表 SVG 全部改用变量着色，暗色下清晰可读。
- **今日作战计划入口**：「今天要处理」顶栏新增「今日作战计划」按钮，一键让 AI 读取今天全部任务（逾期/今天到期/3 天内），输出优先级排序 + 时间块建议，并自动滚动到 AI 区查看结果。
- 暗色下反白元素已处理：`.btn.danger`、`.kpi`、`.cbx`、`.chip.grey`、`.pbar` 进度条、`.ai-out th`、`.toast`、排序下拉框均改用变量；主按钮/导航高亮在暗色下改用深色文字保证对比度。

## 迭代 v3：背景图 + 周分组 + 跨端同步 + 项目迁移

- **任务背景图**：将用户提供的图片（远坂凛）压缩为 1600px 宽 JPEG(base64 ~100KB) 内联进 CSS `body::before`（封面式 fixed 背景，浅色透明度 0.12/暗色 0.06，卡片为不透明实底保证可读性）。全程零外链。
- **任务清单按周分组**：`renderList()` 先用 `weekInfo(due)`（周一为起点、ISO 周序号、含本周/上周/下周相对标记）分组，再渲染可折叠的「第 N 周（起止日期）· N 项」吸顶分组头；默认排序改为「按截止日」。提取 `taskRowHTML(t)` 复用行 HTML。
- **跨端同步（手动码，兜底）**：根因是 localStorage 按「设备+浏览器」隔离，纯静态托管（CloudStudio/EdgeOne/GitHub Pages 都只是托管文件，不存数据）两端天然不互通。保留「同步码」机制作兜底——`复制同步码` / `粘贴同步码` 按 id 合并迁移。详见 v4 真同步。
- **同步码可携带 AI 配置**：同步区新增「含 AI 配置」勾选（默认勾选）。勾选时同步码一并编码 `wb_dtw_aicfg`（Base URL / API Key / 模型名），粘贴恢复时自动写入本机并刷新 AI 状态；取消勾选则只同步任务，避免 Key 经明文聊天外泄。对旧版（无 aicfg）同步码向后兼容。
- **项目迁移**：`daily-task-workbench/` 已整体迁移至 `C:\Programs\DailyTask`，git 初始化并推送到 GitHub `Jeas-Code/DailyTask`（公开仓库）。本机 `C:\Program Files\GitHub CLI\gh.exe`（v2.93.0，已登录 Jeas-Code，权限齐全）可用；PATH 里的 npm 版 `gh` 包已损坏不可用，后续 GitHub 操作用 exe 全路径。
- 已重新部署到新链接（见顶部）。

## 迭代 v4：EdgeOne Pages KV 真同步（解决手机/PC 实时同步）

- **根因澄清**：之前「不同步」是架构问题——纯静态托管**没有任何后端存数据**，各浏览器 localStorage 隔离。把托管商从 CloudStudio 换到 EdgeOne Pages（静态）**不会**改善同步。真正的修复是上后端。
- **方案**：用 **EdgeOne Pages Functions + KV 存储** 做轻量同步服务，所有设备共享一份云端数据：
  - `functions/api/sync.js`：GET 按 `key`（用户自设同步密钥，服务端清洗为 `dt_<a-zA-Z0-9_>`）读取 KV；POST 按任务 `id` + `updatedAt` **逐条合并**（取较新者），支持删除墓碑 `_del` 传播。AI 配置（Base URL/Key/模型）也随同步负载透传。
  - 客户端 `save()` 改钩子 `schedulePush()`（改动后 700ms 防抖推送）；开启同步时 `init` 拉取一次 + 每 20s 轮询拉取；状态在 moreBar「同步状态」显示。
  - 合并策略为 **per-task last-write-wins（按 updatedAt）**，删除用墓碑标记而非物理删除，因此两端增/改/删都能正确传播；冲突时较新修改胜出。
- **数据隐私**：开启自动同步后，任务数据（及勾选时的 AI Key）会写入 EdgeOne 云端 KV（你 EdgeOne 账户的 1GB 额度内）。接受此前提再开启。
- **已验证**：node vm + DOM 桩测试——种子任务带 `updatedAt/_del`、拉取合并远端任务、删除墓碑生效、push 回写云端、冲突按 `updatedAt` 合并，全部通过。

## 部署到 EdgeOne Pages（步骤）

1. 在 **EdgeOne Pages 控制台** 新建项目，关联本仓库 `Jeas-Code/DailyTask`（或上传 `index.html` + `functions/`）。
2. **创建 KV 命名空间**：EdgeOne 控制台「KV 存储」→ 创建命名空间（如 `dailytask_kv`）。
3. **绑定到项目**：项目设置 → KV 存储 → 绑定命名空间，变量名务必填 **`TASK_SYNC`**（代码以此名读取 `context.env.TASK_SYNC`）。
4. 部署后访问分配的域名，`/api/sync` 即生效。
5. 任意设备打开页面 → 「更多」→ 自动同步区 → 填**相同同步密钥** → 勾选「开启」→ 保存。多端填同一密钥即共享数据。

> 注：`edgeone-pages` 连接器已连接（2026-08-07），已通过 Makers 部署，见下方链接。

## 链接

- **EdgeOne Pages 正式部署（2026-08-07）**：https://daily-task-workbench-2pzvf6lp.edgeone.cool?eo_token=da067a7b0d4ca36b2e1e715cff4c6c78&eo_time=1786104161
  - 项目 ID：`makers-jgn6hqoaq3b8`（中国站）；含 `functions/` → fullstack 类型部署，Functions 路由已通（`/api/sync` 返回业务 JSON）
  - 链接带鉴权 token（eo_token/eo_time），去掉参数 401；token 约 3 小时有效，过期后需在控制台重新获取
  - **待办：KV 未绑定**——`/api/sync` 当前返回 500「KV 未绑定」，需在控制台创建 KV 命名空间并绑定变量名 `TASK_SYNC`
- 线上（手机/PC 共用，CloudStudio 旧托管，仍可用）：https://2d82a6af9388416eb87882901ca7517e.sh3.agentos-app.net
- 源代码：https://github.com/Jeas-Code/DailyTask

## 迭代 v5：UI 视觉升级（背景更明显 + 圆角玻璃卡片）

- **背景图更明显**：`body::before` 透明度 浅色 0.12→0.20 / 深色 0.06→0.13；新增 `background-size:cover` + 轻微 `saturate/brightness` 滤镜，封面式铺满屏幕。
- **玻璃拟态卡片**：`--card / --modal / --aibg / --nav-bg` 改为半透明 + `backdrop-filter:blur(16px) saturate(165%)`，背景图透过卡片可见。
- **更大圆角**：全局 `--r` 14→18px、`--r-s` 10→13px；按钮 10→12px、搜索框/分段控件/弹窗 16→22px、复选框 7→10px、logo 10→12px 同步加大。
- **层次与悬浮**：卡片 / KPI 增加柔和阴影 + hover 上浮动效；主按钮带紫色投影；今日卡片加内高光。深色模式补 `--sh-lg` 阴影。
- 全程零外链、未改动 base64 背景图与任何 JS；CRLF 行尾保持不变（最小化 diff）。
