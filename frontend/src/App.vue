<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()

function onLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">Твоё резюме</router-link>
        <div class="d-flex align-items-center gap-2">
          <router-link class="nav-link text-white" to="/">Главная</router-link>
          <router-link v-if="!isAuthenticated" class="nav-link text-white" to="/login">Войти</router-link>
          <router-link v-if="!isAuthenticated" class="nav-link text-white" to="/register">Регистрация</router-link>
          <router-link v-if="isAuthenticated" class="nav-link text-white" to="/dashboard">Мои резюме</router-link>
          <router-link v-if="isAuthenticated" class="nav-link text-white" to="/create">Создать резюме</router-link>
          <button v-if="isAuthenticated" class="btn btn-outline-light btn-sm ms-2" type="button" @click="onLogout">Выйти</button>
        </div>
      </div>
    </nav>

    <div class="container py-5">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
body { font-family: Arial, sans-serif; }
.navbar-brand {
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  transform: skew(-15deg);
  border-bottom: 3px solid #fff;
}
</style>
