# Mimar — 13 Production Frames Review

Review target: `Mimar_13_Production_Frames(1).zip`

Reviewed production frames:

1. `01_TitleScreen`
2. `02_EmptyMainCanvas`
3. `03_FirstNodePlaced`
4. `04_FirstConnectionPreview`
5. `05_FirstWorkingPipeline`
6. `06_FirstBottleneck`
7. `07_NodeInspectorDetail`
8. `08_ContractDeck`
9. `09_ResearchDeck`
10. `10_SideOperationsDeck`
11. `11_BlueprintLibrary`
12. `12_StagingRoom`
13. `13_SettingsModal`

## Executive verdict

The production frame set is directionally approved.

The design now matches the selected art direction:

> Blueprint Control Room base with restrained neon flow and polished command panels.

The strongest frames are:

- `05_FirstWorkingPipeline`
- `06_FirstBottleneck`
- `07_NodeInspectorDetail`
- `12_StagingRoom`

The design is usable as the first Figma production reference for Codex implementation, with a focused revision pass before final handoff.

## Overall strengths

- The canvas remains the main visual area.
- The permanent app shell is stable across frames.
- Node Library, Resource Bar, Inspector, and Bottom Strip are consistent.
- The first pipeline is readable.
- Parser bottleneck state is clearly visible.
- The right inspector explains selected node state well.
- The product avoids noisy mobile-game shop patterns.
- The UI feels like a technical control room rather than a generic website.

## Overall risks

- Some screens still feel a bit too static in still form; data-flow direction needs stronger visual indication.
- The top resource bar is readable but could use better grouping.
- Future decks are solid but need more visual character to avoid becoming ordinary dashboard panels.
- Several screens rely on small text, which may become hard to read at lower resolutions or when scaled down.
- Some later screens need clearer locked/active/completed state differentiation.

## Approval level

Approved for:

- M1 visual implementation reference.
- Codex UI component planning.
- Figma component system extraction.
- First production style direction.

Needs revision before:

- final marketing screenshots.
- Steam capsule-related visuals.
- mobile adaptation.
- final production UI polish.

---

# Frame-by-frame review

## 01_TitleScreen

### Works

- Strong dark mood.
- Logo is readable.
- Tagline is clean.
- Buttons are centered and calm.
- No unnecessary lore overload.

### Revise

- Add slightly more identity behind the logo: a subtle node constellation or grid pulse.
- The current title screen is clean but a little generic.
- Consider a small animated-looking data spark behind the word MIMAR.

### Status

Approved with minor polish.

## 02_EmptyMainCanvas

### Works

- Correct starting layout.
- Empty canvas feels calm, not broken.
- Node Library is clear.
- Inspector empty state is useful.
- Objective is visible.

### Revise

- The center empty-state icon can be slightly more distinctive.
- Internet Feed recommendation should be a touch more visually guided.
- Canvas center could use a subtle focal zone to avoid feeling too empty.

### Status

Approved for M1.

## 03_FirstNodePlaced

### Works

- Internet Feed node reads well.
- Inspector gives immediate value.
- Running status is clear.
- Output pulse direction is implied.

### Revise

- Make the unconnected output state more obvious without making it feel like an error.
- Add a tiny source-origin pulse from the output port.

### Status

Approved for M1.

## 04_FirstConnectionPreview

### Works

- Connection preview is understandable.
- Parser target state is visible.
- Right inspector explaining connection preview is a good idea.

### Revise

- Compatible target highlight should be stronger.
- Preview line should include a clearer direction cue.
- Tooltip can be more compact.

### Status

Approved with interaction polish.

## 05_FirstWorkingPipeline

### Works

- Best first reward frame.
- Pipeline reads clearly.
- Upload Gateway feels like a value output.
- Resource bar money state works.
- Inspector has useful upgrade preview.
- Bottom strip has good player-facing copy.

### Revise

- Increase data-flow particle visibility slightly.
- Upload Gateway revenue pulse can be more satisfying.
- Background server silhouettes are nice, but keep them very subtle.

### Status

Strongly approved for M1 target.

## 06_FirstBottleneck

### Works

- Parser bottleneck is clear.
- Compute top-bar warning is visible.
- Inspector explanation is direct.
- CPU Rack recommendation in Node Library is effective.
- Bottom strip message is clear.

### Revise

- Selected state and warning state should remain visually distinct.
- Warning icon inside node is good but should not overlap or crowd text.
- Add a small “fix action” hierarchy in Inspector: Add CPU Rack primary, Upgrade secondary.

### Status

Strongly approved for M1 target.

## 07_NodeInspectorDetail

### Works

