# 个人天赋测试系统 - 数据库设计文档

## 1. 数据库概述

### 1.1 数据库选型
- **数据库类型**：MongoDB（NoSQL文档数据库）
- **版本**：MongoDB 6.x
- **字符集**：UTF-8
- **数据库名**：`talent_test`

### 1.2 选型理由
- 灵活的文档结构，适合存储问卷数据
- 易于水平扩展
- 支持复杂查询
- 性能优秀

---

## 2. 数据库集合设计

### 2.1 用户集合 (users)

**集合名称**：`users`
**用途**：存储用户基本信息和认证信息

#### 数据结构
```typescript
{
  _id: ObjectId,                    // 主键，自动生成

  // 基本信息
  email: string,                    // 邮箱（唯一索引）
  password: string,                 // 加密密码
  nickname: string,                 // 昵称
  avatar?: string,                  // 头像URL

  // 个人资料
  profile: {
    gender?: 'male' | 'female' | 'other',  // 性别
    age?: number,                   // 年龄
    birthday?: Date,                // 生日
    occupation?: string,            // 职业
    location?: string,              // 地区
  },

  // 统计信息
  stats: {
    testCount: number,              // 测试次数
    lastTestDate?: Date,            // 最后测试时间
    totalScore: number,             // 历史最高总分
  },

  // 系统字段
  status: 'active' | 'inactive' | 'banned',  // 账户状态
  role: 'user' | 'admin',           // 用户角色
  emailVerified: boolean,           // 邮箱是否验证
  createdAt: Date,                  // 创建时间
  updatedAt: Date,                  // 更新时间
  lastLoginAt?: Date,               // 最后登录时间
}
```

#### 索引设计
```javascript
// 唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 普通索引
db.users.createIndex({ nickname: 1 })
db.users.createIndex({ createdAt: -1 })
db.users.createIndex({ status: 1 })
```

#### Mongoose Schema
```typescript
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  avatar: String,

  profile: {
    gender: { type: String, enum: ['male', 'female', 'other'] },
    age: { type: Number, min: 1, max: 150 },
    birthday: Date,
    occupation: String,
    location: String
  },

  stats: {
    testCount: { type: Number, default: 0 },
    lastTestDate: Date,
    totalScore: { type: Number, default: 0 }
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: Date
}, {
  timestamps: true,  // 自动生成 createdAt 和 updatedAt
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password  // 序列化时隐藏密码
      return ret
    }
  }
})

export default mongoose.model('User', UserSchema)
```

---

### 2.2 题目集合 (questions)

**集合名称**：`questions`
**用途**：存储测试题目和选项

#### 数据结构
```typescript
{
  _id: ObjectId,                    // 主键

  // 题目信息
  questionText: string,             // 题目内容
  questionType: 'single' | 'scenario',  // 题目类型
  category: Category,               // 所属大类
  dimension: Dimension,             // 所属维度
  subDimension?: string,            // 子维度

  // 选项
  options: [
    {
      value: number,                // 选项值（1-5）
      label: string,                // 选项文本
    }
  ],

  // 题目属性
  isReverse: boolean,               // 是否逆向题
  difficulty: number,               // 难度系数（1-5）
  order: number,                    // 题目序号

  // 元数据
  active: boolean,                  // 是否启用
  createdAt: Date,
  updatedAt: Date,
}

// 枚举类型
type Category = 'cognitive' | 'creativity' | 'emotional' | 'practical'
type Dimension =
  | 'logical_thinking'      // 逻辑思维
  | 'memory'                // 记忆力
  | 'attention'             // 注意力
  | 'learning'              // 学习能力
  | 'imagination'           // 想象力
  | 'innovation'            // 创新思维
  | 'artistic_perception'   // 艺术感知
  | 'empathy'               // 同理心
  | 'emotion_management'    // 情绪管理
  | 'interpersonal'         // 人际交往
  | 'execution'             // 执行力
  | 'leadership'            // 领导力
  | 'adaptability'          // 适应力
```

#### 索引设计
```javascript
db.questions.createIndex({ category: 1, dimension: 1 })
db.questions.createIndex({ order: 1 })
db.questions.createIndex({ active: 1 })
```

#### Mongoose Schema
```typescript
const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['single', 'scenario'],
    default: 'single'
  },
  category: {
    type: String,
    enum: ['cognitive', 'creativity', 'emotional', 'practical'],
    required: true
  },
  dimension: {
    type: String,
    required: true
  },
  subDimension: String,

  options: [{
    value: { type: Number, required: true },
    label: { type: String, required: true }
  }],

  isReverse: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  order: {
    type: Number,
    required: true
  },

  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model('Question', QuestionSchema)
```

---

### 2.3 测试结果集合 (results)

**集合名称**：`results`
**用途**：存储用户的答题记录和原始数据

