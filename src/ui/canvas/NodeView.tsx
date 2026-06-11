import { PortView } from "./PortView";

import type {
  NodeDefinition,
  NodeId,
  NodeInstance,
  PortDirection,
  PortId
} from "../../game/state/types";

type NodeViewProps = {
  node: NodeInstance;
  definition: NodeDefinition;
  selected: boolean;
  compatiblePortId?: PortId | undefined;
  invalidPortId?: PortId | undefined;
  onNodePointerDown: (
    nodeId: NodeId,
    event: React.PointerEvent<HTMLDivElement>
  ) => void;
  onPortPointerDown: (
    nodeId: NodeId,
    portId: PortId,
    direction: PortDirection,
    event: React.PointerEvent<HTMLButtonElement>
  ) => void;
  onPortPointerUp: (
    nodeId: NodeId,
    portId: PortId,
    direction: PortDirection
  ) => void;
};

export function NodeView({
  node,
  definition,
  selected,
  compatiblePortId,
  invalidPortId,
  onNodePointerDown,
  onPortPointerDown,
  onPortPointerUp
}: NodeViewProps) {
  const className = [
    "node-view",
    `node-view--${definition.category}`,
    `node-view--${node.status}`,
    selected ? "node-view--selected" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      onPointerDown={(event) => onNodePointerDown(node.id, event)}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`
      }}
    >
      <div className="node-view__accent" />
      <div className="node-view__header">
        <span className="node-view__name">{definition.name}</span>
        <span className="node-view__level">Lv{node.level}</span>
      </div>
      <div className="node-view__meta">{formatCategory(definition.category)}</div>
      <div className="node-view__status">
        <span className="node-view__activity-dot" />
        <span>{formatStatus(node.status)}</span>
      </div>
      {definition.inputs.map((port, index) => (
        <PortView
          index={index}
          isCompatibleTarget={compatiblePortId === port.id}
          isInvalidTarget={invalidPortId === port.id}
          key={port.id}
          nodeId={node.id}
          onPortPointerDown={onPortPointerDown}
          onPortPointerUp={onPortPointerUp}
          port={port}
        />
      ))}
      {definition.outputs.map((port, index) => (
        <PortView
          index={index}
          isCompatibleTarget={compatiblePortId === port.id}
          isInvalidTarget={invalidPortId === port.id}
          key={port.id}
          nodeId={node.id}
          onPortPointerDown={onPortPointerDown}
          onPortPointerUp={onPortPointerUp}
          port={port}
        />
      ))}
    </div>
  );
}

function formatCategory(category: string): string {
  return category.replaceAll("_", " ");
}

function formatStatus(status: string): string {
  return status.replaceAll("_", " ");
}
