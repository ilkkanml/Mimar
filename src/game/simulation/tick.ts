import { createZeroResourceMap } from "../state/initialState";
import { contractDefinitionsById } from "../data/contracts";
import { researchDefinitionsById } from "../data/research";
import { evaluateContractProgress } from "./contracts";
import {
  applyResearchEffectsToNodeDefinitions,
  calculateResearchInfrastructureModifiers
} from "./researchEffects";
import { applyNodeUpgradeScaling } from "./upgrades";

import type {
  FullResourceMap,
  GameState,
  BottleneckReason,
  NodeDefinition,
  NodeDefinitionId,
  NodeId,
  NodeInstance,
  ResourceId,
  ResourceMap
} from "../state/types";

export const SIMULATION_TICKS_PER_SECOND = 10;
export const FIXED_TICK_SECONDS = 1 / SIMULATION_TICKS_PER_SECOND;
export const BASE_FACILITY_POWER_CAPACITY = 20;
export const BASE_HEAT_DISSIPATION_CAPACITY = 10;

type MutableNodeMap = Record<NodeId, NodeInstance>;
type EffectiveNodeDefinitionsByNodeId = Partial<Record<NodeId, NodeDefinition>>;
type InfrastructureLoad = {
  powerCapacity: number;
  powerUsage: number;
  heatCapacity: number;
  heatGeneration: number;
  heatPressurePercent: number;
};
type InfrastructureModifiers = {
  powerCapacityBonus: number;
  heatCapacityBonus: number;
};
type GlobalConstraint = {
  factor: number;
  bottleneckReason?: Extract<
    BottleneckReason,
    "power_limited" | "heat_throttled"
  >;
};

