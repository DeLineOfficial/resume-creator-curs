<template>
  <div class="text-center">
    <div class="py-5">
      <h1 class="display-4">Создай резюме быстро и красиво</h1>
      <p class="lead text-muted">Управляй резюме, делись ими и получай лучшие предложения.</p>
      <div class="d-flex justify-content-center gap-3 flex-wrap mt-4">
        <router-link class="btn btn-primary btn-lg" to="/login">Войти</router-link>
        <router-link class="btn btn-outline-primary btn-lg" to="/register">Зарегистрироваться</router-link>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Личный кабинет</h5>
            <p class="card-text">Просматривай и редактируй свои резюме в одном месте.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Шаблон и структура</h5>
            <p class="card-text">Заполняй основные секции резюме и получай аккуратный результат.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Легкий старт</h5>
            <p class="card-text">После регистрации ты сможешь создавать и просматривать резюме.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
