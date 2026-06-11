import { getPortAnchor } from "./geometry";

import type {
  EdgeInstance,
  NodeDefinition,
  NodeDefinitionId,
  NodeInstance,
  Vec2
} from "../../game/state/types";

type EdgeViewProps = {
  edge: EdgeInstance;
  nodes: Record<string, NodeInstance>;
  nodeDefinitionsById: Readonly<Record<NodeDefinitionId, NodeDefinition>>;
};

type EdgePreviewProps = {
  from: Vec2;
  to: Vec2;
};

export function EdgeView({
  edge,
  nodes,
  nodeDefinitionsById
}: EdgeViewProps) {
  const fromNode = nodes[edge.fromNodeId];
  const toNode = nodes[edge.toNodeId];

  if (fromNode === undefined || toNode === undefined) {
    return null;
  }

  const fromDefinition = nodeDefinitionsById[fromNode.definitionId];
  const toDefinition = nodeDefinitionsById[toNode.definitionId];

  if (fromDefinition === undefined || toDefinition === undefined) {
    return null;
  }

  const from = getPortAnchor(fromNode, fromDefinition, edge.fromPortId);
  const to = getPortAnchor(toNode, toDefinition, edge.toPortId);

  if (from === undefined || to === undefined) {
    return null;
  }

  return (
    <g className={`edge edge--${edge.resourceType}`}>
      <path className="edge__path" d={buildEdgePath(from, to)} />
      <circle className="edge__pulse" r="3">
        <animateMotion dur="1.8s" repeatCount="indefinite" path={buildEdgePath(from, to)} />
      </circle>
    </g>
  );
}

export function EdgePreview({ from, to }: EdgePreviewProps) {
  return <path className="edge-preview" d={buildEdgePath(from, to)} />;
}

function buildEdgePath(from: Vec2, to: Vec2): string {
  const controlOffset = Math.max(48, Math.abs(to.x - from.x) * 0.45);

  return [
    `M ${from.x} ${from.y}`,
    `C ${from.x + controlOffset} ${from.y}`,
    `${to.x - controlOffset} ${to.y}`,
    `${to.x} ${to.y}`
  ].join(" ");
}
