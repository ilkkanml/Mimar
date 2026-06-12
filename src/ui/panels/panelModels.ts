import type {
  BottleneckReason,
  ContractDefinition,
  ContractDefinitionId,
  ContractRuntimeState,
  ContractStatus,
  GameState,
  NodeDefinition,
  NodeDefinitionId,
  NodeId,
  NodeInstance,
  NodeStatus,
  ResearchDefinition,
  ResearchId,
  ResearchStatus,
  ResourceId,
  ResourceMap
} from "../../game/state/types";
import { researchDefinitionsById } from "../../game/data/research";
import { applyResearchEffectsToNodeDefinitions } from "../../game/simulation/researchEffects";
import {
  applyNodeUpgradeScaling,
  calculateMaxAffordableUpgrade,
  calculateNextUpgradeCost,
  hasNodeUpgradeScaling
} from "../../game/simulation/upgrades";

export type ResourceMetricModel = {
  resourceId: ResourceId;
  label: string;
  value: number;
  rate: number;
};

export type ComputeMetricModel = {
  used: number;
  capacity: number;
  warning: boolean;
};

export type LoadMetricModel = {
  resourceId: "power" | "heat";
  label: string;
  used: number;
  capacity: number;
  pressurePercent: number;
  warning: boolean;
  critical: boolean;
};

export type BottleneckSummaryModel = {
  nodeId: NodeId;
  nodeName: string;
  reason: BottleneckReason;
  reasonLabel: string;
  summary: string;
  recommendedAction: string;
};

export type ResourceBarModel = {
  money: ResourceMetricModel;
  data: ResourceMetricModel[];
  research: ResourceMetricModel;
  compute: ComputeMetricModel;
  power: LoadMetricModel;
  heat: LoadMetricModel;
  warning?: BottleneckSummaryModel;
};

export type FlowRateModel = {
  resourceId: ResourceId;
  label: string;
  currentRate: number;
  configuredRate: number;
};

export type InspectorComputeModel = {
  used: number;
  requested: number;
  provided: number;
};

export type InspectorLoadModel = {
  powerUse: number;
  heatOutput: number;
};

export type UpgradePreviewModel = {
  currentLevel: number;
  nextLevel: number;
  nextCost: number;
  currentMoney: number;
  canUpgrade: boolean;
  buyMaxLevel: number;
  buyMaxCost: number;
  buyMaxCount: number;
  canBuyMax: boolean;
  effectLabel: string;
};

export type NodeTooltipStatusTone = "neutral" | "good" | "warning";

export type NodeTooltipUpgradeModel = {
  currentLevel: number;
  nextLevel: number;
  nextCost: number;
  canUpgrade: boolean;
  effectLabel: string;
};

export type NodeTooltipModel = {
  nodeId: NodeId;
  name: string;
  categoryLabel: string;
  level: number;
  status: NodeStatus;
  statusLabel: string;
  statusTone: NodeTooltipStatusTone;
  throughputPercent: number;
  throughputLabel: string;
  inputs: FlowRateModel[];
  outputs: FlowRateModel[];
  compute?: InspectorComputeModel;
  load?: InspectorLoadModel;
  upgrade?: NodeTooltipUpgradeModel;
  bottleneck?: BottleneckSummaryModel;
};

export type NodeInspectorModel = {
  kind: "node";
  nodeId: NodeId;
  name: string;
  categoryLabel: string;
  level: number;
  status: NodeStatus;
  statusLabel: string;
  description: string;
  inputs: FlowRateModel[];
  outputs: FlowRateModel[];
  throughputPercent: number;
  compute?: InspectorComputeModel;
  load?: InspectorLoadModel;
  upgrade?: UpgradePreviewModel;
  bottleneck?: BottleneckSummaryModel;
  recommendedAction?: string;
};

export type EmptyInspectorModel = {
  kind: "empty";
  title: string;
  body: string;
};

export type InspectorModel = EmptyInspectorModel | NodeInspectorModel;

