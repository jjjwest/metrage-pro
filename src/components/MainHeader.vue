<template>
  <header class="header-container sticky top-0 z-50">
    <div class="glass-header-blur"></div>
    
    <nav class="container mx-auto flex justify-between items-center py-4 px-4 lg:px-8 relative z-10">
      <router-link to="/" class="flex items-center logo-link group">
        <div class="logo-wrapper relative">
          <span class="logo-part1 text-3xl lg:text-4xl font-extrabold text-white tracking-wide transition-colors duration-300 relative z-10">Metrage</span>
          <span class="logo-part2 text-3xl lg:text-4xl font-extrabold text-blue-500 tracking-normal ml-1 transition-colors duration-300 relative z-10">.Pro</span>
          <div class="logo-glow absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-full filter blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </router-link>
      
      <div class="hidden md:flex nav-links space-x-8 lg:space-x-10">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          class="nav-link text-xl lg:text-2xl text-slate-200 font-medium transition-all duration-300 hover:text-white"
        >
          {{ link.name }}
        </router-link>
      </div>
      
      <div class="hidden md:flex header-actions items-center space-x-6 lg:space-x-8">
        <a href="tel:+79260562903" class="phone-link text-xl lg:text-2xl font-semibold text-white flex items-center transition-all duration-300 hover:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          +7‑926‑056‑29‑03
        </a>
        <router-link
          to="/order"
          class="order-button gradient-animate px-6 py-3 lg:px-7 lg:py-3.5 rounded-full text-white text-lg lg:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-glow active:scale-95 shadow-lg border border-blue-400/30 flex items-center"
        >
          <span class="mr-2">Заказать замер</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
        <template v-if="userStore.user">
          <router-link
            to="/dashboard"
            class="header-link text-xl lg:text-2xl text-slate-200 transition-all duration-300 hover:text-white flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Кабинет
          </router-link>
          <button
            @click="logout"
            class="header-link text-xl lg:text-2xl text-slate-200 transition-all duration-300 hover:text-red-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="login-button px-5 py-2 rounded-full text-slate-200 text-lg lg:text-xl font-medium transition-all duration-300 hover:text-white border border-slate-700/50 hover:border-slate-500 flex items-center backdrop-blur-sm hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Войти
          </router-link>
        </template>
      </div>
      
      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-white focus:outline-none relative p-2 rounded-full hover:bg-white/10 transition-colors duration-300">
          <div v-if="!mobileMenuOpen">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          <div v-else>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </button>
      </div>
    </nav>
    
    <div v-if="mobileMenuOpen" class="md:hidden mobile-menu">
      <div class="container mx-auto px-4 py-6 space-y-5">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          class="block nav-link-mobile text-xl text-slate-200 transition-all duration-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5"
          @click="closeMobileMenu"
        >
          {{ link.name }}
        </router-link>
        <a href="tel:+79260562903" class="block flex items-center text-xl font-semibold text-white transition-all duration-300 hover:text-blue-400 py-3 px-4 rounded-lg hover:bg-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          +7‑926‑056‑29‑03
        </a>
        <router-link 
          to="/order"
          class="block gradient-animate px-5 py-3 rounded-full text-white text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md border border-blue-400/30 text-center flex items-center justify-center"
          @click="closeMobileMenu"
        >
          <span>Заказать замер</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
        <div class="border-t border-slate-700/50 pt-4 mt-4"></div>
        <template v-if="userStore.user">
          <router-link 
            to="/dashboard"
            class="block text-xl text-slate-200 transition-all duration-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 flex items-center"
            @click="closeMobileMenu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Личный кабинет
          </router-link>
          <button 
            @click="handleLogout"
            class="block text-xl text-slate-200 transition-all duration-300 hover:text-red-500 w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login"
            class="block text-xl text-slate-200 transition-all duration-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 flex items-center"
            @click="closeMobileMenu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
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
  position: relative;
  background: rgba(15, 23, 42, 0.90);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
}

.glass-header-blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(12px);
  z-index: 1;
}

.logo-link:hover .logo-part1 {
  color: #3b82f6;
  text-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

.logo-link:hover .logo-part2 {
  color: #ffffff;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.nav-link {
  position: relative;
  padding: 0.5rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #3b82f6, #06b6d4);
  left: 0;
  bottom: -3px;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover::after {
  width: 100%;
}

.phone-link {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.phone-link:hover {
  transform: translateY(-2px);
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
}

.mobile-menu {
  background-color: #0f172a;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  filter: none;
  position: relative;
  z-index: 1000;
}

.order-button {
  position: relative;
  overflow: hidden;
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.nav-link-mobile {
  border-left: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-link-mobile:hover {
  border-left: 2px solid #3b82f6;
  padding-left: 28px;
}
</style>