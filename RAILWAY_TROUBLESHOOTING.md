# Railway 部署故障排除指南

## 🔧 常见构建错误和解决方案

### 问题 1: Build 失败 - 文件列表错误

**错误信息示例：**
```json
{
  "message": "├── test-api.js",
  "timestamp": "2026-01-01T16:48:04.647234269Z"
}
```

**原因：**
- Railway 在构建时扫描了根目录的所有文件
- `test-api.js` 等文件干扰了构建过程
- 构建配置不正确

**解决方案：**

#### 方案 1：使用正确的 Root Directory（推荐）

在 Railway 项目配置中：

1. 进入项目设置
2. 找到 **"Root Directory"** 选项
3. 设置为：`backend`
4. 保存并重新部署

**重要**：这是最关键的配置！Railway 需要知道后端代码在 `backend` 文件夹中。

#### 方案 2：检查 .railwayignore 配置

确保 `.railwayignore` 文件存在并包含以下内容：

```
# 忽略前端和其他文件
frontend/
talentdna---discover-your-inner-genius/
*.md
test-api.js
.claude/
```

#### 方案 3：更新 package.json

确保根目录有 `package.json` 文件，内容如下：

```json
{
  "name": "talent-test-root",
  "version": "1.0.0",
  "description": "个人天赋测试系统 - 根配置",
  "scripts": {
    "install-backend": "cd backend && npm install",
    "build-backend": "cd backend && npm run build",
    "install": "npm run install-backend",
    "build": "npm run build-backend"
  }
}
```

---

### 问题 2: MongoDB 连接失败

**错误信息示例：**
```
Error: connect ECONNREFUSED mongodb://mongo:27017/railway
```

**解决方案：**

1. 确认已创建 MongoDB 服务
2. 获取正确的 MongoDB 连接字符串：
   - 点击 MongoDB 服务
   - 在 **"Connection Details"** 中复制连接字符串
3. 在后端服务的 **Variables** 中设置：
   ```
   MONGODB_URI=mongodb://mongo:27017/railway
   ```

**重要提示：**
- 不要使用 `localhost`，使用 Railway 提供的内部地址
- 确保数据库服务已经启动

---

### 问题 3: TypeScript 编译错误

**错误信息示例：**
```
error TS2307: Cannot find module 'express'
```

**解决方案：**

1. 确认所有依赖都已安装：
   ```bash
   cd backend
   npm install
   ```

2. 检查 `package.json` 中的 dependencies 是否完整

3. 如果缺少类型定义，安装：
   ```bash
   npm install --save-dev @types/express @types/node
   ```

---

### 问题 4: 端口错误

**错误信息示例：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案：**

在 Railway 的环境变量中设置：

```env
PORT=3000
```

**重要：** Railway 会自动分配端口，但代码需要读取 `PORT` 环境变量。

确保代码中有：

```typescript
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

---

### 问题 5: JWT_SECRET 未设置

**错误信息示例：**
```
Error: JWT_SECRET is not defined
```

**解决方案：**

在后端服务的环境变量中添加：

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**安全提示：**
- 不要使用简单的密钥
- 使用至少 32 位的随机字符串
- 可以使用以下命令生成：
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## 📊 查看详细日志

### 在 Railway 网站查看日志

1. 进入项目页面
2. 点击 **"Deployments"** 标签
3. 点击失败的部署记录
4. 查看 **"Logs"** 部分

### 查看运行时日志

1. 点击后端服务
2. 点击 **"Logs"** 标签
3. 实时查看应用日志

### 使用 Console 检查

1. 点击后端服务
2. 点击 **"Console"** 标签
3. 点击 **"New Console"**
4. 可以执行命令检查：
   ```bash
   # 检查文件结构
   ls -la

   # 检查环境变量
   env | grep -E "MONGODB|JWT|PORT"

   # 测试 MongoDB 连接
   node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
   ```

---

## 🔍 完整的部署检查清单

### ✅ 部署前检查

- [ ] GitHub 仓库已更新最新代码
- [ ] `.railwayignore` 文件已创建
- [ ] 根目录 `package.json` 已创建
- [ ] 后端 `package.json` 配置正确
- [ ] `Procfile` 文件存在于 backend 目录

### ✅ Railway 配置检查

- [ ] Root Directory 设置为 `backend`
- [ ] Build Command 设置为 `npm run build`
- [ ] Start Command 设置为 `npm start`
- [ ] MongoDB 服务已创建
- [ ] 环境变量已配置：
  - [ ] PORT
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] NODE_ENV

### ✅ 部署后验证

- [ ] 部署状态为 "Success"
- [ ] 服务已启动
- [ ] 可以访问生成的 URL
- [ ] 测试 API 端点：
  - [ ] GET /api/questions
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login

---

## 🚀 手动触发重新部署

如果配置修改后需要重新部署：

### 方法 1：在 Railway 网站上

1. 进入项目页面
2. 点击 **"Deployments"** 标签
3. 点击右上角 **"..."** 菜单
4. 选择 **"Redeploy"**
5. 点击确认

### 方法 2：推送新代码到 GitHub

```bash
# 做一个小的修改
echo "# test" >> README.md

# 提交并推送
git add README.md
git commit -m "test: 触发重新部署"
git push
```

Railway 会自动检测并重新部署。

---

## 📞 获取帮助

如果以上方法都无法解决问题：

### 1. 查看官方文档

- [Railway 官方文档](https://docs.railway.app)
- [Node.js 部署指南](https://docs.railway.app/deploy/quickstart)

### 2. 搜索问题

- [Railway 社区论坛](https://community.railway.app)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)

### 3. 提供错误信息

在寻求帮助时，请提供：

1. 完整的错误日志
2. 环境变量配置（隐藏敏感信息）
3. 项目配置截图
4. 部署步骤描述

---

## 💡 最佳实践

### 1. 使用环境变量

所有配置都应通过环境变量设置，不要硬编码：

✅ **好的做法：**
```typescript
const mongoUri = process.env.MONGODB_URI
```

❌ **不好的做法：**
```typescript
const mongoUri = 'mongodb://localhost:27017/talent_test'
```

### 2. 健康检查端点

添加健康检查端点，方便监控：

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})
```

### 3. 日志记录

使用结构化日志，方便调试：

```typescript
logger.info('Server started', {
  port: process.env.PORT,
  env: process.env.NODE_ENV
})
```

### 4. 错误处理

正确的错误处理和响应：

```typescript
try {
  // 业务逻辑
} catch (error) {
  logger.error('Operation failed', { error })
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}
```

---

**希望这些信息能帮助你解决 Railway 部署问题！** 🚀

