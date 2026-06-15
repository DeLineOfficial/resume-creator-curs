<script setup lang="ts">
    // App shell — no setup logic required
</script>
<template>
      <div>
        <nav>
          <router-link to="/">Home</router-link> |
          <router-link to="/login">Login</router-link> |
          <router-link to="/register">Register</router-link> |
          <router-link to="/create">Create Resume</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
        </nav>
        <router-view />
      </div>
</template>
<style>
    nav { padding: 10px; background: #f3f3f3 }
    nav a { margin-right: 8px }
    body { font-family: Arial, sans-serif; }
</style>
