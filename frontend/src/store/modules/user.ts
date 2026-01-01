import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentUser } from '@/api/auth'
import { ElMessage } from 'element-plus'

export interface UserInfo {
  _id: string
  email: string
  nickname: string
  avatar?: string
  role: string
  status: string
  stats?: {
    testCount: number
    lastTestDate?: string
    totalScore: number
  }
  profile?: {
    gender?: string
    age?: number
    birthday?: string
    occupation?: string
    location?: string
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  // 设置token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const res = await getCurrentUser()
      if (res.success && res.data.user) {
        userInfo.value = res.data.user
        return res.data.user
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // Token过期或无效，清除登录状态
      handleTokenExpired()
      throw error
    }
  }

  // 处理Token过期
  function handleTokenExpired() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    ElMessage.warning('登录已过期，请重新登录')
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  // 初始化用户信息（在应用启动时调用）
  async function initUserInfo() {
    if (token.value) {
      try {
        await fetchUserInfo()
      } catch (error) {
        // 静默失败，已在fetchUserInfo中处理
      }
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    fetchUserInfo,
    handleTokenExpired,
    logout,
    initUserInfo
  }
})
