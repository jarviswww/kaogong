<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '80%' }">
    <div class="form-container">
      <h3>刷题记录</h3>
      <van-form @submit="onSubmit">
        <van-field v-model="form.content" label="刷题内容" placeholder="如：粉笔言语专项" :rules="[{required:true}]" />
        <van-field v-model="form.date" label="刷题日期" readonly placeholder="选择日期" @click="showCal = true" />
        <van-field v-model="form.subject" label="所属板块" readonly placeholder="选择科目" @click="showSubjectPicker = true">
          <template #left-icon>
            <span v-if="form.subject" class="subject-dot" :style="{background: getSubjectColor(form.subject)}"></span>
          </template>
        </van-field>
        <van-field v-model="form.totalCount" label="总题量" type="digit" placeholder="输入数字" :rules="[{required:true}]" />
        <van-field v-model="form.correctCount" label="正确题数" type="digit" placeholder="输入数字" :rules="[{required:true}]" />
        <van-field v-model="form.duration" label="用时(分钟)" type="digit" placeholder="输入数字" :rules="[{required:true}]" />
        <van-button type="primary" native-type="submit" block style="margin-top:16px">提交</van-button>
      </van-form>
    </div>
    <van-action-sheet v-model:show="showSubjectPicker" :actions="subjectActions" @select="onSubjectSelect" />
    <van-calendar v-model:show="showCal" @confirm="onDateConfirm" />
  </van-popup>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { db } from '../../db/index.js'
import { SUBJECTS, getSubjectColor } from '../../constants/subjects.js'
import { showToast } from 'vant'

const show = defineModel('show', { type: Boolean })
const showSubjectPicker = ref(false)
const showCal = ref(false)
const form = reactive({ content: '', date: new Date().toISOString().slice(0, 10), subject: '', totalCount: '', correctCount: '', duration: '' })

const subjectActions = SUBJECTS.map(s => ({ name: s.name, color: s.color }))
function onSubjectSelect(action) { form.subject = action.name; showSubjectPicker.value = false }
function onDateConfirm(date) { form.date = date.toISOString().slice(0, 10); showCal.value = false }

async function onSubmit() {
  await db.daily_practice.add({
    date: form.date,
    subject: form.subject,
    totalCount: Number(form.totalCount),
    correctCount: Number(form.correctCount),
    duration: Number(form.duration),
    source: form.content,
    notes: '',
    createdAt: Date.now()
  })
  await db.calendar_events.add({ date: form.date, content: `刷题：${form.content}`, category: form.subject, createdAt: Date.now() })
  showToast('提交成功')
  form.content = ''; form.totalCount = ''; form.correctCount = ''; form.duration = ''
  show.value = false
}
</script>

<style scoped>
.form-container { padding: 20px; }
.form-container h3 { margin-bottom: 16px; font-size: 16px; }
.subject-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 4px; }
</style>
