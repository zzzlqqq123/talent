# 个人天赋测试系统 - 前端页面结构与交互流程

## 1. 页面架构

### 1.1 整体布局
```
┌────────────────────────────────────────────────────┐
│                    顶部导航栏                        │
│              (Logo + 导航菜单 + 用户信息)             │
└────────────────────────────────────────────────────┘
│                                                      │
│                   主内容区域                          │
│              (根据路由动态渲染页面)                   │
│                                                      │
└────────────────────────────────────────────────────┘
│                                                      │
│                    页脚区域                          │
│              (版权信息 + 友情链接)                    │
└────────────────────────────────────────────────────┘
```

---

## 2. 页面列表

### 2.1 首页 (Home)

**路由**：`/`
**访问权限**：无需登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    Hero 区域                        │
│           标题："发现你的天赋优势"                    │
│           副标题："科学测试，精准分析"                │
│           [开始测试] 按钮                           │
├────────────────────────────────────────────────────┤
│                    功能介绍                         │
│          [图标] 四大维度评估                        │
│          [图标] 数据可视化报告                      │
│          [图标] 历史成长追踪                        │
├────────────────────────────────────────────────────┤
│                    测试流程                         │
│          Step 1 → Step 2 → Step 3 → Step 4        │
├────────────────────────────────────────────────────┤
│                    用户评价                         │
│          用户1: "测试很准确..."                    │
│          用户2: "帮助我了解自己..."                 │
└────────────────────────────────────────────────────┘
```

#### 组件结构
```vue
<template>
  <div class="home-page">
    <Header />
    <HeroSection />
    <FeatureSection />
    <ProcessSection />
    <TestimonialsSection />
    <FAQSection />
    <Footer />
  </div>
</template>
```

#### 交互说明
- 点击"开始测试"按钮 → 跳转到登录页（未登录）或测试介绍页（已登录）
- 点击导航栏菜单 → 跳转到对应页面

---

### 2.2 登录页 (Login)

**路由**：`/auth/login`
**访问权限**：游客

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    Logo                             │
├────────────────────────────────────────────────────┤
│                    登录表单                          │
│                                                     │
│              邮箱: [_______________]                │
│                                                     │
│              密码: [_______________]                │
│                                                     │
│           [忘记密码?]                               │
│                                                     │
│              [登录] 按钮                            │
│                                                     │
│           还没有账号? [注册]                         │
└────────────────────────────────────────────────────┘
```

#### 表单验证
```javascript
验证规则：
- 邮箱：必填，格式正确
- 密码：必填，6-20位

错误提示：
- 邮箱或密码错误
- 账号已被禁用
- 网络错误
```

#### 交互流程
```
用户输入邮箱和密码
  ↓
点击登录按钮
  ↓
前端验证数据
  ↓
调用登录API
  ↓
成功 → 保存Token → 跳转到首页
  ↓
失败 → 显示错误提示 → 停留在当前页
```

---

### 2.3 注册页 (Register)

**路由**：`/auth/register`
**访问权限**：游客

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    Logo                             │
├────────────────────────────────────────────────────┤
│                    注册表单                          │
│                                                     │
│              邮箱: [_______________]                │
│                                                     │
│              密码: [_______________]                │
│                                                     │
│         确认密码: [_______________]                 │
│                                                     │
│              昵称: [_______________]                │
│                                                     │
│       性别: ○ 男  ○ 女  ○ 其他                     │
│                                                     │
│         年龄: [_______________]                     │
│                                                     │
│          □ 我已阅读并同意《用户协议》                │
│                                                     │
│              [注册] 按钮                            │
│                                                     │
│         已有账号? [登录]                             │
└────────────────────────────────────────────────────┘
```

#### 表单验证
```javascript
验证规则：
- 邮箱：必填，格式正确，未注册
- 密码：必填，6-20位，包含字母和数字
- 确认密码：必填，与密码一致
- 昵称：必填，2-20位
- 性别：可选
- 年龄：可选，1-150
- 用户协议：必选

