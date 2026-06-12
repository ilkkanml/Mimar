import type { NodeTooltipModel } from "../panels/panelModels";
import type { Vec2 } from "../../game/state/types";

type NodeTooltipPlacement = "left" | "right";

type NodeTooltipProps = {
  model: NodeTooltipModel;
  placement: NodeTooltipPlacement;
  position: Vec2;
};

const NODE_TOOLTIP_WIDTH = 248;
const NODE_TOOLTIP_RIGHT_OFFSET = 196;
const NODE_TOOLTIP_LEFT_OFFSET = NODE_TOOLTIP_WIDTH + 16;
const NODE_TOOLTIP_TOP_OFFSET = -4;

export function NodeTooltip({
  model,
  placement,
  position
}: NodeTooltipProps) {
  const left =
    placement === "right"
      ? position.x + NODE_TOOLTIP_RIGHT_OFFSET
      : Math.max(8, position.x - NODE_TOOLTIP_LEFT_OFFSET);
  const top = Math.max(8, position.y + NODE_TOOLTIP_TOP_OFFSET);
  const flowRows = [...model.inputs, ...model.outputs].slice(0, 3);

  return (
    <aside
      className={`node-tooltip node-tooltip--${model.statusTone}`}
      role="tooltip"
      style={{
        transform: `translate(${left}px, ${top}px)`
      }}
    >
      <div className="node-tooltip__header">
        <div>
          <h3>{model.name}</h3>
          <p>
            Lv{model.level} / {model.categoryLabel}
          </p>
        </div>
        <span className={`node-tooltip__status node-tooltip__status--${model.statusTone}`}>
          {model.statusLabel}
        </span>
      </div>

      <div className="node-tooltip__metric">
        <span>Throughput</span>
        <strong>{model.throughputLabel}</strong>
      </div>

      {flowRows.map((flow, index) => (
        <div className="node-tooltip__metric" key={`${flow.resourceId}-${index}`}>
          <span>{flow.label}</span>
          <strong>
            {formatRate(flow.currentRate)} / {formatRate(flow.configuredRate)}
          </strong>
        </div>
      ))}

      {model.compute !== undefined ? (
        <div className="node-tooltip__metric">
          <span>Compute</span>
          <strong>
            {formatRate(model.compute.used)} / {formatRate(model.compute.requested)}
          </strong>
        </div>
      ) : null}

      {model.load !== undefined ? (
        <div className="node-tooltip__metric">
          <span>Power / Heat</span>
          <strong>
            {formatRate(model.load.powerUse)} / {formatRate(model.load.heatOutput)}
          </strong>
        </div>
      ) : null}

      {model.bottleneck !== undefined ? (
        <div
          className={[
            "node-tooltip__bottleneck",
            `node-tooltip__bottleneck--${model.bottleneck.severity}`
          ].join(" ")}
        >
          <strong>{model.bottleneck.reasonLabel}</strong>
          <p>{model.bottleneck.summary}</p>
          {model.bottleneck.metricSummary === undefined ? null : (
            <p>{model.bottleneck.metricSummary}</p>
          )}
          <p className="node-tooltip__bottleneck-action">
            {model.bottleneck.recommendedAction}
          </p>
        </div>
      ) : null}

      {model.upgrade !== undefined ? (
        <div className="node-tooltip__upgrade">
          <span>
            Next Lv{model.upgrade.nextLevel} / ${formatWhole(model.upgrade.nextCost)}
          </span>
          <strong>{model.upgrade.effectLabel}</strong>
        </div>
      ) : null}
    </aside>
  );
}

function formatRate(value: number): string {
  return `${formatNumber(value)}/s`;
}

function formatWhole(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    value
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1
  }).format(value);
}
