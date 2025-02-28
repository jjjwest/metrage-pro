import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import './styles/gradients.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('./views/ServicesView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/AboutView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('./views/ContactView.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('./views/OrderView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue')
    }
  ]
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')