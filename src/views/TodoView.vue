<template>
  <div class="view-container">
    <div class="todo-header">
      <h2 style="font-size:18px">任务管理</h2>
      <van-button size="small" type="primary" @click="showAdd = true">添加任务</van-button>
    </div>
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterCategory" :options="categoryOptions" />
      <van-dropdown-item v-model="filterStatus" :options="statusOptions" />
    </van-dropdown-menu>
    <div v-if="filtered.length === 0"><EmptyState text="暂无任务" /></div>
    <van-swipe-cell v-for="t in filtered" :key="t.id">
      <van-cell>
        <template #title>
          <div class="todo-row">
            <van-checkbox v-model="t.completed" @change="toggle(t)" />
            <span :class="{ done: t.completed }">{{ t.title }}</span>
            <van-tag size="small">{{ t.category }}</van-tag>
          </div>
        </template>
        <template #label>{{ t.date }} · {{ t.subject }}</template>
      </van-cell>
      <template #right>
        <van-button type="danger" square text="删除" @click="remove(t.id)" />
      </template>
    </van-swipe-cell>
    <van-popup v-model:show="showAdd" position="bottom" round>
      <div style="padding:20px">
        <h3 style="margin-bottom:12px">添加任务</h3>
        <van-form @submit="addTodo">
          <van-field v-model="form.title" label="标题" placeholder="任务内容" :rules="[{required:true}]" />
          <van-field v-model="form.date" label="日期" readonly @click="showCal = true" />
          <van-field v-model="form.category" label="分类" readonly @click="showCatPicker = true" />
          <van-field v-model="form.subject" label="科目" placeholder="可选" />
          <van-button type="primary" native-type="submit" block>保存</van-button>
        </van-form>
      </div>
    </van-popup>
    <van-calendar v-model:show="showCal" @confirm="d => { form.date = d.toISOString().slice(0,10); showCal = false }" />
    <van-action-sheet v-model:show="showCatPicker" :actions="[{name:'行测'},{name:'申论'},{name:'其他'}]" @select="a => { form.category = a.name; showCatPicker = false }" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { db } from '../db/index.js'
import EmptyState from '../components/shared/EmptyState.vue'

const allTodos = ref([])
const showAdd = ref(false)
const showCal = ref(false)
const showCatPicker = ref(false)
const filterCategory = ref('')
const filterStatus = ref('')
const form = reactive({ title: '', date: new Date().toISOString().slice(0, 10), category: '行测', subject: '' })

const categoryOptions = [{ text: '全部分类', value: '' }, { text: '行测', value: '行测' }, { text: '申论', value: '申论' }, { text: '其他', value: '其他' }]
const statusOptions = [{ text: '全部状态', value: '' }, { text: '未完成', value: 'pending' }, { text: '已完成', value: 'done' }]

const filtered = computed(() => allTodos.value.filter(t => {
  if (filterCategory.value && t.category !== filterCategory.value) return false
  if (filterStatus.value === 'pending' && t.completed) return false
  if (filterStatus.value === 'done' && !t.completed) return false
  return true
}))

async function load() { allTodos.value = await db.todos.orderBy('date').reverse().toArray() }
async function toggle(t) { await db.todos.update(t.id, { completed: t.completed }); await load() }
async function remove(id) { await db.todos.delete(id); await load() }
async function addTodo() {
  await db.todos.add({ ...form, completed: false, status: '未开始', elapsedTime: 0, actualCompletedAt: null, createdAt: Date.now() })
  showAdd.value = false; form.title = ''; await load()
}

onMounted(load)
</script>

<style scoped>
.todo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.todo-row { display: flex; align-items: center; gap: 8px; }
.done { text-decoration: line-through; color: var(--color-text-secondary); }
</style>
