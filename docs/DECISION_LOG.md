# Mimar — Decision Log

Bu dosya projedeki önemli ürün, teknik ve kapsam kararlarını kalıcı olarak tutar. Yeni oturumlarda Codex/AI önce bu dosyayı okuyarak önceki kararları tekrar tartışmadan devam etmelidir.

Format:

```text
## YYYY-MM-DD — Karar başlığı

Status: Proposed / Accepted / Replaced / Deprecated

Decision:

Context:

Consequences:
```

---

## 2026-06-11 — Proje adı Mimar olarak başlatıldı

Status: Accepted

Decision:

Repo ve çalışma adı **Mimar** olarak kullanılacak.

Context:

Kullanıcı GitHub reposunu `ilkkanml/Mimar` olarak verdi. Oyun veri merkezi, cloud, AI ve node mimarisi etrafında döndüğü için “Mimar” adı oyun fantezisiyle uyumlu.

Consequences:

- README ve dokümanlarda proje adı Mimar.
- İleride pazarlama için alternatif isimler test edilebilir ama kod/proje bağlamı Mimar kalır.

---

## 2026-06-11 — İlk prototip web tabanlı TypeScript olacak

Status: Accepted

Decision:

M1 vertical prototype TypeScript + Vite tabanlı web projesi olarak geliştirilecek. React önerilir ama implementation sırasında net karar verilecek.

Context:

Codex ile hızlı iterasyon, test yazma ve node graph prototipi için TypeScript uygun. Web prototip sonradan Steam/Electron/Tauri veya mobile webview yönüne taşınabilir.

Consequences:

- `docs/TECHNICAL_ARCHITECTURE.md` TypeScript/Vite mimarisi önerir.
- İlk hedef native/mobile değil, oynanabilir web prototype.
- Performans sorunları çıkarsa late-game renderer yeniden değerlendirilecek.

---

## 2026-06-11 — Simulation ve UI kesin ayrılacak

Status: Accepted

Decision:

Game simulation UI component'lerinden bağımsız pure TypeScript domain layer olarak yazılacak.

Context:

Oyun uzun vadede çok node, save/load, test, blueprint, staging room ve offline simulation gerektirecek. UI içine gömülü simulation ileride teknik borç yaratır.

Consequences:

- Tick, flow, resource, bottleneck ve contract logic `src/game/simulation` altında olacak.
- React component'leri sadece state'i gösterecek ve actions çağıracak.
- Unit/integration test yazmak kolaylaşacak.

---

## 2026-06-11 — İlk flow modeli continuous resource flow olacak

Status: Accepted

Decision:

MVP'de tek tek dosya/item simülasyonu yerine sayısal resource flow kullanılacak.

Context:

Node automation oyununda ilk eğlence için bağlantı, throughput, bottleneck ve kaynak dengesi daha önemli. Packet-level simülasyon erken aşamada gereksiz karmaşıklık yaratır.

Consequences:

- `rawData`, `parsedData`, `cleanData` gibi kaynaklar sayı olarak akar.
- İleride batch/item sistemi eklenebilir ama M1/M2 continuous flow kullanır.

---

## 2026-06-11 — Cyber ops gerçek hacking öğretmeyecek

Status: Accepted

Decision:

Cyber sistemleri tamamen kurgusal ve soyut oyun metrikleriyle çalışacak: Payload Power, Target Defense, Trace Risk, Stealth Score.

Context:

Oyun cyber temasını risk/ödül ve kaynak yönetimi olarak kullanacak. Gerçek exploit, komut, saldırı adımı veya kötüye kullanılabilir teknik bilgi oyuna eklenmeyecek.

Consequences:

- `docs/RISK_AND_ETHICS.md` bağlayıcı güvenlik rehberidir.
- Cyber node metinleri gerçek teknik tarif içeremez.
- Legal bug bounty yolu önce gelecek; riskli shadow ops daha geç ve kurgusal kalacak.

---

## 2026-06-11 — Yan gelirler fırsat maliyeti üretecek

Status: Accepted

Decision:

Crypto, cloud rental, AI API ve cyber ops gibi yan gelirler ana sistemden kaynak tüketecek veya risk üretecek.

Context:

Yan gelirler bedava para olursa ana upload/contract oyunu ölür. Oyuncu GPU, compute, power, heat, bandwidth, reputation ve trust arasında karar vermeli.

