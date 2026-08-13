# visual-tests

Next.js App Router host on port 3103. Purpose: deterministic browser and visual-test galleries.

Routes are Server Components by default; client components are introduced only where interaction requires them.

The browser gate builds this host, starts it with `next start`, and runs Chromium, Firefox, and
WebKit. `/infrastructure` is an internal SSR/hydration probe, not a supported component or consumer
API. Product stages add deterministic scenario routes and reviewed visual baselines here.
