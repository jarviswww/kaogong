<template>
  <div class="countdown-section">
    <div v-if="store.countdowns.length === 0">
      <EmptyState text="暂无倒计时，点击下方快捷入口添加" />
    </div>
    <div v-else class="countdown-list">
      <div v-for="item in store.countdowns" :key="item.id" class="countdown-item"
           @longpress="handleDelete(item.id)">
        <div class="countdown-title">{{ item.title }}</div>
        <div class="countdown-time">{{ formatRemaining(item.targetDate) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCountdownStore } from '../../stores/countdown.js'
import { showConfirmDialog } from 'vant'
import EmptyState from '../shared/EmptyState.vue'

const store = useCountdownStore()
onMounted(() => store.load())

function formatRemaining(targetDate) {
  const diff = new Date(targetDate) - new Date()
  if (diff <= 0) return '已到期'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  return `${days}天 ${hours}时 ${mins}分`
}

async function handleDelete(id) {
  try {
    await showConfirmDialog({ title: '确认删除此倒计时？' })
    await store.remove(id)
  } catch {}
}
</script>

<style scoped>
.countdown-list { display: flex; flex-direction: column; gap: 8px; }
.countdown-item {
  background: var(--color-card);
  border-radius: var(--radius-card);
  padding: 14px 16px;
  box-shadow: var(--shadow-card);
  display: flex; justify-content: space-between; align-items: center;
}
.countdown-title { font-size: 15px; font-weight: 500; }
.countdown-time { font-size: 14px; color: var(--color-primary); font-variant-numeric: tabular-nums; }
</style>
