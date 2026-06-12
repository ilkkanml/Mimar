import { describe, expect, it } from "vitest";

import { contractDefinitionsById } from "../data/contracts";
import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { researchDefinitionsById } from "../data/research";
import { createSaveGame } from "../save/schema";
import { serializeSaveGame } from "../save/saveGame";
import { tickGameState } from "../simulation/tick";
import {
  addNode,
  connectNodesIfValid,
  deleteEdge,
  moveNode
} from "./actions";
import { claimContractReward } from "./contractActions";
import { createContractRuntimeState } from "./contracts";
import {
  createInitialGameState,
  createZeroResourceMap
} from "./initialState";
import { unlockResearch } from "./researchActions";
import { upgradeNodeMax, upgradeNodeOnce } from "./upgradeActions";
import {
  canRedo,
  canUndo,
  createGameHistoryState,
  pushHistory,
  redo,
  replaceHistoryCurrent,
  undo
} from "./history";

import type {
  ContractDefinitionId,
  GameState,
  NodeDefinitionId,
  NodeId
} from "./types";

describe("undo/redo history", () => {
  it("undoes and redoes a node move", () => {
    const graph = createStateWithNode("parser", { x: 0, y: 0 });
    const movedState = moveNode(graph.state, graph.nodeId, { x: 120, y: 80 });
    const history = pushHistory(createGameHistoryState(graph.state), movedState);
    const undone = undo(history);
    const redone = redo(undone);

    expect(canUndo(history)).toBe(true);
    expect(undone.current.graph.nodes[graph.nodeId]?.position).toEqual({
      x: 0,
      y: 0
    });
    expect(canRedo(undone)).toBe(true);
    expect(redone.current.graph.nodes[graph.nodeId]?.position).toEqual({
      x: 120,
      y: 80
    });
  });

  it("undoes and redoes edge creation", () => {
    const graph = createParserCleanerGraph();
    const connection = connectParserToCleaner(graph.state, graph);
    const history = pushHistory(
      createGameHistoryState(graph.state),
      connection.state
    );
    const undone = undo(history);
    const redone = redo(undone);

    expect(undone.current.graph.edges[connection.edgeId]).toBeUndefined();
    expect(redone.current.graph.edges[connection.edgeId]).toMatchObject({
      fromNodeId: graph.parserId,
      toNodeId: graph.cleanerId,
      resourceType: "parsedData"
    });
  });

  it("undoes edge deletion when an edge deletion action is used", () => {
    const graph = createParserCleanerGraph();
    const connection = connectParserToCleaner(graph.state, graph);
    const deletedState = deleteEdge(connection.state, connection.edgeId);
    const history = pushHistory(
      createGameHistoryState(connection.state),
      deletedState
    );
    const undone = undo(history);

    expect(history.current.graph.edges[connection.edgeId]).toBeUndefined();
    expect(undone.current.graph.edges[connection.edgeId]).toMatchObject({
      fromNodeId: graph.parserId,
      toNodeId: graph.cleanerId
    });
  });

  it("undoes and redoes a single node upgrade", () => {
    const graph = createFundedStateWithNode("parser", 100);
    const upgrade = upgradeNodeOnce(
      graph.state,
      nodeDefinitionsById,
      graph.nodeId
    );

    expect(upgrade.ok).toBe(true);
    if (!upgrade.ok) {
      return;
    }

    const history = pushHistory(
      createGameHistoryState(graph.state),
      upgrade.state
    );
    const undone = undo(history);
    const redone = redo(undone);

    expect(undone.current.graph.nodes[graph.nodeId]?.level).toBe(1);
    expect(undone.current.resources.balances.money).toBe(100);
    expect(redone.current.graph.nodes[graph.nodeId]?.level).toBe(2);
    expect(redone.current.resources.balances.money).toBe(39);
  });

  it("undoes buy max upgrades", () => {
    const graph = createFundedStateWithNode("parser", 140);
    const upgrade = upgradeNodeMax(graph.state, nodeDefinitionsById, graph.nodeId);

    expect(upgrade.ok).toBe(true);
    if (!upgrade.ok) {
      return;
    }

    const history = pushHistory(
      createGameHistoryState(graph.state),
      upgrade.state
    );
    const undone = undo(history);

    expect(upgrade.level).toBe(3);
    expect(undone.current.graph.nodes[graph.nodeId]?.level).toBe(1);
    expect(undone.current.resources.balances.money).toBe(140);
  });

  it("undoes and redoes research unlocks", () => {
    const state = withResourceBalance(
      createInitialGameState("2026-06-12T00:00:00.000Z"),
      "research",
      6
    );
    const unlock = unlockResearch(
      state,
      researchDefinitionsById,
      "parser_optimization"
    );

    expect(unlock.ok).toBe(true);
    if (!unlock.ok) {
      return;
    }

    const history = pushHistory(createGameHistoryState(state), unlock.state);
    const undone = undo(history);
    const redone = redo(undone);

    expect(undone.current.research.unlockedResearchIds).toEqual([]);
    expect(undone.current.resources.balances.research).toBe(6);
    expect(redone.current.research.unlockedResearchIds).toEqual([
      "parser_optimization"
    ]);
    expect(redone.current.resources.balances.research).toBe(1);
  });

  it("undoes and redoes contract claims", () => {
    const state = createCompletedContractState("clean_data_delivery");
    const claim = claimContractReward(
      state,
      contractDefinitionsById,
      "clean_data_delivery"
    );

    expect(claim.ok).toBe(true);
    if (!claim.ok) {
      return;
    }

    const history = pushHistory(createGameHistoryState(state), claim.state);
    const undone = undo(history);
    const redone = redo(undone);

    expect(undone.current.contracts.completed).toHaveLength(1);
    expect(undone.current.contracts.claimed).toEqual([]);
    expect(undone.current.resources.balances.money).toBe(0);
    expect(redone.current.contracts.completed).toEqual([]);
    expect(redone.current.contracts.claimed).toEqual([
      {
        id: "clean_data_delivery",
        currentProgress: 50,
        status: "claimed"
      }
    ]);
    expect(redone.current.resources.balances.money).toBe(250);
  });

  it("clears redo future when a new user action is pushed after undo", () => {
    const graph = createStateWithNode("parser", { x: 0, y: 0 });
    const firstMove = moveNode(graph.state, graph.nodeId, { x: 80, y: 0 });
    const history = pushHistory(createGameHistoryState(graph.state), firstMove);
    const undone = undo(history);
    const secondMove = moveNode(undone.current, graph.nodeId, { x: 160, y: 0 });
    const nextHistory = pushHistory(undone, secondMove);

    expect(canRedo(undone)).toBe(true);
    expect(canRedo(nextHistory)).toBe(false);
    expect(nextHistory.current.graph.nodes[graph.nodeId]?.position).toEqual({
      x: 160,
      y: 0
    });
  });

  it("enforces max history depth deterministically", () => {
    const graph = createStateWithNode("parser", { x: 0, y: 0 });
    let history = createGameHistoryState(graph.state, 2);

    history = pushHistory(
      history,
      moveNode(history.current, graph.nodeId, { x: 10, y: 0 })
    );
    history = pushHistory(
      history,
      moveNode(history.current, graph.nodeId, { x: 20, y: 0 })
    );
    history = pushHistory(
      history,
      moveNode(history.current, graph.nodeId, { x: 30, y: 0 })
    );

    const firstUndo = undo(history);
    const secondUndo = undo(firstUndo);
    const thirdUndo = undo(secondUndo);

    expect(history.past).toHaveLength(2);
    expect(firstUndo.current.graph.nodes[graph.nodeId]?.position.x).toBe(20);
    expect(secondUndo.current.graph.nodes[graph.nodeId]?.position.x).toBe(10);
    expect(thirdUndo.current.graph.nodes[graph.nodeId]?.position.x).toBe(10);
    expect(canUndo(thirdUndo)).toBe(false);
  });

  it("does not push simulation ticks into history", () => {
    const history = createGameHistoryState(
      createInitialGameState("2026-06-12T00:00:00.000Z")
    );
    const tickedState = tickGameState(history.current, nodeDefinitionsById);
    const nextHistory = replaceHistoryCurrent(history, tickedState);

    expect(nextHistory.past).toEqual([]);
    expect(nextHistory.future).toEqual([]);
    expect(nextHistory.current.meta.totalPlayTimeSeconds).toBeGreaterThan(0);
  });

  it("stores history stack snapshots without runtime tick noise", () => {
    const graph = createStateWithNode("internet_feed", { x: 0, y: 0 });
    const tickedState = tickGameState(graph.state, nodeDefinitionsById);
    const movedState = moveNode(tickedState, graph.nodeId, { x: 20, y: 20 });
    const history = pushHistory(
      createGameHistoryState(tickedState),
      movedState
    );
    const pastNode = history.past[0]?.graph.nodes[graph.nodeId];

    expect(history.past[0]?.resources.rates).toEqual(createZeroResourceMap());
    expect(history.past[0]?.resources.capacities).toEqual(
      createZeroResourceMap()
    );
    expect(pastNode?.status).toBe("idle");
    expect(pastNode?.runtime.effectiveThroughput).toBe(0);
  });

  it("keeps undo/redo stacks outside save payloads", () => {
    const graph = createStateWithNode("parser", { x: 0, y: 0 });
    const movedState = moveNode(graph.state, graph.nodeId, { x: 120, y: 80 });
    const history = pushHistory(createGameHistoryState(graph.state), movedState);
    const serializedSave = serializeSaveGame(
      createSaveGame(history.current, "2026-06-12T12:00:00.000Z")
    );

    expect(serializedSave).not.toContain('"past"');
    expect(serializedSave).not.toContain('"future"');
    expect(serializedSave).not.toContain('"maxDepth"');
  });
});

