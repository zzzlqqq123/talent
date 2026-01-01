
import { Question } from './types';

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "在处理复杂问题时，你通常倾向于？",
    category: "Analytical",
    options: [
      { label: "拆解成逻辑小块，逐步分析", value: 5 },
      { label: "寻找过往类似经验进行对比", value: 3 },
      { label: "依靠直觉并尝试不同的方案", value: 2 },
      { label: "咨询他人的意见和建议", value: 1 }
    ]
  },
  {
    id: 2,
    text: "如果你面前有一台复杂的、从未见过的机器，你会？",
    category: "Practical",
    options: [
      { label: "立刻动手拆解研究内部结构", value: 5 },
      { label: "先仔细阅读说明书和原理图", value: 4 },
      { label: "观察别人是如何操作的", value: 2 },
      { label: "想办法找个专家来演示", value: 1 }
    ]
  },
  {
    id: 3,
    text: "当你听到一段动听的旋律或看到一件精美的艺术品时？",
    category: "Creative",
    options: [
      { label: "脑海中立刻浮现出相关的画面或故事", value: 5 },
      { label: "试图分析其节奏、结构或构图", value: 3 },
      { label: "纯粹享受那一刻的情感波动", value: 4 },
      { label: "想尝试自己也创作类似的作品", value: 2 }
    ]
  },
  {
    id: 4,
    text: "在社交场合中，你更擅长？",
    category: "Interpersonal",
    options: [
      { label: "洞察他人的情绪变化并给予安慰", value: 5 },
      { label: "清晰地表达自己的观点并说服他人", value: 4 },
      { label: "组织大家参与集体活动", value: 3 },
      { label: "作为一个耐心的倾听者", value: 2 }
    ]
  },
  {
    id: 5,
    text: "面对突如其来的计划变动，你的第一反应是？",
    category: "Adaptability",
    options: [
      { label: "迅速调整心态寻找新的备选方案", value: 5 },
      { label: "虽然感到不悦，但能配合新的安排", value: 3 },
      { label: "试图寻找理由坚持原定计划", value: 1 },
      { label: "感到迷茫，需要时间缓冲", value: 2 }
    ]
  },
  {
    id: 6,
    text: "你是否经常会对事物的运行原理感到好奇？",
    category: "Inquisitiveness",
    options: [
      { label: "总是如此，停不下来的思考", value: 5 },
      { label: "偶尔会去深入钻研感兴趣的领域", value: 3 },
      { label: "只在必要时才去了解", value: 1 },
      { label: "更在乎结果，而非原理", value: 0 }
    ]
  },
  {
    id: 7,
    text: "当你沉浸在某项任务中时，你通常会？",
    category: "Focus",
    options: [
      { label: "完全忘记时间的流逝，进入‘心流’状态", value: 5 },
      { label: "效率很高，但会被突发情况打断", value: 3 },
      { label: "需要刻意提醒才能保持专注", value: 2 },
      { label: "经常分心去处理其他事情", value: 1 }
    ]
  },
  {
    id: 8,
    text: "在团队协作中，你最喜欢的角色是？",
    category: "Leadership",
    options: [
      { label: "制定愿景并激励大家共同前进", value: 5 },
      { label: "负责具体的执行和细节把控", value: 2 },
      { label: "协调人际关系，化解矛盾", value: 4 },
      { label: "收集整理各类关键信息", value: 3 }
    ]
  }
];
