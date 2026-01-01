import { v4 as uuidv4 } from 'uuid'
import Result, { IResult, IAnswer } from '../models/Result.model'
import Question from '../models/Question.model'
import mongoose from 'mongoose'

// 开始测试
export const startTest = async (userId: string, ipAddress?: string, userAgent?: string): Promise<IResult> => {
  try {
    // 生成唯一的测试ID
    const testId = uuidv4()
    
    // 创建测试记录
    const result = await Result.create({
      userId: new mongoose.Types.ObjectId(userId),
      testId,
      answers: [],
      startTime: new Date(),
      endTime: new Date(), // 初始化为当前时间，完成时更新
      totalDuration: 0,
      status: 'in_progress',
      ipAddress,
      userAgent
    })

    return result
  } catch (error) {
    console.error('创建测试记录失败:', error)
    throw new Error('开始测试失败')
  }
}

// 保存答案
export const saveAnswers = async (
  testId: string,
  answers: Array<{
    questionId: string
    answerValue: number
    duration?: number
  }>
): Promise<IResult | null> => {
  try {
    const result = await Result.findOne({ testId, status: 'in_progress' })
    
    if (!result) {
      throw new Error('测试记录不存在或已完成')
    }

    // 验证题目是否存在
    const questionIds = answers.map(a => new mongoose.Types.ObjectId(a.questionId))
    const validQuestions = await Question.find({ _id: { $in: questionIds } })
    
    if (validQuestions.length !== answers.length) {
      throw new Error('部分题目ID无效')
    }

    // 更新或添加答案
    for (const answer of answers) {
      const existingAnswerIndex = result.answers.findIndex(
        a => a.questionId.toString() === answer.questionId
      )

      const newAnswer: IAnswer = {
        questionId: new mongoose.Types.ObjectId(answer.questionId),
        answerValue: answer.answerValue,
        duration: answer.duration,
        timestamp: new Date()
      }

      if (existingAnswerIndex >= 0) {
        // 更新已存在的答案
        result.answers[existingAnswerIndex] = newAnswer
      } else {
        // 添加新答案
        result.answers.push(newAnswer)
      }
    }

    await result.save()
    return result
  } catch (error) {
    console.error('保存答案失败:', error)
    throw error
  }
}

// 完成测试
export const completeTest = async (testId: string, totalDuration: number): Promise<IResult | null> => {
  try {
    const result = await Result.findOne({ testId, status: 'in_progress' })
    
    if (!result) {
      throw new Error('测试记录不存在或已完成')
    }

    // 验证是否所有题目都已回答
    const totalQuestions = await Question.countDocuments({ active: true })
    
    if (result.answers.length < totalQuestions) {
      throw new Error(`请完成所有题目，当前已回答 ${result.answers.length}/${totalQuestions} 题`)
    }

    // 更新测试状态
    result.endTime = new Date()
    result.totalDuration = totalDuration
    result.status = 'completed'
    
    await result.save()

    // TODO: 触发报告生成
    // await generateReport(result._id)

    return result
  } catch (error) {
    console.error('完成测试失败:', error)
    throw error
  }
}

// 获取测试进度
export const getTestProgress = async (testId: string): Promise<{
  testId: string
  totalQuestions: number
  answeredQuestions: number
  progress: number
  status: string
  startTime: Date
  duration: number
} | null> => {
  try {
    const result = await Result.findOne({ testId })
    
    if (!result) {
      return null
    }

    const totalQuestions = await Question.countDocuments({ active: true })
    const answeredQuestions = result.answers.length
    const progress = Math.round((answeredQuestions / totalQuestions) * 100)
    const duration = result.status === 'completed'
      ? result.totalDuration
      : Date.now() - result.startTime.getTime()

    return {
      testId: result.testId,
      totalQuestions,
      answeredQuestions,
      progress,
      status: result.status,
      startTime: result.startTime,
      duration
    }
  } catch (error) {
    console.error('获取测试进度失败:', error)
    throw error
  }
}

// 放弃测试
export const abandonTest = async (testId: string): Promise<IResult | null> => {
  try {
    const result = await Result.findOne({ testId, status: 'in_progress' })
    
    if (!result) {
      throw new Error('测试记录不存在或已完成')
    }

    result.status = 'abandoned'
    result.endTime = new Date()
    result.totalDuration = Date.now() - result.startTime.getTime()
    
    await result.save()
    return result
  } catch (error) {
    console.error('放弃测试失败:', error)
    throw error
  }
}

// 获取用户的测试历史
export const getUserTestHistory = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  tests: any[]
  total: number
  page: number
  totalPages: number
}> => {
  try {
    const skip = (page - 1) * limit

    const tests = await Result.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Result.countDocuments({ userId })
    const totalPages = Math.ceil(total / limit)

    return {
      tests,
      total,
      page,
      totalPages
    }
  } catch (error) {
    console.error('获取测试历史失败:', error)
    throw error
  }
}

// 获取测试详情（包含题目信息）
export const getTestDetail = async (testId: string): Promise<any> => {
  try {
    const result = await Result.findOne({ testId })
      .populate('userId', 'nickname email')
      .lean()
    
    if (!result) {
      throw new Error('测试记录不存在')
    }

    // 获取所有题目信息
    const questionIds = result.answers.map(a => a.questionId)
    const questions = await Question.find({ _id: { $in: questionIds } }).lean()
    
    // 将题目信息合并到答案中
    const answersWithQuestions = result.answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId.toString())
      return {
        ...answer,
        question
      }
    })

    return {
      ...result,
      answers: answersWithQuestions
    }
  } catch (error) {
    console.error('获取测试详情失败:', error)
    throw error
  }
}
