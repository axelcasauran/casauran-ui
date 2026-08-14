# Rendering Matrix

Every registry entry declares serverRenderable, requiresClient, clientReasons, hydrationSensitive, observer and portal implications. RSC-safe import and client interaction are separate concerns.

F0.10 overlay modules are server-safe to import but portal creation, event listeners, focus, and
inert mutation require post-mount browser invocation. Portal hosts synchronize only governed
theme/density/direction attributes. Positioning observers and animation remain separate stages.

F0.11 animation timing and presence are server-safe pure exports. Preference observation and
native playback require an explicitly supplied browser environment/connected target after mount.
The engine owns no render/unmount operation, DOM insertion, component keyframes, or client
boundary; production SSR imports the compiled package root and hydrates a local fixture.

F0.12 data modules are pure server/client exports with no client directive or browser access.
Production evidence imports the compiled root and renders deterministic processed results entirely
from a Server Component. The engine owns no markup, hydration state, observer, portal, windowing,
remote fetch, loading/error UI, or component server-renderability declaration.

F0.13 i18n modules are pure server/client exports with no client directive, browser locale lookup,
or global state. Production evidence imports the compiled root and renders locale fallback,
direction, plain-text messages, plural/number/date-time formatting, and collation entirely in a
Server Component. Components still own markup, hydration state, locale switching, and `dir`/CSS.

F0.14 date-math modules are pure server/client exports with no client directive, current clock,
system timezone, browser access, or global state. Production evidence imports the compiled root and
renders calendar/range/week and explicit timezone/DST results entirely in a Server Component.
Components still own markup, hydration/state, formatted text, logical CSS, and interactions.

F0.15 axis/grid modules are pure server/client exports with no client directive or browser access.
Production SSR renders deterministic estimated windows from the compiled root. The optional
measurement bridge requires a caller-supplied `ResizeObserver` and elements after mount; it owns no
markup, scroll element, style, event scheduler, hydration state, or browser scroll mutation.

F0.16 target/session/collision/autoscroll calculations are server-safe pure exports with no client
directive or browser-global import behavior. Native capture and frame scheduling require explicit
mounted owners after hydration. Production SSR renders deterministic compiled-root collision/drop
state, while one local client fixture proves pointer, keyboard, touch event, autoscroll and cleanup
behavior without establishing DOM, preview, style, or public component contracts.
