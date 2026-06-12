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
  onNodePointerEnter: (nodeId: NodeId) => void;
  onNodePointerLeave: (nodeId: NodeId) => void;
  onNodeFocus: (nodeId: NodeId) => void;
  onNodeBlur: (
    nodeId: NodeId,
    event: React.FocusEvent<HTMLDivElement>
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
  onNodePointerEnter,
  onNodePointerLeave,
  onNodeFocus,
  onNodeBlur,
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
      aria-label={`${definition.name} level ${node.level}, ${formatStatus(
        node.status
      )}`}
      className={className}
      onBlur={(event) => onNodeBlur(node.id, event)}
      onFocus={() => onNodeFocus(node.id)}
      onPointerDown={(event) => onNodePointerDown(node.id, event)}
      onPointerEnter={() => onNodePointerEnter(node.id)}
      onPointerLeave={() => onNodePointerLeave(node.id)}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`
      }}
      tabIndex={0}
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
