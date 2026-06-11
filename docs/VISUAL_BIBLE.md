# Mimar — Visual Bible

This is the main visual design bible for Mimar. Codex, Figma designers, and future UI reviewers must treat this file as the source of truth for the look and feel of the game.

## 1. Visual promise

Mimar should look like the player is controlling a living digital infrastructure map: part data center, part blueprint, part command deck.

The player should feel:

- “I am designing a real system.”
- “I can read what is happening at a glance.”
- “The network is alive.”
- “This is technical, but not confusing.”
- “Every panel has a purpose.”

## 2. Core visual direction

Style phrase:

> Dark data-center blueprint with calm neon data flow.

Keywords:

- premium technical UI
- dark grid canvas
- glassy node cards
- animated data streams
- readable controls
- restrained neon accents
- futuristic but practical

Avoid:

- generic SaaS dashboard
- mobile idle game clutter
- bright cartoon colors
- heavy skeuomorphism
- random glowing effects
- tiny unreadable text
- fake terminal spam

## 3. First impression

When the player opens the game, the first readable impression should be:

> A quiet machine is waiting to be built.

The starting screen should not feel empty in a bad way. The canvas is mostly empty, but guided by a clear objective, a small node library, and a faint grid.

The player sees:

- Top resource bar.
- Left node library.
- Main grid canvas.
- Right inspector panel.
- Bottom objective and alert strip.

The game should immediately invite the player to place the first node.

## 4. Visual hierarchy

Priority order on screen:

1. Canvas and active data flow.
2. Current objective or critical bottleneck.
3. Resource rates.
4. Selected node details.
5. Node library.
6. Secondary menus.

Do not let side panels dominate the screen. The canvas is the star.

## 5. Main screen composition

Desktop target: 1440 x 900.

```text
┌──────────────────────────────────────────────────────────────┐
│ Top Resource Bar                                             │
├───────────────┬───────────────────────────────┬──────────────┤
│ Node Library  │ Main Canvas                    │ Inspector    │
│               │                               │              │
│ Categories    │ Node graph and data flows      │ Selected     │
│ Search        │                               │ node/edge    │
│ Favorites     │                               │ details      │
├───────────────┴───────────────────────────────┴──────────────┤
│ Objective | Bottleneck | Alerts | Buy Mode | Undo | Save      │
└──────────────────────────────────────────────────────────────┘
```

Default panel sizes:

- Top bar: 56 px height.
- Left library: 280 px width.
- Right inspector: 340 px width.
- Bottom strip: 48 px height.

The center canvas should always have the largest visual weight.

## 6. Canvas visual design

The canvas is a dark technical grid.

Elements:

- Deep navy-black base.
- Subtle minor grid lines.
- Slightly stronger major grid lines.
- Optional radial vignette around active graph.
- No decorative noise that reduces readability.

Canvas mood:

- quiet when empty.
- alive when data is flowing.
- tense when bottlenecks appear.

The canvas background should never fight with node text.

## 7. Node visual design

Nodes are compact glass/metal cards.

Default node anatomy:

```text
┌────────────────────────┐
│ Cleaner            Lv3 │
│ Clean Data             │
│ 5.5/s        Running   │
│ ● in           out ●   │
└────────────────────────┘
```

Required node elements:

- Name.
- Level.
- Category accent strip or icon.
- Main rate.
- Status label/icon.
- Input/output ports.

Node sizes:

- Default width: 180 px.
- Default height: 92 px.
- Compact mode allowed at high zoom-out.

Node states:

- Default.
- Hovered.
- Selected.
- Running.
- Idle.
- Bottleneck warning.
- Critical.
- Locked.

Selected node should glow softly, not aggressively.

## 8. Node category visual language

| Category | Accent | Visual feeling |
|---|---|---|
| Data Source | Cyan | Origin / signal |
| Processing | Blue-green | Transformation |
| Routing | Light blue | Direction / traffic |
| Output | Soft green | Value / revenue |
| Infrastructure | Steel blue | Capacity / hardware |
| Research | Violet | Discovery |
| Contracts | Cyan-white | Client delivery |
| Crypto | Gold | Market / mining |
| Security | Magenta-violet | Risk / defense |
| AI | Pale blue-white | Model / intelligence |
| Energy | Amber-green | Power / heat |
| Automation | Purple-blue | Control / rules |

## 9. Ports

Ports must be easy to click.

Rules:

- Visible dot size: 8-10 px.
- Click hitbox: 16-20 px.
- Input ports on left.
- Output ports on right.
- Multi-port nodes may stack ports vertically.
- Hovering a port shows resource type.
- Dragging from a port previews a curved connection.

Invalid target feedback must be immediate and readable.

## 10. Connections and data flow

Connections are animated curved lines.

Flow visuals:

- Small moving particles or pulses.
- Pulse speed reflects throughput.
- Line brightness reflects utilization.
- Bottleneck lines shift toward warning color.
- Blocked lines pulse slowly or show a broken segment.

