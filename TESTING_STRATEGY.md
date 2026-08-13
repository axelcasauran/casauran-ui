# Testing Strategy

Testing forms a pyramid with contract-appropriate layers:

- pure engines/state: Vitest;
- component interaction/layout/focus/pointer/touch: Playwright real browsers;
- Next.js integration: production build + SSR/hydration/RSC-safe import routes;
- visual regression: deterministic galleries/stories;
- performance: scenario-specific benchmarks;
- security: negative tests at trust boundaries;
- accessibility: automation plus manual review for complex patterns.

The project avoids duplicating assertions merely for coverage percentages. Tests are tied to independent specifications and defect/regression risk.

Execution is centralized: `pnpm test:contracts` runs Node contract tests once, `pnpm test:unit`
runs repository-root Vitest discovery once, and `pnpm test:browser` builds and exercises the
production visual-test host in all configured engines. `pnpm typecheck` includes workspaces, tests,
and runner configuration. Build output verification checks ESM, declarations, and maps after every
root build.
