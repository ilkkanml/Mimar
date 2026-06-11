# Mimar — Detailed Figma Frame Specifications

This document gives frame-by-frame design instructions for Figma. It expands `docs/FIGMA_BRIEF.md` with exact composition, UI content, visual states, and handoff notes.

Use together with:

- `docs/THEME_TOKENS.md`
- `docs/VISUAL_BIBLE.md`
- `docs/SCREEN_FLOW.md`
- `docs/UI_COMPONENT_SPEC.md`
- `docs/ICONOGRAPHY.md`
- `docs/MOTION_AND_FEEDBACK.md`
- `docs/MARKET_STORE_SPEC.md`

## Global frame rules

- Desktop frame size: 1440 x 900.
- Use the dark technical palette from `docs/THEME_TOKENS.md`.
- Canvas must remain the visual hero.
- Panels should feel like a command deck, not a website.
- Node text must be readable at 100% zoom.
- Ports must be visible and easy to target.
- Status must not rely only on color.
- Use real UI copy from this document where provided.

## Naming convention

Use these frame names exactly:

```text
01_TitleScreen
02_EmptyMainCanvas
03_FirstNodePlaced
04_FirstConnectionPreview
05_FirstWorkingPipeline
06_FirstBottleneck
07_NodeInspectorDetail
08_ContractDeck
09_ResearchDeck
10_SideOperationsDeck
11_BlueprintLibrary
12_StagingRoom
13_SettingsModal
```

## Frame 01 — Title Screen

### Goal

Establish the mood: quiet, technical, premium, and slightly mysterious.

The player should feel like a machine is waiting to be built.

### Layout

- Full-screen dark background.
- Subtle blueprint grid across the whole screen.
- Center logo block.
- Small animated-looking data pulse or node constellation behind the logo.
- Buttons stacked under logo.
- Footer with tiny version/save status text.

### Main content

Logo text:

```text
MIMAR
```

Subtitle:

```text
Data Infrastructure Architect
```

Tagline:

```text
Build the grid. Control the flow.
```

Buttons:

```text
Continue
New System
Settings
```

Footer:

```text
v0.1 prototype foundation
```

### Visual details

- Logo should use `text.primary` with slight cyan glow.
- Tagline uses `text.secondary`.
- Primary button uses `accent.data`.
- Background should not be too busy.
- Do not include characters, people, or mascots.

### Figma components needed

- Button / Primary.
- Button / Secondary.
- Button / Ghost.
- Background grid style.

## Frame 02 — Empty Main Canvas

### Goal

Show the first playable screen before any node is placed.

It should not feel like an empty app. It should clearly guide the first action.

### Layout

Use the permanent app shell:

- Top Resource Bar: 56 px.
- Left Node Library: 280 px.
- Main Canvas center.
- Right Inspector: 340 px.
- Bottom Command Strip: 48 px.

### Top Resource Bar values

```text
Money $0
Raw 0
Parsed 0
Clean 0
Compute 0/0
Research 0
```

### Left Node Library

Header:

```text
Node Library
```

Search placeholder:

```text
Search nodes...
```

Categories:

```text
Data
Processing
Output
Infrastructure
Research
```

Visible cards:

```text
Internet Feed
Produces raw data
Free
```

```text
Parser
Converts raw data
Cost: $50
```

```text
Cleaner
Produces clean data
Cost: $100
```

```text
Upload Gateway
Sells clean data
Cost: $150
```

```text
CPU Rack
Adds compute capacity
Cost: $200
```

Research Lab should be locked or muted:

```text
Research Lab
Unlock: Earn $1K
```

### Right Inspector empty state

```text
Select a node to inspect its flow.
```

Small helper text:

```text
Node stats, bottlenecks, and upgrades will appear here.
```

### Bottom Command Strip

Objective:

```text
Objective: Place Internet Feed to start receiving raw data.
```

Save status:

```text
Not saved
```

### Visual details

- The Internet Feed card should have a subtle highlight to guide the player.
- Canvas grid should be quiet with a faint center focus area.
- No modal tutorial box. Guidance lives in bottom strip and subtle highlight.

