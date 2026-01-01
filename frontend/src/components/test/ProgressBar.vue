<template>
  <div class="progress-bar-container">
    <div class="progress-info">
      <span class="progress-text">
        已完成 {{ answeredCount }}/{{ total }} 题
      </span>
      <span class="progress-percentage">{{ percentage }}%</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  answeredCount: number
  total: number
}

const props = defineProps<Props>()

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.answeredCount / props.total) * 100)
})
</script>

<style scoped>
.progress-bar-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 24px 32px;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.progress-bar-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-text {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
}

.progress-percentage {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-bar {
  height: 12px;
  background: rgba(229, 231, 235, 0.5);
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 9999px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .progress-bar-container {
    padding: 20px;
    border-radius: 1.25rem;
  }

  .progress-text {
    font-size: 14px;
  }

  .progress-percentage {
    font-size: 18px;
  }

  .progress-bar {
    height: 10px;
  }
}
</style>

