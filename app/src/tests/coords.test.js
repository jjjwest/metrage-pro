import { describe, it, expect } from 'vitest';
import { toScreen, toWorld, zoomAtPoint, clampZoom } from '../core/coords.js';

describe('coords.toScreen / toWorld', () => {
  const v = { pan: { x: 10, y: 20 }, zoom: 2 };
  it('toScreen multiplies by zoom and adds pan', () => {
    expect(toScreen({ x: 5, y: 5 }, v)).toEqual({ x: 20, y: 30 });
  });
  it('toWorld is the inverse of toScreen', () => {
    const world = { x: 123, y: -456 };
    const round = toWorld(toScreen(world, v), v);
    expect(round.x).toBeCloseTo(world.x);
    expect(round.y).toBeCloseTo(world.y);
  });
});

describe('coords.zoomAtPoint', () => {
  it('keeps the world point under the screen anchor stationary', () => {
    const before = { pan: { x: 0, y: 0 }, zoom: 1 };
    const anchor = { x: 100, y: 100 };
    const worldBefore = toWorld(anchor, before);
    const after = zoomAtPoint(before, anchor, 2);
    const worldAfter = toWorld(anchor, after);
    expect(worldAfter.x).toBeCloseTo(worldBefore.x);
    expect(worldAfter.y).toBeCloseTo(worldBefore.y);
    expect(after.zoom).toBe(2);
  });
  it('keeps the anchor stable even when starting pan is non-zero', () => {
    const before = { pan: { x: 80, y: 80 }, zoom: 0.15 };
    const anchor = { x: 250, y: 180 };
    const worldBefore = toWorld(anchor, before);
    const after = zoomAtPoint(before, anchor, 1.5);
    const worldAfter = toWorld(anchor, after);
    expect(worldAfter.x).toBeCloseTo(worldBefore.x);
    expect(worldAfter.y).toBeCloseTo(worldBefore.y);
    expect(after.zoom).toBeCloseTo(0.15 * 1.5);
  });
  it('is an identity when factor is exactly 1', () => {
    const before = { pan: { x: 42, y: -17 }, zoom: 0.5 };
    const after = zoomAtPoint(before, { x: 100, y: 100 }, 1);
    expect(after.zoom).toBeCloseTo(before.zoom);
    expect(after.pan.x).toBeCloseTo(before.pan.x);
    expect(after.pan.y).toBeCloseTo(before.pan.y);
  });
  it('respects max zoom clamp', () => {
    const v = { pan: { x: 0, y: 0 }, zoom: 1 };
    expect(zoomAtPoint(v, { x: 0, y: 0 }, 10000).zoom).toBe(50);
  });
  it('respects min zoom clamp', () => {
    const v = { pan: { x: 0, y: 0 }, zoom: 1 };
    expect(zoomAtPoint(v, { x: 0, y: 0 }, 0.0001).zoom).toBe(0.05);
  });
});

describe('coords.clampZoom', () => {
  it('clamps below min', () => { expect(clampZoom(0.001)).toBe(0.05); });
  it('clamps above max', () => { expect(clampZoom(99999)).toBe(50); });
  it('passes through valid zoom', () => { expect(clampZoom(2)).toBe(2); });
});
