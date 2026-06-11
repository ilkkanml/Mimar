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

export type ResourceId = (typeof RESOURCE_IDS)[number];
export type M1ResourceId = (typeof M1_RESOURCE_IDS)[number];
export type NodeCategory = (typeof NODE_CATEGORIES)[number];
export type PortDirection = (typeof PORT_DIRECTIONS)[number];

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
  heatOutput: number;
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
  heatOutputMultiplierPerLevel?: number;
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
  purchasedResearchIds: ResearchId[];
  availableResearchIds: ResearchId[];
  queuedResearchId?: ResearchId;
};

export type ActiveContract = {
  definitionId: ContractDefinitionId;
  acceptedAt: string;
  progress: ResourceMap;
  status: "active" | "completed" | "failed";
};

export type ContractState = {
  active: ActiveContract[];
  completedIds: ContractDefinitionId[];
  failedIds: ContractDefinitionId[];
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
