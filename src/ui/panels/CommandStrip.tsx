import type { BottleneckSummaryModel } from "./panelModels";

export type SaveStatusTone = "idle" | "success" | "warning";

export type SaveStatusModel = {
  text: string;
  tone: SaveStatusTone;
};

type CommandStripProps = {
  bottleneck?: BottleneckSummaryModel | undefined;
  saveStatus: SaveStatusModel;
  onLoad: () => void;
  onNewGame: () => void;
  onSave: () => void;
};

export function CommandStrip({
  bottleneck,
  saveStatus,
  onLoad,
  onNewGame,
  onSave
}: CommandStripProps) {
  return (
    <footer className="command-strip" aria-label="Command strip">
      <div className="command-strip__segment command-strip__objective">
        <span className="command-strip__label">Objective</span>
        <span>Keep the first pipeline readable and save the system.</span>
      </div>
      <div className="command-strip__segment command-strip__bottleneck">
        <span className="command-strip__label">Bottleneck</span>
        <span>
          {bottleneck === undefined
            ? "No major bottleneck."
            : `${bottleneck.nodeName}: ${bottleneck.reasonLabel}`}
        </span>
      </div>
      <div
        className={`command-strip__segment command-strip__save command-strip__save--${saveStatus.tone}`}
      >
        <span className="command-strip__label">Save</span>
        <span>{saveStatus.text}</span>
      </div>
      <div className="command-strip__actions">
        <button className="command-button command-button--primary" onClick={onSave} type="button">
          Save
        </button>
        <button className="command-button" onClick={onLoad} type="button">
          Load
        </button>
        <button className="command-button command-button--ghost" onClick={onNewGame} type="button">
          New System
        </button>
      </div>
    </footer>
  );
}
