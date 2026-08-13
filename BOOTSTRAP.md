# Bootstrap

Prerequisite: Node 24 LTS and Corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
node scripts/verify-scaffold.mjs
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm validate
```

The committed `pnpm-lock.yaml` is mandatory; CI never falls back to an unlocked install. Begin
Phase 0, not Button.

## External reference corpus

Before Phase 0 exits, configure:

```bash
CASAURAN_KENDO_DOCS_PATH=../references/kendo-react-docs/docs/content
pnpm reference:check
```

A failed reference check blocks any stage that requires KendoReact reference analysis.
