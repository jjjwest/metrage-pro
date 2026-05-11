import { angle, distance } from './geometry.js';
import {
  SNAP_ANGLE_INCREMENT_RAD,
  ANGLE_SNAP_TOLERANCE_RAD,
  ALIGNMENT_TOLERANCE_MM,
} from '../constants/index.js';

// Applied only during interactive editing. Once the user commits, the resulting
// world coordinates are stored as plain facts in state.

export function snapAngle(angleRad, increment = SNAP_ANGLE_INCREMENT_RAD) {
  return Math.round(angleRad / increment) * increment;
}

export function snapPoint(point, candidates, tolerance) {
  let best = null;
  let bestDist = tolerance;
  for (const c of candidates) {
    const d = distance(point, c);
    if (d <= bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best ?? point;
}

// Rotate `free` around `fixed` so the segment angle snaps to `increment`.
// Distance from `fixed` is preserved.
export function snapSegmentEndAngle(fixed, free, increment = SNAP_ANGLE_INCREMENT_RAD) {
  const a = angle(fixed, free);
  const snapped = snapAngle(a, increment);
  const d = distance(fixed, free);
  return {
    x: fixed.x + Math.cos(snapped) * d,
    y: fixed.y + Math.sin(snapped) * d,
  };
}

// Snap angle to nearest increment ONLY when within tolerance; otherwise pass through.
// Wraparound at ±π is handled via atan2(sin, cos) of the residual.
export function snapAngleWithinTolerance(
  angleRad,
  increment = SNAP_ANGLE_INCREMENT_RAD,
  tolerance = ANGLE_SNAP_TOLERANCE_RAD,
) {
  const candidate = Math.round(angleRad / increment) * increment;
  const residual = angleRad - candidate;
  const wrapped = Math.atan2(Math.sin(residual), Math.cos(residual));
  return Math.abs(wrapped) <= tolerance ? candidate : angleRad;
}

// Like snapSegmentEndAngle but only snaps inside `tolerance`. Distance preserved.
export function snapSegmentEndAngleTolerant(
  fixed,
  free,
  increment = SNAP_ANGLE_INCREMENT_RAD,
  tolerance = ANGLE_SNAP_TOLERANCE_RAD,
) {
  const a = angle(fixed, free);
  const snapped = snapAngleWithinTolerance(a, increment, tolerance);
  if (snapped === a) return free;
  const d = distance(fixed, free);
  return {
    x: fixed.x + Math.cos(snapped) * d,
    y: fixed.y + Math.sin(snapped) * d,
  };
}

// For each axis, find the nearest node coord within tolerance. Snap that axis
// to the matched coord and emit a guide. The other axis is untouched.
export function computeAlignment(point, nodes, tolerance = ALIGNMENT_TOLERANCE_MM) {
  let bestX = null;
  let bestY = null;
  for (const n of nodes) {
    const dx = Math.abs(point.x - n.x);
    if (dx <= tolerance && (bestX == null || dx < bestX.delta)) {
      bestX = { value: n.x, delta: dx, node: n };
    }
    const dy = Math.abs(point.y - n.y);
    if (dy <= tolerance && (bestY == null || dy < bestY.delta)) {
      bestY = { value: n.y, delta: dy, node: n };
    }
  }
  const aligned = {
    x: bestX ? bestX.value : point.x,
    y: bestY ? bestY.value : point.y,
  };
  const guides = [];
  if (bestX) guides.push({ axis: 'x', value: bestX.value, refNode: bestX.node });
  if (bestY) guides.push({ axis: 'y', value: bestY.value, refNode: bestY.node });
  return { aligned, guides };
}

// Used by both the preview selector and the COMMIT_DRAFT_WALL reducer so they
// agree on the final endpoint. 1) tolerant 45° angle snap. 2) X/Y alignment to
// existing nodes.
export function computeDraftWallEndpoint(start, current, nodes, options = {}) {
  const angled = snapSegmentEndAngleTolerant(
    start, current,
    options.angleIncrement,
    options.angleTolerance,
  );
  return computeAlignment(angled, nodes, options.alignmentTolerance);
}
