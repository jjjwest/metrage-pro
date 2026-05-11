export const SCHEMA_VERSION = 1;

export const DEFAULT_WALL_THICKNESS = 100;
export const MIN_WALL_LENGTH_MM = 10;

export const SNAP_ANGLE_INCREMENT_RAD = Math.PI / 4;
export const SNAP_DISTANCE_MM = 50;

// Tolerance for tolerant angle snapping (only snaps if pointer angle is within this).
export const ANGLE_SNAP_TOLERANCE_RAD = (5 * Math.PI) / 180;
// Tolerance for X/Y alignment guides to existing wall nodes.
export const ALIGNMENT_TOLERANCE_MM = 10;

export const HITBOX_PX = 44;

export const ZOOM_MIN = 0.05;
export const ZOOM_MAX = 50;

export const TOOLS = Object.freeze({
  SELECT: 'select',
  DRAW_WALL: 'drawWall',
  ADD_WINDOW: 'addWindow',
  ADD_DOOR: 'addDoor',
  ADD_SYMBOL: 'addSymbol',
  ADD_TEXT: 'addText',
  PAN: 'pan',
});

export const OPENING_TYPES = Object.freeze({
  WINDOW: 'window',
  DOOR: 'door',
});

export const SYMBOL_TYPES = Object.freeze({
  OUTLET: 'outlet',
  SWITCH: 'switch',
  WATER: 'water',
  SEWER: 'sewer',
  GAS: 'gas',
  VENT: 'vent',
});

export const DIMENSION_TYPES = Object.freeze({
  CHAIN: 'chain',
  OVERALL: 'overall',
  CUSTOM: 'custom',
});

export const UI_MODES = Object.freeze({
  PLAN: 'plan',
});
