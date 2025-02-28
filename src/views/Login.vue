<template>
  <div class="gradient-1 min-h-screen py-16 flex items-center justify-center">
    <div class="glass-card p-8 rounded-xl w-full max-w-md">
      <h1 class="text-3xl font-bold mb-8 text-white text-center">Вход в систему</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-white mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email"
            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-2">Пароль</label>
          <input 
            type="password" 
            id="password" 
            v-model="password"
            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>
        <button 
          type="submit"
          class="w-full gradient-3 px-6 py-3 rounded-md text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          Войти
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import '../styles/gradients.css'
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'

const email = ref('')
const password = ref('')
const userStore = useUserStore()

const handleLogin = async () => {
  try {
    await userStore.login(email.value, password.value)
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
</style>