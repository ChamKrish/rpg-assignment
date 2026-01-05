import { apolloClient } from '@/config/apollo-client'
import { AUTO_LOGIN_QUERY, LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface User {
  id: string
  userName: string
  email: string
  createdAt: string
  updatedAt: string
}

interface AuthPayload {
  token: string
  user: User
}

interface RegisterPayload {
  userName: string
  email: string
  password: string
}

interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(payload: AuthPayload) {
    token.value = payload.token
    user.value = payload.user
    localStorage.setItem('token', payload.token)
  }

  function resetError() {
    error.value = null
  }

  async function logout() {
    token.value = null
    user.value = null
    error.value = null
    localStorage.removeItem('token')
    await apolloClient.clearStore()
  }

  async function register(input: RegisterPayload) {
    loading.value = true
    error.value = null

    try {
      const res = await apolloClient.mutate<{ register: AuthPayload }>({
        mutation: REGISTER_MUTATION,
        variables: { input },
      })
      const payload = res.data?.register
      if (!payload) {
        throw new Error('Registration failed')
      }

      setAuth(payload)
      return true
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function login(input: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      const res = await apolloClient.mutate<{ login: AuthPayload }>({
        mutation: LOGIN_MUTATION,
        variables: { input },
      })
      const payload = res.data?.login
      if (!payload) {
        throw new Error('Login failed')
      }

      setAuth(payload)
      return true
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function autoLogin() {
    if (!token.value) return false
    loading.value = true
    error.value = null

    try {
      const res = await apolloClient.query<{ autoLogin: User | null }>({
        query: AUTO_LOGIN_QUERY,
        fetchPolicy: 'network-only',
      })
      if (!res.data?.autoLogin) {
        await logout()
        return false
      }

      user.value = res.data.autoLogin
      return true
    } catch {
      await logout()
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    autoLogin,
    logout,
    resetError,
  }
})
