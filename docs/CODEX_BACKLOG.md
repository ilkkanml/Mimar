# Mimar — Codex Backlog

Bu dosya Codex'e verilecek uygulanabilir iş paketlerini tutar. Yeni oturumda Codex önce `PROJECT_CONTEXT.md`, `AGENTS.md`, `docs/MILESTONES.md` ve bu dosyayı okumalıdır.

Backlog item formatı:

```text
ID — Title
Milestone: Mx
Priority: P0/P1/P2
Status: Todo/In Progress/Done/Blocked
Context:
Tasks:
Acceptance:
Notes:
```

---

# M1 — Vertical Prototype Backlog

## M1-001 — Initialize web TypeScript project

Milestone: M1  
Priority: P0  
Status: Done

### Context

Proje şu an dokümantasyon aşamasında. İlk kod temeli kurulacak.

### Tasks

- Vite + TypeScript projesi kur.
- React kullanılıyorsa React template seç.
- TypeScript strict mode aç.
- ESLint + Prettier ekle.
- Vitest ekle.
- `src/` klasör yapısını `docs/TECHNICAL_ARCHITECTURE.md` dosyasına göre oluştur.

### Acceptance

- `npm install` çalışır.
- `npm run dev` çalışır.
- `npm run build` çalışır.
- `npm test` boş veya örnek testle çalışır.

### Completion notes

- Vite + React + TypeScript foundation added.
- Strict TypeScript, ESLint, Prettier, Vitest, and GitHub Actions CI added.
- `src/` foundation follows `docs/TECHNICAL_ARCHITECTURE.md`.

---

## M1-002 — Add core domain types

Milestone: M1  
Priority: P0  
Status: Done

### Tasks

- `GameState` tipi.
- `GraphState` tipi.
- `NodeDefinition` tipi.
- `NodeInstance` tipi.
- `EdgeInstance` tipi.
- `ResourceState` tipi.
- Resource id ve node category union tipleri.

### Acceptance

- TypeScript strict modda tipler hatasız derlenir.
- Tipler simulation ve UI'dan bağımsızdır.

### Completion notes

- Core domain types added under `src/game/state`.
- Types remain independent from React/UI components.

---

## M1-003 — Add first node definitions

Milestone: M1  
Priority: P0  
Status: Done

### Tasks

İlk 6 node'u ekle:

- Internet Feed
- Parser
- Cleaner
- Upload Gateway
- CPU Rack
- Research Lab

`specs/node-catalog.v0.json` referans alınmalı.

### Acceptance

- Node definition'lar import edilebilir.
- Node id'leri stable ve lowercase snake_case olur.
- Her node input/output port ve base stat içerir.
- Unit test: tüm node definition'lar valid.

### Completion notes

- First six M1 node definitions added under `src/game/data`.
- Unit tests validate ids, categories, M1 resources, ports, stats, and lookup.

---

## M1-004 — Implement graph state actions

Milestone: M1  
Priority: P0  
Status: Done

### Tasks

- Add node.
- Move node.
- Delete node.
- Select node.
- Connect nodes.
- Delete edge.

### Acceptance

- Node instance unique id alır.
- Edge instance unique id alır.
- Node silinince ilgili edge'ler silinir.
- State mutation güvenli ve test edilebilir olur.

### Completion notes

- Pure graph state actions added under `src/game/state/actions.ts`.
- Add, move, delete, select, connect, and delete-edge actions return new state without mutating the previous state.
- Unit tests cover unique ids, immutable updates, selection, edge creation, edge deletion, and node deletion cleanup.
- Connection rule validation is intentionally left for M1-005.

---

## M1-005 — Implement connection validation

Milestone: M1  
Priority: P0  
Status: Done

### Tasks

- Output -> input kuralı.
- Resource type uyumu.
- Same node connection reddi.
- Missing port/node guard.
- Validation result reason döndürür.

### Acceptance

- Geçersiz bağlantılar state'e yazılmaz.
- UI validation reason gösterebilir.
- Unit tests: valid edge, invalid direction, resource mismatch, same node.

### Completion notes

- Connection validation added under `src/game/graph/validation.ts`.
- Validation covers missing node, missing definition, missing port, same node, invalid direction, resource mismatch, and optional port capacity.
- `connectNodesIfValid` writes valid edges and returns validation reasons without mutating state for invalid connections.
- Unit tests cover valid edge, invalid direction, resource mismatch, same node, missing guards, and invalid connection state safety.

