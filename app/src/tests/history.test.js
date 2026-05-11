import { describe, it, expect } from 'vitest';
import { createHistory, historyReducer, canUndo, canRedo } from '../store/history.js';
import { createInitialState } from '../store/initialState.js';
import {
  addWall, updateWall, updateWallLength, setTool, undo, redo,
  selectEntity, updateViewport,
  startDraftWall, updateDraftWall, commitDraftWall, cancelDraftWall,
} from '../store/actions.js';
import { TOOLS } from '../constants/index.js';

const start = () => createHistory(createInitialState());

describe('history', () => {
  it('records data-changing actions in past', () => {
    let h = start();
    h = historyReducer(h, addWall({ id: 'w1', x1: 0, y1: 0, x2: 100, y2: 0 }));
    expect(h.past).toHaveLength(1);
    expect(canUndo(h)).toBe(true);
  });

  it('skips UI-only actions', () => {
    let h = start();
    h = historyReducer(h, setTool(TOOLS.DRAW_WALL));
    h = historyReducer(h, selectEntity('whatever'));
    h = historyReducer(h, updateViewport({ zoom: 2 }));
    expect(h.past).toHaveLength(0);
    expect(h.present.ui.tool).toBe(TOOLS.DRAW_WALL);
    expect(h.present.ui.zoom).toBe(2);
  });

  it('undo restores prior present', () => {
    let h = start();
    h = historyReducer(h, addWall({ id: 'w1', x1: 0, y1: 0, x2: 100, y2: 0 }));
    h = historyReducer(h, updateWall('w1', { x2: 500 }));
    h = historyReducer(h, undo());
    expect(h.present.walls[0].x2).toBe(100);
    expect(canRedo(h)).toBe(true);
  });

  it('redo reapplies an undone action', () => {
    let h = start();
    h = historyReducer(h, addWall({ id: 'w1', x1: 0, y1: 0, x2: 100, y2: 0 }));
    h = historyReducer(h, undo());
    h = historyReducer(h, redo());
    expect(h.present.walls).toHaveLength(1);
  });

  it('clears future when a new action is dispatched after undo', () => {
    let h = start();
    h = historyReducer(h, addWall({ id: 'w1', x1: 0, y1: 0, x2: 100, y2: 0 }));
    h = historyReducer(h, updateWall('w1', { x2: 500 }));
    h = historyReducer(h, undo());
    expect(h.future).toHaveLength(1);
    h = historyReducer(h, addWall({ id: 'w2', x1: 0, y1: 0, x2: 100, y2: 100 }));
    expect(h.future).toHaveLength(0);
  });

  it('no-op undo when past empty', () => {
    const h0 = start();
    const h1 = historyReducer(h0, undo());
    expect(h1).toBe(h0);
  });

  it('no-op redo when future empty', () => {
    const h0 = start();
    const h1 = historyReducer(h0, redo());
    expect(h1).toBe(h0);
  });

  it('draft start/update/cancel are not recorded in history', () => {
    let h = start();
    h = historyReducer(h, setTool(TOOLS.DRAW_WALL));
    h = historyReducer(h, startDraftWall({ x: 100, y: 100 }));
    h = historyReducer(h, updateDraftWall({ x: 200, y: 100 }));
    h = historyReducer(h, cancelDraftWall());
    expect(h.past).toHaveLength(0);
  });

  it('UPDATE_WALL_LENGTH is recorded and undoable', () => {
    let h = start();
    h = historyReducer(h, addWall({ id: 'w1', x1: 0, y1: 0, x2: 3000, y2: 0 }));
    h = historyReducer(h, updateWallLength('w1', 3150));
    expect(h.present.walls[0].x2).toBeCloseTo(3150);
    h = historyReducer(h, undo());
    expect(h.present.walls[0].x2).toBe(3000);
    h = historyReducer(h, redo());
    expect(h.present.walls[0].x2).toBeCloseTo(3150);
  });

  it('COMMIT_DRAFT_WALL is recorded as an undoable structural change', () => {
    let h = start();
    h = historyReducer(h, setTool(TOOLS.DRAW_WALL));
    h = historyReducer(h, startDraftWall({ x: 0, y: 0 }));
    h = historyReducer(h, updateDraftWall({ x: 1000, y: 0 }));
    h = historyReducer(h, commitDraftWall());
    expect(h.past).toHaveLength(1);
    expect(h.present.walls).toHaveLength(1);
    h = historyReducer(h, undo());
    expect(h.present.walls).toHaveLength(0);
  });
});
