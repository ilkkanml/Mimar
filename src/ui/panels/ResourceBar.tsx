import type {
  LoadMetricModel,
  ResourceBarModel,
  ResourceMetricModel
} from "./panelModels";

type ResourceBarProps = {
  model: ResourceBarModel;
};

export function ResourceBar({ model }: ResourceBarProps) {
  return (
    <header className="resource-bar" aria-label="Resource bar">
      <div className="resource-bar__brand">
        <span className="resource-bar__brand-mark">MIMAR</span>
      </div>

      <div className="resource-bar__metrics">
        <ResourceMetricItem metric={model.money} variant="money" />
        {model.data.map((metric) => (
          <ResourceMetricItem
            key={metric.resourceId}
            metric={metric}
            variant={metric.resourceId}
          />
        ))}
        <ComputeMetricItem model={model.compute} />
        <LoadMetricItem model={model.power} />
        <LoadMetricItem model={model.heat} />
        <ResourceMetricItem metric={model.research} variant="research" />
      </div>

      {model.warning === undefined ? null : (
        <div
          className={[
            "resource-bar__warning",
            `resource-bar__warning--${model.warning.severity}`
          ].join(" ")}
          role="status"
        >
          <span className="resource-bar__warning-label">Bottleneck</span>
          <span className="resource-bar__warning-text">
            {model.warning.nodeName}: {model.warning.reasonText}
          </span>
        </div>
      )}
    </header>
  );
}

function ResourceMetricItem({
  metric,
  variant
}: {
  metric: ResourceMetricModel;
  variant: string;
}) {
  return (
    <div className={`resource-item resource-item--${variant}`}>
      <span className="resource-item__label">{metric.label}</span>
      <span className="resource-item__value">
        {formatResourceValue(metric)}
      </span>
      <span
        className={[
          "resource-item__rate",
          metric.rate > 0 ? "resource-item__rate--positive" : "",
          metric.rate < 0 ? "resource-item__rate--negative" : ""
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {formatRate(metric.rate)}
      </span>
    </div>
  );
}

function LoadMetricItem({ model }: { model: LoadMetricModel }) {
  return (
    <div
      className={[
        "resource-item",
        `resource-item--${model.resourceId}`,
        model.warning ? "resource-item--warning" : "",
        model.critical ? "resource-item--critical" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="resource-item__label">{model.label}</span>
      <span className="resource-item__value">
        {model.resourceId === "heat"
          ? `${formatNumber(model.pressurePercent)}%`
          : `${formatNumber(model.used)}/${formatNumber(model.capacity)}`}
      </span>
      <span className="resource-item__rate">
        {model.resourceId === "heat"
          ? `${formatNumber(model.used)}/${formatNumber(model.capacity)}`
          : "load"}
      </span>
    </div>
  );
}

function ComputeMetricItem({ model }: { model: ResourceBarModel["compute"] }) {
  return (
    <div
      className={[
        "resource-item",
        "resource-item--compute",
        model.warning ? "resource-item--warning" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="resource-item__label">Compute</span>
      <span className="resource-item__value">
        {formatNumber(model.used)}/{formatNumber(model.capacity)}
      </span>
      <span className="resource-item__rate">
        {model.warning ? "limited" : "capacity"}
      </span>
    </div>
  );
}

function formatResourceValue(metric: ResourceMetricModel): string {
  if (metric.resourceId === "money") {
    return `$${formatNumber(metric.value)}`;
  }

  return formatNumber(metric.value);
}

function formatRate(rate: number): string {
  if (rate === 0) {
    return "+0/s";
  }

  const sign = rate > 0 ? "+" : "";
  return `${sign}${formatNumber(rate)}/s`;
}

function formatNumber(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000) {
    return `${trimNumber(value / 1_000_000)}M`;
  }

  if (absValue >= 1_000) {
    return `${trimNumber(value / 1_000)}K`;
  }

  return trimNumber(value);
}

function trimNumber(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
