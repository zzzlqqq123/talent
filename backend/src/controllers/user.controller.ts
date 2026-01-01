import { Request, Response } from 'express'
import * as userService from '../services/user.service'
import { successResponse, errorResponse } from '../utils/response'
import mongoose from 'mongoose'
import { AuthRequest } from '../middlewares/auth.middleware'

// 获取用户资料
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未登录'))
      return
    }

    const user = await userService.getUserProfile(userId)

    if (!user) {
      res.status(404).json(errorResponse('NOT_FOUND', '用户不存在'))
      return
    }

    res.status(200).json(
      successResponse({ user }, '获取用户资料成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 更新用户资料
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未登录'))
      return
    }

    const { nickname, avatar, profile } = req.body

    const user = await userService.updateProfile(
      userId,
      { nickname, avatar, profile }
    )

    res.status(200).json(
      successResponse({ user }, '更新资料成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('UPDATE_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 修改密码
export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未登录'))
      return
    }

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      res.status(400).json(errorResponse('MISSING_PARAMS', '缺少必要参数'))
      return
    }

    if (newPassword.length < 6) {
      res.status(400).json(errorResponse('INVALID_PASSWORD', '新密码长度至少6位'))
      return
    }

    await userService.updatePassword(
      userId,
      oldPassword,
      newPassword
    )

    res.status(200).json(
      successResponse(null, '密码修改成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === '原密码错误') {
        res.status(400).json(errorResponse('WRONG_PASSWORD', error.message))
      } else {
        res.status(400).json(errorResponse('UPDATE_FAILED', error.message))
      }
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取用户统计数据
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未登录'))
      return
    }

    const stats = await userService.getUserStats(userId)

    res.status(200).json(
      successResponse({ stats }, '获取统计数据成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取用户活动历史
export const getUserActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未登录'))
      return
    }

    const limit = parseInt(req.query.limit as string) || 10

    const activities = await userService.getUserActivity(
      userId,
      limit
    )

    res.status(200).json(
      successResponse({ activities }, '获取活动历史成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 注销账户
export const deactivateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未登录'))
      return
    }

    const { password } = req.body

    if (!password) {
      res.status(400).json(errorResponse('MISSING_PARAMS', '请输入密码确认'))
      return
    }

    // 这里可以添加密码验证逻辑

    await userService.deactivateUser(userId)

    res.status(200).json(
      successResponse(null, '账户已注销')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('DEACTIVATE_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}
