# Specifications

Specifications are created when their stage begins, after reference analysis. Future component specs
are intentionally not prefilled because that would bypass the clean-room workflow.

Use the complete templates under `specs/templates/`.

Complex widgets create a folder under `specs/components/<slug>/` and use the complex-widget
architecture template plus feature/state/interaction/keyboard/performance/security documents.

## Foundation contracts

Foundation contracts live under `specs/foundation/` and use `specs/templates/engine.spec.md`.
Every foundation specification opens with a governed two-line header:

```text
Stage: `F0.09`
Status: implemented
```

`Status` is `approved` while its stage is `not-started` or `in-progress`, and `implemented` once
the stage is `complete`. The binding between a stage and its specification is declared in
`.agent/foundation-specifications.json` and enforced by `pnpm validate:foundation-specs`, which
also rejects an unbound specification file, a foundation stage with no binding, a status that
contradicts the stage ledger, and a specification that does not close by naming what it leaves to
another owner.

`F0.01`–`F0.04` own governance and infrastructure contracts rather than capability specifications
and are declared exempt with a recorded reason. The remaining fourteen stages each own exactly one
specification:

| Stage   | Specification                 | Owned capability                                       |
| ------- | ----------------------------- | ------------------------------------------------------ |
| `F0.05` | `tokens.md`                   | primitive and semantic token vocabulary                |
| `F0.06` | `css-theme-runtime.md`        | static stylesheet, theme/density, cascade contract     |
| `F0.07` | `accessibility.md`            | focus, roving focus, keyboard intent, live regions     |
| `F0.08` | `react-state.md`              | controllable state, committed callbacks, stable IDs    |
| `F0.09` | `collection-engine.md`        | snapshots, registration, active item, selection, tree  |
| `F0.10` | `overlay.md`                  | portals, layer stack, dismissal, focus scope, inert    |
| `F0.11` | `animation.md`                | motion timing, reduced motion, WAAPI, presence         |
| `F0.12` | `data-engine.md`              | filter, sort, group, aggregate, page descriptors       |
| `F0.13` | `internationalization.md`     | locale, direction, messages, plurals, formatting       |
| `F0.14` | `date-math.md`                | calendar, range, wall time, ISO week, timezone seam    |
| `F0.15` | `virtualization.md`           | windowing, measurement, anchoring, overscan, 2D        |
| `F0.16` | `drag-drop.md`                | sessions, drop targets, capture, keyboard, autoscroll  |
| `F0.17` | `reference-baseline.md`       | pinned provenance, corpus inventory, component mapping |
| `F0.18` | `documentation-experience.md` | canonical docs shell, primitives, registry metadata    |
