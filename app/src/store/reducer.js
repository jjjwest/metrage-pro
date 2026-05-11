import { ActionTypes } from './actions.js';
import { newId } from '../core/ids.js';
import { distance } from '../core/geometry.js';
import { computeDraftWallEndpoint } from '../core/snapping.js';
import { DEFAULT_WALL_THICKNESS, TOOLS } from '../constants/index.js';

function collectWallNodes(walls) {
  const out = [];
  for (const w of walls) {
    out.push({ x: w.x1, y: w.y1, wallId: w.id, end: 'a' });
    out.push({ x: w.x2, y: w.y2, wallId: w.id, end: 'b' });
  }
  return out;
}

function ensureId(entity) {
  return entity.id ? entity : { ...entity, id: newId() };
}

function patchById(list, id, patch) {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

function removeById(list, id) {
  return list.filter((item) => item.id !== id);
}

export function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_WALL: {
      const wall = ensureId({
        kind: 'wall',
        thickness: DEFAULT_WALL_THICKNESS,
        ...action.wall,
      });
      return { ...state, walls: [...state.walls, wall] };
    }
    case ActionTypes.UPDATE_WALL:
      return { ...state, walls: patchById(state.walls, action.id, action.patch) };
    case ActionTypes.DELETE_WALL:
      return {
        ...state,
        walls: removeById(state.walls, action.id),
        openings: state.openings.filter((o) => o.wallId !== action.id),
        symbols: state.symbols.filter((s) => s.baseWallId !== action.id),
      };

    case ActionTypes.ADD_OPENING:
      return { ...state, openings: [...state.openings, ensureId(action.opening)] };
    case ActionTypes.UPDATE_OPENING:
      return { ...state, openings: patchById(state.openings, action.id, action.patch) };
    case ActionTypes.DELETE_OPENING:
      return { ...state, openings: removeById(state.openings, action.id) };

    case ActionTypes.ADD_SYMBOL:
      return { ...state, symbols: [...state.symbols, ensureId(action.symbol)] };
    case ActionTypes.UPDATE_SYMBOL:
      return { ...state, symbols: patchById(state.symbols, action.id, action.patch) };
    case ActionTypes.DELETE_SYMBOL:
      return { ...state, symbols: removeById(state.symbols, action.id) };
    case ActionTypes.BIND_SYMBOL_TO_WALL:
      return {
        ...state,
        symbols: patchById(state.symbols, action.id, {
          baseWallId: action.wallId,
          offset: action.offset,
        }),
      };

    case ActionTypes.ADD_TEXT:
      return { ...state, texts: [...state.texts, ensureId(action.text)] };
    case ActionTypes.UPDATE_TEXT:
      return { ...state, texts: patchById(state.texts, action.id, action.patch) };
    case ActionTypes.DELETE_TEXT:
      return { ...state, texts: removeById(state.texts, action.id) };

    case ActionTypes.ADD_DIMENSION:
      return { ...state, dimensions: [...state.dimensions, ensureId(action.dimension)] };
    case ActionTypes.UPDATE_DIMENSION:
      return { ...state, dimensions: patchById(state.dimensions, action.id, action.patch) };
    case ActionTypes.DELETE_DIMENSION:
      return { ...state, dimensions: removeById(state.dimensions, action.id) };

    case ActionTypes.SET_TOOL: {
      // Leaving the draw-wall tool always discards a pending draft so the
      // ghost preview never lingers in another mode.
      const draftWall = action.tool === TOOLS.DRAW_WALL ? state.ui.draftWall : null;
      return { ...state, ui: { ...state.ui, tool: action.tool, draftWall } };
    }

    case ActionTypes.START_DRAFT_WALL:
      return {
        ...state,
        ui: {
          ...state.ui,
          draftWall: { start: action.point, current: action.point },
        },
      };

    case ActionTypes.UPDATE_DRAFT_WALL: {
      const d = state.ui.draftWall;
      if (!d) return state;
      return {
        ...state,
        ui: { ...state.ui, draftWall: { ...d, current: action.point } },
      };
    }

    case ActionTypes.CANCEL_DRAFT_WALL:
      if (!state.ui.draftWall) return state;
      return { ...state, ui: { ...state.ui, draftWall: null } };

    case ActionTypes.COMMIT_DRAFT_WALL: {
      const d = state.ui.draftWall;
      if (!d) return state;
      const nodes = collectWallNodes(state.walls);
      const { aligned } = computeDraftWallEndpoint(d.start, d.current, nodes);
      // Discard zero-length draft (sub-mm); just clear the draft.
      if (distance(d.start, aligned) < 1) {
        return { ...state, ui: { ...state.ui, draftWall: null } };
      }
      const wall = ensureId({
        kind: 'wall',
        thickness: DEFAULT_WALL_THICKNESS,
        x1: d.start.x,
        y1: d.start.y,
        x2: aligned.x,
        y2: aligned.y,
      });
      return {
        ...state,
        walls: [...state.walls, wall],
        ui: { ...state.ui, draftWall: null },
      };
    }

    case ActionTypes.SELECT_ENTITY: {
      if (action.id == null) {
        return {
          ...state,
          ui: { ...state.ui, selectedIds: [], primarySelectionId: null },
        };
      }
      const selectedIds = action.additive
        ? state.ui.selectedIds.includes(action.id)
          ? state.ui.selectedIds.filter((x) => x !== action.id)
          : [...state.ui.selectedIds, action.id]
        : [action.id];
      const primarySelectionId = action.primary ? action.id : state.ui.primarySelectionId;
      return { ...state, ui: { ...state.ui, selectedIds, primarySelectionId } };
    }
    case ActionTypes.CLEAR_SELECTION:
      return { ...state, ui: { ...state.ui, selectedIds: [], primarySelectionId: null } };

    case ActionTypes.UPDATE_VIEWPORT:
      return { ...state, ui: { ...state.ui, ...action.patch } };

    case ActionTypes.ADD_TEMPLATE_ENTITIES: {
      const e = action.entities ?? {};
      return {
        ...state,
        walls: [...state.walls, ...(e.walls ?? []).map((w) => ensureId({ kind: 'wall', thickness: DEFAULT_WALL_THICKNESS, ...w }))],
        openings: [...state.openings, ...(e.openings ?? []).map(ensureId)],
        symbols: [...state.symbols, ...(e.symbols ?? []).map(ensureId)],
        texts: [...state.texts, ...(e.texts ?? []).map(ensureId)],
        dimensions: [...state.dimensions, ...(e.dimensions ?? []).map(ensureId)],
      };
    }

    case ActionTypes.REPLACE_STATE:
      return action.state;

    default:
      return state;
  }
}
