# Mimar — Market and Store Specification

This document defines the visual and UX rules for all purchase-related screens in Mimar.

There are two separate concepts:

1. **In-game Infrastructure Catalog** — gameplay purchases using in-game resources.
2. **Cosmetic / Premium Store** — optional future real-money area, strictly separated from gameplay power.

Codex and Figma must not mix these two concepts.

## 1. Design principle

The player should feel like they are buying infrastructure parts for a growing digital system, not opening a noisy mobile shop.

Market feeling:

- technical catalog
- clean upgrade bench
- infrastructure procurement dashboard
- clear costs and tradeoffs
- no pressure tricks

Avoid:

- popups asking for purchases
- flashing sales banners
- fake urgency
- loot boxes
- confusing premium currencies
- store UI that looks like gameplay progression

## 2. In-game Infrastructure Catalog

The normal in-game market lives mainly inside the Node Library.

Player uses it to buy:

- Data source nodes.
- Processing nodes.
- Output nodes.
- Infrastructure nodes.
- Research nodes or unlocks.
- Later: crypto, AI, energy, security, and automation nodes.

## 3. Node Library as market

Default purchase path:

```text
Node Library -> choose category -> drag or click node -> place on canvas
```

This should feel direct and physical. The player buys by placing infrastructure, not by visiting a shop page.

Node Library card anatomy:

```text
Node Name
Short use case
Cost
Unlock requirement, if locked
```

Example:

```text
CPU Rack
Adds compute capacity
Cost: $200
```

Locked example:

```text
GPU Cluster
Unlock: GPU Compute research
```

## 4. Advanced Catalog View

Later, an expanded catalog may exist for advanced players.

Use cases:

- Compare node stats.
- Search many nodes.
- See unlock requirements.
- Preview power, heat, compute, and throughput impact.

Layout:

```text
┌────────────────────────────────────────────────────┐
│ Infrastructure Catalog                              │
├───────────────┬────────────────────────────────────┤
│ Categories    │ Node cards / comparison list        │
│ Search        │                                    │
└───────────────┴────────────────────────────────────┘
```

Advanced card anatomy:

```text
GPU Cluster
Infrastructure
Cost: $2.5K
Provides: +10 GPU
Costs: 12 Power, 10 Heat
Use: Mining, AI, cloud rental
[Place]
```

Rules:

- Show benefits and costs together.
- Show unlock reason.
- Show if the node will create a likely bottleneck.
- Do not hide power or heat costs once those systems are unlocked.

## 5. Upgrade UI

Upgrades are not a separate store. They live in the Inspector.

Upgrade block anatomy:

```text
Upgrade to Lv4
Cost: $1.2K
Effect: +18% throughput, +5% power use
[Upgrade]
```

Buy mode:

- Buy 1
- Buy 10
- Buy 100
- Buy Max

Rules:

- Preview total cost.
- Preview final level.
- Do not allow overspending.
- Show downside if upgrade increases power, heat, or compute use.

## 6. Research as unlock market

Research is a tech tree, not a shop.

Player spends research to unlock:

- New node categories.
- Global upgrades.
- Automation features.
- New business systems.

Research node anatomy:

```text
Routing Basics
Cost: 100 Research
Unlocks: Router, Splitter
```

Rules:

- Locked paths remain visible.
- Requirements are clear.
- Purchased nodes glow softly.
- Do not use mystery boxes.

## 7. Contract Market

Contracts are client opportunities, not items for sale.

Contract Deck layout:

- Available contracts.
- Active contracts.
- Completed contracts.
- Locked higher-tier clients.

Contract card anatomy:

```text
Startup Text Cleanup
Deliver: 500 Clean Data
Quality: 60+
Reward: $25K + Reputation
Deadline: 03:00
[Accept]
```

Rules:

- Contract risk and deadline must be clear.
- Rewards and penalties must be visible before accepting.
- Active contract progress should appear in bottom strip.

## 8. Side Operation Market

Side operations are not free rewards. They are business opportunities with resource costs.

Examples:

- Mining route.
- Security contract.
- Cloud rental slot.
- AI API plan.
- Energy sale contract.

Side operation card anatomy:

```text
HashLite Mining Route
Uses: 30% GPU, +Heat
Output: Coin income
Risk: Market volatility
[Activate]
```

Rules:

- Always show opportunity cost.
- Show affected resource pool.
- Show impact on main pipeline if possible.
- Do not present side income as a simple claim button.

## 9. Blueprint Library

Blueprints are saved designs, not purchases.

Blueprint card anatomy:

```text
Clean Text Factory v3
Nodes: 8
Requires: $12K, 20 Compute
Output: 120 Clean Data/s
[Deploy]
```

States:

- Ready.
- Missing resources.
- Missing unlocks.
- Outdated version.

Rules:

- Deploy preview required.
- Missing requirements must be clear.
- Blueprint thumbnails should show mini graph shape.

## 10. Cosmetic / Premium Store, future

If a real-money store is ever added, it must be separate from gameplay progression.

Allowed:

- Theme packs.
- Node skins.
- Backgrounds.
- Music packs.
- Supporter badge.

Not allowed:

- Money.
- Research.
- Speed boost.
- Offline boost.
- Better nodes.
- Risk reduction.
- Power or heat advantage.
- Contract advantage.

## 11. Cosmetic Store visual rules

The cosmetic store must be calm and clearly optional.

It should not look like:

- gameplay upgrade screen
- contract market
- resource purchase panel
- limited-time pressure shop

Cosmetic card anatomy:

```text
Neon Blueprint Theme
Cosmetic canvas theme
Preview
[Owned / Purchase]
```

Rules:

- Always label cosmetics as cosmetic.
- Always allow preview.
- Do not interrupt gameplay.
- Do not use fake scarcity.

## 12. Market navigation

Primary purchase paths:

- Node purchase: Node Library.
- Node upgrade: Inspector.
- Research unlock: Research Deck.
- Contract accept: Contracts Deck.
- Side operation activation: Side Operations Deck.
- Cosmetic purchase: Optional Store, later.

Do not create a single giant “Shop” that mixes all of these.

## 13. Figma deliverables

Figma should create frames for:

1. Node Library with available and locked node cards.
2. Inspector upgrade block with Buy Max.
3. Advanced Infrastructure Catalog.
4. Contract Deck with available, active, completed, and locked cards.
5. Research Deck purchase state.
6. Side Operations opportunity cards.
7. Blueprint Library cards.
8. Optional Cosmetic Store mockup.

## 14. Codex implementation rule

Codex must implement only the gameplay market surfaces required by the active milestone.

M1:

- Node Library.
- Basic Inspector upgrade placeholder.

M2:

- Upgrade UX.
- Research Deck.
- Contract Deck.

M3:

- Side Operations Deck.

M5:

- Blueprint Library.

Cosmetic Store is future only and must not be implemented unless explicitly requested.
