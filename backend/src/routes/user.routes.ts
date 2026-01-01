import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// 所有用户路由都需要认证
router.use(authMiddleware)

// 获取用户资料
router.get('/profile', userController.getUserProfile)

// 更新用户资料
router.put('/profile', userController.updateUserProfile)

// 修改密码
router.put('/password', userController.updatePassword)

// 获取用户统计数据
router.get('/stats', userController.getUserStats)

// 获取用户活动历史
router.get('/activity', userController.getUserActivity)

// 注销账户
router.post('/deactivate', userController.deactivateAccount)

export default router
