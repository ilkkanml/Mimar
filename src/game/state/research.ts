import { researchDefinitions, researchDefinitionsById } from "../data/research";

import type { ResearchId, ResearchState } from "./types";

export function createInitialResearchState(): ResearchState {
  return {
    availableResearchIds: deriveAvailableResearchIds([]),
    unlockedResearchIds: [],
    spentResearchPoints: 0
  };
}

export function normalizeResearchState(value: unknown): ResearchState {
  if (!isRecord(value)) {
    return createInitialResearchState();
  }

  const unlockedResearchIds = normalizeResearchIds(
    readResearchIdList(value.unlockedResearchIds) ??
      readResearchIdList(value.purchasedResearchIds) ??
      []
  );
  const spentResearchPoints =
    typeof value.spentResearchPoints === "number" &&
    Number.isFinite(value.spentResearchPoints)
      ? Math.max(0, value.spentResearchPoints)
      : 0;

  return {
    availableResearchIds: deriveAvailableResearchIds(unlockedResearchIds),
    unlockedResearchIds,
    spentResearchPoints
  };
}

export function refreshResearchAvailability(
  research: ResearchState
): ResearchState {
  const unlockedResearchIds = normalizeResearchIds(research.unlockedResearchIds);

  return {
    ...research,
    availableResearchIds: deriveAvailableResearchIds(unlockedResearchIds),
    unlockedResearchIds
  };
}

export function deriveAvailableResearchIds(
  unlockedResearchIds: readonly ResearchId[]
): ResearchId[] {
  const unlocked = new Set(unlockedResearchIds);

  return researchDefinitions
    .filter(
      (definition) =>
        !unlocked.has(definition.id) &&
        definition.prerequisiteResearchIds.every((researchId) =>
          unlocked.has(researchId)
        )
    )
    .map((definition) => definition.id);
}

function normalizeResearchIds(values: readonly ResearchId[]): ResearchId[] {
  const seenIds = new Set<ResearchId>();
  const normalizedIds: ResearchId[] = [];

  for (const researchId of values) {
    if (
      researchDefinitionsById[researchId] === undefined ||
      seenIds.has(researchId)
    ) {
      continue;
    }

    normalizedIds.push(researchId);
    seenIds.add(researchId);
  }

  return normalizedIds;
}

function readResearchIdList(value: unknown): ResearchId[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item): item is ResearchId => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
