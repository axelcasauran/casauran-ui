# Documentation Policy

Every supported component documents purpose/import/basic use, variants/states, controlled/uncontrolled behavior, API/events, accessibility/keyboard, theming, RTL, SSR/Next.js, i18n, performance/security caveats when relevant, integrations/troubleshooting and migration when relevant.

Examples use supported public API and should be executable in docs/playground/visual-test hosts.

`apps/docs` is the canonical customer documentation experience and composes the F0.18 shell and
private documentation primitives. Component stages add stable `/components/<slug>` routes,
explicit section anchors, registry-derived search metadata, executable examples/source, API,
accessibility/keyboard, theme/RTL, and SSR structures without forking the shell. `apps/playground`
remains an engineering sandbox and is never the primary customer documentation portal.
