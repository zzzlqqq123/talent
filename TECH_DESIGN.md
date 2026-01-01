# 个人天赋测试系统 - 技术架构设计文档

## 1. 技术栈选型

### 1.1 前端技术栈
```
核心框架：
- Vue 3.x (Composition API)
- Vue Router 4.x (路由管理)
- Pinia 2.x (状态管理)

UI框架：
- Element Plus (UI组件库)
- Tailwind CSS (实用工具CSS框架)

图表库：
- ECharts 5.x (数据可视化)

构建工具：
- Vite 5.x (构建工具)

HTTP客户端：
- Axios (HTTP请求)

工具库：
- Day.js (日期处理)
- Lodash-es (工具函数)
```

**选型理由**：
- Vue 3：性能优秀，开发效率高，生态完善
- Element Plus：组件丰富，文档完善，适合快速开发
- ECharts：功能强大的图表库，支持复杂可视化需求
- Vite：构建速度快，开发体验好

---

### 1.2 后端技术栈
```
核心框架：
- Node.js 18.x+
- Express 4.x (Web框架)
- TypeScript (类型安全)

数据库：
- MongoDB 6.x (NoSQL数据库)
- Mongoose 8.x (ODM框架)

身份认证：
-jsonwebtoken (JWT生成)
-bcrypt (密码加密)

其他工具：
- dotenv (环境变量)
- cors (跨域处理)
- helmet (安全头)
- express-validator (请求验证)
- winston (日志记录)
```

**选型理由**：
- Node.js + Express：轻量高效，适合快速开发
- MongoDB：灵活的文档存储，适合存储问卷数据
- JWT：无状态认证，易于扩展
- TypeScript：类型安全，减少运行时错误

---

### 1.3 部署与运维
```
服务器：
- 阿里云/腾讯云 ECS

容器化：
- Docker
- Docker Compose

Web服务器：
- Nginx (反向代理 + 静态资源服务)

进程管理：
- PM2 (Node.js进程管理)

数据库部署：
- MongoDB 云数据库 / 自建

监控：
- 日志监控
- 性能监控
```

---

## 2. 系统架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                        用户端                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   PC端   │  │  移动端   │  │  平板端   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼────────────┼─────────────┼────────────────────┘
        │            │              │
        └────────────┼──────────────┘
                     │ HTTPS
        ┌────────────▼──────────────┐
        │       Nginx 反向代理       │
        │    (SSL + 负载均衡)        │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │                          │
┌───────▼────────┐    ┌──────────▼──────────┐
│  前端静态资源   │    │   后端API服务       │
│  (Vue SPA)     │    │  (Express + TS)     │
│                │    │                     │
│  /dist         │    │  /api/auth          │
│                │    │  /api/test          │
│                │    │  /api/user          │
│                │    │  /api/report        │
└────────────────┘    └──────────┬──────────┘
                                 │
                    ┌────────────▼──────────┐
                    │   MongoDB 数据库      │
                    │                      │
                    │  - users 集合         │
                    │  - questions 集合     │
                    │  - results 集合       │
                    │  - reports 集合       │
                    └───────────────────────┘
```

---

### 2.2 前端架构设计

#### 2.2.1 目录结构
```
talent-test-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/              # 静态资源
│   │   ├── images/
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── variables.css
│   │   └── icons/
│   ├── components/          # 公共组件
│   │   ├── common/
│   │   │   ├── Header.vue
│   │   │   ├── Footer.vue
│   │   │   └── Loading.vue
│   │   ├── charts/
│   │   │   ├── RadarChart.vue
│   │   │   ├── TrendChart.vue
│   │   │   └── BarChart.vue
│   │   └── test/
│   │       ├── QuestionCard.vue
│   │       ├── ProgressBar.vue
│   │       └── AnswerOption.vue
│   ├── views/              # 页面组件
│   │   ├── Home.vue
│   │   ├── Auth/
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── Test/
│   │   │   ├── Intro.vue
│   │   │   ├── Questions.vue
│   │   │   └── Complete.vue
│   │   ├── Report/
│   │   │   ├── Detail.vue
│   │   │   └── History.vue
│   │   ├── User/
│   │   │   ├── Profile.vue
│   │   │   └── Settings.vue
│   │   └── About.vue
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── store/              # Pinia状态管理
│   │   ├── modules/
│   │   │   ├── user.ts
│   │   │   ├── test.ts
│   │   │   └── report.ts
│   │   └── index.ts
│   ├── api/                # API接口
│   │   ├── request.ts      # Axios封装
│   │   ├── auth.ts
│   │   ├── test.ts
│   │   ├── user.ts
│   │   └── report.ts
│   ├── utils/              # 工具函数
│   │   ├── chart.ts        # 图表配置
│   │   ├── score.ts        # 评分算法
│   │   ├── validator.ts    # 表单验证
│   │   └── format.ts       # 格式化工具
│   ├── types/              # TypeScript类型定义
│   │   ├── user.ts
│   │   ├── test.ts
│   │   └── report.ts
│   ├── App.vue
│   └── main.ts
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

