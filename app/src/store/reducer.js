import { ActionTypes } from './actions.js';
import { newId } from '../core/ids.js';
import { DEFAULT_WALL_THICKNESS } from '../constants/index.js';

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

    case ActionTypes.SET_TOOL:
      return { ...state, ui: { ...state.ui, tool: action.tool } };

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
