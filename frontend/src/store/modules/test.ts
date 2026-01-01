import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as testApi from '@/api/test'

export interface Question {
  _id: string
  questionText: string
  questionType: 'single' | 'scenario'
  category: 'cognitive' | 'creativity' | 'emotional' | 'practical'
  dimension: string
  subDimension?: string
  options: { value: number; label: string }[]
  isReverse: boolean
  difficulty: number
  order: number
}

export interface Answer {
  questionId: string
  answerValue: number
  duration?: number
  timestamp?: Date
}

export const useTestStore = defineStore('test', () => {
  const testId = ref<string>('')
  const currentQuestions = ref<Question[]>([])
  const answers = ref<Record<string, Answer>>({})
  const currentPage = ref<number>(1)
  const startTime = ref<number>(0)
  const isInProgress = ref<boolean>(false)
  const questionsPerPage = 10 // 每页10题

  // 计算属性
  const totalPages = computed(() => {
    return Math.ceil(currentQuestions.value.length / questionsPerPage)
  })

  const currentPageQuestions = computed(() => {
    const start = (currentPage.value - 1) * questionsPerPage
    const end = start + questionsPerPage
    return currentQuestions.value.slice(start, end)
  })

  const answeredCount = computed(() => {
    return Object.keys(answers.value).length
  })

  const progress = computed(() => {
    if (currentQuestions.value.length === 0) return 0
    return Math.round((answeredCount.value / currentQuestions.value.length) * 100)
  })

  const isCurrentPageComplete = computed(() => {
    return currentPageQuestions.value.every(q => answers.value[q._id])
  })

  const isAllAnswered = computed(() => {
    return answeredCount.value === currentQuestions.value.length
  })

  // 初始化测试（获取题目并开始测试）
  async function initTest() {
    try {
      // 获取所有题目
      const questionsRes = await testApi.getQuestions()
      if (!questionsRes.success) {
        throw new Error(questionsRes.message || '获取题目失败')
      }

      // 调用开始测试API
      const startRes = await testApi.startTest()
      if (!startRes.success) {
        throw new Error(startRes.message || '开始测试失败')
      }

      // 初始化状态
      testId.value = startRes.data.testId
      currentQuestions.value = questionsRes.data.questions
      answers.value = {}
      currentPage.value = 1
      startTime.value = Date.now()
      isInProgress.value = true

      // 保存到本地存储
      saveToLocalStorage()

      return startRes
    } catch (error) {
      console.error('初始化测试失败:', error)
      throw error
    }
  }

  // 从本地存储恢复测试状态
  function restoreFromLocalStorage() {
    try {
      const savedState = localStorage.getItem('test_state')
      if (savedState) {
        const state = JSON.parse(savedState)
        testId.value = state.testId || ''
        currentQuestions.value = state.currentQuestions || []
        answers.value = state.answers || {}
        currentPage.value = state.currentPage || 1
        startTime.value = state.startTime || 0
        isInProgress.value = state.isInProgress || false
        return true
      }
    } catch (error) {
      console.error('恢复测试状态失败:', error)
    }
    return false
  }

  // 保存到本地存储
  function saveToLocalStorage() {
    try {
      const state = {
        testId: testId.value,
        currentQuestions: currentQuestions.value,
        answers: answers.value,
        currentPage: currentPage.value,
        startTime: startTime.value,
        isInProgress: isInProgress.value
      }
      localStorage.setItem('test_state', JSON.stringify(state))
    } catch (error) {
      console.error('保存测试状态失败:', error)
    }
  }

  // 清除本地存储
  function clearLocalStorage() {
    localStorage.removeItem('test_state')
  }

  // 保存答案
  function saveAnswer(questionId: string, answerValue: number, duration?: number) {
    answers.value[questionId] = {
      questionId,
      answerValue,
      duration,
      timestamp: new Date()
    }
    // 自动保存到本地存储
    saveToLocalStorage()
  }

  // 提交当前页答案到服务器
  async function submitCurrentPageAnswers() {
    if (!testId.value) {
      throw new Error('测试ID不存在')
    }

    const currentAnswers = currentPageQuestions.value
      .filter(q => answers.value[q._id])
      .map(q => answers.value[q._id])

    if (currentAnswers.length === 0) {
      return { success: true }
    }

    try {
      const res = await testApi.submitAnswer({
        testId: testId.value,
        answers: currentAnswers
      })
      return res
    } catch (error) {
      console.error('提交答案失败:', error)
      throw error
    }
  }

  // 下一页
  async function nextPage() {
    if (currentPage.value < totalPages.value) {
      // 提交当前页答案
      await submitCurrentPageAnswers()
      currentPage.value++
      saveToLocalStorage()
    }
  }

  // 上一页
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
      saveToLocalStorage()
    }
  }

// 完成测试
async function completeTest() {
  if (!testId.value) {
    throw new Error('测试ID不存在')
  }

  try {
    // 提交最后一页的答案
    await submitCurrentPageAnswers()

    // 计算总时长
    const totalDuration = Date.now() - startTime.value

    // 调用完成测试API
    const res = await testApi.completeTest({
      testId: testId.value,
      totalDuration
    })

    if (res.success) {
      isInProgress.value = false
      clearLocalStorage()
    }

    return res
  } catch (error) {
    console.error('完成测试失败:', error)
    throw error
  }
}

  // 放弃测试
  function abandonTest() {
    testId.value = ''
    currentQuestions.value = []
    answers.value = {}
    currentPage.value = 1
    startTime.value = 0
    isInProgress.value = false
    clearLocalStorage()
  }

  // 重置测试
  function resetTest() {
    abandonTest()
  }

  return {
    // 状态
    testId,
    currentQuestions,
    answers,
    currentPage,
    startTime,
    isInProgress,
    questionsPerPage,

    // 计算属性
    totalPages,
    currentPageQuestions,
    answeredCount,
    progress,
    isCurrentPageComplete,
    isAllAnswered,

    // 方法
    initTest,
    restoreFromLocalStorage,
    saveToLocalStorage,
    clearLocalStorage,
    saveAnswer,
    submitCurrentPageAnswers,
    nextPage,
    prevPage,
    completeTest,
    abandonTest,
    resetTest
  }
}, {
  persist: false // 使用自定义的本地存储逻辑
})
