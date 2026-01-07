<script setup lang="ts">
import { useBlogStore } from '@/stores/blog.store'
import { onMounted } from 'vue'
import BlogListItem from './BlogListItem.vue'

const blogStore = useBlogStore()

onMounted(() => {
  void blogStore.getBlogs()
})
</script>

<template>
  <section class="container">
    <div v-if="blogStore.loading">Loading...</div>
    <div v-else-if="blogStore.error">{{ blogStore.error }}</div>

    <ul v-else class="list">
      <BlogListItem v-for="blog in blogStore.blogs" :key="blog.id" :blog="blog" />
    </ul>
  </section>
</template>

<style scoped>
.container {
  margin-top: 4px;
  display: flex;
  justify-content: center;
}
.list {
  width: 100%;
  list-style: none;
  display: grid;
  padding: 0px 24px;
  gap: 12px;
}
</style>
