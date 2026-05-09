import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db/index.js'

export const useTimerStore = defineStore('timer', () => {
  const activeTaskId = ref(null)
  const startedAt = ref(null)
  const currentElapsed = ref(0)
  let ticker = null

  function startTicker() {
    stopTicker()
    ticker = setInterval(() => {
      if (startedAt.value) {
        currentElapsed.value = Math.floor((Date.now() - startedAt.value) / 1000)
      }
    }, 1000)
  }

  function stopTicker() {
    if (ticker) { clearInterval(ticker); ticker = null }
    currentElapsed.value = 0
  }

  async function start(taskId) {
    if (activeTaskId.value && activeTaskId.value !== taskId) {
      await pause(activeTaskId.value)
    }
    activeTaskId.value = taskId
    startedAt.value = Date.now()
    await db.todos.update(taskId, { status: '进行中' })
    startTicker()
  }

  async function pause(taskId) {
    if (activeTaskId.value !== taskId) return
    const elapsed = Math.floor((Date.now() - startedAt.value) / 1000)
    const todo = await db.todos.get(taskId)
    await db.todos.update(taskId, { elapsedTime: (todo.elapsedTime || 0) + elapsed })
    activeTaskId.value = null
    startedAt.value = null
    stopTicker()
  }

  async function finish(taskId) {
    let elapsed = 0
    if (activeTaskId.value === taskId && startedAt.value) {
      elapsed = Math.floor((Date.now() - startedAt.value) / 1000)
    }
    const todo = await db.todos.get(taskId)
    await db.todos.update(taskId, {
      elapsedTime: (todo.elapsedTime || 0) + elapsed,
      status: '已结束',
      completed: true,
      actualCompletedAt: Date.now()
    })
    if (activeTaskId.value === taskId) {
      activeTaskId.value = null
      startedAt.value = null
      stopTicker()
    }
  }

  function getDisplayTime(taskId, baseElapsed) {
    const extra = (activeTaskId.value === taskId) ? currentElapsed.value : 0
    const total = (baseElapsed || 0) + extra
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return { activeTaskId, currentElapsed, start, pause, finish, getDisplayTime }
})
