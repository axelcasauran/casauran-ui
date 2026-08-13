# Next.js Compatibility

Next.js App Router is the primary host. Routes default to Server Components; client boundaries are local. No broad package-root `'use client'`. Server-safe exports avoid browser globals at module evaluation. SSR output, IDs and theme attributes are hydration-stable. Observers/listeners begin after mount.

The project verifies production `next build` and runtime smoke paths. Do not create a duplicate server-component library by default; design server capability into component boundaries.
