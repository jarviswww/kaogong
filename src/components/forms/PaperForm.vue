<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '80%' }">
    <div class="form-container">
      <div class="form-header">
        <span class="form-title">上传行测成绩</span>
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
          <van-field v-model="form.totalScore" type="digit" label="总分" placeholder="请输入总分" :rules="[{ required: true }]" />
          <van-field v-model="form.yanyu" type="digit" label="言语" placeholder="言语得分" />
          <van-field v-model="form.shuliang" type="digit" label="数量" placeholder="数量得分" />
          <van-field v-model="form.panduan" type="digit" label="判断" placeholder="判断得分" />
          <van-field v-model="form.ziliao" type="digit" label="资料" placeholder="资料得分" />
          <van-field v-model="form.changshi" type="digit" label="常识" placeholder="常识得分" />
          <van-field v-model="form.duration" type="digit" label="用时(分钟)" placeholder="请输入用时" />
          <van-field
            v-model="form.type"
            is-link
            readonly
            label="类型"
            placeholder="请选择类型"
            @click="showType = true"
            :rules="[{ required: true }]"
          />
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

const typeActions = [{ name: '国考' }, { name: '省考' }, { name: '模拟' }]

const form = reactive({
  date: '', paperName: '', totalScore: '', yanyu: '', shuliang: '',
  panduan: '', ziliao: '', changshi: '', duration: '', type: ''
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
  await db.exam_papers.add({
    date: form.date,
    paperName: form.paperName,
    totalScore: Number(form.totalScore),
    yanyu: Number(form.yanyu) || 0,
    shuliang: Number(form.shuliang) || 0,
    panduan: Number(form.panduan) || 0,
    ziliao: Number(form.ziliao) || 0,
    changshi: Number(form.changshi) || 0,
    duration: Number(form.duration) || 0,
    type: form.type,
    createdAt: Date.now()
  })
  showToast('行测成绩已保存')
  Object.assign(form, {
    date: '', paperName: '', totalScore: '', yanyu: '', shuliang: '',
    panduan: '', ziliao: '', changshi: '', duration: '', type: ''
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
