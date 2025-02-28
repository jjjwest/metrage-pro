<template>
  <div class=" min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">Панель Исполнителя</h1>

      <div class="glass-card rounded-lg shadow overflow-x-auto">
        <table class="min-w-full">
          <thead class="border-b border-white/10">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID Заявки</th>
              <th class="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Пользователь</th>
              <th class="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Город</th>
              <th class="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Тип замера</th>
              <th class="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Статус</th>
              <th class="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="(application, index) in assignedApplications" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ application.userId }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ application.city }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ application.selectedType }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(application.status)">
                  {{ application.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="completeTask(index)"
                  class="gradient-3 px-4 py-2 rounded-md text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Завершить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const applications = ref([
  {
    userId: 'Пользователь1',
    city: 'Москва',
    selectedType: 'Квартира',
    status: 'assigned',
    executorId: 'Исполнитель1'
  },
  {
    userId: 'Пользователь2',
    city: 'СПб',
    selectedType: 'Дом',
    status: 'assigned',
    executorId: 'Исполнитель2'
  }
])

const assignedApplications = computed(() =>
  applications.value.filter(app => app.executorId === userStore.user.name && app.status === 'assigned')
)

const getStatusClass = (status) => {
  const classes = {
    new: 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-400/20 text-yellow-200',
    assigned: 'px-2 py-1 text-xs font-medium rounded-full bg-blue-400/20 text-blue-200',
    completed: 'px-2 py-1 text-xs font-medium rounded-full bg-green-400/20 text-green-200'
  }
  return classes[status] || ''
}

const completeTask = (index) => {
  applications.value[index].status = 'completed'
  alert('Задача завершена!')
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