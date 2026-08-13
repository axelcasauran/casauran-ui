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
