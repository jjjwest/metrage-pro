import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue = null) {
  // Получаем начальное значение из localStorage
  const storedValue = localStorage.getItem(key);
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue);

  // Отслеживаем изменения и сохраняем в localStorage
  watch(
    value,
    (newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    { deep: true }
  );

  return value;
}