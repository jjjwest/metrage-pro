<template>
  <div id="app">
    <header class="bg-gray-900 text-white">
      <div class="container mx-auto flex justify-between items-center py-4 px-6">
        <a href="#" class="text-2xl font-bold">Metrage<span class="text-blue-500">.Pro</span></a>
        <nav class="hidden md:flex space-x-6">
          <a href="#" class="hover:text-blue-400">Главная</a>
          <a href="#" class="hover:text-blue-400">Услуги</a>
          <a href="#" class="hover:text-blue-400">Контакты</a>
        </nav>
        <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">Заказать замер</a>
        <button class="md:hidden text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>
      </div>
	</header>
    <main class="container mx-auto px-4 py-8">
		<h1 class="text-4xl font-bold text-gray-800 mb-4">Быстрые и точные замеры</h1>
		<p class="text-lg text-gray-600 mb-8">Выезд специалиста в день обращения. Онлайн-заказ.</p>
		<OrderForm />
    </main>
  </div>
</template>

<script setup>
import OrderForm from './components/OrderForm.vue';
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif; /*  Убедись, что шрифт подключен! */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
    flex: 1 0 auto;
}
</style>