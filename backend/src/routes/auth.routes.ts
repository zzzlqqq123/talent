import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { registerValidator, loginValidator } from '../validators/auth.validator'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// 注册
router.post('/register', registerValidator, authController.register)

// 登录
router.post('/login', loginValidator, authController.login)

// 获取当前用户信息（需要认证）
router.get('/me', authMiddleware, authController.getCurrentUser)

export default router
