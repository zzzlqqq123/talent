<template>
  <div class="settings-page">
    <div class="container">
      <h1>设置</h1>

      <el-card>
        <template #header>
          <span>修改密码</span>
        </template>
        <el-form 
          ref="formRef"
          :model="formData" 
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input 
              v-model="formData.oldPassword" 
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input 
              v-model="formData.newPassword" 
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              :loading="loading"
              @click="handleSubmit"
            >
              修改密码
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { updatePassword } from '@/api/user'

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formData.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    await updatePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword
    })

    ElMessage.success('密码修改成功，请重新登录')
    
    // 重置表单
    formRef.value.resetFields()
    
    // 清除token，跳转到登录页
    setTimeout(() => {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }, 2000)
  } catch (error: any) {
    console.error('修改密码失败:', error)
    if (error?.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('修改密码失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.container h1 {
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
}
</style>
