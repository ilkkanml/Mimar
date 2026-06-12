import { useMemo, useState } from "react";

import { nodeDefinitionsById } from "../../game/data/nodeDefinitions";
import {
  connectNodesIfValid,
  moveNode,
  selectNode
} from "../../game/state/actions";
import { buildNodeTooltipModel } from "../panels/panelModels";
import { validateConnection } from "../../game/graph/validation";
import { EdgePreview, EdgeView } from "./EdgeView";
import { getPortAnchor } from "./geometry";
import { NodeTooltip } from "./NodeTooltip";
import { NodeView } from "./NodeView";

import type {
  GameState,
  NodeId,
  PortDirection,
  PortId,
  Vec2
} from "../../game/state/types";

type NodeDragState = {
  nodeId: NodeId;
  offset: Vec2;
  startPosition: Vec2;
  startState: GameState;
};

type ConnectionDraftState = {
  fromNodeId: NodeId;
  fromPortId: PortId;
  pointer: Vec2;
};

type GraphCanvasProps = {
  gameState: GameState;
  onCommitCurrentState: (previousState: GameState) => void;
  onCommitStateChange: (updater: (currentState: GameState) => GameState) => void;
  onTransientStateChange: (
    updater: (currentState: GameState) => GameState
  ) => void;
};

