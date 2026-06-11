# Mimar — Iconography Specification

This document defines the icon style for Mimar. It is intended for Figma design, future asset creation, and Codex implementation.

## 1. Icon style direction

Icon style should feel technical, precise, and readable.

Keywords:

- thin-line technical icons
- rounded geometry
- blueprint interface
- data center hardware
- calm sci-fi
- simple silhouettes

Avoid:

- cartoon icons
- heavy filled icons everywhere
- overly detailed illustrations
- random emoji-style symbols
- fake hacker skull imagery
- generic marketplace clipart

## 2. Stroke and shape rules

Default icon style:

- 1.5 px or 2 px stroke.
- Rounded stroke caps.
- Rounded joins.
- Simple geometric forms.
- Mostly outline icons.
- Filled accents only for active or critical state.

Default sizes:

- Small UI icon: 16 x 16 px.
- Standard panel icon: 20 x 20 px.
- Large feature icon: 32 x 32 px.
- Empty state icon: 48 x 48 px.

## 3. Icon color rules

Use theme tokens only.

Default:

- `text.secondary`

Active:

- category accent color

Disabled:

- `text.muted`

Critical:

- `status.critical`

Warning:

- `status.warning`

Never use color alone to communicate status. Pair with text, label, or state chip.

## 4. Core resource icons

| Resource | Icon concept | Accent |
|---|---|---|
| Money | stacked credits / value pulse | `accent.clean` |
| Raw Data | small packet / unfiltered signal | muted cyan-gray |
| Parsed Data | bracketed packet / decoded stream | `accent.data` |
| Clean Data | checked packet | `accent.clean` |
| Compute | CPU chip | steel blue |
| GPU | parallel chip / grid core | pale blue |
| Research | branching molecule / spark node | `accent.research` |
| Power | bolt in circuit | amber |
| Heat | thermal wave | warning amber |
| Storage | stacked drives | steel blue |
| Bandwidth | twin arrows / signal line | cyan |
| Reputation | badge / signal rank | cyan-white |
| Trust | shield with check | soft green |
| Trace | scanning ring / alert line | magenta |

## 5. Node category icons

| Category | Icon concept |
|---|---|
| Data Source | antenna / input signal |
| Processing | transform arrows / processor block |
| Routing | forked path / switch |
| Output | upload arrow / gateway |
| Infrastructure | server rack |
| Research | branching tech node |
| Contracts | document with checkmark |
| Crypto | coin in circuit ring |
| Security | shield / scan grid |
| AI | neural cluster |
| Energy | power cell |
| Automation | rule brackets / gear node |
| Blueprint | folded plan / mini graph |
| Staging | split-screen test chamber |

## 6. Node status icons

| Status | Icon concept |
|---|---|
| Running | pulse dot / play signal |
| Idle | pause dot |
| Input Starved | empty inlet |
| Output Blocked | blocked outlet |
| Compute Limited | chip warning |
| Power Limited | bolt warning |
| Heat Throttled | thermal warning |
| Storage Full | filled drive |
| Network Limited | bandwidth warning |
| Locked | lock |
| Error | triangle alert |

## 7. Navigation icons

Main navigation deck icons:

- Canvas: grid with node points.
- Contracts: document/check.
- Research: tech tree branch.
- Side Operations: split flow / secondary route.
- Blueprints: plan sheet / graph stamp.
- Staging Room: lab frame / split graph.
- Settings: sliders.

Navigation icons must be understandable at 16 px.

## 8. Empty state icons

Empty states use larger simple line illustrations.

Examples:

- Empty Canvas: small isolated node on grid.
- Empty Inspector: magnifier over node.
- Empty Contracts: document radar signal.
- Empty Research: locked branch.
- Empty Blueprints: empty plan sheet.

Rules:

- No sad faces.
- No mascot required.
- Empty state icons should teach the next action.

## 9. Icon states

Every reusable icon must support:

- default
- hover
- active
- disabled
- warning
- critical

Hover can brighten stroke by 10-15%.

Active can use category accent and subtle glow.

## 10. Figma deliverables

Figma should create an icon component set with variants:

- Resource icons.
- Category icons.
- Status icons.
- Navigation icons.
- Action icons.

Each icon should be named with this pattern:

```text
Icon / Category / DataSource
Icon / Resource / CleanData
Icon / Status / ComputeLimited
Icon / Action / Save
```

## 11. Codex implementation rule

Codex may use placeholder SVG icons during early implementation, but icon names and component structure must match this spec. Final icon paths can be replaced later from Figma exports.
