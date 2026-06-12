import { DEFAULT_SAVE_SLOT_KEY } from "./schema";
import { migrateSaveGame } from "./migrations";

import type { SaveGame } from "./schema";

export type GameLoadStorage = Pick<Storage, "getItem">;

export type LoadGameResult =
  | {
      ok: true;
      saveGame: SaveGame;
    }
  | {
      ok: false;
      reason:
        | "invalid_json"
        | "invalid_shape"
        | "missing_save"
        | "storage_unavailable"
        | "unsupported_schema";
    };

export function parseSaveGame(serializedSave: string): LoadGameResult {
  let parsedSave: unknown;

  try {
    parsedSave = JSON.parse(serializedSave);
  } catch {
    return {
      ok: false,
      reason: "invalid_json"
    };
  }

  const migration = migrateSaveGame(parsedSave);

  if (!migration.ok) {
    return {
      ok: false,
      reason: migration.reason
    };
  }

  return {
    ok: true,
    saveGame: migration.saveGame
  };
}

export function loadGameFromStorage(
  storage: GameLoadStorage,
  key = DEFAULT_SAVE_SLOT_KEY
): LoadGameResult {
  let serializedSave: string | null;

  try {
    serializedSave = storage.getItem(key);
  } catch {
    return {
      ok: false,
      reason: "storage_unavailable"
    };
  }

  if (serializedSave === null) {
    return {
      ok: false,
      reason: "missing_save"
    };
  }

  return parseSaveGame(serializedSave);
}
