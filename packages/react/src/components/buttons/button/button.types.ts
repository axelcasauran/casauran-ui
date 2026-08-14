import type { ButtonHTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

export type ButtonAppearance = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
export type ButtonTone = 'neutral' | 'accent' | 'positive' | 'caution' | 'critical' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ButtonPressedChangeEvent {
  readonly pressed: boolean;
  readonly nativeEvent: ReactMouseEvent<HTMLButtonElement>;
}

interface ButtonOwnProps {
  readonly appearance?: ButtonAppearance;
  readonly tone?: ButtonTone;
  readonly size?: ButtonSize;
  readonly radius?: ButtonRadius;
  readonly startContent?: ReactNode;
  readonly endContent?: ReactNode;
  readonly iconOnly?: boolean;
  readonly children?: ReactNode;
}

interface ToggleableButtonProps {
  readonly toggleable: true;
  readonly pressed?: boolean;
  readonly defaultPressed?: boolean;
  readonly onPressedChange?: (event: ButtonPressedChangeEvent) => void;
}

interface ActionButtonProps {
  readonly toggleable?: false;
  readonly pressed?: never;
  readonly defaultPressed?: never;
  readonly onPressedChange?: never;
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-pressed' | 'children' | 'color'
>;

export type ButtonProps = NativeButtonProps &
  ButtonOwnProps &
  (ToggleableButtonProps | ActionButtonProps);
