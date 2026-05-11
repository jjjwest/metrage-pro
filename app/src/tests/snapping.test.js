import { describe, it, expect } from 'vitest';
import { snapAngle, snapPoint, snapSegmentEndAngle } from '../core/snapping.js';

const FORTY_FIVE = Math.PI / 4;

describe('snapping.snapAngle', () => {
  it('snaps near-zero to 0', () => {
    expect(snapAngle(0.1)).toBe(0);
  });
  it('snaps to 45° increment', () => {
    expect(snapAngle(0.7, FORTY_FIVE)).toBeCloseTo(FORTY_FIVE);
  });
  it('snaps to 90°', () => {
    expect(snapAngle(Math.PI / 2 - 0.05, FORTY_FIVE)).toBeCloseTo(Math.PI / 2);
  });
});

describe('snapping.snapPoint', () => {
  const candidates = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
  it('snaps to nearest candidate inside tolerance', () => {
    expect(snapPoint({ x: 5, y: 5 }, candidates, 50)).toEqual({ x: 0, y: 0 });
  });
  it('returns original when no candidate within tolerance', () => {
    expect(snapPoint({ x: 1000, y: 1000 }, candidates, 50)).toEqual({ x: 1000, y: 1000 });
  });
  it('returns original when candidates empty', () => {
    expect(snapPoint({ x: 5, y: 5 }, [], 50)).toEqual({ x: 5, y: 5 });
  });
});

describe('snapping.snapSegmentEndAngle', () => {
  it('snaps end to 90° while preserving distance', () => {
    const fixed = { x: 0, y: 0 };
    const free = { x: 0.1, y: 100 };
    const snapped = snapSegmentEndAngle(fixed, free);
    expect(snapped.x).toBeCloseTo(0);
    expect(snapped.y).toBeCloseTo(Math.hypot(0.1, 100));
  });
  it('snaps end to 0° while preserving distance', () => {
    const snapped = snapSegmentEndAngle({ x: 0, y: 0 }, { x: 100, y: 1 });
    expect(snapped.y).toBeCloseTo(0);
    expect(snapped.x).toBeCloseTo(Math.hypot(100, 1));
  });
});