#### 2.2.2 路由设计
```typescript
// src/router/index.ts
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Auth/Register.vue')
      }
    ]
  },
  {
    path: '/test',
    children: [
      {
        path: 'intro',
        name: 'TestIntro',
        component: () => import('@/views/Test/Intro.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'questions/:page',
        name: 'TestQuestions',
        component: () => import('@/views/Test/Questions.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'complete',
        name: 'TestComplete',
        component: () => import('@/views/Test/Complete.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/report',
    children: [
      {
        path: 'detail/:id',
        name: 'ReportDetail',
        component: () => import('@/views/Report/Detail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'history',
        name: 'ReportHistory',
        component: () => import('@/views/Report/History.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/user',
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/User/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'UserSettings',
        component: () => import('@/views/User/Settings.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  }
]
```

---

#### 2.2.3 状态管理设计
```typescript
// src/store/modules/user.ts
interface UserState {
  token: string
  userInfo: UserInfo | null
  isLoggedIn: boolean
}

// src/store/modules/test.ts
interface TestState {
  currentTest: TestSession | null
  answers: Record<string, number>
  currentPage: number
  startTime: number
  isComplete: boolean
}

// src/store/modules/report.ts
interface ReportState {
  currentReport: Report | null
  historyReports: Report[]
  comparisonData: ComparisonData | null
}
```

---

### 2.3 后端架构设计

#### 2.3.1 目录结构
```
talent-test-backend/
├── src/
│   ├── config/             # 配置文件
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── app.ts
│   ├── controllers/        # 控制器
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── test.controller.ts
│   │   └── report.controller.ts
│   ├── services/           # 业务逻辑层
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── test.service.ts
│   │   ├── score.service.ts
│   │   └── report.service.ts
│   ├── models/             # 数据模型
│   │   ├── User.model.ts
│   │   ├── Question.model.ts
│   │   ├── Result.model.ts
│   │   └── Report.model.ts
│   ├── middlewares/        # 中间件
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   ├── routes/             # 路由定义
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── test.routes.ts
│   │   └── report.routes.ts
│   ├── validators/         # 请求验证
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   └── test.validator.ts
│   ├── utils/              # 工具函数
│   │   ├── logger.ts
│   │   ├── password.ts
│   │   └── response.ts
│   ├── types/              # TypeScript类型
│   │   └── index.ts
│   ├── app.ts              # Express应用
│   └── server.ts           # 服务器入口
├── tests/                  # 测试文件
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── .eslintrc.js
└── README.md
```

---

#### 2.3.2 分层架构
```
┌─────────────────────────────────┐
│      Routes Layer (路由层)        │  定义API端点
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Controllers (控制器层)         │  处理HTTP请求
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│    Services (业务逻辑层)         │  核心业务处理
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│     Models (数据模型层)          │  数据库操作
└─────────────────────────────────┘
```

---

### 2.4 数据流设计

#### 2.4.1 用户认证流程
```
用户登录 → POST /api/auth/login
  ↓
验证数据 → Controller
  ↓
查询用户 → Service → Model → MongoDB
  ↓
验证密码 → Service (bcrypt.compare)
  ↓
生成Token → Service (jwt.sign)
  ↓
返回Token → Controller → Response
  ↓
存储Token → 前端 (localStorage + Pinia)
```

#### 2.4.2 测试流程
```
开始测试 → GET /api/test/start
  ↓
获取题目 → Service → Model → MongoDB
  ↓
展示题目 → 前端渲染
  ↓
用户答题 → 前端记录答案
  ↓
提交答案 → POST /api/test/submit
  ↓
计算得分 → Service (评分算法)
  ↓
生成报告 → Service + Model
  ↓
返回结果 → 前端展示报告
```

---

## 3. 数据库设计

详见 `DATABASE.md` 文档

---

## 4. API接口设计

详见 `API.md` 文档

---

## 5. 核心算法设计

