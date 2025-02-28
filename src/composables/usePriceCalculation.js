import { computed } from 'vue';

const ROOM_PRICE = 500;
const BASE_PRICE = 1500;
const URGENT_FEE = 500;
const DISTANCE_RATE = 50;

export const usePriceCalculation = (form) => {
  const totalCost = computed(() => {
    let cost = BASE_PRICE;
    
    if (form.selectedType === 'Обмер') {
      cost += (form.area || 0) * DISTANCE_RATE;
    } else {
      cost += Object.values(form.selectedOptions)
        .reduce((sum, count) => sum + count * ROOM_PRICE, 0);
    }
    
    if (form.urgent) {
      const intervalPrice = timeIntervals.find(i => i.id === form.selectedTimeInterval)?.price || 0;
      cost += URGENT_FEE + intervalPrice;
    }

    if (form.distance) {
      cost += form.distance * DISTANCE_RATE;
    }
    
    return cost;
  });

  const timeIntervals = [
    { id: 'exact', label: 'Точно ко времени', price: 1200 },
    { id: '1h', label: 'Интервал 1 час', price: 1000 },
    { id: '4h', label: 'Интервал 4 часа', price: 500 },
    { id: 'half_day', label: 'К половине дня', price: 0 }
  ];

  return { totalCost, timeIntervals };
};