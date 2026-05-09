<template>
  <div class="glass-card pie-section">
    <van-tabs v-model:active="activeTab" shrink>
      <van-tab title="今日" />
      <van-tab title="昨日" />
      <van-tab title="历史总数据" />
    </van-tabs>
    <div class="charts-row">
      <div ref="leftChart" class="chart-box"></div>
      <div v-if="activeTab < 2" ref="rightChart" class="chart-box"></div>
      <div v-else class="total-display">
        <div class="total-label">累计学习</div>
        <div class="total-value">{{ totalHours }}</div>
        <div class="total-unit">小时</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { db } from '../../db/index.js'
import { getSubjectColor } from '../../constants/subjects.js'

const activeTab = ref(0)
const leftChart = ref(null)
const rightChart = ref(null)
const totalHours = ref('0')

let leftInstance = null
let rightInstance = null

function getDateStr(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

async function loadDayData(date) {
  const todos = await db.todos.where('date').equals(date).toArray()
  const taskData = todos.filter(t => t.elapsedTime > 0).map(t => ({
    name: t.title,
    value: Math.round(t.elapsedTime / 60)
  }))
  const subjectMap = {}
  todos.forEach(t => {
    if (t.elapsedTime > 0) {
      const cat = t.category || '未分类'
      subjectMap[cat] = (subjectMap[cat] || 0) + t.elapsedTime
    }
  })
  const subjectData = Object.entries(subjectMap).map(([name, val]) => ({
    name,
    value: Math.round(val / 60),
    itemStyle: { color: getSubjectColor(name) }
  }))
  return { taskData, subjectData }
}

async function loadHistoryData() {
  const todos = await db.todos.toArray()
  const subjectMap = {}
  let totalSec = 0
  todos.forEach(t => {
    if (t.elapsedTime > 0) {
      totalSec += t.elapsedTime
      const cat = t.category || '未分类'
      subjectMap[cat] = (subjectMap[cat] || 0) + t.elapsedTime
    }
  })
  totalHours.value = (totalSec / 3600).toFixed(1)
  return Object.entries(subjectMap).map(([name, val]) => ({
    name,
    value: Math.round(val / 60),
    itemStyle: { color: getSubjectColor(name) }
  }))
}

function renderPie(instance, el, data, title) {
  if (!el) return null
  if (!instance) instance = echarts.init(el)
  instance.setOption({
    title: { text: title, left: 'center', top: 0, textStyle: { fontSize: 12, color: '#4a4a6a' } },
    tooltip: { trigger: 'item', formatter: '{b}: {c}分钟' },
    series: [{
      type: 'pie', radius: ['30%', '65%'], center: ['50%', '55%'],
      data: data.length > 0 ? data : [{ name: '暂无数据', value: 1, itemStyle: { color: '#eee' } }],
      label: { fontSize: 10 }
    }]
  }, true)
  return instance
}

async function refresh() {
  await nextTick()
  if (activeTab.value < 2) {
    const offset = activeTab.value === 0 ? 0 : -1
    const { taskData, subjectData } = await loadDayData(getDateStr(offset))
    leftInstance = renderPie(leftInstance, leftChart.value, taskData, '任务用时(分钟)')
    rightInstance = renderPie(rightInstance, rightChart.value, subjectData, '科目分布(分钟)')
  } else {
    const data = await loadHistoryData()
    leftInstance = renderPie(leftInstance, leftChart.value, data, '累计科目分布(分钟)')
    if (rightInstance) { rightInstance.dispose(); rightInstance = null }
  }
}

watch(activeTab, refresh)
onMounted(refresh)
</script>

<style scoped>
.pie-section { padding: 12px; }
.charts-row { display: flex; align-items: center; margin-top: 12px; }
.chart-box { width: 50%; height: 200px; }
.total-display { width: 50%; text-align: center; }
.total-label { font-size: 13px; color: var(--color-text-secondary); }
.total-value { font-size: 36px; font-weight: 700; color: var(--color-primary); margin: 8px 0 4px; }
.total-unit { font-size: 13px; color: var(--color-text-secondary); }
</style>
