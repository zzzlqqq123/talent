# MongoDB 安装指南 (Windows)

## 方式1：手动安装（推荐，最简单）

### 步骤1：下载MongoDB

1. 访问MongoDB官网下载页面：
   https://www.mongodb.com/try/download/community

2. 选择以下选项：
   - Version: 6.0.16 或更高版本
   - OS: Windows
   - Package: msi

3. 点击"Download"下载安装包（约300MB）

### 步骤2：安装MongoDB

1. 双击下载的 `.msi` 安装文件

2. 在安装向导中选择：
   - ✅ 选择"Complete"完整安装
   - ✅ 勾选"Install MongoDB as a Service"（作为Windows服务安装）
   - ✅ 勾选"Install MongoDB Compass"（图形化管理工具）
   - ✅ 数据目录：默认 `C:\Program Files\MongoDB\Server\6.0\data`
   - ✅ 日志目录：默认 `C:\Program Files\MongoDB\Server\6.0\log`

3. 点击"Install"开始安装

4. 安装完成后，MongoDB服务会自动启动

### 步骤3：验证安装

打开新的命令提示符（CMD）或PowerShell，运行：

```bash
mongod --version
```

如果显示版本信息，说明安装成功！

### 步骤4：检查服务状态

```bash
# 检查MongoDB服务状态
sc query MongoDB

# 如果未启动，手动启动
net start MongoDB
```

---

## 方式2：使用Chocolatey安装（需要先安装Chocolatey）

### 步骤1：安装Chocolatey（以管理员身份运行PowerShell）

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 步骤2：使用Chocolatey安装MongoDB

```bash
choco install mongodb -y
```

---

## 方式3：使用Docker（需要安装Docker Desktop）

```bash
docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:6.0
```

如果使用Docker，需要修改后端连接字符串为：
```
mongodb://admin:password@localhost:27017/talent_test?authSource=admin
```

---

## 安装完成后的配置

### 1. 创建后端环境配置文件

在 `backend` 目录下创建 `.env` 文件：

```bash
cd backend
cp .env.example .env
```

### 2. 编辑 `.env` 文件

确保MongoDB连接字符串正确：

```env
MONGODB_URI=mongodb://localhost:27017/talent_test
```

---

## 验证MongoDB运行

### 方法1：检查端口
```bash
netstat -ano | findstr :27017
```

### 方法2：使用MongoDB Shell
```bash
mongosh
# 或者旧版本
mongo
```

### 方法3：使用MongoDB Compass
打开MongoDB Compass，连接到：`mongodb://localhost:27017`

---

## 常见问题

### Q1: 安装后服务无法启动？
```bash
# 手动启动
net start MongoDB

# 如果失败，查看日志
type "C:\Program Files\MongoDB\Server\6.0\log\mongod.log"
```

### Q2: 端口27017被占用？
```bash
# 查找占用进程
netstat -ano | findstr :27017

# 结束进程
taskkill /PID <进程ID> /F
```

### Q3: 如何卸载MongoDB？
1. 停止服务：`net stop MongoDB`
2. 控制面板 → 程序和功能 → MongoDB → 卸载
3. 删除数据目录（可选）

---

## 下一步

安装完成后，运行以下命令启动项目：

```bash
# 终端1 - 启动后端
cd backend
npm run dev

# 终端2 - 启动前端
cd frontend
npm run dev
```

然后在浏览器访问：http://localhost:5173
