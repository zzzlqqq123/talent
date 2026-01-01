import { Router } from 'express'
import * as testController from '../controllers/test.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// 所有测试接口都需要认证
router.use(authMiddleware)

// 开始测试
router.post('/start', testController.startTest)

// 提交答案
router.post('/answer', testController.submitAnswer)

// 完成测试
router.post('/complete', testController.completeTest)

// 放弃测试
router.post('/abandon', testController.abandonTest)

// 获取测试进度
router.get('/progress/:testId', testController.getTestProgress)

// 获取测试详情
router.get('/detail/:testId', testController.getTestDetail)

// 获取用户测试历史
router.get('/history', testController.getUserTestHistory)

export default router
