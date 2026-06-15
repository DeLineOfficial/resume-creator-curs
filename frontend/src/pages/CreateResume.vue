<template>
  <div>
    <h2>Create Resume</h2>
    <form @submit.prevent="onSubmit">
      <div><input v-model="title" placeholder="Title" /></div>
      <div><textarea v-model="summary" placeholder="Summary"></textarea></div>
      <div><input v-model="skills" placeholder="Skills (comma separated)" /></div>
      <button>Create</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'

const title = ref('')
const summary = ref('')
const skills = ref('')
const message = ref<string | null>(null)
const { getUserId } = useAuth()

async function onSubmit() {
  try {
    const payload = {
      title: title.value,
      summary: summary.value,
      skills: skills.value.split(',').map(s => s.trim()).filter(Boolean),
    }
    await api.post('/resumes', { data: payload })
    message.value = 'Created'
  } catch (e: any) {
    message.value = e?.response?.data || 'Create failed'
  }
}
</script>