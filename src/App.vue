<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script setup>
import MainHeader from './components/MainHeader.vue'
import Footer from './components/Footer.vue'
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.flex {
  display: flex;
}

.min-h-screen {
  min-height: 100vh; 
}
</style>