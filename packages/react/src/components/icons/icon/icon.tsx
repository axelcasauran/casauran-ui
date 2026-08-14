import { getIconDefinition } from '@casauran/icons';
import { forwardRef } from 'react';

import type { IconProps } from './icon.types.js';

function joinClassNames(componentClass: string, consumerClass: string | undefined): string {
  return consumerClass === undefined || consumerClass.length === 0
    ? componentClass
    : `${componentClass} ${consumerClass}`;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(props, ref) {
  const {
    className,
    flip = 'none',
    label,
    name,
    size = 'md',
    tone = 'inherit',
    ...nativeProps
  } = props;
  const definition = getIconDefinition(name);

  return (
    <span
      {...nativeProps}
      ref={ref}
      aria-hidden={label === undefined ? true : undefined}
      aria-label={label}
      className={joinClassNames('csn-icon', className)}
      data-csn-component="icon"
      data-flip={flip}
      data-icon-name={name}
      data-size={size}
      data-tone={tone}
      role={label === undefined ? undefined : 'img'}
    >
      {definition === undefined ? null : (
        <svg aria-hidden="true" focusable="false" viewBox={definition.viewBox}>
          {definition.paths.map((path, index) => (
            <path d={path} key={`${definition.name}-${String(index)}`} />
          ))}
        </svg>
      )}
    </span>
  );
});

Icon.displayName = 'Icon';