export type ContractCardModel = {
  id: ContractDefinitionId;
  title: string;
  description: string;
  status: ContractStatus;
  statusLabel: string;
  progressCurrent: number;
  progressRequired: number;
  progressPercent: number;
  requirementLabel: string;
  rewardLabel: string;
  canClaim: boolean;
};

export type ContractPanelModel = {
  availableCount: number;
  activeCount: number;
  completedCount: number;
  claimedCount: number;
  focusedContract?: ContractCardModel;
};

export type ResearchCardModel = {
  id: ResearchId;
  title: string;
  description: string;
  costResearch: number;
  currentResearch: number;
  status: ResearchStatus;
  statusLabel: string;
  effectLabel: string;
  affordable: boolean;
  canUnlock: boolean;
  lockedReason?: string;
};

export type ResearchPanelModel = {
  availableCount: number;
  lockedCount: number;
  unlockedCount: number;
  spentResearchPoints: number;
  cards: ResearchCardModel[];
  focusedResearch?: ResearchCardModel;
};

const DATA_RESOURCE_IDS: ResourceId[] = ["rawData", "parsedData", "cleanData"];

const BOTTLENECK_PRIORITY: Record<BottleneckReason, number> = {
  power_limited: 0,
  heat_throttled: 1,
  compute_limited: 2,
  input_starved: 3,
  output_blocked: 4,
  storage_full: 5,
  network_limited: 6
};

export function buildResourceBarModel(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): ResourceBarModel {
  const warning = findMainBottleneck(state, nodeDefinitionsById);
  const model: ResourceBarModel = {
    money: buildResourceMetric(state, "money"),
    data: DATA_RESOURCE_IDS.map((resourceId) =>
      buildResourceMetric(state, resourceId)
    ),
    research: buildResourceMetric(state, "research"),
    compute: {
      used: state.resources.usage.compute,
      capacity: state.resources.capacities.compute,
      warning:
        warning?.reason === "compute_limited" ||
        (state.resources.capacities.compute > 0 &&
          state.resources.usage.compute / state.resources.capacities.compute >=
            0.9)
    },
    power: buildLoadMetric(state, "power", warning?.reason === "power_limited"),
    heat: buildLoadMetric(state, "heat", warning?.reason === "heat_throttled")
  };

  if (warning !== undefined) {
    model.warning = warning;
  }

  return model;
}

export function buildInspectorModel(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): InspectorModel {
  const selectedNodeId = state.graph.selectedNodeIds[0];

  if (selectedNodeId === undefined) {
    return buildEmptyInspectorModel();
  }

  const node = state.graph.nodes[selectedNodeId];
  if (node === undefined) {
    return buildEmptyInspectorModel();
  }

  const baseDefinition = nodeDefinitionsById[node.definitionId];
  if (baseDefinition === undefined) {
    return buildEmptyInspectorModel();
  }

  const definition = buildEffectiveNodeDefinitionForInspector(
    state,
    node,
    nodeDefinitionsById
  );
  const bottleneck =
    node.runtime.bottleneckReason === undefined
      ? undefined
      : buildBottleneckSummary(node, definition, node.runtime.bottleneckReason);

  const model: NodeInspectorModel = {
    kind: "node",
    nodeId: node.id,
    name: definition.name,
    categoryLabel: formatCategoryLabel(definition.category),
    level: node.level,
    status: node.status,
    statusLabel: formatStatusLabel(node.status),
    description: definition.description,
    inputs: buildFlowRates(definition.baseStats.consumes, node.runtime.inputRate),
    outputs: buildFlowRates(
      definition.baseStats.produces,
      node.runtime.outputRate
    ),
    throughputPercent: Math.round(node.runtime.effectiveThroughput * 100)
  };
  const compute = buildInspectorComputeModel(node, definition);
  const load = buildInspectorLoadModel(definition);
  const upgrade = buildUpgradePreviewModel(state, node, baseDefinition);
  const recommendedAction =
    bottleneck?.recommendedAction ?? buildDefaultRecommendedAction(node);

  if (compute !== undefined) {
    model.compute = compute;
  }

  if (load !== undefined) {
    model.load = load;
  }

  if (upgrade !== undefined) {
    model.upgrade = upgrade;
  }

  if (bottleneck !== undefined) {
    model.bottleneck = bottleneck;
  }

  if (recommendedAction !== undefined) {
    model.recommendedAction = recommendedAction;
  }

  return model;
}

