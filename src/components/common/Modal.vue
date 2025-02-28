<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-wrapper">
          <!-- Заголовок -->
          <div class="modal-header">
            <h3 class="modal-title">
              <slot name="title">{{ title }}</slot>
            </h3>
            <button 
              type="button" 
              class="modal-close" 
              @click="close"
              aria-label="Закрыть"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <!-- Содержимое -->
          <div class="modal-body">
            <slot></slot>
          </div>

          <!-- Футер -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer">
              <button 
                type="button" 
                class="btn-secondary" 
                @click="close"
              >
                Закрыть
              </button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-wrapper {
  background-color: white;
  border-radius: 8px;
  max-width: 90%;
  width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
}

.modal-close:hover {
  color: #111827;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

/* Анимации */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>