---

## M1-006 — Implement basic simulation tick

Milestone: M1  
Priority: P0  
Status: Done

### Tasks

- Fixed tick function yaz.
- Source node üretimi.
- Processing node tüketim/üretim.
- Edge üzerinden resource flow.
- Upload Gateway para üretimi.
- Research Lab research üretimi.
- Compute usage/capacity hesapla.

### Acceptance

- Internet Feed -> Parser -> Cleaner -> Upload Gateway hattı money/sec üretir.
- Research Lab clean data tüketip research/sec üretir.
- Compute yetmezse throughput düşer.
- Integration test yazılır.

### Completion notes

- Fixed tick simulation added under `src/game/simulation/tick.ts`.
- Simulation moves resources across edges through node buffers, processes node conversions, produces money/research, and calculates compute capacity/usage.
- Node runtime stats now include basic throughput and bottleneck reason for `input_starved` and `compute_limited`.
- Integration tests cover money production, research production, compute throttling, and edge resource movement.

---

## M1-007 — Build basic graph canvas UI

Milestone: M1  
Priority: P0  
Status: Done

### Tasks

- GraphCanvas component.
- NodeView component.
- EdgeView component.
- PortView component.
- Node drag.
- Port drag connection.
- Basic pan/zoom opsiyonel.

### Acceptance

- Oyuncu node'ları ekranda görür.
- Node sürüklenebilir.
- Porttan porta bağlantı kurulabilir.
- Edge çizgisi görünür.

### Completion notes

- Basic graph canvas UI added under `src/ui/canvas`.
- Implemented `GraphCanvas`, `NodeView`, `EdgeView`, and `PortView`.
- Nodes can be dragged; edge paths update from node positions.
- Output ports can be dragged to compatible input ports to create validated edges.
- Browser smoke test verified visible nodes, edge creation, and node dragging at `http://127.0.0.1:5173/`.

---

## M1-008 — Build resource bar and inspector

Milestone: M1  
Priority: P1  
Status: Done

### Tasks

- ResourceBar.
- InspectorPanel.
- Selection wiring from node click to inspector.
- Bottleneck summary in ResourceBar and InspectorPanel.
- Simulation state wiring for live resource and node runtime readouts.

### Acceptance

- Money/Data/Compute/Research görünür.
- Seçili node detayları görünür.
- Bottleneck reason text görünür.
- Node drag ve port connection davranışı bozulmaz.

### Completion notes

- ResourceBar added with money, raw/parsed/clean data, compute usage/capacity, research, and main bottleneck summary.
- InspectorPanel added with empty state and selected-node overview, throughput, reason, and recommended-action sections.
- App shell now owns shared GameState and advances the M1 fixed simulation tick so ResourceBar, InspectorPanel, and GraphCanvas read the same state.
- Node click selection updates the inspector; selected nodes keep a distinct outline even when warning state is active.
- NodePalette, save/load, contracts, research deck, blueprint, staging room, market systems, and future gameplay were intentionally not added in this scoped M1-008 pass.

---

## M1-009 — Implement save/load v0

Milestone: M1  
Priority: P0  
Status: Done

### Tasks

- SaveGame schema.
- LocalStorage save.
- Load.
- New game reset.
- `schemaVersion`.
- Runtime transient alanları ayır.

### Acceptance

- Save/load sonrası graph ve kaynaklar korunur.
- Broken save durumunda oyun çökmez.
- Save/load roundtrip test yazılır.

### Completion notes

- SaveGame v0 schema helpers, serialization, migration guard, LocalStorage save/load, and clear/reset adapter added under `src/game/save`.
- Save payloads include `schemaVersion: 0`, `savedAt`, `gameVersion`, and normalized `gameState`.
- Graph nodes, edges, selection, buffers, and resource balances are persisted; tick/runtime fields are reset and recomputed after load.
- Bottom command strip added with Save, Load, and New System controls plus save status feedback.
- Unit tests cover save/load roundtrip, storage adapter behavior, missing/broken save handling, and unsupported schema rejection.

---

## M1-010 — Add M1 smoke tests and decision log

Milestone: M1  
Priority: P1  
Status: Done

### Tasks

- Add final M1 smoke/integration coverage for graph creation, valid/invalid connections, simulation output, compute bottlenecks, selection/Inspector state, save serialization, load restore, and runtime recompute.
- Document the M1 browser smoke checklist.
- Create `docs/M1_COMPLETION_REPORT.md`.
- Update `docs/DECISION_LOG.md` and project status docs.

