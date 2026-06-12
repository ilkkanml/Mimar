import {
  hydrateLoadedGameState,
  isSaveGame,
  SAVE_SCHEMA_VERSION
} from "./schema";

import type { SaveGame } from "./schema";

export type SaveMigrationResult =
  | {
      ok: true;
      saveGame: SaveGame;
    }
  | {
      ok: false;
      reason: "invalid_shape" | "unsupported_schema";
    };

export function migrateSaveGame(value: unknown): SaveMigrationResult {
  if (!hasSchemaVersion(value)) {
    return {
      ok: false,
      reason: "invalid_shape"
    };
  }

  if (value.schemaVersion !== SAVE_SCHEMA_VERSION) {
    return {
      ok: false,
      reason: "unsupported_schema"
    };
  }

  if (!isSaveGame(value)) {
    return {
      ok: false,
      reason: "invalid_shape"
    };
  }

  return {
    ok: true,
    saveGame: {
      ...value,
      gameState: hydrateLoadedGameState(value.gameState)
    }
  };
}

function hasSchemaVersion(
  value: unknown
): value is { schemaVersion: unknown } {
  return typeof value === "object" && value !== null && "schemaVersion" in value;
}