export function buildNodeTooltipModel(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  nodeId: NodeId
): NodeTooltipModel | undefined {
  const node = state.graph.nodes[nodeId];

  if (node === undefined) {
    return undefined;
  }

  const baseDefinition = nodeDefinitionsById[node.definitionId];

  if (baseDefinition === undefined) {
    return undefined;
  }

  const definition = buildEffectiveNodeDefinitionForInspector(
    state,
    node,
    nodeDefinitionsById
  );
  const bottleneck =
    node.runtime.bottleneckReason === undefined
      ? undefined
      : buildBottleneckSummary(node, definition, node.runtime.bottleneckReason);
  const compute = buildInspectorComputeModel(node, definition);
  const load = buildInspectorLoadModel(definition);
  const upgrade = buildUpgradePreviewModel(state, node, baseDefinition);
  const throughputPercent = Math.round(node.runtime.effectiveThroughput * 100);
  const model: NodeTooltipModel = {
    nodeId: node.id,
    name: definition.name,
    categoryLabel: formatCategoryLabel(definition.category),
    level: node.level,
    status: node.status,
    statusLabel: formatStatusLabel(node.status),
    statusTone: getNodeTooltipStatusTone(node.status),
    throughputPercent,
    throughputLabel: `${throughputPercent}% effective`,
    inputs: buildFlowRates(definition.baseStats.consumes, node.runtime.inputRate),
    outputs: buildFlowRates(
      definition.baseStats.produces,
      node.runtime.outputRate
    )
  };

  if (compute !== undefined) {
    model.compute = compute;
  }

  if (load !== undefined) {
    model.load = load;
  }

  if (upgrade !== undefined) {
    model.upgrade = {
      currentLevel: upgrade.currentLevel,
      nextLevel: upgrade.nextLevel,
      nextCost: upgrade.nextCost,
      canUpgrade: upgrade.canUpgrade,
      effectLabel: upgrade.effectLabel
    };
  }

  if (bottleneck !== undefined) {
    model.bottleneck = bottleneck;
  }

  return model;
}

function buildEffectiveNodeDefinitionForInspector(
  state: GameState,
  node: NodeInstance,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): NodeDefinition {
  const baseDefinition = nodeDefinitionsById[node.definitionId];

  if (baseDefinition === undefined) {
    throw new Error(`Missing node definition for ${node.definitionId}.`);
  }

  const researchModifiedDefinitions = applyResearchEffectsToNodeDefinitions(
    nodeDefinitionsById,
    state.research,
    researchDefinitionsById
  );
  const definition = researchModifiedDefinitions[node.definitionId];

  return definition === undefined
    ? baseDefinition
    : applyNodeUpgradeScaling(definition, node.level);
}

export function buildContractPanelModel(
  state: GameState,
  contractDefinitionsById: Readonly<
    Record<ContractDefinitionId, ContractDefinition>
  >
): ContractPanelModel {
  const focusedContract = findFocusedContract(state);
  const model: ContractPanelModel = {
    availableCount: state.contracts.available.length,
    activeCount: state.contracts.active.length,
    completedCount: state.contracts.completed.length,
    claimedCount: state.contracts.claimed.length
  };

  if (focusedContract !== undefined) {
    const definition = contractDefinitionsById[focusedContract.id];

    if (definition !== undefined) {
      model.focusedContract = buildContractCardModel(
        focusedContract,
        definition
      );
    }
  }

  return model;
}

