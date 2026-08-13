# @casauran/react

**Ownership:** supported React component surface.

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
