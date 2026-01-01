import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 请求缓存
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 生成缓存键
function getCacheKey(config: AxiosRequestConfig): string {
  return `${config.method}_${config.url}_${JSON.stringify(config.params || {})}`
}

// 检查缓存是否有效
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 检查是否启用缓存（仅GET请求）
    if (config.method === 'get' && (config as any).useCache !== false) {
      const cacheKey = getCacheKey(config)
      const cached = requestCache.get(cacheKey)
      
      if (cached && isCacheValid(cached.timestamp)) {
        // 使用缓存数据
        return Promise.reject({
          _isCached: true,
          data: cached.data
        })
      }
    }
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 缓存GET请求的响应
    if (response.config.method === 'get' && (response.config as any).useCache !== false) {
      const cacheKey = getCacheKey(response.config)
      requestCache.set(cacheKey, {
        data: res,
        timestamp: Date.now()
      })
    }

    // 如果返回的成功状态为false，显示错误信息
    if (res.success === false) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error) => {
    // 处理缓存数据
    if (error._isCached) {
      return Promise.resolve(error.data)
    }

    console.error('Response error:', error)

    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          localStorage.removeItem('token')
          // 401错误时不进行任何跳转或刷新，避免清空表单
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          // 对于其他错误（包括登录失败），只显示错误信息，不刷新页面
          ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求失败，请稍后重试')
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, config)
}

export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.post(url, data, config)
}

export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put(url, data, config)
}

export function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, config)
}

// 清除所有缓存
export function clearCache(): void {
  requestCache.clear()
}

// 清除特定URL的缓存
export function clearCacheByUrl(url: string): void {
  const keysToDelete: string[] = []
  requestCache.forEach((_, key) => {
    if (key.includes(url)) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach(key => requestCache.delete(key))
}

export default service
