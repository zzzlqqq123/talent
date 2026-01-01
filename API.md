# 个人天赋测试系统 - API接口文档

## 1. API概述

### 1.1 基础信息
- **Base URL（开发环境）**：`http://localhost:3000/api`
- **Base URL（生产环境）**：`https://api.yourdomain.com/api`
- **接口协议**：HTTPS
- **数据格式**：JSON
- **字符编码**：UTF-8

### 1.2 认证方式
- 使用 **JWT Token** 进行身份认证
- Token在请求头中传递：`Authorization: Bearer <token>`
- Token有效期：7天

### 1.3 通用响应格式
```typescript
// 成功响应
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}

// 错误响应
{
  "success": false,
  "message": "错误信息",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

### 1.4 HTTP状态码
- `200 OK`：请求成功
- `201 Created`：创建成功
- `400 Bad Request`：请求参数错误
- `401 Unauthorized`：未授权（Token无效或过期）
- `403 Forbidden`：禁止访问
- `404 Not Found`：资源不存在
- `422 Unprocessable Entity`：数据验证失败
- `500 Internal Server Error`：服务器内部错误

---

## 2. 认证模块 (Auth)

### 2.1 用户注册

**接口地址**：`POST /auth/register`

**请求参数**：
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "张三",
  "gender": "male",           // 可选：male | female | other
  "age": 25                   // 可选
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "_id": "65b1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "nickname": "张三",
      "avatar": null,
      "role": "user",
      "status": "active",
      "createdAt": "2025-12-31T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应**：
```json
{
  "success": false,
  "message": "该邮箱已被注册",
  "error": {
    "code": "EMAIL_ALREADY_EXISTS"
  }
}
```

---

### 2.2 用户登录

**接口地址**：`POST /auth/login`

**请求参数**：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "_id": "65b1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "nickname": "张三",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "stats": {
        "testCount": 5,
        "lastTestDate": "2025-12-30T15:30:00.000Z",
        "totalScore": 82
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应**：
```json
{
  "success": false,
  "message": "邮箱或密码错误",
  "error": {
    "code": "INVALID_CREDENTIALS"
  }
}
```

---

### 2.3 获取当前用户信息

**接口地址**：`GET /auth/me`
**需要认证**：✅

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65b1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "nickname": "张三",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "profile": {
        "gender": "male",
        "age": 25,
        "occupation": "软件工程师",
        "location": "北京"
      },
      "stats": {
        "testCount": 5,
        "lastTestDate": "2025-12-30T15:30:00.000Z",
        "totalScore": 82
      },
      "role": "user",
      "status": "active"
    }
  }
}
```

---

### 2.4 刷新Token

**接口地址**：`POST /auth/refresh`
**需要认证**：✅

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. 用户模块 (User)

### 3.1 获取用户资料

**接口地址**：`GET /user/profile`
**需要认证**：✅

