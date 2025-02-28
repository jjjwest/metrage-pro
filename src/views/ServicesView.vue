<template>
  <main class="gradient-1  min-h-screen py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Наши услуги</h1>
        <p class="text-xl  max-w-3xl mx-auto">
          Предоставляем профессиональные услуги замера помещений с использованием современного оборудования
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
        <div v-for="(service, index) in services" :key="index"
             class="glass-card p-8 rounded-xl transition-all duration-300 hover:transform hover:scale-105">
          <div class=" mb-6">
            <component :is="service.icon" class="w-12 h-12" />
          </div>
          <h3 class="text-2xl font-bold mb-4">{{ service.title }}</h3>
          <p class=" mb-6">{{ service.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold">от {{ service.price }} ₽</span>
            <router-link
              to="/order"
              class="gradient-3 px-6 py-2 rounded-full text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              Заказать
            </router-link>
          </div>
        </div>
      </div>

      <div class="mt-20 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">Почему выбирают нас</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, index) in features" :key="index"
               class="glass-card p-6 rounded-xl text-center">
            <div class=" mb-4">
              <component :is="feature.icon" class="w-10 h-10 mx-auto" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
            <p class="">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>

import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentIcon,
  ClockIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const services = [
  {
    title: 'Замер квартиры',
    description: 'Профессиональный замер квартиры с использованием лазерного оборудования и составлением подробного плана.',
    price: '3000',
    icon: HomeIcon
  },
  {
    title: 'Замер офиса',
    description: 'Точные замеры офисных помещений любой сложности с учетом особенностей планировки.',
    price: '5000',
    icon: BuildingOfficeIcon
  },
  {
    title: 'Обмер помещений',
    description: 'Комплексный обмер помещений с созданием детальных чертежей и 3D-визуализацией.',
    price: '4000',
    icon: DocumentIcon
  }
]

const features = [
  {
    title: 'Быстро',
    description: 'Выезд в день обращения',
    icon: ClockIcon
  },
  {
    title: 'Точно',
    description: 'Погрешность не более 2 мм',
    icon: ChartBarSquareIcon
  },
  {
    title: 'Надежно',
    description: 'Гарантия на все работы',
    icon: ShieldCheckIcon
  },
  {
    title: 'Выгодно',
    description: 'Конкурентные цены',
    icon: CurrencyDollarIcon
  }
]
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