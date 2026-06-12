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
    expect(model.load).toEqual({
      powerUse: 2,
      heatOutput: 1
    });
    expect(model.bottleneck?.reason).toBe("compute_limited");
    expect(model.recommendedAction).toBe(
      "Add CPU Rack or reduce competing compute demand."
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
        recommendedAction: "Add CPU Rack or reduce competing compute demand."
      }
    });
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
