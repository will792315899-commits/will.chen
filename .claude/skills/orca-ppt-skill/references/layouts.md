# Slide layouts

Copy-paste blocks for the deck built by `orca-ppt-skill`. All of them live
inside `assets/deck-template.html` already — this file is the quick index of
which to reach for and the markup for a few extras not shown there.

Every slide is `<section class="slide" data-sec="…">…</section>`. Mark rising
elements with `class="stg"` and `style="--d:N"` (N = 0,1,2… stagger order).

## Pick by content shape

| The slide is about… | Use |
| --- | --- |
| Opening / who + what | **Title** (template slide 1) |
| A list of upcoming topics | **Agenda grid** — `.grid.g3` of `.card` (slide 2) |
| A claim + support + a framing aside | **Two-column** — `ul.clean` + callout `.card` (slide 3) |
| One or a few hard numbers | **Stat tiles** — `.grid.g3` of `.stat` (slide 4) |
| A process / ordered reasons | **Numbered steps** — `.steps` (below) |
| A mechanism or flow (A→B→C) | **Diagram** — `.sor` (below) |
| A yes/no or before/after contrast | **Two cards** — `.grid.g2` of `.card` (below) |
| The single most important point | **Emphasis slide** — sand-gold accent (below) |
| Closing / thank-you | **Closing** (template slide 5) |

Don't stamp one layout on every slide — variety is what keeps a deck from
feeling like a form.

## Numbered steps

Use only when the order carries meaning (a real sequence, ranked reasons).

```html
<section class="slide" data-sec="Discussion">
  <p class="eyebrow stg" style="--d:0">Section label</p>
  <h2 class="stg" style="--d:1">Headline</h2>
  <hr class="rule stg" style="--d:2">
  <div class="steps stg" style="--d:3;margin-top:4px">
    <div class="step"><span class="num">1</span><p><strong>Point.</strong> Detail.</p></div>
    <div class="step"><span class="num">2</span><p><strong>Point.</strong> Detail.</p></div>
    <div class="step"><span class="num">3</span><p><strong>Point.</strong> Detail.</p></div>
  </div>
</section>
```

## Mechanism diagram

Three nodes with arrows; highlight the middle node by adding a coloured border.
Collapses to a vertical stack (arrows rotate) on phones.

```html
<div class="sor stg" style="--d:3;margin-top:8px">
  <div class="node"><span class="lab">Input</span><span class="val">Cause</span><small>detail</small></div>
  <div class="arrow">→</div>
  <div class="node" style="border-color:var(--sky);box-shadow:0 8px 22px -14px rgba(79,156,190,.6)">
    <span class="lab">Middle</span><span class="val">Mechanism</span><small>detail</small></div>
  <div class="arrow">→</div>
  <div class="node"><span class="lab">Output</span><span class="val">Effect</span><small>detail</small></div>
</div>
```

For a mediator/moderator model, add a moderator row under it:

```html
<div class="modrow stg" style="--d:4;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:14px">
  <div style="background:rgba(224,165,110,.13);border:1px dashed rgba(201,133,63,.4);color:var(--sand-deep);border-radius:12px;padding:7px 15px;font-size:13.5px;font-weight:600">Moderator · X</div>
</div>
```

## Two cards (contrast / pass–fail)

Pair a status `.pill` with each card for yes/no, supported/not-supported, etc.

```html
<div class="grid g2" style="margin-top:6px">
  <div class="card stg" style="--d:3">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="k">Option A</span><span class="pill yes"><span class="dot"></span>Supported</span></div>
    <p>Detail.</p>
  </div>
  <div class="card stg" style="--d:4">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="k">Option B</span><span class="pill no"><span class="dot"></span>Not supported</span></div>
    <p>Detail.</p>
  </div>
</div>
```

## Emphasis slide (the one that matters most)

This is where the warm sand-gold earns its keep — use it on **exactly one**
slide so it reads as the peak of the talk. Tint the slide background, switch the
rule and the big numbers to gold.

```html
<section class="slide" data-sec="Section"
         style="background:linear-gradient(160deg,rgba(224,165,110,.14),rgba(255,255,255,.2) 60%)">
  <p class="eyebrow stg" style="--d:0;color:var(--sand-deep)">The key finding</p>
  <h2 class="stg" style="--d:1">The headline that pays off the setup</h2>
  <hr class="rule stg" style="--d:2;background:linear-gradient(90deg,var(--sand),var(--sand-deep))">
  <div class="grid g3 stg" style="--d:3;margin-top:8px">
    <div class="card" style="text-align:center;border-color:rgba(201,133,63,.3)">
      <div class="stat" style="text-align:center"><div class="big gold">β = .77</div><div class="cap">what it is</div></div></div>
    <!-- two more gold tiles -->
  </div>
  <p class="lead stg" style="--d:4;text-align:center;margin-top:8px;color:var(--ink)">One-line interpretation, with the <span class="accent">point</span> accented.</p>
</section>
```

## Fit & density notes

- If a slide overflows the 16:9 stage (a scrollbar appears), you have too much
  on it — split it or cut, don't shrink the type below the clamp floors.
- `ul.clean` items read best at one line each; wrap to two at most.
- Keep the eyebrow → `h2` → `rule` opening on content slides; that repetition is
  the deck's spine and makes each slide legible in the first second.
- Colour tokens only from `:root`; never hard-code a hex in a slide, so a later
  palette change stays a one-place edit.
