<template>
  <div class="essay-review">
    <div v-if="reviews.length === 0"><EmptyState text="暂无申论数据，请先上传" /></div>
    <van-collapse v-else v-model="expanded">
      <van-collapse-item v-for="r in grouped" :key="r.key" :name="r.key" :title="r.key">
        <div v-for="item in r.items" :key="item.id" class="review-item">
          <div class="review-header">
            <span>第{{ item.questionNum }}题 · {{ item.type }}</span>
            <van-tag type="primary">{{ item.score }}/{{ item.totalScore }}</van-tag>
          </div>
          <div class="review-body">
            <div class="answer-block"><strong>我的答案：</strong><p>{{ item.myAnswer }}</p></div>
            <div class="answer-block"><strong>参考答案：</strong><p>{{ item.referenceAnswer }}</p></div>
            <div v-if="item.notes" class="notes"><strong>复盘：</strong>{{ item.notes }}</div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../db/index.js'
import EmptyState from '../shared/EmptyState.vue'

const reviews = ref([])
const expanded = ref([])

const grouped = computed(() => {
  const map = {}
  reviews.value.forEach(r => {
    const key = `${r.year} ${r.paperName}`
    if (!map[key]) map[key] = { key, items: [] }
    map[key].items.push(r)
  })
  return Object.values(map)
})

onMounted(async () => { reviews.value = await db.essay_reviews.orderBy('date').reverse().toArray() })
</script>

<style scoped>
.review-item { padding: 10px 0; border-bottom: 1px solid var(--color-border); }
.review-item:last-child { border-bottom: none; }
.review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.answer-block { margin: 6px 0; font-size: 13px; }
.answer-block p { margin-top: 4px; white-space: pre-wrap; color: var(--color-text-secondary); }
.notes { font-size: 13px; margin-top: 6px; color: var(--color-primary); }
</style>
