# The Shift — Visual Art Direction (v1)

**Purpose.** Give the nursing simulation the polish and emotional clarity of a distinctive indie game while preserving the rigor of a professional learning tool. This is a production brief, not permission to redraw the whole game.

## North star

**A living, illustrated ward — not a generic hospital dashboard, not an exam-prep website, and not a photorealistic hospital.**

The interface should disappear when a decision matters. A student should read a person's condition first, understand what changed second, and choose an action third. Clinical information is the protagonist; illustration helps the player care about the patient.

### Visual pillars

1. **Quiet confidence.** A tactile, restrained, slightly editorial atmosphere; precise typography and warm surfaces, not shiny game chrome.
2. **Human first.** Expressive, identifiable patients with distinct faces, posture, fatigue, and reactions. No random emotion unconnected to clinical state.
3. **Clinical signal.** Changes, trends, and due work have prominent *text labels* with restrained color reinforcement. Never use color alone to convey meaning; never turn every abnormal measurement into an alarm.
4. **One decisive action.** Each screen presents an obvious primary path; secondary actions remain discoverable rather than competing for attention.
5. **Cross-context coherence.** Station, room, report, phone, and debrief feel like parts of one world. Dark mode and mobile preserve the same hierarchy.

## Design language

- **Palette:** retain existing warm paper/cream, ink, navy and clinical green/amber/red tokens. Reserve red for urgent or hazardous states, amber for caution, green for improved/resolved. Never use red as general decoration.
- **Type:** Atkinson Hyperlegible for body and clinical rationale; Barlow Condensed for time, wayfinding, major editorial headings; mono only for precise chart-like data. Preserve readable minimum sizes and spacing.
- **Surfaces:** hairline dividers, selective inset rails, subtle separation and modest corner radii. Avoid nested cards around every sentence and heavy shadows.
- **Spacing:** consistent 4/8/12/16/24px rhythm. Patient information is read in a quick vertical scan: name and reason here → most relevant present information → next action.
- **Motion:** transient, functional feedback for transitions and states. No looping cosmetic effects on large surfaces, including box-shadow. Honor reduced-motion settings and the existing Lite rendering mode.

## Character standard

Keep the existing procedural SVG rig and recognizable cast. Do not replace patients with AI-generated photos or conflicting illustrations. Its strength is that it is light, responsive, and changes with patient condition.

For a **second pass**, improve a curated set of 4 West patient rigs with:
- Consistent anatomy/proportions, shoulder framing, eye alignment and expression range.
- Legible expressions at small portrait sizes, without exaggeration or cartoon panic.
- Distinct silhouettes and hair, clothing or accessory details so patients do not blend together.
- Contextual body language: breathlessness, discomfort, fatigue, guardedness, reassurance, without equating appearance with acuity or diagnosis.
- Expression transitions tied to actual assessment/interaction states, not arbitrary ambient urgency.
- Accessible labels or adjacent text for clinically important changes.

Patient portraits need a predictable frame and tonal separation from the station background. In-room patient faces remain the focal point of the illustration; overlays should never routinely cover eyes or mouth.

**Acceptance bar:** patients recognizable from portrait to room; emotions legible at 48px without distorting tone; SVG rendering remains smooth on mobile; visual changes convey no inaccurate clinical facts.

## Scene direction

- Keep the SVG environment. Refine lighting, depth and focus rather than adding decorative objects.
- The patient should remain the most legible focal point; monitors, infusions and environmental clues are relevant but not visual noise.
- Preserve essential clickable hotspots and their accessible text equivalents.
- Information overlays should feel like a chart clipped to the environment, not a bright HUD pasted over the character.
- As urgency rises, reflect what is actually occurring through measured changes in cues; avoid full-screen red treatment for routine overdue tasks.

## Screen composition

**Home:** two clear paths, a short daily drill and the full shift, with a one-sentence distinction. Don't bury shift play beneath rewards.

**Report:** a calm listening/flagging surface. Visually distinguish flagged facts, report progress, and completion. No pre-highlighting of the correct cues.

**Station:** a clear next-action card, a readable patient roster and separate interruptions. The student's ranking must never masquerade as an objective triage severity indicator.

**Room:** patient and current status in the illustration; a single high-visibility next step below; lower-detail actions in a consistent dock. Keep clinical consequences readable, not theatrical.

**Debrief:** lead with the most consequential decisions, follow with each patient's outcome, then skill-level detail and an achievable replay path. Do not substitute stars for feedback.

## Visual QA gate

Review at desktop 1440px, tablet 768px, phone 390px and 320px in both light and dark themes. Check selected/focus/disabled/overdue states; long names, medication labels, and number wrapping. Test keyboard focus and reduced motion. Run the complete existing audit, save representative before/after screenshots and validate with real students. Do not claim visual quality is established from source inspection alone.

## Implementation phases

- **Pass 1 (this PR):** restrained consistency, selected clinical information hierarchy, consistent portrait framing, patient-row legibility, room next-action framing, debrief scannability. No new clinical claims.
- **Pass 2:** curated 4 West portrait-expression studies, scene lighting, tested overlays, direct playtesting at mobile sizes.
- **Pass 3:** use playtest evidence to refine pacing and broader design system. Expand to other shifts only when the first experience performs well.

**Anti-goals:** image-heavy replacement art, generic SaaS cards, animated alarms, larger text blocks, decorative gamification, visual priority flags that reveal the hidden correct answer.
