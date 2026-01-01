<template>
  <div class="test-intro-page">
    <div class="container">
      <div class="intro-header">
        <h1 class="title gradient-text">个人天赋测试</h1>
        <p class="subtitle">发现你的独特天赋，找到最适合的发展方向</p>
      </div>

      <div class="intro-content">
        <!-- 测试说明卡片 -->
        <div class="info-card glass-card">
          <div class="card-header">
            <span class="header-icon">📋</span>
            <span>测试说明</span>
          </div>
          <div class="info-list">
            <div class="info-item">
              <el-icon class="item-icon"><Clock /></el-icon>
              <div class="item-content">
                <strong>测试时长：</strong>约15-20分钟
              </div>
            </div>
            <div class="info-item">
              <el-icon class="item-icon"><Document /></el-icon>
              <div class="item-content">
                <strong>题目数量：</strong>{{ questionStats.total || 65 }}道题目
              </div>
            </div>
            <div class="info-item">
              <el-icon class="item-icon"><Warning /></el-icon>
              <div class="item-content">
                <strong>注意事项：</strong>请根据真实感受作答，没有对错之分
              </div>
            </div>
            <div class="info-item">
              <el-icon class="item-icon"><Check /></el-icon>
              <div class="item-content">
                <strong>完成后：</strong>将获得详细的天赋分析报告
              </div>
            </div>
          </div>
        </div>

        <!-- 测试维度卡片 -->
        <div class="dimension-card glass-card">
          <div class="card-header">
            <span class="header-icon">🎯</span>
            <span>测试维度</span>
          </div>
          <div class="dimension-list">
            <div class="dimension-item">
              <div class="dimension-icon">🧠</div>
              <div class="dimension-info">
                <h3>认知能力</h3>
                <p>逻辑思维、学习能力、分析能力、记忆力等</p>
                <el-tag size="small" type="primary">{{ questionStats.byDimension?.cognitive || 20 }}题</el-tag>
              </div>
            </div>
            <div class="dimension-item">
              <div class="dimension-icon">💡</div>
              <div class="dimension-info">
                <h3>创造力</h3>
                <p>创新思维、想象力、艺术感知、突破性思维等</p>
                <el-tag size="small" type="success">{{ questionStats.byDimension?.creativity || 15 }}题</el-tag>
              </div>
            </div>
            <div class="dimension-item">
              <div class="dimension-icon">❤️</div>
              <div class="dimension-info">
                <h3>情感智能</h3>
                <p>情绪管理、同理心、人际关系、社交能力等</p>
                <el-tag size="small" type="warning">{{ questionStats.byDimension?.emotional || 15 }}题</el-tag>
              </div>
            </div>
            <div class="dimension-item">
              <div class="dimension-icon">⚡</div>
              <div class="dimension-info">
                <h3>实践能力</h3>
                <p>执行力、时间管理、问题解决、领导力等</p>
                <el-tag size="small" type="danger">{{ questionStats.byDimension?.practical || 15 }}题</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 答题建议卡片 -->
        <div class="tips-card glass-card">
          <div class="card-header">
            <span class="header-icon">💡</span>
            <span>答题建议</span>
          </div>
          <ul class="tips-list">
            <li>选择安静的环境，确保不被打扰</li>
            <li>根据第一直觉作答，不要过度思考</li>
            <li>诚实回答，这样才能获得准确的结果</li>
            <li>测试过程中可以暂停，答案会自动保存</li>
            <li>完成所有题目后，将生成专属报告</li>
          </ul>
        </div>

        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large" 
            class="start-test-btn"
            :loading="loading"
            @click="handleStartTest"
          >
            开始测试
          </el-button>
          <el-button 
            size="large" 
            class="back-btn"
            @click="$router.push('/')"
          >
            返回首页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, Document, Warning, Check } from '@element-plus/icons-vue'
import { getQuestionStats } from '@/api/test'
import { useTestStore } from '@/store/modules/test'

