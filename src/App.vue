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
html, body {
  background: #f5f7fa !important;
  min-height: 100vh;
  margin: 0;
}

#app {
  background: transparent !important;
  min-height: 100vh;
}

.view-container {
  padding: 16px;
  padding-bottom: 66px;
  background: transparent;
}

.van-tabbar {
  background: #ffffff !important;
  border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.van-tabbar-item--active {
  color: var(--color-primary) !important;
}

.van-cell, .van-field {
  background: transparent !important;
}
</style>
