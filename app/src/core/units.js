// World units are millimetres. These helpers convert at display/input boundaries only.

export const MM_PER_M = 1000;
export const MM_PER_CM = 10;

export function mmToM(mm) { return mm / MM_PER_M; }
export function mToMm(m) { return m * MM_PER_M; }
export function cmToMm(cm) { return cm * MM_PER_CM; }
export function mmToCm(mm) { return mm / MM_PER_CM; }

export function formatMm(mm) {
  return Math.round(mm).toString();
}
