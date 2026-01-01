import Question, { IQuestion } from '../models/Question.model'

// 获取所有题目
export const getAllQuestions = async (): Promise<IQuestion[]> => {
  const questions = await Question.find({ isActive: true }).sort({ order: 1 })
  return questions
}

// 按类别获取题目
export const getQuestionsByCategory = async (category: string): Promise<IQuestion[]> => {
  const questions = await Question.find({
    category,
    isActive: true
  }).sort({ order: 1 })
  return questions
}

// 按维度获取题目
export const getQuestionsByDimension = async (dimension: string): Promise<IQuestion[]> => {
  const questions = await Question.find({
    dimension,
    isActive: true
  }).sort({ order: 1 })
  return questions
}

// 随机获取题目（用于测试）
export const getRandomQuestions = async (limit?: number): Promise<IQuestion[]> => {
  const pipeline: any[] = [
    { $match: { isActive: true } },
    { $sample: { size: limit || 65 } }
  ]

  const questions = await Question.aggregate(pipeline)
  return questions
}

// 获取题目总数
export const getQuestionCount = async (): Promise<number> => {
  return await Question.countDocuments({ isActive: true })
}

// 按维度统计题目数量
export const getQuestionCountByDimension = async (): Promise<Record<string, number>> => {
  const result = await Question.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ])

  const countMap: Record<string, number> = {}
  result.forEach(item => {
    countMap[item._id] = item.count
  })

  return countMap
}

// 创建题目（批量导入用）
export const createQuestions = async (questions: any[]): Promise<void> => {
  await Question.insertMany(questions)
}

// 清空所有题目（重新导入前使用）
export const clearAllQuestions = async (): Promise<void> => {
  await Question.deleteMany({})
}