export function buildResearchPanelModel(
  state: GameState,
  researchDefinitions: readonly ResearchDefinition[]
): ResearchPanelModel {
  const cards = researchDefinitions.map((definition) =>
    buildResearchCardModel(state, definition)
  );
  const focusedResearch =
    cards.find((card) => card.status === "unlocked") ??
    cards.find((card) => card.canUnlock) ??
    cards.find((card) => card.status === "available") ??
    cards.find((card) => card.status === "locked");
  const model: ResearchPanelModel = {
    availableCount: cards.filter((card) => card.status === "available").length,
    lockedCount: cards.filter((card) => card.status === "locked").length,
    unlockedCount: cards.filter((card) => card.status === "unlocked").length,
    spentResearchPoints: state.research.spentResearchPoints,
    cards
  };

  if (focusedResearch !== undefined) {
    model.focusedResearch = focusedResearch;
  }

  return model;
}

function buildEmptyInspectorModel(): EmptyInspectorModel {
  return {
    kind: "empty",
    title: "Select a node to inspect its flow.",
    body: "Node stats, bottlenecks, and throughput details will appear here."
  };
}

function buildResourceMetric(
  state: GameState,
  resourceId: ResourceId
): ResourceMetricModel {
  return {
    resourceId,
    label: formatResourceLabel(resourceId),
    value: state.resources.balances[resourceId],
    rate: state.resources.rates[resourceId]
  };
}

function buildLoadMetric(
  state: GameState,
  resourceId: "power" | "heat",
  hasActiveBottleneck: boolean
): LoadMetricModel {
  const used = state.resources.usage[resourceId];
  const capacity = state.resources.capacities[resourceId];
  const pressurePercent =
    resourceId === "heat"
      ? state.resources.balances.heat
      : calculatePressurePercent(used, capacity);

  return {
    resourceId,
    label: formatResourceLabel(resourceId),
    used,
    capacity,
    pressurePercent,
    warning: hasActiveBottleneck || pressurePercent >= 80,
    critical: pressurePercent > 100
  };
}

function calculatePressurePercent(used: number, capacity: number): number {
  if (capacity <= 0) {
    return used > 0 ? 100 : 0;
  }

  return (used / capacity) * 100;
}

function findMainBottleneck(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): BottleneckSummaryModel | undefined {
  const summaries = Object.values(state.graph.nodes).flatMap((node) => {
    const reason = node.runtime.bottleneckReason;
    const definition = nodeDefinitionsById[node.definitionId];

    if (reason === undefined || definition === undefined) {
      return [];
    }

    return [buildBottleneckSummary(node, definition, reason)];
  });

  return summaries.sort(
    (left, right) =>
      BOTTLENECK_PRIORITY[left.reason] - BOTTLENECK_PRIORITY[right.reason] ||
      left.nodeName.localeCompare(right.nodeName)
  )[0];
}

function buildBottleneckSummary(
  node: NodeInstance,
  definition: NodeDefinition,
  reason: BottleneckReason
): BottleneckSummaryModel {
  const reasonLabel = formatStatusLabel(reason);

  switch (reason) {
    case "compute_limited":
      return {
        nodeId: node.id,
        nodeName: definition.name,
        reason,
        reasonLabel,
        summary: `${definition.name} needs more compute than the grid can supply.`,
        recommendedAction: "Add CPU Rack or reduce competing compute demand."
      };
    case "input_starved":
      return {
        nodeId: node.id,
        nodeName: definition.name,
        reason,
        reasonLabel,
        summary: `${definition.name} is waiting for input flow.`,
        recommendedAction: "Connect the required upstream resource."
      };
    case "output_blocked":
      return {
        nodeId: node.id,
        nodeName: definition.name,
        reason,
        reasonLabel,
        summary: `${definition.name} cannot move output fast enough.`,
        recommendedAction: "Add another output route or increase downstream capacity."
      };
    case "power_limited":
      return {
        nodeId: node.id,
        nodeName: definition.name,
        reason,
        reasonLabel,
        summary: `${definition.name} is held back by power capacity.`,
        recommendedAction: "Increase power capacity before expanding this branch."
      };
    case "heat_throttled":
      return {
        nodeId: node.id,
        nodeName: definition.name,
        reason,
        reasonLabel,
        summary: `${definition.name} is throttled by heat.`,
        recommendedAction: "Add cooling capacity or reduce load."
      };
    case "storage_full":
      return {
        nodeId: node.id,
        nodeName: definition.name,
        reason,
        reasonLabel,
        summary: `${definition.name} has no room for more buffered data.`,
        recommendedAction: "Add storage or move data downstream faster."
      };
    case "network_limited":
      return {
        nodeId: node.id,
        nodeName: definition.name,
        reason,
        reasonLabel,
        summary: `${definition.name} is waiting on network capacity.`,
        recommendedAction: "Add bandwidth capacity or split traffic."
      };
  }
}

