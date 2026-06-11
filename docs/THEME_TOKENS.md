# Mimar — Theme Tokens

This file defines the visual tokens Codex and designers must use. Do not invent new colors or spacing unless this file is updated first.

## Visual direction

Mimar uses a dark technical interface: data center, blueprint grid, soft neon, glass panels, and readable dashboard UI.

Keywords:

- dark grid
- technical premium
- calm neon
- data flow
- living infrastructure
- readable at a glance

Avoid:

- casino neon
- cartoon UI
- noisy cyberpunk clutter
- generic admin dashboard
- bright white backgrounds
- excessive gradients

## Color tokens

### Background

| Token | Hex | Use |
|---|---:|---|
| `bg.void` | `#05070D` | App background |
| `bg.grid` | `#08111E` | Canvas base |
| `bg.panel` | `#0C1320` | Side panels |
| `bg.panelRaised` | `#111B2B` | Cards and modals |
| `bg.node` | `#101A2A` | Default node body |
| `bg.nodeHover` | `#17243A` | Hovered node |

### Text

| Token | Hex | Use |
|---|---:|---|
| `text.primary` | `#EAF2FF` | Main labels |
| `text.secondary` | `#9FB0C7` | Metadata |
| `text.muted` | `#617086` | Disabled or quiet text |
| `text.inverse` | `#06101C` | Text on bright accents |

### Accents

| Token | Hex | Use |
|---|---:|---|
| `accent.data` | `#31D7FF` | Data flow, primary action |
| `accent.clean` | `#57E6A5` | Clean data, success |
| `accent.research` | `#9D7CFF` | Research and upgrades |
| `accent.crypto` | `#F6C84C` | Crypto/mining themed UI |
| `accent.ai` | `#C9F3FF` | AI systems |
| `accent.security` | `#FF5ED1` | Security/cyber themed UI |
| `accent.contract` | `#6EE7F9` | Contracts and clients |

### Status

| Token | Hex | Use |
|---|---:|---|
| `status.running` | `#57E6A5` | Healthy running |
| `status.idle` | `#617086` | Waiting or disabled |
| `status.warning` | `#F6A94C` | Bottleneck or near limit |
| `status.critical` | `#FF5C6C` | Failure or severe issue |
| `status.locked` | `#7E8797` | Locked feature |

### Lines and borders

| Token | Hex | Use |
|---|---:|---|
| `line.subtle` | `#1A2A3D` | Panel borders |
| `line.strong` | `#2C4663` | Active borders |
| `line.gridMajor` | `#132238` | Major grid lines |
| `line.gridMinor` | `#0D1A2C` | Minor grid lines |

## Gradients

Use gradients sparingly.

| Token | Value |
|---|---|
| `gradient.panel` | `linear-gradient(180deg, #111B2B 0%, #0C1320 100%)` |
| `gradient.nodeActive` | `linear-gradient(135deg, rgba(49,215,255,.18), rgba(157,124,255,.10))` |
| `gradient.danger` | `linear-gradient(135deg, rgba(255,92,108,.18), rgba(246,169,76,.10))` |

## Typography

Use a clean sans font for UI and a mono font for rates, IDs, and terminal-like readouts.

Preferred families:

- UI sans: Inter, Sora, or system sans.
- Mono: IBM Plex Mono, JetBrains Mono, or system mono.

Rules:

- Node names: 13-14 px, semibold.
- Resource bar numbers: 13 px mono.
- Panel headings: 14-16 px, semibold.
- Body text: 13-14 px.
- Tiny metadata: 11-12 px.

## Spacing

Use an 8 px grid.

| Token | Value |
|---|---:|
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.5` | 24 px |
| `space.6` | 32 px |

## Radius

| Token | Value | Use |
|---|---:|---|
| `radius.sm` | 6 px | Small buttons, tags |
| `radius.md` | 10 px | Nodes and cards |
| `radius.lg` | 14 px | Panels and modals |
| `radius.xl` | 20 px | Major overlays |

## Shadows and glow

Use glow as feedback, not decoration everywhere.

| Token | Value | Use |
|---|---|---|
| `shadow.panel` | `0 16px 40px rgba(0,0,0,.35)` | Raised panels |
| `glow.data` | `0 0 18px rgba(49,215,255,.35)` | Active data flow |
| `glow.warning` | `0 0 18px rgba(246,169,76,.35)` | Bottleneck |
| `glow.critical` | `0 0 22px rgba(255,92,108,.38)` | Critical state |

## Layout sizes

Desktop target: 1440 x 900.

| Area | Size |
|---|---:|
| Top resource bar | 56 px height |
| Left node library | 280 px width |
| Right inspector | 340 px width |
| Bottom action bar | 48 px height |
| Node min width | 180 px |
| Node default height | 92 px |
| Port hitbox | 16-20 px |

## Component state rules

Every interactive component must have:

- default state
- hover state
- active/selected state
- disabled/locked state
- warning state if relevant

Status must never rely on color alone. Use label, icon, or tooltip too.
