<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="onSubmit">
      <div><input v-model="email" placeholder="Email" /></div>
      <div><input v-model="password" type="password" placeholder="Password" /></div>
      <button>Register</button>
    </form>
    <p v-if="message">{{ message }}</p>
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
