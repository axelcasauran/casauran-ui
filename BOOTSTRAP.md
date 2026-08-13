# Bootstrap
Prerequisite: Node 24 LTS and Corepack.

```bash
corepack enable
pnpm install
node scripts/verify-scaffold.mjs
pnpm exec playwright install --with-deps
pnpm validate
```

Commit the generated `pnpm-lock.yaml` immediately. CI uses frozen lockfile when present. Begin Phase 0, not Button.
