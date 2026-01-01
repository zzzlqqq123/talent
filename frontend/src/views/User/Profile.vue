<template>
  <div class="profile-page">
    <div class="container">
      <h1>个人中心</h1>

      <el-card class="profile-card">
        <div class="profile-header">
          <el-avatar :size="80" :src="userInfo?.avatar">
            {{ userInfo?.nickname?.charAt(0) }}
          </el-avatar>
          <div class="user-info">
            <h2>{{ userInfo?.nickname }}</h2>
            <p>{{ userInfo?.email }}</p>
          </div>
        </div>

        <el-divider />

        <el-form :model="formData" label-width="100px">
          <el-form-item label="昵称">
            <el-input v-model="formData.nickname" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="formData.profile.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="other">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="formData.profile.age" :min="1" :max="150" />
          </el-form-item>
          <el-form-item label="职业">
            <el-input v-model="formData.profile.occupation" />
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="formData.profile.location" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saving" @click="handleSave">
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="stats-card">
        <template #header>
          <span>测试统计</span>
        </template>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ stats.testCount || 0 }}</div>
            <div class="stat-label">测试次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalScore || 0 }}</div>
            <div class="stat-label">最高得分</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'
import { getUserProfile, updateProfile, getUserStats } from '@/api/user'

const userStore = useUserStore()

const saving = ref(false)
const userInfo = ref<any>(null)
const stats = ref<any>({})

const formData = reactive({
  nickname: '',
  profile: {
    gender: undefined as 'male' | 'female' | 'other' | undefined,
    age: undefined as number | undefined,
    occupation: '',
    location: ''
  }
})

const fetchUserProfile = async () => {
  try {
    const res = await getUserProfile()
    if (res.success && res.data.user) {
      userInfo.value = res.data.user
      // 只在初始化时更新表单数据，避免在保存后被覆盖
      if (!formData.nickname) {
        formData.nickname = userInfo.value.nickname || ''
      }
      if (Object.keys(formData.profile).length === 0 || !formData.profile.gender) {
        formData.profile = {
          gender: userInfo.value.profile?.gender,
          age: userInfo.value.profile?.age,
          occupation: userInfo.value.profile?.occupation || '',
          location: userInfo.value.profile?.location || ''
        }
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const fetchStats = async () => {
  try {
    const res = await getUserStats()
    if (res.success && res.data.stats) {
      stats.value = res.data.stats
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    await updateProfile(formData)
    ElMessage.success('保存成功')
    // 只更新昵称，不重新获取完整用户信息，避免 profile 被覆盖
    if (formData.nickname) {
      userInfo.value.nickname = formData.nickname
    }
    // 重新获取统计数据
    await fetchStats()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
  fetchStats()
})
</script>

<style scoped>
.profile-page {
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

.profile-card,
.stats-card {
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-info h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.user-info p {
  color: #909399;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}
</style>
