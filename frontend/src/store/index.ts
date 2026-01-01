import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出各个store模块
export * from './modules/user'
export * from './modules/test'
export * from './modules/report'
