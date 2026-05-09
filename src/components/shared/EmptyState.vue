<template>
  <div class="empty-state">
    <van-empty :description="text" image-size="80" />
  </div>
</template>

<script setup>
defineProps({ text: { type: String, default: '暂无数据' } })
</script>
