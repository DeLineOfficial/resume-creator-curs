<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
    <div style="display: flex; gap: 20px; margin-bottom: 30px;">
      <div style="width: 150px; height: 150px; flex-shrink: 0;">
        ${resume.data.photo ? `<div style="width: 150px; height: 150px; border-radius: 8px; background-image: url('${getPhotoUrl(resume.data.photo)}'); background-size: cover; background-position: center;"></div>` : '<div style="width: 150px; height: 150px; border-radius: 8px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 2rem;">📷</div>'}
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

const router = useRouter()

function editResume(id: number) {
  router.push({ name: 'EditResume', params: { id } })
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
        <div class="col-12" v-for="r in resumes" :key="r.id">
          <div class="card shadow-sm resume-card">
            <div class="card-body position-relative resume-card-body">
              <div class="resume-card-actions">
                <button class="btn btn-sm btn-outline-secondary" @click="exportToPdf(r)">
                  📥 Экспорт
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="editResume(r.id)">
                  ✏️ Редактировать
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteResume(r.id)">
                  🗑️ Удалить
                </button>
              </div>

              <div class="resume-card-main">
                <div class="resume-image-wrapper">
                  <div v-if="r.data.photo" class="resume-image-container">
                    <img :src="getPhotoUrl(r.data.photo)" :alt="r.data.fullName" class="resume-image rounded" />
                  </div>
                  <div v-else class="resume-image-placeholder">
                    📷
                  </div>
                </div>

                <div class="resume-card-content">
                  <div class="resume-card-header mb-3">
                    <h3 class="mb-1">{{ r.data.fullName }}</h3>
                    <h5 class="text-primary mb-0">{{ r.data.title }}</h5>
                  </div>

                  <div class="resume-summary mb-3" v-if="r.data.summary">
                    <p class="mb-0">{{ r.data.summary }}</p>
                  </div>

                  <div v-if="r.data.skills && r.data.skills.length > 0" class="resume-tags mb-3">
                    <span class="badge bg-secondary" v-for="s in r.data.skills" :key="s">{{ s }}</span>
                  </div>

                  <div v-if="r.data.experiences && r.data.experiences.length > 0" class="resume-experience d-flex flex-wrap gap-2 mb-3">
                    <div class="experience-pill" v-for="(exp, idx) in r.data.experiences" :key="idx">
                      <div class="fw-bold">{{ exp.position }}</div>
                      <div class="text-muted small">{{ exp.company }}</div>
                      <div class="text-muted small">{{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}</div>
                    </div>
                  </div>

                  <div class="resume-meta text-muted small mt-auto">
                    <div><strong>Дата рождения:</strong> {{ formatDate(r.data.dateOfBirth) }}</div>
                    <div><strong>Создано:</strong> {{ new Date(r.createdAt).toLocaleDateString('ru-RU') }}</div>
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
.resume-card {
  border-radius: 18px;
  min-height: 260px;
}

.resume-card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.resume-card-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 1;
}

.resume-card-actions .btn {
  min-width: auto;
  padding: 0.5rem 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.resume-card-main {
  display: flex;
  gap: 1.75rem;
  align-items: stretch;
  flex-wrap: wrap;
}

.resume-image-wrapper {
  flex: 0 0 220px;
  display: flex;
}

.resume-image-container,
.resume-image-placeholder {
  width: 220px;
  height: 220px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f8f9fa;
}

.resume-image-placeholder {
  font-size: 2rem;
  color: #adb5bd;
}

.resume-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
  object-position: center;
}

.resume-card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.resume-card-header h3,
.resume-card-header h5 {
  margin: 0;
}

.resume-summary {
  color: #495057;
}

.resume-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.experience-pill {
  flex: 1 1 220px;
  min-width: 200px;
  max-width: 320px;
  background: #f8f9fa;
  border-radius: 14px;
  padding: 0.95rem;
}

.experience-pill .text-muted {
  display: block;
}

.resume-meta {
  margin-top: auto;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .resume-card-main {
    flex-direction: column;
  }

  .resume-image-wrapper {
    flex: 0 0 auto;
    width: 100%;
  }

  .resume-image-container,
  .resume-image-placeholder {
    width: 100%;
    height: 200px;
  }
}
</style>