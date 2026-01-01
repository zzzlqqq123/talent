import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { appConfig } from './config/app'
import { errorHandler } from './middlewares/error.middleware'
import { logger } from './utils/logger'
import authRoutes from './routes/auth.routes'
import questionRoutes from './routes/question.routes'
import reportRoutes from './routes/report.routes'
import userRoutes from './routes/user.routes'
import testRoutes from './routes/test.routes'

const app: Application = express()

// 中间件
app.use(helmet())
app.use(cors({
  origin: appConfig.corsOrigin,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/user', userRoutes)
app.use('/api/test', testRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理
app.use(errorHandler)

export default app