#### 数据结构
```typescript
{
  _id: ObjectId,

  // 关联信息
  userId: ObjectId,                 // 用户ID（外键）
  testId: string,                   // 测试批次ID

  // 答题数据
  answers: [
    {
      questionId: ObjectId,         // 题目ID
      answerValue: number,          // 用户答案（1-5）
      duration?: number,            // 答题用时（秒）
      timestamp: Date,              // 答题时间
    }
  ],

  // 时间信息
  startTime: Date,                  // 开始时间
  endTime: Date,                    // 结束时间
  duration: number,                 // 总用时（秒）

  // 测试状态
  status: 'in_progress' | 'completed' | 'abandoned',

  // 元数据
  ipAddress?: string,               // IP地址
  userAgent?: string,               // 浏览器信息

  createdAt: Date,
  updatedAt: Date,
}
```

#### 索引设计
```javascript
db.results.createIndex({ userId: 1, createdAt: -1 })
db.results.createIndex({ testId: 1 })
db.results.createIndex({ status: 1 })
db.results.createIndex({ userId: 1, status: 1 })
```

#### Mongoose Schema
```typescript
const ResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  testId: {
    type: String,
    required: true,
    unique: true
  },

  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    answerValue: {
      type: Number,
      min: 1,
      max: 5
    },
    duration: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },

  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
})

export default mongoose.model('Result', ResultSchema)
```

---

### 2.4 报告集合 (reports)

**集合名称**：`reports`
**用途**：存储生成的测试报告和分析结果

#### 数据结构
```typescript
{
  _id: ObjectId,

  // 关联信息
  userId: ObjectId,                 // 用户ID
  resultId: ObjectId,               // 结果ID（外键）
  testId: string,                   // 测试批次ID

  // 总体评估
  summary: {
    totalScore: number,             // 总分（0-100）
    averageScore: number,           // 平均分
    talentType: string,             // 天赋类型
    talentLevel: string,            // 天赋等级
    description: string,            // 总体描述
    keywords: string[],             // 关键词标签
  },

  // 维度得分
  dimensionScores: {
    cognitive: {
      total: number,                // 认知能力总分
      subScores: {
        logical_thinking: number,
        memory: number,
        attention: number,
        learning: number,
      }
    },
    creativity: {
      total: number,                // 创造力总分
      subScores: {
        imagination: number,
        innovation: number,
        artistic_perception: number,
      }
    },
    emotional: {
      total: number,                // 情感智能总分
      subScores: {
        empathy: number,
        emotion_management: number,
        interpersonal: number,
      }
    },
    practical: {
      total: number,                // 实践能力总分
      subScores: {
        execution: number,
        leadership: number,
        adaptability: number,
      }
    }
  },

  // 能力分析
  analysis: {
    strengths: [                    // 优势能力
      {
        dimension: string,
        subDimension: string,
        score: number,
        description: string
      }
    ],
    improvements: [                 // 待提升能力
      {
        dimension: string,
        subDimension: string,
        score: number,
        description: string
      }
    ],
    suggestions: string[]           // 发展建议
  },

  // 对比数据（与历史记录对比）
  comparison?: {
    previousScore?: number,         // 上次测试分数
    rank: string,                   // 排名变化（上升/下降/持平）
    changedDimensions: [            // 变化维度
      {
        dimension: string,
        change: number,             // 变化值
        trend: 'up' | 'down' | 'stable'
      }
    ]
  },

  // 图表数据
  chartData: {
    radar: {                        // 雷达图数据
      categories: string[],
      values: number[]
    },
    bar: {                          // 柱状图数据
      dimensions: string[],
      values: number[]
    }
  },

  // 分享信息
  shareInfo: {
    shareId: string,                // 分享ID（唯一）
    shareCount: number,             // 分享次数
    viewCount: number,              // 查看次数
    isPublic: boolean               // 是否公开
  },

  // 元数据
  createdAt: Date,
  updatedAt: Date,
}
```

#### 索引设计
```javascript
db.reports.createIndex({ userId: 1, createdAt: -1 })
db.reports.createIndex({ resultId: 1 }, { unique: true })
db.reports.createIndex({ testId: 1 })
db.reports.createIndex({ 'shareInfo.shareId': 1 })
```

