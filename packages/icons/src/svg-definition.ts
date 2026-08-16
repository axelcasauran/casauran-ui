import {
  type IconPath,
  SVG_ICON_DEFAULT_STROKE_WIDTH,
  SVG_ICON_DEFAULT_VIEW_BOX,
  type SVGIconDefinition,
  type SVGIconVariant,
} from './types.js';

/** A drawing layer with every default applied, ready to render as one `<path>`. */
export interface ResolvedIconPath {
  readonly d: string;
  readonly paint: 'stroke' | 'fill';
  readonly strokeWidth: number;
  readonly fillRule?: 'nonzero' | 'evenodd';
  readonly opacity?: number;
}

/** A definition resolved against a requested variant. */
export interface ResolvedSVGIcon {
  readonly name: string;
  readonly viewBox: string;
  /**
   * The drawing that actually rendered. `default` means either no variant was requested or the
   * requested one is absent from this definition, so the default drawing was used.
   */
  readonly variant: SVGIconVariant | 'default';
  readonly paths: readonly ResolvedIconPath[];
}

/** The governed variant names, in the order they are documented. */
export const svgIconVariants: readonly SVGIconVariant[] = ['solid', 'outline', 'duotone'];

const PAINTS = new Set(['stroke', 'fill']);
const FILL_RULES = new Set(['nonzero', 'evenodd']);
const VARIANTS = new Set<string>(svgIconVariants);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * A view box is four finite numbers with a positive extent.
 *
 * This is a correctness guard rather than a sanitizer — the value only ever becomes an escaped
 * attribute — but a definition that crossed a runtime boundary with a malformed box would collapse
 * the artwork to nothing visible, which is harder to diagnose than failing closed.
 */
const isViewBox = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  const parts = value.trim().split(/[\s,]+/u);
  if (parts.length !== 4) return false;
  const numbers = parts.map(Number);
  if (numbers.some((entry) => !Number.isFinite(entry))) return false;
  return (numbers[2] ?? 0) > 0 && (numbers[3] ?? 0) > 0;
};

const isLayer = (value: unknown): value is string | IconPath => {
  if (isNonEmptyString(value)) return true;
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value['d'])) return false;

  const paint = value['paint'];
  if (paint !== undefined && !PAINTS.has(paint as string)) return false;

  const fillRule = value['fillRule'];
  if (fillRule !== undefined && !FILL_RULES.has(fillRule as string)) return false;

  const strokeWidth = value['strokeWidth'];
  if (strokeWidth !== undefined) {
    if (typeof strokeWidth !== 'number' || !Number.isFinite(strokeWidth)) return false;
    if (strokeWidth <= 0) return false;
  }

  const opacity = value['opacity'];
  if (opacity !== undefined) {
    if (typeof opacity !== 'number' || !Number.isFinite(opacity)) return false;
    if (opacity < 0 || opacity > 1) return false;
  }
  return true;
};

const isDrawing = (value: unknown): value is readonly (string | IconPath)[] =>
  Array.isArray(value) && value.length > 0 && value.every(isLayer);

/**
 * Narrows an arbitrary runtime value — a JSON row, a CMS field, a build-time import — to a
 * definition `SVGIcon` will render.
 *
 * Every rule here is structural. Geometry is never parsed, evaluated, or interpreted as markup, so
 * this guard exists to make an unusable definition observable at its boundary rather than to
 * neutralize a dangerous one; the API cannot express a dangerous one.
 */
export function isSVGIconDefinition(value: unknown): value is SVGIconDefinition {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value['name'])) return false;
  if (value['viewBox'] !== undefined && !isViewBox(value['viewBox'])) return false;
  if (!isDrawing(value['paths'])) return false;

  const variants = value['variants'];
  if (variants === undefined) return true;
  if (!isRecord(variants)) return false;
  for (const [name, drawing] of Object.entries(variants)) {
    if (!VARIANTS.has(name)) return false;
    // An explicitly absent variant is how a definition declares it does not ship one.
    if (drawing === undefined) continue;
    if (!isDrawing(drawing)) return false;
  }
  return true;
}

const resolveLayer = (layer: string | IconPath): ResolvedIconPath => {
  if (typeof layer === 'string') {
    return { d: layer, paint: 'stroke', strokeWidth: SVG_ICON_DEFAULT_STROKE_WIDTH };
  }
  return {
    d: layer.d,
    paint: layer.paint ?? 'stroke',
    strokeWidth: layer.strokeWidth ?? SVG_ICON_DEFAULT_STROKE_WIDTH,
    ...(layer.fillRule === undefined ? {} : { fillRule: layer.fillRule }),
    ...(layer.opacity === undefined ? {} : { opacity: layer.opacity }),
  };
};

/**
 * Resolves a definition and a requested variant into the drawing to render.
 *
 * Returns `undefined` for anything {@link isSVGIconDefinition} rejects, so an invalid definition
 * renders no artwork instead of broken markup — the same fail-closed behaviour `Icon` gives an
 * unknown catalog name. A requested variant the definition does not ship falls back to the default
 * drawing, and the result reports which one was used.
 */
export function resolveSVGIcon(
  definition: SVGIconDefinition,
  variant?: SVGIconVariant,
): ResolvedSVGIcon | undefined {
  if (!isSVGIconDefinition(definition)) return undefined;

  const requested = variant === undefined ? undefined : definition.variants?.[variant];
  const drawing = requested ?? definition.paths;

  return {
    name: definition.name,
    viewBox: definition.viewBox ?? SVG_ICON_DEFAULT_VIEW_BOX,
    variant: requested === undefined || variant === undefined ? 'default' : variant,
    paths: drawing.map(resolveLayer),
  };
}
