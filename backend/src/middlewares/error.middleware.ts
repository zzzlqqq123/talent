import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import { errorResponse } from '../utils/response'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', err)

  res.status(500).json(
    errorResponse('SERVER_ERROR', '服务器内部错误', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  )
}
