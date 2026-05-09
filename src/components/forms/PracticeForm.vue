<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '80%' }">
    <div class="form-container">
      <div class="form-header">
        <span class="form-title">刷题记录</span>
        <van-icon name="cross" @click="show = false" />
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.date"
            is-link
            readonly
            label="日期"
            placeholder="请选择日期"
            @click="showCalendar = true"
            :rules="[{ required: true }]"
          />
          <van-field
            v-model="form.subject"
            is-link
            readonly
            label="科目"
            placeholder="请选择科目"
            @click="showSubject = true"
            :rules="[{ required: true }]"
          />
          <van-field v-model="form.totalCount" type="digit" label="总题数" placeholder="请输入总题数" :rules="[{ required: true }]" />
          <van-field v-model="form.correctCount" type="digit" label="正确数" placeholder="请输入正确数" :rules="[{ required: true }]" />
          <van-field v-model="form.duration" type="digit" label="用时(分钟)" placeholder="请输入用时" />
          <van-field v-model="form.source" label="来源" placeholder="请输入题目来源" />
        </van-cell-group>
        <div class="form-actions">
          <van-button type="primary" native-type="submit" block round>保存</van-button>
        </div>
      </van-form>
      <van-calendar v-model:show="showCalendar" @confirm="onDateConfirm" />
      <van-action-sheet
        v-model:show="showSubject"
        :actions="subjectActions"
        @select="onSubjectSelect"
        cancel-text="取消"
      />
    </div>
  </van-popup>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { showToast } from 'vant'
import { db } from '../../db/index.js'

const show = defineModel('show', { type: Boolean })
const showCalendar = ref(false)
const showSubject = ref(false)

const subjectActions = [
  { name: '言语' }, { name: '数量' }, { name: '判断' }, { name: '资料' }, { name: '常识' }
]

const form = reactive({
  date: '', subject: '', totalCount: '', correctCount: '', duration: '', source: ''
})

function onDateConfirm(date) {
  form.date = date.toISOString().slice(0, 10)
  showCalendar.value = false
}

function onSubjectSelect(action) {
  form.subject = action.name
  showSubject.value = false
}

async function onSubmit() {
  await db.daily_practice.add({
    date: form.date,
    subject: form.subject,
    totalCount: Number(form.totalCount),
    correctCount: Number(form.correctCount),
    duration: Number(form.duration) || 0,
    source: form.source,
    createdAt: Date.now()
  })
  await db.calendar_events.add({
    date: form.date,
    category: '刷题',
    title: `${form.subject} ${form.totalCount}题`,
    createdAt: Date.now()
  })
  showToast('刷题记录已保存')
  Object.assign(form, { date: '', subject: '', totalCount: '', correctCount: '', duration: '', source: '' })
  show.value = false
}
</script>

<style scoped>
.form-container { padding: 16px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.form-title { font-size: 16px; font-weight: 600; }
.form-actions { margin-top: 20px; padding: 0 16px; }
</style>
