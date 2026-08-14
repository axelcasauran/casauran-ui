import type { HTMLAttributes } from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type IconTone =
  'inherit' | 'accent' | 'muted' | 'info' | 'positive' | 'caution' | 'critical' | 'inverse';
export type IconFlip = 'none' | 'horizontal' | 'vertical' | 'both';

type NativeIconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'>;

export interface IconProps extends NativeIconProps {
  /** A tree-shakeable definition name from @casauran/icons. */
  readonly name: string;
  readonly size?: IconSize;
  readonly tone?: IconTone;
  readonly flip?: IconFlip;
  /** Makes the otherwise decorative icon an accessible image. */
  readonly label?: string;
}
