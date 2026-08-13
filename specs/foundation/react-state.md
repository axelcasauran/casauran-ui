# React State Foundation Specification

Status: approved for F0.08 implementation

## Scope and ownership

F0.08 defines the project-wide state primitives used by later React component stages. Pure value,
update, and ID rules belong to `@casauran-internal/core`. Hooks belong to the supported
`@casauran/react/state` client entry point. The `@casauran/react` root remains free of client
directives and does not re-export hooks.

## Framework-neutral state resolution

`isControlledValue` treats every value except `undefined` as controlled, including `null`, `false`,
zero, and an empty string. `resolveControllableValue` returns the controlled value when present and
otherwise returns internal state. `resolveStateUpdate` accepts either a replacement or functional
update and never depends on React types. These functions are deterministic and side-effect free.

## Controlled and uncontrolled React state

`useControllableState` accepts `value`, required `defaultValue`, and optional `onChange`. It returns
the current value and a stable setter. In controlled mode the setter requests change without
mutating an internal source of truth. In uncontrolled mode it updates internal state. Functional
updates resolve from the latest committed value and compose within the same event. `onChange` runs
only when the resolved value is not `Object.is` equal to the current value.

Changing between controlled and uncontrolled modes during one mounted lifetime is unsupported.
Components must choose one ownership mode and follow `value/defaultValue` naming. State that can
legitimately use `undefined` as a controlled value must model ownership explicitly at its component
API instead of overloading this hook.

## Committed callbacks

`useCommittedCallback` returns one stable function identity and invokes only the latest callback
from a committed render. Ref synchronization occurs in a layout effect, preventing an abandoned
concurrent render from leaking an uncommitted callback. An omitted callback produces `undefined`
without throwing. The hook is for event/lifecycle callbacks, not render-time invocation.

## Hydration and stable IDs

`useHydrated` returns `false` during SSR and the first hydration render, then `true` after the
client effect. It is lifecycle state, not a general derived-state mechanism. Consumers use it only
when behavior truly requires the mounted browser; semantic server output must remain useful.

`useStableId` always calls React `useId`. An explicit ID is returned byte-for-byte. Otherwise the
generated React ID is normalized with the default `csn` or caller-supplied prefix through the core
ID contract. Identical server/client trees therefore produce identical IDs without randomness,
module counters, browser globals, or effects.

## Accessibility and interaction requirements

These hooks render no semantics and own no keyboard, pointer, touch, focus, ARIA, or IME behavior.
They must preserve state and IDs used by owning components without creating duplicate sources of
truth or hydration mismatches. Component stages remain responsible for semantic output, state
relationships, focus, announcements, and interaction policy.

## SSR, RSC, security, and performance

Core modules are server safe. `@casauran/react/state` is an explicit local client boundary; the
package root remains RSC-safe. Server rendering of hook consumers is supported and produces the
uncontrolled default or controlled value, `false` hydration state, and stable IDs. No browser
global is accessed at module evaluation.

Values and callbacks are application-owned trusted code, not deserialized or executable data. The
foundation performs no HTML, URL, storage, network, file, clipboard, or serialization operation.
Updates are constant-time; hooks allocate bounded refs/callbacks per mounted consumer. No universal
render-speed or bundle-size claim is made.

## Compatibility and integration

The contract uses the repository-pinned React peer range and strict TypeScript settings. It has no
new runtime dependency. Examples and browser evidence use a minimal Next.js client probe nested in
a Server Component route. The data-binding platform parity registry remains `unreviewed` because
this is independent platform infrastructure, not reference analysis.

## F0.09 boundary

F0.09 owns ordered/tree registration, active item, selection, disabled item policy, and typeahead.
F0.08 does not add a collection, reducer framework, global store, context abstraction, overlay
state, form state, persistence, component state machine, or public component.
