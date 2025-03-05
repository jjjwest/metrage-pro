<template>
    <div v-if="!accepted" class="cookie-consent">
      <div class="cookie-content">
        <p>Мы используем cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с использованием файлов cookie.</p>
        <button @click="acceptCookies" class="accept-btn">Принять</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const accepted = ref(false);
  
  onMounted(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (cookieAccepted) {
      accepted.value = true;
    }
  });
  
  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    accepted.value = true;
  };
  </script>
  
  <style scoped>
  .cookie-consent {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    z-index: 999;
  }
  
  .cookie-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  
  .cookie-content p {
    margin: 0;
    font-size: 14px;
  }
  
  .accept-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .accept-btn:hover {
    background-color: #2563eb;
  }
  
  @media (max-width: 768px) {
    .cookie-content {
      flex-direction: column;
      gap: 10px;
    }
    
    .accept-btn {
      width: 100%;
    }
  }
  </style>