import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt'
import { errorResponse } from '../utils/response'

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权，请先登录'))
      return
    }

    const decoded = jwt.verify(token, jwtConfig.secret) as { userId: string }
    req.userId = decoded.userId

    next()
  } catch (error) {
    res.status(401).json(errorResponse('TOKEN_EXPIRED', 'Token已过期'))
  }
}
