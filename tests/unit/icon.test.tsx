import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  getIconDefinition,
  iconNames,
  isIconName,
  type IconName,
} from '../../packages/icons/src/index.js';
import {
  Icon,
  type IconProps,
  type IconSize,
  type IconTone,
} from '../../packages/react/src/index.js';

const SIZES: readonly IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const TONES: readonly IconTone[] = [
  'inherit',
  'accent',
  'muted',
  'positive',
  'caution',
  'critical',
  'inverse',
];

describe('Icon server contract', () => {
  it('renders a decorative named SVG icon with safe defaults', () => {
    const markup = renderToString(<Icon className="consumer-icon" name="home" />);

    expect(markup).toContain('class="csn-icon consumer-icon"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('data-icon-name="home"');
    expect(markup).toContain('data-size="md"');
    expect(markup).toContain('data-tone="inherit"');
    expect(markup).toContain('data-flip="none"');
    expect(markup).toContain('<svg');
    expect(markup).not.toContain('role=');
  });

  it('exposes explicit labelled icons as images and preserves native attributes', () => {
    const markup = renderToString(
      <Icon
        data-owner="billing"
        flip="horizontal"
        label="Search records"
        name="search"
        title="Search"
        tone="accent"
      />,
    );

    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Search records"');
    expect(markup).toContain('data-flip="horizontal"');
    expect(markup).toContain('data-owner="billing"');
    expect(markup).toContain('title="Search"');
  });

  it('keeps a blank label decorative rather than publishing an unnamed image', () => {
    for (const label of ['', '   ', '\n\t']) {
      const markup = renderToString(<Icon label={label} name="home" />);

      expect(markup).toContain('aria-hidden="true"');
      expect(markup).not.toContain('role="img"');
      expect(markup).not.toContain('aria-label');
    }
  });

  it('trims a label so the accessible name has no leading or trailing whitespace', () => {
    const markup = renderToString(<Icon label="  Search records  " name="search" />);

    expect(markup).toContain('aria-label="Search records"');
  });

  it('reflects every size, tone and flip value as a stable data attribute', () => {
    for (const size of SIZES) {
      expect(renderToString(<Icon name="home" size={size} />)).toContain(`data-size="${size}"`);
    }
    for (const tone of TONES) {
      expect(renderToString(<Icon name="home" tone={tone} />)).toContain(`data-tone="${tone}"`);
    }
    for (const flip of ['none', 'horizontal', 'vertical', 'both'] as const) {
      expect(renderToString(<Icon flip={flip} name="home" />)).toContain(`data-flip="${flip}"`);
    }
  });

  it('renders every catalog definition with a viewBox and at least one path', () => {
    expect(iconNames.length).toBeGreaterThan(0);
    for (const name of iconNames) {
      const markup = renderToString(<Icon name={name} />);
      const definition = getIconDefinition(name);

      expect(definition?.paths.length ?? 0).toBeGreaterThan(0);
      expect(markup).toContain(`viewBox="${definition?.viewBox ?? ''}"`);
      expect(markup).toContain('<path');
    }
  });

  it('fails closed for a name that crossed a runtime boundary, without rendering unsafe markup', () => {
    // A name from a CMS field or route segment is not type-checked; the catalog must still refuse it.
    const injected = '<script>alert(1)</script>' as IconName;
    const markup = renderToString(<Icon name={injected} />);

    expect(markup).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(markup).not.toContain('<script>');
    expect(markup).not.toContain('<svg');
    expect(markup).toContain('aria-hidden="true"');
  });

  it('narrows an untyped runtime name through isIconName', () => {
    const fromData = 'search';
    expect(isIconName(fromData)).toBe(true);
    expect(isIconName('not-in-the-catalog')).toBe(false);
    expect(getIconDefinition('not-in-the-catalog')).toBeUndefined();
  });

  it('accepts a span ref without breaking server rendering', () => {
    // Server rendering never attaches a ref; browser evidence covers the attached element.
    const ref = createRef<HTMLSpanElement>();

    expect(renderToString(<Icon name="home" ref={ref} />)).toContain('csn-icon');
    expect(ref.current).toBeNull();
  });

  it('rejects names, visual vocabulary and reserved semantic props at the type level', () => {
    const valid: IconProps = { flip: 'both', name: 'home', size: '2xl', tone: 'critical' };
    void valid;
    // @ts-expect-error a glyph the catalog does not ship is not a valid name
    const unknownName: IconProps = { name: 'check-circle' };
    void unknownName;
    // @ts-expect-error invalid visual vocabulary is rejected
    const invalidSize: IconProps = { name: 'home', size: 'huge' };
    void invalidSize;
    // @ts-expect-error the info tone was removed; informational artwork uses accent
    const removedTone: IconProps = { name: 'home', tone: 'info' };
    void removedTone;
    // @ts-expect-error a decorative element must not be reachable by keyboard
    const focusable: IconProps = { name: 'home', tabIndex: 0 };
    void focusable;
    // @ts-expect-error role is derived from label and may not be contradicted
    const overriddenRole: IconProps = { name: 'home', role: 'button' };
    void overriddenRole;
    // @ts-expect-error aria-hidden is derived from label and may not be contradicted
    const overriddenHidden: IconProps = { 'aria-hidden': false, name: 'home' };
    void overriddenHidden;
    // @ts-expect-error the accessible name is supplied through label
    const overriddenLabel: IconProps = { 'aria-label': 'Home', name: 'home' };
    void overriddenLabel;
    // @ts-expect-error the glyph comes from name, never from children
    const withChildren: IconProps = { children: 'x', name: 'home' };
    void withChildren;
  });
});
