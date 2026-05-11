import { ActionTypes } from './actions.js';
import { reducer } from './reducer.js';

const HISTORY_LIMIT = 100;

// UI-only actions update `present` but are not recorded as undoable steps.
const NON_HISTORIC = new Set([
  ActionTypes.SET_TOOL,
  ActionTypes.SELECT_ENTITY,
  ActionTypes.CLEAR_SELECTION,
  ActionTypes.UPDATE_VIEWPORT,
  ActionTypes.START_DRAFT_WALL,
  ActionTypes.UPDATE_DRAFT_WALL,
  ActionTypes.CANCEL_DRAFT_WALL,
  ActionTypes.UNDO,
  ActionTypes.REDO,
  ActionTypes.REPLACE_STATE,
]);

export function createHistory(present) {
  return { past: [], present, future: [] };
}

export const canUndo = (history) => history.past.length > 0;
export const canRedo = (history) => history.future.length > 0;

export function historyReducer(history, action) {
  if (action.type === ActionTypes.UNDO) {
    if (!canUndo(history)) return history;
    const previous = history.past[history.past.length - 1];
    return {
      past: history.past.slice(0, -1),
      present: previous,
      future: [history.present, ...history.future],
    };
  }
  if (action.type === ActionTypes.REDO) {
    if (!canRedo(history)) return history;
    const [next, ...rest] = history.future;
    return {
      past: [...history.past, history.present],
      present: next,
      future: rest,
    };
  }

  const newPresent = reducer(history.present, action);
  if (newPresent === history.present) return history;

  if (NON_HISTORIC.has(action.type)) {
    return { ...history, present: newPresent };
  }

  const newPast = [...history.past, history.present];
  const trimmed = newPast.length > HISTORY_LIMIT
    ? newPast.slice(newPast.length - HISTORY_LIMIT)
    : newPast;

  return { past: trimmed, present: newPresent, future: [] };
}
