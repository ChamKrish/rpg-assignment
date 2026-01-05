<script setup lang="ts">
import { RouteName } from '@/router/route-names'
import { useAuthStore, type RegisterPayload } from '@/stores/auth.store'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const registerPayload = reactive<RegisterPayload>({ userName: '', email: '', password: '' })

async function register() {
  const res = await auth.register(registerPayload)
  if (res) router.push({ name: RouteName.Home })
}
</script>

<template>
  <main class="page">
    <section class="card" aria-label="Register">
      <header class="card-header">
        <h1 class="title">Welcome to DevBlogs</h1>
        <p class="subtitle">Sign up to start blogging</p>
      </header>

      <form class="form" @submit.prevent="register">
        <label class="field">
          <span class="label">Username</span>
          <input
            v-model="registerPayload.userName"
            class="input"
            type="text"
            autocomplete="username"
            required
            placeholder="username"
          />
        </label>

        <label class="field">
          <span class="label">Email</span>
          <input
            v-model="registerPayload.email"
            class="input"
            type="email"
            autocomplete="email"
            required
            placeholder="you@example.com"
          />
        </label>

        <label class="field">
          <span class="label">Password</span>
          <input
            v-model="registerPayload.password"
            class="input"
            type="password"
            autocomplete="new-password"
            required
            placeholder="Your password"
          />
        </label>

        <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>

        <button class="btn" type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px 16px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 16px;
}

.title {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  color: var(--color-heading);
}

.subtitle {
  margin: 6px 0 0;
  color: var(--color-text);
  opacity: 0.75;
  font-size: 14px;
}

.form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
}

.label {
  font-size: 13px;
  color: var(--color-text);
  opacity: 0.85;
}

.input {
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
}

.input:focus {
  border-color: var(--vt-c-indigo);
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.18);
}

.btn {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--vt-c-indigo);
  color: var(--vt-c-white);
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error {
  color: #b00020;
  background: rgba(176, 0, 32, 0.08);
  border: 1px solid rgba(176, 0, 32, 0.18);
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
}
</style>
