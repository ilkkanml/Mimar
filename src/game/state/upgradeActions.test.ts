import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { addNode, selectNode } from "./actions";
import { createInitialGameState } from "./initialState";
import {
  upgradeNodeMax,
  upgradeNodeOnce,
  upgradeSelectedNodeMax,
  upgradeSelectedNodeOnce
} from "./upgradeActions";

import type { GameState } from "./types";

describe("node upgrade actions", () => {
  it("upgrades a selected node once and subtracts the next cost", () => {
    const graph = createStateWithNode("parser", 100);
    const selectedState = selectNode(graph.state, { nodeId: graph.nodeId });

    const result = upgradeSelectedNodeOnce(selectedState, nodeDefinitionsById);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.level).toBe(2);
    expect(result.totalCost).toBe(61);
    expect(result.state.graph.nodes[graph.nodeId]?.level).toBe(2);
    expect(result.state.resources.balances.money).toBe(39);
  });

  it("does not upgrade when money is insufficient", () => {
    const graph = createStateWithNode("parser", 60);

    const result = upgradeNodeOnce(
      graph.state,
      nodeDefinitionsById,
      graph.nodeId
    );

    expect(result).toEqual({
      ok: false,
      state: graph.state,
      reason: "insufficient_money"
    });
    expect(graph.state.graph.nodes[graph.nodeId]?.level).toBe(1);
  });

  it("buys the max affordable levels without overspending", () => {
    const graph = createStateWithNode("parser", 140);

    const result = upgradeNodeMax(graph.state, nodeDefinitionsById, graph.nodeId);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.upgradesPurchased).toBe(2);
    expect(result.level).toBe(3);
    expect(result.totalCost).toBe(136);
    expect(result.state.resources.balances.money).toBe(4);
    expect(result.state.graph.nodes[graph.nodeId]?.level).toBe(3);
  });

  it("reports no selected node for selected-node buy max", () => {
    const state = createInitialGameState("2026-06-12T00:00:00.000Z");

    const result = upgradeSelectedNodeMax(state, nodeDefinitionsById);

    expect(result).toEqual({
      ok: false,
      state,
      reason: "no_selected_node"
    });
  });
});

function createStateWithNode(
  definitionId: "parser" | "upload_gateway",
  money: number
): {
  state: GameState;
  nodeId: string;
} {
  const initialState = createInitialGameState("2026-06-12T00:00:00.000Z");
  const addResult = addNode(initialState, {
    definitionId,
    position: { x: 0, y: 0 }
  });

  return {
    state: {
      ...addResult.state,
      resources: {
        ...addResult.state.resources,
        balances: {
          ...addResult.state.resources.balances,
          money
        }
      }
    },
    nodeId: addResult.value.id
  };
}
