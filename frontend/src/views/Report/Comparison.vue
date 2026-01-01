<template>
  <div class="comparison-page">
    <div class="container">
      <div class="page-header">
        <h1>对比分析</h1>
        <el-button @click="$router.back()">返回</el-button>
      </div>

      <!-- 加载状态 -->
      <el-skeleton :loading="loading" :rows="8" animated>
        <div v-if="comparisonData" class="comparison-content">
          <!-- 概览卡片 -->
          <div class="overview-cards">
            <div 
              v-for="report in comparisonData.reports" 
              :key="report._id"
              class="overview-card"
            >
              <div class="card-header">
                <h3>{{ report.summary.talentType }}</h3>
                <el-tag :type="getLevelType(report.summary.talentLevel)">
                  {{ report.summary.talentLevel }}
                </el-tag>
              </div>
              <div class="card-score">{{ report.summary.totalScore }}</div>
              <div class="card-date">{{ formatDate(report.createdAt) }}</div>
            </div>
          </div>

          <!-- 雷达图对比 -->
          <div class="chart-section">
            <h2>维度对比</h2>
            <div ref="radarChartRef" class="chart-container"></div>
          </div>

          <!-- 各维度详细对比 -->
          <div class="dimension-comparison">
            <h2>详细分析</h2>
            <div 
              v-for="(dimension, key) in dimensionNames" 
              :key="key"
              class="dimension-section"
            >
              <h3>{{ dimension }}</h3>
              <div class="dimension-bars">
                <div 
                  v-for="(report, index) in comparisonData.reports" 
                  :key="report._id"
                  class="bar-item"
                >
                  <div class="bar-header">
                    <span class="bar-label">测试 {{ index + 1 }}</span>
                    <span class="bar-value">{{ report.dimensionScores[key] }}分</span>
                  </div>
                  <el-progress 
                    :percentage="report.dimensionScores[key]" 
                    :color="colors[index % colors.length]"
                    :stroke-width="20"
                  />
                  <div class="bar-date">{{ formatDate(report.createdAt) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 趋势图（如果是时间序列） -->
          <div v-if="comparisonData.reports.length >= 3" class="chart-section">
            <h2>成长趋势</h2>
            <div ref="trendChartRef" class="chart-container"></div>
          </div>

          <!-- 变化分析 -->
          <div class="change-analysis">
            <h2>变化分析</h2>
            <div class="analysis-content">
              <el-alert
                v-if="hasImprovement"
                title="进步明显"
                type="success"
                :closable="false"
              >
                <template #default>
                  <div v-for="item in improvements" :key="item.dimension">
                    <strong>{{ item.dimension }}</strong> 提升了 <strong>{{ item.change }}分</strong>
                  </div>
                </template>
              </el-alert>
              
              <el-alert
                v-if="hasDecline"
                title="需要关注"
                type="warning"
                :closable="false"
                style="margin-top: 15px"
              >
                <template #default>
                  <div v-for="item in declines" :key="item.dimension">
                    <strong>{{ item.dimension }}</strong> 下降了 <strong>{{ Math.abs(item.change) }}分</strong>
                  </div>
                </template>
              </el-alert>
            </div>
          </div>

          <!-- 建议 -->
          <div class="suggestions">
            <h2>发展建议</h2>
            <div class="suggestion-list">
              <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
                <div class="suggestion-icon">💡</div>
                <div class="suggestion-content">{{ suggestion }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <el-empty description="无法加载对比数据" />
        </div>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { compareReports } from '@/api/report'
import type { Report } from '@/store/modules/report'

const route = useRoute()

// 状态
const loading = ref(false)
const comparisonData = ref<{ reports: Report[] } | null>(null)
const radarChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

// 维度名称映射
const dimensionNames: Record<string, string> = {
  cognitive: '认知能力',
  creative: '创造力',
  emotional: '情感智能',
  practical: '实践能力'
}

// 颜色数组
const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']

// 获取等级类型
function getLevelType(level: string): string {
  const types: Record<string, string> = {
    '卓越': 'success',
    '优秀': 'success',
    '良好': 'primary',
    '中等': 'info',
    '待提升': 'warning'
  }
  return types[level] || 'info'
}

// 格式化日期
function formatDate(date: string): string {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 计算变化
const improvements = computed(() => {
  if (!comparisonData.value || comparisonData.value.reports.length < 2) return []
  
  const changes = []
  const reports = comparisonData.value.reports
  const latest = reports[0]
  const earliest = reports[reports.length - 1]
  
  for (const key in dimensionNames) {
    const change = latest.dimensionScores[key] - earliest.dimensionScores[key]
    if (change > 5) {
      changes.push({
        dimension: dimensionNames[key],
        change: change.toFixed(1)
      })
    }
  }
  
  return changes
})

const declines = computed(() => {
  if (!comparisonData.value || comparisonData.value.reports.length < 2) return []
  
  const changes = []
  const reports = comparisonData.value.reports
  const latest = reports[0]
  const earliest = reports[reports.length - 1]
  
  for (const key in dimensionNames) {
    const change = latest.dimensionScores[key] - earliest.dimensionScores[key]
    if (change < -5) {
      changes.push({
        dimension: dimensionNames[key],
        change: change.toFixed(1)
      })
    }
  }
  
  return changes
})

const hasImprovement = computed(() => improvements.value.length > 0)
const hasDecline = computed(() => declines.value.length > 0)

// 生成建议
const suggestions = computed(() => {
  if (!comparisonData.value) return []
  
  const result = []
  
  if (hasImprovement.value) {
    result.push('继续保持当前的学习和发展路径，您的进步非常明显。')
  }
  
  if (hasDecline.value) {
    result.push('建议加强弱项维度的训练，可以通过针对性的练习来提升。')
  }
  
  // 找出得分最低的维度
  const latest = comparisonData.value.reports[0]
  let minScore = 100
  let minDimension = ''
  
  for (const key in latest.dimensionScores) {
    if (latest.dimensionScores[key] < minScore) {
      minScore = latest.dimensionScores[key]
      minDimension = dimensionNames[key]
    }
  }
  
  if (minScore < 60) {
    result.push(`${minDimension}是您目前的待提升项，建议制定专项提升计划。`)
  }
  
  return result
})

// 初始化雷达图
function initRadarChart() {
  if (!radarChartRef.value || !comparisonData.value) return
  
  const chart = echarts.init(radarChartRef.value)
  
  const indicator = Object.keys(dimensionNames).map(key => ({
    name: dimensionNames[key],
    max: 100
  }))
  
  const series = comparisonData.value.reports.map((report, index) => ({
    value: Object.keys(dimensionNames).map(key => report.dimensionScores[key]),
    name: `测试 ${index + 1} (${formatDate(report.createdAt)})`,
    itemStyle: {
      color: colors[index % colors.length]
    }
  }))
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: series.map(s => s.name),
      bottom: 10
    },
    radar: {
      indicator: indicator,
      radius: '60%',
      splitNumber: 4,
      axisName: {
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          color: ['#e4e7ed']
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(64, 158, 255, 0.05)', 'rgba(255, 255, 255, 1)']
        }
      }
    },
    series: [{
      type: 'radar',
      data: series
    }]
  }
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化趋势图
function initTrendChart() {
  if (!trendChartRef.value || !comparisonData.value) return
  
  const chart = echarts.init(trendChartRef.value)
  
  const reports = [...comparisonData.value.reports].reverse()
  const dates = reports.map(r => formatDate(r.createdAt))
  
  const series = Object.keys(dimensionNames).map((key, index) => ({
    name: dimensionNames[key],
    type: 'line',
    data: reports.map(r => r.dimensionScores[key]),
    smooth: true,
    itemStyle: {
      color: colors[index]
    }
  }))
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: Object.values(dimensionNames),
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100
    },
    series: series
  }
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 获取对比数据
async function fetchComparisonData() {
  const ids = route.query.ids as string
  if (!ids) {
    ElMessage.error('缺少对比报告ID')
    return
  }
  
  const reportIds = ids.split(',')
  if (reportIds.length < 2) {
    ElMessage.error('至少需要2个报告进行对比')
    return
  }
  
  loading.value = true
  try {
    const res = await compareReports({ reportIds })
    if (res.success && res.data) {
      comparisonData.value = res.data
      
      // 等待DOM更新后初始化图表
      await nextTick()
      initRadarChart()
      if (reportIds.length >= 3) {
        initTrendChart()
      }
    }
  } catch (error) {
    ElMessage.error('获取对比数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchComparisonData()
})
</script>

<style scoped>
.comparison-page {
  min-height: calc(100vh - 120px);
  padding: 40px 0;
  background: #f5f7fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.comparison-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.overview-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.overview-card h3 {
  font-size: 16px;
  color: #303133;
  margin: 0;
}

.card-score {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.card-date {
  font-size: 14px;
  color: #909399;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
}

.chart-container {
  width: 100%;
  height: 500px;
}

.dimension-comparison {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dimension-comparison > h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 30px 0;
}

.dimension-section {
  margin-bottom: 30px;
}

.dimension-section:last-child {
  margin-bottom: 0;
}

.dimension-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #606266;
  margin: 0 0 15px 0;
}

.dimension-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bar-item {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.bar-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.bar-value {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.bar-date {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.change-analysis,
.suggestions {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.change-analysis h2,
.suggestions h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggestion-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.suggestion-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .chart-container {
    height: 400px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
}
</style>

