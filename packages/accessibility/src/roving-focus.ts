export interface RovingFocusItem<Id extends string = string> {
  readonly id: Id;
  readonly disabled?: boolean;
}

export interface RovingFocusOptions {
  readonly loop?: boolean;
}

export type RovingFocusIntent = 'previous' | 'next' | 'first' | 'last';

export function resolveRovingTabStop<Id extends string>(
  items: readonly RovingFocusItem<Id>[],
  preferredId?: Id | null,
): Id | null {
  if (preferredId !== undefined && preferredId !== null) {
    const preferred = items.find((item) => item.id === preferredId && item.disabled !== true);
    if (preferred !== undefined) return preferred.id;
  }
  return items.find((item) => item.disabled !== true)?.id ?? null;
}

export function getRovingTabIndex<Id extends string>(itemId: Id, tabStopId: Id | null): 0 | -1 {
  return itemId === tabStopId ? 0 : -1;
}

export function moveRovingFocus<Id extends string>(
  items: readonly RovingFocusItem<Id>[],
  currentId: Id | null,
  intent: RovingFocusIntent,
  options: RovingFocusOptions = {},
): Id | null {
  const enabled = items.filter((item) => item.disabled !== true);
  if (enabled.length === 0) return null;
  if (intent === 'first') return enabled[0]?.id ?? null;
  if (intent === 'last') return enabled.at(-1)?.id ?? null;

  const currentIndex = enabled.findIndex((item) => item.id === currentId);
  if (currentIndex === -1) {
    return intent === 'next' ? (enabled[0]?.id ?? null) : (enabled.at(-1)?.id ?? null);
  }

  const step = intent === 'next' ? 1 : -1;
  const candidateIndex = currentIndex + step;
  const candidate = enabled[candidateIndex];
  if (candidate !== undefined) return candidate.id;
  if (options.loop !== true) return enabled[currentIndex]?.id ?? null;
  return intent === 'next' ? (enabled[0]?.id ?? null) : (enabled.at(-1)?.id ?? null);
}