实时验证：
- 邮箱失焦时检查是否已注册
- 密码输入时实时显示强度
```

---

### 2.4 测试介绍页 (Test Intro)

**路由**：`/test/intro`
**访问权限**：需要登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    面包屑导航                        │
│          首页 > 开始测试                            │
├────────────────────────────────────────────────────┤
│                    测试说明                          │
│                                                     │
│    欢迎参加天赋测试！本测试将从以下四个维度评估...     │
│                                                     │
│    ⏱️ 预计用时：15-20分钟                           │
│    📝 题目数量：65题                                │
│                                                     │
├────────────────────────────────────────────────────┤
│                    测试维度                          │
│                                                     │
│    ┌──────────┬──────────┬──────────┬──────────┐  │
│    │ 认知能力 │  创造力  │ 情感智能 │ 实践能力 │  │
│    │  20题    │   15题   │   15题   │   15题   │  │
│    └──────────┴──────────┴──────────┴──────────┘  │
│                                                     │
├────────────────────────────────────────────────────┤
│                    注意事项                          │
│    • 请根据真实情况作答                             │
│    • 每题必答，不要遗漏                             │
│    • 建议在安静环境下完成                           │
│                                                     │
│                    [开始测试] 按钮                   │
└────────────────────────────────────────────────────┘
```

#### 交互说明
- 点击"开始测试" → 调用API创建测试实例 → 跳转到答题页（第1页）

---

### 2.5 答题页 (Questions)

**路由**：`/test/questions/:page`
**访问权限**：需要登录
**参数**：`page` (1-7)

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│  返回    天赋测试                                退出 │
├────────────────────────────────────────────────────┤
│                    进度条                           │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░  10/65 (15%)           │
├────────────────────────────────────────────────────┤
│                    题目区域                         │
│                                                     │
│  Question 1 / 10                                   │
│                                                     │
│  我能快速理解复杂的概念                             │
│                                                     │
│  ○ 完全不符合                                       │
│  ○ 不太符合                                         │
│  ○ 一般                                             │
│  ● 比较符合  ← 已选                                 │
│  ○ 完全符合                                         │
│                                                     │
├────────────────────────────────────────────────────┤
│         [上一页]           [下一页]                 │
└────────────────────────────────────────────────────┘
```

#### 答题交互流程
```
进入答题页
  ↓
加载当前页题目（每页10题）
  ↓
用户选择答案
  ↓
答案保存到本地状态
  ↓
点击"下一页"
  ↓
检查当前页是否已全部作答
  ↓
是 → 提交答案到API → 跳转到下一页
  ↓
否 → 提示未完成 → 停留在当前页
```

#### 状态管理
```typescript
// Pinia Store
interface TestState {
  testId: string                 // 测试ID
  currentPage: number            // 当前页码
  answers: Map<string, number>   // 答案 map<questionId, answerValue>
  startTime: number              // 开始时间
  pageStartTime: number          // 当前页开始时间
  answeredCount: number          // 已答题目数
  isComplete: boolean            // 是否完成
}

// Actions
- startTest()              // 开始测试
- saveAnswer(questionId, answerValue)  // 保存答案
- submitPageAnswers()      // 提交当前页答案
- nextPage()               // 下一页
- prevPage()               // 上一页
- completeTest()           // 完成测试
- abandonTest()            // 放弃测试
```

#### 防作弊机制
```javascript
1. 防止快速点击：
   - 记录每题答题时长
   - 小于2秒提示"请认真阅读题目"

2. 防止复制粘贴：
   - 禁用右键菜单
   - 禁止复制文本

3. 离开页面提示：
   - 监听beforeunload事件
   - 提示"答题进度将不会保存"

4. 自动保存草稿：
   - 每30秒自动保存一次
   - 刷新页面后恢复答案
