import {
  createSaveGame,
  DEFAULT_SAVE_SLOT_KEY
} from "./schema";

import type { GameState } from "../state/types";
import type { SaveGame } from "./schema";

export type GameSaveStorage = Pick<Storage, "removeItem" | "setItem">;

export type SaveGameToStorageResult =
  | {
      ok: true;
      saveGame: SaveGame;
    }
  | {
      ok: false;
      reason: "storage_unavailable";
    };

export function serializeSaveGame(saveGame: SaveGame): string {
  return JSON.stringify(saveGame);
}

export function saveGameToStorage(
  storage: GameSaveStorage,
  state: GameState,
  options: {
    key?: string;
    savedAt?: string;
  } = {}
): SaveGameToStorageResult {
  const saveGame = createSaveGame(
    state,
    options.savedAt ?? new Date().toISOString()
  );

  try {
    storage.setItem(
      options.key ?? DEFAULT_SAVE_SLOT_KEY,
      serializeSaveGame(saveGame)
    );
  } catch {
    return {
      ok: false,
      reason: "storage_unavailable"
    };
  }

  return {
    ok: true,
    saveGame
  };
}

export function clearSavedGame(
  storage: GameSaveStorage,
  key = DEFAULT_SAVE_SLOT_KEY
): boolean {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
