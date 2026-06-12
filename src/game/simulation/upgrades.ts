import type {
  NodeDefinition,
  NodeStats,
  NodeUpgradeScaling,
  PortDefinition,
  ResourceId,
  ResourceMap
} from "../state/types";

export const MINIMUM_UPGRADE_BASE_COST = 1;
export const MAX_BUY_MAX_UPGRADES = 10_000;

export type UpgradePurchasePreview = {
  currentLevel: number;
  targetLevel: number;
  upgradeCount: number;
  totalCost: number;
  nextCost: number;
};

export function normalizeNodeLevel(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.floor(value))
    : 1;
}

export function hasNodeUpgradeScaling(definition: NodeDefinition): boolean {
  return Object.values(definition.upgradeScaling).some(
    (value) => value !== undefined
  );
}

export function calculateNextUpgradeCost(
  definition: NodeDefinition,
  currentLevel: number
): number {
  const baseCost = Math.max(MINIMUM_UPGRADE_BASE_COST, definition.baseCost);
  const growth = Math.max(1, definition.costGrowth);
  const rawCost = baseCost * Math.pow(growth, normalizeNodeLevel(currentLevel));

  return Math.max(MINIMUM_UPGRADE_BASE_COST, Math.ceil(rawCost));
}

export function calculateMaxAffordableUpgrade(
  definition: NodeDefinition,
  currentLevel: number,
  availableMoney: number
): UpgradePurchasePreview {
  let remainingMoney = Math.max(0, availableMoney);
  let targetLevel = normalizeNodeLevel(currentLevel);
  let totalCost = 0;
  let upgradeCount = 0;
  let nextCost = calculateNextUpgradeCost(definition, targetLevel);

  if (!hasNodeUpgradeScaling(definition)) {
    return {
      currentLevel: targetLevel,
      targetLevel,
      upgradeCount: 0,
      totalCost: 0,
      nextCost
    };
  }

  while (
    upgradeCount < MAX_BUY_MAX_UPGRADES &&
    remainingMoney + Number.EPSILON >= nextCost
  ) {
    remainingMoney -= nextCost;
    totalCost += nextCost;
    targetLevel += 1;
    upgradeCount += 1;
    nextCost = calculateNextUpgradeCost(definition, targetLevel);
  }

  return {
    currentLevel: normalizeNodeLevel(currentLevel),
    targetLevel,
    upgradeCount,
    totalCost,
    nextCost
  };
}

export function applyNodeUpgradeScaling(
  definition: NodeDefinition,
  level: number
): NodeDefinition {
  const upgradeLevels = normalizeNodeLevel(level) - 1;

  if (upgradeLevels <= 0 || !hasNodeUpgradeScaling(definition)) {
    return definition;
  }

  const scaling = definition.upgradeScaling;
  let baseStats: NodeStats = {
    ...definition.baseStats,
    produces: { ...definition.baseStats.produces },
    consumes: { ...definition.baseStats.consumes }
  };
  let inputs = clonePorts(definition.inputs);
  let outputs = clonePorts(definition.outputs);

  const throughputMultiplier = getLevelMultiplier(
    scaling.throughputMultiplierPerLevel,
    upgradeLevels
  );

  if (throughputMultiplier !== 1) {
    baseStats = {
      ...baseStats,
      consumes: multiplyNonComputeResources(
        baseStats.consumes,
        throughputMultiplier
      ),
      produces: multiplyAllResources(baseStats.produces, throughputMultiplier)
    };
    inputs = multiplyPortThroughput(inputs, throughputMultiplier);
    outputs = multiplyPortThroughput(outputs, throughputMultiplier);
  }

  baseStats = applyCapacityScaling(baseStats, scaling, upgradeLevels);
  baseStats = applyConsumptionScaling(baseStats, scaling, upgradeLevels);
  baseStats = applyOutputEfficiencyScaling(baseStats, scaling, upgradeLevels);

  return {
    ...definition,
    inputs,
    outputs,
    baseStats
  };
}

