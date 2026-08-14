# Animation Foundation Specification

Status: approved for F0.11 implementation

## Scope and ownership

F0.11 defines the internal framework-neutral motion lifecycle for finite timing normalization,
reduced-motion observation, Web Animations API playback, keyed interruption ownership, and pure
presence state. The owner is `@casauran-internal/animation`. It uses native browser APIs with no
external runtime dependency and no React or public component API.

The token/theme owners remain authoritative for duration/easing variables and reduced-motion CSS.
Component stages choose independently designed keyframes and effects. Overlay owns portal,
dismissal, focus, and inert lifecycle; positioning owns geometry/observation; gesture/scroll/drag
owners retain their own interaction domains.

## Motion timing

`parseMotionTime` accepts trimmed finite CSS time text in `ms` or `s`, rejects negative,
non-finite, unitless, calc/expression, and unsupported-unit input, and returns milliseconds.
`resolveMotionTiming` accepts caller-supplied token-resolved duration plus optional delay, end
delay, easing, fill, direction, and finite iteration count. It validates finite nonnegative time
and iteration values and returns an immutable native timing record.

When reduced motion is active, duration, delay, and end delay resolve to zero and iterations to
one while fill/direction/easing remain deterministic. No hidden engine default substitutes for
the semantic motion tokens; callers resolve CSS variables or pass numeric values at their owner
boundary.

## Reduced-motion preference

`getReducedMotionPreference` reads an explicitly supplied Window's
`(prefers-reduced-motion: reduce)` media query. `createReducedMotionController` owns one
MediaQueryList listener, exposes the current boolean preference, notifies only real changes, and
removes the listener idempotently on disposal. Browser globals are never read at module evaluation.

System preference is an accessibility minimum, not an application personalization ceiling. A
caller may additionally force reduced motion and passes the combined boolean to timing/playback.
The engine does not persist preferences or override the theme's reduced-motion CSS contract.

## Web Animations playback

`playElementAnimation` requires a connected same-realm Element with native `animate`, caller-owned
keyframes, and validated motion timing. It returns a handle with the native animation, observable
`running | finished | cancelled` state, a never-rejecting completion promise, and idempotent
`finish`/`cancel` operations. An optional AbortSignal cancels playback and is detached at terminal
settlement.

Reduced/zero-duration playback applies the final WAAPI effect immediately by calling native
`finish`; it does not use a timeout or wait for an animation frame. Finish/cancel settle exactly
once and late native events cannot change the terminal result.

## Animation registry

`createAnimationRegistry` owns active animation handles by `string | number | symbol` key. Playing
a new animation under an existing key cancels the old handle before replacement. Terminal cleanup
is token-aware, so completion from an interrupted animation cannot remove its replacement. The
registry supports get, cancel, finish, clear, size, and complete disposal; disposal prevents new
playback.

The registry coordinates ownership only. It does not sequence choreography, choose keyframes,
measure layout, mutate component state, or infer semantic presence.

## Presence state

Presence is an immutable pure state `{ phase, mounted, revision }` with phases `unmounted`,
`entering`, `entered`, and `exiting`. `transitionPresence` begins/reverses enter or exit while
incrementing the revision. `completePresence` accepts a captured revision and ignores stale,
duplicate, or non-transitional completion. An exit completes to unmounted; an enter completes to
entered.

Presence has no timer, DOM, rendering, effect, or callback ownership. A component retains content
while `mounted`, starts its selected playback, and submits that revision when playback finishes or
cancels according to its product policy.

## Accessibility and interaction requirements

All nonessential animation must honor the resolved reduced-motion preference and the theme's
semantic zero-duration media assignments. Reduced motion reaches the same final content/state
without delay, repeated iteration, hidden focus target, or lost completion. Animation cannot be
required to understand status, order, focus, or an interaction result.

The engine renders no semantic role/name/state, focus behavior, keyboard/pointer/touch mapping,
announcement, or visible focus. Component stages still verify reduced motion, forced colors,
zoom/reflow, interruption, focus, and complete input-modality behavior. IME and localization are
not interpreted by this non-textual lifecycle.

## SSR, security, and performance

Pure timing and presence modules execute on the server. Browser access occurs only when explicitly
calling preference or playback factories with browser-owned objects. Package import performs no
DOM/media-query read, listener, random ID, timer, storage, network, or React operation.

Keyframes and timing are trusted application configuration and may cause browser style/resource
processing; this internal engine is not a sanitizer for untrusted CSS. Public components must not
pass untrusted strings into keyframes/easing. The engine performs no HTML, URL, SVG, code
execution, serialization, or content rendering itself.

Timing/presence operations and keyed lookup are constant-time. Registry clear/dispose are linear
in active handles. A deterministic 1,000-key interruption test guards cleanup/ownership semantics;
browser evidence runs short transform/opacity effects and makes no universal frame-rate, latency,
memory, or bundle claim. Component performance budgets use their real rendered scenarios.

## Compatibility and integration

The package remains private/internal with one compiled root export and no runtime dependencies.
A production Next.js Server Component imports pure timing/presence functions, while one local
client fixture invokes preference and WAAPI lifecycle after hydration. Browser evidence verifies
normal/reduced motion, terminal state, abort/cancel, keyed interruption, presence revisions, and
console/page error freedom across Chromium, Firefox, and WebKit.

## F0.12 boundary

F0.12 owns the data engine. F0.11 introduces no data descriptor/processing/transport, public
Expand/Fade/Push/Reveal/Slide/Zoom/Ripple component, React hook/context/transition group,
component effect preset, CSS/keyframe stylesheet, geometry engine, gesture physics, scroll-driven
timeline, view transition, animation worklet, or future-stage public API.
