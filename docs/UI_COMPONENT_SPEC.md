# Mimar — UI Component Specification

This document defines the reusable UI components for Mimar. Figma design and Codex implementation must follow this file together with `docs/THEME_TOKENS.md`, `docs/VISUAL_BIBLE.md`, and `docs/SCREEN_FLOW.md`.

## 1. Component principles

Every component must support clarity first.

Rules:

- Use theme tokens only.
- Do not invent random colors.
- Do not use color as the only status indicator.
- Every interactive component must have hover, active, disabled, and selected states when relevant.
- Live data must be readable without opening deep menus.
- Dense panels are allowed, but they must be visually grouped.

## 2. App shell

The app shell is the permanent frame around the canvas.

Areas:

- Top Resource Bar.
- Left Node Library.
- Main Canvas.
- Right Inspector.
- Bottom Command Strip.

Desktop layout target: 1440 x 900.

Sizing:

- Top Resource Bar: 56 px height.
- Left Node Library: 280 px width.
- Right Inspector: 340 px width.
- Bottom Command Strip: 48 px height.
- Canvas fills remaining area.

Panel style:

- Background: `bg.panel`.
- Border: `line.subtle`.
- Raised cards: `bg.panelRaised`.
- Radius: `radius.lg` for panels, `radius.md` for cards.

## 3. Top Resource Bar

Purpose:

Shows current global resources and rates.

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

Component anatomy:

```text
[Icon] Label  Value  Rate
```

Example:

```text
Money  $12.4K  +$420/s
Compute 18/25
Heat 72%
```

States:

- Normal.
- Positive rate.
- Negative rate.
- Warning.
- Critical.

Rules:

- Use mono font for values and rates.
- Group data resources together.
- Warning resources can pulse gently.
- Do not show every late-game resource if not unlocked.

## 4. Node Library

Purpose:

Lets player find and place nodes.

Sections:

1. Header.
2. Search field.
3. Category tabs.
4. Node cards.
5. Locked nodes.

Node card anatomy:

```text
Node Name
Short function
Cost / Unlock
```

Example:

```text
Internet Feed
Produces raw data
Free
```

Locked example:

```text
GPU Cluster
Unlock: GPU Compute
```

States:

- Available.
- Hovered.
- Dragging.
- Locked.
- Unaffordable.
- Recently used, later.

Rules:

- Locked nodes are visible but muted.
- Unlock requirement must be visible on hover or card body.
- Drag preview should use a ghost version of the node.

## 5. Search Field

Used in Node Library, Blueprints, and later contract filtering.

States:

- Empty.
- Typing.
- Results.
- No results.

Empty placeholder:

```text
Search nodes...
```

No result copy:

```text
No matching nodes yet.
```

## 6. Main Canvas

Purpose:

The central graph workspace.

Canvas elements:

- Grid background.
- Nodes.
- Edges.
- Selection rectangle.
- Connection preview.
- Placement ghost.
- Context menu.
- Zoom controls, optional.

Canvas controls:

- Left click select.
- Drag node to move.
- Drag from output port to input port to connect.
- Mouse wheel zoom.
- Space + drag or middle mouse pan.
- Delete selected.

Visual rules:

- Canvas background must remain quiet.
- Active graph should be visually dominant.
- Edge animation should indicate direction.

## 7. Node Component

Default size:

- Width: 180 px.
- Height: 92 px.

Node anatomy:

```text
┌────────────────────────┐
│ Name              Lv1  │
│ Category / function    │
│ Main rate     Status   │
│ ● input        output ●│
└────────────────────────┘
```

Required elements:

- Name.
- Level.
- Category accent.
- Main rate.
- Status.
- Input/output ports.

States:

- Default.
- Hovered.
- Selected.
- Running.
- Idle.
- Input Starved.
- Output Blocked.
- Compute Limited.
- Power Limited.
- Heat Throttled.
- Locked.

Status labels:

- Running.
- Idle.
- Input starved.
- Output blocked.
- Compute limited.
- Power limited.
- Heat throttled.

Visual behavior:

- Selected: accent border + soft glow.
- Warning: amber status chip.
- Critical: red status chip.
- Locked: muted body, lock icon.

## 8. Port Component

Port visible dot:

- 8-10 px.

Port hitbox:

- 16-20 px.

Input ports:

- Left side.

Output ports:

- Right side.

States:

- Default.
- Hovered.
- Compatible target.
- Invalid target.
- Connected.

Tooltip:

```text
Input: cleanData
Limit: 5/s
```

Rules:

- Ports must be easy to select.
- During drag, compatible ports should highlight.
- Invalid ports should show a reason.

## 9. Edge Component

Purpose:

Shows resource flow between nodes.

Edge anatomy:

- Curved path.
- Flow particles.
- Optional hover label.
- Direction arrow, subtle.

States:

- Normal.
- Active flow.
- Saturated.
- Blocked.
- Selected.
- Invalid preview.

Hover label:

```text
Clean Data
Flow: 5.0/s
Limit: 8.0/s
```

Rules:

