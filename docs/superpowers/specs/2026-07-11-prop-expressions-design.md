# Prop Expressions Design

## Goal

Make the character feel more responsive and playful by increasing the sunglasses frequency, mapping repeated taps to escalating emotional reactions, and adding a Vision Pro expression.

## Behavior

- Weight `cool` four times in the ambient expression pool.
- Accumulate taps inside a 1.2 second rolling interaction window.
- Map tap intensity to four stages: pleased, delighted, bashful, and ticklish-covering.
- Reset intensity after 1.6 seconds without another tap.
- Add `vision` as a 5.8-6.8 second ambient prop expression.
- Keep both eye slots at the existing fixed positions for every expression.

## Visual Direction

The Vision Pro layer uses a wide silver textile frame, a dark curved visor, a soft white reflection, and side straps. Yellow eyes remain visible through the visor. It enters with a soft overshoot and subtle floating motion, matching the existing cute animation language.

## Verification

Automated tests cover expression weighting, intensity escalation/reset, and direct Vision Pro selection. Browser QA covers the mobile landscape layout, runtime errors, and visible prop transitions.