function buildFlowRates(
  configuredRates: ResourceMap,
  currentRates: ResourceMap
): FlowRateModel[] {
  return Object.entries(configuredRates)
    .filter(
      ([resourceId, configuredRate]) =>
        resourceId !== "compute" && configuredRate > 0
    )
    .map(([resourceId, configuredRate]) => ({
      resourceId: resourceId as ResourceId,
      label: formatResourceLabel(resourceId as ResourceId),
      currentRate: currentRates[resourceId as ResourceId] ?? 0,
      configuredRate
    }));
}

function buildInspectorComputeModel(
  node: NodeInstance,
  definition: NodeDefinition
): InspectorComputeModel | undefined {
  const requested = definition.baseStats.computeUsed;
  const provided = definition.baseStats.computeProduced;
  const used = node.runtime.inputRate.compute ?? 0;

  if (requested <= 0 && provided <= 0 && used <= 0) {
    return undefined;
  }

  return {
    used,
    requested,
    provided
  };
}

function buildInspectorLoadModel(
  definition: NodeDefinition
): InspectorLoadModel | undefined {
  const powerUse = definition.baseStats.powerUse;
  const heatOutput = definition.baseStats.heatOutput;

  if (powerUse <= 0 && heatOutput <= 0) {
    return undefined;
  }

  return {
    powerUse,
    heatOutput
  };
}

function buildUpgradePreviewModel(
  state: GameState,
  node: NodeInstance,
  definition: NodeDefinition
): UpgradePreviewModel | undefined {
  if (!hasNodeUpgradeScaling(definition)) {
    return undefined;
  }

  const currentLevel = node.level;
  const nextCost = calculateNextUpgradeCost(definition, currentLevel);
  const maxPreview = calculateMaxAffordableUpgrade(
    definition,
    currentLevel,
    state.resources.balances.money
  );

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    nextCost,
    currentMoney: state.resources.balances.money,
    canUpgrade: state.resources.balances.money >= nextCost,
    buyMaxLevel: maxPreview.targetLevel,
    buyMaxCost: maxPreview.totalCost,
    buyMaxCount: maxPreview.upgradeCount,
    canBuyMax: maxPreview.upgradeCount > 0,
    effectLabel: formatUpgradeEffect(definition)
  };
}

function buildDefaultRecommendedAction(node: NodeInstance): string | undefined {
  return node.status === "running"
    ? "Keep this branch balanced and watch the next bottleneck."
    : undefined;
}

function getNodeTooltipStatusTone(status: NodeStatus): NodeTooltipStatusTone {
  if (status === "running") {
    return "good";
  }

  return status === "idle" ? "neutral" : "warning";
}

