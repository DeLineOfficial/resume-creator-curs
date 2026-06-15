<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h2 class="card-title mb-4">Зарегистрироваться</h2>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" placeholder="example@mail.com" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input v-model="password" type="password" class="form-control" placeholder="Password" required />
            </div>
            <button class="btn btn-primary w-100" type="submit">Register</button>
          </form>
          <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const message = ref<string | null>(null)
const { register } = useAuth()
const router = useRouter()

async function onSubmit() {
  try {
    await register(email.value, password.value)
    message.value = 'Registered — please login'
    router.push('/login')
  } catch (e: any) {
    message.value = e?.response?.data || 'Registration failed'
  }
}
</script>
