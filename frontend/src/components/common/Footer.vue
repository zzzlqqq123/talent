<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <!-- 左侧：关于信息 -->
        <div class="footer-section">
          <div class="logo">
            <span class="logo-icon">🎯</span>
            <span class="logo-text">天赋测试系统</span>
          </div>
          <p class="description">
            科学测评，发现潜能，<br>
            助力个人成长与职业发展
          </p>
        </div>

        <!-- 中间：快速链接 -->
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul class="link-list">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/test/intro">开始测试</router-link></li>
            <li><router-link to="/report/history">历史记录</router-link></li>
            <li><router-link to="/about">关于我们</router-link></li>
          </ul>
        </div>

        <!-- 右侧：联系方式 -->
        <div class="footer-section">
          <h4>联系我们</h4>
          <ul class="contact-list">
            <li>
              <el-icon><Message /></el-icon>
              <span>support@talent-test.com</span>
            </li>
            <li>
              <el-icon><Phone /></el-icon>
              <span>400-123-4567</span>
            </li>
            <li>
              <el-icon><Location /></el-icon>
              <span>中国·北京</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="footer-bottom">
        <div class="copyright">
          © {{ currentYear }} 天赋测试系统. All rights reserved.
        </div>
        <div class="footer-links">
          <a href="#" @click.prevent>隐私政策</a>
          <span class="divider">|</span>
          <a href="#" @click.prevent>服务条款</a>
          <span class="divider">|</span>
          <a href="#" @click.prevent>帮助中心</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Message, Phone, Location } from '@element-plus/icons-vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 60px 0 20px;
  margin-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.description {
  color: #bdc3c7;
  line-height: 1.8;
  margin: 0;
}

.footer-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0 0 20px 0;
}

.link-list,
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 12px;
}

.link-list a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-list a:hover {
  color: white;
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #bdc3c7;
}

.contact-list .el-icon {
  color: #3498db;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #34495e;
  color: #95a5a6;
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 10px;
  align-items: center;
}

.footer-links a {
  color: #95a5a6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.divider {
  color: #7f8c8d;
}

/* 响应式 */
@media (max-width: 968px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .app-footer {
    padding: 40px 0 20px;
    margin-top: 40px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>

