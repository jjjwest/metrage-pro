<template>
  <div class="step-section">
    <div class="mb-6">
      <label for="clientName" class="block text-base font-medium text-gray-700 mb-2">
        Имя клиента
      </label>
      <input
        type="text"
        id="clientName"
        v-model="form.clientName"
        placeholder="Введите имя клиента"
        class="form-input"
      />
    </div>
    <div class="mb-6">
      <label for="clientPhone" class="block text-base font-medium text-gray-700 mb-2">
        Номер телефона клиента*
      </label>
      <input
        type="tel"
        id="clientPhone"
        v-model="form.clientPhone"
        placeholder="Введите номер телефона"
        class="form-input"
      />
    </div>
    <div class="mb-6">
      <label for="distance" class="block text-base font-medium text-gray-700 mb-2">
        Удалённость объекта от МКАД (50₽/км) 
      </label>
      <input
        type="number"
        id="distance"
        v-model.number="form.distance"
        placeholder="Введите расстояние"
        min="0"
        class="form-input"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  form: {
    type: Object,
    required: true,
  }
});
</script>

<style scoped>
.step-section {
  background: var(--bg-dark);
  border-radius: 16px;
  color: var(--text-primary);
}

label {
  color: var(--text-primary) !important;
}

input {
  background: var(--bg-input);
  border: 1px solid var(--border-light);
  color: var(--text-primary) !important;
  width: 100%;
  height: 42px;
}

input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 8px var(--primary);
}

input::placeholder {
  color: var(--text-placeholder);
}
</style>