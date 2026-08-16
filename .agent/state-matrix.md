# State Matrix

## Icon (`1.02`)

Icon covers known/unknown definition, decorative/labelled semantic mode, seven sizes, seven tones,
and four flip states. It owns no controlled/uncontrolled, disabled, loading, validation, selection,
expanded, open, empty, error, or interaction state. The 2026-08-16 capability revalidation made two
invalid states unreachable through types — a name outside the catalog, and a passthrough `role`,
`aria-hidden`, `aria-label` or `tabIndex` that would contradict the semantics `label` derives — and
resolved a third at render: a blank or whitespace-only `label` stays decorative rather than
producing an image with an empty accessible name. The `info` tone was removed because it resolved to
the same colour as `accent`, so two public state values were indistinguishable.

Every spec enumerates applicable visual, interaction, controlled, validation, loading/empty, disabled/read-only, selected/expanded/open and error states. Prevent invalid combinations through API/types where practical.

## Button (`1.01`)

Button covers enabled, hover, active, focus-visible, disabled, controlled pressed, uncontrolled
pressed, and consumer-cancelled activation states. Toggle-only props are a discriminated public
type requiring `toggleable: true`; `false` remains a valid controlled pressed value. Loading,
validation, read-only, expanded, open, empty, and error states are not Button-owned. The 2026-08-15
capability revalidation confirmed by unit evidence that a controlled Button renders exactly the
pressed value its owner supplies, including while disabled, and that ordinary action mode emits no
pressed state at all.
