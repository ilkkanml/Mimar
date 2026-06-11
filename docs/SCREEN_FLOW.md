# Mimar — Screen Flow

This document defines what the player sees, in what order, and how screens connect. It is written for Figma design, Codex implementation, and future UX review.

## 1. Screen philosophy

Mimar is a single-core-screen game. The player should feel that most of the game happens inside one living command interface, not through many disconnected pages.

The main canvas is the home base. Every other screen is a panel, deck, overlay, or focused mode that returns to the canvas.

Core rule:

> Do not make the game feel like a website. Make it feel like a control room.

## 2. Primary screen map

```text
Boot / Title
  -> New Game / Continue
      -> Main Canvas
          -> Node Library
          -> Inspector
          -> Contracts Deck
          -> Research Deck
          -> Side Operations Deck
          -> Blueprints Deck
          -> Staging Room
          -> Settings
```

M1 only includes:

- Boot / Title, if simple.
- Main Canvas.
- Node Library.
- Inspector.
- Resource Bar.
- Bottom Objective Strip.
- Save/load controls.

## 3. Boot / title screen

Purpose:

- Establish mood.
- Let player continue or start.
- Avoid long cinematic intro.

Visual:

- Dark background.
- Very subtle grid.
- Small animated data pulse behind logo.
- Logo centered.

Copy:

```text
MIMAR
Data Infrastructure Architect

Build the grid. Control the flow.
```

Buttons:

- Continue, if save exists.
- New System.
- Settings.

Do not overload this screen with lore.

## 4. New game start

The first game screen opens directly into the main canvas.

Initial state:

- Empty grid.
- Top resource bar visible.
- Left Node Library open.
- Right Inspector empty.
- Bottom Objective Strip says what to do.

Initial objective:

```text
Objective: Place Internet Feed to start receiving raw data.
```

The first available node should be highlighted gently.

## 5. Main Canvas screen

The main canvas is the default screen.

Always visible:

- Resource Bar.
- Canvas.
- Node Library, unless collapsed.
- Inspector, unless collapsed.
- Bottom Strip.

Canvas behavior:

- Pan.
- Zoom.
- Select.
- Drag nodes.
- Connect ports.
- Inspect edges.

M1 screen state examples:

1. Empty canvas.
2. First node placed.
3. First connection preview.
4. First working pipeline.
5. First bottleneck state.
6. Save/load state.

## 6. First 10-minute flow

### Minute 0: Empty control deck

Player sees:

- Money: $0.
- Data: 0.
- Compute: 0/0.
- Research: 0.
- Node Library shows Internet Feed first.

Objective:

```text
Place Internet Feed.
```

### Minute 1: First data source

After placing Internet Feed:

- Node activates.
- Raw data particles pulse from output port.
- Inspector explains the node.

Objective:

```text
Add Parser to convert raw data.
```

### Minute 2: First connection

Player connects Internet Feed to Parser.

Feedback:

- Connection line animates.
- Parser status changes from input-starved to running.
- Resource bar rawData rate changes.

Objective:

```text
Add Cleaner to produce clean data.
```

### Minute 3: First money

Pipeline:

```text
Internet Feed -> Parser -> Cleaner -> Upload Gateway
```

Feedback:

- Money increases.
- Upload Gateway shows green value pulse.
- Bottom strip says: “Data is flowing. Revenue online.”

### Minute 4-6: First bottleneck

Game introduces compute pressure.

Possible bottleneck:

```text
Parser needs compute.
```

Objective:

```text
Add CPU Rack to increase compute capacity.
```

### Minute 7-10: First research

Player adds Research Lab.

Feedback:

- Research value starts increasing.
- Research deck tease appears but may remain locked or minimal in M1.

Objective:

```text
Generate 10 Research.
```

## 7. Node Library screen behavior

The Node Library is a left dock, not a separate full screen.

States:

- Expanded.
- Collapsed icon rail.
- Search active.
- Category selected.
- Dragging node.

M1 categories:

- Data.
- Processing.
- Output.
- Infrastructure.
- Research.

Later categories:

- Routing.
- Security.
- Crypto.
- AI.
- Energy.
- Automation.

## 8. Inspector screen behavior

The Inspector is a right dock.

