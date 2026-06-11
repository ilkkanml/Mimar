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
