import React, { useReducer } from 'react';
import { createInitialState } from '../store/initialState.js';
import { historyReducer, createHistory, canUndo, canRedo } from '../store/history.js';
import { setTool, undo, redo, updateViewport, cancelDraftWall } from '../store/actions.js';
import { selectDraftWallPreview, selectSelectedWall } from '../store/selectors.js';
import { TOOLS } from '../constants/index.js';
import Canvas from '../canvas/Canvas.jsx';
import EditBar from '../ui/EditBar.jsx';

const DEFAULT_VIEWPORT = { pan: { x: 120, y: 120 }, zoom: 0.2 };

function init() {
  const s = createInitialState();
  return createHistory({
    ...s,
    ui: { ...s.ui, pan: DEFAULT_VIEWPORT.pan, zoom: DEFAULT_VIEWPORT.zoom },
  });
}

const buttonStyle = (active) => ({
  padding: '6px 12px',
  fontSize: 13,
  border: '1px solid #ccc',
  background: active ? '#222' : '#fff',
  color: active ? '#fff' : '#222',
  borderRadius: 6,
  cursor: 'pointer',
});

export default function App() {
  const [history, dispatch] = useReducer(historyReducer, undefined, init);
  const s = history.present;
  const viewport = { pan: s.ui.pan, zoom: s.ui.zoom };
  const draftPreview = selectDraftWallPreview(s);
  const selectedWall = selectSelectedWall(s);

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
        gap: 12,
        alignItems: 'center',
        flexShrink: 0,
        fontSize: 13,
      }}>
        <h1 style={{ margin: 0, fontSize: 16 }}>metrage.pro</h1>

        <div role="toolbar" aria-label="Инструменты" style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            style={buttonStyle(s.ui.tool === TOOLS.SELECT)}
            onClick={() => dispatch(setTool(TOOLS.SELECT))}
          >
            Выбор
          </button>
          <button
            type="button"
            style={buttonStyle(s.ui.tool === TOOLS.DRAW_WALL)}
            onClick={() => dispatch(setTool(TOOLS.DRAW_WALL))}
          >
            Стена
          </button>
        </div>

        <div role="toolbar" aria-label="История" style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            style={buttonStyle(false)}
            disabled={!canUndo(history)}
            onClick={() => dispatch(undo())}
          >
            ⟲ Undo
          </button>
          <button
            type="button"
            style={buttonStyle(false)}
            disabled={!canRedo(history)}
            onClick={() => dispatch(redo())}
          >
            ⟳ Redo
          </button>
        </div>

        <span style={{ color: '#888', marginLeft: 'auto' }}>
          walls: {s.walls.length} · zoom: {viewport.zoom.toFixed(3)} ·
          pan: {Math.round(viewport.pan.x)},{Math.round(viewport.pan.y)}
          {draftPreview && ' · drafting'}
        </span>

        {draftPreview && (
          <button
            type="button"
            style={buttonStyle(false)}
            onClick={() => dispatch(cancelDraftWall())}
          >
            Отменить
          </button>
        )}

        <button
          type="button"
          style={buttonStyle(false)}
          onClick={() => dispatch(updateViewport({
            pan: DEFAULT_VIEWPORT.pan, zoom: DEFAULT_VIEWPORT.zoom,
          }))}
        >
          Reset view
        </button>
      </header>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <Canvas
          walls={s.walls}
          viewport={viewport}
          tool={s.ui.tool}
          draftPreview={draftPreview}
          primarySelectionId={s.ui.primarySelectionId}
          dispatch={dispatch}
        />
        <EditBar wall={selectedWall} dispatch={dispatch} />
      </div>
    </div>
  );
}
