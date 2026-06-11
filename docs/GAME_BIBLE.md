# Mimar — Game Bible

## 1. Kısa tanım

**Mimar**, node tabanlı bir veri merkezi, cloud, kripto, siber operasyon ve yapay zekâ otomasyon oyunudur. Oyuncu küçük bir ev sunucusuyla başlar; veri toplar, işler, temizler, sıkıştırır, satar, araştırmaya yönlendirir, kripto madenciliği yapar, legal siber güvenlik kontratları tamamlar, riskli gölge operasyonlara girer, AI modelleri eğitir ve sonunda global bir dijital altyapı şirketine dönüşür.

Oyuncu bir karakterden çok bir sistem mimarıdır. Oyun hissi şu cümlede toplanır:

> Çalışan bir dijital makine tasarlıyorum, darboğazlarını görüyorum, kaynaklarını paylaştırıyorum ve her parçayı daha akıllı hale getiriyorum.

## 2. Tür ve referans hissi

- Node-based automation
- Idle / incremental growth
- Factory/management sim
- Data center strategy
- Light cyberpunk business sim
- Optimization puzzle

Bu proje Upload Labs benzeri node tabanlı akış hissinden ilham alır; fakat amacı kopya yapmak değildir. Mimar'ın ayrıştığı noktalar:

- Kontrat/SLA tabanlı hedefler.
- Enerji, ısı, güvenlik ve itibar yönetimi.
- Kripto ve siber yan gelirlerin kaynak tüketen gerçek strateji katmanı olması.
- Staging room ile sistemi bozmadan test edebilme.
- Güçlü blueprint, bottleneck ve automation araçları.
- Oyun evreni, şirket profili ve senaryo akışı.

## 3. Hedef oyuncu

Birincil oyuncu:

- Incremental/idle oyun seven.
- Factorio, Shapez, Opus Magnum, Zachtronics, factory automation ve management sim sever.
- Sayıların büyümesini, sistem kurmayı ve optimizasyon yapmayı seven.
- Karmaşık sistemleri sever ama UI'ın anlaşılır olmasını bekler.

İkincil oyuncu:

- Teknoloji, AI, cloud, crypto ve siber güvenlik temalarını seven casual oyuncu.
- Mobilde kısa aralıklarla ilerleme görmek isteyen oyuncu.

## 4. Tasarım sütunları

### 4.1. Tereyağı gibi node deneyimi

Node koymak, bağlamak, taşımak, kopyalamak, silmek ve blueprint'e çevirmek pürüzsüz olmalı. Oyuncu arayüzle kavga etmemeli.

Zorunlu kalite özellikleri:

- Snap bağlantılar.
- Büyük port hitbox'ları.
- Undo/redo.
- Copy/paste.
- Multi-select.
- Buy Max.
- Searchable node palette.
- Blueprint save/deploy.
- Staging room.

### 4.2. Her kararın fırsat maliyeti var

Kripto çok para getirebilir ama GPU, elektrik ve soğutma tüketir. Cloud rental stabil gelir sağlar ama compute'u rezerve eder. Cyber ops büyük ödül verir ama trace ve reputation riski yaratır. AI API recurring gelir üretir ama temiz veri ve düşük latency ister.

### 4.3. Darboğaz her zaman görünür

Oyuncu kaybettiğinde veya yavaşladığında nedenini anlamalı:

- Input yok.
- Output dolu.
- Compute yetmiyor.
- Power limiti var.
- Heat throttling başladı.
- Upload gateway yavaş.
- Contract kalite şartı karşılanmıyor.
- Security risk çok yüksek.

### 4.4. Tek doğru yol yok

Oyun şu yolları desteklemeli:

- Upload tycoon.
- Contract/SLA specialist.
- AI lab.
- Crypto mining farm.
- White-hat security company.
- Shadow ops risk-runner.
- Green data center.
- Cloud rental/CDN provider.

### 4.5. Gerçek hacking değil, güvenli kurgusal siber operasyon

Cyber sistemleri gerçek dünyada uygulanabilir saldırı bilgisi vermeden tamamen soyut oyun metrikleriyle çalışır.

## 5. Core fantasy

Oyuncu başlangıçta bodrumdaki küçük bir server rack'i yönetir. Her yeni node, oyuncunun şirketini daha karmaşık ve güçlü bir dijital organizmaya dönüştürür. Bir noktadan sonra oyuncu sadece para kazanmıyor; enerji şirketleriyle pazarlık yapan, AI modelleri satan, güvenlik auditleri yapan, global veri akışı yöneten bir altyapı imparatorluğu kuruyor.

## 6. Ana oyun döngüsü

### 6.1. Mikro döngü — saniyelik

1. Veri node'u data üretir.
2. İşleme node'u data'yı parse/clean/compress eder.
3. Routing node'u data'yı doğru çıkışa gönderir.
4. Output node'u para/research/AI XP/contract progress üretir.
5. Oyuncu bottleneck görür ve iyileştirir.

