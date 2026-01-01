<template>
  <div ref="chartRef" class="bar-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: Array<{
    dimension: string
    score: number
    subScores?: Record<string, number>
  }>
  title?: string
}

const props = defineProps<Props>()

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const dimensions = props.data.map(d => d.dimension)
  const scores = props.data.map(d => d.score)

  const option: echarts.EChartsOption = {
    title: {
      text: props.title || '维度得分',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const item = params[0]
        const dataIndex = item.dataIndex
        const dimension = props.data[dataIndex]
        
        let html = `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 8px;">${dimension.dimension}</div>
          <div>总分: ${dimension.score}分</div>`
        
        if (dimension.subScores) {
          html += '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">'
          Object.entries(dimension.subScores).forEach(([key, value]) => {
            html += `<div>${key}: ${value}分</div>`
          })
          html += '</div>'
        }
        
        html += '</div>'
        return html
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 60,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dimensions,
      axisLabel: {
        interval: 0,
        rotate: 0,
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}分'
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: scores,
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}分',
          fontSize: 12,
          fontWeight: 'bold'
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

const resizeChart = () => {
  chartInstance?.resize()
}

watch(() => props.data, () => {
  initChart()
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})
</script>

<style scoped>
.bar-chart {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .bar-chart {
    height: 300px;
  }
}
</style>

