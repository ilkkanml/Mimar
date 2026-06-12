import type {
  BottleneckReason,
  GameState,
  NodeDefinition,
  NodeDefinitionId,
  NodeId,
  NodeInstance,
  NodeStatus,
  ResourceId,
  ResourceMap
} from "../../game/state/types";

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
  bottleneck?: BottleneckSummaryModel;
  recommendedAction?: string;
};

export type EmptyInspectorModel = {
  kind: "empty";
  title: string;
  body: string;
};

export type InspectorModel = EmptyInspectorModel | NodeInspectorModel;

const DATA_RESOURCE_IDS: ResourceId[] = ["rawData", "parsedData", "cleanData"];

const BOTTLENECK_PRIORITY: Record<BottleneckReason, number> = {
  compute_limited: 0,
  input_starved: 1,
  output_blocked: 2,
  power_limited: 3,
  heat_throttled: 4,
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
    }
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

  const definition = nodeDefinitionsById[node.definitionId];
  if (definition === undefined) {
    return buildEmptyInspectorModel();
  }

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
  const recommendedAction =
    bottleneck?.recommendedAction ?? buildDefaultRecommendedAction(node);

  if (compute !== undefined) {
    model.compute = compute;
  }

  if (bottleneck !== undefined) {
    model.bottleneck = bottleneck;
  }

  if (recommendedAction !== undefined) {
    model.recommendedAction = recommendedAction;
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

function buildDefaultRecommendedAction(node: NodeInstance): string | undefined {
  return node.status === "running"
    ? "Keep this branch balanced and watch the next bottleneck."
    : undefined;
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

function formatCategoryLabel(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
