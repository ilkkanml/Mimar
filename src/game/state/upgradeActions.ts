import {
  calculateMaxAffordableUpgrade,
  calculateNextUpgradeCost,
  hasNodeUpgradeScaling,
  normalizeNodeLevel
} from "../simulation/upgrades";

import type {
  GameState,
  NodeDefinition,
  NodeDefinitionId,
  NodeId
} from "./types";

export type UpgradeNodeFailureReason =
  | "no_selected_node"
  | "missing_node"
  | "missing_definition"
  | "not_upgradeable"
  | "insufficient_money";

export type UpgradeNodeResult =
  | {
      ok: true;
      state: GameState;
      nodeId: NodeId;
      previousLevel: number;
      level: number;
      upgradesPurchased: number;
      totalCost: number;
    }
  | {
      ok: false;
      state: GameState;
      reason: UpgradeNodeFailureReason;
    };

export function upgradeSelectedNodeOnce(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): UpgradeNodeResult {
  const nodeId = state.graph.selectedNodeIds[0];

  return nodeId === undefined
    ? { ok: false, state, reason: "no_selected_node" }
    : upgradeNodeOnce(state, nodeDefinitionsById, nodeId);
}

export function upgradeSelectedNodeMax(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): UpgradeNodeResult {
  const nodeId = state.graph.selectedNodeIds[0];

  return nodeId === undefined
    ? { ok: false, state, reason: "no_selected_node" }
    : upgradeNodeMax(state, nodeDefinitionsById, nodeId);
}

export function upgradeNodeOnce(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  nodeId: NodeId
): UpgradeNodeResult {
  const node = state.graph.nodes[nodeId];

  if (node === undefined) {
    return { ok: false, state, reason: "missing_node" };
  }

  const definition = nodeDefinitionsById[node.definitionId];

  if (definition === undefined) {
    return { ok: false, state, reason: "missing_definition" };
  }

  if (!hasNodeUpgradeScaling(definition)) {
    return { ok: false, state, reason: "not_upgradeable" };
  }

  const previousLevel = normalizeNodeLevel(node.level);
  const upgradeCost = calculateNextUpgradeCost(definition, previousLevel);

  if (state.resources.balances.money < upgradeCost) {
    return { ok: false, state, reason: "insufficient_money" };
  }

  return applyUpgradePurchase(state, nodeId, previousLevel, 1, upgradeCost);
}

export function upgradeNodeMax(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  nodeId: NodeId
): UpgradeNodeResult {
  const node = state.graph.nodes[nodeId];

  if (node === undefined) {
    return { ok: false, state, reason: "missing_node" };
  }

  const definition = nodeDefinitionsById[node.definitionId];

  if (definition === undefined) {
    return { ok: false, state, reason: "missing_definition" };
  }

  if (!hasNodeUpgradeScaling(definition)) {
    return { ok: false, state, reason: "not_upgradeable" };
  }

  const previousLevel = normalizeNodeLevel(node.level);
  const preview = calculateMaxAffordableUpgrade(
    definition,
    previousLevel,
    state.resources.balances.money
  );

  if (preview.upgradeCount <= 0) {
    return { ok: false, state, reason: "insufficient_money" };
  }

  return applyUpgradePurchase(
    state,
    nodeId,
    previousLevel,
    preview.upgradeCount,
    preview.totalCost
  );
}

function applyUpgradePurchase(
  state: GameState,
  nodeId: NodeId,
  previousLevel: number,
  upgradesPurchased: number,
  totalCost: number
): UpgradeNodeResult {
  const node = state.graph.nodes[nodeId];

  if (node === undefined) {
    return { ok: false, state, reason: "missing_node" };
  }

  const level = previousLevel + upgradesPurchased;

  return {
    ok: true,
    state: {
      ...state,
      graph: {
        ...state.graph,
        nodes: {
          ...state.graph.nodes,
          [nodeId]: {
            ...node,
            level
          }
        }
      },
      resources: {
        ...state.resources,
        balances: {
          ...state.resources.balances,
          money: Math.max(0, state.resources.balances.money - totalCost)
        }
      }
    },
    nodeId,
    previousLevel,
    level,
    upgradesPurchased,
    totalCost
  };
}
