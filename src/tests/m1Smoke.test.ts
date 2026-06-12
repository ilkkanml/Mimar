import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../game/data/nodeDefinitions";
import {
  addNode,
  connectNodesIfValid,
  selectNode
} from "../game/state/actions";
import {
  createInitialGameState,
  createZeroResourceMap
} from "../game/state/initialState";
import { tickGameState } from "../game/simulation/tick";
import { parseSaveGame } from "../game/save/loadGame";
import { serializeSaveGame } from "../game/save/saveGame";
import { createSaveGame } from "../game/save/schema";
import {
  buildInspectorModel,
  buildResourceBarModel
} from "../ui/panels/panelModels";

import type {
  GameState,
  NodeDefinitionId,
  NodeId,
  NodeInstance,
  PortId
} from "../game/state/types";

describe("M1 smoke coverage", () => {
  it("runs the M1 graph, simulation, inspector, and save/load loop", () => {
    const graph = createM1Graph();

    expect(Object.keys(graph.state.graph.nodes)).toHaveLength(6);
    expect([
      getDefinitionName(graph.state, graph.internetFeedId),
      getDefinitionName(graph.state, graph.parserId),
      getDefinitionName(graph.state, graph.cleanerId),
      getDefinitionName(graph.state, graph.uploadGatewayId)
    ]).toEqual(["Internet Feed", "Parser", "Cleaner", "Upload Gateway"]);
    expect(Object.keys(graph.state.graph.edges)).toHaveLength(4);

    const invalidConnection = connectNodesIfValid(
      graph.state,
      nodeDefinitionsById,
      {
        fromNodeId: graph.parserId,
        fromPortId: "raw_in",
        toNodeId: graph.cleanerId,
        toPortId: "parsed_in"
      }
    );

    expect(invalidConnection.validation).toEqual({
      ok: false,
      reason: "invalid_direction"
    });
    expect(Object.keys(invalidConnection.state.graph.edges)).toHaveLength(4);

    const tickedState = tickMany(graph.state, 240);

    expect(tickedState.resources.balances.money).toBeGreaterThan(0);
    expect(tickedState.resources.balances.research).toBeGreaterThan(0);
    expect(tickedState.resources.rates.money).toBeGreaterThan(0);
    expect(tickedState.resources.rates.research).toBeGreaterThan(0);
    expect(tickedState.resources.capacities.compute).toBe(10);
    expect(tickedState.resources.usage.compute).toBeGreaterThan(0);
    expect(tickedState.resources.usage.compute).toBeLessThanOrEqual(10);

    const cleanerSelectedState = selectNode(tickedState, {
      nodeId: graph.cleanerId
    });
    const cleanerInspector = buildInspectorModel(
      cleanerSelectedState,
      nodeDefinitionsById
    );

    expect(cleanerInspector.kind).toBe("node");
    if (cleanerInspector.kind !== "node") {
      return;
    }
    expect(cleanerInspector.name).toBe("Cleaner");

    const uploadSelectedState = selectNode(tickedState, {
      nodeId: graph.uploadGatewayId
    });
    const uploadInspector = buildInspectorModel(
      uploadSelectedState,
      nodeDefinitionsById
    );

    expect(uploadInspector.kind).toBe("node");
    if (uploadInspector.kind !== "node") {
      return;
    }
    expect(uploadInspector.name).toBe("Upload Gateway");

    const saveGame = createSaveGame(
      uploadSelectedState,
      "2026-06-11T12:00:00.000Z"
    );
    const serializedSave = serializeSaveGame(saveGame);
    const serializedShape = JSON.parse(serializedSave) as {
      schemaVersion?: unknown;
      savedAt?: unknown;
    };

    expect(serializedShape).toMatchObject({
      schemaVersion: 0,
      savedAt: "2026-06-11T12:00:00.000Z"
    });

    const loadResult = parseSaveGame(serializedSave);

    expect(loadResult.ok).toBe(true);
    if (!loadResult.ok) {
      return;
    }

    const loadedState = loadResult.saveGame.gameState;

    expect(Object.keys(loadedState.graph.nodes)).toEqual(
      Object.keys(uploadSelectedState.graph.nodes)
    );
    expect(loadedState.graph.edges).toEqual(uploadSelectedState.graph.edges);
    expect(loadedState.graph.selectedNodeIds).toEqual([graph.uploadGatewayId]);
    expect(loadedState.resources.balances.money).toBeCloseTo(
      uploadSelectedState.resources.balances.money
    );
    expect(loadedState.resources.balances.research).toBeCloseTo(
      uploadSelectedState.resources.balances.research
    );
    expect(getNode(loadedState, graph.cleanerId).inputBuffers).toEqual(
      getNode(saveGame.gameState, graph.cleanerId).inputBuffers
    );
    expect(getNode(loadedState, graph.cleanerId).outputBuffers).toEqual(
      getNode(saveGame.gameState, graph.cleanerId).outputBuffers
    );
    expect(loadedState.resources.rates).toEqual(createZeroResourceMap());
    expect(loadedState.resources.capacities).toEqual(createZeroResourceMap());
    expect(loadedState.resources.usage).toEqual(createZeroResourceMap());
    expect(getNode(loadedState, graph.parserId).status).toBe("idle");
    expect(
      getNode(loadedState, graph.parserId).runtime.effectiveThroughput
    ).toBe(0);

    const retickedLoadedState = tickGameState(loadedState, nodeDefinitionsById);

    expect(retickedLoadedState.resources.capacities.compute).toBe(10);
    expect(retickedLoadedState.resources.rates.rawData).toBeGreaterThan(0);
    expect(getNode(retickedLoadedState, graph.internetFeedId).status).toBe(
      "running"
    );
  });

  it("reports compute bottlenecks when CPU capacity is constrained", () => {
    const graph = createComputeConstrainedGraph();
    const tickedState = tickMany(graph.state, 40);

    expect(tickedState.resources.capacities.compute).toBe(0);
    expect(getNode(tickedState, graph.parserId).status).toBe(
      "compute_limited"
    );
    expect(
      getNode(tickedState, graph.parserId).runtime.bottleneckReason
    ).toBe("compute_limited");

    const resourceBar = buildResourceBarModel(tickedState, nodeDefinitionsById);
    expect(resourceBar.warning).toMatchObject({
      nodeName: "Parser",
      reason: "compute_limited"
    });

    const selectedState = selectNode(tickedState, { nodeId: graph.parserId });
    const inspector = buildInspectorModel(selectedState, nodeDefinitionsById);

    expect(inspector.kind).toBe("node");
    if (inspector.kind !== "node") {
      return;
    }
    expect(inspector.name).toBe("Parser");
    expect(inspector.bottleneck).toMatchObject({
      reason: "compute_limited",
      recommendedAction:
        "Add CPU Rack, unlock compute-efficiency research, or reduce competing compute demand."
    });
  });
});

