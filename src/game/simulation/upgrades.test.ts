import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";

import {
  applyNodeUpgradeScaling,
  calculateMaxAffordableUpgrade,
  calculateNextUpgradeCost
} from "./upgrades";

describe("node upgrade model", () => {
  it("calculates deterministic next costs from level and cost growth", () => {
    const parser = getNodeDefinition("parser");

    expect(calculateNextUpgradeCost(parser, 1)).toBe(61);
    expect(calculateNextUpgradeCost(parser, 2)).toBe(75);
  });

  it("calculates the max affordable upgrade count and total cost", () => {
    const parser = getNodeDefinition("parser");

    const preview = calculateMaxAffordableUpgrade(parser, 1, 140);

    expect(preview).toEqual({
      currentLevel: 1,
      targetLevel: 3,
      upgradeCount: 2,
      totalCost: 136,
      nextCost: 91
    });
  });

  it("applies level scaling to existing node stats only", () => {
    const cpuRack = getNodeDefinition("cpu_rack");

    const upgraded = applyNodeUpgradeScaling(cpuRack, 2);

    expect(upgraded.baseStats.computeProduced).toBeCloseTo(12);
    expect(upgraded.baseStats.produces.compute).toBeCloseTo(12);
    expect(upgraded.baseStats.powerUse).toBeCloseTo(5.35);
    expect(upgraded.baseStats.heatOutput).toBeCloseTo(4.32);
  });

  it("keeps level one definitions unchanged", () => {
    const cleaner = getNodeDefinition("cleaner");

    expect(applyNodeUpgradeScaling(cleaner, 1)).toBe(cleaner);
  });
});

function getNodeDefinition(id: string) {
  const definition = nodeDefinitionsById[id];

  if (definition === undefined) {
    throw new Error(`Missing node definition ${id}.`);
  }

  return definition;
}
