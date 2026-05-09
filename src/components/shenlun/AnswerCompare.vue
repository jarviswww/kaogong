<template>
  <div class="answer-compare">
    <van-field v-model="selectedLabel" label="选择题目" readonly placeholder="点击选择" @click="showPicker = true" />
    <van-action-sheet v-model:show="showPicker" :actions="pickerActions" @select="onSelect" />
    <div v-if="selected" class="compare-panel">
      <div class="compare-col">
        <h4>我的答案</h4>
        <van-field v-model="selected.myAnswer" type="textarea" rows="8" autosize @blur="saveAnswer" />
      </div>
      <div class="compare-col">
        <h4>参考答案</h4>
        <div class="ref-text">{{ selected.referenceAnswer }}</div>
      </div>
      <div class="score-bar">
        得分：{{ selected.score }} / {{ selected.totalScore }}
      </div>
      <van-field v-model="selected.notes" label="差距分析" type="textarea" rows="3" placeholder="记录差距和改进方向" @blur="saveAnswer" />
    </div>
    <div v-else><EmptyState text="请选择一道题目进行对比" /></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../db/index.js'
import EmptyState from '../shared/EmptyState.vue'

const reviews = ref([])
const selected = ref(null)
const selectedLabel = ref('')
const showPicker = ref(false)
const pickerActions = ref([])

onMounted(async () => {
  reviews.value = await db.essay_reviews.orderBy('date').reverse().toArray()
  pickerActions.value = reviews.value.map(r => ({ name: `${r.paperName} 第${r.questionNum}题 (${r.type})`, id: r.id }))
})

function onSelect(action) {
  selected.value = reviews.value.find(r => r.id === action.id)
  selectedLabel.value = action.name
  showPicker.value = false
}

async function saveAnswer() {
  if (!selected.value) return
  await db.essay_reviews.update(selected.value.id, {
    myAnswer: selected.value.myAnswer,
    notes: selected.value.notes
  })
}
</script>

<style scoped>
.compare-panel { margin-top: 12px; }
.compare-col { background: var(--color-card); border-radius: var(--radius-card); padding: 12px; margin-bottom: 10px; }
.compare-col h4 { font-size: 14px; margin-bottom: 8px; }
.ref-text { font-size: 13px; white-space: pre-wrap; color: var(--color-text-secondary); }
.score-bar { text-align: center; font-size: 15px; font-weight: 600; color: var(--color-primary); padding: 8px; }
</style>