Consequences:

- Crypto mining GPU + power + heat kullanır.
- Cyber ops trace + reputation risk üretir.
- AI API temiz data + GPU + latency ister.
- Cloud rental compute rezerve eder ve ana pipeline'ı yavaşlatabilir.

---

## 2026-06-11 — Save dosyası schemaVersion içerecek

Status: Accepted

Decision:

Her save dosyasında `schemaVersion` bulunacak ve migration sistemi için yer ayrılacak.

Context:

Idle/automation oyunları uzun save ömrüne ihtiyaç duyar. Erken schema disiplini ileride save bozulmalarını azaltır.

Consequences:

- `specs/save-game.v0.json` referans schema olarak oluşturuldu.
- Runtime-only UI state save'e yazılmayacak.
- Migration sistemi M1'de basit, M2+ aşamasında genişletilebilir.

---

## 2026-06-11 — M0 dokümantasyon foundation tamamlandı

Status: Accepted

Decision:

Repoya proje bağlamı, game bible, dünya/senaryo, sistem ekonomisi, crypto/cyber yan operasyonlar, teknik mimari, UX spec, milestone planı, Codex backlog, risk/etik dokümanı, JSON spec'leri ve decision log eklendi.

Context:

Kullanıcı projeyi Codex'e yaptıracağını ve yeni sohbetlerde bağlamın bozulmamasını istedi.

Consequences:

- Yeni oturumlarda ilk okunacak dosya `PROJECT_CONTEXT.md`.
- Codex için çalışma talimatları `AGENTS.md` içinde.
- İlk uygulama işi M1-001 ile başlar.

---

## 2026-06-11 — M1 implementation foundation başlatıldı

Status: Accepted

Decision:

M1 project setup için Vite + React + TypeScript kullanılacak. İlk kod pass'i sadece runnable app foundation, UI'dan bağımsız core domain types ve ilk 6 node definition ile sınırlı kalacak.

Context:

`CODEX_START_HERE.md`, `docs/CODEX_BACKLOG.md` ve `docs/M1_ATOMIC_TASKS.md` M1-001, M1-002 ve M1-003 sırasını ilk implementation slice olarak tanımlıyor. Kullanıcı UI işinin M1-007'den önce başlamamasını istedi.

Consequences:

- `src/app` sadece Vite React bootstrap için var; graph canvas veya visual UI implementasyonu yok.
- `src/game/state` domain type layer'ını tutar ve React'e bağlı değildir.
- `src/game/data/nodeDefinitions.ts` sadece M1'in ilk 6 node'unu export eder.
- Quality gate `npm run lint`, `npm test` ve `npm run build` komutlarıyla çalışır.

---

## 2026-06-11 — Graph state actions pure reducer-style fonksiyonlar olacak

Status: Accepted

Decision:

M1-004 graph actionları React store veya UI component içine gömülmeden pure TypeScript fonksiyonları olarak tutulacak. Action'lar mevcut `GameState` alıp yeni `GameState` döndürür; node/edge oluşturma action'ları oluşturulan instance'ı da sonuç olarak verir.

Context:

M1-004 sadece add/move/delete/select/connect/delete-edge davranışlarını istiyor. M1-005 bağlantı doğrulama işini ayrı bir backlog item olarak tanımladığı için port direction, resource compatibility ve validation reason sistemi bu adımda uygulanmadı.

Consequences:

- `src/game/state/actions.ts` UI'dan bağımsız ve unit-test edilebilir kaldı.
- Node silme ilişkili edge'leri ve selection referanslarını temizler.
- `connectNodes` düşük seviyeli edge oluşturma action'ı olarak kaldı; geçerli/geçersiz bağlantı kuralları M1-005'te eklenecek.

---

## 2026-06-11 — Connection validation graph modülünde tutulacak

Status: Accepted

Decision:

Bağlantı kuralları `src/game/graph/validation.ts` içinde UI'dan bağımsız pure function olarak tutulacak. Validasyon sonucu UI'ın gösterebileceği stable reason değerleri döndürür. State'e edge yazmak için validasyonlu `connectNodesIfValid` action'ı kullanılacak.

Context:

M1-005 output-to-input, resource compatibility, same-node rejection, missing node/port guard ve validation reason istiyor. M1-006 simulation tick başlamadan önce graph bağlantılarının güvenli edge state üretmesi gerekiyor.

