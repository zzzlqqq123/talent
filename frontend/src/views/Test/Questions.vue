<template>
  <div class="questions-page">
    <div class="container">
      <!-- 顶部进度条 -->
      <ProgressBar 
        :answered-count="answeredCount" 
        :total="totalQuestions"
      />

      <!-- 题目卡片 -->
      <div v-if="currentPageQuestions.length > 0" class="questions-container">
        <QuestionCard
          v-for="(question, index) in currentPageQuestions"
          :key="question._id"
          :question="question"
          :question-number="getQuestionNumber(index)"
          v-model="localAnswers[question._id]"
          @update:model-value="handleAnswerChange(question._id, $event)"
        />
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-container">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
        <p>加载题目中...</p>
      </div>

      <!-- 导航按钮 -->
      <div class="navigation-buttons">
        <el-button 
          size="large"
          :disabled="currentPage === 1"
          @click="handlePrevPage"
        >
          上一页
        </el-button>

        <div class="page-info">
          第 {{ currentPage }}/{{ totalPages }} 页
        </div>

        <el-button 
          v-if="currentPage < totalPages"
          type="primary"
          size="large"
          :disabled="!isCurrentPageComplete"
          @click="handleNextPage"
        >
          下一页
        </el-button>

        <el-button 
          v-else
          type="success"
          size="large"
          :disabled="!isAllComplete"
          :loading="submitting"
          @click="handleSubmit"
        >
          提交测试
        </el-button>
      </div>

      <!-- 提示信息 -->
      <div v-if="!isCurrentPageComplete" class="tip-message">
        <el-icon><Warning /></el-icon>
        <span>请完成当前页所有题目后再继续</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, Warning } from '@element-plus/icons-vue'
import QuestionCard from '@/components/test/QuestionCard.vue'
import ProgressBar from '@/components/test/ProgressBar.vue'
import { useTestStore } from '@/store/modules/test'

const router = useRouter()
const testStore = useTestStore()

const loading = ref(false)
const submitting = ref(false)
const questionStartTime = ref<Record<string, number>>({}) // 记录每道题的开始时间

// 从路由参数获取页码，如果没有则使用store中的当前页码
const route = useRoute()
const currentPage = computed(() => {
  const pageFromRoute = parseInt(route.params.page as string)
  if (!isNaN(pageFromRoute) && pageFromRoute >= 1) {
    return pageFromRoute
  }
  return testStore.currentPage
})

// 使用store中的状态
const currentPageQuestions = computed(() => testStore.currentPageQuestions)
const totalQuestions = computed(() => testStore.currentQuestions.length)
const totalPages = computed(() => testStore.totalPages)
const answeredCount = computed(() => testStore.answeredCount)
const isCurrentPageComplete = computed(() => testStore.isCurrentPageComplete)
const isAllComplete = computed(() => testStore.isAllAnswered)

// 本地答案状态（用于v-model绑定）
const localAnswers = ref<Record<string, number>>({})

// 获取题目编号
const getQuestionNumber = (index: number) => {
  return (currentPage.value - 1) * testStore.questionsPerPage + index + 1
}

// 初始化测试
const initTest = async () => {
  loading.value = true
  try {
    // 检查是否有未完成的测试
    if (!testStore.isInProgress) {
      ElMessage.warning('请先从测试介绍页开始测试')
      router.push('/test/intro')
      return
    }

    // 从store恢复答案
    Object.keys(testStore.answers).forEach(questionId => {
      localAnswers.value[questionId] = testStore.answers[questionId].answerValue
    })
  } catch (error) {
    console.error('初始化测试失败:', error)
    ElMessage.error('初始化测试失败，请重试')
    router.push('/test/intro')
  } finally {
    loading.value = false
  }
}

// 答案变化处理
const handleAnswerChange = (questionId: string, value: number) => {
  // 记录答题时长
  const startTime = questionStartTime.value[questionId] || Date.now()
  const duration = Date.now() - startTime
  
  // 保存到store
  testStore.saveAnswer(questionId, value, duration)
  
  // 更新本地状态
  localAnswers.value[questionId] = value
}

