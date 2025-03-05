<template>
  <main class="gradient-1 text-gray-900 min-h-screen">
    <section class="pt-8 pb-16 sm:py-12 md:py-16 lg:py-20">
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
                <h3 class="text-2xl font-semibold mb-2">Как мы работаем</h3>
                <div class="h-1 w-full bg-primary rounded mt-1"></div>

                <div class="flex flex-col space-y-2 mt-4">
                  <div
                    class="glass-card p-1 sm:p-2 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center">
                    <div class="step-number">1</div>
                    <div class="text-xl sm:text-2xl ml-2">📝</div>
                    <div class="font-medium text-sm sm:text-base leading-tight ml-2">Ждём вашу заявку до 18:00</div>
                  </div>

                  <div
                    class="glass-card p-1 sm:p-2 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center">
                    <div class="step-number">2</div>
                    <div class="text-xl sm:text-2xl ml-2">📞</div>
                    <div class="font-medium text-sm sm:text-base leading-tight ml-2">Связываемся с вами до 20:00</div>
                  </div>

                  <div
                    class="glass-card p-1 sm:p-2 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center">
                    <div class="step-number">3</div>
                    <div class="text-xl sm:text-2xl ml-2">📏</div>
                    <div class="font-medium text-sm sm:text-base leading-tight ml-2">Выезжаем в согласованное время</div>
                  </div>

                  <div
                    class="glass-card p-1 sm:p-2 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center">
                    <div class="step-number">4</div>
                    <div class="text-xl sm:text-2xl ml-2">📋</div>
                    <div class="font-medium text-sm sm:text-base leading-tight ml-2">Отправляем замеры и фото на ваш
                      email до 12:00 следующего дня</div>
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
    
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-8 roboto-title">Стандарт замера</h2>
        
        <div class="max-w-4xl mx-auto relative standard-slider">
          <div class="slider-container" :style="{ transform: `translateX(-${activeSlideStandart * 100}%)` }">
            <div class="slide">
              <img src="../assets/fonts/1.svg" alt="Стандарт замера 1" class="w-full" loading="lazy">
            </div>
            <div class="slide">
              <img src="../assets/fonts/2.svg" alt="Стандарт замера 2" class="w-full" loading="lazy">
            </div>
          </div>
          
          <button @click="prevSlideStandart" class="nav-button left-2" :disabled="activeSlideStandart === 0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button @click="nextSlideStandart" class="nav-button right-2" :disabled="activeSlideStandart === 1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          <div class="dots">
            <button @click="activeSlideStandart = 0" class="dot" :class="{ active: activeSlideStandart === 0 }"></button>
            <button @click="activeSlideStandart = 1" class="dot" :class="{ active: activeSlideStandart === 1 }"></button>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-8 roboto-title">Примеры наших работ</h2>
        
        <div class="max-w-4xl mx-auto relative standard-slider">
          <div class="slider-container" :style="{ transform: `translateX(-${activeSlideExamples * 100}%)` }">
            <div class="slide" v-for="(image, index) in exampleImages" :key="index">
              <img :src="image" :alt="`Пример работы ${index + 1}`" class="w-full h-auto example-image" loading="lazy">
            </div>
          </div>
          
          <button @click="prevSlideExamples" class="nav-button left-2" :disabled="activeSlideExamples === 0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button @click="nextSlideExamples" class="nav-button right-2" :disabled="activeSlideExamples === exampleImages.length - 1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          <div class="dots">
            <button 
              v-for="(_, index) in exampleImages" 
              :key="index"
              @click="activeSlideExamples = index" 
              class="dot" 
              :class="{ active: activeSlideExamples === index }">
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
  import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
  import OrderForm from '@/components/OrderForm.vue'
  import image1 from '../assets/images/1.png'
  import image2 from '../assets/images/2.png'
  import image3 from '../assets/images/3.png'
  import image4 from '../assets/images/4.png'
  import image5 from '../assets/images/5.png'
  import image6 from '../assets/images/6.png'
  import image7 from '../assets/images/7.png'

  const title = ref('Профессиональные замеры помещений для вашего проекта.')
  const activeSlideStandart = ref(0)
  const activeSlideExamples = ref(0)
  let autoplayInterval = null
  
  const exampleImages = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7
  ]

  function prevSlideStandart() {
    if (activeSlideStandart.value > 0) {
      activeSlideStandart.value--
    }
  }

  function nextSlideStandart() {
    if (activeSlideStandart.value < 1) {
      activeSlideStandart.value++
    }
  }

  function prevSlideExamples() {
    if (activeSlideExamples.value > 0) {
      activeSlideExamples.value--
    }
    resetAutoplay()
  }

  function nextSlideExamples() {
    if (activeSlideExamples.value < exampleImages.length - 1) {
      activeSlideExamples.value++
    } else {
      activeSlideExamples.value = 0
    }
    resetAutoplay()
  }
  
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      if (activeSlideExamples.value < exampleImages.length - 1) {
        activeSlideExamples.value++
      } else {
        activeSlideExamples.value = 0
      }
    }, 7000)
  }
  
  function resetAutoplay() {
    clearInterval(autoplayInterval)
    startAutoplay()
  }
  
  onMounted(() => {
    startAutoplay()
    
    const jsonLdScript = document.createElement('script');
    jsonLdScript.setAttribute('type', 'application/ld+json');
    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Metrage.Pro",
      "image": "https://metrage.pro/logo.png",
      "url": "https://metrage.pro",
      "telephone": "+79260562903",
      "email": "dronikov93@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressRegion": "Москва",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 55.755826,
        "longitude": 37.6173
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "21:00"
      },
      "priceRange": "₽₽",
      "description": "Профессиональные замеры помещений в Москве и Московской области"
    });
    document.head.appendChild(jsonLdScript);
  })
  
  onBeforeUnmount(() => {
    clearInterval(autoplayInterval)
    
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      jsonLdScript.remove();
    }
  })

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
    firmName: '',
    managerEmail: '',
    managerPhone: ''
  });
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  
  .step-number {
    min-width: 32px;
    min-height: 32px;
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
  
  .bg-white {
    background: none;
  }
  
  .roboto-title {
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
  }
  
  .standard-slider {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background: transparent;
    margin-bottom: 20px;
  }
  
  .slider-container {
    display: flex;
    width: 100%;
    transition: transform 0.3s ease;
  }
  
  .slide {
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.8);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    color: white;
    transition: all 0.2s ease;
  }

  .nav-button:hover {
    background: rgba(59, 130, 246, 1);
    transform: translateY(-50%) scale(1.1);
  }
  
  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .nav-button.left-2 {
    left: 10px;
  }
  
  .nav-button.right-2 {
    right: 10px;
  }
  
  .dots {
    position: absolute;
    bottom: 16px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(0,0,0,0.2);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .dot.active {
    background: #3b82f6;
    transform: scale(1.2);
  }
  
  .example-image {
    display: block;
    object-fit: contain;
    max-height: 600px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    .example-image {
      max-height: 400px;
    }
    
    .nav-button {
      width: 36px;
      height: 36px;
    }
  }
  
  @media (max-width: 480px) {
    .example-image {
      max-height: 300px;
    }
    
    .nav-button {
      width: 32px;
      height: 32px;
    }
    
    .dots {
      bottom: 8px;
    }
    
    .dot {
      width: 8px;
      height: 8px;
    }
  }
</style>