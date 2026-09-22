# Transition patterns & tokens

Copy-paste patterns and the shared motion vocabulary for this app. All of it
is inline-style / inline-`@keyframes` — no library. Keep the `lj-` prefix on
new keyframes.

## Table of contents
- [Motion tokens](#motion-tokens)
- [Existing keyframes](#existing-keyframes)
- [Entrance on mount (state flip)](#entrance-on-mount-state-flip)
- [Keyframe entrance](#keyframe-entrance)
- [Cross-fading phases](#cross-fading-phases)
- [Panel open/close (History-style)](#panel-openclose-history-style)
- [Hover / press micro-interactions](#hover--press-micro-interactions)
- [prefers-reduced-motion guard](#prefers-reduced-motion-guard)
- [Staggering a list](#staggering-a-list)

## Motion tokens

Use these values so new motion matches what's shipped.

| Purpose | Duration | Easing |
| --- | --- | --- |
| Hover / small state change | `0.25s`–`0.3s` | `ease` |
| View / element entrance | `0.5s`–`0.8s` | `ease-out` or `cubic-bezier(0.22, 1, 0.36, 1)` |
| Ambient loop (breathe/pulse) | `~2.5s` | `ease-in-out` |
| Spinner | `0.9s` | `linear` (the one legit linear — it rotates) |

Signature settle curve: `cubic-bezier(0.22, 1, 0.36, 1)` — a soft, no-bounce
ease-out used for the result entrance. Reach for it when something should
arrive and *settle* rather than snap.

Palette accents that show up in motion (glow/shadow), for reference:
`#7ec8e3` (primary sky blue), `#a8d8ea` (light), `rgba(126,200,227,0.x)`
(everything translucent). Keep animated shadows/glows in this family.

## Existing keyframes

Defined in the `<style>` block at the bottom of `src/App.tsx`. Reuse before
adding new ones.

```css
@keyframes lj-fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes lj-spin    { to { transform:rotate(360deg); } }
@keyframes lj-breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
@keyframes lj-slideUp { from { opacity:0; transform:translateY(30px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
```

- `lj-fadeUp` — general "rise + fade in" for a block appearing.
- `lj-slideUp` — heavier entrance (adds a subtle scale); used for the result view.
- `lj-breathe` — opacity pulse for hint text / loading labels.
- `lj-spin` — the analyzing spinner.

## Entrance on mount (state flip)

The lightest entrance: a boolean set shortly after mount drives an inline
`transition`. This is how the header animates in `App.tsx`.

```tsx
const [entered, setEntered] = useState(false);
useEffect(() => { const t = setTimeout(() => setEntered(true), 150); return () => clearTimeout(t); }, []);

<div style={{
  opacity: entered ? 1 : 0,
  transform: entered ? 'translateY(0)' : 'translateY(18px)',
  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
}}>
```

Use when the element is always mounted and you just want it to arrive gently.

## Keyframe entrance

When a block mounts conditionally (e.g. appears after a photo is picked), a
one-shot keyframe is simpler than a state flip:

```tsx
<div style={{ animation: 'lj-fadeUp 0.5s ease-out' }}>…</div>
```

## Cross-fading phases

Use only when a hard cut between phases reads badly and incoming-only isn't
enough (see SKILL.md). Keep the outgoing phase mounted for its fade by
tracking a `displayPhase` that lags the real `phase`.

```tsx
const [phase, setPhase] = useState<Phase>('home');
const [displayPhase, setDisplayPhase] = useState<Phase>('home');
const [visible, setVisible] = useState(true);

// when phase changes: fade out, swap, fade in
useEffect(() => {
  if (phase === displayPhase) return;
  setVisible(false);                       // start fade-out of current
  const t = setTimeout(() => {
    setDisplayPhase(phase);                // swap content while invisible
    setVisible(true);                      // fade the new one in
  }, 300);                                 // match the CSS duration below
  return () => clearTimeout(t);
}, [phase, displayPhase]);

<div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease-out' }}>
  {displayPhase === 'home'      && <Home … />}
  {displayPhase === 'analyzing' && <Analyzing … />}
  {displayPhase === 'result'    && <Result … />}
</div>
```

Keep the timeout and the CSS duration equal, or the swap shows a flash. If the
incoming view also has its own `lj-slideUp`, drop the outer fade-in (`visible`
back to true instantly on swap) so you don't double-animate.

## Panel open/close (History-style)

For overlays like `HistoryPanel`, animate a backdrop fade + panel slide, and
delay unmount until the close animation finishes so the exit is visible.

```tsx
const [open, setOpen] = useState(true);
const [mounted, setMounted] = useState(true);
const close = () => { setOpen(false); setTimeout(() => setMounted(false), 300); };

{mounted && (
  <div style={{ /* backdrop */ opacity: open ? 1 : 0, transition: 'opacity 0.3s ease' }}>
    <div style={{
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>…</div>
  </div>
)}
```

## Hover / press micro-interactions

The house style uses inline `onMouseEnter`/`onMouseLeave` to mutate style, with
a short `ease` transition already on the element (see the analyze button in
`App.tsx`). Keep hover changes to `opacity`, `background`, `box-shadow`,
`transform: translateY(-1px)`.

```tsx
<button
  style={{ transition: 'all 0.25s' /* … */ }}
  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
/>
```

## prefers-reduced-motion guard

Guard non-essential motion. Two options.

CSS (add once to the `<style>` block; covers all `lj-` animations):

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

React (when you want to branch logic, e.g. skip a big slide):

```tsx
const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const anim = reduce ? undefined : 'lj-slideUp 0.8s cubic-bezier(0.22,1,0.36,1)';
```

## Staggering a list

For several items entering together, offset each with `animation-delay` so they
cascade instead of arriving as a block.

```tsx
{items.map((item, i) => (
  <div key={item.id} style={{
    animation: 'lj-fadeUp 0.5s ease-out both',
    animationDelay: `${i * 60}ms`,   // ~50–80ms/item reads well; keep total < ~0.5s
  }}>…</div>
))}
```

`both` keeps the item at the `from` state during its delay so it doesn't flash
visible first.
