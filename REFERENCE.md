# Reference Overview

Approved behavioral benchmark:

- `telerik/kendo-react`
- `docs/content`
- `6a05c926c4f08b89782c25336fc159fea3a3f26b`
- captured `2026-08-13`

See `KENDO_REFERENCE_POLICY.md`, `reference/kendo-react-baseline.json`,
`reference/kendo-react-inventory.json`, `reference/reference-map.json`, and
`specs/foundation/reference-baseline.md`.

Reference material informs capability extraction only. Product code is generated from approved independent specifications, not copied/reference implementation source.

`pnpm validate:reference-baseline` verifies repository contracts without requiring the external
snapshot. `pnpm reference:check` resolves the local `docs/content` directory, recomputes the pinned
12,179-file SHA-256 inventory, and verifies all 127 mapped component paths. A mismatch is BLOCKED;
the baseline moves only through `.agent/workflows/reference-sync.md`.
