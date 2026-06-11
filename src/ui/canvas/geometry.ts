import type {
  NodeDefinition,
  NodeInstance,
  PortDefinition,
  PortId,
  Vec2
} from "../../game/state/types";

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 92;

const PORT_TOP_OFFSET = 58;
const PORT_GAP = 18;

export function getPortAnchor(
  node: NodeInstance,
  definition: NodeDefinition,
  portId: PortId
): Vec2 | undefined {
  const inputIndex = definition.inputs.findIndex((port) => port.id === portId);
  if (inputIndex >= 0) {
    return {
      x: node.position.x,
      y: node.position.y + PORT_TOP_OFFSET + inputIndex * PORT_GAP
    };
  }

  const outputIndex = definition.outputs.findIndex((port) => port.id === portId);
  if (outputIndex >= 0) {
    return {
      x: node.position.x + NODE_WIDTH,
      y: node.position.y + PORT_TOP_OFFSET + outputIndex * PORT_GAP
    };
  }

  return undefined;
}

export function getPortStyle(
  port: PortDefinition,
  index: number
): React.CSSProperties {
  return {
    top: `${PORT_TOP_OFFSET + index * PORT_GAP}px`,
    [port.direction === "input" ? "left" : "right"]: "0px"
  };
}
