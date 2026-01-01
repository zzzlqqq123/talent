<template>
  <div class="login-page">
    <div class="login-container glass-card">
      <!-- Logo 部分 -->
      <div class="login-header">
        <div class="logo-wrapper">
          <span class="logo-icon">🎯</span>
          <h1 class="logo-title gradient-text">TalentDNA</h1>
        </div>
        <p class="login-subtitle">欢迎回来</p>
      </div>

      <!-- 登录表单 -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="formData.email"
            placeholder="邮箱"
            size="large"
            prefix-icon="Message"
            class="input-field"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="密码"
            size="large"
            prefix-icon="Lock"
            show-password
            class="input-field"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            native-type="submit"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <span>还没有账号？</span>
          <router-link to="/auth/register" class="link">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/auth'
import { useUserStore } from '@/store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  email: '',
  password: ''
})

const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const res = await login({
      email: formData.email,
      password: formData.password
    })

    // 保存token和用户信息
    userStore.setToken(res.data.token)
    userStore.setUserInfo(res.data.user)

    ElMessage.success('登录成功')

    // 跳转到重定向页面或首页
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error: any) {
    console.error('Login failed:', error)
    // 错误信息已由 request.ts 拦截器处理并显示，这里不再重复显示
    // 不清空表单，保留用户输入
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top right, #fdf2f8, #eef2ff, #f0f9ff);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.login-page::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -20%;
  width: 50%;
  height: 150%;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.login-container {
  width: 100%;
  max-width: 440px;
  padding: 56px 48px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 64px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.logo-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0;
}

.login-subtitle {
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.login-form :deep(.el-input__wrapper) {
  padding: 12px 16px;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(102, 126, 234, 0.1);
  box-shadow: none;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: rgba(102, 126, 234, 0.2);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-form :deep(.el-input__inner) {
  font-size: 16px;
  color: #1f2937;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #9ca3af;
}

.login-form :deep(.el-input__prefix) {
  color: #9ca3af;
}

.login-button {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 15px;
  color: #6b7280;
}

.link {
  color: #667eea;
  text-decoration: none;
  margin-left: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 40px 32px;
    max-width: 100%;
  }

  .logo-icon {
    font-size: 56px;
  }

  .logo-title {
    font-size: 32px;
  }

  .login-subtitle {
    font-size: 15px;
  }

  .login-button {
    padding: 14px;
    font-size: 16px;
  }
}
</style>
