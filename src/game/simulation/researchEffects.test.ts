import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { researchDefinitionsById } from "../data/research";
import { createInitialGameState } from "../state/initialState";

import {
  applyResearchEffectsToNodeDefinitions,
  calculateResearchInfrastructureModifiers
} from "./researchEffects";

describe("research effects", () => {
  it("applies unlocked node stat modifiers without mutating base definitions", () => {
    const state = withUnlockedResearch([
      "parser_optimization",
      "upload_compression"
    ]);

    const effectiveDefinitions = applyResearchEffectsToNodeDefinitions(
      nodeDefinitionsById,
      state.research,
      researchDefinitionsById
    );

    expect(effectiveDefinitions.parser?.baseStats.computeUsed).toBeCloseTo(1.6);
    expect(effectiveDefinitions.parser?.baseStats.consumes.compute).toBeCloseTo(
      1.6
    );
    expect(
      effectiveDefinitions.upload_gateway?.baseStats.produces.money
    ).toBeCloseTo(57.5);
    expect(nodeDefinitionsById.parser?.baseStats.computeUsed).toBe(2);
    expect(nodeDefinitionsById.upload_gateway?.baseStats.produces.money).toBe(
      50
    );
  });

  it("derives global power and heat capacity modifiers from unlocked research", () => {
    const state = withUnlockedResearch(["cooling_discipline", "power_routing"]);

    const modifiers = calculateResearchInfrastructureModifiers(
      state.research,
      researchDefinitionsById
    );

    expect(modifiers).toEqual({
      powerCapacityBonus: 3,
      heatCapacityBonus: 2
    });
  });
});

function withUnlockedResearch(researchIds: string[]) {
  const state = createInitialGameState("2026-06-11T00:00:00.000Z");

  return {
    ...state,
    research: {
      availableResearchIds: [],
      unlockedResearchIds: researchIds,
      spentResearchPoints: 0
    }
  };
}