function applyCapacityScaling(
  baseStats: NodeStats,
  scaling: NodeUpgradeScaling,
  upgradeLevels: number
): NodeStats {
  let nextStats = { ...baseStats };
  const computeProducedMultiplier = getLevelMultiplier(
    scaling.computeProducedMultiplierPerLevel,
    upgradeLevels
  );
  const powerCapacityMultiplier = getLevelMultiplier(
    scaling.powerCapacityMultiplierPerLevel,
    upgradeLevels
  );
  const coolingCapacityMultiplier = getLevelMultiplier(
    scaling.coolingCapacityMultiplierPerLevel,
    upgradeLevels
  );

  if (computeProducedMultiplier !== 1) {
    nextStats = {
      ...nextStats,
      computeProduced: nextStats.computeProduced * computeProducedMultiplier,
      produces: multiplyResource(
        nextStats.produces,
        "compute",
        computeProducedMultiplier
      )
    };
  }

  if (
    powerCapacityMultiplier !== 1 &&
    nextStats.powerCapacity !== undefined
  ) {
    nextStats = {
      ...nextStats,
      powerCapacity: nextStats.powerCapacity * powerCapacityMultiplier
    };
  }

  if (
    coolingCapacityMultiplier !== 1 &&
    nextStats.coolingCapacity !== undefined
  ) {
    nextStats = {
      ...nextStats,
      coolingCapacity: nextStats.coolingCapacity * coolingCapacityMultiplier
    };
  }

  return nextStats;
}

function applyConsumptionScaling(
  baseStats: NodeStats,
  scaling: NodeUpgradeScaling,
  upgradeLevels: number
): NodeStats {
  let nextStats = { ...baseStats };
  const computeUseMultiplier = getLevelMultiplier(
    scaling.computeUseMultiplierPerLevel,
    upgradeLevels
  );
  const powerUseMultiplier = getLevelMultiplier(
    scaling.powerUseMultiplierPerLevel,
    upgradeLevels
  );
  const heatOutputMultiplier = getLevelMultiplier(
    scaling.heatOutputMultiplierPerLevel,
    upgradeLevels
  );

  if (computeUseMultiplier !== 1) {
    nextStats = {
      ...nextStats,
      computeUsed: nextStats.computeUsed * computeUseMultiplier,
      consumes: multiplyResource(
        nextStats.consumes,
        "compute",
        computeUseMultiplier
      )
    };
  }

  if (powerUseMultiplier !== 1) {
    nextStats = {
      ...nextStats,
      powerUse: nextStats.powerUse * powerUseMultiplier
    };
  }

  if (heatOutputMultiplier !== 1) {
    nextStats = {
      ...nextStats,
      heatOutput: nextStats.heatOutput * heatOutputMultiplier
    };
  }

  return nextStats;
}

function applyOutputEfficiencyScaling(
  baseStats: NodeStats,
  scaling: NodeUpgradeScaling,
  upgradeLevels: number
): NodeStats {
  let nextStats = { ...baseStats };
  const researchMultiplier = getLevelMultiplier(
    scaling.researchMultiplierPerLevel,
    upgradeLevels
  );
  const valueMultiplier = getLevelMultiplier(
    scaling.valueMultiplierPerLevel,
    upgradeLevels
  );

  if (researchMultiplier !== 1) {
    nextStats = {
      ...nextStats,
      produces: multiplyResource(
        nextStats.produces,
        "research",
        researchMultiplier
      )
    };
  }

  if (valueMultiplier !== 1) {
    nextStats = {
      ...nextStats,
      produces: multiplyResource(nextStats.produces, "money", valueMultiplier)
    };

    if (nextStats.valuePerCleanData !== undefined) {
      nextStats = {
        ...nextStats,
        valuePerCleanData: nextStats.valuePerCleanData * valueMultiplier
      };
    }
  }

  return nextStats;
}

function getLevelMultiplier(
  multiplierPerLevel: number | undefined,
  upgradeLevels: number
): number {
  return multiplierPerLevel === undefined
    ? 1
    : Math.pow(multiplierPerLevel, upgradeLevels);
}

function clonePorts(ports: readonly PortDefinition[]): PortDefinition[] {
  return ports.map((port) => ({ ...port }));
}

function multiplyPortThroughput(
  ports: readonly PortDefinition[],
  multiplier: number
): PortDefinition[] {
  return ports.map((port) => ({
    ...port,
    throughput: port.throughput * multiplier
  }));
}

function multiplyResource(
  resourceMap: ResourceMap,
  resourceId: ResourceId,
  multiplier: number
): ResourceMap {
  if (resourceMap[resourceId] === undefined) {
    return { ...resourceMap };
  }

  return {
    ...resourceMap,
    [resourceId]: (resourceMap[resourceId] ?? 0) * multiplier
  };
}

function multiplyNonComputeResources(
  resourceMap: ResourceMap,
  multiplier: number
): ResourceMap {
  return Object.fromEntries(
    Object.entries(resourceMap).map(([resourceId, value]) => [
      resourceId,
      resourceId === "compute" ? value : value * multiplier
    ])
  ) as ResourceMap;
}

function multiplyAllResources(
  resourceMap: ResourceMap,
  multiplier: number
): ResourceMap {
  return Object.fromEntries(
    Object.entries(resourceMap).map(([resourceId, value]) => [
      resourceId,
      value * multiplier
    ])
  ) as ResourceMap;
}
