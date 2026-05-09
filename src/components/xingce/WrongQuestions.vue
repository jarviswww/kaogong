<template>
  <div class="wrong-questions">
    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="filterSubject" :options="subjectOptions" />
        <van-dropdown-item v-model="filterReason" :options="reasonOptions" />
        <van-dropdown-item v-model="filterMastered" :options="masteredOptions" />
      </van-dropdown-menu>
    </div>
    <div class="stats-row">
      <div class="stat-card">总错题<br/><strong>{{ filtered.length }}</strong></div>
      <div class="stat-card">已掌握<br/><strong>{{ filtered.filter(q => q.mastered).length }}</strong></div>
    </div>
    <div v-if="filtered.length === 0"><EmptyState text="暂无错题记录" /></div>
    <van-collapse v-else v-model="expanded">
      <van-collapse-item v-for="q in filtered" :key="q.id" :name="q.id"
        :title="`${q.source} #${q.questionNum}`" :label="q.subject">
        <van-tag :type="q.mastered ? 'success' : 'warning'" size="small">{{ q.mastered ? '已掌握' : '未掌握' }}</van-tag>
        <van-tag size="small" style="margin-left:4px">{{ q.wrongReason }}</van-tag>
        <p style="margin-top:8px;font-size:13px">{{ q.analysis }}</p>
        <van-button size="small" type="primary" @click="toggleMastered(q)">
          {{ q.mastered ? '标记未掌握' : '标记已掌握' }}
        </van-button>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../db/index.js'
import EmptyState from '../shared/EmptyState.vue'

const questions = ref([])
const expanded = ref([])
const filterSubject = ref('')
const filterReason = ref('')
const filterMastered = ref('')

const subjectOptions = [{ text: '全部科目', value: '' }, { text: '言语', value: '言语' }, { text: '数量', value: '数量' }, { text: '判断', value: '判断' }, { text: '资料', value: '资料' }, { text: '常识', value: '常识' }]
const reasonOptions = [{ text: '全部错因', value: '' }, { text: '粗心', value: '粗心' }, { text: '知识点不熟', value: '知识点不熟' }, { text: '方法不对', value: '方法不对' }, { text: '蒙错', value: '蒙错' }]
const masteredOptions = [{ text: '全部状态', value: '' }, { text: '已掌握', value: 'true' }, { text: '未掌握', value: 'false' }]

const filtered = computed(() => {
  return questions.value.filter(q => {
    if (filterSubject.value && q.subject !== filterSubject.value) return false
    if (filterReason.value && q.wrongReason !== filterReason.value) return false
    if (filterMastered.value === 'true' && !q.mastered) return false
    if (filterMastered.value === 'false' && q.mastered) return false
    return true
  })
})

async function toggleMastered(q) {
  await db.wrong_questions.update(q.id, { mastered: !q.mastered })
  q.mastered = !q.mastered
}

onMounted(async () => { questions.value = await db.wrong_questions.orderBy('date').reverse().toArray() })
</script>

<style scoped>
.stats-row { display: flex; gap: 12px; margin: 12px 0; }
.stat-card { flex: 1; background: var(--color-card); border-radius: var(--radius-card); padding: 12px; text-align: center; font-size: 13px; box-shadow: var(--shadow-card); }
</style>
