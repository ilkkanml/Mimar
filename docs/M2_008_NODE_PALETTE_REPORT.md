# M2-008 Node Palette / Place New Node v0

Status: Implemented via ChatGPT GitHub pass.

## Scope

M2-008 adds the first playable node placement loop on top of the existing graph baseline.

Implemented:

- Node placement action with deterministic ids and positions.
- Placement cost handling from existing node definition `baseCost`.
- Insufficient-money guard for paid nodes.
- Automatic selection of newly placed nodes.
- Node Palette view model.
- Minimal canvas Node Palette UI.
- Undo/redo-compatible placement through existing history push path.
- Save/load persistence for placed node instances through existing save schema v0.

## Files

- `src/game/state/nodePlacement.ts`
- `src/game/state/nodePlacement.test.ts`
- `src/game/save/nodePlacementSave.test.ts`
- `src/ui/panels/nodePaletteModels.ts`
- `src/ui/panels/nodePaletteModels.test.ts`
- `src/ui/panels/NodePalette.tsx`
- `src/ui/panels/NodePalette.css`
- `src/ui/canvas/GraphCanvas.tsx`
- `src/app/App.tsx`

## Save Schema

Save schema remains unchanged at `schemaVersion: 0`.

Placed nodes are persisted through the existing graph node serialization.

## Out of Scope

Not implemented:

- Side Operations
- Blueprint Library
- Staging Room
- Market
- Campaign systems
- Monetization systems
- Prestige/reset systems
- Full marketplace/catalog
- Full drag-from-palette polish
- Advanced placement validation
- New visual direction
- New node types

## Required Follow-Up

Run locally:

- `npm.cmd run lint`
- `npm.cmd test`
- `npm.cmd run build`
- `git diff --check`

Browser smoke should verify:

- App starts without console errors.
- Existing seeded graph still renders.
- Node Palette displays.
- Free node placement works.
- Paid node placement is disabled or rejected when money is insufficient.
- Newly placed node can be moved.
- Newly placed node can be connected if ports allow.
- Power/Heat, Contracts, Research, Upgrades, Undo/Redo, Tooltip, Bottleneck messages still work.
- Save -> New System -> Load preserves newly placed node.
