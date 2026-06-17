# Local Handoff

Date: 2026-06-16

## Repository State

- Current branch: `main`
- Latest safe baseline before M2-008: `9fc424ec5660228984e53854168c2853ad800fbf`
- Latest feature commit after M2-008 implementation pass: `6e647430b00bb43c946f4dec78315374faecdf3e`
- Save schema: unchanged at `schemaVersion: 0`

## Completed

- M1 is frozen.
- M2-001 Power/Heat is complete.
- M2-002 Contracts v0 is complete.
- M2-003 Research Tree v0 is complete.
- M2-004 Buy Max and Upgrade Scaling is complete.
- M2-005 Undo/Redo v0 is complete.
- M2-006 Node Tooltip Metrics v0 is complete.
- M2-007 Better Bottleneck Messages v0 is complete.
- M2-008 Node Palette Placement v0 has been implemented as a GitHub patch pass.

## M2-008 Implementation Summary

- Added node placement domain action.
- Added deterministic placement position helper.
- Added placement cost handling from node definition `baseCost`.
- Added insufficient-money guard.
- Added automatic selection for newly placed nodes.
- Added node palette view model and tests.
- Added minimal Node Palette UI on the canvas.
- Wired placement through the existing app/history path so placement can participate in undo/redo.
- Added save/load persistence coverage for newly placed nodes.

## Not Started

- No task after M2-008 has been started.
- Side Operations, Blueprint Library, Staging Room, Market, Campaign systems, monetization systems, prestige/reset systems, full tutorial/notification systems, and new visual direction remain out of scope.

## Partially Done

- M2-008 code and tests were written through GitHub.
- Local verification still needs to be run because ChatGPT cannot execute the project test suite in the user's local repo.

## Required Local Checks

Run locally before approving M2-008 freeze:

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

## Suggested Next Task

Only after local checks pass: close/commit any local fixes if needed, then decide the next M2 item.

## Known Risks / TODOs

- M2-008 was committed as multiple GitHub patch commits instead of one local commit.
- CI status was not available from GitHub for the latest commit at the time of handoff.
- If local checks fail, fix only M2-008 issues before starting the next task.
