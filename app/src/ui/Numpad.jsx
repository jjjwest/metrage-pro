import React from 'react';

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['clear', '0', 'backspace'],
];

const LABELS = { clear: 'C', backspace: '⌫' };

const KEY_STYLE = {
  fontSize: 22,
  fontWeight: 600,
  background: '#fff',
  border: '1px solid #d4d4d4',
  borderRadius: 8,
  padding: '14px 0',
  cursor: 'pointer',
  userSelect: 'none',
  touchAction: 'manipulation',
};

const ENTER_STYLE = {
  ...KEY_STYLE,
  background: '#222',
  color: '#fff',
  borderColor: '#222',
  marginTop: 6,
};

export default function Numpad({ onKey }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {KEYS.flat().map((k) => (
          <button
            key={k}
            type="button"
            style={KEY_STYLE}
            onClick={() => onKey(k)}
          >
            {LABELS[k] ?? k}
          </button>
        ))}
      </div>
      <button
        type="button"
        style={{ ...ENTER_STYLE, width: '100%' }}
        onClick={() => onKey('enter')}
      >
        Enter
      </button>
    </div>
  );
}
