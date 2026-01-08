import { apolloClient } from '@/config/apollo-client'
import { BLOGS_QUERY, CREATE_BLOG_MUTATION } from '@/graphql/blog'
import { defineStore } from 'pinia'
import { ref } from 'vue'

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
  const blogs = ref<Blog[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const createBlogError = ref<string | null>(null)

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
        fetchPolicy: 'network-only'
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

  return {
    blogs,
    loading,
    error,
    createBlogError,
    getBlogs,
    createBlog,
  }
})
