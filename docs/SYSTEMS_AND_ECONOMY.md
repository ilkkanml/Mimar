# Mimar — Sistemler ve Ekonomi Tasarımı

## 1. Amaç

Bu doküman Mimar'ın kaynaklarını, node ekonomisini, gelir sistemlerini, progression yapısını, upgrade mantığını ve dengeleme ilkelerini tanımlar.

Temel hedef: Oyuncu sadece “daha çok para” kovalamamalı. Para, veri, compute, GPU, enerji, ısı, güvenlik, itibar ve AI gibi kaynaklar arasında karar vermelidir.

## 2. Ekonomi felsefesi

Mimar'da iyi ekonomi şu hissi yaratır:

> Her şey para kazandırabilir ama her şey bir şeyi tüketir.

Bu nedenle:

- Upload gelirleri network ve data pipeline ister.
- Contract gelirleri kalite, deadline ve trust ister.
- Crypto mining GPU, power ve cooling ister.
- Cyber ops compute, stealth ve risk yönetimi ister.
- AI API temiz data, GPU ve düşük latency ister.
- Cloud rental uptime ve rezerve compute ister.
- CDN storage ve bandwidth ister.
- Energy trading power fazlası ister.

## 3. Ana kaynaklar

### 3.1. Money

Kullanım:

- Node satın alma.
- Upgrade.
- Canvas/area genişletme.
- Contract hazırlık ücretleri.
- Repair ve security audit maliyetleri.

Üretim:

- Upload Gateway.
- Contract Portal.
- Crypto Seller.
- Cloud Rental Node.
- AI API Gateway.
- CDN Endpoint.
- Energy Seller.

### 3.2. Data

Data birden fazla kalitede düşünülür:

- `rawData`
- `parsedData`
- `cleanData`
- `compressedData`
- `encryptedData`
- `labeledData`
- `syntheticData`
- `quantumData`

İlk MVP'de sadece `rawData`, `cleanData` ve `researchData` yeterlidir.

### 3.3. Compute

CPU ağırlıklı işlem gücü.

Tüketenler:

- Parser
- Cleaner
- Compressor
- Router/Load Balancer
- Research Lab
- Cyber Ops

Üretenler:

- CPU Rack
- Server Rack
- Quantum Processor

### 3.4. GPU

Yüksek değerli paylaşım kaynağı.

Tüketenler:

- Crypto mining
- AI Trainer
- Model Server
- Cloud GPU rental
- Synthetic Data Generator

GPU allocation sistemi orta oyunda açılır.

### 3.5. Power

Tüm altyapının güç limiti.

- Node'lar power kullanır.
- Power limiti aşılırsa node'lar throttled olur.
- Power cost net kârdan düşer.

İlk MVP'de power pasif değer olabilir. M2'de aktif sınırlama olmalı.

### 3.6. Heat

Power ve overclock kullanımıyla artar.

Etkiler:

- Throughput düşer.
- Error rate artar.
- Node shutdown riski oluşur.
- Repair cost tetiklenebilir.

Cooling node'ları heat'i düşürür.

### 3.7. Storage

Buffer, cache, wallet ve data queue kapasitesi.

Etkiler:

- Storage dolarsa upstream node'lar bekler.
- CDN ve dataset sistemleri storage ister.
- Wallet kapasitesi crypto satış kararlarını etkiler.

### 3.8. Bandwidth

Ağ kapasitesi.

Tüketenler:

- Upload Gateway
- Contract Delivery
- CDN
- Cyber Ops
- Cloud Rental
- AI API

### 3.9. Research

Yeni node ve sistem açar.

Üretim:

- Research Lab
- Special contracts
- Bug bounty rewards
- AI experiments

### 3.10. Reputation ve Trust

Reputation genel şirket görünürlüğüdür. Trust ise kurumsal güven seviyesidir.

Artar:

- Contract başarıları.
- Bug bounty.
- Security audit.
- Uptime başarıları.

Azalır:

- Failed contracts.
- Trace olayları.
- Data leak eventleri.
- High error delivery.

