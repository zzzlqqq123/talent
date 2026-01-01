import { get, post, del } from './request'

// 生成报告
export function generateReport(data: { resultId: string }) {
  return post('/report/generate', data)
}

// 获取报告详情
export function getReportDetail(reportId: string) {
  return get(`/report/${reportId}`)
}

// 获取报告列表
export function getReportList(params?: { page?: number; limit?: number }) {
  return get('/report/list', { params })
}

// 获取报告对比数据
export function compareReports(data: { reportIds: string[] }) {
  return post('/report/compare', data)
}

// 生成分享链接
export function createShareLink(reportId: string) {
  return post(`/report/${reportId}/share`)
}

// 取消分享
export function cancelShare(reportId: string) {
  return del(`/report/${reportId}/share`)
}

// 通过分享ID获取报告
export function getReportByShareId(shareId: string) {
  return get(`/report/share/${shareId}`)
}
