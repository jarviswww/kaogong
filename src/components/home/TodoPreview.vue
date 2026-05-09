<template>
  <div class="todo-section">
    <div class="section-header">
      <span class="section-title">今日待办</span>
      <span class="section-link" @click="$router.push('/todo')">查看全部</span>
    </div>
    <div v-if="store.todos.length === 0" class="glass-card">
      <EmptyState text="今日暂无待办，休息一下也不错" />
    </div>
    <div v-else class="todo-list">
      <div v-for="item in store.todos.slice(0, 5)" :key="item.id" class="glass-card todo-item">
        <div class="todo-left">
          <span class="subject-dot" :style="{ background: getSubjectColor(item.category) }"></span>
          <span class="todo-title" :class="{ done: item.status === '已结束' }">{{ item.title }}</span>
        </div>
        <div class="todo-right">
          <span v-if="item.elapsedTime || timer.activeTaskId === item.id" class="timer-display">
            {{ timer.getDisplayTime(item.id, item.elapsedTime) }}
          </span>
          <van-button v-if="item.status === '未开始'" size="mini" type="primary" @click="timer.start(item.id).then(refresh)">开始计时</van-button>
          <van-button v-else-if="item.status === '进行中' && timer.activeTaskId === item.id" size="mini" type="warning" @click="timer.pause(item.id).then(refresh)">暂停</van-button>
          <van-button v-else-if="item.status === '进行中'" size="mini" type="primary" @click="timer.start(item.id).then(refresh)">继续</van-button>
          <van-button v-if="item.status !== '已结束'" size="mini" type="success" @click="timer.finish(item.id).then(refresh)">完成</van-button>
          <van-icon v-if="item.status === '已结束'" name="success" color="#4CAF50" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTodoStore } from '../../stores/todo.js'
import { useTimerStore } from '../../stores/timer.js'
import { getSubjectColor } from '../../constants/subjects.js'
import EmptyState from '../shared/EmptyState.vue'

const store = useTodoStore()
const timer = useTimerStore()
const today = new Date().toISOString().slice(0, 10)

async function refresh() { await store.loadByDate(today) }
onMounted(refresh)
</script>

<style scoped>
.todo-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
.todo-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.todo-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.subject-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.todo-title { font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.todo-title.done { text-decoration: line-through; color: var(--color-text-secondary); }
.timer-display { font-size: 12px; font-variant-numeric: tabular-nums; color: var(--color-primary); min-width: 45px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin: 16px 0 8px; }
.section-link { font-size: 13px; color: var(--color-primary); }
</style>
