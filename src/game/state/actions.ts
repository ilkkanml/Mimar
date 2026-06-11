import type {
  EdgeId,
  EdgeInstance,
  GameState,
  NodeDefinition,
  NodeDefinitionId,
  NodeId,
  NodeInstance,
  PortId,
  ResourceId,
  Vec2
} from "./types";
import { validateConnection } from "../graph/validation";

import type { ConnectionValidationResult } from "../graph/validation";

export type GraphActionResult<TValue> = {
  state: GameState;
  value: TValue;
};

export type AddNodeInput = {
  definitionId: NodeDefinitionId;
  position: Vec2;
};

export type ConnectNodesInput = {
  fromNodeId: NodeId;
  fromPortId: PortId;
  toNodeId: NodeId;
  toPortId: PortId;
  throughputLimit: number;
  resourceType: ResourceId;
};

export type ValidatedConnectNodesInput = Omit<
  ConnectNodesInput,
  "throughputLimit" | "resourceType"
>;

export type ValidatedConnectNodesResult =
  | {
      state: GameState;
      validation: Extract<ConnectionValidationResult, { ok: true }>;
      edge: EdgeInstance;
    }
  | {
      state: GameState;
      validation: Extract<ConnectionValidationResult, { ok: false }>;
      edge?: never;
    };

export type SelectNodeInput = {
  nodeId: NodeId;
  additive?: boolean;
};

export function addNode(
  state: GameState,
  input: AddNodeInput
): GraphActionResult<NodeInstance> {
  const node: NodeInstance = {
    id: createNextGraphId(state.graph.nodes, `node_${input.definitionId}`),
    definitionId: input.definitionId,
    position: { ...input.position },
    level: 1,
    enabled: true,
    inputBuffers: {},
    outputBuffers: {},
    status: "idle",
    runtime: {
      inputRate: {},
      outputRate: {},
      utilization: 0,
      effectiveThroughput: 0
    }
  };

  return {
    state: {
      ...state,
      graph: {
        ...state.graph,
        nodes: {
          ...state.graph.nodes,
          [node.id]: node
        }
      }
    },
    value: node
  };
}

export function moveNode(
  state: GameState,
  nodeId: NodeId,
  position: Vec2
): GameState {
  const node = state.graph.nodes[nodeId];

  if (node === undefined) {
    return state;
  }

  return {
    ...state,
    graph: {
      ...state.graph,
      nodes: {
        ...state.graph.nodes,
        [nodeId]: {
          ...node,
          position: { ...position }
        }
      }
    }
  };
}

export function deleteNode(state: GameState, nodeId: NodeId): GameState {
  if (state.graph.nodes[nodeId] === undefined) {
    return state;
  }

  const nodes = { ...state.graph.nodes };
  delete nodes[nodeId];

  const edges = Object.fromEntries(
    Object.entries(state.graph.edges).filter(
      ([, edge]) => edge.fromNodeId !== nodeId && edge.toNodeId !== nodeId
    )
  );

  return {
    ...state,
    graph: {
      ...state.graph,
      nodes,
      edges,
      selectedNodeIds: state.graph.selectedNodeIds.filter(
        (selectedNodeId) => selectedNodeId !== nodeId
      ),
      selectedEdgeIds: state.graph.selectedEdgeIds.filter(
        (selectedEdgeId) => edges[selectedEdgeId] !== undefined
      )
    }
  };
}

export function selectNode(
  state: GameState,
  input: SelectNodeInput
): GameState {
  const selectedNodeIds =
    input.additive === true
      ? toggleListValue(state.graph.selectedNodeIds, input.nodeId)
      : [input.nodeId];

  return {
    ...state,
    graph: {
      ...state.graph,
      selectedNodeIds,
      selectedEdgeIds: input.additive === true ? state.graph.selectedEdgeIds : []
    }
  };
}

export function connectNodes(
  state: GameState,
  input: ConnectNodesInput
): GraphActionResult<EdgeInstance> {
  const edge: EdgeInstance = {
    id: createNextGraphId(state.graph.edges, "edge"),
    fromNodeId: input.fromNodeId,
    fromPortId: input.fromPortId,
    toNodeId: input.toNodeId,
    toPortId: input.toPortId,
    throughputLimit: input.throughputLimit,
    resourceType: input.resourceType
  };

  return {
    state: {
      ...state,
      graph: {
        ...state.graph,
        edges: {
          ...state.graph.edges,
          [edge.id]: edge
        }
      }
    },
    value: edge
  };
}

export function connectNodesIfValid(
  state: GameState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  input: ValidatedConnectNodesInput
): ValidatedConnectNodesResult {
  const validation = validateConnection(state.graph, nodeDefinitionsById, {
    from: {
      nodeId: input.fromNodeId,
      portId: input.fromPortId
    },
    to: {
      nodeId: input.toNodeId,
      portId: input.toPortId
    }
  });

  if (!validation.ok) {
    return {
      state,
      validation
    };
  }

  const connectResult = connectNodes(state, {
    ...input,
    throughputLimit: validation.throughputLimit,
    resourceType: validation.resourceType
  });

  return {
    state: connectResult.state,
    validation,
    edge: connectResult.value
  };
}

export function deleteEdge(state: GameState, edgeId: EdgeId): GameState {
  if (state.graph.edges[edgeId] === undefined) {
    return state;
  }

  const edges = { ...state.graph.edges };
  delete edges[edgeId];

  return {
    ...state,
    graph: {
      ...state.graph,
      edges,
      selectedEdgeIds: state.graph.selectedEdgeIds.filter(
        (selectedEdgeId) => selectedEdgeId !== edgeId
      )
    }
  };
}

function createNextGraphId<TRecord extends Record<string, unknown>>(
  record: TRecord,
  prefix: string
): string {
  let index = 1;
  let id = `${prefix}_${index}`;

  while (Object.hasOwn(record, id)) {
    index += 1;
    id = `${prefix}_${index}`;
  }

  return id;
}

function toggleListValue<TValue>(values: TValue[], value: TValue): TValue[] {
  return values.includes(value)
    ? values.filter((candidate) => candidate !== value)
    : [...values, value];
}