```

---

### 2.6 测试完成页 (Test Complete)

**路由**：`/test/complete`
**访问权限**：需要登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    动画效果                          │
│       ✓ 测试完成！                                  │
│    正在生成您的专属报告...                           │
│                                                     │
│       [加载动画]                                    │
│                                                     │
│       预计等待时间：3秒                             │
└────────────────────────────────────────────────────┘

  ↓ 3秒后自动跳转到报告页

┌────────────────────────────────────────────────────┐
│                    报告预览                          │
│                                                     │
│  您的天赋类型：分析型                               │
│  总分：82分（良好）                                 │
│                                                     │
│     [查看完整报告] 按钮                             │
└────────────────────────────────────────────────────┘
```

---

### 2.7 报告详情页 (Report Detail)

**路由**：`/report/detail/:reportId`
**访问权限**：需要登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│  返回    天赋测试报告                              分享 │
├────────────────────────────────────────────────────┤
│                    总体评估卡片                      │
│                                                     │
│    ┌────────────────────────────────────┐          │
│    │   天赋类型：分析型                  │          │
│    │   总分：82分（良好）               │          │
│    │   测试时间：2025-12-31 10:20      │          │
│    │                                    │          │
│    │   你在认知能力方面表现突出...       │          │
│    └────────────────────────────────────┘          │
├────────────────────────────────────────────────────┤
│                    雷达图                            │
│  ┌──────────────────────────────────────┐          │
│  │        [ECharts 雷达图]              │          │
│  │     四大维度能力分布可视化            │          │
│  └──────────────────────────────────────┘          │
├────────────────────────────────────────────────────┤
│                    维度详情                          │
│  ┌──────────────────────────────────────┐          │
│  │ 认知能力 ████████░░ 88分             │          │
│  │   • 逻辑思维: 90                     │          │
│  │   • 记忆力: 85                       │          │
│  │   • 注意力: 88                       │          │
│  │   • 学习能力: 89                     │          │
│  └──────────────────────────────────────┘          │
├────────────────────────────────────────────────────┤
│                    发展建议                          │
│    • 继续保持你的逻辑思维优势                        │
│    • 在团队协作中多关注他人感受                      │
│    • 发挥你的学习能力，不断拓展知识面                │
├────────────────────────────────────────────────────┤
│  [下载PDF]  [分享报告]  [重新测试]                  │
└────────────────────────────────────────────────────┘
```

#### 图表配置
```typescript
// 雷达图配置
const radarOption = {
  radar: {
    indicator: [
      { name: '认知能力', max: 100 },
      { name: '创造力', max: 100 },
      { name: '情感智能', max: 100 },
      { name: '实践能力', max: 100 }
    ]
  },
  series: [{
    type: 'radar',
    data: [{
      value: [88, 75, 68, 80],
      areaStyle: { color: 'rgba(24, 144, 255, 0.2)' }
    }]
  }]
}

// 柱状图配置（子维度）
const barOption = {
  xAxis: {
    type: 'category',
    data: ['逻辑思维', '记忆力', '注意力', '学习能力', ...]
  },
  yAxis: { type: 'value', max: 100 },
  series: [{
    type: 'bar',
    data: [90, 85, 88, 89, ...],
    itemStyle: { color: '#1890ff' }
  }]
}
```

#### 交互功能
- **分享报告**：生成分享链接和二维码
- **下载PDF**：调用API生成PDF文件并下载
- **重新测试**：跳转到测试介绍页

---

### 2.8 历史记录页 (Report History)

**路由**：`/report/history`
**访问权限**：需要登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    筛选栏                           │
│  时间排序: [最新 ▼]  筛选: [全部测试 ▼]            │
├────────────────────────────────────────────────────┤
│                    记录列表                          │
│                                                     │
│  ┌────────────────────────────────────┐            │
│  │ 2025-12-31 10:20       [查看]      │            │
│  │ 总分: 82分  天赋类型: 分析型         │            │
│  │ 标签: #逻辑思维 #分析能力            │            │
│  └────────────────────────────────────┘            │
│                                                     │
│  ┌────────────────────────────────────┐            │
│  │ 2025-12-30 15:30       [查看]      │            │
│  │ 总分: 80分  天赋类型: 创造型         │            │
│  │ 标签: #创造力 #想象力               │            │
│  └────────────────────────────────────┘            │
│                                                     │
│  ┌────────────────────────────────────┐            │
│  │ 2025-12-29 09:15       [查看]      │            │
│  │ 总分: 78分  天赋类型: 实践型         │            │
│  │ 标签: #执行力 #领导力               │            │
│  └────────────────────────────────────┘            │
├────────────────────────────────────────────────────┤
│                    对比功能                          │
│  已选择 2 项测试    [对比分析] 按钮                  │
├────────────────────────────────────────────────────┤
│                   分页控件                           │
│  ← 上一页    1 2 3 4 5    下一页 →                 │
└────────────────────────────────────────────────────┘
```

