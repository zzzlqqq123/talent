import { Router } from 'express'
import * as reportController from '../controllers/report.controller'
import { generateReportValidator, compareReportsValidator } from '../validators/report.validator'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// 通过分享ID获取报告（无需认证）- 必须放在 :reportId 之前
router.get('/share/:shareId', reportController.getReportByShareId)

// 所有报告接口都需要认证（除了分享接口）
router.use(authMiddleware)

// 生成报告
router.post('/generate', generateReportValidator, reportController.generateReport)

// 获取用户报告列表
router.get('/list', reportController.getUserReports)

// 对比报告
router.post('/compare', compareReportsValidator, reportController.compareReports)

// 获取报告详情
router.get('/:reportId', reportController.getReportDetail)

// 设置报告公开状态
router.put('/:reportId/public', reportController.setReportPublic)

export default router
