import { forwardRef, type ReactNode } from 'react';

import type { LabelProps } from './label.types.js';

function joinClassNames(componentClass: string, consumerClass: string | undefined): string {
  return consumerClass === undefined || consumerClass.length === 0
    ? componentClass
    : `${componentClass} ${consumerClass}`;
}

/**
 * Whether the caption is deliberately empty.
 *
 * The rule is the value, not what the tree eventually renders: `undefined`, `null`, `''` and
 * `false` are the values React itself renders as nothing. Reaching further — walking an array or
 * rendering to decide — would make the reflected state depend on work the component has not done
 * yet, and would still be wrong for a child that renders nothing at runtime.
 */
function isEmptyCaption(children: ReactNode): boolean {
  return children === undefined || children === null || children === false || children === '';
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(props, ref) {
  const {
    children,
    className,
    disabled = false,
    invalid = false,
    requirement = 'none',
    requirementText,
    ...nativeProps
  } = props;

  return (
    <label
      {...nativeProps}
      className={joinClassNames('csn-label', className)}
      data-csn-component="label"
      data-disabled={disabled ? 'true' : 'false'}
      data-empty={isEmptyCaption(children) ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      data-requirement={requirement}
      ref={ref}
    >
      {children}
      {/*
        The marker is text inside the label, so it becomes part of the control's accessible name.
        It is a convention, never the mechanism: the editor still owns `required`/`aria-required`.

        The literal space is load-bearing. Accessible-name computation concatenates the text of
        inline descendants without inserting one, so without it a required field is announced as
        "Full name(required)". The `--csn-label-gap` margin is the visual separation only; it
        contributes nothing to the name, which is why both exist.
      */}
      {requirement === 'none' ? null : (
        <>
          {' '}
          <span className="csn-label__requirement" data-part="requirement">
            {requirementText}
          </span>
        </>
      )}
    </label>
  );
});

Label.displayName = 'Label';
