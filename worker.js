const config = {
  no_ref: "off", // 是否隐藏来源页面
  cors: "on",    // 是否开启跨域
}

// --- 1. 登录页面 HTML ---
const loginHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>身份验证</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .login-card { background: white; padding: 2.5rem; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 90%; max-width: 360px; text-align: center; }
    h2 { color: #333; margin-bottom: 20px; font-size: 1.5rem; }
    input { width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 16px; transition: border 0.3s; }
    input:focus { border-color: #667eea; outline: none; }
    button { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.3s; }
    button:hover { background: #5a6fd6; }
    .icon { font-size: 3rem; margin-bottom: 10px; display: block; }
  </style>
</head>
<body>
  <div class="login-card">
    <span class="icon">🔒</span>
    <h2>请输入访问密码</h2>
    <input type="password" id="pw" placeholder="请输入 PASSWORD 变量中的密码">
    <button onclick="login()">进入系统</button>
  </div>
  <script>
    function login() {
      const pw = document.getElementById('pw').value;
      if (!pw) return alert("密码不能为空");
      // 设置 Cookie，有效期 1 天
      document.cookie = "access_token=" + pw + ";path=/;max-age=86400";
      location.reload();
    }
    document.getElementById('pw').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') login();
    });
  </script>
</body>
</html>`;

// --- 2. 主页面 (双栏管理布局) ---
const indexHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>短链管理系统</title>
  <style>
    :root { --primary: #4f46e5; --danger: #ef4444; --success: #10b981; --bg: #f3f4f6; }
    body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); margin: 0; padding: 20px; color: #1f2937; }
    .header { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto 20px; }
    h1 { font-size: 1.5rem; margin: 0; color: #111827; }
    .container { display: flex; gap: 20px; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; }
    .card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); flex: 1; min-width: 320px; height: fit-content; }
    h2 { margin-top: 0; font-size: 1.1rem; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #4b5563; }
    input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; box-sizing: border-box; margin-bottom: 15px; font-size: 14px; }
    button { width: 100%; padding: 11px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; font-size: 14px; transition: 0.2s; }
    
    .btn-create { background: var(--primary); color: white; }
    .btn-create:hover { background: #4338ca; }
    
    .manage-section { flex: 1.5; max-height: 85vh; overflow-y: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; background: #f9fafb; padding: 12px; font-size: 13px; color: #6b7280; }
    td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; word-break: break-all; }
    
    .action-btns { display: flex; gap: 8px; }
    .btn-sm { padding: 5px 10px; font-size: 12px; width: auto; font-weight: 500; }
    .btn-del { background: #fee2e2; color: var(--danger); }
    .btn-del:hover { background: #fecaca; }
    .btn-edit { background: #e0e7ff; color: var(--primary); }
    .btn-edit:hover { background: #c7d2fe; }
    
    #result { margin-top: 15px; padding: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; display: none; word-break: break-all; }
    .logout-btn { color: #ef4444; text-decoration: none; font-size: 14px; font-weight: 500; }
    
    @media (max-width: 768px) { .container { flex-direction: column; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 短链管理系统</h1>
    <a href="#" class="logout-btn" onclick="logout()">退出登录</a>
  </div>

  <div class="container">
    <div class="card">
      <h2>✨ 生成短链接</h2>
      <label>原始长链接</label>
      <input type="text" id="longUrl" placeholder="example.com (自动补全 https)">
      <label>自定义后缀 (可选)</label>
      <input type="text" id="customKey" placeholder="如果不填则随机生成">
      <button class="btn-create" onclick="createLink()">立即生成</button>
      <div id="result"></div>
    </div>

    <div class="card manage-section">
      <h2>列表管理</h2>
      <table>
        <thead>
          <tr>
            <th width="25%">后缀</th>
            <th width="50%">目标地址</th>
            <th width="25%">操作</th>
          </tr>
        </thead>
        <tbody id="linkList">
          <tr><td colspan="3">正在加载链接列表...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    window.onload = loadLinks;

    async function createLink() {
      const url = document.getElementById('longUrl').value;
      const key = document.getElementById('customKey').value;
      if(!url) return alert("请输入长链接");

      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, key })
      });
      const data = await res.json();
      if(data.status == 200) {
        const resDiv = document.getElementById('result');
        resDiv.style.display = 'block';
        const fullUrl = window.location.origin + data.short_url;
        resDiv.innerHTML = '<strong>生成成功:</strong><br><a href="' + fullUrl + '" target="_blank">' + fullUrl + '</a>';
        loadLinks(); 
      } else {
        alert("生成失败: " + data.error);
      }
    }

    async function loadLinks() {
      try {
        const res = await fetch('/api/list');
        const data = await res.json();
        const tbody = document.getElementById('linkList');
        tbody.innerHTML = '';
        
        if (data.links.length === 0) {
          tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">暂无数据</td></tr>';
          return;
        }

        data.links.forEach(link => {
          tbody.innerHTML += \`
            <tr>
              <td><strong>/\${link.key}</strong></td>
              <td title="\${link.value}">\${link.value.length > 50 ? link.value.substring(0,50)+'...' : link.value}</td>
              <td class="action-btns">
                <button class="btn-sm btn-edit" onclick="editLink('\${link.key}', '\${link.value}')">修改</button>
                <button class="btn-sm btn-del" onclick="deleteLink('\${link.key}')">删除</button>
              </td>
            </tr>\`;
        });
      } catch(e) {
        console.error("加载失败", e);
      }
    }

    async function deleteLink(key) {
      if(!confirm("确定删除后缀 /" + key + " 吗？")) return;
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      if(res.ok) loadLinks();
    }

    async function editLink(oldKey, value) {
      const newKey = prompt("请输入新的后缀名称:", oldKey);
      if(!newKey || newKey === oldKey) return;

      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldKey, newKey, value })
      });
      const data = await res.json();
      if(data.status === 200) loadLinks();
      else alert(data.error);
    }

    function logout() {
      document.cookie = "access_token=;path=/;max-age=0";
      location.reload();
    }
  </script>
</body>
</html>`;

// --- 3. 后端处理逻辑 ---
async function handleRequest(request) {
  const urlObj = new URL(request.url);
  const path = urlObj.pathname;
  
  // 鉴权逻辑
  const hasPasswordSet = (typeof PASSWORD !== 'undefined' && PASSWORD !== "");
  const cookies = request.headers.get("Cookie") || "";
  const isAuthed = cookies.includes(`access_token=${typeof PASSWORD !== 'undefined' ? PASSWORD : ''}`);

  // API: 创建
  if (path === "/api/create" && request.method === "POST") {
    if (hasPasswordSet && !isAuthed) return new Response(JSON.stringify({status:401}), {status:401});
    let req = await request.json();
    let longUrl = req.url.trim();
    if (!/^https?:\/\//i.test(longUrl)) longUrl = "https://" + longUrl; // 自动补齐 https

    let key = req.key ? req.key.trim() : Math.random().toString(36).substring(2, 8);
    if (await LINKS.get(key)) return new Response(JSON.stringify({ status: 400, error: "后缀已存在" }), { status: 400 });

    await LINKS.put(key, longUrl);
    return new Response(JSON.stringify({ status: 200, short_url: "/" + key }), { headers: {"content-type":"application/json"} });
  }

  // API: 列表 (核心修复：过滤 null)
  if (path === "/api/list") {
    if (hasPasswordSet && !isAuthed) return new Response("Unauthorized", {status:401});
    const list = await LINKS.list();
    let links = [];
    for (let key of list.keys) {
      if (key.name.length < 50) { // 过滤掉过长的混淆键
        const value = await LINKS.get(key.name);
        if (value !== null) { 
          links.push({ key: key.name, value: value });
        }
      }
    }
    return new Response(JSON.stringify({ links }), { headers: {"content-type":"application/json"} });
  }

  // API: 删除
  if (path === "/api/delete" && request.method === "POST") {
    if (hasPasswordSet && !isAuthed) return new Response("Unauthorized", {status:401});
    const req = await request.json();
    await LINKS.delete(req.key);
    return new Response(JSON.stringify({status:200}), { headers: {"content-type":"application/json"} });
  }

  // API: 修改
  if (path === "/api/update" && request.method === "POST") {
    if (hasPasswordSet && !isAuthed) return new Response("Unauthorized", {status:401});
    const req = await request.json();
    if(await LINKS.get(req.newKey)) return new Response(JSON.stringify({status:400, error:"新后缀已存在"}));
    await LINKS.put(req.newKey, req.value);
    await LINKS.delete(req.oldKey);
    return new Response(JSON.stringify({status:200}));
  }

  // 访问逻辑
  const shortKey = path.split("/")[1];
  if (!shortKey) {
    if (hasPasswordSet && !isAuthed) return new Response(loginHTML, { headers: {"content-type":"text/html;charset=UTF-8"} });
    return new Response(indexHTML, { headers: {"content-type":"text/html;charset=UTF-8"} });
  }

  const targetUrl = await LINKS.get(shortKey);
  if (targetUrl) {
    return Response.redirect(targetUrl, 302);
  } else {
    return new Response("<html><head><meta charset='UTF-8'></head><body><h2>404: 链接不存在或已过期</h2><a href='/'>返回首页</a></body></html>", { 
      status: 404, 
      headers: {"content-type":"text/html;charset=UTF-8"} 
    });
  }
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});
