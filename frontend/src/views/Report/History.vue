<template>
  <div class="history-page">
    <div class="container">
      <div class="page-header">
        <h1>历史记录</h1>
        <el-button type="primary" @click="goToTest">
          <el-icon><Plus /></el-icon>
          开始新测试
        </el-button>
      </div>

      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
      </div>

      <div v-else-if="reports.length > 0" class="reports-list">
        <el-card 
          v-for="report in reports" 
          :key="report._id"
          class="report-card"
          @click="viewReport(report._id)"
        >
          <div class="report-content">
            <div class="report-info">
              <div class="report-date">
                {{ formatDate(report.createdAt) }}
              </div>
              <div class="report-score">
                <span class="score-value">{{ report.totalScore || 0 }}</span>
                <span class="score-label">分</span>
              </div>
            </div>
            <div class="report-details">
              <el-tag :type="getLevelType(report.talentLevel)">
                {{ report.talentLevel || '-' }}
              </el-tag>
              <span class="talent-type">{{ report.talentType || '-' }}</span>
            </div>
          </div>
        </el-card>

        <el-pagination
          v-if="total > pageSize"
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>

      <el-empty v-else description="暂无测试记录" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Loading } from '@element-plus/icons-vue'
import { getReportList } from '@/api/report'
import dayjs from 'dayjs'

const router = useRouter()

const loading = ref(false)
const reports = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchReports = async () => {
  loading.value = true
  try {
    const res = await getReportList({ page: currentPage.value, limit: pageSize.value })
    if (res.success && res.data) {
      reports.value = res.data.reports || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取报告列表失败:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const getLevelType = (level?: string) => {
  if (!level) return ''
  
  const typeMap: Record<string, any> = {
    '卓越': 'success',
    '良好': '',
    '中等': 'warning',
    '发展中': 'info'
  }
  return typeMap[level] || ''
}

const viewReport = (reportId: string) => {
  router.push(`/report/${reportId}`)
}

const goToTest = () => {
  router.push('/test/intro')
}

const handlePageChange = () => {
  fetchReports()
}

onMounted(() => {
  fetchReports()
})
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
}

.loading-container {
  text-align: center;
  padding: 100px 20px;
  color: #909399;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-card {
  cursor: pointer;
  transition: all 0.3s;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.report-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.report-date {
  color: #909399;
  font-size: 14px;
}

.report-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
}

.score-label {
  font-size: 14px;
  color: #909399;
}

.report-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.talent-type {
  color: #606266;
  font-size: 14px;
}

.el-pagination {
  margin-top: 24px;
  justify-content: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .report-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
