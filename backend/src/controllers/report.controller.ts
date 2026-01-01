import { Response } from 'express'
import { validationResult } from 'express-validator'
import * as reportService from '../services/report.service'
import { successResponse, errorResponse } from '../utils/response'
import { AuthRequest } from '../middlewares/auth.middleware'

// 生成报告
export const generateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json(
        errorResponse('VALIDATION_ERROR', '参数验证失败', errors.array())
      )
      return
    }

    if (!req.userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const { resultId } = req.body

    const report = await reportService.generateReport(resultId)
    
    res.status(200).json(
      successResponse({ report }, '报告生成成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('GENERATE_REPORT_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取报告详情
export const getReportDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const { reportId } = req.params
    const requestUserId = req.userId

    // 获取报告（不 populate userId，避免类型问题）
    const report = await reportService.getReportByIdWithoutPopulate(reportId)

    if (!report) {
      res.status(404).json(errorResponse('REPORT_NOT_FOUND', '报告不存在'))
      return
    }

    // 检查权限
    const reportUserId = report.userId ? report.userId.toString() : 'undefined'

    if (reportUserId !== requestUserId && !report.isPublic) {
      res.status(403).json(errorResponse('FORBIDDEN', '无权访问该报告'))
      return
    }

    res.status(200).json(
      successResponse({ report }, '获取报告成功')
    )
  } catch (error) {
    console.error('获取报告详情错误:', error)
    if (error instanceof Error) {
      res.status(400).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 获取用户报告列表
export const getUserReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await reportService.getUserReports(req.userId, page, limit)
    
    res.status(200).json(
      successResponse(result, '获取报告列表成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 通过分享ID获取报告
export const getReportByShareId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shareId } = req.params

    const report = await reportService.getReportByShareId(shareId)
    
    if (!report) {
      res.status(404).json(errorResponse('REPORT_NOT_FOUND', '报告不存在或未公开'))
      return
    }

    // 增加浏览次数
    report.viewCount += 1
    await report.save()

    res.status(200).json(
      successResponse({ report }, '获取报告成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('FETCH_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 对比报告
export const compareReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json(
        errorResponse('VALIDATION_ERROR', '参数验证失败', errors.array())
      )
      return
    }

    if (!req.userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const { reportIds } = req.body

    const comparison = await reportService.compareReports(reportIds)
    
    res.status(200).json(
      successResponse({ comparison }, '对比成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('COMPARE_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}

// 设置报告公开状态
export const setReportPublic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json(errorResponse('UNAUTHORIZED', '未授权'))
      return
    }

    const { reportId } = req.params
    const { isPublic } = req.body

    const report = await reportService.getReportById(reportId)
    
    if (!report) {
      res.status(404).json(errorResponse('REPORT_NOT_FOUND', '报告不存在'))
      return
    }

    // 检查权限
    if (report.userId.toString() !== req.userId) {
      res.status(403).json(errorResponse('FORBIDDEN', '无权修改该报告'))
      return
    }

    report.isPublic = isPublic
    await report.save()

    res.status(200).json(
      successResponse({ report }, '设置成功')
    )
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(errorResponse('UPDATE_FAILED', error.message))
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', '服务器内部错误'))
    }
  }
}
