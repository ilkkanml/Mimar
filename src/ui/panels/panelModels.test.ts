import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../../game/data/nodeDefinitions";
import {
  addNode,
  connectNodesIfValid,
  selectNode
} from "../../game/state/actions";
import { createInitialGameState } from "../../game/state/initialState";
import { tickGameState } from "../../game/simulation/tick";

import { buildInspectorModel, buildResourceBarModel } from "./panelModels";

import type { GameState, NodeId } from "../../game/state/types";

describe("panel view models", () => {
  it("summarizes resource bar values and compute bottlenecks from simulation state", () => {
    const graph = createInternetFeedParserGraph();
    const tickedState = tickGameState(graph.state, nodeDefinitionsById);

    const model = buildResourceBarModel(tickedState, nodeDefinitionsById);

    expect(model.money.label).toBe("Money");
    expect(model.research.label).toBe("Research");
    expect(model.compute.capacity).toBe(0);
    expect(model.compute.warning).toBe(true);
    expect(model.warning).toMatchObject({
      nodeName: "Parser",
      reason: "compute_limited",
      recommendedAction: "Add CPU Rack or reduce competing compute demand."
    });
  });

  it("returns an empty inspector model when nothing is selected", () => {
    const model = buildInspectorModel(
      createInitialGameState("2026-06-11T00:00:00.000Z"),
      nodeDefinitionsById
    );

    expect(model.kind).toBe("empty");
  });

  it("builds selected node inspector details with rates and recommended action", () => {
    const graph = createInternetFeedParserGraph();
    const selectedState = selectNode(graph.state, { nodeId: graph.parserId });
    const tickedState = tickGameState(selectedState, nodeDefinitionsById);

    const model = buildInspectorModel(tickedState, nodeDefinitionsById);

    expect(model.kind).toBe("node");

    if (model.kind !== "node") {
      return;
    }

    expect(model.name).toBe("Parser");
    expect(model.status).toBe("compute_limited");
    expect(model.inputs).toEqual([
      {
        resourceId: "rawData",
        label: "Raw Data",
        currentRate: 0,
        configuredRate: 8
      }
    ]);
    expect(model.outputs).toEqual([
      {
        resourceId: "parsedData",
        label: "Parsed Data",
        currentRate: 0,
        configuredRate: 8
      }
    ]);
    expect(model.compute).toEqual({
      used: 0,
      requested: 2,
      provided: 0
    });
    expect(model.bottleneck?.reason).toBe("compute_limited");
    expect(model.recommendedAction).toBe(
      "Add CPU Rack or reduce competing compute demand."
    );
  });
});

function createInternetFeedParserGraph(): {
  state: GameState;
  internetFeedId: NodeId;
  parserId: NodeId;
} {
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

  state = mustConnect(state, internetFeed.value.id, "raw_out", parser.value.id, "raw_in");

  return {
    state,
    internetFeedId: internetFeed.value.id,
    parserId: parser.value.id
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