## Frame 03 — First Node Placed

### Goal

Show the first action result: Internet Feed exists and the player can inspect it.

### Layout

Same app shell as Frame 02.

### Canvas

Place one node slightly left of center:

```text
Internet Feed Lv1
+10 raw/s
Running
```

Node details:

- One output port on the right.
- Category accent: cyan.
- Small activity dot.
- A faint raw data pulse appears at the output port, but no edge exists yet.

### Inspector

Header:

```text
Internet Feed   Lv1
Data Source
Status: Running
```

Description:

```text
Produces raw data from public data streams.
```

Rates:

```text
Raw Data Out   10/s
Power Use      1
Heat Output    0.5
```

Bottleneck:

```text
No output connected.
Add Parser to convert raw data.
```

### Bottom Command Strip

```text
Objective: Add Parser to convert raw data.
```

### Visual details

- Node selected state should be visible.
- Inspector should feel useful immediately.
- Show that unconnected output is not a failure, just the next step.

## Frame 04 — First Connection Preview

### Goal

Show the moment of connecting two nodes.

### Canvas

Nodes:

- Internet Feed on left.
- Parser on right.

Connection preview:

- Curved line from Internet Feed output to Parser input.
- Parser input port highlighted as compatible.
- Cursor/ghost line can be implied if not interactive.

Tooltip near target port:

```text
Connect rawData
```

Parser node state before connection:

```text
Parser Lv1
Waiting for raw data
Input starved
```

### Inspector

If Internet Feed is selected, keep its details. If connection preview is selected, show a small connection helper:

```text
Creating connection
rawData output -> rawData input
```

### Bottom Command Strip

```text
Release on Parser input to connect raw data.
```

### Visual details

- Compatible target uses cyan glow.
- Preview line should be thinner than confirmed edge.
- Do not use harsh green; keep the aesthetic premium.

## Frame 05 — First Working Pipeline

### Goal

Show the first “it works” moment. This is the emotional hook.

### Canvas

Pipeline:

```text
Internet Feed -> Parser -> Cleaner -> Upload Gateway
```

Node states:

- Internet Feed: Running, +10 raw/s.
- Parser: Running, +8 parsed/s.
- Cleaner: Running, +5.5 clean/s.
- Upload Gateway: Running, +$50/s.

Edges:

- Raw data edge: muted cyan.
- Parsed data edge: cyan.
- Clean data edge: soft green.
- Flow particles moving left to right.

Upload Gateway:

- Soft green-gold value pulse.
- Money output is visually noticeable but not flashy.

### Top Resource Bar values

```text
Money $240 +$50/s
Raw Data +10/s
Parsed Data +8/s
Clean Data +5.5/s
Compute 5/10
Research 0
```

### Inspector

Selected node: Upload Gateway.

Header:

```text
Upload Gateway Lv1
Output
Status: Running
```

Rates:

```text
Clean Data In  5/s
Money Out      $50/s
```

Bottleneck:

```text
No major bottleneck.
```

Upgrade preview:

```text
Upgrade to Lv2
Cost: $186
Effect: +20% throughput
```

### Bottom Command Strip

```text
Data is flowing. Revenue online.
```

Next objective:

```text
Add CPU Rack to support more processing.
```

### Visual details

- This frame should feel satisfying.
- Make flow direction very clear.
- Keep node graph compact and readable.

## Frame 06 — First Bottleneck

### Goal

Teach that the game is about diagnosing systems.

### Canvas

Same pipeline as Frame 05, but Parser or Cleaner is bottlenecked by compute.

Preferred bottleneck node: Parser.

Parser visual state:

```text
Parser Lv1
6.1 parsed/s
Compute limited
```

Visual signals:

- Amber status chip on Parser.
- Slight warning glow on Parser border.
- Edge into Parser may be saturated.
- Edge out of Parser may be lower intensity.

Add CPU Rack card visible in Node Library as recommended next action.

### Top Resource Bar

```text
Compute 10/10
```

Use warning state for Compute.

### Inspector

Selected node: Parser.

Bottleneck block:

```text
Bottleneck
Parser needs more compute than available.
Fix: add CPU Rack or upgrade compute capacity.
```

Rates:

```text
Raw Data In       8/s
Parsed Data Out   6.1/s
Compute Used      2/2 requested
```

### Bottom Command Strip

```text
Bottleneck: Parser needs compute. Add CPU Rack.
```

### Visual details

- Warning should be obvious but calm.
- Do not make the screen look like a disaster.
- The fix should be visible in Node Library and Inspector.

## Frame 07 — Node Inspector Detail

### Goal

Define the full inspector layout for a selected node.

### Canvas

Show a medium-size graph in background. Select Cleaner.

Cleaner node:

```text
Cleaner Lv3
5.5 clean/s
Running
```

### Inspector sections

Header:

```text
Cleaner   Lv3
Processing
Status: Running
```

Description:

```text
Cleans parsed data and reduces errors. Contracts and AI systems rely on clean data.
```

Live rates:

```text
Inputs
Parsed Data   6.0/s
Compute       3/18

Outputs
Clean Data    5.5/s
Quality       +10
```

Bottleneck:

```text
No major bottleneck.
```

Upgrade:

```text
Upgrade to Lv4
Cost: $195
Effect: +17% throughput, +3 quality
```

Actions:

```text
Upgrade
Duplicate
Disable
Delete
```

Buy mode row:

```text
Buy 1 | Buy 10 | Buy 100 | Buy Max
```

### Visual details

- Inspector must be scannable.
- Group inputs and outputs clearly.
- Upgrade button should be secondary, not massive.
- Delete action should be quiet danger style.

## Frame 08 — Contract Deck

### Goal

Show how contracts become target-based gameplay.

### Layout

Contracts Deck slides over from right or replaces Inspector area plus extra width. Canvas remains visible behind or beside it.

Deck width: 520-640 px if overlay. If full deck, keep top resource bar visible.

### Header

```text
Contracts
Client work with requirements, rewards, and deadlines.
```

Tabs:

```text
Available | Active | Completed | Locked
```

### Available contract card

```text
Startup Text Cleanup
Tier 1 Client
Deliver: 500 Clean Data
Quality: 60+
Reward: $25K +3 Reputation
Deadline: 03:00
[Accept]
```

### Active contract card

```text
LocalPulse Data Batch
Progress: 230 / 500 Clean Data
Deadline: 01:42
Reward: $18K +2 Reputation
```

Progress bar required.

### Locked tier card

```text
Enterprise Privacy Batch
Unlock: Trust 50
Requires privacy-safe pipeline
```

### Visual details

- Contract cards use `accent.contract`.
- Deadline warning uses amber.
- Completed uses soft green.
- Locked cards are visible but muted.
- Do not make this look like a cash shop.

## Frame 09 — Research Deck

### Goal

Show long-term technology choices.

### Layout

Research Deck can be a full-screen overlay over the canvas while keeping top bar visible.

Background remains dark blueprint.

### Header

```text
Research
Turn clean data into new infrastructure.
```

Research points display:

```text
Research: 120
```

### Branches

Show at least six branches:

- Throughput.
- Value.
- Automation.
- Energy.
- AI.
- Side Operations.

### Research node examples

Purchased:

```text
Processing Basics
Purchased
```

Available:

```text
Routing Basics
Cost: 100 Research
Unlocks Router, Splitter
```

Locked:

```text
GPU Compute
Requires Data Center Age
```

### Visual details

- Use violet accent.
- Tech tree lines should be thin blueprint lines.
- Purchased nodes glow softly.
- Available nodes have clear cost.
- Locked nodes must show why.

## Frame 10 — Side Operations Deck

### Goal

Show that side income exists but has opportunity cost.

### Layout

Side Operations Deck with tabs:

```text
Mining | Security Contracts | Cloud Rental | AI API
```

The screen should feel like a secondary operations dashboard connected to the same machine.

### Header

```text
Side Operations
Use spare capacity for secondary income. Every route has a cost.
```

### Income breakdown

```text
Upload Sales      $42K/s   68%
Mining            $12K/s   19%
Cloud Rental       $5K/s    8%
Contracts          $3K/s    5%
```