#### 交互功能
- **筛选**：按时间、分数、天赋类型筛选
- **排序**：按时间、分数排序
- **多选**：勾选多个记录进行对比
- **对比分析**：跳转到对比页面

---

### 2.9 对比分析页 (Comparison)

**路由**：`/report/comparison`
**访问权限**：需要登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│  返回    成长趋势分析                               │
├────────────────────────────────────────────────────┤
│                    趋势图                            │
│  ┌──────────────────────────────────────┐          │
│  │     [ECharts 折线图]                 │          │
│  │     多次测试得分变化趋势              │          │
│  │     X轴: 测试时间                     │          │
│  │     Y轴: 得分                        │          │
│  │     多条线: 四大维度                  │          │
│  └──────────────────────────────────────┘          │
├────────────────────────────────────────────────────┤
│                    变化分析                          │
│  ┌──────────────────────────────────────┐          │
│  │ 相比上次测试：                         │          │
│  │ • 总分提升了 4 分 ↗                   │          │
│  │ • 认知能力提升了 5 分 ↗               │          │
│  │ • 创造力下降了 3 分 ↘                 │          │
│  │ • 情感智能提升了 2 分 ↗               │          │
│  │ • 实践能力保持稳定 →                  │          │
│  └──────────────────────────────────────┘          │
├────────────────────────────────────────────────────┤
│                    建议                              │
│  • 你的认知能力持续提升，继续保持！                  │
│  • 注意培养创造力，多尝试创新思维                  │
│  • 情感智能有所进步，继续加强人际交往能力            │
└────────────────────────────────────────────────────┘
```

---

### 2.10 个人中心 (User Profile)

**路由**：`/user/profile`
**访问权限**：需要登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    个人信息                          │
│  ┌────────────────────────────────────┐            │
│  │  [头像]                              │            │
│  │                                     │            │
│  │  昵称: 张三       [编辑]             │            │
│  │  邮箱: user@example.com             │            │
│  │  性别: 男       [编辑]               │            │
│  │  年龄: 25岁      [编辑]              │            │
│  │  职业: 软件工程师  [编辑]            │            │
│  └────────────────────────────────────┘            │
├────────────────────────────────────────────────────┤
│                    账户设置                          │
│  • 修改密码                                         │
│  • 隐私设置                                         │
│  • 通知设置                                         │
├────────────────────────────────────────────────────┤
│                    统计信息                          │
│  • 总测试次数: 5 次                                 │
│  • 平均分数: 79.2 分                                │
│  • 最高分数: 82 分                                  │
│  • 最近测试: 2025-12-31                             │
└────────────────────────────────────────────────────┘
```

#### 编辑模态框
```
┌────────────────────────────────────────────────────┐
│                    编辑资料                          │
│                                                     │
│  昵称: [____________________]                      │
│  性别: ○ 男  ○ 女  ○ 其他                          │
│  年龄: [____]                                       │
│  职业: [____________________]                      │
│  地区: [____________________]                      │
│                                                     │
│              [取消]          [保存]                 │
└────────────────────────────────────────────────────┘
```

---

### 2.11 设置页 (Settings)

