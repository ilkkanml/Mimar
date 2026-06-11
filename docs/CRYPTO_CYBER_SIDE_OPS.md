# Mimar — Crypto, Cyber Ops ve Yan Gelir Sistemleri

## 1. Amaç

Bu doküman Mimar'daki kripto madenciliği, legal siber güvenlik işleri, riskli kurgusal gölge operasyonlar ve diğer yan gelir sistemlerini tanımlar.

Ana kural:

> Yan operasyonlar bedava para değildir. Her biri ana sistemden kaynak çalar veya risk üretir.

Bu sistemler oyuncuya şu kararları verdirmelidir:

- GPU'yu AI training'e mi vereyim, mining'e mi?
- Boş compute'u cloud rental'a mı ayırayım, data processing'e mi?
- Legal bug bounty ile trust mı kasayım, riskli shadow ops ile hızlı para mı kazanayım?
- Coin'i şimdi mi satayım, wallet'ta mı bekleteyim?
- Heat yüksekken mining'i durdurmalı mıyım?

## 2. Güvenlik ve etik sınır

Cyber ops sistemi gerçek hayatta uygulanabilir hacking bilgisi öğretmemelidir.

Kullanılabilir soyut kavramlar:

- Payload Power
- Firewall Rating
- Target Defense
- Trace Risk
- Stealth Score
- Intel
- Security Audit
- Bug Bounty
- Shadow Contract

Kullanılmayacak şeyler:

- Gerçek exploit isimleri.
- Gerçek komutlar.
- Zararlı kod mantığı.
- Zafiyet tarama adımları.
- Credential abuse.
- Bypass teknikleri.
- Gerçek kurumları hedef gösteren içerik.

Tüm hedefler kurgusal olmalıdır.

## 3. Yan gelir kategorileri

| Sistem | Gelir Tipi | Kaynak Maliyeti | Risk |
|---|---|---|---|
| Crypto Mining | Pasif / piyasa bağlı | GPU, Power, Heat | Market crash, heat throttling |
| Legal Cyber Ops | Kontrat ödülü | Compute, Time | Düşük risk, trust artışı |
| Shadow Ops | Büyük tek seferlik ödül | Compute, Stealth, Security | Trace, reputation loss |
| Cloud Rental | Stabil recurring | Compute/GPU reserve | SLA penalty |
| AI API | Recurring scaling | GPU, Clean Data, Bandwidth | Latency, model quality |
| CDN Cache | Traffic geliri | Storage, Bandwidth | Cache miss, storage pressure |
| Data Labeling | Dataset geliri | Clean Data, Compute | Slow throughput |
| Energy Trading | Fazla power satışı | Surplus Power | Opportunity cost |

## 4. Crypto Mining sistemi

### 4.1. Temel pipeline

```text
GPU Cluster → Miner Node → Wallet → Crypto Seller → Money
```

Daha gelişmiş pipeline:

```text
GPU Cluster → Miner Node → Wallet → Auto Trader → Exchange → Money
                   ↓             ↑
             Cooling Rig     Market Predictor
```

### 4.2. Node'lar

| Node | Görev |
|---|---|
| GPU Cluster | GPU gücü üretir |
| Miner Node | Seçilen coin'i üretir |
| Wallet | Coin depolar |
| Crypto Seller | Coin'i paraya çevirir |
| Auto Seller | Belirli kurala göre satar |
| Market Predictor | Fiyat trend tahmini sağlar |
| Mining Pool Router | Stabil ama düşük getiri |
| Solo Mining Node | Riskli ama yüksek jackpot ihtimali |
| Overclock Node | Daha çok mining, daha çok heat |
| Cooling Rig | Heat etkisini azaltır |
| Power Optimizer | Mining power maliyetini düşürür |

### 4.3. Kurgusal coin'ler

Gerçek coin isimleri kullanmak yerine oyun evrenine ait coin'ler kullanılmalıdır.

| Coin | Açılma | Karakter |
|---|---|---|
| ByteCoin | Erken | Düşük değer, stabil |
| HashLite | Erken-Orta | Dengeli, tutorial coin |
| QuantumBit | Orta | Yavaş üretim, yüksek değer |
| EcoCoin | Orta | Renewable energy bonusu |
| NeuralCoin | AI dönemi | AI training ile sinerji |
| DarkHash | Shadow ops sonrası | Yüksek kâr, yüksek dikkat |
| VoidCoin | Late-game | Çok volatil, prestige bağlantılı |

### 4.4. Basit formül

```text
coinPerSecond = allocatedGpu * minerEfficiency * difficultyModifier * heatMultiplier
moneyPerSecond = coinPerSecond * marketPrice
netProfit = moneyPerSecond - powerCost - coolingCost
```

Heat multiplier örneği:

```text
if heat < 70%: 1.0
if heat 70-90%: 0.75
if heat > 90%: 0.4 and shutdown risk
```

