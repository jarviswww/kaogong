<template>
  <div class="full-todo-section">
    <div class="section-header">
      <span class="section-title">全部任务</span>
      <van-button size="small" type="primary" @click="showBatch = true">批量添加任务</van-button>
    </div>
    <div v-if="store.todos.length === 0" class="glass-card">
      <EmptyState text="暂无任务" />
    </div>
    <van-swipe-cell v-for="item in store.todos" :key="item.id">
      <div class="glass-card todo-row">
        <div class="todo-info">
          <span class="subject-dot" :style="{ background: getSubjectColor(item.category) }"></span>
          <div class="todo-detail">
            <div class="todo-name">{{ item.title }}</div>
            <div class="todo-meta">
              <span>{{ item.category }}</span>
              <span>预计: {{ item.date }}</span>
              <span v-if="item.elapsedTime">时长: {{ formatTime(item.elapsedTime) }}</span>
              <span v-if="item.actualCompletedAt">完成: {{ formatDate(item.actualCompletedAt) }}</span>
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <van-tag :type="statusType(item.status)" size="medium">{{ item.status || '未开始' }}</van-tag>
          <van-button v-if="item.status === '未开始'" size="mini" type="primary" @click="timer.start(item.id).then(refresh)">开始</van-button>
          <van-button v-else-if="item.status === '进行中' && timer.activeTaskId === item.id" size="mini" type="warning" @click="timer.pause(item.id).then(refresh)">暂停</van-button>
          <van-button v-else-if="item.status === '进行中'" size="mini" type="primary" @click="timer.start(item.id).then(refresh)">继续</van-button>
          <van-button v-if="item.status !== '已结束'" size="mini" type="success" @click="timer.finish(item.id).then(refresh)">完成</van-button>
        </div>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" @click="onDelete(item.id)" style="height:100%" />
      </template>
    </van-swipe-cell>
    <QuickEntryForm v-model:show="showBatch" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useTodoStore } from '../../stores/todo.js'
import { useTimerStore } from '../../stores/timer.js'
import { getSubjectColor } from '../../constants/subjects.js'
import EmptyState from '../shared/EmptyState.vue'
import QuickEntryForm from '../forms/QuickEntryForm.vue'

const store = useTodoStore()
const timer = useTimerStore()
const showBatch = ref(false)

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h${m}m`
  return `${m}m`
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

function statusType(status) {
  if (status === '已结束') return 'success'
  if (status === '进行中') return 'warning'
  return 'default'
}

async function refresh() { await store.loadAll() }

async function onDelete(id) {
  await store.remove(id)
  await refresh()
}

onMounted(refresh)
</script>

<style scoped>
.section-header { display: flex; justify-content: space-between; align-items: center; margin: 16px 0 8px; }
.todo-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; }
.todo-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.subject-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.todo-detail { min-width: 0; }
.todo-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.todo-meta { font-size: 11px; color: var(--color-text-secondary); display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.todo-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
</style>
