import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db/index.js'

export const useCountdownStore = defineStore('countdown', () => {
  const countdowns = ref([])

  async function load() {
    countdowns.value = await db.countdowns.orderBy('targetDate').toArray()
  }

  async function add(title, targetDate) {
    await db.countdowns.add({ title, targetDate, createdAt: Date.now() })
    await load()
  }

  async function remove(id) {
    await db.countdowns.delete(id)
    await load()
  }

  return { countdowns, load, add, remove }
})
