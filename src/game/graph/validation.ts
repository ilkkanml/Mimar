import type {
  GraphState,
  NodeDefinition,
  NodeDefinitionId,
  NodeId,
  PortDefinition,
  PortId,
  ResourceId
} from "../state/types";

export type ConnectionEndpoint = {
  nodeId: NodeId;
  portId: PortId;
};

export type ConnectionValidationInput = {
  from: ConnectionEndpoint;
  to: ConnectionEndpoint;
};

export type ConnectionValidationReason =
  | "missing_node"
  | "missing_definition"
  | "missing_port"
  | "same_node"
  | "invalid_direction"
  | "resource_mismatch"
  | "port_full";

export type ConnectionValidationResult =
  | {
      ok: true;
      resourceType: ResourceId;
      throughputLimit: number;
    }
  | {
      ok: false;
      reason: ConnectionValidationReason;
    };

export function validateConnection(
  graph: GraphState,
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>,
  input: ConnectionValidationInput
): ConnectionValidationResult {
  const fromNode = graph.nodes[input.from.nodeId];
  const toNode = graph.nodes[input.to.nodeId];

  if (fromNode === undefined || toNode === undefined) {
    return { ok: false, reason: "missing_node" };
  }

  if (input.from.nodeId === input.to.nodeId) {
    return { ok: false, reason: "same_node" };
  }

  const fromDefinition = nodeDefinitionsById[fromNode.definitionId];
  const toDefinition = nodeDefinitionsById[toNode.definitionId];

  if (fromDefinition === undefined || toDefinition === undefined) {
    return { ok: false, reason: "missing_definition" };
  }

  const fromPort = findPort(fromDefinition, input.from.portId);
  const toPort = findPort(toDefinition, input.to.portId);

  if (fromPort === undefined || toPort === undefined) {
    return { ok: false, reason: "missing_port" };
  }

  if (fromPort.direction !== "output" || toPort.direction !== "input") {
    return { ok: false, reason: "invalid_direction" };
  }

  if (fromPort.resourceType !== toPort.resourceType) {
    return { ok: false, reason: "resource_mismatch" };
  }

  if (isInputPortFull(graph, input.to.nodeId, toPort)) {
    return { ok: false, reason: "port_full" };
  }

  return {
    ok: true,
    resourceType: fromPort.resourceType,
    throughputLimit: Math.min(fromPort.throughput, toPort.throughput)
  };
}

function findPort(
  definition: NodeDefinition,
  portId: PortId
): PortDefinition | undefined {
  return [...definition.inputs, ...definition.outputs].find(
    (port) => port.id === portId
  );
}

function isInputPortFull(
  graph: GraphState,
  nodeId: NodeId,
  port: PortDefinition
): boolean {
  if (port.maxConnections === undefined) {
    return false;
  }

  const connectionCount = Object.values(graph.edges).filter(
    (edge) => edge.toNodeId === nodeId && edge.toPortId === port.id
  ).length;

  return connectionCount >= port.maxConnections;
}
