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

Milestone: M2
Priority: P0  
Status: Done

### Tasks

- Core resource state içinde power capacity/usage hesapla.
- Core resource state içinde heat generation ve heat pressure/level hesapla.
- Mevcut node definition `powerUse` ve `heatOutput` değerlerini simulation'da kullan.
- Power yetersizse deterministic throughput throttling ve `power_limited` reason üret.
- Heat pressure safe capacity üstüne çıkarsa deterministic throughput throttling ve `heat_throttled` reason üret.
- Resource Bar içinde Power ve Heat göstergelerini mevcut visual direction ile göster.
- Inspector içinde seçili node'un power/heat katkısını göster.
- Power/heat hesapları ve warning reason'ları için test ekle.

### Acceptance

- `resources.capacities.power` ve `resources.usage.power` her tick güncellenir.
- `resources.capacities.heat`, `resources.usage.heat`, `resources.rates.heat` ve `resources.balances.heat` her tick güncellenir.
- Power demand kapasiteyi aşarsa node runtime status/reason `power_limited` olur.
- Heat generation safe capacity üstüne çıkarsa node runtime status/reason `heat_throttled` olur.
- Resource Bar Power ve Heat değerlerini gösterir.
- Inspector seçili node için Power / Heat katkısını gösterir.
- `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build` ve browser smoke geçer.

### Completion notes

- M2-001 deterministic facility baseline ile tamamlandı: base power capacity `20`, base heat safe capacity `10`.
- M1 node definition'larındaki mevcut `powerUse` ve `heatOutput` değerleri artık simulation tarafından aktif olarak kullanılıyor.
- Future Power Supply / Cooling Fan node'ları için `powerCapacity` ve `coolingCapacity` optional stat alanları eklendi, ancak yeni node veya market/palette sistemi eklenmedi.
- Save schema version değiştirilmedi; power/heat mevcut resource map yapıları içinde tutuluyor ve runtime fields load sonrası yeniden hesaplanmaya devam ediyor.

## M2-002 — Contract system v0

Milestone: M2
Priority: P0  
Status: Done

### Tasks

- Add simple v0 contract definitions with title, description, requirement type, required amount, reward money/research, progress, and lifecycle status.
- Extend `GameState.contracts` with available, active, completed, and claimed contract lists.
- Seed a small M2 contract set for starter raw-data intake, clean-data delivery, and upload revenue.
- Evaluate active contract progress from existing resource output rates during simulation ticks.
- Add deterministic reward claiming for completed contracts and prevent duplicate claims.
- Persist contract lifecycle state through save/load v0.
- Add a minimal contract panel/card in the existing right rail.
- Add tests for progress, completion, reward claim, duplicate claim prevention, save/load persistence, and panel view-model output.

### Acceptance

- Active contracts advance from simulation rates without React coupling.
- Completed contracts move to completed status when progress reaches the required amount.
- Claiming pays the configured money/research reward once and moves the contract to claimed status.
- Save/load preserves active/completed/claimed contract state while runtime resource rates still recompute after load.
- UI shows contract title, progress, status, reward, and a claim action only when completed.
- No full Contract Deck, marketplace, deadline, negotiation, reputation, campaign, or monetization system is added.

### Completion notes

- M2-002 completed with three deterministic v0 contract definitions: starter intake, clean data delivery, and upload revenue trial.
- `schemaVersion: 0` is retained; contract lifecycle arrays are normalized on save/load and older placeholder contract blobs fall back to the seeded v0 state.
- The minimal contract UI is a right-rail panel under Inspector using the existing visual direction and component language.
- Deadline/penalty behavior from the older broad backlog stub is intentionally deferred because the M2-002 prompt explicitly excluded complex deadlines and marketplace-style systems.

## M2-003 — Research tree v0

Milestone: M2
Priority: P0  
Status: Done

### Tasks

- Add simple v0 research definitions with id, title, description, cost, prerequisites, status, and deterministic effect metadata.
- Extend `GameState.research` with available ids, unlocked ids, and spent research points.
- Add unlock logic that checks availability, prerequisites, affordability, point deduction, and duplicate unlock prevention.
- Apply research effects only to existing M1/M2 calculations: node compute use, heat output, upload output, effective power capacity, and effective heat capacity.
- Persist unlocked research state through save/load v0 while recomputing derived effects after load.
- Add a minimal right-rail Research panel using the existing visual direction.
- Add tests for availability, prerequisites, insufficient research points, unlock success, duplicate prevention, point deduction, effect application, panel output, and save/load persistence.

### Acceptance

- Research definitions are data-driven and independent from React components.
- Locked research remains blocked until prerequisites are unlocked.
- Unlocking available research deducts research points once and refreshes availability.
- Unlocked effects are applied deterministically during simulation ticks.
- Save/load preserves unlocked research ids and spent research points.
- UI shows research title, cost, status, prerequisite reason, effect, and unlock action when available and affordable.
- No full Research Deck, complex branching, timed queues, workers, offline progress, future systems, or new visual direction is added.

### Completion notes

- M2-003 completed with five deterministic v0 research definitions: Parser Optimization, Cooling Discipline, Cleaner Efficiency, Power Routing, and Upload Compression.
- `schemaVersion: 0` is retained; the save schema now records `availableResearchIds`, `unlockedResearchIds`, and `spentResearchPoints`.
- Runtime research effects are recomputed from unlocked ids during simulation and are not stored as separate derived modifiers.
- The starter intake contract now grants a small research reward so the M2 prototype can manually unlock the first research card.