### 3.11. Trace ve Heat/Regulator Attention

Cyber ops risk kaynaklarıdır.

- Trace kısa vadeli yakalanma riskidir.
- Regulator Attention uzun vadeli şirket baskısıdır.
- Black Hat operasyonları bunları artırır.

İlk legal bug bounty sisteminde trace çok düşük veya sıfır olmalıdır. Riskli shadow ops daha geç açılır.

## 4. Node ekonomisi

Her node definition şu alanlara sahip olmalıdır:

```ts
type NodeDefinition = {
  id: string;
  name: string;
  category: NodeCategory;
  description: string;
  baseCost: number;
  costGrowth: number;
  maxLevel?: number;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  baseStats: NodeStats;
  upgradeScaling: Partial<NodeStats>;
  unlockRequirements?: UnlockRequirement[];
};
```

Önerilen cost formülü:

```text
upgradeCost(level) = baseCost * costGrowth ^ level
```

Erken oyun için `costGrowth` 1.15–1.35 arası tutulmalı. Automation/late-game node'ları daha yüksek growth kullanabilir.

## 5. Tick ekonomisi

İlk implementation için fixed tick önerisi:

```text
simulationTick = 10 times per second
resourceDisplay = smoothed per second
```

Her tick:

1. Node input buffer'ları okunur.
2. Node üretim/tüketim kapasitesi hesaplanır.
3. Power/heat/compute limitleri uygulanır.
4. Data edge'ler üzerinden taşınır.
5. Output node'ları para/research/XP üretir.
6. Contract progress güncellenir.
7. Bottleneck state hesaplanır.

## 6. Basit akış modeli

MVP için karmaşık item simülasyonu gerekmez. “Flow quantity” yeterlidir.

Örnek:

```text
Internet Feed: +10 rawData/sec
Parser: consumes 8 rawData/sec, produces 8 parsedData/sec, uses 2 compute
Cleaner: consumes 6 parsedData/sec, produces 5.5 cleanData/sec, uses 3 compute
Upload Gateway: consumes 5 cleanData/sec, produces $50/sec
```

Bu model ileride item-batch veya packet sistemiyle genişletilebilir.

## 7. Darboğaz tipleri

Her node bir `status` üretmelidir:

- `running`
- `input_starved`
- `output_blocked`
- `compute_limited`
- `power_limited`
- `heat_throttled`
- `storage_full`
- `network_limited`
- `contract_mismatch`
- `security_locked`

UI bu status'u renk ve tooltip ile göstermelidir.

## 8. Gelir türleri

### 8.1. Upload Sales

En basit gelir.

```text
money/sec = cleanData/sec * baseValue * qualityMultiplier
```

Erken oyunda en güvenilir gelir olmalıdır.

### 8.2. Contracts

Belirli hedeflere göre büyük ödül.

```text
contractProgress += deliveredAmount
if requirements met before deadline -> reward
else -> penalty or partial reward
```

Kontratlar oyuncuya build hedefi verir.

### 8.3. Crypto Mining

```text
coin/sec = gpuAllocated * minerEfficiency * difficultyModifier
netMoney/sec = coin/sec * marketPrice - powerCost - coolingCost
```

Market price dalgalanmalı ama erken coin çok aşırı volatil olmamalı.

### 8.4. Cyber Ops

Legal bug bounty:

```text
successChance = breachPower / (breachPower + targetDefense)
reward = money + whiteHatXP + reputation
```

Riskli shadow ops daha sonra:

```text
traceRisk = targetThreat + operationRisk - stealthScore
```

### 8.5. Cloud Rental

Boşta kalan compute'u kiralar.

```text
money/sec = reservedCompute * contractRate * uptimeMultiplier
```

Compute rezerve edildiği için ana pipeline yavaşlayabilir.

### 8.6. AI API

Model eğitildikten sonra recurring gelir.

```text
subscriberIncome/sec = modelQuality * requestThroughput * uptimeMultiplier
```

Tüketim:

- GPU inference.
- Bandwidth.
- Power.

### 8.7. CDN / Cache

```text
money/sec = cacheHitRate * bandwidthServed * clientRate
```

