import { get, post } from './request'

// 获取所有题目
export function getQuestions() {
  return get('/questions')
}

// 获取题目统计信息
export function getQuestionStats() {
  return get('/questions/stats')
}

// 开始测试
export function startTest() {
  return post('/test/start')
}

// 提交答案
export function submitAnswer(data: {
  testId: string
  answers: Array<{
    questionId: string
    answerValue: number
    duration?: number
  }>
}) {
  return post('/test/answer', data)
}

// 完成测试
export function completeTest(data: { testId: string; totalDuration: number }) {
  return post('/test/complete', data)
}

// 获取测试进度
export function getTestProgress(testId: string) {
  return get(`/test/progress/${testId}`)
}
