# visual-tests

Next.js App Router host on port 3103. Purpose: deterministic browser and visual-test galleries.

Routes are Server Components by default; client components are introduced only where interaction requires them.

The browser gate builds this host, starts it with `next start`, and runs Chromium, Firefox, and
WebKit. `/infrastructure` is an internal SSR/hydration probe, not a supported component or consumer
API. Product stages add deterministic scenario routes and reviewed visual baselines here.

`/theme-runtime` is the deterministic F0.06 matrix for light/dark, comfortable/compact, RTL
logical spacing, reduced motion, forced colors, detached scopes, and cross-browser screenshots. It
is internal evidence, not a public component or consumer API.

`/accessibility-foundation` is the internal F0.07 production-browser probe for SSR semantics,
accessibility-tree roles/names/states, RTL roving focus, disabled skipping, IME composition,
visible focus, tabbability, programmatic focus, text-only announcements, and visually hidden
content. It does not expose a public component.

`/react-state-foundation` is the F0.08 production SSR/hydration probe for the supported
`@casauran/react/state` entry point. It verifies controlled/uncontrolled ownership, composed
functional updates, committed callback identity/content, hydration readiness, and stable explicit
and generated IDs. It is evidence, not a public component.

`/collection-engine` is the F0.09 server-only probe for the compiled internal collections entry
point. It verifies deterministic visible-tree, active-item, selection, and typeahead projections;
it adds no React client boundary or public component.

`/overlay-foundation` is the F0.10 production SSR/browser probe for the compiled internal overlay
entry point. Its local client fixture verifies portal scope/cleanup, nested dismissal, focus
containment/restoration, and inert isolation. It is engine evidence, not a public overlay component.
