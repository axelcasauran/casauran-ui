import type { IconName } from '@casauran/icons';
import type { HTMLAttributes } from 'react';

export type { IconName };

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type IconTone =
  'inherit' | 'accent' | 'muted' | 'positive' | 'caution' | 'critical' | 'inverse';
export type IconFlip = 'none' | 'horizontal' | 'vertical' | 'both';

/**
 * Native span attributes minus the ones Icon owns.
 *
 * `children` and `color` are reserved because the glyph and its colour come from `name` and `tone`.
 * `role`, `aria-hidden` and `aria-label` are reserved because Icon derives its semantics from
 * `label`, and a passthrough value would contradict them (`API_GOVERNANCE.md`). `tabIndex` is
 * reserved because a focusable decorative element is hidden from assistive technology while still
 * reachable by keyboard; an icon that participates in an interaction belongs inside the control
 * that owns it.
 */
type NativeIconProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'color' | 'role' | 'aria-hidden' | 'aria-label' | 'tabIndex'
>;

export interface IconProps extends NativeIconProps {
  /** A tree-shakeable definition name from @casauran/icons. */
  readonly name: IconName;
  readonly size?: IconSize;
  readonly tone?: IconTone;
  readonly flip?: IconFlip;
  /**
   * Makes the otherwise decorative icon an accessible image. An empty or whitespace-only label
   * describes nothing, so it keeps the icon decorative rather than exposing an unnamed image.
   */
  readonly label?: string;
}
