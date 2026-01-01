<template>
  <div class="loading-overlay" v-if="visible">
    <div class="loading-content">
      <el-icon class="is-loading" :size="size"><Loading /></el-icon>
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

interface Props {
  visible: boolean
  text?: string
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 40
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-content .el-icon {
  color: #667eea;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: #606266;
  margin: 0;
}
</style>