const router = useRouter()
const testStore = useTestStore()

const loading = ref(false)
const questionStats = ref<any>({
  total: 65,
  byDimension: {
    cognitive: 20,
    creativity: 15,
    emotional: 15,
    practical: 15
  }
})

// 获取题目统计信息
const fetchQuestionStats = async () => {
  try {
    const res = await getQuestionStats()
    if (res.success && res.data) {
      questionStats.value = res.data
    }
  } catch (error) {
    console.error('获取题目统计失败:', error)
  }
}

// 开始测试
const handleStartTest = async () => {
  // 检查是否有未完成的测试
  if (testStore.isInProgress) {
    try {
      await ElMessageBox.confirm(
        '检测到您有未完成的测试，是否继续上次的测试？',
        '提示',
        {
          confirmButtonText: '继续测试',
          cancelButtonText: '重新开始',
          type: 'warning'
        }
      )
      // 继续上次的测试
      router.push(`/test/questions/${testStore.currentPage}`)
      return
    } catch {
      // 用户选择重新开始
      testStore.resetTest()
    }
  }

  loading.value = true
  try {
    // 初始化测试
    await testStore.initTest()
    ElMessage.success('测试已开始，祝您答题愉快！')
    // 跳转到答题页面（第1页）
    router.push('/test/questions/1')
  } catch (error: any) {
    console.error('开始测试失败:', error)
    ElMessage.error(error.message || '开始测试失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchQuestionStats()
  // 尝试恢复测试状态
  testStore.restoreFromLocalStorage()
})
</script>

<style scoped>
.test-intro-page {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #fdf2f8, #eef2ff, #f0f9ff);
  padding: 60px 20px 40px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.intro-header {
  text-align: center;
  margin-bottom: 56px;
}

.title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 20px;
  color: #6b7280;
  font-weight: 500;
}

.intro-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 卡片通用样式 */
.info-card,
.dimension-card,
.tips-card {
  padding: 48px;
  transition: all 0.3s ease;
}

.info-card:hover,
.dimension-card:hover,
.tips-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1f2937;
}

.header-icon {
  font-size: 32px;
}

/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
}

.item-icon {
  font-size: 24px;
  color: #667eea;
  margin-top: 2px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  line-height: 1.7;
  font-size: 16px;
  color: #4b5563;
}

.item-content strong {
  color: #1f2937;
  font-weight: 600;
}

/* 维度列表 */
.dimension-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.dimension-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.dimension-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.12);
}

.dimension-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.dimension-info h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #1f2937;
  font-weight: 700;
}

.dimension-info p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.5;
}

.dimension-info :deep(.el-tag) {
  font-weight: 600;
}

/* 提示列表 */
.tips-list {
  padding-left: 32px;
  line-height: 2.2;
  margin: 0;
}

.tips-list li {
  color: #4b5563;
  font-size: 16px;
  margin-bottom: 8px;
}

.tips-list li::marker {
  color: #667eea;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 32px;
}

.start-test-btn {
  padding: 18px 56px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.start-test-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.back-btn {
  padding: 18px 48px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 1.5rem;
  background: white;
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  transition: all 0.3s ease;
}

.back-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-3px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .title {
    font-size: 40px;
  }

  .subtitle {
    font-size: 18px;
  }

  .info-card,
  .dimension-card,
  .tips-card {
    padding: 40px 32px;
  }
}

@media (max-width: 768px) {
  .test-intro-page {
    padding: 40px 16px 32px;
  }

  .title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 16px;
  }

  .intro-header {
    margin-bottom: 40px;
  }

  .info-card,
  .dimension-card,
  .tips-card {
    padding: 32px 24px;
  }

  .card-header {
    font-size: 20px;
  }

  .dimension-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .start-test-btn,
  .back-btn {
    width: 100%;
    padding: 16px;
    font-size: 16px;
  }
}
</style>
