# Mimar — UX / UI Specification

## 1. Amaç

Bu doküman Mimar'ın kullanıcı deneyimi ve arayüz kurallarını tanımlar. Oyunun başarısı yalnızca ekonomi veya içerik derinliğine değil, node kurma ve sistemi okuma hissine bağlıdır.

Ana hedef:

> Oyuncu arayüzle savaşmasın; sistem kurmanın keyfini yaşasın.

## 2. UX tasarım ilkeleri

### 2.1. Node bağlamak zahmetsiz olmalı

- Port hitbox'ları büyük olmalı.
- Bağlantı çizgisi hedef node'a yaklaştığında uygun porta snap etmelidir.
- Geçerli bağlantı yeşil/onaylı, geçersiz bağlantı kırmızı/uyarı tonunda gösterilmelidir.
- Oyuncu neden bağlayamadığını tooltip ile görmelidir:
  - “Output must connect to input.”
  - “Resource type mismatch.”
  - “This input is already full.”

### 2.2. Darboğaz görünür olmalı

Oyuncu yavaşladığında nedenini anlamalı. Her node şu statülerden birini anlaşılır şekilde gösterebilmelidir:

- Running
- Input Starved
- Output Blocked
- Compute Limited
- Power Limited
- Heat Throttled
- Storage Full
- Network Limited
- Contract Mismatch
- Security Locked

### 2.3. Hata affedilebilir olmalı

Zorunlu kontroller:

- Undo/redo.
- Delete confirmation for large selections.
- Autosave.
- Save backup slot.
- Blueprint preview before deploy.
- Connection delete easy but recoverable.

### 2.4. Oyuncu sistemini bozmadan deneyebilmelidir

Staging Room ileride oyunun en güçlü kalite özelliklerinden biri olacak.

Staging Room:

- Mevcut sistemi kopyalar.
- Test simülasyonu çalıştırır.
- Eski/yeni metrikleri karşılaştırır.
- Oyuncu isterse deploy eder.

MVP'de staging yok ama mimari buna engel olmamalıdır.

### 2.5. Bilgi katmanlı verilmelidir

Her şeyi aynı anda göstermek karmaşa yaratır. Bilgi 3 katmanda sunulmalı:

1. **Anlık görsel durum:** renk, icon, küçük rate.
2. **Tooltip:** neden/sonuç açıklaması.
3. **Inspector panel:** detaylı istatistik ve upgrade.

## 3. Ana ekran düzeni

