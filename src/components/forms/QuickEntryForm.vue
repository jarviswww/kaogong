<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '80%' }">
    <div class="form-container">
      <h3>批量添加任务</h3>
      <van-form ref="formRef">
        <van-field v-model="form.title" label="任务名" placeholder="输入任务内容" :rules="[{required:true}]" />
        <van-field v-model="form.category" label="科目类型" readonly placeholder="选择科目" @click="showSubjectPicker = true">
          <template #left-icon>
            <span v-if="form.category" class="subject-dot" :style="{background: getSubjectColor(form.category)}"></span>
          </template>
        </van-field>
        <van-field v-model="form.date" label="预计完成" readonly placeholder="选择日期" @click="showCal = true" />
      </van-form>
      <div class="btn-row">
        <van-button type="primary" block @click="addAndContinue">添加任务</van-button>
        <van-button block @click="show = false" style="margin-top:8px">完成</van-button>
      </div>
      <div v-if="addedCount > 0" class="added-hint">已添加 {{ addedCount }} 个任务</div>
    </div>
    <van-action-sheet v-model:show="showSubjectPicker" :actions="subjectActions" @select="onSubjectSelect" />
    <van-calendar v-model:show="showCal" @confirm="onDateConfirm" :max-date="maxDate" />
  </van-popup>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useTodoStore } from '../../stores/todo.js'
import { SUBJECTS, getSubjectColor } from '../../constants/subjects.js'
import { showToast } from 'vant'

const show = defineModel('show', { type: Boolean })
const store = useTodoStore()
const showSubjectPicker = ref(false)
const showCal = ref(false)
const addedCount = ref(0)
const maxDate = new Date(2030, 11, 31)
const form = reactive({ title: '', category: '', date: '' })

const subjectActions = SUBJECTS.map(s => ({ name: s.name, color: s.color }))

function onSubjectSelect(action) { form.category = action.name; showSubjectPicker.value = false }
function onDateConfirm(date) { form.date = date.toISOString().slice(0, 10); showCal.value = false }

async function addAndContinue() {
  if (!form.title || !form.category || !form.date) { showToast('请填写完整'); return }
  await store.add({ title: form.title, category: form.category, subject: form.category, date: form.date })
  addedCount.value++
  form.title = ''
  showToast('已添加')
}
</script>

<style scoped>
.form-container { padding: 20px; }
.form-container h3 { margin-bottom: 16px; font-size: 16px; }
.btn-row { margin-top: 16px; }
.added-hint { text-align: center; margin-top: 12px; font-size: 13px; color: var(--color-text-secondary); }
.subject-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 4px; }
</style>