**响应示例**：
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65b1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "nickname": "张三",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "profile": {
        "gender": "male",
        "age": 25,
        "birthday": "1999-01-01",
        "occupation": "软件工程师",
        "location": "北京"
      },
      "stats": {
        "testCount": 5,
        "lastTestDate": "2025-12-30T15:30:00.000Z",
        "totalScore": 82
      },
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  }
}
```

---

### 3.2 更新用户资料

**接口地址**：`PUT /user/profile`
**需要认证**：✅

**请求参数**：
```json
{
  "nickname": "李四",
  "gender": "male",
  "age": 26,
  "birthday": "1998-01-01",
  "occupation": "产品经理",
  "location": "上海"
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "资料更新成功",
  "data": {
    "user": { /* 更新后的用户信息 */ }
  }
}
```

---

### 3.3 修改密码

**接口地址**：`PUT /user/password`
**需要认证**：✅

**请求参数**：
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

**错误响应**：
```json
{
  "success": false,
  "message": "原密码错误",
  "error": {
    "code": "INVALID_OLD_PASSWORD"
  }
}
```

---

### 3.4 上传头像

**接口地址**：`POST /user/avatar`
**需要认证**：✅

**请求类型**：`multipart/form-data`

**请求参数**：
```
avatar: <file>
```

**响应示例**：
```json
{
  "success": true,
  "message": "头像上传成功",
  "data": {
    "avatarUrl": "https://cdn.example.com/avatars/user123.jpg"
  }
}
```

---

## 4. 测试模块 (Test)

### 4.1 开始测试

**接口地址**：`POST /test/start`
**需要认证**：✅

**响应示例**：
```json
{
  "success": true,
  "message": "测试已开始",
  "data": {
    "testId": "test_20251231_abc123",
    "questions": [
      {
        "_id": "65b1a2b3c4d5e6f7g8h9i0j1",
        "questionText": "我能快速理解复杂的概念",
        "questionType": "single",
        "category": "cognitive",
        "dimension": "logical_thinking",
        "options": [
          { "value": 1, "label": "完全不符合" },
          { "value": 2, "label": "不太符合" },
          { "value": 3, "label": "一般" },
          { "value": 4, "label": "比较符合" },
          { "value": 5, "label": "完全符合" }
        ],
        "order": 1
      }
      // ... 更多题目
    ],
    "totalQuestions": 65,
    "estimatedTime": 1200,  // 秒
    "startTime": "2025-12-31T10:00:00.000Z"
  }
}
```

---

### 4.2 提交答案（阶段性保存）

**接口地址**：`POST /test/answer`
**需要认证**：✅

**请求参数**：
```json
{
  "testId": "test_20251231_abc123",
  "answers": [
    {
      "questionId": "65b1a2b3c4d5e6f7g8h9i0j1",
      "answerValue": 4,
      "duration": 5
    }
    // ... 更多答案
  ]
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "答案已保存",
  "data": {
    "savedCount": 10,
    "progress": {
      "answered": 10,
      "total": 65,
      "percentage": 15.38
    }
  }
}
```

---

### 4.3 完成测试

**接口地址**：`POST /test/complete`
**需要认证**：✅

**请求参数**：
```json
{
  "testId": "test_20251231_abc123",
  "endTime": "2025-12-31T10:20:35.000Z"
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "测试完成，正在生成报告...",
  "data": {
    "resultId": "65b1a2b3c4d5e6f7g8h9i0j2",
    "testId": "test_20251231_abc123",
    "duration": 1235,  // 秒
    "status": "completed"
  }
}
```

---

### 4.4 获取测试进度

**接口地址**：`GET /test/progress/:testId`
**需要认证**：✅

**响应示例**：
```json
{
  "success": true,
  "data": {
    "testId": "test_20251231_abc123",
    "status": "in_progress",
    "progress": {
      "answered": 30,
      "total": 65,
      "percentage": 46.15
    },
    "elapsedTime": 480,  // 秒
    "startTime": "2025-12-31T10:00:00.000Z"
  }
}
```

---

## 5. 报告模块 (Report)

### 5.1 获取测试报告详情

**接口地址**：`GET /report/:reportId`
**需要认证**：✅

**响应示例**：
```json
{
  "success": true,
  "data": {
    "report": {
      "_id": "65b1a2b3c4d5e6f7g8h9i0j3",
      "userId": "65b1a2b3c4d5e6f7g8h9i0j1",
      "resultId": "65b1a2b3c4d5e6f7g8h9i0j2",
      "testId": "test_20251231_abc123",

      "summary": {
        "totalScore": 82,
        "averageScore": 82,
        "talentType": "分析型",
        "talentLevel": "良好",
        "description": "你在认知能力方面表现突出，逻辑思维清晰，善于分析问题...",
        "keywords": ["逻辑思维", "分析能力", "学习能力强"]
      },

      "dimensionScores": {
        "cognitive": {
          "total": 88,
          "subScores": {
            "logical_thinking": 90,
            "memory": 85,
            "attention": 88,
            "learning": 89
          }
        },
        "creativity": {
          "total": 75,
          "subScores": {
            "imagination": 72,
            "innovation": 78,
            "artistic_perception": 75
          }
        },
        "emotional": {
          "total": 68,
          "subScores": {
            "empathy": 65,
            "emotion_management": 70,
            "interpersonal": 69
          }
        },
        "practical": {
          "total": 80,
          "subScores": {
            "execution": 85,
            "leadership": 78,
            "adaptability": 77
          }
        }
      },

      "analysis": {
        "strengths": [
          {
            "dimension": "cognitive",
            "subDimension": "logical_thinking",
            "score": 90,
            "description": "你的逻辑思维能力非常出色，善于进行复杂推理和问题分析"
          },
          {
            "dimension": "cognitive",
            "subDimension": "learning",
            "score": 89,
            "description": "你具有强大的学习能力，能够快速掌握新知识和新技能"
          }
        ],
        "improvements": [
          {
            "dimension": "emotional",
            "subDimension": "empathy",
            "score": 65,
            "description": "建议在理解他人情感方面多加练习，提高同理心"
          }
        ],
        "suggestions": [
          "继续保持你的逻辑思维优势，可以尝试更复杂的问题挑战",
          "在团队协作中多关注他人感受，提升沟通效果",
          "发挥你的学习能力，不断拓展知识面"
        ]
      },

      "comparison": {
        "previousScore": 78,
        "rank": "上升",
        "changedDimensions": [
          {
            "dimension": "cognitive",
            "change": 5,
            "trend": "up"
          },
          {
            "dimension": "creativity",
            "change": -3,
            "trend": "down"
          }
        ]
      },

      "chartData": {
        "radar": {
          "categories": ["认知能力", "创造力", "情感智能", "实践能力"],
          "values": [88, 75, 68, 80]
        },
        "bar": {
          "dimensions": ["逻辑思维", "记忆力", "注意力", "学习能力", "想象力", "创新思维", "艺术感知", "同理心", "情绪管理", "人际交往", "执行力", "领导力", "适应力"],
          "values": [90, 85, 88, 89, 72, 78, 75, 65, 70, 69, 85, 78, 77]
        }
      },

      "createdAt": "2025-12-31T10:20:40.000Z"
    }
  }
}
```

---

### 5.2 获取用户报告列表

**接口地址**：`GET /report/list`
**需要认证**：✅

**查询参数**：
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `sort`: 排序方式（`createdAt:-1` 按时间降序）

**请求示例**：`GET /report/list?page=1&limit=10`

**响应示例**：
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "_id": "65b1a2b3c4d5e6f7g8h9i0j3",
        "testId": "test_20251231_abc123",
        "summary": {
          "totalScore": 82,
          "talentType": "分析型",
          "talentLevel": "良好",
          "keywords": ["逻辑思维", "分析能力"]
        },
        "createdAt": "2025-12-31T10:20:40.000Z"
      }
      // ... 更多报告
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### 5.3 获取报告对比数据

**接口地址**：`POST /report/compare`
**需要认证**：✅

**请求参数**：
```json
{
  "reportIds": [
    "65b1a2b3c4d5e6f7g8h9i0j3",
    "65b1a2b3c4d5e6f7g8h9i0j4",
    "65b1a2b3c4d5e6f7g8h9i0j5"
  ]
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "comparison": {
      "reports": [
        {
          "_id": "65b1a2b3c4d5e6f7g8h9i0j3",
          "testId": "test_20251231_abc123",
          "totalScore": 82,
          "dimensionScores": [88, 75, 68, 80],
          "createdAt": "2025-12-31T10:20:40.000Z"
        }
        // ... 更多报告
      ],
      "trendData": {
        "dates": ["2025-12-29", "2025-12-30", "2025-12-31"],
        "totalScores": [78, 80, 82],
        "cognitiveScores": [85, 86, 88],
        "creativityScores": [72, 74, 75],
        "emotionalScores": [65, 66, 68],
        "practicalScores": [78, 79, 80]
      },
      "analysis": {
        "improvement": 4,      // 总分提升
        "bestDimension": "cognitive",
        "trend": "上升"
      }
    }
  }
}
```

---

### 5.4 分享报告

**接口地址**：`POST /report/:reportId/share`
**需要认证**：✅

**请求参数**：
```json
{
  "isPublic": true
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "报告已分享",
  "data": {
    "shareId": "share_abc123",
    "shareUrl": "https://yourdomain.com/share/share_abc123",
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

### 5.5 获取分享的报告

**接口地址**：`GET /share/:shareId`
**需要认证**：❌（公开访问）

**响应示例**：
```json
{
  "success": true,
  "data": {
    "report": { /* 报告详情 */ },
    "viewCount": 128
  }
}
```

---

### 5.6 下载报告PDF

**接口地址**：`GET /report/:reportId/download`
**需要认证**：✅

**响应**：PDF文件流

---

### 5.7 删除报告

**接口地址**：`DELETE /report/:reportId`
**需要认证**：✅

**响应示例**：
```json
{
  "success": true,
  "message": "报告已删除"
}
```

---

## 6. 题目管理模块 (Questions)

### 6.1 获取题目列表

**接口地址**：`GET /questions`
**需要认证**：❌（或需要管理员权限）

**查询参数**：
- `category`: 分类（`cognitive`, `creativity`, `emotional`, `practical`）
- `dimension`: 维度
- `active`: 是否启用（`true`/`false`）

**请求示例**：`GET /questions?category=cognitive&active=true`

**响应示例**：
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "65b1a2b3c4d5e6f7g8h9i0j1",
        "questionText": "我能快速理解复杂的概念",
        "category": "cognitive",
        "dimension": "logical_thinking",
        "options": [
          { "value": 1, "label": "完全不符合" },
          { "value": 2, "label": "不太符合" },
          { "value": 3, "label": "一般" },
          { "value": 4, "label": "比较符合" },
          { "value": 5, "label": "完全符合" }
        ],
        "order": 1
      }
    ],
    "total": 20
  }
}
```

---

## 7. 统计分析模块 (Statistics)

### 7.1 获取用户统计数据

**接口地址**：`GET /statistics/user`
**需要认证**：✅

**响应示例**：
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTests": 5,
      "averageScore": 79.2,
      "highestScore": 82,
      "lowestScore": 75,
      "totalTimeSpent": 6175  // 秒
    },
    "dimensionAverages": {
      "cognitive": 86.4,
      "creativity": 74.8,
      "emotional": 67.2,
      "practical": 79.6
    },
    "recentTrend": {
      "dates": ["2025-12-27", "2025-12-28", "2025-12-29", "2025-12-30", "2025-12-31"],
      "scores": [75, 77, 78, 80, 82]
    }
  }
}
```