States:

- Empty.
- Node selected.
- Edge selected.
- Multi-selection.
- Locked node preview.

Empty copy:

```text
Select a node to inspect its flow.
```

Node selected sections:

1. Header.
2. Status.
3. Inputs and outputs.
4. Bottleneck reason.
5. Upgrade preview.
6. Actions.

Edge selected sections:

1. Resource type.
2. Throughput.
3. From / to.
4. Status.
5. Delete action.

## 9. Contracts Deck

Unlock: M2.

Purpose:

- Turn open-ended production into specific goals.

Visual:

- Slide-over or full-height deck from the right.
- Contract cards arranged by tier.
- Active contract pinned in bottom strip.

Contract card anatomy:

```text
Startup Text Cleanup
Deliver: 500 Clean Data
Quality: 60+
Reward: $25K + Reputation
Deadline: 03:00
[Accept]
```

States:

- Available.
- Active.
- Completed.
- Failed.
- Locked.

## 10. Research Deck

Unlock: M2.

Purpose:

- Show long-term tech direction.

Visual:

- Tech tree with branching paths.
- Nodes connected by thin blueprint lines.
- Purchased research glows violet.
- Locked research is visible but muted.

Branches:

- Throughput.
- Value.
- Automation.
- Security.
- Energy.
- AI.
- Side Operations.

Rule:

Research must be readable without zooming into tiny labels.

## 11. Side Operations Deck

Unlock: M3.

Purpose:

- Show secondary income systems and their opportunity costs.

Tabs:

- Mining.
- Security Contracts.
- Cloud Rental.
- AI API, later.

Main panel:

- Income breakdown.
- Resource allocation.
- Risk indicators.
- Active side routes.

Rule:

This deck must make tradeoffs visible. It must never look like a free reward shop.

## 12. Market / Infrastructure Catalog

The node library is the normal market for buying infrastructure.

A larger catalog view can open later for advanced nodes.

Catalog card should show:

- Node name.
- Category.
- Cost.
- Power or compute impact, when relevant.
- Unlock requirement.
- Short use case.

Example:

```text
GPU Cluster
Infrastructure
Cost: $2.5K
Use: GPU capacity for mining and AI
```

## 13. Blueprints Deck

Unlock: M5.

Purpose:

- Save and redeploy player-designed graph modules.

Visual:

- Blueprint cards with mini graph thumbnail.
- Required resources.
- Missing unlock warnings.
- Deploy preview.

Actions:

- Save selected as blueprint.
- Deploy.
- Rename.
- Duplicate.
- Delete.

## 14. Staging Room

Unlock: M5.

Purpose:

- Test changes without damaging the live system.

Visual:

- Separate canvas mode with “Staging” label.
- Compare current vs staging metrics.

Comparison table:

```text
Metric        Current     Staging
Money/sec     $12.5K      $18.2K
Research/sec  120         90
Power Load    80%         93%
Heat          65%         88%
```

Actions:

- Run simulation.
- Deploy.
- Save as blueprint.
- Discard.

## 15. Settings

Settings should be practical and quiet.

Sections:

- Gameplay.
- UI scale.
- Motion.
- Audio.
- Save data.
- Accessibility.

Important settings:

- UI scale.
- Reduced motion.
- High contrast mode.
- Autosave.
- Tooltip delay.

## 16. Modal rules

Use modals only for:

- New game confirmation.
- Delete large selection.
- Save conflict.
- Deploy staging changes.
- Prestige confirmation.

Do not use modals for basic node upgrades or regular navigation.

## 17. Responsive behavior

Desktop first.

Tablet:

- Left and right panels become collapsible.
- Bottom strip remains.
- Node ports get larger hitboxes.

Mobile later:

- Canvas full screen.
- Node Library bottom sheet.
- Inspector bottom sheet.
- Resource bar horizontal scroll or compact groups.

## 18. Figma deliverables from this flow

Figma should create frames for:

1. Title screen.
2. Empty main canvas.
3. First node placed.
4. First working pipeline.
5. Bottleneck state.
6. Node inspector.
7. Contracts deck.
8. Research deck.
9. Side operations deck.
10. Blueprint deck.
11. Staging room.
12. Settings modal.
