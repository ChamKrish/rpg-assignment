<script setup lang="ts">
import { useBlogStore, type BlogPayload } from '@/stores/blog.store'
import { ref, watch } from 'vue'
import AddBlogModal from './AddBlogModal.vue'
import BlogListItem from './BlogListItem.vue'

const blogStore = useBlogStore()
const isModalOpen = ref<boolean>(false)
const areMyBlogs = ref<boolean>(false)

async function fetchBlogs() {
  await blogStore.getBlogs({ createdByMe: areMyBlogs.value })
}

watch(
  areMyBlogs,
  () => {
    void fetchBlogs()
  },
  { immediate: true },
)

watch(
  () => blogStore.toast,
  (toast) => {
    if (toast) void fetchBlogs()
  },
)

watch(isModalOpen, (open) => {
  if (!open) blogStore.createBlogError = null
})

async function handleAddBlog(payload: BlogPayload) {
  const res = await blogStore.createBlog(payload)
  if (res) {
    isModalOpen.value = false
    await fetchBlogs()
  }
}
</script>

<template>
  <section class="container">
    <div class="header">
      <h2>Latest posts from the community</h2>
      <button class="btn" :class="{ selected: areMyBlogs }" @click="areMyBlogs = !areMyBlogs">
        My blogs
      </button>
    </div>
    <div v-if="blogStore.loading" class="text">Loading...</div>
    <div v-else-if="blogStore.error" class="text">{{ blogStore.error }}</div>

    <div v-else-if="blogStore.blogs.length === 0" class="empty">
      <h3>No blogs yet</h3>
      <h4>Click "Add Blog" to create your first post.</h4>
    </div>

    <ul v-else class="list">
      <BlogListItem v-for="blog in blogStore.blogs" :key="blog.id" :blog="blog" />
    </ul>

    <button v-if="!blogStore.loading" class="fab" type="button" @click="isModalOpen = true">
      Add Blog
    </button>

    <AddBlogModal
      v-model="isModalOpen"
      :loading="blogStore.loading"
      :error="blogStore.createBlogError"
      @submit="handleAddBlog"
    />
  </section>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.header {
  display: flex;
  flex-direction: row;
  padding: 0px 20px 20px 20px;
  justify-content: space-between;
  align-items: center;
}
.btn {
  border-radius: 10px;
  height: 30px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: white;
}
.btn.selected {
  background: rgb(101, 107, 88);
  border: none;
  color: white;
}
.text {
  text-align: center;
}
.list {
  width: 100%;
  list-style: none;
  display: grid;
  padding: 0px 24px;
  margin-bottom: 24px;
  gap: 12px;
}
.empty {
  width: 100%;
  padding: 24px;
  text-align: center;
  opacity: 0.85;
}
.fab {
  position: fixed;
  bottom: 30px;
  align-self: center;
  z-index: 99;
  padding: 12px 16px;
  border: 0;
  border-radius: 999px;
  background: rgb(101, 107, 88);
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.fab:hover {
  filter: brightness(0.95);
}
</style>