- Do not label every edge permanently.
- Flow animation speed reflects throughput.
- Warning edge indicates bottleneck.

## 10. Inspector Panel

Purpose:

Explains selected node or edge.

Empty state:

```text
Select a node to inspect its flow.
```

Node inspector sections:

1. Header.
2. Status summary.
3. Description.
4. Inputs.
5. Outputs.
6. Bottleneck.
7. Upgrade preview.
8. Actions.

Header anatomy:

```text
Cleaner    Lv3
Processing
Status: Compute limited
```

Live rate row:

```text
Parsed Data In    6.0/s
Clean Data Out    5.5/s
Compute Used      3/18
```

Bottleneck block:

```text
Bottleneck
Compute is limiting this node.
Fix: add CPU Rack or upgrade compute.
```

Upgrade preview:

```text
Upgrade to Lv4
Cost: $1.2K
Effect: +18% throughput
```

## 11. Bottom Command Strip

Purpose:

Shows objective, bottleneck, alerts, and quick actions.

Segments:

- Objective.
- Main bottleneck.
- Alert.
- Buy mode.
- Undo/redo.
- Save status.

Example:

```text
Objective: Build your first pipeline | Bottleneck: Parser needs compute | Buy 1 | Undo | Saved
```

Rules:

- Keep copy short.
- Use alert priority.
- Do not show more than one critical message at once.

## 12. Button Component

Button variants:

- Primary.
- Secondary.
- Ghost.
- Danger.
- Locked.

Primary use:

- Accept Contract.
- Deploy Blueprint.
- Confirm big action.

Secondary use:

- Upgrade.
- Save.
- Run Simulation.

Ghost use:

- Undo.
- Close.
- Inspect.

States:

- Default.
- Hovered.
- Pressed.
- Disabled.
- Loading.

## 13. Tabs

Used in:

- Node Library categories.
- Contracts Deck.
- Side Operations Deck.
- Settings.

Tab anatomy:

```text
[Icon] Label
```

States:

- Default.
- Hovered.
- Active.
- Locked.
- Has alert.

## 14. Cards

Used for:

- Node library items.
- Contract cards.
- Research nodes.
- Blueprint cards.
- Market catalog entries.

Card rules:

- Title at top.
- Short function line.
- Key requirement or cost.
- Primary action bottom-right or full-width.
- Locked cards must show unlock condition.

## 15. Modal

Use modals only for high-commitment actions.

Modal types:

- Confirm new game.
- Delete large selection.
- Save conflict.
- Deploy staging.
- Prestige confirmation, later.

Modal anatomy:

- Title.
- Short explanation.
- Consequence list.
- Primary and secondary actions.

Do not use modals for normal upgrades.

## 16. Tooltip

Tooltip types:

- Resource tooltip.
- Port tooltip.
- Bottleneck tooltip.
- Unlock tooltip.
- Error tooltip.

Rules:

- Tooltips must be short.
- Include “why” and “fix” when possible.

Example:

```text
Compute limited
This node wants more compute than available.
Fix: add CPU Rack.
```

## 17. Toast / Alert

Use for temporary events.

Types:

- Info.
- Success.
- Warning.
- Critical.
- Opportunity.

Examples:

```text
Data is flowing. Revenue online.
Save complete.
New contract available.
Heat throttling started.
```

Rules:

- Avoid spam.
- Same alert should have cooldown.
- Critical alerts may also appear in bottom strip.

## 18. Contract Card

Unlock: M2.

Anatomy:

```text
Contract Title
Client type / tier
Requirement list
Reward list
Deadline
Accept button
```

Example:

```text
Startup Text Cleanup
Deliver 500 Clean Data
Quality 60+
Reward: $25K + Reputation
Deadline: 03:00
```

States:

- Available.
- Active.
- Completed.
- Failed.
- Locked.

## 19. Research Node

Unlock: M2.

Anatomy:

```text
Research Name
Cost
Effect
```

States:

- Locked.
- Available.
- Affordable.
- Purchased.
- Highlighted path.

Visual:

- Violet accent.
- Blueprint lines.
- Purchased nodes glow softly.

## 20. Side Operation Panel

Unlock: M3.

Sections:

- Income breakdown.
- Resource allocation.
- Risk indicators.
- Active operations.

Rules:

- Show opportunity cost.
- Do not make side income look like a free reward button.
- Keep sensitive themed systems abstract and fictional.

## 21. Settings Components

Settings should be readable and practical.

Components:

- Toggle.
- Slider.
- Dropdown.
- Keybind row.
- Save data action row.

Important settings:

- UI scale.
- Reduced motion.
- High contrast.
- Autosave.
- Tooltip delay.

## 22. Component implementation rules for Codex

Codex must:

- Implement components according to this spec.
- Use tokens from `docs/THEME_TOKENS.md`.
- Keep UI components separate from simulation logic.
- Add TODO comments if a visual decision is missing.
- Avoid inventing new navigation or styling systems.

Codex must not:

- Redesign the layout.
- Add random colors.
- Turn the game into a generic dashboard.
- Hide core state behind too many clicks.
