<template>
  <div class="glass-card today-card">
    <div class="today-label">今日学习时长</div>
    <div class="today-time">{{ hours }} 小时 {{ minutes }} 分钟</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../db/index.js'

const hours = ref(0)
const minutes = ref(0)

onMounted(async () => {
  const today = new Date().toISOString().slice(0, 10)
  const todos = await db.todos.where('date').equals(today).toArray()
  const totalSeconds = todos.reduce((sum, t) => sum + (t.elapsedTime || 0), 0)
  hours.value = Math.floor(totalSeconds / 3600)
  minutes.value = Math.floor((totalSeconds % 3600) / 60)
})
</script>

<style scoped>
.today-card { text-align: center; padding: 24px 16px; }
.today-label { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 8px; }
.today-time { font-size: 28px; font-weight: 700; color: var(--color-primary); }
</style>
