import { Request, Response } from 'express'
import * as questionService from '../services/question.service'
import { successResponse, errorResponse } from '../utils/response'

// 获取所有题目
export const getAllQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const questions = await questionService.getAllQuestions()
    
    res.status(200).json(
      successResponse({ questions, total: questions.length }, '获取题目成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 按维度获取题目
export const getQuestionsByDimension = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dimension } = req.params
    const questions = await questionService.getQuestionsByDimension(dimension)
    
    res.status(200).json(
      successResponse({ questions, total: questions.length }, '获取题目成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取题目统计信息
export const getQuestionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await questionService.getQuestionCount()
    const countByDimension = await questionService.getQuestionCountByDimension()
    
    res.status(200).json(
      successResponse({ 
        total, 
        byDimension: countByDimension 
      }, '获取统计信息成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

