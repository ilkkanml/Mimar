# Mimar

**Mimar**, node tabanlı bir veri merkezi / cloud / yapay zekâ otomasyon oyunudur. Oyuncu küçük bir ev sunucusuyla başlar; veri işler, upload gelirleri kazanır, kripto madenciliği yapar, legal siber güvenlik kontratları alır, riskli gölge operasyonlara girer, AI modelleri eğitir ve sonunda global bir dijital altyapı imparatorluğu kurar.

Bu repo **Codex ile geliştirilecek proje hafızası ve uygulama yönerge deposu** olarak hazırlanmıştır. Codex'in görevi yeni yol icat etmek değil, repodaki talimatları sırayla uygulamaktır.

## Codex için başlangıç

Codex'e ilk olarak sadece şunu ver:

```text
Read CODEX_START_HERE.md first and follow it exactly. Start with M1 only. Do not skip backlog order.
```

Ana giriş dosyası:

1. [`CODEX_START_HERE.md`](CODEX_START_HERE.md) — Codex runbook, okuma sırası, ilk prompt, aktif milestone ve görev sırası.
2. [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) — projenin kalıcı hafızası.
3. [`AGENTS.md`](AGENTS.md) — AI coding agent / Codex çalışma talimatları.
4. [`CONTRIBUTING.md`](CONTRIBUTING.md) — iş akışı, kalite kapısı ve done tanımı.
5. [`docs/CODEX_BACKLOG.md`](docs/CODEX_BACKLOG.md) — uygulanabilir görev listesi.
6. [`docs/MILESTONES.md`](docs/MILESTONES.md) — milestone planı ve kabul kriterleri.

## Elevator pitch

> Küçük bir server odasından başlayıp global cloud ve AI altyapısı kur. Veri akışlarını node'larla tasarla, darboğazları çöz, kontratlar tamamla, kripto ve yan operasyonlardan gelir üret, risk ve itibarı yönet, sonunda kendi kendini optimize eden dijital bir imparatorluk inşa et.

## Tasarım ilkeleri

- **Node bağlamak zevkli olmalı:** yanlış tıklama, kaybolan bağlantı ve karmaşık UI oyuncuyu yormamalı.
- **Her yan gelir kaynak yemeli:** crypto, hacking, AI API ve cloud rental bedava para değil; GPU, CPU, enerji, soğutma, bandwidth, güvenlik ve itibar tüketir.
- **Oyuncu neyin tıkandığını anlamalı:** bottleneck analizi, heatmap, canlı metrikler ve uyarılar ilk sınıf sistemdir.
- **Tek meta build olmamalı:** upload, contract, AI, crypto, white-hat security, shadow ops ve green-energy yolları farklı stratejiler açar.
- **Monetization temiz kalmalı:** güç, hız veya kaynak satılmaz. Uygun model: demo + premium unlock + kozmetik.

## İlk gerçek uygulama hedefi

Codex önce sadece **M1 Vertical Prototype** üzerinde çalışır.

M1'in sırası:

1. Project setup foundation.
2. Core domain types.
3. First six node definitions.
4. Graph state actions.
5. Connection validation.
6. Basic simulation tick.
7. Graph canvas UI.
8. Resource bar and inspector.
9. Save/load v0.
10. Smoke tests and decision log.

M1'de crypto, cyber side operations, AI economy, blueprint, staging room, campaign, prestige veya monetization uygulanmaz. Bunlar dokümante edilmiştir ama ileriki milestone'lardadır.

## Klasör yapısı

```text
.
├── README.md
├── CODEX_START_HERE.md
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
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
│   ├── TESTING_QA.md
│   ├── CI_REQUIREMENTS.md
│   └── RISK_AND_ETHICS.md
└── specs/
    ├── node-catalog.v0.json
    ├── PORT_TYPE_RULES.md
    └── save-game.v0.json
```

## Kalite kapısı

Kod başladıktan sonra şu kalite kapısı zorunludur:

```text
npm run lint
npm test
npm run build
```

Detay: [`docs/CI_REQUIREMENTS.md`](docs/CI_REQUIREMENTS.md) ve [`docs/TESTING_QA.md`](docs/TESTING_QA.md).

## Durum

M0 Project Foundation tamamlandı. Repo artık Codex'in sadece yönergeleri takip ederek M1 implementation'a başlaması için hazırdır.
