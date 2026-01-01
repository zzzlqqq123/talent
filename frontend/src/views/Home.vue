<template>
  <div class="home-page">
    <!-- Hero Section - TalentDNA 风格 -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">TalentDNA</span>
          </h1>
          <p class="hero-subtitle">解密你的潜在天赋基因，发现真实的自己</p>
          <div class="hero-description">
            基于心理学与行为学模型，我们的系统将分析你的选择，揭示你在逻辑、创意、社交等多个维度的天赋潜能。
          </div>
          <div class="hero-actions">
            <el-button type="primary" size="large" class="start-btn" @click="startTest">
              立即开始评估
            </el-button>
            <el-button size="large" class="learn-btn" @click="goToAbout">
              了解更多
            </el-button>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="illustration-circle">
            <div class="illustration-icon">🧠</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section - TalentDNA 玻璃态风格 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">核心特色</h2>
        <div class="feature-grid">
          <div class="feature-card glass-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">{{ feature.icon }}</span>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section">
      <div class="container">
        <h2 class="section-title">测试流程</h2>
        <div class="process-steps">
          <div class="step" v-for="(step, index) in steps" :key="index">
            <div class="step-number glass">{{ index + 1 }}</div>
            <div class="step-content glass-card">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
            <div class="step-arrow" v-if="index < steps.length - 1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - TalentDNA 风格 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card glass-card">
          <div class="cta-icon">🚀</div>
          <h2 class="cta-title">准备好发现你的天赋了吗？</h2>
          <p class="cta-subtitle">只需15-20分钟，全面了解你的能力优势和发展方向</p>
          <el-button type="primary" size="large" class="cta-btn" @click="startTest">
            立即开始
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const features = [
  {
    icon: '📊',
    title: '四大维度评估',
    desc: '从认知能力、创造力、情感智能、实践能力全面评估你的天赋'
  },
  {
    icon: '📈',
    title: '数据可视化',
    desc: '直观的雷达图和趋势图，清晰展示你的能力分布'
  },
  {
    icon: '📝',
    title: '详细分析报告',
    desc: '专业的天赋分析报告，提供个性化发展建议'
  },
  {
    icon: '🔄',
    title: '成长追踪',
    desc: '记录你的测试历史，追踪能力成长轨迹'
  }
]

const steps = [
  { title: '注册登录', desc: '创建账号，开始你的天赋探索之旅' },
  { title: '回答问题', desc: '65道精心设计的题目，约15-20分钟' },
  { title: '生成报告', desc: '系统自动分析，生成详细报告' },
  { title: '查看结果', desc: '了解你的天赋优势和发展建议' }
]

function startTest() {
  if (!userStore.isLoggedIn) {
    ElMessage.info('请先登录')
    router.push('/auth/login')
  } else {
    router.push('/test/intro')
  }
}

function goToAbout() {
  router.push('/about')
}
</script>

<style scoped>
.home-page {
  flex: 1;
  min-height: 100vh;
}

/* Hero Section - TalentDNA 风格 */
.hero-section {
  padding: 100px 0 80px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.hero-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  max-width: 1400px;
}

.hero-content {
  flex: 1;
  text-align: left;
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -2px;
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 20px;
}

.hero-description {
  font-size: 18px;
  line-height: 1.8;
  color: #6b7280;
  margin-bottom: 40px;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.start-btn {
  padding: 16px 48px;
  font-size: 18px;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

.learn-btn {
  padding: 16px 40px;
  font-size: 18px;
  border-radius: 1.5rem;
  background: white;
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  font-weight: 600;
  transition: all 0.3s ease;
}

.learn-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-3px);
}

.hero-illustration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.illustration-circle {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.illustration-icon {
  font-size: 120px;
}

/* Features Section */
.features-section {
  padding: 100px 0;
  background: rgba(255, 255, 255, 0.5);
}

.section-title {
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 60px;
  color: #1f2937;
  letter-spacing: -1px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon {
  font-size: 40px;
}

.feature-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1f2937;
}

.feature-desc {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.7;
}

/* Process Section */
.process-section {
  padding: 100px 0;
  background: rgba(255, 255, 255, 0.3);
}

.process-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.step {
  flex: 1;
  text-align: center;
  position: relative;
  padding: 20px;
}

.step-number {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  margin: 0 auto 24px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.step-content {
  padding: 24px;
}

.step-content h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
}

.step-content p {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.step-arrow {
  font-size: 30px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
}

/* CTA Section */
.cta-section {
  padding: 100px 0;
}

.cta-card {
  padding: 80px 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.cta-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.cta-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #1f2937;
  letter-spacing: -1px;
}

.cta-subtitle {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-btn {
  padding: 18px 56px;
  font-size: 20px;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
  }

  .hero-content {
    text-align: center;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .illustration-circle {
    width: 280px;
    height: 280px;
  }

  .illustration-icon {
    font-size: 100px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0 40px;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .hero-description {
    font-size: 16px;
  }

  .start-btn,
  .learn-btn {
    padding: 14px 32px;
    font-size: 16px;
  }

  .illustration-circle {
    width: 240px;
    height: 240px;
  }

  .illustration-icon {
    font-size: 80px;
  }

  .section-title {
    font-size: 32px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .process-steps {
    flex-direction: column;
    gap: 40px;
  }

  .step-arrow {
    transform: rotate(90deg);
    right: 50%;
    top: auto;
    bottom: -30px;
  }

  .cta-card {
    padding: 60px 40px;
  }

  .cta-title {
    font-size: 32px;
  }

  .cta-subtitle {
    font-size: 18px;
  }

  .cta-btn {
    padding: 16px 48px;
    font-size: 18px;
  }
}
</style>
