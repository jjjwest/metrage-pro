import { describe, it, expect } from 'vitest';
import {
  distance,
  angle,
  normalize,
  projectPointOnSegment,
  pointAtDistance,
  segmentLength,
} from '../core/geometry.js';

describe('geometry.distance', () => {
  it('computes Euclidean distance', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
  it('returns 0 for identical points', () => {
    expect(distance({ x: 7, y: 7 }, { x: 7, y: 7 })).toBe(0);
  });
});

describe('geometry.angle', () => {
  it('returns 0 for points along +X', () => {
    expect(angle({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(0);
  });
  it('returns π/2 for +Y', () => {
    expect(angle({ x: 0, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(Math.PI / 2);
  });
  it('returns π for −X', () => {
    expect(angle({ x: 0, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(Math.PI);
  });
});

describe('geometry.normalize', () => {
  it('produces a unit vector', () => {
    const n = normalize({ x: 3, y: 4 });
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
  });
  it('returns zero vector for zero input', () => {
    expect(normalize({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
  });
});

describe('geometry.projectPointOnSegment', () => {
  it('projects to closest point inside segment', () => {
    const r = projectPointOnSegment({ x: 5, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(r.point).toEqual({ x: 5, y: 0 });
    expect(r.t).toBeCloseTo(0.5);
    expect(r.distance).toBeCloseTo(5);
  });
  it('clamps to endpoint a when t < 0', () => {
    const r = projectPointOnSegment({ x: -5, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(r.point).toEqual({ x: 0, y: 0 });
    expect(r.t).toBe(0);
  });
  it('clamps to endpoint b when t > 1', () => {
    const r = projectPointOnSegment({ x: 15, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    expect(r.point).toEqual({ x: 10, y: 0 });
    expect(r.t).toBe(1);
  });
  it('handles zero-length segment', () => {
    const r = projectPointOnSegment({ x: 3, y: 4 }, { x: 0, y: 0 }, { x: 0, y: 0 });
    expect(r.point).toEqual({ x: 0, y: 0 });
    expect(r.distance).toBe(5);
  });
});

describe('geometry.pointAtDistance', () => {
  it('returns point at distance along ray', () => {
    expect(pointAtDistance({ x: 0, y: 0 }, { x: 1, y: 0 }, 7)).toEqual({ x: 7, y: 0 });
  });
  it('respects diagonal direction', () => {
    const p = pointAtDistance({ x: 0, y: 0 }, { x: 1, y: 1 }, Math.SQRT2);
    expect(p.x).toBeCloseTo(1);
    expect(p.y).toBeCloseTo(1);
  });
});

describe('geometry.segmentLength', () => {
  it('returns Euclidean length of segment', () => {
    expect(segmentLength({ x1: 0, y1: 0, x2: 3, y2: 4 })).toBe(5);
  });
});
