import "./NodePalette.css";

import type { NodeDefinitionId } from "../../game/state/types";
import type { NodePaletteModel } from "./nodePaletteModels";

type NodePaletteProps = {
  model: NodePaletteModel;
  onPlace: (definitionId: NodeDefinitionId) => void;
};

export function NodePalette({ model, onPlace }: NodePaletteProps) {
  return (
    <aside className="node-palette" aria-label="Node Palette">
      <div className="node-palette__header">
        <div>
          <div className="node-palette__eyebrow">Node Library</div>
          <h2 className="node-palette__title">Place Node</h2>
        </div>
        <span className="node-palette__count">
          {model.affordableCount}/{model.totalCount}
        </span>
      </div>
      <div className="node-palette__list">
        {model.items.map((item) => (
          <button
            aria-label={`Place ${item.name}`}
            className="node-palette__item"
            disabled={!item.canPlace}
            key={item.definitionId}
            onClick={() => onPlace(item.definitionId)}
            type="button"
          >
            <span className="node-palette__item-main">
              <span className="node-palette__item-name">{item.name}</span>
              <span className="node-palette__item-category">
                {item.categoryLabel}
              </span>
            </span>
            <span className="node-palette__item-cost">{item.costLabel}</span>
            {item.disabledReason === undefined ? null : (
              <span className="node-palette__item-reason">
                {item.disabledReason}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
