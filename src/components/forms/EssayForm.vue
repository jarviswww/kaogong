<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '85%' }">
    <div class="form-container">
      <div class="form-header">
        <span class="form-title">上传申论</span>
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
          <van-field v-model="form.paperName" label="试卷名称" placeholder="请输入试卷名称" :rules="[{ required: true }]" />
          <van-field v-model="form.year" label="年份" placeholder="请输入年份" />
          <van-field
            v-model="form.type"
            is-link
            readonly
            label="题型"
            placeholder="请选择题型"
            @click="showType = true"
            :rules="[{ required: true }]"
          />
          <van-field v-model="form.questionNum" type="digit" label="题号" placeholder="请输入题号" />
          <van-field v-model="form.myAnswer" type="textarea" label="我的答案" placeholder="请输入你的答案" rows="3" autosize />
          <van-field v-model="form.referenceAnswer" type="textarea" label="参考答案" placeholder="请输入参考答案" rows="3" autosize />
          <van-field v-model="form.score" type="digit" label="得分" placeholder="请输入得分" />
          <van-field v-model="form.totalScore" type="digit" label="满分" placeholder="请输入满分" />
        </van-cell-group>
        <div class="form-actions">
          <van-button type="primary" native-type="submit" block round>保存</van-button>
        </div>
      </van-form>
      <van-calendar v-model:show="showCalendar" @confirm="onDateConfirm" />
      <van-action-sheet
        v-model:show="showType"
        :actions="typeActions"
        @select="onTypeSelect"
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
const showType = ref(false)

const typeActions = [
  { name: '归纳概括' }, { name: '提出对策' }, { name: '综合分析' },
  { name: '贯彻执行' }, { name: '大作文' }
]

const form = reactive({
  date: '', paperName: '', year: '', type: '', questionNum: '',
  myAnswer: '', referenceAnswer: '', score: '', totalScore: ''
})

function onDateConfirm(date) {
  form.date = date.toISOString().slice(0, 10)
  showCalendar.value = false
}

function onTypeSelect(action) {
  form.type = action.name
  showType.value = false
}

async function onSubmit() {
  await db.essay_reviews.add({
    date: form.date,
    paperName: form.paperName,
    year: form.year,
    type: form.type,
    questionNum: Number(form.questionNum) || 0,
    myAnswer: form.myAnswer,
    referenceAnswer: form.referenceAnswer,
    score: Number(form.score) || 0,
    totalScore: Number(form.totalScore) || 0,
    createdAt: Date.now()
  })
  showToast('申论记录已保存')
  Object.assign(form, {
    date: '', paperName: '', year: '', type: '', questionNum: '',
    myAnswer: '', referenceAnswer: '', score: '', totalScore: ''
  })
  show.value = false
}
</script>

<style scoped>
.form-container { padding: 16px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.form-title { font-size: 16px; font-weight: 600; }
.form-actions { margin-top: 20px; padding: 0 16px; }
</style>