function createM1Graph(): {
  state: GameState;
  internetFeedId: NodeId;
  parserId: NodeId;
  cleanerId: NodeId;
  uploadGatewayId: NodeId;
  cpuRackId: NodeId;
  researchLabId: NodeId;
} {
  let state = createInitialGameState("2026-06-11T00:00:00.000Z");

  const internetFeed = addM1Node(state, "internet_feed", { x: 0, y: 0 });
  state = internetFeed.state;

  const parser = addM1Node(state, "parser", { x: 180, y: 0 });
  state = parser.state;

  const cleaner = addM1Node(state, "cleaner", { x: 360, y: 0 });
  state = cleaner.state;

  const uploadGateway = addM1Node(state, "upload_gateway", { x: 540, y: 0 });
  state = uploadGateway.state;

  const cpuRack = addM1Node(state, "cpu_rack", { x: 180, y: 160 });
  state = cpuRack.state;

  const researchLab = addM1Node(state, "research_lab", { x: 540, y: 160 });
  state = researchLab.state;

  state = mustConnect(
    state,
    internetFeed.value.id,
    "raw_out",
    parser.value.id,
    "raw_in"
  );
  state = mustConnect(
    state,
    parser.value.id,
    "parsed_out",
    cleaner.value.id,
    "parsed_in"
  );
  state = mustConnect(
    state,
    cleaner.value.id,
    "clean_out",
    researchLab.value.id,
    "clean_in"
  );
  state = mustConnect(
    state,
    cleaner.value.id,
    "clean_out",
    uploadGateway.value.id,
    "clean_in"
  );

  return {
    state,
    internetFeedId: internetFeed.value.id,
    parserId: parser.value.id,
    cleanerId: cleaner.value.id,
    uploadGatewayId: uploadGateway.value.id,
    cpuRackId: cpuRack.value.id,
    researchLabId: researchLab.value.id
  };
}

function createComputeConstrainedGraph(): {
  state: GameState;
  internetFeedId: NodeId;
  parserId: NodeId;
} {
  let state = createInitialGameState("2026-06-11T00:00:00.000Z");

  const internetFeed = addM1Node(state, "internet_feed", { x: 0, y: 0 });
  state = internetFeed.state;

  const parser = addM1Node(state, "parser", { x: 180, y: 0 });
  state = parser.state;

  state = mustConnect(
    state,
    internetFeed.value.id,
    "raw_out",
    parser.value.id,
    "raw_in"
  );

  return {
    state,
    internetFeedId: internetFeed.value.id,
    parserId: parser.value.id
  };
}

function addM1Node(
  state: GameState,
  definitionId: NodeDefinitionId,
  position: { x: number; y: number }
) {
  return addNode(state, {
    definitionId,
    position
  });
}

function mustConnect(
  state: GameState,
  fromNodeId: NodeId,
  fromPortId: PortId,
  toNodeId: NodeId,
  toPortId: PortId
): GameState {
  const result = connectNodesIfValid(state, nodeDefinitionsById, {
    fromNodeId,
    fromPortId,
    toNodeId,
    toPortId
  });

  expect(result.validation.ok).toBe(true);
  if (!result.validation.ok) {
    throw new Error(`M1 smoke connection failed: ${result.validation.reason}`);
  }

  return result.state;
}

function tickMany(state: GameState, tickCount: number): GameState {
  let nextState = state;

  for (let index = 0; index < tickCount; index += 1) {
    nextState = tickGameState(nextState, nodeDefinitionsById);
  }

  return nextState;
}

function getDefinitionName(state: GameState, nodeId: NodeId): string {
  const node = getNode(state, nodeId);
  const definition = nodeDefinitionsById[node.definitionId];

  if (definition === undefined) {
    throw new Error(`Missing expected definition ${node.definitionId}`);
  }

  return definition.name;
}

function getNode(state: GameState, nodeId: NodeId): NodeInstance {
  const node = state.graph.nodes[nodeId];

  if (node === undefined) {
    throw new Error(`Missing expected node ${nodeId}`);
  }

  return node;
}