function createStateWithNode(
  definitionId: NodeDefinitionId,
  position: { x: number; y: number }
): {
  state: GameState;
  nodeId: NodeId;
} {
  const state = createInitialGameState("2026-06-12T00:00:00.000Z");
  const addResult = addNode(state, {
    definitionId,
    position
  });

  return {
    state: addResult.state,
    nodeId: addResult.value.id
  };
}

function createFundedStateWithNode(
  definitionId: "parser",
  money: number
): {
  state: GameState;
  nodeId: NodeId;
} {
  const graph = createStateWithNode(definitionId, { x: 0, y: 0 });

  return {
    state: withResourceBalance(graph.state, "money", money),
    nodeId: graph.nodeId
  };
}

function createParserCleanerGraph(): {
  state: GameState;
  parserId: NodeId;
  cleanerId: NodeId;
} {
  let state = createInitialGameState("2026-06-12T00:00:00.000Z");
  const parser = addNode(state, {
    definitionId: "parser",
    position: { x: 0, y: 0 }
  });
  state = parser.state;
  const cleaner = addNode(state, {
    definitionId: "cleaner",
    position: { x: 200, y: 0 }
  });

  return {
    state: cleaner.state,
    parserId: parser.value.id,
    cleanerId: cleaner.value.id
  };
}

