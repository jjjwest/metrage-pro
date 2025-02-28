<template>
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div class="bg-white rounded-lg shadow-lg p-6 w-96">
        <svg class="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2 text-center">Заявка отправлена!</h3>
        <p class="text-base text-gray-700 mb-4 text-center">Номер заявки: #{{ orderNumber }}</p>
        <button @click="$emit('close')" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Закрыть
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SuccessModal',
    props: {
      orderNumber: {
        type: String,
        required: true,
      },
      showSuccessModal: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['close'],
  };
  </script>
  