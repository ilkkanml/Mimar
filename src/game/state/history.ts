import { normalizeGameStateForSave } from "../save/schema";

import type { GameState } from "./types";

export const DEFAULT_HISTORY_MAX_DEPTH = 50;

export type GameHistoryState = {
  past: GameState[];
  current: GameState;
  future: GameState[];
  maxDepth: number;
};

export function createGameHistoryState(
  current: GameState,
  maxDepth = DEFAULT_HISTORY_MAX_DEPTH
): GameHistoryState {
  return {
    past: [],
    current,
    future: [],
    maxDepth: normalizeMaxDepth(maxDepth)
  };
}

export function canUndo(history: GameHistoryState): boolean {
  return history.past.length > 0;
}

export function canRedo(history: GameHistoryState): boolean {
  return history.future.length > 0;
}

export function replaceHistoryCurrent(
  history: GameHistoryState,
  current: GameState
): GameHistoryState {
  return {
    ...history,
    current
  };
}

export function pushHistory(
  history: GameHistoryState,
  nextState: GameState,
  previousState = history.current
): GameHistoryState {
  const previousSnapshot = createHistorySnapshot(previousState);
  const nextSnapshot = createHistorySnapshot(nextState);

  if (areHistorySnapshotsEqual(previousSnapshot, nextSnapshot)) {
    return {
      ...history,
      current: nextState
    };
  }

  return {
    ...history,
    past: trimPast([...history.past, previousSnapshot], history.maxDepth),
    current: nextState,
    future: []
  };
}

export function undo(history: GameHistoryState): GameHistoryState {
  const previous = history.past.at(-1);

  if (previous === undefined) {
    return history;
  }

  return {
    ...history,
    past: history.past.slice(0, -1),
    current: previous,
    future: trimFuture(
      [createHistorySnapshot(history.current), ...history.future],
      history.maxDepth
    )
  };
}

export function redo(history: GameHistoryState): GameHistoryState {
  const next = history.future[0];

  if (next === undefined) {
    return history;
  }

  return {
    ...history,
    past: trimPast(
      [...history.past, createHistorySnapshot(history.current)],
      history.maxDepth
    ),
    current: next,
    future: history.future.slice(1)
  };
}

export function createHistorySnapshot(state: GameState): GameState {
  return normalizeGameStateForSave(state);
}

function normalizeMaxDepth(maxDepth: number): number {
  return Number.isFinite(maxDepth) ? Math.max(1, Math.floor(maxDepth)) : 1;
}

function trimPast(states: GameState[], maxDepth: number): GameState[] {
  return states.slice(Math.max(0, states.length - maxDepth));
}

function trimFuture(states: GameState[], maxDepth: number): GameState[] {
  return states.slice(0, maxDepth);
}

function areHistorySnapshotsEqual(
  left: GameState,
  right: GameState
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
