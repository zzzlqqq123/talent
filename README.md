# 个人天赋测试系统

基于心理学和行为学的个人天赋测试Web应用，帮助用户全面了解自己的天赋优势。

## 项目简介

本系统提供科学、专业的天赋能力评估，通过数据可视化直观展示用户天赋分布，记录用户成长轨迹。

### 核心功能

- 🔐 用户认证系统（注册、登录、个人中心）
- 📝 四大维度天赋测试问卷（65题）
- 📊 智能评分算法和报告生成
- 📈 数据可视化（雷达图、趋势图）
- 📋 历史记录与对比分析
- 🔗 报告分享功能

### 测试维度

1. **认知能力** - 逻辑思维、记忆力、注意力、学习能力
2. **创造力** - 想象力、创新思维、艺术感知
3. **情感智能** - 同理心、情绪管理、人际交往
4. **实践能力** - 执行力、领导力、适应力

## 技术栈

### 前端
- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router 4
- Pinia (状态管理)
- Element Plus (UI组件库)
- ECharts (图表库)
- Axios (HTTP客户端)

### 后端
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT (身份认证)
- Winston (日志管理)

## 项目结构

```
talent-test/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API接口
│   │   ├── assets/          # 静态资源
│   │   ├── components/      # 公共组件
│   │   ├── views/           # 页面组件
│   │   ├── router/          # 路由配置
│   │   ├── store/           # 状态管理
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # 后端项目
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── services/        # 业务逻辑
│   │   ├── models/          # 数据模型
│   │   ├── middlewares/     # 中间件
│   │   ├── routes/          # 路由定义
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # 项目文档
│   ├── PRD.md               # 产品需求文档
│   ├── TECH_DESIGN.md       # 技术架构设计
│   ├── DATABASE.md          # 数据库设计
│   ├── API.md               # API接口文档
│   └── FRONTEND_DESIGN.md   # 前端设计文档
│
└── README.md
```

## 快速开始

### 前置要求

- Node.js 18.x+
- MongoDB 6.x+
- npm 或 yarn

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 配置环境变量

```bash
# 后端配置
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

### 启动数据库

确保MongoDB服务正在运行：

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 启动开发服务器

```bash
# 启动后端服务 (终端1)
cd backend
npm run dev

# 启动前端服务 (终端2)
cd frontend
npm run dev
```

访问 http://localhost:5173 查看应用

## 开发指南

### 前端开发

```bash
cd frontend

# 开发模式（热更新）
npm run dev

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 后端开发

```bash
cd backend

# 开发模式（自动重启）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start

# 导入测试数据
npm run import-questions

# 查看日志
tail -f logs/combined.log
```

### 代码规范

本项目使用 TypeScript 和 ESLint 确保代码质量。

- 遵循 Vue 3 Composition API 最佳实践
- 使用 TypeScript 类型定义
- 编写清晰的注释
- 保持函数简洁（单一职责）

### 提交规范

使用语义化提交信息：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式化
- `refactor:` 代码重构
- `test:` 添加测试
- `chore:` 构建/工具更新

示例：`feat: 添加报告对比功能`

## 测试

### 运行测试

```bash
# 运行API测试
node test-api.js

# 前端单元测试（如果配置）
cd frontend
npm run test

# 后端单元测试（如果配置）
cd backend
npm run test
```

### 测试清单

详细的测试清单请查看 [TESTING.md](./TESTING.md)

包括：
- ✅ 功能测试（注册、登录、答题、报告等）
- ✅ 边界测试（输入验证、异常处理）
- ✅ 兼容性测试（浏览器、设备、响应式）
- ✅ 性能测试（加载速度、运行性能）

## API文档

详细的API文档请查看 [API.md](./API.md)

### 主要接口

#### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录  
- `GET /api/auth/me` - 获取当前用户信息

#### 测试相关
- `GET /api/questions` - 获取题目列表
- `POST /api/test/start` - 开始测试
- `POST /api/test/answer` - 保存答案
- `POST /api/test/complete` - 完成测试

#### 报告相关
- `GET /api/report/:reportId` - 获取报告详情
- `GET /api/report/list` - 获取报告列表
- `POST /api/report/compare` - 对比多个报告
- `DELETE /api/report/:reportId` - 删除报告

#### 用户相关
- `GET /api/user/profile` - 获取用户资料
- `PUT /api/user/profile` - 更新用户资料
- `PUT /api/user/password` - 修改密码

## 数据库设计

详细的数据库设计请查看 [DATABASE.md](./DATABASE.md)

### 核心数据集合

