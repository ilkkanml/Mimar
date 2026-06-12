export const RESOURCE_IDS = [
  "money",
  "rawData",
  "parsedData",
  "cleanData",
  "compute",
  "research",
  "power",
  "heat",
  "gpu",
  "bandwidth",
  "storage",
  "reputation",
  "trust",
  "trace",
  "byteCoin",
  "hashLite"
] as const;

export const M1_RESOURCE_IDS = [
  "money",
  "rawData",
  "parsedData",
  "cleanData",
  "compute",
  "research"
] as const;

export const NODE_CATEGORIES = [
  "data_source",
  "processing",
  "routing",
  "output",
  "infrastructure",
  "research",
  "crypto",
  "cyber_ops",
  "ai",
  "security",
  "automation",
  "energy"
] as const;

export const PORT_DIRECTIONS = ["input", "output"] as const;
export const CONTRACT_REQUIREMENT_TYPES = [
  "produce_resource",
  "earn_money"
] as const;
export const CONTRACT_STATUSES = [
  "available",
  "active",
  "completed",
  "claimed"
] as const;
export const RESEARCH_STATUSES = ["locked", "available", "unlocked"] as const;
export const RESEARCH_EFFECT_TYPES = [
  "node_throughput_multiplier",
  "node_compute_use_multiplier",
  "node_power_use_multiplier",
  "node_heat_output_multiplier",
  "node_output_multiplier",
  "global_power_capacity_add",
  "global_heat_capacity_add"
] as const;

export type ResourceId = (typeof RESOURCE_IDS)[number];
export type M1ResourceId = (typeof M1_RESOURCE_IDS)[number];
export type NodeCategory = (typeof NODE_CATEGORIES)[number];
export type PortDirection = (typeof PORT_DIRECTIONS)[number];
export type ContractRequirementType =
  (typeof CONTRACT_REQUIREMENT_TYPES)[number];
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];
export type ResearchStatus = (typeof RESEARCH_STATUSES)[number];
export type ResearchEffectType = (typeof RESEARCH_EFFECT_TYPES)[number];

export type GameSchemaVersion = 0;
export type NodeId = string;
export type EdgeId = string;
export type NodeDefinitionId = string;
export type PortId = string;
export type ResearchId = string;
export type ContractDefinitionId = string;

export type ResourceMap = Partial<Record<ResourceId, number>>;
export type FullResourceMap = Record<ResourceId, number>;

export type Vec2 = {
  x: number;
  y: number;
};

export type PortDefinition = {
  id: PortId;
  direction: PortDirection;
  resourceType: ResourceId;
  throughput: number;
  maxConnections?: number;
};

export type NodeStats = {
  produces: ResourceMap;
  consumes: ResourceMap;
  computeProduced: number;
  computeUsed: number;
  powerUse: number;
  powerCapacity?: number;
  heatOutput: number;
  coolingCapacity?: number;
  storageCapacity: number;
  qualityBonus?: number;
  errorReduction?: number;
  valuePerCleanData?: number;
};

export type NodeUpgradeScaling = {
  throughputMultiplierPerLevel?: number;
  computeProducedMultiplierPerLevel?: number;
  computeUseMultiplierPerLevel?: number;
  powerUseMultiplierPerLevel?: number;
  powerCapacityMultiplierPerLevel?: number;
  heatOutputMultiplierPerLevel?: number;
  coolingCapacityMultiplierPerLevel?: number;
  qualityBonusPerLevel?: number;
  researchMultiplierPerLevel?: number;
  valueMultiplierPerLevel?: number;
};

export type UnlockRequirement =
  | {
      type: "moneyEarned";
      amount: number;
    }
  | {
      type: "researchPurchased";
      id: ResearchId;
    };

export type NodeDefinition = {
  id: NodeDefinitionId;
  name: string;
  category: NodeCategory;
  description: string;
  baseCost: number;
  costGrowth: number;
  inputs: readonly PortDefinition[];
  outputs: readonly PortDefinition[];
  baseStats: NodeStats;
  upgradeScaling: NodeUpgradeScaling;
  unlockRequirements: readonly UnlockRequirement[];
};

export type BottleneckReason =
  | "input_starved"
  | "output_blocked"
  | "compute_limited"
  | "power_limited"
  | "heat_throttled"
  | "storage_full"
  | "network_limited";

export type NodeStatus =
  | "idle"
  | "running"
  | "contract_mismatch"
  | "security_locked"
  | BottleneckReason;

export type NodeRuntimeStats = {
  inputRate: ResourceMap;
  outputRate: ResourceMap;
  utilization: number;
  effectiveThroughput: number;
  bottleneckReason?: BottleneckReason;
};

export type NodeInstance = {
  id: NodeId;
  definitionId: NodeDefinitionId;
  position: Vec2;
  level: number;
  enabled: boolean;
  inputBuffers: ResourceMap;
  outputBuffers: ResourceMap;
  status: NodeStatus;
  runtime: NodeRuntimeStats;
};

export type EdgeInstance = {
  id: EdgeId;
  fromNodeId: NodeId;
  fromPortId: PortId;
  toNodeId: NodeId;
  toPortId: PortId;
  throughputLimit: number;
  resourceType: ResourceId;
};

export type GraphState = {
  nodes: Record<NodeId, NodeInstance>;
  edges: Record<EdgeId, EdgeInstance>;
  selectedNodeIds: NodeId[];
  selectedEdgeIds: EdgeId[];
};

export type ResourceState = {
  balances: FullResourceMap;
  rates: FullResourceMap;
  capacities: FullResourceMap;
  usage: FullResourceMap;
};

export type GameMetaState = {
  createdAt: string;
  lastTickAt: string;
  totalPlayTimeSeconds: number;
  companyName: string;
  seed: number;
};

export type ResearchState = {
  availableResearchIds: ResearchId[];
  unlockedResearchIds: ResearchId[];
  spentResearchPoints: number;
};

export type ResearchDefinition = {
  id: ResearchId;
  title: string;
  description: string;
  costResearch: number;
  prerequisiteResearchIds: readonly ResearchId[];
  effectType: ResearchEffectType;
  effectValue: number;
  targetNodeDefinitionId?: NodeDefinitionId;
  targetResourceId?: ResourceId;
};

export type ContractDefinition = {
  id: ContractDefinitionId;
  title: string;
  description: string;
  requirementType: ContractRequirementType;
  requirementResourceId?: ResourceId;
  requiredAmount: number;
  rewardMoney: number;
  rewardResearch?: number;
};

export type ContractRuntimeState = {
  id: ContractDefinitionId;
  currentProgress: number;
  status: ContractStatus;
};

export type ContractState = {
  available: ContractRuntimeState[];
  active: ContractRuntimeState[];
  completed: ContractRuntimeState[];
  claimed: ContractRuntimeState[];
};

export type EmptySideOperationModuleState = Record<string, never>;

export type SideOperationState = {
  crypto: EmptySideOperationModuleState;
  cyber: EmptySideOperationModuleState;
  cloudRental: EmptySideOperationModuleState;
  aiApi: EmptySideOperationModuleState;
};

export type GameSettings = {
  autosaveEnabled: boolean;
  reducedMotion: boolean;
  uiScale: number;
};

export type GameState = {
  schemaVersion: GameSchemaVersion;
  meta: GameMetaState;
  graph: GraphState;
  resources: ResourceState;
  research: ResearchState;
  contracts: ContractState;
  sideOps: SideOperationState;
  settings: GameSettings;
};
