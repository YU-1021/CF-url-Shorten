# CF-url-Shorten
这是一个基于 Cloudflare Workers 和 KV 存储的轻量级短链接生成器
## ✨ 功能特性

- **完全免费**：利用 Cloudflare 免费额度，每天支持 10 万次访问，完全无需服务器。
- **管理后台**：内置双栏管理界面，左侧生成，右侧管理。
- **安全锁**：通过环境变量 `PASSWORD` 开启全站访问锁定，保护你的生成器不被滥用。
- **自动补全**：智能识别 URL 协议，输入 `baidu.com` 自动补全为 `https://baidu.com`。
- **列表管理**：支持实时查看已生成的链接列表。
- **动态操作**：支持在后台直接 **删除** 链接或 **修改后缀**。
- **极速跳转**：利用 Cloudflare 全球边缘节点，实现毫秒级跳转。
[eg1](https://github.com/YU-1021/CF-url-Shorten/blob/main/img/eg1.png?raw=true)
[eg2](https://github.com/YU-1021/CF-url-Shorten/blob/main/img/eg2.png?raw=true)
## 🛠️ 快速部署

### 1. 创建 KV 命名空间
1. 登录 Cloudflare 控制台。
2. 进入 **Workers 和 Pages** -> **KV**。
3. 创建一个新的命名空间，名称随意（例如 `url_storage`）。

### 2. 创建 Worker
1. 创建一个新的 Worker 服务。
2. 将本仓库中的 `index.js` 代码全部粘贴到 Worker 编辑器中。

### 3. 绑定环境变量与 KV
1. 在 Worker 详情页，点击 **设置 (Settings)** -> **变量 (Variables)**。
2. **KV 命名空间绑定**：
   - 变量名称：`LINKS`
   - KV 命名空间：选择你刚才创建的空间。
3. **环境变量**：
   - 添加变量名：`PASSWORD`
   - 变量值：你的访问密码（设置后进入主页需输入此密码）。

### 4. 绑定自定义域名 (可选但强烈建议)
在 Worker 的 **触发器 (Triggers)** 页面添加自定义域（如 `s.yourdomain.com`），以获得更好的访问体验。

## 📖 使用指南

1. **登录**：访问你的域名，输入你设置的 `PASSWORD`。
2. **缩短**：在左侧输入长链接（支持直接粘贴域名，自动补全 https）。
3. **管理**：
   - **修改**：点击右侧列表的“修改”，可以重新定义短链接后缀。
   - **删除**：点击“删除”即可立即使该链接失效。

## ⚠️ 开发注意
- 本项目后端针对 KV 的 `list` 缓存进行了过滤。当你删除一个链接后，由于 Cloudflare KV 的全球同步延迟，该条目可能会在数据库中存在几秒，但后台列表会立即将其屏蔽。

## 🤝 鸣谢
本项目基于 [xyTom/Url-Shorten-Worker](https://github.com/xyTom/Url-Shorten-Worker) 进行二次开发，感谢原作者的开源贡献。

## 📄 开源协议
[MIT License](LICENSE)
