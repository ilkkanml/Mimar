import { useEffect, useMemo, useState } from "react";

import { contractDefinitionsById } from "../game/data/contracts";
import { nodeDefinitions, nodeDefinitionsById } from "../game/data/nodeDefinitions";
import {
  researchDefinitions,
  researchDefinitionsById
} from "../game/data/research";
import {
  addNode,
  connectNodesIfValid,
  selectNode
} from "../game/state/actions";
import { claimContractReward } from "../game/state/contractActions";
import {
  getNextNodePlacementPosition,
  placeNode
} from "../game/state/nodePlacement";
import { unlockResearch } from "../game/state/researchActions";
import {
  upgradeSelectedNodeMax,
  upgradeSelectedNodeOnce
} from "../game/state/upgradeActions";
import { createInitialGameState } from "../game/state/initialState";
import {
  canRedo,
  canUndo,
  createGameHistoryState,
  pushHistory,
  redo,
  replaceHistoryCurrent,
  undo
} from "../game/state/history";
import {
  SIMULATION_TICKS_PER_SECOND,
  tickGameState
} from "../game/simulation/tick";
import { loadGameFromStorage } from "../game/save/loadGame";
import { saveGameToStorage } from "../game/save/saveGame";
import { CommandStrip } from "../ui/panels/CommandStrip";
import { ContractPanel } from "../ui/panels/ContractPanel";
import { GraphCanvas } from "../ui/canvas/GraphCanvas";
import { InspectorPanel } from "../ui/panels/InspectorPanel";
import { ResearchPanel } from "../ui/panels/ResearchPanel";
import { ResourceBar } from "../ui/panels/ResourceBar";
import {
  buildContractPanelModel,
  buildInspectorModel,
  buildResearchPanelModel,
  buildResourceBarModel
} from "../ui/panels/panelModels";
import { buildNodePaletteModel } from "../ui/panels/nodePaletteModels";

import type { GameState, NodeDefinitionId } from "../game/state/types";
import type { SaveStatusModel } from "../ui/panels/CommandStrip";

export function App() {
  const [gameHistory, setGameHistory] = useState(() =>
    createGameHistoryState(createInitialM1UiState())
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatusModel>({
    text: "Not saved",
    tone: "idle"
  });
  const gameState = gameHistory.current;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setGameHistory((currentHistory) =>
        replaceHistoryCurrent(
          currentHistory,
          tickGameState(currentHistory.current, nodeDefinitionsById)
        )
      );
    }, 1000 / SIMULATION_TICKS_PER_SECOND);

    return () => window.clearInterval(intervalId);
  }, []);

  const resourceBarModel = useMemo(
    () => buildResourceBarModel(gameState, nodeDefinitionsById),
    [gameState]
  );
  const inspectorModel = useMemo(
    () => buildInspectorModel(gameState, nodeDefinitionsById),
    [gameState]
  );
  const contractPanelModel = useMemo(
    () => buildContractPanelModel(gameState, contractDefinitionsById),
    [gameState]
  );
  const researchPanelModel = useMemo(
    () => buildResearchPanelModel(gameState, researchDefinitions),
    [gameState]
  );
  const nodePaletteModel = useMemo(
    () => buildNodePaletteModel(gameState, nodeDefinitions),
    [gameState]
  );

  function handleSave() {
    const result = saveGameToStorage(window.localStorage, gameState);

    if (!result.ok) {
      setSaveStatus({
        text: "Save failed. Storage unavailable.",
        tone: "warning"
      });
      return;
    }

    setSaveStatus({
      text: `Saved ${formatSaveTime(result.saveGame.savedAt)}`,
      tone: "success"
    });
  }

  function handleLoad() {
    const result = loadGameFromStorage(window.localStorage);

    if (!result.ok) {
      setSaveStatus({
        text: formatLoadError(result.reason),
        tone: "warning"
      });
      return;
    }

    setGameHistory(
      createGameHistoryState(
        tickGameState(result.saveGame.gameState, nodeDefinitionsById)
      )
    );
    setSaveStatus({
      text: `Loaded ${formatSaveTime(result.saveGame.savedAt)}`,
      tone: "success"
    });
  }

  function handleNewGame() {
    setGameHistory((currentHistory) =>
      pushHistory(currentHistory, createInitialM1UiState())
    );
    setSaveStatus({
      text: "New system started. Save slot kept.",
      tone: "idle"
    });
  }

  function handleUndo() {
    setGameHistory((currentHistory) => undo(currentHistory));
    setSaveStatus({
      text: "Undo applied.",
      tone: "idle"
    });
  }

  function handleRedo() {
    setGameHistory((currentHistory) => redo(currentHistory));
    setSaveStatus({
      text: "Redo applied.",
      tone: "idle"
    });
  }

  function handleClaimContract(contractId: string) {
    const result = claimContractReward(
      gameState,
      contractDefinitionsById,
      contractId
    );

    if (!result.ok) {
      setSaveStatus({
        text:
          result.reason === "already_claimed"
            ? "Contract already claimed."
            : "Contract is not ready.",
        tone: "warning"
      });
      return;
    }

    setGameHistory((currentHistory) => pushHistory(currentHistory, result.state));
    setSaveStatus({
      text: "Contract reward claimed.",
      tone: "success"
    });
  }

  function handleUnlockResearch(researchId: string) {
    const result = unlockResearch(
      gameState,
      researchDefinitionsById,
      researchId
    );

    if (!result.ok) {
      setSaveStatus({
        text: formatResearchUnlockError(result.reason),
        tone: "warning"
      });
      return;
    }

    setGameHistory((currentHistory) => pushHistory(currentHistory, result.state));
    setSaveStatus({
      text: "Research unlocked.",
      tone: "success"
    });
  }

  function handleUpgradeSelectedNode() {
    const result = upgradeSelectedNodeOnce(gameState, nodeDefinitionsById);

    if (!result.ok) {
      setSaveStatus({
        text: formatUpgradeError(result.reason),
        tone: "warning"
      });
      return;
    }

    setGameHistory((currentHistory) => pushHistory(currentHistory, result.state));
    setSaveStatus({
      text: `Upgraded to Lv${result.level}.`,
      tone: "success"
    });
  }

  function handleBuyMaxSelectedNode() {
    const result = upgradeSelectedNodeMax(gameState, nodeDefinitionsById);

    if (!result.ok) {
      setSaveStatus({
        text: formatUpgradeError(result.reason),
        tone: "warning"
      });
      return;
    }

    setGameHistory((currentHistory) => pushHistory(currentHistory, result.state));
    setSaveStatus({
      text: `Bought ${result.upgradesPurchased} upgrade${
        result.upgradesPurchased === 1 ? "" : "s"
      } to Lv${result.level}.`,
      tone: "success"
    });
  }

  function handlePlaceNode(definitionId: NodeDefinitionId) {
    const result = placeNode(gameState, nodeDefinitionsById, {
      definitionId,
      position: getNextNodePlacementPosition(gameState)
    });

    if (!result.ok) {
      setSaveStatus({
        text: formatNodePlacementError(result.reason, result.cost),
        tone: "warning"
      });
      return;
    }

    setGameHistory((currentHistory) => pushHistory(currentHistory, result.state));
    setSaveStatus({
      text:
        result.cost <= 0
          ? `Placed ${result.node.definitionId}.`
          : `Placed ${result.node.definitionId} for $${result.cost}.`,
      tone: "success"
    });
  }

  return (
    <main className="app-root">
      <div className="app-shell">
        <ResourceBar model={resourceBarModel} />
        <div className="app-shell__workspace">
          <GraphCanvas
            gameState={gameState}
            nodePaletteModel={nodePaletteModel}
            onCommitCurrentState={(previousState) =>
              setGameHistory((currentHistory) =>
                pushHistory(
                  currentHistory,
                  currentHistory.current,
                  previousState
                )
              )
            }
            onCommitStateChange={(updater) =>
              setGameHistory((currentHistory) =>
                pushHistory(currentHistory, updater(currentHistory.current))
              )
            }
            onPlaceNode={handlePlaceNode}
            onTransientStateChange={(updater) =>
              setGameHistory((currentHistory) =>
                replaceHistoryCurrent(
                  currentHistory,
                  updater(currentHistory.current)
                )
              )
            }
          />
          <div className="app-shell__side-panel">
            <InspectorPanel
              model={inspectorModel}
              onBuyMax={handleBuyMaxSelectedNode}
              onUpgrade={handleUpgradeSelectedNode}
            />
            <div className="app-shell__secondary-panels">
              <ContractPanel
                model={contractPanelModel}
                onClaim={handleClaimContract}
              />
              <ResearchPanel
                model={researchPanelModel}
                onUnlock={handleUnlockResearch}
              />
            </div>
          </div>
        </div>
        <CommandStrip
          bottleneck={resourceBarModel.warning}
          canRedo={canRedo(gameHistory)}
          canUndo={canUndo(gameHistory)}
          onLoad={handleLoad}
          onNewGame={handleNewGame}
          onRedo={handleRedo}
          onSave={handleSave}
          onUndo={handleUndo}
          saveStatus={saveStatus}
        />
      </div>
    </main>
  );
}

