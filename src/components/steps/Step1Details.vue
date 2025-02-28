<template>
  <div class="step-section">
    <div class="grid grid-cols-1 gap-4 mb-4">
      <div class="form-group">
        <label for="city" class="block text-base font-medium text-gray-700 mb-2">Город *</label>
        <select id="city" v-model="form.city" @change="updateField('city', $event.target.value)" class="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:ring-primary focus:border-primary shadow-sm">
          <option value="" disabled>Выберите город</option>
          <option value="Москва">Москва</option>
          <option value="МО">Московская область</option>
          <option value="другой">Другой</option>
        </select>
        <span v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city[0] }}</span>
      </div>
      <div class="form-group">
        <label for="address" class="block text-base font-medium text-gray-700 mb-2">Адрес замера *</label>
        <input type="text" id="address" v-model="form.address" @input="updateField('address', $event.target.value)" placeholder="Введите адрес" class="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
        <span v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address[0] }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="form-group">
        <label for="measurement-type" class="block text-base font-medium text-gray-700 mb-2">Тип замера *</label>
        <select id="measurement-type" v-model="form.selectedType" @change="updateField('selectedType', $event.target.value)" class="w-full px-4 py-2.5 text-base border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
          <option disabled value="">Выберите тип</option>
          <option v-for="type in types" :key="type.id" :value="type.id">{{ type.label }}</option>
        </select>
        <span v-if="errors.selectedType" class="text-red-500 text-sm mt-1">{{ errors.selectedType[0] }}</span>
      </div>

      <div class="form-group">
        <label for="date" class="block text-base font-medium text-gray-700 mb-2">Дата замера *</label>
        <input type="date" id="date" v-model="form.date" @change="updateField('date', $event.target.value)" :min="minDate" class="w-full px-4 py-2.5 text-base border border-gray-300 rounded-md shadow-sm cursor-pointer date-input">
        <span v-if="errors.date" class="text-red-500 text-sm mt-1">{{ errors.date[0] }}</span>
      </div>
    </div>

    <div v-if="['Квартира', 'Дом'].includes(form.selectedType)" class="mb-6">
      <span class="block text-base font-medium text-gray-700 mb-3">Выберите помещения:</span>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        <div v-for="option in optionsFlatHouse" :key="option.id" class="flex flex-col items-center space-y-2 w-full">
          <label :for="option.id" class="text-base text-gray-700 text-center whitespace-nowrap">{{ option.name }}</label>
          <input type="number" :id="option.id" v-model.number="form.selectedOptions[option.id]" @input="updateField('selectedOptions', form.selectedOptions)" min="0" class="w-24 px-3 py-2 text-base border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
           </div>
      </div>
    </div>

    <div v-else-if="form.selectedType === 'Офис'" class="mb-6">
      <span class="block text-base font-medium text-gray-700 mb-3">Выберите помещения:</span>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        <div v-for="option in optionsOffice" :key="option.id" class="flex flex-col items-center space-y-2 w-full">
          <label :for="option.id" class="text-base text-gray-700 text-center whitespace-nowrap">{{ option.name }}</label>