### Acceptance

- `npm.cmd run lint` passes.
- `npm.cmd test` passes.
- `npm.cmd run build` passes.
- Browser smoke confirms resources, selection/Inspector, node drag, port connection, edge path update, Save, New System, and Load.
- `docs/M1_COMPLETION_REPORT.md` records M1 scope, non-scope, test results, browser smoke checklist, limitations, and next recommendation.
- `docs/DECISION_LOG.md` is updated.

### Completion notes

- Added `src/tests/m1Smoke.test.ts` as final M1 domain smoke coverage.
- Added `docs/M1_COMPLETION_REPORT.md` with automated checks, browser smoke checklist, known limitations, and freeze recommendation.
- Required checks passed on 2026-06-11: `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build`.
- Browser smoke passed at `http://127.0.0.1:5173/` with evidence screenshot at `C:/Users/ilkkan/AppData/Local/Temp/mimar-m1-010-smoke.png`.

---

# M2 — Core Systems Slice Backlog

## M2-001 — Power and heat system

Priority: P0  
Status: Todo

- Power capacity and usage.
- Heat accumulation.
- Cooling node.
- Heat throttling.
- UI indicators.

## M2-002 — Contract system v0

Priority: P0  
Status: Todo

- Contract definitions.
- Active contract state.
- Contract progress by delivered resource.
- Deadline/reward/penalty.
- First 5 contracts.

## M2-003 — Research tree v0

Priority: P0  
Status: Todo

- Research definitions.
- Unlock requirements.
- Purchase research.
- Unlock node/upgrade.

## M2-004 — Buy Max and upgrade scaling

Priority: P1  
Status: Todo

- Upgrade cost formula.
- Buy 1/10/100/Max.
- Preview next effects.

## M2-005 — Undo/redo v0

Priority: P1  
Status: Todo

- Command history.
- Move node undo.
- Connect/disconnect undo.
- Place/delete node undo.

---

# M3 — Side Operations Backlog

## M3-001 — Crypto mining v0

Priority: P0  
Status: Todo

- GPU Cluster.
- Miner Node.
- Wallet.
- Crypto Seller.
- ByteCoin and HashLite.
- Price random walk.
- Mining heat/power cost.

## M3-002 — Auto-seller v0

Priority: P1  
Status: Todo

- Sell if price above threshold.
- Sell if wallet full.
- Pause mining if heat high.

## M3-003 — Legal cyber ops v0

Priority: P0  
Status: Todo

- Hacker Node.
- Payload Builder.
- Training Target.
- Bug Bounty Target.
- Success chance.
- White Hat XP.
- Trust reward.

## M3-004 — Side income panel

Priority: P1  
Status: Todo

- Income breakdown.
- Risk breakdown.
- GPU allocation display.

---

# M4+ Backlog Placeholders

## M4-001 — AI trainer and model server

Status: Todo

## M4-002 — Cloud rental and SLA monitor

Status: Todo

## M4-003 — CDN cache service

Status: Todo

## M5-001 — Blueprint save/deploy

Status: Todo

## M5-002 — Staging room simulation

Status: Todo

## M6-001 — Chapter objective engine

Status: Todo

## M6-002 — Company profile system

Status: Todo

## M7-001 — Public demo balance pass

Status: Todo

---

# Codex prompt templates

## Start M1

```text
Read PROJECT_CONTEXT.md, AGENTS.md, docs/GAME_BIBLE.md, docs/TECHNICAL_ARCHITECTURE.md, docs/MILESTONES.md, docs/CODEX_BACKLOG.md, specs/node-catalog.v0.json and specs/save-game.v0.json.

Implement M1-001 through M1-003 first. Keep simulation code separate from UI. After changes, run build/tests and update docs/DECISION_LOG.md with architecture decisions.
```

## Continue current work

```text
Read PROJECT_CONTEXT.md and docs/CODEX_BACKLOG.md. Find the first Todo item in the active milestone. Implement only that item, add or update tests, then update docs/DECISION_LOG.md and mark the backlog item status if completed.
```

## Fix bugs

```text
Read PROJECT_CONTEXT.md, AGENTS.md, and the relevant source files. Reproduce the issue with a test if possible, fix it, run tests, and add a short note to docs/DECISION_LOG.md if the fix changes architecture or behavior.
```
