<template>
  <div class="step-section">
    <div class="mb-6">
      <label for="firmName" class="block text-base font-medium text-gray-700 mb-2">
        Название фирмы 
      </label>
      <input
        type="text"
        id="firmName"
        v-model="form.firmName"
        placeholder="Введите название вашей компании"
        class="form-input"
      />
    </div>
    <div class="mb-6">
      <label for="managerEmail" class="block text-base font-medium text-gray-700 mb-2">
        Email менеджера *
      </label>
      <input
        type="email"
        id="managerEmail"
        v-model="form.managerEmail"
        placeholder="Введите email"
        class="form-input"
      />
    </div>
    <div class="mb-6">
      <label for="managerPhone" class="block text-base font-medium text-gray-700 mb-2">
        Телефон менеджера *
      </label>
      <input
        type="tel"
        id="managerPhone"
        v-model="form.managerPhone"
        placeholder="Введите телефон"
        class="form-input"
      />
    </div>
  </div>
</template>

<script setup>
import { sendOrderEmail } from '@/firebase';

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  totalSum: {
    type: Number,
    required: true,
  }
});

async function submitForm() {
  try {
    const result = await sendOrderEmail({
      firmName: props.form.firmName,
      managerEmail: props.form.managerEmail,
      managerPhone: props.form.managerPhone,
      city: props.form.city,
      address: props.form.address,
      selectedType: props.form.selectedType,
      date: props.form.date,
      selectedOptions: props.form.selectedOptions,
      urgent: props.form.urgent,
      selectedTime: props.form.selectedTime,
      totalSum: props.totalSum
    });
    
    if (result.data.success) {
      alert('Заявка успешно отправлена!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Произошла ошибка при отправке заявки');
  }
}
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

.summary-item {
  border-bottom: 1px solid var(--border-light);
}

.summary-label, .summary-value {
  color: var(--text-primary) !important;
}

.total-sum {
  background: var(--bg-input);
  border: 1px solid var(--border-light);
}

.submit-button {
  background: #22c55e;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background: #16a34a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}
</style>