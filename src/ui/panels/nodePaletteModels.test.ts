import { describe, expect, it } from "vitest";

import { nodeDefinitions } from "../../game/data/nodeDefinitions";
import { createInitialGameState } from "../../game/state/initialState";
import { buildNodePaletteModel } from "./nodePaletteModels";

import type { GameState } from "../../game/state/types";

describe("node palette model", () => {
  it("shows available node definitions with cost and affordability", () => {
    const state = withMoney(
      createInitialGameState("2026-06-16T00:00:00.000Z"),
      120
    );

    const model = buildNodePaletteModel(state, nodeDefinitions);

    expect(model.totalCount).toBe(nodeDefinitions.length);
    expect(model.affordableCount).toBe(3);
    expect(model.items.map((item) => item.definitionId)).toEqual([
      "internet_feed",
      "parser",
      "cleaner",
      "upload_gateway",
      "cpu_rack",
      "research_lab"
    ]);
    expect(model.items[0]).toMatchObject({
      definitionId: "internet_feed",
      name: "Internet Feed",
      categoryLabel: "Data Source",
      cost: 0,
      costLabel: "Free",
      currentMoney: 120,
      canPlace: true
    });
    expect(model.items.find((item) => item.definitionId === "cpu_rack"))
      .toMatchObject({
        cost: 200,
        costLabel: "$200",
        canPlace: false,
        disabledReason: "Needs $200"
      });
  });

  it("keeps model stable when the player has no money", () => {
    const model = buildNodePaletteModel(
      createInitialGameState("2026-06-16T00:00:00.000Z"),
      nodeDefinitions
    );

    expect(model.affordableCount).toBe(1);
    expect(model.items.filter((item) => item.canPlace)).toHaveLength(1);
    expect(model.items.find((item) => item.definitionId === "parser"))
      .toMatchObject({
        canPlace: false,
        disabledReason: "Needs $50"
      });
  });
});

function withMoney(state: GameState, money: number): GameState {
  return {
    ...state,
    resources: {
      ...state.resources,
      balances: {
        ...state.resources.balances,
        money
      }
    }
  };
}
