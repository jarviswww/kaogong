<template>
  <div class="view-container">
    <ClockHeader />
    <CountdownCard />
    <TodoPreview />
    <QuickActions @open-form="handleForm" />
    <StudyCalendar />
    <CountdownForm v-model:show="forms.countdown" />
    <PracticeForm v-model:show="forms.practice" />
    <PaperForm v-model:show="forms.paper" />
    <EssayForm v-model:show="forms.essay" />
    <WrongQuestionForm v-model:show="forms.wrong" />
    <QuickEntryForm v-model:show="forms.quickEntry" />
    <van-action-sheet
      v-model:show="deleteSheet.show"
      :actions="deleteSheet.actions"
      cancel-text="取消"
      @select="onDeleteSelect"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import ClockHeader from '../components/home/ClockHeader.vue'
import CountdownCard from '../components/home/CountdownCard.vue'
import TodoPreview from '../components/home/TodoPreview.vue'
import QuickActions from '../components/home/QuickActions.vue'
import StudyCalendar from '../components/home/StudyCalendar.vue'
import CountdownForm from '../components/forms/CountdownForm.vue'
import PracticeForm from '../components/forms/PracticeForm.vue'
import PaperForm from '../components/forms/PaperForm.vue'
import EssayForm from '../components/forms/EssayForm.vue'
import WrongQuestionForm from '../components/forms/WrongQuestionForm.vue'
import QuickEntryForm from '../components/forms/QuickEntryForm.vue'
import { useCountdownStore } from '../stores/countdown.js'
import { showConfirmDialog } from 'vant/es/dialog/function-call.mjs'

const forms = reactive({
  countdown: false, practice: false, paper: false,
  essay: false, wrong: false, quickEntry: false
})

const deleteSheet = reactive({ show: false, actions: [] })
const countdownStore = useCountdownStore()

function handleForm(type) {
  if (type === 'countdown') forms.countdown = true
  else if (type === 'practice') forms.practice = true
  else if (type === 'paper') forms.paper = true
  else if (type === 'essay') forms.essay = true
  else if (type === 'wrong') forms.wrong = true
  else if (type === 'quick-entry' || type === 'batch') forms.quickEntry = true
  else if (type === 'countdown-delete') handleDeleteCountdown()
}

async function handleDeleteCountdown() {
  await countdownStore.load()
  if (countdownStore.countdowns.length === 0) return
  deleteSheet.actions = countdownStore.countdowns.map(c => ({ name: c.title, id: c.id }))
  deleteSheet.show = true
}

async function onDeleteSelect(action) {
  deleteSheet.show = false
  try {
    await showConfirmDialog({ title: '确认删除？' })
    await countdownStore.remove(action.id)
  } catch {}
}
</script>
