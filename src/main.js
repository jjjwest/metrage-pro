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
      component: HomeView,
      meta: {
        title: 'Замеры помещений в Москве и МО | Metrage.Pro',
        description: 'Профессиональные замеры помещений в Москве и Московской области. Точные обмеры для ремонта и дизайна интерьера.'
      }
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('./views/ServicesView.vue'),
      meta: {
        title: 'Услуги замеров помещений | Metrage.Pro',
        description: 'Полный спектр услуг по обмерам помещений в Москве и области. Профессиональные замеры для ремонта, дизайна и строительства.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/AboutView.vue'),
      meta: {
        title: 'О нас | Metrage.Pro',
        description: 'Metrage.Pro - команда профессионалов с многолетним опытом точных обмеров помещений в Москве и Московской области.'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('./views/ContactView.vue'),
      meta: {
        title: 'Контакты | Metrage.Pro',
        description: 'Свяжитесь с нами для заказа замеров помещений в Москве и Московской области. Телефон, email и форма обратной связи.'
      }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('./views/OrderView.vue'),
      meta: {
        title: 'Заказать замер помещения | Metrage.Pro',
        description: 'Оформление заказа на профессиональный замер помещения в Москве и области. Быстро, точно, надежно.'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: {
        title: 'Вход в личный кабинет | Metrage.Pro'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
      meta: {
        title: 'Панель управления | Metrage.Pro'
      }
    },
    {
      path: '/privacy-policy',
      name: 'privacy',
      component: () => import('./views/PrivacyPolicy.vue'),
      meta: {
        title: 'Политика конфиденциальности | Metrage.Pro',
        description: 'Политика конфиденциальности Metrage.Pro - информация о том, как мы защищаем ваши данные.'
      }
    },
    {
      path: '/cookie-policy',
      name: 'cookie-policy',
      component: () => import('./views/CookiePolicy.vue'),
      meta: {
        title: 'Политика использования cookie | Metrage.Pro',
        description: 'Информация о том, как Metrage.Pro использует файлы cookie на своем сайте.'
      }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('./views/TermsOfService.vue'),
      meta: {
        title: 'Условия использования | Metrage.Pro',
        description: 'Пользовательское соглашение и условия использования сервиса Metrage.Pro.'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Metrage.Pro - Замеры помещений';
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description);
  }
  
  next();
});

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')