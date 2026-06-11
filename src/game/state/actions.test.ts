import { describe, expect, it } from "vitest";

import {
  addNode,
  connectNodes,
  deleteEdge,
  deleteNode,
  moveNode,
  selectNode
} from "./actions";
import { createInitialGameState } from "./initialState";

describe("graph state actions", () => {
  it("adds node instances with unique ids without mutating the old state", () => {
    const initialState = createInitialGameState("2026-06-11T00:00:00.000Z");

    const firstAdd = addNode(initialState, {
      definitionId: "internet_feed",
      position: { x: 10, y: 20 }
    });
    const secondAdd = addNode(firstAdd.state, {
      definitionId: "internet_feed",
      position: { x: 30, y: 40 }
    });

    expect(Object.keys(initialState.graph.nodes)).toHaveLength(0);
    expect(firstAdd.value.id).not.toBe(secondAdd.value.id);
    expect(secondAdd.state.graph.nodes[firstAdd.value.id]).toMatchObject({
      definitionId: "internet_feed",
      level: 1,
      enabled: true,
      status: "idle",
      position: { x: 10, y: 20 }
    });
    expect(secondAdd.state.graph.nodes[secondAdd.value.id]?.position).toEqual({
      x: 30,
      y: 40
    });
  });

  it("moves an existing node immutably", () => {
    const initialState = createInitialGameState("2026-06-11T00:00:00.000Z");
    const { state, value: node } = addNode(initialState, {
      definitionId: "parser",
      position: { x: 0, y: 0 }
    });

    const movedState = moveNode(state, node.id, { x: 120, y: 220 });

    expect(state.graph.nodes[node.id]?.position).toEqual({ x: 0, y: 0 });
    expect(movedState.graph.nodes[node.id]?.position).toEqual({
      x: 120,
      y: 220
    });
  });

  it("selects one node or toggles additive selection", () => {
    const initialState = createInitialGameState("2026-06-11T00:00:00.000Z");
    const firstAdd = addNode(initialState, {
      definitionId: "parser",
      position: { x: 0, y: 0 }
    });
    const secondAdd = addNode(firstAdd.state, {
      definitionId: "cleaner",
      position: { x: 100, y: 0 }
    });

    const selectedFirst = selectNode(secondAdd.state, {
      nodeId: firstAdd.value.id
    });
    const selectedBoth = selectNode(selectedFirst, {
      nodeId: secondAdd.value.id,
      additive: true
    });
    const toggledSecondOff = selectNode(selectedBoth, {
      nodeId: secondAdd.value.id,
      additive: true
    });

    expect(selectedFirst.graph.selectedNodeIds).toEqual([firstAdd.value.id]);
    expect(selectedBoth.graph.selectedNodeIds).toEqual([
      firstAdd.value.id,
      secondAdd.value.id
    ]);
    expect(toggledSecondOff.graph.selectedNodeIds).toEqual([firstAdd.value.id]);
  });

  it("connects nodes with unique edge ids", () => {
    const graphState = createParserCleanerGraph();

    const firstConnect = connectNodes(graphState.state, {
      fromNodeId: graphState.parserId,
      fromPortId: "parsed_out",
      toNodeId: graphState.cleanerId,
      toPortId: "parsed_in",
      throughputLimit: 6,
      resourceType: "parsedData"
    });
    const secondConnect = connectNodes(firstConnect.state, {
      fromNodeId: graphState.parserId,
      fromPortId: "parsed_out",
      toNodeId: graphState.cleanerId,
      toPortId: "parsed_in",
      throughputLimit: 4,
      resourceType: "parsedData"
    });

    expect(firstConnect.value.id).not.toBe(secondConnect.value.id);
    expect(secondConnect.state.graph.edges[firstConnect.value.id]).toMatchObject(
      {
        fromNodeId: graphState.parserId,
        fromPortId: "parsed_out",
        toNodeId: graphState.cleanerId,
        toPortId: "parsed_in",
        throughputLimit: 6,
        resourceType: "parsedData"
      }
    );
    expect(Object.keys(secondConnect.state.graph.edges)).toHaveLength(2);
  });

  it("deletes edges and clears deleted edge selection", () => {
    const graphState = createParserCleanerGraph();
    const connectResult = connectNodes(graphState.state, {
      fromNodeId: graphState.parserId,
      fromPortId: "parsed_out",
      toNodeId: graphState.cleanerId,
      toPortId: "parsed_in",
      throughputLimit: 6,
      resourceType: "parsedData"
    });
    const selectedState = {
      ...connectResult.state,
      graph: {
        ...connectResult.state.graph,
        selectedEdgeIds: [connectResult.value.id]
      }
    };

    const stateAfterDelete = deleteEdge(selectedState, connectResult.value.id);

    expect(stateAfterDelete.graph.edges[connectResult.value.id]).toBeUndefined();
    expect(stateAfterDelete.graph.selectedEdgeIds).toEqual([]);
  });

  it("deletes a node and removes all related edges", () => {
    const graphState = createParserCleanerGraph();
    const parserToCleaner = connectNodes(graphState.state, {
      fromNodeId: graphState.parserId,
      fromPortId: "parsed_out",
      toNodeId: graphState.cleanerId,
      toPortId: "parsed_in",
      throughputLimit: 6,
      resourceType: "parsedData"
    });
    const cleanerToUpload = connectNodes(parserToCleaner.state, {
      fromNodeId: graphState.cleanerId,
      fromPortId: "clean_out",
      toNodeId: graphState.uploadId,
      toPortId: "clean_in",
      throughputLimit: 5,
      resourceType: "cleanData"
    });
    const selectedState = selectNode(cleanerToUpload.state, {
      nodeId: graphState.cleanerId
    });

    const stateAfterDelete = deleteNode(selectedState, graphState.cleanerId);

    expect(stateAfterDelete.graph.nodes[graphState.cleanerId]).toBeUndefined();
    expect(stateAfterDelete.graph.edges[parserToCleaner.value.id]).toBeUndefined();
    expect(stateAfterDelete.graph.edges[cleanerToUpload.value.id]).toBeUndefined();
    expect(stateAfterDelete.graph.selectedNodeIds).toEqual([]);
  });
});

function createParserCleanerGraph() {
  const initialState = createInitialGameState("2026-06-11T00:00:00.000Z");
  const parserAdd = addNode(initialState, {
    definitionId: "parser",
    position: { x: 0, y: 0 }
  });
  const cleanerAdd = addNode(parserAdd.state, {
    definitionId: "cleaner",
    position: { x: 100, y: 0 }
  });
  const uploadAdd = addNode(cleanerAdd.state, {
    definitionId: "upload_gateway",
    position: { x: 200, y: 0 }
  });

  return {
    state: uploadAdd.state,
    parserId: parserAdd.value.id,
    cleanerId: cleanerAdd.value.id,
    uploadId: uploadAdd.value.id
  };
}
