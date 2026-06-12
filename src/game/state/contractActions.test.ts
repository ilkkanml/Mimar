import { describe, expect, it } from "vitest";

import { contractDefinitionsById } from "../data/contracts";
import { createInitialGameState } from "./initialState";
import { createContractRuntimeState } from "./contracts";

import { claimContractReward } from "./contractActions";

import type { ContractDefinitionId, GameState } from "./types";

describe("contract reward claims", () => {
  it("claims completed rewards once and moves the contract to claimed", () => {
    const state = createCompletedContractState("clean_data_delivery");
    const startingMoney = state.resources.balances.money;
    const startingResearch = state.resources.balances.research;

    const result = claimContractReward(
      state,
      contractDefinitionsById,
      "clean_data_delivery"
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.state.resources.balances.money).toBe(startingMoney + 250);
    expect(result.state.resources.balances.research).toBe(
      startingResearch + 2
    );
    expect(result.state.contracts.completed).toEqual([]);
    expect(result.state.contracts.claimed).toEqual([
      {
        id: "clean_data_delivery",
        currentProgress: 50,
        status: "claimed"
      }
    ]);
  });

  it("prevents duplicate reward claims", () => {
    const firstClaim = claimContractReward(
      createCompletedContractState("clean_data_delivery"),
      contractDefinitionsById,
      "clean_data_delivery"
    );

    expect(firstClaim.ok).toBe(true);
    if (!firstClaim.ok) {
      return;
    }

    const secondClaim = claimContractReward(
      firstClaim.state,
      contractDefinitionsById,
      "clean_data_delivery"
    );

    expect(secondClaim.ok).toBe(false);
    if (secondClaim.ok) {
      return;
    }

    expect(secondClaim.reason).toBe("already_claimed");
    expect(secondClaim.state.resources.balances.money).toBe(
      firstClaim.state.resources.balances.money
    );
    expect(secondClaim.state.contracts.claimed).toHaveLength(1);
  });

  it("does not claim contracts before completion", () => {
    const result = claimContractReward(
      createInitialGameState("2026-06-11T00:00:00.000Z"),
      contractDefinitionsById,
      "starter_intake_check"
    );

    expect(result).toMatchObject({
      ok: false,
      reason: "not_completed"
    });
  });
});

function createCompletedContractState(id: ContractDefinitionId): GameState {
  const state = createInitialGameState("2026-06-11T00:00:00.000Z");
  const definition = contractDefinitionsById[id];

  if (definition === undefined) {
    throw new Error(`Missing contract definition ${id}`);
  }

  return {
    ...state,
    contracts: {
      available: state.contracts.available.filter(
        (contract) => contract.id !== id
      ),
      active: state.contracts.active.filter((contract) => contract.id !== id),
      completed: [
        createContractRuntimeState(id, "completed", definition.requiredAmount)
      ],
      claimed: []
    }
  };
}
