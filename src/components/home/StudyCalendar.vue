<template>
  <div class="calendar-section">
    <div class="section-header">
      <span class="section-title">学习日历</span>
      <div class="month-nav">
        <van-icon name="arrow-left" @click="prevMonth" />
        <span>{{ year }}年{{ month + 1 }}月</span>
        <van-icon name="arrow" @click="nextMonth" />
      </div>
    </div>
    <div class="calendar-grid">
      <div v-for="d in weekLabels" :key="d" class="cal-header">{{ d }}</div>
      <div v-for="(day, i) in calendarDays" :key="i" class="cal-cell"
           :class="{ today: day.isToday, 'has-record': day.hasRecord, empty: !day.date }"
           @click="day.date && selectDate(day.dateStr)">
        <span>{{ day.date || '' }}</span>
        <span v-if="day.hasRecord" class="dot"></span>
      </div>
    </div>
    <div v-if="selectedEvents.length" class="day-events">
      <div v-for="ev in selectedEvents" :key="ev.id" class="event-item">{{ ev.content }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../db/index.js'
import { getMonthDays, getToday } from '../../utils/date.js'

const weekLabels = ['日', '一', '二', '三', '四', '五', '六']
const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth())
const markedDates = ref(new Set())
const selectedEvents = ref([])

const calendarDays = computed(() => {
  const { firstDay, daysInMonth } = getMonthDays(year.value, month.value)
  const days = []
  for (let i = 0; i < firstDay; i++) days.push({ date: null })
  const todayStr = getToday()
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: d, dateStr, isToday: dateStr === todayStr, hasRecord: markedDates.value.has(dateStr) })
  }
  return days
})

async function loadMarks() {
  const prefix = `${year.value}-${String(month.value + 1).padStart(2, '0')}`
  const events = await db.calendar_events.where('date').startsWith(prefix).toArray()
  const records = await db.study_records.where('date').startsWith(prefix).toArray()
  markedDates.value = new Set([...events.map(e => e.date), ...records.map(r => r.date)])
}

async function selectDate(dateStr) {
  const events = await db.calendar_events.where('date').equals(dateStr).toArray()
  const records = await db.study_records.where('date').equals(dateStr).toArray()
  selectedEvents.value = [
    ...events.map(e => ({ id: e.id, content: e.content })),
    ...records.map(r => ({ id: `r-${r.id}`, content: `${r.subject} - ${r.content}` }))
  ]
}

function prevMonth() { if (month.value === 0) { month.value = 11; year.value-- } else month.value--; loadMarks() }
function nextMonth() { if (month.value === 11) { month.value = 0; year.value++ } else month.value++; loadMarks() }

onMounted(loadMarks)
</script>

<style scoped>
.month-nav { display: flex; align-items: center; gap: 12px; font-size: 14px; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-top: 8px; }
.cal-header { text-align: center; font-size: 12px; color: var(--color-text-secondary); padding: 4px; }
.cal-cell { text-align: center; padding: 8px 4px; font-size: 13px; position: relative; border-radius: 6px; }
.cal-cell.today { background: var(--color-primary); color: white; font-weight: 600; }
.cal-cell.has-record .dot { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--color-primary); }
.cal-cell.today .dot { background: white; }
.day-events { margin-top: 12px; background: var(--color-card); border-radius: var(--radius-card); padding: 12px; }
.event-item { padding: 6px 0; font-size: 13px; border-bottom: 1px solid var(--color-border); }
.event-item:last-child { border-bottom: none; }
</style>
