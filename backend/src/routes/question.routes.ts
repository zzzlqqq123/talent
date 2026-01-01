import { Router } from 'express'
import * as questionController from '../controllers/question.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// 所有题目接口都需要认证
router.use(authMiddleware)

// 获取所有题目
router.get('/', questionController.getAllQuestions)

// 按维度获取题目
router.get('/dimension/:dimension', questionController.getQuestionsByDimension)

// 获取题目统计信息
router.get('/stats', questionController.getQuestionStats)

export default router

