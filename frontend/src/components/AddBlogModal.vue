<script setup lang="ts">
import type { BlogPayload } from '@/stores/blog.store'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Close from './icons/Close.vue'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', payload: BlogPayload): void
}>()

const initialBlogPayload = { title: '', content: '' }
const blog = ref<BlogPayload>({ ...initialBlogPayload })

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      blog.value = { ...initialBlogPayload }
    }
  },
)

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeUnload)
})

function beforeUnload(e: BeforeUnloadEvent) {
  if ((!blog.value.title && !blog.value.content)) return
  e.preventDefault()
}

function close() {
  emit('update:modelValue', false)
}

function submit() {
  emit('submit', blog.value)
}
</script>

<template>
  <div v-if="modelValue" class="overlay">
    <div class="modal">
      <div class="header">
        <h3 class="title">Add Blog</h3>
        <button class="close" type="button" @click="close"><Close /></button>
      </div>

      <form class="form" @submit.prevent="submit">
        <label class="field">
          <div class="label">Title</div>
          <input v-model="blog.title" class="input" type="text" required minlength="3" />
        </label>

        <label class="field">
          <div class="label">Content</div>
          <textarea v-model="blog.content" class="textarea" rows="6" required minlength="10" />
        </label>

        <div v-if="error" class="error">{{ error }}</div>

        <div class="actions">
          <button class="btn" type="button" @click="close">Cancel</button>
          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  padding: 24px;
}

.modal {
  width: min(560px, 100%);
  background: white;
  border-radius: 12px;
  padding: 14px 14px 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.close {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.form {
  display: grid;
  gap: 12px;
}

.label {
  font-size: 16px;
  margin-bottom: 6px;
}

.input,
.textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  resize: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 4px;
}

.btn {
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: white;
}

.btn-primary {
  background: rgb(101, 107, 88);
  border-color: rgb(101, 107, 88);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #b91c1c;
  font-size: 13px;
}
</style>
