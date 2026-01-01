export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: any
  }
}

export const successResponse = <T>(data: T, message = '操作成功'): ApiResponse<T> => {
  return {
    success: true,
    message,
    data
  }
}

export const errorResponse = (code: string, message: string, details?: any): ApiResponse => {
  return {
    success: false,
    message,
    error: {
      code,
      details
    }
  }
}
