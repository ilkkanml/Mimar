# AGENTS.md — Codex / AI Developer Instructions

Bu repo Codex veya başka bir AI coding agent tarafından geliştirilecek şekilde hazırlanmıştır. Bu dosya agent'ın proje üzerinde çalışırken uyması gereken kuralları tanımlar.

## İlk okunacak dosyalar

Her yeni oturumda sırayla oku:

1. `PROJECT_CONTEXT.md`
2. `docs/GAME_BIBLE.md`
3. `docs/TECHNICAL_ARCHITECTURE.md`
4. `docs/MILESTONES.md`
5. `docs/CODEX_BACKLOG.md`
6. İlgili sistem dosyaları:
   - `docs/SYSTEMS_AND_ECONOMY.md`
   - `docs/CRYPTO_CYBER_SIDE_OPS.md`
   - `docs/UX_UI_SPEC.md`
   - `docs/RISK_AND_ETHICS.md`

Bu dosyaları okumadan kod yazma.

## Proje amacı

Mimar, node tabanlı bir veri merkezi / cloud / AI otomasyon oyunudur. Oyuncu node'lar kurar, veri akışları bağlar, kaynakları yönetir, kontratlar tamamlar ve yan operasyonlarla farklı gelir stratejileri kurar.

Core fantasy:

> Oyuncu bir sistem mimarıdır. Kendi dijital altyapısını tasarlar, optimize eder ve büyütür.

## Çalışma dili

- Kod, değişkenler, dosya adları ve teknik yorumlar: İngilizce.
- Tasarım dokümanları: Türkçe olabilir.
- Oyuncuya görünen metinler ileride localization-ready olacak şekilde key tabanlı düşünülmelidir.

## Önerilen teknoloji

İlk prototip için:

- TypeScript
- Vite
- React önerilir ama zorunlu değildir.
- Zustand / Redux Toolkit gibi hafif state çözümü kullanılabilir.
- Canvas/SVG/HTML hybrid node editor.
- LocalStorage veya IndexedDB save sistemi.
- Vitest ile unit test.

Kesin karar verildiğinde `docs/DECISION_LOG.md` güncellenmelidir.

## Mimari prensipler

1. **Data-driven design**
   - Node tanımları JSON veya TypeScript config olarak tutulmalı.
   - Ekonomi değerleri kod içine dağılmamalı.
   - `specs/node-catalog.v0.json` başlangıç referansı olarak kullanılmalı.

2. **Simulation ile UI ayrımı**
   - Game simulation UI'dan bağımsız çalışmalı.
   - Tick/update mantığı React component içinde gömülü olmamalı.
   - Test edilebilir pure functions tercih edilmeli.

3. **Save compatibility**
   - Save dosyasında `schemaVersion` zorunlu.
   - Migration sistemi baştan düşünülmeli.
   - Yeni field eklenirken eski save bozulmamalı.

4. **Undo/redo hazırlığı**
   - Node placement, move, connect, disconnect, delete aksiyonları command pattern veya action history ile tutulmalı.
   - İlk prototipte tam implementation olmayabilir ama state modeli buna engel olmamalı.

5. **Performance**
   - Simulation tick sabit zaman adımıyla çalışmalı.
   - UI render rate simulation rate'ten ayrılmalı.
   - Çok node olduğunda sadece değişen node'lar render edilmeli.

6. **No real hacking instruction**
   - Cyber ops tamamen soyut oyun metrikleriyle uygulanır.
   - Gerçek exploit, komut, saldırı akışı, zafiyet tarama veya kötüye kullanım bilgisi eklenmez.

## Kod stili

- TypeScript strict mode açık olmalı.
- `any` kullanımından kaçın.
- Modüller küçük ve tek sorumluluklu olmalı.
- Magic number yerine config kullan.
- Domain tipleri açık tanımlanmalı:
  - `GameState`
  - `NodeInstance`
  - `NodeDefinition`
  - `EdgeInstance`
  - `ResourceLedger`
  - `ContractState`
  - `ResearchState`
  - `SideOperationState`

## Önerilen klasör yapısı

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.tsx
├── game/
│   ├── state/
│   │   ├── gameState.ts
│   │   ├── actions.ts
│   │   └── selectors.ts
│   ├── simulation/
│   │   ├── tick.ts
│   │   ├── flow.ts
│   │   ├── resources.ts
│   │   ├── bottlenecks.ts
│   │   └── upgrades.ts
│   ├── data/
│   │   ├── nodes.ts
│   │   ├── contracts.ts
│   │   ├── research.ts
│   │   └── economy.ts
│   └── save/
│       ├── saveGame.ts
│       ├── loadGame.ts
│       └── migrations.ts
├── ui/
│   ├── canvas/
│   ├── panels/
│   ├── components/
│   └── theme/
└── tests/
```

## İlk uygulama hedefi

M1 için minimum:

- Node definition sistemi.
- Node instance sistemi.
- Edge/connection sistemi.
- Basic tick simulation.
- Canvas üzerinde node drag.
- Port bağlantısı.
- Money/Data/Compute hesaplaması.
- Local save/load.
- İlk 6 node.

M1'de crypto ve hacking implementasyonu yapılmaz; sadece mimaride ileride eklenebilir şekilde hazırlık yapılır.

## Test beklentisi

En az şu pure logic testleri yazılmalı:

- Node definition yükleniyor.
- Geçerli edge kuruluyor.
- Geçersiz edge reddediliyor.
- Tick sonrası kaynak artışı doğru.
- Upload Gateway para üretimi doğru.
- Save/load roundtrip veri kaybetmiyor.

## Dokümantasyon güncelleme kuralı

Her anlamlı kod değişiminden sonra:

- `docs/DECISION_LOG.md` güncellenmeli.
- Eğer milestone tamamlandıysa `docs/MILESTONES.md` içindeki status güncellenmeli.
- Eğer yeni görev çıktıysa `docs/CODEX_BACKLOG.md` içine eklenmeli.
- Eğer oyun tasarımında değişiklik varsa ilgili bible dosyası güncellenmeli.

## Commit mesajı stili

Örnek:

- `feat: add node graph state model`
- `feat: implement basic simulation tick`
- `fix: prevent invalid output-to-output connections`
- `docs: update M1 acceptance criteria`
- `test: add save/load roundtrip coverage`

## Done tanımı

Bir iş ancak şu şartlarda bitmiş sayılır:

- Kod çalışıyor.
- TypeScript hatası yok.
- İlgili testler geçiyor.
- UI üzerinden temel kullanım doğrulandı.
- Save/load bozulmadı.
- Gerekli dokümanlar güncellendi.

## Güvenlik ve etik sınır

Cyber ops sistemi sadece kurgusal ve soyut olacak. Oyuncuya gerçek hayatta uygulanabilir saldırı talimatı, araç adı, exploit zinciri, bypass tekniği, credential abuse veya zararlı kod mantığı verilmeyecek.

Oyunda kullanılacak dil:

- `Payload Power`
- `Firewall Rating`
- `Trace Risk`
- `Stealth Score`
- `Security Audit`
- `Bug Bounty Target`

Kaçınılacak dil:

- gerçek exploit isimleri
- gerçek komutlar
- gerçek zafiyet tarama tarifleri
- kötü amaçlı kullanım adımları

## Agent notu

Bu proje için en önemli kalite metriği grafik değil; sistem hissidir. Oyuncu şunu hissetmeli:

> Ben rastgele node koymuyorum; çalışan bir altyapı tasarlıyorum.
