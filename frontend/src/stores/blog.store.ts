import { apolloClient } from '@/config/apollo-client'
import { BLOG_PUBLISHED_SUBSCRIPTION, BLOGS_QUERY, CREATE_BLOG_MUTATION } from '@/graphql/blog'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth.store'

export interface BlogPayload {
  title: string
  content: string
}

export interface Blog extends BlogPayload {
  id: string
  createdAt: string
  authorId: string
  authorName: string
}

interface BlogFilters {
  search?: string
  createdAtGe?: string
  createdAtLe?: string
  createdByMe?: boolean
}

export const useBlogStore = defineStore('blog', () => {
  const authStore = useAuthStore()

  const blogs = ref<Blog[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const createBlogError = ref<string | null>(null)
  const toast = ref<string | null>(null)

  let toastTimer: number | null = null
  let sub: { unsubscribe: () => void } | null = null

  function showToast(msg: string, interval = 3000) {
    toast.value = msg
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toast.value = null
      toastTimer = null
    }, interval)
  }

  async function createBlog(input: BlogPayload) {
    loading.value = true
    createBlogError.value = null

    try {
      const res = await apolloClient.mutate<{ createBlog: Blog }>({
        mutation: CREATE_BLOG_MUTATION,
        variables: { input },
      })
      const payload = res.data?.createBlog
      if (!payload) {
        throw new Error('Blog creation failed')
      }

      return true
    } catch (err: unknown) {
      if (err instanceof Error) {
        createBlogError.value = err.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function getBlogs(filters?: BlogFilters) {
    loading.value = true
    error.value = null

    try {
      const res = await apolloClient.query<{ blogs: Blog[] }>({
        query: BLOGS_QUERY,
        variables: { filters },
        fetchPolicy: 'network-only',
      })
      const payload = res.data.blogs
      if (!payload) {
        throw new Error('Something went wrong')
      }

      blogs.value = payload
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

  function startBlogPublishedSubscription() {
    if (sub) return
    sub = apolloClient
      .subscribe<{ blogPublished: Blog }>({ query: BLOG_PUBLISHED_SUBSCRIPTION })
      .subscribe({
        next: ({ data }) => {
          const blog = data?.blogPublished
          if (!blog) return
          const isAuthorCurrentUser = authStore.user?.id === blog.authorId
          showToast(
            isAuthorCurrentUser
              ? `Successfully published blog: ${blog.title}`
              : `${blog.authorName} published a new blog: ${blog.title}`,
          )
        },
        error: (err) => {
          console.error('blogPublished subscription error', err)
        },
      })
  }

  function stopBlogPublishedSubscription() {
    sub?.unsubscribe()
    sub = null
  }

  return {
    blogs,
    loading,
    error,
    createBlogError,
    toast,
    showToast,
    getBlogs,
    createBlog,
    startBlogPublishedSubscription,
    stopBlogPublishedSubscription,
  }
})
