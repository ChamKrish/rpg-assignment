<script setup lang="ts">
import { RouteName } from '@/router/route-names'
import { useAuthStore } from '@/stores/auth.store'
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!auth.token) return

  void (async () => {
    const ok = await auth.autoLogin()
    if (!ok) await router.replace({ name: RouteName.Login })
  })()
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

  <RouterView />
</template>
