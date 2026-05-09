<template>
  <div class="data-table">
    <van-tabs v-model:active="tableTab">
      <van-tab title="套卷数据">
        <div v-if="papers.length === 0"><EmptyState text="暂无套卷数据" /></div>
        <van-swipe-cell v-for="p in papers" :key="p.id">
          <van-cell :title="p.paperName" :label="`${p.date} | ${p.type} | ${p.totalScore}分`" />
          <template #right>
            <van-button type="danger" square text="删除" @click="deletePaper(p.id)" />
          </template>
        </van-swipe-cell>
      </van-tab>
      <van-tab title="刷题数据">
        <div v-if="practices.length === 0"><EmptyState text="暂无刷题数据" /></div>
        <van-swipe-cell v-for="p in practices" :key="p.id">
          <van-cell :title="`${p.subject} ${p.correctCount}/${p.totalCount}`" :label="`${p.date} | ${p.source}`" />
          <template #right>
            <van-button type="danger" square text="删除" @click="deletePractice(p.id)" />
          </template>
        </van-swipe-cell>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../db/index.js'
import { showConfirmDialog } from 'vant'
import EmptyState from '../shared/EmptyState.vue'

const tableTab = ref(0)
const papers = ref([])
const practices = ref([])

async function load() {
  papers.value = await db.exam_papers.orderBy('date').reverse().toArray()
  practices.value = await db.daily_practice.orderBy('date').reverse().toArray()
}

async function deletePaper(id) {
  await showConfirmDialog({ title: '确认删除？' })
  await db.exam_papers.delete(id)
  await load()
}

async function deletePractice(id) {
  await showConfirmDialog({ title: '确认删除？' })
  await db.daily_practice.delete(id)
  await load()
}

onMounted(load)
</script>
