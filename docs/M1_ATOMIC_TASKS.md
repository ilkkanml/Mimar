# M1 Atomic Tasks

This file exists so Codex does not need to invent task order.

Active milestone: M1 Vertical Prototype.

Do the tasks in this exact order. Do not skip ahead.

## M1-001 Project setup foundation

Read:

- CODEX_START_HERE.md
- docs/TECHNICAL_ARCHITECTURE.md
- docs/CI_REQUIREMENTS.md

Deliver:

- Runnable TypeScript web app foundation.
- Strict TypeScript config.
- Lint, test, and build scripts.
- Basic test setup.
- Repository quality workflow.
- Decision log update.

Do not implement gameplay.

## M1-002 Core domain types

Deliver:

- GameState.
- GraphState.
- NodeDefinition.
- NodeInstance.
- EdgeInstance.
- ResourceState.
- Stable ID types.

Keep types independent from UI.

## M1-003 First six node definitions

Use:

- specs/node-catalog.v0.json
- specs/PORT_TYPE_RULES.md

Deliver definitions for:

- Internet Feed.
- Parser.
- Cleaner.
- Upload Gateway.
- CPU Rack.
- Research Lab.

Add validation tests.

## M1-004 Graph state actions

Deliver:

- Add node.
- Move node.
- Delete node.
- Select node.
- Connect nodes.
- Delete edge.

Deleting a node must remove related edges.

## M1-005 Connection validation

Deliver:

- Output-to-input rule.
- Resource compatibility rule.
- Same-node rejection.
- Missing node or port guard.
- Visible validation reason.

Add tests.

## M1-006 Basic simulation tick

Deliver:

- Fixed tick function.
- Source production.
- Processing conversion.
- Resource movement across edges.
- Upload Gateway money output.
- Research Lab research output.
- Compute capacity effect.
- Basic bottleneck reason.

Add integration test for the first pipeline.

## M1-007 Graph canvas UI

Deliver:

- GraphCanvas.
- NodeView.
- EdgeView.
- PortView.
- Node drag.
- Port connection interaction.

Keep simulation outside UI components.

## M1-008 Resource bar and inspector

Deliver:

- ResourceBar.
- NodePalette.
- InspectorPanel.
- BottleneckPanel.

Show money, data, compute, and research.

## M1-009 Save/load v0

Use:

- specs/save-game.v0.json

Deliver:

- Save schema version.
- Local save.
- Load.
- New game reset.
- Roundtrip test.

## M1-010 M1 smoke tests and docs

Deliver:

- At least five meaningful tests.
- Manual smoke note.
- docs/DECISION_LOG.md update.
- docs/CODEX_BACKLOG.md status update.
- docs/MILESTONES.md acceptance update if complete.

## M1 hard boundaries

Do not implement:

- M2 power/heat depth beyond placeholders.
- Crypto side operation logic.
- Cyber-themed side operation logic.
- AI economy.
- Blueprint system.
- Staging room.
- Campaign progression.
- Monetization.

These are documented for later milestones only.
