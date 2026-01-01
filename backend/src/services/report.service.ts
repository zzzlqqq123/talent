import Report, { IReport } from '../models/Report.model'
import Result from '../models/Result.model'
import User from '../models/User.model'
import * as scoreService from './score.service'

// 生成完整报告
export const generateReport = async (resultId: string): Promise<IReport> => {
  // 检查 resultId 是 MongoDB ObjectId 还是 UUID
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(resultId)

  let result

  if (isObjectId) {
    // 如果是 ObjectId，通过 _id 查找（不 populate userId，避免类型问题）
    result = await Result.findById(resultId)
  } else {
    // 如果是 UUID，通过 testId 查找（不 populate userId）
    result = await Result.findOne({ testId: resultId })
  }

  if (!result) {
    throw new Error('测试结果不存在')
  }

  if (result.status !== 'completed') {
    throw new Error('测试未完成，无法生成报告')
  }

  // 检查是否已生成报告
  const existingReport = await Report.findOne({ resultId: result._id })
  if (existingReport) {
    return existingReport
  }

  // 计算分数
  const scoreData = await scoreService.calculateTotalScore(result)

  // 生成分析内容
  const summary = generateSummary(scoreData)
  const strengths = generateStrengths(scoreData.dimensionScores)
  const weaknesses = generateWeaknesses(scoreData.dimensionScores)
  const suggestions = generateSuggestions(scoreData.talentType, scoreData.dimensionScores)

  // 生成图表数据
  const chartData = generateChartData(scoreData.dimensionScores)

  // 创建报告 - result.userId 已经是 ObjectId，不需要处理
  const report = await Report.create({
    userId: result.userId, // 这是 ObjectId，可以直接使用
    resultId: result._id,
    testId: result.testId,
    totalScore: scoreData.totalScore,
    dimensionScores: scoreData.dimensionScores.map(d => ({
      dimension: d.dimension,
      score: d.score,
      level: d.level,
      subScores: d.subDimensions || {}
    })),
    talentType: scoreData.talentType,
    talentLevel: scoreData.talentLevel,
    summary,
    strengths,
    weaknesses,
    suggestions,
    chartData,
    shareId: generateShareId(),
    isPublic: false
  })

  // 更新Result关联的reportId
  result.reportId = report._id as any
  await result.save()

  // 更新用户总分
  await User.findByIdAndUpdate(result.userId, {
    $set: { 'stats.totalScore': scoreData.totalScore }
  })

  return report
}

// 生成总结
const generateSummary = (scoreData: any): string => {
  const { totalScore, talentType, talentLevel } = scoreData
  const typeDesc = scoreService.getTalentTypeDescription(talentType)
  const levelDesc = scoreService.getLevelDescription(talentLevel)

  return `你的综合得分为${totalScore}分，整体水平为${levelDesc}。你的天赋类型是${typeDesc.name}。${typeDesc.description}通过本次测试，我们发现了你的独特优势和发展潜力。`
}

// 生成优势分析
const generateStrengths = (dimensionScores: scoreService.DimensionScore[]): string[] => {
  const strengths: string[] = []
  
  // 找出得分最高的维度
  const sortedScores = [...dimensionScores].sort((a, b) => b.score - a.score)
  const topDimensions = sortedScores.slice(0, 2)

  topDimensions.forEach(dim => {
    if (dim.score >= 70) {
      const strengthTexts: Record<string, string> = {
        '认知能力': `你在认知能力方面表现出色（${dim.score}分），具有优秀的逻辑思维、学习能力和分析能力。你能够快速理解复杂概念，善于发现问题的本质。`,
        '创造力': `你在创造力方面表现突出（${dim.score}分），富有想象力和创新精神。你善于提出新颖的想法，能够从不同角度思考问题。`,
        '情感智能': `你在情感智能方面表现优异（${dim.score}分），具有良好的情绪管理能力和同理心。你善于理解他人感受，能够建立良好的人际关系。`,
        '实践能力': `你在实践能力方面表现卓越（${dim.score}分），具有强大的执行力和问题解决能力。你善于将想法转化为行动，能够高效完成任务。`
      }
      strengths.push(strengthTexts[dim.dimension] || `${dim.dimension}是你的优势领域`)
    }
  })

  // 分析子维度优势
  dimensionScores.forEach(dim => {
    if (dim.subDimensions) {
      const topSubDim = Object.entries(dim.subDimensions)
        .sort(([, a], [, b]) => b - a)[0]
      
      if (topSubDim && topSubDim[1] >= 80) {
        strengths.push(`在${dim.dimension}中，你的${topSubDim[0]}特别突出（${topSubDim[1]}分），这是你的核心优势之一。`)
      }
    }
  })

  return strengths.length > 0 ? strengths : ['你在各方面都有一定的基础，继续努力会有更大提升。']
}

// 生成待提升分析
const generateWeaknesses = (dimensionScores: scoreService.DimensionScore[]): string[] => {
  const weaknesses: string[] = []
  
  // 找出得分较低的维度
  const sortedScores = [...dimensionScores].sort((a, b) => a.score - b.score)
  const lowDimensions = sortedScores.filter(d => d.score < 65)

  lowDimensions.forEach(dim => {
    const weaknessTexts: Record<string, string> = {
      '认知能力': `认知能力方面还有提升空间（${dim.score}分）。建议多进行逻辑思维训练，培养分析和解决问题的能力。`,
      '创造力': `创造力方面可以进一步发展（${dim.score}分）。建议多接触艺术、设计等创意领域，培养创新思维。`,
      '情感智能': `情感智能方面需要加强（${dim.score}分）。建议多关注自己和他人的情绪，提升人际交往能力。`,
      '实践能力': `实践能力方面有待提高（${dim.score}分）。建议制定明确的目标和计划，提升执行力和时间管理能力。`
    }
    weaknesses.push(weaknessTexts[dim.dimension] || `${dim.dimension}需要进一步发展`)
  })

  return weaknesses.length > 0 ? weaknesses : ['你在各方面都表现均衡，继续保持即可。']
}

