# Package Ownership

Capability ownership follows `ARCHITECTURE.md`. Behavior lives at the lowest reusable owner
without importing a higher visual layer. Public React composition remains in `@casauran/react`.
Repository review roles and current role holders are authoritative in
`.agent/repository-governance.json`.

## Repository contract ownership

| Surface                                                                | Accountable roles                                                         |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Constitution, accepted ADRs, governance contract, stage order          | Maintainer                                                                |
| Architecture, package, dependency, API, Next.js, and security policies | Maintainer plus affected domain owner; security reviewer where applicable |
| Registry schemas and canonical inventory                               | Maintainer plus affected domain owner                                     |
| Stage ledger and close evidence                                        | Domain owner, evidence reviewer, maintainer                               |
| CI and repository automation                                           | Maintainer; security reviewer for credentials and permissions             |
| Changesets, compatibility, migration, and releases                     | Release manager plus maintainer                                           |

The Agent Operating System contract, execution protocol, prompts, workflows, and skills are
jointly accountable to the maintainer and evidence-reviewer roles. Domain specialists contribute
checklist content, but cannot override repository authority or create an alternate protocol.

The mechanical-governance policy, registry/schema, validator entry points, pre-install runner, and
gate-wiring tests are jointly accountable to the maintainer and evidence-reviewer roles. Each
catalogued validator also names the domain, security, or release roles required by the contracts it
enforces. Mechanical ownership permits enforcement of accepted contracts, not architectural change.

Build/test policy, root runner configuration, CI, host topology, emitted-output verification, and
generated-artifact hygiene are jointly accountable to the maintainer and evidence-reviewer roles.
Domain owners own tests under their packages and scenarios; `@casauran-internal/testing` owns only
reusable internal test helpers, not root orchestration or product behavior. The visual-test app owns
test-host routes and may not create consumer exports.

## Capability package ownership

| Package                             | Owned capability                                                   |
| ----------------------------------- | ------------------------------------------------------------------ |
| `@casauran-internal/core`           | IDs, controllable state, invariants, browser-safe utilities        |
| `@casauran-internal/accessibility`  | Focus, roving focus, live regions, keyboard primitives             |
| `@casauran-internal/events`         | Event composition and project event conventions                    |
| `@casauran-internal/commands`       | Commands and history primitives                                    |
| `@casauran-internal/collections`    | Registration, active item, selection, tree collections             |
| `@casauran-internal/overlay`        | Portal, dismissal, and focus lifecycle                             |
| `@casauran-internal/positioning`    | Geometry, collision, and placement                                 |
| `@casauran-internal/virtualization` | Windowing, measurement, anchoring, and overscan                    |
| `@casauran-internal/data`           | Filter, sort, group, aggregate, page descriptors and processing    |
| `@casauran-internal/i18n`           | Locale, messages, numbers, plurals, and direction                  |
| `@casauran-internal/date-math`      | Date, range, calendar, time arithmetic, and timezone seam          |
| `@casauran-internal/drag-drop`      | Pointer drag/drop and autoscroll                                   |
| `@casauran-internal/animation`      | CSS and WAAPI motion primitives                                    |
| `@casauran-internal/forms`          | Native form, form state, and validation contracts                  |
| `@casauran-internal/serialization`  | Versioned persistence structures                                   |
| `@casauran-internal/recurrence`     | Recurring-event rules                                              |
| `@casauran-internal/formula`        | Spreadsheet expression engine                                      |
| `@casauran-internal/drawing`        | Geometry and vector primitives                                     |
| `@casauran-internal/charting`       | Chart models, scales, layout, and rendering                        |
| `@casauran-internal/files`          | File metadata, validation, and transport contracts                 |
| `@casauran-internal/export`         | Export models and integrations                                     |
| `@casauran-internal/ai-core`        | Optional provider-neutral AI contracts                             |
| `@casauran/react`                   | Supported public React component surface and canonical composition |
| `@casauran/tokens`                  | Supported public token contract                                    |
| `@casauran/theme`                   | Supported public static theme contract                             |
| `@casauran/icons`                   | Supported public icon definitions and provenance                   |

Testing helpers are owned by `@casauran-internal/testing`. Next.js hosts under `apps/` prove
integration but do not own reusable component or engine behavior. A change that crosses owners
identifies one primary owner and obtains review from every materially affected owner.

The theme owner maintains the versioned assignment registry, generated static stylesheet,
light/dark and comfortable/compact contracts, cascade order, adaptive media assignments, public
attribute helpers, and documented override/portal inheritance seams. It does not own application
preference persistence, overlay mechanics, component styles, or accessibility behavior engines.

The accessibility owner maintains native focus/tabbability inspection, pure roving-focus and
direction-aware keyboard intent, safe live-region text updates, and visually-hidden CSS. React
hooks/state remain with the React state foundation, registration/selection with collections,
focus traps/restoration lifecycle with overlay, and pattern semantics with public components.
