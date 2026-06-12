import type { ResearchCardModel, ResearchPanelModel } from "./panelModels";

type ResearchPanelProps = {
  model: ResearchPanelModel;
  onUnlock: (researchId: string) => void;
};

export function ResearchPanel({ model, onUnlock }: ResearchPanelProps) {
  return (
    <aside className="research-panel" aria-label="Research">
      <div className="research-panel__header">
        <div>
          <h2>Research</h2>
          <p>
            {model.availableCount} available / {model.unlockedCount} unlocked
          </p>
        </div>
        <span className="research-panel__spent">
          {formatNumber(model.spentResearchPoints)} spent
        </span>
      </div>

      {model.cards.length === 0 ? (
        <p className="research-panel__empty">No research loaded.</p>
      ) : (
        <div className="research-panel__cards">
          {model.cards.map((card) => (
            <ResearchCard key={card.id} model={card} onUnlock={onUnlock} />
          ))}
        </div>
      )}
    </aside>
  );
}

function ResearchCard({
  model,
  onUnlock
}: {
  model: ResearchCardModel;
  onUnlock: (researchId: string) => void;
}) {
  return (
    <article className={`research-card research-card--${model.status}`}>
      <div className="research-card__topline">
        <h3>{model.title}</h3>
        <span className={`research-status research-status--${model.status}`}>
          {model.statusLabel}
        </span>
      </div>
      <p className="research-card__description">{model.description}</p>

      <div className="research-card__details">
        <span>Cost</span>
        <strong>
          {formatNumber(model.costResearch)} /{" "}
          {formatNumber(model.currentResearch)} Research
        </strong>
      </div>
      <div className="research-card__details">
        <span>Effect</span>
        <strong>{model.effectLabel}</strong>
      </div>

      {model.lockedReason === undefined ? null : (
        <p className="research-card__reason">{model.lockedReason}</p>
      )}

      {model.status === "available" && !model.affordable ? (
        <p className="research-card__reason">Need more research points.</p>
      ) : null}

      {model.canUnlock ? (
        <button
          className="command-button command-button--primary research-card__unlock"
          onClick={() => onUnlock(model.id)}
          type="button"
        >
          Unlock
        </button>
      ) : null}
    </article>
  );
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
