import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  getIconDefinition,
  isSVGIconDefinition,
  resolveSVGIcon,
  SVG_ICON_DEFAULT_STROKE_WIDTH,
  SVG_ICON_DEFAULT_VIEW_BOX,
  svgIconVariants,
  type SVGIconDefinition,
} from '../../packages/icons/src/index.js';
import {
  SVGIcon,
  type SVGIconFlip,
  type SVGIconProps,
  type SVGIconSize,
  type SVGIconTone,
} from '../../packages/react/src/index.js';

const SIZES: readonly SVGIconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const TONES: readonly SVGIconTone[] = [
  'inherit',
  'accent',
  'muted',
  'positive',
  'caution',
  'critical',
  'inverse',
];
const FLIPS: readonly SVGIconFlip[] = ['none', 'horizontal', 'vertical', 'both'];

/** A minimal caller-owned drawing: geometry only, every default applied by the component. */
const bolt: SVGIconDefinition = {
  name: 'bolt',
  paths: ['M13 3 5 14h6l-1 7 8-11h-6z'],
};

/** Exercises every layer property, a custom box, and all three governed variants. */
const beacon: SVGIconDefinition = {
  name: 'beacon',
  viewBox: '0 0 32 32',
  paths: [
    { d: 'M16 6 26 26H6z', paint: 'stroke', strokeWidth: 2.4 },
    { d: 'M16 14v6', opacity: 0.5 },
  ],
  variants: {
    solid: [{ d: 'M16 6 26 26H6z', paint: 'fill', fillRule: 'evenodd' }],
    outline: ['M16 6 26 26H6z'],
    duotone: [
      { d: 'M16 6 26 26H6z', paint: 'fill', opacity: 0.35 },
      { d: 'M16 14v6', paint: 'stroke' },
    ],
  },
};

describe('SVGIcon server contract', () => {
  it('renders a decorative caller-owned drawing with safe defaults', () => {
    const markup = renderToString(<SVGIcon className="consumer-icon" icon={bolt} />);

    expect(markup).toContain('class="csn-svg-icon consumer-icon"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('data-csn-component="svg-icon"');
    expect(markup).toContain('data-icon-name="bolt"');
    expect(markup).toContain('data-size="md"');
    expect(markup).toContain('data-tone="inherit"');
    expect(markup).toContain('data-flip="none"');
    expect(markup).toContain('data-variant="default"');
    expect(markup).toContain(`viewBox="${SVG_ICON_DEFAULT_VIEW_BOX}"`);
    expect(markup).toContain('<path');
    expect(markup).not.toContain('role=');
  });

  it('applies the platform stroke weight to a bare geometry layer', () => {
    const markup = renderToString(<SVGIcon icon={bolt} />);

    expect(markup).toContain(`stroke-width="${String(SVG_ICON_DEFAULT_STROKE_WIDTH)}"`);
    expect(markup).toContain('stroke="currentColor"');
    expect(markup).toContain('fill="none"');
    expect(markup).toContain('data-paint="stroke"');
  });

  it('honours the definition view box and renders one path per layer', () => {
    const markup = renderToString(<SVGIcon icon={beacon} />);

    expect(markup).toContain('viewBox="0 0 32 32"');
    expect(markup.match(/<path/gu)).toHaveLength(2);
    expect(markup).toContain('stroke-width="2.4"');
    expect(markup).toContain('opacity="0.5"');
  });

  it('exposes a labelled drawing as an image and preserves native attributes', () => {
    const markup = renderToString(
      <SVGIcon data-testid="beacon" icon={beacon} id="beacon-icon" label="  Signal strength  " />,
    );

    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Signal strength"');
    expect(markup).toContain('id="beacon-icon"');
    expect(markup).toContain('data-testid="beacon"');
    expect(markup).not.toContain('aria-hidden="true"><svg');
  });

  it('keeps a blank or whitespace-only label decorative', () => {
    for (const label of ['', '   ', '\n\t']) {
      const markup = renderToString(<SVGIcon icon={bolt} label={label} />);
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).not.toContain('role="img"');
      expect(markup).not.toContain('aria-label');
    }
  });

  it('keeps the nested svg hidden and unfocusable in both modes', () => {
    for (const markup of [
      renderToString(<SVGIcon icon={bolt} />),
      renderToString(<SVGIcon icon={bolt} label="Bolt" />),
    ]) {
      expect(markup).toContain('focusable="false"');
      expect(markup).toContain('<svg aria-hidden="true"');
    }
  });

  it('reflects every size, tone and flip value', () => {
    for (const size of SIZES) {
      expect(renderToString(<SVGIcon icon={bolt} size={size} />)).toContain(`data-size="${size}"`);
    }
    for (const tone of TONES) {
      expect(renderToString(<SVGIcon icon={bolt} tone={tone} />)).toContain(`data-tone="${tone}"`);
    }
    for (const flip of FLIPS) {
      expect(renderToString(<SVGIcon flip={flip} icon={bolt} />)).toContain(`data-flip="${flip}"`);
    }
  });

  it('forwards its ref to the native span', () => {
    const ref = createRef<HTMLSpanElement>();
    // Server rendering never attaches, but the prop must type-check as the native element.
    const props: SVGIconProps & { ref: typeof ref } = { icon: bolt, ref };
    expect(props.ref).toBe(ref);
  });
});

