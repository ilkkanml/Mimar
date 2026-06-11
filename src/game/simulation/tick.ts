import { createZeroResourceMap } from "../state/initialState";

import type {
  FullResourceMap,
  GameState,
  NodeDefinition,
  NodeDefinitionId,
  NodeId,
  NodeInstance,
  ResourceId,
  ResourceMap
} from "../state/types";

export const SIMULATION_TICKS_PER_SECOND = 10;
export const FIXED_TICK_SECONDS = 1 / SIMULATION_TICKS_PER_SECOND;

type MutableNodeMap = Record<NodeId, NodeInstance>;

export function tickGameState(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  deltaSeconds = FIXED_TICK_SECONDS
): GameState {
  const nodes = cloneNodesForTick(state.graph.nodes);
  const edges = state.graph.edges;
  const rates = createZeroResourceMap();
  const capacities = createZeroResourceMap();
  const usage = createZeroResourceMap();
  const startingBalances = state.resources.balances;

  capacities.compute = getComputeCapacity(nodes, nodeDefinitionsById);
  let availableCompute = capacities.compute * deltaSeconds;

  for (const node of Object.values(nodes)) {
    const definition = nodeDefinitionsById[node.definitionId];

    if (definition === undefined || !node.enabled) {
      continue;
    }

    if (isSourceNode(definition)) {
      produceToNodeOutputs(node, definition, deltaSeconds, rates);
    }
  }

  moveResourcesAcrossEdges(nodes, edges, deltaSeconds);

  for (const node of Object.values(nodes)) {
    const definition = nodeDefinitionsById[node.definitionId];

    if (definition === undefined || !node.enabled || isSourceNode(definition)) {
      continue;
    }

    const processResult = processNode(
      node,
      definition,
      availableCompute,
      deltaSeconds
    );

    availableCompute -= processResult.computeUsed;
    usage.compute += processResult.computeUsed / deltaSeconds;
    addResourceMap(rates, processResult.globalProducedRates);
  }

  moveResourcesAcrossEdges(nodes, edges, deltaSeconds);

  const balances = calculateResourceBalances(
    startingBalances,
    nodes,
    rates,
    deltaSeconds
  );

  return {
    ...state,
    meta: {
      ...state.meta,
      totalPlayTimeSeconds:
        state.meta.totalPlayTimeSeconds + Math.max(0, deltaSeconds)
    },
    graph: {
      ...state.graph,
      nodes
    },
    resources: {
      balances,
      rates,
      capacities,
      usage
    }
  };
}

function cloneNodesForTick(
  nodes: Record<NodeId, NodeInstance>
): MutableNodeMap {
  return Object.fromEntries(
    Object.entries(nodes).map(([nodeId, node]) => [
      nodeId,
      {
        ...node,
        inputBuffers: { ...node.inputBuffers },
        outputBuffers: { ...node.outputBuffers },
        status: "idle",
        runtime: {
          inputRate: {},
          outputRate: {},
          utilization: 0,
          effectiveThroughput: 0
        }
      }
    ])
  );
}

function getComputeCapacity(
  nodes: MutableNodeMap,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): number {
  return Object.values(nodes).reduce((total, node) => {
    const definition = nodeDefinitionsById[node.definitionId];
    if (definition === undefined || !node.enabled) {
      return total;
    }

    return total + definition.baseStats.computeProduced;
  }, 0);
}

function isSourceNode(definition: NodeDefinition): boolean {
  return (
    Object.keys(definition.baseStats.produces).length > 0 &&
    Object.entries(definition.baseStats.consumes).every(
      ([resourceId, amount]) => resourceId === "compute" || amount === 0
    ) &&
    Object.keys(definition.baseStats.consumes).length === 0
  );
}

function produceToNodeOutputs(
  node: NodeInstance,
  definition: NodeDefinition,
  deltaSeconds: number,
  rates: FullResourceMap
): void {
  let producedAny = false;

  for (const [resourceId, perSecond] of Object.entries(
    definition.baseStats.produces
  )) {
    const producedAmount = perSecond * deltaSeconds;
    incrementResource(node.outputBuffers, resourceId as ResourceId, producedAmount);
    incrementResource(node.runtime.outputRate, resourceId as ResourceId, perSecond);
    rates[resourceId as ResourceId] += perSecond;
    producedAny = producedAny || producedAmount > 0;
  }

  if (producedAny) {
    node.status = "running";
    node.runtime.utilization = 1;
    node.runtime.effectiveThroughput = 1;
  }
}

function moveResourcesAcrossEdges(
  nodes: MutableNodeMap,
  edges: GameState["graph"]["edges"],
  deltaSeconds: number
): void {
  for (const edge of Object.values(edges)) {
    const fromNode = nodes[edge.fromNodeId];
    const toNode = nodes[edge.toNodeId];

    if (fromNode === undefined || toNode === undefined) {
      continue;
    }

    const available = fromNode.outputBuffers[edge.resourceType] ?? 0;
    const movedAmount = Math.min(available, edge.throughputLimit * deltaSeconds);

    if (movedAmount <= 0) {
      continue;
    }

    incrementResource(fromNode.outputBuffers, edge.resourceType, -movedAmount);
    incrementResource(toNode.inputBuffers, edge.resourceType, movedAmount);
  }
}

