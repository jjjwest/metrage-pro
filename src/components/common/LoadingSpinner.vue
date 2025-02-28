<template>
  <div class="loading-overlay" v-if="isLoading">
    <div class="loading-spinner">
      <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="loading-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Загрузка...'
  }
});
</script>

<style scoped>
.loading-overlay {
  @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50;
}

.loading-spinner {
  @apply flex flex-col items-center bg-white p-6 rounded-lg shadow-xl;
}

.loading-text {
  @apply mt-4 text-gray-700 font-medium;
}
</style>