- Inspector structure is strong.
- Cleaner selection works.
- Upgrade block is readable.
- Rates are well grouped.

### Revise

- Add small icons to section headers.
- Make Buy 1 / Buy 10 / Buy Max placement consistent with future upgrade flow.
- Delete action should be visibly lower priority.

### Status

Approved.

## 08_ContractDeck

### Works

- Contract panel is clear.
- Available and active cards are understandable.
- Canvas remains visible behind/alongside deck.
- Accept buttons are calm and not shop-like.

### Revise

- Active contract progress should be more visually dominant.
- Locked enterprise card could show the unlock condition more clearly.
- Add tier badges to contract cards.

### Status

Approved for M2 reference.

## 09_ResearchDeck

### Works

- Tech tree layout is readable.
- Violet accent fits research.
- Branch rows are clear.
- Purchased/available/locked states exist.

### Revise

- The deck needs more “blueprint tech tree” identity.
- Locked nodes are readable but too visually similar.
- Add small branch icons or subtle category labels.
- Research lines should feel more like a connected system.

### Status

Approved with visual identity polish.

## 10_SideOperationsDeck

### Works

- Side Operations appears as an overlay/deck without losing canvas context.
- Income breakdown is useful.
- Mining route and audit simulation cards show opportunity cost.
- The screen does not look like a free reward shop.

### Revise

- Resource allocation bars should be clearer and easier to scan.
- Mining and security cards need stronger category identity.
- The relationship between side operations and the live graph could be clearer.

### Status

Approved for M3 reference.

## 11_BlueprintLibrary

### Works

- Blueprint cards feel like saved system designs.
- Mini graph thumbnails are a good direction.
- Missing unlock state exists.
- Deploy preview is present.

### Revise

- Add more blueprint-plan texture or blueprint grid styling.
- Missing unlock state needs a clearer locked treatment.
- Deploy preview could show a ghost placement idea.

### Status

Approved for M5 reference.

## 12_StagingRoom

### Works

- Very strong concept frame.
- Staging canvas is clearly separated from live grid.
- Current vs Staging comparison works.
- Action hierarchy is clear: Run Test, Deploy, Save, Discard.
- This frame has strong product identity.

### Revise

- The Staging Room border can use a slightly more distinctive lab/test accent.
- Show one or two ghost nodes or changed edges more explicitly.
- Add a clearer “not live” visual marker.

### Status

Strongly approved for future milestone reference.

## 13_SettingsModal

### Works

- Modal is calm and readable.
- Settings categories are practical.
- Reduced Motion, High Contrast, Autosave, Tooltip Delay are included.
- Reset System uses danger styling.

### Revise

- Modal could use slightly more Glass Command Deck polish.
- Save data actions should be more separated from normal preferences.
- Add close button clarity.

### Status

Approved.

---

# System-level revision list

## Must fix before final Figma handoff

1. Strengthen data-flow direction on edges.
2. Make selected state and warning state visually distinct.
3. Improve top resource grouping.
4. Make locked states clearer across Node Library, Research, Contracts, and Blueprints.
5. Add more unique visual identity to Research Deck.
6. Add subtle but satisfying revenue feedback to Upload Gateway.
7. Confirm all small text remains readable at 100% and 75% preview.

## Nice to have

1. Slightly richer title screen identity.
2. More icon usage in Inspector sections.
3. Better ghost/preview styling for Staging and Blueprint deploy.
4. More explicit category identity in Side Operations cards.
5. More polished settings modal close/header treatment.

---

# Codex implementation instruction

Codex should use these production frames as the visual target for M1, but implement only the M1 scope.

M1 can implement:

- App shell.
- Resource Bar.
- Node Library.
- Graph Canvas.
- Node components.
- Edge components.
- Inspector Panel.
- Bottom Command Strip.
- Basic save/load controls.

M1 must not implement:

- Contract Deck logic.
- Research Deck logic beyond placeholders.
- Side Operations Deck logic.
- Blueprint Library logic.
- Staging Room logic.
- Settings beyond basic shell if needed.

## M1 visual target

Use these frames as primary M1 references:

- `02_EmptyMainCanvas`
- `03_FirstNodePlaced`
- `04_FirstConnectionPreview`
- `05_FirstWorkingPipeline`
- `06_FirstBottleneck`
- `07_NodeInspectorDetail`

## Figma next action

Create a revised production pass with the must-fix items applied, then extract a Figma component system:

- AppShell.
- ResourceBarItem.
- NodeLibraryCard.
- NodeView.
- Port.
- Edge.
- InspectorSection.
- BottomCommandStrip.
- Button.
- StatusChip.
- Modal.
- Tooltip.

After that, Codex can start implementing UI components from the selected M1 frames.
