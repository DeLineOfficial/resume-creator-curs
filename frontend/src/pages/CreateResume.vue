<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h2 class="card-title mb-4">Создать резюме</h2>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label">Название</label>
              <input v-model="title" type="text" class="form-control" placeholder="Frontend Developer" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Краткое описание</label>
              <textarea v-model="summary" class="form-control" rows="5" placeholder="Опишите свои сильные стороны и цели" required></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Навыки</label>
              <input v-model="skills" type="text" class="form-control" placeholder="JavaScript, Vue, CSS" />
              <div class="form-text">Укажите навыки через запятую.</div>
            </div>
            <button class="btn btn-success w-100" type="submit">Создать</button>
          </form>
          <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
        </div>
      </div>
    </div>
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
    message.value = 'Резюме создано'
    title.value = ''
    summary.value = ''
    skills.value = ''
  } catch (e: any) {
    message.value = e?.response?.data || 'Create failed'
  }
}
</script>