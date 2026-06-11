# Mimar — Technical Architecture

## 1. Amaç

Bu doküman Mimar'ın önerilen teknik mimarisini tanımlar. Hedef, Codex'in yeni oturumlarda bağlamı kaybetmeden, test edilebilir ve büyüyebilir bir oyun kod tabanı kurabilmesidir.

İlk hedef web tabanlı TypeScript prototiptir. Mimari ileride Steam, desktop wrapper veya mobil port için genişletilebilir olmalıdır.

## 2. Önerilen teknoloji stack'i

### 2.1. M1 prototip

- **Language:** TypeScript
- **Bundler:** Vite
- **UI:** React önerilir
- **State:** Zustand veya Redux Toolkit; küçük prototip için Zustand daha hafif
- **Graph rendering:** SVG/HTML hybrid veya React Flow benzeri yaklaşım
- **Simulation:** Pure TypeScript domain layer
- **Save:** LocalStorage; schema version ile
- **Tests:** Vitest
- **Lint/format:** ESLint + Prettier

### 2.2. Neden TypeScript?

- Codex için okunabilir ve hızlı üretilebilir.
- Web prototip hızlı döner.
- Data-driven config dosyaları kolay test edilir.
- İleride Electron/Tauri veya webview mobile port mümkün olur.

### 2.3. Canvas/SVG tercihi

İlk prototip için SVG/HTML hybrid önerilir:

- Node'lar HTML div olabilir.
- Bağlantılar SVG path olabilir.
- Hitbox ve tooltip yönetimi kolay olur.
- İlk 100-300 node için yeterlidir.

Late-game performansı gerekiyorsa PixiJS/canvas renderer'a geçilebilir.

## 3. Ana mimari prensibi

```text
UI Layer  ->  Game Actions  ->  Simulation Domain  ->  Game State
   ↑                                                    ↓
Selectors  <-  Derived Metrics / Bottlenecks  <-  Tick Results
```

Kurallar:

- UI simulation mantığı içermez.
- Simulation React component'lerine bağlı olmaz.
- Save/load domain state üzerinden yapılır.
- Node tanımları data-driven tutulur.
- Ekonomi değerleri component içine yazılmaz.

## 4. Önerilen klasör yapısı

```text
src/
├── app/
│   ├── App.tsx
│   ├── main.tsx
│   └── providers.tsx
├── game/
│   ├── data/
│   │   ├── nodeDefinitions.ts
│   │   ├── contracts.ts
│   │   ├── research.ts
│   │   ├── economy.ts
│   │   └── coins.ts
│   ├── state/
│   │   ├── types.ts
│   │   ├── initialState.ts
│   │   ├── gameStore.ts
│   │   ├── actions.ts
│   │   └── selectors.ts
│   ├── simulation/
│   │   ├── tick.ts
│   │   ├── flow.ts
│   │   ├── resources.ts
│   │   ├── bottlenecks.ts
│   │   ├── contracts.ts
│   │   ├── crypto.ts
│   │   └── cyber.ts
│   ├── graph/
│   │   ├── validation.ts
│   │   ├── pathfinding.ts
│   │   └── layout.ts
│   ├── save/
│   │   ├── saveGame.ts
│   │   ├── loadGame.ts
│   │   ├── migrations.ts
│   │   └── schema.ts
│   └── commands/
│       ├── commandTypes.ts
│       ├── history.ts
│       └── applyCommand.ts
├── ui/
│   ├── canvas/
│   │   ├── GraphCanvas.tsx
│   │   ├── NodeView.tsx
│   │   ├── EdgeView.tsx
│   │   ├── PortView.tsx
│   │   └── selection.ts
│   ├── panels/
│   │   ├── ResourceBar.tsx
│   │   ├── NodePalette.tsx
│   │   ├── InspectorPanel.tsx
│   │   ├── BottleneckPanel.tsx
│   │   ├── ContractPanel.tsx
│   │   └── SideIncomePanel.tsx
│   ├── components/
│   └── theme/
└── tests/
    ├── simulation/
    ├── graph/
    └── save/
```

## 5. Domain tipleri

### 5.1. GameState

```ts
export type GameState = {
  schemaVersion: number;
  meta: GameMetaState;
  graph: GraphState;
  resources: ResourceState;
  research: ResearchState;
  contracts: ContractState;
  sideOps: SideOperationState;
  settings: GameSettings;
  history?: CommandHistory;
};
```

### 5.2. GraphState

```ts
export type GraphState = {
  nodes: Record<NodeId, NodeInstance>;
  edges: Record<EdgeId, EdgeInstance>;
  selectedNodeIds: NodeId[];
  selectedEdgeIds: EdgeId[];
};
```

### 5.3. NodeInstance

```ts
export type NodeInstance = {
  id: NodeId;
  definitionId: NodeDefinitionId;
  position: Vec2;
  level: number;
  enabled: boolean;
  inputBuffers: Record<ResourceId, number>;
  outputBuffers: Record<ResourceId, number>;
  status: NodeStatus;
  runtime: NodeRuntimeStats;
};
```

