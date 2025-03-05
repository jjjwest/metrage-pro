<template>
  <div class="glass-form w-full max-w-xl mx-auto">
    <div class="text-center mb-4">
      <h2 class="text-xl font-bold mb-1">Калькулятор стоимости замера</h2>
    </div>
    <div class="space-y-4">
      <component :is="currentStepComponent" :form="form" :errors="validationErrors" @update-field="updateField" :total-sum="totalSum" /> 
    </div>

    <div class="mt-6">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Предварительная стоимость:</span>
        <span class="text-xl font-bold text-primary">{{ totalSum }} ₽</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">Точная стоимость рассчитывается после осмотра объекта</p>
    </div>

     <div v-if="Object.keys(validationErrors).length > 0" class="mt-4">
      <div v-for="(errorArr, field) in validationErrors" :key="field" class="text-red-500 text-sm">
          <div v-for="(errorMsg, index) in errorArr" :key="index">
              {{ errorMsg }}
          </div>
      </div>
    </div>

    <div class="mt-6 flex justify-between">
      <button v-if="currentStep > 1" @click="prevStep" class="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400">Назад</button>
      <div class="flex gap-2">
        <button @click="resetForm" class="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400">Сброс</button>
        <button @click="nextStep" class="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-700">
          {{ currentStep === totalSteps ? 'Отправить' : 'Далее' }}
        </button>
      </div>
    </div>
    
    <SuccessModal 
      :show-success-modal="showSuccessModal" 
      :order-number="orderNumber" 
      @close="closeSuccessModal" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Step1Details from './steps/Step1Details.vue';
import Step2Contacts from './steps/Step2Contacts.vue';
import Step3Confirmation from './steps/Step3Confirmation.vue';
import SuccessModal from './common/SuccessModal.vue';
import { BASE_FEE, AREA_RATE, DISTANCE_RATE, ROOM_PRICE, FULL_ROOM_PRICE } from '@/stores/orderPricing';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, numeric, minValue } from '@vuelidate/validators';
import { useFormValidation } from '@/composables/useFormValidation';

const currentStep = ref(1);
const totalSteps = 3;
const showSuccessModal = ref(false);
const orderNumber = ref('');

const form = reactive({
  city: '',
  address: '',
  selectedType: '',
  date: '',
  urgent: false,
  selectedTimeInterval: '',
  distance: null,
  area: null,
  selectedOptions: {},
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  managerEmail: '',
  comment: '',
});

const currentStepComponent = computed(() => {
  if (currentStep.value === 1) return Step1Details;
  if (currentStep.value === 2) return Step2Contacts;
  if (currentStep.value === 3) return Step3Confirmation;
  return null;
});

const optionsFlatHouse = [
  { id: 'Кухня', name: 'Кухня', price: ROOM_PRICE },
  { id: 'Шкаф', name: 'Шкаф', price: ROOM_PRICE },
  { id: 'Гардероб', name: 'Гардероб', price: FULL_ROOM_PRICE },
  { id: 'СУ (1 элемент)', name: 'СУ (1 элемент)', price: ROOM_PRICE },
  { id: 'Комната', name: 'Комната', price: FULL_ROOM_PRICE }
];

const optionsOffice = [
  { id: 'Кабинет', name: 'Кабинет', price: ROOM_PRICE },
  { id: 'Переговорная', name: 'Переговорная', price: ROOM_PRICE },
  { id: 'Санузел', name: 'Санузел', price: ROOM_PRICE },
  { id: 'Коридор', name: 'Коридор', price: ROOM_PRICE },
  { id: 'Холл', name: 'Холл', price: ROOM_PRICE }
];

const timeIntervals = [
  { id: 'exact', label: 'Точно ко времени', price: 1300 },
  { id: '1h', label: 'Интервал 1 час', price: 1000 },
  { id: '4h', label: 'Интервал 4 часа', price: 700 },
  { id: 'half_day', label: 'К половине дня', price: 500 }
];

const totalSum = computed(() => {
  let sum = BASE_FEE;
  if (form.urgent && form.selectedTimeInterval) {
    const interval = timeIntervals.find(item => item.id === form.selectedTimeInterval);
    if (interval) sum += interval.price;
  }
  if (form.distance) {
    sum += form.distance * DISTANCE_RATE;
  }
  if (form.selectedType === 'Обмер' && form.area) {
    sum += form.area * AREA_RATE;
  } else if (['Квартира', 'Дом'].includes(form.selectedType)) {
    optionsFlatHouse.forEach(option => {
      const quantity = Number(form.selectedOptions[option.id]) || 0;
      sum += quantity * option.price;
    });
  } else if (form.selectedType === 'Офис') {
    optionsOffice.forEach(option => {
      const quantity = Number(form.selectedOptions[option.id]) || 0;
      sum += quantity * option.price;
    });
  }
  return sum;
});

const { validateStep, validationErrors, v$ } = useFormValidation(form);

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

async function nextStep() {
  const { isValid } = await validateStep(currentStep.value);
  if (isValid) {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
      const formElement = document.querySelector('.glass-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      submitForm();
    }
  }
}

const updateField = (field, value) => {
    form[field] = value;
};

function closeSuccessModal() {
  showSuccessModal.value = false;
}

async function submitForm() {
    const finalIsValid = await v$.value.$validate();
    if (!finalIsValid) return;

  try {
    const response = await fetch('https://us-central1-metrage-d74ef.cloudfunctions.net/sendEmailAndTelegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        totalSum: totalSum.value
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при отправке заявки');
    }

    const result = await response.json();
    if (result.success) {
      orderNumber.value = result.orderNumber || Math.floor(100000 + Math.random() * 900000).toString();
      showSuccessModal.value = true;
      resetForm();
    } else {
      throw new Error(result.error || 'Ошибка при отправке заявки');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при отправке заявки: ' + error.message);
  }
}

function resetForm() {
  Object.keys(form).forEach(key => {
    if (key === 'selectedOptions') {
      v$.value.selectedOptions.$reset();
      form.selectedOptions = {};
    }
      else if (key === 'area' || key === 'distance'){
          form[key] = null;
      }
    else {
      form[key] = '';

    }
  });
  form.urgent = false;
  currentStep.value = 1;
  v$.value.$reset();
  validationErrors.value = {};
}

</script>

<style scoped>

</style>