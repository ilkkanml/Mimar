import { getPortStyle } from "./geometry";

import type {
  NodeId,
  PortDefinition,
  PortDirection,
  PortId
} from "../../game/state/types";

type PortViewProps = {
  nodeId: NodeId;
  port: PortDefinition;
  index: number;
  isCompatibleTarget: boolean;
  isInvalidTarget: boolean;
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

export function PortView({
  nodeId,
  port,
  index,
  isCompatibleTarget,
  isInvalidTarget,
  onPortPointerDown,
  onPortPointerUp
}: PortViewProps) {
  const className = [
    "port",
    `port--${port.direction}`,
    isCompatibleTarget ? "port--compatible" : "",
    isInvalidTarget ? "port--invalid" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-label={`${port.direction}: ${port.resourceType}`}
      className={className}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPortPointerDown(nodeId, port.id, port.direction, event);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onPortPointerUp(nodeId, port.id, port.direction);
      }}
      style={getPortStyle(port, index)}
      title={`${port.direction}: ${port.resourceType} (${port.throughput}/s)`}
      type="button"
    >
      <span className="port__dot" />
    </button>
  );
}