### 5.4. EdgeInstance

```ts
export type EdgeInstance = {
  id: EdgeId;
  fromNodeId: NodeId;
  fromPortId: PortId;
  toNodeId: NodeId;
  toPortId: PortId;
  throughputLimit: number;
  resourceType: ResourceId;
};
```

### 5.5. NodeDefinition

```ts
export type NodeDefinition = {
  id: NodeDefinitionId;
  name: string;
  category: NodeCategory;
  description: string;
  baseCost: number;
  costGrowth: number;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  baseStats: NodeStats;
  upgradeScaling: Partial<NodeStats>;
  unlockRequirements?: UnlockRequirement[];
};
```

## 6. Resource model

```ts
export type ResourceState = {
  balances: Record<ResourceId, number>;
  rates: Record<ResourceId, number>;
  capacities: Record<ResourceId, number>;
  usage: Record<ResourceId, number>;
};
```

İlk resource id'leri:

- `money`
- `rawData`
- `parsedData`
- `cleanData`
- `compute`
- `research`
- `power`
- `heat`
- `gpu`
- `bandwidth`
- `storage`
- `reputation`
- `trust`
- `trace`

MVP'de sadece `money`, `rawData`, `parsedData`, `cleanData`, `compute`, `research` zorunludur.

## 7. Simulation tick

### 7.1. Tick rate

Öneri:

```text
simulation: 10 ticks/sec
ui display: requestAnimationFrame
rate display: rolling 1-second average
```

### 7.2. Tick sırası

```text
1. Reset per-tick rates.
2. Collect node capacities.
3. Apply global constraints: compute, power, heat.
4. Produce source outputs.
5. Process node transformations.
6. Move resources along edges.
7. Resolve output/sales/research nodes.
8. Update contracts and side operations.
9. Calculate bottlenecks.
10. Commit state.
```

### 7.3. Determinism

Simulation mümkün olduğunca deterministic olmalıdır. Random eventler seeded RNG ile çalışmalıdır. Böylece test ve replay kolaylaşır.

## 8. Flow modeli

İlk versiyonda continuous flow kullanılmalıdır. Her resource sayısal miktardır. Tek tek dosya objesi simülasyonu yapılmaz.

Örnek transformation:

```ts
Parser:
consume rawData up to 8/sec
consume compute up to 2
produce parsedData at consumedRawData * 1.0
```

Cleaner:

```ts
consume parsedData up to 6/sec
consume compute up to 3
produce cleanData at consumedParsedData * 0.92
increase quality metric later
```

## 9. Graph validation

Bağlantı kuralları:

- Output port -> input port olmalı.
- Port resource type uyumlu olmalı.
- Aynı node kendine bağlanmamalı; ileride özel feedback node hariç.
- Input port kapasitesi doluysa bağlantı reddedilebilir veya uyarı verilir.
- Bir input port çoklu bağlantı destekliyorsa definition'da belirtilir.

Fonksiyon:

```ts
validateConnection(graph, from, to): ConnectionValidationResult
```

Result:

```ts
type ConnectionValidationResult =
  | { ok: true }
  | { ok: false; reason: 'same_node' | 'invalid_direction' | 'resource_mismatch' | 'port_full' | 'cycle_not_allowed' };
```

## 10. Command history / undo redo

Undo/redo baştan state modeline uygun tasarlanmalıdır.

Command örnekleri:

- `PlaceNodeCommand`
- `MoveNodeCommand`
- `DeleteNodeCommand`
- `ConnectNodesCommand`
- `DisconnectEdgeCommand`
- `UpgradeNodeCommand`
- `PasteBlueprintCommand`

Her command:

```ts
type Command = {
  id: string;
  type: CommandType;
  timestamp: number;
  apply(state: GameState): GameState;
  revert(state: GameState): GameState;
};
```

Implementation'da function object yerine serializable command data + reducer tercih edilebilir.

## 11. Save/load mimarisi

Save dosyası her zaman `schemaVersion` içermeli.

```ts
type SaveGame = {
  schemaVersion: number;
  savedAt: string;
  gameState: PersistedGameState;
};
```

Kaydedilmeyecek runtime alanları:

- transient hover state
- UI modal state
- current drag operation
- rolling debug metrics

Yüklendikten sonra runtime alanları yeniden hesaplanır.

Migration:

```ts
const migrations: Record<number, (save: unknown) => unknown> = {
  0: migrateV0ToV1,
  1: migrateV1ToV2,
};
```

## 12. Data-driven config

Node, contract, research ve coin definition'ları mümkün olduğunca config olarak tutulmalıdır.

Başlangıç:

- `src/game/data/nodeDefinitions.ts`
- `specs/node-catalog.v0.json`

İleride:

- JSON schema validation.
- Internal balancing tool.
- Hot reload dev panel.

## 13. Bottleneck sistemi

