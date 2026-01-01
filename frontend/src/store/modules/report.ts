import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Report {
  _id: string
  userId: string
  testId: string
  summary: {
    totalScore: number
    averageScore: number
    talentType: string
    talentLevel: string
    description: string
    keywords: string[]
  }
  dimensionScores: any
  analysis: any
  chartData: any
  createdAt: string
}

export const useReportStore = defineStore('report', () => {
  const currentReport = ref<Report | null>(null)
  const historyReports = ref<Report[]>([])

  // 设置当前报告
  function setCurrentReport(report: Report) {
    currentReport.value = report
  }

  // 设置历史报告
  function setHistoryReports(reports: Report[]) {
    historyReports.value = reports
  }

  // 添加报告到历史
  function addReport(report: Report) {
    historyReports.value.unshift(report)
  }

  return {
    currentReport,
    historyReports,
    setCurrentReport,
    setHistoryReports,
    addReport
  }
})
