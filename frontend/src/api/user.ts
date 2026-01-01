import { get, put, post } from './request'

// 获取用户资料
export function getUserProfile() {
  return get('/user/profile')
}

// 更新用户资料
export function updateProfile(data: {
  nickname?: string
  avatar?: string
  profile?: {
    gender?: 'male' | 'female' | 'other'
    age?: number
    birthday?: string
    occupation?: string
    location?: string
  }
}) {
  return put('/user/profile', data)
}

// 修改密码
export function updatePassword(data: {
  oldPassword: string
  newPassword: string
}) {
  return put('/user/password', data)
}

// 获取用户统计数据
export function getUserStats() {
  return get('/user/stats')
}

// 获取用户活动历史
export function getUserActivity(params?: { limit?: number }) {
  return get('/user/activity', { params })
}

// 注销账户
export function deactivateAccount(data: { password: string }) {
  return post('/user/deactivate', data)
}
