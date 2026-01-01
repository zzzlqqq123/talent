<template>
  <div class="question-card">
    <div class="question-header">
      <span class="question-number">第 {{ questionNumber }} 题</span>
      <el-tag :type="categoryType" size="small">{{ categoryLabel }}</el-tag>
    </div>
    
    <div class="question-content">
      <p class="question-text">{{ question.questionText }}</p>
    </div>

    <div class="question-options">
      <div
        v-for="option in question.options"
        :key="option.value"
        class="option-item"
        :class="{ 'is-selected': selectedValue === option.value }"
        @click="handleSelect(option.value)"
      >
        <div class="option-radio">
          <div v-if="selectedValue === option.value" class="radio-dot"></div>
        </div>
        <div class="option-content">
          <span class="option-label">{{ option.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: number
  label: string
}

interface Question {
  _id: string
  questionText: string
  category: string
  dimension: string
  options: Option[]
  order: number
}

interface Props {
  question: Question
  questionNumber: number
  modelValue?: number
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedValue = computed(() => props.modelValue)

const categoryType = computed(() => {
  const typeMap: Record<string, any> = {
    cognitive: '',
    creativity: 'success',
    emotional: 'warning',
    practical: 'danger'
  }
  return typeMap[props.question.category] || ''
})

const categoryLabel = computed(() => {
  const labelMap: Record<string, string> = {
    cognitive: '认知能力',
    creativity: '创造力',
    emotional: '情感智能',
    practical: '实践能力'
  }
  return labelMap[props.question.category] || props.question.category
})

const handleSelect = (value: number) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.question-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 2rem;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.question-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.question-number {
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.question-content {
  margin-bottom: 32px;
}

.question-text {
  font-size: 20px;
  line-height: 1.8;
  color: #1f2937;
  margin: 0;
  font-weight: 500;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
}

.option-item:hover {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.option-item.is-selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
}

.option-item.is-selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 0 0 4px;
}

.option-radio {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
  background: white;
}

.option-item.is-selected .option-radio {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.radio-dot {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.option-content {
  flex: 1;
}

.option-label {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.5;
}

.option-item.is-selected .option-label {
  color: #1f2937;
  font-weight: 600;
}

@media (max-width: 768px) {
  .question-card {
    padding: 28px 20px;
    border-radius: 1.5rem;
  }

  .question-text {
    font-size: 18px;
  }

  .option-item {
    padding: 16px 20px;
    border-radius: 1rem;
  }

  .option-label {
    font-size: 15px;
  }
}
</style>

