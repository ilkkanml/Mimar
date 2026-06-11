# Codex Start Here

This is the first file to give Codex when implementation starts.

## Required reading order

1. `PROJECT_CONTEXT.md`
2. `AGENTS.md`
3. `CONTRIBUTING.md`
4. `docs/MILESTONES.md`
5. `docs/CODEX_BACKLOG.md`
6. `docs/TECHNICAL_ARCHITECTURE.md`
7. `docs/CI_REQUIREMENTS.md`
8. `docs/TESTING_QA.md`
9. `specs/node-catalog.v0.json`
10. `specs/PORT_TYPE_RULES.md`
11. `specs/save-game.v0.json`

## Required visual reading before UI work

Before implementing any UI component, screen, style, menu, market surface, animation, or layout, read:

1. `docs/THEME_TOKENS.md`
2. `docs/VISUAL_BIBLE.md`
3. `docs/SCREEN_FLOW.md`
4. `docs/UI_COMPONENT_SPEC.md`
5. `docs/ICONOGRAPHY.md`
6. `docs/MOTION_AND_FEEDBACK.md`
7. `docs/MARKET_STORE_SPEC.md`
8. `docs/FIGMA_BRIEF.md`

Codex must not invent visual design. If a UI decision is missing, add a TODO and stop instead of creating a new visual direction.

## Active milestone

Start with M1 only.

Do not implement M2, M3, crypto, cyber-themed systems, AI economy, blueprint, staging room, campaign, prestige, or monetization in the first implementation pass.

## First prompt to Codex

```text
Read CODEX_START_HERE.md first, then read every file listed in its required reading order.

Start with M1 only.

Implement M1-001 through M1-003 from docs/CODEX_BACKLOG.md:
1. Create the runnable TypeScript web app foundation.
2. Add core domain types.
3. Add the first six node definitions.

Keep simulation code separate from UI code. Do not implement side operations yet. Add or prepare the required quality scripts. Update docs/DECISION_LOG.md after implementation.
```

## UI implementation prompt for Codex

Use this before M1-007 or any later UI task:

```text
Before implementing UI, read the Required visual reading section in CODEX_START_HERE.md. Implement only the UI components required by the active backlog item. Use docs/THEME_TOKENS.md exactly. Do not invent colors, layout, menu structure, market screens, animations, or icon style. If a visual decision is missing, add a TODO and stop.
```

## Continuation prompt

Use this when continuing in a new Codex session:

```text
Read CODEX_START_HERE.md and PROJECT_CONTEXT.md. Continue the first incomplete item in docs/CODEX_BACKLOG.md for the active milestone. Do not skip ahead. After changes, run the available quality checks and update docs/DECISION_LOG.md plus docs/CODEX_BACKLOG.md.
```

## Strict rules

- Do not invent a new architecture.
- Do not skip the backlog order.
- Do not mix multiple milestones unless explicitly requested.
- Do not invent visual design; follow the visual specs.
- Do not add real implementation details for sensitive fictional systems; use the abstract design rules in docs/RISK_AND_ETHICS.md.
- Do not mark work done without testing notes.
- Do not change save shape without considering schema version and migration notes.

## M1 order

1. M1-001 project setup foundation.
2. M1-002 core domain types.
3. M1-003 first node definitions.
4. M1-004 graph state actions.
5. M1-005 connection validation.
6. M1-006 basic simulation tick.
7. M1-007 graph canvas UI.
8. M1-008 resource bar and inspector.
9. M1-009 save/load v0.
10. M1-010 smoke tests and decision log.

## Done response format for Codex

At the end of every task, Codex must report:

```text
Changed:
- ...

Checked:
- ...

Docs updated:
- ...

Out of scope:
- ...

Next task:
- ...
```
