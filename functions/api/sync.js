// EdgeOne Pages Function — 每日任务工作台 同步后端
// 路由：/api/sync  （GET 拉取 / POST 推送）
// 绑定：在 EdgeOne Pages 项目绑定一个 KV 命名空间，变量名填写 TASK_SYNC
// 数据模型：KV[ saneKey(syncKey) ] = { rev:number, tasks:[...], aicfg:{...} }
// 合并策略：按任务 id 取 updatedAt 较大者（含 _del 墓碑，支持删除传播）

function saneKey(k) {
  return 'dt_' + String(k || '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 64);
}

function json(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: Object.assign({
      'content-type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'content-type'
    }, extra || {})
  });
}

export async function onRequest(context) {
  const kv = context.env && context.env.TASK_SYNC ? context.env.TASK_SYNC : (typeof globalThis !== 'undefined' ? globalThis.TASK_SYNC : null);
  const req = context.request;
  const method = req.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'content-type'
    }});
  }

  if (!kv) {
    return json({ error: 'KV 未绑定：请在 EdgeOne Pages 项目绑定变量名为 TASK_SYNC 的 KV 命名空间' }, 500);
  }

  const url = new URL(req.url);
  const key = saneKey(url.searchParams.get('key') || (req.method === 'POST' ? null : null));

  if (method === 'GET') {
    if (!key || key === 'dt_') return json({ error: 'missing key' }, 400);
    let data;
    try {
      const raw = await kv.get(key);
      data = raw ? JSON.parse(raw) : { rev: 0, tasks: [], aicfg: null };
    } catch (e) {
      data = { rev: 0, tasks: [], aicfg: null };
    }
    if (typeof data.rev !== 'number') data.rev = 0;
    if (!Array.isArray(data.tasks)) data.tasks = [];
    return json(data, 200);
  }

  if (method === 'POST') {
    let body;
    try { body = await req.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
    const pkey = saneKey(body.key);
    if (!pkey || pkey === 'dt_') return json({ error: 'missing key' }, 400);

    let server;
    try {
      const raw = await kv.get(pkey);
      server = raw ? JSON.parse(raw) : { rev: 0, tasks: [], aicfg: null };
    } catch (e) {
      server = { rev: 0, tasks: [], aicfg: null };
    }
    if (typeof server.rev !== 'number') server.rev = 0;
    if (!Array.isArray(server.tasks)) server.tasks = [];

    const incoming = Array.isArray(body.tasks) ? body.tasks : [];
    const incomingRev = typeof body.rev === 'number' ? body.rev : 0;

    // 仅在 incoming 更新时合并写入；否则保留 server（客户端随后会拉取最新）
    if (incomingRev >= server.rev) {
      const map = {};
      server.tasks.forEach(function (t) { if (t && t.id) map[t.id] = t; });
      incoming.forEach(function (t) {
        if (!t || !t.id) return;
        const e = map[t.id];
        if (!e || (t.updatedAt || 0) >= (e.updatedAt || 0)) map[t.id] = t;
      });
      const tasks = Object.keys(map).map(function (k) { return map[k]; });
      const rev = Math.max(server.rev, incomingRev, Date.now());
      const aicfg = body.aicfg !== undefined ? body.aicfg : server.aicfg;
      const store = { rev: rev, tasks: tasks, aicfg: aicfg };
      try { await kv.put(pkey, JSON.stringify(store)); } catch (e) { return json({ error: 'kv put failed' }, 500); }
      return json(store, 200);
    }

    return json(server, 200);
  }

  return new Response('Method Not Allowed', { status: 405, headers: { 'Access-Control-Allow-Origin': '*' } });
}