Consequences:

- Geçersiz bağlantılar graph state'e yazılmaz.
- Edge resource type ve throughput limit valid portlardan türetilir.
- M1 için special wildcard port tipleri uygulanmadı; ilk 6 node concrete resource tipleriyle çalışıyor.
- UI geldiğinde validation reason doğrudan kullanıcı mesajına çevrilebilir.

---

## 2026-06-11 — M1 simulation continuous buffer flow kullanacak

Status: Accepted

Decision:

M1-006 simulation tick pure TypeScript domain fonksiyonu olarak `src/game/simulation/tick.ts` içinde tutulacak. İlk implementation continuous resource flow ve node input/output buffer'ları kullanır; money ve research global resource balance olarak birikir.

Context:

M1-006 ilk pipeline'ın para üretmesini, Research Lab'in research üretmesini, edge üzerinden resource movement olmasını ve compute kapasite etkisini istiyor. Teknik mimari simulation'ın UI'dan bağımsız ve deterministic olmasını şart koşuyor.

Consequences:

- `tickGameState` fixed tick varsayılanı olarak 10 tick/sec kullanır.
- Compute M1'de global capacity/usage olarak hesaplanır; CPU Rack kapasite sağlar.
- Parser/Cleaner/Research Lab compute yetersizliğinde `compute_limited`, input yokluğunda `input_starved` runtime reason üretir.
- Power/heat, contracts, save/load ve UI feedback bu adımda uygulanmadı; sıradaki milestone/backlog item'larına bırakıldı.

---

## 2026-06-11 — M1 graph canvas Blueprint Control Room hedefini izleyecek

Status: Accepted

Decision:

M1-007 graph canvas UI, approved Figma direction olan Blueprint Control Room base + restrained neon flow + polished command panel dilini takip edecek. İlk UI slice yalnızca canvas, node, port ve edge interaction bileşenlerini içerir.

Context:

UI çalışması M1-007'de başladı. `CODEX_START_HERE.md` required visual reading listesindeki dokümanlar ve Figma production review M1 için `02_EmptyMainCanvas`, `03_FirstNodePlaced`, `04_FirstConnectionPreview`, `05_FirstWorkingPipeline`, `06_FirstBottleneck`, `07_NodeInspectorDetail` frame'lerini referans gösteriyor.

Consequences:

- Theme token renkleri CSS değişkenleri olarak uygulandı.
- `src/ui/canvas` bileşenleri simulation logic içermez; graph state action/validation fonksiyonlarını çağırır.
- Node drag ve port drag bağlantı etkileşimi browser smoke test ile doğrulandı.
- Resource bar, node library, inspector, save/load ve bottom strip M1-008/M1-009 kapsamına bırakıldı.

---

## 2026-06-11 — M1 ResourceBar ve Inspector shared GameState'ten beslenecek

Status: Accepted

Decision:

M1-008 UI state'i `App` seviyesinde tek GameState kaynağı olarak tutulacak. `GraphCanvas`, `ResourceBar` ve `InspectorPanel` aynı state'i okuyacak; fixed simulation tick `tickGameState` ile domain layer'da çalışmaya devam edecek.

Context:

Resource bar para, research, compute kapasitesi/kullanımı ve bottleneck özetini göstermek zorunda. Inspector seçili node'un status, throughput, üretim/tüketim ve önerilen aksiyon bilgilerini simulation runtime çıktılarından okumalı. Bu bilgilerin React component içinde yeniden hesaplanması simulation/UI ayrımını zayıflatırdı.

Consequences:

- Panel view-model derivation `src/ui/panels/panelModels.ts` içinde pure ve test edilebilir kaldı.
- `GraphCanvas` controlled component oldu; drag ve port connection transient state'i canvas içinde kalmaya devam ediyor.
- Seçili warning node'larda amber warning border ile cyan selected outline birlikte kullanılıyor.
- Save/load, NodePalette, contracts, research deck ve future gameplay bu kararla eklenmedi.

---

## 2026-06-11 — M1 SaveGame v0 runtime alanlarını normalize edecek

Status: Accepted

Decision:

M1-009 save/load sistemi `src/game/save` altında schema, migration, serialize/parse ve LocalStorage adapter katmanlarına ayrılacak. Save payload'ı `schemaVersion: 0`, `savedAt`, `gameVersion` ve normalize edilmiş `gameState` içerecek.