// 生成发展建议
const generateSuggestions = (
  talentType: scoreService.TalentType,
  dimensionScores: scoreService.DimensionScore[]
): string[] => {
  const suggestions: string[] = []

  // 基于天赋类型的建议
  const typeSuggestions: Record<scoreService.TalentType, string[]> = {
    balanced: [
      '发挥你的全面优势，考虑从事需要综合能力的工作，如项目管理、产品经理等。',
      '继续保持各方面的均衡发展，同时可以选择一个方向进行深入专精。',
      '多参与跨领域的项目，这能让你的综合能力得到更好的发挥。'
    ],
    cognitive: [
      '充分发挥你的认知优势，考虑从事研究、分析、技术开发等工作。',
      '持续学习新知识和技能，保持你的认知优势。',
      '同时也要注意培养人际交往和实践能力，实现更全面的发展。'
    ],
    creative: [
      '发挥你的创造力，考虑从事设计、艺术、创意策划等工作。',
      '多尝试新事物，保持开放的心态，这能激发更多创意。',
      '学习将创意转化为实际成果的方法，提升执行力。'
    ],
    emotional: [
      '利用你的高情商，考虑从事人力资源、咨询、教育等工作。',
      '继续发展你的人际技能，这是你的核心竞争力。',
      '同时也要注意培养专业技能，实现软硬实力的结合。'
    ],
    practical: [
      '发挥你的执行力优势，考虑从事运营、销售、项目执行等工作。',
      '保持你的行动力，同时也要注意战略思考和创新。',
      '培养团队协作能力，这能让你的实践能力发挥更大作用。'
    ],
    'cognitive-creative': [
      '你兼具逻辑和创新能力，适合从事产品设计、技术创新等工作。',
      '继续发展你的复合优势，这是非常难得的能力组合。',
      '注意平衡理性思考和创意发散，找到最佳结合点。'
    ],
    'emotional-practical': [
      '你兼具人际技能和执行力，非常适合管理和领导工作。',
      '发展你的团队管理能力，这能让你的优势得到最大发挥。',
      '继续提升专业知识，成为既懂人又懂事的优秀管理者。'
    ]
  }

  suggestions.push(...(typeSuggestions[talentType] || []))

  // 基于具体分数的建议
  const avgScore = dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length
  if (avgScore >= 80) {
    suggestions.push('你的整体表现非常优秀，建议挑战更高难度的目标，实现更大的突破。')
  } else if (avgScore < 60) {
    suggestions.push('建议制定系统的提升计划，从最薄弱的环节开始改进，循序渐进地提升各项能力。')
  }

  return suggestions
}

// 生成图表数据
const generateChartData = (dimensionScores: scoreService.DimensionScore[]): any => {
  return {
    radar: {
      dimensions: dimensionScores.map(d => d.dimension),
      values: dimensionScores.map(d => d.score)
    },
    bar: dimensionScores.map(d => ({
      dimension: d.dimension,
      score: d.score,
      subScores: d.subDimensions || {}
    }))
  }
}

// 生成分享ID
const generateShareId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// 获取报告详情（不 populate，用于权限检查）
export const getReportByIdWithoutPopulate = async (reportId: string): Promise<IReport | null> => {
  return await Report.findById(reportId)
}

// 获取报告详情（带 populate）
export const getReportById = async (reportId: string): Promise<IReport | null> => {
  return await Report.findById(reportId)
    .populate('userId', 'nickname email avatar')
    .populate('resultId')
}

// 获取用户的报告列表
export const getUserReports = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ reports: IReport[]; total: number }> => {
  const skip = (page - 1) * limit

  const reports = await Report.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Report.countDocuments({ userId })

  return { reports, total }
}

// 通过分享ID获取报告
export const getReportByShareId = async (shareId: string): Promise<IReport | null> => {
  return await Report.findOne({ shareId, isPublic: true })
    .populate('userId', 'nickname avatar')
}

// 对比多个报告
export const compareReports = async (reportIds: string[]): Promise<any> => {
  const reports = await Report.find({ _id: { $in: reportIds } })
    .sort({ createdAt: 1 })

  if (reports.length === 0) {
    throw new Error('未找到报告')
  }

  // 提取对比数据
  const comparison = {
    reports: reports.map(r => ({
      id: r._id,
      date: r.createdAt,
      totalScore: r.totalScore,
      talentType: r.talentType,
      dimensionScores: r.dimensionScores
    })),
    trend: calculateTrend(reports)
  }

  return comparison
}

// 计算趋势
const calculateTrend = (reports: IReport[]): any => {
  if (reports.length < 2) {
    return null
  }

  const first = reports[0]
  const last = reports[reports.length - 1]

  const totalScoreChange = last.totalScore - first.totalScore
  
  const dimensionChanges = last.dimensionScores.map((lastDim, index) => {
    const firstDim = first.dimensionScores[index]
    return {
      dimension: lastDim.dimension,
      change: lastDim.score - firstDim.score
    }
  })

  return {
    totalScoreChange,
    dimensionChanges,
    direction: totalScoreChange > 0 ? 'up' : totalScoreChange < 0 ? 'down' : 'stable'
  }
}
