import { RESOURCE_IDS } from "./types";

import type {
  FullResourceMap,
  GameSchemaVersion,
  GameState,
  ResourceState
} from "./types";

export const GAME_SCHEMA_VERSION: GameSchemaVersion = 0;

export function createZeroResourceMap(): FullResourceMap {
  return Object.fromEntries(
    RESOURCE_IDS.map((resourceId) => [resourceId, 0])
  ) as FullResourceMap;
}

export function createInitialResourceState(): ResourceState {
  return {
    balances: createZeroResourceMap(),
    rates: createZeroResourceMap(),
    capacities: createZeroResourceMap(),
    usage: createZeroResourceMap()
  };
}

export function createInitialGameState(
  timestamp = new Date().toISOString()
): GameState {
  return {
    schemaVersion: GAME_SCHEMA_VERSION,
    meta: {
      createdAt: timestamp,
      lastTickAt: timestamp,
      totalPlayTimeSeconds: 0,
      companyName: "Mimar Labs",
      seed: 0
    },
    graph: {
      nodes: {},
      edges: {},
      selectedNodeIds: [],
      selectedEdgeIds: []
    },
    resources: createInitialResourceState(),
    research: {
      purchasedResearchIds: [],
      availableResearchIds: []
    },
    contracts: {
      active: [],
      completedIds: [],
      failedIds: []
    },
    sideOps: {
      crypto: {},
      cyber: {},
      cloudRental: {},
      aiApi: {}
    },
    settings: {
      autosaveEnabled: true,
      reducedMotion: false,
      uiScale: 1
    }
  };
}
