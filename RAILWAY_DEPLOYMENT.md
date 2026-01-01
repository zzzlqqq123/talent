# Railway 后端部署指南

## 🚀 为什么选择 Railway？

- ✅ **完全免费** - 每月 $5 额度（约 500 小时运行时间）
- ✅ **一键部署** - 自动从 GitHub 导入项目
- ✅ **内置 MongoDB** - 无需单独配置数据库
- ✅ **自动部署** - 推送代码后自动更新
- ✅ **可视化监控** - 查看日志、环境变量都很方便
- ✅ **自定义域名** - 支持 HTTPS

---

## 📋 部署步骤

### 第一步：注册 Railway 账号

1. 访问：https://railway.app
2. 点击 **"Start a New Project"** 或 **"Sign Up"**
3. 使用 **GitHub 账号**登录（推荐，因为代码在 GitHub）

### 第二步：导入项目

1. 登录后，点击 **"New Project"** 按钮
2. 选择 **"Deploy from GitHub repo"**
3. 在仓库列表中找到 `zzzlqqq123/talent`
4. 点击 **"Import"** 按钮

### 第三步：配置项目

Railway 会自动检测项目类型。选择手动配置：

**Root Directory（根目录）**: 选择 `backend`（因为后端代码在 backend 文件夹）

**Start Command（启动命令）**: 保持为 `npm start`（Railway 会自动从 package.json 读取）

### 第四步：添加 MongoDB 数据库

1. 在项目页面，点击 **"+ New Service"** 按钮
2. 选择 **"Database"**
3. 选择 **"MongoDB"**
4. Railway 会自动创建一个 MongoDB 实例

### 第五步：配置环境变量

1. 点击后端服务（Node.js 应用）
2. 选择 **"Variables"** 标签页
3. 添加以下环境变量：

```env
# 端口号（Railway 自动分配）
PORT=3000

# MongoDB 连接字符串（从 MongoDB 服务复制）
MONGODB_URI=mongodb://mongo:27017/railway

# JWT 密钥（生成一个随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this

# 环境变量
NODE_ENV=production
```

**重要：获取 MongoDB 连接字符串**
- 点击 MongoDB 服务
- 在 "Connection Details" 中找到连接字符串
- 复制并粘贴到后端服务的 `MONGODB_URI` 环境变量中

### 第六步：构建和部署

1. 保存环境变量后，Railway 会自动触发构建和部署
2. 等待几分钟，看到 **"Success"** 状态就说明部署成功
3. 点击生成的 URL（类似 `https://your-app.up.railway.app`）访问

### 第七步：导入测试数据（可选）

部署成功后，你需要导入测试题目：

1. 在 Railway 的后端服务页面，点击 **"Console"** 标签
2. 选择 **"New Console"**
3. 运行以下命令：

```bash
npm run import-questions
```

---

## 🔍 查看部署状态

### 检查部署日志

1. 进入后端服务页面
2. 点击 **"Deployments"** 标签
3. 点击最新的部署记录
4. 查看 **"Logs"** 了解部署详情

### 检查运行日志

1. 点击后端服务
2. 点击 **"Logs"** 标签
3. 实时查看应用运行日志

---

## 🌐 获取 API 地址

部署成功后，你会得到一个 API 地址：

```
https://your-app-name.up.railway.app
```

API 端点示例：

- `POST https://your-app-name.up.railway.app/api/auth/register`
- `POST https://your-app-name.up.railway.app/api/auth/login`
- `GET https://your-app-name.up.railway.app/api/questions`

---

## 🔗 连接前端和后端

更新 Vercel 前端项目的环境变量：

### 方法一：通过 Vercel 网站配置

1. 进入 Vercel 的前端项目
2. 点击 **"Settings"**
3. 选择 **"Environment Variables"**
4. 添加以下变量：

```env
VITE_API_BASE_URL=https://your-app-name.up.railway.app/api
```

5. 重新部署前端项目

### 方法二：本地测试

修改 `frontend/.env.production` 文件：

```env
VITE_API_BASE_URL=https://your-app-name.up.railway.app/api
```

---

## 📊 监控和维护

### 查看资源使用情况

1. 进入 Railway 项目页面
2. 点击 **"Metrics"** 标签
3. 查看 CPU、内存、磁盘使用情况

### 查看数据库

1. 点击 MongoDB 服务
2. 点击 **"Connect"**
3. 可以使用 MongoDB Compass 或其他客户端连接

### 备份数据库

Railway 会自动备份，但也可以手动导出：

```bash
# 在 Console 中运行
mongodump --uri="mongodb://mongo:27017/railway" --out=/tmp/backup
```

---

## 🛠️ 常见问题

### Q: 部署失败怎么办？

A:
1. 检查 **"Deployments"** 日志，查看具体错误
2. 常见原因：
   - 环境变量配置错误（特别是 MongoDB_URI）
   - 端口号冲突（确保使用 Railway 分配的端口）
   - 构建失败（检查 dependencies）

### Q: 数据库连接失败？

A:
1. 确认 MongoDB URI 格式正确
2. 检查数据库服务是否正常运行
3. 查看后端服务日志中的错误信息

### Q: 如何获取 API 地址？

A:
1. 进入后端服务页面
2. 找到 **"Domains"** 部分
3. 复制生成的 URL

### Q: 免费额度够用吗？

A:
- Railway 免费额度：$5/月
- 大约 500 小时运行时间
- 对于小型项目完全够用
- 如果超出，会自动暂停，可以在下月重新激活

### Q: 如何自定义域名？

A:
1. 进入项目设置
2. 点击 **"Domains"**
3. 添加你的自定义域名
4. 配置 DNS 记录

---

## 🔄 自动部署

配置完成后，每次你推送代码到 GitHub：

1. Railway 会自动检测新的提交
2. 自动触发构建和部署
3. 部署完成后自动更新应用

无需手动操作，非常方便！

---

## 📝 总结

部署到 Railway 的步骤：

1. ✅ 注册 Railway 账号（使用 GitHub）
2. ✅ 导入 `zzzlqqq123/talent` 仓库
3. ✅ 配置根目录为 `backend`
4. ✅ 添加 MongoDB 服务
5. ✅ 配置环境变量（MONGODB_URI、JWT_SECRET 等）
6. ✅ 等待自动构建和部署
7. ✅ 导入测试数据（可选）
8. ✅ 获取 API 地址并配置前端

---

## 🆘 获取帮助

如果遇到问题：

- [Railway 官方文档](https://docs.railway.app)
- [Railway 社区论坛](https://community.railway.app)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)

---

**部署完成后，记得将 API 地址配置到前端项目中！** 🚀

