# Mimar — Motion and Feedback Specification

This document defines how Mimar moves, responds, warns, and celebrates. Motion must explain system state. It should never become decorative noise.

## 1. Motion principles

Motion in Mimar has three jobs:

1. Show direction of data flow.
2. Confirm player actions.
3. Reveal problems before they become confusing.

Avoid:

- constant decorative movement
- shaking panels
- random glitch effects
- overly long animations
- motion that hides numbers or text

## 2. Timing tokens

| Token | Duration | Use |
|---|---:|---|
| `motion.instant` | 80 ms | tiny hover feedback |
| `motion.fast` | 140 ms | button press, chip change |
| `motion.normal` | 220 ms | panel slide, node select |
| `motion.slow` | 360 ms | modal enter, major state transition |
| `motion.pulse` | 1200 ms | gentle warning or active flow pulse |

## 3. Easing

Default easing:

```text
ease-out cubic
```

Use:

- Fast ease-out for hover and selection.
- Smooth ease-in-out for panel transitions.
- Linear movement for data particles along edges.

## 4. Data flow animation

Edges should show small particles or pulses moving from output to input.

Rules:

- Direction must be obvious.
- Pulse speed reflects throughput.
- Pulse density reflects utilization.
- At low throughput, pulses are sparse.
- At high throughput, line glow increases slightly.
- At zero flow, line remains visible but quiet.

Example states:

| Flow state | Motion |
|---|---|
| No flow | static dim line |
| Low flow | slow sparse particles |
| Normal flow | steady particles |
| Saturated | brighter line, dense particles |
| Blocked | slow warning pulse, no forward particles |

## 5. Node state feedback

### Node placed

- Node appears with 140-220 ms scale/fade.
- A faint grid snap flash may appear.

### Node selected

- Border brightens.
- Soft glow appears.
- Inspector updates.

### Node running

- Small status pulse or activity dot.
- Avoid full-card blinking.

### Node bottleneck

- Amber status chip.
- Optional slow edge pulse from blocked side.
- Bottom strip shows one sentence reason.

### Node critical

- Red-orange status chip.
- Stronger but still readable glow.
- No constant aggressive shaking.

## 6. Connection feedback

### Starting connection drag

- Output port brightens.
- Compatible input ports become subtly highlighted.
- Preview line follows cursor.

### Valid target

- Target port grows slightly.
- Preview line uses compatible accent.
- Tooltip may say resource type.

### Invalid target

- Preview line shifts to warning/critical tint.
- Tooltip gives short reason.

Examples:

```text
Output must connect to input.
Resource type mismatch.
This input is already full.
```

### Connection created

- Short pulse travels along the new edge.
- Both ports flash softly.

## 7. Resource feedback

Resource values should update smoothly but remain readable.

Rules:

- Do not animate every digit excessively.
- Positive changes can show a small upward tick.
- Negative important changes can show a warning tick.
- Critical resource thresholds can pulse gently.

Threshold examples:

- Compute usage over 90%: subtle warning.
- Heat over 80%: warning.
- Power over 90%: warning.
- Storage full: critical.

## 8. Bottleneck feedback

Bottleneck feedback must be direct.

When a main bottleneck is detected:

1. Affected node gets warning state.
2. Affected edge may pulse warning.
3. Bottom strip states the reason.
4. Inspector provides fix ideas.

Example:

```text
Bottleneck: Parser needs compute.
Fix: add CPU Rack or upgrade compute.
```

Do not show multiple competing bottleneck popups at once.

## 9. Objective feedback

When objective completes:

- Short success pulse in bottom strip.
- Reward appears if relevant.
- Next objective slides in.

Duration:

- Success confirmation: 1.5-2.5 seconds.
- Then collapse to next objective.

## 10. Contract feedback

Unlock: M2.

Contract accepted:

- Contract card moves to active state.
- Bottom strip pins active contract progress.

Contract progress:

- Progress bar fills smoothly.
- Deadline warning appears when time is low.

Contract completed:

- Success pulse.
- Reward summary.
- Reputation/trust gain tick.

Contract failed:

- Calm failure state.
- Clear consequence list.
- No game-over drama.

## 11. Crypto and side operation feedback

Unlock: M3.

Side operations should feel like secondary systems drawing from the same machine.

Crypto mining:

- Gold flow accents.
- Heat/power warnings if mining stresses system.
- Wallet full state visibly blocks output.

Security contracts:

- Violet/magenta accent.
- Abstract risk meter.
- Success chance movement should be slow and legible.

Rules:

- Side operation animations must not overpower main data flow.
- Show opportunity cost clearly.

## 12. Save/load feedback

Autosave:

- Small “Saved” text in bottom strip.
- No modal.

Manual save:

- Toast: `Save complete.`

Save error:

- Persistent warning in bottom strip.
- Inspector/details optional.

## 13. Panel transitions

Panel open/close:

- Slide 220 ms.
- Fade content 140 ms.
- Keep canvas visible unless modal-level action.

Deck switching:

- Crossfade or horizontal slide.
- No page reload feeling.

## 14. Reduced motion

Reduced motion must be supported.

When enabled:

- Disable flow particles or reduce to subtle line shimmer.
- Remove scale animations.
- Keep state changes visible through color, icon, and text.
- Keep all gameplay information accessible.

## 15. Sound feedback, future

Sound should be subtle and optional.

Possible sound categories:

- node placed
- connection made
- objective complete
- warning
- save complete
- contract complete

No loud arcade sounds.

## 16. Figma deliverables

Figma should define interaction notes for:

- Node place.
- Node select.
- Edge create.
- Invalid connection.
- Bottleneck state.
- Objective complete.
- Panel open/close.
- Save confirmation.

## 17. Codex implementation rule

Codex should implement motion conservatively. If animation complexity risks delaying M1, implement the state classes first and leave advanced animation as TODO.

Priority order:

1. Correct state labels.
2. Correct colors/tokens.
3. Simple transitions.
4. Flow animation.
5. Advanced polish.