#### Mongoose Schema
```typescript
const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result',
    required: true,
    unique: true
  },
  testId: {
    type: String,
    required: true
  },

  summary: {
    totalScore: { type: Number, min: 0, max: 100 },
    averageScore: Number,
    talentType: String,
    talentLevel: String,
    description: String,
    keywords: [String]
  },

  dimensionScores: {
    cognitive: {
      total: Number,
      subScores: {
        logical_thinking: Number,
        memory: Number,
        attention: Number,
        learning: Number
      }
    },
    creativity: {
      total: Number,
      subScores: {
        imagination: Number,
        innovation: Number,
        artistic_perception: Number
      }
    },
    emotional: {
      total: Number,
      subScores: {
        empathy: Number,
        emotion_management: Number,
        interpersonal: Number
      }
    },
    practical: {
      total: Number,
      subScores: {
        execution: Number,
        leadership: Number,
        adaptability: Number
      }
    }
  },

  analysis: {
    strengths: [{
      dimension: String,
      subDimension: String,
      score: Number,
      description: String
    }],
    improvements: [{
      dimension: String,
      subDimension: String,
      score: Number,
      description: String
    }],
    suggestions: [String]
  },

  comparison: {
    previousScore: Number,
    rank: String,
    changedDimensions: [{
      dimension: String,
      change: Number,
      trend: { type: String, enum: ['up', 'down', 'stable'] }
    }]
  },

  chartData: {
    radar: {
      categories: [String],
      values: [Number]
    },
    bar: {
      dimensions: [String],
      values: [Number]
    }
  },

  shareInfo: {
    shareId: {
      type: String,
      unique: true,
      sparse: true
    },
    shareCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false }
  }
}, {
  timestamps: true
})

export default mongoose.model('Report', ReportSchema)
```

---

### 2.5 系统配置集合 (system_configs)

**集合名称**：`system_configs`
**用途**：存储系统配置信息

#### 数据结构
```typescript
{
  _id: ObjectId,
  key: string,                      // 配置键（唯一）
  value: any,                       // 配置值
  description: string,              // 描述
  category: string,                 // 分类
  updatedAt: Date,
}
```

#### 示例数据
```javascript
{
  key: 'test.duration_limit',
  value: 1800,  // 30分钟
  description: '测试时长限制（秒）',
  category: 'test_config'
}
```

---

## 3. 数据关系图

```
┌──────────────┐
│     users    │
│              │
│  - _id       │◄─────┐
│  - email     │      │
│  - password  │      │
│  - nickname  │      │
└──────────────┘      │
                      │
                      │
        ┌─────────────┴───────────┐
        │                         │
┌───────▼────────┐       ┌────────▼─────────┐
│    results     │       │     reports      │
│                │       │                  │
│  - _id         │◄──────│  - _id           │
│  - userId      │       │  - userId        │
│  - answers[]   │       │  - resultId      │
│  - startTime   │       │  - summary       │
│  - endTime     │       │  - dimensionScores│
└────────────────┘       │  - analysis      │
         │               │  - chartData     │
         │               └──────────────────┘
         │
┌────────▼────────┐
│   questions     │
│                 │
│  - _id          │
│  - questionText │
│  - category     │
│  - dimension    │
└─────────────────┘
```

---

## 4. 数据操作

### 4.1 常用查询示例

#### 查询用户的测试历史
```javascript
db.reports.find({ userId: ObjectId('...') })
  .sort({ createdAt: -1 })
  .limit(10)
```

#### 查询某个维度的题目
```javascript
db.questions.find({
  category: 'cognitive',
  dimension: 'logical_thinking',
  active: true
}).sort({ order: 1 })
```

#### 查询用户的平均分
```javascript
db.reports.aggregate([
  { $match: { userId: ObjectId('...') } },
  { $group: {
    _id: '$userId',
    avgScore: { $avg: '$summary.totalScore' },
    maxScore: { $max: '$summary.totalScore' },
    testCount: { $sum: 1 }
  }}
])
```

#### 对比两次测试
```javascript
db.reports.find({
  userId: ObjectId('...'),
  _id: { $in: [ObjectId('report1'), ObjectId('report2')] }
}).sort({ createdAt: 1 })
```

---

## 5. 数据迁移与备份

### 5.1 备份策略
```bash
# 备份整个数据库
mongodump --db talent_test --out /backup/talent_test_$(date +%Y%m%d)

# 备份单个集合
mongodump --db talent_test --collection users --out /backup/

# 恢复数据库
mongorestore --db talent_test /backup/talent_test
```

### 5.2 数据清理策略
```javascript
// 清理30天前的未完成测试
db.results.deleteMany({
  status: 'abandoned',
  createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
})
```

---

## 6. 性能优化建议

### 6.1 索引优化
- 为所有外键字段创建索引
- 为常用查询条件创建复合索引
- 定期分析索引使用情况

### 6.2 查询优化
- 使用投影减少返回字段
- 合理使用分页
- 避免深度嵌套查询

### 6.3 数据建模
- 嵌入式文档 vs 引用：根据查询频率选择
- 数据预聚合：对于复杂统计
- 读写分离：高并发场景

---

**文档版本**：v1.0
**创建日期**：2025-12-31
**更新日期**：2025-12-31
