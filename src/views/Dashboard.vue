<template>
  <div class="gradient-1 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4 text-white">Личный кабинет</h1>
      <p class="text-white/80 mb-6">Добро пожаловать, {{ user.name }}!</p>
      
      <h2 class="text-xl font-semibold mb-4 text-white">Ваши заявки:</h2>
      <div class="glass-card rounded-lg shadow overflow-x-auto">
        <table class="min-w-full">
          <thead class="border-b border-white/10">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID Заявки</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Город</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Тип замера</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Статус</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Исполнитель</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="(application, index) in userApplications" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ application.city }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ application.selectedType }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(application.status)">
                  {{ application.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ application.executorId || 'Не назначен' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import '../styles/gradients.css'
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const applications = ref([
  {
    userId: 'Пользователь',
    city: 'Москва',
    selectedType: 'Квартира',
    status: 'new',
    executorId: ''
  },
  {
    userId: 'Пользователь',
    city: 'СПб',
    selectedType: 'Дом',
    status: 'assigned',
    executorId: 'Исполнитель1'
  }
])

const userApplications = computed(() =>
  applications.value.filter(app => app.userId === userStore.user.name)
)

const getStatusClass = (status) => {
  const classes = {
    new: 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-400/20 text-yellow-200',
    assigned: 'px-2 py-1 text-xs font-medium rounded-full bg-blue-400/20 text-blue-200',
    completed: 'px-2 py-1 text-xs font-medium rounded-full bg-green-400/20 text-green-200'
  }
  return classes[status] || ''
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