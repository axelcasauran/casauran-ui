# Next.js Compatibility

Next.js App Router is the primary host. Routes default to Server Components; client boundaries are local. No broad package-root `'use client'`. Server-safe exports avoid browser globals at module evaluation. SSR output, IDs and theme attributes are hydration-stable. Observers/listeners begin after mount.

The project verifies production `next build` for all four hosts and runs Playwright against
`next start` for the visual-test host. The infrastructure probe checks server-rendered markup and a
local hydrated client boundary without runtime console/page errors. Do not create a duplicate
server-component library by default; design server capability into component boundaries.

Theme attributes are resolved explicitly at the server boundary and rendered on `<html>` or a
nested scope. `getThemeAttributes` is browser-free and Server Component safe. Applications must
avoid choosing a different theme during the first client render; client switching happens only
after hydration through the documented attributes. The static stylesheet has no client boundary.

Accessibility engine modules are safe to import during server evaluation. Pure keyboard, roving,
and live-region attribute helpers do not read browser globals. DOM focus/tabbability work begins
only when the caller invokes those functions after a node exists; the package root has no client
directive or React dependency.
