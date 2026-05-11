import React, { useEffect, useRef } from 'react';
import { toScreen, toWorld, zoomAtPoint } from '../core/coords.js';
import {
  updateViewport,
  startDraftWall,
  updateDraftWall,
  commitDraftWall,
  cancelDraftWall,
  selectEntity,
  clearSelection,
} from '../store/actions.js';
import { TOOLS, HITBOX_PX } from '../constants/index.js';

const WHEEL_ZOOM_RATE = 0.005;
const WHEEL_DELTA_CLAMP = 50;
const MIN_WALL_STROKE_PX = 2;
const WALL_STROKE_RATIO = 0.01;
const TAP_SLOP_PX = 6;
const STROKE_COMMIT_THRESHOLD_PX = 24;

// Pure presentation + viewport gestures + drawWall taps + select taps.
// All snap/alignment math is performed upstream (selectors / reducer);
// Canvas only renders the props it receives and dispatches deterministic actions.
export default function Canvas({
  walls,
  viewport,
  dispatch,
  tool,
  draftPreview,
  primarySelectionId,
}) {
  const containerRef = useRef(null);
  const pointersRef = useRef(new Map());
  const lastPinchRef = useRef(null);
  const downPosRef = useRef(null);
  const startedDraftRef = useRef(false);
  const downWallIdRef = useRef(null);
  const gestureMultiTouchRef = useRef(false);

  const toLocal = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const dispatchDraftMove = (local) => {
    dispatch(updateDraftWall(toWorld(local, viewport)));
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const local = toLocal(e);
    pointersRef.current.set(e.pointerId, local);
    downPosRef.current = local;
    lastPinchRef.current = null;

    if (pointersRef.current.size === 1) {
      gestureMultiTouchRef.current = false;
      const wallEl = e.target.closest && e.target.closest('[data-wall-id]');
      downWallIdRef.current = wallEl ? wallEl.getAttribute('data-wall-id') : null;
    } else {
      gestureMultiTouchRef.current = true;
    }

    // A second pointer landing during a fresh draft means the user is pinching,
    // not drawing. Drop the just-started draft so the gesture becomes pure
    // viewport manipulation.
    if (pointersRef.current.size === 2 && tool === TOOLS.DRAW_WALL && startedDraftRef.current) {
      dispatch(cancelDraftWall());
      startedDraftRef.current = false;
      return;
    }

    if (pointersRef.current.size !== 1 || tool !== TOOLS.DRAW_WALL) {
      startedDraftRef.current = false;
      return;
    }

    const world = toWorld(local, viewport);
    if (!draftPreview) {
      dispatch(startDraftWall(world));
      startedDraftRef.current = true;
    } else {
      dispatch(updateDraftWall(world));
      startedDraftRef.current = false;
    }
  };

  const handlePointerMove = (e) => {
    const pointers = pointersRef.current;

    if (!pointers.has(e.pointerId)) {
      if (tool === TOOLS.DRAW_WALL && draftPreview && e.buttons === 0) {
        dispatchDraftMove(toLocal(e));
      }
      return;
    }

    const prev = pointers.get(e.pointerId);
    const curr = toLocal(e);
    pointers.set(e.pointerId, curr);

    if (pointers.size === 1) {
      if (tool === TOOLS.DRAW_WALL) {
        if (draftPreview) dispatchDraftMove(curr);
      } else {
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        dispatch(updateViewport({
          pan: { x: viewport.pan.x + dx, y: viewport.pan.y + dy },
        }));
      }
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
    const local = toLocal(e);
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) lastPinchRef.current = null;

    const movePx = downPosRef.current
      ? Math.hypot(local.x - downPosRef.current.x, local.y - downPosRef.current.y)
      : Infinity;
    const cleanTap = pointersRef.current.size === 0
      && !gestureMultiTouchRef.current
      && movePx < TAP_SLOP_PX;

    if (tool === TOOLS.SELECT && cleanTap) {
      const wallId = downWallIdRef.current;
      if (wallId) dispatch(selectEntity(wallId));
      else dispatch(clearSelection());
    }

    if (tool === TOOLS.DRAW_WALL && draftPreview && downPosRef.current) {
      if (!startedDraftRef.current && cleanTap) {
        dispatch(commitDraftWall());
      } else if (startedDraftRef.current && movePx >= STROKE_COMMIT_THRESHOLD_PX) {
        dispatch(updateDraftWall(toWorld(local, viewport)));
        dispatch(commitDraftWall());
      }
    }

    downPosRef.current = null;
    downWallIdRef.current = null;
    if (pointersRef.current.size === 0) {
      startedDraftRef.current = false;
      gestureMultiTouchRef.current = false;
    }
  };

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
        cursor: tool === TOOLS.DRAW_WALL ? 'crosshair' : 'grab',
      }}
    >
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        {walls.map((w) => {
          const a = toScreen({ x: w.x1, y: w.y1 }, viewport);
          const b = toScreen({ x: w.x2, y: w.y2 }, viewport);
          const selected = primarySelectionId === w.id;
          const visualStroke = Math.max(
            MIN_WALL_STROKE_PX,
            (w.thickness ?? 100) * viewport.zoom * WALL_STROKE_RATIO,
          );
          const hitboxStroke = Math.max(HITBOX_PX, visualStroke + 8);
          return (
            <g key={w.id}>
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={selected ? '#3b82f6' : '#222'}
                strokeWidth={selected ? visualStroke + 2 : visualStroke}
                strokeLinecap="round"
              />
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="transparent"
                strokeWidth={hitboxStroke}
                strokeLinecap="round"
                data-wall-id={w.id}
                style={{ cursor: tool === TOOLS.SELECT ? 'pointer' : undefined }}
              />
            </g>
          );
        })}

        {draftPreview?.guides.map((g, i) => {
          if (g.axis === 'x') {
            const sx = toScreen({ x: g.value, y: 0 }, viewport).x;
            return (
              <line
                key={`guide-x-${i}`}
                x1={sx} x2={sx} y1="0" y2="100%"
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="6 4"
                pointerEvents="none"
              />
            );
          }
          const sy = toScreen({ x: 0, y: g.value }, viewport).y;
          return (
            <line
              key={`guide-y-${i}`}
              x1="0" x2="100%" y1={sy} y2={sy}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="6 4"
              pointerEvents="none"
            />
          );
        })}

        {draftPreview && (() => {
          const a = toScreen(draftPreview.start, viewport);
          const b = toScreen(draftPreview.end, viewport);
          return (
            <>
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#3b82f6"
                strokeWidth={Math.max(MIN_WALL_STROKE_PX, viewport.zoom)}
                strokeDasharray="8 6"
                strokeLinecap="round"
                pointerEvents="none"
              />
              <circle cx={a.x} cy={a.y} r="5" fill="#3b82f6" pointerEvents="none" />
              <circle cx={b.x} cy={b.y} r="5" fill="#3b82f6" pointerEvents="none" />
            </>
          );
        })()}

        {walls.length === 0 && !draftPreview && (
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
            Пустой холст · выберите инструмент «Стена» и тапните два раза
          </text>
        )}
      </svg>
    </div>
  );
}
