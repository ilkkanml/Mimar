import { describe, expect, it } from "vitest";

import { contractDefinitionsById } from "../../game/data/contracts";
import { nodeDefinitionsById } from "../../game/data/nodeDefinitions";
import { researchDefinitions } from "../../game/data/research";
import {
  addNode,
  connectNodesIfValid,
  selectNode
} from "../../game/state/actions";
import { createInitialGameState } from "../../game/state/initialState";
import { tickGameState } from "../../game/simulation/tick";

import {
  buildContractPanelModel,
  buildInspectorModel,
  buildNodeTooltipModel,
  buildResearchPanelModel,
  buildResourceBarModel
} from "./panelModels";

import type { GameState, NodeDefinition, NodeId } from "../../game/state/types";

describe("panel view models", () => {
  it("summarizes resource bar values and compute bottlenecks from simulation state", () => {
    const graph = createInternetFeedParserGraph();
    const tickedState = tickGameState(graph.state, nodeDefinitionsById);

    const model = buildResourceBarModel(tickedState, nodeDefinitionsById);

    expect(model.money.label).toBe("Money");
    expect(model.research.label).toBe("Research");
    expect(model.compute.capacity).toBe(0);
    expect(model.compute.warning).toBe(true);
    expect(model.power).toMatchObject({
      label: "Power",
      used: 3,
      capacity: 20,
      pressurePercent: 15,
      warning: false
    });
    expect(model.heat).toMatchObject({
      label: "Heat",
      used: 1.5,
      capacity: 10,
      pressurePercent: 15,
      warning: false
    });
    expect(model.warning).toMatchObject({
      nodeId: graph.parserId,
      nodeName: "Parser",
      reason: "compute_limited",
      severity: "critical",
      reasonLabel: "Compute Limited",
      reasonText: "Parser needs 2/s compute but only 0/s is available.",
      metricSummary:
        "Compute: 0/s available / 2/s needed. Grid capacity: 0/s.",
      recommendedAction:
        "Add CPU Rack, unlock compute-efficiency research, or reduce competing compute demand."
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
    expect(model.load).toEqual({
      powerUse: 2,
      heatOutput: 1
    });
    expect(model.bottleneck?.reason).toBe("compute_limited");
    expect(model.bottleneck).toMatchObject({
      nodeId: graph.parserId,
      severity: "critical",
      metricSummary:
        "Compute: 0/s available / 2/s needed. Grid capacity: 0/s."
    });
    expect(model.recommendedAction).toBe(
      "Add CPU Rack, unlock compute-efficiency research, or reduce competing compute demand."
    );
  });

  it("builds selected node upgrade preview data", () => {
    const graph = createInternetFeedParserGraph();
    const selectedState = selectNode(withMoney(graph.state, 140), {
      nodeId: graph.parserId
    });

    const model = buildInspectorModel(selectedState, nodeDefinitionsById);

    expect(model.kind).toBe("node");

    if (model.kind !== "node") {
      return;
    }

    expect(model.upgrade).toEqual({
      currentLevel: 1,
      nextLevel: 2,
      nextCost: 61,
      currentMoney: 140,
      canUpgrade: true,
      buyMaxLevel: 3,
      buyMaxCost: 136,
      buyMaxCount: 2,
      canBuyMax: true,
      effectLabel: "+18% throughput, +6% compute use, +5% power use"
    });
  });

  it("builds a normal node tooltip model from runtime metrics", () => {
    const graph = createInternetFeedParserGraph();
    const tickedState = tickGameState(graph.state, nodeDefinitionsById);

    const model = buildNodeTooltipModel(
      tickedState,
      nodeDefinitionsById,
      graph.internetFeedId
    );

    expect(model).toMatchObject({
      nodeId: graph.internetFeedId,
      name: "Internet Feed",
      categoryLabel: "Data Source",
      level: 1,
      status: "running",
      statusLabel: "Running",
      statusTone: "good",
      throughputPercent: 100,
      throughputLabel: "100% effective",
      outputs: [
        {
          resourceId: "rawData",
          label: "Raw Data",
          currentRate: 10,
          configuredRate: 10
        }
      ],
      load: {
        powerUse: 1,
        heatOutput: 0.5
      }
    });
    expect(model?.inputs).toEqual([]);
    expect(model?.compute).toBeUndefined();
  });

  it("builds an upgraded node tooltip with scaled rates, cost, and effect", () => {
    const graph = createInternetFeedParserGraph();
    const upgradedState = tickGameState(
      withNodeLevel(graph.state, graph.internetFeedId, 2),
      nodeDefinitionsById
    );

    const model = buildNodeTooltipModel(
      upgradedState,
      nodeDefinitionsById,
      graph.internetFeedId
    );

    expect(model?.level).toBe(2);
    expect(model?.outputs[0]?.currentRate).toBeCloseTo(11.6);
    expect(model?.outputs[0]?.configuredRate).toBeCloseTo(11.6);
    expect(model?.load?.powerUse).toBeCloseTo(1.04);
    expect(model?.load?.heatOutput).toBe(0.5);
    expect(model?.upgrade).toEqual({
      currentLevel: 2,
      nextLevel: 3,
      nextCost: 2,
      canUpgrade: false,
      effectLabel: "+16% throughput, +4% power use"
    });
  });

  it("builds a bottlenecked node tooltip with compute, power, and heat metrics", () => {
    const graph = createInternetFeedParserGraph();
    const tickedState = tickGameState(graph.state, nodeDefinitionsById);

    const model = buildNodeTooltipModel(
      tickedState,
      nodeDefinitionsById,
      graph.parserId
    );

    expect(model).toMatchObject({
      name: "Parser",
      status: "compute_limited",
      statusLabel: "Compute Limited",
      statusTone: "warning",
      throughputPercent: 0,
      throughputLabel: "0% effective",
      compute: {
        used: 0,
        requested: 2,
        provided: 0
      },
      load: {
        powerUse: 2,
        heatOutput: 1
      },
      bottleneck: {
        reason: "compute_limited",
        reasonLabel: "Compute Limited",
        severity: "critical",
        reasonText: "Parser needs 2/s compute but only 0/s is available.",
        metricSummary:
          "Compute: 0/s available / 2/s needed. Grid capacity: 0/s.",
        recommendedAction:
          "Add CPU Rack, unlock compute-efficiency research, or reduce competing compute demand."
      }
    });
  });

  it("builds a power bottleneck message with severity and recommendation", () => {
    const definition = createTestNodeDefinition({
      id: "test_power_hog",
      name: "Power Test Load",
      powerUse: 30,
      heatOutput: 0
    });
    const definitionsById = {
      ...nodeDefinitionsById,
      [definition.id]: definition
    };
    const graph = createSingleNodeGraph(definition);
    const tickedState = tickGameState(graph.state, definitionsById);

    const resourceBar = buildResourceBarModel(tickedState, definitionsById);
    const tooltip = buildNodeTooltipModel(
      tickedState,
      definitionsById,
      graph.nodeId
    );

    expect(resourceBar.warning).toMatchObject({
      nodeId: graph.nodeId,
      nodeName: "Power Test Load",
      reason: "power_limited",
      severity: "critical",
      reasonLabel: "Power Limited",
      reasonText:
        "Power Test Load is reduced because the system is drawing 30 power against 20 capacity.",
      metricSummary: "Power load: 30/20 capacity.",
      recommendedAction:
        "Add power capacity, unlock power research, or upgrade lower-power nodes before expanding this branch."
    });
    expect(tooltip?.bottleneck?.recommendedAction).toBe(
      resourceBar.warning?.recommendedAction
    );
  });

  it("builds a heat bottleneck message from heat pressure", () => {
    const definition = createTestNodeDefinition({
      id: "test_heat_hog",
      name: "Heat Test Load",
      powerUse: 0,
      heatOutput: 30
    });
    const definitionsById = {
      ...nodeDefinitionsById,
      [definition.id]: definition
    };
    const graph = createSingleNodeGraph(definition);
    const tickedState = tickGameState(graph.state, definitionsById);

    const model = buildResourceBarModel(tickedState, definitionsById);

    expect(model.warning).toMatchObject({
      nodeId: graph.nodeId,
      reason: "heat_throttled",
      severity: "critical",
      reasonLabel: "Heat Pressure High",
      reasonText: "Heat pressure is 300% and is reducing Heat Test Load throughput.",
      metricSummary: "Heat: 30/10 safe capacity.",
      recommendedAction:
        "Unlock cooling research or reduce heat output before expanding this branch."
    });
    expect(model.heat).toMatchObject({
      pressurePercent: 300,
      warning: true,
      critical: true
    });
  });

  it("builds a missing input bottleneck message with affected node details", () => {
    const state = createParserOnlyGraph();
    const selectedState = selectNode(state, { nodeId: "node_parser_1" });
    const tickedState = tickGameState(selectedState, nodeDefinitionsById);

    const inspector = buildInspectorModel(tickedState, nodeDefinitionsById);

    expect(inspector.kind).toBe("node");

    if (inspector.kind !== "node") {
      return;
    }

    expect(inspector.bottleneck).toMatchObject({
      nodeId: "node_parser_1",
      nodeName: "Parser",
      reason: "input_starved",
      severity: "critical",
      reasonLabel: "Input Missing",
      reasonText: "Parser needs 8/s Raw Data but is receiving 0/s.",
      metricSummary: "Raw Data: 0/s received / 8/s needed.",
      recommendedAction:
        "Connect an upstream Raw Data source or increase upstream throughput."
    });
  });

  it("keeps bottleneck models stable when no bottleneck exists", () => {
    const state = createSingleNodeGraph(
      requireNodeDefinition("internet_feed")
    ).state;
    const tickedState = tickGameState(state, nodeDefinitionsById);
    const resourceBar = buildResourceBarModel(tickedState, nodeDefinitionsById);
    const tooltip = buildNodeTooltipModel(
      tickedState,
      nodeDefinitionsById,
      "node_internet_feed_1"
    );

    expect(resourceBar.warning).toBeUndefined();
    expect(tooltip?.bottleneck).toBeUndefined();
  });

  it("derives tooltip metrics from active research effects", () => {
    const graph = createInternetFeedParserGraph();
    const researchedState = tickGameState(
      withUnlockedResearch(graph.state, "parser_optimization"),
      nodeDefinitionsById
    );

    const model = buildNodeTooltipModel(
      researchedState,
      nodeDefinitionsById,
      graph.parserId
    );

    expect(model?.compute?.requested).toBeCloseTo(1.6);
    expect(model?.upgrade?.effectLabel).toBe(
      "+18% throughput, +6% compute use, +5% power use"
    );
  });

  it("keeps tooltip modeling stable when optional metrics are missing", () => {
    const graph = createInternetFeedParserGraph();
    const tickedState = tickGameState(graph.state, nodeDefinitionsById);

    const model = buildNodeTooltipModel(
      tickedState,
      nodeDefinitionsById,
      graph.internetFeedId
    );

    expect(model?.compute).toBeUndefined();
    expect(
      buildNodeTooltipModel(tickedState, nodeDefinitionsById, "missing_node")
    ).toBeUndefined();
  });

  it("builds a contract panel model with progress and claim state", () => {
    const state = {
      ...createInitialGameState("2026-06-11T00:00:00.000Z"),
      contracts: {
        available: [],
        active: [],
        completed: [
          {
            id: "starter_intake_check",
            currentProgress: 25,
            status: "completed"
          }
        ],
        claimed: []
      }
    } satisfies GameState;

    const model = buildContractPanelModel(state, contractDefinitionsById);

    expect(model).toMatchObject({
      availableCount: 0,
      activeCount: 0,
      completedCount: 1,
      claimedCount: 0,
      focusedContract: {
        id: "starter_intake_check",
        title: "Starter Intake Check",
        status: "completed",
        statusLabel: "Completed",
        progressCurrent: 25,
        progressRequired: 25,
        progressPercent: 100,
        requirementLabel: "25 Raw Data",
        rewardLabel: "$75 + 6 Research",
        canClaim: true
      }
    });
  });

  it("builds a research panel model with status, cost, and locked reason", () => {
    const initialState = createInitialGameState("2026-06-11T00:00:00.000Z");
    const state = {
      ...initialState,
      resources: {
        ...initialState.resources,
        balances: {
          ...initialState.resources.balances,
          research: 6
        }
      }
    } satisfies GameState;

    const model = buildResearchPanelModel(state, researchDefinitions);

    expect(model).toMatchObject({
      availableCount: 2,
      lockedCount: 3,
      unlockedCount: 0,
      spentResearchPoints: 0,
      focusedResearch: {
        id: "parser_optimization",
        title: "Parser Optimization",
        status: "available",
        statusLabel: "Available",
        costResearch: 5,
        currentResearch: 6,
        effectLabel: "Parser compute use -20%",
        affordable: true,
        canUnlock: true
      }
    });

    expect(
      model.cards.find((card) => card.id === "cleaner_efficiency")
    ).toMatchObject({
      status: "locked",
      lockedReason: "Requires Parser Optimization."
    });
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

function createParserOnlyGraph(): GameState {
  const parser = addNode(
    createInitialGameState("2026-06-11T00:00:00.000Z"),
    {
      definitionId: "parser",
      position: { x: 100, y: 0 }
    }
  );

  return parser.state;
}

function createSingleNodeGraph(definition: NodeDefinition): {
  state: GameState;
  nodeId: NodeId;
} {
  const node = addNode(createInitialGameState("2026-06-11T00:00:00.000Z"), {
    definitionId: definition.id,
    position: { x: 0, y: 0 }
  });

  return {
    state: node.state,
    nodeId: node.value.id
  };
}

function createTestNodeDefinition({
  id,
  name,
  powerUse,
  heatOutput
}: {
  id: string;
  name: string;
  powerUse: number;
  heatOutput: number;
}): NodeDefinition {
  return {
    id,
    name,
    category: "infrastructure",
    description: "Test-only load node.",
    baseCost: 0,
    costGrowth: 1,
    inputs: [],
    outputs: [
      {
        id: "raw_out",
        direction: "output",
        resourceType: "rawData",
        throughput: 1
      }
    ],
    baseStats: {
      produces: { rawData: 1 },
      consumes: {},
      computeProduced: 0,
      computeUsed: 0,
      powerUse,
      heatOutput,
      storageCapacity: 0
    },
    upgradeScaling: {},
    unlockRequirements: []
  };
}

function requireNodeDefinition(id: string): NodeDefinition {
  const definition = nodeDefinitionsById[id];

  if (definition === undefined) {
    throw new Error(`Missing test node definition ${id}.`);
  }

  return definition;
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

function withMoney(state: GameState, money: number): GameState {
  return {
    ...state,
    resources: {
      ...state.resources,
      balances: {
        ...state.resources.balances,
        money
      }
    }
  };
}

function withNodeLevel(
  state: GameState,
  nodeId: NodeId,
  level: number
): GameState {
  const node = state.graph.nodes[nodeId];

  if (node === undefined) {
    throw new Error(`Missing test node ${nodeId}.`);
  }

  return {
    ...state,
    graph: {
      ...state.graph,
      nodes: {
        ...state.graph.nodes,
        [nodeId]: {
          ...node,
          level
        }
      }
    }
  };
}

function withUnlockedResearch(
  state: GameState,
  researchId: string
): GameState {
  return {
    ...state,
    research: {
      ...state.research,
      availableResearchIds: state.research.availableResearchIds.filter(
        (availableResearchId) => availableResearchId !== researchId
      ),
      unlockedResearchIds: [...state.research.unlockedResearchIds, researchId],
      spentResearchPoints: state.research.spentResearchPoints + 5
    }
  };
}