function formatUpgradeEffect(definition: NodeDefinition): string {
  const scaling = definition.upgradeScaling;
  const parts: string[] = [];

  if (scaling.throughputMultiplierPerLevel !== undefined) {
    parts.push(
      `${formatMultiplierIncrease(
        scaling.throughputMultiplierPerLevel
      )} throughput`
    );
  }

  if (scaling.computeProducedMultiplierPerLevel !== undefined) {
    parts.push(
      `${formatMultiplierIncrease(
        scaling.computeProducedMultiplierPerLevel
      )} compute capacity`
    );
  }

  if (scaling.computeUseMultiplierPerLevel !== undefined) {
    parts.push(
      `${formatMultiplierIncrease(
        scaling.computeUseMultiplierPerLevel
      )} compute use`
    );
  }

  if (scaling.powerUseMultiplierPerLevel !== undefined) {
    parts.push(
      `${formatMultiplierIncrease(scaling.powerUseMultiplierPerLevel)} power use`
    );
  }

  if (scaling.heatOutputMultiplierPerLevel !== undefined) {
    parts.push(
      `${formatMultiplierIncrease(
        scaling.heatOutputMultiplierPerLevel
      )} heat output`
    );
  }

  if (scaling.valueMultiplierPerLevel !== undefined) {
    parts.push(
      `${formatMultiplierIncrease(scaling.valueMultiplierPerLevel)} upload value`
    );
  }

  if (scaling.researchMultiplierPerLevel !== undefined) {
    parts.push(
      `${formatMultiplierIncrease(
        scaling.researchMultiplierPerLevel
      )} research output`
    );
  }

  return parts.length === 0 ? "No configured upgrade effect." : parts.join(", ");
}

export function formatResourceLabel(resourceId: ResourceId): string {
  const labels: Record<ResourceId, string> = {
    money: "Money",
    rawData: "Raw Data",
    parsedData: "Parsed Data",
    cleanData: "Clean Data",
    compute: "Compute",
    research: "Research",
    power: "Power",
    heat: "Heat",
    gpu: "GPU",
    bandwidth: "Bandwidth",
    storage: "Storage",
    reputation: "Reputation",
    trust: "Trust",
    trace: "Trace",
    byteCoin: "ByteCoin",
    hashLite: "HashLite"
  };

  return labels[resourceId];
}

export function formatStatusLabel(status: NodeStatus | BottleneckReason): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function findFocusedContract(state: GameState): ContractRuntimeState | undefined {
  return (
    state.contracts.completed[0] ??
    state.contracts.active[0] ??
    state.contracts.claimed[0] ??
    state.contracts.available[0]
  );
}

function buildContractCardModel(
  contract: ContractRuntimeState,
  definition: ContractDefinition
): ContractCardModel {
  const progressCurrent = Math.min(
    contract.currentProgress,
    definition.requiredAmount
  );

  return {
    id: contract.id,
    title: definition.title,
    description: definition.description,
    status: contract.status,
    statusLabel: formatContractStatusLabel(contract.status),
    progressCurrent,
    progressRequired: definition.requiredAmount,
    progressPercent: calculateContractProgressPercent(
      progressCurrent,
      definition.requiredAmount
    ),
    requirementLabel: formatContractRequirement(definition),
    rewardLabel: formatContractReward(definition),
    canClaim: contract.status === "completed"
  };
}

function calculateContractProgressPercent(
  progressCurrent: number,
  progressRequired: number
): number {
  if (progressRequired <= 0) {
    return 100;
  }

  return Math.min(100, (progressCurrent / progressRequired) * 100);
}

function formatContractRequirement(definition: ContractDefinition): string {
  if (definition.requirementType === "earn_money") {
    return `Earn $${formatCompactNumber(definition.requiredAmount)}`;
  }

  return definition.requirementResourceId === undefined
    ? `${formatCompactNumber(definition.requiredAmount)} units`
    : `${formatCompactNumber(definition.requiredAmount)} ${formatResourceLabel(
        definition.requirementResourceId
      )}`;
}

function formatContractReward(definition: ContractDefinition): string {
  const parts = [`$${formatCompactNumber(definition.rewardMoney)}`];

  if ((definition.rewardResearch ?? 0) > 0) {
    parts.push(`${formatCompactNumber(definition.rewardResearch ?? 0)} Research`);
  }

  return parts.join(" + ");
}

