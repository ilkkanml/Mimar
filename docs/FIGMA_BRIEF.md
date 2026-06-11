# Mimar — Figma Design Brief

This brief is for the Figma designer or design agent who will create the visual mockups for Mimar.

The goal is not to invent a new product. The goal is to turn the existing visual bible into clean, usable, implementation-ready screens.

## 1. Project summary

Mimar is a node-based data infrastructure automation game.

The player builds a growing digital system on a canvas:

```text
Internet Feed -> Parser -> Cleaner -> Upload Gateway
```

Over time, the player manages data flow, bottlenecks, contracts, research, power, heat, crypto side income, AI systems, automation, blueprints, and staging simulations.

## 2. Visual target

Design phrase:

> Dark data-center blueprint with calm neon data flow.

The interface should feel like a premium technical control room, not a generic SaaS dashboard and not a noisy mobile shop.

Player feeling:

- I am designing a real system.
- The network is alive.
- I can read bottlenecks instantly.
- The UI is technical but clear.
- Every panel has a purpose.

## 3. Required source files

Read these before designing:

1. `docs/THEME_TOKENS.md`
2. `docs/VISUAL_BIBLE.md`
3. `docs/SCREEN_FLOW.md`
4. `docs/UI_COMPONENT_SPEC.md`
5. `docs/ICONOGRAPHY.md`
6. `docs/MOTION_AND_FEEDBACK.md`
7. `docs/MARKET_STORE_SPEC.md`

Do not use colors, layout rules, or component patterns that conflict with these files.

## 4. Design system requirements

Create a Figma design system with:

- Color styles matching `docs/THEME_TOKENS.md`.
- Text styles for UI sans and mono values.
- Spacing system based on 8 px grid.
- Radius tokens.
- Shadow and glow styles.
- Component variants.

Required component variants:

- Button: primary, secondary, ghost, danger, disabled.
- Node: default, hovered, selected, running, warning, critical, locked.
- Port: default, hover, compatible, invalid, connected.
- Edge: normal, active, saturated, blocked, selected.
- Resource item: normal, positive rate, negative rate, warning, critical.
- Card: default, hover, locked, active, completed.
- Tab: default, hover, active, locked, alert.
- Tooltip: info, warning, error.
- Modal: confirm, warning, destructive.

## 5. Required Figma frames

Create frames at desktop size 1440 x 900.

### Frame 01 — Title Screen

Must include:

- Dark grid background.
- MIMAR logo text.
- Subtitle: `Data Infrastructure Architect`.
- Tagline: `Build the grid. Control the flow.`
- Continue, New System, Settings buttons.

Mood: quiet, premium, technical.

### Frame 02 — Empty Main Canvas

Must include:

- Top Resource Bar.
- Left Node Library.
- Empty grid canvas.
- Right empty Inspector.
- Bottom Objective Strip.

Objective copy:

```text
Place Internet Feed to start receiving raw data.
```

### Frame 03 — First Node Placed

Show:

- Internet Feed node on canvas.
- Subtle raw data pulse from output port.
- Inspector showing Internet Feed details.
- Objective asking player to add Parser.

### Frame 04 — First Connection Preview

Show:

- Internet Feed and Parser.
- Player dragging connection from Internet Feed output to Parser input.
- Compatible port highlight.
- Preview edge.

### Frame 05 — First Working Pipeline

Show:

```text
Internet Feed -> Parser -> Cleaner -> Upload Gateway
```

Must include:

- Animated edge visual language.
- Money increasing in top bar.
- Upload Gateway value pulse.
- Bottom strip: `Data is flowing. Revenue online.`

### Frame 06 — First Bottleneck

Show the same pipeline but with compute bottleneck.

Must include:

- Warning status on affected node.
- Warning edge or status chip.
- Bottom strip bottleneck message.
- Inspector fix suggestion.

Example copy:

```text
Bottleneck: Parser needs compute.
Fix: add CPU Rack or upgrade compute.
```

### Frame 07 — Node Inspector Detail

Show a selected Cleaner node.

Inspector must include:

- Node name and level.
- Status.
- Description.
- Input rates.
- Output rates.
- Bottleneck reason.
- Upgrade preview.
- Actions.

### Frame 08 — Contract Deck

Unlock later, but design now.

Show:

- Available contracts.
- Active contract.
- Locked tier.
- Contract card states.

