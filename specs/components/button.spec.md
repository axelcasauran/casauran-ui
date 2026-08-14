# Component Specification: Button

## Provenance

Public behavioral input is the pinned local corpus recorded in `button.reference-analysis.md`.
The reference preflight passed for the repository snapshot; all examined relative paths are listed
there. This specification is an independent Casauran contract.

## Purpose and scope

Button owns the platform's canonical action semantic. It renders one native `<button>` for
commands, explicit form submission/reset, and optional binary pressed-state actions. It supports
text, decorative leading/trailing content, and icon-only layout.

Non-goals are link navigation, menus, split/dropdown behavior, grouped selection, floating action
placement, asynchronous loading orchestration, icon definition/rendering, and arbitrary
polymorphic elements. Those belong to later stages or caller composition.

## Observable capabilities

- Native enabled, disabled, hover, active, focus-visible, and form states.
- Optional controlled or uncontrolled toggleable mode with a pressed state.
- `sm`, `md`, and `lg` sizes; `none`, `sm`, `md`, `lg`, and `full` radii.
- `solid`, `soft`, `outline`, `ghost`, and `link` appearances.
- `neutral`, `accent`, `positive`, `caution`, `critical`, and `inverse` tones.
- Main content plus decorative `startContent` and `endContent` slots.
- Explicit icon-only geometry while preserving a caller-supplied accessible name.
- Stable state data attributes and one documented root styling hook.

## Anatomy and composition

Button renders one native `<button>` root, optional non-interactive start/end spans, and one content
span. Button is the semantic primitive owner, so no lower public component is required and the
native element is not a composition exception. Later ButtonGroup, Toolbar, Upload, Editor, and
other composites must reuse this Button when they need this semantic action.

The React package owns rendering and state coordination. The React state foundation owns
controlled/uncontrolled mechanics. The events package owns cancellable event composition. Tokens
and theme own public custom-property defaults. No new runtime dependency is required.

## State model

Ordinary mode is stateless. Toggleable mode is explicit through `toggleable: true` and supports:

- uncontrolled state from `defaultPressed` (default `false`);
- controlled state from `pressed`;
- `onPressedChange` intent after an uncancelled activation;
- no internal controlled-state mutation;
- no pressed-state transition when disabled or when the caller cancels `onClick`.

Switching controlled ownership while mounted is unsupported under the shared state contract.
`aria-pressed` and `data-pressed` reflect the committed rendered state.

## Interaction model

Pointer, touch, Enter, and Space activation are delegated to the native button. The consumer's
native `onClick` runs before the internal toggle transition; `preventDefault()` cancels the toggle
intent. IME composition introduces no special path because Button owns no text input and relies on
native activation. Disabled buttons are not focusable or activatable. Explicit `type="submit"` and
`type="reset"` retain native form behavior; the safe component default is `type="button"`.

## Accessibility

- Semantic element: native `<button>`; no redundant `role`.
- Name: visible content or a caller-supplied `aria-label`/`aria-labelledby`. `iconOnly` requires the
  consumer to provide an accessible name and is documented and tested.
- State: native `disabled`; `aria-pressed` only in toggleable mode.
- Keyboard: Tab enters regular document order; Enter/Space natively activate; no custom key trap.
- Focus: a high-contrast `:focus-visible` indicator is never removed.
- Decorative slots are `aria-hidden` and cannot contain interactive content.
- Minimum target block size is at least 44 CSS pixels in comfortable `md`/`lg` presentation; the
  compact and `sm` presentations remain usable and are documented for dense desktop contexts.
- Logical layout supports RTL without reversing content strings.
- Forced colors use system colors and preserve border/focus/pressed distinction. Reduced motion
  removes transition duration through the theme token.
- At 200% zoom and narrow widths, content wraps only when the consumer allows it; the button does
  not create viewport overflow by itself.

Manual review checks role/name/state, keyboard-only use, focus visibility, pressed and disabled
distinction, light/dark, RTL, forced colors, reduced motion, zoom/reflow, and touch target behavior.

## Approved public API

```ts
type ButtonAppearance = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
type ButtonTone = 'neutral' | 'accent' | 'positive' | 'caution' | 'critical' | 'inverse';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

interface ButtonPressedChangeEvent {
  readonly pressed: boolean;
  readonly nativeEvent: React.MouseEvent<HTMLButtonElement>;
}

type ButtonProps = NativeButtonProps &
  AppearanceAndContentProps &
  (
    | {
        readonly toggleable: true;
        readonly pressed?: boolean;
        readonly defaultPressed?: boolean;
        readonly onPressedChange?: (event: ButtonPressedChangeEvent) => void;
      }
    | {
        readonly toggleable?: false;
        readonly pressed?: never;
        readonly defaultPressed?: never;
        readonly onPressedChange?: never;
      }
  );
```

