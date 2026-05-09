<template>
  <div class="daily-analysis">
    <div v-if="records.length === 0"><EmptyState text="暂无刷题数据" /></div>
    <template v-else>
      <div class="glass-card">
        <div class="chart-title">各板块刷题量对比</div>
        <div ref="barChart" class="chart"></div>
      </div>
      <div class="glass-card">
        <div class="chart-header">
          <span class="chart-title">分板块正确率趋势</span>
          <van-dropdown-menu>
            <van-dropdown-item v-model="selectedSubject" :options="subjectOptions" @change="renderLine" />
          </van-dropdown-menu>
        </div>
        <div ref="lineChart" class="chart"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { db } from '../../db/index.js'
import { SUBJECTS, getSubjectColor } from '../../constants/subjects.js'
import EmptyState from '../shared/EmptyState.vue'

const records = ref([])
const barChart = ref(null)
const lineChart = ref(null)
const selectedSubject = ref('资料分析')

const subjectOptions = SUBJECTS.filter(s => s.name !== '申论').map(s => ({ text: s.name, value: s.name }))

let barInstance = null
let lineInstance = null

onMounted(async () => {
  records.value = await db.daily_practice.orderBy('date').toArray()
  if (records.value.length === 0) return
  await nextTick()
  renderBar()
  renderLine()
})

function renderBar() {
  if (!barChart.value) return
  if (!barInstance) barInstance = echarts.init(barChart.value)
  const subjectMap = {}
  records.value.forEach(r => {
    subjectMap[r.subject] = (subjectMap[r.subject] || 0) + (r.totalCount || 0)
  })
  const names = Object.keys(subjectMap)
  barInstance.setOption({
    grid: { left: 40, right: 16, top: 10, bottom: 30 },
    xAxis: { type: 'category', data: names, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: names.map(n => ({ value: subjectMap[n], itemStyle: { color: getSubjectColor(n) } }))
    }]
  }, true)
}

function renderLine() {
  if (!lineChart.value) return
  if (!lineInstance) lineInstance = echarts.init(lineChart.value)
  const filtered = records.value.filter(r => r.subject === selectedSubject.value)
  const xData = filtered.map(r => r.source || r.date)
  const yData = filtered.map(r => r.totalCount > 0 ? Math.round(r.correctCount / r.totalCount * 100) : 0)
  lineInstance.setOption({
    grid: { left: 40, right: 16, top: 10, bottom: 30 },
    xAxis: { type: 'category', data: xData, axisLabel: { fontSize: 10, rotate: 30 } },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'line', smooth: true, data: yData,
      itemStyle: { color: getSubjectColor(selectedSubject.value) },
      areaStyle: { color: getSubjectColor(selectedSubject.value) + '33' }
    }]
  }, true)
}
</script>

<style scoped>
.chart { width: 100%; height: 220px; }
.chart-title { font-size: 14px; font-weight: 500; margin-bottom: 8px; }
.chart-header { display: flex; justify-content: space-between; align-items: center; }
</style>
