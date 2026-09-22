---
name: orca-ppt-skill
description: >-
  Build animated, self-contained HTML slide decks ("web PPTs") in this
  project's calm sky-blue Mediterranean style — the presentation companion to
  orca-transition-skill. Use this whenever the user wants slides, a deck, a
  presentation, a "PPT", a pitch, a defense/thesis talk, a walkthrough, or
  "turn this into slides," and wants it as a shareable web page (not a
  downloadable .pptx). Reach for it even when they just say "做个PPT" / "make
  slides" and expect motion, or ask to restyle / extend an existing deck built
  this way. It carries a ready-to-fill deck scaffold (16:9 stage, keyboard /
  click / swipe nav, cross-fade page transitions, staggered lj-* entrances) so
  you assemble a polished deck fast instead of rebuilding the harness. For an
  actual PowerPoint .pptx file, use the pptx skill instead — this skill's web
  transitions don't apply there.
---

# orca-ppt-skill

A deck built with this skill should feel like the app it comes from: calm,
sky-blue, Mediterranean, things fading and drifting into place rather than
popping. It is the slide-deck sibling of `orca-transition-skill` — same motion
vocabulary (`lj-*` keyframes, the `cubic-bezier(0.22, 1, 0.36, 1)` settle,
`opacity`/`transform` only, `prefers-reduced-motion` honored), applied to
page-to-page transitions instead of a React app's view swaps.

The point of the skill is that the **hard, reusable part is already solved** —
the 16:9 stage, the cross-fade navigation, the entrance choreography, the
palette and type system all live in `assets/deck-template.html`. Your job is to
pour real content into good layouts, not to rebuild the harness each time.

## Start here

1. **Read `assets/deck-template.html`.** It's a complete, working deck: the CSS
   token/motion system, the nav JS (arrows / click zones / swipe / progress
   bar / counter), and a set of labelled example slide layouts. Copy it as the
   starting point.
2. **Read `references/layouts.md`** for the catalogue of slide layouts (title,
   agenda grid, two-column, stat tiles, S-O-R style diagram, numbered steps,
   emphasis/"key finding" slide, closing) with copy-paste markup.
3. **Skim `orca-transition-skill`** (`../orca-transition-skill/SKILL.md`) if you
   need the *why* behind the motion — this skill assumes its house rules.

## How the deck works (so you can extend it safely)

- Every slide is a `<section class="slide" data-sec="…">` stacked in one
  `.stage`. Exactly one carries `.active` (opacity 1, visible); the rest are
  faded out and `visibility:hidden`.
- **Navigation** flips `.active` from the outgoing slide to the incoming one.
  CSS does the rest: the outgoing slide fades out via its `opacity` transition,
  the incoming one cross-fades in, and its children replay their entrance
  because the entrance animation is defined under `.slide.active .stg` — adding
  the class restarts it. This is the cross-fade pattern from
  orca-transition-skill, so no view-swap ever reads as a hard cut.
- **Staggered entrance:** give any element that should rise in the class `stg`
  and an inline `--d` index (`style="--d:0"`, `1`, `2`, …). Delay is
  `--d * 78ms`, so content cascades top to bottom. Keep a slide's total stagger
  under ~0.6s — long ladders feel slow and hurt the thumbnail.
- **`data-sec`** sets the small section label shown top-right; use it to group
  slides (Introduction / Results / …).

## Rules of the house (inherited, with deck specifics)

- **Keep the motion vocabulary.** Entrances use `lj-fadeUp` /
  `cubic-bezier(0.22,1,0.36,1)`; ambient loops use `lj-breathe`. Don't add
  bouncy or `linear` easing, and don't pull in an animation/deck library
  (reveal.js, Framer, etc.) — the whole value here is one self-contained file
  in a consistent style.
- **Animate only `opacity`/`transform`.** They stay smooth full-screen and on
  phones; animating layout properties janks during a talk.
- **Honor `prefers-reduced-motion`.** The template already guards it; keep that
  block if you refactor the CSS.
- **One idea per slide.** Decks fail by cramming. If a slide needs a scrollbar
  to fit at 16:9, split it or cut words — the reader is 3 metres away, not
  reading prose. Prefer a stat tile or a short bulleted `ul.clean` over a
  paragraph.
- **Spend the warm accent once.** The palette is sky-blue; the sand-gold
  (`--sand`/`--sand-deep`) is reserved for the single most important slide (the
  standout finding, the thesis of the talk). If everything is emphasised,
  nothing is.
- **Show data honestly.** When a slide reports a number, use the real figure
  and its units; the big-number stat tiles exist so one true number can carry a
  slide.

## Building a deck — workflow

1. **Get the source and the count.** Read whatever you're presenting (a paper,
   a doc, notes). Confirm the slide count if the user gave one; if not, let the
   content decide and tell them the number.
2. **Outline first.** Draft the per-slide title + one-line purpose before
   writing any markup. A deck is a sequence; fix the narrative arc (setup →
   tension → evidence → payoff → takeaway) before styling.
3. **Assemble** by copying the template and dropping each outline point into the
   layout from `references/layouts.md` that best fits its shape — a comparison
   wants two cards, a mechanism wants the diagram, a result wants a stat tile.
   Don't force every slide into the same layout.
4. **Fill `data-sec`, `--d` indices, and the counter** — the template's JS reads
   slide count from the DOM, so you don't hard-code totals, but do sanity-check
   the first/last slide and that every slide has a `data-sec`.
5. **Publish** as an HTML Artifact (load `artifact-design` first — it's required
   before writing/publishing any artifact, and it governs palette/type/layout
   craft). Give it a real 2–4 word `<title>`, an `icon` like `presentation`,
   and a one-sentence `description`. Then open it for the user and hand over the
   keyboard shortcuts (← →, click sides, swipe).

## When to check with the user first

- **They want a `.pptx` file.** This skill makes a *web* deck; a downloadable
  PowerPoint is the `pptx` skill's job and can't use these transitions. If it's
  ambiguous ("做个PPT"), ask which they want — web deck (shareable link, real
  transitions) or .pptx (file to submit/present offline).
- **They want a different feel** (corporate, dark, dramatic, bold brand
  colours) than the calm sky-blue identity — confirm before overriding the
  palette; the look is deliberate, but the user's word wins.
- **The content is huge** (a 60-page report into 10 slides) — propose the cut
  (what leads, what's an appendix slide, what's dropped) before building, so you
  don't spend the effort on the wrong 10 slides.
