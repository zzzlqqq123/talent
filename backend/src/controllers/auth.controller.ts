import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as authService from '../services/auth.service'
import { successResponse, errorResponse } from '../utils/response'
import { AuthRequest } from '../middlewares/auth.middleware'

// 用户注册
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 验证请求参数
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json(
        errorResponse('VALIDATION_ERROR', '参数验证失败', errors.array())
      )
      return
    }

    const { email, password, nickname } = req.body
    const result = await authService.register({ email, password, nickname })

    res.status(201).json(
      successResponse(result, '注册成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('REGISTER_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 用户登录
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 验证请求参数
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json(
        errorResponse('VALIDATION_ERROR', '参数验证失败', errors.array())
      )
      return
    }

    const { email, password } = req.body
    const result = await authService.login({ email, password })

    res.status(200).json(
      successResponse(result, '登录成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      // 登录失败返回400而不是401，避免触发前端的"未授权"提示
      res.status(400).json(errorResponse('LOGIN_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取当前用户信息
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const user = await authService.getCurrentUser(req.userId)
    res.status(200).json(
      successResponse({ user }, '获取用户信息成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json(errorResponse('USER_NOT_FOUND', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

