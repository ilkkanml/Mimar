# Mimar — Figma Exploration Review

Review target: `Mimar_Visual_Exploration_Frames(1).zip`

Reviewed frames:

- `EXP_A_BlueprintControlRoom_MainCanvas`
- `EXP_B_NeonDataCenter_MainCanvas`
- `EXP_C_GlassCommandDeck_MainCanvas`

## Executive decision

Use **Direction A — Blueprint Control Room** as the base direction.

Borrow selectively from:

- Direction B for stronger data-flow life and active-node glow.
- Direction C for calmer panel polish and modal/settings refinement.

Final direction statement:

> Mimar should use Blueprint Control Room as its foundation: a dark technical grid, readable node cards, diagnostic panels, and calm neon data flow. It should borrow only controlled energy from Neon Data Center and only panel polish from Glass Command Deck.

## Overall assessment

The three explorations are consistent with the visual bible and clearly show the same gameplay state:

```text
Internet Feed -> Parser -> Cleaner -> Upload Gateway
```

The Parser bottleneck is visible, the top resource bar works, the node library is understandable, and the inspector explains the issue. This is a good first exploration pass.

The main design problem is that all three frames are still very close to each other. The next Figma pass should push the selected base direction, then refine hierarchy, spacing, and game feel.

## Direction A — Blueprint Control Room

### Verdict

Best base direction.

### What works

- Most readable canvas.
- Best long-session comfort.
- Strongest match for a node automation game.
- Grid and node layout feel like system architecture.
- Bottleneck warning is clear without becoming chaotic.
- Side panels do not overpower the canvas.

### Weaknesses

- It may feel a little too quiet if motion is not implemented well.
- The canvas needs slightly more life in active flow.
- The top-center label feels like a debug label and should become more diegetic or be removed.

### Required revisions

- Keep A as base.
- Add slightly stronger flow particles on active edges.
- Give Upload Gateway a more satisfying revenue pulse.
- Make the selected Parser state a little more distinct from normal nodes.
- Reduce debug-like frame labels in final production frames.

## Direction B — Neon Data Center

### Verdict

Good accent source, not the main base.

### What works

- More alive and energetic.
- Data center vertical light columns add atmosphere.
- Active flow feels more game-like.
- Good inspiration for late-game, crypto, AI, and high-activity states.

### Weaknesses

- Background columns compete with node readability.
- The canvas gets busier without adding gameplay information.
- Long sessions may become visually tiring.
- If Codex copies this too literally, it may overuse glow.

### Required revisions if used as accent

- Keep the active edge glow and node energy.
- Remove or greatly reduce vertical background columns in normal gameplay.
- Save stronger neon atmosphere for high-activity, side-operation, or late-game states.
- Do not use this as the default M1 visual density.

## Direction C — Glass Command Deck

### Verdict

Good panel/modal inspiration, not the main canvas direction.

### What works

- Calm and polished.
- Inspector and side panels feel premium.
- Good direction for settings, contracts, modals, and blueprint library.
- Least visually tiring.

### Weaknesses

- Canvas feels too plain.
- It risks becoming a generic dashboard.
- Data flow feels less alive.
- Game identity is weaker than A.

### Required revisions if used as accent

- Use C for inspector panel polish, settings, modals, contract cards, and blueprint cards.
- Do not make the main canvas this empty.
- Preserve blueprint grid and visible flow from A.

## Specific UI review notes

### Top Resource Bar

Works well overall.

Keep:

- Compact resource cards.
- Mono-style numeric feeling.
- Compute warning state.

Revise:

- Make rates slightly more visually grouped by resource type.
- Consider a clearer divider between money/data/compute/research groups.
- Make `Saved` status less detached, possibly part of bottom strip only.

### Node Library

Works well.

Keep:

- Category tabs.
- Node cards with icon, description, and cost/unlock.
- Highlight on CPU Rack as recommended fix.

Revise:

- Add clearer locked styling for Research Lab.
- Increase category tab readability slightly.
- Add tiny category color strips consistently on all cards.

### Canvas

The canvas is the most important part.

Keep:

- A direction grid.
- Compact node chain.
- Curved edges.
- Bottleneck bubble.

Revise:

- Reduce the large empty vertical space by slightly centering the graph better or adding subtle context, but avoid clutter.
- Final UI should not show exploration frame name as a visible pill.
- Make data particles and direction more obvious in still-frame design.
- Ensure edge labels do not overlap node labels.

### Nodes

Strong start.

Keep:

- Node size.
- Level label.
- Status chip.
- Category accent line.

Revise:

- Parser selected/bottleneck state should have two separate visual cues: selected border and warning status.
- Upload Gateway should feel more like a value output.
- Internet Feed output pulse should feel like origin/source.

### Inspector

Works well and is close to production direction.

Keep:

- Header card.
- Live rates card.
- Bottleneck explanation card.
- Diagnostic note.
- Add CPU Rack primary action.

Revise:

- Make the action hierarchy clearer: Add CPU Rack primary, Upgrade secondary.
- Reduce repeated warning borders if they become heavy.
- Add small icons to section headers.

### Bottom Command Strip

Good structure.

Keep:

- Objective on left.
- Bottleneck in center.
- Buy/Undo/Saved on right.

Revise:

- Make objective and bottleneck messages less cramped.
- Saved state can be smaller or moved to a subtle status area.
- Ensure bottom strip has priority logic later: objective, critical alert, one bottleneck.

## Final selected direction

Selected base:

```text
Direction A — Blueprint Control Room
```

Use this as the first production pass:

```text
A base + B flow energy + C panel polish
```

## Figma next-pass instruction

Create the 13 production frames from `docs/FIGMA_FRAME_SPECS.md` using Direction A as the base.

Apply these edits:

1. Remove visible exploration/debug frame labels from production frames.
2. Keep the Blueprint Control Room grid and readable nodes.
3. Add slightly more visible data-flow direction and particle density.
4. Use Glass Command Deck polish for inspector, settings, contracts, and modals.
5. Use Neon Data Center energy only for active flow, high-activity states, and later side-operation screens.
6. Make bottleneck and selected states visually distinct.
7. Make Upload Gateway revenue feedback more satisfying.
8. Keep the canvas as the hero.

## Codex note

Codex must not implement Direction B or C as separate themes during M1. M1 should implement the selected final direction only:

```text
Blueprint Control Room base with restrained neon flow and polished command panels.
```

Theme switching can be considered later only as cosmetic or debug work.