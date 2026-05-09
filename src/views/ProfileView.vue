<template>
  <div class="view-container">
    <h2 style="font-size:18px;margin-bottom:16px">我的</h2>
    <van-cell-group title="数据管理">
      <van-cell title="一键导出全部数据" is-link @click="handleExportAll" />
      <van-cell title="导入数据恢复" is-link @click="handleImport" />
      <van-cell title="单表导出" is-link @click="showTablePicker = true" />
    </van-cell-group>
    <van-cell-group title="关于" style="margin-top:16px">
      <van-cell title="版本" value="1.0.0" />
      <van-cell title="考公助手" label="公务员备考管理系统 PWA" />
    </van-cell-group>
    <van-action-sheet v-model:show="showTablePicker" :actions="tableActions" @select="handleExportTable" />
    <input ref="fileInput" type="file" accept=".json" style="display:none" @change="onFileSelected" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportAll, exportTable, importData } from '../utils/backup.js'
import { showToast, showConfirmDialog } from 'vant'

const showTablePicker = ref(false)
const fileInput = ref(null)

const tableActions = [
  { name: 'Todo任务', value: 'todos' },
  { name: '倒计时', value: 'countdowns' },
  { name: '学习记录', value: 'study_records' },
  { name: '套卷数据', value: 'exam_papers' },
  { name: '日常刷题', value: 'daily_practice' },
  { name: '错题', value: 'wrong_questions' },
  { name: '申论', value: 'essay_reviews' },
  { name: '日历事件', value: 'calendar_events' }
]

async function handleExportAll() {
  await exportAll()
  showToast('导出成功')
}

async function handleExportTable(action) {
  await exportTable(action.value)
  showTablePicker.value = false
  showToast('导出成功')
}

function handleImport() {
  showConfirmDialog({ title: '导入数据', message: '导入将覆盖现有数据，确认继续？' })
    .then(() => fileInput.value.click())
    .catch(() => {})
}

async function onFileSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    await importData(file)
    showToast('导入成功')
  } catch (err) {
    showToast('导入失败：' + err.message)
  }
  e.target.value = ''
}
</script>