### 6.2. Orta döngü — dakikalık

1. Oyuncu yeni node alır.
2. Upgrade yapar.
3. Contract seçer.
4. Kaynak dağılımını değiştirir.
5. Crypto/AI/cloud/security arasında öncelik verir.
6. Research açar.

### 6.3. Uzun döngü — saatlik/günlük

1. Yeni teknoloji çağlarına geçer.
2. Şirket profilini şekillendirir.
3. Blueprint library kurar.
4. Challenge ve prestige modları açar.
5. Global grid / quantum era late-game'e ulaşır.

## 7. Ana kaynaklar

| Kaynak | Kullanım | Not |
|---|---|---|
| Money | Node, upgrade, alan, kontrat hazırlığı | Ana para birimi |
| Raw Data | Kaynak node'lardan gelir | İşlenmeden düşük değerli |
| Clean Data | Cleaner/validator sonrası | Kontrat ve AI için gerekli |
| Compute | CPU kapasitesi | Processing ve cyber ops |
| GPU | Mining, AI training, inference | Kritik paylaşım kaynağı |
| Power | Tüm altyapı tüketir | Limit aşılırsa throttling |
| Heat | Fazla kullanım sonucu artar | Performans düşürür |
| Storage | Queue ve wallet/cache kapasitesi | Bottleneck yaratır |
| Bandwidth | Upload, CDN, cyber ops | Ağ darboğazı |
| Research | Teknoloji açar | Research Lab ile gelir |
| Reputation | Kontrat kalitesini açar | Riskli işlerden etkilenir |
| Trust | Kurumsal müşteriler | Security ve legal işlerle artar |
| Trace | Cyber risk | Yüksekse cezalar tetikler |
| Market Signal | Crypto tahmini | Cyber/intelligence ile artabilir |
| AI XP | Model geliştirme | AI Trainer üretir |

## 8. Veri türleri

| Veri | Erken/Geç | Özellik |
|---|---|---|
| Text Data | Erken | Ucuz, hızlı, tutorial için ideal |
| Image Data | Erken-orta | Daha çok compute ister |
| Audio Data | Orta | Compression ve quality ister |
| Video Data | Orta | Bandwidth ve storage zorlar |
| Encrypted Data | Orta | Security/Decrypt node ister |
| Sensor Data | Orta | Sürekli stream üretir |
| Medical Data | Geç | Privacy/trust şartı yüksek |
| Financial Data | Geç | Security ve audit ister |
| Synthetic Data | AI dönemi | AI ile üretilir, label gerekebilir |
| Quantum Data | Late-game | Özel node ve research ister |

## 9. Node sistemi

Node, oyunun ana yapı taşıdır.

Her node şu değerlere sahip olmalıdır:

- `id`
- `definitionId`
- `displayName`
- `category`
- `position`
- `level`
- `inputs`
- `outputs`
- `capacity`
- `throughput`
- `powerUse`
- `heatOutput`
- `computeUse` veya `computeProduce`
- `storageBuffer`
- `status`
- `upgradeCost`
- `unlocks`

Node kategorileri:

1. Data Sources
2. Processing
3. Routing
4. Output/Sales
5. Infrastructure
6. Security
7. Automation
8. Crypto
9. Cyber Ops
10. AI
11. Energy
12. Blueprint/Meta

## 10. İlk node listesi

MVP için:

1. Internet Feed
2. Parser
3. Cleaner
4. Upload Gateway
5. CPU Rack
6. Research Lab
7. Router
8. Splitter
9. Compressor
10. Storage Array
11. GPU Cluster
12. Miner Node
13. Wallet
14. Crypto Seller
15. Bug Bounty Target

Tam oyun için ek node örnekleri:

- API Connector
- Sensor Feed
- Metadata Tagger
- Virus Scanner
- Encryptor
- Validator
- Load Balancer
- Priority Queue
- Contract Portal
- AI Trainer
- Model Server
- CDN Cache
- Cloud Rental Node
- Firewall
- Intrusion Detector
- Proxy Chain
- Payload Builder
- Trace Cleaner
- Solar Array
- Battery Backup
- Fusion Reactor
- Auto Upgrader
- Rule Engine
- Blueprint Builder
- Performance Analyzer

## 11. Kontrat sistemi

Kontratlar oyuncuya sayı büyütmenin ötesinde hedef verir.

Kontrat alanları:

- Required data type.
- Required amount.
- Required quality.
- Max error rate.
- Deadline.
- Minimum trust/reputation.
- Reward money.
- Reward reputation.
- Optional bonus objective.

Örnekler:

### Startup Text Cleanup

- 500 Clean Text Data.
- Quality 60+.
- Deadline 3 dakika.
- Ödül: $25K + 3 Reputation.

### Hospital Privacy Batch

- 1,000 Medical Data.
- Privacy 95+.
- Error rate < 1%.
- Ödül: $2.5M + 12 Trust.

