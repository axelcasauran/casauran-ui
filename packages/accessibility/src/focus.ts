const TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  "[contenteditable]:not([contenteditable='false'])",
  '[tabindex]',
].join(',');

export interface FocusAttemptOptions {
  readonly preventScroll?: boolean;
}

function isElementSuppressed(element: HTMLElement): boolean {
  if (!element.isConnected) return true;
  if (element.matches(':disabled')) return true;
  if (element.closest("[hidden], [inert], [aria-hidden='true']") !== null) return true;

  const view = element.ownerDocument.defaultView;
  if (view !== null) {
    const style = view.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return true;
  }
  return element.getClientRects().length === 0;
}

export function isElementTabbable(element: HTMLElement): boolean {
  return (
    element.matches(TABBABLE_SELECTOR) && element.tabIndex >= 0 && !isElementSuppressed(element)
  );
}

export function getTabbableElements(root: ParentNode): readonly HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(
    isElementTabbable,
  );
}

export function tryFocus(
  element: HTMLElement | null | undefined,
  options: FocusAttemptOptions = {},
): boolean {
  if (element === null || element === undefined || isElementSuppressed(element)) return false;
  element.focus({ preventScroll: options.preventScroll ?? true });
  return element.ownerDocument.activeElement === element || element.matches(':focus');
}
