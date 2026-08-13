## Mandatory local reference preflight

Before step 2 of this prompt:

```bash
pnpm reference:check
```

Use only `CASAURAN_KENDO_DOCS_PATH` (default `../references/kendo-react-docs/docs/content`) for KendoReact reference analysis.

Do not browse the online KendoReact repository or live documentation as fallback. If the local reference check fails, stop this stage as BLOCKED.

# Component Stage Prompt

Execute only `{{STAGE_ID}} — {{COMPONENT}}`.

1. Read AGENTS, stage, ADRs/policies/skills.
2. Read approved pinned public reference pages.
3. Extract observable features/cross-cutting requirements only.
4. Never copy source/CSS/assets/class names/private architecture/undocumented internals.
5. Write independent spec.
6. Update registry/feature parity.
7. Review canonical composition/shared engines; extend owner layer instead of duplicating.
8. Design independent API under API_GOVERNANCE.
9. Implement exactly this one public component.
10. Add applicable unit, browser, keyboard, a11y, SSR/hydration, RTL, i18n/IME, visual, performance/security tests.
11. Add tokens/styles and theme verification.
12. Add Next docs/playground/visual stories.
13. Run `pnpm validate`.
14. Run parity audit.
15. Update evidence/status.
16. Stop.
