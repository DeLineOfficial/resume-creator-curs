<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="onSubmit">
      <div><input v-model="email" placeholder="Email" /></div>
      <div><input v-model="password" type="password" placeholder="Password" /></div>
      <button>Login</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const router = useRouter()
const { login } = useAuth()

async function onSubmit() {
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.response?.data || 'Login failed'
  }
}
</script>