// 上一页
const handlePrevPage = () => {
  const newPage = currentPage.value - 1
  router.push(`/test/questions/${newPage}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 下一页
const handleNextPage = async () => {
  if (!isCurrentPageComplete.value) {
    ElMessage.warning('请完成当前页所有题目')
    return
  }

  try {
    // 提交当前页答案到服务器
    await testStore.submitCurrentPageAnswers()

    // 切换到下一页
    const newPage = currentPage.value + 1
    router.push(`/test/questions/${newPage}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    ElMessage.success('答案已保存')
  } catch (error: any) {
    console.error('保存答案失败:', error)
    ElMessage.error(error.message || '保存答案失败，请重试')
  }
}

// 提交测试
const handleSubmit = async () => {
  if (!isAllComplete.value) {
    ElMessage.warning('请完成所有题目后再提交')
    return
  }

  try {
    await ElMessageBox.confirm(
      '确认提交测试吗？提交后将无法修改答案。',
      '确认提交',
      {
        confirmButtonText: '确认提交',
        cancelButtonText: '再检查一下',
        type: 'warning'
      }
    )

    submitting.value = true

    const res = await testStore.completeTest()

    if (res.success) {
      ElMessage.success('提交成功！正在生成报告...')
      
      // 跳转到完成页面
      router.push({
        path: '/test/complete',
        query: { testId: testStore.testId }
      })
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('提交测试失败:', error)
      ElMessage.error(error.message || '提交失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

// 初始化每道题的开始时间
const initQuestionStartTimes = () => {
  currentPageQuestions.value.forEach(q => {
    if (!questionStartTime.value[q._id]) {
      questionStartTime.value[q._id] = Date.now()
    }
  })
}

// 监听路由参数变化，更新store中的页码
watch(() => route.params.page, (newPage) => {
  const pageNum = parseInt(newPage as string)
  if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= testStore.totalPages) {
    testStore.currentPage = pageNum
    // 重新初始化当前页题目的开始时间
    initQuestionStartTimes()
  }
}, { immediate: true })

// 页面离开前提示
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (testStore.isInProgress && !isAllComplete.value) {
    e.preventDefault()
    e.returnValue = '测试尚未完成，确定要离开吗？'
  }
}

// 页面加载
onMounted(() => {
  initTest()
  initQuestionStartTimes()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 页面卸载
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.questions-page {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #fdf2f8, #eef2ff, #f0f9ff);
  padding: 32px 20px;
  position: relative;
}

.questions-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(102, 126, 234, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.questions-container {
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.loading-container {
  text-align: center;
  padding: 100px 20px;
  color: #9ca3af;
}

.loading-container .el-icon {
  margin-bottom: 24px;
  color: #667eea;
  font-size: 48px;
}

.loading-container p {
  font-size: 18px;
  font-weight: 500;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin: 40px 0;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  padding: 20px 32px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.08);
}

.page-info {
  font-size: 18px;
  font-weight: 600;
  color: #4b5563;
}

.tip-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: rgba(254, 240, 240, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(254, 226, 226, 0.8);
  border-radius: 1rem;
  color: #ef4444;
  font-size: 15px;
  font-weight: 500;
}

.tip-message .el-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .questions-page {
    padding: 20px 16px;
  }

  .questions-container {
    gap: 24px;
  }

  .navigation-buttons {
    flex-wrap: wrap;
    padding: 20px;
    gap: 12px;
  }

  .navigation-buttons .el-button {
    flex: 1;
    min-width: 100px;
    border-radius: 1rem;
  }

  .page-info {
    width: 100%;
    text-align: center;
    order: -1;
    margin-bottom: 12px;
    font-size: 16px;
  }

  .tip-message {
    padding: 14px 20px;
    font-size: 14px;
  }
}
</style>
