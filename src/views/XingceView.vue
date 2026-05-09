<template>
  <div class="view-container">
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="套卷分析"><PaperAnalysis /></van-tab>
      <van-tab title="日常分析"><DailyAnalysis /></van-tab>
      <van-tab title="错题复盘"><WrongQuestions /></van-tab>
      <van-tab title="数据总表"><DataTable /></van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PaperAnalysis from '../components/xingce/PaperAnalysis.vue'
import DailyAnalysis from '../components/xingce/DailyAnalysis.vue'
import WrongQuestions from '../components/xingce/WrongQuestions.vue'
import DataTable from '../components/xingce/DataTable.vue'
const activeTab = ref(0)
</script>
