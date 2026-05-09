<template>
  <div class="clock-header">
    <span class="date-text">{{ dateText }}</span>
    <span class="time-text">{{ timeText }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dateText = ref('')
const timeText = ref('')
let timer = null

function update() {
  const now = new Date()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  dateText.value = `${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`
  timeText.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

onMounted(() => { update(); timer = setInterval(update, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.clock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}
.time-text { font-variant-numeric: tabular-nums; }
</style>
