# State Matrix

## Icon (`1.02`)

Icon covers known/unknown definition, decorative/labelled semantic mode, seven sizes, eight tones,
and four flip states. It owns no controlled/uncontrolled, disabled, loading, validation, selection,
expanded, open, empty, error, or interaction state.

Every spec enumerates applicable visual, interaction, controlled, validation, loading/empty, disabled/read-only, selected/expanded/open and error states. Prevent invalid combinations through API/types where practical.

## Button (`1.01`)

Button covers enabled, hover, active, focus-visible, disabled, controlled pressed, uncontrolled
pressed, and consumer-cancelled activation states. Toggle-only props are a discriminated public
type requiring `toggleable: true`; `false` remains a valid controlled pressed value. Loading,
validation, read-only, expanded, open, empty, and error states are not Button-owned. The 2026-08-15
capability revalidation confirmed by unit evidence that a controlled Button renders exactly the
pressed value its owner supplies, including while disabled, and that ordinary action mode emits no
pressed state at all.
