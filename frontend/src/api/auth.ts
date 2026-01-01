import { get, post } from './request'

// 用户注册
export function register(data: {
  email: string
  password: string
  nickname: string
  gender?: string
  age?: number
}) {
  return post('/auth/register', data)
}

// 用户登录
export function login(data: { email: string; password: string }) {
  return post('/auth/login', data)
}

// 获取当前用户信息
export function getCurrentUser() {
  return get('/auth/me')
}

// 刷新Token
export function refreshToken() {
  return post('/auth/refresh')
}