### 4.5. Market sistemi

İlk versiyon basit olmalı:

- Her coin için `marketPrice`.
- Her coin için `volatility`.
- Periyodik random walk.
- Event kartları fiyatı etkileyebilir.

Örnek:

```ts
type CoinMarket = {
  coinId: string;
  price: number;
  volatility: number;
  trend: -1 | 0 | 1;
  lastEvent?: string;
};
```

### 4.6. Auto-sell kuralları

Oyuncu automation açınca:

- Price > X olursa %Y sat.
- Wallet dolarsa sat.
- Heat > X olursa mining'i durdur.
- Power load > X olursa mining allocation azalt.
- Coin düşüş trendindeyse mining'i HashLite'a geçir.

## 5. Cyber Ops sistemi

Cyber Ops iki kola ayrılır:

1. **White Hat / Legal Security**
2. **Shadow Ops / Riskli Kurgusal İşler**

İlk MVP sonrası önce White Hat yapılmalı. Shadow Ops daha sonra açılmalı.

### 5.1. Legal cyber pipeline

```text
Intel Scanner → Payload Builder → Sandbox Tester → Bug Bounty Target → Reward Router
```

Bu pipeline gerçek saldırı öğretmez. Sadece oyun istatistiklerini karşılaştırır.

### 5.2. Cyber node'ları

| Node | Görev |
|---|---|
| Hacker Node | Cyber operation power üretir |
| Intel Scanner | Target hakkında soyut bilgi üretir |
| Payload Builder | Payload Power üretir |
| Sandbox Tester | Başarı şansı tahmini verir |
| Payload Launcher | Operation başlatır |
| Bug Bounty Target | Legal hedef |
| Corporate Audit Target | Trust ödüllü legal hedef |
| Proxy Chain | Trace riskini azaltan soyut savunma |
| Trace Cleaner | Operation sonrası trace azaltır |
| Security Lab | White Hat ödüllerini artırır |
| Dark Broker | Shadow contract listesi sunar |
| Reward Router | Ödülü money/research/intel olarak böler |

### 5.3. Legal hedefler

| Target | Ödül | Risk |
|---|---|---|
| Training Server | Hacker XP | Yok |
| Startup Bug Bounty | Money + White Hat | Çok düşük |
| Corporate Pentest | Money + Trust | Düşük-Orta |
| Security Audit Lab | Research + Trust | Düşük |
| AI Safety Simulation | AI XP + Research | Orta |

### 5.4. Shadow hedefler

Hepsi kurgusaldır ve gerçek kurum içermez.

| Target | Ödül | Risk |
|---|---|---|
| Abandoned Relay | Data + küçük para | Düşük |
| Rival Bot Swarm | DarkHash + Intel | Orta |
| Null Market Cache | Money + Black Rep | Yüksek |
| Ghost Ledger Vault | Coin + rare data | Çok yüksek |
| Rogue AI Fragment | AI bonusu + VoidCoin | Extreme |

### 5.5. Başarı hesaplama

Basit soyut sistem:

```text
breachPower = payloadPower * launcherEfficiency * timeMultiplier
targetDefense = firewallRating + encryptionRating + threatLevel
successChance = breachPower / (breachPower + targetDefense)
```

Trace:

```text
traceRisk = baseThreat + operationRisk + targetTier - stealthScore - proxyBonus
```

UI gösterimi:

```text
Success Chance: 72%
Trace Risk: 18%
Reward: $1.2M + 40 Intel
Time Limit: 15s
```

### 5.6. Başarısızlık sonuçları

Legal işlerde:

- Küçük cooldown.
- Az veya sıfır reputation kaybı.
- Öğrenme XP'si.

Shadow işlerde:

- Trace artışı.
- Regulator Attention artışı.
- Trust düşüşü.
- Bazı corporate contract'ların kilitlenmesi.
- Wallet freeze ihtimali.
- Temporary system lockdown.

## 6. Crypto + Cyber sinerjileri

Sistemler birbirinden kopuk olmamalı.

Örnek sinerjiler:

- Bug bounty -> White Hat -> kurumsal kontratlar açılır.
- Shadow ops -> DarkHash miner açılır.
- Intel -> Market Predictor doğruluğu artar.
- Trace Cleaner -> riskli crypto satışları daha güvenli olur.
- AI Optimizer -> Payload Power veya mining efficiency artar.
- Security Lab -> Wallet freeze riskini azaltır.
- Green energy -> EcoCoin değeri artar.

## 7. GPU allocation sistemi

Orta oyunda GPU tek bir pool olarak yönetilir:

```text
GPU Allocation:
- AI Training: 40%
- Crypto Mining: 30%
- Cloud Rental: 20%
- Model Inference: 10%
```

Allocation değişince income breakdown ve bottleneck paneli güncellenir.

