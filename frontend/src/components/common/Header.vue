<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo" @click="goHome">
        <span class="logo-icon">🎯</span>
        <span class="logo-text gradient-text">TalentDNA</span>
      </div>

      <nav class="nav-menu">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/test/intro" class="nav-item">开始测试</router-link>
        <router-link to="/report/history" class="nav-item">历史记录</router-link>
        <router-link to="/about" class="nav-item">关于</router-link>
      </nav>

      <div class="user-section">
        <template v-if="isLoggedIn">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <div class="avatar-container">
                <el-avatar :size="36" :src="userInfo?.avatar" class="user-avatar">
                  {{ userInfo?.nickname?.charAt(0) }}
                </el-avatar>
              </div>
              <span class="username">{{ userInfo?.nickname }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button @click="goLogin" class="header-btn">登录</el-button>
          <el-button type="primary" @click="goRegister" class="header-btn primary">注册</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)

const goHome = () => {
  router.push('/')
}

const goLogin = () => {
  router.push('/auth/login')
}

const goRegister = () => {
  router.push('/auth/register')
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/')
      break
  }
}
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 22px;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.nav-menu {
  display: flex;
  gap: 40px;
}

.nav-item {
  color: #4b5563;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #667eea;
}

.nav-item:hover::after,
.nav-item.router-link-active::after {
  width: 100%;
}

.user-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.header-btn {
  padding: 10px 24px;
  border-radius: 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.header-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.header-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.header-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 1.5rem;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(102, 126, 234, 0.05);
}

.avatar-container {
  position: relative;
}

.user-avatar {
  border: 2px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: #4b5563;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 64px;
  }

  .nav-menu {
    display: none;
  }

  .logo-text {
    display: none;
  }

  .header-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
