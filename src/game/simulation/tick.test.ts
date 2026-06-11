import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { addNode, connectNodesIfValid } from "../state/actions";
import { createInitialGameState } from "../state/initialState";

import { FIXED_TICK_SECONDS, tickGameState } from "./tick";

import type { GameState, NodeId } from "../state/types";

describe("basic simulation tick", () => {
  it("produces money through Internet Feed -> Parser -> Cleaner -> Upload Gateway", () => {
    const graph = createPipelineGraph({ includeCpuRack: true });
    const stateAfterTicks = tickMany(graph.state, 120);

    expect(stateAfterTicks.resources.balances.money).toBeGreaterThan(0);
    expect(stateAfterTicks.resources.rates.money).toBeGreaterThan(0);
    expect(stateAfterTicks.graph.nodes[graph.uploadGatewayId]?.status).toBe(
      "running"
    );
  });

  it("produces research when Research Lab receives clean data and compute capacity exists", () => {
    const graph = createResearchGraph();
    const stateAfterTicks = tickMany(graph.state, 160);

    expect(stateAfterTicks.resources.balances.research).toBeGreaterThan(0);
    expect(stateAfterTicks.resources.rates.research).toBeGreaterThan(0);
    expect(
      stateAfterTicks.graph.nodes[graph.researchLabId]?.runtime
        .effectiveThroughput
    ).toBeGreaterThan(0);
  });

  it("throttles processing nodes when compute capacity is missing", () => {
    const graph = createPipelineGraph({ includeCpuRack: false });
    const stateAfterTicks = tickMany(graph.state, 40);

    expect(stateAfterTicks.resources.capacities.compute).toBe(0);
    expect(stateAfterTicks.resources.balances.money).toBe(0);
    expect(stateAfterTicks.graph.nodes[graph.parserId]?.status).toBe(
      "compute_limited"
    );
    expect(
      stateAfterTicks.graph.nodes[graph.parserId]?.runtime.bottleneckReason
    ).toBe("compute_limited");
  });

  it("tracks resource movement through node buffers", () => {
    const graph = createPipelineGraph({ includeCpuRack: true });
    const stateAfterOneTick = tickGameState(
      graph.state,
      nodeDefinitionsById,
      FIXED_TICK_SECONDS
    );

    expect(
      stateAfterOneTick.graph.nodes[graph.parserId]?.inputBuffers.rawData
    ).toBeGreaterThan(0);
    expect(stateAfterOneTick.resources.balances.rawData).toBeGreaterThan(0);
  });
});

function tickMany(state: GameState, tickCount: number): GameState {
  let nextState = state;

  for (let index = 0; index < tickCount; index += 1) {
    nextState = tickGameState(nextState, nodeDefinitionsById);
  }

  return nextState;
}

function createPipelineGraph(options: { includeCpuRack: boolean }) {
  let state = createInitialGameState("2026-06-11T00:00:00.000Z");

  const internetFeed = addNode(state, {
    definitionId: "internet_feed",
    position: { x: 0, y: 0 }
  });
  state = internetFeed.state;

  const parser = addNode(state, {
    definitionId: "parser",
    position: { x: 100, y: 0 }
  });
  state = parser.state;

  const cleaner = addNode(state, {
    definitionId: "cleaner",
    position: { x: 200, y: 0 }
  });
  state = cleaner.state;

  const uploadGateway = addNode(state, {
    definitionId: "upload_gateway",
    position: { x: 300, y: 0 }
  });
  state = uploadGateway.state;

  let cpuRackId: NodeId | undefined;

  if (options.includeCpuRack) {
    const cpuRack = addNode(state, {
      definitionId: "cpu_rack",
      position: { x: 100, y: 100 }
    });
    state = cpuRack.state;
    cpuRackId = cpuRack.value.id;
  }

  state = mustConnect(state, internetFeed.value.id, "raw_out", parser.value.id, "raw_in");
  state = mustConnect(state, parser.value.id, "parsed_out", cleaner.value.id, "parsed_in");
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
    cpuRackId
  };
}

function createResearchGraph() {
  const pipeline = createPipelineGraph({ includeCpuRack: true });
  const researchLab = addNode(pipeline.state, {
    definitionId: "research_lab",
    position: { x: 400, y: 100 }
  });
  let state = researchLab.state;

  state = mustConnect(
    state,
    pipeline.cleanerId,
    "clean_out",
    researchLab.value.id,
    "clean_in"
  );

  return {
    ...pipeline,
    state,
    researchLabId: researchLab.value.id
  };
}

function mustConnect(
  state: GameState,
  fromNodeId: NodeId,
  fromPortId: string,
  toNodeId: NodeId,
  toPortId: string
): GameState {
  const result = connectNodesIfValid(state, nodeDefinitionsById, {
    fromNodeId,
    fromPortId,
    toNodeId,
    toPortId
  });

  if (!result.validation.ok) {
    throw new Error(`Test connection failed: ${result.validation.reason}`);
  }

  return result.state;
}
