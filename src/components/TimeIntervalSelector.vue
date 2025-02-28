<template>
  <div class="step-section">
    <div class="form-row">
      <div class="form-group">
        <label for="city">Город *</label>
        <select id="city" v-model="form.city" class="w-full">
          <option value="Москва">Москва</option>
          <option value="МО">Московская область</option>
          <option value="СПб">Санкт-Петербург</option>
          <option value="Казань">Казань</option>
          <option value="Батуми">Батуми</option>
        </select>
      </div>
      <div class="form-group">
        <label for="address">Адрес *</label>
        <input 
          type="text" 
          id="address" 
          v-model="form.address" 
          placeholder="Введите адрес" 
          class="w-full"
        >
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="measurement-type">Тип замера *</label>
        <select id="measurement-type" v-model="form.selectedType" class="w-full">
          <option disabled value="">Выберите тип</option>
          <option v-for="type in types" :key="type.id" :value="type.id">
            {{ type.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="date">Дата замера *</label>
        <input type="date" id="date" v-model="form.date" class="w-full">
      </div>
    </div>

    <div v-if="['Квартира', 'Дом'].includes(form.selectedType)" class="options-group">
      <span>Выберите помещения:</span>
      <div class="options-horizontal">
        <div v-for="option in optionsFlatHouse" :key="option.id" class="option-item">
          <label :for="option.id">{{ option.name }}</label>
          <input 
            type="number" 
            :id="option.id" 
            v-model.number="form.selectedOptions[option.id]" 
            min="0"
            class="w-20"
          >
        </div>
      </div>
    </div>

    <div v-else-if="form.selectedType === 'Офис'" class="options-group">
      <span>Выберите помещения:</span>
      <div class="options-horizontal">
        <div v-for="option in optionsOffice" :key="option.id" class="option-item">
          <label :for="option.id">{{ option.name }}</label>
          <input 
            type="number" 
            :id="option.id" 
            v-model.number="form.selectedOptions[option.id]" 
            min="0"
            class="w-20"
          >
        </div>
      </div>
    </div>

    <div v-else-if="form.selectedType === 'Обмер'" class="form-group">
      <label for="area">Площадь, м²</label>
      <input 
        type="number" 
        id="area" 
        v-model.number="form.area" 
        placeholder="Введите площадь" 
        min="0"
        class="w-full"
      >
    </div>

    <div class="bg-gray-50 rounded-lg p-6 mt-6">
      <div class="flex items-center mb-4">
        <input 
          type="checkbox" 
          id="urgent" 
          v-model="form.urgent"
          class="w-4 h-4 text-[#1E3A5F] border-gray-300 rounded focus:ring-[#1E3A5F]"
        >
        <label for="urgent" class="ml-2 text-gray-700 font-medium">Срочный выезд</label>
      </div>
      
      <div v-if="form.urgent" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="interval in timeIntervals" 
            :key="interval.id" 
            class="relative"
          >
            <input 
              type="radio" 
              :id="interval.id" 
              name="time-interval" 
              :value="interval.id" 
              v-model="form.selectedTimeInterval"
              class="peer hidden"
            >
            <label 
              :for="interval.id"
              class="block p-4 bg-white border rounded-lg cursor-pointer transition-colors
                     peer-checked:bg-[#1E3A5F] peer-checked:text-white
                     hover:bg-gray-50 peer-checked:hover:bg-[#142847]"
            >
              {{ interval.label }}
              <div class="text-sm opacity-75">+{{ interval.price }}₽</div>
            </label>
          </div>
        </div>

        <!-- Выбор времени в зависимости от интервала -->
        <div v-if="form.selectedTimeInterval" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ getTimeLabel }}
          </label>
          
          <!-- Точное время -->
          <input 
            v-if="form.selectedTimeInterval === 'exact'"
            type="time"
            v-model="form.selectedTime"
            min="08:00"
            max="20:00"
            class="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
          
          <!-- Интервал 1 час -->
          <select 
            v-if="form.selectedTimeInterval === '1h'"
            v-model="form.selectedTime"
            class="w-full"
          >
            <option value="">Выберите интервал</option>
            <option v-for="time in hourIntervals" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
          
          <!-- Интервал 4 часа -->
          <select 
            v-if="form.selectedTimeInterval === '4h'"
            v-model="form.selectedTime"
            class="w-full"
          >
            <option value="">Выберите интервал</option>
            <option v-for="time in fourHourIntervals" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
          
          <!-- Половина дня -->
          <select 
            v-if="form.selectedTimeInterval === 'half_day'"
            v-model="form.selectedTime"
            class="w-full"
          >
            <option value="">Выберите время</option>
            <option value="08:00-13:00">Первая половина (08:00 - 13:00)</option>
            <option value="14:00-20:00">Вторая половина (14:00 - 20:00)</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
});

// Константы
const ROOM_PRICE = 500;

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
  { id: 'exact', label: 'Точно ко времени', price: 1200 },
  { id: '1h', label: 'Интервал 1 час', price: 1000 },
  { id: '4h', label: 'Интервал 4 часа', price: 700 },
  { id: 'half_day', label: 'К половине дня', price: 0 }
];

// Генерация часовых интервалов
const hourIntervals = computed(() => {
  const intervals = [];
  for (let hour = 8; hour < 20; hour++) {
    const start = hour.toString().padStart(2, '0') + ':00';
    const end = (hour + 1).toString().padStart(2, '0') + ':00';
    intervals.push(`${start}-${end}`);
  }
  return intervals;
});

// Интервалы по 4 часа
const fourHourIntervals = [
  '08:00-12:00',
  '12:00-16:00',
  '16:00-20:00'
];

// Текст для label выбора времени
const getTimeLabel = computed(() => {
  switch (props.form.selectedTimeInterval) {
    case 'exact':
      return 'Выберите точное время:';
    case '1h':
      return 'Выберите часовой интервал:';
    case '4h':
      return 'Выберите 4-часовой интервал:';
    case 'half_day':
      return 'Выберите половину дня:';
    default:
      return 'Выберите время:';
  }
});
</script>