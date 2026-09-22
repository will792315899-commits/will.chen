---
name: orca-transition-skill
description: >-
  House rules and reusable patterns for adding, editing, or debugging UI
  transitions and animations in this React + Vite photo-to-music app
  (聆·境 / 照片调音师). Use this whenever the task touches how views enter,
  leave, or morph — the home / analyzing / result phase changes, panel
  open/close (History), button and hover states, loading/skeleton motion,
  or anything described as an animation, transition, fade, slide, easing,
  or "make it feel smoother." Reach for it even when the user doesn't say
  "transition" but wants a screen change to feel less abrupt, wants motion
  to match the existing look, or reports jank/flicker on a view swap.
---

# orca-transition-skill

Motion in this app is deliberately calm — a Mediterranean, sky-blue,
"breathing" aesthetic where things fade and drift into place rather than pop.
The goal of this skill is to keep every new transition feeling like it was
always part of that world, and to avoid the two failure modes that break the
mood: **abrupt swaps** (a view vanishing and another appearing on the same
frame) and **off-brand motion** (bouncy, fast, or linear easing that fights
the existing slow ease-outs).

Read `references/patterns.md` for copy-paste snippets and the full easing /
timing / palette reference. This file covers the how and the why.

## How motion is done here

There is **no animation library** (no Framer Motion, no react-spring). Motion
comes from two places, and new work should stay within them so the bundle and
the visual language stay consistent:

1. **Inline `style` transitions** driven by React state — a boolean like
   `entered` flips, and a `transition: 'opacity 1s 0.3s'` interpolates the
   change. This is how the header and home grid animate in `src/App.tsx`.
2. **CSS `@keyframes`** defined in a single inline `<style>` block at the
   bottom of `App.tsx`, all prefixed `lj-` (聆境). Existing ones:
   `lj-fadeUp`, `lj-spin`, `lj-breathe`, `lj-slideUp`. Elements opt in with
   `animation: 'lj-fadeUp 0.5s ease-out'`.

When you add a keyframe, add it to that `<style>` block, keep the `lj-`
prefix, and describe it in `references/patterns.md` so the next person finds
it instead of writing a near-duplicate.

## The core problem: phase changes are unmount/mount

`App.tsx` renders each phase with `{phase === 'home' && (...)}`. When `phase`
flips, the old tree unmounts the same frame the new one mounts. The incoming
view can animate **in** (that's why `result` uses `lj-slideUp`), but the
outgoing view cannot animate **out** — it's already gone. That's the source of
most "it feels abrupt" reports.

Prefer the lightest fix that solves the actual complaint:

- **Incoming-only polish is usually enough.** If the ask is just "make the
  result appear more gently," give the incoming view an entrance animation and
  stop. Don't add exit machinery nobody asked for.
- **Cross-fade when both directions matter.** If the swap itself reads as a
  hard cut, keep the outgoing view mounted for its fade duration. The standard
  pattern (a `displayPhase` state that lags `phase`, or a small reusable
  wrapper) is in `references/patterns.md` under "Cross-fading phases." Reach
  for this only when incoming-only isn't enough — it adds state, and more state
  is more to keep correct.

## Rules of the house

These keep new motion coherent with what's there. Each has a reason — if the
reason doesn't apply to your case, use judgment.

- **Match the easing vocabulary.** Entrances use `ease-out` or the signature
  `cubic-bezier(0.22, 1, 0.36, 1)` (a soft overshoot-free settle). Hover and
  small state changes use `ease` at `0.25s–0.3s`. Avoid `linear` (feels
  mechanical) and springy/bouncy curves (wrong mood) unless the user asks for
  playfulness. Exact tokens are in `references/patterns.md`.

- **Respect the timing scale.** Micro-interactions (hover, button press)
  ~0.25s; view entrances 0.5s–0.8s; ambient loops (breathe) ~2.5s. New values
  should land near an existing tier rather than introducing a fourth speed, so
  the app reads as one system.

- **Animate compositor-friendly properties.** Stick to `opacity` and
  `transform` (translate/scale). They run on the GPU and stay smooth on
  mobile; animating `width`, `height`, `top`, or `padding` triggers layout and
  can jank — `App.tsx` already animates `padding` on the header, so if you
  touch that area and it stutters, that's the first thing to convert to
  `transform`.

- **Honor `prefers-reduced-motion`.** Users who set it get hurt by big
  slides/scales. Guard non-essential motion — the snippet is in
  `references/patterns.md`. This is easy to forget because nothing looks broken
  in testing; add it as you go rather than as a cleanup pass.

- **Keep it inline and `lj-`-prefixed.** No new animation dependency, no
  separate CSS file, no unprefixed global keyframes (they'd risk colliding).
  If a change wants a genuinely new primitive, that's a conversation with the
  user, not a silent addition.

- **Mobile is real.** `isMobile` (`window.innerWidth < 768`) already switches
  the home layout from row to column; heavy simultaneous animations on the
  Spline `<iframe>` plus a big slide can drop frames on phones. Prefer fading
  the container over animating the iframe itself.

## Workflow for a transition change

1. **Locate the motion.** Phase-level and layout motion lives in `src/App.tsx`
   (state + the `<style>` block). Component-local motion (buttons, cards,
   panels) lives in that component under `src/components/`. Grep for
   `transition`, `animation`, or `@keyframes` before adding anything — the
   piece you want may already exist.
2. **Pick the smallest pattern** from `references/patterns.md` that fits.
3. **Reuse an existing keyframe/easing** if one matches; only add a new one
   when nothing fits, and document it.
4. **Verify** with `npm run lint` and `npm run build` (this repo gates on
   `tsc`), and if you can run it, `npm run dev` and watch the actual transition
   — motion bugs (flicker, double-fade, layout shift) rarely show up in a
   static read.

## When to say something instead of just doing it

- The user wants a fundamentally different feel (bouncy, dramatic, fast-paced)
  than the calm house style — confirm the direction before overwriting the
  vocabulary, since it's a deliberate identity.
- A request implies a new dependency (a full animation library) — flag the
  bundle/consistency tradeoff and let the user choose.
- A "smoother" request is vague — a one-line clarification ("just the result
  appearing, or the whole swap?") saves a wrong-scope change.
