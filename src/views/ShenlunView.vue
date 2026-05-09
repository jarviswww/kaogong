<template>
  <div class="view-container">
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="真题复盘"><EssayReview /></van-tab>
      <van-tab title="答案对比"><AnswerCompare /></van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EssayReview from '../components/shenlun/EssayReview.vue'
import AnswerCompare from '../components/shenlun/AnswerCompare.vue'
const activeTab = ref(0)
</script>
