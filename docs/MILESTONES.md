# Mimar — Milestones ve Yol Haritası

Bu doküman Mimar projesinin geliştirme aşamalarını, her aşamanın kapsamını ve kabul kriterlerini tanımlar.

Status değerleri:

- `Not Started`
- `In Progress`
- `Blocked`
- `Done`

## Milestone özeti

| Milestone | Ad | Status | Amaç |
|---|---|---|---|
| M0 | Project Foundation | Done | Tasarım, mimari ve Codex bağlamını kurmak |
| M1 | Vertical Prototype | Not Started | İlk çalışan node graph + simulation prototipi |
| M2 | Core Systems Slice | Not Started | Power/heat, contracts, research, UX quality |
| M3 | Side Operations Slice | Not Started | Crypto mining + legal cyber ops |
| M4 | AI & Cloud Economy | Not Started | AI trainer, AI API, cloud rental, CDN |
| M5 | Automation & Blueprint | Not Started | Blueprint, staging room, auto-upgrade/rules |
| M6 | Campaign & Progression | Not Started | Chapter görevleri, events, profile sistemi |
| M7 | Polish, Balance, Packaging | Not Started | Test, denge, performans, build hazırlığı |

---

# M0 — Project Foundation

## Amaç

Repo içinde oyunun kalıcı proje hafızasını oluşturmak. Codex yeni sohbette/proje oturumunda nerede kaldığını anlayabilmeli.

## Kapsam

- README.
- Project context.
- Codex/agent talimatları.
- Game bible.
- World/story/scenario bible.
- Systems/economy bible.
- Crypto/cyber side operations bible.
- Technical architecture.
- UX/UI spec.
- Risk/ethics doc.
- Node catalog spec.
- Save game spec.
- Codex backlog.
- Decision log.

## Kabul kriterleri

- [x] `PROJECT_CONTEXT.md` var.
- [x] `AGENTS.md` var.
- [x] `docs/GAME_BIBLE.md` var.
- [x] `docs/TECHNICAL_ARCHITECTURE.md` var.
- [x] `docs/MILESTONES.md` var.
- [x] `docs/CODEX_BACKLOG.md` var.
- [x] `specs/node-catalog.v0.json` var.
- [x] Yeni oturum başlangıcı için README komutu var.

---

# M1 — Vertical Prototype

## Amaç

Oyuncunun canvas üzerinde node yerleştirip bağladığı, veri akışının çalıştığı, para kazandığı ve oyunu kaydedip yüklediği ilk çalışan prototip.

Bu milestone görsel olarak final olmak zorunda değildir. Ama oyun çekirdeği gerçek çalışmalıdır.

## Kapsam

### Teknik temel

- Vite + TypeScript proje kurulumu.
- React veya seçilen UI framework kurulumu.
- TypeScript strict mode.
- Vitest test kurulumu.
- Basic ESLint/Prettier.

### Game state

- `GameState` tipi.
- `NodeDefinition` tipi.
- `NodeInstance` tipi.
- `EdgeInstance` tipi.
- `ResourceState` tipi.
- Initial state.

### Graph

- Node ekleme.
- Node sürükleme.
- Output porttan input porta bağlantı.
- Invalid connection validation.
- Edge silme.
- Basic selection.

### Simulation

- Fixed tick.
- Internet Feed -> Parser -> Cleaner -> Upload Gateway akışı.
- Compute üretimi ve tüketimi.
- Para üretimi.
- Research üretimi.
- Basic bottleneck reason.

### UI

- Resource bar.
- Node palette.
- Canvas.
- Node inspector.
- Basic bottleneck panel.
- Save/load butonları.

### Save/load

- LocalStorage save.
- Load.
- `schemaVersion`.
- Save/load roundtrip test.

## İlk 6 node

1. Internet Feed
2. Parser
3. Cleaner
4. Upload Gateway
5. CPU Rack
6. Research Lab

## Kabul kriterleri

- [ ] Kullanıcı yeni oyun açınca başlangıç canvas'ı görür.
- [ ] Kullanıcı node palette'ten node ekleyebilir.
- [ ] Node'lar sürüklenebilir.
- [ ] Geçerli portlar bağlanabilir.
- [ ] Geçersiz port bağlantısı reddedilir ve sebep gösterilir.
- [ ] `Internet Feed -> Parser -> Cleaner -> Upload Gateway` hattı para üretir.
- [ ] CPU Rack yoksa veya compute yetmezse bottleneck gösterilir.
- [ ] Research Lab clean data tüketip research üretir.
- [ ] Save/load sonrası node ve bağlantılar korunur.
- [ ] En az 5 unit/integration test geçer.
- [ ] `docs/DECISION_LOG.md` güncellenir.

## Kapsam dışı

- Crypto mining.
- Cyber ops.
- Full contract sistemi.
- Power/heat aktif dengeleme.
- Blueprint.
- Staging room.
- Full mobile UI.

---

# M2 — Core Systems Slice

## Amaç

Ana oyunu daha derin ve oynanabilir hale getirmek: power, heat, contracts, research, upgrade ve daha iyi UX.

## Kapsam

### Ek kaynaklar

- Power.
- Heat.
- Storage.
- Bandwidth, basit gösterim.
- Reputation.

### Node sayısı

Toplam 12-15 node:

- Router
- Splitter
- Compressor
- Storage Array
- Cooling Fan
- Power Supply
- Contract Portal
- Basic Validator
- Performance Analyzer

### Contracts

- Contract definition sistemi.
- Active contract state.
- İlk 5 kontrat.
- Deadline.
- Reward.
- Failure/partial completion.

### Research

- İlk research tree.
- Unlock sistemi.
- Throughput, Value, Automation, Energy branch başlangıçları.