Kural:

- Toplam %100'ü geçemez.
- Her sistem minimum gereksinim altında çalışırsa throttled olur.
- Automation rules allocation'ı değiştirebilir.

## 8. Diğer yan gelirler

### 8.1. Cloud Compute Rental

Pipeline:

```text
CPU/GPU Cluster → Cloud Rental Node → SLA Monitor → Client Billing
```

Metrikler:

- Reserved compute.
- Uptime.
- Latency.
- SLA penalty.

### 8.2. AI API

Pipeline:

```text
Clean/Labeled Data → AI Trainer → Model Server → API Gateway → Subscription Income
```

Metrikler:

- Model quality.
- Inference/sec.
- Subscriber count.
- Latency.
- GPU allocation.

### 8.3. CDN / Cache

Pipeline:

```text
Popular Data → Cache Server → CDN Endpoint → Money
```

Metrikler:

- Cache hit rate.
- Storage use.
- Bandwidth served.
- Regional latency.

### 8.4. Data Labeling

Pipeline:

```text
Raw Image/Text → Labeler → Quality Checker → Dataset Market
```

Metrikler:

- Label accuracy.
- Dataset balance.
- Quality score.

### 8.5. Security-as-a-Service

Pipeline:

```text
Security Lab → Client Protection Contract → Trust + Money
```

Sinerji:

- White Hat profile.
- Firewall node upgrades.
- Audit success.

### 8.6. Energy Trading

Pipeline:

```text
Solar/Fusion → Battery → Grid Seller → Money
```

Opportunity cost:

- Satılan power mining/AI için kullanılamaz.

## 9. Side income breakdown paneli

UI'da oyuncu gelirin nereden geldiğini görmelidir.

Örnek:

```text
Income Breakdown
Upload Sales        $42K/sec   48%
Crypto Mining       $21K/sec   24%
AI API              $12K/sec   14%
Cloud Rental         $8K/sec    9%
Cyber Contracts      $4K/sec    5%
```

Risk paneli:

```text
Power Load: 84%
Heat: 71%
Trace Risk: 18%
Trust: 76
Market Volatility: High
```

## 10. Automation rule örnekleri

```text
If HashLite price > 150%, sell 50% wallet.
If Heat > 85%, reduce mining GPU allocation by 30%.
If Trace Risk > 60%, pause shadow contracts.
If AI API latency > 200ms, move 20% GPU from mining to inference.
If Power Cost > $10K/sec, enable Eco Mode.
If Contract deadline < 30s, prioritize contract delivery.
```

## 11. Unlock sırası önerisi

1. Basic Upload Pipeline.
2. Contract Portal.
3. Power/Heat.
4. GPU Cluster.
5. Basic Crypto Mining.
6. Legal Bug Bounty.
7. Cloud Rental.
8. AI Trainer.
9. AI API.
10. Shadow Ops.
11. Advanced Crypto Market.
12. Energy Trading.
13. Quantum/Void systems.

## 12. MVP planı

M3 Side Operations milestone için minimum:

Crypto:

- GPU Cluster.
- Miner Node.
- Wallet.
- Crypto Seller.
- 2 coin: ByteCoin, HashLite.
- Basit market price random walk.
- Heat/power cost etkisi.

Cyber:

- Hacker Node.
- Payload Builder.
- Training Target.
- Bug Bounty Target.
- Success chance.
- White Hat XP.
- Basit reward.

UI:

- Side income breakdown.
- GPU allocation başlangıcı.
- Trace risk göstergesi.

Kapsam dışı:

- Gerçekçi trading.
- Full shadow ops.
- Complex target chains.
- Multiplayer market.

## 13. Balance riskleri

### Crypto çok güçlü olursa

Oyuncu upload/contract sistemini bırakır.

Çözüm:

- GPU opportunity cost.
- Power/heat maliyeti.
- Difficulty artışı.
- Market crash eventleri.

### Cyber çok rastgele olursa

Oyuncu kontrolsüz hisseder.

Çözüm:

- Success chance net göster.
- Sandbox Tester ile ön bilgi ver.
- Başarısızlıkta öğrenme ödülü ver.

### Shadow ops çok cezalandırıcı olursa

Oyuncu hiç kullanmaz.

Çözüm:

- Risk azaltıcı node'lar.
- Küçük düşük riskli hedefler.
- Ödül/ceza şeffaflığı.

### Yan gelir UI karışırsa

Oyuncu kaynakların nereye gittiğini anlamaz.

Çözüm:

- Income breakdown.
- Resource allocation panel.
- Bottleneck explanation.

## 14. Tasarım notu

Bu sistemlerin amacı oyuncuya “illegal şey yapmak” hissi satmak değildir. Amaç, veri ekonomisinde riskli/temiz büyüme kararlarını kurgusal ve güvenli bir strateji katmanı olarak sunmaktır.
