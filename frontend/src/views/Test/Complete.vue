<template>
  <div class="complete-page">
    <div class="container">
      <div class="complete-card">
        <div class="success-icon">
          <el-icon :size="80" color="#67C23A"><CircleCheck /></el-icon>
        </div>

        <h1 class="title">测试完成！</h1>
        <p class="subtitle">恭喜你完成了所有测试题目</p>

        <div class="status-container">
          <div v-if="generating" class="generating-status">
            <el-icon class="is-loading" :size="40"><Loading /></el-icon>
            <p class="status-text">正在生成你的专属报告...</p>
            <p class="status-desc">这可能需要几秒钟时间</p>
          </div>

          <div v-else-if="reportReady" class="ready-status">
            <el-icon :size="40" color="#67C23A"><Document /></el-icon>
            <p class="status-text">报告已生成完成！</p>
            <el-button 
              type="primary" 
              size="large"
              @click="viewReport"
            >
              查看报告
            </el-button>
          </div>

          <div v-else-if="error" class="error-status">
            <el-icon :size="40" color="#F56C6C"><CircleClose /></el-icon>
            <p class="status-text">报告生成失败</p>
            <p class="status-desc">{{ errorMessage }}</p>
            <el-button 
              type="primary" 
              @click="retryGenerate"
            >
              重试
            </el-button>
          </div>
        </div>

        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <h3>全面分析</h3>
              <p>四大维度深度解析</p>
            </div>
          </div>
          <div class="info-card">
            <div class="card-icon">💡</div>
            <div class="card-content">
              <h3>专业建议</h3>
              <p>个性化发展方向</p>
            </div>
          </div>
          <div class="info-card">
            <div class="card-icon">📈</div>
            <div class="card-content">
              <h3>可视化图表</h3>
              <p>直观展示你的天赋</p>
            </div>
          </div>
        </div>

        <div class="actions">
          <el-button @click="goHome">返回首页</el-button>
          <el-button @click="goHistory">查看历史记录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, Loading, Document } from '@element-plus/icons-vue'
import { useTestStore } from '@/store/modules/test'
import { generateReport as generateReportAPI } from '@/api/report'
import { getTestProgress } from '@/api/test'

const router = useRouter()
const route = useRoute()
const testStore = useTestStore()

const generating = ref(true)
const reportReady = ref(false)
const error = ref(false)
const errorMessage = ref('')
const reportId = ref('')
const testId = ref('')

// 生成报告
const generateReport = async () => {
  generating.value = true
  error.value = false

  try {
    // 使用testId作为resultId（testService会通过testId查找Result）
    const res = await generateReportAPI({ resultId: testId.value })

    if (res.success && res.data.report) {
      reportReady.value = true
      generating.value = false
      reportId.value = res.data.report._id
      console.log('报告生成成功，reportId:', reportId.value)
      ElMessage.success('报告生成成功！')
    } else {
      throw new Error(res.message || '报告生成失败')
    }
  } catch (err: any) {
    console.error('生成报告失败:', err)
    generating.value = false
    error.value = true
    errorMessage.value = err.message || '报告生成失败，请稍后重试'
  }
}

// 查看报告
const viewReport = () => {
  console.log('点击查看报告，reportId:', reportId.value)
  if (reportId.value) {
    console.log('跳转到报告详情页:', `/report/${reportId.value}`)
    router.push(`/report/${reportId.value}`)
  } else {
    console.error('reportId 为空，无法跳转')
    ElMessage.error('报告ID为空，请重试')
  }
}

// 重试生成
const retryGenerate = () => {
  generateReport()
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 查看历史
const goHistory = () => {
  router.push('/report/history')
}

onMounted(() => {
  // 从路由参数获取testId
  testId.value = (route.query.testId as string) || testStore.testId

  // 检查是否有测试ID
  if (!testId.value) {
    ElMessage.warning('未找到测试记录')
    router.push('/test/intro')
    return
  }

  // 开始生成报告
  generateReport()
})
</script>

<style scoped>
.complete-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 700px;
  width: 100%;
}

.complete-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.success-icon {
  margin-bottom: 24px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.status-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.generating-status,
.ready-status,
.error-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.status-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.status-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-card {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.info-card:hover {
  background: #e8eaf0;
  transform: translateY(-2px);
}

.card-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.card-content h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.card-content p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .complete-card {
    padding: 32px 24px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .actions .el-button {
    width: 100%;
  }
}
</style>
