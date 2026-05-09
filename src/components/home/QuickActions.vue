<template>
  <div class="quick-actions">
    <div class="section-header"><span class="section-title">快捷入口</span></div>
    <div class="actions-grid">
      <div v-for="action in actions" :key="action.label" class="action-btn glass-card" @click="action.handler">
        <van-icon :name="action.icon" size="24" color="var(--color-primary)" />
        <span>{{ action.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['open-form'])

const actions = [
  { icon: 'plus', label: '批量添加', handler: () => emit('open-form', 'batch') },
  { icon: 'records', label: '刷题记录', handler: () => emit('open-form', 'practice') },
  { icon: 'bar-chart-o', label: '上传行测', handler: () => emit('open-form', 'paper') },
  { icon: 'clock-o', label: '设置倒计时', handler: () => emit('open-form', 'countdown') },
  { icon: 'delete-o', label: '删除倒计时', handler: () => emit('open-form', 'countdown-delete') },
  { icon: 'description', label: '上传申论', handler: () => emit('open-form', 'essay') },
  { icon: 'warning-o', label: '错题录入', handler: () => emit('open-form', 'wrong') }
]
</script>

<style scoped>
.section-header { display: flex; justify-content: space-between; align-items: center; margin: 16px 0 8px; }
.actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 8px; }
.action-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 12px 4px; font-size: 12px; color: var(--color-text); cursor: pointer;
}
</style>
