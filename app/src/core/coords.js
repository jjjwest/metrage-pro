import { ZOOM_MAX, ZOOM_MIN } from '../constants/index.js';

// viewport: { pan: { x, y }, zoom }
//   screen = world * zoom + pan
//   world  = (screen - pan) / zoom

export function toScreen(worldPoint, viewport) {
  return {
    x: worldPoint.x * viewport.zoom + viewport.pan.x,
    y: worldPoint.y * viewport.zoom + viewport.pan.y,
  };
}

export function toWorld(screenPoint, viewport) {
  return {
    x: (screenPoint.x - viewport.pan.x) / viewport.zoom,
    y: (screenPoint.y - viewport.pan.y) / viewport.zoom,
  };
}

export function clampZoom(zoom, min = ZOOM_MIN, max = ZOOM_MAX) {
  return Math.max(min, Math.min(max, zoom));
}

// Multiply current zoom by `factor`, keeping the world point under `screenPoint` stationary.
export function zoomAtPoint(viewport, screenPoint, factor, options = {}) {
  const { minZoom = ZOOM_MIN, maxZoom = ZOOM_MAX } = options;
  const newZoom = clampZoom(viewport.zoom * factor, minZoom, maxZoom);
  const k = newZoom / viewport.zoom;
  return {
    pan: {
      x: screenPoint.x - k * (screenPoint.x - viewport.pan.x),
      y: screenPoint.y - k * (screenPoint.y - viewport.pan.y),
    },
    zoom: newZoom,
  };
}
