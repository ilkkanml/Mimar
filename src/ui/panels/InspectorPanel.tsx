import type {
  FlowRateModel,
  InspectorModel,
  NodeInspectorModel
} from "./panelModels";

type InspectorPanelProps = {
  model: InspectorModel;
  onBuyMax: (nodeId: string) => void;
  onUpgrade: (nodeId: string) => void;
};

export function InspectorPanel({
  model,
  onBuyMax,
  onUpgrade
}: InspectorPanelProps) {
  return (
    <aside className="inspector-panel" aria-label="Inspector">
      {model.kind === "empty" ? (
        <EmptyInspector model={model} />
      ) : (
        <NodeInspector
          model={model}
          onBuyMax={onBuyMax}
          onUpgrade={onUpgrade}
        />
      )}
    </aside>
  );
}

function EmptyInspector({
  model
}: {
  model: Extract<InspectorModel, { kind: "empty" }>;
}) {
  return (
    <div className="inspector-panel__empty">
      <div className="inspector-panel__empty-icon" aria-hidden="true" />
      <h2>{model.title}</h2>
      <p>{model.body}</p>
    </div>
  );
}

function NodeInspector({
  model,
  onBuyMax,
  onUpgrade
}: {
  model: NodeInspectorModel;
  onBuyMax: (nodeId: string) => void;
  onUpgrade: (nodeId: string) => void;
}) {
  const statusTone = model.bottleneck === undefined ? "normal" : "warning";

  return (
    <div className="inspector-panel__content">
      <div className="inspector-panel__header">
        <div>
          <h2>{model.name}</h2>
          <p>{model.categoryLabel}</p>
        </div>
        <div className="inspector-panel__level">Lv{model.level}</div>
      </div>

      <section className="inspector-section">
        <div className="inspector-section__title">Overview</div>
        <div className={`status-chip status-chip--${statusTone}`}>
          Status: {model.statusLabel}
        </div>
        <p className="inspector-section__body">{model.description}</p>
      </section>

      <section className="inspector-section">
        <div className="inspector-section__title">Throughput</div>
        <div className="inspector-meter">
          <div className="inspector-meter__track">
            <div
              className="inspector-meter__fill"
              style={{ width: `${model.throughputPercent}%` }}
            />
          </div>
          <span>{model.throughputPercent}% effective</span>
        </div>
        <FlowGroup emptyLabel="No external inputs" rows={model.inputs} title="Inputs" />
        <FlowGroup emptyLabel="No direct outputs" rows={model.outputs} title="Outputs" />
        {model.compute === undefined ? null : (
          <div className="flow-row flow-row--compute">
            <span>Compute</span>
            <strong>
              {formatRate(model.compute.used)} used
              {model.compute.requested > 0
                ? ` / ${formatRate(model.compute.requested)} requested`
                : ""}
              {model.compute.provided > 0
                ? ` / ${formatRate(model.compute.provided)} provided`
                : ""}
            </strong>
          </div>
        )}
        {model.load === undefined ? null : (
          <div className="flow-row flow-row--infrastructure">
            <span>Power / Heat</span>
            <strong>
              {formatNumber(model.load.powerUse)} power /{" "}
              {formatNumber(model.load.heatOutput)} heat
            </strong>
          </div>
        )}
      </section>

      <section className="inspector-section">
        <div className="inspector-section__title">Reason</div>
        {model.bottleneck === undefined ? (
          <p className="inspector-section__body">No major bottleneck.</p>
        ) : (
          <div className="bottleneck-card">
            <strong>{model.bottleneck.reasonLabel}</strong>
            <p>{model.bottleneck.summary}</p>
          </div>
        )}
      </section>

      <section className="inspector-section inspector-section--upgrade">
        <div className="inspector-section__title">Upgrade</div>
        {model.upgrade === undefined ? (
          <p className="inspector-section__body">No upgrade path configured.</p>
        ) : (
          <>
            <div className="upgrade-preview">
              <div className="upgrade-preview__row">
                <span>Next</span>
                <strong>
                  Lv{model.upgrade.nextLevel} / $
                  {formatNumber(model.upgrade.nextCost)}
                </strong>
              </div>
              <div className="upgrade-preview__row">
                <span>Effect</span>
                <strong>{model.upgrade.effectLabel}</strong>
              </div>
              <div className="upgrade-preview__row">
                <span>Buy Max</span>
                <strong>
                  {model.upgrade.buyMaxCount > 0
                    ? `+${model.upgrade.buyMaxCount} to Lv${model.upgrade.buyMaxLevel} / $${formatNumber(
                        model.upgrade.buyMaxCost
                      )}`
                    : "Not affordable"}
                </strong>
              </div>
            </div>
            <div className="upgrade-actions">
              <button
                className="command-button command-button--primary"
                disabled={!model.upgrade.canUpgrade}
                onClick={() => onUpgrade(model.nodeId)}
                type="button"
              >
                Upgrade
              </button>
              <button
                className="command-button"
                disabled={!model.upgrade.canBuyMax}
                onClick={() => onBuyMax(model.nodeId)}
                type="button"
              >
                Buy Max
              </button>
            </div>
          </>
        )}
      </section>

      <section className="inspector-section">
        <div className="inspector-section__title">Action</div>
        <p className="inspector-section__body">
          {model.recommendedAction ?? "Select another node to compare its flow."}
        </p>
      </section>
    </div>
  );
}

function FlowGroup({
  emptyLabel,
  rows,
  title
}: {
  emptyLabel: string;
  rows: FlowRateModel[];
  title: string;
}) {
  return (
    <div className="flow-group">
      <div className="flow-group__title">{title}</div>
      {rows.length === 0 ? (
        <div className="flow-row flow-row--empty">{emptyLabel}</div>
      ) : (
        rows.map((row) => (
          <div className="flow-row" key={row.resourceId}>
            <span>{row.label}</span>
            <strong>
              {formatRate(row.currentRate)} / {formatRate(row.configuredRate)}
            </strong>
          </div>
        ))
      )}
    </div>
  );
}

function formatRate(value: number): string {
  return `${formatNumber(value)}/s`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