Önerilen desktop layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ Top Resource Bar                                            │
├───────────────┬───────────────────────────────┬─────────────┤
│ Node Palette  │ Graph Canvas                   │ Inspector   │
│               │                               │ Panel       │
├───────────────┴───────────────────────────────┴─────────────┤
│ Bottom Toolbar / Alerts / Buy Mode / Blueprint / Undo        │
└─────────────────────────────────────────────────────────────┘
```

## 4. Top Resource Bar

Göstermeli:

- Money total + per second.
- Raw/Clean Data total + per second.
- Compute used/capacity.
- GPU used/capacity, M3 sonrası.
- Power load.
- Heat.
- Research.
- Reputation/Trust.
- Trace, sadece cyber açıldıktan sonra.

Örnek:

```text
$12.4K  +$420/s | Clean Data 500 -5/s | Compute 18/25 | Power 64/100 | Heat 72% | Research 120
```

## 5. Node Palette

Sol panel.

Özellikler:

- Category tabs.
- Search.
- Favorites.
- Recently used.
- Locked node'ları gri gösterme.
- Unlock requirement tooltip'i.
- Drag-to-place.
- Click-to-place mode.

Kategoriler:

- Data
- Processing
- Routing
- Output
- Infrastructure
- Security
- Automation
- Crypto
- Cyber Ops
- AI
- Energy

MVP kategorileri:

- Data
- Processing
- Output
- Infrastructure
- Research

## 6. Graph Canvas

Ana oyun alanı.

Özellikler:

- Pan.
- Zoom.
- Select.
- Multi-select.
- Drag node.
- Connect ports.
- Delete selection.
- Edge flow animation.
- Node status color.
- Grid snap optional.

### 6.1. Mouse controls

- Left click node: select.
- Drag node: move.
- Drag from output port: start connection.
- Release on input port/node: connect.
- Right click node: context menu.
- Mouse wheel: zoom.
- Middle drag / space + drag: pan.
- Delete: delete selected.
- Ctrl/Cmd+Z: undo.
- Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z: redo.
- Ctrl/Cmd+C: copy.
- Ctrl/Cmd+V: paste.

### 6.2. Mobile controls, future

- One finger tap: select.
- Long press: context menu.
- Drag handle: move node.
- Two finger: pan/zoom.
- Large ports.
- UI scale.
- Left-handed mode.

## 7. NodeView

Her node kartı şu bilgileri göstermelidir:

- Node name.
- Level.
- Status indicator.
- Main output rate.
- Mini bottleneck icon.
- Input/output ports.

Örnek node:

```text
┌──────────────────┐
│ Cleaner      Lv3 │
│ 5.5 clean/s      │
│ ⚠ Compute limited│
└──────────────────┘
```

## 8. EdgeView

Bağlantılar:

- Resource type'a göre icon veya label gösterebilir.
- Flow animasyonu olmalı.
- Tıkanmış edge kalın/uyarı şeklinde görünmeli.
- Hover'da throughput gösterilmeli.

Tooltip örneği:

```text
Parsed Data
Flow: 6.0/s
Limit: 10.0/s
Status: OK
```

## 9. Inspector Panel

Sağ panel. Seçili node veya edge detaylarını gösterir.

Node inspector:

- Name + description.
- Status explanation.
- Input rates.
- Output rates.
- Buffer/capacity.
- Power/heat/compute usage.
- Upgrade button.
- Buy 1/10/100/Max.
- Relevant automation rules.

Edge inspector:

- From/to node.
- Resource type.
- Current throughput.
- Limit.
- Delete edge button.

## 10. Bottleneck Panel

Alt veya sağ panelde küçük ama sürekli görünür olmalı.

Örnek:

```text
Main Bottleneck: Upload Gateway
Reason: Clean Data input is higher than upload capacity.
Fix ideas:
- Upgrade Upload Gateway.
- Add another Upload Gateway.
- Compress data before upload.
```

Bottleneck paneli oyuncuya direkt tavsiye vermeli ama oyunu otomatik çözmemeli.

## 11. Alerts

Alert türleri:

- Info
- Warning
- Critical
- Opportunity

Alert örnekleri:

- “First contract available.”
- “Heat throttling started.”
- “Crypto price spike.”
- “Trace risk high.”
- “Save failed. Local storage may be full.”

Alert spam önlemek için:

- Aynı alert cooldown kullanmalı.
- Önemsiz alertler log'a düşmeli ama popup olmamalı.
- Critical alertler görünür kalmalı.

## 12. Buy mode

Zorunlu:

- Buy 1
- Buy 10
- Buy 100
- Buy Max

Upgrade butonu cost ve sonuç göstermeli:

```text
Upgrade Cleaner to Lv4
Cost: $1.2K
Effect: +18% throughput, +5% power use
```

## 13. Blueprint UI

M2/M3 sonrası.

Özellikler:

- Selected nodes -> Save Blueprint.
- Name, description, tags.
- Required resources preview.
- Deploy ghost preview.
- Missing unlock warning.
- Blueprint version.
- Optional share code, future.

## 14. Staging Room UI

Late M3/M4 sonrası.

Karşılaştırma ekranı:

```text
Metric              Current       Staging
Money/sec           $12.5K        $18.2K
Research/sec        120           90
Power Load          80%           93%
Heat                65%           88%
Error Rate          3%            1%
```

Butonlar:

- Run 60s simulation.
- Deploy.
- Discard.
- Save as Blueprint.

## 15. Contract Panel

Kontrat listesi:

- Available.
- Active.
- Completed.
- Failed.

Contract card:

- Title.
- Requirements.
- Deadline.
- Reward.
- Risk/penalty.
- Accept button.
- Delivery progress.

Örnek:

```text
Startup Text Cleanup
500 Clean Text Data, Quality 60+
Reward: $25K +3 Reputation
Deadline: 3:00
Progress: 230/500
```

## 16. Side Operations Panel

M3 sonrası.

Göstermeli:

```text
Income Breakdown
Upload Sales        $42K/s   48%
Crypto Mining       $21K/s   24%
AI API              $12K/s   14%
Cloud Rental         $8K/s    9%
Cyber Contracts      $4K/s    5%
```

Risk:

```text
Power Load: 84%
Heat: 71%
Trace Risk: 18%
Market Volatility: High
```

GPU allocation slider:

```text
AI Training     40%
Crypto Mining   30%
Cloud Rental    20%
Inference        10%
```

## 17. Visual style

Çalışma yönü:

- Koyu tema.
- Neon ama aşırı parlak değil.
- Data center / terminal / blueprint estetiği.
- Node'lar okunaklı ve temiz.
- Status renkleri anlamlı.
- Gereksiz cyberpunk karmaşası yok.

Duygu:

- Akıllı.
- Teknik.
- Güvenilir.
- Hafif gizemli.

## 18. Accessibility

Zorunlu hedefler:

- UI scale.
- Keyboard shortcuts.
- Status sadece renkle anlatılmamalı; icon/text de olmalı.
- Contrast yeterli olmalı.
- Animasyon azaltma seçeneği.
- Tooltip delay ayarlanabilir olmalı.

## 19. Onboarding / tutorial

Tutorial oyuncuyu kilitlememeli.

Kural:

- Skippable.
- Step-by-step.
- Her adımda tek yeni konsept.
- Oyuncu yanlış yaparsa nedenini açıkla.

İlk tutorial akışı:

1. Internet Feed yerleştir.
2. Parser yerleştir.
3. Output'u input'a bağla.
4. Cleaner ekle.
5. Upload Gateway ekle.
6. Para akışını gör.
7. CPU Rack ile compute bottleneck çöz.
8. Research Lab aç.

## 20. Mikro metin stili

Metinler kısa, net ve biraz karakterli olmalı.

Örnekler:

- “Data var, kapı dar. Upload Gateway tıkandı.”
- “Compute yetmiyor. CPU Rack ekle veya upgrade yap.”
- “Heat yükseldi. Sistem hız kesiyor.”
- “Bu kontrat hız değil kalite istiyor.”
- “GPU'lar coin kazıyor; AI modeli aç bekliyor.”

## 21. MVP UI kapsamı

M1 için zorunlu:

- Resource bar.
- Basic graph canvas.
- Node palette.
- Node inspector.
- Basic edge rendering.
- Basic bottleneck text.
- Save/load buttons.

M1 kapsam dışı:

- Full blueprint.
- Staging room.
- Mobile UI.
- Full side income panel.
- Advanced animation.

## 22. Done kriteri

UI işi bitmiş sayılmaz, ta ki:

- Oyuncu tutorial olmadan node ekleyip bağlayabiliyorsa.
- Para akışını görebiliyorsa.
- En az bir bottleneck sebebini anlayabiliyorsa.
- Yanlış bağlantıda net hata mesajı alıyorsa.
- Save/load sonrası graph aynı kalıyorsa.
