<template>
  <div class="gradient-1 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6 text-white">Админ Панель</h1>
      <div class="glass-card rounded-lg shadow overflow-x-auto">
        <table class="min-w-full">
          <thead class="border-b border-white/10">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Пользователь</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Город</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Тип замера</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Статус</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Исполнитель</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="(application, index) in applications" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ application.userId }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ application.city }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ application.selectedType }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(application.status)">
                  {{ application.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-white">{{ application.executorId || 'Не назначен' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <select 
                    v-model="application.executorId"
                    class="bg-white/10 border border-white/20 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option disabled value="">Выберите исполнителя</option>
                    <option v-for="executor in executors" :key="executor.id" :value="executor.name" class="bg-gray-800">
                      {{ executor.name }}
                    </option>
                  </select>
                  <button 
                    @click="assignExecutor(index)"
                    class="gradient-3 px-4 py-2 rounded-md text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Назначить
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import '../styles/gradients.css'
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

const applications = ref([
  {
    userId: 'Пользователь1',
    city: 'Москва',
    selectedType: 'Квартира',
    status: 'new',
    executorId: ''
  },
  {
    userId: 'Пользователь2',
    city: 'СПб',
    selectedType: 'Дом',
    status: 'new',
    executorId: ''
  }
])

const executors = ref([
  { id: 1, name: 'Исполнитель1' },
  { id: 2, name: 'Исполнитель2' }
])

const getStatusClass = (status) => {
  const classes = {
    new: 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-400/20 text-yellow-200',
    assigned: 'px-2 py-1 text-xs font-medium rounded-full bg-blue-400/20 text-blue-200',
    completed: 'px-2 py-1 text-xs font-medium rounded-full bg-green-400/20 text-green-200'
  }
  return classes[status] || ''
}

const assignExecutor = (index) => {
  if (applications.value[index].executorId) {
    applications.value[index].status = 'assigned'
    alert('Исполнитель назначен успешно!')
  } else {
    alert('Пожалуйста, выберите исполнителя.')
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