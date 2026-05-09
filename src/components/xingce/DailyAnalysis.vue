<template>
  <div class="daily-analysis">
    <div v-if="records.length === 0"><EmptyState text="暂无刷题数据" /></div>
    <template v-else>
      <div class="chart-card"><div ref="accuracyChart" class="chart"></div></div>
      <div class="chart-card"><div ref="volumeChart" class="chart"></div></div>
      <div class="chart-card progress-card">
        <div class="progress-label">本周刷题进度</div>
        <div ref="progressChart" class="chart-sm"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { db } from '../../db/index.js'
import EmptyState from '../shared/EmptyState.vue'

const records = ref([])
const accuracyChart = ref(null)
const volumeChart = ref(null)
const progressChart = ref(null)

onMounted(async () => {
  records.value = await db.daily_practice.orderBy('date').toArray()
  if (records.value.length === 0) return
  await nextTick()
  renderAccuracy()
  renderVolume()
  renderProgress()
})

function renderAccuracy() {
  const chart = echarts.init(accuracyChart.value)
  const subjects = [...new Set(records.value.map(r => r.subject))]
  const dates = [...new Set(records.value.map(r => r.date))].sort()
  chart.setOption({
    grid: { left: 40, right: 16, top: 30, bottom: 30 },
    legend: { data: subjects, top: 0, textStyle: { fontSize: 11 } },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: subjects.map(s => ({
      name: s, type: 'line', smooth: true,
      data: dates.map(d => {
        const r = records.value.find(x => x.date === d && x.subject === s)
        return r ? Math.round(r.correctCount / r.totalCount * 100) : null
      })
    }))
  })
}

function renderVolume() {
  const chart = echarts.init(volumeChart.value)
  const subjects = [...new Set(records.value.map(r => r.subject))]
  const dates = [...new Set(records.value.map(r => r.date))].sort()
  chart.setOption({
    grid: { left: 40, right: 16, top: 30, bottom: 30 },
    legend: { data: subjects, top: 0, textStyle: { fontSize: 11 } },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: subjects.map(s => ({
      name: s, type: 'bar', stack: 'total',
      data: dates.map(d => {
        const r = records.value.find(x => x.date === d && x.subject === s)
        return r ? r.totalCount : 0
      })
    }))
  })
}

function renderProgress() {
  const chart = echarts.init(progressChart.value)
  const weekTotal = records.value.filter(r => {
    const d = new Date(r.date)
    const now = new Date()
    const weekAgo = new Date(now - 7 * 86400000)
    return d >= weekAgo
  }).reduce((sum, r) => sum + r.totalCount, 0)
  const goal = 200
  chart.setOption({
    series: [{
      type: 'gauge', startAngle: 90, endAngle: -270, min: 0, max: goal,
      pointer: { show: false },
      progress: { show: true, width: 12, roundCap: true, itemStyle: { color: '#4A90D9' } },
      axisLine: { lineStyle: { width: 12, color: [[1, '#E8E8E8']] } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      detail: { formatter: `${weekTotal}/${goal}题`, fontSize: 14, offsetCenter: [0, 0] },
      data: [{ value: Math.min(weekTotal, goal) }]
    }]
  })
}
</script>

<style scoped>
.chart-card { background: var(--color-card); border-radius: var(--radius-card); padding: 12px; margin-bottom: 12px; box-shadow: var(--shadow-card); }
.chart { width: 100%; height: 220px; }
.chart-sm { width: 100%; height: 160px; }
.progress-label { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
</style>