Connection rules:

- Lines should curve smoothly.
- Avoid sharp angular spaghetti early.
- Edge labels appear on hover, not always.
- Selected edge gets a stronger outline.

Connection color by resource:

- Raw data: muted cyan-gray.
- Parsed data: cyan.
- Clean data: soft green.
- Money: green-gold.
- Research: violet.
- Compute/GPU: blue-white.
- Crypto coin: gold.
- AI output: pale blue-white.

## 11. Top resource bar

The top bar is the player's dashboard.

It shows compact values:

```text
$12.4K +$420/s | Clean 500 -5/s | Compute 18/25 | Power 64/100 | Heat 72% | Research 120
```

Rules:

- Use mono font for numbers.
- Use icons sparingly.
- Positive rates use subtle success tint.
- Negative rates use warning tint only when important.
- Critical resources can gently pulse.

M1 resources:

- Money.
- Raw Data.
- Parsed Data.
- Clean Data.
- Compute.
- Research.

Later resources:

- Power.
- Heat.
- GPU.
- Storage.
- Bandwidth.
- Reputation.
- Trust.
- Trace.

## 12. Left node library

The node library is a tool shelf, not a marketplace popup.

Sections:

- Search.
- Category tabs.
- Available nodes.
- Locked nodes.
- Favorites later.

Node list item:

```text
Internet Feed
Produces raw data
Cost: Free
```

Locked node item:

```text
GPU Cluster
Unlock: GPU Compute research
```

Rules:

- Never hide unlock requirements.
- Drag-to-place and click-to-place both acceptable.
- Recently used nodes may appear at the top after M2.

## 13. Right inspector panel

The inspector answers:

- What is selected?
- What is it doing?
- Why is it slow?
- How can I improve it?

Inspector sections:

1. Header: name, level, status.
2. Description.
3. Live rates.
4. Bottleneck reason.
5. Upgrade preview.
6. Actions.

Upgrade preview example:

```text
Upgrade to Lv4
Cost: $1.2K
Effect: +18% throughput, +5% power use
```

## 14. Bottom strip

The bottom strip is for immediate guidance.

Segments:

- Current objective.
- Main bottleneck.
- Important alert.
- Buy mode.
- Undo/redo.
- Save status.

Example:

```text
Objective: Build your first pipeline | Bottleneck: Parser needs compute | Buy: 1 | Undo | Saved
```

Keep it short. It should not become a chat log.

## 15. Menus

Menu style:

- Slide-over panels for medium menus.
- Center modal only for big decisions.
- Tabs inside panels when necessary.
- Avoid nested modal chains.

Primary menus:

- Main Canvas.
- Contracts.
- Research.
- Side Operations.
- Blueprints.
- Staging Room.
- Settings.

Navigation should feel like switching control decks, not opening separate apps.

## 16. Market and store visual language

There are two different concepts:

1. In-game node/upgrade market.
2. Optional cosmetic/premium store, later.

The in-game market must feel like a supply catalog for infrastructure parts.

The optional real-money store must never visually blend with gameplay progression. It should be separated and clearly cosmetic/supporter only.

## 17. Empty states

Empty states should teach, not shame.

Examples:

- Empty canvas: “Place Internet Feed to start receiving raw data.”
- Empty inspector: “Select a node to inspect its flow.”
- Empty contracts: “Build reputation to attract clients.”
- Empty research: “Route clean data into Research Lab.”

## 18. Tone of UI copy

Short, clear, slightly characterful.

Good:

- “Data is flowing.”
- “Compute is the bottleneck.”
- “Your upload gateway is full.”
- “This contract wants quality, not speed.”

Avoid:

- Long paragraphs.
- Fake hacker slang.
- Joke overload.
- Technical words without explanation.

## 19. Motion style

Motion should explain state.

Use motion for:

- Data flow direction.
- Node activation.
- Bottleneck warning.
- Resource increase.
- Successful contract completion.
- Save confirmation.

Avoid motion for:

- Constant panel wobble.
- Decorative loops everywhere.
- Distracting background animation.

## 20. Figma design goal

Figma should produce:

- Main canvas screen.
- First 10-minute gameplay screen state.
- Node component states.
- Inspector panel.
- Node library.
- Contract market.
- Research tree.
- Side operations panel.
- Settings and modal style.

All Figma designs must use `docs/THEME_TOKENS.md`.

## 21. Codex implementation rule

Codex must not invent visual design. It must implement the specs in:

- `docs/THEME_TOKENS.md`
- `docs/VISUAL_BIBLE.md`
- `docs/SCREEN_FLOW.md`
- `docs/UI_COMPONENT_SPEC.md`
- `docs/MARKET_STORE_SPEC.md`
- `docs/MOTION_AND_FEEDBACK.md`

If a UI decision is missing, Codex must add a TODO and stop rather than inventing a new design direction.
