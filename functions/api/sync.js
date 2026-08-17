// EdgeOne Pages Function — 同步后端（已停用 / DEPRECATED）
// ---------------------------------------------------------------------------
// 自 v6 起，云端同步改为「前端直连 GitHub Gist」（index.html 内 syncKey/ghToken
// 配置 + gistGet/gistPut/gistCreate/mergeTasks），不再依赖 EdgeOne Pages
// Functions + KV 存储。这样同步彻底脱离 EdgeOne KV 审批，连 CloudStudio 纯静态
// 部署也能多端同步。
//
// 本文件保留仅为避免 EdgeOne 仍按 fullstack 部署时报 500；现返回 410 明确提示迁移。
//
// 如需切回 EdgeOne KV 方案（例如 KV 审批通过后）：
//   1) EdgeOne Pages 控制台创建 KV 命名空间，绑定变量名 TASK_SYNC
//   2) 将 index.html「自动同步（GitHub Gist）」模块替换回 `/api/sync` 调用
//      （见 git 历史 v4 提交：functions/api/sync.js 原实现 + 客户端 pushSync/pullSync）
//   3) 用 git 恢复本文件 v4 版本并与客户端配套启用
// ---------------------------------------------------------------------------

export async function onRequest(context) {
  return new Response(JSON.stringify({
    error: 'deprecated',
    message: '云端同步已迁移到 GitHub Gist 前端直连，本 EdgeOne Function 已停用。请勿再调用 /api/sync，请改用页面内「自动同步（GitHub Gist）」配置。'
  }), {
    status: 410,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
