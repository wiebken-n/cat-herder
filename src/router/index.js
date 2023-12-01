import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/cats',
      name: 'cats',
      component: () => import('../views/CatsView.vue')
    },
    {
      path: '/add-cat',
      name: 'add-cat',
      component: () => import('../views/AddCatView.vue')
    },
    {
      path: '/catdata/:id',
      name: 'catdata',
      component: () => import('../views/CatDataView.vue')
    },
    {
      path: '/user',
      name: 'userdata',
      component: () => import('@/views/UserAccountView.vue')
    },
    {
      path: '/cat/:id',
      name: 'cat',
      component: () => import('@/views/CatView.vue')
    }
  ]
})

export default router
