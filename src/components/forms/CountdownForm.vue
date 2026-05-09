<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '80%' }">
    <div class="form-container">
      <div class="form-header">
        <span class="form-title">设置倒计时</span>
        <van-icon name="cross" @click="show = false" />
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="form.title" label="标题" placeholder="请输入倒计时标题" :rules="[{ required: true }]" />
          <van-field
            v-model="form.targetDate"
            is-link
            readonly
            label="目标日期"
            placeholder="请选择日期"
            @click="showCalendar = true"
            :rules="[{ required: true }]"
          />
        </van-cell-group>
        <div class="form-actions">
          <van-button type="primary" native-type="submit" block round>保存</van-button>
        </div>
      </van-form>
      <van-calendar v-model:show="showCalendar" @confirm="onDateConfirm" :min-date="new Date()" />
    </div>
  </van-popup>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { showToast } from 'vant'
import { useCountdownStore } from '../../stores/countdown.js'

const show = defineModel('show', { type: Boolean })
const showCalendar = ref(false)
const countdownStore = useCountdownStore()

const form = reactive({ title: '', targetDate: '' })

function onDateConfirm(date) {
  form.targetDate = date.toISOString().slice(0, 10)
  showCalendar.value = false
}

async function onSubmit() {
  await countdownStore.add(form.title, form.targetDate)
  showToast('倒计时已添加')
  form.title = ''
  form.targetDate = ''
  show.value = false
}
</script>

<style scoped>
.form-container { padding: 16px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.form-title { font-size: 16px; font-weight: 600; }
.form-actions { margin-top: 20px; padding: 0 16px; }
</style>
