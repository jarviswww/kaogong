import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db/index.js'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])

  async function loadByDate(date) {
    todos.value = await db.todos.where('date').equals(date).toArray()
  }

  async function add(todo) {
    await db.todos.add({ ...todo, completed: false, createdAt: Date.now() })
    await loadByDate(todo.date)
  }

  async function toggle(id) {
    const item = await db.todos.get(id)
    await db.todos.update(id, { completed: !item.completed })
    await loadByDate(item.date)
  }

  async function remove(id) {
    const item = await db.todos.get(id)
    const date = item.date
    await db.todos.delete(id)
    await loadByDate(date)
  }

  return { todos, loadByDate, add, toggle, remove }
})
