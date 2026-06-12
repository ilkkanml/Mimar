import type {
  ContractDefinition,
  ContractDefinitionId,
  ContractRuntimeState,
  GameState
} from "./types";

export type ClaimContractRewardResult =
  | {
      ok: true;
      state: GameState;
      contract: ContractRuntimeState;
    }
  | {
      ok: false;
      state: GameState;
      reason: "already_claimed" | "contract_not_found" | "not_completed";
    };

export function claimContractReward(
  state: GameState,
  contractDefinitionsById: Readonly<
    Record<ContractDefinitionId, ContractDefinition>
  >,
  contractId: ContractDefinitionId
): ClaimContractRewardResult {
  const definition = contractDefinitionsById[contractId];

  if (definition === undefined) {
    return {
      ok: false,
      state,
      reason: "contract_not_found"
    };
  }

  if (state.contracts.claimed.some((contract) => contract.id === contractId)) {
    return {
      ok: false,
      state,
      reason: "already_claimed"
    };
  }

  const completedContract = state.contracts.completed.find(
    (contract) => contract.id === contractId
  );

  if (completedContract === undefined) {
    return {
      ok: false,
      state,
      reason: "not_completed"
    };
  }

  const claimedContract: ContractRuntimeState = {
    ...completedContract,
    currentProgress: definition.requiredAmount,
    status: "claimed"
  };

  return {
    ok: true,
    contract: claimedContract,
    state: {
      ...state,
      resources: {
        ...state.resources,
        balances: {
          ...state.resources.balances,
          money: state.resources.balances.money + definition.rewardMoney,
          research:
            state.resources.balances.research + (definition.rewardResearch ?? 0)
        }
      },
      contracts: {
        ...state.contracts,
        completed: state.contracts.completed.filter(
          (contract) => contract.id !== contractId
        ),
        claimed: [...state.contracts.claimed, claimedContract]
      }
    }
  };
}
