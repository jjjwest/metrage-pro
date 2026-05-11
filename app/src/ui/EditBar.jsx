import React, { useEffect, useState } from 'react';
import Numpad from './Numpad.jsx';
import { distance } from '../core/geometry.js';
import { updateWallLength } from '../store/actions.js';
import { MIN_WALL_LENGTH_MM } from '../constants/index.js';

const MAX_DIGITS = 6;

export default function EditBar({ wall, dispatch }) {
  const [buffer, setBuffer] = useState('');

  // Reset input when the selection changes so we never carry digits from a
  // previously-edited wall into a new one.
  useEffect(() => { setBuffer(''); }, [wall?.id]);

  if (!wall) return null;

  const currentLength = distance(
    { x: wall.x1, y: wall.y1 },
    { x: wall.x2, y: wall.y2 },
  );
  const parsed = buffer ? parseInt(buffer, 10) : null;
  const valid = parsed != null && Number.isFinite(parsed) && parsed >= MIN_WALL_LENGTH_MM;
  const showsBuffer = buffer.length > 0;

  const handleKey = (key) => {
    if (key === 'clear') { setBuffer(''); return; }
    if (key === 'backspace') { setBuffer((b) => b.slice(0, -1)); return; }
    if (key === 'enter') {
      if (!valid) return;
      dispatch(updateWallLength(wall.id, parsed));
      setBuffer('');
      return;
    }
    if (/^[0-9]$/.test(key)) {
      setBuffer((b) => (b + key).slice(0, MAX_DIGITS));
    }
  };

  const display = showsBuffer ? buffer : Math.round(currentLength).toString();
  const color = showsBuffer ? (valid ? '#222' : '#dc2626') : '#888';

  return (
    <div style={{
      position: 'absolute',
      right: 16,
      bottom: 16,
      width: 244,
      padding: 14,
      background: '#fff',
      border: '1px solid #d4d4d4',
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      zIndex: 10,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ fontSize: 12, color: '#666', display: 'flex', justifyContent: 'space-between' }}>
        <span>Длина стены</span>
        <span style={{ color: '#aaa' }}>{Math.round(currentLength)} мм</span>
      </div>
      <div style={{
        padding: '10px 12px',
        background: '#f5f5f5',
        borderRadius: 8,
        fontSize: 24,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        textAlign: 'right',
        color,
      }}>
        {display} <span style={{ fontSize: 13, color: '#888' }}>мм</span>
      </div>
      <Numpad onKey={handleKey} />
    </div>
  );
}
