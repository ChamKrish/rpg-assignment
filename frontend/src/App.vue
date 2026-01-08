<script setup lang="ts">
import { RouteName } from '@/router/route-names'
import { useAuthStore } from '@/stores/auth.store'
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useBlogStore } from './stores/blog.store'

const auth = useAuthStore()
const blogStore = useBlogStore()
const router = useRouter()

onMounted(() => {
  if (!auth.token) return

  void (async () => {
    const ok = await auth.autoLogin()
    if (!ok) await router.replace({ name: RouteName.Login })
  })()
})

onMounted(() => {
  blogStore.startBlogPublishedSubscription()
})

async function handleLogout() {
  await auth.logout()
  await router.replace({ name: RouteName.Login })
}
</script>

<template>
  <AppHeader
    :is-authenticated="auth.isAuthenticated"
    :username="auth.user?.userName"
    @logout="handleLogout"
  />

  <div v-if="blogStore.toast" class="toast">{{ blogStore.toast }}</div>

  <RouterView />
</template>

<style scoped>
.toast {
  position: fixed;
  max-width: 500px;
  bottom: 30px;
  right: 30px;
  z-index: 101;
  background: rgb(101, 107, 88);
  color: white;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
}
</style>
