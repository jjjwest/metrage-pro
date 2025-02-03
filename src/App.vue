<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Импорты не нужны, так как вся логика в <router-view>
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif; /* Используем шрифт Roboto */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Стили для локального подключения шрифта */
@font-face {
  font-family: 'Roboto';
  src: url('./assets/fonts/Roboto-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Roboto';
  src: url('./assets/fonts/Roboto-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}
</style>