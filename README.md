# 每日任务工作台

一个**单文件 HTML** 个人任务管理应用。无需构建、零外部依赖，双击 `index.html` 即可使用；也支持一键部署到 CloudStudio 或 EdgeOne Pages 获得公网访问。

![HTML](https://img.shields.io/badge/HTML-98.4%25-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-1.6%25-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 简介

「每日任务工作台」是为个人日常事务管理设计的轻量 Web 应用。所有界面、样式、脚本、图标全部内联在一个 `index.html` 文件中，不依赖任何 CDN、框架或图表库。支持任务登记、周分组展示、进度看板、深色模式、AI 直连以及多端同步。

| 属性 | 说明 |
|---|---|
| 技术栈 | 原生 HTML5 + CSS3 + ES6，SVG 手绘图表 |
| 存储 | 浏览器 localStorage（默认）+ GitHub Gist（可选同步，免 KV 审批） |
| 依赖 | 零外部依赖，离线可用 |
| 图标 | 零 emoji，全部内联 SVG |

---

## 功能特性

### 1. 今天要处理（置顶区）
- 自动汇总：**逾期 / 今天到期 / 3 天内到期** 的任务。
- 逾期任务标红并显示「逾期 N 天」。
- 每条任务提供 **+25% 进度 / 顺延 1 天 / AI 处理** 三个一键操作。
- 未完成的过期任务不会消失，持续置顶提醒。

### 2. 登记任务
- 任务名称、截止日、协助人（逗号分隔多人）。
- 风险等级：高 / 中 / 低。
- 风险说明与卡点、任务状态、进度滑块 0-100%。
- 详情备注。

### 3. 任务清单
- 6 种筛选：全部 / 逾期 / 待开始 / 进行中 / 已完成 / 高风险。
- 关键词搜索 + 4 种排序。
- 行内进度条、详情展开查看 AI 处理记录。
- 支持编辑与删除。
- **按周分组**：以周一为起点，任务按截止周折叠展示（如「第 33 周（08/11-08/17）· 5 项」）。

### 4. 进度看板
- 4 个核心 KPI 卡片。
- 完成率环形图。
- 风险分布柱状图。
- 协助人负载条形图。
- 近 14 天完成趋势折线图。
- 全部图表使用内联 SVG 手写，深浅色模式自适应。

### 5. AI 直连
- 在「AI 设置」中填入 **Base URL + API Key + 模型名**，兼容所有 OpenAI 格式接口（DeepSeek / Moonshot / OpenAI / 自建网关）。
- Base URL 智能补全：`https://api.deepseek.com` 自动补成 `.../v1/chat/completions`。
- 支持流式输出、停止生成、连接测试。
- AI 自动读取任务上下文：截止日、剩余天数、风险等级、卡点、协助人、进度全部注入 prompt。
- 5 个快捷动作：拆解执行步骤 / 风险应对方案 / 写催办话术 / 生成进度汇报 / 今日全局作战计划。
- 回答支持 Markdown 渲染，可一键「保存到任务记录」。

### 6. 深色模式
- 全站 CSS 变量化，`html[data-theme="dark"]` 覆盖整套变量。
- 顶栏一键切换，偏好持久化到 `localStorage`（`wb_dtw_theme`）。
- 图表 SVG 全部改用变量着色，暗色下清晰可读。

---

## 快速开始

### 本地使用

```bash
# 1. 克隆仓库
git clone https://github.com/Jeas-Code/DailyTask.git
cd DailyTask

# 2. 直接用浏览器打开
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

> 推荐使用 Chrome / Edge / Safari 打开。Firefox 也能正常使用，部分毛玻璃效果可能略有差异。

### 移动端添加主屏

由于页面设置了 `apple-mobile-web-app-capable`，在 iOS Safari 中点击「分享 → 添加到主屏幕」后，可像原生 App 一样全屏运行。

---

## 项目结构

```
DailyTask/
├── index.html              # 单文件前端（HTML + CSS + JS + 内联 base64 背景图）
├── functions/
│   └── api/
│       └── sync.js         # EdgeOne Pages Function：/api/sync 同步后端
├── overview.md             # 交付说明与迭代记录（内部文档）
└── README.md               # 本文件
```

---

## 部署方式

### 方式一：CloudStudio（纯静态，免 token）

适合「只想在线打开、不需要后端同步」的场景。

1. 将 `index.html` 上传到 CloudStudio 工作区。
2. 发布静态站点，获得公网链接。
3. 完成：链接可直接分享，任何人访问都看到 v5 版本。

> CloudStudio 只托管静态文件，`/api/sync` 不会生效。若需要跨端同步，请使用 EdgeOne Pages 部署。

### 方式二：任意静态托管 + GitHub Gist 同步（推荐）

适合「手机 / PC / 平板实时同步任务」的场景。同步后端改为**前端直连 GitHub Gist**，**无需 EdgeOne KV 审批**，CloudStudio / EdgeOne Pages / GitHub Pages 任意静态托管都能用。

1. 将 `index.html` 部署到任意静态托管（EdgeOne Pages 静态 / CloudStudio / GitHub Pages 均可，不再需要 Functions）。
2. 打开页面 →「更多」→ 自动同步区：
   - 填写 **GitHub Token**（需勾选 `gist` 权限，生成地址 `github.com/settings/tokens`）；Token 仅存本机浏览器，不上传任何服务器。
   - **Gist ID** 留空则首次同步自动新建私有 Gist；多设备填**相同 Gist ID** 即共享同一份数据。
   - 勾选「开启」→ 保存。
3. 其他设备填相同 Gist ID + 各自 GitHub Token，即可实时互相同步（每 20s 自动拉取）。

> 数据存于你的**私有 Gist**（仅本账户可见）。合并策略为 per-task last-write-wins（按 `updatedAt`）+ 删除墓碑传播，多端增删改均正确收敛。原 EdgeOne KV 方案（`functions/api/sync.js`）已停用，仅在 KV 审批通过后按需切回。

---

## 数据安全与备份

- 本地优先：所有任务默认保存在浏览器 `localStorage`，key 前缀为 `wb_dtw_`。
- 导出备份：支持导出 JSON 备份和 CSV（带 BOM，Excel 直接打开不乱码）。
- 导入恢复：按任务 `id` 合并去重，不会覆盖较新的本地数据。
- 清空数据需二次确认；数据满 30 条自动提示备份。
- API Key 仅保存在本地浏览器，**不会上传到任何服务器**；「清除 Key」按钮可随时清空。
- 开启 EdgeOne 自动同步后，任务数据（及勾选时的 AI Key）会写入 EdgeOne 云端 KV，位于你账户的 1GB 额度内。请确认接受此前提后再开启。

---

## 已知边界

- **CORS 限制**：浏览器直连模型接口受目标服务商 CORS 策略限制。DeepSeek、OpenAI 等主流服务通常支持；若报 `Failed to fetch`，请换用支持 CORS 的服务或走中转网关。
- **同步后端**：云端同步走 GitHub Gist 前端直连，无需 EdgeOne KV 审批；首次同步自动建私有 Gist，多设备填相同 Gist ID 即共享数据。
- **链接 token 时效**：EdgeOne Pages 的预览链接带 `eo_token/eo_time` 鉴权参数，token 约 3 小时有效，过期后需在控制台重新获取或重新部署。
- **公共设备提醒**：部署到公网后页面任何人可访问，但数据仍保存在各自浏览器（或各自的同步密钥空间）。公共设备使用完后请清除本地数据或 API Key。

---

## 版本迭代

| 版本 | 时间 | 主要内容 |
|---|---|---|
| v1 | - | 每日任务工作台基础版：四模块、任务管理、KPI 与图表 |
| v2 | - | 深色模式 + 今日作战计划 AI 入口 |
| v3 | - | 背景图 + 周分组 + 同步码迁移 + 项目迁移到 GitHub |
| v4 | - | EdgeOne Pages KV 真同步（per-task last-write-wins + 删除墓碑） |
| v5 | 2026-08-10 | 背景图更明显 + 圆角玻璃卡片 UI 升级 |
| v6 | 2026-08-17 | 云端同步从 EdgeOne Pages KV 迁移到 GitHub Gist 前端直连（免 KV 审批，任意静态托管均可同步）；EdgeOne `sync.js` 降级为 410 废弃占位 |

完整迭代细节见 [`overview.md`](./overview.md)。

---

## 在线访问

- **CloudStudio 部署（v5，免 token）**：https://f0d171f06d914ea7b518a07a63bb66b8.gz4.agentos-app.net
- **EdgeOne Pages 部署（v5，带时效 token）**：https://daily-task-workbench-2pzvf6lp.edgeone.cool?eo_token=94c48bbad875290f8e3df18d93aaf2f3&eo_time=1786346703
- **旧 CloudStudio 工作区（v4，未更新）**：https://2d82a6af9388416eb87882901ca7517e.sh3.agentos-app.net
- **源代码**：https://github.com/Jeas-Code/DailyTask

---

## 作者

**Jeas-Code** · [GitHub](https://github.com/Jeas-Code)

如有建议或问题，欢迎通过 GitHub Issues 反馈。
