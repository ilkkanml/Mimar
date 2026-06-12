import type {
  NodeDefinition,
  NodeDefinitionId,
  ResearchDefinition,
  ResearchId,
  ResearchState,
  ResourceId,
  ResourceMap
} from "../state/types";

export type ResearchInfrastructureModifiers = {
  powerCapacityBonus: number;
  heatCapacityBonus: number;
};

export function applyResearchEffectsToNodeDefinitions(
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  research: ResearchState,
  researchDefinitionsById: Readonly<Record<ResearchId, ResearchDefinition>>
): Readonly<Record<NodeDefinitionId, NodeDefinition>> {
  const unlockedDefinitions = getUnlockedResearchDefinitions(
    research,
    researchDefinitionsById
  );
  const modifiedDefinitions: Record<NodeDefinitionId, NodeDefinition> = {};

  for (const [definitionId, definition] of Object.entries(
    nodeDefinitionsById
  )) {
    let nextDefinition = definition;

    for (const researchDefinition of unlockedDefinitions) {
      if (
        researchDefinition.targetNodeDefinitionId !== definitionId ||
        isGlobalResearchEffect(researchDefinition.effectType)
      ) {
        continue;
      }

      nextDefinition = applyNodeResearchEffect(nextDefinition, researchDefinition);
    }

    modifiedDefinitions[definitionId] = nextDefinition;
  }

  return modifiedDefinitions;
}

export function calculateResearchInfrastructureModifiers(
  research: ResearchState,
  researchDefinitionsById: Readonly<Record<ResearchId, ResearchDefinition>>
): ResearchInfrastructureModifiers {
  return getUnlockedResearchDefinitions(research, researchDefinitionsById).reduce(
    (modifiers, definition) => {
      switch (definition.effectType) {
        case "global_power_capacity_add":
          return {
            ...modifiers,
            powerCapacityBonus:
              modifiers.powerCapacityBonus + definition.effectValue
          };
        case "global_heat_capacity_add":
          return {
            ...modifiers,
            heatCapacityBonus:
              modifiers.heatCapacityBonus + definition.effectValue
          };
        case "node_compute_use_multiplier":
        case "node_heat_output_multiplier":
        case "node_output_multiplier":
        case "node_power_use_multiplier":
        case "node_throughput_multiplier":
          return modifiers;
      }
    },
    {
      powerCapacityBonus: 0,
      heatCapacityBonus: 0
    }
  );
}

function applyNodeResearchEffect(
  definition: NodeDefinition,
  researchDefinition: ResearchDefinition
): NodeDefinition {
  switch (researchDefinition.effectType) {
    case "node_compute_use_multiplier":
      return {
        ...definition,
        baseStats: {
          ...definition.baseStats,
          consumes: multiplyResource(
            definition.baseStats.consumes,
            "compute",
            researchDefinition.effectValue
          ),
          computeUsed:
            definition.baseStats.computeUsed * researchDefinition.effectValue
        }
      };
    case "node_heat_output_multiplier":
      return {
        ...definition,
        baseStats: {
          ...definition.baseStats,
          heatOutput:
            definition.baseStats.heatOutput * researchDefinition.effectValue
        }
      };
    case "node_output_multiplier":
      return researchDefinition.targetResourceId === undefined
        ? definition
        : {
            ...definition,
            baseStats: {
              ...definition.baseStats,
              produces: multiplyResource(
                definition.baseStats.produces,
                researchDefinition.targetResourceId,
                researchDefinition.effectValue
              )
            }
          };
    case "node_power_use_multiplier":
      return {
        ...definition,
        baseStats: {
          ...definition.baseStats,
          powerUse: definition.baseStats.powerUse * researchDefinition.effectValue
        }
      };
    case "node_throughput_multiplier":
      return {
        ...definition,
        baseStats: {
          ...definition.baseStats,
          consumes: multiplyNonComputeResources(
            definition.baseStats.consumes,
            researchDefinition.effectValue
          ),
          produces: multiplyAllResources(
            definition.baseStats.produces,
            researchDefinition.effectValue
          )
        }
      };
    case "global_heat_capacity_add":
    case "global_power_capacity_add":
      return definition;
  }
}

function getUnlockedResearchDefinitions(
  research: ResearchState,
  researchDefinitionsById: Readonly<Record<ResearchId, ResearchDefinition>>
): ResearchDefinition[] {
  return research.unlockedResearchIds.flatMap((researchId) => {
    const definition = researchDefinitionsById[researchId];
    return definition === undefined ? [] : [definition];
  });
}

function isGlobalResearchEffect(effectType: ResearchDefinition["effectType"]): boolean {
  return (
    effectType === "global_power_capacity_add" ||
    effectType === "global_heat_capacity_add"
  );
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
