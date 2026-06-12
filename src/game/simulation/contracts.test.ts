import { describe, expect, it } from "vitest";

import { contractDefinitionsById } from "../data/contracts";
import { createZeroResourceMap } from "../state/initialState";
import { createContractRuntimeState } from "../state/contracts";

import { evaluateContractProgress } from "./contracts";

import type { ContractDefinitionId, ContractState } from "../state/types";

describe("contract progress evaluation", () => {
  it("adds deterministic progress from produced resource rates", () => {
    const rates = createZeroResourceMap();
    rates.rawData = 10;
    const contracts = createActiveContractState("starter_intake_check");

    const nextContracts = evaluateContractProgress(
      contracts,
      contractDefinitionsById,
      rates,
      1
    );

    expect(nextContracts.active).toEqual([
      {
        id: "starter_intake_check",
        currentProgress: 10,
        status: "active"
      }
    ]);
    expect(nextContracts.completed).toEqual([]);
    expect(contracts.active[0]?.currentProgress).toBe(0);
  });

  it("moves active contracts to completed when the required amount is reached", () => {
    const rates = createZeroResourceMap();
    rates.rawData = 20;
    const contracts = createActiveContractState("starter_intake_check", 10);

    const nextContracts = evaluateContractProgress(
      contracts,
      contractDefinitionsById,
      rates,
      1
    );

    expect(nextContracts.active).toEqual([]);
    expect(nextContracts.completed).toEqual([
      {
        id: "starter_intake_check",
        currentProgress: 25,
        status: "completed"
      }
    ]);
  });

  it("tracks upload money contracts from money output rate", () => {
    const rates = createZeroResourceMap();
    rates.money = 100;
    const contracts = createActiveContractState("upload_revenue_trial", 50);

    const nextContracts = evaluateContractProgress(
      contracts,
      contractDefinitionsById,
      rates,
      2
    );

    expect(nextContracts.active).toEqual([
      {
        id: "upload_revenue_trial",
        currentProgress: 250,
        status: "active"
      }
    ]);
  });
});

function createActiveContractState(
  id: ContractDefinitionId,
  currentProgress = 0
): ContractState {
  return {
    available: [],
    active: [createContractRuntimeState(id, "active", currentProgress)],
    completed: [],
    claimed: []
  };
}
