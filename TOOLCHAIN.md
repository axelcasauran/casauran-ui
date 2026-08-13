# Toolchain Snapshot

- Node: >=24.18.0 <27
- pnpm: 11.17.0
- Next.js: 16.2.11 (stable Active LTS line selected)
- React/ReactDOM: 19.2.7
- TypeScript: 6.0.3
- ESLint: 10.8.0
- typescript-eslint: 8.65.0
- Prettier: 3.9.6
- Vitest: 4.1.0
- Playwright: 1.62.0
- Changesets: 2.31.0
- dependency-cruiser: 18.1.0

TypeScript intentionally stays on the newest stable line inside current typescript-eslint's documented support range. Move to TypeScript 7 only after lint tooling officially supports it and CI proves compatibility.
