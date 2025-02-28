<template>
  <main class="gradient-1 text-gray-900 min-h-screen">
    <section class="pt-8 pb-16 sm:py-12 md:py-16 lg:py-20" style="margin-top: -60px;">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div class="animate-fade-in">
            <div class="max-w-xl">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {{ title }}
              </h1>
              <p class="text-lg sm:text-xl text-gray-700 mt-4 mb-8">
                Быстро и точно рассчитаем стоимость замера — без лишних звонков и ожиданий.
              </p>

              <div class="relative">
                <h3 class="text-2xl font-semibold mb-6 inline-block">
                  Как мы работаем
                  <div class="h-1 w-full bg-primary rounded mt-1"></div>
                </h3>

                <div class="flex flex-col space-y-4">
                  <div class="glass-card p-4 sm:p-6 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-4">
                    <div class="step-number">1</div>
                    <div class="text-xl sm:text-2xl mr-3">📝</div>
                    <div class="font-medium text-sm sm:text-base">Ждём вашу заявку до 18:00</div>
                  </div>

                  <div class="glass-card p-4 sm:p-6 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-4">
                    <div class="step-number">2</div>
                    <div class="text-xl sm:text-2xl mr-3">📞</div>
                    <div class="font-medium text-sm sm:text-base">Связываемся с вами до 20:00</div>
                  </div>

                  <div class="glass-card p-4 sm:p-6 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-4">
                    <div class="step-number">3</div>
                    <div class="text-xl sm:text-2xl mr-3">📏</div>
                    <div class="font-medium text-sm sm:text-base">Выезжаем в согласованное время</div>
                  </div>

                  <div class="glass-card p-4 sm:p-6 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-4">
                    <div class="step-number">4</div>
                    <div class="text-xl sm:text-2xl mr-3">📋</div>
                    <div class="font-medium text-sm sm:text-base">Отправляем замеры и фото на ваш email до 12:00 следующего дня</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center animate-fade-in lg:sticky lg:top-8">
            <div class="glass-card p-5 sm:p-6 rounded-3xl w-full max-w-lg mx-auto">
              <OrderForm :form="form" /> 
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import OrderForm from '@/components/OrderForm.vue'

const title = ref('Профессиональные замеры помещений для вашего проекта.')

const form = reactive({
  city: '',
  address: '',
  selectedType: '',
  date: '',
  selectedOptions: {
    'Кухня': 0,
    'Шкаф': 0,
    'Гардероб': 0,
    'СУ (1 элемент)': 0,
    'Комната': 0,
    'Кабинет': 0,
    'Переговорная': 0,
    'Санузел': 0,
    'Коридор': 0,
    'Холл': 0
  },
  area: 0,
  clientName: '',
  clientPhone: '',
  distance: 0,
  urgent: false,
  selectedTimeInterval: '',
  selectedTime: '',
  comment: '',
  firmName:'',
  managerEmail:'',
  managerPhone:''
});
</script>

<style scoped>
.step-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.4);
}
</style>
