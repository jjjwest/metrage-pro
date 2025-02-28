<template>
  <main class="gradient-1 text-white min-h-screen py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Контакты</h1>
        <p class="text-xl text-white/90 max-w-3xl mx-auto">
          Свяжитесь с нами удобным для вас способом или оставьте заявку, и мы перезвоним вам
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="animate-fade-in">
          <div class="glass-card p-8 rounded-xl space-y-8">
            <div class="flex items-start space-x-4">
              <PhoneIcon class="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 class="text-xl font-bold mb-2">Телефон</h3>
                <a href="tel:+79260562903" class="text-lg hover:text-blue-200 transition-colors">
                  +7 (926) 056-29-03
                </a>
                <p class="text-white/70 text-sm mt-1">Ежедневно с 9:00 до 21:00</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <EnvelopeIcon class="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 class="text-xl font-bold mb-2">Email</h3>
                <a href="mailto:info@metrage.pro" class="text-lg hover:text-blue-200 transition-colors">
                  info@metrage.pro
                </a>
                <p class="text-white/70 text-sm mt-1">Отвечаем в течение 30 минут</p>
              </div>
            </div>
          
            <div class="flex items-start space-x-4">
              <ClockIcon class="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 class="text-xl font-bold mb-2">Режим работы</h3>
                <p class="text-lg">Пн-Вс: 9:00 - 21:00</p>
                <p class="text-white/70 text-sm mt-1">Без выходных</p>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10">
              <h3 class="text-xl font-bold mb-4"></h3>
              <div class="flex space-x-4">
                <a href="#" class="text-white hover:text-blue-200 transition-colors">
                  <i class="fab fa-telegram text-2xl"></i>
                </a>
                <a href="#" class="text-white hover:text-blue-200 transition-colors">
                  <i class="fab fa-whatsapp text-2xl"></i>
                </a>
                <a href="#" class="text-white hover:text-blue-200 transition-colors">
                  <i class="fab fa-vk text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="animate-fade-in">
          <div class="glass-card p-8 rounded-xl">
            <h2 class="text-2xl font-bold mb-6">Напишите нам</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium mb-2">Ваше имя *</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name"
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                >
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium mb-2">Телефон *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email"
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
              </div>

              <div>
                <label for="message" class="block text-sm font-medium mb-2">Сообщение *</label>
                <textarea 
                  id="message" 
                  v-model="form.message"
                  rows="4"
                  class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                class="w-full px-8 py-4 gradient-3 text-white rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
              >
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import '../styles/gradients.css'
import { ref } from 'vue'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline'

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: ''
})

const submitForm = async () => {
  try {
    console.log('Form submitted:', form.value)
    form.value = {
      name: '',
      phone: '',
      email: '',
      message: ''
    }
  } catch (error) {
    console.error('Error submitting form:', error)
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

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>