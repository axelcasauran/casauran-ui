# KendoReact Reference Policy

Approved baseline:

- repository `telerik/kendo-react`
- path `docs/content`
- commit `6a05c926c4f08b89782c25336fc159fea3a3f26b`
- captured `2026-08-13`
- purpose: functional/behavioral benchmark only.

Allowed: inventory public docs, extract observable capabilities, keyboard/a11y behavior, supported use cases/integrations, edge cases, derive independent tests/specs.
Forbidden: copying source, CSS/theme source/values, assets, bundles, decompilation, private architecture or undocumented DOM/class internals.

Clean-room boundary: reference → feature notes → independent spec → API → implementation.

The baseline never moves automatically. Use reference-sync workflow to review upstream changes before scope changes.

Snapshot identity is pinned by `reference/kendo-react-inventory.json`: SHA-256 digests cover every
regular file's relative path, byte count, and exact content, grouped by top-level documentation
domain. `reference/kendo-react-baseline.json` repeats the aggregate summary. A matching provenance
commit without a matching snapshot digest is not an approved baseline.

## Local-only access rule

Normal Casauran reference analysis MUST use the external local documentation corpus:

```bash
CASAURAN_KENDO_DOCS_PATH=../references/kendo-react-docs/docs/content
```

The repository and commit recorded in `reference/kendo-react-baseline.json` are retained for provenance only.

**Online fallback is disabled.**

Agents MUST NOT compensate for a missing local corpus by browsing:

- the KendoReact GitHub repository;
- live Telerik/KendoReact documentation;
- search engines;
- tutorials or Q&A;
- model memory.

Before reference analysis, run `pnpm reference:check`. If it fails, the stage is BLOCKED.

The local corpus must point specifically to `docs/content`, not a repository root containing implementation source.

## Local corpus update rule

Updating the local docs corpus is deliberate maintenance:

1. update the external corpus;
2. record its intended upstream provenance;
3. run `pnpm reference:check`;
4. execute `.agent/workflows/reference-sync.md`;
5. classify changes;
6. approve/defer product-scope changes;
7. regenerate the inventory and update pinned baseline metadata only after approval;
8. run `pnpm validate:reference-baseline` and `pnpm reference:check`.

A changed local corpus never silently changes an active component stage.
