# Local KendoReact Documentation Reference

Casauran uses a **strict local-only** KendoReact documentation corpus.

Canonical path:

```bash
CASAURAN_KENDO_DOCS_PATH=../references/kendo-react-docs/docs/content
```

Recommended workspace:

```text
workspace/
├── casauran-ui/
└── references/
    └── kendo-react-docs/
        └── docs/
            └── content/
```

## Hard rules

- Keep the reference corpus outside the Casauran repository.
- Treat it as read-only documentation reference material.
- Point directly at `docs/content`, not at a full source repository root.
- Do not inspect Kendo implementation source, compiled code, theme source, or private internals.
- Do not use the online GitHub repository as fallback during normal development.
- Do not use live Telerik docs, search engines, tutorials, or model memory as a substitute.
- If the local corpus is missing or invalid, reference analysis is **BLOCKED**.
- Keep pinned repository/commit metadata only for provenance and reproducibility.

Before any reference-analysis stage:

```bash
pnpm reference:check
```
