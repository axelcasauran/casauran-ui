import { getIconDefinition } from '@casauran/icons';
import { forwardRef } from 'react';

import type { IconProps } from './icon.types.js';

function joinClassNames(componentClass: string, consumerClass: string | undefined): string {
  return consumerClass === undefined || consumerClass.length === 0
    ? componentClass
    : `${componentClass} ${consumerClass}`;
}

/**
 * A label that carries no text names nothing. Promoting such an icon to `role="img"` would publish
 * an image with an empty accessible name, which is worse for a screen-reader user than the
 * decorative default, so it stays decorative.
 */
function resolveLabel(label: string | undefined): string | undefined {
  if (label === undefined) return undefined;
  const trimmed = label.trim();
  return trimmed.length === 0 ? undefined : trimmed;
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
  const accessibleName = resolveLabel(label);

  return (
    <span
      {...nativeProps}
      ref={ref}
      aria-hidden={accessibleName === undefined ? true : undefined}
      aria-label={accessibleName}
      className={joinClassNames('csn-icon', className)}
      data-csn-component="icon"
      data-flip={flip}
      data-icon-name={name}
      data-size={size}
      data-tone={tone}
      role={accessibleName === undefined ? undefined : 'img'}
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
