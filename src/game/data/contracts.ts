import type { ContractDefinition, ContractDefinitionId } from "../state/types";

export const contractDefinitions = [
  {
    id: "starter_intake_check",
    title: "Starter Intake Check",
    description: "Produce the first reliable raw data batch from the intake line.",
    requirementType: "produce_resource",
    requirementResourceId: "rawData",
    requiredAmount: 25,
    rewardMoney: 75,
    rewardResearch: 6
  },
  {
    id: "clean_data_delivery",
    title: "Clean Data Delivery",
    description: "Deliver a clean data batch for a small analytics request.",
    requirementType: "produce_resource",
    requirementResourceId: "cleanData",
    requiredAmount: 50,
    rewardMoney: 250,
    rewardResearch: 2
  },
  {
    id: "upload_revenue_trial",
    title: "Upload Revenue Trial",
    description: "Earn upload revenue through the first output gateway.",
    requirementType: "earn_money",
    requiredAmount: 300,
    rewardMoney: 300
  }
] as const satisfies readonly ContractDefinition[];

export const contractDefinitionsById = Object.freeze(
  Object.fromEntries(
    contractDefinitions.map((definition) => [definition.id, definition])
  ) as Record<ContractDefinitionId, ContractDefinition>
);
