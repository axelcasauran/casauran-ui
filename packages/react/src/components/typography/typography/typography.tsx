import { createElement, forwardRef } from 'react';

import type {
  TypographyElement,
  TypographyProps,
  TypographySpace,
  TypographySpacing,
  TypographySpacingSides,
  TypographyVariant,
} from './typography.types.js';

function joinClassNames(componentClass: string, consumerClass: string | undefined): string {
  return consumerClass === undefined || consumerClass.length === 0
    ? componentClass
    : `${componentClass} ${consumerClass}`;
}

/**
 * The element a role renders when the caller names only the role.
 *
 * No role maps to a heading element. A heading is a document-structure claim, and inferring one
 * from a size is exactly the defect this API separates: `title` renders a paragraph until the
 * caller says `as="h1"`.
 */
const ELEMENT_FOR_VARIANT: Readonly<Record<TypographyVariant, TypographyElement>> = {
  display: 'p',
  title: 'p',
  heading: 'p',
  subheading: 'p',
  body: 'p',
  'body-small': 'p',
  caption: 'p',
  overline: 'p',
  code: 'code',
  'code-block': 'pre',
  quote: 'blockquote',
};

/**
 * The role an element renders when the caller names only the element, so that `as="h2"` reads as a
 * heading without a second prop. Deeper levels share one step rather than continuing to shrink,
 * because a level-six heading set smaller than body text is unreadable.
 */
const VARIANT_FOR_ELEMENT: Readonly<Record<TypographyElement, TypographyVariant>> = {
  h1: 'title',
  h2: 'heading',
  h3: 'subheading',
  h4: 'subheading',
  h5: 'subheading',
  h6: 'subheading',
  p: 'body',
  span: 'body',
  div: 'body',
  strong: 'body',
  em: 'body',
  code: 'code',
  pre: 'code-block',
  blockquote: 'quote',
};

const isSpacingSides = (spacing: TypographySpacing): spacing is TypographySpacingSides =>
  typeof spacing === 'object';

/**
 * Resolves the four logical sides.
 *
 * A shorthand step is block-only; the object form addresses each side and leaves an omitted side
 * with no margin. `undefined` becomes `'none'` so every side is reflected, which keeps the CSS a
 * flat set of same-specificity rules and makes the resolved value observable from a selector.
 */
function resolveSpacing(spacing: TypographySpacing | undefined): {
  readonly form: TypographySpace | 'sides';
  readonly blockStart: TypographySpace;
  readonly blockEnd: TypographySpace;
  readonly inlineStart: TypographySpace;
  readonly inlineEnd: TypographySpace;
} {
  if (spacing === undefined) {
    return {
      blockEnd: 'none',
      blockStart: 'none',
      form: 'none',
      inlineEnd: 'none',
      inlineStart: 'none',
    };
  }
  if (!isSpacingSides(spacing)) {
    return {
      blockEnd: spacing,
      blockStart: spacing,
      form: spacing,
      inlineEnd: 'none',
      inlineStart: 'none',
    };
  }
  return {
    blockEnd: spacing.blockEnd ?? 'none',
    blockStart: spacing.blockStart ?? 'none',
    form: 'sides',
    inlineEnd: spacing.inlineEnd ?? 'none',
    inlineStart: spacing.inlineStart ?? 'none',
  };
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography(props, ref) {
  const {
    align,
    as,
    children,
    className,
    size,
    spacing,
    tone = 'inherit',
    transform = 'none',
    variant,
    weight,
    ...nativeProps
  } = props;

  // Each side of the pair defaults from the other, and neither wins when both are given: the
  // element is the caller's structure decision and the role is the caller's visual decision.
  const element: TypographyElement =
    as ?? (variant === undefined ? 'p' : ELEMENT_FOR_VARIANT[variant]);
  const role: TypographyVariant = variant ?? VARIANT_FOR_ELEMENT[element];
  const sides = resolveSpacing(spacing);

  return createElement(
    element,
    {
      ...nativeProps,
      className: joinClassNames('csn-typography', className),
      // `auto` means "whatever the role assigned"; it carries no rule of its own, so an override
      // never has to compete with a default that was written at the same specificity.
      'data-align': align ?? 'auto',
      // Every reflected attribute carries the name of the prop it reflects, so a consumer selector
      // and a documentation coverage rule can both be written from the public API alone.
      'data-as': element,
      'data-csn-component': 'typography',
      'data-size': size ?? 'auto',
      'data-space-block-end': sides.blockEnd,
      'data-space-block-start': sides.blockStart,
      'data-space-inline-end': sides.inlineEnd,
      'data-space-inline-start': sides.inlineStart,
      // The form the caller used: a shorthand step, `sides` for the per-side object, or `none`.
      'data-spacing': sides.form,
      'data-tone': tone,
      'data-transform': transform,
      'data-variant': role,
      'data-weight': weight ?? 'auto',
      ref,
    },
    children,
  );
});

Typography.displayName = 'Typography';
