<template>
  <div class="report-detail-page">
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading" :size="40"><Loading /></el-icon>
      <p>加载报告中...</p>
    </div>

    <div v-else-if="report" class="container">
      <!-- 头部操作栏 -->
      <div class="header-actions">
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div class="action-buttons">
          <el-button @click="handleShare">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
          <el-button type="primary" @click="handleRetake">
            重新测试
          </el-button>
        </div>
      </div>

      <!-- 总体评估卡片 -->
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="score-section">
            <div class="total-score">
              <div class="score-value">{{ report.totalScore }}</div>
              <div class="score-label">综合得分</div>
            </div>
            <div class="talent-info">
              <el-tag :type="talentLevelType" size="large">
                {{ report.talentLevel }}
              </el-tag>
              <h3 class="talent-type">{{ report.talentType }}</h3>
            </div>
          </div>
          <div class="summary-text">
            <p>{{ report.summary }}</p>
          </div>
        </div>
      </el-card>

      <!-- 雷达图 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>能力雷达图</span>
          </div>
        </template>
        <RadarChart
          v-if="radarData"
          :data="radarData"
        />
      </el-card>

      <!-- 维度得分 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>维度得分详情</span>
          </div>
        </template>
        <div class="dimensions-grid">
          <div
            v-for="(dim, index) in report.dimensionScores"
            :key="index"
            class="dimension-item"
          >
            <div class="dimension-header">
              <h4>{{ getDimensionName(dim.dimension) }}</h4>
              <div class="dimension-score">{{ dim.score }}分</div>
            </div>
            <el-progress
              :percentage="dim.score"
              :color="getScoreColor(dim.score)"
              :stroke-width="10"
            />
            <div v-if="dim.subScores" class="sub-scores">
              <div
                v-for="(score, subKey) in dim.subScores"
                :key="subKey"
                class="sub-score-item"
              >
                <span class="sub-name">{{ getSubDimensionName(subKey) }}</span>
                <el-progress
                  :percentage="score"
                  :show-text="true"
                  :stroke-width="6"
                  :color="getScoreColor(score)"
                />
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 优势能力 -->
      <el-card class="analysis-card">
        <template #header>
          <div class="card-header">
            <span class="header-icon">💪</span>
            <span>优势能力</span>
          </div>
        </template>
        <div class="analysis-list">
          <div
            v-for="(strength, index) in report.strengths"
            :key="index"
            class="analysis-item strength-item"
          >
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-content">{{ strength }}</div>
          </div>
        </div>
      </el-card>

      <!-- 待提升能力 -->
      <el-card class="analysis-card">
        <template #header>
          <div class="card-header">
            <span class="header-icon">📈</span>
            <span>待提升能力</span>
          </div>
        </template>
        <div class="analysis-list">
          <div
            v-for="(weakness, index) in report.weaknesses"
            :key="index"
            class="analysis-item improvement-item"
          >
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-content">{{ weakness }}</div>
          </div>
        </div>
      </el-card>

      <!-- 发展建议 -->
      <el-card class="analysis-card">
        <template #header>
          <div class="card-header">
            <span class="header-icon">💡</span>
            <span>发展建议</span>
          </div>
        </template>
        <div class="analysis-list">
          <div
            v-for="(suggestion, index) in report.suggestions"
            :key="index"
            class="analysis-item"
          >
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-content">{{ suggestion }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分享对话框 -->
    <el-dialog v-model="shareDialogVisible" title="分享报告" width="500px">
      <div class="share-content">
        <div v-if="shareLink" class="share-link-section">
          <p class="share-tip">您的报告分享链接：</p>
          <el-input v-model="shareLink" readonly>
            <template #append>
              <el-button @click="copyShareLink">复制链接</el-button>
            </template>
          </el-input>
          <p class="share-hint">任何人都可以通过此链接查看您的报告</p>
          <el-button type="danger" plain @click="handleCancelShare">取消分享</el-button>
        </div>
        <div v-else class="no-share">
          <p class="share-tip">点击"生成分享链接"按钮，创建可以分享给他人的链接</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="shareDialogVisible = false">关闭</el-button>
        <el-button v-if="!shareLink" type="primary" @click="handleCreateShareLink">
          生成分享链接
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, ArrowLeft, Share } from '@element-plus/icons-vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import { getReportDetail, createShareLink, cancelShare } from '@/api/report'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const report = ref<any>(null)
const shareDialogVisible = ref(false)
const shareLink = ref('')

// 维度名称映射
const dimensionNameMap: Record<string, string> = {
  cognitive: '认知能力',
  creativity: '创造力',
  emotional: '情感智能',
  practical: '实践能力'
}

