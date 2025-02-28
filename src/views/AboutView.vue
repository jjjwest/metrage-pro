<template>
  <main class="gradient-1 text-white min-h-screen py-20">
    <div class="container mx-auto px-6 sm:px-10 lg:px-16">
      <div class="text-center mb-20 animate-fade-in">
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg">
          О компании Metrage.Pro
        </h1>
        <p class="text-xl sm:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
          Мы - команда профессионалов, специализирующихся на точных замерах помещений любой сложности.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 animate-fade-in">
        <div v-for="(advantage, index) in advantages" :key="index" 
             class="glass-card p-10 rounded-2xl text-center shadow-xl hover:scale-105 transition-transform">
          <div class="text-white mb-6">
            <component :is="advantage.icon" class="w-14 h-14 mx-auto" />
          </div>
          <h3 class="text-2xl font-semibold mb-4">{{ advantage.title }}</h3>
          <p class="text-white/85 text-lg leading-relaxed">{{ advantage.description }}</p>
        </div>
      </div>

      <div class="glass-card p-12 rounded-2xl mb-20 animate-fade-in shadow-lg">
        <h2 class="text-4xl font-bold mb-8 text-center">Наша история</h2>
        <div class="space-y-6 text-lg leading-relaxed text-white/90">
          <p>Компания Metrage.Pro была основана в 2020 году группой профессиональных инженеров-замерщиков с более чем 10-летним опытом работы.</p>
          <p>За время работы мы выполнили более 1000 заказов, от небольших квартир до крупных офисных комплексов, и заслужили репутацию надежного партнера.</p>
          <p>Наша миссия - предоставлять клиентам максимально точные данные для их проектов, используя современное оборудование и профессиональный подход.</p>
        </div>
      </div>

      <div class="animate-fade-in">
        <h2 class="text-4xl font-bold mb-10 text-center">Наша команда</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="(member, index) in team" :key="index" 
               class="glass-card p-8 rounded-2xl text-center shadow-lg hover:scale-105 transition-transform">
            <div class="w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/30">
              <img :src="member.image" :alt="member.name" class="w-full h-full object-cover">
            </div>
            <h3 class="text-2xl font-semibold mb-2">{{ member.name }}</h3>
            <p class="text-white/85 mb-2 text-lg">{{ member.position }}</p>
            <p class="text-sm text-white/70">{{ member.experience }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import '../styles/gradients.css'
import { UserGroupIcon, ChartBarSquareIcon, TrophyIcon } from '@heroicons/vue/24/outline'

const advantages = [
  {
    title: 'Опыт',
    description: 'Более 10 лет опыта в сфере замеров помещений',
    icon: UserGroupIcon
  },
  {
    title: 'Точность',
    description: 'Используем профессиональное оборудование с точностью до миллиметра',
    icon: ChartBarSquareIcon
  },
  {
    title: 'Качество',
    description: 'Сертифицированные специалисты и гарантия на все работы',
    icon: TrophyIcon
  }
]

const team = [
  {
    name: 'Александр Петров',
    position: 'Специалист по замерам',
    experience: 'Опыт работы: 6 лет',
    image: '/images/team/engineer1.jpg'
  },
  {
    name: 'Елена Иванова',
    position: 'Ведущий специалист по замерам',
    experience: 'Опыт работы: 8 лет',
    image: '/images/team/specialist1.jpg'
  },
  {
    name: 'Дмитрий Сидоров',
    position: 'Специалист по замерам',
    experience: 'Опыт работы: 5 лет',
    image: '/images/team/director1.jpg'
  }
]
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 40px rgba(31, 38, 135, 0.4);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
</style>