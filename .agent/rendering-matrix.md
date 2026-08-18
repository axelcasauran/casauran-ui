# Rendering Matrix

Typography `1.04` is server-renderable from the package root with no client boundary and no
hydration state. It reads no browser global at module evaluation or during render and holds no
effect, observer, listener, timer, portal, random value, or current-time read, so server and client
markup are identical and it contributes nothing to the client bundle. It generates no identifier, so
`useStableId` is not involved. Verified in the production visual-tests, documentation and playground
Next hosts, with a browser case asserting the text is present in the server response itself.

SVGIcon `1.03` is server-renderable from the package root with no client boundary and no hydration
state. It reads no browser global at module evaluation and holds no effect, observer, listener,
timer, portal, random value, or current-time read, so server and client markup are identical and it
contributes nothing to the client bundle. It generates no identifier, so `useStableId` is not
involved. A definition is a plain object, so artwork declared in a server module passes to a client
component unchanged. Verified in the production visual-tests and documentation Next hosts.

Icon `1.02` is server-renderable from the package root with no client boundary and no hydration
sensitivity. It reads no browser global during module evaluation or render and creates no observer,
portal, listener, timer, storage, random source, or network activity. The production visual host
renders deterministic known and unknown names across Chromium, Firefox, and WebKit. The 2026-08-16
capability revalidation added a browser assertion that the glyph is present in the server response
itself, so a future client boundary cannot be introduced without failing the gate.

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

Button `1.01` is server-renderable and exported from the server-safe package root through a narrow
implementation-level client boundary. Client behavior is required for activation handler
composition and optional uncontrolled pressed state. Equal props produce hydration-stable native
markup; no browser global is read during module evaluation/render, and no observer, portal, random
source, timer, storage, or network access exists. Production Next SSR markup and hydration run in
Chromium, Firefox, and WebKit without console or page errors. The 2026-08-15 capability
revalidation recorded that Casauran covers the reference's separate, since-discontinued server
component distribution from this one package instead: the App Router is the primary supported host,
not an experimental variant.
