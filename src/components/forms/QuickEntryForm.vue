<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ maxHeight: '80%' }">
    <div class="form-container">
      <div class="form-header">
        <span class="form-title">快捷录入</span>
        <van-icon name="cross" @click="close" />
      </div>

      <!-- Template picker -->
      <div v-if="!selectedTemplate" class="template-picker">
        <div
          v-for="tpl in templates"
          :key="tpl.value"
          class="template-item"
          @click="selectedTemplate = tpl.value"
        >
          <van-icon :name="tpl.icon" size="22" color="var(--color-primary)" />
          <span>{{ tpl.label }}</span>
        </div>
      </div>

      <!-- 刷题 form -->
      <van-form v-if="selectedTemplate === 'practice'" @submit="submitPractice">
        <van-cell-group inset>
          <van-field
            v-model="practiceForm.subject"
            is-link readonly label="科目" placeholder="请选择科目"
            @click="showSubject = true" :rules="[{ required: true }]"
          />
          <van-field v-model="practiceForm.totalCount" type="digit" label="总题数" placeholder="请输入" :rules="[{ required: true }]" />
          <van-field v-model="practiceForm.correctCount" type="digit" label="正确数" placeholder="请输入" :rules="[{ required: true }]" />
          <van-field v-model="practiceForm.source" label="来源" placeholder="请输入来源" />
        </van-cell-group>
        <div class="form-actions">
          <van-button type="primary" native-type="submit" block round>保存</van-button>
        </div>
      </van-form>

      <!-- 看课 form -->
      <van-form v-if="selectedTemplate === 'course'" @submit="submitCourse">
        <van-cell-group inset>
          <van-field v-model="courseForm.courseName" label="课程名称" placeholder="请输入课程名称" :rules="[{ required: true }]" />
          <van-field v-model="courseForm.lectureNum" type="digit" label="节数" placeholder="请输入节数" :rules="[{ required: true }]" />
          <van-field v-model="courseForm.duration" type="digit" label="用时(分钟)" placeholder="请输入用时" />
        </van-cell-group>
        <div class="form-actions">
          <van-button type="primary" native-type="submit" block round>保存</van-button>
        </div>
      </van-form>

      <!-- 做卷 form -->
      <van-form v-if="selectedTemplate === 'paper'" @submit="submitPaper">
        <van-cell-group inset>
          <van-field v-model="paperForm.paperName" label="试卷名称" placeholder="请输入试卷名称" :rules="[{ required: true }]" />
          <van-field v-model="paperForm.totalScore" type="digit" label="总分" placeholder="请输入总分" :rules="[{ required: true }]" />
          <van-field v-model="paperForm.duration" type="digit" label="用时(分钟)" placeholder="请输入用时" />
        </van-cell-group>
        <div class="form-actions">
          <van-button type="primary" native-type="submit" block round>保存</van-button>
        </div>
      </van-form>

      <!-- 自定义 form -->
      <van-form v-if="selectedTemplate === 'custom'" @submit="submitCustom">
        <van-cell-group inset>
          <van-field v-model="customForm.title" label="标题" placeholder="请输入待办标题" :rules="[{ required: true }]" />
          <van-field v-model="customForm.content" type="textarea" label="内容" placeholder="请输入内容" rows="3" autosize />
        </van-cell-group>
        <div class="form-actions">
          <van-button type="primary" native-type="submit" block round>保存</van-button>
        </div>
      </van-form>

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
import { reactive, ref, watch } from 'vue'
import { showToast } from 'vant'
import { db } from '../../db/index.js'
import { useTodoStore } from '../../stores/todo.js'

const show = defineModel('show', { type: Boolean })
const selectedTemplate = ref('')
const showSubject = ref(false)

const templates = [
  { value: 'practice', label: '刷题', icon: 'records' },
  { value: 'course', label: '看课', icon: 'video-o' },
  { value: 'paper', label: '做卷', icon: 'bar-chart-o' },
  { value: 'custom', label: '自定义', icon: 'edit' }
]

const subjectActions = [
  { name: '言语' }, { name: '数量' }, { name: '判断' }, { name: '资料' }, { name: '常识' }
]

const practiceForm = reactive({ subject: '', totalCount: '', correctCount: '', source: '' })
const courseForm = reactive({ courseName: '', lectureNum: '', duration: '' })
const paperForm = reactive({ paperName: '', totalScore: '', duration: '' })
const customForm = reactive({ title: '', content: '' })

const today = new Date().toISOString().slice(0, 10)

function onSubjectSelect(action) {
  practiceForm.subject = action.name
  showSubject.value = false
}

function close() {
  selectedTemplate.value = ''
  show.value = false
}

watch(show, (val) => { if (!val) selectedTemplate.value = '' })

async function submitPractice() {
  await db.daily_practice.add({
    date: today, subject: practiceForm.subject,
    totalCount: Number(practiceForm.totalCount),
    correctCount: Number(practiceForm.correctCount),
    source: practiceForm.source, duration: 0, createdAt: Date.now()
  })
  showToast('刷题记录已保存')
  Object.assign(practiceForm, { subject: '', totalCount: '', correctCount: '', source: '' })
  close()
}

async function submitCourse() {
  await db.study_records.add({
    date: today, category: '看课',
    subject: courseForm.courseName,
    lectureNum: Number(courseForm.lectureNum),
    duration: Number(courseForm.duration) || 0,
    createdAt: Date.now()
  })
  showToast('学习记录已保存')
  Object.assign(courseForm, { courseName: '', lectureNum: '', duration: '' })
  close()
}

async function submitPaper() {
  await db.exam_papers.add({
    date: today, paperName: paperForm.paperName,
    totalScore: Number(paperForm.totalScore),
    duration: Number(paperForm.duration) || 0,
    type: '模拟', yanyu: 0, shuliang: 0, panduan: 0, ziliao: 0, changshi: 0,
    createdAt: Date.now()
  })
  showToast('试卷记录已保存')
  Object.assign(paperForm, { paperName: '', totalScore: '', duration: '' })
  close()
}

async function submitCustom() {
  const todoStore = useTodoStore()
  await todoStore.add({ date: today, title: customForm.title, category: '自定义', content: customForm.content })
  showToast('待办已添加')
  Object.assign(customForm, { title: '', content: '' })
  close()
}
</script>

<style scoped>
.form-container { padding: 16px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.form-title { font-size: 16px; font-weight: 600; }
.form-actions { margin-top: 20px; padding: 0 16px; }
.template-picker { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 12px; }
.template-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 16px 8px; background: var(--color-bg); border-radius: var(--radius-card);
  border: 1px solid var(--color-border); font-size: 13px;
}
</style>