Her tick sonunda node runtime stats hesaplanır:

```ts
type NodeRuntimeStats = {
  inputRate: Record<ResourceId, number>;
  outputRate: Record<ResourceId, number>;
  utilization: number;
  bottleneckReason?: BottleneckReason;
  effectiveThroughput: number;
};
```

Bottleneck reason:

- `input_starved`
- `output_blocked`
- `compute_limited`
- `power_limited`
- `heat_throttled`
- `storage_full`
- `network_limited`

UI'da bu reason sade metne çevrilir.

## 14. Contracts architecture

Contract definition:

```ts
type ContractDefinition = {
  id: string;
  title: string;
  tier: number;
  requirements: ContractRequirement[];
  deadlineSeconds?: number;
  rewards: Reward[];
  penalties?: Penalty[];
  unlockRequirements?: UnlockRequirement[];
};
```

Contract runtime:

```ts
type ActiveContract = {
  definitionId: string;
  acceptedAt: number;
  progress: Record<string, number>;
  status: 'active' | 'completed' | 'failed';
};
```

## 15. Side operations architecture

Side ops ayrı modül olmalı:

```ts
type SideOperationState = {
  crypto: CryptoState;
  cyber: CyberState;
  cloudRental: CloudRentalState;
  aiApi: AiApiState;
};
```

M1'de boş/default state yeterlidir. M3'te crypto/cyber gerçeklenir.

## 16. Rendering architecture

### 16.1. GraphCanvas

Sorumluluk:

- Pan/zoom.
- Selection.
- Drag node.
- Start/end connection.
- Render nodes/edges.

Simulation mantığı yoktur.

### 16.2. NodeView

Sorumluluk:

- Node label.
- Level.
- Status color.
- Input/output portlar.
- Mini rate display.

### 16.3. EdgeView

Sorumluluk:

- Path çizimi.
- Flow animation.
- Throughput state.
- Invalid/blocked style.

## 17. UI state ile game state ayrımı

Game state save edilir. UI state genelde edilmez.

UI state örnekleri:

- selected tab
- hovered node
- drag preview
- open modal
- camera position

Camera position save edilebilir ama game simulation için gerekli değildir.

## 18. Testing strategy

### 18.1. Unit tests

- Node definitions valid.
- Connection validation.
- Tick production.
- Resource consumption.
- Bottleneck reason.
- Save/load roundtrip.

### 18.2. Integration tests

- Internet Feed -> Parser -> Cleaner -> Upload Gateway para üretir.
- Compute yetersizse parser/cleaner throttled olur.
- Edge resource mismatch reddedilir.

### 18.3. UI smoke tests

İlk aşamada manuel yeterli olabilir:

- Node ekle.
- Node sürükle.
- Port bağla.
- Para akıyor mu gör.
- Save/load sonrası graph duruyor mu gör.

## 19. Performance planı

İlk 500 node hedefi için:

- Derived selector'lar memoized olmalı.
- Tick state update'leri batched olmalı.
- Edge path hesapları sadece position değişince yapılmalı.
- Runtime stats ayrı map'te tutulabilir.

Late-game için:

- Web worker simulation.
- Canvas renderer.
- Chunked graph simulation.
- LOD rendering.

## 20. Error handling

- Save parse error kullanıcıya yumuşak gösterilir.
- Invalid node definition dev modda açık hata verir.
- Runtime NaN/Infinity guard eklenir.
- Negative resource balances mümkün olduğunca engellenir.

## 21. Accessibility

- UI scale.
- Colorblind-safe status indicators.
- Keyboard shortcuts.
- Tooltip ve text açıklamaları.
- High contrast mode.

## 22. Localization hazırlığı

Oyuncuya görünen metinler ileride key tabanlı olmalıdır.

Örnek:

```ts
nameKey: 'node.internetFeed.name'
descriptionKey: 'node.internetFeed.description'
```

MVP'de doğrudan İngilizce/Türkçe string kullanılabilir ama refactor notu backlog'a eklenmelidir.

## 23. İlk Codex implementation planı

1. Vite + TypeScript + React kur.
2. Domain type'larını oluştur.
3. İlk nodeDefinitions config'ini ekle.
4. Initial game state oluştur.
5. Graph actions: add node, move node, connect node.
6. Connection validation yaz.
7. Tick simulation yaz.
8. Resource bar ve graph canvas UI yaz.
9. Save/load ekle.
10. Tests ekle.
11. Decision log güncelle.

## 24. Teknik borç listesi

Başta kabul edilebilir ama not alınmalı:

- SVG renderer late-game için değişebilir.
- Economy values placeholder.
- Localization henüz yok.
- Full undo/redo M2'ye kalabilir.
- Blueprint M2/M3'e kalabilir.
- Crypto/cyber M3'e kalabilir.

## 25. Karar güncelleme kuralı

Bu dokümandaki her büyük karar `docs/DECISION_LOG.md` içine tarih ve gerekçeyle yazılmalıdır.
