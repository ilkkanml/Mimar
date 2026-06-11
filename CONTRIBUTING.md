# Contributing to Mimar

This project is currently developed by the repository owner with help from Codex / AI coding agents. The goal of this file is to make every implementation task predictable, testable, and easy to continue in a new chat or coding session.

## Required reading order

Before writing code, read these files in order:

1. `PROJECT_CONTEXT.md`
2. `AGENTS.md`
3. `docs/MILESTONES.md`
4. `docs/CODEX_BACKLOG.md`
5. `docs/TECHNICAL_ARCHITECTURE.md`
6. The specific design document related to the task:
   - Game design: `docs/GAME_BIBLE.md`
   - Economy: `docs/SYSTEMS_AND_ECONOMY.md`
   - Crypto/cyber: `docs/CRYPTO_CYBER_SIDE_OPS.md`
   - UI/UX: `docs/UX_UI_SPEC.md`
   - Safety: `docs/RISK_AND_ETHICS.md`

Do not start from memory. Always use the repository documents as the source of truth.

## Work protocol

For every task:

1. Identify the active milestone.
2. Pick exactly one backlog item unless the issue explicitly groups several small setup tasks.
3. Write a short implementation plan.
4. Implement the smallest useful slice.
5. Add or update tests.
6. Run the quality gate.
7. Update docs if behavior or architecture changed.
8. Leave the repo in a state another Codex session can continue.

## Quality gate

When the project has package scripts, run:

```bash
npm install
npm run lint
npm test
npm run build
```

If a script does not exist yet, add it during project setup or clearly document why it is not available.

## Required documentation updates

Update these when relevant:

- `docs/DECISION_LOG.md` — architecture/product decisions.
- `docs/CODEX_BACKLOG.md` — item status and newly discovered tasks.
- `docs/MILESTONES.md` — milestone status and acceptance progress.
- `PROJECT_CONTEXT.md` — only when the high-level state changes.

## Branch and commit style

Preferred branch naming:

```text
m1/project-setup
m1/domain-types
m1/simulation-tick
m2/contracts-v0
m3/crypto-v0
```

Preferred commit style:

```text
feat: add node graph state model
feat: implement basic simulation tick
fix: reject invalid port connections
test: add save-load roundtrip coverage
docs: update decision log for state architecture
chore: add CI workflow
```

## Pull request checklist

Every PR or task handoff should include:

- What changed.
- How it was tested.
- Screenshots or short notes for UI changes.
- Known limitations.
- Next recommended backlog item.

## Code rules

- TypeScript strict mode should stay enabled.
- Avoid `any` unless justified.
- Keep simulation logic separate from UI.
- Keep game balance values in data/config modules.
- Use stable IDs for nodes, resources, contracts, and research.
- Save files must include `schemaVersion`.
- Runtime-only UI state should not be required for simulation correctness.

## Safety rules for cyber systems

Cyber ops are fictional and abstract. Do not implement or document real hacking steps, real exploit names, real commands, credential theft, malware, bypass techniques, or real-world target instructions.

Allowed vocabulary:

- Payload Power
- Target Defense
- Trace Risk
- Stealth Score
- Bug Bounty Target
- Security Audit

## Done definition

A task is done only when:

- It builds.
- Relevant tests pass.
- Save/load is not broken.
- The UI behavior is manually checked when UI changed.
- Docs/backlog are updated if needed.
- There is no hidden follow-up required to understand what happened.
