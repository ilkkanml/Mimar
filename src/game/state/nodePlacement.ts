import { addNode, selectNode } from "./actions";

import type {
  GameState,
  NodeDefinition,
  NodeDefinitionId,
  NodeInstance,
  Vec2
} from "./types";

export type PlaceNodeFailureReason =
  | "missing_definition"
  | "insufficient_money";

export type PlaceNodeInput = {
  definitionId: NodeDefinitionId;
  position?: Vec2;
};

export type PlaceNodeResult =
  | {
      ok: true;
      state: GameState;
      node: NodeInstance;
      cost: number;
    }
  | {
      ok: false;
      state: GameState;
      reason: PlaceNodeFailureReason;
      cost?: number;
    };

export function getNodePlacementCost(definition: NodeDefinition): number {
  return Math.max(0, Math.round(definition.baseCost));
}

export function getNextNodePlacementPosition(state: GameState): Vec2 {
  const occupied = new Set(
    Object.values(state.graph.nodes).map((node) =>
      createPositionKey(node.position)
    )
  );
  let index = Object.keys(state.graph.nodes).length;

  while (index < 200) {
    const position = {
      x: 180 + (index % 4) * 240,
      y: 360 + Math.floor(index / 4) * 120
    };

    if (!occupied.has(createPositionKey(position))) {
      return position;
    }

    index += 1;
  }

  return {
    x: 180,
    y: 360 + Object.keys(state.graph.nodes).length * 24
  };
}

export function placeNode(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  input: PlaceNodeInput
): PlaceNodeResult {
  const definition = nodeDefinitionsById[input.definitionId];

  if (definition === undefined) {
    return {
      ok: false,
      state,
      reason: "missing_definition"
    };
  }

  const cost = getNodePlacementCost(definition);

  if (state.resources.balances.money < cost) {
    return {
      ok: false,
      state,
      reason: "insufficient_money",
      cost
    };
  }

  const addResult = addNode(state, {
    definitionId: input.definitionId,
    position: input.position ?? getNextNodePlacementPosition(state)
  });
  const selectedState = selectNode(addResult.state, {
    nodeId: addResult.value.id
  });

  return {
    ok: true,
    state: {
      ...selectedState,
      resources: {
        ...selectedState.resources,
        balances: {
          ...selectedState.resources.balances,
          money: Math.max(0, selectedState.resources.balances.money - cost)
        }
      }
    },
    node: addResult.value,
    cost
  };
}

function createPositionKey(position: Vec2): string {
  return `${Math.round(position.x)}:${Math.round(position.y)}`;
}