`NativeButtonProps` preserves standard button attributes/events except `aria-pressed`, `children`,
and legacy HTML `color`, which are governed by this component. Appearance defaults are `soft`,
`neutral`, `md`, and `md`. `startContent` and `endContent` accept React nodes but are decorative and
non-interactive. `iconOnly` is a layout declaration, not an accessible-name substitute. The
forwarded ref is the native `HTMLButtonElement`; no custom imperative handle is introduced.

The stable root hook is `.csn-button`. Stable state hooks are `data-appearance`, `data-tone`,
`data-size`, `data-radius`, `data-icon-only`, `data-disabled`, and `data-pressed`. Internal child
structure is not a compatibility promise beyond the documented start/content/end slots.

## Styling and theming

The component stylesheet is a separate supported CSS import, `@casauran/react/button.css`, in the
`components` cascade layer. It consumes public Button tokens and existing semantic/primitive
tokens. Component tokens cover default background/foreground/border, spacing, typography, radius,
minimum size, focus, disabled opacity, and transition timing. Consumers may override component
custom properties at a scoped theme boundary or use `.csn-button` in the `overrides` layer.

Light/dark colors derive from semantic tokens. Density adjusts shared control spacing. Logical
properties and flex order provide RTL behavior. Forced colors and reduced motion have explicit
media rules. No competitor theme value or class is used.

## Rendering

The public package root stays free of a broad client directive. Button's implementation module is
a local client boundary because it owns activation event composition and optional uncontrolled
pressed state. It is server-renderable, reads no browser global during module evaluation/render,
uses no observer or portal, and produces hydration-stable markup for equal props. Event callbacks
must be serializable only when crossing a Server-to-Client Component boundary, following normal
Next.js rules.

## Internationalization

Button has no built-in messages, locale formats, or global locale state. Consumers supply visible
and accessible text. `dir` is inherited or may be supplied through native attributes; CSS uses
logical properties. IME is not applicable beyond ensuring no custom key handler interferes with
composition.

## Security

React children are rendered through React's normal escaping. Button accepts no raw HTML, URL/image
shortcut, SVG parser, style-string execution, serialization, clipboard, storage, network, or
dynamic-code input. Caller-supplied React nodes and event callbacks are trusted application code.
Decorative slots prohibit nested interactive content to avoid ambiguous activation/focus.

## Performance

The material scenarios are production build contribution and a 1,000-button server-render/update
probe. The component must add no runtime dependency, observer, listener, portal, timer, or per-item
global state. A local benchmark records environment and must complete 1,000 SSR buttons plus one
update projection within 1,000 ms on the pinned Node runtime; this is a regression ceiling, not a
universal speed claim.

## Edge cases

- Empty visual content requires an accessible name supplied through native ARIA attributes.
- Very long content may wrap; consumers choose container constraints.
- Cancelling `onClick` prevents the pressed-state request but preserves the native event.
- A disabled toggleable button exposes its current pressed state but cannot change it.
- `pressed={false}` is controlled; only `undefined` selects uncontrolled ownership.
- Start/end content is hidden from the accessibility tree and cannot contain controls.
- Explicit form types preserve native submit/reset semantics; omission uses `button`.

## Test matrix

- Unit/SSR: defaults, attributes, slots, class/style passthrough, ref typing, controlled and
  uncontrolled markup, safe escaping, server import, and form type.
- Browser interaction: pointer, touch-equivalent click, Enter, Space, cancellation, controlled/
  uncontrolled pressed state, disabled behavior, native form submit/reset, and ref focus.
- Accessibility: native role/name/state, icon-only label, focus-visible, no duplicate role,
  keyboard table, automated scan where available, and manual checklist.
- Theme/visual: light/dark, comfortable/compact, all appearances/tones/sizes/radii, pressed,
  disabled, icon-only, RTL, narrow layout, forced colors, and reduced motion.
- SSR/hydration/RSC: production Server Component route imports the root, renders stable markup, and
  hydrates a local client fixture without warnings.
- i18n/IME: localized Unicode labels, inherited RTL, and no composition-sensitive handler.
- Security/performance: escaped text, no dangerous sink, no runtime dependency, deterministic
  benchmark, and supported export/CSS side-effect verification.

## Parity acceptance

Every registry dimension reaches `pass` only when the implementation, focused tests, production
browser evidence, executable docs/visual cases, and this specification agree. Security and i18n
may not be marked not-applicable: their lightweight Button requirements are explicit above. The
final audit is recorded in `button.parity.md`; screenshots alone are insufficient.
