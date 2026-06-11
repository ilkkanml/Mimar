# Mimar — Visual Direction Alternatives

This document defines three possible visual directions for Mimar before final Figma production. The purpose is to choose one dominant direction, not to mix all three randomly.

All three directions must still follow:

- `docs/THEME_TOKENS.md`
- `docs/VISUAL_BIBLE.md`
- `docs/UI_COMPONENT_SPEC.md`
- `docs/SCREEN_FLOW.md`
- `docs/MOTION_AND_FEEDBACK.md`

## Decision rule

Pick one primary direction for the first Figma pass.

Recommended choice for Mimar:

> Direction A — Blueprint Control Room

Reason: It best supports readability, node graph clarity, technical identity, and long-session play.

Direction B and C can inspire accent details, but they should not override the main direction unless the design review explicitly chooses them.

---

# Direction A — Blueprint Control Room

## Summary

A calm, precise, technical blueprint interface. The player feels like they are designing and operating a real infrastructure diagram.

This is the safest and strongest direction for Mimar.

## Keywords

- blueprint grid
- command room
- technical diagram
- calm neon
- system architecture
- readable nodes
- focused control surface

## Emotional target

The player should feel:

> “I am an infrastructure architect controlling a live system.”

Not chaotic. Not flashy. Smart and readable.

## Visual composition

- Dark navy-black canvas.
- Fine grid lines.
- Clean node cards with thin accent borders.
- Edges are elegant and readable.
- Panels feel like blueprint tool drawers.
- Most of the visual energy is in active data flow.

## Color behavior

Uses the default token set directly:

- Background: `bg.void`, `bg.grid`.
- Primary flow: `accent.data`.
- Clean data / revenue: `accent.clean`.
- Research: `accent.research`.
- Warnings: `status.warning`.

Accent colors stay controlled. No full-screen glow floods.

## Node style

Nodes are compact technical cards.

Shape:

- 180 x 92 px default.
- 10 px radius.
- Thin border.
- Small top accent strip.
- Clear level and status chip.

Visual example:

```text
┌────────────────────────┐
│ Cleaner            Lv3 │
│ Clean Data             │
│ 5.5/s        Running   │
│ ● in           out ●   │
└────────────────────────┘
```

## Edge style

- Thin curved lines.
- Small moving particles.
- Hover reveals labels.
- Saturated edges brighten but remain controlled.
- Bottleneck edges pulse amber.

## Menus

Menus feel like technical side panels:

- Node Library = parts shelf.
- Inspector = diagnostic panel.
- Contracts = client work deck.
- Research = blueprint tech map.
- Side Operations = secondary operations deck.

## Best for

- Readability.
- Long sessions.
- Serious automation feel.
- Figma-to-Codex implementation.
- Avoiding visual chaos.

## Risks

- Could feel too dry if motion and feedback are underdone.
- Needs subtle life in data flow to avoid feeling static.

## How to fix risks

- Add elegant flow particles.
- Use small node activity pulses.
- Make first revenue moment visually satisfying.
- Give completed objectives a polished but short success animation.

## Figma instruction

For this direction, prioritize:

1. Graph readability.
2. Panel clarity.
3. Beautiful but restrained data flow.
4. Strong selected/bottleneck states.
5. Blueprint-style research and blueprint library.

---

# Direction B — Neon Data Center

## Summary

A more energetic, glowing, sci-fi data center style. The player feels like the system is alive, powerful, and high-energy.

This direction is more visually exciting but has higher risk of clutter.

## Keywords

- neon data streams
- dark server room
- glowing hardware
- energetic flow
- cyber infrastructure
- living machine

## Emotional target

The player should feel:

> “I built a powerful machine that is humming with energy.”

## Visual composition

- Dark background with deeper shadows.
- Stronger glow around active nodes.
- Brighter data-flow particles.
- More pronounced resource category colors.
- Side panels still clean, but canvas is more animated.

## Color behavior

- Cyan and green are brighter.
- Crypto gold is more visible.
- Research violet has stronger glow.
- Warnings are more dramatic.

Must still avoid casino-like overglow.

## Node style

Nodes feel like hardware modules:

- Slightly thicker borders.
- More internal glow.
- Active nodes have subtle illuminated corners.
- Category accent more visible.

## Edge style

- More visible animated particles.
- Higher contrast active lines.
- Flow density can look more alive.
- Major pipelines may glow like fiber optic cables.

## Menus

Menus should still be readable but can feel more like a live ops terminal.

- Side Operations looks especially strong in this direction.
- Crypto/mining and AI panels benefit from stronger glow.