### UX

- Buy 1/10/100/Max.
- Undo/redo başlangıcı.
- Multi-select başlangıcı.
- Better tooltip.
- Better bottleneck messages.

## Kabul kriterleri

- [ ] Power kapasitesi aşılırsa node'lar throttled olur.
- [ ] Heat yükselirse throughput düşer.
- [ ] Cooling heat'i düşürür.
- [ ] Contract kabul edilip tamamlanabilir.
- [ ] Contract şartları karşılanmazsa oyuncu nedenini görür.
- [ ] Research ile en az 3 node veya upgrade açılır.
- [ ] Buy Max doğru maliyet ve seviye hesaplar.
- [ ] Undo/redo en az node move ve connect için çalışır.

---

# M3 — Side Operations Slice

## Amaç

Oyunu Upload benzeri ana akıştan ayıran yan gelir katmanlarını eklemek: kripto madenciliği ve legal siber güvenlik işleri.

## Kapsam

### Crypto

- GPU Cluster.
- Miner Node.
- Wallet.
- Crypto Seller.
- Auto Seller.
- 2 coin: ByteCoin, HashLite.
- Market price random walk.
- Mining power/heat maliyeti.

### Legal Cyber Ops

- Hacker Node.
- Intel Scanner.
- Payload Builder.
- Training Target.
- Bug Bounty Target.
- Success chance.
- White Hat XP.
- Trust/reputation reward.

### Side Income UI

- Income breakdown panel.
- GPU allocation başlangıcı.
- Trace risk göstergesi.
- Market trend göstergesi.

## Kabul kriterleri

- [ ] GPU Cluster mining veya AI/cloud için paylaşılabilir temel havuz olarak çalışır.
- [ ] Miner Node coin üretir.
- [ ] Wallet coin depolar.
- [ ] Crypto Seller coin'i paraya çevirir.
- [ ] Coin price zamanla değişir.
- [ ] Mining heat/power maliyeti üretir.
- [ ] Bug bounty görevi başarı şansı ile tamamlanır.
- [ ] Legal cyber ops gerçek hacking talimatı içermez.
- [ ] Side income breakdown doğru oranları gösterir.

## Kapsam dışı

- Riskli shadow ops full sistemi.
- Complex crypto trading.
- Full AI API.

---

# M4 — AI & Cloud Economy

## Amaç

Oyuna uzun vadeli recurring gelir ve GPU allocation stratejisi eklemek.

## Kapsam

- AI Trainer.
- Dataset Labeler.
- Model Server.
- AI API Gateway.
- Cloud Rental Node.
- SLA Monitor.
- CDN Cache.
- Compute/GPU allocation paneli.
- Subscriber income.
- Latency / uptime metrikleri.

## Kabul kriterleri

- [ ] Clean/labeled data AI Trainer'a gider.
- [ ] Model quality yükselir.
- [ ] Model Server recurring gelir üretir.
- [ ] AI API GPU ve bandwidth tüketir.
- [ ] Cloud Rental compute rezerve eder.
- [ ] Compute rental ana pipeline'ı yavaşlatabilir.
- [ ] SLA başarısızlığı penalty üretir.

---

# M5 — Automation & Blueprint

## Amaç

Geç oyun tıklama yorgunluğunu azaltmak ve oyuncuya sistem mühendisliği hissi vermek.

## Kapsam

- Blueprint save/deploy.
- Blueprint preview.
- Copy/paste with connections.
- Auto Upgrader.
- Rule Engine.
- Staging Room.
- Performance comparison.
- Alert rules.

## Kabul kriterleri

- [ ] Seçili node grubu blueprint olarak kaydedilir.
- [ ] Blueprint bağlantılarıyla deploy edilir.
- [ ] Eksik unlock/resource uyarısı gösterilir.
- [ ] Auto-upgrade en az basit kural ile çalışır.
- [ ] Staging Room mevcut sistem kopyasını test eder.
- [ ] Current vs staging metrikleri karşılaştırılır.

---

# M6 — Campaign & Progression

## Amaç

Oyunu chapter, görev, event ve şirket profiliyle anlamlı campaign akışına oturtmak.

## Kapsam

- Chapter objective sistemi.
- Event cards.
- Company profile.
- White Hat / Black Hat / Green / AI First / Enterprise profilleri.
- Story text.
- Unlock pacing.
- Prestige başlangıcı.

## Kabul kriterleri

- [ ] En az 6 chapter görev zinciri çalışır.
- [ ] Event kartları oyun state'ini etkiler.
- [ ] Company profile oyuncu kararlarına göre değişir.
- [ ] Profile değerleri contract unlock'larını etkiler.
- [ ] İlk prestige loop prototipi çalışır.

---

# M7 — Polish, Balance, Packaging

## Amaç

Oyunu public demo / playtest seviyesine getirmek.

## Kapsam

- Balance pass.
- Tutorial polish.
- Accessibility pass.
- Performance optimization.
- Save migration tests.
- Error handling.
- Build pipeline.
- Public demo packaging.

## Kabul kriterleri

- [ ] Yeni oyuncu tutorial ile ilk pipeline'ı kurabilir.
- [ ] 60 dakikalık oynanabilir akış vardır.
- [ ] Save/load güvenilir çalışır.
- [ ] 300 node'a kadar kabul edilebilir performans vardır.
- [ ] Major soft-lock yoktur.
- [ ] Playtest feedback listesi oluşturulur.

---

# Milestone yönetim notu

Her milestone tamamlandığında:

1. Bu dosyada status güncellenir.
2. `docs/DECISION_LOG.md` güncellenir.
3. `docs/CODEX_BACKLOG.md` kalan görevlerle güncellenir.
4. GitHub milestone/issue durumları kapatılır.
