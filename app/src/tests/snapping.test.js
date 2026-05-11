import { describe, it, expect } from 'vitest';
import {
  snapAngle,
  snapPoint,
  snapSegmentEndAngle,
  snapAngleWithinTolerance,
  snapSegmentEndAngleTolerant,
  computeAlignment,
  computeDraftWallEndpoint,
} from '../core/snapping.js';

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

describe('snapping.snapAngleWithinTolerance', () => {
  it('snaps when within ±5°', () => {
    const fourDeg = (4 * Math.PI) / 180;
    expect(snapAngleWithinTolerance(fourDeg)).toBe(0);
  });
  it('does NOT snap when outside ±5°', () => {
    const tenDeg = (10 * Math.PI) / 180;
    expect(snapAngleWithinTolerance(tenDeg)).toBe(tenDeg);
  });
  it('snaps near 90° within tolerance', () => {
    const nearNinety = Math.PI / 2 - (3 * Math.PI) / 180;
    expect(snapAngleWithinTolerance(nearNinety)).toBeCloseTo(Math.PI / 2);
  });
  it('handles wraparound near ±π', () => {
    const nearPi = Math.PI - (2 * Math.PI) / 180;
    expect(snapAngleWithinTolerance(nearPi)).toBeCloseTo(Math.PI);
  });
});

describe('snapping.snapSegmentEndAngleTolerant', () => {
  it('snaps to axis when nearly horizontal', () => {
    const free = { x: 100, y: 3 }; // ~1.7°
    const snapped = snapSegmentEndAngleTolerant({ x: 0, y: 0 }, free);
    expect(snapped.y).toBeCloseTo(0);
    expect(snapped.x).toBeCloseTo(Math.hypot(100, 3));
  });
  it('passes through the free endpoint when angle is far from any 45° multiple', () => {
    const free = { x: 100, y: 30 }; // ~16.7° — outside ±5° from any multiple of 45°
    const snapped = snapSegmentEndAngleTolerant({ x: 0, y: 0 }, free);
    expect(snapped).toBe(free);
  });
});

describe('snapping.computeAlignment', () => {
  const nodes = [
    { x: 1000, y: 0 },
    { x: 0, y: 2000 },
    { x: 3076, y: 2400 },
  ];
  it('snaps X when within 10mm of a node X', () => {
    const r = computeAlignment({ x: 1003, y: 1500 }, nodes);
    expect(r.aligned.x).toBe(1000);
    expect(r.aligned.y).toBe(1500);
    expect(r.guides).toEqual([{ axis: 'x', value: 1000, refNode: nodes[0] }]);
  });
  it('snaps Y when within 10mm of a node Y', () => {
    const r = computeAlignment({ x: 500, y: 2008 }, nodes);
    expect(r.aligned.y).toBe(2000);
    expect(r.guides[0].axis).toBe('y');
    expect(r.guides[0].value).toBe(2000);
  });
  it('snaps both X and Y when both align', () => {
    const r = computeAlignment({ x: 1004, y: 2006 }, nodes);
    expect(r.aligned).toEqual({ x: 1000, y: 2000 });
    expect(r.guides.map((g) => g.axis).sort()).toEqual(['x', 'y']);
  });
  it('emits no guides and no snap when no node is within tolerance', () => {
    const r = computeAlignment({ x: 500, y: 1500 }, nodes);
    expect(r.aligned).toEqual({ x: 500, y: 1500 });
    expect(r.guides).toEqual([]);
  });
  it('picks the nearest node when several are within tolerance on the same axis', () => {
    const near = [{ x: 1009, y: 0 }, { x: 1001, y: 0 }];
    const r = computeAlignment({ x: 1004, y: 500 }, near);
    expect(r.guides[0].value).toBe(1001);
  });
});

describe('snapping.computeDraftWallEndpoint', () => {
  it('applies angle snap and then alignment', () => {
    // Start at origin, raw end nearly horizontal (~1°), node at x=300, y=0.
    const start = { x: 0, y: 0 };
    const raw = { x: 305, y: 5 };
    const { aligned, guides } = computeDraftWallEndpoint(start, raw, [{ x: 300, y: 0 }]);
    expect(aligned).toEqual({ x: 300, y: 0 });
    expect(guides).toHaveLength(2); // both X and Y align with node
  });
  it('returns raw endpoint when no snap and no alignment apply', () => {
    const start = { x: 0, y: 0 };
    const raw = { x: 137, y: 211 };
    const { aligned, guides } = computeDraftWallEndpoint(start, raw, []);
    expect(aligned).toEqual(raw);
    expect(guides).toEqual([]);
  });
});
