export type TextDirection = 'ltr' | 'rtl';
export type NavigationOrientation = 'horizontal' | 'vertical' | 'both';
export type DirectionalNavigationIntent = 'previous' | 'next' | 'first' | 'last';

export interface KeyboardEventLike {
  readonly key: string;
  readonly altKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly shiftKey?: boolean;
  readonly isComposing?: boolean;
}

export interface DirectionalNavigationOptions {
  readonly orientation: NavigationOrientation;
  readonly direction?: TextDirection;
}

export function isKeyboardEventModified(event: KeyboardEventLike): boolean {
  return event.altKey === true || event.ctrlKey === true || event.metaKey === true;
}

export function getDirectionalNavigationIntent(
  event: KeyboardEventLike,
  options: DirectionalNavigationOptions,
): DirectionalNavigationIntent | null {
  if (event.isComposing === true || event.key === 'Process' || isKeyboardEventModified(event)) {
    return null;
  }

  if (event.key === 'Home') return 'first';
  if (event.key === 'End') return 'last';

  if (options.orientation === 'vertical' || options.orientation === 'both') {
    if (event.key === 'ArrowUp') return 'previous';
    if (event.key === 'ArrowDown') return 'next';
  }

  if (options.orientation === 'horizontal' || options.orientation === 'both') {
    const direction = options.direction ?? 'ltr';
    if (event.key === 'ArrowLeft') return direction === 'rtl' ? 'next' : 'previous';
    if (event.key === 'ArrowRight') return direction === 'rtl' ? 'previous' : 'next';
  }

  return null;
}

export function isActivationKey(event: KeyboardEventLike): boolean {
  return (
    event.isComposing !== true &&
    !isKeyboardEventModified(event) &&
    (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar')
  );
}

export function isDismissKey(event: KeyboardEventLike): boolean {
  return event.isComposing !== true && !isKeyboardEventModified(event) && event.key === 'Escape';
}
