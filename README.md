# Mimar

**Mimar**, node tabanlı bir veri merkezi / cloud / yapay zekâ otomasyon oyunudur. Oyuncu küçük bir ev sunucusuyla başlar; veri işler, upload gelirleri kazanır, kripto madenciliği yapar, legal siber güvenlik kontratları alır, riskli gölge operasyonlara girer, AI modelleri eğitir ve sonunda global bir dijital altyapı imparatorluğu kurar.

Bu repo şu an **Codex ile geliştirilecek proje hafızası** olarak hazırlanmıştır. Yeni bir sohbete veya yeni bir geliştirme oturumuna geçildiğinde önce şu dosyalar okunmalıdır:

1. [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) — projenin tek sayfalık hafızası, mevcut durum ve çalışma kuralları.
2. [`AGENTS.md`](AGENTS.md) — AI coding agent / Codex için çalışma talimatları.
3. [`docs/GAME_BIBLE.md`](docs/GAME_BIBLE.md) — oyunun ana tasarım bible'ı.
4. [`docs/TECHNICAL_ARCHITECTURE.md`](docs/TECHNICAL_ARCHITECTURE.md) — teknik mimari ve önerilen sistem yapısı.
5. [`docs/MILESTONES.md`](docs/MILESTONES.md) — milestone planı ve kabul kriterleri.
6. [`docs/CODEX_BACKLOG.md`](docs/CODEX_BACKLOG.md) — Codex'e verilecek iş paketleri.

## Elevator pitch

> Küçük bir server odasından başlayıp global cloud ve AI altyapısı kur. Veri akışlarını node'larla tasarla, darboğazları çöz, kontratlar tamamla, kripto ve yan operasyonlardan gelir üret, risk ve itibarı yönet, sonunda kendi kendini optimize eden dijital bir imparatorluk inşa et.

## Tasarım ilkeleri

- **Node bağlamak zevkli olmalı:** yanlış tıklama, kaybolan bağlantı ve karmaşık UI oyuncuyu yormamalı.
- **Her yan gelir kaynak yemeli:** crypto, hacking, AI API ve cloud rental bedava para değil; GPU, CPU, enerji, soğutma, bandwidth, güvenlik ve itibar tüketir.
- **Oyuncu neyin tıkandığını anlamalı:** bottleneck analizi, heatmap, canlı metrikler ve uyarılar ilk sınıf sistemdir.
- **Tek meta build olmamalı:** upload, contract, AI, crypto, white-hat security, shadow ops ve green-energy yolları farklı stratejiler açar.
- **Monetization temiz kalmalı:** güç, hız veya kaynak satılmaz. Uygun model: demo + premium unlock + kozmetik.

## Önerilen ilk MVP

İlk oynanabilir sürüm 30-60 dakikalık bir vertical slice olmalı:

- Canvas üzerinde node yerleştirme, sürükleme, bağlama.
- 15 temel node.
- Money, Data, Compute, Power, Heat, Research kaynakları.
- Upload hattı.
- Basit contract sistemi.
- Basit crypto mining hattı.
- Legal bug bounty / training target hattı.
- Save/load.
- Buy Max, undo/redo, temel blueprint.
- Bottleneck paneli.

## Klasör yapısı

```text
.
├── README.md
├── AGENTS.md
├── PROJECT_CONTEXT.md
├── docs/
│   ├── GAME_BIBLE.md
│   ├── WORLD_STORY_SCENARIO.md
│   ├── SYSTEMS_AND_ECONOMY.md
│   ├── CRYPTO_CYBER_SIDE_OPS.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── UX_UI_SPEC.md
│   ├── MILESTONES.md
│   ├── CODEX_BACKLOG.md
│   ├── DECISION_LOG.md
│   └── RISK_AND_ETHICS.md
└── specs/
    ├── node-catalog.v0.json
    └── save-game.v0.json
```

## Başlama komutu

Codex'e ilk görev olarak şunu ver:

> Bu repodaki `PROJECT_CONTEXT.md`, `AGENTS.md`, `docs/GAME_BIBLE.md`, `docs/TECHNICAL_ARCHITECTURE.md` ve `docs/MILESTONES.md` dosyalarını oku. Sonra M1 milestone için web tabanlı TypeScript prototipinin temel klasör yapısını, canvas/node modelini, save/load iskeletini ve ilk 6 node'u uygula. İş bitince `docs/DECISION_LOG.md` dosyasına yaptığın mimari kararları ekle.

## Durum

Proje başlangıç aşamasında. Bu commit, ürün tasarımı ve geliştirme bağlamını kurar. Kod implementation henüz başlamadı.
