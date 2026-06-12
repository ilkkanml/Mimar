import type { ContractCardModel, ContractPanelModel } from "./panelModels";

type ContractPanelProps = {
  model: ContractPanelModel;
  onClaim: (contractId: string) => void;
};

export function ContractPanel({ model, onClaim }: ContractPanelProps) {
  return (
    <aside className="contract-panel" aria-label="Contracts">
      <div className="contract-panel__header">
        <div>
          <h2>Contracts</h2>
          <p>
            {model.activeCount} active / {model.completedCount} ready /{" "}
            {model.claimedCount} claimed
          </p>
        </div>
        <span className="contract-panel__available">
          {model.availableCount} available
        </span>
      </div>

      {model.focusedContract === undefined ? (
        <p className="contract-panel__empty">No contracts available.</p>
      ) : (
        <ContractCard model={model.focusedContract} onClaim={onClaim} />
      )}
    </aside>
  );
}

function ContractCard({
  model,
  onClaim
}: {
  model: ContractCardModel;
  onClaim: (contractId: string) => void;
}) {
  return (
    <article className={`contract-card contract-card--${model.status}`}>
      <div className="contract-card__topline">
        <h3>{model.title}</h3>
        <span className={`contract-status contract-status--${model.status}`}>
          {model.statusLabel}
        </span>
      </div>
      <p className="contract-card__description">{model.description}</p>

      <div className="contract-card__meter">
        <div className="contract-card__meter-track" aria-hidden="true">
          <div
            className="contract-card__meter-fill"
            style={{ width: `${model.progressPercent}%` }}
          />
        </div>
        <span>
          {formatNumber(model.progressCurrent)} /{" "}
          {formatNumber(model.progressRequired)}
        </span>
      </div>

      <div className="contract-card__details">
        <span>{model.requirementLabel}</span>
        <strong>{model.rewardLabel}</strong>
      </div>

      {model.canClaim ? (
        <button
          className="command-button command-button--primary contract-card__claim"
          onClick={() => onClaim(model.id)}
          type="button"
        >
          Claim
        </button>
      ) : null}
    </article>
  );
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
