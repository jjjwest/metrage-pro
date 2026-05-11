// Pure 2D geometry helpers. World units are millimetres.
// Y axis convention is mathematical here; render layer flips for screen if needed.

export function distance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angle(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

export function normalize(v) {
  const len = Math.hypot(v.x, v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

// Returns { point, t, distance }, with t clamped to [0, 1].
export function projectPointOnSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    return { point: { x: a.x, y: a.y }, t: 0, distance: distance(p, a) };
  }
  const tRaw = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  const t = Math.max(0, Math.min(1, tRaw));
  const point = { x: a.x + t * dx, y: a.y + t * dy };
  return { point, t, distance: distance(p, point) };
}

// Point on the ray from a in the direction of b, at distance d.
export function pointAtDistance(a, b, d) {
  const dir = normalize({ x: b.x - a.x, y: b.y - a.y });
  return { x: a.x + dir.x * d, y: a.y + dir.y * d };
}

export function segmentLength(seg) {
  return distance({ x: seg.x1, y: seg.y1 }, { x: seg.x2, y: seg.y2 });
}
