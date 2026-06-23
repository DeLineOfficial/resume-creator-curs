import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HelloWorld.vue'
import { useAuth } from '../composables/useAuth'

const auth = useAuth()

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: () => import('../pages/Login.vue'), meta: { guest: true } },
  { path: '/register', name: 'Register', component: () => import('../pages/Register.vue'), meta: { guest: true } },
  { path: '/create', name: 'Create', component: () => import('../pages/CreateResume.vue'), meta: { requiresAuth: true } },
  { path: '/resumes/:id/edit', name: 'EditResume', component: () => import('../pages/CreateResume.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../pages/Dashboard.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return next({ name: 'Home' })
  }

  if (to.meta.guest && auth.isAuthenticated.value) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