function processNode(
  node: NodeInstance,
  definition: NodeDefinition,
  availableCompute: number,
  deltaSeconds: number
): {
  computeUsed: number;
  globalProducedRates: ResourceMap;
} {
  const nonComputeConsumes = Object.entries(definition.baseStats.consumes).filter(
    ([resourceId, amount]) => resourceId !== "compute" && amount > 0
  ) as Array<[ResourceId, number]>;
  const computeNeededPerSecond = definition.baseStats.computeUsed;
  const computeNeeded = computeNeededPerSecond * deltaSeconds;
  const globalProducedRates: ResourceMap = {};

  if (nonComputeConsumes.length === 0 && computeNeededPerSecond === 0) {
    return { computeUsed: 0, globalProducedRates };
  }

  const inputFactor = getInputFactor(node, nonComputeConsumes, deltaSeconds);

  if (inputFactor <= 0) {
    setBottleneck(node, "input_starved");
    return { computeUsed: 0, globalProducedRates };
  }

  const computeFactor =
    computeNeeded <= 0 ? 1 : Math.min(1, availableCompute / computeNeeded);

  if (computeFactor <= 0) {
    setBottleneck(node, "compute_limited");
    return { computeUsed: 0, globalProducedRates };
  }

  const throughputFactor = Math.min(inputFactor, computeFactor);

  for (const [resourceId, perSecond] of nonComputeConsumes) {
    const consumedAmount = perSecond * throughputFactor * deltaSeconds;
    incrementResource(node.inputBuffers, resourceId, -consumedAmount);
    incrementResource(node.runtime.inputRate, resourceId, consumedAmount / deltaSeconds);
  }

  const computeUsed = computeNeeded * throughputFactor;

  if (computeUsed > 0) {
    incrementResource(node.runtime.inputRate, "compute", computeUsed / deltaSeconds);
  }

  for (const [resourceId, perSecond] of Object.entries(
    definition.baseStats.produces
  )) {
    const producedRate = perSecond * throughputFactor;
    const producedAmount = producedRate * deltaSeconds;

    if (isGlobalOutputResource(resourceId as ResourceId)) {
      globalProducedRates[resourceId as ResourceId] = producedRate;
    } else {
      incrementResource(
        node.outputBuffers,
        resourceId as ResourceId,
        producedAmount
      );
    }

    incrementResource(node.runtime.outputRate, resourceId as ResourceId, producedRate);
  }

  if (throughputFactor < 1 && computeFactor < inputFactor) {
    setBottleneck(node, "compute_limited");
  } else if (throughputFactor < 1) {
    setBottleneck(node, "input_starved");
  } else {
    node.status = "running";
  }

  node.runtime.utilization = throughputFactor;
  node.runtime.effectiveThroughput = throughputFactor;

  return {
    computeUsed,
    globalProducedRates
  };
}

function getInputFactor(
  node: NodeInstance,
  consumes: Array<[ResourceId, number]>,
  deltaSeconds: number
): number {
  if (consumes.length === 0) {
    return 1;
  }

  return consumes.reduce((factor, [resourceId, perSecond]) => {
    const requiredAmount = perSecond * deltaSeconds;
    if (requiredAmount <= 0) {
      return factor;
    }

    const availableAmount = node.inputBuffers[resourceId] ?? 0;
    return Math.min(factor, availableAmount / requiredAmount);
  }, 1);
}

function calculateResourceBalances(
  startingBalances: FullResourceMap,
  nodes: MutableNodeMap,
  rates: FullResourceMap,
  deltaSeconds: number
): FullResourceMap {
  const balances = createZeroResourceMap();

  balances.money = startingBalances.money + rates.money * deltaSeconds;
  balances.research = startingBalances.research + rates.research * deltaSeconds;

  for (const node of Object.values(nodes)) {
    for (const [resourceId, amount] of Object.entries(node.inputBuffers)) {
      balances[resourceId as ResourceId] += amount;
    }

    for (const [resourceId, amount] of Object.entries(node.outputBuffers)) {
      balances[resourceId as ResourceId] += amount;
    }
  }

  return balances;
}

function setBottleneck(
  node: NodeInstance,
  reason: "input_starved" | "compute_limited"
): void {
  node.status = reason;
  node.runtime.bottleneckReason = reason;
  node.runtime.utilization = 0;
  node.runtime.effectiveThroughput = 0;
}

function incrementResource(
  resourceMap: ResourceMap,
  resourceId: ResourceId,
  amount: number
): void {
  resourceMap[resourceId] = Math.max(0, (resourceMap[resourceId] ?? 0) + amount);
}

function addResourceMap(target: FullResourceMap, source: ResourceMap): void {
  for (const [resourceId, amount] of Object.entries(source)) {
    target[resourceId as ResourceId] += amount;
  }
}

function isGlobalOutputResource(resourceId: ResourceId): boolean {
  return resourceId === "money" || resourceId === "research";
}