<input type="number" :id="option.id" v-model.number="form.selectedOptions[option.id]"  @input="updateField('selectedOptions', form.selectedOptions)" min="0" class="w-24 px-3 py-2 text-base border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
        </div>
      </div>
    </div>

    <div v-else-if="form.selectedType === 'Обмер'" class="mb-6">
      <label for="area" class="block text-base font-medium text-gray-700 mb-2">Площадь, м²</label>
      <input type="number" id="area" v-model.number="form.area" @input="updateField('area', $event.target.value)" placeholder="Введите площадь" min="0" class="w-full px-4 py-2.5 text-base border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
      <span v-if="errors.area" class="text-red-500 text-sm mt-1">{{ errors.area[0] }}</span>
    </div>
      <div class="form-group" v-if="form.city === 'МО'">
        <label for="distance" class="block text-base font-medium text-gray-700 mb-2">Удаленность от МКАД (км) *</label>
        <input type="number" id="distance" v-model.number="form.distance" @input="updateField('distance', $event.target.value)" placeholder="Введите расстояние" min="0" class="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
        <span v-if="errors.distance" class="text-red-500 text-sm mt-1">{{ errors.distance[0] }}</span>
    </div>

    <div class="bg-gray-100 rounded-lg p-4">
      <div class="flex items-center mb-6">
        <input type="checkbox" id="urgent" v-model="form.urgent"  @change="updateField('urgent', $event.target.checked)" class="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500">
        <label for="urgent" class="ml-3 text-lg font-medium text-gray-700">Срочный выезд</label>
      </div>

      <div v-if="form.urgent" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="interval in timeIntervals" :key="interval.id" class="relative">
            <input type="radio" :id="interval.id" name="timeInterval" :value="interval.id" v-model="form.selectedTimeInterval" @change="updateField('selectedTimeInterval', $event.target.value)" class="peer hidden">
            <label :for="interval.id" class="block p-4 bg-white border rounded-lg cursor-pointer transition-all peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 hover:bg-gray-50 peer-checked:hover:bg-blue-700">
              <div class="text-base font-medium">{{ interval.label }}</div>
              <div class="text-sm mt-1 opacity-75">+{{ interval.price }}₽</div>
            </label>
          </div>
        </div>
          <span v-if="errors.selectedTimeInterval" class="text-red-500 text-sm mt-1">{{ errors.selectedTimeInterval[0] }}</span>
        <div v-if="form.selectedTimeInterval" class="bg-white p-4 rounded-lg border">
          <label class="block text-base font-medium text-gray-700 mb-3">
            {{ form.selectedTimeInterval === 'exact' ? 'Выберите точное время:' : 'Выберите интервал:' }}
          </label>

          <input v-if="form.selectedTimeInterval === 'exact'" type="time" v-model="form.selectedTime" @change="updateField('selectedTime', $event.target.value)" min="08:00" max="20:00" step="3600" class="w-full px-4 py-2.5 text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">

          <select v-else v-model="form.selectedTime" @change="updateField('selectedTime', $event.target.value)" class="w-full px-4 py-2.5 text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Выберите время</option>

            <template v-if="form.selectedTimeInterval === '1h'">
              <option v-for="time in oneHourIntervals" :key="time" :value="time">
                {{ time }}
              </option>
            </template>

            <template v-if="form.selectedTimeInterval === '4h'">
              <option value="08:00-12:00">08:00 - 12:00</option>
              <option value="12:00-16:00">12:00 - 16:00</option>
              <option value="16:00-20:00">16:00 - 20:00</option>
            </template>

            <template v-if="form.selectedTimeInterval === 'half_day'">
              <option value="08:00-13:00">Первая половина (08:00 - 13:00)</option>
              <option value="14:00-20:00">Вторая половина (14:00 - 20:00)</option>
            </template>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { FULL_ROOM_PRICE, ROOM_PRICE } from '@/stores/orderPricing';

const props = defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) } // Принимаем объект ошибок
});

const emit = defineEmits(['update-field']);

const types = [
  { id: 'Квартира', label: 'Квартира' },
  { id: 'Дом', label: 'Дом' },
  { id: 'Офис', label: 'Офис' },
  { id: 'Обмер', label: 'Обмер' }
];

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

const oneHourIntervals = computed(() => {
  const intervals = [];
  for (let hour = 8; hour < 20; hour++) {
    const start = `${hour.toString().padStart(2, '0')}:00`;
    const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
    intervals.push(`${start}-${end}`);
  }
  return intervals;
});
const minDate = computed(() => new Date().toISOString().split('T')[0]);

const updateField = (field, value) => {
    emit('update-field', field, value);
}
</script>

<style scoped>
.step-section {
  @apply bg-gray-100 rounded-lg p-4;
}
.date-input {
    position: relative;
    background: var(--bg-input);
    color: var(--text-primary);
    width: 100%;
    height: 42px;
  }
  .date-input::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
    filter: invert(1);
  }
  .empty-date::-webkit-datetime-edit {
    color: var(--text-placeholder);
  }

  .empty-date::-webkit-datetime-edit-fields-wrapper {
    display: none !important;
  }

  .empty-date::before {
    content: 'Выберите дату';
    color: var(--text-placeholder);
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
  input[type="date"]:valid::-webkit-datetime-edit {
    color: var(--text-primary);
  }
</style>