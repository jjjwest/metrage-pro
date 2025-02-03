<template>
  <div class="home-container">
    <img src="../assets/logo.svg" alt="Логотип" class="logo">
    <h1 class="title">Добро пожаловать в metrage.pro</h1>
    <p class="subtitle">Специалисты по замерам и обмерам для вашего бизнеса и дома. Узнайте, как мы можем помочь вам с точными измерениями.</p>
    <button class="action-button">Узнать больше</button>
    <a href="#" class="services-link">Наши услуги →</a>
  </div>
</template>

<script setup>
import OrderForm from '../components/OrderForm/OrderForm.vue';
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5; /* Светло-серый фон */
  text-align: center;
  font-family: 'Roboto', sans-serif; /* Применяем шрифт Roboto */
}

.logo {
  width: 100px; /* Подбери размер лого */
  margin-bottom: 20px;
}

.title {
  font-size: 2.5rem;
  font-weight: 500; /* Medium начертание */
  margin-bottom: 1rem;
  color: #213547; /* Тёмно-синий цвет */
  line-height: 1.2;
}

.subtitle {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #333; /* Темно-серый цвет */
  line-height: 1.5;
}

.action-button {
  background-color: #4285f4; /* Синий цвет */
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
}

.services-link {
  color: #4285f4; /* Синий цвет */
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
}
</style>