function connectParserToCleaner(
  state: GameState,
  graph: {
    parserId: NodeId;
    cleanerId: NodeId;
  }
): {
  state: GameState;
  edgeId: string;
} {
  const connection = connectNodesIfValid(state, nodeDefinitionsById, {
    fromNodeId: graph.parserId,
    fromPortId: "parsed_out",
    toNodeId: graph.cleanerId,
    toPortId: "parsed_in"
  });

  if (!connection.validation.ok) {
    throw new Error(`Expected valid connection, got ${connection.validation.reason}`);
  }

  if (connection.edge === undefined) {
    throw new Error("Expected valid connection to create an edge.");
  }

  return {
    state: connection.state,
    edgeId: connection.edge.id
  };
}

function createCompletedContractState(id: ContractDefinitionId): GameState {
  const state = createInitialGameState("2026-06-12T00:00:00.000Z");
  const definition = contractDefinitionsById[id];

  if (definition === undefined) {
    throw new Error(`Missing contract definition ${id}.`);
  }

  return {
    ...state,
    contracts: {
      available: state.contracts.available.filter(
        (contract) => contract.id !== id
      ),
      active: state.contracts.active.filter((contract) => contract.id !== id),
      completed: [
        createContractRuntimeState(id, "completed", definition.requiredAmount)
      ],
      claimed: []
    }
  };
}

function withResourceBalance(
  state: GameState,
  resourceId: "money" | "research",
  value: number
): GameState {
  return {
    ...state,
    resources: {
      ...state.resources,
      balances: {
        ...state.resources.balances,
        [resourceId]: value
      }
    }
  };
}
