import { SCHEMA_VERSION, TOOLS, UI_MODES } from '../constants/index.js';
import { newId } from '../core/ids.js';

export function createInitialState() {
  return {
    version: SCHEMA_VERSION,
    project: {
      id: newId(),
      name: 'Без названия',
      units: 'mm',
    },
    walls: [],
    openings: [],
    symbols: [],
    dimensions: [],
    texts: [],
    ui: {
      tool: TOOLS.SELECT,
      selectedIds: [],
      primarySelectionId: null,
      pan: { x: 0, y: 0 },
      zoom: 1,
      mode: UI_MODES.PLAN,
      draftWall: null,
    },
  };
}
