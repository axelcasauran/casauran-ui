/**
 * The catalog definition shape. `Icon` resolves one of these by name; the paths are stroked with
 * the resolved foreground colour.
 */
export interface IconDefinition {
  readonly name: string;
  readonly viewBox: string;
  readonly paths: readonly string[];
}

/**
 * One drawing layer of a caller-owned definition.
 *
 * A layer is geometry plus a small closed set of paint instructions — never markup. `SVGIcon`
 * renders each layer as a `<path>` element and can express nothing else, so a definition cannot
 * carry a script, an external reference, an embedded image, or foreign content no matter where it
 * came from. A bare string is shorthand for a stroked layer with that geometry.
 */
export interface IconPath {
  /** SVG path geometry. Rendered as the `d` attribute of a `<path>`; never parsed as markup. */
  readonly d: string;
  /** `stroke` (default) traces the geometry with the resolved colour; `fill` paints its interior. */
  readonly paint?: 'stroke' | 'fill';
  /** Interior rule for a filled layer with self-intersections or holes. */
  readonly fillRule?: 'nonzero' | 'evenodd';
  /**
   * Stroke weight in view-box units, for artwork drawn at a weight other than the platform
   * default. Weight belongs to the drawing rather than to the theme, so it is declared per layer
   * here instead of through a CSS seam that could not vary between layers of one icon.
   */
  readonly strokeWidth?: number;
  /** Layer opacity between 0 and 1, used by duotone artwork to recede a background layer. */
  readonly opacity?: number;
}

/**
 * The governed drawing vocabulary.
 *
 * Casauran keeps a closed set rather than an open string keyspace, for the same reason `tone` and
 * `size` are closed: a misspelled variant should be a compile error rather than artwork that
 * silently falls back to a different drawing.
 */
export type SVGIconVariant = 'solid' | 'outline' | 'duotone';

/**
 * A definition the caller owns, for artwork the Casauran catalog does not ship.
 *
 * A catalog {@link IconDefinition} is structurally one of these, so a catalog glyph can be handed
 * to `SVGIcon` unchanged.
 */
export interface SVGIconDefinition {
  /** Identifies the drawing. Reflected as a data attribute for consumer selectors and tests. */
  readonly name: string;
  /** Defaults to {@link SVG_ICON_DEFAULT_VIEW_BOX} when the definition omits it. */
  readonly viewBox?: string;
  /** The default drawing, used whenever no variant is requested or the requested one is absent. */
  readonly paths: readonly (string | IconPath)[];
  /** Alternate drawings of the same symbol, selected with the `variant` prop. */
  readonly variants?: Partial<Readonly<Record<SVGIconVariant, readonly (string | IconPath)[]>>>;
}

/** The 24×24 box the Casauran catalog is drawn on, and the default for a definition that omits it. */
export const SVG_ICON_DEFAULT_VIEW_BOX = '0 0 24 24';

/**
 * The platform stroke weight, in view-box units, applied to a layer that declares none.
 *
 * It matches the weight `Icon` paints catalog artwork at, so the same definition rendered through
 * either component is visually identical.
 */
export const SVG_ICON_DEFAULT_STROKE_WIDTH = 1.8;
