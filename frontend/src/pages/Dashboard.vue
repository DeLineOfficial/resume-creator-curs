<template>
  <div>
    <h2>МАИ РЕЗЮМЕ</h2>
    <div v-if="loading">Loading...</div>
    <ul>
      <li v-for="r in resumes" :key="r.id">
        <strong>{{ r.data.title }}</strong> — {{ r.createdAt }}
        <div>{{ r.data.summary }}</div>
        <div>Skills: <span v-for="s in r.data.skills" :key="s">{{ s }} </span></div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'

const resumes = ref<any[]>([])
const loading = ref(false)
const { getUserId } = useAuth()

async function load() {
  const userId = getUserId()
  if (!userId) return
  loading.value = true
  const res = await api.get(`/users/${userId}/resumes`)
  resumes.value = res.data
  loading.value = false
}

onMounted(load)
</script>