# 部署文档

## 目录

1. [系统要求](#系统要求)
2. [环境准备](#环境准备)
3. [后端部署](#后端部署)
4. [前端部署](#前端部署)
5. [数据库配置](#数据库配置)
6. [生产环境配置](#生产环境配置)
7. [常见问题](#常见问题)

## 系统要求

### 硬件要求

**最低配置**:
- CPU: 2核
- 内存: 4GB
- 磁盘: 20GB SSD

**推荐配置**:
- CPU: 4核
- 内存: 8GB
- 磁盘: 50GB SSD

### 软件要求

- **操作系统**: Linux (Ubuntu 20.04+), macOS, Windows 10/11
- **Node.js**: v16.0.0 或更高版本
- **MongoDB**: v5.0 或更高版本
- **npm**: v7.0.0 或更高版本 (或使用 pnpm/yarn)

## 环境准备

### 1. 安装 Node.js

#### Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### macOS
```bash
brew install node@18
```

#### Windows
下载并安装: https://nodejs.org/

### 2. 安装 MongoDB

#### Ubuntu/Debian
```bash
# 导入公钥
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加MongoDB仓库
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 安装
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动服务
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

#### Windows
下载并安装: https://www.mongodb.com/try/download/community

### 3. 验证安装

```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version

# 检查MongoDB状态
mongosh --eval "db.version()"
```

## 后端部署

### 1. 克隆项目

```bash
git clone <repository-url>
cd talent-test-system
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

创建 `.env` 文件:

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量:

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/talent_test

# JWT配置
JWT_SECRET=your-very-secure-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=info
LOG_DIR=./logs

# 跨域配置
CORS_ORIGIN=https://your-frontend-domain.com
```

**安全提示**: 
- 生产环境务必更改 `JWT_SECRET` 为强随机字符串
- 不要将 `.env` 文件提交到版本控制

### 4. 初始化数据库

导入测试题目:

```bash
npm run import-questions
```

### 5. 构建项目

```bash
npm run build
```

### 6. 启动服务

#### 开发模式
```bash
npm run dev
```

#### 生产模式
```bash
npm start
```

#### 使用 PM2 (推荐)

安装 PM2:
```bash
npm install -g pm2
```

启动服务:
```bash
pm2 start dist/server.js --name talent-test-backend
pm2 save
pm2 startup
```

常用命令:
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs talent-test-backend

# 重启服务
pm2 restart talent-test-backend

# 停止服务
pm2 stop talent-test-backend
```

## 前端部署

### 1. 安装前端依赖

```bash
cd ../frontend
npm install
```

### 2. 配置环境变量

创建 `.env.production` 文件:

```env
# API地址
VITE_API_BASE_URL=https://api.your-domain.com/api
```

### 3. 构建前端

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 4. 部署静态文件

#### 方式1: 使用 Nginx

安装 Nginx:
```bash
sudo apt-get install nginx
```

配置 Nginx (`/etc/nginx/sites-available/talent-test`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/talent-test/dist;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 处理前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理API请求到后端
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点:
```bash
sudo ln -s /etc/nginx/sites-available/talent-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 方式2: 使用 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

#### 方式3: 使用 Netlify

1. 登录 Netlify
2. 拖拽 `dist` 文件夹到网站
3. 配置重定向规则 (`netlify.toml`):

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 数据库配置

### 1. 创建数据库用户

```bash
mongosh
```

```javascript
use admin
db.createUser({
  user: "talent_test_admin",
  pwd: "secure-password-here",
  roles: [
    { role: "readWrite", db: "talent_test" }
  ]
})
```

### 2. 启用认证

编辑 MongoDB 配置 (`/etc/mongod.conf`):

```yaml
security:
  authorization: enabled
```

重启 MongoDB:
```bash
sudo systemctl restart mongod
```

### 3. 更新连接字符串

```env
MONGODB_URI=mongodb://talent_test_admin:secure-password-here@localhost:27017/talent_test?authSource=admin
```

### 4. 创建索引

连接数据库后执行:

```javascript
use talent_test

// 用户表索引
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// 测试结果索引
db.results.createIndex({ userId: 1, createdAt: -1 })
db.results.createIndex({ userId: 1, status: 1 })

// 报告索引
db.reports.createIndex({ userId: 1, createdAt: -1 })
db.reports.createIndex({ userId: 1, "summary.totalScore": -1 })

// 题目索引
db.questions.createIndex({ category: 1, order: 1 })
```

## 生产环境配置

### 1. HTTPS 配置

使用 Let's Encrypt 免费证书:

```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 2. 防火墙配置

```bash
# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 允许 MongoDB (仅本地)
sudo ufw allow from 127.0.0.1 to any port 27017

# 启用防火墙
sudo ufw enable
```

### 3. 环境变量安全

生产环境不要使用 `.env` 文件，使用系统环境变量:

```bash
# 编辑 PM2 ecosystem 文件
pm2 ecosystem
```

```javascript
module.exports = {
  apps: [{
    name: 'talent-test-backend',
    script: './dist/server.js',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGODB_URI: process.env.MONGODB_URI,
      JWT_SECRET: process.env.JWT_SECRET
    }
  }]
}
```

### 4. 监控和日志

#### 使用 PM2 监控

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

#### 日志管理

后端日志位置: `backend/logs/`

定期清理:
```bash
# 添加到 crontab
0 2 * * * find /path/to/backend/logs -name "*.log" -mtime +30 -delete
```

### 5. 备份策略

#### 数据库备份

创建备份脚本 (`backup.sh`):

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --uri="mongodb://talent_test_admin:password@localhost:27017/talent_test" --out="$BACKUP_DIR/backup_$DATE"

# 保留最近30天的备份
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} +
```

添加到 crontab:
```bash
0 3 * * * /path/to/backup.sh
```

## 常见问题

### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 2. MongoDB 连接失败

检查服务状态:
```bash
sudo systemctl status mongod
```

查看日志:
```bash
sudo tail -f /var/log/mongodb/mongod.log
```

### 3. 权限问题

确保日志目录有写入权限:
```bash
sudo chown -R $USER:$USER backend/logs
chmod -R 755 backend/logs
```

### 4. 内存不足

调整 Node.js 内存限制:
```bash
node --max-old-space-size=4096 dist/server.js
```

或在 PM2 中:
```javascript
{
  "node_args": "--max-old-space-size=4096"
}
```

### 5. 构建失败

清除缓存重新安装:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 性能优化

### 1. 数据库优化

- 定期分析慢查询
- 合理使用索引
- 实施数据归档策略

### 2. 缓存策略

- Redis 缓存热点数据
- CDN 加速静态资源
- API 响应缓存

### 3. 负载均衡

使用 Nginx 或 HAProxy 实现多实例负载均衡。

## 健康检查

### API 健康检查

```bash
curl http://localhost:3000/api/health
```

预期响应:
```json
{
  "status": "ok",
  "timestamp": "2025-12-31T12:00:00.000Z",
  "uptime": 3600
}
```

### 自动重启

PM2 会在进程崩溃时自动重启，也可以配置健康检查:

```javascript
{
  "max_memory_restart": "1G",
  "error_file": "./logs/error.log",
  "out_file": "./logs/out.log"
}
```

## 回滚策略

### 代码回滚

```bash
# 使用 Git 回滚
git checkout <previous-commit>
npm run build
pm2 restart talent-test-backend
```

### 数据库回滚

```bash
# 恢复备份
mongorestore --uri="mongodb://talent_test_admin:password@localhost:27017/talent_test" /var/backups/mongodb/backup_20231231_030000
```

## 联系支持

如有部署问题，请联系:
- Email: support@talent-test.com
- GitHub Issues: <repository-url>/issues

---

**最后更新**: 2025-12-31  
**文档版本**: 1.0