// 子维度名称映射
const subDimensionNameMap: Record<string, string> = {
  logical_thinking: '逻辑思维',
  memory: '记忆能力',
  attention: '注意力',
  learning: '学习能力',
  imagination: '想象力',
  innovation: '创新能力',
  artistic_perception: '艺术感知',
  empathy: '共情能力',
  emotion_management: '情绪管理',
  interpersonal: '人际交往',
  execution: '执行力',
  leadership: '领导力',
  adaptability: '适应能力'
}

// 获取维度名称
const getDimensionName = (key: string) => {
  return dimensionNameMap[key] || key
}

// 获取子维度名称
const getSubDimensionName = (key: string) => {
  return subDimensionNameMap[key] || key
}

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 85) return '#67c23a'
  if (score >= 70) return '#409eff'
  if (score >= 55) return '#e6a23c'
  return '#f56c6c'
}

// 计算雷达图数据
const radarData = computed(() => {
  if (!report.value?.chartData?.radar) return null
  return {
    dimensions: report.value.chartData.radar.dimensions,
    values: report.value.chartData.radar.values
  }
})

// 天赋等级类型
const talentLevelType = computed(() => {
  const level = report.value?.summary?.talentLevel
  if (!level) return ''
  
  const typeMap: Record<string, any> = {
    '卓越': 'success',
    '良好': '',
    '中等': 'warning',
    '发展中': 'info'
  }
  return typeMap[level] || ''
})

// 获取报告详情
const fetchReport = async () => {
  loading.value = true
  try {
    const reportId = route.params.reportId as string
    const res = await getReportDetail(reportId)
    
    if (res.success && res.data.report) {
      report.value = res.data.report
      
      // 检查是否有分享ID
      if (report.value.shareInfo?.shareId && report.value.shareInfo?.isPublic) {
        shareLink.value = `${window.location.origin}/share/${report.value.shareInfo.shareId}`
      } else {
        shareLink.value = ''
      }
    }
  } catch (error) {
    console.error('获取报告失败:', error)
    ElMessage.error('获取报告失败')
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 分享
const handleShare = () => {
  shareDialogVisible.value = true
}

// 生成分享链接
const handleCreateShareLink = async () => {
  try {
    const reportId = route.params.reportId as string
    const res = await createShareLink(reportId)
    
    if (res.success && res.data.shareId) {
      shareLink.value = `${window.location.origin}/share/${res.data.shareId}`
      ElMessage.success('分享链接已生成')
    }
  } catch (error) {
    console.error('生成分享链接失败:', error)
    ElMessage.error('生成分享链接失败')
  }
}

// 取消分享
const handleCancelShare = async () => {
  try {
    await ElMessageBox.confirm('取消分享后，之前的分享链接将失效，确定继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const reportId = route.params.reportId as string
    await cancelShare(reportId)
    
    shareLink.value = ''
    ElMessage.success('已取消分享')
    shareDialogVisible.value = false
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消分享失败:', error)
      ElMessage.error('取消分享失败')
    }
  }
}

// 复制分享链接
const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    ElMessage.success('链接已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}

// 重新测试
const handleRetake = () => {
  router.push('/test/intro')
}

onMounted(() => {
  fetchReport()
})
</script>

<style scoped>
.report-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.loading-container {
  text-align: center;
  padding: 100px 20px;
  color: #909399;
}

.loading-container .el-icon {
  margin-bottom: 16px;
  color: #667eea;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.summary-card {
  margin-bottom: 24px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.score-section {
  display: flex;
  align-items: center;
  gap: 40px;
}

.total-score {
  text-align: center;
}

.score-value {
  font-size: 72px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.score-label {
  font-size: 16px;
  color: #909399;
  margin-top: 8px;
}

.talent-info {
  flex: 1;
}

.talent-type {
  font-size: 24px;
  margin-top: 12px;
  color: #333;
}

.keywords {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  margin: 0;
}

.summary-text {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  line-height: 1.8;
  color: #606266;
}

.chart-card,
.analysis-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-icon {
  font-size: 24px;
}

.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analysis-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  line-height: 1.6;
}

.item-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.item-content {
  flex: 1;
  color: #606266;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.dimension-tag {
  font-weight: bold;
  color: #667eea;
}

.subdimension-tag {
  color: #909399;
}

.item-desc {
  color: #606266;
  line-height: 1.6;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.dimension-item {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dimension-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.dimension-score {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
}

.sub-scores {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-score-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sub-name {
  font-size: 14px;
  color: #606266;
}

.share-content {
  padding: 20px 0;
}

.share-link-section,
.no-share {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-tip {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.share-hint {
  font-size: 12px;
  color: #909399;
  margin: 8px 0 0 0;
}

@media (max-width: 768px) {
  .report-detail-page {
    padding: 12px;
  }

  .header-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .action-buttons {
    width: 100%;
  }

  .action-buttons .el-button {
    flex: 1;
  }

  .score-section {
    flex-direction: column;
    gap: 20px;
  }

  .score-value {
    font-size: 56px;
  }

  .talent-type {
    font-size: 20px;
  }
}
</style>
