<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">Мои резюме</h2>
        <p class="text-muted">Ваши резюме доступны только после входа в систему.</p>
      </div>
      <router-link class="btn btn-outline-primary" to="/create">Создать резюме</router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="resumes.length === 0" class="alert alert-info">
        У вас пока нет резюме. Нажмите «Создать резюме», чтобы начать.
      </div>
      <div class="row gy-4">
        <div class="col-md-6" v-for="r in resumes" :key="r.id">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title mb-1">{{ r.data.title }}</h5>
                  <small class="text-muted">{{ new Date(r.createdAt).toLocaleDateString() }}</small>
                </div>
              </div>
              <p class="card-text">{{ r.data.summary }}</p>
              <div>
                <span class="badge bg-secondary me-1" v-for="s in r.data.skills" :key="s">{{ s }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  try {
    const res = await api.get(`/users/${userId}/resumes`)
    resumes.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>