**路由**：`/user/settings`
**访问权限**：需要登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    修改密码                          │
│  旧密码: [____________________]                    │
│  新密码: [____________________]                    │
│  确认密码: [____________________]                  │
│           [确认修改]                                │
├────────────────────────────────────────────────────┤
│                    隐私设置                          │
│  □ 允许他人查看我的测试报告                         │
│  □ 允许在统计中展示我的数据（匿名）                 │
├────────────────────────────────────────────────────┤
│                    通知设置                          │
│  □ 测试完成通知                                     │
│  □ 新功能上线通知                                   │
│  □ 每周测试提醒                                     │
├────────────────────────────────────────────────────┤
│                    账户操作                          │
│  [导出我的数据]                                     │
│  [注销账户]                                         │
└────────────────────────────────────────────────────┘
```

---

### 2.12 关于页 (About)

**路由**：`/about`
**访问权限**：无需登录

#### 页面布局
```
┌────────────────────────────────────────────────────┐
│                    关于我们                          │
│  项目介绍、团队信息、联系方式等                       │
├────────────────────────────────────────────────────┤
│                    测试原理                          │
│  心理学依据、评分算法、科学性说明                     │
├────────────────────────────────────────────────────┤
│                    常见问题                          │
│  FAQ折叠面板                                         │
└────────────────────────────────────────────────────┘
```

---

## 3. 公共组件

### 3.1 Header（顶部导航栏）

**组件路径**：`src/components/common/Header.vue`

```vue
<template>
  <header class="header">
    <div class="logo">天赋测试</div>
    <nav class="nav-menu">
      <router-link to="/">首页</router-link>
      <router-link to="/test/intro" v-if="isLoggedIn">开始测试</router-link>
      <router-link to="/report/history" v-if="isLoggedIn">我的报告</router-link>
      <router-link to="/about">关于</router-link>
    </nav>
    <div class="user-area" v-if="isLoggedIn">
      <Dropdown>
        <template #trigger>
          <Avatar :src="user.avatar" />
          <span>{{ user.nickname }}</span>
        </template>
        <template #content>
          <DropdownItem to="/user/profile">个人中心</DropdownItem>
          <DropdownItem to="/user/settings">设置</DropdownItem>
          <DropdownItem divider />
          <DropdownItem @click="logout">退出登录</DropdownItem>
        </template>
      </Dropdown>
    </div>
    <div class="auth-buttons" v-else>
      <Button type="text" to="/auth/login">登录</Button>
      <Button type="primary" to="/auth/register">注册</Button>
    </div>
  </header>
</template>
```

---

### 3.2 Footer（页脚）

**组件路径**：`src/components/common/Footer.vue`

```vue
<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="copyright">
        © 2025 个人天赋测试系统. All rights reserved.
      </div>
      <div class="links">
        <a href="#">隐私政策</a>
        <a href="#">用户协议</a>
        <a href="#">联系我们</a>
      </div>
    </div>
  </footer>
</template>
```

---

### 3.3 ProgressBar（进度条）

**组件路径**：`src/components/test/ProgressBar.vue`

```vue
<template>
  <div class="progress-bar">
    <div class="progress-info">
      <span>{{ answered }}/{{ total }}</span>
      <span>{{ percentage }}%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  answered: number
  total: number
}

const props = defineProps<Props>()

const percentage = computed(() =>
  Math.round((props.answered / props.total) * 100)
)
</script>
```

---

### 3.4 QuestionCard（题目卡片）

**组件路径**：`src/components/test/QuestionCard.vue`

```vue
<template>
  <div class="question-card">
    <div class="question-header">
      <span class="question-number">Question {{ order }}</span>
    </div>
    <div class="question-text">{{ question.questionText }}</div>
    <div class="question-options">
      <div
        v-for="option in question.options"
        :key="option.value"
        class="option-item"
        :class="{ active: modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        <span class="option-radio">
          {{ modelValue === option.value ? '●' : '○' }}
        </span>
        <span class="option-label">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Question {
  _id: string
  questionText: string
  options: { value: number; label: string }[]
  order: number
}

interface Props {
  question: Question
  modelValue?: number
  order: number
}