function formatContractStatusLabel(status: ContractStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function buildResearchCardModel(
  state: GameState,
  definition: ResearchDefinition
): ResearchCardModel {
  const unlocked = state.research.unlockedResearchIds.includes(definition.id);
  const prerequisitesMet = definition.prerequisiteResearchIds.every(
    (researchId) => state.research.unlockedResearchIds.includes(researchId)
  );
  const status: ResearchStatus = unlocked
    ? "unlocked"
    : prerequisitesMet
      ? "available"
      : "locked";
  const currentResearch = state.resources.balances.research;
  const affordable = currentResearch >= definition.costResearch;
  const lockedReason =
    status === "locked"
      ? formatResearchLockedReason(state, definition)
      : undefined;
  const model: ResearchCardModel = {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    costResearch: definition.costResearch,
    currentResearch,
    status,
    statusLabel: formatResearchStatusLabel(status),
    effectLabel: formatResearchEffect(definition),
    affordable,
    canUnlock: status === "available" && affordable
  };

  if (lockedReason !== undefined) {
    model.lockedReason = lockedReason;
  }

  return model;
}

function formatResearchLockedReason(
  state: GameState,
  definition: ResearchDefinition
): string {
  const missingPrerequisites = definition.prerequisiteResearchIds.filter(
    (researchId) => !state.research.unlockedResearchIds.includes(researchId)
  );

  if (missingPrerequisites.length === 0) {
    return "Locked.";
  }

  return `Requires ${missingPrerequisites
    .map((researchId) => formatResearchIdLabel(researchId))
    .join(", ")}.`;
}

function formatResearchEffect(definition: ResearchDefinition): string {
  const targetLabel =
    definition.targetNodeDefinitionId === undefined
      ? ""
      : `${formatResearchIdLabel(definition.targetNodeDefinitionId)} `;

  switch (definition.effectType) {
    case "node_compute_use_multiplier":
      return `${targetLabel}compute use ${formatMultiplierReduction(
        definition.effectValue
      )}`;
    case "node_heat_output_multiplier":
      return `${targetLabel}heat output ${formatMultiplierReduction(
        definition.effectValue
      )}`;
    case "node_output_multiplier":
      return `${targetLabel}${formatResourceTarget(
        definition.targetResourceId
      )} output ${formatMultiplierIncrease(definition.effectValue)}`;
    case "node_power_use_multiplier":
      return `${targetLabel}power use ${formatMultiplierReduction(
        definition.effectValue
      )}`;
    case "node_throughput_multiplier":
      return `${targetLabel}throughput ${formatMultiplierIncrease(
        definition.effectValue
      )}`;
    case "global_power_capacity_add":
      return `+${formatCompactNumber(definition.effectValue)} power capacity`;
    case "global_heat_capacity_add":
      return `+${formatCompactNumber(definition.effectValue)} heat safe capacity`;
  }
}

function formatResearchStatusLabel(status: ResearchStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatResourceTarget(resourceId: ResourceId | undefined): string {
  return resourceId === undefined ? "resource" : formatResourceLabel(resourceId);
}

function formatMultiplierReduction(value: number): string {
  return `-${formatCompactNumber((1 - value) * 100)}%`;
}

function formatMultiplierIncrease(value: number): string {
  return `+${formatCompactNumber((value - 1) * 100)}%`;
}

function formatResearchIdLabel(researchId: string): string {
  return researchId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCompactNumber(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000) {
    return `${trimCompactNumber(value / 1_000_000)}M`;
  }

  if (absValue >= 1_000) {
    return `${trimCompactNumber(value / 1_000)}K`;
  }

  return trimCompactNumber(value);
}

function trimCompactNumber(value: number): string {
  const roundedValue = Math.round(value * 10) / 10;

  return Number.isInteger(roundedValue)
    ? `${roundedValue}`
    : roundedValue.toFixed(1);
}

function formatCategoryLabel(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
