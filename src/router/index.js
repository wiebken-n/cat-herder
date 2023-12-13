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
      path: '/add-cat',
      name: 'add-cat',
      component: () => import('../views/AddCatView.vue')
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
    },
    {
      path: '/herder',
      name: 'herder',
      component: () => import('@/views/HerderView.vue')
    },
    {
      path: '/impressum',
      name: 'impressum',
      component: () => import('@/views/ImpressumView.vue')
    }
  ]
})

export default router
