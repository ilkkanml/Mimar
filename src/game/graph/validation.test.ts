import { describe, expect, it } from "vitest";

import { nodeDefinitionsById } from "../data/nodeDefinitions";
import { addNode, connectNodesIfValid } from "../state/actions";
import { createInitialGameState } from "../state/initialState";

import { validateConnection } from "./validation";

describe("connection validation", () => {
  it("accepts output-to-input connections with matching resources", () => {
    const graph = createBasicGraph();

    const validation = validateConnection(graph.state.graph, nodeDefinitionsById, {
      from: { nodeId: graph.parserId, portId: "parsed_out" },
      to: { nodeId: graph.cleanerId, portId: "parsed_in" }
    });

    expect(validation).toEqual({
      ok: true,
      resourceType: "parsedData",
      throughputLimit: 6
    });
  });

  it("rejects input-to-input or output-to-output direction mistakes", () => {
    const graph = createBasicGraph();

    const validation = validateConnection(graph.state.graph, nodeDefinitionsById, {
      from: { nodeId: graph.parserId, portId: "raw_in" },
      to: { nodeId: graph.cleanerId, portId: "parsed_in" }
    });

    expect(validation).toEqual({ ok: false, reason: "invalid_direction" });
  });

  it("rejects mismatched resource types", () => {
    const graph = createBasicGraph();

    const validation = validateConnection(graph.state.graph, nodeDefinitionsById, {
      from: { nodeId: graph.internetFeedId, portId: "raw_out" },
      to: { nodeId: graph.cleanerId, portId: "parsed_in" }
    });

    expect(validation).toEqual({ ok: false, reason: "resource_mismatch" });
  });

  it("rejects same-node connections", () => {
    const graph = createBasicGraph();

    const validation = validateConnection(graph.state.graph, nodeDefinitionsById, {
      from: { nodeId: graph.parserId, portId: "parsed_out" },
      to: { nodeId: graph.parserId, portId: "raw_in" }
    });

    expect(validation).toEqual({ ok: false, reason: "same_node" });
  });

  it("rejects missing nodes and missing ports", () => {
    const graph = createBasicGraph();

    expect(
      validateConnection(graph.state.graph, nodeDefinitionsById, {
        from: { nodeId: "node_missing", portId: "parsed_out" },
        to: { nodeId: graph.cleanerId, portId: "parsed_in" }
      })
    ).toEqual({ ok: false, reason: "missing_node" });

    expect(
      validateConnection(graph.state.graph, nodeDefinitionsById, {
        from: { nodeId: graph.parserId, portId: "missing_port" },
        to: { nodeId: graph.cleanerId, portId: "parsed_in" }
      })
    ).toEqual({ ok: false, reason: "missing_port" });
  });

  it("writes valid edges and leaves invalid connections out of graph state", () => {
    const graph = createBasicGraph();

    const invalidResult = connectNodesIfValid(graph.state, nodeDefinitionsById, {
      fromNodeId: graph.internetFeedId,
      fromPortId: "raw_out",
      toNodeId: graph.cleanerId,
      toPortId: "parsed_in"
    });

    expect(invalidResult.validation).toEqual({
      ok: false,
      reason: "resource_mismatch"
    });
    expect(invalidResult.state).toBe(graph.state);
    expect(Object.keys(invalidResult.state.graph.edges)).toHaveLength(0);

    const validResult = connectNodesIfValid(graph.state, nodeDefinitionsById, {
      fromNodeId: graph.parserId,
      fromPortId: "parsed_out",
      toNodeId: graph.cleanerId,
      toPortId: "parsed_in"
    });

    expect(validResult.validation).toEqual({
      ok: true,
      resourceType: "parsedData",
      throughputLimit: 6
    });
    expect(validResult.edge).toMatchObject({
      fromNodeId: graph.parserId,
      fromPortId: "parsed_out",
      toNodeId: graph.cleanerId,
      toPortId: "parsed_in",
      resourceType: "parsedData",
      throughputLimit: 6
    });
    expect(Object.keys(validResult.state.graph.edges)).toHaveLength(1);
  });
});

function createBasicGraph() {
  const initialState = createInitialGameState("2026-06-11T00:00:00.000Z");
  const internetFeedAdd = addNode(initialState, {
    definitionId: "internet_feed",
    position: { x: 0, y: 0 }
  });
  const parserAdd = addNode(internetFeedAdd.state, {
    definitionId: "parser",
    position: { x: 100, y: 0 }
  });
  const cleanerAdd = addNode(parserAdd.state, {
    definitionId: "cleaner",
    position: { x: 200, y: 0 }
  });

  return {
    state: cleanerAdd.state,
    internetFeedId: internetFeedAdd.value.id,
    parserId: parserAdd.value.id,
    cleanerId: cleanerAdd.value.id
  };
}
