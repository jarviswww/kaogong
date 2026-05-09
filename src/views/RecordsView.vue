<template>
  <div class="view-container">
    <h2 style="font-size:18px;margin-bottom:12px">学习记录</h2>
    <div v-if="records.length === 0"><EmptyState text="暂无学习记录" /></div>
    <div v-else>
      <div v-for="group in grouped" :key="group.date" class="record-group">
        <div class="group-date">{{ group.date }}</div>
        <van-cell v-for="r in group.items" :key="r.id" :title="r.content" :label="`${r.subject} · ${r.duration}分钟`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../db/index.js'
import EmptyState from '../components/shared/EmptyState.vue'

const records = ref([])
const grouped = computed(() => {
  const map = {}
  records.value.forEach(r => {
    if (!map[r.date]) map[r.date] = { date: r.date, items: [] }
    map[r.date].items.push(r)
  })
  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
})

onMounted(async () => { records.value = await db.study_records.orderBy('date').reverse().toArray() })
</script>

<style scoped>
.record-group { margin-bottom: 16px; }
.group-date { font-size: 14px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 6px; }
</style>