export default App;

function createInitialM1UiState(timestamp = new Date().toISOString()): GameState {
  let state = createInitialGameState(timestamp);

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

  state = connectNodesIfValid(state, nodeDefinitionsById, {
    fromNodeId: internetFeed.value.id,
    fromPortId: "raw_out",
    toNodeId: parser.value.id,
    toPortId: "raw_in"
  }).state;

  state = selectNode(state, { nodeId: internetFeed.value.id });

  return tickGameState(state, nodeDefinitionsById);
}

function formatSaveTime(savedAt: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(savedAt));
}

function formatLoadError(reason: string): string {
  const messages: Record<string, string> = {
    invalid_json: "Load failed. Save data is corrupted.",
    invalid_shape: "Load failed. Save data is incomplete.",
    missing_save: "No local save found.",
    storage_unavailable: "Load failed. Storage unavailable.",
    unsupported_schema: "Load failed. Save version is unsupported."
  };

  return messages[reason] ?? "Load failed.";
}

function formatResearchUnlockError(reason: string): string {
  const messages: Record<string, string> = {
    already_unlocked: "Research already unlocked.",
    insufficient_research: "Not enough research points.",
    locked: "Research prerequisites are missing.",
    unknown_research: "Research definition is missing."
  };

  return messages[reason] ?? "Research unlock failed.";
}

function formatUpgradeError(reason: string): string {
  const messages: Record<string, string> = {
    insufficient_money: "Not enough money for that upgrade.",
    missing_definition: "Upgrade failed. Node definition is missing.",
    missing_node: "Upgrade failed. Select a node first.",
    no_selected_node: "Select a node before upgrading.",
    not_upgradeable: "This node has no upgrade path."
  };

  return messages[reason] ?? "Upgrade failed.";
}

function formatNodePlacementError(reason: string, cost: number | undefined): string {
  const messages: Record<string, string> = {
    insufficient_money:
      cost === undefined
        ? "Not enough money to place that node."
        : `Need $${cost} to place that node.`,
    missing_definition: "Node placement failed. Definition is missing."
  };

  return messages[reason] ?? "Node placement failed.";
}
