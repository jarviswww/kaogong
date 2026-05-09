<template>
  <div class="todo-section">
    <div class="section-header">
      <span class="section-title">今日待办</span>
      <span class="section-link" @click="$router.push('/todo')">查看全部</span>
    </div>
    <div v-if="store.todos.length === 0">
      <EmptyState text="今日暂无待办，休息一下也不错" />
    </div>
    <div v-else class="todo-list">
      <div v-for="item in store.todos.slice(0, 5)" :key="item.id" class="todo-item">
        <van-checkbox v-model="item.completed" @change="store.toggle(item.id)" />
        <span class="todo-title" :class="{ done: item.completed }">{{ item.title }}</span>
        <van-tag type="primary" size="small">{{ item.category }}</van-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTodoStore } from '../../stores/todo.js'
import EmptyState from '../shared/EmptyState.vue'

const store = useTodoStore()
const today = new Date().toISOString().slice(0, 10)
onMounted(() => store.loadByDate(today))
</script>

<style scoped>
.section-header { display: flex; justify-content: space-between; align-items: center; margin: 16px 0 8px; }
.section-title { font-size: 16px; font-weight: 600; }
.section-link { font-size: 13px; color: var(--color-primary); }
.todo-list { background: var(--color-card); border-radius: var(--radius-card); padding: 12px; box-shadow: var(--shadow-card); }
.todo-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--color-border); }
.todo-item:last-child { border-bottom: none; }
.todo-title.done { text-decoration: line-through; color: var(--color-text-secondary); }
</style>
