import type { NodeDefinition, NodeDefinitionId } from "../state/types";

export const FIRST_SIX_NODE_DEFINITION_IDS = [
  "internet_feed",
  "parser",
  "cleaner",
  "upload_gateway",
  "cpu_rack",
  "research_lab"
] as const;

export type FirstSixNodeDefinitionId =
  (typeof FIRST_SIX_NODE_DEFINITION_IDS)[number];

export const firstSixNodeDefinitions = [
  {
    id: "internet_feed",
    name: "Internet Feed",
    category: "data_source",
    description:
      "Produces raw data from public data streams. The first source node in the game.",
    baseCost: 0,
    costGrowth: 1.18,
    inputs: [],
    outputs: [
      {
        id: "raw_out",
        direction: "output",
        resourceType: "rawData",
        throughput: 10
      }
    ],
    baseStats: {
      produces: { rawData: 10 },
      consumes: {},
      computeProduced: 0,
      computeUsed: 0,
      powerUse: 1,
      heatOutput: 0.5,
      storageCapacity: 0
    },
    upgradeScaling: {
      throughputMultiplierPerLevel: 1.16,
      powerUseMultiplierPerLevel: 1.04
    },
    unlockRequirements: []
  },
  {
    id: "parser",
    name: "Parser",
    category: "processing",
    description:
      "Turns raw data into parsed data that can be cleaned, compressed, routed, or researched.",
    baseCost: 50,
    costGrowth: 1.22,
    inputs: [
      {
        id: "raw_in",
        direction: "input",
        resourceType: "rawData",
        throughput: 8
      }
    ],
    outputs: [
      {
        id: "parsed_out",
        direction: "output",
        resourceType: "parsedData",
        throughput: 8
      }
    ],
    baseStats: {
      produces: { parsedData: 8 },
      consumes: { rawData: 8, compute: 2 },
      computeProduced: 0,
      computeUsed: 2,
      powerUse: 2,
      heatOutput: 1,
      storageCapacity: 20
    },
    upgradeScaling: {
      throughputMultiplierPerLevel: 1.18,
      computeUseMultiplierPerLevel: 1.06,
      powerUseMultiplierPerLevel: 1.05
    },
    unlockRequirements: []
  },
  {
    id: "cleaner",
    name: "Cleaner",
    category: "processing",
    description:
      "Cleans parsed data and reduces errors. Contract and AI systems rely on clean data.",
    baseCost: 100,
    costGrowth: 1.25,
    inputs: [
      {
        id: "parsed_in",
        direction: "input",
        resourceType: "parsedData",
        throughput: 6
      }
    ],
    outputs: [
      {
        id: "clean_out",
        direction: "output",
        resourceType: "cleanData",
        throughput: 5.5
      }
    ],
    baseStats: {
      produces: { cleanData: 5.5 },
      consumes: { parsedData: 6, compute: 3 },
      computeProduced: 0,
      computeUsed: 3,
      powerUse: 3,
      heatOutput: 1.5,
      storageCapacity: 20,
      qualityBonus: 10,
      errorReduction: 0.08
    },
    upgradeScaling: {
      throughputMultiplierPerLevel: 1.17,
      qualityBonusPerLevel: 3,
      computeUseMultiplierPerLevel: 1.05,
      powerUseMultiplierPerLevel: 1.05
    },
    unlockRequirements: []
  },
  {
    id: "upload_gateway",
    name: "Upload Gateway",
    category: "output",
    description:
      "Sells clean data as upload revenue. The first money-making output node.",
    baseCost: 150,
    costGrowth: 1.24,
    inputs: [
      {
        id: "clean_in",
        direction: "input",
        resourceType: "cleanData",
        throughput: 5
      }
    ],
    outputs: [
      {
        id: "money_out",
        direction: "output",
        resourceType: "money",
        throughput: 50
      }
    ],
    baseStats: {
      produces: { money: 50 },
      consumes: { cleanData: 5 },
      computeProduced: 0,
      computeUsed: 0,
      powerUse: 2,
      heatOutput: 1,
      storageCapacity: 10,
      valuePerCleanData: 10
    },
    upgradeScaling: {
      throughputMultiplierPerLevel: 1.2,
      valueMultiplierPerLevel: 1.08,
      powerUseMultiplierPerLevel: 1.04
    },
    unlockRequirements: []
  },
  {
    id: "cpu_rack",
    name: "CPU Rack",
    category: "infrastructure",
    description:
      "Provides compute capacity for processing, research, cyber operations, and later cloud rental.",
    baseCost: 200,
    costGrowth: 1.28,
    inputs: [],
    outputs: [
      {
        id: "compute_out",
        direction: "output",
        resourceType: "compute",
        throughput: 10
      }
    ],
    baseStats: {
      produces: { compute: 10 },
      consumes: {},
      computeProduced: 10,
      computeUsed: 0,
      powerUse: 5,
      heatOutput: 4,
      storageCapacity: 0
    },
    upgradeScaling: {
      computeProducedMultiplierPerLevel: 1.2,
      powerUseMultiplierPerLevel: 1.07,
      heatOutputMultiplierPerLevel: 1.08
    },
    unlockRequirements: []
  },
  {
    id: "research_lab",
    name: "Research Lab",
    category: "research",
    description:
      "Consumes clean data and compute to produce research points for unlocking new technologies.",
    baseCost: 500,
    costGrowth: 1.3,
    inputs: [
      {
        id: "clean_in",
        direction: "input",
        resourceType: "cleanData",
        throughput: 2
      },
      {
        id: "compute_in",
        direction: "input",
        resourceType: "compute",
        throughput: 1
      }
    ],
    outputs: [
      {
        id: "research_out",
        direction: "output",
        resourceType: "research",
        throughput: 1
      }
    ],
    baseStats: {
      produces: { research: 1 },
      consumes: { cleanData: 2, compute: 1 },
      computeProduced: 0,
      computeUsed: 1,
      powerUse: 3,
      heatOutput: 1,
      storageCapacity: 20
    },
    upgradeScaling: {
      throughputMultiplierPerLevel: 1.16,
      researchMultiplierPerLevel: 1.12,
      powerUseMultiplierPerLevel: 1.05
    },
    unlockRequirements: [{ type: "moneyEarned", amount: 1000 }]
  }
] as const satisfies readonly NodeDefinition[];

export const nodeDefinitions = firstSixNodeDefinitions;

export const nodeDefinitionsById = Object.freeze(
  Object.fromEntries(
    nodeDefinitions.map((definition) => [definition.id, definition])
  ) as Record<NodeDefinitionId, NodeDefinition>
);
