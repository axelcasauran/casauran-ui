'use client';

import { composeEventHandlers } from '@casauran-internal/events';
import { forwardRef, type MouseEvent as ReactMouseEvent } from 'react';

import { useControllableState } from '../../../state/index.js';
import type { ButtonPressedChangeEvent, ButtonProps } from './button.types.js';

function joinClassNames(componentClass: string, consumerClass: string | undefined): string {
  return consumerClass === undefined || consumerClass.length === 0
    ? componentClass
    : `${componentClass} ${consumerClass}`;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    appearance = 'soft',
    children,
    className,
    defaultPressed,
    disabled = false,
    endContent,
    iconOnly = false,
    onClick,
    onPressedChange,
    pressed,
    radius = 'md',
    size = 'md',
    startContent,
    toggleable = false,
    tone = 'neutral',
    type = 'button',
    ...nativeProps
  } = props;

  const [renderedPressed, setRenderedPressed] = useControllableState({
    value: toggleable ? pressed : false,
    defaultValue: toggleable ? (defaultPressed ?? false) : false,
  });

  const handleToggle = (nativeEvent: ReactMouseEvent<HTMLButtonElement>) => {
    if (!toggleable) return;
    const nextPressed = !renderedPressed;
    setRenderedPressed(nextPressed);
    const changeEvent: ButtonPressedChangeEvent = { pressed: nextPressed, nativeEvent };
    onPressedChange?.(changeEvent);
  };

  const handleClick = composeEventHandlers(onClick, handleToggle);

  return (
    <button
      {...nativeProps}
      ref={ref}
      aria-pressed={toggleable ? renderedPressed : undefined}
      className={joinClassNames('csn-button', className)}
      data-appearance={appearance}
      data-csn-component="button"
      data-disabled={disabled ? '' : undefined}
      data-icon-only={iconOnly ? '' : undefined}
      data-pressed={toggleable ? String(renderedPressed) : undefined}
      data-radius={radius}
      data-size={size}
      data-tone={tone}
      disabled={disabled}
      onClick={handleClick}
      type={type}
    >
      {startContent === undefined || startContent === null ? null : (
        <span aria-hidden="true" className="csn-button__start" data-slot="start">
          {startContent}
        </span>
      )}
      <span className="csn-button__content" data-slot="content">
        {children}
      </span>
      {endContent === undefined || endContent === null ? null : (
        <span aria-hidden="true" className="csn-button__end" data-slot="end">
          {endContent}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