- `users` - 用户信息（认证、个人资料）
- `questions` - 测试题目（65道题，四大维度）
- `results` - 答题记录（用户答案、测试进度）
- `reports` - 测试报告（评分、分析、建议）

### 索引策略

```javascript
// 用户邮箱唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 报告查询索引
db.reports.createIndex({ userId: 1, createdAt: -1 })

// 测试结果索引
db.results.createIndex({ userId: 1, status: 1 })
```

## 部署

详细的部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署

#### 使用 Docker (推荐)

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 手动部署

```bash
# 1. 构建前端
cd frontend
npm install
npm run build

# 2. 构建后端
cd ../backend
npm install
npm run build

# 3. 启动服务
pm2 start ecosystem.config.js --env production
```

### 环境要求

- **最低配置**: 2核CPU, 4GB内存, 20GB磁盘
- **推荐配置**: 4核CPU, 8GB内存, 50GB SSD
- **软件依赖**: Node.js 16+, MongoDB 5+

### 监控和维护

```bash
# 查看PM2状态
pm2 status

# 查看日志
pm2 logs

# 重启服务
pm2 restart all

# 数据库备份
mongodump --uri="mongodb://localhost:27017/talent_test" --out=/backup
```

## 功能特性

### ✨ 已完成功能

- ✅ 用户认证系统（注册、登录、JWT认证）
- ✅ 个人中心（资料管理、统计数据）
- ✅ 账户设置（修改密码、隐私设置）
- ✅ 65道标准化测试题目
- ✅ 答题流程（进度保存、自动保存）
- ✅ 智能评分算法
- ✅ 报告生成（四大维度分析）
- ✅ 数据可视化（雷达图、柱状图、趋势图）
- ✅ 历史记录管理
- ✅ 多报告对比分析
- ✅ 响应式设计（适配移动端）
- ✅ 性能优化（代码分割、缓存、懒加载）

### 🎯 核心亮点

1. **科学评估**: 基于心理学理论的四维度评估体系
2. **可视化报告**: ECharts 图表直观展示天赋分布
3. **成长追踪**: 历史数据对比，追踪能力变化
4. **用户友好**: 流畅的交互体验，清晰的引导流程
5. **高性能**: 前端优化、API缓存、数据库索引
6. **安全可靠**: JWT认证、数据加密、输入验证

## 性能指标

- ⚡ 首页加载时间: < 2秒
- ⚡ 答题页响应时间: < 100ms
- ⚡ 报告生成时间: < 3秒
- 📱 移动端完美适配
- 🌐 支持主流浏览器 (Chrome, Firefox, Safari, Edge)

## 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 报告问题

如果您发现bug或有功能建议，请：

1. 检查是否已有相关 Issue
2. 创建新 Issue，详细描述问题
3. 提供复现步骤和环境信息

## 常见问题

### Q: 如何重置密码？
A: 目前需要联系管理员。后续版本将添加邮箱重置功能。

### Q: 测试结果准确吗？
A: 测试基于标准化问卷设计，结果具有参考价值，但不应作为唯一判断依据。

### Q: 可以删除历史记录吗？
A: 可以，在历史记录页面选择要删除的报告，或在设置中清空所有记录。

### Q: 支持哪些浏览器？
A: 支持 Chrome、Firefox、Safari、Edge 的最新版本。建议使用 Chrome 以获得最佳体验。

### Q: 数据安全吗？
A: 所有敏感数据经过加密存储，仅您本人可以访问测试结果。

## 技术文档

- 📄 [产品需求文档 (PRD)](./PRD.md)
- 📐 [技术架构设计](./TECH_DESIGN.md)
- 🗄️ [数据库设计](./DATABASE.md)
- 🔌 [API接口文档](./API.md)
- 🎨 [前端设计文档](./FRONTEND_DESIGN.md)
- ✅ [测试文档](./TESTING.md)
- 🚀 [部署文档](./DEPLOYMENT.md)

## 致谢

感谢所有为这个项目做出贡献的开发者！

### 技术栈

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的超集
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [ECharts](https://echarts.apache.org/) - 可视化图表库
- [Express](https://expressjs.com/) - Node.js Web框架
- [MongoDB](https://www.mongodb.com/) - NoSQL数据库

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 📧 Email: support@talent-test.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 讨论: [GitHub Discussions](https://github.com/your-repo/discussions)

---

<div align="center">

**开发状态**: ✅ 主要功能已完成

**最后更新**: 2025-12-31

**版本**: v1.0.0

Made with ❤️ by Development Team

</div>
