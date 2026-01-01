import mongoose from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'
import Question from '../models/Question.model'

// 加载环境变量
config()

// 数据库连接
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/talent-test'
    await mongoose.connect(mongoUri)
    console.log('✅ MongoDB连接成功')
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error)
    process.exit(1)
  }
}

// 导入题目数据
const importQuestions = async () => {
  try {
    // 读取JSON文件
    const dataPath = path.join(__dirname, '../data/questions.json')
    
    if (!fs.existsSync(dataPath)) {
      console.error('❌ 题目数据文件不存在:', dataPath)
      process.exit(1)
    }

    const jsonData = fs.readFileSync(dataPath, 'utf-8')
    const questions = JSON.parse(jsonData)

    console.log(`📝 准备导入 ${questions.length} 道题目...`)

    // 清空现有题目
    await Question.deleteMany({})
    console.log('🗑️  已清空现有题目')

    // 批量插入
    const result = await Question.insertMany(questions)
    console.log(`✅ 成功导入 ${result.length} 道题目`)

    // 统计各维度题目数量
    const stats = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])

    console.log('\n📊 题目统计:')
    stats.forEach(stat => {
      const categoryNames: Record<string, string> = {
        cognitive: '认知能力',
        creativity: '创造力',
        emotional: '情感智能',
        practical: '实践能力'
      }
      console.log(`  ${categoryNames[stat._id]}: ${stat.count} 题`)
    })

    console.log('\n✅ 数据导入完成！')
  } catch (error) {
    console.error('❌ 导入失败:', error)
    process.exit(1)
  }
}

// 执行导入
const run = async () => {
  await connectDB()
  await importQuestions()
  await mongoose.connection.close()
  console.log('👋 数据库连接已关闭')
  process.exit(0)
}

run()

