import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db/index.js'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])

  async function loadByDate(date) {
    todos.value = await db.todos.where('date').equals(date).toArray()
  }

  async function loadAll() {
    todos.value = await db.todos.orderBy('date').reverse().toArray()
  }

  async function add(todo) {
    await db.todos.add({
      ...todo,
      completed: false,
      status: '未开始',
      elapsedTime: 0,
      actualCompletedAt: null,
      createdAt: Date.now()
    })
  }

  async function remove(id) {
    await db.todos.delete(id)
  }

  async function reload(date) {
    if (date) await loadByDate(date)
    else await loadAll()
  }

  return { todos, loadByDate, loadAll, add, remove, reload }
})