Use card example:

```text
Startup Text Cleanup
Deliver 500 Clean Data
Quality 60+
Reward: $25K + Reputation
Deadline: 03:00
```

### Frame 09 — Research Deck

Show:

- Branching tech tree.
- Purchased, available, locked research nodes.
- Violet research accent.
- Clear cost/effect labels.

Branches visible:

- Throughput.
- Value.
- Automation.
- Energy.
- AI.
- Side Operations.

### Frame 10 — Side Operations Deck

Show:

- Income breakdown.
- GPU allocation preview.
- Mining route card.
- Security contract card.
- Opportunity cost indicators.

Do not make it look like free rewards.

### Frame 11 — Blueprint Library

Show:

- Blueprint cards.
- Mini graph thumbnails.
- Required resources.
- Missing unlock state.
- Deploy preview button.

### Frame 12 — Staging Room

Show:

- Separate staging canvas mode.
- Current vs Staging comparison.
- Deploy, Save as Blueprint, Discard actions.

Comparison example:

```text
Metric        Current     Staging
Money/sec     $12.5K      $18.2K
Research/sec  120         90
Power Load    80%         93%
Heat          65%         88%
```

### Frame 13 — Settings Modal

Show settings for:

- UI scale.
- Reduced motion.
- High contrast.
- Autosave.
- Tooltip delay.
- Audio.

## 6. Responsive design requirements

Desktop first.

After desktop frames, create notes for:

### Tablet

- Left and right panels collapsible.
- Canvas remains primary.
- Ports larger.
- Bottom strip remains visible.

### Mobile later

- Canvas full screen.
- Node Library as bottom sheet.
- Inspector as bottom sheet.
- Resource bar compact.

Mobile is not required for first implementation, but the desktop design should not make mobile impossible.

## 7. Asset requirements

Design should include:

- Node component set.
- Edge/connection styles.
- Resource icons.
- Category icons.
- Status icons.
- Navigation icons.
- Modal components.
- Card components.
- Tooltip components.

Icon style must follow `docs/ICONOGRAPHY.md`.

## 8. Prototype interactions

Figma prototype should demonstrate:

1. Title -> Main Canvas.
2. Place first node.
3. Select node -> Inspector updates.
4. Drag connection preview.
5. Working pipeline.
6. Bottleneck state.
7. Open Contracts Deck.
8. Open Research Deck.
9. Open Side Operations Deck.
10. Open Staging Room.

Prototype does not need real game logic. It should communicate intended UX.

## 9. Design review criteria

A design passes only if:

- It uses the theme tokens.
- The canvas is visually dominant.
- Node text is readable.
- Ports are easy to target.
- Data flow direction is clear.
- Bottleneck state is obvious.
- Resource rates are readable.
- Market/store UI does not look manipulative.
- Screens feel like one product, not separate dashboards.
- Codex can implement it as components.

## 10. Export / handoff rules

Provide:

- Figma component names.
- Token mapping.
- Spacing values.
- Frame names.
- Interaction notes.
- Exported SVG icons, if available.
- Screenshots for README or docs, later.

Component names should match implementation names when possible:

- `AppShell`
- `ResourceBar`
- `NodeLibrary`
- `GraphCanvas`
- `NodeView`
- `EdgeView`
- `PortView`
- `InspectorPanel`
- `BottomCommandStrip`
- `ContractCard`
- `ResearchNode`
- `SideOperationCard`
- `BlueprintCard`

## 11. Figma prompt for designer

Use this prompt when giving the project to a Figma designer or design AI:

```text
Design the UI for Mimar, a node-based data infrastructure automation game. Use the repository files as the source of truth, especially docs/THEME_TOKENS.md, docs/VISUAL_BIBLE.md, docs/SCREEN_FLOW.md, docs/UI_COMPONENT_SPEC.md, docs/ICONOGRAPHY.md, docs/MOTION_AND_FEEDBACK.md, and docs/MARKET_STORE_SPEC.md.

Create a desktop-first Figma design system and 13 frames listed in docs/FIGMA_BRIEF.md. The style is dark data-center blueprint with calm neon data flow. Do not make it a generic dashboard or noisy mobile shop. The canvas must be the visual hero. Use readable node cards, clear ports, animated-flow-ready edges, and obvious bottleneck states.
```
