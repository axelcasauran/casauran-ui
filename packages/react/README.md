# @casauran/react

**Ownership:** supported React component surface.

## Button

`Button` is the canonical native action component. Import its static stylesheet once at an
application boundary:

```tsx
import '@casauran/react/button.css';
import { Button } from '@casauran/react';

<Button appearance="solid" tone="accent">
  Save
</Button>;
```

It defaults to `type="button"`. Set `type="submit"` or `type="reset"` for native form behavior.
Toggleable state follows `pressed/defaultPressed/onPressedChange`; consumer `onClick`
`preventDefault()` cancels the pressed-state request. Decorative start/end content must not contain
interactive descendants, and icon-only buttons need an accessible name.

## Icon

`Icon` renders a named definition from `@casauran/icons`; import its CSS once at the application
boundary. Icons are decorative by default. Use `label` only for standalone meaningful artwork;
actions compose an Icon within Button rather than turning an icon into a custom button.

```tsx
import '@casauran/react/icon.css';
import { Icon } from '@casauran/react';

<Icon name="search" />;
<Icon label="Search records" name="search" tone="accent" />;
```

## React state foundation

`@casauran/react/state` is the supported client entry point for `useControllableState`,
`useCommittedCallback`, `useHydrated`, and `useStableId`. The package root remains server safe and
does not re-export hooks. Components should expose conventional `value/defaultValue` pairs and use
these hooks only inside narrow client modules.

```tsx
'use client';

import { useControllableState } from '@casauran/react/state';

const [open, setOpen] = useControllableState({
  value: props.open,
  defaultValue: props.defaultOpen ?? false,
  onChange: props.onOpenChange,
});
```

Controlled setters request a change; the controlling owner must provide the next value. Switching
ownership mode while mounted is unsupported. `useHydrated` is reserved for behavior that truly
requires a mounted browser, not ordinary derived state.

## Boundary

Supported consumer package. Documented exports are public API.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
