import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { addNode, connectNodesIfValid, selectNode } from "../state/actions";
import { createInitialGameState, createZeroResourceMap } from "../state/initialState";
import { tickGameState } from "../simulation/tick";
import { loadGameFromStorage, parseSaveGame } from "./loadGame";
import { saveGameToStorage, serializeSaveGame } from "./saveGame";
import { createSaveGame, DEFAULT_SAVE_SLOT_KEY } from "./schema";

import type { GameState, NodeId } from "../state/types";
import type { GameLoadStorage } from "./loadGame";
import type { GameSaveStorage } from "./saveGame";

describe("save/load v0", () => {
  it("roundtrips graph and resource balances while resetting runtime fields", () => {
    const graph = createConnectedGraph();
    const tickedState = tickGameState(graph.state, nodeDefinitionsById);
    const saveGame = createSaveGame(
      tickedState,
      "2026-06-11T12:00:00.000Z"
    );

    const result = parseSaveGame(serializeSaveGame(saveGame));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.saveGame.schemaVersion).toBe(0);
    expect(result.saveGame.gameState.schemaVersion).toBe(0);
    expect(Object.keys(result.saveGame.gameState.graph.nodes)).toEqual(
      Object.keys(tickedState.graph.nodes)
    );
    expect(result.saveGame.gameState.graph.edges).toEqual(tickedState.graph.edges);
    expect(result.saveGame.gameState.graph.selectedNodeIds).toEqual([
      graph.parserId
    ]);
    expect(result.saveGame.gameState.resources.balances.rawData).toBeGreaterThan(
      0
    );
    expect(result.saveGame.gameState.resources.rates).toEqual(
      createZeroResourceMap()
    );
    expect(result.saveGame.gameState.resources.capacities).toEqual(
      createZeroResourceMap()
    );
    expect(result.saveGame.gameState.graph.nodes[graph.parserId]?.status).toBe(
      "idle"
    );
    expect(
      result.saveGame.gameState.graph.nodes[graph.parserId]?.runtime
        .effectiveThroughput
    ).toBe(0);
  });

  it("saves and loads through a storage adapter", () => {
    const storage = new MemoryStorage();
    const graph = createConnectedGraph();

    const saveResult = saveGameToStorage(storage, graph.state, {
      savedAt: "2026-06-11T12:00:00.000Z"
    });
    const loadResult = loadGameFromStorage(storage);

    expect(saveResult.ok).toBe(true);
    expect(storage.getItem(DEFAULT_SAVE_SLOT_KEY)).not.toBeNull();
    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      expect(loadResult.saveGame.savedAt).toBe("2026-06-11T12:00:00.000Z");
      expect(loadResult.saveGame.gameState.graph.edges).toEqual(
        graph.state.graph.edges
      );
    }
  });

  it("returns a safe error for missing or broken saves", () => {
    const storage = new MemoryStorage();

    expect(loadGameFromStorage(storage)).toEqual({
      ok: false,
      reason: "missing_save"
    });

    storage.setItem(DEFAULT_SAVE_SLOT_KEY, "{not valid json");
    expect(loadGameFromStorage(storage)).toEqual({
      ok: false,
      reason: "invalid_json"
    });
  });

  it("rejects unsupported save schemas", () => {
    const result = parseSaveGame(
      JSON.stringify({
        schemaVersion: 99,
        savedAt: "2026-06-11T12:00:00.000Z",
        gameVersion: "0.1.0-dev",
        gameState: {}
      })
    );

    expect(result).toEqual({
      ok: false,
      reason: "unsupported_schema"
    });
  });
});

function createConnectedGraph(): {
  state: GameState;
  internetFeedId: NodeId;
  parserId: NodeId;
} {
  let state = createInitialGameState("2026-06-11T00:00:00.000Z");

  const internetFeed = addNode(state, {
    definitionId: "internet_feed",
    position: { x: 20, y: 30 }
  });
  state = internetFeed.state;

  const parser = addNode(state, {
    definitionId: "parser",
    position: { x: 240, y: 30 }
  });
  state = parser.state;

  const connection = connectNodesIfValid(state, nodeDefinitionsById, {
    fromNodeId: internetFeed.value.id,
    fromPortId: "raw_out",
    toNodeId: parser.value.id,
    toPortId: "raw_in"
  });

  if (!connection.validation.ok) {
    throw new Error(`Test connection failed: ${connection.validation.reason}`);
  }

  state = selectNode(connection.state, { nodeId: parser.value.id });

  return {
    state,
    internetFeedId: internetFeed.value.id,
    parserId: parser.value.id
  };
}

class MemoryStorage implements GameLoadStorage, GameSaveStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}
