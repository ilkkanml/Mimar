import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { tickGameState } from "../simulation/tick";
import { createGameHistoryState, redo, undo, pushHistory } from "./history";
import { createInitialGameState } from "./initialState";
import {
  getNextNodePlacementPosition,
  getNodePlacementCost,
  placeNode
} from "./nodePlacement";

import type { GameState } from "./types";

describe("node placement", () => {
  it("places a valid free node with a unique id and selects it", () => {
    const initialState = createInitialGameState("2026-06-16T00:00:00.000Z");

    const first = placeNode(initialState, nodeDefinitionsById, {
      definitionId: "internet_feed",
      position: { x: 10, y: 20 }
    });
    expect(first.ok).toBe(true);
    if (!first.ok) {
      return;
    }

    const second = placeNode(first.state, nodeDefinitionsById, {
      definitionId: "internet_feed",
      position: { x: 30, y: 40 }
    });

    expect(second.ok).toBe(true);
    if (!second.ok) {
      return;
    }

    expect(first.node.id).not.toBe(second.node.id);
    expect(second.state.graph.nodes[first.node.id]).toMatchObject({
      definitionId: "internet_feed",
      level: 1,
      enabled: true,
      position: { x: 10, y: 20 }
    });
    expect(second.state.graph.selectedNodeIds).toEqual([second.node.id]);
  });

  it("rejects paid node placement when money is insufficient", () => {
    const initialState = createInitialGameState("2026-06-16T00:00:00.000Z");

    const result = placeNode(initialState, nodeDefinitionsById, {
      definitionId: "parser",
      position: { x: 100, y: 100 }
    });

    expect(result).toEqual({
      ok: false,
      state: initialState,
      reason: "insufficient_money",
      cost: getNodePlacementCost(nodeDefinitionsById.parser)
    });
  });

  it("deducts node placement cost for paid nodes", () => {
    const fundedState = withMoney(
      createInitialGameState("2026-06-16T00:00:00.000Z"),
      80
    );

    const result = placeNode(fundedState, nodeDefinitionsById, {
      definitionId: "parser",
      position: { x: 100, y: 100 }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.cost).toBe(50);
    expect(result.state.resources.balances.money).toBe(30);
    expect(result.state.graph.nodes[result.node.id]).toMatchObject({
      definitionId: "parser",
      level: 1,
      inputBuffers: {},
      outputBuffers: {},
      status: "idle"
    });
  });

  it("returns a deterministic open placement position", () => {
    const initialState = createInitialGameState("2026-06-16T00:00:00.000Z");
    const first = placeNode(initialState, nodeDefinitionsById, {
      definitionId: "internet_feed",
      position: { x: 180, y: 360 }
    });

    expect(first.ok).toBe(true);
    if (!first.ok) {
      return;
    }

    expect(getNextNodePlacementPosition(first.state)).toEqual({
      x: 420,
      y: 360
    });
  });

  it("placed infrastructure nodes participate in simulation", () => {
    const fundedState = withMoney(
      createInitialGameState("2026-06-16T00:00:00.000Z"),
      200
    );
    const result = placeNode(fundedState, nodeDefinitionsById, {
      definitionId: "cpu_rack",
      position: { x: 200, y: 200 }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const tickedState = tickGameState(result.state, nodeDefinitionsById);

    expect(tickedState.resources.capacities.compute).toBe(10);
    expect(tickedState.graph.nodes[result.node.id]?.runtime.outputRate.compute).toBe(
      10
    );
  });

  it("node placement can be undone and redone through history", () => {
    const initialState = createInitialGameState("2026-06-16T00:00:00.000Z");
    const history = createGameHistoryState(initialState);
    const result = placeNode(initialState, nodeDefinitionsById, {
      definitionId: "internet_feed",
      position: { x: 10, y: 20 }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const placedHistory = pushHistory(history, result.state);
    const undoneHistory = undo(placedHistory);
    const redoneHistory = redo(undoneHistory);

    expect(Object.keys(undoneHistory.current.graph.nodes)).toEqual([]);
    expect(redoneHistory.current.graph.nodes[result.node.id]).toBeDefined();
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
