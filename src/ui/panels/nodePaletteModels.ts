import { getNodePlacementCost } from "../../game/state/nodePlacement";

import type {
  GameState,
  NodeDefinition,
  NodeDefinitionId
} from "../../game/state/types";

export type NodePaletteItemModel = {
  definitionId: NodeDefinitionId;
  name: string;
  categoryLabel: string;
  description: string;
  cost: number;
  costLabel: string;
  currentMoney: number;
  canPlace: boolean;
  disabledReason?: string;
};

export type NodePaletteModel = {
  items: NodePaletteItemModel[];
  affordableCount: number;
  totalCount: number;
};

export function buildNodePaletteModel(
  state: GameState,
  nodeDefinitions: readonly NodeDefinition[]
): NodePaletteModel {
  const currentMoney = state.resources.balances.money;
  const items = nodeDefinitions.map((definition) =>
    buildNodePaletteItemModel(definition, currentMoney)
  );

  return {
    items,
    affordableCount: items.filter((item) => item.canPlace).length,
    totalCount: items.length
  };
}

function buildNodePaletteItemModel(
  definition: NodeDefinition,
  currentMoney: number
): NodePaletteItemModel {
  const cost = getNodePlacementCost(definition);
  const canPlace = currentMoney >= cost;
  const model: NodePaletteItemModel = {
    definitionId: definition.id,
    name: definition.name,
    categoryLabel: formatCategoryLabel(definition.category),
    description: definition.description,
    cost,
    costLabel: cost <= 0 ? "Free" : `$${formatCompactNumber(cost)}`,
    currentMoney,
    canPlace
  };

  if (!canPlace) {
    model.disabledReason = `Needs $${formatCompactNumber(cost)}`;
  }

  return model;
}

function formatCategoryLabel(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCompactNumber(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000) {
    return `${trimCompactNumber(value / 1_000_000)}M`;
  }

  if (absValue >= 1_000) {
    return `${trimCompactNumber(value / 1_000)}K`;
  }

  return trimCompactNumber(value);
}

function trimCompactNumber(value: number): string {
  const roundedValue = Math.round(value * 10) / 10;

  return Number.isInteger(roundedValue)
    ? `${roundedValue}`
    : roundedValue.toFixed(1);
}
