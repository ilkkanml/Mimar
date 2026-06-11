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

## Continuation prompt

Use this when continuing in a new Codex session:

```text
Read CODEX_START_HERE.md and PROJECT_CONTEXT.md. Continue the first incomplete item in docs/CODEX_BACKLOG.md for the active milestone. Do not skip ahead. After changes, run the available quality checks and update docs/DECISION_LOG.md plus docs/CODEX_BACKLOG.md.
```

## Strict rules

- Do not invent a new architecture.
- Do not skip the backlog order.
- Do not mix multiple milestones unless explicitly requested.
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