describe('SVGIcon variants', () => {
  it('renders each governed variant', () => {
    expect(svgIconVariants).toEqual(['solid', 'outline', 'duotone']);

    const solid = renderToString(<SVGIcon icon={beacon} variant="solid" />);
    expect(solid).toContain('data-variant="solid"');
    expect(solid).toContain('data-paint="fill"');
    expect(solid).toContain('fill-rule="evenodd"');
    expect(solid).toContain('fill="currentColor"');
    // A filled layer clears the stroke rather than painting both.
    expect(solid).toContain('stroke="none"');
    expect(solid).not.toContain('stroke-width');

    const outline = renderToString(<SVGIcon icon={beacon} variant="outline" />);
    expect(outline).toContain('data-variant="outline"');
    expect(outline.match(/<path/gu)).toHaveLength(1);

    const duotone = renderToString(<SVGIcon icon={beacon} variant="duotone" />);
    expect(duotone).toContain('data-variant="duotone"');
    expect(duotone).toContain('opacity="0.35"');
    expect(duotone.match(/<path/gu)).toHaveLength(2);
  });

  it('falls back to the default drawing and reports the fallback', () => {
    // `bolt` declares no variants at all, so every request falls back.
    const markup = renderToString(<SVGIcon icon={bolt} variant="duotone" />);

    expect(markup).toContain('data-variant="default"');
    expect(markup).toContain('data-icon-name="bolt"');
    expect(markup.match(/<path/gu)).toHaveLength(1);
  });

  it('falls back for a variant a definition only partially ships', () => {
    const partial: SVGIconDefinition = {
      name: 'partial',
      paths: ['M4 12h16'],
      variants: { solid: ['M4 4h16v16H4z'] },
    };

    expect(renderToString(<SVGIcon icon={partial} variant="solid" />)).toContain(
      'data-variant="solid"',
    );
    expect(renderToString(<SVGIcon icon={partial} variant="outline" />)).toContain(
      'data-variant="default"',
    );
  });
});

describe('SVGIcon definition trust boundary', () => {
  const rejected: readonly [string, unknown][] = [
    ['null', null],
    ['a non-object', 'M4 12h16'],
    ['an array', [{ d: 'M4 12h16' }]],
    ['a missing name', { paths: ['M4 12h16'] }],
    ['a blank name', { name: '   ', paths: ['M4 12h16'] }],
    ['missing paths', { name: 'x' }],
    ['an empty drawing', { name: 'x', paths: [] }],
    ['a blank geometry string', { name: 'x', paths: ['   '] }],
    ['a layer with no geometry', { name: 'x', paths: [{ paint: 'fill' }] }],
    ['an ungoverned paint', { name: 'x', paths: [{ d: 'M0 0', paint: 'glow' }] }],
    ['an ungoverned fill rule', { name: 'x', paths: [{ d: 'M0 0', fillRule: 'inherit' }] }],
    ['a negative stroke width', { name: 'x', paths: [{ d: 'M0 0', strokeWidth: -1 }] }],
    ['a zero stroke width', { name: 'x', paths: [{ d: 'M0 0', strokeWidth: 0 }] }],
    ['an out-of-range opacity', { name: 'x', paths: [{ d: 'M0 0', opacity: 1.5 }] }],
    ['a non-numeric opacity', { name: 'x', paths: [{ d: 'M0 0', opacity: '0.5' }] }],
    ['a three-number view box', { name: 'x', viewBox: '0 0 24', paths: ['M0 0'] }],
    ['a zero-extent view box', { name: 'x', viewBox: '0 0 0 24', paths: ['M0 0'] }],
    ['a non-numeric view box', { name: 'x', viewBox: 'a b c d', paths: ['M0 0'] }],
    ['an ungoverned variant key', { name: 'x', paths: ['M0 0'], variants: { glow: ['M0 0'] } }],
    ['an empty variant drawing', { name: 'x', paths: ['M0 0'], variants: { solid: [] } }],
  ];

  it('rejects every malformed definition', () => {
    for (const [label, value] of rejected) {
      expect(isSVGIconDefinition(value), label).toBe(false);
    }
  });

  it('accepts the definitions the component documents', () => {
    for (const definition of [bolt, beacon]) {
      expect(isSVGIconDefinition(definition)).toBe(true);
    }
    expect(isSVGIconDefinition({ name: 'x', viewBox: '0,0,24,24', paths: ['M0 0'] })).toBe(true);
  });

  it('fails closed rather than rendering partial artwork', () => {
    for (const [label, value] of rejected) {
      // A definition that crossed a runtime boundary is not guaranteed to match its type.
      const markup = renderToString(<SVGIcon icon={value as SVGIconDefinition} />);
      expect(markup, label).toContain('class="csn-svg-icon"');
      expect(markup, label).toContain('aria-hidden="true"');
      expect(markup, label).not.toContain('<svg');
      expect(markup, label).not.toContain('data-icon-name');
      expect(resolveSVGIcon(value as SVGIconDefinition)).toBeUndefined();
    }
  });

  it('renders geometry as an escaped attribute and never as markup', () => {
    const hostile: SVGIconDefinition = {
      name: '"><script>x()</script>',
      paths: ['M0 0"><script>x()</script>'],
    };
    const markup = renderToString(<SVGIcon icon={hostile} />);

    expect(markup).not.toContain('<script>');
    expect(markup).toContain('&quot;&gt;&lt;script&gt;');
  });
});

