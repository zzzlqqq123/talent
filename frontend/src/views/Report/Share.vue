<template>
  <div class="share-report-page">
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading" :size="40"><Loading /></el-icon>
      <p>加载报告中...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <el-icon :size="60" color="#f56c6c"><WarningFilled /></el-icon>
      <h3>{{ error }}</h3>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>

    <div v-else-if="report" class="container">
      <!-- 分享提示栏 -->
      <el-alert
        title="这是一份公开分享的测试报告"
        type="info"
        :closable="false"
        class="share-notice"
      >
        <template #default>
          <div class="share-info">
            <span>由 {{ report.userId?.nickname || '匿名用户' }} 分享</span>
            <span class="separator">•</span>
            <span>生成时间: {{ formatDate(report.createdAt) }}</span>
            <span class="separator">•</span>
            <span>浏览次数: {{ report.shareInfo?.viewCount || 0 }}</span>
          </div>
        </template>
      </el-alert>

      <!-- 总体评估卡片 -->
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="score-section">
            <div class="total-score">
              <div class="score-value">{{ report.summary.totalScore }}</div>
              <div class="score-label">综合得分</div>
            </div>
            <div class="talent-info">
              <el-tag :type="talentLevelType" size="large">
                {{ report.summary.talentLevel }}
              </el-tag>
              <h3 class="talent-type">{{ report.summary.talentType }}</h3>
              <div class="keywords">
                <el-tag 
                  v-for="keyword in report.summary.keywords" 
                  :key="keyword"
                  effect="plain"
                  size="small"
                  class="keyword-tag"
                >
                  {{ keyword }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="summary-text">
            <p>{{ report.summary.description }}</p>
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
            v-for="(dim, key) in report.dimensionScores" 
            :key="key"
            class="dimension-item"
          >
            <div class="dimension-header">
              <h4>{{ getDimensionName(key) }}</h4>
              <div class="dimension-score">{{ dim.total }}分</div>
            </div>
            <el-progress 
              :percentage="dim.total" 
              :color="getScoreColor(dim.total)"
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
            v-for="(strength, index) in report.analysis.strengths" 
            :key="index"
            class="analysis-item"
          >
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-content">
              <div class="item-title">
                <span class="dimension-tag">{{ getDimensionName(strength.dimension) }}</span>
                <span class="subdimension-tag">{{ getSubDimensionName(strength.subDimension) }}</span>
                <el-tag type="success" size="small">{{ strength.score }}分</el-tag>
              </div>
              <div class="item-desc">{{ strength.description }}</div>
            </div>
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
            v-for="(improvement, index) in report.analysis.improvements" 
            :key="index"
            class="analysis-item"
          >
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-content">
              <div class="item-title">
                <span class="dimension-tag">{{ getDimensionName(improvement.dimension) }}</span>
                <span class="subdimension-tag">{{ getSubDimensionName(improvement.subDimension) }}</span>
                <el-tag type="warning" size="small">{{ improvement.score }}分</el-tag>
              </div>
              <div class="item-desc">{{ improvement.description }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- CTA区域 -->
      <el-card class="cta-card">
        <div class="cta-content">
          <h3>想要了解自己的天赋吗？</h3>
          <p>立即开始测试，生成专属于你的天赋报告</p>
          <el-button type="primary" size="large" @click="goToTest">
            开始测试
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, WarningFilled } from '@element-plus/icons-vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import { getReportByShareId } from '@/api/report'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const report = ref<any>(null)
const error = ref('')

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

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 计算雷达图数据
const radarData = computed(() => {
  if (!report.value?.chartData?.radar) return null
  return {
    dimensions: report.value.chartData.radar.categories,
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

// 获取分享报告
const fetchSharedReport = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const shareId = route.params.shareId as string
    const res = await getReportByShareId(shareId)
    
    if (res.success && res.data.report) {
      report.value = res.data.report
    } else {
      error.value = '报告不存在或已被取消分享'
    }
  } catch (err) {
    console.error('获取分享报告失败:', err)
    error.value = '分享链接无效或已过期'
  } finally {
    loading.value = false
  }
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 去测试
const goToTest = () => {
  router.push('/test/intro')
}

onMounted(() => {
  fetchSharedReport()
})
</script>

<style scoped>
.share-report-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 100px 20px;
  color: #909399;
}

.error-container h3 {
  margin: 20px 0;
  color: #606266;
}

.loading-container .el-icon {
  margin-bottom: 16px;
  color: #667eea;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.share-notice {
  margin-bottom: 24px;
}

.share-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.separator {
  color: #c0c4cc;
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

.cta-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.cta-content {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.cta-content h3 {
  font-size: 28px;
  margin: 0 0 16px 0;
}

.cta-content p {
  font-size: 16px;
  margin: 0 0 24px 0;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .share-report-page {
    padding: 12px;
  }

  .share-info {
    font-size: 12px;
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

  .cta-content h3 {
    font-size: 22px;
  }

  .cta-content p {
    font-size: 14px;
  }
}
</style>