### AI Dataset Order

- 10,000 Labeled Image Data.
- Quality 80+.
- Balanced dataset bonus.
- Ödül: $8M + AI XP bonus.

## 12. Research sistemi

Research ağacı 6 ana dala ayrılır:

1. Throughput
2. Value
3. Automation
4. Security
5. Energy
6. AI
7. Side Operations

Research oyuncuya yeni node, yeni upgrade, yeni contract tier ve yeni automation yetenekleri açar.

## 13. Yan operasyonlar

Yan operasyonlar oyuna farklı gelir stratejileri ekler.

Ana dallar:

- Crypto Mining
- Cyber Ops
- Cloud Rental
- AI API
- CDN / Cache
- Data Labeling
- Energy Trading
- Shadow Market

Kural: Hiçbiri bedava para değildir; her biri kaynak, risk veya itibar maliyeti üretir.

Detaylar `docs/CRYPTO_CYBER_SIDE_OPS.md` dosyasındadır.

## 14. Şirket profili

Oyuncunun kararları şirket kimliğini değiştirir:

| Profil | Artış Sebebi | Etki |
|---|---|---|
| White Hat | Bug bounty, audit | Trust ve kurumsal kontrat |
| Black Hat | Shadow ops | Riskli ama yüksek ödüllü işler |
| Green | Renewable energy, düşük power waste | Eco contracts ve enerji bonusu |
| AI First | AI training/API | AI müşteri zinciri |
| Market Maker | Crypto trading | Market signal ve price bonus |
| Enterprise | SLA başarıları | Büyük kontratlar |

## 15. Progression çağları

### Age 1 — Garage Server

Oyuncu temel data akışını öğrenir.

- Text data
- Parser
- Cleaner
- Upload Gateway
- CPU Rack
- Research Lab

### Age 2 — Startup Network

Kontrat ve research açılır.

- Contract Portal
- Router/Splitter
- Storage
- Basic blueprint
- Buy Max

### Age 3 — Data Center

Power/heat ve infrastructure derinleşir.

- Cooling
- Power grid
- Storage Array
- Load Balancer
- First GPU Cluster

### Age 4 — Side Operations

Yan gelirler açılır.

- Crypto mining
- Wallet/Auto Seller
- Legal bug bounty
- Cloud rental

### Age 5 — AI Lab

AI ekonomisi başlar.

- AI Trainer
- Dataset Labeler
- Model Server
- AI API subscriptions
- Synthetic Data

### Age 6 — Global Grid

Late-game global operasyonlar.

- Enterprise contracts
- CDN
- Security-as-a-Service
- Green energy trading
- Staging room
- Advanced blueprints

### Age 7 — Quantum / Autonomous Era

Prestige ve sonsuz optimizasyon.

- Quantum processors
- Fusion energy
- Autonomous optimizer
- Rogue AI events
- Prestige challenges

## 16. Prestige / reset sistemi

Prestige, oyuncuya eski sistemi çöpe atmak değil, onu mimari olarak daha iyi yeniden kurmak hissi vermeli.

Prestige ödülleri:

- Permanent throughput bonus.
- Blueprint carryover.
- Starting capital.
- Research speed.
- Unlock token.
- Offline efficiency.
- Special challenge modifiers.

Prestige sonrası otomatik rebuild için blueprint sistemi şarttır.

## 17. Offline progress

Offline progress oyuncunun sistemine göre hesaplanmalı ama sınırlı olmalı.

İlk öneri:

- 2 saat tam verim.
- Sonra düşen verim eğrisi.
- Riskli cyber ops offline çalışmaz.
- Crypto offline çalışabilir ama market volatility etkilenir.
- Contract deadline offline sürede işler; oyuncuya uyarı verilir.

## 18. Monetization ilkesi

Satılmamalı:

- Para.
- Research.
- Speed boost.
- Offline boost.
- Güçlü node.
- Risk azaltıcı avantaj.

Satılabilir:

- Premium full game unlock.
- Kozmetik temalar.
- Node skinleri.
- Arka planlar.
- Müzik paketi.
- Supporter badge.

## 19. Başarı kriterleri

Oyun başarılı sayılırsa oyuncu şu cümleleri kurmalı:

- “Neresi tıkandı, hemen gördüm.”
- “Bu sistemi daha temiz kurabilirim.”
- “Crypto para getiriyor ama AI tarafını boğuyor.”
- “Riskli işi yaparsam hızlı büyürüm ama reputation gider.”
- “Bu blueprint'i kaydedeyim, sonra lazım olur.”

## 20. MVP kapsam dışı

İlk prototipte yapılmayacaklar:

- Full story campaign.
- Full crypto market sim.
- Riskli black-hat ops.
- Full AI model economy.
- Multiplayer.
- Blueprint sharing.
- Steam/mobile packaging.
- Cloud save.

Bunlar daha sonraki milestone'lara bırakılacaktır.
