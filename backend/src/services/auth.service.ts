import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User.model'
import { jwtConfig } from '../config/jwt'

// 注册用户
export interface RegisterData {
  email: string
  password: string
  nickname: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: IUser
  token: string
}

// 用户注册
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const { email, password, nickname } = data

  // 检查邮箱是否已存在
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error('该邮箱已被注册')
  }

  // 加密密码
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // 创建用户
  const user = await User.create({
    email,
    password: hashedPassword,
    nickname,
    profile: {},
    stats: {
      testCount: 0,
      totalScore: 0
    },
    status: 'active',
    role: 'user',
    emailVerified: false
  })

  // 生成Token
  const token = generateToken(user._id.toString())

  return {
    user,
    token
  }
}

// 用户登录
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const { email, password } = data

  // 查找用户（需要包含password字段）
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new Error('邮箱或密码错误')
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('邮箱或密码错误')
  }

  // 检查账户状态
  if (user.status === 'banned') {
    throw new Error('账户已被封禁')
  }

  if (user.status === 'inactive') {
    throw new Error('账户已被停用')
  }

  // 更新最后登录时间
  user.lastLoginAt = new Date()
  await user.save()

  // 生成Token
  const token = generateToken(user._id.toString())

  // 返回用户信息（排除密码）
  const userResponse = user.toObject() as any
  if (userResponse.password) {
    delete (userResponse as any).password
  }

  return {
    user: userResponse as IUser,
    token
  }
}

// 获取当前用户信息
export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('用户不存在')
  }
  return user
}

// 验证Token
export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret as string) as { userId: string }
    return decoded
  } catch (error) {
    throw new Error('Token无效或已过期')
  }
}

// 生成JWT Token
const generateToken = (userId: string): string => {
  const token = jwt.sign(
    { userId },
    jwtConfig.secret || 'your-secret-key',
    { expiresIn: jwtConfig.expiresIn || '7d' } as jwt.SignOptions
  )
  return token
}
