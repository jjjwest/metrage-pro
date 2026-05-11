import { distance, angle, pointAtDistance } from '../core/geometry.js';
import { toScreen } from '../core/coords.js';
import { computeDraftWallEndpoint } from '../core/snapping.js';

export const selectWalls = (s) => s.walls;
export const selectOpenings = (s) => s.openings;
export const selectSymbols = (s) => s.symbols;
export const selectDimensions = (s) => s.dimensions;
export const selectTexts = (s) => s.texts;

export const selectTool = (s) => s.ui.tool;
export const selectSelectedIds = (s) => s.ui.selectedIds;
export const selectPrimarySelectionId = (s) => s.ui.primarySelectionId;
export const selectViewport = (s) => ({ pan: s.ui.pan, zoom: s.ui.zoom });
export const selectDraftWall = (s) => s.ui.draftWall;

// Flattened list of every wall endpoint as a snappable node.
export function selectWallNodes(s) {
  const out = [];
  for (const w of s.walls) {
    out.push({ x: w.x1, y: w.y1, wallId: w.id, end: 'a' });
    out.push({ x: w.x2, y: w.y2, wallId: w.id, end: 'b' });
  }
  return out;
}

// Snapped + aligned preview for the in-flight draft wall.
// Returns { start, end, guides } or null when no draft exists.
// Guides are computed here so persistent state never carries them.
export function selectDraftWallPreview(s) {
  const d = s.ui.draftWall;
  if (!d) return null;
  const nodes = selectWallNodes(s);
  const { aligned, guides } = computeDraftWallEndpoint(d.start, d.current, nodes);
  return { start: d.start, end: aligned, guides };
}

export const selectWallById = (s, id) => s.walls.find((w) => w.id === id) ?? null;
export const selectOpeningById = (s, id) => s.openings.find((o) => o.id === id) ?? null;
export const selectSymbolById = (s, id) => s.symbols.find((sym) => sym.id === id) ?? null;
export const selectDimensionById = (s, id) => s.dimensions.find((d) => d.id === id) ?? null;

export function selectWallLength(s, id) {
  const w = selectWallById(s, id);
  if (!w) return 0;
  return distance({ x: w.x1, y: w.y1 }, { x: w.x2, y: w.y2 });
}

export function selectWallAngle(s, id) {
  const w = selectWallById(s, id);
  if (!w) return 0;
  return angle({ x: w.x1, y: w.y1 }, { x: w.x2, y: w.y2 });
}

export function selectSymbolWorldPosition(s, id) {
  const sym = selectSymbolById(s, id);
  if (!sym) return null;
  const wall = selectWallById(s, sym.baseWallId);
  if (!wall) return null;
  return pointAtDistance(
    { x: wall.x1, y: wall.y1 },
    { x: wall.x2, y: wall.y2 },
    sym.offset,
  );
}

export function selectSymbolsWithWorldPositions(s) {
  return s.symbols
    .map((sym) => {
      const position = selectSymbolWorldPosition(s, sym.id);
      return position ? { ...sym, position } : null;
    })
    .filter(Boolean);
}

export function selectOpeningWorldSegment(s, id) {
  const op = selectOpeningById(s, id);
  if (!op) return null;
  const wall = selectWallById(s, op.wallId);
  if (!wall) return null;
  const a = { x: wall.x1, y: wall.y1 };
  const b = { x: wall.x2, y: wall.y2 };
  return {
    start: pointAtDistance(a, b, op.offset),
    end: pointAtDistance(a, b, op.offset + op.width),
    wallId: op.wallId,
  };
}

// Dimension priority: explicit `value` overrides computed length.
export function selectDimensionDisplayValue(s, id) {
  const d = selectDimensionById(s, id);
  if (!d) return 0;
  if (d.value != null) return d.value;
  return selectDimensionComputedValue(s, d);
}

export function selectDimensionComputedValue(s, dim) {
  const a = resolveNode(s, dim.startNodeId);
  const b = resolveNode(s, dim.endNodeId);
  if (!a || !b) return 0;
  return distance(a, b);
}

// Foundation-level node addressing: "<wallId>:a" or "<wallId>:b".
function resolveNode(s, nodeId) {
  if (typeof nodeId !== 'string') return null;
  const [wallId, end] = nodeId.split(':');
  const wall = selectWallById(s, wallId);
  if (!wall) return null;
  if (end === 'a') return { x: wall.x1, y: wall.y1 };
  if (end === 'b') return { x: wall.x2, y: wall.y2 };
  return null;
}

export function selectWallScreenSegment(s, id) {
  const w = selectWallById(s, id);
  if (!w) return null;
  const v = selectViewport(s);
  return {
    a: toScreen({ x: w.x1, y: w.y1 }, v),
    b: toScreen({ x: w.x2, y: w.y2 }, v),
  };
}
