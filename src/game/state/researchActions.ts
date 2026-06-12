import { refreshResearchAvailability } from "./research";

import type {
  GameState,
  ResearchDefinition,
  ResearchId,
  ResearchState
} from "./types";

export type UnlockResearchResult =
  | {
      ok: true;
      state: GameState;
      researchId: ResearchId;
    }
  | {
      ok: false;
      state: GameState;
      reason:
        | "already_unlocked"
        | "insufficient_research"
        | "locked"
        | "unknown_research";
    };

export function unlockResearch(
  state: GameState,
  researchDefinitionsById: Readonly<Record<ResearchId, ResearchDefinition>>,
  researchId: ResearchId
): UnlockResearchResult {
  const definition = researchDefinitionsById[researchId];

  if (definition === undefined) {
    return {
      ok: false,
      state,
      reason: "unknown_research"
    };
  }

  const research = refreshResearchAvailability(state.research);

  if (research.unlockedResearchIds.includes(researchId)) {
    return {
      ok: false,
      state,
      reason: "already_unlocked"
    };
  }

  if (!research.availableResearchIds.includes(researchId)) {
    return {
      ok: false,
      state,
      reason: "locked"
    };
  }

  if (state.resources.balances.research < definition.costResearch) {
    return {
      ok: false,
      state: {
        ...state,
        research
      },
      reason: "insufficient_research"
    };
  }

  const unlockedResearchIds = [...research.unlockedResearchIds, researchId];
  const nextResearch: ResearchState = refreshResearchAvailability({
    availableResearchIds: [],
    unlockedResearchIds,
    spentResearchPoints: research.spentResearchPoints + definition.costResearch
  });

  return {
    ok: true,
    researchId,
    state: {
      ...state,
      resources: {
        ...state.resources,
        balances: {
          ...state.resources.balances,
          research:
            state.resources.balances.research - definition.costResearch
        }
      },
      research: nextResearch
    }
  };
}
