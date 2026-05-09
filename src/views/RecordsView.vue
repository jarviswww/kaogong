<template>
  <div class="view-container">
    <TodayStudyCard />
    <StudyPieCharts />
    <FullTodoList />
  </div>
</template>

<script setup>
import TodayStudyCard from '../components/records/TodayStudyCard.vue'
import StudyPieCharts from '../components/records/StudyPieCharts.vue'
import FullTodoList from '../components/records/FullTodoList.vue'
</script>
