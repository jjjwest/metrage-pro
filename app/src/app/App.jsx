import React, { useReducer } from 'react';
import { createInitialState } from '../store/initialState.js';
import { historyReducer, createHistory, canUndo, canRedo } from '../store/history.js';

export default function App() {
  const [history] = useReducer(
    historyReducer,
    createInitialState(),
    createHistory,
  );
  const s = history.present;
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: 24, color: '#222' }}>
      <h1 style={{ margin: 0 }}>metrage.pro</h1>
      <p style={{ marginTop: 8, color: '#666' }}>
        MVP foundation. Canvas, UI controls, exporters, persistence — not yet implemented.
      </p>
      <pre style={{ background: '#f5f5f5', padding: 12, fontSize: 12, borderRadius: 6 }}>
        {JSON.stringify(
          {
            version: s.version,
            project: s.project,
            counts: {
              walls: s.walls.length,
              openings: s.openings.length,
              symbols: s.symbols.length,
              dimensions: s.dimensions.length,
              texts: s.texts.length,
            },
            ui: s.ui,
            history: { canUndo: canUndo(history), canRedo: canRedo(history) },
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