Context:

Save/load sonrasında graph ve kaynakların korunması gerekiyor, fakat current drag operation veya tick runtime rate/status gibi transient alanlar save doğruluğu için gerekli değil. Teknik mimari yüklendikten sonra runtime alanlarının yeniden hesaplanmasını öneriyor.

Consequences:

- Node pozisyonları, edge'ler, selection, input/output buffer'ları ve resource balances korunur.
- Node status/runtime ve resources rate/capacity/usage alanları save/load sırasında sıfırlanır ve sonraki tick ile yeniden hesaplanır.
- Broken JSON, eksik save ve unsupported schema durumları kullanıcıyı çökertmeden load error sonucuna döner.
- Save/load UI'si M1 shell içindeki bottom command strip ile sınırlı kaldı; settings modal, cloud save ve export/import eklenmedi.

---

## 2026-06-11 — M1 freeze candidate smoke coverage accepted

Status: Accepted

Decision:

M1-010 closes the M1 implementation pass with a final domain smoke test, browser smoke checklist, and M1 completion report. No M2 gameplay systems are added in this pass.

Context:

M1 already had separate coverage for node definitions, graph actions, connection validation, simulation tick, panels, and save/load v0. The remaining risk was whether these systems worked together as the first vertical prototype loop.

Consequences:

- `src/tests/m1Smoke.test.ts` verifies the full M1 domain loop: first pipeline creation, valid/invalid connections, money/research production, compute capacity/usage, compute bottleneck, selection/Inspector view model, save serialization, load restore, and runtime recompute.
- `docs/M1_COMPLETION_REPORT.md` is the M1 freeze handoff artifact and records automated checks, browser smoke checklist, known limitations, and next recommendation.
- M1 is a freeze candidate after passing `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build`, and browser smoke.
- Known M1 limitation remains explicit: the current UI uses a seeded graph and does not yet include full Node Palette / place-new-node interaction.

---

## 2026-06-11 — M2 power and heat use deterministic facility baselines

Status: Accepted

Decision:

M2-001 power/heat sistemi, yeni node veya market yüzeyi eklemeden mevcut resource map yapısını genişleterek uygulanacak. Simulation her tick base facility power capacity `20`, base heat safe capacity `10`, enabled node `powerUse` toplamı, enabled node `heatOutput` toplamı ve heat pressure yüzdesi hesaplar.

Context:

Kullanıcı M1 baseline'ın frozen kaldığını ve yalnızca M2-001 Power and Heat System kapsamının açılmasını istedi. Mevcut M1 node definition'ları zaten basic `powerUse` ve `heatOutput` değerleri taşıyordu; bu slice'ın ana işi bu değerleri deterministic simulation ve UI readout içine bağlamak oldu.

Consequences:

- `schemaVersion: 0` korunur; power ve heat değerleri mevcut `resources.capacities`, `resources.usage`, `resources.rates` ve `resources.balances` map'leri içinde kalır.
- Power demand capacity üstüne çıkarsa global throughput factor uygulanır ve affected nodes `power_limited` reason üretir.
- Heat generation safe capacity üstüne çıkarsa global throughput factor uygulanır ve affected nodes `heat_throttled` reason üretir.
- Future Power Supply / Cooling Fan node'ları için optional `powerCapacity` ve `coolingCapacity` stats alanları hazırdır, ancak M2-001 bu node'ları veya Node Library genişletmesini uygulamaz.
- Resource Bar ve Inspector mevcut visual direction içinde Power / Heat readout gösterir.

---

## 2026-06-11 - M2 contracts use simple lifecycle arrays and rate-based progress

Status: Accepted

Decision:

M2-002 Contract System v0 uses data-driven contract definitions plus simple `available`, `active`, `completed`, and `claimed` runtime lists in `GameState.contracts`. Active contract progress is calculated from existing resource output rates during the deterministic simulation tick. Claiming a completed contract pays configured money/research rewards once and moves it to claimed status.

Context:

The user explicitly scoped M2-002 to a simple deterministic contract system and excluded the full Contract Deck, marketplace, complex deadlines, negotiation, reputation, campaign, monetization, and new visual direction. The older backlog stub mentioned deadline/reward/penalty and five contracts, but this pass narrows the implementation to the requested v0 model.

Consequences:

