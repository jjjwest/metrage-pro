<template>
  <div class="order-form">
    <h2 class="form-title">Форма заказа замера</h2>
    <div class="steps-indicator">
      <div :class="['step', { active: currentStep === 1 }]">Детали заказа</div>
      <div :class="['step', { active: currentStep === 2 }]">Контактные данные</div>
      <div :class="['step', { active: currentStep === 3 }]">Оформление </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Шаг 1 -->
      <div v-if="currentStep === 1" class="step-section">
        <div class="form-row">
          <div class="form-group">
            <label for="city">Город *</label>
            <select id="city" v-model="city">
              <option value="Москва">Москва</option>
              <option value="МО">Московская область</option>
              <option value="СПб">Санкт-Петербург</option>
              <option value="Казань">Казань</option>
              <option value="Батуми">Батуми</option>
             </select>
          </div>
          <div class="form-group">
            <label for="address">Адрес *</label>
            <input type="text" id="address" v-model="address" placeholder="Введите адрес" autocomplete="on">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="measurement-type">Тип замера *</label>
            <select id="measurement-type" v-model="selectedType">
              <option disabled value="">Выберите тип</option>
              <option v-for="type in types" :key="type.id" :value="type.id">{{ type.label }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="date">Дата замера *</label>
            <input type="date" id="date" v-model="date">
          </div>
        </div>

        <div v-if="selectedType === 'Квартира' || selectedType === 'Дом'" class="options-group">
          <span>Выберите помещения:</span>
          <div class="options-horizontal">
            <div v-for="option in options[selectedType]" :key="option.id" class="option-item">
              <label :for="option.id">{{ option.name }}</label>
              <input type="number" :id="option.id" v-model.number="selectedOptions[option.id]" min="0">
            </div>
          </div>
        </div>

        <div v-else-if="selectedType === 'Офис'" class="options-group">
          <span>Выберите помещения:</span>
          <div class="options-horizontal">
            <div v-for="option in options[selectedType]" :key="option.id" class="option-item">
              <label :for="option.id">{{ option.name }}</label>
              <input type="number" :id="option.id" v-model.number="selectedOptions[option.id]" min="0">
            </div>
          </div>
        </div>

        <div v-else-if="selectedType === 'Обмер'" class="form-group">
          <label for="area">Площадь, м²</label>
          <input type="number" id="area" v-model.number="area" placeholder="Введите площадь" min="0">
        </div>

        <!-- Блок срочного выезда вынесен отдельно -->
        <div class="urgent-section">
          <div class="checkbox-group">
            <input type="checkbox" id="urgent" v-model="urgent">
            <label for="urgent">Срочный выезд</label>
          </div>
          <div v-if="urgent" class="time-intervals">
            <span>Интервал времени:</span>
            <div class="options-horizontal">
              <div v-for="interval in timeIntervals" :key="interval.id" class="option-item">
                <input type="radio" :id="interval.id" name="time-interval" :value="interval.id" v-model="selectedTimeInterval">
                <label :for="interval.id">{{ interval.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 2 -->
      <div v-if="currentStep === 2" class="step-section">
        <div class="form-row">
          <div class="form-group">
            <label for="client-name">Имя клиента</label>
            <input type="text" id="client-name" v-model="clientName" placeholder="Введите имя">
          </div>
          <div class="form-group">
            <label for="client-phone">Телефон клиента *</label>
            <input type="tel" id="client-phone" v-model="clientPhone" placeholder="+7 (___) ___-__-__">
          </div>
        </div>
        <div class="form-group">
          <label for="client-address">Адрес клиента</label>
          <input type="text" id="client-address" :value="address" readonly>
        </div>
        <div class="form-group">
          <label for="distance">Удаленность от МКАД/КАД, км</label>
          <input type="number" id="distance" v-model.number="distance" min="0">
        </div>
      </div>

      <!-- Шаг 3 -->
      <div v-if="currentStep === 3" class="step-section">
  <div class="form-group">
    <label for="manager-email">Email менеджера</label>
    <input type="email" id="manager-email" v-model="managerEmail" placeholder="email@example.com">
  </div>
  <div class="form-group">
    <label for="manager-comment">Комментарий</label>
    <div class="comment-group">
      <textarea id="manager-comment" v-model="comment" placeholder="Введите комментарий"></textarea>
      <label for="file-upload" class="file-upload-label">Прикрепить файл</label>
      <input type="file" id="file-upload" class="file-upload-input" @change="handleFileChange">
    </div>
  </div>
  <div class="form-group total-display">
    <label>Сумма</label>
    <input type="number" :value="totalCost" readonly>
  </div>
</div>

      <!-- Навигация по форме -->
      <div class="form-navigation">
        <button type="button" @click="prevStep" :disabled="currentStep === 1" class="nav-button">Назад</button>
        <button type="button" v-if="currentStep < totalSteps" @click="nextStep" class="nav-button">Далее</button>
        <button type="submit" v-if="currentStep === totalSteps" class="submit-button">Оформить заявку</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      totalSteps: 3,
      // Шаг 1: Детали заказа
      city: 'Москва',
      address: '',
      selectedType: null,
      measurementDetails: '',
      area: null,
      urgent: false,
      selectedTimeInterval: null,
      selectedOptions: {},
      optionsFlatHouse: [
        { id: 'Кухня', name: 'Кухня', price: 500, required: false },
        { id: 'Комната', name: 'Комната', price: 500, required: false },
        { id: 'Санузел', name: 'Санузел', price: 500, required: false },
        { id: 'Коридор', name: 'Коридор', price: 500, required: false },
        { id: 'Балкон', name: 'Балкон', price: 500, required: false }
      ],
      optionsOffice: [
        { id: 'Кабинет', name: 'Кабинет', price: 500, required: false },
        { id: 'Переговорная', name: 'Переговорная', price: 500, required: false },
        { id: 'Санузел', name: 'Санузел', price: 500, required: false },
        { id: 'Коридор', name: 'Коридор', price: 500, required: false },
        { id: 'Холл', name: 'Холл', price: 500, required: false }
      ],
      // Шаг 2: Контактные данные
      clientName: '',
      clientPhone: '',
      distance: null,
      // Шаг 3: Информация для менеджера
      managerEmail: '',
      comment: '',
      timeIntervals: [
        { id: 'exact', label: 'Точно ко времени', price: 1200 },
        { id: '1h', label: 'Интервал 1 час', price: 800 },
        { id: '4h', label: 'Интервал 4 часа', price: 500 },
        { id: 'day', label: 'В течении дня', price: 0 }
      ],
      types: [
        { id: 'Квартира', label: 'Квартира' },
        { id: 'Дом', label: 'Дом' },
        { id: 'Офис', label: 'Офис' },
        { id: 'Обмер', label: 'Обмер' }
      ],
      date: ''
    };
  },
  computed: {
    totalCost() {
      let cost = 0;
      if (this.selectedType === 'Обмер') {
        cost = this.area ? Math.max(1500 + this.area * 50) : 1500;
      } else {
        cost = 1500;
        if (['Квартира', 'Дом', 'Офис'].includes(this.selectedType)) {
          for (const optionId in this.selectedOptions) {
            cost += this.selectedOptions[optionId] * 500;
          }
        }
      }
      if (this.urgent) {
        cost += 500;
        if (this.selectedTimeInterval) {
          const interval = this.timeIntervals.find(i => i.id === this.selectedTimeInterval);
          if (interval) cost += interval.price;
        }
      }
      if (this.distance && this.distance > 0) {
        cost += this.distance * 50;
      }
      return cost;
    },
    options() {
      return {
        'Квартира': this.optionsFlatHouse,
        'Дом': this.optionsFlatHouse,
        'Офис': this.optionsOffice
      };
    },
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    handleSubmit() {
      console.log('Данные формы:', this.$data);
      alert('Заявка отправлена');
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        console.log('Выбран файл:', file.name);
      }
    }
  }
};
</script>

