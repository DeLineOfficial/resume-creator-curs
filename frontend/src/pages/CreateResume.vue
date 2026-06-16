<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h2 class="card-title mb-4">Создать резюме</h2>
          <form @submit.prevent="onSubmit">
            <!-- Фотография -->
            <div class="mb-3">
              <label class="form-label">Фотография</label>
              <div class="mb-2">
                <input 
                  ref="photoInput" 
                  type="file" 
                  accept="image/*" 
                  class="form-control" 
                  @change="onPhotoSelected"
                />
                <div class="form-text">Выберите файл изображения (JPG, PNG, GIF и т.д.)</div>
              </div>
              <div v-if="photoPreview" class="mt-2">
                <img :src="photoPreview" alt="Preview" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
              </div>
            </div>

            <!-- ФИО -->
            <div class="mb-3">
              <label class="form-label">ФИО</label>
              <input v-model="fullName" type="text" class="form-control" placeholder="Иван Иванов Иванович" required />
            </div>

            <!-- Дата рождения -->
            <div class="mb-3">
              <label class="form-label">Дата рождения</label>
              <input v-model="dateOfBirth" type="date" class="form-control" required />
            </div>

            <!-- Название должности -->
            <div class="mb-3">
              <label class="form-label">Название должности</label>
              <input v-model="title" type="text" class="form-control" placeholder="Frontend Developer" required />
            </div>

            <!-- Краткое описание -->
            <div class="mb-3">
              <label class="form-label">Краткое описание</label>
              <textarea v-model="summary" class="form-control" rows="5" placeholder="Опишите свои сильные стороны и цели" required></textarea>
            </div>

            <!-- Навыки -->
            <div class="mb-3">
              <label class="form-label">Навыки</label>
              <input v-model="skills" type="text" class="form-control" placeholder="JavaScript, Vue, CSS" />
              <div class="form-text">Укажите навыки через запятую.</div>
            </div>

            <!-- Опыт работы -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Опыт работы</h5>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addExperience">
                  + Добавить место работы
                </button>
              </div>

              <div v-if="experiences.length === 0" class="alert alert-info">
                Пока нет опыта работы. Добавьте первое место работы.
              </div>

              <div v-for="(exp, idx) in experiences" :key="idx" class="card mb-3">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Место работы</label>
                      <input v-model="exp.company" type="text" class="form-control" placeholder="ООО Компания" required />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Должность</label>
                      <input v-model="exp.position" type="text" class="form-control" placeholder="Frontend Developer" required />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Начало работы</label>
                      <input v-model="exp.startDate" type="date" class="form-control" required />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Конец работы</label>
                      <input v-model="exp.endDate" type="date" class="form-control" required />
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="removeExperience(idx)">
                    Удалить
                  </button>
                </div>
              </div>
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

interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
}

const photoInput = ref<HTMLInputElement | null>(null)
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const fullName = ref('')
const dateOfBirth = ref('')
const title = ref('')
const summary = ref('')
const skills = ref('')
const experiences = ref<Experience[]>([])
const message = ref<string | null>(null)
const { getUserId } = useAuth()

function onPhotoSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function addExperience() {
  experiences.value.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
  })
}

function removeExperience(idx: number) {
  experiences.value.splice(idx, 1)
}

async function onSubmit() {
  try {
    const formData = new FormData()
    
    if (photoFile.value) {
      formData.append('photo', photoFile.value)
    }
    
    const resumeData = {
      fullName: fullName.value,
      dateOfBirth: dateOfBirth.value,
      title: title.value,
      summary: summary.value,
      skills: skills.value.split(',').map(s => s.trim()).filter(Boolean),
      experiences: experiences.value,
    }
    
    formData.append('data', JSON.stringify(resumeData))
    
    await api.post('/resumes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    message.value = 'Резюме создано'
    photoFile.value = null
    photoPreview.value = null
    if (photoInput.value) photoInput.value.value = ''
    fullName.value = ''
    dateOfBirth.value = ''
    title.value = ''
    summary.value = ''
    skills.value = ''
    experiences.value = []
  } catch (e: any) {
    message.value = e?.response?.data?.message || 'Create failed'
  }
}
</script>