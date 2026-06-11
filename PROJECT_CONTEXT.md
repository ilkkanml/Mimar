# Mimar — Project Context

Bu dosya projenin **kalıcı hafızasıdır**. Yeni bir Codex / ChatGPT oturumuna başlandığında ilk okunacak dosya budur. Amaç: bağlam bozulmasın, ekip/AI nerede kaldığını bilsin, aynı tasarım kararları tekrar tekrar tartışılmasın.

## Proje özeti

**Mimar**, node tabanlı bir idle / automation / management oyunudur. Oyuncu küçük bir ev sunucusuyla başlar ve zamanla global cloud, veri merkezi, yapay zekâ laboratuvarı ve siber operasyon ağı kurar.

Oyuncu canvas üzerinde node'lar yerleştirir, bağlantılar kurar, veri akışını optimize eder, kontratları tamamlar, kripto madenciliği ve diğer yan operasyonlardan gelir elde eder. Her yan gelir sistemi ana kaynakları tüketir: GPU, CPU, enerji, soğutma, network, storage, security ve reputation.

## Çekirdek pitch

> Küçük bir server odasından başlayıp global bir veri ve AI altyapısı inşa et. Node'larla veri akışları kur, darboğazları çöz, müşteri kontratlarını tamamla, kripto ve siber operasyonlardan yan gelir üret, riskleri yönet, sonunda kendi kendini optimize eden dijital bir imparatorluk yarat.

## Oyun türü

- Node-based automation
- Idle / incremental
- Data center management
- Light business simulation
- Strategy / optimization
- Fictional cyber operations

## Platform hedefi

Önce web tabanlı prototip:

- TypeScript
- Vite
- Canvas/SVG/HTML hybrid UI
- Local save
- Desktop-first, sonra mobil/tablet uyumu

İleride:

- Steam build
- Mobile adaptation
- Cloud save
- Blueprint sharing

## Önemli tasarım kuralları

1. **Oyuncu neyin tıkandığını her zaman anlamalı.**
   - Bottleneck paneli, node durum renkleri, bağlantı throughput göstergesi, heatmap ve uyarılar zorunlu.

2. **Yan gelir bedava para olmamalı.**
   - Crypto mining GPU + power + heat tüketir.
   - Cyber ops trace + heat + reputation riski üretir.
   - Cloud rental compute ve uptime ister.
   - AI API kaliteli data + GPU + latency yönetimi ister.

3. **Gerçek hacking öğretmeyen soyut sistem kullanılmalı.**
   - Payload, firewall, trace, stealth gibi değerler sadece oyun metrikleri olmalı.
   - Gerçek exploit, komut, zafiyet tarama veya saldırı adımı anlatılmaz.

4. **UI/UX premium hissedilmeli.**
   - Undo/redo, copy/paste, buy max, multi-select, blueprint, staging room ve search baştan düşünülmeli.

5. **Tek meta build olmamalı.**
   - Upload, contracts, AI, crypto, white-hat security, shadow ops, cloud rental, CDN, green energy yolları viable olmalı.

6. **Monetization güven bozmayacak şekilde kalmalı.**
   - Para, research, speed boost, offline boost, power satılmaz.
   - En güvenli model: demo + premium unlock + kozmetik.

## Mevcut durum

- M0 proje tasarımı ve dokümantasyon foundation tamamlandı.
- M1 implementation başladı.
- İlk kod pass'i M1-001, M1-002 ve M1-003 ile sınırlı tamamlandı: Vite + TypeScript foundation, core domain types ve ilk 6 node definition.
- M1-004 graph state actions tamamlandı.
- M1-005 connection validation tamamlandı.
- M1-006 basic simulation tick tamamlandı.
- Sıradaki hedef: M1-007 graph canvas UI.

## İlk milestone hedefi — M1 Vertical Prototype

Amaç: oyuncunun node yerleştirip bağladığı, veri akışının çalıştığı, para kazandığı ve save/load yaptığı küçük ama gerçek bir prototip.

Kapsam:

- Vite + TypeScript proje iskeleti.
- Game loop.
- Node model ve edge model.
- Canvas üzerinde node yerleştirme/sürükleme.
- Basic connect/disconnect.
- Money, Data, Compute kaynakları.
- İlk 6 node:
  - Internet Feed
  - Parser
  - Cleaner
  - Upload Gateway
  - CPU Rack
  - Research Lab
- Basit upgrade sistemi.
- LocalStorage save/load.
- Basic bottleneck text.

## İkinci milestone hedefi — M2 Systems Slice

- Power / heat sistemi.
- Buy Max.
- Undo/redo.
- İlk contract sistemi.
- İlk research ağacı.
- Node tooltip metrikleri.
- 12-15 node.

## Üçüncü milestone hedefi — M3 Side Operations

- Crypto mining hattı.
- Legal cyber ops / bug bounty hattı.
- GPU allocation.
- Wallet + auto-seller.
- Trace risk sistemi.
- Side income breakdown paneli.

## Codex çalışma protokolü

Her geliştirme oturumunda:

1. Önce bu dosyayı oku.
2. Sonra `AGENTS.md` dosyasını oku.
3. İlgili milestone'u `docs/MILESTONES.md` içinden bul.
4. İşe başlamadan önce küçük bir implementation plan çıkar.
5. Kod yazarken küçük, test edilebilir parçalar üret.
6. İş bitince şunları güncelle:
   - `docs/DECISION_LOG.md`
   - Gerekirse `PROJECT_CONTEXT.md`
   - Gerekirse `docs/CODEX_BACKLOG.md`
7. Eksik kalan işi açıkça backlog'a yaz.

## Öncelikli dosyalar

- `docs/GAME_BIBLE.md`: tasarımın ana kaynağı.
- `docs/SYSTEMS_AND_ECONOMY.md`: ekonomi, kaynaklar, progression.
- `docs/CRYPTO_CYBER_SIDE_OPS.md`: mining ve cyber yan operasyonlar.
- `docs/TECHNICAL_ARCHITECTURE.md`: kod mimarisi.
- `docs/UX_UI_SPEC.md`: UI/UX kuralları.
- `docs/MILESTONES.md`: yol haritası.
- `docs/CODEX_BACKLOG.md`: görev havuzu.

## Geçerli ürün adı

Çalışma adı: **Mimar**

Alternatif isimler daha sonra test edilebilir:

- DataGrid Architect
- Grid Architect
- Cloud Architect
- Neural Grid
- Upload Empire
- Veri İmparatorluğu

Şimdilik repo ve proje adı **Mimar** olarak kalacak.
