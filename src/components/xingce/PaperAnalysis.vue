<template>
  <div class="paper-analysis">
    <div v-if="papers.length === 0"><EmptyState text="暂无套卷数据，请先上传" /></div>
    <template v-else>
      <div class="chart-card"><div ref="trendChart" class="chart"></div></div>
      <div class="chart-card"><div ref="radarChart" class="chart"></div></div>
      <div class="chart-card">
        <van-field v-model="selectedPaper" label="选择套卷" readonly @click="showPicker = true" />
        <div ref="barChart" class="chart"></div>
      </div>
    </template>
    <van-action-sheet v-model:show="showPicker" :actions="paperActions" @select="onSelectPaper" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { db } from '../../db/index.js'
import EmptyState from '../shared/EmptyState.vue'

const papers = ref([])
const trendChart = ref(null)
const radarChart = ref(null)
const barChart = ref(null)
const selectedPaper = ref('')
const showPicker = ref(false)
const paperActions = ref([])

onMounted(async () => {
  papers.value = await db.exam_papers.orderBy('date').toArray()
  if (papers.value.length === 0) return
  paperActions.value = papers.value.map(p => ({ name: p.paperName, id: p.id }))
  await nextTick()
  renderTrend()
  renderRadar()
  if (papers.value.length > 0) {
    selectedPaper.value = papers.value[papers.value.length - 1].paperName
    renderBar(papers.value[papers.value.length - 1])
  }
})

function renderTrend() {
  const chart = echarts.init(trendChart.value)
  chart.setOption({
    grid: { left: 40, right: 16, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: papers.value.map(p => p.date) },
    yAxis: { type: 'value', min: 0 },
    series: [{ type: 'line', data: papers.value.map(p => p.totalScore), smooth: true, itemStyle: { color: '#4A90D9' } }]
  })
}

function renderRadar() {
  const chart = echarts.init(radarChart.value)
  const latest = papers.value[papers.value.length - 1]
  chart.setOption({
    radar: { indicator: [
      { name: '言语', max: 40 }, { name: '数量', max: 15 },
      { name: '判断', max: 40 }, { name: '资料', max: 20 }, { name: '常识', max: 20 }
    ]},
    series: [{ type: 'radar', data: [{ value: [latest.yanyu, latest.shuliang, latest.panduan, latest.ziliao, latest.changshi] }] }]
  })
}

function renderBar(paper) {
  const chart = echarts.init(barChart.value)
  chart.setOption({
    grid: { left: 50, right: 16, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: ['言语', '数量', '判断', '资料', '常识'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [paper.yanyu, paper.shuliang, paper.panduan, paper.ziliao, paper.changshi], itemStyle: { color: '#4A90D9' } }]
  })
}

function onSelectPaper(action) {
  selectedPaper.value = action.name
  const paper = papers.value.find(p => p.id === action.id)
  renderBar(paper)
  showPicker.value = false
}
</script>

<style scoped>
.chart-card { background: var(--color-card); border-radius: var(--radius-card); padding: 12px; margin-bottom: 12px; box-shadow: var(--shadow-card); }
.chart { width: 100%; height: 220px; }
</style>
