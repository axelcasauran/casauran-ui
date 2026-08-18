# State Matrix

## Label (`1.05`)

Label owns no state: no controlled or uncontrolled value, no default or initial state, no
transition, no event, no async behaviour and no reset, so `useControllableState` is not involved and
there is no dual source of truth. `invalid` and `disabled` are reflections of the editor's state
rather than sources of it — Label never disables anything and never marks anything invalid — and the
specification says so because the opposite assumption is the likely misuse. Emptiness is derived
from the `children` value, using the four values React itself renders as nothing, rather than from
what the tree eventually produces. Invalid combinations are unreachable through types: `requirement`
is a closed union, and the marker and its text are a discriminated pair, so a marker without text
and text without a marker are both compile errors; React's raw-markup escape hatch, `color` and
`role` are rejected because each would contradict semantics the component owns. The one state
interaction the component resolves rather than reflects is precedence: a caption that is both
disabled and invalid presents as disabled, because an editor the user cannot change should not be
presented as a problem to fix, and both values stay reflected so the full state is still observable.

## Typography (`1.04`)

Typography owns no state at all: no controlled or uncontrolled value, no default or initial state,
no transition, no event, no async behaviour, no reset, and no disabled, read-only, loading,
validation, selection, expanded or open mode. `useControllableState` is not involved and there is no
dual source of truth. Every prop is a pure presentational input resolved during render, and the two
derived resolutions — the element from the role and the role from the element — are pure functions
of the props, computed identically on the server and the client. Invalid states are unreachable
through types: the element, role, size, weight, alignment, casing, tone and spacing vocabularies are
closed unions, the spacing object accepts only logical sides, and React's raw-markup escape hatch,
`color`, `role` and `aria-level` are rejected because each would contradict semantics the component
derives from `as` and `tone`. The rendered states this component does cover — fourteen elements,
eleven roles, four defaulting combinations, seven sizes, four weights, four alignments, four casing
values, eight tones and six spacing steps on four logical sides — are each rendered and asserted.

## SVGIcon (`1.03`)

SVGIcon covers the default drawing, each of three variant drawings, the variant fallback,
decorative and labelled semantic mode, the blank-label guard, the unusable-definition state, seven
sizes, seven tones, and four flip states. It owns no controlled/uncontrolled, disabled, loading,
validation, selection, expanded, open, or interaction state, so `useControllableState` is not
involved and there is no dual source of truth. Invalid states are unreachable through types wherever
practical: the variant, size, tone and flip vocabularies are closed unions, `variants` keys are
constrained to the governed names, and `role`, `aria-hidden`, `aria-label`, `tabIndex`, `children`
and `color` are rejected because they would contradict semantics the component derives from `icon`,
`tone` and `label`. The two states a type cannot reach — a definition that crossed a runtime boundary
and a variant a definition does not ship — are resolved at render: the first fails closed with no
artwork and no `data-icon-name`, the second falls back to the default drawing and reports `default`
in `data-variant` so the fallback is observable rather than silent.

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