## M2-004 — Buy Max and upgrade scaling

Priority: P1  
Status: Done

### Tasks

- Add deterministic node upgrade cost formula.
- Add level-based upgrade scaling for existing throughput, compute, power, heat, and upload/research output surfaces.
- Add Upgrade and Buy Max actions for the selected node.
- Keep Buy Max bounded and deterministic so it stops when money is insufficient.
- Add minimal Inspector controls for selected node level, next cost, effect preview, Upgrade, and Buy Max.
- Persist node levels through save/load v0 and recompute derived effects after load.

### Acceptance

- Single upgrade deducts the correct money and increments the selected node level once.
- Insufficient money leaves state unchanged and reports a safe reason.
- Buy Max buys the highest affordable level without overspending or looping forever.
- Simulation uses upgraded node values for throughput, money/research output, compute capacity/usage, power usage, heat generation, and bottleneck calculations.
- Save/load preserves node levels while runtime fields still reset and recompute.
- Inspector shows level, next cost, effect preview, Upgrade, and Buy Max using the existing visual direction.
- No Side Operations, crypto/cyber, Blueprint Library, Staging Room, Market, Campaign, monetization, full rebalance, prestige/reset, new visual direction, or new node placement palette is added.

### Completion notes

- M2-004 completed with `upgradeCost(level) = ceil(max(1, baseCost) * costGrowth ^ level)` so zero-cost starter nodes still have finite upgrade costs.
- Upgrade scaling is applied after research modifiers during simulation and is recomputed from persisted node levels after load.
- Buy Max uses a bounded deterministic calculation and returns the final level, total cost, and purchased count.
- Inspector now exposes only two M2-004 actions: Upgrade and Buy Max.

## M2-005 — Undo/redo v0

Priority: P1  
Status: Done

### Tasks

- Add a deterministic undo/redo history model with `past`, `future`, `current`, and bounded `maxDepth`.
- Track important player actions without tracking simulation ticks every frame.
- Cover node move, edge creation, edge deletion through the existing action, single upgrade, Buy Max upgrade, research unlock, contract claim, and New System reset.
- Add `canUndo`, `canRedo`, `undo`, `redo`, `pushHistory`, and current-state replacement helpers.
- Keep undo/redo stacks out of save payloads for v0.
- Add minimal Undo and Redo buttons to the existing bottom command strip.

### Acceptance

- Undo restores the previous game state for tracked actions.
- Redo restores the undone state.
- A new user action after undo clears the redo future.
- Max history depth is enforced deterministically.
- Simulation ticks update the current state without adding history entries.
- History stack snapshots do not store runtime-only tick rates/status fields.
- Save/load behavior remains stable and does not persist undo/redo stacks.
- No full timeline UI, branching history, cloud sync, multiplayer/collaboration, or new visual direction is added.

### Completion notes

- M2-005 completed with `src/game/state/history.ts`, a bounded snapshot history wrapper that stores runtime-normalized past/future states while allowing the live current state to continue ticking.
- App-level simulation ticks now replace `history.current` without pushing history entries.
- Graph drag commits one history entry on pointer release; edge creation, node upgrade, Buy Max, research unlock, contract claim, and New System reset push one entry only on successful state changes.
- Bottom command strip now exposes minimal Undo and Redo buttons with disabled states.
- Save schema version remains `0`; undo/redo history is intentionally not part of persisted save data.

## M2-006 — Node tooltip metrics v0

Priority: P1
Status: Done

- Add compact node/port tooltip metric readouts using existing runtime and panel model data.
- Keep tooltips within the existing visual direction and theme tokens.
- Include enough metrics to explain throughput, port resource type, and current bottleneck reason without opening a new panel.
- Do not add a new visual direction, expanded deck, market, blueprint, staging, side operation, or campaign system.

### Completion notes

- M2-006 completed with a deterministic `buildNodeTooltipModel` derived from existing game state, effective node definitions, runtime rates, bottleneck reasons, research modifiers, and upgrade scaling.
- Canvas nodes now show a compact read-only tooltip on hover or keyboard focus without changing Inspector, NodeView layout, save data, or gameplay rules.
- Tooltip readouts include node name, level, status, throughput, flow rates, compute where relevant, power/heat contribution, bottleneck reason, and upgrade cost/effect preview.
- Save schema version remains `0`; tooltip hover/focus state and tooltip models are runtime-only UI data.

## M2-007 - Better bottleneck messages v0

Priority: P1
Status: Done

- Refine existing bottleneck reason text into clearer quick fixes across Resource Bar, Inspector, and tooltips.
- Keep messages derived from current runtime reasons; do not add analytics dashboards, timeline UI, or new simulation systems.
- Preserve the existing visual direction and avoid new panels unless a tiny text treatment is already supported by current components.

### Completion notes

- M2-007 completed with a deterministic bottleneck summary model that adds severity, short label, clear reason text, affected node id, metric summary, and recommended action.
- Resource Bar, Inspector, and node tooltip now consume the shared bottleneck model instead of hardcoding bottleneck prose in React components.
- Covered compute-limited, power-limited, heat-pressure, missing-input, affected-node, severity, recommendation, UI model output, and no-bottleneck behavior in panel model tests.
- Save schema version remains `0`; bottleneck messages are derived runtime/UI state and are not persisted.

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
