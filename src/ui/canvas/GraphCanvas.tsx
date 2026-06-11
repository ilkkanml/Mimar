import { useMemo, useState } from "react";

import { nodeDefinitionsById } from "../../game/data/nodeDefinitions";
import {
  addNode,
  connectNodesIfValid,
  moveNode,
  selectNode
} from "../../game/state/actions";
import { createInitialGameState } from "../../game/state/initialState";
import { validateConnection } from "../../game/graph/validation";
import { EdgePreview, EdgeView } from "./EdgeView";
import { getPortAnchor } from "./geometry";
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
};

type ConnectionDraftState = {
  fromNodeId: NodeId;
  fromPortId: PortId;
  pointer: Vec2;
};

export function GraphCanvas() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialCanvasState()
  );
  const [nodeDrag, setNodeDrag] = useState<NodeDragState | null>(null);
  const [connectionDraft, setConnectionDraft] =
    useState<ConnectionDraftState | null>(null);

  const selectedNodeId = gameState.graph.selectedNodeIds[0];

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

    setGameState((currentState) => selectNode(currentState, { nodeId }));
    setNodeDrag({
      nodeId,
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

    setGameState((currentState) => {
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
      setGameState((currentState) =>
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
    setNodeDrag(null);
    setConnectionDraft(null);
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
      onPointerCancel={clearInteractionState}
      onPointerLeave={() => setNodeDrag(null)}
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
            onNodePointerDown={handleNodePointerDown}
            onPortPointerDown={handlePortPointerDown}
            onPortPointerUp={handlePortPointerUp}
            selected={selectedNodeId === node.id}
          />
        );
      })}
    </section>
  );
}

function createInitialCanvasState(): GameState {
  let state = createInitialGameState("2026-06-11T00:00:00.000Z");

  const internetFeed = addNode(state, {
    definitionId: "internet_feed",
    position: { x: 140, y: 210 }
  });
  state = internetFeed.state;

  const parser = addNode(state, {
    definitionId: "parser",
    position: { x: 390, y: 210 }
  });
  state = parser.state;

  const cleaner = addNode(state, {
    definitionId: "cleaner",
    position: { x: 640, y: 210 }
  });
  state = cleaner.state;

  const uploadGateway = addNode(state, {
    definitionId: "upload_gateway",
    position: { x: 890, y: 210 }
  });
  state = uploadGateway.state;

  const connection = connectNodesIfValid(state, nodeDefinitionsById, {
    fromNodeId: internetFeed.value.id,
    fromPortId: "raw_out",
    toNodeId: parser.value.id,
    toPortId: "raw_in"
  });
  state = connection.state;

  return selectNode(state, { nodeId: internetFeed.value.id });
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
