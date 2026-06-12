import type {
  ContractDefinition,
  ContractDefinitionId,
  ContractRuntimeState,
  ContractState,
  FullResourceMap
} from "../state/types";

export function evaluateContractProgress(
  contracts: ContractState,
  contractDefinitionsById: Readonly<
    Record<ContractDefinitionId, ContractDefinition>
  >,
  rates: FullResourceMap,
  deltaSeconds: number
): ContractState {
  const active: ContractRuntimeState[] = [];
  const completed: ContractRuntimeState[] = [
    ...contracts.completed.map((contract) => ({ ...contract }))
  ];

  for (const contract of contracts.active) {
    const definition = contractDefinitionsById[contract.id];

    if (definition === undefined) {
      active.push({ ...contract });
      continue;
    }

    const nextProgress = Math.min(
      definition.requiredAmount,
      contract.currentProgress +
        calculateContractProgressIncrement(definition, rates, deltaSeconds)
    );

    if (nextProgress >= definition.requiredAmount) {
      completed.push({
        ...contract,
        currentProgress: nextProgress,
        status: "completed"
      });
      continue;
    }

    active.push({
      ...contract,
      currentProgress: nextProgress,
      status: "active"
    });
  }

  return {
    available: contracts.available.map((contract) => ({ ...contract })),
    active,
    completed,
    claimed: contracts.claimed.map((contract) => ({ ...contract }))
  };
}

function calculateContractProgressIncrement(
  definition: ContractDefinition,
  rates: FullResourceMap,
  deltaSeconds: number
): number {
  const safeDeltaSeconds = Math.max(0, deltaSeconds);

  switch (definition.requirementType) {
    case "produce_resource":
      return definition.requirementResourceId === undefined
        ? 0
        : Math.max(0, rates[definition.requirementResourceId]) *
            safeDeltaSeconds;
    case "earn_money":
      return Math.max(0, rates.money) * safeDeltaSeconds;
  }
}
