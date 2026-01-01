import User, { IUser } from '../models/User.model'
import Report from '../models/Report.model'
import Result from '../models/Result.model'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// 获取用户资料
export const getUserProfile = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById(userId).select('-password')
  return user
}

// 更新用户资料
export const updateProfile = async (
  userId: string,
  profileData: {
    nickname?: string
    avatar?: string
    profile?: {
      gender?: 'male' | 'female' | 'other'
      age?: number
      birthday?: Date
      occupation?: string
      location?: string
    }
  }
): Promise<IUser | null> => {
  const user = await User.findById(userId)
  
  if (!user) {
    throw new Error('用户不存在')
  }

  // 更新昵称
  if (profileData.nickname) {
    user.nickname = profileData.nickname
  }

  // 更新头像
  if (profileData.avatar) {
    user.avatar = profileData.avatar
  }

  // 更新个人信息
  if (profileData.profile) {
    user.profile = {
      ...user.profile,
      ...profileData.profile
    } as any
  }

  await user.save()
  
  // 返回时排除密码字段
  const savedUser = await User.findById(userId).select('-password')
  return savedUser
}

// 修改密码
export const updatePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId).select('+password')
  
  if (!user) {
    throw new Error('用户不存在')
  }

  // 验证旧密码
  const isMatch = await bcrypt.compare(oldPassword, (user as any).password)
  if (!isMatch) {
    throw new Error('原密码错误')
  }

  // 加密新密码
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt)
  
  await user.save()
}

// 获取用户统计数据
export const getUserStats = async (userId: string) => {
  // 测试次数
  const testCount = await Result.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'completed'
  })

  // 最近一次测试时间
  const lastTest = await Result.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'completed'
  }).sort({ createdAt: -1 })

  // 获取所有报告的分数
  const reports = await Report.find({ userId: new mongoose.Types.ObjectId(userId) })
    .select('totalScore talentType createdAt') as any[]

  // 计算平均分
  const totalScore = reports.reduce((sum, report) => sum + report.totalScore, 0)
  const averageScore = reports.length > 0 ? Math.round(totalScore / reports.length) : 0

  // 最高分
  const highestScore = reports.length > 0
    ? Math.max(...reports.map((r) => r.totalScore))
    : 0

  // 最低分
  const lowestScore = reports.length > 0
    ? Math.min(...reports.map((r) => r.totalScore))
    : 0

  // 进步趋势
  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (reports.length >= 2) {
    const sortedReports = reports.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    const firstScore = sortedReports[0].totalScore
    const lastScore = sortedReports[sortedReports.length - 1].totalScore

    if (lastScore > firstScore + 5) {
      trend = 'up'
    } else if (lastScore < firstScore - 5) {
      trend = 'down'
    }
  }

  // 更新用户统计信息
  await User.findByIdAndUpdate(userId, {
    'stats.testCount': testCount,
    'stats.lastTestDate': lastTest?.createdAt,
    'stats.totalScore': averageScore
  } as any)

  return {
    testCount,
    lastTestDate: lastTest?.createdAt,
    averageScore,
    highestScore,
    lowestScore,
    trend,
    reportCount: reports.length
  }
}

// 获取用户活动历史
export const getUserActivity = async (
  userId: string,
  limit: number = 10
) => {
  const activities: Array<{
    type: 'test' | 'report'
    date: Date
    data: any
  }> = []

  // 获取最近的测试记录
  const tests = await Result.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('testId status createdAt endTime') as any[]

  tests.forEach((test) => {
    activities.push({
      type: 'test',
      date: test.createdAt,
      data: {
        testId: test.testId,
        status: test.status,
        duration: test.endTime
          ? Math.round((new Date(test.endTime).getTime() - test.createdAt.getTime()) / 1000 / 60)
          : 0
      }
    })
  })

  // 获取最近的报告记录
  const reports = await Report.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('totalScore talentType createdAt') as any[]

  reports.forEach((report) => {
    activities.push({
      type: 'report',
      date: report.createdAt,
      data: {
        totalScore: report.totalScore,
        talentType: report.talentType
      }
    })
  })

  // 按日期排序
  activities.sort((a, b) => b.date.getTime() - a.date.getTime())

  return activities.slice(0, limit)
}

// 删除用户账户（软删除）
export const deactivateUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    status: 'inactive'
  })
}

// 验证邮箱是否已存在
export const checkEmailExists = async (email: string, excludeUserId?: string): Promise<boolean> => {
  const query: any = { email }
  if (excludeUserId) {
    query._id = { $ne: excludeUserId }
  }
  
  const user = await User.findOne(query)
  return !!user
}
