import {
  contractDefinitions,
  contractDefinitionsById
} from "../data/contracts";

import type {
  ContractDefinitionId,
  ContractRuntimeState,
  ContractState,
  ContractStatus
} from "./types";

const CONTRACT_STATUS_KEYS = [
  "claimed",
  "completed",
  "active",
  "available"
] as const satisfies readonly ContractStatus[];

export function createInitialContractState(): ContractState {
  const [firstDefinition, ...remainingDefinitions] = contractDefinitions;

  return {
    available: remainingDefinitions.map((definition) =>
      createContractRuntimeState(definition.id, "available")
    ),
    active:
      firstDefinition === undefined
        ? []
        : [createContractRuntimeState(firstDefinition.id, "active")],
    completed: [],
    claimed: []
  };
}

export function createContractRuntimeState(
  id: ContractDefinitionId,
  status: ContractStatus,
  currentProgress = 0
): ContractRuntimeState {
  const definition = contractDefinitionsById[id];
  const clampedProgress =
    definition === undefined
      ? Math.max(0, currentProgress)
      : clampProgress(currentProgress, definition.requiredAmount);

  return {
    id,
    currentProgress: clampedProgress,
    status
  };
}

export function cloneContractState(state: ContractState): ContractState {
  return {
    available: state.available.map((contract) => ({ ...contract })),
    active: state.active.map((contract) => ({ ...contract })),
    completed: state.completed.map((contract) => ({ ...contract })),
    claimed: state.claimed.map((contract) => ({ ...contract }))
  };
}

export function normalizeContractState(value: unknown): ContractState {
  if (!isRecord(value) || !hasContractStateLists(value)) {
    return createInitialContractState();
  }

  const normalized: ContractState = {
    available: [],
    active: [],
    completed: [],
    claimed: []
  };
  const seenIds = new Set<ContractDefinitionId>();

  for (const status of CONTRACT_STATUS_KEYS) {
    const rawList = value[status];

    if (!Array.isArray(rawList)) {
      continue;
    }

    for (const rawContract of rawList) {
      const contract = normalizeContractRuntimeState(rawContract, status);

      if (contract === undefined || seenIds.has(contract.id)) {
        continue;
      }

      normalized[status].push(contract);
      seenIds.add(contract.id);
    }
  }

  for (const definition of contractDefinitions) {
    if (seenIds.has(definition.id)) {
      continue;
    }

    normalized.available.push(
      createContractRuntimeState(definition.id, "available")
    );
  }

  return normalized;
}

function normalizeContractRuntimeState(
  value: unknown,
  status: ContractStatus
): ContractRuntimeState | undefined {
  if (!isRecord(value) || typeof value.id !== "string") {
    return undefined;
  }

  const definition = contractDefinitionsById[value.id];

  if (definition === undefined || typeof value.currentProgress !== "number") {
    return undefined;
  }

  return createContractRuntimeState(
    definition.id,
    status,
    Number.isFinite(value.currentProgress) ? value.currentProgress : 0
  );
}

function hasContractStateLists(value: Record<string, unknown>): boolean {
  return (
    Array.isArray(value.available) &&
    Array.isArray(value.active) &&
    Array.isArray(value.completed) &&
    Array.isArray(value.claimed)
  );
}

function clampProgress(progress: number, requiredAmount: number): number {
  return Math.min(Math.max(0, progress), Math.max(0, requiredAmount));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
