import { angle, distance } from './geometry.js';
import { SNAP_ANGLE_INCREMENT_RAD } from '../constants/index.js';

// Applied only during interactive editing. Once the user commits, the resulting
// world coordinates are stored as plain facts in state.

export function snapAngle(angleRad, increment = SNAP_ANGLE_INCREMENT_RAD) {
  return Math.round(angleRad / increment) * increment;
}

export function snapPoint(point, candidates, tolerance) {
  let best = null;
  let bestDist = tolerance;
  for (const c of candidates) {
    const d = distance(point, c);
    if (d <= bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best ?? point;
}

// Rotate `free` around `fixed` so the segment angle snaps to `increment`.
// Distance from `fixed` is preserved.
export function snapSegmentEndAngle(fixed, free, increment = SNAP_ANGLE_INCREMENT_RAD) {
  const a = angle(fixed, free);
  const snapped = snapAngle(a, increment);
  const d = distance(fixed, free);
  return {
    x: fixed.x + Math.cos(snapped) * d,
    y: fixed.y + Math.sin(snapped) * d,
  };
}
