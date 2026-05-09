<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '80%' }">
    <div class="form-container">
      <div class="form-header">
        <span class="form-title">错题录入</span>
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
          <van-field v-model="form.questionNum" label="题号" placeholder="请输入题号" />
          <van-field v-model="form.source" label="来源" placeholder="请输入题目来源" />
          <van-field
            v-model="form.wrongReason"
            is-link
            readonly
            label="错因"
            placeholder="请选择错因"
            @click="showReason = true"
            :rules="[{ required: true }]"
          />
          <van-field v-model="form.analysis" type="textarea" label="解析" placeholder="请输入解析或笔记" rows="3" autosize />
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
      <van-action-sheet
        v-model:show="showReason"
        :actions="reasonActions"
        @select="onReasonSelect"
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
const showReason = ref(false)

const subjectActions = [
  { name: '言语' }, { name: '数量' }, { name: '判断' }, { name: '资料' }, { name: '常识' }
]
const reasonActions = [
  { name: '粗心' }, { name: '知识点不熟' }, { name: '方法不对' }, { name: '蒙错' }
]

const form = reactive({
  date: '', subject: '', questionNum: '', source: '', wrongReason: '', analysis: ''
})

function onDateConfirm(date) {
  form.date = date.toISOString().slice(0, 10)
  showCalendar.value = false
}

function onSubjectSelect(action) {
  form.subject = action.name
  showSubject.value = false
}

function onReasonSelect(action) {
  form.wrongReason = action.name
  showReason.value = false
}

async function onSubmit() {
  await db.wrong_questions.add({
    date: form.date,
    subject: form.subject,
    questionNum: form.questionNum,
    source: form.source,
    wrongReason: form.wrongReason,
    analysis: form.analysis,
    mastered: false,
    createdAt: Date.now()
  })
  showToast('错题已录入')
  Object.assign(form, { date: '', subject: '', questionNum: '', source: '', wrongReason: '', analysis: '' })
  show.value = false
}
</script>

<style scoped>
.form-container { padding: 16px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.form-title { font-size: 16px; font-weight: 600; }
.form-actions { margin-top: 20px; padding: 0 16px; }
</style>
