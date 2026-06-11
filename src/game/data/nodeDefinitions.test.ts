import { describe, expect, it } from "vitest";

import {
  FIRST_SIX_NODE_DEFINITION_IDS,
  firstSixNodeDefinitions,
  nodeDefinitionsById
} from "./nodeDefinitions";

import {
  M1_RESOURCE_IDS,
  NODE_CATEGORIES,
  PORT_DIRECTIONS
} from "../state/types";

const snakeCaseIdPattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const m1ResourceIds = new Set<string>(M1_RESOURCE_IDS);
const nodeCategories = new Set<string>(NODE_CATEGORIES);
const portDirections = new Set<string>(PORT_DIRECTIONS);

describe("first six node definitions", () => {
  it("exports only the approved M1 node ids in backlog order", () => {
    expect(firstSixNodeDefinitions.map((definition) => definition.id)).toEqual(
      [...FIRST_SIX_NODE_DEFINITION_IDS]
    );
  });

  it("keeps stable lowercase snake_case ids", () => {
    for (const definition of firstSixNodeDefinitions) {
      expect(definition.id).toMatch(snakeCaseIdPattern);
    }
  });

  it("provides valid categories, ports, costs, and base stats", () => {
    for (const definition of firstSixNodeDefinitions) {
      expect(nodeCategories.has(definition.category)).toBe(true);
      expect(definition.name.length).toBeGreaterThan(0);
      expect(definition.description.length).toBeGreaterThan(0);
      expect(definition.baseCost).toBeGreaterThanOrEqual(0);
      expect(definition.costGrowth).toBeGreaterThanOrEqual(1);
      expect(definition.inputs.length + definition.outputs.length).toBeGreaterThan(
        0
      );
      expect(definition.baseStats.computeProduced).toBeGreaterThanOrEqual(0);
      expect(definition.baseStats.computeUsed).toBeGreaterThanOrEqual(0);
      expect(definition.baseStats.powerUse).toBeGreaterThanOrEqual(0);
      expect(definition.baseStats.heatOutput).toBeGreaterThanOrEqual(0);
      expect(definition.baseStats.storageCapacity).toBeGreaterThanOrEqual(0);
    }
  });

  it("uses only concrete M1 resource ids for ports and resource maps", () => {
    for (const definition of firstSixNodeDefinitions) {
      for (const port of [...definition.inputs, ...definition.outputs]) {
        expect(portDirections.has(port.direction)).toBe(true);
        expect(m1ResourceIds.has(port.resourceType)).toBe(true);
        expect(port.throughput).toBeGreaterThan(0);
      }

      for (const resourceId of Object.keys(definition.baseStats.produces)) {
        expect(m1ResourceIds.has(resourceId)).toBe(true);
      }

      for (const resourceId of Object.keys(definition.baseStats.consumes)) {
        expect(m1ResourceIds.has(resourceId)).toBe(true);
      }
    }
  });

  it("can be looked up by stable id", () => {
    for (const id of FIRST_SIX_NODE_DEFINITION_IDS) {
      expect(nodeDefinitionsById[id]?.id).toBe(id);
    }
  });
});
