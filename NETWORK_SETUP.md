# 网络配置指南 / Network Setup Guide

## 🚨 问题诊断 / Problem Diagnosis

你的YouTube API密钥 **有效且正确配置** ✅

但是，Node.js 应用程序无法连接到 Google API 服务器。

**症状：**
- PowerShell 的 `curl` 和 `Invoke-WebRequest` 可以访问 YouTube API ✅
- Node.js 的 `fetch`、`axios`、`googleapis` 库超时 ❌
- 错误信息：`ETIMEDOUT` 或 `fetch failed`

**原因：**
这是网络限制问题，Node.js 无法直接访问 googleapis.com

---

## 🔧 解决方案 / Solutions

### 方案 1：使用 VPN（推荐）⭐

**最简单的解决方案：**

1. 安装并启动 VPN 客户端
2. 确保 VPN 已连接
3. 重启开发服务器：
   ```bash
   npm run dev
   ```

**推荐的 VPN 服务：**
- ExpressVPN
- NordVPN
- Shadowsocks
- V2Ray
- 任何可以访问 Google 服务的 VPN

---

### 方案 2：配置 HTTP 代理

如果你有 HTTP/HTTPS 代理服务器：

#### 2.1 在 `.env.local` 中添加代理配置

```env
# YouTube API
YOUTUBE_API_KEY=AIzaSyCMVzF3RS-b_-8MOorZkd1-5FnwiwKM_ro
CACHE_TTL=3600

# 代理配置 (如果需要)
HTTP_PROXY=http://your-proxy-server:port
HTTPS_PROXY=http://your-proxy-server:port
```

#### 2.2 或使用系统环境变量

**PowerShell：**
```powershell
$env:HTTP_PROXY="http://your-proxy-server:port"
$env:HTTPS_PROXY="http://your-proxy-server:port"
npm run dev
```

**CMD：**
```cmd
set HTTP_PROXY=http://your-proxy-server:port
set HTTPS_PROXY=http://your-proxy-server:port
npm run dev
```

---

### 方案 3：使用全局代理工具

使用系统级代理工具，让所有应用程序都通过代理访问网络：

**Windows 工具：**
- **Clash for Windows** （推荐）
- **V2RayN**
- **Shadowsocks-Windows**
- **Proxifier**

**配置步骤：**
1. 安装并配置代理工具
2. 启用"系统代理"或"全局模式"
3. 确保代理工具规则包含 googleapis.com
4. 重启 Node.js 开发服务器

---

### 方案 4：修改代码使用自定义 Agent

修改 `lib/youtube.ts`，使用支持代理的 HTTP agent：

```typescript
import { google } from 'googleapis';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 创建代理 agent（如果配置了代理）
const agent = process.env.HTTPS_PROXY 
  ? new HttpsProxyAgent(process.env.HTTPS_PROXY)
  : undefined;

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
  // 添加自定义 transport
  ...(agent && {
    transporterOptions: {
      agent
    }
  })
});
```

然后安装依赖：
```bash
npm install https-proxy-agent
```

---

## ✅ 验证连接

使用以下命令测试连接是否正常：

### 测试 1：使用 PowerShell（已验证可以工作）
```powershell
Invoke-RestMethod -Uri "https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&type=video&maxResults=1&key=AIzaSyCMVzF3RS-b_-8MOorZkd1-5FnwiwKM_ro"
```
✅ 这个可以工作！

### 测试 2：使用 Node.js
```bash
node test-axios-api.js
```
❌ 当前无法工作（需要 VPN 或代理）

---

## 📝 当前状态总结

| 项目 | 状态 | 说明 |
|------|------|------|
| API 密钥 | ✅ 有效 | `AIzaSyCMVzF3RS-b_-8MOorZkd1-5FnwiwKM_ro` |
| YouTube Data API v3 | ✅ 已启用 | PowerShell 测试通过 |
| `.env.local` 配置 | ✅ 正确 | 环境变量已设置 |
| 依赖安装 | ✅ 完成 | 所有 npm 包已安装 |
| Node.js 网络连接 | ❌ 受限 | 无法访问 googleapis.com |
| 开发服务器 | ⚠️ 已启动 | 但 API 调用会失败 |

---

## 🎯 推荐操作步骤

### 选项 A：使用 VPN（最简单）

1. **启动 VPN 并连接**
2. **停止当前服务器**（如果在运行）
3. **重启开发服务器：**
   ```bash
   npm run dev
   ```
4. **打开浏览器：**
   ```
   http://localhost:3000
   ```
5. **测试搜索功能**

### 选项 B：使用代理

1. **配置代理工具**（Clash、V2Ray 等）
2. **启用系统代理模式**
3. **重启开发服务器**
4. **测试应用**

---

## 🔍 故障排查

### 如果 VPN 连接后仍然失败：

```bash
# 1. 清除 Node.js DNS 缓存
Get-Process -Name node | Stop-Process -Force

# 2. 测试连接
node test-axios-api.js

# 3. 如果成功，重启服务器
npm run dev
```

### 检查代理是否生效：

```bash
# 检查环境变量
echo $env:HTTP_PROXY
echo $env:HTTPS_PROXY

# 测试代理连接
curl -x $env:HTTP_PROXY https://www.google.com
```

---

## 📞 需要帮助？

### 常见问题：

**Q: 为什么 PowerShell curl 可以工作但 Node.js 不行？**
A: PowerShell 可能使用了系统代理或不同的网络栈，而 Node.js 需要显式配置代理。

**Q: 我需要一直开着 VPN 吗？**
A: 是的，在开发和运行时都需要 VPN 来访问 Google API。

**Q: 可以使用其他 API 代替吗？**
A: YouTube Data API 是官方唯一推荐的方式。其他方法（如爬虫）违反服务条款。

**Q: 部署到服务器后怎么办？**
A: 确保部署的服务器可以访问 googleapis.com（海外服务器通常没问题）。

---

## 🌐 海外部署建议

如果你计划部署到生产环境：

**推荐平台（自带国际网络）：**
- ✅ Vercel（推荐）
- ✅ Netlify
- ✅ AWS (US/EU regions)
- ✅ Google Cloud Platform
- ✅ Azure (Global)
- ✅ DigitalOcean (海外服务器)

这些平台都可以直接访问 Google API，无需额外配置。

---

## ✨ 总结

**你的 API 配置完全正确！** 🎉

只是因为网络限制，需要：
1. 使用 VPN 或代理
2. 或者部署到海外服务器

一旦解决网络问题，应用就可以正常工作了！





