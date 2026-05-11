import { describe, it, expect } from 'vitest';
import { createInitialState } from '../store/initialState.js';
import { reducer } from '../store/reducer.js';
import {
  addWall, addSymbol, addOpening, addDimension, updateViewport,
  startDraftWall, updateDraftWall,
} from '../store/actions.js';
import {
  selectWallLength, selectWallAngle,
  selectSymbolWorldPosition, selectSymbolsWithWorldPositions,
  selectOpeningWorldSegment,
  selectDimensionDisplayValue,
  selectWallScreenSegment,
  selectWallNodes,
  selectDraftWallPreview,
} from '../store/selectors.js';

const buildState = (...actions) => actions.reduce((s, a) => reducer(s, a), createInitialState());

describe('selectors.selectWallLength', () => {
  it('computes length from world coordinates', () => {
    const s = buildState(addWall({ id: 'w1', x1: 0, y1: 0, x2: 3076, y2: 0 }));
    expect(selectWallLength(s, 'w1')).toBe(3076);
  });
  it('returns 0 for unknown wall', () => {
    expect(selectWallLength(createInitialState(), 'missing')).toBe(0);
  });
});

describe('selectors.selectWallAngle', () => {
  it('returns 0 for east-pointing wall', () => {
    const s = buildState(addWall({ id: 'w1', x1: 0, y1: 0, x2: 100, y2: 0 }));
    expect(selectWallAngle(s, 'w1')).toBe(0);
  });
});

describe('selectors.selectSymbolWorldPosition', () => {
  it('derives world position from baseWallId + offset', () => {
    const s = buildState(
      addWall({ id: 'w1', x1: 0, y1: 0, x2: 1000, y2: 0 }),
      addSymbol({ id: 's1', type: 'outlet', baseWallId: 'w1', offset: 250, elevation: 300 }),
    );
    const pos = selectSymbolWorldPosition(s, 's1');
    expect(pos.x).toBeCloseTo(250);
    expect(pos.y).toBeCloseTo(0);
  });
  it('returns null when wall is missing', () => {
    const s = buildState(addSymbol({ id: 's1', type: 'outlet', baseWallId: 'wX', offset: 0, elevation: 0 }));
    expect(selectSymbolWorldPosition(s, 's1')).toBeNull();
  });
  it('updates automatically when its wall moves', () => {
    let s = buildState(
      addWall({ id: 'w1', x1: 0, y1: 0, x2: 1000, y2: 0 }),
      addSymbol({ id: 's1', type: 'outlet', baseWallId: 'w1', offset: 250, elevation: 300 }),
    );
    s = reducer(s, { type: 'UPDATE_WALL', id: 'w1', patch: { x1: 0, y1: 0, x2: 0, y2: 1000 } });
    const pos = selectSymbolWorldPosition(s, 's1');
    expect(pos.x).toBeCloseTo(0);
    expect(pos.y).toBeCloseTo(250);
  });
});

describe('selectors.selectSymbolsWithWorldPositions', () => {
  it('skips symbols whose wall is missing', () => {
    const s = buildState(
      addWall({ id: 'w1', x1: 0, y1: 0, x2: 1000, y2: 0 }),
      addSymbol({ id: 's1', type: 'outlet', baseWallId: 'w1', offset: 100, elevation: 0 }),
      addSymbol({ id: 's2', type: 'outlet', baseWallId: 'wX', offset: 100, elevation: 0 }),
    );
    const result = selectSymbolsWithWorldPositions(s);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });
});

describe('selectors.selectOpeningWorldSegment', () => {
  it('derives start/end from wall + offset + width', () => {
    const s = buildState(
      addWall({ id: 'w1', x1: 0, y1: 0, x2: 3000, y2: 0 }),
      addOpening({ id: 'o1', type: 'window', wallId: 'w1', offset: 500, width: 800, sillHeight: 900, height: 1400 }),
    );
    const seg = selectOpeningWorldSegment(s, 'o1');
    expect(seg.start.x).toBeCloseTo(500);
    expect(seg.end.x).toBeCloseTo(1300);
  });
});

describe('selectors.selectDimensionDisplayValue', () => {
  it('prefers custom value over computed', () => {
    const s = buildState(
      addWall({ id: 'w1', x1: 0, y1: 0, x2: 3076, y2: 0 }),
      addDimension({
        id: 'd1', type: 'custom', startNodeId: 'w1:a', endNodeId: 'w1:b',
        value: 3100, offsetDistance: 50, textOffset: { x: 0, y: 0 },
      }),
    );
    expect(selectDimensionDisplayValue(s, 'd1')).toBe(3100);
  });
  it('falls back to computed value when custom is null', () => {
    const s = buildState(
      addWall({ id: 'w1', x1: 0, y1: 0, x2: 3076, y2: 0 }),
      addDimension({
        id: 'd1', type: 'overall', startNodeId: 'w1:a', endNodeId: 'w1:b',
        value: null, offsetDistance: 50, textOffset: { x: 0, y: 0 },
      }),
    );
    expect(selectDimensionDisplayValue(s, 'd1')).toBe(3076);
  });
});

describe('selectors.selectWallNodes', () => {
  it('flattens both endpoints of every wall', () => {
    const s = buildState(
      addWall({ id: 'w1', x1: 0, y1: 0, x2: 3076, y2: 0 }),
      addWall({ id: 'w2', x1: 3076, y1: 0, x2: 3076, y2: 2400 }),
    );
    const nodes = selectWallNodes(s);
    expect(nodes).toHaveLength(4);
    expect(nodes).toContainEqual({ x: 0, y: 0, wallId: 'w1', end: 'a' });
    expect(nodes).toContainEqual({ x: 3076, y: 2400, wallId: 'w2', end: 'b' });
  });
});

describe('selectors.selectDraftWallPreview', () => {
  it('returns null when no draft is active', () => {
    expect(selectDraftWallPreview(createInitialState())).toBeNull();
  });
  it('returns start, snapped end, and no guides for an isolated draft', () => {
    let s = buildState(startDraftWall({ x: 0, y: 0 }));
    s = reducer(s, updateDraftWall({ x: 1000, y: 2 })); // ~0.1° → snaps to 0°
    const p = selectDraftWallPreview(s);
    expect(p.start).toEqual({ x: 0, y: 0 });
    expect(p.end.y).toBeCloseTo(0);
    expect(p.guides).toEqual([]);
  });
  it('emits alignment guides when preview endpoint matches an existing node', () => {
    let s = buildState(
      addWall({ id: 'w1', x1: 1000, y1: 0, x2: 1000, y2: 2400 }),
      startDraftWall({ x: 0, y: 1000 }),
    );
    s = reducer(s, updateDraftWall({ x: 1004, y: 1003 })); // close to node (1000, 0) on X
    const p = selectDraftWallPreview(s);
    expect(p.end.x).toBe(1000);
    expect(p.guides.some((g) => g.axis === 'x' && g.value === 1000)).toBe(true);
  });
});

describe('selectors.selectWallScreenSegment', () => {
  it('projects wall endpoints into screen space', () => {
    let s = buildState(addWall({ id: 'w1', x1: 0, y1: 0, x2: 1000, y2: 0 }));
    s = reducer(s, updateViewport({ zoom: 2, pan: { x: 100, y: 200 } }));
    const seg = selectWallScreenSegment(s, 'w1');
    expect(seg.a).toEqual({ x: 100, y: 200 });
    expect(seg.b).toEqual({ x: 2100, y: 200 });
  });
});
