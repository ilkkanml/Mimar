# Mimar — Testing and QA Guard

Codex must not mark work as complete unless it can answer four questions:

1. What changed?
2. What was tested?
3. Which command or manual check passed?
4. What is intentionally out of scope?

## Default command gate

After code exists, run the project scripts for lint, tests, and build. If the scripts do not exist yet, M1 project setup must add them.

## M1 minimum checks

- App starts locally.
- First six nodes are available.
- Nodes can be placed and moved.
- Valid connections work.
- Invalid connections show a reason.
- The first data pipeline produces money.
- Compute shortage is visible.
- Research can increase.
- Save and load preserve graph state.
- Relevant tests pass.
- Decision log is updated.

## Save compatibility

Every save file must include a schema version. Do not require temporary UI state for simulation. Add migrations before changing persisted structure.

## Manual smoke script

Start a new game, place the first pipeline, connect it, confirm money increases, add research, save, reload, and confirm the graph continues working.

## Reference docs

Use these files for detailed acceptance criteria:

- docs/MILESTONES.md
- docs/CODEX_BACKLOG.md
- docs/UX_UI_SPEC.md
- docs/SYSTEMS_AND_ECONOMY.md
- docs/RISK_AND_ETHICS.md