### Resource allocation preview

```text
GPU Allocation
AI Training     40%
Mining          30%
Cloud Rental    20%
Reserve         10%
```

### Mining route card

```text
HashLite Mining Route
Uses: GPU + Power
Pressure: +Heat
Output: Coin income
[Activate]
```

### Security contract card

```text
OpenShield Audit Simulation
Uses: Compute
Reward: Money + Trust
Risk: Low
[Start]
```

### Visual details

- Mining uses gold accent.
- Security contracts use violet/magenta accent.
- Opportunity cost must be visible.
- Do not use free reward chest language.

## Frame 11 — Blueprint Library

### Goal

Show saved player-made systems.

### Layout

Blueprint Deck with grid/list of blueprint cards.

### Header

```text
Blueprints
Save and redeploy proven system designs.
```

Actions:

```text
Save Selected
Import
```

### Blueprint card ready

```text
Clean Text Factory v3
8 nodes
Output: 120 Clean Data/s
Requires: $12K, 20 Compute
[Deploy]
```

Include mini graph thumbnail.

### Blueprint card missing requirement

```text
GPU Mining Starter
Missing: GPU Compute research
[Locked]
```

### Visual details

- Cards look like technical plans.
- Use blueprint line patterns.
- Mini graph thumbnails should be abstract but readable.
- Deploy button should preview before placing.

## Frame 12 — Staging Room

### Goal

Show testing changes without touching the live system.

### Layout

Staging mode should look like the main canvas but with clear lab/test framing.

Top label:

```text
Staging Room
Test changes before deploying to live grid.
```

Canvas:

- Similar graph to main canvas.
- Staging watermark or border.
- Proposed new nodes can be ghost-highlighted.

Right panel comparison:

```text
Metric        Current     Staging
Money/sec     $12.5K      $18.2K
Research/sec  120         90
Power Load    80%         93%
Heat          65%         88%
```

Actions:

```text
Run 60s Test
Deploy
Save as Blueprint
Discard
```

### Visual details

- Staging uses slightly more violet/blue lab accent.
- Deploy is primary but should not feel accidental.
- Discard should be available and calm.

## Frame 13 — Settings Modal

### Goal

Show practical settings without breaking the control-room feeling.

### Layout

Centered modal over dimmed main canvas.

Modal size: around 720 x 640.

Tabs or sections:

- Gameplay.
- Interface.
- Accessibility.
- Audio.
- Save Data.

### Settings rows

```text
UI Scale          [ slider ]
Reduced Motion    [ toggle ]
High Contrast     [ toggle ]
Autosave          [ toggle ]
Tooltip Delay     [ dropdown ]
Master Volume     [ slider ]
```

Save data actions:

```text
Save Now
Export Save
Reset System
```

### Visual details

- Modal should be calm and readable.
- Destructive action “Reset System” must use danger style and confirmation.
- Settings should not look like a store.

## Component handoff checklist

Figma must include components for:

- AppShell.
- ResourceBar item.
- NodeLibrary card.
- NodeView.
- Port.
- Edge styles.
- Inspector section.
- BottomCommandStrip.
- Button variants.
- Tabs.
- ContractCard.
- ResearchNode.
- SideOperationCard.
- BlueprintCard.
- Modal.
- Tooltip.
- Status chip.

## Figma review checklist

Before accepting the design, check:

- Does it look like Mimar, not a generic dashboard?
- Is the canvas the hero?
- Can the first pipeline be understood in 3 seconds?
- Can a bottleneck be understood in 3 seconds?
- Are node labels readable?
- Are ports easy to target?
- Are resource rates readable?
- Are locked items understandable?
- Are market/store surfaces separated from gameplay progression?
- Could Codex implement the design without inventing missing rules?

## Handoff note for Codex

Codex should implement only the frames/components required by the active milestone. M1 requires only the main canvas, node library, inspector, resource bar, bottom strip, basic nodes, edges, and save/load controls.

Frames 08-13 are future-facing and should guide architecture, not be implemented during M1 unless explicitly requested.
