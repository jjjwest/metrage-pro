import React, { useEffect, useRef } from 'react';
import { toScreen, zoomAtPoint } from '../core/coords.js';
import { updateViewport } from '../store/actions.js';

const WHEEL_ZOOM_RATE = 0.005;
const WHEEL_DELTA_CLAMP = 50;
const MIN_WALL_STROKE_PX = 2;
const WALL_STROKE_RATIO = 0.01;

// Pure presentation + viewport gestures. No geometry math beyond toScreen/zoomAtPoint.
// All world coordinates come from props; all interaction is dispatched as UPDATE_VIEWPORT.
export default function Canvas({ walls, viewport, dispatch }) {
  const containerRef = useRef(null);
  const pointersRef = useRef(new Map());
  const lastPinchRef = useRef(null);

  const toLocal = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, toLocal(e));
    lastPinchRef.current = null;
  };

  const handlePointerMove = (e) => {
    const pointers = pointersRef.current;
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    const curr = toLocal(e);
    pointers.set(e.pointerId, curr);

    if (pointers.size === 1) {
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      dispatch(updateViewport({
        pan: { x: viewport.pan.x + dx, y: viewport.pan.y + dy },
      }));
      return;
    }

    if (pointers.size === 2) {
      const [p1, p2] = [...pointers.values()];
      const focal = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (lastPinchRef.current) {
        const factor = dist / lastPinchRef.current.dist;
        const focalDx = focal.x - lastPinchRef.current.focal.x;
        const focalDy = focal.y - lastPinchRef.current.focal.y;
        const panned = {
          pan: { x: viewport.pan.x + focalDx, y: viewport.pan.y + focalDy },
          zoom: viewport.zoom,
        };
        dispatch(updateViewport(zoomAtPoint(panned, focal, factor)));
      }
      lastPinchRef.current = { dist, focal };
    }
  };

  const handlePointerUp = (e) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      lastPinchRef.current = null;
    }
  };

  // Wheel must be a non-passive native listener so preventDefault() blocks page zoom.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const focal = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const dy = Math.max(-WHEEL_DELTA_CLAMP, Math.min(WHEEL_DELTA_CLAMP, e.deltaY));
      const factor = Math.exp(-dy * WHEEL_ZOOM_RATE);
      dispatch(updateViewport(zoomAtPoint(viewport, focal, factor)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [viewport, dispatch]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#fafafa',
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        cursor: 'grab',
      }}
    >
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        {walls.map((w) => {
          const a = toScreen({ x: w.x1, y: w.y1 }, viewport);
          const b = toScreen({ x: w.x2, y: w.y2 }, viewport);
          const strokePx = Math.max(
            MIN_WALL_STROKE_PX,
            (w.thickness ?? 100) * viewport.zoom * WALL_STROKE_RATIO,
          );
          return (
            <line
              key={w.id}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="#222"
              strokeWidth={strokePx}
              strokeLinecap="round"
            />
          );
        })}
        {walls.length === 0 && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#aaa"
            fontSize="14"
            fontFamily="system-ui, sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            Пустой холст · pan и zoom доступны
          </text>
        )}
      </svg>
    </div>
  );
}
