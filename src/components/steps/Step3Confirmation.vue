<template>
  <div class="step-section">
    <div class="mb-6">
      <label for="firmName" class="block text-base font-medium  mb-2">
        Название фирмы
      </label>
      <input
        type="text"
        id="firmName"
        v-model="form.firmName"
        placeholder="Введите название вашей компании"
        class="form-input"
      />
       <span v-if="errors.firmName" class="text-red-500 text-sm mt-1">{{ errors.firmName[0] }}</span>
    </div>
    <div class="mb-6">
      <label for="managerEmail" class="block text-base font-medium  mb-2">
        Email менеджера *
      </label>
      <input
        type="email"
        id="managerEmail"
        v-model="form.managerEmail"
        placeholder="Введите email"
        class="form-input"
      />
       <span v-if="errors.managerEmail" class="text-red-500 text-sm mt-1">{{ errors.managerEmail[0] }}</span>
    </div>
    <div class="mb-6">
      <label for="managerPhone" class="block text-base font-medium  mb-2">
        Телефон менеджера *
      </label>
      <input
        type="tel"
        id="managerPhone"
        v-model="form.managerPhone"
        placeholder="Введите телефон"
        class="form-input"
      />
        <span v-if="errors.managerPhone" class="text-red-500 text-sm mt-1">{{ errors.managerPhone[0] }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  totalSum: {
    type: Number,
    required: true,
  },
    errors: {  // Receive errors as a prop
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update-field']) // Add emit
</script>

<style scoped>
.step-section {
  background: var(--bg-dark);
  border-radius: 16px;
}

/* No need for !important overrides here. Let global styles apply. */
/* If you DO need to customize something SPECIFICALLY for this component,
   do it with Tailwind classes in the <template>, not here. */

input {
  background: var(--bg-input);
  border: 1px solid var(--border-light);
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

.summary-item {
  border-bottom: 1px solid var(--border-light);
}

.total-sum {
  background: var(--bg-input);
  border: 1px solid var(--border-light);
}

</style>