- `schemaVersion: 0` remains unchanged, but `contracts` now persists lifecycle arrays with `{ id, currentProgress, status }` runtime entries.
- Save/load normalization preserves v0 contract lifecycle state and falls back to the seeded v0 state for older placeholder contract shapes.
- The initial seed has one active starter intake contract plus available clean-data and upload-revenue contracts.
- The UI remains a minimal right-rail contract panel/card under the existing Inspector area; no future Contract Deck or marketplace surface is introduced.

---

## 2026-06-11 - M2 research uses simple unlock state and deterministic modifiers

Status: Accepted

Decision:

M2-003 Research Tree v0 uses data-driven research definitions plus simple `availableResearchIds`, `unlockedResearchIds`, and `spentResearchPoints` state. Unlocking research is a pure action that checks prerequisites, affordability, and duplicate unlocks, then deducts research points once. Research effects are recomputed from unlocked ids during simulation instead of being stored as runtime modifiers.

Context:

The user scoped M2-003 to a simple deterministic research model and explicitly excluded the full Research Deck visual experience, complex branching, timed research queues, workers, offline progress, future systems, and new visual direction. Existing M1/M2 systems already provide research points, compute, power, heat, throughput, and upload output, so the first research set only modifies those surfaces.

Consequences:

- `schemaVersion: 0` remains unchanged, but the v0 save schema now records `availableResearchIds`, `unlockedResearchIds`, and `spentResearchPoints`.
- The first seeded research definitions are Parser Optimization, Cooling Discipline, Cleaner Efficiency, Power Routing, and Upload Compression.
- Simulation applies unlocked effects to effective node definitions or facility-level power/heat capacity before each tick.
- The UI is limited to a compact right-rail Research panel/cards under the existing visual language; no full deck, queue, tree canvas, marketplace, or future progression surface is introduced.

---

## 2026-06-12 - M2 upgrades use persisted levels and derived scaling

Status: Accepted

Decision:

M2-004 node upgrades use the existing persisted `NodeInstance.level` plus deterministic cost and scaling helpers. Upgrade cost is `ceil(max(1, baseCost) * costGrowth ^ level)`, which keeps zero-cost starter nodes finite for Buy Max. Upgrade effects are derived from `NodeDefinition.upgradeScaling`, applied after research modifiers, and recomputed during simulation and Inspector view-model building.

Context:

The user scoped M2-004 to Buy Max and upgrade scaling only. The slice needed Upgrade and Buy Max actions, simulation integration, Inspector controls, save/load persistence, and tests without adding Side Operations, crypto/cyber systems, market surfaces, blueprint/staging systems, campaign, monetization, full rebalance, prestige/reset, a new visual direction, or a node placement palette.

Consequences:

- `schemaVersion: 0` remains unchanged; node `level` was already part of the v0 node instance schema and now explicitly represents persisted upgrade level.
- Buy Max is bounded and deterministic, stops when money is insufficient, and returns purchased count, final level, and total cost.
- Simulation now uses level-scaled effective definitions for throughput, compute capacity/usage, power usage, heat generation, money/research output, and bottleneck calculations.
- Inspector shows the selected node level, next cost, effect preview, Upgrade, and Buy Max using the existing panel/button style.
- M2-005 Undo/redo remains the next backlog item and was not started.

---

## 2026-06-12 - M2 undo/redo uses bounded non-persisted snapshots

Status: Accepted

Decision:

M2-005 undo/redo uses an app-level history wrapper with `past`, `current`, `future`, and bounded `maxDepth` instead of adding history stacks to persisted `GameState`. User actions push save-normalized snapshots into past/future, while the live current state continues to receive simulation ticks through replacement, not history pushes.

Context:

The user scoped M2-005 to simple deterministic undo/redo for important player actions only: node movement, edge creation/deletion where supported, node upgrades, Buy Max, research unlocks, contract claims, and safe New System reset handling. The same prompt explicitly excluded full timeline UI, branching history, cloud sync, multiplayer/collaboration, and saving huge undo stacks.

Consequences:

- `schemaVersion: 0` remains unchanged; undo/redo history is intentionally not persisted in save v0.
- Simulation ticks do not spam history entries and runtime-only rates/status fields are stripped from stack snapshots.
- New user actions after undo clear redo future deterministically.
- The bottom command strip exposes minimal Undo and Redo controls with disabled states.
- Full history timeline UI, branching histories, cloud sync, collaboration, and future systems remain out of scope.
