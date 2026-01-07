<script setup lang="ts">
import type { Blog } from '@/stores/blog.store'
import { formatDate } from '@/utils/common'

defineProps<{
  blog: Blog
}>()
</script>

<template>
  <li class="container">
    <div class="date">{{ formatDate(blog.createdAt) }}</div>
    <div class="title">{{ blog.title }}</div>
    <div class="content">{{ blog.content }}</div>
  </li>
</template>

<style scoped>
.container {
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 12px 14px;
}
.date {
  font-size: 12px;
  opacity: 0.7;
}
.title {
  font-weight: 700;
  margin-top: 4px;
}
.content {
  margin-top: 6px;
  opacity: 0.9;
}
</style>
