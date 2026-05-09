<template>
  <router-view />
  <van-tabbar v-model="active" route>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="chart-trending-o" to="/xingce">行测</van-tabbar-item>
    <van-tabbar-item icon="edit" to="/shenlun">申论</van-tabbar-item>
    <van-tabbar-item icon="records-o" to="/records">记录</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<style>
.view-container {
  padding: 16px;
  padding-bottom: 66px;
}
.van-tabbar {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
}
.van-tabbar-item--active {
  color: var(--color-primary) !important;
}
</style>