<style scoped>
.order-form {
  max-width: 600px;
  margin: 20px auto;
  background-color: #f4f4f4;
  padding: 20px;
  font-family: Arial, sans-serif;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.steps-indicator {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.step {
  padding: 8px 12px;
  border-bottom: 2px solid #ccc;
  font-weight: bold;
  font-size: 14px;
  color: #666;
}

.step.active {
  border-bottom-color: #1E3A5F;
  color: #1E3A5F;
}

.step-section {
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Общие стили для форм */
.form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.form-group label {
  margin-bottom: 5px;
  font-size: 14px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
input[type="number"],
select,
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

textarea {
  min-height: 80px;
}

.options-group {
  margin-top: 10px;
}

.options-group span {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.options-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.option-item input[type="number"] {
  width: 55px;
  margin-left: 5px;
}

/* Стили для блока срочного выезда */
.urgent-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.urgent-section .checkbox-group {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.time-intervals span {
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.time-intervals .options-horizontal {
  margin-top: 5px;
}

/* Стили навигационных кнопок */
.form-navigation {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.nav-button,
.submit-button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #1E3A5F;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-button:hover:not(:disabled),
.submit-button:hover:not(:disabled) {
  background-color: #142847;
}

.nav-button:disabled {
  background-color: #ccc;
  cursor: default;
}

.total-display {
  text-align: center;
}

/* Стили для загрузки файла */
.comment-group {
  position: relative;
}

.file-upload-label {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.file-upload-input {
  display: none;
}
</style>
