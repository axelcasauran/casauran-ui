import { type ResolvedIconPath, resolveSVGIcon } from '@casauran/icons';
import { forwardRef } from 'react';

import type { SVGIconProps } from './svg-icon.types.js';

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

/**
 * Each layer becomes one `<path>`. `paint` decides whether the resolved colour traces the geometry
 * or fills its interior; the weight comes from the layer so one drawing can mix weights, and the
 * platform default matches what Icon paints catalog artwork at. Geometry is written to attributes
 * React escapes — it is never parsed, evaluated, or inserted as markup.
 */
function renderPath(path: ResolvedIconPath, key: string) {
  const filled = path.paint === 'fill';
  return (
    <path
      d={path.d}
      data-paint={path.paint}
      fill={filled ? 'currentColor' : 'none'}
      fillRule={path.fillRule}
      key={key}
      opacity={path.opacity}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : path.strokeWidth}
    />
  );
}

export const SVGIcon = forwardRef<HTMLSpanElement, SVGIconProps>(function SVGIcon(props, ref) {
  const {
    className,
    flip = 'none',
    icon,
    label,
    size = 'md',
    tone = 'inherit',
    variant,
    ...nativeProps
  } = props;
  // A definition that crossed a runtime boundary is not guaranteed to match its type, so the
  // resolver validates it rather than the render trusting it. An unusable definition produces an
  // element with no `data-icon-name` and no `<svg>`, the same fail-closed shape Icon gives an
  // unknown catalog name.
  const resolved = resolveSVGIcon(icon, variant);
  const accessibleName = resolveLabel(label);

  return (
    <span
      {...nativeProps}
      ref={ref}
      aria-hidden={accessibleName === undefined ? true : undefined}
      aria-label={accessibleName}
      className={joinClassNames('csn-svg-icon', className)}
      data-csn-component="svg-icon"
      data-flip={flip}
      data-icon-name={resolved?.name}
      data-size={size}
      data-tone={tone}
      data-variant={resolved?.variant ?? 'default'}
      role={accessibleName === undefined ? undefined : 'img'}
    >
      {resolved === undefined ? null : (
        <svg aria-hidden="true" focusable="false" viewBox={resolved.viewBox}>
          {resolved.paths.map((path, index) =>
            renderPath(path, `${resolved.name}-${String(index)}`),
          )}
        </svg>
      )}
    </span>
  );
});

SVGIcon.displayName = 'SVGIcon';