### 5.1 评分算法
```typescript
// 评分计算函数
function calculateScore(answers: Answer[], dimension: Dimension): number {
  const questions = answers.filter(a => a.dimension === dimension)

  let totalScore = 0
  questions.forEach(q => {
    if (q.isReverse) {
      // 逆向题：5分制转换
      totalScore += (6 - q.score)
    } else {
      totalScore += q.score
    }
  })

  // 标准化到100分制
  const averageScore = totalScore / questions.length
  const finalScore = averageScore * 20 // (5分制 → 100分制)

  return Math.round(finalScore)
}

// 天赋等级判定
function getTalentLevel(score: number): TalentLevel {
  if (score >= 85) return '优秀'
  if (score >= 70) return '良好'
  if (score >= 50) return '中等'
  if (score >= 30) return '待提升'
  return '较弱'
}
```

### 5.2 天赋类型判定
```typescript
// 根据最高维度判定天赋类型
function determineTalentType(scores: DimensionScores): TalentType {
  const { cognitive, creativity, emotional, practical } = scores

  const maxScore = Math.max(cognitive, creativity, emotional, practical)

  if (maxScore === cognitive) return '分析型'
  if (maxScore === creativity) return '创造型'
  if (maxScore === emotional) return '社交型'
  if (maxScore === practical) return '实践型'

  return '均衡型'
}
```

---

## 6. 安全设计

### 6.1 认证与授权
```
- JWT Token认证
- Token过期时间：7天
- Refresh Token机制
- 密码加密：bcrypt (salt rounds: 10)
```

### 6.2 数据安全
```
- HTTPS加密传输
- 密码加密存储
- 敏感信息脱敏
- SQL注入防护（使用Mongoose参数化查询）
- XSS攻击防护（前端输入验证 + 转义）
```

### 6.3 请求验证
```typescript
// 使用 express-validator 验证请求数据
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6, max: 20 }),
  body('nickname').isLength({ min: 2, max: 20 }).trim()
]
```

---

## 7. 性能优化

### 7.1 前端优化
```
- 代码分割（Code Splitting）
- 懒加载路由组件
- 图片懒加载
- 组件缓存（keep-alive）
- Gzip压缩
- CDN加速（可选）
```

### 7.2 后端优化
```
- 数据库索引优化
- Redis缓存（热点数据）
- 连接池管理
- 响应压缩
- 限流防刷（express-rate-limit）
```

### 7.3 数据库优化
```
- 合适的索引设计
- 查询优化（避免N+1查询）
- 数据分页
- 冷热数据分离
```

---

## 8. 监控与日志

### 8.1 日志系统
```typescript
// Winston日志配置
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})
```

### 8.2 错误监控
```
- 全局错误处理中间件
- HTTP请求日志
- 数据库操作日志
- 错误告警机制
```

---

## 9. 测试策略

### 9.1 单元测试
```
- 工具：Jest + Vue Test Utils
- 覆盖：工具函数、组件、Service层
- 目标覆盖率：80%+
```

### 9.2 集成测试
```
- API接口测试
- 数据库操作测试
```

### 9.3 E2E测试
```
- 工具：Cypress / Playwright
- 核心流程测试
```

---

## 10. 部署方案

### 10.1 开发环境
```
- 前端：npm run dev (Vite)
- 后端：npm run dev (nodemon)
- 数据库：本地MongoDB / Docker
```

### 10.2 生产环境
```
1. 前端构建
   npm run build
   生成 /dist 目录

2. 后端构建
   npm run build
   生成 /dist 目录

3. Docker部署
   docker-compose up -d

4. Nginx配置
   反向代理API服务
   托管前端静态资源
```

### 10.3 环境变量
```bash
# .env.production
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/talent-test
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-domain.com
```

---

## 11. 开发规范

### 11.1 代码规范
```
- ESLint + Prettier
- 命名规范：驼峰命名
- 注释规范：JSDoc
```

### 11.2 Git规范
```
分支策略：
- main: 生产环境
- develop: 开发环境
- feature/*: 功能分支
- bugfix/*: 修复分支

Commit规范：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建/工具
```

---

## 12. 技术风险与应对

### 12.1 潜在风险
```
1. MongoDB性能瓶颈
   → 解决：索引优化 + Redis缓存

2. 并发量大
   → 解决：负载均衡 + 连接池优化

3. 数据安全问题
   → 解决：HTTPS + 加密存储 + 权限控制

4. 第三方依赖更新
   → 解决：锁定版本 + 定期更新
```

---

**文档版本**：v1.0
**创建日期**：2025-12-31
**更新日期**：2025-12-31