describe('SVGIcon and the Casauran catalog', () => {
  it('renders a catalog definition unchanged through the caller-owned surface', () => {
    const home = getIconDefinition('home');
    expect(home).toBeDefined();
    if (home === undefined) return;

    expect(isSVGIconDefinition(home)).toBe(true);
    const markup = renderToString(<SVGIcon icon={home} />);
    expect(markup).toContain('data-icon-name="home"');
    expect(markup).toContain(`viewBox="${home.viewBox}"`);
    for (const path of home.paths) expect(markup).toContain(path);
    // Catalog artwork keeps the weight Icon paints it at, so the two components agree.
    expect(markup).toContain(`stroke-width="${String(SVG_ICON_DEFAULT_STROKE_WIDTH)}"`);
  });

  it('resolves the drawing that will render', () => {
    const resolved = resolveSVGIcon(beacon, 'duotone');
    expect(resolved?.variant).toBe('duotone');
    expect(resolved?.viewBox).toBe('0 0 32 32');
    expect(resolved?.paths[0]).toEqual({
      d: 'M16 6 26 26H6z',
      paint: 'fill',
      strokeWidth: SVG_ICON_DEFAULT_STROKE_WIDTH,
      opacity: 0.35,
    });
  });
});

describe('SVGIcon type contract', () => {
  /*
   * Assertions are written against the props type rather than as JSX, because TypeScript exempts
   * hyphenated JSX attributes from excess-property checking — `aria-hidden` in an element would
   * pass even though the type reserves it, so the JSX form would not prove the reservation.
   */
  it('rejects values and props that would contradict owned semantics', () => {
    const valid: SVGIconProps = {
      flip: 'both',
      icon: beacon,
      size: '2xl',
      tone: 'critical',
      variant: 'outline',
    };
    void valid;
    // @ts-expect-error the drawing is required; there is no default artwork
    const withoutDefinition: SVGIconProps = { size: 'md' };
    void withoutDefinition;
    // @ts-expect-error the variant vocabulary is closed
    const unknownVariant: SVGIconProps = { icon: bolt, variant: 'glow' };
    void unknownVariant;
    // @ts-expect-error invalid visual vocabulary is rejected
    const invalidSize: SVGIconProps = { icon: bolt, size: 'huge' };
    void invalidSize;
    // @ts-expect-error the info tone was removed; informational artwork uses accent
    const removedTone: SVGIconProps = { icon: bolt, tone: 'info' };
    void removedTone;
    // @ts-expect-error mirroring is explicit and closed
    const inferredFlip: SVGIconProps = { flip: 'auto', icon: bolt };
    void inferredFlip;
    // @ts-expect-error a decorative element must not be reachable by keyboard
    const focusable: SVGIconProps = { icon: bolt, tabIndex: 0 };
    void focusable;
    // @ts-expect-error role is derived from label and may not be contradicted
    const overriddenRole: SVGIconProps = { icon: bolt, role: 'button' };
    void overriddenRole;
    // @ts-expect-error aria-hidden is derived from label and may not be contradicted
    const overriddenHidden: SVGIconProps = { 'aria-hidden': false, icon: bolt };
    void overriddenHidden;
    // @ts-expect-error the accessible name is supplied through label
    const overriddenLabel: SVGIconProps = { 'aria-label': 'Bolt', icon: bolt };
    void overriddenLabel;
    // @ts-expect-error artwork comes from the definition, never from children
    const withChildren: SVGIconProps = { children: 'x', icon: bolt };
    void withChildren;
    // @ts-expect-error colour comes from tone
    const withColor: SVGIconProps = { color: 'red', icon: bolt };
    void withColor;
    // @ts-expect-error a layer paint outside the governed set is rejected
    const badPaint: SVGIconDefinition = { name: 'x', paths: [{ d: 'M0 0', paint: 'glow' }] };
    void badPaint;
    // @ts-expect-error a variant key outside the governed set is rejected
    const badVariantKey: SVGIconDefinition = { name: 'x', paths: ['M0 0'], variants: { glow: [] } };
    void badVariantKey;
  });
});
