import type { HTMLAttributes, ReactNode } from 'react';

/**
 * The rendered element.
 *
 * The vocabulary is closed and deliberately holds no interactive element. An anchor, a button, and
 * a form control each belong to the component that owns that primitive
 * (`COMPONENT_COMPOSITION_RULES.md`); a text component able to render one would be a second,
 * unowned action surface with no focus, keyboard, or disabled contract behind it.
 */
export type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'strong'
  | 'em'
  | 'code'
  | 'pre'
  | 'blockquote';

/**
 * The typographic role.
 *
 * A role names how text should read, never what it means in the document outline. `display`,
 * `title`, `heading` and `subheading` are sizes; a heading exists only when the caller selects a
 * heading element. Keeping the two separable is what stops an author from corrupting a document
 * outline in order to obtain a smaller size.
 */
export type TypographyVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'body-small'
  | 'caption'
  | 'overline'
  | 'code'
  | 'code-block'
  | 'quote';

/** Shared with Icon and SVGIcon: one platform size vocabulary rather than three parallel ones. */
export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/** Logical, not physical: `start` follows the ambient direction instead of fighting it in RTL. */
export type TypographyAlign = 'start' | 'end' | 'center' | 'justify';

export type TypographyTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

/**
 * Colour intent, reusing the vocabulary Button, Icon and SVGIcon publish. `inherit` is the default
 * and resolves to `currentColor`; `default` pins the theme's primary text colour for a passage that
 * must not follow a toned context.
 */
export type TypographyTone =
  'inherit' | 'default' | 'muted' | 'accent' | 'positive' | 'caution' | 'critical' | 'inverse';

/** One step of the governed space scale. */
export type TypographySpace = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Per-side spacing. Sides are logical, so a layout is correct in both directions. */
export interface TypographySpacingSides {
  readonly blockStart?: TypographySpace;
  readonly blockEnd?: TypographySpace;
  readonly inlineStart?: TypographySpace;
  readonly inlineEnd?: TypographySpace;
}

/**
 * The shorthand applies to both block sides, because vertical rhythm is what a margin on a text
 * block is for. Inline margins indent a passage and are rare enough to deserve the explicit form.
 */
export type TypographySpacing = TypographySpace | TypographySpacingSides;

/**
 * Native attributes of the rendered element, minus the ones Typography owns.
 *
 * `dangerouslySetInnerHTML` is reserved because content is children: accepting markup would create
 * the injection sink this component exists without, and `variant="code-block"` already renders
 * multi-line code as text. `color` is reserved because colour comes from `tone`. `role` and
 * `aria-level` are reserved because semantics come from `as`, and a passthrough value would
 * contradict the element the caller chose (`API_GOVERNANCE.md`).
 */
type NativeTypographyProps = Omit<
  HTMLAttributes<HTMLElement>,
  'dangerouslySetInnerHTML' | 'color' | 'role' | 'aria-level'
>;

export interface TypographyProps extends NativeTypographyProps {
  /**
   * The rendered element — the document-structure decision. Defaults from `variant` when one is
   * given (`code` renders `<code>`, `code-block` renders `<pre>`, `quote` renders `<blockquote>`,
   * everything else renders `<p>`), and to `<p>` otherwise.
   */
  readonly as?: TypographyElement;
  /**
   * The typographic role — the visual decision. Defaults from `as` when one is given, so the
   * common case stays a single prop, and is honoured independently when both are supplied.
   */
  readonly variant?: TypographyVariant;
  /** Overrides the size the variant assigned, and nothing else. */
  readonly size?: TypographySize;
  /** Overrides the weight the variant assigned, and nothing else. */
  readonly weight?: TypographyWeight;
  readonly align?: TypographyAlign;
  readonly transform?: TypographyTransform;
  readonly tone?: TypographyTone;
  readonly spacing?: TypographySpacing;
  readonly children?: ReactNode;
}
