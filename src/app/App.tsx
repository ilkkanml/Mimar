import { useEffect, useMemo, useState } from "react";

import { nodeDefinitionsById } from "../game/data/nodeDefinitions";
import {
  addNode,
  connectNodesIfValid,
  selectNode
} from "../game/state/actions";
import { createInitialGameState } from "../game/state/initialState";
import {
  SIMULATION_TICKS_PER_SECOND,
  tickGameState
} from "../game/simulation/tick";
import { loadGameFromStorage } from "../game/save/loadGame";
import { saveGameToStorage } from "../game/save/saveGame";
import { CommandStrip } from "../ui/panels/CommandStrip";
import { GraphCanvas } from "../ui/canvas/GraphCanvas";
import { InspectorPanel } from "../ui/panels/InspectorPanel";
import { ResourceBar } from "../ui/panels/ResourceBar";
import {
  buildInspectorModel,
  buildResourceBarModel
} from "../ui/panels/panelModels";

import type { GameState } from "../game/state/types";
import type { SaveStatusModel } from "../ui/panels/CommandStrip";

export function App() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialM1UiState()
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatusModel>({
    text: "Not saved",
    tone: "idle"
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setGameState((currentState) =>
        tickGameState(currentState, nodeDefinitionsById)
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

    setGameState(tickGameState(result.saveGame.gameState, nodeDefinitionsById));
    setSaveStatus({
      text: `Loaded ${formatSaveTime(result.saveGame.savedAt)}`,
      tone: "success"
    });
  }

  function handleNewGame() {
    setGameState(createInitialM1UiState());
    setSaveStatus({
      text: "New system started. Save slot kept.",
      tone: "idle"
    });
  }

  return (
    <main className="app-root">
      <div className="app-shell">
        <ResourceBar model={resourceBarModel} />
        <div className="app-shell__workspace">
          <GraphCanvas gameState={gameState} setGameState={setGameState} />
          <InspectorPanel model={inspectorModel} />
        </div>
        <CommandStrip
          bottleneck={resourceBarModel.warning}
          onLoad={handleLoad}
          onNewGame={handleNewGame}
          onSave={handleSave}
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
