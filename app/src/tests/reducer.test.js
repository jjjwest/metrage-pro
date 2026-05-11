import { describe, it, expect } from 'vitest';
import { createInitialState } from '../store/initialState.js';
import { reducer } from '../store/reducer.js';
import {
  addWall, updateWall, deleteWall,
  addOpening, addSymbol, bindSymbolToWall,
  setTool, selectEntity, clearSelection, updateViewport,
  addTemplateEntities,
} from '../store/actions.js';
import { TOOLS } from '../constants/index.js';

const seedWall = (overrides = {}) => ({
  id: 'w1', x1: 0, y1: 0, x2: 3076, y2: 0, thickness: 100, kind: 'wall', ...overrides,
});

describe('reducer.ADD_WALL', () => {
  it('adds a wall with the provided id', () => {
    const s = reducer(createInitialState(), addWall(seedWall()));
    expect(s.walls).toHaveLength(1);
    expect(s.walls[0].id).toBe('w1');
  });
  it('assigns an id when omitted', () => {
    const s = reducer(createInitialState(), addWall({ x1: 0, y1: 0, x2: 1, y2: 0 }));
    expect(s.walls[0].id).toBeTruthy();
  });
  it('defaults thickness when omitted', () => {
    const s = reducer(createInitialState(), addWall({ x1: 0, y1: 0, x2: 1, y2: 0 }));
    expect(s.walls[0].thickness).toBe(100);
  });
});

describe('reducer.UPDATE_WALL', () => {
  it('updates only the matching wall and preserves siblings', () => {
    let s = reducer(createInitialState(), addWall(seedWall()));
    s = reducer(s, addWall(seedWall({ id: 'w2', x2: 1000 })));
    s = reducer(s, updateWall('w1', { x2: 5000 }));
    expect(s.walls[0].x2).toBe(5000);
    expect(s.walls[0].x1).toBe(0);
    expect(s.walls[1].x2).toBe(1000);
  });
});

describe('reducer.DELETE_WALL', () => {
  it('removes wall and cascades to bound openings/symbols', () => {
    let s = reducer(createInitialState(), addWall(seedWall()));
    s = reducer(s, addOpening({ id: 'o1', type: 'window', wallId: 'w1', offset: 100, width: 800, sillHeight: 900, height: 1400 }));
    s = reducer(s, addSymbol({ id: 'sym1', type: 'outlet', baseWallId: 'w1', offset: 200, elevation: 300 }));
    const after = reducer(s, deleteWall('w1'));
    expect(after.walls).toHaveLength(0);
    expect(after.openings).toHaveLength(0);
    expect(after.symbols).toHaveLength(0);
  });
});

describe('reducer.BIND_SYMBOL_TO_WALL', () => {
  it('updates baseWallId and offset', () => {
    let s = reducer(createInitialState(), addSymbol({
      id: 'sym1', type: 'outlet', baseWallId: 'w1', offset: 0, elevation: 300,
    }));
    s = reducer(s, bindSymbolToWall('sym1', 'w2', 555));
    expect(s.symbols[0].baseWallId).toBe('w2');
    expect(s.symbols[0].offset).toBe(555);
  });
});

describe('reducer.SET_TOOL', () => {
  it('switches the active tool', () => {
    const s = reducer(createInitialState(), setTool(TOOLS.DRAW_WALL));
    expect(s.ui.tool).toBe(TOOLS.DRAW_WALL);
  });
});

describe('reducer.SELECT_ENTITY', () => {
  it('replaces selection by default', () => {
    let s = reducer(createInitialState(), selectEntity('a'));
    s = reducer(s, selectEntity('b'));
    expect(s.ui.selectedIds).toEqual(['b']);
    expect(s.ui.primarySelectionId).toBe('b');
  });
  it('toggles in additive mode', () => {
    let s = reducer(createInitialState(), selectEntity('a', { additive: true }));
    s = reducer(s, selectEntity('b', { additive: true }));
    expect(s.ui.selectedIds).toEqual(['a', 'b']);
    s = reducer(s, selectEntity('a', { additive: true }));
    expect(s.ui.selectedIds).toEqual(['b']);
  });
  it('clears selection', () => {
    let s = reducer(createInitialState(), selectEntity('a'));
    s = reducer(s, clearSelection());
    expect(s.ui.selectedIds).toEqual([]);
    expect(s.ui.primarySelectionId).toBeNull();
  });
});

describe('reducer.UPDATE_VIEWPORT', () => {
  it('merges viewport patch', () => {
    const s = reducer(createInitialState(), updateViewport({ zoom: 2, pan: { x: 50, y: 50 } }));
    expect(s.ui.zoom).toBe(2);
    expect(s.ui.pan).toEqual({ x: 50, y: 50 });
  });
});

describe('reducer.ADD_TEMPLATE_ENTITIES', () => {
  it('appends multiple entity kinds in one action', () => {
    const s = reducer(createInitialState(), addTemplateEntities({
      walls: [seedWall(), seedWall({ id: 'w2', x1: 3076, y1: 0, x2: 3076, y2: 2400 })],
      texts: [{ id: 't1', x: 100, y: 100, text: 'Шаблон' }],
    }));
    expect(s.walls).toHaveLength(2);
    expect(s.texts).toHaveLength(1);
  });
  it('assigns ids to entities that omit them', () => {
    const s = reducer(createInitialState(), addTemplateEntities({
      walls: [{ x1: 0, y1: 0, x2: 1, y2: 0 }],
    }));
    expect(s.walls[0].id).toBeTruthy();
    expect(s.walls[0].thickness).toBe(100);
  });
});
