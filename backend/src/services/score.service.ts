import Question, { IQuestion } from '../models/Question.model'
import { IResult } from '../models/Result.model'

// 维度分数接口
export interface DimensionScore {
  dimension: string
  score: number
  maxScore: number
  percentage: number
  level: string
  subDimensions?: Record<string, number>
}

// 天赋类型
export type TalentType = 
  | 'balanced' // 均衡型
  | 'cognitive' // 认知主导型
  | 'creative' // 创造主导型
  | 'emotional' // 情感主导型
  | 'practical' // 实践主导型
  | 'cognitive-creative' // 认知-创造型
  | 'emotional-practical' // 情感-实践型

// 天赋等级
export type TalentLevel = 'excellent' | 'good' | 'average' | 'developing'

// 计算单个维度分数
export const calculateDimensionScore = async (
  category: string,
  answers: Map<string, number>
): Promise<DimensionScore> => {
  // 获取该维度的所有题目
  const questions = await Question.find({ category, isActive: true })
  
  if (questions.length === 0) {
    throw new Error(`未找到${category}维度的题目`)
  }

  let totalScore = 0
  const subDimensionScores: Record<string, { total: number; count: number }> = {}

  questions.forEach(question => {
    const answer = answers.get(question._id.toString())
    if (answer !== undefined) {
      // 处理逆向题
      const score = question.isReverse ? (6 - answer) : answer
      totalScore += score

      // 统计子维度分数
      if (question.subDimension) {
        if (!subDimensionScores[question.subDimension]) {
          subDimensionScores[question.subDimension] = { total: 0, count: 0 }
        }
        subDimensionScores[question.subDimension].total += score
        subDimensionScores[question.subDimension].count += 1
      }
    }
  })

  // 计算标准化分数 (转换为100分制)
  const averageScore = totalScore / questions.length
  const normalizedScore = (averageScore / 5) * 100

  // 计算子维度平均分
  const subDimensions: Record<string, number> = {}
  Object.keys(subDimensionScores).forEach(subDim => {
    const { total, count } = subDimensionScores[subDim]
    subDimensions[subDim] = Math.round((total / count / 5) * 100)
  })

  // 确定等级
  const level = getTalentLevel(normalizedScore)

  return {
    dimension: getCategoryName(category),
    score: Math.round(normalizedScore),
    maxScore: 100,
    percentage: Math.round(normalizedScore),
    level,
    subDimensions
  }
}

// 计算总分和所有维度分数
export const calculateTotalScore = async (
  result: IResult
): Promise<{
  totalScore: number
  dimensionScores: DimensionScore[]
  talentType: TalentType
  talentLevel: TalentLevel
}> => {
  // 将答案转换为Map便于查找
  const answersMap = new Map<string, number>()
  result.answers.forEach(answer => {
    answersMap.set(answer.questionId.toString(), answer.answerValue)
  })

  // 计算四大维度分数
  const categories = ['cognitive', 'creativity', 'emotional', 'practical']
  const dimensionScores: DimensionScore[] = []

  for (const category of categories) {
    const score = await calculateDimensionScore(category, answersMap)
    dimensionScores.push(score)
  }

  // 计算总分 (四个维度的平均分)
  const totalScore = Math.round(
    dimensionScores.reduce((sum, dim) => sum + dim.score, 0) / dimensionScores.length
  )

  // 判定天赋类型
  const talentType = determineTalentType(dimensionScores)

  // 判定总体等级
  const talentLevel = getTalentLevel(totalScore)

  return {
    totalScore,
    dimensionScores,
    talentType,
    talentLevel
  }
}

// 判定天赋类型
export const determineTalentType = (dimensionScores: DimensionScore[]): TalentType => {
  const scores = dimensionScores.map(d => d.score)
  const maxScore = Math.max(...scores)
  const minScore = Math.min(...scores)
  const diff = maxScore - minScore

  // 如果各维度差异小于15分，认为是均衡型
  if (diff < 15) {
    return 'balanced'
  }

  // 找出最高的两个维度
  const sortedDimensions = [...dimensionScores].sort((a, b) => b.score - a.score)
  const top1 = sortedDimensions[0]
  const top2 = sortedDimensions[1]

  // 如果最高分和第二高分差距小于10分，认为是复合型
  if (top1.score - top2.score < 10) {
    const categories = [top1.dimension, top2.dimension].sort()
    if (categories.includes('认知能力') && categories.includes('创造力')) {
      return 'cognitive-creative'
    }
    if (categories.includes('情感智能') && categories.includes('实践能力')) {
      return 'emotional-practical'
    }
  }

  // 单一主导型
  const categoryMap: Record<string, TalentType> = {
    '认知能力': 'cognitive',
    '创造力': 'creative',
    '情感智能': 'emotional',
    '实践能力': 'practical'
  }

  return categoryMap[top1.dimension] || 'balanced'
}

// 获取天赋等级
export const getTalentLevel = (score: number): TalentLevel => {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 55) return 'average'
  return 'developing'
}

// 获取等级描述
export const getLevelDescription = (level: TalentLevel): string => {
  const descriptions: Record<TalentLevel, string> = {
    excellent: '优秀',
    good: '良好',
    average: '中等',
    developing: '发展中'
  }
  return descriptions[level]
}

// 获取维度中文名
const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    cognitive: '认知能力',
    creativity: '创造力',
    emotional: '情感智能',
    practical: '实践能力'
  }
  return names[category] || category
}

// 获取天赋类型描述
export const getTalentTypeDescription = (type: TalentType): { name: string; description: string } => {
  const descriptions: Record<TalentType, { name: string; description: string }> = {
    balanced: {
      name: '均衡发展型',
      description: '你在各个维度都表现均衡，具有全面发展的潜力，适合需要综合能力的工作。'
    },
    cognitive: {
      name: '认知主导型',
      description: '你具有出色的逻辑思维和学习能力，擅长分析和解决复杂问题。'
    },
    creative: {
      name: '创造主导型',
      description: '你富有创新精神和想象力，善于提出新颖的想法和解决方案。'
    },
    emotional: {
      name: '情感主导型',
      description: '你具有高情商和同理心，擅长人际交往和情绪管理。'
    },
    practical: {
      name: '实践主导型',
      description: '你具有强大的执行力和实践能力，善于将想法转化为行动。'
    },
    'cognitive-creative': {
      name: '认知-创造复合型',
      description: '你兼具逻辑思维和创新能力，既能深入分析又能创新突破。'
    },
    'emotional-practical': {
      name: '情感-实践复合型',
      description: '你既有良好的人际技能，又具备强大的执行力，适合管理和领导工作。'
    }
  }
  return descriptions[type]
}
