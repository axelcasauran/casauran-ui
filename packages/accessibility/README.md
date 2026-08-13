# @casauran-internal/accessibility

Framework-neutral implementation primitives for focus, roving tab stops, keyboard intent, live
regions, and visually hidden content.

This package is private/internal. Casauran implementation packages consume it; applications use
supported `@casauran/react` components instead of importing it directly.

```ts
import { getDirectionalNavigationIntent, moveRovingFocus } from '@casauran-internal/accessibility';

const intent = getDirectionalNavigationIntent(event, {
  orientation: 'horizontal',
  direction: 'rtl',
});
const nextId = intent ? moveRovingFocus(items, activeId, intent, { loop: true }) : activeId;
```

Import `@casauran-internal/accessibility/accessibility.css` at an implementation stylesheet
boundary when using `data-csn-visually-hidden`. Live-region messages are always assigned through
`textContent`; callers own localized message text and semantic placement.

The package does not provide React hooks, components, collection registration, selection, focus
traps, or overlay restoration. Read `specs/foundation/accessibility.md` and
`ACCESSIBILITY_POLICY.md` before extending it.