export function GraphCanvas({
  gameState,
  onCommitCurrentState,
  onCommitStateChange,
  onTransientStateChange
}: GraphCanvasProps) {
  const [nodeDrag, setNodeDrag] = useState<NodeDragState | null>(null);
  const [connectionDraft, setConnectionDraft] =
    useState<ConnectionDraftState | null>(null);
  const [tooltipNodeId, setTooltipNodeId] = useState<NodeId | null>(null);

  const selectedNodeId = gameState.graph.selectedNodeIds[0];
  const tooltipNode =
    tooltipNodeId === null ? undefined : gameState.graph.nodes[tooltipNodeId];
  const tooltipModel = useMemo(
    () =>
      tooltipNodeId === null
        ? undefined
        : buildNodeTooltipModel(gameState, nodeDefinitionsById, tooltipNodeId),
    [gameState, tooltipNodeId]
  );

  const draftStart = useMemo(() => {
    if (connectionDraft === null) {
      return undefined;
    }

    const node = gameState.graph.nodes[connectionDraft.fromNodeId];
    if (node === undefined) {
      return undefined;
    }

    const definition = nodeDefinitionsById[node.definitionId];
    if (definition === undefined) {
      return undefined;
    }

    return getPortAnchor(node, definition, connectionDraft.fromPortId);
  }, [connectionDraft, gameState.graph.nodes]);

  function handleNodePointerDown(
    nodeId: NodeId,
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const canvasPoint = getCanvasPoint(event);
    const node = gameState.graph.nodes[nodeId];

    if (node === undefined) {
      return;
    }

    const selectedState = selectNode(gameState, { nodeId });
    setTooltipNodeId(nodeId);
    onTransientStateChange(() => selectedState);
    setNodeDrag({
      nodeId,
      startPosition: { ...node.position },
      startState: selectedState,
      offset: {
        x: canvasPoint.x - node.position.x,
        y: canvasPoint.y - node.position.y
      }
    });
  }

  function handlePortPointerDown(
    nodeId: NodeId,
    portId: PortId,
    direction: PortDirection,
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    if (direction !== "output") {
      return;
    }

    setConnectionDraft({
      fromNodeId: nodeId,
      fromPortId: portId,
      pointer: getCanvasPoint(event)
    });
  }

  function handlePortPointerUp(
    nodeId: NodeId,
    portId: PortId,
    direction: PortDirection
  ) {
    if (connectionDraft === null || direction !== "input") {
      setConnectionDraft(null);
      return;
    }

    onCommitStateChange((currentState) => {
      const result = connectNodesIfValid(currentState, nodeDefinitionsById, {
        fromNodeId: connectionDraft.fromNodeId,
        fromPortId: connectionDraft.fromPortId,
        toNodeId: nodeId,
        toPortId: portId
      });

      return result.state;
    });
    setConnectionDraft(null);
  }

  function handleCanvasPointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const point = getCanvasPoint(event);

    if (nodeDrag !== null) {
      onTransientStateChange((currentState) =>
        moveNode(currentState, nodeDrag.nodeId, {
          x: point.x - nodeDrag.offset.x,
          y: point.y - nodeDrag.offset.y
        })
      );
    }

    if (connectionDraft !== null) {
      setConnectionDraft({
        ...connectionDraft,
        pointer: point
      });
    }
  }

  function clearInteractionState() {
    commitNodeDragIfMoved();
    setNodeDrag(null);
    setConnectionDraft(null);
  }

  function clearCanvasInteractionState() {
    clearInteractionState();
    setTooltipNodeId(null);
  }

  function cancelNodeDrag() {
    setNodeDrag(null);
    setConnectionDraft(null);
  }

  function handleNodePointerEnter(nodeId: NodeId) {
    setTooltipNodeId(nodeId);
  }

  function handleNodePointerLeave(nodeId: NodeId) {
    setTooltipNodeId((currentNodeId) =>
      currentNodeId === nodeId ? null : currentNodeId
    );
  }

  function handleNodeFocus(nodeId: NodeId) {
    setTooltipNodeId(nodeId);
  }

  function handleNodeBlur(
    nodeId: NodeId,
    event: React.FocusEvent<HTMLDivElement>
  ) {
    if (
      event.relatedTarget instanceof Element &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }

    setTooltipNodeId((currentNodeId) =>
      currentNodeId === nodeId ? null : currentNodeId
    );
  }

  function commitNodeDragIfMoved() {
    if (nodeDrag === null) {
      return;
    }

    const currentNode = gameState.graph.nodes[nodeDrag.nodeId];

    if (currentNode === undefined) {
      return;
    }

    if (
      currentNode.position.x === nodeDrag.startPosition.x &&
      currentNode.position.y === nodeDrag.startPosition.y
    ) {
      return;
    }

    onCommitCurrentState(nodeDrag.startState);
  }

  function getCompatiblePortId(nodeId: NodeId, portId: PortId): PortId | undefined {
    if (connectionDraft === null) {
      return undefined;
    }

    const validation = validateConnection(gameState.graph, nodeDefinitionsById, {
      from: {
        nodeId: connectionDraft.fromNodeId,
        portId: connectionDraft.fromPortId
      },
      to: {
        nodeId,
        portId
      }
    });

    return validation.ok ? portId : undefined;
  }

  function getInvalidPortId(nodeId: NodeId, portId: PortId): PortId | undefined {
    if (connectionDraft === null) {
      return undefined;
    }

    const validation = validateConnection(gameState.graph, nodeDefinitionsById, {
      from: {
        nodeId: connectionDraft.fromNodeId,
        portId: connectionDraft.fromPortId
      },
      to: {
        nodeId,
        portId
      }
    });

    return validation.ok ? undefined : portId;
  }

  return (
    <section
      className="graph-canvas"
      onPointerCancel={cancelNodeDrag}
      onPointerLeave={clearCanvasInteractionState}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={clearInteractionState}
    >
      <svg className="graph-canvas__edges" aria-hidden="true">
        {Object.values(gameState.graph.edges).map((edge) => (
          <EdgeView
            edge={edge}
            key={edge.id}
            nodeDefinitionsById={nodeDefinitionsById}
            nodes={gameState.graph.nodes}
          />
        ))}
        {connectionDraft !== null && draftStart !== undefined ? (
          <EdgePreview from={draftStart} to={connectionDraft.pointer} />
        ) : null}
      </svg>

      {Object.values(gameState.graph.nodes).map((node) => {
        const definition = nodeDefinitionsById[node.definitionId];

        if (definition === undefined) {
          return null;
        }

        const inputPort = definition.inputs[0];

        return (
          <NodeView
            compatiblePortId={
              inputPort === undefined
                ? undefined
                : getCompatiblePortId(node.id, inputPort.id)
            }
            definition={definition}
            invalidPortId={
              inputPort === undefined
                ? undefined
                : getInvalidPortId(node.id, inputPort.id)
            }
            key={node.id}
            node={node}
            onNodeBlur={handleNodeBlur}
            onNodeFocus={handleNodeFocus}
            onNodePointerDown={handleNodePointerDown}
            onNodePointerEnter={handleNodePointerEnter}
            onNodePointerLeave={handleNodePointerLeave}
            onPortPointerDown={handlePortPointerDown}
            onPortPointerUp={handlePortPointerUp}
            selected={selectedNodeId === node.id}
          />
        );
      })}
      {tooltipModel !== undefined && tooltipNode !== undefined ? (
        <NodeTooltip
          model={tooltipModel}
          placement={tooltipNode.position.x >= 700 ? "left" : "right"}
          position={tooltipNode.position}
        />
      ) : null}
    </section>
  );
}

function getCanvasPoint(event: React.PointerEvent<HTMLElement>): Vec2 {
  const canvas = event.currentTarget.closest(".graph-canvas");
  const rect = canvas?.getBoundingClientRect();

  if (rect === undefined) {
    return { x: 0, y: 0 };
  }

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}