export function tickGameState(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  deltaSeconds = FIXED_TICK_SECONDS
): GameState {
  const researchModifiedNodeDefinitionsById = applyResearchEffectsToNodeDefinitions(
    nodeDefinitionsById,
    state.research,
    researchDefinitionsById
  );
  const infrastructureModifiers = calculateResearchInfrastructureModifiers(
    state.research,
    researchDefinitionsById
  );
  const nodes = cloneNodesForTick(state.graph.nodes);
  const effectiveNodeDefinitionsByNodeId = buildEffectiveNodeDefinitionsByNodeId(
    nodes,
    researchModifiedNodeDefinitionsById
  );
  const edges = state.graph.edges;
  const rates = createZeroResourceMap();
  const capacities = createZeroResourceMap();
  const usage = createZeroResourceMap();
  const startingBalances = state.resources.balances;
  const infrastructureLoad = calculateInfrastructureLoad(
    nodes,
    effectiveNodeDefinitionsByNodeId,
    infrastructureModifiers
  );
  const globalConstraint = calculateGlobalConstraint(infrastructureLoad);

  capacities.power = infrastructureLoad.powerCapacity;
  capacities.heat = infrastructureLoad.heatCapacity;
  usage.power = infrastructureLoad.powerUsage;
  usage.heat = infrastructureLoad.heatGeneration;
  rates.heat = infrastructureLoad.heatGeneration;

  capacities.compute =
    getComputeCapacity(nodes, effectiveNodeDefinitionsByNodeId) *
    globalConstraint.factor;
  let availableCompute = capacities.compute * deltaSeconds;

  for (const node of Object.values(nodes)) {
    const definition = effectiveNodeDefinitionsByNodeId[node.id];

    if (definition === undefined || !node.enabled) {
      continue;
    }

    if (isSourceNode(definition)) {
      produceToNodeOutputs(
        node,
        definition,
        deltaSeconds,
        rates,
        globalConstraint
      );
    }
  }

  moveResourcesAcrossEdges(nodes, edges, deltaSeconds);

  for (const node of Object.values(nodes)) {
    const definition = effectiveNodeDefinitionsByNodeId[node.id];

    if (definition === undefined || !node.enabled || isSourceNode(definition)) {
      continue;
    }

    const processResult = processNode(
      node,
      definition,
      availableCompute,
      deltaSeconds,
      globalConstraint
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
    deltaSeconds,
    infrastructureLoad
  );
  const contracts = evaluateContractProgress(
    state.contracts,
    contractDefinitionsById,
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
    },
    contracts
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

function buildEffectiveNodeDefinitionsByNodeId(
  nodes: MutableNodeMap,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>
): EffectiveNodeDefinitionsByNodeId {
  return Object.fromEntries(
    Object.values(nodes).flatMap((node) => {
      const definition = nodeDefinitionsById[node.definitionId];

      return definition === undefined
        ? []
        : [[node.id, applyNodeUpgradeScaling(definition, node.level)]];
    })
  );
}

function getComputeCapacity(
  nodes: MutableNodeMap,
  nodeDefinitionsByNodeId: EffectiveNodeDefinitionsByNodeId
): number {
  return Object.values(nodes).reduce((total, node) => {
    const definition = nodeDefinitionsByNodeId[node.id];
    if (definition === undefined || !node.enabled) {
      return total;
    }

    return total + definition.baseStats.computeProduced;
  }, 0);
}

function calculateInfrastructureLoad(
  nodes: MutableNodeMap,
  nodeDefinitionsByNodeId: EffectiveNodeDefinitionsByNodeId,
  infrastructureModifiers: InfrastructureModifiers
): InfrastructureLoad {
  let powerCapacity =
    BASE_FACILITY_POWER_CAPACITY + infrastructureModifiers.powerCapacityBonus;
  let powerUsage = 0;
  let heatCapacity =
    BASE_HEAT_DISSIPATION_CAPACITY + infrastructureModifiers.heatCapacityBonus;
  let heatGeneration = 0;

  for (const node of Object.values(nodes)) {
    const definition = nodeDefinitionsByNodeId[node.id];

    if (definition === undefined || !node.enabled) {
      continue;
    }

    powerCapacity += definition.baseStats.powerCapacity ?? 0;
    powerUsage += definition.baseStats.powerUse;
    heatCapacity += definition.baseStats.coolingCapacity ?? 0;
    heatGeneration += definition.baseStats.heatOutput;
  }

  return {
    powerCapacity,
    powerUsage,
    heatCapacity,
    heatGeneration,
    heatPressurePercent:
      heatCapacity <= 0
        ? heatGeneration > 0
          ? 100
          : 0
        : (heatGeneration / heatCapacity) * 100
  };
}

function calculateGlobalConstraint(
  infrastructureLoad: InfrastructureLoad
): GlobalConstraint {
  const powerFactor = calculateCapacityFactor(
    infrastructureLoad.powerCapacity,
    infrastructureLoad.powerUsage
  );
  const heatFactor = calculateCapacityFactor(
    infrastructureLoad.heatCapacity,
    infrastructureLoad.heatGeneration
  );
  const factor = Math.min(powerFactor, heatFactor);

  if (factor >= 1) {
    return { factor: 1 };
  }

  return {
    factor,
    bottleneckReason:
      powerFactor <= heatFactor ? "power_limited" : "heat_throttled"
  };
}

function calculateCapacityFactor(capacity: number, demand: number): number {
  if (demand <= 0) {
    return 1;
  }

  return Math.max(0, Math.min(1, capacity / demand));
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
  rates: FullResourceMap,
  globalConstraint: GlobalConstraint
): void {
  let producedAny = false;
  const hasConfiguredOutput = Object.values(definition.baseStats.produces).some(
    (perSecond) => perSecond > 0
  );

  for (const [resourceId, perSecond] of Object.entries(
    definition.baseStats.produces
  )) {
    const constrainedRate = perSecond * globalConstraint.factor;
    const producedAmount = constrainedRate * deltaSeconds;
    incrementResource(node.outputBuffers, resourceId as ResourceId, producedAmount);
    incrementResource(
      node.runtime.outputRate,
      resourceId as ResourceId,
      constrainedRate
    );
    rates[resourceId as ResourceId] += constrainedRate;
    producedAny = producedAny || producedAmount > 0;
  }

  if (globalConstraint.bottleneckReason !== undefined && hasConfiguredOutput) {
    setBottleneck(
      node,
      globalConstraint.bottleneckReason,
      globalConstraint.factor
    );
  } else if (producedAny) {
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
  deltaSeconds: number,
  globalConstraint: GlobalConstraint
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

  const throughputFactor = Math.min(
    inputFactor,
    computeFactor,
    globalConstraint.factor
  );

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

  if (throughputFactor < 1) {
    setBottleneck(
      node,
      getLimitingBottleneckReason(inputFactor, computeFactor, globalConstraint),
      throughputFactor
    );
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

function getLimitingBottleneckReason(
  inputFactor: number,
  computeFactor: number,
  globalConstraint: GlobalConstraint
): BottleneckReason {
  const candidates: Array<{
    factor: number;
    priority: number;
    reason: BottleneckReason;
  }> = [
    {
      factor: inputFactor,
      priority: 2,
      reason: "input_starved"
    },
    {
      factor: computeFactor,
      priority: 1,
      reason: "compute_limited"
    }
  ];

  if (globalConstraint.bottleneckReason !== undefined) {
    candidates.push({
      factor: globalConstraint.factor,
      priority: 0,
      reason: globalConstraint.bottleneckReason
    });
  }

  const bestCandidate = candidates.sort(
    (left, right) => left.factor - right.factor || left.priority - right.priority
  )[0];

  return bestCandidate?.reason ?? "input_starved";
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
  deltaSeconds: number,
  infrastructureLoad: InfrastructureLoad
): FullResourceMap {
  const balances = createZeroResourceMap();

  balances.money = startingBalances.money + rates.money * deltaSeconds;
  balances.research = startingBalances.research + rates.research * deltaSeconds;
  balances.power = Math.max(
    0,
    infrastructureLoad.powerCapacity - infrastructureLoad.powerUsage
  );
  balances.heat = infrastructureLoad.heatPressurePercent;

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
  reason: BottleneckReason,
  utilization = 0
): void {
  node.status = reason;
  node.runtime.bottleneckReason = reason;
  node.runtime.utilization = utilization;
  node.runtime.effectiveThroughput = utilization;
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
