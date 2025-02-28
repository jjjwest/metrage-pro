<template>
  <header class="header-container sticky top-0 z-50">
    <nav class="container mx-auto flex justify-between items-center py-3 px-4 lg:px-8">
      <router-link to="/" class="flex items-center logo-link">
        <span class="logo-part1 text-3xl lg:text-4xl font-extrabold text-white tracking-wide transition-colors duration-300">Metrage</span>
        <span class="logo-part2 text-3xl lg:text-4xl font-extrabold text-blue-500 tracking-normal ml-1 transition-colors duration-300">.Pro</span>
      </router-link>
      
      <div class="hidden md:flex nav-links space-x-6 lg:space-x-8">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          class="nav-link text-xl lg:text-2xl text-slate-200 transition-all duration-300 hover:text-white"
        >
          {{ link.name }}
        </router-link>
      </div>
      
      <div class="hidden md:flex header-actions items-center space-x-4 lg:space-x-6">
        <a href="tel:+79260562903" class="phone-link text-xl lg:text-2xl font-semibold text-white transition-all duration-300 hover:text-blue-400">
          +7‑926‑056‑29‑03
        </a>
        <router-link
          to="/order"
          class="order-button gradient-3 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full text-white text-lg lg:text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md border-2 border-blue-400/30"
        >
          Заказать замер
        </router-link>
        <template v-if="userStore.user">
          <router-link
            to="/dashboard"
            class="header-link text-xl lg:text-2xl text-slate-200 transition-all duration-300 hover:text-white"
          >
            Личный кабинет
          </router-link>
          <button
            @click="logout"
            class="header-link text-xl lg:text-2xl text-slate-200 transition-all duration-300 hover:text-red-500"
          >
            Выйти
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="login-button px-4 py-2 rounded-full text-slate-200 text-lg lg:text-xl font-medium transition-all duration-300 hover:text-white border border-slate-700 hover:border-slate-500"
          >
            Войти
          </router-link>
        </template>
      </div>
      
      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-slate-200 focus:outline-none">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
    
    <div v-if="mobileMenuOpen" class="md:hidden mobile-menu">
      <div class="container mx-auto px-4 py-4 space-y-4">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          class="block nav-link text-xl text-slate-200 transition-all duration-300 hover:text-white py-2"
          @click="closeMobileMenu"
        >
          {{ link.name }}
        </router-link>
        <a href="tel:+79260562903" class="block text-xl font-semibold text-white transition-all duration-300 hover:text-blue-400 py-2">
          +7‑926‑056‑29‑03
        </a>
        <router-link 
          to="/order"
          class="block gradient-3 px-5 py-2.5 rounded-full text-white text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md border-2 border-blue-400/30 text-center"
          @click="closeMobileMenu"
        >
          Заказать замер
        </router-link>
        <template v-if="userStore.user">
          <router-link 
            to="/dashboard"
            class="block text-xl text-slate-200 transition-all duration-300 hover:text-white py-2"
            @click="closeMobileMenu"
          >
            Личный кабинет
          </router-link>
          <button 
            @click="handleLogout"
            class="block text-xl text-slate-200 transition-all duration-300 hover:text-red-500 w-full text-left py-2"
          >
            Выйти
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login"
            class="block text-xl text-slate-200 transition-all duration-300 hover:text-white py-2"
            @click="closeMobileMenu"
          >
            Войти
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import '../styles/gradients.css'
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const logout = async () => {
  await userStore.logout();
};

const handleLogout = async () => {
  closeMobileMenu();
  await logout();
};

const links = [
  { name: 'Услуги', to: '/services' },
  { name: 'О нас', to: '/about' },
  { name: 'Контакты', to: '/contact' }
];
</script>

<style scoped>
.header-container {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(15px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  font-family: 'Roboto', sans-serif;
}

.logo-link:hover .logo-part1 {
  color: #3b82f6;
}

.logo-link:hover .logo-part2 {
  color: #ffffff;
}

.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background: #fff;
  left: 0;
  bottom: -4px;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.phone-link {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.1);
}

.phone-link:hover {
  background: rgba(59, 130, 246, 0.2);
}

.mobile-menu {
  background: rgba(15, 23, 42, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.order-button {
  background-image: linear-gradient(to right, #3b82f6, #60a5fa);
}

.order-button:hover {
  background-image: linear-gradient(to right, #2563eb, #3b82f6);
}
</style>