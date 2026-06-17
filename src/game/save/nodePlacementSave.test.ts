import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { createInitialGameState } from "../state/initialState";
import { placeNode } from "../state/nodePlacement";
import { parseSaveGame } from "./loadGame";
import { createSaveGame } from "./schema";
import { serializeSaveGame } from "./saveGame";

import type { GameState } from "../state/types";

describe("node placement save/load persistence", () => {
  it("persists newly placed node instances and positions without a schema change", () => {
    const fundedState = withMoney(
      createInitialGameState("2026-06-16T00:00:00.000Z"),
      200
    );
    const result = placeNode(fundedState, nodeDefinitionsById, {
      definitionId: "parser",
      position: { x: 320, y: 420 }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const saveGame = createSaveGame(
      result.state,
      "2026-06-16T12:00:00.000Z"
    );
    const loadResult = parseSaveGame(serializeSaveGame(saveGame));

    expect(loadResult.ok).toBe(true);
    if (!loadResult.ok) {
      return;
    }

    expect(loadResult.saveGame.schemaVersion).toBe(0);
    expect(loadResult.saveGame.gameState.graph.nodes[result.node.id]).toMatchObject({
      definitionId: "parser",
      level: 1,
      position: { x: 320, y: 420 }
    });
    expect(loadResult.saveGame.gameState.graph.selectedNodeIds).toEqual([
      result.node.id
    ]);
    expect(loadResult.saveGame.gameState.resources.balances.money).toBe(150);
  });
});

function withMoney(state: GameState, money: number): GameState {
  return {
    ...state,
    resources: {
      ...state.resources,
      balances: {
        ...state.resources.balances,
        money
      }
    }
  };
}