## Best for

- Marketing screenshots.
- Player excitement.
- Side operations and late-game energy.
- Strong visual identity.

## Risks

- Can become noisy.
- Node text readability can suffer.
- Long sessions may fatigue the player.
- Codex may overdo effects if not constrained.

## How to fix risks

- Keep panel surfaces calm.
- Limit glow to active/selected/warning states.
- Use reduced motion option.
- Keep edge labels hover-only.

## Figma instruction

For this direction, make two versions of the main canvas:

1. Normal calm state.
2. High activity state.

The high activity state must still be readable.

---

# Direction C — Glass Command Deck

## Summary

A premium glass-panel command interface. The player feels like they are operating a high-end control deck for a global tech company.

This direction is visually polished and modern but can become too dashboard-like if pushed too far.

## Keywords

- glass panels
- executive command deck
- premium SaaS meets sci-fi
- soft blur
- clean cards
- calm control

## Emotional target

The player should feel:

> “I am running a professional digital infrastructure company.”

## Visual composition

- Dark background.
- Raised glassy panels.
- Softer shadows.
- More spacious UI.
- Cleaner typography.
- Less line density.
- Node graph remains central but panels feel more premium.

## Color behavior

- Lower saturation overall.
- Accent colors used as small highlights.
- More reliance on typography, spacing, and glass depth.

## Node style

Nodes are premium floating cards:

- Slight translucency.
- Soft border.
- More padding.
- Cleaner status chips.
- Less visible hardware feel.

## Edge style

- Smooth, minimal lines.
- Particles are subtle.
- Flow feels elegant rather than energetic.

## Menus

This direction is strongest for:

- Inspector.
- Contracts.
- Settings.
- Market/catalog.
- Blueprint library.

It can make the product feel polished quickly.

## Best for

- Premium product feel.
- Menus and panels.
- Figma polish.
- Clean onboarding.

## Risks

- Can look like generic dashboard software.
- Can reduce the “game” feeling.
- Canvas may lose visual dominance.

## How to fix risks

- Keep node graph and data flow visually alive.
- Use blueprint grid and active edge particles.
- Avoid too much empty corporate whitespace.
- Maintain technical iconography.

## Figma instruction

For this direction, make sure the first working pipeline still feels like a game moment, not an analytics screen.

---

# Recommended hybrid rule

Use Direction A as the base.

Borrow from Direction B:

- Data flow particles.
- Active node glow.
- Crypto/AI late-game energy.

Borrow from Direction C:

- Inspector polish.
- Modal design.
- Settings design.
- Contract card polish.

Do not mix them equally. The final product should read as:

> Blueprint Control Room with tasteful neon flow and premium glass panels.

---

# Direction comparison

| Direction | Strength | Risk | Best use |
|---|---|---|---|
| A — Blueprint Control Room | Readability and identity | Could feel dry | Main game canvas |
| B — Neon Data Center | Exciting and alive | Can become noisy | Marketing, late-game, flow effects |
| C — Glass Command Deck | Premium and clean | Can become generic dashboard | Panels, modals, menus |

## Final recommendation

Choose this final art direction statement:

> Mimar uses a Blueprint Control Room foundation: a dark technical grid, readable node cards, and precise diagnostic panels. Active systems come alive through restrained neon data flow, while menus and modals use premium glass command-deck polish.

This statement should be placed at the top of the Figma file as the main art direction.

---

# Figma exploration request

Ask Figma designer to create three exploration frames before finalizing the design system:

1. `EXP_A_BlueprintControlRoom_MainCanvas`
2. `EXP_B_NeonDataCenter_MainCanvas`
3. `EXP_C_GlassCommandDeck_MainCanvas`

Each exploration must show:

- Top Resource Bar.
- Left Node Library.
- Main Canvas.
- Right Inspector.
- Bottom Command Strip.
- A working pipeline with 4 nodes.
- One bottleneck warning.

After review, choose one primary direction and continue into the 13 production frames from `docs/FIGMA_FRAME_SPECS.md`.

## Prompt for Figma exploration

```text
Create three visual exploration frames for Mimar using docs/VISUAL_DIRECTIONS.md.

Frame A: Blueprint Control Room.
Frame B: Neon Data Center.
Frame C: Glass Command Deck.

All frames must show the same gameplay state: Internet Feed -> Parser -> Cleaner -> Upload Gateway, with Parser in a compute bottleneck warning state. Include top resource bar, left node library, right inspector, and bottom command strip. Use docs/THEME_TOKENS.md and keep the canvas as the visual hero.
```
