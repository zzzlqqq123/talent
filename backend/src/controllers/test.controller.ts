import { Request, Response } from 'express'
import * as testService from '../services/test.service'
import { successResponse, errorResponse } from '../utils/response'

// 扩展Request类型以包含用户信息
interface AuthRequest extends Request {
  userId?: string
}

// 将 ObjectId 转换为字符串的辅助函数
function convertToString(value: any): string {
  if (typeof value === 'string') return value
  if (value && typeof value.toString === 'function') return value.toString()
  return String(value)
}

// 开始测试
export const startTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const ipAddress = req.ip || req.socket.remoteAddress
    const userAgent = req.headers['user-agent']

    const result = await testService.startTest(userId, ipAddress, userAgent)

    res.status(201).json(
      successResponse(
        {
          testId: result.testId,
          startTime: result.startTime
        },
        '测试已开始'
      )
    )
  } catch (error) {
    console.error('开始测试失败:', error)
    if (error instanceof Error) {
      res.status(500).json(errorResponse('START_TEST_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 提交答案
export const submitAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId, answers } = req.body

    if (!testId || !answers || !Array.isArray(answers)) {
      res.status(400).json(errorResponse('INVALID_INPUT', '参数错误'))
      return
    }

    // 验证答案格式
    for (const answer of answers) {
      if (!answer.questionId || !answer.answerValue) {
        res.status(400).json(errorResponse('INVALID_INPUT', '答案格式错误'))
        return
      }
      
      if (answer.answerValue < 1 || answer.answerValue > 5) {
        res.status(400).json(errorResponse('INVALID_INPUT', '答案值必须在1-5之间'))
        return
      }
    }

    const result = await testService.saveAnswers(testId, answers)

    res.status(200).json(
      successResponse(
        {
          testId: result?.testId,
          answeredCount: result?.answers.length
        },
        '答案已保存'
      )
    )
  } catch (error) {
    console.error('提交答案失败:', error)
    if (error instanceof Error) {
      res.status(500).json(errorResponse('SUBMIT_ANSWER_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 完成测试
export const completeTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId, totalDuration } = req.body

    if (!testId || typeof totalDuration !== 'number') {
      res.status(400).json(errorResponse('INVALID_INPUT', '参数错误'))
      return
    }

    const result = await testService.completeTest(testId, totalDuration)

    res.status(200).json(
      successResponse(
        {
          testId: result?.testId,
          resultId: result?._id?.toString(),
          status: result?.status,
          answeredCount: result?.answers.length
        },
        '测试已完成'
      )
    )
  } catch (error) {
    console.error('完成测试失败:', error)
    if (error instanceof Error) {
      res.status(500).json(errorResponse('COMPLETE_TEST_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取测试进度
export const getTestProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params

    if (!testId) {
      res.status(400).json(errorResponse('INVALID_INPUT', '测试ID不能为空'))
      return
    }

    const progress = await testService.getTestProgress(testId)

    if (!progress) {
      res.status(404).json(errorResponse('NOT_FOUND', '测试记录不存在'))
      return
    }

    res.status(200).json(successResponse(progress, '获取进度成功'))
  } catch (error) {
    console.error('获取测试进度失败:', error)
    if (error instanceof Error) {
      res.status(500).json(errorResponse('GET_PROGRESS_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 放弃测试
export const abandonTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId
    const { testId } = req.body

    if (!testId) {
      res.status(400).json(errorResponse('INVALID_INPUT', '测试ID不能为空'))
      return
    }

    const result = await testService.abandonTest(testId)

    res.status(200).json(
      successResponse(
        {
          testId: result?.testId,
          status: result?.status
        },
        '测试已放弃'
      )
    )
  } catch (error) {
    console.error('放弃测试失败:', error)
    if (error instanceof Error) {
      res.status(500).json(errorResponse('ABANDON_TEST_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取用户测试历史
export const getUserTestHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await testService.getUserTestHistory(userId, page, limit)

    res.status(200).json(successResponse(result, '获取测试历史成功'))
  } catch (error) {
    console.error('获取测试历史失败:', error)
    if (error instanceof Error) {
      res.status(500).json(errorResponse('GET_HISTORY_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取测试详情
export const getTestDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params

    if (!testId) {
      res.status(400).json(errorResponse('INVALID_INPUT', '测试ID不能为空'))
      return
    }

    const detail = await testService.getTestDetail(testId)

    res.status(200).json(successResponse(detail, '获取测试详情成功'))
  } catch (error) {
    console.error('获取测试详情失败:', error)
    if (error instanceof Error) {
      res.status(500).json(errorResponse('GET_DETAIL_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}
