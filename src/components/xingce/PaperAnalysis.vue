<template>
  <div class="paper-analysis">
    <div v-if="papers.length === 0"><EmptyState text="暂无套卷数据，请先上传" /></div>
    <template v-else>
      <van-tabs v-model:active="viewTab" shrink>
        <van-tab title="总趋势" />
        <van-tab title="正确率表格" />
        <van-tab title="分板块正确率" />
        <van-tab title="分板块用时" />
      </van-tabs>
      <div v-show="viewTab === 0" class="glass-card"><div ref="trendChart" class="chart"></div></div>
      <div v-show="viewTab === 1" class="glass-card table-view">
        <div v-for="(p, i) in papers" :key="p.id" class="table-row">
          <span class="row-idx">{{ i + 1 }}</span>
          <span class="row-name">{{ p.paperName }}</span>
          <span class="row-val">{{ getAccuracy(p) }}%</span>
          <span class="row-val">{{ p.totalScore }}分</span>
          <span class="row-val">{{ p.duration || '-' }}min</span>
        </div>
      </div>
      <div v-show="viewTab === 2" class="glass-card"><div ref="subAccChart" class="chart-tall"></div></div>
      <div v-show="viewTab === 3" class="glass-card"><div ref="subTimeChart" class="chart-tall"></div></div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { db } from '../../db/index.js'
import { getSubjectColor } from '../../constants/subjects.js'
import EmptyState from '../shared/EmptyState.vue'

const papers = ref([])
const viewTab = ref(0)
const trendChart = ref(null)
const subAccChart = ref(null)
const subTimeChart = ref(null)

let trendInstance = null
let subAccInstance = null
let subTimeInstance = null

const subjects = ['言语理解', '数量关系', '判断推理', '资料分析', '常识']
const subjectKeys = ['yanyu', 'shuliang', 'panduan', 'ziliao', 'changshi']
const subjectTotals = [40, 15, 40, 20, 20]

function getAccuracy(p) {
  const total = (p.yanyu || 0) + (p.shuliang || 0) + (p.panduan || 0) + (p.ziliao || 0) + (p.changshi || 0)
  const max = 135
  return max > 0 ? Math.round(total / max * 100) : 0
}

onMounted(async () => {
  papers.value = await db.exam_papers.orderBy('date').toArray()
  if (papers.value.length === 0) return
  await nextTick()
  renderAll()
})

watch(viewTab, async () => { await nextTick(); renderAll() })

function renderAll() {
  renderTrend()
  renderSubAcc()
  renderSubTime()
}

function renderTrend() {
  if (!trendChart.value) return
  if (!trendInstance) trendInstance = echarts.init(trendChart.value)
  const xData = papers.value.map((_, i) => `卷${i + 1}`)
  trendInstance.setOption({
    grid: { left: 45, right: 45, top: 30, bottom: 30 },
    legend: { data: ['正确率%', '得分', '用时(min)'], top: 0, textStyle: { fontSize: 11 } },
    xAxis: { type: 'category', data: xData },
    yAxis: [
      { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
      { type: 'value', position: 'right' }
    ],
    series: [
      { name: '正确率%', type: 'line', smooth: true, data: papers.value.map(p => getAccuracy(p)), itemStyle: { color: '#4A90D9' } },
      { name: '得分', type: 'line', smooth: true, yAxisIndex: 1, data: papers.value.map(p => p.totalScore), itemStyle: { color: '#4CAF50' } },
      { name: '用时(min)', type: 'line', smooth: true, yAxisIndex: 1, data: papers.value.map(p => p.duration || 0), itemStyle: { color: '#FF9800' } }
    ]
  }, true)
}

function renderSubAcc() {
  if (!subAccChart.value) return
  if (!subAccInstance) subAccInstance = echarts.init(subAccChart.value)
  const xData = papers.value.map((_, i) => `卷${i + 1}`)
  subAccInstance.setOption({
    grid: { left: 40, right: 16, top: 30, bottom: 30 },
    legend: { data: subjects, top: 0, textStyle: { fontSize: 10 } },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: subjects.map((s, idx) => ({
      name: s, type: 'line', smooth: true,
      data: papers.value.map(p => {
        const val = p[subjectKeys[idx]] || 0
        return Math.round(val / subjectTotals[idx] * 100)
      }),
      itemStyle: { color: getSubjectColor(s) }
    }))
  }, true)
}

function renderSubTime() {
  if (!subTimeChart.value) return
  if (!subTimeInstance) subTimeInstance = echarts.init(subTimeChart.value)
  const xData = papers.value.map((_, i) => `卷${i + 1}`)
  const timeKeys = ['yanyuTime', 'shuliangTime', 'panduanTime', 'ziliaoTime', 'changshiTime']
  subTimeInstance.setOption({
    grid: { left: 40, right: 16, top: 30, bottom: 30 },
    legend: { data: subjects, top: 0, textStyle: { fontSize: 10 } },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}min' } },
    series: subjects.map((s, idx) => ({
      name: s, type: 'line', smooth: true,
      data: papers.value.map(p => p[timeKeys[idx]] || 0),
      itemStyle: { color: getSubjectColor(s) }
    }))
  }, true)
}
</script>

<style scoped>
.chart { width: 100%; height: 240px; }
.chart-tall { width: 100%; height: 300px; }
.table-view { max-height: 400px; overflow-y: auto; }
.table-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--color-border); font-size: 13px; }
.table-row:last-child { border-bottom: none; }
.row-idx { width: 24px; color: var(--color-text-secondary); }
.row-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-val { width: 55px; text-align: right; color: var(--color-text-secondary); }
</style>
