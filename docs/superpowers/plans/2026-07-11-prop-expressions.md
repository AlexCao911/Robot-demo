# Prop Expressions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add weighted sunglasses, escalating tap reactions, and a Vision Pro expression.

**Architecture:** Extend the existing data-driven expression pool and keep tap intensity as a small timestamp-based state machine. Render the new prop in the existing performance layer and activate it through `data-expression` CSS selectors.

**Tech Stack:** HTML, CSS animations, vanilla JavaScript, Node test runner.

## Global Constraints

- Preserve fixed eye spacing in every state.
- Keep the experience cute and lively rather than technical.
- Add no runtime dependencies.

---

### Task 1: Interaction behavior

**Files:**
- Modify: `test/expressions.test.cjs`
- Modify: `script.js`

**Interfaces:**
- Produces: `chooseTapIntensity(now)`, `resetTapIntensity()`, and weighted `expressionPool` behavior.

- [ ] Add failing tests for four `cool` entries, Vision Pro selection, and tap-stage escalation/reset.
- [ ] Run `node --test test/expressions.test.cjs` and confirm the new assertions fail.
- [ ] Implement the weighted pool and timestamp-based tap intensity state.
- [ ] Run the test suite and confirm all assertions pass.

### Task 2: Vision Pro presentation

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `data-expression="vision"` from `setExpression`.
- Produces: `.vision-pro` prop layer with frame, visor, highlight, bridge, and straps.

- [ ] Add the semantic-free prop markup inside `.performance-layer`.
- [ ] Add responsive geometry and enter/idle animations for the Vision Pro layer.
- [ ] Ensure the eyes stay visible and their slots retain fixed spacing.
- [ ] Increment static asset query versions.

### Task 3: Verification and delivery

**Files:**
- Verify: `index.html`, `styles.css`, `script.js`, `test/expressions.test.cjs`

**Interfaces:**
- Consumes: local static server and expression query parameter.
- Produces: verified mobile and desktop rendering.

- [ ] Run `node --test test/expressions.test.cjs`, `node --check script.js`, and `git diff --check`.
- [ ] Verify `?expression=vision` and repeated taps in a landscape mobile viewport.
- [ ] Check console output and capture visual evidence.
- [ ] Commit and push the verified change to `main` so GitHub Pages rebuilds.
