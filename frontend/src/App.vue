<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const auth = useAuthStore()

onMounted(() => {
  if (auth.token) void auth.autoLogin()
})
</script>

<template>
  <AppHeader
    :is-authenticated="auth.isAuthenticated"
    :username="auth.user?.userName"
    @logout="auth.logout()"
  />

  <RouterView />
</template>