defineProps<Props>()
defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
</script>
```

---

### 3.5 RadarChart（雷达图）

**组件路径**：`src/components/charts/RadarChart.vue`

```vue
<template>
  <div ref="chartRef" class="radar-chart" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: number[]
  categories: string[]
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px'
})

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)

  const option = {
    radar: {
      indicator: props.categories.map(name => ({ name, max: 100 })),
      splitArea: { areaStyle: { color: ['#f0f0f0', '#ffffff'] } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: props.data,
        areaStyle: { color: 'rgba(24, 144, 255, 0.2)' },
        lineStyle: { color: '#1890ff', width: 2 }
      }]
    }]
  }

  chart.setOption(option)
}

onMounted(initChart)

watch(() => [props.data, props.categories], initChart)
</script>
```

---

### 3.6 TrendChart（趋势图）

**组件路径**：`src/components/charts/TrendChart.vue`

```vue
<template>
  <div ref="chartRef" class="trend-chart" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

interface DataSeries {
  name: string
  data: number[]
  color: string
}

interface Props {
  dates: string[]
  series: DataSeries[]
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px'
})

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)

  const option = {
    xAxis: {
      type: 'category',
      data: props.dates
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100
    },
    legend: {
      data: props.series.map(s => s.name)
    },
    series: props.series.map(s => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: true,
      itemStyle: { color: s.color }
    }))
  }

  chart.setOption(option)
}

onMounted(initChart)
watch(() => [props.dates, props.series], initChart)
</script>
```

---

## 4. 路由守卫

### 4.1 认证守卫

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn

  // 需要登录的页面
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录用户访问登录页，跳转到首页
  if ((to.path === '/auth/login' || to.path === '/auth/register') && isLoggedIn) {
    next('/')
    return
  }

  // 测试中访问其他页面，提示
  const testStore = useTestStore()
  if (testStore.isInProgress && !to.path.startsWith('/test')) {
    // 显示确认对话框
    const confirm = window.confirm('测试正在进行中，确定要离开吗？')
    if (confirm) {
      testStore.abandonTest()
      next()
    } else {
      next(false)
    }
    return
  }

  next()
})
```

---

## 5. 响应式设计

### 5.1 断点设置

```css
/* 断点定义 */
$breakpoint-mobile: 375px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1366px;
$breakpoint-large: 1920px;

/* 媒体查询示例 */
@media (max-width: 768px) {
  /* 平板和手机样式 */
}

@media (max-width: 375px) {
  /* 手机样式 */
}
```

### 5.2 移动端适配

```
手机端布局调整：
- 导航栏折叠为汉堡菜单
- 图表自适应宽度
- 题目卡片单列显示
- 按钮增大点击区域
- 减少动画效果
```

---

## 6. 状态管理流程

### 6.1 用户认证流程

```typescript
// 登录流程
1. 用户提交登录表单
2. 调用 auth.login(email, password)
3. 保存 Token 到 localStorage
4. 更新 userStore 状态
5. 跳转到首页

// 退出流程
1. 调用 auth.logout()
2. 清除 localStorage
3. 重置 userStore 状态
4. 跳转到登录页
```

### 6.2 测试流程

```typescript
// 开始测试
1. 调用 test.startTest()
2. 初始化 testStore 状态
3. 跳转到答题页

// 答题流程
1. 用户选择答案
2. 更新 testStore.answers
3. 自动保存到 localStorage
4. 定期同步到服务器

// 完成测试
1. 调用 test.completeTest()
2. 提交所有答案到服务器
3. 等待报告生成
4. 跳转到报告页
```

---

## 7. 性能优化

### 7.1 代码分割

```typescript
// 路由懒加载
const Home = () => import('@/views/Home.vue')
const TestQuestions = () => import('@/views/Test/Questions.vue')
const ReportDetail = () => import('@/views/Report/Detail.vue')
```

### 7.2 组件缓存

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="TestQuestions">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

### 7.3 图片懒加载

```vue
<img v-lazy="imageUrl" alt="description" />
```

---

**文档版本**：v1.0
**创建日期**：2025-12-31
**更新日期**：2025-12-31