---

## 8. 错误码说明

| 错误码 | 说明 |
|--------|------|
| `INVALID_PARAMS` | 请求参数无效 |
| `UNAUTHORIZED` | 未授权（Token缺失或无效） |
| `TOKEN_EXPIRED` | Token已过期 |
| `EMAIL_ALREADY_EXISTS` | 邮箱已被注册 |
| `INVALID_CREDENTIALS` | 邮箱或密码错误 |
| `USER_NOT_FOUND` | 用户不存在 |
| `INVALID_OLD_PASSWORD` | 原密码错误 |
| `TEST_NOT_FOUND` | 测试不存在 |
| `TEST_ALREADY_COMPLETED` | 测试已完成，无法修改 |
| `REPORT_NOT_FOUND` | 报告不存在 |
| `PERMISSION_DENIED` | 权限不足 |
| `RATE_LIMIT_EXCEEDED` | 请求过于频繁 |
| `SERVER_ERROR` | 服务器内部错误 |

---

## 9. 请求限制（Rate Limit）

- **未认证用户**：100次/小时
- **已认证用户**：1000次/小时
- **管理员**：无限制

超过限制后返回：
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求过于频繁，请稍后再试",
    "retryAfter": 3600  // 秒
  }
}
```

---

## 10. 数据验证规则

### 10.1 邮箱验证
```javascript
{
  "email": {
    "required": true,
    "format": "email",
    "maxLength": 100
  }
}
```

### 10.2 密码验证
```javascript
{
  "password": {
    "required": true,
    "minLength": 6,
    "maxLength": 20,
    "pattern": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]"
  }
}
```

### 10.3 昵称验证
```javascript
{
  "nickname": {
    "required": true,
    "minLength": 2,
    "maxLength": 20,
    "pattern": "^[\\u4e00-\\u9fa5a-zA-Z0-9_]+$"
  }
}
```

### 10.4 答案验证
```javascript
{
  "answerValue": {
    "required": true,
    "type": "number",
    "min": 1,
    "max": 5
  }
}
```

---

**文档版本**：v1.0
**创建日期**：2025-12-31
**更新日期**：2025-12-31
