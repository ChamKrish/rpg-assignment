<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logout from './icons/Logout.vue'

interface AppHeaderProps {
  isAuthenticated: boolean
  username?: string | null
}
const props = defineProps<AppHeaderProps>()

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>

<template>
  <header class="header">
    <div class="nav">
      <RouterLink to="/" class="brand">DevBlogs</RouterLink>

      <span class="spacer" />

      <button
        v-if="props.isAuthenticated"
        class="icon-btn"
        type="button"
        aria-label="Logout"
        title="Logout"
        @click="emit('logout')"
      >
        <Logout />
      </button>
    </div>

    <div v-if="props.isAuthenticated" class="subtitle">Hi {{ props.username ?? '' }}</div>
  </header>
</template>

<style scoped>
.header {
  padding: 12px 16px 0px 16px;
  background: var(--color-background);
}

.nav {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  gap: 14px;
}

.brand {
  font-weight: 700;
  font-size: 28px;
  color: var(--color-heading);
  text-decoration: none;
}

.brand:hover {
  background: transparent;
  outline: none;
  box-shadow: none;
}

.spacer {
  flex: 1;
}

.icon-btn {
  margin-left: auto;
  border: 1px solid var(--color-border);
  background: transparent;
  border-radius: 10px;
  padding: 6px;
  cursor: pointer;
  line-height: 0;
}

.icon-btn:hover {
  background: var(--color-background-mute);
}

.icon {
  width: 18px;
  height: 18px;
}

.subtitle {
  margin-top: 8px;
  font-size: 20px;
  padding-left: 4px;
  color: var(--color-text);
}
</style>
