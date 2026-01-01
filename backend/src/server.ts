import app from './app'
import { connectDatabase } from './config/database'
import { appConfig } from './config/app'
import { logger } from './utils/logger'

async function startServer() {
  try {
    // 连接数据库
    await connectDatabase()

    // 启动服务器
    app.listen(appConfig.port, () => {
      logger.info(`Server is running on port ${appConfig.port}`)
      logger.info(`Environment: ${appConfig.nodeEnv}`)
      logger.info(`API Base URL: http://localhost:${appConfig.port}/api`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
