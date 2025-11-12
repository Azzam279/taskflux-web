import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Tasks from '@/pages/Tasks.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/', name: 'tasks', component: Tasks, meta: { requiresAuth: true } }
  ],
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) return next({ name: 'login' })
  if (to.name === 'login' && token) return next({ name: 'tasks' })
  next()
})

export default router
