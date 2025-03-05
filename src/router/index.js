import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const HomeView = () => import('../views/HomeView.vue');
const Login = () => import('../views/Login.vue');
const AdminPanel = () => import('../views/AdminPanel.vue');
const ExecutorPanel = () => import('../views/ExecutorPanel.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const AboutView = () => import('../views/AboutView.vue');
const ServicesView = () => import('../views/ServicesView.vue');
const ContactView = () => import('../views/ContactView.vue');
const OrderView = () => import('../views/OrderView.vue');
const Cookie = () => import('../views/Cookie.vue');
const CookiePolicy = () => import('../views/CookiePolicy.vue');
const TermsOfService = () => import('../views/TermsOfService.vue');
const PrivacyPolicy = () => import('../views/PrivacyPolicy.vue');

const routes = [
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/executor',
    name: 'ExecutorPanel',
    component: ExecutorPanel,
    meta: { requiresAuth: true, requiresRole: 'executor' }
  },
  {
    path: '/about',
    name: 'AboutView',
    component: AboutView
  },
  {
    path: '/services',
    name: 'ServicesView',
    component: ServicesView
  },
  {
    path: '/contact',
    name: 'ContactView',
    component: ContactView
  },
  {
    path: '/order',
    name: 'OrderView',
    component: OrderView
  },
  {
    path: '/cookie',
    name: 'Cookie',
    component: Cookie
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    component: CookiePolicy
  },
  {
    path: '/terms',
    name: 'TermsOfService',
    component: TermsOfService
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  console.log('Route change to:', to.path);

  if (to.meta.requiresAuth && !userStore.user) {
    next('/login');
  } else if (to.meta.requiresRole && userStore.user?.role !== to.meta.requiresRole) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;