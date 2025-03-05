<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 gradient-1">
      <div class="max-w-md w-full space-y-8 glass-card p-8 rounded-xl">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-6">404</h1>
          <h2 class="text-2xl font-semibold mb-4">Страница не найдена</h2>
          <p class="mb-6 text-gray-600">Возможно, вы ввели неправильный адрес или страница была перемещена.</p>
          <router-link to="/" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
            Вернуться на главную
          </router-link>
        </div>
      </div>
    </div>
  </template>