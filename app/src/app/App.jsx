import React, { useReducer } from 'react';
import { createInitialState } from '../store/initialState.js';
import { historyReducer, createHistory, canUndo, canRedo } from '../store/history.js';
import { addWall, updateViewport } from '../store/actions.js';
import Canvas from '../canvas/Canvas.jsx';

// Seed a single wall so the canvas has something to render until the
// wall-draw tool exists. Removed in Step 2.
const SEED_WALLS = [
  { id: 'seed-1', x1: 0, y1: 0, x2: 3076, y2: 0, thickness: 100, kind: 'wall' },
  { id: 'seed-2', x1: 3076, y1: 0, x2: 3076, y2: 2400, thickness: 100, kind: 'wall' },
];

function seededInit() {
  const s = createInitialState();
  const withWalls = SEED_WALLS.reduce(
    (acc, w) => ({ ...acc, walls: [...acc.walls, w] }),
    s,
  );
  // Pan so the (0,0) corner sits ~80px from top-left and shrink zoom to fit.
  return { ...withWalls, ui: { ...withWalls.ui, pan: { x: 80, y: 80 }, zoom: 0.15 } };
}

export default function App() {
  const [history, dispatch] = useReducer(
    historyReducer,
    undefined,
    () => createHistory(seededInit()),
  );
  const s = history.present;
  const viewport = { pan: s.ui.pan, zoom: s.ui.zoom };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#222',
    }}>
      <header style={{
        padding: '8px 16px',
        borderBottom: '1px solid #e5e5e5',
        background: '#fff',
        display: 'flex',
        gap: 16,
        alignItems: 'baseline',
        flexShrink: 0,
        fontSize: 13,
      }}>
        <h1 style={{ margin: 0, fontSize: 16 }}>metrage.pro</h1>
        <span style={{ color: '#888' }}>
          walls: {s.walls.length} · zoom: {viewport.zoom.toFixed(3)} ·
          pan: {Math.round(viewport.pan.x)},{Math.round(viewport.pan.y)} ·
          undo: {canUndo(history) ? 'y' : 'n'} / redo: {canRedo(history) ? 'y' : 'n'}
        </span>
        <button
          type="button"
          onClick={() => dispatch(updateViewport({ pan: { x: 80, y: 80 }, zoom: 0.15 }))}
          style={{ marginLeft: 'auto', fontSize: 12 }}
        >
          Reset view
        </button>
        <button
          type="button"
          onClick={() => dispatch(addWall({
            x1: 0, y1: 2400, x2: 3076, y2: 2400,
          }))}
          style={{ fontSize: 12 }}
        >
          + demo wall
        </button>
      </header>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <Canvas walls={s.walls} viewport={viewport} dispatch={dispatch} />
      </div>
    </div>
  );
}
