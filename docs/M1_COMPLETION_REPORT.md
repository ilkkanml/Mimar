# M1 Completion Report

Date: 2026-06-11

Status: Freeze candidate after M1-010.

## What M1 Includes

- Vite + React + TypeScript foundation with strict TypeScript, ESLint, Vitest, and production build scripts.
- Core domain types for `GameState`, graph state, nodes, edges, resources, contracts, research, side operations, and settings.
- First six M1 node definitions: Internet Feed, Parser, Cleaner, Upload Gateway, CPU Rack, and Research Lab.
- Pure graph actions for add, move, delete, select, connect, and delete edge.
- Connection validation for output-to-input direction, resource compatibility, same-node rejection, missing node/port guards, and validation reasons.
- Fixed-step simulation tick for resource flow, money production, research production, compute usage/capacity, node runtime stats, and basic bottleneck reasons.
- Graph canvas UI with node rendering, SVG edge rendering, node drag, selected-node styling, and port-drag connections.
- Resource bar and Inspector panel reading from the current game state and simulation runtime outputs.
- Save/load v0 with LocalStorage adapter, `schemaVersion: 0`, safe load failures, persisted graph/resources/buffers/selection, and runtime reset/recompute behavior.
- M1 smoke/integration coverage for the full domain loop.

## What M1 Does Not Include

- M2 systems: power/heat, contracts, research deck/tree, buy max, undo/redo, or advanced tooltips.
- M3+ systems: crypto, cyber side operations, AI/cloud economy, GPU allocation, market systems, or side income panel.
- Blueprint library, staging room, settings modal, cloud save, autosave, export/import, or save migrations beyond v0.
- New visual direction beyond the approved M1 Blueprint Control Room style.
- Full node palette / place-new-node UI. The current browser prototype uses a seeded starter graph and graph actions remain domain-testable.

## Automated Checks

- `npm.cmd run lint`: Passed on 2026-06-11.
- `npm.cmd test`: Passed on 2026-06-11, 7 test files and 30 tests.
- `npm.cmd run build`: Passed on 2026-06-11.

## Automated M1 Smoke Coverage

`src/tests/m1Smoke.test.ts` verifies:

- App/game state can create the first pipeline: Internet Feed -> Parser -> Cleaner -> Upload Gateway.
- Valid connections are accepted and invalid direction connections are rejected without mutating graph edges.
- Simulation tick produces money and research when the graph has the needed CPU capacity and downstream nodes.
- Compute usage/capacity is calculated.
- Compute bottleneck reason appears when CPU capacity is constrained.
- Node selection updates the Inspector view model.
- Save payload serializes the current graph/game state.
- Load restores graph nodes, edges, balances, buffers, and selected node state.
- Runtime/rate fields reset on load and recompute after the next tick.

## Browser Smoke Checklist

- [x] App starts without console errors.
- [x] Nodes render.
- [x] Nodes can be dragged.
- [x] Edge path updates after dragging.
- [x] Ports can be connected.
- [x] Resource bar updates.
- [x] Inspector updates on selection.
- [x] Bottleneck state appears.
- [x] Save works.
- [x] New System resets.
- [x] Load restores graph and balances.

Browser smoke evidence:

- URL: `http://127.0.0.1:5173/`
- Screenshot: `C:/Users/ilkkan/AppData/Local/Temp/mimar-m1-010-smoke.png`
- Observed behavior: Parser was dragged, Parser -> Cleaner and Cleaner -> Upload Gateway connections were added, edge paths changed after drag, Inspector switched to Cleaner, Save succeeded, New System reset to the starter graph, and Load restored the dragged graph with balances.

## Known Limitations

- The current UI does not yet include a full Node Palette or place-new-node interaction; the M1 browser prototype starts from a seeded starter graph.
- The seeded browser graph intentionally lacks CPU Rack placement, so the visible browser smoke includes the expected compute bottleneck until node placement or palette work is added.
- Save/load v0 is LocalStorage-only and intentionally excludes cloud save, autosave, export/import, and migrations beyond v0.
- Runtime node status, rates, compute capacity, and usage reset on load and recompute on the next tick by design.
- Power, heat, contracts, research deck logic, side operations, blueprint, staging room, and settings remain out of scope for M1.

## Next Milestone Recommendation

Freeze M1 as the scoped vertical-prototype baseline after owner acceptance of the known UI placement limitation. The next implementation step should be M2 planning or M2-001 Power and Heat System only after M1 is explicitly accepted.
