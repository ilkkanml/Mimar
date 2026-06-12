import {
  createInitialResourceState,
  createZeroResourceMap,
  GAME_SCHEMA_VERSION
} from "../state/initialState";
import { normalizeContractState } from "../state/contracts";
import { normalizeResearchState } from "../state/research";

import type {
  ContractState,
  GameSchemaVersion,
  GameSettings,
  GameState,
  GraphState,
  NodeInstance,
  NodeRuntimeStats,
  ResearchState,
  ResourceMap,
  SideOperationState
} from "../state/types";

export const SAVE_SCHEMA_VERSION: GameSchemaVersion = GAME_SCHEMA_VERSION;
export const SAVE_GAME_VERSION = "0.1.0-dev";
export const DEFAULT_SAVE_SLOT_KEY = "mimar.save.v0";

export type SaveGame = {
  schemaVersion: GameSchemaVersion;
  savedAt: string;
  gameVersion: string;
  gameState: GameState;
};

export function createNodeRuntimeStats(): NodeRuntimeStats {
  return {
    inputRate: {},
    outputRate: {},
    utilization: 0,
    effectiveThroughput: 0
  };
}

export function normalizeGameStateForSave(state: GameState): GameState {
  const transientResources = createInitialResourceState();

  return {
    ...state,
    schemaVersion: SAVE_SCHEMA_VERSION,
    meta: {
      ...state.meta
    },
    graph: normalizeGraphForSave(state.graph),
    resources: {
      balances: { ...state.resources.balances },
      rates: transientResources.rates,
      capacities: transientResources.capacities,
      usage: transientResources.usage
    },
    research: normalizeResearch(state.research),
    contracts: normalizeContracts(state.contracts),
    sideOps: normalizeSideOps(state.sideOps),
    settings: normalizeSettings(state.settings)
  };
}

export function createSaveGame(
  state: GameState,
  savedAt: string,
  gameVersion = SAVE_GAME_VERSION
): SaveGame {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    savedAt,
    gameVersion,
    gameState: normalizeGameStateForSave(state)
  };
}

export function isSaveGame(value: unknown): value is SaveGame {
  if (!isRecord(value)) {
    return false;
  }

  const gameState = value.gameState;

  return (
    value.schemaVersion === SAVE_SCHEMA_VERSION &&
    typeof value.savedAt === "string" &&
    typeof value.gameVersion === "string" &&
    isRecord(gameState) &&
    gameState.schemaVersion === SAVE_SCHEMA_VERSION &&
    isRecord(gameState.meta) &&
    isRecord(gameState.graph) &&
    isRecord(gameState.resources) &&
    isRecord(gameState.research) &&
    isRecord(gameState.contracts) &&
    isRecord(gameState.sideOps) &&
    isRecord(gameState.settings) &&
    isRecord(gameState.graph.nodes) &&
    isRecord(gameState.graph.edges) &&
    isRecord(gameState.resources.balances)
  );
}

export function hydrateLoadedGameState(state: GameState): GameState {
  return normalizeGameStateForSave({
    ...state,
    resources: {
      balances: {
        ...createZeroResourceMap(),
        ...state.resources.balances
      },
      rates: createZeroResourceMap(),
      capacities: createZeroResourceMap(),
      usage: createZeroResourceMap()
    }
  });
}

function normalizeGraphForSave(graph: GraphState): GraphState {
  return {
    nodes: Object.fromEntries(
      Object.entries(graph.nodes).map(([nodeId, node]) => [
        nodeId,
        normalizeNodeForSave(node)
      ])
    ),
    edges: Object.fromEntries(
      Object.entries(graph.edges).map(([edgeId, edge]) => [
        edgeId,
        {
          ...edge
        }
      ])
    ),
    selectedNodeIds: [...graph.selectedNodeIds],
    selectedEdgeIds: [...graph.selectedEdgeIds]
  };
}

function normalizeNodeForSave(node: NodeInstance): NodeInstance {
  return {
    ...node,
    position: { ...node.position },
    inputBuffers: cloneResourceMap(node.inputBuffers),
    outputBuffers: cloneResourceMap(node.outputBuffers),
    status: "idle",
    runtime: createNodeRuntimeStats()
  };
}

function normalizeResearch(research: ResearchState): ResearchState {
  return normalizeResearchState(research);
}

function normalizeContracts(contracts: ContractState): ContractState {
  return normalizeContractState(contracts);
}

function normalizeSideOps(sideOps: SideOperationState): SideOperationState {
  return {
    crypto: { ...sideOps.crypto },
    cyber: { ...sideOps.cyber },
    cloudRental: { ...sideOps.cloudRental },
    aiApi: { ...sideOps.aiApi }
  };
}

function normalizeSettings(settings: GameSettings): GameSettings {
  return {
    ...settings
  };
}

function cloneResourceMap(resourceMap: ResourceMap): ResourceMap {
  return {
    ...resourceMap
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
