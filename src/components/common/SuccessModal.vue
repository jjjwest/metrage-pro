<template>
  <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="glass-form w-96 p-8 max-w-md animate-fade-in">
      <div class="success-icon mb-6">
        <svg class="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-center mb-4">Заявка отправлена!</h3>
      <p class="text-lg text-center mb-6">Номер заявки: <span class="font-semibold">#{{ orderNumber }}</span></p>
      <p class="text-sm text-center text-gray-600 mb-6">Наш менеджер свяжется с вами в ближайшее время</p>
      <button @click="$emit('close')" class="glass-button-primary w-full py-3 rounded-lg">
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

<style scoped>
.success-icon {
  animation: success-pulse 2s infinite;
}

@keyframes success-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>