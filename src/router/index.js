import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/xingce', name: 'xingce', component: () => import('../views/XingceView.vue') },
  { path: '/shenlun', name: 'shenlun', component: () => import('../views/ShenlunView.vue') },
  { path: '/records', name: 'records', component: () => import('../views/RecordsView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
  { path: '/todo', name: 'todo', component: () => import('../views/TodoView.vue') }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
