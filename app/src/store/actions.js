export const ActionTypes = Object.freeze({
  ADD_WALL: 'ADD_WALL',
  UPDATE_WALL: 'UPDATE_WALL',
  DELETE_WALL: 'DELETE_WALL',

  ADD_OPENING: 'ADD_OPENING',
  UPDATE_OPENING: 'UPDATE_OPENING',
  DELETE_OPENING: 'DELETE_OPENING',

  ADD_SYMBOL: 'ADD_SYMBOL',
  UPDATE_SYMBOL: 'UPDATE_SYMBOL',
  DELETE_SYMBOL: 'DELETE_SYMBOL',
  BIND_SYMBOL_TO_WALL: 'BIND_SYMBOL_TO_WALL',

  ADD_TEXT: 'ADD_TEXT',
  UPDATE_TEXT: 'UPDATE_TEXT',
  DELETE_TEXT: 'DELETE_TEXT',

  ADD_DIMENSION: 'ADD_DIMENSION',
  UPDATE_DIMENSION: 'UPDATE_DIMENSION',
  DELETE_DIMENSION: 'DELETE_DIMENSION',

  SET_TOOL: 'SET_TOOL',
  SELECT_ENTITY: 'SELECT_ENTITY',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  UPDATE_VIEWPORT: 'UPDATE_VIEWPORT',

  ADD_TEMPLATE_ENTITIES: 'ADD_TEMPLATE_ENTITIES',

  UNDO: 'UNDO',
  REDO: 'REDO',

  REPLACE_STATE: 'REPLACE_STATE',
});

export const addWall = (wall) => ({ type: ActionTypes.ADD_WALL, wall });
export const updateWall = (id, patch) => ({ type: ActionTypes.UPDATE_WALL, id, patch });
export const deleteWall = (id) => ({ type: ActionTypes.DELETE_WALL, id });

export const addOpening = (opening) => ({ type: ActionTypes.ADD_OPENING, opening });
export const updateOpening = (id, patch) => ({ type: ActionTypes.UPDATE_OPENING, id, patch });
export const deleteOpening = (id) => ({ type: ActionTypes.DELETE_OPENING, id });

export const addSymbol = (symbol) => ({ type: ActionTypes.ADD_SYMBOL, symbol });
export const updateSymbol = (id, patch) => ({ type: ActionTypes.UPDATE_SYMBOL, id, patch });
export const deleteSymbol = (id) => ({ type: ActionTypes.DELETE_SYMBOL, id });
export const bindSymbolToWall = (id, wallId, offset) =>
  ({ type: ActionTypes.BIND_SYMBOL_TO_WALL, id, wallId, offset });

export const addText = (text) => ({ type: ActionTypes.ADD_TEXT, text });
export const updateText = (id, patch) => ({ type: ActionTypes.UPDATE_TEXT, id, patch });
export const deleteText = (id) => ({ type: ActionTypes.DELETE_TEXT, id });

export const addDimension = (dimension) => ({ type: ActionTypes.ADD_DIMENSION, dimension });
export const updateDimension = (id, patch) => ({ type: ActionTypes.UPDATE_DIMENSION, id, patch });
export const deleteDimension = (id) => ({ type: ActionTypes.DELETE_DIMENSION, id });

export const setTool = (tool) => ({ type: ActionTypes.SET_TOOL, tool });
export const selectEntity = (id, options = {}) => ({
  type: ActionTypes.SELECT_ENTITY,
  id,
  primary: options.primary ?? true,
  additive: options.additive ?? false,
});
export const clearSelection = () => ({ type: ActionTypes.CLEAR_SELECTION });
export const updateViewport = (patch) => ({ type: ActionTypes.UPDATE_VIEWPORT, patch });

export const addTemplateEntities = (entities) =>
  ({ type: ActionTypes.ADD_TEMPLATE_ENTITIES, entities });

export const undo = () => ({ type: ActionTypes.UNDO });
export const redo = () => ({ type: ActionTypes.REDO });

export const replaceState = (state) => ({ type: ActionTypes.REPLACE_STATE, state });
