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
        <router-link class="navbar-brand" to="/">Resume Creator</router-link>
        <div class="d-flex align-items-center gap-2">
          <router-link class="nav-link text-white" to="/">Home</router-link>
          <router-link v-if="!isAuthenticated" class="nav-link text-white" to="/login">Login</router-link>
          <router-link v-if="!isAuthenticated" class="nav-link text-white" to="/register">Register</router-link>
          <router-link v-if="isAuthenticated" class="nav-link text-white" to="/dashboard">Dashboard</router-link>
          <router-link v-if="isAuthenticated" class="nav-link text-white" to="/create">Create</router-link>
          <button v-if="isAuthenticated" class="btn btn-outline-light btn-sm ms-2" type="button" @click="onLogout">Logout</button>
        </div>
      </div>
    </nav>

    <div class="container py-5">
      <router-view />
    </div>
  </div>
</template>

<style>
body { font-family: Arial, sans-serif; }
</style>
