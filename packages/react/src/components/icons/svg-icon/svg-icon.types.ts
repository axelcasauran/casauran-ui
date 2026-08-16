import type { SVGIconDefinition, SVGIconVariant } from '@casauran/icons';
import type { HTMLAttributes } from 'react';

import type { IconFlip, IconSize, IconTone } from '../icon/icon.types.js';

export type { SVGIconDefinition, SVGIconVariant };

/**
 * SVGIcon shares Icon's box scale, semantic tone scale, and mirroring vocabulary rather than
 * declaring parallel ones. The two components differ in where the drawing comes from, not in how
 * an icon is sized or coloured, and a second vocabulary would be a second thing to keep in step.
 */
export type SVGIconSize = IconSize;
export type SVGIconTone = IconTone;
export type SVGIconFlip = IconFlip;

/**
 * Native span attributes minus the ones SVGIcon owns.
 *
 * `children` is reserved because the artwork comes from `icon`: accepting arbitrary inner SVG would
 * reopen exactly the markup surface the structured definition exists to close. `color` is reserved
 * because colour comes from `tone`. `role`, `aria-hidden` and `aria-label` are reserved because
 * SVGIcon derives its semantics from `label`, and a passthrough value would contradict them
 * (`API_GOVERNANCE.md`). `tabIndex` is reserved because an element hidden from assistive technology
 * must never be reachable by keyboard; artwork that participates in an interaction belongs inside
 * the control that owns it.
 */
type NativeSVGIconProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'color' | 'role' | 'aria-hidden' | 'aria-label' | 'tabIndex'
>;

export interface SVGIconProps extends NativeSVGIconProps {
  /**
   * The drawing to render. The caller owns it, so it may be a definition declared in application
   * code, one imported from a build step, or a catalog definition from `@casauran/icons`. A
   * definition that fails `isSVGIconDefinition` renders no artwork.
   */
  readonly icon: SVGIconDefinition;
  /**
   * Selects an alternate drawing of the same symbol. A variant the definition does not ship falls
   * back to the default drawing, and `data-variant` reports which one rendered.
   */
  readonly variant?: SVGIconVariant;
  readonly size?: SVGIconSize;
  readonly tone?: SVGIconTone;
  readonly flip?: SVGIconFlip;
  /**
   * Makes the otherwise decorative icon an accessible image. An empty or whitespace-only label
   * describes nothing, so it keeps the icon decorative rather than exposing an unnamed image.
   */
  readonly label?: string;
}
