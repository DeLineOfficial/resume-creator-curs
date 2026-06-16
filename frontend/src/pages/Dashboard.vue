<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'
import html2pdf from 'html2pdf.js'

interface Resume {
  id: number
  data: {
    fullName: string
    dateOfBirth: string
    title: string
    summary: string
    skills: string[]
    experiences: Array<{
      company: string
      position: string
      startDate: string
      endDate: string
    }>
    photo?: string
  }
  createdAt: string
}

const resumes = ref<Resume[]>([])
const loading = ref(false)
const { getUserId } = useAuth()

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getPhotoUrl(photoPath: string | undefined): string {
  if (!photoPath) return ''
  return photoPath
}

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

function exportToPdf(resume: Resume) {
  const element = document.createElement('div')
  element.style.padding = '20px'
  element.style.fontFamily = 'Arial, sans-serif'

  let html = `
    <div style="display: flex; gap: 20px; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px;">
      <div style="width: 200px; height: 150px; flex-shrink: 0;">
        ${resume.data.photo ? `<img src="${getPhotoUrl(resume.data.photo)}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />` : '<div style="width: 120px; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">📷</div>'}
      </div>
      <div style="flex: 1;">
        <h1 style="margin: 0; font-size: 24px; color: #333;">${resume.data.fullName}</h1>
        <h2 style="margin: 8px 0 0 0; font-size: 18px; color: #007bff;">${resume.data.title}</h2>
        <p style="margin: 10px 0 0 0; color: #666;"><strong>Дата рождения:</strong> ${formatDate(resume.data.dateOfBirth)}</p>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="border-bottom: 2px solid #007bff; padding-bottom: 8px; color: #333; font-size: 16px;">О СЕБЕ</h3>
      <p style="margin: 10px 0; line-height: 1.6; color: #555;">${resume.data.summary}</p>
    </div>
  `

  // Навыки
  if (resume.data.skills && resume.data.skills.length > 0) {
    html += `
      <div style="margin-bottom: 25px;">
        <h3 style="border-bottom: 2px solid #007bff; padding-bottom: 8px; color: #333; font-size: 16px;">НАВЫКИ</h3>
        <p style="margin: 10px 0; line-height: 1.8;">
          ${resume.data.skills.map(s => `<span style="display: inline-block; background: #f0f0f0; padding: 4px 10px; border-radius: 4px; margin-right: 8px; margin-bottom: 5px; font-size: 14px;">${s}</span>`).join('')}
        </p>
      </div>
    `
  }

  if (resume.data.experiences && resume.data.experiences.length > 0) {
    html += `
      <div style="margin-bottom: 25px;">
        <h3 style="border-bottom: 2px solid #007bff; padding-bottom: 8px; color: #333; font-size: 16px;">ОПЫТ РАБОТЫ</h3>
    `
    for (const exp of resume.data.experiences) {
      html += `
        <div style="margin: 15px 0; padding-left: 15px; border-left: 3px solid #007bff;">
          <h4 style="margin: 0; color: #333; font-size: 15px;">${exp.position}</h4>
          <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>${exp.company}</strong></p>
          <p style="margin: 5px 0; color: #999; font-size: 13px;">${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}</p>
        </div>
      `
    }
    html += `</div>`
  }

  element.innerHTML = html

  const opt = {
    margin: 10,
    filename: `${resume.data.fullName}_resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }

  html2pdf().set(opt).from(element).save()
}

async function deleteResume(id: number) {
  if (confirm('Вы уверены? Это действие необратимо.')) {
    try {
      await api.delete(`/resumes/${id}`)
      await load()
    } catch (err) {
      console.error(err)
    }
  }
}

onMounted(load)
</script>

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
        <div class="col-lg-12" v-for="r in resumes" :key="r.id">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-3 text-center">
                  <div v-if="r.data.photo" class="mb-3 resume-image-container">
                    <img :src="getPhotoUrl(r.data.photo)" :alt="r.data.fullName" class="img-fluid resume-image rounded"/>
                  </div>
                  <div v-else class="bg-light rounded p-5 text-muted mb-3">
                    <div style="font-size: 3rem;">📷</div>
                  </div>
                </div>
                <div class="col-md-9">
                  <h3 class="mb-1">{{ r.data.fullName }}</h3>
                  <h5 class="text-primary mb-3">{{ r.data.title }}</h5>
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <small class="text-muted d-block"><strong>Дата рождения:</strong> {{ formatDate(r.data.dateOfBirth) }}</small>
                      <small class="text-muted d-block"><strong>Резюме создано:</strong> {{ new Date(r.createdAt).toLocaleDateString('ru-RU') }}</small>
                    </div>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" @click="exportToPdf(r)">
                      📥 Экспорт в PDF
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteResume(r.id)">
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              </div>

              <div class="mb-4" v-if="r.data.summary">
                <h6 class="text-uppercase text-muted fw-bold mb-2">О себе</h6>
                <p>{{ r.data.summary }}</p>
              </div>

              <div class="mb-4" v-if="r.data.skills && r.data.skills.length > 0">
                <h6 class="text-uppercase text-muted fw-bold mb-2">Навыки</h6>
                <div>
                  <span class="badge bg-secondary me-2 mb-2" v-for="s in r.data.skills" :key="s">{{ s }}</span>
                </div>
              </div>

              <div v-if="r.data.experiences && r.data.experiences.length > 0">
                <h6 class="text-uppercase text-muted fw-bold mb-3">Опыт работы</h6>
                <div class="experience-list">
                  <div class="mb-3 border-start ps-3" v-for="(exp, idx) in r.data.experiences" :key="idx">
                    <h6 class="mb-1">{{ exp.position }}</h6>
                    <p class="text-muted mb-1">{{ exp.company }}</p>
                    <small class="text-muted">
                      {{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resume-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resume-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
  object-position: center;
  display: flex;
}
</style>