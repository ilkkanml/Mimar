import { describe, expect, it } from "vitest";

import { researchDefinitionsById } from "../data/research";
import { createInitialGameState } from "./initialState";

import { unlockResearch } from "./researchActions";

describe("research unlock actions", () => {
  it("starts with prerequisite-free research available", () => {
    const state = createInitialGameState("2026-06-11T00:00:00.000Z");

    expect(state.research).toEqual({
      availableResearchIds: ["parser_optimization", "cooling_discipline"],
      unlockedResearchIds: [],
      spentResearchPoints: 0
    });
  });

  it("prevents unlocking when research points are insufficient", () => {
    const state = createInitialGameState("2026-06-11T00:00:00.000Z");

    const result = unlockResearch(
      state,
      researchDefinitionsById,
      "parser_optimization"
    );

    expect(result).toMatchObject({
      ok: false,
      reason: "insufficient_research"
    });
    expect(result.state.resources.balances.research).toBe(0);
    expect(result.state.research.unlockedResearchIds).toEqual([]);
  });

  it("prevents unlocking research with missing prerequisites", () => {
    const state = withResearchPoints(
      createInitialGameState("2026-06-11T00:00:00.000Z"),
      20
    );

    const result = unlockResearch(
      state,
      researchDefinitionsById,
      "cleaner_efficiency"
    );

    expect(result).toMatchObject({
      ok: false,
      reason: "locked"
    });
    expect(result.state.resources.balances.research).toBe(20);
  });

  it("unlocks available research, deducts points, and refreshes availability", () => {
    const state = withResearchPoints(
      createInitialGameState("2026-06-11T00:00:00.000Z"),
      6
    );

    const result = unlockResearch(
      state,
      researchDefinitionsById,
      "parser_optimization"
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.state.resources.balances.research).toBe(1);
    expect(result.state.research).toEqual({
      availableResearchIds: [
        "cooling_discipline",
        "cleaner_efficiency",
        "upload_compression"
      ],
      unlockedResearchIds: ["parser_optimization"],
      spentResearchPoints: 5
    });
  });

  it("prevents duplicate unlocks", () => {
    const state = withResearchPoints(
      createInitialGameState("2026-06-11T00:00:00.000Z"),
      10
    );
    const firstUnlock = unlockResearch(
      state,
      researchDefinitionsById,
      "parser_optimization"
    );

    expect(firstUnlock.ok).toBe(true);
    if (!firstUnlock.ok) {
      return;
    }

    const secondUnlock = unlockResearch(
      firstUnlock.state,
      researchDefinitionsById,
      "parser_optimization"
    );

    expect(secondUnlock).toMatchObject({
      ok: false,
      reason: "already_unlocked"
    });
    expect(secondUnlock.state.resources.balances.research).toBe(5);
    expect(secondUnlock.state.research.unlockedResearchIds).toEqual([
      "parser_optimization"
    ]);
  });
});

function withResearchPoints(state: ReturnType<typeof createInitialGameState>, points: number) {
  return {
    ...state,
    resources: {
      ...state.resources,
      balances: {
        ...state.resources.balances,
        research: points
      }
    }
  };
}
