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
Status: Todo

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

---

## M1-002 — Add core domain types

Milestone: M1  
Priority: P0  
Status: Todo

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

---

## M1-003 — Add first node definitions

Milestone: M1  
Priority: P0  
Status: Todo

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

---

## M1-004 — Implement graph state actions

Milestone: M1  
Priority: P0  
Status: Todo

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

---

## M1-005 — Implement connection validation

Milestone: M1  
Priority: P0  
Status: Todo

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

---

## M1-006 — Implement basic simulation tick

Milestone: M1  
Priority: P0  
Status: Todo

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

---

## M1-007 — Build basic graph canvas UI

Milestone: M1  
Priority: P0  
Status: Todo

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

---

## M1-008 — Build resource bar and inspector

Milestone: M1  
Priority: P1  
Status: Todo

### Tasks

- ResourceBar.
- NodePalette.
- InspectorPanel.
- BottleneckPanel.

### Acceptance

- Money/Data/Compute/Research görünür.
- Seçili node detayları görünür.
- Upgrade butonu placeholder veya basic çalışır.
- Bottleneck reason text görünür.

---

## M1-009 — Implement save/load v0

Milestone: M1  
Priority: P0  
Status: Todo

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

---

## M1-010 — Add M1 smoke tests and decision log

Milestone: M1  
Priority: P1  
Status: Todo

### Tasks

- Node validation tests.
- Connection validation tests.
- Tick integration test.
- Save/load test.
- `docs/DECISION_LOG.md` güncelle.

### Acceptance

- En az 5 test geçer.
- Build/test komutları README'ye eklenir.
- Kararlar decision log'a yazılır.

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