Storage ve bandwidth gerektirir.

### 8.8. Energy Trading

Power fazlasını satar.

```text
money/sec = surplusPower * gridPrice
```

Ama mining/AI için kullanılabilecek power azalır.

## 9. Progression unlock mantığı

Unlock'lar üç şeyle tetiklenebilir:

1. Research node'u.
2. Chapter objective.
3. Resource threshold.

Örnekler:

- Research 100: Router açılır.
- Reputation 10: Contract Portal açılır.
- Money/sec 1K: Power/Heat sistemi aktif olur.
- GPU Cluster owned: Crypto Mining research açılır.
- White Hat XP 50: Corporate Pentest açılır.

## 10. Upgrade türleri

### 10.1. Node level upgrade

- Throughput artar.
- Power use artabilir.
- Heat artabilir.
- Efficiency bazı node'larda artar.

### 10.2. Global research upgrade

- Tüm parser'lar +10% throughput.
- Cleaner error rate -5%.
- Upload value +15%.
- GPU efficiency +10%.

### 10.3. Automation upgrade

- Buy Max.
- Auto collect.
- Auto upgrade rule.
- Auto sell crypto.
- Auto pause mining if heat high.

### 10.4. Quality upgrade

- Cleaner quality boost.
- Validator error reduction.
- Metadata enrichment value bonus.

## 11. Inflation ve dengeleme

Para büyümesi exponential olabilir ama yeni kaynak limitleri oyuncuyu sadece para ile çözemeyeceği problemlere götürmelidir.

Aşamalar:

1. Money limited.
2. Compute limited.
3. Power/heat limited.
4. Quality/contract limited.
5. GPU allocation limited.
6. Trust/security limited.
7. Automation/space limited.

## 12. İlk MVP değer önerisi

MVP sayıları rough placeholder'dır:

| Node | Cost | Üretim/Tüketim |
|---|---:|---|
| Internet Feed | 0 | +10 rawData/sec |
| Parser | 50 | -8 rawData/sec, +8 parsedData/sec, -2 compute |
| Cleaner | 100 | -6 parsedData/sec, +5.5 cleanData/sec, -3 compute |
| Upload Gateway | 150 | -5 cleanData/sec, +$50/sec |
| CPU Rack | 200 | +10 compute |
| Research Lab | 500 | -2 cleanData/sec, +1 research/sec |

MVP'de goal:

- İlk 5 dakika içinde oyuncu para akışını görmeli.
- İlk 10 dakika içinde bottleneck anlayabilmeli.
- İlk 20 dakika içinde research açmalı.
- İlk 30-60 dakika içinde basic contract veya side ops tease görmeli.

## 13. Kaynak gösterim prensibi

UI'da kaynaklar hem toplam hem net/saniye göstermeli:

```text
Money: $12.4K   +$420/sec
Raw Data: 1.2K  +30/sec
Clean Data: 500 -5/sec
Compute: 18/25 used
Power: 64/100 MW
Heat: 72%
```

## 14. Alert sistemi

Oyuncuya spam yapmadan önemli şeyleri göstermeli:

- “Upload Gateway output capacity maxed.”
- “Power load above 90%.”
- “Heat throttling started.”
- “Contract deadline in 30s.”
- “Crypto price spike.”
- “Trace risk high.”

## 15. Dengeleme için izlenecek metrikler

Playtest sırasında ölç:

- Time to first money.
- Time to first bottleneck.
- Time to first upgrade.
- Time to first research.
- Time to first contract.
- Average nodes at minute 10/30/60.
- Most profitable income source distribution.
- Player confusion points.
- Undo usage.
- Blueprint usage.
- Session length.

## 16. Kapsam dışı karmaşıklıklar

İlk sürümde kaçınılacaklar:

- Gerçek zamanlı packet-level simulation.
- Tam piyasa order book.
- Çok karmaşık AI model istatistikleri.
- Gerçek hacking terminolojisi.
- Multiplayer economy.

Önce eğlenceli ve anlaşılır ana döngü kurulmalıdır.
